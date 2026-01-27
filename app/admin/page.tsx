'use client';

import React, { useEffect, useState } from 'react';
import { ConfigProvider, Statistic } from 'antd';
import { motion } from 'framer-motion';
import {
    ShoppingBag,
    Users,
    Package,
    TrendingUp
} from 'lucide-react';

export default function AdminDashboard() {
    const [statsData, setStatsData] = useState({
        totalOrders: 0,
        totalCustomers: 0,
        totalProducts: 0,
        revenue: 0
    });

    useEffect(() => {
        // Fetch real stats from API
        const fetchStats = async () => {
            try {
                // You can create an API endpoint for this
                const [ordersRes, customersRes, productsRes] = await Promise.all([
                    fetch('/api/admin/orders'),
                    fetch('/api/admin/customers'),
                    fetch('/api/admin/products')
                ]);

                const orders = await ordersRes.json();
                const customers = await customersRes.json();
                const products = await productsRes.json();

                setStatsData({
                    totalOrders: orders.length || 0,
                    totalCustomers: customers.length || 0,
                    totalProducts: products.length || 0,
                    revenue: orders.reduce((sum: number, order: any) => sum + Number(order.totalAmount || 0), 0)
                });
            } catch (error) {
                console.error('Failed to fetch stats', error);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        {
            title: 'TOPLAM SİPARİŞ',
            value: statsData.totalOrders,
            suffix: 'Sipariş',
            icon: <ShoppingBag strokeWidth={1} style={{ width: 24, height: 24 }} />
        },
        {
            title: 'AKTİF MÜŞTERİ',
            value: statsData.totalCustomers,
            suffix: 'Müşteri',
            icon: <Users strokeWidth={1} style={{ width: 24, height: 24 }} />
        },
        {
            title: 'ÜRÜN KATALOĞu',
            value: statsData.totalProducts,
            suffix: 'Ürün',
            icon: <Package strokeWidth={1} style={{ width: 24, height: 24 }} />
        },
        {
            title: 'TOPLAM CİRO',
            value: statsData.revenue,
            suffix: '₺',
            icon: <TrendingUp strokeWidth={1} style={{ width: 24, height: 24 }} />
        }
    ];

    return (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: 'var(--font-outfit)',
                },
                components: {
                    Statistic: {
                        fontFamily: 'var(--font-italiana)',
                        contentFontSize: 80,
                        titleFontSize: 12,
                    }
                }
            }}
        >
            <div style={{ width: '100%', minHeight: '80vh', fontFamily: 'var(--font-outfit)', display: 'flex', flexDirection: 'column', margin: '-24px', marginTop: '-24px' }}>

                {/* 1. Welcome Hero */}
                <div style={{
                    padding: '4rem 6rem',
                    borderBottom: '2px solid #000',
                    flex: '2',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backgroundColor: '#fff'
                }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            letterSpacing: '0.4em',
                            color: '#000',
                            textTransform: 'uppercase',
                            display: 'block',
                            marginBottom: '2rem'
                        }}>
                            Admin Dashboard
                        </span>
                        <h1 className="font-italiana" style={{
                            fontSize: 'clamp(4rem, 7vw, 9rem)',
                            margin: 0,
                            color: '#000',
                            lineHeight: 0.85,
                            letterSpacing: '-0.02em',
                            fontWeight: 400
                        }}>
                            LUIFF ART <br />
                            <span style={{ color: '#000', fontStyle: 'italic', opacity: 0.5 }}>Management</span>
                        </h1>
                    </motion.div>
                </div>

                {/* 2. Stats Row */}
                <div style={{ display: 'flex', flex: '1', minHeight: '300px' }}>
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + (idx * 0.1) }}
                            style={{
                                flex: 1,
                                padding: '4rem',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                borderRight: idx !== stats.length - 1 ? '1px solid #e5e7eb' : 'none',
                                backgroundColor: '#fff'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 800,
                                    color: '#000',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.2em'
                                }}>
                                    {stat.title}
                                </span>
                                <div style={{ color: '#000' }}>
                                    {stat.icon}
                                </div>
                            </div>

                            <div>
                                <Statistic
                                    value={stat.value}
                                    suffix={
                                        <span style={{
                                            fontSize: '1rem',
                                            fontFamily: 'var(--font-outfit)',
                                            color: '#000',
                                            marginLeft: '1rem',
                                            fontWeight: 500,
                                            letterSpacing: '0.05em',
                                            fontStyle: 'italic',
                                            textTransform: 'lowercase'
                                        }}>
                                            {stat.suffix}
                                        </span>
                                    }
                                    valueStyle={{ color: '#000', fontWeight: 400 }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>

                <style jsx global>{`
                    .ant-statistic-content {
                        font-family: var(--font-italiana) !important;
                        line-height: 1 !important;
                    }
                    .ant-statistic-content-value-int {
                        font-weight: 400 !important;
                    }
                `}</style>
            </div>
        </ConfigProvider>
    );
}
