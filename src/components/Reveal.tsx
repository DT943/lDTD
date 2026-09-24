import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useExperienceMotion } from "./ExperienceMotion";

export default function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { enabled } = useExperienceMotion();
  return (
    <motion.div
      className={className}
      initial={enabled ? { opacity: 0, y: 24 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{
        duration: enabled ? 0.7 : 0,
        delay: enabled ? delay : 0,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
