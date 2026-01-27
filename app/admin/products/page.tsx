'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Drawer, Form, Input, Select, Switch, message, Popconfirm, Space, Image, InputNumber, Tabs, Card, Divider, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

export const dynamic = 'force-dynamic';

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface Variant {
    id: string;
    size: string;
    material: string;
    priceTRY: number;
    compareAtPriceTRY: number | null;
    costPriceTRY: number | null;
    priceUSD: number;
    compareAtPriceUSD: number | null;
    stock: number;
    trackQuantity: boolean;
    sku: string;
    barcode: string | null;
}

interface Product {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    images: string[];
    isActive: boolean;
    categoryId: string | null;
    category: Category | null;
    variants: Variant[];
    tags: string[];
    productType: string | null;
    vendor: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [form] = Form.useForm();

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

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/admin/categories', {
                cache: 'no-store',
                headers: { 'Cache-Control': 'no-cache' }
            });
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            message.error('Failed to load categories');
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        const slug = name
            .toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        form.setFieldsValue({ slug });
    };

    const showModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            const firstVariant = product.variants?.[0] || {};
            form.setFieldsValue({
                ...product,
                imageUrl: product.images[0] || '',
                priceTRY: firstVariant.priceTRY,
                priceUSD: firstVariant.priceUSD,
                stock: firstVariant.stock,
                sku: firstVariant.sku,
                compareAtPriceTRY: firstVariant.compareAtPriceTRY,
                compareAtPriceUSD: firstVariant.compareAtPriceUSD,
                costPriceTRY: firstVariant.costPriceTRY,
                barcode: firstVariant.barcode,
                trackQuantity: firstVariant.trackQuantity ?? true
            });
        } else {
            setEditingProduct(null);
            form.resetFields();
            form.setFieldsValue({ isActive: true, trackQuantity: true });
        }
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        form.resetFields();
    };

    const handleSubmit = async (values: any) => {
        try {
            console.log('Form values:', values);

            const images = values.imageUrl ? [values.imageUrl] : [];
            const defaultVariant = {
                size: 'Standard',
                material: 'Standard',
                priceTRY: parseFloat(values.priceTRY) || 0,
                compareAtPriceTRY: values.compareAtPriceTRY ? parseFloat(values.compareAtPriceTRY) : null,
                costPriceTRY: values.costPriceTRY ? parseFloat(values.costPriceTRY) : null,
                priceUSD: parseFloat(values.priceUSD) || 0,
                compareAtPriceUSD: values.compareAtPriceUSD ? parseFloat(values.compareAtPriceUSD) : null,
                stock: parseInt(values.stock) || 0,
                trackQuantity: values.trackQuantity !== undefined ? values.trackQuantity : true,
                sku: values.sku || `${values.slug || 'PRODUCT'}-STD`.toUpperCase(),
                barcode: values.barcode || null,
                weight: 0,
                desi: 0
            };

            const payload = {
                name: values.name,
                slug: values.slug || values.name.toLowerCase().replace(/\s+/g, '-'),
                description: values.description || null,
                images,
                categoryId: values.categoryId || null,
                isActive: values.isActive !== undefined ? values.isActive : true,
                tags: values.tags || [],
                productType: values.productType || null,
                vendor: values.vendor || null,
                seoTitle: values.seoTitle || null,
                seoDescription: values.seoDescription || null,
                variants: [defaultVariant]
            };

            console.log('Payload to send:', payload);

            if (editingProduct) {
                const response = await fetch(`/api/admin/products/${editingProduct.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const data = await response.json();
                console.log('Update response:', data);

                if (response.ok) {
                    message.success('Product updated');
                    fetchProducts();
                    handleCancel();
                } else {
                    console.error('Update error:', data);
                    message.error(data.error || 'Failed to update product');
                }
            } else {
                const response = await fetch('/api/admin/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const data = await response.json();
                console.log('Create response:', data);

                if (response.ok) {
                    message.success('Product created successfully!');
                    fetchProducts();
                    if (values.categoryId) fetchCategories();
                    handleCancel();
                } else {
                    console.error('Create error:', data);
                    message.error(data.error || 'Failed to create product');
                }
            }
        } catch (error) {
            console.error('Submit error:', error);
            message.error('An error occurred: ' + (error as Error).message);
        }
    };

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
            render: (category: Category | null) => category?.name || '-',
        },
        {
            title: 'Price (TL)',
            key: 'price',
            render: (record: any) => {
                const variant = record.variants?.[0];
                return variant ? `₺${variant.priceTRY}` : '-';
            }
        },
        {
            title: 'Stock',
            key: 'stock',
            render: (record: any) => {
                const variant = record.variants?.[0];
                const stock = variant ? variant.stock : 0;
                return (
                    <Tag color={stock > 10 ? 'green' : stock > 0 ? 'orange' : 'red'}>
                        {stock}
                    </Tag>
                );
            }
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
                        onClick={() => showModal(record)}
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
                    <p style={{ color: '#666', fontSize: 14, margin: 0, letterSpacing: '0.05em' }}>
                        Manage your store products and inventory
                    </p>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => showModal()}
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
                        locale={{
                            emptyText: (
                                <div style={{ padding: '40px 0', textAlign: 'center' }}>
                                    <div style={{ fontSize: 48, marginBottom: 16 }}>🎨</div>
                                    <h3 style={{ fontFamily: 'var(--font-italiana)', fontSize: 20, marginBottom: 8 }}>
                                        Your Gallery Awaits
                                    </h3>
                                    <p style={{ color: '#8c8c8c', marginBottom: 24 }}>
                                        Add your first masterpiece to begin showcasing your art collection
                                    </p>
                                    <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                                        Add First Product
                                    </Button>
                                </div>
                            )
                        }}
                    />
                </Card>

                <Drawer
                    title={editingProduct ? 'Edit Product' : 'New Product'}
                    open={isModalOpen}
                    onClose={handleCancel}
                    size="large"
                    extra={
                        <Space>
                            <Button onClick={handleCancel}>Cancel</Button>
                            <Button type="primary" onClick={() => form.submit()}>
                                {editingProduct ? 'Update' : 'Save'}
                            </Button>
                        </Space>
                    }
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{ isActive: true, trackQuantity: true }}
                    >
                        <Tabs
                            defaultActiveKey="1"
                            items={[
                                {
                                    key: '1',
                                    label: 'Basic Info',
                                    children: (
                                        <>
                                            <Form.Item label="Product Name" name="name" rules={[{ required: true, message: 'Please enter product name' }]}>
                                                <Input onChange={handleNameChange} placeholder="e.g. Abstract Sunset Canvas" />
                                            </Form.Item>
                                            <Form.Item label="Description" name="description">
                                                <Input.TextArea rows={4} placeholder="Describe your artwork..." />
                                            </Form.Item>
                                            <Form.Item label="Image URL" name="imageUrl" rules={[{ required: true, message: 'Please enter image URL' }]}>
                                                <Input placeholder="https://images.unsplash.com/photo-..." />
                                            </Form.Item>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                                <Form.Item label="Price (TL)" name="priceTRY" rules={[{ required: true, message: 'Required' }]}>
                                                    <InputNumber prefix="₺" style={{ width: '100%' }} precision={2} min={0} placeholder="0.00" />
                                                </Form.Item>
                                                <Form.Item label="Price (USD)" name="priceUSD" rules={[{ required: true, message: 'Required' }]}>
                                                    <InputNumber prefix="$" style={{ width: '100%' }} precision={2} min={0} placeholder="0.00" />
                                                </Form.Item>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                                <Form.Item label="Stock Quantity" name="stock" initialValue={0}>
                                                    <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
                                                </Form.Item>
                                                <Form.Item label="Category" name="categoryId">
                                                    <Select
                                                        allowClear
                                                        placeholder="Select category"
                                                        options={categories.map((cat) => ({
                                                            label: cat.name,
                                                            value: cat.id,
                                                        }))}
                                                    />
                                                </Form.Item>
                                            </div>

                                            <Form.Item label="Status" name="isActive">
                                                <Select>
                                                    <Select.Option value={true}>Active</Select.Option>
                                                    <Select.Option value={false}>Draft</Select.Option>
                                                </Select>
                                            </Form.Item>
                                        </>
                                    )
                                },
                                {
                                    key: '2',
                                    label: 'Advanced Pricing',
                                    children: (
                                        <>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                                <Form.Item label="Compare Price (TL)" name="compareAtPriceTRY" tooltip="Original price before discount">
                                                    <InputNumber prefix="₺" style={{ width: '100%' }} precision={2} min={0} />
                                                </Form.Item>
                                                <Form.Item label="Compare Price (USD)" name="compareAtPriceUSD">
                                                    <InputNumber prefix="$" style={{ width: '100%' }} precision={2} min={0} />
                                                </Form.Item>
                                            </div>
                                            <Form.Item label="Cost Price (TL)" name="costPriceTRY" tooltip="Your cost - customers won't see this">
                                                <InputNumber prefix="₺" style={{ width: '100%' }} precision={2} min={0} />
                                            </Form.Item>
                                            <Form.Item label="SKU" name="sku" tooltip="Stock Keeping Unit">
                                                <Input placeholder="AUTO-GENERATED" />
                                            </Form.Item>
                                            <Form.Item label="Barcode" name="barcode">
                                                <Input placeholder="ISBN, UPC, GTIN..." />
                                            </Form.Item>
                                            <Form.Item label="Track Inventory" name="trackQuantity" valuePropName="checked">
                                                <Switch defaultChecked />
                                            </Form.Item>
                                        </>
                                    )
                                }
                            ]}
                        />
                    </Form>
                </Drawer>
            </div>
        </div>
    );
}
