import { Transaction } from '@mysten/sui/transactions';
import { 
  PACKAGE_ID, 
  MODULES, 
  SHARED_OBJECTS,
  COSTS,
  COIN_TYPES 
} from '@/config/suiConfig';

/**
 * Mint Transaction Utilities for Jablix NFTs
 * 
 * These functions create transactions to mint Elemental and Special Jabs
 * Requires JXC payment and uses Random + Clock objects
 */

/**
 * Creates a transaction to mint an Elemental Jab
 * @param jxcCoinId - JXC Coin object ID for payment
 * @param elementalTypeId - Type ID of the Elemental to mint (1-94)
 * @returns Transaction object
 */
export function createMintElementalTransaction(
  jxcCoinId: string,
  elementalTypeId: number
): Transaction {
  const tx = new Transaction();

  // Set gas budget to 0.04 SUI (40,000,000 MIST)
  tx.setGasBudget(40_000_000);

  // Split off the exact amount needed (1000 JXC)
  const [paymentCoin] = tx.splitCoins(tx.object(jxcCoinId), [
    tx.pure.u64(COSTS.MINT_ELEMENTAL.toString())
  ]);

  // Call mint function with correct argument structure
  // CRITICAL: Use tx.pure.vector('u8', [id]) for vector<u8> arguments (matches Move signature)
  // Arg order: [type_id], inventory, treasury, payment_coin, random, clock
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULES.JABLIX_ELEMENTAL}::mint`,
    arguments: [
      tx.pure.vector('u8', [elementalTypeId]),  // Arg 0: vector<u8> type ID
      tx.object(SHARED_OBJECTS.INVENTORY_ELEMENTAL), // Arg 1: Inventory (FIRST)
      tx.object(SHARED_OBJECTS.JXC_TREASURY),        // Arg 2: Treasury (SECOND)
      paymentCoin,                                   // Arg 3: Payment coin
      tx.object(SHARED_OBJECTS.RANDOM),             // Arg 4: Random
      tx.object(SHARED_OBJECTS.CLOCK),              // Arg 5: Clock
    ],
  });

  return tx;
}

/**
 * Creates a transaction to mint a Special Jab (Exrix, Dragon, Cosmic)
 * @param jxcCoinId - JXC Coin object ID for payment
 * @param specialTypeId - Type ID of the Special to mint
 * @returns Transaction object
 */
export function createMintSpecialTransaction(
  jxcCoinId: string,
  specialTypeId: number
): Transaction {
  const tx = new Transaction();

  // Set gas budget to 0.04 SUI (40,000,000 MIST)
  tx.setGasBudget(40_000_000);

  // Split off the exact amount needed (2000 JXC for all special types)
  const [paymentCoin] = tx.splitCoins(tx.object(jxcCoinId), [
    tx.pure.u64(COSTS.MINT_EXRIX.toString())
  ]);

  // Call mint function for special with correct argument structure
  // Arg order: [type_id], inventory, treasury, payment_coin, random, clock
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULES.JABLIX_SPECIAL}::mint`,
    arguments: [
      tx.pure.vector('u8', [specialTypeId]),  // Arg 0: vector<u8> type ID
      tx.object(SHARED_OBJECTS.INVENTORY_SPECIAL), // Arg 1: Inventory (FIRST)
      tx.object(SHARED_OBJECTS.JXC_TREASURY),      // Arg 2: Treasury (SECOND)
      paymentCoin,                                 // Arg 3: Payment coin
      tx.object(SHARED_OBJECTS.RANDOM),           // Arg 4: Random
      tx.object(SHARED_OBJECTS.CLOCK),            // Arg 5: Clock
    ],
  });

  return tx;
}

/**
 * Creates a transaction to hatch an Elemental Jab egg
 * @param jxcCoinId - JXC Coin object ID for payment
 * @param eggId - Egg object ID to hatch
 * @returns Transaction object
 */
export function createHatchElementalTransaction(
  jxcCoinId: string,
  eggId: string
): Transaction {
  const tx = new Transaction();

  // Split off the hatch fee (500 JXC)
  const [paymentCoin] = tx.splitCoins(tx.object(jxcCoinId), [
    tx.pure.u64(COSTS.HATCH_ELEMENTAL.toString())
  ]);

  // Call hatch_elemental function
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULES.JABLIX_ELEMENTAL}::hatch_elemental`,
    arguments: [
      tx.object(eggId),
      paymentCoin,
      tx.object(SHARED_OBJECTS.JXC_TREASURY),
      tx.object(SHARED_OBJECTS.RANDOM),
      tx.object(SHARED_OBJECTS.CLOCK),
    ],
  });

  return tx;
}

/**
 * Creates a transaction to evolve an Elemental Jablix to next phase
 * Contract function signature: evolve(jablix, treasury, jxc_payment, random, clock, ctx)
 * @param jxcCoinId - JXC Coin object ID for payment (1500 JXC)
 * @param jablixId - Jablix object ID to evolve
 * @returns Transaction object
 */
export function createEvolveElementalTransaction(
  jxcCoinId: string,
  jablixId: string
): Transaction {
  const tx = new Transaction();

  // Set gas budget to 0.04 SUI (40,000,000 MIST)
  tx.setGasBudget(40_000_000);

  // Split off the evolution fee (1500 JXC - COST_EVOLUTION_JXC from contract)
  const [paymentCoin] = tx.splitCoins(tx.object(jxcCoinId), [
    tx.pure.u64(COSTS.EVOLVE_ELEMENTAL.toString())
  ]);

  // Call evolve function with correct argument structure
  // Arg order: jablix, treasury, jxc_payment, random, clock
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULES.JABLIX_ELEMENTAL}::evolve`,
    arguments: [
      tx.object(jablixId),                     // Arg 0: &mut JablixElemental
      tx.object(SHARED_OBJECTS.JXC_TREASURY),  // Arg 1: &mut JXCTreasury
      paymentCoin,                             // Arg 2: Coin<JABLIXCOIN>
      tx.object(SHARED_OBJECTS.RANDOM),        // Arg 3: &Random
      tx.object(SHARED_OBJECTS.CLOCK),         // Arg 4: &Clock
    ],
  });

  return tx;
}

