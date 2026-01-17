import { NextRequest, NextResponse } from 'next/server';
import { queues, matches } from '@/lib/matchmakingStorage';

function findMatchForPlayer(address: string, betLevel: number): any {
  // Check if player has a match
  for (const [matchId, match] of matches.entries()) {
    if (
      (match.player1.address === address || match.player2.address === address) &&
      match.player1.betLevel === betLevel
    ) {
      return { matchId, match };
    }
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, queueId, betLevel } = body;

    if (!address || betLevel === undefined) {
      return NextResponse.json(
        { error: 'Invalid request: address and betLevel required' },
        { status: 400 }
      );
    }

    // Check for match
    const matchResult = findMatchForPlayer(address, betLevel);
    
    if (matchResult) {
      const { matchId, match } = matchResult;
      const isPlayer1 = match.player1.address === address;
      
      return NextResponse.json({
        status: 'matched',
        matchId,
        isHost: isPlayer1,
        opponent: isPlayer1 ? match.player2.address : match.player1.address,
        opponentTeam: isPlayer1 ? match.player2.team : match.player1.team,
        playerTeam: isPlayer1 ? match.player1.team : match.player2.team,
      });
    }

    // Check queue position
    const queue = queues[betLevel];
    const queueEntry = queue.find((entry: any) => entry.address === address);
    
    if (!queueEntry) {
      return NextResponse.json(
        { error: 'Not in queue' },
        { status: 404 }
      );
    }

    const queuePosition = queue.indexOf(queueEntry) + 1;
    const queueSize = queue.length;
    const waitTime = Math.floor((Date.now() - queueEntry.joinTime) / 1000);

    return NextResponse.json({
      status: 'queued',
      queuePosition,
      queueSize,
      waitTime,
    });

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
