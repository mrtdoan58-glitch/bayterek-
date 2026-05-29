// =====================================================================
// TELEMETRY — davranışsal sinyaller (Faz 9.3 closed alpha için)
// KPI: "insanlar burada anlam hissediyor mu?" — teknik metrik değil.
// Şimdilik konsola/storage'a yazar; sonra gerçek analytics'e bağlanır.
// =====================================================================

import { FrequencyKey } from "./ontology";

export type DavranisOlayi =
  | { tip: "frekans_gecisi"; from: FrequencyKey; to: FrequencyKey; t: number }
  | { tip: "dwell"; mode: FrequencyKey; ms: number }
  | { tip: "koroglu_kalis"; ms: number }
  | { tip: "yildiz_panel_acildi"; t: number } // ✶ dönüş davranışı
  | { tip: "dunya_agaci_etkilesim"; t: number }
  | { tip: "tekrar_ziyaret"; gunFark: number };

const KUYRUK: DavranisOlayi[] = [];

export function izle(olay: DavranisOlayi) {
  KUYRUK.push(olay);
  if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
    // closed alpha'da görünür olsun
    // eslint-disable-next-line no-console
    console.debug("[bayterek:telemetry]", olay);
  }
  // TODO (Faz 9.3): gerçek analytics endpoint'e gönder (batch)
}

export function kuyruguAl() {
  return [...KUYRUK];
}

// closed alpha'da izlenecek davranışsal KPI'lar (referans)
export const ALPHA_KPI = [
  "frekans geçiş sayısı / oturum",
  "ortalama dwell time / frekans",
  "Köroğlu kalış süresi (çatlak hissi)",
  "✶ panel dönüş oranı (okunuyorum hissi)",
  "Dünya Ağacı etkileşim oranı (yön duygusu)",
  "tekrar ziyaret oranı (evren çağırıyor mu)",
] as const;

// "okudu mu, düştü mü?" değerlendirmesi (dwell → davranış imzası)
// Bir frekansta beklenen dwell'e uygun davranış = DÜŞTÜ; aksi = BAKTI.
import { BEHAVIOR_OF, SIGNATURES } from "./behavior-binding";

export function okudumuDustumu(mode: FrequencyKey, dwellMs: number): "düştü" | "baktı" | "belirsiz" {
  const sig = SIGNATURES[BEHAVIOR_OF[mode]];
  const sn = dwellMs / 1000;
  // kaba eşikler — alpha verisiyle kalibre edilecek (şimdilik hipotez)
  const esik = { uzun: 45, orta: 25, kısa: 10, değişken: 20 }[sig.beklenenDwell];
  if (sn < 6) return "baktı"; // 6 sn altı: yüzeyde geçti
  if (sn >= esik) return "düştü";
  return "belirsiz";
}
