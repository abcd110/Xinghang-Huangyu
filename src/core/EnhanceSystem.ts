import type { InventoryItem } from '../data/types';
import { ItemType, ItemRarity } from '../data/types';
import type { EquipmentInstance } from './EquipmentSystem';

// 强化等级配置
export interface EnhanceLevelConfig {
  level: number;
  successRate: number; // 成功率 (0-1)
  stoneCost: number; // 强化石消耗
  goldCost: number;
  attackBonus: number;
  defenseBonus: number;
  speedBonus: number;
  maxHpBonus: number;
  failureDowngrade: boolean; // 失败是否降级
}

// 强化配置表 - 基于数值模拟
// 成功率: +0→+1:100%, +1→+2:95%, +2→+3:90%, +3→+4:85%, +4→+5:80%
//          +5→+6:75%, +6→+7:70%, +7→+8:65%, +8→+9:60%, +9→+10:55%
// 强化石: +0→+1:1, +1→+2:1, +2→+3:2, +3→+4:2, +4→+5:3
//          +5→+6:3, +6→+7:4, +7→+8:4, +8→+9:5, +9→+10:5
export const ENHANCE_CONFIG: Record<number, EnhanceLevelConfig> = {
  0: {
    level: 0,
    successRate: 1.0,  // 100%
    stoneCost: 1,
    goldCost: 10,
    attackBonus: 1,
    defenseBonus: 1,
    speedBonus: 1,
    maxHpBonus: 5,
    failureDowngrade: false,
  },
  1: {
    level: 1,
    successRate: 0.95,  // 95%
    stoneCost: 1,
    goldCost: 20,
    attackBonus: 2,
    defenseBonus: 2,
    speedBonus: 1,
    maxHpBonus: 10,
    failureDowngrade: false,
  },
  2: {
    level: 2,
    successRate: 0.90,  // 90%
    stoneCost: 2,
    goldCost: 35,
    attackBonus: 3,
    defenseBonus: 3,
    speedBonus: 2,
    maxHpBonus: 15,
    failureDowngrade: false,
  },
  3: {
    level: 3,
    successRate: 0.85,  // 85%
    stoneCost: 2,
    goldCost: 55,
    attackBonus: 4,
    defenseBonus: 4,
    speedBonus: 2,
    maxHpBonus: 20,
    failureDowngrade: false,
  },
  4: {
    level: 4,
    successRate: 0.80,  // 80%
    stoneCost: 3,
    goldCost: 80,
    attackBonus: 5,
    defenseBonus: 5,
    speedBonus: 3,
    maxHpBonus: 25,
    failureDowngrade: false,
  },
  5: {
    level: 5,
    successRate: 0.75,  // 75%
    stoneCost: 3,
    goldCost: 110,
    attackBonus: 7,
    defenseBonus: 7,
    speedBonus: 4,
    maxHpBonus: 35,
    failureDowngrade: true,
  },
  6: {
    level: 6,
    successRate: 0.70,  // 70%
    stoneCost: 4,
    goldCost: 150,
    attackBonus: 9,
    defenseBonus: 9,
    speedBonus: 5,
    maxHpBonus: 45,
    failureDowngrade: true,
  },
  7: {
    level: 7,
    successRate: 0.65,  // 65%
    stoneCost: 4,
    goldCost: 200,
    attackBonus: 11,
    defenseBonus: 11,
    speedBonus: 6,
    maxHpBonus: 55,
    failureDowngrade: true,
  },
  8: {
    level: 8,
    successRate: 0.60,  // 60%
    stoneCost: 5,
    goldCost: 260,
    attackBonus: 13,
    defenseBonus: 13,
    speedBonus: 7,
    maxHpBonus: 65,
    failureDowngrade: true,
  },
  9: {
    level: 9,
    successRate: 0.55,  // 55%
    stoneCost: 5,
    goldCost: 330,
    attackBonus: 15,
    defenseBonus: 15,
    speedBonus: 8,
    maxHpBonus: 80,
    failureDowngrade: true,
  },
};

