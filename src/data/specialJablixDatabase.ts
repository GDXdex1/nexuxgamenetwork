// src/data/specialJablixDatabase.ts

import { Element } from '@/types/game.types';

/**
 * Special Jablix Database
 * Complete data for all Special types (Exrix, Dragons, Cosmic)
 * Based on jablix_special Move contract
 */

export interface SpecialJablixData {
  id: number;
  name: string;
  elements: Element[];
  hp: number;
  energy: number;
  speed: number;
  attack: number;
  defense: number;
  imageUrl: string;
  tier: 'exrix' | 'dragon' | 'minidragon' | 'cosmic';
  mintable: boolean;
  evolutionTarget?: number;
}

// Element mappings for special types
function getElementsForSpecialType(typeId: number): Element[] {
  if (typeId === 1) return [Element.DRAGON];
  
  if (typeId >= 23 && typeId <= 40) {
    const elementMap: Record<number, Element[]> = {
      23: [Element.COSMIC, Element.DARK], 24: [Element.COSMIC, Element.DARK],
      25: [Element.COSMIC, Element.DRAGON], 26: [Element.COSMIC, Element.DRAGON],
      27: [Element.COSMIC, Element.EARTH], 28: [Element.COSMIC, Element.EARTH],
      29: [Element.COSMIC, Element.ELECTRIC], 30: [Element.COSMIC, Element.ELECTRIC],
      31: [Element.COSMIC, Element.FIRE], 32: [Element.COSMIC, Element.FIRE],
      33: [Element.COSMIC, Element.ICE], 34: [Element.COSMIC, Element.ICE],
      35: [Element.COSMIC, Element.PLANT], 36: [Element.COSMIC, Element.PLANT],
      37: [Element.COSMIC, Element.WATER], 38: [Element.COSMIC, Element.WATER],
      39: [Element.COSMIC, Element.WIND], 40: [Element.COSMIC, Element.WIND]
    };
    return elementMap[typeId] || [Element.COSMIC];
  }
  
  const dragonElementMap: Record<number, Element[]> = {
    1: [Element.DRAGON], 14: [Element.DRAGON, Element.DARK],
    17: [Element.DRAGON, Element.EARTH], 18: [Element.DRAGON, Element.ELECTRIC],
    19: [Element.DRAGON, Element.COSMIC], 22: [Element.DRAGON, Element.PLANT],
    42: [Element.DRAGON, Element.FIRE], 46: [Element.DRAGON, Element.WIND],
    54: [Element.DRAGON, Element.ICE], 58: [Element.DRAGON, Element.WATER],
    59: [Element.DRAGON, Element.WATER], 60: [Element.DRAGON, Element.DARK],
    61: [Element.DRAGON, Element.EARTH], 62: [Element.DRAGON, Element.ELECTRIC],
    63: [Element.DRAGON, Element.FIRE], 64: [Element.DRAGON, Element.ICE],
    65: [Element.DRAGON, Element.PLANT], 66: [Element.DRAGON, Element.WIND],
    67: [Element.DRAGON, Element.COSMIC]
  };
  
  if (dragonElementMap[typeId]) {
    return dragonElementMap[typeId];
  }
  
  return [Element.COSMIC];
}

