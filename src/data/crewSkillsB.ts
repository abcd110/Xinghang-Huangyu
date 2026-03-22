/**
 * B级船员技能定义（严格按照文档实现）
 * 共9个角色
 *
 * 技能升级规则：
 * - 普攻：5级
 * - 主动技能：4级基础+1级星级突破
 * - 终极技能：4级基础+1级星级突破
 * - 天赋：基础效果，4星强化，5星额外效果
 *
 * 能量系统：
 * - 普攻：+5点能量
 * - 主动技能：+20点能量
 * - 终极技能：消耗100点能量
 */

import {
  SkillSet,
  SkillType,
  SkillEffectType,
  TargetType,
  DamageType,
  TriggerTiming,
} from '../screens/crewScreen/types/skillTypes';

// ==================== B001 铁壁 ====================
export const CREW_B001: SkillSet = {
  basic: {
    id: 'b001_basic',
    name: '铁拳重击',
    description: '用机械义肢猛击，对敌方单体目标造成60%(70%/80%/90%/100%)防御力的伤害',
    icon: '🦾',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: DamageType.PHYSICAL,
    scaleStat: 'defense',
    levels: [
      { level: 1, value: 60, energyGain: 5, cooldown: 1 },
      { level: 2, value: 70, energyGain: 5, cooldown: 1 },
      { level: 3, value: 80, energyGain: 5, cooldown: 1 },
      { level: 4, value: 90, energyGain: 5, cooldown: 1 },
      { level: 5, value: 100, energyGain: 5, cooldown: 1 },
    ],
  },
  skill: {
    id: 'b001_skill',
    name: '护盾生成器',
    description: '为生命值最低的一个队友添加铁壁40%(50%/60%/70%/80%)防御力的护盾',
    icon: '🛡️',
    effectType: SkillEffectType.SHIELD,
    targetType: TargetType.LOWEST_HP,
    scaleStat: 'defense',
    levels: [
      { level: 1, value: 40, energyGain: 20, cooldown: 10 },
      { level: 2, value: 50, energyGain: 20, cooldown: 10 },
      { level: 3, value: 60, energyGain: 20, cooldown: 10 },
      { level: 4, value: 70, energyGain: 20, cooldown: 10 },
      { level: 5, value: 80, energyGain: 20, cooldown: 10 },
    ],
    specialEffect: {
      type: 'shield_cap',
      description: '该技能添加的护盾可重复添加，最多不超过铁壁防御力的200%',
    },
  },
  ultimate: {
    id: 'b001_ultimate',
    name: '绝对守护',
    description: '为全队添加铁壁40%(60%/80%/100%/120%)防御力的护盾',
    icon: '💎',
    effectType: SkillEffectType.SHIELD,
    targetType: TargetType.ALLIES,
    scaleStat: 'defense',
    levels: [
      { level: 1, value: 40, energyCost: 100 },
      { level: 2, value: 60, energyCost: 100 },
      { level: 3, value: 80, energyCost: 100 },
      { level: 4, value: 100, energyCost: 100 },
      { level: 5, value: 120, energyCost: 100 },
    ],
    specialEffect: {
      type: 'shield_cap',
      description: '终极技能添加的护盾最多不超过铁壁防御力的300%，可以和护盾生成器叠加(分别计算最大值)',
    },
  },
  talent: {
    id: 'b001_talent',
    name: '不动如山',
    description: '自身防御力提升10%，生命值低于70%时，自身防御力额外提升10%',
    icon: '🏔️',
    effectType: SkillEffectType.BUFF,
    effect: {
      description: '自身防御力提升10%，生命值低于70%时，自身防御力额外提升10%',
      baseValue: 10,
      unit: '%',
      enhancedValue4: 20,
    },
    star5Bonus: '战斗开始时，为所有队友添加100%防御力的护盾',
  },
  starBonuses: [
    { star: 1, description: '防御力提升10%', effectType: 'stat_boost', value: 10 },
    { star: 2, description: '主动技能等级+1', effectType: 'skill_level', targetSkill: SkillType.SKILL },
    { star: 3, description: '终极技能等级+1', effectType: 'skill_level', targetSkill: SkillType.ULTIMATE },
    { star: 4, description: '天赋的防御力提升效果变为20%', effectType: 'talent_enhance' },
    { star: 5, description: '战斗开始时，为所有队友添加100%防御力的护盾', effectType: 'special' },
  ],
};

