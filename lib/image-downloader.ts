import fs from 'fs';
import path from 'path';
import { prisma } from './prisma';

export async function downloadImage(url: string, savePath: string): Promise<boolean> {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}`);

        const buffer = await response.arrayBuffer();
        const dir = path.dirname(savePath);

        await fs.promises.mkdir(dir, { recursive: true });
        await fs.promises.writeFile(savePath, Buffer.from(buffer));

        return true;
    } catch (error) {
        console.error(`Error downloading image ${url}:`, error);
        return false;
    }
}

export async function migrateProductImages(productId: string) {
    const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { variants: true } // Varyantları da al
    });

    if (!product) return false;

    let totalSuccess = true;
    const baseDir = path.join(process.cwd(), 'public', 'products', product.slug);

    // 1. Parent Görselleri Taşı
    if (product.images.length > 0 && !product.images[0].startsWith('/products/')) {
        const newImages: string[] = [];
        for (let i = 0; i < product.images.length; i++) {
            const url = product.images[i];
            const ext = path.extname(url) || '.jpg';
            const fileName = `default-${i + 1}${ext}`;
            const savePath = path.join(baseDir, fileName);

            if (await downloadImage(url, savePath)) {
                newImages.push(`/products/${product.slug}/${fileName}`);
            } else {
                newImages.push(url);
                totalSuccess = false;
            }
        }
        await prisma.product.update({
            where: { id: productId },
            data: { images: newImages }
        });
    }

    // 2. Varyant Görselleri Taşı
    for (const variant of product.variants) {
        if (variant.images.length > 0 && !variant.images[0].startsWith('/products/')) {
            const newImages: string[] = [];

            // Varyant için özel klasör veya isimlendirme: {slug}/{sku}-1.jpg
            for (let i = 0; i < variant.images.length; i++) {
                const url = variant.images[i];
                const ext = path.extname(url) || '.jpg';
                // SKU veya ID kullanarak benzersiz yap
                const fileName = `${variant.sku}-${i + 1}${ext}`;
                const savePath = path.join(baseDir, fileName);

                if (await downloadImage(url, savePath)) {
                    newImages.push(`/products/${product.slug}/${fileName}`);
                } else {
                    newImages.push(url);
                    totalSuccess = false;
                }
            }

            await prisma.productVariant.update({
                where: { id: variant.id },
                data: { images: newImages }
            });
        }
    }

    return totalSuccess;
}
