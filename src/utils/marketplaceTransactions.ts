import { Transaction } from '@mysten/sui/transactions';
import { 
  PACKAGE_ID, 
  MODULES, 
  SHARED_OBJECTS,
  COIN_TYPES,
  TX_CONFIG 
} from '@/config/suiConfig';

/**
 * Marketplace Transaction Utilities for Jablix NFTs
 * 
 * These functions create transactions for listing, buying, and managing
 * Jablix NFTs in the marketplace using Sui Kiosk protocol
 */

/**
 * Creates a transaction to list an Elemental Jablix for sale
 * @param jablixId - Jablix NFT object ID to list
 * @param priceInJxc - Price in JXC (will be converted to smallest unit)
 * @param kioskId - User's kiosk ID (optional, will create if not exists)
 * @returns Transaction object
 */
export function createListElementalTransaction(
  jablixId: string,
  priceInJxc: number
): Transaction {
  const tx = new Transaction();

  // Convert price to smallest unit (9 decimals)
  const priceInSmallestUnit = BigInt(Math.floor(priceInJxc * 1_000_000_000));

  // List for sale - the contract will handle kiosk creation if needed
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULES.JABLIX_ELEMENTAL}::list_for_sale`,
    arguments: [
      tx.object(jablixId),
      tx.pure.u64(priceInSmallestUnit.toString()),
      tx.object(SHARED_OBJECTS.CLOCK),
    ],
  });

  tx.setGasBudget(40_000_000); // 0.04 SUI

  return tx;
}

/**
 * Creates a transaction to list a Special Jablix for sale
 * @param jablixId - Special Jablix NFT object ID to list
 * @param priceInJxc - Price in JXC (will be converted to smallest unit)
 * @param kioskId - User's kiosk ID (optional, will create if not exists)
 * @returns Transaction object
 */
export function createListSpecialTransaction(
  jablixId: string,
  priceInJxc: number
): Transaction {
  const tx = new Transaction();

  // Convert price to smallest unit (9 decimals)
  const priceInSmallestUnit = BigInt(Math.floor(priceInJxc * 1_000_000_000));

  // List for sale - the contract will handle kiosk creation if needed
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULES.JABLIX_SPECIAL}::list_for_sale`,
    arguments: [
      tx.object(jablixId),
      tx.pure.u64(priceInSmallestUnit.toString()),
      tx.object(SHARED_OBJECTS.CLOCK),
    ],
  });

  tx.setGasBudget(40_000_000); // 0.04 SUI

  return tx;
}

/**
 * Creates a transaction to buy an Elemental Jablix from marketplace
 * @param jxcCoinId - JXC Coin object ID for payment
 * @param kioskId - Seller's kiosk ID
 * @param jablixId - Jablix NFT object ID to buy
 * @param priceInJxc - Listed price in JXC
 * @returns Transaction object
 */
export function createBuyElementalTransaction(
  jxcCoinId: string,
  kioskId: string,
  jablixId: string,
  priceInJxc: number
): Transaction {
  const tx = new Transaction();

  // Convert price to smallest unit (9 decimals)
  const priceInSmallestUnit = BigInt(Math.floor(priceInJxc * 1_000_000_000));

  // Calculate platform fee (2.5%)
  const platformFee = BigInt(Math.floor(Number(priceInSmallestUnit) * (TX_CONFIG.MARKETPLACE_FEE_PERCENTAGE / 100)));
  const totalPayment = priceInSmallestUnit + platformFee;

  // Split off the payment amount
  const [paymentCoin] = tx.splitCoins(tx.object(jxcCoinId), [
    tx.pure.u64(totalPayment.toString())
  ]);

  // Call purchase function
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULES.JABLIX_ELEMENTAL}::purchase_from_kiosk`,
    arguments: [
      tx.object(kioskId),
      tx.object(jablixId),
      paymentCoin,
      tx.object(SHARED_OBJECTS.JXC_TREASURY),
      tx.object(SHARED_OBJECTS.CLOCK),
    ],
  });

  return tx;
}

/**
 * Creates a transaction to buy a Special Jablix from marketplace
 * @param jxcCoinId - JXC Coin object ID for payment
 * @param kioskId - Seller's kiosk ID
 * @param jablixId - Special Jablix NFT object ID to buy
 * @param priceInJxc - Listed price in JXC
 * @returns Transaction object
 */
export function createBuySpecialTransaction(
  jxcCoinId: string,
  kioskId: string,
  jablixId: string,
  priceInJxc: number
): Transaction {
  const tx = new Transaction();

  // Convert price to smallest unit (9 decimals)
  const priceInSmallestUnit = BigInt(Math.floor(priceInJxc * 1_000_000_000));

  // Calculate platform fee (2.5%)
  const platformFee = BigInt(Math.floor(Number(priceInSmallestUnit) * (TX_CONFIG.MARKETPLACE_FEE_PERCENTAGE / 100)));
  const totalPayment = priceInSmallestUnit + platformFee;

  // Split off the payment amount
  const [paymentCoin] = tx.splitCoins(tx.object(jxcCoinId), [
    tx.pure.u64(totalPayment.toString())
  ]);

  // Call purchase function
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULES.JABLIX_SPECIAL}::purchase_from_kiosk`,
    arguments: [
      tx.object(kioskId),
      tx.object(jablixId),
      paymentCoin,
      tx.object(SHARED_OBJECTS.JXC_TREASURY),
      tx.object(SHARED_OBJECTS.CLOCK),
    ],
  });

  return tx;
}

