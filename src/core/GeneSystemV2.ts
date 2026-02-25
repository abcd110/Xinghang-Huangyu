export enum BasePair {
  ADENINE = 'A',
  THYMINE = 'T',
  GUANINE = 'G',
  CYTOSINE = 'C',
}

export const BASE_PAIR_CONFIG: Record<BasePair, { name: string; color: string; tendency: string }> = {
  [BasePair.ADENINE]: { name: '腺嘌呤', color: '#ef4444', tendency: '攻击' },
  [BasePair.THYMINE]: { name: '胸腺嘧啶', color: '#3b82f6', tendency: '防御' },
  [BasePair.GUANINE]: { name: '鸟嘌呤', color: '#f59e0b', tendency: '速度' },
  [BasePair.CYTOSINE]: { name: '胞嘧啶', color: '#22c55e', tendency: '生命' },
};

export const BASE_PAIR_COMPLEMENT: Record<BasePair, BasePair> = {
  [BasePair.ADENINE]: BasePair.THYMINE,
  [BasePair.THYMINE]: BasePair.ADENINE,
  [BasePair.GUANINE]: BasePair.CYTOSINE,
  [BasePair.CYTOSINE]: BasePair.GUANINE,
};

export enum ExpressionConditionType {
  ALWAYS = 'always',
  HP_THRESHOLD = 'hp_threshold',
  TURN = 'turn',
  COMBO = 'combo',
  DAMAGE_TAKEN = 'damage_taken',
  ON_KILL = 'on_kill',
  ON_FATAL_DAMAGE = 'on_fatal_damage',
  ON_DODGE = 'on_dodge',
}

export interface ExpressionCondition {
  type: ExpressionConditionType;
  value?: number;
  comparison?: '<' | '>' | '==' | '>=' | '<=';
}

export interface LifeStealConfig {
  basePercent: number;
  triggerOn: 'all_damage' | 'physical' | 'skill' | 'critical';
  maxHealPerHit?: number;
  overflowToShield?: boolean;
}

export interface GeneEffect {
  type: 'stat_boost' | 'passive' | 'trigger' | 'life_steal';
  stats?: Record<string, number>;
  ability?: string;
  duration?: number;
  cooldown?: number;
  lifeSteal?: LifeStealConfig;
}

export interface GeneFragmentTemplate {
  id: string;
  name: string;
  pattern: BasePair[];
  expressionCondition: ExpressionCondition;
  effect: GeneEffect;
  description: string;
  category: 'vampire' | 'combat' | 'survival' | 'special';
  unique?: boolean;
}

export interface GeneFragment extends GeneFragmentTemplate {
  instanceId: string;
  startIndex: number;
  endIndex: number;
  chromosomeId: string;
  isActive: boolean;
  cooldownRemaining?: number;
  unique?: boolean;
}

export interface Nucleotide {
  id: string;
  base: BasePair;
  position: number;
  modified: boolean;
}

export interface DNAStrand {
  id: string;
  type: 'sense' | 'antisense';
  nucleotides: Nucleotide[];
  length: number;
  maxLength: number;
}

export interface Chromosome {
  id: string;
  name: string;
  description: string;
  senseStrand: DNAStrand;
  antisenseStrand: DNAStrand;
  unlocked: boolean;
  unlockCondition: string;
  bonusType?: 'vampire' | 'combat' | 'survival' | 'special';
  bonusPercent: number;
  length: number;
}

export interface GeneSystemState {
  chromosomes: Chromosome[];
  activeChromosomeId: string;
  fragments: GeneFragment[];
  totalLifeSteal: number;
}

export interface BattleContext {
  currentHp: number;
  maxHp: number;
  turn: number;
  comboCount: number;
  damageTaken: number;
  kills: number;
  battleTime: number;
  lastActionWasSkill: boolean;
  lastActionWasDodge: boolean;
  isFatalDamage: boolean;
}

