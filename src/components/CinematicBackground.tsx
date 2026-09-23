import { images } from "../data/mockData";

export default function CinematicBackground({
  subtle = false,
}: {
  subtle?: boolean;
}) {
  return (
    <div
      className={`cinematic-background ${subtle ? "cinematic-subtle" : ""}`}
      aria-hidden="true"
    >
      <img src={images.clouds} alt="" fetchPriority="high" />
      <div className="cinematic-fade" />
    </div>
  );
}

export function Particles({ celebration = false }: { celebration?: boolean }) {
  return (
    <div
      className={`particles ${celebration ? "celebration" : ""}`}
      aria-hidden="true"
    >
      {Array.from({ length: celebration ? 30 : 13 }, (_, i) => (
        <i
          key={i}
          style={{
            left: `${(i * 37 + 7) % 100}%`,
            top: `${(i * 23 + 11) % 100}%`,
            animationDelay: `${i * -0.73}s`,
            animationDuration: `${5 + (i % 5)}s`,
            width: i % 3 === 0 ? 3 : 2,
            height: celebration && i % 2 === 0 ? 8 : 2,
          }}
        />
      ))}
    </div>
  );
}
