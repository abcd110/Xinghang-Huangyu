import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  SummonedUnit,
  SummonAttackResult,
  createSummonedUnit,
  updateSummonedUnits,
  processSummonAttacks,
  enhanceSummons,
  getOwnerSummons,
  getAliveSummons,
  getSummonsByType,
  generateSummonId,
} from './SummonManager';

vi.mock('../data/summonDefinitions', () => ({
  getSummonDefinition: vi.fn((summonId: string) => {
    if (summonId === 'drone') {
      return {
        id: 'drone',
        name: '无人机',
        icon: '🤖',
        hasHp: false,
        baseDuration: 5,
        baseAttackInterval: 2,
        baseDamagePercent: 10,
        targetType: 'single',
        effects: {
          armorBreak: { chance: 60, duration: 5, value: 10 },
        },
      };
    }
    if (summonId === 'turret') {
      return {
        id: 'turret',
        name: '炮塔',
        icon: '🗼',
        hasHp: true,
        baseHp: 500,
        baseDuration: 15,
        baseAttackInterval: 1,
        baseDamagePercent: 15,
        targetType: 'random',
      };
    }
    return undefined;
  }),
}));

describe('generateSummonId', () => {
  it('应生成唯一ID', () => {
    const id1 = generateSummonId();
    const id2 = generateSummonId();

    expect(id1).not.toBe(id2);
    expect(id1).toMatch(/^summon_\d+_\d+$/);
  });
});

describe('createSummonedUnit', () => {
  it('应成功创建召唤单位', () => {
    const units = createSummonedUnit('drone', 'owner_001', '玩家', 100, 1, 1);

    expect(units).toHaveLength(1);
    expect(units[0].summonId).toBe('drone');
    expect(units[0].name).toBe('无人机');
    expect(units[0].ownerId).toBe('owner_001');
    expect(units[0].ownerName).toBe('玩家');
    expect(units[0].ownerAttack).toBe(100);
    expect(units[0].duration).toBe(5);
    expect(units[0].remainingTime).toBe(5);
    expect(units[0].attackInterval).toBe(2);
    expect(units[0].damagePercent).toBe(10);
    expect(units[0].targetType).toBe('single');
    expect(units[0].isAlive).toBe(true);
  });

  it('技能等级应影响伤害百分比', () => {
    const units = createSummonedUnit('drone', 'owner_001', '玩家', 100, 5, 1);

    expect(units[0].damagePercent).toBe(10 + (5 - 1) * 5);
  });

  it('应能创建多个召唤单位', () => {
    const units = createSummonedUnit('drone', 'owner_001', '玩家', 100, 1, 3);

    expect(units).toHaveLength(3);
    expect(units[0].id).not.toBe(units[1].id);
    expect(units[1].id).not.toBe(units[2].id);
  });

  it('有HP的召唤物应正确设置HP', () => {
    const units = createSummonedUnit('turret', 'owner_001', '玩家', 100, 1, 1);

    expect(units[0].hp).toBe(500);
    expect(units[0].maxHp).toBe(500);
  });

  it('无HP的召唤物不应设置HP', () => {
    const units = createSummonedUnit('drone', 'owner_001', '玩家', 100, 1, 1);

    expect(units[0].hp).toBeUndefined();
    expect(units[0].maxHp).toBeUndefined();
  });

  it('无效召唤ID应返回空数组', () => {
    const units = createSummonedUnit('invalid', 'owner_001', '玩家', 100, 1, 1);

    expect(units).toHaveLength(0);
  });

  it('应复制效果配置', () => {
    const units = createSummonedUnit('drone', 'owner_001', '玩家', 100, 1, 1);

    expect(units[0].effects).toBeDefined();
    expect(units[0].effects!.armorBreak).toBeDefined();
    expect(units[0].effects!.armorBreak!.chance).toBe(60);
  });
});