// ==================== B002 赤焰 ====================
export const CREW_B002: SkillSet = {
  basic: {
    id: 'b002_basic',
    name: '等离子射击',
    description: '用等离子枪，对敌方单体目标造成60%(70%/80%/90%/100%)攻击力的伤害，并有60%基础概率施加1层灼烧',
    icon: '🔫',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: DamageType.ENERGY,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 60, energyGain: 5, cooldown: 1 },
      { level: 2, value: 70, energyGain: 5, cooldown: 1 },
      { level: 3, value: 80, energyGain: 5, cooldown: 1 },
      { level: 4, value: 90, energyGain: 5, cooldown: 1 },
      { level: 5, value: 100, energyGain: 5, cooldown: 1 },
    ],
    specialEffect: {
      type: 'burn',
      description: '有60%基础概率施加1层灼烧，每层灼烧每秒造成20%攻击力的伤害，持续5秒',
      procChances: [60, 60, 60, 60, 60],
    },
  },
  skill: {
    id: 'b002_skill',
    name: '爆裂弹',
    description: '发射爆裂弹，对敌方单体目标造成100%(120%/140%/160%/180%)攻击力伤害，并有100%基础概率施加1层灼烧',
    icon: '💥',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: DamageType.EXPLOSIVE,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 100, energyGain: 20, cooldown: 8, procChance: 100 },
      { level: 2, value: 120, energyGain: 20, cooldown: 8, procChance: 100 },
      { level: 3, value: 140, energyGain: 20, cooldown: 8, procChance: 100 },
      { level: 4, value: 160, energyGain: 20, cooldown: 8, procChance: 100 },
      { level: 5, value: 180, energyGain: 20, cooldown: 8, procChance: 100 },
    ],
    specialEffect: {
      type: 'burn',
      description: '有100%基础概率施加1层灼烧，每层灼烧每秒造成20%攻击力的伤害，持续5秒',
      procChances: [100, 100, 100, 100, 100],
    },
  },
  ultimate: {
    id: 'b002_ultimate',
    name: '等离子风暴',
    description: '对敌方单体目标造成200%(220%/240%/260%/280%)攻击力伤害，并有100%基础概率施加3层灼烧',
    icon: '🌪️',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: DamageType.ENERGY,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 200, energyCost: 100 },
      { level: 2, value: 220, energyCost: 100 },
      { level: 3, value: 240, energyCost: 100 },
      { level: 4, value: 260, energyCost: 100 },
      { level: 5, value: 280, energyCost: 100 },
    ],
    specialEffect: {
      type: 'burn',
      description: '有100%基础概率施加3层灼烧，每层灼烧每秒造成20%攻击力的伤害，持续5秒',
    },
  },
  talent: {
    id: 'b002_talent',
    name: '怒火中烧',
    description: '敌方目标每有一层灼烧，对目标的伤害提升4%',
    icon: '🔥',
    effectType: SkillEffectType.BUFF,
    effect: {
      description: '敌方目标每有一层灼烧，对目标的伤害提升4%',
      baseValue: 4,
      unit: '%',
      enhancedValue4: 6,
    },
    star5Bonus: '战斗开始时，100%基础概率对敌方随机单体目标施加1层灼烧',
  },
  starBonuses: [
    { star: 1, description: '攻击力提升10%', effectType: 'stat_boost', value: 10 },
    { star: 2, description: '主动技能等级+1', effectType: 'skill_level', targetSkill: SkillType.SKILL },
    { star: 3, description: '终极技能等级+1', effectType: 'skill_level', targetSkill: SkillType.ULTIMATE },
    { star: 4, description: '天赋的伤害提升效果变为6%', effectType: 'talent_enhance' },
    { star: 5, description: '战斗开始时，100%基础概率对敌方随机单体目标施加1层灼烧', effectType: 'special' },
  ],
};

