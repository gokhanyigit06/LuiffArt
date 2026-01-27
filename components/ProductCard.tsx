'use client';
import { useRegion } from '@/components/providers/RegionProvider';
import { Button, Tag } from 'antd';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingOutlined } from '@ant-design/icons';
import Link from 'next/link';

export interface ProductCardProps {
    id: string;
    name: string;
    slug: string;
    imageUrl: string;
    categoryName?: string;
    priceTRY: number;
    priceUSD: number;
    variantsCount: number;
}

export default function ProductCard({ id, name, slug, imageUrl, categoryName, priceTRY, priceUSD, variantsCount }: ProductCardProps) {
    const { currency, region } = useRegion();

    // Determine display price
    const displayPrice = region === 'TR' ? priceTRY : priceUSD;
    const symbol = region === 'TR' ? '₺' : '$';

    return (
        <Link href={`/product/${slug}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
                className="group relative cursor-pointer"
            >
                <div className="relative aspect-[3/4] overflow-hidden bg-[#f0f0f0]">
                    {categoryName && (
                        <div className="absolute top-3 left-3 z-10">
                            <Tag variant="filled" className="glass-panel !text-xs !font-outfit !rounded-none !uppercase !px-2 !py-0.5 text-gray-800">
                                {categoryName}
                            </Tag>
                        </div>
                    )}

                    <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="lazy"
                    />

                    {/* Overlay Action */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="flex gap-2">
                            <Button type="primary" block icon={<ShoppingOutlined />} className="!bg-white !text-black !border-none hover:!bg-black hover:!text-white h-10 font-outfit shadow-lg !rounded-none">
                                VIEW DETAILS
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex justify-between items-start px-1">
                    <div>
                        <h3 className="font-italiana text-xl text-[#222] leading-none tracking-tight">{name}</h3>
                        <p className="text-xs text-gray-500 font-outfit mt-1.5 tracking-wide uppercase">
                            {variantsCount > 1 ? `${variantsCount} OPTIONS AVAILABLE` : 'UNIQUE PIECE'}
                        </p>
                    </div>
                    <span className="font-outfit font-medium text-lg text-[#1a1a1a]">
                        {symbol}{displayPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                </div>
            </motion.div>
        </Link>
    );
}
