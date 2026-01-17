'use client';

import { useCurrentAccount, useSuiClientQuery, useSuiClient } from '@mysten/dapp-kit';
import { useEffect, useState } from 'react';
import { COIN_TYPES, OBJECT_TYPES, PACKAGE_ID } from '@/config/suiConfig';
import type { Jablix as BaseJablix } from '@/types/game.types';
import { JABLIX_TEMPLATES } from '@/data/jablixDatabase';

/**
 * Card interface from blockchain
 */
export interface BlockchainCard {
  name: string;
  element: string;
  type_: string;
  energy_cost: number;
  effect: string;
  damage: number;
}

/**
 * Extended Jablix type with blockchain-specific fields
 */
export interface Jablix {
  id: string;
  type: 'elemental' | 'special';
  type_id: number;
  name: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  energy: number;
  element1: string;
  element2: string | null;
  phase: number;
  image: string;
  cards: BlockchainCard[]; // Cards from blockchain
}

/**
 * Hook to get JXC balance for current account
 */
export function useJxcBalance() {
  const account = useCurrentAccount();
  
  return useSuiClientQuery(
    'getBalance',
    {
      owner: account?.address || '',
      coinType: COIN_TYPES.JXC,
    },
    {
      enabled: !!account?.address,
      refetchInterval: 30000, // Refetch every 30 seconds (optimized)
      staleTime: 20000, // Consider data fresh for 20 seconds
    }
  );
}

/**
 * Hook to get SUI balance for current account
 */
export function useSuiBalance() {
  const account = useCurrentAccount();
  
  return useSuiClientQuery(
    'getBalance',
    {
      owner: account?.address || '',
      coinType: COIN_TYPES.SUI,
    },
    {
      enabled: !!account?.address,
      refetchInterval: 30000, // Refetch every 30 seconds (optimized)
      staleTime: 20000, // Consider data fresh for 20 seconds
    }
  );
}

/**
 * Hook to get JXC Coin objects owned by current account
 */
export function useJxcCoins() {
  const account = useCurrentAccount();
  
  return useSuiClientQuery(
    'getCoins',
    {
      owner: account?.address || '',
      coinType: COIN_TYPES.JXC,
    },
    {
      enabled: !!account?.address,
      refetchInterval: 30000, // Refetch every 30 seconds (optimized)
      staleTime: 20000, // Consider data fresh for 20 seconds
    }
  );
}

/**
 * Hook to get Elemental Jabs owned by current account - IMPROVED VERSION
 */
export function useUserJabsElemental() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const [jablixes, setJablixes] = useState<Jablix[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!account?.address) {
      setJablixes([]);
      return;
    }

    const fetchJablixes = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const ownedObjects = await client.getOwnedObjects({
          owner: account.address,
          filter: {
            StructType: OBJECT_TYPES.JABLIX_ELEMENTAL,
          },
          options: { 
            showContent: true, 
            showType: true, 
            showOwner: true 
          },
        });

        const parsed = ownedObjects.data.map((obj): Jablix | null => {
          const content = obj.data?.content;
          if (!content || content.dataType !== 'moveObject') return null;

          const fields = content.fields as any;

          // Parse cards from blockchain (vector<Card>)
          const cards: BlockchainCard[] = [];
          if (fields.cards && Array.isArray(fields.cards)) {
            fields.cards.forEach((card: any) => {
              if (card.fields) {
                cards.push({
                  name: card.fields.name || '',
                  element: card.fields.element || '',
                  type_: card.fields.type_ || '',
                  energy_cost: parseInt(card.fields.energy_cost || '0'),
                  effect: card.fields.effect || '',
                  damage: parseInt(card.fields.damage || '0'),
                });
              }
            });
          }

          return {
            id: obj.data?.objectId || '',
            type: 'elemental',
            type_id: parseInt(fields.type_id || '0'),
            name: fields.name || 'Unknown',
            hp: parseInt(fields.hp || '0'),
            attack: parseInt(fields.attack || '0'),
            defense: parseInt(fields.defense || '0'),
            speed: parseInt(fields.speed || '0'),
            energy: parseInt(fields.energy || '0'),
            element1: fields.elements?.[0] || fields.element1 || '',
            element2: fields.elements?.[1] || fields.element2 || null,
            phase: parseInt(fields.phase || '1'),
            image: fields.url || fields.image || '',
            cards: cards,
          };
        }).filter((j): j is Jablix => j !== null);

        setJablixes(parsed);
      } catch (err) {
        console.error('Error fetching elemental jablixes:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchJablixes();
  }, [account?.address, client]);

  return { data: jablixes, isLoading, error };
}

/**
 * Hook to get Special Jabs owned by current account - IMPROVED VERSION
 */
