import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    // Build sırasında env yoksa dummy kullan
    const url = process.env.DATABASE_URL || 'postgresql://dummy:dummy@localhost:5432/dummy';

    // Prisma sürümüne göre doğru parametreyi bulmak için ikisini de deneyelim
    // TypeScript build hatasını önlemek için 'as any' kullanıyoruz.
    return new PrismaClient({
        datasources: {
            db: {
                url: url,
            },
        },
        datasourceUrl: url,
    } as any)
}

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
