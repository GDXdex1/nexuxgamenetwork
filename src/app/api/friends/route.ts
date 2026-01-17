/**
 * Friends API Route
 * 
 * Handles friend management (add, list, remove)
 */

import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

/**
 * GET /api/friends
 * Get list of friends for a wallet address
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
    const friendsCollection = db.collection('friends');

    // Get all friend relationships for this address
    const friendships = await friendsCollection
      .find({
        $or: [
          { address: address },
          { friendAddress: address },
        ],
        status: 'accepted',
      })
      .toArray();

    // Extract friend addresses
    const friendAddresses = friendships.map((f) =>
      f.address === address ? f.friendAddress : f.address
    );

    return NextResponse.json({
      success: true,
      friends: friendAddresses,
      count: friendAddresses.length,
    });
  } catch (error) {
    console.error('Error fetching friends:', error);
    return NextResponse.json(
      { error: 'Failed to fetch friends' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/friends
 * Add a new friend
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { address, friendAddress } = body;

    if (!address || !friendAddress) {
      return NextResponse.json(
        { error: 'Both address and friendAddress are required' },
        { status: 400 }
      );
    }

    if (address === friendAddress) {
      return NextResponse.json(
        { error: 'Cannot add yourself as a friend' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('jablix_arena');
    const friendsCollection = db.collection('friends');

    // Check if friendship already exists
    const existing = await friendsCollection.findOne({
      $or: [
        { address: address, friendAddress: friendAddress },
        { address: friendAddress, friendAddress: address },
      ],
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Friendship already exists' },
        { status: 400 }
      );
    }

    // Create friendship (auto-accepted for simplicity)
    await friendsCollection.insertOne({
      address: address,
      friendAddress: friendAddress,
      status: 'accepted',
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: 'Friend added successfully',
    });
  } catch (error) {
    console.error('Error adding friend:', error);
    return NextResponse.json(
      { error: 'Failed to add friend' },
      { status: 500 }
    );
  }
}
