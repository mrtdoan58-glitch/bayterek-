"use client";
// =====================================================================
// MYTH MEMORY — "Evren seni okuyor" paneli (kehanet, dashboard değil)
// Tüm yorum mantığı lib/myth-reading.ts'te (saf fonksiyonlar).
// Bu component yalnızca sunar.
// =====================================================================

import React from "react";
import { motion } from "framer-motion";
import { useFrek } from "@/components/runtime/FrequencyProvider";
import { FREQUENCIES, GOLD, ALL_FREQ_KEYS } from "@/lib/ontology";
import { oku, kaymaCumlesi, korogluCumlesi, SOLMA_CUMLESI } from "@/lib/myth-reading";

const EASE = [0.16, 1, 0.3, 1] as const;

export function MythMemory() {
  const { ui, izleme, mitolojiyiKapat } = useFrek();
  if (!ui.mitolojiAcik) return null;
  const r = oku(izleme);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
      onClick={mitolojiyiKapat}
      style={{ position: "fixed", inset: 0, zIndex: 90, background: "#040405f4", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, cursor: "pointer" }}
    >
      <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: EASE }}
        onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540, width: "100%", cursor: "default" }}>
        <div className="ui" style={{ fontSize: 11, letterSpacing: 4, color: GOLD, textTransform: "uppercase", marginBottom: 20 }}>{r.baslik}</div>

        {r.ilkZiyaret ? (
          <p style={{ fontSize: "clamp(22px,4vw,34px)", fontWeight: 300, lineHeight: 1.3, color: "#9D9A92", fontStyle: "italic", fontFamily: "var(--font-display)" }}>
            Henüz iz bırakmadın. Bir frekansta kal, evren seni tanımaya başlasın.
          </p>
        ) : (
          <>
            {r.solmus && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
                className="ui" style={{ fontSize: 14, color: "#67645D", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic", fontWeight: 300 }}>
                {SOLMA_CUMLESI}
              </motion.p>
            )}

            <h2 style={{ fontSize: "clamp(20px,3.4vw,31px)", fontWeight: 300, lineHeight: 1.4, color: "#E8E4DB", fontStyle: "italic", opacity: r.solmus ? 0.78 : 1, transition: "opacity 1s", fontFamily: "var(--font-display)" }}>
              &ldquo;{r.cekirdekCumle}&rdquo;
            </h2>

            {r.kayma && r.sonBaskin && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }}
                className="ui" style={{ fontSize: 14, color: FREQUENCIES[r.sonBaskin].accent2, lineHeight: 1.7, marginTop: 18, fontStyle: "italic", fontWeight: 300 }}>
                {kaymaCumlesi(r.sonBaskin)}
              </motion.p>
            )}

            <div style={{ marginTop: 36, marginBottom: 8 }}>
              {ALL_FREQ_KEYS.map((k) => {
                const oran = r.oranlar[k];
                const sonAktif = r.sonBaskin === k;
                const barOpaklik = sonAktif ? 0.8 : 0.7 - r.solmaFaktoru * 0.35;
                return (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
                    <span className="ui" style={{ fontSize: 12, color: FREQUENCIES[k].accent2, minWidth: 64, letterSpacing: 1, opacity: sonAktif ? 1 : 1 - r.solmaFaktoru * 0.4 }}>{FREQUENCIES[k].ad}</span>
                    <div style={{ flex: 1, height: 2, background: "#16161b", position: "relative", overflow: "hidden" }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(oran * 100, oran > 0 ? 4 : 0)}%` }} transition={{ duration: 1.2, ease: EASE }}
                        style={{ height: "100%", background: FREQUENCIES[k].accent2, opacity: barOpaklik, transition: "opacity 1s" }} />
                      {sonAktif && (
                        <motion.div animate={{ opacity: [0.3, 0.9, 0.3] }} transition={{ duration: 2, repeat: Infinity }}
                          style={{ position: "absolute", right: 0, top: -1, width: 2, height: 4, background: FREQUENCIES[k].accent2 }} />
                      )}
                    </div>
                    <span className="ui" style={{ fontSize: 11, color: "#67645D", minWidth: 56, textAlign: "right", fontStyle: "italic" }}>{r.egilim(k)}</span>
                  </div>
                );
              })}
            </div>

            <p className="ui" style={{ fontSize: 12.5, color: "#67645D", marginTop: 26, lineHeight: 1.8, fontWeight: 300 }}>
              {r.ikincil && !r.kayma && `${FREQUENCIES[r.baskin].ad} ile ${FREQUENCIES[r.ikincil].ad} arasında salınıyorsun. `}
              {korogluCumlesi(izleme.korogluZiyaret)}
            </p>
          </>
        )}

        <button onClick={mitolojiyiKapat} className="ui" style={{ marginTop: 36, fontSize: 12, letterSpacing: 2, color: GOLD, background: "none", border: "none", borderBottom: `1px solid ${GOLD}66`, paddingBottom: 3, cursor: "pointer", textTransform: "uppercase", fontFamily: "inherit" }}>
          Evrene dön
        </button>
      </motion.div>
    </motion.div>
  );
}

// ✶ tetikleyici (sağ alt)
export function MemoryTrigger() {
  const { mitolojiyiAc } = useFrek();
  return (
    <button onClick={mitolojiyiAc} title="Kişisel mitolojin" aria-label="Kişisel mitolojin" className="ui"
      style={{ position: "fixed", right: 18, bottom: 78, zIndex: 65, fontSize: 18, color: GOLD, cursor: "pointer", background: "none", border: "none", opacity: 0.7, transition: "opacity .4s" }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}>
      ✶
    </button>
  );
}
