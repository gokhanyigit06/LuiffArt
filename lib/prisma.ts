import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    // Defend against build-time missing env vars
    const url = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/mydb?schema=public';

    // @ts-ignore
    return new PrismaClient({
        datasources: {
            db: {
                url,
            },
        },
    })
}

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
