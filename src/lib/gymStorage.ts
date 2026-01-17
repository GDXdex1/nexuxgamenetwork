// src/lib/gymStorage.ts
// In-memory gym room storage

export interface GymRoom {
  code: string;
  hostAddress: string;
  hostTeam: string[];
  betLevel: number;
  status: 'waiting' | 'in_battle' | 'finished';
  createdAt: number;
  battleId?: string;
}

// In-memory gym storage (for MVP)
export const gyms = new Map<string, GymRoom>();
