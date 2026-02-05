import type { InventoryItem } from '../data/types';
import { ItemType, ItemRarity } from '../data/types';
import type { EquipmentInstance } from './EquipmentSystem';

// 强化等级配置
export interface EnhanceLevelConfig {
  level: number;
  successRate: number; // 成功率 (0-1)
  stoneCost: number; // 强化石消耗
  goldCost: number; // 金币消耗（已废弃，保持为0）
  failureDowngrade: boolean; // 失败是否降级
}

// 强化成功率 (%)
export const ENHANCE_SUCCESS_RATES = [
  100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5
];

// 强化石需求
export const ENHANCE_STONE_COST = [
  1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10
];

// 属性提升比例（每次成功提升装备基础属性的10%）
export const ENHANCE_ATTRIBUTE_BOOST = 0.10; // 10%

// 生成强化配置表
function generateEnhanceConfig(): Record<number, EnhanceLevelConfig> {
  const config: Record<number, EnhanceLevelConfig> = {};
  for (let i = 0; i < ENHANCE_SUCCESS_RATES.length; i++) {
    config[i] = {
      level: i,
      successRate: ENHANCE_SUCCESS_RATES[i] / 100,
      stoneCost: ENHANCE_STONE_COST[i],
      goldCost: 0, // 不再需要金币
      failureDowngrade: i >= 5, // +5以上失败降级
    };
  }
  return config;
}

export const ENHANCE_CONFIG = generateEnhanceConfig();

// 最大强化等级
export const MAX_ENHANCE_LEVEL = 20;

// 强化石道具ID
export const ENHANCE_STONE_ID = 'mat_enhance_stone';

// 保护符道具ID
export const PROTECTION_ITEM_ID = 'spe_003';

// 材料名称映射
export const MATERIAL_NAMES: Record<string, string> = {
  [ENHANCE_STONE_ID]: '强化石',
  spe_003: '强化保护符',
};

// 强化结果类型
export enum EnhanceResultType {
  SUCCESS = 'success',
  FAILURE = 'failure',
  FAILURE_DOWNGRADE = 'failure_downgrade',
}

// 强化结果
export interface EnhanceResult {
  type: EnhanceResultType;
  success: boolean;
  message: string;
  previousLevel: number;
  currentLevel: number;
  consumedStones: number;
  consumedGold: number;
  usedProtection: boolean;
  attributeGains?: {
    attack?: number;
    defense?: number;
    speed?: number;
    maxHp?: number;
    dodge?: number;
    hit?: number;
  };
}

// 强化预览
export interface EnhancePreview {
  canEnhance: boolean;
  reason?: string;
  currentLevel: number;
  targetLevel: number;
  successRate: number;
  stoneCost: number;
  hasEnoughStones: boolean;
  goldCost: number;
  hasEnoughGold: boolean;
  failureDowngrade: boolean;
  attributePreview: {
    attack: { current: number; after: number };
    defense: { current: number; after: number };
    speed: { current: number; after: number };
    maxHp: { current: number; after: number };
    dodge: { current: number; after: number };
    hit: { current: number; after: number };
  };
}

// 获取强化配置
export function getEnhanceConfig(level: number): EnhanceLevelConfig | null {
  return ENHANCE_CONFIG[level] || null;
}

// 计算强化成功率
export function calculateEnhanceRate(currentLevel: number): number {
  const config = getEnhanceConfig(currentLevel);
  return config ? config.successRate : 0;
}

// 计算强化石需求
export function calculateStoneCost(currentLevel: number): number {
  const config = getEnhanceConfig(currentLevel);
  return config ? config.stoneCost : 0;
}

// 检查装备是否可以强化
export function canEnhance(equipment: { enhanceLevel?: number }): boolean {
  const level = equipment.enhanceLevel || 0;
  return level < MAX_ENHANCE_LEVEL;
}

// 获取强化成功率
export function getSuccessRate(currentLevel: number): number {
  const config = getEnhanceConfig(currentLevel);
  return config ? config.successRate : 0;
}