export const CHROMOSOME_CONFIGS: Omit<Chromosome, 'senseStrand' | 'antisenseStrand' | 'unlocked'>[] = [
  {
    id: 'chromosome_vampire',
    name: '吸血染色体',
    description: '吸血基因载体，容纳吸血类基因片段',
    unlockCondition: '初始解锁',
    bonusType: 'vampire',
    bonusPercent: 0,
    length: 60,
  },
  {
    id: 'chromosome_power',
    name: '力量染色体',
    description: '战斗基因载体，容纳战斗类基因片段',
    unlockCondition: '初始解锁',
    bonusType: 'combat',
    bonusPercent: 0,
    length: 60,
  },
  {
    id: 'chromosome_vitality',
    name: '生命染色体',
    description: '生存基因载体，容纳生存类基因片段',
    unlockCondition: '初始解锁',
    bonusType: 'survival',
    bonusPercent: 0,
    length: 60,
  },
  {
    id: 'chromosome_special',
    name: '特殊染色体',
    description: '特殊基因载体，容纳特殊类基因片段',
    unlockCondition: '初始解锁',
    bonusType: 'special',
    bonusPercent: 0,
    length: 80,
  },
];

export const GENE_EFFECT_LIMITS: Record<string, number> = {
  maxHpPercent: 50,
  attackPercent: 40,
  defensePercent: 40,
  critRate: 30,
  critDamage: 100,
  dodgeRate: 25,
  speedPercent: 30,
  lifeSteal: 25,
};

export const GENE_DIMINISHING_RETURNS = {
  firstCopy: 1.0,
  secondCopy: 0.5,
  thirdCopy: 0.25,
  fourthAndBeyond: 0.1,
};

function calculateDiminishedValue(baseValue: number, copyCount: number): number {
  const multipliers = [
    GENE_DIMINISHING_RETURNS.firstCopy,
    GENE_DIMINISHING_RETURNS.secondCopy,
    GENE_DIMINISHING_RETURNS.thirdCopy,
    GENE_DIMINISHING_RETURNS.fourthAndBeyond,
  ];

  let totalValue = 0;
  for (let i = 0; i < copyCount; i++) {
    const multiplier = i < multipliers.length ? multipliers[i] : multipliers[multipliers.length - 1];
    totalValue += baseValue * multiplier;
  }
  return totalValue;
}

