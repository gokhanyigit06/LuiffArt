'use client';

import { Card, Statistic, Row, Col, Table, Tag } from 'antd';
import { ArrowUpOutlined, ShoppingCartOutlined, DollarOutlined, UserOutlined } from '@ant-design/icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 5000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 6890 },
    { name: 'Sat', sales: 8390 },
    { name: 'Sun', sales: 9490 },
];

const recentOrders = [
    { key: '1', id: '#1024', customer: 'John Doe', status: 'Processing', total: '$120.00' },
    { key: '2', id: '#1023', customer: 'Jane Smith', status: 'Pending', total: '$85.50' },
    { key: '3', id: '#1022', customer: 'Ali Veli', status: 'Pending', total: '₺4,500' },
    { key: '4', id: '#1021', customer: 'Ayşe Yılmaz', status: 'Processing', total: '₺1,250' },
];

const columns = [
    {
        title: 'Order ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Customer',
        dataIndex: 'customer',
        key: 'customer',
    },
    {
        title: 'Status',
        key: 'status',
        dataIndex: 'status',
        render: (status: string) => {
            let color = status === 'Processing' ? 'blue' : 'gold';
            return <Tag color={color}>{status.toUpperCase()}</Tag>;
        }
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
    },
];

export default function AdminDashboard() {
    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8, fontFamily: 'var(--font-italiana)' }}>Dashboard</h1>
                <p style={{ color: '#8c8c8c', fontSize: 14 }}>Welcome back, here's what's happening today.</p>
            </div>

            {/* KPI Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Sales"
                            value={112893}
                            precision={2}
                            prefix={<DollarOutlined />}
                            suffix="₺"
                            valueStyle={{ color: '#3f8600' }}
                        />
                        <div style={{ marginTop: 8, fontSize: 12, color: '#52c41a' }}>
                            <ArrowUpOutlined /> 12% from last week
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Orders"
                            value={1245}
                            prefix={<ShoppingCartOutlined />}
                        />
                        <div style={{ marginTop: 8, fontSize: 12, color: '#52c41a' }}>
                            <ArrowUpOutlined /> 5% from last week
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="New Customers"
                            value={89}
                            prefix={<UserOutlined />}
                        />
                        <div style={{ marginTop: 8, fontSize: 12, color: '#ff4d4f' }}>
                            -2% from last week
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Conversion Rate"
                            value={2.4}
                            precision={1}
                            suffix="%"
                            prefix={<ArrowUpOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                        <div style={{ marginTop: 8, fontSize: 12, color: '#52c41a' }}>
                            +0.4% from last week
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                {/* Sales Chart */}
                <Col xs={24} lg={16}>
                    <Card title="Sales Overview" extra={<a href="#">View Report</a>}>
                        <div style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1890ff" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#1890ff" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area
                                        type="monotone"
                                        dataKey="sales"
                                        stroke="#1890ff"
                                        fillOpacity={1}
                                        fill="url(#colorSales)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>

                {/* Recent Orders */}
                <Col xs={24} lg={8}>
                    <Card title="Recent Orders" extra={<a href="/admin/orders">View All</a>}>
                        <Table
                            columns={columns}
                            dataSource={recentOrders}
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
