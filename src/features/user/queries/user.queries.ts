/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/shared/utils/axios.config';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

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
        return response.data;
    } catch (error: any) {
        throw error;
    }
};

export const refreshUserData = async (): Promise<any> => {
    const response = await axios.get('/api/auth/me');
    console.log("Refreshed user data:", response.data);
    return response.data;
}


export const useUserData = () => {
    return useQuery({
        queryKey: ['User'],
        queryFn: refreshUserData,
        staleTime: 10 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false,
    });
}