/**
 * Friend Management API Route
 * 
 * DELETE a specific friend relationship
 */

import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

/**
 * DELETE /api/friends/[friendAddress]
 * Remove a friend
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ friendAddress: string }> }
): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const params = await context.params;
    const { friendAddress } = params;

    if (!address) {
      return NextResponse.json(
        { error: 'Address parameter is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('jablix_arena');
    const friendsCollection = db.collection('friends');

    // Delete the friendship
    const result = await friendsCollection.deleteOne({
      $or: [
        { address: address, friendAddress: friendAddress },
        { address: friendAddress, friendAddress: address },
      ],
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Friendship not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Friend removed successfully',
    });
  } catch (error) {
    console.error('Error removing friend:', error);
    return NextResponse.json(
      { error: 'Failed to remove friend' },
      { status: 500 }
    );
  }
}
