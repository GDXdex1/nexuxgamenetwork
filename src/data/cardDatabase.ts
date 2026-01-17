// src/data/cardDatabase.ts

import type { Card } from '@/types/game.types';
import { Element, CardEffectType, TargetType } from '@/types/game.types';

export const CARD_DATABASE: Record<string, Card> = {
  // ===== CARTAS DE FUEGO =====
  fireball: {
    id: 'fireball',
    name: 'Bola de Fuego',
    element: Element.FIRE,
    energyCost: 1,
    attack: 30,
    defense: 0,
    effects: [
      {
        type: CardEffectType.DAMAGE,
        value: 30,
        target: TargetType.SINGLE_ENEMY
      }
    ],
    description: 'Lanza una bola de fuego'
  },
  
  flame_shield: {
    id: 'flame_shield',
    name: 'Escudo de Llamas',
    element: Element.FIRE,
    energyCost: 1,
    attack: 0,
    defense: 20,
    effects: [
      {
        type: CardEffectType.SHIELD,
        value: 20,
        target: TargetType.SELF
      }
    ],
    description: 'Escudo de fuego'
  },
  
  inferno: {
    id: 'inferno',
    name: 'Infierno',
    element: Element.FIRE,
    energyCost: 2,
    attack: 45,
    defense: 0,
    effects: [
      {
        type: CardEffectType.DAMAGE,
        value: 45,
        target: TargetType.ALL_ENEMIES
      }
    ],
    description: 'Quema a todos los enemigos'
  },
  
  // ===== CARTAS DE AGUA =====
  water_blast: {
    id: 'water_blast',
    name: 'Chorro de Agua',
    element: Element.WATER,
    energyCost: 1,
    attack: 25,
    defense: 0,
    effects: [
      {
        type: CardEffectType.DAMAGE,
        value: 25,
        target: TargetType.SINGLE_ENEMY
      }
    ],
    description: 'Dispara un chorro potente'
  },
  
  healing_wave: {
    id: 'healing_wave',
    name: 'Onda Curativa',
    element: Element.WATER,
    energyCost: 1,
    attack: 0,
    defense: 30,
    effects: [
      {
        type: CardEffectType.HEAL,
        value: 30,
        target: TargetType.SELF
      }
    ],
    description: 'Cura 30 HP'
  },
  
  tidal_wave: {
    id: 'tidal_wave',
    name: 'Ola Gigante',
    element: Element.WATER,
    energyCost: 2,
    attack: 20,
    defense: 15,
    effects: [
      {
        type: CardEffectType.DAMAGE,
        value: 20,
        target: TargetType.ALL_ENEMIES
      },
      {
        type: CardEffectType.DEBUFF_ATTACK,
        value: 10,
        target: TargetType.ALL_ENEMIES,
        duration: 2
      }
    ],
    description: 'Ola que reduce ataque'
  },
  
  // ===== CARTAS DE PLANTA =====
  vine_whip: {
    id: 'vine_whip',
    name: 'Látigo de Enredadera',
    element: Element.PLANT,
    energyCost: 1,
    attack: 28,
    defense: 0,
    effects: [
      {
        type: CardEffectType.DAMAGE,
        value: 28,
        target: TargetType.SINGLE_ENEMY
      }
    ],
    description: 'Azota con enredaderas'
  },
  
  photosynthesis: {
    id: 'photosynthesis',
    name: 'Fotosíntesis',
    element: Element.PLANT,
    energyCost: 1,
    attack: 0,
    defense: 25,
    effects: [
      {
        type: CardEffectType.HEAL,
        value: 25,
        target: TargetType.SELF
      },
      {
        type: CardEffectType.BUFF_DEFENSE,
        value: 5,
        target: TargetType.SELF,
        duration: 2
      }
    ],
    description: 'Cura y sube defensa'
  },
  
  poison_spore: {
    id: 'poison_spore',
    name: 'Espora Venenosa',
    element: Element.PLANT,
    energyCost: 2,
    attack: 35,
    defense: 0,
    effects: [
      {
        type: CardEffectType.DAMAGE,
        value: 35,
        target: TargetType.SINGLE_ENEMY
      },
      {
        type: CardEffectType.DEBUFF_DEFENSE,
        value: 15,
        target: TargetType.SINGLE_ENEMY,
        duration: 3
      }
    ],
    description: 'Veneno que debilita'
  },
  
  // ===== CARTAS DE HIELO =====
  ice_blast: {
    id: 'ice_blast',
    name: 'Ráfaga Helada',
    element: Element.ICE,
    energyCost: 1,
    attack: 26,
    defense: 0,
    effects: [
      {
        type: CardEffectType.DAMAGE,
        value: 26,
        target: TargetType.SINGLE_ENEMY
      }
    ],
    description: 'Ataque de hielo'
  },
  
  ice_shield: {
    id: 'ice_shield',
    name: 'Barrera de Hielo',
    element: Element.ICE,
    energyCost: 1,
    attack: 0,
    defense: 25,
    effects: [
      {
        type: CardEffectType.SHIELD,
        value: 25,
        target: TargetType.SELF
      }
    ],
    description: 'Escudo gélido'
  },
  
  // ===== CARTAS ELÉCTRICAS =====
  thunder_bolt: {
    id: 'thunder_bolt',
    name: 'Rayo',
    element: Element.ELECTRIC,
    energyCost: 1,
    attack: 32,
    defense: 0,
    effects: [
      {
        type: CardEffectType.DAMAGE,
        value: 32,
        target: TargetType.SINGLE_ENEMY
      }
    ],
    description: 'Rayo poderoso'
  },
  
  static_shield: {
    id: 'static_shield',
    name: 'Campo Estático',
    element: Element.ELECTRIC,
    energyCost: 1,
    attack: 0,
    defense: 18,
    effects: [
      {
        type: CardEffectType.SHIELD,
        value: 18,
        target: TargetType.SELF
      }
    ],
    description: 'Escudo eléctrico'
  },
  
  // ===== CARTAS DE TIERRA =====
  rock_smash: {
    id: 'rock_smash',
    name: 'Golpe de Roca',
    element: Element.EARTH,
    energyCost: 1,
    attack: 24,
    defense: 0,
    effects: [
      {
        type: CardEffectType.DAMAGE,
        value: 24,
        target: TargetType.SINGLE_ENEMY
      }
    ],
    description: 'Golpe sólido'
  },
  
  stone_wall: {
    id: 'stone_wall',
    name: 'Muro de Piedra',
    element: Element.EARTH,
    energyCost: 1,
    attack: 0,
    defense: 30,
    effects: [
      {
        type: CardEffectType.SHIELD,
        value: 30,
        target: TargetType.SELF
      }
    ],
    description: 'Defensa de roca'
  },
  
  // ===== CARTAS DE VIENTO =====
  wind_slice: {
    id: 'wind_slice',
    name: 'Cuchilla de Viento',
    element: Element.WIND,
    energyCost: 1,
    attack: 29,
    defense: 0,
    effects: [
      {
        type: CardEffectType.DAMAGE,
        value: 29,
        target: TargetType.SINGLE_ENEMY
      }
    ],
    description: 'Corte veloz'
  },
  
  air_dodge: {
    id: 'air_dodge',
    name: 'Evasión Aérea',
    element: Element.WIND,
    energyCost: 1,
    attack: 0,
    defense: 15,
    effects: [
      {
        type: CardEffectType.BUFF_DEFENSE,
        value: 10,
        target: TargetType.SELF,
        duration: 2
      }
    ],
    description: 'Sube evasión'
  },
  
  // ===== CARTAS DE DRAGÓN =====
  dragon_rage: {
    id: 'dragon_rage',
    name: 'Furia de Dragón',
    element: Element.DRAGON,
    energyCost: 2,
    attack: 40,
    defense: 0,
    effects: [
      {
        type: CardEffectType.DAMAGE,
        value: 40,
        target: TargetType.SINGLE_ENEMY
      }
    ],
    description: 'Poder del dragón'
  },
  
  dragon_scales: {
    id: 'dragon_scales',
    name: 'Escamas de Dragón',
    element: Element.DRAGON,
    energyCost: 1,
    attack: 0,
    defense: 28,
    effects: [
      {
        type: CardEffectType.SHIELD,
        value: 28,
        target: TargetType.SELF
      }
    ],
    description: 'Escudo dracónico'
  },
  
  // ===== CARTAS OSCURAS =====
  shadow_strike: {
    id: 'shadow_strike',
    name: 'Golpe Sombrío',
    element: Element.DARK,
    energyCost: 1,
    attack: 31,
    defense: 0,
    effects: [
      {
        type: CardEffectType.DAMAGE,
        value: 31,
        target: TargetType.SINGLE_ENEMY
      }
    ],
    description: 'Ataque de sombras'
  },
  
  dark_veil: {
    id: 'dark_veil',
    name: 'Velo Oscuro',
    element: Element.DARK,
    energyCost: 1,
    attack: 0,
    defense: 22,
    effects: [
      {
        type: CardEffectType.SHIELD,
        value: 22,
        target: TargetType.SELF
      }
    ],
    description: 'Protección oscura'
  },
  
  // ===== CARTAS CÓSMICAS =====
  quasar_blast: {
    id: 'quasar_blast',
    name: 'Quasar Blast',
    element: Element.COSMIC,
    energyCost: 22,
    attack: 45,
    defense: 0,
    effects: [
      {
        type: CardEffectType.DAMAGE,
        value: 45,
        target: TargetType.SINGLE_ENEMY
      }
    ],
    description: '45 damage.'
  },
  
  singularity_shield: {
    id: 'singularity_shield',
    name: 'Singularity Shield',
    element: Element.COSMIC,
    energyCost: 25,
    attack: 0,
    defense: 0,
    effects: [
      {
        type: CardEffectType.BUFF_ATTACK,
        value: 20,
        target: TargetType.SELF,
        duration: 3
      }
    ],
    description: '+20 attack.'
  },
  
  void_miasma: {
    id: 'void_miasma',
    name: 'Void Miasma',
    element: Element.COSMIC,
    energyCost: 30,
    attack: 20,
    defense: 0,
    effects: [
      {
        type: CardEffectType.DAMAGE,
        value: 20,
        target: TargetType.SINGLE_ENEMY
      },
      {
        type: CardEffectType.DEBUFF_ATTACK,
        value: 10,
        target: TargetType.ALL_ENEMIES,
        duration: 2
      }
    ],
    description: '20 damage, -10 atk enemies.'
  },
  
  pulsar_beam: {
    id: 'pulsar_beam',
    name: 'Pulsar Beam',
    element: Element.COSMIC,
    energyCost: 21,
    attack: 35,
    defense: 0,
    effects: [
      {
        type: CardEffectType.DAMAGE,
        value: 35,
        target: TargetType.SINGLE_ENEMY
      }
    ],
    description: '35 damage.'
  },
  
  comet_tail: {
    id: 'comet_tail',
    name: 'Comet Tail',
    element: Element.COSMIC,
    energyCost: 23,
    attack: 38,
    defense: 0,
    effects: [
      {
        type: CardEffectType.DAMAGE,
        value: 38,
        target: TargetType.SINGLE_ENEMY
      }
    ],
    description: '38 damage.'
  },
  
  meteor_strike: {
    id: 'meteor_strike',
    name: 'Meteor Strike',
    element: Element.COSMIC,
    energyCost: 26,
    attack: 42,
    defense: 0,
    effects: [
      {
        type: CardEffectType.DAMAGE,
        value: 42,
        target: TargetType.SINGLE_ENEMY
      }
    ],
    description: '42 damage.'
  },
  
  supernova: {
    id: 'supernova',
    name: 'Supernova',
    element: Element.COSMIC,
    energyCost: 28,
    attack: 50,
    defense: 0,
    effects: [
      {
        type: CardEffectType.DAMAGE,
        value: 50,
        target: TargetType.SINGLE_ENEMY
      },
      {
        type: CardEffectType.DAMAGE,
        value: 10,
        target: TargetType.SELF
      }
    ],
    description: '50 damage, 10 recoil.'
  },
  
  cosmic_siphon: {
    id: 'cosmic_siphon',
    name: 'Cosmic Siphon',
    element: Element.COSMIC,
    energyCost: 22,
    attack: 20,
    defense: 0,
    effects: [
      {
        type: CardEffectType.DAMAGE,
        value: 20,
        target: TargetType.SINGLE_ENEMY
      }
    ],
    description: '20 damage, steal 15 energy.'
  },
  
  entropy: {
    id: 'entropy',
    name: 'Entropy',
    element: Element.COSMIC,
    energyCost: 20,
    attack: 0,
    defense: 0,
    effects: [
      {
        type: CardEffectType.BUFF_ATTACK,
        value: 15,
        target: TargetType.SELF,
        duration: 2
      }
    ],
    description: '+15 attack +10 velocity.'
  },
  
  black_hole_pull: {
    id: 'black_hole_pull',
    name: 'Black Hole Pull',
    element: Element.COSMIC,
    energyCost: 30,
    attack: 0,
    defense: 0,
    effects: [
      {
        type: CardEffectType.BUFF_ATTACK,
        value: 20,
        target: TargetType.SELF,
        duration: 3
      }
    ],
    description: 'Pulls enemies, +20 attack.'
  },
  
  // ===== CARTAS DE HIELO (ICE) - COMPLETAS =====
  icy_wind: {
    id: 'icy_wind',
    name: 'Icy Wind',
    element: Element.ICE,
    energyCost: 20,
    attack: 0,
    defense: 0,
    effects: [
      {
        type: CardEffectType.HEAL,
        value: 40,
        target: TargetType.SELF
      }
    ],
    description: 'Increases 40 energy'
  },

  ice_mantle: {
    id: 'ice_mantle',
    name: 'Ice Mantle',
    element: Element.ICE,
    energyCost: 25,
    attack: 0,
    defense: 0,
    effects: [
      {
        type: CardEffectType.HEAL,
        value: 45,
        target: TargetType.SELF
      }
    ],
    description: 'Restores 45 HP'
  },

  cryogenic_ray: {
    id: 'cryogenic_ray',
    name: 'Cryogenic Ray',
    element: Element.ICE,
    energyCost: 22,
    attack: 35,
    defense: 0,
    effects: [
      {
        type: CardEffectType.DAMAGE,
        value: 35,
        target: TargetType.SINGLE_ENEMY
      }
    ],
    description: 'Cryogenic Ray - 35 damage'
  },

  frozen_terrain: {
    id: 'frozen_terrain',
    name: 'Frozen Terrain',
    element: Element.ICE,
    energyCost: 25,
    attack: 0,
    defense: 0,
    effects: [
      {
        type: CardEffectType.DEBUFF_DEFENSE,
        value: 15,
        target: TargetType.ALL_ENEMIES,
        duration: 2
      }
    ],
    description: 'Frozen Terrain - reduces enemy defense'
  },

  avalanche: {
    id: 'avalanche',
    name: 'Avalanche',
    element: Element.ICE,
    energyCost: 30,
    attack: 45,
    defense: 0,
    effects: [
      {
        type: CardEffectType.DAMAGE,
        value: 45,
        target: TargetType.SINGLE_ENEMY
      }
    ],
    description: 'Avalanche - 45 damage'
  },

  ice_punch: {
    id: 'ice_punch',
    name: 'Ice Punch',
    element: Element.ICE,
    energyCost: 22,
    attack: 35,
    defense: 0,
    effects: [
      {
        type: CardEffectType.DAMAGE,
        value: 35,
        target: TargetType.SINGLE_ENEMY
      }
    ],
    description: '35 damage to the first enemy'
  },

  ice_shard: {
    id: 'ice_shard',
    name: 'Ice Shard',
    element: Element.ICE,
    energyCost: 24,
    attack: 38,
    defense: 0,
    effects: [
      {
        type: CardEffectType.DAMAGE,
        value: 38,
        target: TargetType.SINGLE_ENEMY
      }
    ],
    description: '38 damage to the first enemy'
  },

  minor_avalanche: {
    id: 'minor_avalanche',
    name: 'Minor Avalanche',
    element: Element.ICE,
    energyCost: 27,
    attack: 43,
    defense: 0,
    effects: [
      {
        type: CardEffectType.DAMAGE,
        value: 43,
        target: TargetType.SINGLE_ENEMY
      }
    ],
    description: 'Minor Avalanche - 43 damage'
  },

  chilling_impact: {
    id: 'chilling_impact',
    name: 'Chilling Impact',
    element: Element.ICE,
    energyCost: 21,
    attack: 34,
    defense: 0,
    effects: [
      {
        type: CardEffectType.DAMAGE,
        value: 34,
        target: TargetType.SINGLE_ENEMY
      }
    ],
    description: 'Chilling Impact - 34 damage'
  },

  frozen_field: {
    id: 'frozen_field',
    name: 'Frozen Field',
    element: Element.ICE,
    energyCost: 25,
    attack: 0,
    defense: 0,
    effects: [
      {
        type: CardEffectType.DEBUFF_ATTACK,
        value: 10,
        target: TargetType.ALL_ENEMIES,
        duration: 2
      }
    ],
    description: 'Frozen Field - reduces enemy attack'
  },

  frost_siphon: {
    id: 'frost_siphon',
    name: 'Frost Siphon',
    element: Element.ICE,
    energyCost: 23,
    attack: 20,
    defense: 0,
    effects: [
      {
        type: CardEffectType.DAMAGE_WITH_HEAL,
        value: 20,
        target: TargetType.SINGLE_ENEMY
      },
      {
        type: CardEffectType.HEAL,
        value: 15,
        target: TargetType.SELF
      }
    ],
    description: 'Frost Siphon - 20 damage, heal 15 HP'
  },

  crystalline_carapace: {
    id: 'crystalline_carapace',
    name: 'Crystalline Carapace',
    element: Element.ICE,
    energyCost: 20,
    attack: 0,
    defense: 0,
    effects: [
      {
        type: CardEffectType.SHIELD,
        value: 30,
        target: TargetType.SELF
      }
    ],
    description: 'Crystalline Carapace - shield 30'
  },

  // ===== CARTAS CÓSMICAS (COSMIC) - COMPLETAS =====
  stellar_flare: {
    id: 'stellar_flare',
    name: 'Stellar Flare',
    element: Element.COSMIC,
    energyCost: 20,
    attack: 0,
    defense: 0,
    effects: [
      {
        type: CardEffectType.HEAL,
        value: 40,
        target: TargetType.SELF
      }
    ],
    description: 'Increases 40 energy'
  },

  nebula_heal: {
    id: 'nebula_heal',
    name: 'Nebula Heal',
    element: Element.COSMIC,
    energyCost: 25,
    attack: 0,
    defense: 0,
    effects: [
      {
        type: CardEffectType.HEAL,
        value: 50,
        target: TargetType.SELF
      }
    ],
    description: 'Restores 50 HP'
  },

  // ===== CARTA NEUTRAL =====
  power_strike: {
    id: 'power_strike',
    name: 'Golpe Poderoso',
    element: Element.WIND,
    energyCost: 1,
    attack: 27,
    defense: 0,
    effects: [
      {
        type: CardEffectType.DAMAGE,
        value: 27,
        target: TargetType.SINGLE_ENEMY
      }
    ],
    description: 'Ataque básico'
  },

  // Placeholder for exrix cards
  exrix_blast: {
    id: 'exrix_blast',
    name: 'Exrix Blast',
    element: Element.EXRIX,
    energyCost: 2,
    attack: 35,
    defense: 0,
    effects: [
      {
        type: CardEffectType.DAMAGE,
        value: 35,
        target: TargetType.SINGLE_ENEMY
      }
    ],
    description: 'Exrix power blast'
  },

  exrix_shield: {
    id: 'exrix_shield',
    name: 'Exrix Shield',
    element: Element.EXRIX,
    energyCost: 1,
    attack: 0,
    defense: 25,
    effects: [
      {
        type: CardEffectType.SHIELD,
        value: 25,
        target: TargetType.SELF
      }
    ],
    description: 'Exrix protective barrier'
  }
};
