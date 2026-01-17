import { Transaction } from '@mysten/sui/transactions';
import { 
  PACKAGE_ID, 
  MODULES,
  SHARED_OBJECTS, 
  COIN_TYPES, 
  TX_CONFIG,
  BATTLE_SERVER,
  OBJECT_TYPES
} from '@/config/suiConfig';

/**
 * ⚡ ON-CHAIN BATTLE TRANSACTIONS FOR SUI BLOCKCHAIN
 * 
 * Complete integration with Jablix Battle Smart Contract
 * Module: ${PACKAGE_ID}::battle
 * 
 * Battle Flow:
 * 1. Player 1: start_battle_special/elemental (create session + deposit bet)
 * 2. Player 2: join_battle_special/elemental (join session + deposit bet)
 * 3. Server: activate_battle_signed (activate with ed25519 signature)
 * 4. Battle runs off-chain via Pusher
 * 5. Server: resolve_battle_signed (resolve with ed25519 signature, distribute prizes)
 * 
 * Benefits:
 * ✅ On-chain bet escrow (secure)
 * ✅ Server-signed activation/resolution (verifiable)
 * ✅ Automatic prize distribution with 3% commission
 * ✅ Timeout protection (600 seconds)
 */

// ==================== BET LEVELS ====================
export const BET_LEVELS = {
  LOW: 3_000_000_000_000n, // 3000 JXC
  HIGH: 5_000_000_000_000n, // 5000 JXC
};

export function getBetAmount(betLevel: number): bigint {
  if (betLevel === 0) return BET_LEVELS.LOW;
  if (betLevel === 1) return BET_LEVELS.HIGH;
  throw new Error('Invalid bet level. Must be 0 (3000 JXC) or 1 (5000 JXC)');
}

// ==================== START BATTLE ====================

/**
 * Create transaction to start battle with JablixSpecial NFTs
 * @param opponent Address of opponent (Player 2)
 * @param betAmount Bet amount (3000 or 5000 JXC in smallest unit)
 * @param jablix1Id Object ID of first JablixSpecial
 * @param jablix2Id Object ID of second JablixSpecial
 * @param jablix3Id Object ID of third JablixSpecial
 * @param paymentCoinId JXC coin object ID for bet payment
 * @returns Transaction block
 */
export function createStartBattleSpecialTransaction(
  opponent: string,
  betAmount: bigint,
  jablix1Id: string,
  jablix2Id: string,
  jablix3Id: string,
  paymentCoinId: string
): Transaction {
  const tx = new Transaction();
  tx.setGasBudget(TX_CONFIG.GAS_BUDGET);

  // Split exact bet amount from payment coin
  const [betCoin] = tx.splitCoins(tx.object(paymentCoinId), [tx.pure.u64(betAmount.toString())]);

  // Call start_battle_special
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULES.JABLIX_BATTLE}::start_battle_special`,
    arguments: [
      tx.pure.address(opponent),
      tx.pure.u64(betAmount.toString()),
      tx.object(jablix1Id),
      tx.object(jablix2Id),
      tx.object(jablix3Id),
      betCoin,
      tx.object(SHARED_OBJECTS.CLOCK),
    ],
  });

  return tx;
}

/**
 * Create transaction to start battle with JablixElemental NFTs
 */
export function createStartBattleElementalTransaction(
  opponent: string,
  betAmount: bigint,
  jablix1Id: string,
  jablix2Id: string,
  jablix3Id: string,
  paymentCoinId: string
): Transaction {
  const tx = new Transaction();
  tx.setGasBudget(TX_CONFIG.GAS_BUDGET);

  const [betCoin] = tx.splitCoins(tx.object(paymentCoinId), [tx.pure.u64(betAmount.toString())]);

  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULES.JABLIX_BATTLE}::start_battle_elemental`,
    arguments: [
      tx.pure.address(opponent),
      tx.pure.u64(betAmount.toString()),
      tx.object(jablix1Id),
      tx.object(jablix2Id),
      tx.object(jablix3Id),
      betCoin,
      tx.object(SHARED_OBJECTS.CLOCK),
    ],
  });

  return tx;
}

// ==================== JOIN BATTLE ====================

/**
 * Create transaction to join battle with JablixSpecial NFTs
 * @param sessionId BattleSession shared object ID
 * @param jablix1Id Object ID of first JablixSpecial
 * @param jablix2Id Object ID of second JablixSpecial
 * @param jablix3Id Object ID of third JablixSpecial
 * @param paymentCoinId JXC coin object ID for bet payment
 * @returns Transaction block
 */
