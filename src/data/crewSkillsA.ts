/**
 * A级船员技能定义（严格按照文档实现）
 * 共10个角色
 *
 * 技能升级规则：
 * - 普攻：5级（60%/70%/80%/90%/100%）
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

// ==================== A001 泰坦 ====================
export const CREW_A001: SkillSet = {
  basic: {
    id: 'a001_basic',
    name: '重拳打击',
    description: '用机械臂猛击，对敌方单体目标造成60%(70%/80%/90%/100%)防御力的伤害，并有20%概率降低目标20%攻击，持续5秒',
    icon: '👊',
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
    specialEffect: {
      type: 'attack_reduce',
      description: '有20%概率降低目标20%攻击，持续5秒',
      procChances: [20, 20, 20, 20, 20],
    },
  },
  skill: {
    id: 'a001_skill',
    name: '能量护盾',
    description: '为全队添加泰坦150%(170%/190%/210%/230%)防御力的护盾，可以叠加，最多不超过泰坦防御力的500%',
    icon: '🛡️',
    effectType: SkillEffectType.SHIELD,
    targetType: TargetType.ALLIES,
    scaleStat: 'defense',
    levels: [
      { level: 1, value: 150, energyGain: 20, cooldown: 10 },
      { level: 2, value: 170, energyGain: 20, cooldown: 10 },
      { level: 3, value: 190, energyGain: 20, cooldown: 10 },
      { level: 4, value: 210, energyGain: 20, cooldown: 10 },
      { level: 5, value: 230, energyGain: 20, cooldown: 10 },
    ],
    specialEffect: {
      type: 'shield_cap',
      description: '护盾可叠加，最多不超过泰坦防御力的500%',
    },
  },
  ultimate: {
    id: 'a001_ultimate',
    name: '泰坦之壁',
    description: '全队无敌2秒，并恢复相当于泰坦15%(18%/21%/24%/30%)最大生命值的生命值',
    icon: '🏰',
    effectType: SkillEffectType.BUFF,
    targetType: TargetType.ALLIES,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 15, energyCost: 100 },
      { level: 2, value: 18, energyCost: 100 },
      { level: 3, value: 21, energyCost: 100 },
      { level: 4, value: 24, energyCost: 100 },
      { level: 5, value: 30, energyCost: 100 },
    ],
    specialEffect: {
      type: 'invincible_heal',
      description: '全队无敌2秒，并恢复最大生命值',
    },
  },
  talent: {
    id: 'a001_talent',
    name: '钢铁意志',
    description: '在拥有护盾时，防御提升10%',
    icon: '🔩',
    effectType: SkillEffectType.BUFF,
    triggerTiming: TriggerTiming.CONTINUOUS,
    effect: {
      description: '在拥有护盾时，防御提升10%',
      baseValue: 10,
      unit: '%',
      enhancedValue4: 20,
    },
    star5Bonus: '在拥有护盾时，受到伤害降低10%',
  },
  starBonuses: [
    { star: 1, description: '防御力提升15%', effectType: 'stat_boost', value: 15 },
    { star: 2, description: '主动技能等级+1', effectType: 'skill_level', targetSkill: SkillType.SKILL },
    { star: 3, description: '终极技能等级+1', effectType: 'skill_level', targetSkill: SkillType.ULTIMATE },
    { star: 4, description: '天赋的防御提升效果变为20%', effectType: 'talent_enhance' },
    { star: 5, description: '在拥有护盾时，受到伤害降低10%', effectType: 'special' },
  ],
};

// ==================== A002 猎鹰 ====================
export const CREW_A002: SkillSet = {
  basic: {
    id: 'a002_basic',
    name: '精准狙击',
    description: '对敌方单体目标造成80%(100%/120%/140%/160%)攻击力的伤害',
    icon: '🎯',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: DamageType.PHYSICAL,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 80, energyGain: 5, cooldown: 1 },
      { level: 2, value: 100, energyGain: 5, cooldown: 1 },
      { level: 3, value: 120, energyGain: 5, cooldown: 1 },
      { level: 4, value: 140, energyGain: 5, cooldown: 1 },
      { level: 5, value: 160, energyGain: 5, cooldown: 1 },
    ],
  },
  skill: {
    id: 'a002_skill',
    name: '穿甲弹',
    description: '为普攻装填3发穿甲弹，穿甲弹造成的暴击伤害提升20%，且无视目标10%防御',
    icon: '💥',
    effectType: SkillEffectType.BUFF,
    targetType: TargetType.SELF,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 20, energyGain: 20, cooldown: 8 },
      { level: 2, value: 20, energyGain: 20, cooldown: 8 },
      { level: 3, value: 20, energyGain: 20, cooldown: 8 },
      { level: 4, value: 20, energyGain: 20, cooldown: 8 },
      { level: 5, value: 20, energyGain: 20, cooldown: 8 },
    ],
    specialEffect: {
      type: 'armor_piercing_ammo',
      description: '为普攻装填3发穿甲弹，穿甲弹造成的暴击伤害提升20%，且无视目标10%防御',
    },
  },
  ultimate: {
    id: 'a002_ultimate',
    name: '死亡狙击',
    description: '对生命值最低敌人造成400%(440%/480%/520%/600%)攻击力伤害，击杀后回复50能量',
    icon: '☠️',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.LOWEST_HP,
    damageType: DamageType.PHYSICAL,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 400, energyCost: 100 },
      { level: 2, value: 440, energyCost: 100 },
      { level: 3, value: 480, energyCost: 100 },
      { level: 4, value: 520, energyCost: 100 },
      { level: 5, value: 600, energyCost: 100 },
    ],
    specialEffect: {
      type: 'kill_reset',
      description: '击杀目标后回复50能量',
    },
  },
  talent: {
    id: 'a002_talent',
    name: '鹰眼',
    description: '普攻暴击率额外提升10%，无视目标5%防御',
    icon: '🦅',
    effectType: SkillEffectType.BUFF,
    triggerTiming: TriggerTiming.CONTINUOUS,
    effect: {
      description: '普攻暴击率额外提升10%，无视目标5%防御',
      baseValue: 10,
      unit: '%',
      enhancedValue4: 20,
    },
    star5Bonus: '暴击时必定再次攻击(每3秒最多触发1次)',
  },
  starBonuses: [
    { star: 1, description: '暴击率提升10%', effectType: 'stat_boost', value: 10 },
    { star: 2, description: '主动技能等级+1', effectType: 'skill_level', targetSkill: SkillType.SKILL },
    { star: 3, description: '终极技能等级+1', effectType: 'skill_level', targetSkill: SkillType.ULTIMATE },
    { star: 4, description: '天赋的暴击率提升效果变为20%', effectType: 'talent_enhance' },
    { star: 5, description: '暴击时必定再次攻击(每3秒最多触发1次)', effectType: 'special' },
  ],
};

// ==================== A003 天使 ====================
export const CREW_A003: SkillSet = {
  basic: {
    id: 'a003_basic',
    name: '治愈之光',
    description: '对敌方单体目标造成20%(30%/40%/50%/60%)攻击力的伤害，并治疗生命最低队友攻击力40%(50%/60%/70%/80%)的生命',
    icon: '✨',
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
    specialEffect: {
      type: 'damage_and_heal',
      description: '治疗生命最低队友攻击力40%/50%/60%/70%/80%的生命',
    },
  },
  skill: {
    id: 'a003_skill',
    name: '神圣治疗',
    description: '治疗生命值最低队友攻击力200%(230%/260%/290%/320%)的生命，清除所有减益，并添加持续恢复效果，每秒恢复攻击力30%生命，持续3秒',
    icon: '🏥',
    effectType: SkillEffectType.HEAL,
    targetType: TargetType.LOWEST_HP,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 200, energyGain: 20, cooldown: 10 },
      { level: 2, value: 230, energyGain: 20, cooldown: 10 },
      { level: 3, value: 260, energyGain: 20, cooldown: 10 },
      { level: 4, value: 290, energyGain: 20, cooldown: 10 },
      { level: 5, value: 320, energyGain: 20, cooldown: 10 },
    ],
    specialEffect: {
      type: 'heal_cleanse_hot',
      description: '清除所有减益，并添加持续恢复效果，每秒恢复攻击力30%生命，持续3秒',
    },
  },
  ultimate: {
    id: 'a003_ultimate',
    name: '天使降临',
    description: '复活1名阵亡队友并恢复40%(50%/60%/70%/80%)生命，若无阵亡则全体恢复250%(280%/310%/340%/400%)攻击力生命',
    icon: '👼',
    effectType: SkillEffectType.HEAL,
    targetType: TargetType.ALLIES,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 250, energyCost: 100 },
      { level: 2, value: 280, energyCost: 100 },
      { level: 3, value: 310, energyCost: 100 },
      { level: 4, value: 340, energyCost: 100 },
      { level: 5, value: 400, energyCost: 100 },
    ],
    specialEffect: {
      type: 'revive_or_heal_all',
      description: '复活1名阵亡队友并恢复40%/50%/60%/70%/80%生命，若无阵亡则全体恢复攻击力生命',
    },
  },
  talent: {
    id: 'a003_talent',
    name: '生命祝福',
    description: '队友生命上限提升10%，受到的治疗效果提升20%',
    icon: '💝',
    effectType: SkillEffectType.BUFF,
    effect: {
      description: '队友生命上限提升10%，受到的治疗效果提升20%',
      baseValue: 20,
      unit: '%',
      enhancedValue4: 30,
    },
    star5Bonus: '战斗开始时，为所有队友添加"守护天使"效果，受到致命伤害时保留1点生命并恢复20%生命(每场战斗1次)',
  },
  starBonuses: [
    { star: 1, description: '治疗效果提升15%', effectType: 'stat_boost', value: 15 },
    { star: 2, description: '主动技能等级+1', effectType: 'skill_level', targetSkill: SkillType.SKILL },
    { star: 3, description: '终极技能等级+1', effectType: 'skill_level', targetSkill: SkillType.ULTIMATE },
    { star: 4, description: '天赋的生命上限提升效果变为15%', effectType: 'talent_enhance' },
    { star: 5, description: '战斗开始时，为所有队友添加"守护天使"效果，受到致命伤害时保留1点生命并恢复20%生命(每场战斗1次)', effectType: 'special' },
  ],
};

// ==================== A004 工程师 ====================
export const CREW_A004: SkillSet = {
  basic: {
    id: 'a004_basic',
    name: '扳手飞掷',
    description: '对敌方单体目标造成20%(30%/40%/50%/60%)攻击力的伤害，25%概率眩晕目标1.5秒',
    icon: '🔧',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: DamageType.PHYSICAL,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 20, energyGain: 5, cooldown: 1, procChance: 25 },
      { level: 2, value: 30, energyGain: 5, cooldown: 1, procChance: 25 },
      { level: 3, value: 40, energyGain: 5, cooldown: 1, procChance: 25 },
      { level: 4, value: 50, energyGain: 5, cooldown: 1, procChance: 25 },
      { level: 5, value: 60, energyGain: 5, cooldown: 1, procChance: 25 },
    ],
    specialEffect: {
      type: 'stun',
      description: '25%概率眩晕目标1.5秒',
      procChances: [25, 25, 25, 25, 25],
    },
  },
  skill: {
    id: 'a004_skill',
    name: '部署炮台',
    description: '召唤自动炮台，炮台每2秒攻击随机敌人造成攻击力80%(100%/120%/140%/160%)伤害，持续8秒',
    icon: '🤖',
    effectType: SkillEffectType.SUMMON,
    targetType: TargetType.SELF,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 80, energyGain: 20, cooldown: 12 },
      { level: 2, value: 100, energyGain: 20, cooldown: 12 },
      { level: 3, value: 120, energyGain: 20, cooldown: 12 },
      { level: 4, value: 140, energyGain: 20, cooldown: 12 },
      { level: 5, value: 160, energyGain: 20, cooldown: 12 },
    ],
    specialEffect: {
      type: 'summon_turret',
      description: '召唤自动炮台，炮台每2秒攻击一次，持续8秒',
    },
  },
  ultimate: {
    id: 'a004_ultimate',
    name: '机械军团',
    description: '召唤3个小型机器人，每个造成攻击力60%(70%/80%/90%/100%)伤害，持续6秒，机器人攻击有30%概率眩晕目标1秒',
    icon: '⚙️',
    effectType: SkillEffectType.SUMMON,
    targetType: TargetType.SELF,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 60, energyCost: 100 },
      { level: 2, value: 70, energyCost: 100 },
      { level: 3, value: 80, energyCost: 100 },
      { level: 4, value: 90, energyCost: 100 },
      { level: 5, value: 100, energyCost: 100 },
    ],
    specialEffect: {
      type: 'summon_robots',
      description: '召唤3个小型机器人，每个持续6秒，机器人攻击有30%概率眩晕目标1秒',
    },
  },
  talent: {
    id: 'a004_talent',
    name: '工程大师',
    description: '所有召唤物持续时间+2秒，伤害提升25%',
    icon: '⚒️',
    effectType: SkillEffectType.BUFF,
    effect: {
      description: '所有召唤物持续时间+2秒，伤害提升25%',
      baseValue: 25,
      unit: '%',
      enhancedValue4: 40,
    },
    star5Bonus: '战斗开始时召唤1个炮台，且所有召唤物攻击速度提升20%',
  },
  starBonuses: [
    { star: 1, description: '攻击力提升15%', effectType: 'stat_boost', value: 15 },
    { star: 2, description: '主动技能等级+1', effectType: 'skill_level', targetSkill: SkillType.SKILL },
    { star: 3, description: '终极技能等级+1', effectType: 'skill_level', targetSkill: SkillType.ULTIMATE },
    { star: 4, description: '天赋的伤害提升效果变为40%', effectType: 'talent_enhance' },
    { star: 5, description: '战斗开始时召唤1个炮台，且所有召唤物攻击速度提升20%', effectType: 'special' },
  ],
};

// ==================== A005 幻影 ====================
export const CREW_A005: SkillSet = {
  basic: {
    id: 'a005_basic',
    name: '暗影突袭',
    description: '对敌方单体目标造成20%(30%/40%/50%/60%)攻击力的伤害，30%概率使目标失明（命中率降低50%），持续4秒',
    icon: '🌑',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: DamageType.PHYSICAL,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 20, energyGain: 5, cooldown: 1, procChance: 30 },
      { level: 2, value: 30, energyGain: 5, cooldown: 1, procChance: 30 },
      { level: 3, value: 40, energyGain: 5, cooldown: 1, procChance: 30 },
      { level: 4, value: 50, energyGain: 5, cooldown: 1, procChance: 30 },
      { level: 5, value: 60, energyGain: 5, cooldown: 1, procChance: 30 },
    ],
    specialEffect: {
      type: 'blind',
      description: '30%概率使目标失明（命中率降低50%），持续4秒',
      procChances: [30, 30, 30, 30, 30],
    },
  },
  skill: {
    id: 'a005_skill',
    name: '陷阱布置',
    description: '在敌方区域布置陷阱，敌人行动时受到150%(170%/190%/210%/230%)攻击力伤害并有50%概率眩晕1.5秒，陷阱持续6秒',
    icon: '🕸️',
    effectType: SkillEffectType.CONTROL,
    targetType: TargetType.ALL,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 150, energyGain: 20, cooldown: 10 },
      { level: 2, value: 170, energyGain: 20, cooldown: 10 },
      { level: 3, value: 190, energyGain: 20, cooldown: 10 },
      { level: 4, value: 210, energyGain: 20, cooldown: 10 },
      { level: 5, value: 230, energyGain: 20, cooldown: 10 },
    ],
    specialEffect: {
      type: 'trap',
      description: '布置陷阱持续6秒，敌人行动时受到攻击力伤害并有50%概率眩晕1.5秒',
    },
  },
  ultimate: {
    id: 'a005_ultimate',
    name: '幻影分身',
    description: '创造2个分身，每个拥有本体50%攻击力，持续15秒',
    icon: '👥',
    effectType: SkillEffectType.SUMMON,
    targetType: TargetType.SELF,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 50, energyCost: 100 },
      { level: 2, value: 50, energyCost: 100 },
      { level: 3, value: 50, energyCost: 100 },
      { level: 4, value: 50, energyCost: 100 },
      { level: 5, value: 50, energyCost: 100 },
    ],
    specialEffect: {
      type: 'clone',
      description: '创造2个分身，每个拥有本体50%攻击力，持续15秒',
    },
  },
  talent: {
    id: 'a005_talent',
    name: '隐匿大师',
    description: '每8秒进入隐身状态2秒，隐身时无法被选中，攻击伤害提升30%',
    icon: '👻',
    effectType: SkillEffectType.BUFF,
    triggerTiming: TriggerTiming.CONTINUOUS,
    effect: {
      description: '每8秒进入隐身状态2秒，隐身时无法被选中，攻击伤害提升30%',
      baseValue: 2,
      unit: '秒',
      enhancedValue4: 3,
    },
    star5Bonus: '战斗开始时立即进入隐身状态2秒，且分身拥有本体70%攻击力',
  },
  starBonuses: [
    { star: 1, description: '闪避提升15%', effectType: 'stat_boost', value: 15 },
    { star: 2, description: '主动技能等级+1', effectType: 'skill_level', targetSkill: SkillType.SKILL },
    { star: 3, description: '终极技能等级+1', effectType: 'skill_level', targetSkill: SkillType.ULTIMATE },
    { star: 4, description: '隐身持续时间变为3秒，伤害提升变为50%', effectType: 'talent_enhance' },
    { star: 5, description: '战斗开始时立即进入隐身状态2秒，且分身拥有本体70%攻击力', effectType: 'special' },
  ],
};

// ==================== A006 堡垒 ====================
export const CREW_A006: SkillSet = {
  basic: {
    id: 'a006_basic',
    name: '重炮轰击',
    description: '使用肩部火炮攻击，对目标及相邻敌人造成80%(90%/100%/110%/120%)攻击力伤害',
    icon: '💥',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: DamageType.EXPLOSIVE,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 80, energyGain: 5, cooldown: 1 },
      { level: 2, value: 90, energyGain: 5, cooldown: 1 },
      { level: 3, value: 100, energyGain: 5, cooldown: 1 },
      { level: 4, value: 110, energyGain: 5, cooldown: 1 },
      { level: 5, value: 120, energyGain: 5, cooldown: 1 },
    ],
    specialEffect: {
      type: 'splash',
      description: '对目标及相邻敌人造成伤害',
    },
  },
  skill: {
    id: 'a006_skill',
    name: '嘲讽模式',
    description: '强制所有敌人攻击自己，受到伤害降低30%(35%/40%/45%/50%)，反弹20%(25%/30%/35%/40%)伤害，持续4秒',
    icon: '🎯',
    effectType: SkillEffectType.BUFF,
    targetType: TargetType.SELF,
    scaleStat: 'defense',
    levels: [
      { level: 1, value: 30, energyGain: 20, cooldown: 10 },
      { level: 2, value: 35, energyGain: 20, cooldown: 10 },
      { level: 3, value: 40, energyGain: 20, cooldown: 10 },
      { level: 4, value: 45, energyGain: 20, cooldown: 10 },
      { level: 5, value: 50, energyGain: 20, cooldown: 10 },
    ],
    specialEffect: {
      type: 'taunt_reflect',
      description: '强制所有敌人攻击自己，受到伤害降低，反弹20%/25%/30%/35%/40%伤害，持续4秒',
    },
  },
  ultimate: {
    id: 'a006_ultimate',
    name: '绝对防御',
    description: '免疫所有伤害3秒，期间反弹50%伤害，并恢复20%最大生命',
    icon: '🛡️',
    effectType: SkillEffectType.BUFF,
    targetType: TargetType.SELF,
    scaleStat: 'defense',
    levels: [
      { level: 1, value: 50, energyCost: 100 },
      { level: 2, value: 50, energyCost: 100 },
      { level: 3, value: 50, energyCost: 100 },
      { level: 4, value: 50, energyCost: 100 },
      { level: 5, value: 50, energyCost: 100 },
    ],
    specialEffect: {
      type: 'invincible_reflect_heal',
      description: '免疫所有伤害3秒，期间反弹50%伤害，并恢复20%最大生命',
    },
  },
  talent: {
    id: 'a006_talent',
    name: '装甲修复',
    description: '每5秒恢复2%最大生命，生命低于30%时恢复翻倍',
    icon: '🔧',
    effectType: SkillEffectType.BUFF,
    triggerTiming: TriggerTiming.CONTINUOUS,
    effect: {
      description: '每5秒恢复2%最大生命，生命低于30%时恢复翻倍',
      baseValue: 2,
      unit: '%',
      enhancedValue4: 3,
    },
    star5Bonus: '受到攻击时有20%概率立即触发一次装甲修复',
  },
  starBonuses: [
    { star: 1, description: '生命上限提升15%', effectType: 'stat_boost', value: 15 },
    { star: 2, description: '主动技能等级+1', effectType: 'skill_level', targetSkill: SkillType.SKILL },
    { star: 3, description: '终极技能等级+1', effectType: 'skill_level', targetSkill: SkillType.ULTIMATE },
    { star: 4, description: '生命恢复间隔缩短为4秒', effectType: 'talent_enhance' },
    { star: 5, description: '受到攻击时有20%概率立即触发一次装甲修复', effectType: 'special' },
  ],
};

// ==================== A007 死神 ====================
export const CREW_A007: SkillSet = {
  basic: {
    id: 'a007_basic',
    name: '致命一击',
    description: '对敌方单体目标造成60%(70%/80%/90%/100%)攻击力的伤害，攻击生命值低于50%的目标时，伤害提升30%',
    icon: '💀',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: DamageType.PHYSICAL,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 60, energyGain: 5, cooldown: 1 },
      { level: 2, value: 70, energyGain: 5, cooldown: 1 },
      { level: 3, value: 80, energyGain: 5, cooldown: 1 },
      { level: 4, value: 90, energyGain: 5, cooldown: 1 },
      { level: 5, value: 100, energyGain: 5, cooldown: 1 },
    ],
    specialEffect: {
      type: 'execute_bonus',
      description: '攻击生命值低于50%的目标时，伤害提升30%',
    },
  },
  skill: {
    id: 'a007_skill',
    name: '暗影步',
    description: '对生命值最低敌人造成250%(280%/310%/340%/380%)攻击力伤害，若目标生命低于30%则伤害提升50%',
    icon: '🌑',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.LOWEST_HP,
    damageType: DamageType.PHYSICAL,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 250, energyGain: 20, cooldown: 8 },
      { level: 2, value: 280, energyGain: 20, cooldown: 8 },
      { level: 3, value: 310, energyGain: 20, cooldown: 8 },
      { level: 4, value: 340, energyGain: 20, cooldown: 8 },
      { level: 5, value: 380, energyGain: 20, cooldown: 8 },
    ],
    specialEffect: {
      type: 'execute_bonus',
      description: '若目标生命低于30%则伤害提升50%',
    },
  },
  ultimate: {
    id: 'a007_ultimate',
    name: '死亡收割',
    description: '对所有敌人造成350%(380%/410%/440%/500%)攻击力伤害，击杀后立即再次释放(最多1次)',
    icon: '☠️',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.ALL,
    damageType: DamageType.TRUE,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 350, energyCost: 100 },
      { level: 2, value: 380, energyCost: 100 },
      { level: 3, value: 410, energyCost: 100 },
      { level: 4, value: 440, energyCost: 100 },
      { level: 5, value: 500, energyCost: 100 },
    ],
    specialEffect: {
      type: 'kill_chain',
      description: '击杀后立即再次释放(最多1次)',
    },
  },
  talent: {
    id: 'a007_talent',
    name: '死神印记',
    description: '攻击有25%概率标记目标，被标记目标受到的伤害提升25%，持续5秒',
    icon: '🔴',
    effectType: SkillEffectType.DEBUFF,
    triggerTiming: TriggerTiming.ON_ATTACK,
    effect: {
      description: '攻击有25%概率标记目标，被标记目标受到的伤害提升25%，持续5秒',
      baseValue: 25,
      unit: '%',
      enhancedValue4: 40,
    },
    star5Bonus: '击杀敌人后，自身攻击力提升30%，持续10秒',
  },
  starBonuses: [
    { star: 1, description: '攻击力提升15%', effectType: 'stat_boost', value: 15 },
    { star: 2, description: '主动技能等级+1', effectType: 'skill_level', targetSkill: SkillType.SKILL },
    { star: 3, description: '终极技能等级+1', effectType: 'skill_level', targetSkill: SkillType.ULTIMATE },
    { star: 4, description: '天赋的伤害提升效果变为40%', effectType: 'talent_enhance' },
    { star: 5, description: '击杀敌人后，自身攻击力提升30%，持续10秒', effectType: 'special' },
  ],
};

// ==================== A008 圣光 ====================
export const CREW_A008: SkillSet = {
  basic: {
    id: 'a008_basic',
    name: '圣光惩戒',
    description: '用神圣能量攻击敌人，造成40%(50%/60%/70%/80%)攻击力伤害，伤害的50%治疗生命最低队友',
    icon: '✨',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: DamageType.ENERGY,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 40, energyGain: 5, cooldown: 1 },
      { level: 2, value: 50, energyGain: 5, cooldown: 1 },
      { level: 3, value: 60, energyGain: 5, cooldown: 1 },
      { level: 4, value: 70, energyGain: 5, cooldown: 1 },
      { level: 5, value: 80, energyGain: 5, cooldown: 1 },
    ],
    specialEffect: {
      type: 'life_steal_team',
      description: '伤害的50%治疗生命最低队友',
    },
  },
  skill: {
    id: 'a008_skill',
    name: '神圣庇护',
    description: '为队友添加圣光庇护，每2秒恢复攻击力80%(90%/100%/110%/120%)生命，持续6秒，期间免疫控制',
    icon: '🛡️',
    effectType: SkillEffectType.HEAL,
    targetType: TargetType.LOWEST_HP,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 80, energyGain: 20, cooldown: 12 },
      { level: 2, value: 90, energyGain: 20, cooldown: 12 },
      { level: 3, value: 100, energyGain: 20, cooldown: 12 },
      { level: 4, value: 110, energyGain: 20, cooldown: 12 },
      { level: 5, value: 120, energyGain: 20, cooldown: 12 },
    ],
    specialEffect: {
      type: 'hot_cc_immunity',
      description: '每2秒恢复生命，持续6秒，期间免疫控制',
    },
  },
  ultimate: {
    id: 'a008_ultimate',
    name: '神圣复苏',
    description: '全体恢复200%(230%/260%/290%/340%)攻击力生命，清除所有减益，并免疫控制6秒',
    icon: '🌟',
    effectType: SkillEffectType.HEAL,
    targetType: TargetType.ALLIES,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 200, energyCost: 100 },
      { level: 2, value: 230, energyCost: 100 },
      { level: 3, value: 260, energyCost: 100 },
      { level: 4, value: 290, energyCost: 100 },
      { level: 5, value: 340, energyCost: 100 },
    ],
    specialEffect: {
      type: 'cleanse_immunity',
      description: '清除所有减益，并免疫控制6秒',
    },
  },
  talent: {
    id: 'a008_talent',
    name: '信仰之力',
    description: '队友生命低于50%时，自动为其恢复攻击力120%(140%/160%/180%/200%)生命（每6秒1次）',
    icon: '💫',
    effectType: SkillEffectType.BUFF,
    triggerTiming: TriggerTiming.CONTINUOUS,
    effect: {
      description: '队友生命低于50%时，自动为其恢复攻击力120%/140%/160%/180%/200%生命（每6秒1次）',
      baseValue: 120,
      unit: '%',
      enhancedValue4: 150,
    },
    star5Bonus: '战斗开始时，为所有队友添加持续恢复效果，每3秒恢复攻击力50%生命，持续15秒',
  },
  starBonuses: [
    { star: 1, description: '治疗效果提升15%', effectType: 'stat_boost', value: 15 },
    { star: 2, description: '主动技能等级+1', effectType: 'skill_level', targetSkill: SkillType.SKILL },
    { star: 3, description: '终极技能等级+1', effectType: 'skill_level', targetSkill: SkillType.ULTIMATE },
    { star: 4, description: '天赋触发间隔缩短为5秒', effectType: 'talent_enhance' },
    { star: 5, description: '战斗开始时，为所有队友添加持续恢复效果，每3秒恢复攻击力50%生命，持续15秒', effectType: 'special' },
  ],
};

// ==================== A009 智脑 ====================
export const CREW_A009: SkillSet = {
  basic: {
    id: 'a009_basic',
    name: '数据流',
    description: '发射数据流攻击，造成40%(50%/60%/70%/80%)攻击力伤害，20%概率使目标混乱（攻击队友），持续3秒',
    icon: '💻',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: DamageType.ELECTRIC,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 40, energyGain: 5, cooldown: 1, procChance: 20 },
      { level: 2, value: 50, energyGain: 5, cooldown: 1, procChance: 20 },
      { level: 3, value: 60, energyGain: 5, cooldown: 1, procChance: 20 },
      { level: 4, value: 70, energyGain: 5, cooldown: 1, procChance: 20 },
      { level: 5, value: 80, energyGain: 5, cooldown: 1, procChance: 20 },
    ],
    specialEffect: {
      type: 'confuse',
      description: '20%概率使目标混乱（攻击队友），持续3秒',
      procChances: [20, 20, 20, 20, 20],
    },
  },
  skill: {
    id: 'a009_skill',
    name: '战术分析',
    description: '全队暴击率提升20%，暴击伤害提升25%(28%/31%/34%/40%)，持续6秒',
    icon: '📊',
    effectType: SkillEffectType.BUFF,
    targetType: TargetType.ALLIES,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 25, energyGain: 20, cooldown: 12 },
      { level: 2, value: 28, energyGain: 20, cooldown: 12 },
      { level: 3, value: 31, energyGain: 20, cooldown: 12 },
      { level: 4, value: 34, energyGain: 20, cooldown: 12 },
      { level: 5, value: 40, energyGain: 20, cooldown: 12 },
    ],
    specialEffect: {
      type: 'crit_buff',
      description: '全队暴击率提升20%，暴击伤害提升，持续6秒',
    },
  },
  ultimate: {
    id: 'a009_ultimate',
    name: '预知未来',
    description: '全队闪避率提升40%，受到致命伤害时保留1点生命，持续4秒',
    icon: '🔮',
    effectType: SkillEffectType.BUFF,
    targetType: TargetType.ALLIES,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 40, energyCost: 100 },
      { level: 2, value: 40, energyCost: 100 },
      { level: 3, value: 40, energyCost: 100 },
      { level: 4, value: 40, energyCost: 100 },
      { level: 5, value: 40, energyCost: 100 },
    ],
    specialEffect: {
      type: 'dodge_survive',
      description: '全队闪避率提升40%，受到致命伤害时保留1点生命，持续4秒',
    },
  },
  talent: {
    id: 'a009_talent',
    name: '全局计算',
    description: '全队命中率提升20%，受到的伤害降低12%',
    icon: '🧠',
    effectType: SkillEffectType.BUFF,
    effect: {
      description: '全队命中率提升20%，受到的伤害降低12%',
      baseValue: 12,
      unit: '%',
      enhancedValue4: 18,
    },
    star5Bonus: '战斗开始时，全队获得"预知"效果，首次受到的伤害降低80%',
  },
  starBonuses: [
    { star: 1, description: '全队攻击力提升10%', effectType: 'stat_boost', value: 10 },
    { star: 2, description: '主动技能等级+1', effectType: 'skill_level', targetSkill: SkillType.SKILL },
    { star: 3, description: '终极技能等级+1', effectType: 'skill_level', targetSkill: SkillType.ULTIMATE },
    { star: 4, description: '天赋的伤害降低效果变为18%', effectType: 'talent_enhance' },
    { star: 5, description: '战斗开始时，全队获得"预知"效果，首次受到的伤害降低80%', effectType: 'special' },
  ],
};

// ==================== A010 零号 ====================
export const CREW_A010: SkillSet = {
  basic: {
    id: 'a010_basic',
    name: '精神冲击',
    description: '用精神力攻击，造成40%(50%/60%/70%/80%)攻击力伤害，25%概率使目标沉默（无法使用技能），持续2秒',
    icon: '🌊',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: DamageType.ELECTRIC,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 40, energyGain: 5, cooldown: 1, procChance: 25 },
      { level: 2, value: 50, energyGain: 5, cooldown: 1, procChance: 25 },
      { level: 3, value: 60, energyGain: 5, cooldown: 1, procChance: 25 },
      { level: 4, value: 70, energyGain: 5, cooldown: 1, procChance: 25 },
      { level: 5, value: 80, energyGain: 5, cooldown: 1, procChance: 25 },
    ],
    specialEffect: {
      type: 'silence',
      description: '25%概率使目标沉默（无法使用技能），持续2秒',
      procChances: [25, 25, 25, 25, 25],
    },
  },
  skill: {
    id: 'a010_skill',
    name: '思维控制',
    description: '控制目标2秒，使其攻击队友，控制期间目标攻击提升30%(35%/40%/45%/50%)',
    icon: '🧿',
    effectType: SkillEffectType.CONTROL,
    targetType: TargetType.SINGLE,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 30, energyGain: 20, cooldown: 12 },
      { level: 2, value: 35, energyGain: 20, cooldown: 12 },
      { level: 3, value: 40, energyGain: 20, cooldown: 12 },
      { level: 4, value: 45, energyGain: 20, cooldown: 12 },
      { level: 5, value: 50, energyGain: 20, cooldown: 12 },
    ],
    specialEffect: {
      type: 'charm',
      description: '控制目标2秒，使其攻击队友，控制期间目标攻击提升',
    },
  },
  ultimate: {
    id: 'a010_ultimate',
    name: '精神风暴',
    description: '对所有敌人造成150%(170%/190%/210%/240%)攻击力伤害，50%概率混乱3秒',
    icon: '🌪️',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.ALL,
    damageType: DamageType.ELECTRIC,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 150, energyCost: 100 },
      { level: 2, value: 170, energyCost: 100 },
      { level: 3, value: 190, energyCost: 100 },
      { level: 4, value: 210, energyCost: 100 },
      { level: 5, value: 240, energyCost: 100 },
    ],
    specialEffect: {
      type: 'confuse_aoe',
      description: '50%概率混乱3秒',
    },
  },
  talent: {
    id: 'a010_talent',
    name: '精神屏障',
    description: '免疫控制效果，受到的伤害降低15%',
    icon: '🛡️',
    effectType: SkillEffectType.BUFF,
    effect: {
      description: '免疫控制效果，受到的伤害降低15%',
      baseValue: 15,
      unit: '%',
      enhancedValue4: 22,
    },
    star5Bonus: '受到控制效果时，立即对施法者反弹同等控制效果（每15秒最多1次）',
  },
  starBonuses: [
    { star: 1, description: '攻击力提升15%', effectType: 'stat_boost', value: 15 },
    { star: 2, description: '主动技能等级+1', effectType: 'skill_level', targetSkill: SkillType.SKILL },
    { star: 3, description: '终极技能等级+1', effectType: 'skill_level', targetSkill: SkillType.ULTIMATE },
    { star: 4, description: '天赋的伤害降低效果变为22%', effectType: 'talent_enhance' },
    { star: 5, description: '受到控制效果时，立即对施法者反弹同等控制效果（每15秒最多1次）', effectType: 'special' },
  ],
};

// A级船员技能映射（10个角色）
export const A_CREW_SKILLS: Record<string, SkillSet> = {
  'crew_a_001': CREW_A001,
  'crew_a_002': CREW_A002,
  'crew_a_003': CREW_A003,
  'crew_a_004': CREW_A004,
  'crew_a_005': CREW_A005,
  'crew_a_006': CREW_A006,
  'crew_a_007': CREW_A007,
  'crew_a_008': CREW_A008,
  'crew_a_009': CREW_A009,
  'crew_a_010': CREW_A010,
};

// 获取A级船员技能
export function getACrewSkills(crewId: string): SkillSet | undefined {
  return A_CREW_SKILLS[crewId];
}
