import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(coupons);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const coupon = await prisma.coupon.create({
            data: {
                code: body.code.toUpperCase(),
                type: body.type,
                value: body.value,
                startDate: body.startDate ? new Date(body.startDate) : null,
                endDate: body.endDate ? new Date(body.endDate) : null,
                usageLimit: body.usageLimit,
                isActive: body.isActive ?? true,
                userId: body.userId || null
            }
        });
        return NextResponse.json(coupon);
    } catch (error) {
        console.error('Coupon creation error:', error);
        return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
    }
}
