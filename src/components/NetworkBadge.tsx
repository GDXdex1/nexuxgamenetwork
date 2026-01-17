'use client';

import { getNetworkBadge, getNetworkColor, isTestnet } from '@/config/env';

interface NetworkBadgeProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function NetworkBadge({ className = '', size = 'medium' }: NetworkBadgeProps) {
  const badge = getNetworkBadge();
  const color = getNetworkColor();

  const sizeClasses = {
    small: 'text-xs px-2 py-1',
    medium: 'text-sm px-3 py-1.5',
    large: 'text-base px-4 py-2',
  };

  const colorClasses = {
    orange: 'bg-orange-500/20 border-orange-500 text-orange-300',
    green: 'bg-green-500/20 border-green-500 text-green-300',
  };

  return (
    <div
      className={`
        inline-flex items-center gap-2 rounded-full font-bold border-2
        ${sizeClasses[size]}
        ${colorClasses[color as keyof typeof colorClasses]}
        ${className}
      `}
    >
      {badge}
      {isTestnet() && (
        <span className="text-[0.65em] opacity-70">
          (Test Mode)
        </span>
      )}
    </div>
  );
}
