"use client";
// =====================================================================
// ATMOSFER ENGINE — "dünya canlı" katmanı (layout seviyesi, unmount olmaz)
// Üç sistem tek katmanda:
//   1. Sessiz Olaylar — kullanıcı dururken: rün, kırık metin, ışık, nabız
//   2. Route-Reaktif Profil — her frekans farklı atmosfer (pulse/grain/glow)
//   3. Derinlik — parallax, uzak rünler, yıldız noktaları, breathing
//
// KURAL: jumpscare DEĞİL, bildirim DEĞİL. Sessiz, düşük yoğunluk, fark edilir.
// prefers-reduced-motion ve mobil performans korunur.
// =====================================================================

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFrek } from "@/components/runtime/FrequencyProvider";
import { FrequencyKey, GOLD } from "@/lib/ontology";

// --- Route-reaktif atmosfer profilleri (her frekans farklı hisseder) ---
interface AtmosferProfil {
  pulse: number;   // nabız hızı çarpanı
  grain: number;   // doku yoğunluğu
  glow: number;    // ışık kırılması yoğunluğu
  olayAraligi: [number, number]; // sessiz olay aralığı (sn)
  renk: string;
}
const PROFILLER: Record<FrequencyKey, AtmosferProfil> = {
  KOZMOS:  { pulse: 0.5, grain: 0.05, glow: 0.3, olayAraligi: [12, 22], renk: "#8694A8" }, // soğuk, sessiz, yavaş
  TENGRI:  { pulse: 0.8, grain: 0.06, glow: 0.6, olayAraligi: [10, 18], renk: GOLD },        // altın, dengeli
  ALBASTI: { pulse: 1.1, grain: 0.09, glow: 0.4, olayAraligi: [8, 15],  renk: "#D6743C" },   // sıcak, yoğun, yakın
  KOROGLU: { pulse: 1.3, grain: 0.10, glow: 0.5, olayAraligi: [6, 14],  renk: "#9C7B4D" },   // kararsız, düzensiz
};

// --- Sessiz olay metinleri (kırık kayıtlar — anlatı değil, iz) ---
const KIRIK_KAYITLAR: Record<FrequencyKey, string[]> = {
  KOZMOS:  ["EKSEN // hâlâ duruyor", "KÖK // üç dünya derinde", "SU // her şeyden önce", "KAT // sayı değişir, yön kalır"],
  TENGRI:  ["İRADE // dilendi", "KUT // verildi, taşınıyor", "GÖK // bakıyor, karışmıyor", "YAY // gergin"],
  ALBASTI: ["EŞİK // biri bekliyor", "KIZIL // hangisi?", "DEMİR // geçmez", "KANDİL // sabaha kadar"],
  KOROGLU: ["KAYNAK // çelişiyor", "AD // tutmuyor", "ÇATLAK // kapanmıyor", "SES // üçü birden"],
};

// =====================================================================
export function AtmosferEngine() {
  const { onto } = useFrek();
  const profil = PROFILLER[onto.mode];
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (reduced) return <DerinlikKatmani profil={profil} reduced />; // hareket azaltma: sadece statik derinlik

  return (
    <>
      <DerinlikKatmani profil={profil} />
      <SessizOlaylar profil={profil} mode={onto.mode} />
    </>
  );
}