// ==================== B003 白鸽 ====================
export const CREW_B003: SkillSet = {
  basic: {
    id: 'b003_basic',
    name: '医疗射线',
    description: '对敌方单体目标造成20%(30%/40%/50%/60%)攻击力的伤害',
    icon: '💉',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: DamageType.ENERGY,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 20, energyGain: 5, cooldown: 1 },
      { level: 2, value: 30, energyGain: 5, cooldown: 1 },
      { level: 3, value: 40, energyGain: 5, cooldown: 1 },
      { level: 4, value: 50, energyGain: 5, cooldown: 1 },
      { level: 5, value: 60, energyGain: 5, cooldown: 1 },
    ],
  },
  skill: {
    id: 'b003_skill',
    name: '紧急包扎',
    description: '恢复我方生命值最低的单位20%(40%/60%/80%/100%)攻击力的生命',
    icon: '🏥',
    effectType: SkillEffectType.HEAL,
    targetType: TargetType.LOWEST_HP,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 20, energyGain: 20, cooldown: 10 },
      { level: 2, value: 40, energyGain: 20, cooldown: 10 },
      { level: 3, value: 60, energyGain: 20, cooldown: 10 },
      { level: 4, value: 80, energyGain: 20, cooldown: 10 },
      { level: 5, value: 100, energyGain: 20, cooldown: 10 },
    ],
  },
  ultimate: {
    id: 'b003_ultimate',
    name: '生命绽放',
    description: '恢复全体队友20%(40%/60%/80%/100%)攻击力的生命',
    icon: '🌸',
    effectType: SkillEffectType.HEAL,
    targetType: TargetType.ALLIES,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 20, energyCost: 100 },
      { level: 2, value: 40, energyCost: 100 },
      { level: 3, value: 60, energyCost: 100 },
      { level: 4, value: 80, energyCost: 100 },
      { level: 5, value: 100, energyCost: 100 },
    ],
  },
  talent: {
    id: 'b003_talent',
    name: '仁心仁术',
    description: '治疗效果提升10%',
    icon: '💝',
    effectType: SkillEffectType.BUFF,
    effect: {
      description: '治疗效果提升10%',
      baseValue: 10,
      unit: '%',
      enhancedValue4: 20,
    },
    star5Bonus: '战斗开始时和释放终极技能时(在终极技能效果生效前施加"活力"效果)，为所有队友添加"活力"效果，持续20秒，持有"活力"效果的队友，受到的治疗效果提升10%，活力效果不可叠加',
  },
  starBonuses: [
    { star: 1, description: '治疗效果提升10%', effectType: 'stat_boost', value: 10 },
    { star: 2, description: '主动技能等级+1', effectType: 'skill_level', targetSkill: SkillType.SKILL },
    { star: 3, description: '终极技能等级+1', effectType: 'skill_level', targetSkill: SkillType.ULTIMATE },
    { star: 4, description: '天赋的治疗效果提升效果变为20%', effectType: 'talent_enhance' },
    { star: 5, description: '战斗开始时和释放终极技能时为所有队友添加"活力"效果', effectType: 'special' },
  ],
};

