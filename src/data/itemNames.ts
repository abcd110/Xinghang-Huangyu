// 物品中文名称映射
export const ITEM_NAME_MAP: Record<string, string> = {
  // 基础材料 - 纳米战甲制造材料（简化版）
  'mat_001': '星铁基础构件',
  'mat_003': '钛钢外甲坯料',
  'mat_004': '战甲能量晶核',
  'mat_005': '稀土传感基质',
  'mat_006': '虚空防护核心',
  'mat_007': '推进模块燃料',
  'mat_010': '量子紧固组件',

  // 神话站台材料
  'bronze_fragment': '青铜碎片',
  'light_shard': '光芒碎片',
  'valhalla_weapon': '英灵武器残片',
  'fog_crystal': '迷雾结晶',
  'rainbow_shard': '彩虹碎片',
  'space_crystal': '空间结晶',
  'olympus_ash': '奥林匹斯灰烬',
  'divine_spark': '神性火花',
  'prophecy_fragment': '预言碎片',
  'wisdom_ice': '智慧冰晶',
  'hel_soul': '赫尔之魂',
  'abyss_essence': '深渊精华',
  'godless_relic': '无神遗物',
  'authority_shard': '权限碎片',

  // 战利品
  'monster_fang': '怪物尖牙',
  'monster_hide': '怪物皮革',
  'monster_core': '怪物核心',
  'corrupted_blood': '腐化之血',
  'ancient_coin': '古老硬币',
  'mysterious_scroll': '神秘卷轴',

  // 食物和水
  'food_canned': '罐头食品',
  'food_dried': '干粮',
  'water_clean': '纯净水',
  'water_filtered': '过滤水',

  // 药品
  'med_bandage': '绷带',
  'med_painkiller': '止痛药',
  'med_antidote': '解毒剂',
  'med_stimulant': '兴奋剂',
};

// 获取物品中文名
export function getItemName(itemId: string): string {
  return ITEM_NAME_MAP[itemId] || itemId;
}

// 获取物品带图标的中文名
export function getItemNameWithIcon(itemId: string): string {
  const name = getItemName(itemId);
  const icon = getItemIcon(itemId);
  return `${icon} ${name}`;
}

// 获取物品图标
function getItemIcon(itemId: string): string {
  if (itemId.includes('bronze') || itemId.includes('mat_001')) return '🔩';
  if (itemId.includes('mat_003')) return '🔧';
  if (itemId.includes('mat_004')) return '💎';
  if (itemId.includes('mat_005')) return '🧪';
  if (itemId.includes('mat_006')) return '🔮';
  if (itemId.includes('mat_007')) return '⛽';
  if (itemId.includes('mat_010')) return '🔩';
  if (itemId.includes('light') || itemId.includes('shard')) return '✨';
  if (itemId.includes('weapon')) return '⚔️';
  if (itemId.includes('fog') || itemId.includes('crystal')) return '💎';
  if (itemId.includes('rainbow')) return '🌈';
  if (itemId.includes('space')) return '🌌';
  if (itemId.includes('olympus') || itemId.includes('divine')) return '🔥';
  if (itemId.includes('prophecy')) return '🔮';
  if (itemId.includes('wisdom') || itemId.includes('ice')) return '🧊';
  if (itemId.includes('hel') || itemId.includes('soul')) return '👻';
  if (itemId.includes('abyss')) return '🌑';
  if (itemId.includes('godless') || itemId.includes('relic')) return '🏛️';
  if (itemId.includes('authority')) return '🔑';
  if (itemId.includes('monster')) return '💀';
  if (itemId.includes('food') || itemId.includes('canned')) return '🥫';
  if (itemId.includes('water')) return '💧';
  if (itemId.includes('med')) return '💊';
  if (itemId.includes('coin')) return '🪙';
  if (itemId.includes('scroll')) return '📜';
  return '📦';
}
