import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Utensils,
  Plane,
  Armchair,
  Luggage,
  Coffee,
  Check,
  Ticket,
  Copy,
} from "lucide-react";
import { benefits } from "../data/mockData";
import type { Benefit } from "../data/mockData";
import { PageHeading } from "./Primitives";
import Modal from "./Modal";
import { Brand } from "./Brand";

const icons = {
  dining: Utensils,
  boarding: Plane,
  lounge: Armchair,
  baggage: Luggage,
  coffee: Coffee,
};
const filters = [
  "All privileges",
  "At the airport",
  "In the air",
  "Lifestyle",
] as const;

export function BenefitPass({
  benefit,
  onClose,
}: {
  benefit: Benefit;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(benefit.code);
      setCopied(true);
      setCopyFailed(false);
    } catch {
      setCopyFailed(true);
    }
  }
  return (
    <Modal title="A little privilege, all yours." onClose={onClose}>
      <div className="benefit-pass">
        <img src={benefit.image} alt="" />
        <div className="pass-content">
          <Brand small />
          <span className="pass-status">
            <Check size={13} /> Unlocked
          </span>
          <h3>{benefit.title}</h3>
          <p>{benefit.detail}</p>
          <div className="pass-code">
            <Ticket size={24} />
            <span>
              <small>Your member pass</small>
              <strong>{benefit.code}</strong>
            </span>
            <button
              className="icon-button"
              onClick={copy}
              aria-label="Copy member pass code"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
          <p className="pass-validity">{benefit.validity}</p>
          <p className="sr-only" role="status">
            {copied ? "Member pass code copied" : ""}
            {copyFailed
              ? `Copy unavailable. Your pass code is ${benefit.code}.`
              : ""}
          </p>
          {copyFailed && (
            <p className="text-sm text-gold">
              Select the pass code above to copy it.
            </p>
          )}
        </div>
      </div>
      <button className="button button-gold w-full" onClick={onClose}>
        Back to my benefits <Check size={17} />
      </button>
    </Modal>
  );
}

export default function Benefits({
  unlocked,
  onUnlock,
}: {
  unlocked: string[];
  onUnlock: (benefit: Benefit) => void;
}) {
  const [filter, setFilter] = useState<string>("All privileges");
  const shown = benefits.filter(
    (benefit) => filter === "All privileges" || benefit.category === filter,
  );
  return (
    <main className="page-container benefits-page">
      <PageHeading
        title="Exclusive"
        accent="Benefits"
        subtitle="Extraordinary journeys. Thoughtful privileges."
      />
      <div className="filter-row" aria-label="Filter benefits">
        {filters.map((item) => (
          <button
            key={item}
            aria-pressed={filter === item}
            className={filter === item ? "active" : ""}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <motion.div layout className="benefits-grid">
        <AnimatePresence mode="popLayout">
          {shown.map((benefit, index) => {
            const Icon = icons[benefit.icon];
            const isUnlocked = unlocked.includes(benefit.id);
            return (
              <motion.article
                layout
                key={benefit.id}
                className={`benefit-card ${index > 2 && filter === "All privileges" ? "benefit-wide" : ""}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3, delay: index * 0.035 }}
              >
                <div className="benefit-photo">
                  <img
                    src={benefit.image}
                    alt={
                      benefit.title === "20% Dining Discount"
                        ? "A beautifully plated meal in an intimate restaurant"
                        : benefit.title
                    }
                    loading="lazy"
                  />
                  <span className="benefit-category">{benefit.category}</span>
                  {isUnlocked && (
                    <span className="unlocked-badge">
                      <Check size={12} /> Unlocked
                    </span>
                  )}
                </div>
                <div className="benefit-card-body">
                  <Icon size={24} strokeWidth={1.4} />
                  <h2>{benefit.title}</h2>
                  <p>{benefit.description}</p>
                  <button
                    className="button button-outline"
                    onClick={() => onUnlock(benefit)}
                  >
                    {isUnlocked ? "View my pass" : "Unlock"}
                    {isUnlocked ? (
                      <Ticket size={16} />
                    ) : (
                      <ArrowUpRight size={17} />
                    )}
                  </button>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>
      <p className="page-footnote">
        Thoughtfully selected for your Silver membership.
      </p>
    </main>
  );
}
