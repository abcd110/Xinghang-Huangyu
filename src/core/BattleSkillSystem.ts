/**
 * 战斗技能系统 - 将角色技能应用到战斗中
 * 
 * 处理：
 * - 普攻：按攻速自动触发，+5能量
 * - 主动技能：按冷却时间自动触发，+20能量
 * - 终极技能：能量满100时自动触发，消耗100能量
 * - 天赋：根据触发条件自动生效
 */

import { SkillSet, SkillType, SkillEffectType, TargetType, TriggerTiming } from '../screens/crewScreen/types/skillTypes';
import { getCrewSkills } from '../data/crewSkills';
import { StatusEffect, StatusEffectType, createStatusEffect } from './StatusEffectManager';

// 战斗中单位的技能状态
export interface BattleUnitSkillState {
  crewId: string;
  skillSet: SkillSet;
  star: number;
  skillLevels: Record<string, number>; // 各技能等级

  // 能量
  currentEnergy: number;
  maxEnergy: number;

  // 冷却
  basicCooldown: number;
  skillCooldown: number;
  ultimateCooldown: number;

  // 天赋触发状态
  talentTriggered: boolean;

  // 叠加层数（如闪电的疾风）
  stackCount: number;

  // 战斗开始已触发
  battleStartTriggered: boolean;
}

// 技能效果结果
export interface SkillEffectResult {
  type: 'damage' | 'heal' | 'shield' | 'buff' | 'debuff' | 'control' | 'summon';
  value: number;
  targetIndices: number[];
  isCrit?: boolean;
  logMessage: string;
  skillName?: string;  // 技能名称

  // 特殊效果
  burnStacks?: number;
  stunDuration?: number;
  defenseReduction?: number;
  attackBoost?: number;
  speedBoost?: number;
  shieldValue?: number;

  // 护盾上限
  shieldCapPercent?: number;  // 护盾上限百分比（相对于防御力）

  // 召唤物数据
  summonData?: {
    summonId: string;
    count: number;
    skillLevel: number;
  };

  // 增强召唤物数据
  enhanceSummons?: {
    duration: number;
    additionalSummons?: number;
  };

  // 状态效果数据
  statusEffects?: StatusEffect[];
}

// 战斗技能管理器
export class BattleSkillManager {
  private unitSkills: Map<string, BattleUnitSkillState> = new Map();

  // 初始化单位技能
  initUnitSkills(unitId: string, crewId: string, star: number = 1, skillLevels?: Record<string, number>): boolean {
    const skillSet = getCrewSkills(crewId);
    if (!skillSet) return false;

    this.unitSkills.set(unitId, {
      crewId,
      skillSet,
      star,
      skillLevels: skillLevels || { basic: 1, skill: 1, ultimate: 1, talent: 1 },
      currentEnergy: 0,
      maxEnergy: 100,
      basicCooldown: 0,
      skillCooldown: 0,
      ultimateCooldown: 0,
      talentTriggered: false,
      stackCount: 0,
      battleStartTriggered: false,
    });

    return true;
  }

  // 获取单位技能状态
  getUnitSkillState(unitId: string): BattleUnitSkillState | undefined {
    return this.unitSkills.get(unitId);
  }

  // 战斗开始触发
  onBattleStart(unitId: string, unitIndex: number, allUnits: any[]): SkillEffectResult[] {
    const state = this.unitSkills.get(unitId);
    if (!state || state.battleStartTriggered) return [];

    state.battleStartTriggered = true;
    const results: SkillEffectResult[] = [];
    const { skillSet, star } = state;

    // 检查5星效果
    const star5Bonus = skillSet.starBonuses.find(b => b.star === 5);
    if (star >= 5 && star5Bonus) {
      // 根据角色处理5星战斗开始效果
      switch (skillSet.talent.star5Bonus) {
        case '战斗开始时，为所有队友添加100%防御力的护盾':
          // B001 铁壁
          results.push({
            type: 'shield',
            value: 0, // 由调用者根据防御力计算
            targetIndices: allUnits.filter(u => u.isPlayer).map(u => u.index),
            logMessage: '【铁壁】战斗开始：为全队添加护盾',
            shieldValue: 100, // 100%防御力
          });
          break;
        case '战斗开始时，100%基础概率对敌方随机单体目标施加1层灼烧':
          // B002 赤焰
          const randomEnemy = allUnits.filter(u => !u.isPlayer && u.isAlive);
          if (randomEnemy.length > 0) {
            const target = randomEnemy[Math.floor(Math.random() * randomEnemy.length)];
            results.push({
              type: 'debuff',
              value: 20,
              targetIndices: [target.index],
              logMessage: `【赤焰】战斗开始：对${target.name}施加灼烧`,
              burnStacks: 1,
            });
          }
          break;
        // 其他角色的5星效果...
      }
    }

    return results;
  }

