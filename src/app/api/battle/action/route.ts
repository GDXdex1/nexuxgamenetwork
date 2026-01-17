// src/app/api/battle/action/route.ts
// Process battle action endpoint - SIMULTANEOUS TURN SYSTEM

import { NextRequest, NextResponse } from 'next/server';
import { getBattle, submitMoves } from '@/lib/battleService';
import type { BattleAction } from '@/types/battle.types';

/**
 * Submit moves for current turn
 * POST /api/battle/action
 * Body: { battleId: string, playerAddress: string, moves: BattleAction[] }
 * 
 * SIMULTANEOUS TURN SYSTEM:
 * - Players submit array of moves (cards to play)
 * - Server waits for both players to submit
 * - Server resolves both players' moves simultaneously
 * - Energy resets to 3 per Jablix each turn
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { battleId, playerAddress, moves } = body;

    console.log('[BattleAction] ═══════════════════════════════════════');
    console.log('[BattleAction] 📥 Move submission received');
    console.log('[BattleAction] ═══════════════════════════════════════');
    console.log('[BattleAction] 🆔 Battle ID:', battleId);
    console.log('[BattleAction] 👤 Player:', playerAddress);
    console.log('[BattleAction] 🎯 Moves:', JSON.stringify(moves));

    // Validation
    if (!battleId || !playerAddress || !moves || !Array.isArray(moves)) {
      return NextResponse.json(
        { error: 'Invalid request: battleId, playerAddress, and moves (array) required' },
        { status: 400 }
      );
    }

    // Get battle
    const battle = getBattle(battleId);
    if (!battle) {
      return NextResponse.json(
        { error: 'Battle not found' },
        { status: 404 }
      );
    }

    if (battle.status !== 'active') {
      return NextResponse.json(
        { error: 'Battle is not active' },
        { status: 400 }
      );
    }

    // Validate player is in battle
    const isPlayer1 = battle.player1.address === playerAddress;
    const isPlayer2 = battle.player2.address === playerAddress;

    if (!isPlayer1 && !isPlayer2) {
      return NextResponse.json(
        { error: 'You are not a participant in this battle' },
        { status: 403 }
      );
    }

    // Submit moves
    const result = await submitMoves(battleId, playerAddress, moves);

    console.log('[BattleAction] ✅ Moves processed:', result.message);

    if (result.waitingForOpponent) {
      return NextResponse.json({
        success: true,
        message: 'Moves submitted. Waiting for opponent...',
        waitingForOpponent: true,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Turn resolved! Check battle updates via Pusher.',
      waitingForOpponent: false,
    });

  } catch (error) {
    console.error('[BattleAction] ❌ Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