export const GENE_FRAGMENT_TEMPLATES: GeneFragmentTemplate[] = [
  {
    id: 'vampire_instinct',
    name: '吸血本能',
    pattern: [BasePair.THYMINE, BasePair.ADENINE, BasePair.THYMINE, BasePair.ADENINE, BasePair.THYMINE, BasePair.ADENINE, BasePair.GUANINE, BasePair.CYTOSINE, BasePair.GUANINE, BasePair.CYTOSINE],
    expressionCondition: { type: ExpressionConditionType.ALWAYS },
    effect: {
      type: 'life_steal',
      lifeSteal: { basePercent: 5, triggerOn: 'all_damage' },
    },
    description: '生命偷取 +5%',
    category: 'vampire',
  },
  {
    id: 'blood_thirst',
    name: '嗜血狂热',
    pattern: [BasePair.ADENINE, BasePair.THYMINE, BasePair.ADENINE, BasePair.THYMINE, BasePair.ADENINE, BasePair.THYMINE, BasePair.ADENINE, BasePair.THYMINE, BasePair.GUANINE, BasePair.CYTOSINE, BasePair.GUANINE, BasePair.CYTOSINE],
    expressionCondition: { type: ExpressionConditionType.HP_THRESHOLD, comparison: '<', value: 50 },
    effect: {
      type: 'life_steal',
      lifeSteal: { basePercent: 8, triggerOn: 'all_damage' },
      stats: { attackPercent: 10 },
    },
    description: 'HP<50%时，生命偷取+8%，攻击+10% [唯一]',
    category: 'vampire',
    unique: true,
  },
  {
    id: 'bloodline',
    name: '血族血脉',
    pattern: [BasePair.GUANINE, BasePair.GUANINE, BasePair.GUANINE, BasePair.GUANINE, BasePair.CYTOSINE, BasePair.CYTOSINE, BasePair.CYTOSINE, BasePair.CYTOSINE, BasePair.THYMINE, BasePair.ADENINE, BasePair.THYMINE, BasePair.ADENINE],
    expressionCondition: { type: ExpressionConditionType.ALWAYS },
    effect: {
      type: 'life_steal',
      lifeSteal: { basePercent: 15, triggerOn: 'all_damage', overflowToShield: true },
    },
    description: '生命偷取+15%，溢出治疗转护盾 [唯一]',
    category: 'vampire',
    unique: true,
  },
  {
    id: 'berserker',
    name: '狂战士基因',
    pattern: [BasePair.ADENINE, BasePair.ADENINE, BasePair.ADENINE, BasePair.ADENINE, BasePair.ADENINE, BasePair.ADENINE, BasePair.GUANINE, BasePair.GUANINE, BasePair.GUANINE, BasePair.GUANINE, BasePair.GUANINE, BasePair.GUANINE],
    expressionCondition: { type: ExpressionConditionType.HP_THRESHOLD, comparison: '<', value: 50 },
    effect: {
      type: 'stat_boost',
      stats: { attackPercent: 30, speedPercent: 50, berserkerScaling: true },
    },
    description: 'HP<50%时，攻击+30%，攻速+50%，每降低1%HP攻击额外+1%攻速额外+0.5%（HP<20%时达到最大值） [唯一]',
    category: 'combat',
    unique: true,
  },
  {
    id: 'iron_wall',
    name: '铁壁基因',
    pattern: [BasePair.GUANINE, BasePair.GUANINE, BasePair.GUANINE, BasePair.GUANINE, BasePair.GUANINE, BasePair.GUANINE, BasePair.CYTOSINE, BasePair.CYTOSINE, BasePair.CYTOSINE, BasePair.CYTOSINE, BasePair.CYTOSINE, BasePair.CYTOSINE],
    expressionCondition: { type: ExpressionConditionType.HP_THRESHOLD, comparison: '>', value: 70 },
    effect: {
      type: 'stat_boost',
      stats: { defensePercent: 25 },
    },
    description: 'HP>70%时，防御+25% [唯一]',
    category: 'combat',
    unique: true,
  },
  {
    id: 'desperate',
    name: '绝境基因',
    pattern: [BasePair.CYTOSINE, BasePair.CYTOSINE, BasePair.CYTOSINE, BasePair.CYTOSINE, BasePair.GUANINE, BasePair.GUANINE, BasePair.GUANINE, BasePair.GUANINE, BasePair.ADENINE, BasePair.ADENINE, BasePair.ADENINE, BasePair.ADENINE],
    expressionCondition: { type: ExpressionConditionType.HP_THRESHOLD, comparison: '<', value: 20 },
    effect: {
      type: 'stat_boost',
      stats: { attackPercent: 50, defensePercent: 50, speedPercent: 50 },
      duration: 10,
    },
    description: 'HP<20%时，全属性+50% [唯一]',
    category: 'combat',
    unique: true,
  },
  {
    id: 'regeneration',
    name: '再生基因',
    pattern: [BasePair.GUANINE, BasePair.CYTOSINE, BasePair.GUANINE, BasePair.CYTOSINE, BasePair.GUANINE, BasePair.CYTOSINE, BasePair.GUANINE, BasePair.CYTOSINE, BasePair.ADENINE, BasePair.THYMINE, BasePair.ADENINE, BasePair.THYMINE],
    expressionCondition: { type: ExpressionConditionType.ALWAYS },
    effect: {
      type: 'stat_boost',
      stats: { hpRegenPercent: 1 },
    },
    description: '每秒恢复1%最大HP',
    category: 'survival',
  },
  {
    id: 'adaptation',
    name: '适应基因',
    pattern: [BasePair.ADENINE, BasePair.THYMINE, BasePair.GUANINE, BasePair.CYTOSINE, BasePair.ADENINE, BasePair.THYMINE, BasePair.GUANINE, BasePair.CYTOSINE, BasePair.CYTOSINE, BasePair.GUANINE, BasePair.CYTOSINE, BasePair.GUANINE],
    expressionCondition: { type: ExpressionConditionType.ALWAYS },
    effect: {
      type: 'stat_boost',
      stats: { defensePercent: 15, maxHpPercent: 10 },
    },
    description: '防御+15%，生命+10%',
    category: 'survival',
  },
  {
    id: 'tenacity',
    name: '坚韧基因',
    pattern: [BasePair.CYTOSINE, BasePair.CYTOSINE, BasePair.CYTOSINE, BasePair.CYTOSINE, BasePair.CYTOSINE, BasePair.CYTOSINE, BasePair.CYTOSINE, BasePair.CYTOSINE, BasePair.GUANINE, BasePair.GUANINE, BasePair.GUANINE, BasePair.GUANINE],
    expressionCondition: { type: ExpressionConditionType.ON_FATAL_DAMAGE },
    effect: {
      type: 'stat_boost',
      stats: { surviveFatal: 1, healOnFatal: 100 },
    },
    description: '受到致命伤害时免疫死亡，HP恢复到100%（冷却60秒） [唯一]',
    category: 'survival',
    cooldown: 60,
    unique: true,
  },
  {
    id: 'endurance',
    name: '耐力基因',
    pattern: [BasePair.ADENINE, BasePair.ADENINE, BasePair.ADENINE, BasePair.ADENINE, BasePair.GUANINE, BasePair.GUANINE, BasePair.GUANINE, BasePair.GUANINE, BasePair.CYTOSINE, BasePair.CYTOSINE, BasePair.CYTOSINE, BasePair.CYTOSINE],
    expressionCondition: { type: ExpressionConditionType.ALWAYS },
    effect: {
      type: 'stat_boost',
      stats: { maxHpPercent: 15 },
    },
    description: '生命+15%',
    category: 'survival',
  },
  {
    id: 'survival',
    name: '生存基因',
    pattern: [BasePair.CYTOSINE, BasePair.ADENINE, BasePair.CYTOSINE, BasePair.ADENINE, BasePair.GUANINE, BasePair.CYTOSINE, BasePair.GUANINE, BasePair.CYTOSINE, BasePair.ADENINE, BasePair.THYMINE, BasePair.ADENINE, BasePair.THYMINE],
    expressionCondition: { type: ExpressionConditionType.HP_THRESHOLD, comparison: '<', value: 50 },
    effect: {
      type: 'stat_boost',
      stats: { defensePercent: 30, maxHpPercent: 20 },
    },
    description: 'HP<50%时，防御+30%，生命+20% [唯一]',
    category: 'survival',
    unique: true,
  },
  {
    id: 'foresight',
    name: '预知基因',
    pattern: [BasePair.ADENINE, BasePair.CYTOSINE, BasePair.GUANINE, BasePair.THYMINE, BasePair.THYMINE, BasePair.ADENINE, BasePair.CYTOSINE, BasePair.GUANINE, BasePair.GUANINE, BasePair.CYTOSINE, BasePair.ADENINE, BasePair.THYMINE, BasePair.THYMINE, BasePair.ADENINE, BasePair.CYTOSINE, BasePair.GUANINE],
    expressionCondition: { type: ExpressionConditionType.ALWAYS },
    effect: {
      type: 'stat_boost',
      stats: { critRate: 10, critDamage: 20 },
    },
    description: '会心+10，暴击伤害+20%',
    category: 'special',
  },
  {
    id: 'swiftness',
    name: '迅捷基因',
    pattern: [BasePair.THYMINE, BasePair.GUANINE, BasePair.THYMINE, BasePair.GUANINE, BasePair.THYMINE, BasePair.GUANINE, BasePair.THYMINE, BasePair.GUANINE, BasePair.ADENINE, BasePair.CYTOSINE, BasePair.ADENINE, BasePair.CYTOSINE, BasePair.ADENINE, BasePair.CYTOSINE, BasePair.ADENINE, BasePair.CYTOSINE],
    expressionCondition: { type: ExpressionConditionType.ALWAYS },
    effect: {
      type: 'stat_boost',
      stats: { speedPercent: 30, dodgeRate: 5 },
    },
    description: '攻速+30%，闪避+5%',
    category: 'special',
  },
  {
    id: 'luck',
    name: '幸运基因',
    pattern: [BasePair.ADENINE, BasePair.CYTOSINE, BasePair.GUANINE, BasePair.THYMINE, BasePair.ADENINE, BasePair.CYTOSINE, BasePair.GUANINE, BasePair.THYMINE, BasePair.GUANINE, BasePair.CYTOSINE, BasePair.ADENINE, BasePair.THYMINE],
    expressionCondition: { type: ExpressionConditionType.ALWAYS },
    effect: {
      type: 'stat_boost',
      stats: { critRate: 15, critDamage: 40 },
    },
    description: '会心+15，暴击伤害+40%',
    category: 'special',
  },
  {
    id: 'phantom',
    name: '幻影基因',
    pattern: [BasePair.GUANINE, BasePair.CYTOSINE, BasePair.GUANINE, BasePair.CYTOSINE, BasePair.GUANINE, BasePair.CYTOSINE, BasePair.GUANINE, BasePair.CYTOSINE, BasePair.THYMINE, BasePair.ADENINE, BasePair.THYMINE, BasePair.ADENINE, BasePair.THYMINE, BasePair.ADENINE, BasePair.THYMINE, BasePair.ADENINE],
    expressionCondition: { type: ExpressionConditionType.HP_THRESHOLD, comparison: '<', value: 40 },
    effect: {
      type: 'stat_boost',
      stats: { dodgeRate: 20, speedPercent: 20 },
    },
    description: 'HP<40%时，闪避+20%，攻速+20% [唯一]',
    category: 'special',
    unique: true,
  },
  {
    id: 'evolution',
    name: '进化基因',
    pattern: [BasePair.ADENINE, BasePair.THYMINE, BasePair.GUANINE, BasePair.CYTOSINE, BasePair.CYTOSINE, BasePair.GUANINE, BasePair.THYMINE, BasePair.ADENINE, BasePair.ADENINE, BasePair.THYMINE, BasePair.GUANINE, BasePair.CYTOSINE, BasePair.CYTOSINE, BasePair.GUANINE, BasePair.THYMINE, BasePair.ADENINE],
    expressionCondition: { type: ExpressionConditionType.ALWAYS },
    effect: {
      type: 'stat_boost',
      stats: { attackPercent: 25, defensePercent: 25, maxHpPercent: 25, critRate: 5, dodgeRate: 5, critDamage: 25, speedPercent: 25 },
    },
    description: '攻击+25%，防御+25%，生命+25%，会心+5，闪避+5，暴击伤害+25%，攻速+25%',
    category: 'special',
  },
];