// --- KATMAN 3: DERİNLİK (parallax + uzak rünler + yıldız + breathing) ---
function DerinlikKatmani({ profil, reduced }: { profil: AtmosferProfil; reduced?: boolean }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (reduced) return;
    const onMove = (e: MouseEvent) => {
      setMouse({ x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduced]);

  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", overflow: "hidden" }}>
      {/* Katman A — yakın sis (breathing) */}
      <motion.div
        animate={reduced ? {} : { opacity: [0.04, 0.07, 0.04] }}
        transition={{ duration: 8 / profil.pulse, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse at 50% 40%, ${profil.renk}14 0%, transparent 60%)`,
          transform: `translate(${mouse.x * 8}px, ${mouse.y * 8}px)`,
          transition: "transform 0.6s ease-out",
        }}
      />
      {/* Katman B — yavaş hareket eden uzak rünler */}
      <div style={{ position: "absolute", inset: 0, transform: `translate(${mouse.x * 5}px, ${mouse.y * 5}px)`, transition: "transform 0.8s ease-out" }}>
        {RUNE_KONUM.map((r, i) => (
          <motion.div key={i}
            animate={reduced ? {} : { opacity: [0, 0.03, 0], y: [r.y, r.y - 30, r.y] }}
            transition={{ duration: 22 / profil.pulse, repeat: Infinity, delay: i * 3, ease: "easeInOut" }}
            style={{ position: "absolute", left: `${r.x}%`, top: `${r.y}%`, color: profil.renk, fontSize: r.s, fontFamily: "var(--font-display)", userSelect: "none" }}>
            {r.g}
          </motion.div>
        ))}
      </div>
      {/* Katman C — çok uzak yıldız/veri noktaları */}
      <div style={{ position: "absolute", inset: 0, transform: `translate(${mouse.x * 2}px, ${mouse.y * 2}px)`, transition: "transform 1s ease-out" }}>
        {YILDIZ_KONUM.map((s, i) => (
          <motion.div key={i}
            animate={reduced ? {} : { opacity: [0.02, 0.12, 0.02] }}
            transition={{ duration: 4 + (i % 5), repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
            style={{ position: "absolute", left: `${s.x}%`, top: `${s.y}%`, width: 1.5, height: 1.5, borderRadius: "50%", background: GOLD }}
          />
        ))}
      </div>
      {/* ışık kırılması (glow) */}
      <motion.div
        animate={reduced ? {} : { opacity: [profil.glow * 0.15, profil.glow * 0.35, profil.glow * 0.15] }}
        transition={{ duration: 10 / profil.pulse, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", top: "20%", right: "15%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${profil.renk}10 0%, transparent 70%)`, filter: "blur(40px)" }}
      />
    </div>
  );
}

// --- KATMAN 1: SESSİZ OLAYLAR (rün, kırık metin, ışık parıltısı) ---
function SessizOlaylar({ profil, mode }: { profil: AtmosferProfil; mode: FrequencyKey }) {
  const [olay, setOlay] = useState<{ tip: "metin" | "parilti"; deger: string; x: number; y: number; id: number } | null>(null);
  const sayac = useRef(0);

  const tetikle = useCallback(() => {
    const tip = Math.random() > 0.45 ? "metin" : "parilti";
    const kayitlar = KIRIK_KAYITLAR[mode];
    setOlay({
      tip,
      deger: tip === "metin" ? kayitlar[Math.floor(Math.random() * kayitlar.length)] : "",
      x: 8 + Math.random() * 80,
      y: 15 + Math.random() * 65,
      id: sayac.current++,
    });
  }, [mode]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const dongu = () => {
      const [min, max] = profil.olayAraligi;
      const bekle = (min + Math.random() * (max - min)) * 1000;
      timer = setTimeout(() => { tetikle(); dongu(); }, bekle);
    };
    dongu();
    return () => clearTimeout(timer);
  }, [profil, tetikle]);

  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 3, pointerEvents: "none" }}>
      <AnimatePresence>
        {olay && (
          <motion.div
            key={olay.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: olay.tip === "metin" ? [0, 0.22, 0.22, 0] : [0, 0.5, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: olay.tip === "metin" ? 4 : 2, times: olay.tip === "metin" ? [0, 0.15, 0.7, 1] : [0, 0.4, 1], ease: "easeInOut" }}
            onAnimationComplete={() => setOlay(null)}
            style={{ position: "absolute", left: `${olay.x}%`, top: `${olay.y}%` }}
          >
            {olay.tip === "metin" ? (
              <span className="ui" style={{ fontSize: 10, letterSpacing: 3, color: profil.renk, textTransform: "uppercase", whiteSpace: "nowrap" }}>
                {olay.deger}
              </span>
            ) : (
              <div style={{ width: 3, height: 3, borderRadius: "50%", background: GOLD, boxShadow: `0 0 12px 2px ${GOLD}` }} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// statik konum tabloları (her render'da sabit — performans)
const RUNE_KONUM = [
  { x: 12, y: 30, s: 22, g: "᚛" }, { x: 82, y: 22, s: 18, g: "ᚲ" },
  { x: 24, y: 70, s: 26, g: "ᛟ" }, { x: 70, y: 65, s: 20, g: "ᚦ" },
  { x: 45, y: 18, s: 16, g: "ᛜ" }, { x: 90, y: 50, s: 24, g: "ᚹ" },
];
const YILDIZ_KONUM = Array.from({ length: 30 }, (_, i) => ({
  x: (i * 37) % 100, y: (i * 53) % 100,
}));
