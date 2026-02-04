import type { RegularLocation, EnemyTier, LootTableItem } from './types';
import { LocationType, LocationCategory } from './types';
import { MaterialQuality } from './craftingMaterials';

// ============================================
// 膨胀版探索系统 - 常规站台数据
// 基于《列车求生·10个普通站台专属设定（膨胀改造版）》
// 已替换原有地点，删除旧装备材料道具
// ============================================

// 站台材料品质掉落率配置
// 所有站台都可以掉落全部6种材料，但品质率不同
export const STATION_QUALITY_RATES: Record<number, Record<MaterialQuality, number>> = {
  1: { [MaterialQuality.NORMAL]: 0.70, [MaterialQuality.GOOD]: 0.25, [MaterialQuality.FINE]: 0.05, [MaterialQuality.RARE]: 0, [MaterialQuality.LEGENDARY]: 0 },
  2: { [MaterialQuality.NORMAL]: 0.65, [MaterialQuality.GOOD]: 0.28, [MaterialQuality.FINE]: 0.07, [MaterialQuality.RARE]: 0, [MaterialQuality.LEGENDARY]: 0 },
  3: { [MaterialQuality.NORMAL]: 0.60, [MaterialQuality.GOOD]: 0.30, [MaterialQuality.FINE]: 0.10, [MaterialQuality.RARE]: 0, [MaterialQuality.LEGENDARY]: 0 },
  4: { [MaterialQuality.NORMAL]: 0.55, [MaterialQuality.GOOD]: 0.32, [MaterialQuality.FINE]: 0.12, [MaterialQuality.RARE]: 0.01, [MaterialQuality.LEGENDARY]: 0 },
  5: { [MaterialQuality.NORMAL]: 0.50, [MaterialQuality.GOOD]: 0.35, [MaterialQuality.FINE]: 0.14, [MaterialQuality.RARE]: 0.01, [MaterialQuality.LEGENDARY]: 0 },
  6: { [MaterialQuality.NORMAL]: 0.45, [MaterialQuality.GOOD]: 0.34, [MaterialQuality.FINE]: 0.15, [MaterialQuality.RARE]: 0.05, [MaterialQuality.LEGENDARY]: 0.01 },
  7: { [MaterialQuality.NORMAL]: 0.40, [MaterialQuality.GOOD]: 0.32, [MaterialQuality.FINE]: 0.18, [MaterialQuality.RARE]: 0.07, [MaterialQuality.LEGENDARY]: 0.03 },
  8: { [MaterialQuality.NORMAL]: 0.35, [MaterialQuality.GOOD]: 0.30, [MaterialQuality.FINE]: 0.20, [MaterialQuality.RARE]: 0.10, [MaterialQuality.LEGENDARY]: 0.05 },
  9: { [MaterialQuality.NORMAL]: 0.30, [MaterialQuality.GOOD]: 0.28, [MaterialQuality.FINE]: 0.22, [MaterialQuality.RARE]: 0.10, [MaterialQuality.LEGENDARY]: 0.10 },
  10: { [MaterialQuality.NORMAL]: 0.25, [MaterialQuality.GOOD]: 0.25, [MaterialQuality.FINE]: 0.20, [MaterialQuality.RARE]: 0.10, [MaterialQuality.LEGENDARY]: 0.20 },
};

// 所有材料基础ID列表
export const ALL_MATERIAL_BASE_IDS = [
  { id: 'craft_iron', name: '铁矿碎片' },
  { id: 'craft_leather', name: '野兽皮革' },
  { id: 'craft_fabric', name: '粗布纤维' },
  { id: 'craft_wood', name: '坚韧木材' },
  { id: 'craft_crystal', name: '能量水晶' },
  { id: 'craft_essence', name: '怪物精华' },
];

// 根据站台获取材料品质掉落率
export function getQualityRatesForStation(stationNumber: number): Record<MaterialQuality, number> {
  return STATION_QUALITY_RATES[stationNumber] || STATION_QUALITY_RATES[1];
}

