# Bay Terek — WordPress Deploy Mimarisi (Faz 9 Runtime → Hybrid Launch)

> Kıdemli WP Architect + Headless Engineer değerlendirmesi. Önce dürüst uyum analizi, sonra istenen 8 bölüm eksiksiz.

---

## 0. ÖNCE: DÜRÜST UYUM ANALİZİ (mühendislik sorumluluğu)

Bir şeyi sessizce uygulamak yerine işaretlemem gerekiyor, çünkü yanlış karar runtime'ın ruhunu öldürür.

**Senin sistemin bir CMS problemi değil, bir runtime problemi.** Kanıt, kendi kod tabanında:
- Canon içeriğin **4 dosya, toplam ~1175 kelime** ve **donmuş (immutable)**. Bu bir "içerik yönetimi" ihtiyacı değil — editör paneli, sık güncelleme, yüzlerce post yok. WordPress'in asıl varlık sebebi (kolay, sık içerik düzenleme) burada neredeyse hiç yok.
- Sistemin ruhu **client-side runtime**'da: Dünya Ağacı (layout, unmount olmaz), frekans state machine, geçiş motoru/anti-ghost, davranış binding, ve hafıza (`localStorage`, sunucu değil). Bunların **hiçbiri WordPress'e taşınamaz** — taşınırsa frekans hissi ölür.

**Sonuç:** WordPress'i sistemin *merkezi* yaparsan (klasik tema/PHP-render), runtime'ı kaybedersin. WordPress'in oynayabileceği tek sağlıklı rol: **opsiyonel headless içerik deposu** — ve senin durumunda bu bile şu an gereksiz, çünkü içerik donmuş ve 4 dosya.

