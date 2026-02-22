import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { pushDevSchema } from '@payloadcms/drizzle'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        const payload = await getPayload({ config: configPromise });
        const adapter = payload.db;

        console.log("Forcing pushDevSchema on Payload adapter...");
        await pushDevSchema(adapter as any);
        console.log("pushDevSchema completed!");

        return NextResponse.json({
            success: true,
            message: "Payload DB schemas created/pushed successfully. You can now access the /admin panel!"
        });
    } catch (err: any) {
        console.error("Payload Push Error:", err);
        return NextResponse.json({
            success: false,
            error: err?.message || String(err)
        }, { status: 500 });
    }
}
