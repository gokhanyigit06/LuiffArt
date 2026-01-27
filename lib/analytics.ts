import { prisma } from "./prisma";
import { EventType } from "@prisma/client";

export async function logActivity({
    userId,
    sessionId,
    productId,
    eventType,
    utmSource,
    metadata,
}: {
    userId?: string;
    sessionId?: string;
    productId?: string;
    eventType: EventType;
    utmSource?: string;
    metadata?: any;
}) {
    try {
        await prisma.activityLog.create({
            data: {
                userId,
                sessionId,
                productId,
                eventType,
                utmSource,
                metadata,
            },
        });
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
}
