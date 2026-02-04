export enum QuestType {
  MAIN = 'main',
  SIDE = 'side',
  DAILY = 'daily',
  ACHIEVEMENT = 'achievement',
}

export enum QuestStatus {
  LOCKED = 'locked',
  AVAILABLE = 'available',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  REWARDED = 'rewarded',
}

export enum QuestConditionType {
  KILL_ENEMY = 'kill_enemy',
  COLLECT_ITEM = 'collect_item',
  EXPLORE_LOCATION = 'explore_location',
  REPAIR_TRAIN = 'repair_train',
  REST = 'rest',
  CRAFT = 'craft',
  REACH_LEVEL = 'reach_level',
  SUBLIMATE = 'sublimate',
}

export interface QuestConditionData {
  conditionType: QuestConditionType;
  targetId: string;
  requiredAmount: number;
  currentAmount: number;
}

export class QuestCondition {
  conditionType: QuestConditionType;
  targetId: string;
  requiredAmount: number;
  currentAmount: number;

  constructor(data: Partial<QuestConditionData>) {
    this.conditionType = data.conditionType || QuestConditionType.KILL_ENEMY;
    this.targetId = data.targetId || '';
    this.requiredAmount = data.requiredAmount || 0;
    this.currentAmount = data.currentAmount || 0;
  }

  isCompleted(): boolean {
    return this.currentAmount >= this.requiredAmount;
  }

  updateProgress(amount: number = 1): void {
    this.currentAmount = Math.min(this.currentAmount + amount, this.requiredAmount);
  }

  serialize(): QuestConditionData {
    return {
      conditionType: this.conditionType,
      targetId: this.targetId,
      requiredAmount: this.requiredAmount,
      currentAmount: this.currentAmount,
    };
  }

  static fromDict(data: QuestConditionData): QuestCondition {
    return new QuestCondition(data);
  }
}

export interface QuestRewardData {
  exp: number;
  trainCoins: number;
  items: [string, number][];
  materials: Record<string, number>;
}

export class QuestReward {
  exp: number;
  trainCoins: number;
  items: [string, number][];
  materials: Record<string, number>;

  constructor(data?: Partial<QuestRewardData>) {
    this.exp = data?.exp || 0;
    this.trainCoins = data?.trainCoins || 0;
    this.items = data?.items || [];
    this.materials = data?.materials || {};
  }

  serialize(): QuestRewardData {
    return {
      exp: this.exp,
      trainCoins: this.trainCoins,
      items: this.items,
      materials: this.materials,
    };
  }

  static fromDict(data: QuestRewardData): QuestReward {
    return new QuestReward(data);
  }
}

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
    this.status = data.status || QuestStatus.AVAILABLE;
    this.conditions = data.conditions?.map(c => QuestCondition.fromDict(c)) || [];
    this.reward = data.reward ? QuestReward.fromDict(data.reward) : new QuestReward();
    this.prerequisites = data.prerequisites || [];
  }

  isCompleted(): boolean {
    return this.conditions.every(c => c.isCompleted());
  }

  getProgressText(): string {
    if (this.conditions.length === 0) return '0/0';
    const totalRequired = this.conditions.reduce((sum, c) => sum + c.requiredAmount, 0);
    const totalCurrent = this.conditions.reduce((sum, c) => sum + c.currentAmount, 0);
    return `${totalCurrent}/${totalRequired}`;
  }

  getProgressPercent(): number {
    if (this.conditions.length === 0) return 0;
    const totalRequired = this.conditions.reduce((sum, c) => sum + c.requiredAmount, 0);
    if (totalRequired === 0) return 0;
    const totalCurrent = this.conditions.reduce((sum, c) => sum + c.currentAmount, 0);
    return Math.min(100, (totalCurrent / totalRequired) * 100);
  }

  start(): void {
    this.status = QuestStatus.ACTIVE;
  }

  complete(): void {
    this.status = QuestStatus.COMPLETED;
  }

  rewardClaimed(): void {
    this.status = QuestStatus.REWARDED;
  }

  serialize(): QuestData {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      questType: this.questType,
      status: this.status,
      conditions: this.conditions.map(c => c.serialize()),
      reward: this.reward.serialize(),
      prerequisites: this.prerequisites,
    };
  }

  static fromDict(data: QuestData): Quest {
    return new Quest(data);
  }
}

