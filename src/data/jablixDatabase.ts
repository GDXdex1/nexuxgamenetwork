// src/data/jablixDatabase.ts

import type { Jablix } from '@/types/game.types';
import { Element } from '@/types/game.types';
import { CARD_DATABASE } from './cardDatabase';

// URLs de imágenes de IPFS (truncated for brevity - first 100)
const METADATA_URLS: string[] = [
  "https://ipfs.io/ipfs/QmRBJKDhg4JtgyYxLqXfGnZigzGrNzVhB7HvipHRs1S7Wg",
  "https://ipfs.io/ipfs/QmaP7ukHbeKn88FdovZhFP6tA4SE6GpdKXD8hmBVC6z71X",
  "https://ipfs.io/ipfs/QmWy9PUykBCcFfFWJqHz5UnoysGVCsAEFGuw35Tsvh7NiD",
  "https://ipfs.io/ipfs/QmcAvRTMfhnwwWJ36rjDj756uZ9NqND63fggqwcw93ydqJ",
  "https://ipfs.io/ipfs/Qmc4NSPs2HWF5GwpeGJSYUAFqFEf2xDBBHQAhX1sfZwfNn",
  "https://ipfs.io/ipfs/QmWZjABBC1vBEXEsQD46o2RtgKfXNpGRzdSywFtJ3FHeUL",
  "https://ipfs.io/ipfs/QmaFJe61Z898sijUriXit18q5To6WoRtv4aMRCJnJUSNcW",
  "https://ipfs.io/ipfs/Qmcm7v3mqbfyZSmH7RE1Tz1jvToCPrgxPrN819Pjkw78v2",
  "https://ipfs.io/ipfs/QmXXLi16axeLD1hM14bvwq3d8SZHp8c3DaaNahba51EBBg",
  "https://ipfs.io/ipfs/QmNc86XwBPuWv5FirPqQxjQER15xubQ79bC2GANBQEuLxy",
  "https://ipfs.io/ipfs/QmUMiaC2mixooCwhL8WMFejxjLhFst4kW2fEcCeWLKveAP",
  "https://ipfs.io/ipfs/QmPTW9TvU6RD1aiFvbcpmxe3hrYkB4z8dJh8qG1ub4Es11",
  "https://ipfs.io/ipfs/Qma9GZriKJxGkVU9DG5jusuJDtqhRtWg92a7jxK8CpyC7D",
  "https://ipfs.io/ipfs/QmfPyxUMrxtsJSZUioGW5Zir1RVPTGYux1qnpCJbHqxBsb",
  "https://ipfs.io/ipfs/Qman3w6xfKKx4aL6d935TtZp7ZzPX6GHszV7Lp3cUaderM",
  "https://ipfs.io/ipfs/QmX3nDoFeb1RuPUe3VbsHYkTAM5VSpp6PKPJN6iPow6RXz",
  "https://ipfs.io/ipfs/QmNmTafm3WUiPTPSjL5YodXQvVa4Fa3fCYT2RiCqY9bWrN",
  "https://ipfs.io/ipfs/QmW2YAsJLTq2eFqX7Z4mXbLpxTc7z2AqnS6XfZuYWgLkJo",
  "https://ipfs.io/ipfs/QmaPowUY41J7p3P85kuuR78pxGcDtip4HK6PS8Udz2tBT5",
  "https://ipfs.io/ipfs/QmZMte99mctVVtvx8zEa8rGrVY1KJXqmndwQxkpVdfT42J",
  "https://ipfs.io/ipfs/QmedVE4WtjqKhY4uNPLj4wpdTYsJpjsyAWWLCJ2pLAQ7QW",
  "https://ipfs.io/ipfs/QmYnZbjwjSTJSs7MNEzvnfGvJqACYyLnPcYSYj7uYc2sAm",
  "https://ipfs.io/ipfs/QmfJupZXRxvvtfvvnJxajQ8rNYhXjyZ2zmgZhzZGkhHwvp",
  "https://ipfs.io/ipfs/Qma6tKcQE8zfB8Y8tGd1Hk5QoJK7oHE8L4abVo5mKCQp7L",
  "https://ipfs.io/ipfs/Qmb4EJzvDLNagzRAm7gQx3rJc7536cjEud9NLtVnsqs4JN",
  "https://ipfs.io/ipfs/Qmdvw1drCMhhFZjuHdy8zh8WYB8uJDn63JkVLuKW94C5gn",
  "https://ipfs.io/ipfs/QmPhBTwRb8vYEn23afdcZ1hjGKnvC1LVLqaiB6ZbkHfx1W",
  "https://ipfs.io/ipfs/QmY1j4Pda2ezV2q6Ri3AoQ3TXVa7vmNQpJNSTSmsKetcnE",
  "https://ipfs.io/ipfs/QmZ6AGZzsj5odh6ckB3JS9nphNmx5N8vzfwEMShgJ9QkJy",
  "https://ipfs.io/ipfs/QmT2dAMBFr8QV49pr5HsMzxv4RJoqCZonffu6dwoSE5s5s",
  "https://ipfs.io/ipfs/QmTR6AhxouTLttf8FHm9PWgYoSYqozM6rmsvsZvkPsVyVe",
  "https://ipfs.io/ipfs/QmZRR1NLTyCzkv5noaXa1ujrRn14J4qQHVYf5P7jxWq49j",
  "https://ipfs.io/ipfs/QmWWxNMmkUzRGdetQESvEzcur8Gte39WEiuv5nwp4z8rFo",
  "https://ipfs.io/ipfs/QmTFL7ReSQtZJxymLu6ic1RTDVdNKCtrt1VGgNGZWK46x2",
  "https://ipfs.io/ipfs/QmVBDZmnsrY7NUKtVewWrWdvBZ3BbF8Xheouzjo9GctC2V",
  "https://ipfs.io/ipfs/QmenVkBZFRSHm9CtZQTLwk5zRCswo6tGtnmnEwkty7aSbL",
  "https://ipfs.io/ipfs/QmX4XtN5VrCFq4x7DwRuy69AkD9MGT9CV2e7y71mpXidw6",
  "https://ipfs.io/ipfs/QmZj62mmEn8rTjVmhKrR7gFvtQ98q8ssafNGRk8wwk6HM8",
  "https://ipfs.io/ipfs/QmWEBK59hNc79wGjEzEkkYaQjSAGCVzAf1SRQBPsEV66D3",
  "https://ipfs.io/ipfs/QmSZdAdQffF3WCM253p7vnefhiEnUcXUCo5miz4fZCUjmz",
  "https://ipfs.io/ipfs/QmRTbfjQjxXmsmFrbcU3HcBdLjVnEb6GBjm2soTmnWbN5V",
  "https://ipfs.io/ipfs/QmVEmD1mASPVPg339zduKw71frnkmiyshRLdWEzzht16se",
  "https://ipfs.io/ipfs/QmUo5WnWpsxooWsrYdtiLChpAotYmWs65C2q7jtoW3kfU3",
  "https://ipfs.io/ipfs/QmY7V9HWKEJbxRjiicqWYCktoX881rFnDmopMhmJHXKc7w",
  "https://ipfs.io/ipfs/Qmaod6a3FttbMmmcGrnmn3wWHtpc7qNq89X3FL9ZuVqzM3",
  "https://ipfs.io/ipfs/QmXXLi16axeLD1hM14bvwq3d8SZHp8c3DaaNahba51EBBg",
  "https://ipfs.io/ipfs/QmXXLi16axeLD1hM14bvwq3d8SZHp8c3DaaNahba51EBBg",
  "https://ipfs.io/ipfs/QmdoXRrtUHFj8QbGqEKqc812EmpLffYk7wL7us37P2zZbz",
  "https://ipfs.io/ipfs/QmQ8HkDcy77drznWyRtbA7AqomwX3fCfoFp1ToEbojktoK",
  "https://ipfs.io/ipfs/QmUcp6pjtuJuGQQyiGvJmKrekLjDR9YtCourfuF74TqUcR",
  "https://ipfs.io/ipfs/QmXMbQDunbKZY4Udwg33UC9cNqTVxmeTeLteuYucpUTeHP",
  "https://ipfs.io/ipfs/QmPzAE7a9b6ZknHYuRkgGZQvBfJEKo9tpWgHtAFQXfgVjV",
  "https://ipfs.io/ipfs/QmYr1Z2dFd8tuhatie7erTpkHRBqyCWHBGn9rHrwUuKxcP",
  "https://ipfs.io/ipfs/QmSpUkE29cdgnd8kcSk2hT5j8M9QfLZx2HPh9sFcXkCTA5",
  "https://ipfs.io/ipfs/QmTLgTMEeFTV6cmWxVnk3ZsUk6ak7at5K8tX7tBUJ76mmc",
  "https://ipfs.io/ipfs/QmXXLi16axeLD1hM14bvwq3d8SZHp8c3DaaNahba51EBBg",
  "https://ipfs.io/ipfs/QmcyACFBZcw5BEaZqpVjXtq6raxJULJoXGEmPC6mZxCrGm",
  "https://ipfs.io/ipfs/QmUmbbhFyxJ5MVDXbv1VeGp1FPvASsFb2kwSa4M6ney9GQ",
  "https://ipfs.io/ipfs/QmWNTyuPq7qCa8HwZRgBcweqR74P8kSEJoVqgDn7hxRxap",
  "https://ipfs.io/ipfs/Qmbo9D1h9zgW5KQ7mcvnnthyXt1FEsC85zyAcJvnMEhCTk",
  "https://ipfs.io/ipfs/QmWetYV5Q6pNuL8ZnDgDANBjEtZnZ1HXubNb2AKp1CaFUm",
  "https://ipfs.io/ipfs/QmbviBT3tmCpXDcdXruUyGvW56wsBYDrXMwXFwPagDmk4j",
  "https://ipfs.io/ipfs/QmNpEzwG5vV55K71MxHn2QjeGCN1sjrwaMMbwwePZZTdUE",
  "https://ipfs.io/ipfs/QmTAamfkkFbyxuYJLjF4TMCP4J3yELEEZiA2Hiu2WrN7L9",
  "https://ipfs.io/ipfs/QmSdHi3HscdZYbypD6q4At2itKLcMBnrDA5UfcSCEKxy4N",
  "https://ipfs.io/ipfs/QmcrDuxioxmA7E5pogutpTZQgTLvUUXH4uzZ3hx6XbL8Ne",
  "https://ipfs.io/ipfs/Qme2C22dL3JFBijdxWi7wR9wfLhnoS1rocorBoJYxPmJUb",
  "https://ipfs.io/ipfs/Qman3w6xfKKx4aL6d935TtZp7ZzPX6GHszV7Lp3cUaderM",
  "https://ipfs.io/ipfs/QmRo2o1bMjdficpWNsmSMSbFQcABCTrmMoqArNb24G4nzp",
  "https://ipfs.io/ipfs/QmSnxgYa61sunN9b8SyQW8ST1tXHtWUN1HS95A6cVKmfAk",
  "https://ipfs.io/ipfs/QmWEj51MZPL2wSfYvZJet72pVGnsBzU4KqVQYyaCmmYdE4",
  "https://ipfs.io/ipfs/QmbWthcxys3uECZBT5gHsCzVpNdCa8Ym16orzsoLCVN4Sc",
  "https://ipfs.io/ipfs/QmNiD2PYPKyvRWrUdLGSEdoe72twdYbi7mb8nWfxv35LE3",
  "https://ipfs.io/ipfs/QmXXLi16axeLD1hM14bvwq3d8SZHp8c3DaaNahba51EBBg",
  "https://ipfs.io/ipfs/QmaBHiFjEctSyKzurhbtAFtokPipXwMmTbJVqnzAYLe1H2",
  "https://ipfs.io/ipfs/QmeJrDE2P4Voabmf9nBSHVJixmHKJmvWktYgVzCFpQVcgm",
  "https://ipfs.io/ipfs/QmUa4j3nzeb49gEPyxeL6beReRAubShFf3zBoEPnF1avwF",
  "https://ipfs.io/ipfs/QmcKpSwiEQWaCTgjcSwCC34jo8XpxBLWU3Wmk24pSmWHu8",
  "https://ipfs.io/ipfs/QmZqacTnDVMw95bcPzYUzXwapGyBurvaj1QT7FAvFaz9jJ",
  "https://ipfs.io/ipfs/QmZ7KoqH1uXhg2WuuHijrjPP7F9ahz8coFYVrA9eM8h2Lb",
  "https://ipfs.io/ipfs/QmfRr929cumRWmm8QaEqprJWfrdzDquWbnh8UsJ9a2e8FH",
  "https://ipfs.io/ipfs/QmNV2Em3hMRX3SgKXkkrjdBjR8EefsWvZo6uvikMJKsfC1",
  "https://ipfs.io/ipfs/QmUFCwHxHMt2DQ7Bt1xmyNY5Z7FYnsihY8QhK8hktQ3Tbc",
  "https://ipfs.io/ipfs/QmW2dAkZ42C9pHiiY2PuKW2WzUJcGae9LjWwrapLDZuKdq",
  "https://ipfs.io/ipfs/QmRTP7kULc2J53htVFZRTfe6hbuyM4hjXE99UtHMQcScNn",
  "https://ipfs.io/ipfs/QmRUnD4ZnQnqM64ozE8LdmTQigb9Yj55kVtxtYevti5uNQ",
  "https://ipfs.io/ipfs/QmXXLi16axeLD1hM14bvwq3d8SZHp8c3DaaNahba51EBBg",
  "https://ipfs.io/ipfs/QmSdCjyHymJ7H5GAaQ3C7AXqx6hSENUVzeV9NJMWiXFijj",
  "https://ipfs.io/ipfs/QmQzjbrp1BbEZy512947jv94YVvcznrrLad1nKZFxCzGRX",
  "https://ipfs.io/ipfs/QmSYq7Fuy79bpLxjqj77f5nVvytHcdk2cM59zDtkTokkTZ",
  "https://ipfs.io/ipfs/QmNbHxbJjD15zAiRF2gcKzAuHoesANvSZrkTJuYCs1gU7u",
  "https://ipfs.io/ipfs/QmdHkzsWgTihTcVsbPG23iH4swdGUr6gzym2FMJstQ3sQX",
  "https://ipfs.io/ipfs/QmXjrqTAVUkd7vprg7DPaRrSMmsqdCr96TrHzTbt9K7BWk",
  "https://ipfs.io/ipfs/QmTe7DYNssktTZyAiLAe7aM3JQQNPttYAMSZrwXj48pce6",
  "https://ipfs.io/ipfs/Qme83pVvjLbgB9EDbgK9AUZzwMzLg9649fBgfzFgqRjbJN"
];

