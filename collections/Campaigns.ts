import type { CollectionConfig } from 'payload'

export const Campaigns: CollectionConfig = {
    slug: 'campaigns',
    admin: {
        useAsTitle: 'title',
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'slug',
            type: 'text',
            unique: true,
            required: true,
        },
        {
            name: 'isActive',
            type: 'checkbox',
            defaultValue: true,
        },
        {
            name: 'coupon',
            type: 'relationship',
            relationTo: 'coupons',
        }
    ]
}
