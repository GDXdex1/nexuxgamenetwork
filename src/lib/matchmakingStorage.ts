// In-memory storage for matchmaking
// In production, use Redis or MongoDB

interface QueueEntry {
  id: string;
  address: string;
  team: string[];
  betLevel: number;
  rating: number;
  wins: number;
  totalGames: number;
  joinTime: number;
}

interface Match {
  matchId: string;
  player1: QueueEntry;
  player2: QueueEntry;
  status: 'pending' | 'active' | 'completed';
  createdAt: number;
}

interface PlayerRating {
  rating: number;
  wins: number;
  totalGames: number;
}

// Global storage (shared across API routes)
export const queues: QueueEntry[][] = [[], [], []]; // 3 bet levels
export const matches: Map<string, Match> = new Map();
export const playerRatings: Map<string, PlayerRating> = new Map();

// Constants
export const INITIAL_RATING = 1000;
export const RATING_MATCH_THRESHOLD = 200;
export const MAX_QUEUE_TIME = 300000; // 5 minutes

export type { QueueEntry, Match, PlayerRating };
