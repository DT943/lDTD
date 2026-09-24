import { useEffect, useRef, useState } from "react";
import {
  Home,
  Gift,
  Route,
  Ellipsis,
  ChevronDown,
  Globe2,
  Plane,
  Sparkles,
  ArrowUpRight,
  Pause,
  Play,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Brand } from "./Brand";
import ThemeToggle from "./ThemeToggle";
import { useExperienceMotion } from "./ExperienceMotion";
import { member } from "../data/mockData";
import type { Navigate, Page } from "../data/mockData";

const navigation = [
  { id: "home", label: "Home", icon: Home },
  { id: "benefits", label: "Benefits", icon: Gift },
  { id: "journey", label: "Journey", icon: Route },
] as const;
const moreNavigation = [
  {
    id: "passport",
    label: "Travel passport",
    description: "The places that stay with you",
    icon: Globe2,
  },
  {
    id: "trip",
    label: "My next trip",
    description: "A new chapter awaits",
    icon: Plane,
  },
  {
    id: "reward",
    label: "My rewards",
    description: "A little something special",
    icon: Gift,
  },
  {
    id: "final",
    label: "A world of possibilities",
    description: "Always with you",
    icon: Sparkles,
  },
] as const;

export default function BottomNavigation({
  page,
  navigate,
  onProfile,
}: {
  page: Page;
  navigate: Navigate;
  onProfile: () => void;
}) {
  const [moreOpen, setMoreOpen] = useState(false);
  const motionPreference = useExperienceMotion();
  const menu = useRef<HTMLDivElement>(null);
  const moreButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!moreOpen) return;
    const close = (event: PointerEvent) => {
      if (
        !menu.current?.contains(event.target as Node) &&
        !(event.target as Element).closest("[data-more-toggle]")
      )
        setMoreOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMoreOpen(false);
        moreButton.current?.focus();
      }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, [moreOpen]);
  function go(next: Page) {
    setMoreOpen(false);
    navigate(next);
  }
  const isMore = !navigation.some((item) => item.id === page);
  return (
    <>
      <header className="app-header">
        <button
          className="brand-button"
          aria-label="FlyCham home"
          onClick={() => go("home")}
        >
          <Brand />
        </button>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <button
              key={item.id}
              className={page === item.id ? "active" : ""}
              onClick={() => go(item.id)}
              aria-current={page === item.id ? "page" : undefined}
            >
              {page === item.id && (
                <motion.span
                  className="nav-active-pill"
                  layoutId="desktop-navigation"
                  transition={{ type: "spring", stiffness: 360, damping: 32 }}
                />
              )}
              {item.label}
            </button>
          ))}
          <button
            data-more-toggle
            className={isMore || moreOpen ? "active" : ""}
            onClick={(event) => {
              moreButton.current = event.currentTarget;
              setMoreOpen(!moreOpen);
            }}
            aria-expanded={moreOpen}
            aria-controls="more-menu"
          >
            More <ChevronDown size={14} />
          </button>
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <button
            className="profile-button"
            aria-label={`View ${member.name}'s membership`}
            onClick={onProfile}
          >
            {member.initials}
            <span className="profile-dot" />
          </button>
        </div>
      </header>
      <nav className="bottom-navigation" aria-label="Mobile navigation">
        {navigation.map((item) => (
          <button
            key={item.id}
            className={page === item.id ? "active" : ""}
            onClick={() => go(item.id)}
            aria-current={page === item.id ? "page" : undefined}
          >
            <item.icon size={21} strokeWidth={1.6} />
            <span>{item.label}</span>
          </button>
        ))}
        <button
          data-more-toggle
          className={isMore || moreOpen ? "active" : ""}
          onClick={(event) => {
            moreButton.current = event.currentTarget;
            setMoreOpen(!moreOpen);
          }}
          aria-expanded={moreOpen}
          aria-controls="more-menu"
        >
          <Ellipsis size={23} />
          <span>More</span>
        </button>
      </nav>
      <AnimatePresence>
        {moreOpen && (
          <motion.div
            ref={menu}
            id="more-menu"
            className="more-menu"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            <p className="tracking-label">Your world</p>
            {moreNavigation.map((item) => (
              <button key={item.id} onClick={() => go(item.id)}>
                <item.icon size={20} strokeWidth={1.5} />
                <span>
                  {item.label}
                  <small>{item.description}</small>
                </span>
                <ArrowUpRight size={16} />
              </button>
            ))}
            <button
              className="motion-control"
              onClick={motionPreference.toggle}
              aria-pressed={!motionPreference.enabled}
            >
              {motionPreference.enabled ? (
                <Pause size={18} />
              ) : (
                <Play size={18} />
              )}
              <span>
                {motionPreference.enabled
                  ? "Pause animations"
                  : "Resume animations"}
                <small>Make your experience comfortable</small>
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
