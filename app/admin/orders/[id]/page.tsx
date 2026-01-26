'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Tag, Button, Spin, Card, Typography, Divider,
    Steps, Row, Col, Space, Table, Avatar,
    Badge, message, Descriptions, Breadcrumb,
    Dropdown, Menu
} from 'antd';
import {
    ArrowLeftOutlined,
    UserOutlined,
    EnvironmentOutlined,
    CreditCardOutlined,
    CheckCircleOutlined,
    CarOutlined,
    ClockCircleOutlined,
    MoreOutlined,
    PrinterOutlined,
    MailOutlined,
    RollbackOutlined,
    TruckOutlined,
    ShoppingOutlined,
    PlusOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import Link from 'next/link';
import FulfillmentModal from '@/components/admin/orders/FulfillmentModal';
import RefundModal from '@/components/admin/orders/RefundModal';
import PackingSlip from '@/components/admin/orders/PackingSlip';

const { Title, Text, Paragraph } = Typography;

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isFulfillmentModalOpen, setIsFulfillmentModalOpen] = useState(false);
    const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);

    const handlePrint = () => {
        window.print();
    };

    const fetchOrder = useCallback(async () => {
        try {
            const id = params.id as string;
            const res = await fetch(`/api/admin/orders/${id}`);
            if (res.ok) {
                const data = await res.json();
                setOrder(data);
            } else {
                router.push('/admin/orders');
            }
        } catch (error) {
            console.error('Error fetching order', error);
            message.error('Failed to load order details');
        } finally {
            setLoading(false);
        }
    }, [params.id, router]);

    useEffect(() => {
        if (params.id) {
            fetchOrder();
        }
    }, [params.id, fetchOrder]);

    const handleUpdateStatus = async (status: string) => {
        if (status === 'REFUND') {
            setIsRefundModalOpen(true);
            return;
        }

        if (status === 'SHIPPED') {
            setIsFulfillmentModalOpen(true);
            return;
        }

        try {
            const res = await fetch(`/api/admin/orders/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                message.success(`Order status updated to ${status}`);
                fetchOrder();
            } else {
                message.error('Failed to update status');
            }
        } catch (error) {
            message.error('An error occurred while updating status');
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', height: '80vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16, color: '#1890ff', fontWeight: 500 }}>
                Loading professional order details...
            </div>
        </div>
    );

    if (!order) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'orange';
            case 'PAID': return 'blue';
            case 'PREPARING': return 'cyan';
            case 'SHIPPED': return 'purple';
            case 'DELIVERED': return 'green';
            case 'CANCELLED': return 'red';
            case 'REFUNDED': return 'volcano';
            default: return 'default';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'PAID': return 'success';
            case 'PENDING': return 'warning';
            case 'REFUNDED': return 'error';
            default: return 'default';
        }
    };

    const productColumns = [
        {
            title: 'Product',
            key: 'product',
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Avatar
                        shape="square"
                        size={64}
                        src={record.productVariant?.product?.images?.[0]}
                        icon={<ShoppingOutlined />}
                    />
                    <div>
                        <Text strong style={{ display: 'block' }}>{record.productVariant?.product?.name}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {record.productVariant?.size} / {record.productVariant?.material}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>SKU: {record.productVariant?.sku}</Text>
                    </div>
                </Space>
            )
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `${order.currency === 'TRY' ? '₺' : '$'}${Number(price).toFixed(2)}`
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (qty: number) => `x ${qty}`
        },
        {
            title: 'Total',
            key: 'total',
            render: (_: any, record: any) =>
                `${order.currency === 'TRY' ? '₺' : '$'}${(Number(record.price) * record.quantity).toFixed(2)}`
        }
    ];

    const menuItems = [
        { key: 'PAID', label: 'Mark as Paid', disabled: order.paymentStatus === 'PAID' },
        { key: 'PREPARING', label: 'Mark as Preparing' },
        { key: 'SHIPPED', label: 'Mark as Shipped' },
        { key: 'DELIVERED', label: 'Mark as Delivered' },
        { type: 'divider' as const },
        { key: 'REFUND', label: 'Return / Refund', icon: <RollbackOutlined />, danger: true },
        { key: 'CANCELLED', label: 'Cancel Order', danger: true },
    ];

    return (
        <div style={{ padding: '0 0 40px 0' }}>
            {/* Breadcrumb & Top Actions */}
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Breadcrumb
                    items={[
                        { title: <Link href="/admin/dashboard">Dashboard</Link> },
                        { title: <Link href="/admin/orders">Orders</Link> },
                        { title: `Order #${order.orderNumber}` }
                    ]}
                />
                <Space>
                    <Button icon={<PrinterOutlined />} onClick={handlePrint}>Print Packing Slip</Button>
                    <Button icon={<MailOutlined />}>Email Customer</Button>
                    <Dropdown menu={{ items: menuItems, onClick: ({ key }) => handleUpdateStatus(key) }} trigger={['click']}>
                        <Button type="primary" icon={<MoreOutlined />}>Order Actions</Button>
                    </Dropdown>
                </Space>
            </div>

            {/* Header / Summary Card */}
            <Card style={{ marginBottom: 24, borderRadius: 12, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <Row gutter={[24, 24]} align="middle">
                    <Col xs={24} md={12}>
                        <Space orientation="vertical" size={4}>
                            <Space align="center" size={12}>
                                <Title level={2} style={{ margin: 0, fontFamily: 'var(--font-italiana)' }}>
                                    Order #{order.orderNumber}
                                </Title>
                                <Tag color={getStatusColor(order.status)} style={{ borderRadius: 12, padding: '0 12px' }}>
                                    {order.status}
                                </Tag>
                                <Badge status={order.paymentStatus === 'PAID' ? 'success' : 'processing'} text={order.paymentStatus || 'UNPAID'} />
                            </Space>
                            <Text type="secondary">
                                Placed on {dayjs(order.createdAt).format('MMMM D, YYYY [at] h:mm A')}
                            </Text>
                        </Space>
                    </Col>
                    <Col xs={24} md={12} style={{ textAlign: 'right' }}>
                        <Space orientation="vertical" align="end" size={0}>
                            <Text type="secondary">Total Amount</Text>
                            <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                                {order.currency === 'TRY' ? '₺' : '$'}{Number(order.totalAmount).toFixed(2)}
                            </Title>
                        </Space>
                    </Col>
                </Row>
            </Card>

            <Row gutter={[24, 24]}>
                {/* Left Column: Items & Fulfillment */}
                <Col xs={24} lg={16}>
                    <Space orientation="vertical" size={24} style={{ width: '100%' }}>
                        {/* Order Items */}
                        <Card title={<span><ShoppingOutlined /> Items</span>} style={{ borderRadius: 12 }}>
                            <Table
                                columns={productColumns}
                                dataSource={order.orderItems}
                                rowKey="id"
                                pagination={false}
                            />

                            <Divider />

                            <Row justify="end">
                                <Col span={12}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <Text type="secondary">Subtotal</Text>
                                        <Text>{order.currency === 'TRY' ? '₺' : '$'}{Number(order.subtotal).toFixed(2)}</Text>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <Text type="secondary">Shipping</Text>
                                        <Text>{order.currency === 'TRY' ? '₺' : '$'}{Number(order.shippingCost || 0).toFixed(2)}</Text>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <Text type="secondary">Tax</Text>
                                        <Text>{order.currency === 'TRY' ? '₺' : '$'}{Number(order.taxAmount || 0).toFixed(2)}</Text>
                                    </div>
                                    {order.discountAmount > 0 && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <Text type="secondary">Discount</Text>
                                            <Text type="danger">-{order.currency === 'TRY' ? '₺' : '$'}{Number(order.discountAmount).toFixed(2)}</Text>
                                        </div>
                                    )}
                                    {order.refunds?.length > 0 && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <Text type="danger">Refunded</Text>
                                            <Text type="danger">-{order.currency === 'TRY' ? '₺' : '$'}{order.refunds.reduce((sum: number, r: any) => sum + Number(r.amount), 0).toFixed(2)}</Text>
                                        </div>
                                    )}
                                    <Divider style={{ margin: '12px 0' }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text strong style={{ fontSize: 18 }}>Total</Text>
                                        <Text strong style={{ fontSize: 18, color: '#1890ff' }}>
                                            {order.currency === 'TRY' ? '₺' : '$'}{(Number(order.totalAmount) - (order.refunds?.reduce((sum: number, r: any) => sum + Number(r.amount), 0) || 0)).toFixed(2)}
                                        </Text>
                                    </div>
                                </Col>
                            </Row>
                        </Card>

                        {/* Fulfillment Tracker */}
                        <Card
                            title={<span><TruckOutlined /> Fulfillment</span>}
                            extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsFulfillmentModalOpen(true)}>Create Fulfillment</Button>}
                            style={{ borderRadius: 12 }}
                        >
                            {order.fulfillments?.length > 0 ? (
                                order.fulfillments.map((f: any) => (
                                    <Card key={f.id} size="small" type="inner" style={{ marginBottom: 16 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                            <div>
                                                <Space>
                                                    <Tag color="blue">{f.status}</Tag>
                                                    <Text strong>{f.trackingCompany || 'Shipping Provider'}</Text>
                                                </Space>
                                                <div style={{ marginTop: 8 }}>
                                                    <Text type="secondary">Tracking Number: </Text>
                                                    <Text copyable>{f.trackingNumber || 'Not provided'}</Text>
                                                </div>
                                            </div>
                                            <Button size="small">Track Shipment</Button>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                                    <Paragraph type="secondary">No fulfillments created yet for this order.</Paragraph>
                                    <Button type="dashed" icon={<PlusOutlined />}>Prepare Shipment</Button>
                                </div>
                            )}
                        </Card>

                        {/* Order Timeline */}
                        <Card title={<span><ClockCircleOutlined /> Order History</span>} style={{ borderRadius: 12 }}>
                            <Steps
                                orientation="vertical"
                                current={0}
                                size="small"
                                items={[
                                    ...order.events.map((event: any) => ({
                                        title: <Text strong>{event.status}</Text>,
                                        content: (
                                            <div>
                                                <Text style={{ fontSize: 12 }} type="secondary">{dayjs(event.createdAt).format('MMM D, YYYY [at] h:mm A')}</Text>
                                                {event.note && (
                                                    <div style={{ marginTop: 4, padding: '4px 8px', background: '#f5f5f5', borderRadius: 4 }}>
                                                        <Text style={{ fontSize: 12 }}>{event.note}</Text>
                                                    </div>
                                                )}
                                            </div>
                                        ),
                                        status: 'finish'
                                    })),
                                    {
                                        title: 'Order Created',
                                        content: dayjs(order.createdAt).format('MMM D, YYYY [at] h:mm A'),
                                        status: 'finish'
                                    }
                                ]}
                            />
                        </Card>
                    </Space>
                </Col>

                {/* Right Column: Customer & Address */}
                <Col xs={24} lg={8}>
                    <Space orientation="vertical" size={24} style={{ width: '100%' }}>
                        {/* Customer Information */}
                        <Card title={<span><UserOutlined /> Customer</span>} style={{ borderRadius: 12 }}>
                            <Space align="start" size={16}>
                                <Avatar size={48} icon={<UserOutlined />} style={{ backgroundColor: '#f0f2f5', color: '#1890ff' }} />
                                <div>
                                    <Title level={5} style={{ margin: 0 }}>{order.user?.name || 'Guest Customer'}</Title>
                                    <Text type="secondary">{order.user?.email}</Text>
                                    <div style={{ marginTop: 8 }}>
                                        <Badge status="default" text="No account" />
                                    </div>
                                </div>
                            </Space>
                            <Divider />
                            <Descriptions column={1} size="small">
                                <Descriptions.Item label="Contact Method">Email</Descriptions.Item>
                                <Descriptions.Item label="Total Lifetime Orders">1</Descriptions.Item>
                            </Descriptions>
                        </Card>

                        {/* Shipping Address */}
                        <Card
                            title={<span><EnvironmentOutlined /> Shipping Address</span>}
                            extra={<Button type="link" size="small">Edit</Button>}
                            style={{ borderRadius: 12 }}
                        >
                            <div style={{ lineHeight: '1.8' }}>
                                <Text strong>{order.shippingAddress?.fullName}</Text><br />
                                <Text>{order.shippingAddress?.address}</Text><br />
                                <Text>{order.shippingAddress?.district}, {order.shippingAddress?.city}</Text><br />
                                <Text>{order.shippingAddress?.country}</Text><br />
                                <Text>{order.shippingAddress?.phone}</Text>
                            </div>
                        </Card>

                        {/* Customer Notes */}
                        <Card title="Notes" style={{ borderRadius: 12 }}>
                            <Paragraph type="secondary">
                                {order.customerNote || 'No notes left by customer.'}
                            </Paragraph>
                            <Divider titlePlacement="left" plain><Text style={{ fontSize: 12 }} type="secondary">Internal Notes</Text></Divider>
                            <Paragraph type="secondary" italic>
                                {order.internalNote || 'No internal notes.'}
                            </Paragraph>
                            <Button type="dashed" block icon={<PlusOutlined />}>Add Note</Button>
                        </Card>
                    </Space>
                </Col>
            </Row>
            <FulfillmentModal
                open={isFulfillmentModalOpen}
                order={order}
                onClose={() => setIsFulfillmentModalOpen(false)}
                onSuccess={fetchOrder}
            />
            <RefundModal
                open={isRefundModalOpen}
                order={order}
                onClose={() => setIsRefundModalOpen(false)}
                onSuccess={fetchOrder}
            />
            <PackingSlip order={order} />
        </div>
    );
}
