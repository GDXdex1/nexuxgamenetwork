/**
 * Sui Blockchain Configuration
 * 
 * Centralized configuration for all Package IDs, Object IDs, and types
 * from the deployed Jablix smart contracts on Sui Testnet.
 * 
 * PRODUCTION DEPLOYMENT - TESTNET
 * Current Package ID: 0x12e854e44a8c1c1056c0a718fe01668f9ed9376edd2412fd532e715c83cad4df
 * Deployed Modules: jablix_battle, jablix_cards, jablix_elemental, jablix_special, jablixcoin, gym
 * 
 * This is the active package for all Jablix Arena smart contracts.
 * All token queries, minting, and transactions use this package.
 */

// ==================== PACKAGE IDs ====================
export const PACKAGE_ID = '0x12e854e44a8c1c1056c0a718fe01668f9ed9376edd2412fd532e715c83cad4df';

export const PACKAGE_IDS = {
  JABLIX_BATTLE: PACKAGE_ID,
  JABLIX_CARDS: PACKAGE_ID,
  JABLIX_ELEMENTAL: PACKAGE_ID,
  JABLIX_SPECIAL: PACKAGE_ID,
  JABLIXCOIN: PACKAGE_ID,
  GENESIS: PACKAGE_ID,
  MARKETPLACE: PACKAGE_ID,
  GYM: PACKAGE_ID,
};

// ==================== MODULE NAMES ====================
export const MODULES = {
  JABLIX_BATTLE: 'battle',
  JABLIX_CARDS: 'jablix_cards',
  JABLIX_ELEMENTAL: 'jablix_elemental',
  JABLIX_SPECIAL: 'jablix_special',
  JABLIXCOIN: 'jablixcoin',
  GYM: 'gym',
};

// ==================== TOKEN (JABLIXCOIN) ====================
export const TOKEN = {
  // Full type identifier for JXC token
  TYPE: `${PACKAGE_ID}::jablixcoin::JABLIXCOIN`,
  
  // CoinMetadata object ID (immutable)
  METADATA_ID: '0x1edda3d9ca08b8de3b2e56ea2483a6cc5449bc4ea12f1b0eb54362665a9945b2',
  
  // JXC Treasury shared object
  TREASURY_ID: '0x332b0ba19bd728cc307218df75393ab20697fe455d55838f949919fe8ec83c1d',
  
  // Token details
  SYMBOL: 'JXC',
  DECIMALS: 9,
  NAME: 'JABLIXCOIN',
};

// ==================== SHARED OBJECTS ====================
export const SHARED_OBJECTS = {
  // JXC Treasury (shared, for mint/burn operations)
  JXC_TREASURY: TOKEN.TREASURY_ID,
  
  // Inventory for Elemental Jabs (shared, tracks minted/hatched count)
  INVENTORY_ELEMENTAL: '0xe37e075ac3b0b075f176c6758eb01506a5fe4dee8e8ffe7061fdc6cbb2fdfcb9',
  
  // Inventory for Special Jabs (shared, similar tracking)
  INVENTORY_SPECIAL: '0x35e7932235077e9c4b0ffe48a6914ecc767e1b95975a3cf6d83f5b594bac2920',
  
  // Inventory for Gyms (shared)
  INVENTORY_GYM: '0x46847db2fa14826f061a3d233fe2575a50956d6faea79dadd81f8908b7bd567c',
  
  // Battle Authority (shared, for server signatures)
  BATTLE_AUTHORITY: '0xe37e075ac3b0b075f176c6758eb01506a5fe4dee8e8ffe7061fdc6cbb2fdfcb9',
  
  // System objects (Sui framework)
  CLOCK: '0x6', // Clock object (0x6::clock::Clock)
  RANDOM: '0x8', // Random object (0x8::random::Random)
};

// ==================== ADMIN CAPABILITIES ====================
// Multiple AdminCaps exist - can use any of these for admin operations
export const ADMIN_CAPS = {
  PRIMARY: '0x127f760cc8e5c68c61db8616a5936f2eafbe9062a0bf79929d40af712775c04a',
  SECONDARY: '0xe30cf9a0372a6c863efba6368c56e44097af4240cf3280e00fc063522cb36899',
};

// ==================== UPGRADE CAPABILITY ====================
export const UPGRADE_CAP = '0x5a2903c03bcf0f4aba675a6aeb81986c505b0e86c8bc0b35919182e49b4d89c9';

