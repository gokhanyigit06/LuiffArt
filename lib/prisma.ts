import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    // Coolify build ortamında DATABASE_URL eksik olabilir.
    // Bu durumda gerçek bir Prisma Client yerine sahte (Mock) bir obje döndürürüz.
    // Böylece build sırasında veritabanı bağlantı hatası almayız.
    if (!process.env.DATABASE_URL) {
        console.warn("⚠️  DATABASE_URL missing. Using Mock Prisma Client to bypass build errors.");

        // Proxy kullanarak her türlü çağrıyı yakalayıp boş döndüren Mock Client
        return new Proxy({}, {
            get: (target, prop) => {
                // $connect ve $disconnect taklitleri
                if (prop === '$connect' || prop === '$disconnect') {
                    return async () => { };
                }

                // Model erişimlerini (prisma.product, prisma.user vb.) taklit et
                return new Proxy({}, {
                    get: (modelTarget, modelProp) => {
                        // findMany, findUnique, create vb. fonksiyonları taklit et
                        return async () => {
                            console.warn(`Mock Prisma call: ${String(prop)}.${String(modelProp)}`);
                            return []; // Boş dizi veya null döndür
                        };
                    }
                });
            }
        }) as unknown as PrismaClient;
    }

    // Normal ortamda gerçek client döndür
    return new PrismaClient();
}

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
