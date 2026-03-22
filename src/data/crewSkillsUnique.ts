/**
 * 每个角色的独特技能定义
 * 共30个角色，每个角色拥有4个独特技能：普攻、主动技能、终极技能、天赋
 */

import {
  SkillDefinition,
  SkillType,
  SkillEffectType,
  TargetType,
  DamageType,
  TriggerTiming,
} from '../screens/crewScreen/types/skillTypes';

// ==================== B级船员技能 ====================

// B001 铁壁 - 机械义肢的防御者
export const CREW_B001_SKILLS = {
  basic: {
    id: 'b001_basic',
    name: '铁拳重击',
    type: SkillType.BASIC,
    description: '用机械义肢猛击敌人，有概率造成眩晕',
    icon: '🦾',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: DamageType.PHYSICAL,
    features: [
      { id: 'b001_stun', name: '震荡', description: '15%概率眩晕1回合', value: 15, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 85, multiplier: 85, cooldown: 0, unlockedFeatures: [] },
      { level: 2, baseValue: 95, multiplier: 95, cooldown: 0, unlockedFeatures: [] },
      { level: 3, baseValue: 105, multiplier: 105, cooldown: 0, unlockedFeatures: ['b001_stun'] },
      { level: 4, baseValue: 115, multiplier: 115, cooldown: 0, unlockedFeatures: ['b001_stun'] },
      { level: 5, baseValue: 125, multiplier: 125, cooldown: 0, unlockedFeatures: ['b001_stun'] },
    ],
  } as SkillDefinition,

  skill: {
    id: 'b001_skill',
    name: '护盾生成器',
    type: SkillType.SKILL,
    description: '启动机械臂内置护盾，保护最虚弱的队友',
    icon: '🛡️',
    effectType: SkillEffectType.SHIELD,
    targetType: TargetType.ALLY,
    features: [
      { id: 'b001_shield', name: '能量护盾', description: '为目标添加攻击力180%的护盾', value: 180, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 150, multiplier: 150, cooldown: 4, unlockedFeatures: ['b001_shield'] },
      { level: 2, baseValue: 165, multiplier: 165, cooldown: 4, unlockedFeatures: ['b001_shield'] },
      { level: 3, baseValue: 180, multiplier: 180, cooldown: 3, unlockedFeatures: ['b001_shield'] },
      { level: 4, baseValue: 195, multiplier: 195, cooldown: 3, unlockedFeatures: ['b001_shield'] },
      { level: 5, baseValue: 210, multiplier: 210, cooldown: 3, unlockedFeatures: ['b001_shield'] },
    ],
  } as SkillDefinition,

  ultimate: {
    id: 'b001_ultimate',
    name: '绝对守护',
    type: SkillType.ULTIMATE,
    description: '展开全身护盾，为全队吸收伤害',
    icon: '💎',
    effectType: SkillEffectType.SHIELD,
    targetType: TargetType.ALLIES,
    features: [
      { id: 'b001_ultimate_shield', name: '团队护盾', description: '为全队添加攻击力200%的护盾', value: 200, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 200, multiplier: 200, cooldown: 0, energyCost: 100, unlockedFeatures: ['b001_ultimate_shield'] },
      { level: 2, baseValue: 220, multiplier: 220, cooldown: 0, energyCost: 100, unlockedFeatures: ['b001_ultimate_shield'] },
      { level: 3, baseValue: 240, multiplier: 240, cooldown: 0, energyCost: 90, unlockedFeatures: ['b001_ultimate_shield'] },
      { level: 4, baseValue: 260, multiplier: 260, cooldown: 0, energyCost: 90, unlockedFeatures: ['b001_ultimate_shield'] },
      { level: 5, baseValue: 280, multiplier: 280, cooldown: 0, energyCost: 80, unlockedFeatures: ['b001_ultimate_shield'] },
    ],
  } as SkillDefinition,

  talent: {
    id: 'b001_talent',
    name: '牺牲精神',
    type: SkillType.TALENT,
    description: '队友受到致命伤害时，有概率替其承受',
    icon: '🛡️',
    effectType: SkillEffectType.BUFF,
    targetType: TargetType.ALLY,
    triggerTiming: TriggerTiming.ON_HP_BELOW,
    triggerThreshold: 0,
    features: [
      { id: 'b001_sacrifice', name: '替伤', description: '25%概率替队友承受致命一击', value: 25, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 20, unlockedFeatures: ['b001_sacrifice'] },
      { level: 2, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 25, unlockedFeatures: ['b001_sacrifice'] },
      { level: 3, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 30, unlockedFeatures: ['b001_sacrifice'] },
      { level: 4, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 35, unlockedFeatures: ['b001_sacrifice'] },
      { level: 5, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 40, unlockedFeatures: ['b001_sacrifice'] },
    ],
  } as SkillDefinition,
};

