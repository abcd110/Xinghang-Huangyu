// 共享常量定义
// 集中管理项目中重复使用的常量

import { ArmorQuality } from './nanoArmorRecipes';

// ============================================
// 品质相关常量
// ============================================

// 品质后缀映射
export const QUALITY_SUFFIX: Record<ArmorQuality, string> = {
  [ArmorQuality.STARDUST]: '_stardust',
  [ArmorQuality.ALLOY]: '_alloy',
  [ArmorQuality.CRYSTAL]: '_crystal',
  [ArmorQuality.QUANTUM]: '_quantum',
  [ArmorQuality.VOID]: '_void',
};

// 品质名称
export const QUALITY_NAMES: Record<ArmorQuality, string> = {
  [ArmorQuality.STARDUST]: '星尘级',
  [ArmorQuality.ALLOY]: '合金级',
  [ArmorQuality.CRYSTAL]: '晶核级',
  [ArmorQuality.QUANTUM]: '量子级',
  [ArmorQuality.VOID]: '虚空级',
};

// ============================================
// 材料ID常量
// ============================================

// 材料ID前缀列表（仅保留锻造所需的材料）
export const MATERIAL_IDS = [
  'mat_001', 'mat_003', 'mat_004', 'mat_005',
  'mat_006', 'mat_007', 'mat_010'
];

// ============================================
// 品质到稀有度映射
// ============================================

import { ItemRarity } from './types';

export const QUALITY_TO_RARITY: Record<ArmorQuality, ItemRarity> = {
  [ArmorQuality.STARDUST]: ItemRarity.COMMON,
  [ArmorQuality.ALLOY]: ItemRarity.UNCOMMON,
  [ArmorQuality.CRYSTAL]: ItemRarity.RARE,
  [ArmorQuality.QUANTUM]: ItemRarity.EPIC,
  [ArmorQuality.VOID]: ItemRarity.LEGENDARY,
};

// ============================================
// 成功率颜色
// ============================================

export const getSuccessRateColor = (rate: number): string => {
  if (rate >= 0.8) return '#22c55e';
  if (rate >= 0.6) return '#00d4ff';
  if (rate >= 0.4) return '#f59e0b';
  return '#ef4444';
};
