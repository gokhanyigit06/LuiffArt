"use client"

import React from 'react'
import { DataTable } from '@/components/ui/data-table'
import { Skeleton } from '@/components/ui/skeleton'

export function RecentOrdersTable({ orders }: { orders: any }) {
    const orderColumns = [
        {
            accessorKey: "orderNumber",
            header: "Order Number",
            cell: ({ row }: any) => <div className="font-medium">#{row.getValue("orderNumber")}</div>,
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }: any) => <div className="capitalize">{row.getValue("status")}</div>,
        },
        {
            accessorKey: "totalAmount",
            header: "Amount",
            cell: ({ row }: any) => {
                const amount = parseFloat(row.getValue("totalAmount"))
                const formatted = new Intl.NumberFormat("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                }).format(amount)
                return <div className="font-medium">{formatted}</div>
            },
        },
        {
            accessorKey: "createdAt",
            header: "Date",
            cell: ({ row }: any) => <div>{new Date(row.getValue("createdAt")).toLocaleDateString()}</div>,
        },
    ]

    if (!orders || !orders.docs) {
        return (
            <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        )
    }

    return <DataTable columns={orderColumns} data={orders.docs as any} />
}