// Stats mappings for special types - EXACT MATCH WITH SMART CONTRACT
function getStatsForSpecialType(typeId: number): {
  hp: number;
  energy: number;
  speed: number;
  attack: number;
  defense: number;
} {
  // Stats map matching smart contract EXACTLY: (hp, energy, speed, attack, defense)
  const statsMap: Record<number, [number, number, number, number, number]> = {
    // Dragons (Full-size)
    1: [120, 120, 120, 130, 120],    // Pure Dragon
    14: [125, 115, 110, 120, 110],   // Dark Dragon
    17: [125, 115, 110, 110, 130],   // Earth Dragon
    18: [110, 130, 120, 115, 100],   // Electric Dragon
    19: [115, 120, 115, 120, 110],   // Dragon Cosmic
    22: [130, 110, 105, 115, 115],   // Plant Dragon
    42: [125, 110, 100, 130, 110],   // Fire Dragon
    46: [125, 110, 130, 115, 100],   // Wind Dragon
    54: [110, 120, 100, 110, 120],   // Ice Dragon
    59: [115, 120, 110, 115, 110],   // Water Dragon
    
    // Minidragons (Baby Dragons)
    58: [70, 75, 70, 80, 70],        // Minidragon Aqua
    60: [70, 75, 70, 80, 70],        // Minidragon Dark
    61: [70, 75, 70, 70, 90],        // Minidragon Earth
    62: [70, 90, 80, 75, 60],        // Minidragon Electric
    63: [70, 75, 60, 90, 70],        // Minidragon Fire
    64: [70, 80, 60, 70, 80],        // Minidragon Ice
    65: [75, 70, 65, 75, 75],        // Minidragon Plant
    66: [70, 70, 90, 75, 60],        // Minidragon Wind
    67: [70, 75, 70, 80, 70],        // Minidragon Cosmic
    
    // Exrix (Base forms)
    23: [75, 105, 90, 110, 90],      // Exrix Dark
    25: [90, 100, 95, 105, 95],      // Exrix Dragon
    27: [85, 95, 80, 100, 110],      // Exrix Earth
    29: [85, 105, 100, 100, 80],     // Exrix Electric
    31: [75, 95, 90, 110, 90],       // Exrix Fire
    33: [85, 95, 70, 100, 110],      // Exrix Ice
    35: [105, 95, 90, 80, 90],       // Exrix Plant
    37: [85, 95, 90, 100, 90],       // Exrix Water
    39: [85, 95, 110, 100, 70],      // Exrix Wind
    
    // Exrix (Evolved forms)
    24: [99, 137, 117, 143, 117],    // Exrix Dark Evo
    26: [119, 130, 124, 137, 124],   // Exrix Dragon Evo
    28: [112, 124, 104, 130, 143],   // Exrix Earth Evo
    30: [112, 137, 130, 130, 104],   // Exrix Electric Evo
    32: [99, 124, 117, 143, 117],    // Exrix Fire Evo
    34: [112, 124, 91, 130, 143],    // Exrix Ice Evo
    36: [138, 124, 117, 104, 117],   // Exrix Plant Evo
    38: [112, 124, 117, 130, 117],   // Exrix Water Evo
    40: [112, 124, 143, 130, 91],    // Exrix Wind Evo
    
    // Cosmic (Ultra-rare)
    68: [120, 120, 120, 130, 120],   // Nebula Blue
    70: [120, 120, 120, 130, 120],   // Nova Violet
    82: [120, 120, 120, 130, 120],   // Orbit Sky
    85: [120, 120, 120, 130, 120],   // Starlight Pink
  };
  
  const stats = statsMap[typeId];
  if (stats) {
    return {
      hp: stats[0],
      energy: stats[1],
      speed: stats[2],
      attack: stats[3],
      defense: stats[4]
    };
  }
  
  // Default fallback for unknown types
  return { hp: 80, energy: 80, speed: 80, attack: 80, defense: 80 };
}

