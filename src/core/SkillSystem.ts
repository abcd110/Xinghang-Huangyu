/**
 * 技能系统 - 处理技能的定义、强化和战斗效果计算
 * 
 * 适配现有自动战斗系统：
 * - 所有技能都是自动触发，无需玩家手动操作
 * - 普攻：按攻速自动触发
 * - 主动技能：按冷却时间自动触发
 * - 终极技能：能量满时自动触发
 * - 天赋：根据触发条件自动生效
 */

import {
  SkillDefinition,
  SkillInstance,
  SkillType,
  SkillEffectType,
  TargetType,
  BattleSkillEffect,
  AscendSkillBonus,
  SKILL_ASCEND_BONUSES,
  SKILL_FEATURE_IDS,
  TriggerTiming,
} from '../screens/crewScreen/types/skillTypes';
import { CrewMember } from './CrewSystem';

// 技能效果计算结果
export interface SkillEffectResult {
  damage?: number;
  heal?: number;
  shield?: number;
  buffs?: { type: string; value: number; duration: number }[];
  debuffs?: { type: string; value: number; duration: number }[];
  isCrit: boolean;
  targetIndices: number[];
  logMessage: string;
}

// 船员技能数据（存储在船员对象中）
export interface CrewSkillData {
  skillSetId: string;
  star: number;  // 当前星级，决定技能等级
  skillInstances: Map<SkillType, SkillInstance>;
}

// 技能管理器
export class SkillManager {
  private skillDefinitions: Map<string, SkillDefinition> = new Map();
  private crewSkillData: Map<string, CrewSkillData> = new Map(); // crewId -> skillData

  // 注册技能定义
  registerSkill(skill: SkillDefinition): void {
    this.skillDefinitions.set(skill.id, skill);
  }

  // 获取技能定义
  getSkillDefinition(skillId: string): SkillDefinition | undefined {
    return this.skillDefinitions.get(skillId);
  }

  // 初始化船员技能数据
  initCrewSkills(crewId: string, skillSetId: string, star: number = 1): void {
    const skillInstances = new Map<SkillType, SkillInstance>();

    // 为每种技能类型创建实例
    Object.values(SkillType).forEach(type => {
      skillInstances.set(type, {
        skillId: `${skillSetId}_${type}`,
        currentLevel: star,
        maxLevel: star,
        currentCooldown: 0,
        currentEnergy: 0,
        maxEnergy: 100,
      });
    });

    this.crewSkillData.set(crewId, {
      skillSetId,
      star,
      skillInstances,
    });
  }

  // 更新船员星级（突破后调用）
  updateCrewStar(crewId: string, newStar: number): void {
    const data = this.crewSkillData.get(crewId);
    if (!data) return;

    data.star = newStar;

    // 更新所有技能的最大等级
    data.skillInstances.forEach(instance => {
      instance.maxLevel = newStar;
      instance.currentLevel = Math.min(instance.currentLevel + 1, newStar);
    });
  }

  // 获取船员的技能强化效果
  getCrewSkillBonuses(crewId: string): AscendSkillBonus[] {
    const data = this.crewSkillData.get(crewId);
    if (!data) return [];

    const bonuses: AscendSkillBonus[] = [];

    // 获取当前星级及以下的所有强化效果
    for (let star = 2; star <= data.star; star++) {
      const starBonuses = SKILL_ASCEND_BONUSES[star];
      if (starBonuses) {
        Object.values(starBonuses).forEach(bonus => {
          if (bonus) bonuses.push(bonus);
        });
      }
    }

    return bonuses;
  }

  // 计算技能在战斗中的实际效果
  calculateSkillEffect(
    skillId: string,
    casterStats: { attack: number; level: number },
    star: number,
    targetCount: number = 1
  ): BattleSkillEffect {
    const skill = this.skillDefinitions.get(skillId);
    if (!skill) {
      return {
        baseValue: 0,
        multiplier: 100,
        targetCount: 1,
        canCrit: true,
        lifeStealPercent: 0,
        additionalEffects: {},
      };
    }

    // 获取当前星级对应的技能等级效果
    const levelEffect = skill.levelEffects[Math.min(star - 1, skill.levelEffects.length - 1)];

    // 基础数值计算
    let baseValue = levelEffect.baseValue;
    let multiplier = levelEffect.multiplier;

    // 根据技能类型调整
    switch (skill.effectType) {
      case SkillEffectType.DAMAGE:
        baseValue = Math.floor(casterStats.attack * (multiplier / 100));
        break;
      case SkillEffectType.HEAL:
        baseValue = Math.floor(casterStats.attack * (multiplier / 100));
        break;
      case SkillEffectType.SHIELD:
        baseValue = Math.floor(casterStats.attack * (multiplier / 100));
        break;
    }

    // 应用突破强化效果
    const bonuses = this.getStarBonuses(star, skill.type);
    bonuses.forEach(bonus => {
      if (bonus.effects.damageIncrease && skill.effectType === SkillEffectType.DAMAGE) {
        multiplier += bonus.effects.damageIncrease;
      }
      if (bonus.effects.healIncrease && skill.effectType === SkillEffectType.HEAL) {
        multiplier += bonus.effects.healIncrease;
      }
    });

    // 计算目标数量
    let finalTargetCount = targetCount;
    if (skill.targetType === TargetType.ALL || skill.targetType === TargetType.AOE) {
      finalTargetCount = targetCount;
    } else if (skill.targetType === TargetType.SINGLE) {
      finalTargetCount = 1;
    }

    // 检查是否有连击特性
    let canCrit = true;
    const hasChainAttack = bonuses.some(b =>
      b.effects.unlockFeature === SKILL_FEATURE_IDS.CHAIN_ATTACK
    );

    // 构建附加效果
    const additionalEffects: BattleSkillEffect['additionalEffects'] = {};

    // 检查特性解锁
    const unlockedFeatures = levelEffect.unlockedFeatures;
    if (unlockedFeatures.includes(SKILL_FEATURE_IDS.STUN)) {
      additionalEffects.stun = 1; // 眩晕1回合
    }
    if (unlockedFeatures.includes(SKILL_FEATURE_IDS.LIFE_STEAL)) {
      additionalEffects.lifeStealPercent = 15; // 15%吸血
    }

    return {
      baseValue,
      multiplier,
      targetCount: finalTargetCount,
      canCrit,
      lifeStealPercent: additionalEffects.lifeStealPercent || 0,
      additionalEffects,
    };
  }

