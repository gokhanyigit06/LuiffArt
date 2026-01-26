import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id: orderId } = await params;
        const body = await request.json();
        const { items, amount, reason, restockItems } = body;

        // Start transaction
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create Refund record
            const refund = await tx.refund.create({
                data: {
                    orderId,
                    amount,
                    reason,
                    restockItems: restockItems ?? true,
                    items: {
                        create: items.map((item: any) => ({
                            orderItemId: item.orderItemId,
                            quantity: item.quantity,
                            amount: item.amount
                        }))
                    }
                }
            });

            // 2. Restock items if requested
            if (restockItems !== false) {
                for (const item of items) {
                    const orderItem = await tx.orderItem.findUnique({
                        where: { id: item.orderItemId }
                    });

                    if (orderItem) {
                        await tx.productVariant.update({
                            where: { id: orderItem.productVariantId },
                            data: {
                                stock: { increment: item.quantity }
                            }
                        });
                    }
                }
            }

            // 3. Update Order Status
            const order: any = await tx.order.findUnique({
                where: { id: orderId },
                include: { refunds: true }
            });

            if (order) {
                const totalRefunded = (order.refunds || []).reduce((sum: number, r: any) => sum + Number(r.amount), 0);
                const isFullRefund = totalRefunded + Number(amount) >= Number(order.totalAmount);

                await tx.order.update({
                    where: { id: orderId },
                    data: {
                        status: isFullRefund ? 'REFUNDED' : order.status,
                        paymentStatus: isFullRefund ? 'REFUNDED' : 'PAID',
                        events: {
                            create: {
                                status: isFullRefund ? 'REFUNDED' : order.status,
                                note: `Refund issued: ${amount} ${order.currency}. Reason: ${reason || 'N/A'}`
                            }
                        }
                    }
                });
            }

            return refund;
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Refund error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to issue refund' },
            { status: 500 }
        );
    }
}
