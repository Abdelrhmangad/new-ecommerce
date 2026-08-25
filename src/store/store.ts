import { create } from 'zustand'
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware'
import { CartItem } from '@/shared/types/Cart.types'

type CartState = {
    showCart: boolean;
    items: CartItem[]
    total: number
}

type StoreState = {
    cart: CartState
    toggleCart: () => void
    addToCart: (item: CartItem) => void
    updateCartItem: (variantSku: string, quantity: number) => void
    removeFromCart: (variantSku: string) => void
    clearCart: () => void
}

const calculateTotal = (items: CartItem[]) => items.reduce((sum, item) => sum + item.price * item.quantity, 0)

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

            const items = Array.isArray(parsedValue.items) ? parsedValue.items : []

            return JSON.stringify({
                state: {
                    cart: {
                        items,
                        total: calculateTotal(items),
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
        total: 0,
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
                const items = quantity > 0
                    ? [...state.cart.items, { ...item, quantity }]
                    : state.cart.items

                return {
                    cart: {
                        ...state.cart,
                        items,
                        total: calculateTotal(items),
                    },
                }
            }

            const updatedQuantity = Math.min(
                existingItem.quantity + quantity,
                existingItem.maxStock,
            )

            const items = state.cart.items.map((cartItem) =>
                cartItem.variantSku === item.variantSku
                    ? { ...cartItem, quantity: updatedQuantity }
                    : cartItem,
            )

            return {
                cart: {
                    ...state.cart,
                    items,
                    total: calculateTotal(items),
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

            const items = updatedQuantity === 0
                ? state.cart.items.filter(
                    (cartItem) => cartItem.variantSku !== variantSku,
                )
                : state.cart.items.map((cartItem) =>
                    cartItem.variantSku === variantSku
                        ? { ...cartItem, quantity: updatedQuantity }
                        : cartItem,
                )

            return {
                cart: {
                    ...state.cart,
                    items,
                    total: calculateTotal(items),
                },
            }
        }),

    removeFromCart: (variantSku) =>
        set((state) => {
            const items = state.cart.items.filter(
                (item) => item.variantSku !== variantSku,
            )

            return {
                cart: {
                    ...state.cart,
                    items,
                    total: calculateTotal(items),
                },
            }
        }),

    clearCart: () =>
        set((state) => ({
            cart: {
                ...state.cart,
                items: [],
                total: 0,
            },
        })),
}), {
    name: 'user_cart',
    storage: createJSONStorage(() => cartStorage),
    merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<StoreState>
        const mergedCart = {
            ...currentState.cart,
            ...persisted.cart,
        }

        return {
            ...currentState,
            ...persisted,
            cart: {
                ...mergedCart,
                total: calculateTotal(mergedCart.items),
            },
        }
    },
}))

export default useStore
export type { CartState, StoreState }