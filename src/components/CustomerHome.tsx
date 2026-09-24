import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Coins,
  Diamond,
  MapPin,
  Plane,
} from "lucide-react";
import { images, member, benefits, destinations } from "../data/mockData";
import type { Benefit, Navigate } from "../data/mockData";
import { Counter } from "./Primitives";
import CardExperience from "./CardExperience";
import Reveal from "./Reveal";

const featuredBenefits = [benefits[2], benefits[1], benefits[0]];

export default function CustomerHome({
  navigate,
  points,
  rewardClaimed,
  onProfile,
  onDestination,
  onUnlock,
  unlocked,
}: {
  navigate: Navigate;
  points: number;
  rewardClaimed: boolean;
  onProfile: () => void;
  onDestination: (index: number) => void;
  onUnlock: (benefit: Benefit) => void;
  unlocked: string[];
}) {
  return (
    <main className="home-page page-container luxury-home">
      <section className="home-intro">
        <Reveal className="home-greeting">
          <h1 tabIndex={-1}>
            Welcome back,
            <br />
            <em>{member.firstName}.</em>
          </h1>
          <p>Your next chapter looks extraordinary.</p>
          <div className="hero-actions">
            <button
              className="button button-gold"
              onClick={() => navigate("benefits")}
            >
              Explore my privileges <ArrowRight size={17} />
            </button>
            <button className="text-link" onClick={onProfile}>
              View my membership
            </button>
          </div>
        </Reveal>
        <Reveal className="membership-wrap" delay={0.12}>
          <CardExperience points={points} onProfile={onProfile} />
        </Reveal>
      </section>
      <Reveal>
        <section
          className="membership-summary"
          aria-label="Your membership at a glance"
        >
          {[
            { Icon: Plane, value: member.flights, label: "Flights" },
            { Icon: MapPin, value: member.destinations, label: "Destinations" },
            { Icon: Coins, value: member.earned, label: "Points earned" },
          ].map(({ Icon, value, label }) => (
            <div key={label}>
              <Icon size={25} strokeWidth={1.3} />
              <span>
                <strong>
                  <Counter value={value} />
                </strong>
                <small>{label}</small>
              </span>
            </div>
          ))}
          <button
            onClick={() => navigate("journey")}
            aria-label="Explore your Platinum loyalty journey"
          >
            <Diamond size={27} strokeWidth={1.2} />
            <span>
              <strong>{member.tier}</strong>
              <small>Highest tier unlocked</small>
            </span>
            <ArrowUpRight size={15} />
          </button>
        </section>
      </Reveal>
      <Reveal className="home-horizon">
        <div className="section-heading">
          <h2>
            Next on your <em>horizon.</em>
          </h2>
        </div>
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
            <span className="trip-card-body">
              <span className="trip-card-heading">Your upcoming trip</span>
              <span className="trip-route">
                Beirut <ArrowRight strokeWidth={1.1} /> Dubai
              </span>
              <span className="trip-card-meta">
                12 Nov 2026 <span>·</span> 3 days <span>·</span> Economy
              </span>
              <span className="button button-gold">
                View trip <ArrowRight size={17} />
              </span>
            </span>
          </button>
          <div
            className={`home-reward ${rewardClaimed ? "reward-is-claimed" : ""}`}
          >
            <div className="gift-display" aria-hidden="true">
              <img src={images.gift} alt="" />
            </div>
            <div className="home-reward-content">
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
                  ? "Your 500 bonus points are ready."
                  : "500 bonus points are waiting."}
              </p>
              <button
                className="button button-gold"
                onClick={() => navigate("reward")}
              >
                {rewardClaimed ? "View my reward" : "Reveal my reward"}
                {rewardClaimed ? <Check size={17} /> : <ArrowRight size={17} />}
              </button>
            </div>
          </div>
        </section>
      </Reveal>
      <Reveal className="home-benefits">
        <div className="section-heading">
          <h2>
            Privileges, <em>beautifully considered.</em>
          </h2>
          <button className="text-link" onClick={() => navigate("benefits")}>
            Explore all benefits <ArrowRight size={17} />
          </button>
        </div>
        <div className="privilege-gallery">
          {featuredBenefits.map((benefit) => (
            <button
              className="privilege-photo image-card"
              key={benefit.id}
              onClick={() => onUnlock(benefit)}
              aria-label={`${unlocked.includes(benefit.id) ? "View pass for" : "Unlock"} ${benefit.title}`}
            >
              <img
                src={benefit.id === "boarding" ? images.cabin : benefit.image}
                alt=""
                loading="lazy"
              />
              <span className="image-shade" />
              {unlocked.includes(benefit.id) && (
                <span className="photo-unlocked">
                  <Check size={12} /> Unlocked
                </span>
              )}
              <span className="photo-label">
                {benefit.title}
                <ArrowUpRight size={20} />
              </span>
            </button>
          ))}
        </div>
      </Reveal>
      <Reveal className="home-destinations">
        <div className="section-heading">
          <h2>
            Every place. <em>A part of you.</em>
          </h2>
          <button className="text-link" onClick={() => navigate("passport")}>
            Open travel passport <ArrowRight size={17} />
          </button>
        </div>
        <div className="destination-gallery">
          {destinations.map((destination, index) => (
            <button
              className="destination-postcard image-card"
              key={destination.code}
              onClick={() => onDestination(index)}
              aria-label={`Explore ${destination.name} in your travel passport`}
            >
              <img src={destination.image} alt="" loading="lazy" />
              <span className="image-shade" />
              <span className="photo-label">
                <span>
                  {destination.name}
                  <small>{destination.country}</small>
                </span>
                <ArrowRight size={18} />
              </span>
            </button>
          ))}
        </div>
      </Reveal>
    </main>
  );
}
