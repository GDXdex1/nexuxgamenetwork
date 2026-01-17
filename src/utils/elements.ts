import { Element } from '@/types/game.types';

export const ELEMENT_MULTIPLIERS: Record<Element, Partial<Record<Element, number>>> = {
  [Element.FIRE]: {
    [Element.FIRE]: 1.0,
    [Element.WATER]: 0.5,
    [Element.PLANT]: 2.0,
    [Element.ICE]: 2.0,
    [Element.EARTH]: 0.5,
    [Element.DRAGON]: 1.0
  },
  [Element.WATER]: {
    [Element.FIRE]: 2.0,
    [Element.WATER]: 1.0,
    [Element.PLANT]: 0.5,
    [Element.EARTH]: 2.0,
    [Element.ELECTRIC]: 0.5,
    [Element.DRAGON]: 1.0
  },
  [Element.PLANT]: {
    [Element.FIRE]: 0.5,
    [Element.WATER]: 2.0,
    [Element.PLANT]: 1.0,
    [Element.EARTH]: 2.0,
    [Element.ICE]: 0.5,
    [Element.DRAGON]: 1.0
  },
  [Element.ICE]: {
    [Element.FIRE]: 0.5,
    [Element.ICE]: 1.0,
    [Element.PLANT]: 2.0,
    [Element.DRAGON]: 2.0,
    [Element.WIND]: 1.5,
    [Element.WATER]: 0.5
  },
  [Element.ELECTRIC]: {
    [Element.WATER]: 2.0,
    [Element.ELECTRIC]: 0.5,
    [Element.WIND]: 2.0,
    [Element.EARTH]: 0.5,
    [Element.DRAGON]: 1.5,
    [Element.DARK]: 1.0
  },
  [Element.EARTH]: {
    [Element.FIRE]: 2.0,
    [Element.WATER]: 0.5,
    [Element.ELECTRIC]: 2.0,
    [Element.EARTH]: 1.0,
    [Element.WIND]: 0.5,
    [Element.DRAGON]: 1.0
  },
  [Element.WIND]: {
    [Element.PLANT]: 2.0,
    [Element.WIND]: 1.0,
    [Element.EARTH]: 2.0,
    [Element.ELECTRIC]: 0.5,
    [Element.ICE]: 0.5,
    [Element.DRAGON]: 1.0
  },
  [Element.DRAGON]: {
    [Element.DRAGON]: 2.0,
    [Element.DARK]: 0.5,
    [Element.COSMIC]: 0.5,
    [Element.FIRE]: 1.5,
    [Element.WATER]: 1.5,
    [Element.PLANT]: 1.5
  },
  [Element.DARK]: {
    [Element.DARK]: 1.0,
    [Element.COSMIC]: 2.0,
    [Element.DRAGON]: 1.5,
    [Element.ELECTRIC]: 1.0,
    [Element.WIND]: 1.0
  },
  [Element.COSMIC]: {
    [Element.COSMIC]: 1.0,
    [Element.DARK]: 2.0,
    [Element.DRAGON]: 1.5,
    [Element.FIRE]: 1.0,
    [Element.WATER]: 1.0
  },
  [Element.EXRIX]: {
    [Element.EXRIX]: 1.0,
    [Element.FIRE]: 1.2,
    [Element.WATER]: 1.2,
    [Element.PLANT]: 1.2,
    [Element.DARK]: 1.5,
    [Element.COSMIC]: 1.5
  }
};

export function getElementalMultiplier(
  attackerElements: Element[],
  defenderElements: Element[]
): number {
  let maxMultiplier = 1.0;
  
  for (const attackElement of attackerElements) {
    for (const defendElement of defenderElements) {
      const multiplier = ELEMENT_MULTIPLIERS[attackElement]?.[defendElement] ?? 1.0;
      if (multiplier > maxMultiplier) {
        maxMultiplier = multiplier;
      }
    }
  }
  
  return maxMultiplier;
}

export function getElementColor(element: Element): string {
  const colors: Record<Element, string> = {
    [Element.FIRE]: '#FF6B6B',
    [Element.WATER]: '#4ECDC4',
    [Element.PLANT]: '#95E1D3',
    [Element.ICE]: '#AED9E0',
    [Element.ELECTRIC]: '#FEE440',
    [Element.EARTH]: '#A0522D',
    [Element.WIND]: '#B0C4DE',
    [Element.DRAGON]: '#9B59B6',
    [Element.DARK]: '#2C3E50',
    [Element.COSMIC]: '#8E44AD',
    [Element.EXRIX]: '#FF00FF'
  };
  return colors[element] || '#FFFFFF';
}

export function getElementIcon(element: Element): string {
  const icons: Record<Element, string> = {
    [Element.FIRE]: '🔥',
    [Element.WATER]: '💧',
    [Element.PLANT]: '🌿',
    [Element.ICE]: '❄️',
    [Element.ELECTRIC]: '⚡',
    [Element.EARTH]: '🪨',
    [Element.WIND]: '💨',
    [Element.DRAGON]: '🐉',
    [Element.DARK]: '🌑',
    [Element.COSMIC]: '✨',
    [Element.EXRIX]: '⭐'
  };
  return icons[element] || '❓';
}

export function getElementGradient(element: Element): string {
  const gradients: Record<Element, string> = {
    [Element.FIRE]: 'from-red-500 to-orange-500',
    [Element.WATER]: 'from-blue-500 to-cyan-500',
    [Element.PLANT]: 'from-green-500 to-emerald-500',
    [Element.ICE]: 'from-cyan-300 to-blue-400',
    [Element.ELECTRIC]: 'from-yellow-400 to-amber-500',
    [Element.EARTH]: 'from-amber-700 to-yellow-800',
    [Element.WIND]: 'from-slate-300 to-gray-400',
    [Element.DRAGON]: 'from-purple-600 to-pink-600',
    [Element.DARK]: 'from-gray-800 to-black',
    [Element.COSMIC]: 'from-purple-500 to-pink-500',
    [Element.EXRIX]: 'from-pink-500 to-purple-500'
  };
  return gradients[element] || 'from-gray-500 to-gray-600';
}
