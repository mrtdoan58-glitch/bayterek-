"use client";
// =====================================================================
// RİTÜEL KATMANLARI — atmosfer, grain, toparlanma (layout seviyesi)
// Bunlar runtime'ın "ruhu" — production cleanup'ta KORUNMALI.
// =====================================================================

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFrek } from "@/components/runtime/FrequencyProvider";
import { FREQUENCIES } from "@/lib/ontology";

const GRAIN_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const BG: Record<string, (bg: string) => string> = {
  KOZMOS: (bg) => `radial-gradient(ellipse at 50% 50%, #0A0D14 0%, ${bg} 70%)`,
  TENGRI: (bg) => `radial-gradient(ellipse at 60% 35%, #100E0C 0%, ${bg} 72%)`,
  ALBASTI: (bg) => `radial-gradient(ellipse at 30% 40%, #160E10 0%, ${bg} 70%)`,
  KOROGLU: (bg) =>
    `radial-gradient(ellipse at 25% 30%, #9C7B4D10 0%, transparent 55%), radial-gradient(ellipse at 75% 70%, #7A3B2E12 0%, transparent 55%), ${bg}`,
};

export function AtmosphereLayer() {
  const { onto } = useFrek();
  const f = FREQUENCIES[onto.mode];
  return (
    <motion.div
      key={onto.mode}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: "fixed", inset: 0, zIndex: 0, background: BG[onto.mode](f.bg) }}
    />
  );
}

export function GrainLayer() {
  const { onto } = useFrek();
  return (
    <div
      aria-hidden
      style={{
        position: "fixed", inset: 0, zIndex: 2, pointerEvents: "none",
        opacity: onto.mode === "KOROGLU" ? 0.09 : 0.06, mixBlendMode: "overlay",
        backgroundImage: GRAIN_BG, transition: "opacity 1s",
      }}
    />
  );
}

// Anti-ghost: Köroğlu'ndan çıkışta çatlak kapanır (yumuşak, ritüel)
export function RecoveryFlash() {
  const { onto } = useFrek();
  const f = FREQUENCIES[onto.mode];
  return (
    <AnimatePresence>
      {onto.toparlaniyor && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: [0, 0.28, 0] }} exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], times: [0, 0.35, 1] }}
          style={{
            position: "fixed", inset: 0, zIndex: 80, pointerEvents: "none",
            background: `radial-gradient(ellipse at center, ${f.accent}18 0%, transparent 65%)`,
          }}
        >
          <motion.div
            initial={{ scaleX: 1, opacity: 0.4 }} animate={{ scaleX: 0, opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "absolute", top: "50%", left: "20%", right: "20%", height: 1,
              background: `linear-gradient(90deg, transparent, ${f.accent2}, transparent)`,
              transformOrigin: "center", filter: "blur(0.5px)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
