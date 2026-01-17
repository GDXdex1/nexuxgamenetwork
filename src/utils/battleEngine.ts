// src/utils/battleEngine.ts

import type { Jablix, Card, CardEffect, StatusEffect } from '@/types/game.types';
import { CardEffectType, TargetType } from '@/types/game.types';
import { getElementalMultiplier } from './elements';

export function isAlive(jablix: Jablix): boolean {
  return jablix.hp > 0;
}

export function getAliveJabs(team: Jablix[]): Jablix[] {
  return team.filter(isAlive);
}

export function calculateDamage(
  attacker: Jablix,
  defender: Jablix,
  baseDamage: number
): number {
  const elementMultiplier = getElementalMultiplier(attacker.elements, defender.elements);
  const attackPower = attacker.baseAttack + attacker.currentAttackBuff;
  const defensePower = defender.baseDefense + defender.currentDefenseBuff;

  let damage = baseDamage + attackPower - defensePower;
  damage = Math.max(1, damage);
  damage = Math.floor(damage * elementMultiplier);

  if (defender.shield > 0) {
    const remainingDamage = damage - defender.shield;
    defender.shield = Math.max(0, defender.shield - damage);
    damage = Math.max(0, remainingDamage);
  }

  return damage;
}

export function applyDamage(defender: Jablix, damage: number): number {
  const actualDamage = Math.min(damage, defender.hp);
  defender.hp = Math.max(0, defender.hp - damage);
  return actualDamage;
}

export function applyHealing(target: Jablix, healAmount: number): number {
  const actualHeal = Math.min(healAmount, target.maxHp - target.hp);
  target.hp = Math.min(target.maxHp, target.hp + healAmount);
  return actualHeal;
}

export function applyShield(target: Jablix, shieldAmount: number): void {
  target.shield += shieldAmount;
}

export function applyBuff(
  target: Jablix,
  type: 'ATTACK' | 'DEFENSE' | 'SPEED',
  value: number,
  duration: number
): void {
  const statusEffect: StatusEffect = {
    type: type === 'ATTACK' ? 'ATTACK_BUFF' : type === 'DEFENSE' ? 'DEFENSE_BUFF' : 'SPEED_BUFF',
    value,
    duration
  };

  target.statusEffects.push(statusEffect);

  if (type === 'ATTACK') {
    target.currentAttackBuff += value;
  } else if (type === 'DEFENSE') {
    target.currentDefenseBuff += value;
  } else if (type === 'SPEED') {
    target.currentSpeedBuff += value;
    target.speed += value;
  }
}

export function applyDebuff(
  target: Jablix,
  type: 'ATTACK' | 'DEFENSE' | 'SPEED',
  value: number,
  duration: number
): void {
  const statusEffect: StatusEffect = {
    type: type === 'ATTACK' ? 'ATTACK_DEBUFF' : type === 'DEFENSE' ? 'DEFENSE_DEBUFF' : 'SPEED_DEBUFF',
    value,
    duration
  };

  target.statusEffects.push(statusEffect);

  if (type === 'ATTACK') {
    target.currentAttackBuff -= value;
  } else if (type === 'DEFENSE') {
    target.currentDefenseBuff -= value;
  } else if (type === 'SPEED') {
    target.currentSpeedBuff -= value;
    target.speed -= value;
  }
}

export function updateStatusEffects(jablix: Jablix): void {
  jablix.statusEffects = jablix.statusEffects.filter((effect: StatusEffect) => {
    // Decrease duration
    effect.duration--;

    // If expired, revert effect
    if (effect.duration <= 0) {
      if (effect.type === 'ATTACK_BUFF') {
        jablix.currentAttackBuff -= effect.value;
      } else if (effect.type === 'DEFENSE_BUFF') {
        jablix.currentDefenseBuff -= effect.value;
      } else if (effect.type === 'SPEED_BUFF') {
        jablix.currentSpeedBuff -= effect.value;
        jablix.speed -= effect.value;
      } else if (effect.type === 'ATTACK_DEBUFF') {
        jablix.currentAttackBuff += effect.value;
      } else if (effect.type === 'DEFENSE_DEBUFF') {
        jablix.currentDefenseBuff += effect.value;
      } else if (effect.type === 'SPEED_DEBUFF') {
        jablix.currentSpeedBuff += effect.value;
        jablix.speed += effect.value;
      }
      return false;
    }

    return true;
  });
}

