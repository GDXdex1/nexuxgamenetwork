'use client';

import { useEffect, useRef } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { toast } from 'sonner';

/**
 * Simple Wallet Session Manager
 * - Auto-disconnect after 30 minutes of inactivity
 * - Session persistence in localStorage
 * - Activity detection to extend session
 */

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const SESSION_STORAGE_KEY = 'slush_wallet_session';

interface SessionData {
  address: string;
  connectedAt: number;
  lastActivity: number;
}

export function useWalletSession(): void {
  const account = useCurrentAccount();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Save session to localStorage
  const saveSession = (address: string): void => {
    const sessionData: SessionData = {
      address,
      connectedAt: Date.now(),
      lastActivity: Date.now(),
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
    }
  };

  // Update last activity
  const updateActivity = (): void => {
    if (typeof window === 'undefined') return;
    
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) return;
    
    try {
      const session: SessionData = JSON.parse(stored);
      session.lastActivity = Date.now();
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  };

  // Clear session
  const clearSession = (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  };

  // Handle timeout
  const handleTimeout = (): void => {
    console.log('Session expired due to inactivity');
    toast.error('Session Expired', {
      description: 'Your wallet has been disconnected due to 30 minutes of inactivity.',
      duration: 5000,
    });
    clearSession();
  };

  // Reset timer
  const resetTimer = (): void => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    updateActivity();

    timeoutRef.current = setTimeout(() => {
      handleTimeout();
    }, INACTIVITY_TIMEOUT);
  };

  // Manage session when wallet connects/disconnects
  useEffect(() => {
    if (account) {
      console.log('Wallet connected:', account.address);
      saveSession(account.address);

      // Show connection notification
      toast.success('Wallet Connected', {
        description: `Connected to ${account.address.slice(0, 6)}...${account.address.slice(-4)}`,
        duration: 3000,
      });

      // Set up activity listeners
      const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];
      
      activityEvents.forEach(event => {
        window.addEventListener(event, resetTimer, { passive: true });
      });

      // Initialize timer
      resetTimer();

      // Cleanup
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        activityEvents.forEach(event => {
          window.removeEventListener(event, resetTimer);
        });
      };
    } else {
      // Wallet disconnected
      console.log('Wallet disconnected');
      clearSession();
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [account?.address]);
}
