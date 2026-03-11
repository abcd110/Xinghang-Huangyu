export enum FacilityType {
  CREW = 'crew',
  ENERGY = 'energy',
  WAREHOUSE = 'warehouse',
  RESEARCH = 'research',
  MINING = 'mining',
  CHIP = 'chip',
  ALLIANCE = 'alliance',
  ARENA = 'arena',
  MARKET = 'market',
  RELIC = 'relic',
  GENE = 'gene',
  CYBERNETIC = 'cybernetic',
  RUINS = 'ruins',
}

export interface FacilityLevel {
  level: number;
  upgradeCost: {
    credits: number;
    materials: { itemId: string; count: number }[];
  };
  effects: {
    description: string;
    value: number;
  };
}

export interface FacilityDefinition {
  id: FacilityType;
  name: string;
  icon: string;
  description: string;
  color: string;
  maxLevel: number;
  levels: FacilityLevel[];
}

export interface FacilityState {
  facilityId: FacilityType;
  level: number;
  isActive: boolean;
}

export const FACILITY_DEFINITIONS: FacilityDefinition[] = [
  {
    id: FacilityType.ENERGY,
    name: '能源核心',
    icon: '⚡',
    description: '升级星舰能源系统，提升自动采集效率',
    color: '#f59e0b',
    maxLevel: 10,
    levels: [
      { level: 1, upgradeCost: { credits: 0, materials: [] }, effects: { description: '自动采集效率', value: 0 } },
      { level: 2, upgradeCost: { credits: 0, materials: [{ itemId: 'base_core', count: 1 }] }, effects: { description: '自动采集效率', value: 10 } },
      { level: 3, upgradeCost: { credits: 0, materials: [{ itemId: 'base_core', count: 1 }] }, effects: { description: '自动采集效率', value: 20 } },
      { level: 4, upgradeCost: { credits: 0, materials: [{ itemId: 'base_core', count: 1 }] }, effects: { description: '自动采集效率', value: 30 } },
      { level: 5, upgradeCost: { credits: 0, materials: [{ itemId: 'base_core', count: 1 }] }, effects: { description: '自动采集效率', value: 40 } },
      { level: 6, upgradeCost: { credits: 0, materials: [{ itemId: 'base_core', count: 1 }] }, effects: { description: '自动采集效率', value: 50 } },
      { level: 7, upgradeCost: { credits: 0, materials: [{ itemId: 'base_core', count: 1 }] }, effects: { description: '自动采集效率', value: 60 } },
      { level: 8, upgradeCost: { credits: 0, materials: [{ itemId: 'base_core', count: 1 }] }, effects: { description: '自动采集效率', value: 70 } },
      { level: 9, upgradeCost: { credits: 0, materials: [{ itemId: 'base_core', count: 1 }] }, effects: { description: '自动采集效率', value: 80 } },
      { level: 10, upgradeCost: { credits: 0, materials: [{ itemId: 'base_core', count: 1 }] }, effects: { description: '自动采集效率', value: 100 } },
    ],
  },
  {
    id: FacilityType.WAREHOUSE,
    name: '星际仓库',
    icon: '📦',
    description: '扩展存储容量',
    color: '#10b981',
    maxLevel: 10,
    levels: [
      { level: 1, upgradeCost: { credits: 0, materials: [] }, effects: { description: '存储容量', value: 100 } },
      { level: 2, upgradeCost: { credits: 0, materials: [{ itemId: 'base_core', count: 1 }] }, effects: { description: '存储容量', value: 120 } },
      { level: 3, upgradeCost: { credits: 0, materials: [{ itemId: 'base_core', count: 1 }] }, effects: { description: '存储容量', value: 150 } },
      { level: 4, upgradeCost: { credits: 0, materials: [{ itemId: 'base_core', count: 1 }] }, effects: { description: '存储容量', value: 180 } },
      { level: 5, upgradeCost: { credits: 0, materials: [{ itemId: 'base_core', count: 1 }] }, effects: { description: '存储容量', value: 220 } },
      { level: 6, upgradeCost: { credits: 0, materials: [{ itemId: 'base_core', count: 1 }] }, effects: { description: '存储容量', value: 270 } },
      { level: 7, upgradeCost: { credits: 0, materials: [{ itemId: 'base_core', count: 1 }] }, effects: { description: '存储容量', value: 330 } },
      { level: 8, upgradeCost: { credits: 0, materials: [{ itemId: 'base_core', count: 1 }] }, effects: { description: '存储容量', value: 400 } },
      { level: 9, upgradeCost: { credits: 0, materials: [{ itemId: 'base_core', count: 1 }] }, effects: { description: '存储容量', value: 480 } },
      { level: 10, upgradeCost: { credits: 0, materials: [{ itemId: 'base_core', count: 1 }] }, effects: { description: '存储容量', value: 600 } },
    ],
  },
  {
    id: FacilityType.CREW,
    name: '船员舱',
    icon: '👥',
    description: '扩展船员容量',
    color: '#00d4ff',
    maxLevel: 5,
    levels: [
      { level: 1, upgradeCost: { credits: 0, materials: [] }, effects: { description: '船员容量', value: 5 } },
      { level: 2, upgradeCost: { credits: 3000, materials: [{ itemId: 'mat_001_stardust', count: 8 }] }, effects: { description: '船员容量', value: 6 } },
      { level: 3, upgradeCost: { credits: 6000, materials: [{ itemId: 'mat_001_alloy', count: 10 }] }, effects: { description: '船员容量', value: 7 } },
      { level: 4, upgradeCost: { credits: 12000, materials: [{ itemId: 'mat_001_crystal', count: 12 }] }, effects: { description: '船员容量', value: 8 } },
      { level: 5, upgradeCost: { credits: 25000, materials: [{ itemId: 'mat_001_quantum', count: 15 }] }, effects: { description: '船员容量', value: 9 } },
    ],
  },
  {
    id: FacilityType.RESEARCH,
    name: '科研实验室',
    icon: '🔬',
    description: '进行科技研究解锁新功能',
    color: '#c084fc',
    maxLevel: 5,
    levels: [
      { level: 1, upgradeCost: { credits: 0, materials: [] }, effects: { description: '研究速度', value: 0 } },
      { level: 2, upgradeCost: { credits: 3000, materials: [{ itemId: 'mat_004_stardust', count: 5 }] }, effects: { description: '研究速度', value: 5 } },
      { level: 3, upgradeCost: { credits: 6000, materials: [{ itemId: 'mat_004_alloy', count: 8 }] }, effects: { description: '研究速度', value: 10 } },
      { level: 4, upgradeCost: { credits: 12000, materials: [{ itemId: 'mat_004_crystal', count: 10 }] }, effects: { description: '研究速度', value: 15 } },
      { level: 5, upgradeCost: { credits: 25000, materials: [{ itemId: 'mat_004_quantum', count: 12 }] }, effects: { description: '研究速度', value: 20 } },
    ],
  },
  {
    id: FacilityType.MINING,
    name: '采矿平台',
    icon: '⛏️',
    description: '自动采集矿物资源',
    color: '#f59e0b',
    maxLevel: 5,
    levels: [
      { level: 1, upgradeCost: { credits: 0, materials: [] }, effects: { description: '采矿效率', value: 0 } },
      { level: 2, upgradeCost: { credits: 2500, materials: [{ itemId: 'mat_005_stardust', count: 5 }, { itemId: 'research_star', count: 1 }] }, effects: { description: '采矿效率', value: 10 } },
      { level: 3, upgradeCost: { credits: 5000, materials: [{ itemId: 'mat_005_alloy', count: 8 }, { itemId: 'research_star', count: 1 }] }, effects: { description: '采矿效率', value: 20 } },
      { level: 4, upgradeCost: { credits: 10000, materials: [{ itemId: 'mat_005_crystal', count: 10 }, { itemId: 'research_star', count: 1 }] }, effects: { description: '采矿效率', value: 30 } },
      { level: 5, upgradeCost: { credits: 20000, materials: [{ itemId: 'mat_005_quantum', count: 12 }, { itemId: 'research_star', count: 1 }] }, effects: { description: '采矿效率', value: 40 } },
    ],
  },
  {
    id: FacilityType.CHIP,
    name: '芯片研发',
    icon: '💾',
    description: '研发战斗芯片提升属性',
    color: '#10b981',
    maxLevel: 5,
    levels: [
      { level: 1, upgradeCost: { credits: 0, materials: [] }, effects: { description: '芯片槽位', value: 2 } },
      { level: 2, upgradeCost: { credits: 3000, materials: [{ itemId: 'mineral_copper', count: 10 }, { itemId: 'research_star', count: 1 }] }, effects: { description: '芯片槽位', value: 2 } },
      { level: 3, upgradeCost: { credits: 6000, materials: [{ itemId: 'mineral_titanium', count: 8 }, { itemId: 'research_star', count: 1 }] }, effects: { description: '芯片槽位', value: 3 } },
      { level: 4, upgradeCost: { credits: 12000, materials: [{ itemId: 'mineral_crystal', count: 6 }, { itemId: 'research_star', count: 1 }] }, effects: { description: '芯片槽位', value: 3 } },
      { level: 5, upgradeCost: { credits: 25000, materials: [{ itemId: 'mineral_quantum', count: 4 }, { itemId: 'research_star', count: 1 }] }, effects: { description: '芯片槽位', value: 4 } },
    ],
  },
  {
    id: FacilityType.GENE,
    name: '基因工程',
    icon: '🧬',
    description: '基因改造强化属性',
    color: '#ec4899',
    maxLevel: 5,
    levels: [
      { level: 1, upgradeCost: { credits: 0, materials: [] }, effects: { description: '基因解锁', value: 3 } },
      { level: 2, upgradeCost: { credits: 4000, materials: [{ itemId: 'gene_material', count: 5 }, { itemId: 'research_star', count: 1 }] }, effects: { description: '基因解锁', value: 5 } },
      { level: 3, upgradeCost: { credits: 8000, materials: [{ itemId: 'gene_material', count: 10 }, { itemId: 'research_star', count: 1 }] }, effects: { description: '基因解锁', value: 7 } },
      { level: 4, upgradeCost: { credits: 15000, materials: [{ itemId: 'gene_material', count: 15 }, { itemId: 'research_star', count: 1 }] }, effects: { description: '基因解锁', value: 9 } },
      { level: 5, upgradeCost: { credits: 30000, materials: [{ itemId: 'gene_material', count: 20 }, { itemId: 'research_star', count: 1 }] }, effects: { description: '基因解锁', value: 12 } },
    ],
  },
  {
    id: FacilityType.CYBERNETIC,
    name: '机械飞升',
    icon: '🦾',
    description: '义体改造强化船员能力',
    color: '#f97316',
    maxLevel: 5,
    levels: [
      { level: 1, upgradeCost: { credits: 0, materials: [] }, effects: { description: '义体槽位', value: 2 } },
      { level: 2, upgradeCost: { credits: 5000, materials: [{ itemId: 'cyber_material', count: 10 }, { itemId: 'research_star', count: 1 }] }, effects: { description: '义体槽位', value: 3 } },
      { level: 3, upgradeCost: { credits: 10000, materials: [{ itemId: 'cyber_material', count: 20 }, { itemId: 'research_star', count: 1 }] }, effects: { description: '义体槽位', value: 4 } },
      { level: 4, upgradeCost: { credits: 20000, materials: [{ itemId: 'cyber_core', count: 3 }, { itemId: 'research_star', count: 1 }] }, effects: { description: '义体槽位', value: 5 } },
      { level: 5, upgradeCost: { credits: 40000, materials: [{ itemId: 'cyber_core', count: 5 }, { itemId: 'research_star', count: 1 }] }, effects: { description: '义体槽位', value: 6 } },
    ],
  },
  {
    id: FacilityType.RUINS,
    name: '遗迹探索',
    icon: '🏛️',
    description: '探索遗迹获取稀有资源',
    color: '#a855f7',
    maxLevel: 1,
    levels: [
      { level: 1, upgradeCost: { credits: 0, materials: [] }, effects: { description: '探索等级', value: 1 } },
    ],
  },
  {
    id: FacilityType.RELIC,
    name: '遗迹探索',
    icon: '🏛️',
    description: '探索遗迹获取稀有资源',
    color: '#a855f7',
    maxLevel: 1,
    levels: [
      { level: 1, upgradeCost: { credits: 0, materials: [] }, effects: { description: '探索等级', value: 1 } },
    ],
  },
  {
    id: FacilityType.MARKET,
    name: '星际市场',
    icon: '🏪',
    description: '玩家间交易',
    color: '#ec4899',
    maxLevel: 1,
    levels: [
      { level: 1, upgradeCost: { credits: 0, materials: [] }, effects: { description: '市场等级', value: 1 } },
    ],
  },
];

