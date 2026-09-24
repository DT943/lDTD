import { useState } from "react";
import type { PointerEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Diamond, RotateCw } from "lucide-react";
import { member } from "../data/mockData";
import MembershipCard from "./MembershipCard";
import { Brand } from "./Brand";
import { useExperienceMotion } from "./ExperienceMotion";

export default function CardExperience({
  points,
  onProfile,
}: {
  points: number;
  onProfile: () => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const { enabled } = useExperienceMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [10, -10]), {
    stiffness: 150,
    damping: 24,
  });
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-13, 13]), {
    stiffness: 150,
    damping: 24,
  });
  const shine = useTransform(pointerX, [-0.5, 0.5], ["-35%", "35%"]);
  function move(event: PointerEvent<HTMLDivElement>) {
    if (!enabled || event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - box.left) / box.width - 0.5);
    pointerY.set((event.clientY - box.top) / box.height - 0.5);
  }
  function reset() {
    pointerX.set(0);
    pointerY.set(0);
  }
  return (
    <div className="card-experience">
      <div className="card-orbital-ring" aria-hidden="true" />
      <div className="card-ground-shadow" aria-hidden="true" />
      <div
        className="card-perspective"
        onPointerMove={move}
        onPointerLeave={reset}
      >
        <motion.div
          className="card-tilt"
          style={{
            rotateX: enabled ? rotateX : 0,
            rotateY: enabled ? rotateY : 0,
          }}
        >
          <motion.div
            className="card-rotator"
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{
              duration: enabled ? 0.85 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div
              className="card-face card-face-front"
              aria-hidden={flipped}
              inert={flipped}
            >
              <MembershipCard points={points} />
              <motion.div
                className="card-specular"
                style={{ x: enabled ? shine : 0 }}
                aria-hidden="true"
              />
            </div>
            <div
              className="card-face card-face-back"
              aria-hidden={!flipped}
              inert={!flipped}
            >
              <Brand small />
              <Diamond
                className="card-back-diamond"
                size={42}
                strokeWidth={0.8}
              />
              <p>
                A world of recognition.
                <br />
                <em>Always with you.</em>
              </p>
              <span>
                {member.name} · {member.tier}
              </span>
              <button onClick={onProfile}>
                View my membership <ArrowUpRight size={15} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <button
        className="card-turn"
        onClick={() => setFlipped((value) => !value)}
        aria-pressed={flipped}
        aria-label="Turn membership card"
      >
        <RotateCw size={16} strokeWidth={1.4} />
        {flipped ? "Back to front" : "Turn card"}
      </button>
    </div>
  );
}
