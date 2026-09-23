import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import CinematicBackground, { Particles } from "./CinematicBackground";
import { Brand } from "./Brand";
import type { Navigate } from "../data/mockData";

export default function FinalExperience({ navigate }: { navigate: Navigate }) {
  return (
    <main className="final-screen">
      <CinematicBackground />
      <Particles />
      <motion.div
        className="final-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 tabIndex={-1}>
          One tap.
          <br />
          <em>A world of possibilities.</em>
        </h1>
        <p>
          Your journey. Your rewards.
          <br />
          Always with you.
        </p>
        <Brand />
        <button
          className="button button-outline"
          onClick={() => navigate("home")}
        >
          Back to my world <ArrowRight size={18} />
        </button>
      </motion.div>
    </main>
  );
}
