import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

// GET: Fetch single product details
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await context.params;
        const product = await prisma.product.findUnique({
            where: { id },
            include: { category: true, variants: true }
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT: Update product
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await context.params;
        const body = await request.json();
        const {
            name, slug, description, images, categoryId, isActive,
            tags, vendor, hasVariants, variants,
            priceTRY, stock
        } = body;

        // 1. Update Product Details
        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                slug: slug || undefined,
                description,
                images: images || [],
                isActive: isActive,
                categoryId,
                vendor,
                tags: tags || [],
            },
            include: { variants: true }
        });

        // 2. Handle Variants
        if (hasVariants && variants && variants.length > 0) {
            // Get IDs of variants sent from frontend
            const sentVariantIds = variants.map((v: any) => v.id).filter(Boolean);

            // Delete variants not in the list
            await prisma.productVariant.deleteMany({
                where: {
                    productId: id,
                    id: { notIn: sentVariantIds }
                }
            });

            // Upsert variants
            for (const v of variants) {
                const variantImages = v.imageId ? [v.imageId] : [];
                const variantData = {
                    productId: id,
                    size: v.options?.['Size'] || 'Standard',
                    material: v.options?.['Material'] || 'Standard',
                    priceTRY: v.priceTRY || 0,
                    priceUSD: v.priceUSD || 0,
                    stock: v.stock || 0,
                    sku: v.sku || '',
                    images: variantImages,
                    trackQuantity: true
                };

                if (v.id) {
                    // Update
                    await prisma.productVariant.update({
                        where: { id: v.id },
                        data: variantData
                    });
                } else {
                    // Create
                    await prisma.productVariant.create({
                        data: variantData
                    });
                }
            }
        } else {
            // Handling switching from variants to single product or updating single product
            const existingVariants = product.variants;
            if (existingVariants.length > 0) {
                const firstVar = existingVariants[0];

                // Delete others
                await prisma.productVariant.deleteMany({
                    where: {
                        productId: id,
                        id: { not: firstVar.id }
                    }
                });

                // Update first to Default
                await prisma.productVariant.update({
                    where: { id: firstVar.id },
                    data: {
                        size: 'Standard',
                        material: 'Standard',
                        priceTRY: priceTRY || 0,
                        priceUSD: (priceTRY || 0) / 30, // Default conversion
                        stock: stock || 0,
                        sku: `${product.slug}-STD`.toUpperCase(),
                    }
                });
            } else {
                // Create new default
                await prisma.productVariant.create({
                    data: {
                        productId: id,
                        size: 'Standard',
                        material: 'Standard',
                        priceTRY: priceTRY || 0,
                        priceUSD: (priceTRY || 0) / 30, // Default conversion
                        stock: stock || 0,
                        sku: `${product.slug}-STD`.toUpperCase(),
                        trackQuantity: true
                    }
                });
            }
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Update Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 });
    }
}

// DELETE: Delete product
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await context.params;

        await prisma.product.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { error: 'Failed to delete product' },
            { status: 500 }
        );
    }
}
