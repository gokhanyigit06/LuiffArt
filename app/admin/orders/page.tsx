'use client';

import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Input, Card, message, Space } from 'antd';
import { EyeOutlined, SearchOutlined, DownloadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import Link from 'next/link';
import dayjs from 'dayjs';

import CreateOrderDrawer from '@/components/admin/orders/CreateOrderDrawer';

interface Order {
    id: string;
    orderNumber: number;
    createdAt: string;
    status: string;
    totalAmount: string;
    currency: string;
    user: {
        name: string;
        email: string;
    } | null;
    _count: {
        orderItems: number;
    };
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/admin/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        if (orders.length === 0) {
            message.warning('No orders to export');
            return;
        }

        // Create CSV content
        const headers = ['Order Number', 'Date', 'Customer', 'Email', 'Status', 'Items', 'Total', 'Currency'];
        const csvRows = [headers.join(',')];

        orders.forEach(order => {
            const row = [
                `#${order.orderNumber}`,
                dayjs(order.createdAt).format('YYYY-MM-DD HH:mm'),
                order.user?.name || 'Guest',
                order.user?.email || '-',
                order.status,
                order._count.orderItems,
                order.totalAmount,
                order.currency
            ];
            csvRows.push(row.join(','));
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `orders_${dayjs().format('YYYY-MM-DD')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        message.success('Orders exported successfully!');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'orange';
            case 'PAID': return 'blue';
            case 'PREPARING': return 'cyan';
            case 'SHIPPED': return 'purple';
            case 'DELIVERED': return 'green';
            case 'CANCELLED': return 'red';
            case 'REFUNDED': return 'volcano';
            default: return 'default';
        }
    };

    const columns = [
        {
            title: 'Order',
            dataIndex: 'orderNumber',
            key: 'orderNumber',
            render: (text: number) => <span style={{ fontWeight: 600 }}>#{text}</span>,
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => dayjs(date).format('MMM D, YYYY h:mm A'),
        },
        {
            title: 'Customer',
            key: 'customer',
            render: (_: any, record: Order) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{record.user?.name || 'Guest'}</div>
                    <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.user?.email}</div>
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={getStatusColor(status)}>{status}</Tag>
            ),
        },
        {
            title: 'Items',
            dataIndex: ['_count', 'orderItems'],
            key: 'items',
            render: (count: number) => `${count} items`,
        },
        {
            title: 'Total',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount: string, record: Order) => (
                <span style={{ fontWeight: 600 }}>
                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: record.currency }).format(Number(amount))}
                </span>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Order) => (
                <Link href={`/admin/orders/${record.id}`}>
                    <Button icon={<EyeOutlined />} type="link">View</Button>
                </Link>
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
                        Order Management
                    </span>
                    <h1 className="font-italiana" style={{
                        fontSize: 'clamp(3rem, 5vw, 5rem)',
                        fontWeight: 400,
                        marginBottom: '0.5rem',
                        lineHeight: 0.9,
                        letterSpacing: '-0.02em'
                    }}>
                        ORDERS
                    </h1>
                    <p style={{ color: '#666', fontSize: 14, margin: 0, letterSpacing: '0.05em' }}>
                        Manage and track your store orders
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <Button
                        icon={<DownloadOutlined />}
                        onClick={handleExport}
                        disabled={orders.length === 0}
                        style={{
                            height: '48px',
                            padding: '0 24px',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            fontSize: '11px'
                        }}
                    >
                        Export
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsDrawerOpen(true)}
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
                        Create Order
                    </Button>
                </div>
            </div>
            <div style={{ padding: '2rem 4rem' }}>

                <Card>
                    <div style={{ marginBottom: 16 }}>
                        <Input
                            placeholder="Search orders..."
                            prefix={<SearchOutlined />}
                            style={{ maxWidth: 400 }}
                        />
                    </div>
                    <Table
                        columns={columns}
                        dataSource={orders}
                        rowKey="id"
                        loading={loading}
                        pagination={{ pageSize: 10 }}
                        locale={{
                            emptyText: (
                                <div style={{ padding: '40px 0', textAlign: 'center' }}>
                                    <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
                                    <h3 style={{ fontFamily: 'var(--font-italiana)', fontSize: 20, marginBottom: 8 }}>
                                        No Orders Yet
                                    </h3>
                                    <p style={{ color: '#8c8c8c' }}>
                                        Orders will appear here once customers start purchasing
                                    </p>
                                </div>
                            )
                        }}
                    />
                </Card>

                <CreateOrderDrawer
                    open={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    onSuccess={fetchOrders}
                />
            </div>

            <CreateOrderDrawer
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                onSuccess={fetchOrders}
            />
        </div>
    );
}
