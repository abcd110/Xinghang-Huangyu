export enum SkillType {
  ACTIVE = 'active',
  PASSIVE = 'passive',
}

export enum SkillTarget {
  SELF = 'self',
  ENEMY = 'enemy',
  AREA = 'area',
}

export interface SkillEffect {
  damage?: number;
  damagePercent?: number;
  heal?: number;
  healPercent?: number;
  buffAttack?: number;
  buffDefense?: number;
  buffSpeed?: number;
  debuffAttack?: number;
  debuffDefense?: number;
  stunChance?: number;
  critBoost?: number;
  drainHp?: number;
}

export interface SkillData {
  skillId: string;
  name: string;
  description: string;
  skillType: SkillType;
  target: SkillTarget;
  level: number;
  maxLevel: number;
  staminaCost: number;
  hpCost: number;
  cooldown: number;
  currentCooldown: number;
  useCount: number;
  baseEffect: SkillEffect;
  levelScaling: SkillEffect;
}

export class Skill {
  skillId: string;
  name: string;
  description: string;
  skillType: SkillType;
  target: SkillTarget;
  level: number;
  maxLevel: number;
  staminaCost: number;
  hpCost: number;
  cooldown: number;
  currentCooldown: number;
  useCount: number;
  baseEffect: SkillEffect;
  levelScaling: SkillEffect;

  constructor(data: Partial<SkillData>) {
    this.skillId = data.skillId || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.skillType = data.skillType || SkillType.ACTIVE;
    this.target = data.target || SkillTarget.ENEMY;
    this.level = data.level || 1;
    this.maxLevel = data.maxLevel || 5;
    this.staminaCost = data.staminaCost || 0;
    this.hpCost = data.hpCost || 0;
    this.cooldown = data.cooldown || 0;
    this.currentCooldown = data.currentCooldown || 0;
    this.useCount = data.useCount || 0;
    this.baseEffect = data.baseEffect || {};
    this.levelScaling = data.levelScaling || {};
  }

  getCurrentEffect(): SkillEffect {
    const levelBonus = this.level - 1;
    return {
      damage: (this.baseEffect.damage || 0) + (this.levelScaling.damage || 0) * levelBonus,
      damagePercent: (this.baseEffect.damagePercent || 0) + (this.levelScaling.damagePercent || 0) * levelBonus,
      heal: (this.baseEffect.heal || 0) + (this.levelScaling.heal || 0) * levelBonus,
      healPercent: (this.baseEffect.healPercent || 0) + (this.levelScaling.healPercent || 0) * levelBonus,
      buffAttack: (this.baseEffect.buffAttack || 0) + (this.levelScaling.buffAttack || 0) * levelBonus,
      buffDefense: (this.baseEffect.buffDefense || 0) + (this.levelScaling.buffDefense || 0) * levelBonus,
      buffSpeed: (this.baseEffect.buffSpeed || 0) + (this.levelScaling.buffSpeed || 0) * levelBonus,
      stunChance: Math.min(1.0, (this.baseEffect.stunChance || 0) + (this.levelScaling.stunChance || 0) * levelBonus),
      critBoost: (this.baseEffect.critBoost || 0) + (this.levelScaling.critBoost || 0) * levelBonus,
      drainHp: (this.baseEffect.drainHp || 0) + (this.levelScaling.drainHp || 0) * levelBonus,
    };
  }

  canUse(): boolean {
    return this.currentCooldown <= 0;
  }

  use(): boolean {
    if (!this.canUse()) return false;
    this.currentCooldown = this.cooldown;
    this.useCount++;
    return true;
  }

  onTurnEnd(): void {
    if (this.currentCooldown > 0) {
      this.currentCooldown--;
    }
  }

  getUpgradeCost(): { exp: number; trainCoins: number } {
    const baseExp = 100;
    const baseCoins = 50;
    const multiplier = this.level;
    return {
      exp: baseExp * multiplier,
      trainCoins: baseCoins * multiplier,
    };
  }

  serialize(): SkillData {
    return {
      skillId: this.skillId,
      name: this.name,
      description: this.description,
      skillType: this.skillType,
      target: this.target,
      level: this.level,
      maxLevel: this.maxLevel,
      staminaCost: this.staminaCost,
      hpCost: this.hpCost,
      cooldown: this.cooldown,
      currentCooldown: this.currentCooldown,
      useCount: this.useCount,
      baseEffect: this.baseEffect,
      levelScaling: this.levelScaling,
    };
  }

  static fromDict(data: SkillData): Skill {
    return new Skill(data);
  }
}