let nucleotideIdCounter = 0;
let fragmentIdCounter = 0;

export function generateNucleotideId(): string {
  return `nucleotide_${++nucleotideIdCounter}_${Date.now()}`;
}

export function generateFragmentId(): string {
  return `fragment_${++fragmentIdCounter}_${Date.now()}`;
}

export function getComplementBase(base: BasePair): BasePair {
  return BASE_PAIR_COMPLEMENT[base];
}

export function createNucleotide(base: BasePair, position: number): Nucleotide {
  return {
    id: generateNucleotideId(),
    base,
    position,
    modified: false,
  };
}

export function createDNAStrand(type: 'sense' | 'antisense', length: number): DNAStrand {
  const nucleotides: Nucleotide[] = [];
  const bases = [BasePair.ADENINE, BasePair.THYMINE, BasePair.GUANINE, BasePair.CYTOSINE];

  for (let i = 0; i < length; i++) {
    const randomBase = bases[Math.floor(Math.random() * bases.length)];
    nucleotides.push(createNucleotide(randomBase, i));
  }

  return {
    id: `strand_${type}_${Date.now()}`,
    type,
    nucleotides,
    length,
    maxLength: length,
  };
}

export function createAntisenseStrand(senseStrand: DNAStrand): DNAStrand {
  const nucleotides: Nucleotide[] = [];

  for (let i = 0; i < senseStrand.nucleotides.length; i++) {
    const complementBase = getComplementBase(senseStrand.nucleotides[i].base);
    nucleotides.push(createNucleotide(complementBase, i));
  }

  return {
    id: `strand_antisense_${Date.now()}`,
    type: 'antisense',
    nucleotides,
    length: senseStrand.length,
    maxLength: senseStrand.maxLength,
  };
}

