import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type User = {
    id: string
    name: string
    email: string
    phone?: string
    addresses?: addressType[]
    picture?: string
    createdAt: string
}

type addressType = {
    building: string
    city: string
    createdAt: string
    floor: string
    fullName: string
    governorate: string
    isDefault: boolean
    label: string
    notes: string
    phone: string
    street: string
    updatedAt: string
    _id: string
}

type AuthState = {
    user: User | null
    isAuthenticated: boolean
}

type AuthStoreState = {
    auth: AuthState
    login: (user: User) => void
    logout: () => void
    updateUser: (updates: Partial<User>) => void
}

const useAuthStore = create<AuthStoreState>()(persist((set) => ({
    auth: {
        user: null,
        isAuthenticated: false,
    },

    login: (user) =>
        set(() => ({
            auth: {
                user,
                isAuthenticated: true,
            },
        })),

    logout: () =>
        set(() => ({
            auth: {
                user: null,
                isAuthenticated: false,
            },
        })),

    updateUser: (updates) =>
        set((state) => {
            if (!state.auth.user) {
                return state
            }

            return {
                auth: {
                    ...state.auth,
                    user: {
                        ...state.auth.user,
                        ...updates,
                    },
                },
            }
        }),
}), {
    name: 'user_auth',
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({ auth: state.auth }),
}))

export default useAuthStore
export type { AuthState, AuthStoreState, User }