export enum ImplantType {
  NEURAL = 'neural',
  SKELETAL = 'skeletal',
  MUSCULAR = 'muscular',
  CARDIO = 'cardio',
}

export enum ImplantRarity {
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
  templateId?: string;
  type: ImplantType;
  rarity: ImplantRarity;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  locked?: boolean;
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
  templateId?: string;
  type: ImplantType;
  rarity: ImplantRarity;
  name: string;
  level: number;
  locked?: boolean;
}

export const IMPLANT_TYPE_CONFIG: Record<ImplantType, { name: string; icon: string; color: string; description: string }> = {
  [ImplantType.NEURAL]: { name: '神经接口', icon: '🧠', color: '#8b5cf6', description: '增强神经反应和感知能力' },
  [ImplantType.SKELETAL]: { name: '骨骼强化', icon: '🦴', color: '#f59e0b', description: '强化骨骼结构和承重能力' },
  [ImplantType.MUSCULAR]: { name: '肌肉增强', icon: '💪', color: '#ef4444', description: '提升肌肉力量和爆发力' },
  [ImplantType.CARDIO]: { name: '心血管改造', icon: '❤️', color: '#ec4899', description: '优化心血管系统和耐力' },
};

export const IMPLANT_RARITY_CONFIG: Record<ImplantRarity, { name: string; color: string; statMultiplier: number }> = {
  [ImplantRarity.RARE]: { name: '稀有', color: '#3b82f6', statMultiplier: 1.5 },
  [ImplantRarity.EPIC]: { name: '史诗', color: '#a855f7', statMultiplier: 2.0 },
  [ImplantRarity.LEGENDARY]: { name: '传说', color: '#f59e0b', statMultiplier: 2.5 },
};

