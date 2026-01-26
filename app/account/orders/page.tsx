'use client';

import React, { useEffect, useState } from 'react';
import {
    Button, ConfigProvider
} from 'antd';
import {
    ShoppingOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    ArrowRightOutlined,
    InboxOutlined,
    CompassOutlined,
    SearchOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/account/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error('Veriler alınamadı');
        } finally {
            setLoading(false);
        }
    };

    const getStatusConfig = (status: string) => {
        const configs: Record<string, { label: string, icon: any }> = {
            'PENDING': { label: 'TALEP ALINDI', icon: <ClockCircleOutlined /> },
            'PAID': { label: 'ÖDENMİŞ', icon: <CheckCircleOutlined /> },
            'PREPARING': { label: 'ATÖLYEDE', icon: <ShoppingOutlined /> },
            'SHIPPED': { label: 'GÖNDERİLDİ', icon: <CompassOutlined /> },
            'DELIVERED': { label: 'TESLİM EDİLDİ', icon: <CheckCircleOutlined /> },
            'CANCELLED': { label: 'İPTAL', icon: <ClockCircleOutlined /> },
        };
        return configs[status] || configs.PENDING;
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: 'var(--font-outfit)',
                    borderRadius: 0,
                },
                components: {
                    Button: {
                        borderRadius: 0,
                    }
                }
            }}
        >
            <div style={{ width: '100%', paddingBottom: '8rem', fontFamily: 'var(--font-outfit)' }}>
                {/* Header Section */}
                <div style={{
                    marginBottom: '4rem',
                    padding: '0 4rem',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    gap: '3rem',
                    borderBottom: '2px solid #000',
                    paddingBottom: '3rem',
                    paddingTop: '3rem'
                }}>
                    <div style={{ maxWidth: '600px' }}>
                        <span style={{
                            fontSize: '0.85rem',
                            fontWeight: 800,
                            letterSpacing: '0.3em',
                            color: '#000',
                            textTransform: 'uppercase',
                            display: 'block',
                            marginBottom: '1rem'
                        }}>
                            Arşiv Kayıtları
                        </span>
                        <h1 className="font-italiana" style={{
                            fontSize: 'clamp(3rem, 5vw, 6rem)',
                            margin: 0,
                            color: '#000',
                            lineHeight: 0.9,
                            letterSpacing: '-0.02em',
                            fontWeight: 400
                        }}>
                            SİPARİŞLER
                        </h1>
                    </div>
                    <div style={{ width: 'auto' }}>
                        {/* Minimalist Search Input */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            borderBottom: '1px solid #000',
                            paddingBottom: '0.5rem',
                            width: '240px'
                        }}>
                            <SearchOutlined style={{ fontSize: '1.2rem', color: '#000', marginRight: '1rem' }} />
                            <input
                                placeholder="DOSYA NO..."
                                style={{
                                    border: 'none',
                                    outline: 'none',
                                    background: 'transparent',
                                    fontFamily: 'var(--font-outfit)',
                                    fontSize: '0.85rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.1em',
                                    width: '100%',
                                    color: '#000',
                                    textTransform: 'uppercase'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Orders Feed */}
                <div style={{ padding: '0 4rem' }}>
                    {loading ? (
                        <div style={{ height: '200px', backgroundColor: '#f3f4f6' }} />
                    ) : orders.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', borderTop: '2px solid #000' }}>
                            <AnimatePresence>
                                {orders.map((order: any, idx: number) => {
                                    const conf = getStatusConfig(order.status);
                                    return (
                                        <motion.div
                                            key={order.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="order-row"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '3rem 0',
                                                borderBottom: '1px solid #e5e7eb',
                                                cursor: 'pointer',
                                                backgroundColor: '#fff',
                                                transition: 'all 0.4s ease'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4rem', flex: 1 }}>
                                                {/* Status Block */}
                                                <div style={{ minWidth: '180px' }}>
                                                    <span style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.75rem',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 800,
                                                        letterSpacing: '0.2em',
                                                        textTransform: 'uppercase',
                                                        color: '#000',
                                                        border: '1px solid #000',
                                                        padding: '0.5rem 1rem'
                                                    }}>
                                                        {conf.icon} {conf.label}
                                                    </span>
                                                </div>

                                                {/* Info Block */}
                                                <div>
                                                    <span style={{
                                                        display: 'block',
                                                        fontFamily: 'var(--font-italiana)',
                                                        fontSize: '2rem',
                                                        color: '#000',
                                                        marginBottom: '0.5rem'
                                                    }}>
                                                        #{order.orderNumber}
                                                    </span>
                                                    <span style={{
                                                        fontSize: '0.75rem',
                                                        color: '#6b7280',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.15em',
                                                        fontWeight: 700
                                                    }}>
                                                        {dayjs(order.createdAt).format('D MMMM YYYY')} — {order.orderItems?.length || 0} ESER
                                                    </span>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4rem' }}>
                                                <div style={{ textAlign: 'right', display: 'none', flexDirection: 'column', alignItems: 'flex-end', '@media (min-width: 1024px)': { display: 'flex' } } as any}>
                                                    <span style={{
                                                        fontSize: '0.65rem',
                                                        fontWeight: 800,
                                                        letterSpacing: '0.3em',
                                                        textTransform: 'uppercase',
                                                        color: '#9ca3af',
                                                        marginBottom: '0.5rem'
                                                    }}>
                                                        Toplam Tutar
                                                    </span>
                                                    <span style={{
                                                        fontFamily: 'var(--font-outfit)',
                                                        fontSize: '1.5rem',
                                                        fontWeight: 500,
                                                        color: '#000'
                                                    }}>
                                                        {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: order.currency }).format(Number(order.totalAmount))}
                                                    </span>
                                                </div>

                                                <Link href={`/account/orders/${order.id}`}>
                                                    <div className="action-circle" style={{
                                                        width: '64px',
                                                        height: '64px',
                                                        border: '1px solid #000',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        transition: 'all 0.4s ease'
                                                    }}>
                                                        <ArrowRightOutlined style={{ fontSize: '1.25rem' }} />
                                                    </div>
                                                </Link>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    ) : (
                        /* Elegant Minimal Empty State - Sharp */
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{
                                padding: '8rem 0',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderTop: '2px solid #000',
                                borderBottom: '2px solid #000'
                            }}
                        >
                            <InboxOutlined style={{ fontSize: '3rem', color: '#000', marginBottom: '2rem' }} />
                            <h2 className="font-italiana" style={{ fontSize: '3rem', marginBottom: '1rem', color: '#000' }}>ARŞİVİNİZ BOŞ</h2>
                            <p style={{
                                fontFamily: 'var(--font-outfit)',
                                fontSize: '0.85rem',
                                color: '#6b7280',
                                textAlign: 'center',
                                marginBottom: '3rem',
                                letterSpacing: '0.05em',
                                maxWidth: '400px',
                                lineHeight: 1.6
                            }}>
                                Henüz bir koleksiyon parçası edinmediniz. Atölyemizdeki seçkin eserleri incelemeye başlayın.
                            </p>
                            <Link href="/collections">
                                <Button
                                    type="primary"
                                    style={{
                                        height: '56px',
                                        padding: '0 48px',
                                        backgroundColor: '#000',
                                        color: '#fff',
                                        fontSize: '0.75rem',
                                        fontWeight: 800,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.2em',
                                        border: 'none'
                                    }}
                                >
                                    MAĞAZAYA GİT
                                </Button>
                            </Link>
                        </motion.div>
                    )}
                </div>

                <style jsx global>{`
                    .order-row:hover {
                        background-color: #000 !important;
                        color: #fff !important;
                        padding-left: 2rem !important;
                        padding-right: 2rem !important;
                    }
                    .order-row:hover span, .order-row:hover div, .order-row:hover h1, .order-row:hover h2, .order-row:hover h3, .order-row:hover h4 {
                        color: #fff !important;
                        border-color: #fff !important;
                    }
                    .order-row:hover .action-circle {
                        background-color: #fff !important;
                        border-color: #fff !important;
                    }
                    .order-row:hover .action-circle span {
                        color: #000 !important;
                    }
                    .order-row:hover .anticon {
                         color: #000 !important; /* Icon inside circle becomes black */
                    }
                     /* Fix icon color specifically for status and main icon which need to stay white on hover */
                    .order-row:hover .anticon-check-circle, 
                    .order-row:hover .anticon-clock-circle,
                    .order-row:hover .anticon-shopping,
                    .order-row:hover .anticon-compass {
                        color: #fff !important;
                    }

                `}</style>
            </div>
        </ConfigProvider>
    );
}
