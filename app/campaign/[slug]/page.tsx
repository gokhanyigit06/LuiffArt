'use client';

import { useEffect, useState, use } from 'react';
import { Typography, Button, message, Spin, Empty, Row, Col } from 'antd';
import { motion } from 'framer-motion';
import { ArrowLeftOutlined, CopyOutlined, ShoppingOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

interface Campaign {
    id: string;
    title: string;
    description: string | null;
    bannerUrl: string | null;
    startDate: string | null;
    endDate: string | null;
    coupon: {
        code: string;
        type: string;
        value: string;
    } | null;
}

export default function CampaignDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                // For now use a search by slug on all campaigns or create a specific endpoint
                const res = await fetch(`/api/admin/campaigns`); // Simplified for demo
                if (res.ok) {
                    const allData = await res.json();
                    const found = allData.find((c: any) => c.slug === slug);
                    setCampaign(found);
                }
            } catch (error) {
                message.error('Campaign not found');
            } finally {
                setLoading(false);
            }
        };
        fetchCampaign();
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <Spin size="large" />
        </div>
    );

    if (!campaign) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
            <Empty description={<span className="text-gray-400">Campaign not found</span>} />
            <Link href="/" className="mt-8">
                <Button ghost icon={<ArrowLeftOutlined />}>Return Home</Button>
            </Link>
        </div>
    );

    const copyCoupon = () => {
        if (campaign.coupon) {
            navigator.clipboard.writeText(campaign.coupon.code);
            message.success('Coupon code copied!');
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            {/* Hero Section / Banner */}
            <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
                {campaign.bannerUrl ? (
                    <Image
                        src={campaign.bannerUrl}
                        alt={campaign.title}
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black" />
                )}

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Title className="!text-white !font-italiana !text-5xl md:!text-7xl !mb-6 tracking-wider">
                            {campaign.title}
                        </Title>
                        <div className="flex items-center justify-center gap-4 text-gray-400 font-outfit uppercase tracking-[0.2em] text-sm">
                            <span>{dayjs(campaign.startDate).format('MMM D')}</span>
                            <span className="w-10 h-[1px] bg-gray-700" />
                            <span>{dayjs(campaign.endDate).format('MMM D, YYYY')}</span>
                        </div>
                    </motion.div>
                </div>
                {/* Gradient Overlay */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050505] to-transparent" />
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-6 py-20">
                <Row gutter={[40, 40]}>
                    <Col xs={24} md={16}>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="font-italiana text-2xl mb-6 text-gray-300">About the Campaign</h3>
                            <Paragraph className="!text-gray-400 !text-lg !leading-relaxed !font-outfit">
                                {campaign.description || "Join us in celebrating this special event with exclusive offers on our premium art collections."}
                            </Paragraph>

                            <div className="mt-12">
                                <Link href="/collections">
                                    <Button
                                        type="primary"
                                        size="large"
                                        icon={<ShoppingOutlined />}
                                        className="!bg-white !text-black !h-14 !px-10 !rounded-full !font-outfit !uppercase !font-bold !tracking-widest border-none hover:!scale-105 transition-transform"
                                    >
                                        Explore Collection
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </Col>

                    {/* Coupon Card */}
                    {campaign.coupon && (
                        <Col xs={24} md={8}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />

                                <Title level={4} className="!text-white !font-italiana !mb-2">Exclusive Offer</Title>
                                <div className="text-4xl font-bold font-outfit text-white mb-6">
                                    {campaign.coupon.type === 'PERCENTAGE' ? `${campaign.coupon.value}%` : `₺${campaign.coupon.value}`}
                                    <span className="text-sm font-light text-gray-500 ml-2 uppercase">Off</span>
                                </div>

                                <div className="space-y-4">
                                    <div
                                        onClick={copyCoupon}
                                        className="group cursor-pointer bg-black/40 border border-dashed border-white/30 p-4 rounded-xl flex items-center justify-between hover:border-white transition-colors"
                                    >
                                        <Text strong className="!text-white !font-mono !text-lg !tracking-widest">
                                            {campaign.coupon.code}
                                        </Text>
                                        <CopyOutlined className="text-gray-500 group-hover:text-white" />
                                    </div>
                                    <Text className="!text-gray-500 !text-[10px] !uppercase !tracking-widest block text-center">
                                        Click to copy code
                                    </Text>
                                </div>
                            </motion.div>
                        </Col>
                    )}
                </Row>
            </div>
        </div>
    );
}
