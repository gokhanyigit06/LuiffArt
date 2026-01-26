'use client';

import React, { useEffect, useState, use } from 'react';
import {
    Card, Row, Col, Typography, Space, Tag,
    Table, Button, Avatar, Divider, message, Breadcrumb
} from 'antd';
import {
    UserOutlined, MailOutlined, CalendarOutlined,
    ShoppingOutlined, WalletOutlined, ArrowLeftOutlined,
    EnvironmentOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;

interface Order {
    id: string;
    orderNumber: number;
    createdAt: string;
    status: string;
    totalAmount: string;
    currency: string;
    _count: { orderItems: number };
}

interface Address {
    id: string;
    title: string;
    fullName: string;
    phone: string;
    city: string;
    country: string;
    address: string;
    district: string;
}

interface CustomerDetail {
    id: string;
    name: string | null;
    email: string;
    createdAt: string;
    orders: Order[];
    addresses: Address[];
}

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [customer, setCustomer] = useState<CustomerDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchCustomer();
    }, [id]);

    const fetchCustomer = async () => {
        try {
            const res = await fetch(`/api/admin/customers/${id}`);
            if (res.ok) {
                const data = await res.json();
                setCustomer(data);
            } else {
                message.error('Customer not found');
                router.push('/admin/customers');
            }
        } catch (error) {
            message.error('Failed to load customer details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!customer) return null;

    const totalSpend = customer.orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const aov = customer.orders.length > 0 ? totalSpend / customer.orders.length : 0;
    const mainCurrency = customer.orders[0]?.currency || 'TRY';

    const orderColumns = [
        {
            title: 'Order',
            dataIndex: 'orderNumber',
            key: 'orderNumber',
            render: (num: number, record: Order) => (
                <Link href={`/admin/orders/${record.id}`}>
                    <Text strong>#{num}</Text>
                </Link>
            ),
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => dayjs(date).format('MMM D, YYYY'),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const colors: Record<string, string> = {
                    'PAID': 'blue', 'DELIVERED': 'green', 'PENDING': 'orange',
                    'CANCELLED': 'red', 'SHIPPED': 'purple'
                };
                return <Tag color={colors[status] || 'default'}>{status}</Tag>;
            }
        },
        {
            title: 'Items',
            dataIndex: ['_count', 'orderItems'],
            key: 'items',
        },
        {
            title: 'Total',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount: string, record: Order) => (
                <Text strong>
                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: record.currency }).format(Number(amount))}
                </Text>
            ),
        },
    ];

    return (
        <div style={{ paddingBottom: 40 }}>
            {/* Header / Breadcrumbs */}
            <div style={{ marginBottom: 24 }}>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => router.back()}
                    style={{ marginBottom: 16 }}
                >
                    Back to Customers
                </Button>
                <Title level={2} style={{ margin: 0, fontFamily: 'var(--font-italiana)' }}>
                    {customer.name || 'Anonymous Customer'}
                </Title>
                <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                    <Text type="secondary"><MailOutlined /> {customer.email}</Text>
                    <Text type="secondary"><CalendarOutlined /> Joined {dayjs(customer.createdAt).format('MMMM D, YYYY')}</Text>
                </div>
            </div>

            <Row gutter={[24, 24]}>
                {/* Left Column: Stats & Profile */}
                <Col xs={24} lg={16}>
                    <Space orientation="vertical" size={24} style={{ width: '100%' }}>
                        {/* Stats Summary */}
                        <Row gutter={16}>
                            <Col span={8}>
                                <Card size="small" style={{ borderRadius: 12 }}>
                                    <Text type="secondary" style={{ fontSize: 12 }}><WalletOutlined /> Total Spend</Text>
                                    <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>
                                        {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: mainCurrency }).format(totalSpend)}
                                    </div>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card size="small" style={{ borderRadius: 12 }}>
                                    <Text type="secondary" style={{ fontSize: 12 }}><ShoppingOutlined /> Total Orders</Text>
                                    <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>
                                        {customer.orders.length}
                                    </div>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card size="small" style={{ borderRadius: 12 }}>
                                    <Text type="secondary" style={{ fontSize: 12 }}><ClockCircleOutlined /> Avg. Order Value</Text>
                                    <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>
                                        {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: mainCurrency }).format(aov)}
                                    </div>
                                </Card>
                            </Col>
                        </Row>

                        {/* Order History */}
                        <Card title="Order History" style={{ borderRadius: 12 }}>
                            <Table
                                columns={orderColumns}
                                dataSource={customer.orders}
                                rowKey="id"
                                pagination={{ pageSize: 5 }}
                            />
                        </Card>
                    </Space>
                </Col>

                {/* Right Column: Contact & Addresses */}
                <Col xs={24} lg={8}>
                    <Space orientation="vertical" size={24} style={{ width: '100%' }}>
                        <Card title="Customer Details" style={{ borderRadius: 12 }}>
                            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                                <Avatar size={80} icon={<UserOutlined />} style={{ backgroundColor: '#f0f2f5', color: '#1890ff' }} />
                                <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>{customer.name || 'Anonymous'}</Title>
                                <Tag color="gold">Loyal Customer</Tag>
                            </div>
                            <Divider />
                            <Space orientation="vertical" size={12} style={{ width: '100%' }}>
                                <div>
                                    <Text type="secondary" style={{ fontSize: 12 }}>Email Address</Text>
                                    <div><Text strong>{customer.email}</Text></div>
                                </div>
                                <div>
                                    <Text type="secondary" style={{ fontSize: 12 }}>Customer Since</Text>
                                    <div><Text strong>{dayjs(customer.createdAt).format('DD MMM YYYY')}</Text></div>
                                </div>
                            </Space>
                        </Card>

                        <Card title={<span><EnvironmentOutlined /> Addresses</span>} style={{ borderRadius: 12 }}>
                            {customer.addresses.length > 0 ? (
                                customer.addresses.map((addr, idx) => (
                                    <div key={addr.id} style={{ marginBottom: idx === customer.addresses.length - 1 ? 0 : 16 }}>
                                        <Text strong>{addr.title}</Text>
                                        <div style={{ fontSize: 13, color: '#595959', marginTop: 4 }}>
                                            {addr.fullName}<br />
                                            {addr.address}<br />
                                            {addr.district}, {addr.city}, {addr.country}
                                        </div>
                                        {idx !== customer.addresses.length - 1 && <Divider style={{ margin: '12px 0' }} />}
                                    </div>
                                ))
                            ) : (
                                <Text type="secondary" italic>No addresses registered yet.</Text>
                            )}
                        </Card>
                    </Space>
                </Col>
            </Row>
        </div>
    );
}
