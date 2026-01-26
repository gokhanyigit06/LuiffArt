'use client';

import React from 'react';
import { Button, ConfigProvider, Statistic } from 'antd';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ShoppingBag,
    Heart,
    MapPin,
    ArrowRight
} from 'lucide-react';

export default function AccountDashboard() {
    const { data: session } = useSession();
    const firstName = session?.user?.name?.split(' ')[0] || 'Sanatsever';

    const [statsData, setStatsData] = React.useState({
        totalItems: 0,
        totalFavorites: 0,
        totalAddresses: 0
    });

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/account/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStatsData(data);
                }
            } catch (error) {
                console.error('Failed to fetch stats', error);
            }
        };
        fetchStats();
    }, []);

    // API Data for Statistics
    const stats = [
        {
            title: 'EDİNİLEN ESERLER',
            value: statsData.totalItems,
            suffix: 'Parça',
            icon: <ShoppingBag strokeWidth={1} style={{ width: 24, height: 24 }} />
        },
        {
            title: 'KÜRASYON LİSTESİ',
            value: statsData.totalFavorites,
            suffix: 'Favori',
            icon: <Heart strokeWidth={1} style={{ width: 24, height: 24 }} />
        },
        {
            title: 'ADRES PORTFÖYÜ',
            value: statsData.totalAddresses,
            suffix: 'Lokasyon',
            icon: <MapPin strokeWidth={1} style={{ width: 24, height: 24 }} />
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
                    },
                    Button: {
                        borderRadius: 0,
                    }
                }
            }}
        >
            <div style={{ width: '100%', minHeight: '80vh', fontFamily: 'var(--font-outfit)', display: 'flex', flexDirection: 'column' }}>

                {/* 1. Welcome Hero */}
                <div style={{
                    padding: '4rem 6rem',
                    borderBottom: '2px solid #000',
                    flex: '2', // Takes more space
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
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
                            Atelier Dashboard
                        </span>
                        <h1 className="font-italiana" style={{
                            fontSize: 'clamp(4rem, 7vw, 9rem)',
                            margin: 0,
                            color: '#000',
                            lineHeight: 0.85,
                            letterSpacing: '-0.02em',
                            fontWeight: 400
                        }}>
                            HOŞ GELDİNİZ, <br />
                            <span style={{ color: '#000', fontStyle: 'italic', opacity: 0.5 }}>{firstName}</span>
                        </h1>

                        <div style={{ marginTop: '4rem' }}>
                            <Link href="/collections">
                                <Button
                                    type="primary"
                                    style={{
                                        height: '56px',
                                        padding: '0 48px',
                                        backgroundColor: '#000',
                                        color: '#fff',
                                        border: 'none',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.2em',
                                        fontSize: '11px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px'
                                    }}
                                >
                                    KOLEKSİYONU KEŞFET <ArrowRight style={{ width: '16px', height: '16px' }} />
                                </Button>
                            </Link>
                        </div>
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
