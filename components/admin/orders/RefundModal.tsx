'use client';

import React, { useState } from 'react';
import {
    Modal, Form, Input, InputNumber, Table,
    Typography, Space, Checkbox, message, Divider, Alert
} from 'antd';
import { RollbackOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

interface RefundModalProps {
    open: boolean;
    order: any;
    onClose: () => void;
    onSuccess: () => void;
}

export default function RefundModal({ open, order, onClose, onSuccess }: RefundModalProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [refundItems, setRefundItems] = useState<Record<string, number>>({});

    if (!order) return null;

    const calculateRefundAmount = () => {
        return Object.entries(refundItems).reduce((sum, [id, qty]) => {
            const item = order.orderItems.find((oi: any) => oi.id === id);
            return sum + (Number(item?.price || 0) * qty);
        }, 0);
    };

    const handleQtyChange = (id: string, qty: number | null) => {
        const newItems = { ...refundItems };
        if (qty === 0 || qty === null) {
            delete newItems[id];
        } else {
            newItems[id] = qty;
        }
        setRefundItems(newItems);

        // Update total amount field
        const total = Object.entries(newItems).reduce((sum, [itemId, quantity]) => {
            const item = order.orderItems.find((oi: any) => oi.id === itemId);
            return sum + (Number(item?.price || 0) * quantity);
        }, 0);
        form.setFieldsValue({ amount: total });
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (Object.keys(refundItems).length === 0 && values.amount === 0) {
                message.error('Please select items or enter an amount to refund');
                return;
            }

            setLoading(true);

            const payload = {
                amount: values.amount,
                reason: values.reason,
                restockItems: values.restockItems,
                items: Object.entries(refundItems).map(([id, qty]) => {
                    const item = order.orderItems.find((oi: any) => oi.id === id);
                    return {
                        orderItemId: id,
                        quantity: qty,
                        amount: Number(item?.price || 0) * qty
                    };
                })
            };

            const response = await fetch(`/api/admin/orders/${order.id}/refund`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                message.success('Refund processed successfully');
                setRefundItems({});
                form.resetFields();
                onSuccess();
                onClose();
            } else {
                const error = await response.json();
                message.error(error.error || 'Failed to process refund');
            }
        } catch (error) {
            // Validator errors
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Product',
            key: 'product',
            render: (text: any, record: any) => (
                <Space orientation="vertical" size={0}>
                    <Text strong>{record.productVariant?.product?.name}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {record.productVariant?.size} / {record.productVariant?.material}
                    </Text>
                </Space>
            )
        },
        {
            title: 'Available',
            dataIndex: 'quantity',
            key: 'quantity'
        },
        {
            title: 'Refund Qty',
            key: 'refund',
            render: (text: any, record: any) => (
                <InputNumber
                    min={0}
                    max={record.quantity}
                    defaultValue={0}
                    onChange={(val) => handleQtyChange(record.id, val)}
                />
            )
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `${order.currency === 'TRY' ? '₺' : '$'}${Number(price).toFixed(2)}`
        }
    ];

    return (
        <Modal
            title={<span><RollbackOutlined /> Issue Refund</span>}
            open={open}
            onCancel={onClose}
            onOk={handleSubmit}
            confirmLoading={loading}
            width={700}
            okText="Issue Refund"
            okButtonProps={{ danger: true }}
        >
            <Alert
                message="Deep Refund Mode"
                description="Selected items can be automatically restocked to your inventory."
                type="info"
                showIcon
                style={{ marginBottom: 24 }}
            />

            <Table
                dataSource={order.orderItems}
                columns={columns}
                pagination={false}
                rowKey="id"
                size="small"
                style={{ marginBottom: 24 }}
            />

            <Form form={form} layout="vertical" initialValues={{ restockItems: true, amount: 0 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Form.Item
                        label="Refund Amount"
                        name="amount"
                        rules={[{ required: true, type: 'number', min: 0 }]}
                        extra="Calculated based on selected items. You can manual override."
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            prefix={order.currency === 'TRY' ? '₺' : '$'}
                            precision={2}
                        />
                    </Form.Item>

                    <Form.Item label="Reason" name="reason">
                        <Input placeholder="e.g. Broken item, customer changed mind" />
                    </Form.Item>
                </div>

                <Form.Item name="restockItems" valuePropName="checked">
                    <Checkbox>Restock selected items to inventory</Checkbox>
                </Form.Item>

                <div style={{ padding: 16, background: '#fff1f0', borderRadius: 8 }}>
                    <Text type="danger" strong>Financial Summary:</Text>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                        <Text>Total to be refunded:</Text>
                        <Text strong color="red">
                            {order.currency === 'TRY' ? '₺' : '$'}{form.getFieldValue('amount')?.toFixed?.(2) || '0.00'}
                        </Text>
                    </div>
                </div>
            </Form>
        </Modal>
    );
}
