// ============================================
// 制造材料定义 - 新装备系统
// 6种基础材料，支持5种品质等级
// ============================================

import { ItemRarity } from './types';

// 材料品质等级
export enum MaterialQuality {
  NORMAL = 1,    // 普通
  GOOD = 2,      // 优质
  FINE = 3,      // 精良
  RARE = 4,      // 稀有
  LEGENDARY = 5, // 传说
}

// 材料品质名称
export const MATERIAL_QUALITY_NAMES: Record<MaterialQuality, string> = {
  [MaterialQuality.NORMAL]: '普通',
  [MaterialQuality.GOOD]: '优质',
  [MaterialQuality.FINE]: '精良',
  [MaterialQuality.RARE]: '稀有',
  [MaterialQuality.LEGENDARY]: '传说',
};

// 基础材料类型
export enum CraftingMaterialType {
  IRON = 'iron',       // 铁矿碎片
  LEATHER = 'leather', // 野兽皮革
  FABRIC = 'fabric',   // 粗布纤维
  WOOD = 'wood',       // 坚韧木材
  CRYSTAL = 'crystal', // 能量水晶
  ESSENCE = 'essence', // 怪物精华
}

// 基础材料定义
export interface CraftingMaterial {
  id: string;
  name: string;
  icon: string;
  type: CraftingMaterialType;
  quality: MaterialQuality;
  description: string;
  source: string; // 掉落来源
}

// 生成材料ID
export function generateMaterialId(type: CraftingMaterialType, quality: MaterialQuality): string {
  const qualityPrefix = quality === MaterialQuality.NORMAL ? '' : `${MATERIAL_QUALITY_NAMES[quality]}`;
  return `craft_${qualityPrefix}${type}`.toLowerCase();
}

// 基础材料模板
const MATERIAL_TEMPLATES: Record<CraftingMaterialType, Omit<CraftingMaterial, 'id' | 'quality'>> = {
  [CraftingMaterialType.IRON]: {
    name: '铁矿碎片',
    icon: '⛏️',
    type: CraftingMaterialType.IRON,
    description: '从废弃矿脉中采集的铁矿碎片，制造装备的基础材料',
    source: '站台1-10',
  },
  [CraftingMaterialType.LEATHER]: {
    name: '野兽皮革',
    icon: '🦌',
    type: CraftingMaterialType.LEATHER,
    description: '荒原野兽的皮革，坚韧耐用',
    source: '站台1-10',
  },
  [CraftingMaterialType.FABRIC]: {
    name: '粗布纤维',
    icon: '🧵',
    type: CraftingMaterialType.FABRIC,
    description: '废弃布料拆解而成的纤维，可用于制作防具',
    source: '站台1-10',
  },
  [CraftingMaterialType.WOOD]: {
    name: '坚韧木材',
    icon: '🌲',
    type: CraftingMaterialType.WOOD,
    description: '荒原上生长的坚韧木材，适合制作武器和靴柄',
    source: '站台1-10',
  },
  [CraftingMaterialType.CRYSTAL]: {
    name: '能量水晶',
    icon: '💎',
    type: CraftingMaterialType.CRYSTAL,
    description: '蕴含神秘能量的水晶，可提升装备品质',
    source: '站台5-10',
  },
  [CraftingMaterialType.ESSENCE]: {
    name: '怪物精华',
    icon: '👾',
    type: CraftingMaterialType.ESSENCE,
    description: '从变异怪物体内提取的精华，用于制造高级装备',
    source: '站台5-10',
  },
};

// 生成所有品质的材料
export const ALL_CRAFTING_MATERIALS: CraftingMaterial[] = [];

Object.values(CraftingMaterialType).forEach(type => {
  Object.values(MaterialQuality).forEach(quality => {
    if (typeof quality === 'number') {
      const template = MATERIAL_TEMPLATES[type];
      const qualityName = MATERIAL_QUALITY_NAMES[quality as MaterialQuality];
      const name = quality === MaterialQuality.NORMAL 
        ? template.name 
        : `${qualityName}${template.name}`;
      
      ALL_CRAFTING_MATERIALS.push({
        id: generateMaterialId(type, quality as MaterialQuality),
        name,
        icon: template.icon,
        type,
        quality: quality as MaterialQuality,
        description: template.description,
        source: template.source,
      });
    }
  });
});

// 按ID获取材料
export function getMaterialById(id: string): CraftingMaterial | undefined {
  return ALL_CRAFTING_MATERIALS.find(m => m.id === id);
}

// 按类型和品质获取材料
export function getMaterial(type: CraftingMaterialType, quality: MaterialQuality): CraftingMaterial | undefined {
  return getMaterialById(generateMaterialId(type, quality));
}

// 获取材料的基础ID（不带品质前缀）
export function getBaseMaterialId(materialId: string): string {
  // 移除品质前缀
  for (const qualityName of Object.values(MATERIAL_QUALITY_NAMES)) {
    if (materialId.includes(qualityName)) {
      return materialId.replace(qualityName, '');
    }
  }
  return materialId;
}

// 获取材料的品质等级
export function getMaterialQuality(materialId: string): MaterialQuality {
  for (const [quality, name] of Object.entries(MATERIAL_QUALITY_NAMES)) {
    if (materialId.includes(name) && quality !== '1') {
      return parseInt(quality) as MaterialQuality;
    }
  }
  return MaterialQuality.NORMAL;
}

