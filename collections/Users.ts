import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
    slug: 'users',
    auth: true,
    admin: {
        useAsTitle: 'email',
    },
    fields: [
        {
            name: 'name',
            type: 'text',
        },
        {
            name: 'role',
            type: 'select',
            defaultValue: 'USER',
            options: [
                { label: 'User', value: 'USER' },
                { label: 'Admin', value: 'ADMIN' },
            ],
        },
        {
            name: 'phone',
            type: 'text',
        },
        {
            type: 'group',
            name: 'corporateInfo',
            label: 'Corporate Info',
            fields: [
                {
                    name: 'isCorporate',
                    type: 'checkbox',
                    defaultValue: false,
                },
                {
                    name: 'companyName',
                    type: 'text',
                },
                {
                    name: 'taxNumber',
                    type: 'text',
                },
                {
                    name: 'taxOffice',
                    type: 'text',
                },
            ],
        },
    ],
}
