'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Currency, RegionCode, RegionState, REGION_COOKIE_NAME } from '@/types/region';
import { message } from 'antd';

interface RegionContextType extends RegionState {
    setRegion: (region: RegionCode) => void;
    isLoading: boolean;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export function RegionProvider({
    children,
    initialRegion = 'GLOBAL'
}: {
    children: React.ReactNode;
    initialRegion?: RegionCode;
}) {
    const [region, setRegionState] = useState<RegionCode>(initialRegion);
    const [currency, setCurrency] = useState<Currency>(initialRegion === 'TR' ? 'TRY' : 'USD');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Update currency when region changes
        setCurrency(region === 'TR' ? 'TRY' : 'USD');
    }, [region]);

    const changeRegion = (newRegion: RegionCode) => {
        setIsLoading(true);
        setRegionState(newRegion);

        // Update cookie
        document.cookie = `${REGION_COOKIE_NAME}=${newRegion}; path=/; max-age=${60 * 60 * 24 * 365}`;

        // Optional: Reload to refresh server-side data fetching needs
        // window.location.reload(); 

        message.success(`Region changed to ${newRegion === 'TR' ? 'Turkey' : 'International'}`);
        setIsLoading(false);
    };

    return (
        <RegionContext.Provider value={{ region, currency, setRegion: changeRegion, isLoading }}>
            {children}
        </RegionContext.Provider>
    );
}

export function useRegion() {
    const context = useContext(RegionContext);
    if (context === undefined) {
        throw new Error('useRegion must be used within a RegionProvider');
    }
    return context;
}
