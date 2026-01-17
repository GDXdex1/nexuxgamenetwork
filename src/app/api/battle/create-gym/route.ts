// src/app/api/battle/create-gym/route.ts
// Create gym battle endpoint

import { NextRequest, NextResponse } from 'next/server';
import { gyms } from '@/lib/gymStorage';

/**
 * Create gym room for private battles
 * POST /api/battle/create-gym
 * Body: { address: string, team: string[], betLevel: number }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, team, betLevel } = body;

    console.log('[CreateGym] Request received:', { address, teamSize: team?.length, betLevel });

    // Validation
    if (!address || !team || !Array.isArray(team) || team.length !== 3) {
      return NextResponse.json(
        { error: 'Invalid request: address and team (3 Jablixes) required' },
        { status: 400 }
      );
    }

    // Generate 6-character gym code
    const gymCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Store gym
    gyms.set(gymCode, {
      code: gymCode,
      hostAddress: address,
      hostTeam: team,
      betLevel,
      createdAt: Date.now(),
      status: 'waiting',
    });

    console.log('[CreateGym] ✅ Gym created:', gymCode);
    console.log('[CreateGym] 👤 Host:', address);
    console.log('[CreateGym] 💰 Bet level:', betLevel);

    return NextResponse.json({
      success: true,
      gymCode,
      message: 'Gym created successfully! Share the code with your opponent.',
    });

  } catch (error) {
    console.error('[CreateGym] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
