// =====================================================================
// ONTOLOJİ — evrenin değişmez tanımları (Anayasa madde 2 & 5)
// Bu dosya "ne vardır"ı tanımlar. Runtime buna göre davranır.
// =====================================================================

export type FrequencyKey = "KOZMOS" | "TENGRI" | "ALBASTI" | "KOROGLU";

export interface Frequency {
  key: FrequencyKey;
  ad: string;
  etiket: string;
  route: string;
  bg: string;
  accent: string;
  accent2: string;
  text: string;
  sub: string;
  treeFocus: "dal" | "merkez" | "kok" | "catlak";
  yon: string;
  // varoluş modu (Anayasa madde 2)
  mod: "duzen" | "irade" | "korku" | "catlak";
  isPure: boolean; // saf frekans mı, çatlak mı
}

export const GOLD = "#C9A961";

export const FREQUENCIES: Record<FrequencyKey, Frequency> = {
  KOZMOS: {
    key: "KOZMOS", ad: "Kozmos", etiket: "EVRENİN YAPISI", route: "/kozmos",
    bg: "#060709", accent: "#8694A8", accent2: "#A9B6C6", text: "#E8E6DF", sub: "#9DA1A8",
    treeFocus: "dal", yon: "dışa açılım", mod: "duzen", isPure: true,
  },
  TENGRI: {
    key: "TENGRI", ad: "Tengri", etiket: "GÖĞÜN İRADESİ", route: "/tanrilar",
    bg: "#070708", accent: GOLD, accent2: "#E0C079", text: "#E8E4DB", sub: "#9D9A92",
    treeFocus: "merkez", yon: "gerilim ekseni", mod: "irade", isPure: true,
  },
  ALBASTI: {
    key: "ALBASTI", ad: "Albastı", etiket: "LOHUSA KORKUSU", route: "/yaratiklar",
    bg: "#060608", accent: "#7A3B2E", accent2: "#D6743C", text: "#E8E4DB", sub: "#9A9690",
    treeFocus: "kok", yon: "içe çöküş", mod: "korku", isPure: true,
  },
  KOROGLU: {
    key: "KOROGLU", ad: "Köroğlu", etiket: "?", route: "/catlak",
    bg: "#070708", accent: "#7E7A86", accent2: "#9C7B4D", text: "#E8E4DB", sub: "#9D9A92",
    treeFocus: "catlak", yon: "kararsızlık", mod: "catlak", isPure: false,
  },
};

// route -> frekans çözümü (route = bakış açısı, runtime = sürekli dünya)
export const ROUTE_TO_FREQ: Record<string, FrequencyKey> = {
  "/kozmos": "KOZMOS",
  "/tanrilar": "TENGRI",
  "/yaratiklar": "ALBASTI",
  "/catlak": "KOROGLU",
};

export const DEFAULT_FREQ: FrequencyKey = "KOZMOS";

// Köroğlu'nun salınan kimlikleri (çatlak reçetesi, Anayasa madde 7)
export const KOROGLU_KIMLIKLER = [
  "DESTAN · HALK KAHRAMANI",
  "TARİH · YAŞAMIŞ BİR ÂŞIK?",
  "MİT · YERİN OĞLU",
  "İRADE · DİRENİŞİN SESİ",
];

export const ALL_FREQ_KEYS = Object.keys(FREQUENCIES) as FrequencyKey[];
