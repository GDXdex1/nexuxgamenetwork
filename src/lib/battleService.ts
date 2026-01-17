// src/lib/battleService.ts
// Server-side battle management service with card-based combat

import type { BattleState, JablixBattleStats, PlayerBattleState, BattleAction } from '@/types/battle.types';
import { getJablixById } from '@/data/jablixDatabase';
import { broadcastBattleStart, broadcastBattleUpdate, broadcastTurnUpdate } from './pusherServer';
import { CARD_DATABASE } from '@/data/cardDatabase';
import type { Jablix, Card } from '@/types/game.types';
import { CardEffectType, TargetType, Element } from '@/types/game.types';
import { playCard, getAliveJabs, calculateDamage, applyDamage } from '@/utils/battleEngine';

// In-memory storage for battles
export const activeBattles = new Map<string, BattleState>();

// Store pending actions for turn resolution
export const pendingActions = new Map<string, {
  player1Moves?: BattleAction[];
  player2Moves?: BattleAction[];
}>();

// ==================== BATTLE ID GENERATION ====================

/**
 * Generate unique battle ID
 */
export function generateBattleId(): string {
  return `battle_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// ==================== JABLIX CONVERSION ====================

/**
 * Convert Jablix ID to battle stats with CORRECT energy (3 per turn)
 */
export function jablixToBattleStats(jablixId: string): JablixBattleStats {
  const templateId = parseInt(jablixId);
  const template = getJablixById(templateId);

  if (!template) {
    throw new Error(`Jablix template not found: ${jablixId}`);
  }

  return {
    jablixId,
    name: template.name,
    element: template.elements[0] || 'Normal',
    hp: template.hp,
    maxHp: template.hp,
    energy: 3, // START WITH 3 ENERGY (Axie-style)
    maxEnergy: 3,
    attack: template.baseAttack,
    defense: template.baseDefense,
    speed: template.speed,
    status_effects: [],
    is_alive: true,
  };
}

/**
 * Convert battle stats to game engine format
 */
function battleStatsToJablix(stats: JablixBattleStats): Jablix {
  return {
    id: stats.jablixId,
    name: stats.name,
    elements: [stats.element as Element],
    imageUrl: '',
    hp: stats.hp,
    maxHp: stats.maxHp,
    speed: stats.speed,
    baseAttack: stats.attack,
    baseDefense: stats.defense,
    energy: stats.energy,
    maxEnergy: stats.maxEnergy,
    cards: [],
    currentAttackBuff: 0,
    currentDefenseBuff: 0,
    shield: 0,
    isStunned: false,
    statusEffects: [],
  };
}

/**
 * Convert game engine format back to battle stats
 */
function jablixToBattleStatsFromEngine(jablix: Jablix): JablixBattleStats {
  return {
    jablixId: jablix.id,
    name: jablix.name,
    element: jablix.elements[0].toString(),
    hp: jablix.hp,
    maxHp: jablix.maxHp,
    energy: jablix.energy,
    maxEnergy: jablix.maxEnergy,
    attack: jablix.baseAttack,
    defense: jablix.baseDefense,
    speed: jablix.speed,
    status_effects: [],
    is_alive: jablix.hp > 0,
  };
}

// ==================== BATTLE CREATION ====================

/**
 * Create battle immediately (for random matchmaking and gym)
 */
export async function createBattle(
  player1Address: string,
  player2Address: string,
  player1Team: string[],
  player2Team: string[],
  mode: 'random' | 'gym' | 'ai'
): Promise<BattleState> {
  const battleId = generateBattleId();

  // Convert teams to battle stats
  const p1Stats: JablixBattleStats[] = player1Team.map(jablixToBattleStats);
  const p2Stats: JablixBattleStats[] = player2Team.map(jablixToBattleStats);

  const battleState: BattleState = {
    battleId,
    player1: {
      address: player1Address,
      team: p1Stats,
      ready: true,
      connected: true,
    },
    player2: {
      address: player2Address,
      team: p2Stats,
      ready: true,
      connected: true,
    },
    turn: 1,
    current_player_idx: 0, // Both players act simultaneously, so this tracks whose "turn" it is to wait
    mode,
    log_hash: generateLogHash(battleId, 0),
    status: 'active',
    created_at: Date.now(),
    updated_at: Date.now(),
  };

  activeBattles.set(battleId, battleState);
  pendingActions.set(battleId, {}); // Initialize pending actions

  // Broadcast battle start via Pusher
  await broadcastBattleStart(battleId, player1Address, player2Address, battleState);

  console.log(`[BattleService] 🎮 Battle created: ${battleId}`);
  console.log(`[BattleService] 📡 Mode: ${mode}`);
  console.log(`[BattleService] 👥 Players: ${player1Address} vs ${player2Address}`);
  console.log(`[BattleService] ⚡ Energy System: 3 per Jablix per turn`);

  // If AI mode, DO NOT schedule AI moves here - they will be scheduled after player moves
  // This prevents the AI from moving before the player
  console.log('[BattleService] ⏳ AI will respond after player submits moves');

  return battleState;
}

/**
 * Create AI battle (player vs AI)
 */
export async function createAIBattle(
  playerAddress: string,
  playerTeam: string[],
  aiTeam: string[]
): Promise<BattleState> {
  return createBattle(playerAddress, 'AI_OPPONENT', playerTeam, aiTeam, 'ai');
}

// ==================== TURN RESOLUTION ====================

/**
 * Submit player moves
 */
export async function submitMoves(
  battleId: string,
  playerAddress: string,
  moves: BattleAction[]
): Promise<{ success: boolean; message: string; waitingForOpponent?: boolean }> {
  const battle = activeBattles.get(battleId);
  if (!battle) {
    throw new Error(`Battle not found: ${battleId}`);
  }

  if (battle.status !== 'active') {
    throw new Error('Battle is not active');
  }

  const isPlayer1 = battle.player1.address === playerAddress;
  const isPlayer2 = battle.player2.address === playerAddress;

  if (!isPlayer1 && !isPlayer2) {
    throw new Error('You are not a participant in this battle');
  }

  // Store moves
  const pending = pendingActions.get(battleId) || {};
  if (isPlayer1) {
    pending.player1Moves = moves;
  } else {
    pending.player2Moves = moves;
  }
  pendingActions.set(battleId, pending);

  console.log(`[BattleService] 📝 Moves submitted by ${playerAddress}`);
  console.log(`[BattleService] 🎯 Moves: ${JSON.stringify(moves)}`);

  // For AI mode: If player submits moves, immediately schedule AI response
  if (battle.mode === 'ai' && isPlayer1 && !pending.player2Moves) {
    console.log('[BattleService] 🤖 Player moved, scheduling AI response in 2 seconds...');
    setTimeout(async () => {
      const currentPending = pendingActions.get(battleId);
      if (currentPending && currentPending.player1Moves && !currentPending.player2Moves) {
        await scheduleAIMoves(battleId);
      }
    }, 2000);
    return { success: true, message: 'Waiting for AI opponent...', waitingForOpponent: true };
  }

  // Check if both players have submitted moves
  if (pending.player1Moves && pending.player2Moves) {
    console.log('[BattleService] ⚔️ Both players ready! Resolving turn...');
    await resolveTurn(battleId, pending.player1Moves, pending.player2Moves);

    // Clear pending actions
    pendingActions.set(battleId, {});

    return { success: true, message: 'Turn resolved' };
  } else {
    console.log('[BattleService] ⏳ Waiting for opponent...');
    return { success: true, message: 'Waiting for opponent', waitingForOpponent: true };
  }
}

/**
 * Resolve turn with both players' moves
 */
async function resolveTurn(
  battleId: string,
  player1Moves: BattleAction[],
  player2Moves: BattleAction[]
): Promise<void> {
  const battle = activeBattles.get(battleId);
  if (!battle) {
    throw new Error(`Battle not found: ${battleId}`);
  }

  console.log('[BattleService] ═══════════════════════════════════════');
  console.log('[BattleService] ⚔️ RESOLVING TURN', battle.turn);
  console.log('[BattleService] ═══════════════════════════════════════');

  // Convert to game engine format
  const p1Team: Jablix[] = battle.player1.team.map(battleStatsToJablix);
  const p2Team: Jablix[] = battle.player2.team.map(battleStatsToJablix);

  const battleLog: string[] = [];

  // Execute player 1 moves
  console.log('[BattleService] 👤 Player 1 moves:', player1Moves);
  for (const move of player1Moves) {
    const attacker = p1Team[move.jablix_idx];
    if (!attacker || attacker.hp <= 0) continue;

    // Get card from database (simplified - should match card from blockchain)
    const cardKeys = Object.keys(CARD_DATABASE);
    const cardKey = cardKeys[move.card_idx % cardKeys.length];
    const card = CARD_DATABASE[cardKey];

    if (attacker.energy >= card.energyCost) {
      playCard(attacker, card, p1Team, p2Team, 0, true, battleLog);
    } else {
      battleLog.push(`${attacker.name} doesn't have enough energy!`);
    }
  }

  // Execute player 2 moves
  console.log('[BattleService] 👤 Player 2 moves:', player2Moves);
  for (const move of player2Moves) {
    const attacker = p2Team[move.jablix_idx];
    if (!attacker || attacker.hp <= 0) continue;

    const cardKeys = Object.keys(CARD_DATABASE);
    const cardKey = cardKeys[move.card_idx % cardKeys.length];
    const card = CARD_DATABASE[cardKey];

    if (attacker.energy >= card.energyCost) {
      playCard(attacker, card, p2Team, p1Team, 0, true, battleLog);
    } else {
      battleLog.push(`${attacker.name} doesn't have enough energy!`);
    }
  }

  // Reset energy for next turn (Axie-style)
  p1Team.forEach(j => { if (j.hp > 0) j.energy = 3; });
  p2Team.forEach(j => { if (j.hp > 0) j.energy = 3; });

  // Update battle state
  battle.player1.team = p1Team.map(jablixToBattleStatsFromEngine);
  battle.player2.team = p2Team.map(jablixToBattleStatsFromEngine);

  console.log('[BattleService] 📜 Battle log:', battleLog);

  // Check for winner
  const p1Alive = getAliveJabs(p1Team).length;
  const p2Alive = getAliveJabs(p2Team).length;

  if (p1Alive === 0 || p2Alive === 0) {
    const winner = p1Alive > 0 ? battle.player1.address : battle.player2.address;
    console.log(`[BattleService] 🏆 Battle ended! Winner: ${winner}`);
    await endBattle(battleId, winner);
    return;
  }

  // Next turn
  battle.turn += 1;
  battle.updated_at = Date.now();

  await broadcastBattleUpdate(battleId, battle);
  await broadcastTurnUpdate(battleId, battle.turn, battle.current_player_idx, battle.player1.address);

  console.log(`[BattleService] ✅ Turn ${battle.turn - 1} resolved. Next turn: ${battle.turn}`);

  // AI will respond after player submits next moves (no automatic scheduling here)
}

