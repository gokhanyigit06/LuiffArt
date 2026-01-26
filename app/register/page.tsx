'use client';

import { useState } from 'react';
import { Form, Input, Button, message, Checkbox, Steps, ConfigProvider, Radio, Divider } from 'antd';
import {
    UserOutlined, MailOutlined, LockOutlined,
    ArrowRightOutlined, ArrowLeftOutlined,
    HomeOutlined, PhoneOutlined, EnvironmentOutlined,
    BankOutlined, AuditOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function RegisterPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<any>({ isCorporate: false });
    const router = useRouter();
    const [form] = Form.useForm();

    const next = async () => {
        try {
            const values = await form.validateFields();
            setFormData({ ...formData, ...values });
            setCurrentStep(currentStep + 1);
        } catch (error) {
            console.log('Validation failed');
        }
    };

    const prev = () => {
        setCurrentStep(currentStep - 1);
    };

    const onFinish = async (values: any) => {
        const finalData = { ...formData, ...values };
        setLoading(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData),
            });

            const data = await res.json();

            if (res.ok) {
                message.success('Luiff Art dünyasına hoş geldiniz!');
                setTimeout(() => router.push('/admin/login'), 2000);
            } else {
                message.error(data.error || 'Kayıt başarısız');
            }
        } catch (error) {
            message.error('Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    // Watch isCorporate for conditional rendering in the steps
    const isCorporate = Form.useWatch('isCorporate', form) ?? formData.isCorporate;

    const steps = [
        {
            title: 'HESAP',
            content: (
                <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                >
                    <Form.Item name="isCorporate" initialValue={false} className="mb-8">
                        <Radio.Group
                            className="w-full account-toggle-group"
                            buttonStyle="solid"
                        >
                            <Radio.Button value={false} className="flex-1 text-center">BİREYSEL</Radio.Button>
                            <Radio.Button value={true} className="flex-1 text-center">KURUMSAL</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item name="name" rules={[{ required: true, message: 'İsim gereklidir' }]}>
                        <Input prefix={<UserOutlined />} placeholder="Ad Soyad" className="premium-field" />
                    </Form.Item>

                    <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Geçerli bir email giriniz' }]}>
                        <Input prefix={<MailOutlined />} placeholder="E-posta Adresi" className="premium-field" />
                    </Form.Item>

                    <Form.Item name="password" rules={[{ required: true, message: 'Şifre gereklidir' }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="Şifre" className="premium-field" />
                    </Form.Item>
                </motion.div>
            )
        },
        {
            title: 'BİLGİLER',
            content: (
                <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                >
                    <AnimatePresence mode="popLayout">
                        {isCorporate && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-[#f9f8f6] p-5 border border-[#ecebe8] rounded-2xl mb-6"
                            >
                                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block mb-4">Şirket Detayları</span>
                                <Form.Item name="companyName" rules={[{ required: isCorporate, message: 'Şirket adı gereklidir' }]}>
                                    <Input prefix={<BankOutlined />} placeholder="Şirket Adı" className="premium-field !bg-white" />
                                </Form.Item>
                                <div className="grid grid-cols-2 gap-3 mt-3">
                                    <Form.Item name="taxNumber" rules={[{ required: isCorporate, message: 'Vergi no gereklidir' }]}>
                                        <Input prefix={<AuditOutlined />} placeholder="Vergi No" className="premium-field !bg-white" />
                                    </Form.Item>
                                    <Form.Item name="taxOffice" rules={[{ required: isCorporate, message: 'Vergi dairesi gereklidir' }]}>
                                        <Input prefix={<AuditOutlined />} placeholder="Vergi Dairesi" className="premium-field !bg-white" />
                                    </Form.Item>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Form.Item name="phone" rules={[{ required: true, message: 'Telefon gereklidir' }]}>
                        <Input prefix={<PhoneOutlined />} placeholder="Telefon Numarası" className="premium-field" />
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="city" rules={[{ required: true, message: 'Şehir gereklidir' }]}>
                            <Input prefix={<EnvironmentOutlined />} placeholder="Şehir" className="premium-field" />
                        </Form.Item>
                        <Form.Item name="district" rules={[{ required: true, message: 'İlçe gereklidir' }]}>
                            <Input prefix={<HomeOutlined />} placeholder="İlçe" className="premium-field" />
                        </Form.Item>
                    </div>

                    <Form.Item name="address" rules={[{ required: true, message: 'Adres gereklidir' }]}>
                        <Input.TextArea placeholder="Teslimat Adresi" className="premium-field !h-28 pt-4" />
                    </Form.Item>
                </motion.div>
            )
        }
    ];

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#1a1a1a',
                    fontFamily: 'var(--font-outfit)',
                    borderRadius: 4
                }
            }}
        >
            <div className="min-h-screen flex bg-[#fdfbf7] selection:bg-black selection:text-white">

                {/* Left Visual Area */}
                <div className="hidden lg:flex lg:w-[42%] relative h-screen sticky top-0 bg-black overflow-hidden">
                    <Image
                        src="/luxury_art_atelier_background_1769430315556.png"
                        alt="Artier Background"
                        fill
                        className="object-cover opacity-80 scale-105 animate-subtle-drift"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
                    <div className="absolute top-12 left-12 z-20">
                        <Link href="/" className="font-italiana text-3xl font-bold text-white tracking-[0.2em]">LUIFF ART</Link>
                    </div>
                    <div className="absolute bottom-16 left-12 right-12 z-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <h2 className="font-italiana text-5xl text-white mb-6 leading-tight">İlham Veren <br />Yaşam Alanları</h2>
                            <p className="text-gray-300 text-lg font-light max-w-sm leading-relaxed">Luiff Collective'e katılarak özel koleksiyonlara erişim sağlayın.</p>
                        </motion.div>
                    </div>
                </div>

                {/* Right Form Area */}
                <div className="w-full lg:w-[58%] flex flex-col items-center justify-center p-6 md:p-16 lg:p-24 overflow-y-auto bg-[#fdfbf7]">
                    <div className="w-full max-w-[540px]">

                        <div className="mb-12">
                            <span className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-4 block">ADIM {currentStep + 1} / {steps.length}</span>
                            <h1 className="font-italiana text-5xl mb-4 text-gray-900">Elite Kayıt</h1>
                            <p className="text-gray-500 font-light text-lg">Sanat galerisine erişiminiz buradan başlıyor.</p>
                        </div>

                        <div className="mb-14">
                            <Steps
                                current={currentStep}
                                items={steps.map(s => ({ title: s.title }))}
                                className="custom-steps"
                                size="small"
                                responsive={false}
                            />
                        </div>

                        <Form
                            form={form}
                            name="register"
                            layout="vertical"
                            onFinish={onFinish}
                            requiredMark={false}
                            autoComplete="off"
                        >
                            <div className="min-h-[420px]">
                                <AnimatePresence mode="wait">
                                    {steps[currentStep].content}
                                </AnimatePresence>
                            </div>

                            <div className="mt-12 flex flex-col gap-4">
                                <div className="flex gap-4">
                                    {currentStep > 0 ? (
                                        <Button
                                            onClick={prev}
                                            className="!h-16 !px-8 !rounded-2xl !border-[#ecebe8] !text-gray-400 hover:!border-black hover:!text-black transition-all"
                                            icon={<ArrowLeftOutlined />}
                                        />
                                    ) : (
                                        <Link href="/admin/login" className="flex-1">
                                            <Button
                                                block
                                                className="!h-16 !rounded-2xl !border-[#ecebe8] !text-gray-900 !font-bold !uppercase !tracking-widest !text-xs hover:!border-black transition-all"
                                            >
                                                Giriş Yap
                                            </Button>
                                        </Link>
                                    )}

                                    {currentStep < steps.length - 1 ? (
                                        <Button
                                            type="primary"
                                            onClick={next}
                                            className="flex-[2] !h-16 !bg-black !text-white !rounded-2xl !font-bold !uppercase !tracking-[0.2em] !text-xs shadow-2xl hover:!scale-[1.02] active:!scale-[0.98] transition-all"
                                        >
                                            Sonraki Adım <ArrowRightOutlined className="ml-2" />
                                        </Button>
                                    ) : (
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={loading}
                                            className="flex-[2] !h-16 !bg-black !text-white !rounded-2xl !font-bold !uppercase !tracking-[0.2em] !text-xs shadow-2xl hover:!scale-[1.02] active:!scale-[0.98] transition-all"
                                        >
                                            Koleksiyona Katıl
                                        </Button>
                                    )}
                                </div>
                                <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest block mt-4">Tüm verileriniz 256-bit SSL ile korunmaktadır.</p>
                            </div>
                        </Form>
                    </div>
                </div>

                <style jsx global>{`
                    .premium-field {
                        height: 60px !important;
                        border-radius: 16px !important;
                        background: #fdfbf7 !important;
                        border: 1.5px solid #ecebe8 !important;
                        font-family: var(--font-outfit) !important;
                        font-size: 15px !important;
                        transition: all 0.25s ease !important;
                    }
                    .premium-field:hover, .premium-field:focus {
                        border-color: #1a1a1a !important;
                        background: white !important;
                        box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05) !important;
                    }
                    .ant-input-affix-wrapper {
                        padding: 0 20px !important;
                    }
                    .ant-input-prefix {
                        margin-right: 14px !important;
                        color: #d1d5db !important;
                        font-size: 18px !important;
                    }
                    
                    .account-toggle-group .ant-radio-button-wrapper {
                        border: 1.5px solid #ecebe8 !important;
                        height: 52px !important;
                        line-height: 48px !important;
                        font-size: 11px !important;
                        font-weight: 700 !important;
                        letter-spacing: 0.15em !important;
                        background: #fdfbf7 !important;
                        color: #9ca3af !important;
                    }
                    .account-toggle-group .ant-radio-button-wrapper-checked {
                        border-color: #1a1a1a !important;
                        background: #1a1a1a !important;
                        color: white !important;
                    }
                    .account-toggle-group .ant-radio-button-wrapper:first-child {
                        border-radius: 12px 0 0 12px !important;
                    }
                    .account-toggle-group .ant-radio-button-wrapper:last-child {
                        border-radius: 0 12px 12px 0 !important;
                    }
                    
                    .custom-steps .ant-steps-item-title {
                        font-family: var(--font-italiana) !important;
                        font-size: 10px !important;
                        letter-spacing: 0.2em !important;
                        color: #ccc !important;
                        font-weight: 700 !important;
                    }
                    .custom-steps .ant-steps-item-process .ant-steps-item-title {
                        color: #1a1a1a !important;
                    }
                    .custom-steps .ant-steps-item-icon {
                        display: none !important;
                    }
                    .custom-steps .ant-steps-item-tail::after {
                        background-color: #ecebe8 !important;
                    }
                    .custom-steps .ant-steps-item-finish .ant-steps-item-tail::after {
                        background-color: #1a1a1a !important;
                    }
                    
                    @keyframes subtle-drift {
                        0% { transform: scale(1.05) translateX(0); }
                        100% { transform: scale(1.05) translateX(-2%); }
                    }
                    .animate-subtle-drift {
                        animation: subtle-drift 40s infinite alternate ease-in-out;
                    }
                `}</style>
            </div>
        </ConfigProvider>
    );
}
