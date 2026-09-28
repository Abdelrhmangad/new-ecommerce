/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/shared/utils/axios.config';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';



export const createUserAccount = async (payload: { name: string, email: string, password: string }): Promise<any> => {
    try {
        const response = await axios.post('/api/auth/register', payload);
        return response.data;
    } catch (error: any) {
        throw error;
    }
};

export const useCreateUserAccount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createUserAccount,
        onSuccess: () => {
            // Invalidate the user data query to refetch the updated user data
            queryClient.invalidateQueries({ queryKey: ['User'] });
        },
        onError: (error: any) => {
            console.error('Error creating account:', error);
        }
    });
}

export const loginUser = async (payload: { email: string, password: string }): Promise<any> => {
    try {
        const response = await axios.post('/api/auth/login', payload);
        return response.data;
    } catch (error: any) {
        throw error;
    }
};

export const useLoginUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: loginUser,
        onSuccess: () => {
            // Invalidate the user data query to refetch the updated user data
            queryClient.invalidateQueries({ queryKey: ['User'] });
            toast.success("Logged in successfully")
        },
        onError: (error: any) => {
            const errorMsg = error?.response?.data?.message
            toast.error(errorMsg)
            console.error('Error logging in to account:', error?.response);
        }
    });
}


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
        retry: false
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

export const uploadUserData = async (data: any): Promise<any> => {
    try {
        const response = await api.put('/auth/update-user', data);
        return response.data;
    } catch (error: any) {
        throw error;
    }
}

export const useUpdateUserData = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: uploadUserData,
        onSuccess: () => {
            // Invalidate the user data query to refetch the updated user data
            queryClient.invalidateQueries({ queryKey: ['User'] });
            toast.success("User data updated successfully")
        },
        onError: (error: any) => {
            const errorMsg = error?.response?.data?.message
            toast.error(errorMsg)
        }
    });
}



export const changeUserPassword = async (data: { old_password: string, new_password: string }): Promise<any> => {
    try {
        const response = await api.put('/auth/change-password', data);
        return response.data;
    } catch (error: any) {
        throw error;
    }
}

export const useChangeUserPassword = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: changeUserPassword,
        onSuccess: () => {
            // Invalidate the user data query to refetch the updated user data
            queryClient.invalidateQueries({ queryKey: ['User'] });
            // toast.success("User password updated successfully")
        },
        onError: (error: any) => {
            const errorMsg = error?.response?.data?.message
            toast.error(errorMsg)
        }
    });
}