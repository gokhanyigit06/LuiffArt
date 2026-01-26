'use client';

import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { Button, message, Upload, Steps, Card, Spin } from 'antd';
import type { UploadProps } from 'antd';
import { useState } from 'react';

const { Dragger } = Upload;

export default function ImportPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [processing, setProcessing] = useState(false);

    const props: UploadProps = {
        name: 'file',
        multiple: false,
        accept: '.csv',
        action: '/api/admin/import', // We will build this API later
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
                setCurrentStep(1);
                // Trigger simulated processing
                setProcessing(true);
                setTimeout(() => {
                    setProcessing(false);
                    setCurrentStep(2);
                }, 2000);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold font-italiana text-gray-800">Import Products</h1>
            </div>

            <Card className="shadow-sm">
                <Steps
                    orientation="horizontal"
                    current={currentStep}
                    items={[
                        {
                            title: 'Upload CSV',
                            content: 'Shopify format supported',
                        },
                        {
                            title: 'Processing',
                            content: 'Parsing & Validation',
                        },
                        {
                            title: 'Done',
                            content: 'Products created',
                        },
                    ]}
                    className="mb-12"
                />

                {currentStep === 0 && (
                    <div className="max-w-2xl mx-auto py-12">
                        <Dragger {...props} className="!bg-gray-50 !border-gray-200 hover:!border-black">
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined className="text-gray-400" />
                            </p>
                            <p className="ant-upload-text font-outfit text-lg">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint font-outfit text-gray-500">
                                Support for standard Shopify CSV export files.
                                <br />
                                Automatically handles variants based on 'Handle' grouping.
                            </p>
                        </Dragger>
                    </div>
                )}

                {currentStep === 1 && (
                    <div className="py-24 text-center">
                        <Spin size="large" />
                        <p className="mt-4 font-outfit text-gray-600">Analyzing your file...</p>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="py-12 text-center space-y-4">
                        <div className="text-5xl">🎉</div>
                        <h2 className="text-xl font-bold font-italiana">Import Complete!</h2>
                        <p className="text-gray-500">Successfully imported 24 products and 35 variants.</p>
                        <Button type="primary" onClick={() => setCurrentStep(0)} className="!bg-black">Upload Another File</Button>
                    </div>
                )}
            </Card>
        </div>
    );
}
