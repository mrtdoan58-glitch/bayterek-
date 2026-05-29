"use client";
// =====================================================================
// ANA SAYFA — Eşik (giriş deneyimi)
// "Bir web sitesine girdim" değil, "kadim bir dünyanın içine düştüm"
// Bloklar: Hero → Kozmolojik Harita → Frekans Kapıları → Keşif → Footer
// =====================================================================

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useFrek } from "@/components/runtime/FrequencyProvider";
import { FREQUENCIES, FrequencyKey, GOLD, ALL_FREQ_KEYS } from "@/lib/ontology";

const EASE = [0.16, 1, 0.3, 1] as const;

// atmosfer toz partikülleri
function AtmosferTozu() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const N = reduced ? 0 : Math.min(50, Math.floor(w / 28));
    const parts = Array.from({ length: N }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.4 + 0.3, vy: -(Math.random() * 0.14 + 0.03),
      vx: (Math.random() - 0.5) * 0.05, o: Math.random() * 0.1 + 0.02,
    }));
    const onR = () => { w = canvas.width = innerWidth; h = canvas.height = innerHeight; };
    addEventListener("resize", onR);
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.y += p.vy; p.x += p.vx;
        if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,169,97,${p.o})`; ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    if (N > 0) draw();
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", onR); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1 }} />;
}

// frekans kartı verileri
const KAPILAR: { key: FrequencyKey; ad: string; sifat: string; cumle: string }[] = [
  { key: "KOZMOS", ad: "Kozmos", sifat: "Evrenin Katmanları", cumle: "Üç dünya, tek eksende: kökten dala uzanan bir ağaç." },
  { key: "TENGRI", ad: "Tanrılar", sifat: "Üst Varlıklar", cumle: "Göğün efendileri ve ak ruhların alemi." },
  { key: "ALBASTI", ad: "Yaratıklar", sifat: "Bozulmuş Varlıklar", cumle: "Karanlıkta dolaşan, korkunun aldığı biçimler." },
  { key: "KOROGLU", ad: "Sınır", sifat: "Çatlak Varlıklar", cumle: "Ne mit ne tarih — hiçbir dünyaya tam ait olmayan." },
];

// keşif varlık listesi
const KESIF_LISTESI = [
  { ad: "Tengri", etiket: "ÜST DÜNYA · GÖĞÜN İRADESİ", key: "TENGRI" as FrequencyKey },
  { ad: "Albastı", etiket: "ALT DÜNYA · LOHUSA KORKUSU", key: "ALBASTI" as FrequencyKey },
  { ad: "Köroğlu", etiket: "SINIR · ÇATLAK VARLIK", key: "KOROGLU" as FrequencyKey },
  { ad: "Erlik Han", etiket: "ALT DÜNYA · YERALTI YARGICI", key: "ALBASTI" as FrequencyKey },
  { ad: "Ülgen", etiket: "ÜST DÜNYA · YARATICI", key: "TENGRI" as FrequencyKey },
  { ad: "Umay Ana", etiket: "ORTA DÜNYA · ANA RUH", key: "TENGRI" as FrequencyKey },
  { ad: "Ergenekon", etiket: "DESTAN · DEMİR DAĞDAN ÇIKIŞ", key: "KOZMOS" as FrequencyKey },
];

export function HomePage() {
  const { setMode } = useFrek();
  const router = useRouter();
  const [kesfedilen, setKesfedilen] = useState<typeof KESIF_LISTESI[0] | null>(null);

  const git = (k: FrequencyKey) => {
    setMode(k);
    router.push(FREQUENCIES[k].route);
  };

  const kesfet = () => {
    const v = KESIF_LISTESI[Math.floor(Math.random() * KESIF_LISTESI.length)];
    setKesfedilen(v);
  };

  return (
    <div style={{ position: "relative", zIndex: 10 }}>
      <AtmosferTozu />

      {/* ═══ BLOK 1: HERO — eşik ═══ */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", textAlign: "center",
        padding: "0 24px", position: "relative",
      }}>
        {/* nefes alan dünya ağacı sembolü */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0.4, 0.7, 0.4], scale: 1 }}
          transition={{ opacity: { duration: 6, repeat: Infinity, ease: "easeInOut" }, scale: { duration: 2, ease: EASE } }}
          style={{ marginBottom: 40 }}
        >
          <svg width="64" height="80" viewBox="0 0 64 80">
            <line x1="32" y1="6" x2="32" y2="74" stroke={GOLD} strokeWidth="1" />
            <path d="M32 14 Q18 8 8 14" stroke="#8694A8" strokeWidth="0.8" fill="none" opacity="0.7" />
            <path d="M32 14 Q46 8 56 14" stroke="#8694A8" strokeWidth="0.8" fill="none" opacity="0.7" />
            <path d="M32 70 Q20 78 10 72" stroke="#8A5A3B" strokeWidth="0.8" fill="none" opacity="0.7" />
            <path d="M32 70 Q44 78 54 72" stroke="#8A5A3B" strokeWidth="0.8" fill="none" opacity="0.7" />
            <circle cx="32" cy="40" r="3" fill="#D6743C" />
          </svg>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
          style={{
            fontSize: "clamp(36px, 7vw, 82px)", fontWeight: 300,
            lineHeight: 1.05, letterSpacing: "-0.01em", maxWidth: 900,
            color: "#E8E4DB",
          }}
        >
          Göğün Altında Unutulan<br />
          <span style={{ fontStyle: "italic", color: GOLD }}>Kadim Dünya</span>
        </motion.h1>

        <motion.p
          className="ui"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.8, ease: EASE }}
          style={{
            marginTop: 28, fontSize: "clamp(14px,2vw,18px)", fontWeight: 300,
            color: "#9D9A92", maxWidth: 520, lineHeight: 1.7,
          }}
        >
          Türk mitolojisinin tanrıları, ruhları ve kayıp destanları —
          bir ansiklopedi değil, içine girilen bir evren.
        </motion.p>

        <motion.a
          href="#harita"
          className="ui"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.3, ease: EASE }}
          style={{
            marginTop: 48, fontSize: 14, letterSpacing: 3, textTransform: "uppercase",
            color: "#E8E4DB", borderBottom: `1px solid ${GOLD}`, paddingBottom: 6,
            cursor: "pointer", textDecoration: "none",
          }}
        >
          Evrene Gir
        </motion.a>

        {/* aşağı kaydır */}
        <motion.div
          animate={{ opacity: [0.2, 0.6, 0.2], y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", bottom: 36, fontSize: 11, letterSpacing: 2, color: "#67645D" }}
        >
          ↓
        </motion.div>
      </section>

      {/* ═══ BLOK 2: KOZMOLOJİK HARİTA — yönelim ═══ */}
      <section
        id="harita"
        style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "120px 24px", position: "relative",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 50 }}
        >
          <div className="ui" style={{ fontSize: 11, letterSpacing: 4, color: GOLD, textTransform: "uppercase", marginBottom: 18 }}>
            Neredesin?
          </div>
          <h2 style={{ fontSize: "clamp(26px,4vw,44px)", fontWeight: 300, lineHeight: 1.2, color: "#E8E4DB" }}>
            Evren üç dünyadan kurulur
          </h2>
          <p className="ui" style={{ marginTop: 16, color: "#9D9A92", fontSize: 15, maxWidth: 460, margin: "16px auto 0", lineHeight: 1.7, fontWeight: 300 }}>
            Bir eksen hepsini bağlar: kökleri yer altında, dalları gökte olan Dünya Ağacı.
            Bir dünyaya dokun, yolculuğun başlasın.
          </p>
        </motion.div>

        {/* üç dünya dikey haritası */}
        <div style={{ maxWidth: 500, width: "100%", margin: "0 auto" }}>
          <svg viewBox="0 0 400 400" style={{ width: "100%", height: "auto", overflow: "visible" }}>
            <defs>
              <linearGradient id="hmAxis" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8694A8" stopOpacity="0.9" />
                <stop offset="50%" stopColor={GOLD} stopOpacity="0.9" />
                <stop offset="100%" stopColor="#7A3B2E" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <motion.line x1="200" y1="40" x2="200" y2="370" stroke="url(#hmAxis)" strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }} transition={{ duration: 2.2, ease: EASE }} />
            {[-1, 1].map((d, i) => (
              <motion.path key={`b${i}`} d={`M200 56 Q${200 + d * 38} 40 ${200 + d * 68} 48`}
                stroke="#8694A8" strokeWidth="0.8" fill="none" opacity="0.5"
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
                viewport={{ once: true }} transition={{ duration: 1.4, delay: 1.6 }} />
            ))}
            {[-1, 1].map((d, i) => (
              <motion.path key={`r${i}`} d={`M200 354 Q${200 + d * 38} 372 ${200 + d * 68} 362`}
                stroke="#7A3B2E" strokeWidth="0.8" fill="none" opacity="0.5"
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
                viewport={{ once: true }} transition={{ duration: 1.4, delay: 1.8 }} />
            ))}
            {[
              { ad: "GÖK", alt: "Üst Dünya", y: 70, renk: "#8694A8", k: "TENGRI" as FrequencyKey },
              { ad: "YERYÜZÜ", alt: "Orta Dünya", y: 200, renk: "#9C7B4D", k: "KOZMOS" as FrequencyKey },
              { ad: "YER ALTI", alt: "Alt Dünya", y: 330, renk: "#7A3B2E", k: "ALBASTI" as FrequencyKey },
            ].map((d, i) => (
              <g key={d.ad} style={{ cursor: "pointer" }} onClick={() => git(d.k)}>
                <motion.circle cx="200" cy={d.y} r="6" fill={d.renk}
                  initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 + i * 0.25 }}
                  whileHover={{ scale: 1.6 }} />
                <motion.text x="248" y={d.y - 2} fill="#E8E4DB" fontSize="13"
                  fontFamily="'Cormorant Garamond', serif" letterSpacing="3"
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                  viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.6 + i * 0.25 }}>
                  {d.ad}
                </motion.text>
                <motion.text x="248" y={d.y + 14} fill="#67645D" fontSize="8"
                  fontFamily="'Cormorant Garamond', serif" letterSpacing="1"
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                  viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.75 + i * 0.25 }}>
                  {d.alt}
                </motion.text>
              </g>
            ))}
          </svg>
        </div>
      </section>

      {/* ═══ BLOK 3: FREKANS KAPILARI ═══ */}
      <section style={{ padding: "80px clamp(20px,5vw,56px)", maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          style={{ marginBottom: 50 }}
        >
          <div className="ui" style={{ fontSize: 11, letterSpacing: 4, color: GOLD, textTransform: "uppercase" }}>
            Evrenin Bölgeleri
          </div>
          <h2 style={{ fontSize: "clamp(24px,3.5vw,40px)", fontWeight: 300, marginTop: 12, color: "#E8E4DB" }}>
            Nereye inmek istersin?
          </h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 18 }}>
          {KAPILAR.map((c, i) => (
            <motion.div
              key={c.key}
              onClick={() => git(c.key)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.9, delay: i * 0.1, ease: EASE }}
              whileHover={{ y: -4 }}
              style={{
                background: "#0F1014", border: "1px solid #2A2C34", borderRadius: 2,
                padding: "32px 26px", cursor: "pointer", position: "relative",
                overflow: "hidden", minHeight: 200,
                display: "flex", flexDirection: "column", justifyContent: "flex-end",
              }}
            >
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, transparent, ${FREQUENCIES[c.key].accent2}, transparent)`,
                opacity: 0.6,
              }} />
              <div className="ui" style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: FREQUENCIES[c.key].accent2, marginBottom: 12 }}>
                {c.sifat}
              </div>
              <h3 style={{ fontSize: 30, fontWeight: 400, marginBottom: 10, color: "#E8E4DB" }}>{c.ad}</h3>
              <p className="ui" style={{ fontSize: 13, color: "#9D9A92", lineHeight: 1.6, fontWeight: 300 }}>
                {c.cumle}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ BLOK 4: KEŞİF ═══ */}
      <section style={{ padding: "80px 24px 120px", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
        >
          <div className="ui" style={{ fontSize: 11, letterSpacing: 4, color: GOLD, textTransform: "uppercase", marginBottom: 18 }}>
            Yolunu Seçemiyorsan
          </div>
          <h2 style={{ fontSize: "clamp(24px,3.5vw,40px)", fontWeight: 300, marginBottom: 36, color: "#E8E4DB" }}>
            Bırak evren sana bir varlık göstersin
          </h2>

          <button onClick={kesfet} className="ui" style={{
            background: "transparent", border: `1px solid ${GOLD}`, color: "#E8E4DB",
            padding: "14px 34px", fontSize: 13, letterSpacing: 3, textTransform: "uppercase",
            cursor: "pointer", borderRadius: 1, fontFamily: "inherit",
          }}>
            Bir Varlık Çağır
          </button>

          <div style={{ minHeight: 140, marginTop: 44 }}>
            <AnimatePresence mode="wait">
              {kesfedilen && (
                <motion.div
                  key={kesfedilen.ad + Math.random()}
                  initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
                  transition={{ duration: 0.7, ease: EASE }}
                  style={{
                    maxWidth: 380, margin: "0 auto",
                    border: "1px solid #2A2C34", background: "#13141C",
                    padding: "30px 28px", borderRadius: 2,
                  }}
                >
                  <div className="ui" style={{ fontSize: 10, letterSpacing: 2, color: "#8A5A3B", marginBottom: 14 }}>
                    {kesfedilen.etiket}
                  </div>
                  <div style={{ fontSize: 34, fontWeight: 400, marginBottom: 16, color: "#E8E4DB" }}>
                    {kesfedilen.ad}
                  </div>
                  <span
                    onClick={() => git(kesfedilen.key)}
                    className="ui"
                    style={{
                      fontSize: 12, letterSpacing: 2, color: GOLD,
                      borderBottom: `1px solid ${GOLD}66`, paddingBottom: 3,
                      textTransform: "uppercase", cursor: "pointer",
                    }}
                  >
                    Yolculuğa devam et →
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* ═══ RİTÜEL FOOTER ═══ */}
      <footer style={{
        borderTop: "1px solid #2A2C3466", padding: "50px 24px 120px",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 17, letterSpacing: 4, color: "#E8E4DB" }}>
          BAY TEREK<span style={{ color: GOLD }}>.</span>
        </div>
        <div className="ui" style={{ fontSize: 12, color: "#67645D", letterSpacing: 1, fontStyle: "italic", marginTop: 8 }}>
          Türk Mitolojisinin Kayıp Dünyası
        </div>
      </footer>
    </div>
  );
}