/**
 * Creates a transaction to delist (remove) a Jablix from marketplace
 * @param kioskId - User's kiosk ID
 * @param jablixId - Jablix NFT object ID to delist
 * @param isSpecial - Whether it's a Special Jablix (true) or Elemental (false)
 * @returns Transaction object
 */
export function createDelistTransaction(
  kioskId: string,
  jablixId: string,
  isSpecial: boolean
): Transaction {
  const tx = new Transaction();

  const module = isSpecial ? MODULES.JABLIX_SPECIAL : MODULES.JABLIX_ELEMENTAL;

  // Call delist function
  tx.moveCall({
    target: `${PACKAGE_ID}::${module}::delist_from_sale`,
    arguments: [
      tx.object(kioskId),
      tx.object(jablixId),
      tx.object(SHARED_OBJECTS.CLOCK),
    ],
  });

  return tx;
}

/**
 * Creates a transaction to update listing price
 * @param kioskId - User's kiosk ID
 * @param jablixId - Jablix NFT object ID
 * @param newPriceInJxc - New price in JXC
 * @param isSpecial - Whether it's a Special Jablix (true) or Elemental (false)
 * @returns Transaction object
 */
export function createUpdatePriceTransaction(
  kioskId: string,
  jablixId: string,
  newPriceInJxc: number,
  isSpecial: boolean
): Transaction {
  const tx = new Transaction();

  const module = isSpecial ? MODULES.JABLIX_SPECIAL : MODULES.JABLIX_ELEMENTAL;
  const priceInSmallestUnit = BigInt(Math.floor(newPriceInJxc * 1_000_000_000));

  // Call update price function
  tx.moveCall({
    target: `${PACKAGE_ID}::${module}::update_listing_price`,
    arguments: [
      tx.object(kioskId),
      tx.object(jablixId),
      tx.pure.u64(priceInSmallestUnit.toString()),
      tx.object(SHARED_OBJECTS.CLOCK),
    ],
  });

  return tx;
}

/**
 * Calculate total cost including platform fee
 */
export function calculateTotalCost(priceInJxc: number): {
  price: number;
  platformFee: number;
  total: number;
} {
  const platformFee = priceInJxc * (TX_CONFIG.MARKETPLACE_FEE_PERCENTAGE / 100);
  const total = priceInJxc + platformFee;

  return {
    price: priceInJxc,
    platformFee,
    total,
  };
}

/**
 * Helper to format marketplace result for display
 */
export interface MarketplaceTransactionResult {
  success: boolean;
  digest: string;
  message: string;
  explorerUrl: string;
}

export function formatMarketplaceTxResult(
  digest: string,
  operation: 'list' | 'buy' | 'delist' | 'update',
  jablixName?: string
): MarketplaceTransactionResult {
  const explorerUrl = `https://suiscan.xyz/testnet/tx/${digest}`;
  let message = '';

  switch (operation) {
    case 'list':
      message = `Successfully listed ${jablixName || 'Jablix'} for sale!`;
      break;
    case 'buy':
      message = `Successfully purchased ${jablixName || 'Jablix'}!`;
      break;
    case 'delist':
      message = `Successfully removed ${jablixName || 'Jablix'} from marketplace!`;
      break;
    case 'update':
      message = `Successfully updated listing price for ${jablixName || 'Jablix'}!`;
      break;
    default:
      message = 'Transaction completed successfully';
  }

  return {
    success: true,
    digest,
    message,
    explorerUrl,
  };
}
