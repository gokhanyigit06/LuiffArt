import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Deleting variants...');
    await prisma.productVariant.deleteMany();
    console.log('Deleting products...');
    await prisma.product.deleteMany();
    console.log('✅ Products deleted');
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
