export enum ImplantType {
  NEURAL = 'neural',
  SKELETAL = 'skeletal',
  MUSCULAR = 'muscular',
  SENSORY = 'sensory',
  CARDIO = 'cardio',
  INTEGRATED = 'integrated',
}

export enum ImplantRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

export interface ImplantSlot {
  type: ImplantType;
  level: number;
  implantId: string | null;
}

export interface Implant {
  id: string;
  type: ImplantType;
  rarity: ImplantRarity;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  baseStats: {
    attack?: number;
    defense?: number;
    hp?: number;
    speed?: number;
    critRate?: number;
    critDamage?: number;
  };
  levelScaling: {
    attack?: number;
    defense?: number;
    hp?: number;
    speed?: number;
    critRate?: number;
    critDamage?: number;
  };
  specialEffect?: {
    name: string;
    description: string;
    trigger: 'passive' | 'onAttack' | 'onHit' | 'onKill';
    effect: string;
  };
}

export interface ImplantData {
  id: string;
  type: ImplantType;
  rarity: ImplantRarity;
  name: string;
  level: number;
}

export const IMPLANT_TYPE_CONFIG: Record<ImplantType, { name: string; icon: string; color: string; description: string }> = {
  [ImplantType.NEURAL]: { name: '神经接口', icon: '🧠', color: '#8b5cf6', description: '增强神经反应和感知能力' },
  [ImplantType.SKELETAL]: { name: '骨骼强化', icon: '🦴', color: '#f59e0b', description: '强化骨骼结构和承重能力' },
  [ImplantType.MUSCULAR]: { name: '肌肉增强', icon: '💪', color: '#ef4444', description: '提升肌肉力量和爆发力' },
  [ImplantType.SENSORY]: { name: '感官强化', icon: '👁️', color: '#22c55e', description: '强化视觉、听觉等感知能力' },
  [ImplantType.CARDIO]: { name: '心血管改造', icon: '❤️', color: '#ec4899', description: '优化心血管系统和耐力' },
  [ImplantType.INTEGRATED]: { name: '综合系统', icon: '🦾', color: '#06b6d4', description: '多功能综合改造系统' },
};

export const IMPLANT_RARITY_CONFIG: Record<ImplantRarity, { name: string; color: string; statMultiplier: number }> = {
  [ImplantRarity.COMMON]: { name: '普通', color: '#9ca3af', statMultiplier: 1.0 },
  [ImplantRarity.UNCOMMON]: { name: '优秀', color: '#22c55e', statMultiplier: 1.2 },
  [ImplantRarity.RARE]: { name: '稀有', color: '#3b82f6', statMultiplier: 1.5 },
  [ImplantRarity.EPIC]: { name: '史诗', color: '#a855f7', statMultiplier: 2.0 },
  [ImplantRarity.LEGENDARY]: { name: '传说', color: '#f59e0b', statMultiplier: 2.5 },
};