// B002 赤焰 - 等离子枪手
export const CREW_B002_SKILLS = {
  basic: {
    id: 'b002_basic',
    name: '等离子射击',
    type: SkillType.BASIC,
    description: '发射高温等离子弹，有概率灼烧敌人',
    icon: '🔫',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: DamageType.ENERGY,
    features: [
      { id: 'b002_burn', name: '灼烧', description: '60%概率施加1层灼烧', value: 60, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 100, multiplier: 100, cooldown: 0, unlockedFeatures: [] },
      { level: 2, baseValue: 110, multiplier: 110, cooldown: 0, unlockedFeatures: [] },
      { level: 3, baseValue: 120, multiplier: 120, cooldown: 0, unlockedFeatures: ['b002_burn'] },
      { level: 4, baseValue: 130, multiplier: 130, cooldown: 0, unlockedFeatures: ['b002_burn'] },
      { level: 5, baseValue: 140, multiplier: 140, cooldown: 0, unlockedFeatures: ['b002_burn'] },
    ],
    specialEffect: {
      type: 'burn',
      description: '60%概率施加1层灼烧',
      procChances: [60, 60, 60, 60, 60],
    },
  } as SkillDefinition,

  skill: {
    id: 'b002_skill',
    name: '爆裂弹',
    type: SkillType.SKILL,
    description: '发射高爆弹药，对目标及周围敌人造成伤害并施加灼烧',
    icon: '💥',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.AOE,
    damageType: DamageType.EXPLOSIVE,
    features: [
      { id: 'b002_explosion', name: '爆炸', description: '对主目标造成220%伤害，周围敌人造成110%', value: 220, unit: '%' },
      { id: 'b002_skill_burn', name: '灼烧', description: '100%概率施加1层灼烧', value: 100, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 200, multiplier: 200, cooldown: 3, unlockedFeatures: ['b002_explosion'] },
      { level: 2, baseValue: 220, multiplier: 220, cooldown: 3, unlockedFeatures: ['b002_explosion'] },
      { level: 3, baseValue: 240, multiplier: 240, cooldown: 2, unlockedFeatures: ['b002_explosion'] },
      { level: 4, baseValue: 260, multiplier: 260, cooldown: 2, unlockedFeatures: ['b002_explosion'] },
      { level: 5, baseValue: 280, multiplier: 280, cooldown: 2, unlockedFeatures: ['b002_explosion'] },
    ],
    specialEffect: {
      type: 'burn',
      description: '100%概率施加1层灼烧',
      procChances: [100, 100, 100, 100, 100],
    },
  } as SkillDefinition,

  ultimate: {
    id: 'b002_ultimate',
    name: '等离子风暴',
    type: SkillType.ULTIMATE,
    description: '释放全部能量，对所有敌人造成毁灭性打击',
    icon: '🌪️',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.ALL,
    damageType: DamageType.ENERGY,
    features: [
      { id: 'b002_storm', name: '能量风暴', description: '对所有敌人造成350%攻击力伤害', value: 350, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 300, multiplier: 300, cooldown: 0, energyCost: 100, unlockedFeatures: ['b002_storm'] },
      { level: 2, baseValue: 325, multiplier: 325, cooldown: 0, energyCost: 100, unlockedFeatures: ['b002_storm'] },
      { level: 3, baseValue: 350, multiplier: 350, cooldown: 0, energyCost: 90, unlockedFeatures: ['b002_storm'] },
      { level: 4, baseValue: 375, multiplier: 375, cooldown: 0, energyCost: 90, unlockedFeatures: ['b002_storm'] },
      { level: 5, baseValue: 400, multiplier: 400, cooldown: 0, energyCost: 80, unlockedFeatures: ['b002_storm'] },
    ],
  } as SkillDefinition,

  talent: {
    id: 'b002_talent',
    name: '怒火中烧',
    type: SkillType.TALENT,
    description: '生命越低，伤害越高',
    icon: '🔥',
    effectType: SkillEffectType.BUFF,
    targetType: TargetType.SELF,
    triggerTiming: TriggerTiming.CONTINUOUS,
    features: [
      { id: 'b002_rage', name: '愤怒', description: '每损失10%生命，伤害提升4%', value: 4, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 100, unlockedFeatures: ['b002_rage'] },
      { level: 2, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 100, unlockedFeatures: ['b002_rage'] },
      { level: 3, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 100, unlockedFeatures: ['b002_rage'] },
      { level: 4, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 100, unlockedFeatures: ['b002_rage'] },
      { level: 5, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 100, unlockedFeatures: ['b002_rage'] },
    ],
  } as SkillDefinition,
};

