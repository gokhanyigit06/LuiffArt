import * as XLSX from 'xlsx';
import * as path from 'path';
import { prisma } from '../lib/prisma';
import { migrateProductImages } from '../lib/image-downloader';

interface TrendyolRow {
    'Barkod': string;
    'Model Kodu': string;
    'Ürün Rengi': string;
    'Boyut/Ebat': string;
    'Marka': string;
    'Kategori İsmi': string;
    'Ürün Adı': string;
    'Ürün Açıklaması': string;
    "Trendyol'da Satılacak Fiyat (KDV Dahil)": string;
    'Ürün Stok Adedi': string;
    'Görsel 1': string;
    'Görsel 2': string;
    'Görsel 3': string;
    'Görsel 4': string;
    'Görsel 5': string;
    'Görsel 6': string;
    'Görsel 7': string;
    'Görsel 8': string;
}

async function main() {
    const args = process.argv.slice(2);
    const isDryRun = args.includes('--dry-run');
    const limit = args.find(arg => arg.startsWith('--limit='))?.split('=')[1];
    const limitNum = limit ? parseInt(limit) : undefined;

    console.log('🚀 Trendyol Ürün İmport Başlıyor...\n');
    console.log(`📊 Mod: ${isDryRun ? 'DRY RUN (Sadece Önizleme)' : 'GERÇEK İMPORT'}`);
    if (limitNum) console.log(`🔢 Limit: İlk ${limitNum} ürün\n`);

    // Excel'i oku
    const filePath = path.join(process.cwd(), 'trendyol ürünler.xlsx');
    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data: TrendyolRow[] = XLSX.utils.sheet_to_json(worksheet);

    // Limit burada uygulanmaz, model bazlı uygulanır (aşağıda)

    console.log(`📦 Toplam Satır: ${data.length}\n`);

    // 1. Kategorileri çıkar ve oluştur
    const categoryNames = [...new Set(data.map(row => row['Kategori İsmi']).filter(Boolean))];
    console.log(`📁 Bulunan Kategoriler: ${categoryNames.length}`);
    categoryNames.forEach(cat => console.log(`  - ${cat}`));

    if (!isDryRun) {
        for (const catName of categoryNames) {
            const slug = catName.toLowerCase()
                .replace(/ı/g, 'i')
                .replace(/ğ/g, 'g')
                .replace(/ü/g, 'u')
                .replace(/ş/g, 's')
                .replace(/ö/g, 'o')
                .replace(/ç/g, 'c')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');

            await prisma.category.upsert({
                where: { slug },
                update: {},
                create: { name: catName, slug }
            });
        }
        console.log('✅ Kategoriler oluşturuldu\n');
    }

    // 2. Model kodlarına göre grupla
    const byModel = data.reduce((acc, row) => {
        const model = row['Model Kodu'];
        if (!acc[model]) acc[model] = [];
        acc[model].push(row);
        return acc;
    }, {} as Record<string, TrendyolRow[]>);

    const modelKeys = Object.keys(byModel);
    console.log(`🎨 Unique Model: ${modelKeys.length}`);
    console.log(`📊 Toplam Varyant: ${data.length}\n`);

    // Limit varsa model bazında uygula
    const modelsToProcess = limitNum ? modelKeys.slice(0, limitNum) : modelKeys;

    // 3. Ürünleri import et
    let imported = 0;
    let skipped = 0;

    for (const modelCode of modelsToProcess) {
        const variants = byModel[modelCode];
        const firstVariant = variants[0];
        const productName = firstVariant['Ürün Adı'];
        const categoryName = firstVariant['Kategori İsmi'];

        // Sıralama Kuralları
        const frameOrder = ['Çerçevesiz', 'Siyah', 'Beyaz', 'Ahşap'];
        const sizeOrder = ['21 x 30', '30 x 40', '40 x 50', '50 x 70', '60 x 90']; // Dosyadaki formatı '21 x 30' gibi olabilir, kontrol etmek lazım

        variants.sort((a, b) => {
            const frameA = frameOrder.indexOf(a['Ürün Rengi']) !== -1 ? frameOrder.indexOf(a['Ürün Rengi']) : 99;
            const frameB = frameOrder.indexOf(b['Ürün Rengi']) !== -1 ? frameOrder.indexOf(b['Ürün Rengi']) : 99;

            if (frameA !== frameB) return frameA - frameB;

            // Boyut sıralaması (Basit string karşılaştırma yerine alana göre)
            // Boyut formatı "50 x 70" ise ilk sayıyı alıp sıralayabiliriz
            const sizeA = parseInt(a['Boyut/Ebat'].split(' ')[0] || '0');
            const sizeB = parseInt(b['Boyut/Ebat'].split(' ')[0] || '0');

            return sizeA - sizeB;
        });

        // Ana görsel seçimi: Çerçevesiz (Çok Renkli) varyantın ilk görseli, yoksa ilk varyantınki
        const chargelessVariant = variants.find(v => v['Ürün Rengi'] === 'Çok Renkli' || v['Ürün Rengi'] === 'Çerçevesiz');
        const mainVariant = chargelessVariant || variants[0];

        // Görselleri topla (Parent için)
        const parentImages: string[] = [];
        for (let i = 1; i <= 8; i++) {
            const img = mainVariant[`Görsel ${i}` as keyof TrendyolRow];
            if (img) parentImages.push(img);
        }

        const productSlug = `${productName}-${modelCode}`
            .toLowerCase()
            .replace(/ı/g, 'i')
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .substring(0, 100);

        if (isDryRun) {
            console.log(`\n📦 ${productName}`);
            console.log(`   Model: ${modelCode}`);
            console.log(`   Kategori: ${categoryName}`);
            console.log(`   Varyant Sayısı: ${variants.length}`);
            console.log(`   Ana Görsel Kaynağı: ${mainVariant['Ürün Rengi']} (Renk)`);
            variants.forEach((v, i) => {
                console.log(`   ${i + 1}. ${v['Ürün Rengi']} - ${v['Boyut/Ebat']} - ${v["Trendyol'da Satılacak Fiyat (KDV Dahil)"]} TL`);
            });
            imported++;
            continue;
        }

        try {
            // ... (Kategori kodu aynı) ...
            const categorySlug = categoryName.toLowerCase()
                .replace(/ı/g, 'i')
                .replace(/ğ/g, 'g')
                .replace(/ü/g, 'u')
                .replace(/ş/g, 's')
                .replace(/ö/g, 'o')
                .replace(/ç/g, 'c')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');

            const category = await prisma.category.upsert({
                where: { slug: categorySlug },
                update: {},
                create: { name: categoryName, slug: categorySlug }
            });

            // Ürün oluştur (Parent)
            const product = await prisma.product.create({
                data: {
                    name: productName,
                    slug: productSlug,
                    description: firstVariant['Ürün Açıklaması'] || `${productName} - Yüksek kaliteli poster ve tablo`,
                    // Parent görseli (Çerçevesiz veya ilk varyant)
                    images: parentImages,
                    isActive: true,
                    categoryId: category.id,
                    vendor: firstVariant['Marka'],
                    modelCode,
                    tags: [categoryName, firstVariant['Marka']].filter(Boolean),
                } as any
            });

            // Varyantları oluştur
            for (const variant of variants) {
                const priceTRY = parseFloat(variant["Trendyol'da Satılacak Fiyat (KDV Dahil)"] || '0');
                const priceUSD = priceTRY / 34; // Yaklaşık kur
                const stock = parseInt(variant['Ürün Stok Adedi'] || '0');

                // Varyant görsellerini topla
                const variantImages: string[] = [];
                for (let i = 1; i <= 8; i++) {
                    const img = variant[`Görsel ${i}` as keyof TrendyolRow];
                    if (img) variantImages.push(img);
                }

                await prisma.productVariant.create({
                    data: {
                        productId: product.id,
                        size: variant['Boyut/Ebat'],
                        material: variant['Ürün Rengi'],
                        sku: variant['Barkod'],
                        barcode: variant['Barkod'],
                        priceTRY,
                        priceUSD,
                        stock,
                        trackQuantity: true,
                        images: variantImages // Varyanta özel görseller
                    } as any
                });
            }

            imported++;
            if (imported % 10 === 0) {
                console.log(`✅ ${imported} ürün import edildi...`);
            }
        } catch (error: any) {
            console.error(`❌ Hata: ${productName} - ${error.message}`);
            // Eğer variant unique constraint hatası alırsak (aynı barkod), atlayalım
            skipped++;
        }
    }

    console.log(`\n✅ İmport Tamamlandı!`);
    console.log(`   Başarılı: ${imported}`);
    console.log(`   Atlanan: ${skipped}`);
    console.log(`   Toplam: ${imported + skipped}`);

    if (!isDryRun && args.includes('--migrate')) {
        console.log('\n🖼️ Görsel Taşıma Başlatılıyor...');

        // 1. Parent ürün görsellerini taşı
        const products = await prisma.product.findMany({
            select: { id: true, name: true, images: true }
        });
        const targetProducts = products.filter(p => p.images.some(img => img.includes('cdn.dsmcdn.com')));

        console.log(`   İşlenecek Parent Ürün: ${targetProducts.length}`);

        for (const p of targetProducts) {
            await migrateProductImages(p.id);
        }

        // 2. Varyant görsellerini taşı (Bunu migration fonksiyonuna eklememiz lazım)
        // Şimdilik sadece parent migrasyonu var, variant migrasyonunu da eklemeliyiz.
        console.log('⚠️ Varyant görselleri için migration script güncellenmeli.');
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