// ==================== B004 齿轮 ====================
export const CREW_B004: SkillSet = {
  basic: {
    id: 'b004_basic',
    name: '扳手投掷',
    description: '对敌方单体目标造成20%(30%/40%/50%/60%)攻击力的伤害',
    icon: '🔧',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: DamageType.PHYSICAL,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 20, energyGain: 5, cooldown: 1 },
      { level: 2, value: 30, energyGain: 5, cooldown: 1 },
      { level: 3, value: 40, energyGain: 5, cooldown: 1 },
      { level: 4, value: 50, energyGain: 5, cooldown: 1 },
      { level: 5, value: 60, energyGain: 5, cooldown: 1 },
    ],
  },
  skill: {
    id: 'b004_skill',
    name: '机械助手',
    description: '召唤1(1/2/3/4)架无人机，无人机每2秒对敌方单体目标造成10%(15%/20%/25%/30%)攻击力的伤害',
    icon: '🤖',
    effectType: SkillEffectType.SUMMON,
    targetType: TargetType.SELF,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 10, energyGain: 20, cooldown: 10 },
      { level: 2, value: 15, energyGain: 20, cooldown: 10 },
      { level: 3, value: 20, energyGain: 20, cooldown: 10 },
      { level: 4, value: 25, energyGain: 20, cooldown: 10 },
      { level: 5, value: 30, energyGain: 20, cooldown: 10 },
    ],
    specialEffect: {
      type: 'summon_drone',
      description: '召唤1/1/2/3/4架无人机，无人机每2秒对敌方单体目标造成10%/15%/20%/25%/30%攻击力的伤害，每架无人机存在时间5秒，超过时间后，无人机自动销毁',
    },
  },
  ultimate: {
    id: 'b004_ultimate',
    name: '废料轰炸',
    description: '立即召唤2架无人机，并且无人机攻击间隔变为1秒，持续10秒',
    icon: '💣',
    effectType: SkillEffectType.SUMMON,
    targetType: TargetType.SELF,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 0, energyCost: 100 },
      { level: 2, value: 0, energyCost: 100 },
      { level: 3, value: 0, energyCost: 100 },
      { level: 4, value: 0, energyCost: 100 },
      { level: 5, value: 0, energyCost: 100 },
    ],
    specialEffect: {
      type: 'enhance_drones',
      description: '立即召唤2架无人机，并且无人机攻击间隔变为1秒，持续10秒',
    },
  },
  talent: {
    id: 'b004_talent',
    name: '废料轰炸',
    description: '无人机造成伤害时有60%基础概率施加破甲效果',
    icon: '♻️',
    effectType: SkillEffectType.DEBUFF,
    effect: {
      description: '无人机造成伤害时有60%基础概率施加破甲效果，破甲效果持续5秒，效果：目标的防御力下降10%，不可叠加',
      baseValue: 10,
      unit: '%',
      enhancedValue4: 20,
    },
    star5Bonus: '战斗开始时，100%基础概率对敌方随机单体目标施加破甲效果',
  },
  starBonuses: [
    { star: 1, description: '攻击力提升10%', effectType: 'stat_boost', value: 10 },
    { star: 2, description: '主动技能等级+1', effectType: 'skill_level', targetSkill: SkillType.SKILL },
    { star: 3, description: '终极技能等级+1', effectType: 'skill_level', targetSkill: SkillType.ULTIMATE },
    { star: 4, description: '天赋的破甲效果提升为20%', effectType: 'talent_enhance' },
    { star: 5, description: '战斗开始时，100%基础概率对敌方随机单体目标施加破甲效果', effectType: 'special' },
  ],
};

