"use client";
// =====================================================================
// FREKANS KALPLERİ — %50 orta mitik blok (frekansa göre etkileşim)
// Her frekansın kalbi farklı: katmanlar/kutuplar/psikoloji/çatışan.
// =====================================================================

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GOLD } from "@/lib/ontology";

const EASE = [0.16, 1, 0.3, 1] as const;

const KATMANLAR = [
  { ad: "Üst Dünya", alt: "Uçmag · Gök", c: "#8694A8" },
  { ad: "Orta Dünya", alt: "Yer · İnsanlar", c: "#9C7B4D" },
  { ad: "Alt Dünya", alt: "Tamag · Yer Altı", c: "#7A3B2E" },
];

export function KalpKozmos() {
  const [aktif, setAktif] = useState(1);
  return (
    <div style={{ display: "grid", gap: 8, maxWidth: 520, margin: "0 auto" }}>
      {KATMANLAR.map((k, i) => (
        <div key={k.ad} onMouseEnter={() => setAktif(i)}
          style={{ padding: "16px 0", borderTop: `1px solid ${aktif === i ? k.c : "#27283055"}`, transition: "all .5s", cursor: "pointer" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
            <span style={{ fontSize: 22, color: aktif === i ? "#E8E6DF" : "#9DA1A8", transition: "color .5s" }}>{k.ad}</span>
            <span className="ui" style={{ fontSize: 10, letterSpacing: 2, color: k.c, textTransform: "uppercase" }}>{k.alt}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function KalpTengri() {
  const [kutup, setKutup] = useState<"TENGRI" | "ERLIK" | null>(null);
  const K = { TENGRI: { ad: "Tengri", yon: "Yukarı", c: "#8694A8" }, ERLIK: { ad: "Erlik", yon: "Aşağı", c: "#7A3B2E" } };
  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "stretch" }}>
        {(["TENGRI", "ERLIK"] as const).map((key, idx) => {
          const d = K[key]; const aktif = kutup === key; const dim = kutup && !aktif;
          return (
            <React.Fragment key={key}>
              {idx === 1 && (
                <div style={{ width: 1, background: `linear-gradient(180deg,#8694A8,${GOLD},#7A3B2E)`, opacity: 0.6, position: "relative" }}>
                  <motion.div animate={{ y: kutup === "TENGRI" ? -24 : kutup === "ERLIK" ? 24 : 0 }} transition={{ duration: 0.8, ease: EASE }}
                    style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 9, height: 9, borderRadius: "50%", background: kutup === "ERLIK" ? "#7A3B2E" : kutup === "TENGRI" ? "#8694A8" : GOLD, boxShadow: `0 0 14px ${kutup === "ERLIK" ? "#7A3B2E" : kutup === "TENGRI" ? "#8694A8" : GOLD}` }} />
                </div>
              )}
              <motion.div onMouseEnter={() => setKutup(key)} animate={{ opacity: dim ? 0.4 : 1 }} transition={{ duration: 0.6 }}
                style={{ flex: 1, padding: "30px 24px", cursor: "pointer", textAlign: idx === 0 ? "right" : "left", background: aktif ? `linear-gradient(${idx === 0 ? "90deg" : "270deg"},transparent,${d.c}11)` : "transparent", transition: "background .6s" }}>
                <div className="ui" style={{ fontSize: 10, letterSpacing: 3, color: d.c, textTransform: "uppercase", marginBottom: 10 }}>{d.yon}</div>
                <div style={{ fontSize: "clamp(28px,5vw,46px)", fontWeight: 300, color: aktif ? "#E8E4DB" : "#9D9A92", transition: "color .5s", lineHeight: 1 }}>{d.ad}</div>
              </motion.div>
            </React.Fragment>
          );
        })}
      </div>
      <p className="ui" style={{ textAlign: "center", fontSize: 12.5, color: "#67645D", marginTop: 24, fontStyle: "italic" }}>
        Düşmanlık değil; gerilim. Biri olmadan diğeri anlamını yitirir.
      </p>
    </div>
  );
}

export function KalpAlbasti() {
  return (
    <p className="ui" style={{ maxWidth: 600, margin: "0 auto", fontSize: "clamp(15px,2.2vw,19px)", lineHeight: 1.8, color: "#E8E4DB", fontStyle: "italic", textAlign: "center", fontWeight: 300 }}>
      Albastı yalnızca bir yaratık değil; doğumun en kırılgan anının cisimleşmiş halidir. Demir, dua ve nöbet — hepsi en savunmasız anı bir toplulukla sarma ritüelidir.
    </p>
  );
}

export function KalpKoroglu() {
  const [acik, setAcik] = useState<number | null>(null);
  const KAYNAKLAR = [
    { ses: "Destan der ki", c: "#9C7B4D", m: "Babası kör edilen Köroğlu, Çamlıbel'e çekildi, beylere baş kaldırdı. O bir kahraman — sınırı yok, ölümü belirsiz." },
    { ses: "Tarih der ki", c: "#7E7A86", m: "16. yüzyıl Celali isyanlarında gerçek bir âşık-eşkıya yaşamış olabilir. Belgeler dağınık. Kanıt, efsanenin gürültüsünde kayboluyor." },
    { ses: "Halk der ki", c: "#7A3B2E", m: "Adı 'yerin oğlu' anlamına gelir kimine göre — ölüden doğan, yeraltından gelen. İnsan mı, yoksa yerin gönderdiği bir şey mi?" },
  ];
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", flexDirection: "column", gap: 10 }}>
      {KAYNAKLAR.map((k, i) => {
        const o = acik === i; const baska = acik !== null && !o;
        return (
          <motion.div key={i} onMouseEnter={() => setAcik(i)} onClick={() => setAcik(o ? null : i)} animate={{ opacity: baska ? 0.45 : 1 }}
            style={{ border: `1px solid ${o ? k.c : "#272830"}`, borderLeft: `3px solid ${k.c}`, background: o ? `${k.c}0c` : "#0E0E11", borderRadius: 2, padding: "18px 22px", cursor: "pointer", transition: "background .5s,border-color .5s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 20, color: o ? "#E8E4DB" : "#9D9A92", fontStyle: "italic", transition: "color .4s" }}>{k.ses}</span>
              <span className="ui" style={{ fontSize: 16, color: k.c }}>{o ? "—" : "+"}</span>
            </div>
            <AnimatePresence>
              {o && <motion.p className="ui" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.5, ease: EASE }} style={{ fontSize: 14, color: "#9D9A92", lineHeight: 1.7, marginTop: 14, fontWeight: 300, overflow: "hidden" }}>{k.m}</motion.p>}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
