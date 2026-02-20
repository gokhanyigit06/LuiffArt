/* This file is built-in to Payload CMS api setup */
import configPromise from '@/payload.config'
import { REST_GET, REST_OPTIONS, REST_POST, REST_PATCH, REST_DELETE } from '@payloadcms/next/routes'

export const GET = REST_GET(configPromise)
export const POST = REST_POST(configPromise)
export const PATCH = REST_PATCH(configPromise)
export const DELETE = REST_DELETE(configPromise)
export const OPTIONS = REST_OPTIONS(configPromise)
