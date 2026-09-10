/* eslint-disable @typescript-eslint/no-explicit-any */
import { CartItem } from '@/features/cart/components/cartItem';
import api from '@/shared/utils/axios.config';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// Define the payload types for type safety
export interface CreateOrderPayload {
    items: CartItem[];
    shippingAddress: {
        fullName: string,
        phone: string,
        city: string,
        governorate: string,
        street: string,
        building: string,
        floor: string,
        notes: string,
    };
    saveAddress: boolean;
    paymentMethodId: string;
}

interface OrderResponse {
    orderId: string;
    status: string;
    createdAt: string;
}

// Function that executes the actual API request
const createOrder = async (payload: CreateOrderPayload): Promise<OrderResponse> => {
    try {
        const response = await api.post('/orders', payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Custom mutation hook
export const useCreateOrderMutation = () => {
    return useMutation<OrderResponse, Error, CreateOrderPayload>({
        mutationFn: createOrder,
        onSuccess: (data) => {
            toast.success(`Order ${data.orderId} created successfully!`);
        },
        onError: (error: any) => {
            if (error?.response?.data?.message) {
                toast.error(`Failed to create order: ${error?.response.data.message}`);
            } else {
                console.log("error", error?.response)
                toast.error('Failed to create order');
            }
        },
    });
};