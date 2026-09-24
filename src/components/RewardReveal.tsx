import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Coins, Check } from "lucide-react";
import { images } from "../data/mockData";
import { useExperienceMotion } from "./ExperienceMotion";
import { Particles } from "./CinematicBackground";
import { BackButton } from "./Primitives";
import type { Navigate } from "../data/mockData";

export default function RewardReveal({
  claimed,
  onReveal,
  navigate,
}: {
  claimed: boolean;
  onReveal: () => void;
  navigate: Navigate;
}) {
  const { enabled } = useExperienceMotion();
  return (
    <main className="page-container reward-page">
      <BackButton navigate={navigate} />
      <section className={`reward-stage ${claimed ? "is-revealed" : ""}`}>
        <Particles celebration={claimed} />
        <div className="reward-heading">
          <h1 tabIndex={-1}>
            You've unlocked
            <br />
            <em>something special.</em>
          </h1>
          <p>
            {claimed
              ? "A little thank you for the journeys we share."
              : "Some journeys come with a little extra."}
          </p>
        </div>
        <AnimatePresence mode="wait">
          {!claimed ? (
            <motion.div
              key="gift"
              className="gift-wrap"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.15, filter: "blur(10px)" }}
            >
              <div className="gift-aura" />
              <motion.button
                className="gift-card gift-sculpture"
                onClick={onReveal}
                whileHover={enabled ? { rotate: 0, y: -8 } : {}}
                whileTap={enabled ? { scale: 0.97 } : {}}
                aria-label="Open your surprise reward"
              >
                <img
                  src={images.gift}
                  alt="A sculpted champagne-gold gift box"
                />
              </motion.button>
              <button className="text-link" onClick={onReveal}>
                Tap to reveal your reward <ArrowRight size={17} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="revealed"
              className="revealed-reward"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 17 }}
            >
              <div className="reward-coin">
                <Coins size={37} strokeWidth={1.25} />
              </div>
              <strong className="bonus-number">500</strong>
              <span className="tracking-label bonus-label">Bonus points</span>
              <p>Valid for your next booking</p>
              <span className="reward-added" role="status">
                <Check size={15} />
                Added to your points
              </span>
              <button
                className="button button-gold"
                onClick={() => navigate("home")}
              >
                View my points <ArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <span className="reward-signoff">
          A world of recognition. A little more possibility.
        </span>
      </section>
    </main>
  );
}
