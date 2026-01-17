'use client';

import { useState, useEffect } from 'react';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { OBJECT_TYPES } from '@/config/suiConfig';

export interface GymNFT {
  id: string;
  name: string;
  owner: string;
  createdAt: number;
  battlesPlayed: number;
  wins: number;
  losses: number;
}

/**
 * Hook to fetch and manage user's Gym NFTs
 */
export function useUserGyms() {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const [gyms, setGyms] = useState<GymNFT[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGyms = async () => {
    if (!account?.address) {
      setGyms([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('[useUserGyms] Fetching gyms for address:', account.address);
      console.log('[useUserGyms] Using Gym type:', OBJECT_TYPES.GYM);

      // Fetch all Gym NFTs owned by the user
      const response = await suiClient.getOwnedObjects({
        owner: account.address,
        filter: {
          StructType: OBJECT_TYPES.GYM,
        },
        options: {
          showContent: true,
          showType: true,
        },
      });

      console.log('[useUserGyms] Raw response:', JSON.stringify(response, null, 2));
      console.log('[useUserGyms] Number of objects found:', response.data.length);

      // Parse gym data
      const parsedGyms: GymNFT[] = response.data
        .map((obj, index) => {
          console.log(`[useUserGyms] Processing object ${index}:`, obj);
          
          if (!obj.data) {
            console.warn('[useUserGyms] No data in object:', obj);
            return null;
          }
          
          if (obj.data.content?.dataType !== 'moveObject') {
            console.warn('[useUserGyms] Invalid dataType:', obj.data.content?.dataType);
            return null;
          }

          const fields = obj.data.content.fields as Record<string, any>;
          console.log(`[useUserGyms] Gym ${index} fields:`, JSON.stringify(fields, null, 2));

          return {
            id: obj.data.objectId,
            name: 'Gym Building', // Contract sets this as default
            owner: account.address,
            createdAt: parseInt(fields.created_at || '0'),
            battlesPlayed: parseInt(fields.battles_played || '0'),
            wins: parseInt(fields.wins || '0'),
            losses: parseInt(fields.losses || '0'),
          };
        })
        .filter((gym): gym is GymNFT => gym !== null);

      console.log('[useUserGyms] Parsed gyms:', parsedGyms);
      setGyms(parsedGyms);
    } catch (err) {
      console.error('[useUserGyms] Error fetching gyms:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch gyms');
      setGyms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGyms();
  }, [account?.address]);

  return {
    gyms,
    loading,
    error,
    refetch: fetchGyms,
    hasGyms: gyms.length > 0,
  };
}
