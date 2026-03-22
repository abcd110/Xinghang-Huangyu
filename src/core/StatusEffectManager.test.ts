import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  StatusEffect,
  StatusEffectType,
  createStatusEffect,
  updateStatusEffects,
  applyStatusEffect,
  removeStatusEffects,
  getTargetEffects,
  hasEffect,
  getEffectValue,
  getEffectStacks,
  calculateStatusEffectBonuses,
  calculateBurnDamage,
  applyShieldWithCap,
  calculateShieldCap,
  generateEffectId,
} from './StatusEffectManager';

describe('createStatusEffect', () => {
  it('应创建包含所有必需字段的状态效果', () => {
    const effect = createStatusEffect('burn', 'target_001', 'source_001', '火球术', 20, 5);

    expect(effect.id).toBeDefined();
    expect(effect.type).toBe('burn');
    expect(effect.targetId).toBe('target_001');
    expect(effect.sourceId).toBe('source_001');
    expect(effect.sourceName).toBe('火球术');
    expect(effect.value).toBe(20);
    expect(effect.duration).toBe(5);
    expect(effect.remainingTime).toBe(5);
    expect(effect.currentStacks).toBe(1);
    expect(effect.createdAt).toBeDefined();
  });

  it('应正确设置可选字段', () => {
    const effect = createStatusEffect('burn', 'target_001', 'source_001', '火球术', 20, 5, {
      maxStacks: 5,
      extra: { damagePerSecond: 20 },
      sourceAttack: 100,
    });

    expect(effect.maxStacks).toBe(5);
    expect(effect.extra).toEqual({ damagePerSecond: 20 });
    expect(effect.sourceAttack).toBe(100);
  });

  it('每次调用应生成唯一ID', () => {
    const effect1 = createStatusEffect('burn', 'target_001', 'source_001', '火球术', 20, 5);
    const effect2 = createStatusEffect('burn', 'target_001', 'source_001', '火球术', 20, 5);

    expect(effect1.id).not.toBe(effect2.id);
  });
});

describe('generateEffectId', () => {
  it('应生成唯一ID', () => {
    const id1 = generateEffectId();
    const id2 = generateEffectId();

    expect(id1).not.toBe(id2);
    expect(id1).toMatch(/^effect_\d+_\d+$/);
  });
});

describe('updateStatusEffects', () => {
  let effects: StatusEffect[];

  beforeEach(() => {
    effects = [
      createStatusEffect('burn', 'target_001', 'source_001', '火球术', 20, 5),
      createStatusEffect('armorBreak', 'target_001', 'source_002', '破甲', 30, 10),
    ];
  });

  it('应正确减少剩余时间', () => {
    const { updatedEffects } = updateStatusEffects(effects, 1);

    expect(updatedEffects[0].remainingTime).toBe(4);
    expect(updatedEffects[1].remainingTime).toBe(9);
  });

  it('过期效果应被移除', () => {
    const burnEffect = effects[0];
    burnEffect.remainingTime = 0.5;

    const { updatedEffects, expiredEffects } = updateStatusEffects(effects, 1);

    expect(expiredEffects).toContainEqual(expect.objectContaining({ id: burnEffect.id }));
    expect(updatedEffects.find(e => e.id === burnEffect.id)).toBeUndefined();
  });

  it('永久效果(Infinity)不应过期', () => {
    effects[0].duration = Infinity;
    effects[0].remainingTime = Infinity;

    const { updatedEffects, expiredEffects } = updateStatusEffects(effects, 1);

    expect(expiredEffects).toHaveLength(0);
    expect(updatedEffects.find(e => e.type === 'burn')).toBeDefined();
  });

  describe('灼烧tick', () => {
    it('灼烧每秒应触发tick', () => {
      vi.useFakeTimers();
      const now = Date.now();
      vi.setSystemTime(now);

      const burnEffect = createStatusEffect('burn', 'target_001', 'source_001', '火球术', 20, 5, {
        extra: { damagePerSecond: 20 },
        sourceAttack: 100,
      });
      burnEffect.lastTickTime = now - 1000;

      const { updatedEffects, tickEffects } = updateStatusEffects([burnEffect], 0.1);

      expect(tickEffects).toHaveLength(1);
      expect(tickEffects[0].type).toBe('burn');
      expect(updatedEffects[0].lastTickTime).toBe(now);

      vi.useRealTimers();
    });

    it('灼烧未到1秒不应触发tick', () => {
      vi.useFakeTimers();
      const now = Date.now();
      vi.setSystemTime(now);

      const burnEffect = createStatusEffect('burn', 'target_001', 'source_001', '火球术', 20, 5, {
        extra: { damagePerSecond: 20 },
        sourceAttack: 100,
      });
      burnEffect.lastTickTime = now - 500;

      const { tickEffects } = updateStatusEffects([burnEffect], 0.1);

      expect(tickEffects).toHaveLength(0);

      vi.useRealTimers();
    });
  });
});

