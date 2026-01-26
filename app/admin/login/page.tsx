'use client';

import { useState } from 'react';
import { Form, Input, Button, message, ConfigProvider, Divider, Typography } from 'antd';
import { GoogleOutlined, AppleFilled } from '@ant-design/icons';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const result = await signIn('credentials', {
                redirect: false,
                email: values.email,
                password: values.password,
            });

            if (result?.error) {
                message.warning('E-posta veya şifre hatalı.');
            } else {
                message.success('Giriş başarılı');
                const sessionRes = await fetch('/api/auth/session');
                const session = await sessionRes.json();

                if (session?.user?.role === 'ADMIN') {
                    router.push('/admin');
                } else {
                    router.push('/account');
                }
                router.refresh();
            }
        } catch (error) {
            message.error('Sunucu erişim hatası.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#000000',
                    fontFamily: 'var(--font-outfit)',
                    borderRadius: 0,
                    controlHeight: 48,
                },
                components: {
                    Input: {
                        activeBorderColor: '#000000',
                        hoverBorderColor: '#000000',
                        colorBgContainer: 'transparent',
                        borderRadius: 0,
                        paddingInline: 0,
                        colorTextPlaceholder: '#999',
                    },
                    Button: {
                        borderRadius: 0,
                        controlHeight: 48,
                        fontWeight: 700,
                        contentFontSize: 11,
                    }
                }
            }}
        >
            <div style={{ display: 'flex', width: '100%', height: '100vh', overflow: 'hidden', backgroundColor: '#fff' }}>

                {/* LEFT SIDE: FORM (40%) */}
                <div style={{ width: '40%', minWidth: '450px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '6rem', overflowY: 'auto' }}>
                    <div>
                        <div style={{ marginBottom: '4rem' }}>
                            <h1 className="font-italiana" style={{ fontSize: '3.5rem', fontWeight: 700, margin: 0, lineHeight: 1, letterSpacing: '-0.02em' }}>LUIFF ART</h1>
                            <p className="font-outfit" style={{ fontSize: '0.75rem', letterSpacing: '0.3em', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginTop: '0.5rem' }}>Atelier Login</p>
                        </div>

                        <div style={{ marginBottom: '3rem' }}>
                            <h2 className="font-italiana" style={{ fontSize: '1.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2.5rem' }}>Oturum Aç</h2>

                            <Form
                                form={form}
                                name="login-zara-style"
                                onFinish={onFinish}
                                layout="vertical"
                                requiredMark={false}
                                className="zara-form"
                            >
                                <Form.Item
                                    name="email"
                                    label={<span style={{ fontFamily: 'var(--font-outfit)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#999' }}>E-POSTA</span>}
                                    rules={[{ required: true, message: 'Lütfen e-posta giriniz' }]}
                                    style={{ marginBottom: '2rem' }}
                                >
                                    <Input
                                        style={{ borderBottom: '1px solid #e5e7eb', borderTop: 0, borderLeft: 0, borderRight: 0, paddingLeft: 0, fontSize: '14px', fontFamily: 'var(--font-outfit)' }}
                                        className="login-input"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    label={<span style={{ fontFamily: 'var(--font-outfit)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#999' }}>PAROLA</span>}
                                    rules={[{ required: true, message: 'Lütfen parola giriniz' }]}
                                    style={{ marginBottom: '1rem' }}
                                >
                                    <Input.Password
                                        style={{ borderBottom: '1px solid #e5e7eb', borderTop: 0, borderLeft: 0, borderRight: 0, paddingLeft: 0, fontSize: '14px', fontFamily: 'var(--font-outfit)' }}
                                        className="login-input"
                                    />
                                </Form.Item>

                                <div style={{ textAlign: 'right', marginBottom: '2.5rem' }}>
                                    <Link href="/forgot-password">
                                        <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666', borderBottom: '1px solid transparent', cursor: 'pointer' }}>Şifrenizi mi unuttunuz?</span>
                                    </Link>
                                </div>

                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    block
                                    style={{ backgroundColor: '#000', borderColor: '#000', height: '48px', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1rem' }}
                                >
                                    Oturum Aç
                                </Button>

                                <Link href="/register">
                                    <Button
                                        block
                                        style={{ backgroundColor: '#fff', color: '#000', borderColor: '#000', height: '48px', textTransform: 'uppercase', letterSpacing: '0.2em' }}
                                    >
                                        Kaydol
                                    </Button>
                                </Link>
                            </Form>
                        </div>
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                        <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', display: 'block', marginBottom: '1.5rem' }}>Bununla Erişim Sağla</span>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Button block style={{ height: '48px', textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                                <GoogleOutlined style={{ fontSize: '16px' }} /> Google ile Devam Et
                            </Button>
                            <Button block style={{ height: '48px', textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                                <AppleFilled style={{ fontSize: '16px' }} /> Apple ile Devam Et
                            </Button>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: IMAGE (60%) */}
                <div style={{ width: '60%', height: '100%', position: 'relative', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        style={{ width: '100%', height: '100%', position: 'relative' }}
                    >
                        <Image
                            src="/abstract_art_gallery_poster_collage_1769433928991.png"
                            alt="Luiff Art Editorial"
                            fill
                            style={{ objectFit: 'cover' }}
                            priority
                        />
                        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.1)' }} />

                        {/* Quote Overlay */}
                        <div style={{ position: 'absolute', bottom: '4rem', left: '4rem', maxWidth: '400px', color: '#fff', mixBlendMode: 'difference' }}>
                            <p className="font-italiana" style={{ fontSize: '2.5rem', marginBottom: '1rem', lineHeight: 1.2 }}>"Sanat, ruhun arınmasıdır."</p>
                            <p className="font-outfit" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: 700, opacity: 0.8 }}>— LUIFF COLLECTIVE</p>
                        </div>
                    </motion.div>
                </div>

                <style jsx global>{`
                    .login-input:hover, .login-input:focus {
                        border-bottom-color: #000 !important;
                    }
                    /* Hide scrollbar for Chrome, Safari and Opera */
                    ::-webkit-scrollbar {
                        display: none;
                    }
                    /* Hide scrollbar for IE, Edge and Firefox */
                    html {
                        -ms-overflow-style: none;  /* IE and Edge */
                        scrollbar-width: none;  /* Firefox */
                    }
                `}</style>
            </div>
        </ConfigProvider>
    );
}