// ==================== B005 幽灵 ====================
export const CREW_B005: SkillSet = {
  basic: {
    id: 'b005_basic',
    name: '数据入侵',
    description: '对敌方单体目标造成20%(30%/40%/50%/60%)攻击力的伤害',
    icon: '💻',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: DamageType.ELECTRIC,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 20, energyGain: 5, cooldown: 1 },
      { level: 2, value: 30, energyGain: 5, cooldown: 1 },
      { level: 3, value: 40, energyGain: 5, cooldown: 1 },
      { level: 4, value: 50, energyGain: 5, cooldown: 1 },
      { level: 5, value: 60, energyGain: 5, cooldown: 1 },
    ],
  },
  skill: {
    id: 'b005_skill',
    name: '系统瘫痪',
    description: '对敌方单体目标造成20%(30%/40%/50%/60%)攻击力伤害，并有10%(15%/20%/25%/30%)基础概率眩晕目标',
    icon: '⚡',
    effectType: SkillEffectType.CONTROL,
    targetType: TargetType.SINGLE,
    damageType: DamageType.ELECTRIC,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 20, energyGain: 20, cooldown: 6, procChance: 10 },
      { level: 2, value: 30, energyGain: 20, cooldown: 6, procChance: 15 },
      { level: 3, value: 40, energyGain: 20, cooldown: 6, procChance: 20 },
      { level: 4, value: 50, energyGain: 20, cooldown: 6, procChance: 25 },
      { level: 5, value: 60, energyGain: 20, cooldown: 6, procChance: 30 },
    ],
    specialEffect: {
      type: 'stun',
      description: '有10%/15%/20%/25%/30%基础概率眩晕目标，眩晕：停止行动3秒',
      procChances: [10, 15, 20, 25, 30],
    },
  },
  ultimate: {
    id: 'b005_ultimate',
    name: '木马爆发',
    description: '对敌方攻击力最高的单位施加"木马"',
    icon: '🐎',
    effectType: SkillEffectType.DEBUFF,
    targetType: TargetType.HIGHEST_ATTACK,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 30, energyCost: 100 },
      { level: 2, value: 30, energyCost: 100 },
      { level: 3, value: 30, energyCost: 100 },
      { level: 4, value: 30, energyCost: 100 },
      { level: 5, value: 30, energyCost: 100 },
    ],
    specialEffect: {
      type: 'trojan',
      description: '对敌方攻击力最高的单位施加"木马"，木马效果：攻击力降低30%，持续10秒，不可叠加',
    },
  },
  talent: {
    id: 'b005_talent',
    name: '隐匿',
    description: '当我方还存在其他队友时，15%概率闪避敌方攻击',
    icon: '👻',
    effectType: SkillEffectType.BUFF,
    triggerTiming: TriggerTiming.ON_HIT,
    effect: {
      description: '当我方还存在其他队友时，15%概率闪避敌方攻击',
      baseValue: 15,
      unit: '%',
      enhancedValue4: 20,
    },
    star5Bonus: '战斗开始时，对敌方攻击力最高的单位施加"木马"效果',
  },
  starBonuses: [
    { star: 1, description: '闪避提升10%', effectType: 'stat_boost', value: 10 },
    { star: 2, description: '主动技能等级+1', effectType: 'skill_level', targetSkill: SkillType.SKILL },
    { star: 3, description: '终极技能等级+1', effectType: 'skill_level', targetSkill: SkillType.ULTIMATE },
    { star: 4, description: '天赋的闪避概率提升为20%', effectType: 'talent_enhance' },
    { star: 5, description: '战斗开始时，对敌方攻击力最高的单位施加"木马"效果', effectType: 'special' },
  ],
};

// ==================== B006 磐石 ====================
export const CREW_B006: SkillSet = {
  basic: {
    id: 'b006_basic',
    name: '军体拳',
    description: '对敌方单体目标造成20%(30%/40%/50%/60%)防御力的伤害',
    icon: '👊',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: DamageType.PHYSICAL,
    scaleStat: 'defense',
    levels: [
      { level: 1, value: 20, energyGain: 5, cooldown: 1 },
      { level: 2, value: 30, energyGain: 5, cooldown: 1 },
      { level: 3, value: 40, energyGain: 5, cooldown: 1 },
      { level: 4, value: 50, energyGain: 5, cooldown: 1 },
      { level: 5, value: 60, energyGain: 5, cooldown: 1 },
    ],
  },
  skill: {
    id: 'b006_skill',
    name: '战壕掩护',
    description: '为我方全体单位分担10%(12%/14%/16%/20%)伤害，持续5秒',
    icon: '🛡️',
    effectType: SkillEffectType.BUFF,
    targetType: TargetType.ALLIES,
    scaleStat: 'defense',
    levels: [
      { level: 1, value: 10, energyGain: 20, cooldown: 6 },
      { level: 2, value: 12, energyGain: 20, cooldown: 6 },
      { level: 3, value: 14, energyGain: 20, cooldown: 6 },
      { level: 4, value: 16, energyGain: 20, cooldown: 6 },
      { level: 5, value: 20, energyGain: 20, cooldown: 6 },
    ],
    specialEffect: {
      type: 'damage_share',
      description: '为我方全体单位分担10%/12%/14%/16%/20%伤害，持续5秒，单次分担的伤害最多为磐石防御力的100%',
    },
  },
  ultimate: {
    id: 'b006_ultimate',
    name: '钢铁防线',
    description: '防御提升100%，持续20秒，不可叠加；并回复相当于自身防御力50%的生命值',
    icon: '🏰',
    effectType: SkillEffectType.BUFF,
    targetType: TargetType.SELF,
    scaleStat: 'defense',
    levels: [
      { level: 1, value: 100, energyCost: 100 },
      { level: 2, value: 100, energyCost: 100 },
      { level: 3, value: 100, energyCost: 100 },
      { level: 4, value: 100, energyCost: 100 },
      { level: 5, value: 100, energyCost: 100 },
    ],
    specialEffect: {
      type: 'defense_boost',
      description: '防御提升100%，持续20秒，不可叠加；并回复相当于自身防御力50%的生命值',
    },
  },
  talent: {
    id: 'b006_talent',
    name: '老兵不死',
    description: '每场战斗1次，受到致命伤害时保留1点生命并恢复20%生命',
    icon: '🎖️',
    effectType: SkillEffectType.BUFF,
    triggerTiming: TriggerTiming.ON_HP_BELOW,
    triggerThreshold: 0,
    effect: {
      description: '每场战斗1次，受到致命伤害时保留1点生命并恢复20%生命',
      baseValue: 20,
      unit: '%',
      enhancedValue4: 40,
    },
    star5Bonus: '触发天赋"老兵不死"后，防御力提升100%，持续30秒',
  },
  starBonuses: [
    { star: 1, description: '防御提升10%', effectType: 'stat_boost', value: 10 },
    { star: 2, description: '主动技能等级+1', effectType: 'skill_level', targetSkill: SkillType.SKILL },
    { star: 3, description: '终极技能等级+1', effectType: 'skill_level', targetSkill: SkillType.ULTIMATE },
    { star: 4, description: '天赋恢复生命提升为40%', effectType: 'talent_enhance' },
    { star: 5, description: '触发天赋"老兵不死"后，防御力提升100%，持续30秒', effectType: 'special' },
  ],
};

