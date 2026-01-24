'use client';

import { useState } from 'react';
import { Form, Input, InputNumber, Button, Select, Card, Space, Divider, Upload, message, Radio } from 'antd';
import { PlusOutlined, MinusCircleOutlined, UploadOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { TextArea } = Input;
const { Option } = Select;

export default function NewProductPage() {
    const [form] = Form.useForm();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Initial variant structure
    const initialVariant = {
        size: '50x70',
        material: 'Canvas',
        priceTRY: 0,
        priceUSD: 0,
        stock: 10,
        weight: 1.5,
        desi: 3,
        sku: '' // Auto-gen later
    };

    const onFinish = async (values: any) => {
        setLoading(true);
        console.log('Product Form Values:', values);

        try {
            const response = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                message.success('Product created successfully');
                router.push('/admin/products');
            } else {
                throw new Error('Failed to create product');
            }
        } catch (error) {
            message.error('Error creating product');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-20">
            {/* Header Actions */}
            <div className="flex justify-between items-center mb-6 sticky top-20 z-10 bg-[#f5f5f5]/80 backdrop-blur-sm p-4 rounded-lg">
                <div className="flex items-center gap-4">
                    <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>Back</Button>
                    <h1 className="text-2xl font-bold font-italiana text-gray-800 m-0">Add New Product</h1>
                </div>
                <Space>
                    <Button onClick={() => form.resetFields()}>Discard</Button>
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        loading={loading}
                        onClick={form.submit}
                        className="!bg-black"
                    >
                        Save Product
                    </Button>
                </Space>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    isActive: true,
                    variants: [initialVariant]
                }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card title="Product Details" className="shadow-sm">
                            <Form.Item name="name" label="Title" rules={[{ required: true }]}>
                                <Input placeholder="e.g. Abstract Dreams" className="font-outfit" />
                            </Form.Item>

                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
                                    <Input addonBefore="luiff.art/product/" placeholder="abstract-dreams" className="font-outfit" />
                                </Form.Item>
                                <Form.Item name="categoryId" label="Category">
                                    <Select placeholder="Select Category">
                                        <Option value="cat_default">Abstract Art</Option>
                                        <Option value="cat_modern">Modern</Option>
                                    </Select>
                                </Form.Item>
                            </div>

                            <Form.Item name="description" label="Description">
                                <TextArea rows={6} placeholder="Describe the artwork..." className="font-outfit" />
                            </Form.Item>
                        </Card>

                        <Card title="Media" className="shadow-sm">
                            <Form.Item name="images" className="mb-0">
                                <Upload.Dragger listType="picture-card" maxCount={5} multiple action="/api/admin/upload">
                                    <p className="ant-upload-drag-icon"><UploadOutlined /></p>
                                    <p className="ant-upload-text">Drag images here</p>
                                </Upload.Dragger>
                                <Input.TextArea
                                    placeholder="Or paste Image URLs (comma separated) for MVP"
                                    className="mt-4 font-outfit text-xs"
                                    rows={2}
                                    onChange={(e) => {
                                        // Quick hack to support manual URL entry for MVP
                                        const urls = e.target.value.split(',').map(s => s.trim());
                                        form.setFieldsValue({ manualImages: urls });
                                    }}
                                />
                                <Form.Item name="manualImages" hidden><Input /></Form.Item>
                            </Form.Item>
                        </Card>

                        <Card title="Variants & Pricing" className="shadow-sm">
                            <Form.List name="variants">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }, index) => (
                                            <div key={key} className="relative bg-gray-50 p-4 rounded-md mb-4 border border-gray-200">
                                                <div className="flex justify-between mb-4">
                                                    <h4 className="font-bold text-gray-500">Variant #{index + 1}</h4>
                                                    {fields.length > 1 && (
                                                        <Button type="text" danger icon={<MinusCircleOutlined />} onClick={() => remove(name)} />
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                                    <Form.Item {...restField} name={[name, 'size']} label="Size" rules={[{ required: true }]}>
                                                        <Input placeholder="50x70" />
                                                    </Form.Item>
                                                    <Form.Item {...restField} name={[name, 'material']} label="Material" rules={[{ required: true }]}>
                                                        <Select>
                                                            <Option value="Canvas">Canvas</Option>
                                                            <Option value="Fine Art Paper">Fine Art Paper</Option>
                                                            <Option value="Framed">Framed</Option>
                                                        </Select>
                                                    </Form.Item>
                                                    <Form.Item {...restField} name={[name, 'sku']} label="SKU">
                                                        <Input placeholder="ART-001" />
                                                    </Form.Item>
                                                    <Form.Item {...restField} name={[name, 'stock']} label="Stock">
                                                        <InputNumber min={0} className="w-full" />
                                                    </Form.Item>
                                                </div>

                                                <Divider className="!my-2 text-xs text-gray-400">Pricing</Divider>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <Form.Item {...restField} name={[name, 'priceTRY']} label="Price (TRY)" rules={[{ required: true }]}>
                                                        <InputNumber
                                                            formatter={value => `₺ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                            parser={value => value!.replace(/₺\s?|(,*)/g, '')}
                                                            className="w-full"
                                                        />
                                                    </Form.Item>
                                                    <Form.Item {...restField} name={[name, 'priceUSD']} label="Price (USD)" rules={[{ required: true }]}>
                                                        <InputNumber
                                                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                            parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                                                            className="w-full"
                                                        />
                                                    </Form.Item>
                                                </div>

                                                <Divider className="!my-2 text-xs text-gray-400">Shipping (Navlungo)</Divider>

                                                <div className="grid grid-cols-4 gap-2">
                                                    <Form.Item {...restField} name={[name, 'weight']} label="Kg">
                                                        <InputNumber min={0} step={0.1} className="w-full" />
                                                    </Form.Item>
                                                    <Form.Item {...restField} name={[name, 'desi']} label="Desi" tooltip="Volumetric Weight">
                                                        <InputNumber min={0} step={0.1} className="w-full bg-blue-50/50" />
                                                    </Form.Item>
                                                    <Form.Item {...restField} name={[name, 'width']} label="W (cm)">
                                                        <InputNumber min={0} className="w-full" />
                                                    </Form.Item>
                                                    <Form.Item {...restField} name={[name, 'height']} label="H (cm)">
                                                        <InputNumber min={0} className="w-full" />
                                                    </Form.Item>
                                                </div>
                                            </div>
                                        ))}
                                        <Button type="dashed" onClick={() => add(initialVariant)} block icon={<PlusOutlined />} className="h-12">
                                            Add Another Variant
                                        </Button>
                                    </>
                                )}
                            </Form.List>
                        </Card>
                    </div>

                    {/* Right Column: Settings & SEO */}
                    <div className="space-y-6">
                        <Card title="Status" className="shadow-sm">
                            <Form.Item name="isActive" className="mb-0">
                                <Select>
                                    <Option value={true}>Active</Option>
                                    <Option value={false}>Draft</Option>
                                </Select>
                            </Form.Item>
                        </Card>

                        <Card title="Organization" className="shadow-sm">
                            <Form.Item name="tags" label="Tags">
                                <Select mode="tags" placeholder="modern, abstract, blue" tokenSeparators={[',']} />
                            </Form.Item>
                            <Form.Item name="vendor" label="Vendor">
                                <Input defaultValue="Luiff Art" />
                            </Form.Item>
                        </Card>

                        <Card title="SEO Preview" className="shadow-sm">
                            <Form.Item name="seoTitle" label="Page Title">
                                <Input placeholder="Abstract Dreams - Luiff Art" />
                            </Form.Item>
                            <Form.Item name="seoDesc" label="Meta Description">
                                <TextArea rows={3} maxLength={160} showCount />
                            </Form.Item>
                        </Card>
                    </div>
                </div>
            </Form>
        </div>
    );
}