export class BaseFacilitySystem {
  private facilities: Map<FacilityType, FacilityState> = new Map();

  constructor() {
    this.initializeFacilities();
  }

  private initializeFacilities(): void {
    FACILITY_DEFINITIONS.forEach(def => {
      this.facilities.set(def.id, {
        facilityId: def.id,
        level: 1,
        isActive: true,
      });
    });
  }

  getFacilityState(facilityId: FacilityType): FacilityState | undefined {
    return this.facilities.get(facilityId);
  }

  getFacilityDefinition(facilityId: FacilityType): FacilityDefinition | undefined {
    return FACILITY_DEFINITIONS.find(def => def.id === facilityId);
  }

  getFacilityLevel(facilityId: FacilityType): number {
    const state = this.facilities.get(facilityId);
    return state?.level ?? 1;
  }

  getEnergyCoreEfficiency(): number {
    const level = this.getFacilityLevel(FacilityType.ENERGY);
    const def = this.getFacilityDefinition(FacilityType.ENERGY);
    if (!def) return 0;
    const levelData = def.levels.find(l => l.level === level);
    return levelData?.effects.value ?? 0;
  }

  getWarehouseCapacity(): number {
    const level = this.getFacilityLevel(FacilityType.WAREHOUSE);
    const def = this.getFacilityDefinition(FacilityType.WAREHOUSE);
    if (!def) return 100;
    const levelData = def.levels.find(l => l.level === level);
    return levelData?.effects.value ?? 100;
  }

