'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Image, Tag, message, Card, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Product {
    id: string;
    name: string;
    description: string | null;
    images: string[];
    isActive: boolean;
    category: { name: string } | null;
    variants: any[];
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/products', {
                cache: 'no-store',
                headers: { 'Cache-Control': 'no-cache' }
            });
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            message.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/products/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                message.success('Product deleted');
                fetchProducts();
            } else {
                message.error('Failed to delete product');
            }
        } catch (error) {
            message.error('An error occurred');
        }
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'images',
            key: 'images',
            width: 80,
            render: (images: string[]) => {
                const imageUrl = images && images.length > 0 ? images[0] : null;
                return imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt="Product"
                        width={50}
                        height={50}
                        style={{ objectFit: 'cover', borderRadius: 4 }}
                    />
                ) : (
                    <div style={{ width: 50, height: 50, background: '#f0f0f0', borderRadius: 4 }} />
                );
            },
        },
        {
            title: 'Product Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: (category: any | null) => category?.name || '-',
        },
        {
            title: 'Variants',
            key: 'variants',
            render: (record: any) => record.variants?.length || 0
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive: boolean) => (
                <Tag color={isActive ? 'success' : 'default'}>
                    {isActive ? 'Active' : 'Draft'}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record: Product) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => router.push(`/admin/products/${record.id}`)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete this product?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" danger icon={<DeleteOutlined />}>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ margin: '-24px', backgroundColor: '#fff' }}>
            <div style={{
                padding: '3rem 4rem 2rem',
                borderBottom: '2px solid #000',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end'
            }}>
                <div>
                    <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        letterSpacing: '0.4em',
                        color: '#000',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '1rem'
                    }}>
                        Product Management
                    </span>
                    <h1 className="font-italiana" style={{
                        fontSize: 'clamp(3rem, 5vw, 5rem)',
                        fontWeight: 400,
                        marginBottom: '0.5rem',
                        lineHeight: 0.9,
                        letterSpacing: '-0.02em'
                    }}>
                        PRODUCTS
                    </h1>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => router.push('/admin/products/new')}
                    style={{
                        height: '48px',
                        padding: '0 32px',
                        backgroundColor: '#000',
                        border: 'none',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontSize: '11px'
                    }}
                >
                    Add Product
                </Button>
            </div>
            <div style={{ padding: '2rem 4rem' }}>
                <Card>
                    <Table
                        columns={columns}
                        dataSource={products}
                        rowKey="id"
                        loading={loading}
                        pagination={{ pageSize: 10 }}
                    />
                </Card>
            </div>
        </div>
    );
}
