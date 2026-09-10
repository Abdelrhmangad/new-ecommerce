import api from '@/shared/utils/axios.config';
import { useMutation } from '@tanstack/react-query';

// Define the payload types for type safety
export interface CreateOrderPayload {
    items: { id: string; quantity: number }[];
    shippingAddress: string;
    paymentMethodId: string;
}

interface OrderResponse {
    orderId: string;
    status: string;
    createdAt: string;
}

// Function that executes the actual API request
const createOrder = async (payload: CreateOrderPayload): Promise<OrderResponse> => {
    const response = await api.post('/orders', payload);

    if (response.status !== 200) {
        throw new Error('Failed to create order');
    }

    return response.data;
};

// Custom mutation hook
export const useCreateOrderMutation = () => {
    return useMutation<OrderResponse, Error, CreateOrderPayload>({
        mutationFn: createOrder,
    });
};