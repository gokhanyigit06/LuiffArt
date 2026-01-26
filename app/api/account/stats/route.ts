import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                _count: {
                    select: {
                        orders: true,
                        addresses: true
                    }
                },
                orders: {
                    include: {
                        orderItems: true
                    }
                }
            }
        });

        if (!user) {
            return new NextResponse('User not found', { status: 404 });
        }

        // Calculate total pieces (items) acquired
        const totalItems = user.orders.reduce((acc, order) => {
            // You might want to filter by status (e.g., only PAID/DELIVERED)
            // For now, counting all items in all orders.
            return acc + order.orderItems.length;
        }, 0);

        return NextResponse.json({
            totalItems: totalItems, // "12 parça" logic
            totalOrders: user._count.orders,
            totalAddresses: user._count.addresses,
            totalFavorites: 0 // Placeholder until Favorites model exists
        });

    } catch (error) {
        console.error('[ACCOUNT_STATS_GET]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}
