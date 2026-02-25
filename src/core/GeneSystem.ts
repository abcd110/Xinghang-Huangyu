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

export enum GeneDominance {
  DOMINANT = 'dominant',
  RECESSIVE = 'recessive',
  CODOMINANT = 'codominant',
}

export const GENE_DOMINANCE_CONFIG: Record<GeneDominance, { name: string; description: string }> = {
  [GeneDominance.DOMINANT]: { name: '显性', description: '总是表达' },
  [GeneDominance.RECESSIVE]: { name: '隐性', description: '需要双份才表达' },
  [GeneDominance.CODOMINANT]: { name: '共显性', description: '同时表达两种效果' },
};

export enum GeneRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

export const GENE_RARITY_CONFIG: Record<GeneRarity, { name: string; color: string; multiplier: number }> = {
  [GeneRarity.COMMON]: { name: '普通', color: '#9ca3af', multiplier: 1 },
  [GeneRarity.UNCOMMON]: { name: '优秀', color: '#22c55e', multiplier: 1.2 },
  [GeneRarity.RARE]: { name: '稀有', color: '#3b82f6', multiplier: 1.5 },
  [GeneRarity.EPIC]: { name: '史诗', color: '#a855f7', multiplier: 2 },
  [GeneRarity.LEGENDARY]: { name: '传说', color: '#f59e0b', multiplier: 3 },
};

export enum ExpressionConditionType {
  ALWAYS = 'always',
  HP_THRESHOLD = 'hp_threshold',
  TURN = 'turn',
  COMBO = 'combo',
  DAMAGE_TAKEN = 'damage_taken',
  ON_KILL = 'on_kill',
  TIME = 'time',
  ON_DAMAGE_DEALT = 'on_damage_dealt',
  ON_SKILL_USE = 'on_skill_use',
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
  bonusOnCondition?: {
    condition: string;
    bonusPercent: number;
  };
}

export interface GeneEffect {
  type: 'stat_boost' | 'special_ability' | 'passive' | 'trigger' | 'life_steal';
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
  dominance: GeneDominance;
  expressionCondition: ExpressionCondition;
  effect: GeneEffect;
  rarity: GeneRarity;
  description: string;
}

export interface GeneFragment extends GeneFragmentTemplate {
  instanceId: string;
  startIndex: number;
  purity: number;
  isActive: boolean;
  cooldownRemaining?: number;
}

export interface MutationRecord {
  timestamp: number;
  type: 'point' | 'insertion' | 'deletion' | 'inversion';
  position: number;
  oldValue: BasePair | BasePair[];
  newValue: BasePair | BasePair[];
  result: 'positive' | 'negative' | 'neutral';
}

