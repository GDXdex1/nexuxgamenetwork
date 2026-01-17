import { NextRequest, NextResponse } from 'next/server';
import { getUsersCollection } from '@/lib/mongoDbService';
import type { User } from '@/lib/mongoDbService';

/**
 * GET /api/user/[wallet]
 * Get user data by wallet address
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
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error: unknown) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/[wallet]
 * Create or update user data
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ wallet: string }> }
) {
  try {
    const { wallet } = await params;
    const body = await request.json() as Partial<User>;

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

    // Check if user exists
    const existingUser = await usersCollection.findOne({ walletAddress: wallet });

    if (existingUser) {
      // Update existing user
      const updateData = {
        ...body,
        updatedAt: new Date(),
      };

      await usersCollection.updateOne(
        { walletAddress: wallet },
        { $set: updateData }
      );

      const updatedUser = await usersCollection.findOne({ walletAddress: wallet });

      return NextResponse.json({
        success: true,
        data: updatedUser,
        message: 'User updated successfully',
      });
    } else {
      // Create new user
      const newUser: User = {
        walletAddress: wallet,
        username: body.username || `Player_${wallet.slice(0, 6)}`,
        jxcBalance: body.jxcBalance || 0,
        totalBattles: 0,
        wins: 0,
        losses: 0,
        rating: 1000,
        ownedJablixes: [],
        achievements: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await usersCollection.insertOne(newUser);

      return NextResponse.json({
        success: true,
        data: { ...newUser, _id: result.insertedId },
        message: 'User created successfully',
      }, { status: 201 });
    }
  } catch (error: unknown) {
    console.error('Error creating/updating user:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create/update user',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