describe('applyStatusEffect', () => {
  it('应添加新效果', () => {
    const effects: StatusEffect[] = [];
    const newEffect = createStatusEffect('burn', 'target_001', 'source_001', '火球术', 20, 5);

    const result = applyStatusEffect(effects, newEffect);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(newEffect.id);
  });

  it('未达上限时应叠加效果', () => {
    const existingEffect = createStatusEffect('burn', 'target_001', 'source_001', '火球术', 20, 5, { maxStacks: 5 });
    existingEffect.currentStacks = 2;
    const effects = [existingEffect];

    const newEffect = createStatusEffect('burn', 'target_001', 'source_001', '火球术', 20, 5, { maxStacks: 5 });
    const result = applyStatusEffect(effects, newEffect);

    expect(result).toHaveLength(1);
    expect(result[0].currentStacks).toBe(3);
  });

  it('已达上限时不应叠加', () => {
    const existingEffect = createStatusEffect('burn', 'target_001', 'source_001', '火球术', 20, 5, { maxStacks: 5 });
    existingEffect.currentStacks = 5;
    const effects = [existingEffect];

    const newEffect = createStatusEffect('burn', 'target_001', 'source_001', '火球术', 20, 5, { maxStacks: 5 });
    const result = applyStatusEffect(effects, newEffect);

    expect(result).toHaveLength(1);
    expect(result[0].currentStacks).toBe(5);
  });

  it('叠加时应刷新持续时间', () => {
    const existingEffect = createStatusEffect('burn', 'target_001', 'source_001', '火球术', 20, 5);
    existingEffect.remainingTime = 2;
    const effects = [existingEffect];

    const newEffect = createStatusEffect('burn', 'target_001', 'source_001', '火球术', 20, 8);
    const result = applyStatusEffect(effects, newEffect);

    expect(result[0].remainingTime).toBe(8);
  });

  it('不同类型效果应共存', () => {
    const burnEffect = createStatusEffect('burn', 'target_001', 'source_001', '火球术', 20, 5);
    const effects = [burnEffect];

    const armorBreakEffect = createStatusEffect('armorBreak', 'target_001', 'source_002', '破甲', 30, 10);
    const result = applyStatusEffect(effects, armorBreakEffect);

    expect(result).toHaveLength(2);
  });

  it('不同目标效果应共存', () => {
    const effect1 = createStatusEffect('burn', 'target_001', 'source_001', '火球术', 20, 5);
    const effects = [effect1];

    const effect2 = createStatusEffect('burn', 'target_002', 'source_001', '火球术', 20, 5);
    const result = applyStatusEffect(effects, effect2);

    expect(result).toHaveLength(2);
  });
});

describe('removeStatusEffects', () => {
  let effects: StatusEffect[];

  beforeEach(() => {
    effects = [
      createStatusEffect('burn', 'target_001', 'source_001', '火球术', 20, 5),
      createStatusEffect('armorBreak', 'target_001', 'source_002', '破甲', 30, 10),
      createStatusEffect('burn', 'target_002', 'source_001', '火球术', 20, 5),
    ];
  });

  it('应移除指定类型的所有效果', () => {
    const result = removeStatusEffects(effects, 'target_001', 'burn');

    expect(result).toHaveLength(2);
    expect(result.find(e => e.type === 'burn' && e.targetId === 'target_001')).toBeUndefined();
  });

  it('不指定类型应移除目标所有效果', () => {
    const result = removeStatusEffects(effects, 'target_001');

    expect(result).toHaveLength(1);
    expect(result.every(e => e.targetId !== 'target_001')).toBe(true);
  });

  it('目标无效果应返回原数组', () => {
    const result = removeStatusEffects(effects, 'target_003');

    expect(result).toHaveLength(3);
  });
});

describe('getTargetEffects', () => {
  it('应返回目标的所有效果', () => {
    const effects = [
      createStatusEffect('burn', 'target_001', 'source_001', '火球术', 20, 5),
      createStatusEffect('armorBreak', 'target_001', 'source_002', '破甲', 30, 10),
      createStatusEffect('burn', 'target_002', 'source_001', '火球术', 20, 5),
    ];

    const result = getTargetEffects(effects, 'target_001');

    expect(result).toHaveLength(2);
  });

  it('目标无效果应返回空数组', () => {
    const effects = [
      createStatusEffect('burn', 'target_001', 'source_001', '火球术', 20, 5),
    ];

    const result = getTargetEffects(effects, 'target_002');

    expect(result).toHaveLength(0);
  });
});

