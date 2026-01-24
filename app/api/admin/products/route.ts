import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            name, slug, description, categoryId,
            manualImages, variants, tags, isActive
        } = body;

        // Process images (use manual URLs if provided, otherwise assume uploads handled elsewhere)
        const images = manualImages || [];

        // Transaction to ensure atomicity
        const product = await prisma.$transaction(async (tx) => {
            // 1. Create Product
            const newProduct = await tx.product.create({
                data: {
                    name,
                    slug, // Warning: In prod, ensure unique slug or handle error
                    description,
                    images, // Array of strings
                    isActive: isActive ?? true,
                    categoryId: categoryId === 'cat_default' ? undefined : categoryId, // Handle placeholder
                    // tags: tags // If we add tags model later
                }
            });

            // 2. Create Variants
            if (variants && variants.length > 0) {
                await tx.productVariant.createMany({
                    data: variants.map((v: any) => ({
                        productId: newProduct.id,
                        size: v.size,
                        material: v.material,
                        sku: v.sku || `${slug}-${v.size}-${v.material}`.toUpperCase(),
                        priceTRY: parseFloat(v.priceTRY),
                        priceUSD: parseFloat(v.priceUSD),
                        stock: parseInt(v.stock),
                        weight: parseFloat(v.weight),
                        desi: parseFloat(v.desi),
                        width: v.width ? parseFloat(v.width) : null,
                        height: v.height ? parseFloat(v.height) : null,
                        depth: v.depth ? parseFloat(v.depth) : null,
                    }))
                });
            }

            return newProduct;
        });

        return NextResponse.json({ success: true, product });
    } catch (error) {
        console.error('Create Product Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create product' },
            { status: 500 }
        );
    }
}
