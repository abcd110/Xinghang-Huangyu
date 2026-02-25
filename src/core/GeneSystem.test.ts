import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  BasePair,
  BASE_PAIR_CONFIG,
  GeneDominance,
  GENE_DOMINANCE_CONFIG,
  GeneRarity,
  GENE_RARITY_CONFIG,
  ExpressionConditionType,
  GeneFragment,
  GeneSequence,
  BattleContext,
  GENE_FRAGMENT_TEMPLATES,
  createGeneSequence,
  findGeneFragments,
  calculatePurity,
  checkExpressionCondition,
  calculateTotalLifeSteal,
  calculateGeneStats,
  getActiveGeneEffects,
  replaceBase,
  insertBases,
  deleteBases,
  applyMutation,
  serializeGeneSequence,
  deserializeGeneSequence,
  generateRandomBase,
} from './GeneSystem';

describe('BasePair 碱基类型', () => {
  it('应有4种碱基类型', () => {
    expect(Object.keys(BasePair)).toHaveLength(4);
    expect(BasePair.ADENINE).toBe('A');
    expect(BasePair.THYMINE).toBe('T');
    expect(BasePair.GUANINE).toBe('G');
    expect(BasePair.CYTOSINE).toBe('C');
  });

  it('BASE_PAIR_CONFIG 应包含所有碱基配置', () => {
    expect(BASE_PAIR_CONFIG[BasePair.ADENINE].name).toBe('腺嘌呤');
    expect(BASE_PAIR_CONFIG[BasePair.THYMINE].name).toBe('胸腺嘧啶');
    expect(BASE_PAIR_CONFIG[BasePair.GUANINE].name).toBe('鸟嘌呤');
    expect(BASE_PAIR_CONFIG[BasePair.CYTOSINE].name).toBe('胞嘧啶');
  });

  it('每种碱基应有颜色和倾向属性', () => {
    for (const base of Object.values(BasePair)) {
      expect(BASE_PAIR_CONFIG[base].color).toBeDefined();
      expect(BASE_PAIR_CONFIG[base].tendency).toBeDefined();
    }
  });
});

describe('GeneDominance 基因显隐性', () => {
  it('应有3种显隐性类型', () => {
    expect(Object.keys(GeneDominance)).toHaveLength(3);
    expect(GeneDominance.DOMINANT).toBe('dominant');
    expect(GeneDominance.RECESSIVE).toBe('recessive');
    expect(GeneDominance.CODOMINANT).toBe('codominant');
  });

  it('GENE_DOMINANCE_CONFIG 应包含所有显隐性配置', () => {
    expect(GENE_DOMINANCE_CONFIG[GeneDominance.DOMINANT].name).toBe('显性');
    expect(GENE_DOMINANCE_CONFIG[GeneDominance.RECESSIVE].name).toBe('隐性');
    expect(GENE_DOMINANCE_CONFIG[GeneDominance.CODOMINANT].name).toBe('共显性');
  });
});

describe('GeneRarity 基因稀有度', () => {
  it('应有5种稀有度', () => {
    expect(Object.keys(GeneRarity)).toHaveLength(5);
  });

  it('GENE_RARITY_CONFIG 应有正确的倍率', () => {
    expect(GENE_RARITY_CONFIG[GeneRarity.COMMON].multiplier).toBe(1);
    expect(GENE_RARITY_CONFIG[GeneRarity.UNCOMMON].multiplier).toBe(1.2);
    expect(GENE_RARITY_CONFIG[GeneRarity.RARE].multiplier).toBe(1.5);
    expect(GENE_RARITY_CONFIG[GeneRarity.EPIC].multiplier).toBe(2);
    expect(GENE_RARITY_CONFIG[GeneRarity.LEGENDARY].multiplier).toBe(3);
  });

  it('稀有度倍率应递增', () => {
    const rarities = [GeneRarity.COMMON, GeneRarity.UNCOMMON, GeneRarity.RARE, GeneRarity.EPIC, GeneRarity.LEGENDARY];
    for (let i = 1; i < rarities.length; i++) {
      expect(GENE_RARITY_CONFIG[rarities[i]].multiplier).toBeGreaterThan(
        GENE_RARITY_CONFIG[rarities[i - 1]].multiplier
      );
    }
  });
});

