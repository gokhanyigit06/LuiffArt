'use client';
import { Badge, Button } from 'antd';
import { ShoppingCartOutlined, MenuOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCart } from '@/lib/store/useCart';
import CartDrawer from './CartDrawer';
import { useEffect, useState } from 'react';

export default function Header() {
    const { openCart, items } = useCart();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <>
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4"
            >
                <div className="glass-panel mx-auto max-w-7xl rounded-full px-6 py-3 flex items-center justify-between shadow-sm">
                    {/* Logo */}
                    <Link href="/" className="font-italiana text-2xl font-bold tracking-tight text-gray-900">
                        LUIFF ART
                    </Link>

                    {/* Navigation (Desktop) */}
                    <nav className="hidden md:flex items-center gap-8 font-outfit text-sm font-medium tracking-wide text-gray-600">
                        <Link href="/collections" className="hover:text-black transition-colors">COLLECTIONS</Link>
                        <Link href="/artists" className="hover:text-black transition-colors">ARTISTS</Link>
                        <Link href="/about" className="hover:text-black transition-colors">ABOUT</Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <Badge count={mounted ? totalItems : 0} size="small" offset={[-2, 2]} showZero color="black">
                            <Button
                                type="text"
                                shape="circle"
                                className="hover:bg-black/5"
                                onClick={openCart}
                                icon={<ShoppingCartOutlined style={{ fontSize: '20px' }} />}
                            />
                        </Badge>
                        <Button
                            className="md:hidden hover:bg-black/5"
                            type="text"
                            shape="circle"
                            icon={<MenuOutlined style={{ fontSize: '20px' }} />}
                        />
                    </div>
                </div>
            </motion.header>

            {/* Global Cart Drawer */}
            <CartDrawer />
        </>
    )
}
