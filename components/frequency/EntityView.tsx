"use client";
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
        {/* %20 ZİRVE — açılış */}
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
            fontSize: "clamp(56px,12vw,150px)", fontWeight: 300, lineHeight: 0.95,
            letterSpacing: "-0.02em", color: f.text,
            animation: mode === "KOROGLU" ? "drift 7s ease-in-out infinite" : "none",
          }}>
            {c.ad}
          </h1>
          <p className="ui" style={{ marginTop: 30, maxWidth: 560, fontSize: "clamp(15px,2.2vw,19px)", lineHeight: 1.7, color: f.sub, fontWeight: 300 }}>
            {c.acilis}
          </p>
          <div className="ui" style={{ marginTop: 40, fontSize: 11, letterSpacing: 2, color: "#67645D" }}>↓ &nbsp;{f.yon}</div>
        </section>

        {/* DERİN LORE — yeni, atmosferik derinlik */}
        {c.lore && (
          <section style={{ padding: "80px clamp(24px,8vw,120px)" }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }} transition={{ duration: 1, ease: EASE }}
              style={{ maxWidth: 680 }}>
              <div className="ui" style={{ fontSize: 11, letterSpacing: 4, color: f.accent2, textTransform: "uppercase", marginBottom: 16 }}>Anlatı</div>
              {c.lore.split("\n\n").map((p, i) => (
                <p key={i} className="ui" style={{
                  fontSize: "clamp(15px,2vw,18px)", lineHeight: 1.85, color: f.sub,
                  fontWeight: 300, marginTop: i === 0 ? 0 : 24,
                }}>
                  {p}
                </p>
              ))}
            </motion.div>
          </section>
        )}

        {/* %50 ORTA MİTİK — etkileşimli kalp */}
        <section style={{ minHeight: "80vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px clamp(24px,6vw,80px)" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div className="ui" style={{ fontSize: 11, letterSpacing: 4, color: f.accent2, textTransform: "uppercase", marginBottom: 14 }}>{kb.label}</div>
            <h2 style={{ fontSize: "clamp(24px,4vw,42px)", fontWeight: 300, color: f.text, lineHeight: 1.15 }}>{kb.baslik}</h2>
          </div>
          {kalpFor(mode)}
        </section>

        {/* SEMBOLLER — yeni */}
        {c.semboller && c.semboller.length > 0 && (
          <section style={{ padding: "80px clamp(24px,8vw,120px)" }}>
            <div style={{ maxWidth: 680 }}>
              <div className="ui" style={{ fontSize: 11, letterSpacing: 4, color: f.accent2, textTransform: "uppercase", marginBottom: 20 }}>Semboller</div>
              {c.semboller.map((s, i) => (
                <motion.div key={s.ad} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                  style={{ display: "flex", gap: 24, padding: "20px 0", borderTop: `1px solid #2A2C3455`, alignItems: "baseline" }}>
                  <div style={{ fontSize: 20, color: f.accent2, minWidth: 120, fontWeight: 400, fontFamily: "var(--font-display)" }}>{s.ad}</div>
                  <div className="ui" style={{ fontSize: 14, color: f.sub, lineHeight: 1.6, fontWeight: 300 }}>{s.anlam}</div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* %30 BİLGİ TAŞIYICI */}
        <section style={{ padding: "80px clamp(24px,8vw,120px)" }}>
          <div style={{ maxWidth: 680 }}>
            <div className="ui" style={{ fontSize: 11, letterSpacing: 4, color: f.accent2, textTransform: "uppercase", marginBottom: 14 }}>{c.bilgi.label}</div>
            <h2 style={{ fontSize: "clamp(22px,3.5vw,40px)", fontWeight: 300, color: f.text, lineHeight: 1.2 }}>{c.bilgi.baslik}</h2>
            {c.bilgi.metin.split("\n\n").map((p, i) => (
              <p key={i} className="ui" style={{ fontSize: "clamp(15px,2vw,18px)", lineHeight: 1.85, color: f.sub, fontWeight: 300, marginTop: i === 0 ? 18 : 20 }}>{p}</p>
            ))}
            <p className="ui" style={{ marginTop: 40, fontSize: 12.5, color: "#67645D", fontStyle: "italic", lineHeight: 1.7, borderLeft: `1px solid ${mode === "KOROGLU" ? f.accent : "#272830"}`, paddingLeft: 18, maxWidth: 560 }}>{c.bilgi.not}</p>
          </div>
        </section>

        {/* İLİŞKİLİ VARLIKLAR — rabbit hole */}
        {c.iliskili && c.iliskili.length > 0 && <IliskiliVarliklar iliskili={c.iliskili} mode={mode} />}

        {/* FREKANS DEĞİŞTİR */}
        <FrekansKesfi mode={mode} />
      </motion.div>
    </AnimatePresence>
  );
}

function IliskiliVarliklar({ iliskili, mode }: { iliskili: { ad: string; not: string; frekans: FrequencyKey }[]; mode: FrequencyKey }) {
  const { setMode } = useFrek();
  const router = useRouter();
  const f = FREQUENCIES[mode];
  const git = (k: FrequencyKey) => { setMode(k); router.push(FREQUENCIES[k].route); };
  return (
    <section style={{ padding: "60px clamp(24px,8vw,120px) 80px" }}>
      <div className="ui" style={{ fontSize: 11, letterSpacing: 4, color: f.accent2, textTransform: "uppercase", marginBottom: 26 }}>Yolculuğa devam et</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
        {iliskili.map((r, i) => (
          <motion.button key={r.ad} onClick={() => git(r.frekans)} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }} whileHover={{ y: -4 }}
            style={{ textAlign: "left", background: "#0E0E11", border: "1px solid #272830", borderRadius: 2, padding: "24px 20px", cursor: "pointer", position: "relative", overflow: "hidden", fontFamily: "inherit" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${FREQUENCIES[r.frekans].accent2},transparent)`, opacity: 0.5 }} />
            <div style={{ fontSize: 22, fontWeight: 400, color: "#E8E4DB", marginBottom: 6, fontFamily: "var(--font-display)" }}>{r.ad}</div>
            <div className="ui" style={{ fontSize: 12, color: "#67645D" }}>{r.not}</div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

function FrekansKesfi({ mode }: { mode: FrequencyKey }) {
  const { setMode } = useFrek();
  const router = useRouter();
  const f = FREQUENCIES[mode];
  const hedefler = ALL_FREQ_KEYS.filter((k) => k !== mode);
  const gecisAdi: Record<FrequencyKey, string> = { KOZMOS: "genişlemeye aç", TENGRI: "eksene gir", ALBASTI: "içe in", KOROGLU: "çatlağa düş" };
  const git = (k: FrequencyKey) => { setMode(k); router.push(FREQUENCIES[k].route); };
  return (
    <section style={{ padding: "50px clamp(24px,8vw,120px) 150px" }}>
      <div className="ui" style={{ fontSize: 11, letterSpacing: 4, color: f.accent2, textTransform: "uppercase", marginBottom: 26 }}>Frekansı değiştir</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
        {hedefler.map((h, i) => (
          <motion.button key={h} onClick={() => git(h)} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }} whileHover={{ y: -4 }}
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
