import React from 'react'
import configPromise from '@/payload.config'
import { getPayload } from 'payload'
import { Gutter } from '@payloadcms/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingCart, Users, TrendingUp } from 'lucide-react'
import { RecentOrdersTable } from './RecentOrdersTable'
import { DashboardChart } from './DashboardChart'

const mockChartData = [
    { name: 'Jan', total: 1200 },
    { name: 'Feb', total: 2100 },
    { name: 'Mar', total: 1800 },
    { name: 'Apr', total: 2400 },
    { name: 'May', total: 2800 },
    { name: 'Jun', total: 3200 },
]

export default async function CustomDashboard() {
    const payload = await getPayload({ config: configPromise })

    const orders = await payload.find({
        collection: 'orders',
        depth: 0,
        limit: 10,
        sort: '-createdAt'
    })

    const users = await payload.find({
        collection: 'users',
        depth: 0,
        limit: 1,
    })

    return (
        <Gutter className="py-8">
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Luiff Art Analytics & Dashboard</h1>
                    <p className="text-muted-foreground mt-2">Executive overview of your gallery's performance.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{orders.totalDocs}</div>
                            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{users.totalDocs}</div>
                            <p className="text-xs text-muted-foreground">+180 new artists and collectors</p>
                        </CardContent>
                    </Card>

                    <Card className="col-span-1 md:col-span-2 lg:col-span-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sales Trends (Mock)</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                        </CardHeader>
                        <CardContent className="h-[90px]">
                            <DashboardChart data={mockChartData} />
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RecentOrdersTable orders={orders} />
                    </CardContent>
                </Card>
            </div>
        </Gutter>
    )
}
