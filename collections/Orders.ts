import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
    slug: 'orders',
    admin: {
        useAsTitle: 'orderNumber',
    },
    fields: [
        {
            name: 'orderNumber',
            type: 'number',
            unique: true,
            admin: {
                readOnly: true,
            },
        },
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
        },
        {
            name: 'status',
            type: 'select',
            defaultValue: 'PENDING',
            options: ['PENDING', 'PAID', 'PREPARING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'],
        },
        {
            name: 'paymentStatus',
            type: 'select',
            defaultValue: 'PENDING',
            options: ['PENDING', 'AUTHORIZED', 'PAID', 'PARTIALLY_REFUNDED', 'REFUNDED', 'VOIDED'],
        },
        {
            name: 'subtotal',
            type: 'number',
        },
        {
            name: 'totalAmount',
            type: 'number',
        },
        {
            name: 'orderItems',
            type: 'array',
            fields: [
                {
                    name: 'product',
                    type: 'relationship',
                    relationTo: 'products',
                },
                {
                    name: 'quantity',
                    type: 'number',
                },
                {
                    name: 'price',
                    type: 'number',
                },
                {
                    name: 'variantDetails',
                    type: 'json', // Temporarily a JSON payload for size/material info
                }
            ]
        }
    ]
}