// B003 青霉素 - 地下医生
export const CREW_B003_SKILLS = {
  basic: {
    id: 'b003_basic',
    name: '医疗射线',
    type: SkillType.BASIC,
    description: '发射治疗射线攻击敌人，同时为队友恢复生命',
    icon: '💉',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: DamageType.ENERGY,
    features: [
      { id: 'b003_heal', name: '生命汲取', description: '伤害的40%转化为对最低生命队友的治疗', value: 40, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 65, multiplier: 65, cooldown: 0, unlockedFeatures: ['b003_heal'] },
      { level: 2, baseValue: 75, multiplier: 75, cooldown: 0, unlockedFeatures: ['b003_heal'] },
      { level: 3, baseValue: 85, multiplier: 85, cooldown: 0, unlockedFeatures: ['b003_heal'] },
      { level: 4, baseValue: 95, multiplier: 95, cooldown: 0, unlockedFeatures: ['b003_heal'] },
      { level: 5, baseValue: 105, multiplier: 105, cooldown: 0, unlockedFeatures: ['b003_heal'] },
    ],
  } as SkillDefinition,

  skill: {
    id: 'b003_skill',
    name: '紧急包扎',
    type: SkillType.SKILL,
    description: '为生命最低的队友进行紧急治疗',
    icon: '🏥',
    effectType: SkillEffectType.HEAL,
    targetType: TargetType.ALLY,
    features: [
      { id: 'b003_heal_skill', name: '紧急治疗', description: '恢复目标攻击力200%的生命', value: 200, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 180, multiplier: 180, cooldown: 3, unlockedFeatures: ['b003_heal_skill'] },
      { level: 2, baseValue: 190, multiplier: 190, cooldown: 3, unlockedFeatures: ['b003_heal_skill'] },
      { level: 3, baseValue: 200, multiplier: 200, cooldown: 2, unlockedFeatures: ['b003_heal_skill'] },
      { level: 4, baseValue: 210, multiplier: 210, cooldown: 2, unlockedFeatures: ['b003_heal_skill'] },
      { level: 5, baseValue: 220, multiplier: 220, cooldown: 2, unlockedFeatures: ['b003_heal_skill'] },
    ],
  } as SkillDefinition,

  ultimate: {
    id: 'b003_ultimate',
    name: '生命绽放',
    type: SkillType.ULTIMATE,
    description: '释放治愈能量，恢复全体队友生命',
    icon: '🌸',
    effectType: SkillEffectType.HEAL,
    targetType: TargetType.ALLIES,
    features: [
      { id: 'b003_ultimate_heal', name: '群体治愈', description: '恢复全体队友攻击力250%的生命', value: 250, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 220, multiplier: 220, cooldown: 0, energyCost: 100, unlockedFeatures: ['b003_ultimate_heal'] },
      { level: 2, baseValue: 235, multiplier: 235, cooldown: 0, energyCost: 100, unlockedFeatures: ['b003_ultimate_heal'] },
      { level: 3, baseValue: 250, multiplier: 250, cooldown: 0, energyCost: 90, unlockedFeatures: ['b003_ultimate_heal'] },
      { level: 4, baseValue: 265, multiplier: 265, cooldown: 0, energyCost: 90, unlockedFeatures: ['b003_ultimate_heal'] },
      { level: 5, baseValue: 280, multiplier: 280, cooldown: 0, energyCost: 80, unlockedFeatures: ['b003_ultimate_heal'] },
    ],
  } as SkillDefinition,

  talent: {
    id: 'b003_talent',
    name: '仁心仁术',
    type: SkillType.TALENT,
    description: '治疗效果提升，有概率清除减益',
    icon: '💝',
    effectType: SkillEffectType.BUFF,
    targetType: TargetType.ALLY,
    triggerTiming: TriggerTiming.ON_ATTACK,
    features: [
      { id: 'b003_heal_boost', name: '治疗强化', description: '治疗效果提升15%', value: 15, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 100, unlockedFeatures: ['b003_heal_boost'] },
      { level: 2, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 100, unlockedFeatures: ['b003_heal_boost'] },
      { level: 3, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 100, unlockedFeatures: ['b003_heal_boost'] },
      { level: 4, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 100, unlockedFeatures: ['b003_heal_boost'] },
      { level: 5, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 100, unlockedFeatures: ['b003_heal_boost'] },
    ],
  } as SkillDefinition,
};

// B004 齿轮 - 机械师
export const CREW_B004_SKILLS = {
  basic: {
    id: 'b004_basic',
    name: '扳手投掷',
    type: SkillType.BASIC,
    description: '投掷改装扳手攻击敌人',
    icon: '🔧',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: DamageType.PHYSICAL,
    features: [
      { id: 'b004_armor_break', name: '破甲', description: '20%概率降低目标20%防御，持续2回合', value: 20, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 90, multiplier: 90, cooldown: 0, unlockedFeatures: [] },
      { level: 2, baseValue: 100, multiplier: 100, cooldown: 0, unlockedFeatures: [] },
      { level: 3, baseValue: 110, multiplier: 110, cooldown: 0, unlockedFeatures: ['b004_armor_break'] },
      { level: 4, baseValue: 120, multiplier: 120, cooldown: 0, unlockedFeatures: ['b004_armor_break'] },
      { level: 5, baseValue: 130, multiplier: 130, cooldown: 0, unlockedFeatures: ['b004_armor_break'] },
    ],
  } as SkillDefinition,

  skill: {
    id: 'b004_skill',
    name: '机械助手',
    type: SkillType.SKILL,
    description: '召唤小型机械助手协助战斗',
    icon: '🤖',
    effectType: SkillEffectType.SUMMON,
    targetType: TargetType.SELF,
    features: [
      { id: 'b004_drone', name: '无人机', description: '召唤无人机，每回合对随机敌人造成攻击力80%伤害，持续3回合', value: 80, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 60, multiplier: 60, cooldown: 5, unlockedFeatures: ['b004_drone'] },
      { level: 2, baseValue: 70, multiplier: 70, cooldown: 5, unlockedFeatures: ['b004_drone'] },
      { level: 3, baseValue: 80, multiplier: 80, cooldown: 4, unlockedFeatures: ['b004_drone'] },
      { level: 4, baseValue: 90, multiplier: 90, cooldown: 4, unlockedFeatures: ['b004_drone'] },
      { level: 5, baseValue: 100, multiplier: 100, cooldown: 4, unlockedFeatures: ['b004_drone'] },
    ],
  } as SkillDefinition,

  ultimate: {
    id: 'b004_ultimate',
    name: '废料轰炸',
    type: SkillType.ULTIMATE,
    description: '将收集的废料改造成炸弹投掷',
    icon: '💣',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.AOE,
    damageType: DamageType.EXPLOSIVE,
    features: [
      { id: 'b004_bomb', name: '废料炸弹', description: '对所有敌人造成300%攻击力伤害', value: 300, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 250, multiplier: 250, cooldown: 0, energyCost: 100, unlockedFeatures: ['b004_bomb'] },
      { level: 2, baseValue: 275, multiplier: 275, cooldown: 0, energyCost: 100, unlockedFeatures: ['b004_bomb'] },
      { level: 3, baseValue: 300, multiplier: 300, cooldown: 0, energyCost: 90, unlockedFeatures: ['b004_bomb'] },
      { level: 4, baseValue: 325, multiplier: 325, cooldown: 0, energyCost: 90, unlockedFeatures: ['b004_bomb'] },
      { level: 5, baseValue: 350, multiplier: 350, cooldown: 0, energyCost: 80, unlockedFeatures: ['b004_bomb'] },
    ],
  } as SkillDefinition,

  talent: {
    id: 'b004_talent',
    name: '废物利用',
    type: SkillType.TALENT,
    description: '攻击时有概率回收废料，恢复能量',
    icon: '♻️',
    effectType: SkillEffectType.BUFF,
    targetType: TargetType.SELF,
    triggerTiming: TriggerTiming.ON_ATTACK,
    features: [
      { id: 'b004_recycle', name: '回收', description: '25%概率恢复10点能量', value: 10, unit: '' },
    ],
    levelEffects: [
      { level: 1, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 20, unlockedFeatures: ['b004_recycle'] },
      { level: 2, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 25, unlockedFeatures: ['b004_recycle'] },
      { level: 3, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 30, unlockedFeatures: ['b004_recycle'] },
      { level: 4, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 35, unlockedFeatures: ['b004_recycle'] },
      { level: 5, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 40, unlockedFeatures: ['b004_recycle'] },
    ],
  } as SkillDefinition,
};

