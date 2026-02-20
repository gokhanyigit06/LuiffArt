'use client'
import React, { useState } from 'react'

export default function CustomImportView() {
    const [file, setFile] = useState<File | null>(null)
    const [status, setStatus] = useState<string>('')

    const handleUpload = async () => {
        if (!file) {
            setStatus('Please select an Excel or CSV file first.')
            return
        }

        setStatus('Uploading and parsing products... (This may take a while depending on file size)')

        // Create FormData 
        const formData = new FormData()
        formData.append('file', file)

        try {
            // In Phase 4, we will hook this up to our Next.js API route that handles server-side parsing.
            const res = await fetch('/api-old/admin/upload', {
                method: 'POST',
                body: formData,
            })

            if (res.ok) {
                setStatus('Successfully imported products! Check the Products tab.')
            } else {
                const err = await res.json()
                setStatus(`Import failed: ${err.message || 'Unknown error'}`)
            }
        } catch (e: any) {
            setStatus(`Import error: ${e.message}`)
        }
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Bulk Import Products</h1>
            <p style={{ marginTop: '1rem', marginBottom: '2rem' }}>
                Upload a CSV or Excel file containing Trendyol export data or custom product schemas. The system will automatically parse and create/update products and variants.
            </p>

            <div style={{
                border: '2px dashed #ccc',
                padding: '3rem',
                borderRadius: '8px',
                textAlign: 'center',
                background: '#fafafa',
                color: '#333'
            }}>
                <input
                    type="file"
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    style={{ marginBottom: '2rem', display: 'block', margin: '0 auto 1.5rem auto' }}
                />
                <button
                    onClick={handleUpload}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: 'black',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '1rem',
                        cursor: 'pointer'
                    }}
                >
                    Start Import
                </button>
            </div>

            {status && (
                <div style={{
                    marginTop: '2rem',
                    padding: '1rem',
                    borderRadius: '4px',
                    backgroundColor: status.includes('failed') || status.includes('error') ? '#fee2e2' : '#dcfce7',
                    color: status.includes('failed') || status.includes('error') ? '#991b1b' : '#166534',
                }}>
                    {status}
                </div>
            )}
        </div>
    )
}