/**
 * Creates a transaction to evolve a Special Jablix
 * Contract function signature: evolve(jablix, treasury, jxc_payment, random, clock, ctx)
 * @param jxcCoinId - JXC Coin object ID for payment (1500 JXC)
 * @param jablixId - Special Jablix object ID to evolve
 * @returns Transaction object
 */
export function createEvolveSpecialTransaction(
  jxcCoinId: string,
  jablixId: string
): Transaction {
  const tx = new Transaction();

  // Set gas budget to 0.04 SUI (40,000,000 MIST)
  tx.setGasBudget(40_000_000);

  // Split off the evolution fee (1500 JXC - COST_EVOLUTION_JXC from contract)
  const [paymentCoin] = tx.splitCoins(tx.object(jxcCoinId), [
    tx.pure.u64(COSTS.EVOLVE_SPECIAL.toString())
  ]);

  // Call evolve function with correct argument structure
  // Arg order: jablix, treasury, jxc_payment, random, clock
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULES.JABLIX_SPECIAL}::evolve`,
    arguments: [
      tx.object(jablixId),                     // Arg 0: &mut JablixSpecial
      tx.object(SHARED_OBJECTS.JXC_TREASURY),  // Arg 1: &mut JXCTreasury
      paymentCoin,                             // Arg 2: Coin<JABLIXCOIN>
      tx.object(SHARED_OBJECTS.RANDOM),        // Arg 3: &Random
      tx.object(SHARED_OBJECTS.CLOCK),         // Arg 4: &Clock
    ],
  });

  return tx;
}

/**
 * Creates a transaction to breed two Elemental Jabs
 * @param jxcCoinId - JXC Coin object ID for payment
 * @param parent1Id - First parent Jablix object ID
 * @param parent2Id - Second parent Jablix object ID
 * @returns Transaction object
 */
export function createBreedTransaction(
  jxcCoinId: string,
  parent1Id: string,
  parent2Id: string
): Transaction {
  const tx = new Transaction();

  // Split off the breed fee (1000 JXC)
  const [paymentCoin] = tx.splitCoins(tx.object(jxcCoinId), [
    tx.pure.u64(COSTS.BREED.toString())
  ]);

  // Call breed function
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULES.JABLIX_ELEMENTAL}::breed`,
    arguments: [
      tx.object(parent1Id),
      tx.object(parent2Id),
      paymentCoin,
      tx.object(SHARED_OBJECTS.INVENTORY_ELEMENTAL),
      tx.object(SHARED_OBJECTS.JXC_TREASURY),
      tx.object(SHARED_OBJECTS.RANDOM),
      tx.object(SHARED_OBJECTS.CLOCK),
    ],
  });

  return tx;
}

/**
 * Creates a transaction to mint a Gym NFT
 * @param jxcCoinId - JXC Coin object ID for payment
 * @returns Transaction object
 */
export function createMintGymTransaction(
  jxcCoinId: string
): Transaction {
  const tx = new Transaction();

  // Set gas budget to 0.04 SUI (40,000,000 MIST)
  tx.setGasBudget(40_000_000);

  // Split off the exact amount needed (2000 JXC for gym)
  const [paymentCoin] = tx.splitCoins(tx.object(jxcCoinId), [
    tx.pure.u64('2000000000000') // 2000 JXC (COST_MINT_JXC from contract)
  ]);

  // Call mint function from gym contract
  // Function signature: mint(inventory, treasury, jxc_payment, clock, ctx)
  // Arg order: inventory, treasury, jxc_payment, clock
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULES.GYM}::mint`,
    arguments: [
      tx.object(SHARED_OBJECTS.INVENTORY_GYM),      // Arg 0: Inventory
      tx.object(SHARED_OBJECTS.JXC_TREASURY),       // Arg 1: Treasury
      paymentCoin,                                  // Arg 2: Payment coin (Coin<JABLIXCOIN>)
      tx.object(SHARED_OBJECTS.CLOCK),              // Arg 3: Clock
    ],
  });

  return tx;
}

/**
 * Helper to get mint cost for a given type
 */
export function getMintCost(isSpecial: boolean): bigint {
  return isSpecial ? COSTS.MINT_EXRIX : COSTS.MINT_ELEMENTAL;
}

/**
 * Helper to format mint result for display
 */
export interface MintTransactionResult {
  success: boolean;
  digest: string;
  message: string;
  explorerUrl: string;
  jablixType: 'elemental' | 'special';
}

export function formatMintTxResult(
  digest: string,
  jablixType: 'elemental' | 'special',
  typeId: number
): MintTransactionResult {
  const explorerUrl = `https://suiscan.xyz/testnet/tx/${digest}`;
  const message = `Successfully minted ${jablixType === 'elemental' ? 'Elemental' : 'Special'} Jab #${typeId}!`;

  return {
    success: true,
    digest,
    message,
    explorerUrl,
    jablixType,
  };
}
