import { ItemType, ItemRarity } from '../data/types';

// ============================================
// 分解系统配置 - 简化版
// ============================================

// 分解产出配置
export interface DecomposeReward {
  materialId: string;
  quantity: number;
}

// 材料名称映射
export const MATERIAL_NAMES: Record<string, string> = {
  'mat_refined_fragment': '精炼碎片',
  'mat_mythic_fragment': '神话碎片',
};

// 品质名称映射
export const RARITY_NAMES: Record<ItemRarity, string> = {
  [ItemRarity.COMMON]: '普通',
  [ItemRarity.UNCOMMON]: '优秀',
  [ItemRarity.RARE]: '稀有',
  [ItemRarity.EPIC]: '史诗',
  [ItemRarity.LEGENDARY]: '传说',
  [ItemRarity.MYTHIC]: '神话',
};

// ============================================
// 分解奖励计算 - 简化版
// ============================================

/**
 * 计算装备分解奖励
 * 规则：
 * - 普通装备（非神话）-> 精炼碎片，数量 = 品质等级 (1-5)
 * - 神话装备 -> 神话碎片，数量 = 品质等级 (1-6)
 * @param rarity 装备品质
 * @returns 分解奖励
 */
export function calculateDecomposeReward(rarity: ItemRarity): DecomposeReward | null {
  const rarityLevel = getRarityLevel(rarity);

  if (rarity === ItemRarity.MYTHIC) {
    // 神话装备 -> 神话碎片
    return {
      materialId: 'mat_mythic_fragment',
      quantity: rarityLevel, // 1-6个
    };
  } else {
    // 普通装备 -> 精炼碎片
    return {
      materialId: 'mat_refined_fragment',
      quantity: rarityLevel, // 1-5个
    };
  }
}

/**
 * 获取品质等级
 */
function getRarityLevel(rarity: ItemRarity): number {
  switch (rarity) {
    case ItemRarity.COMMON: return 1;
    case ItemRarity.UNCOMMON: return 2;
    case ItemRarity.RARE: return 3;
    case ItemRarity.EPIC: return 4;
    case ItemRarity.LEGENDARY: return 5;
    case ItemRarity.MYTHIC: return 6;
    default: return 1;
  }
}

/**
 * 获取分解预览
 * @param itemType 物品类型
 * @param rarity 物品品质
 * @param itemName 物品名称
 * @returns 分解预览信息
 */
export function getDecomposePreview(
  itemType: ItemType,
  rarity: ItemRarity,
  itemName: string
): {
  canDecompose: boolean;
  itemName: string;
  rarity: string;
  isMythic: boolean;
  reward: {
    materialId: string;
    name: string;
    quantity: number;
    icon: string;
  } | null;
  message: string;
} {
  // 检查是否可以分解
  const canDecomposeTypes = [ItemType.WEAPON, ItemType.ARMOR, ItemType.ACCESSORY];
  if (!canDecomposeTypes.includes(itemType)) {
    return {
      canDecompose: false,
      itemName,
      rarity: RARITY_NAMES[rarity],
      isMythic: rarity === ItemRarity.MYTHIC,
      reward: null,
      message: '该物品类型无法分解',
    };
  }

  // 计算分解奖励
  const reward = calculateDecomposeReward(rarity);

  if (!reward) {
    return {
      canDecompose: false,
      itemName,
      rarity: RARITY_NAMES[rarity],
      isMythic: rarity === ItemRarity.MYTHIC,
      reward: null,
      message: '无法计算分解奖励',
    };
  }

  const materialName = MATERIAL_NAMES[reward.materialId] || reward.materialId;
  const isMythic = rarity === ItemRarity.MYTHIC;
  const icon = isMythic ? '🔴' : '🔷';

  return {
    canDecompose: true,
    itemName,
    rarity: RARITY_NAMES[rarity],
    isMythic,
    reward: {
      materialId: reward.materialId,
      name: materialName,
      quantity: reward.quantity,
      icon,
    },
    message: `分解后可获得 ${materialName} x${reward.quantity}`,
  };
}