export function createJoinBattleSpecialTransaction(
  sessionId: string,
  jablix1Id: string,
  jablix2Id: string,
  jablix3Id: string,
  paymentCoinId: string,
  betAmount: bigint
): Transaction {
  const tx = new Transaction();
  tx.setGasBudget(TX_CONFIG.GAS_BUDGET);

  const [betCoin] = tx.splitCoins(tx.object(paymentCoinId), [tx.pure.u64(betAmount.toString())]);

  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULES.JABLIX_BATTLE}::join_battle_special`,
    arguments: [
      tx.object(sessionId),
      tx.object(jablix1Id),
      tx.object(jablix2Id),
      tx.object(jablix3Id),
      betCoin,
      tx.object(SHARED_OBJECTS.CLOCK),
    ],
  });

  return tx;
}

/**
 * Create transaction to join battle with JablixElemental NFTs
 */
export function createJoinBattleElementalTransaction(
  sessionId: string,
  jablix1Id: string,
  jablix2Id: string,
  jablix3Id: string,
  paymentCoinId: string,
  betAmount: bigint
): Transaction {
  const tx = new Transaction();
  tx.setGasBudget(TX_CONFIG.GAS_BUDGET);

  const [betCoin] = tx.splitCoins(tx.object(paymentCoinId), [tx.pure.u64(betAmount.toString())]);

  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULES.JABLIX_BATTLE}::join_battle_elemental`,
    arguments: [
      tx.object(sessionId),
      tx.object(jablix1Id),
      tx.object(jablix2Id),
      tx.object(jablix3Id),
      betCoin,
      tx.object(SHARED_OBJECTS.CLOCK),
    ],
  });

  return tx;
}

// ==================== ACTIVATE BATTLE (SERVER-SIGNED) ====================

/**
 * Create transaction to activate battle (requires server signature)
 * This is called by the server after both players have joined
 * 
 * @param sessionId BattleSession shared object ID
 * @param serverSignature ed25519 signature from battle server
 * @returns Transaction block
 */
export function createActivateBattleTransaction(
  sessionId: string,
  serverSignature: number[]
): Transaction {
  const tx = new Transaction();
  tx.setGasBudget(TX_CONFIG.GAS_BUDGET);

  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULES.JABLIX_BATTLE}::activate_battle_signed`,
    arguments: [
      tx.object(SHARED_OBJECTS.BATTLE_AUTHORITY),
      tx.object(sessionId),
      tx.pure.vector('u8', serverSignature),
      tx.object(SHARED_OBJECTS.CLOCK),
    ],
  });

  return tx;
}

// ==================== RESOLVE BATTLE (SERVER-SIGNED) ====================

/**
 * Create transaction to resolve battle (requires server signature)
 * This is called by the server after battle ends
 * Distributes prizes: winner gets pot minus 3% commission
 * 
 * @param sessionId BattleSession shared object ID
 * @param winner Address of winner (or 0x0 for draw)
 * @param battleLogHash Hash of battle log for verification
 * @param serverSignature ed25519 signature from battle server
 * @returns Transaction block
 */
export function createResolveBattleTransaction(
  sessionId: string,
  winner: string,
  battleLogHash: number[],
  serverSignature: number[]
): Transaction {
  const tx = new Transaction();
  tx.setGasBudget(TX_CONFIG.GAS_BUDGET);

  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULES.JABLIX_BATTLE}::resolve_battle_signed`,
    arguments: [
      tx.object(SHARED_OBJECTS.BATTLE_AUTHORITY),
      tx.object(sessionId),
      tx.pure.address(winner),
      tx.pure.vector('u8', battleLogHash),
      tx.pure.vector('u8', serverSignature),
      tx.object(SHARED_OBJECTS.CLOCK),
    ],
  });

  return tx;
}

// ==================== FORFEIT & EMERGENCY ====================

/**
 * Create transaction to forfeit battle (player surrenders)
 * Winner receives pot minus 3% commission
 */
export function createForfeitBattleTransaction(sessionId: string): Transaction {
  const tx = new Transaction();
  tx.setGasBudget(TX_CONFIG.GAS_BUDGET);

  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULES.JABLIX_BATTLE}::forfeit_battle`,
    arguments: [
      tx.object(sessionId),
      tx.object(SHARED_OBJECTS.CLOCK),
    ],
  });

  return tx;
}

/**
 * Create transaction to emergency cancel battle (timeout)
 * Can only be called if battle is PENDING/READY and 600+ seconds elapsed
 * Refunds both players
 */
export function createEmergencyCancelTransaction(sessionId: string): Transaction {
  const tx = new Transaction();
  tx.setGasBudget(TX_CONFIG.GAS_BUDGET);

  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULES.JABLIX_BATTLE}::emergency_cancel`,
    arguments: [
      tx.object(sessionId),
      tx.object(SHARED_OBJECTS.CLOCK),
    ],
  });

  return tx;
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Determine if Jablix is Special or Elemental based on object type
 */