  // 获取指定星级和技能类型的强化效果
  private getStarBonuses(star: number, skillType: SkillType): AscendSkillBonus[] {
    const bonuses: AscendSkillBonus[] = [];

    for (let s = 2; s <= star; s++) {
      const starBonus = SKILL_ASCEND_BONUSES[s];
      if (starBonus && starBonus[skillType]) {
        bonuses.push(starBonus[skillType]!);
      }
    }

    return bonuses;
  }

  // 检查技能是否触发连击
  checkChainAttack(star: number): boolean {
    if (star < 4) return false;

    const bonuses = this.getStarBonuses(star, SkillType.BASIC);
    const hasChainAttack = bonuses.some(b =>
      b.effects.unlockFeature === SKILL_FEATURE_IDS.CHAIN_ATTACK
    );

    if (!hasChainAttack) return false;

    // 30%概率触发连击
    return Math.random() < 0.3;
  }

  // 获取技能冷却时间（受强化影响）
  getSkillCooldown(skillId: string, star: number): number {
    const skill = this.skillDefinitions.get(skillId);
    if (!skill) return 0;

    const levelEffect = skill.levelEffects[Math.min(star - 1, skill.levelEffects.length - 1)];
    let cooldown = levelEffect.cooldown;

    // 应用冷却减少
    const bonuses = this.getStarBonuses(star, skill.type);
    bonuses.forEach(bonus => {
      if (bonus.effects.cooldownReduce) {
        cooldown -= bonus.effects.cooldownReduce;
      }
      if (bonus.effects.cooldownReducePercent) {
        cooldown = Math.floor(cooldown * (1 - bonus.effects.cooldownReducePercent / 100));
      }
    });

    return Math.max(0, cooldown);
  }

  // 获取天赋触发概率（受强化影响）
  getTalentTriggerChance(skillId: string, star: number): number {
    const skill = this.skillDefinitions.get(skillId);
    if (!skill || skill.type !== SkillType.TALENT) return 0;

    const levelEffect = skill.levelEffects[Math.min(star - 1, skill.levelEffects.length - 1)];
    let chance = levelEffect.triggerChance || 0;

    // 应用触发概率增加
    const bonuses = this.getStarBonuses(star, SkillType.TALENT);
    bonuses.forEach(bonus => {
      if (bonus.effects.triggerChanceIncrease) {
        chance += bonus.effects.triggerChanceIncrease;
      }
    });

    return Math.min(100, chance);
  }

  // 生成技能描述文本
  generateSkillDescription(skillId: string, star: number): string {
    const skill = this.skillDefinitions.get(skillId);
    if (!skill) return '';

    const effect = this.calculateSkillEffect(skillId, { attack: 100, level: 1 }, star);
    const bonuses = this.getStarBonuses(star, skill.type);

    let desc = skill.description;

    // 添加数值信息
    if (skill.effectType === SkillEffectType.DAMAGE) {
      desc += `\n造成 ${effect.multiplier}% 攻击力的伤害`;
    } else if (skill.effectType === SkillEffectType.HEAL) {
      desc += `\n恢复 ${effect.multiplier}% 攻击力的生命`;
    }

    // 添加强化效果描述
    bonuses.forEach(bonus => {
      desc += `\n[突破${bonus.star}星] ${bonus.description}`;
    });

    return desc;
  }
}

// 创建全局技能管理器实例
export const skillManager = new SkillManager();