// ==================== AI SYSTEM ====================

/**
 * Generate AI team
 */
export function generateAITeam(): string[] {
  const team: string[] = [];
  const usedIds = new Set<number>();

  while (team.length < 3) {
    const randomId = Math.floor(Math.random() * 95) + 1;
    if (!usedIds.has(randomId)) {
      usedIds.add(randomId);
      team.push(randomId.toString());
    }
  }

  return team;
}

/**
 * AI selects moves automatically
 */
function selectAIMoves(aiTeam: JablixBattleStats[]): BattleAction[] {
  const moves: BattleAction[] = [];
  const cardKeys = Object.keys(CARD_DATABASE);

  // Select up to 3 cards (or until out of energy)
  let totalEnergy = 3;
  
  for (let i = 0; i < aiTeam.length && totalEnergy > 0; i++) {
    const jablix = aiTeam[i];
    if (!jablix.is_alive) continue;

    // Find affordable cards
    const affordableCards = cardKeys
      .map((key, idx) => ({ card: CARD_DATABASE[key], idx }))
      .filter(c => c.card.energyCost <= totalEnergy);

    if (affordableCards.length === 0) break;

    // Pick random card
    const selected = affordableCards[Math.floor(Math.random() * affordableCards.length)];
    
    moves.push({
      sessionId: '', // Will be filled by caller
      jablix_idx: i,
      card_idx: selected.idx,
    });

    totalEnergy -= selected.card.energyCost;
  }

  console.log('[BattleService] 🤖 AI selected moves:', moves);
  return moves;
}

