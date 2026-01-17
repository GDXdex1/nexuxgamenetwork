// src/data/elementalJablixDatabase.ts

import { Element } from '@/types/game.types';

/**
 * Elemental Jablix Database
 * Complete data for all Elemental types (1-94)
 * Based on jablix_elemental Move contract
 */

export interface ElementalJablixData {
  id: number;
  name: string;
  elements: Element[];
  hp: number;
  energy: number;
  speed: number;
  attack: number;
  defense: number;
  imageUrl: string;
  phase: number;
  mintable: boolean;
}

// Element mappings from Move contract
function getElementsForType(typeId: number): Element[] {
  const elementMap: Record<number, Element[]> = {
    1: [Element.WIND], 2: [Element.ELECTRIC], 3: [Element.WIND], 4: [Element.WIND],
    5: [Element.DARK], 6: [Element.FIRE], 7: [Element.EARTH, Element.ICE], 8: [Element.EARTH, Element.ICE],
    9: [Element.WATER], 10: [Element.ICE, Element.WIND], 11: [Element.ICE, Element.WIND],
    12: [Element.DARK], 13: [Element.DARK], 16: [Element.WATER], 19: [Element.FIRE], 20: [Element.FIRE],
    21: [Element.EARTH], 41: [Element.FIRE], 43: [Element.FIRE], 44: [Element.ICE], 45: [Element.ICE],
    48: [Element.EARTH], 49: [Element.EARTH], 50: [Element.PLANT], 51: [Element.PLANT],
    52: [Element.WIND], 53: [Element.WATER, Element.WIND], 55: [Element.ICE], 57: [Element.ELECTRIC],
    67: [Element.PLANT], 69: [Element.DARK], 71: [Element.ELECTRIC], 73: [Element.FIRE, Element.EARTH],
    75: [Element.EARTH], 76: [Element.FIRE], 77: [Element.PLANT], 78: [Element.DARK], 79: [Element.DARK],
    80: [Element.PLANT], 81: [Element.WIND], 83: [Element.ELECTRIC], 84: [Element.PLANT],
    86: [Element.EARTH], 88: [Element.ELECTRIC], 89: [Element.WATER], 90: [Element.WATER],
    91: [Element.ELECTRIC], 92: [Element.ELECTRIC], 93: [Element.WATER], 94: [Element.WIND]
  };

  return elementMap[typeId] || [Element.WIND];
}

// Name mappings from Move contract
function getNameForType(typeId: number): string {
  const nameMap: Record<number, string> = {
    1: 'Aeronaut', 2: 'Amperx', 3: 'Aixer', 4: 'Cyclon', 5: 'Blackix', 6: 'Cinder',
    7: 'Coldrert', 8: 'Coldruck', 9: 'Wotarix', 10: 'Cryomancer', 11: 'Culdrex',
    12: 'Darklack', 13: 'Darklix', 16: 'Droplet', 19: 'Ember', 20: 'Emberix',
    21: 'Ertlix', 41: 'Filprex', 43: 'Firexir', 44: 'Flurry', 45: 'Frostbite',
    48: 'Golemheart', 49: 'Golix', 50: 'Grixer', 51: 'Grixfox', 52: 'Gust',
    53: 'Hydroknight', 55: 'Icertrix', 57: 'Jolt', 67: 'Mosslin', 69: 'Nightprowler',
    71: 'Ohmspark', 73: 'Pyravenger', 75: 'Rockrin', 76: 'Scorch', 77: 'Seedling',
    78: 'Shade', 79: 'Shadix', 80: 'Siexgaguar', 81: 'Skirx', 83: 'Sparkle',
    84: 'Sproutguard', 86: 'Stonefox', 88: 'Tesliux', 89: 'Torrent', 90: 'Tsiux',
    91: 'Voltfang', 92: 'Voltrix', 93: 'Watlix', 94: 'Winderix'
  };

  return nameMap[typeId] || 'Zephir';
}