interface JablixTemplate {
  id: number;
  name: string;
  elements: Element[];
  imageUrl: string;
  hp: number;
  speed: number;
  baseAttack: number;
  baseDefense: number;
  cardIds: string[];
}

// Mapeo de elementos por type_id (basado en el contrato Move)
function getElementsForType(typeId: number): Element[] {
  const elementMap: Record<number, Element[]> = {
    1: [Element.WIND, Element.COSMIC], 2: [Element.ELECTRIC], 3: [Element.WIND], 4: [Element.COSMIC],
    5: [Element.DARK], 6: [Element.FIRE], 7: [Element.EARTH, Element.ICE], 8: [Element.EARTH, Element.ICE],
    9: [Element.COSMIC], 10: [Element.ICE], 11: [Element.ICE], 12: [Element.DARK], 13: [Element.DARK],
    14: [Element.DRAGON, Element.DARK], 15: [Element.COSMIC], 16: [Element.WATER],
    17: [Element.DRAGON, Element.EARTH], 18: [Element.DRAGON, Element.ELECTRIC],
    19: [Element.FIRE], 20: [Element.FIRE], 21: [Element.EARTH], 22: [Element.DRAGON, Element.COSMIC],
    23: [Element.DARK], 24: [Element.DARK], 25: [Element.DRAGON], 26: [Element.DRAGON],
    27: [Element.EARTH], 28: [Element.EARTH], 29: [Element.ELECTRIC], 30: [Element.ELECTRIC],
    31: [Element.FIRE], 32: [Element.FIRE], 33: [Element.ICE], 34: [Element.ICE],
    35: [Element.PLANT], 36: [Element.PLANT], 37: [Element.WATER], 38: [Element.WATER],
    39: [Element.WIND], 40: [Element.WIND], 41: [Element.FIRE], 42: [Element.DRAGON, Element.FIRE],
    43: [Element.FIRE], 44: [Element.ICE], 45: [Element.ICE], 46: [Element.COSMIC], 47: [Element.COSMIC],
    48: [Element.EARTH], 49: [Element.EARTH], 50: [Element.PLANT], 51: [Element.PLANT],
    52: [Element.WIND], 53: [Element.WATER, Element.WIND], 54: [Element.DRAGON, Element.ICE],
    55: [Element.ICE], 56: [Element.COSMIC], 57: [Element.ELECTRIC], 58: [Element.DRAGON, Element.WATER],
    59: [Element.DRAGON, Element.COSMIC], 60: [Element.DRAGON, Element.DARK],
    61: [Element.DRAGON, Element.EARTH], 62: [Element.DRAGON, Element.ELECTRIC],
    63: [Element.DRAGON, Element.FIRE], 64: [Element.DRAGON, Element.ICE],
    65: [Element.DRAGON, Element.PLANT], 66: [Element.DRAGON, Element.WIND],
    67: [Element.PLANT], 68: [Element.COSMIC], 69: [Element.DARK], 70: [Element.COSMIC],
    71: [Element.ELECTRIC], 72: [Element.COSMIC], 73: [Element.FIRE, Element.EARTH],
    74: [Element.COSMIC], 75: [Element.EARTH], 76: [Element.FIRE], 77: [Element.PLANT],
    78: [Element.DARK], 79: [Element.DARK], 80: [Element.PLANT], 81: [Element.WIND],
    82: [Element.COSMIC], 83: [Element.ELECTRIC], 84: [Element.PLANT], 85: [Element.COSMIC],
    86: [Element.EARTH], 87: [Element.COSMIC], 88: [Element.ELECTRIC], 89: [Element.WATER],
    90: [Element.WATER], 91: [Element.ELECTRIC], 92: [Element.ELECTRIC], 93: [Element.WATER],
    94: [Element.WIND], 95: [Element.WIND]
  };
  
  return elementMap[typeId] || [Element.WIND];
}