/**
 * Schedule AI moves automatically
 */
async function scheduleAIMoves(battleId: string): Promise<void> {
  const battle = activeBattles.get(battleId);
  if (!battle || battle.status !== 'active') return;

  if (battle.mode !== 'ai') return;

  const aiMoves = selectAIMoves(battle.player2.team);
  
  // Submit AI moves
  const pending = pendingActions.get(battleId) || {};
  pending.player2Moves = aiMoves;
  pendingActions.set(battleId, pending);

  console.log('[BattleService] 🤖 AI moves submitted automatically');

  // Check if player has also submitted
  if (pending.player1Moves && pending.player2Moves) {
    await resolveTurn(battleId, pending.player1Moves, pending.player2Moves);
    pendingActions.set(battleId, {});
  }
}

// ==================== BATTLE UTILITIES ====================

/**
 * Generate log hash for deterministic verification
 */
export function generateLogHash(battleId: string, turn: number): string {
  return `hash_${battleId}_turn${turn}`;
}

/**
 * Get battle by ID
 */
export function getBattle(battleId: string): BattleState | undefined {
  return activeBattles.get(battleId);
}

/**
 * Update battle state
 */
export async function updateBattle(battleId: string, updates: Partial<BattleState>): Promise<void> {
  const battle = activeBattles.get(battleId);
  if (!battle) {
    throw new Error(`Battle not found: ${battleId}`);
  }

  Object.assign(battle, updates, { updated_at: Date.now() });
  await broadcastBattleUpdate(battleId, battle);
}

/**
 * End battle
 */
export async function endBattle(battleId: string, winner: string): Promise<void> {
  const battle = activeBattles.get(battleId);
  if (!battle) {
    throw new Error(`Battle not found: ${battleId}`);
  }

  battle.status = 'finished';
  battle.winner = winner;
  battle.updated_at = Date.now();

  await broadcastBattleUpdate(battleId, battle);

  console.log(`[BattleService] 🏁 Battle ended: ${battleId}, winner: ${winner}`);

  // Clean up after 5 minutes
  setTimeout(() => {
    activeBattles.delete(battleId);
    pendingActions.delete(battleId);
    console.log(`[BattleService] 🧹 Battle cleaned up: ${battleId}`);
  }, 5 * 60 * 1000);
}
