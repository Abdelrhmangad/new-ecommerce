// app/api/auth/logout/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
    const cookieStore = await cookies();
    const userToken = cookieStore.get('refresh_token')?.value;

    if (!userToken) {
        return NextResponse.json({ success: false, message: 'No refresh token available' }, { status: 401 });
    }

    try {
        // Fix: Pass empty object {} as body (2nd arg), and config object as 3rd arg
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    // Pass the cookie header directly so backend's req.cookies reads it
                    Cookie: `refresh_token=${userToken}`,
                    // Optional: If backend expects Bearer token in Authorization header:
                    Authorization: `Bearer ${userToken}`,
                },
                timeout: 5000,
            }
        );
        const data = response.data;
        const user = data?.user;
        const token = data?.accessToken;
        const refreshToken = data?.refreshToken;

        const tokenExpiresAt = 24 * 60 * 60; // 1 day
        const httpOnlyOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            maxAge: tokenExpiresAt,
            path: '/',
        };

        const cookieStore = await cookies();
        cookieStore.set('auth_token', token, httpOnlyOptions);
        cookieStore.set('refresh_token', refreshToken, httpOnlyOptions);
        cookieStore.set('auth_user', JSON.stringify(user), {
            ...httpOnlyOptions,
            httpOnly: false,
        });

        console.log("REFRESH RESPONSE", response.data);
        return NextResponse.json(data, { status: response.status });
    } catch (error: any) {
        console.error('Backend refresh failed:', error?.response?.data || error.message || error);
        return NextResponse.json(
            { success: false, message: 'Refresh failed' },
            { status: error?.response?.status || 500 }
        );
    }

    return NextResponse.json({ success: true, message: 'User data refreshed' });
}