// B005 幽灵 - 黑客
export const CREW_B005_SKILLS = {
  basic: {
    id: 'b005_basic',
    name: '数据入侵',
    type: SkillType.BASIC,
    description: '入侵敌人系统造成干扰',
    icon: '💻',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: DamageType.ELECTRIC,
    features: [
      { id: 'b005_attack_down', name: '系统干扰', description: '20%概率降低目标15%攻击，持续2回合', value: 15, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 80, multiplier: 80, cooldown: 0, unlockedFeatures: [] },
      { level: 2, baseValue: 90, multiplier: 90, cooldown: 0, unlockedFeatures: [] },
      { level: 3, baseValue: 100, multiplier: 100, cooldown: 0, unlockedFeatures: ['b005_attack_down'] },
      { level: 4, baseValue: 110, multiplier: 110, cooldown: 0, unlockedFeatures: ['b005_attack_down'] },
      { level: 5, baseValue: 120, multiplier: 120, cooldown: 0, unlockedFeatures: ['b005_attack_down'] },
    ],
  } as SkillDefinition,

  skill: {
    id: 'b005_skill',
    name: '系统瘫痪',
    type: SkillType.SKILL,
    description: '使目标系统瘫痪，无法行动',
    icon: '⚡',
    effectType: SkillEffectType.CONTROL,
    targetType: TargetType.SINGLE,
    features: [
      { id: 'b005_stun', name: '瘫痪', description: '60%概率眩晕目标1回合', value: 60, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 0, multiplier: 0, cooldown: 4, unlockedFeatures: ['b005_stun'] },
      { level: 2, baseValue: 0, multiplier: 0, cooldown: 4, unlockedFeatures: ['b005_stun'] },
      { level: 3, baseValue: 0, multiplier: 0, cooldown: 3, unlockedFeatures: ['b005_stun'] },
      { level: 4, baseValue: 0, multiplier: 0, cooldown: 3, unlockedFeatures: ['b005_stun'] },
      { level: 5, baseValue: 0, multiplier: 0, cooldown: 3, unlockedFeatures: ['b005_stun'] },
    ],
  } as SkillDefinition,

  ultimate: {
    id: 'b005_ultimate',
    name: '病毒爆发',
    type: SkillType.ULTIMATE,
    description: '释放强力病毒，感染所有敌人',
    icon: '🦠',
    effectType: SkillEffectType.DEBUFF,
    targetType: TargetType.ALL,
    features: [
      { id: 'b005_virus', name: '病毒', description: '使所有敌人攻击降低30%，持续3回合', value: 30, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 0, multiplier: 0, cooldown: 0, energyCost: 100, unlockedFeatures: ['b005_virus'] },
      { level: 2, baseValue: 0, multiplier: 0, cooldown: 0, energyCost: 100, unlockedFeatures: ['b005_virus'] },
      { level: 3, baseValue: 0, multiplier: 0, cooldown: 0, energyCost: 90, unlockedFeatures: ['b005_virus'] },
      { level: 4, baseValue: 0, multiplier: 0, cooldown: 0, energyCost: 90, unlockedFeatures: ['b005_virus'] },
      { level: 5, baseValue: 0, multiplier: 0, cooldown: 0, energyCost: 80, unlockedFeatures: ['b005_virus'] },
    ],
  } as SkillDefinition,

  talent: {
    id: 'b005_talent',
    name: '隐匿',
    type: SkillType.TALENT,
    description: '有概率闪避敌人攻击',
    icon: '👻',
    effectType: SkillEffectType.BUFF,
    targetType: TargetType.SELF,
    triggerTiming: TriggerTiming.ON_HIT,
    features: [
      { id: 'b005_dodge', name: '闪避', description: '15%概率闪避攻击', value: 15, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 10, unlockedFeatures: ['b005_dodge'] },
      { level: 2, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 15, unlockedFeatures: ['b005_dodge'] },
      { level: 3, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 20, unlockedFeatures: ['b005_dodge'] },
      { level: 4, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 25, unlockedFeatures: ['b005_dodge'] },
      { level: 5, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 30, unlockedFeatures: ['b005_dodge'] },
    ],
  } as SkillDefinition,
};

