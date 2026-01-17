import { NextRequest, NextResponse } from 'next/server';
import { getUsersCollection } from '@/lib/mongoDbService';

/**
 * GET /api/user/[wallet]/jablixes
 * Get all jablixes owned by a specific user
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ wallet: string }> }
) {
  try {
    const { wallet } = await params;

    if (!wallet || wallet.length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid wallet address',
        },
        { status: 400 }
      );
    }

    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne({ walletAddress: wallet });

    if (!user) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'User not found, returning empty array',
      });
    }

    return NextResponse.json({
      success: true,
      data: user.ownedJablixes || [],
      total: user.ownedJablixes?.length || 0,
    });
  } catch (error: unknown) {
    console.error('Error fetching user jablixes:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user jablixes',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/[wallet]/jablixes
 * Add a jablix to user's collection (after minting)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ wallet: string }> }
) {
  try {
    const { wallet } = await params;
    const body = await request.json() as { jablixId: string; typeId: number; type: 'elemental' | 'special' };

    if (!wallet || wallet.length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid wallet address',
        },
        { status: 400 }
      );
    }

    if (!body.jablixId || !body.typeId || !body.type) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: jablixId, typeId, type',
        },
        { status: 400 }
      );
    }

    const usersCollection = await getUsersCollection();

    // Add jablix to user's collection
    await usersCollection.updateOne(
      { walletAddress: wallet },
      {
        $addToSet: {
          ownedJablixes: {
            jablixId: body.jablixId,
            typeId: body.typeId,
            type: body.type,
            acquiredAt: new Date(),
          },
        },
        $set: {
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Jablix added to user collection',
    });
  } catch (error: unknown) {
    console.error('Error adding jablix to user:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add jablix to user',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