export function executeCardEffect(
  attacker: Jablix,
  card: Card,
  effect: CardEffect,
  targets: Jablix[],
  battleLog: string[]
): void {
  const aliveTargets = targets.filter(isAlive);

  if (aliveTargets.length === 0 && effect.target !== TargetType.SELF) {
    return;
  }

  switch (effect.type) {
    case CardEffectType.DAMAGE: {
      aliveTargets.forEach((target: Jablix) => {
        const damage = calculateDamage(attacker, target, effect.value);
        const actualDamage = applyDamage(target, damage);
        battleLog.push(
          `${attacker.name} inflige ${actualDamage} de daño a ${target.name}!`
        );
      });
      break;
    }

    case CardEffectType.HEAL: {
      const target = effect.target === TargetType.SELF ? attacker : aliveTargets[0];
      if (target) {
        const healAmount = applyHealing(target, effect.value);
        battleLog.push(
          `${target.name} se cura ${healAmount} HP!`
        );
      }
      break;
    }

    case CardEffectType.DAMAGE_WITH_HEAL: {
      aliveTargets.forEach((target: Jablix) => {
        const damage = calculateDamage(attacker, target, effect.value);
        const actualDamage = applyDamage(target, damage);
        const healAmount = applyHealing(attacker, Math.floor(actualDamage * 0.5));
        battleLog.push(
          `${attacker.name} roba ${actualDamage} HP de ${target.name} y se cura ${healAmount}!`
        );
      });
      break;
    }

    case CardEffectType.SHIELD: {
      const target = effect.target === TargetType.SELF ? attacker : aliveTargets[0];
      if (target) {
        applyShield(target, effect.value);
        battleLog.push(
          `${target.name} gana ${effect.value} de escudo!`
        );
      }
      break;
    }

    case CardEffectType.BUFF_ATTACK: {
      const target = effect.target === TargetType.SELF ? attacker : aliveTargets[0];
      if (target) {
        applyBuff(target, 'ATTACK', effect.value, effect.duration || 2);
        battleLog.push(
          `${target.name} aumenta su ataque en ${effect.value}!`
        );
      }
      break;
    }

    case CardEffectType.BUFF_DEFENSE: {
      const target = effect.target === TargetType.SELF ? attacker : aliveTargets[0];
      if (target) {
        applyBuff(target, 'DEFENSE', effect.value, effect.duration || 2);
        battleLog.push(
          `${target.name} aumenta su defensa en ${effect.value}!`
        );
      }
      break;
    }

    case CardEffectType.DEBUFF_ATTACK: {
      aliveTargets.forEach((target: Jablix) => {
        applyDebuff(target, 'ATTACK', effect.value, effect.duration || 2);
        battleLog.push(
          `${target.name} reduce su ataque en ${effect.value}!`
        );
      });
      break;
    }

    case CardEffectType.DEBUFF_DEFENSE: {
      aliveTargets.forEach((target: Jablix) => {
        applyDebuff(target, 'DEFENSE', effect.value, effect.duration || 2);
        battleLog.push(
          `${target.name} reduce su defensa en ${effect.value}!`
        );
      });
      break;
    }

    case CardEffectType.BUFF_ENERGY: {
      const target = effect.target === TargetType.SELF ? attacker : aliveTargets[0];
      if (target) {
        target.energy = Math.min(target.maxEnergy, target.energy + effect.value);
        battleLog.push(`${target.name} recupera ${effect.value} energia!`);
      }
      break;
    }

    case CardEffectType.DEBUFF_ENERGY: {
      aliveTargets.forEach(target => {
        target.energy = Math.max(0, target.energy - effect.value);
        battleLog.push(`${target.name} pierde ${effect.value} energia!`);
      });
      break;
    }

    case CardEffectType.BUFF_SPEED: {
      const target = effect.target === TargetType.SELF ? attacker : aliveTargets[0];
      if (target) {
        applyBuff(target, 'SPEED', effect.value, effect.duration || 2);
        battleLog.push(`${target.name} aumenta su velocidad en ${effect.value}!`);
      }
      break;
    }

    case CardEffectType.DEBUFF_SPEED: {
      aliveTargets.forEach(target => {
        applyDebuff(target, 'SPEED', effect.value, effect.duration || 2);
        battleLog.push(`${target.name} reduce su velocidad en ${effect.value}!`);
      });
      break;
    }

    case CardEffectType.STUN: {
      aliveTargets.forEach(target => {
        target.isStunned = true;
        battleLog.push(`${target.name} está aturdido!`);
      });
      break;
    }

    case CardEffectType.DOUBLE_DAMAGE: {
      // This is usually a 'next attack deals double damage' flag, but simpler implementation:
      // just apply a huge attack buff for 1 turn? Or maybe we need a 'doubleNextDamage' flag on Jablix.
      // For now, let's treat it as a significant temporary attack buff for simplicity unless a flag exists.
      // Actually, without a specific flag, let's just log it and maybe add a generic buff?
      // Or if the card ITSELF deals double damage? No, effect type DOUBLE_DAMAGE usually implies a modifier.
      // Given existing code, I'll implement it as a high attack buff for 1 turn as a placeholder.
      const target = effect.target === TargetType.SELF ? attacker : aliveTargets[0];
      if (target) {
        applyBuff(target, 'ATTACK', 50, 1); // Placeholder
        battleLog.push(`${target.name} prepara un ataque poderoso!`);
      }
      break;
    }
  }
}