describe('createGeneSequence 创建基因序列', () => {
  it('应创建指定长度的基因序列', () => {
    const sequence = createGeneSequence(12);
    expect(sequence.bases).toHaveLength(12);
    expect(sequence.unlockedSlots).toBe(12);
  });

  it('创建的序列应包含有效碱基', () => {
    const sequence = createGeneSequence(24);
    for (const base of sequence.bases) {
      expect(Object.values(BasePair)).toContain(base);
    }
  });

  it('新序列的片段列表应为空', () => {
    const sequence = createGeneSequence(12);
    expect(sequence.fragments).toEqual([]);
    expect(sequence.mutations).toEqual([]);
    expect(sequence.totalLifeSteal).toBe(0);
  });

  it('不同调用应产生不同序列', () => {
    const sequence1 = createGeneSequence(12);
    const sequence2 = createGeneSequence(12);
    expect(sequence1.bases).not.toEqual(sequence2.bases);
  });
});

describe('generateRandomBase 生成随机碱基', () => {
  it('应生成有效碱基', () => {
    for (let i = 0; i < 100; i++) {
      const base = generateRandomBase();
      expect(Object.values(BasePair)).toContain(base);
    }
  });

  it('应能生成所有类型的碱基', () => {
    const generated = new Set<BasePair>();
    for (let i = 0; i < 100; i++) {
      generated.add(generateRandomBase());
    }
    expect(generated.size).toBe(4);
  });
});

describe('calculatePurity 计算基因纯度', () => {
  it('完全匹配应返回100', () => {
    const bases = [BasePair.ADENINE, BasePair.ADENINE, BasePair.ADENINE];
    const pattern = [BasePair.ADENINE, BasePair.ADENINE, BasePair.ADENINE];
    expect(calculatePurity(bases, 0, pattern)).toBe(100);
  });

  it('部分匹配应返回正确百分比', () => {
    const bases = [BasePair.ADENINE, BasePair.THYMINE, BasePair.ADENINE];
    const pattern = [BasePair.ADENINE, BasePair.ADENINE, BasePair.ADENINE];
    expect(calculatePurity(bases, 0, pattern)).toBe(66);
  });

  it('完全不匹配应返回0', () => {
    const bases = [BasePair.THYMINE, BasePair.GUANINE, BasePair.CYTOSINE];
    const pattern = [BasePair.ADENINE, BasePair.ADENINE, BasePair.ADENINE];
    expect(calculatePurity(bases, 0, pattern)).toBe(0);
  });
});

describe('findGeneFragments 识别基因片段', () => {
  it('应识别吸血本能基因 (TATA)', () => {
    const sequence: GeneSequence = {
      bases: [BasePair.THYMINE, BasePair.ADENINE, BasePair.THYMINE, BasePair.ADENINE],
      fragments: [],
      mutations: [],
      unlockedSlots: 12,
      totalLifeSteal: 0,
    };

    const fragments = findGeneFragments(sequence);
    expect(fragments.length).toBeGreaterThan(0);
    expect(fragments.some(f => f.id === 'vampire_instinct')).toBe(true);
  });

  it('应识别狂战士基因 (AAA)', () => {
    const sequence: GeneSequence = {
      bases: [BasePair.ADENINE, BasePair.ADENINE, BasePair.ADENINE],
      fragments: [],
      mutations: [],
      unlockedSlots: 12,
      totalLifeSteal: 0,
    };

    const fragments = findGeneFragments(sequence);
    expect(fragments.some(f => f.id === 'berserker')).toBe(true);
  });

  it('应优先识别较长的基因片段', () => {
    const sequence: GeneSequence = {
      bases: [
        BasePair.THYMINE, BasePair.ADENINE, BasePair.THYMINE, BasePair.ADENINE,
        BasePair.THYMINE, BasePair.ADENINE, BasePair.THYMINE, BasePair.ADENINE,
      ],
      fragments: [],
      mutations: [],
      unlockedSlots: 12,
      totalLifeSteal: 0,
    };

    const fragments = findGeneFragments(sequence);
    expect(fragments.some(f => f.id === 'bloodline')).toBe(true);
  });

  it('无匹配时应返回空数组', () => {
    const sequence: GeneSequence = {
      bases: [BasePair.ADENINE, BasePair.GUANINE, BasePair.CYTOSINE],
      fragments: [],
      mutations: [],
      unlockedSlots: 12,
      totalLifeSteal: 0,
    };

    const fragments = findGeneFragments(sequence);
    expect(fragments).toHaveLength(0);
  });
});

