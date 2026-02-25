export enum RuinType {
  CHIP_MATERIAL = 'chip_material',
  CYBER_MATERIAL = 'cyber_material',
  GENE_MATERIAL = 'gene_material',
  BASE_CORE = 'base_core',
  RESEARCH_STAR = 'research_star',
}

export enum RuinDifficulty {
  EASY = 'easy',
  NORMAL = 'normal',
  HARD = 'hard',
  NIGHTMARE = 'nightmare',
  HELL = 'hell',
}

export interface RuinReward {
  credits: number;
  items: { itemId: string; count: number; chance: number }[];
  experience: number;
}

export interface Ruin {
  id: string;
  name: string;
  type: RuinType;
  currentDifficulty: RuinDifficulty;
  description: string;
  completedCount: number;
  firstClear: boolean;
}

export interface RuinDifficultyConfig {
  name: string;
  description: string;
  rewards: RuinReward;
}

export const RUIN_DIFFICULTY_ORDER: RuinDifficulty[] = [
  RuinDifficulty.EASY,
  RuinDifficulty.NORMAL,
  RuinDifficulty.HARD,
  RuinDifficulty.NIGHTMARE,
  RuinDifficulty.HELL,
];

export const RUIN_TYPE_CONFIG: Record<RuinType, { name: string; icon: string; color: string }> = {
  [RuinType.CHIP_MATERIAL]: { name: '芯片研发', icon: '🔬', color: '#06b6d4' },
  [RuinType.CYBER_MATERIAL]: { name: '义体制造', icon: '🦾', color: '#a855f7' },
  [RuinType.GENE_MATERIAL]: { name: '基因研究', icon: '🧬', color: '#22c55e' },
  [RuinType.BASE_CORE]: { name: '基地核心', icon: '🏗️', color: '#3b82f6' },
  [RuinType.RESEARCH_STAR]: { name: '科研之星', icon: '⭐', color: '#fbbf24' },
};

export const RUIN_DIFFICULTY_CONFIG: Record<RuinDifficulty, { name: string; color: string; multiplier: number }> = {
  [RuinDifficulty.EASY]: { name: '简单', color: '#22c55e', multiplier: 1.0 },
  [RuinDifficulty.NORMAL]: { name: '普通', color: '#3b82f6', multiplier: 1.5 },
  [RuinDifficulty.HARD]: { name: '困难', color: '#f59e0b', multiplier: 2.0 },
  [RuinDifficulty.NIGHTMARE]: { name: '噩梦', color: '#a855f7', multiplier: 3.0 },
  [RuinDifficulty.HELL]: { name: '地狱', color: '#ef4444', multiplier: 5.0 },
};

export const MAX_DAILY_ATTEMPTS = 5;

