'use client';

import { useState } from 'react';
import { Table, Button, Space, Tag, Input, Dropdown } from 'antd';
import { PlusOutlined, MoreOutlined, SearchOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
    const router = useRouter();
    const [searchText, setSearchText] = useState('');

    // Mock Data (In real app, fetch from API)
    const products = [
        {
            key: '1',
            image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=100",
            name: "Renkli Rüyalar",
            status: "Active",
            inventory: "15 in stock for 2 variants",
            type: "Canvas",
            vendor: "Luiff Art"
        },
        {
            key: '2',
            image: "https://images.unsplash.com/photo-1501472312651-726afe119ff1?q=80&w=100",
            name: "Gece Mavisi",
            status: "Active",
            inventory: "3 in stock",
            type: "Poster",
            vendor: "Luiff Art"
        }
    ];

    const columns = [
        {
            title: '',
            dataIndex: 'image',
            key: 'image',
            width: 60,
            render: (src: string) => (
                <div className="w-10 h-10 relative bg-gray-100 rounded overflow-hidden">
                    <Image src={src} alt="Product" fill className="object-cover" />
                </div>
            )
        },
        {
            title: 'Product',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <span className="font-medium text-gray-900">{text}</span>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'Active' ? 'green' : 'red'}>{status}</Tag>
            )
        },
        {
            title: 'Inventory',
            dataIndex: 'inventory',
            key: 'inventory',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Vendor',
            dataIndex: 'vendor',
            key: 'vendor',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: () => (
                <Space>
                    <Button type="text" icon={<MoreOutlined />} />
                </Space>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold font-italiana text-gray-800">Products</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push('/admin/products/new')} className="!bg-black !h-10">
                    Add Product
                </Button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                {/* Filters */}
                <div className="mb-4 flex gap-4">
                    <Input
                        placeholder="Search products..."
                        prefix={<SearchOutlined />}
                        className="max-w-md"
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                    />
                </div>

                <Table
                    columns={columns}
                    dataSource={products}
                    pagination={{ pageSize: 10 }}
                />
            </div>
        </div>
    );
}
