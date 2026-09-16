/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/shared/utils/axios.config';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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


export const uploadUserAvatar = async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('picture', file);
    try {
        const response = await api.put('/auth/update-avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error: any) {
        throw error;
    }
}

export const useUpdateUserAvatar = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: uploadUserAvatar,
        onSuccess: () => {
            // Invalidate the user data query to refetch the updated user data
            queryClient.invalidateQueries({ queryKey: ['User'] });
        },
        onError: (error: any) => {
            console.error('Error uploading avatar:', error);
        }
    });
}