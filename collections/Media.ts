import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
    slug: 'media',
    admin: {
        useAsTitle: 'alt',
    },
    upload: {
        staticDir: 'public/media',
        imageSizes: [
            {
                name: 'thumbnail',
                width: 400,
                height: 300,
                position: 'centre',
            },
            {
                name: 'card',
                width: 768,
                height: 1024,
                position: 'centre',
            },
            {
                name: 'tablet',
                width: 1024,
                height: undefined,
                position: 'centre',
            },
        ],
        adminThumbnail: 'thumbnail',
        mimeTypes: ['image/*'],
    },
    hooks: {
        beforeChange: [
            ({ data, req, operation }) => {
                if (operation === 'create' || operation === 'update') {
                    if (!data.alt && data.filename) {
                        let name = data.filename.split('.').slice(0, -1).join('.')
                        name = name.replace(/[-_]/g, ' ')
                        data.alt = name.replace(/\b\w/g, (c: string) => c.toUpperCase())
                    } else if (!data.alt) {
                        data.alt = 'Uploaded Image'
                    }
                }
                return data
            }
        ]
    },
    fields: [
        {
            name: 'alt',
            type: 'text',
        },
    ],
}
