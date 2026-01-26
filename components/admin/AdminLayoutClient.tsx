'use client';

import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import {
    DashboardOutlined,
    ShoppingOutlined,
    AppstoreOutlined,
    ShoppingCartOutlined,
    ImportOutlined,
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PercentageOutlined
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const { Header, Sider, Content } = Layout;

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    if (pathname === '/admin/login') return <>{children}</>;

    const menuItems = [
        { key: '/admin', icon: <DashboardOutlined />, label: 'Dashboard' },
        { key: '/admin/products', icon: <ShoppingOutlined />, label: 'Products' },
        { key: '/admin/categories', icon: <AppstoreOutlined />, label: 'Categories' },
        { key: '/admin/orders', icon: <ShoppingCartOutlined />, label: 'Orders' },
        { key: '/admin/customers', icon: <UserOutlined />, label: 'Customers' },
        { key: '/admin/campaigns', icon: <PercentageOutlined />, label: 'Campaigns' },
        { key: '/admin/import', icon: <ImportOutlined />, label: 'Import' },
        { key: '/admin/settings', icon: <SettingOutlined />, label: 'Settings' },
    ];

    const handleMenuClick = ({ key }: { key: string }) => {
        if (key === 'logout') {
            signOut({ callbackUrl: '/admin/login' });
        } else {
            router.push(key);
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 100
                }}
            >
                <div style={{
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <span style={{
                        fontFamily: 'var(--font-italiana)',
                        fontSize: collapsed ? 20 : 24,
                        fontWeight: 'bold',
                        color: 'white',
                        transition: 'all 0.2s'
                    }}>
                        {collapsed ? 'L' : 'LUIFF'}
                    </span>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[pathname]}
                    onClick={handleMenuClick}
                    items={menuItems}
                    style={{ borderRight: 0, fontFamily: 'var(--font-outfit)' }}
                />
            </Sider>

            <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
                <Header style={{
                    padding: '0 24px',
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #f0f0f0',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: 16 }}
                    />

                    <Dropdown menu={{
                        items: [
                            { key: 'logout', label: 'Logout', icon: <LogoutOutlined />, danger: true }
                        ],
                        onClick: handleMenuClick
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                            <Avatar
                                style={{ backgroundColor: '#1890ff' }}
                                icon={<UserOutlined />}
                            />
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: 14, fontWeight: 500, lineHeight: '20px' }}>Admin User</div>
                                <div style={{ fontSize: 12, color: '#8c8c8c', lineHeight: '16px' }}>Store Manager</div>
                            </div>
                        </div>
                    </Dropdown>
                </Header>

                <Content style={{
                    margin: '24px 16px',
                    padding: 24,
                    minHeight: 280,
                    background: '#fff',
                    borderRadius: 8
                }}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}
