// 游戏数据类型定义 - 膨胀版
// 基于《列车求生·10个普通站台专属设定（膨胀改造版）》

export enum ItemType {
  WEAPON = 'weapon',
  ARMOR = 'armor',
  ACCESSORY = 'accessory',
  CONSUMABLE = 'consumable',
  MATERIAL = 'material',
  SPECIAL = 'special',
  SKILL_BOOK = 'skill_book',
}

export enum ItemRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
  MYTHIC = 'mythic',
}

export enum LocationType {
  STATION = 'station',
  WILDERNESS = 'wilderness',
  RUINS = 'ruins',
  DUNGEON = 'dungeon',
}

// 站台分类
export enum LocationCategory {
  REGULAR = 'regular',      // 常规站台
  MYTHOLOGY = 'mythology',  // 神话站台
}

// 神话体系
export enum MythologyType {
  GREEK = 'greek',    // 希腊神话
  NORDIC = 'nordic',  // 北欧神话
}

// 神明状态
export enum DeityStatus {
  HIDDEN = 'hidden',      // 隐藏
  EXPOSED = 'exposed',    // 暴露
  HOSTILE = 'hostile',    // 敌对
  NEUTRAL = 'neutral',    // 中立
}

// 核心道具效果类型
export enum CoreItemEffectType {
  SPEED_BOOST = 'speed_boost',           // 速度提升
  DEFENSE_BOOST = 'defense_boost',       // 防御提升
  JUMP_BOOST = 'jump_boost',             // 跃迁提升
  ATTACK_BOOST = 'attack_boost',         // 攻击提升
  RESISTANCE = 'resistance',             // 抗性提升
  SPECIAL = 'special',                   // 特殊效果
}

// 敌人等级类型
export type EnemyTier = 'T1' | 'T1+' | 'T2' | 'T2+' | 'T3' | 'T3+' | 'T3++' | 'T4' | 'T4+' | 'T5' | 'T5+' | 'T6' | 'T6+' | 'T7' | 'T7+' | 'T8';

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  description: string;
  attack?: number;
  defense?: number;
  agility?: number;
  speed?: number;
  maxHp?: number;
  healHp?: number;
  healStamina?: number;
  healHunger?: number;
  healThirst?: number;
  critRate?: number;      // 暴击率
  critDamage?: number;    // 暴击伤害加成
  dodgeRate?: number;     // 闪避率
  hitRate?: number;       // 命中率
  penetration?: number;   // 穿透率
  trueDamage?: number;    // 真实伤害加成
  lifeSteal?: number;     // 生命偷取
  damageReduction?: number; // 伤害减免
  shield?: number;        // 护盾值
  hpRegen?: number;       // 生命恢复（每秒百分比）
  sublimationLevel: number;
  // 装备特效（用于自动战斗）
  effects?: EquipmentEffect[];
  // 装备部位细分（用于套装效果）
  armorSlot?: 'head' | 'chest' | 'legs' | 'feet';
  // 套装ID
  setId?: string;
  // 装备等级要求
  requiredLevel?: number;
  // 战力值
  power?: number;
}

// 装备特效
export interface EquipmentEffect {
  type: EquipmentEffectType;
  trigger: EffectTrigger;
  value: number;
  chance?: number;        // 触发概率
  duration?: number;      // 持续时间（秒）
  condition?: EffectCondition; // 触发条件
  description: string;    // 效果描述
}

// 特效类型
export enum EquipmentEffectType {
  EXTRA_DAMAGE = 'extra_damage',           // 额外伤害
  DAMAGE_BOOST = 'damage_boost',           // 伤害加成
  DEFENSE_BOOST = 'defense_boost',         // 防御加成
  ATTACK_BOOST = 'attack_boost',           // 攻击加成
  SPEED_BOOST = 'speed_boost',             // 攻速加成
  DODGE_BOOST = 'dodge_boost',             // 闪避加成
  CRIT_BOOST = 'crit_boost',               // 暴击加成
  HIT_RATE_BOOST = 'hit_rate_boost',       // 命中率加成
  PENETRATION_BOOST = 'penetration_boost', // 穿透加成
  TRUE_DAMAGE_BOOST = 'true_damage_boost', // 真实伤害加成
  LIFE_STEAL = 'life_steal',               // 生命偷取
  SHIELD_GAIN = 'shield_gain',             // 获得护盾
  HP_REGEN = 'hp_regen',                   // 生命恢复
  DAMAGE_REDUCTION = 'damage_reduction',   // 伤害减免
  THORN_DAMAGE = 'thorn_damage',           // 反伤
  DEBUFF_ENEMY = 'debuff_enemy',           // 减益敌人
  IGNORE_DEFENSE = 'ignore_defense',       // 无视防御
}

