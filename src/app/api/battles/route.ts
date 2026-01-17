import { NextRequest, NextResponse } from 'next/server';
import { getBattlesCollection } from '@/lib/mongoDbService';
import type { Battle } from '@/lib/mongoDbService';

/**
 * GET /api/battles
 * Get battle history
 * Query params:
 * - wallet: filter by player wallet address
 * - limit: number of battles to return (default: 50)
 * - skip: number of battles to skip for pagination
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const wallet = searchParams.get('wallet');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const skip = parseInt(searchParams.get('skip') || '0', 10);

    const battlesCollection = await getBattlesCollection();

    const query: Record<string, unknown> = {};
    if (wallet) {
      query.$or = [
        { player1Wallet: wallet },
        { player2Wallet: wallet },
      ];
    }

    const battles = await battlesCollection
      .find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await battlesCollection.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: battles,
      total,
      limit,
      skip,
    });
  } catch (error: unknown) {
    console.error('Error fetching battles:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch battles',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/battles
 * Record a new battle result
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Partial<Battle>;

    if (!body.player1Wallet || !body.player1JablixId || !body.result) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    const battlesCollection = await getBattlesCollection();

    const newBattle: Battle = {
      player1Wallet: body.player1Wallet,
      player1JablixId: body.player1JablixId,
      player2Wallet: body.player2Wallet || null,
      player2JablixId: body.player2JablixId || null,
      battleType: body.battleType || 'pve',
      result: body.result,
      rewardJxc: body.rewardJxc || 0,
      duration: body.duration || 0,
      turns: body.turns || 0,
      timestamp: new Date(),
    };

    const result = await battlesCollection.insertOne(newBattle);

    return NextResponse.json({
      success: true,
      data: { ...newBattle, _id: result.insertedId },
      message: 'Battle recorded successfully',
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error recording battle:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to record battle',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
