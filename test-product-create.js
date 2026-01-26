// Test script to create a product via API
// Run this in browser console after logging in to admin panel

const testProduct = {
    name: "Volkan Yıldırım Test",
    slug: "volkan-yildirim-test",
    description: "Test artwork",
    images: ["https://images.unsplash.com/photo-1541961017774-22349e4a1262"],
    categoryId: null,
    isActive: true,
    tags: [],
    productType: null,
    vendor: null,
    seoTitle: null,
    seoDescription: null,
    variants: [{
        size: "Standard",
        material: "Standard",
        priceTRY: 2500,
        compareAtPriceTRY: null,
        costPriceTRY: null,
        priceUSD: 85,
        compareAtPriceUSD: null,
        stock: 5,
        trackQuantity: true,
        sku: "VOLKAN-TEST-STD",
        barcode: null,
        weight: 0,
        desi: 0
    }]
};

fetch('/api/admin/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testProduct)
})
    .then(res => res.json())
    .then(data => console.log('Response:', data))
    .catch(err => console.error('Error:', err));