export async function getJablixType(
  suiClient: any,
  jablixId: string
): Promise<'special' | 'elemental'> {
  try {
    const obj = await suiClient.getObject({
      id: jablixId,
      options: { showType: true },
    });

    if (!obj.data?.type) {
      throw new Error(`Cannot determine type for Jablix ${jablixId}`);
    }

    if (obj.data.type.includes('jablix_special::JablixSpecial')) {
      return 'special';
    } else if (obj.data.type.includes('jablix_elemental::JablixElemental')) {
      return 'elemental';
    }

    throw new Error(`Unknown Jablix type: ${obj.data.type}`);
  } catch (error) {
    console.error('[BattleTransactions] Error determining Jablix type:', error);
    throw error;
  }
}

/**
 * Create start battle transaction (auto-detects Jablix type)
 */
export async function createStartBattleAutoTransaction(
  suiClient: any,
  opponent: string,
  betAmount: bigint,
  jablix1Id: string,
  jablix2Id: string,
  jablix3Id: string,
  paymentCoinId: string
): Promise<Transaction> {
  // Determine type from first Jablix
  const type = await getJablixType(suiClient, jablix1Id);

  if (type === 'special') {
    return createStartBattleSpecialTransaction(
      opponent,
      betAmount,
      jablix1Id,
      jablix2Id,
      jablix3Id,
      paymentCoinId
    );
  } else {
    return createStartBattleElementalTransaction(
      opponent,
      betAmount,
      jablix1Id,
      jablix2Id,
      jablix3Id,
      paymentCoinId
    );
  }
}

/**
 * Create join battle transaction (auto-detects Jablix type)
 */
export async function createJoinBattleAutoTransaction(
  suiClient: any,
  sessionId: string,
  jablix1Id: string,
  jablix2Id: string,
  jablix3Id: string,
  paymentCoinId: string,
  betAmount: bigint
): Promise<Transaction> {
  const type = await getJablixType(suiClient, jablix1Id);

  if (type === 'special') {
    return createJoinBattleSpecialTransaction(
      sessionId,
      jablix1Id,
      jablix2Id,
      jablix3Id,
      paymentCoinId,
      betAmount
    );
  } else {
    return createJoinBattleElementalTransaction(
      sessionId,
      jablix1Id,
      jablix2Id,
      jablix3Id,
      paymentCoinId,
      betAmount
    );
  }
}

/**
 * Format battle transaction result
 */
export interface BattleTransactionResult {
  success: boolean;
  digest: string;
  sessionId?: string;
  message: string;
  explorerUrl: string;
}

export function formatBattleTxResult(
  digest: string,
  operation: 'start' | 'join' | 'activate' | 'resolve' | 'forfeit' | 'cancel',
  sessionId?: string
): BattleTransactionResult {
  const explorerUrl = `https://suiscan.xyz/testnet/tx/${digest}`;
  let message = '';

  switch (operation) {
    case 'start':
      message = 'Battle session created on-chain!';
      break;
    case 'join':
      message = 'Joined battle on-chain!';
      break;
    case 'activate':
      message = 'Battle activated on-chain!';
      break;
    case 'resolve':
      message = 'Battle resolved on-chain! Prizes distributed.';
      break;
    case 'forfeit':
      message = 'Battle forfeited!';
      break;
    case 'cancel':
      message = 'Battle cancelled, bets refunded!';
      break;
    default:
      message = 'Transaction completed!';
  }

  return {
    success: true,
    digest,
    sessionId,
    message,
    explorerUrl,
  };
}

/**
 * Validate bet level
 */
export function isValidBetLevel(betLevel: number): boolean {
  return betLevel === 0 || betLevel === 1;
}

export default {
  BET_LEVELS,
  getBetAmount,
  createStartBattleSpecialTransaction,
  createStartBattleElementalTransaction,
  createJoinBattleSpecialTransaction,
  createJoinBattleElementalTransaction,
  createActivateBattleTransaction,
  createResolveBattleTransaction,
  createForfeitBattleTransaction,
  createEmergencyCancelTransaction,
  getJablixType,
  createStartBattleAutoTransaction,
  createJoinBattleAutoTransaction,
  formatBattleTxResult,
  isValidBetLevel,
};
