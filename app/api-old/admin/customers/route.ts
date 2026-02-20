import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const customers = await prisma.user.findMany({
            where: {
                role: 'USER'
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                orders: {
                    select: {
                        totalAmount: true,
                        createdAt: true,
                        currency: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Calculate stats for each customer
        const formattedCustomers = customers.map(customer => {
            const orderCount = customer.orders.length;
            const totalSpend = customer.orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
            const lastOrder = customer.orders.length > 0
                ? customer.orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0].createdAt
                : null;
            const mainCurrency = customer.orders[0]?.currency || 'TRY';

            return {
                id: customer.id,
                name: customer.name,
                email: customer.email,
                createdAt: customer.createdAt,
                orderCount,
                totalSpend,
                mainCurrency,
                lastOrder
            };
        });

        return NextResponse.json(formattedCustomers);
    } catch (error) {
        console.error('Failed to fetch customers:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