  // 执行普攻
  executeBasicAttack(unitId: string, unitIndex: number, attackerStats: any, allUnits: any[]): SkillEffectResult {
    const state = this.unitSkills.get(unitId);
    if (!state) return { type: 'damage', value: 0, targetIndices: [], logMessage: '' };

    const { skillSet, star, skillLevels } = state;
    const basicSkill = skillSet.basic;

    // 获取当前技能等级
    const skillLevel = skillLevels['basic'] || 1;
    const levelIndex = Math.min(skillLevel - 1, basicSkill.levels.length - 1);
    const levelData = basicSkill.levels[levelIndex];

    // 计算伤害
    const scaleStat = basicSkill.scaleStat === 'defense' ? attackerStats.defense : attackerStats.attack;
    const damage = Math.floor(scaleStat * (levelData.value / 100));

    // 增加能量
    state.currentEnergy = Math.min(state.maxEnergy, state.currentEnergy + levelData.energyGain);

    // 选择目标 - 从allUnits获取攻击者的isPlayer属性
    const attacker = allUnits.find(u => u.index === unitIndex);
    const isPlayer = attacker?.isPlayer ?? false;
    const targetIndices = this.selectTargets(basicSkill.targetType, unitIndex, allUnits, isPlayer);

    // 检查天赋触发（攻击时）
    const talentResults = this.checkTalentTrigger(unitId, unitIndex, attackerStats, allUnits, TriggerTiming.ON_ATTACK);

    const result: SkillEffectResult = {
      type: 'damage',
      value: damage,
      targetIndices,
      logMessage: `${state.skillSet.basic.name}造成 ${damage} 点伤害`,
    };

    // 处理普攻的特殊效果（如灼烧）
    if (basicSkill.specialEffect?.type === 'burn') {
      const procChance = basicSkill.specialEffect.procChances?.[levelIndex] || 100;
      const roll = Math.random() * 100;

      if (roll < procChance) {
        result.burnStacks = 1;
        result.logMessage += ' 并施加灼烧';
        result.statusEffects = targetIndices.map(targetIdx => {
          const targetId = allUnits[targetIdx]?.id || `unit_${targetIdx}`;
          return createStatusEffect(
            'burn',
            targetId,
            unitId,
            basicSkill.name,
            20,
            5,
            { extra: { damagePerSecond: 20 }, sourceAttack: attackerStats.attack }
          );
        });
      }
    }

    return result;
  }

