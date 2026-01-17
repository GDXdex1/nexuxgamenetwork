/**
 * useBattleSocket Hook
 * 
 * React hook para manejar conexión y estado de batallas
 * Arquitectura híbrida optimizada:
 * - Pusher: Para RECIBIR eventos de batalla (battle_start, battle_update, turn_update) - Real-time
 * - API Routes (fetch): Para ENVIAR acciones al servidor - Reliable HTTP requests
 * 
 * Flujo de matchmaking:
 * 1. Cliente se suscribe a canal Pusher: user-{address} (automático)
 * 2. Cliente envía POST /api/battle/join-random
 * 3. Servidor matchmakea y hace broadcast battle_start vía Pusher
 * 4. Cliente recibe sessionId y cambia a canal session-{sessionId}
 * 5. Todas las actualizaciones de batalla llegan vía Pusher
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { pusherClient, subscribeToUser, subscribeToSession, unsubscribeFromUser, unsubscribeFromSession } from '@/lib/pusherClient';
import { BATTLE_CONFIG } from '../config/battleConfig';
import type {
  BattleState,
  BattleStartEvent,
  BattleUpdateEvent,
  TurnUpdateEvent,
  BattleEndEvent,
  BattleAction,
} from '@/types/battle.types';

export interface UseBattleSocketReturn {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;

  // Battle state
  battleState: BattleState | null;
  currentTurn: number;
  currentPlayer: string | null;
  timeRemaining: number;
  sessionId: string | null;

  // Actions
  connect: () => void;
  disconnect: () => void;
  joinRandom: (team: string[], betLevel: number) => Promise<void>;
  createGym: (team: string[], betLevel: number) => Promise<string>;
  joinGym: (team: string[], gymCode: string) => Promise<void>;
  startAI: (team: string[], difficulty?: 'easy' | 'medium' | 'hard') => Promise<void>;
  sendAction: (action: BattleAction) => Promise<void>;

  // Events
  onBattleStart: (callback: (data: BattleStartEvent) => void) => () => void;
  onBattleUpdate: (callback: (data: BattleUpdateEvent) => void) => () => void;
  onBattleEnd: (callback: (data: BattleEndEvent) => void) => () => void;
}

export function useBattleSocket(): UseBattleSocketReturn {
  const account = useCurrentAccount();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [currentTurn, setCurrentTurn] = useState<number>(0);
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(10);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const battleStartCallbacksRef = useRef<Set<(data: BattleStartEvent) => void>>(new Set());
  const battleUpdateCallbacksRef = useRef<Set<(data: BattleUpdateEvent) => void>>(new Set());
  const battleEndCallbacksRef = useRef<Set<(data: BattleEndEvent) => void>>(new Set());
  const userChannelRef = useRef<any>(null);
  const sessionChannelRef = useRef<any>(null);
  const sessionIdRef = useRef<string | null>(null);
  const isSettingUpPusherRef = useRef<boolean>(false);

  // ==================== PUSHER SETUP ====================

  /**
   * Configurar canal de usuario para matchmaking
   * Se ejecuta automáticamente al conectar
   * PUSHER ES EL SISTEMA PRINCIPAL - conexión instantánea
   */
  const setupUserChannel = useCallback((userAddress: string) => {
    if (isSettingUpPusherRef.current) {
      console.log('[useBattleSocket] ⏳ Pusher setup already in progress');
      return;
    }

    isSettingUpPusherRef.current = true;
    console.log('[useBattleSocket] 🚀 [PUSHER] Setting up user channel for:', userAddress);

    try {
      // Suscribirse al canal de usuario
      const channel = subscribeToUser(userAddress);
      userChannelRef.current = channel;

      // Escuchar battle_start en canal de usuario
      channel.bind('battle_start', (data: any) => {
        console.log('[useBattleSocket] 🎮 [PUSHER] Battle start received:', data);

        const battleStartData: BattleStartEvent = {
          sessionId: data.sessionId || data.battleId,
          battleId: data.battleId || data.sessionId,
          type: data.type || data.mode,
          player1: data.player1 || data.initialState?.p1_address,
          player2: data.player2 || data.initialState?.p2_address,
          mode: data.mode || (data.type === 'AI' ? 'ai' : data.type === 'RANDOM' ? 'random' : 'gym'),
          betLevel: data.betLevel || 0,
          initialState: data.initialState || data.state,
        };

        setBattleState(data.initialState || data.state);
        setCurrentTurn(data.initialState?.turn || data.state?.turn || 0);
        setCurrentPlayer(data.player1 || data.initialState?.p1_address);

        // Llamar callbacks registrados
        battleStartCallbacksRef.current.forEach((callback) => callback(battleStartData));

        // Cambiar a canal de sesión si hay sessionId
        if (data.sessionId || data.battleId) {
          const sid = data.sessionId || data.battleId;
          console.log('[useBattleSocket] 🔄 Switching to session channel:', sid);
          setupSessionChannel(sid);
        }
      });

      // PUSHER LISTO = SISTEMA CONECTADO
      setIsConnected(true);
      setIsConnecting(false);
      console.log('[useBattleSocket] ✅ [PUSHER READY] System connected and listening');
    } catch (err) {
      console.error('[useBattleSocket] ❌ Failed to setup Pusher:', err);
      setError('Failed to connect to battle system');
    } finally {
      isSettingUpPusherRef.current = false;
    }
  }, []);

  /**
   * Configurar canal de sesión específica
   * Se ejecuta cuando recibimos el sessionId del servidor
   */
  const setupSessionChannel = useCallback((newSessionId: string) => {
    console.log('[useBattleSocket] 📡 Setting up Pusher session channel:', newSessionId);

    // Limpiar canal anterior si existe
    if (sessionChannelRef.current && sessionIdRef.current) {
      unsubscribeFromSession(sessionIdRef.current);
    }

    // Suscribirse al canal de sesión
    const channel = subscribeToSession(newSessionId);
    sessionChannelRef.current = channel;
    sessionIdRef.current = newSessionId;
    setSessionId(newSessionId);

    // Escuchar battle_update
    channel.bind('battle_update', (data: any) => {
      console.log('[useBattleSocket] 📊 [Pusher] Battle update:', data);

      if (data.state) {
        setBattleState(data.state);

        const battleUpdateData: BattleUpdateEvent = {
          sessionId: newSessionId,
          battleId: data.state?.battleId || newSessionId,
          updates: data.state,
        };

        battleUpdateCallbacksRef.current.forEach((callback) => callback(battleUpdateData));
      }
    });

    // Escuchar turn_update
    channel.bind('turn_update', (data: any) => {
      console.log('[useBattleSocket] ⏰ [Pusher] Turn update:', data);

      setCurrentTurn(data.turn);
      setCurrentPlayer(
        data.current_player_idx === 0
          ? (battleState?.player1?.address || null)
          : (battleState?.player2?.address || null)
      );

      if (data.time_remaining !== undefined) {
        setTimeRemaining(data.time_remaining);
      }
    });

    console.log('[useBattleSocket] ✅ Pusher session channel configured');
  }, [battleState]);

  /**
   * Limpiar todos los canales de Pusher
   */
  const cleanupPusherChannels = useCallback(() => {
    console.log('[useBattleSocket] 🧹 Cleaning up Pusher channels');

    if (account?.address && userChannelRef.current) {
      unsubscribeFromUser(account.address);
      userChannelRef.current = null;
    }

    if (sessionIdRef.current && sessionChannelRef.current) {
      unsubscribeFromSession(sessionIdRef.current);
      sessionChannelRef.current = null;
      sessionIdRef.current = null;
    }

    setSessionId(null);
  }, [account?.address]);

  // ==================== CONNECTION ====================

  const connect = useCallback(() => {
    if (!account?.address) {
      console.log('[useBattleSocket] ⚠️ Cannot connect: No wallet address');
      setError('Wallet not connected');
      return;
    }

    if (isConnecting) {
      console.log('[useBattleSocket] ⏳ Already connecting...');
      return;
    }

    if (isConnected && userChannelRef.current) {
      console.log('[useBattleSocket] ✅ Already connected');
      return;
    }

    console.log('[useBattleSocket] 🚀 Connecting to battle system...');

    try {
      setIsConnecting(true);
      setError(null);

      // Configurar Pusher - Sistema principal
      setupUserChannel(account.address);
    } catch (err) {
      console.error('[useBattleSocket] ❌ Connection failed:', err);
      setError(err instanceof Error ? err.message : 'Connection failed');
      setIsConnecting(false);
    }
  }, [account?.address, isConnecting, isConnected, setupUserChannel]);

  const disconnect = useCallback(() => {
    console.log('[useBattleSocket] 🔌 Disconnecting...');
    cleanupPusherChannels();
    setIsConnected(false);
    setIsConnecting(false);
    setBattleState(null);
    setError(null);
  }, [cleanupPusherChannels]);

  // Auto-connect cuando cambia la cuenta
  useEffect(() => {
    if (!account?.address) {
      if (isConnected) {
        console.log('[useBattleSocket] 🔌 Disconnecting due to no account');
        disconnect();
      }
      return;
    }

    if (isConnected && userChannelRef.current) {
      console.log('[useBattleSocket] ✅ Already connected');
      return;
    }

    if (isConnecting) {
      return;
    }

    console.log('[useBattleSocket] 🚀 Auto-connecting...');
    const timer = setTimeout(() => {
      connect();
    }, 100);

    return () => clearTimeout(timer);
  }, [account?.address, isConnected, isConnecting, connect, disconnect]);

  // Cleanup en unmount
  useEffect(() => {
    return () => {
      cleanupPusherChannels();
    };
  }, [cleanupPusherChannels]);

  // ==================== API ACTIONS (fetch) ====================

  const joinRandom = useCallback(async (team: string[], betLevel: number) => {
    if (!account?.address) {
      console.error('[useBattleSocket] ❌ Cannot join random: No wallet address');
      setError('Wallet not connected');
      return;
    }

    console.log('[useBattleSocket] ═══════════════════════════════════');
    console.log('[useBattleSocket] 🎲 JOIN RANDOM MATCHMAKING');
    console.log('[useBattleSocket] ═══════════════════════════════════');
    console.log('[useBattleSocket] 👤 User Address:', account.address);
    console.log('[useBattleSocket] 🎴 Team Size:', team.length);
    console.log('[useBattleSocket] 💰 Bet Level:', betLevel);

    try {
      console.log('[useBattleSocket] 📤 Sending POST /api/battle/join-random...');

      const response = await fetch(`${BATTLE_CONFIG.API_URL}/api/battle/join-random`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: account.address,
          team,
          betLevel,
        }),
      });

      const data = await response.json();
      console.log('[useBattleSocket] 📥 Response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join matchmaking');
      }

      if (data.status === 'matched') {
        console.log('[useBattleSocket] ✅ Match found! Battle ID:', data.battleId);
      } else {
        console.log('[useBattleSocket] ⏳ In queue, waiting for opponent...');
        console.log('[useBattleSocket] 📡 Will receive battle_start via Pusher');
      }
    } catch (err) {
      console.error('[useBattleSocket] ❌ Error joining random:', err);
      setError(err instanceof Error ? err.message : 'Failed to join matchmaking');
      throw err;
    }
  }, [account?.address]);

  const createGym = useCallback(async (team: string[], betLevel: number): Promise<string> => {
    if (!account?.address) {
      setError('Wallet not connected');
      throw new Error('Wallet not connected');
    }

    console.log('[useBattleSocket] 🏋️ Creating gym...');

    try {
      const response = await fetch(`${BATTLE_CONFIG.API_URL}/api/battle/create-gym`, {
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

      console.log('[useBattleSocket] ✅ Gym created:', data.gymCode);
      return data.gymCode;
    } catch (err) {
      console.error('[useBattleSocket] ❌ Error creating gym:', err);
      setError(err instanceof Error ? err.message : 'Failed to create gym');
      throw err;
    }
  }, [account?.address]);

  const joinGym = useCallback(async (team: string[], gymCode: string) => {
    if (!account?.address) {
      setError('Wallet not connected');
      throw new Error('Wallet not connected');
    }

    console.log('[useBattleSocket] 🚪 Joining gym:', gymCode);

    try {
      const response = await fetch(`${BATTLE_CONFIG.API_URL}/api/battle/join-gym`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: account.address,
          team,
          gymCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join gym');
      }

      console.log('[useBattleSocket] ✅ Joined gym successfully');
    } catch (err) {
      console.error('[useBattleSocket] ❌ Error joining gym:', err);
      setError(err instanceof Error ? err.message : 'Failed to join gym');
      throw err;
    }
  }, [account?.address]);

  const startAI = useCallback(async (team: string[], difficulty: 'easy' | 'medium' | 'hard' = 'medium') => {
    if (!account?.address) {
      setError('Wallet not connected');
      throw new Error('Wallet not connected');
    }

    console.log('[useBattleSocket] 🤖 Starting AI battle...');

    try {
      const response = await fetch(`${BATTLE_CONFIG.API_URL}/api/battle/start-ai`, {
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

      console.log('[useBattleSocket] ✅ AI battle started:', data.battleId);
    } catch (err) {
      console.error('[useBattleSocket] ❌ Error starting AI battle:', err);
      setError(err instanceof Error ? err.message : 'Failed to start AI battle');
      throw err;
    }
  }, [account?.address]);

  // ==================== BATTLE ACTIONS ====================

  const sendAction = useCallback(async (action: BattleAction) => {
    if (!account?.address) {
      setError('Wallet not connected');
      throw new Error('Wallet not connected');
    }

    console.log('[useBattleSocket] ⚡ Sending action:', action);

    try {
      const response = await fetch(`${BATTLE_CONFIG.API_URL}/api/battle/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          battleId: action.sessionId || sessionId,
          playerAddress: account.address,
          jablix_idx: action.jablix_idx,
          card_idx: action.card_idx,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to execute action');
      }

      console.log('[useBattleSocket] ✅ Action executed successfully');

      if (data.battleEnded) {
        console.log('[useBattleSocket] 🏁 Battle ended, winner:', data.winner);
        const endEvent: BattleEndEvent = {
          battleId: sessionId || action.sessionId || '',
          winner: data.winner,
          loser: data.loser || '',
          finalState: battleState || {} as BattleState,
          rewards: data.rewards || { winner: 0, loser: 0 },
          log_hash: data.log_hash || '',
          server_signature: data.server_signature || '',
        };
        battleEndCallbacksRef.current.forEach((callback) => callback(endEvent));
        cleanupPusherChannels();
      }
    } catch (err) {
      console.error('[useBattleSocket] ❌ Error sending action:', err);
      setError(err instanceof Error ? err.message : 'Failed to execute action');
      throw err;
    }
  }, [account?.address, sessionId, battleState, cleanupPusherChannels]);

  // ==================== EVENT CALLBACKS ====================

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

  const onBattleEnd = useCallback((callback: (data: BattleEndEvent) => void) => {
    battleEndCallbacksRef.current.add(callback);
    return () => {
      battleEndCallbacksRef.current.delete(callback);
    };
  }, []);

  return {
    // Connection state
    isConnected,
    isConnecting,
    error,

    // Battle state
    battleState,
    currentTurn,
    currentPlayer,
    timeRemaining,
    sessionId,

    // Actions
    connect,
    disconnect,
    joinRandom,
    createGym,
    joinGym,
    startAI,
    sendAction,

    // Events
    onBattleStart,
    onBattleUpdate,
    onBattleEnd,
  };
}

export default useBattleSocket;
