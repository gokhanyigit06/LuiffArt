'use client';

import { Drawer, Button, Empty, Tooltip } from 'antd';
import { useCart } from '@/lib/store/useCart';
import { useRegion } from '@/components/providers/RegionProvider';
import { CloseOutlined, DeleteOutlined, ShoppingOutlined, ArrowRightOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function CartDrawer() {
    const { items, isOpen, closeCart, removeFromCart, getTotals } = useCart();
    const { region } = useRegion();

    const { total, count } = getTotals(region === 'TR' ? 'TR' : 'GLOBAL');
    const symbol = region === 'TR' ? '₺' : '$';

    return (
        <Drawer
            title={
                <div className="flex items-center justify-between px-2">
                    <span className="font-italiana text-2xl tracking-wide">MY COLLECTION ({count})</span>
                </div>
            }
            placement="right"
            onClose={closeCart}
            open={isOpen}
            width={450}
            closeIcon={<CloseOutlined className="text-lg hover:rotate-90 transition-transform duration-300" />}
            classNames={{
                header: '!border-b !border-gray-100 !p-6',
                body: '!p-0 !bg-[#fdfbf7]',
                mask: '!backdrop-blur-sm !bg-black/20'
            }}
            styles={{
                wrapper: { boxShadow: '-10px 0 30px rgba(0,0,0,0.05)' }
            }}
        >
            <div className="flex flex-col h-full">
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <AnimatePresence initial={false}>
                        {items.length > 0 ? (
                            items.map((item) => {
                                const price = region === 'TR' ? item.priceTRY : item.priceUSD;
                                return (
                                    <motion.div
                                        key={item.cartItemId}
                                        layout
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                                        className="flex gap-4 bg-white p-4 border border-gray-100 shadow-sm"
                                    >
                                        {/* Image */}
                                        <div className="relative w-20 h-28 flex-shrink-0 bg-gray-100">
                                            <Image
                                                src={item.imageUrl}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-italiana text-lg text-gray-900 leading-tight pr-4">
                                                        {item.name}
                                                    </h4>
                                                    <Tooltip title="Remove">
                                                        <button
                                                            onClick={() => removeFromCart(item.cartItemId)}
                                                            className="text-gray-300 hover:text-red-500 transition-colors"
                                                        >
                                                            <DeleteOutlined />
                                                        </button>
                                                    </Tooltip>
                                                </div>
                                                <p className="text-xs text-gray-500 font-outfit uppercase tracking-wider mt-1">
                                                    {item.size} • {item.material}
                                                </p>
                                            </div>

                                            <div className="flex justify-between items-end mt-2">
                                                <span className="font-outfit text-sm text-gray-400">
                                                    Qty: {item.quantity}
                                                </span>
                                                <span className="font-outfit font-medium text-lg text-gray-900">
                                                    {symbol}{price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-60">
                                <ShoppingOutlined style={{ fontSize: 64 }} className="text-gray-300" />
                                <div>
                                    <p className="font-italiana text-xl text-gray-500">Your collection is empty</p>
                                    <p className="font-outfit text-sm text-gray-400 mt-2">Discover unique artworks to add.</p>
                                </div>
                                <Link href="/collections" onClick={closeCart}>
                                    <Button type="default" className="!font-outfit !uppercase !tracking-widest !rounded-none !px-8 hover:!border-black hover:!text-black">
                                        Start Exploring
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] z-10">
                        <div className="flex justify-between items-center mb-6">
                            <span className="font-outfit text-sm text-gray-500 uppercase tracking-widest">Subtotal</span>
                            <span className="font-outfit font-medium text-2xl text-gray-900">
                                {symbol}{total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                        </div>

                        <p className="text-xs text-gray-400 font-outfit mb-6 text-center">
                            Shipping & taxes calculated at checkout.
                        </p>

                        <Link href="/checkout" onClick={closeCart}>
                            <Button
                                type="primary"
                                size="large"
                                block
                                className="!h-16 !text-lg !font-outfit !uppercase !tracking-[0.2em] !rounded-none !bg-black hover:!bg-gray-800 !border-none shadow-lg group relative overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    Checkout <ArrowRightOutlined className="group-hover:translate-x-1 transition-transform" />
                                </span>
                                {/* Linear Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </Drawer>
    );
}
