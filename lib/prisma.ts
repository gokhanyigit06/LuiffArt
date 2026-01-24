import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    // Fallback for build-time if env is missing to prevent initialization errors
    // ensuring Next.js build can proceed even without DB connection
    if (!process.env.DATABASE_URL) {
        process.env.DATABASE_URL = 'postgresql://user:password@localhost:5432/mydb?schema=public';
    }

    return new PrismaClient()
}

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
