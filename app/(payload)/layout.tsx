/* This file is built-in to Payload CMS setup */
import '@payloadcms/next/css'
import configPromise from '@/payload.config'
import { RootLayout as PayloadRootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import React from 'react'

// @ts-ignore
import { importMap } from './admin/importMap.js'

const serverFunction = async function (args: any) {
    'use server'
    return handleServerFunctions({
        ...args,
        config: configPromise,
        importMap,
    })
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <PayloadRootLayout config={configPromise} serverFunction={serverFunction} importMap={importMap}>
                    {children}
                </PayloadRootLayout>
            </body>
        </html>
    )
}