describe('updateSummonedUnits', () => {
  let summons: SummonedUnit[];

  beforeEach(() => {
    summons = [
      {
        id: 'summon_001',
        summonId: 'drone',
        name: '无人机',
        ownerId: 'owner_001',
        ownerName: '玩家',
        ownerAttack: 100,
        duration: 5,
        remainingTime: 5,
        attackInterval: 2,
        attackTimer: 0,
        damagePercent: 10,
        targetType: 'single',
        isAlive: true,
        icon: '🤖',
      },
      {
        id: 'summon_002',
        summonId: 'drone',
        name: '无人机',
        ownerId: 'owner_001',
        ownerName: '玩家',
        ownerAttack: 100,
        duration: 5,
        remainingTime: 0.5,
        attackInterval: 2,
        attackTimer: 0,
        damagePercent: 10,
        targetType: 'single',
        isAlive: true,
        icon: '🤖',
      },
    ];
  });

  it('应正确减少剩余时间', () => {
    const { updatedSummons } = updateSummonedUnits(summons, 1);

    expect(updatedSummons[0].remainingTime).toBe(4);
  });

  it('过期召唤物应标记为死亡', () => {
    const { updatedSummons, expiredIds } = updateSummonedUnits(summons, 1);

    expect(expiredIds).toContain('summon_002');
    expect(updatedSummons.find(s => s.id === 'summon_002')!.isAlive).toBe(false);
  });

  it('已死亡的召唤物不应更新', () => {
    summons[0].isAlive = false;
    summons[0].remainingTime = 5;

    const { updatedSummons } = updateSummonedUnits(summons, 1);

    expect(updatedSummons[0].remainingTime).toBe(5);
  });

  describe('增强状态', () => {
    it('应正确减少增强持续时间', () => {
      summons[0].enhanced = true;
      summons[0].enhancedDuration = 5;

      const { updatedSummons } = updateSummonedUnits(summons, 1);

      expect(updatedSummons[0].enhancedDuration).toBe(4);
    });

    it('增强时间结束应取消增强状态', () => {
      summons[0].enhanced = true;
      summons[0].enhancedDuration = 0.5;

      const { updatedSummons } = updateSummonedUnits(summons, 1);

      expect(updatedSummons[0].enhanced).toBe(false);
      expect(updatedSummons[0].enhancedDuration).toBe(0);
    });
  });
});

describe('processSummonAttacks', () => {
  let summons: SummonedUnit[];
  let enemyTeam: { id: string; name: string; hp: number; maxHp: number; defense: number; isAlive: boolean; index: number }[];
  let attackResults: SummonAttackResult[];
  let damageResults: { targetIndex: number; damage: number }[];

  beforeEach(() => {
    summons = [
      {
        id: 'summon_001',
        summonId: 'drone',
        name: '无人机',
        ownerId: 'owner_001',
        ownerName: '玩家',
        ownerAttack: 100,
        duration: 5,
        remainingTime: 5,
        attackInterval: 2,
        attackTimer: 1.5,
        damagePercent: 10,
        targetType: 'single',
        isAlive: true,
        icon: '🤖',
      },
    ];
    enemyTeam = [
      { id: 'enemy_001', name: '敌人1', hp: 1000, maxHp: 1000, defense: 100, isAlive: true, index: 0 },
      { id: 'enemy_002', name: '敌人2', hp: 500, maxHp: 500, defense: 50, isAlive: true, index: 1 },
    ];
    attackResults = [];
    damageResults = [];
  });

  it('攻击间隔到达时应发起攻击', () => {
    summons[0].attackTimer = 2;

    processSummonAttacks(
      summons,
      0.1,
      enemyTeam,
      (result) => attackResults.push(result),
      (targetIndex, damage) => damageResults.push({ targetIndex, damage })
    );

    expect(attackResults).toHaveLength(1);
    expect(damageResults).toHaveLength(1);
  });

  it('攻击间隔未到不应攻击', () => {
    summons[0].attackTimer = 0.5;

    processSummonAttacks(
      summons,
      0.1,
      enemyTeam,
      () => {},
      () => {}
    );

    expect(attackResults).toHaveLength(0);
  });

  it('应正确计算伤害', () => {
    summons[0].attackTimer = 2;

    processSummonAttacks(
      summons,
      0.1,
      enemyTeam,
      () => {},
      (targetIndex, damage) => damageResults.push({ targetIndex, damage })
    );

    const baseDamage = Math.floor(100 * 0.1);
    const defense = 100;
    const reduction = (defense / (defense + 600)) * 100;
    const expectedDamage = Math.max(1, Math.floor(baseDamage * (1 - reduction / 100)));

    expect(damageResults[0].damage).toBe(expectedDamage);
  });

  it('增强状态应使攻击间隔减半', () => {
    summons[0].enhanced = true;
    summons[0].attackTimer = 1;

    processSummonAttacks(
      summons,
      0.1,
      enemyTeam,
      (result) => attackResults.push(result),
      () => {}
    );

    expect(attackResults).toHaveLength(1);
  });

  it('单体目标应选择第一个敌人', () => {
    summons[0].attackTimer = 2;
    summons[0].targetType = 'single';

    processSummonAttacks(
      summons,
      0.1,
      enemyTeam,
      (result) => attackResults.push(result),
      () => {}
    );

    expect(attackResults[0].targetIndex).toBe(0);
  });

  it('随机目标应选择存活敌人', () => {
    summons[0].attackTimer = 2;
    summons[0].targetType = 'random';

    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    processSummonAttacks(
      summons,
      0.1,
      enemyTeam,
      (result) => attackResults.push(result),
      () => {}
    );

    expect([0, 1]).toContain(attackResults[0].targetIndex);
  });

  it('无存活敌人不应攻击', () => {
    summons[0].attackTimer = 2;
    enemyTeam[0].isAlive = false;
    enemyTeam[1].isAlive = false;

    processSummonAttacks(
      summons,
      0.1,
      enemyTeam,
      (result) => attackResults.push(result),
      () => {}
    );

    expect(attackResults).toHaveLength(0);
  });

  it('死亡的召唤物不应攻击', () => {
    summons[0].attackTimer = 2;
    summons[0].isAlive = false;

    processSummonAttacks(
      summons,
      0.1,
      enemyTeam,
      (result) => attackResults.push(result),
      () => {}
    );

    expect(attackResults).toHaveLength(0);
  });

  it('破甲效果触发时应设置armorBreakApplied', () => {
    summons[0].attackTimer = 2;
    summons[0].effects = { armorBreak: { chance: 60, duration: 5, value: 10 } };

    vi.spyOn(Math, 'random').mockReturnValue(0);

    processSummonAttacks(
      summons,
      0.1,
      enemyTeam,
      (result) => attackResults.push(result),
      () => {}
    );

    expect(attackResults[0].armorBreakApplied).toBe(true);
  });

  it('破甲效果未触发时不应设置armorBreakApplied', () => {
    summons[0].attackTimer = 2;
    summons[0].effects = { armorBreak: { chance: 60, duration: 5, value: 10 } };

    vi.spyOn(Math, 'random').mockReturnValue(1);

    processSummonAttacks(
      summons,
      0.1,
      enemyTeam,
      (result) => attackResults.push(result),
      () => {}
    );

    expect(attackResults[0].armorBreakApplied).toBe(false);
  });

  it('应正确更新攻击计时器', () => {
    summons[0].attackTimer = 1.5;

    const result = processSummonAttacks(
      summons,
      0.1,
      enemyTeam,
      () => {},
      () => {}
    );

    expect(result[0].attackTimer).toBeCloseTo(1.6, 1);
  });

  it('多次攻击应正确处理', () => {
    summons[0].attackTimer = 4;

    processSummonAttacks(
      summons,
      0.1,
      enemyTeam,
      (result) => attackResults.push(result),
      () => {}
    );

    expect(attackResults).toHaveLength(2);
  });
});

