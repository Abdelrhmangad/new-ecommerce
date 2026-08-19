import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

// Unauthenticated relay — every entry here is reachable by anyone, so keep it
// to the guest routes the app genuinely calls. See TenForHire-API
// routes/API/auth-n-users.php and routes/API/FleetBridge/auth.php.
const ALLOWED_PATHS: string[] = [
    '/categories/*',
    '/auth/ensure-identifier-exists',
    '/auth/reset-password/verification',
    '/auth/reset-password',
    // Invitation acceptance: a new company user sets their password using a
    // one-time token, before any session exists. Called from
    // features/company/api/company-users.api.ts.
    '/fleet-bridge/auth/invitation/accept/*',
];

// Only these upstream response headers are safe to replay to the browser.
// Notably excludes Set-Cookie so the upstream can never set cookies on our origin,
// and excludes CORS/other headers we don't want blindly forwarded.
// `content-length` is deliberately absent — axios decompresses the stream but
// leaves the upstream compressed length on the headers object, so replaying it
// truncates the response. See the note in ../../[[...path]]/route.ts.
const FORWARDED_RESPONSE_HEADERS = new Set([
    'content-type',
    'content-disposition',
    'cache-control',
    'etag',
    'last-modified',
    'content-encoding',
    'content-language',
    'expires',
    // Deliberately NOT forwarding Retry-After / X-RateLimit-*: since 16f83b5 the
    // retry UI derives every countdown from the response *body* (resend_after /
    // expires_in / retry_after), never from headers — see the note at the top of
    // shared/components/server-request-retry-limit.tsx.
]);

function isPathAllowed(path: string): boolean {
    // Normalize: strip trailing slash (except root) so '/foo' and '/foo/' match the same rule.
    const normalized = path.length > 1 ? path.replace(/\/+$/, '') : path;

    return ALLOWED_PATHS.some((rule) => {
        if (rule.endsWith('/*')) {
            const prefix = rule.slice(0, -2);
            return normalized === prefix || normalized.startsWith(`${prefix}/`);
        }
        return normalized === rule;
    });
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
    // Extract the path from the request URL
    const url = new URL(req.url);
    const proxyPath = url.pathname.replace('/api/proxy/public', '') || '/';
    console.log("proxyPath", proxyPath)
    if (!isPathAllowed(proxyPath)) {
        return new NextResponse(null, { status: 403 });
    }
    console.log("isPathAllowed", isPathAllowed(proxyPath))


    const searchParams = url.searchParams.toString();
    const targetUrl = `${process.env.NEXT_PUBLIC_API_URL}${proxyPath}${searchParams ? `?${searchParams}` : ''}`;

    const requestHeaders = {
        'Content-Type': req.headers.get('content-type') || 'application/json',
        Accept: req.headers.get('accept') || 'application/json',
        // Master-data labels are localised off this header — see the note in the
        // authenticated proxy. Rebuilding headers here drops whatever the client set.
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
    console.log(
        "%c targetUrl %c " + targetUrl,
    );
    try {
        const backendResponse = await axios({
            method: req.method.toLowerCase(),
            url: targetUrl,
            headers: requestHeaders,
            ...(requestBody !== null ? { data: requestBody } : {}),
            validateStatus: () => true,
            responseType: 'stream',
            // A hung backend must not hang this request indefinitely.
            timeout: 30000,
        });

        // Forward ALL headers including rate limiting headers
        return new NextResponse(backendResponse.data, {
            status: backendResponse.status,
            statusText: backendResponse.statusText,
            headers: filterResponseHeaders(backendResponse.headers as Record<string, unknown>),
        });
    } catch (error) {
        console.log("backendResponse errror", error)
        // Handle Axios errors returned from the backend server
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json(error.response.data, {
                status: error.response.status,
            });
        }

        // Fallback for network issues or unexpected internal errors
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error during registration',
            },
            { status: 500 }
        );
    }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
export const HEAD = handler;
