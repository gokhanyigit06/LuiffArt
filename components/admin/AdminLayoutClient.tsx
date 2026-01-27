'use client';

import React, { useState } from 'react';
import { Layout, Menu, Button, Dropdown } from 'antd';
import {
    LayoutDashboard,
    ShoppingBag,
    FolderOpen,
    ShoppingCart,
    Users,
    Percent,
    Upload,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const { Header, Sider, Content } = Layout;

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    if (pathname === '/admin/login') return <>{children}</>;

    const menuItems = [
        {
            key: '/admin',
            icon: <LayoutDashboard size={18} strokeWidth={1.5} />,
            label: 'Dashboard'
        },
        {
            key: '/admin/products',
            icon: <ShoppingBag size={18} strokeWidth={1.5} />,
            label: 'Products'
        },
        {
            key: '/admin/categories',
            icon: <FolderOpen size={18} strokeWidth={1.5} />,
            label: 'Categories'
        },
        {
            key: '/admin/orders',
            icon: <ShoppingCart size={18} strokeWidth={1.5} />,
            label: 'Orders'
        },
        {
            key: '/admin/customers',
            icon: <Users size={18} strokeWidth={1.5} />,
            label: 'Customers'
        },
        {
            key: '/admin/campaigns',
            icon: <Percent size={18} strokeWidth={1.5} />,
            label: 'Campaigns'
        },
        {
            key: '/admin/import',
            icon: <Upload size={18} strokeWidth={1.5} />,
            label: 'Import'
        },
        {
            key: '/admin/settings',
            icon: <Settings size={18} strokeWidth={1.5} />,
            label: 'Settings'
        },
    ];

    const handleMenuClick = ({ key }: { key: string }) => {
        if (key === 'logout') {
            const origin = typeof window !== 'undefined' ? window.location.origin : '';
            signOut({ callbackUrl: `${origin}/admin/login` });
        } else {
            router.push(key);
        }
    };

    return (
        <Layout style={{ minHeight: '100vh', background: '#fff' }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                width={240}
                collapsedWidth={80}
                style={{
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 100,
                    background: '#fff',
                    borderRight: '2px solid #000',
                    overflow: 'hidden'
                }}
            >
                {/* Logo Area */}
                <div style={{
                    height: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid #e5e7eb',
                    padding: '20px 0'
                }}>
                    <span className="font-italiana" style={{
                        fontSize: collapsed ? 28 : 36,
                        fontWeight: 400,
                        color: '#000',
                        letterSpacing: '-0.02em',
                        transition: 'all 0.3s',
                        lineHeight: 1
                    }}>
                        {collapsed ? 'L' : 'LUIFF'}
                    </span>
                    {!collapsed && (
                        <span style={{
                            fontSize: 9,
                            fontWeight: 800,
                            letterSpacing: '0.3em',
                            color: '#666',
                            textTransform: 'uppercase',
                            marginTop: 8,
                            fontFamily: 'var(--font-outfit)'
                        }}>
                            Admin Panel
                        </span>
                    )}
                </div>

                {/* Menu */}
                <Menu
                    mode="inline"
                    selectedKeys={[pathname]}
                    onClick={handleMenuClick}
                    items={menuItems}
                    style={{
                        borderRight: 0,
                        fontFamily: 'var(--font-outfit)',
                        background: 'transparent',
                        padding: '20px 0'
                    }}
                    className="premium-admin-menu"
                />

                {/* Collapse Button */}
                <div style={{
                    position: 'absolute',
                    bottom: 20,
                    left: 0,
                    right: 0,
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <Button
                        type="text"
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            width: collapsed ? 40 : 200,
                            height: 40,
                            border: '1px solid #e5e7eb',
                            borderRadius: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s'
                        }}
                    >
                        {collapsed ?
                            <ChevronRight size={16} strokeWidth={2} /> :
                            <ChevronLeft size={16} strokeWidth={2} />
                        }
                    </Button>
                </div>
            </Sider>

            <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'all 0.3s', background: '#f5f5f5' }}>
                {/* Header */}
                <Header style={{
                    padding: '0 40px',
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    borderBottom: '1px solid #e5e7eb',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    height: 70
                }}>
                    <Dropdown menu={{
                        items: [
                            {
                                key: 'logout',
                                label: 'Logout',
                                icon: <LogOut size={14} />,
                                danger: true
                            }
                        ],
                        onClick: handleMenuClick
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            cursor: 'pointer',
                            padding: '8px 16px',
                            border: '1px solid #e5e7eb',
                            borderRadius: 0,
                            transition: 'all 0.2s'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#000';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#e5e7eb';
                            }}
                        >
                            <div style={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                background: '#000',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: 12,
                                fontWeight: 600
                            }}>
                                A
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    lineHeight: '18px',
                                    letterSpacing: '0.02em'
                                }}>
                                    Admin User
                                </div>
                                <div style={{
                                    fontSize: 11,
                                    color: '#666',
                                    lineHeight: '14px',
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase'
                                }}>
                                    Manager
                                </div>
                            </div>
                        </div>
                    </Dropdown>
                </Header>

                <Content style={{
                    margin: 0,
                    padding: 0,
                    minHeight: 280,
                    background: '#f5f5f5'
                }}>
                    {children}
                </Content>
            </Layout>

            <style jsx global>{`
                .premium-admin-menu .ant-menu-item {
                    height: 48px !important;
                    line-height: 48px !important;
                    margin: 4px 16px !important;
                    padding: 0 20px !important;
                    border-radius: 0 !important;
                    font-size: 13px !important;
                    font-weight: 500 !important;
                    letter-spacing: 0.02em !important;
                    transition: all 0.2s !important;
                }

                .premium-admin-menu .ant-menu-item:hover {
                    background: #f5f5f5 !important;
                    color: #000 !important;
                }

                .premium-admin-menu .ant-menu-item-selected {
                    background: #000 !important;
                    color: #fff !important;
                }

                .premium-admin-menu .ant-menu-item-selected:hover {
                    background: #000 !important;
                    color: #fff !important;
                }

                .premium-admin-menu .ant-menu-item .ant-menu-item-icon {
                    font-size: 18px !important;
                }

                .premium-admin-menu.ant-menu-inline-collapsed .ant-menu-item {
                    padding: 0 !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }
            `}</style>
        </Layout>
    );
}
