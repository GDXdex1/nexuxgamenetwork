// src/data/evolutionChains.ts

/**
 * Evolution Chains Database
 * Defines evolutionary paths for Elemental and Special Jablixes
 */

export interface EvolutionChain {
  phase1: number;
  phase2?: number;
  phase3?: number;
  name: string;
  elements: string[];
  type?: 'elemental' | 'special';
}

export const ELEMENTAL_EVOLUTION_CHAINS: EvolutionChain[] = [
  // Aixer → Aeronaut
  {
    phase1: 3,
    phase2: 1,
    name: "Aixer → Aeronaut",
    elements: ["Wind"]
  },
  
  // Seedling → Sproutguard → Siexgaguar
  {
    phase1: 77,
    phase2: 84,
    phase3: 80,
    name: "Seedling → Sproutguard → Siexgaguar",
    elements: ["Plant"]
  },
  
  // Ertlix → Golemheart → Golix
  {
    phase1: 21,
    phase2: 48,
    phase3: 49,
    name: "Ertlix → Golemheart → Golix",
    elements: ["Earth"]
  },
  
  // Coldrert → Coldruck
  {
    phase1: 7,
    phase2: 8,
    name: "Coldrert → Coldruck",
    elements: ["Earth", "Ice"]
  },
  
  // Jolt → Voltfang → Voltrix
  {
    phase1: 57,
    phase2: 91,
    phase3: 92,
    name: "Jolt → Voltfang → Voltrix",
    elements: ["Electric"]
  },
  
  // Sparkle → Tesliux
  {
    phase1: 83,
    phase2: 88,
    name: "Sparkle → Tesliux",
    elements: ["Electric"]
  },
  
  // Amperx → Ohmspark
  {
    phase1: 2,
    phase2: 71,
    name: "Amperx → Ohmspark",
    elements: ["Electric"]
  },
  
  // Blackix → Nightprowler → Darklix
  {
    phase1: 5,
    phase2: 69,
    phase3: 13,
    name: "Blackix → Nightprowler → Darklix",
    elements: ["Dark"]
  },
  
  // Shade → Shadix
  {
    phase1: 78,
    phase2: 79,
    name: "Shade → Shadix",
    elements: ["Dark"]
  },
  
  // Droplet → Torrent → Tsiux
  {
    phase1: 16,
    phase2: 89,
    phase3: 90,
    name: "Droplet → Torrent → Tsiux",
    elements: ["Water"]
  },
  
  // Watlix → Wotarix
  {
    phase1: 93,
    phase2: 9,
    name: "Watlix → Wotarix",
    elements: ["Water"]
  },
  
  // Firexir → Cinder → Scorch
  {
    phase1: 43,
    phase2: 6,
    phase3: 76,
    name: "Firexir → Cinder → Scorch",
    elements: ["Fire"]
  },
  
  // Ember → Emberix
  {
    phase1: 19,
    phase2: 20,
    name: "Ember → Emberix",
    elements: ["Fire"]
  },
  
  // Gust → Cyclon → Skirx
  {
    phase1: 52,
    phase2: 4,
    phase3: 81,
    name: "Gust → Cyclon → Skirx",
    elements: ["Wind"]
  },
  
  // Zephir → Winderix
  {
    phase1: 95,
    phase2: 94,
    name: "Zephir → Winderix",
    elements: ["Wind"]
  },
  
  // Flurry → Frostbite → Icertrix
  {
    phase1: 44,
    phase2: 45,
    phase3: 55,
    name: "Flurry → Frostbite → Icertrix",
    elements: ["Ice"]
  },
  
  // Culdrex → Cryomancer
  {
    phase1: 11,
    phase2: 10,
    name: "Culdrex → Cryomancer",
    elements: ["Ice"]
  }
];

// Helper function to find evolution chain for a Jablix
export function getEvolutionChainForJablix(jablixId: number, type?: 'elemental' | 'special'): EvolutionChain | undefined {
  // Search in appropriate chains
  const chains = type === 'special' ? SPECIAL_EVOLUTION_CHAINS : ELEMENTAL_EVOLUTION_CHAINS;
  const found = chains.find(
    chain => chain.phase1 === jablixId || chain.phase2 === jablixId || chain.phase3 === jablixId
  );
  
  // If not found and no type specified, search in both
  if (!found && !type) {
    return SPECIAL_EVOLUTION_CHAINS.find(
      chain => chain.phase1 === jablixId || chain.phase2 === jablixId || chain.phase3 === jablixId
    );
  }
  
  return found;
}

// Helper function to find next evolution
export function getNextEvolution(jablixId: number, type?: 'elemental' | 'special'): number | null {
  const chain = getEvolutionChainForJablix(jablixId, type);
  if (!chain) return null;
  
  if (chain.phase1 === jablixId && chain.phase2) return chain.phase2;
  if (chain.phase2 === jablixId && chain.phase3) return chain.phase3;
  
  return null;
}

