'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Button } from 'antd';
import { useRegion } from '@/components/providers/RegionProvider';
import Image from 'next/image';

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
    const textScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.3]);
    const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const { region } = useRegion();

    return (
        <div ref={containerRef} className="relative h-[150vh] bg-[#fdfbf7] overflow-hidden">
            {/* Background Floating Posters */}
            <motion.div
                style={{ y: y1 }}
                className="absolute top-20 left-[10%] w-[300px] h-[450px] z-10 glass-panel opacity-90 hidden md:block overflow-hidden relative"
            >
                <Image
                    src="https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=2670&auto=format&fit=crop"
                    alt="Abstract Art 1"
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 300px"
                />
            </motion.div>

            <motion.div
                style={{ y: y2 }}
                className="absolute top-40 right-[15%] w-[280px] h-[400px] z-10 glass-panel opacity-90 hidden md:block overflow-hidden relative"
            >
                <Image
                    src="https://images.unsplash.com/photo-1549887552-93f8efb0818e?q=80&w=2670&auto=format&fit=crop"
                    alt="Abstract Art 2"
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 280px"
                />
            </motion.div>

            {/* Main Hero Content */}
            <div className="sticky top-0 h-screen flex flex-col items-center justify-center text-center px-4 z-20">
                <motion.div style={{ scale: textScale, opacity: textOpacity }}>
                    <h1 className="font-italiana text-[12vw] leading-none text-[#1a1a1a] select-none tracking-tighter">
                        LUIFF ART
                    </h1>
                    <p className="font-outfit text-xl md:text-2xl mt-4 font-light tracking-wide text-gray-600">
                        MODERN • TIMELESS • {region === 'TR' ? 'TURKEY' : 'GLOBAL'}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 flex gap-6"
                >
                    <Button
                        size="large"
                        className="!h-14 !px-10 !rounded-none !bg-black !text-white !border-black hover:!bg-transparent hover:!text-black transition-all duration-500 font-outfit"
                    >
                        SHOP COLLECTION
                    </Button>
                    <Button
                        size="large"
                        className="!h-14 !px-10 !rounded-none !bg-transparent !text-black !border-black hover:!bg-black hover:!text-white transition-all duration-500 font-outfit"
                    >
                        VIEW GALLERY
                    </Button>
                </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#fdfbf7] to-transparent"></div>
            </div>
        </div>
    );
}
