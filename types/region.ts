export type Currency = 'TRY' | 'USD';
export type RegionCode = 'TR' | 'GLOBAL';

export interface RegionState {
    currency: Currency;
    region: RegionCode;
}

export const REGION_COOKIE_NAME = 'luiff_region';
