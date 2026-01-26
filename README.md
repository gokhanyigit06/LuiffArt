# 🎨 Luiff Art - E-Ticaret Yönetim Paneli

Bu proje, **Next.js 16**, **Ant Design** ve **Prisma (PostgreSQL)** kullanılarak geliştirilmiş modern bir e-ticaret yönetim panelidir.

## 📂 Proje Yapısı

- **`/app/admin`**: Yönetim paneli sayfaları (Dashboard, Ürünler, Kategoriler).
- **`/app/api/admin`**: Backend API rotaları.
- **`/lib`**: Yardımcı kütüphaneler (Prisma Client, vb.).
- **`/prisma`**: Veritabanı şeması ve seed dosyaları.

## 🚀 Başlangıç

### Gereksinimler
- Node.js 18+
- PostgreSQL Veritabanı

### Kurulum

1. **Bağımlılıkları Yükle:**
   ```bash
   npm install
   ```
2. **Setup .env:**
   `.env` dosyasında `DATABASE_URL` tanımlı olmalıdır.

3. **Veritabanını Hazırla:**
   ```bash
   npx prisma db push  # Şemayı veritabanına gönder
   npx prisma generate # Prisma Client'ı oluştur (v5.22.0)
   ```

4. **Sunucuyu Başlat:**
   ```bash
   npm run dev
   ```

## 🛠️ Teknoloji Yığını

- **Framework:** Next.js 16 (App Router)
- **UI Kit:** Ant Design (v5) + Ant Design Charts
- **ORM:** Prisma v5.22.0 (Stable) - *v7 kullanmayın, Next.js Turbopack ile uyumsuz.*
- **Database:** PostgreSQL
- **Docs:** Swagger UI (`/api-doc`)

## 🤖 Ajanlar İçin Notlar (Multi-Agent Guidelines)

Eğer bu projede çalışan bir yapay zeka ajanıysanız, lütfen aşağıdaki kurallara uyun:

1.  **Prisma Değişiklikleri:** `schema.prisma` dosyasında değişiklik yaparsanız MUTLAKA terminalde `npx prisma db push` ve `npx prisma generate` komutlarını çalıştırın.
2.  **API Rotaları:** Tüm API endpointleri `/app/api/admin` altındadır ve `NextResponse` kullanır.
3.  **UI Kuralları:** Sadece **Ant Design** bileşenleri kullanın. TailwindCSS yüklüdür ancak Ant Design'ın kendi stil sistemi (prop tabanlı) önceliklidir.
4.  **Durum:** Projenin son durumunu `PROJECT_STATUS.md` dosyasından takip edin.

## ✨ Mevcut Özellikler
- ✅ Ürün Yönetimi (Shopify benzeri: Varyantlar, SEO, Fiyatlandırma)
- ✅ Kategori Yönetimi
- ✅ Swagger API Dokümantasyonu

---
*Geliştirme: Antigravity Agent*
