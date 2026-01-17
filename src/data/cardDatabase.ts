// src/data/cardDatabase.ts

import type { Card } from '@/types/game.types';
import { Element, CardEffectType, TargetType } from '@/types/game.types';

export const CARD_DATABASE: Record<string, Card> = {
  // ===== PLANT CARDS =====
  photosynthesis_vital: {
    id: 'photosynthesis_vital',
    name: 'Photosynthesis Vital',
    element: Element.PLANT,
    energyCost: 20,
    attack: 0,
    defense: 0,
    effects: [{ type: CardEffectType.BUFF_ENERGY, value: 40, target: TargetType.SELF }],
    description: 'Increases 40 energy.'
  },
  pollen_pulse: {
    id: 'pollen_pulse',
    name: 'Pollen Pulse',
    element: Element.PLANT,
    energyCost: 25,
    attack: 0,
    defense: 0,
    effects: [{ type: CardEffectType.HEAL, value: 60, target: TargetType.SELF }],
    description: 'Restores 60 HP.'
  },
  thorned_vector: {
    id: 'thorned_vector',
    name: 'Thorned Vector',
    element: Element.PLANT,
    energyCost: 22,
    attack: 35,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 35, target: TargetType.SINGLE_ENEMY }],
    description: '35 damage to the first enemy.'
  },
  bark_armor: {
    id: 'bark_armor',
    name: 'Bark Armor',
    element: Element.PLANT,
    energyCost: 25,
    attack: 0,
    defense: 25,
    effects: [{ type: CardEffectType.SHIELD, value: 25, target: TargetType.SELF }],
    description: '+25 defense to the user.'
  },
  sleep_spores: {
    id: 'sleep_spores',
    name: 'Sleep Spores',
    element: Element.PLANT,
    energyCost: 30,
    attack: 15,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 15, target: TargetType.ALL_ENEMIES }],
    description: '15 damage to all three enemies.'
  },
  root_strike: {
    id: 'root_strike',
    name: 'Root Strike',
    element: Element.PLANT,
    energyCost: 20,
    attack: 32,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 32, target: TargetType.SINGLE_ENEMY }],
    description: '32 damage to the first enemy.'
  },
  sharp_leaf: {
    id: 'sharp_leaf',
    name: 'Sharp Leaf',
    element: Element.PLANT,
    energyCost: 22,
    attack: 35,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 35, target: TargetType.SINGLE_ENEMY }],
    description: '35 damage to the first enemy.'
  },
  sap_impact: {
    id: 'sap_impact',
    name: 'Sap Impact',
    element: Element.PLANT,
    energyCost: 24,
    attack: 38,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 38, target: TargetType.SINGLE_ENEMY }],
    description: '38 damage to the first enemy.'
  },
  trunk_mace: {
    id: 'trunk_mace',
    name: 'Trunk Mace',
    element: Element.PLANT,
    energyCost: 26,
    attack: 42,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 42, target: TargetType.SINGLE_ENEMY }],
    description: '42 damage to the first enemy.'
  },
  pollen_rain: {
    id: 'pollen_rain',
    name: 'Pollen Rain',
    element: Element.PLANT,
    energyCost: 25,
    attack: 0,
    defense: 0,
    effects: [{ type: CardEffectType.HEAL, value: 20, target: TargetType.ALL_ALLIES }],
    description: 'Heals 20 HP to the entire team.'
  },
  vitality_drain: {
    id: 'vitality_drain',
    name: 'Vitality Drain',
    element: Element.PLANT,
    energyCost: 23,
    attack: 20,
    defense: 0,
    effects: [
      { type: CardEffectType.DAMAGE, value: 20, target: TargetType.SINGLE_ENEMY },
      { type: CardEffectType.HEAL, value: 10, target: TargetType.SELF }
    ],
    description: '20 damage to the second enemy. Steal 10 HP.'
  },
  photosynthesis_burst: {
    id: 'photosynthesis_burst',
    name: 'Photosynthesis Burst',
    element: Element.PLANT,
    energyCost: 20,
    attack: 0,
    defense: 0,
    effects: [{ type: CardEffectType.BUFF_SPEED, value: 15, target: TargetType.SELF }],
    description: '+15 velocity to the user.'
  },

  // ===== EARTH CARDS =====
  telluric_resonance: {
    id: 'telluric_resonance',
    name: 'Telluric Resonance',
    element: Element.EARTH,
    energyCost: 20,
    attack: 0,
    defense: 0,
    effects: [{ type: CardEffectType.BUFF_ENERGY, value: 40, target: TargetType.SELF }],
    description: 'Increases 40 energy.'
  },
  rock_spring: {
    id: 'rock_spring',
    name: 'Rock Spring',
    element: Element.EARTH,
    energyCost: 25,
    attack: 0,
    defense: 0,
    effects: [{ type: CardEffectType.HEAL, value: 60, target: TargetType.SELF }],
    description: 'Restores 60 HP.'
  },
  seismic_pulse: {
    id: 'seismic_pulse',
    name: 'Seismic Pulse',
    element: Element.EARTH,
    energyCost: 30,
    attack: 25,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 25, target: TargetType.ALL_ENEMIES }],
    description: '25 damage to all three enemies.'
  },
  stone_wall: {
    id: 'stone_wall',
    name: 'Stone Wall',
    element: Element.EARTH,
    energyCost: 25,
    attack: 0,
    defense: 35,
    effects: [{ type: CardEffectType.SHIELD, value: 35, target: TargetType.SELF }],
    description: '+35 defense to the user.'
  },
  diamond_skin: {
    id: 'diamond_skin',
    name: 'Diamond Skin',
    element: Element.EARTH,
    energyCost: 35,
    attack: 0,
    defense: 15,
    effects: [
      { type: CardEffectType.SHIELD, value: 15, target: TargetType.SELF },
      { type: CardEffectType.BUFF_ATTACK, value: 15, target: TargetType.SELF }
    ],
    description: '+15 defense and +15 attack to the user.'
  },
  silicate_impact: {
    id: 'silicate_impact',
    name: 'Silicate Impact',
    element: Element.EARTH,
    energyCost: 22,
    attack: 36,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 36, target: TargetType.SINGLE_ENEMY }],
    description: '36 damage to the first enemy.'
  },
  lithic_projectile: {
    id: 'lithic_projectile',
    name: 'Lithic Projectile',
    element: Element.EARTH,
    energyCost: 24,
    attack: 35,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 35, target: TargetType.SINGLE_ENEMY }],
    description: '35 damage to the first enemy.'
  },
  stampede: {
    id: 'stampede',
    name: 'Stampede',
    element: Element.EARTH,
    energyCost: 28,
    attack: 40,
    defense: 0,
    effects: [
      { type: CardEffectType.DAMAGE, value: 40, target: TargetType.SINGLE_ENEMY },
      { type: CardEffectType.BUFF_SPEED, value: 5, target: TargetType.SELF }
    ],
    description: '40 damage to the first enemy + 5 velocity.'
  },
  seismic_impact: {
    id: 'seismic_impact',
    name: 'Seismic Impact',
    element: Element.EARTH,
    energyCost: 25,
    attack: 40,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 40, target: TargetType.SINGLE_ENEMY }],
    description: '40 damage to the first enemy.'
  },
  shared_fortress: {
    id: 'shared_fortress',
    name: 'Shared Fortress',
    element: Element.EARTH,
    energyCost: 25,
    attack: 0,
    defense: 0,
    effects: [{ type: CardEffectType.BUFF_DEFENSE, value: 15, target: TargetType.ALL_ALLIES }],
    description: 'Increases the whole team\'s defense by 15.'
  },
  tremor_tap: {
    id: 'tremor_tap',
    name: 'Tremor Tap',
    element: Element.EARTH,
    energyCost: 24,
    attack: 20,
    defense: 10,
    effects: [
      { type: CardEffectType.DAMAGE, value: 20, target: TargetType.SINGLE_ENEMY },
      { type: CardEffectType.SHIELD, value: 10, target: TargetType.SELF }
    ],
    description: '20 damage to the second enemy. +10 defense to the user.'
  },
  earthen_resilience: {
    id: 'earthen_resilience',
    name: 'Earthen Resilience',
    element: Element.EARTH,
    energyCost: 20,
    attack: 0,
    defense: 15,
    effects: [
      { type: CardEffectType.SHIELD, value: 15, target: TargetType.SELF },
      { type: CardEffectType.HEAL, value: 10, target: TargetType.SELF }
    ],
    description: '+15 defense to the user. +10 HP to the user.'
  },

  // ===== ELECTRIC CARDS =====
  electric_overcharge: {
    id: 'electric_overcharge',
    name: 'Electric Overcharge',
    element: Element.ELECTRIC,
    energyCost: 20,
    attack: 0,
    defense: 0,
    effects: [{ type: CardEffectType.BUFF_ENERGY, value: 50, target: TargetType.SELF }],
    description: 'Increases 50 energy.'
  },
  force_field: {
    id: 'force_field',
    name: 'Force Field',
    element: Element.ELECTRIC,
    energyCost: 25,
    attack: 0,
    defense: 0,
    effects: [{ type: CardEffectType.HEAL, value: 40, target: TargetType.SELF }],
    description: 'Restores 40 HP.'
  },
  arc_discharge: {
    id: 'arc_discharge',
    name: 'Arc Discharge',
    element: Element.ELECTRIC,
    energyCost: 22,
    attack: 45,
    defense: 0,
    effects: [
      { type: CardEffectType.DAMAGE, value: 45, target: TargetType.SINGLE_ENEMY },
      { type: CardEffectType.BUFF_ENERGY, value: 5, target: TargetType.SELF }
    ],
    description: '45 damage. +5 energy.'
  },
  speed_of_light: {
    id: 'speed_of_light',
    name: 'Speed of Light',
    element: Element.ELECTRIC,
    energyCost: 20,
    attack: 0,
    defense: 0,
    effects: [
      { type: CardEffectType.BUFF_ENERGY, value: 35, target: TargetType.SELF },
      { type: CardEffectType.BUFF_SPEED, value: 10, target: TargetType.SELF }
    ],
    description: '+35 energy + 10 velocity.'
  },
  ion_storm: {
    id: 'ion_storm',
    name: 'Ion Storm',
    element: Element.ELECTRIC,
    energyCost: 30,
    attack: 45,
    defense: 0,
    effects: [
      { type: CardEffectType.DAMAGE, value: 45, target: TargetType.SINGLE_ENEMY },
      { type: CardEffectType.BUFF_ATTACK, value: 15, target: TargetType.SELF }
    ],
    description: '45 damage + 15 attack to the user.'
  },
  electric_shock: {
    id: 'electric_shock',
    name: 'Electric Shock',
    element: Element.ELECTRIC,
    energyCost: 21,
    attack: 34,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 34, target: TargetType.SINGLE_ENEMY }],
    description: '34 damage to the first enemy.'
  },
  thunder_ball: {
    id: 'thunder_ball',
    name: 'Thunder Ball',
    element: Element.ELECTRIC,
    energyCost: 23,
    attack: 37,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 37, target: TargetType.SINGLE_ENEMY }],
    description: '37 damage to the first enemy.'
  },
  spark_zap: {
    id: 'spark_zap',
    name: 'Spark Zap',
    element: Element.ELECTRIC,
    energyCost: 18,
    attack: 30,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 30, target: TargetType.SINGLE_ENEMY }],
    description: '30 damage to the first enemy.'
  },
  direct_discharge: {
    id: 'direct_discharge',
    name: 'Direct Discharge',
    element: Element.ELECTRIC,
    energyCost: 26,
    attack: 42,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 42, target: TargetType.SINGLE_ENEMY }],
    description: '42 damage to the first enemy.'
  },
  collective_overcharge: {
    id: 'collective_overcharge',
    name: 'Collective Overcharge',
    element: Element.ELECTRIC,
    energyCost: 25,
    attack: 0,
    defense: 0,
    effects: [{ type: CardEffectType.BUFF_SPEED, value: 10, target: TargetType.ALL_ALLIES }],
    description: 'Increases the whole team\'s speed by 10.'
  },
  energy_siphon: {
    id: 'energy_siphon',
    name: 'Energy Siphon',
    element: Element.ELECTRIC,
    energyCost: 22,
    attack: 20,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 20, target: TargetType.SINGLE_ENEMY }],
    description: '20 damage to the third enemy. Steal 10 energy.'
  },
  reactor_overload: {
    id: 'reactor_overload',
    name: 'Reactor Overload',
    element: Element.ELECTRIC,
    energyCost: 20,
    attack: 0,
    defense: 0,
    effects: [
      { type: CardEffectType.BUFF_SPEED, value: 15, target: TargetType.SELF },
      { type: CardEffectType.BUFF_ENERGY, value: 5, target: TargetType.ALL_ALLIES }
    ],
    description: '+15 velocity to user. +5 energy to team.'
  },

  // ===== DARK CARDS =====
  life_drain: {
    id: 'life_drain',
    name: 'Life Drain',
    element: Element.DARK,
    energyCost: 22,
    attack: 0,
    defense: 0,
    effects: [
      { type: CardEffectType.BUFF_ENERGY, value: 45, target: TargetType.SELF },
      { type: CardEffectType.DEBUFF_ENERGY, value: 10, target: TargetType.ALL_ENEMIES }
    ],
    description: '+45 energy to user, -10 energy to enemies.'
  },
  dark_pact: {
    id: 'dark_pact',
    name: 'Dark Pact',
    element: Element.DARK,
    energyCost: 25,
    attack: 0,
    defense: 0,
    effects: [{ type: CardEffectType.HEAL, value: 40, target: TargetType.SELF }],
    description: 'Restores 40 HP.'
  },
  umbral_talon: {
    id: 'umbral_talon',
    name: 'Umbral Talon',
    element: Element.DARK,
    energyCost: 22,
    attack: 35,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 35, target: TargetType.SINGLE_ENEMY }],
    description: '35 damage to the first enemy.'
  },
  cloak_of_invisibility: {
    id: 'cloak_of_invisibility',
    name: 'Cloak of Invisibility',
    element: Element.DARK,
    energyCost: 25,
    attack: 0,
    defense: 0,
    effects: [{ type: CardEffectType.BUFF_ATTACK, value: 15, target: TargetType.SELF }],
    description: 'Avoids next attack and +15 Attack.'
  },
  paralyzing_fear: {
    id: 'paralyzing_fear',
    name: 'Paralyzing Fear',
    element: Element.DARK,
    energyCost: 30,
    attack: 25,
    defense: 0,
    effects: [
      { type: CardEffectType.DAMAGE, value: 25, target: TargetType.SINGLE_ENEMY },
      { type: CardEffectType.DEBUFF_DEFENSE, value: 10, target: TargetType.ALL_ENEMIES },
      { type: CardEffectType.DEBUFF_ATTACK, value: 10, target: TargetType.ALL_ENEMIES }
    ],
    description: '25 damage. -10 def/atk to all enemies.'
  },
  shadow_bite: {
    id: 'shadow_bite',
    name: 'Shadow Bite',
    element: Element.DARK,
    energyCost: 22,
    attack: 35,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 35, target: TargetType.SINGLE_ENEMY }],
    description: '35 damage to the first enemy.'
  },
  ghostly_strike: {
    id: 'ghostly_strike',
    name: 'Ghostly Strike',
    element: Element.DARK,
    energyCost: 24,
    attack: 38,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 38, target: TargetType.SINGLE_ENEMY }],
    description: '38 damage to the first enemy.'
  },
  abyssal_void: {
    id: 'abyssal_void',
    name: 'Abyssal Void',
    element: Element.DARK,
    energyCost: 27,
    attack: 43,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 43, target: TargetType.SINGLE_ENEMY }],
    description: '43 damage to the first enemy.'
  },
  night_fist: {
    id: 'night_fist',
    name: 'Night Fist',
    element: Element.DARK,
    energyCost: 20,
    attack: 33,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 33, target: TargetType.SINGLE_ENEMY }],
    description: '33 damage to the first enemy.'
  },
  veil_of_fear: {
    id: 'veil_of_fear',
    name: 'Veil of Fear',
    element: Element.DARK,
    energyCost: 25,
    attack: 0,
    defense: 0,
    effects: [{ type: CardEffectType.DEBUFF_ATTACK, value: 10, target: TargetType.ALL_ENEMIES }],
    description: 'Reduces the enemy team\'s attack by 10.'
  },
  shadow_meld: {
    id: 'shadow_meld',
    name: 'Shadow Meld',
    element: Element.DARK,
    energyCost: 23,
    attack: 20,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 20, target: TargetType.SINGLE_ENEMY }],
    description: '20 damage to the second enemy. Steal 10 energy.'
  },
  enthalpy: {
    id: 'enthalpy',
    name: 'Enthalpy',
    element: Element.DARK,
    energyCost: 20,
    attack: 0,
    defense: 0,
    effects: [
      { type: CardEffectType.BUFF_ATTACK, value: 15, target: TargetType.SELF },
      { type: CardEffectType.BUFF_ENERGY, value: 5, target: TargetType.SELF }
    ],
    description: '+15 attack. +5 energy.'
  },

  // ===== WATER CARDS =====
  rising_tide: {
    id: 'rising_tide',
    name: 'Rising Tide',
    element: Element.WATER,
    energyCost: 20,
    attack: 0,
    defense: 0,
    effects: [{ type: CardEffectType.BUFF_ENERGY, value: 40, target: TargetType.SELF }],
    description: 'Increases 40 energy.'
  },
  healing_wave: {
    id: 'healing_wave',
    name: 'Healing Wave',
    element: Element.WATER,
    energyCost: 25,
    attack: 0,
    defense: 0,
    effects: [{ type: CardEffectType.HEAL, value: 55, target: TargetType.SELF }],
    description: 'Restores 55 HP.'
  },
  high_pressure_jet: {
    id: 'high_pressure_jet',
    name: 'High-Pressure Jet',
    element: Element.WATER,
    energyCost: 22,
    attack: 40,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 40, target: TargetType.SINGLE_ENEMY }],
    description: '40 damage to the first enemy.'
  },
  thick_fog: {
    id: 'thick_fog',
    name: 'Thick Fog',
    element: Element.WATER,
    energyCost: 20,
    attack: 0,
    defense: 0,
    effects: [
      { type: CardEffectType.DEBUFF_DEFENSE, value: 35, target: TargetType.SINGLE_ENEMY },
      { type: CardEffectType.DEBUFF_ATTACK, value: 10, target: TargetType.SINGLE_ENEMY }
    ],
    description: '-35 defense and -10 attack to the first enemy.'
  },
  tsunami: {
    id: 'tsunami',
    name: 'Tsunami',
    element: Element.WATER,
    energyCost: 35,
    attack: 50,
    defense: 0,
    effects: [
      { type: CardEffectType.DAMAGE, value: 50, target: TargetType.SINGLE_ENEMY },
      { type: CardEffectType.DEBUFF_DEFENSE, value: 10, target: TargetType.ALL_ENEMIES }
    ],
    description: '50 damage. -10 defense to all enemies.'
  },
  water_hammer: {
    id: 'water_hammer',
    name: 'Water Hammer',
    element: Element.WATER,
    energyCost: 25,
    attack: 41,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 41, target: TargetType.SINGLE_ENEMY }],
    description: '41 damage to the first enemy.'
  },
  hydro_lance: {
    id: 'hydro_lance',
    name: 'Hydro Lance',
    element: Element.WATER,
    energyCost: 27,
    attack: 44,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 44, target: TargetType.SINGLE_ENEMY }],
    description: '44 damage to the first enemy.'
  },
  cutting_sprinkler: {
    id: 'cutting_sprinkler',
    name: 'Cutting Sprinkler',
    element: Element.WATER,
    energyCost: 23,
    attack: 37,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 37, target: TargetType.SINGLE_ENEMY }],
    description: '37 damage to the first enemy.'
  },
  percussive_drop: {
    id: 'percussive_drop',
    name: 'Percussive Drop',
    element: Element.WATER,
    energyCost: 19,
    attack: 31,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 31, target: TargetType.SINGLE_ENEMY }],
    description: '31 damage to the first enemy.'
  },
  aqueous_mantle: {
    id: 'aqueous_mantle',
    name: 'Aqueous Mantle',
    element: Element.WATER,
    energyCost: 25,
    attack: 0,
    defense: 15,
    effects: [{ type: CardEffectType.BUFF_DEFENSE, value: 15, target: TargetType.ALL_ALLIES }],
    description: '+15 defense to the user\'s entire team.'
  },
  tidal_siphon: {
    id: 'tidal_siphon',
    name: 'Tidal Siphon',
    element: Element.WATER,
    energyCost: 23,
    attack: 20,
    defense: 0,
    effects: [
      { type: CardEffectType.DAMAGE, value: 20, target: TargetType.SINGLE_ENEMY },
      { type: CardEffectType.HEAL, value: 10, target: TargetType.SELF } // Simplified drain logic
    ],
    description: '20 damage to the third enemy. Steal 10 HP.'
  },
  aqua_shield: {
    id: 'aqua_shield',
    name: 'Aqua Shield',
    element: Element.WATER,
    energyCost: 20,
    attack: 0,
    defense: 15,
    effects: [
      { type: CardEffectType.SHIELD, value: 15, target: TargetType.SELF },
      { type: CardEffectType.DEBUFF_ATTACK, value: 10, target: TargetType.SINGLE_ENEMY }
    ],
    description: '+15 defense to user. -10 attack to enemy.'
  },

  // ===== DRAGON CARDS =====
  ancestral_breath: {
    id: 'ancestral_breath',
    name: 'Ancestral Breath',
    element: Element.DRAGON,
    energyCost: 20,
    attack: 0,
    defense: 0,
    effects: [{ type: CardEffectType.BUFF_ENERGY, value: 40, target: TargetType.SELF }],
    description: 'Increases 40 energy.'
  },
  regenerative_scales: {
    id: 'regenerative_scales',
    name: 'Regenerative Scales',
    element: Element.DRAGON,
    energyCost: 25,
    attack: 0,
    defense: 0,
    effects: [{ type: CardEffectType.HEAL, value: 45, target: TargetType.SELF }],
    description: 'Restores 45 HP.'
  },
  draco_momentum: {
    id: 'draco_momentum',
    name: 'Draco Momentum',
    element: Element.DRAGON,
    energyCost: 25,
    attack: 41,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 41, target: TargetType.SINGLE_ENEMY }],
    description: '41 damage to the first enemy.'
  },
  ancestral_fury: {
    id: 'ancestral_fury',
    name: 'Ancestral Fury',
    element: Element.DRAGON,
    energyCost: 30,
    attack: 50,
    defense: 5,
    effects: [
      { type: CardEffectType.DAMAGE, value: 50, target: TargetType.SINGLE_ENEMY },
      { type: CardEffectType.SHIELD, value: 5, target: TargetType.SELF }
    ],
    description: '50 damage + 5 defense to the user.'
  },
  sharp_claw: {
    id: 'sharp_claw',
    name: 'Sharp Claw',
    element: Element.DRAGON,
    energyCost: 22,
    attack: 35,
    defense: 0,
    effects: [
      { type: CardEffectType.DAMAGE, value: 35, target: TargetType.SINGLE_ENEMY },
      { type: CardEffectType.DEBUFF_DEFENSE, value: 5, target: TargetType.ALL_ENEMIES }
    ],
    description: '35 damage. -5 defense to enemy team.'
  },
  dragon_tail: {
    id: 'dragon_tail',
    name: 'Dragon Tail',
    element: Element.DRAGON,
    energyCost: 24,
    attack: 39,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 39, target: TargetType.SINGLE_ENEMY }],
    description: '39 damage to the first enemy.'
  },
  brutal_slash: {
    id: 'brutal_slash',
    name: 'Brutal Slash',
    element: Element.DRAGON,
    energyCost: 26,
    attack: 42,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 42, target: TargetType.SINGLE_ENEMY }],
    description: '42 damage to the first enemy.'
  },
  destroyer_horn: {
    id: 'destroyer_horn',
    name: 'Destroyer Horn',
    element: Element.DRAGON,
    energyCost: 28,
    attack: 45,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 45, target: TargetType.SINGLE_ENEMY }],
    description: '45 damage to the first enemy.'
  },
  feral_rush: {
    id: 'feral_rush',
    name: 'Feral Rush',
    element: Element.DRAGON,
    energyCost: 22,
    attack: 36,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 36, target: TargetType.SINGLE_ENEMY }],
    description: '36 damage to the first enemy.'
  },
  war_cry: {
    id: 'war_cry',
    name: 'War Cry',
    element: Element.DRAGON,
    energyCost: 25,
    attack: 0,
    defense: 10,
    effects: [
      { type: CardEffectType.BUFF_DEFENSE, value: 10, target: TargetType.ALL_ALLIES },
      { type: CardEffectType.BUFF_ENERGY, value: 10, target: TargetType.ALL_ALLIES }
    ],
    description: '+10 defense and +10 energy to team.'
  },
  draconic_might: {
    id: 'draconic_might',
    name: 'Draconic Might',
    element: Element.DRAGON,
    energyCost: 24,
    attack: 20,
    defense: 0,
    effects: [
      { type: CardEffectType.DAMAGE, value: 20, target: TargetType.SINGLE_ENEMY },
      { type: CardEffectType.BUFF_ATTACK, value: 15, target: TargetType.SELF }
    ],
    description: '20 damage to third enemy. +15 attack.'
  },
  ancient_ward: {
    id: 'ancient_ward',
    name: 'Ancient Ward',
    element: Element.DRAGON,
    energyCost: 20,
    attack: 0,
    defense: 15,
    effects: [
      { type: CardEffectType.SHIELD, value: 15, target: TargetType.SELF },
      // "First in turn order" requires priority logic update, effectively implemented via speed buff for now
      { type: CardEffectType.BUFF_SPEED, value: 100, target: TargetType.SELF }
    ],
    description: '+15 defense. User moves first.'
  },

  // ===== FIRE CARDS =====
  fiery_fury: {
    id: 'fiery_fury',
    name: 'Fiery Fury',
    element: Element.FIRE,
    energyCost: 20,
    attack: 0,
    defense: 0,
    effects: [{ type: CardEffectType.BUFF_ENERGY, value: 40, target: TargetType.SELF }],
    description: 'Increases 40 energy.'
  },
  life_brazier: {
    id: 'life_brazier',
    name: 'Life Brazier',
    element: Element.FIRE,
    energyCost: 25,
    attack: 0,
    defense: 0,
    effects: [{ type: CardEffectType.HEAL, value: 50, target: TargetType.SELF }],
    description: 'Restores 50 HP.'
  },
  pyro_jet: {
    id: 'pyro_jet',
    name: 'Pyro Jet',
    element: Element.FIRE,
    energyCost: 22,
    attack: 35,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 35, target: TargetType.SINGLE_ENEMY }],
    description: '35 damage + Burn.'
  },
  volcanic_explosion: {
    id: 'volcanic_explosion',
    name: 'Volcanic Explosion',
    element: Element.FIRE,
    energyCost: 35,
    attack: 60,
    defense: 0,
    effects: [
      { type: CardEffectType.DAMAGE, value: 60, target: TargetType.SINGLE_ENEMY },
      { type: CardEffectType.DAMAGE, value: 15, target: TargetType.SELF } // Recoil
    ],
    description: '60 damage. 15 recoil damage.'
  },
  burning_aura: {
    id: 'burning_aura',
    name: 'Burning Aura',
    element: Element.FIRE,
    energyCost: 25,
    attack: 10,
    defense: 0,
    effects: [
      { type: CardEffectType.BUFF_ATTACK, value: 15, target: TargetType.SELF },
      { type: CardEffectType.DAMAGE, value: 10, target: TargetType.ALL_ENEMIES }
    ],
    description: '+15 attack. 10 damage to all enemies.'
  },
  fireball: {
    id: 'fireball',
    name: 'Fireball',
    element: Element.FIRE,
    energyCost: 22,
    attack: 35,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 35, target: TargetType.SINGLE_ENEMY }],
    description: '35 damage to the first enemy.'
  },
  thermal_fist: {
    id: 'thermal_fist',
    name: 'Thermal Fist',
    element: Element.FIRE,
    energyCost: 24,
    attack: 38,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 38, target: TargetType.SINGLE_ENEMY }],
    description: '38 damage to the first enemy.'
  },
  fiery_ring: {
    id: 'fiery_ring',
    name: 'Fiery Ring',
    element: Element.FIRE,
    energyCost: 26,
    attack: 42,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 42, target: TargetType.SINGLE_ENEMY }],
    description: '42 damage to the first enemy.'
  },
  sudden_explosion: {
    id: 'sudden_explosion',
    name: 'Sudden Explosion',
    element: Element.FIRE,
    energyCost: 21,
    attack: 34,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 34, target: TargetType.SINGLE_ENEMY }],
    description: '34 damage to the first enemy.'
  },
  ember_burst: {
    id: 'ember_burst',
    name: 'Ember Burst',
    element: Element.FIRE,
    energyCost: 23,
    attack: 37,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 37, target: TargetType.SINGLE_ENEMY }],
    description: '37 damage to the first enemy.'
  },
  hearthfire: {
    id: 'hearthfire',
    name: 'Hearthfire',
    element: Element.FIRE,
    energyCost: 25,
    attack: 0,
    defense: 0,
    effects: [{ type: CardEffectType.BUFF_ENERGY, value: 15, target: TargetType.ALL_ALLIES }],
    description: 'Restores 15 energy to the entire team.'
  },
  magma_siphon: {
    id: 'magma_siphon',
    name: 'Magma Siphon',
    element: Element.FIRE,
    energyCost: 23,
    attack: 20,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 20, target: TargetType.SINGLE_ENEMY }],
    description: '20 damage to the third enemy. Steal 10 energy.'
  },

  // ===== WIND CARDS =====
  driving_wind: {
    id: 'driving_wind',
    name: 'Driving Wind',
    element: Element.WIND,
    energyCost: 20,
    attack: 0,
    defense: 0,
    effects: [{ type: CardEffectType.BUFF_ENERGY, value: 40, target: TargetType.SELF }],
    description: 'Increases 40 energy.'
  },
  restoring_breeze: {
    id: 'restoring_breeze',
    name: 'Restoring Breeze',
    element: Element.WIND,
    energyCost: 25,
    attack: 0,
    defense: 0,
    effects: [{ type: CardEffectType.HEAL, value: 40, target: TargetType.SELF }],
    description: 'Restores 40 HP.'
  },
  vortex_edge: {
    id: 'vortex_edge',
    name: 'Vortex Edge',
    element: Element.WIND,
    energyCost: 20,
    attack: 30,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 30, target: TargetType.ALL_ENEMIES }], // Simplified to all for now
    description: '30 damage to enemies.'
  },
  cyclonic_vortex: {
    id: 'cyclonic_vortex',
    name: 'Cyclonic Vortex',
    element: Element.WIND,
    energyCost: 25,
    attack: 35,
    defense: 0,
    effects: [
      { type: CardEffectType.DAMAGE, value: 35, target: TargetType.SINGLE_ENEMY },
      { type: CardEffectType.DEBUFF_ATTACK, value: 10, target: TargetType.ALL_ENEMIES }
    ],
    description: '35 damage. -10 attack to enemy team.'
  },
  ascendant_flight: {
    id: 'ascendant_flight',
    name: 'Ascendant Flight',
    element: Element.WIND,
    energyCost: 22,
    attack: 0,
    defense: 0,
    effects: [
      { type: CardEffectType.BUFF_SPEED, value: 25, target: TargetType.SELF },
      { type: CardEffectType.HEAL, value: 10, target: TargetType.SELF }
    ],
    description: '+25 velocity + 10 HP.'
  },
  gale_strike: {
    id: 'gale_strike',
    name: 'Gale Strike',
    element: Element.WIND,
    energyCost: 24,
    attack: 38,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 38, target: TargetType.SINGLE_ENEMY }],
    description: '38 damage to the first enemy.'
  },
  wind_assault: {
    id: 'wind_assault',
    name: 'Wind Assault',
    element: Element.WIND,
    energyCost: 26,
    attack: 42,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 42, target: TargetType.SINGLE_ENEMY }],
    description: '42 damage to the first enemy.'
  },
  gale_cutter: {
    id: 'gale_cutter',
    name: 'Gale Cutter',
    element: Element.WIND,
    energyCost: 22,
    attack: 35,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 35, target: TargetType.SINGLE_ENEMY }],
    description: '35 damage to the first enemy.'
  },
  air_shot: {
    id: 'air_shot',
    name: 'Air Shot',
    element: Element.WIND,
    energyCost: 21,
    attack: 34,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 34, target: TargetType.SINGLE_ENEMY }],
    description: '34 damage to the first enemy.'
  },
  winds_of_change: {
    id: 'winds_of_change',
    name: 'Winds of Change',
    element: Element.WIND,
    energyCost: 25,
    attack: 0,
    defense: 0,
    effects: [{ type: CardEffectType.HEAL, value: 10, target: TargetType.ALL_ALLIES }],
    description: '+10 HP to the entire team. Swaps position.'
  },
  gale_slash: {
    id: 'gale_slash',
    name: 'Gale Slash',
    element: Element.WIND,
    energyCost: 22,
    attack: 20,
    defense: 0,
    effects: [
      { type: CardEffectType.DAMAGE, value: 20, target: TargetType.SINGLE_ENEMY },
      { type: CardEffectType.BUFF_SPEED, value: 15, target: TargetType.SELF }
    ],
    description: '20 damage to third enemy. +15 velocity.'
  },
  jet_stream: {
    id: 'jet_stream',
    name: 'Jet Stream',
    element: Element.WIND,
    energyCost: 20,
    attack: 0,
    defense: 10,
    effects: [
      { type: CardEffectType.BUFF_SPEED, value: 15, target: TargetType.SELF },
      { type: CardEffectType.SHIELD, value: 10, target: TargetType.SELF }
    ],
    description: '+15 velocity and +10 defense.'
  },

  // ===== ICE CARDS =====
  icy_wind: {
    id: 'icy_wind',
    name: 'Icy Wind',
    element: Element.ICE,
    energyCost: 20,
    attack: 0,
    defense: 0,
    effects: [{ type: CardEffectType.BUFF_ENERGY, value: 40, target: TargetType.SELF }],
    description: 'Increases 40 energy.'
  },
  ice_mantle: {
    id: 'ice_mantle',
    name: 'Ice Mantle',
    element: Element.ICE,
    energyCost: 25,
    attack: 0,
    defense: 0,
    effects: [{ type: CardEffectType.HEAL, value: 45, target: TargetType.SELF }],
    description: 'Restores 45 HP.'
  },
  cryogenic_ray: {
    id: 'cryogenic_ray',
    name: 'Cryogenic Ray',
    element: Element.ICE,
    energyCost: 22,
    attack: 35,
    defense: 0,
    effects: [
      { type: CardEffectType.DAMAGE, value: 35, target: TargetType.SINGLE_ENEMY },
      { type: CardEffectType.DEBUFF_ATTACK, value: 10, target: TargetType.SINGLE_ENEMY }
    ],
    description: '35 damage. -10 attack.'
  },
  frozen_terrain: {
    id: 'frozen_terrain',
    name: 'Frozen Terrain',
    element: Element.ICE,
    energyCost: 25,
    attack: 0,
    defense: 0,
    effects: [{ type: CardEffectType.DEBUFF_SPEED, value: 15, target: TargetType.ALL_ENEMIES }],
    description: 'Reduces all enemies\' speed by 15.'
  },
  avalanche: {
    id: 'avalanche',
    name: 'Avalanche',
    element: Element.ICE,
    energyCost: 30,
    attack: 45,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 45, target: TargetType.SINGLE_ENEMY }], // Simplified
    description: '45 damage to the first enemy.'
  },
  ice_punch: {
    id: 'ice_punch',
    name: 'Ice Punch',
    element: Element.ICE,
    energyCost: 22,
    attack: 35,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 35, target: TargetType.SINGLE_ENEMY }],
    description: '35 damage to the first enemy.'
  },
  ice_shard: {
    id: 'ice_shard',
    name: 'Ice Shard',
    element: Element.ICE,
    energyCost: 24,
    attack: 38,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 38, target: TargetType.SINGLE_ENEMY }],
    description: '38 damage to the first enemy.'
  },
  minor_avalanche: {
    id: 'minor_avalanche',
    name: 'Minor Avalanche',
    element: Element.ICE,
    energyCost: 27,
    attack: 43,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 43, target: TargetType.SINGLE_ENEMY }],
    description: '43 damage to the first enemy.'
  },
  chilling_impact: {
    id: 'chilling_impact',
    name: 'Chilling Impact',
    element: Element.ICE,
    energyCost: 21,
    attack: 34,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 34, target: TargetType.SINGLE_ENEMY }],
    description: '34 damage to the first enemy.'
  },
  frozen_field: {
    id: 'frozen_field',
    name: 'Frozen Field',
    element: Element.ICE,
    energyCost: 25,
    attack: 0,
    defense: 0,
    effects: [
      { type: CardEffectType.DEBUFF_SPEED, value: 15, target: TargetType.ALL_ENEMIES },
      { type: CardEffectType.BUFF_SPEED, value: 5, target: TargetType.ALL_ALLIES }
    ],
    description: '-15 speed to enemies, +5 speed to team.'
  },
  frost_siphon: {
    id: 'frost_siphon',
    name: 'Frost Siphon',
    element: Element.ICE,
    energyCost: 23,
    attack: 20,
    defense: 0,
    effects: [
      { type: CardEffectType.DAMAGE, value: 20, target: TargetType.SINGLE_ENEMY },
      { type: CardEffectType.HEAL, value: 15, target: TargetType.SELF } // HP Steal sim
    ],
    description: '20 damage to second enemy. Heal 10 HP.'
  },
  crystalline_carapace: {
    id: 'crystalline_carapace',
    name: 'Crystalline Carapace',
    element: Element.ICE,
    energyCost: 20,
    attack: 0,
    defense: 15,
    effects: [
      { type: CardEffectType.SHIELD, value: 15, target: TargetType.SELF },
      { type: CardEffectType.HEAL, value: 10, target: TargetType.SELF }
    ],
    description: '+15 defense. +10 HP.'
  },

  // ===== COSMIC CARDS =====
  stellar_flare: {
    id: 'stellar_flare',
    name: 'Stellar Flare',
    element: Element.COSMIC,
    energyCost: 20,
    attack: 0,
    defense: 0,
    effects: [{ type: CardEffectType.BUFF_ENERGY, value: 55, target: TargetType.SELF }],
    description: 'Increases 55 energy.'
  },
  nebula_heal: {
    id: 'nebula_heal',
    name: 'Nebula Heal',
    element: Element.COSMIC,
    energyCost: 25,
    attack: 0,
    defense: 0,
    effects: [{ type: CardEffectType.HEAL, value: 50, target: TargetType.SELF }],
    description: 'Restores 50 HP.'
  },
  quasar_blast: {
    id: 'quasar_blast',
    name: 'Quasar Blast',
    element: Element.COSMIC,
    energyCost: 22,
    attack: 45,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 45, target: TargetType.SINGLE_ENEMY }],
    description: '45 damage to the first enemy.'
  },
  singularity_shield: {
    id: 'singularity_shield',
    name: 'Singularity Shield',
    element: Element.COSMIC,
    energyCost: 25,
    attack: 20, // Buff attack
    defense: 0,
    effects: [{ type: CardEffectType.BUFF_ATTACK, value: 20, target: TargetType.SELF }],
    description: '+20 attack to the user.'
  },
  void_miasma: {
    id: 'void_miasma',
    name: 'Void Miasma',
    element: Element.COSMIC,
    energyCost: 30,
    attack: 20,
    defense: 0,
    effects: [
      { type: CardEffectType.DAMAGE, value: 20, target: TargetType.ALL_ENEMIES },
      { type: CardEffectType.DEBUFF_ATTACK, value: 10, target: TargetType.ALL_ENEMIES }
    ],
    description: '20 damage and -10 attack to all enemies.'
  },
  pulsar_beam: {
    id: 'pulsar_beam',
    name: 'Pulsar Beam',
    element: Element.COSMIC,
    energyCost: 21,
    attack: 35,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 35, target: TargetType.SINGLE_ENEMY }],
    description: '35 damage to the first enemy.'
  },
  comet_tail: {
    id: 'comet_tail',
    name: 'Comet Tail',
    element: Element.COSMIC,
    energyCost: 23,
    attack: 38,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 38, target: TargetType.SINGLE_ENEMY }],
    description: '38 damage to the first enemy.'
  },
  meteor_strike: {
    id: 'meteor_strike',
    name: 'Meteor Strike',
    element: Element.COSMIC,
    energyCost: 26,
    attack: 42,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 42, target: TargetType.SINGLE_ENEMY }],
    description: '42 damage to the first enemy.'
  },
  supernova: {
    id: 'supernova',
    name: 'Supernova',
    element: Element.COSMIC,
    energyCost: 28,
    attack: 50,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 50, target: TargetType.SINGLE_ENEMY }],
    description: '50 damage to the first enemy. 10 recoil.'
  },
  cosmic_siphon: {
    id: 'cosmic_siphon',
    name: 'Cosmic Siphon',
    element: Element.COSMIC,
    energyCost: 22,
    attack: 20,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 20, target: TargetType.SINGLE_ENEMY }],
    description: '20 damage to the third enemy. Steal 15 energy.'
  },
  entropy: {
    id: 'entropy',
    name: 'Entropy',
    element: Element.COSMIC,
    energyCost: 20,
    attack: 0,
    defense: 0,
    effects: [
      { type: CardEffectType.BUFF_ATTACK, value: 15, target: TargetType.SELF },
      { type: CardEffectType.BUFF_SPEED, value: 10, target: TargetType.SELF }
    ],
    description: '+15 attack. +10 velocity.'
  },

  // ===== EXRIX CARDS =====
  energy_claw: {
    id: 'energy_claw',
    name: 'Energy Claw',
    element: Element.EXRIX, // Assuming EXRIX is an element in types
    energyCost: 20,
    attack: 0,
    defense: 0,
    effects: [{ type: CardEffectType.BUFF_ENERGY, value: 40, target: TargetType.SELF }],
    description: 'Increases 40 energy.'
  },
  restoring_nap: {
    id: 'restoring_nap',
    name: 'Restoring Nap',
    element: Element.EXRIX,
    energyCost: 25,
    attack: 0,
    defense: 0,
    effects: [{ type: CardEffectType.HEAL, value: 45, target: TargetType.SELF }],
    description: 'Restores 45 HP.'
  },
  kinetic_strike: {
    id: 'kinetic_strike',
    name: 'Kinetic Strike',
    element: Element.EXRIX,
    energyCost: 18,
    attack: 25,
    defense: 0,
    effects: [
      { type: CardEffectType.DAMAGE, value: 25, target: TargetType.SINGLE_ENEMY },
      { type: CardEffectType.BUFF_SPEED, value: 10, target: TargetType.SELF }
    ],
    description: '25 damage + 10 velocity.'
  },
  opportunist: {
    id: 'opportunist',
    name: 'Opportunist',
    element: Element.EXRIX,
    energyCost: 22,
    attack: 30,
    defense: 0,
    effects: [
      { type: CardEffectType.DAMAGE, value: 30, target: TargetType.SINGLE_ENEMY },
      { type: CardEffectType.BUFF_SPEED, value: 10, target: TargetType.SELF }
    ],
    description: '30 damage + 10 velocity.'
  },
  perfect_mirror: {
    id: 'perfect_mirror',
    name: 'Perfect Mirror',
    element: Element.EXRIX,
    energyCost: 30,
    attack: 0,
    defense: 0,
    effects: [], // Implementation complex: "Adquiere la misma energia que el tercer jablix enemigo"
    description: 'Copies enemy energy.'
  },
  feline_scratch: {
    id: 'feline_scratch',
    name: 'Feline Scratch',
    element: Element.EXRIX,
    energyCost: 19,
    attack: 31,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 31, target: TargetType.SINGLE_ENEMY }],
    description: '31 damage to the first enemy.'
  },
  precise_bite: {
    id: 'precise_bite',
    name: 'Precise Bite',
    element: Element.EXRIX,
    energyCost: 23,
    attack: 37,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 37, target: TargetType.SINGLE_ENEMY }],
    description: '37 damage to the first enemy.'
  },
  flying_kick: {
    id: 'flying_kick',
    name: 'Flying Kick',
    element: Element.EXRIX,
    energyCost: 24,
    attack: 39,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 39, target: TargetType.SINGLE_ENEMY }],
    description: '39 damage to the first enemy.'
  },
  quick_slash: {
    id: 'quick_slash',
    name: 'Quick Slash',
    element: Element.EXRIX,
    energyCost: 20,
    attack: 33,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 33, target: TargetType.SINGLE_ENEMY }],
    description: '33 damage to the first enemy.'
  },
  feline_coordination: {
    id: 'feline_coordination',
    name: 'Feline Coordination',
    element: Element.EXRIX,
    energyCost: 22,
    attack: 10,
    defense: 10,
    effects: [
      { type: CardEffectType.BUFF_ATTACK, value: 10, target: TargetType.ALL_ALLIES },
      { type: CardEffectType.BUFF_DEFENSE, value: 10, target: TargetType.ALL_ALLIES },
      { type: CardEffectType.BUFF_ENERGY, value: 10, target: TargetType.ALL_ALLIES }
    ],
    description: '+10 atk/def/energy to team.'
  },
  adaptation_strike: {
    id: 'adaptation_strike',
    name: 'Adaptation Strike',
    element: Element.EXRIX,
    energyCost: 23,
    attack: 20,
    defense: 0,
    effects: [{ type: CardEffectType.DAMAGE, value: 20, target: TargetType.SINGLE_ENEMY }],
    description: '20 damage to the third enemy. Steal 10 energy.'
  },
  feral_agility: {
    id: 'feral_agility',
    name: 'Feral Agility',
    element: Element.EXRIX,
    energyCost: 20,
    attack: 0,
    defense: 0,
    effects: [{ type: CardEffectType.BUFF_SPEED, value: 15, target: TargetType.SELF }],
    description: '+15 velocity to the user.'
  }
};
