"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bookmark, User, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/store/useCart";

export default function Header() {
    const [mounted, setMounted] = useState(false);
    const { items: cartItems, openCart } = useCart();
    const cartCount = cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header
            style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                alignItems: 'center',
                width: '100%',
                height: '96px',
                padding: '0 24px',
                boxSizing: 'border-box',
                backgroundColor: '#ffffff',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                borderBottom: '1px solid #f5f5f5'
            }}
        >
            {/* SOL: Logo */}
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                <Link
                    href="/"
                    style={{
                        fontSize: '20px',
                        fontWeight: 700,
                        letterSpacing: '0.35em',
                        color: '#000000',
                        textTransform: 'uppercase',
                        textDecoration: 'none'
                    }}
                >
                    LUIFF ART
                </Link>
            </div>

            {/* ORTA: Navigasyon */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '80px'
                }}
            >
                <Link
                    href="/category/posterler"
                    style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.4em',
                        color: '#000000',
                        textTransform: 'uppercase',
                        textDecoration: 'none'
                    }}
                >
                    POSTERLER
                </Link>
                <Link
                    href="/category/cerceveler"
                    style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.4em',
                        color: '#000000',
                        textTransform: 'uppercase',
                        textDecoration: 'none'
                    }}
                >
                    ÇERÇEVELER
                </Link>
            </div>

            {/* SAĞ: İkonlar - Bookmark, User, ShoppingBag */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: '20px',
                    paddingRight: '10px'
                }}
            >
                {/* Wishlist */}
                <Link href="/wishlist" style={{ display: 'flex', alignItems: 'center' }}>
                    <Bookmark size={20} color="#000000" strokeWidth={1.2} />
                </Link>

                {/* Account */}
                <Link href="/account" style={{ display: 'flex', alignItems: 'center' }}>
                    <User size={20} color="#000000" strokeWidth={1.2} />
                </Link>

                {/* Shopping Bag / Cart */}
                <div
                    onClick={openCart}
                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                    <ShoppingBag size={20} color="#000000" strokeWidth={1.2} />
                </div>
            </div>

        </header>
    );
}