// 计算装备的基础属性（不含强化加成）
function getBaseEquipmentStats(equipment: EquipmentInstance): {
  attack: number;
  defense: number;
  speed: number;
  maxHp: number;
} {
  const level = equipment.enhanceLevel || 0;
  // 基础属性 = 当前属性 / (1 + 提升比例)^等级
  const boostMultiplier = Math.pow(1 + ENHANCE_ATTRIBUTE_BOOST, level);
  return {
    attack: Math.round((equipment.attack || 0) / boostMultiplier),
    defense: Math.round((equipment.defense || 0) / boostMultiplier),
    speed: Math.round((equipment.speed || 0) / boostMultiplier),
    maxHp: Math.round((equipment.maxHp || 0) / boostMultiplier),
  };
}

// 计算强化后的属性
function calculateEnhancedStats(
  baseStats: { attack: number; defense: number; speed: number; maxHp: number },
  targetLevel: number
): { attack: number; defense: number; speed: number; maxHp: number } {
  const boostMultiplier = Math.pow(1 + ENHANCE_ATTRIBUTE_BOOST, targetLevel);
  return {
    attack: Math.round(baseStats.attack * boostMultiplier),
    defense: Math.round(baseStats.defense * boostMultiplier),
    speed: Math.round(baseStats.speed * boostMultiplier),
    maxHp: Math.round(baseStats.maxHp * boostMultiplier),
  };
}

// 强化系统类
export class EnhanceSystem {
  private inventory: any;
  private player: any;

  constructor(inventory: any, player: any) {
    this.inventory = inventory;
    this.player = player;
  }

  // 获取强化预览
  getEnhancePreview(equipment: EquipmentInstance): EnhancePreview {
    const currentLevel = equipment.enhanceLevel || 0;
    const config = getEnhanceConfig(currentLevel);

    if (!config) {
      return {
        canEnhance: false,
        reason: '已达到最大强化等级',
        currentLevel,
        targetLevel: currentLevel,
        successRate: 0,
        stoneCost: 0,
        hasEnoughStones: false,
        goldCost: 0,
        hasEnoughGold: true,
        failureDowngrade: false,
        attributePreview: {
          attack: { current: equipment.attack || 0, after: equipment.attack || 0 },
          defense: { current: equipment.defense || 0, after: equipment.defense || 0 },
          speed: { current: equipment.speed || 0, after: equipment.speed || 0 },
          maxHp: { current: equipment.maxHp || 0, after: equipment.maxHp || 0 },
        },
      };
    }

    const stoneCost = config.stoneCost;

    // 检查强化石数量
    const stoneItem = this.inventory.getItem(ENHANCE_STONE_ID);
    const hasEnoughStones = (stoneItem?.quantity || 0) >= stoneCost;

    // 计算属性预览
    const baseStats = getBaseEquipmentStats(equipment);
    const enhancedStats = calculateEnhancedStats(baseStats, currentLevel + 1);

    return {
      canEnhance: hasEnoughStones,
      reason: !hasEnoughStones ? '强化石不足' : undefined,
      currentLevel,
      targetLevel: currentLevel + 1,
      successRate: config.successRate,
      stoneCost,
      hasEnoughStones,
      goldCost: 0,
      hasEnoughGold: true,
      failureDowngrade: config.failureDowngrade,
      attributePreview: {
        attack: {
          current: equipment.attack || 0,
          after: enhancedStats.attack
        },
        defense: {
          current: equipment.defense || 0,
          after: enhancedStats.defense
        },
        speed: {
          current: equipment.speed || 0,
          after: enhancedStats.speed
        },
        maxHp: {
          current: equipment.maxHp || 0,
          after: enhancedStats.maxHp
        },
      },
    };
  }