export const IMPLANT_TEMPLATES: Omit<Implant, 'level'>[] = [
  // 神经接口
  {
    id: 'implant_neural_rare',
    type: ImplantType.NEURAL,
    rarity: ImplantRarity.RARE,
    name: '神经加速器',
    description: '提升神经反应速度的植入体',
    maxLevel: 10,
    baseStats: { speed: 8, critRate: 3 },
    levelScaling: { speed: 1.5, critRate: 0.5 },
  },
  {
    id: 'implant_neural_epic',
    type: ImplantType.NEURAL,
    rarity: ImplantRarity.EPIC,
    name: '量子神经网络',
    description: '利用量子纠缠原理的超前神经接口',
    maxLevel: 15,
    baseStats: { speed: 12, critRate: 6, critDamage: 10 },
    levelScaling: { speed: 2, critRate: 1, critDamage: 2 },
    specialEffect: {
      name: '量子闪避',
      description: '有概率完全闪避攻击',
      trigger: 'onHit',
      effect: 'dodge_chance_10',
    },
  },
  {
    id: 'implant_neural_legendary',
    type: ImplantType.NEURAL,
    rarity: ImplantRarity.LEGENDARY,
    name: '虚空神经核心',
    description: '连接虚空意识的终极神经接口',
    maxLevel: 20,
    baseStats: { speed: 18, critRate: 10, critDamage: 20 },
    levelScaling: { speed: 3, critRate: 1.5, critDamage: 3 },
    specialEffect: {
      name: '虚空预知',
      description: '预知敌人攻击轨迹',
      trigger: 'passive',
      effect: 'dodge_chance_20',
    },
  },
  // 骨骼强化
  {
    id: 'implant_skeletal_rare',
    type: ImplantType.SKELETAL,
    rarity: ImplantRarity.RARE,
    name: '钛合金骨架',
    description: '轻量化的钛合金骨骼替代品',
    maxLevel: 10,
    baseStats: { defense: 15, hp: 30 },
    levelScaling: { defense: 3, hp: 6 },
  },
  {
    id: 'implant_skeletal_epic',
    type: ImplantType.SKELETAL,
    rarity: ImplantRarity.EPIC,
    name: '纳米碳纤维骨骼',
    description: '自修复纳米材料构成的超级骨骼',
    maxLevel: 15,
    baseStats: { defense: 30, hp: 60 },
    levelScaling: { defense: 5, hp: 10 },
    specialEffect: {
      name: '自我修复',
      description: '战斗中持续恢复生命',
      trigger: 'passive',
      effect: 'hp_regen_2',
    },
  },
  {
    id: 'implant_skeletal_legendary',
    type: ImplantType.SKELETAL,
    rarity: ImplantRarity.LEGENDARY,
    name: '虚空晶骨',
    description: '虚空晶体质构成的永恒骨骼',
    maxLevel: 20,
    baseStats: { defense: 50, hp: 100 },
    levelScaling: { defense: 8, hp: 15 },
    specialEffect: {
      name: '虚空护盾',
      description: '受到致命伤害时触发护盾',
      trigger: 'passive',
      effect: 'death_shield_50',
    },
  },
  // 肌肉增强
  {
    id: 'implant_muscular_rare',
    type: ImplantType.MUSCULAR,
    rarity: ImplantRarity.RARE,
    name: '合成肌纤维',
    description: '高强度合成肌肉纤维植入',
    maxLevel: 10,
    baseStats: { attack: 20, hp: 15 },
    levelScaling: { attack: 4, hp: 3 },
  },
  {
    id: 'implant_muscular_epic',
    type: ImplantType.MUSCULAR,
    rarity: ImplantRarity.EPIC,
    name: '动力外骨骼',
    description: '外置动力增强系统',
    maxLevel: 15,
    baseStats: { attack: 35, hp: 25, critDamage: 15 },
    levelScaling: { attack: 6, hp: 5, critDamage: 2 },
    specialEffect: {
      name: '过载打击',
      description: '攻击时有概率造成额外伤害',
      trigger: 'onAttack',
      effect: 'extra_damage_15',
    },
  },
  {
    id: 'implant_muscular_legendary',
    type: ImplantType.MUSCULAR,
    rarity: ImplantRarity.LEGENDARY,
    name: '虚空动力核心',
    description: '汲取虚空能量的终极肌肉强化系统',
    maxLevel: 20,
    baseStats: { attack: 60, hp: 40, critDamage: 25 },
    levelScaling: { attack: 10, hp: 8, critDamage: 4 },
    specialEffect: {
      name: '虚空爆发',
      description: '攻击时有概率触发虚空能量爆发',
      trigger: 'onAttack',
      effect: 'void_burst_25',
    },
  },
  // 心血管改造
  {
    id: 'implant_cardio_rare',
    type: ImplantType.CARDIO,
    rarity: ImplantRarity.RARE,
    name: '人工心脏',
    description: '高效率的人工心脏替代品',
    maxLevel: 10,
    baseStats: { hp: 60, speed: 4 },
    levelScaling: { hp: 10, speed: 0.8 },
  },
  {
    id: 'implant_cardio_epic',
    type: ImplantType.CARDIO,
    rarity: ImplantRarity.EPIC,
    name: '聚变动力心脏',
    description: '微型聚变反应堆驱动的心脏系统',
    maxLevel: 15,
    baseStats: { hp: 100, speed: 8, defense: 15 },
    levelScaling: { hp: 15, speed: 1.2, defense: 2.5 },
    specialEffect: {
      name: '能量过载',
      description: '濒死时触发护盾',
      trigger: 'passive',
      effect: 'death_shield_30',
    },
  },
  {
    id: 'implant_cardio_legendary',
    type: ImplantType.CARDIO,
    rarity: ImplantRarity.LEGENDARY,
    name: '虚空之心',
    description: '虚空能量驱动的永恒心脏',
    maxLevel: 20,
    baseStats: { hp: 150, speed: 12, defense: 25, attack: 20 },
    levelScaling: { hp: 20, speed: 1.5, defense: 4, attack: 3 },
    specialEffect: {
      name: '虚空再生',
      description: '战斗中持续大幅恢复生命',
      trigger: 'passive',
      effect: 'hp_regen_5',
    },
  },
];

export function createImplant(templateId: string): Implant | null {
  const template = IMPLANT_TEMPLATES.find(t => t.id === templateId);
  if (!template) return null;

  return {
    ...template,
    id: `${templateId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    templateId: templateId,
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

export function getImplantUpgradeCost(implant: Implant): { credits: number; materials: { itemId: string; count: number }[] } {
  const rarityMultiplier = {
    [ImplantRarity.RARE]: 2,
    [ImplantRarity.EPIC]: 3,
    [ImplantRarity.LEGENDARY]: 5,
  }[implant.rarity];

  const baseCredits = 200 * implant.level * rarityMultiplier;
  const materialCount = Math.floor(2 + implant.level * 0.5);

  return {
    credits: Math.floor(baseCredits),
    materials: [{
      itemId: 'cyber_material',
      count: materialCount,
    }],
  };
}

export function serializeImplant(implant: Implant): ImplantData {
  return {
    id: implant.id,
    templateId: implant.templateId,
    type: implant.type,
    rarity: implant.rarity,
    name: implant.name,
    level: implant.level,
    locked: implant.locked,
  };
}

export function deserializeImplant(data: ImplantData): Implant | null {
  const template = IMPLANT_TEMPLATES.find(t => t.id === data.templateId);
  if (!template) return null;

  return {
    ...template,
    id: data.id,
    templateId: data.templateId,
    level: data.level,
    locked: data.locked,
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
