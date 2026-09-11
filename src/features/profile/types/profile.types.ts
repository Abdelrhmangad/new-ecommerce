export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar?: string;
    createdAt: string;
    defaultAddress?: {
        governorate: string;
        city: string;
        address: string;
        building?: string;
        floor?: string;
    };
}

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
    variantSku: string;
    name: { en: string; ar: string };
    price: number;
    quantity: number;
    image: string;
}

export interface Order {
    id: string;
    status: OrderStatus;
    createdAt: string;
    deliveredAt?: string;
    items: OrderItem[];
    total: number;
    shipping: number;
}