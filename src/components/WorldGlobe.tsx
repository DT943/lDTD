import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { destinations } from "../data/mockData";
import { worldPath } from "../data/world";
import { useExperienceMotion } from "./ExperienceMotion";

type Point = [number, number, number];
let landPoints: Point[] | undefined;
const tau = Math.PI * 2;
function sphere(longitude: number, latitude: number): Point {
  return [
    Math.cos(latitude) * Math.sin(longitude),
    Math.sin(latitude),
    Math.cos(latitude) * Math.cos(longitude),
  ];
}
const locations = destinations.map((d) =>
  sphere((d.x / 1000 - 0.5) * tau, (0.5 - d.y / 500) * Math.PI),
);
// Geometry is static; only its projection changes while the globe turns.
const gridCurves: Point[][] = [
  ...Array.from({ length: 5 }, (_, latitude) =>
    Array.from({ length: 121 }, (_, i) =>
      sphere((i / 120) * tau, ((latitude - 2) * Math.PI) / 6),
    ),
  ),
  ...Array.from({ length: 12 }, (_, longitude) =>
    Array.from({ length: 61 }, (_, i) =>
      sphere((longitude * Math.PI) / 6, (i / 60 - 0.5) * Math.PI),
    ),
  ),
];
const flightRoutes = locations.slice(0, 3).map((destination) =>
  Array.from({ length: 61 }, (_, step) => {
    const t = step / 60;
    const point = locations[3].map(
      (value, axis) => value * (1 - t) + destination[axis] * t,
    ) as Point;
    const length = Math.hypot(...point);
    return {
      point: point.map((value) => value / length) as Point,
      elevation: 1 + Math.sin(t * Math.PI) * 0.15,
    };
  }),
);

// Sample the bundled geographic mask once, then place land points on a real sphere.
function getLandPoints(): Point[] {
  if (landPoints) return landPoints;
  const mask = document.createElement("canvas");
  mask.width = 1000;
  mask.height = 500;
  const ctx = mask.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];
  ctx.fill(new Path2D(worldPath));
  const pixels = ctx.getImageData(0, 0, 1000, 500).data;
  const points: Point[] = [];
  for (let i = 0; i < 28000; i++) {
    const latitude = Math.asin(1 - (2 * (i + 0.5)) / 28000);
    const longitude = ((i * Math.PI * (3 - Math.sqrt(5))) % tau) - Math.PI;
    const x = Math.min(999, Math.floor((longitude / tau + 0.5) * 1000));
    const y = Math.min(499, Math.floor((0.5 - latitude / Math.PI) * 500));
    if (pixels[(y * 1000 + x) * 4 + 3] > 80)
      points.push(sphere(longitude, latitude));
  }
  landPoints = points;
  return points;
}

