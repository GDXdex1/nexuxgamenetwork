// src/lib/pusherServer.ts
// Server-side Pusher instance for broadcasting events

import Pusher from 'pusher';

// Pusher Server Configuration
// These values are hardcoded for deployment but can be overridden with env vars
const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID || '2102840',
  key: process.env.PUSHER_KEY || 'cad7f998bc618adc2cbf',
  secret: process.env.PUSHER_SECRET || 'eb1a698d8df6dfd3efa7',
  cluster: process.env.PUSHER_CLUSTER || 'us2',
  useTLS: true,
});

export default pusherServer;

/**
 * Broadcast battle start event to player channels
 */
export async function broadcastBattleStart(
  battleId: string,
  player1Address: string,
  player2Address: string,
  initialState: any
): Promise<void> {
  const event = {
    battleId,
    sessionId: battleId,
    player1: player1Address,
    player2: player2Address,
    mode: initialState.mode || 'random',
    initialState,
  };

  // Broadcast to both player channels
  await Promise.all([
    pusherServer.trigger(`user-${player1Address}`, 'battle_start', event),
    pusherServer.trigger(`user-${player2Address}`, 'battle_start', event),
  ]);

  console.log(`[Pusher] ✅ battle_start broadcast to: ${player1Address}, ${player2Address}`);
}

/**
 * Broadcast battle update to session channel
 */
export async function broadcastBattleUpdate(
  battleId: string,
  updates: any
): Promise<void> {
  await pusherServer.trigger(`session-${battleId}`, 'battle_update', {
    sessionId: battleId,
    state: updates,
    result: updates.lastActionResult, // Include action result for damage animations
    action: updates.lastAction, // Include action details
    updates: {
      player1: updates.player1,
      player2: updates.player2,
    },
  });

  console.log(`[Pusher] ✅ battle_update broadcast to session-${battleId}`);
}

/**
 * Broadcast turn update to session channel
 */
export async function broadcastTurnUpdate(
  battleId: string,
  turn: number,
  currentPlayerIdx: number,
  currentPlayerAddress: string
): Promise<void> {
  await pusherServer.trigger(`session-${battleId}`, 'turn_update', {
    turn,
    current_player_idx: currentPlayerIdx,
    current_player_address: currentPlayerAddress,
    time_remaining: 60,
  });

  console.log(`[Pusher] ✅ turn_update broadcast to session-${battleId}, turn: ${turn}`);
}
