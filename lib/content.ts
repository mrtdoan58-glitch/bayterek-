// =====================================================================
// CONTENT — şema + yükleyici (ilk aşama: local, CMS değil)
// Anayasa madde 4 (ritim) ve madde 6 (editoryal) içeriğe gömülü.
// Faz 9.2'de gerçek canon metinleriyle dolar.
// =====================================================================

import { FrequencyKey } from "./ontology";

// sayfa-içi yoğunluk ritmi blokları (Anayasa madde 4)
export interface VarlikIcerik {
  slug: string;
  frekans: FrequencyKey;
  ad: string;
  etiket: string;
  // %20 ZİRVE — eksik-bilgi açılışı (net tanım + aralık)
  acilis: string;
  // %50 ORTA MİTİK — etkileşimli kalp (tip frekansa göre değişir)
  kalpTip: "katmanlar" | "kutuplar" | "psikoloji" | "catismali";
  // %30 BİLGİ TAŞIYICI — sade + dürüstlük notu (çatlakta: çözülmeyen kapanış)
  bilgi: { label: string; baslik: string; metin: string; not: string };
  // pillar mı satellite mı (denge yasası denetimi için)
  tur: "pillar" | "satellite";
}

// İlk canon seti yer tutucuları (Faz 9.2'de gerçek metin gelir).
// Burada YAPISAL iskelet hazır; metin alanları kısa örneklerle dolu.
export const CANON: Record<FrequencyKey, VarlikIcerik> = {
  KOZMOS: {
    slug: "kozmos", frekans: "KOZMOS", ad: "Kozmos", etiket: "EVRENİN YAPISI", tur: "pillar",
    acilis:
      "Türk mitolojisinde evren bir yapıdır: üç dünya, tek eksen. Nereden başladığını kimse görmedi — çünkü başlangıç, anlatının kendisinden daha eskidir.",
    kalpTip: "katmanlar",
    bilgi: {
      label: "Dünya Ağacı", baslik: "Üç dünyayı bağlayan tek şey",
      metin:
        "Bay Terek kökleriyle yer altına iner, gövdesiyle insan dünyasını taşır, dallarıyla göğü tutar. Ağaç bir harita değildir; evrenin nasıl ayakta durduğunun ta kendisidir.",
      not: "Üç dünya modeli farklı Altay topluluklarında farklı katman sayılarıyla anlatılır.",
    },
  },
  TENGRI: {
    slug: "tengri", frekans: "TENGRI", ad: "Tengri", etiket: "GÖĞÜN İRADESİ", tur: "pillar",
    acilis:
      "Tengri'nin adı göğün kendisinden gelir — sınırsız, mavi, her şeyin üstünde. Ama Tengri yalnızca gök değildir; gökteki iradedir. Bir şeyi diler ve olur.",
    kalpTip: "kutuplar",
    bilgi: {
      label: "İrade Nedir", baslik: "Bir tanrı ne ister?",
      metin:
        "Tengri buyurur, denge kurar. Karşısında değil ama uzağında Erlik durur. İkisi düşman değildir; bir gerilimdir. Biri olmadan diğeri anlamını yitirir.",
      not: "'Tengri' farklı topluluklarda hem gök hem en yüce tanrı anlamında kullanılır.",
    },
  },
  ALBASTI: {
    slug: "albasti", frekans: "ALBASTI", ad: "Albastı", etiket: "ALT DÜNYA · LOHUSA KORKUSU", tur: "pillar",
    acilis:
      "Albastı'nın adı iki sözcükten doğar — al, kızıl; bastı, çöken. Lohusayı vurduğuna inanılır. Ama hangi kızıllığın kanı, hangisinin ateşi olduğunu hiçbir kaynak tam söylemez.",
    kalpTip: "psikoloji",
    bilgi: {
      label: "Psikolojik Okuma", baslik: "Bir korkuya verilen yüz",
      metin:
        "Albastı, doğumun gerçek tehlikesinin folklorik bedenidir. Açıklanamayan ölümlere bir yüz, bir isim verdi. Korkuyu adlandırmak, onu bir nebze evcilleştirmektir.",
      not: "Bu bir halk inancıdır; bölgeden bölgeye değişir, kesin tarihsel kayıt değildir.",
    },
  },
  KOROGLU: {
    slug: "koroglu", frekans: "KOROGLU", ad: "Köroğlu", etiket: "?", tur: "satellite",
    acilis:
      "Bir kahraman mı, yaşamış bir âşık mı, yoksa yerin gönderdiği bir ad mı? Köroğlu dört şeyin sınırında durur — ve hiçbiri onu tam tutamaz.",
    kalpTip: "catismali",
    bilgi: {
      label: "Çatlak", baslik: "Neden hiçbir dünyaya tam ait değil",
      metin:
        "Albastı korkunun bedeniydi, Kozmos düzenin kendisiydi, Tengri saf iradeydi. Köroğlu dört alemden de pay alır. Onu tek bir dünyaya koymak, bir şeyini kesip atmak demektir.",
      not: "Bu çatlak kapanmaz — ve belki de kapanmamalı. Onu tanımlayan şey, tam tanımlanamamasıdır.", // çözülmeyen kapanış
    },
  },
};

export function getCanon(frekans: FrequencyKey): VarlikIcerik {
  return CANON[frekans];
}
