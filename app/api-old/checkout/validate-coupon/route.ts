import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { code } = await request.json();
        const session = await getServerSession(authOptions);

        if (!code) {
            return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
        }

        const coupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (!coupon || !coupon.isActive) {
            return NextResponse.json({ error: 'Geçersiz veya süresi dolmuş kupon kodu.' }, { status: 400 });
        }

        const now = new Date();

        // Check if started
        if (coupon.startDate && now < coupon.startDate) {
            return NextResponse.json({ error: 'Bu kupon henüz aktif değil.' }, { status: 400 });
        }

        // Check if expired
        if (coupon.endDate && now > coupon.endDate) {
            return NextResponse.json({ error: 'Bu kuponun süresi dolmuş.' }, { status: 400 });
        }

        // Check usage limit
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return NextResponse.json({ error: 'Bu kupon kullanım limitine ulaşmış.' }, { status: 400 });
        }

        // Check customer specific
        if (coupon.userId && coupon.userId !== (session?.user as any)?.id) {
            return NextResponse.json({ error: 'Bu kupon hesabınıza tanımlı değil.' }, { status: 400 });
        }

        return NextResponse.json({
            code: coupon.code,
            type: coupon.type,
            value: Number(coupon.value)
        });

    } catch (error) {
        console.error('Coupon validation error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
