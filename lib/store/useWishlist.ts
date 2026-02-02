import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistItem {
    id: string;
    name: string;
    priceTRY: number;
    priceUSD: number;
    imageUrl: string;
}

interface WishlistState {
    items: WishlistItem[];
    addToWishlist: (item: WishlistItem) => void;
    removeFromWishlist: (id: string) => void;
    isInWishlist: (id: string) => boolean;
}

export const useWishlist = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],
            addToWishlist: (item) => {
                const currentItems = get().items;
                if (!currentItems.find((i) => i.id === item.id)) {
                    set({ items: [...currentItems, item] });
                }
            },
            removeFromWishlist: (id) => {
                set({ items: get().items.filter((item) => item.id !== id) });
            },
            isInWishlist: (id) => {
                return !!get().items.find((item) => item.id === id);
            },
        }),
        {
            name: 'wishlist-storage',
        }
    )
);
