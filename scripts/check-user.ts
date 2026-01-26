import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';

async function main() {
    const email = 'admin@luiff.com';
    console.log(`Checking user: ${email}...`);

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.log('❌ User NOT found in database.');
        return;
    }

    console.log('✅ User found:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Has Password: ${!!user.password}`);

    if (user.password) {
        const isMatch = await bcrypt.compare('luiff2024admin', user.password);
        console.log(`   Password Match ('luiff2024admin'): ${isMatch ? '✅ YES' : '❌ NO'}`);
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
