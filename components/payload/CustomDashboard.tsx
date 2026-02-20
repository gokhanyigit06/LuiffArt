import React from 'react'
import configPromise from '@/payload.config'
import { getPayload } from 'payload'
// import { DefaultDashboard } from '@payloadcms/next/views' // To keep default elements if needed

export default async function CustomDashboard() {
    const payload = await getPayload({ config: configPromise })

    const orders = await payload.find({
        collection: 'orders',
        depth: 0,
        limit: 10,
        sort: '-createdAt'
    })

    const users = await payload.find({
        collection: 'users',
        depth: 0,
        limit: 1,
    })

    return (
        <div className="custom-dashboard" style={{ padding: '2rem' }}>
            <h1>Luiff Art Analytics & Dashboard</h1>
            <p>Welcome to your customized Payload CMS Dashboard.</p>

            <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
                <div style={{ padding: '2rem', border: '1px solid #ccc', borderRadius: '8px', flex: 1 }}>
                    <h2>Total Orders</h2>
                    <p style={{ fontSize: '3rem', margin: 0 }}>{orders.totalDocs}</p>
                </div>
                <div style={{ padding: '2rem', border: '1px solid #ccc', borderRadius: '8px', flex: 1 }}>
                    <h2>Registered Users</h2>
                    <p style={{ fontSize: '3rem', margin: 0 }}>{users.totalDocs}</p>
                </div>
            </div>

            <h3 style={{ marginTop: '3rem' }}>Recent Orders</h3>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #ccc' }}>
                        <th style={{ padding: '1rem 0' }}>Order Number</th>
                        <th>Status</th>
                        <th>Amount</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.docs.map((order) => (
                        <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '1rem 0' }}>#{order.orderNumber}</td>
                            <td>{order.status}</td>
                            <td>{order.totalAmount}</td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                    {orders.docs.length === 0 && (
                        <tr>
                            <td colSpan={4} style={{ padding: '1rem 0', textAlign: 'center' }}>No orders found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
