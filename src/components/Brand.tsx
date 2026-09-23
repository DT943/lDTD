import { Plane } from "lucide-react";

export function Brand({ small = false }: { small?: boolean }) {
  return (
    <span className={`brand ${small ? "brand-small" : ""}`}>
      <Plane aria-hidden="true" className="brand-mark" strokeWidth={1.2} />
      <span>FlyCham</span>
    </span>
  );
}