// 材料品质对应的颜色
export const MATERIAL_QUALITY_COLORS: Record<MaterialQuality, string> = {
  [MaterialQuality.NORMAL]: '#9ca3af',    // 灰色
  [MaterialQuality.GOOD]: '#22c55e',      // 绿色
  [MaterialQuality.FINE]: '#3b82f6',      // 蓝色
  [MaterialQuality.RARE]: '#a855f7',      // 紫色
  [MaterialQuality.LEGENDARY]: '#f97316', // 橙色
};

// 材料品质对应的装备品质
export function materialQualityToItemRarity(quality: MaterialQuality): ItemRarity {
  switch (quality) {
    case MaterialQuality.NORMAL: return ItemRarity.COMMON;
    case MaterialQuality.GOOD: return ItemRarity.UNCOMMON;
    case MaterialQuality.FINE: return ItemRarity.RARE;
    case MaterialQuality.RARE: return ItemRarity.EPIC;
    case MaterialQuality.LEGENDARY: return ItemRarity.LEGENDARY;
    default: return ItemRarity.COMMON;
  }
}

// 材料掉落配置
export interface MaterialDropConfig {
  materialId: string;
  minQuantity: number;
  maxQuantity: number;
  dropRate: number; // 0-1
}

// 站台材料掉落表
export const STATION_MATERIAL_DROPS: Record<number, MaterialDropConfig[]> = {
  // 站台1-4：基础材料
  1: [
    { materialId: 'craft_iron', minQuantity: 2, maxQuantity: 3, dropRate: 1.0 },
    { materialId: 'craft_leather', minQuantity: 1, maxQuantity: 2, dropRate: 0.6 },
  ],
  2: [
    { materialId: 'craft_leather', minQuantity: 2, maxQuantity: 3, dropRate: 1.0 },
    { materialId: 'craft_fabric', minQuantity: 1, maxQuantity: 2, dropRate: 0.6 },
  ],
  3: [
    { materialId: 'craft_fabric', minQuantity: 2, maxQuantity: 3, dropRate: 1.0 },
    { materialId: 'craft_wood', minQuantity: 1, maxQuantity: 2, dropRate: 0.6 },
  ],
  4: [
    { materialId: 'craft_wood', minQuantity: 2, maxQuantity: 3, dropRate: 1.0 },
    { materialId: 'craft_iron', minQuantity: 1, maxQuantity: 2, dropRate: 0.6 },
  ],
  // 站台5-8：进阶材料
  5: [
    { materialId: 'craft_iron', minQuantity: 3, maxQuantity: 4, dropRate: 1.0 },
    { materialId: 'craft_crystal', minQuantity: 1, maxQuantity: 1, dropRate: 0.5 },
    { materialId: 'craft_essence', minQuantity: 1, maxQuantity: 1, dropRate: 0.3 },
    { materialId: 'craft_goodiron', minQuantity: 1, maxQuantity: 1, dropRate: 0.3 },
  ],
  6: [
    { materialId: 'craft_leather', minQuantity: 3, maxQuantity: 4, dropRate: 1.0 },
    { materialId: 'craft_crystal', minQuantity: 1, maxQuantity: 1, dropRate: 0.5 },
    { materialId: 'craft_essence', minQuantity: 1, maxQuantity: 1, dropRate: 0.3 },
    { materialId: 'craft_goodleather', minQuantity: 1, maxQuantity: 1, dropRate: 0.3 },
  ],
  7: [
    { materialId: 'craft_fabric', minQuantity: 3, maxQuantity: 4, dropRate: 1.0 },
    { materialId: 'craft_crystal', minQuantity: 1, maxQuantity: 2, dropRate: 0.6 },
    { materialId: 'craft_essence', minQuantity: 1, maxQuantity: 1, dropRate: 0.3 },
    { materialId: 'craft_goodfabric', minQuantity: 1, maxQuantity: 1, dropRate: 0.3 },
  ],
  8: [
    { materialId: 'craft_wood', minQuantity: 3, maxQuantity: 4, dropRate: 1.0 },
    { materialId: 'craft_crystal', minQuantity: 1, maxQuantity: 2, dropRate: 0.6 },
    { materialId: 'craft_essence', minQuantity: 1, maxQuantity: 1, dropRate: 0.3 },
    { materialId: 'craft_goodwood', minQuantity: 1, maxQuantity: 1, dropRate: 0.3 },
  ],
  // 站台9-10：高级材料
  9: [
    { materialId: 'craft_crystal', minQuantity: 2, maxQuantity: 3, dropRate: 1.0 },
    { materialId: 'craft_essence', minQuantity: 1, maxQuantity: 2, dropRate: 0.6 },
    { materialId: 'craft_goodcrystal', minQuantity: 1, maxQuantity: 1, dropRate: 0.3 },
    { materialId: 'craft_fineiron', minQuantity: 1, maxQuantity: 1, dropRate: 0.15 },
  ],
  10: [
    { materialId: 'craft_crystal', minQuantity: 3, maxQuantity: 4, dropRate: 1.0 },
    { materialId: 'craft_essence', minQuantity: 2, maxQuantity: 3, dropRate: 0.7 },
    { materialId: 'craft_goodessence', minQuantity: 1, maxQuantity: 2, dropRate: 0.4 },
    { materialId: 'craft_finecrystal', minQuantity: 1, maxQuantity: 1, dropRate: 0.2 },
    { materialId: 'craft_rareiron', minQuantity: 1, maxQuantity: 1, dropRate: 0.05 },
  ],
};
