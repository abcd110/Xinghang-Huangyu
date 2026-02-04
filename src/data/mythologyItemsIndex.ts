// 神话站台装备数据索引文件
// 整合所有神话装备数据

import type { Item } from './types';
import { MYTHOLOGY_ITEMS_1_8 } from './mythologyItems1_8';
import { MYTHOLOGY_ITEMS_9_16 } from './mythologyItems9_16';
import { MYTHOLOGY_ITEMS_17_24 } from './mythologyItems17_24';
import { MYTHOLOGY_ITEMS_25_32 } from './mythologyItems25_32';

// 合并所有神话装备数据
export const ALL_MYTHOLOGY_ITEMS: Record<string, Item> = {
  ...MYTHOLOGY_ITEMS_1_8,
  ...MYTHOLOGY_ITEMS_9_16,
  ...MYTHOLOGY_ITEMS_17_24,
  ...MYTHOLOGY_ITEMS_25_32,
};

// 获取神话装备
export function getMythologyItem(itemId: string): Item | undefined {
  return ALL_MYTHOLOGY_ITEMS[itemId];
}

// 获取指定站台的装备
export function getStationItems(stationNumber: number): Item[] {
  const prefix = `myth${stationNumber}_`;
  return Object.values(ALL_MYTHOLOGY_ITEMS).filter(item => item.id.startsWith(prefix));
}

// 获取指定套装的装备
export function getSetItems(setId: string): Item[] {
  return Object.values(ALL_MYTHOLOGY_ITEMS).filter(item => item.setId === setId);
}

// 获取指定部位的装备
export function getItemsBySlot(slot: 'head' | 'chest' | 'legs' | 'feet' | 'weapon' | 'accessory'): Item[] {
  return Object.values(ALL_MYTHOLOGY_ITEMS).filter(item => {
    if (slot === 'weapon') return item.type === 'weapon';
    if (slot === 'accessory') return item.type === 'accessory';
    return item.armorSlot === slot;
  });
}

// 获取指定品质的装备
export function getItemsByRarity(rarity: string): Item[] {
  return Object.values(ALL_MYTHOLOGY_ITEMS).filter(item => item.rarity === rarity);
}

// 获取指定等级范围的装备
export function getItemsByLevelRange(minLevel: number, maxLevel: number): Item[] {
  return Object.values(ALL_MYTHOLOGY_ITEMS).filter(
    item => item.requiredLevel && item.requiredLevel >= minLevel && item.requiredLevel <= maxLevel
  );
}

// 统计信息
export const MYTHOLOGY_STATS = {
  totalItems: Object.keys(ALL_MYTHOLOGY_ITEMS).length,
  stations: 32,
  itemsPerStation: 6,
  byRarity: {
    common: Object.values(ALL_MYTHOLOGY_ITEMS).filter(i => i.rarity === 'common').length,
    uncommon: Object.values(ALL_MYTHOLOGY_ITEMS).filter(i => i.rarity === 'uncommon').length,
    rare: Object.values(ALL_MYTHOLOGY_ITEMS).filter(i => i.rarity === 'rare').length,
    epic: Object.values(ALL_MYTHOLOGY_ITEMS).filter(i => i.rarity === 'epic').length,
    legendary: Object.values(ALL_MYTHOLOGY_ITEMS).filter(i => i.rarity === 'legendary').length,
  },
  bySlot: {
    head: Object.values(ALL_MYTHOLOGY_ITEMS).filter(i => i.armorSlot === 'head').length,
    chest: Object.values(ALL_MYTHOLOGY_ITEMS).filter(i => i.armorSlot === 'chest').length,
    legs: Object.values(ALL_MYTHOLOGY_ITEMS).filter(i => i.armorSlot === 'legs').length,
    feet: Object.values(ALL_MYTHOLOGY_ITEMS).filter(i => i.armorSlot === 'feet').length,
    weapon: Object.values(ALL_MYTHOLOGY_ITEMS).filter(i => i.type === 'weapon').length,
    accessory: Object.values(ALL_MYTHOLOGY_ITEMS).filter(i => i.type === 'accessory').length,
  },
};

// 套装ID列表
export const SET_IDS = [
  // 站台1-8
  'myth1_set', 'myth2_set', 'myth3_set', 'myth4_set',
  'myth5_set', 'myth6_set', 'myth7_set', 'myth8_set',
  // 站台9-16
  'myth9_set', 'myth10_set', 'myth11_set', 'myth12_set',
  'myth13_set', 'myth14_set', 'myth15_set', 'myth16_set',
  // 站台17-24
  'myth17_set', 'myth18_set', 'myth19_set', 'myth20_set',
  'myth21_set', 'myth22_set', 'myth23_set', 'myth24_set',
  // 站台25-32
  'myth25_set', 'myth26_set', 'myth27_set', 'myth28_set',
  'myth29_set', 'myth30_set', 'myth31_set', 'myth32_set',
];

export default ALL_MYTHOLOGY_ITEMS;
