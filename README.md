# Bay Terek — Frekans Bazlı Mitolojik Runtime

> Türk Mitolojisinin Kayıp Dünyası. Bir site değil; kullanıcıyı zaman içinde okuyan, frekans değiştiren sürekli bir evren.

Bu, Faz 9.1 — **production iskeleti**. Deneysel runtime'ı (tek dosya) üretim mimarisine taşır, ama **runtime ruhunu korur**.

## Kurulum

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production
```

Deploy: Vercel (sıfır config). `vercel` veya GitHub bağlantısı.

## Mimari Felsefe: runtime-first

Bu proje **page-first değil, runtime-first**. Sayfalar içerik taşıyıcıdır; asıl ürün runtime'dır.

- **route = bakış açısı** (perspektif değişimi)
- **runtime = sürekli dünya** (hiç kopmaz)

### EN KRİTİK KURAL: Dünya Ağacı layout'ta yaşar

`app/(runtime)/layout.tsx` route'lar arası **unmount olmaz** (Next.js layout modeli). Dünya Ağacı, atmosfer, navigasyon ve hafıza burada yaşar. Route değiştiğinde yalnızca `{children}` (EntityView) değişir; dünya akışta kalır. **Süreklilik hissi tamamen buna bağlı — bu yapı bozulmamalı.**

## Klasör Yapısı

```
app/(runtime)/        → route grubu (sürekli shell)
  layout.tsx          → ⭐ daimî evren (Ağaç/atmosfer/nav burada)
  page.tsx            → kök (Kozmos)
  {kozmos,tanrilar,yaratiklar,catlak}/page.tsx → her biri frekans set eder

components/
  runtime/            → FrequencyProvider (3 state katmanı), FrequencySync, ProgressLine
  worldtree/          → WorldTree (daimî omurga)
  frequency/          → EntityView (tek renderer) + Hearts (kalp blokları)
  memory/             → MythMemory (kehanet paneli) + tetikleyici
  navigation/         → CosmicNav + MobileNav
  ritual/             → Atmosphere, Grain, RecoveryFlash (anti-ghost)

lib/
  ontology.ts         → frekanslar, değişmez tanımlar (Anayasa md.2,5)
  constitution.ts     → denge yasası, tek omurga (değiştirilemez)
  myth-reading.ts     → evrilen yorum + dürüst solma (saf fonksiyonlar)
  content.ts          → içerik şeması + canon (ilk aşama: local)
  telemetry.ts        → davranış izleme (Faz 9.3)

content/              → Faz 9.2'de MDX canon metinleri buraya
```

## Üç Ayrık State Katmanı (karıştırılmaz)

`FrequencyProvider` içinde:
1. **Ontolojik** — mode, oncekiMode, toparlaniyor, korogluKimlik
2. **Memory** — izleme (sure, geçiş, sonPencere, sonZiyaret) — `localStorage` ile kalıcı
3. **UI** — mitolojiAcik, reducedMotion

## Anayasa (değiştirilemez maddeler)

- **Denge yasası** (`constitution.ts`): %70 saf / %20 hibrit / %10 çatlak. Çatlak norm olamaz.
- **Tek omurga**: Dünya Ağacı. Alternatif eksen yasak.
- **Hafıza yasası**: "Evren unutmaz; izler merkezden uzaklaşır." Ham kayıt sabit, yorum solar.

## ⚠️ Production'da Korunması Gerekenler (ruhu öldürmeyin)

Çoğu sistem "cleanup / simplification / optimization" derken frekans hissini kaybeder. Korunması zorunlu:
- Dünya Ağacı'nın layout'ta kalması (remount yok)
- Geçiş animasyonları (blur+fade, 0.9s, ritüel ease)
- Atmosfer/grain katmanları
- Anti-ghost toparlanma (Köroğlu çıkışı)
- Hafıza panelinin **kehanet** dili (dashboard değil)

## Sonraki Fazlar

- **9.2** — İlk canon içerik seti (MDX). `content.ts` şeması hazır; metin doldurulacak.
- **9.3** — Closed alpha + davranış izleme. `telemetry.ts` sinyalleri gerçek analytics'e bağlanacak. KPI: "insanlar burada anlam hissediyor mu?"

## Not

İçerik şu an `lib/content.ts` içinde yapısal yer tutucu. Anayasa-uyumlu gerçek metinler Faz 9.2'de gelecek. CMS (Sanity) yalnızca davranış doğrulandıktan sonra — erken abstraction runtime'ı boğar.
