# Bay Terek — Aşama 1 Deploy (Vercel, WordPress'siz)

> Karar: WordPress yok. Saf Next.js runtime. Bu doküman %95'ten %100'e götüren adımları + eksik %5'i (telemetry) + WP kararının kalıcı kaydını içerir.

---

## A. NEDEN WORDPRESS YOK (Architecture Decision Record)

Bu kayıt bilerek burada. İleride "yönetilebilirlik" dürtüsü geldiğinde, bugünkü gerekçe burada dursun — yanlış abstraction'a karşı en iyi koruma, kararın *nedenini* yazmaktır.

**Karar:** WordPress kullanılmıyor. Canon git-based (local), runtime standalone, telemetry ayrı servis.

**Gerekçe (karar matrisi):**
| Soru | Cevap |
|------|-------|
| Sistem content-heavy mi? | Hayır (4 donmuş canon) |
| CMS ihtiyacı var mı? | Şu an yok |
| Runtime WP'ye bağlı mı? | Olmamalı (client-side state machine) |
| Editör ekibi var mı? | Yok |

**Sistem üç katmanlı, ve yalnızca biri WP'ye girebilir — o da gereksiz:**
1. Runtime (frekans, behavior, transition, memory) → **WP'ye giremez**
2. Canon (frozen) → WP'ye konabilir ama **read-only ve şu an gereksiz**
3. Observability (telemetry) → **WP'de zayıf kalır**

**WP ne zaman gelir (yeniden değerlendirme tetikleyicileri):**
- Teknik olmayan editörler düzenli içerik girmeye başlarsa
- Canon onlarca/yüzlerce düzenli güncellenen varlığa büyürse
- Ekip zaten WP ekosistemindeyse

Bu üçünden biri olana kadar WP = yük + risk, sıfır runtime getirisi. Tam mimari hazır (`WORDPRESS-DEPLOY.md`), tetik gelince uygulanır.

---

## B. VERCEL DEPLOY (Aşama 1)

### 1. Hazırlık (yerel doğrulama)

```bash
cd bayterek
npm install
npm run build      # build temiz geçmeli (canon hash doğrulaması dahil)
npm run dev        # http://localhost:3000 — dört frekansı test et
```

### 2. Deploy

```bash
# Git'e koy
git init && git add -A && git commit -m "Bay Terek runtime — alpha"
git remote add origin <repo-url> && git push -u origin main

# Vercel'e bağla (CLI veya dashboard)
npx vercel            # preview
npx vercel --prod     # production
```

Vercel Next.js'i otomatik tanır — sıfır config. Build ayarı gerekmez.

### 3. Closed alpha erişim kontrolü

Açık değil — davetli. Seçenekler:
- **Vercel password protection** (en basit, dashboard'dan tek tık)
- veya `middleware.ts` ile basit allowlist (davet kodu)

```typescript
// middleware.ts (opsiyonel — davet kodu)
import { NextResponse } from "next/server";
export function middleware(req: Request) {
  const url = new URL(req.url);
  const ok = url.searchParams.get("davet") === process.env.ALPHA_CODE;
  // cookie set + kontrol... (basit allowlist)
  return NextResponse.next();
}
```

---

## C. EKSİK %5 — TELEMETRY SERVİSİ BAĞLAMA

Şu an `lib/telemetry.ts` event'leri sadece konsola/kuyruğa yazıyor. Alpha'da gerçek veri için tek bir endpoint'e bağlanmalı. **WordPress değil** — hafif, davranışsal, GDPR-dostu bir servis.

### Önerilen: PostHog (veya Plausible / Supabase)

```typescript
// lib/telemetry.ts içindeki izle() fonksiyonuna ekle:
export function izle(olay: DavranisOlayi) {
  KUYRUK.push(olay);
  if (typeof window !== "undefined") {
    // batch — her event'te değil, eşikte gönder (WP DB boğulmasının tersi)
    if (KUYRUK.length >= 10) gonder(KUYRUK.splice(0));
  }
}

async function gonder(batch: DavranisOlayi[]) {
  try {
    await fetch("/api/telemetry", {           // kendi edge route'un
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events: batch }),
      keepalive: true,                          // sayfa kapanırken bile gönder
    });
  } catch { /* sessiz — telemetry asla UX'i bozmaz */ }
}
```

```typescript
// app/api/telemetry/route.ts (Vercel Edge Function)
export const runtime = "edge";
export async function POST(req: Request) {
  const { events } = await req.json();
  // PostHog / Supabase / kendi store'una yaz
  // session-reader.ts bunu okur — İNSAN halkası, otomatik karar yok
  return new Response(null, { status: 204 });
}
```

### Anahtar ilke (tekrar)

- Telemetry **batch** gönderilir (her scroll'da değil) — WP DB boğulmasının tersi.
- **Anonim session id** (localStorage), kişisel veri yok — GDPR-dostu.
- Telemetry **asla UX'i bozmaz** — hata sessizce yutulur.
- Toplanan veri `session-reader.ts` ile **insana** sunulur, sistem otomatik öğrenmez (Faz 9.3 ilkesi: gözler, avlamaz).

---

## D. ROADMAP (net aşamalar)

**Aşama 1 — ŞİMDİ:**
Vercel deploy → closed alpha (10-50 dikkatli kullanıcı) → telemetry doğrulama → `ALPHA-SENARYO.md`'yi çalıştır → "okudu mu, düştü mü?" sorusunu gerçek veriyle yanıtla.

**Aşama 2 — SONRA (yalnızca tetik gelirse):**
Content büyürse / editör ihtiyacı oluşursa → o zaman headless WP (read-only canon registry).

**Aşama 3 — İLERİ:**
WP headless CMS, hash-korumalı immutable canon — `WORDPRESS-DEPLOY.md`'deki mimari.

---

## E. FINAL ASSESSMENT

| Soru | Cevap |
|------|-------|
| Mimari hazır mı? | ✅ Evet |
| Deploy hazır mı? | ✅ Evet (build + Vercel) |
| WP gerekli mi? | ❌ Hayır (şu an) |
| Eksik ne? | Telemetry servisi (yarım gün) — %5 |
| En büyük risk | Yanlış abstraction eklemek (WP'yi erken sokmak) |

**En kritik hatırlatma:** Bu sistemde en büyük hata, çalışan yaşayan runtime'ı "daha yönetilebilir" yapmaya çalışırken bozmaktır. Sistem yönetilebilir değil — yaşayan. Ve bu kasıtlı.

Deploy et, gözle, dinle. Sıra artık insanda.
