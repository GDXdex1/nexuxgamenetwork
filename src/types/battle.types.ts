/**
 * Battle System Type Definitions
 * 
 * Comprehensive type definitions for the off-chain battle system
 */

// ==================== BATTLE STATE ====================
export interface BattleState {
  battleId: string;
  player1: PlayerBattleState;
  player2: PlayerBattleState;
  turn: number;
  current_player_idx: 0 | 1; // 0 = player1, 1 = player2
  mode: 'random' | 'gym' | 'ai';
  log_hash: string; // SHA-256 hash determinista
  status: 'pending' | 'active' | 'finished';
  winner?: string;
  created_at: number;
  updated_at: number;
}

export interface PlayerBattleState {
  address: string;
  team: JablixBattleStats[];
  ready: boolean;
  connected: boolean;
}

export interface JablixBattleStats {
  jablixId: string;
  name: string;
  element: string;
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  attack: number;
  defense: number;
  speed: number;
  status_effects: StatusEffect[];
  is_alive: boolean;
}

export interface StatusEffect {
  type: 'burn' | 'poison' | 'freeze' | 'stun' | 'buff' | 'debuff';
  duration: number;
  value?: number;
}

// ==================== BATTLE ACTIONS ====================
export interface BattleAction {
  sessionId: string; // Battle session ID
  jablix_idx: number; // Index of the Jablix performing the action (0-2)
  card_idx: number; // Index of the card to play (0-3)
}

export interface BattleActionResult {
  success: boolean;
  damage?: number;
  healing?: number;
  status_applied?: StatusEffect;
  miss?: boolean;
  critical?: boolean;
  message: string;
}

// ==================== MATCHMAKING ====================
export interface MatchmakingRequest {
  address: string;
  team: string[]; // Array de Jablix IDs
  betLevel: number;
  mode: 'random' | 'gym' | 'ai';
  gymCode?: string;
}

export interface MatchmakingResponse {
  success: boolean;
  status: 'queued' | 'matched';
  queueId?: string;
  matchId?: string;
  battleId?: string;
  opponent?: string;
  isHost?: boolean;
  queueSize?: number;
  error?: string;
}

export interface MatchData {
  matchId: string;
  battleId?: string;
  playerTeam: string[];
  enemyTeam?: string[];
  isHost: boolean;
  mode: 'random' | 'gym' | 'ai';
  betLevel: number;
}

// ==================== SOCKET EVENTS ====================
export interface BattleStartEvent {
  battleId: string;
  sessionId?: string; // Pusher session ID
  player1: string;
  player2: string;
  mode: 'random' | 'gym' | 'ai';
  betLevel: number;
  initialState: BattleState;
  type?: 'AI' | 'RANDOM' | 'GYM'; // Pusher battle type
}

export interface BattleUpdateEvent {
  battleId: string;
  sessionId?: string; // Pusher session ID
  updates: Partial<BattleState>;
  action?: BattleAction;
  result?: BattleActionResult;
}

export interface TurnUpdateEvent {
  battleId: string;
  turn: number;
  current_player_idx: 0 | 1;
  current_player_address: string;
  time_remaining: number;
}

export interface BattleEndEvent {
  battleId: string;
  winner: string;
  loser: string;
  finalState: BattleState;
  rewards: {
    winner: number;
    loser: number;
  };
  log_hash: string;
  server_signature: string;
}

export interface BattleErrorEvent {
  battleId?: string;
  error: string;
  code: string;
  timestamp: number;
}

// ==================== BATTLE RESULT (ON-CHAIN) ====================
export interface BattleResult {
  battle_id: string;
  winner: string;
  total_rewards: number;
  reason: string;
  timestamp: number;
  log_hash: string;
  server_signature: string;
}

// ==================== COMMIT-REVEAL ====================
export interface TeamCommitment {
  player: string;
  team_hash: string;
  salt: string;
  team_ids: string[];
  timestamp: number;
}

export interface TeamReveal {
  player: string;
  team_ids: string[];
  salt: string;
}

// ==================== GYM SYSTEM ====================
export interface GymRoom {
  gymCode: string;
  host: string;
  betLevel: number;
  status: 'waiting' | 'full' | 'in_progress';
  created_at: number;
}

export interface CreateGymRequest {
  address: string;
  team: string[];
  betLevel: number;
}

export interface CreateGymResponse {
  success: boolean;
  gymCode: string;
  error?: string;
}

export interface JoinGymRequest {
  address: string;
  team: string[];
  gymCode: string;
}

export interface JoinGymResponse {
  success: boolean;
  battleId?: string;
  error?: string;
}

// ==================== AI BATTLE ====================
export interface StartAIRequest {
  address: string;
  team: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface StartAIResponse {
  success: boolean;
  battleId: string;
  aiTeam: JablixBattleStats[];
  error?: string;
}

// ==================== HELPER TYPES ====================
export type BattleMode = 'random' | 'gym' | 'ai';

export type PlayerIndex = 0 | 1;

export type BattleStatus = 'pending' | 'active' | 'finished' | 'cancelled';

export type ActionType = 'attack' | 'defend' | 'special' | 'switch';

// ==================== EXPORTS ====================
export default {
  // Types are exported individually above
};
