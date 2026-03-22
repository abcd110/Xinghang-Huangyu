/**
 * S级船员技能定义（严格按照文档实现）
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

// ==================== S001 不朽者 ====================
export const CREW_S001: SkillSet = {
  basic: {
    id: 's001_basic',
    name: '不朽之拳',
    description: '对敌方单体目标造成60%(70%/80%/90%/100%)防御力的伤害，并附带自身已损失生命10%的额外伤害',
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
      type: 'missing_hp_bonus',
      description: '附带自身已损失生命10%的额外伤害',
    },
  },
  skill: {
    id: 's001_skill',
    name: '不朽护盾',
    description: '为自己添加200%(220%/240%/260%/300%)防御力的护盾，可叠加，最多不超过防御力的600%',
    icon: '🛡️',
    effectType: SkillEffectType.SHIELD,
    targetType: TargetType.SELF,
    scaleStat: 'defense',
    levels: [
      { level: 1, value: 200, energyGain: 20, cooldown: 12 },
      { level: 2, value: 220, energyGain: 20, cooldown: 12 },
      { level: 3, value: 240, energyGain: 20, cooldown: 12 },
      { level: 4, value: 260, energyGain: 20, cooldown: 12 },
      { level: 5, value: 300, energyGain: 20, cooldown: 12 },
    ],
    specialEffect: {
      type: 'shield_cap',
      description: '护盾可叠加，最多不超过防御力的600%',
    },
  },
  ultimate: {
    id: 's001_ultimate',
    name: '重生',
    description: '将自身当前生命值的50%转换为护盾，可叠加，最多不超过自身生命上限',
    icon: '✨',
    effectType: SkillEffectType.BUFF,
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
      type: 'hp_to_shield',
      description: '将自身当前生命值的50%转换为护盾，可叠加，最多不超过自身生命上限',
    },
  },
  talent: {
    id: 's001_talent',
    name: '不朽之身',
    description: '受到致命伤害时立即恢复50%生命（每场战斗1次）',
    icon: '🌟',
    effectType: SkillEffectType.BUFF,
    triggerTiming: TriggerTiming.ON_HP_BELOW,
    triggerThreshold: 0,
    effect: {
      description: '受到致命伤害时立即恢复50%生命（每场战斗1次）',
      baseValue: 50,
      unit: '%',
      enhancedValue4: 70,
    },
    star5Bonus: '普攻附带的已损失生命提升为20%',
  },
  starBonuses: [
    { star: 1, description: '生命上限提升20%', effectType: 'stat_boost', value: 20 },
    { star: 2, description: '主动技能等级+1', effectType: 'skill_level', targetSkill: SkillType.SKILL },
    { star: 3, description: '终极技能等级+1', effectType: 'skill_level', targetSkill: SkillType.ULTIMATE },
    { star: 4, description: '天赋恢复生命提升为70%', effectType: 'talent_enhance' },
    { star: 5, description: '普攻附带的已损失生命提升为20%', effectType: 'special' },
  ],
};

// ==================== S002 天罚 ====================
export const CREW_S002: SkillSet = {
  basic: {
    id: 's002_basic',
    name: '机炮扫射',
    description: '使用机甲机炮攻击，对随机3个敌人造成100%(120%/150%/180%/200%)攻击力伤害',
    icon: '🔫',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.ALL,
    damageType: DamageType.PHYSICAL,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 100, energyGain: 5, cooldown: 1 },
      { level: 2, value: 120, energyGain: 5, cooldown: 1 },
      { level: 3, value: 150, energyGain: 5, cooldown: 1 },
      { level: 4, value: 180, energyGain: 5, cooldown: 1 },
      { level: 5, value: 200, energyGain: 5, cooldown: 1 },
    ],
    specialEffect: {
      type: 'multi_target',
      description: '对随机3个敌人造成伤害',
    },
  },
  skill: {
    id: 's002_skill',
    name: '导弹齐射',
    description: '发射6枚导弹，每枚造成200%(220%/250%/280%/300%)攻击力伤害，随机攻击敌方目标',
    icon: '🚀',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.ALL,
    damageType: DamageType.EXPLOSIVE,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 200, energyGain: 20, cooldown: 8 },
      { level: 2, value: 220, energyGain: 20, cooldown: 8 },
      { level: 3, value: 250, energyGain: 20, cooldown: 8 },
      { level: 4, value: 280, energyGain: 20, cooldown: 8 },
      { level: 5, value: 300, energyGain: 20, cooldown: 8 },
    ],
    specialEffect: {
      type: 'multi_missile',
      description: '发射6枚导弹，每枚造成伤害，随机攻击敌方目标',
    },
  },
  ultimate: {
    id: 's002_ultimate',
    name: '天罚降临',
    description: '召唤轨道炮击，对所有敌人造成400%(440%/480%/520%/600%)攻击力伤害，无视防御',
    icon: '☄️',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.ALL,
    damageType: DamageType.TRUE,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 400, energyCost: 100 },
      { level: 2, value: 440, energyCost: 100 },
      { level: 3, value: 480, energyCost: 100 },
      { level: 4, value: 520, energyCost: 100 },
      { level: 5, value: 600, energyCost: 100 },
    ],
    specialEffect: {
      type: 'orbital_strike',
      description: '对所有敌人造成伤害，无视防御',
    },
  },
  talent: {
    id: 's002_talent',
    name: '战争机器',
    description: '攻击有30%概率追加1次攻击，伤害为原本的50%',
    icon: '🤖',
    effectType: SkillEffectType.BUFF,
    triggerTiming: TriggerTiming.ON_ATTACK,
    effect: {
      description: '攻击有30%概率追加1次攻击，伤害为原本的50%',
      baseValue: 50,
      unit: '%',
      enhancedValue4: 80,
    },
    star5Bonus: '每次释放主动技能后，下次普攻变为机炮扫射所有敌人',
  },
  starBonuses: [
    { star: 1, description: '攻击力提升20%', effectType: 'stat_boost', value: 20 },
    { star: 2, description: '主动技能等级+1', effectType: 'skill_level', targetSkill: SkillType.SKILL },
    { star: 3, description: '终极技能等级+1', effectType: 'skill_level', targetSkill: SkillType.ULTIMATE },
    { star: 4, description: '天赋的追加攻击伤害变为80%', effectType: 'talent_enhance' },
    { star: 5, description: '每次释放主动技能后，下次普攻变为机炮扫射所有敌人', effectType: 'special' },
  ],
};

// ==================== S003 生命之树 ====================
export const CREW_S003: SkillSet = {
  basic: {
    id: 's003_basic',
    name: '生命绽放',
    description: '治疗全体队友40%(50%/60%/70%/80%)攻击力的生命',
    icon: '🌸',
    effectType: SkillEffectType.HEAL,
    targetType: TargetType.ALLIES,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 40, energyGain: 5, cooldown: 1 },
      { level: 2, value: 50, energyGain: 5, cooldown: 1 },
      { level: 3, value: 60, energyGain: 5, cooldown: 1 },
      { level: 4, value: 70, energyGain: 5, cooldown: 1 },
      { level: 5, value: 80, energyGain: 5, cooldown: 1 },
    ],
  },
  skill: {
    id: 's003_skill',
    name: '再生领域',
    description: '创建治疗领域，每2秒全体恢复60%(70%/80%/90%/100%)攻击力生命，持续8秒',
    icon: '🌿',
    effectType: SkillEffectType.HEAL,
    targetType: TargetType.ALLIES,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 60, energyGain: 20, cooldown: 12 },
      { level: 2, value: 70, energyGain: 20, cooldown: 12 },
      { level: 3, value: 80, energyGain: 20, cooldown: 12 },
      { level: 4, value: 90, energyGain: 20, cooldown: 12 },
      { level: 5, value: 100, energyGain: 20, cooldown: 12 },
    ],
    specialEffect: {
      type: 'regeneration_field',
      description: '每2秒全体恢复生命，持续8秒',
    },
  },
  ultimate: {
    id: 's003_ultimate',
    name: '生命轮回',
    description: '复活所有阵亡队友并恢复40%生命，或全体恢复400%(450%/500%/550%/650%)攻击力生命并提升20%生命上限，持续10秒',
    icon: '🌳',
    effectType: SkillEffectType.HEAL,
    targetType: TargetType.ALLIES,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 400, energyCost: 100 },
      { level: 2, value: 450, energyCost: 100 },
      { level: 3, value: 500, energyCost: 100 },
      { level: 4, value: 550, energyCost: 100 },
      { level: 5, value: 650, energyCost: 100 },
    ],
    specialEffect: {
      type: 'mass_revive_hp_boost',
      description: '复活所有阵亡队友并恢复40%生命，或全体恢复生命并提升20%生命上限，持续10秒',
    },
  },
  talent: {
    id: 's003_talent',
    name: '永恒生命',
    description: '我方全体每5秒恢复1%最大生命',
    icon: '💚',
    effectType: SkillEffectType.BUFF,
    triggerTiming: TriggerTiming.CONTINUOUS,
    effect: {
      description: '我方全体每5秒恢复1%最大生命',
      baseValue: 1,
      unit: '%',
      enhancedValue4: 2,
    },
    star5Bonus: '战斗开始时，为所有队友添加"生命链接"，队友受到伤害后生命之树立刻治疗10%攻击力的生命值',
  },
  starBonuses: [
    { star: 1, description: '治疗效果提升20%', effectType: 'stat_boost', value: 20 },
    { star: 2, description: '主动技能等级+1', effectType: 'skill_level', targetSkill: SkillType.SKILL },
    { star: 3, description: '终极技能等级+1', effectType: 'skill_level', targetSkill: SkillType.ULTIMATE },
    { star: 4, description: '生命恢复间隔缩短为4秒', effectType: 'talent_enhance' },
    { star: 5, description: '战斗开始时，为所有队友添加"生命链接"，队友受到伤害后生命之树立刻治疗10%攻击力的生命值', effectType: 'special' },
  ],
};

// ==================== S004 造物主 ====================
export const CREW_S004: SkillSet = {
  basic: {
    id: 's004_basic',
    name: '物质转化',
    description: '对全体敌人造成40%(50%/60%/70%/80%)攻击力伤害',
    icon: '⚗️',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.ALL,
    damageType: DamageType.ENERGY,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 40, energyGain: 5, cooldown: 1 },
      { level: 2, value: 50, energyGain: 5, cooldown: 1 },
      { level: 3, value: 60, energyGain: 5, cooldown: 1 },
      { level: 4, value: 70, energyGain: 5, cooldown: 1 },
      { level: 5, value: 80, energyGain: 5, cooldown: 1 },
    ],
  },
  skill: {
    id: 's004_skill',
    name: '创造生命',
    description: '创造一个拥有120%(140%/160%/180%/200%)攻击力的造物，持续8秒，造物攻击有60%概率降低目标20%防御',
    icon: '🧬',
    effectType: SkillEffectType.SUMMON,
    targetType: TargetType.SELF,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 120, energyGain: 20, cooldown: 12 },
      { level: 2, value: 140, energyGain: 20, cooldown: 12 },
      { level: 3, value: 160, energyGain: 20, cooldown: 12 },
      { level: 4, value: 180, energyGain: 20, cooldown: 12 },
      { level: 5, value: 200, energyGain: 20, cooldown: 12 },
    ],
    specialEffect: {
      type: 'summon_creature',
      description: '创造一个造物，持续8秒，造物攻击有60%概率降低目标20%防御',
    },
  },
  ultimate: {
    id: 's004_ultimate',
    name: '大创造术',
    description: '将废料转化为神器，全队攻击、防御、生命上限提升40%(45%/50%/55%/65%)，持续8秒',
    icon: '🌟',
    effectType: SkillEffectType.BUFF,
    targetType: TargetType.ALLIES,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 40, energyCost: 100 },
      { level: 2, value: 45, energyCost: 100 },
      { level: 3, value: 50, energyCost: 100 },
      { level: 4, value: 55, energyCost: 100 },
      { level: 5, value: 65, energyCost: 100 },
    ],
    specialEffect: {
      type: 'all_stats_boost',
      description: '全队攻击、防御、生命上限提升，持续8秒',
    },
  },
  talent: {
    id: 's004_talent',
    name: '无限可能',
    description: '所有增益效果持续时间+2秒，效果提升25%',
    icon: '♾️',
    effectType: SkillEffectType.BUFF,
    effect: {
      description: '所有增益效果持续时间+2秒，效果提升25%',
      baseValue: 25,
      unit: '%',
      enhancedValue4: 40,
    },
    star5Bonus: '战斗开始时，造物立即出现',
  },
  starBonuses: [
    { star: 1, description: '全队攻击力、防御力、生命上限提升20%', effectType: 'stat_boost', value: 20 },
    { star: 2, description: '主动技能等级+1', effectType: 'skill_level', targetSkill: SkillType.SKILL },
    { star: 3, description: '终极技能等级+1', effectType: 'skill_level', targetSkill: SkillType.ULTIMATE },
    { star: 4, description: '天赋的效果提升变为40%', effectType: 'talent_enhance' },
    { star: 5, description: '战斗开始时，造物立即出现', effectType: 'special' },
  ],
};

// ==================== S005 矩阵 ====================
export const CREW_S005: SkillSet = {
  basic: {
    id: 's005_basic',
    name: '数据删除',
    description: '删除敌人数据，造成60%(70%/80%/90%/100%)攻击力真实伤害（无视防御）',
    icon: '💻',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: DamageType.TRUE,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 60, energyGain: 5, cooldown: 1 },
      { level: 2, value: 70, energyGain: 5, cooldown: 1 },
      { level: 3, value: 80, energyGain: 5, cooldown: 1 },
      { level: 4, value: 90, energyGain: 5, cooldown: 1 },
      { level: 5, value: 100, energyGain: 5, cooldown: 1 },
    ],
    specialEffect: {
      type: 'true_damage',
      description: '造成真实伤害，无视防御',
    },
  },
  skill: {
    id: 's005_skill',
    name: '系统入侵',
    description: '入侵目标系统，使其无法行动并每2秒损失1%(2%/3%/4%/5%)当前生命，持续4秒',
    icon: '🔓',
    effectType: SkillEffectType.CONTROL,
    targetType: TargetType.SINGLE,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 1, energyGain: 20, cooldown: 10 },
      { level: 2, value: 2, energyGain: 20, cooldown: 10 },
      { level: 3, value: 3, energyGain: 20, cooldown: 10 },
      { level: 4, value: 4, energyGain: 20, cooldown: 10 },
      { level: 5, value: 5, energyGain: 20, cooldown: 10 },
    ],
    specialEffect: {
      type: 'hack_dot',
      description: '使目标无法行动并每2秒损失当前生命，持续4秒',
    },
  },
  ultimate: {
    id: 's005_ultimate',
    name: '数字末日',
    description: '将所有敌人拉入数字世界，造成350%(380%/410%/440%/500%)攻击力伤害并封印所有技能3秒',
    icon: '🌐',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.ALL,
    damageType: DamageType.ELECTRIC,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 350, energyCost: 100 },
      { level: 2, value: 380, energyCost: 100 },
      { level: 3, value: 410, energyCost: 100 },
      { level: 4, value: 440, energyCost: 100 },
      { level: 5, value: 500, energyCost: 100 },
    ],
    specialEffect: {
      type: 'digital_apocalypse',
      description: '对所有敌人造成伤害并封印所有技能3秒',
    },
  },
  talent: {
    id: 's005_talent',
    name: '全知全能',
    description: '免疫所有减益，受到的伤害降低20%',
    icon: '👁️',
    effectType: SkillEffectType.BUFF,
    effect: {
      description: '免疫所有减益，受到的伤害降低20%',
      baseValue: 20,
      unit: '%',
      enhancedValue4: 30,
    },
    star5Bonus: '攻击时，立即清除敌人5点能量',
  },
  starBonuses: [
    { star: 1, description: '攻击力提升20%', effectType: 'stat_boost', value: 20 },
    { star: 2, description: '主动技能等级+1', effectType: 'skill_level', targetSkill: SkillType.SKILL },
    { star: 3, description: '终极技能等级+1', effectType: 'skill_level', targetSkill: SkillType.ULTIMATE },
    { star: 4, description: '天赋的伤害降低效果变为30%', effectType: 'talent_enhance' },
    { star: 5, description: '攻击时，立即清除敌人5点能量', effectType: 'special' },
  ],
};

// ==================== S006 末日守卫 ====================
export const CREW_S006: SkillSet = {
  basic: {
    id: 's006_basic',
    name: '守护之击',
    description: '攻击并标记目标，造成60%(70%/80%/90%/100%)防御力伤害，被标记目标攻击降低25%，持续2秒',
    icon: '🛡️',
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
      type: 'mark_attack_reduce',
      description: '被标记目标攻击降低25%，持续2秒',
    },
  },
  skill: {
    id: 's006_skill',
    name: '最后防线',
    description: '为所有队友承担65%伤害，自身受到伤害降低50%(55%/60%/65%/70%)，持续4秒',
    icon: '🏰',
    effectType: SkillEffectType.BUFF,
    targetType: TargetType.SELF,
    scaleStat: 'defense',
    levels: [
      { level: 1, value: 50, energyGain: 20, cooldown: 12 },
      { level: 2, value: 55, energyGain: 20, cooldown: 12 },
      { level: 3, value: 60, energyGain: 20, cooldown: 12 },
      { level: 4, value: 65, energyGain: 20, cooldown: 12 },
      { level: 5, value: 70, energyGain: 20, cooldown: 12 },
    ],
    specialEffect: {
      type: 'sacrifice_guard',
      description: '为所有队友承担65%伤害，自身受到伤害降低，持续4秒',
    },
  },
  ultimate: {
    id: 's006_ultimate',
    name: '末日庇护',
    description: '全队无敌3秒，期间每秒恢复8%最大生命',
    icon: '🌅',
    effectType: SkillEffectType.BUFF,
    targetType: TargetType.ALLIES,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 8, energyCost: 100 },
      { level: 2, value: 8, energyCost: 100 },
      { level: 3, value: 8, energyCost: 100 },
      { level: 4, value: 8, energyCost: 100 },
      { level: 5, value: 8, energyCost: 100 },
    ],
    specialEffect: {
      type: 'invincible_regen',
      description: '全队无敌3秒，期间每秒恢复8%最大生命',
    },
  },
  talent: {
    id: 's006_talent',
    name: '守护誓言',
    description: '队友受到的伤害降低10%，自身受到的伤害降低20%',
    icon: '📜',
    effectType: SkillEffectType.BUFF,
    effect: {
      description: '队友受到的伤害降低10%，自身受到的伤害降低20%',
      baseValue: 10,
      unit: '%',
      enhancedValue4: 20,
    },
    star5Bonus: '队友受到致命伤害时，由末日守卫承担(每场战斗最多触发2次)',
  },
  starBonuses: [
    { star: 1, description: '防御力提升20%', effectType: 'stat_boost', value: 20 },
    { star: 2, description: '主动技能等级+1', effectType: 'skill_level', targetSkill: SkillType.SKILL },
    { star: 3, description: '终极技能等级+1', effectType: 'skill_level', targetSkill: SkillType.ULTIMATE },
    { star: 4, description: '天赋的队友伤害降低效果变为20%', effectType: 'talent_enhance' },
    { star: 5, description: '队友受到致命伤害时，由末日守卫承担(每场战斗最多触发2次)', effectType: 'special' },
  ],
};

// ==================== S007 星陨 ====================
export const CREW_S007: SkillSet = {
  basic: {
    id: 's007_basic',
    name: '星能射击',
    description: '使用星能武器攻击，造成100%(120%/140%/200%/300%)攻击力伤害，无视目标30%防御',
    icon: '⭐',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: DamageType.ENERGY,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 100, energyGain: 5, cooldown: 1 },
      { level: 2, value: 120, energyGain: 5, cooldown: 1 },
      { level: 3, value: 140, energyGain: 5, cooldown: 1 },
      { level: 4, value: 200, energyGain: 5, cooldown: 1 },
      { level: 5, value: 300, energyGain: 5, cooldown: 1 },
    ],
    specialEffect: {
      type: 'penetrate',
      description: '无视目标30%防御',
    },
  },
  skill: {
    id: 's007_skill',
    name: '黑洞炸弹',
    description: '投掷黑洞炸弹，对目标及周围敌人造成280%(310%/340%/370%/420%)攻击力伤害，并立即触发一次天赋，且每次触发天赋后有65%概率再次触发天赋，最多触发5次',
    icon: '🕳️',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: DamageType.EXPLOSIVE,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 280, energyGain: 20, cooldown: 10 },
      { level: 2, value: 310, energyGain: 20, cooldown: 10 },
      { level: 3, value: 340, energyGain: 20, cooldown: 10 },
      { level: 4, value: 370, energyGain: 20, cooldown: 10 },
      { level: 5, value: 420, energyGain: 20, cooldown: 10 },
    ],
    specialEffect: {
      type: 'blackhole_chain',
      description: '立即触发一次天赋，且每次触发天赋后有65%概率再次触发天赋，最多触发5次',
    },
  },
  ultimate: {
    id: 's007_ultimate',
    name: '陨石天降',
    description: '召唤陨石轰击，对所有敌人造成500%(550%/600%/650%/750%)攻击力伤害，65%概率眩晕2秒',
    icon: '☄️',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.ALL,
    damageType: DamageType.EXPLOSIVE,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 500, energyCost: 100 },
      { level: 2, value: 550, energyCost: 100 },
      { level: 3, value: 600, energyCost: 100 },
      { level: 4, value: 650, energyCost: 100 },
      { level: 5, value: 750, energyCost: 100 },
    ],
    specialEffect: {
      type: 'meteor_stun',
      description: '对所有敌人造成伤害，65%概率眩晕2秒',
    },
  },
  talent: {
    id: 's007_talent',
    name: '星能共鸣',
    description: '攻击有65%概率触发星能爆发，额外造成80%攻击力伤害',
    icon: '✨',
    effectType: SkillEffectType.BUFF,
    triggerTiming: TriggerTiming.ON_ATTACK,
    effect: {
      description: '攻击有65%概率触发星能爆发，额外造成80%攻击力伤害',
      baseValue: 80,
      unit: '%',
      enhancedValue4: 120,
    },
    star5Bonus: '天赋的触发概率提升为100%，并且有65%概率额外触发一次',
  },
  starBonuses: [
    { star: 1, description: '攻击力提升20%', effectType: 'stat_boost', value: 20 },
    { star: 2, description: '主动技能等级+1', effectType: 'skill_level', targetSkill: SkillType.SKILL },
    { star: 3, description: '终极技能等级+1', effectType: 'skill_level', targetSkill: SkillType.ULTIMATE },
    { star: 4, description: '天赋的额外伤害变为120%攻击力', effectType: 'talent_enhance' },
    { star: 5, description: '天赋的触发概率提升为100%，并且有65%概率额外触发一次', effectType: 'special' },
  ],
};

// ==================== S008 凤凰 ====================
export const CREW_S008: SkillSet = {
  basic: {
    id: 's008_basic',
    name: '火焰治愈',
    description: '用火焰治疗队友，恢复攻击力50%(60%/70%/80%/90%)生命并清除1个减益',
    icon: '🔥',
    effectType: SkillEffectType.HEAL,
    targetType: TargetType.LOWEST_HP,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 50, energyGain: 5, cooldown: 1 },
      { level: 2, value: 60, energyGain: 5, cooldown: 1 },
      { level: 3, value: 70, energyGain: 5, cooldown: 1 },
      { level: 4, value: 80, energyGain: 5, cooldown: 1 },
      { level: 5, value: 90, energyGain: 5, cooldown: 1 },
    ],
    specialEffect: {
      type: 'heal_cleanse',
      description: '恢复生命并清除1个减益',
    },
  },
  skill: {
    id: 's008_skill',
    name: '凤凰之羽',
    description: '为队友添加凤凰之羽，持续5秒，期间死亡时立即复活并恢复30%(35%/40%/45%/55%)生命',
    icon: '🪶',
    effectType: SkillEffectType.BUFF,
    targetType: TargetType.LOWEST_HP,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 30, energyGain: 20, cooldown: 15 },
      { level: 2, value: 35, energyGain: 20, cooldown: 15 },
      { level: 3, value: 40, energyGain: 20, cooldown: 15 },
      { level: 4, value: 45, energyGain: 20, cooldown: 15 },
      { level: 5, value: 55, energyGain: 20, cooldown: 15 },
    ],
    specialEffect: {
      type: 'feather_revive',
      description: '持续5秒，期间死亡时立即复活并恢复生命',
    },
  },
  ultimate: {
    id: 's008_ultimate',
    name: '涅槃重生',
    description: '全体恢复280%(310%/340%/370%/430%)攻击力生命，获得涅槃效果（死亡时复活并恢复40%生命），持续12秒',
    icon: '🦅',
    effectType: SkillEffectType.HEAL,
    targetType: TargetType.ALLIES,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 280, energyCost: 100 },
      { level: 2, value: 310, energyCost: 100 },
      { level: 3, value: 340, energyCost: 100 },
      { level: 4, value: 370, energyCost: 100 },
      { level: 5, value: 430, energyCost: 100 },
    ],
    specialEffect: {
      type: 'nirvana',
      description: '全体恢复生命，获得涅槃效果（死亡时复活并恢复40%生命），持续12秒',
    },
  },
  talent: {
    id: 's008_talent',
    name: '浴火重生',
    description: '受到致命伤害时立即恢复35%生命并提升15%攻击（每场战斗1次）',
    icon: '🔥',
    effectType: SkillEffectType.BUFF,
    triggerTiming: TriggerTiming.ON_HP_BELOW,
    triggerThreshold: 0,
    effect: {
      description: '受到致命伤害时立即恢复35%生命并提升15%攻击（每场战斗1次）',
      baseValue: 35,
      unit: '%',
      enhancedValue4: 50,
    },
    star5Bonus: '队友复活后，为全体队友恢复20%生命',
  },
  starBonuses: [
    { star: 1, description: '治疗效果提升20%', effectType: 'stat_boost', value: 20 },
    { star: 2, description: '主动技能等级+1', effectType: 'skill_level', targetSkill: SkillType.SKILL },
    { star: 3, description: '终极技能等级+1', effectType: 'skill_level', targetSkill: SkillType.ULTIMATE },
    { star: 4, description: '天赋恢复生命提升为50%，攻击提升变为25%', effectType: 'talent_enhance' },
    { star: 5, description: '队友复活后，为全体队友恢复20%生命', effectType: 'special' },
  ],
};

// ==================== S009 时空行者 ====================
export const CREW_S009: SkillSet = {
  basic: {
    id: 's009_basic',
    name: '时间切割',
    description: '切割时间流攻击，造成40%(50%/60%/70%/80%)攻击力伤害，25%概率使目标时间停滞（停止行动），持续2秒',
    icon: '⏱️',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: DamageType.ENERGY,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 40, energyGain: 5, cooldown: 1, procChance: 25 },
      { level: 2, value: 50, energyGain: 5, cooldown: 1, procChance: 25 },
      { level: 3, value: 60, energyGain: 5, cooldown: 1, procChance: 25 },
      { level: 4, value: 70, energyGain: 5, cooldown: 1, procChance: 25 },
      { level: 5, value: 80, energyGain: 5, cooldown: 1, procChance: 25 },
    ],
    specialEffect: {
      type: 'time_stop',
      description: '25%概率使目标时间停滞（停止行动），持续2秒',
      procChances: [25, 25, 25, 25, 25],
    },
  },
  skill: {
    id: 's009_skill',
    name: '时间加速',
    description: '使全体队友时间加速，获得20能量',
    icon: '⚡',
    effectType: SkillEffectType.BUFF,
    targetType: TargetType.ALLIES,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 20, energyGain: 20, cooldown: 12 },
      { level: 2, value: 20, energyGain: 20, cooldown: 12 },
      { level: 3, value: 20, energyGain: 20, cooldown: 12 },
      { level: 4, value: 20, energyGain: 20, cooldown: 12 },
      { level: 5, value: 20, energyGain: 20, cooldown: 12 },
    ],
    specialEffect: {
      type: 'energy_boost',
      description: '使全体队友获得20能量',
    },
  },
  ultimate: {
    id: 's009_ultimate',
    name: '时间停止',
    description: '停止时间2秒，期间只有己方可以行动，且己方伤害提升30%',
    icon: '⏸️',
    effectType: SkillEffectType.CONTROL,
    targetType: TargetType.ALL,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 30, energyCost: 100 },
      { level: 2, value: 30, energyCost: 100 },
      { level: 3, value: 30, energyCost: 100 },
      { level: 4, value: 30, energyCost: 100 },
      { level: 5, value: 30, energyCost: 100 },
    ],
    specialEffect: {
      type: 'time_stop_all',
      description: '停止时间2秒，期间只有己方可以行动，且己方伤害提升30%',
    },
  },
  talent: {
    id: 's009_talent',
    name: '时间感知',
    description: '全队有20%概率闪避攻击',
    icon: '👁️',
    effectType: SkillEffectType.BUFF,
    effect: {
      description: '全队有20%概率闪避攻击',
      baseValue: 20,
      unit: '%',
      enhancedValue4: 30,
    },
    star5Bonus: '时间停止期间，己方伤害提升变为60%',
  },
  starBonuses: [
    { star: 1, description: '全队攻击力提升20%', effectType: 'stat_boost', value: 20 },
    { star: 2, description: '主动技能等级+1', effectType: 'skill_level', targetSkill: SkillType.SKILL },
    { star: 3, description: '终极技能等级+1', effectType: 'skill_level', targetSkill: SkillType.ULTIMATE },
    { star: 4, description: '天赋的概率提升为30%', effectType: 'talent_enhance' },
    { star: 5, description: '时间停止期间，己方伤害提升变为60%', effectType: 'special' },
  ],
};

// ==================== S010 虚空 ====================
export const CREW_S010: SkillSet = {
  basic: {
    id: 's010_basic',
    name: '虚空之触',
    description: '从虚空中攻击，造成50%(60%/70%/80%/90%)攻击力伤害，25%概率使目标陷入虚空（无法行动，受到伤害+40%），持续1.5秒',
    icon: '🌌',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: DamageType.CORROSION,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 50, energyGain: 5, cooldown: 1, procChance: 25 },
      { level: 2, value: 60, energyGain: 5, cooldown: 1, procChance: 25 },
      { level: 3, value: 70, energyGain: 5, cooldown: 1, procChance: 25 },
      { level: 4, value: 80, energyGain: 5, cooldown: 1, procChance: 25 },
      { level: 5, value: 90, energyGain: 5, cooldown: 1, procChance: 25 },
    ],
    specialEffect: {
      type: 'void_touch',
      description: '25%概率使目标陷入虚空（无法行动，受到伤害+40%），持续1.5秒',
      procChances: [25, 25, 25, 25, 25],
    },
  },
  skill: {
    id: 's010_skill',
    name: '虚空裂隙',
    description: '开启虚空裂隙，将目标拉入虚空2秒，期间目标无法行动且每2秒受到100%(115%/130%/145%/170%)攻击力伤害',
    icon: '🌀',
    effectType: SkillEffectType.CONTROL,
    targetType: TargetType.SINGLE,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 100, energyGain: 20, cooldown: 12 },
      { level: 2, value: 115, energyGain: 20, cooldown: 12 },
      { level: 3, value: 130, energyGain: 20, cooldown: 12 },
      { level: 4, value: 145, energyGain: 20, cooldown: 12 },
      { level: 5, value: 170, energyGain: 20, cooldown: 12 },
    ],
    specialEffect: {
      type: 'void_rift',
      description: '将目标拉入虚空2秒，期间无法行动且每2秒受到伤害',
    },
  },
  ultimate: {
    id: 's010_ultimate',
    name: '虚空吞噬',
    description: '将所有敌人拉入虚空，造成400%(440%/480%/520%/600%)攻击力伤害并封印行动1秒',
    icon: '🌑',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.ALL,
    damageType: DamageType.CORROSION,
    scaleStat: 'attack',
    levels: [
      { level: 1, value: 400, energyCost: 100 },
      { level: 2, value: 440, energyCost: 100 },
      { level: 3, value: 480, energyCost: 100 },
      { level: 4, value: 520, energyCost: 100 },
      { level: 5, value: 600, energyCost: 100 },
    ],
    specialEffect: {
      type: 'void_devour',
      description: '将所有敌人拉入虚空，造成伤害并封印行动1秒',
    },
  },
  talent: {
    id: 's010_talent',
    name: '虚空庇护',
    description: '有25%概率将受到的伤害转化为治疗，免疫控制',
    icon: '🛡️',
    effectType: SkillEffectType.BUFF,
    triggerTiming: TriggerTiming.ON_HIT,
    effect: {
      description: '有25%概率将受到的伤害转化为治疗，免疫控制',
      baseValue: 25,
      unit: '%',
      enhancedValue4: 35,
    },
    star5Bonus: '进入战斗时，立即对敌方随机1个目标施加虚空裂隙效果',
  },
  starBonuses: [
    { star: 1, description: '攻击力提升20%', effectType: 'stat_boost', value: 20 },
    { star: 2, description: '主动技能等级+1', effectType: 'skill_level', targetSkill: SkillType.SKILL },
    { star: 3, description: '终极技能等级+1', effectType: 'skill_level', targetSkill: SkillType.ULTIMATE },
    { star: 4, description: '天赋的伤害转化概率变为35%', effectType: 'talent_enhance' },
    { star: 5, description: '进入战斗时，立即对敌方随机1个目标施加虚空裂隙效果', effectType: 'special' },
  ],
};

// S级船员技能映射（10个角色）
export const S_CREW_SKILLS: Record<string, SkillSet> = {
  'crew_s_001': CREW_S001,
  'crew_s_002': CREW_S002,
  'crew_s_003': CREW_S003,
  'crew_s_004': CREW_S004,
  'crew_s_005': CREW_S005,
  'crew_s_006': CREW_S006,
  'crew_s_007': CREW_S007,
  'crew_s_008': CREW_S008,
  'crew_s_009': CREW_S009,
  'crew_s_010': CREW_S010,
};

// 获取S级船员技能
export function getSCrewSkills(crewId: string): SkillSet | undefined {
  return S_CREW_SKILLS[crewId];
}
