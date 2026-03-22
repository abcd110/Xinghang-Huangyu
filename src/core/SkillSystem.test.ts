import { describe, it, expect, beforeEach } from 'vitest';
import {
  SkillManager,
  WARRIOR_SKILL_SET,
} from './SkillSystem';
import { SkillType, SkillEffectType, TargetType } from '../screens/crewScreen/types/skillTypes';

describe('SkillManager', () => {
  let manager: SkillManager;

  beforeEach(() => {
    manager = new SkillManager();
  });

  describe('registerSkill', () => {
    it('应成功注册技能定义', () => {
      const skill = {
        id: 'test_skill',
        name: '测试技能',
        type: SkillType.BASIC,
        description: '测试技能描述',
        icon: '⚔️',
        effectType: SkillEffectType.DAMAGE,
        targetType: TargetType.SINGLE,
        levelEffects: [
          { level: 1, baseValue: 100, multiplier: 100, cooldown: 0 },
        ],
      };

      manager.registerSkill(skill);
      const result = manager.getSkillDefinition('test_skill');

      expect(result).toBeDefined();
      expect(result!.name).toBe('测试技能');
    });
  });

  describe('getSkillDefinition', () => {
    it('应返回已注册的技能定义', () => {
      const skill = {
        id: 'test_skill',
        name: '测试技能',
        type: SkillType.BASIC,
        description: '测试技能描述',
        icon: '⚔️',
        effectType: SkillEffectType.DAMAGE,
        targetType: TargetType.SINGLE,
        levelEffects: [
          { level: 1, baseValue: 100, multiplier: 100, cooldown: 0 },
        ],
      };

      manager.registerSkill(skill);
      const result = manager.getSkillDefinition('test_skill');

      expect(result).toEqual(skill);
    });

    it('未注册技能应返回undefined', () => {
      const result = manager.getSkillDefinition('unknown_skill');

      expect(result).toBeUndefined();
    });
  });

  describe('initCrewSkills', () => {
    it('应正确初始化船员技能数据', () => {
      manager.initCrewSkills('crew_001', 'skill_set_001', 3);
      const data = manager.crewSkillData.get('crew_001');

      expect(data).toBeDefined();
      expect(data!.skillSetId).toBe('skill_set_001');
      expect(data!.star).toBe(3);
      expect(data!.skillInstances.size).toBe(Object.keys(SkillType).length);
    });

    it('默认星级应为1', () => {
      manager.initCrewSkills('crew_001', 'skill_set_001');
      const data = manager.crewSkillData.get('crew_001');

      expect(data!.star).toBe(1);
    });

    it('应创建所有技能类型的实例', () => {
      manager.initCrewSkills('crew_001', 'skill_set_001', 1);
      const data = manager.crewSkillData.get('crew_001');

      expect(data!.skillInstances.has(SkillType.BASIC)).toBe(true);
      expect(data!.skillInstances.has(SkillType.SKILL)).toBe(true);
      expect(data!.skillInstances.has(SkillType.ULTIMATE)).toBe(true);
      expect(data!.skillInstances.has(SkillType.TALENT)).toBe(true);
    });
  });

  describe('updateCrewStar', () => {
    it('应正确更新船员星级', () => {
      manager.initCrewSkills('crew_001', 'skill_set_001', 1);
      manager.updateCrewStar('crew_001', 3);
      const data = manager.crewSkillData.get('crew_001');

      expect(data!.star).toBe(3);
    });

    it('应更新技能最大等级', () => {
      manager.initCrewSkills('crew_001', 'skill_set_001', 1);
      manager.updateCrewStar('crew_001', 3);
      const data = manager.crewSkillData.get('crew_001');

      data!.skillInstances.forEach(instance => {
        expect(instance.maxLevel).toBe(3);
      });
    });

    it('未初始化船员应不做任何操作', () => {
      manager.updateCrewStar('unknown_crew', 3);
      const data = manager.crewSkillData.get('unknown_crew');

      expect(data).toBeUndefined();
    });
  });

  describe('getCrewSkillBonuses', () => {
    it('未初始化船员应返回空数组', () => {
      const bonuses = manager.getCrewSkillBonuses('unknown_crew');

      expect(bonuses).toEqual([]);
    });
  });
});

describe('WARRIOR_SKILL_SET', () => {
  it('应包含所有技能类型', () => {
    expect(WARRIOR_SKILL_SET.basic).toBeDefined();
    expect(WARRIOR_SKILL_SET.skill).toBeDefined();
    expect(WARRIOR_SKILL_SET.ultimate).toBeDefined();
    expect(WARRIOR_SKILL_SET.talent).toBeDefined();
  });

  it('普攻应有5个等级', () => {
    expect(WARRIOR_SKILL_SET.basic.levelEffects).toHaveLength(5);
  });

  it('主动技能应有5个等级', () => {
    expect(WARRIOR_SKILL_SET.skill.levelEffects).toHaveLength(5);
  });

  it('终极技能应有5个等级', () => {
    expect(WARRIOR_SKILL_SET.ultimate.levelEffects).toHaveLength(5);
  });

  it('天赋应有5个等级', () => {
    expect(WARRIOR_SKILL_SET.talent.levelEffects).toHaveLength(5);
  });

  it('普攻应为伤害类型', () => {
    expect(WARRIOR_SKILL_SET.basic.effectType).toBe(SkillEffectType.DAMAGE);
  });

  it('主动技能应为伤害类型', () => {
    expect(WARRIOR_SKILL_SET.skill.effectType).toBe(SkillEffectType.DAMAGE);
  });

  it('终极技能应为伤害类型', () => {
    expect(WARRIOR_SKILL_SET.ultimate.effectType).toBe(SkillEffectType.DAMAGE);
  });

  it('天赋应为增益类型', () => {
    expect(WARRIOR_SKILL_SET.talent.effectType).toBe(SkillEffectType.BUFF);
  });

  it('普攻应为单体目标', () => {
    expect(WARRIOR_SKILL_SET.basic.targetType).toBe(TargetType.SINGLE);
  });

  it('主动技能应为范围目标', () => {
    expect(WARRIOR_SKILL_SET.skill.targetType).toBe(TargetType.AOE);
  });

  it('终极技能应为单体目标', () => {
    expect(WARRIOR_SKILL_SET.ultimate.targetType).toBe(TargetType.SINGLE);
  });

  it('普攻应有连击特性', () => {
    expect(WARRIOR_SKILL_SET.basic.features).toBeDefined();
    expect(WARRIOR_SKILL_SET.basic.features!.length).toBeGreaterThan(0);
  });

  it('主动技能应有眩晕特性', () => {
    expect(WARRIOR_SKILL_SET.skill.features).toBeDefined();
    expect(WARRIOR_SKILL_SET.skill.features!.length).toBeGreaterThan(0);
  });

  it('终极技能应有破甲特性', () => {
    expect(WARRIOR_SKILL_SET.ultimate.features).toBeDefined();
    expect(WARRIOR_SKILL_SET.ultimate.features!.length).toBeGreaterThan(0);
  });

  it('天赋应有觉醒特性', () => {
    expect(WARRIOR_SKILL_SET.talent.features).toBeDefined();
    expect(WARRIOR_SKILL_SET.talent.features!.length).toBeGreaterThan(0);
  });
});
