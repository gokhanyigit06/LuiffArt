'use client';

import React, { useEffect, useState, use } from 'react';
import {
    Card, Row, Col, Typography, Tooltip,
    Button, Steps, message, Spin, Breadcrumb,
    ConfigProvider
} from 'antd';
import {
    PrinterOutlined,
    FileTextOutlined,
    CheckCircleOutlined,
    ShoppingOutlined,
    CarOutlined,
    SafetyCertificateOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';

const { Text } = Typography;

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/account/orders/${id}`);
            if (res.ok) {
                const data = await res.json();
                setOrder(data);
            } else {
                message.error('Dosya kaydı bulunamadı');
                router.push('/account/orders');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="h-[70vh] flex flex-col items-center justify-center font-outfit">
            <Spin size="large" />
            <Text className="mt-6 text-xs uppercase tracking-[0.3em] font-bold">Kayıtlar Taranıyor...</Text>
        </div>
    );

    if (!order) return null;

    const getStatusStep = (status: string) => {
        const sequence = ['PENDING', 'PAID', 'PREPARING', 'SHIPPED', 'DELIVERED'];
        return sequence.indexOf(status);
    };

    const breadcrumbItems = [
        { title: <Link href="/account" className="hover:text-black transition-colors">DASHBOARD</Link> },
        { title: <Link href="/account/orders" className="hover:text-black transition-colors">SİPARİŞLER</Link> },
        { title: `#${order.orderNumber}` }
    ];

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
                    },
                    Steps: {
                        customIconFontSize: 24,
                        titleLineHeight: 32,
                    }
                }
            }}
        >
            <div style={{ width: '100%', paddingBottom: '8rem', fontFamily: 'var(--font-outfit)' }} className="print:p-0">
                {/* Header / Dossier Title */}
                <div style={{
                    marginBottom: '6rem',
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
                        <Breadcrumb
                            items={breadcrumbItems}
                            className="!font-outfit !text-[10px] !uppercase !tracking-[0.2em] !font-bold !mb-6"
                            separator=">"
                        />
                        <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            letterSpacing: '0.4em',
                            color: '#000',
                            textTransform: 'uppercase',
                            display: 'block',
                            marginBottom: '1rem'
                        }}>
                            Provenance Record
                        </span>
                        <h1 className="font-italiana" style={{
                            fontSize: 'clamp(3rem, 5vw, 5rem)',
                            margin: 0,
                            color: '#000',
                            lineHeight: 0.9,
                            letterSpacing: '-0.02em',
                            fontWeight: 400
                        }}>
                            DOSYA <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.5em', verticalAlign: 'middle', letterSpacing: '0.1em' }}>#{order.orderNumber}</span>
                        </h1>
                    </div>
                </div>

                <div style={{ padding: '0 4rem' }}>
                    {/* Timeline */}
                    <div style={{ marginBottom: '6rem', border: '1px solid #000', padding: '4rem' }}>
                        <Steps
                            current={getStatusStep(order.status)}
                            className="custom-dossier-steps"
                            items={[
                                { title: 'TALEBİ ALINDI', icon: <FileTextOutlined /> },
                                { title: 'EDİNİM ONAYLANDI', icon: <CheckCircleOutlined /> },
                                { title: 'ATÖLYE HAZIRLIĞI', icon: <ShoppingOutlined /> },
                                { title: 'GÖNDERİM YOLUNDA', icon: <CarOutlined /> },
                                { title: 'KOLEKSİYONA KATILDI', icon: <SafetyCertificateOutlined /> },
                            ]}
                        />
                    </div>

                    <Row gutter={[48, 48]}>
                        {/* Left: Items */}
                        <Col xs={24} xl={16}>
                            <div style={{ marginBottom: '4rem' }}>
                                <h3 className="font-italiana" style={{ fontSize: '2.5rem', marginBottom: '2rem', marginTop: 0 }}>ESER ENVANTERİ</h3>
                                <div style={{ borderTop: '2px solid #000' }}>
                                    {order.orderItems.map((item: any, idx: number) => (
                                        <div key={item.id} style={{
                                            display: 'flex',
                                            padding: '2rem 0',
                                            borderBottom: '1px solid #e5e7eb',
                                            alignItems: 'center',
                                            gap: '2rem'
                                        }}>
                                            <div style={{ width: '100px', height: '120px', position: 'relative', backgroundColor: '#f3f4f6', flexShrink: 0 }}>
                                                {item.productVariant.product.images?.[0] && (
                                                    <Image
                                                        src={item.productVariant.product.images[0]}
                                                        alt={item.productVariant.product.name}
                                                        fill
                                                        className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                                    />
                                                )}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.2em', display: 'block', marginBottom: '0.5rem', color: '#000' }}>
                                                    CAT. NO: {item.id.slice(-6).toUpperCase()}
                                                </span>
                                                <Link href={`/collections/artwork/${item.productVariant.product.slug}`} className="hover:underline decoration-1 underline-offset-4">
                                                    <h4 className="font-italiana" style={{ fontSize: '1.75rem', margin: 0, color: '#000' }}>{item.productVariant.product.name}</h4>
                                                </Link>
                                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 8px', border: '1px solid #e5e7eb' }}>{item.productVariant.size}</span>
                                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 8px', border: '1px solid #e5e7eb' }}>{item.productVariant.material}</span>
                                                </div>
                                            </div>
                                            <div style={{ paddingRight: '2rem' }}>
                                                <span className="font-outfit" style={{ fontSize: '1.25rem', fontWeight: 500 }}>
                                                    ₺{Number(item.price).toLocaleString('tr-TR')}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Totals Block - Sharp */}
                            <div style={{ backgroundColor: '#000', color: '#fff', padding: '4rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #333', paddingBottom: '1.5rem' }}>
                                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700 }}>Ara Toplam</span>
                                    <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.1rem' }}>₺{Number(order.subtotal).toLocaleString('tr-TR')}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #333', paddingBottom: '1.5rem' }}>
                                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700 }}>Lojistik & Sigorta</span>
                                    <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.1rem' }}>
                                        {Number(order.shippingCost) === 0 ? 'DAHİL' : `₺${Number(order.shippingCost).toLocaleString('tr-TR')}`}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '1rem' }}>
                                    <div>
                                        <span style={{ display: 'block', fontSize: '1.5rem', fontFamily: 'var(--font-italiana)', marginBottom: '0.5rem' }}>Toplam Değer</span>
                                        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#999' }}>Vergiler Dahil</span>
                                    </div>
                                    <span style={{ fontFamily: 'var(--font-italiana)', fontSize: '4rem', lineHeight: 1 }}>
                                        ₺{Number(order.totalAmount).toLocaleString('tr-TR')}
                                    </span>
                                </div>
                            </div>
                        </Col>

                        {/* Right: Info */}
                        <Col xs={24} xl={8}>
                            <div style={{ border: '1px solid #e5e7eb', padding: '3rem', height: '100%', backgroundColor: '#fff' }}>
                                <h3 className="font-italiana" style={{ fontSize: '1.75rem', marginBottom: '3rem', marginTop: 0 }}>
                                    TESLİMAT & FİNANS
                                </h3>

                                <div style={{ marginBottom: '4rem' }}>
                                    <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem', color: '#9ca3af' }}>Teslimat Adresi</span>
                                    <p style={{ fontSize: '1.1rem', fontWeight: 500, margin: 0, marginBottom: '0.5rem' }}>{order.shippingAddress.fullName}</p>
                                    <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#666', margin: 0 }}>{order.shippingAddress.address}</p>
                                    <p style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginTop: '1rem', letterSpacing: '0.1em' }}>
                                        {order.shippingAddress.district}, {order.shippingAddress.city}
                                    </p>
                                </div>

                                <div style={{ marginBottom: '4rem' }}>
                                    <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem', color: '#9ca3af' }}>Ödeme Yöntemi</span>
                                    <p style={{ fontSize: '1rem' }}>{order.paymentMethod || 'Kredi Kartı'}</p>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', padding: '0.5rem 1rem', border: '1px solid #000' }}>
                                        <span style={{ width: '8px', height: '8px', backgroundColor: '#000', borderRadius: '50%' }}></span>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{order.paymentStatus}</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => window.print()}
                                    block
                                    icon={<PrinterOutlined />}
                                    style={{
                                        height: '56px',
                                        textTransform: 'uppercase',
                                        fontWeight: 800,
                                        letterSpacing: '0.2em',
                                        fontSize: '0.75rem',
                                        borderColor: '#000',
                                        color: '#000'
                                    }}
                                    className="hover:!bg-black hover:!text-white transition-all"
                                >
                                    BELGEYİ YAZDIR
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </div>

                <style jsx global>{`
                .custom-dossier-steps .ant-steps-item-title {
                    font-size: 0.65rem !important;
                    font-family: var(--font-outfit) !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.2rem !important;
                    font-weight: 800 !important;
                    color: #9ca3af !important;
                    margin-top: 1rem !important;
                }
                .custom-dossier-steps .ant-steps-item-process .ant-steps-item-title {
                    color: #000 !important;
                }
                .custom-dossier-steps .ant-steps-item-icon {
                    width: 48px !important;
                    height: 48px !important;
                    line-height: 48px !important;
                    background: transparent !important;
                    border: 1px solid #e5e7eb !important;
                    color: #e5e7eb !important;
                    border-radius: 0 !important; /* SQUARE Icons */
                }
                .custom-dossier-steps .ant-steps-item-process .ant-steps-item-icon {
                    background: #000 !important;
                    border-color: #000 !important;
                    color: #fff !important;
                }
                .custom-dossier-steps .ant-steps-item-finish .ant-steps-item-icon {
                    background: #fff !important;
                    border-color: #000 !important;
                    color: #000 !important;
                }
                .custom-dossier-steps .ant-steps-item-tail::after {
                    background-color: #f3f4f6 !important;
                }
                .custom-dossier-steps .ant-steps-item-finish .ant-steps-item-tail::after {
                    background-color: #000 !important;
                }
            `}</style>
            </div>
        </ConfigProvider>
    );
}