// Nombres de monstruos por type_id
function getNameForType(typeId: number): string {
  const nameMap: Record<number, string> = {
    1: "Aeronaut", 2: "Amperx", 3: "Aixer", 4: "Black Hole", 5: "Blackix",
    6: "Cinder", 7: "Coldrert", 8: "Coldruck", 9: "Comet", 10: "Cryomancer",
    11: "Culdrex", 12: "Darklack", 13: "Darklix", 14: "Dark Dragon", 15: "Diamond Nebula",
    16: "Droplet", 17: "Earth Dragon", 18: "Electric Dragon", 19: "Ember", 20: "Emberix",
    21: "Ertlix", 22: "Cosmo Dragon", 23: "Exrix Dark", 24: "Exrix Dark Evo", 25: "Exrix Dragon",
    26: "Exrix Dragon Evo", 27: "Exrix Earth", 28: "Exrix Earth Evo", 29: "Exrix Electric", 30: "Exrix Electric Evo",
    31: "Exrix Fire", 32: "Exrix Fire Evo", 33: "Exrix Ice", 34: "Exrix Ice Evo", 35: "Exrix Plant",
    36: "Exrix Plant Evo", 37: "Exrix Water", 38: "Exrix Water Evo", 39: "Exrix Wind", 40: "Exrix Wind Evo",
    41: "Filprex", 42: "Fire Dragon", 43: "Firexir", 44: "Flurry", 45: "Frostbite",
    46: "Galaxy Yellow", 47: "Galewind", 48: "Golemheart", 49: "Golix", 50: "Grixer",
    51: "Grixfox", 52: "Gust", 53: "Hydroknight", 54: "Ice Dragon", 55: "Icertrix",
    56: "Ice Shard", 57: "Jolt", 58: "Minidragon Aqua", 59: "Pure Dragon", 60: "Minidragon Dark",
    61: "Minidragon Earth", 62: "Minidragon Electric", 63: "Minidragon Fire", 64: "Minidragon Ice", 65: "Minidragon Plant",
    66: "Minidragon Wind", 67: "Mosslin", 68: "Nebula Blue", 69: "Nightprowler", 70: "Nova Violet",
    71: "Ohmspark", 72: "Orbit Sky", 73: "Pyravenger", 74: "Quakestone", 75: "Rockrin",
    76: "Scorch", 77: "Seedling", 78: "Shade", 79: "Shadix", 80: "Siexgaguar",
    81: "Skirx", 82: "Solar Orange", 83: "Sparkle", 84: "Sproutguard", 85: "Starlight Pink",
    86: "Stonefox", 87: "Sunflare", 88: "Tesliux", 89: "Torrent", 90: "Tsiux",
    91: "Voltfang", 92: "Voltrix", 93: "Watlix", 94: "Winderix", 95: "Zephir"
  };
  
  return nameMap[typeId] || `Jablix ${typeId}`;
}

