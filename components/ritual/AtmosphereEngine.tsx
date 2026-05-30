"use client";
// =====================================================================
// ATMOSFER ENGINE — "dünya canlı" katmanı (layout seviyesi, unmount olmaz)
// v2: değerler GÖRÜNÜR seviyeye çıkarıldı (v1 fazla silikti).
// Üç sistem: Sessiz Olaylar + Route-Reaktif Profil + Derinlik/Parallax
// =====================================================================

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFrek } from "@/components/runtime/FrequencyProvider";
import { FrequencyKey, GOLD } from "@/lib/ontology";

interface AtmosferProfil {
  pulse: number; grain: number; glow: number;
  olayAraligi: [number, number]; renk: string;
}
const PROFILLER: Record<FrequencyKey, AtmosferProfil> = {
  KOZMOS:  { pulse: 0.6, grain: 0.05, glow: 0.5, olayAraligi: [9, 16],  renk: "#8694A8" },
  TENGRI:  { pulse: 0.9, grain: 0.06, glow: 0.8, olayAraligi: [8, 14],  renk: GOLD },
  ALBASTI: { pulse: 1.2, grain: 0.09, glow: 0.6, olayAraligi: [6, 12],  renk: "#D6743C" },
  KOROGLU: { pulse: 1.4, grain: 0.10, glow: 0.7, olayAraligi: [5, 11],  renk: "#9C7B4D" },
};

const KIRIK_KAYITLAR: Record<FrequencyKey, string[]> = {
  KOZMOS:  ["EKSEN // hâlâ duruyor", "KÖK // üç dünya derinde", "SU // her şeyden önce", "KAT // sayı değişir, yön kalır"],
  TENGRI:  ["İRADE // dilendi", "KUT // verildi, taşınıyor", "GÖK // bakıyor, karışmıyor", "YAY // gergin"],
  ALBASTI: ["EŞİK // biri bekliyor", "KIZIL // hangisi?", "DEMİR // geçmez", "KANDİL // sabaha kadar"],
  KOROGLU: ["KAYNAK // çelişiyor", "AD // tutmuyor", "ÇATLAK // kapanmıyor", "SES // üçü birden"],
};

