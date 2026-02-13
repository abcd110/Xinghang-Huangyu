export enum ChipSlot {
  SLOT_1 = 1,
  SLOT_2 = 2,
  SLOT_3 = 3,
  SLOT_4 = 4,
}

export enum ChipMainStat {
  HP = 'hp',
  ATTACK = 'attack',
  DEFENSE = 'defense',
  CRIT_RATE = 'crit_rate',
  CRIT_DAMAGE = 'crit_damage',
  SPEED = 'speed',
}

export enum ChipSubStat {
  HP = 'hp',
  ATTACK = 'attack',
  DEFENSE = 'defense',
  CRIT_RATE = 'crit_rate',
  CRIT_DAMAGE = 'crit_damage',
  SPEED = 'speed',
  HP_PERCENT = 'hp_percent',
  ATTACK_PERCENT = 'attack_percent',
  DEFENSE_PERCENT = 'defense_percent',
}

export enum ChipRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

export interface Chip {
  id: string;
  slot: ChipSlot;
  rarity: ChipRarity;
  level: number;
  mainStat: ChipMainStat;
  mainStatValue: number;
  subStats: { stat: ChipSubStat; value: number }[];
  lockedSubStatLevels: number[];
}

export interface ChipData {
  id: string;
  slot: ChipSlot;
  rarity: ChipRarity;
  level: number;
  mainStat: ChipMainStat;
  mainStatValue: number;
  subStats: { stat: ChipSubStat; value: number }[];
  lockedSubStatLevels: number[];
}

export const CHIP_RARITY_CONFIG: Record<ChipRarity, { name: string; color: string; subStatCount: number }> = {
  [ChipRarity.COMMON]: { name: '普通', color: '#9ca3af', subStatCount: 1 },
  [ChipRarity.UNCOMMON]: { name: '优秀', color: '#22c55e', subStatCount: 2 },
  [ChipRarity.RARE]: { name: '稀有', color: '#3b82f6', subStatCount: 2 },
  [ChipRarity.EPIC]: { name: '史诗', color: '#a855f7', subStatCount: 3 },
  [ChipRarity.LEGENDARY]: { name: '传说', color: '#f59e0b', subStatCount: 4 },
};

export const CHIP_MAIN_STAT_CONFIG: Record<ChipMainStat, { name: string; baseValue: number; growth: number }> = {
  [ChipMainStat.HP]: { name: '生命值', baseValue: 100, growth: 20 },
  [ChipMainStat.ATTACK]: { name: '攻击力', baseValue: 10, growth: 2 },
  [ChipMainStat.DEFENSE]: { name: '防御力', baseValue: 8, growth: 1.5 },
  [ChipMainStat.CRIT_RATE]: { name: '暴击率', baseValue: 2, growth: 0.5 },
  [ChipMainStat.CRIT_DAMAGE]: { name: '暴击伤害', baseValue: 10, growth: 2 },
  [ChipMainStat.SPEED]: { name: '速度', baseValue: 2, growth: 0.3 },
};

export const CHIP_SUB_STAT_CONFIG: Record<ChipSubStat, { name: string; minValue: number; maxValue: number }> = {
  [ChipSubStat.HP]: { name: '生命值', minValue: 20, maxValue: 50 },
  [ChipSubStat.ATTACK]: { name: '攻击力', minValue: 3, maxValue: 8 },
  [ChipSubStat.DEFENSE]: { name: '防御力', minValue: 2, maxValue: 6 },
  [ChipSubStat.CRIT_RATE]: { name: '暴击率', minValue: 1, maxValue: 3 },
  [ChipSubStat.CRIT_DAMAGE]: { name: '暴击伤害', minValue: 3, maxValue: 8 },
  [ChipSubStat.SPEED]: { name: '速度', minValue: 1, maxValue: 3 },
  [ChipSubStat.HP_PERCENT]: { name: '生命值%', minValue: 1, maxValue: 4 },
  [ChipSubStat.ATTACK_PERCENT]: { name: '攻击力%', minValue: 1, maxValue: 3 },
  [ChipSubStat.DEFENSE_PERCENT]: { name: '防御力%', minValue: 1, maxValue: 3 },
};

export const SLOT_MAIN_STAT: Record<ChipSlot, ChipMainStat[]> = {
  [ChipSlot.SLOT_1]: [ChipMainStat.HP],
  [ChipSlot.SLOT_2]: [ChipMainStat.ATTACK],
  [ChipSlot.SLOT_3]: [ChipMainStat.HP, ChipMainStat.ATTACK, ChipMainStat.DEFENSE, ChipMainStat.CRIT_RATE, ChipMainStat.CRIT_DAMAGE, ChipMainStat.SPEED],
  [ChipSlot.SLOT_4]: [ChipMainStat.HP, ChipMainStat.ATTACK, ChipMainStat.DEFENSE, ChipMainStat.CRIT_RATE, ChipMainStat.CRIT_DAMAGE, ChipMainStat.SPEED],
};

