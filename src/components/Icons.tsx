// 统一的 SVG 图标组件
// 确保在所有设备上显示一致

import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

// 飞船图标 - 开始界面主图标
export function SpaceshipIcon({ size = 80, color = '#00d4ff', className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 飞船主体 */}
      <path
        d="M50 5L60 40H75L50 95L25 40H40L50 5Z"
        fill={color}
        filter="url(#glow)"
      />
      {/* 飞船窗口 */}
      <circle cx="50" cy="35" r="8" fill="#1a1f3a" />
      <circle cx="50" cy="35" r="5" fill="#00d4ff" opacity="0.8" />
      {/* 尾焰 */}
      <path
        d="M40 70L50 95L60 70"
        fill="url(#flame)"
      />
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="flame" x1="50" y1="70" x2="50" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// 能量图标
export function EnergyIcon({ size = 24, color = '#f59e0b', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
        fill={color}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 信用点图标
export function CreditIcon({ size = 24, color = '#fbbf24', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
      <text x="12" y="16" textAnchor="middle" fill={color} fontSize="12" fontWeight="bold">¥</text>
    </svg>
  );
}

// 背包图标
export function InventoryIcon({ size = 24, color = '#60a5fa', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M16 7V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V7"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}

// 任务图标
export function QuestIcon({ size = 24, color = '#a78bfa', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M9 11L12 14L22 4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M21 12V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

// 商店图标
export function ShopIcon({ size = 24, color = '#34d399', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M3 3H21V7H3V3Z"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M4 7V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V7"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M12 11V17"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 基地图标
export function BaseIcon({ size = 24, color = '#f472b6', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M3 21H21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M5 21V7L12 3L19 7V21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M9 21V14H15V21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

// 探索图标
export function ExploreIcon({ size = 24, color = '#60a5fa', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
      <path
        d="M12 2V12L20 16"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

// 返回图标
export function BackIcon({ size = 24, color = '#9ca3af', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M19 12H5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 19L5 12L12 5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
