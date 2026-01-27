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
        select: { id: true, images: true, slug: true }
    });

    if (!product || !product.images.length) return false;

    // Check if images are already migrated (local paths)
    if (product.images[0].startsWith('/products/')) return true;

    const newImages: string[] = [];
    const imageDir = path.join(process.cwd(), 'public', 'products', product.slug);

    for (let i = 0; i < product.images.length; i++) {
        const url = product.images[i];
        const ext = path.extname(url) || '.jpg';
        const fileName = `${i + 1}${ext}`;
        const savePath = path.join(imageDir, fileName);

        const success = await downloadImage(url, savePath);

        if (success) {
            newImages.push(`/products/${product.slug}/${fileName}`);
        } else {
            // Keep original URL if download fails
            newImages.push(url);
        }
    }

    // Update product with local paths
    await prisma.product.update({
        where: { id: productId },
        data: { images: newImages }
    });

    return true;
}