describe('checkExpressionCondition 检查表达条件', () => {
  const createBattleContext = (overrides: Partial<BattleContext> = {}): BattleContext => ({
    currentHp: 100,
    maxHp: 100,
    turn: 0,
    comboCount: 0,
    damageTaken: 0,
    kills: 0,
    battleTime: 0,
    lastActionWasSkill: false,
    lastActionWasDodge: false,
    isFatalDamage: false,
    ...overrides,
  });

  it('ALWAYS 条件应始终返回true', () => {
    const fragment = GENE_FRAGMENT_TEMPLATES.find(f => f.id === 'bloodline')!;
    expect(checkExpressionCondition(fragment, createBattleContext())).toBe(true);
  });

  describe('HP_THRESHOLD 条件', () => {
    it('HP < 50% 时应触发狂战士基因', () => {
      const fragment = GENE_FRAGMENT_TEMPLATES.find(f => f.id === 'berserker')!;
      expect(checkExpressionCondition(fragment, createBattleContext({ currentHp: 40, maxHp: 100 }))).toBe(true);
      expect(checkExpressionCondition(fragment, createBattleContext({ currentHp: 60, maxHp: 100 }))).toBe(false);
    });

    it('HP > 70% 时应触发铁壁基因', () => {
      const fragment = GENE_FRAGMENT_TEMPLATES.find(f => f.id === 'iron_wall')!;
      expect(checkExpressionCondition(fragment, createBattleContext({ currentHp: 80, maxHp: 100 }))).toBe(true);
      expect(checkExpressionCondition(fragment, createBattleContext({ currentHp: 50, maxHp: 100 }))).toBe(false);
    });

    it('HP < 20% 时应触发绝境基因', () => {
      const fragment = GENE_FRAGMENT_TEMPLATES.find(f => f.id === 'desperate')!;
      expect(checkExpressionCondition(fragment, createBattleContext({ currentHp: 15, maxHp: 100 }))).toBe(true);
      expect(checkExpressionCondition(fragment, createBattleContext({ currentHp: 30, maxHp: 100 }))).toBe(false);
    });
  });

  it('COMBO 条件应在连击数达标时触发', () => {
    const fragment = GENE_FRAGMENT_TEMPLATES.find(f => f.id === 'combo_master')!;
    expect(checkExpressionCondition(fragment, createBattleContext({ comboCount: 3 }))).toBe(true);
    expect(checkExpressionCondition(fragment, createBattleContext({ comboCount: 2 }))).toBe(false);
  });

  it('HP < 70% 时应触发血祭基因', () => {
    const fragment = GENE_FRAGMENT_TEMPLATES.find(f => f.id === 'blood_sacrifice')!;
    expect(checkExpressionCondition(fragment, createBattleContext({ currentHp: 50, maxHp: 100 }))).toBe(true);
    expect(checkExpressionCondition(fragment, createBattleContext({ currentHp: 80, maxHp: 100 }))).toBe(false);
  });

  it('ON_KILL 条件应在击杀后触发', () => {
    const fragment = GENE_FRAGMENT_TEMPLATES.find(f => f.id === 'predator')!;
    expect(checkExpressionCondition(fragment, createBattleContext({ kills: 1 }))).toBe(true);
    expect(checkExpressionCondition(fragment, createBattleContext({ kills: 0 }))).toBe(false);
  });

  it('ON_FATAL_DAMAGE 条件应在受到致命伤害时触发', () => {
    const fragment = GENE_FRAGMENT_TEMPLATES.find(f => f.id === 'tenacity')!;
    expect(checkExpressionCondition(fragment, createBattleContext({ isFatalDamage: true }))).toBe(true);
    expect(checkExpressionCondition(fragment, createBattleContext({ isFatalDamage: false }))).toBe(false);
  });
});