export const IMPLANT_TEMPLATES: Omit<Implant, 'level'>[] = [
  {
    id: 'implant_neural_001',
    type: ImplantType.NEURAL,
    rarity: ImplantRarity.COMMON,
    name: '基础神经加速器',
    description: '提升神经反应速度的基础植入体',
    maxLevel: 10,
    baseStats: { speed: 5, critRate: 2 },
    levelScaling: { speed: 1, critRate: 0.5 },
  },
  {
    id: 'implant_neural_002',
    type: ImplantType.NEURAL,
    rarity: ImplantRarity.RARE,
    name: '量子神经网络',
    description: '利用量子纠缠原理的超前神经接口',
    maxLevel: 15,
    baseStats: { speed: 10, critRate: 5, critDamage: 10 },
    levelScaling: { speed: 2, critRate: 1, critDamage: 2 },
    specialEffect: {
      name: '量子闪避',
      description: '有概率完全闪避攻击',
      trigger: 'onHit',
      effect: 'dodge_chance_10',
    },
  },
  {
    id: 'implant_skeletal_001',
    type: ImplantType.SKELETAL,
    rarity: ImplantRarity.COMMON,
    name: '钛合金骨架',
    description: '轻量化的钛合金骨骼替代品',
    maxLevel: 10,
    baseStats: { defense: 10, hp: 20 },
    levelScaling: { defense: 3, hp: 5 },
  },
  {
    id: 'implant_skeletal_002',
    type: ImplantType.SKELETAL,
    rarity: ImplantRarity.EPIC,
    name: '纳米碳纤维骨骼',
    description: '自修复纳米材料构成的超级骨骼',
    maxLevel: 20,
    baseStats: { defense: 30, hp: 50 },
    levelScaling: { defense: 5, hp: 10 },
    specialEffect: {
      name: '自我修复',
      description: '战斗中持续恢复生命',
      trigger: 'passive',
      effect: 'hp_regen_2',
    },
  },
  {
    id: 'implant_muscular_001',
    type: ImplantType.MUSCULAR,
    rarity: ImplantRarity.UNCOMMON,
    name: '合成肌纤维',
    description: '高强度合成肌肉纤维植入',
    maxLevel: 12,
    baseStats: { attack: 15, hp: 10 },
    levelScaling: { attack: 4, hp: 3 },
  },
  {
    id: 'implant_muscular_002',
    type: ImplantType.MUSCULAR,
    rarity: ImplantRarity.LEGENDARY,
    name: '虚空动力核心',
    description: '汲取虚空能量的终极肌肉强化系统',
    maxLevel: 25,
    baseStats: { attack: 50, hp: 30, critDamage: 20 },
    levelScaling: { attack: 8, hp: 5, critDamage: 3 },
    specialEffect: {
      name: '虚空爆发',
      description: '攻击时有概率触发虚空能量爆发',
      trigger: 'onAttack',
      effect: 'void_burst_20',
    },
  },
  {
    id: 'implant_sensory_001',
    type: ImplantType.SENSORY,
    rarity: ImplantRarity.COMMON,
    name: '光学增强器',
    description: '增强视觉感知的基础植入体',
    maxLevel: 10,
    baseStats: { critRate: 5, speed: 3 },
    levelScaling: { critRate: 1, speed: 0.5 },
  },
  {
    id: 'implant_sensory_002',
    type: ImplantType.SENSORY,
    rarity: ImplantRarity.RARE,
    name: '全频谱感知阵列',
    description: '覆盖全电磁频谱的感知系统',
    maxLevel: 15,
    baseStats: { critRate: 10, speed: 5, critDamage: 15 },
    levelScaling: { critRate: 2, speed: 1, critDamage: 2 },
    specialEffect: {
      name: '弱点洞察',
      description: '提高暴击伤害',
      trigger: 'passive',
      effect: 'crit_damage_25',
    },
  },
  {
    id: 'implant_cardio_001',
    type: ImplantType.CARDIO,
    rarity: ImplantRarity.UNCOMMON,
    name: '人工心脏',
    description: '高效率的人工心脏替代品',
    maxLevel: 12,
    baseStats: { hp: 50, speed: 3 },
    levelScaling: { hp: 10, speed: 0.5 },
  },
  {
    id: 'implant_cardio_002',
    type: ImplantType.CARDIO,
    rarity: ImplantRarity.EPIC,
    name: '聚变动力心脏',
    description: '微型聚变反应堆驱动的心脏系统',
    maxLevel: 20,
    baseStats: { hp: 100, speed: 8, defense: 15 },
    levelScaling: { hp: 15, speed: 1, defense: 2 },
    specialEffect: {
      name: '能量过载',
      description: '濒死时触发护盾',
      trigger: 'passive',
      effect: 'death_shield_30',
    },
  },
  {
    id: 'implant_integrated_001',
    type: ImplantType.INTEGRATED,
    rarity: ImplantRarity.RARE,
    name: '战术辅助系统',
    description: '集成多种功能的战术辅助AI',
    maxLevel: 15,
    baseStats: { attack: 10, defense: 10, speed: 5 },
    levelScaling: { attack: 2, defense: 2, speed: 1 },
  },
  {
    id: 'implant_integrated_002',
    type: ImplantType.INTEGRATED,
    rarity: ImplantRarity.LEGENDARY,
    name: '虚空飞升核心',
    description: '传说中实现真正机械飞升的终极系统',
    maxLevel: 30,
    baseStats: { attack: 30, defense: 30, hp: 50, speed: 10, critRate: 10, critDamage: 20 },
    levelScaling: { attack: 5, defense: 5, hp: 10, speed: 1, critRate: 1, critDamage: 2 },
    specialEffect: {
      name: '虚空化身',
      description: '短时间内获得虚空之力',
      trigger: 'onKill',
      effect: 'void_form_5s',
    },
  },
];

