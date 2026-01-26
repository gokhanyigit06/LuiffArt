import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

// PUT /api/admin/products/[id] - Ürün güncelle
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await request.json();
        const {
            name, slug, description, images, categoryId, isActive,
            tags, productType, vendor, seoTitle, seoDescription,
            variants
        } = body;

        const result = await prisma.$transaction(async (tx) => {
            // 1. Ürünü güncelle
            const updatedProduct = await tx.product.update({
                where: { id },
                data: {
                    name,
                    slug,
                    description,
                    images: images || [],
                    categoryId: categoryId || null,
                    isActive,
                    tags: tags || [],
                    productType,
                    vendor,
                    seoTitle,
                    seoDescription,
                },
            });

            // 2. Varyantları güncelle
            if (variants && variants.length > 0) {
                const firstV = variants[0]; // UI şu an tek varyant gönderiyor

                const existingVariants = await tx.productVariant.findMany({
                    where: { productId: id }
                });

                if (existingVariants.length > 0) {
                    await tx.productVariant.update({
                        where: { id: existingVariants[0].id },
                        data: {
                            size: firstV.size,
                            material: firstV.material,
                            priceTRY: firstV.priceTRY,
                            priceUSD: firstV.priceUSD,
                            compareAtPriceTRY: firstV.compareAtPriceTRY,
                            compareAtPriceUSD: firstV.compareAtPriceUSD,
                            costPriceTRY: firstV.costPriceTRY,
                            costPriceUSD: firstV.costPriceUSD,
                            stock: firstV.stock,
                            trackQuantity: firstV.trackQuantity,
                            sku: firstV.sku,
                            barcode: firstV.barcode
                        }
                    });
                } else {
                    await tx.productVariant.create({
                        data: {
                            ...firstV,
                            productId: id
                        }
                    });
                }
            }

            // Return updated product with its relations
            return await tx.product.findUnique({
                where: { id },
                include: { category: true, variants: true }
            });
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { error: 'Failed to update product' },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/products/[id] - Ürün sil
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;

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
