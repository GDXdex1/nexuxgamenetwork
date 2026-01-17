// src/app/api/battle/start-ai/route.ts
// Start AI battle endpoint (OFF-CHAIN)

import { NextRequest, NextResponse } from 'next/server';
import { createAIBattle, generateAITeam } from '@/lib/battleService';

/**
 * Start AI battle
 * POST /api/battle/start-ai
 * Body: { address: string, team: string[], difficulty?: 'easy' | 'medium' | 'hard' }
 * 
 * AI battles are OFF-CHAIN (no real bets on blockchain)
 * They run completely in-memory for practice and fun
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, team, difficulty = 'medium' } = body;

    console.log('[StartAI] ═══════════════════════════════════════');
    console.log('[StartAI] 🤖 AI BATTLE REQUEST (OFF-CHAIN)');
    console.log('[StartAI] ═══════════════════════════════════════');
    console.log('[StartAI] 👤 Player:', address);
    console.log('[StartAI] 🎴 Team Size:', team?.length);
    console.log('[StartAI] 🎯 Difficulty:', difficulty);

    // Validation
    if (!address || !team || !Array.isArray(team) || team.length !== 3) {
      return NextResponse.json(
        { error: 'Invalid request: address and team (3 Jablixes) required' },
        { status: 400 }
      );
    }

    // Generate AI opponent team
    const aiTeam = generateAITeam();
    console.log('[StartAI] 🤖 Generated AI team:', aiTeam);

    // Create off-chain AI battle (no blockchain interaction)
    const battle = await createAIBattle(address, team, aiTeam);

    console.log('[StartAI] ✅ AI battle created (off-chain):', battle.battleId);
    console.log('[StartAI] 💡 Note: AI battles do not use smart contract');
    console.log('[StartAI] 📡 Battle start event broadcast via Pusher');

    return NextResponse.json({
      success: true,
      battleId: battle.battleId,
      aiTeam,
      message: 'AI battle started! (Off-chain, no real bets)',
    });

  } catch (error) {
    console.error('[StartAI] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}