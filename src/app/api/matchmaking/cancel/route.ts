import { NextRequest, NextResponse } from 'next/server';
import { queues } from '@/lib/matchmakingStorage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, betLevel } = body;

    if (!address || betLevel === undefined) {
      return NextResponse.json(
        { error: 'Invalid request: address and betLevel required' },
        { status: 400 }
      );
    }

    // Remove from queue
    const queue = queues[betLevel];
    const index = queue.findIndex((entry: any) => entry.address === address);
    
    if (index !== -1) {
      queue.splice(index, 1);
      return NextResponse.json({
        success: true,
        message: 'Removed from queue',
      });
    }

    return NextResponse.json(
      { error: 'Not found in queue' },
      { status: 404 }
    );

  } catch (error) {
    console.error('Cancel queue error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
