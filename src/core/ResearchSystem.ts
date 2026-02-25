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
    id: 'mining_lv2',
    name: '采矿平台 Lv.2',
    description: '提升采矿效率10%',
    category: ResearchCategory.PRODUCTION,
    icon: '⛏️',
    totalProgress: 150,
    cost: { credits: 2500, materials: [{ itemId: 'research_star', count: 1 }] },
    duration: 60,
    prerequisites: [],
    unlocks: ['mining_lv3'],
    effects: [{ type: 'mining_upgrade', value: 2, description: '采矿平台升级到Lv.2' }],
  },
  {
    id: 'mining_lv3',
    name: '采矿平台 Lv.3',
    description: '提升采矿效率20%',
    category: ResearchCategory.PRODUCTION,
    icon: '⛏️',
    totalProgress: 200,
    cost: { credits: 5000, materials: [{ itemId: 'research_star', count: 1 }] },
    duration: 90,
    prerequisites: ['mining_lv2'],
    unlocks: ['mining_lv4'],
    effects: [{ type: 'mining_upgrade', value: 3, description: '采矿平台升级到Lv.3' }],
  },
  {
    id: 'mining_lv4',
    name: '采矿平台 Lv.4',
    description: '提升采矿效率30%',
    category: ResearchCategory.PRODUCTION,
    icon: '⛏️',
    totalProgress: 300,
    cost: { credits: 10000, materials: [{ itemId: 'research_star', count: 1 }] },
    duration: 120,
    prerequisites: ['mining_lv3'],
    unlocks: ['mining_lv5'],
    effects: [{ type: 'mining_upgrade', value: 4, description: '采矿平台升级到Lv.4' }],
  },
  {
    id: 'mining_lv5',
    name: '采矿平台 Lv.5',
    description: '提升采矿效率40%',
    category: ResearchCategory.PRODUCTION,
    icon: '⛏️',
    totalProgress: 500,
    cost: { credits: 20000, materials: [{ itemId: 'research_star', count: 1 }] },
    duration: 180,
    prerequisites: ['mining_lv4'],
    unlocks: [],
    effects: [{ type: 'mining_upgrade', value: 5, description: '采矿平台升级到Lv.5' }],
  },
  {
    id: 'chip_lv2',
    name: '芯片研发 Lv.2',
    description: '解锁更多芯片类型',
    category: ResearchCategory.SPECIAL,
    icon: '💾',
    totalProgress: 180,
    cost: { credits: 3000, materials: [{ itemId: 'research_star', count: 1 }] },
    duration: 75,
    prerequisites: [],
    unlocks: ['chip_lv3'],
    effects: [{ type: 'chip_upgrade', value: 2, description: '芯片研发升级到Lv.2' }],
  },
  {
    id: 'chip_lv3',
    name: '芯片研发 Lv.3',
    description: '芯片槽位+1',
    category: ResearchCategory.SPECIAL,
    icon: '💾',
    totalProgress: 250,
    cost: { credits: 6000, materials: [{ itemId: 'research_star', count: 1 }] },
    duration: 100,
    prerequisites: ['chip_lv2'],
    unlocks: ['chip_lv4'],
    effects: [{ type: 'chip_upgrade', value: 3, description: '芯片研发升级到Lv.3' }],
  },
  {
    id: 'chip_lv4',
    name: '芯片研发 Lv.4',
    description: '提升芯片研发成功率',
    category: ResearchCategory.SPECIAL,
    icon: '💾',
    totalProgress: 400,
    cost: { credits: 12000, materials: [{ itemId: 'research_star', count: 1 }] },
    duration: 150,
    prerequisites: ['chip_lv3'],
    unlocks: ['chip_lv5'],
    effects: [{ type: 'chip_upgrade', value: 4, description: '芯片研发升级到Lv.4' }],
  },
  {
    id: 'chip_lv5',
    name: '芯片研发 Lv.5',
    description: '芯片槽位+1',
    category: ResearchCategory.SPECIAL,
    icon: '💾',
    totalProgress: 600,
    cost: { credits: 25000, materials: [{ itemId: 'research_star', count: 1 }] },
    duration: 200,
    prerequisites: ['chip_lv4'],
    unlocks: [],
    effects: [{ type: 'chip_upgrade', value: 5, description: '芯片研发升级到Lv.5' }],
  },
  {
    id: 'cybernetic_lv2',
    name: '机械飞升 Lv.2',
    description: '义体槽位+1',
    category: ResearchCategory.SPECIAL,
    icon: '🦾',
    totalProgress: 220,
    cost: { credits: 5000, materials: [{ itemId: 'research_star', count: 1 }] },
    duration: 90,
    prerequisites: [],
    unlocks: ['cybernetic_lv3'],
    effects: [{ type: 'cybernetic_upgrade', value: 2, description: '机械飞升升级到Lv.2' }],
  },
  {
    id: 'cybernetic_lv3',
    name: '机械飞升 Lv.3',
    description: '义体槽位+1',
    category: ResearchCategory.SPECIAL,
    icon: '🦾',
    totalProgress: 400,
    cost: { credits: 10000, materials: [{ itemId: 'research_star', count: 1 }] },
    duration: 150,
    prerequisites: ['cybernetic_lv2'],
    unlocks: ['cybernetic_lv4'],
    effects: [{ type: 'cybernetic_upgrade', value: 3, description: '机械飞升升级到Lv.3' }],
  },
  {
    id: 'cybernetic_lv4',
    name: '机械飞升 Lv.4',
    description: '义体槽位+1',
    category: ResearchCategory.SPECIAL,
    icon: '🦾',
    totalProgress: 600,
    cost: { credits: 20000, materials: [{ itemId: 'research_star', count: 1 }] },
    duration: 200,
    prerequisites: ['cybernetic_lv3'],
    unlocks: ['cybernetic_lv5'],
    effects: [{ type: 'cybernetic_upgrade', value: 4, description: '机械飞升升级到Lv.4' }],
  },
  {
    id: 'cybernetic_lv5',
    name: '机械飞升 Lv.5',
    description: '义体槽位+1',
    category: ResearchCategory.SPECIAL,
    icon: '🦾',
    totalProgress: 1000,
    cost: { credits: 40000, materials: [{ itemId: 'research_star', count: 1 }] },
    duration: 300,
    prerequisites: ['cybernetic_lv4'],
    unlocks: [],
    effects: [{ type: 'cybernetic_upgrade', value: 5, description: '机械飞升升级到Lv.5' }],
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

export function getResearchById(id: string): Omit<ResearchProject, 'status' | 'progress'> | undefined {
  return RESEARCH_PROJECTS.find(p => p.id === id);
}

export function getMaxConcurrentResearch(labLevel: number): number {
  return Math.min(5, 1 + Math.floor(labLevel / 2));
}

export function getResearchSpeedBonus(labLevel: number): number {
  const speedPerLevel = [0, 0, 5, 10, 15, 20];
  return speedPerLevel[labLevel] || 0;
}
