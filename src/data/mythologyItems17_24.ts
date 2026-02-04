import type { Item } from './types';
import { ItemType, ItemRarity } from './types';

// ============================================
// 神话站台专属装备数据 - 站台17-24
// 基于数值设定/装备数值.md V2.0
// 神话品质装备 - 6件套效果：全属性+30%，激活专属技能
// ============================================

export const MYTHOLOGY_ITEMS_17_24: Record<string, Item> = {
  // ============================================
  // 站台17：战刃提尔站（T10装备 - 神话品质）
  // 套装效果：6件套全属性+30%，激活专属技能「战刃之怒」
  // ============================================
  'myth17_helmet_tyr_war': {
    id: 'myth17_helmet_tyr_war', name: '提尔战盔', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '提尔站神话防具，防御+156，生命+1120，减伤45%',
    defense: 156, maxHp: 1120, damageReduction: 0.45, armorSlot: 'head',
    requiredLevel: 35, power: 536.8, sublimationLevel: 0,
    setId: 'myth17_set',
  },
  'myth17_chest_war_god': {
    id: 'myth17_chest_war_god', name: '战刃战神铠甲', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '提尔站神话防具，防御+188，生命+1380，攻击+36%',
    defense: 188, maxHp: 1380, armorSlot: 'chest',
    requiredLevel: 35, power: 658.0, sublimationLevel: 0,
    setId: 'myth17_set',
  },
  'myth17_legs_war_blade': {
    id: 'myth17_legs_war_blade', name: '战刃护裤', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '提尔站神话防具，防御+132，闪避+68%',
    defense: 132, dodgeRate: 0.68, armorSlot: 'legs',
    requiredLevel: 35, power: 395.0, sublimationLevel: 0,
    setId: 'myth17_set',
  },
  'myth17_feet_tyr': {
    id: 'myth17_feet_tyr', name: '提尔踏靴', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '提尔站神话防具，闪避+76%，攻速+50%',
    defense: 0, dodgeRate: 0.76, speed: 0.50, armorSlot: 'feet',
    requiredLevel: 35, power: 352.0, sublimationLevel: 0,
    setId: 'myth17_set',
  },
  'myth17_weapon_tyr_blade': {
    id: 'myth17_weapon_tyr_blade', name: '提尔战刃', type: ItemType.WEAPON, rarity: ItemRarity.MYTHIC,
    description: '提尔站神话武器，攻击+288，穿透+68%',
    attack: 288, penetration: 0.68,
    requiredLevel: 35, power: 1328.0, sublimationLevel: 0,
    setId: 'myth17_set',
  },
  'myth17_accessory_tyr_arm': {
    id: 'myth17_accessory_tyr_arm', name: '提尔之臂碎片', type: ItemType.ACCESSORY, rarity: ItemRarity.MYTHIC,
    description: '提尔站神话饰品，命中+128，暴击+38%',
    hitRate: 128, critRate: 0.38,
    requiredLevel: 35, power: 366.4, sublimationLevel: 0,
    setId: 'myth17_set',
  },

  // ============================================
  // 站台18：光明巴尔德尔站（T9装备 - 神话品质）
  // 套装效果：6件套全属性+30%，激活专属技能「光明庇护」
  // ============================================
  'myth18_helmet_light_god': {
    id: 'myth18_helmet_light_god', name: '光明神冠', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '巴尔德尔站神话防具，防御+138，生命+1000，减伤38%',
    defense: 138, maxHp: 1000, damageReduction: 0.38, armorSlot: 'head',
    requiredLevel: 34, power: 472.8, sublimationLevel: 0,
    setId: 'myth18_set',
  },
  'myth18_chest_baldr_light': {
    id: 'myth18_chest_baldr_light', name: '巴尔德尔光明铠甲', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '巴尔德尔站神话防具，防御+168，生命+1220，攻击+30%',
    defense: 168, maxHp: 1220, armorSlot: 'chest',
    requiredLevel: 34, power: 578.0, sublimationLevel: 0,
    setId: 'myth18_set',
  },
  'myth18_legs_light': {
    id: 'myth18_legs_light', name: '光明护裤', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '巴尔德尔站神话防具，防御+116，闪避+60%',
    defense: 116, dodgeRate: 0.60, armorSlot: 'legs',
    requiredLevel: 34, power: 346.0, sublimationLevel: 0,
    setId: 'myth18_set',
  },
  'myth18_feet_light': {
    id: 'myth18_feet_light', name: '光明踏靴', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '巴尔德尔站神话防具，闪避+68%，攻速+44%',
    defense: 0, dodgeRate: 0.68, speed: 0.44, armorSlot: 'feet',
    requiredLevel: 34, power: 308.0, sublimationLevel: 0,
    setId: 'myth18_set',
  },
  'myth18_weapon_light_sword': {
    id: 'myth18_weapon_light_sword', name: '光明长剑', type: ItemType.WEAPON, rarity: ItemRarity.MYTHIC,
    description: '巴尔德尔站神话武器，攻击+258，穿透+60%',
    attack: 258, penetration: 0.60,
    requiredLevel: 34, power: 1184.0, sublimationLevel: 0,
    setId: 'myth18_set',
  },
  'myth18_accessory_baldr_light': {
    id: 'myth18_accessory_baldr_light', name: '巴尔德尔之光碎片', type: ItemType.ACCESSORY, rarity: ItemRarity.MYTHIC,
    description: '巴尔德尔站神话饰品，命中+116，暴击+34%，真实伤害+35%',
    hitRate: 116, critRate: 0.34, trueDamage: 0.35,
    requiredLevel: 34, power: 332.0, sublimationLevel: 0,
    setId: 'myth18_set',
  },

  // ============================================
  // 站台19：酒雾狄俄尼索斯站（T10装备 - 神话品质）
  // 套装效果：6件套全属性+30%，激活专属技能「酒神狂欢」
  // ============================================
  'myth19_helmet_wine_god': {
    id: 'myth19_helmet_wine_god', name: '酒神冠', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '狄俄尼索斯站神话防具，防御+150，生命+1080，减伤40%',
    defense: 150, maxHp: 1080, damageReduction: 0.40, armorSlot: 'head',
    requiredLevel: 35, power: 516.0, sublimationLevel: 0,
    setId: 'myth19_set',
  },
  'myth19_chest_wine_mist': {
    id: 'myth19_chest_wine_mist', name: '酒雾纹章胸甲', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '狄俄尼索斯站神话防具，防御+182，生命+1320，防御+28%',
    defense: 182, maxHp: 1320, armorSlot: 'chest',
    requiredLevel: 35, power: 616.0, sublimationLevel: 0,
    setId: 'myth19_set',
  },
  'myth19_legs_wine': {
    id: 'myth19_legs_wine', name: '酒绒护裤', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '狄俄尼索斯站神话防具，防御+126，闪避+64%',
    defense: 126, dodgeRate: 0.64, armorSlot: 'legs',
    requiredLevel: 35, power: 376.6, sublimationLevel: 0,
    setId: 'myth19_set',
  },
  'myth19_feet_wine_mist': {
    id: 'myth19_feet_wine_mist', name: '酒雾踏靴', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '狄俄尼索斯站神话防具，闪避+72%，攻速+48%',
    defense: 0, dodgeRate: 0.72, speed: 0.48, armorSlot: 'feet',
    requiredLevel: 35, power: 336.0, sublimationLevel: 0,
    setId: 'myth19_set',
  },
  'myth19_weapon_wine_blade': {
    id: 'myth19_weapon_wine_blade', name: '酒神酒刃', type: ItemType.WEAPON, rarity: ItemRarity.MYTHIC,
    description: '狄俄尼索斯站神话武器，攻击+276，穿透+66%',
    attack: 276, penetration: 0.66,
    requiredLevel: 35, power: 1268.0, sublimationLevel: 0,
    setId: 'myth19_set',
  },
  'myth19_accessory_dionysus_cup': {
    id: 'myth19_accessory_dionysus_cup', name: '狄俄尼索斯之杯碎片', type: ItemType.ACCESSORY, rarity: ItemRarity.MYTHIC,
    description: '狄俄尼索斯站神话饰品，命中+124，暴击+36%，吸血+28%',
    hitRate: 124, critRate: 0.36, lifeSteal: 0.28,
    requiredLevel: 35, power: 356.8, sublimationLevel: 0,
    setId: 'myth19_set',
  },

  // ============================================
  // 站台20：麦穗德墨忒尔站（T10装备 - 神话品质）
  // 套装效果：6件套全属性+30%，激活专属技能「丰收祝福」
  // ============================================
  'myth20_helmet_wheat_god': {
    id: 'myth20_helmet_wheat_god', name: '麦穗农神冠', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '德墨忒尔站神话防具，防御+146，生命+1050，减伤38%',
    defense: 146, maxHp: 1050, damageReduction: 0.38, armorSlot: 'head',
    requiredLevel: 35, power: 502.0, sublimationLevel: 0,
    setId: 'myth20_set',
  },
  'myth20_chest_wheat_emblem': {
    id: 'myth20_chest_wheat_emblem', name: '麦穗纹章胸甲', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '德墨忒尔站神话防具，防御+178，生命+1290，防御+26%',
    defense: 178, maxHp: 1290, armorSlot: 'chest',
    requiredLevel: 35, power: 602.0, sublimationLevel: 0,
    setId: 'myth20_set',
  },
  'myth20_legs_wheat': {
    id: 'myth20_legs_wheat', name: '麦穗护裤', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '德墨忒尔站神话防具，防御+122，闪避+62%',
    defense: 122, dodgeRate: 0.62, armorSlot: 'legs',
    requiredLevel: 35, power: 365.0, sublimationLevel: 0,
    setId: 'myth20_set',
  },
  'myth20_feet_wheat': {
    id: 'myth20_feet_wheat', name: '麦穗踏靴', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '德墨忒尔站神话防具，闪避+70%，攻速+46%',
    defense: 0, dodgeRate: 0.70, speed: 0.46, armorSlot: 'feet',
    requiredLevel: 35, power: 325.0, sublimationLevel: 0,
    setId: 'myth20_set',
  },
  'myth20_weapon_wheat_sickle': {
    id: 'myth20_weapon_wheat_sickle', name: '麦穗镰刀', type: ItemType.WEAPON, rarity: ItemRarity.MYTHIC,
    description: '德墨忒尔站神话武器，攻击+270，穿透+64%',
    attack: 270, penetration: 0.64,
    requiredLevel: 35, power: 1236.0, sublimationLevel: 0,
    setId: 'myth20_set',
  },
  'myth20_accessory_demeter_wheat': {
    id: 'myth20_accessory_demeter_wheat', name: '德墨忒尔之穗碎片', type: ItemType.ACCESSORY, rarity: ItemRarity.MYTHIC,
    description: '德墨忒尔站神话饰品，命中+120，暴击+34%',
    hitRate: 120, critRate: 0.34,
    requiredLevel: 35, power: 342.0, sublimationLevel: 0,
    setId: 'myth20_set',
  },

  // ============================================
  // 站台21：烈焰赫淮斯托斯站（T10+装备 - 神话品质）
  // 套装效果：6件套全属性+30%，激活专属技能「烈焰锻造」
  // ============================================
  'myth21_helmet_fire_god': {
    id: 'myth21_helmet_fire_god', name: '火神烈焰头盔', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '赫淮斯托斯站神话防具，防御+168，生命+1200，减伤48%',
    defense: 168, maxHp: 1200, damageReduction: 0.48, armorSlot: 'head',
    requiredLevel: 36, power: 572.0, sublimationLevel: 0,
    setId: 'myth21_set',
  },
  'myth21_chest_inferno': {
    id: 'myth21_chest_inferno', name: '烈焰神纹铠甲', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '赫淮斯托斯站神话防具，防御+204，生命+1480，攻击+38%',
    defense: 204, maxHp: 1480, armorSlot: 'chest',
    requiredLevel: 36, power: 702.0, sublimationLevel: 0,
    setId: 'myth21_set',
  },
  'myth21_legs_inferno': {
    id: 'myth21_legs_inferno', name: '烈焰护裤', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '赫淮斯托斯站神话防具，防御+142，闪避+72%',
    defense: 142, dodgeRate: 0.72, armorSlot: 'legs',
    requiredLevel: 36, power: 422.0, sublimationLevel: 0,
    setId: 'myth21_set',
  },
  'myth21_feet_fire_god': {
    id: 'myth21_feet_fire_god', name: '火神踏靴', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '赫淮斯托斯站神话防具，闪避+80%，攻速+52%',
    defense: 0, dodgeRate: 0.80, speed: 0.52, armorSlot: 'feet',
    requiredLevel: 36, power: 376.0, sublimationLevel: 0,
    setId: 'myth21_set',
  },
  'myth21_weapon_inferno_hammer': {
    id: 'myth21_weapon_inferno_hammer', name: '烈焰战锤', type: ItemType.WEAPON, rarity: ItemRarity.MYTHIC,
    description: '赫淮斯托斯站神话武器，攻击+306，穿透+72%',
    attack: 306, penetration: 0.72,
    requiredLevel: 36, power: 1412.0, sublimationLevel: 0,
    setId: 'myth21_set',
  },
  'myth21_accessory_hephaestus_fire': {
    id: 'myth21_accessory_hephaestus_fire', name: '赫淮斯托斯之火碎片', type: ItemType.ACCESSORY, rarity: ItemRarity.MYTHIC,
    description: '赫淮斯托斯站神话饰品，命中+136，暴击+40%',
    hitRate: 136, critRate: 0.40,
    requiredLevel: 36, power: 392.0, sublimationLevel: 0,
    setId: 'myth21_set',
  },

  // ============================================
  // 站台22：暗影赫尔墨斯站（T10+装备 - 神话品质）
  // 套装效果：6件套全属性+30%，激活专属技能「暗影步」
  // ============================================
  'myth22_helmet_shadow_messenger': {
    id: 'myth22_helmet_shadow_messenger', name: '暗影信使头盔', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '赫尔墨斯站神话防具，防御+162，生命+1160，减伤42%',
    defense: 162, maxHp: 1160, damageReduction: 0.42, armorSlot: 'head',
    requiredLevel: 36, power: 552.0, sublimationLevel: 0,
    setId: 'myth22_set',
  },
  'myth22_chest_shadow': {
    id: 'myth22_chest_shadow', name: '暗影神纹胸甲', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '赫尔墨斯站神话防具，防御+196，生命+1420，攻击+34%',
    defense: 196, maxHp: 1420, armorSlot: 'chest',
    requiredLevel: 36, power: 676.0, sublimationLevel: 0,
    setId: 'myth22_set',
  },
  'myth22_legs_shadow': {
    id: 'myth22_legs_shadow', name: '暗影护裤', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '赫尔墨斯站神话防具，防御+136，闪避+70%',
    defense: 136, dodgeRate: 0.70, armorSlot: 'legs',
    requiredLevel: 36, power: 406.0, sublimationLevel: 0,
    setId: 'myth22_set',
  },
  'myth22_feet_hermes_boots': {
    id: 'myth22_feet_hermes_boots', name: '赫尔墨斯之靴', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '赫尔墨斯站神话防具，闪避+78%，攻速+54%',
    defense: 0, dodgeRate: 0.78, speed: 0.54, armorSlot: 'feet',
    requiredLevel: 36, power: 368.0, sublimationLevel: 0,
    setId: 'myth22_set',
  },
  'myth22_weapon_shadow_dagger': {
    id: 'myth22_weapon_shadow_dagger', name: '暗影短刃', type: ItemType.WEAPON, rarity: ItemRarity.MYTHIC,
    description: '赫尔墨斯站神话武器，攻击+294，穿透+70%',
    attack: 294, penetration: 0.70,
    requiredLevel: 36, power: 1352.0, sublimationLevel: 0,
    setId: 'myth22_set',
  },
  'myth22_accessory_hermes_boots': {
    id: 'myth22_accessory_hermes_boots', name: '赫尔墨斯之靴碎片', type: ItemType.ACCESSORY, rarity: ItemRarity.MYTHIC,
    description: '赫尔墨斯站神话饰品，命中+132，暴击+38%，穿透+28%',
    hitRate: 132, critRate: 0.38, penetration: 0.28,
    requiredLevel: 36, power: 382.0, sublimationLevel: 0,
    setId: 'myth22_set',
  },

  // ============================================
  // 站台23：冥府哈迪斯站（T11装备 - 神话品质）
  // 套装效果：6件套全属性+30%，激活专属技能「冥府审判」
  // ============================================
  'myth23_helmet_hades_king': {
    id: 'myth23_helmet_hades_king', name: '冥王冥盔', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '哈迪斯站神话防具，防御+186，生命+1340，减伤52%',
    defense: 186, maxHp: 1340, damageReduction: 0.52, armorSlot: 'head',
    requiredLevel: 38, power: 636.0, sublimationLevel: 0,
    setId: 'myth23_set',
  },
  'myth23_chest_underworld': {
    id: 'myth23_chest_underworld', name: '冥府神纹铠甲', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '哈迪斯站神话防具，防御+226，生命+1650，攻击+42%',
    defense: 226, maxHp: 1650, armorSlot: 'chest',
    requiredLevel: 38, power: 780.0, sublimationLevel: 0,
    setId: 'myth23_set',
  },
  'myth23_legs_underworld': {
    id: 'myth23_legs_underworld', name: '冥府护裤', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '哈迪斯站神话防具，防御+156，闪避+78%',
    defense: 156, dodgeRate: 0.78, armorSlot: 'legs',
    requiredLevel: 38, power: 470.0, sublimationLevel: 0,
    setId: 'myth23_set',
  },
  'myth23_feet_hades_king': {
    id: 'myth23_feet_hades_king', name: '冥王踏靴', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '哈迪斯站神话防具，闪避+88%，攻速+58%',
    defense: 0, dodgeRate: 0.88, speed: 0.58, armorSlot: 'feet',
    requiredLevel: 38, power: 420.0, sublimationLevel: 0,
    setId: 'myth23_set',
  },
  'myth23_weapon_hades_scythe': {
    id: 'myth23_weapon_hades_scythe', name: '哈迪斯之镰', type: ItemType.WEAPON, rarity: ItemRarity.MYTHIC,
    description: '哈迪斯站神话武器，攻击+336，穿透+78%',
    attack: 336, penetration: 0.78,
    requiredLevel: 38, power: 1552.0, sublimationLevel: 0,
    setId: 'myth23_set',
  },
  'myth23_accessory_hades_ring': {
    id: 'myth23_accessory_hades_ring', name: '哈迪斯之戒碎片', type: ItemType.ACCESSORY, rarity: ItemRarity.MYTHIC,
    description: '哈迪斯站神话饰品，命中+148，暴击+44%，真实伤害+45%',
    hitRate: 148, critRate: 0.44, trueDamage: 0.45,
    requiredLevel: 38, power: 432.0, sublimationLevel: 0,
    setId: 'myth23_set',
  },

  // ============================================
  // 站台24：魔法赫卡忒站（T11装备 - 神话品质）
  // 套装效果：6件套全属性+30%，激活专属技能「三重魔法」
  // ============================================
  'myth24_helmet_magic_witch': {
    id: 'myth24_helmet_magic_witch', name: '魔法巫冠', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '赫卡忒站神话防具，防御+180，生命+1300，减伤48%',
    defense: 180, maxHp: 1300, damageReduction: 0.48, armorSlot: 'head',
    requiredLevel: 38, power: 616.0, sublimationLevel: 0,
    setId: 'myth24_set',
  },
  'myth24_chest_magic': {
    id: 'myth24_chest_magic', name: '魔法神纹铠甲', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '赫卡忒站神话防具，防御+218，生命+1600，攻击+40%',
    defense: 218, maxHp: 1600, armorSlot: 'chest',
    requiredLevel: 38, power: 756.0, sublimationLevel: 0,
    setId: 'myth24_set',
  },
  'myth24_legs_magic': {
    id: 'myth24_legs_magic', name: '魔法护裤', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '赫卡忒站神话防具，防御+152，闪避+76%',
    defense: 152, dodgeRate: 0.76, armorSlot: 'legs',
    requiredLevel: 38, power: 456.0, sublimationLevel: 0,
    setId: 'myth24_set',
  },
  'myth24_feet_magic': {
    id: 'myth24_feet_magic', name: '魔法踏靴', type: ItemType.ARMOR, rarity: ItemRarity.MYTHIC,
    description: '赫卡忒站神话防具，闪避+84%，攻速+56%',
    defense: 0, dodgeRate: 0.84, speed: 0.56, armorSlot: 'feet',
    requiredLevel: 38, power: 406.0, sublimationLevel: 0,
    setId: 'myth24_set',
  },
  'myth24_weapon_hecate_staff': {
    id: 'myth24_weapon_hecate_staff', name: '赫卡忒之杖', type: ItemType.WEAPON, rarity: ItemRarity.MYTHIC,
    description: '赫卡忒站神话武器，攻击+324，穿透+76%',
    attack: 324, penetration: 0.76,
    requiredLevel: 38, power: 1496.0, sublimationLevel: 0,
    setId: 'myth24_set',
  },
  'myth24_accessory_hecate_staff': {
    id: 'myth24_accessory_hecate_staff', name: '赫卡忒之杖碎片', type: ItemType.ACCESSORY, rarity: ItemRarity.MYTHIC,
    description: '赫卡忒站神话饰品，命中+144，暴击+42%，穿透+35%',
    hitRate: 144, critRate: 0.42, penetration: 0.35,
    requiredLevel: 38, power: 418.0, sublimationLevel: 0,
    setId: 'myth24_set',
  },
};

// 获取站台17-24装备
export function getMythologyItems17_24(): Record<string, Item> {
  return MYTHOLOGY_ITEMS_17_24;
}
