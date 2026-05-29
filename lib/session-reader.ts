// =====================================================================
// SESSION READER — gözlemi İNSANA sunan katman (otomatik değil)
//
// Bu, "feedback-to-model loop"un İNSAN halkasıdır. Sistem veriyi okur,
// özetler, İNSANA sunar. Kararı insan verir. Otomatik optimizasyon YOK.
//
// "Evren insanı okuduğunu sanıyor — gerçekten okuyor mu?" sorusunun
// cevabı bu katmanda görünür: gözlemci (sen) sistemin okumasını okur.
// =====================================================================

import { FrequencyKey, FREQUENCIES } from "./ontology";
import { Izleme } from "./myth-reading";
import { driftOku, cikisNedeni } from "./observability";
import { okudumuDustumu } from "./telemetry";
import { BEHAVIOR_OF, SIGNATURES, CORE_QUESTION } from "./behavior-binding";

export interface OturumOkumasi {
  // her frekans için: okudu mu, düştü mü?
  frekansDavranisi: Record<FrequencyKey, "düştü" | "baktı" | "belirsiz" | "ziyaret-yok">;
  drift: ReturnType<typeof driftOku>;
  cikis: ReturnType<typeof cikisNedeni> | "oturum-sürüyor";
  // sistemin kendi okuması hakkında dürüst not
  sistemNotu: string;
  // İNSANA sorular (otomatik karar değil — gözlemci yorumlasın)
  insanaSorular: string[];
}

export function oturumuOku(izleme: Izleme, aktifMode: FrequencyKey, aktifDwellMs: number): OturumOkumasi {
  const frekansDavranisi = {} as OturumOkumasi["frekansDavranisi"];
  (Object.keys(FREQUENCIES) as FrequencyKey[]).forEach((k) => {
    const dwell = izleme.sure[k] || 0;
    if (dwell === 0) frekansDavranisi[k] = "ziyaret-yok";
    else frekansDavranisi[k] = okudumuDustumu(k, dwell);
  });

  const drift = driftOku(izleme.sure, izleme.sonPencere);
  const cikis = izleme.sonZiyaret ? cikisNedeni(aktifMode, aktifDwellMs, izleme.gecis) : "oturum-sürüyor";

  // sistemin dürüst öz-değerlendirmesi
  const dustuSayisi = Object.values(frekansDavranisi).filter((v) => v === "düştü").length;
  const baktiSayisi = Object.values(frekansDavranisi).filter((v) => v === "baktı").length;
  let sistemNotu: string;
  if (dustuSayisi === 0 && baktiSayisi > 0) {
    sistemNotu = "Hiçbir frekansa düşülmedi — sistem şu an 'iyi içerik' gibi okunuyor, 'algı motoru' gibi değil. Frekanslar ayrışmıyor olabilir.";
  } else if (dustuSayisi >= 2) {
    sistemNotu = "Birden fazla frekansa düşüldü — sistem algı motoru gibi çalışıyor. Frekanslar ayrışıyor.";
  } else if (dustuSayisi === 1) {
    sistemNotu = "Tek frekansa düşüldü — o frekans çalışıyor, diğerleri henüz temas etmedi ya da yüzeyde kaldı.";
  } else {
    sistemNotu = "Yeterli sinyal yok — daha fazla oturum gerekli.";
  }

  // İNSANA sorular — sistem cevap vermez, gözlemci yorumlar
  const insanaSorular: string[] = [];
  if (frekansDavranisi.KOROGLU === "baktı") {
    insanaSorular.push("Köroğlu 'baktı' düzeyinde kaldı — çatlak 'ilginç' bulunup geçildi mi, yoksa kırma hissi mi verdi? (return rate'e bak)");
  }
  if (drift.salinim) {
    insanaSorular.push(`Salınım var (${drift.yorum}) — bu sağlıklı bir gerilim mi, yoksa kullanıcı kaybolma mı? Otomatik karar verme; oturumu izle.`);
  }
  if (cikis === "kırıldı") {
    insanaSorular.push("Çıkış 'kırıldı' olarak okundu — ama bu çıkarım kesin değil. Gerçek sebep bilinmez olabilir.");
  }
  if (dustuSayisi === 0 && baktiSayisi >= 2) {
    insanaSorular.push("KRİTİK: Frekanslar ayrışmıyor olabilir. Sorun binding'de — ama CANON METNİNİ DEĞİŞTİRME (donduruldu). Önce daha çok oturum.");
  }

  return { frekansDavranisi, drift, cikis, sistemNotu, insanaSorular };
}

// asıl soru, her okumanın başında hatırlatılır
export const READER_PRINCIPLE = `${CORE_QUESTION} — ve bu okuma bir KARAR değil, bir GÖZLEM. Sistem kendini değiştirmez; sen yorumlarsın.`;