export function createChromosome(config: typeof CHROMOSOME_CONFIGS[0], unlocked: boolean = false): Chromosome {
  const length = config.length || 60;
  const senseStrand = createDNAStrand('sense', length);
  const antisenseStrand = createAntisenseStrand(senseStrand);

  return {
    id: config.id,
    name: config.name,
    description: config.description,
    senseStrand,
    antisenseStrand,
    unlocked,
    unlockCondition: config.unlockCondition,
    bonusType: config.bonusType,
    bonusPercent: config.bonusPercent,
    length,
  };
}

export function createGeneSystemState(): GeneSystemState {
  const chromosomes: Chromosome[] = [];

  for (let i = 0; i < CHROMOSOME_CONFIGS.length; i++) {
    const chromosomeConfig = CHROMOSOME_CONFIGS[i];
    chromosomes.push(createChromosome(chromosomeConfig, true));
  }

  return {
    chromosomes,
    activeChromosomeId: chromosomes[0].id,
    fragments: [],
    totalLifeSteal: 0,
  };
}

export function findGeneFragments(chromosome: Chromosome): GeneFragment[] {
  const fragments: GeneFragment[] = [];
  const senseBases = chromosome.senseStrand.nucleotides.map(n => n.base);

  const chromosomeType = chromosome.bonusType;

  for (const template of GENE_FRAGMENT_TEMPLATES) {
    if (template.category !== chromosomeType) continue;

    const pattern = template.pattern;
    const patternStr = pattern.join('');
    const senseStr = senseBases.join('');

    let searchPos = 0;
    while (searchPos <= senseStr.length - patternStr.length) {
      const foundIndex = senseStr.indexOf(patternStr, searchPos);
      if (foundIndex === -1) break;

      fragments.push({
        ...template,
        instanceId: generateFragmentId(),
        startIndex: foundIndex,
        endIndex: foundIndex + pattern.length - 1,
        chromosomeId: chromosome.id,
        isActive: true,
      });

      searchPos = foundIndex + 1;
    }
  }

  return fragments;
}