// Name mappings for special types
function getNameForSpecialType(typeId: number): string {
  const nameMap: Record<number, string> = {
    1: 'Pure Dragon', 14: 'Dark Dragon', 17: 'Earth Dragon', 18: 'Electric Dragon',
    19: 'Dragon Cosmic', 22: 'Plant Dragon', 23: 'Exrix Dark', 24: 'Exrix Dark Evo',
    25: 'Exrix Dragon', 26: 'Exrix Dragon Evo', 27: 'Exrix Earth', 28: 'Exrix Earth Evo',
    29: 'Exrix Electric', 30: 'Exrix Electric Evo', 31: 'Exrix Fire', 32: 'Exrix Fire Evo',
    33: 'Exrix Ice', 34: 'Exrix Ice Evo', 35: 'Exrix Plant', 36: 'Exrix Plant Evo',
    37: 'Exrix Water', 38: 'Exrix Water Evo', 39: 'Exrix Wind', 40: 'Exrix Wind Evo',
    42: 'Fire Dragon', 46: 'Wind Dragon', 54: 'Ice Dragon', 58: 'Minidragon Aqua',
    59: 'Water Dragon', 60: 'Minidragon Dark', 61: 'Minidragon Earth', 62: 'Minidragon Electric',
    63: 'Minidragon Fire', 64: 'Minidragon Ice', 65: 'Minidragon Plant', 66: 'Minidragon Wind',
    67: 'Minidragon Cosmic', 68: 'Nebula Blue', 70: 'Nova Violet', 82: 'Orbit Sky', 85: 'Starlight Pink'
  };
  
  return nameMap[typeId] || `Special #${typeId}`;
}

