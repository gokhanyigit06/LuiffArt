import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    // 1. Check for missing ENV
    if (!process.env.DATABASE_URL) {
        console.warn("⚠️ DATABASE_URL is missing. Using Mock Client.");
        return createMockClient();
    }

    // 2. Check for Placeholder ENV (Coolify default or similar)
    if (process.env.DATABASE_URL.includes('your-database-url') ||
        process.env.DATABASE_URL.includes('user:password')) {
        console.warn("⚠️ DATABASE_URL appears to be a placeholder. Using Mock Client.");
        return createMockClient();
    }

    try {
        return new PrismaClient();
    } catch (e) {
        console.error("⚠️ Failed to initialize Prisma Client. Using Mock Client.", e);
        return createMockClient();
    }
}

// Helper function to create a safe Mock Client that swallows all calls
function createMockClient() {
    return new Proxy({}, {
        get: (target, prop) => {
            if (prop === '$connect' || prop === '$disconnect') {
                return async () => { };
            }
            return new Proxy({}, {
                get: (modelTarget, modelProp) => {
                    return async () => {
                        console.warn(`Mock call: ${String(prop)}.${String(modelProp)}`);
                        return []; // Always return empty array to prevent build crashes
                    };
                }
            });
        }
    }) as unknown as PrismaClient;
}

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
