import axios from 'axios';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
            console.error('NEXT_PUBLIC_API_URL is missing');
            return NextResponse.json(
                { success: false, message: 'Server misconfiguration.' },
                { status: 500 }
            );
        }

        const response = await axios.post(`${apiUrl}/auth/google`, body);
        const data = response.data;

        const token = data?.token;

        if (!token) {
            console.error('Token missing in upstream response');
            return NextResponse.json(
                { success: false, message: 'Authentication failed. No token received.' },
                { status: 502 }
            );
        }

        // Defensive destructuring — don't assume the shape
        const user = data?.user;
        if (!user) {
            console.error('User object missing in upstream response');
            return NextResponse.json(
                { success: false, message: 'Authentication failed. User data missing.' },
                { status: 502 }
            );
        }

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
        cookieStore.set('auth_user', JSON.stringify(user), {
            ...httpOnlyOptions,
            httpOnly: false,
        });

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Route error:', error);

        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json(error.response.data, {
                status: error.response.status,
            });
        }

        return NextResponse.json(
            { success: false, message: 'Unable to reach the sign-in service. Please try again.' },
            { status: 502 }
        );
    }
}