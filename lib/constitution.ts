// =====================================================================
// ANAYASA — değiştirilemez yasalar (kod düzeyinde uygulanır)
// Bu dosya "ne yapamaz"ı tanımlar. İhlal edilirse evren dağılır.
// =====================================================================

// Madde 3 — DENGE YASASI (değiştirilemez)
// Frekans dağılımı: %70 saf / %20 hibrit / %10 çatlak.
// Çatlak nadir olmalı; norm haline gelirse anlamını yitirir.
export const BALANCE_LAW = {
  pureRatio: 0.7,
  hybridRatio: 0.2,
  crackRatio: 0.1,
  // bir içerik setinin dengeyi bozup bozmadığını denetler
  validate(counts: { pure: number; hybrid: number; crack: number }) {
    const total = counts.pure + counts.hybrid + counts.crack || 1;
    const crackShare = counts.crack / total;
    return {
      ok: crackShare <= BALANCE_LAW.crackRatio + 0.05, // küçük tolerans
      crackShare,
      uyari:
        crackShare > BALANCE_LAW.crackRatio + 0.05
          ? "Çatlak kotası aşıldı — çatlak norm haline geliyor, anlamını yitirir."
          : null,
    };
  },
};

// Madde 5 — TEK OMURGA (değiştirilemez)
// Tüm frekanslar tek eksene bağlanır: Dünya Ağacı (Bay Terek).
// Alternatif eksen üretilemez.
export const SINGLE_SPINE = "DUNYA_AGACI" as const;

// Madde 4 — SAYFA-İÇİ YOĞUNLUK RİTMİ
// Her sayfa: %20 zirve / %50 orta mitik / %30 bilgi taşıyıcı.
export const INTENSITY_RHYTHM = { peak: 0.2, middle: 0.5, carrier: 0.3 };

// Madde 6 — HAFIZA YASASI
// "Evren unutmaz. Sadece bazı izler merkezden uzaklaşır."
// Ham kayıt sabittir; yalnızca yorum ağırlığı solar.
export const MEMORY_LAW = {
  recordImmutable: true, // veri asla silinmez/çarpıtılmaz
  fadeIsInterpretive: true, // solma yalnızca yorumsal
  fullFadeDays: 14, // tam solma eğilimi süresi
  fadeFeltAfterDays: 2, // solmanın hissedildiği eşik
};

// Madde 7 — ÇATLAK REÇETESİ (tekrarlanabilir)
export const CRACK_RECIPE = {
  oscillatingIdentity: true, // salınan kimlik
  conflictingSources: true, // çatışan kaynaklar (yorum savaşı)
  unresolvedClosing: true, // çözülmeyen kapanış
};