// 触发时机
export enum EffectTrigger {
  ON_ATTACK = 'on_attack',           // 攻击时
  ON_HIT = 'on_hit',                 // 命中时
  ON_DODGE = 'on_dodge',             // 闪避时
  ON_HURT = 'on_hurt',               // 受伤时
  ON_CRIT = 'on_crit',               // 暴击时
  ON_KILL = 'on_kill',               // 击杀时
  BATTLE_START = 'battle_start',     // 战斗开始时
  HP_LOW = 'hp_low',                 // 生命低于阈值
  HP_HIGH = 'hp_high',               // 生命高于阈值
  PASSIVE = 'passive',               // 被动常驻
}

// 触发条件
export interface EffectCondition {
  type: 'hp_below' | 'hp_above' | 'enemy_hp_below' | 'chance';
  value: number;
}

// 背包物品
export interface InventoryItem extends Item {
  quantity: number;
  equipped: boolean;
  sublimationLevel: number;
  sublimationProgress: number;
  isSublimated: boolean;
  enhanceLevel: number; // 强化等级
  slot?: string; // 装备槽位：head, body, legs, feet, weapon, accessory
}

// 战利品表项
export interface LootTableItem {
  itemId: string;
  weight: number;
  name: string;
}

// 装备掉落项
export interface EquipmentDrop {
  itemId: string;
  weight: number;
  name: string;
}

// 基础地点接口
export interface BaseLocation {
  id: string;
  name: string;
  description: string;
  type: LocationType;
  dangerLevel: number;
  resourceRichness: number;
  icon: string;
  category: LocationCategory;
}

// 常规站台 - 膨胀版
export interface RegularLocation extends BaseLocation {
  category: LocationCategory.REGULAR;
  // 敌人等级系统
  enemyTier: EnemyTier;
  eliteEnemyTier: EnemyTier;
  bossTier: EnemyTier;
  baseEnemyLevel: number;
  // 敌人类型
  enemyTypes: string[];
  eliteEnemyTypes: string[];
  // Boss信息
  bossName: string;
  bossDescription: string;
  // 特殊机制
  specialMechanics: string[];
  // 探索参数
  explorationTime: number; // 基础探索时间（分钟）
  staminaCost: number;
  recommendedPower: number; // 推荐战力
  // 战利品表
  lootTable: {
    common: LootTableItem[];
    rare: LootTableItem[];
    epic?: LootTableItem[];
  };
  // 装备掉落
  equipmentDrops: EquipmentDrop[];
}

// 核心道具
export interface CoreItem {
  id: string;
  name: string;
  description: string;
  effectType: CoreItemEffectType;
  effectValue: number;      // 效果数值
  effectDescription: string; // 效果描述
  icon: string;
}

// 神明信息
export interface DeityInfo {
  id: string;
  name: string;
  title: string;           // 神职称位
  mythology: MythologyType;
  description: string;     // 背景故事
  status: DeityStatus;
  hostilityLevel: number;  // 敌意等级 0-100
  isUnlocked: boolean;     // 是否已解锁图鉴
  storyFragments: string[]; // 已收集的故事碎片
}

// 神话站台
export interface MythologyLocation extends BaseLocation {
  category: LocationCategory.MYTHOLOGY;
  mythology: MythologyType;
  stationNumber: number;           // 站台编号
  deity: DeityInfo;                // 神明信息
  coreItem: CoreItem;              // 核心道具
  backgroundStory: string;         // 详细背景故事
  wildMonster: {                   // 荒原怪物
    name: string;
    description: string;
    speedRequirement: number;      // 需要列车速度倍数
    icon: string;
  };
  stationMonster: {                // 站台内怪物
    name: string;
    description: string;
    loot: string[];                // 掉落物品
    icon: string;
  };
  interferenceEffects: {           // 神明干扰效果
    name: string;
    description: string;
    triggerChance: number;
  }[];
  isUnlocked: boolean;             // 是否已解锁
  isCompleted: boolean;            // 是否已攻略
  explorationProgress: number;     // 探索进度 0-100
  
