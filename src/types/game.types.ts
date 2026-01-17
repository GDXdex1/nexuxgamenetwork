// src/types/game.types.ts

export enum Element {
  FIRE = 'FIRE',
  WATER = 'WATER',
  PLANT = 'PLANT',
  ICE = 'ICE',
  ELECTRIC = 'ELECTRIC',
  EARTH = 'EARTH',
  WIND = 'WIND',
  DRAGON = 'DRAGON',
  DARK = 'DARK',
  COSMIC = 'COSMIC',
  EXRIX = 'EXRIX'
}

export enum CardEffectType {
  DAMAGE = 'DAMAGE',
  HEAL = 'HEAL',
  DAMAGE_WITH_HEAL = 'DAMAGE_WITH_HEAL',
  SHIELD = 'SHIELD',
  BUFF_ATTACK = 'BUFF_ATTACK',
  BUFF_DEFENSE = 'BUFF_DEFENSE',
  DEBUFF_ATTACK = 'DEBUFF_ATTACK',
  DEBUFF_DEFENSE = 'DEBUFF_DEFENSE',
  STUN = 'STUN',
  DOUBLE_DAMAGE = 'DOUBLE_DAMAGE',
  BUFF_ENERGY = 'BUFF_ENERGY',
  DEBUFF_ENERGY = 'DEBUFF_ENERGY',
  BUFF_SPEED = 'BUFF_SPEED',
  DEBUFF_SPEED = 'DEBUFF_SPEED'
}

export enum TargetType {
  SINGLE_ENEMY = 'SINGLE_ENEMY',
  ALL_ENEMIES = 'ALL_ENEMIES',
  SELF = 'SELF',
  SINGLE_ALLY = 'SINGLE_ALLY',
  ALL_ALLIES = 'ALL_ALLIES'
}

export interface CardEffect {
  type: CardEffectType;
  value: number;
  target: TargetType;
  duration?: number;
}

export interface Card {
  id: string;
  name: string;
  element: Element;
  energyCost: number;
  attack: number;
  defense: number;
  effects: CardEffect[];
  description: string;
}

export interface Jablix {
  id: string;
  name: string;
  elements: Element[]; // Cambiado a array para manejar doble elemento
  imageUrl: string; // Agregado para IPFS
  hp: number;
  maxHp: number;
  speed: number;
  baseAttack: number;
  baseDefense: number;
  energy: number;
  maxEnergy: number;
  cards: Card[];
  currentAttackBuff: number;
  currentDefenseBuff: number;
  currentSpeedBuff: number;
  shield: number;
  isStunned: boolean;
  statusEffects: StatusEffect[];
}

export interface StatusEffect {
  type: 'ATTACK_BUFF' | 'DEFENSE_BUFF' | 'ATTACK_DEBUFF' | 'DEFENSE_DEBUFF' | 'SPEED_BUFF' | 'SPEED_DEBUFF';
  value: number;
  duration: number;
}

export interface BattleState {
  playerTeam: Jablix[];
  enemyTeam: Jablix[];
  currentTurn: number;
  turnOrder: { jablix: Jablix; isPlayer: boolean; index: number }[];
  battleLog: string[];
  winner: 'player' | 'enemy' | null;
  animations: BattleAnimation[];
}

export interface BattleAnimation {
  id: string;
  type: 'attack' | 'damage' | 'heal' | 'shield' | 'buff' | 'debuff';
  targetIndex: number;
  isPlayer: boolean;
  timestamp: number;
}
