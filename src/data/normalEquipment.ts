// ============================================
// 普通装备数据 - 新装备系统
// 6部位装备，5种品质
// ============================================

import { EquipmentSlot } from './equipmentTypes';
import { ItemRarity } from './types';

// 装备基础属性
export interface EquipmentBaseStats {
  attack?: number;
  defense?: number;
  maxHp?: number;
  speed?: number;
  critRate?: number;
  critDamage?: number;
  dodgeRate?: number;
  hitRate?: number;
  penetration?: number;
  damageReduction?: number;
  lifeSteal?: number;
}

// 普通装备定义
export interface NormalEquipment {
  id: string;
  name: string;
  slot: EquipmentSlot;
  rarity: ItemRarity;
  level: number;
  baseStats: EquipmentBaseStats;
  specialEffects?: string[];
  description: string;
}

// 品质倍率
export const QUALITY_MULTIPLIERS: Record<ItemRarity, number> = {
  [ItemRarity.COMMON]: 1.0,
  [ItemRarity.UNCOMMON]: 1.2,
  [ItemRarity.RARE]: 1.5,
  [ItemRarity.EPIC]: 2.0,
  [ItemRarity.LEGENDARY]: 2.5,
  [ItemRarity.MYTHIC]: 3.0,
};

// 品质颜色
export const RARITY_COLORS: Record<ItemRarity, string> = {
  [ItemRarity.COMMON]: '#9ca3af',
  [ItemRarity.UNCOMMON]: '#22c55e',
  [ItemRarity.RARE]: '#3b82f6',
  [ItemRarity.EPIC]: '#a855f7',
  [ItemRarity.LEGENDARY]: '#f97316',
  [ItemRarity.MYTHIC]: '#ef4444',
};

// 品质名称
export const RARITY_NAMES: Record<ItemRarity, string> = {
  [ItemRarity.COMMON]: '普通',
  [ItemRarity.UNCOMMON]: '优秀',
  [ItemRarity.RARE]: '精良',
  [ItemRarity.EPIC]: '史诗',
  [ItemRarity.LEGENDARY]: '传说',
  [ItemRarity.MYTHIC]: '神话',
};

// 部位基础属性模板
const SLOT_BASE_TEMPLATES: Record<EquipmentSlot, EquipmentBaseStats> = {
  [EquipmentSlot.HEAD]: {
    defense: 2,
    maxHp: 12,
    hitRate: 1,
  },
  [EquipmentSlot.BODY]: {
    defense: 3,
    maxHp: 18,
  },
  [EquipmentSlot.LEGS]: {
    defense: 1,
    maxHp: 8,
    dodgeRate: 1,
  },
  [EquipmentSlot.FEET]: {
    defense: 1,
    maxHp: 6,
    dodgeRate: 2,
  },
  [EquipmentSlot.WEAPON]: {
    attack: 5,
  },
  [EquipmentSlot.ACCESSORY]: {
    maxHp: 4,
    speed: 0.5,
  },
};

// 品质只保留倍率，无附加属性

// 制式装备名称映射
const SLOT_STANDARD_NAMES: Record<EquipmentSlot, string> = {
  [EquipmentSlot.HEAD]: '制式头盔',
  [EquipmentSlot.BODY]: '制式胸甲',
  [EquipmentSlot.LEGS]: '制式腿甲',
  [EquipmentSlot.FEET]: '制式靴子',
  [EquipmentSlot.WEAPON]: '制式利刃',
  [EquipmentSlot.ACCESSORY]: '制式项链',
};

// 生成装备名称
function generateEquipmentName(slot: EquipmentSlot, rarity: ItemRarity, materialIndex: number): string {
  const rarityName = RARITY_NAMES[rarity] || '普通';
  const standardName = SLOT_STANDARD_NAMES[slot] || '装备';
  return `${rarityName}${standardName}`;
}

// 计算装备属性（只应用品质倍率，无等级系数）
function calculateEquipmentStats(
  slot: EquipmentSlot,
  rarity: ItemRarity
): EquipmentBaseStats {
  const baseTemplate = SLOT_BASE_TEMPLATES[slot];
  const qualityMultiplier = QUALITY_MULTIPLIERS[rarity];

  const stats: EquipmentBaseStats = {};

  // 基础属性乘以品质倍率
  Object.entries(baseTemplate).forEach(([key, value]) => {
    if (value !== undefined) {
      // speed 属性保留1位小数，其他属性取整
      if (key === 'speed') {
        (stats as any)[key] = Math.round(value * qualityMultiplier * 10) / 10;
      } else {
        (stats as any)[key] = Math.floor(value * qualityMultiplier);
      }
    }
  });

  return stats;
}

// 生成装备描述（移除百分比符号）
function generateEquipmentDescription(slot: EquipmentSlot, stats: EquipmentBaseStats): string {
  const descriptions: string[] = [];

  if (stats.attack) descriptions.push(`攻击+${stats.attack}`);
  if (stats.defense) descriptions.push(`防御+${stats.defense}`);
  if (stats.maxHp) descriptions.push(`生命+${stats.maxHp}`);
  if (stats.speed) descriptions.push(`攻速+${stats.speed}`);
  if (stats.critRate) descriptions.push(`暴击+${stats.critRate}`);
  if (stats.dodgeRate) descriptions.push(`闪避+${stats.dodgeRate}`);
  if (stats.hitRate) descriptions.push(`命中+${stats.hitRate}`);
  if (stats.penetration) descriptions.push(`穿透+${stats.penetration}`);
  if (stats.damageReduction) descriptions.push(`减伤+${stats.damageReduction}`);
  if (stats.lifeSteal) descriptions.push(`吸血+${stats.lifeSteal}`);

  return descriptions.join('，');
}