// 随机选择材料品质
export function rollMaterialQuality(stationNumber: number): MaterialQuality {
  const rates = getQualityRatesForStation(stationNumber);
  const roll = Math.random();
  let cumulative = 0;

  for (const [quality, rate] of Object.entries(rates)) {
    cumulative += rate;
    if (roll <= cumulative) {
      return parseInt(quality) as MaterialQuality;
    }
  }

  return MaterialQuality.NORMAL;
}

// 敌人等级定义
export const ENEMY_TIERS: Record<EnemyTier, {
  name: string;
  hpMultiplier: number;
  attackMultiplier: number;
  defenseMultiplier: number;
  expMultiplier: number;
  lootQuality: number;
}> = {
  T1: {
    name: '普通级',
    hpMultiplier: 1.0,
    attackMultiplier: 1.0,
    defenseMultiplier: 1.0,
    expMultiplier: 1.0,
    lootQuality: 1,
  },
  'T1+': {
    name: '普通+级',
    hpMultiplier: 1.3,
    attackMultiplier: 1.2,
    defenseMultiplier: 1.2,
    expMultiplier: 1.3,
    lootQuality: 1.5,
  },
  T2: {
    name: '精英级',
    hpMultiplier: 1.6,
    attackMultiplier: 1.5,
    defenseMultiplier: 1.5,
    expMultiplier: 1.8,
    lootQuality: 2,
  },
  'T2+': {
    name: '精英+级',
    hpMultiplier: 2.0,
    attackMultiplier: 1.8,
    defenseMultiplier: 1.8,
    expMultiplier: 2.3,
    lootQuality: 2.5,
  },
  T3: {
    name: '首领级',
    hpMultiplier: 2.5,
    attackMultiplier: 2.2,
    defenseMultiplier: 2.2,
    expMultiplier: 3.0,
    lootQuality: 3,
  },
  'T3+': {
    name: '首领+级',
    hpMultiplier: 3.0,
    attackMultiplier: 2.6,
    defenseMultiplier: 2.6,
    expMultiplier: 4.0,
    lootQuality: 4,
  },
  'T3++': {
    name: '传说级',
    hpMultiplier: 3.5,
    attackMultiplier: 3.0,
    defenseMultiplier: 3.0,
    expMultiplier: 5.0,
    lootQuality: 5,
  },
  'T4': {
    name: '神话级',
    hpMultiplier: 4.0,
    attackMultiplier: 3.5,
    defenseMultiplier: 3.5,
    expMultiplier: 6.0,
    lootQuality: 6,
  },
  'T4+': {
    name: '神话+级',
    hpMultiplier: 4.5,
    attackMultiplier: 4.0,
    defenseMultiplier: 4.0,
    expMultiplier: 7.0,
    lootQuality: 7,
  },
  'T5': {
    name: '半神级',
    hpMultiplier: 5.0,
    attackMultiplier: 4.5,
    defenseMultiplier: 4.5,
    expMultiplier: 8.0,
    lootQuality: 8,
  },
  'T5+': {
    name: '半神+级',
    hpMultiplier: 5.5,
    attackMultiplier: 5.0,
    defenseMultiplier: 5.0,
    expMultiplier: 9.0,
    lootQuality: 9,
  },
  'T6': {
    name: '真神级',
    hpMultiplier: 6.0,
    attackMultiplier: 5.5,
    defenseMultiplier: 5.5,
    expMultiplier: 10.0,
    lootQuality: 10,
  },
  'T6+': {
    name: '真神+级',
    hpMultiplier: 6.5,
    attackMultiplier: 6.0,
    defenseMultiplier: 6.0,
    expMultiplier: 11.0,
    lootQuality: 11,
  },
  'T7': {
    name: '主神级',
    hpMultiplier: 7.0,
    attackMultiplier: 6.5,
    defenseMultiplier: 6.5,
    expMultiplier: 12.0,
    lootQuality: 12,
  },
  'T7+': {
    name: '主神+级',
    hpMultiplier: 7.5,
    attackMultiplier: 7.0,
    defenseMultiplier: 7.0,
    expMultiplier: 13.0,
    lootQuality: 13,
  },
  'T8': {
    name: '创世级',
    hpMultiplier: 8.0,
    attackMultiplier: 7.5,
    defenseMultiplier: 7.5,
    expMultiplier: 14.0,
    lootQuality: 14,
  },
};

