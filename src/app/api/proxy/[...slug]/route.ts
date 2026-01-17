import { NextRequest, NextResponse } from 'next/server';

const VPS_GATEWAY_URL = 'http://35.225.225.158:3000';

export async function POST(
    request: NextRequest,
    // Use any for the second argument to bypass persistent Next.js 15 build errors 
    // while ensuring we can still await params if they are a Promise.
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

export async function GET(
    request: NextRequest,
    context: any
) {
    try {
        const params = await context.params;
        const slugArray = params.slug as string[];
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
