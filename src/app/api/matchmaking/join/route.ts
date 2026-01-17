import { NextRequest, NextResponse } from 'next/server';
import {
  queues,
  matches,
  playerRatings,
  INITIAL_RATING,
  RATING_MATCH_THRESHOLD,
  MAX_QUEUE_TIME,
  type QueueEntry,
  type Match,
} from '@/lib/matchmakingStorage';

function generateMatchId(): string {
  return `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function findMatch(betLevel: number): Match | null {
  const queue = queues[betLevel];
  if (queue.length < 2) return null;

  // Sort by rating for fair matches
  queue.sort((a, b) => a.rating - b.rating || a.joinTime - b.joinTime);

  for (let i = 0; i < queue.length; i++) {
    for (let j = i + 1; j < queue.length; j++) {
      const p1 = queue[i];
      const p2 = queue[j];
      const ratingDiff = Math.abs(p1.rating - p2.rating);
      
      // Match players with similar ratings or after waiting too long
      const waitTime = Date.now() - p1.joinTime;
      const effectiveThreshold = RATING_MATCH_THRESHOLD + (waitTime > MAX_QUEUE_TIME / 2 ? 100 : 0);
      
      if (ratingDiff <= effectiveThreshold || waitTime > MAX_QUEUE_TIME) {
        // Remove from queue
        const matchedP1 = queue.splice(i, 1)[0];
        const matchedP2 = queue.splice(j - 1, 1)[0];
        
        // Create match
        const matchId = generateMatchId();
        const match: Match = {
          matchId,
          player1: matchedP1,
          player2: matchedP2,
          status: 'pending',
          createdAt: Date.now(),
        };
        
        matches.set(matchId, match);
        return match;
      }
    }
  }
  
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, team, betLevel } = body;

    // Validation
    if (!address || !team || !Array.isArray(team) || team.length !== 3) {
      return NextResponse.json(
        { error: 'Invalid request: address and team (3 Jablixes) required' },
        { status: 400 }
      );
    }

    if (![0, 1, 2].includes(betLevel)) {
      return NextResponse.json(
        { error: 'Invalid bet level: must be 0, 1, or 2' },
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
    const playerRating = playerRatings.get(address)!;

    // Check if player is already in queue
    const alreadyInQueue = queues[betLevel].some(entry => entry.address === address);
    if (alreadyInQueue) {
      return NextResponse.json(
        { error: 'Already in queue' },
        { status: 400 }
      );
    }

    // Create queue entry
    const queueEntry: QueueEntry = {
      id: `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      address,
      team,
      betLevel,
      rating: playerRating.rating,
      wins: playerRating.wins,
      totalGames: playerRating.totalGames,
      joinTime: Date.now(),
    };

    // Add to queue
    queues[betLevel].push(queueEntry);

    // Try to find a match immediately
    const match = findMatch(betLevel);

    if (match) {
      // Match found immediately
      const isPlayer1 = match.player1.address === address;
      return NextResponse.json({
        success: true,
        status: 'matched',
        queueId: queueEntry.id,
        matchId: match.matchId,
        isHost: isPlayer1,
        opponent: isPlayer1 ? match.player2.address : match.player1.address,
        opponentTeam: isPlayer1 ? match.player2.team : match.player1.team,
      });
    }

    // No match yet, in queue
    return NextResponse.json({
      success: true,
      status: 'queued',
      queueId: queueEntry.id,
      queuePosition: queues[betLevel].length,
    });

  } catch (error) {
    console.error('Join queue error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
