import axios from 'axios';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const STATE_CHANGING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

// Only these upstream response headers are safe to replay to the browser.
// Notably excludes Set-Cookie so the upstream can never set cookies on our origin,
// and excludes CORS headers we don't want blindly forwarded.
//
// `content-length` is deliberately absent. axios decompresses the response even
// under `responseType: 'stream'`, but leaves the upstream (compressed) length on
// the headers object — measured: a 526-byte JSON body arrives as a decompressed
// stream while `content-length` still reads 51. Replaying that truncates the
// response. Omitting it lets the runtime use chunked encoding and get it right.
const FORWARDED_RESPONSE_HEADERS = new Set([
    'content-type',
    'content-disposition',
    'cache-control',
    'etag',
    'last-modified',
    // Safe to keep: axios strips this when it decompresses, so it only survives
    // when the body genuinely is still encoded.
    'content-encoding',
    'content-language',
    'expires',
]);

function isSameOriginRequest(req: NextRequest): boolean {
    const secFetchSite = req.headers.get('sec-fetch-site');

    // Sec-Fetch-Site is sent by all modern browsers and is the most reliable signal.
    // 'same-origin' / 'none' (direct navigation, e.g. typed URL or bookmark) are fine.
    if (secFetchSite) {
        return secFetchSite === 'same-origin' || secFetchSite === 'none';
    }

    // Fallback for clients that don't send Sec-Fetch-Site: compare Origin to our own host.
    const origin = req.headers.get('origin');
    if (!origin) {
        // No Origin and no Sec-Fetch-Site (e.g. some non-browser/same-origin server calls).
        // Be conservative but don't break legitimate same-origin requests that omit both.
        return true;
    }

    try {
        const originUrl = new URL(origin);
        return originUrl.host === req.nextUrl.host;
    } catch {
        return false;
    }
}

function filterResponseHeaders(upstreamHeaders: Record<string, unknown>): Headers {
    const headers = new Headers();
    for (const [key, value] of Object.entries(upstreamHeaders)) {
        if (value === null) continue;
        if (FORWARDED_RESPONSE_HEADERS.has(key.toLowerCase())) {
            headers.set(key, Array.isArray(value) ? value.join(', ') : String(value));
        }
    }
    return headers;
}

async function handler(req: NextRequest) {
    try {
        const token = (await cookies()).get('auth_token')?.value;

        if (!token) {
            return new NextResponse(null, { status: 401 });
        }

        if (STATE_CHANGING_METHODS.has(req.method) && !isSameOriginRequest(req)) {
            return new NextResponse(null, { status: 403 });
        }

        // Extract the path from the request URL
        const url = new URL(req.url);
        const proxyPath = url.pathname.replace('/api/proxy', '') || '/';
        const searchParams = url.searchParams.toString();
        const targetUrl = `${process.env.NEXT_PUBLIC_API_URL}${proxyPath}${searchParams ? `?${searchParams}` : ''}`;

        const requestHeaders = {
            Authorization: `Bearer ${token}`,
            'Content-Type': req.headers.get('content-type') || 'application/json',
            Accept: req.headers.get('accept') || 'application/json',
            // The API localises master-data labels and response messages off this
            // header. The client sets it on the axios instance, but this proxy builds
            // its outbound headers from scratch — without forwarding it here, the
            // header never reaches Laravel and localisation silently does nothing.
            'Accept-Language': req.headers.get('accept-language') || 'en',
        };

        // Get request body for non-GET requests
        let requestBody = null;
        if (req.method !== 'GET' && req.method !== 'HEAD') {
            try {
                const contentType = req.headers.get('content-type');
                if (contentType?.includes('application/json')) {
                    requestBody = await req.json();
                } else if (contentType?.includes('multipart/form-data')) {
                    requestBody = await req.formData();
                } else {
                    requestBody = await req.text();
                }
            } catch {
                // If body parsing fails, continue with null body
            }
        }

        const backendResponse = await axios({
            method: req.method.toLowerCase(),
            url: targetUrl,
            headers: requestHeaders,
            ...(requestBody !== null ? { data: requestBody } : {}),
            validateStatus: () => true,
            responseType: 'stream',
            // Without this a hung backend hangs the request indefinitely — this is the
            // hop that actually talks to Laravel, so the client-side timeout on the
            // axios instance does not cover it.
            timeout: 30000,
        });

        return new NextResponse(backendResponse.data, {
            status: backendResponse.status,
            statusText: backendResponse.statusText,
            headers: filterResponseHeaders(backendResponse.headers as Record<string, unknown>),
        });
    } catch (error) {
        console.error('Proxy request failed:', error);
        return new NextResponse(null, { status: 502 });
    }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
export const HEAD = handler;