// IPFS metadata URLs verified from contract
const SPECIAL_METADATA_URLS: Record<number, string> = {
  // Exrix (Base forms and evolutions)
  23: 'https://ipfs.io/ipfs/QmfJupZXRxvvtfvvnJxajQ8rNYhXjyZ2zmgZhzZGkhHwvp', // Exrix Dark
  24: 'https://ipfs.io/ipfs/Qma6tKcQE8zfB8Y8tGd1Hk5QoJK7oHE8L4abVo5mKCQp7L', // Exrix Dark Evo
  25: 'https://ipfs.io/ipfs/Qmb4EJzvDLNagzRAm7gQx3rJc7536cjEud9NLtVnsqs4JN', // Exrix Dragon
  26: 'https://ipfs.io/ipfs/Qmdvw1drCMhhFZjuHdy8zh8WYB8uJDn63JkVLuKW94C5gn', // Exrix Dragon Evo
  27: 'https://ipfs.io/ipfs/QmPhBTwRb8vYEn23afdcZ1hjGKnvC1LVLqaiB6ZbkHfx1W', // Exrix Earth
  28: 'https://ipfs.io/ipfs/QmY1j4Pda2ezV2q6Ri3AoQ3TXVa7vmNQpJNSTSmsKetcnE', // Exrix Earth Evo
  29: 'https://ipfs.io/ipfs/QmZ6AGZzsj5odh6ckB3JS9nphNmx5N8vzfwEMShgJ9QkJy', // Exrix Electric
  30: 'https://ipfs.io/ipfs/QmT2dAMBFr8QV49pr5HsMzxv4RJoqCZonffu6dwoSE5s5s', // Exrix Electric Evo
  31: 'https://ipfs.io/ipfs/QmTR6AhxouTLttf8FHm9PWgYoSYqozM6rmsvsZvkPsVyVe', // Exrix Fire
  32: 'https://ipfs.io/ipfs/QmZRR1NLTyCzkv5noaXa1ujrRn14J4qQHVYf5P7jxWq49j', // Exrix Fire Evo
  33: 'https://ipfs.io/ipfs/QmWWxNMmkUzRGdetQESvEzcur8Gte39WEiuv5nwp4z8rFo', // Exrix Ice
  34: 'https://ipfs.io/ipfs/QmTFL7ReSQtZJxymLu6ic1RTDVdNKCtrt1VGgNGZWK46x2', // Exrix Ice Evo
  35: 'https://ipfs.io/ipfs/QmVBDZmnsrY7NUKtVewWrWdvBZ3BbF8Xheouzjo9GctC2V', // Exrix Plant
  36: 'https://ipfs.io/ipfs/QmenVkBZFRSHm9CtZQTLwk5zRCswo6tGtnmnEwkty7aSbL', // Exrix Plant Evo
  37: 'https://ipfs.io/ipfs/QmX4XtN5VrCFq4x7DwRuy69AkD9MGT9CV2e7y71mpXidw6', // Exrix Water
  38: 'https://ipfs.io/ipfs/QmZj62mmEn8rTjVmhKrR7gFvtQ98q8ssafNGRk8wwk6HM8', // Exrix Water Evo
  39: 'https://ipfs.io/ipfs/QmWEBK59hNc79wGjEzEkkYaQjSAGCVzAf1SRQBPsEV66D3', // Exrix Wind
  40: 'https://ipfs.io/ipfs/QmSZdAdQffF3WCM253p7vnefhiEnUcXUCo5miz4fZCUjmz', // Exrix Wind Evo
  
  // Dragons (Pure and Elemental)
  1: 'https://ipfs.io/ipfs/QmWNTyuPq7qCa8HwZRgBcweqR74P8kSEJoVqgDn7hxRxap', // Pure Dragon
  14: 'https://ipfs.io/ipfs/QmfPyxUMrxtsJSZUioGW5Zir1RVPTGYux1qnpCJbHqxBsb', // Dragon Dark
  17: 'https://ipfs.io/ipfs/QmNmTafm3WUiPTPSjL5YodXQvVa4Fa3fCYT2RiCqY9bWrN', // Dragon Earth
  18: 'https://ipfs.io/ipfs/QmW2YAsJLTq2eFqX7Z4mXbLpxTc7z2AqnS6XfZuYWgLkJo', // Dragon Electric
  19: 'https://ipfs.io/ipfs/QmYnZbjwjSTJSs7MNEzvnfGvJqACYyLnPcYSYj7uYc2sAm', // Dragon Cosmic
  22: 'https://ipfs.io/ipfs/QmYmFhVrq3nJBgpzri4iWQ4uBT9XuMGanL4ZVWKgLEGydw', // Dragon Plant
  42: 'https://ipfs.io/ipfs/QmVEmD1mASPVPg339zduKw71frnkmiyshRLdWEzzht16se', // Dragon Fire
  46: 'https://ipfs.io/ipfs/QmPRJCnPD1EdYQ5bDPXL3hbw7vYdiBBpEaDrh2UaDhV7dn', // Dragon Wind
  54: 'https://ipfs.io/ipfs/QmSpUkE29cdgnd8kcSk2hT5j8M9QfLZx2HPh9sFcXkCTA5', // Dragon Ice
  59: 'https://ipfs.io/ipfs/QmPnTBHnDh2Za6TvocJGqqvr4Kc1QZBF9C672dJV2FVYEH', // Water Dragon
  
  // Minidragons (Evolve to Dragons)
  58: 'https://ipfs.io/ipfs/QmUmbbhFyxJ5MVDXbv1VeGp1FPvASsFb2kwSa4M6ney9GQ', // Minidragon Aqua
  60: 'https://ipfs.io/ipfs/QmbjWc6uEcfvdVp6RkgDJSMW4RPLTC6KKt9GwehJmyRppn', // Minidragon Dark
  61: 'https://ipfs.io/ipfs/QmWqMdkKWPxgQzgy4jYK6LrZWqR5M4wMwt2TTJmpxuWu7r', // Minidragon Earth
  62: 'https://ipfs.io/ipfs/QmbviBT3tmCpXDcdXruUyGvW56wsBYDrXMwXFwPagDmk4j', // Minidragon Electric
  63: 'https://ipfs.io/ipfs/QmNpEzwG5vV55K71MxHn2QjeGCN1sjrwaMMbwwePZZTdUE', // Minidragon Fire
  64: 'https://ipfs.io/ipfs/QmTAamfkkFbyxuYJLjF4TMCP4J3yELEEZiA2Hiu2WrN7L9', // Minidragon Ice
  65: 'https://ipfs.io/ipfs/QmSdHi3HscdZYbypD6q4At2itKLcMBnrDA5UfcSCEKxy4N', // Minidragon Plant
  66: 'https://ipfs.io/ipfs/QmcrDuxioxmA7E5pogutpTZQgTLvUUXH4uzZ3hx6XbL8Ne', // Minidragon Wind
  67: 'https://ipfs.io/ipfs/QmYaeRDTt16nU2CqoENSqZXt6kTRg5WTHVaMWWCLkFF74p', // Minidragon Cosmic
  
  // Cosmic (Rare Special Types)
  68: 'https://ipfs.io/ipfs/Qman3w6xfKKx4aL6d935TtZp7ZzPX6GHszV7Lp3cUaderM', // Nebula Blue
  70: 'https://ipfs.io/ipfs/QmSnxgYa61sunN9b8SyQW8ST1tXHtWUN1HS95A6cVKmfAk', // Nova Violet
  82: 'https://ipfs.io/ipfs/QmbWthcxys3uECZBT5gHsCzVpNdCa8Ym16orzsoLCVN4Sc', // Orbit Sky
  85: 'https://ipfs.io/ipfs/QmXXLi16axeLD1hM14bvwq3d8SZHp8c3DaaNahba51EBBg'  // Starlight Pink (placeholder)
};

