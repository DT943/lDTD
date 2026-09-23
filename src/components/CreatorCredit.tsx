import { Heart } from "lucide-react";

export default function CreatorCredit() {
  return (
    <span className="creator-credit">
      <Heart size={12} strokeWidth={1.4} aria-hidden="true" />
      <span>
        Thoughtfully crafted by <em>Julian</em>
      </span>
    </span>
  );
}
