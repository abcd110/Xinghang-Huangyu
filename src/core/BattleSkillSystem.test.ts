import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  BattleSkillManager,
  BattleUnitSkillState,
  SkillEffectResult,
} from './BattleSkillSystem';
import { SkillType, SkillEffectType, TargetType, TriggerTiming } from '../screens/crewScreen/types/skillTypes';
import { StatusEffect, createStatusEffect } from './StatusEffectManager';

vi.mock('../data/crewSkills', () => ({
  getCrewSkills: vi.fn((crewId: string) => {
    if (crewId === 'crew_b_001') {
      return {
        basic: {
          id: 'b001_basic',
          name: '铁拳重击',
          description: '用机械义肢猛击',
          icon: '🦾',
          effectType: SkillEffectType.DAMAGE,
          targetType: TargetType.SINGLE,
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
          description: '为生命值最低的队友添加护盾',
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
          specialEffect: { type: 'shield_cap', description: '护盾上限' },
        },
        ultimate: {
          id: 'b001_ultimate',
          name: '绝对守护',
          description: '为全队添加护盾',
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
        },
        talent: {
          id: 'b001_talent',
          name: '不动如山',
          description: '自身防御力提升10%，生命值低于70%时，自身防御力额外提升10%',
          icon: '🏔️',
          effectType: SkillEffectType.BUFF,
          triggerTiming: TriggerTiming.CONTINUOUS,
          effect: {
            description: '自身防御力提升10%',
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
          { star: 4, description: '天赋强化', effectType: 'talent_enhance' },
          { star: 5, description: '战斗开始护盾', effectType: 'special' },
        ],
      };
    }
    if (crewId === 'crew_b_002') {
      return {
        basic: {
          id: 'b002_basic',
          name: '等离子射击',
          description: '对敌方单体目标造成伤害',
          icon: '🔫',
          effectType: SkillEffectType.DAMAGE,
          targetType: TargetType.SINGLE,
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
            description: '施加灼烧',
            procChances: [60, 60, 60, 60, 60],
          },
        },
        skill: {
          id: 'b002_skill',
          name: '爆裂弹',
          description: '对敌方单体目标造成伤害并施加灼烧',
          icon: '💥',
          effectType: SkillEffectType.DAMAGE,
          targetType: TargetType.SINGLE,
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
            description: '施加灼烧',
            procChances: [100, 100, 100, 100, 100],
          },
        },
        ultimate: {
          id: 'b002_ultimate',
          name: '等离子风暴',
          description: '对敌方单体目标造成大量伤害',
          icon: '🌪️',
          effectType: SkillEffectType.DAMAGE,
          targetType: TargetType.SINGLE,
          scaleStat: 'attack',
          levels: [
            { level: 1, value: 200, energyCost: 100 },
            { level: 2, value: 220, energyCost: 100 },
            { level: 3, value: 240, energyCost: 100 },
            { level: 4, value: 260, energyCost: 100 },
            { level: 5, value: 280, energyCost: 100 },
          ],
          specialEffect: { type: 'burn', description: '施加3层灼烧' },
        },
        talent: {
          id: 'b002_talent',
          name: '怒火中烧',
          description: '敌方目标每有一层灼烧，对目标的伤害提升4%',
          icon: '🔥',
          effectType: SkillEffectType.BUFF,
          triggerTiming: TriggerTiming.ON_ATTACK,
          effect: {
            description: '灼烧伤害提升',
            baseValue: 4,
            unit: '%',
            enhancedValue4: 6,
          },
          star5Bonus: '战斗开始时施加灼烧',
        },
        starBonuses: [],
      };
    }
    if (crewId === 'crew_b_003') {
      return {
        basic: {
          id: 'b003_basic',
          name: '治疗光束',
          description: '治疗生命最低的队友',
          icon: '💚',
          effectType: SkillEffectType.HEAL,
          targetType: TargetType.LOWEST_HP,
          scaleStat: 'attack',
          levels: [
            { level: 1, value: 50, energyGain: 5, cooldown: 1 },
          ],
        },
        skill: {
          id: 'b003_skill',
          name: '攻速提升',
          description: '提升队友攻速',
          icon: '⚡',
          effectType: SkillEffectType.BUFF,
          targetType: TargetType.ALLIES,
          scaleStat: 'attack',
          levels: [
            { level: 1, value: 20, energyGain: 20, cooldown: 10 },
          ],
          specialEffect: { type: 'speed_boost', description: '攻速提升' },
          maxStacks: 3,
        },
        ultimate: {
          id: 'b003_ultimate',
          name: '群体治疗',
          description: '治疗全体队友',
          icon: '💖',
          effectType: SkillEffectType.HEAL,
          targetType: TargetType.ALLIES,
          scaleStat: 'attack',
          levels: [
            { level: 1, value: 100, energyCost: 100 },
          ],
        },
        talent: {
          id: 'b003_talent',
          name: '闪避',
          description: '受击时有概率闪避',
          icon: '💨',
          effectType: SkillEffectType.BUFF,
          triggerTiming: TriggerTiming.ON_HIT,
          effect: {
            description: '闪避概率',
            baseValue: 15,
            unit: '%',
          },
        },
        starBonuses: [],
      };
    }
    if (crewId === 'crew_b_004') {
      return {
        basic: {
          id: 'b004_basic',
          name: '破甲打击',
          description: '对敌方单体目标造成伤害',
          icon: '⚔️',
          effectType: SkillEffectType.DAMAGE,
          targetType: TargetType.SINGLE,
          scaleStat: 'attack',
          levels: [{ level: 1, value: 60, energyGain: 5, cooldown: 1 }],
        },
        skill: {
          id: 'b004_skill',
          name: '破甲',
          description: '降低敌方防御',
          icon: '💔',
          effectType: SkillEffectType.DEBUFF,
          targetType: TargetType.SINGLE,
          scaleStat: 'attack',
          levels: [{ level: 1, value: 20, energyGain: 20, cooldown: 8 }],
        },
        ultimate: {
          id: 'b004_ultimate',
          name: '群体破甲',
          description: '降低敌方全体防御',
          icon: '💥',
          effectType: SkillEffectType.DEBUFF,
          targetType: TargetType.ALL,
          scaleStat: 'attack',
          levels: [{ level: 1, value: 30, energyCost: 100 }],
        },
        talent: {
          id: 'b004_talent',
          name: '病毒传播',
          description: '攻击时降低目标防御',
          icon: '🦠',
          effectType: SkillEffectType.DEBUFF,
          triggerTiming: TriggerTiming.ON_ATTACK,
          effect: {
            description: '攻击降低防御',
            baseValue: 10,
            unit: '%',
          },
        },
        starBonuses: [],
      };
    }
    if (crewId === 'crew_b_005') {
      return {
        basic: {
          id: 'b005_basic',
          name: '普通攻击',
          description: '普通攻击',
          icon: '⚔️',
          effectType: SkillEffectType.DAMAGE,
          targetType: TargetType.SINGLE,
          scaleStat: 'attack',
          levels: [{ level: 1, value: 60, energyGain: 5, cooldown: 1 }],
        },
        skill: {
          id: 'b005_skill',
          name: '眩晕打击',
          description: '有概率眩晕目标',
          icon: '💫',
          effectType: SkillEffectType.CONTROL,
          targetType: TargetType.SINGLE,
          scaleStat: 'attack',
          levels: [{ level: 1, value: 100, energyGain: 20, cooldown: 10, procChance: 50 }],
        },
        ultimate: {
          id: 'b005_ultimate',
          name: '召唤无人机',
          description: '召唤无人机',
          icon: '🤖',
          effectType: SkillEffectType.SUMMON,
          targetType: TargetType.SELF,
          scaleStat: 'attack',
          levels: [
            { level: 1, value: 10, energyCost: 100 },
            { level: 2, value: 10, energyCost: 100 },
            { level: 3, value: 10, energyCost: 100 },
            { level: 4, value: 10, energyCost: 100 },
            { level: 5, value: 10, energyCost: 100 },
          ],
        },
        talent: {
          id: 'b005_talent',
          name: '天赋',
          description: '天赋描述',
          icon: '⭐',
          effectType: SkillEffectType.BUFF,
          effect: { description: '天赋', baseValue: 10, unit: '%' },
        },
        starBonuses: [],
      };
    }
    return undefined;
  }),
}));

