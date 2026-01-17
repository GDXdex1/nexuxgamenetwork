/**
 * Environment Configuration
 * 
 * Centralized configuration for testnet/mainnet switching
 * All network-dependent settings are managed here
 */

export type NetworkEnvironment = 'testnet' | 'mainnet';

// ==================== NETWORK CONFIGURATION ====================
export const CURRENT_NETWORK: NetworkEnvironment = 'testnet';

// Network display configuration
export const NETWORK_CONFIG = {
  testnet: {
    name: 'Sui Testnet',
    color: 'orange',
    badge: '🧪 TESTNET',
    explorerUrl: 'https://suiscan.xyz/testnet',
    isProduction: false,
  },
  mainnet: {
    name: 'Sui Mainnet',
    color: 'green',
    badge: '🚀 MAINNET',
    explorerUrl: 'https://suiscan.xyz/mainnet',
    isProduction: true,
  },
} as const;

// Get current network config
export const getCurrentNetworkConfig = () => NETWORK_CONFIG[CURRENT_NETWORK];

// ==================== DATABASE CONFIGURATION ====================
export const DATABASE_CONFIG = {
  testnet: {
    enabled: true,
    syncWithBlockchain: true,
    cacheEnabled: true,
  },
  mainnet: {
    enabled: true,
    syncWithBlockchain: true,
    cacheEnabled: true,
  },
} as const;

// Get current database config
export const getCurrentDatabaseConfig = () => DATABASE_CONFIG[CURRENT_NETWORK];

// ==================== FEATURE FLAGS ====================
export const FEATURE_FLAGS = {
  testnet: {
    showDebugInfo: true,
    allowFaucet: true,
    enableAnalytics: false,
    strictValidation: false,
  },
  mainnet: {
    showDebugInfo: false,
    allowFaucet: false,
    enableAnalytics: true,
    strictValidation: true,
  },
} as const;

// Get current feature flags
export const getCurrentFeatureFlags = () => FEATURE_FLAGS[CURRENT_NETWORK];

// ==================== HELPER FUNCTIONS ====================

/**
 * Check if we're on testnet
 */
export function isTestnet(): boolean {
  return CURRENT_NETWORK === 'testnet';
}

/**
 * Check if we're on mainnet
 */
export function isMainnet(): boolean {
  return CURRENT_NETWORK === 'mainnet';
}

/**
 * Get network badge for UI display
 */
export function getNetworkBadge(): string {
  return getCurrentNetworkConfig().badge;
}

/**
 * Get network color for styling
 */
export function getNetworkColor(): string {
  return getCurrentNetworkConfig().color;
}

/**
 * Get explorer URL for current network
 */
export function getExplorerUrl(): string {
  return getCurrentNetworkConfig().explorerUrl;
}

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof FEATURE_FLAGS.testnet): boolean {
  return getCurrentFeatureFlags()[feature];
}

export default {
  CURRENT_NETWORK,
  isTestnet,
  isMainnet,
  getNetworkBadge,
  getNetworkColor,
  getExplorerUrl,
  isFeatureEnabled,
  getCurrentNetworkConfig,
  getCurrentDatabaseConfig,
  getCurrentFeatureFlags,
};