export const RUIN_DIFFICULTY_REWARDS: Record<RuinType, Record<RuinDifficulty, RuinReward>> = {
  [RuinType.CHIP_MATERIAL]: {
    [RuinDifficulty.EASY]: {
      credits: 200,
      items: [
        { itemId: 'chip_material', count: 5, chance: 1.0 },
      ],
      experience: 50,
    },
    [RuinDifficulty.NORMAL]: {
      credits: 500,
      items: [
        { itemId: 'chip_material', count: 12, chance: 1.0 },
      ],
      experience: 120,
    },
    [RuinDifficulty.HARD]: {
      credits: 1000,
      items: [
        { itemId: 'chip_material', count: 25, chance: 1.0 },
      ],
      experience: 300,
    },
    [RuinDifficulty.NIGHTMARE]: {
      credits: 2000,
      items: [
        { itemId: 'chip_material', count: 40, chance: 1.0 },
      ],
      experience: 600,
    },
    [RuinDifficulty.HELL]: {
      credits: 5000,
      items: [
        { itemId: 'chip_material', count: 60, chance: 1.0 },
      ],
      experience: 1200,
    },
  },
  [RuinType.CYBER_MATERIAL]: {
    [RuinDifficulty.EASY]: {
      credits: 200,
      items: [
        { itemId: 'cyber_material', count: 5, chance: 1.0 },
      ],
      experience: 50,
    },
    [RuinDifficulty.NORMAL]: {
      credits: 500,
      items: [
        { itemId: 'cyber_material', count: 12, chance: 1.0 },
      ],
      experience: 120,
    },
    [RuinDifficulty.HARD]: {
      credits: 1000,
      items: [
        { itemId: 'cyber_material', count: 25, chance: 1.0 },
      ],
      experience: 300,
    },
    [RuinDifficulty.NIGHTMARE]: {
      credits: 2000,
      items: [
        { itemId: 'cyber_material', count: 40, chance: 1.0 },
      ],
      experience: 600,
    },
    [RuinDifficulty.HELL]: {
      credits: 5000,
      items: [
        { itemId: 'cyber_material', count: 60, chance: 1.0 },
      ],
      experience: 1200,
    },
  },
  [RuinType.GENE_MATERIAL]: {
    [RuinDifficulty.EASY]: {
      credits: 200,
      items: [
        { itemId: 'gene_material', count: 5, chance: 1.0 },
      ],
      experience: 50,
    },
    [RuinDifficulty.NORMAL]: {
      credits: 500,
      items: [
        { itemId: 'gene_material', count: 12, chance: 1.0 },
      ],
      experience: 120,
    },
    [RuinDifficulty.HARD]: {
      credits: 1000,
      items: [
        { itemId: 'gene_material', count: 25, chance: 1.0 },
      ],
      experience: 300,
    },
    [RuinDifficulty.NIGHTMARE]: {
      credits: 2000,
      items: [
        { itemId: 'gene_material', count: 40, chance: 1.0 },
      ],
      experience: 600,
    },
    [RuinDifficulty.HELL]: {
      credits: 5000,
      items: [
        { itemId: 'gene_material', count: 60, chance: 1.0 },
      ],
      experience: 1200,
    },
  },
  [RuinType.BASE_CORE]: {
    [RuinDifficulty.EASY]: {
      credits: 500,
      items: [
        { itemId: 'base_core', count: 1, chance: 1.0 },
      ],
      experience: 100,
    },
    [RuinDifficulty.NORMAL]: {
      credits: 500,
      items: [
        { itemId: 'base_core', count: 1, chance: 1.0 },
      ],
      experience: 100,
    },
    [RuinDifficulty.HARD]: {
      credits: 500,
      items: [
        { itemId: 'base_core', count: 1, chance: 1.0 },
      ],
      experience: 100,
    },
    [RuinDifficulty.NIGHTMARE]: {
      credits: 500,
      items: [
        { itemId: 'base_core', count: 1, chance: 1.0 },
      ],
      experience: 100,
    },
    [RuinDifficulty.HELL]: {
      credits: 500,
      items: [
        { itemId: 'base_core', count: 1, chance: 1.0 },
      ],
      experience: 100,
    },
  },
  [RuinType.RESEARCH_STAR]: {
    [RuinDifficulty.EASY]: {
      credits: 500,
      items: [
        { itemId: 'research_star', count: 1, chance: 1.0 },
      ],
      experience: 100,
    },
    [RuinDifficulty.NORMAL]: {
      credits: 500,
      items: [
        { itemId: 'research_star', count: 1, chance: 1.0 },
      ],
      experience: 100,
    },
    [RuinDifficulty.HARD]: {
      credits: 500,
      items: [
        { itemId: 'research_star', count: 1, chance: 1.0 },
      ],
      experience: 100,
    },
    [RuinDifficulty.NIGHTMARE]: {
      credits: 500,
      items: [
        { itemId: 'research_star', count: 1, chance: 1.0 },
      ],
      experience: 100,
    },
    [RuinDifficulty.HELL]: {
      credits: 500,
      items: [
        { itemId: 'research_star', count: 1, chance: 1.0 },
      ],
      experience: 100,
    },
  },
};

