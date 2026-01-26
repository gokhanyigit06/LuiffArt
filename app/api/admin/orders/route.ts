import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                orderItems: {
                    include: {
                        productVariant: {
                            include: {
                                product: true
                            }
                        }
                    }
                },
                _count: {
                    select: { orderItems: true }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            customerName,
            customerEmail,
            currency,
            subtotal,
            totalAmount,
            status,
            items,
            shippingAddress,
            billingAddress
        } = body;

        const result = await prisma.$transaction(async (tx) => {
            for (const item of items) {
                const variant = await tx.productVariant.findUnique({
                    where: { id: item.variantId },
                    select: { stock: true, trackQuantity: true }
                });

                if (!variant) {
                    throw new Error(`Variant not found: ${item.variantId}`);
                }

                if (variant.trackQuantity && variant.stock < item.quantity) {
                    throw new Error(`Insufficient stock for variant. Available: ${variant.stock}`);
                }

                if (variant.trackQuantity) {
                    await tx.productVariant.update({
                        where: { id: item.variantId },
                        data: { stock: { decrement: item.quantity } }
                    });
                }
            }

            const order = await tx.order.create({
                data: {
                    status: status || 'PENDING',
                    paymentStatus: status === 'PAID' ? 'PAID' : 'PENDING',
                    fulfillmentStatus: 'UNFULFILLED',
                    currency: currency || 'TRY',
                    subtotal: subtotal,
                    totalAmount: totalAmount,
                    shippingAddress: shippingAddress,
                    billingAddress: billingAddress,
                    customerNote: body.customerNote || null,
                    user: {
                        connectOrCreate: {
                            where: { email: customerEmail },
                            create: {
                                email: customerEmail,
                                name: customerName,
                                role: 'USER'
                            }
                        }
                    },
                    orderItems: {
                        create: items.map((item: any) => ({
                            productVariantId: item.variantId,
                            quantity: item.quantity,
                            price: item.price
                        }))
                    },
                    events: {
                        create: {
                            status: status || 'PENDING',
                            note: 'Order created manually via admin panel'
                        }
                    }
                },
                include: {
                    orderItems: true
                }
            });

            return order;
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create order' },
            { status: 500 }
        );
    }
}
