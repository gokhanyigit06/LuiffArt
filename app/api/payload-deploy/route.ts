import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export const dynamic = 'force-dynamic'

// List of Prisma-created enums that conflict with Payload's own enums
const PRISMA_ENUMS = [
    'Role',
    'Currency',
    'OrderStatus',
    'FulfillmentStatus',
    'PaymentStatus',
    'EventType',
]

// List of Prisma-created tables that conflict with Payload tables
const PRISMA_TABLES = [
    'AnalyticsSummary',
    'ActivityLog',
    'RefundItem',
    'Refund',
    'FulfillmentItem',
    'Fulfillment',
    'OrderEvent',
    'OrderItem',
    'Order',
    'ProductVariant',
    'Product',
    'Category',
    'Address',
    'Coupon',
    'Campaign',
    'User',
    '_prisma_migrations',
]

export async function GET() {
    try {
        const payload = await getPayload({ config: configPromise })
        const adapter = payload.db as any
        const drizzle = adapter.drizzle

        // Step 1: Drop all Prisma-created tables (they conflict with Payload's Drizzle tables)
        console.log('[payload-deploy] Step 1: Dropping conflicting Prisma tables...')
        for (const table of PRISMA_TABLES) {
            try {
                await adapter.execute({ drizzle, raw: `DROP TABLE IF EXISTS "${table}" CASCADE` })
                console.log(`  Dropped table: ${table}`)
            } catch (e: any) {
                console.log(`  Skipped table ${table}: ${e.message}`)
            }
        }

        // Step 2: Drop all Prisma-created enums (these cause interactive prompts)
        console.log('[payload-deploy] Step 2: Dropping conflicting Prisma enums...')
        for (const enumName of PRISMA_ENUMS) {
            try {
                await adapter.execute({ drizzle, raw: `DROP TYPE IF EXISTS "${enumName}" CASCADE` })
                console.log(`  Dropped enum: ${enumName}`)
            } catch (e: any) {
                console.log(`  Skipped enum ${enumName}: ${e.message}`)
            }
        }

        // Step 3: Now run Payload's pushSchema without conflicts
        console.log('[payload-deploy] Step 3: Pushing Payload schema...')
        const { pushSchema } = adapter.requireDrizzleKit()
        const { extensions = {}, tablesFilter } = adapter

        const { apply, hasDataLoss, warnings } = await pushSchema(
            adapter.schema,
            adapter.drizzle,
            adapter.schemaName ? [adapter.schemaName] : undefined,
            tablesFilter,
            extensions.postgis ? ['postgis'] : undefined
        )

        if (warnings.length) {
            console.log('[payload-deploy] Warnings:', warnings)
        }

        // Step 4: Apply the schema
        console.log('[payload-deploy] Step 4: Applying schema...')
        await apply()

        // Step 5: Update migrations table
        console.log('[payload-deploy] Step 5: Updating migrations table...')
        const migrationsTable = adapter.schemaName
            ? `"${adapter.schemaName}"."payload_migrations"`
            : '"payload_migrations"'

        try {
            const result = await adapter.execute({
                drizzle,
                raw: `SELECT * FROM ${migrationsTable} WHERE batch = '-1'`
            })
            const devPush = result.rows

            if (!devPush.length) {
                await drizzle.insert(adapter.tables.payload_migrations).values({
                    name: 'dev',
                    batch: -1
                })
            } else {
                await adapter.execute({
                    drizzle,
                    raw: `UPDATE ${migrationsTable} SET updated_at = CURRENT_TIMESTAMP WHERE batch = '-1'`
                })
            }
        } catch (e: any) {
            console.log('[payload-deploy] Migrations table update skipped:', e.message)
        }

        console.log('[payload-deploy] ✅ Complete! All Payload tables created successfully.')

        return NextResponse.json({
            success: true,
            message: 'Database cleaned and Payload schema pushed successfully! Go to /admin now.',
            warnings: warnings.length ? warnings : 'none',
        })
    } catch (err: any) {
        console.error('[payload-deploy] ❌ Error:', err)
        return NextResponse.json(
            { success: false, error: err?.message || String(err) },
            { status: 500 }
        )
    }
}
