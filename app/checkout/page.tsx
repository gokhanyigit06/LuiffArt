import CheckoutClient from "@/components/checkout/CheckoutClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Checkout - Luiff Art",
    description: "Secure Checkout",
};

export default function CheckoutPage() {
    return (
        <main>
            <CheckoutClient />
        </main>
    );
}
