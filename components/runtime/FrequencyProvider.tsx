"use client";
// =====================================================================
// FREQUENCY PROVIDER — runtime'ın beyni
// Üç AYRIK state katmanı (Anayasa disiplini, karıştırılmaz):
//   1. Ontolojik state: mode, transition, drift
//   2. Memory state: izleme (visit history, fading)
//   3. UI state: overlay, sound, reducedMotion
// =====================================================================

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { FrequencyKey, FREQUENCIES, DEFAULT_FREQ, KOROGLU_KIMLIKLER, ALL_FREQ_KEYS } from "@/lib/ontology";
import { Izleme, BOS_IZLEME, gecisiKaydet } from "@/lib/myth-reading";
import { izle } from "@/lib/telemetry";

interface OntolojikState {
  mode: FrequencyKey;
  oncekiMode: FrequencyKey | null;
  toparlaniyor: boolean; // anti-ghost: Köroğlu'ndan çıkış
  korogluKimlik: string;
}
interface UIState {
  mitolojiAcik: boolean;
  reducedMotion: boolean;
}

interface FrekContext {
  onto: OntolojikState;
  izleme: Izleme;
  ui: UIState;
  setMode: (m: FrequencyKey) => void;
  rasgele: () => void;
  mitolojiyiAc: () => void;
  mitolojiyiKapat: () => void;
}

const Ctx = createContext<FrekContext | null>(null);
export const useFrek = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useFrek must be used within FrequencyProvider");
  return c;
};

const STORAGE_KEY = "bayterek_izleme";

export function FrequencyProvider({
  children,
  initialMode = DEFAULT_FREQ,
}: {
  children: React.ReactNode;
  initialMode?: FrequencyKey;
}) {
  const [onto, setOnto] = useState<OntolojikState>({
    mode: initialMode, oncekiMode: null, toparlaniyor: false,
    korogluKimlik: KOROGLU_KIMLIKLER[0],
  });
  const [izleme, setIzleme] = useState<Izleme>(BOS_IZLEME);
  const [ui, setUI] = useState<UIState>({ mitolojiAcik: false, reducedMotion: false });
  const modeStart = useRef<number>(Date.now());

  // --- Memory: yükle (oturumlar arası) ---
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Izleme;
        // tekrar ziyaret sinyali
        if (parsed.sonZiyaret) {
          const gunFark = (Date.now() - parsed.sonZiyaret) / 86400000;
          if (gunFark > 0.5) izle({ tip: "tekrar_ziyaret", gunFark });
        }
        setIzleme(parsed);
      }
    } catch { /* ilk ziyaret */ }
    // reduced motion tercihi
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setUI((s) => ({ ...s, reducedMotion: mq.matches }));
  }, []);

  const izKaydet = useCallback((yeni: Izleme) => {
    setIzleme(yeni);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(yeni)); } catch {}
  }, []);

  // --- Ontolojik: mode geçişi (route = bakış açısı, runtime sürekli) ---
  const setMode = useCallback((m: FrequencyKey) => {
    setOnto((prev) => {
      if (m === prev.mode) return prev;
      const gecen = Date.now() - modeStart.current;
      // memory state'i ayrı güncelle (karıştırma yok)
      setIzleme((curIz) => {
        const yeni = gecisiKaydet(curIz, prev.mode, m, gecen);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(yeni)); } catch {}
        return yeni;
      });
      izle({ tip: "frekans_gecisi", from: prev.mode, to: m, t: Date.now() });
      izle({ tip: "dwell", mode: prev.mode, ms: gecen });
      if (prev.mode === "KOROGLU") izle({ tip: "koroglu_kalis", ms: gecen });
      modeStart.current = Date.now();

      const toparlaniyor = prev.mode === "KOROGLU"; // anti-ghost
      if (toparlaniyor) setTimeout(() => setOnto((s) => ({ ...s, toparlaniyor: false })), 1200);

      return { ...prev, mode: m, oncekiMode: prev.mode, toparlaniyor };
    });
  }, []);

  const rasgele = useCallback(() => {
    setOnto((prev) => {
      const ks = ALL_FREQ_KEYS.filter((k) => k !== prev.mode);
      const hedef = ks[Math.floor(Math.random() * ks.length)];
      // setMode mantığını tetikle
      queueMicrotask(() => setMode(hedef));
      return prev;
    });
  }, [setMode]);

  // --- Köroğlu kimliği salınır (çatlak reçetesi) ---
  useEffect(() => {
    if (onto.mode !== "KOROGLU") return;
    const id = setInterval(() => {
      setOnto((s) => {
        const i = (KOROGLU_KIMLIKLER.indexOf(s.korogluKimlik) + 1) % KOROGLU_KIMLIKLER.length;
        return { ...s, korogluKimlik: KOROGLU_KIMLIKLER[i] };
      });
    }, 2600);
    return () => clearInterval(id);
  }, [onto.mode]);

  const mitolojiyiAc = useCallback(() => {
    setUI((s) => ({ ...s, mitolojiAcik: true }));
    izle({ tip: "yildiz_panel_acildi", t: Date.now() });
  }, []);
  const mitolojiyiKapat = useCallback(() => setUI((s) => ({ ...s, mitolojiAcik: false })), []);

  return (
    <Ctx.Provider value={{ onto, izleme, ui, setMode, rasgele, mitolojiyiAc, mitolojiyiKapat }}>
      {children}
    </Ctx.Provider>
  );
}
