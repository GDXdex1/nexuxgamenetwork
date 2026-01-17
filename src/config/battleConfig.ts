/**
 * Battle System Configuration
 * 
 * Configuration for the real-time battle system
 * Uses Pusher for real-time communication (serverless architecture)
 * Battle logic runs in Next.js API routes on Vercel
 */

import { BATTLE_SERVER } from './suiConfig';

// ==================== BATTLE CONFIG ====================
// NOTE: Current implementation is OFF-CHAIN for MVP
// Battles run in memory via Next.js API routes
// On-chain smart contract integration available but not yet implemented
export const BATTLE_CONFIG = {
  // API endpoint for the battle gateway (VPS)
  API_URL: 'http://35.225.225.158:3000',

  // Battle timeout settings
  TURN_TIMEOUT: 20000, // 20 seconds per turn
};

// ==================== PUSHER CONFIG ====================
export const PUSHER_CONFIG = {
  KEY: 'cad7f998bc618adc2cbf',
  CLUSTER: 'us2',
};

// ==================== SOCKET EVENTS ====================
export const SOCKET_EVENTS = {
  // OUT: Cliente → Servidor
  JOIN_RANDOM: 'join_random',
  CREATE_GYM: 'create_gym',
  JOIN_GYM: 'join_gym',
  START_AI: 'start_ai',
  ACTION: 'action',

  // IN: Servidor → Cliente
  BATTLE_START: 'battle_start',
  BATTLE_UPDATE: 'battle_update',
  TURN_UPDATE: 'turn_update',
  BATTLE_END: 'battle_end',
  ERROR: 'error',

  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
};

// ==================== BATTLE MODES ====================
export type BattleMode = 'random' | 'gym' | 'ai';

export const BATTLE_MODES: Record<BattleMode, string> = {
  random: 'Random Matchmaking',
  gym: 'Private Gym',
  ai: 'AI Battle',
};

// ==================== BET LEVELS ====================
export const BET_LEVELS = {
  LOW: {
    level: 0,
    amount: 3000, // 3000 JXC
    amountSmallest: 3_000_000_000_000n,
  },
  HIGH: {
    level: 1,
    amount: 5000, // 5000 JXC
    amountSmallest: 5_000_000_000_000n,
  },
};

// ==================== BATTLE CONSTANTS ====================
export const BATTLE_CONSTANTS = {
  // Team size
  TEAM_SIZE: 3,

  // Turn timeout (seconds)
  TURN_TIMEOUT: 10,

  // Commission percentage
  COMMISSION_PCT: 3,

  // Max turns
  MAX_TURNS: 15,

  // Energy per turn
  ENERGY_PER_TURN: 1,

  // Starting energy
  STARTING_ENERGY: 3,
};

// ==================== ERROR MESSAGES ====================
export const ERROR_MESSAGES = {
  CONNECTION_FAILED: 'Failed to connect to battle server',
  DISCONNECTED: 'Disconnected from battle server',
  INVALID_TEAM: 'Invalid team composition',
  SERVER_ERROR: 'Server error occurred',
  TIMEOUT: 'Connection timeout',
  UNAUTHORIZED: 'Unauthorized action',
  BATTLE_NOT_FOUND: 'Battle not found',
  INVALID_ACTION: 'Invalid action',
};

// ==================== SUCCESS MESSAGES ====================
export const SUCCESS_MESSAGES = {
  CONNECTED: 'Connected to battle server',
  BATTLE_STARTED: 'Battle has started!',
  MATCH_FOUND: 'Match found!',
  ACTION_SUCCESS: 'Action executed successfully',
};

export default {
  BATTLE_CONFIG,
  SOCKET_EVENTS,
  BATTLE_MODES,
  BET_LEVELS,
  BATTLE_CONSTANTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};
