import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const searchParams = req.nextUrl.searchParams;
        const period = searchParams.get('period') || '7d'; // 7d, 30d, all

        let startDate = new Date();
        if (period === '7d') startDate.setDate(startDate.getDate() - 7);
        else if (period === '30d') startDate.setDate(startDate.getDate() - 30);
        else startDate = new Date(0); // all time

        // 1. Get stats from ActivityLog
        const logs = await prisma.activityLog.findMany({
            where: {
                createdAt: { gte: startDate }
            }
        });

        const totalViews = logs.filter(l => l.eventType === 'VIEW').length;
        const totalCarts = logs.filter(l => l.eventType === 'ADD_TO_CART').length;
        const totalCheckouts = logs.filter(l => l.eventType === 'CHECKOUT_START').length;
        const totalPurchases = logs.filter(l => l.eventType === 'PURCHASE').length;

        // 2. Revenue (from PURCHASE event metadata or Order table)
        // Since we are simulating orders for now, we sum from logs metadata
        let totalRevenue = 0;
        logs.filter(l => l.eventType === 'PURCHASE').forEach(l => {
            const metadata = l.metadata as any;
            if (metadata && metadata.total) {
                totalRevenue += Number(metadata.total);
            }
        });

        // 3. Top Products
        const productViews: Record<string, number> = {};
        logs.filter(l => l.eventType === 'VIEW' && l.productId).forEach(l => {
            productViews[l.productId!] = (productViews[l.productId!] || 0) + 1;
        });

        const topProductIds = Object.entries(productViews)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        const topProducts = await Promise.all(
            topProductIds.map(async ([id, views]) => {
                const product = await prisma.product.findUnique({ where: { id } });
                return {
                    id,
                    name: product?.name || 'Unknown',
                    views
                };
            })
        );

        // 4. Daily Data for Charts
        const dailyData: Record<string, any> = {};
        logs.forEach(l => {
            const date = l.createdAt.toISOString().split('T')[0];
            if (!dailyData[date]) dailyData[date] = { date, views: 0, carts: 0, purchases: 0, revenue: 0 };

            if (l.eventType === 'VIEW') dailyData[date].views++;
            if (l.eventType === 'ADD_TO_CART') dailyData[date].carts++;
            if (l.eventType === 'PURCHASE') {
                dailyData[date].purchases++;
                const metadata = l.metadata as any;
                if (metadata && metadata.total) {
                    dailyData[date].revenue += Number(metadata.total);
                }
            }
        });

        const chartData = Object.values(dailyData).sort((a: any, b: any) => a.date.localeCompare(b.date));

        return NextResponse.json({
            summary: {
                totalViews,
                totalCarts,
                totalPurchases,
                totalRevenue,
                conversionRate: totalViews > 0 ? (totalPurchases / totalViews) * 100 : 0
            },
            topProducts,
            chartData,
            funnel: [
                { name: 'Views', value: totalViews },
                { name: 'Cart', value: totalCarts },
                { name: 'Checkout', value: totalCheckouts },
                { name: 'Purchase', value: totalPurchases },
            ]
        });
    } catch (error) {
        console.error("Stats API error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
