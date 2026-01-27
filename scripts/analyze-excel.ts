import * as XLSX from 'xlsx';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'trendyol ürünler.xlsx');
const workbook = XLSX.readFile(filePath);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const data: any[] = XLSX.utils.sheet_to_json(worksheet);

// Unique kategoriler
const categories = new Set(data.map(row => row['Kategori İsmi']).filter(Boolean));
console.log('\n📁 Kategoriler:');
categories.forEach(cat => console.log(`  - ${cat}`));

// Unique renkler
const colors = new Set(data.map(row => row['Ürün Rengi']).filter(Boolean));
console.log('\n🎨 Ürün Renkleri (Çerçeve Tipleri):');
colors.forEach(color => console.log(`  - ${color}`));

// Unique boyutlar
const sizes = new Set(data.map(row => row['Boyut/Ebat']).filter(Boolean));
console.log('\n📏 Boyutlar:');
sizes.forEach(size => console.log(`  - ${size}`));

// Model kodlarına göre grupla
const byModel = data.reduce((acc, row) => {
    const model = row['Model Kodu'];
    if (!acc[model]) acc[model] = [];
    acc[model].push(row);
    return acc;
}, {} as Record<string, any[]>);

console.log('\n📦 Varyant İstatistikleri:');
console.log(`  Toplam Ürün: ${data.length}`);
console.log(`  Unique Model: ${Object.keys(byModel).length}`);
console.log(`  Ortalama Varyant/Model: ${(data.length / Object.keys(byModel).length).toFixed(1)}`);

// Örnek bir model göster
const exampleModel = Object.keys(byModel)[0];
console.log(`\n🔍 Örnek Model: ${exampleModel}`);
console.log(`  Varyant Sayısı: ${byModel[exampleModel].length}`);
byModel[exampleModel].forEach((variant: any, i: number) => {
    console.log(`  ${i + 1}. ${variant['Ürün Rengi']} - ${variant['Boyut/Ebat']} - ${variant['Trendyol\'da Satılacak Fiyat(KDV Dahil)']} TL`);
});
