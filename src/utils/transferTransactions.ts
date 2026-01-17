import { Transaction } from '@mysten/sui/transactions';
import { COIN_TYPES, OBJECT_TYPES } from '@/config/suiConfig';

/**
 * Transfer Transaction Utilities for Jablix
 * 
 * These functions create transactions to transfer JXC tokens and Jablix NFTs
 * Based on the Sui Move contracts from the repository
 */

/**
 * Creates a transaction to transfer JXC tokens to a recipient
 * @param jxcCoinId - JXC Coin object ID to split from
 * @param amount - Amount to transfer in smallest unit (with 9 decimals)
 * @param recipientAddress - Address to receive the tokens
 * @returns Transaction object
 */
export function createTransferJxcTransaction(
  jxcCoinId: string,
  amount: bigint,
  recipientAddress: string
): Transaction {
  const tx = new Transaction();

  // Gas budget is automatically calculated by Sui

  // Split off the exact amount to transfer
  const [transferCoin] = tx.splitCoins(tx.object(jxcCoinId), [
    tx.pure.u64(amount.toString())
  ]);

  // Transfer the coin to the recipient
  tx.transferObjects([transferCoin], tx.pure.address(recipientAddress));

  return tx;
}

/**
 * Creates a transaction to transfer an Elemental Jablix NFT
 * Jablix NFTs have `key, store` abilities, allowing direct transfer
 * @param jablixId - Jablix object ID to transfer
 * @param recipientAddress - Address to receive the NFT
 * @returns Transaction object
 */
export function createTransferElementalTransaction(
  jablixId: string,
  recipientAddress: string
): Transaction {
  const tx = new Transaction();

  // Gas budget is automatically calculated by Sui

  // Transfer the Jablix NFT to the recipient
  // Since JablixElemental has `store` ability, we can use transferObjects
  tx.transferObjects([tx.object(jablixId)], tx.pure.address(recipientAddress));

  return tx;
}

/**
 * Creates a transaction to transfer a Special Jablix NFT
 * @param jablixId - Special Jablix object ID to transfer
 * @param recipientAddress - Address to receive the NFT
 * @returns Transaction object
 */
export function createTransferSpecialTransaction(
  jablixId: string,
  recipientAddress: string
): Transaction {
  const tx = new Transaction();

  // Gas budget is automatically calculated by Sui

  // Transfer the Special Jablix NFT to the recipient
  tx.transferObjects([tx.object(jablixId)], tx.pure.address(recipientAddress));

  return tx;
}

/**
 * Creates a transaction to transfer any Jablix NFT (Elemental or Special)
 * @param jablixId - Jablix object ID to transfer
 * @param jablixType - Type of Jablix ('elemental' | 'special')
 * @param recipientAddress - Address to receive the NFT
 * @returns Transaction object
 */
export function createTransferJablixTransaction(
  jablixId: string,
  jablixType: 'elemental' | 'special',
  recipientAddress: string
): Transaction {
  if (jablixType === 'elemental') {
    return createTransferElementalTransaction(jablixId, recipientAddress);
  } else {
    return createTransferSpecialTransaction(jablixId, recipientAddress);
  }
}

/**
 * Creates a transaction to transfer a Gym NFT
 * Gym NFTs have `key, store` abilities, allowing direct transfer
 * @param gymId - Gym object ID to transfer
 * @param recipientAddress - Address to receive the NFT
 * @returns Transaction object
 */
export function createTransferGymTransaction(
  gymId: string,
  recipientAddress: string
): Transaction {
  const tx = new Transaction();

  // Gas budget is automatically calculated by Sui

  // Transfer the Gym NFT to the recipient
  // Since Gym has `store` ability, we can use transferObjects
  tx.transferObjects([tx.object(gymId)], tx.pure.address(recipientAddress));

  return tx;
}

/**
 * Helper to convert JXC amount from human-readable to smallest unit
 * @param amount - Amount in JXC (e.g., 1000.5)
 * @returns Amount in smallest unit with 9 decimals
 */
export function jxcToSmallestUnit(amount: number): bigint {
  return BigInt(Math.floor(amount * Math.pow(10, 9)));
}

/**
 * Helper to convert JXC amount from smallest unit to human-readable
 * @param amount - Amount in smallest unit
 * @returns Amount in JXC
 */
export function jxcFromSmallestUnit(amount: bigint | string): number {
  const bigIntAmount = typeof amount === 'bigint' ? amount : BigInt(amount);
  return Number(bigIntAmount) / Math.pow(10, 9);
}

/**
 * Validates a Sui address format
 * @param address - Address to validate
 * @returns True if valid Sui address
 */
export function isValidSuiAddress(address: string): boolean {
  // Sui addresses are 66 characters long (0x + 64 hex chars)
  // or can be shorter with leading zeros omitted
  return /^0x[a-fA-F0-9]{1,64}$/.test(address);
}

/**
 * Transfer result interface
 */
export interface TransferResult {
  success: boolean;
  digest?: string;
  error?: string;
  explorerUrl?: string;
}

/**
 * Helper to format transfer result for display
 */
export function formatTransferResult(
  digest: string,
  transferType: 'jxc' | 'nft',
  amount?: number
): TransferResult {
  const explorerUrl = `https://suiscan.xyz/testnet/tx/${digest}`;
  
  return {
    success: true,
    digest,
    explorerUrl,
  };
}
