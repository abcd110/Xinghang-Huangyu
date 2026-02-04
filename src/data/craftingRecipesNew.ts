// ============================================
// 新制造配方 - 基于材料品质决定装备品质
// 移除等级系统，只保留6部位装备
// ============================================

import { RecipeCategory, type RecipeData } from './craftingTypes';
import { EquipmentSlot } from './equipmentTypes';
import { MaterialQuality, CraftingMaterialType, generateMaterialId } from './craftingMaterials';
import { ItemRarity } from './types';

// 制造品质概率表
// 根据使用的最高品质材料决定最终装备品质
export const CRAFTING_QUALITY_RATES: Record<MaterialQuality, Record<ItemRarity, number>> = {
  [MaterialQuality.NORMAL]: {
    [ItemRarity.COMMON]: 0.50,
    [ItemRarity.UNCOMMON]: 0.30,
    [ItemRarity.RARE]: 0.15,
    [ItemRarity.EPIC]: 0.04,
    [ItemRarity.LEGENDARY]: 0.01,
    [ItemRarity.MYTHIC]: 0,
  },
  [MaterialQuality.GOOD]: {
    [ItemRarity.COMMON]: 0.30,
    [ItemRarity.UNCOMMON]: 0.40,
    [ItemRarity.RARE]: 0.20,
    [ItemRarity.EPIC]: 0.08,
    [ItemRarity.LEGENDARY]: 0.02,
    [ItemRarity.MYTHIC]: 0,
  },
  [MaterialQuality.FINE]: {
    [ItemRarity.COMMON]: 0.15,
    [ItemRarity.UNCOMMON]: 0.30,
    [ItemRarity.RARE]: 0.35,
    [ItemRarity.EPIC]: 0.15,
    [ItemRarity.LEGENDARY]: 0.05,
    [ItemRarity.MYTHIC]: 0,
  },
  [MaterialQuality.RARE]: {
    [ItemRarity.COMMON]: 0.05,
    [ItemRarity.UNCOMMON]: 0.15,
    [ItemRarity.RARE]: 0.30,
    [ItemRarity.EPIC]: 0.35,
    [ItemRarity.LEGENDARY]: 0.15,
    [ItemRarity.MYTHIC]: 0,
  },
  [MaterialQuality.LEGENDARY]: {
    [ItemRarity.COMMON]: 0,
    [ItemRarity.UNCOMMON]: 0.05,
    [ItemRarity.RARE]: 0.20,
    [ItemRarity.EPIC]: 0.35,
    [ItemRarity.LEGENDARY]: 0.40,
    [ItemRarity.MYTHIC]: 0,
  },
};

// 部位对应的主材料类型
export const SLOT_PRIMARY_MATERIALS: Record<EquipmentSlot, CraftingMaterialType> = {
  [EquipmentSlot.HEAD]: CraftingMaterialType.IRON,
  [EquipmentSlot.BODY]: CraftingMaterialType.IRON,
  [EquipmentSlot.LEGS]: CraftingMaterialType.LEATHER,
  [EquipmentSlot.FEET]: CraftingMaterialType.LEATHER,
  [EquipmentSlot.WEAPON]: CraftingMaterialType.IRON,
  [EquipmentSlot.ACCESSORY]: CraftingMaterialType.CRYSTAL,
};

// 部位对应的次要材料类型
export const SLOT_SECONDARY_MATERIALS: Record<EquipmentSlot, CraftingMaterialType> = {
  [EquipmentSlot.HEAD]: CraftingMaterialType.CRYSTAL,
  [EquipmentSlot.BODY]: CraftingMaterialType.FABRIC,
  [EquipmentSlot.LEGS]: CraftingMaterialType.FABRIC,
  [EquipmentSlot.FEET]: CraftingMaterialType.WOOD,
  [EquipmentSlot.WEAPON]: CraftingMaterialType.WOOD,
  [EquipmentSlot.ACCESSORY]: CraftingMaterialType.ESSENCE,
};

