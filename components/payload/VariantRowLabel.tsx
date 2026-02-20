'use client'
import React from 'react'
import { useRowLabel } from '@payloadcms/ui'

export default function VariantRowLabel() {
    const { data, rowNumber } = useRowLabel<{ color?: string; size?: string; priceTRY?: number; sku?: string; image?: any }>()

    const summary = [data?.color, data?.size].filter(Boolean).join(' - ')
    const priceLabel = data?.priceTRY ? `(TRY ${data.priceTRY})` : ''

    return (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {data?.image && (typeof data.image === 'object' && data.image.thumbnailURL) && (
                <img src={data.image.thumbnailURL} alt="variant" style={{ width: '28px', height: '28px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />
            )}
            <span style={{ fontWeight: 'bold' }}>Variant {String(rowNumber).padStart(2, '0')}:</span>
            {summary ? (
                <span>{summary}</span>
            ) : (
                <span style={{ color: '#999', fontStyle: 'italic' }}>New Variant</span>
            )}
            <span style={{ color: '#666' }}>{priceLabel}</span>
            {data?.sku && (
                <span style={{ marginLeft: 'auto', fontSize: '13px', border: '1px solid #ccc', padding: '2px 6px', borderRadius: '4px' }}>
                    SKU: {data.sku}
                </span>
            )}
        </div>
    )
}