describe('enhanceSummons', () => {
  let summons: SummonedUnit[];

  beforeEach(() => {
    summons = [
      {
        id: 'summon_001',
        summonId: 'drone',
        name: '无人机',
        ownerId: 'owner_001',
        ownerName: '玩家1',
        ownerAttack: 100,
        duration: 5,
        remainingTime: 5,
        attackInterval: 2,
        attackTimer: 0,
        damagePercent: 10,
        targetType: 'single',
        isAlive: true,
        icon: '🤖',
      },
      {
        id: 'summon_002',
        summonId: 'drone',
        name: '无人机',
        ownerId: 'owner_002',
        ownerName: '玩家2',
        ownerAttack: 100,
        duration: 5,
        remainingTime: 5,
        attackInterval: 2,
        attackTimer: 0,
        damagePercent: 10,
        targetType: 'single',
        isAlive: true,
        icon: '🤖',
      },
    ];
  });

  it('应增强指定拥有者的召唤物', () => {
    const result = enhanceSummons(summons, 'owner_001', 10);

    expect(result[0].enhanced).toBe(true);
    expect(result[0].enhancedDuration).toBe(10);
    expect(result[1].enhanced).toBeUndefined();
  });

  it('已死亡的召唤物不应增强', () => {
    summons[0].isAlive = false;

    const result = enhanceSummons(summons, 'owner_001', 10);

    expect(result[0].enhanced).toBeUndefined();
  });

  it('其他拥有者的召唤物不应受影响', () => {
    const result = enhanceSummons(summons, 'owner_001', 10);

    expect(result[1].enhanced).toBeUndefined();
  });
});