  // 执行主动技能
  executeSkill(unitId: string, unitIndex: number, attackerStats: any, allUnits: any[]): SkillEffectResult | null {
    const state = this.unitSkills.get(unitId);
    if (!state) return null;

    const { skillSet, star, skillLevels } = state;
    const activeSkill = skillSet.skill;

    // 检查冷却
    if (state.skillCooldown > 0) return null;

    // 获取当前技能等级
    const skillLevel = skillLevels['skill'] || 1;
    const levelIndex = Math.min(skillLevel - 1, activeSkill.levels.length - 1);
    const levelData = activeSkill.levels[levelIndex];

    // 设置冷却
    state.skillCooldown = levelData.cooldown;

    // 增加能量
    state.currentEnergy = Math.min(state.maxEnergy, state.currentEnergy + levelData.energyGain);

    // 选择目标 - 根据技能类型选择不同的目标选择方法
    // 从allUnits获取攻击者的isPlayer属性
    const attackerUnit = allUnits.find(u => u.index === unitIndex);
    const isPlayerUnit = attackerUnit?.isPlayer ?? false;

    let targetIndices: number[];
    if (activeSkill.effectType === SkillEffectType.HEAL || activeSkill.effectType === SkillEffectType.SHIELD) {
      // 治疗和护盾技能选择队友
      targetIndices = this.selectAllyTargets(activeSkill.targetType, unitIndex, allUnits, isPlayerUnit);
    } else {
      // 其他技能选择敌人
      targetIndices = this.selectTargets(activeSkill.targetType, unitIndex, allUnits, isPlayerUnit);
    }

    // 根据技能类型计算效果
    let result: SkillEffectResult = {
      type: 'damage',
      value: 0,
      targetIndices,
      logMessage: '',
    };

    const scaleStat = activeSkill.scaleStat === 'defense' ? attackerStats.defense : attackerStats.attack;

    switch (activeSkill.effectType) {
      case SkillEffectType.DAMAGE:
        result.type = 'damage';
        result.value = Math.floor(scaleStat * (levelData.value / 100));
        result.logMessage = `【${activeSkill.name}】造成 ${result.value} 点伤害`;

        // 特殊效果（如灼烧）
        if (activeSkill.specialEffect?.type === 'burn') {
          const procChance = levelData.procChance || activeSkill.specialEffect.procChances?.[levelIndex] || 100;
          const roll = Math.random() * 100;

          if (roll < procChance) {
            result.burnStacks = 1;
            result.logMessage += ' 并施加灼烧';
            result.statusEffects = targetIndices.map(targetIdx => {
              const targetId = allUnits[targetIdx]?.id || `unit_${targetIdx}`;
              return createStatusEffect(
                'burn',
                targetId,
                unitId,
                activeSkill.name,
                20,
                5,
                { extra: { damagePerSecond: 20 }, sourceAttack: attackerStats.attack }
              );
            });
          }
        }
        break;

      case SkillEffectType.HEAL:
        result.type = 'heal';
        result.value = Math.floor(scaleStat * (levelData.value / 100));
        result.logMessage = `【${activeSkill.name}】恢复 ${result.value} 点生命`;
        break;

      case SkillEffectType.SHIELD:
        result.type = 'shield';
        result.value = Math.floor(scaleStat * (levelData.value / 100));
        // 添加护盾上限信息
        if (activeSkill.specialEffect?.type === 'shield_cap') {
          // 从描述中解析护盾上限百分比
          const desc = activeSkill.specialEffect.description || '';
          const match = desc.match(/(\d+)%/);
          if (match) {
            result.shieldCapPercent = parseInt(match[1]);
          }
        }
        result.logMessage = `【${activeSkill.name}】添加 ${result.value} 点护盾`;
        break;

      case SkillEffectType.BUFF:
        result.type = 'buff';
        result.value = levelData.value;
        if (activeSkill.specialEffect?.type === 'speed_boost') {
          result.speedBoost = levelData.value;
          result.logMessage = `【${activeSkill.name}】攻速提升 ${levelData.value}%`;
          result.statusEffects = targetIndices.map(targetIdx =>
            createStatusEffect(
              'speedBoost',
              allUnits[targetIdx]?.id || `unit_${targetIdx}`,
              unitId,
              activeSkill.name,
              levelData.value,
              Infinity,  // 永久持续
              { maxStacks: activeSkill.maxStacks || 3 }
            )
          );
        } else if (activeSkill.specialEffect?.type === 'attack_boost') {
          result.attackBoost = levelData.value;
          result.logMessage = `【${activeSkill.name}】攻击力提升 ${levelData.value}%`;
          result.statusEffects = targetIndices.map(targetIdx =>
            createStatusEffect(
              'attackBoost',
              allUnits[targetIdx]?.id || `unit_${targetIdx}`,
              unitId,
              activeSkill.name,
              levelData.value,
              10
            )
          );
        }
        break;

      case SkillEffectType.DEBUFF:
        result.type = 'debuff';
        result.value = levelData.value;
        result.defenseReduction = levelData.value;
        result.logMessage = `【${activeSkill.name}】防御降低 ${levelData.value}%`;
        // 创建破甲状态效果
        result.statusEffects = targetIndices.map(targetIdx =>
          createStatusEffect(
            'armorBreak',
            allUnits[targetIdx]?.id || `unit_${targetIdx}`,
            unitId,
            activeSkill.name,
            levelData.value,
            8,
            { extra: { defensePercent: levelData.value } }
          )
        );
        break;

      case SkillEffectType.CONTROL:
        result.type = 'control';
        result.value = levelData.value;
        if (levelData.procChance && Math.random() * 100 < levelData.procChance) {
          result.stunDuration = 3;
          result.logMessage = `【${activeSkill.name}】眩晕目标 3 秒`;
          // 创建眩晕状态效果
          result.statusEffects = targetIndices.map(targetIdx =>
            createStatusEffect(
              'stun',
              allUnits[targetIdx]?.id || `unit_${targetIdx}`,
              unitId,
              activeSkill.name,
              1,
              3
            )
          );
        } else {
          result.logMessage = `【${activeSkill.name}】未触发眩晕`;
        }
        break;

      case SkillEffectType.SUMMON:
        result.type = 'summon';
        result.value = levelData.value;
        const summonCount = skillLevel >= 5 ? 4 : skillLevel >= 4 ? 3 : skillLevel >= 3 ? 2 : 1;
        result.summonData = {
          summonId: 'drone',
          count: summonCount,
          skillLevel,
        };
        result.logMessage = `【${activeSkill.name}】召唤 ${summonCount} 架无人机`;
        break;
    }

    // 添加技能名称
    result.skillName = activeSkill.name;

    return result;
  }

