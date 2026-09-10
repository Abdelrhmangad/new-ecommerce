/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/shared/utils/axios.config';

// Define the payload types for type safety
export interface AddAddressToUserPayload {
    shippingAddress: {
        fullName: string,
        phone: string,
        city: string,
        area: string,
        street: string,
        building: string,
        notes: string,
    };
}

// Function that executes the actual API request
export const addAddressToUser = async (payload: AddAddressToUserPayload): Promise<any> => {
    try {
        const response = await api.post('/orders', payload);
        console.log("Address added successfully", response.data);
        return response.data;
    } catch (error: any) {
        console.log("error", error?.response)
        throw error;
    }
};