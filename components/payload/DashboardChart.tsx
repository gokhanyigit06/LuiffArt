"use client"

import React from 'react'
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'

import { TrendingUp } from 'lucide-react'

export function DashboardChart({ data }: { data: any[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                    <TrendingUp className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <p className="text-sm font-medium text-muted-foreground">No data available</p>
                <p className="text-xs text-muted-foreground mt-1">
                    Check back later when sales data is populated.
                </p>
            </div>
        )
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="brandGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5e3c" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5e3c" stopOpacity={0.02} />
                    </linearGradient>
                </defs>
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border, #e5e5e5)"
                    strokeOpacity={0.5}
                    vertical={false}
                />
                <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--muted-foreground, #737373)', fontSize: 12 }}
                    dy={10}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--muted-foreground, #737373)', fontSize: 12 }}
                    tickFormatter={(value) => `₺${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                    content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                            const value = payload[0].value as number
                            const formatted = new Intl.NumberFormat('tr-TR', {
                                style: 'currency',
                                currency: 'TRY',
                                minimumFractionDigits: 0,
                            }).format(value)
                            return (
                                <div className="rounded-lg border bg-background px-3 py-2 shadow-lg">
                                    <p className="text-xs font-medium text-muted-foreground mb-0.5">{label}</p>
                                    <p className="text-sm font-bold">{formatted}</p>
                                </div>
                            )
                        }
                        return null
                    }}
                />
                <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#8b5e3c"
                    fill="url(#brandGradient)"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{
                        r: 5,
                        fill: '#8b5e3c',
                        stroke: '#fff',
                        strokeWidth: 2,
                    }}
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}
