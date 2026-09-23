import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  Plane,
  Coins,
  MapPin,
  Globe2,
  Plus,
  Minus,
} from "lucide-react";
import { destinations } from "../data/mockData";
import { worldPath } from "../data/world";
import { PageHeading } from "./Primitives";

export default function TravelPassport() {
  const [selected, setSelected] = useState(0);
  const [zoom, setZoom] = useState(false);
  const destination = destinations[selected];
  return (
    <main className="page-container passport-page">
      <PageHeading
        title="Your"
        accent="Travel Passport"
        subtitle="Collect memories. Earn points."
      />
      <section className="passport-layout">
        <div className="world-map">
          <div className="map-caption">
            <span className="map-dot" />
            Your world, one journey at a time
          </div>
          <svg
            className="map-svg"
            viewBox={zoom ? "350 40 440 290" : "0 0 1000 490"}
            aria-label="World map with visited destinations"
            role="group"
          >
            <defs>
              <pattern
                id="map-dots"
                width="5"
                height="5"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1" fill="#476277" />
              </pattern>
              <clipPath id="world-land">
                <path d={worldPath} />
              </clipPath>
            </defs>
            <g clipPath="url(#world-land)">
              <rect width="1000" height="500" fill="url(#map-dots)" />
            </g>
            <g
              className="map-routes"
              fill="none"
              stroke="#bfa16a"
              strokeWidth="1.1"
              strokeDasharray="3 5"
            >
              {destinations
                .filter((d) => d.name !== "Beirut")
                .map((d) => (
                  <path
                    key={d.name}
                    d={`M598.7,156.9 Q${(598.7 + d.x) / 2},${Math.min(d.y, 156.9) - 80} ${d.x},${d.y}`}
                  />
                ))}
            </g>
            {destinations.map((d, index) => (
              <g
                key={d.name}
                role="button"
                tabIndex={0}
                aria-label={`Explore ${d.name}`}
                aria-pressed={selected === index}
                className={`map-pin ${selected === index ? "selected" : ""}`}
                onClick={() => setSelected(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelected(index);
                  }
                }}
              >
                <circle
                  className="pin-target"
                  cx={d.x}
                  cy={d.y}
                  r="17"
                  fill="transparent"
                />
                <circle className="pin-halo" cx={d.x} cy={d.y} r="12" />
                <circle className="pin-outer" cx={d.x} cy={d.y} r="5" />
                <circle cx={d.x} cy={d.y} r="1.7" fill="#080e18" />
                <text x={d.x + d.labelX} y={d.y + d.labelY} textAnchor="middle">
                  {d.name}
                </text>
              </g>
            ))}
          </svg>
          <div className="map-controls">
            <button
              className="icon-button"
              aria-label={
                zoom ? "Zoom out to world" : "Zoom in to destinations"
              }
              onClick={() => setZoom(!zoom)}
            >
              {zoom ? <Minus size={18} /> : <Plus size={18} />}
            </button>
            <span>{zoom ? "Destinations" : "World view"}</span>
          </div>
          <div className="destination-tabs" aria-label="Visited destinations">
            {destinations.map((d, i) => (
              <button
                aria-pressed={selected === i}
                className={selected === i ? "active" : ""}
                key={d.name}
                onClick={() => setSelected(i)}
              >
                <MapPin size={13} />
                {d.name}
              </button>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.article
            key={destination.name}
            className="destination-detail"
            aria-live="polite"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.18 }}
          >
            <div className="destination-photo">
              <img
                src={destination.image}
                alt={`${destination.name}, ${destination.country}`}
              />
              <span className="destination-stamp">
                {destination.code}
                <small>Visited</small>
              </span>
            </div>
            <div className="destination-body">
              <span className="tracking-label">{destination.country}</span>
              <h2>{destination.name}</h2>
              <p>{destination.note}</p>
              <div className="destination-facts">
                <span>
                  <Plane size={19} />
                  <strong>{destination.trips} trips</strong>
                </span>
                <span>
                  <Coins size={19} />
                  <strong>
                    {destination.points.toLocaleString()} points earned
                  </strong>
                </span>
                <span>
                  <CalendarDays size={19} />
                  <span>
                    <small>Last visit</small>
                    <strong>{destination.lastVisit}</strong>
                  </span>
                </span>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </section>
      <section className="passport-stats">
        {[
          { Icon: Plane, value: 12, label: "Journeys" },
          { Icon: MapPin, value: 8, label: "Destinations" },
          { Icon: Globe2, value: 4, label: "Continents" },
        ].map(({ Icon, value, label }) => (
          <div key={label}>
            <Icon size={29} strokeWidth={1.2} />
            <span>
              <strong>{value}</strong>
              <small>{label}</small>
            </span>
          </div>
        ))}
      </section>
      <p className="page-footnote">
        A few favourite chapters from your travel story.
      </p>
    </main>
  );
}
