'use client';

import React from 'react';
import { Button, ConfigProvider } from 'antd';
import { StarOutlined, ArrowRightOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function FavoritesPage() {
    const favorites: any[] = []; // Mock

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
                {/* Header */}
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
                            Kürasyon Listesi
                        </span>
                        <h1 className="font-italiana" style={{
                            fontSize: 'clamp(3rem, 5vw, 5rem)',
                            margin: 0,
                            color: '#000',
                            lineHeight: 0.9,
                            letterSpacing: '-0.02em',
                            fontWeight: 400
                        }}>
                            İLGİ ALANLARI
                        </h1>
                    </div>
                </div>

                {/* Content */}
                <div style={{ padding: '0 4rem' }}>
                    {favorites.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {/* Render favorites here */}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                padding: '8rem 0',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid #e5e7eb',
                                backgroundColor: '#fff'
                            }}
                        >
                            <div style={{
                                width: '80px',
                                height: '80px',
                                border: '1px solid #000',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '3rem'
                            }}>
                                <StarOutlined style={{ fontSize: '2rem', color: '#000' }} />
                            </div>
                            <h2 className="font-italiana" style={{ fontSize: '3rem', marginBottom: '1rem', color: '#000', textTransform: 'uppercase' }}>LİSTENİZ BOŞ</h2>
                            <p style={{
                                fontFamily: 'var(--font-outfit)',
                                fontSize: '0.85rem',
                                color: '#6b7280',
                                textAlign: 'center',
                                marginBottom: '3rem',
                                letterSpacing: '0.05em',
                                maxWidth: '450px',
                                lineHeight: 1.6
                            }}>
                                Koleksiyonumuzdaki nadide parçaları favorilerinize ekleyerek kendi seçkinizi oluşturun.
                            </p>
                            <Link href="/collections">
                                <Button
                                    style={{
                                        height: '56px',
                                        padding: '0 48px',
                                        backgroundColor: '#000',
                                        color: '#fff',
                                        border: 'none',
                                        fontWeight: 700,
                                        fontSize: '0.75rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.2em',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px'
                                    }}
                                    className="hover:!bg-gray-800 transition-all"
                                >
                                    KEŞFE BAŞLA <ArrowRightOutlined />
                                </Button>
                            </Link>
                        </motion.div>
                    )}
                </div>
            </div>
        </ConfigProvider>
    );
}