export function AtmosferEngine() {
  const { onto } = useFrek();
  const profil = PROFILLER[onto.mode];
  const [reduced, setReduced] = useState(false);
  useEffect(() => { setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);

  return (
    <>
      <DerinlikKatmani profil={profil} reduced={reduced} />
      {!reduced && <SessizOlaylar profil={profil} mode={onto.mode} />}
    </>
  );
}

function DerinlikKatmani({ profil, reduced }: { profil: AtmosferProfil; reduced: boolean }) {
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
      {/* Katman A — yakın sis (breathing + parallax) */}
      <motion.div
        animate={reduced ? {} : { opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 8 / profil.pulse, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", inset: "-10%",
          background: `radial-gradient(ellipse at 50% 40%, ${profil.renk}33 0%, transparent 60%)`,
          transform: `translate(${mouse.x * 22}px, ${mouse.y * 22}px)`,
          transition: "transform 0.5s ease-out",
        }}
      />
      {/* Katman B — yavaş yüzen uzak rünler */}
      <div style={{ position: "absolute", inset: 0, transform: `translate(${mouse.x * 14}px, ${mouse.y * 14}px)`, transition: "transform 0.7s ease-out" }}>
        {RUNE_KONUM.map((r, i) => (
          <motion.div key={i}
            animate={reduced ? { opacity: 0.07 } : { opacity: [0.04, 0.13, 0.04], y: [0, -28, 0] }}
            transition={{ duration: 20 / profil.pulse, repeat: Infinity, delay: i * 2.5, ease: "easeInOut" }}
            style={{ position: "absolute", left: `${r.x}%`, top: `${r.y}%`, color: profil.renk, fontSize: r.s, fontFamily: "var(--font-display)", userSelect: "none" }}>
            {r.g}
          </motion.div>
        ))}
      </div>
      {/* Katman C — uzak yıldız/veri noktaları */}
      <div style={{ position: "absolute", inset: 0, transform: `translate(${mouse.x * 6}px, ${mouse.y * 6}px)`, transition: "transform 0.9s ease-out" }}>
        {YILDIZ_KONUM.map((s, i) => (
          <motion.div key={i}
            animate={reduced ? { opacity: 0.18 } : { opacity: [0.08, 0.35, 0.08] }}
            transition={{ duration: 3.5 + (i % 5), repeat: Infinity, delay: i * 0.35, ease: "easeInOut" }}
            style={{ position: "absolute", left: `${s.x}%`, top: `${s.y}%`, width: 2, height: 2, borderRadius: "50%", background: GOLD }}
          />
        ))}
      </div>
      {/* ışık kırılması (glow) */}
      <motion.div
        animate={reduced ? {} : { opacity: [profil.glow * 0.3, profil.glow * 0.6, profil.glow * 0.3] }}
        transition={{ duration: 10 / profil.pulse, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", top: "18%", right: "12%", width: 340, height: 340, borderRadius: "50%", background: `radial-gradient(circle, ${profil.renk}22 0%, transparent 70%)`, filter: "blur(50px)", transform: `translate(${mouse.x * 10}px, ${mouse.y * 10}px)`, transition: "transform 0.8s ease-out" }}
      />
    </div>
  );
}

function SessizOlaylar({ profil, mode }: { profil: AtmosferProfil; mode: FrequencyKey }) {
  const [olay, setOlay] = useState<{ tip: "metin" | "parilti"; deger: string; x: number; y: number; id: number } | null>(null);
  const sayac = useRef(0);

  const tetikle = useCallback(() => {
    const tip = Math.random() > 0.4 ? "metin" : "parilti";
    const kayitlar = KIRIK_KAYITLAR[mode];
    setOlay({
      tip,
      deger: tip === "metin" ? kayitlar[Math.floor(Math.random() * kayitlar.length)] : "",
      x: 8 + Math.random() * 78, y: 18 + Math.random() * 60, id: sayac.current++,
    });
  }, [mode]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    // ilk olay erken (3-5 sn) — kullanıcı hemen görsün
    let ilk = true;
    const dongu = () => {
      const [min, max] = profil.olayAraligi;
      const bekle = ilk ? 3500 : (min + Math.random() * (max - min)) * 1000;
      ilk = false;
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
            animate={{ opacity: olay.tip === "metin" ? [0, 0.42, 0.42, 0] : [0, 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: olay.tip === "metin" ? 4.5 : 2.2, times: olay.tip === "metin" ? [0, 0.15, 0.7, 1] : [0, 0.4, 1], ease: "easeInOut" }}
            onAnimationComplete={() => setOlay(null)}
            style={{ position: "absolute", left: `${olay.x}%`, top: `${olay.y}%` }}
          >
            {olay.tip === "metin" ? (
              <span className="ui" style={{ fontSize: 11, letterSpacing: 3, color: profil.renk, textTransform: "uppercase", whiteSpace: "nowrap" }}>
                {olay.deger}
              </span>
            ) : (
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: GOLD, boxShadow: `0 0 16px 3px ${GOLD}` }} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RUNE_KONUM = [
  { x: 12, y: 30, s: 26, g: "᚛" }, { x: 82, y: 22, s: 22, g: "ᚲ" },
  { x: 24, y: 70, s: 30, g: "ᛟ" }, { x: 70, y: 65, s: 24, g: "ᚦ" },
  { x: 45, y: 18, s: 20, g: "ᛜ" }, { x: 90, y: 50, s: 28, g: "ᚹ" },
];
const YILDIZ_KONUM = Array.from({ length: 36 }, (_, i) => ({ x: (i * 37) % 100, y: (i * 53) % 100 }));
