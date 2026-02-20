import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import { Users } from './collections/Users'
import { Categories } from './collections/Categories'
import { Products } from './collections/Products'
import { Orders } from './collections/Orders'
import { Coupons } from './collections/Coupons'
import { Campaigns } from './collections/Campaigns'
import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
    admin: {
        user: Users.slug,
        importMap: { baseDir: path.resolve(dirname) },
        components: {
            views: {
                dashboard: {
                    Component: '@/components/payload/CustomDashboard',
                },
                importView: {
                    Component: '@/components/payload/CustomImportView',
                    path: '/import',
                }
            },
        },
    },
    editor: lexicalEditor({}),
    collections: [Users, Categories, Products, Orders, Coupons, Campaigns, Media],
    secret: process.env.PAYLOAD_SECRET || 'lufif-art-secret-key-32-chars-long',
    db: postgresAdapter({
        pool: {
            connectionString: process.env.DATABASE_URL || 'postgresql://placeholder:placeholder@localhost:5432/placeholder',
        },
    }),
    typescript: {
        outputFile: path.resolve(dirname, 'payload-types.ts'),
    },
})