  // 执行终极技能
  executeUltimate(unitId: string, unitIndex: number, attackerStats: any, allUnits: any[]): SkillEffectResult | null {
    const state = this.unitSkills.get(unitId);
    if (!state) return null;

    // 检查能量
    if (state.currentEnergy < 100) return null;

    const { skillSet, star, skillLevels } = state;
    const ultimateSkill = skillSet.ultimate;

    // 获取当前技能等级
    const skillLevel = skillLevels['ultimate'] || 1;
    const levelIndex = Math.min(skillLevel - 1, ultimateSkill.levels.length - 1);
    const levelData = ultimateSkill.levels[levelIndex];

    // 消耗能量
    state.currentEnergy -= levelData.energyCost;

    // 选择目标 - 从allUnits获取攻击者的isPlayer属性
    const ultimateAttacker = allUnits.find(u => u.index === unitIndex);
    const isUltimatePlayer = ultimateAttacker?.isPlayer ?? false;
    const targetIndices = this.selectTargets(ultimateSkill.targetType, unitIndex, allUnits, isUltimatePlayer);

    // 计算效果
    let result: SkillEffectResult = {
      type: 'damage',
      value: 0,
      targetIndices,
      logMessage: '',
    };

    const scaleStat = ultimateSkill.scaleStat === 'defense' ? attackerStats.defense : attackerStats.attack;

    switch (ultimateSkill.effectType) {
      case SkillEffectType.DAMAGE:
        result.type = 'damage';
        result.value = Math.floor(scaleStat * (levelData.value / 100));
        result.logMessage = `【${ultimateSkill.name}】造成 ${result.value} 点伤害`;
        if (ultimateSkill.specialEffect?.type === 'burn') {
          result.burnStacks = 3;
          result.logMessage += ' 并施加3层灼烧';
          result.statusEffects = targetIndices.map(targetIdx => {
            const targetId = allUnits[targetIdx]?.id || `unit_${targetIdx}`;
            return createStatusEffect(
              'burn',
              targetId,
              unitId,
              ultimateSkill.name,
              20,
              8,
              { maxStacks: 5, extra: { damagePerSecond: 20 }, sourceAttack: attackerStats.attack }
            );
          });
        } else if (ultimateSkill.specialEffect?.type === 'chain_attack') {
          result.logMessage += ' 附加连锁效果';
        }
        break;

      case SkillEffectType.HEAL:
        result.type = 'heal';
        result.value = Math.floor(scaleStat * (levelData.value / 100));
        result.logMessage = `【${ultimateSkill.name}】恢复全体 ${result.value} 点生命`;
        break;

      case SkillEffectType.SHIELD:
        result.type = 'shield';
        result.value = Math.floor(scaleStat * (levelData.value / 100));
        result.logMessage = `【${ultimateSkill.name}】为全队添加 ${result.value} 点护盾`;
        break;

      case SkillEffectType.BUFF:
        result.type = 'buff';
        result.value = levelData.value;
        result.logMessage = `【${ultimateSkill.name}】全队伤害提升 ${levelData.value}%`;
        break;

      case SkillEffectType.DEBUFF:
        result.type = 'debuff';
        result.value = levelData.value;
        result.defenseReduction = levelData.value;
        result.logMessage = `【${ultimateSkill.name}】敌方全体防御降低 ${levelData.value}%`;
        result.statusEffects = targetIndices.map(targetIdx =>
          createStatusEffect(
            'armorBreak',
            `unit_${targetIdx}`,
            unitId,
            ultimateSkill.name,
            levelData.value,
            10,
            { extra: { defensePercent: levelData.value } }
          )
        );
        break;

      case SkillEffectType.SUMMON:
        result.type = 'summon';
        result.value = levelData.value;
        result.enhanceSummons = {
          duration: 10,
          additionalSummons: 2,
        };
        result.logMessage = `【${ultimateSkill.name}】召唤2架无人机并增强所有无人机`;
        break;
    }

    // 添加技能名称
    result.skillName = ultimateSkill.name;

    return result;
  }

