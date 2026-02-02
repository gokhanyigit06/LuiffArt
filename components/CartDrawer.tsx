'use client';

import { Drawer, Button, Empty, Tooltip } from 'antd';
import { useCart } from '@/lib/store/useCart';
import { useRegion } from '@/components/providers/RegionProvider';
import {
    X,
    Trash2,
    ShoppingBag,
    ArrowRight,
    Minus,
    Plus
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function CartDrawer() {
    const { items, isOpen, closeCart, removeFromCart, updateQuantity, getTotals } = useCart();
    const { region } = useRegion();

    const { total, count } = getTotals(region === 'TR' ? 'TR' : 'GLOBAL');
    const symbol = region === 'TR' ? '₺' : '$';

    return (
        <Drawer
            title={
                <div className="flex items-center justify-between">
                    <span className="font-italiana text-2xl tracking-[0.1em] uppercase">Sepetim ({count})</span>
                </div>
            }
            placement="right"
            onClose={closeCart}
            open={isOpen}
            width={450}
            closeIcon={<X className="w-6 h-6 text-gray-400 hover:text-black transition-colors" />}
            classNames={{
                header: '!border-b !border-gray-50 !p-8',
                body: '!p-0 bg-white',
                mask: '!backdrop-blur-sm !bg-black/30'
            }}
            styles={{
                wrapper: { boxShadow: '-20px 0 50px rgba(0,0,0,0.08)' }
            }}
        >
            <div className="flex flex-col h-full">
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    <AnimatePresence initial={false} mode="popLayout">
                        {items.length > 0 ? (
                            items.map((item) => {
                                const price = region === 'TR' ? item.priceTRY : item.priceUSD;
                                return (
                                    <motion.div
                                        key={item.cartItemId}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="group flex gap-6"
                                    >
                                        {/* Image */}
                                        <div className="relative w-24 h-32 flex-shrink-0 bg-gray-50 overflow-hidden rounded-sm">
                                            <Image
                                                src={item.imageUrl}
                                                alt={item.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-outfit text-sm font-semibold text-black uppercase tracking-wider">
                                                        {item.name}
                                                    </h4>
                                                    <button
                                                        onClick={() => removeFromCart(item.cartItemId)}
                                                        className="text-gray-300 hover:text-black transition-colors p-1"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <p className="text-[11px] text-gray-400 font-outfit uppercase tracking-widest">
                                                    {item.size} • {item.material}
                                                </p>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center border border-gray-100 rounded-full px-3 py-1 gap-4">
                                                    <button
                                                        onClick={() => updateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))}
                                                        className="text-gray-400 hover:text-black transition-colors"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="font-outfit text-xs font-medium w-4 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                                        className="text-gray-400 hover:text-black transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <span className="font-outfit font-semibold text-base text-black">
                                                    {symbol}{price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 pt-20">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                                    <ShoppingBag className="w-8 h-8 text-gray-300" />
                                </div>
                                <div>
                                    <p className="font-italiana text-xl text-black">Senin koleksiyonun henüz boş</p>
                                    <p className="font-outfit text-sm text-gray-400 mt-2 max-w-[200px] mx-auto">Keşfetmeye başla ve favori eserlerini buraya ekle.</p>
                                </div>
                                <Link href="/collections" onClick={closeCart}>
                                    <Button className="!h-12 !px-8 !font-outfit !text-[12px] !font-bold !uppercase !tracking-[0.2em] !rounded-none !border-black !text-black hover:!bg-black hover:!text-white transition-all">
                                        Keşfetmeye Başla
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-8 bg-white border-t border-gray-50 shadow-[0_-15px_50px_rgba(0,0,0,0.02)] z-10">
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center">
                                <span className="font-outfit text-xs text-gray-400 uppercase tracking-[0.2em]">Ara Toplam</span>
                                <span className="font-outfit font-semibold text-xl text-black">
                                    {symbol}{total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                            <p className="text-[11px] text-gray-400 font-outfit text-center italic">
                                Kargo ve vergiler ödeme adımında hesaplanacaktır.
                            </p>
                        </div>

                        <Link href="/checkout" onClick={closeCart}>
                            <Button
                                type="primary"
                                block
                                className="!h-16 !text-[13px] !font-outfit !font-bold !uppercase !tracking-[0.3em] !rounded-none !bg-black hover:!bg-gray-900 !border-none shadow-xl group relative overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-4">
                                    Ödemeye Geç <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </Drawer>
    );
}

