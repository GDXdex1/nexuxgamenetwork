import { NextResponse } from 'next/server';

const VPS_GATEWAY_URL = 'http://35.225.225.158:3000';

/**
 * Proxy POST requests to the VPS gateway
 * Using 'any' for the second argument to bypass persistent Vercel build worker type errors
 * while correctly awaiting the Promise for Next.js 15 compatibility.
 */
export async function POST(
    request: Request,
    context: any
) {
    try {
        const params = await context.params;
        const slugArray = params.slug as string[];
        const slug = slugArray.join('/');
        const targetUrl = `${VPS_GATEWAY_URL}/${slug}`;

        console.log(`[PROXY] POST Forwarding to: ${targetUrl}`);

        const body = await request.json();

        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        return NextResponse.json(data, {
            status: response.status,
        });
    } catch (error) {
        console.error('[PROXY] POST Error:', error);
        return NextResponse.json(
            { error: 'Failed to proxy request to battle server' },
            { status: 500 }
        );
    }
}

/**
 * Proxy GET requests to the VPS gateway
 */
export async function GET(
    request: Request,
    context: any
) {
    try {
        const params = await context.params;
        const slugArray = params.slug as string[];

        // Simple health check for the proxy
        if (slugArray.includes('test')) {
            return NextResponse.json({ status: 'ok', message: 'Proxy is live' });
        }

        const slug = slugArray.join('/');
        const targetUrl = `${VPS_GATEWAY_URL}/${slug}`;

        console.log(`[PROXY] GET Forwarding to: ${targetUrl}`);

        const response = await fetch(targetUrl);
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('[PROXY] GET Error:', error);
        return NextResponse.json({ error: 'Failed to proxy request' }, { status: 500 });
    }
}
