import axios, { InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-hot-toast';

const PROXY_API_URL = '/api/proxy'; // Use local Next.js API routes
// 1. Create the Axios instance
const api = axios.create({
    baseURL: PROXY_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Helper function to extract locale from document cookies in browser environments
const getLocaleFromCookie = (): string => {
    if (typeof document === 'undefined') return 'en';

    const match = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : 'en';
};

// 2. Request Interceptor to dynamically attach locale
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        let locale = 'en';

        if (typeof window === 'undefined') {
            // Server-Side (RSC / Server Actions / Route Handlers)
            try {
                const { getLocale } = await import('next-intl/server');
                locale = await getLocale();
            } catch {
                // Fallback if called outside next-intl server context
                locale = 'en';
            }
        } else {
            // Client-Side
            locale = getLocaleFromCookie();
        }

        // Attach locale to headers (e.g., 'Accept-Language' or custom 'X-NEXT-INTL-LOCALE')
        config.headers['Accept-Language'] = locale;

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log("error.response?.status", error.response?.status);
        if (error.response?.status === 401) {
            window.location.reload(); // Force a reload to trigger re-authentication
        }

        return Promise.reject(error);
    }
);

export default api;