// Evolution chains
const EVOLUTION_TARGETS: Record<number, number> = {
  23: 24, 25: 26, 27: 28, 29: 30, 31: 32,
  33: 34, 35: 36, 37: 38, 39: 40,
  58: 59, 60: 14, 61: 17, 62: 18,
  63: 42, 64: 54, 65: 22, 66: 46
};

// Mintable special types
const MINTABLE_TYPES = [
  1, 23, 25, 27, 29, 31, 33, 35, 37, 39,
  58, 60, 61, 62, 63, 64, 65, 66, 67,
  68, 70, 82, 85
];

// Determine tier
function getTier(typeId: number): 'exrix' | 'dragon' | 'minidragon' | 'cosmic' {
  if (typeId >= 23 && typeId <= 40) return 'exrix';
  if (typeId === 68 || typeId === 70 || typeId === 82 || typeId === 85) return 'cosmic';
  // Minidragons: 58, 60-67 (excluding 59 which is Water Dragon)
  if ((typeId >= 60 && typeId <= 67) || typeId === 58) return 'minidragon';
  return 'dragon';
}

// All special type IDs
const ALL_SPECIAL_TYPE_IDS = [
  1, 14, 17, 18, 19, 22,
  ...Array.from({ length: 18 }, (_: unknown, i: number) => 23 + i),
  42, 46, 54,
  ...Array.from({ length: 10 }, (_: unknown, i: number) => 58 + i),
  68, 70, 82, 85
];

// Generate complete database
export const SPECIAL_JABLIX_DATABASE: Record<number, SpecialJablixData> = {};

for (const typeId of ALL_SPECIAL_TYPE_IDS) {
  const stats = getStatsForSpecialType(typeId);
  SPECIAL_JABLIX_DATABASE[typeId] = {
    id: typeId,
    name: getNameForSpecialType(typeId),
    elements: getElementsForSpecialType(typeId),
    ...stats,
    imageUrl: SPECIAL_METADATA_URLS[typeId] || 'https://ipfs.io/ipfs/QmXXLi16axeLD1hM14bvwq3d8SZHp8c3DaaNahba51EBBg',
    tier: getTier(typeId),
    mintable: MINTABLE_TYPES.includes(typeId),
    evolutionTarget: EVOLUTION_TARGETS[typeId]
  };
}

// Helper functions
export function getSpecialJablixData(typeId: number): SpecialJablixData | undefined {
  return SPECIAL_JABLIX_DATABASE[typeId];
}

export function getAllMintableSpecials(): SpecialJablixData[] {
  return Object.values(SPECIAL_JABLIX_DATABASE).filter(j => j.mintable);
}

export function getSpecialsByTier(tier: 'exrix' | 'dragon' | 'minidragon' | 'cosmic'): SpecialJablixData[] {
  return Object.values(SPECIAL_JABLIX_DATABASE).filter(j => j.tier === tier);
}

export function getMintableByTier(tier: 'exrix' | 'dragon' | 'minidragon' | 'cosmic'): SpecialJablixData[] {
  return Object.values(SPECIAL_JABLIX_DATABASE).filter(j => j.tier === tier && j.mintable);
}
