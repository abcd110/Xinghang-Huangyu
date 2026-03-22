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
  HP_PERCENT = 'hp_percent',
  ATTACK_PERCENT = 'attack_percent',
  DEFENSE_PERCENT = 'defense_percent',
  HIT = 'hit',
}

export enum ChipSubStat {
  HP = 'hp',
  ATTACK = 'attack',
  DEFENSE = 'defense',
  CRIT_RATE = 'crit_rate',
  CRIT_DAMAGE = 'crit_damage',
  HP_PERCENT = 'hp_percent',
  ATTACK_PERCENT = 'attack_percent',
  DEFENSE_PERCENT = 'defense_percent',
  HIT = 'hit',
  DODGE = 'dodge',
}

export enum ChipRarity {
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

export enum ChipSet {
  WARRIOR = 'warrior',
  GUARDIAN = 'guardian',
  ASSASSIN = 'assassin',
  MAGE = 'mage',
  BERSERKER = 'berserker',
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
  locked?: boolean;
  setId?: ChipSet;
  enhanceCount: number;
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
  locked?: boolean;
  setId?: ChipSet;
  enhanceCount: number;
}

export const CHIP_RARITY_CONFIG: Record<ChipRarity, { name: string; color: string; subStatCount: number; maxEnhance: number; maxLevel: number }> = {
  [ChipRarity.RARE]: { name: '稀有', color: '#3b82f6', subStatCount: 2, maxEnhance: 5, maxLevel: 5 },
  [ChipRarity.EPIC]: { name: '史诗', color: '#a855f7', subStatCount: 3, maxEnhance: 10, maxLevel: 10 },
  [ChipRarity.LEGENDARY]: { name: '传说', color: '#f59e0b', subStatCount: 4, maxEnhance: 15, maxLevel: 15 },
};

export const CHIP_MAIN_STAT_CONFIG: Record<ChipMainStat, { name: string; baseValue: number; growth: number }> = {
  [ChipMainStat.HP]: { name: '生命', baseValue: 100, growth: 50 },
  [ChipMainStat.ATTACK]: { name: '攻击', baseValue: 10, growth: 2 },
  [ChipMainStat.DEFENSE]: { name: '防御', baseValue: 8, growth: 1.5 },
  [ChipMainStat.CRIT_RATE]: { name: '暴击率', baseValue: 5, growth: 2 },
  [ChipMainStat.CRIT_DAMAGE]: { name: '爆伤', baseValue: 5, growth: 5 },
  [ChipMainStat.SPEED]: { name: '攻速', baseValue: 0.3, growth: 0.1 },
  [ChipMainStat.HP_PERCENT]: { name: '生命%', baseValue: 10, growth: 5 },
  [ChipMainStat.ATTACK_PERCENT]: { name: '攻击%', baseValue: 3, growth: 3 },
  [ChipMainStat.DEFENSE_PERCENT]: { name: '防御%', baseValue: 2, growth: 2 },
  [ChipMainStat.HIT]: { name: '命中', baseValue: 10, growth: 5 },
};

export const CHIP_SUB_STAT_CONFIG: Record<ChipSubStat, { name: string; minValue: number; maxValue: number }> = {
  [ChipSubStat.HP]: { name: '生命', minValue: 50, maxValue: 200 },
  [ChipSubStat.ATTACK]: { name: '攻击', minValue: 10, maxValue: 30 },
  [ChipSubStat.DEFENSE]: { name: '防御', minValue: 1, maxValue: 10 },
  [ChipSubStat.CRIT_RATE]: { name: '暴击率', minValue: 1, maxValue: 5 },
  [ChipSubStat.CRIT_DAMAGE]: { name: '爆伤', minValue: 3, maxValue: 18 },
  [ChipSubStat.HP_PERCENT]: { name: '生命%', minValue: 5, maxValue: 20 },
  [ChipSubStat.ATTACK_PERCENT]: { name: '攻击%', minValue: 3, maxValue: 12 },
  [ChipSubStat.DEFENSE_PERCENT]: { name: '防御%', minValue: 1, maxValue: 6 },
  [ChipSubStat.HIT]: { name: '命中', minValue: 5, maxValue: 20 },
  [ChipSubStat.DODGE]: { name: '闪避', minValue: 1, maxValue: 5 },
};

export const CHIP_SET_CONFIG: Record<ChipSet, { name: string; icon: string; color: string; bonus2: string; bonus4: string }> = {
  [ChipSet.WARRIOR]: { name: '战士', icon: '⚔️', color: '#ef4444', bonus2: '攻击力+10%', bonus4: '暴击伤害+25%' },
  [ChipSet.GUARDIAN]: { name: '守护者', icon: '🛡️', color: '#3b82f6', bonus2: '防御力+15%', bonus4: '受到伤害-10%' },
  [ChipSet.ASSASSIN]: { name: '刺客', icon: '🗡️', color: '#8b5cf6', bonus2: '暴击率+8%', bonus4: '暴击时50%概率额外攻击' },
  [ChipSet.MAGE]: { name: '法师', icon: '🔮', color: '#06b6d4', bonus2: '速度+10%', bonus4: '技能冷却-15%' },
  [ChipSet.BERSERKER]: { name: '狂战士', icon: '🔥', color: '#f97316', bonus2: '攻击力+8%，生命值-5%', bonus4: '生命值越低攻击力越高' },
};

export const SLOT_MAIN_STAT: Record<ChipSlot, ChipMainStat[]> = {
  [ChipSlot.SLOT_1]: [ChipMainStat.HP],
  [ChipSlot.SLOT_2]: [ChipMainStat.ATTACK],
  [ChipSlot.SLOT_3]: [ChipMainStat.SPEED, ChipMainStat.ATTACK_PERCENT, ChipMainStat.HP_PERCENT, ChipMainStat.DEFENSE_PERCENT],
  [ChipSlot.SLOT_4]: [ChipMainStat.ATTACK_PERCENT, ChipMainStat.HP_PERCENT, ChipMainStat.DEFENSE_PERCENT, ChipMainStat.HIT, ChipMainStat.CRIT_RATE, ChipMainStat.CRIT_DAMAGE],
};

export const SUB_STAT_UNLOCK_LEVELS = [5, 10, 12];

export const MAX_CHIP_LEVEL = 15;

export const CHIP_CRAFT_COST: Record<ChipRarity, { credits: number; materials: { itemId: string; count: number }[] }> = {
  [ChipRarity.RARE]: {
    credits: 500,
    materials: [
      { itemId: 'chip_material', count: 5 },
      { itemId: 'mineral_iron', count: 10 },
      { itemId: 'mineral_copper', count: 5 },
    ],
  },
  [ChipRarity.EPIC]: {
    credits: 2000,
    materials: [
      { itemId: 'chip_material', count: 20 },
      { itemId: 'mineral_titanium', count: 10 },
      { itemId: 'mineral_crystal', count: 5 },
    ],
  },
  [ChipRarity.LEGENDARY]: {
    credits: 10000,
    materials: [
      { itemId: 'chip_material', count: 50 },
      { itemId: 'mineral_crystal', count: 10 },
      { itemId: 'mineral_quantum', count: 5 },
    ],
  },
};

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

export function getRandomChipSet(): ChipSet {
  const sets = Object.values(ChipSet);
  return sets[Math.floor(Math.random() * sets.length)];
}

export function createChip(slot: ChipSlot, rarity: ChipRarity): Chip {
  const mainStat = getMainStatForSlot(slot);
  const mainStatConfig = CHIP_MAIN_STAT_CONFIG[mainStat];
  const rarityConfig = CHIP_RARITY_CONFIG[rarity];

  const mainStatValue = mainStatConfig.baseValue;

  const subStats: { stat: ChipSubStat; value: number }[] = [];
  const usedStats: ChipSubStat[] = [];

  for (let i = 0; i < rarityConfig.subStatCount; i++) {
    const stat = getRandomSubStat(usedStats);
    usedStats.push(stat);
    if (stat === ChipSubStat.DODGE) {
      usedStats.push(ChipSubStat.DODGE);
    }
    const config = CHIP_SUB_STAT_CONFIG[stat];
    const value = config.minValue + Math.random() * (config.maxValue - config.minValue);
    subStats.push({ stat, value: Math.round(value * 10) / 10 });
  }

  const setId = rarity === ChipRarity.EPIC || rarity === ChipRarity.LEGENDARY ? getRandomChipSet() : undefined;

  return {
    id: generateChipId(),
    slot,
    rarity,
    level: 1,
    mainStat,
    mainStatValue: Math.round(mainStatValue * 10) / 10,
    subStats,
    lockedSubStatLevels: [...SUB_STAT_UNLOCK_LEVELS],
    locked: false,
    setId,
    enhanceCount: 0,
  };
}

export function upgradeChip(chip: Chip, materialCount: number): { success: boolean; newLevel: number; unlockedSubStat?: ChipSubStat } {
  const rarityConfig = CHIP_RARITY_CONFIG[chip.rarity];
  const maxLevel = rarityConfig.maxLevel;

  if (chip.level >= maxLevel) {
    return { success: false, newLevel: chip.level };
  }

  const levelsGained = Math.min(materialCount, maxLevel - chip.level);
  const oldLevel = chip.level;
  chip.level += levelsGained;

  const mainStatConfig = CHIP_MAIN_STAT_CONFIG[chip.mainStat];
  chip.mainStatValue = Math.round((mainStatConfig.baseValue + mainStatConfig.growth * (chip.level - 1)) * 10) / 10;

  let unlockedSubStat: ChipSubStat | undefined;
  for (const unlockLevel of SUB_STAT_UNLOCK_LEVELS) {
    if (oldLevel < unlockLevel && chip.level >= unlockLevel && chip.lockedSubStatLevels.includes(unlockLevel)) {
      chip.lockedSubStatLevels = chip.lockedSubStatLevels.filter(l => l !== unlockLevel);

      const usedStats = chip.subStats.map(s => s.stat);
      const hasDodge = usedStats.includes(ChipSubStat.DODGE);
      if (hasDodge) {
        usedStats.push(ChipSubStat.DODGE);
      }
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

export function rerollSubStat(chip: Chip, subStatIndex: number): { success: boolean; message: string; newStat?: ChipSubStat; newValue?: number } {
  if (chip.locked) {
    return { success: false, message: '芯片已锁定，无法重随' };
  }

  if (subStatIndex < 0 || subStatIndex >= chip.subStats.length) {
    return { success: false, message: '无效的副属性索引' };
  }

  const currentStat = chip.subStats[subStatIndex].stat;
  const otherStats = chip.subStats.filter((_, idx) => idx !== subStatIndex).map(s => s.stat);
  const hasDodgeElsewhere = otherStats.includes(ChipSubStat.DODGE);

  let allSubStats = Object.values(ChipSubStat);
  if (hasDodgeElsewhere) {
    allSubStats = allSubStats.filter(s => s !== ChipSubStat.DODGE);
  }

  const newStat = allSubStats[Math.floor(Math.random() * allSubStats.length)];
  const config = CHIP_SUB_STAT_CONFIG[newStat];

  const newValue = config.minValue + Math.random() * (config.maxValue - config.minValue);

  chip.subStats[subStatIndex] = {
    stat: newStat,
    value: Math.round(newValue * 10) / 10
  };

  return {
    success: true,
    message: `重随成功，新属性: ${config.name} +${chip.subStats[subStatIndex].value}`,
    newStat,
    newValue: chip.subStats[subStatIndex].value
  };
}

export function rerollAllSubStats(chip: Chip): { success: boolean; message: string } {
  if (chip.locked) {
    return { success: false, message: '芯片已锁定，无法重随' };
  }

  chip.subStats.forEach(subStat => {
    const config = CHIP_SUB_STAT_CONFIG[subStat.stat];
    if (config) {
      const newValue = config.minValue + Math.random() * (config.maxValue - config.minValue);
      subStat.value = Math.round(newValue * 10) / 10;
    }
  });

  return { success: true, message: '所有副属性已重随' };
}

export function toggleChipLock(chip: Chip): boolean {
  chip.locked = !chip.locked;
  return chip.locked;
}

export function getUpgradeCost(level: number): { credits: number; materials: number } {
  if (level >= 1 && level <= 5) {
    return {
      credits: 100,
      materials: level,
    };
  } else if (level >= 6 && level <= 10) {
    const materialCosts = [6, 8, 10, 12, 14];
    return {
      credits: 200,
      materials: materialCosts[level - 6],
    };
  } else if (level >= 11 && level <= 12) {
    return {
      credits: 400,
      materials: 20,
    };
  } else {
    return {
      credits: 1000,
      materials: 30,
    };
  }
}

export function getRerollCost(chip: Chip): { credits: number; materials: number } {
  return {
    credits: 500 * chip.level,
    materials: 5 + chip.level,
  };
}

export function getChipStats(chip: Chip): Record<string, number> {
  const stats: Record<string, number> = {};

  const mainStatName = CHIP_MAIN_STAT_CONFIG[chip.mainStat].name;
  stats[mainStatName] = chip.mainStatValue;

  chip.subStats.forEach(sub => {
    const config = CHIP_SUB_STAT_CONFIG[sub.stat];
    if (config) {
      const statName = config.name;
      stats[statName] = (stats[statName] || 0) + sub.value;
    }
  });

  return stats;
}

export function getSetBonus(chips: Chip[]): { set: ChipSet; count: number; bonuses: string[] }[] {
  const setCounts: Record<ChipSet, number> = {} as Record<ChipSet, number>;

  chips.forEach(chip => {
    if (chip.setId) {
      setCounts[chip.setId] = (setCounts[chip.setId] || 0) + 1;
    }
  });

  const bonuses: { set: ChipSet; count: number; bonuses: string[] }[] = [];

  Object.entries(setCounts).forEach(([setId, count]) => {
    const setConfig = CHIP_SET_CONFIG[setId as ChipSet];
    const activeBonuses: string[] = [];

    if (count >= 2) {
      activeBonuses.push(`2件套: ${setConfig.bonus2}`);
    }
    if (count >= 4) {
      activeBonuses.push(`4件套: ${setConfig.bonus4}`);
    }

    if (activeBonuses.length > 0) {
      bonuses.push({
        set: setId as ChipSet,
        count,
        bonuses: activeBonuses,
      });
    }
  });

  return bonuses;
}

export function serializeChip(chip: Chip): ChipData {
  return { ...chip };
}

export function deserializeChip(data: ChipData): Chip {
  let rarity = data.rarity;
  if (rarity === 'common' || rarity === 'uncommon') {
    rarity = ChipRarity.RARE;
  }

  return {
    ...data,
    rarity,
    locked: data.locked || false,
    enhanceCount: data.enhanceCount || 0,
    setId: data.setId,
  };
}
