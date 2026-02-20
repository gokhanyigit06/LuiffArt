/* This file is built-in to Payload CMS admin setup */
import configPromise from '@/payload.config'
import { RootPage } from '@payloadcms/next/views'
// @ts-ignore - This file is generated continuously by Payload
import { importMap } from '../importMap.js'

type Args = {
    params: Promise<{
        segments: string[]
    }>
    searchParams: Promise<{
        [key: string]: string | string[]
    }>
}

export default function Page({ params, searchParams }: Args) {
    return RootPage({ config: configPromise, params, searchParams, importMap })
}