export default function WorldGlobe({ selected }: { selected: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const { enabled } = useExperienceMotion();
  const selectedRef = useRef(selected);
  const view = useRef({
    yaw: -0.42,
    pitch: 0.35,
    targetYaw: -0.42,
    targetPitch: 0.35,
  });
  const requestDraw = useRef(() => {});
  useEffect(() => {
    selectedRef.current = selected;
    view.current.targetYaw =
      -(destinations[selected].x / 1000 - 0.5) * tau + 0.08;
    view.current.targetPitch =
      (0.5 - destinations[selected].y / 500) * Math.PI * 0.6;
    requestDraw.current();
  }, [selected]);
  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;
    const ctx = context;
    const points = getLandPoints();
    let width = 0,
      height = 0,
      frame = 0,
      previous = 0;
    let visible = true,
      dark = document.documentElement.dataset.theme === "dark";
    let drag: { x: number; y: number; yaw: number; pitch: number } | null =
      null;
    const schedule = () => {
      if (!frame && visible && !document.hidden)
        frame = requestAnimationFrame(draw);
    };
    requestDraw.current = schedule;
    function draw(time: number, force = false) {
      frame = 0;
      if ((!visible && !force) || document.hidden || width === 0) return;
      if (!force && enabled && time - previous < 30) {
        schedule();
        return;
      }
      previous = time;
      const v = view.current;
      const distance =
        Math.abs(v.targetYaw - v.yaw) + Math.abs(v.targetPitch - v.pitch);
      v.yaw += (v.targetYaw - v.yaw) * (enabled ? 0.12 : 1);
      v.pitch += (v.targetPitch - v.pitch) * (enabled ? 0.12 : 1);
      const cy = Math.cos(v.yaw),
        sy = Math.sin(v.yaw),
        cp = Math.cos(v.pitch),
        sp = Math.sin(v.pitch);
      const r = Math.min(width * 0.43, height * 0.46),
        cx = width / 2,
        centerY = height * 0.49;
      function project(p: Point, elevation = 1) {
        const x = p[0] * cy + p[2] * sy;
        const z = -p[0] * sy + p[2] * cy;
        const y = p[1] * cp - z * sp;
        const depth = p[1] * sp + z * cp;
        return {
          x: cx + x * r * elevation,
          y: centerY - y * r * elevation,
          z: depth,
        };
      }
      ctx.clearRect(0, 0, width, height);
      const atmosphere = ctx.createRadialGradient(
        cx,
        centerY,
        r * 0.91,
        cx,
        centerY,
        r * 1.11,
      );
      atmosphere.addColorStop(0, "transparent");
      atmosphere.addColorStop(0.45, dark ? "#7bafd326" : "#a0b3c330");
      atmosphere.addColorStop(0.65, dark ? "#77a7d014" : "#a0b3c316");
      atmosphere.addColorStop(1, "transparent");
      ctx.fillStyle = atmosphere;
      ctx.beginPath();
      ctx.arc(cx, centerY, r * 1.12, 0, tau);
      ctx.fill();
      const ocean = ctx.createRadialGradient(
        cx - r * 0.4,
        centerY - r * 0.45,
        r * 0.03,
        cx + r * 0.18,
        centerY + r * 0.12,
        r * 1.15,
      );
      ocean.addColorStop(0, dark ? "#2b4152" : "#eff3f3");
      ocean.addColorStop(0.45, dark ? "#111f2f" : "#dce5e9");
      ocean.addColorStop(0.8, dark ? "#091321" : "#a6b8c7");
      ocean.addColorStop(1, dark ? "#030810" : "#566c83");
      ctx.fillStyle = ocean;
      ctx.beginPath();
      ctx.arc(cx, centerY, r, 0, tau);
      ctx.fill();
      ctx.strokeStyle = dark ? "#8baccc70" : "#627e9760";
      ctx.lineWidth = 0.9;
      ctx.stroke();
      // Latitude and longitude curves are projected and clipped to the front hemisphere.
      ctx.strokeStyle = dark ? "#8ba9bd22" : "#64778b30";
      ctx.lineWidth = 0.55;
      const curve = (path: Point[]) => {
        ctx.beginPath();
        let open = false;
        for (const point of path) {
          const p = project(point);
          if (p.z < 0) {
            open = false;
            continue;
          }
          if (open) ctx.lineTo(p.x, p.y);
          else ctx.moveTo(p.x, p.y);
          open = true;
        }
        ctx.stroke();
      };
      gridCurves.forEach(curve);
      ctx.fillStyle = dark ? "#d1c3a2" : "#667586";
      for (const point of points) {
        const p = project(point);
        if (p.z <= 0.01) continue;
        ctx.globalAlpha = 0.18 + p.z * 0.7;
        const size = Math.max(0.55, r / 240) * (0.45 + p.z * 0.55);
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, tau);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      flightRoutes.forEach((geometry, index) => {
        const route = geometry.map(({ point, elevation }) =>
          project(point, elevation),
        );
        ctx.strokeStyle = dark ? "#dfbf7baa" : "#9a753dbb";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        let open = false;
        route.forEach((p) => {
          if (p.z < 0.05) {
            open = false;
            return;
          }
          if (open) ctx.lineTo(p.x, p.y);
          else ctx.moveTo(p.x, p.y);
          open = true;
        });
        ctx.stroke();
        const point =
          route[
            Math.floor(((enabled ? time / 5500 + index / 3 : 0.5) % 1) * 60)
          ];
        if (point.z > 0.05) {
          ctx.fillStyle = dark ? "#fff0be" : "#87652e";
          ctx.beginPath();
          ctx.arc(point.x, point.y, 2.2, 0, tau);
          ctx.fill();
        }
      });
      locations.forEach((location, index) => {
        const point = project(location, 1.005);
        if (point.z < 0.1) return;
        const active = selectedRef.current === index;
        ctx.strokeStyle = dark ? "#e8c88980" : "#87652e80";
        ctx.fillStyle = dark ? "#f7dfa5" : "#87652e";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(point.x, point.y, active ? 9 : 6, 0, tau);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(point.x, point.y, active ? 3.5 : 2.5, 0, tau);
        ctx.fill();
        const labels = [
          [-13, -12],
          [12, 15],
          [12, -17],
          [-13, 18],
        ];
        ctx.font = `${active ? "500" : "400"} ${width < 400 ? 10 : 12}px "DM Sans", sans-serif`;
        ctx.textAlign = labels[index][0] < 0 ? "right" : "left";
        ctx.lineWidth = 4;
        ctx.lineJoin = "round";
        ctx.strokeStyle = dark ? "#101b29" : "#dce5e9";
        ctx.strokeText(
          destinations[index].name,
          point.x + labels[index][0],
          point.y + labels[index][1],
        );
        ctx.fillStyle = dark ? "#f0e7d5" : "#23313e";
        ctx.fillText(
          destinations[index].name,
          point.x + labels[index][0],
          point.y + labels[index][1],
        );
      });
      if (enabled || distance > 0.001) schedule();
    }
    const resize = new ResizeObserver((entries) => {
      width = entries[0].contentRect.width;
      height = entries[0].contentRect.height;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      element.width = Math.round(width * dpr);
      element.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Resizing clears a canvas. Restore a frame even while offscreen so that
      // responsive layout changes and full-page captures never leave it blank.
      cancelAnimationFrame(frame);
      draw(performance.now(), true);
    });
    resize.observe(element);
    const visibility = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible) schedule();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    visibility.observe(element);
    const theme = new MutationObserver(() => {
      dark = document.documentElement.dataset.theme === "dark";
      schedule();
    });
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    const visibilityChange = () => {
      if (!document.hidden) schedule();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };
    document.addEventListener("visibilitychange", visibilityChange);
    const down = (event: PointerEvent) => {
      drag = {
        x: event.clientX,
        y: event.clientY,
        yaw: view.current.targetYaw,
        pitch: view.current.targetPitch,
      };
      element.setPointerCapture(event.pointerId);
      element.classList.add("is-dragging");
    };
    const move = (event: PointerEvent) => {
      if (!drag) return;
      view.current.targetYaw = drag.yaw + (event.clientX - drag.x) * 0.008;
      if (event.pointerType === "mouse")
        view.current.targetPitch = Math.max(
          -1.15,
          Math.min(1.15, drag.pitch + (event.clientY - drag.y) * 0.005),
        );
      schedule();
    };
    const up = () => {
      drag = null;
      element.classList.remove("is-dragging");
    };
    element.addEventListener("pointerdown", down);
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerup", up);
    element.addEventListener("pointercancel", up);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      visibility.disconnect();
      theme.disconnect();
      document.removeEventListener("visibilitychange", visibilityChange);
      element.removeEventListener("pointerdown", down);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerup", up);
      element.removeEventListener("pointercancel", up);
      requestDraw.current = () => {};
    };
  }, [enabled]);
  function turn(amount: number) {
    view.current.targetYaw += amount;
    requestDraw.current();
  }
  function reset() {
    view.current.targetYaw = -0.42;
    view.current.targetPitch = 0.35;
    requestDraw.current();
  }
  return (
    <div className="globe-stage">
      <canvas
        ref={canvas}
        className="world-globe"
        role="img"
        aria-label="Three-dimensional globe with flight routes between Paris, Dubai, Istanbul and Beirut. Use the rotation controls or drag to explore."
      />
      <div className="globe-controls" aria-label="Globe rotation controls">
        <button
          className="icon-button"
          onClick={() => turn(-0.4)}
          aria-label="Rotate globe left"
        >
          <ChevronLeft size={17} />
        </button>
        <button
          className="icon-button"
          onClick={reset}
          aria-label="Reset globe view"
        >
          <RotateCcw size={15} />
        </button>
        <button
          className="icon-button"
          onClick={() => turn(0.4)}
          aria-label="Rotate globe right"
        >
          <ChevronRight size={17} />
        </button>
      </div>
      <p className="globe-hint">
        Drag to explore <span>·</span> Select a destination below
      </p>
    </div>
  );
}