// 示例技能定义 - 战士类型
export const WARRIOR_SKILL_SET = {
  basic: {
    id: 'warrior_basic',
    name: '重斩',
    type: SkillType.BASIC,
    description: '挥舞武器进行强力斩击',
    icon: '⚔️',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: SkillEffectType.DAMAGE,
    features: [
      { id: SKILL_FEATURE_IDS.CHAIN_ATTACK, name: '连击', description: '30%概率攻击2次', value: 30, unit: '%' },
      { id: SKILL_FEATURE_IDS.LIFE_STEAL, name: '吸血', description: '攻击恢复15%伤害的生命', value: 15, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 100, multiplier: 100, cooldown: 0, unlockedFeatures: [] },
      { level: 2, baseValue: 120, multiplier: 120, cooldown: 0, unlockedFeatures: [] },
      { level: 3, baseValue: 140, multiplier: 140, cooldown: 0, unlockedFeatures: [] },
      { level: 4, baseValue: 160, multiplier: 160, cooldown: 0, unlockedFeatures: [SKILL_FEATURE_IDS.CHAIN_ATTACK] },
      { level: 5, baseValue: 180, multiplier: 180, cooldown: 0, unlockedFeatures: [SKILL_FEATURE_IDS.CHAIN_ATTACK, SKILL_FEATURE_IDS.LIFE_STEAL] },
    ],
  } as SkillDefinition,

  skill: {
    id: 'warrior_skill',
    name: '旋风斩',
    type: SkillType.SKILL,
    description: '旋转武器攻击周围所有敌人',
    icon: '🌪️',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.AOE,
    damageType: SkillEffectType.DAMAGE,
    features: [
      { id: SKILL_FEATURE_IDS.STUN, name: '眩晕', description: '20%概率眩晕目标1回合', value: 20, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 150, multiplier: 150, cooldown: 3, unlockedFeatures: [] },
      { level: 2, baseValue: 170, multiplier: 170, cooldown: 3, unlockedFeatures: [] },
      { level: 3, baseValue: 200, multiplier: 200, cooldown: 2, unlockedFeatures: [] },
      { level: 4, baseValue: 230, multiplier: 230, cooldown: 2, unlockedFeatures: [SKILL_FEATURE_IDS.STUN] },
      { level: 5, baseValue: 260, multiplier: 260, cooldown: 2, unlockedFeatures: [SKILL_FEATURE_IDS.STUN] },
    ],
  } as SkillDefinition,

  ultimate: {
    id: 'warrior_ultimate',
    name: '毁灭打击',
    type: SkillType.ULTIMATE,
    description: '聚集全身力量发出毁灭性一击',
    icon: '💥',
    effectType: SkillEffectType.DAMAGE,
    targetType: TargetType.SINGLE,
    damageType: SkillEffectType.DAMAGE,
    features: [
      { id: SKILL_FEATURE_IDS.IGNORE_DEFENSE, name: '破甲', description: '无视目标50%防御', value: 50, unit: '%' },
      { id: SKILL_FEATURE_IDS.EXECUTE, name: '斩杀', description: '对生命值低于30%的目标伤害翻倍', value: 100, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 300, multiplier: 300, cooldown: 0, energyCost: 100, unlockedFeatures: [] },
      { level: 2, baseValue: 350, multiplier: 350, cooldown: 0, energyCost: 100, unlockedFeatures: [] },
      { level: 3, baseValue: 400, multiplier: 400, cooldown: 0, energyCost: 90, unlockedFeatures: [] },
      { level: 4, baseValue: 450, multiplier: 450, cooldown: 0, energyCost: 90, unlockedFeatures: [SKILL_FEATURE_IDS.IGNORE_DEFENSE] },
      { level: 5, baseValue: 500, multiplier: 500, cooldown: 0, energyCost: 80, unlockedFeatures: [SKILL_FEATURE_IDS.IGNORE_DEFENSE, SKILL_FEATURE_IDS.EXECUTE] },
    ],
  } as SkillDefinition,

  talent: {
    id: 'warrior_talent',
    name: '战斗狂热',
    type: SkillType.TALENT,
    description: '战斗中越战越勇',
    icon: '🔥',
    effectType: SkillEffectType.BUFF,
    targetType: TargetType.SELF,
    triggerTiming: TriggerTiming.ON_ATTACK,
    triggerThreshold: 0,
    features: [
      { id: SKILL_FEATURE_IDS.TALENT_AWAKEN, name: '觉醒', description: '攻击有25%概率获得攻击提升10%，可叠加3层', value: 25, unit: '%' },
    ],
    levelEffects: [
      { level: 1, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 15, unlockedFeatures: [] },
      { level: 2, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 20, unlockedFeatures: [] },
      { level: 3, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 20, unlockedFeatures: [] },
      { level: 4, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 25, unlockedFeatures: [] },
      { level: 5, baseValue: 0, multiplier: 0, cooldown: 0, triggerChance: 35, unlockedFeatures: [SKILL_FEATURE_IDS.TALENT_AWAKEN] },
    ],
  } as SkillDefinition,
};

// 注册示例技能
Object.values(WARRIOR_SKILL_SET).forEach(skill => {
  skillManager.registerSkill(skill);
});
