'use client'
import React, { useEffect, useState } from 'react'
import { useField, useFormFields } from '@payloadcms/ui'

export default function VariantImageSelect({ path }: { path: string }) {
    const { value, setValue } = useField<string>({ path })
    const imagesField = useFormFields(([fields]) => fields.images)

    const [options, setOptions] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchMedia = async () => {
            if (!imagesField?.value || !Array.isArray(imagesField.value) || imagesField.value.length === 0) {
                setOptions([])
                return
            }

            setLoading(true)
            try {
                // Determine if we have objects or string IDs
                const ids = imagesField.value.map((item: any) => typeof item === 'object' && item?.id ? item.id : item)

                if (ids.length === 0) {
                    setOptions([])
                    setLoading(false)
                    return
                }

                // Call the Payload local API to get the media data for these IDs
                const res = await fetch(`/api/media?where[id][in]=${ids.join(',')}&limit=50`)
                if (res.ok) {
                    const data = await res.json()
                    setOptions(data.docs || [])
                }
            } catch (err) {
                console.error("Error fetching media for variant options:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchMedia()
    }, [imagesField?.value])

    return (
        <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#444' }}>
                Variant Görseli (Yukarıdaki Fotoğraflardan Seçiniz)
            </label>
            {(!imagesField?.value || (Array.isArray(imagesField.value) && imagesField.value.length === 0)) ? (
                <div style={{ fontSize: '13px', color: '#888', padding: '10px', background: '#f9f9f9', borderRadius: '4px', border: '1px dashed #ccc' }}>
                    Önce yukarıdan &quot;Media &amp; Pricing &gt; images&quot; bölümüne ürün fotoğrafları yükleyin/seçin. Yüklediğiniz resimler burada tıklanabilir şekilde sıralanacaktır.
                </div>
            ) : loading ? (
                <div style={{ fontSize: '13px', color: '#888' }}>Resimler yükleniyor...</div>
            ) : options.length === 0 ? (
                <div style={{ fontSize: '13px', color: '#888' }}>Seçili resim bulunamadı. Lütfen değişiklikleri kaydedin veya resimleri yeniden seçin.</div>
            ) : (
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {options.map((opt) => {
                        const isSelected = value === opt.id
                        return (
                            <div
                                key={opt.id}
                                onClick={() => setValue(opt.id)}
                                style={{
                                    width: '64px',
                                    height: '64px',
                                    border: isSelected ? '2px solid #000' : '1px solid #ddd',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                    opacity: isSelected ? 1 : 0.6,
                                    transition: 'all 0.2s',
                                    boxShadow: isSelected ? '0 0 0 2px rgba(0,0,0,0.1)' : 'none'
                                }}
                            >
                                {opt.url ? (
                                    <img src={opt.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={opt.alt || "variant option"} />
                                ) : (
                                    <div style={{ fontSize: '10px', padding: '4px', textAlign: 'center' }}>No image</div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
            {value && (
                <button
                    onClick={(e) => { e.preventDefault(); setValue(null); }}
                    style={{ marginTop: '0.5rem', background: 'transparent', border: 'none', color: '#d9534f', fontSize: '12px', cursor: 'pointer', padding: 0 }}
                >
                    Seçimi Temizle
                </button>
            )}
        </div>
    )
}