// ==================== B007 闪电 ====================
export const CREW_B007: SkillSet = {
  basic: {
    id: 'b007_basic',
    name: '闪电突袭',
    description: '对敌方单体目标造成20%(30%/40%/50%/60%)攻击力的伤害',
    icon: '⚡',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: DamageType.ELECTRIC,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 20, energyGain: 5, cooldown: 1 },
      { level: 2, value: 30, energyGain: 5, cooldown: 1 },
      { level: 3, value: 40, energyGain: 5, cooldown: 1 },
      { level: 4, value: 50, energyGain: 5, cooldown: 1 },
      { level: 5, value: 60, energyGain: 5, cooldown: 1 },
    ],
  },
  skill: {
    id: 'b007_skill',
    name: '疾风',
    description: '攻速提升10%(15%/20%/25%/30%)，最多叠加3次',
    icon: '💨',
    effectType: SkillEffectType.BUFF,
    targetType: TargetType.SELF,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 10, energyGain: 20, cooldown: 10 },
      { level: 2, value: 15, energyGain: 20, cooldown: 10 },
      { level: 3, value: 20, energyGain: 20, cooldown: 10 },
      { level: 4, value: 25, energyGain: 20, cooldown: 10 },
      { level: 5, value: 30, energyGain: 20, cooldown: 10 },
    ],
    specialEffect: {
      type: 'speed_boost',
      description: '攻速提升10%/15%/20%/25%/30%，最多叠加3次',
    },
    maxStacks: 3,
  },
  ultimate: {
    id: 'b007_ultimate',
    name: '雷霆万钧',
    description: '对所有敌人造成100%(120%/140%/160%/180%)攻击力伤害，为普攻附加连锁效果，持续5秒',
    icon: '⛈️',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.ALL,
    damageType: DamageType.ELECTRIC,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 100, energyCost: 100 },
      { level: 2, value: 120, energyCost: 100 },
      { level: 3, value: 140, energyCost: 100 },
      { level: 4, value: 160, energyCost: 100 },
      { level: 5, value: 180, energyCost: 100 },
    ],
    specialEffect: {
      type: 'chain_attack',
      description: '为普攻附加连锁效果，持续5秒；连锁：攻击对主目标的邻近目标造成20%攻击力伤害',
    },
  },
  talent: {
    id: 'b007_talent',
    name: '先发制人',
    description: '攻速超过1时，伤害提升10%',
    icon: '🏃',
    effectType: SkillEffectType.BUFF,
    effect: {
      description: '攻速超过1时，伤害提升10%',
      baseValue: 10,
      unit: '%',
      enhancedValue4: 20,
    },
    star5Bonus: '每次触发连锁效果，攻速提升10%，最多提升50%',
  },
  starBonuses: [
    { star: 1, description: '攻速提升10%', effectType: 'stat_boost', value: 10 },
    { star: 2, description: '主动技能等级+1', effectType: 'skill_level', targetSkill: SkillType.SKILL },
    { star: 3, description: '终极技能等级+1', effectType: 'skill_level', targetSkill: SkillType.ULTIMATE },
    { star: 4, description: '天赋的伤害提升效果变为20%', effectType: 'talent_enhance' },
    { star: 5, description: '每次触发连锁效果，攻速提升10%，最多提升50%', effectType: 'special' },
  ],
};