// 基础敌人属性（T1级别基准）
export const BASE_ENEMY_STATS = {
  hp: 200,
  attack: 20,
  defense: 10,
  hitRate: 100,
  dodgeRate: 15,
  attackSpeed: 1.0,
  critRate: 0.05,
  penetration: 0,
  skillCoefficient: 1.0,
};

// 计算敌人实际属性
export function calculateEnemyStats(tier: EnemyTier, level: number = 1) {
  const tierData = ENEMY_TIERS[tier];
  const levelMultiplier = 1 + (level - 1) * 0.1; // 每级提升10%

  return {
    hp: Math.floor(BASE_ENEMY_STATS.hp * tierData.hpMultiplier * levelMultiplier),
    attack: Math.floor(BASE_ENEMY_STATS.attack * tierData.attackMultiplier * levelMultiplier),
    defense: Math.floor(BASE_ENEMY_STATS.defense * tierData.defenseMultiplier * levelMultiplier),
    hitRate: BASE_ENEMY_STATS.hitRate + (tierData.lootQuality * 5),
    dodgeRate: BASE_ENEMY_STATS.dodgeRate + (tierData.lootQuality * 3),
    attackSpeed: BASE_ENEMY_STATS.attackSpeed + (tierData.lootQuality * 0.05),
    critRate: Math.min(0.3, BASE_ENEMY_STATS.critRate + (tierData.lootQuality * 0.02)),
    penetration: tierData.lootQuality * 0.01,
    skillCoefficient: BASE_ENEMY_STATS.skillCoefficient + (tierData.lootQuality * 0.1),
    expReward: Math.floor(50 * tierData.expMultiplier * levelMultiplier),
  };
}