// Stats mappings from Move contract
function getStatsForType(typeId: number): {
  hp: number;
  energy: number;
  speed: number;
  attack: number;
  defense: number;
} {
  const statsMap: Record<number, [number, number, number, number, number]> = {
    1: [96, 100, 111, 112, 89], 2: [80, 110, 100, 115, 75], 3: [80, 75, 90, 85, 70],
    4: [96, 90, 108, 102, 84], 5: [80, 80, 75, 90, 80], 6: [90, 102, 78, 120, 84],
    7: [100, 112, 70, 90, 110], 8: [120, 134, 84, 108, 132], 9: [148, 108, 124, 126, 102],
    10: [108, 102, 90, 102, 124], 11: [90, 85, 75, 85, 95], 12: [120, 112, 70, 115, 130],
    13: [104, 104, 98, 117, 104], 16: [90, 80, 70, 80, 85], 19: [80, 90, 70, 105, 70],
    20: [96, 108, 94, 126, 84], 21: [90, 70, 70, 75, 95], 41: [95, 85, 70, 125, 110],
    43: [75, 85, 65, 100, 70], 44: [85, 80, 75, 80, 90], 45: [102, 96, 90, 96, 108],
    48: [108, 84, 84, 90, 114], 49: [117, 91, 91, 98, 134], 50: [140, 119, 70, 120, 120],
    51: [150, 119, 65, 110, 130], 52: [80, 75, 90, 85, 70], 53: [145, 120, 80, 105, 120],
    55: [111, 104, 98, 104, 117], 57: [70, 90, 85, 95, 70], 67: [105, 75, 75, 85, 125],
    69: [96, 96, 90, 108, 96], 71: [96, 132, 120, 138, 90], 73: [120, 105, 100, 130, 95],
    75: [120, 98, 55, 90, 130], 76: [98, 111, 85, 140, 91], 77: [85, 70, 65, 80, 90],
    78: [80, 75, 75, 90, 80], 79: [96, 100, 90, 108, 96], 80: [125, 106, 108, 124, 144],
    81: [104, 98, 117, 111, 91], 83: [75, 95, 90, 100, 70], 84: [102, 84, 78, 96, 108],
    86: [85, 115, 110, 120, 75], 88: [90, 114, 113, 120, 89], 89: [107, 96, 84, 96, 102],
    90: [116, 104, 111, 104, 111], 91: [84, 108, 102, 114, 84], 92: [91, 117, 144, 123, 91],
    93: [120, 90, 120, 105, 85], 94: [108, 90, 114, 108, 90]
  };

  const stats = statsMap[typeId] || [90, 75, 95, 90, 75];
  return {
    hp: stats[0],
    energy: stats[1],
    speed: stats[2],
    attack: stats[3],
    defense: stats[4]
  };
}