// ==================== SPECIAL EVOLUTION CHAINS ====================

export const SPECIAL_EVOLUTION_CHAINS: EvolutionChain[] = [
  // Exrix Dark → Exrix Dark Evo
  {
    phase1: 23,
    phase2: 24,
    name: "Exrix Dark → Exrix Dark Evo",
    elements: ["Cosmic", "Dark"],
    type: 'special'
  },
  
  // Exrix Dragon → Exrix Dragon Evo
  {
    phase1: 25,
    phase2: 26,
    name: "Exrix Dragon → Exrix Dragon Evo",
    elements: ["Cosmic", "Dragon"],
    type: 'special'
  },
  
  // Exrix Earth → Exrix Earth Evo
  {
    phase1: 27,
    phase2: 28,
    name: "Exrix Earth → Exrix Earth Evo",
    elements: ["Cosmic", "Earth"],
    type: 'special'
  },
  
  // Exrix Electric → Exrix Electric Evo
  {
    phase1: 29,
    phase2: 30,
    name: "Exrix Electric → Exrix Electric Evo",
    elements: ["Cosmic", "Electric"],
    type: 'special'
  },
  
  // Exrix Fire → Exrix Fire Evo
  {
    phase1: 31,
    phase2: 32,
    name: "Exrix Fire → Exrix Fire Evo",
    elements: ["Cosmic", "Fire"],
    type: 'special'
  },
  
  // Exrix Ice → Exrix Ice Evo
  {
    phase1: 33,
    phase2: 34,
    name: "Exrix Ice → Exrix Ice Evo",
    elements: ["Cosmic", "Ice"],
    type: 'special'
  },
  
  // Exrix Plant → Exrix Plant Evo
  {
    phase1: 35,
    phase2: 36,
    name: "Exrix Plant → Exrix Plant Evo",
    elements: ["Cosmic", "Plant"],
    type: 'special'
  },
  
  // Exrix Water → Exrix Water Evo
  {
    phase1: 37,
    phase2: 38,
    name: "Exrix Water → Exrix Water Evo",
    elements: ["Cosmic", "Water"],
    type: 'special'
  },
  
  // Exrix Wind → Exrix Wind Evo
  {
    phase1: 39,
    phase2: 40,
    name: "Exrix Wind → Exrix Wind Evo",
    elements: ["Cosmic", "Wind"],
    type: 'special'
  },
  
  // Minidragon Aqua → Water Dragon
  {
    phase1: 58,
    phase2: 59,
    name: "Minidragon Aqua → Water Dragon",
    elements: ["Dragon", "Water"],
    type: 'special'
  },
  
  // Minidragon Dark → Dark Dragon
  {
    phase1: 60,
    phase2: 14,
    name: "Minidragon Dark → Dark Dragon",
    elements: ["Dragon", "Dark"],
    type: 'special'
  },
  
  // Minidragon Earth → Earth Dragon
  {
    phase1: 61,
    phase2: 17,
    name: "Minidragon Earth → Earth Dragon",
    elements: ["Dragon", "Earth"],
    type: 'special'
  },
  
  // Minidragon Electric → Electric Dragon
  {
    phase1: 62,
    phase2: 18,
    name: "Minidragon Electric → Electric Dragon",
    elements: ["Dragon", "Electric"],
    type: 'special'
  },
  
  // Minidragon Fire → Fire Dragon
  {
    phase1: 63,
    phase2: 42,
    name: "Minidragon Fire → Fire Dragon",
    elements: ["Dragon", "Fire"],
    type: 'special'
  },
  
  // Minidragon Ice → Ice Dragon
  {
    phase1: 64,
    phase2: 54,
    name: "Minidragon Ice → Ice Dragon",
    elements: ["Dragon", "Ice"],
    type: 'special'
  },
  
  // Minidragon Plant → Plant Dragon
  {
    phase1: 65,
    phase2: 22,
    name: "Minidragon Plant → Plant Dragon",
    elements: ["Dragon", "Plant"],
    type: 'special'
  },
  
  // Minidragon Wind → Wind Dragon
  {
    phase1: 66,
    phase2: 46,
    name: "Minidragon Wind → Wind Dragon",
    elements: ["Dragon", "Wind"],
    type: 'special'
  },
];

// Helper function to check if Jablix can evolve
export function canEvolve(jablixId: number, type?: 'elemental' | 'special'): boolean {
  return getNextEvolution(jablixId, type) !== null;
}

// Helper function to get current phase
export function getCurrentPhase(jablixId: number): number {
  const chain = getEvolutionChainForJablix(jablixId);
  if (!chain) return 0;
  
  if (chain.phase1 === jablixId) return 1;
  if (chain.phase2 === jablixId) return 2;
  if (chain.phase3 === jablixId) return 3;
  
  return 0;
}
