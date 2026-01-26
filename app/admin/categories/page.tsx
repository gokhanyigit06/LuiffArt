'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

export const dynamic = 'force-dynamic';

interface Category {
    id: string;
    name: string;
    slug: string;
    _count?: {
        products: number;
    };
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [form] = Form.useForm();

    // Kategorileri getir
    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/categories', {
                cache: 'no-store',
                headers: { 'Cache-Control': 'no-cache' }
            });
            const data = await response.json();
            console.log('Fetched categories:', data);
            setCategories(data);
        } catch (error) {
            console.error('Fetch categories error:', error);
            message.error('Kategoriler yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Otomatik slug oluşturma
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        const slug = name
            .toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        form.setFieldsValue({ slug });
    };

    // Modal aç/kapa
    const showModal = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            form.setFieldsValue(category);
        } else {
            setEditingCategory(null);
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        form.resetFields();
    };

    // Kategori kaydet (Ekle veya Güncelle)
    const handleSubmit = async (values: any) => {
        try {
            console.log('Submitting category:', values);

            if (editingCategory) {
                // Güncelle
                const response = await fetch(`/api/admin/categories/${editingCategory.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values),
                });

                if (response.ok) {
                    message.success('Kategori güncellendi');
                    await fetchCategories();
                    handleCancel();
                } else {
                    const errorData = await response.json();
                    message.error(errorData.error || 'Kategori güncellenemedi');
                    console.error('Update error:', errorData);
                }
            } else {
                // Yeni ekle
                const response = await fetch('/api/admin/categories', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values),
                });

                if (response.ok) {
                    const newCategory = await response.json();
                    console.log('Category added:', newCategory);
                    message.success('Kategori eklendi');
                    await fetchCategories();
                    handleCancel();
                } else {
                    const errorData = await response.json();
                    message.error(errorData.error || 'Kategori eklenemedi');
                    console.error('Create error:', errorData);
                }
            }
        } catch (error) {
            console.error('Submit error:', error);
            message.error('Bir hata oluştu');
        }
    };

    // Kategori sil
    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/categories/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                message.success('Kategori silindi');
                fetchCategories();
            } else {
                message.error('Kategori silinemedi');
            }
        } catch (error) {
            message.error('Bir hata oluştu');
        }
    };

    const columns = [
        {
            title: 'Kategori Adı',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug',
        },
        {
            title: 'Ürün Sayısı',
            key: 'productCount',
            render: (record: Category) => record._count?.products || 0,
        },
        {
            title: 'İşlemler',
            key: 'actions',
            render: (record: Category) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => showModal(record)}
                    >
                        Düzenle
                    </Button>
                    <Popconfirm
                        title="Kategoriyi silmek istediğinize emin misiniz?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Evet"
                        cancelText="Hayır"
                    >
                        <Button type="link" danger icon={<DeleteOutlined />}>
                            Sil
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <h1 style={{ fontSize: 24, fontWeight: 'bold' }}>Kategori Yönetimi</h1>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => showModal()}
                >
                    Yeni Kategori Ekle
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={categories}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Kategori Adı"
                        name="name"
                        rules={[{ required: true, message: 'Kategori adı gerekli' }]}
                    >
                        <Input onChange={handleNameChange} />
                    </Form.Item>

                    <Form.Item
                        label="Slug"
                        name="slug"
                        rules={[{ required: true, message: 'Slug gerekli' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {editingCategory ? 'Güncelle' : 'Ekle'}
                            </Button>
                            <Button onClick={handleCancel}>İptal</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