// 部位名称
export const SLOT_CRAFT_NAMES: Record<EquipmentSlot, string> = {
  [EquipmentSlot.HEAD]: '头盔',
  [EquipmentSlot.BODY]: '胸甲',
  [EquipmentSlot.LEGS]: '护腿',
  [EquipmentSlot.FEET]: '战靴',
  [EquipmentSlot.WEAPON]: '武器',
  [EquipmentSlot.ACCESSORY]: '饰品',
};

// 基础材料消耗数量
const BASE_MATERIAL_COST = 5;
const SECONDARY_MATERIAL_COST = 3;

// 生成配方（每个部位一个配方，材料品质由玩家选择）
export interface CraftingRecipe {
  id: string;
  slot: EquipmentSlot;
  name: string;
  description: string;
  // 基础材料需求（玩家选择品质）
  baseMaterialType: CraftingMaterialType;
  baseMaterialCost: number;
  // 次要材料需求（玩家选择品质）
  secondaryMaterialType: CraftingMaterialType;
  secondaryMaterialCost: number;
  // 固定消耗
  staminaCost: number;
}

// 生成所有配方（6个部位）
export const CRAFTING_RECIPES: CraftingRecipe[] = Object.values(EquipmentSlot).map(slot => ({
  id: `craft_${slot}`,
  slot,
  name: `制造${SLOT_CRAFT_NAMES[slot]}`,
  description: `使用材料制造${SLOT_CRAFT_NAMES[slot]}，品质取决于材料`,
  baseMaterialType: SLOT_PRIMARY_MATERIALS[slot],
  baseMaterialCost: BASE_MATERIAL_COST,
  secondaryMaterialType: SLOT_SECONDARY_MATERIALS[slot],
  secondaryMaterialCost: SECONDARY_MATERIAL_COST,
  staminaCost: 10,
}));

// 获取配方
export function getRecipe(slot: EquipmentSlot): CraftingRecipe | undefined {
  return CRAFTING_RECIPES.find(r => r.slot === slot);
}

// 计算加权平均材料品质（主材料权重2，副材料权重1）
export function calculateWeightedMaterialQuality(
  baseMaterialQuality: MaterialQuality,
  secondaryMaterialQuality: MaterialQuality
): MaterialQuality {
  // 权重比 2:1
  const weightedQuality = (baseMaterialQuality * 2 + secondaryMaterialQuality * 1) / 3;
  // 四舍五入到最近的品质等级
  const roundedQuality = Math.round(weightedQuality);
  // 确保在有效范围内
  return Math.max(1, Math.min(5, roundedQuality)) as MaterialQuality;
}

// 计算品质概率（基于加权平均品质）
export function calculateCraftingQuality(
  baseMaterialQuality: MaterialQuality,
  secondaryMaterialQuality: MaterialQuality
): Record<ItemRarity, number> {
  const weightedQuality = calculateWeightedMaterialQuality(baseMaterialQuality, secondaryMaterialQuality);
  return CRAFTING_QUALITY_RATES[weightedQuality];
}

// 根据概率随机选择品质（基于加权平均品质）
export function rollCraftingQuality(
  baseMaterialQuality: MaterialQuality,
  secondaryMaterialQuality: MaterialQuality
): ItemRarity {
  const weightedQuality = calculateWeightedMaterialQuality(baseMaterialQuality, secondaryMaterialQuality);
  const rates = CRAFTING_QUALITY_RATES[weightedQuality];
  const roll = Math.random();
  let cumulative = 0;

  for (const [rarity, rate] of Object.entries(rates)) {
    cumulative += rate;
    if (roll <= cumulative) {
      return rarity as ItemRarity;
    }
  }

  return ItemRarity.COMMON;
}

// 获取材料品质
export function getMaterialQualityFromId(materialId: string): MaterialQuality {
  if (materialId.includes('传说')) return MaterialQuality.LEGENDARY;
  if (materialId.includes('稀有')) return MaterialQuality.RARE;
  if (materialId.includes('精良')) return MaterialQuality.FINE;
  if (materialId.includes('优质')) return MaterialQuality.GOOD;
  return MaterialQuality.NORMAL;
}
