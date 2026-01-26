'use client';

import React, { useEffect, useState } from 'react';
import {
    Tabs, Table, Button, Card, Tag, Space, Modal,
    Form, Input, InputNumber, DatePicker, Select,
    Switch, message, Typography, Row, Col
} from 'antd';
import {
    PlusOutlined, PercentageOutlined,
    NotificationOutlined, EditOutlined, DeleteOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

export default function AdminCampaignsPage() {
    const [coupons, setCoupons] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [couponModalVisible, setCouponModalVisible] = useState(false);
    const [campaignModalVisible, setCampaignModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [couponsRes, campaignsRes] = await Promise.all([
                fetch('/api/admin/coupons'),
                fetch('/api/admin/campaigns')
            ]);
            if (couponsRes.ok) setCoupons(await couponsRes.json());
            if (campaignsRes.ok) setCampaigns(await campaignsRes.json());
        } catch (error) {
            message.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCoupon = async (values: any) => {
        try {
            const payload = {
                ...values,
                startDate: values.dates?.[0],
                endDate: values.dates?.[1]
            };
            const res = await fetch('/api/admin/coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                message.success('Coupon created');
                setCouponModalVisible(false);
                form.resetFields();
                fetchData();
            }
        } catch (error) {
            message.error('Failed to create coupon');
        }
    };

    const handleCreateCampaign = async (values: any) => {
        try {
            const payload = {
                ...values,
                startDate: values.dates?.[0],
                endDate: values.dates?.[1]
            };
            const res = await fetch('/api/admin/campaigns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                message.success('Campaign created');
                setCampaignModalVisible(false);
                form.resetFields();
                fetchData();
            }
        } catch (error) {
            message.error('Failed to create campaign');
        }
    };

    const couponColumns = [
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
            render: (code: string) => <Tag color="black" style={{ fontStyle: 'monospace' }}>{code}</Tag>
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => type === 'PERCENTAGE' ? 'Percentage (%)' : 'Fixed Amount'
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
            render: (val: string, record: any) => record.type === 'PERCENTAGE' ? `${val}%` : `₺${val}`
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (active: boolean) => active ? <Tag color="green">Active</Tag> : <Tag color="red">Paused</Tag>
        },
        {
            title: 'Usage',
            key: 'usage',
            render: (_: any, record: any) => (
                <span>{record.usedCount} / {record.usageLimit || '∞'}</span>
            )
        },
        {
            title: 'Expiry',
            key: 'expiry',
            render: (_: any, record: any) => record.endDate ? dayjs(record.endDate).format('DD MMM YYYY') : 'Never'
        }
    ];

    const campaignColumns = [
        {
            title: 'Campaign Title',
            dataIndex: 'title',
            key: 'title',
            render: (title: string, record: any) => (
                <div>
                    <div style={{ fontWeight: 600 }}>{title}</div>
                    <div style={{ fontSize: 11, color: '#999' }}>luiff.art/campaign/{record.slug}</div>
                </div>
            )
        },
        {
            title: 'Linked Coupon',
            dataIndex: ['coupon', 'code'],
            key: 'coupon',
            render: (code: string) => code ? <Tag color="blue">{code}</Tag> : <Text type="secondary">-</Text>
        },
        {
            title: 'Period',
            key: 'period',
            render: (_: any, record: any) => (
                <div style={{ fontSize: 13 }}>
                    {dayjs(record.startDate).format('MMM D')} - {dayjs(record.endDate).format('MMM D, YYYY')}
                </div>
            )
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (active: boolean) => active ? <Tag color="green">Running</Tag> : <Tag color="orange">Draft</Tag>
        }
    ];

    return (
        <div style={{ padding: '0 20px' }}>
            <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Title level={2} style={{ margin: 0, fontFamily: 'var(--font-italiana)' }}>Promotions & Campaigns</Title>
                    <Text type="secondary">Manage discount codes and marketing events</Text>
                </div>
            </div>

            <Tabs
                defaultActiveKey="1"
                items={[
                    {
                        key: '1',
                        label: <span><PercentageOutlined /> Coupons</span>,
                        children: (
                            <Card style={{ borderRadius: 12 }}>
                                <div style={{ marginBottom: 16, textAlign: 'right' }}>
                                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setCouponModalVisible(true)} className="!bg-black">
                                        Create Coupon
                                    </Button>
                                </div>
                                <Table columns={couponColumns} dataSource={coupons} rowKey="id" loading={loading} />
                            </Card>
                        )
                    },
                    {
                        key: '2',
                        label: <span><NotificationOutlined /> Campaigns</span>,
                        children: (
                            <Card style={{ borderRadius: 12 }}>
                                <div style={{ marginBottom: 16, textAlign: 'right' }}>
                                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setCampaignModalVisible(true)} className="!bg-black">
                                        Create Campaign
                                    </Button>
                                </div>
                                <Table columns={campaignColumns} dataSource={campaigns} rowKey="id" loading={loading} />
                            </Card>
                        )
                    }
                ]}
            />

            {/* Create Coupon Modal */}
            <Modal
                title="Create New Coupon"
                open={couponModalVisible}
                onCancel={() => setCouponModalVisible(false)}
                footer={null}
                width={600}
            >
                <Form form={form} layout="vertical" onFinish={handleCreateCoupon}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="code" label="Coupon Code" rules={[{ required: true }]}>
                                <Input placeholder="NEWYEAR2024" style={{ textTransform: 'uppercase' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="type" label="Type" initialValue="PERCENTAGE">
                                <Select>
                                    <Select.Option value="PERCENTAGE">Percentage (%)</Select.Option>
                                    <Select.Option value="FIXED_AMOUNT">Fixed Amount (₺/$)</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="value" label="Value" rules={[{ required: true }]}>
                                <InputNumber style={{ width: '100%' }} min={0} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="usageLimit" label="Total Usage Limit">
                                <InputNumber style={{ width: '100%' }} min={1} placeholder="Unlimited" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item name="dates" label="Validity Period">
                                <RangePicker style={{ width: '100%' }} showTime />
                            </Form.Item>
                        </Col>
                    </Row>
                    <div style={{ textAlign: 'right', marginTop: 16 }}>
                        <Button onClick={() => setCouponModalVisible(false)} style={{ marginRight: 8 }}>Cancel</Button>
                        <Button type="primary" htmlType="submit" className="!bg-black">Save Coupon</Button>
                    </div>
                </Form>
            </Modal>

            {/* Create Campaign Modal */}
            <Modal
                title="Create Marketing Campaign"
                open={campaignModalVisible}
                onCancel={() => setCampaignModalVisible(false)}
                footer={null}
                width={700}
            >
                <Form form={form} layout="vertical" onFinish={handleCreateCampaign}>
                    <Form.Item name="title" label="Campaign Title" rules={[{ required: true }]}>
                        <Input placeholder="Bahar Koleksiyonu İndirimi" />
                    </Form.Item>
                    <Form.Item name="slug" label="Slug (URL)" rules={[{ required: true }]}>
                        <Input placeholder="bahar-indirimi" addonBefore="luiff.art/campaign/" />
                    </Form.Item>
                    <Form.Item name="bannerUrl" label="Banner Image URL">
                        <Input placeholder="https://..." />
                    </Form.Item>
                    <Form.Item name="description" label="Campaign Description">
                        <Input.TextArea rows={4} placeholder="Describe the campaign details..." />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="couponId" label="Link Coupon (Optional)">
                                <Select placeholder="Select a coupon" allowClear>
                                    {coupons.map((c: any) => (
                                        <Select.Option key={c.id} value={c.id}>{c.code} ({c.value}{c.type === 'PERCENTAGE' ? '%' : '₺'})</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="dates" label="Campaign Period">
                                <RangePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <div style={{ textAlign: 'right', marginTop: 16 }}>
                        <Button onClick={() => setCampaignModalVisible(false)} style={{ marginRight: 8 }}>Cancel</Button>
                        <Button type="primary" htmlType="submit" className="!bg-black">Launch Campaign</Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}
