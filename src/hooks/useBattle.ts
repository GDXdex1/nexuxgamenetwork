// src/hooks/useBattle.ts
// Battle hook using Pusher + Next.js API Routes
// SIMULTANEOUS TURN SYSTEM

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import pusher from '@/lib/pusherClient';
import type {
  BattleState,
  BattleStartEvent,
  BattleUpdateEvent,
  TurnUpdateEvent,
  BattleAction,
} from '@/types/battle.types';
import type { Channel } from 'pusher-js';

export function useBattle() {
  const account = useCurrentAccount();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [currentTurn, setCurrentTurn] = useState<number>(0);
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [isInQueue, setIsInQueue] = useState<boolean>(false);

  const userChannelRef = useRef<Channel | null>(null);
  const sessionChannelRef = useRef<Channel | null>(null);
  const battleStartCallbacksRef = useRef<Set<(data: BattleStartEvent) => void>>(new Set());
  const battleUpdateCallbacksRef = useRef<Set<(data: BattleUpdateEvent) => void>>(new Set());
  const battleEndCallbacksRef = useRef<Set<(data: any) => void>>(new Set());

  /**
   * Subscribe to user channel for matchmaking
   */
  useEffect(() => {
    if (!account?.address) return;

    const userChannel = pusher.subscribe(`user-${account.address}`);
    userChannelRef.current = userChannel;

    setIsConnected(true);
    console.log('[useBattle] ✅ Pusher connected, subscribed to user channel:', `user-${account.address}`);

    // Listen for battle_start on user channel
    userChannel.bind('battle_start', (data: BattleStartEvent) => {
      console.log('[useBattle] 🎮 Battle start received:', data);

      // Update battle state
      if (data.initialState) {
        setBattleState(data.initialState);
        setCurrentTurn(data.initialState.turn);
        
        const currentPlayerAddress = data.initialState.current_player_idx === 0
          ? data.initialState.player1.address
          : data.initialState.player2.address;
        setCurrentPlayer(currentPlayerAddress);
      }

      // Subscribe to session channel for battle updates
      if (data.battleId || data.sessionId) {
        const sessionId = data.battleId || data.sessionId;
        const sessionChannel = pusher.subscribe(`session-${sessionId}`);
        sessionChannelRef.current = sessionChannel;

        console.log('[useBattle] 🔄 Subscribed to session channel:', `session-${sessionId}`);

        // Listen for battle updates
        sessionChannel.bind('battle_update', (updateData: BattleUpdateEvent) => {
          console.log('[useBattle] 📡 Battle update received:', updateData);

          if (updateData.updates) {
            setBattleState(updateData.updates as BattleState);
          }

          // Notify callbacks
          battleUpdateCallbacksRef.current.forEach(callback => callback(updateData));
        });

        // Listen for turn updates
        sessionChannel.bind('turn_update', (turnData: TurnUpdateEvent) => {
          console.log('[useBattle] ⏰ Turn update received:', turnData);
          setCurrentTurn(turnData.turn);
          setCurrentPlayer(turnData.current_player_address);
        });

        // Listen for battle_end
        sessionChannel.bind('battle_end', (endData: any) => {
          console.log('[useBattle] 🏆 Battle end received:', endData);
          battleEndCallbacksRef.current.forEach(callback => callback(endData));
        });
      }

      setIsInQueue(false);

      // Notify callbacks
      battleStartCallbacksRef.current.forEach(callback => callback(data));
    });

    return () => {
      pusher.unsubscribe(`user-${account.address}`);
      if (sessionChannelRef.current) {
        pusher.unsubscribe(sessionChannelRef.current.name);
      }
      setIsConnected(false);
    };
  }, [account?.address]);

  /**
   * Join random matchmaking
   */
  const joinRandom = useCallback(async (team: string[], betLevel: number = 0): Promise<void> => {
    if (!account?.address) {
      throw new Error('Wallet not connected');
    }

    console.log('[useBattle] 🎲 Joining random matchmaking...');
    setIsInQueue(true);

    try {
      const response = await fetch('/api/battle/join-random', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: account.address,
          team,
          betLevel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join matchmaking');
      }

      console.log('[useBattle] ✅ Matchmaking response:', data);

      if (data.status === 'matched') {
        console.log('[useBattle] 🎉 Matched immediately!');
        // Battle start event will come via Pusher
      } else if (data.status === 'queued') {
        console.log('[useBattle] ⏳ In queue, waiting for opponent...');
        // Wait for Pusher event
      }
    } catch (error) {
      console.error('[useBattle] ❌ Join random error:', error);
      setIsInQueue(false);
      throw error;
    }
  }, [account?.address]);

  /**
   * Start AI battle
   */
  const startAI = useCallback(async (team: string[], difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Promise<void> => {
    if (!account?.address) {
      throw new Error('Wallet not connected');
    }

    console.log('[useBattle] 🤖 Starting AI battle...');

    try {
      const response = await fetch('/api/battle/start-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: account.address,
          team,
          difficulty,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start AI battle');
      }

      console.log('[useBattle] ✅ AI battle started:', data);
      // Battle start event will come via Pusher
    } catch (error) {
      console.error('[useBattle] ❌ Start AI error:', error);
      throw error;
    }
  }, [account?.address]);

  /**
   * Create gym room
   */
  const createGym = useCallback(async (team: string[], betLevel: number = 0): Promise<string> => {
    if (!account?.address) {
      throw new Error('Wallet not connected');
    }

    console.log('[useBattle] 🏋️ Creating gym...');

    try {
      const response = await fetch('/api/battle/create-gym', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: account.address,
          team,
          betLevel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create gym');
      }

      console.log('[useBattle] ✅ Gym created:', data.gymCode);
      return data.gymCode;
    } catch (error) {
      console.error('[useBattle] ❌ Create gym error:', error);
      throw error;
    }
  }, [account?.address]);

  /**
   * Join gym room
   */
  const joinGym = useCallback(async (team: string[], gymCode: string): Promise<void> => {
    if (!account?.address) {
      throw new Error('Wallet not connected');
    }

    console.log('[useBattle] 🏋️ Joining gym:', gymCode);

    try {
      const response = await fetch('/api/battle/join-gym', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: account.address,
          team,
          gymCode: gymCode.toUpperCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join gym');
      }

      console.log('[useBattle] ✅ Joined gym successfully');
      // Battle start event will come via Pusher
    } catch (error) {
      console.error('[useBattle] ❌ Join gym error:', error);
      throw error;
    }
  }, [account?.address]);

  /**
   * Send battle actions (array of moves)
   * NEW: Supports submitting multiple moves at once
   */
  const sendActions = useCallback(async (moves: BattleAction[]): Promise<void> => {
    if (!account?.address) {
      throw new Error('Wallet not connected');
    }

    if (!battleState) {
      throw new Error('No active battle');
    }

    console.log('[useBattle] ⚔️ Sending moves:', moves);

    try {
      const response = await fetch('/api/battle/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          battleId: battleState.battleId,
          playerAddress: account.address,
          moves,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send actions');
      }

      console.log('[useBattle] ✅ Actions sent successfully:', data);

      if (data.waitingForOpponent) {
        console.log('[useBattle] ⏳ Waiting for opponent to submit moves...');
      } else {
        console.log('[useBattle] ⚔️ Turn resolved! Updates coming via Pusher...');
      }

      // Battle update will come via Pusher
    } catch (error) {
      console.error('[useBattle] ❌ Send actions error:', error);
      throw error;
    }
  }, [account?.address, battleState]);

  /**
   * Cancel matchmaking
   */
  const cancelQueue = useCallback(async (): Promise<void> => {
    if (!account?.address) return;

    console.log('[useBattle] ❌ Canceling matchmaking...');
    setIsInQueue(false);

    // Call cancel API if needed
    try {
      await fetch('/api/matchmaking/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: account.address }),
      });
    } catch (error) {
      console.error('[useBattle] Error canceling queue:', error);
    }
  }, [account?.address]);

  /**
   * Event listeners
   */
  const onBattleStart = useCallback((callback: (data: BattleStartEvent) => void) => {
    battleStartCallbacksRef.current.add(callback);
    return () => {
      battleStartCallbacksRef.current.delete(callback);
    };
  }, []);

  const onBattleUpdate = useCallback((callback: (data: BattleUpdateEvent) => void) => {
    battleUpdateCallbacksRef.current.add(callback);
    return () => {
      battleUpdateCallbacksRef.current.delete(callback);
    };
  }, []);

  const onBattleEnd = useCallback((callback: (data: any) => void) => {
    battleEndCallbacksRef.current.add(callback);
    return () => {
      battleEndCallbacksRef.current.delete(callback);
    };
  }, []);

  return {
    // Connection state
    isConnected,
    isInQueue,

    // Battle state
    battleState,
    currentTurn,
    currentPlayer,
    timeRemaining,

    // Actions
    joinRandom,
    startAI,
    createGym,
    joinGym,
    sendActions, // NEW: Send array of moves
    cancelQueue,

    // Event listeners
    onBattleStart,
    onBattleUpdate,
    onBattleEnd,
  };
}