describe('calculateTotalLifeSteal 计算生命偷取', () => {
  const createBattleContext = (overrides: Partial<BattleContext> = {}): BattleContext => ({
    currentHp: 100,
    maxHp: 100,
    turn: 0,
    comboCount: 0,
    damageTaken: 0,
    kills: 0,
    battleTime: 0,
    lastActionWasSkill: false,
    lastActionWasDodge: false,
    isFatalDamage: false,
    ...overrides,
  });

  const createMockFragment = (id: string, basePercent: number, isActive: boolean): GeneFragment => ({
    id,
    name: `Mock ${id}`,
    pattern: [BasePair.ADENINE],
    dominance: GeneDominance.DOMINANT,
    expressionCondition: { type: ExpressionConditionType.ALWAYS },
    effect: {
      type: 'life_steal',
      lifeSteal: {
        basePercent,
        triggerOn: 'all_damage',
      },
    },
    rarity: GeneRarity.COMMON,
    description: 'Mock fragment',
    instanceId: `mock_${id}`,
    startIndex: 0,
    purity: 100,
    isActive,
  });

  it('无激活片段时应返回0', () => {
    expect(calculateTotalLifeSteal([], createBattleContext())).toBe(0);
  });

  it('单个吸血基因应正确计算', () => {
    const fragment = createMockFragment('vampire', 5, true);
    fragment.purity = 0;
    const fragments = [fragment];
    expect(calculateTotalLifeSteal(fragments, createBattleContext())).toBe(5);
  });

  it('多个吸血基因应叠加', () => {
    const fragment1 = createMockFragment('vampire1', 5, true);
    fragment1.purity = 0;
    const fragment2 = createMockFragment('vampire2', 8, true);
    fragment2.purity = 0;
    const fragments = [fragment1, fragment2];
    expect(calculateTotalLifeSteal(fragments, createBattleContext())).toBe(13);
  });

  it('未激活的片段不应计入', () => {
    const fragments = [createMockFragment('vampire', 5, false)];
    expect(calculateTotalLifeSteal(fragments, createBattleContext())).toBe(0);
  });

  it('纯度应影响生命偷取效果', () => {
    const fragment = createMockFragment('vampire', 10, true);
    fragment.purity = 50;
    const fragments = [fragment];
    const result = calculateTotalLifeSteal(fragments, createBattleContext());
    expect(result).toBe(12.5);
  });

  it('总生命偷取应不超过100%', () => {
    const fragments = Array(20).fill(null).map((_, i) => 
      createMockFragment(`vampire_${i}`, 10, true)
    );
    expect(calculateTotalLifeSteal(fragments, createBattleContext())).toBe(100);
  });
});

describe('calculateGeneStats 计算基因属性', () => {
  const createBattleContext = (overrides: Partial<BattleContext> = {}): BattleContext => ({
    currentHp: 100,
    maxHp: 100,
    turn: 0,
    comboCount: 0,
    damageTaken: 0,
    kills: 0,
    battleTime: 0,
    lastActionWasSkill: false,
    lastActionWasDodge: false,
    isFatalDamage: false,
    ...overrides,
  });

  const createStatFragment = (stats: Record<string, number>, isActive: boolean): GeneFragment => ({
    id: 'stat_fragment',
    name: 'Stat Fragment',
    pattern: [BasePair.ADENINE],
    dominance: GeneDominance.DOMINANT,
    expressionCondition: { type: ExpressionConditionType.ALWAYS },
    effect: {
      type: 'stat_boost',
      stats,
    },
    rarity: GeneRarity.COMMON,
    description: 'Stat fragment',
    instanceId: 'stat_1',
    startIndex: 0,
    purity: 100,
    isActive,
  });

  it('应正确计算属性加成', () => {
    const fragment = createStatFragment({ attack: 30, defense: -10 }, true);
    fragment.purity = 0;
    const fragments = [fragment];
    const stats = calculateGeneStats(fragments, createBattleContext());
    expect(stats.attack).toBe(30);
    expect(stats.defense).toBe(-10);
  });

  it('稀有度应影响属性值', () => {
    const fragment = createStatFragment({ attack: 10 }, true);
    fragment.purity = 0;
    fragment.rarity = GeneRarity.LEGENDARY;
    const stats = calculateGeneStats([fragment], createBattleContext());
    expect(stats.attack).toBe(30);
  });

  it('未激活片段不应计入', () => {
    const fragments = [createStatFragment({ attack: 30 }, false)];
    const stats = calculateGeneStats(fragments, createBattleContext());
    expect(stats.attack).toBeUndefined();
  });
});

