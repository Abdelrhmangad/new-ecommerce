import { create } from 'zustand'
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware'
import { CartItem } from '@/shared/types/Cart.types'

type CartState = {
    showCart: boolean;
    items: CartItem[]
}

type StoreState = {
    cart: CartState
    toggleCart: () => void
    addToCart: (item: CartItem) => void
    updateCartItem: (variantSku: string, quantity: number) => void
    removeFromCart: (variantSku: string) => void
    clearCart: () => void
}

const cartStorage: StateStorage = {
    getItem: (name) => {
        if (typeof window === 'undefined') {
            return null
        }

        const storedValue = window.localStorage.getItem(name)

        if (!storedValue) {
            return null
        }

        try {
            const parsedValue = JSON.parse(storedValue) as {
                state?: unknown
                items?: CartItem[]
            }

            if ('state' in parsedValue) {
                return storedValue
            }

            return JSON.stringify({
                state: {
                    cart: {
                        items: Array.isArray(parsedValue.items) ? parsedValue.items : [],
                    },
                },
                version: 0,
            })
        } catch {
            return null
        }
    },
    setItem: (name, value) => window.localStorage.setItem(name, value),
    removeItem: (name) => window.localStorage.removeItem(name),
}

const useStore = create<StoreState>()(persist((set) => ({
    cart: {
        showCart: false,
        items: [],
    },

    toggleCart: () => set((state) => {
        return {
            cart: {
                ...state.cart,
                showCart: !state.cart.showCart,
            },
        }
    }),

    addToCart: (item) =>
        set((state) => {
            const existingItem = state.cart.items.find(
                (cartItem) => cartItem.variantSku === item.variantSku,
            )
            const quantity = Math.min(
                Math.max(item.quantity, 0),
                item.maxStock,
            )

            if (!existingItem) {
                return {
                    cart: {
                        ...state.cart,
                        items: quantity > 0 ? [{ ...item, quantity }] : state.cart.items,
                    },
                }
            }

            const updatedQuantity = Math.min(
                existingItem.quantity + quantity,
                existingItem.maxStock,
            )

            return {
                cart: {
                    ...state.cart,
                    items: state.cart.items.map((cartItem) =>
                        cartItem.variantSku === item.variantSku
                            ? { ...cartItem, quantity: updatedQuantity }
                            : cartItem,
                    ),
                },
            }
        }),

    updateCartItem: (variantSku, quantity) =>
        set((state) => {
            const item = state.cart.items.find(
                (cartItem) => cartItem.variantSku === variantSku,
            )

            if (!item) {
                return state
            }

            const updatedQuantity = Math.min(
                Math.max(quantity, 0),
                item.maxStock,
            )

            return {
                cart: {
                    ...state.cart,
                    items:
                        updatedQuantity === 0
                            ? state.cart.items.filter(
                                (cartItem) => cartItem.variantSku !== variantSku,
                            )
                            : state.cart.items.map((cartItem) =>
                                cartItem.variantSku === variantSku
                                    ? { ...cartItem, quantity: updatedQuantity }
                                    : cartItem,
                            ),
                },
            }
        }),

    removeFromCart: (variantSku) =>
        set((state) => ({
            cart: {
                ...state.cart,
                items: state.cart.items.filter(
                    (item) => item.variantSku !== variantSku,
                ),
            },
        })),

    clearCart: () =>
        set((state) => ({
            cart: {
                ...state.cart,
                items: [],
            },
        })),
}), {
    name: 'user_cart',
    storage: createJSONStorage(() => cartStorage),
    merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<StoreState>

        return {
            ...currentState,
            ...persisted,
            cart: {
                ...currentState.cart,
                ...persisted.cart,
            },
        }
    },
}))

export default useStore
export type { CartState, StoreState }