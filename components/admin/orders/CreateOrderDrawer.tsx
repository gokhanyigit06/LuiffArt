'use client';

import React, { useState, useEffect } from 'react';
import {
    Drawer, Form, Input, Button, Space, Table,
    Select, InputNumber, Divider, Card, Typography,
    Empty, message, Tag, Badge
} from 'antd';
import {
    PlusOutlined, DeleteOutlined, UserOutlined,
    ShoppingOutlined, CreditCardOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Option } = Select;

interface CreateOrderDrawerProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface Product {
    id: string;
    name: string;
    variants: Variant[];
}

interface Variant {
    id: string;
    size: string;
    material: string;
    priceTRY: number;
    priceUSD: number;
    stock: number;
    sku: string;
}

interface OrderItem {
    key: string;
    productId: string;
    productName: string;
    variantId: string;
    variantName: string;
    price: number;
    quantity: number;
    stock: number;
}

export default function CreateOrderDrawer({ open, onClose, onSuccess }: CreateOrderDrawerProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
    const [currency, setCurrency] = useState<'TRY' | 'USD'>('TRY');

    useEffect(() => {
        if (open) {
            fetchProducts();
        }
    }, [open]);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/admin/products');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            message.error('Failed to load products');
        }
    };

    const handleAddProduct = (variantId: string) => {
        const product = products.find(p => p.variants.some(v => v.id === variantId));
        const variant = product?.variants.find(v => v.id === variantId);

        if (!product || !variant) return;

        if (selectedItems.find(item => item.variantId === variantId)) {
            message.warning('Product already added');
            return;
        }

        const newItem: OrderItem = {
            key: variantId,
            productId: product.id,
            productName: product.name,
            variantId: variant.id,
            variantName: `${variant.size} / ${variant.material}`,
            price: Number(currency === 'TRY' ? variant.priceTRY : variant.priceUSD),
            quantity: 1,
            stock: variant.stock
        };

        setSelectedItems([...selectedItems, newItem]);
    };

    const handleRemoveItem = (key: string) => {
        setSelectedItems(selectedItems.filter(item => item.key !== key));
    };

    const handleQuantityChange = (key: string, quantity: number | null) => {
        if (quantity === null) return;
        setSelectedItems(selectedItems.map(item =>
            item.key === key ? { ...item, quantity } : item
        ));
    };

    const calculateTotals = () => {
        const subtotal = selectedItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
        return {
            subtotal,
            total: subtotal // For now skipping tax/shipping calc until requested
        };
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (selectedItems.length === 0) {
                message.error('Please add at least one product');
                return;
            }

            setLoading(true);
            const { subtotal, total } = calculateTotals();

            const payload = {
                ...values,
                currency,
                subtotal,
                totalAmount: total,
                items: selectedItems.map(item => ({
                    variantId: item.variantId,
                    quantity: item.quantity,
                    price: Number(item.price)
                })),
                // Simplified addresses for now based on current schema requirements
                shippingAddress: {
                    fullName: values.customerName,
                    address: values.shippingAddress,
                    city: values.city,
                    country: values.country,
                },
                billingAddress: {
                    fullName: values.customerName,
                    address: values.shippingAddress,
                    city: values.city,
                    country: values.country,
                }
            };

            const response = await fetch('/api/admin/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                message.success('Order created successfully');
                form.resetFields();
                setSelectedItems([]);
                onSuccess();
                onClose();
            } else {
                const error = await response.json();
                message.error(error.error || 'Failed to create order');
            }
        } catch (error) {
            // Form validation error
        } finally {
            setLoading(false);
        }
    };

    const columns: ColumnsType<OrderItem> = [
        {
            title: 'Product',
            dataIndex: 'productName',
            render: (text, record) => (
                <div>
                    <Text strong>{text}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>{record.variantName}</Text>
                </div>
            )
        },
        {
            title: 'Price',
            dataIndex: 'price',
            width: 120,
            render: (price) => `${currency === 'TRY' ? '₺' : '$'}${Number(price).toFixed(2)}`
        },
        {
            title: 'Qty',
            dataIndex: 'quantity',
            width: 100,
            render: (qty, record) => (
                <InputNumber
                    min={1}
                    max={record.stock}
                    value={qty}
                    onChange={(val) => handleQuantityChange(record.key, val)}
                />
            )
        },
        {
            title: 'Total',
            width: 120,
            render: (_, record) => `${currency === 'TRY' ? '₺' : '$'}${(Number(record.price) * record.quantity).toFixed(2)}`
        },
        {
            title: '',
            width: 50,
            render: (_, record) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveItem(record.key)}
                />
            )
        }
    ];

    const { subtotal, total } = calculateTotals();

    return (
        <Drawer
            title={<Title level={4} style={{ margin: 0 }}>Create Professional Order</Title>}
            size="large"
            onClose={onClose}
            open={open}
            extra={
                <Space>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="primary" loading={loading} onClick={handleSubmit}>
                        Create Order
                    </Button>
                </Space>
            }
        >
            <Form form={form} layout="vertical">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                    <Card size="small" title={<span><UserOutlined /> Customer Info</span>} className="mb-6">
                        <Form.Item label="Customer Name" name="customerName" rules={[{ required: true }]}>
                            <Input placeholder="John Doe" />
                        </Form.Item>
                        <Form.Item label="Email Address" name="customerEmail" rules={[{ required: true, type: 'email' }]}>
                            <Input placeholder="john@example.com" />
                        </Form.Item>
                    </Card>

                    <Card size="small" title={<span><CreditCardOutlined /> Order Settings</span>} className="mb-6">
                        <Form.Item label="Currency" initialValue="TRY">
                            <Select value={currency} onChange={setCurrency}>
                                <Option value="TRY">Turkish Lira (₺)</Option>
                                <Option value="USD">US Dollar ($)</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Order Status" name="status" initialValue="PAID">
                            <Select>
                                <Option value="PENDING">Pending</Option>
                                <Option value="PAID">Paid</Option>
                                <Option value="PREPARING">Preparing</Option>
                            </Select>
                        </Form.Item>
                    </Card>
                </div>

                <Card size="small" title={<span><ShoppingOutlined /> Shipping Address</span>} className="mb-6">
                    <Form.Item label="Full Address" name="shippingAddress" rules={[{ required: true }]}>
                        <Input.TextArea rows={2} placeholder="123 Art St, Gallery District..." />
                    </Form.Item>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <Form.Item label="City" name="city" rules={[{ required: true }]}>
                            <Input placeholder="Istanbul" />
                        </Form.Item>
                        <Form.Item label="Country" name="country" rules={[{ required: true }]}>
                            <Input placeholder="Turkey" />
                        </Form.Item>
                    </div>
                </Card>

                <Divider titlePlacement="left">Order Items</Divider>

                <div className="mb-4">
                    <Select
                        showSearch
                        placeholder="Search products to add..."
                        style={{ width: '100%' }}
                        onChange={handleAddProduct}
                        value={null}
                        optionFilterProp="label"
                        filterOption={(input, option: any) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {products.map(product => (
                            <Select.OptGroup key={product.id} label={product.name}>
                                {product.variants.map(variant => (
                                    <Option
                                        key={variant.id}
                                        value={variant.id}
                                        label={`${product.name} - ${variant.size} / ${variant.material}`}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>{variant.size} / {variant.material}</span>
                                            <Tag color={variant.stock > 0 ? 'green' : 'red'}>
                                                Stock: {variant.stock}
                                            </Tag>
                                        </div>
                                    </Option>
                                ))}
                            </Select.OptGroup>
                        ))}
                    </Select>
                </div>

                <Table
                    columns={columns}
                    dataSource={selectedItems}
                    pagination={false}
                    locale={{ emptyText: <Empty description="No products added yet" /> }}
                />

                <div style={{ marginTop: 24, padding: 16, background: '#fafafa', borderRadius: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Text>Subtotal</Text>
                        <Text strong>{currency === 'TRY' ? '₺' : '$'}{subtotal.toFixed(2)}</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Text>Shipping</Text>
                        <Text type="secondary">Calculated at checkout</Text>
                    </div>
                    <Divider style={{ margin: '12px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Title level={4} style={{ margin: 0 }}>Total</Title>
                        <Title level={4} style={{ margin: 0 }}>
                            {currency === 'TRY' ? '₺' : '$'}{total.toFixed(2)}
                        </Title>
                    </div>
                </div>
            </Form>
        </Drawer>
    );
}