// Stats exactos del contrato Sui Move
function getStatsForType(typeId: number): { hp: number; speed: number; attack: number; defense: number } {
  const statsMap: Record<number, [number, number, number, number, number]> = {
    1: [140, 105, 80, 110, 115], 2: [80, 110, 100, 115, 75], 3: [80, 75, 90, 85, 70],
    4: [100, 91, 70, 115, 105], 5: [80, 80, 75, 90, 80], 6: [95, 100, 75, 120, 75],
    7: [100, 112, 70, 90, 110], 8: [120, 126, 75, 105, 120], 9: [80, 80, 80, 80, 80],
    10: [115, 105, 80, 105, 115], 11: [90, 85, 75, 85, 95], 12: [120, 112, 70, 115, 130],
    13: [120, 140, 80, 135, 105], 14: [140, 110, 80, 115, 110], 15: [80, 80, 80, 80, 80],
    16: [85, 80, 70, 80, 85], 17: [210, 100, 75, 105, 135], 18: [130, 140, 120, 120, 100],
    19: [80, 90, 70, 105, 70], 20: [115, 110, 80, 125, 75], 21: [90, 70, 70, 75, 95],
    22: [170, 115, 120, 120, 120], 23: [90, 80, 75, 110, 90], 24: [100, 90, 80, 120, 80],
    25: [105, 65, 70, 105, 95], 26: [120, 75, 70, 110, 100], 27: [140, 80, 70, 95, 125],
    28: [130, 90, 75, 105, 115], 29: [80, 110, 100, 130, 70], 30: [90, 120, 110, 140, 75],
    31: [90, 100, 70, 130, 75], 32: [100, 110, 80, 140, 70], 33: [95, 85, 75, 100, 110],
    34: [105, 95, 80, 110, 105], 35: [110, 75, 75, 100, 110], 36: [120, 85, 80, 110, 100],
    37: [155, 110, 100, 105, 120], 38: [165, 120, 110, 115, 110], 39: [110, 80, 90, 110, 95],
    40: [120, 90, 100, 120, 90], 41: [85, 85, 70, 115, 80], 42: [140, 130, 90, 130, 95],
    43: [75, 85, 65, 100, 70], 44: [85, 80, 75, 80, 90], 45: [110, 90, 80, 90, 110],
    46: [100, 70, 70, 105, 105], 47: [80, 70, 75, 105, 75], 48: [130, 75, 70, 85, 125],
    49: [140, 90, 75, 100, 135], 50: [140, 119, 70, 115, 120], 51: [150, 119, 65, 105, 130],
    52: [80, 75, 90, 85, 70], 53: [115, 105, 100, 105, 115], 54: [145, 120, 80, 105, 120],
    55: [130, 105, 80, 105, 130], 56: [80, 70, 70, 100, 75], 57: [70, 90, 85, 95, 70],
    58: [200, 110, 75, 100, 130], 59: [250, 150, 100, 150, 150], 60: [140, 110, 80, 115, 110],
    61: [210, 100, 75, 105, 135], 62: [130, 140, 120, 120, 100], 63: [140, 130, 90, 130, 95],
    64: [145, 120, 80, 105, 120], 65: [200, 110, 75, 100, 130], 66: [160, 110, 120, 115, 105],
    67: [100, 75, 65, 85, 105], 68: [100, 70, 70, 100, 105], 69: [100, 80, 75, 120, 90],
    70: [105, 75, 70, 105, 105], 71: [90, 182, 115, 150, 65], 72: [115, 70, 75, 105, 100],
    73: [120, 105, 100, 130, 95], 74: [80, 70, 70, 105, 105], 75: [120, 98, 55, 90, 130],
    76: [130, 120, 85, 140, 80], 77: [85, 70, 65, 80, 90], 78: [80, 75, 75, 90, 80],
    79: [90, 85, 80, 110, 70], 80: [140, 133, 75, 115, 120], 81: [115, 140, 120, 125, 90],
    82: [100, 70, 70, 105, 105], 83: [75, 95, 90, 100, 70], 84: [120, 112, 70, 100, 110],
    85: [105, 75, 70, 105, 105], 86: [115, 98, 60, 90, 125], 87: [80, 70, 70, 105, 105],
    88: [85, 115, 110, 120, 75], 89: [110, 90, 80, 90, 105], 90: [130, 105, 90, 105, 125],
    91: [85, 130, 100, 115, 75], 92: [100, 182, 120, 145, 70], 93: [85, 80, 70, 80, 85],
    94: [115, 90, 120, 105, 85], 95: [90, 75, 95, 90, 75]
  };
  
  const stats = statsMap[typeId] || [100, 80, 70, 80, 80];
  return {
    hp: stats[0],
    attack: stats[1],
    defense: stats[2],
    speed: stats[3]
  };
}