// B006 磐石 - 退役军人
export const CREW_B006_SKILLS = {
  basic: {
    id: 'b006_basic',
    name: '军体拳',
    type: SkillType.BASIC,
    description: '使用标准军体拳攻击',
    icon: '👊',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: DamageType.PHYSICAL,
    features: [
      { id: 'b006_counter', name: '反击姿态', description: '15%概率进行反击', value: 15, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 90, multiplier: 90, cooldown: 0, unlockedFeatures: [] },
      { level: 2, baseValue: 100, multiplier: 100, cooldown: 0, unlockedFeatures: [] },
      { level: 3, baseValue: 110, multiplier: 110, cooldown: 0, unlockedFeatures: ['b006_counter'] },
      { level: 4, baseValue: 120, multiplier: 120, cooldown: 0, unlockedFeatures: ['b006_counter'] },
      { level: 5, baseValue: 130, multiplier: 130, cooldown: 0, unlockedFeatures: ['b006_counter'] },
    ],
  } as SkillDefinition,

  skill: {
    id: 'b006_skill',
    name: '战壕掩护',
    type: SkillType.SKILL,
    description: '为队友提供掩护，分担伤害',
    icon: '🛡️',
    effectType: SkillEffectType.BUFF,
    targetType: TargetType.ALLY,
    features: [
      { id: 'b006_cover', name: '掩护', description: '为目标分担50%伤害，持续2回合', value: 50, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 0, multiplier: 0, cooldown: 4, unlockedFeatures: ['b006_cover'] },
      { level: 2, baseValue: 0, multiplier: 0, cooldown: 4, unlockedFeatures: ['b006_cover'] },
      { level: 3, baseValue: 0, multiplier: 0, cooldown: 3, unlockedFeatures: ['b006_cover'] },
      { level: 4, baseValue: 0, multiplier: 0, cooldown: 3, unlockedFeatures: ['b006_cover'] },
      { level: 5, baseValue: 0, multiplier: 0, cooldown: 3, unlockedFeatures: ['b006_cover'] },
    ],
  } as SkillDefinition,

  ultimate: {
    id: 'b006_ultimate',
    name: '钢铁防线',
    type: SkillType.ULTIMATE,
    description: '建立不可逾越的防线',
    icon: '🏰',
    effectType: SkillEffectType.BUFF,
    targetType: TargetType.SELF,
    features: [
      { id: 'b006_fortress', name: '钢铁之躯', description: '防御提升100%，持续3回合', value: 100, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 0, multiplier: 0, cooldown: 0, energyCost: 100, unlockedFeatures: ['b006_fortress'] },
      { level: 2, baseValue: 0, multiplier: 0, cooldown: 0, energyCost: 100, unlockedFeatures: ['b006_fortress'] },
      { level: 3, baseValue: 0, multiplier: 0, cooldown: 0, energyCost: 90, unlockedFeatures: ['b006_fortress'] },
      { level: 4, baseValue: 0, multiplier: 0, cooldown: 0, energyCost: 90, unlockedFeatures: ['b006_fortress'] },
      { level: 5, baseValue: 0, multiplier: 0, cooldown: 0, energyCost: 80, unlockedFeatures: ['b006_fortress'] },
    ],
  } as SkillDefinition,

  talent: {
    id: 'b006_talent',
    name: '老兵不死',
    type: SkillType.TALENT,
    description: '受到致命伤害时保留1点生命',
    icon: '🎖️',
    effectType: SkillEffectType.BUFF,
    targetType: TargetType.SELF,
    triggerTiming: TriggerTiming.ON_HP_BELOW,
    triggerThreshold: 0,
    features: [
      { id: 'b006_survive', name: '坚韧', description: '每场战斗1次，受到致命伤害时保留1点生命并恢复20%生命', value: 20, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 100, unlockedFeatures: ['b006_survive'] },
      { level: 2, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 100, unlockedFeatures: ['b006_survive'] },
      { level: 3, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 100, unlockedFeatures: ['b006_survive'] },
      { level: 4, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 100, unlockedFeatures: ['b006_survive'] },
      { level: 5, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 100, unlockedFeatures: ['b006_survive'] },
    ],
  } as SkillDefinition,
};