// 默认任务配置
export const DEFAULT_QUESTS: Partial<QuestData>[] = [
  // 主线任务
  {
    id: 'main_001',
    title: '求生之路',
    description: '在这个危险的世界中生存下去。击败3只巨型老鼠。',
    questType: QuestType.MAIN,
    status: QuestStatus.ACTIVE,
    conditions: [{ conditionType: QuestConditionType.KILL_ENEMY, targetId: 'rat', requiredAmount: 3, currentAmount: 0 }],
    reward: { exp: 50, trainCoins: 0, items: [['weapon_002', 1]], materials: {} },
    prerequisites: [],
  },
  {
    id: 'main_002',
    title: '列车维修',
    description: '修复列车是生存的关键。收集5个废铁并修复列车。',
    questType: QuestType.MAIN,
    status: QuestStatus.LOCKED,
    conditions: [{ conditionType: QuestConditionType.COLLECT_ITEM, targetId: 'mat_001', requiredAmount: 5, currentAmount: 0 }],
    reward: { exp: 80, trainCoins: 0, items: [['cons_003', 2]], materials: {} },
    prerequisites: ['main_001'],
  },
  {
    id: 'main_003',
    title: '探索荒野',
    description: '探索荒野，击败5只荒野狼。',
    questType: QuestType.MAIN,
    status: QuestStatus.LOCKED,
    conditions: [{ conditionType: QuestConditionType.KILL_ENEMY, targetId: 'wolf', requiredAmount: 5, currentAmount: 0 }],
    reward: { exp: 150, trainCoins: 50, items: [['armor_003', 1]], materials: {} },
    prerequisites: ['main_002'],
  },
  // 支线任务
  {
    id: 'side_001',
    title: '资源收集',
    description: '收集基础资源。收集10个废铁和5个木材。',
    questType: QuestType.SIDE,
    status: QuestStatus.ACTIVE,
    conditions: [
      { conditionType: QuestConditionType.COLLECT_ITEM, targetId: 'mat_001', requiredAmount: 10, currentAmount: 0 },
      { conditionType: QuestConditionType.COLLECT_ITEM, targetId: 'mat_002', requiredAmount: 5, currentAmount: 0 },
    ],
    reward: { exp: 40, trainCoins: 20, items: [], materials: { mat_001: 5 } },
    prerequisites: [],
  },
  {
    id: 'side_002',
    title: '拾荒者清理',
    description: '清理废弃车站的拾荒者。击败3个拾荒者。',
    questType: QuestType.SIDE,
    status: QuestStatus.ACTIVE,
    conditions: [{ conditionType: QuestConditionType.KILL_ENEMY, targetId: 'scavenger', requiredAmount: 3, currentAmount: 0 }],
    reward: { exp: 60, trainCoins: 30, items: [['cons_004', 2]], materials: {} },
    prerequisites: [],
  },
  {
    id: 'side_003',
    title: '装备升华',
    description: '尝试升华系统。升华任意装备1次。',
    questType: QuestType.SIDE,
    status: QuestStatus.ACTIVE,
    conditions: [{ conditionType: QuestConditionType.SUBLIMATE, targetId: 'any', requiredAmount: 1, currentAmount: 0 }],
    reward: { exp: 100, trainCoins: 40, items: [['spe_001', 1]], materials: {} },
    prerequisites: [],
  },
  // 成就
  {
    id: 'ach_001',
    title: '初战告捷',
    description: '赢得第一场战斗。',
    questType: QuestType.ACHIEVEMENT,
    status: QuestStatus.ACTIVE,
    conditions: [{ conditionType: QuestConditionType.KILL_ENEMY, targetId: 'any', requiredAmount: 1, currentAmount: 0 }],
    reward: { exp: 20, trainCoins: 0, items: [], materials: {} },
    prerequisites: [],
  },
  {
    id: 'ach_002',
    title: '生存专家',
    description: '存活5天。',
    questType: QuestType.ACHIEVEMENT,
    status: QuestStatus.ACTIVE,
    conditions: [{ conditionType: QuestConditionType.REACH_LEVEL, targetId: 'day', requiredAmount: 5, currentAmount: 0 }],
    reward: { exp: 200, trainCoins: 0, items: [['weapon_004', 1]], materials: {} },
    prerequisites: [],
  },
  {
    id: 'ach_003',
    title: '装备大师',
    description: '将任意装备升华到+5。',
    questType: QuestType.ACHIEVEMENT,
    status: QuestStatus.ACTIVE,
    conditions: [{ conditionType: QuestConditionType.SUBLIMATE, targetId: 'level_5', requiredAmount: 1, currentAmount: 0 }],
    reward: { exp: 300, trainCoins: 100, items: [], materials: {} },
    prerequisites: [],
  },
  {
    id: 'ach_004',
    title: 'Boss猎人',
    description: '击败5个Boss。',
    questType: QuestType.ACHIEVEMENT,
    status: QuestStatus.ACTIVE,
    conditions: [{ conditionType: QuestConditionType.KILL_ENEMY, targetId: 'boss', requiredAmount: 5, currentAmount: 0 }],
    reward: { exp: 500, trainCoins: 200, items: [], materials: {} },
    prerequisites: [],
  },
  // 日常任务
  {
    id: 'daily_001',
    title: '每日探索',
    description: '探索任意地点3次。',
    questType: QuestType.DAILY,
    status: QuestStatus.ACTIVE,
    conditions: [{ conditionType: QuestConditionType.EXPLORE_LOCATION, targetId: 'any', requiredAmount: 3, currentAmount: 0 }],
    reward: { exp: 30, trainCoins: 15, items: [], materials: {} },
    prerequisites: [],
  },
  {
    id: 'daily_002',
    title: '每日战斗',
    description: '击败5个敌人。',
    questType: QuestType.DAILY,
    status: QuestStatus.ACTIVE,
    conditions: [{ conditionType: QuestConditionType.KILL_ENEMY, targetId: 'any', requiredAmount: 5, currentAmount: 0 }],
    reward: { exp: 40, trainCoins: 20, items: [], materials: {} },
    prerequisites: [],
  },
  {
    id: 'daily_003',
    title: '每日收集',
    description: '收集10个任意材料。',
    questType: QuestType.DAILY,
    status: QuestStatus.ACTIVE,
    conditions: [{ conditionType: QuestConditionType.COLLECT_ITEM, targetId: 'any', requiredAmount: 10, currentAmount: 0 }],
    reward: { exp: 25, trainCoins: 10, items: [], materials: {} },
    prerequisites: [],
  },
];