describe('hasEffect', () => {
  it('目标有指定效果应返回true', () => {
    const effects = [
      createStatusEffect('burn', 'target_001', 'source_001', '火球术', 20, 5),
    ];

    expect(hasEffect(effects, 'target_001', 'burn')).toBe(true);
  });

  it('目标无指定效果应返回false', () => {
    const effects = [
      createStatusEffect('burn', 'target_001', 'source_001', '火球术', 20, 5),
    ];

    expect(hasEffect(effects, 'target_001', 'armorBreak')).toBe(false);
  });

  it('效果已过期应返回false', () => {
    const effect = createStatusEffect('burn', 'target_001', 'source_001', '火球术', 20, 5);
    effect.remainingTime = 0;
    const effects = [effect];

    expect(hasEffect(effects, 'target_001', 'burn')).toBe(false);
  });
});

describe('getEffectValue', () => {
  it('应返回效果数值总和', () => {
    const effects = [
      createStatusEffect('burn', 'target_001', 'source_001', '火球术', 20, 5),
      createStatusEffect('burn', 'target_001', 'source_002', '火球术', 30, 5),
    ];
    effects[0].currentStacks = 2;
    effects[1].currentStacks = 1;

    const value = getEffectValue(effects, 'target_001', 'burn');

    expect(value).toBe(20 * 2 + 30 * 1);
  });

  it('目标无效果应返回0', () => {
    const effects: StatusEffect[] = [];

    const value = getEffectValue(effects, 'target_001', 'burn');

    expect(value).toBe(0);
  });
});

describe('getEffectStacks', () => {
  it('应返回效果层数总和', () => {
    const effects = [
      createStatusEffect('burn', 'target_001', 'source_001', '火球术', 20, 5),
      createStatusEffect('burn', 'target_001', 'source_002', '火球术', 30, 5),
    ];
    effects[0].currentStacks = 3;
    effects[1].currentStacks = 2;

    const stacks = getEffectStacks(effects, 'target_001', 'burn');

    expect(stacks).toBe(5);
  });

  it('目标无效果应返回0', () => {
    const effects: StatusEffect[] = [];

    const stacks = getEffectStacks(effects, 'target_001', 'burn');

    expect(stacks).toBe(0);
  });
});