// Generar cartas basadas en elementos
function getCardIdsForElements(elements: Element[]): string[] {
  const elementCards: Record<Element, string[]> = {
    [Element.FIRE]: ['fireball', 'flame_shield', 'power_strike'],
    [Element.WATER]: ['water_blast', 'healing_wave', 'power_strike'],
    [Element.PLANT]: ['vine_whip', 'photosynthesis', 'power_strike'],
    [Element.ICE]: ['ice_blast', 'ice_shield', 'icy_wind', 'ice_punch'],
    [Element.ELECTRIC]: ['thunder_bolt', 'static_shield', 'power_strike'],
    [Element.EARTH]: ['rock_smash', 'stone_wall', 'power_strike'],
    [Element.WIND]: ['wind_slice', 'air_dodge', 'power_strike'],
    [Element.DRAGON]: ['dragon_rage', 'dragon_scales', 'power_strike'],
    [Element.DARK]: ['shadow_strike', 'dark_veil', 'power_strike'],
    [Element.COSMIC]: ['quasar_blast', 'pulsar_beam', 'stellar_flare', 'nebula_heal'],
    [Element.EXRIX]: ['power_strike', 'exrix_blast', 'exrix_shield']
  };
  
  const cards: string[] = [];
  for (const element of elements) {
    cards.push(...elementCards[element].slice(0, 2));
  }
  
  return [...new Set(cards)].slice(0, 4);
}

