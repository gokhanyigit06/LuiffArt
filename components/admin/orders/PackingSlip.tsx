'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Typography, Table, Divider, Row, Col } from 'antd';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

interface PackingSlipProps {
    order: any;
}

export default function PackingSlip({ order }: PackingSlipProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!order || !mounted) return null;

    const columns = [
        {
            title: 'PRODUCT DETAILS',
            key: 'item',
            render: (_: any, record: any) => (
                <div style={{ padding: '8px 0' }}>
                    <Text strong style={{ fontSize: 13 }}>{record.productVariant?.product?.name}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {record.productVariant?.size} / {record.productVariant?.material}
                    </Text>
                </div>
            )
        },
        {
            title: 'SKU',
            dataIndex: ['productVariant', 'sku'],
            key: 'sku',
            render: (sku: string) => <Text style={{ fontFamily: 'monospace', fontSize: 11 }}>{sku || '-'}</Text>
        },
        {
            title: 'QTY',
            dataIndex: 'quantity',
            key: 'qty',
            align: 'right' as const,
            width: 60,
            render: (qty: number) => <Text strong>{qty}</Text>
        }
    ];

    const slipContent = (
        <div id="packing-slip-content" className="packing-slip-luxury">
            <div className="inner-sheet">
                {/* Modern Luxury Header */}
                <div className="slip-header">
                    <Row justify="space-between" align="bottom">
                        <Col>
                            <div className="brand-badge">
                                <Title level={1} className="brand-logo">LUIFF</Title>
                                <div className="brand-tagline">MUSEUM QUALITY ART</div>
                            </div>
                        </Col>
                        <Col style={{ textAlign: 'right' }}>
                            <div className="document-info">
                                <Text className="doc-type">PACKING SLIP</Text>
                                <div className="order-num">#{order.orderNumber}</div>
                                <Text className="doc-date">{dayjs(order.createdAt).format('DD MMM YYYY')}</Text>
                            </div>
                        </Col>
                    </Row>
                </div>

                <div className="divider-line" />

                {/* Info Grid */}
                <Row gutter={40} className="info-section">
                    <Col span={10}>
                        <div className="info-group">
                            <Text className="section-label">SHIPPING TO</Text>
                            <div className="address-block">
                                <Text strong className="recipient-name">{order.shippingAddress?.fullName}</Text>
                                <Paragraph className="address-text">
                                    {order.shippingAddress?.address}<br />
                                    {order.shippingAddress?.district}, {order.shippingAddress?.city}<br />
                                    {order.shippingAddress?.country} {order.shippingAddress?.zipCode}
                                </Paragraph>
                                <Text className="contact-info">T: {order.shippingAddress?.phone}</Text>
                            </div>
                        </div>
                    </Col>
                    <Col span={14}>
                        <div className="meta-grid">
                            <div className="meta-item">
                                <Text className="section-label">ORDER ID</Text>
                                <Text strong style={{ fontSize: 12 }}>LU-{order.id.substring(0, 8).toUpperCase()}</Text>
                            </div>
                            <div className="meta-item">
                                <Text className="section-label">CUSTOMER</Text>
                                <Text strong style={{ fontSize: 12 }}>{order.user?.name || 'Guest'}</Text>
                            </div>
                            <div className="meta-item">
                                <Text className="section-label">METHOD</Text>
                                <Text strong style={{ fontSize: 12 }}>{order.shippingProvider || 'Standard Shipping'}</Text>
                            </div>
                            <div className="meta-item">
                                <Text className="section-label">CURRENCY</Text>
                                <Text strong style={{ fontSize: 12 }}>{order.currency}</Text>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Items Table */}
                <div className="table-wrapper">
                    <Table
                        dataSource={order.orderItems}
                        columns={columns}
                        pagination={false}
                        rowKey="id"
                        size="small"
                        className="custom-slip-table"
                    />
                </div>

                {/* Footer Section */}
                <div className="slip-footer">
                    <Row justify="space-between" align="bottom">
                        <Col span={14}>
                            <div className="note-box">
                                <Text className="section-label">THANK YOU</Text>
                                <Paragraph style={{ fontSize: 10, color: '#444', marginTop: 4, lineHeight: 1.4 }}>
                                    Each piece of Luiff Art is handled with museum-grade care.
                                    We hope this masterpiece brings inspiration to your space.
                                </Paragraph>
                            </div>
                        </Col>
                        <Col span={8} style={{ textAlign: 'center' }}>
                            <div className="signature-line" />
                            <Text style={{ fontSize: 8, color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Authorized Signature
                            </Text>
                        </Col>
                    </Row>

                    <div className="official-footer">
                        <Text>www.luiff.art  •  support@luiff.art</Text>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Italiana&family=Outfit:wght@300;400;600&display=swap');

                @media screen {
                    #packing-slip-content {
                        display: none;
                    }
                }

                @media print {
                    @page {
                        size: A4;
                        margin: 0;
                    }
                    
                    html, body {
                        height: 100% !important;
                        overflow: hidden !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        background: #fff !important;
                    }

                    /* Ana uygulamayı tamamen gizle (Portal sayesinde slip etkilenmez) */
                    body > *:not(#packing-slip-content) {
                        display: none !important;
                    }

                    #packing-slip-content {
                        display: block !important;
                        position: absolute !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 210mm !important;
                        height: 297mm !important;
                        background: white !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        box-sizing: border-box;
                        page-break-after: always;
                    }
                }

                .packing-slip-luxury {
                    font-family: 'Outfit', sans-serif;
                    background: #fff;
                    color: #000;
                }

                .inner-sheet {
                    padding: 15mm 15mm;
                    height: 297mm;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                }

                .brand-logo {
                    font-family: 'Italiana', serif !important;
                    font-size: 38px !important;
                    letter-spacing: 10px;
                    margin: 0 !important;
                    color: #000 !important;
                    line-height: 1 !important;
                }

                .brand-tagline {
                    font-size: 9px;
                    letter-spacing: 3px;
                    color: #888;
                    margin-top: 4px;
                    text-transform: uppercase;
                }

                .doc-type {
                    font-size: 22px;
                    font-weight: 300;
                    letter-spacing: 2px;
                }

                .order-num {
                    font-size: 16px;
                    font-weight: 600;
                    margin: 2px 0;
                }

                .doc-date {
                    color: #666;
                    font-size: 12px;
                }

                .divider-line {
                    height: 1px;
                    border-bottom: 1px solid #eee;
                    margin: 20px 0;
                }

                .section-label {
                    display: block;
                    font-size: 9px;
                    font-weight: 600;
                    letter-spacing: 2px;
                    color: #999;
                    margin-bottom: 6px;
                    text-transform: uppercase;
                }

                .recipient-name {
                    font-size: 14px;
                    display: block;
                    margin-bottom: 2px;
                }

                .address-text {
                    font-size: 11px;
                    line-height: 1.4;
                    color: #333;
                    margin-bottom: 4px !important;
                }

                .meta-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 12px;
                }

                .meta-item {
                    border-left: 1px solid #f0f0f0;
                    padding-left: 10px;
                }

                .table-wrapper {
                    flex-grow: 1;
                    margin: 25px 0;
                }

                .custom-slip-table .ant-table-thead > tr > th {
                    background: #fcfcfc !important;
                    font-size: 9px !important;
                    letter-spacing: 1px;
                    border-bottom: 2px solid #000 !important;
                    padding: 8px !important;
                }

                .note-box {
                    padding: 10px;
                    border: 1px solid #f0f0f0;
                    background: #fbfbfb;
                    border-radius: 4px;
                }

                .signature-line {
                    width: 100%;
                    border-bottom: 1px solid #333;
                    margin-bottom: 6px;
                }

                .official-footer {
                    margin-top: 30px;
                    text-align: center;
                    border-top: 1px solid #eee;
                    padding-top: 12px;
                    font-size: 9px;
                    color: #999;
                    letter-spacing: 1px;
                }
            `}</style>
        </div>
    );

    return createPortal(slipContent, document.body);
}