describe('calculateStatusEffectBonuses', () => {
  const baseStats = {
    baseDefense: 100,
    baseAttack: 100,
    baseCritDamage: 50,
    baseArmorPierce: 0,
    baseHealEffectiveness: 0,
    baseSpeed: 10,
  };

  it('无效果应返回基础属性', () => {
    const effects: StatusEffect[] = [];

    const result = calculateStatusEffectBonuses(
      effects,
      'target_001',
      baseStats.baseDefense,
      baseStats.baseAttack,
      baseStats.baseCritDamage,
      baseStats.baseArmorPierce,
      baseStats.baseHealEffectiveness,
      baseStats.baseSpeed
    );

    expect(result.defense).toBe(100);
    expect(result.attack).toBe(100);
    expect(result.critDamage).toBe(50);
    expect(result.armorPierce).toBe(0);
    expect(result.healEffectiveness).toBe(0);
    expect(result.speedBoost).toBe(10);
    expect(result.isInvincible).toBe(false);
    expect(result.isStunned).toBe(false);
  });

  it('破甲应降低防御', () => {
    const effect = createStatusEffect('armorBreak', 'target_001', 'source_001', '破甲', 30, 10, {
      extra: { defensePercent: 30 },
    });
    const effects = [effect];

    const result = calculateStatusEffectBonuses(
      effects,
      'target_001',
      baseStats.baseDefense,
      baseStats.baseAttack,
      baseStats.baseCritDamage,
      baseStats.baseArmorPierce,
      baseStats.baseHealEffectiveness,
      baseStats.baseSpeed
    );

    expect(result.defense).toBe(70);
  });

  it('木马应降低攻击', () => {
    const effect = createStatusEffect('trojan', 'target_001', 'source_001', '木马', 20, 10, {
      extra: { attackPercent: 20 },
    });
    const effects = [effect];

    const result = calculateStatusEffectBonuses(
      effects,
      'target_001',
      baseStats.baseDefense,
      baseStats.baseAttack,
      baseStats.baseCritDamage,
      baseStats.baseArmorPierce,
      baseStats.baseHealEffectiveness,
      baseStats.baseSpeed
    );

    expect(result.attack).toBe(80);
  });

  it('攻击降低效果应降低攻击', () => {
    const effect = createStatusEffect('attackReduce', 'target_001', 'source_001', '攻击降低', 25, 10, {
      extra: { attackPercent: 25 },
    });
    const effects = [effect];

    const result = calculateStatusEffectBonuses(
      effects,
      'target_001',
      baseStats.baseDefense,
      baseStats.baseAttack,
      baseStats.baseCritDamage,
      baseStats.baseArmorPierce,
      baseStats.baseHealEffectiveness,
      baseStats.baseSpeed
    );

    expect(result.attack).toBe(75);
  });

  it('穿甲弹应增加暴击伤害和穿透', () => {
    const effect = createStatusEffect('armorPiercingAmmo', 'target_001', 'source_001', '穿甲弹', 0, 10, {
      extra: { critDamageBonus: 30, armorPierce: 20 },
    });
    const effects = [effect];

    const result = calculateStatusEffectBonuses(
      effects,
      'target_001',
      baseStats.baseDefense,
      baseStats.baseAttack,
      baseStats.baseCritDamage,
      baseStats.baseArmorPierce,
      baseStats.baseHealEffectiveness,
      baseStats.baseSpeed
    );

    expect(result.critDamage).toBe(80);
    expect(result.armorPierce).toBe(20);
  });

  it('活力应增加治疗效果', () => {
    const effect = createStatusEffect('vitality', 'target_001', 'source_001', '活力', 20, 10);
    const effects = [effect];

    const result = calculateStatusEffectBonuses(
      effects,
      'target_001',
      baseStats.baseDefense,
      baseStats.baseAttack,
      baseStats.baseCritDamage,
      baseStats.baseArmorPierce,
      baseStats.baseHealEffectiveness,
      baseStats.baseSpeed
    );

    expect(result.healEffectiveness).toBe(20);
  });

  it('攻速提升应增加速度', () => {
    const effect = createStatusEffect('speedBoost', 'target_001', 'source_001', '攻速提升', 30, 10);
    const effects = [effect];

    const result = calculateStatusEffectBonuses(
      effects,
      'target_001',
      baseStats.baseDefense,
      baseStats.baseAttack,
      baseStats.baseCritDamage,
      baseStats.baseArmorPierce,
      baseStats.baseHealEffectiveness,
      baseStats.baseSpeed
    );

    expect(result.speedBoost).toBe(13);
  });

  it('无敌效果应设置isInvincible', () => {
    const effect = createStatusEffect('invincible', 'target_001', 'source_001', '无敌', 0, 5);
    const effects = [effect];

    const result = calculateStatusEffectBonuses(
      effects,
      'target_001',
      baseStats.baseDefense,
      baseStats.baseAttack,
      baseStats.baseCritDamage,
      baseStats.baseArmorPierce,
      baseStats.baseHealEffectiveness,
      baseStats.baseSpeed
    );

    expect(result.isInvincible).toBe(true);
  });

  it('眩晕效果应设置isStunned', () => {
    const effect = createStatusEffect('stun', 'target_001', 'source_001', '眩晕', 0, 3);
    const effects = [effect];

    const result = calculateStatusEffectBonuses(
      effects,
      'target_001',
      baseStats.baseDefense,
      baseStats.baseAttack,
      baseStats.baseCritDamage,
      baseStats.baseArmorPierce,
      baseStats.baseHealEffectiveness,
      baseStats.baseSpeed
    );

    expect(result.isStunned).toBe(true);
  });

  it('伤害分担应设置isSharingDamage', () => {
    const effect = createStatusEffect('damageShare', 'target_001', 'source_001', '伤害分担', 30, 10, {
      extra: { damageSharePercent: 30 },
    });
    const effects = [effect];

    const result = calculateStatusEffectBonuses(
      effects,
      'target_001',
      baseStats.baseDefense,
      baseStats.baseAttack,
      baseStats.baseCritDamage,
      baseStats.baseArmorPierce,
      baseStats.baseHealEffectiveness,
      baseStats.baseSpeed
    );

    expect(result.isSharingDamage).toBe(true);
    expect(result.damageSharePercent).toBe(30);
  });

  it('多层效果应叠加', () => {
    const effects = [
      createStatusEffect('armorBreak', 'target_001', 'source_001', '破甲', 20, 10, {
        extra: { defensePercent: 20 },
      }),
      createStatusEffect('armorBreak', 'target_001', 'source_002', '破甲', 30, 10, {
        extra: { defensePercent: 30 },
      }),
    ];
    effects[0].currentStacks = 1;
    effects[1].currentStacks = 1;

    const result = calculateStatusEffectBonuses(
      effects,
      'target_001',
      baseStats.baseDefense,
      baseStats.baseAttack,
      baseStats.baseCritDamage,
      baseStats.baseArmorPierce,
      baseStats.baseHealEffectiveness,
      baseStats.baseSpeed
    );

    expect(result.defense).toBe(50);
  });

  it('防御不应低于0', () => {
    const effect = createStatusEffect('armorBreak', 'target_001', 'source_001', '破甲', 150, 10, {
      extra: { defensePercent: 150 },
    });
    const effects = [effect];

    const result = calculateStatusEffectBonuses(
      effects,
      'target_001',
      baseStats.baseDefense,
      baseStats.baseAttack,
      baseStats.baseCritDamage,
      baseStats.baseArmorPierce,
      baseStats.baseHealEffectiveness,
      baseStats.baseSpeed
    );

    expect(result.defense).toBe(0);
  });

  it('攻击不应低于0', () => {
    const effect = createStatusEffect('trojan', 'target_001', 'source_001', '木马', 150, 10, {
      extra: { attackPercent: 150 },
    });
    const effects = [effect];

    const result = calculateStatusEffectBonuses(
      effects,
      'target_001',
      baseStats.baseDefense,
      baseStats.baseAttack,
      baseStats.baseCritDamage,
      baseStats.baseArmorPierce,
      baseStats.baseHealEffectiveness,
      baseStats.baseSpeed
    );

    expect(result.attack).toBe(0);
  });
});

