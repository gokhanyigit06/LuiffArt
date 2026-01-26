import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';

async function main() {
    const email = process.env.ADMIN_EMAIL || 'admin@luiff.com';
    const password = process.env.ADMIN_PASSWORD || 'luiff2024admin'; // Default password

    console.log(`Seeding/Verifying admin user: ${email}`);

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                // Update password if it changed (optional, but good for resetting)
                // password: hashedPassword 
                // We probably shouldn't reset password on every seed run unless intended.
                // But for initial setup, upsert ensures it exists.
                role: 'ADMIN', // Ensure they are admin
            },
            create: {
                email,
                password: hashedPassword,
                name: 'Admin User',
                role: 'ADMIN',
            },
        });

        console.log('-----------------------------------');
        console.log('Admin user ready.');
        console.log(`Email: ${user.email}`);
        console.log(`Password: ${password}`);
        console.log('-----------------------------------');
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
