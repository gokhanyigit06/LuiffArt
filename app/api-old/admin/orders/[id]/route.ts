import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                user: { select: { name: true, email: true } },
                orderItems: {
                    include: {
                        productVariant: {
                            include: { product: true }
                        }
                    }
                },
                events: { orderBy: { createdAt: 'desc' } },
                fulfillments: {
                    include: {
                        items: {
                            include: {
                                orderItem: {
                                    include: {
                                        productVariant: {
                                            include: { product: true }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                },
                refunds: {
                    include: { items: true },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { status, fulfillmentStatus, paymentStatus, note } = body;

        const order = await prisma.order.update({
            where: { id },
            data: {
                status: status || undefined,
                fulfillmentStatus: fulfillmentStatus || undefined,
                paymentStatus: paymentStatus || undefined,
                events: {
                    create: {
                        status: status || 'UPDATED',
                        note: note || `Order updated: ${[status, fulfillmentStatus, paymentStatus].filter(Boolean).join(', ')}`
                    }
                }
            }
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}
