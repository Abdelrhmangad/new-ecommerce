// app/api/auth/logout/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    try {
        await axios.post(
            `http://localhost:5000/api/auth/logout`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token || ""}`,
                },
                timeout: 5000, // don't let a hung backend block logout
            }
        );
    } catch (error) {
        console.error('Backend logout failed:', error);
    }

    const response = NextResponse.json({ success: true, message: 'Logged out' });

    for (const name of ['auth_token', 'auth_user']) {
        response.cookies.set(name, '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 0,
        });
    }

    return response;
}