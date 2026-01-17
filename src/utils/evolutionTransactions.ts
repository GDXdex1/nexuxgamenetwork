// src/utils/evolutionTransactions.ts

import { Transaction } from '@mysten/sui/transactions';
import { PACKAGE_ID, SHARED_OBJECTS, COSTS, MODULES } from '@/config/suiConfig';

/**
 * Evolution Transaction Utilities
 * Creates transactions for evolving Jablixes
 * 
 * Contract function signature for both Elemental and Special:
 * public fun evolve(
 *   jablix: &mut JablixElemental/JablixSpecial,
 *   treasury: &mut JXCTreasury,
 *   jxc_payment: Coin<JABLIXCOIN>,
 *   random: &Random,
 *   clock: &Clock,
 *   ctx: &mut TxContext
 * )
 * 
 * Cost: 1500 JXC (COST_EVOLUTION_JXC from contract)
 */

/**
 * Creates a transaction to evolve an Elemental Jablix
 * @param jxcCoinId - JXC Coin object ID for payment (1500 JXC)
 * @param jablixObjectId - The object ID of the Jablix NFT to evolve
 * @returns Transaction ready to be signed
 */
export function createEvolveElementalTransaction(
  jxcCoinId: string,
  jablixObjectId: string
): Transaction {
  const tx = new Transaction();
  
  // Set gas budget to 0.04 SUI (40,000,000 MIST)
  tx.setGasBudget(40_000_000);
  
  // Split off the evolution fee (1500 JXC)
  const [paymentCoin] = tx.splitCoins(tx.object(jxcCoinId), [
    tx.pure.u64(COSTS.EVOLVE_ELEMENTAL.toString())
  ]);
  
  // Call the evolve function from the contract
  // Arg order: jablix, treasury, jxc_payment, random, clock
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULES.JABLIX_ELEMENTAL}::evolve`,
    arguments: [
      tx.object(jablixObjectId),               // Arg 0: &mut JablixElemental
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
 * @param jxcCoinId - JXC Coin object ID for payment (1500 JXC)
 * @param jablixObjectId - The object ID of the Special Jablix NFT to evolve
 * @returns Transaction ready to be signed
 */
export function createEvolveSpecialTransaction(
  jxcCoinId: string,
  jablixObjectId: string
): Transaction {
  const tx = new Transaction();
  
  // Set gas budget to 0.04 SUI (40,000,000 MIST)
  tx.setGasBudget(40_000_000);
  
  // Split off the evolution fee (1500 JXC - same as Elemental)
  const [paymentCoin] = tx.splitCoins(tx.object(jxcCoinId), [
    tx.pure.u64(COSTS.EVOLVE_SPECIAL.toString())
  ]);
  
  // Call the evolve function from the contract
  // Arg order: jablix, treasury, jxc_payment, random, clock
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULES.JABLIX_SPECIAL}::evolve`,
    arguments: [
      tx.object(jablixObjectId),               // Arg 0: &mut JablixSpecial
      tx.object(SHARED_OBJECTS.JXC_TREASURY),  // Arg 1: &mut JXCTreasury
      paymentCoin,                             // Arg 2: Coin<JABLIXCOIN>
      tx.object(SHARED_OBJECTS.RANDOM),        // Arg 3: &Random
      tx.object(SHARED_OBJECTS.CLOCK),         // Arg 4: &Clock
    ],
  });
  
  return tx;
}

/**
 * Creates a transaction to hatch an Elemental Jablix egg (if implemented)
 * @param eggObjectId - The object ID of the egg NFT
 * @returns Transaction ready to be signed
 */
export function createHatchEggTransaction(eggObjectId: string): Transaction {
  const tx = new Transaction();
  
  tx.setGasBudget(20000000);
  
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULES.JABLIX_ELEMENTAL}::hatch`,
    arguments: [
      tx.object(eggObjectId),
      tx.object(SHARED_OBJECTS.RANDOM),
      tx.object(SHARED_OBJECTS.CLOCK)
    ],
  });
  
  return tx;
}

/**
 * Evolution requirements (can be extended)
 */
export interface EvolutionRequirements {
  minLevel?: number;
  itemRequired?: string;
  costJXC: bigint;
  phase: number;
}

/**
 * Gets evolution requirements for a specific Jablix type
 * @param typeId - The type ID of the Jablix
 * @param currentPhase - Current phase of the Jablix (1, 2, or 3)
 * @returns Evolution requirements object
 */
export function getEvolutionRequirements(
  typeId: number,
  currentPhase: number
): EvolutionRequirements {
  // Evolution cost is 1500 JXC (COST_EVOLUTION_JXC from contract)
  // MAX_PHASE is 3, so Jablix can evolve from phase 1->2 and 2->3
  return {
    minLevel: undefined,
    itemRequired: undefined,
    costJXC: COSTS.EVOLVE_ELEMENTAL, // 1500 JXC for both types
    phase: currentPhase
  };
}

/**
 * Check if a Jablix can evolve based on its current phase
 * @param currentPhase - Current phase of the Jablix
 * @returns true if can evolve, false otherwise
 */
export function canEvolveByPhase(currentPhase: number): boolean {
  const MAX_PHASE = 3;
  return currentPhase < MAX_PHASE;
}

/**
 * Helper to format evolution cost for display
 * @returns Formatted evolution cost string
 */
export function getEvolutionCostDisplay(): string {
  return `1,500 JXC`;
}
