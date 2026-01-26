'use client';

import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, ConfigProvider } from 'antd';
import {
    UserOutlined,
    ShoppingOutlined,
    HomeOutlined,
    HeartOutlined,
    EnvironmentOutlined,
    CreditCardOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const { Header, Sider, Content } = Layout;

export default function UserLayoutClient({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { data: session } = useSession();

    const menuItems = [
        { key: '/account', icon: <HomeOutlined />, label: 'DASHBOARD' }, // Changed to clear dashboard label
        { key: '/account/orders', icon: <ShoppingOutlined />, label: 'SİPARİŞ ARŞİVİ' },
        { key: '/account/profile', icon: <UserOutlined />, label: 'PROFİL & GÜVENLİK' },
        { key: '/account/addresses', icon: <EnvironmentOutlined />, label: 'ADRES REHBERİ' },
        { key: '/account/favorites', icon: <HeartOutlined />, label: 'KÜRASYON LİSTESİ' },
    ];

    const handleMenuClick = ({ key }: { key: string }) => {
        router.push(key);
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#000',
                    fontFamily: 'var(--font-outfit)',
                    borderRadius: 0, // Sharp aesthetic
                },
                components: {
                    Menu: {
                        itemBg: 'transparent',
                        itemSelectedBg: '#000',
                        itemSelectedColor: '#fff',
                        itemHoverBg: 'rgba(0,0,0,0.05)',
                        itemColor: '#000',
                        itemMarginInline: 0, // Full width items
                        itemBorderRadius: 0, // Sharp items
                        itemHeight: 64, // Taller, more click area
                        iconSize: 18,
                        fontSize: 12,
                    },
                    Layout: {
                        bodyBg: '#fff',
                        headerBg: '#fff',
                        siderBg: '#fff',
                    }
                }
            }}
        >
            <Layout style={{ minHeight: '100vh' }}>

                {/* 1. FIXED SIDEBAR (HIZLI İŞLEMLER) */}
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    width={320}
                    collapsedWidth={80}
                    style={{
                        overflow: 'auto',
                        height: '100vh',
                        position: 'fixed',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        zIndex: 100,
                        borderRight: '2px solid #000', // Hard border
                        backgroundColor: '#fff'
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        {/* Logo Area */}
                        <div style={{
                            height: '128px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: collapsed ? 'center' : 'flex-start',
                            padding: collapsed ? '0' : '0 3rem',
                            borderBottom: '2px solid #000'
                        }}>
                            <Link href="/" className="group" style={{ textDecoration: 'none' }}>
                                {!collapsed ? (
                                    <span className="font-italiana" style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#000' }}>
                                        LUIFF ART
                                    </span>
                                ) : (
                                    <span className="font-italiana" style={{ fontSize: '2rem', fontWeight: 700, color: '#000' }}>L</span>
                                )}
                            </Link>
                        </div>

                        {/* Navigation - "HIZLI İŞLEMLER" Style */}
                        <div style={{ flex: 1, paddingTop: '2rem' }}>
                            {!collapsed && (
                                <h3 className="font-italiana" style={{
                                    padding: '0 3rem',
                                    marginBottom: '2rem',
                                    fontSize: '1.5rem',
                                    color: '#000'
                                }}>
                                    HIZLI İŞLEMLER
                                </h3>
                            )}
                            <Menu
                                mode="inline"
                                selectedKeys={[pathname]}
                                onClick={handleMenuClick}
                                items={menuItems}
                                style={{ borderRight: 'none' }}
                                className="custom-sidebar-menu"
                            />
                        </div>

                        {/* User Footer */}
                        <div style={{ borderTop: '2px solid #000', padding: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: collapsed ? 'center' : 'flex-start' }}>
                                <Avatar size={40} icon={<UserOutlined />} style={{ backgroundColor: '#000', flexShrink: 0 }} />
                                {!collapsed && (
                                    <div style={{ overflow: 'hidden' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{session?.user?.name || 'KÜRATÖR'}</div>
                                        <div style={{ fontSize: '0.65rem', color: '#666', marginTop: '4px' }}>ELITE MEMBER</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Sider>

                {/* 2. MAIN CONTENT AREA */}
                <Layout style={{
                    marginLeft: collapsed ? 80 : 320,
                    transition: 'all 0.2s',
                    backgroundColor: '#fff',
                    minHeight: '100vh'
                }}>
                    <Header style={{
                        padding: '0 4rem',
                        background: '#fff',
                        borderBottom: '2px solid #000',
                        height: '128px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        position: 'sticky',
                        top: 0,
                        zIndex: 90
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{ fontSize: '1.25rem', width: 48, height: 48 }}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <Link href="/">
                                <Button style={{
                                    height: '48px',
                                    padding: '0 32px',
                                    backgroundColor: '#fff',
                                    color: '#000',
                                    border: '1px solid #000',
                                    fontWeight: 700,
                                    fontSize: '0.65rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.2em',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}
                                    className="hover:!bg-black hover:!text-white transition-all"
                                >
                                    <HomeOutlined /> MAĞAZAYA DÖN
                                </Button>
                            </Link>

                            <Button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                style={{
                                    height: '48px',
                                    padding: '0 32px',
                                    backgroundColor: '#000',
                                    color: '#fff',
                                    border: 'none',
                                    fontWeight: 700,
                                    fontSize: '0.65rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.2em'
                                }}
                                className="hover:!bg-gray-800 transition-all"
                            >
                                GÜVENLİ ÇIKIŞ
                            </Button>
                        </div>
                    </Header>

                    <Content style={{
                        padding: '0', // Full width content
                        backgroundColor: '#fff',
                        overflow: 'initial'
                    }}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={pathname}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.4 }}
                                style={{ minHeight: 'calc(100vh - 128px)' }}
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </Content>
                </Layout>

                <style jsx global>{`
                    .custom-sidebar-menu .ant-menu-item {
                        padding-left: 3rem !important;
                        font-family: var(--font-outfit) !important;
                        font-weight: 800 !important;
                        letter-spacing: 0.15em !important;
                        text-transform: uppercase !important;
                    }
                    .custom-sidebar-menu .ant-menu-item-selected {
                        background-color: #000 !important;
                        color: #fff !important;
                    }
                    .custom-sidebar-menu .ant-menu-item::after {
                        border-right: none !important;
                    }
                `}</style>
            </Layout>
        </ConfigProvider>
    );
}
