# DOMAINE — Yayına Alma (Vercel + Turso)

DOMAINE sunucusuz (serverless) ortamda çalışacak şekilde hazırdır. Veritabanı **libSQL**
sürücüsü kullanır: yerelde dosya (`file:`), üretimde **Turso** bulut (`libsql://`) — şema
ve kod aynıdır. Tüm AI/ödeme özellikleri anahtar yoksa demo moduna düşer, böylece ilk
deploy anahtar olmadan da ayağa kalkar.

## 1. Veritabanı — Turso (ücretsiz başlangıç)
```bash
# Turso CLI: https://docs.turso.tech/cli/installation
turso db create domaine
turso db show domaine --url            # → libsql://domaine-<org>.turso.io
turso db tokens create domaine          # → DATABASE_AUTH_TOKEN
```
Tablolar ve portföy seed'i uygulama ilk çalıştığında **otomatik** oluşturulur
(`db/index.ts`). Ek migration adımı gerekmez.

> Alternatif: Postgres tercih edilirse Drizzle pg-core'a geçiş için `db/schema.ts`
> başındaki nota bakın; libSQL ile başlamak en az sürtünmeli yoldur.

## 2. Vercel
1. Repoyu Vercel'e bağlayın (Next.js otomatik algılanır — özel ayar gerekmez).
2. **Environment Variables** ekleyin:

| Değişken | Zorunlu | Açıklama |
|---|---|---|
| `DATABASE_URL` | ✅ | `libsql://...turso.io` |
| `DATABASE_AUTH_TOKEN` | ✅ | Turso token |
| `AUTH_SECRET` | ✅ | Rastgele uzun bir dize (`openssl rand -hex 32`) |
| `ANTHROPIC_API_KEY` | ➖ | Canlı Concierge + Intelligence raporları için |
| `STRIPE_SECRET_KEY` | ➖ | Gerçek üyelik ödemeleri için |
| `STRIPE_WEBHOOK_SECRET` | ➖ | Stripe webhook imza doğrulaması |

3. Deploy edin.

## 3. Stripe (opsiyonel)
- Webhook uç noktası: `https://<alan-adınız>/api/stripe/webhook`
- Dinlenecek olay: `checkout.session.completed`
- Webhook imzalama sırrını `STRIPE_WEBHOOK_SECRET` olarak ekleyin.
- Anahtar yoksa üyelik yükseltmeleri demo modunda anında uygulanır (test için ideal).

## 4. Doğrulama
- `/collection` portföyü gösteriyor mu (DB seed çalıştı mı)?
- Kayıt ol → `/account` → Privé'ye yükselt → off-market mülk açılıyor mu?
- Concierge'i tamamla → mülk sayfasında "Size özel zekâ raporu" kişiselleşiyor mu?

## Yerel geliştirme
```bash
cp .env.local.example .env.local   # DATABASE_URL=file:domaine.db varsayılan
npm install
npm run dev
```
