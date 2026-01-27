import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { migrateProductImages } from '@/lib/image-downloader';

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { limit = 10 } = await request.json();

        // Trendyol URL'i olan ürünleri bul
        const products = await prisma.product.findMany({
            where: {
                images: {
                    hasSome: ['https://cdn.dsmcdn.com'] // Trendyol CDN
                }
            },
            take: limit
        });

        let successCount = 0;
        let failCount = 0;

        for (const product of products) {
            const success = await migrateProductImages(product.id);
            if (success) successCount++;
            else failCount++;
        }

        return NextResponse.json({
            message: 'Migration complete',
            processed: products.length,
            success: successCount,
            failed: failCount
        });

    } catch (error) {
        console.error('Migration error:', error);
        return NextResponse.json({ error: 'Migration failed' }, { status: 500 });
    }
}