export interface GeneSequence {
  bases: BasePair[];
  fragments: GeneFragment[];
  mutations: MutationRecord[];
  unlockedSlots: number;
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

export const GENE_FRAGMENT_TEMPLATES: GeneFragmentTemplate[] = [
  {
    id: 'vampire_instinct',
    name: '吸血本能',
    pattern: [BasePair.THYMINE, BasePair.ADENINE, BasePair.THYMINE, BasePair.ADENINE],
    dominance: GeneDominance.DOMINANT,
    expressionCondition: { type: ExpressionConditionType.ON_DAMAGE_DEALT },
    effect: {
      type: 'life_steal',
      lifeSteal: {
        basePercent: 5,
        triggerOn: 'all_damage',
      },
    },
    rarity: GeneRarity.COMMON,
    description: '造成伤害时，恢复造成伤害的5%作为生命值',
  },
  {
    id: 'blood_frenzy',
    name: '嗜血狂热',
    pattern: [BasePair.THYMINE, BasePair.ADENINE, BasePair.THYMINE, BasePair.ADENINE, BasePair.THYMINE, BasePair.ADENINE],
    dominance: GeneDominance.DOMINANT,
    expressionCondition: { type: ExpressionConditionType.HP_THRESHOLD, comparison: '<', value: 50 },
    effect: {
      type: 'life_steal',
      lifeSteal: {
        basePercent: 8,
        triggerOn: 'all_damage',
      },
      stats: { attack: 10 },
    },
    rarity: GeneRarity.UNCOMMON,
    description: 'HP低于50%时，生命偷取+8%，攻击+10%',
  },
  {
    id: 'bloodline',
    name: '血族血脉',
    pattern: [BasePair.THYMINE, BasePair.ADENINE, BasePair.THYMINE, BasePair.ADENINE, BasePair.THYMINE, BasePair.ADENINE, BasePair.THYMINE, BasePair.ADENINE],
    dominance: GeneDominance.RECESSIVE,
    expressionCondition: { type: ExpressionConditionType.ALWAYS },
    effect: {
      type: 'life_steal',
      lifeSteal: {
        basePercent: 15,
        triggerOn: 'all_damage',
        overflowToShield: true,
      },
    },
    rarity: GeneRarity.LEGENDARY,
    description: '生命偷取+15%，溢出的治疗量转化为护盾（需要双份表达）',
  },
  {
    id: 'predator',
    name: '猎食者',
    pattern: [BasePair.ADENINE, BasePair.THYMINE, BasePair.ADENINE, BasePair.THYMINE],
    dominance: GeneDominance.DOMINANT,
    expressionCondition: { type: ExpressionConditionType.ON_KILL },
    effect: {
      type: 'life_steal',
      lifeSteal: {
        basePercent: 20,
        triggerOn: 'all_damage',
      },
      duration: 5,
    },
    rarity: GeneRarity.RARE,
    description: '击杀敌人后，生命偷取+20%，持续5秒',
  },
  {
    id: 'blood_thirst',
    name: '血之渴望',
    pattern: [BasePair.THYMINE, BasePair.THYMINE, BasePair.THYMINE, BasePair.ADENINE, BasePair.THYMINE, BasePair.ADENINE],
    dominance: GeneDominance.CODOMINANT,
    expressionCondition: { type: ExpressionConditionType.COMBO, value: 3 },
    effect: {
      type: 'life_steal',
      lifeSteal: {
        basePercent: 50,
        triggerOn: 'all_damage',
      },
      duration: 1,
    },
    rarity: GeneRarity.EPIC,
    description: '连续攻击3次后，下次攻击生命偷取+50%',
  },
  {
    id: 'blood_sacrifice',
    name: '血祭',
    pattern: [BasePair.CYTOSINE, BasePair.ADENINE, BasePair.THYMINE, BasePair.ADENINE],
    dominance: GeneDominance.RECESSIVE,
    expressionCondition: { type: ExpressionConditionType.HP_THRESHOLD, comparison: '<', value: 70 },
    effect: {
      type: 'life_steal',
      lifeSteal: {
        basePercent: 12,
        triggerOn: 'all_damage',
      },
      stats: { critDamage: 30 },
    },
    rarity: GeneRarity.RARE,
    description: 'HP低于70%时，生命偷取+12%，暴击伤害+30%',
  },
  {
    id: 'blood_rage',
    name: '血怒',
    pattern: [BasePair.ADENINE, BasePair.ADENINE, BasePair.THYMINE, BasePair.ADENINE, BasePair.ADENINE],
    dominance: GeneDominance.RECESSIVE,
    expressionCondition: { type: ExpressionConditionType.HP_THRESHOLD, comparison: '<', value: 30 },
    effect: {
      type: 'life_steal',
      lifeSteal: {
        basePercent: 25,
        triggerOn: 'all_damage',
      },
      stats: { critRate: 15, attack: 20 },
    },
    rarity: GeneRarity.EPIC,
    description: 'HP低于30%时，生命偷取+25%，暴击率+15%，攻击+20%',
  },
  {
    id: 'immortal_blood',
    name: '不朽血脉',
    pattern: [BasePair.THYMINE, BasePair.ADENINE, BasePair.THYMINE, BasePair.ADENINE, BasePair.THYMINE, BasePair.ADENINE, BasePair.THYMINE, BasePair.ADENINE, BasePair.THYMINE, BasePair.ADENINE, BasePair.THYMINE, BasePair.ADENINE],
    dominance: GeneDominance.RECESSIVE,
    expressionCondition: { type: ExpressionConditionType.ON_FATAL_DAMAGE },
    effect: {
      type: 'special_ability',
      ability: 'immortal_blood',
      lifeSteal: {
        basePercent: 30,
        triggerOn: 'all_damage',
      },
    },
    rarity: GeneRarity.LEGENDARY,
    cooldown: 60,
    description: '受到致命伤害时免疫死亡，恢复30%HP，冷却60秒',
  },
  {
    id: 'berserker',
    name: '狂战士基因',
    pattern: [BasePair.ADENINE, BasePair.ADENINE, BasePair.ADENINE],
    dominance: GeneDominance.DOMINANT,
    expressionCondition: { type: ExpressionConditionType.HP_THRESHOLD, comparison: '<', value: 50 },
    effect: {
      type: 'stat_boost',
      stats: { attack: 30, defense: -10 },
      duration: -1,
    },
    rarity: GeneRarity.COMMON,
    description: 'HP低于50%时，攻击力提升30%，防御降低10%',
  },
  {
    id: 'iron_wall',
    name: '铁壁基因',
    pattern: [BasePair.GUANINE, BasePair.GUANINE, BasePair.GUANINE],
    dominance: GeneDominance.DOMINANT,
    expressionCondition: { type: ExpressionConditionType.HP_THRESHOLD, comparison: '>', value: 70 },
    effect: {
      type: 'stat_boost',
      stats: { defense: 25 },
    },
    rarity: GeneRarity.COMMON,
    description: 'HP高于70%时，防御力提升25%',
  },
  {
    id: 'desperate',
    name: '绝境基因',
    pattern: [BasePair.ADENINE, BasePair.THYMINE, BasePair.ADENINE, BasePair.THYMINE],
    dominance: GeneDominance.RECESSIVE,
    expressionCondition: { type: ExpressionConditionType.HP_THRESHOLD, comparison: '<', value: 20 },
    effect: {
      type: 'stat_boost',
      stats: { attack: 50, defense: 50, speed: 50 },
      duration: 10,
    },
    rarity: GeneRarity.LEGENDARY,
    description: 'HP低于20%时，全属性提升50%，持续10秒（需要双份表达）',
  },
  {
    id: 'combo_master',
    name: '连击基因',
    pattern: [BasePair.ADENINE, BasePair.THYMINE, BasePair.ADENINE, BasePair.THYMINE, BasePair.ADENINE, BasePair.THYMINE],
    dominance: GeneDominance.CODOMINANT,
    expressionCondition: { type: ExpressionConditionType.COMBO, value: 3 },
    effect: {
      type: 'trigger',
      ability: 'guaranteed_crit',
      duration: 1,
    },
    rarity: GeneRarity.RARE,
    description: '连续攻击3次后，下次攻击必定暴击',
  },
  {
    id: 'evasion',
    name: '闪避基因',
    pattern: [BasePair.GUANINE, BasePair.CYTOSINE, BasePair.GUANINE, BasePair.CYTOSINE],
    dominance: GeneDominance.DOMINANT,
    expressionCondition: { type: ExpressionConditionType.ON_DAMAGE_DEALT },
    effect: {
      type: 'passive',
      stats: { dodge: 15 },
    },
    rarity: GeneRarity.UNCOMMON,
    description: '被攻击时，15%概率完全闪避',
  },
  {
    id: 'counter',
    name: '反击基因',
    pattern: [BasePair.THYMINE, BasePair.GUANINE, BasePair.THYMINE, BasePair.GUANINE],
    dominance: GeneDominance.RECESSIVE,
    expressionCondition: { type: ExpressionConditionType.ON_DODGE },
    effect: {
      type: 'trigger',
      ability: 'counter_attack',
      stats: { counterDamage: 150 },
    },
    rarity: GeneRarity.RARE,
    description: '闪避成功后，立即反击造成150%伤害',
  },
  {
    id: 'frenzy',
    name: '狂暴基因',
    pattern: [BasePair.ADENINE, BasePair.ADENINE, BasePair.ADENINE, BasePair.ADENINE, BasePair.ADENINE],
    dominance: GeneDominance.RECESSIVE,
    expressionCondition: { type: ExpressionConditionType.DAMAGE_TAKEN, value: 5 },
    effect: {
      type: 'stat_boost',
      stats: { attackSpeed: 50 },
      duration: 5,
    },
    rarity: GeneRarity.EPIC,
    description: '连续受击5次后，攻击速度+50%，持续5秒',
  },
  {
    id: 'regeneration',
    name: '再生基因',
    pattern: [BasePair.GUANINE, BasePair.CYTOSINE, BasePair.GUANINE, BasePair.CYTOSINE],
    dominance: GeneDominance.DOMINANT,
    expressionCondition: { type: ExpressionConditionType.TURN, value: 1 },
    effect: {
      type: 'passive',
      stats: { hpRegen: 2 },
    },
    rarity: GeneRarity.COMMON,
    description: '每回合恢复2%最大HP',
  },
  {
    id: 'adaptation',
    name: '适应基因',
    pattern: [BasePair.ADENINE, BasePair.THYMINE, BasePair.GUANINE, BasePair.CYTOSINE],
    dominance: GeneDominance.DOMINANT,
    expressionCondition: { type: ExpressionConditionType.ALWAYS },
    effect: {
      type: 'stat_boost',
      stats: { defense: 15, hp: 10 },
    },
    rarity: GeneRarity.UNCOMMON,
    description: '防御+15%，生命+10%',
  },
  {
    id: 'tenacity',
    name: '坚韧基因',
    pattern: [BasePair.CYTOSINE, BasePair.CYTOSINE, BasePair.CYTOSINE, BasePair.CYTOSINE],
    dominance: GeneDominance.RECESSIVE,
    expressionCondition: { type: ExpressionConditionType.ON_FATAL_DAMAGE },
    effect: {
      type: 'special_ability',
      ability: 'death_immunity',
    },
    rarity: GeneRarity.LEGENDARY,
    description: '受到致命伤害时免疫一次死亡，HP保留1点',
  },
  {
    id: 'poison_resist',
    name: '毒抗基因',
    pattern: [BasePair.GUANINE, BasePair.THYMINE, BasePair.GUANINE, BasePair.THYMINE],
    dominance: GeneDominance.DOMINANT,
    expressionCondition: { type: ExpressionConditionType.ALWAYS },
    effect: {
      type: 'stat_boost',
      stats: { defense: 10, hp: 5 },
    },
    rarity: GeneRarity.COMMON,
    description: '防御+10%，生命+5%',
  },
  {
    id: 'endurance',
    name: '耐力基因',
    pattern: [BasePair.ADENINE, BasePair.ADENINE, BasePair.ADENINE, BasePair.ADENINE],
    dominance: GeneDominance.DOMINANT,
    expressionCondition: { type: ExpressionConditionType.ALWAYS },
    effect: {
      type: 'stat_boost',
      stats: { hp: 15 },
    },
    rarity: GeneRarity.COMMON,
    description: '生命+15%',
  },
  {
    id: 'hunger_adapt',
    name: '生存基因',
    pattern: [BasePair.CYTOSINE, BasePair.ADENINE, BasePair.CYTOSINE, BasePair.ADENINE],
    dominance: GeneDominance.RECESSIVE,
    expressionCondition: { type: ExpressionConditionType.HP_THRESHOLD, comparison: '<', value: 50 },
    effect: {
      type: 'stat_boost',
      stats: { defense: 30, hp: 20 },
    },
    rarity: GeneRarity.RARE,
    description: 'HP低于50%时，防御+30%，生命+20%',
  },
  {
    id: 'foresight',
    name: '预知基因',
    pattern: [BasePair.ADENINE, BasePair.THYMINE, BasePair.GUANINE, BasePair.CYTOSINE, BasePair.ADENINE, BasePair.THYMINE, BasePair.GUANINE, BasePair.CYTOSINE],
    dominance: GeneDominance.RECESSIVE,
    expressionCondition: { type: ExpressionConditionType.ALWAYS },
    effect: {
      type: 'stat_boost',
      stats: { critRate: 20, critDamage: 50 },
    },
    rarity: GeneRarity.LEGENDARY,
    description: '暴击率+20%，暴击伤害+50%',
  },
  {
    id: 'time_perception',
    name: '迅捷基因',
    pattern: [BasePair.THYMINE, BasePair.GUANINE, BasePair.THYMINE, BasePair.GUANINE, BasePair.THYMINE, BasePair.GUANINE, BasePair.THYMINE, BasePair.GUANINE],
    dominance: GeneDominance.RECESSIVE,
    expressionCondition: { type: ExpressionConditionType.ALWAYS },
    effect: {
      type: 'stat_boost',
      stats: { speed: 30, dodge: 15 },
    },
    rarity: GeneRarity.EPIC,
    description: '速度+30%，闪避+15%',
  },
  {
    id: 'luck',
    name: '幸运基因',
    pattern: [BasePair.ADENINE, BasePair.CYTOSINE, BasePair.GUANINE, BasePair.THYMINE],
    dominance: GeneDominance.CODOMINANT,
    expressionCondition: { type: ExpressionConditionType.ALWAYS },
    effect: {
      type: 'stat_boost',
      stats: { critRate: 10, critDamage: 20 },
    },
    rarity: GeneRarity.RARE,
    description: '暴击率+10%，暴击伤害+20%',
  },
  {
    id: 'split',
    name: '幻影基因',
    pattern: [BasePair.GUANINE, BasePair.CYTOSINE, BasePair.GUANINE, BasePair.CYTOSINE, BasePair.GUANINE, BasePair.CYTOSINE],
    dominance: GeneDominance.RECESSIVE,
    expressionCondition: { type: ExpressionConditionType.HP_THRESHOLD, comparison: '<', value: 40 },
    effect: {
      type: 'stat_boost',
      stats: { dodge: 30, speed: 20 },
    },
    rarity: GeneRarity.EPIC,
    description: 'HP低于40%时，闪避+30%，速度+20%',
  },
  {
    id: 'evolution',
    name: '进化基因',
    pattern: [BasePair.ADENINE, BasePair.THYMINE, BasePair.GUANINE, BasePair.CYTOSINE, BasePair.CYTOSINE, BasePair.GUANINE, BasePair.THYMINE, BasePair.ADENINE],
    dominance: GeneDominance.RECESSIVE,
    expressionCondition: { type: ExpressionConditionType.ALWAYS },
    effect: {
      type: 'stat_boost',
      stats: { attack: 25, defense: 25, hp: 25 },
    },
    rarity: GeneRarity.LEGENDARY,
    description: '攻击+25%，防御+25%，生命+25%',
  },
];

export function generateRandomBase(): BasePair {
  const bases = [BasePair.ADENINE, BasePair.THYMINE, BasePair.GUANINE, BasePair.CYTOSINE];
  return bases[Math.floor(Math.random() * bases.length)];
}

export function createGeneSequence(length: number): GeneSequence {
  const bases: BasePair[] = [];
  for (let i = 0; i < length; i++) {
    bases.push(generateRandomBase());
  }
  return {
    bases,
    fragments: [],
    mutations: [],
    unlockedSlots: length,
    totalLifeSteal: 0,
  };
}

export function calculatePurity(bases: BasePair[], startIndex: number, pattern: BasePair[]): number {
  let matchCount = 0;
  for (let i = 0; i < pattern.length && startIndex + i < bases.length; i++) {
    if (bases[startIndex + i] === pattern[i]) {
      matchCount++;
    }
  }
  return Math.floor((matchCount / pattern.length) * 100);
}

export function findGeneFragments(sequence: GeneSequence): GeneFragment[] {
  const fragments: GeneFragment[] = [];
  const usedPositions = new Set<number>();

  const sortedTemplates = [...GENE_FRAGMENT_TEMPLATES].sort((a, b) => b.pattern.length - a.pattern.length);

  for (const template of sortedTemplates) {
    for (let i = 0; i <= sequence.bases.length - template.pattern.length; i++) {
      const positions = [];
      let match = true;
      
      for (let j = 0; j < template.pattern.length; j++) {
        if (sequence.bases[i + j] !== template.pattern[j]) {
          match = false;
          break;
        }
        positions.push(i + j);
      }

      if (match && !positions.some(p => usedPositions.has(p))) {
        const purity = calculatePurity(sequence.bases, i, template.pattern);
        const fragment: GeneFragment = {
          ...template,
          instanceId: `${template.id}_${i}_${Date.now()}`,
          startIndex: i,
          purity,
          isActive: true,
        };
        fragments.push(fragment);
        positions.forEach(p => usedPositions.add(p));
      }
    }
  }

  return fragments;
}

export function checkExpressionCondition(
  fragment: GeneFragment,
  context: BattleContext
): boolean {
  const condition = fragment.expressionCondition;

  switch (condition.type) {
    case ExpressionConditionType.ALWAYS:
      return true;

    case ExpressionConditionType.HP_THRESHOLD:
      const hpPercent = (context.currentHp / context.maxHp) * 100;
      const value = condition.value || 0;
      switch (condition.comparison) {
        case '<': return hpPercent < value;
        case '>': return hpPercent > value;
        case '<=': return hpPercent <= value;
        case '>=': return hpPercent >= value;
        case '==': return hpPercent === value;
        default: return false;
      }

    case ExpressionConditionType.TURN:
      return context.turn >= (condition.value || 0);

    case ExpressionConditionType.COMBO:
      return context.comboCount >= (condition.value || 0);

    case ExpressionConditionType.DAMAGE_TAKEN:
      return context.damageTaken >= (condition.value || 0);

    case ExpressionConditionType.ON_KILL:
      return context.kills > 0;

    case ExpressionConditionType.TIME:
      return context.battleTime >= (condition.value || 0);

    case ExpressionConditionType.ON_DAMAGE_DEALT:
      return true;

    case ExpressionConditionType.ON_SKILL_USE:
      return context.lastActionWasSkill;

    case ExpressionConditionType.ON_FATAL_DAMAGE:
      return context.isFatalDamage;

    case ExpressionConditionType.ON_DODGE:
      return context.lastActionWasDodge;

    default:
      return false;
  }
}

export function calculateTotalLifeSteal(fragments: GeneFragment[], context: BattleContext): number {
  let totalLifeSteal = 0;

  for (const fragment of fragments) {
    if (!fragment.isActive) continue;
    if (fragment.cooldownRemaining && fragment.cooldownRemaining > 0) continue;

    if (fragment.effect.type === 'life_steal' && fragment.effect.lifeSteal) {
      if (checkExpressionCondition(fragment, context)) {
        const basePercent = fragment.effect.lifeSteal.basePercent;
        const purityMultiplier = 1 + (fragment.purity / 200);
        totalLifeSteal += basePercent * purityMultiplier;
      }
    }
  }

  return Math.min(totalLifeSteal, 100);
}

export function getActiveGeneEffects(fragments: GeneFragment[], context: BattleContext): GeneFragment[] {
  return fragments.filter(fragment => {
    if (!fragment.isActive) return false;
    if (fragment.cooldownRemaining && fragment.cooldownRemaining > 0) return false;
    return checkExpressionCondition(fragment, context);
  });
}

export function calculateGeneStats(fragments: GeneFragment[], context: BattleContext): Record<string, number> {
  const stats: Record<string, number> = {};
  const activeFragments = getActiveGeneEffects(fragments, context);

  for (const fragment of activeFragments) {
    if (fragment.effect.stats) {
      for (const [stat, value] of Object.entries(fragment.effect.stats)) {
        const purityMultiplier = 1 + (fragment.purity / 200);
        const rarityMultiplier = GENE_RARITY_CONFIG[fragment.rarity].multiplier;
        stats[stat] = (stats[stat] || 0) + value * purityMultiplier * rarityMultiplier;
      }
    }
  }

  return stats;
}

export function replaceBase(
  sequence: GeneSequence,
  position: number,
  newBase: BasePair
): { success: boolean; message: string; mutation?: MutationRecord } {
  if (position < 0 || position >= sequence.bases.length) {
    return { success: false, message: '无效的位置' };
  }

  const oldBase = sequence.bases[position];
  if (oldBase === newBase) {
    return { success: false, message: '碱基相同，无需替换' };
  }

  sequence.bases[position] = newBase;
  const mutation: MutationRecord = {
    timestamp: Date.now(),
    type: 'point',
    position,
    oldValue: oldBase,
    newValue: newBase,
    result: 'neutral',
  };
  sequence.mutations.push(mutation);

  sequence.fragments = findGeneFragments(sequence);
  sequence.totalLifeSteal = calculateTotalLifeSteal(sequence.fragments, { currentHp: 100, maxHp: 100, turn: 0, comboCount: 0, damageTaken: 0, kills: 0, battleTime: 0, lastActionWasSkill: false, lastActionWasDodge: false, isFatalDamage: false });

  return { success: true, message: `位置${position + 1}的碱基已从${oldBase}替换为${newBase}`, mutation };
}

export function insertBases(
  sequence: GeneSequence,
  position: number,
  newBases: BasePair[]
): { success: boolean; message: string; mutation?: MutationRecord } {
  if (position < 0 || position > sequence.bases.length) {
    return { success: false, message: '无效的位置' };
  }

  if (sequence.bases.length + newBases.length > sequence.unlockedSlots) {
    return { success: false, message: '基因序列空间不足' };
  }

  sequence.bases.splice(position, 0, ...newBases);
  const mutation: MutationRecord = {
    timestamp: Date.now(),
    type: 'insertion',
    position,
    oldValue: [],
    newValue: newBases,
    result: 'neutral',
  };
  sequence.mutations.push(mutation);

  sequence.fragments = findGeneFragments(sequence);
  sequence.totalLifeSteal = calculateTotalLifeSteal(sequence.fragments, { currentHp: 100, maxHp: 100, turn: 0, comboCount: 0, damageTaken: 0, kills: 0, battleTime: 0, lastActionWasSkill: false, lastActionWasDodge: false, isFatalDamage: false });

  return { success: true, message: `已在位置${position + 1}插入${newBases.length}个碱基`, mutation };
}

export function deleteBases(
  sequence: GeneSequence,
  position: number,
  count: number
): { success: boolean; message: string; mutation?: MutationRecord } {
  if (position < 0 || position >= sequence.bases.length) {
    return { success: false, message: '无效的位置' };
  }

  const deletedBases = sequence.bases.splice(position, count);
  const mutation: MutationRecord = {
    timestamp: Date.now(),
    type: 'deletion',
    position,
    oldValue: deletedBases,
    newValue: [],
    result: 'neutral',
  };
  sequence.mutations.push(mutation);

  sequence.fragments = findGeneFragments(sequence);
  sequence.totalLifeSteal = calculateTotalLifeSteal(sequence.fragments, { currentHp: 100, maxHp: 100, turn: 0, comboCount: 0, damageTaken: 0, kills: 0, battleTime: 0, lastActionWasSkill: false, lastActionWasDodge: false, isFatalDamage: false });

  return { success: true, message: `已删除${count}个碱基`, mutation };
}

export function applyMutation(
  sequence: GeneSequence,
  mutationType: 'point' | 'fragment',
  useStabilizer: boolean = false
): { success: boolean; message: string; mutation?: MutationRecord } {
  const mutationChance = Math.random();
  
  if (!useStabilizer && mutationChance < 0.2) {
    const position = Math.floor(Math.random() * sequence.bases.length);
    const oldBase = sequence.bases[position];
    const negativeBases = [BasePair.ADENINE, BasePair.THYMINE, BasePair.GUANINE, BasePair.CYTOSINE].filter(b => b !== oldBase);
    const newBase = negativeBases[Math.floor(Math.random() * negativeBases.length)];
    
    sequence.bases[position] = newBase;
    const mutation: MutationRecord = {
      timestamp: Date.now(),
      type: 'point',
      position,
      oldValue: oldBase,
      newValue: newBase,
      result: 'negative',
    };
    sequence.mutations.push(mutation);
    
    sequence.fragments = findGeneFragments(sequence);
    return { success: true, message: '发生负面突变！', mutation };
  }

  if (mutationType === 'point') {
    const position = Math.floor(Math.random() * sequence.bases.length);
    const oldBase = sequence.bases[position];
    const newBases = [BasePair.ADENINE, BasePair.THYMINE, BasePair.GUANINE, BasePair.CYTOSINE].filter(b => b !== oldBase);
    const newBase = newBases[Math.floor(Math.random() * newBases.length)];
    
    sequence.bases[position] = newBase;
    const mutation: MutationRecord = {
      timestamp: Date.now(),
      type: 'point',
      position,
      oldValue: oldBase,
      newValue: newBase,
      result: 'positive',
    };
    sequence.mutations.push(mutation);
    
    sequence.fragments = findGeneFragments(sequence);
    sequence.totalLifeSteal = calculateTotalLifeSteal(sequence.fragments, { currentHp: 100, maxHp: 100, turn: 0, comboCount: 0, damageTaken: 0, kills: 0, battleTime: 0, lastActionWasSkill: false, lastActionWasDodge: false, isFatalDamage: false });
    
    return { success: true, message: `点突变成功：位置${position + 1}的${oldBase}变为${newBase}`, mutation };
  } else {
    const positions: number[] = [];
    for (let i = 0; i < 3; i++) {
      positions.push(Math.floor(Math.random() * sequence.bases.length));
    }
    
    const mutations: { pos: number; old: BasePair; new: BasePair }[] = [];
    for (const pos of positions) {
      const oldBase = sequence.bases[pos];
      const newBases = [BasePair.ADENINE, BasePair.THYMINE, BasePair.GUANINE, BasePair.CYTOSINE].filter(b => b !== oldBase);
      const newBase = newBases[Math.floor(Math.random() * newBases.length)];
      sequence.bases[pos] = newBase;
      mutations.push({ pos, old: oldBase, new: newBase });
    }
    
    const mutation: MutationRecord = {
      timestamp: Date.now(),
      type: 'point',
      position: positions[0],
      oldValue: mutations.map(m => m.old),
      newValue: mutations.map(m => m.new),
      result: 'positive',
    };
    sequence.mutations.push(mutation);
    
    sequence.fragments = findGeneFragments(sequence);
    sequence.totalLifeSteal = calculateTotalLifeSteal(sequence.fragments, { currentHp: 100, maxHp: 100, turn: 0, comboCount: 0, damageTaken: 0, kills: 0, battleTime: 0, lastActionWasSkill: false, lastActionWasDodge: false, isFatalDamage: false });
    
    return { success: true, message: `片段突变成功：${mutations.length}个碱基发生改变`, mutation };
  }
}

export function serializeGeneSequence(sequence: GeneSequence): string {
  return JSON.stringify(sequence);
}

export function deserializeGeneSequence(data: string): GeneSequence {
  return JSON.parse(data);
}

export { 
  GeneType,
  GENE_TREE,
  GENE_TYPE_CONFIG,
  createGeneNode,
  upgradeGeneNode,
  getGeneUpgradeCost,
  getGeneTotalStats,
  serializeGeneNode,
  deserializeGeneNode
} from './GeneSystemLegacy';
export type { GeneNode, GeneNodeData } from './GeneSystemLegacy';