// ==================== B008 信号 ====================
export const CREW_B008: SkillSet = {
  basic: {
    id: 'b008_basic',
    name: '信号干扰',
    description: '对敌方单体目标造成20%(30%/40%/50%/60%)攻击力的伤害',
    icon: '📡',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: DamageType.ELECTRIC,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 20, energyGain: 5, cooldown: 1 },
      { level: 2, value: 30, energyGain: 5, cooldown: 1 },
      { level: 3, value: 40, energyGain: 5, cooldown: 1 },
      { level: 4, value: 50, energyGain: 5, cooldown: 1 },
      { level: 5, value: 60, energyGain: 5, cooldown: 1 },
    ],
  },
  skill: {
    id: 'b008_skill',
    name: '战术指挥',
    description: '全队攻击力提升15%(20%/25%/30%/40%)，持续5秒',
    icon: '📢',
    effectType: SkillEffectType.BUFF,
    targetType: TargetType.ALLIES,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 15, energyGain: 20, cooldown: 10 },
      { level: 2, value: 20, energyGain: 20, cooldown: 10 },
      { level: 3, value: 25, energyGain: 20, cooldown: 10 },
      { level: 4, value: 30, energyGain: 20, cooldown: 10 },
      { level: 5, value: 40, energyGain: 20, cooldown: 10 },
    ],
    specialEffect: {
      type: 'attack_boost',
      description: '全队攻击力提升15%/20%/25%/30%/40%，持续5秒',
    },
  },
  ultimate: {
    id: 'b008_ultimate',
    name: '全面覆盖',
    description: '全队伤害提升10%(12%/14%/16%/20%)，持续10秒',
    icon: '📻',
    effectType: SkillEffectType.BUFF,
    targetType: TargetType.ALLIES,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 10, energyCost: 100 },
      { level: 2, value: 12, energyCost: 100 },
      { level: 3, value: 14, energyCost: 100 },
      { level: 4, value: 16, energyCost: 100 },
      { level: 5, value: 20, energyCost: 100 },
    ],
    specialEffect: {
      type: 'damage_boost',
      description: '全队伤害提升10%/12%/14%/16%/20%，持续10秒',
    },
  },
  talent: {
    id: 'b008_talent',
    name: '情报共享',
    description: '全队生命值提升10%',
    icon: '📊',
    effectType: SkillEffectType.BUFF,
    effect: {
      description: '全队生命值提升10%',
      baseValue: 10,
      unit: '%',
      enhancedValue4: 20,
    },
    star5Bonus: '我方全体暴击率提升5%',
  },
  starBonuses: [
    { star: 1, description: '生命值提升10%', effectType: 'stat_boost', value: 10 },
    { star: 2, description: '主动技能等级+1', effectType: 'skill_level', targetSkill: SkillType.SKILL },
    { star: 3, description: '终极技能等级+1', effectType: 'skill_level', targetSkill: SkillType.ULTIMATE },
    { star: 4, description: '天赋的生命值提升效果变为20%', effectType: 'talent_enhance' },
    { star: 5, description: '我方全体暴击率提升5%', effectType: 'special' },
  ],
};