describe('calculateBurnDamage', () => {
  it('无灼烧效果应返回0', () => {
    const effects: StatusEffect[] = [];

    const damage = calculateBurnDamage(effects, 'target_001');

    expect(damage).toBe(0);
  });

  it('单层灼烧应正确计算伤害', () => {
    const effect = createStatusEffect('burn', 'target_001', 'source_001', '火球术', 20, 5, {
      extra: { damagePerSecond: 20 },
      sourceAttack: 100,
    });
    const effects = [effect];

    const damage = calculateBurnDamage(effects, 'target_001');

    expect(damage).toBe(20);
  });

  it('多层灼烧应叠加伤害', () => {
    const effect = createStatusEffect('burn', 'target_001', 'source_001', '火球术', 20, 5, {
      extra: { damagePerSecond: 20 },
      sourceAttack: 100,
    });
    effect.currentStacks = 3;
    const effects = [effect];

    const damage = calculateBurnDamage(effects, 'target_001');

    expect(damage).toBe(60);
  });

  it('多个灼烧效果应累加', () => {
    const effects = [
      createStatusEffect('burn', 'target_001', 'source_001', '火球术', 20, 5, {
        extra: { damagePerSecond: 20 },
        sourceAttack: 100,
      }),
      createStatusEffect('burn', 'target_001', 'source_002', '烈焰', 20, 5, {
        extra: { damagePerSecond: 30 },
        sourceAttack: 150,
      }),
    ];
    effects[0].currentStacks = 2;
    effects[1].currentStacks = 1;

    const damage = calculateBurnDamage(effects, 'target_001');

    expect(damage).toBe(20 * 2 + 45 * 1);
  });

  it('已过期的灼烧不应计算', () => {
    const effect = createStatusEffect('burn', 'target_001', 'source_001', '火球术', 20, 5, {
      extra: { damagePerSecond: 20 },
      sourceAttack: 100,
    });
    effect.remainingTime = 0;
    const effects = [effect];

    const damage = calculateBurnDamage(effects, 'target_001');

    expect(damage).toBe(0);
  });
});

describe('applyShieldWithCap', () => {
  it('应正确添加护盾', () => {
    const result = applyShieldWithCap(50, 30, 100);

    expect(result).toBe(80);
  });

  it('护盾不应超过上限', () => {
    const result = applyShieldWithCap(80, 50, 100);

    expect(result).toBe(100);
  });

  it('当前护盾已达上限应不再增加', () => {
    const result = applyShieldWithCap(100, 30, 100);

    expect(result).toBe(100);
  });
});

describe('calculateShieldCap', () => {
  it('应正确计算护盾上限', () => {
    const result = calculateShieldCap(200, 100);

    expect(result).toBe(200);
  });

  it('应正确处理百分比', () => {
    const result = calculateShieldCap(100, 50);

    expect(result).toBe(50);
  });

  it('应向下取整', () => {
    const result = calculateShieldCap(99, 50);

    expect(result).toBe(49);
  });
});
