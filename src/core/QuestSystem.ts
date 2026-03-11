// 任务类型枚举
export enum QuestType {
  MAIN = 'main',
  SIDE = 'side',
  DAILY = 'daily',
  ACHIEVEMENT = 'achievement',
}

// 任务状态枚举
export enum QuestStatus {
  LOCKED = 'locked',
  AVAILABLE = 'available',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  REWARDED = 'rewarded',
}

// 任务条件类型枚举
export enum QuestConditionType {
  KILL_ENEMY = 'kill_enemy',
  COLLECT_ITEM = 'collect_item',
  EXPLORE_LOCATION = 'explore_location',
  REPAIR_TRAIN = 'repair_train',
  REST = 'rest',
  CRAFT = 'craft',
  REACH_LEVEL = 'reach_level',
  SUBLIMATE = 'sublimate',
  REACH_STAGE = 'reach_stage',
}

// 任务条件数据接口
export interface QuestConditionData {
  conditionType: QuestConditionType;
  targetId: string;
  requiredAmount: number;
  currentAmount: number;
}

// 任务条件类
export class QuestCondition {
  conditionType: QuestConditionType;
  targetId: string;
  requiredAmount: number;
  currentAmount: number;

  constructor(data: QuestConditionData) {
    this.conditionType = data.conditionType;
    this.targetId = data.targetId;
    this.requiredAmount = data.requiredAmount;
    this.currentAmount = data.currentAmount;
  }

  isComplete(): boolean {
    return this.currentAmount >= this.requiredAmount;
  }

  progress(): number {
    return Math.min(1, this.currentAmount / this.requiredAmount);
  }

  updateProgress(amount: number): void {
    this.currentAmount = Math.min(this.requiredAmount, this.currentAmount + amount);
  }

  serialize(): QuestConditionData {
    return {
      conditionType: this.conditionType,
      targetId: this.targetId,
      requiredAmount: this.requiredAmount,
      currentAmount: this.currentAmount,
    };
  }
}

// 任务奖励数据接口
export interface QuestRewardData {
  exp: number;
  trainCoins: number;
  items: [string, number][];
  materials: Record<string, number>;
}

// 任务奖励类
export class QuestReward {
  exp: number;
  trainCoins: number;
  items: [string, number][];
  materials: Record<string, number>;

  constructor(data: QuestRewardData) {
    this.exp = data.exp;
    this.trainCoins = data.trainCoins;
    this.items = data.items;
    this.materials = data.materials;
  }

  serialize(): QuestRewardData {
    return {
      exp: this.exp,
      trainCoins: this.trainCoins,
      items: this.items,
      materials: this.materials,
    };
  }
}

// 任务数据接口
export interface QuestData {
  id: string;
  title: string;
  description: string;
  questType: QuestType;
  status: QuestStatus;
  conditions: QuestConditionData[];
  reward: QuestRewardData;
  prerequisites: string[];
}

// 任务类
export class Quest {
  id: string;
  title: string;
  description: string;
  questType: QuestType;
  status: QuestStatus;
  conditions: QuestCondition[];
  reward: QuestReward;
  prerequisites: string[];

