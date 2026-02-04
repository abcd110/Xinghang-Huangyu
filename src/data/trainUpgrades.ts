// ============================================
// 列车升级系统配置 - 材料+列车币消耗
// ============================================

import { TrainUpgradeType } from '../core/Train';

// 升级材料需求配置
export interface MaterialRequirement {
  itemId: string;
  name: string;
  quantity: number;
}

export interface TrainUpgradeConfig {
  type: TrainUpgradeType;
  name: string;
  icon: string;
  description: string;
  baseCoinCost: number;
  coinCostMultiplier: number;
  materials: MaterialRequirement[];
}

// 车厢扩容升级 - 需要机械类材料
export const CAPACITY_UPGRADE_CONFIG: TrainUpgradeConfig = {
  type: TrainUpgradeType.CAPACITY,
  name: '车厢扩容',
  icon: '📦',
  description: '增加背包容量，可携带更多物资',
  baseCoinCost: 30,
  coinCostMultiplier: 20,
  materials: [
    { itemId: 'mat_scrap_parts', name: '废弃零件', quantity: 3 },
    { itemId: 'mat_scrap_screw', name: '废弃螺丝', quantity: 2 },
  ],
};

// 强化装甲升级 - 需要金属类材料
export const ARMOR_UPGRADE_CONFIG: TrainUpgradeConfig = {
  type: TrainUpgradeType.ARMOR,
  name: '强化装甲',
  icon: '🛡️',
  description: '提升列车耐久上限，增强防御能力',
  baseCoinCost: 30,
  coinCostMultiplier: 20,
  materials: [
    { itemId: 'mat_scrap_metal', name: '废弃金属', quantity: 3 },
    { itemId: 'mat_rusty_metal_sheet', name: '锈蚀金属片', quantity: 2 },
  ],
};

// 动力升级 - 需要机械核心类材料
export const SPEED_UPGRADE_CONFIG: TrainUpgradeConfig = {
  type: TrainUpgradeType.SPEED,
  name: '动力升级',
  icon: '⚡',
  description: '提升列车速度，减少探索时间',
  baseCoinCost: 40,
  coinCostMultiplier: 25,
  materials: [
    { itemId: 'mat_machine_oil', name: '机油', quantity: 2 },
    { itemId: 'mat_scrap_parts', name: '废弃零件', quantity: 2 },
  ],
};

// 生活设施升级 - 需要高级材料
export const FACILITY_UPGRADE_CONFIG: TrainUpgradeConfig = {
  type: TrainUpgradeType.FACILITY,
  name: '生活设施',
  icon: '🏠',
  description: '解锁特殊功能车厢（蓄水/种植/冷藏/发酵）',
  baseCoinCost: 50,
  coinCostMultiplier: 50,
  materials: [
    { itemId: 'mat_pipe_fragment', name: '水管碎片', quantity: 2 },
    { itemId: 'mat_station_board', name: '驿站木板', quantity: 2 },
    { itemId: 'mat_sentry_parts', name: '哨兵零件', quantity: 1 },
  ],
};

// 所有升级配置映射
export const TRAIN_UPGRADE_CONFIGS: Record<TrainUpgradeType, TrainUpgradeConfig> = {
  [TrainUpgradeType.CAPACITY]: CAPACITY_UPGRADE_CONFIG,
  [TrainUpgradeType.ARMOR]: ARMOR_UPGRADE_CONFIG,
  [TrainUpgradeType.SPEED]: SPEED_UPGRADE_CONFIG,
  [TrainUpgradeType.FACILITY]: FACILITY_UPGRADE_CONFIG,
};

// 获取升级所需材料（随等级增加）
export function getUpgradeMaterials(
  type: TrainUpgradeType,
  currentLevel: number
): MaterialRequirement[] {
  const config = TRAIN_UPGRADE_CONFIGS[type];
  const multiplier = 1 + Math.floor(currentLevel / 3); // 每3级材料需求增加

  return config.materials.map(mat => ({
    ...mat,
    quantity: mat.quantity * multiplier,
  }));
}

// 获取升级所需列车币
export function getUpgradeCoinCost(
  type: TrainUpgradeType,
  currentLevel: number
): number {
  const config = TRAIN_UPGRADE_CONFIGS[type];
  return config.baseCoinCost + currentLevel * config.coinCostMultiplier;
}

// 获取升级信息
export function getTrainUpgradeInfo(
  type: TrainUpgradeType,
  currentLevel: number
) {
  const config = TRAIN_UPGRADE_CONFIGS[type];
  const coinCost = getUpgradeCoinCost(type, currentLevel);
  const materials = getUpgradeMaterials(type, currentLevel);

  return {
    ...config,
    coinCost,
    materials,
    currentLevel,
  };
}

// 设施名称映射
export const FACILITY_NAMES = ['无', '蓄水车厢', '种植车厢', '冷藏车厢', '发酵车厢'];

// 获取设施名称
export function getFacilityName(level: number): string {
  return FACILITY_NAMES[Math.min(level, FACILITY_NAMES.length - 1)] || '已满级';
}
