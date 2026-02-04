import type { Item } from './types';
import { ItemType, ItemRarity } from './types';

// ============================================
// 神话站台专属装备数据 - 站台9-16
// 基于数值设定/装备数值.md V2.0
// 传说品质装备 - 4件套效果：生命值+20%
// ============================================

export const MYTHOLOGY_ITEMS_9_16: Record<string, Item> = {
  // ============================================
  // 站台9：风暴波塞冬站（T8装备 - 传说品质）
  // 套装效果：4件套生命值+20%
  // ============================================
  'myth9_helmet_sea_storm': {
    id: 'myth9_helmet_sea_storm', name: '海神风暴头盔', type: ItemType.ARMOR, rarity: ItemRarity.LEGENDARY,
    description: '波塞冬站传说防具，防御+78，生命+560，减伤28%',
    defense: 78, maxHp: 560, damageReduction: 0.28, armorSlot: 'head',
    requiredLevel: 28, power: 248.8, sublimationLevel: 0,
    setId: 'myth9_set',
  },
  'myth9_chest_poseidon_scale': {
    id: 'myth9_chest_poseidon_scale', name: '波塞冬鳞甲', type: ItemType.ARMOR, rarity: ItemRarity.LEGENDARY,
    description: '波塞冬站传说防具，防御+94，生命+680，攻击+20%，战斗开始+800护盾',
    defense: 94, maxHp: 680, shield: 800, armorSlot: 'chest',
    requiredLevel: 28, power: 312.0, sublimationLevel: 0,
    setId: 'myth9_set',
  },
  'myth9_legs_storm': {
    id: 'myth9_legs_storm', name: '风暴护裤', type: ItemType.ARMOR, rarity: ItemRarity.LEGENDARY,
    description: '波塞冬站传说防具，防御+64，闪避+38%',
    defense: 64, dodgeRate: 0.38, armorSlot: 'legs',
    requiredLevel: 28, power: 182.2, sublimationLevel: 0,
    setId: 'myth9_set',
  },
  'myth9_feet_sea_god': {
    id: 'myth9_feet_sea_god', name: '海神踏靴', type: ItemType.ARMOR, rarity: ItemRarity.LEGENDARY,
    description: '波塞冬站传说防具，闪避+44%，攻速+32%',
    defense: 0, dodgeRate: 0.44, speed: 0.32, armorSlot: 'feet',
    requiredLevel: 28, power: 162.2, sublimationLevel: 0,
    setId: 'myth9_set',
  },
  'myth9_weapon_storm_trident': {
    id: 'myth9_weapon_storm_trident', name: '风暴三叉戟', type: ItemType.WEAPON, rarity: ItemRarity.LEGENDARY,
    description: '波塞冬站传说武器，攻击+158，穿透+38%',
    attack: 158, penetration: 0.38,
    requiredLevel: 28, power: 698.0, sublimationLevel: 0,
    setId: 'myth9_set',
  },
  'myth9_accessory_poseidon_scale': {
    id: 'myth9_accessory_poseidon_scale', name: '波塞冬之鳞', type: ItemType.ACCESSORY, rarity: ItemRarity.LEGENDARY,
    description: '波塞冬站传说饰品，命中+68，暴击+22%',
    hitRate: 68, critRate: 0.22,
    requiredLevel: 28, power: 162.4, sublimationLevel: 0,
    setId: 'myth9_set',
  },

  // ============================================
  // 站台10：荆棘赫拉站（T8+装备 - 传说品质）
  // 套装效果：4件套生命值+20%
  // ============================================
  'myth10_helmet_hera_thorn': {
    id: 'myth10_helmet_hera_thorn', name: '赫拉荆棘冠', type: ItemType.ARMOR, rarity: ItemRarity.LEGENDARY,
    description: '赫拉站传说防具，防御+86，生命+620，减伤30%',
    defense: 86, maxHp: 620, damageReduction: 0.30, armorSlot: 'head',
    requiredLevel: 29, power: 276.4, sublimationLevel: 0,
    setId: 'myth10_set',
  },
  'myth10_chest_thorn_queen': {
    id: 'myth10_chest_thorn_queen', name: '荆棘天后铠甲', type: ItemType.ARMOR, rarity: ItemRarity.LEGENDARY,
    description: '赫拉站传说防具，防御+104，生命+760，防御+18%',
    defense: 104, maxHp: 760, armorSlot: 'chest',
    requiredLevel: 29, power: 342.6, sublimationLevel: 0,
    setId: 'myth10_set',
  },
  'myth10_legs_thorn': {
    id: 'myth10_legs_thorn', name: '荆棘护裤', type: ItemType.ARMOR, rarity: ItemRarity.LEGENDARY,
    description: '赫拉站传说防具，防御+72，闪避+42%',
    defense: 72, dodgeRate: 0.42, armorSlot: 'legs',
    requiredLevel: 29, power: 203.6, sublimationLevel: 0,
    setId: 'myth10_set',
  },
  'myth10_feet_thorn': {
    id: 'myth10_feet_thorn', name: '荆棘踏靴', type: ItemType.ARMOR, rarity: ItemRarity.LEGENDARY,
    description: '赫拉站传说防具，闪避+48%，攻速+34%',
    defense: 0, dodgeRate: 0.48, speed: 0.34, armorSlot: 'feet',
    requiredLevel: 29, power: 180.2, sublimationLevel: 0,
    setId: 'myth10_set',
  },
  'myth10_weapon_thorn_blade': {
    id: 'myth10_weapon_thorn_blade', name: '荆棘长剑', type: ItemType.WEAPON, rarity: ItemRarity.LEGENDARY,
    description: '赫拉站传说武器，攻击+176，穿透+42%',
    attack: 176, penetration: 0.42,
    requiredLevel: 29, power: 784.4, sublimationLevel: 0,
    setId: 'myth10_set',
  },
  'myth10_accessory_hera_crown': {
    id: 'myth10_accessory_hera_crown', name: '赫拉之冠碎片', type: ItemType.ACCESSORY, rarity: ItemRarity.LEGENDARY,
    description: '赫拉站传说饰品，命中+76，暴击+24%',
    hitRate: 76, critRate: 0.24,
    requiredLevel: 29, power: 182.2, sublimationLevel: 0,
    setId: 'myth10_set',
  },

  // ============================================
  // 站台11：利刃雅典娜站（T9装备 - 传说品质）
  // 套装效果：4件套生命值+20%
  // ============================================
  'myth11_helmet_wisdom_blade': {
    id: 'myth11_helmet_wisdom_blade', name: '智慧利刃头盔', type: ItemType.ARMOR, rarity: ItemRarity.LEGENDARY,
    description: '雅典娜站传说防具，防御+96，生命+700，减伤32%，命中+20',
    defense: 96, maxHp: 700, damageReduction: 0.32, hitRate: 20, armorSlot: 'head',
    requiredLevel: 30, power: 310.8, sublimationLevel: 0,
    setId: 'myth11_set',
  },
  'myth11_chest_athena_silver': {
    id: 'myth11_chest_athena_silver', name: '雅典娜银甲', type: ItemType.ARMOR, rarity: ItemRarity.LEGENDARY,
    description: '雅典娜站传说防具，防御+116，生命+860，攻击+24%',
    defense: 116, maxHp: 860, armorSlot: 'chest',
    requiredLevel: 30, power: 386.0, sublimationLevel: 0,
    setId: 'myth11_set',
  },
  'myth11_legs_blade': {
    id: 'myth11_legs_blade', name: '利刃护裤', type: ItemType.ARMOR, rarity: ItemRarity.LEGENDARY,
    description: '雅典娜站传说防具，防御+80，闪避+46%',
    defense: 80, dodgeRate: 0.46, armorSlot: 'legs',
    requiredLevel: 30, power: 228.6, sublimationLevel: 0,
    setId: 'myth11_set',
  },
  'myth11_feet_wisdom': {
    id: 'myth11_feet_wisdom', name: '智慧踏靴', type: ItemType.ARMOR, rarity: ItemRarity.LEGENDARY,
    description: '雅典娜站传说防具，闪避+52%，攻速+36%',
    defense: 0, dodgeRate: 0.52, speed: 0.36, armorSlot: 'feet',
    requiredLevel: 30, power: 203.0, sublimationLevel: 0,
    setId: 'myth11_set',
  },
  'myth11_weapon_athena_blade': {
    id: 'myth11_weapon_athena_blade', name: '雅典娜之盾+智慧利刃', type: ItemType.WEAPON, rarity: ItemRarity.LEGENDARY,
    description: '雅典娜站传说武器，攻击+198，穿透+46%',
    attack: 198, penetration: 0.46,
    requiredLevel: 30, power: 888.8, sublimationLevel: 0,
    setId: 'myth11_set',
  },
  'myth11_accessory_athena_wisdom': {
    id: 'myth11_accessory_athena_wisdom', name: '雅典娜智慧碎片', type: ItemType.ACCESSORY, rarity: ItemRarity.LEGENDARY,
    description: '雅典娜站传说饰品，命中+84，暴击+26%，穿透+18%',
    hitRate: 84, critRate: 0.26, penetration: 0.18,
    requiredLevel: 30, power: 204.8, sublimationLevel: 0,
    setId: 'myth11_set',
  },

  // ============================================
  // 站台12：血刃阿瑞斯站（T9+装备 - 传说品质）
  // 套装效果：4件套生命值+20%
  // ============================================
  'myth12_helmet_war_god_blood': {
    id: 'myth12_helmet_war_god_blood', name: '战神血刃头盔', type: ItemType.ARMOR, rarity: ItemRarity.LEGENDARY,
    description: '阿瑞斯站传说防具，防御+108，生命+790，减伤35%',
    defense: 108, maxHp: 790, damageReduction: 0.35, armorSlot: 'head',
    requiredLevel: 31, power: 349.4, sublimationLevel: 0,
    setId: 'myth12_set',
  },
  'myth12_chest_blood_war': {
    id: 'myth12_chest_blood_war', name: '血刃战神铠甲', type: ItemType.ARMOR, rarity: ItemRarity.LEGENDARY,
    description: '阿瑞斯站传说防具，防御+130，生命+970，攻击+28%',
    defense: 130, maxHp: 970, armorSlot: 'chest',
    requiredLevel: 31, power: 432.6, sublimationLevel: 0,
    setId: 'myth12_set',
  },
  'myth12_legs_blood': {
    id: 'myth12_legs_blood', name: '血刃护裤', type: ItemType.ARMOR, rarity: ItemRarity.LEGENDARY,
    description: '阿瑞斯站传说防具，防御+90，闪避+52%',
    defense: 90, dodgeRate: 0.52, armorSlot: 'legs',
    requiredLevel: 31, power: 257.2, sublimationLevel: 0,
    setId: 'myth12_set',
  },
  'myth12_feet_war_god': {
    id: 'myth12_feet_war_god', name: '战神踏靴', type: ItemType.ARMOR, rarity: ItemRarity.LEGENDARY,
    description: '阿瑞斯站传说防具，闪避+58%，攻速+40%',
    defense: 0, dodgeRate: 0.58, speed: 0.40, armorSlot: 'feet',
    requiredLevel: 31, power: 228.8, sublimationLevel: 0,
    setId: 'myth12_set',
  },
  'myth12_weapon_ares_spear': {
    id: 'myth12_weapon_ares_spear', name: '阿瑞斯血矛', type: ItemType.WEAPON, rarity: ItemRarity.LEGENDARY,
    description: '阿瑞斯站传说武器，攻击+222，穿透+52%',
    attack: 222, penetration: 0.52,
    requiredLevel: 31, power: 1002.4, sublimationLevel: 0,
    setId: 'myth12_set',
  },
  'myth12_accessory_ares_blood': {
    id: 'myth12_accessory_ares_blood', name: '阿瑞斯血刃碎片', type: ItemType.ACCESSORY, rarity: ItemRarity.LEGENDARY,
    description: '阿瑞斯站传说饰品，命中+94，暴击+28%',
    hitRate: 94, critRate: 0.28,
    requiredLevel: 31, power: 230.8, sublimationLevel: 0,
    setId: 'myth12_set',
  },

  // ============================================
  // 站台13：幻梦阿佛洛狄忒站（T9装备 - 传说品质）
  // 套装效果：4件套生命值+20%
  // ============================================
  'myth13_helmet_dream_love': {
    id: 'myth13_helmet_dream_love', name: '幻梦爱神冠', type: ItemType.ARMOR, rarity: ItemRarity.LEGENDARY,
    description: '阿佛洛狄忒站传说防具，防御+90，生命+660，减伤26%',
    defense: 90, maxHp: 660, damageReduction: 0.26, armorSlot: 'head',
    requiredLevel: 30, power: 292.0, sublimationLevel: 0,
    setId: 'myth13_set',
  },
  'myth13_chest_dream_emblem': {
    id: 'myth13_chest_dream_emblem', name: '幻梦纹章胸甲', type: ItemType.ARMOR, rarity: ItemRarity.LEGENDARY,
    description: '阿佛洛狄忒站传说防具，防御+110，生命+820，攻击+20%',
    defense: 110, maxHp: 820, armorSlot: 'chest',
    requiredLevel: 30, power: 364.0, sublimationLevel: 0,
    setId: 'myth13_set',
  },
  'myth13_legs_dream': {
    id: 'myth13_legs_dream', name: '幻梦护裤', type: ItemType.ARMOR, rarity: ItemRarity.LEGENDARY,
    description: '阿佛洛狄忒站传说防具，防御+76，闪避+44%',
    defense: 76, dodgeRate: 0.44, armorSlot: 'legs',
    requiredLevel: 30, power: 216.2, sublimationLevel: 0,
    setId: 'myth13_set',
  },
  'myth13_feet_dream': {
    id: 'myth13_feet_dream', name: '幻梦踏靴', type: ItemType.ARMOR, rarity: ItemRarity.LEGENDARY,
    description: '阿佛洛狄忒站传说防具，闪避+50%，攻速+32%',
    defense: 0, dodgeRate: 0.50, speed: 0.32, armorSlot: 'feet',
    requiredLevel: 30, power: 191.0, sublimationLevel: 0,
    setId: 'myth13_set',
  },
  'myth13_weapon_dream_rose': {
    id: 'myth13_weapon_dream_rose', name: '幻梦玫瑰刃', type: ItemType.WEAPON, rarity: ItemRarity.LEGENDARY,
    description: '阿佛洛狄忒站传说武器，攻击+186，穿透+44%',
    attack: 186, penetration: 0.44,
    requiredLevel: 30, power: 832.8, sublimationLevel: 0,
    setId: 'myth13_set',
  },
  'myth13_accessory_aphrodite_belt': {
    id: 'myth13_accessory_aphrodite_belt', name: '阿佛洛狄忒之带碎片', type: ItemType.ACCESSORY, rarity: ItemRarity.LEGENDARY,
    description: '阿佛洛狄忒站传说饰品，命中+80，暴击+24%',
    hitRate: 80, critRate: 0.24,
    requiredLevel: 30, power: 194.0, sublimationLevel: 0,
    setId: 'myth13_set',
  },

  // ============================================
  // 站台14：圣树奥丁站（T9+装备 - 传说品质）
  // 套装效果：4件套生命值+20%
  // ============================================
  'myth14_helmet_odin_one_eye': {
    id: 'myth14_helmet_odin_one_eye', name: '奥丁独眼罩', type: ItemType.ARMOR, rarity: ItemRarity.LEGENDARY,
    description: '奥丁站传说防具，防御+114，生命+840，减伤32%，命中+24',
    defense: 114, maxHp: 840, damageReduction: 0.32, hitRate: 24, armorSlot: 'head',
    requiredLevel: 31, power: 369.4, sublimationLevel: 0,
    setId: 'myth14_set',
  },
  'myth14_chest_holy_tree': {
    id: 'myth14_chest_holy_tree', name: '圣树神纹铠甲', type: ItemType.ARMOR, rarity: ItemRarity.LEGENDARY,
    description: '奥丁站传说防具，防御+138，生命+1020，攻击+26%',
    defense: 138, maxHp: 1020, armorSlot: 'chest',
    requiredLevel: 31, power: 456.0, sublimationLevel: 0,
    setId: 'myth14_set',
  },
  'myth14_legs_rune': {
    id: 'myth14_legs_rune', name: '符文护裤', type: ItemType.ARMOR, rarity: ItemRarity.LEGENDARY,
    description: '奥丁站传说防具，防御+96，闪避+50%',
    defense: 96, dodgeRate: 0.50, armorSlot: 'legs',
    requiredLevel: 31, power: 273.2, sublimationLevel: 0,
    setId: 'myth14_set',
  },
  'myth14_feet_odin': {
    id: 'myth14_feet_odin', name: '奥丁踏靴', type: ItemType.ARMOR, rarity: ItemRarity.LEGENDARY,
    description: '奥丁站传说防具，闪避+56%，攻速+36%',
    defense: 0, dodgeRate: 0.56, speed: 0.36, armorSlot: 'feet',
    requiredLevel: 31, power: 242.0, sublimationLevel: 0,
    setId: 'myth14_set',
  },
  'myth14_weapon_odin_spear': {
    id: 'myth14_weapon_odin_spear', name: '奥丁符文矛', type: ItemType.WEAPON, rarity: ItemRarity.LEGENDARY,
    description: '奥丁站传说武器，攻击+210，穿透+48%',
    attack: 210, penetration: 0.48,
    requiredLevel: 31, power: 942.0, sublimationLevel: 0,
    setId: 'myth14_set',
  },
  'myth14_accessory_odin_eye': {
    id: 'myth14_accessory_odin_eye', name: '奥丁之眼碎片', type: ItemType.ACCESSORY, rarity: ItemRarity.LEGENDARY,
    description: '奥丁站传说饰品，命中+90，暴击+26%，穿透+22%',
    hitRate: 90, critRate: 0.26, penetration: 0.22,
    requiredLevel: 31, power: 222.8, sublimationLevel: 0,
    setId: 'myth14_set',
  },

  // ============================================
  // 站台15：星光弗丽嘉站（T9装备 - 传说品质）
  // 套装效果：4件套生命值+20%
  // ============================================
  'myth15_helmet_starlight_queen': {
    id: 'myth15_helmet_starlight_queen', name: '星光天后冠', type: ItemType.ARMOR, rarity: ItemRarity.LEGENDARY,
    description: '弗丽嘉站传说防具，防御+102，生命+750，减伤30%',
    defense: 102, maxHp: 750, damageReduction: 0.30, armorSlot: 'head',
    requiredLevel: 30, power: 332.0, sublimationLevel: 0,
    setId: 'myth15_set',
  },
  'myth15_chest_starlight': {
    id: 'myth15_chest_starlight', name: '星光神纹铠甲', type: ItemType.ARMOR, rarity: ItemRarity.LEGENDARY,
    description: '弗丽嘉站传说防具，防御+124，生命+920，防御+20%',
    defense: 124, maxHp: 920, armorSlot: 'chest',
    requiredLevel: 30, power: 394.0, sublimationLevel: 0,
    setId: 'myth15_set',
  },
  'myth15_legs_starlight': {
    id: 'myth15_legs_starlight', name: '星光护裤', type: ItemType.ARMOR, rarity: ItemRarity.LEGENDARY,
    description: '弗丽嘉站传说防具，防御+86，闪避+48%',
    defense: 86, dodgeRate: 0.48, armorSlot: 'legs',
    requiredLevel: 30, power: 245.2, sublimationLevel: 0,
    setId: 'myth15_set',
  },
  'myth15_feet_starlight': {
    id: 'myth15_feet_starlight', name: '星光踏靴', type: ItemType.ARMOR, rarity: ItemRarity.LEGENDARY,
    description: '弗丽嘉站传说防具，闪避+54%，攻速+34%',
    defense: 0, dodgeRate: 0.54, speed: 0.34, armorSlot: 'feet',
    requiredLevel: 30, power: 217.0, sublimationLevel: 0,
    setId: 'myth15_set',
  },
  'myth15_weapon_starlight_scepter': {
    id: 'myth15_weapon_starlight_scepter', name: '星光权杖', type: ItemType.WEAPON, rarity: ItemRarity.LEGENDARY,
    description: '弗丽嘉站传说武器，攻击+192，穿透+46%',
    attack: 192, penetration: 0.46,
    requiredLevel: 30, power: 862.4, sublimationLevel: 0,
    setId: 'myth15_set',
  },
  'myth15_accessory_frigg_skirt': {
    id: 'myth15_accessory_frigg_skirt', name: '弗丽嘉之裙碎片', type: ItemType.ACCESSORY, rarity: ItemRarity.LEGENDARY,
    description: '弗丽嘉站传说饰品，命中+84，暴击+24%',
    hitRate: 84, critRate: 0.24,
    requiredLevel: 30, power: 206.8, sublimationLevel: 0,
    setId: 'myth15_set',
  },

  // ============================================
  // 站台16：诗韵布拉基站（T8++装备 - 传说品质）
  // 套装效果：4件套生命值+20%
  // ============================================
  'myth16_helmet_poetry': {
    id: 'myth16_helmet_poetry', name: '诗韵头盔', type: ItemType.ARMOR, rarity: ItemRarity.LEGENDARY,
    description: '布拉基站传说防具，防御+96，生命+700，减伤28%',
    defense: 96, maxHp: 700, damageReduction: 0.28, armorSlot: 'head',
    requiredLevel: 29, power: 310.8, sublimationLevel: 0,
    setId: 'myth16_set',
  },
  'myth16_chest_poet_emblem': {
    id: 'myth16_chest_poet_emblem', name: '诗神纹章胸甲', type: ItemType.ARMOR, rarity: ItemRarity.LEGENDARY,
    description: '布拉基站传说防具，防御+116，生命+860，攻击+24%',
    defense: 116, maxHp: 860, armorSlot: 'chest',
    requiredLevel: 29, power: 386.0, sublimationLevel: 0,
    setId: 'myth16_set',
  },
  'myth16_legs_poetry': {
    id: 'myth16_legs_poetry', name: '诗韵护裤', type: ItemType.ARMOR, rarity: ItemRarity.LEGENDARY,
    description: '布拉基站传说防具，防御+80，闪避+44%',
    defense: 80, dodgeRate: 0.44, armorSlot: 'legs',
    requiredLevel: 29, power: 228.6, sublimationLevel: 0,
    setId: 'myth16_set',
  },
  'myth16_feet_poetry': {
    id: 'myth16_feet_poetry', name: '诗韵踏靴', type: ItemType.ARMOR, rarity: ItemRarity.LEGENDARY,
    description: '布拉基站传说防具，闪避+50%，攻速+34%',
    defense: 0, dodgeRate: 0.50, speed: 0.34, armorSlot: 'feet',
    requiredLevel: 29, power: 203.0, sublimationLevel: 0,
    setId: 'myth16_set',
  },
  'myth16_weapon_poet_quill': {
    id: 'myth16_weapon_poet_quill', name: '诗韵羽笔刃', type: ItemType.WEAPON, rarity: ItemRarity.LEGENDARY,
    description: '布拉基站传说武器，攻击+180，穿透+44%',
    attack: 180, penetration: 0.44,
    requiredLevel: 29, power: 802.8, sublimationLevel: 0,
    setId: 'myth16_set',
  },
  'myth16_accessory_bragi_pen': {
    id: 'myth16_accessory_bragi_pen', name: '布拉基之笔碎片', type: ItemType.ACCESSORY, rarity: ItemRarity.LEGENDARY,
    description: '布拉基站传说饰品，命中+80，暴击+24%',
    hitRate: 80, critRate: 0.24,
    requiredLevel: 29, power: 200.0, sublimationLevel: 0,
    setId: 'myth16_set',
  },
};

// 获取站台9-16装备
export function getMythologyItems9_16(): Record<string, Item> {
  return MYTHOLOGY_ITEMS_9_16;
}