describe('BattleSkillManager', () => {
  let manager: BattleSkillManager;

  beforeEach(() => {
    manager = new BattleSkillManager();
    vi.clearAllMocks();
  });

  afterEach(() => {
    manager.clearAll();
  });

  describe('initUnitSkills', () => {
    it('应成功初始化有效船员的技能', () => {
      const result = manager.initUnitSkills('unit_001', 'crew_b_001', 1);
      expect(result).toBe(true);
    });

    it('无效船员ID应返回false', () => {
      const result = manager.initUnitSkills('unit_002', 'invalid_crew', 1);
      expect(result).toBe(false);
    });

    it('应正确设置初始状态', () => {
      manager.initUnitSkills('unit_001', 'crew_b_001', 3, { basic: 2, skill: 1, ultimate: 1, talent: 1 });
      const state = manager.getUnitSkillState('unit_001');

      expect(state).toBeDefined();
      expect(state!.crewId).toBe('crew_b_001');
      expect(state!.star).toBe(3);
      expect(state!.currentEnergy).toBe(0);
      expect(state!.maxEnergy).toBe(100);
      expect(state!.basicCooldown).toBe(0);
      expect(state!.skillCooldown).toBe(0);
      expect(state!.ultimateCooldown).toBe(0);
      expect(state!.skillLevels).toEqual({ basic: 2, skill: 1, ultimate: 1, talent: 1 });
    });

    it('未指定技能等级时应使用默认等级1', () => {
      manager.initUnitSkills('unit_001', 'crew_b_001', 1);
      const state = manager.getUnitSkillState('unit_001');

      expect(state!.skillLevels).toEqual({ basic: 1, skill: 1, ultimate: 1, talent: 1 });
    });
  });

  describe('getUnitSkillState', () => {
    it('应返回已初始化单位的状态', () => {
      manager.initUnitSkills('unit_001', 'crew_b_001', 1);
      const state = manager.getUnitSkillState('unit_001');
      expect(state).toBeDefined();
    });

    it('未初始化单位应返回undefined', () => {
      const state = manager.getUnitSkillState('unknown_unit');
      expect(state).toBeUndefined();
    });
  });

  describe('executeBasicAttack', () => {
    it('应正确计算基于防御力的伤害', () => {
      manager.initUnitSkills('unit_001', 'crew_b_001', 1);
      const attackerStats = { attack: 100, defense: 200 };
      const allUnits = [
        { index: 0, id: 'unit_001', isPlayer: true, isAlive: true },
        { index: 1, id: 'enemy_001', isPlayer: false, isAlive: true, hp: 1000, maxHp: 1000 },
      ];

      const result = manager.executeBasicAttack('unit_001', 0, attackerStats, allUnits);

      expect(result.type).toBe('damage');
      expect(result.value).toBe(Math.floor(200 * 0.6));
      expect(result.targetIndices).toHaveLength(1);
    });

    it('应正确计算基于攻击力的伤害', () => {
      manager.initUnitSkills('unit_002', 'crew_b_002', 1);
      const attackerStats = { attack: 150, defense: 50 };
      const allUnits = [
        { index: 0, id: 'unit_002', isPlayer: true, isAlive: true },
        { index: 1, id: 'enemy_001', isPlayer: false, isAlive: true, hp: 1000, maxHp: 1000 },
      ];

      const result = manager.executeBasicAttack('unit_002', 0, attackerStats, allUnits);

      expect(result.type).toBe('damage');
      expect(result.value).toBe(Math.floor(150 * 0.6));
    });

    it('应增加能量', () => {
      manager.initUnitSkills('unit_001', 'crew_b_001', 1);
      const attackerStats = { attack: 100, defense: 100 };
      const allUnits = [
        { index: 0, id: 'unit_001', isPlayer: true, isAlive: true },
        { index: 1, id: 'enemy_001', isPlayer: false, isAlive: true },
      ];

      manager.executeBasicAttack('unit_001', 0, attackerStats, allUnits);
      const state = manager.getUnitSkillState('unit_001');

      expect(state!.currentEnergy).toBe(5);
    });

    it('能量不应超过上限', () => {
      manager.initUnitSkills('unit_001', 'crew_b_001', 1);
      const state = manager.getUnitSkillState('unit_001');
      state!.currentEnergy = 98;

      const attackerStats = { attack: 100, defense: 100 };
      const allUnits = [
        { index: 0, id: 'unit_001', isPlayer: true, isAlive: true },
        { index: 1, id: 'enemy_001', isPlayer: false, isAlive: true },
      ];

      manager.executeBasicAttack('unit_001', 0, attackerStats, allUnits);

      expect(state!.currentEnergy).toBe(100);
    });

    it('未初始化单位应返回空结果', () => {
      const result = manager.executeBasicAttack('unknown', 0, { attack: 100, defense: 50 }, []);
      expect(result.value).toBe(0);
      expect(result.targetIndices).toEqual([]);
    });

    it('灼烧特效应在概率触发时添加状态效果', () => {
      manager.initUnitSkills('unit_002', 'crew_b_002', 1);
      const attackerStats = { attack: 100, defense: 50 };
      const allUnits = [
        { index: 0, id: 'unit_002', isPlayer: true, isAlive: true },
        { index: 1, id: 'enemy_001', isPlayer: false, isAlive: true, hp: 1000, maxHp: 1000 },
      ];

      vi.spyOn(Math, 'random').mockReturnValue(0);

      const result = manager.executeBasicAttack('unit_002', 0, attackerStats, allUnits);

      expect(result.burnStacks).toBe(1);
      expect(result.statusEffects).toBeDefined();
      expect(result.statusEffects).toHaveLength(1);
    });
  });

  describe('executeSkill', () => {
    it('冷却中应返回null', () => {
      manager.initUnitSkills('unit_001', 'crew_b_001', 1);
      const state = manager.getUnitSkillState('unit_001');
      state!.skillCooldown = 5;

      const result = manager.executeSkill('unit_001', 0, { attack: 100, defense: 100 }, []);

      expect(result).toBeNull();
    });

    it('应正确设置冷却时间', () => {
      manager.initUnitSkills('unit_001', 'crew_b_001', 1);
      const allUnits = [
        { index: 0, id: 'unit_001', isPlayer: true, isAlive: true, hp: 100, maxHp: 100 },
        { index: 1, id: 'ally_001', isPlayer: true, isAlive: true, hp: 50, maxHp: 100 },
      ];

      manager.executeSkill('unit_001', 0, { attack: 100, defense: 200 }, allUnits);
      const state = manager.getUnitSkillState('unit_001');

      expect(state!.skillCooldown).toBe(10);
    });

    it('应增加能量', () => {
      manager.initUnitSkills('unit_001', 'crew_b_001', 1);
      const allUnits = [
        { index: 0, id: 'unit_001', isPlayer: true, isAlive: true, hp: 100, maxHp: 100 },
        { index: 1, id: 'ally_001', isPlayer: true, isAlive: true, hp: 50, maxHp: 100 },
      ];

      manager.executeSkill('unit_001', 0, { attack: 100, defense: 200 }, allUnits);
      const state = manager.getUnitSkillState('unit_001');

      expect(state!.currentEnergy).toBe(20);
    });

    it('护盾技能应正确计算护盾值', () => {
      manager.initUnitSkills('unit_001', 'crew_b_001', 1);
      const allUnits = [
        { index: 0, id: 'unit_001', isPlayer: true, isAlive: true, hp: 100, maxHp: 100 },
        { index: 1, id: 'ally_001', isPlayer: true, isAlive: true, hp: 50, maxHp: 100 },
      ];

      const result = manager.executeSkill('unit_001', 0, { attack: 100, defense: 200 }, allUnits);

      expect(result!.type).toBe('shield');
      expect(result!.value).toBe(Math.floor(200 * 0.4));
      expect(result!.targetIndices).toContain(1);
    });

    it('伤害技能应正确计算伤害', () => {
      manager.initUnitSkills('unit_002', 'crew_b_002', 1);
      const allUnits = [
        { index: 0, id: 'unit_002', isPlayer: true, isAlive: true },
        { index: 1, id: 'enemy_001', isPlayer: false, isAlive: true },
      ];

      const result = manager.executeSkill('unit_002', 0, { attack: 100, defense: 50 }, allUnits);

      expect(result!.type).toBe('damage');
      expect(result!.value).toBe(Math.floor(100 * 1.0));
    });

    it('增益技能(攻速提升)应正确设置效果', () => {
      manager.initUnitSkills('unit_003', 'crew_b_003', 1);
      const allUnits = [
        { index: 0, id: 'unit_003', isPlayer: true, isAlive: true, hp: 100, maxHp: 100 },
      ];

      const result = manager.executeSkill('unit_003', 0, { attack: 100, defense: 50 }, allUnits);

      expect(result!.type).toBe('buff');
      expect(result!.speedBoost).toBe(20);
      expect(result!.statusEffects).toBeDefined();
    });

    it('减益技能(破甲)应正确设置效果', () => {
      manager.initUnitSkills('unit_004', 'crew_b_004', 1);
      const allUnits = [
        { index: 0, id: 'unit_004', isPlayer: true, isAlive: true },
        { index: 1, id: 'enemy_001', isPlayer: false, isAlive: true },
      ];

      const result = manager.executeSkill('unit_004', 0, { attack: 100, defense: 50 }, allUnits);

      expect(result!.type).toBe('debuff');
      expect(result!.defenseReduction).toBe(20);
      expect(result!.statusEffects).toBeDefined();
    });

    it('控制技能(眩晕)触发时应设置眩晕时长', () => {
      manager.initUnitSkills('unit_005', 'crew_b_005', 1);
      const allUnits = [
        { index: 0, id: 'unit_005', isPlayer: true, isAlive: true },
        { index: 1, id: 'enemy_001', isPlayer: false, isAlive: true },
      ];

      vi.spyOn(Math, 'random').mockReturnValue(0);

      const result = manager.executeSkill('unit_005', 0, { attack: 100, defense: 50 }, allUnits);

      expect(result!.type).toBe('control');
      expect(result!.stunDuration).toBe(3);
    });

    it('控制技能未触发时不应设置眩晕时长', () => {
      manager.initUnitSkills('unit_005', 'crew_b_005', 1);
      const allUnits = [
        { index: 0, id: 'unit_005', isPlayer: true, isAlive: true },
        { index: 1, id: 'enemy_001', isPlayer: false, isAlive: true },
      ];

      vi.spyOn(Math, 'random').mockReturnValue(1);

      const result = manager.executeSkill('unit_005', 0, { attack: 100, defense: 50 }, allUnits);

      expect(result!.type).toBe('control');
      expect(result!.stunDuration).toBeUndefined();
    });

    it('召唤技能应返回召唤数据', () => {
      manager.initUnitSkills('unit_005', 'crew_b_005', 1);
      const state = manager.getUnitSkillState('unit_005');
      state!.currentEnergy = 100;
      const allUnits = [
        { index: 0, id: 'unit_005', isPlayer: true, isAlive: true },
      ];

      const result = manager.executeUltimate('unit_005', 0, { attack: 100, defense: 50 }, allUnits);

      expect(result!.type).toBe('summon');
      expect(result!.enhanceSummons).toBeDefined();
      expect(result!.enhanceSummons!.duration).toBe(10);
      expect(result!.enhanceSummons!.additionalSummons).toBe(2);
    });

    it('召唤技能应正确执行', () => {
      manager.initUnitSkills('unit_005', 'crew_b_005', 1, { basic: 1, skill: 1, ultimate: 5, talent: 1 });
      const state = manager.getUnitSkillState('unit_005');
      state!.currentEnergy = 100;
      const allUnits = [
        { index: 0, id: 'unit_005', isPlayer: true, isAlive: true },
      ];

      const result = manager.executeUltimate('unit_005', 0, { attack: 100, defense: 50 }, allUnits);

      expect(result!.type).toBe('summon');
      expect(result!.enhanceSummons).toBeDefined();
    });
  });

  describe('executeUltimate', () => {
    it('能量不足应返回null', () => {
      manager.initUnitSkills('unit_001', 'crew_b_001', 1);
      const allUnits = [
        { index: 0, id: 'unit_001', isPlayer: true, isAlive: true },
      ];

      const result = manager.executeUltimate('unit_001', 0, { attack: 100, defense: 200 }, allUnits);

      expect(result).toBeNull();
    });

    it('能量充足应成功执行', () => {
      manager.initUnitSkills('unit_001', 'crew_b_001', 1);
      const state = manager.getUnitSkillState('unit_001');
      state!.currentEnergy = 100;

      const allUnits = [
        { index: 0, id: 'unit_001', isPlayer: true, isAlive: true, hp: 100, maxHp: 100 },
        { index: 1, id: 'ally_001', isPlayer: true, isAlive: true, hp: 100, maxHp: 100 },
      ];

      const result = manager.executeUltimate('unit_001', 0, { attack: 100, defense: 200 }, allUnits);

      expect(result).not.toBeNull();
      expect(state!.currentEnergy).toBe(0);
    });

    it('护盾终极技能应为全队添加护盾', () => {
      manager.initUnitSkills('unit_001', 'crew_b_001', 1);
      const state = manager.getUnitSkillState('unit_001');
      state!.currentEnergy = 100;

      const allUnits = [
        { index: 0, id: 'unit_001', isPlayer: true, isAlive: true, hp: 100, maxHp: 100 },
        { index: 1, id: 'ally_001', isPlayer: true, isAlive: true, hp: 100, maxHp: 100 },
        { index: 2, id: 'ally_002', isPlayer: true, isAlive: true, hp: 100, maxHp: 100 },
      ];

      const result = manager.executeUltimate('unit_001', 0, { attack: 100, defense: 200 }, allUnits);

      expect(result!.type).toBe('shield');
      expect(result!.value).toBe(Math.floor(200 * 0.4));
      expect(result!.targetIndices).toHaveLength(3);
    });

    it('伤害终极技能应正确计算伤害', () => {
      manager.initUnitSkills('unit_002', 'crew_b_002', 1);
      const state = manager.getUnitSkillState('unit_002');
      state!.currentEnergy = 100;

      const allUnits = [
        { index: 0, id: 'unit_002', isPlayer: true, isAlive: true },
        { index: 1, id: 'enemy_001', isPlayer: false, isAlive: true },
      ];

      const result = manager.executeUltimate('unit_002', 0, { attack: 100, defense: 50 }, allUnits);

      expect(result!.type).toBe('damage');
      expect(result!.value).toBe(Math.floor(100 * 2.0));
    });

    it('治疗终极技能应治疗全体队友', () => {
      manager.initUnitSkills('unit_003', 'crew_b_003', 1);
      const state = manager.getUnitSkillState('unit_003');
      state!.currentEnergy = 100;

      const allUnits = [
        { index: 0, id: 'unit_003', isPlayer: true, isAlive: true, hp: 100, maxHp: 100 },
        { index: 1, id: 'ally_001', isPlayer: true, isAlive: true, hp: 100, maxHp: 100 },
      ];

      const result = manager.executeUltimate('unit_003', 0, { attack: 100, defense: 50 }, allUnits);

      expect(result!.type).toBe('heal');
      expect(result!.value).toBe(Math.floor(100 * 1.0));
      expect(result!.targetIndices).toHaveLength(2);
    });

    it('减益终极技能应降低敌方全体防御', () => {
      manager.initUnitSkills('unit_004', 'crew_b_004', 1);
      const state = manager.getUnitSkillState('unit_004');
      state!.currentEnergy = 100;

      const allUnits = [
        { index: 0, id: 'unit_004', isPlayer: true, isAlive: true },
        { index: 1, id: 'enemy_001', isPlayer: false, isAlive: true },
        { index: 2, id: 'enemy_002', isPlayer: false, isAlive: true },
      ];

      const result = manager.executeUltimate('unit_004', 0, { attack: 100, defense: 50 }, allUnits);

      expect(result!.type).toBe('debuff');
      expect(result!.defenseReduction).toBe(30);
      expect(result!.targetIndices).toHaveLength(2);
    });
  });

  describe('checkTalentTrigger', () => {
    it('触发时机不匹配应返回空数组', () => {
      manager.initUnitSkills('unit_003', 'crew_b_003', 1);
      const allUnits = [
        { index: 0, id: 'unit_003', isPlayer: true, isAlive: true },
      ];

      const results = manager.checkTalentTrigger('unit_003', 0, { attack: 100, defense: 50 }, allUnits, TriggerTiming.ON_ATTACK);

      expect(results).toEqual([]);
    });

    it('闪避天赋触发时应返回闪避结果', () => {
      manager.initUnitSkills('unit_003', 'crew_b_003', 1);
      const allUnits = [
        { index: 0, id: 'unit_003', isPlayer: true, isAlive: true },
      ];

      vi.spyOn(Math, 'random').mockReturnValue(0);

      const results = manager.checkTalentTrigger('unit_003', 0, { attack: 100, defense: 50 }, allUnits, TriggerTiming.ON_HIT);

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].type).toBe('buff');
    });

    it('病毒传播天赋触发时应返回减益结果', () => {
      manager.initUnitSkills('unit_004', 'crew_b_004', 1);
      const allUnits = [
        { index: 0, id: 'unit_004', isPlayer: true, isAlive: true },
      ];

      vi.spyOn(Math, 'random').mockReturnValue(0);

      const results = manager.checkTalentTrigger('unit_004', 0, { attack: 100, defense: 50 }, allUnits, TriggerTiming.ON_ATTACK);

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].type).toBe('debuff');
    });
  });

  describe('getPassiveBonuses', () => {
    it('未初始化单位应返回全0加成', () => {
      const bonuses = manager.getPassiveBonuses('unknown');
      expect(bonuses).toEqual({
        defenseBonus: 0,
        attackBonus: 0,
        healBonus: 0,
        damageBonus: 0,
        critBonus: 0,
        speedBonus: 0,
      });
    });

    it('应正确解析防御力提升天赋', () => {
      manager.initUnitSkills('unit_001', 'crew_b_001', 1);
      const bonuses = manager.getPassiveBonuses('unit_001');

      expect(bonuses.defenseBonus).toBe(20);
    });

    it('4星应使用强化数值', () => {
      manager.initUnitSkills('unit_001', 'crew_b_001', 4);
      const bonuses = manager.getPassiveBonuses('unit_001');

      expect(bonuses.defenseBonus).toBe(20);
    });
  });

  describe('getBurnDamageBonus', () => {
    it('无灼烧效果时应返回0', () => {
      manager.initUnitSkills('unit_002', 'crew_b_002', 1);
      const targetEffects: StatusEffect[] = [];

      const bonus = manager.getBurnDamageBonus('unit_002', targetEffects);

      expect(bonus).toBe(0);
    });

    it('有灼烧效果时应返回正确加成', () => {
      manager.initUnitSkills('unit_002', 'crew_b_002', 1);
      const targetEffects: StatusEffect[] = [
        createStatusEffect('burn', 'target_001', 'unit_002', '测试', 20, 5),
      ];

      const bonus = manager.getBurnDamageBonus('unit_002', targetEffects);

      expect(bonus).toBe(4);
    });

    it('多层灼烧应叠加加成', () => {
      manager.initUnitSkills('unit_002', 'crew_b_002', 1);
      const targetEffects: StatusEffect[] = [
        createStatusEffect('burn', 'target_001', 'unit_002', '测试', 20, 5),
        createStatusEffect('burn', 'target_001', 'unit_002', '测试', 20, 5),
        createStatusEffect('burn', 'target_001', 'unit_002', '测试', 20, 5),
      ];

      const bonus = manager.getBurnDamageBonus('unit_002', targetEffects);

      expect(bonus).toBe(12);
    });

    it('4星应使用强化数值', () => {
      manager.initUnitSkills('unit_002', 'crew_b_002', 4);
      const targetEffects: StatusEffect[] = [
        createStatusEffect('burn', 'target_001', 'unit_002', '测试', 20, 5),
      ];

      const bonus = manager.getBurnDamageBonus('unit_002', targetEffects);

      expect(bonus).toBe(6);
    });
  });

  describe('getHpBasedDefenseBonus', () => {
    it('生命值高于阈值应返回0', () => {
      manager.initUnitSkills('unit_001', 'crew_b_001', 1);

      const bonus = manager.getHpBasedDefenseBonus('unit_001', 80);

      expect(bonus).toBe(0);
    });

    it('生命值低于阈值应返回加成', () => {
      manager.initUnitSkills('unit_001', 'crew_b_001', 1);

      const bonus = manager.getHpBasedDefenseBonus('unit_001', 50);

      expect(bonus).toBe(10);
    });

    it('4星应使用强化数值', () => {
      manager.initUnitSkills('unit_001', 'crew_b_001', 4);

      const bonus = manager.getHpBasedDefenseBonus('unit_001', 50);

      expect(bonus).toBe(20);
    });
  });

  describe('目标选择', () => {
    const createAllUnits = () => [
      { index: 0, id: 'player_0', isPlayer: true, isAlive: true, hp: 100, maxHp: 100, attack: 100, defense: 50 },
      { index: 1, id: 'player_1', isPlayer: true, isAlive: true, hp: 50, maxHp: 100, attack: 150, defense: 80 },
      { index: 2, id: 'player_2', isPlayer: true, isAlive: true, hp: 80, maxHp: 100, attack: 80, defense: 120 },
      { index: 3, id: 'enemy_0', isPlayer: false, isAlive: true, hp: 100, maxHp: 100, attack: 100, defense: 50 },
      { index: 4, id: 'enemy_1', isPlayer: false, isAlive: true, hp: 30, maxHp: 100, attack: 200, defense: 100 },
      { index: 5, id: 'enemy_2', isPlayer: false, isAlive: true, hp: 80, maxHp: 100, attack: 120, defense: 150 },
    ];

    it('SINGLE应选择第一个敌人', () => {
      manager.initUnitSkills('unit_001', 'crew_b_001', 1);
      const allUnits = createAllUnits();

      const result = manager.executeBasicAttack('unit_001', 0, { attack: 100, defense: 200 }, allUnits);

      expect(result.targetIndices).toEqual([3]);
    });

    it('ALL应选择所有敌人', () => {
      manager.initUnitSkills('unit_004', 'crew_b_004', 1);
      const state = manager.getUnitSkillState('unit_004');
      state!.currentEnergy = 100;
      const allUnits = createAllUnits();

      const result = manager.executeUltimate('unit_004', 0, { attack: 100, defense: 50 }, allUnits);

      expect(result!.targetIndices).toEqual([3, 4, 5]);
    });

    it('LOWEST_HP应选择生命最低的目标', () => {
      manager.initUnitSkills('unit_001', 'crew_b_001', 1);
      const allUnits = createAllUnits();

      const result = manager.executeSkill('unit_001', 0, { attack: 100, defense: 200 }, allUnits);

      expect(result!.targetIndices).toEqual([1]);
    });

    it('ALLIES应选择所有队友', () => {
      manager.initUnitSkills('unit_001', 'crew_b_001', 1);
      const state = manager.getUnitSkillState('unit_001');
      state!.currentEnergy = 100;
      const allUnits = createAllUnits();

      const result = manager.executeUltimate('unit_001', 0, { attack: 100, defense: 200 }, allUnits);

      expect(result!.targetIndices).toEqual([0, 1, 2]);
    });

    it('无存活敌人应返回空数组', () => {
      manager.initUnitSkills('unit_001', 'crew_b_001', 1);
      const allUnits = [
        { index: 0, id: 'player_0', isPlayer: true, isAlive: true },
        { index: 1, id: 'enemy_0', isPlayer: false, isAlive: false },
      ];

      const result = manager.executeBasicAttack('unit_001', 0, { attack: 100, defense: 200 }, allUnits);

      expect(result.targetIndices).toEqual([]);
    });
  });

  describe('updateCooldowns', () => {
    it('应正确减少冷却时间', () => {
      manager.initUnitSkills('unit_001', 'crew_b_001', 1);
      const state = manager.getUnitSkillState('unit_001');
      state!.skillCooldown = 5;
      state!.basicCooldown = 2;

      manager.updateCooldowns(1);

      expect(state!.skillCooldown).toBe(4);
      expect(state!.basicCooldown).toBe(1);
    });

    it('冷却时间不应小于0', () => {
      manager.initUnitSkills('unit_001', 'crew_b_001', 1);
      const state = manager.getUnitSkillState('unit_001');
      state!.skillCooldown = 0.5;

      manager.updateCooldowns(1);

      expect(state!.skillCooldown).toBe(0);
    });
  });

  describe('canUseUltimate', () => {
    it('能量满时应返回true', () => {
      manager.initUnitSkills('unit_001', 'crew_b_001', 1);
      const state = manager.getUnitSkillState('unit_001');
      state!.currentEnergy = 100;

      expect(manager.canUseUltimate('unit_001')).toBe(true);
    });

    it('能量不足时应返回false', () => {
      manager.initUnitSkills('unit_001', 'crew_b_001', 1);

      expect(manager.canUseUltimate('unit_001')).toBe(false);
    });

    it('未初始化单位应返回false', () => {
      expect(manager.canUseUltimate('unknown')).toBe(false);
    });
  });

  describe('getEnergyPercent', () => {
    it('应返回正确的能量百分比', () => {
      manager.initUnitSkills('unit_001', 'crew_b_001', 1);
      const state = manager.getUnitSkillState('unit_001');
      state!.currentEnergy = 50;

      expect(manager.getEnergyPercent('unit_001')).toBe(50);
    });

    it('未初始化单位应返回0', () => {
      expect(manager.getEnergyPercent('unknown')).toBe(0);
    });
  });

  describe('getSkillCooldownPercent', () => {
    it('应返回正确的冷却百分比', () => {
      manager.initUnitSkills('unit_001', 'crew_b_001', 1);
      const state = manager.getUnitSkillState('unit_001');
      state!.skillCooldown = 5;

      expect(manager.getSkillCooldownPercent('unit_001')).toBe(50);
    });

    it('未初始化单位应返回0', () => {
      expect(manager.getSkillCooldownPercent('unknown')).toBe(0);
    });
  });

  describe('clearAll', () => {
    it('应清除所有单位状态', () => {
      manager.initUnitSkills('unit_001', 'crew_b_001', 1);
      manager.initUnitSkills('unit_002', 'crew_b_002', 1);

      manager.clearAll();

      expect(manager.getUnitSkillState('unit_001')).toBeUndefined();
      expect(manager.getUnitSkillState('unit_002')).toBeUndefined();
    });
  });

  describe('onBattleStart', () => {
    it('已触发过应返回空数组', () => {
      manager.initUnitSkills('unit_001', 'crew_b_001', 5);
      const state = manager.getUnitSkillState('unit_001');
      state!.battleStartTriggered = true;

      const results = manager.onBattleStart('unit_001', 0, []);

      expect(results).toEqual([]);
    });

    it('5星铁壁应为全队添加护盾', () => {
      manager.initUnitSkills('unit_001', 'crew_b_001', 5);
      const allUnits = [
        { index: 0, id: 'unit_001', isPlayer: true, isAlive: true },
        { index: 1, id: 'ally_001', isPlayer: true, isAlive: true },
        { index: 2, id: 'enemy_001', isPlayer: false, isAlive: true },
      ];

      const results = manager.onBattleStart('unit_001', 0, allUnits);

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].type).toBe('shield');
      expect(results[0].targetIndices).toEqual([0, 1]);
    });
  });
});