export const SUB_STAT_UNLOCK_LEVELS = [3, 5, 8, 12];

export const MAX_CHIP_LEVEL = 15;

let chipIdCounter = 0;

function generateChipId(): string {
  chipIdCounter++;
  return `chip_${Date.now()}_${chipIdCounter}`;
}

export function getMainStatForSlot(slot: ChipSlot): ChipMainStat {
  const possibleStats = SLOT_MAIN_STAT[slot];
  return possibleStats[Math.floor(Math.random() * possibleStats.length)];
}

export function getRandomSubStat(exclude: ChipSubStat[] = []): ChipSubStat {
  const allStats = Object.values(ChipSubStat).filter(s => !exclude.includes(s));
  return allStats[Math.floor(Math.random() * allStats.length)];
}

export function createChip(slot: ChipSlot, rarity: ChipRarity): Chip {
  const mainStat = getMainStatForSlot(slot);
  const mainStatConfig = CHIP_MAIN_STAT_CONFIG[mainStat];
  const rarityConfig = CHIP_RARITY_CONFIG[rarity];

  const mainStatValue = mainStatConfig.baseValue * (1 + Object.keys(ChipRarity).indexOf(rarity) * 0.1);

  const subStats: { stat: ChipSubStat; value: number }[] = [];
  const usedStats: ChipSubStat[] = [];

  for (let i = 0; i < rarityConfig.subStatCount; i++) {
    const stat = getRandomSubStat(usedStats);
    usedStats.push(stat);
    const config = CHIP_SUB_STAT_CONFIG[stat];
    const value = config.minValue + Math.random() * (config.maxValue - config.minValue);
    subStats.push({ stat, value: Math.round(value * 10) / 10 });
  }

  return {
    id: generateChipId(),
    slot,
    rarity,
    level: 1,
    mainStat,
    mainStatValue: Math.round(mainStatValue * 10) / 10,
    subStats,
    lockedSubStatLevels: [...SUB_STAT_UNLOCK_LEVELS],
  };
}

export function upgradeChip(chip: Chip, materialCount: number): { success: boolean; newLevel: number; unlockedSubStat?: ChipSubStat } {
  if (chip.level >= MAX_CHIP_LEVEL) {
    return { success: false, newLevel: chip.level };
  }

  const levelsGained = Math.min(materialCount, MAX_CHIP_LEVEL - chip.level);
  const oldLevel = chip.level;
  chip.level += levelsGained;

  const mainStatConfig = CHIP_MAIN_STAT_CONFIG[chip.mainStat];
  chip.mainStatValue = Math.round((mainStatConfig.baseValue + mainStatConfig.growth * (chip.level - 1)) * 10) / 10;

  let unlockedSubStat: ChipSubStat | undefined;
  for (const unlockLevel of SUB_STAT_UNLOCK_LEVELS) {
    if (oldLevel < unlockLevel && chip.level >= unlockLevel && chip.lockedSubStatLevels.includes(unlockLevel)) {
      chip.lockedSubStatLevels = chip.lockedSubStatLevels.filter(l => l !== unlockLevel);

      const usedStats = chip.subStats.map(s => s.stat);
      const newStat = getRandomSubStat(usedStats);
      const config = CHIP_SUB_STAT_CONFIG[newStat];
      const value = config.minValue + Math.random() * (config.maxValue - config.minValue);
      chip.subStats.push({ stat: newStat, value: Math.round(value * 10) / 10 });
      unlockedSubStat = newStat;
      break;
    }
  }

  return { success: true, newLevel: chip.level, unlockedSubStat };
}

export function getUpgradeCost(level: number): { credits: number; materials: number } {
  return {
    credits: 100 * level,
    materials: level,
  };
}

export function getChipStats(chip: Chip): Record<string, number> {
  const stats: Record<string, number> = {};

  const mainStatName = CHIP_MAIN_STAT_CONFIG[chip.mainStat].name;
  stats[mainStatName] = chip.mainStatValue;

  chip.subStats.forEach(sub => {
    const statName = CHIP_SUB_STAT_CONFIG[sub.stat].name;
    stats[statName] = (stats[statName] || 0) + sub.value;
  });

  return stats;
}

export function serializeChip(chip: Chip): ChipData {
  return { ...chip };
}

export function deserializeChip(data: ChipData): Chip {
  return { ...data };
}
