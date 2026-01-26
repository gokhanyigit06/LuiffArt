# Luiff Art - Proje Durum Raporu

## ✅ Tamamlanan Özellikler

### 1. Altyapı ve Veritabanı
- [x] **Next.js 16 & Turbopack**: Proje kurulumu tamamlandı. (Turbopack uyumluluğu için Prisma v5'e sabitlendi).
- [x] **PostgreSQL & Prisma**: Veritabanı şeması (User, Product, Category, Order) oluşturuldu.
- [x] **Seed Data**: Başlangıç verileri (Kategoriler, Örnek Ürünler) eklendi.

### 2. Admin Paneli - Temel
- [x] **Layout**: Sol menü (Dashboard, Ürünler, Kategoriler, Siparişler) ve responsive yapı.
- [x] **Türkçe Dil**: Arayüz dili Türkçe olarak ayarlandı.

### 3. Kategori Yönetimi
- [x] **Listeleme**: Tüm kategoriler tabloda görüntüleniyor.
- [x] **Ekleme/Düzenleme**: Modal içinde form yapısı. Otomatik "slug" oluşturma.
- [x] **Silme**: Onay kutusu ile silme işlemi.
- [x] **API**: `/api/admin/categories` endpoint'leri hazır.

### 4. Ürün Yönetimi
- [x] **Listeleme**: Ürünler görselleriyle beraber listeleniyor.
- [x] **Ekleme/Düzenleme**:
  - İsim, Açıklama, Görsel URL
  - Kategori Seçimi (Dropdown)
  - **Fiyat (TL/USD)** ve **Stok** girişi (Otomatik varyant oluşturuluyor).
- [x] **API**: `/api/admin/products` endpoint'leri hazır (Varyant desteğiyle).

### 5. Geliştirici Araçları
- [x] **Swagger UI**: API dokümantasyonu `/api-doc` adresinde aktif.

---

## ⏳ Bekleyen / Sıradaki Özellikler

### 1. Sipariş Yönetimi (Orders)
- [ ] Sipariş listesi sayfası (Şu an boş).
- [ ] Sipariş detayı görüntüleme.
- [ ] Sipariş durumu güncelleme (Hazırlanıyor, Kargolandı vb.).

### 2. Dashboard Anasayfa
- [ ] Satış istatistikleri grafikleri.
- [ ] Son siparişler özeti.

### 3. Kullanıcı Tarafı (Storefront)
- [ ] Anasayfa (Vitrin).
- [ ] Ürün Detay Sayfası.
- [ ] Sepet ve Ödeme (Checkout).

### 4. Güvenlik
- [ ] Admin Login Sayfası (Şu an herkes erişebilir).
- [ ] Middleware ile admin koruması.