// B007 闪电 - 速度型猎手
export const CREW_B007_SKILLS = {
  basic: {
    id: 'b007_basic',
    name: '闪电突袭',
    type: SkillType.BASIC,
    description: '以闪电般的速度攻击',
    icon: '⚡',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: DamageType.ELECTRIC,
    features: [
      { id: 'b007_double', name: '连击', description: '30%概率攻击2次', value: 30, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 95, multiplier: 95, cooldown: 0, unlockedFeatures: [] },
      { level: 2, baseValue: 105, multiplier: 105, cooldown: 0, unlockedFeatures: [] },
      { level: 3, baseValue: 115, multiplier: 115, cooldown: 0, unlockedFeatures: ['b007_double'] },
      { level: 4, baseValue: 125, multiplier: 125, cooldown: 0, unlockedFeatures: ['b007_double'] },
      { level: 5, baseValue: 135, multiplier: 135, cooldown: 0, unlockedFeatures: ['b007_double'] },
    ],
  } as SkillDefinition,

  skill: {
    id: 'b007_skill',
    name: '疾风步',
    type: SkillType.SKILL,
    description: '进入疾风状态，大幅提升速度',
    icon: '💨',
    effectType: SkillEffectType.BUFF,
    targetType: TargetType.SELF,
    features: [
      { id: 'b007_speed', name: '极速', description: '攻速提升50%，持续3回合', value: 50, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 0, multiplier: 0, cooldown: 4, unlockedFeatures: ['b007_speed'] },
      { level: 2, baseValue: 0, multiplier: 0, cooldown: 4, unlockedFeatures: ['b007_speed'] },
      { level: 3, baseValue: 0, multiplier: 0, cooldown: 3, unlockedFeatures: ['b007_speed'] },
      { level: 4, baseValue: 0, multiplier: 0, cooldown: 3, unlockedFeatures: ['b007_speed'] },
      { level: 5, baseValue: 0, multiplier: 0, cooldown: 3, unlockedFeatures: ['b007_speed'] },
    ],
  } as SkillDefinition,

  ultimate: {
    id: 'b007_ultimate',
    name: '雷霆万钧',
    type: SkillType.ULTIMATE,
    description: '化身为雷霆，对所有敌人造成伤害',
    icon: '⛈️',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.ALL,
    damageType: DamageType.ELECTRIC,
    features: [
      { id: 'b007_thunder', name: '雷霆', description: '对所有敌人造成280%攻击力伤害', value: 280, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 240, multiplier: 240, cooldown: 0, energyCost: 100, unlockedFeatures: ['b007_thunder'] },
      { level: 2, baseValue: 260, multiplier: 260, cooldown: 0, energyCost: 100, unlockedFeatures: ['b007_thunder'] },
      { level: 3, baseValue: 280, multiplier: 280, cooldown: 0, energyCost: 90, unlockedFeatures: ['b007_thunder'] },
      { level: 4, baseValue: 300, multiplier: 300, cooldown: 0, energyCost: 90, unlockedFeatures: ['b007_thunder'] },
      { level: 5, baseValue: 320, multiplier: 320, cooldown: 0, energyCost: 80, unlockedFeatures: ['b007_thunder'] },
    ],
  } as SkillDefinition,

  talent: {
    id: 'b007_talent',
    name: '先发制人',
    type: SkillType.TALENT,
    description: '战斗开始时获得先攻',
    icon: '🏃',
    effectType: SkillEffectType.BUFF,
    targetType: TargetType.SELF,
    triggerTiming: TriggerTiming.ON_BATTLE_START,
    features: [
      { id: 'b007_first', name: '先攻', description: '战斗开始时立即行动，且首回合伤害提升30%', value: 30, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 100, unlockedFeatures: ['b007_first'] },
      { level: 2, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 100, unlockedFeatures: ['b007_first'] },
      { level: 3, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 100, unlockedFeatures: ['b007_first'] },
      { level: 4, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 100, unlockedFeatures: ['b007_first'] },
      { level: 5, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 100, unlockedFeatures: ['b007_first'] },
    ],
  } as SkillDefinition,
};

// B008 白鸽 - 战地护士
export const CREW_B008_SKILLS = {
  basic: {
    id: 'b008_basic',
    name: '镇静剂',
    type: SkillType.BASIC,
    description: '注射镇静剂攻击敌人，有概率使其沉睡',
    icon: '💉',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: DamageType.CORROSION,
    features: [
      { id: 'b008_sleep', name: '沉睡', description: '15%概率使目标沉睡1回合', value: 15, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 70, multiplier: 70, cooldown: 0, unlockedFeatures: [] },
      { level: 2, baseValue: 80, multiplier: 80, cooldown: 0, unlockedFeatures: [] },
      { level: 3, baseValue: 90, multiplier: 90, cooldown: 0, unlockedFeatures: ['b008_sleep'] },
      { level: 4, baseValue: 100, multiplier: 100, cooldown: 0, unlockedFeatures: ['b008_sleep'] },
      { level: 5, baseValue: 110, multiplier: 110, cooldown: 0, unlockedFeatures: ['b008_sleep'] },
    ],
  } as SkillDefinition,

  skill: {
    id: 'b008_skill',
    name: '战地急救',
    type: SkillType.SKILL,
    description: '为重伤队友进行紧急救治',
    icon: '🚑',
    effectType: SkillEffectType.HEAL,
    targetType: TargetType.ALLY,
    features: [
      { id: 'b008_heal', name: '急救', description: '恢复目标攻击力220%的生命，若目标生命低于30%则额外恢复50%', value: 220, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 200, multiplier: 200, cooldown: 3, unlockedFeatures: ['b008_heal'] },
      { level: 2, baseValue: 210, multiplier: 210, cooldown: 3, unlockedFeatures: ['b008_heal'] },
      { level: 3, baseValue: 220, multiplier: 220, cooldown: 2, unlockedFeatures: ['b008_heal'] },
      { level: 4, baseValue: 230, multiplier: 230, cooldown: 2, unlockedFeatures: ['b008_heal'] },
      { level: 5, baseValue: 240, multiplier: 240, cooldown: 2, unlockedFeatures: ['b008_heal'] },
    ],
  } as SkillDefinition,

  ultimate: {
    id: 'b008_ultimate',
    name: '和平之翼',
    type: SkillType.ULTIMATE,
    description: '展开治愈之翼，保护全队',
    icon: '🕊️',
    effectType: SkillEffectType.HEAL,
    targetType: TargetType.ALLIES,
    features: [
      { id: 'b008_wings', name: '治愈之翼', description: '恢复全体队友攻击力200%生命，并添加100%护盾', value: 200, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 180, multiplier: 180, cooldown: 0, energyCost: 100, unlockedFeatures: ['b008_wings'] },
      { level: 2, baseValue: 190, multiplier: 190, cooldown: 0, energyCost: 100, unlockedFeatures: ['b008_wings'] },
      { level: 3, baseValue: 200, multiplier: 200, cooldown: 0, energyCost: 90, unlockedFeatures: ['b008_wings'] },
      { level: 4, baseValue: 210, multiplier: 210, cooldown: 0, energyCost: 90, unlockedFeatures: ['b008_wings'] },
      { level: 5, baseValue: 220, multiplier: 220, cooldown: 0, energyCost: 80, unlockedFeatures: ['b008_wings'] },
    ],
  } as SkillDefinition,

  talent: {
    id: 'b008_talent',
    name: '永不放弃',
    type: SkillType.TALENT,
    description: '队友生命越低，治疗效果越高',
    icon: '💪',
    effectType: SkillEffectType.BUFF,
    targetType: TargetType.ALLY,
    triggerTiming: TriggerTiming.ON_ATTACK,
    features: [
      { id: 'b008_desperate', name: '急救专家', description: '目标每损失10%生命，治疗效果提升5%', value: 5, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 100, unlockedFeatures: ['b008_desperate'] },
      { level: 2, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 100, unlockedFeatures: ['b008_desperate'] },
      { level: 3, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 100, unlockedFeatures: ['b008_desperate'] },
      { level: 4, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 100, unlockedFeatures: ['b008_desperate'] },
      { level: 5, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 100, unlockedFeatures: ['b008_desperate'] },
    ],
  } as SkillDefinition,
};

