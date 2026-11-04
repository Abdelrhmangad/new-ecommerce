import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

interface RouteRule {
    path: string;
    methods: string[] | '*'; // Can specify an array of methods like ['GET', 'POST'] or '*' for all methods
}

// Define allowed paths alongside their permitted HTTP methods
const ALLOWED_ROUTES: RouteRule[] = [
    {
        path: '/categories/*',
        methods: ['GET', 'HEAD'], // Example: Only allow reading categories
    },
    {
        path: '/products/*',
        methods: ['GET', 'HEAD'], // Example: Only allow reading products
    },
    {
        path: '/orders/*',
        methods: ['POST'],        // Example: Only allow POST requests for orders
    },
    {
        path: '*',
        methods: ['GET'],         // Fallback rule for other general GET requests
    }
];

// Only these upstream response headers are safe to replay to the browser.
const FORWARDED_RESPONSE_HEADERS = new Set([
    'content-type',
    'content-disposition',
    'cache-control',
    'etag',
    'last-modified',
    'content-encoding',
    'content-language',
    'expires',
]);

function isRouteAllowed(path: string, method: string): boolean {
    // Normalize: strip trailing slash (except root) so '/foo' and '/foo/' match the same rule.
    const normalized = path.length > 1 ? path.replace(/\/+$/, '') : path;
    const upperMethod = method.toUpperCase();

    return ALLOWED_ROUTES.some((rule) => {
        // 1. Check if the path matches the rule
        let pathMatches = false;
        if (rule.path.endsWith('/*')) {
            const prefix = rule.path.slice(0, -2);
            pathMatches = normalized === prefix || normalized.startsWith(`${prefix}/`);
        } else if (rule.path === '*') {
            pathMatches = true;
        } else {
            pathMatches = normalized === rule.path;
        }

        if (!pathMatches) return false;

        // 2. Check if the HTTP method is allowed for this rule
        if (rule.methods === '*') return true;
        return rule.methods.map((m) => m.toUpperCase()).includes(upperMethod);
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

    // Validate both path and HTTP method
    if (!isRouteAllowed(proxyPath, req.method)) {
        return NextResponse.json(
            { message: `Method ${req.method} is not allowed for this backend path on frontend public middleware` },
            { status: 403 }
        );
    }

    const searchParams = url.searchParams.toString();
    const targetUrl = `${process.env.NEXT_PUBLIC_API_URL}${proxyPath}${searchParams ? `?${searchParams}` : ''}`;

    const requestHeaders = {
        'Content-Type': req.headers.get('content-type') || 'application/json',
        Accept: req.headers.get('accept') || 'application/json',
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

    try {
        const backendResponse = await axios({
            method: req.method.toLowerCase(),
            url: targetUrl,
            headers: requestHeaders,
            ...(requestBody !== null ? { data: requestBody } : {}),
            validateStatus: () => true,
            responseType: 'stream',
            timeout: 30000,
        });

        return new NextResponse(backendResponse.data, {
            status: backendResponse.status,
            statusText: backendResponse.statusText,
            headers: filterResponseHeaders(backendResponse.headers as Record<string, unknown>),
        });
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json(error.response.data, {
                status: error.response.status,
            });
        }

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