/**
 * 执行分解
 * @param itemType 物品类型
 * @param rarity 物品品质
 * @returns 分解结果
 */
export function decompose(
  itemType: ItemType,
  rarity: ItemRarity
): {
  success: boolean;
  reward: {
    materialId: string;
    name: string;
    quantity: number;
  } | null;
  message: string;
} {
  // 检查是否可以分解
  const canDecomposeTypes = [ItemType.WEAPON, ItemType.ARMOR, ItemType.ACCESSORY];
  if (!canDecomposeTypes.includes(itemType)) {
    return {
      success: false,
      reward: null,
      message: '该物品类型无法分解',
    };
  }

  // 计算分解奖励
  const reward = calculateDecomposeReward(rarity);

  if (!reward) {
    return {
      success: false,
      reward: null,
      message: '分解失败：无法计算奖励',
    };
  }

  const materialName = MATERIAL_NAMES[reward.materialId] || reward.materialId;

  return {
    success: true,
    reward: {
      materialId: reward.materialId,
      name: materialName,
      quantity: reward.quantity,
    },
    message: `分解成功！获得 ${materialName} x${reward.quantity}`,
  };
}

// ============================================
// 旧版配置（兼容用）
// ============================================

export interface DecomposeRewardLegacy {
  materialId: string;
  min: number;
  max: number;
  chance: number;
}

// 根据稀有度的分解奖励（旧版，保留兼容）
export const DECOMPOSE_REWARDS: Record<ItemRarity, DecomposeRewardLegacy[]> = {
  [ItemRarity.COMMON]: [
    { materialId: 'mat_refined_fragment', min: 1, max: 1, chance: 1.0 },
  ],
  [ItemRarity.UNCOMMON]: [
    { materialId: 'mat_refined_fragment', min: 2, max: 2, chance: 1.0 },
  ],
  [ItemRarity.RARE]: [
    { materialId: 'mat_refined_fragment', min: 3, max: 3, chance: 1.0 },
  ],
  [ItemRarity.EPIC]: [
    { materialId: 'mat_refined_fragment', min: 4, max: 4, chance: 1.0 },
  ],
  [ItemRarity.LEGENDARY]: [
    { materialId: 'mat_refined_fragment', min: 5, max: 5, chance: 1.0 },
  ],
  [ItemRarity.MYTHIC]: [
    { materialId: 'mat_mythic_fragment', min: 6, max: 6, chance: 1.0 },
  ],
};

// 升华等级加成倍率（已废弃，保留兼容）
export const SUBLIMATION_BONUS: Record<number, number> = {
  0: 1.0, 1: 1.0, 2: 1.0, 3: 1.0, 4: 1.0, 5: 1.0,
  6: 1.0, 7: 1.0, 8: 1.0, 9: 1.0, 10: 1.0,
};

// 装备类型额外奖励（已废弃，保留兼容）
export const TYPE_BONUS: Record<ItemType, Record<string, [number, number]>> = {
  [ItemType.WEAPON]: {},
  [ItemType.ARMOR]: {},
  [ItemType.ACCESSORY]: {},
  [ItemType.CONSUMABLE]: {},
  [ItemType.MATERIAL]: {},
  [ItemType.SPECIAL]: {},
  [ItemType.SKILL_BOOK]: {},
};

// ============================================
// 类型定义
// ============================================

export interface DecomposePreview {
  canDecompose: boolean;
  itemName: string;
  rarity: string;
  isMythic: boolean;
  reward: {
    materialId: string;
    name: string;
    quantity: number;
    icon: string;
  } | null;
  message: string;
}

export interface DecomposeResult {
  success: boolean;
  message: string;
  reward: {
    materialId: string;
    name: string;
    quantity: number;
  } | null;
}