**Net tavsiye (Go/No-Go özeti, detayı §8'de):**
- **En doğru:** Mevcut Next.js runtime'ı olduğu gibi Vercel'e deploy et. WordPress'e hiç ihtiyaç yok. (Faz 9.1-9.3 zaten buna hazır.)
- **WordPress gerçekten isteniyorsa** (ekip WP biliyor, ileride editör paneli/çok içerik gelecekse): **headless WP yalnızca canon deposu** olarak, runtime Next.js'te kalır. Aşağıdaki mimari bunu anlatır.
- **Yapılmaması gereken:** WordPress tema/PHP-render ile runtime'ı WP'ye gömmek. Bu, sistemi "iyi tasarlanmış bir mitoloji blogu"na düşürür — senin tüm Faz 1-9 boyunca kaçındığın şey.

Aşağıdaki tüm bölümler **"headless WP = sadece canon deposu, runtime Next.js'te"** hibrit modelini tasarlar; çünkü prompt WordPress entegrasyonu istiyor ve ruhu koruyan tek WP yolu bu.

---

## 1. ARCHITECTURE DESIGN

### WordPress'in rolü: Headless içerik deposu (ve YALNIZCA bu)

```
┌─────────────────────────────────────────────────────────┐
│  TARAYICI (asıl ürün burada yaşar)                        │
│                                                           │
│  Next.js Runtime (Vercel)                                 │
│  ├─ app/(runtime)/layout.tsx  ← Dünya Ağacı (DAİMÎ)       │
│  ├─ FrequencyProvider          ← state machine (client)   │
│  ├─ EntityView                 ← tek renderer             │
│  ├─ behavior-binding           ← frekans = davranış       │
│  ├─ observability/session-reader ← gözlem (client+edge)   │
│  └─ localStorage               ← hafıza (sunucu DEĞİL)    │
│                                                           │
│         │ build-time / ISR ile çeker                      │
│         ▼                                                 │
└─────────┼─────────────────────────────────────────────────┘
          │  (yalnızca canon metni, frozen)
          ▼
┌─────────────────────────────────────────────────────────┐
│  WordPress (Headless — ayrı sunucu / WP Engine / VPS)     │
│  ├─ REST API / WPGraphQL  ← read-only canon servisi       │
│  ├─ Custom Post Type: "canon" (4 kayıt, immutable)        │
│  └─ Admin: yalnızca canon görüntüleme/kilitleme           │
│                                                           │
│  Telemetry buraya YAZILMAZ (ayrı servis — §5)             │
└─────────────────────────────────────────────────────────┘
```

**Kritik sınır:** WordPress sadece **canon metnini servis eder**. Frekans sistemi, davranış, hafıza, geçişler — hepsi Next.js runtime'da kalır. WP'nin runtime'dan haberi bile yok; o sadece dört metni JSON olarak verir.

### Frekans sistemi WP ile nasıl entegre olur?

**Olmaz — ve olmamalı.** Frekans bir davranış modu (`behavior-binding.ts`), içerik değil. WP yalnızca her canon kaydına bir `frequency` meta alanı (`KOZMOS`/`TENGRI`/`ALBASTI`/`KOROGLU`) ekler; runtime bu etiketi okur ama davranışı kendi kurar. WP frekansı *bilmez*, sadece *etiketler*.

### Entegrasyon yöntemi: WPGraphQL (REST değil)

REST yerine **WPGraphQL** — çünkü tek sorguda yapısal canon (başlık, frekans, üç blok) çekilir, over-fetching olmaz, tipler net. Tek read-only sorgu, build-time'da.

---

## 2. WORDPRESS SETUP (CLEAN, HEADLESS)

### Kurulum (production: WP Engine, Kinsta veya VPS + LEMP)

```bash
# Yerel (geliştirme): Local by Flywheel veya wp-env
npx @wordpress/env start

# Production: managed WP (önerilen) veya VPS
# - PHP 8.2+, MySQL 8 / MariaDB 10.6+
# - WP yalnızca API olarak; frontend tema render etmez
```

### Minimum ve gerekli plugin'ler (az = güvenli)

| Plugin | Neden | Risk |
|--------|-------|------|
| **WPGraphQL** | Headless sorgu katmanı | Düşük, aktif bakımlı |
| **Advanced Custom Fields (ACF)** | Canon yapısal alanları (üç blok) | Düşük |
| **WPGraphQL for ACF** | ACF alanlarını GraphQL'e açar | Düşük |
| **Custom Post Type UI** *(veya kod)* | `canon` CPT tanımı | Düşük — kodla da yapılabilir |

**Bilinçli olarak KURULMAYANLAR:** sayfa builder (Elementor vb.), SEO mega-plugin'ler, cache plugin'leri (frontend WP'de değil), form/yorum plugin'leri. Headless WP'de bunlar yalnızca saldırı yüzeyi.

### Custom Post Type: `canon` (kodla, plugin'siz tercih)

```php
// functions.php veya mini mu-plugin
add_action('init', function () {
  register_post_type('canon', [
    'label' => 'Canon',
    'public' => false,            // frontend render YOK (headless)
    'show_in_rest' => true,
    'show_in_graphql' => true,
    'graphql_single_name' => 'canon',
    'graphql_plural_name' => 'canons',
    'supports' => ['title', 'custom-fields'],
    'capabilities' => [           // canon korumalı (§7)
      'edit_post' => 'manage_options', // yalnızca admin
    ],
  ]);
});
```

### ACF alan yapısı (canon = yapısal, blog yazısı değil)

```
canon (CPT)
├─ frequency        (select: KOZMOS|TENGRI|ALBASTI|KOROGLU)
├─ etiket           (text)
├─ acilis           (textarea — %20 zirve)
├─ kalp_tip         (select: katmanlar|kutuplar|psikoloji|catismali)
├─ bilgi_label      (text)
├─ bilgi_baslik     (text)
├─ bilgi_metin      (textarea — %30 bilgi)
├─ bilgi_not        (textarea — dürüstlük/çözülmeyen kapanış)
├─ canon_hash       (text, read-only — freeze kilidi)
└─ canon_frozen     (true/false — immutable bayrağı)
```

Bu yapı, mevcut `lib/content.ts` şemasıyla **birebir** aynı — yani runtime tarafında kod değişmez, sadece veri kaynağı local'den WP'ye taşınır.

---

## 3. HEADLESS CONTENT MODEL (immutable canon)

### Canon WP'de nasıl "immutable" davranır?

WordPress doğası gereği her şeyi düzenlenebilir yapar. Canon'u korumak için **üç katman**:

1. **Yetki kilidi:** `canon` CPT'si yalnızca `manage_options` (admin) ile düzenlenebilir. Editörler göremez bile.
2. **Hash doğrulama (asıl koruma):** Her canon kaydında `canon_hash` alanı var (mevcut `canon-freeze.ts`'teki sha256-16). Build-time'da Next.js çektiği içeriğin hash'ini hesaplar ve WP'deki `canon_hash` ile karşılaştırır. **Uyuşmazsa build patlar.** Yani WP'de biri metni değiştirse bile, runtime onu reddeder — immutability WP'de değil, *doğrulamada* yaşar.
3. **`save_post` kilidi:** `canon_frozen = true` olan kayıtta düzenleme denemesini engelleyen hook:

```php
add_action('save_post_canon', function ($post_id) {
  if (get_field('canon_frozen', $post_id)) {
    // frozen canon değiştirilemez — eski içeriği geri yükle
    // (gerçek uygulamada: revizyon reddi + admin uyarısı)
  }
}, 5);
```

### Versioning

Canon donmuş olduğu için versiyonlama "düzenleme geçmişi" değil, **freeze noktaları**: her donmuş set bir `canon_version` (ör. "faz-9.2") + hash kümesi taşır. Yeni bir canon dalgası ancak yeni bir version etiketiyle gelir; eskisi dokunulmaz kalır. Bu, mevcut `canon-freeze.ts` mantığının WP karşılığı.

### Edit edilmeden sadece referans mı?

Evet — tam olarak. Canon WP'de **okunur, düzenlenmez**. WP burada bir "kasa", editör masası değil. Bu yüzden çoğu WP özelliği (revizyon, taslak, otomatik kayıt) bu CPT'de kapatılır.

---

## 4. FRONTEND INTEGRATION

### Next.js WP'den nasıl veri çeker?

**Build-time (SSG) + ISR** — runtime sırasında WP'ye gidilmez:

```typescript
// lib/content-source.ts (yeni — local yerine WP'den)
async function fetchCanon(): Promise<Record<FrequencyKey, VarlikIcerik>> {
  const res = await fetch(process.env.WP_GRAPHQL_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: CANON_QUERY }),
    next: { revalidate: 86400 }, // ISR: günde bir (canon donmuş, sık gerekmez)
  });
  const { data } = await res.json();
  // hash doğrulama (immutability) — uyuşmazsa build/fetch reddeder
  return verifyAndMap(data.canons.nodes);
}
```

### Caching stratejisi

- **Canon donmuş** → agresif statik. `revalidate: 86400` (24s) fazlasıyla yeterli; teoride `Infinity` bile olur çünkü içerik değişmiyor.
- Build-time'da tüm 4 canon statik gömülür. Kullanıcı WP'ye hiç dokunmaz.
- **Latency:** Kullanıcı tarafında WP latency'si = **sıfır** (her şey statik/edge). WP yalnızca build anında veya günde bir ISR'de sorgulanır.

### Fallback (WP down olursa)

**Kritik tasarım:** Canon donmuş olduğu için WP'nin ayakta olması **runtime için gerekli değil.**
- Birincil: build-time'da çekilen statik canon (WP down olsa bile site çalışır).
- İkincil: `lib/content.ts`'teki mevcut local canon **fallback olarak repoda kalır**. WP fetch başarısızsa runtime local canon'a düşer — kullanıcı farkı görmez.
- Bu yüzden WP burada "single point of failure" değil; sadece bir senkron kaynağı. **Site WP'siz de tam çalışır.** (Bu, WP'nin neden gereksiz olabileceğinin de kanıtı — §0.)

---

## 5. FREQUENCY / BEHAVIOR SYSTEM INTEGRATION

### En kritik kural: davranış WP'ye yazılmaz

Telemetry ve frekans state machine **WordPress'in dışında** kalır. Nedenleri:
- WP'nin DB'si davranışsal event akışı için tasarlanmadı (her scroll/geçiş bir yazma olur → WP DB boğulur).
- Frekans state machine **client-side** (`FrequencyProvider`) — sunucuya gerek yok, gecikme istemez.
- Hafıza zaten `localStorage` (oturumlar arası), sunucu değil — bu bilinçli bir karardı (Faz 9, "iz kenarda yaşar").

### Telemetry mimarisi (WP'den ayrı servis)

```
Tarayıcı (telemetry.ts)
   │  batch event (frekans_gecisi, dwell, koroglu_kalis...)
   ▼
Edge ingestion (Vercel Edge Function / serverless)
   │
   ▼
Analytics deposu — seçenekler:
   - PostHog / Plausible (davranışsal, GDPR-dostu)
   - veya basit: Supabase/Postgres event tablosu
   - session-reader.ts bu veriyi okur (insan halkası, otomatik değil)
```

WP'ye yalnızca **isteğe bağlı, toplu özet** yazılabilir (admin dashboard için, §6) — ham event değil. Yani WP davranışı *görmez*, sadece günlük özeti (opsiyonel) gösterir.

### Session tracking

- Client-side `FrequencyProvider` oturum boyunca state tutar.
- Anonim session id (localStorage), kişisel veri yok — GDPR-dostu.
- `observability.ts` (transition fiziği, drift) ve `session-reader.ts` (insan okuması) client + edge'de çalışır; WP'ye bağımlı değil.

---

## 6. CLOSED ALPHA DEPLOYMENT (WP versiyonu)

### Plan (10–50 dikkatli kullanıcı — `ALPHA-SENARYO.md` ile uyumlu)

1. **Deploy:** Next.js → Vercel (preview/production). WP → managed host, sadece API.
2. **Erişim:** Davetli link (Vercel password protection veya basit allowlist). Açık değil — dikkatli kullanıcı seçimi.
3. **WP admin'in rolü:** İçerik editörü **hiçbir şey düzenlemez** (canon donmuş). Admin yalnızca: (a) canon kayıtlarını *görüntüler*, (b) opsiyonel telemetry özetini izler.

### WP dashboard'a düşen metrikler (opsiyonel özet, ham değil)

Custom admin sayfası (mini plugin) — `session-reader.ts` çıktısının günlük özeti:
- Frekans başına "düştü / baktı" oranı (ana KPI — okudu mu, düştü mü?)
- Köroğlu return rate (çatlak kırıyor mu, çağırıyor mu)
- Drift/salınım sıklığı (hibrit okuma)
- Geçiş örüntüleri (en sık yörünge)

**Editör ne görür / görmez:** Editör canon metnini görür (read-only), telemetry özetini görmez (yalnızca admin). Davranış verisi hassas — yorumlama insan (sen) işidir, editör değil.

---

## 7. SECURITY + STABILITY

### WP API güvenliği

- **Canon read-only public:** WPGraphQL yalnızca `canon` CPT'sini ve yalnızca okuma için açar. Yazma mutasyonları kapalı.
- **Auth:** Yazma gereken hiçbir public uç yok. Admin işlemleri standart WP auth + 2FA. Build-time fetch için uygulama-şifresi (application password) veya salt-okunur token.
- **Nonce/JWT:** Public tarafta yazma olmadığı için JWT gereksiz. Build token'ı env'de (`WP_GRAPHQL_URL` + read token).

### Rate limiting

- WP önünde Cloudflare (ücretsiz tier yeterli) — DDoS + rate limit.
- WPGraphQL sorgu derinliği/karmaşıklık limiti (query depth limit) — pahalı sorguları engeller.
- Runtime kullanıcısı WP'ye hiç gitmediği için (statik), WP'ye trafik = neredeyse sıfır → doğal koruma.

### Content tamper prevention (canon koruması)

Üç katman (§3'ten): yetki kilidi + **hash doğrulama (asıl güvence)** + save_post kilidi. Biri WP'de metni değiştirse bile, build-time hash kontrolü uyuşmazlığı yakalar ve reddeder. Canon'un dokunulmazlığı WP'ye değil, *doğrulamaya* güvenir.

### Plugin riskleri

Minimum plugin (4 adet) = minimum saldırı yüzeyi. Her biri aktif bakımlı. Sayfa builder / SEO mega-plugin yok = en yaygın WP açıkları devre dışı.

### WP'nin bu mimarideki zayıf noktaları (dürüst liste)

1. **Gereksiz karmaşıklık:** 4 donmuş içerik için ayrı bir WP sunucusu bakımı — operasyonel yük, getiri düşük (§0).
2. **Ek saldırı yüzeyi:** WP, dünyanın en çok saldırılan CMS'i. Headless olsa bile bakım/güncelleme yükü ve risk getirir.
3. **Single source çelişkisi:** Fallback local canon zaten repoda → WP'nin varlığı opsiyonel hale geliyor, bu da "neden WP?" sorusunu güçlendiriyor.

---

## 8. GO / NO-GO CHECKLIST

| Bileşen | Durum | Not |
|---------|-------|-----|
| **Next.js runtime** | ✅ HAZIR | Faz 9.1-9.3 tamam, Vercel-deploy hazır |
| **Canon (frozen)** | ✅ HAZIR | 4 referans, hash-kilitli |
| **Behavior binding** | ✅ HAZIR | content değil davranış |
| **Observability** | ✅ HAZIR | gözlem var, otomatik öğrenme yok (bilinçli) |
| **WP headless setup** | ⚙️ YAPILACAK | CPT + ACF + WPGraphQL (1 gün) |
| **WP↔Next entegrasyon** | ⚙️ YAPILACAK | fetch + hash doğrulama + fallback (1 gün) |
| **Telemetry servisi** | ⚙️ YAPILACAK | WP'den ayrı (PostHog/Supabase) |
| **Güvenlik (Cloudflare+auth)** | ⚙️ YAPILACAK | yarım gün |

### Deployment readiness score

- **WordPress'siz (saf Next.js → Vercel):** **%95 hazır.** Bugün alpha'ya çıkabilir. Tek eksik: telemetry servisi bağlama.
- **Headless WP hibrit:** **%70 hazır.** Çalışır, ama 2-3 günlük WP setup + entegrasyon + bunun getirdiği bakım/güvenlik yükü var — ve fonksiyonel getirisi şu an düşük (içerik donmuş, 4 dosya).

### Net karar

**Alpha için: WordPress'i ATLA.** Saf Next.js runtime'ı Vercel'e deploy et (%95 hazır), telemetry'yi bağla, `ALPHA-SENARYO.md`'yi çalıştır. WordPress'i ancak şu olursa ekle: (a) teknik olmayan editörler düzenli içerik girecek, (b) canon büyüyüp düzenli güncellenen onlarca/yüzlerce varlığa çıkacak, (c) ekip zaten WP ekosisteminde. Bu üçü olana kadar WP, runtime'a değer katmaz — yalnızca yük ve risk ekler.

Senin sistemin baştan beri bir runtime'dı, bir CMS değil. En dürüst deploy, onu olduğu gibi bırakmaktır.
