// =====================================================================
// OBSERVABILITY — zengin gözlem katmanı (closed alpha v1)
//
// KRİTİK AYRIM: Bu katman GÖZLER, öğrenmez. Sistem kendini otomatik
// değiştirmez. Veriyi İNSANA sunar; yorum ve değişiklik insanın elinde.
//
// Neden? Anayasa: sistemin gücü dürüstlüğüydü. Otomatik optimizasyon
// "evren seni okuyor"u "evren seni avlıyor"a çevirir — engagement
// avcısına. Feedback-to-model loop İNSAN üzerinden geçer, otomatik değil.
//
// İki gerçek boşluğu kapatır:
//   1. Transition fiziği — "nasıl geçti", sadece "nerede kaldı" değil
//   2. Hibrit/drift okuma — kullanıcı tek frekansta değil, salınımda
// =====================================================================

import { FrequencyKey } from "./ontology";
import { BEHAVIOR_OF, gecisAnlami } from "./behavior-binding";

// --- 1. TRANSITION FİZİĞİ ---
// Geçiş bir state değişimi değil, bir OLAY. Asıl bilgi "nasıl"da.
export interface GecisOlayi {
  from: FrequencyKey;
  to: FrequencyKey;
  // geçiş fiziği: ani mi, sürünerek mi, kararsız mı?
  hiz: "ani" | "tereddütlü" | "kararsız"; // önceki dwell + ara geçişlerden çıkarılır
  oncekiDwellMs: number;
  // geçişten önce başka frekansa "değip dönme" oldu mu? (kararsızlık izi)
  araSapma: boolean;
  anlam: string; // behavior-binding'den
  t: number;
}

export function gecisFizigi(
  from: FrequencyKey,
  to: FrequencyKey,
  oncekiDwellMs: number,
  sonGecisler: FrequencyKey[]
): GecisOlayi {
  // ani: kısa dwell + düz geçiş. tereddütlü: uzun dwell. kararsız: ara sapma var.
  const son3 = sonGecisler.slice(-3);
  const araSapma = son3.length >= 2 && son3[son3.length - 1] === son3[son3.length - 3];
  const hiz: GecisOlayi["hiz"] = araSapma
    ? "kararsız"
    : oncekiDwellMs > 30000 ? "tereddütlü" : "ani";
  return { from, to, hiz, oncekiDwellMs, araSapma, anlam: gecisAnlami(from, to), t: Date.now() };
}

// --- 2. HİBRİT / DRIFT OKUMA ---
// Kullanıcı tek frekansta "saf" davranmaz. Salınım NOISE değil, sinyaldir.
export interface DriftProfili {
  // baskın frekans değil — frekans KARIŞIMI
  karisim: Partial<Record<FrequencyKey, number>>; // normalize ağırlık
  hibrit: boolean; // iki frekans birbirine yakınsa
  hibritCifti: [FrequencyKey, FrequencyKey] | null;
  // salınım: aynı iki frekans arasında tekrar tekrar gidip gelme
  salinim: boolean;
  yorum: string;
}

export function driftOku(sure: Partial<Record<FrequencyKey, number>>, sonPencere: FrequencyKey[]): DriftProfili {
  const toplam = Object.values(sure).reduce((a, b) => a + (b || 0), 0) || 1;
  const karisim = Object.fromEntries(
    Object.entries(sure).map(([k, v]) => [k, (v || 0) / toplam])
  ) as Partial<Record<FrequencyKey, number>>;

  const sirali = Object.entries(karisim).sort((a, b) => (b[1] as number) - (a[1] as number));
  const ilk = sirali[0];
  const ikinci = sirali[1];
  // hibrit: ilk iki frekans birbirine yakın (fark < 0.2)
  const hibrit = !!(ikinci && (ilk[1] as number) - (ikinci[1] as number) < 0.2 && (ikinci[1] as number) > 0.15);
  const hibritCifti = hibrit ? [ilk[0], ikinci[0]] as [FrequencyKey, FrequencyKey] : null;

  // salınım: son pencerede A-B-A-B örüntüsü
  const p = sonPencere.slice(-4);
  const salinim = p.length === 4 && p[0] === p[2] && p[1] === p[3] && p[0] !== p[1];

  let yorum: string;
  if (salinim) yorum = "Salınımda — iki frekans arasında karar veremiyor ya da ikisine birden ihtiyaç duyuyor.";
  else if (hibrit && hibritCifti) yorum = `Hibrit okuma: ${hibritCifti[0]} + ${hibritCifti[1]}. Tek frekans yetmiyor.`;
  else yorum = "Tek frekans baskın — saf okuma.";

  return { karisim, hibrit, hibritCifti, salinim, yorum };
}

// --- 3. EXIT REASON INFERENCE (sınırlı çıkarım) ---
// "Neden çıktı?" — kesin değil, hipotez. Dürüstçe "bilinmez" de der.
export type CikisNedeni = "doydu" | "kayboldu" | "kırıldı" | "bilinmez";

export function cikisNedeni(sonMode: FrequencyKey, sonDwellMs: number, gecisSayisi: number): CikisNedeni {
  const sn = sonDwellMs / 1000;
  if (gecisSayisi >= 4 && sn > 30) return "doydu"; // çok gezdi, son frekansta kaldı
  if (BEHAVIOR_OF[sonMode] === "epistemic_instability" && sn < 8) return "kırıldı"; // Köroğlu'nda kısa = çatlak itti
  if (sn < 5 && gecisSayisi <= 1) return "kayboldu"; // hemen çıktı, bağlanmadı
  return "bilinmez"; // dürüstlük: çoğu çıkış okunamaz
}
