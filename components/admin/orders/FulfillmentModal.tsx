'use client';

import React, { useState } from 'react';
import {
    Modal, Form, Input, InputNumber, Table,
    Typography, Space, Checkbox, message, Divider
} from 'antd';
import { TruckOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface FulfillmentModalProps {
    open: boolean;
    order: any;
    onClose: () => void;
    onSuccess: () => void;
}

export default function FulfillmentModal({ open, order, onClose, onSuccess }: FulfillmentModalProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    if (!order) return null;

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            // Prepare items for fulfillment
            const items = order.orderItems.map((item: any) => ({
                orderItemId: item.id,
                quantity: item.quantity // Simplification: fulfill all quantities
            }));

            const response = await fetch(`/api/admin/orders/${order.id}/fulfill`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    trackingCompany: values.trackingCompany,
                    trackingNumber: values.trackingNumber,
                    trackingUrl: values.trackingUrl,
                    notifyCustomer: values.notifyCustomer
                })
            });

            if (response.ok) {
                message.success('Fulfillment created successfully');
                form.resetFields();
                onSuccess();
                onClose();
            } else {
                const error = await response.json();
                message.error(error.error || 'Failed to fulfill order');
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
            title: 'Ordered',
            dataIndex: 'quantity',
            key: 'quantity'
        },
        {
            title: 'To Fulfill',
            key: 'fulfill',
            render: (text: any, record: any) => (
                <InputNumber min={0} max={record.quantity} defaultValue={record.quantity} disabled />
            )
        }
    ];

    return (
        <Modal
            title={<span><TruckOutlined /> Fulfill Items</span>}
            open={open}
            onCancel={onClose}
            onOk={handleSubmit}
            confirmLoading={loading}
            width={600}
            okText="Fulfill Items"
        >
            <Table
                dataSource={order.orderItems}
                columns={columns}
                pagination={false}
                rowKey="id"
                size="small"
                style={{ marginBottom: 24 }}
            />

            <Divider titlePlacement="left">Shipping Information</Divider>

            <Form form={form} layout="vertical">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Form.Item label="Shipping Carrier" name="trackingCompany" rules={[{ required: true }]}>
                        <Input placeholder="e.g. Navlungo, UPS, DHL" />
                    </Form.Item>
                    <Form.Item label="Tracking Number" name="trackingNumber" rules={[{ required: true }]}>
                        <Input placeholder="Enter tracking code" />
                    </Form.Item>
                </div>

                <Form.Item label="Tracking URL" name="trackingUrl">
                    <Input placeholder="https://tracking-link.com/..." />
                </Form.Item>

                <Form.Item name="notifyCustomer" valuePropName="checked" initialValue={true}>
                    <Checkbox>Notify customer via email</Checkbox>
                </Form.Item>
            </Form>
        </Modal>
    );
}