// IPFS metadata URLs verified from contract
const ELEMENTAL_METADATA_URLS: Record<number, string> = {
  1: 'https://ipfs.io/ipfs/QmRBJKDhg4JtgyYxLqXfGnZigzGrNzVhB7HvipHRs1S7Wg',
  2: 'https://ipfs.io/ipfs/QmaP7ukHbeKn88FdovZhFP6tA4SE6GpdKXD8hmBVC6z71X',
  3: 'https://ipfs.io/ipfs/QmWy9PUykBCcFfFWJqHz5UnoysGVCsAEFGuw35Tsvh7NiD',
  4: 'https://ipfs.io/ipfs/QmPzTUxAXr4wxTn1By1maupRKN9B14JnWeTmNn6zPo8LoY',
  5: 'https://ipfs.io/ipfs/Qmc4NSPs2HWF5GwpeGJSYUAFqFEf2xDBBHQAhX1sfZwfNn',
  6: 'https://ipfs.io/ipfs/QmWZjABBC1vBEXEsQD46o2RtgKfXNpGRzdSywFtJ3FHeUL',
  7: 'https://ipfs.io/ipfs/QmaFJe61Z898sijUriXit18q5To6WoRtv4aMRCJnJUSNcW',
  8: 'https://ipfs.io/ipfs/Qmcm7v3mqbfyZSmH7RE1Tz1jvToCPrgxPrN819Pjkw78v2',
  9: 'https://ipfs.io/ipfs/QmeTESrL9oWd6VpA5Tq7zQzso6VQuhyGB7NyPr2HKGBLQU',
  10: 'https://ipfs.io/ipfs/QmNc86XwBPuWv5FirPqQxjQER15xubQ79bC2GANBQEuLxy',
  11: 'https://ipfs.io/ipfs/QmUMiaC2mixooCwhL8WMFejxjLhFst4kW2fEcCeWLKveAP',
  12: 'https://ipfs.io/ipfs/QmPTW9TvU6RD1aiFvbcpmxe3hrYkB4z8dJh8qG1ub4Es11',
  13: 'https://ipfs.io/ipfs/Qma9GZriKJxGkVU9DG5jusuJDtqhRtWg92a7jxK8CpyC7D',
  16: 'https://ipfs.io/ipfs/Qmd5dWSr3s5M2it6BB2MBdGZqgCXyaSdzd1KN8KYDMdcBt', // Droplet
  19: 'https://ipfs.io/ipfs/QmaPowUY41J7p3P85kuuR78pxGcDtip4HK6PS8Udz2tBT5',
  20: 'https://ipfs.io/ipfs/QmZMte99mctVVtvx8zEa8rGrVY1KJXqmndwQxkpVdfT42J',
  21: 'https://ipfs.io/ipfs/QmedVE4WtjqKhY4uNPLj4wpdTYsJpjsyAWWLCJ2pLAQ7QW',
  41: 'https://ipfs.io/ipfs/QmNuHyKmkR1igFKuEHqVC3d11vhKxaQ7DbYErDSApxNKLz', // Filprex (Flixer)
  43: 'https://ipfs.io/ipfs/QmUo5WnWpsxooWsrYdtiLChpAotYmWs65C2q7jtoW3kfU3',
  44: 'https://ipfs.io/ipfs/QmY7V9HWKEJbxRjiicqWYCktoX881rFnDmopMhmJHXKc7w',
  45: 'https://ipfs.io/ipfs/Qmaod6a3FttbMmmcGrnmn3wWHtpc7qNq89X3FL9ZuVqzM3',
  48: 'https://ipfs.io/ipfs/QmdoXRrtUHFj8QbGqEKqc812EmpLffYk7wL7us37P2zZbz',
  49: 'https://ipfs.io/ipfs/QmQ8HkDcy77drznWyRtbA7AqomwX3fCfoFp1ToEbojktoK',
  50: 'https://ipfs.io/ipfs/QmUcp6pjtuJuGQQyiGvJmKrekLjDR9YtCourfuF74TqUcR',
  51: 'https://ipfs.io/ipfs/QmZHBpveRQXE3Lp6tWksDDswCVBx6DPhc5cxXDQxQdfb8n', // Grixfox
  52: 'https://ipfs.io/ipfs/QmPzAE7a9b6ZknHYuRkgGZQvBfJEKo9tpWgHtAFQXfgVjV',
  53: 'https://ipfs.io/ipfs/QmYr1Z2dFd8tuhatie7erTpkHRBqyCWHBGn9rHrwUuKxcP',
  55: 'https://ipfs.io/ipfs/QmTLgTMEeFTV6cmWxVnk3ZsUk6ak7at5K8tX7tBUJ76mmc',
  57: 'https://ipfs.io/ipfs/QmcyACFBZcw5BEaZqpVjXtq6raxJULJoXGEmPC6mZxCrGm',
  67: 'https://ipfs.io/ipfs/Qmc7vFj7w2XiuwsKo97gyZT3J2aoP7vdUXFC41VRzKFqiB', // Mosslin (Mossling)
  69: 'https://ipfs.io/ipfs/QmRo2o1bMjdficpWNsmSMSbFQcABCTrmMoqArNb24G4nzp',
  71: 'https://ipfs.io/ipfs/QmSFj88bX9im1FqwYAJRwkdGoSzqTH6QB9y14oB7w5TUrJ', // Ohmspark
  73: 'https://ipfs.io/ipfs/QmNiD2PYPKyvRWrUdLGSEdoe72twdYbi7mb8nWfxv35LE3',
  75: 'https://ipfs.io/ipfs/QmaBHiFjEctSyKzurhbtAFtokPipXwMmTbJVqnzAYLe1H2',
  76: 'https://ipfs.io/ipfs/QmeJrDE2P4Voabmf9nBSHVJixmHKJmvWktYgVzCFpQVcgm',
  77: 'https://ipfs.io/ipfs/QmUa4j3nzeb49gEPyxeL6beReRAubShFf3zBoEPnF1avwF',
  78: 'https://ipfs.io/ipfs/QmcKpSwiEQWaCTgjcSwCC34jo8XpxBLWU3Wmk24pSmWHu8',
  79: 'https://ipfs.io/ipfs/QmZqacTnDVMw95bcPzYUzXwapGyBurvaj1QT7FAvFaz9jJ',
  80: 'https://ipfs.io/ipfs/QmZ7KoqH1uXhg2WuuHijrjPP7F9ahz8coFYVrA9eM8h2Lb',
  81: 'https://ipfs.io/ipfs/QmfRr929cumRWmm8QaEqprJWfrdzDquWbnh8UsJ9a2e8FH',
  83: 'https://ipfs.io/ipfs/QmUFCwHxHMt2DQ7Bt1xmyNY5Z7FYnsihY8QhK8hktQ3Tbc',
  84: 'https://ipfs.io/ipfs/QmW2dAkZ42C9pHiiY2PuKW2WzUJcGae9LjWwrapLDZuKdq',
  86: 'https://ipfs.io/ipfs/QmRUnD4ZnQnqM64ozE8LdmTQigb9Yj55kVtxtYevti5uNQ',
  88: 'https://ipfs.io/ipfs/QmSdCjyHymJ7H5GAaQ3C7AXqx6hSENUVzeV9NJMWiXFijj',
  89: 'https://ipfs.io/ipfs/QmQsWw8pLe6ic1hqkePuMxxLHj8455BDY8BRrM8dUgUo8M', // Torrent
  90: 'https://ipfs.io/ipfs/QmYQCCEbu8ZhmLkRme7tTLCrRLJDmW9R1C2Sj5myuKWZqa', // Tsiux
  91: 'https://ipfs.io/ipfs/QmNbHxbJjD15zAiRF2gcKzAuHoesANvSZrkTJuYCs1gU7u',
  92: 'https://ipfs.io/ipfs/QmdHkzsWgTihTcVsbPG23iH4swdGUr6gzym2FMJstQ3sQX',
  93: 'https://ipfs.io/ipfs/QmXjrqTAVUkd7vprg7DPaRrSMmsqdCr96TrHzTbt9K7BWk',
  94: 'https://ipfs.io/ipfs/QmTe7DYNssktTZyAiLAe7aM3JQQNPttYAMSZrwXj48pce6'
};

