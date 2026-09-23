import { Nfc as Contactless, Plane } from "lucide-react";
import { Brand } from "./Brand";
import { Counter } from "./Primitives";
import { member } from "../data/mockData";

export default function MembershipCard({ points }: { points: number }) {
  return (
    <div className="membership-card">
      <div className="card-orbit card-orbit-one" />
      <div className="card-orbit card-orbit-two" />
      <div className="membership-top">
        <Brand small />
        <Contactless size={30} strokeWidth={1.3} />
      </div>
      <div className="membership-points">
        <span className="tracking-label">Silver member</span>
        <strong>
          <Counter value={points} />
        </strong>
        <span className="tracking-label points-label">Points</span>
      </div>
      <div className="membership-bottom">
        <div>
          <span>{member.name}</span>
          <small>{member.number}</small>
        </div>
        <Plane size={36} strokeWidth={0.8} />
      </div>
    </div>
  );
}
