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
    let data: TrendyolRow[] = XLSX.utils.sheet_to_json(worksheet);

    if (limitNum) {
        data = data.slice(0, limitNum);
    }

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

    console.log(`🎨 Unique Model: ${Object.keys(byModel).length}`);
    console.log(`📊 Toplam Varyant: ${data.length}\n`);

    // 3. Ürünleri import et
    let imported = 0;
    let skipped = 0;

    for (const [modelCode, variants] of Object.entries(byModel)) {
        const firstVariant = variants[0];
        const productName = firstVariant['Ürün Adı'];
        const categoryName = firstVariant['Kategori İsmi'];

        // Slug oluştur
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

        // Görselleri topla
        const images: string[] = [];
        for (let i = 1; i <= 8; i++) {
            const img = firstVariant[`Görsel ${i}` as keyof TrendyolRow];
            if (img) images.push(img);
        }

        if (isDryRun) {
            console.log(`\n📦 ${productName}`);
            console.log(`   Model: ${modelCode}`);
            console.log(`   Kategori: ${categoryName}`);
            console.log(`   Varyant Sayısı: ${variants.length}`);
            console.log(`   Görsel: ${images.length} adet`);
            variants.forEach((v, i) => {
                console.log(`   ${i + 1}. ${v['Ürün Rengi']} - ${v['Boyut/Ebat']} - ${v["Trendyol'da Satılacak Fiyat (KDV Dahil)"]} TL`);
            });
            imported++;
            continue;
        }

        try {
            // Kategoriyi bul
            const categorySlug = categoryName.toLowerCase()
                .replace(/ı/g, 'i')
                .replace(/ğ/g, 'g')
                .replace(/ü/g, 'u')
                .replace(/ş/g, 's')
                .replace(/ö/g, 'o')
                .replace(/ç/g, 'c')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');

            const category = await prisma.category.findUnique({ where: { slug: categorySlug } });

            // Ürün oluştur
            const product = await prisma.product.create({
                data: {
                    name: productName,
                    slug: productSlug,
                    description: firstVariant['Ürün Açıklaması'] || `${productName} - Yüksek kaliteli poster ve tablo`,
                    images,
                    isActive: true,
                    categoryId: category?.id,
                    vendor: firstVariant['Marka'],
                    modelCode,
                    tags: [categoryName, firstVariant['Marka']].filter(Boolean),
                }
            });

            // Varyantları oluştur
            for (const variant of variants) {
                const priceTRY = parseFloat(variant["Trendyol'da Satılacak Fiyat (KDV Dahil)"] || '0');
                const priceUSD = priceTRY / 34; // Yaklaşık kur
                const stock = parseInt(variant['Ürün Stok Adedi'] || '0');

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
                        trackQuantity: true
                    }
                });
            }

            imported++;
            if (imported % 10 === 0) {
                console.log(`✅ ${imported} ürün import edildi...`);
            }
        } catch (error: any) {
            console.error(`❌ Hata: ${productName} - ${error.message}`);
            skipped++;
        }
    }

    console.log(`\n✅ İmport Tamamlandı!`);
    console.log(`   Başarılı: ${imported}`);
    console.log(`   Atlanan: ${skipped}`);
    console.log(`   Toplam: ${imported + skipped}`);

    if (!isDryRun && args.includes('--migrate')) {
        console.log('\n🖼️ Görsel Taşıma Başlatılıyor...');
        // Tüm ürünleri çek ve filtrele
        const allProducts = await prisma.product.findMany({
            select: { id: true, name: true, images: true }
        });

        const products = allProducts.filter(p => p.images.some(img => img.includes('cdn.dsmcdn.com')));

        console.log(`   İşlenecek Ürün Sayısı: ${products.length}`);
        let migrated = 0;

        for (const p of products) {
            process.stdout.write(`   [${migrated + 1}/${products.length}] ${p.name.substring(0, 30)}... `);
            const success = await migrateProductImages(p.id);
            if (success) {
                console.log('✅');
                migrated++;
            } else {
                console.log('❌');
            }
        }
        console.log(`\n✅ Görsel Taşıma Tamamlandı: ${migrated} ürün güncellendi.`);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