  // 检查天赋触发
  checkTalentTrigger(
    unitId: string,
    unitIndex: number,
    attackerStats: any,
    allUnits: any[],
    timing: TriggerTiming,
    context?: { damageTaken?: number; isFatal?: boolean }
  ): SkillEffectResult[] {
    const state = this.unitSkills.get(unitId);
    if (!state) return [];

    const { skillSet, star } = state;
    const talent = skillSet.talent;

    // 检查触发时机
    if (talent.triggerTiming !== timing) return [];

    const results: SkillEffectResult[] = [];

    // 获取天赋效果值
    let effectValue = talent.effect.baseValue;
    if (star >= 4 && talent.effect.enhancedValue4) {
      effectValue = talent.effect.enhancedValue4;
    }

    switch (talent.effectType) {
      case SkillEffectType.BUFF:
        if (timing === TriggerTiming.ON_HIT) {
          // 隐匿 - 闪避概率
          if (Math.random() * 100 < effectValue) {
            results.push({
              type: 'buff',
              value: effectValue,
              targetIndices: [unitIndex],
              logMessage: `【${talent.name}】触发闪避！`,
            });
          }
        }
        break;

      case SkillEffectType.DEBUFF:
        if (timing === TriggerTiming.ON_ATTACK) {
          // 病毒传播 - 攻击降低防御
          const procChance = star >= 5 ? 50 : 30;
          if (Math.random() * 100 < procChance) {
            results.push({
              type: 'debuff',
              value: effectValue,
              targetIndices: [unitIndex],
              logMessage: `【${talent.name}】降低目标防御 ${effectValue}%`,
              defenseReduction: effectValue,
            });
          }
        }
        break;
    }

    return results;
  }

