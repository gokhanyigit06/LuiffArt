'use client';

import { useState, useEffect } from 'react';
import { Form, Input, Radio, Button, Checkbox, Select, Divider, Tooltip } from 'antd';
import { useCart } from '@/lib/store/useCart';
import { useRegion } from '@/components/providers/RegionProvider';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { LockOutlined, LoadingOutlined, CheckCircleFilled, QuestionCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutClient() {
    const { items, getTotals, clearCart } = useCart();
    const { region } = useRegion();
    const router = useRouter();
    const [form] = Form.useForm();

    const [shippingCost, setShippingCost] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [shippingCountry, setShippingCountry] = useState(region === 'TR' ? 'Turkey' : 'United States');

    const { total, count } = getTotals(region === 'TR' ? 'TR' : 'GLOBAL');
    const symbol = region === 'TR' ? '₺' : '$';

    // Calculate simulated shipping cost based on cart items
    useEffect(() => {
        if (items.length === 0) return;

        // Mock Navlungo Logic: Base price + (Total Desi * Multiplier)
        const totalDesi = items.reduce((sum, item) => sum + (item.desi * item.quantity), 0);
        const basePrice = region === 'TR' ? 50 : 25; // ₺50 or $25
        const multiplier = region === 'TR' ? 10 : 15; // Cost per desi

        // Free shipping if total > X
        const freeShippingThreshold = region === 'TR' ? 10000 : 500;

        let cost = 0;
        if (total < freeShippingThreshold) {
            cost = basePrice + (totalDesi * multiplier);
        }

        setShippingCost(cost);
    }, [items, total, region]); // Removed 'desi' from dependency array as it is undefined outside of items map

    const finalTotal = total + shippingCost;

    const onFinish = async (values: any) => {
        setIsSubmitting(true);
        console.log('Checkout Form Values:', values);

        // Simulate Payment Processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsSubmitting(false);
        setIsSuccess(true);
        clearCart();
    };

    if (items.length === 0 && !isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
                <div className="text-center">
                    <h2 className="font-italiana text-2xl mb-4">Your cart is empty</h2>
                    <Link href="/collections">
                        <Button type="primary" className="!bg-black !h-12 !px-8 !rounded-none !font-outfit !uppercase">
                            Return to Shop
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen flex items-center justify-center bg-[#fdfbf7] p-4"
            >
                <div className="max-w-md w-full bg-white p-12 text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <CheckCircleFilled className="text-4xl text-green-500" />
                    </motion.div>
                    <h1 className="font-italiana text-4xl mb-2">Thank you!</h1>
                    <p className="font-outfit text-gray-500 mb-8">
                        Your order has been confirmed. You will receive an email shortly.
                    </p>
                    <Link href="/">
                        <Button className="!bg-black !text-white !h-12 !px-8 !rounded-none !font-outfit !uppercase hover:!bg-gray-800 border-none">
                            Continue Shopping
                        </Button>
                    </Link>
                </div>
            </motion.div>
        )
    }

    return (
        <div className="min-h-screen bg-[#fdfbf7] lg:flex lg:flex-row-reverse">

            {/* Right Panel: Order Summary (Sticky on Desktop) */}
            <div className="lg:w-[45%] bg-white/50 backdrop-blur-xl border-l border-white/40 lg:min-h-screen p-6 lg:p-12 relative">
                <div className="sticky top-12 max-w-lg mx-auto">
                    <h2 className="font-italiana text-2xl mb-8 opacity-80 lg:hidden">Order Summary</h2>

                    {/* Cart Items */}
                    <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 mb-8">
                        {items.map(item => (
                            <div key={item.cartItemId} className="flex gap-4 items-center">
                                <div className="relative w-16 h-20 bg-gray-100 flex-shrink-0 border border-black/5">
                                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                                    <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                                        {item.quantity}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-italiana text-gray-900">{item.name}</h4>
                                    <p className="text-xs text-gray-500 font-outfit uppercase">{item.size} / {item.material}</p>
                                </div>
                                <div className="font-outfit font-medium text-gray-900">
                                    {symbol}{(region === 'TR' ? item.priceTRY : item.priceUSD).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <Divider className="!border-gray-200/60" />

                    {/* Cost Breakdown */}
                    <div className="space-y-4 font-outfit text-sm">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>{symbol}{total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span className="flex items-center gap-1">
                                Shipping
                                <Tooltip title="Calculated based on volumetric weight (Desi)">
                                    <QuestionCircleOutlined className="text-gray-400 cursor-help" />
                                </Tooltip>
                            </span>
                            <span>{shippingCost === 0 ? 'Free' : `${symbol}${shippingCost.toFixed(2)}`}</span>
                        </div>
                        <div className="flex justify-between text-xl font-medium text-gray-900 pt-4 border-t border-gray-200/60">
                            <span>Total</span>
                            <span>{symbol}{finalTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Left Panel: Checkout Form */}
            <div className="lg:w-[55%] p-6 lg:p-16 lg:pl-24">
                <div className="max-w-xl mx-auto">
                    <div className="mb-10">
                        <Link href="/" className="font-italiana text-2xl font-bold tracking-tight text-gray-900 hover:opacity-70 transition-opacity">
                            LUIFF ART
                        </Link>

                        <div className="flex items-center gap-2 text-xs font-outfit text-gray-500 mt-6">
                            <span>Cart</span>
                            <span>/</span>
                            <span className="text-black font-medium">Information</span>
                            <span>/</span>
                            <span>Payment</span>
                        </div>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        requiredMark={false}
                        className="checkout-form"
                        initialValues={{
                            country: region === 'TR' ? 'TR' : 'US',
                            paymentMethod: region === 'TR' ? 'iyzico' : 'stripe'
                        }}
                    >
                        <section className="mb-10">
                            <h3 className="font-italiana text-xl mb-6">Contact</h3>
                            <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
                                <Input placeholder="Email Address" className="!h-12 !rounded-none !border-gray-200 focus:!border-black font-outfit" />
                            </Form.Item>
                            <Checkbox className="font-outfit text-gray-600">Email me with news and offers</Checkbox>
                        </section>

                        <section className="mb-10">
                            <h3 className="font-italiana text-xl mb-6">Shipping Address</h3>
                            <Form.Item name="country">
                                <Select
                                    className="!h-12 !rounded-none font-outfit [&_.ant-select-selector]:!border-gray-200 [&_.ant-select-selector]:!rounded-none [&_.ant-select-selector]:!h-12 [&_.ant-select-selector]:!flex [&_.ant-select-selector]:!items-center"
                                    onChange={(val) => setShippingCountry(val)}
                                    options={[
                                        { value: 'TR', label: 'Turkey' },
                                        { value: 'US', label: 'United States' },
                                        { value: 'UK', label: 'United Kingdom' },
                                        { value: 'DE', label: 'Germany' },
                                    ]}
                                />
                            </Form.Item>

                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item name="firstName" rules={[{ required: true, message: 'First name is required' }]}>
                                    <Input placeholder="First Name" className="!h-12 !rounded-none !border-gray-200 focus:!border-black font-outfit" />
                                </Form.Item>
                                <Form.Item name="lastName" rules={[{ required: true, message: 'Last name is required' }]}>
                                    <Input placeholder="Last Name" className="!h-12 !rounded-none !border-gray-200 focus:!border-black font-outfit" />
                                </Form.Item>
                            </div>

                            {/* TC ID for Turkey */}
                            {region === 'TR' && (
                                <Form.Item
                                    name="identityNumber"
                                    rules={[{ required: true, message: 'TC ID is required for invoices' }, { len: 11, message: 'Must be 11 digits' }]}
                                    help={<span className="text-xs text-gray-400">Required for e-invoice generation (Iyzico limitation)</span>}
                                >
                                    <Input placeholder="TC Identity Number (11 digits)" maxLength={11} className="!h-12 !rounded-none !border-gray-200 focus:!border-black font-outfit" />
                                </Form.Item>
                            )}

                            <Form.Item name="address" rules={[{ required: true, message: 'Address is required' }]}>
                                <Input placeholder="Address" className="!h-12 !rounded-none !border-gray-200 focus:!border-black font-outfit" />
                            </Form.Item>

                            <div className="grid grid-cols-3 gap-4">
                                <Form.Item name="city" className="col-span-1" rules={[{ required: true, message: 'Required' }]}>
                                    <Input placeholder="City" className="!h-12 !rounded-none !border-gray-200 focus:!border-black font-outfit" />
                                </Form.Item>
                                <Form.Item name="district" className="col-span-1" rules={[{ required: true, message: 'Required' }]}>
                                    <Input placeholder="District/State" className="!h-12 !rounded-none !border-gray-200 focus:!border-black font-outfit" />
                                </Form.Item>
                                <Form.Item name="zipCode" className="col-span-1" rules={[{ required: true, message: 'Required' }]}>
                                    <Input placeholder="ZIP Code" className="!h-12 !rounded-none !border-gray-200 focus:!border-black font-outfit" />
                                </Form.Item>
                            </div>

                            <Form.Item name="phone" rules={[{ required: true, message: 'Phone is required' }]}>
                                <Input placeholder="Phone Number" className="!h-12 !rounded-none !border-gray-200 focus:!border-black font-outfit" />
                            </Form.Item>
                        </section>

                        <section className="mb-10">
                            <h3 className="font-italiana text-xl mb-6">Payment</h3>
                            <Form.Item name="paymentMethod">
                                <Radio.Group className="w-full flex flex-col gap-3">
                                    <div className={`border p-4 transition-all ${region === 'TR' ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
                                        <Radio value="iyzico" disabled={region !== 'TR'}>
                                            <span className="font-outfit font-medium ml-2">Credit Card (Iyzico Secured)</span>
                                        </Radio>
                                        {region === 'TR' && (
                                            <div className="mt-2 ml-6">
                                                <div className="flex gap-1 h-6">
                                                    <img src="https://sandbox-st.iyzilive.com/assets/images/payment-icons/visa.png" className="h-full" alt="visa" />
                                                    <img src="https://sandbox-st.iyzilive.com/assets/images/payment-icons/mastercard.png" className="h-full" alt="mastercard" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className={`border p-4 transition-all ${region !== 'TR' ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
                                        <Radio value="stripe" disabled={region === 'TR'}>
                                            <span className="font-outfit font-medium ml-2">Credit Card (Stripe)</span>
                                        </Radio>
                                    </div>
                                </Radio.Group>
                            </Form.Item>
                        </section>

                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            loading={isSubmitting}
                            block
                            className="!h-16 !text-lg !font-outfit !uppercase !tracking-[0.2em] !rounded-none !bg-black hover:!bg-gray-800 !border-none shadow-xl mt-4"
                        >
                            {isSubmitting ? 'Processing...' : `Pay ${symbol}${finalTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                        </Button>

                        <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-xs font-outfit">
                            <LockOutlined />
                            <span>Payments are secure and encrypted</span>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}
