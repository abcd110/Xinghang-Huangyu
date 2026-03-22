/**
 * 技能系统类型定义
 * 每个角色拥有：普攻、主动技能、终极技能、天赋（被动）
 * 
 * 技能升级规则：
 * - 普攻：基础可提升至5级
 * - 主动技能：基础可提升至4级，第5级依靠星级突破
 * - 终极技能：基础可提升至4级，第5级依靠星级突破
 * - 天赋：基础效果，通过星级突破强化
 * 
 * 能量系统：
 * - 普攻：+5点能量
 * - 主动技能：+20点能量
 * - 终极技能：消耗100点能量
 */

// 技能类型
export enum SkillType {
  BASIC = 'basic',       // 普攻 - 自动攻击，+5能量
  SKILL = 'skill',       // 主动技能 - 冷却触发，+20能量
  ULTIMATE = 'ultimate', // 终极技能 - 能量触发，消耗100能量
  TALENT = 'talent',     // 天赋 - 被动生效
}

// 技能效果类型
export enum SkillEffectType {
  DAMAGE = 'damage',           // 造成伤害
  HEAL = 'heal',               // 治疗
  SHIELD = 'shield',           // 护盾
  BUFF = 'buff',               // 增益
  DEBUFF = 'debuff',           // 减益
  CONTROL = 'control',         // 控制（眩晕、冰冻等）
  SUMMON = 'summon',           // 召唤
  DOT = 'dot',                 // 持续伤害（灼烧、中毒等）
}

// 目标类型
export enum TargetType {
  SINGLE = 'single',           // 单体
  AOE = 'aoe',                 // 范围
  ALL = 'all',                 // 全体
  SELF = 'self',               // 自身
  ALLY = 'ally',               // 友方单体
  ALLIES = 'allies',           // 友方全体
  LOWEST_HP = 'lowest_hp',     // 生命最低
  HIGHEST_HP = 'highest_hp',   // 生命最高
  HIGHEST_ATTACK = 'highest_attack', // 攻击最高
  HIGHEST_DEFENSE = 'highest_defense', // 防御最高
}

// 伤害类型
export enum DamageType {
  PHYSICAL = 'physical',       // 物理
  ENERGY = 'energy',           // 能量
  EXPLOSIVE = 'explosive',     // 爆炸
  CORROSION = 'corrosion',     // 腐蚀
  ELECTRIC = 'electric',       // 电击
  TRUE = 'true',               // 真实伤害（无视防御）
}

// 触发时机（用于天赋）
export enum TriggerTiming {
  ON_ATTACK = 'on_attack',           // 攻击时
  ON_HIT = 'on_hit',                 // 受击时
  ON_KILL = 'on_kill',               // 击杀时
  ON_BATTLE_START = 'on_battle_start', // 战斗开始时
  ON_HP_BELOW = 'on_hp_below',       // 生命低于阈值
  ON_CRIT = 'on_crit',               // 暴击时
  ON_DODGE = 'on_dodge',             // 闪避时
  PER_TURN = 'per_turn',             // 每回合
  CONTINUOUS = 'continuous',         // 持续生效
}

// 技能等级效果 - 普攻（5级）
export interface BasicSkillLevel {
  level: 1 | 2 | 3 | 4 | 5;
  // 效果数值（百分比）
  value: number;
  // 能量获取
  energyGain: number;
  // 攻击间隔（秒）
  cooldown: number;
}

// 技能等级效果 - 主动技能（4级基础+1级星级）
export interface ActiveSkillLevel {
  level: 1 | 2 | 3 | 4 | 5;
  // 效果数值（百分比）
  value: number;
  // 能量获取
  energyGain: number;
  // 冷却时间（秒）
  cooldown: number;
  // 特殊效果概率（如眩晕概率）
  procChance?: number;
}

// 技能等级效果 - 终极技能（4级基础+1级星级）
export interface UltimateSkillLevel {
  level: 1 | 2 | 3 | 4 | 5;
  // 效果数值（百分比）
  value: number;
  // 能量消耗
  energyCost: number;
  // 特殊效果数值
  extraValue?: number;
}

// 天赋效果 - 通过星级突破强化
export interface TalentEffect {
  // 基础效果描述
  description: string;
  // 基础数值
  baseValue: number;
  // 单位
  unit: '%' | '';
  // 4星强化后的数值
  enhancedValue4?: number;
  // 5星额外效果
  star5Effect?: string;
}

// 星级突破效果
export interface StarBonus {
  star: number;
  description: string;
  // 效果类型
  effectType: 'stat_boost' | 'skill_level' | 'talent_enhance' | 'special';
  // 目标技能（如果是技能等级提升）
  targetSkill?: SkillType;
  // 数值
  value?: number;
}

// 普攻技能定义
export interface BasicSkill {
  id: string;
  name: string;
  description: string;
  icon: string;
  // 效果类型
  effectType: SkillEffectType;
  // 目标类型
  targetType: TargetType;
  // 伤害类型
  damageType?: DamageType;
  // 基于攻击力还是防御力
  scaleStat: 'attack' | 'defense';
  // 各等级效果
  levels: BasicSkillLevel[];
  // 特殊效果
  specialEffect?: {
    type: string;
    description: string;
    procChance?: number;
    procChances?: number[];
  };
}

