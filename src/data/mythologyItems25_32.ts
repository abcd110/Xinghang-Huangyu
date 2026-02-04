import type { Item } from './types';
import { ItemType, ItemRarity, EquipmentEffectType, EffectTrigger } from './types';

// ============================================
// 神话站台专属装备数据 - 站台25-32
// 神话品质·终极装备 - 最高品质
// 6件套效果：全属性+40%，激活终极专属技能
// ============================================

export const MYTHOLOGY_ITEMS_25_32: Record<string, Item> = {
  // ============================================
  // 站台25：黑夜倪克斯站（T11装备 - 神话品质·终极）
  // 套装效果：6件套全属性+40%，激活专属技能「黑夜降临」
  // ============================================

  'myth25_helmet_nyx_night': {
    id: 'myth25_helmet_nyx_night', name: '黑夜女神头盔', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '倪克斯站神话防具，防御+210，生命+1520，减伤60%，免疫黑夜失明，被攻击时35%概率隐身3秒。',
    defense: 210, maxHp: 1520, damageReduction: 0.60, armorSlot: 'head',
    requiredLevel: 40, power: 724.0, sublimationLevel: 0,
    setId: 'myth25_set',
  },
  'myth25_chest_nyx_dark': {
    id: 'myth25_chest_nyx_dark', name: '倪克斯黑夜铠甲', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '倪克斯站神话防具，防御+254，生命+1880，攻击+48%，完全隐藏自身气息，夜间全属性+20%。',
    defense: 254, maxHp: 1880, armorSlot: 'chest',
    requiredLevel: 40, power: 886.0, sublimationLevel: 0,
    setId: 'myth25_set',
  },
  'myth25_legs_nyx_night': {
    id: 'myth25_legs_nyx_night', name: '黑夜护裤', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '倪克斯站神话防具，防御+178，闪避+90%，闪避时恢复200生命并隐身2秒，免疫黑夜减速。',
    defense: 178, dodgeRate: 0.90, armorSlot: 'legs',
    requiredLevel: 40, power: 538.0, sublimationLevel: 0,
    setId: 'myth25_set',
  },
  'myth25_feet_nyx_night': {
    id: 'myth25_feet_nyx_night', name: '倪克斯踏靴', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '倪克斯站神话防具，闪避+100%，攻速+68%，夜间移动速度+50%，免疫所有黑暗陷阱，攻击时45%概率降低敌人命中50。',
    defense: 0, dodgeRate: 1.0, speed: 0.68, armorSlot: 'feet',
    requiredLevel: 40, power: 482.0, sublimationLevel: 0,
    setId: 'myth25_set',
  },
  'myth25_weapon_nyx_blade': {
    id: 'myth25_weapon_nyx_blade', name: '倪克斯之刃', type: ItemType.WEAPON, rarity: ItemRarity.MYTHIC,
    description: '倪克斯站神话武器，攻击+372，穿透+88%，攻击时85%概率触发黑夜降临（额外300%攻击力伤害，隐身5秒，夜间伤害+80%）。',
    attack: 372, penetration: 0.88,
    requiredLevel: 40, power: 1724.0, sublimationLevel: 0,
    setId: 'myth25_set',
  },
  'myth25_accessory_nyx_veil': {
    id: 'myth25_accessory_nyx_veil', name: '倪克斯之星碎片', type: ItemType.ACCESSORY, rarity: ItemRarity.MYTHIC,
    description: '倪克斯站神话饰品，命中+164，暴击+50%，真实伤害+55%，夜间暴击率+40%，生命低于30%时自动隐身8秒（每场战斗1次）。',
    hitRate: 164, critRate: 0.50, trueDamage: 0.55,
    requiredLevel: 40, power: 484.0, sublimationLevel: 0,
    setId: 'myth25_set',
  },

  // ============================================
  // 站台26：爱箭厄洛斯站（T10+装备 - 神话品质·终极）
  // 套装效果：6件套全属性+40%，激活专属技能「爱神之箭」
  // ============================================

  'myth26_helmet_eros_love': {
    id: 'myth26_helmet_eros_love', name: '爱神头盔', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '厄洛斯站神话防具，防御+192，生命+1400，减伤52%，免疫所有迷惑debuff，被攻击时40%概率迷惑攻击者4秒。',
    defense: 192, maxHp: 1400, damageReduction: 0.52, armorSlot: 'head',
    requiredLevel: 39, power: 660.0, sublimationLevel: 0,
    setId: 'myth26_set',
  },
  'myth26_chest_eros_love': {
    id: 'myth26_chest_eros_love', name: '厄洛斯爱神铠甲', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '厄洛斯站神话防具，防御+232，生命+1720，攻击+44%，可迷惑高级怪物，对迷惑敌人伤害+60%。',
    defense: 232, maxHp: 1720, armorSlot: 'chest',
    requiredLevel: 39, power: 808.0, sublimationLevel: 0,
    setId: 'myth26_set',
  },
  'myth26_legs_eros_arrow': {
    id: 'myth26_legs_eros_arrow', name: '爱神护裤', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '厄洛斯站神话防具，防御+162，闪避+82%，闪避时恢复180生命并迷惑附近敌人3秒，免疫迷惑减速。',
    defense: 162, dodgeRate: 0.82, armorSlot: 'legs',
    requiredLevel: 39, power: 490.0, sublimationLevel: 0,
    setId: 'myth26_set',
  },
  'myth26_feet_eros_arrow': {
    id: 'myth26_feet_eros_arrow', name: '厄洛斯踏靴', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '厄洛斯站神话防具，闪避+92%，攻速+62%，攻击速度+25%，免疫弓箭陷阱，攻击时50%概率附加迷惑效果。',
    defense: 0, dodgeRate: 0.92, speed: 0.62, armorSlot: 'feet',
    requiredLevel: 39, power: 438.0, sublimationLevel: 0,
    setId: 'myth26_set',
  },
  'myth26_weapon_eros_bow': {
    id: 'myth26_weapon_eros_bow', name: '厄洛斯之弓', type: ItemType.WEAPON, rarity: ItemRarity.MYTHIC,
    description: '厄洛斯站神话武器，攻击+342，穿透+80%，攻击时80%概率触发爱神之箭（额外280%攻击力伤害，迷惑敌人6秒，对迷惑敌人伤害+80%）。',
    attack: 342, penetration: 0.80,
    requiredLevel: 39, power: 1572.0, sublimationLevel: 0,
    setId: 'myth26_set',
  },
  'myth26_accessory_eros_arrow': {
    id: 'myth26_accessory_eros_arrow', name: '厄洛斯之翼碎片', type: ItemType.ACCESSORY, rarity: ItemRarity.MYTHIC,
    description: '厄洛斯站神话饰品，命中+152，暴击+46%，穿透+40%，迷惑成功率+50%，攻击迷惑敌人时恢复8%最大生命。',
    hitRate: 152, critRate: 0.46, penetration: 0.40,
    requiredLevel: 39, power: 452.0, sublimationLevel: 0,
    setId: 'myth26_set',
  },

  // ============================================
  // 站台27：死亡塔纳托斯站（T11+装备 - 神话品质·终极）
  // 套装效果：6件套全属性+40%，激活专属技能「死亡收割」
  // ============================================

  'myth27_helmet_thanatos_death': {
    id: 'myth27_helmet_thanatos_death', name: '死神头盔', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '塔纳托斯站神话防具，防御+222，生命+1600，减伤62%，免疫死亡减速、眩晕，生命低于20%时获得2500护盾（每场1次）。',
    defense: 222, maxHp: 1600, damageReduction: 0.62, armorSlot: 'head',
    requiredLevel: 41, power: 766.0, sublimationLevel: 0,
    setId: 'myth27_set',
  },
  'myth27_chest_thanatos_death': {
    id: 'myth27_chest_thanatos_death', name: '塔纳托斯死亡铠甲', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '塔纳托斯站神话防具，防御+270，生命+1980，攻击+50%，对生命低于40%敌人伤害+60%，击杀恢复18%生命。',
    defense: 270, maxHp: 1980, armorSlot: 'chest',
    requiredLevel: 41, power: 938.0, sublimationLevel: 0,
    setId: 'myth27_set',
  },
  'myth27_legs_thanatos_death': {
    id: 'myth27_legs_thanatos_death', name: '死亡护裤', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '塔纳托斯站神话防具，防御+188，闪避+94%，闪避时恢复220生命并降低敌人攻击30%（持续8秒），免疫黑暗减速。',
    defense: 188, dodgeRate: 0.94, armorSlot: 'legs',
    requiredLevel: 41, power: 570.0, sublimationLevel: 0,
    setId: 'myth27_set',
  },
  'myth27_feet_thanatos_death': {
    id: 'myth27_feet_thanatos_death', name: '塔纳托斯踏靴', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '塔纳托斯站神话防具，闪避+104%，攻速+70%，可在死亡区域瞬移，免疫所有死亡陷阱，攻击时50%概率降低敌人生命恢复100%。',
    defense: 0, dodgeRate: 1.04, speed: 0.70, armorSlot: 'feet',
    requiredLevel: 41, power: 510.0, sublimationLevel: 0,
    setId: 'myth27_set',
  },
  'myth27_weapon_thanatos_scythe': {
    id: 'myth27_weapon_thanatos_scythe', name: '塔纳托斯之镰', type: ItemType.WEAPON, rarity: ItemRarity.MYTHIC,
    description: '塔纳托斯站神话武器，攻击+390，穿透+92%，攻击时88%概率触发死亡收割（额外340%攻击力伤害，对生命低于30%敌人伤害+100%，可斩杀低于20%生命的敌人）。',
    attack: 390, penetration: 0.92,
    requiredLevel: 41, power: 1812.0, sublimationLevel: 0,
    setId: 'myth27_set',
  },
  'myth27_accessory_thanatos_scythe': {
    id: 'myth27_accessory_thanatos_scythe', name: '塔纳托斯之魂碎片', type: ItemType.ACCESSORY, rarity: ItemRarity.MYTHIC,
    description: '塔纳托斯站神话饰品，命中+172，暴击+52%，真实伤害+60%，对生命低于40%敌人暴击率+40%，击杀敌人时攻击+25%（可叠加4层）。',
    hitRate: 172, critRate: 0.52, trueDamage: 0.60,
    requiredLevel: 41, power: 514.0, sublimationLevel: 0,
    setId: 'myth27_set',
  },

  // ============================================
  // 站台28：黑暗霍德尔站（T11装备 - 神话品质·终极）
  // 套装效果：6件套全属性+40%，激活专属技能「黑暗笼罩」
  // ============================================

  'myth28_helmet_hodr_dark': {
    id: 'myth28_helmet_hodr_dark', name: '黑暗神头盔', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '霍德尔站神话防具，防御+204，生命+1480，减伤56%，免疫黑暗失明，黑暗环境中防御+35%，被攻击时40%概率反弹40%黑暗伤害。',
    defense: 204, maxHp: 1480, damageReduction: 0.56, armorSlot: 'head',
    requiredLevel: 40, power: 702.0, sublimationLevel: 0,
    setId: 'myth28_set',
  },
  'myth28_chest_hodr_dark': {
    id: 'myth28_chest_hodr_dark', name: '霍德尔黑暗铠甲', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '霍德尔站神话防具，防御+248，生命+1820，攻击+46%，黑暗环境中攻击+35%，受到的伤害反弹35%。',
    defense: 248, maxHp: 1820, armorSlot: 'chest',
    requiredLevel: 40, power: 860.0, sublimationLevel: 0,
    setId: 'myth28_set',
  },
  'myth28_legs_hodr_dark': {
    id: 'myth28_legs_hodr_dark', name: '黑暗护裤', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '霍德尔站神话防具，防御+172，闪避+86%，闪避时恢复190生命，黑暗环境中闪避率+15%，免疫黑暗减速。',
    defense: 172, dodgeRate: 0.86, armorSlot: 'legs',
    requiredLevel: 40, power: 522.0, sublimationLevel: 0,
    setId: 'myth28_set',
  },
  'myth28_feet_hodr_dark': {
    id: 'myth28_feet_hodr_dark', name: '霍德尔踏靴', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '霍德尔站神话防具，闪避+96%，攻速+64%，黑暗环境中移动速度+40%，免疫所有黑暗陷阱，攻击时45%概率无视敌人50%防御。',
    defense: 0, dodgeRate: 0.96, speed: 0.64, armorSlot: 'feet',
    requiredLevel: 40, power: 466.0, sublimationLevel: 0,
    setId: 'myth28_set',
  },
  'myth28_weapon_hodr_stone': {
    id: 'myth28_weapon_hodr_stone', name: '霍德尔黑暗之刃', type: ItemType.WEAPON, rarity: ItemRarity.MYTHIC,
    description: '霍德尔站神话武器，攻击+360，穿透+84%，攻击时85%概率触发黑暗笼罩（额外300%攻击力伤害，可溅射80%，黑暗环境中伤害+70%）。',
    attack: 360, penetration: 0.84,
    requiredLevel: 40, power: 1668.0, sublimationLevel: 0,
    setId: 'myth28_set',
  },
  'myth28_accessory_hodr_stone': {
    id: 'myth28_accessory_hodr_stone', name: '霍德尔之雾碎片', type: ItemType.ACCESSORY, rarity: ItemRarity.MYTHIC,
    description: '霍德尔站神话饰品，命中+160，暴击+48%，真实伤害+45%，黑暗环境中真实伤害额外+25%，穿透率+25%。',
    hitRate: 160, critRate: 0.48, trueDamage: 0.45,
    requiredLevel: 40, power: 472.0, sublimationLevel: 0,
    setId: 'myth28_set',
  },

  // ============================================
  // 站台29：森林维达站（T11装备 - 神话品质·终极）
  // 套装效果：6件套全属性+40%，激活专属技能「森林守护」
  // ============================================

  'myth29_helmet_vidar_forest': {
    id: 'myth29_helmet_vidar_forest', name: '森林神头盔', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '维达站神话防具，防御+198，生命+1440，减伤54%，免疫植物缠绕，森林环境中全属性+20%，被攻击时35%概率召唤藤蔓束缚敌人。',
    defense: 198, maxHp: 1440, damageReduction: 0.54, armorSlot: 'head',
    requiredLevel: 40, power: 682.0, sublimationLevel: 0,
    setId: 'myth29_set',
  },
  'myth29_chest_vidar_forest': {
    id: 'myth29_chest_vidar_forest', name: '维达森林铠甲', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '维达站神话防具，防御+240，生命+1780，防御+32%，可安抚高级怪物，森林环境中生命恢复翻倍。',
    defense: 240, maxHp: 1780, armorSlot: 'chest',
    requiredLevel: 40, power: 842.0, sublimationLevel: 0,
    setId: 'myth29_set',
  },
  'myth29_legs_vidar_forest': {
    id: 'myth29_legs_vidar_forest', name: '森林护裤', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '维达站神话防具，防御+168，闪避+84%，闪避时恢复170生命，森林环境中移动速度+35%，免疫植物减速。',
    defense: 168, dodgeRate: 0.84, armorSlot: 'legs',
    requiredLevel: 40, power: 508.0, sublimationLevel: 0,
    setId: 'myth29_set',
  },
  'myth29_feet_vidar_forest': {
    id: 'myth29_feet_vidar_forest', name: '维达踏靴', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '维达站神话防具，闪避+94%，攻速+64%，森林环境中移动速度+40%，免疫所有植物陷阱，攻击时45%概率切割敌人防御。',
    defense: 0, dodgeRate: 0.94, speed: 0.64, armorSlot: 'feet',
    requiredLevel: 40, power: 456.0, sublimationLevel: 0,
    setId: 'myth29_set',
  },
  'myth29_weapon_vidar_axe': {
    id: 'myth29_weapon_vidar_axe', name: '维达之剑', type: ItemType.WEAPON, rarity: ItemRarity.MYTHIC,
    description: '维达站神话武器，攻击+354，穿透+82%，攻击时82%概率触发森林守护（额外290%攻击力伤害，可切割植物护盾，森林环境中伤害+65%）。',
    attack: 354, penetration: 0.82,
    requiredLevel: 40, power: 1636.0, sublimationLevel: 0,
    setId: 'myth29_set',
  },
  'myth29_accessory_vidar_axe': {
    id: 'myth29_accessory_vidar_axe', name: '维达之苗碎片', type: ItemType.ACCESSORY, rarity: ItemRarity.MYTHIC,
    description: '维达站神话饰品，命中+156，暴击+46%，吸血+22%，近战伤害+40%，森林环境中近战伤害额外+25%，击杀植物系敌人时恢复12%最大生命。',
    hitRate: 156, critRate: 0.46, lifeSteal: 0.22,
    requiredLevel: 40, power: 462.0, sublimationLevel: 0,
    setId: 'myth29_set',
  },

  // ============================================
  // 站台30：复仇瓦利站（T11+装备 - 神话品质·终极）
  // 套装效果：6件套全属性+40%，激活专属技能「复仇之怒」
  // ============================================

  'myth30_helmet_vali_vengeance': {
    id: 'myth30_helmet_vali_vengeance', name: '复仇神头盔', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '瓦利站神话防具，防御+216，生命+1560，减伤58%，免疫复仇狂暴，受到伤害时攻击+12%（可叠加6层，持续12秒）。',
    defense: 216, maxHp: 1560, damageReduction: 0.58, armorSlot: 'head',
    requiredLevel: 41, power: 744.0, sublimationLevel: 0,
    setId: 'myth30_set',
  },
  'myth30_chest_vali_vengeance': {
    id: 'myth30_chest_vali_vengeance', name: '瓦利复仇铠甲', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '瓦利站神话防具，防御+262，生命+1920，攻击+48%，复仇状态下伤害+70%，击杀后复仇状态延长8秒。',
    defense: 262, maxHp: 1920, armorSlot: 'chest',
    requiredLevel: 41, power: 910.0, sublimationLevel: 0,
    setId: 'myth30_set',
  },
  'myth30_legs_vali_vengeance': {
    id: 'myth30_legs_vali_vengeance', name: '复仇护裤', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '瓦利站神话防具，防御+184，闪避+90%，闪避时恢复210生命并进入复仇状态5秒，免疫狂暴减速。',
    defense: 184, dodgeRate: 0.90, armorSlot: 'legs',
    requiredLevel: 41, power: 556.0, sublimationLevel: 0,
    setId: 'myth30_set',
  },
  'myth30_feet_vali_vengeance': {
    id: 'myth30_feet_vali_vengeance', name: '瓦利踏靴', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '瓦利站神话防具，闪避+100%，攻速+66%，攻击速度+25%，免疫复仇陷阱，复仇状态下暴击率+30%。',
    defense: 0, dodgeRate: 1.0, speed: 0.66, armorSlot: 'feet',
    requiredLevel: 41, power: 498.0, sublimationLevel: 0,
    setId: 'myth30_set',
  },
  'myth30_weapon_vali_sword': {
    id: 'myth30_weapon_vali_sword', name: '瓦利之弓', type: ItemType.WEAPON, rarity: ItemRarity.MYTHIC,
    description: '瓦利站神话武器，攻击+378，穿透+88%，攻击时86%概率触发复仇之怒（额外320%攻击力伤害，复仇状态下伤害+80%，可叠加复仇印记）。',
    attack: 378, penetration: 0.88,
    requiredLevel: 41, power: 1752.0, sublimationLevel: 0,
    setId: 'myth30_set',
  },
  'myth30_accessory_vali_sword': {
    id: 'myth30_accessory_vali_sword', name: '瓦利之眼碎片', type: ItemType.ACCESSORY, rarity: ItemRarity.MYTHIC,
    description: '瓦利站神话饰品，命中+168，暴击+50%，穿透+45%，复仇伤害+50%，暴击伤害+65%，复仇状态下击杀敌人时恢复15%最大生命。',
    hitRate: 168, critRate: 0.50, penetration: 0.45,
    requiredLevel: 41, power: 498.0, sublimationLevel: 0,
    setId: 'myth30_set',
  },

  // ============================================
  // 站台31：狩猎乌勒尔站（T11+装备 - 神话品质·终极）
  // 套装效果：6件套全属性+40%，激活专属技能「绝对零度」
  // ============================================

  'myth31_helmet_ullr_hunt': {
    id: 'myth31_helmet_ullr_hunt', name: '狩猎神头盔', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '乌勒尔站神话防具，防御+210，生命+1520，减伤56%，免疫狩猎减速，远程伤害+35%，被攻击时40%概率标记敌人（受到的伤害+30%）。',
    defense: 210, maxHp: 1520, damageReduction: 0.56, armorSlot: 'head',
    requiredLevel: 41, power: 724.0, sublimationLevel: 0,
    setId: 'myth31_set',
  },
  'myth31_chest_ullr_hunt': {
    id: 'myth31_chest_ullr_hunt', name: '乌勒尔狩猎铠甲', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '乌勒尔站神话防具，防御+256，生命+1880，攻击+48%，标记敌人时伤害+60%，草丛中隐蔽性+80%。',
    defense: 256, maxHp: 1880, armorSlot: 'chest',
    requiredLevel: 41, power: 886.0, sublimationLevel: 0,
    setId: 'myth31_set',
  },
  'myth31_legs_ullr_hunt': {
    id: 'myth31_legs_ullr_hunt', name: '狩猎护裤', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '乌勒尔站神话防具，防御+178，闪避+88%，闪避时恢复200生命，草丛中移动速度+40%，免疫弓箭减速。',
    defense: 178, dodgeRate: 0.88, armorSlot: 'legs',
    requiredLevel: 41, power: 540.0, sublimationLevel: 0,
    setId: 'myth31_set',
  },
  'myth31_feet_ullr_hunt': {
    id: 'myth31_feet_ullr_hunt', name: '乌勒尔踏靴', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '乌勒尔站神话防具，闪避+98%，攻速+68%，草丛中移动速度+45%，免疫所有狩猎陷阱，攻击标记敌人时暴击率+35%。',
    defense: 0, dodgeRate: 0.98, speed: 0.68, armorSlot: 'feet',
    requiredLevel: 41, power: 486.0, sublimationLevel: 0,
    setId: 'myth31_set',
  },
  'myth31_weapon_ullr_bow': {
    id: 'myth31_weapon_ullr_bow', name: '乌勒尔之弓', type: ItemType.WEAPON, rarity: ItemRarity.MYTHIC,
    description: '乌勒尔站神话武器，攻击+372，穿透+88%，攻击时88%概率触发绝对零度（额外330%攻击力伤害，必中标记敌人，可穿透3个目标）。',
    attack: 372, penetration: 0.88,
    requiredLevel: 41, power: 1724.0, sublimationLevel: 0,
    setId: 'myth31_set',
  },
  'myth31_accessory_ullr_bow': {
    id: 'myth31_accessory_ullr_bow', name: '乌勒尔之雪碎片', type: ItemType.ACCESSORY, rarity: ItemRarity.MYTHIC,
    description: '乌勒尔站神话饰品，命中+164，暴击+50%，远程伤害+45%，精准度+40%，击杀标记敌人时攻击+18%（可叠加5层）。',
    hitRate: 164, critRate: 0.50,
    requiredLevel: 41, power: 484.0, sublimationLevel: 0,
    setId: 'myth31_set',
  },

  // ============================================
  // 站台32：大地希芙站（T12装备 - 神话品质·终极）
  // 套装效果：6件套全属性+40%，激活专属技能「大地之力」
  // ============================================

  'myth32_helmet_sif_earth': {
    id: 'myth32_helmet_sif_earth', name: '大地女神头盔', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '希芙站神话防具，防御+234，生命+1680，减伤64%，免疫大地震动眩晕，大地环境中全属性+25%，被攻击时45%概率召唤大地护盾（吸收1500伤害）。',
    defense: 234, maxHp: 1680, damageReduction: 0.64, armorSlot: 'head',
    requiredLevel: 42, power: 806.0, sublimationLevel: 0,
    setId: 'myth32_set',
  },
  'myth32_chest_sif_earth': {
    id: 'myth32_chest_sif_earth', name: '希芙大地铠甲', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '希芙站神话防具，防御+284，生命+2080，防御+36%，大地环境中防御额外+30%，受到的伤害反弹40%。',
    defense: 284, maxHp: 2080, armorSlot: 'chest',
    requiredLevel: 42, power: 986.0, sublimationLevel: 0,
    setId: 'myth32_set',
  },
  'myth32_legs_sif_earth': {
    id: 'myth32_legs_sif_earth', name: '大地护裤', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '希芙站神话防具，防御+198，闪避+96%，闪避时恢复240生命并召唤大地突刺（250%攻击力伤害），免疫大地减速。',
    defense: 198, dodgeRate: 0.96, armorSlot: 'legs',
    requiredLevel: 42, power: 602.0, sublimationLevel: 0,
    setId: 'myth32_set',
  },
  'myth32_feet_sif_earth': {
    id: 'myth32_feet_sif_earth', name: '希芙踏靴', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '希芙站神话防具，闪避+106%，攻速+72%，大地环境中移动速度+50%，免疫所有大地陷阱，攻击时55%概率召唤大地震动（眩晕3秒）。',
    defense: 0, dodgeRate: 1.06, speed: 0.72, armorSlot: 'feet',
    requiredLevel: 42, power: 540.0, sublimationLevel: 0,
    setId: 'myth32_set',
  },
  'myth32_weapon_sif_hammer': {
    id: 'myth32_weapon_sif_hammer', name: '希芙金发之剑', type: ItemType.WEAPON, rarity: ItemRarity.MYTHIC,
    description: '希芙站神话武器，攻击+402，穿透+94%，攻击时90%概率触发大地之力（额外360%攻击力伤害，可溅射90%，大地环境中伤害+80%，可召唤大地突刺）。',
    attack: 402, penetration: 0.94,
    requiredLevel: 42, power: 1868.0, sublimationLevel: 0,
    setId: 'myth32_set',
  },
  'myth32_accessory_sif_hair': {
    id: 'myth32_accessory_sif_hair', name: '希芙金发碎片', type: ItemType.ACCESSORY, rarity: ItemRarity.MYTHIC,
    description: '希芙站神话饰品，命中+176，暴击+52%，全属性+20，大地环境中全属性额外+15%，生命低于25%时获得3000护盾并恢复30%生命（每场战斗1次）。',
    hitRate: 176, critRate: 0.52,
    requiredLevel: 42, power: 538.0, sublimationLevel: 0,
    setId: 'myth32_set',
  },
};

// 获取站台25-32装备
export function getMythologyItems25_32(): Record<string, Item> {
  return MYTHOLOGY_ITEMS_25_32;
}
