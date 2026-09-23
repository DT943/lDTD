import { useState } from "react";
import {
  Plane,
  BedDouble,
  CalendarDays,
  Ellipsis,
  ArrowRight,
  Check,
  MapPin,
  Clock,
  Luggage,
  Armchair,
} from "lucide-react";
import { images, benefits, member } from "../data/mockData";
import type { Benefit, Navigate } from "../data/mockData";
import { BackButton } from "./Primitives";
import Modal from "./Modal";

type TripPanel = "flight" | "hotel" | "itinerary" | "more";
const panels = [
  { id: "flight", label: "Flight Details", Icon: Plane },
  { id: "hotel", label: "Hotel", Icon: BedDouble },
  { id: "itinerary", label: "Itinerary", Icon: CalendarDays },
  { id: "more", label: "More", Icon: Ellipsis },
] as const;

export default function NextTrip({
  navigate,
  onUnlock,
  unlocked,
}: {
  navigate: Navigate;
  onUnlock: (benefit: Benefit) => void;
  unlocked: string[];
}) {
  const [panel, setPanel] = useState<TripPanel | null>(null);
  const [saved, setSaved] = useState(false);
  return (
    <main className="page-container next-trip-page">
      <BackButton navigate={navigate} />
      <section className="destination-hero image-card">
        <img
          src={images.beirut}
          alt="The sun setting behind the Raouché sea rocks in Beirut, Lebanon"
        />
        <span className="image-shade" />
        <div className="destination-hero-top">
          <span className="tracking-label">Your next trip</span>
          <span className="trip-countdown">
            <Plane size={15} />A new chapter awaits
          </span>
        </div>
        <div className="destination-hero-content">
          <span className="tracking-label">Where your journey begins</span>
          <h1 tabIndex={-1}>
            Beirut, <em>Lebanon</em>
          </h1>
          <p>
            12 Nov 2026 <span>·</span> 3 Days <span>·</span> Economy
          </p>
          <div className="trip-actions">
            {panels.map(({ id, label, Icon }) => (
              <button onClick={() => setPanel(id)} key={id}>
                <span>
                  <Icon size={23} strokeWidth={1.4} />
                </span>
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="trip-special">
        <div className="special-photo">
          <img
            src={images.lounge}
            alt="Relaxing lounge with a beautiful view"
          />
        </div>
        <div>
          <span className="tracking-label">Special for you</span>
          <h2>Complimentary Lounge Access</h2>
          <p>Enjoy a relaxing experience before your flight.</p>
        </div>
        <button
          className="button button-outline"
          onClick={() => onUnlock(benefits[2])}
        >
          {unlocked.includes("lounge") ? "View my pass" : "Unlock my access"}
          <ArrowRight size={17} />
        </button>
      </section>
      <div className="trip-note">
        <MapPin size={16} />
        <span>
          Beirut is your departure city. Your next destination is Dubai.
        </span>
      </div>
      {panel && (
        <Modal
          title={panels.find((item) => item.id === panel)!.label}
          onClose={() => setPanel(null)}
        >
          {panel === "flight" && (
            <div className="flight-detail">
              <span className="tracking-label">
                FlyCham · FC 612 · 12 Nov 2026
              </span>
              <div className="flight-airports">
                <div>
                  <strong>BEY</strong>
                  <span>Beirut</span>
                  <b>09:30</b>
                </div>
                <div className="flight-path">
                  <Plane size={24} />
                  <span>3h 15m · Non-stop</span>
                </div>
                <div>
                  <strong>DXB</strong>
                  <span>Dubai</span>
                  <b>14:45</b>
                </div>
              </div>
              <p className="text-muted text-xs">
                All times are local to each airport.
              </p>
              <div className="detail-rows">
                <span>
                  Passenger<strong>{member.name}</strong>
                </span>
                <span>
                  Cabin<strong>Economy · Seat 14A</strong>
                </span>
                <span>
                  Baggage<strong>23 kg checked + 7 kg cabin</strong>
                </span>
                <span>
                  Booking reference<strong>FCJ724</strong>
                </span>
                <span>
                  Return<strong>15 Nov 2026 · FC 613</strong>
                </span>
              </div>
            </div>
          )}
          {panel === "hotel" && (
            <div className="hotel-detail">
              <img src={images.hotel} alt="A peaceful waterfront hotel" />
              <span className="tracking-label">Your stay in Dubai</span>
              <h3>The Palm Residence</h3>
              <p>
                A quiet retreat by the water, with the city at your doorstep.
              </p>
              <div className="detail-rows">
                <span>
                  Stay<strong>12–15 Nov · 3 nights</strong>
                </span>
                <span>
                  Room<strong>Deluxe · Sea view</strong>
                </span>
                <span>
                  Guests<strong>1 adult · Breakfast included</strong>
                </span>
              </div>
            </div>
          )}
          {panel === "itinerary" && (
            <ol className="itinerary-list">
              {[
                {
                  day: "12 NOV",
                  title: "A new view",
                  text: "Arrive in Dubai, settle into your hotel, and enjoy an evening by the Marina.",
                },
                {
                  day: "13 NOV",
                  title: "The city, your way",
                  text: "Explore Al Fahidi, take an abra across the Creek, and discover the souks.",
                },
                {
                  day: "14 NOV",
                  title: "Beyond the skyline",
                  text: "A slow morning by the sea, followed by sunset over the desert dunes.",
                },
                {
                  day: "15 NOV",
                  title: "Until next time",
                  text: "One last coffee, a few new memories, and your return flight to Beirut.",
                },
              ].map((item) => (
                <li key={item.day}>
                  <span>{item.day}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
          {panel === "more" && (
            <>
              <p className="modal-intro">
                The little details for a smoother journey.
              </p>
              <div className="essentials-list">
                <span>
                  <Clock size={21} />
                  <span>
                    Arrive early
                    <small>Be at the airport 3 hours before departure.</small>
                  </span>
                </span>
                <span>
                  <Luggage size={21} />
                  <span>
                    Pack for your journey
                    <small>23 kg checked baggage and a 7 kg cabin bag.</small>
                  </span>
                </span>
                <span>
                  <Armchair size={21} />
                  <span>
                    Make time for yourself
                    <small>Your complimentary lounge pass is waiting.</small>
                  </span>
                </span>
              </div>
              <button
                className="button button-gold w-full"
                onClick={() => setSaved(!saved)}
              >
                {saved ? (
                  <>
                    <Check size={17} /> Trip saved to your favourites
                  </>
                ) : (
                  "Save this trip"
                )}
              </button>
            </>
          )}
        </Modal>
      )}
    </main>
  );
}
