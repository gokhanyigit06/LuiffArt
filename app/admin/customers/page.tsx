'use client';

import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Input, Space, Tag, Typography, message } from 'antd';
import { SearchOutlined, DownloadOutlined, UserOutlined, ArrowRightOutlined } from '@ant-design/icons';
import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

interface Customer {
    id: string;
    name: string | null;
    email: string;
    createdAt: string;
    orderCount: number;
    totalSpend: number;
    mainCurrency: string;
    lastOrder: string | null;
}

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await fetch('/api/admin/customers');
            if (res.ok) {
                const data = await res.json();
                setCustomers(data);
            }
        } catch (error) {
            message.error('Failed to load customers');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        const headers = ['Name', 'Email', 'Joined', 'Orders', 'Total Spend', 'Currency', 'Last Order'];
        const csvRows = [headers.join(',')];

        customers.forEach(c => {
            const row = [
                c.name || 'Anonymous',
                c.email,
                dayjs(c.createdAt).format('YYYY-MM-DD'),
                c.orderCount,
                c.totalSpend.toFixed(2),
                c.mainCurrency,
                c.lastOrder ? dayjs(c.lastOrder).format('YYYY-MM-DD') : '-'
            ];
            csvRows.push(row.join(','));
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `customers_${dayjs().format('YYYY-MM-DD')}.csv`);
        link.click();
    };

    const filteredCustomers = customers.filter(c =>
        (c.name?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
        c.email.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: 'Customer',
            key: 'customer',
            render: (_: any, record: Customer) => (
                <Space>
                    <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: '#f0f2f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <UserOutlined style={{ color: '#1890ff' }} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 600 }}>{record.name || 'Anonymous'}</div>
                        <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.email}</div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Joined',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => dayjs(date).format('MMM D, YYYY'),
        },
        {
            title: 'Orders',
            dataIndex: 'orderCount',
            key: 'orderCount',
            sorter: (a: Customer, b: Customer) => a.orderCount - b.orderCount,
            render: (count: number) => <Tag color="blue">{count} orders</Tag>
        },
        {
            title: 'Total Spend',
            key: 'totalSpend',
            sorter: (a: Customer, b: Customer) => a.totalSpend - b.totalSpend,
            render: (_: any, record: Customer) => (
                <span style={{ fontWeight: 600 }}>
                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: record.mainCurrency }).format(record.totalSpend)}
                </span>
            ),
        },
        {
            title: 'Last Order',
            dataIndex: 'lastOrder',
            key: 'lastOrder',
            render: (date: string | null) => date ? dayjs(date).fromNow() : <Text type="secondary">No orders</Text>,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Customer) => (
                <Link href={`/admin/customers/${record.id}`}>
                    <Button type="link" icon={<ArrowRightOutlined />}>View Details</Button>
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
                        Customer Management
                    </span>
                    <h1 className="font-italiana" style={{
                        fontSize: 'clamp(3rem, 5vw, 5rem)',
                        fontWeight: 400,
                        marginBottom: '0.5rem',
                        lineHeight: 0.9,
                        letterSpacing: '-0.02em'
                    }}>
                        CUSTOMERS
                    </h1>
                    <p style={{ color: '#666', fontSize: 14, margin: 0, letterSpacing: '0.05em' }}>
                        Manage your customer relationships and view performance
                    </p>
                </div>
                <Button
                    icon={<DownloadOutlined />}
                    onClick={handleExport}
                    disabled={customers.length === 0}
                    style={{
                        height: '48px',
                        padding: '0 32px',
                        backgroundColor: '#000',
                        color: '#fff',
                        border: 'none',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontSize: '11px'
                    }}
                >
                    Export List
                </Button>
            </div>
            <div style={{ padding: '2rem 4rem' }}>

                <Card style={{ border: 'none', boxShadow: 'none' }}>
                    <div style={{ marginBottom: 16 }}>
                        <Input
                            placeholder="Search by name or email..."
                            prefix={<SearchOutlined />}
                            style={{ maxWidth: 400 }}
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                        />
                    </div>
                    <Table
                        columns={columns}
                        dataSource={filteredCustomers}
                        rowKey="id"
                        loading={loading}
                        pagination={{ pageSize: 10 }}
                        locale={{ emptyText: 'No customers found' }}
                    />
                </Card>
            </div>
        </div>
    );
}
