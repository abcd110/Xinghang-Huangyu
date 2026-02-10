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

// 默认任务配置 - 当前为空，等待重新设计适配新游戏的任务
export const DEFAULT_QUESTS: Partial<QuestData>[] = [
  // 任务系统已清空，等待重新设计
];