// B009 信号 - 通讯兵
export const CREW_B009_SKILLS = {
  basic: {
    id: 'b009_basic',
    name: '信号干扰',
    type: SkillType.BASIC,
    description: '干扰敌人通讯系统',
    icon: '📡',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: DamageType.ELECTRIC,
    features: [
      { id: 'b009_defense_down', name: '干扰', description: '20%概率降低目标15%防御，持续2回合', value: 15, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 85, multiplier: 85, cooldown: 0, unlockedFeatures: [] },
      { level: 2, baseValue: 95, multiplier: 95, cooldown: 0, unlockedFeatures: [] },
      { level: 3, baseValue: 105, multiplier: 105, cooldown: 0, unlockedFeatures: ['b009_defense_down'] },
      { level: 4, baseValue: 115, multiplier: 115, cooldown: 0, unlockedFeatures: ['b009_defense_down'] },
      { level: 5, baseValue: 125, multiplier: 125, cooldown: 0, unlockedFeatures: ['b009_defense_down'] },
    ],
  } as SkillDefinition,

  skill: {
    id: 'b009_skill',
    name: '战术指挥',
    type: SkillType.SKILL,
    description: '指挥队友集中火力攻击',
    icon: '📢',
    effectType: SkillEffectType.BUFF,
    targetType: TargetType.ALLIES,
    features: [
      { id: 'b009_focus', name: '集火', description: '全队攻击提升35%，持续3回合', value: 35, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 0, multiplier: 0, cooldown: 4, unlockedFeatures: ['b009_focus'] },
      { level: 2, baseValue: 0, multiplier: 0, cooldown: 4, unlockedFeatures: ['b009_focus'] },
      { level: 3, baseValue: 0, multiplier: 0, cooldown: 3, unlockedFeatures: ['b009_focus'] },
      { level: 4, baseValue: 0, multiplier: 0, cooldown: 3, unlockedFeatures: ['b009_focus'] },
      { level: 5, baseValue: 0, multiplier: 0, cooldown: 3, unlockedFeatures: ['b009_focus'] },
    ],
  } as SkillDefinition,

  ultimate: {
    id: 'b009_ultimate',
    name: '全频干扰',
    type: SkillType.ULTIMATE,
    description: '释放强力干扰波，瘫痪所有敌人',
    icon: '📻',
    effectType: SkillEffectType.CONTROL,
    targetType: TargetType.ALL,
    features: [
      { id: 'b009_jam', name: '全频干扰', description: '所有敌人有70%概率眩晕1回合', value: 70, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 0, multiplier: 0, cooldown: 0, energyCost: 100, unlockedFeatures: ['b009_jam'] },
      { level: 2, baseValue: 0, multiplier: 0, cooldown: 0, energyCost: 100, unlockedFeatures: ['b009_jam'] },
      { level: 3, baseValue: 0, multiplier: 0, cooldown: 0, energyCost: 90, unlockedFeatures: ['b009_jam'] },
      { level: 4, baseValue: 0, multiplier: 0, cooldown: 0, energyCost: 90, unlockedFeatures: ['b009_jam'] },
      { level: 5, baseValue: 0, multiplier: 0, cooldown: 0, energyCost: 80, unlockedFeatures: ['b009_jam'] },
    ],
  } as SkillDefinition,

  talent: {
    id: 'b009_talent',
    name: '情报共享',
    type: SkillType.TALENT,
    description: '提升全队命中率',
    icon: '📊',
    effectType: SkillEffectType.BUFF,
    targetType: TargetType.ALLIES,
    triggerTiming: TriggerTiming.CONTINUOUS,
    features: [
      { id: 'b009_aim', name: '精准', description: '全队命中率提升15%', value: 15, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 100, unlockedFeatures: ['b009_aim'] },
      { level: 2, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 100, unlockedFeatures: ['b009_aim'] },
      { level: 3, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 100, unlockedFeatures: ['b009_aim'] },
      { level: 4, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 100, unlockedFeatures: ['b009_aim'] },
      { level: 5, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 100, unlockedFeatures: ['b009_aim'] },
    ],
  } as SkillDefinition,
};

