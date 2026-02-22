import React from 'react'
import configPromise from '@/payload.config'
import { getPayload } from 'payload'
import { Gutter } from '@payloadcms/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
    ShoppingCart,
    Users,
    TrendingUp,
    DollarSign,
    Plus,
    ExternalLink,
    Settings,
    Package,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react'
import { RecentOrdersTable } from './RecentOrdersTable'
import { DashboardChart } from './DashboardChart'

const mockChartData = [
    { name: 'Oca', total: 4200 },
    { name: 'Şub', total: 5800 },
    { name: 'Mar', total: 4600 },
    { name: 'Nis', total: 7200 },
    { name: 'May', total: 8400 },
    { name: 'Haz', total: 9600 },
    { name: 'Tem', total: 8100 },
    { name: 'Ağu', total: 11200 },
]

const mockRecentActivity = [
    { id: 1, action: 'Yeni sipariş oluşturuldu', detail: '#1042 — Kanvas Tablo', time: '2 dk önce' },
    { id: 2, action: 'Ödeme alındı', detail: '#1041 — ₺2.450', time: '15 dk önce' },
    { id: 3, action: 'Ürün güncellendi', detail: 'Abstract Ocean — Stok +5', time: '1 saat önce' },
    { id: 4, action: 'Yeni kullanıcı kaydı', detail: 'collector@luiff.art', time: '3 saat önce' },
    { id: 5, action: 'Kargo gönderildi', detail: '#1039 — Yurtiçi Kargo', time: '5 saat önce' },
]

interface StatCardProps {
    title: string
    value: string | number
    description: string
    icon: React.ReactNode
    trend?: 'up' | 'down'
    trendValue?: string
}

function StatCard({ title, value, description, icon, trend, trendValue }: StatCardProps) {
    return (
        <Card className="rounded-xl border-border/40 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
                <CardTitle className="text-sm font-medium tracking-tight text-muted-foreground">{title}</CardTitle>
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {icon}
                </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                <div className="text-3xl font-bold tracking-tight">{value}</div>
                <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                    {trend === 'up' && <ArrowUpRight className="h-3 w-3 text-emerald-500" strokeWidth={2.5} />}
                    {trend === 'down' && <ArrowDownRight className="h-3 w-3 text-red-500" strokeWidth={2.5} />}
                    {trendValue && (
                        <span className={`font-medium ${trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                            {trendValue}
                        </span>
                    )}
                    <span>{description}</span>
                </div>
            </CardContent>
        </Card>
    )
}

function ActivityItem({ action, detail, time, isLast }: { action: string; detail: string; time: string; isLast: boolean }) {
    return (
        <div className="relative flex items-start gap-4 pb-4">
            {!isLast && <div className="absolute left-1.5 top-3 h-full w-px bg-border/50" />}
            <div className="relative z-10 mt-1 h-3 w-3 shrink-0 rounded-full border-2 border-primary bg-background shadow-sm" />
            <div className="flex-1 min-w-0 pb-2">
                <p className="text-sm font-medium leading-none mb-1 text-foreground">{action}</p>
                <p className="text-xs text-muted-foreground truncate">{detail}</p>
            </div>
            <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap mt-0.5 uppercase tracking-wider">{time}</span>
        </div>
    )
}

export default async function CustomDashboard() {
    let orders = { totalDocs: 0, docs: [] as any[] }
    let users = { totalDocs: 0 }

    try {
        const payload = await getPayload({ config: configPromise })

        orders = await payload.find({
            collection: 'orders',
            depth: 0,
            limit: 10,
            sort: '-createdAt'
        }) as any

        users = await payload.find({
            collection: 'users',
            depth: 0,
            limit: 1,
        })
    } catch (e) {
        console.error('Dashboard data fetch failed:', e)
    }

    // Calculate mock revenue
    const mockRevenue = orders.docs.reduce((acc: number, order: any) => {
        return acc + (parseFloat(order?.totalAmount) || 0)
    }, 0)
    const formattedRevenue = new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 0,
    }).format(mockRevenue || 24650)

    return (
        <Gutter className="p-8">
            <div className="flex flex-col gap-6">

                {/* ─── Header: Title + Quick Actions ─── */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Luiff Art <span className="text-brand">Dashboard</span>
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Executive overview of your gallery&apos;s performance.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="default" size="sm" className="bg-brand hover:bg-brand-primary-dark text-white">
                            <Plus className="h-4 w-4" strokeWidth={1.5} />
                            Add Product
                        </Button>
                        <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
                            View Store
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Settings className="h-4 w-4" strokeWidth={1.5} />
                        </Button>
                    </div>
                </div>

                {/* ─── Row 1: Stat Cards ─── */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Orders"
                        value={orders.totalDocs}
                        description="from last month"
                        icon={<ShoppingCart className="h-4 w-4 text-brand" strokeWidth={1.5} />}
                        trend="up"
                        trendValue="+12.5%"
                    />
                    <StatCard
                        title="Registered Users"
                        value={users.totalDocs}
                        description="artists & collectors"
                        icon={<Users className="h-4 w-4 text-brand" strokeWidth={1.5} />}
                        trend="up"
                        trendValue="+8.2%"
                    />
                    <StatCard
                        title="Revenue"
                        value={formattedRevenue}
                        description="this period"
                        icon={<DollarSign className="h-4 w-4 text-brand" strokeWidth={1.5} />}
                        trend="up"
                        trendValue="+23.1%"
                    />
                    <StatCard
                        title="Active Products"
                        value="48"
                        description="in catalog"
                        icon={<Package className="h-4 w-4 text-brand" strokeWidth={1.5} />}
                        trend="up"
                        trendValue="+4"
                    />
                </div>

                {/* ─── Row 2: Chart (2/3) + Activity (1/3) ─── */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Sales Trends Chart */}
                    <Card className="lg:col-span-2 shadow-sm border-border/40 rounded-xl bg-card">
                        <CardHeader className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg tracking-tight">Sales Trends</CardTitle>
                                    <CardDescription>Monthly revenue overview for 2024</CardDescription>
                                </div>
                                <TrendingUp className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                            </div>
                        </CardHeader>
                        <CardContent className="h-[280px] p-6 pt-0">
                            <DashboardChart data={mockChartData} />
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="shadow-sm border-border/40 rounded-xl bg-card">
                        <CardHeader className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg tracking-tight">Recent Activity</CardTitle>
                                    <CardDescription>Latest store events</CardDescription>
                                </div>
                                <Clock className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <div className="flex flex-col ml-2 mt-2">
                                {mockRecentActivity.map((item, idx) => (
                                    <ActivityItem
                                        key={item.id}
                                        action={item.action}
                                        detail={item.detail}
                                        time={item.time}
                                        isLast={idx === mockRecentActivity.length - 1}
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ─── Row 3: Orders Table ─── */}
                <Card className="shadow-sm border-border/40 rounded-xl bg-card">
                    <CardHeader className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg tracking-tight">Recent Orders</CardTitle>
                                <CardDescription>Your last 10 orders</CardDescription>
                            </div>
                            <Button variant="outline" size="sm">
                                View All
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <RecentOrdersTable orders={orders} />
                    </CardContent>
                </Card>

            </div>
        </Gutter>
    )
}
