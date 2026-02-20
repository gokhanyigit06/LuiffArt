import { NextRequest, NextResponse } from "next/server";
import { logActivity } from "@/lib/analytics";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;

        const { productId, eventType, utmSource, metadata, sessionId } = body;

        if (!eventType) {
            return NextResponse.json({ error: "Event type is required" }, { status: 400 });
        }

        await logActivity({
            userId,
            sessionId,
            productId,
            eventType,
            utmSource,
            metadata,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Analytics API error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
