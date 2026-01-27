'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Segmented, Skeleton, Empty, Button, Tabs, Tag } from 'antd';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    AreaChart, Area, LineChart, Line, PieChart, Pie, Cell, FunnelChart, Funnel, LabelList
} from 'recharts';
import {
    EyeOutlined, ShoppingCartOutlined, DollarOutlined,
    ArrowUpOutlined, ArrowDownOutlined, DownloadOutlined,
    UserOutlined, BarChartOutlined, StopOutlined
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import Image from 'next/image';

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [period, setPeriod] = useState<string | number>('7d');

    // Abandoned Carts State
    const [loadingAbandoned, setLoadingAbandoned] = useState(false);
    const [abandonedCarts, setAbandonedCarts] = useState<any[]>([]);

    useEffect(() => {
        fetchStats();
        fetchAbandonedCarts();
    }, [period]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/analytics/stats?period=${period}`);
            const stats = await res.json();
            setData(stats);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAbandonedCarts = async () => {
        setLoadingAbandoned(true);
        try {
            const res = await fetch('/api/analytics/abandoned');
            const result = await res.json();
            setAbandonedCarts(result.abandonedCarts || []);
        } catch (err) {
            console.error('Failed to fetch abandoned carts:', err);
        } finally {
            setLoadingAbandoned(false);
        }
    };

    const handleExport = () => {
        if (!data) return;

        const wb = XLSX.utils.book_new();

        // 1. Summary Sheet
        const summaryData = [
            ["Metric", "Value"],
            ["Total Views", data.summary.totalViews],
            ["Total Cart Actions", data.summary.totalCarts],
            ["Total Purchases", data.summary.totalPurchases],
            ["Total Revenue", data.summary.totalRevenue],
            ["Conversion Rate", `${data.summary.conversionRate.toFixed(2)}%`]
        ];
        const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

        // 2. Daily Data Sheet
        const wsDaily = XLSX.utils.json_to_sheet(data.chartData);
        XLSX.utils.book_append_sheet(wb, wsDaily, "Daily Trends");

        // 3. Top Products Sheet
        const wsProducts = XLSX.utils.json_to_sheet(data.topProducts);
        XLSX.utils.book_append_sheet(wb, wsProducts, "Top Products");

        // 4. Abandoned Carts Sheet
        const wsAbandoned = XLSX.utils.json_to_sheet(abandonedCarts.map(c => ({
            SessionID: c.sessionId,
            LastActive: c.lastActive,
            ItemsCount: c.items.length,
            TotalValue: c.totalValue
        })));
        XLSX.utils.book_append_sheet(wb, wsAbandoned, "Abandoned Carts");

        // Download
        XLSX.writeFile(wb, `LuiffArt_Analytics_${period}_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    if (loading && !data) {
        return (
            <div style={{ padding: '24px' }}>
                <Skeleton active />
            </div>
        );
    }

    if (!data) {
        return (
            <div style={{ padding: '24px' }}>
                <Empty description="No data available" />
            </div>
        );
    }

    const OverviewTab = () => (
        <>
            {/* Summary Stats */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="glass-panel border-none">
                        <Statistic
                            title="Total Views"
                            value={data?.summary?.totalViews}
                            prefix={<EyeOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="glass-panel border-none">
                        <Statistic
                            title="Total Cart Actions"
                            value={data?.summary?.totalCarts}
                            prefix={<ShoppingCartOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="glass-panel border-none">
                        <Statistic
                            title="Conversions"
                            value={data?.summary?.totalPurchases}
                            prefix={<BarChartOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="glass-panel border-none">
                        <Statistic
                            title="Total Revenue"
                            value={data?.summary?.totalRevenue}
                            precision={2}
                            prefix={<DollarOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Charts */}
            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                <Col xs={24} lg={16}>
                    <Card title="Traffic & Revenue Over Time" className="glass-panel border-none">
                        <div style={{ height: 400 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data?.chartData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                    <XAxis dataKey="date" />
                                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                                    <RechartsTooltip />
                                    <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRevenue)" />
                                    <Area yAxisId="right" type="monotone" dataKey="views" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.1} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Conversion Funnel" className="glass-panel border-none">
                        <div style={{ height: 400 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <FunnelChart>
                                    <RechartsTooltip />
                                    <Funnel
                                        dataKey="value"
                                        data={data?.funnel}
                                        isAnimationActive
                                    >
                                        <LabelList position="right" fill="#888" stroke="none" dataKey="name" />
                                    </Funnel>
                                </FunnelChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                <Col xs={24} lg={12}>
                    <Card title="Top Products" className="glass-panel border-none">
                        <Table
                            dataSource={data?.topProducts}
                            columns={[
                                { title: 'Product', dataIndex: 'name', key: 'name', render: (t: any, r: any) => r.name },
                                { title: 'Views', dataIndex: 'views', key: 'views', render: (t: any, r: any) => r.views },
                            ]}
                            pagination={false}
                            rowKey="id"
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="Conversion Rate" className="glass-panel border-none text-center">
                        <Statistic
                            value={data?.summary?.conversionRate}
                            precision={2}
                            valueStyle={{ color: '#3f8600', fontSize: '48px' }}
                            prefix={<ArrowUpOutlined />}
                            suffix="%"
                        />
                        <p className="text-gray-400 font-outfit mt-4">Average conversion from View to Purchase</p>
                    </Card>
                </Col>
            </Row>
        </>
    );

    const AbandonedTab = () => (
        <Card className="glass-panel border-none">
            <Table
                loading={loadingAbandoned}
                dataSource={abandonedCarts}
                rowKey="sessionId"
                columns={[
                    {
                        title: 'Session ID',
                        dataIndex: 'sessionId',
                        key: 'sessionId',
                        render: (t: any) => <span className="font-mono text-xs text-gray-400">{t.slice(0, 8)}...</span>
                    },
                    {
                        title: 'Last Active',
                        dataIndex: 'lastActive',
                        key: 'lastActive',
                        render: (t: any) => new Date(t).toLocaleString()
                    },
                    {
                        title: 'Items',
                        dataIndex: 'items',
                        key: 'items',
                        render: (items: any) => (
                            <div className="flex -space-x-2 overflow-hidden">
                                {items.slice(0, 5).map((item: any, i: number) => (
                                    <div key={i} title={item.name} className="relative inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 overflow-hidden">
                                        {item.image ? (
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full w-full text-[10px] font-bold">
                                                {item.name?.[0]}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {items.length > 5 && (
                                    <div className="relative inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                                        +{items.length - 5}
                                    </div>
                                )}
                                <span className="ml-2 text-xs text-gray-500 self-center">({items.length} items)</span>
                            </div>
                        )
                    },
                    {
                        title: 'Potential Value',
                        dataIndex: 'totalValue',
                        key: 'totalValue',
                        render: (t: any) => <span className="font-semibold">{Number(t).toFixed(2)}</span>
                    },
                    {
                        title: 'Status',
                        key: 'status',
                        render: () => <Tag color="orange" icon={<StopOutlined />}>Abandoned</Tag>
                    }
                ]}
            />
        </Card>
    );

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="font-italiana text-3xl">Pulse Analytics</h1>
                <div className="flex gap-4">
                    <Button icon={<DownloadOutlined />} onClick={handleExport}>
                        Export Report
                    </Button>
                    <Segmented
                        options={[
                            { label: '7 Days', value: '7d' },
                            { label: '30 Days', value: '30d' },
                            { label: 'All Time', value: 'all' }
                        ]}
                        value={period}
                        onChange={(val: any) => setPeriod(val)}
                    />
                </div>
            </div>

            <Tabs
                defaultActiveKey="overview"
                items={[
                    { key: 'overview', label: 'Overview', children: <OverviewTab /> },
                    { key: 'abandoned', label: 'Abandoned Carts', children: <AbandonedTab /> }
                ]}
            />

            <style jsx global>{`
                .glass-panel {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
                }
            `}</style>
        </div>
    );
}