  // 执行强化
  enhance(equipment: EquipmentInstance, useProtection: boolean = false): EnhanceResult {
    const preview = this.getEnhancePreview(equipment);

    if (!preview.canEnhance) {
      return {
        type: EnhanceResultType.FAILURE,
        success: false,
        message: preview.reason || '无法强化',
        previousLevel: preview.currentLevel,
        currentLevel: preview.currentLevel,
        consumedStones: 0,
        consumedGold: 0,
        usedProtection: false,
      };
    }

    const config = getEnhanceConfig(preview.currentLevel)!;

    // 扣除强化石
    this.inventory.removeItem(ENHANCE_STONE_ID, preview.stoneCost);

    // 计算成功率
    const roll = Math.random();
    const success = roll <= config.successRate;

    if (success) {
      // 强化成功 - 基于装备基础属性提升10%
      const baseStats = getBaseEquipmentStats(equipment);
      const enhancedStats = calculateEnhancedStats(baseStats, preview.targetLevel);

      const attackGain = enhancedStats.attack - (equipment.attack || 0);
      const defenseGain = enhancedStats.defense - (equipment.defense || 0);
      const speedGain = enhancedStats.speed - (equipment.speed || 0);
      const maxHpGain = enhancedStats.maxHp - (equipment.maxHp || 0);

      equipment.enhanceLevel = preview.targetLevel;
      equipment.attack = enhancedStats.attack;
      equipment.defense = enhancedStats.defense;
      equipment.speed = enhancedStats.speed;
      equipment.maxHp = enhancedStats.maxHp;

      return {
        type: EnhanceResultType.SUCCESS,
        success: true,
        message: `强化成功！${equipment.name} 强化等级 +${preview.targetLevel}`,
        previousLevel: preview.currentLevel,
        currentLevel: preview.targetLevel,
        consumedStones: preview.stoneCost,
        consumedGold: 0,
        usedProtection: useProtection,
        attributeGains: {
          attack: attackGain,
          defense: defenseGain,
          speed: speedGain,
          maxHp: maxHpGain,
        },
      };
    } else {
      // 强化失败
      if (config.failureDowngrade && !useProtection) {
        // 降级 - 属性回退到降级后的等级
        const newLevel = Math.max(0, preview.currentLevel - 1);
        const baseStats = getBaseEquipmentStats(equipment);
        const downgradedStats = calculateEnhancedStats(baseStats, newLevel);

        equipment.enhanceLevel = newLevel;
        equipment.attack = downgradedStats.attack;
        equipment.defense = downgradedStats.defense;
        equipment.speed = downgradedStats.speed;
        equipment.maxHp = downgradedStats.maxHp;

        return {
          type: EnhanceResultType.FAILURE_DOWNGRADE,
          success: false,
          message: `强化失败！${equipment.name} 强化等级降至 +${newLevel}`,
          previousLevel: preview.currentLevel,
          currentLevel: newLevel,
          consumedStones: preview.stoneCost,
          consumedGold: 0,
          usedProtection: false,
        };
      } else {
        return {
          type: EnhanceResultType.FAILURE,
          success: false,
          message: `强化失败！${equipment.name} 强化等级保持不变`,
          previousLevel: preview.currentLevel,
          currentLevel: preview.currentLevel,
          consumedStones: preview.stoneCost,
          consumedGold: 0,
          usedProtection: useProtection,
        };
      }
    }
  }
}

// 计算物品当前强化属性（旧装备系统）
export function calculateEnhanceStats(equipment: InventoryItem): {
  attackBonus: number;
  defenseBonus: number;
  speedBonus: number;
  maxHpBonus: number;
} {
  const level = equipment.enhanceLevel || 0;
  // 新系统：基于基础属性的百分比提升
  // 这里简化处理，返回0表示使用新计算方式
  return { attackBonus: 0, defenseBonus: 0, speedBonus: 0, maxHpBonus: 0 };
}

// 计算装备强化属性加成（用于预览）
export function calculateEnhanceBonus(equipment: { enhanceLevel?: number }): {
  attack: number;
  defense: number;
  agility: number;
  speed: number;
  maxHp: number;
} {
  // 新系统不再使用固定加成，而是百分比提升
  // 这里返回0，实际属性在装备上直接计算
  return { attack: 0, defense: 0, agility: 0, speed: 0, maxHp: 0 };
}

// 获取强化等级颜色
export function getEnhanceLevelColor(level: number): string {
  if (level >= 15) return '#ff0000'; // 红色
  if (level >= 10) return '#ff6600';  // 橙色
  if (level >= 7) return '#ffcc00';  // 黄色
  if (level >= 3) return '#00ccff';  // 蓝色
  return '#00ff00';                   // 绿色
}

// 获取强化等级显示文本
export function getEnhanceLevelText(level: number): string {
  if (level <= 0) return '';
  return `+${level}`;
}
