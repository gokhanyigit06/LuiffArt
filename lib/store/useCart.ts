import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
    cartItemId: string; // Unique ID per item line (product + variant combination)
    productId: string;
    variantId: string;
    name: string;
    slug: string;
    imageUrl: string;
    size: string;
    material: string;

    // Pricing
    priceTRY: number;
    priceUSD: number;

    // Logistics
    desi: number;
    weight: number;

    quantity: number;
}

interface CartStore {
    items: CartItem[];
    isOpen: boolean;

    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;

    addToCart: (item: Omit<CartItem, 'cartItemId'>) => void;
    removeFromCart: (cartItemId: string) => void;
    updateQuantity: (cartItemId: string, quantity: number) => void;
    clearCart: () => void;

    // Computed (Helper for easy access, though often computed in component)
    getTotals: (region: 'TR' | 'GLOBAL') => { total: number; count: number };
}

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

            addToCart: (item) => set((state) => {
                // Create a unique ID based on product + variant
                const cartItemId = `${item.productId}-${item.variantId}`;

                const existingItem = state.items.find((i) => i.cartItemId === cartItemId);

                if (existingItem) {
                    return {
                        items: state.items.map((i) =>
                            i.cartItemId === cartItemId
                                ? { ...i, quantity: i.quantity + item.quantity }
                                : i
                        ),
                        isOpen: true
                    };
                }

                return {
                    items: [...state.items, { ...item, cartItemId }],
                    isOpen: true
                };
            }),

            removeFromCart: (cartItemId) => set((state) => ({
                items: state.items.filter((i) => i.cartItemId !== cartItemId)
            })),

            updateQuantity: (cartItemId, quantity) => set((state) => ({
                items: state.items.map((i) =>
                    i.cartItemId === cartItemId ? { ...i, quantity } : i
                )
            })),

            clearCart: () => set({ items: [] }),

            getTotals: (region) => {
                const { items } = get();
                const count = items.reduce((sum, item) => sum + item.quantity, 0);
                const total = items.reduce((sum, item) => {
                    const price = region === 'TR' ? item.priceTRY : item.priceUSD;
                    return sum + (price * item.quantity);
                }, 0);
                return { total, count };
            }
        }),
        {
            name: 'luiff-cart-storage',
            storage: createJSONStorage(() => localStorage),
            // Only persist items, not isOpen state
            partialize: (state) => ({ items: state.items }),
        }
    )
);
