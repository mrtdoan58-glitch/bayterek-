// =====================================================================
// MYTH READING — evrenin kullanıcıyı okuması (saf fonksiyonlar)
// Evrilen yorum + dürüst solma. Ham veri sabit; yorum yaşar.
// =====================================================================

import { FREQUENCIES, FrequencyKey, ALL_FREQ_KEYS } from "./ontology";
import { MEMORY_LAW } from "./constitution";

export interface Izleme {
  sure: Partial<Record<FrequencyKey, number>>; // her frekansta geçen ms (HAM KAYIT — sabit)
  gecis: number;
  korogluZiyaret: number;
  sonPencere: FrequencyKey[]; // kayan pencere (son geçişler)
  sonZiyaret: number | null; // solma hesabı
}

export const BOS_IZLEME: Izleme = {
  sure: {}, gecis: 0, korogluZiyaret: 0, sonPencere: [], sonZiyaret: null,
};

export type Evre = "ilk" | "tanisma" | "tanima" | "yargi" | "gozden_gecirme";

const CEKIRDEK: Record<FrequencyKey, string> = {
  KOZMOS: "Genişlemeye çekiliyorsun. Boşluk seni korkutmuyor; orada bir yapı görüyorsun.",
  TENGRI: "Gerilimde duruyorsun. İki ucu birden tutmaya, kolay tarafı seçmemeye eğilimlisin.",
  ALBASTI: "Karanlığa yaklaşıyorsun. Korkudan kaçmak yerine ona bir isim vermek istiyorsun.",
  KOROGLU: "Sınırda yürüyorsun. Net cevaplar seni rahatlatmıyor; çatlak sana daha dürüst geliyor.",
};

const EVRE_ONEK: Record<Exclude<Evre, "ilk">, string> = {
  tanisma: "Seni daha yeni tanımaya başladım. İlk izlenimim: ",
  tanima: "Artık bir desen görüyorum. ",
  yargi: "Seni okudum. ",
  gozden_gecirme: "Uzun zamandır buradasın, ve okumam değişiyor. ",
};

export interface Okuma {
  evre: Evre;
  baslik: string; // panel üst etiketi
  ilkZiyaret: boolean;
  cekirdekCumle: string | null;
  baskin: FrequencyKey;
  ikincil: FrequencyKey | null;
  sonBaskin: FrequencyKey | null;
  kayma: boolean; // son eğilim çekirdekten ayrıştı mı
  solmus: boolean;
  solmaFaktoru: number; // 0..1
  oranlar: Record<FrequencyKey, number>;
  egilim: (k: FrequencyKey) => string;
}

export function oku(izleme: Izleme): Okuma {
  const toplam = Object.values(izleme.sure).reduce((a, b) => a + (b || 0), 0) || 1;

  const oranlar = ALL_FREQ_KEYS.reduce((acc, k) => {
    acc[k] = (izleme.sure[k] || 0) / toplam;
    return acc;
  }, {} as Record<FrequencyKey, number>);

  const sirali = ALL_FREQ_KEYS
    .map((k) => [k, izleme.sure[k] || 0] as [FrequencyKey, number])
    .sort((a, b) => b[1] - a[1]);
  const baskin = sirali[0][0];
  const ikincil = sirali[1] && sirali[1][1] > 0 ? sirali[1][0] : null;

  // kayan pencere
  const sonSayim: Partial<Record<FrequencyKey, number>> = {};
  izleme.sonPencere.forEach((m) => (sonSayim[m] = (sonSayim[m] || 0) + 1));
  const sonBaskin =
    (Object.entries(sonSayim).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0] as FrequencyKey) ||
    null;
  const kayma = !!sonBaskin && sonBaskin !== baskin && izleme.gecis >= 5;

  // solma (dürüst): yalnızca yorumsal — veri sabit
  const gunGecti = izleme.sonZiyaret ? (Date.now() - izleme.sonZiyaret) / 86400000 : 0;
  const solmaFaktoru = Math.max(0, Math.min(1, gunGecti / MEMORY_LAW.fullFadeDays));
  const solmus = gunGecti > MEMORY_LAW.fadeFeltAfterDays;

  const ilkZiyaret = izleme.gecis === 0;
  const evre: Evre = ilkZiyaret
    ? "ilk"
    : izleme.gecis < 3 ? "tanisma"
    : izleme.gecis < 8 ? "tanima"
    : izleme.gecis < 16 ? "yargi"
    : "gozden_gecirme";

  const baslik = solmus
    ? "Evren seni hatırlıyor"
    : evre === "gozden_gecirme" ? "Evren seni yeniden okuyor"
    : "Evren seni okuyor";

  const cekirdekCumle =
    evre === "ilk" ? null : (EVRE_ONEK[evre] + CEKIRDEK[baskin]);

  const egilim = (k: FrequencyKey) => {
    const o = oranlar[k];
    if (o > 0.45) return "baskın";
    if (o > 0.22) return "belirgin";
    if (o > 0.05) return "ara sıra";
    return "uzak";
  };

  return {
    evre, baslik, ilkZiyaret, cekirdekCumle, baskin, ikincil,
    sonBaskin, kayma, solmus, solmaFaktoru, oranlar, egilim,
  };
}

// kayma cümlesi (evrim anı)
export function kaymaCumlesi(sonBaskin: FrequencyKey): string {
  return `— ama son zamanlarda ${FREQUENCIES[sonBaskin].ad} tarafına kayıyorsun. Belki de seni yanlış okudum. Belki de değişiyorsun.`;
}

// solma cümlesi (dürüst, yalan söylemez)
export const SOLMA_CUMLESI =
  "Bir süredir yoktun. İzin hâlâ burada — silinmedi — ama merkezden biraz uzaklaştı. Seni unutmadım; sadece o ben artık biraz uzakta.";

// çatlak cümlesi
export function korogluCumlesi(z: number): string {
  return z > 0
    ? `Çatlağa ${z === 1 ? "bir kez" : `${z} kez`} yaklaştın — ve her seferinde geri döndün. Çatlak seni hatırlıyor, ama taşımıyor.`
    : "Henüz sınıra dokunmadın. Köroğlu seni bekliyor olabilir.";
}

// yeni geçişi kayda işle (ham veri birikir)
export function gecisiKaydet(
  izleme: Izleme,
  oncekiMode: FrequencyKey,
  yeniMode: FrequencyKey,
  gecenMs: number
): Izleme {
  return {
    sure: { ...izleme.sure, [oncekiMode]: (izleme.sure[oncekiMode] || 0) + gecenMs },
    gecis: izleme.gecis + 1,
    korogluZiyaret: izleme.korogluZiyaret + (yeniMode === "KOROGLU" ? 1 : 0),
    sonPencere: [...izleme.sonPencere, yeniMode].slice(-6),
    sonZiyaret: Date.now(),
  };
}
