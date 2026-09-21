/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/auth/logout/route.ts
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
    const body = await request.json();

    try {
        // Fix: Pass empty object {} as body (2nd arg), and config object as 3rd arg
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            body,
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

        console.log("login RESPONSE", response.data);
        return NextResponse.json({ ...data, refreshToken: null }, { status: response.status });
    } catch (error: any) {
        console.error('Backend login failed:', error?.response?.data || error.message || error);
        return NextResponse.json(
            { success: false, message: 'login failed' },
            { status: error?.response?.status || 500 }
        );
    }
}