// 生成指定部位和品质的装备（移除等级参数）
export function generateEquipment(
  slot: EquipmentSlot,
  rarity: ItemRarity,
  materialIndex: number = 0
): NormalEquipment {
  const id = `eq_${slot}_${rarity}_${materialIndex}`;
  const name = generateEquipmentName(slot, rarity, materialIndex);
  const baseStats = calculateEquipmentStats(slot, rarity);

  return {
    id,
    name,
    slot,
    rarity,
    level: 1,
    baseStats,
    description: generateEquipmentDescription(slot, baseStats),
  };
}

// 生成所有普通装备（按等级分组）
export const NORMAL_EQUIPMENT_BY_LEVEL: Record<number, NormalEquipment[]> = {};

// 等级1-5：普通/优秀品质
for (let level = 1; level <= 5; level++) {
  NORMAL_EQUIPMENT_BY_LEVEL[level] = [];
  Object.values(EquipmentSlot).forEach((slot, index) => {
    NORMAL_EQUIPMENT_BY_LEVEL[level].push(generateEquipment(slot, ItemRarity.COMMON, level, index));
    NORMAL_EQUIPMENT_BY_LEVEL[level].push(generateEquipment(slot, ItemRarity.UNCOMMON, level, index + 6));
  });
}

// 等级6-10：优秀/精良品质
for (let level = 6; level <= 10; level++) {
  NORMAL_EQUIPMENT_BY_LEVEL[level] = [];
  Object.values(EquipmentSlot).forEach((slot, index) => {
    NORMAL_EQUIPMENT_BY_LEVEL[level].push(generateEquipment(slot, ItemRarity.UNCOMMON, level, index));
    NORMAL_EQUIPMENT_BY_LEVEL[level].push(generateEquipment(slot, ItemRarity.RARE, level, index + 6));
  });
}

// 等级11-15：精良/史诗品质
for (let level = 11; level <= 15; level++) {
  NORMAL_EQUIPMENT_BY_LEVEL[level] = [];
  Object.values(EquipmentSlot).forEach((slot, index) => {
    NORMAL_EQUIPMENT_BY_LEVEL[level].push(generateEquipment(slot, ItemRarity.RARE, level, index));
    NORMAL_EQUIPMENT_BY_LEVEL[level].push(generateEquipment(slot, ItemRarity.EPIC, level, index + 6));
  });
}

// 等级16-20：史诗/传说品质
for (let level = 16; level <= 20; level++) {
  NORMAL_EQUIPMENT_BY_LEVEL[level] = [];
  Object.values(EquipmentSlot).forEach((slot, index) => {
    NORMAL_EQUIPMENT_BY_LEVEL[level].push(generateEquipment(slot, ItemRarity.EPIC, level, index));
    NORMAL_EQUIPMENT_BY_LEVEL[level].push(generateEquipment(slot, ItemRarity.LEGENDARY, level, index + 6));
  });
}

// 所有普通装备
export const ALL_NORMAL_EQUIPMENT: NormalEquipment[] = Object.values(NORMAL_EQUIPMENT_BY_LEVEL).flat();

// 按ID获取装备
export function getNormalEquipmentById(id: string): NormalEquipment | undefined {
  return ALL_NORMAL_EQUIPMENT.find(eq => eq.id === id);
}

// 按部位获取装备
export function getNormalEquipmentBySlot(slot: EquipmentSlot): NormalEquipment[] {
  return ALL_NORMAL_EQUIPMENT.filter(eq => eq.slot === slot);
}

// 按等级获取装备
export function getNormalEquipmentByLevel(level: number): NormalEquipment[] {
  return NORMAL_EQUIPMENT_BY_LEVEL[level] || [];
}

// 按品质和部位获取装备
export function getNormalEquipmentByRarityAndSlot(
  rarity: ItemRarity,
  slot: EquipmentSlot
): NormalEquipment[] {
  return ALL_NORMAL_EQUIPMENT.filter(eq => eq.rarity === rarity && eq.slot === slot);
}

// 获取装备强化上限
export function getMaxEnhanceLevel(rarity: ItemRarity): number {
  switch (rarity) {
    case ItemRarity.COMMON: return 10;
    case ItemRarity.UNCOMMON: return 12;
    case ItemRarity.RARE: return 15;
    case ItemRarity.EPIC: return 18;
    case ItemRarity.LEGENDARY: return 20;
    case ItemRarity.MYTHIC: return 25;
    default: return 10;
  }
}

// 导出装备槽位名称
export const SLOT_NAMES: Record<EquipmentSlot, string> = {
  [EquipmentSlot.HEAD]: '头盔',
  [EquipmentSlot.BODY]: '胸甲',
  [EquipmentSlot.LEGS]: '护腿',
  [EquipmentSlot.FEET]: '战靴',
  [EquipmentSlot.WEAPON]: '武器',
  [EquipmentSlot.ACCESSORY]: '饰品',
};

// 导出装备槽位图标
export const SLOT_ICONS: Record<EquipmentSlot, string> = {
  [EquipmentSlot.HEAD]: '🪖',
  [EquipmentSlot.BODY]: '🦺',
  [EquipmentSlot.LEGS]: '👖',
  [EquipmentSlot.FEET]: '👢',
  [EquipmentSlot.WEAPON]: '⚔️',
  [EquipmentSlot.ACCESSORY]: '💍',
};
