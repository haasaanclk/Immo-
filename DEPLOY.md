# DOMAINE — Yayına Alma

## ⚡ Otomatik yol — GitHub Actions (Turso + Vercel)

`.github/workflows/deploy.yml` her şeyi GitHub'ın sunucularında yapar: Turso veritabanı
dalını oluşturur ([create-turso-db-branch](https://github.com/marketplace/actions/create-turso-database-branch))
ve uygulamayı Vercel'e yayına alır. Sadece aşağıdaki **secret'ları bir kez** eklemen gerekir.

### 1) Turso (CLI ile ~3 dk)
```bash
curl -sSfL https://get.tur.so/install.sh | bash      # Turso CLI
turso auth login                                      # tarayıcıda giriş
turso db create domaine-seed --group default          # tohum DB (boş — uygulama kendi seed'ler)
turso org list           # → TURSO_ORG (org slug)
turso group list         # → TURSO_GROUP (genelde 'default')
turso auth api-tokens mint domaine   # → TURSO_API_TOKEN
```

### 2) Vercel
- vercel.com → **Settings → Tokens → Create Token** → `VERCEL_TOKEN`

### 3) GitHub secret'ları ekle
Repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Değer |
|---|---|
| `TURSO_ORG` | `turso org list` çıktısı |
| `TURSO_API_TOKEN` | mint edilen token |
| `TURSO_SEED_DB` | `domaine-seed` |
| `TURSO_GROUP` | `default` |
| `VERCEL_TOKEN` | Vercel token |
| `AUTH_SECRET` | Claude'un ürettiği rastgele dize (sohbette verildi) |
| `ANTHROPIC_API_KEY` | _(opsiyonel — yoksa demo modu)_ |
| `STRIPE_SECRET_KEY` | _(opsiyonel)_ |

### 4) Çalıştır
Repo → **Actions → "Deploy DOMAINE" → Run workflow.** Bittiğinde çalışmanın özetinde
**canlı linkin** görünür. Sonraki her push'ta otomatik yeniden yayınlanır.

---

## Elle yol — Vercel + Turso (alternatif)

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