  constructor(data: Partial<QuestData>) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.questType = data.questType || QuestType.SIDE;
    this.status = data.status || QuestStatus.LOCKED;
    this.conditions = (data.conditions || []).map((c) => new QuestCondition(c));
    this.reward = new QuestReward(
      data.reward || { exp: 0, trainCoins: 0, items: [], materials: {} }
    );
    this.prerequisites = data.prerequisites || [];
  }

  isComplete(): boolean {
    return this.conditions.every((c) => c.isComplete());
  }

  isCompleted(): boolean {
    return this.isComplete();
  }

  progress(): number {
    if (this.conditions.length === 0) return 0;
    const total = this.conditions.reduce((sum, c) => sum + c.progress(), 0);
    return total / this.conditions.length;
  }

  getProgressPercent(): number {
    return Math.round(this.progress() * 100);
  }

  getProgressText(): string {
    if (this.conditions.length === 0) return '0/0';
    // 显示每个条件的实际进度
    const progressParts = this.conditions.map((c) => {
      const current = Math.min(c.currentAmount, c.requiredAmount);
      return `${current}/${c.requiredAmount}`;
    });
    return progressParts.join(' | ');
  }

  activate(): void {
    if (this.status === QuestStatus.AVAILABLE) {
      this.status = QuestStatus.ACTIVE;
    }
  }

  complete(): void {
    if (this.status === QuestStatus.ACTIVE && this.isComplete()) {
      this.status = QuestStatus.COMPLETED;
    }
  }

  claimReward(): void {
    if (this.status === QuestStatus.COMPLETED) {
      this.status = QuestStatus.REWARDED;
    }
  }

  updateProgress(conditionType: QuestConditionType, targetId: string, amount: number): void {
    for (const condition of this.conditions) {
      if (
        condition.conditionType === conditionType &&
        (condition.targetId === 'any' || condition.targetId === targetId)
      ) {
        condition.currentAmount = Math.min(
          condition.requiredAmount,
          condition.currentAmount + amount
        );
      }
    }
    if (this.isComplete() && this.status === QuestStatus.ACTIVE) {
      this.status = QuestStatus.COMPLETED;
    }
  }

  serialize(): QuestData {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      questType: this.questType,
      status: this.status,
      conditions: this.conditions.map((c) => c.serialize()),
      reward: this.reward.serialize(),
      prerequisites: this.prerequisites,
    };
  }

  static fromDict(data: QuestData): Quest {
    return new Quest(data);
  }
}

