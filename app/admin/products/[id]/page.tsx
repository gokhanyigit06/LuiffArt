'use client';

import { useEffect, useState } from 'react';
import ProductForm from '@/components/admin/ProductForm';
import { Spin, message } from 'antd';
import { useParams } from 'next/navigation';

export default function EditProductPage() {
    const params = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetch(`/api/admin/products/${params.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.error) throw new Error(data.error);
                    setProduct(data);
                })
                .catch(err => message.error('Failed to load product'))
                .finally(() => setLoading(false));
        }
    }, [params.id]);

    if (loading) return <div className="p-12 text-center"><Spin size="large" /></div>;

    if (!product) return <div>Product not found</div>;

    return (
        <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            <ProductForm mode="edit" initialValues={product} />
        </div>
    );
}