  // 新增：类似普通站台的探索系统配置
  enemyTypes: string[];            // 普通敌人类型（小怪）
  eliteEnemyTypes: string[];       // 精英敌人类型
  bossName: string;                // 神明BOSS名称（用于战斗）
  enemyTier: EnemyTier;            // 普通敌人等级
  eliteEnemyTier: EnemyTier;       // 精英敌人等级
  bossTier: EnemyTier;             // 神明BOSS等级
  baseEnemyLevel: number;          // 基础敌人等级
}

// 地点联合类型
export type Location = RegularLocation | MythologyLocation;

export interface Enemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  expReward: number;
  lootTable: { itemId: string; chance: number }[];
  description?: string;
  icon?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  rewards: {
    exp?: number;
    items?: { itemId: string; quantity: number }[];
  };
}

export const RARITY_COLORS: Record<ItemRarity, string> = {
  [ItemRarity.COMMON]: '#9ca3af',
  [ItemRarity.UNCOMMON]: '#22c55e',
  [ItemRarity.RARE]: '#3b82f6',
  [ItemRarity.EPIC]: '#a855f7',
  [ItemRarity.LEGENDARY]: '#eab308',
  [ItemRarity.MYTHIC]: '#ef4444',
};

export const RARITY_NAMES: Record<ItemRarity, string> = {
  [ItemRarity.COMMON]: '普通',
  [ItemRarity.UNCOMMON]: '优秀',
  [ItemRarity.RARE]: '稀有',
  [ItemRarity.EPIC]: '史诗',
  [ItemRarity.LEGENDARY]: '传说',
  [ItemRarity.MYTHIC]: '神话',
};

export const TYPE_ICONS: Record<ItemType, string> = {
  [ItemType.WEAPON]: '⚔️',
  [ItemType.ARMOR]: '🛡️',
  [ItemType.ACCESSORY]: '💍',
  [ItemType.CONSUMABLE]: '🧪',
  [ItemType.MATERIAL]: '⚙️',
  [ItemType.SPECIAL]: '✨',
  [ItemType.SKILL_BOOK]: '📖',
};

export const TYPE_NAMES: Record<ItemType, string> = {
  [ItemType.WEAPON]: '武器',
  [ItemType.ARMOR]: '防具',
  [ItemType.ACCESSORY]: '饰品',
  [ItemType.CONSUMABLE]: '消耗品',
  [ItemType.MATERIAL]: '材料',
  [ItemType.SPECIAL]: '特殊',
  [ItemType.SKILL_BOOK]: '技能书',
};

// ============================================
// 膨胀版探索系统类型
// ============================================

// 探索结果类型
export enum ExplorationResultType {
  SUCCESS = 'success',
  PARTIAL = 'partial',
  FAILURE = 'failure',
  COMBAT = 'combat',
  RESOURCE_FOUND = 'resource_found',
  EVENT_TRIGGERED = 'event_triggered',
  BOSS_ENCOUNTER = 'boss_encounter',
}

// 探索结果
export interface ExplorationResult {
  type: ExplorationResultType;
  success: boolean;
  message: string;
  logs: string[];
  explorationProgress: number;
  progressGained: number;
  loot: { itemId: string; quantity: number; name: string }[];
  combatInfo?: {
    enemyName: string;
    enemyHp: number;
    enemyMaxHp: number;
    enemyAttack: number;
    enemyDefense: number;
    enemyTier: EnemyTier;
    loot: string[];
  };
  eventType?: string;
}

// 探索状态
export interface ExplorationState {
  currentLocationId: string | null;
  explorationProgress: number;
  turnCount: number;
  maxTurns: number;
  combatCount: number;
  resourcesFound: string[];
  isBossDefeated: boolean;
  isCompleted: boolean;
}

// 敌人属性
export interface EnemyStats {
  hp: number;
  attack: number;
  defense: number;
  hitRate: number;
  dodgeRate: number;
  attackSpeed: number;
  critRate: number;
  penetration: number;
  skillCoefficient: number;
  expReward: number;
}

// 探索配置
export interface ExplorationConfig {
  baseExplorationTime: number;
  staminaCostPerTurn: number;
  maxTurnsPerExploration: number;
  progressPerTurn: number;
  progressBonusForCombat: number;
  progressBonusForDiscovery: number;
  combatTriggerChance: number;
  eliteCombatChance: number;
  bossTriggerThreshold: number;
  baseLootChance: number;
  rareLootThreshold: number;
  epicLootThreshold: number;
}

// 战力计算接口
export interface PowerStats {
  attack: number;
  defense: number;
  hp: number;
  attackSpeed: number;
  hitRate: number;
  dodgeRate: number;
  critRate: number;
  penetration: number;
}