export function createImplant(templateId: string): Implant | null {
  const template = IMPLANT_TEMPLATES.find(t => t.id === templateId);
  if (!template) return null;

  return {
    ...template,
    level: 1,
  };
}

export function upgradeImplant(implant: Implant): { success: boolean; newLevel: number } {
  if (implant.level >= implant.maxLevel) {
    return { success: false, newLevel: implant.level };
  }

  implant.level += 1;
  return { success: true, newLevel: implant.level };
}

export function getImplantStats(implant: Implant): Record<string, number> {
  const rarityConfig = IMPLANT_RARITY_CONFIG[implant.rarity];
  const stats: Record<string, number> = {};

  const statKeys = ['attack', 'defense', 'hp', 'speed', 'critRate', 'critDamage'] as const;

  statKeys.forEach(key => {
    const baseValue = implant.baseStats[key] || 0;
    const scalingValue = implant.levelScaling[key] || 0;
    const totalValue = (baseValue + scalingValue * (implant.level - 1)) * rarityConfig.statMultiplier;
    if (totalValue > 0) {
      stats[key] = Math.round(totalValue * 10) / 10;
    }
  });

  return stats;
}

export function getImplantUpgradeCost(implant: Implant): { credits: number; materials: { itemId: string; count: number } } {
  const rarityMultiplier = {
    [ImplantRarity.COMMON]: 1,
    [ImplantRarity.UNCOMMON]: 1.5,
    [ImplantRarity.RARE]: 2,
    [ImplantRarity.EPIC]: 3,
    [ImplantRarity.LEGENDARY]: 5,
  }[implant.rarity];

  const baseCredits = 200 * implant.level * rarityMultiplier;
  const materialCount = Math.floor(2 + implant.level * 0.5);

  return {
    credits: Math.floor(baseCredits),
    materials: {
      itemId: 'cyber_material',
      count: materialCount,
    },
  };
}

export function serializeImplant(implant: Implant): ImplantData {
  return {
    id: implant.id,
    type: implant.type,
    rarity: implant.rarity,
    name: implant.name,
    level: implant.level,
  };
}

export function deserializeImplant(data: ImplantData): Implant | null {
  const template = IMPLANT_TEMPLATES.find(t => t.id === data.id);
  if (!template) return null;

  return {
    ...template,
    level: data.level,
  };
}

export function getRandomImplantRarity(): ImplantRarity {
  const roll = Math.random() * 100;
  if (roll < 50) return ImplantRarity.COMMON;
  if (roll < 75) return ImplantRarity.UNCOMMON;
  if (roll < 90) return ImplantRarity.RARE;
  if (roll < 98) return ImplantRarity.EPIC;
  return ImplantRarity.LEGENDARY;
}

export function getRandomImplantByRarity(rarity: ImplantRarity): Implant | null {
  const templates = IMPLANT_TEMPLATES.filter(t => t.rarity === rarity);
  if (templates.length === 0) return null;

  const template = templates[Math.floor(Math.random() * templates.length)];
  return createImplant(template.id);
}