describe('getActiveGeneEffects 获取激活基因', () => {
  const createBattleContext = (overrides: Partial<BattleContext> = {}): BattleContext => ({
    currentHp: 100,
    maxHp: 100,
    turn: 0,
    comboCount: 0,
    damageTaken: 0,
    kills: 0,
    battleTime: 0,
    lastActionWasSkill: false,
    lastActionWasDodge: false,
    isFatalDamage: false,
    ...overrides,
  });

  it('应返回所有激活的基因', () => {
    const fragments: GeneFragment[] = [
      {
        id: 'active_1',
        name: 'Active 1',
        pattern: [BasePair.ADENINE],
        dominance: GeneDominance.DOMINANT,
        expressionCondition: { type: ExpressionConditionType.ALWAYS },
        effect: { type: 'stat_boost', stats: { attack: 10 } },
        rarity: GeneRarity.COMMON,
        description: 'Active fragment',
        instanceId: 'active_1',
        startIndex: 0,
        purity: 100,
        isActive: true,
      },
      {
        id: 'inactive_1',
        name: 'Inactive 1',
        pattern: [BasePair.ADENINE],
        dominance: GeneDominance.DOMINANT,
        expressionCondition: { type: ExpressionConditionType.ALWAYS },
        effect: { type: 'stat_boost', stats: { defense: 10 } },
        rarity: GeneRarity.COMMON,
        description: 'Inactive fragment',
        instanceId: 'inactive_1',
        startIndex: 0,
        purity: 100,
        isActive: false,
      },
    ];

    const active = getActiveGeneEffects(fragments, createBattleContext());
    expect(active).toHaveLength(1);
    expect(active[0].id).toBe('active_1');
  });

  it('冷却中的基因不应返回', () => {
    const fragments: GeneFragment[] = [
      {
        id: 'cooldown_1',
        name: 'Cooldown 1',
        pattern: [BasePair.ADENINE],
        dominance: GeneDominance.DOMINANT,
        expressionCondition: { type: ExpressionConditionType.ALWAYS },
        effect: { type: 'stat_boost', stats: { attack: 10 } },
        rarity: GeneRarity.COMMON,
        description: 'Cooldown fragment',
        instanceId: 'cooldown_1',
        startIndex: 0,
        purity: 100,
        isActive: true,
        cooldownRemaining: 30,
      },
    ];

    const active = getActiveGeneEffects(fragments, createBattleContext());
    expect(active).toHaveLength(0);
  });
});

describe('replaceBase 替换碱基', () => {
  let sequence: GeneSequence;

  beforeEach(() => {
    sequence = createGeneSequence(12);
  });

  it('应成功替换碱基', () => {
    const oldBase = sequence.bases[0];
    const newBase = oldBase === BasePair.ADENINE ? BasePair.THYMINE : BasePair.ADENINE;
    
    const result = replaceBase(sequence, 0, newBase);
    
    expect(result.success).toBe(true);
    expect(sequence.bases[0]).toBe(newBase);
    expect(sequence.mutations).toHaveLength(1);
  });

  it('无效位置应返回失败', () => {
    const result = replaceBase(sequence, -1, BasePair.ADENINE);
    expect(result.success).toBe(false);
    expect(result.message).toBe('无效的位置');
  });

  it('相同碱基应返回失败', () => {
    const result = replaceBase(sequence, 0, sequence.bases[0]);
    expect(result.success).toBe(false);
    expect(result.message).toBe('碱基相同，无需替换');
  });

  it('替换后应重新识别基因片段', () => {
    sequence.bases = [BasePair.ADENINE, BasePair.GUANINE, BasePair.CYTOSINE];
    replaceBase(sequence, 1, BasePair.ADENINE);
    replaceBase(sequence, 2, BasePair.ADENINE);
    
    expect(sequence.bases).toEqual([BasePair.ADENINE, BasePair.ADENINE, BasePair.ADENINE]);
    expect(sequence.fragments.some(f => f.id === 'berserker')).toBe(true);
  });
});

describe('insertBases 插入碱基', () => {
  let sequence: GeneSequence;

  beforeEach(() => {
    sequence = {
      bases: [BasePair.ADENINE, BasePair.ADENINE],
      fragments: [],
      mutations: [],
      unlockedSlots: 12,
      totalLifeSteal: 0,
    };
  });

  it('应成功插入碱基', () => {
    const result = insertBases(sequence, 1, [BasePair.THYMINE, BasePair.GUANINE]);
    
    expect(result.success).toBe(true);
    expect(sequence.bases).toHaveLength(4);
    expect(sequence.bases[1]).toBe(BasePair.THYMINE);
    expect(sequence.bases[2]).toBe(BasePair.GUANINE);
  });

  it('无效位置应返回失败', () => {
    const result = insertBases(sequence, -1, [BasePair.ADENINE]);
    expect(result.success).toBe(false);
  });

  it('超出空间应返回失败', () => {
    sequence.unlockedSlots = 2;
    const result = insertBases(sequence, 0, [BasePair.ADENINE]);
    expect(result.success).toBe(false);
    expect(result.message).toBe('基因序列空间不足');
  });
});