// Mintable elemental types (base forms only)
const MINTABLE_ELEMENTAL_TYPES = [
  77, 67, 50, 51, 21, 7, 86, 75,
  57, 83, 2, 5, 78, 12, 93, 53, 16,
  41, 43, 19, 52, 3, 44, 11
];

function isMintable(typeId: number): boolean {
  return MINTABLE_ELEMENTAL_TYPES.includes(typeId);
}

// All elemental type IDs
const ALL_ELEMENTAL_TYPE_IDS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 16, 19, 20, 21, 41, 43, 44,
  45, 48, 49, 50, 51, 52, 53, 55, 57, 67,
  69, 71, 73, 75, 76, 77, 78, 79, 80, 81,
  83, 84, 86, 88, 89, 90, 91, 92, 93, 94
];

// Generate complete database
export const ELEMENTAL_JABLIX_DATABASE: Record<number, ElementalJablixData> = {};

for (const typeId of ALL_ELEMENTAL_TYPE_IDS) {
  const stats = getStatsForType(typeId);
  ELEMENTAL_JABLIX_DATABASE[typeId] = {
    id: typeId,
    name: getNameForType(typeId),
    elements: getElementsForType(typeId),
    ...stats,
    imageUrl: ELEMENTAL_METADATA_URLS[typeId] || 'https://ipfs.io/ipfs/Qme83pVvjLbgB9EDbgK9AUZzwMzLg9649fBgfzFgqRjbJN',
    phase: 1,
    mintable: isMintable(typeId)
  };
}

// Helper functions
export function getElementalJablixData(typeId: number): ElementalJablixData | undefined {
  return ELEMENTAL_JABLIX_DATABASE[typeId];
}

export function getAllMintableElementals(): ElementalJablixData[] {
  return Object.values(ELEMENTAL_JABLIX_DATABASE).filter(j => j.mintable);
}

export function getElementalsByPhase(phase: number): ElementalJablixData[] {
  return Object.values(ELEMENTAL_JABLIX_DATABASE).filter(j => j.phase === phase);
}

export function getElementalsByElement(element: Element): ElementalJablixData[] {
  return Object.values(ELEMENTAL_JABLIX_DATABASE).filter(j => 
    j.elements.includes(element)
  );
}

export function isElementalType(typeId: number): boolean {
  return ALL_ELEMENTAL_TYPE_IDS.includes(typeId);
}

// Cost constants
export const ELEMENTAL_MINT_COST = 1_000_000_000_000n; // 1000 JXC with 9 decimals
