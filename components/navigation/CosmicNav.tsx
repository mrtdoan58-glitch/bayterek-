"use client";
// =====================================================================
// NAVİGASYON — kozmik nav (üst) + mobil nav (alt)
// "Bakış açısı değiştirici", menü değil. Route = perspektif.
// =====================================================================

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useFrek } from "@/components/runtime/FrequencyProvider";
import { FREQUENCIES, FrequencyKey, GOLD } from "@/lib/ontology";

const NAV_ITEMS: { k: FrequencyKey; ad: string }[] = [
  { k: "KOZMOS", ad: "Kozmos" },
  { k: "TENGRI", ad: "Tanrılar" },
  { k: "ALBASTI", ad: "Yaratıklar" },
  { k: "KOROGLU", ad: "Sınır" },
];

export function CosmicNav() {
  const { onto, setMode } = useFrek();
  const router = useRouter();
  const f = FREQUENCIES[onto.mode];

  const git = (k: FrequencyKey) => {
    setMode(k); // runtime önce (sürekli dünya)
    router.push(FREQUENCIES[k].route); // sonra route (perspektif)
  };

  return (
    <nav className="ui" style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "16px clamp(20px,5vw,48px)", backdropFilter: "blur(12px)",
      background: "#06060899", borderBottom: "1px solid #27283055",
      fontSize: 12, letterSpacing: 1.5,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, color: f.sub }}>
        <span style={{ letterSpacing: 4, color: f.text, fontFamily: "var(--font-display)", fontSize: 16 }}>
          BAY TEREK<span style={{ color: GOLD }}>.</span>
        </span>
        <span style={{ color: "#67645D" }}>/</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7, color: f.text }}>
          <motion.span
            animate={
              onto.mode === "KOROGLU"
                ? { backgroundColor: ["#9C7B4D", "#7E7A86", "#7A3B2E", GOLD, "#9C7B4D"] }
                : { backgroundColor: f.accent2, scale: [1, 1.25, 1] }
            }
            transition={onto.mode === "KOROGLU" ? { duration: 9, repeat: Infinity } : { duration: 2.4, repeat: Infinity }}
            style={{ width: 6, height: 6, borderRadius: "50%", display: "inline-block" }}
          />
          {onto.mode === "KOROGLU" ? onto.korogluKimlik.split(" · ")[0] : f.ad}
        </span>
      </div>
      <div style={{ display: "flex", gap: "clamp(12px,2.5vw,26px)" }}>
        {NAV_ITEMS.map((it) => (
          <button key={it.k} onClick={() => git(it.k)}
            style={{
              background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 12, letterSpacing: 1.5,
              color: onto.mode === it.k ? f.accent2 : "#9D9A92",
              borderBottom: onto.mode === it.k ? `1px solid ${f.accent2}` : "1px solid transparent",
              paddingBottom: 3, transition: "all .5s",
            }}>
            {it.ad}
          </button>
        ))}
      </div>
    </nav>
  );
}

export function MobileNav() {
  const { setMode, rasgele, mitolojiyiAc } = useFrek();
  const router = useRouter();
  const go = (k: FrequencyKey) => { setMode(k); router.push(FREQUENCIES[k].route); };

  const items = [
    { ad: "Evren", ikon: "✦", fn: () => go("KOZMOS") },
    { ad: "Eksen", ikon: "⊹", fn: () => go("TENGRI") },
    { ad: "Keşif", ikon: "◈", fn: rasgele },
    { ad: "İz", ikon: "✶", fn: mitolojiyiAc },
  ];
  return (
    <nav className="ui mobilenav" style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 60,
      display: "flex", justifyContent: "space-around", alignItems: "center",
      padding: "13px 8px", background: "#060608ee", backdropFilter: "blur(14px)",
      borderTop: "1px solid #27283066",
    }}>
      {items.map((m) => (
        <button key={m.ad} onClick={m.fn}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: "#9D9A92", fontSize: 10, letterSpacing: 1.5, fontFamily: "inherit" }}>
          <span style={{ fontSize: 16, color: GOLD }}>{m.ikon}</span>{m.ad}
        </button>
      ))}
    </nav>
  );
}
