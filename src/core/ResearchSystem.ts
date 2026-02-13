export enum ResearchStatus {
  LOCKED = 'locked',
  AVAILABLE = 'available',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export enum ResearchCategory {
  COMBAT = 'combat',
  SURVIVAL = 'survival',
  PRODUCTION = 'production',
  SPECIAL = 'special',
}

export interface ResearchProject {
  id: string;
  name: string;
  description: string;
  category: ResearchCategory;
  icon: string;
  status: ResearchStatus;
  progress: number;
  totalProgress: number;
  cost: {
    credits: number;
    materials: { itemId: string; count: number }[];
  };
  duration: number;
  prerequisites: string[];
  unlocks: string[];
  effects: {
    type: string;
    value: number;
    description: string;
  }[];
}

export interface ResearchProjectData {
  id: string;
  name: string;
  description: string;
  category: ResearchCategory;
  icon: string;
  status: ResearchStatus;
  progress: number;
  totalProgress: number;
  cost: {
    credits: number;
    materials: { itemId: string; count: number }[];
  };
  duration: number;
  prerequisites: string[];
  unlocks: string[];
  effects: {
    type: string;
    value: number;
    description: string;
  }[];
  startTime?: number;
}

export const RESEARCH_CATEGORY_CONFIG: Record<ResearchCategory, { name: string; color: string; icon: string }> = {
  [ResearchCategory.COMBAT]: { name: '战斗', color: '#ef4444', icon: '⚔️' },
  [ResearchCategory.SURVIVAL]: { name: '生存', color: '#22c55e', icon: '🛡️' },
  [ResearchCategory.PRODUCTION]: { name: '生产', color: '#3b82f6', icon: '🏭' },
  [ResearchCategory.SPECIAL]: { name: '特殊', color: '#a855f7', icon: '✨' },
};

export const RESEARCH_PROJECTS: Omit<ResearchProject, 'status' | 'progress'>[] = [
  {
    id: 'research_001',
    name: '高级采集技术',
    description: '提升自动采集效率10%',
    category: ResearchCategory.PRODUCTION,
    icon: '⛏️',
    totalProgress: 100,
    cost: { credits: 1000, materials: [{ itemId: 'mat_001_stardust', count: 10 }] },
    duration: 30,
    prerequisites: [],
    unlocks: ['research_002'],
    effects: [{ type: 'collect_efficiency', value: 10, description: '自动采集效率+10%' }],
  },
  {
    id: 'research_002',
    name: '精炼技术I',
    description: '解锁材料精炼功能',
    category: ResearchCategory.PRODUCTION,
    icon: '🔧',
    totalProgress: 150,
    cost: { credits: 2000, materials: [{ itemId: 'mat_001_alloy', count: 8 }] },
    duration: 60,
    prerequisites: ['research_001'],
    unlocks: ['research_003'],
    effects: [{ type: 'unlock_refine', value: 1, description: '解锁材料精炼' }],
  },
  {
    id: 'research_003',
    name: '高效能源',
    description: '降低能源消耗15%',
    category: ResearchCategory.PRODUCTION,
    icon: '⚡',
    totalProgress: 200,
    cost: { credits: 3000, materials: [{ itemId: 'mat_001_crystal', count: 5 }] },
    duration: 90,
    prerequisites: ['research_002'],
    unlocks: [],
    effects: [{ type: 'energy_efficiency', value: 15, description: '能源消耗-15%' }],
  },
  {
    id: 'research_004',
    name: '战斗强化I',
    description: '提升攻击力5%',
    category: ResearchCategory.COMBAT,
    icon: '⚔️',
    totalProgress: 120,
    cost: { credits: 1500, materials: [{ itemId: 'mat_002_stardust', count: 10 }] },
    duration: 45,
    prerequisites: [],
    unlocks: ['research_005'],
    effects: [{ type: 'attack_bonus', value: 5, description: '攻击力+5%' }],
  },
  {
    id: 'research_005',
    name: '防御强化I',
    description: '提升防御力5%',
    category: ResearchCategory.COMBAT,
    icon: '🛡️',
    totalProgress: 120,
    cost: { credits: 1500, materials: [{ itemId: 'mat_002_alloy', count: 8 }] },
    duration: 45,
    prerequisites: ['research_004'],
    unlocks: ['research_006'],
    effects: [{ type: 'defense_bonus', value: 5, description: '防御力+5%' }],
  },
  {
    id: 'research_006',
    name: '战斗精通',
    description: '提升暴击率3%',
    category: ResearchCategory.COMBAT,
    icon: '🎯',
    totalProgress: 180,
    cost: { credits: 2500, materials: [{ itemId: 'mat_002_crystal', count: 6 }] },
    duration: 75,
    prerequisites: ['research_005'],
    unlocks: [],
    effects: [{ type: 'crit_rate', value: 3, description: '暴击率+3%' }],
  },
  {
    id: 'research_007',
    name: '生命强化',
    description: '提升最大生命值10%',
    category: ResearchCategory.SURVIVAL,
    icon: '❤️',
    totalProgress: 100,
    cost: { credits: 1200, materials: [{ itemId: 'mat_006_stardust', count: 8 }] },
    duration: 40,
    prerequisites: [],
    unlocks: ['research_008'],
    effects: [{ type: 'hp_bonus', value: 10, description: '最大生命+10%' }],
  },
  {
    id: 'research_008',
    name: '快速恢复',
    description: '提升恢复效率20%',
    category: ResearchCategory.SURVIVAL,
    icon: '💊',
    totalProgress: 150,
    cost: { credits: 2000, materials: [{ itemId: 'mat_006_alloy', count: 6 }] },
    duration: 60,
    prerequisites: ['research_007'],
    unlocks: [],
    effects: [{ type: 'recovery_bonus', value: 20, description: '恢复效率+20%' }],
  },
  {
    id: 'research_009',
    name: '仓库扩展技术',
    description: '增加仓库容量20格',
    category: ResearchCategory.SPECIAL,
    icon: '📦',
    totalProgress: 200,
    cost: { credits: 3000, materials: [{ itemId: 'mat_001_alloy', count: 15 }] },
    duration: 90,
    prerequisites: [],
    unlocks: [],
    effects: [{ type: 'warehouse_capacity', value: 20, description: '仓库容量+20' }],
  },
  {
    id: 'research_010',
    name: '高级招募技术',
    description: '招募时稀有概率+5%',
    category: ResearchCategory.SPECIAL,
    icon: '👥',
    totalProgress: 250,
    cost: { credits: 5000, materials: [{ itemId: 'mat_002_crystal', count: 10 }] },
    duration: 120,
    prerequisites: [],
    unlocks: [],
    effects: [{ type: 'recruit_rare_bonus', value: 5, description: '招募稀有率+5%' }],
  },
];

export function createResearchProject(id: string): ResearchProject | null {
  const template = RESEARCH_PROJECTS.find(p => p.id === id);
  if (!template) return null;

  return {
    ...template,
    status: ResearchStatus.LOCKED,
    progress: 0,
  };
}

export function serializeResearchProject(project: ResearchProject): ResearchProjectData {
  return { ...project };
}

export function deserializeResearchProject(data: ResearchProjectData): ResearchProject {
  return { ...data };
}

export function getResearchProgressPercent(project: ResearchProject): number {
  return Math.min(100, Math.round((project.progress / project.totalProgress) * 100));
}

export function canStartResearch(
  project: ResearchProject,
  credits: number,
  hasMaterials: (itemId: string, count: number) => boolean,
  completedResearch: string[]
): { canStart: boolean; reason?: string } {
  if (project.status === ResearchStatus.COMPLETED) {
    return { canStart: false, reason: '已完成' };
  }

  if (project.status === ResearchStatus.IN_PROGRESS) {
    return { canStart: false, reason: '研究中' };
  }

  for (const prereq of project.prerequisites) {
    if (!completedResearch.includes(prereq)) {
      return { canStart: false, reason: '前置研究未完成' };
    }
  }

  if (credits < project.cost.credits) {
    return { canStart: false, reason: '信用点不足' };
  }

  for (const mat of project.cost.materials) {
    if (!hasMaterials(mat.itemId, mat.count)) {
      return { canStart: false, reason: '材料不足' };
    }
  }

  return { canStart: true };
}

export function getMaxConcurrentResearch(facilityLevel: number): number {
  return Math.min(3, 1 + Math.floor(facilityLevel / 2));
}

export function getResearchSpeedBonus(facilityLevel: number): number {
  return facilityLevel * 5;
}
