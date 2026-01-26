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
        const { items, trackingCompany, trackingNumber, trackingUrl, notifyCustomer } = body;

        // items: [{ orderItemId: string, quantity: number }]

        const result = await prisma.$transaction(async (tx) => {
            // 1. Create fulfillment record
            const fulfillment = await tx.fulfillment.create({
                data: {
                    orderId,
                    status: 'SHIPPED',
                    trackingCompany,
                    trackingNumber,
                    trackingUrl,
                    shippedAt: new Date(),
                    items: {
                        create: items.map((item: any) => ({
                            orderItemId: item.orderItemId,
                            quantity: item.quantity
                        }))
                    }
                }
            });

            // 2. Update order status to SHIPPED if it's the first fulfillment?
            // Or maybe PARTIALLY_FULFILLED
            await tx.order.update({
                where: { id: orderId },
                data: {
                    status: 'SHIPPED',
                    fulfillmentStatus: 'FULFILLED', // Simplification: assuming full fulfillment for now
                    events: {
                        create: {
                            status: 'SHIPPED',
                            note: `Fulfillment created. Tracking: ${trackingNumber} (${trackingCompany})`
                        }
                    }
                }
            });

            return fulfillment;
        });

        // 3. Email notification (Placeholder for now)
        if (notifyCustomer) {
            console.log('Would send shipping email to customer now...');
        }

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Fulfillment error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create fulfillment' },
            { status: 500 }
        );
    }
}