// ==================== WALLET ADDRESSES ====================
export const WALLETS = {
  // Primary publisher/deployer wallet
  PUBLISHER: '0x9e7aaf5f56ae094eadf9ca7f2856f533bcbf12fcc9bb9578e43ca770599a5dce',
  // Commission receiver wallet
  COMMISSION: '0x554a2392980b0c3e4111c9a0e8897e632d41847d04cbd41f9e081e49ba2eb04a',
};

// ==================== BATTLE SERVER ====================
export const BATTLE_SERVER = {
  // Public key autorizada del servidor VPS
  PUBLIC_KEY: '0x401f63e851137ccc2b8937fbf1a166b8565f16dd5aade03eff6f2b3ba2ca521d',
  
  // URL del servidor VPS
  URL: 'http://35.225.225.158:3000',
  
  // Authority object ID
  AUTHORITY_ID: SHARED_OBJECTS.BATTLE_AUTHORITY,
};

// ==================== OBJECT TYPES ====================
export const OBJECT_TYPES = {
  // Jablix Elemental NFT type
  JABLIX_ELEMENTAL: `${PACKAGE_ID}::jablix_elemental::JablixElemental`,
  
  // Jablix Special NFT type (Exrix, Dragons, Cosmic)
  JABLIX_SPECIAL: `${PACKAGE_ID}::jablix_special::JablixSpecial`,
  
  // Inventory types
  INVENTORY_ELEMENTAL: `${PACKAGE_ID}::jablix_elemental::Inventory`,
  INVENTORY_SPECIAL: `${PACKAGE_ID}::jablix_special::Inventory`,
  INVENTORY_GYM: `${PACKAGE_ID}::gym::Inventory`,
  
  // Treasury type
  JXC_TREASURY: `${PACKAGE_ID}::jablixcoin::JXCTreasury`,
  
  // AdminCap type
  ADMIN_CAP: `${PACKAGE_ID}::jablixcoin::AdminCap`,
  
  // Battle types
  BATTLE_SESSION: `${PACKAGE_ID}::battle::BattleSession`,
  BATTLE_AUTHORITY: `${PACKAGE_ID}::battle::BattleAuthority`,
  
  // Card type
  CARD: `${PACKAGE_ID}::jablix_cards::Card`,
  
  // Gym type
  GYM: `${PACKAGE_ID}::gym::Gym`,
};

// ==================== COIN TYPES ====================
export const COIN_TYPES = {
  SUI: '0x2::sui::SUI',
  JXC: TOKEN.TYPE,
};

// ==================== NETWORK CONFIG ====================
export const NETWORK = 'testnet';

export const EXPLORER_URL = `https://suiscan.xyz/${NETWORK}`;

// Helper to get explorer link for an object
export function getExplorerLink(objectId: string): string {
  return `${EXPLORER_URL}/object/${objectId}`;
}

// Helper to get explorer link for a transaction
export function getTxExplorerLink(digest: string): string {
  return `${EXPLORER_URL}/tx/${digest}`;
}

// Helper to get explorer link for an address
export function getAddressExplorerLink(address: string): string {
  return `${EXPLORER_URL}/account/${address}`;
}

// ==================== TRANSACTION CONFIG ====================
export const TX_CONFIG = {
  // Gas budget
  GAS_BUDGET: 100_000_000, // 0.1 SUI
  
  // Refetch intervals (ms)
  BALANCE_REFETCH_INTERVAL: 5000, // 5 seconds
  OBJECTS_REFETCH_INTERVAL: 10000, // 10 seconds
  
  // Evolution fee (in JXC with 9 decimals)
  EVOLUTION_FEE: 2_000_000_000_000, // 2000 JXC
  
  // Marketplace fee percentage
  MARKETPLACE_FEE_PERCENTAGE: 2.5, // 2.5% platform fee
  
  // Battle bet amounts (in JXC with 9 decimals)
  BET_LOW: 3_000_000_000_000n, // 3000 JXC
  BET_HIGH: 5_000_000_000_000n, // 5000 JXC
};

// ==================== JABLIXCOIN CONSTANTS ====================
export const JABLIXCOIN_CONSTANTS = {
  // Maximum supply (50 billion JXC with 9 decimals)
  MAX_SUPPLY: 50_000_000_000_000_000_000n,
  
  // Maximum mint per transaction (1 billion JXC)
  MAX_MINT_PER_TX: 1_000_000_000_000_000_000n,
  
  // Maximum burn per transaction (1 billion JXC)
  MAX_BURN_PER_TX: 1_000_000_000_000_000_000n,
  
  // Decimals
  DECIMALS: 9,
};

