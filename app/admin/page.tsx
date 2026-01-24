'use client';

import { Card, Statistic, Row, Col, Table, Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, ShoppingCartOutlined, DollarOutlined } from '@ant-design/icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Mon', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Tue', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Wed', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Thu', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'Fri', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Sat', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Sun', uv: 3490, pv: 4300, amt: 2100 },
];

const columns = [
    {
        title: 'Order ID',
        dataIndex: 'id',
        key: 'id',
        render: (text: string) => <a className="text-blue-600 font-medium">{text}</a>,
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
        render: (_: any, { status }: any) => {
            let color = 'green';
            if (status === 'Pending') color = 'gold';
            if (status === 'Processing') color = 'blue';
            return (
                <Tag color={color} key={status}>
                    {status.toUpperCase()}
                </Tag>
            );
        }
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
    },
];

const recentOrders = [
    { key: '1', id: '#1024', customer: 'John Doe', status: 'Processing', total: '$120.00' },
    { key: '2', id: '#1023', customer: 'Jane Smith', status: 'Pending', total: '$85.50' },
    { key: '3', id: '#1022', customer: 'Ali Veli', status: 'Unfulfilled', total: '₺4,500' },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold font-italiana text-gray-800">Dashboard</h1>
            </div>

            {/* KPI Cards */}
            <Row gutter={16}>
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic
                            title="Total Sales (Today)"
                            value={112893}
                            precision={2}
                            valueStyle={{ color: '#3f8600', fontFamily: 'var(--font-outfit)' }}
                            prefix={<DollarOutlined />}
                            suffix="₺"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic
                            title="Orders"
                            value={24}
                            valueStyle={{ fontFamily: 'var(--font-outfit)' }}
                            prefix={<ShoppingCartOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic
                            title="Conversion Rate"
                            value={2.4}
                            precision={1}
                            valueStyle={{ color: '#3f8600', fontFamily: 'var(--font-outfit)' }}
                            prefix={<ArrowUpOutlined />}
                            suffix="%"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic
                            title="Avg. Order Value"
                            value={1450}
                            valueStyle={{ fontFamily: 'var(--font-outfit)' }}
                            suffix="₺"
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={16}>
                    <Card title="Sales Overview" bordered={false} className="shadow-sm h-full">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={data}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#000" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#000" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="uv" stroke="#000" fillOpacity={1} fill="url(#colorUv)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Recent Orders" bordered={false} className="shadow-sm h-full" extra={<a href="#">View All</a>}>
                        <Table columns={columns} dataSource={recentOrders} pagination={false} size="small" />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
