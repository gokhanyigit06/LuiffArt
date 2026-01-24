import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    // Build-time defansif: Eğer DATABASE_URL tanımlı değilse,
    // Prisma'nın hata vermemesi için sahte bir connection string atıyoruz.
    // Bu sadece build aşamasında 'generateStaticParams' gibi fonksiyonların çökmemesi içindir.
    if (!process.env.DATABASE_URL) {
        process.env.DATABASE_URL = 'postgresql://build:build@localhost:5432/build_db';
    }

    return new PrismaClient();
}

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