// Database of 95 Jabs
export const JABLIX_TEMPLATES: JablixTemplate[] = Array.from({ length: 95 }, (_: unknown, index: number) => {
  const typeId = index + 1;
  const elements = getElementsForType(typeId);
  const stats = getStatsForType(typeId);
  
  return {
    id: typeId,
    name: getNameForType(typeId),
    elements,
    imageUrl: METADATA_URLS[index],
    hp: stats.hp,
    speed: stats.speed,
    baseAttack: stats.attack,
    baseDefense: stats.defense,
    cardIds: getCardIdsForElements(elements)
  };
});

export function createJablix(template: JablixTemplate): Jablix {
  return {
    id: `jablix_${template.id}`,
    name: template.name,
    elements: template.elements,
    imageUrl: template.imageUrl,
    hp: template.hp,
    maxHp: template.hp,
    speed: template.speed,
    baseAttack: template.baseAttack,
    baseDefense: template.baseDefense,
    energy: 3,
    maxEnergy: 3,
    cards: template.cardIds.map((cardId: string) => CARD_DATABASE[cardId] || CARD_DATABASE['power_strike']),
    currentAttackBuff: 0,
    currentDefenseBuff: 0,
    shield: 0,
    isStunned: false,
    statusEffects: []
  };
}

export function getJablixById(id: number): Jablix {
  const template = JABLIX_TEMPLATES.find((t: JablixTemplate) => t.id === id);
  if (!template) {
    throw new Error(`Jablix with id ${id} not found`);
  }
  return createJablix(template);
}

export function createRandomTeam(count: number = 3): Jablix[] {
  const team: Jablix[] = [];
  const usedIds = new Set<number>();
  
  while (team.length < count) {
    const randomId = Math.floor(Math.random() * 95) + 1;
    if (!usedIds.has(randomId)) {
      usedIds.add(randomId);
      team.push(getJablixById(randomId));
    }
  }
  
  return team;
}

export function getAllJabs(): Jablix[] {
  return JABLIX_TEMPLATES.map((template: JablixTemplate) => createJablix(template));
}
