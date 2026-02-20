import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET: List products
export async function GET() {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true,
                variants: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

// POST: Create product
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            name, slug, description, images, categoryId, isActive,
            tags, vendor, hasVariants, variants,
            priceTRY, stock
        } = body;

        // Generate Slug if missing
        const productSlug = slug || name.toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const product = await prisma.product.create({
            data: {
                name,
                slug: productSlug,
                description,
                images: images || [],
                isActive: isActive ?? true,
                categoryId,
                vendor,
                tags: tags || [],
            }
        });

        // Handle Variants
        if (hasVariants && variants && variants.length > 0) {
            for (const v of variants) {
                // Determine images for variant
                // If variant has imageId, use it.
                const variantImages = v.imageId ? [v.imageId] : [];

                await prisma.productVariant.create({
                    data: {
                        productId: product.id,
                        size: v.options?.['Size'] || 'Standard',
                        material: v.options?.['Material'] || 'Standard',
                        priceTRY: v.priceTRY || 0,
                        priceUSD: v.priceUSD || 0,
                        stock: v.stock || 0,
                        sku: v.sku || `${productSlug}-${Object.values(v.options || {}).join('-')}`.toUpperCase(),
                        images: variantImages, // Ensure schema supports this, confirmed in previous steps
                        trackQuantity: true
                    }
                });
            }
        } else {
            // Create Default Variant for Single Product
            await prisma.productVariant.create({
                data: {
                    productId: product.id,
                    size: 'Standard',
                    material: 'Standard',
                    priceTRY: priceTRY || 0,
                    priceUSD: 0,
                    stock: stock || 0,
                    sku: `${productSlug}-STD`.toUpperCase(),
                    images: [],
                    trackQuantity: true
                }
            });
        }

        return NextResponse.json(product);
    } catch (error: any) {
        console.error('Create Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
    }
}