export function checkExpressionCondition(fragment: GeneFragment, context: BattleContext): boolean {
  const condition = fragment.expressionCondition;

  switch (condition.type) {
    case ExpressionConditionType.ALWAYS:
      return true;

    case ExpressionConditionType.HP_THRESHOLD:
      const hpPercent = (context.currentHp / context.maxHp) * 100;
      const comparison = condition.comparison || '<';
      const value = condition.value || 50;

      switch (comparison) {
        case '<': return hpPercent < value;
        case '>': return hpPercent > value;
        case '<=': return hpPercent <= value;
        case '>=': return hpPercent >= value;
        case '==': return hpPercent === value;
        default: return false;
      }

    case ExpressionConditionType.COMBO:
      return context.comboCount >= (condition.value || 3);

    case ExpressionConditionType.ON_KILL:
      return context.kills > 0;

    case ExpressionConditionType.ON_FATAL_DAMAGE:
      return context.isFatalDamage;

    case ExpressionConditionType.ON_DODGE:
      return context.lastActionWasDodge;

    case ExpressionConditionType.TURN:
      return context.turn >= (condition.value || 1);

    case ExpressionConditionType.DAMAGE_TAKEN:
      return context.damageTaken >= (condition.value || 100);

    default:
      return false;
  }
}

export function calculateTotalLifeSteal(fragments: GeneFragment[], context: BattleContext, chromosomeBonus?: { type: string; percent: number }): number {
  const lifeStealFragments: { id: string; basePercent: number; category: string; unique?: boolean }[] = [];

  for (const fragment of fragments) {
    if (!fragment.isActive) continue;
    if (fragment.cooldownRemaining && fragment.cooldownRemaining > 0) continue;
    if (!checkExpressionCondition(fragment, context)) continue;

    if (fragment.effect.lifeSteal) {
      lifeStealFragments.push({
        id: fragment.id,
        basePercent: fragment.effect.lifeSteal.basePercent,
        category: fragment.category,
        unique: fragment.unique,
      });
    }
  }

  const groupedByGeneId: Record<string, { values: number[]; category: string; unique?: boolean }> = {};
  for (const f of lifeStealFragments) {
    if (!groupedByGeneId[f.id]) groupedByGeneId[f.id] = { values: [], category: f.category, unique: f.unique };
    groupedByGeneId[f.id].values.push(f.basePercent);
  }

  let totalLifeSteal = 0;
  for (const [geneId, data] of Object.entries(groupedByGeneId)) {
    const baseValue = data.values[0] || 0;
    const copyCount = data.values.length;

    let chromosomeMultiplier = 1;
    if (chromosomeBonus && data.category === chromosomeBonus.type) {
      chromosomeMultiplier = (1 + chromosomeBonus.percent / 100);
    }

    let geneValue: number;
    if (data.unique) {
      geneValue = baseValue;
    } else {
      geneValue = calculateDiminishedValue(baseValue, copyCount);
    }

    totalLifeSteal += geneValue * chromosomeMultiplier;
  }

  const maxLifeSteal = GENE_EFFECT_LIMITS.lifeSteal || 25;
  return Math.min(maxLifeSteal, totalLifeSteal);
}

