// =====================================================================
// BEHAVIOR BINDING — frekans = DAVRANIŞ MODU (içerik etiketi DEĞİL)
// Kritik ilke (Faz 9.2): mapping content'e değil davranışa bağlanır.
// UI değişmez, metin değişmez — kullanıcının okuma DAVRANIŞI değişir.
//
// "Kullanıcı hangi frekansa BAKAR değil, hangi frekansta KALIR?"
// Bu yüzden her frekans bir davranış imzasıyla tanımlanır, içerikle değil.
// =====================================================================

import { FrequencyKey } from "./ontology";

// her frekansın DAVRANIŞ modu — okurun içine düştüğü hareket biçimi
export type BehaviorMode =
  | "inward_density"        // ALBASTI — içe çöküş; okur yaklaşır, hızlanır, sıkışır
  | "outward_structure"    // KOZMOS — dışa yapı; okur yavaşlar, uzaklaşır, tarar
  | "relational_tension"   // TENGRI — gerilim; okur iki uç arasında salınır
  | "epistemic_instability"; // KOROGLU — çatlak; okur sabitlenemez, geri döner

export const BEHAVIOR_OF: Record<FrequencyKey, BehaviorMode> = {
  ALBASTI: "inward_density",
  KOZMOS: "outward_structure",
  TENGRI: "relational_tension",
  KOROGLU: "epistemic_instability",
};

// her davranış modunun GÖZLENEBİLİR imzası (closed alpha'da ölçülür)
// Not: bunlar UI'yi değiştirmez — kullanıcı davranışının BEKLENEN şeklidir.
// Gerçek davranış bu beklentiden saparsa, sistem o frekansta "çalışmıyor".
export interface BehaviorSignature {
  mode: BehaviorMode;
  // beklenen okuma davranışı (hipotez — alpha bunu test eder)
  beklenenDwell: "uzun" | "orta" | "kısa" | "değişken";
  beklenenScroll: "hızlanan" | "yavaşlayan" | "salınan" | "düzensiz";
  // "düşme" sinyali: bu frekansa GERÇEKTEN düşüldüğünün göstergesi
  dusmeSinyali: string;
  // "okuma" sinyali: yalnızca BAKILDIĞININ (düşülmediğinin) göstergesi
  bakmaSinyali: string;
}

export const SIGNATURES: Record<BehaviorMode, BehaviorSignature> = {
  inward_density: {
    mode: "inward_density",
    beklenenDwell: "uzun",
    beklenenScroll: "yavaşlayan",
    dusmeSinyali: "Kalp bloğunda scroll yavaşlar veya durur (yaklaşma).",
    bakmaSinyali: "Hızlı scroll, kalpte duraksama yok (yüzeyde kaldı).",
  },
  outward_structure: {
    mode: "outward_structure",
    beklenenDwell: "orta",
    beklenenScroll: "düzensiz",
    dusmeSinyali: "Üç dünya bloğunda tarama/geri-dönüş (yapıyı gezme).",
    bakmaSinyali: "Tek geçişte dipten çıkış (yapıya girmedi).",
  },
  relational_tension: {
    mode: "relational_tension",
    beklenenDwell: "değişken",
    beklenenScroll: "salınan",
    dusmeSinyali: "İrade kutbu etkileşimi; iki uç arasında gidip gelme.",
    bakmaSinyali: "Kutuplara dokunmadan geçiş (gerilimi hissetmedi).",
  },
  epistemic_instability: {
    mode: "epistemic_instability",
    beklenenDwell: "değişken",
    beklenenScroll: "düzensiz",
    dusmeSinyali: "Köroğlu'na geri dönüş (return rate) — çatlak çağırıyor.",
    bakmaSinyali: "Tek ziyaret, geri dönüş yok (çatlağı 'ilginç' bulup geçti).",
  },
};

// asıl ölçüm sorusu — metrik değil, ontolojik:
export const CORE_QUESTION = "Kullanıcı okudu mu, yoksa düştü mü?";

// bir geçiş örüntüsünün anlamı (transition pattern analizi için)
// hangi frekanstan sonra hangisi geliyor → kullanıcının kendi yörüngesi
export function gecisAnlami(from: FrequencyKey, to: FrequencyKey): string {
  const b = BEHAVIOR_OF;
  if (b[from] === "epistemic_instability") return "çatlaktan toparlanma — hangi saf moda kaçtı?";
  if (b[to] === "epistemic_instability") return "çatlağa yöneliş — sabit modlar yetmedi mi?";
  if (b[from] === "inward_density" && b[to] === "outward_structure") return "çöküşten boşluğa — nefes arayışı";
  if (b[from] === "outward_structure" && b[to] === "inward_density") return "boşluktan çöküşe — yakınlık arayışı";
  return "saf modlar arası gezinme";
}
