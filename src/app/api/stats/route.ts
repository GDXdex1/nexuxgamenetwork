import { NextResponse } from 'next/server';
import {
  getUsersCollection,
  getBattlesCollection,
  getMarketplaceCollection,
  getElementalJablixesCollection,
  getSpecialJablixesCollection,
} from '@/lib/mongoDbService';

/**
 * GET /api/stats
 * Get global statistics for the dashboard
 */
export async function GET() {
  try {
    const [
      usersCollection,
      battlesCollection,
      marketplaceCollection,
      elementalCollection,
      specialCollection,
    ] = await Promise.all([
      getUsersCollection(),
      getBattlesCollection(),
      getMarketplaceCollection(),
      getElementalJablixesCollection(),
      getSpecialJablixesCollection(),
    ]);

    const [
      totalUsers,
      totalBattles,
      activeListings,
      totalElementals,
      totalSpecials,
    ] = await Promise.all([
      usersCollection.countDocuments(),
      battlesCollection.countDocuments(),
      marketplaceCollection.countDocuments({ status: 'active' }),
      elementalCollection.countDocuments(),
      specialCollection.countDocuments(),
    ]);

    // Get recent battles
    const recentBattles = await battlesCollection
      .find()
      .sort({ timestamp: -1 })
      .limit(5)
      .toArray();

    // Get top players by wins
    const topPlayers = await usersCollection
      .find()
      .sort({ wins: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalBattles,
          activeListings,
          totalJablixes: totalElementals + totalSpecials,
          elementalJablixes: totalElementals,
          specialJablixes: totalSpecials,
        },
        recentBattles: recentBattles.map(battle => ({
          id: battle._id,
          player1: battle.player1Wallet,
          player2: battle.player2Wallet || 'AI',
          result: battle.result,
          timestamp: battle.timestamp,
        })),
        topPlayers: topPlayers.map(player => ({
          wallet: player.walletAddress,
          username: player.username,
          wins: player.wins,
          losses: player.losses,
          rating: player.rating,
        })),
      },
    });
  } catch (error: unknown) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch stats',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