export function calculateGeneStats(fragments: GeneFragment[], context: BattleContext, chromosomeBonus?: { type: string; percent: number }): Record<string, number> {
  const activeFragments = fragments.filter(fragment => {
    if (!fragment.isActive) return false;
    if (fragment.cooldownRemaining && fragment.cooldownRemaining > 0) return false;
    return checkExpressionCondition(fragment, context);
  });

  const geneIdCounts: Record<string, number> = {};
  const geneInfo: Record<string, { stats: Record<string, number>; category: string; unique?: boolean }> = {};

  for (const fragment of activeFragments) {
    if (fragment.effect.stats) {
      geneIdCounts[fragment.id] = (geneIdCounts[fragment.id] || 0) + 1;
      if (!geneInfo[fragment.id]) {
        geneInfo[fragment.id] = {
          stats: fragment.effect.stats,
          category: fragment.category,
          unique: fragment.unique,
        };
      }
    }
  }

  const stats: Record<string, number> = {};
  const hpPercent = context.maxHp > 0 ? (context.currentHp / context.maxHp) * 100 : 100;

  for (const [geneId, count] of Object.entries(geneIdCounts)) {
    const info = geneInfo[geneId];
    if (!info) continue;

    let chromosomeMultiplier = 1;
    if (chromosomeBonus && info.category === chromosomeBonus.type) {
      chromosomeMultiplier = (1 + chromosomeBonus.percent / 100);
    }

    for (const [stat, value] of Object.entries(info.stats)) {
      let finalValue: number;

      if (stat === 'berserkerScaling') continue;

      if (info.unique) {
        finalValue = value;
      } else {
        finalValue = calculateDiminishedValue(value, count);
      }

      if (info.stats.berserkerScaling && hpPercent < 50) {
        const hpBelow50 = Math.max(0, 50 - Math.max(20, hpPercent));
        if (stat === 'attackPercent') {
          finalValue += hpBelow50 * 1;
        } else if (stat === 'speedPercent') {
          finalValue += hpBelow50 * 0.5;
        }
      }

      stats[stat] = (stats[stat] || 0) + finalValue * chromosomeMultiplier;
    }
  }

  for (const [stat, value] of Object.entries(stats)) {
    const limit = GENE_EFFECT_LIMITS[stat];
    if (limit !== undefined) {
      stats[stat] = Math.min(limit, value);
    }
  }

  return stats;
}

export function getActiveGeneEffects(fragments: GeneFragment[], context: BattleContext): GeneFragment[] {
  return fragments.filter(fragment => {
    if (!fragment.isActive) return false;
    if (fragment.cooldownRemaining && fragment.cooldownRemaining > 0) return false;
    return checkExpressionCondition(fragment, context);
  });
}

export function hasOverflowToShield(fragments: GeneFragment[], context: BattleContext): boolean {
  for (const fragment of fragments) {
    if (!fragment.isActive) continue;
    if (fragment.cooldownRemaining && fragment.cooldownRemaining > 0) continue;
    if (!checkExpressionCondition(fragment, context)) continue;

    if (fragment.effect.lifeSteal?.overflowToShield) {
      return true;
    }
  }
  return false;
}

export function checkSurviveFatal(fragments: GeneFragment[], context: BattleContext): { canSurvive: boolean; healPercent: number; instanceId?: string; cooldown?: number } {
  for (const fragment of fragments) {
    if (!fragment.isActive) continue;
    if (fragment.cooldownRemaining && fragment.cooldownRemaining > 0) continue;
    if (!checkExpressionCondition(fragment, context)) continue;

    if (fragment.effect.stats?.surviveFatal) {
      const healPercent = fragment.effect.stats.healOnFatal || 0;
      return {
        canSurvive: true,
        healPercent,
        instanceId: fragment.instanceId,
        cooldown: fragment.cooldown || 0,
      };
    }
  }
  return { canSurvive: false, healPercent: 0 };
}

export function setFragmentCooldown(fragments: GeneFragment[], instanceId: string, cooldown: number): void {
  const fragment = fragments.find(f => f.instanceId === instanceId);
  if (fragment) {
    fragment.cooldownRemaining = cooldown;
  }
}

export function resetAllCooldowns(fragments: GeneFragment[]): void {
  for (const fragment of fragments) {
    fragment.cooldownRemaining = 0;
  }
}

