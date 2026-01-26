import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/admin/products:
 *   get:
 *     description: Returns all products
 *     responses:
 *       200:
 *         description: Hello Product
 */
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const products = await prisma.product.findMany({
            include: {
                category: true,
                variants: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const {
            name, slug, description, categoryId,
            images, manualImages, variants, tags, isActive,
            productType, vendor, seoTitle, seoDescription
        } = body;

        console.log('Creating product:', { name, slug, categoryId, images });

        // Process images
        const productImages = images || manualImages || [];

        // Transaction
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create Product
            const newProduct = await tx.product.create({
                data: {
                    name,
                    slug,
                    description: description || null,
                    images: productImages,
                    isActive: isActive ?? true,
                    categoryId: categoryId || null,
                    tags: tags || [], // string[]
                    productType: productType || null,
                    vendor: vendor || null,
                    seoTitle: seoTitle || null,
                    seoDescription: seoDescription || null,
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
                        barcode: v.barcode || null,

                        // Prices
                        priceTRY: parseFloat(v.priceTRY || 0),
                        compareAtPriceTRY: v.compareAtPriceTRY ? parseFloat(v.compareAtPriceTRY) : null,
                        costPriceTRY: v.costPriceTRY ? parseFloat(v.costPriceTRY) : null,

                        priceUSD: parseFloat(v.priceUSD || 0),
                        compareAtPriceUSD: v.compareAtPriceUSD ? parseFloat(v.compareAtPriceUSD) : null,
                        costPriceUSD: v.costPriceUSD ? parseFloat(v.costPriceUSD) : null,

                        stock: parseInt(v.stock || 0),
                        trackQuantity: v.trackQuantity ?? true,

                        weight: parseFloat(v.weight || 0),
                        desi: parseFloat(v.desi || 0),
                    }))
                });
            }

            return newProduct;
        });

        console.log('Product created:', result);
        return NextResponse.json(result); // Return created product directly
    } catch (error: any) {
        console.error('Create Product Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create product' },
            { status: 500 }
        );
    }
}
