// =====================================================================
// CANON FREEZE — dondurulmuş referans varlıklar
// Bu dosyadan sonra metinler EDIT EDİLMEZ. Yalnızca "referans varlık".
// Her canon: frozen flag + hash kilidi + frekans etiketi (sabit).
// Yeniden yazma = anayasa ihlali. Optimize etme döngüsü burada biter.
// =====================================================================

import { FrequencyKey } from "./ontology";

export interface FrozenCanon {
  slug: string;
  frequency: FrequencyKey;
  version: "frozen";
  hash: string; // içerik kilidi (sha256-16)
  path: string; // content/ altındaki MDX/MD yolu
}

// Faz 9.2'de dondurulan ilk canon seti (referans varlıklar)
export const FROZEN_CANON: Record<FrequencyKey, FrozenCanon> = {
  ALBASTI: {
    slug: "albasti", frequency: "ALBASTI", version: "frozen",
    hash: "788dc15b6a968ad5", path: "content/yaratiklar/albasti.md",
  },
  KOZMOS: {
    slug: "kozmos", frequency: "KOZMOS", version: "frozen",
    hash: "815507e968c0a745", path: "content/kozmos/kozmos.md",
  },
  TENGRI: {
    slug: "tengri", frequency: "TENGRI", version: "frozen",
    hash: "82e4b5a75fabe107", path: "content/tanrilar/tengri.md",
  },
  KOROGLU: {
    slug: "koroglu", frequency: "KOROGLU", version: "frozen",
    hash: "871a2fbb88d597d7", path: "content/catlak/koroglu.md",
  },
};

export const CANON_FROZEN_AT = "Faz 9.2";
