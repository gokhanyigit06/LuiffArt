import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const campaigns = await prisma.campaign.findMany({
            include: { coupon: true },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(campaigns);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const campaign = await prisma.campaign.create({
            data: {
                title: body.title,
                slug: body.slug,
                description: body.description,
                bannerUrl: body.bannerUrl,
                startDate: body.startDate ? new Date(body.startDate) : null,
                endDate: body.endDate ? new Date(body.endDate) : null,
                isActive: body.isActive ?? true,
                couponId: body.couponId || null
            }
        });
        return NextResponse.json(campaign);
    } catch (error) {
        console.error('Campaign creation error:', error);
        return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
    }
}