export function playCard(
  attacker: Jablix,
  card: Card,
  playerTeam: Jablix[],
  enemyTeam: Jablix[],
  targetIndex: number,
  isPlayerAttacker: boolean,
  battleLog: string[]
): boolean {
  if (attacker.energy < card.energyCost) {
    battleLog.push(`${attacker.name} no tiene suficiente energía!`);
    return false;
  }

  attacker.energy -= card.energyCost;

  battleLog.push(
    `${attacker.name} usa ${card.name} (Costo: ${card.energyCost} energía)`
  );

  card.effects.forEach((effect: CardEffect) => {
    let targets: Jablix[] = [];

    switch (effect.target) {
      case TargetType.SINGLE_ENEMY:
        targets = isPlayerAttacker
          ? [enemyTeam[targetIndex]].filter(Boolean)
          : [playerTeam[targetIndex]].filter(Boolean);
        break;
      case TargetType.ALL_ENEMIES:
        targets = isPlayerAttacker ? enemyTeam : playerTeam;
        break;
      case TargetType.SELF:
        targets = [attacker];
        break;
      case TargetType.SINGLE_ALLY:
        targets = isPlayerAttacker
          ? [playerTeam[targetIndex]].filter(Boolean)
          : [enemyTeam[targetIndex]].filter(Boolean);
        break;
      case TargetType.ALL_ALLIES:
        targets = isPlayerAttacker ? playerTeam : enemyTeam;
        break;
    }

    executeCardEffect(attacker, card, effect, targets, battleLog);
  });

  return true;
}

export function calculateTurnOrder(
  playerTeam: Jablix[],
  enemyTeam: Jablix[]
): { jablix: Jablix; isPlayer: boolean; index: number }[] {
  const turnOrder: { jablix: Jablix; isPlayer: boolean; index: number }[] = [];

  playerTeam.forEach((jablix: Jablix, index: number) => {
    if (isAlive(jablix)) {
      turnOrder.push({ jablix, isPlayer: true, index });
    }
  });

  enemyTeam.forEach((jablix: Jablix, index: number) => {
    if (isAlive(jablix)) {
      turnOrder.push({ jablix, isPlayer: false, index });
    }
  });

  return turnOrder.sort((a, b) => b.jablix.speed - a.jablix.speed);
}
