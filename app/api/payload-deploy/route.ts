import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const payload = await getPayload({ config: configPromise })
        const adapter = payload.db as any

        // Get pushSchema from drizzle-kit via adapter
        const { pushSchema } = adapter.requireDrizzleKit()
        const { extensions = {}, tablesFilter } = adapter

        // Run pushSchema - this returns apply function and warnings
        const { apply, hasDataLoss, warnings } = await pushSchema(
            adapter.schema,
            adapter.drizzle,
            adapter.schemaName ? [adapter.schemaName] : undefined,
            tablesFilter,
            extensions.postgis ? ['postgis'] : undefined
        )

        // Log warnings but auto-accept them
        if (warnings.length) {
            console.log('Schema push warnings:', warnings)
            if (hasDataLoss) {
                console.log('DATA LOSS WARNING detected - auto-accepting for deploy')
            }
        }

        // Apply the schema changes (skip the interactive prompts)
        await apply()

        // Update migrations table
        const migrationsTable = adapter.schemaName
            ? `"${adapter.schemaName}"."payload_migrations"`
            : '"payload_migrations"'
        const drizzle = adapter.drizzle
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

        return NextResponse.json({
            success: true,
            message: 'Payload DB schema pushed successfully! You can now access /admin.',
            warnings: warnings.length ? warnings : 'none'
        })
    } catch (err: any) {
        console.error('Payload Deploy Error:', err)
        return NextResponse.json(
            { success: false, error: err?.message || String(err) },
            { status: 500 }
        )
    }
}
