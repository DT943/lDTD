import {
  ArrowRight,
  CalendarDays,
  Gift,
  Luggage,
  MapPin,
  Plane,
  Star,
  Armchair,
  Coffee,
  ArrowUpRight,
  Diamond,
} from "lucide-react";
import { motion } from "framer-motion";
import { images, member } from "../data/mockData";
import type { Navigate } from "../data/mockData";
import MembershipCard from "./MembershipCard";
import GlassCard from "./GlassCard";
import { Counter, Progress, RoundArrow } from "./Primitives";

export default function CustomerHome({
  navigate,
  points,
  rewardClaimed,
}: {
  navigate: Navigate;
  points: number;
  rewardClaimed: boolean;
}) {
  return (
    <main className="home-page page-container">
      <section className="home-intro">
        <div className="home-greeting">
          <h1 tabIndex={-1}>
            Welcome back,
            <br />
            <em>{member.firstName}</em>
          </h1>
          <p>We remember your journey.</p>
          <button
            className="home-progress"
            onClick={() => navigate("journey")}
            aria-label="Explore your loyalty journey"
          >
            <div className="progress-copy">
              <span>Your {member.tier} world</span>
              <span className="platinum-status">
                <Diamond size={13} strokeWidth={1.4} /> Highest tier unlocked
              </span>
            </div>
            <Progress
              value={100}
              label={`${member.tier} membership achieved`}
            />
          </button>
          <div className="home-stats">
            {[
              { icon: Plane, value: 12, label: "Flights" },
              { icon: MapPin, value: 5, label: "Destinations" },
              { icon: Star, value: 2760, label: "Points earned" },
            ].map((stat) => (
              <div key={stat.label}>
                <stat.icon size={25} strokeWidth={1.4} />
                <span>
                  <strong>
                    <Counter value={stat.value} />
                  </strong>
                  <small>{stat.label}</small>
                </span>
              </div>
            ))}
          </div>
        </div>
        <motion.div
          className="membership-wrap"
          whileHover={{ y: -5, rotate: 1 }}
          transition={{ duration: 0.35 }}
        >
          <MembershipCard points={points} />
          <span className="card-caption">
            A world of recognition. Always with you.
          </span>
        </motion.div>
      </section>
      <section className="home-feature-grid">
        <button
          className="trip-card image-card"
          onClick={() => navigate("trip")}
          aria-label="View your upcoming trip from Beirut to Dubai"
        >
          <img
            src={images.dubai}
            alt="Dubai skyline glowing above the water at dusk"
          />
          <span className="image-shade" />
          <span className="trip-card-heading">Your Upcoming Trip</span>
          <span className="trip-card-body">
            <span className="trip-route">
              Beirut <ArrowRight strokeWidth={1.1} /> Dubai
            </span>
            <span className="trip-card-meta">
              <span>
                <CalendarDays size={17} />
                12 Nov 2026
              </span>
              <span>
                <Luggage size={17} />3 days · Economy
              </span>
            </span>
          </span>
          <span className="trip-card-caption">New cities. A brighter you.</span>
          <RoundArrow label="Explore trip" />
        </button>
        <GlassCard className="home-reward">
          <Gift size={40} strokeWidth={1.2} />
          <h2>
            {rewardClaimed ? (
              <>
                A little more
                <br />
                to look forward to.
              </>
            ) : (
              <>
                A little something,
                <br />
                just for you.
              </>
            )}
          </h2>
          <p>
            {rewardClaimed
              ? "Your 500 bonus points are ready for your next chapter."
              : "Your next journey starts with a surprise."}
          </p>
          <button
            className="button button-gold"
            onClick={() => navigate("reward")}
          >
            {rewardClaimed ? "View my reward" : "Reveal my reward"}
            <ArrowRight size={18} />
          </button>
          <span className="tracking-label">Loyalty brings more</span>
        </GlassCard>
      </section>
      <section className="home-benefits">
        <div className="section-heading">
          <h2>
            Your world, with <em>privileges</em>
          </h2>
          <button className="text-link" onClick={() => navigate("benefits")}>
            Explore all benefits <ArrowRight size={17} />
          </button>
        </div>
        <div className="benefit-rail">
          {[
            {
              icon: Armchair,
              title: "Lounge Access",
              subtitle: "A more relaxed you",
            },
            {
              icon: Luggage,
              title: "Extra Baggage",
              subtitle: "Room for more memories",
            },
            {
              icon: Plane,
              title: "Priority Boarding",
              subtitle: "Time is a privilege",
            },
            {
              icon: Coffee,
              title: "Airport Coffee",
              subtitle: "A perfect beginning",
            },
          ].map((benefit) => (
            <button
              className="benefit-mini"
              key={benefit.title}
              onClick={() => navigate("benefits")}
            >
              <benefit.icon size={30} strokeWidth={1.3} />
              <span>
                {benefit.title}
                <small>{benefit.subtitle}</small>
              </span>
              <ArrowUpRight size={16} className="mini-arrow" />
            </button>
          ))}
        </div>
      </section>
      <button className="passport-teaser" onClick={() => navigate("passport")}>
        <span>
          <MapPin size={19} />
          Every destination tells your story.
        </span>
        <span>
          Open your travel passport <ArrowRight size={17} />
        </span>
      </button>
    </main>
  );
}