describe('getOwnerSummons', () => {
  let summons: SummonedUnit[];

  beforeEach(() => {
    summons = [
      {
        id: 'summon_001',
        summonId: 'drone',
        name: '无人机',
        ownerId: 'owner_001',
        ownerName: '玩家1',
        ownerAttack: 100,
        duration: 5,
        remainingTime: 5,
        attackInterval: 2,
        attackTimer: 0,
        damagePercent: 10,
        targetType: 'single',
        isAlive: true,
        icon: '🤖',
      },
      {
        id: 'summon_002',
        summonId: 'drone',
        name: '无人机',
        ownerId: 'owner_002',
        ownerName: '玩家2',
        ownerAttack: 100,
        duration: 5,
        remainingTime: 5,
        attackInterval: 2,
        attackTimer: 0,
        damagePercent: 10,
        targetType: 'single',
        isAlive: true,
        icon: '🤖',
      },
    ];
  });

  it('应返回指定拥有者的存活召唤物', () => {
    const result = getOwnerSummons(summons, 'owner_001');

    expect(result).toHaveLength(1);
    expect(result[0].ownerId).toBe('owner_001');
  });

  it('死亡的召唤物不应返回', () => {
    summons[0].isAlive = false;

    const result = getOwnerSummons(summons, 'owner_001');

    expect(result).toHaveLength(0);
  });

  it('无匹配应返回空数组', () => {
    const result = getOwnerSummons(summons, 'owner_003');

    expect(result).toHaveLength(0);
  });
});

describe('getAliveSummons', () => {
  it('应返回所有存活的召唤物', () => {
    const summons: SummonedUnit[] = [
      {
        id: 'summon_001',
        summonId: 'drone',
        name: '无人机',
        ownerId: 'owner_001',
        ownerName: '玩家',
        ownerAttack: 100,
        duration: 5,
        remainingTime: 5,
        attackInterval: 2,
        attackTimer: 0,
        damagePercent: 10,
        targetType: 'single',
        isAlive: true,
        icon: '🤖',
      },
      {
        id: 'summon_002',
        summonId: 'drone',
        name: '无人机',
        ownerId: 'owner_001',
        ownerName: '玩家',
        ownerAttack: 100,
        duration: 5,
        remainingTime: 0,
        attackInterval: 2,
        attackTimer: 0,
        damagePercent: 10,
        targetType: 'single',
        isAlive: false,
        icon: '🤖',
      },
    ];

    const result = getAliveSummons(summons);

    expect(result).toHaveLength(1);
    expect(result[0].isAlive).toBe(true);
  });

  it('无存活召唤物应返回空数组', () => {
    const summons: SummonedUnit[] = [
      {
        id: 'summon_001',
        summonId: 'drone',
        name: '无人机',
        ownerId: 'owner_001',
        ownerName: '玩家',
        ownerAttack: 100,
        duration: 5,
        remainingTime: 0,
        attackInterval: 2,
        attackTimer: 0,
        damagePercent: 10,
        targetType: 'single',
        isAlive: false,
        icon: '🤖',
      },
    ];

    const result = getAliveSummons(summons);

    expect(result).toHaveLength(0);
  });
});

describe('getSummonsByType', () => {
  it('应返回指定类型的存活召唤物', () => {
    const summons: SummonedUnit[] = [
      {
        id: 'summon_001',
        summonId: 'drone',
        name: '无人机',
        ownerId: 'owner_001',
        ownerName: '玩家',
        ownerAttack: 100,
        duration: 5,
        remainingTime: 5,
        attackInterval: 2,
        attackTimer: 0,
        damagePercent: 10,
        targetType: 'single',
        isAlive: true,
        icon: '🤖',
      },
      {
        id: 'summon_002',
        summonId: 'turret',
        name: '炮塔',
        ownerId: 'owner_001',
        ownerName: '玩家',
        ownerAttack: 100,
        duration: 15,
        remainingTime: 15,
        attackInterval: 1,
        attackTimer: 0,
        damagePercent: 15,
        targetType: 'random',
        isAlive: true,
        icon: '🗼',
      },
    ];

    const result = getSummonsByType(summons, 'drone');

    expect(result).toHaveLength(1);
    expect(result[0].summonId).toBe('drone');
  });

  it('死亡的召唤物不应返回', () => {
    const summons: SummonedUnit[] = [
      {
        id: 'summon_001',
        summonId: 'drone',
        name: '无人机',
        ownerId: 'owner_001',
        ownerName: '玩家',
        ownerAttack: 100,
        duration: 5,
        remainingTime: 0,
        attackInterval: 2,
        attackTimer: 0,
        damagePercent: 10,
        targetType: 'single',
        isAlive: false,
        icon: '🤖',
      },
    ];

    const result = getSummonsByType(summons, 'drone');

    expect(result).toHaveLength(0);
  });

  it('无匹配类型应返回空数组', () => {
    const summons: SummonedUnit[] = [
      {
        id: 'summon_001',
        summonId: 'drone',
        name: '无人机',
        ownerId: 'owner_001',
        ownerName: '玩家',
        ownerAttack: 100,
        duration: 5,
        remainingTime: 5,
        attackInterval: 2,
        attackTimer: 0,
        damagePercent: 10,
        targetType: 'single',
        isAlive: true,
        icon: '🤖',
      },
    ];

    const result = getSummonsByType(summons, 'turret');

    expect(result).toHaveLength(0);
  });
});