export function replaceNucleotide(
  chromosome: Chromosome,
  position: number,
  newBase: BasePair
): { success: boolean; message: string } {
  if (position < 0 || position >= chromosome.senseStrand.nucleotides.length) {
    return { success: false, message: '无效的位置' };
  }

  const oldBase = chromosome.senseStrand.nucleotides[position].base;
  if (oldBase === newBase) {
    return { success: false, message: '碱基相同，无需替换' };
  }

  chromosome.senseStrand.nucleotides[position].base = newBase;
  chromosome.senseStrand.nucleotides[position].modified = true;

  chromosome.antisenseStrand.nucleotides[position].base = getComplementBase(newBase);
  chromosome.antisenseStrand.nucleotides[position].modified = true;

  return { success: true, message: `位置${position + 1}的碱基已从${oldBase}替换为${newBase}` };
}

export function calculateIntegrity(chromosome: Chromosome): number {
  let matchedPairs = 0;
  const totalPairs = chromosome.senseStrand.nucleotides.length;

  for (let i = 0; i < totalPairs; i++) {
    const senseBase = chromosome.senseStrand.nucleotides[i].base;
    const antisenseBase = chromosome.antisenseStrand.nucleotides[i].base;

    if (getComplementBase(senseBase) === antisenseBase) {
      matchedPairs++;
    }
  }

  return Math.round((matchedPairs / totalPairs) * 100);
}

export function serializeGeneSystemState(state: GeneSystemState): string {
  return JSON.stringify(state);
}

export function deserializeGeneSystemState(data: string): GeneSystemState {
  const parsed = JSON.parse(data);

  if (parsed.chromosomes && Array.isArray(parsed.chromosomes)) {
    parsed.chromosomes = parsed.chromosomes.map((c: Chromosome) => {
      if (c.senseStrand && c.senseStrand.nucleotides) {
        c.senseStrand.nucleotides = c.senseStrand.nucleotides.map((n: Nucleotide) => ({
          ...n,
          base: n.base as BasePair,
        }));
      }
      if (c.antisenseStrand && c.antisenseStrand.nucleotides) {
        c.antisenseStrand.nucleotides = c.antisenseStrand.nucleotides.map((n: Nucleotide) => ({
          ...n,
          base: n.base as BasePair,
        }));
      }
      return c;
    });
  }

  while (parsed.chromosomes.length < CHROMOSOME_CONFIGS.length) {
    const missingIndex = parsed.chromosomes.length;
    const chromosomeConfig = CHROMOSOME_CONFIGS[missingIndex];
    parsed.chromosomes.push(createChromosome(chromosomeConfig, true));
  }

  parsed.chromosomes.forEach((c: Chromosome, index: number) => {
    const config = CHROMOSOME_CONFIGS[index];
    if (config && c.length !== config.length) {
      const newLength = config.length || 60;
      if (c.senseStrand.nucleotides.length < newLength) {
        const additionalNucleotides: Nucleotide[] = [];
        for (let i = c.senseStrand.nucleotides.length; i < newLength; i++) {
          const bases = [BasePair.ADENINE, BasePair.THYMINE, BasePair.GUANINE, BasePair.CYTOSINE];
          const randomBase = bases[Math.floor(Math.random() * bases.length)];
          additionalNucleotides.push(createNucleotide(randomBase, i));
        }
        c.senseStrand.nucleotides.push(...additionalNucleotides);
        const antisenseAdditional = additionalNucleotides.map((n, i) =>
          createNucleotide(getComplementBase(n.base), c.antisenseStrand.nucleotides.length + i)
        );
        c.antisenseStrand.nucleotides.push(...antisenseAdditional);
      }
      c.length = newLength;
      c.senseStrand.length = newLength;
      c.antisenseStrand.length = newLength;
    }
    c.unlocked = true;
    c.bonusType = config?.bonusType;
    c.bonusPercent = config?.bonusPercent ?? 0;
  });

  // 反序列化后重新识别基因片段
  const allFragments: GeneFragment[] = [];
  for (const chromosome of parsed.chromosomes) {
    const fragments = findGeneFragments(chromosome);
    allFragments.push(...fragments);
  }
  parsed.fragments = allFragments;

  return parsed as GeneSystemState;
}