export const RUIN_TEMPLATES: Omit<Ruin, 'completedCount' | 'firstClear'>[] = [
  {
    id: 'ruin_chip',
    name: '芯片研发中心',
    type: RuinType.CHIP_MATERIAL,
    currentDifficulty: RuinDifficulty.EASY,
    description: '一座废弃的芯片制造工厂，探索获取芯片材料。',
  },
  {
    id: 'ruin_cyber',
    name: '义体制造厂',
    type: RuinType.CYBER_MATERIAL,
    currentDifficulty: RuinDifficulty.EASY,
    description: '一个废弃的义体制造设施，可以拆解出有用的材料。',
  },
  {
    id: 'ruin_gene',
    name: '基因研究中心',
    type: RuinType.GENE_MATERIAL,
    currentDifficulty: RuinDifficulty.EASY,
    description: '一座神秘的基因研究中心，藏有珍贵的基因材料。',
  },
  {
    id: 'ruin_base_core',
    name: '基地核心仓库',
    type: RuinType.BASE_CORE,
    currentDifficulty: RuinDifficulty.EASY,
    description: '一座废弃的基地核心仓库，藏有升级基地设施的关键材料。',
  },
  {
    id: 'ruin_research_star',
    name: '科研数据中心',
    type: RuinType.RESEARCH_STAR,
    currentDifficulty: RuinDifficulty.EASY,
    description: '一座神秘的科研数据中心，藏有珍贵的科研之星材料。',
  },
];

export function getRuinRewards(ruin: Ruin): RuinReward {
  return RUIN_DIFFICULTY_REWARDS[ruin.type][ruin.currentDifficulty];
}

export function getNextDifficulty(current: RuinDifficulty): RuinDifficulty | null {
  const currentIndex = RUIN_DIFFICULTY_ORDER.indexOf(current);
  if (currentIndex < RUIN_DIFFICULTY_ORDER.length - 1) {
    return RUIN_DIFFICULTY_ORDER[currentIndex + 1];
  }
  return null;
}

export function createRuin(templateId: string): Ruin | null {
  const template = RUIN_TEMPLATES.find(t => t.id === templateId);
  if (!template) return null;

  return {
    ...template,
    completedCount: 0,
    firstClear: true,
  };
}

export function generateRuins(): Ruin[] {
  return RUIN_TEMPLATES.map(template => createRuin(template.id)).filter((r): r is Ruin => r !== null);
}

export function calculateExploreSuccess(playerPower: number, difficulty: RuinDifficulty): number {
  const baseSuccess = 60;
  const difficultyModifier = {
    [RuinDifficulty.EASY]: 25,
    [RuinDifficulty.NORMAL]: 0,
    [RuinDifficulty.HARD]: -15,
    [RuinDifficulty.NIGHTMARE]: -30,
    [RuinDifficulty.HELL]: -45,
  };

  const powerBonus = Math.min(playerPower / 20, 40);
  const success = baseSuccess + difficultyModifier[difficulty] + powerBonus;

  return Math.max(5, Math.min(95, success));
}

export function generateRewards(reward: RuinReward, success: boolean, multiplier: number): { credits: number; items: { itemId: string; count: number }[]; experience: number } {
  if (!success) {
    return {
      credits: Math.floor(reward.credits * 0.2 * multiplier),
      items: [],
      experience: Math.floor(reward.experience * 0.3),
    };
  }

  const items: { itemId: string; count: number }[] = [];

  reward.items.forEach(item => {
    if (Math.random() < item.chance) {
      items.push({ itemId: item.itemId, count: Math.floor(item.count * multiplier) });
    }
  });

  return {
    credits: Math.floor(reward.credits * multiplier),
    items,
    experience: reward.experience,
  };
}

export function serializeRuin(ruin: Ruin): Ruin {
  return { ...ruin };
}

export function deserializeRuin(data: any): Ruin {
  const template = RUIN_TEMPLATES.find(t => t.id === data.id);
  if (!template) {
    return {
      id: data.id,
      name: data.name || '未知副本',
      type: data.type || RuinType.CHIP_MATERIAL,
      currentDifficulty: data.currentDifficulty || data.difficulty || RuinDifficulty.EASY,
      description: data.description || '',
      completedCount: data.completedCount || 0,
      firstClear: data.firstClear ?? true,
    };
  }
  
  return {
    ...template,
    currentDifficulty: data.currentDifficulty || data.difficulty || template.currentDifficulty,
    completedCount: data.completedCount || 0,
    firstClear: data.firstClear ?? true,
  };
}
