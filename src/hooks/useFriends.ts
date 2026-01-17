/**
 * useFriends Hook
 * 
 * React hook for managing friends and online status
 */

import { useEffect, useState, useCallback } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';

export interface Friend {
  address: string;
  isOnline: boolean;
  lastSeen?: Date;
  inBattle?: boolean;
}

export interface UseFriendsReturn {
  friends: Friend[];
  onlineFriends: Friend[];
  loading: boolean;
  error: string | null;
  addFriend: (friendAddress: string) => Promise<void>;
  removeFriend: (friendAddress: string) => Promise<void>;
  refreshFriends: () => Promise<void>;
  refreshOnlineStatus: () => Promise<void>;
}

export function useFriends(): UseFriendsReturn {
  const account = useCurrentAccount();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [onlineFriends, setOnlineFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch friends list
  const fetchFriends = useCallback(async () => {
    if (!account?.address) {
      setFriends([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/friends?address=${account.address}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch friends');
      }

      // Convert addresses to Friend objects
      const friendsList: Friend[] = data.friends.map((addr: string) => ({
        address: addr,
        isOnline: false,
      }));

      setFriends(friendsList);
    } catch (err) {
      console.error('Error fetching friends:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [account?.address]);

  // Fetch online status
  const fetchOnlineStatus = useCallback(async () => {
    if (!account?.address) {
      setOnlineFriends([]);
      return;
    }

    try {
      const response = await fetch(`/api/friends/online?address=${account.address}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch online status');
      }

      // Update friends with online status
      const onlineAddresses = new Set(data.onlineFriends.map((f: any) => f.address));
      
      const updatedFriends = friends.map((friend) => ({
        ...friend,
        isOnline: onlineAddresses.has(friend.address),
        lastSeen: data.onlineFriends.find((f: any) => f.address === friend.address)?.lastSeen,
        inBattle: data.onlineFriends.find((f: any) => f.address === friend.address)?.inBattle,
      }));

      setFriends(updatedFriends);
      setOnlineFriends(updatedFriends.filter((f) => f.isOnline));
    } catch (err) {
      console.error('Error fetching online status:', err);
    }
  }, [account?.address, friends]);

  // Add friend
  const addFriend = useCallback(async (friendAddress: string) => {
    if (!account?.address) {
      throw new Error('Wallet not connected');
    }

    try {
      const response = await fetch('/api/friends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: account.address,
          friendAddress: friendAddress,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to add friend');
      }

      // Refresh friends list
      await fetchFriends();
    } catch (err) {
      console.error('Error adding friend:', err);
      throw err;
    }
  }, [account?.address, fetchFriends]);

  // Remove friend
  const removeFriend = useCallback(async (friendAddress: string) => {
    if (!account?.address) {
      throw new Error('Wallet not connected');
    }

    try {
      const response = await fetch(
        `/api/friends/${friendAddress}?address=${account.address}`,
        {
          method: 'DELETE',
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to remove friend');
      }

      // Refresh friends list
      await fetchFriends();
    } catch (err) {
      console.error('Error removing friend:', err);
      throw err;
    }
  }, [account?.address, fetchFriends]);

  // Initial fetch
  useEffect(() => {
    if (account?.address) {
      fetchFriends();
    }
  }, [account?.address, fetchFriends]);

  // Poll online status every 10 seconds
  useEffect(() => {
    if (account?.address && friends.length > 0) {
      fetchOnlineStatus();
      const interval = setInterval(fetchOnlineStatus, 10000);
      return () => clearInterval(interval);
    }
  }, [account?.address, friends.length, fetchOnlineStatus]);

  return {
    friends,
    onlineFriends,
    loading,
    error,
    addFriend,
    removeFriend,
    refreshFriends: fetchFriends,
    refreshOnlineStatus: fetchOnlineStatus,
  };
}

export default useFriends;
