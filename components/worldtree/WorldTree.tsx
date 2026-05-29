"use client";
// =====================================================================
// DÜNYA AĞACI — DAİMÎ KATMAN (Anayasa madde 5: tek omurga)
// layout seviyesinde yaşar, ASLA unmount olmaz.
// Süreklilik hissi tamamen bunun üzerinden kurulur.
// =====================================================================

import React from "react";
import { motion } from "framer-motion";
import { useFrek } from "@/components/runtime/FrequencyProvider";
import { FREQUENCIES, FrequencyKey, GOLD } from "@/lib/ontology";

const NODES: Record<FrequencyKey, { x: number; y: number }> = {
  KOZMOS: { x: 200, y: 70 },
  TENGRI: { x: 200, y: 200 },
  ALBASTI: { x: 200, y: 330 },
  KOROGLU: { x: 268, y: 200 }, // bağlı değil — sızıyor
};

export function WorldTree() {
  const { onto } = useFrek();
  const focus = FREQUENCIES[onto.mode].treeFocus;
  const catlakAktif = onto.mode === "KOROGLU";

  const hot: Record<FrequencyKey, boolean> = {
    KOZMOS: focus === "dal",
    TENGRI: focus === "merkez",
    ALBASTI: focus === "kok",
    KOROGLU: focus === "catlak",
  };

  return (
    <div
      aria-hidden
      style={{
        position: "fixed", right: "clamp(-60px,2vw,40px)", top: "50%",
        transform: "translateY(-50%)", width: "min(38vw,420px)", height: "min(70vh,600px)",
        zIndex: 1, opacity: 0.5, pointerEvents: "none",
      }}
      className="worldtree-layer"
    >
      <svg viewBox="0 0 400 400" style={{ width: "100%", height: "100%", overflow: "visible" }}>
        <defs>
          <linearGradient id="axisG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8694A8" stopOpacity="0.8" />
            <stop offset="50%" stopColor={GOLD} stopOpacity="0.7" />
            <stop offset="100%" stopColor="#7A3B2E" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        <motion.line
          x1="200" y1="40" x2="200" y2="360" stroke="url(#axisG)" strokeWidth="1.5"
          animate={{ opacity: catlakAktif ? 0.4 : 0.85, x1: catlakAktif ? 198 : 200, x2: catlakAktif ? 202 : 200 }}
          transition={{ duration: 1 }}
        />
        {[-1, 1].map((d, i) => (
          <path key={`b${i}`} d={`M200 56 Q${200 + d * 38} 40 ${200 + d * 70} 48`} stroke="#8694A8" strokeWidth="0.8" fill="none"
            opacity={hot.KOZMOS ? 0.7 : 0.25} style={{ transition: "opacity 1s" }} />
        ))}
        {[-1, 1].map((d, i) => (
          <path key={`r${i}`} d={`M200 344 Q${200 + d * 38} 362 ${200 + d * 70} 352`} stroke="#7A3B2E" strokeWidth="0.8" fill="none"
            opacity={hot.ALBASTI ? 0.7 : 0.25} style={{ transition: "opacity 1s" }} />
        ))}

        {/* çatlak node bağlantısı — kesik, sızan */}
        <motion.line
          x1="200" y1="200" x2="268" y2="200" stroke={FREQUENCIES.KOROGLU.accent} strokeWidth="0.8" strokeDasharray="3 5"
          animate={{ opacity: catlakAktif ? [0.3, 0.7, 0.3] : 0.12 }}
          transition={{ duration: 2, repeat: catlakAktif ? Infinity : 0 }}
        />

        {(Object.keys(NODES) as FrequencyKey[]).map((key) => {
          const n = NODES[key];
          const cf = FREQUENCIES[key];
          const isCrack = key === "KOROGLU";
          const h = hot[key];
          return (
            <g key={key}>
              <motion.circle cx={n.x} cy={n.y} r={30} fill={cf.accent}
                animate={{ opacity: h ? 0.16 : 0.04, r: h ? 34 : 26 }} transition={{ duration: 1 }}
                style={{ filter: "blur(6px)" }} />
              <motion.circle cx={n.x} cy={n.y} r={6} fill={cf.accent}
                animate={
                  isCrack
                    ? { scale: h ? [1, 1.3, 0.9, 1.2, 1] : 0.8, opacity: h ? 1 : 0.4, x: h ? [0, 2, -2, 1, 0] : 0 }
                    : { scale: h ? 1.5 : 1, opacity: h ? 1 : 0.5 }
                }
                transition={isCrack && h ? { duration: 1.2, repeat: Infinity } : { duration: 0.8 }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
