import CheckoutClient from "@/components/checkout/CheckoutClient";
import { Metadata } from "next";
import { logActivity } from "@/lib/analytics";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { EventType } from "@prisma/client";

export const metadata: Metadata = {
    title: "Checkout - Luiff Art",
    description: "Secure Checkout",
};

export default async function CheckoutPage() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('pulse_session_id')?.value;
    const session = await getServerSession(authOptions);

    // Background logging
    logActivity({
        userId: session?.user?.id,
        sessionId,
        eventType: EventType.CHECKOUT_START,
    }).catch(err => console.error("Failed to log checkout start:", err));

    return (
        <main>
            <CheckoutClient />
        </main>
    );
}
