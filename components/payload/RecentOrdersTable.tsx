"use client"

import React from 'react'
import { DataTable } from '@/components/ui/data-table'
import { Skeleton } from '@/components/ui/skeleton'
import { Package } from 'lucide-react'

function StatusBadge({ status }: { status: string }) {
    const statusMap: Record<string, string> = {
        PENDING: 'status-pending',
        PAID: 'status-paid',
        PREPARING: 'status-pending',
        SHIPPED: 'status-shipped',
        DELIVERED: 'status-delivered',
        CANCELLED: 'status-cancelled',
        REFUNDED: 'status-cancelled',
    }

    const dotMap: Record<string, string> = {
        PENDING: 'bg-amber-500',
        PAID: 'bg-emerald-500',
        PREPARING: 'bg-amber-500',
        SHIPPED: 'bg-blue-500',
        DELIVERED: 'bg-emerald-500',
        CANCELLED: 'bg-red-500',
        REFUNDED: 'bg-red-500',
    }

    const label = status?.charAt(0) + status?.slice(1).toLowerCase()

    return (
        <span className={`status-badge ${statusMap[status] || 'status-pending'}`}>
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${dotMap[status] || 'bg-gray-400'}`} />
            {label}
        </span>
    )
}

export function RecentOrdersTable({ orders }: { orders: any }) {
    const orderColumns = [
        {
            accessorKey: "orderNumber",
            header: () => <div className="text-xs uppercase tracking-wider text-muted-foreground">Order</div>,
            cell: ({ row }: any) => (
                <div className="font-semibold text-sm">
                    #{row.getValue("orderNumber")}
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: () => <div className="text-xs uppercase tracking-wider text-muted-foreground">Status</div>,
            cell: ({ row }: any) => <StatusBadge status={row.getValue("status")} />,
        },
        {
            accessorKey: "paymentStatus",
            header: () => <div className="text-xs uppercase tracking-wider text-muted-foreground">Payment</div>,
            cell: ({ row }: any) => <StatusBadge status={row.getValue("paymentStatus")} />,
        },
        {
            accessorKey: "totalAmount",
            header: () => <div className="text-xs uppercase tracking-wider text-muted-foreground">Amount</div>,
            cell: ({ row }: any) => {
                const amount = parseFloat(row.getValue("totalAmount"))
                const formatted = new Intl.NumberFormat("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                }).format(amount)
                return <div className="font-semibold text-sm">{formatted}</div>
            },
        },
        {
            accessorKey: "createdAt",
            header: () => <div className="text-xs uppercase tracking-wider text-muted-foreground">Date</div>,
            cell: ({ row }: any) => (
                <div className="text-sm text-muted-foreground">
                    {new Date(row.getValue("createdAt")).toLocaleDateString('tr-TR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                    })}
                </div>
            ),
        },
    ]

    if (!orders || !orders.docs) {
        return (
            <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        )
    }

    if (orders.docs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Package className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <p className="text-sm font-medium text-muted-foreground">No orders yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                    Orders will appear here once customers start purchasing.
                </p>
            </div>
        )
    }

    return <DataTable columns={orderColumns} data={orders.docs as any} />
}