// ==================== B009 病毒 ====================
export const CREW_B009: SkillSet = {
  basic: {
    id: 'b009_basic',
    name: '恶意代码',
    description: '对敌方单体目标造成20%(30%/40%/50%/60%)攻击力的伤害',
    icon: '💻',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: DamageType.CORROSION,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 20, energyGain: 5, cooldown: 1 },
      { level: 2, value: 30, energyGain: 5, cooldown: 1 },
      { level: 3, value: 40, energyGain: 5, cooldown: 1 },
      { level: 4, value: 50, energyGain: 5, cooldown: 1 },
      { level: 5, value: 60, energyGain: 5, cooldown: 1 },
    ],
  },
  skill: {
    id: 'b009_skill',
    name: '防火墙突破',
    description: '使敌方防御力最高的目标防御降低10%(12%/14%/16%/20%)，持续5秒',
    icon: '🔓',
    effectType: SkillEffectType.DEBUFF,
    targetType: TargetType.HIGHEST_DEFENSE,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 10, energyGain: 20, cooldown: 10 },
      { level: 2, value: 12, energyGain: 20, cooldown: 10 },
      { level: 3, value: 14, energyGain: 20, cooldown: 10 },
      { level: 4, value: 16, energyGain: 20, cooldown: 10 },
      { level: 5, value: 20, energyGain: 20, cooldown: 10 },
    ],
    specialEffect: {
      type: 'defense_reduce',
      description: '使敌方防御力最高的目标防御降低10%/12%/14%/16%/20%，持续5秒',
    },
  },
  ultimate: {
    id: 'b009_ultimate',
    name: '系统崩溃',
    description: '使敌方全体单位的防御力降低5%(8%/12%/16%/20%)，持续10秒',
    icon: '💀',
    effectType: SkillEffectType.DEBUFF,
    targetType: TargetType.ALL,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 5, energyCost: 100 },
      { level: 2, value: 8, energyCost: 100 },
      { level: 3, value: 12, energyCost: 100 },
      { level: 4, value: 16, energyCost: 100 },
      { level: 5, value: 20, energyCost: 100 },
    ],
    specialEffect: {
      type: 'defense_reduce_all',
      description: '使敌方全体单位的防御力降低5%/8%/12%/16%/20%，持续10秒',
    },
  },
  talent: {
    id: 'b009_talent',
    name: '病毒传播',
    description: '攻击有30%概率降低目标的防御力5%，不可叠加',
    icon: '🦠',
    effectType: SkillEffectType.DEBUFF,
    triggerTiming: TriggerTiming.ON_ATTACK,
    effect: {
      description: '攻击有30%概率降低目标的防御力5%，不可叠加',
      baseValue: 5,
      unit: '%',
      enhancedValue4: 10,
    },
    star5Bonus: '天赋的概率提升为50%',
  },
  starBonuses: [
    { star: 1, description: '攻击力提升10%', effectType: 'stat_boost', value: 10 },
    { star: 2, description: '主动技能等级+1', effectType: 'skill_level', targetSkill: SkillType.SKILL },
    { star: 3, description: '终极技能等级+1', effectType: 'skill_level', targetSkill: SkillType.ULTIMATE },
    { star: 4, description: '天赋的防御力降低效果变为10%', effectType: 'talent_enhance' },
    { star: 5, description: '天赋的概率提升为50%', effectType: 'special' },
  ],
};

// B级船员技能映射
export const B_CREW_SKILLS: Record<string, SkillSet> = {
  'crew_b_001': CREW_B001,  // 铁壁
  'crew_b_002': CREW_B002,  // 赤焰
  'crew_b_003': CREW_B003,  // 白鸽
  'crew_b_004': CREW_B004,  // 齿轮
  'crew_b_005': CREW_B005,  // 幽灵
  'crew_b_006': CREW_B006,  // 磐石
  'crew_b_007': CREW_B007,  // 闪电
  'crew_b_008': CREW_B008,  // 信号
  'crew_b_009': CREW_B009,  // 病毒
};

// 获取B级船员技能
export function getBCrewSkills(crewId: string): SkillSet | undefined {
  return B_CREW_SKILLS[crewId];
}
