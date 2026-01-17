import { Transaction } from '@mysten/sui/transactions';
import { PACKAGE_ID, MODULES, TOKEN, JABLIXCOIN_CONSTANTS } from '@/config/suiConfig';

/**
 * Admin Transaction Utilities for JABLIXCOIN Management
 * 
 * These functions require ownership of an AdminCap NFT to execute.
 * Only wallets with AdminCap can perform these operations.
 */

/**
 * Creates a transaction to mint new JABLIXCOIN tokens (Admin only)
 * @param amount - Amount to mint in smallest unit (u128)
 * @param recipientAddress - Address to receive the minted tokens
 * @param adminCapId - AdminCap object ID (proves admin authority)
 * @param treasuryId - JXCTreasury shared object ID
 * @param clockId - Sui Clock object (0x6)
 * @returns Transaction object
 */
export function createAdminMintTransaction(
  amount: bigint,
  recipientAddress: string,
  adminCapId: string,
  treasuryId: string,
  clockId: string = '0x6'
): Transaction {
  const tx = new Transaction();

  // Validate amount doesn't exceed MAX_MINT_PER_TX
  if (amount > JABLIXCOIN_CONSTANTS.MAX_MINT_PER_TX) {
    throw new Error(
      `Amount exceeds MAX_MINT_PER_TX limit of ${JABLIXCOIN_CONSTANTS.MAX_MINT_PER_TX}`
    );
  }

  // Call mint function with 5 arguments as per contract:
  // mint(_: &AdminCap, treasury: &mut JXCTreasury, amount: u128, recipient: address, clock: &Clock, ctx: &mut TxContext)
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULES.JABLIXCOIN}::mint`,
    arguments: [
      tx.object(adminCapId),                // Arg 0: AdminCap
      tx.object(treasuryId),                // Arg 1: JXCTreasury
      tx.pure.u128(amount.toString()),      // Arg 2: amount (u128)
      tx.pure.address(recipientAddress),    // Arg 3: recipient address
      tx.object(clockId),                   // Arg 4: Clock
    ],
  });

  return tx;
}

/**
 * Creates a transaction to burn JABLIXCOIN tokens
 * @param coinId - JXC Coin object ID to burn
 * @param treasuryId - JXCTreasury shared object ID
 * @param clockId - Sui Clock object (0x6)
 * @returns Transaction object
 */
export function createBurnTransaction(
  coinId: string,
  treasuryId: string,
  clockId: string = '0x6'
): Transaction {
  const tx = new Transaction();

  // Call burn function
  // CRITICAL: jablixcoin::burn expects 2 arguments: Coin, JXCTreasury
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULES.JABLIXCOIN}::burn`,
    arguments: [
      tx.object(coinId),       // Arg 0: JXC Coin to burn
      tx.object(treasuryId),   // Arg 1: JXCTreasury
    ],
  });

  return tx;
}

/**
 * Creates a transaction to pause the treasury (Admin only)
 * Prevents minting and burning operations
 * @param adminCapId - AdminCap object ID
 * @param treasuryId - JXCTreasury shared object ID
 * @param clockId - Sui Clock object (0x6)
 * @returns Transaction object
 */
export function createPauseTreasuryTransaction(
  adminCapId: string,
  treasuryId: string,
  clockId: string = '0x6'
): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULES.JABLIXCOIN}::pause_treasury`,
    arguments: [
      tx.object(adminCapId),
      tx.object(treasuryId),
      tx.object(clockId),
    ],
  });

  return tx;
}

/**
 * Creates a transaction to unpause the treasury (Admin only)
 * Resumes minting and burning operations
 * @param adminCapId - AdminCap object ID
 * @param treasuryId - JXCTreasury shared object ID
 * @param clockId - Sui Clock object (0x6)
 * @returns Transaction object
 */
export function createUnpauseTreasuryTransaction(
  adminCapId: string,
  treasuryId: string,
  clockId: string = '0x6'
): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULES.JABLIXCOIN}::unpause_treasury`,
    arguments: [
      tx.object(adminCapId),
      tx.object(treasuryId),
      tx.object(clockId),
    ],
  });

  return tx;
}

/**
 * Creates a transaction to transfer AdminCap to another address (Admin only)
 * WARNING: This permanently transfers admin rights to the recipient
 * @param adminCapId - AdminCap object ID to transfer
 * @param recipientAddress - Address to receive AdminCap
 * @param clockId - Sui Clock object (0x6)
 * @returns Transaction object
 */
export function createTransferAdminCapTransaction(
  adminCapId: string,
  recipientAddress: string,
  clockId: string = '0x6'
): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULES.JABLIXCOIN}::transfer_admin_cap`,
    arguments: [
      tx.object(adminCapId),
      tx.pure.address(recipientAddress),
      tx.object(clockId),
    ],
  });

  return tx;
}

/**
 * Helper to validate if an amount is within minting limits
 */
export function validateMintAmount(amount: bigint): boolean {
  return amount > 0n && amount <= JABLIXCOIN_CONSTANTS.MAX_MINT_PER_TX;
}

/**
 * Helper to validate if an amount is within burning limits
 */
export function validateBurnAmount(amount: bigint): boolean {
  return amount > 0n && amount <= JABLIXCOIN_CONSTANTS.MAX_BURN_PER_TX;
}

/**
 * Calculate remaining mintable supply
 */
export function calculateRemainingSupply(currentMinted: bigint): bigint {
  return JABLIXCOIN_CONSTANTS.MAX_SUPPLY - currentMinted;
}

/**
 * Format admin transaction result for display
 */
export interface AdminTransactionResult {
  success: boolean;
  digest: string;
  message: string;
  explorerUrl: string;
}

export function formatAdminTxResult(
  digest: string,
  operation: string,
  amount?: bigint
): AdminTransactionResult {
  const explorerUrl = `https://suiscan.xyz/testnet/tx/${digest}`;
  let message = '';

  switch (operation) {
    case 'mint':
      message = `Successfully minted ${amount} JXC tokens`;
      break;
    case 'burn':
      message = `Successfully burned ${amount} JXC tokens`;
      break;
    case 'pause':
      message = 'Treasury paused successfully';
      break;
    case 'unpause':
      message = 'Treasury unpaused successfully';
      break;
    case 'transfer_admin':
      message = 'AdminCap transferred successfully';
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
