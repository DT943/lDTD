import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight, Diamond } from "lucide-react";
import { member } from "./data/mockData";
import type { Benefit, Page } from "./data/mockData";
import CustomerHome from "./components/CustomerHome";
import LoyaltyJourney from "./components/LoyaltyJourney";
import Benefits, { BenefitPass } from "./components/Benefits";
import NextTrip from "./components/NextTrip";
import RewardReveal from "./components/RewardReveal";
import FinalExperience from "./components/FinalExperience";
import BottomNavigation from "./components/BottomNavigation";
import CinematicBackground from "./components/CinematicBackground";
import MembershipCard from "./components/MembershipCard";
import Modal from "./components/Modal";
import CreatorCredit from "./components/CreatorCredit";

const pages = new Set<Page>([
  "home",
  "benefits",
  "journey",
  "passport",
  "trip",
  "reward",
  "final",
]);
const TravelPassport = lazy(() => import("./components/TravelPassport"));
function readPage(): Page {
  const value = window.location.hash.slice(1) as Page;
  return pages.has(value) ? value : "home";
}

export default function App() {
  const [page, setPage] = useState<Page>(readPage);
  const [claimed, setClaimed] = useState(false);
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [activePass, setActivePass] = useState<Benefit | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const reduced = useReducedMotion();
  const points = member.points + (claimed ? 500 : 0);
  const navigate = useCallback((next: Page) => {
    window.location.hash = next;
  }, []);
  useEffect(() => {
    const handleHash = () => {
      setPage(readPage());
      setActivePass(null);
      setProfileOpen(false);
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);
  function unlock(benefit: Benefit) {
    setUnlocked((previous) =>
      previous.includes(benefit.id) ? previous : [...previous, benefit.id],
    );
    setActivePass(benefit);
  }
  const screen =
    page === "home" ? (
      <CustomerHome
        navigate={navigate}
        points={points}
        rewardClaimed={claimed}
      />
    ) : page === "benefits" ? (
      <Benefits unlocked={unlocked} onUnlock={unlock} />
    ) : page === "journey" ? (
      <LoyaltyJourney points={points} navigate={navigate} />
    ) : page === "passport" ? (
      <Suspense
        fallback={
          <div
            className="page-container py-24 text-center text-muted"
            role="status"
          >
            Opening your travel passport…
          </div>
        }
      >
        <TravelPassport />
      </Suspense>
    ) : page === "trip" ? (
      <NextTrip navigate={navigate} onUnlock={unlock} unlocked={unlocked} />
    ) : page === "reward" ? (
      <RewardReveal
        claimed={claimed}
        onReveal={() => setClaimed(true)}
        navigate={navigate}
      />
    ) : (
      <FinalExperience navigate={navigate} />
    );
  return (
    <MotionConfig reducedMotion="user">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.querySelector<HTMLElement>("h1")?.focus();
        }}
      >
        Skip to content
      </a>
      <div className={`app-shell page-${page}`}>
        <CinematicBackground subtle />
        <BottomNavigation
          page={page}
          navigate={navigate}
          onProfile={() => setProfileOpen(true)}
        />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            id="main-content"
            key={page}
            initial={{ opacity: 0, y: reduced ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -8 }}
            transition={{ duration: reduced ? 0 : 0.23 }}
            onAnimationComplete={() => {
              if (window.location.hash)
                document
                  .querySelector<HTMLElement>("h1")
                  ?.focus({ preventScroll: true });
            }}
          >
            {screen}
          </motion.div>
        </AnimatePresence>
        {page === "final" ? (
          <footer className="final-footer">
            <CreatorCredit />
          </footer>
        ) : (
          <footer className="app-footer">
            <span>
              FlyCham Loyalty <span className="footer-separator">/</span> Tap
              into your world
            </span>
            <CreatorCredit />
            <button onClick={() => navigate("final")}>
              A world of possibilities <ArrowUpRight size={15} />
            </button>
          </footer>
        )}
      </div>
      {activePass && (
        <BenefitPass benefit={activePass} onClose={() => setActivePass(null)} />
      )}
      {profileOpen && (
        <Modal
          title={`Your world, ${member.firstName}.`}
          onClose={() => setProfileOpen(false)}
        >
          <MembershipCard points={points} />
          <div className="profile-summary">
            <Diamond size={18} />
            <span>{member.tier} member · Since March 2024</span>
          </div>
          <div className="detail-rows">
            <span>
              Member number<strong>{member.number}</strong>
            </span>
            <span>
              Available points<strong>{points.toLocaleString()}</strong>
            </span>
            <span>
              Unlocked privileges<strong>{unlocked.length}</strong>
            </span>
          </div>
          <button
            className="button button-gold w-full"
            onClick={() => {
              setProfileOpen(false);
              navigate("passport");
            }}
          >
            Open my travel passport <ArrowUpRight size={18} />
          </button>
        </Modal>
      )}
    </MotionConfig>
  );
}
