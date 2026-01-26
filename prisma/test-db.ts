import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import path from 'path'

// .env dosyasını manuel yükle
const envPath = path.resolve(__dirname, '../.env')
console.log('Loading .env from:', envPath)
dotenv.config({ path: envPath })

const prisma = new PrismaClient({
    log: ['info', 'warn', 'error'],
})

async function main() {
    console.log('⏳ Veritabanına bağlanılıyor...');
    console.log('🌍 DATABASE_URL:', process.env.DATABASE_URL ? 'Yüklendi (Gizli)' : 'BULUNAMADI ❌');

    try {
        await prisma.$connect();
        console.log('✅ BAŞARILI! Veritabanı bağlantısı kuruldu.');

        const count = await prisma.category.count();
        console.log(`📊 Mevcut kategori sayısı: ${count}`);

        const categories = await prisma.category.findMany({ take: 5 });
        console.log('📋 İlk 5 kategori:', categories);

    } catch (e: any) {
        console.error('❌ HATA: Veritabanına bağlanılamadı!');
        console.error(e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