// 主动技能定义
export interface ActiveSkill {
  id: string;
  name: string;
  description: string;
  icon: string;
  // 效果类型
  effectType: SkillEffectType;
  // 目标类型
  targetType: TargetType;
  // 伤害类型
  damageType?: DamageType;
  // 基于攻击力还是防御力
  scaleStat: 'attack' | 'defense';
  // 各等级效果
  levels: ActiveSkillLevel[];
  // 特殊效果
  specialEffect?: {
    type: string;
    description: string;
    // 各等级概率
    procChances?: number[];
  };
  // 持续效果
  duration?: number;
  // 叠加层数
  maxStacks?: number;
}

// 终极技能定义
export interface UltimateSkill {
  id: string;
  name: string;
  description: string;
  icon: string;
  // 效果类型
  effectType: SkillEffectType;
  // 目标类型
  targetType: TargetType;
  // 伤害类型
  damageType?: DamageType;
  // 基于攻击力还是防御力
  scaleStat: 'attack' | 'defense';
  // 各等级效果
  levels: UltimateSkillLevel[];
  // 特殊效果
  specialEffect?: {
    type: string;
    description: string;
  };
  // 持续效果
  duration?: number;
}

// 天赋定义
export interface TalentSkill {
  id: string;
  name: string;
  description: string;
  icon: string;
  // 效果类型
  effectType: SkillEffectType;
  // 触发时机
  triggerTiming?: TriggerTiming;
  // 触发阈值
  triggerThreshold?: number;
  // 天赋效果
  effect: TalentEffect;
  // 5星额外效果
  star5Bonus?: string;
}

// 完整技能组合
export interface SkillSet {
  basic: BasicSkill;
  skill: ActiveSkill;
  ultimate: UltimateSkill;
  talent: TalentSkill;
  // 星级突破效果
  starBonuses: StarBonus[];
}

// 技能实例（运行时）
export interface SkillInstance {
  skillId: string;
  // 当前等级
  currentLevel: number;
  // 最大等级（由星级决定）
  maxLevel: number;
  // 当前冷却
  currentCooldown?: number;
  // 当前能量
  currentEnergy?: number;
}

// 突破对技能的强化效果
export interface AscendSkillBonus {
  star: number;
  skillType: SkillType;
  effects: {
    skillLevelIncrease?: number;
    damageIncrease?: number;
    healIncrease?: number;
    cooldownReduce?: number;
    durationIncrease?: number;
    unlockFeature?: string;
  };
  description: string;
}

// 技能特性ID常量
export const SKILL_FEATURE_IDS = {
  CHAIN_ATTACK: 'chain_attack',
  LIFE_STEAL: 'life_steal',
  STUN: 'stun',
  IGNORE_DEFENSE: 'ignore_defense',
  EXECUTE: 'execute',
  TALENT_AWAKEN: 'talent_awaken',
} as const;

// 技能特性定义
export interface SkillFeature {
  id: string;
  name: string;
  description: string;
  value?: number;
  unit?: string;
}

// 技能定义
export interface SkillDefinition {
  id: string;
  name: string;
  type: SkillType;
  description: string;
  icon: string;
  effectType: SkillEffectType;
  targetType: TargetType;
  damageType?: SkillEffectType;
  features?: SkillFeature[];
  levelEffects: SkillLevelEffect[];
}

// 技能等级效果
export interface SkillLevelEffect {
  level: number;
  baseValue: number;
  multiplier: number;
  cooldown: number;
  energyCost?: number;
  triggerChance?: number;
  unlockedFeatures: string[];
}

// 战斗技能效果
export interface BattleSkillEffect {
  baseValue: number;
  multiplier: number;
  targetCount: number;
  canCrit: boolean;
  lifeStealPercent: number;
  additionalEffects: Record<string, number>;
}

// 星级突破强化效果表
export const SKILL_ASCEND_BONUSES: Record<number, Partial<Record<SkillType, AscendSkillBonus>>> = {
  2: {
    [SkillType.BASIC]: {
      star: 2,
      skillType: SkillType.BASIC,
      effects: { damageIncrease: 10 },
      description: '普攻伤害+10%',
    },
  },
  3: {
    [SkillType.SKILL]: {
      star: 3,
      skillType: SkillType.SKILL,
      effects: { cooldownReduce: 1 },
      description: '主动技能冷却-1秒',
    },
  },
  4: {
    [SkillType.BASIC]: {
      star: 4,
      skillType: SkillType.BASIC,
      effects: { unlockFeature: SKILL_FEATURE_IDS.CHAIN_ATTACK },
      description: '解锁连击特性',
    },
  },
  5: {
    [SkillType.ULTIMATE]: {
      star: 5,
      skillType: SkillType.ULTIMATE,
      effects: { damageIncrease: 20 },
      description: '终极技能伤害+20%',
    },
  },
};