  // 获取被动天赋加成（持续生效的天赋）
  getPassiveBonuses(unitId: string): {
    defenseBonus: number;
    attackBonus: number;
    healBonus: number;
    damageBonus: number;
    critBonus: number;
    speedBonus: number;
  } {
    const state = this.unitSkills.get(unitId);
    if (!state) {
      return {
        defenseBonus: 0,
        attackBonus: 0,
        healBonus: 0,
        damageBonus: 0,
        critBonus: 0,
        speedBonus: 0,
      };
    }

    const { skillSet, star } = state;
    const talent = skillSet.talent;

    let defenseBonus = 0;
    let attackBonus = 0;
    let healBonus = 0;
    let damageBonus = 0;
    let critBonus = 0;
    let speedBonus = 0;

    // 获取天赋效果值
    let effectValue = talent.effect.baseValue;
    if (star >= 4 && talent.effect.enhancedValue4) {
      effectValue = talent.effect.enhancedValue4;
    }

    // 根据天赋描述解析效果
    const desc = talent.description.toLowerCase();

    // 防御力提升
    if (desc.includes('防御力提升') || desc.includes('防御提升')) {
      defenseBonus = effectValue;
    }

    // 攻击力提升
    if (desc.includes('攻击力提升') || desc.includes('攻击提升')) {
      attackBonus = effectValue;
    }

    // 治疗效果提升
    if (desc.includes('治疗效果提升')) {
      healBonus = effectValue;
    }

    // 暴击率提升
    if (desc.includes('暴击率提升') || desc.includes('暴击提升')) {
      critBonus = effectValue;
    }

    // 攻速提升
    if (desc.includes('攻速提升') || desc.includes('速度提升')) {
      speedBonus = effectValue;
    }

    // 星级加成
    const starBonus = skillSet.starBonuses.find(b => b.star === star);
    if (starBonus && starBonus.effectType === 'stat_boost') {
      // 根据描述判断加成类型
      if (starBonus.description.includes('防御')) {
        defenseBonus += starBonus.value || 0;
      } else if (starBonus.description.includes('攻击')) {
        attackBonus += starBonus.value || 0;
      } else if (starBonus.description.includes('治疗')) {
        healBonus += starBonus.value || 0;
      }
    }

    return {
      defenseBonus,
      attackBonus,
      healBonus,
      damageBonus,
      critBonus,
      speedBonus,
    };
  }

  // 获取基于灼烧层数的伤害加成（赤焰天赋）
  getBurnDamageBonus(unitId: string, targetEffects: StatusEffect[]): number {
    const state = this.unitSkills.get(unitId);
    if (!state) return 0;

    const { skillSet, star } = state;
    const talent = skillSet.talent;

    // 检查是否是赤焰的天赋（敌方目标每有一层灼烧，对目标的伤害提升）
    if (talent.description.includes('灼烧') && talent.description.includes('伤害提升')) {
      let effectValue = talent.effect.baseValue;
      if (star >= 4 && talent.effect.enhancedValue4) {
        effectValue = talent.effect.enhancedValue4;
      }

      // 计算灼烧层数
      const burnStacks = targetEffects
        .filter(e => e.type === 'burn' && e.remainingTime > 0)
        .reduce((sum, e) => sum + e.currentStacks, 0);

      return burnStacks * effectValue;
    }

    return 0;
  }

  // 获取基于生命值的防御加成（铁壁天赋）
  getHpBasedDefenseBonus(unitId: string, currentHpPercent: number): number {
    const state = this.unitSkills.get(unitId);
    if (!state) return 0;

    const { skillSet, star } = state;
    const talent = skillSet.talent;

    // 检查是否是铁壁的天赋（生命值低于70%时，额外提升防御）
    if (talent.description.includes('生命值低于') && talent.description.includes('防御力额外提升')) {
      let effectValue = talent.effect.baseValue;
      if (star >= 4 && talent.effect.enhancedValue4) {
        effectValue = talent.effect.enhancedValue4;
      }

      // 解析阈值
      const thresholdMatch = talent.description.match(/生命值低于(\d+)%/);
      const threshold = thresholdMatch ? parseInt(thresholdMatch[1]) : 70;

      if (currentHpPercent < threshold) {
        return effectValue;
      }
    }

    return 0;
  }

