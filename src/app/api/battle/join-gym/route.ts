// src/app/api/battle/join-gym/route.ts
// Join gym battle endpoint

import { NextRequest, NextResponse } from 'next/server';
import { gyms } from '@/lib/gymStorage';
import { createBattle } from '@/lib/battleService';

/**
 * Join gym room
 * POST /api/battle/join-gym
 * Body: { address: string, team: string[], gymCode: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, team, gymCode } = body;

    console.log('[JoinGym] Request received:', { address, teamSize: team?.length, gymCode });

    // Validation
    if (!address || !team || !Array.isArray(team) || team.length !== 3 || !gymCode) {
      return NextResponse.json(
        { error: 'Invalid request: address, team (3 Jablixes), and gymCode required' },
        { status: 400 }
      );
    }

    // Find gym
    const gym = gyms.get(gymCode.toUpperCase());
    if (!gym) {
      return NextResponse.json(
        { error: 'Gym not found. Please check the code.' },
        { status: 404 }
      );
    }

    if (gym.status !== 'waiting') {
      return NextResponse.json(
        { error: 'Gym is no longer available' },
        { status: 400 }
      );
    }

    if (gym.hostAddress === address) {
      return NextResponse.json(
        { error: 'Cannot join your own gym' },
        { status: 400 }
      );
    }

    console.log('[JoinGym] ═══════════════════════════════════════');
    console.log('[JoinGym] 🏋️ JOINING GYM - CREATING BATTLE');
    console.log('[JoinGym] ═══════════════════════════════════════');
    console.log('[JoinGym] 👤 Host:', gym.hostAddress);
    console.log('[JoinGym] 👤 Challenger:', address);
    console.log('[JoinGym] 💰 Bet Level:', gym.betLevel);

    // Create battle
    const battle = await createBattle(
      gym.hostAddress,
      address,
      gym.hostTeam,
      team,
      'gym'
    );

    // Update gym status
    gym.status = 'in_battle';
    gym.battleId = battle.battleId;

    // Clean up gym after 5 minutes
    setTimeout(() => {
      gyms.delete(gymCode.toUpperCase());
      console.log('[JoinGym] 🧹 Gym cleaned up:', gymCode);
    }, 5 * 60 * 1000);

    console.log('[JoinGym] ✅ Battle created:', battle.battleId);
    console.log('[JoinGym] 📡 battle_start broadcast via Pusher');

    return NextResponse.json({
      success: true,
      battleId: battle.battleId,
      message: 'Joined gym! Battle starting...',
    });

  } catch (error) {
    console.error('[JoinGym] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
