"use client"

import React from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts'

export function DashboardChart({ data }: { data: any[] }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <Tooltip
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex flex-col">
                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                Volume
                                            </span>
                                            <span className="font-bold text-muted-foreground">
                                                {payload[0].value}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        return null
                    }}
                />
                <Area
                    type="monotone"
                    dataKey="total"
                    stroke="var(--color-brand-primary)"
                    fill="var(--color-brand-primary)"
                    fillOpacity={0.2}
                    strokeWidth={2}
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}