  canUpgrade(facilityId: FacilityType, credits: number, hasMaterials: (itemId: string, count: number) => boolean): { canUpgrade: boolean; reason?: string; missingMaterials?: { itemId: string; count: number }[] } {
    const state = this.facilities.get(facilityId);
    const def = this.getFacilityDefinition(facilityId);

    if (!state || !def) {
      return { canUpgrade: false, reason: '设施不存在' };
    }

    if (state.level >= def.maxLevel) {
      return { canUpgrade: false, reason: '已达最高等级' };
    }

    const nextLevel = def.levels.find(l => l.level === state.level + 1);
    if (!nextLevel) {
      return { canUpgrade: false, reason: '无法获取升级信息' };
    }

    if (credits < nextLevel.upgradeCost.credits) {
      return { canUpgrade: false, reason: `信用点不足，需要 ${nextLevel.upgradeCost.credits}` };
    }

    const missingMaterials: { itemId: string; count: number }[] = [];
    for (const mat of nextLevel.upgradeCost.materials) {
      if (!hasMaterials(mat.itemId, mat.count)) {
        missingMaterials.push({ itemId: mat.itemId, count: mat.count });
      }
    }

    if (missingMaterials.length > 0) {
      return { canUpgrade: false, reason: '材料不足', missingMaterials };
    }

    return { canUpgrade: true };
  }

  upgradeFacility(facilityId: FacilityType): { success: boolean; newLevel: number; message: string } {
    const state = this.facilities.get(facilityId);
    if (!state) {
      return { success: false, newLevel: 0, message: '设施不存在' };
    }

    state.level++;
    this.facilities.set(facilityId, state);

    return { success: true, newLevel: state.level, message: `升级成功！当前等级: ${state.level}` };
  }

  getAllFacilities(): FacilityState[] {
    return Array.from(this.facilities.values());
  }

  serialize(): Record<string, FacilityState> {
    const data: Record<string, FacilityState> = {};
    this.facilities.forEach((state, id) => {
      data[id] = state;
    });
    return data;
  }

  deserialize(data: Record<string, FacilityState>): void {
    this.facilities.clear();
    Object.entries(data).forEach(([id, state]) => {
      this.facilities.set(id as FacilityType, state);
    });

    FACILITY_DEFINITIONS.forEach(def => {
      if (!this.facilities.has(def.id)) {
        this.facilities.set(def.id, {
          facilityId: def.id,
          level: 1,
          isActive: true,
        });
      }
    });
  }

  reset(): void {
    this.initializeFacilities();
  }
}

export const baseFacilitySystem = new BaseFacilitySystem();
