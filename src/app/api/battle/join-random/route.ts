// src/app/api/battle/join-random/route.ts
// Random matchmaking endpoint - INSTANT AI OPPONENT FOR MVP

import { NextRequest, NextResponse } from 'next/server';
import { createAIBattle, generateAITeam } from '@/lib/battleService';
import {
  playerRatings,
  INITIAL_RATING,
} from '@/lib/matchmakingStorage';

/**
 * Join random battle - INSTANT AI OPPONENT
 * POST /api/battle/join-random
 * Body: { address: string, team: string[], betLevel: number }
 * 
 * CURRENT MVP IMPLEMENTATION:
 * - Every "random" battle is actually vs AI
 * - This ensures instant matches and no waiting
 * - Perfect for MVP with low player count
 * 
 * FUTURE: Implement real matchmaking queue with human opponents
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, team, betLevel } = body;

    console.log('[JoinRandom] ═══════════════════════════════════════');
    console.log('[JoinRandom] 🤖 INSTANT AI MATCH (MVP MODE)');
    console.log('[JoinRandom] ═══════════════════════════════════════');
    console.log('[JoinRandom] 👤 Player:', address);
    console.log('[JoinRandom] 🎴 Team Size:', team?.length);
    console.log('[JoinRandom] 💰 Bet Level:', betLevel);

    // Validation
    if (!address || !team || !Array.isArray(team) || team.length !== 3) {
      return NextResponse.json(
        { error: 'Invalid request: address and team (3 Jablixes) required' },
        { status: 400 }
      );
    }

    if (![0, 1].includes(betLevel)) {
      return NextResponse.json(
        { error: 'Invalid bet level: must be 0 (3000 JXC) or 1 (5000 JXC)' },
        { status: 400 }
      );
    }

    // Get or initialize player rating
    if (!playerRatings.has(address)) {
      playerRatings.set(address, {
        rating: INITIAL_RATING,
        wins: 0,
        totalGames: 0,
      });
    }

    // Generate AI opponent team (3 random Jablixes from ID 1-95)
    const aiTeam = generateAITeam();
    console.log('[JoinRandom] 🤖 Generated AI team:', aiTeam);

    // Create AI battle INSTANTLY (no queue, no waiting!)
    const battle = await createAIBattle(address, team, aiTeam);

    console.log('[JoinRandom] ✅ AI Battle created:', battle.battleId);
    console.log('[JoinRandom] 📡 battle_start broadcast sent via Pusher');
    console.log('[JoinRandom] 🎮 AI will play automatically each turn');
    console.log('[JoinRandom] 💡 Battle is OFF-CHAIN (MVP mode, no blockchain)');

    return NextResponse.json({
      success: true,
      status: 'matched',
      battleId: battle.battleId,
      isHost: true,
      opponent: 'AI_OPPONENT',
      aiTeam,
      betLevel,
      message: 'AI opponent found instantly! Battle starting...',
    });

  } catch (error) {
    console.error('[JoinRandom] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
