/**
 * User Online Status API Route
 * 
 * Track user online/offline status
 */

import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

/**
 * POST /api/user/online
 * Update user online status
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { address, isOnline, timestamp } = body;

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('jablix_arena');
    const onlineUsersCollection = db.collection('online_users');

    if (isOnline) {
      // Update or insert online status
      await onlineUsersCollection.updateOne(
        { address: address },
        {
          $set: {
            address: address,
            lastSeen: new Date(timestamp || Date.now()),
            inBattle: false,
          },
        },
        { upsert: true }
      );
    } else {
      // Remove from online users
      await onlineUsersCollection.deleteOne({ address: address });
    }

    return NextResponse.json({
      success: true,
      message: isOnline ? 'User marked as online' : 'User marked as offline',
    });
  } catch (error) {
    console.error('Error updating online status:', error);
    return NextResponse.json(
      { error: 'Failed to update online status' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/user/online
 * Get online status of a specific user
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { error: 'Address parameter is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('jablix_arena');
    const onlineUsersCollection = db.collection('online_users');

    const user = await onlineUsersCollection.findOne({
      address: address,
      lastSeen: { $gte: new Date(Date.now() - 60000) }, // Online if seen in last 60 seconds
    });

    return NextResponse.json({
      success: true,
      isOnline: !!user,
      lastSeen: user?.lastSeen,
      inBattle: user?.inBattle || false,
    });
  } catch (error) {
    console.error('Error fetching online status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch online status' },
      { status: 500 }
    );
  }
}
