"use client";
// =====================================================================
// ENTITY VIEW — tek content renderer (Anayasa madde 4: yoğunluk ritmi)
// %20 zirve / %50 orta mitik / %30 bilgi taşıyıcı + frekans değiştir.
// =====================================================================

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useFrek } from "@/components/runtime/FrequencyProvider";
import { FREQUENCIES, FrequencyKey, ALL_FREQ_KEYS } from "@/lib/ontology";
import { getCanon } from "@/lib/content";
import { KalpKozmos, KalpTengri, KalpAlbasti, KalpKoroglu } from "@/components/frequency/Hearts";

const EASE = [0.16, 1, 0.3, 1] as const;

const KALP_BASLIK: Record<FrequencyKey, { label: string; baslik: string }> = {
  KOZMOS: { label: "Üç Dünya", baslik: "Bir eksen, üç alem" },
  TENGRI: { label: "Eksenin İki Ucu", baslik: "Bir irade, ancak karşıtıyla durur" },
  ALBASTI: { label: "Korkunun Bedeni", baslik: "Korkuyu adlandırmak" },
  KOROGLU: { label: "Üç Ses, Tek Ad", baslik: "Hepsi onu anlatır, hiçbiri uyuşmaz" },
};

function kalpFor(mode: FrequencyKey) {
  switch (mode) {
    case "KOZMOS": return <KalpKozmos />;
    case "TENGRI": return <KalpTengri />;
    case "ALBASTI": return <KalpAlbasti />;
    case "KOROGLU": return <KalpKoroglu />;
  }
}

export function EntityView() {
  const { onto } = useFrek();
  const mode = onto.mode;
  const f = FREQUENCIES[mode];
  const c = getCanon(mode);
  const kb = KALP_BASLIK[mode];
  const cokSatir = mode === "KOZMOS";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
        transition={{ duration: 0.9, ease: EASE }}
        style={{ position: "relative", zIndex: 10 }}
      >
        {/* %20 ZİRVE */}
        <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 clamp(24px,8vw,120px)" }}>
          <div style={{ height: 18, marginBottom: 26 }}>
            <AnimatePresence mode="wait">
              <motion.div key={mode === "KOROGLU" ? onto.korogluKimlik : f.etiket} className="ui"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.7 }}
                style={{ fontSize: 11, letterSpacing: 3, color: f.accent2 }}>
                {mode === "KOROGLU" ? onto.korogluKimlik : f.etiket}
              </motion.div>
            </AnimatePresence>
          </div>
          <h1 style={{
            fontSize: cokSatir ? "clamp(38px,8vw,96px)" : "clamp(56px,12vw,150px)",
            fontWeight: 300, lineHeight: cokSatir ? 1.05 : 0.95, letterSpacing: "-0.02em", color: f.text,
            animation: mode === "KOROGLU" ? "drift 7s ease-in-out infinite" : "none",
          }}>
            {c.ad}
          </h1>
          <p className="ui" style={{ marginTop: 30, maxWidth: 560, fontSize: "clamp(15px,2.2vw,19px)", lineHeight: 1.7, color: f.sub, fontWeight: 300 }}>
            {c.acilis}
          </p>
          <div className="ui" style={{ marginTop: 40, fontSize: 11, letterSpacing: 2, color: "#67645D" }}>↓ &nbsp;{f.yon}</div>
        </section>

        {/* %50 ORTA MİTİK */}
        <section style={{ minHeight: "90vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "100px clamp(24px,6vw,80px)" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div className="ui" style={{ fontSize: 11, letterSpacing: 4, color: f.accent2, textTransform: "uppercase", marginBottom: 14 }}>{kb.label}</div>
            <h2 style={{ fontSize: "clamp(24px,4vw,42px)", fontWeight: 300, color: f.text, lineHeight: 1.15 }}>{kb.baslik}</h2>
          </div>
          {kalpFor(mode)}
        </section>

        {/* %30 BİLGİ TAŞIYICI */}
        <section style={{ padding: "90px clamp(24px,8vw,120px)" }}>
          <div style={{ maxWidth: 680 }}>
            <div className="ui" style={{ fontSize: 11, letterSpacing: 4, color: f.accent2, textTransform: "uppercase", marginBottom: 14 }}>{c.bilgi.label}</div>
            <h2 style={{ fontSize: "clamp(22px,3.5vw,40px)", fontWeight: 300, color: f.text, lineHeight: 1.2 }}>{c.bilgi.baslik}</h2>
            <p className="ui" style={{ fontSize: "clamp(15px,2vw,18px)", lineHeight: 1.85, color: f.sub, fontWeight: 300, marginTop: 18 }}>{c.bilgi.metin}</p>
            <p className="ui" style={{ marginTop: 40, fontSize: 12.5, color: "#67645D", fontStyle: "italic", lineHeight: 1.7, borderLeft: `1px solid ${mode === "KOROGLU" ? f.accent : "#272830"}`, paddingLeft: 18, maxWidth: 560 }}>{c.bilgi.not}</p>
          </div>
        </section>

        <FrekansKesfi mode={mode} />
      </motion.div>
    </AnimatePresence>
  );
}

function FrekansKesfi({ mode }: { mode: FrequencyKey }) {
  const { setMode } = useFrek();
  const router = useRouter();
  const f = FREQUENCIES[mode];
  const hedefler = ALL_FREQ_KEYS.filter((k) => k !== mode);
  const gecisAdi: Record<FrequencyKey, string> = {
    KOZMOS: "genişlemeye aç", TENGRI: "eksene gir", ALBASTI: "içe in", KOROGLU: "çatlağa düş",
  };
  const git = (k: FrequencyKey) => { setMode(k); router.push(FREQUENCIES[k].route); };
  return (
    <section style={{ padding: "70px clamp(24px,8vw,120px) 150px" }}>
      <div className="ui" style={{ fontSize: 11, letterSpacing: 4, color: f.accent2, textTransform: "uppercase", marginBottom: 26 }}>Frekansı değiştir</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
        {hedefler.map((h, i) => (
          <motion.button key={h} onClick={() => git(h)} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }} whileHover={{ y: -4 }}
            style={{ textAlign: "left", background: "#0E0E11", border: "1px solid #272830", borderRadius: 2, padding: "24px 20px", cursor: "pointer", position: "relative", overflow: "hidden", fontFamily: "inherit" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${FREQUENCIES[h].accent2},transparent)`, opacity: 0.5 }} />
            <div style={{ fontSize: 22, fontWeight: 400, color: FREQUENCIES[h].text, marginBottom: 6, fontFamily: "var(--font-display)" }}>{FREQUENCIES[h].ad}</div>
            <div className="ui" style={{ fontSize: 12, color: "#67645D" }}>{gecisAdi[h]}</div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