// 膨胀版常规站台数据 - 已完全替换原有地点
export const REGULAR_LOCATIONS: RegularLocation[] = [
  {
    id: 'loc_001',
    name: '锈蚀荒原补给站',
    description: '位于荒原腹地，曾是旧时代列车临时补给点，站台地面布满锈蚀铁轨残骸，四周被枯黄杂草和废弃货箱环绕。',
    type: LocationType.STATION,
    dangerLevel: 1,
    resourceRichness: 3,
    icon: '🚉',
    category: LocationCategory.REGULAR,
    // 膨胀版新增属性
    enemyTier: 'T1',
    eliteEnemyTier: 'T1+',
    bossTier: 'T2',
    baseEnemyLevel: 1,
    enemyTypes: ['锈蚀鼠', '铁屑蠕虫', '锈蚀甲虫'],
    eliteEnemyTypes: ['锈蚀巨鼠', '铁屑巨蠕虫'],
    bossName: '锈蚀蠕虫王',
    bossDescription: '体型庞大，可同时缠绕2名玩家，会周期性喷射铁屑弹幕',
    specialMechanics: ['锈蚀debuff', '群居加成', '铁屑喷射'],
    explorationTime: 30, // 基础探索时间（分钟）
    staminaCost: 5,
    recommendedPower: 25,
    lootTable: {
      common: [
        { itemId: 'craft_iron', weight: 40, name: '铁矿碎片' },
        { itemId: 'craft_fabric', weight: 30, name: '粗布纤维' },
        { itemId: 'craft_wood', weight: 20, name: '坚韧木材' },
      ],
      rare: [
        { itemId: 'craft_leather', weight: 15, name: '野兽皮革' },
        { itemId: 'craft_iron', weight: 10, name: '铁矿碎片' },
      ],
      epic: [
        { itemId: 'craft_leather', weight: 5, name: '野兽皮革' },
      ],
    },
    equipmentDrops: [
      { itemId: 'weapon_iron_dagger', weight: 10, name: '铁制匕首' },
      { itemId: 'armor_cloth_cap', weight: 15, name: '布制防尘帽' },
      { itemId: 'armor_canvas_pants', weight: 15, name: '帆布护裤' },
    ],
  },
  {
    id: 'loc_002',
    name: '荒原临时维修站',
    description: '旧时代列车维修工人的临时据点，站台中央有废弃的维修台，散落着大量维修工具残骸。',
    type: LocationType.STATION,
    dangerLevel: 2,
    resourceRichness: 4,
    icon: '🔧',
    category: LocationCategory.REGULAR,
    enemyTier: 'T1',
    eliteEnemyTier: 'T2',
    bossTier: 'T2+',
    baseEnemyLevel: 2,
    enemyTypes: ['机油蠕虫', '维修傀儡', '机油甲虫'],
    eliteEnemyTypes: ['机油巨蠕虫', '强化维修傀儡'],
    bossName: '维修机械王',
    bossDescription: '由大量废弃维修工具和列车零件拼接而成，可挥舞巨型扳手攻击',
    specialMechanics: ['油污debuff', '撞击眩晕', '召唤傀儡'],
    explorationTime: 35,
    staminaCost: 6,
    recommendedPower: 35,
    lootTable: {
      common: [
        { itemId: 'craft_iron', weight: 40, name: '铁矿碎片' },
        { itemId: 'craft_wood', weight: 30, name: '坚韧木材' },
        { itemId: 'craft_fabric', weight: 20, name: '粗布纤维' },
      ],
      rare: [
        { itemId: 'craft_iron', weight: 15, name: '铁矿碎片' },
        { itemId: 'craft_leather', weight: 10, name: '野兽皮革' },
      ],
      epic: [
        { itemId: 'craft_iron', weight: 5, name: '铁矿碎片' },
      ],
    },
    equipmentDrops: [
      { itemId: 'weapon_iron_wrench', weight: 10, name: '铁制扳手' },
      { itemId: 'armor_plastic_helmet', weight: 15, name: '塑料防护帽' },
      { itemId: 'armor_leather_pants', weight: 15, name: '皮质护裤' },
    ],
  },
  {
    id: 'loc_003',
    name: '风沙遮蔽站',
    description: '位于风沙频发的荒原地带，是旧时代为躲避强风沙建造的临时遮蔽站，站台被厚重的混凝土围墙环绕。',
    type: LocationType.STATION,
    dangerLevel: 3,
    resourceRichness: 4,
    icon: '🌪️',
    category: LocationCategory.REGULAR,
    enemyTier: 'T1+',
    eliteEnemyTier: 'T2',
    bossTier: 'T2+',
    baseEnemyLevel: 3,
    enemyTypes: ['风沙蝎', '沙虫', '风沙蚁'],
    eliteEnemyTypes: ['巨风沙蝎', '沙虫首领'],
    bossName: '风沙巨蝎王',
    bossDescription: '体型庞大，外壳坚硬，尾部可喷射毒刺，会周期性掀起强风沙',
    specialMechanics: ['中毒debuff', '减速debuff', '沙尘掩护', '视野降低'],
    explorationTime: 40,
    staminaCost: 7,
    recommendedPower: 45,
    lootTable: {
      common: [
        { itemId: 'craft_leather', weight: 35, name: '野兽皮革' },
        { itemId: 'craft_fabric', weight: 30, name: '粗布纤维' },
        { itemId: 'craft_wood', weight: 25, name: '坚韧木材' },
      ],
      rare: [
        { itemId: 'craft_leather', weight: 15, name: '野兽皮革' },
        { itemId: 'craft_iron', weight: 10, name: '铁矿碎片' },
      ],
      epic: [
        { itemId: 'craft_leather', weight: 5, name: '野兽皮革' },
      ],
    },
    equipmentDrops: [
      { itemId: 'weapon_iron_spear', weight: 10, name: '铁制长矛' },
      { itemId: 'armor_leather_wind_cap', weight: 15, name: '皮质防风帽' },
      { itemId: 'accessory_wind_goggles', weight: 10, name: '防风眼镜' },
    ],
  },
  {
    id: 'loc_004',
    name: '废弃粮仓补给站',
    description: '旧时代荒原的粮食储备点，站台中央有一座废弃的粮仓，内部散落着发霉的粮食和废弃的粮袋。',
    type: LocationType.STATION,
    dangerLevel: 3,
    resourceRichness: 5,
    icon: '🌾',
    category: LocationCategory.REGULAR,
    enemyTier: 'T1+',
    eliteEnemyTier: 'T2+',
    bossTier: 'T3',
    baseEnemyLevel: 4,
    enemyTypes: ['荒原野兔', '发霉蠕虫', '粮袋巨鼠'],
    eliteEnemyTypes: ['变异荒原野兔', '发霉巨蠕虫'],
    bossName: '粮袋鼠王',
    bossDescription: '体型巨大，浑身缠绕废弃粮袋，会周期性喷射发霉粮食',
    specialMechanics: ['发霉debuff', '粮食装甲', '毒素喷射'],
    explorationTime: 45,
    staminaCost: 8,
    recommendedPower: 55,
    lootTable: {
      common: [
        { itemId: 'craft_fabric', weight: 35, name: '粗布纤维' },
        { itemId: 'craft_leather', weight: 30, name: '野兽皮革' },
        { itemId: 'craft_wood', weight: 25, name: '坚韧木材' },
      ],
      rare: [
        { itemId: 'craft_fabric', weight: 15, name: '粗布纤维' },
        { itemId: 'craft_iron', weight: 10, name: '铁矿碎片' },
      ],
      epic: [
        { itemId: 'craft_fabric', weight: 5, name: '粗布纤维' },
      ],
    },
    equipmentDrops: [
      { itemId: 'weapon_iron_knife', weight: 10, name: '铁制短刀' },
      { itemId: 'armor_cloth_cap_2', weight: 15, name: '布制护帽' },
      { itemId: 'accessory_sack_bag', weight: 10, name: '粮袋收纳包' },
    ],
  },
  {
    id: 'loc_005',
    name: '岩石峭壁中继站',
    description: '位于岩石峭壁下方，是旧时代列车翻越峭壁的临时中继站，站台地面由坚硬的岩石铺成。',
    type: LocationType.STATION,
    dangerLevel: 4,
    resourceRichness: 4,
    icon: '⛰️',
    category: LocationCategory.REGULAR,
    enemyTier: 'T2',
    eliteEnemyTier: 'T2+',
    bossTier: 'T3',
    baseEnemyLevel: 5,
    enemyTypes: ['岩石蜥蜴', '峭壁蠕虫', '岩石甲虫'],
    eliteEnemyTypes: ['巨型岩石蜥蜴', '峭壁巨蠕虫'],
    bossName: '岩石巨蜥王',
    bossDescription: '体型巨大，体表岩石外壳坚硬，可喷射岩石弹幕，会撞击峭壁掉落碎石',
    specialMechanics: ['岩石弹幕', '眩晕debuff', '落石伤害', '破甲'],
    explorationTime: 50,
    staminaCost: 9,
    recommendedPower: 65,
    lootTable: {
      common: [
        { itemId: 'craft_iron', weight: 40, name: '铁矿碎片' },
        { itemId: 'craft_iron', weight: 30, name: '铁矿碎片' },
        { itemId: 'craft_wood', weight: 20, name: '坚韧木材' },
      ],
      rare: [
        { itemId: 'craft_crystal', weight: 15, name: '能量水晶' },
        { itemId: 'craft_iron', weight: 10, name: '铁矿碎片' },
      ],
      epic: [
        { itemId: 'craft_crystal', weight: 5, name: '能量水晶' },
      ],
    },
    equipmentDrops: [
      { itemId: 'weapon_stone_blade', weight: 10, name: '石制长刀' },
      { itemId: 'armor_rock_helmet', weight: 15, name: '岩石防护帽' },
      { itemId: 'accessory_rock_pendant', weight: 10, name: '岩石挂坠' },
    ],
  },
  {
    id: 'loc_006',
    name: '废弃水源补给站',
    description: '旧时代荒原的水源储备点，站台中央有一口废弃的水井，四周有废弃的水桶和水管。',
    type: LocationType.STATION,
    dangerLevel: 4,
    resourceRichness: 5,
    icon: '💧',
    category: LocationCategory.REGULAR,
    enemyTier: 'T2',
    eliteEnemyTier: 'T2+',
    bossTier: 'T3',
    baseEnemyLevel: 6,
    enemyTypes: ['水洼蠕虫', '污水鼠', '水生甲虫'],
    eliteEnemyTypes: ['巨型水洼蠕虫', '污水巨鼠'],
    bossName: '水生甲虫王',
    bossDescription: '体型巨大，甲虫壳坚硬，可在水中快速移动，会喷射水箭',
    specialMechanics: ['寄生', '中毒debuff', '水中优势', '视野模糊'],
    explorationTime: 50,
    staminaCost: 9,
    recommendedPower: 70,
    lootTable: {
      common: [
        { itemId: 'craft_wood', weight: 35, name: '坚韧木材' },
        { itemId: 'craft_fabric', weight: 30, name: '粗布纤维' },
        { itemId: 'craft_iron', weight: 20, name: '铁矿碎片' },
      ],
      rare: [
        { itemId: 'craft_crystal', weight: 15, name: '能量水晶' },
        { itemId: 'craft_essence', weight: 10, name: '怪物精华' },
      ],
      epic: [
        { itemId: 'craft_crystal', weight: 5, name: '能量水晶' },
      ],
    },
    equipmentDrops: [
      { itemId: 'weapon_iron_short_club', weight: 10, name: '铁制短棍' },
      { itemId: 'armor_waterproof_cap', weight: 15, name: '布制防水帽' },
      { itemId: 'accessory_bucket_hook', weight: 10, name: '水桶挂扣' },
    ],
  },
  {
    id: 'loc_007',
    name: '荒原废弃驿站',
    description: '旧时代旅人穿越荒原的临时驿站，站台内有废弃的房屋和桌椅，驿站外会周期性出现荒原狼群。',
    type: LocationType.STATION,
    dangerLevel: 5,
    resourceRichness: 4,
    icon: '🏚️',
    category: LocationCategory.REGULAR,
    enemyTier: 'T2',
    eliteEnemyTier: 'T2+',
    bossTier: 'T3',
    baseEnemyLevel: 7,
    enemyTypes: ['荒原狼', '废弃傀儡', '荒原野狗'],
    eliteEnemyTypes: ['精英荒原狼', '强化废弃傀儡'],
    bossName: '荒原狼王',
    bossDescription: '体型庞大，奔跑速度极快，可同时攻击2名玩家，会周期性召唤荒原狼',
    specialMechanics: ['群居加成', '流血debuff', '召唤小弟', '嗜血'],
    explorationTime: 55,
    staminaCost: 10,
    recommendedPower: 80,
    lootTable: {
      common: [
        { itemId: 'craft_leather', weight: 35, name: '野兽皮革' },
        { itemId: 'craft_wood', weight: 30, name: '坚韧木材' },
        { itemId: 'craft_fabric', weight: 25, name: '粗布纤维' },
      ],
      rare: [
        { itemId: 'craft_leather', weight: 15, name: '野兽皮革' },
        { itemId: 'craft_crystal', weight: 10, name: '能量水晶' },
      ],
      epic: [
        { itemId: 'craft_essence', weight: 5, name: '怪物精华' },
      ],
    },
    equipmentDrops: [
      { itemId: 'weapon_iron_long_sword', weight: 10, name: '铁制长剑' },
      { itemId: 'armor_leather_traveler_cap', weight: 15, name: '皮质旅人帽' },
      { itemId: 'accessory_traveler_pendant', weight: 10, name: '旅人挂坠' },
    ],
  },
  {
    id: 'loc_008',
    name: '金属废料回收站',
    description: '旧时代的金属废料回收据点，站台内堆积着大量废弃的金属废料和破碎的机械部件。',
    type: LocationType.STATION,
    dangerLevel: 5,
    resourceRichness: 5,
    icon: '⚙️',
    category: LocationCategory.REGULAR,
    enemyTier: 'T2+',
    eliteEnemyTier: 'T3',
    bossTier: 'T3+',
    baseEnemyLevel: 8,
    enemyTypes: ['锈蚀巨鼠', '金属蠕虫', '金属甲虫'],
    eliteEnemyTypes: ['巨型锈蚀巨鼠', '金属巨蠕虫'],
    bossName: '金属傀儡王',
    bossDescription: '由大量金属废料拼接而成，可挥舞巨型金属斧攻击，会周期性喷射金属碎屑弹幕',
    specialMechanics: ['金属弹幕', '锈蚀debuff', '自我修复', '破甲'],
    explorationTime: 60,
    staminaCost: 11,
    recommendedPower: 90,
    lootTable: {
      common: [
        { itemId: 'craft_iron', weight: 40, name: '铁矿碎片' },
        { itemId: 'craft_iron', weight: 30, name: '铁矿碎片' },
        { itemId: 'craft_crystal', weight: 20, name: '能量水晶' },
      ],
      rare: [
        { itemId: 'craft_crystal', weight: 15, name: '能量水晶' },
        { itemId: 'craft_essence', weight: 10, name: '怪物精华' },
      ],
      epic: [
        { itemId: 'craft_essence', weight: 5, name: '怪物精华' },
      ],
    },
    equipmentDrops: [
      { itemId: 'weapon_metal_axe', weight: 10, name: '金属战斧' },
      { itemId: 'armor_metal_helmet', weight: 15, name: '金属防护帽' },
      { itemId: 'accessory_metal_box', weight: 10, name: '金属收纳盒' },
    ],
  },
  {
    id: 'loc_009',
    name: '低温荒原避风站',
    description: '位于低温荒原地带，是旧时代为躲避低温和强风建造的避风站，地面覆盖着薄冰。',
    type: LocationType.STATION,
    dangerLevel: 5,
    resourceRichness: 4,
    icon: '❄️',
    category: LocationCategory.REGULAR,
    enemyTier: 'T2+',
    eliteEnemyTier: 'T3',
    bossTier: 'T3+',
    baseEnemyLevel: 9,
    enemyTypes: ['低温野兔', '冰屑蠕虫', '低温甲虫'],
    eliteEnemyTypes: ['变异低温野兔', '冰屑巨蠕虫'],
    bossName: '低温狼',
    bossDescription: '适应低温环境，体型庞大，奔跑速度极快，会喷射寒气',
    specialMechanics: ['冻伤debuff', '减速debuff', '低温适应', '寒气喷射'],
    explorationTime: 60,
    staminaCost: 11,
    recommendedPower: 95,
    lootTable: {
      common: [
        { itemId: 'mat_warm_rabbit_fur', weight: 35, name: '保暖兔毛' },
        { itemId: 'mat_ice_debris', weight: 30, name: '冰屑' },
        { itemId: 'mat_ice_shell_fragment', weight: 25, name: '冰壳碎片' },
      ],
      rare: [
        { itemId: 'mat_quality_warm_fur', weight: 15, name: '优质保暖兔毛' },
        { itemId: 'mat_ice_crystal', weight: 10, name: '冰结晶' },
      ],
      epic: [
        { itemId: 'mat_low_temp_core', weight: 5, name: '低温核心' },
      ],
    },
    equipmentDrops: [
      { itemId: 'weapon_iron_hunting_knife', weight: 10, name: '铁制猎刀' },
      { itemId: 'armor_leather_warm_cap', weight: 15, name: '皮质保暖帽' },
      { itemId: 'accessory_warm_scarf', weight: 10, name: '保暖围巾' },
    ],
  },
  {
    id: 'loc_010',
    name: '荒原边境哨站',
    description: '位于荒原边缘地带，是旧时代监视荒原动态的边境哨站，这里汇聚了前面所有站台的怪物类型。',
    type: LocationType.STATION,
    dangerLevel: 5,
    resourceRichness: 5,
    icon: '🏛️',
    category: LocationCategory.REGULAR,
    enemyTier: 'T3',
    eliteEnemyTier: 'T3+',
    bossTier: 'T3++',
    baseEnemyLevel: 10,
    enemyTypes: ['边境游荡者', '废弃哨兵', '荒原游荡犬'],
    eliteEnemyTypes: ['边境精英游荡者', '强化废弃哨兵'],
    bossName: '边境守望者',
    bossDescription: '荒原边境的最终守护者，拥有召唤援军和边境领域能力',
    specialMechanics: ['边境领域', '召唤援军', '最终警戒', '全属性提升'],
    explorationTime: 70,
    staminaCost: 12,
    recommendedPower: 110,
    lootTable: {
      common: [
        { itemId: 'mat_border_relic', weight: 35, name: '边境遗物' },
        { itemId: 'mat_sentry_parts', weight: 30, name: '哨兵零件' },
        { itemId: 'mat_signal_fragment', weight: 25, name: '信号装置碎片' },
      ],
      rare: [
        { itemId: 'mat_elite_badge', weight: 15, name: '精英徽章' },
        { itemId: 'mat_enhanced_signal', weight: 10, name: '强化信号装置' },
      ],
      epic: [
        { itemId: 'mat_border_core', weight: 5, name: '边境核心' },
        { itemId: 'mat_pass_fragment', weight: 3, name: '通行证碎片' },
      ],
    },
    equipmentDrops: [
      { itemId: 'weapon_border_sword', weight: 10, name: '边境长剑' },
      { itemId: 'weapon_sentry_rifle', weight: 8, name: '哨兵步枪' },
      { itemId: 'armor_border_cap', weight: 15, name: '边境哨兵帽' },
      { itemId: 'accessory_border_badge', weight: 10, name: '边境徽章' },
    ],
  },
];