describe('deleteBases 删除碱基', () => {
  let sequence: GeneSequence;

  beforeEach(() => {
    sequence = {
      bases: [BasePair.ADENINE, BasePair.THYMINE, BasePair.GUANINE, BasePair.CYTOSINE],
      fragments: [],
      mutations: [],
      unlockedSlots: 12,
      totalLifeSteal: 0,
    };
  });

  it('应成功删除碱基', () => {
    const result = deleteBases(sequence, 1, 2);
    
    expect(result.success).toBe(true);
    expect(sequence.bases).toHaveLength(2);
    expect(sequence.bases).toEqual([BasePair.ADENINE, BasePair.CYTOSINE]);
  });

  it('无效位置应返回失败', () => {
    const result = deleteBases(sequence, 10, 1);
    expect(result.success).toBe(false);
  });
});

describe('applyMutation 应用突变', () => {
  let sequence: GeneSequence;

  beforeEach(() => {
    sequence = createGeneSequence(12);
  });

  describe('点突变', () => {
    it('应成功应用点突变', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      
      const result = applyMutation(sequence, 'point', true);
      
      expect(result.success).toBe(true);
      expect(sequence.mutations).toHaveLength(1);
      expect(sequence.mutations[0].type).toBe('point');
    });
  });

  describe('片段突变', () => {
    it('应成功应用片段突变', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      
      const result = applyMutation(sequence, 'fragment', true);
      
      expect(result.success).toBe(true);
      expect(sequence.mutations).toHaveLength(1);
    });
  });

  describe('负面突变', () => {
    it('不使用稳定剂时可能发生负面突变', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.1);
      
      const result = applyMutation(sequence, 'point', false);
      
      expect(result.success).toBe(true);
      expect(sequence.mutations[0].result).toBe('negative');
    });

    it('使用稳定剂应防止负面突变', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.1);
      
      const result = applyMutation(sequence, 'point', true);
      
      expect(result.success).toBe(true);
      expect(sequence.mutations[0].result).toBe('positive');
    });
  });
});

describe('序列化与反序列化', () => {
  it('应正确序列化和反序列化基因序列', () => {
    const original = createGeneSequence(12);
    const serialized = serializeGeneSequence(original);
    const deserialized = deserializeGeneSequence(serialized);
    
    expect(deserialized.bases).toEqual(original.bases);
    expect(deserialized.unlockedSlots).toBe(original.unlockedSlots);
  });

  it('应保留突变记录', () => {
    const sequence = createGeneSequence(12);
    const originalBase = sequence.bases[0];
    const newBase = originalBase === BasePair.ADENINE ? BasePair.THYMINE : BasePair.ADENINE;
    replaceBase(sequence, 0, newBase);
    
    const serialized = serializeGeneSequence(sequence);
    const deserialized = deserializeGeneSequence(serialized);
    
    expect(deserialized.mutations).toHaveLength(1);
    expect(deserialized.mutations[0].type).toBe('point');
  });
});

describe('GENE_FRAGMENT_TEMPLATES 基因片段模板', () => {
  it('应有足够的基因模板', () => {
    expect(GENE_FRAGMENT_TEMPLATES.length).toBeGreaterThanOrEqual(20);
  });

  it('吸血基因应有生命偷取效果', () => {
    const vampireGenes = GENE_FRAGMENT_TEMPLATES.filter(t => 
      t.effect.type === 'life_steal' || t.effect.lifeSteal
    );
    expect(vampireGenes.length).toBeGreaterThanOrEqual(5);
  });

  it('每个模板应有有效的表达条件', () => {
    for (const template of GENE_FRAGMENT_TEMPLATES) {
      expect(template.expressionCondition.type).toBeDefined();
    }
  });

  it('每个模板应有有效的稀有度', () => {
    for (const template of GENE_FRAGMENT_TEMPLATES) {
      expect(Object.values(GeneRarity)).toContain(template.rarity);
    }
  });

  it('每个模板应有有效的显隐性', () => {
    for (const template of GENE_FRAGMENT_TEMPLATES) {
      expect(Object.values(GeneDominance)).toContain(template.dominance);
    }
  });
});
