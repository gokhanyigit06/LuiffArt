'use client';

import React, { useEffect, useState } from 'react';
import {
    Form, Input, Button, Radio, message,
    ConfigProvider
} from 'antd';
import {
    ArrowRightOutlined
} from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);
    const [isCorporate, setIsCorporate] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (session?.user) {
            fetchProfile();
        }
    }, [session]);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/account/profile');
            if (res.ok) {
                const data = await res.json();
                form.setFieldsValue(data);
                setIsCorporate(data.isCorporate);
            }
        } catch (error) {
            console.error('Profil bilgileri alınamadı');
        }
    };

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const res = await fetch('/api/account/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            });

            if (res.ok) {
                message.success('Küratör profiliniz başarıyla güncellendi');
                await update();
            } else {
                message.error('Bilgiler güncellenirken bir sorun oluştu');
            }
        } catch (error) {
            message.error('Bağlantı hatası');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: 'var(--font-outfit)',
                    borderRadius: 0,
                },
                components: {
                    Input: {
                        borderRadius: 0,
                        controlHeight: 56,
                    },
                    Button: {
                        borderRadius: 0,
                    },
                    Radio: {
                        buttonSolidCheckedBg: '#000',
                    }
                }
            }}
        >
            <div style={{ width: '100%', paddingBottom: '8rem', fontFamily: 'var(--font-outfit)' }}>
                {/* Header */}
                <div style={{
                    marginBottom: '4rem',
                    padding: '0 4rem',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    gap: '3rem',
                    borderBottom: '2px solid #000',
                    paddingBottom: '3rem',
                    paddingTop: '3rem'
                }}>
                    <div>
                        <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            letterSpacing: '0.4em',
                            color: '#000',
                            textTransform: 'uppercase',
                            display: 'block',
                            marginBottom: '1rem'
                        }}>
                            Küratör Ayarları
                        </span>
                        <h1 className="font-italiana" style={{
                            fontSize: 'clamp(3rem, 5vw, 5rem)',
                            margin: 0,
                            color: '#000',
                            lineHeight: 0.9,
                            letterSpacing: '-0.02em',
                            fontWeight: 400
                        }}>
                            PROFİL
                        </h1>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', padding: '0 4rem', gap: '4rem' }}>

                    {/* Main Form Area */}
                    <div style={{ width: '100%', maxWidth: '800px' }}>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            onValuesChange={(changed) => {
                                if (changed.hasOwnProperty('isCorporate')) {
                                    setIsCorporate(changed.isCorporate);
                                }
                            }}
                            requiredMark={false}
                            className="luxury-form"
                        >
                            <div style={{ marginBottom: '6rem' }}>
                                {/* Personal Info Section */}
                                <section style={{ marginBottom: '6rem' }}>
                                    <h3 style={{
                                        fontFamily: 'var(--font-italiana)',
                                        fontSize: '2rem',
                                        marginBottom: '3rem',
                                        color: '#000',
                                        textTransform: 'uppercase'
                                    }}>
                                        KİMLİK BİLGİLERİ
                                    </h3>

                                    <div style={{ display: 'grid', gap: '2rem' }}>
                                        <Form.Item name="name" label="TAM İSİM" rules={[{ required: true }]}>
                                            <Input className="sharp-input" placeholder="Ad Soyad" />
                                        </Form.Item>

                                        <Form.Item name="email" label="E-POSTA ADRESİ">
                                            <Input disabled className="sharp-input !bg-gray-50 !text-gray-500" />
                                        </Form.Item>

                                        <Form.Item name="phone" label="İLETİŞİM NUMARASI">
                                            <Input className="sharp-input" placeholder="+90 ..." />
                                        </Form.Item>
                                    </div>
                                </section>

                                {/* Corporate Info Section */}
                                <section>
                                    <h3 style={{
                                        fontFamily: 'var(--font-italiana)',
                                        fontSize: '2rem',
                                        marginBottom: '3rem',
                                        color: '#000',
                                        textTransform: 'uppercase'
                                    }}>
                                        FATURA TERCİHLERİ
                                    </h3>

                                    <div style={{ border: '2px solid #000', padding: '3rem', backgroundColor: '#fff' }}>
                                        <Form.Item name="isCorporate" className="mb-10">
                                            <Radio.Group className="w-full flex" style={{ gap: '2rem' }}>
                                                <Radio value={false} className="luxury-radio">BİREYSEL FATURA</Radio>
                                                <Radio value={true} className="luxury-radio">KURUMSAL FATURA</Radio>
                                            </Radio.Group>
                                        </Form.Item>

                                        <AnimatePresence mode="wait">
                                            {isCorporate && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="overflow-hidden space-y-8 pt-4"
                                                >
                                                    <Form.Item name="companyName" label="ŞİRKET UNVANI" rules={[{ required: isCorporate }]}>
                                                        <Input className="sharp-input" />
                                                    </Form.Item>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                                        <Form.Item name="taxNumber" label="VERGİ NO" rules={[{ required: isCorporate }]}>
                                                            <Input className="sharp-input" />
                                                        </Form.Item>
                                                        <Form.Item name="taxOffice" label="VERGİ DAİRESİ" rules={[{ required: isCorporate }]}>
                                                            <Input className="sharp-input" />
                                                        </Form.Item>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </section>

                                {/* Action Area */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4rem' }}>
                                    <Button
                                        htmlType="submit"
                                        loading={loading}
                                        style={{
                                            height: '64px',
                                            padding: '0 64px',
                                            backgroundColor: '#000',
                                            color: '#fff',
                                            border: 'none',
                                            fontWeight: 700,
                                            fontSize: '0.75rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.2em',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem'
                                        }}
                                        className="hover:!bg-gray-800 transition-all"
                                    >
                                        DEĞİŞİKLİKLERİ KAYDET <ArrowRightOutlined />
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </div>

                </div>

                <style jsx global>{`
                    .sharp-input {
                        border-radius: 0 !important;
                        border: none !important;
                        border-bottom: 2px solid #e5e7eb !important;
                        padding-left: 0 !important;
                        font-family: var(--font-outfit) !important;
                        font-size: 1rem !important;
                        background: transparent !important;
                    }
                    .sharp-input:hover, .sharp-input:focus {
                        border-bottom-color: #000 !important;
                        box-shadow: none !important;
                    }
                    .luxury-form .ant-form-item-label label {
                        font-size: 0.65rem !important;
                        font-weight: 800 !important;
                        letter-spacing: 0.2rem !important;
                        color: #9ca3af !important;
                        text-transform: uppercase !important;
                    }
                    .luxury-radio .ant-radio-inner {
                        border-radius: 0 !important; /* SQUARE Radio */
                        border-color: #000 !important;
                    }
                    .luxury-radio .ant-radio-checked .ant-radio-inner {
                        background-color: #000 !important;
                        border-color: #000 !important;
                    }
                    .luxury-radio .ant-radio-checked .ant-radio-inner::after {
                        background-color: #fff !important;
                    }
                    .luxury-radio span {
                        font-family: var(--font-outfit) !important;
                        font-weight: 700 !important;
                        letter-spacing: 0.1em !important;
                        font-size: 0.75rem !important;
                        color: #000 !important;
                    }
                `}</style>
            </div>
        </ConfigProvider>
    );
}
