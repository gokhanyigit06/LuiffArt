import type { CollectionConfig } from 'payload'

export const Coupons: CollectionConfig = {
    slug: 'coupons',
    admin: {
        useAsTitle: 'code',
    },
    fields: [
        {
            name: 'code',
            type: 'text',
            unique: true,
            required: true,
        },
        {
            name: 'type',
            type: 'select',
            required: true,
            options: ['PERCENTAGE', 'FIXED_AMOUNT'],
        },
        {
            name: 'value',
            type: 'number',
            required: true,
        },
        {
            name: 'isActive',
            type: 'checkbox',
            defaultValue: true,
        }
    ]
}