export function useUserJabsSpecial() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const [jablixes, setJablixes] = useState<Jablix[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!account?.address) {
      setJablixes([]);
      return;
    }

    const fetchJablixes = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const ownedObjects = await client.getOwnedObjects({
          owner: account.address,
          filter: {
            StructType: OBJECT_TYPES.JABLIX_SPECIAL,
          },
          options: { 
            showContent: true, 
            showType: true, 
            showOwner: true 
          },
        });

        const parsed = ownedObjects.data.map((obj): Jablix | null => {
          const content = obj.data?.content;
          if (!content || content.dataType !== 'moveObject') return null;

          const fields = content.fields as any;

          // Parse cards from blockchain (vector<Card>)
          const cards: BlockchainCard[] = [];
          if (fields.cards && Array.isArray(fields.cards)) {
            fields.cards.forEach((card: any) => {
              if (card.fields) {
                cards.push({
                  name: card.fields.name || '',
                  element: card.fields.element || '',
                  type_: card.fields.type_ || '',
                  energy_cost: parseInt(card.fields.energy_cost || '0'),
                  effect: card.fields.effect || '',
                  damage: parseInt(card.fields.damage || '0'),
                });
              }
            });
          }

          return {
            id: obj.data?.objectId || '',
            type: 'special',
            type_id: parseInt(fields.type_id || '0'),
            name: fields.name || 'Unknown',
            hp: parseInt(fields.hp || '0'),
            attack: parseInt(fields.attack || '0'),
            defense: parseInt(fields.defense || '0'),
            speed: parseInt(fields.speed || '0'),
            energy: parseInt(fields.energy || '0'),
            element1: fields.elements?.[0] || fields.element1 || '',
            element2: fields.elements?.[1] || fields.element2 || null,
            phase: parseInt(fields.phase || '1'),
            image: fields.url || fields.image || '',
            cards: cards,
          };
        }).filter((j): j is Jablix => j !== null);

        setJablixes(parsed);
      } catch (err) {
        console.error('Error fetching special jablixes:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchJablixes();
  }, [account?.address, client]);

  return { data: jablixes, isLoading, error };
}

/**
 * Hook to get ALL Jabs (both Elemental and Special) owned by the current user
 */
export function useUserJabs() {
  const elemental = useUserJabsElemental();
  const special = useUserJabsSpecial();

  return {
    data: [...(elemental.data || []), ...(special.data || [])],
    isLoading: elemental.isLoading || special.isLoading,
    error: elemental.error || special.error,
    refetch: () => {
      // These hooks use useEffect, so changing the address will trigger refetch
    },
  };
}

/**
 * Loads Jabs listed in kiosks with pagination
 */
export function useMarketplaceJabs() {
  const account = useCurrentAccount();
  
  return useSuiClientQuery(
    'getOwnedObjects',
    {
      owner: account?.address || '',
      filter: {
        Package: PACKAGE_ID,
      },
      options: {
        showContent: true,
        showType: true,
        showOwner: true,
      },
    },
    {
      enabled: !!account?.address,
      refetchInterval: 30000, // Refetch every 30 seconds (optimized)
      staleTime: 20000, // Consider data fresh for 20 seconds
    }
  );
}

/**
 * Hook to check if user has any Jabs
 */
export function useHasJabs() {
  const jabsQuery = useUserJabs();
  return (jabsQuery.data?.length || 0) > 0;
}

/**
 * Legacy hook for components that need jxcBalance, jxcCoinId, jablixes, and refetch
 * This provides compatibility with older component structure
 */
export function useSuiData() {
  const account = useCurrentAccount();
  const jxcBalanceQuery = useJxcBalance();
  const jxcCoinsQuery = useJxcCoins();
  const jabsQuery = useUserJabs();

  const jxcBalance = jxcBalanceQuery.data?.totalBalance
    ? Number(jxcBalanceQuery.data.totalBalance) / 1_000_000_000
    : 0;

  const jxcCoinId = jxcCoinsQuery.data?.data?.[0]?.coinObjectId || '';

  const refetch = () => {
    jxcBalanceQuery.refetch();
    jxcCoinsQuery.refetch();
    // jabsQuery uses useEffect, changing account will trigger refetch
  };

  return {
    jxcBalance,
    jxcCoinId,
    jablixes: jabsQuery.data || [],
    refetch,
  };
}

/**
 * Extract data from a Jablix object for marketplace/genesis components
 * IMPROVED: Now uses local templates as fallback for images
 */
export function extractJablixData(jablix: Jablix): {
  id: string;
  name: string;
  type: 'elemental' | 'special';
  element: string;
  level: number;
  phase: number;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  imageUrl: string;
  type_id: number;
} | null {
  if (!jablix) return null;

  // Get image from blockchain or fallback to local template
  let imageUrl = jablix.image;
  
  // If image is empty, null, or invalid URL, use local template from JABLIX_TEMPLATES
  if (!imageUrl || imageUrl.trim() === '' || !imageUrl.startsWith('http')) {
    const template = JABLIX_TEMPLATES.find((t) => t.id === jablix.type_id);
    if (template && template.imageUrl) {
      imageUrl = template.imageUrl;
    } else {
      // Final fallback if template not found
      imageUrl = 'https://via.placeholder.com/300?text=Jablix';
    }
  }

  return {
    id: jablix.id,
    name: jablix.name,
    type: jablix.type,
    element: jablix.element1,
    level: jablix.type_id,
    phase: jablix.phase,
    hp: jablix.hp,
    attack: jablix.attack,
    defense: jablix.defense,
    speed: jablix.speed,
    imageUrl: imageUrl,
    type_id: jablix.type_id,
  };
}
