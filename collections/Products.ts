import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
    slug: 'products',
    admin: {
        useAsTitle: 'name',
    },
    fields: [
        {
            type: 'tabs',
            tabs: [
                {
                    label: 'Product Details',
                    fields: [
                        {
                            type: 'row',
                            fields: [
                                { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
                                { name: 'slug', type: 'text', unique: true, required: true, admin: { width: '50%', description: 'Auto-generated or custom URL slug' } },
                            ]
                        },
                        {
                            name: 'description',
                            type: 'richText',
                        },
                        {
                            type: 'row',
                            fields: [
                                { name: 'category', type: 'relationship', relationTo: 'categories', admin: { width: '50%' } },
                                { name: 'productType', type: 'text', admin: { width: '50%' } },
                            ]
                        },
                        {
                            type: 'row',
                            fields: [
                                { name: 'vendor', type: 'text', admin: { width: '50%' } },
                                { name: 'modelCode', type: 'text', admin: { width: '50%' } },
                            ]
                        },
                        {
                            name: 'isActive',
                            type: 'checkbox',
                            defaultValue: true,
                        },
                    ]
                },
                {
                    label: 'Media & Pricing',
                    fields: [
                        {
                            name: 'images',
                            type: 'relationship',
                            relationTo: 'media',
                            hasMany: true,
                            admin: { description: 'Ürüne ait tüm görselleri (Toplu Seçim) buradan ekleyin.' }
                        },
                        {
                            name: 'variants',
                            type: 'array',
                            admin: {
                                description: 'Manage combinations, sizes, materials and pricing',
                                components: {
                                    RowLabel: '@/components/payload/VariantRowLabel',
                                },
                            },
                            fields: [
                                {
                                    type: 'row',
                                    fields: [
                                        { name: 'color', type: 'text', admin: { width: '33%', description: 'e.g. Black' } },
                                        { name: 'size', type: 'text', admin: { width: '33%', description: 'e.g. 50x70cm' } },
                                        {
                                            name: 'image',
                                            type: 'upload',
                                            relationTo: 'media',
                                            admin: {
                                                width: '34%',
                                                components: {
                                                    Field: '@/components/payload/VariantImageSelect',
                                                }
                                            }
                                        },
                                    ]
                                },
                                {
                                    type: 'row',
                                    fields: [
                                        { name: 'sku', type: 'text', admin: { width: '33%' } },
                                        { name: 'stock', type: 'number', defaultValue: 0, admin: { width: '33%' } },
                                        { name: 'weight', type: 'number', admin: { width: '33%' } },
                                    ]
                                },
                                {
                                    type: 'row',
                                    fields: [
                                        { name: 'priceTRY', type: 'number', required: true, admin: { width: '50%' } },
                                        { name: 'compareAtPriceTRY', type: 'number', admin: { width: '50%' } },
                                    ]
                                },
                                {
                                    type: 'row',
                                    fields: [
                                        { name: 'priceUSD', type: 'number', required: true, admin: { width: '50%' } },
                                        { name: 'compareAtPriceUSD', type: 'number', admin: { width: '50%' } },
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    label: 'Tags & SEO',
                    fields: [
                        {
                            name: 'tags',
                            type: 'array',
                            fields: [
                                { name: 'tag', type: 'text' }
                            ]
                        },
                        {
                            type: 'group',
                            name: 'seo',
                            fields: [
                                { name: 'title', type: 'text' },
                                { name: 'description', type: 'textarea' },
                            ]
                        },
                    ]
                }
            ]
        }
    ],
}
