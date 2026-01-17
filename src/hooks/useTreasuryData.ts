import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { useQuery } from '@tanstack/react-query';
import { SHARED_OBJECTS, OBJECT_TYPES, ADMIN_CAPS, JABLIXCOIN_CONSTANTS, COIN_TYPES } from '@/config/suiConfig';

/**
 * Hook to fetch JABLIXCOIN Treasury information
 * Returns real-time data about minted supply, remaining supply, and paused status
 */
export function useTreasuryInfo() {
  const client = useSuiClient();

  return useQuery({
    queryKey: ['treasury-info', SHARED_OBJECTS.JXC_TREASURY],
    queryFn: async () => {
      const treasury = await client.getObject({
        id: SHARED_OBJECTS.JXC_TREASURY,
        options: {
          showContent: true,
          showType: true,
        },
      });

      if (!treasury.data?.content || treasury.data.content.dataType !== 'moveObject') {
        throw new Error('Invalid treasury object');
      }

      const fields = treasury.data.content.fields as Record<string, unknown>;
      
      const minted = BigInt(fields.minted as string);
      const paused = fields.paused as boolean;
      const remaining = JABLIXCOIN_CONSTANTS.MAX_SUPPLY - minted;
      const circulatingSupply = minted;
      const percentMinted = Number((minted * 10000n) / JABLIXCOIN_CONSTANTS.MAX_SUPPLY) / 100;

      return {
        minted,
        maxSupply: JABLIXCOIN_CONSTANTS.MAX_SUPPLY,
        remaining,
        circulatingSupply,
        paused,
        percentMinted,
      };
    },
    refetchInterval: 5000, // Refetch every 5 seconds
  });
}

/**
 * Hook to check if current wallet has AdminCap
 * Returns the AdminCap object ID if found
 */
export function useAdminCap() {
  const client = useSuiClient();
  const account = useCurrentAccount();

  return useQuery({
    queryKey: ['admin-cap', account?.address],
    queryFn: async () => {
      if (!account?.address) {
        return null;
      }

      // Query all owned objects of AdminCap type
      const objects = await client.getOwnedObjects({
        owner: account.address,
        filter: {
          StructType: OBJECT_TYPES.ADMIN_CAP,
        },
        options: {
          showContent: true,
          showType: true,
        },
      });

      // Return first AdminCap found
      if (objects.data.length > 0) {
        return objects.data[0].data?.objectId || null;
      }

      return null;
    },
    enabled: !!account?.address,
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}

/**
 * Hook to get all JXC coin objects owned by user
 * Useful for burn operations
 */
export function useUserJxcCoins() {
  const client = useSuiClient();
  const account = useCurrentAccount();

  return useQuery({
    queryKey: ['jxc-coins', account?.address],
    queryFn: async () => {
      if (!account?.address) {
        return [];
      }

      const coins = await client.getCoins({
        owner: account.address,
        coinType: COIN_TYPES.JXC,
      });

      return coins.data.map((coin) => ({
        objectId: coin.coinObjectId,
        balance: BigInt(coin.balance),
        version: coin.version,
      }));
    },
    enabled: !!account?.address,
    refetchInterval: 5000,
  });
}

/**
 * Combined hook for admin dashboard
 * Returns all necessary data for admin operations
 */
export function useAdminDashboard() {
  const treasuryInfo = useTreasuryInfo();
  const adminCap = useAdminCap();
  const jxcCoins = useUserJxcCoins();

  return {
    treasury: treasuryInfo.data,
    treasuryLoading: treasuryInfo.isPending,
    adminCapId: adminCap.data,
    isAdmin: !!adminCap.data,
    adminCapLoading: adminCap.isPending,
    jxcCoins: jxcCoins.data || [],
    jxcCoinsLoading: jxcCoins.isPending,
    refetchTreasury: treasuryInfo.refetch,
    refetchAdminCap: adminCap.refetch,
    refetchJxcCoins: jxcCoins.refetch,
  };
}

/**
 * Helper to format treasury data for display
 */
export function formatTreasuryData(data: {
  minted: bigint;
  maxSupply: bigint;
  remaining: bigint;
  circulatingSupply: bigint;
  paused: boolean;
  percentMinted: number;
}) {
  const formatBigInt = (value: bigint): string => {
    const num = Number(value) / 1e9; // Convert from smallest unit
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(2);
  };

  return {
    mintedFormatted: formatBigInt(data.minted),
    maxSupplyFormatted: formatBigInt(data.maxSupply),
    remainingFormatted: formatBigInt(data.remaining),
    circulatingSupplyFormatted: formatBigInt(data.circulatingSupply),
    percentMinted: data.percentMinted.toFixed(2),
    status: data.paused ? 'Paused' : 'Active',
  };
}
