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

        // Lookback period (24h to 7 days typically)
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);

        // 1. Find all sessions with ADD_TO_CART logs
        const cartLogs = await prisma.activityLog.findMany({
            where: {
                eventType: 'ADD_TO_CART',
                createdAt: { gte: startDate }
            },
            orderBy: { createdAt: 'desc' },
            select: {
                sessionId: true,
                userId: true,
                productId: true,
                metadata: true,
                createdAt: true,
                product: {
                    select: { name: true, images: true }
                }
            }
        });

        // 2. Find all sessions with PURCHASE logs
        const purchaseLogs = await prisma.activityLog.findMany({
            where: {
                eventType: 'PURCHASE',
                createdAt: { gte: startDate }
            },
            select: { sessionId: true }
        });

        const purchasedSessionIds = new Set(purchaseLogs.map(p => p.sessionId).filter(Boolean));

        // 3. Filter for abandoned sessions
        const abandonedSessionsMap = new Map<string, any>();

        for (const log of cartLogs) {
            if (!log.sessionId) continue;
            if (purchasedSessionIds.has(log.sessionId)) continue;

            if (!abandonedSessionsMap.has(log.sessionId)) {
                abandonedSessionsMap.set(log.sessionId, {
                    sessionId: log.sessionId,
                    userId: log.userId,
                    lastActive: log.createdAt,
                    items: [],
                    totalValue: 0
                });
            }

            const sessionData = abandonedSessionsMap.get(log.sessionId);

            // Avoid duplicate products for simplified display
            if (!sessionData.items.find((i: any) => i.productId === log.productId)) {
                const metadata = log.metadata as any;
                const price = metadata?.price || 0;

                sessionData.items.push({
                    productId: log.productId,
                    name: log.product?.name,
                    image: log.product?.images?.[0],
                    price: price
                });
                sessionData.totalValue += Number(price);
            }
        }

        const abandonedCarts = Array.from(abandonedSessionsMap.values());

        return NextResponse.json({ abandonedCarts });
    } catch (error) {
        console.error("Abandoned Cart API error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
