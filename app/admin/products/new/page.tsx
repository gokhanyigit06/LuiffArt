'use client';

import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
    return (
        <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            <ProductForm mode="create" />
        </div>
    );
}
