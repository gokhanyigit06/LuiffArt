'use client';

import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Breadcrumb, Dropdown, theme } from 'antd';
import {
    DashboardOutlined,
    ShoppingOutlined,
    UserOutlined,
    SettingOutlined,
    ImportOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const { Header, Sider, Content } = Layout;

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const menuItems = [
        {
            key: '/admin',
            icon: <DashboardOutlined />,
            label: 'Overview',
        },
        {
            key: '/admin/products',
            icon: <ShoppingOutlined />,
            label: 'Products',
        },
        {
            key: '/admin/orders',
            icon: <ShoppingOutlined />, // Using same icon temporarily
            label: 'Orders',
        },
        {
            key: '/admin/import',
            icon: <ImportOutlined />,
            label: 'Import CSV',
        },
        {
            key: '/admin/customers',
            icon: <UserOutlined />,
            label: 'Customers',
        },
        {
            key: '/admin/settings',
            icon: <SettingOutlined />,
            label: 'Settings',
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed} theme="light" className="border-r border-gray-100 !fixed !h-screen !z-20">
                <div className="h-16 flex items-center justify-center border-b border-gray-50">
                    <span className={`font-italiana font-bold text-xl transition-opacity duration-300 ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                        LUIFF
                    </span>
                </div>
                <Menu
                    theme="light"
                    mode="inline"
                    selectedKeys={[pathname]}
                    onClick={({ key }) => router.push(key)}
                    items={menuItems}
                    className="!border-none mt-4 font-outfit"
                />
            </Sider>
            <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
                <Header style={{ padding: '0 24px', background: colorBgContainer }} className="flex justify-between items-center sticky top-0 z-10 border-b border-gray-100 !h-16">
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        className="!w-10 !h-10 hover:!bg-black/5"
                    />

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-medium font-outfit">Admin User</div>
                            <div className="text-xs text-gray-500 font-outfit">Store Manager</div>
                        </div>
                        <Dropdown menu={{
                            items: [
                                { key: 'logout', label: 'Logout', icon: <LogoutOutlined />, danger: true }
                            ]
                        }}>
                            <Avatar style={{ backgroundColor: '#000' }} icon={<UserOutlined />} className="cursor-pointer" />
                        </Dropdown>
                    </div>
                </Header>
                <Content style={{ margin: '24px 24px', minHeight: 280 }}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}