// 默认任务配置 - 《星航荒宇》无尽模式任务
// 只使用可完成的条件类型：KILL_ENEMY, CRAFT, SUBLIMATE, REACH_LEVEL
export const DEFAULT_QUESTS: Partial<QuestData>[] = [
  // ==================== 引导任务（支线）====================
  {
    id: 'guide_001',
    title: '拓荒启程',
    description: '击败 1 个敌人，完成基础训练。',
    questType: QuestType.SIDE,
    status: QuestStatus.ACTIVE,
    conditions: [
      {
        conditionType: QuestConditionType.KILL_ENEMY,
        targetId: 'any',
        requiredAmount: 1,
        currentAmount: 0,
      },
    ],
    reward: {
      exp: 200,
      trainCoins: 100,
      items: [],
      materials: {},
    },
    prerequisites: [],
  },
  {
    id: 'guide_002',
    title: '战斗训练',
    description: '击败 5 个敌人，熟悉战斗系统。',
    questType: QuestType.SIDE,
    status: QuestStatus.LOCKED,
    conditions: [
      {
        conditionType: QuestConditionType.KILL_ENEMY,
        targetId: 'any',
        requiredAmount: 5,
        currentAmount: 0,
      },
    ],
    reward: {
      exp: 300,
      trainCoins: 150,
      items: [],
      materials: {},
    },
    prerequisites: ['guide_001'],
  },
  {
    id: 'guide_003',
    title: '装备制造',
    description: '制造 1 件装备。',
    questType: QuestType.SIDE,
    status: QuestStatus.LOCKED,
    conditions: [
      {
        conditionType: QuestConditionType.CRAFT,
        targetId: 'any',
        requiredAmount: 1,
        currentAmount: 0,
      },
    ],
    reward: {
      exp: 400,
      trainCoins: 200,
      items: [],
      materials: {},
    },
    prerequisites: ['guide_002'],
  },
  {
    id: 'guide_004',
    title: '装备强化',
    description: '升华 1 次装备，提升品质。',
    questType: QuestType.SIDE,
    status: QuestStatus.LOCKED,
    conditions: [
      {
        conditionType: QuestConditionType.SUBLIMATE,
        targetId: 'any',
        requiredAmount: 1,
        currentAmount: 0,
      },
    ],
    reward: {
      exp: 500,
      trainCoins: 250,
      items: [],
      materials: {},
    },
    prerequisites: ['guide_003'],
  },
  {
    id: 'guide_005',
    title: '等级突破',
    description: '达到 5 级，获得正式拓荒队员资格。',
    questType: QuestType.SIDE,
    status: QuestStatus.LOCKED,
    conditions: [
      {
        conditionType: QuestConditionType.REACH_LEVEL,
        targetId: 'player',
        requiredAmount: 5,
        currentAmount: 0,
      },
    ],
    reward: {
      exp: 1000,
      trainCoins: 500,
      items: [],
      materials: {},
    },
    prerequisites: ['guide_004'],
  },

  // ==================== 日常任务 ====================
  {
    id: 'daily_001',
    title: '日常巡逻',
    description: '击败 10 个敌人。',
    questType: QuestType.DAILY,
    status: QuestStatus.ACTIVE,
    conditions: [
      {
        conditionType: QuestConditionType.KILL_ENEMY,
        targetId: 'any',
        requiredAmount: 10,
        currentAmount: 0,
      },
    ],
    reward: {
      exp: 100,
      trainCoins: 50,
      items: [],
      materials: {},
    },
    prerequisites: [],
  },
  {
    id: 'daily_002',
    title: '装备制造',
    description: '制造 2 件装备。',
    questType: QuestType.DAILY,
    status: QuestStatus.ACTIVE,
    conditions: [
      {
        conditionType: QuestConditionType.CRAFT,
        targetId: 'any',
        requiredAmount: 2,
        currentAmount: 0,
      },
    ],
    reward: {
      exp: 150,
      trainCoins: 75,
      items: [],
      materials: {},
    },
    prerequisites: [],
  },
  {
    id: 'daily_003',
    title: '装备升华',
    description: '升华 1 次装备。',
    questType: QuestType.DAILY,
    status: QuestStatus.ACTIVE,
    conditions: [
      {
        conditionType: QuestConditionType.SUBLIMATE,
        targetId: 'any',
        requiredAmount: 1,
        currentAmount: 0,
      },
    ],
    reward: {
      exp: 200,
      trainCoins: 100,
      items: [],
      materials: {},
    },
    prerequisites: [],
  },
  {
    id: 'daily_004',
    title: '精英猎杀',
    description: '击败 30 个敌人。',
    questType: QuestType.DAILY,
    status: QuestStatus.ACTIVE,
    conditions: [
      {
        conditionType: QuestConditionType.KILL_ENEMY,
        targetId: 'any',
        requiredAmount: 30,
        currentAmount: 0,
      },
    ],
    reward: {
      exp: 300,
      trainCoins: 150,
      items: [],
      materials: {},
    },
    prerequisites: [],
  },
  {
    id: 'daily_005',
    title: '批量制造',
    description: '制造 5 件装备。',
    questType: QuestType.DAILY,
    status: QuestStatus.ACTIVE,
    conditions: [
      {
        conditionType: QuestConditionType.CRAFT,
        targetId: 'any',
        requiredAmount: 5,
        currentAmount: 0,
      },
    ],
    reward: {
      exp: 400,
      trainCoins: 200,
      items: [],
      materials: {},
    },
    prerequisites: [],
  },

  // ==================== 主线任务 - 第一章 ====================
  {
    id: 'main_ch1_001',
    title: '第一章：拓荒先锋',
    description: '击败 50 个敌人，证明你的战斗能力。',
    questType: QuestType.MAIN,
    status: QuestStatus.ACTIVE,
    conditions: [
      {
        conditionType: QuestConditionType.KILL_ENEMY,
        targetId: 'any',
        requiredAmount: 50,
        currentAmount: 0,
      },
    ],
    reward: {
      exp: 2000,
      trainCoins: 1000,
      items: [],
      materials: {},
    },
    prerequisites: [],
  },
  {
    id: 'main_ch1_002',
    title: '装备大师',
    description: '制造 10 件装备。',
    questType: QuestType.MAIN,
    status: QuestStatus.LOCKED,
    conditions: [
      {
        conditionType: QuestConditionType.CRAFT,
        targetId: 'any',
        requiredAmount: 10,
        currentAmount: 0,
      },
    ],
    reward: {
      exp: 2500,
      trainCoins: 1200,
      items: [],
      materials: {},
    },
    prerequisites: ['main_ch1_001'],
  },
  {
    id: 'main_ch1_003',
    title: '升华之路',
    description: '升华 5 次装备。',
    questType: QuestType.MAIN,
    status: QuestStatus.LOCKED,
    conditions: [
      {
        conditionType: QuestConditionType.SUBLIMATE,
        targetId: 'any',
        requiredAmount: 5,
        currentAmount: 0,
      },
    ],
    reward: {
      exp: 3000,
      trainCoins: 1500,
      items: [],
      materials: {},
    },
    prerequisites: ['main_ch1_002'],
  },
  {
    id: 'main_ch1_004',
    title: '等级提升',
    description: '达到 15 级。',
    questType: QuestType.MAIN,
    status: QuestStatus.LOCKED,
    conditions: [
      {
        conditionType: QuestConditionType.REACH_LEVEL,
        targetId: 'player',
        requiredAmount: 15,
        currentAmount: 0,
      },
    ],
    reward: {
      exp: 3500,
      trainCoins: 1800,
      items: [],
      materials: {},
    },
    prerequisites: ['main_ch1_003'],
  },
  {
    id: 'main_ch1_005',
    title: '虚空猎手',
    description: '击败 200 个敌人。',
    questType: QuestType.MAIN,
    status: QuestStatus.LOCKED,
    conditions: [
      {
        conditionType: QuestConditionType.KILL_ENEMY,
        targetId: 'any',
        requiredAmount: 200,
        currentAmount: 0,
      },
    ],
    reward: {
      exp: 4000,
      trainCoins: 2000,
      items: [],
      materials: {},
    },
    prerequisites: ['main_ch1_004'],
  },
  {
    id: 'main_ch1_006',
    title: '第一章：拓荒基石',
    description: '达到 20 级，并升华 10 次装备。',
    questType: QuestType.MAIN,
    status: QuestStatus.LOCKED,
    conditions: [
      {
        conditionType: QuestConditionType.REACH_LEVEL,
        targetId: 'player',
        requiredAmount: 20,
        currentAmount: 0,
      },
      {
        conditionType: QuestConditionType.SUBLIMATE,
        targetId: 'any',
        requiredAmount: 10,
        currentAmount: 0,
      },
    ],
    reward: {
      exp: 6000,
      trainCoins: 3000,
      items: [],
      materials: {},
    },
    prerequisites: ['main_ch1_005'],
  },

  // ==================== 主线任务 - 第二章 ====================
  {
    id: 'main_ch2_001',
    title: '第二章：无尽征途',
    description: '击败 500 个敌人，制造 20 件装备。',
    questType: QuestType.MAIN,
    status: QuestStatus.LOCKED,
    conditions: [
      {
        conditionType: QuestConditionType.KILL_ENEMY,
        targetId: 'any',
        requiredAmount: 500,
        currentAmount: 0,
      },
      {
        conditionType: QuestConditionType.CRAFT,
        targetId: 'any',
        requiredAmount: 20,
        currentAmount: 0,
      },
    ],
    reward: {
      exp: 8000,
      trainCoins: 4000,
      items: [],
      materials: {},
    },
    prerequisites: ['main_ch1_006'],
  },
  {
    id: 'main_ch2_002',
    title: '装备精炼',
    description: '升华 30 次装备。',
    questType: QuestType.MAIN,
    status: QuestStatus.LOCKED,
    conditions: [
      {
        conditionType: QuestConditionType.SUBLIMATE,
        targetId: 'any',
        requiredAmount: 30,
        currentAmount: 0,
      },
    ],
    reward: {
      exp: 10000,
      trainCoins: 5000,
      items: [],
      materials: {},
    },
    prerequisites: ['main_ch2_001'],
  },
  {
    id: 'main_ch2_003',
    title: '等级飞跃',
    description: '达到 40 级。',
    questType: QuestType.MAIN,
    status: QuestStatus.LOCKED,
    conditions: [
      {
        conditionType: QuestConditionType.REACH_LEVEL,
        targetId: 'player',
        requiredAmount: 40,
        currentAmount: 0,
      },
    ],
    reward: {
      exp: 12000,
      trainCoins: 6000,
      items: [],
      materials: {},
    },
    prerequisites: ['main_ch2_002'],
  },
  {
    id: 'main_ch2_004',
    title: '虚空终结者',
    description: '击败 1000 个敌人。',
    questType: QuestType.MAIN,
    status: QuestStatus.LOCKED,
    conditions: [
      {
        conditionType: QuestConditionType.KILL_ENEMY,
        targetId: 'any',
        requiredAmount: 1000,
        currentAmount: 0,
      },
    ],
    reward: {
      exp: 15000,
      trainCoins: 7500,
      items: [],
      materials: {},
    },
    prerequisites: ['main_ch2_003'],
  },
  {
    id: 'main_ch2_005',
    title: '第二章：边缘霸主',
    description: '达到 50 级，并击败 1500 个敌人。',
    questType: QuestType.MAIN,
    status: QuestStatus.LOCKED,
    conditions: [
      {
        conditionType: QuestConditionType.REACH_LEVEL,
        targetId: 'player',
        requiredAmount: 50,
        currentAmount: 0,
      },
      {
        conditionType: QuestConditionType.KILL_ENEMY,
        targetId: 'any',
        requiredAmount: 1500,
        currentAmount: 0,
      },
    ],
    reward: {
      exp: 20000,
      trainCoins: 10000,
      items: [],
      materials: {},
    },
    prerequisites: ['main_ch2_004'],
  },

  // ==================== 主线任务 - 关卡进度 ====================
  {
    id: 'main_stage_010',
    title: '关卡突破：10关',
    description: '在无尽模式中达到第 10 关。',
    questType: QuestType.MAIN,
    status: QuestStatus.ACTIVE,
    conditions: [
      {
        conditionType: QuestConditionType.REACH_STAGE,
        targetId: 'any',
        requiredAmount: 10,
        currentAmount: 0,
      },
    ],
    reward: {
      exp: 500,
      trainCoins: 250,
      items: [],
      materials: {},
    },
    prerequisites: [],
  },
  {
    id: 'main_stage_020',
    title: '关卡突破:20关',
    description: '在无尽模式中达到第 20 关。',
    questType: QuestType.MAIN,
    status: QuestStatus.LOCKED,
    conditions: [
      {
        conditionType: QuestConditionType.REACH_STAGE,
        targetId: 'any',
        requiredAmount: 20,
        currentAmount: 0,
      },
    ],
    reward: {
      exp: 1000,
      trainCoins: 500,
      items: [],
      materials: {},
    },
    prerequisites: ['main_stage_010'],
  },
  {
    id: 'main_stage_030',
    title: '关卡突破:30关',
    description: '在无尽模式中达到第 30 关。',
    questType: QuestType.MAIN,
    status: QuestStatus.LOCKED,
    conditions: [
      {
        conditionType: QuestConditionType.REACH_STAGE,
        targetId: 'any',
        requiredAmount: 30,
        currentAmount: 0,
      },
    ],
    reward: {
      exp: 1500,
      trainCoins: 750,
      items: [],
      materials: {},
    },
    prerequisites: ['main_stage_020'],
  },
  {
    id: 'main_stage_040',
    title: '关卡突破:40关',
    description: '在无尽模式中达到第 40 关。',
    questType: QuestType.MAIN,
    status: QuestStatus.LOCKED,
    conditions: [
      {
        conditionType: QuestConditionType.REACH_STAGE,
        targetId: 'any',
        requiredAmount: 40,
        currentAmount: 0,
      },
    ],
    reward: {
      exp: 2000,
      trainCoins: 1000,
      items: [],
      materials: {},
    },
    prerequisites: ['main_stage_030'],
  },
  {
    id: 'main_stage_050',
    title: '关卡突破:50关',
    description: '在无尽模式中达到第 50 关。',
    questType: QuestType.MAIN,
    status: QuestStatus.LOCKED,
    conditions: [
      {
        conditionType: QuestConditionType.REACH_STAGE,
        targetId: 'any',
        requiredAmount: 50,
        currentAmount: 0,
      },
    ],
    reward: {
      exp: 2500,
      trainCoins: 1250,
      items: [],
      materials: {},
    },
    prerequisites: ['main_stage_040'],
  },
  {
    id: 'main_stage_060',
    title: '关卡突破:60关',
    description: '在无尽模式中达到第 60 关。',
    questType: QuestType.MAIN,
    status: QuestStatus.LOCKED,
    conditions: [
      {
        conditionType: QuestConditionType.REACH_STAGE,
        targetId: 'any',
        requiredAmount: 60,
        currentAmount: 0,
      },
    ],
    reward: {
      exp: 3000,
      trainCoins: 1500,
      items: [],
      materials: {},
    },
    prerequisites: ['main_stage_050'],
  },
  {
    id: 'main_stage_070',
    title: '关卡突破:70关',
    description: '在无尽模式中达到第 70 关。',
    questType: QuestType.MAIN,
    status: QuestStatus.LOCKED,
    conditions: [
      {
        conditionType: QuestConditionType.REACH_STAGE,
        targetId: 'any',
        requiredAmount: 70,
        currentAmount: 0,
      },
    ],
    reward: {
      exp: 3500,
      trainCoins: 1750,
      items: [],
      materials: {},
    },
    prerequisites: ['main_stage_060'],
  },
  {
    id: 'main_stage_080',
    title: '关卡突破:80关',
    description: '在无尽模式中达到第 80 关。',
    questType: QuestType.MAIN,
    status: QuestStatus.LOCKED,
    conditions: [
      {
        conditionType: QuestConditionType.REACH_STAGE,
        targetId: 'any',
        requiredAmount: 80,
        currentAmount: 0,
      },
    ],
    reward: {
      exp: 4000,
      trainCoins: 2000,
      items: [],
      materials: {},
    },
    prerequisites: ['main_stage_070'],
  },
  {
    id: 'main_stage_090',
    title: '关卡突破:90关',
    description: '在无尽模式中达到第 90 关。',
    questType: QuestType.MAIN,
    status: QuestStatus.LOCKED,
    conditions: [
      {
        conditionType: QuestConditionType.REACH_STAGE,
        targetId: 'any',
        requiredAmount: 90,
        currentAmount: 0,
      },
    ],
    reward: {
      exp: 4500,
      trainCoins: 2250,
      items: [],
      materials: {},
    },
    prerequisites: ['main_stage_080'],
  },
  {
    id: 'main_stage_100',
    title: '关卡突破:100关',
    description: '在无尽模式中达到第 100 关。',
    questType: QuestType.MAIN,
    status: QuestStatus.LOCKED,
    conditions: [
      {
        conditionType: QuestConditionType.REACH_STAGE,
        targetId: 'any',
        requiredAmount: 100,
        currentAmount: 0,
      },
    ],
    reward: {
      exp: 5000,
      trainCoins: 2500,
      items: [],
      materials: {},
    },
    prerequisites: ['main_stage_090'],
  },
];
