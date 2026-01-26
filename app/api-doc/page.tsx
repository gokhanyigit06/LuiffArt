'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocPage() {
    return (
        <div style={{ background: '#fff', height: '100vh', overflow: 'auto' }}>
            <SwaggerUI url="/api/doc" />
        </div>
    );
}
