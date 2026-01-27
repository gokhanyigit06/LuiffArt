'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Button, Tag, Divider, message } from 'antd';
import { ShoppingCartOutlined, CheckOutlined } from '@ant-design/icons';
import { useRegion } from '@/components/providers/RegionProvider';
import { useCart } from '@/lib/store/useCart';
import type { Product, ProductVariant, Category } from '@prisma/client';

interface ProductDetailProps {
    product: Product & {
        variants: (Omit<ProductVariant, 'priceTRY' | 'priceUSD'> & {
            priceTRY: number;
            priceUSD: number;
            desi?: number | null;
            images: string[];
        })[];
        category: Category | null;
    };
}

export default function ProductDetailClient({ product }: ProductDetailProps) {
    const { region, currency } = useRegion();

    // Extract unique options and sort them
    const sizes = useMemo(() => {
        const uniqueSizes = Array.from(new Set(product.variants.map(v => v.size)));
        return uniqueSizes.sort((a, b) => {
            const sizeA = parseInt(a.split(' ')[0] || '0');
            const sizeB = parseInt(b.split(' ')[0] || '0');
            return sizeA - sizeB;
        });
    }, [product.variants]);

    const materials = useMemo(() => {
        const uniqueMaterials = Array.from(new Set(product.variants.map(v => v.material)));
        const order = ['Çok Renkli', 'Çerçevesiz', 'Siyah', 'Beyaz', 'Ahşap'];

        return uniqueMaterials.sort((a, b) => {
            let indexA = order.findIndex(o => a.includes(o));
            let indexB = order.findIndex(o => b.includes(o));

            // Eğer listede yoksa sona at
            if (indexA === -1) indexA = 99;
            if (indexB === -1) indexB = 99;

            return indexA - indexB;
        });
    }, [product.variants]);

    // Initial state (select first availability)
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedMaterial, setSelectedMaterial] = useState<string>('');

    useEffect(() => {
        if (sizes.length > 0 && !selectedSize) setSelectedSize(sizes[0]);
        if (materials.length > 0 && !selectedMaterial) setSelectedMaterial(materials[0]);
    }, [sizes, materials, selectedSize, selectedMaterial]);

    const [isAdding, setIsAdding] = useState(false);

    // Cart Hook
    const { addToCart, openCart } = useCart();

    // Find active variant
    const currentVariant = useMemo(() => {
        return product.variants.find(
            v => v.size === selectedSize && v.material === selectedMaterial
        );
    }, [product.variants, selectedSize, selectedMaterial]);

    // Handle cart action
    const handleAddToCart = async () => {
        if (!currentVariant) return;

        setIsAdding(true);

        addToCart({
            productId: product.id,
            variantId: currentVariant.id,
            name: product.name,
            slug: product.slug,
            imageUrl: product.images[0] || '',
            size: currentVariant.size,
            material: currentVariant.material,
            priceTRY: Number(currentVariant.priceTRY),
            priceUSD: Number(currentVariant.priceUSD),
            desi: currentVariant.desi || 0,
            weight: currentVariant.weight || 0,
            quantity: 1
        });

        // Log Activity
        fetch('/api/analytics/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productId: product.id,
                eventType: 'ADD_TO_CART',
                metadata: {
                    variantId: currentVariant.id,
                    size: currentVariant.size,
                    material: currentVariant.material,
                    price: region === 'TR' ? currentVariant.priceTRY : currentVariant.priceUSD,
                    currency: region === 'TR' ? 'TRY' : 'USD'
                }
            })
        }).catch(err => console.error('Failed to log cart activity:', err));

        setIsAdding(false);
        openCart();
    };

    // Variant image selection
    const displayedImage = useMemo(() => {
        if (currentVariant && currentVariant.images && currentVariant.images.length > 0) {
            return currentVariant.images[0];
        }
        return product.images[0] || 'https://placehold.co/800x1000';
    }, [currentVariant, product.images]);

    const price = region === 'TR' ? currentVariant?.priceTRY : currentVariant?.priceUSD;
    const symbol = region === 'TR' ? '₺' : '$';

    if (!product) return null;

    return (
        <div className="min-h-screen bg-[#fdfbf7] pt-24 pb-12">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Side - Sticky Image Gallery */}
                    <div className="lg:col-span-7 relative">
                        <div className="sticky top-28 h-[calc(100vh-160px)] min-h-[500px] w-full bg-[#f0f0f0] overflow-hidden">
                            <motion.div
                                key={displayedImage} // Re-animate on image change
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                                className="w-full h-full relative"
                            >
                                <Image
                                    src={displayedImage}
                                    alt={product.name}
                                    fill
                                    priority
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 60vw"
                                />
                            </motion.div>
                        </div>
                    </div>

                    {/* Right Side - Product Details */}
                    <div className="lg:col-span-5 flex flex-col justify-center">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="glass-panel p-8 md:p-12 backdrop-blur-xl border border-white/20"
                        >
                            {/* Header */}
                            {product.category && (
                                <span className="font-outfit text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase mb-3 block">
                                    {product.category.name}
                                </span>
                            )}
                            <h1 className="font-italiana text-4xl md:text-5xl text-gray-900 mb-6 leading-tight">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-4 mb-8">
                                <span className="font-outfit text-3xl font-medium text-gray-900">
                                    {price ? `${symbol}${Number(price).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 'Unavailable'}
                                </span>
                                {currentVariant && currentVariant.stock > 0 && (
                                    <Tag color="green" className="!font-outfit !rounded-none !uppercase !px-2">In Stock</Tag>
                                )}
                            </div>

                            <Divider className="!my-8" />

                            {/* Selectors */}
                            <div className="space-y-8">
                                {/* Material Selector */}
                                <div>
                                    <h3 className="font-outfit text-sm font-semibold uppercase tracking-wider text-gray-900 mb-3">
                                        Material
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {materials.map(mat => (
                                            <div
                                                key={mat}
                                                onClick={() => setSelectedMaterial(mat)}
                                                className={`
                                                    cursor-pointer px-4 py-3 border transition-all duration-300 font-outfit text-sm
                                                    ${selectedMaterial === mat
                                                        ? 'border-black bg-black text-white'
                                                        : 'border-gray-200 text-gray-600 hover:border-gray-400'
                                                    }
                                                `}
                                            >
                                                {mat}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Size Selector */}
                                <div>
                                    <h3 className="font-outfit text-sm font-semibold uppercase tracking-wider text-gray-900 mb-3">
                                        Size (cm)
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {sizes.map(size => (
                                            <div
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`
                                                    cursor-pointer px-4 py-3 border transition-all duration-300 font-outfit text-sm
                                                    ${selectedSize === size
                                                        ? 'border-black bg-black text-white'
                                                        : 'border-gray-200 text-gray-600 hover:border-gray-400'
                                                    }
                                                `}
                                            >
                                                {size}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2 font-outfit">
                                        * Calculated shipping weight: {currentVariant?.weight}kg
                                    </p>
                                </div>
                            </div>

                            <Divider className="!my-8" />

                            {/* Actions */}
                            <div className="flex flex-col gap-4">
                                <motion.div whileTap={{ scale: 0.98 }}>
                                    <Button
                                        type="primary"
                                        size="large"
                                        block
                                        loading={isAdding}
                                        onClick={handleAddToCart}
                                        disabled={!currentVariant || currentVariant.stock <= 0}
                                        icon={isAdding ? <CheckOutlined /> : <ShoppingCartOutlined />}
                                        className="!h-14 !text-base !font-outfit !uppercase !tracking-widest !rounded-none !bg-black hover:!bg-gray-800 !border-none shadow-xl"
                                    >
                                        {isAdding ? 'Added to Cart' : 'Add to Collection'}
                                    </Button>
                                </motion.div>
                                <p className="text-center text-xs text-gray-500 font-outfit mt-2">
                                    Free worldwide shipping on original artworks.
                                </p>
                            </div>

                            {/* Description */}
                            <div className="mt-12 prose prose-sm max-w-none text-gray-600 font-outfit">
                                <h3 className="text-gray-900 uppercase tracking-widest text-sm font-semibold">About the Artwork</h3>
                                <p>{product.description}</p>
                            </div>

                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
