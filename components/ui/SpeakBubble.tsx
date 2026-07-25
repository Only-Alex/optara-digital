"use client";

import { motion } from "motion/react";
import { speakBubble } from "@/lib/content";
import { DURATION, EASE } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

export function SpeakBubble() {
  const reduced = useReducedMotion();

  return (
    <motion.a
      href={speakBubble.href}
      className="fixed bottom-5 right-5 z-40 grid h-24 w-24 place-items-center rounded-full bg-accent px-3 text-center text-[0.8125rem] font-medium leading-tight text-paper shadow-[0_10px_30px_rgba(59,30,255,0.28)] md:bottom-7 md:right-7 md:h-28 md:w-28"
      initial={reduced ? false : { opacity: 0, scale: 0.7 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: reduced
          ? { duration: 0 }
          : { duration: 0.6, ease: EASE, delay: 1.1 },
      }}
      whileHover={{
        scale: 1.07,
        backgroundColor: "#1B0FA8",
        transition: { duration: DURATION.micro, ease: EASE },
      }}
      whileFocus={{
        scale: 1.07,
        backgroundColor: "#1B0FA8",
        transition: { duration: DURATION.micro, ease: EASE },
      }}
      whileTap={{ scale: 0.95 }}
    >
      {speakBubble.label}
    </motion.a>
  );
}
