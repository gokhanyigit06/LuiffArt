import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // 1. Kategoriler
    const catAbstract = await prisma.category.upsert({
        where: { slug: 'abstract-art' },
        update: {},
        create: {
            name: 'Soyut Sanat',
            slug: 'abstract-art',
        },
    })

    // 2. Örnek Ürünler
    const products = [
        {
            name: 'Renkli Rüyalar',
            slug: 'colorful-dreams',
            description: 'Modern mekanlar için canlı renkli soyut tablo.',
            image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000&auto=format&fit=crop',
            priceTRY: 1500.00,
            priceUSD: 85.00,
        },
        {
            name: 'Gece Mavisi',
            slug: 'midnight-blue',
            description: 'Derin mavi tonlarında minimalist eser.',
            image: 'https://images.unsplash.com/photo-1501472312651-726afe119ff1?q=80&w=1000&auto=format&fit=crop',
            priceTRY: 1800.00,
            priceUSD: 100.00,
        },
        {
            name: 'Altın Çağ',
            slug: 'golden-era',
            description: 'Altın varak detaylı lüks kanvas.',
            image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop',
            priceTRY: 2500.00,
            priceUSD: 140.00,
        },
        {
            name: 'Şehir Işıkları',
            slug: 'city-lights',
            description: 'Modern şehir yaşamını yansıtan soyut çalışma.',
            image: 'https://images.unsplash.com/photo-1549887552-93f8efb0818e?q=80&w=1000&auto=format&fit=crop',
            priceTRY: 2100.00,
            priceUSD: 115.00,
        },
        {
            name: 'Doğanın Fısıltısı',
            slug: 'whisper-of-nature',
            description: 'Yeşil ve toprak tonlarının huzurlu dansı.',
            image: 'https://images.unsplash.com/photo-1579783902614-a3fb39279cfe?q=80&w=1000&auto=format&fit=crop',
            priceTRY: 1650.00,
            priceUSD: 90.00,
        }
    ];

    for (const p of products) {
        await prisma.product.upsert({
            where: { slug: p.slug },
            update: {},
            create: {
                name: p.name,
                slug: p.slug,
                description: p.description,
                categoryId: catAbstract.id,
                images: [p.image],
                variants: {
                    create: [
                        {
                            size: '50x70',
                            material: 'Kanvas',
                            sku: `ART-${p.slug}-5070`,
                            priceTRY: p.priceTRY,
                            priceUSD: p.priceUSD,
                            stock: 10,
                            weight: 1.5,
                            desi: 2,
                        }
                    ]
                }
            }
        });
    }

    console.log({ catAbstract })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