// B010 病毒 - 黑客
export const CREW_B010_SKILLS = {
  basic: {
    id: 'b010_basic',
    name: '恶意代码',
    type: SkillType.BASIC,
    description: '植入恶意代码攻击敌人',
    icon: '💻',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: DamageType.CORROSION,
    features: [
      { id: 'b010_poison', name: '腐蚀', description: '25%概率使目标中毒，每回合损失10%攻击，持续3回合', value: 10, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 85, multiplier: 85, cooldown: 0, unlockedFeatures: [] },
      { level: 2, baseValue: 95, multiplier: 95, cooldown: 0, unlockedFeatures: [] },
      { level: 3, baseValue: 105, multiplier: 105, cooldown: 0, unlockedFeatures: ['b010_poison'] },
      { level: 4, baseValue: 115, multiplier: 115, cooldown: 0, unlockedFeatures: ['b010_poison'] },
      { level: 5, baseValue: 125, multiplier: 125, cooldown: 0, unlockedFeatures: ['b010_poison'] },
    ],
  } as SkillDefinition,

  skill: {
    id: 'b010_skill',
    name: '防火墙突破',
    type: SkillType.SKILL,
    description: '突破敌人防御系统',
    icon: '🔓',
    effectType: SkillEffectType.DEBUFF,
    targetType: TargetType.SINGLE,
    features: [
      { id: 'b010_break', name: '破防', description: '使目标防御降低50%，持续2回合', value: 50, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 0, multiplier: 0, cooldown: 4, unlockedFeatures: ['b010_break'] },
      { level: 2, baseValue: 0, multiplier: 0, cooldown: 4, unlockedFeatures: ['b010_break'] },
      { level: 3, baseValue: 0, multiplier: 0, cooldown: 3, unlockedFeatures: ['b010_break'] },
      { level: 4, baseValue: 0, multiplier: 0, cooldown: 3, unlockedFeatures: ['b010_break'] },
      { level: 5, baseValue: 0, multiplier: 0, cooldown: 3, unlockedFeatures: ['b010_break'] },
    ],
  } as SkillDefinition,

  ultimate: {
    id: 'b010_ultimate',
    name: '系统崩溃',
    type: SkillType.ULTIMATE,
    description: '使所有敌人系统崩溃',
    icon: '💀',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.ALL,
    damageType: DamageType.CORROSION,
    features: [
      { id: 'b010_crash', name: '崩溃', description: '对所有敌人造成250%伤害，并使其攻击降低30%，持续2回合', value: 250, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 220, multiplier: 220, cooldown: 0, energyCost: 100, unlockedFeatures: ['b010_crash'] },
      { level: 2, baseValue: 235, multiplier: 235, cooldown: 0, energyCost: 100, unlockedFeatures: ['b010_crash'] },
      { level: 3, baseValue: 250, multiplier: 250, cooldown: 0, energyCost: 90, unlockedFeatures: ['b010_crash'] },
      { level: 4, baseValue: 265, multiplier: 265, cooldown: 0, energyCost: 90, unlockedFeatures: ['b010_crash'] },
      { level: 5, baseValue: 280, multiplier: 280, cooldown: 0, energyCost: 80, unlockedFeatures: ['b010_crash'] },
    ],
  } as SkillDefinition,

  talent: {
    id: 'b010_talent',
    name: '病毒传播',
    type: SkillType.TALENT,
    description: '攻击时病毒会传播',
    icon: '🦠',
    effectType: SkillEffectType.DEBUFF,
    targetType: TargetType.SINGLE,
    triggerTiming: TriggerTiming.ON_ATTACK,
    features: [
      { id: 'b010_spread', name: '传播', description: '攻击有30%概率使相邻敌人也中毒', value: 30, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 20, unlockedFeatures: ['b010_spread'] },
      { level: 2, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 25, unlockedFeatures: ['b010_spread'] },
      { level: 3, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 30, unlockedFeatures: ['b010_spread'] },
      { level: 4, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 35, unlockedFeatures: ['b010_spread'] },
      { level: 5, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 40, unlockedFeatures: ['b010_spread'] },
    ],
  } as SkillDefinition,
};

// 技能映射表 - B级船员（9个角色，白鸽已删除）
export const B_CREW_SKILLS: Record<string, { basic: SkillDefinition; skill: SkillDefinition; ultimate: SkillDefinition; talent: SkillDefinition }> = {
  'crew_b_001': CREW_B001_SKILLS,
  'crew_b_002': CREW_B002_SKILLS,
  'crew_b_003': CREW_B003_SKILLS,
  'crew_b_004': CREW_B004_SKILLS,
  'crew_b_005': CREW_B005_SKILLS,
  'crew_b_006': CREW_B006_SKILLS,
  'crew_b_007': CREW_B007_SKILLS,
  'crew_b_008': CREW_B009_SKILLS,  // 信号（原B009）
  'crew_b_009': CREW_B010_SKILLS,  // 病毒（原B010）
};