// 最大强化等级
export const MAX_ENHANCE_LEVEL = 10;

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
        hasEnoughGold: false,
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
    const goldCost = config.goldCost;

    // 检查强化石数量
    const stoneItem = this.inventory.getItem(ENHANCE_STONE_ID);
    const hasEnoughStones = (stoneItem?.quantity || 0) >= stoneCost;

    // 检查金币
    const hasEnoughGold = (this.player.gold || 0) >= goldCost;

    return {
      canEnhance: hasEnoughStones && hasEnoughGold,
      reason: !hasEnoughStones ? '强化石不足' : !hasEnoughGold ? '金币不足' : undefined,
      currentLevel,
      targetLevel: currentLevel + 1,
      successRate: config.successRate,
      stoneCost,
      hasEnoughStones,
      goldCost,
      hasEnoughGold,
      failureDowngrade: config.failureDowngrade,
      attributePreview: {
        attack: {
          current: equipment.attack || 0,
          after: (equipment.attack || 0) + config.attackBonus
        },
        defense: {
          current: equipment.defense || 0,
          after: (equipment.defense || 0) + config.defenseBonus
        },
        speed: {
          current: equipment.speed || 0,
          after: (equipment.speed || 0) + config.speedBonus
        },
        maxHp: {
          current: equipment.maxHp || 0,
          after: (equipment.maxHp || 0) + config.maxHpBonus
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

    // 扣除金币
    this.player.gold -= preview.goldCost;

    // 计算成功率
    const roll = Math.random();
    const success = roll <= config.successRate;

    if (success) {
      // 强化成功
      equipment.enhanceLevel = preview.targetLevel;
      equipment.attack = (equipment.attack || 0) + config.attackBonus;
      equipment.defense = (equipment.defense || 0) + config.defenseBonus;
      equipment.speed = (equipment.speed || 0) + config.speedBonus;
      equipment.maxHp = (equipment.maxHp || 0) + config.maxHpBonus;

      return {
        type: EnhanceResultType.SUCCESS,
        success: true,
        message: `强化成功！${equipment.name} 强化等级 +${preview.targetLevel}`,
        previousLevel: preview.currentLevel,
        currentLevel: preview.targetLevel,
        consumedStones: preview.stoneCost,
        consumedGold: preview.goldCost,
        usedProtection: useProtection,
        attributeGains: {
          attack: config.attackBonus,
          defense: config.defenseBonus,
          speed: config.speedBonus,
          maxHp: config.maxHpBonus,
        },
      };
    } else {
      // 强化失败
      if (config.failureDowngrade && !useProtection) {
        // 降级
        const newLevel = Math.max(0, preview.currentLevel - 1);
        // 这里简化处理，实际应该根据降级后的配置重新计算属性
        equipment.enhanceLevel = newLevel;

        return {
          type: EnhanceResultType.FAILURE_DOWNGRADE,
          success: false,
          message: `强化失败！${equipment.name} 强化等级降至 +${newLevel}`,
          previousLevel: preview.currentLevel,
          currentLevel: newLevel,
          consumedStones: preview.stoneCost,
          consumedGold: preview.goldCost,
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
          consumedGold: preview.goldCost,
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
  let attackBonus = 0;
  let defenseBonus = 0;
  let speedBonus = 0;
  let maxHpBonus = 0;

  for (let i = 0; i < level; i++) {
    const config = ENHANCE_CONFIG[i];
    if (config) {
      attackBonus += config.attackBonus;
      defenseBonus += config.defenseBonus;
      speedBonus += config.speedBonus;
      maxHpBonus += config.maxHpBonus;
    }
  }

  return { attackBonus, defenseBonus, speedBonus, maxHpBonus };
}

// 计算装备强化属性加成（用于预览）
export function calculateEnhanceBonus(equipment: { enhanceLevel?: number }): {
  attack: number;
  defense: number;
  agility: number;
  speed: number;
  maxHp: number;
} {
  const level = equipment.enhanceLevel || 0;
  let attack = 0;
  let defense = 0;
  let agility = 0;
  let speed = 0;
  let maxHp = 0;

  for (let i = 0; i < level; i++) {
    const config = ENHANCE_CONFIG[i];
    if (config) {
      attack += config.attackBonus;
      defense += config.defenseBonus;
      agility += config.agilityBonus;
      speed += config.speedBonus;
      maxHp += config.maxHpBonus;
    }
  }

  return { attack, defense, agility, speed, maxHp };
}

// 获取强化等级颜色
export function getEnhanceLevelColor(level: number): string {
  if (level >= 10) return '#ff0000'; // 红色
  if (level >= 7) return '#ff6600';  // 橙色
  if (level >= 5) return '#ffcc00';  // 黄色
  if (level >= 3) return '#00ccff';  // 蓝色
  return '#00ff00';                   // 绿色
}

// 获取强化等级显示文本
export function getEnhanceLevelText(level: number): string {
  if (level <= 0) return '';
  return `+${level}`;
}