// 技能模板
export const SKILL_TEMPLATES: Record<string, Partial<SkillData>> = {
  // 主动技能 - 攻击类
  skill_power_strike: {
    name: '强力打击',
    description: '造成150%攻击力的伤害',
    skillType: SkillType.ACTIVE,
    target: SkillTarget.ENEMY,
    staminaCost: 0,
    cooldown: 10,
    baseEffect: { damagePercent: 150 },
    levelScaling: { damagePercent: 20 },
  },
  skill_heavy_slash: {
    name: '重斩',
    description: '造成200%攻击力的伤害，但下回合无法行动',
    skillType: SkillType.ACTIVE,
    target: SkillTarget.ENEMY,
    staminaCost: 25,
    cooldown: 3,
    baseEffect: { damagePercent: 1.0 },
    levelScaling: { damagePercent: 0.15 },
  },
  skill_blood_thirst: {
    name: '嗜血攻击',
    description: '造成120%伤害，并恢复造成伤害30%的生命',
    skillType: SkillType.ACTIVE,
    target: SkillTarget.ENEMY,
    staminaCost: 20,
    cooldown: 2,
    baseEffect: { damagePercent: 0.2, drainHp: 0.3 },
    levelScaling: { damagePercent: 0.05, drainHp: 0.05 },
  },
  skill_stun_blow: {
    name: '眩晕打击',
    description: '造成80%伤害，50%概率眩晕敌人1回合',
    skillType: SkillType.ACTIVE,
    target: SkillTarget.ENEMY,
    staminaCost: 18,
    cooldown: 3,
    baseEffect: { damagePercent: -0.2, stunChance: 0.5 },
    levelScaling: { stunChance: 0.05 },
  },
  // 主动技能 - 防御类
  skill_iron_will: {
    name: '钢铁意志',
    description: '3回合内防御力+50%',
    skillType: SkillType.ACTIVE,
    target: SkillTarget.SELF,
    staminaCost: 15,
    cooldown: 4,
    baseEffect: { buffDefense: 50 },
    levelScaling: { buffDefense: 10 },
  },
  skill_first_aid: {
    name: '急救',
    description: '恢复30%最大生命值',
    skillType: SkillType.ACTIVE,
    target: SkillTarget.SELF,
    staminaCost: 0,
    cooldown: 20,
    baseEffect: { healPercent: 30 },
    levelScaling: { healPercent: 5 },
  },
  // 主动技能 - 特殊类
  skill_berserk: {
    name: '狂暴',
    description: '攻击力+100%，但受到的伤害也+50%，持续3回合',
    skillType: SkillType.ACTIVE,
    target: SkillTarget.SELF,
    staminaCost: 25,
    cooldown: 5,
    baseEffect: { buffAttack: 100 },
    levelScaling: { buffAttack: 15 },
  },
  skill_focus: {
    name: '专注',
    description: '下回合必定暴击',
    skillType: SkillType.ACTIVE,
    target: SkillTarget.SELF,
    staminaCost: 12,
    cooldown: 3,
    baseEffect: { critBoost: 1.0 },
    levelScaling: {},
  },
  // 被动技能
  passive_toughness: {
    name: '坚韧',
    description: '最大生命值+20%',
    skillType: SkillType.PASSIVE,
    target: SkillTarget.SELF,
    baseEffect: { healPercent: 0.2 },
    levelScaling: { healPercent: 0.05 },
  },
  passive_agility: {
    name: '敏捷',
    description: '速度+20%',
    skillType: SkillType.PASSIVE,
    target: SkillTarget.SELF,
    baseEffect: { buffSpeed: 20 },
    levelScaling: { buffSpeed: 5 },
  },
  passive_vampire: {
    name: '生命偷取',
    description: '普通攻击恢复造成伤害10%的生命',
    skillType: SkillType.PASSIVE,
    target: SkillTarget.SELF,
    baseEffect: { drainHp: 0.1 },
    levelScaling: { drainHp: 0.02 },
  },
  passive_critical: {
    name: '暴击精通',
    description: '暴击率+15%',
    skillType: SkillType.PASSIVE,
    target: SkillTarget.SELF,
    baseEffect: { critBoost: 0.15 },
    levelScaling: { critBoost: 0.03 },
  },
  passive_regen: {
    name: '再生',
    description: '每回合恢复5%最大生命值',
    skillType: SkillType.PASSIVE,
    target: SkillTarget.SELF,
    baseEffect: { healPercent: 0.05 },
    levelScaling: { healPercent: 0.01 },
  },
  passive_counter: {
    name: '反击',
    description: '受到攻击时30%概率反击',
    skillType: SkillType.PASSIVE,
    target: SkillTarget.SELF,
    baseEffect: {},
    levelScaling: {},
  },
};

// 技能解锁链
export const SKILL_UNLOCK_CHAINS: Record<string, string[]> = {
  skill_power_strike: ['skill_heavy_slash', 'skill_stun_blow'],
  skill_first_aid: ['skill_iron_will'],
  skill_blood_thirst: ['passive_vampire'],
  passive_toughness: ['passive_regen'],
  passive_agility: ['passive_counter'],
  passive_critical: ['skill_focus'],
};
