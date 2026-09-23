import { useState } from "react";
import {
  Check,
  Crown,
  Diamond,
  Navigation,
  Star,
  UserRound,
  ArrowRight,
  Armchair,
} from "lucide-react";
import { motion } from "framer-motion";
import { images, tierData } from "../data/mockData";
import type { Navigate } from "../data/mockData";
import { PageHeading, Progress } from "./Primitives";
import GlassCard from "./GlassCard";

const icons = [Navigation, UserRound, Star, Crown, Diamond];

export default function LoyaltyJourney({
  points,
  navigate,
}: {
  points: number;
  navigate: Navigate;
}) {
  const [selected, setSelected] = useState(2);
  const tier = tierData[selected];
  return (
    <main className="page-container journey-page">
      <PageHeading
        title="Your"
        accent="Loyalty Journey"
        subtitle="The more you fly, the more you get."
      />
      <section className="tier-timeline" aria-label="Membership tiers">
        <div className="tier-line">
          <div />
        </div>
        {tierData.map((item, i) => {
          const Icon = icons[i];
          return (
            <button
              key={item.name}
              className={`tier-stop ${i <= 2 ? "reached" : ""} ${i === 2 ? "current" : ""} ${i === selected ? "selected" : ""}`}
              onClick={() => setSelected(i)}
              aria-pressed={i === selected}
              aria-label={`${item.name}${i === 2 ? ", your current tier" : ""}, ${item.threshold.toLocaleString()} points`}
            >
              <span className="tier-icon">
                <Icon size={27} strokeWidth={1.3} />
              </span>
              <span>{item.name}</span>
              <small>
                {i === 2
                  ? "You are here"
                  : `${item.threshold.toLocaleString()} pts`}
              </small>
            </button>
          );
        })}
      </section>
      <GlassCard className="journey-progress">
        <div>
          <span>
            <span className="text-gold">{8000 - points}</span> points to Gold
          </span>
          <span>
            {points.toLocaleString("en-US")}{" "}
            <span className="text-muted">/ 8,000</span>
          </span>
        </div>
        <Progress points={points} />
        <p>Your next chapter is closer than you think.</p>
      </GlassCard>
      <motion.section
        key={tier.name}
        className="tier-detail"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <span className="tracking-label">
            {selected === 2
              ? "Your current world"
              : `The ${tier.name} experience`}
          </span>
          <h2>{tier.description}</h2>
        </div>
        <ul>
          {tier.perks.map((perk) => (
            <li key={perk}>
              <Check size={16} />
              {perk}
            </li>
          ))}
        </ul>
      </motion.section>
      <section className="upgrade-card image-card">
        <img
          src={images.cabin}
          alt="Spacious business class seats beside airplane windows"
        />
        <span className="image-shade" />
        <div className="upgrade-content">
          <span className="tracking-label">
            <Armchair size={18} />
            Your next reward
          </span>
          <h2>
            Business Class <em>Upgrade</em>
          </h2>
          <p>Fly in comfort. Add more value to your journey.</p>
          <button className="text-link" onClick={() => navigate("benefits")}>
            Discover your privileges <ArrowRight size={18} />
          </button>
        </div>
        <span className="upgrade-badge">
          <Crown size={16} />
          Waiting at Gold
        </span>
      </section>
    </main>
  );
}