  // 选择目标
  private selectTargets(
    targetType: TargetType,
    attackerIndex: number,
    allUnits: any[],
    isPlayer: boolean
  ): number[] {
    // 使用数组索引而不是 unit.index 属性
    const enemiesWithIndex = allUnits
      .map((u, idx) => ({ ...u, arrayIndex: idx }))
      .filter(u => u.isPlayer !== isPlayer && u.isAlive);

    const alliesWithIndex = allUnits
      .map((u, idx) => ({ ...u, arrayIndex: idx }))
      .filter(u => u.isPlayer === isPlayer && u.isAlive);

    switch (targetType) {
      case TargetType.SINGLE:
        if (enemiesWithIndex.length > 0) {
          return [enemiesWithIndex[0].arrayIndex];
        }
        return [];

      case TargetType.ALL:
        return enemiesWithIndex.map(u => u.arrayIndex);

      case TargetType.LOWEST_HP:
        // 治疗技能选择队友中生命最低的，攻击技能选择敌人中生命最低的
        // 通过判断技能效果类型来决定
        // 这里默认返回敌人中生命最低的，治疗技能会在外部处理
        if (enemiesWithIndex.length > 0) {
          const lowest = enemiesWithIndex.reduce((min, u) => u.hp < min.hp ? u : min, enemiesWithIndex[0]);
          return [lowest.arrayIndex];
        }
        return [];

      case TargetType.HIGHEST_ATTACK:
        if (enemiesWithIndex.length > 0) {
          const highest = enemiesWithIndex.reduce((max, u) => u.attack > max.attack ? u : max, enemiesWithIndex[0]);
          return [highest.arrayIndex];
        }
        return [];

      case TargetType.HIGHEST_DEFENSE:
        if (enemiesWithIndex.length > 0) {
          const highest = enemiesWithIndex.reduce((max, u) => u.defense > max.defense ? u : max, enemiesWithIndex[0]);
          return [highest.arrayIndex];
        }
        return [];

      case TargetType.ALLIES:
        return alliesWithIndex.map(u => u.arrayIndex);

      case TargetType.SELF:
        return [attackerIndex];

      default:
        return [];
    }
  }

  // 选择治疗/增益目标（选择队友）
  private selectAllyTargets(
    targetType: TargetType,
    attackerIndex: number,
    allUnits: any[],
    isPlayer: boolean
  ): number[] {
    // 使用数组索引而不是 unit.index 属性
    const alliesWithIndex = allUnits
      .map((u, idx) => ({ ...u, arrayIndex: idx }))
      .filter(u => u.isPlayer === isPlayer && u.isAlive);

    switch (targetType) {
      case TargetType.LOWEST_HP:
        // 选择生命值最低的队友
        if (alliesWithIndex.length > 0) {
          const lowest = alliesWithIndex.reduce((min, u) => {
            const hpPercent = u.hp / u.maxHp;
            const minHpPercent = min.hp / min.maxHp;
            return hpPercent < minHpPercent ? u : min;
          }, alliesWithIndex[0]);
          return [lowest.arrayIndex];
        }
        return [];

      case TargetType.ALLIES:
        return alliesWithIndex.map(u => u.arrayIndex);

      case TargetType.SELF:
        return [attackerIndex];

      default:
        return alliesWithIndex.map(u => u.arrayIndex);
    }
  }

  // 更新冷却
  updateCooldowns(deltaTime: number): void {
    this.unitSkills.forEach(state => {
      if (state.basicCooldown > 0) {
        state.basicCooldown = Math.max(0, state.basicCooldown - deltaTime);
      }
      if (state.skillCooldown > 0) {
        state.skillCooldown = Math.max(0, state.skillCooldown - deltaTime);
      }
      if (state.ultimateCooldown > 0) {
        state.ultimateCooldown = Math.max(0, state.ultimateCooldown - deltaTime);
      }
    });
  }

  // 检查是否可以释放终极技能
  canUseUltimate(unitId: string): boolean {
    const state = this.unitSkills.get(unitId);
    if (!state) return false;
    return state.currentEnergy >= 100;
  }

  // 获取能量百分比
  getEnergyPercent(unitId: string): number {
    const state = this.unitSkills.get(unitId);
    if (!state) return 0;
    return (state.currentEnergy / state.maxEnergy) * 100;
  }

  // 获取技能冷却百分比
  getSkillCooldownPercent(unitId: string): number {
    const state = this.unitSkills.get(unitId);
    if (!state) return 0;
    const skillSet = state.skillSet;
    const maxCooldown = skillSet.skill.levels[0].cooldown;
    return (state.skillCooldown / maxCooldown) * 100;
  }

  // 清除所有状态（战斗结束）
  clearAll(): void {
    this.unitSkills.clear();
  }
}

// 创建全局实例
export const battleSkillManager = new BattleSkillManager();