// 为了保持向后兼容，导出 LOCATIONS 别名
export const LOCATIONS = REGULAR_LOCATIONS;

// 探索奖励计算函数 - 基于新膨胀版系统
export function calculateExplorationRewards(
  locationId: string,
  explorationProgress: number,
  isBossDefeated: boolean
): { itemId: string; quantity: number; name: string }[] {
  const location = REGULAR_LOCATIONS.find(l => l.id === locationId);
  if (!location) return [];

  const rewards: { itemId: string; quantity: number; name: string }[] = [];

  // 基础奖励
  const baseRewardCount = Math.floor(explorationProgress / 20) + 1;

  // 根据探索进度添加普通奖励
  for (let i = 0; i < baseRewardCount; i++) {
    const lootTable = location.lootTable.common;
    const totalWeight = lootTable.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    for (const loot of lootTable) {
      random -= loot.weight;
      if (random <= 0) {
        const existing = rewards.find(r => r.itemId === loot.itemId);
        if (existing) {
          existing.quantity += 1;
        } else {
          rewards.push({ itemId: loot.itemId, quantity: 1, name: loot.name });
        }
        break;
      }
    }
  }

  // 根据进度添加稀有奖励
  if (explorationProgress >= 50) {
    const rareLootTable = location.lootTable.rare;
    const totalWeight = rareLootTable.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    for (const loot of rareLootTable) {
      random -= loot.weight;
      if (random <= 0) {
        const existing = rewards.find(r => r.itemId === loot.itemId);
        if (existing) {
          existing.quantity += 1;
        } else {
          rewards.push({ itemId: loot.itemId, quantity: 1, name: loot.name });
        }
        break;
      }
    }
  }

  // Boss击败奖励
  if (isBossDefeated && location.lootTable.epic) {
    const epicLootTable = location.lootTable.epic;
    const totalWeight = epicLootTable.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    for (const loot of epicLootTable) {
      random -= loot.weight;
      if (random <= 0) {
        const existing = rewards.find(r => r.itemId === loot.itemId);
        if (existing) {
          existing.quantity += 1;
        } else {
          rewards.push({ itemId: loot.itemId, quantity: 1, name: loot.name });
        }
        break;
      }
    }
  }

  return rewards;
}

// 获取推荐战力
export function getRecommendedPower(locationId: string): number {
  const location = REGULAR_LOCATIONS.find(l => l.id === locationId);
  return location?.recommendedPower || 25;
}

// 获取敌人等级信息
export function getEnemyTierInfo(locationId: string): {
  normal: string;
  elite: string;
  boss: string;
} {
  const location = REGULAR_LOCATIONS.find(l => l.id === locationId);
  if (!location) return { normal: 'T1', elite: 'T1+', boss: 'T2' };

  return {
    normal: location.enemyTier,
    elite: location.eliteEnemyTier,
    boss: location.bossTier,
  };
}

// 获取随机战利品 - 兼容旧接口
export function getRandomLoot(locationId: string): string | null {
  const location = REGULAR_LOCATIONS.find(l => l.id === locationId);
  if (!location) return null;

  const lootTable = location.lootTable.common;
  if (!lootTable || lootTable.length === 0) return null;

  const totalWeight = lootTable.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;

  for (const loot of lootTable) {
    random -= loot.weight;
    if (random <= 0) {
      return loot.itemId;
    }
  }

  return lootTable[lootTable.length - 1].itemId;
}