// ==================== COSTS (in JXC with 9 decimals) ====================
export const COSTS = {
  // Regular Elemental minting
  MINT_ELEMENTAL: 1_000_000_000_000n, // 1000 JXC
  
  // Special minting (ALL Special types cost 2000 JXC)
  MINT_EXRIX: 2_000_000_000_000n, // 2,000 JXC
  MINT_DRAGON: 2_000_000_000_000n, // 2,000 JXC
  MINT_COSMIC: 2_000_000_000_000n, // 2,000 JXC
  
  // Hatching
  HATCH_ELEMENTAL: 500_000_000_000n, // 500 JXC
  HATCH_EXRIX: 1_500_000_000_000n, // 1,500 JXC
  HATCH_DRAGON: 2_500_000_000_000n, // 2,500 JXC
  
  // Evolution (both types cost 1500 JXC according to contract)
  EVOLVE_ELEMENTAL: 1_500_000_000_000n, // 1,500 JXC (COST_EVOLUTION_JXC)
  EVOLVE_SPECIAL: 1_500_000_000_000n, // 1,500 JXC (COST_EVOLUTION_JXC)
  
  // Minting costs are defined above - removed legacy constants
  BREED: 1_000_000_000_000n, // 1,000 JXC
  
  // Battle bets
  BATTLE_BET_LOW: 3_000_000_000_000n, // 3000 JXC
  BATTLE_BET_HIGH: 5_000_000_000_000n, // 5000 JXC
};

// ==================== PAYMENT REGISTRIES ====================
export const PAYMENT_REGISTRIES = {
  MARKETPLACE: 'jablix_marketplace',
  RENTAL: 'jablix_rental',
  GENESIS: 'jablix_genesis',
  BATTLE_ENTRY: 'jablix_battle_entry',
  TOURNAMENT: 'jablix_tournament',
};

// ==================== DEPLOYMENT INFO ====================
export const DEPLOYMENT_INFO = {
  PACKAGE_ID: PACKAGE_ID,
  VERSION: 2,
  NETWORK: NETWORK,
  DEPLOYER: WALLETS.PUBLISHER,
  MODULES: ['battle', 'jablix_cards', 'jablix_elemental', 'jablix_special', 'jablixcoin', 'gym'],
  TREASURY: TOKEN.TREASURY_ID,
  UPGRADE_CAP: UPGRADE_CAP,
  COIN_METADATA: TOKEN.METADATA_ID,
  BATTLE_AUTHORITY: SHARED_OBJECTS.BATTLE_AUTHORITY,
  BATTLE_SERVER: BATTLE_SERVER.URL,
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Convert JXC amount from human-readable to smallest unit
 * @param amount - Amount in JXC (e.g., 1000)
 * @returns Amount in smallest unit with 9 decimals
 */
export function jxcToSmallestUnit(amount: number): bigint {
  return BigInt(Math.floor(amount * Math.pow(10, TOKEN.DECIMALS)));
}

/**
 * Convert JXC amount from smallest unit to human-readable
 * @param amount - Amount in smallest unit
 * @returns Amount in JXC
 */
export function jxcFromSmallestUnit(amount: bigint | string | number): number {
  const bigIntAmount = typeof amount === 'bigint' ? amount : BigInt(amount);
  return Number(bigIntAmount) / Math.pow(10, TOKEN.DECIMALS);
}

/**
 * Format JXC balance for display
 * @param balance - Balance in smallest unit
 * @returns Formatted string (e.g., "1,000 JXC")
 */
export function formatJxcBalance(balance: bigint | string | number): string {
  const amount = jxcFromSmallestUnit(balance);
  return `${amount.toLocaleString()} ${TOKEN.SYMBOL}`;
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatLargeNumber(num: number | bigint): string {
  const n = typeof num === 'bigint' ? Number(num) : num;
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(2)}K`;
  return n.toFixed(0);
}

export default {
  PACKAGE_ID,
  PACKAGE_IDS,
  MODULES,
  TOKEN,
  SHARED_OBJECTS,
  ADMIN_CAPS,
  UPGRADE_CAP,
  WALLETS,
  BATTLE_SERVER,
  OBJECT_TYPES,
  COIN_TYPES,
  NETWORK,
  EXPLORER_URL,
  TX_CONFIG,
  JABLIXCOIN_CONSTANTS,
  COSTS,
  PAYMENT_REGISTRIES,
  DEPLOYMENT_INFO,
  jxcToSmallestUnit,
  jxcFromSmallestUnit,
  formatJxcBalance,
  formatLargeNumber,
};
