import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            name, email, password, address, city, district, phone,
            isCorporate, companyName, taxNumber, taxOffice
        } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Email ve şifre gereklidir' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ error: 'Bu e-posta adresi zaten kullanımda' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with optional address
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'USER',
                phone: phone,
                isCorporate: isCorporate || false,
                companyName: companyName,
                taxNumber: taxNumber,
                taxOffice: taxOffice,
                addresses: address ? {
                    create: {
                        title: 'Varsayılan Adres',
                        fullName: name,
                        phone: phone || '',
                        city: city || '',
                        district: district || '',
                        address: address,
                        country: 'Turkey' // Default
                    }
                } : undefined
            }
        });

        return NextResponse.json({
            message: 'Kayıt başarılı',
            user: { id: user.id, email: user.email }
        });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
