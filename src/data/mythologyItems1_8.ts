import type { Item } from './types';
import { ItemType, ItemRarity } from './types';

// ============================================
// 神话站台专属装备数据 - 站台1-8
// 基于数值设定/装备数值.md V2.0
// ============================================

export const MYTHOLOGY_ITEMS_1_8: Record<string, Item> = {
  // ============================================
  // 站台1：锈蚀赫利俄斯站（T1装备 - 普通品质）
  // 套装效果：2件套攻击+8%
  // ============================================
  'myth1_helmet_rusty_sun': {
    id: 'myth1_helmet_rusty_sun', name: '锈蚀太阳头盔', type: ItemType.ARMOR, rarity: ItemRarity.COMMON,
    description: '赫利俄斯站基础防具，防御+12，生命+80，减伤5%',
    defense: 12, maxHp: 80, damageReduction: 0.05, armorSlot: 'head',
    requiredLevel: 16, power: 25.4, sublimationLevel: 0,
    setId: 'myth1_set',
  },
  'myth1_chest_bronze_light': {
    id: 'myth1_chest_bronze_light', name: '青铜光纹胸甲', type: ItemType.ARMOR, rarity: ItemRarity.COMMON,
    description: '赫利俄斯站基础防具，防御+16，生命+120，攻击+5%',
    defense: 16, maxHp: 120, armorSlot: 'chest',
    requiredLevel: 16, power: 38.2, sublimationLevel: 0,
    setId: 'myth1_set',
  },
  'myth1_legs_molten_iron': {
    id: 'myth1_legs_molten_iron', name: '熔铁护腿', type: ItemType.ARMOR, rarity: ItemRarity.COMMON,
    description: '赫利俄斯站基础防具，防御+8，闪避+8%',
    defense: 8, dodgeRate: 0.08, armorSlot: 'legs',
    requiredLevel: 16, power: 18.2, sublimationLevel: 0,
    setId: 'myth1_set',
  },
  'myth1_feet_light': {
    id: 'myth1_feet_light', name: '光明战靴', type: ItemType.ARMOR, rarity: ItemRarity.COMMON,
    description: '赫利俄斯站基础防具，闪避+10%，攻速+8%',
    defense: 0, dodgeRate: 0.10, speed: 0.08, armorSlot: 'feet',
    requiredLevel: 16, power: 16.8, sublimationLevel: 0,
    setId: 'myth1_set',
  },
  'myth1_weapon_bronze_blade': {
    id: 'myth1_weapon_bronze_blade', name: '青铜光刃剑', type: ItemType.WEAPON, rarity: ItemRarity.COMMON,
    description: '赫利俄斯站基础武器，攻击+24，穿透+5%',
    attack: 24, penetration: 0.05,
    requiredLevel: 16, power: 98.4, sublimationLevel: 0,
    setId: 'myth1_set',
  },
  'myth1_accessory_sun_fragment': {
    id: 'myth1_accessory_sun_fragment', name: '太阳碎片吊坠', type: ItemType.ACCESSORY, rarity: ItemRarity.COMMON,
    description: '赫利俄斯站基础饰品，命中+12，暴击+4%',
    hitRate: 12, critRate: 0.04,
    requiredLevel: 16, power: 17.8, sublimationLevel: 0,
    setId: 'myth1_set',
  },

  // ============================================
  // 站台2：雾隐瓦尔哈拉补给站（T1+装备 - 优秀品质）
  // 套装效果：2件套攻击+8%
  // ============================================
  'myth2_helmet_mist_hero': {
    id: 'myth2_helmet_mist_hero', name: '雾隐英灵头盔', type: ItemType.ARMOR, rarity: ItemRarity.UNCOMMON,
    description: '瓦尔哈拉站基础防具，防御+16，生命+100，命中+8',
    defense: 16, maxHp: 100, hitRate: 8, armorSlot: 'head',
    requiredLevel: 17, power: 33.8, sublimationLevel: 0,
    setId: 'myth2_set',
  },
  'myth2_chest_dark_hero': {
    id: 'myth2_chest_dark_hero', name: '暗纹英灵铠甲', type: ItemType.ARMOR, rarity: ItemRarity.UNCOMMON,
    description: '瓦尔哈拉站基础防具，防御+20，生命+140，恢复+1.5%/秒',
    defense: 20, maxHp: 140, hpRegen: 0.015, armorSlot: 'chest',
    requiredLevel: 17, power: 47.2, sublimationLevel: 0,
    setId: 'myth2_set',
  },
  'myth2_legs_mist': {
    id: 'myth2_legs_mist', name: '雾绒护裤', type: ItemType.ARMOR, rarity: ItemRarity.UNCOMMON,
    description: '瓦尔哈拉站基础防具，防御+12，闪避+10%',
    defense: 12, dodgeRate: 0.10, armorSlot: 'legs',
    requiredLevel: 17, power: 25.8, sublimationLevel: 0,
    setId: 'myth2_set',
  },
  'myth2_feet_hero': {
    id: 'myth2_feet_hero', name: '雾行靴', type: ItemType.ARMOR, rarity: ItemRarity.UNCOMMON,
    description: '瓦尔哈拉站基础防具，闪避+12%，攻速+10%',
    defense: 0, dodgeRate: 0.12, speed: 0.10, armorSlot: 'feet',
    requiredLevel: 17, power: 22.4, sublimationLevel: 0,
    setId: 'myth2_set',
  },
  'myth2_weapon_mist_blade': {
    id: 'myth2_weapon_mist_blade', name: '残破英灵长剑', type: ItemType.WEAPON, rarity: ItemRarity.UNCOMMON,
    description: '瓦尔哈拉站基础武器，攻击+32，穿透+7%',
    attack: 32, penetration: 0.07,
    requiredLevel: 17, power: 131.2, sublimationLevel: 0,
    setId: 'myth2_set',
  },
  'myth2_accessory_hero_fragment': {
    id: 'myth2_accessory_hero_fragment', name: '英灵之誓碎片挂坠', type: ItemType.ACCESSORY, rarity: ItemRarity.UNCOMMON,
    description: '瓦尔哈拉站基础饰品，命中+16，暴击+5%',
    hitRate: 16, critRate: 0.05,
    requiredLevel: 17, power: 23.6, sublimationLevel: 0,
    setId: 'myth2_set',
  },

  // ============================================
  // 站台3：断裂彩虹桥枢纽（T2装备 - 优秀品质）
  // 套装效果：2件套攻击+8%
  // ============================================
  'myth3_helmet_rainbow': {
    id: 'myth3_helmet_rainbow', name: '水晶雷纹头盔', type: ItemType.ARMOR, rarity: ItemRarity.UNCOMMON,
    description: '彩虹桥站基础防具，防御+20，生命+140，减伤8%',
    defense: 20, maxHp: 140, damageReduction: 0.08, armorSlot: 'head',
    requiredLevel: 18, power: 44.2, sublimationLevel: 0,
    setId: 'myth3_set',
  },
  'myth3_chest_rainbow': {
    id: 'myth3_chest_rainbow', name: '彩虹晶甲', type: ItemType.ARMOR, rarity: ItemRarity.UNCOMMON,
    description: '彩虹桥站基础防具，防御+24，生命+180，战斗开始+200护盾',
    defense: 24, maxHp: 180, shield: 200, armorSlot: 'chest',
    requiredLevel: 18, power: 58.6, sublimationLevel: 0,
    setId: 'myth3_set',
  },
  'myth3_legs_crystal': {
    id: 'myth3_legs_crystal', name: '晶纹护腿', type: ItemType.ARMOR, rarity: ItemRarity.UNCOMMON,
    description: '彩虹桥站基础防具，防御+16，闪避+12%',
    defense: 16, dodgeRate: 0.12, armorSlot: 'legs',
    requiredLevel: 18, power: 34.2, sublimationLevel: 0,
    setId: 'myth3_set',
  },
  'myth3_feet_space': {
    id: 'myth3_feet_space', name: '空间踏靴', type: ItemType.ARMOR, rarity: ItemRarity.UNCOMMON,
    description: '彩虹桥站基础防具，闪避+14%，攻速+12%',
    defense: 0, dodgeRate: 0.14, speed: 0.12, armorSlot: 'feet',
    requiredLevel: 18, power: 29.8, sublimationLevel: 0,
    setId: 'myth3_set',
  },
  'myth3_weapon_thunder': {
    id: 'myth3_weapon_thunder', name: '雷晶战锤', type: ItemType.WEAPON, rarity: ItemRarity.UNCOMMON,
    description: '彩虹桥站基础武器，攻击+40，穿透+9%',
    attack: 40, penetration: 0.09,
    requiredLevel: 18, power: 164.8, sublimationLevel: 0,
    setId: 'myth3_set',
  },
  'myth3_accessory_rainbow': {
    id: 'myth3_accessory_rainbow', name: '彩虹结晶手链', type: ItemType.ACCESSORY, rarity: ItemRarity.UNCOMMON,
    description: '彩虹桥站基础饰品，命中+20，暴击+6%，穿透+4%',
    hitRate: 20, critRate: 0.06, penetration: 0.04,
    requiredLevel: 18, power: 29.6, sublimationLevel: 0,
    setId: 'myth3_set',
  },

  // ============================================
  // 站台4：枯寂奥林匹斯中继站（T3装备 - 精良品质）
  // 套装效果：2件套攻击+10%
  // ============================================
  'myth4_helmet_olympus': {
    id: 'myth4_helmet_olympus', name: '奥林匹斯雷盔', type: ItemType.ARMOR, rarity: ItemRarity.RARE,
    description: '奥林匹斯站精良防具，防御+30，生命+200，减伤12%，防御+8%',
    defense: 30, maxHp: 200, damageReduction: 0.12, armorSlot: 'head',
    requiredLevel: 20, power: 78.6, sublimationLevel: 0,
    setId: 'myth4_set',
  },
  'myth4_chest_gold_thunder': {
    id: 'myth4_chest_gold_thunder', name: '黄金雷纹胸甲', type: ItemType.ARMOR, rarity: ItemRarity.RARE,
    description: '奥林匹斯站精良防具，防御+36，生命+250，攻击+8%，恢复+2%/秒',
    defense: 36, maxHp: 250, hpRegen: 0.02, armorSlot: 'chest',
    requiredLevel: 20, power: 98.8, sublimationLevel: 0,
    setId: 'myth4_set',
  },
  'myth4_legs_thunder': {
    id: 'myth4_legs_thunder', name: '惊雷护裤', type: ItemType.ARMOR, rarity: ItemRarity.RARE,
    description: '奥林匹斯站精良防具，防御+24，闪避+15%',
    defense: 24, dodgeRate: 0.15, armorSlot: 'legs',
    requiredLevel: 20, power: 56.4, sublimationLevel: 0,
    setId: 'myth4_set',
  },
  'myth4_feet_thunder': {
    id: 'myth4_feet_thunder', name: '雷踏战靴', type: ItemType.ARMOR, rarity: ItemRarity.RARE,
    description: '奥林匹斯站精良防具，闪避+18%，攻速+15%',
    defense: 0, dodgeRate: 0.18, speed: 0.15, armorSlot: 'feet',
    requiredLevel: 20, power: 48.6, sublimationLevel: 0,
    setId: 'myth4_set',
  },
  'myth4_weapon_thunder_blade': {
    id: 'myth4_weapon_thunder_blade', name: '惊雷长剑', type: ItemType.WEAPON, rarity: ItemRarity.RARE,
    description: '奥林匹斯站精良武器，攻击+58，穿透+12%',
    attack: 58, penetration: 0.12,
    requiredLevel: 20, power: 241.0, sublimationLevel: 0,
    setId: 'myth4_set',
  },
  'myth4_accessory_zeus': {
    id: 'myth4_accessory_zeus', name: '宙斯闪电碎片挂坠', type: ItemType.ACCESSORY, rarity: ItemRarity.RARE,
    description: '奥林匹斯站精良饰品，命中+28，暴击+8%',
    hitRate: 28, critRate: 0.08,
    requiredLevel: 20, power: 48.4, sublimationLevel: 0,
    setId: 'myth4_set',
  },

  // ============================================
  // 站台5：残破德尔斐预言站（T4装备 - 精良品质）
  // 套装效果：2件套攻击+10%
  // ============================================
  'myth5_helmet_prophecy': {
    id: 'myth5_helmet_prophecy', name: '预言神冠', type: ItemType.ARMOR, rarity: ItemRarity.RARE,
    description: '德尔斐站精良防具，防御+34，生命+230，命中+10',
    defense: 34, maxHp: 230, hitRate: 10, armorSlot: 'head',
    requiredLevel: 21, power: 89.8, sublimationLevel: 0,
    setId: 'myth5_set',
  },
  'myth5_chest_oracle': {
    id: 'myth5_chest_oracle', name: '神谕纹章胸甲', type: ItemType.ARMOR, rarity: ItemRarity.RARE,
    description: '德尔斐站精良防具，防御+42，生命+290，防御+10%，恢复+2.5%/秒',
    defense: 42, maxHp: 290, hpRegen: 0.025, armorSlot: 'chest',
    requiredLevel: 21, power: 115.6, sublimationLevel: 0,
    setId: 'myth5_set',
  },
  'myth5_legs_prophecy': {
    id: 'myth5_legs_prophecy', name: '预言护裤', type: ItemType.ARMOR, rarity: ItemRarity.RARE,
    description: '德尔斐站精良防具，防御+28，闪避+17%',
    defense: 28, dodgeRate: 0.17, armorSlot: 'legs',
    requiredLevel: 21, power: 66.8, sublimationLevel: 0,
    setId: 'myth5_set',
  },
  'myth5_feet_oracle': {
    id: 'myth5_feet_oracle', name: '神谕踏靴', type: ItemType.ARMOR, rarity: ItemRarity.RARE,
    description: '德尔斐站精良防具，闪避+20%，攻速+16%',
    defense: 0, dodgeRate: 0.20, speed: 0.16, armorSlot: 'feet',
    requiredLevel: 21, power: 57.8, sublimationLevel: 0,
    setId: 'myth5_set',
  },
  'myth5_weapon_scepter': {
    id: 'myth5_weapon_scepter', name: '预言权杖', type: ItemType.WEAPON, rarity: ItemRarity.RARE,
    description: '德尔斐站精良武器，攻击+66，穿透+14%',
    attack: 66, penetration: 0.14,
    requiredLevel: 21, power: 276.4, sublimationLevel: 0,
    setId: 'myth5_set',
  },
  'myth5_accessory_apollo': {
    id: 'myth5_accessory_apollo', name: '阿波罗预言碎片', type: ItemType.ACCESSORY, rarity: ItemRarity.RARE,
    description: '德尔斐站精良饰品，命中+32，暴击+9%',
    hitRate: 32, critRate: 0.09,
    requiredLevel: 21, power: 56.8, sublimationLevel: 0,
    setId: 'myth5_set',
  },

  // ============================================
  // 站台6：冰封密米尔智库站（T5装备 - 精良品质）
  // 套装效果：2件套攻击+10%
  // ============================================
  'myth6_helmet_wisdom': {
    id: 'myth6_helmet_wisdom', name: '冰封智慧头盔', type: ItemType.ARMOR, rarity: ItemRarity.RARE,
    description: '密米尔站精良防具，防御+38，生命+260，减伤14%',
    defense: 38, maxHp: 260, damageReduction: 0.14, armorSlot: 'head',
    requiredLevel: 22, power: 101.2, sublimationLevel: 0,
    setId: 'myth6_set',
  },
  'myth6_chest_mimir': {
    id: 'myth6_chest_mimir', name: '密米尔智慧铠甲', type: ItemType.ARMOR, rarity: ItemRarity.RARE,
    description: '密米尔站精良防具，防御+46，生命+320，攻击+10%，恢复+2.5%/秒',
    defense: 46, maxHp: 320, hpRegen: 0.025, armorSlot: 'chest',
    requiredLevel: 22, power: 128.6, sublimationLevel: 0,
    setId: 'myth6_set',
  },
  'myth6_legs_wisdom': {
    id: 'myth6_legs_wisdom', name: '智慧护裤', type: ItemType.ARMOR, rarity: ItemRarity.RARE,
    description: '密米尔站精良防具，防御+30，闪避+18%',
    defense: 30, dodgeRate: 0.18, armorSlot: 'legs',
    requiredLevel: 22, power: 74.2, sublimationLevel: 0,
    setId: 'myth6_set',
  },
  'myth6_feet_wisdom': {
    id: 'myth6_feet_wisdom', name: '智慧踏靴', type: ItemType.ARMOR, rarity: ItemRarity.RARE,
    description: '密米尔站精良防具，闪避+22%，攻速+17%',
    defense: 0, dodgeRate: 0.22, speed: 0.17, armorSlot: 'feet',
    requiredLevel: 22, power: 64.2, sublimationLevel: 0,
    setId: 'myth6_set',
  },
  'myth6_weapon_wisdom_blade': {
    id: 'myth6_weapon_wisdom_blade', name: '智慧长剑', type: ItemType.WEAPON, rarity: ItemRarity.RARE,
    description: '密米尔站精良武器，攻击+74，穿透+15%',
    attack: 74, penetration: 0.15,
    requiredLevel: 22, power: 311.8, sublimationLevel: 0,
    setId: 'myth6_set',
  },
  'myth6_accessory_mimir': {
    id: 'myth6_accessory_mimir', name: '密米尔之泪碎片', type: ItemType.ACCESSORY, rarity: ItemRarity.RARE,
    description: '密米尔站精良饰品，命中+36，暴击+10%',
    hitRate: 36, critRate: 0.10,
    requiredLevel: 22, power: 65.2, sublimationLevel: 0,
    setId: 'myth6_set',
  },

  // ============================================
  // 站台7：深渊赫尔驿站（T6装备 - 史诗品质）
  // 套装效果：3件套防御+15%
  // ============================================
  'myth7_helmet_hel': {
    id: 'myth7_helmet_hel', name: '冥界女王头盔', type: ItemType.ARMOR, rarity: ItemRarity.EPIC,
    description: '赫尔站史诗防具，防御+52，生命+360，减伤18%',
    defense: 52, maxHp: 360, damageReduction: 0.18, armorSlot: 'head',
    requiredLevel: 24, power: 148.8, sublimationLevel: 0,
    setId: 'myth7_set',
  },
  'myth7_chest_underworld': {
    id: 'myth7_chest_underworld', name: '赫尔冥府铠甲', type: ItemType.ARMOR, rarity: ItemRarity.EPIC,
    description: '赫尔站史诗防具，防御+62，生命+440，生命+12%，恢复+3%/秒',
    defense: 62, maxHp: 440, hpRegen: 0.03, armorSlot: 'chest',
    requiredLevel: 24, power: 188.4, sublimationLevel: 0,
    setId: 'myth7_set',
  },
  'myth7_legs_underworld': {
    id: 'myth7_legs_underworld', name: '冥府护裤', type: ItemType.ARMOR, rarity: ItemRarity.EPIC,
    description: '赫尔站史诗防具，防御+42，闪避+24%',
    defense: 42, dodgeRate: 0.24, armorSlot: 'legs',
    requiredLevel: 24, power: 108.6, sublimationLevel: 0,
    setId: 'myth7_set',
  },
  'myth7_feet_hel': {
    id: 'myth7_feet_hel', name: '赫尔踏靴', type: ItemType.ARMOR, rarity: ItemRarity.EPIC,
    description: '赫尔站史诗防具，闪避+28%，攻速+22%',
    defense: 0, dodgeRate: 0.28, speed: 0.22, armorSlot: 'feet',
    requiredLevel: 24, power: 94.4, sublimationLevel: 0,
    setId: 'myth7_set',
  },
  'myth7_weapon_scythe': {
    id: 'myth7_weapon_scythe', name: '赫尔之镰', type: ItemType.WEAPON, rarity: ItemRarity.EPIC,
    description: '赫尔站史诗武器，攻击+98，穿透+22%',
    attack: 98, penetration: 0.22,
    requiredLevel: 24, power: 420.0, sublimationLevel: 0,
    setId: 'myth7_set',
  },
  'myth7_accessory_hel': {
    id: 'myth7_accessory_hel', name: '赫尔之核碎片', type: ItemType.ACCESSORY, rarity: ItemRarity.EPIC,
    description: '赫尔站史诗饰品，命中+44，暴击+14%',
    hitRate: 44, critRate: 0.14,
    requiredLevel: 24, power: 92.8, sublimationLevel: 0,
    setId: 'myth7_set',
  },

  // ============================================
  // 站台8：无神之境枢纽（T7装备 - 史诗品质）
  // 套装效果：3件套防御+15%
  // ============================================
  'myth8_helmet_chaos': {
    id: 'myth8_helmet_chaos', name: '无神混沌头盔', type: ItemType.ARMOR, rarity: ItemRarity.EPIC,
    description: '无神之境史诗防具，防御+58，生命+410，减伤20%',
    defense: 58, maxHp: 410, damageReduction: 0.20, armorSlot: 'head',
    requiredLevel: 25, power: 168.6, sublimationLevel: 0,
    setId: 'myth8_set',
  },
  'myth8_chest_chaos': {
    id: 'myth8_chest_chaos', name: '混沌神纹铠甲', type: ItemType.ARMOR, rarity: ItemRarity.EPIC,
    description: '无神之境史诗防具，防御+70，生命+500，攻击+14%，恢复+3.5%/秒',
    defense: 70, maxHp: 500, hpRegen: 0.035, armorSlot: 'chest',
    requiredLevel: 25, power: 214.0, sublimationLevel: 0,
    setId: 'myth8_set',
  },
  'myth8_legs_chaos': {
    id: 'myth8_legs_chaos', name: '混沌护裤', type: ItemType.ARMOR, rarity: ItemRarity.EPIC,
    description: '无神之境史诗防具，防御+48，闪避+28%',
    defense: 48, dodgeRate: 0.28, armorSlot: 'legs',
    requiredLevel: 25, power: 123.6, sublimationLevel: 0,
    setId: 'myth8_set',
  },
  'myth8_feet_chaos': {
    id: 'myth8_feet_chaos', name: '混沌踏靴', type: ItemType.ARMOR, rarity: ItemRarity.EPIC,
    description: '无神之境史诗防具，闪避+32%，攻速+24%',
    defense: 0, dodgeRate: 0.32, speed: 0.24, armorSlot: 'feet',
    requiredLevel: 25, power: 108.0, sublimationLevel: 0,
    setId: 'myth8_set',
  },
  'myth8_weapon_chaos_blade': {
    id: 'myth8_weapon_chaos_blade', name: '混沌之刃', type: ItemType.WEAPON, rarity: ItemRarity.EPIC,
    description: '无神之境史诗武器，攻击+112，穿透+25%',
    attack: 112, penetration: 0.25,
    requiredLevel: 25, power: 482.0, sublimationLevel: 0,
    setId: 'myth8_set',
  },
  'myth8_accessory_godless': {
    id: 'myth8_accessory_godless', name: '无神之心碎片', type: ItemType.ACCESSORY, rarity: ItemRarity.EPIC,
    description: '无神之境史诗饰品，命中+50，暴击+16%',
    hitRate: 50, critRate: 0.16,
    requiredLevel: 25, power: 106.8, sublimationLevel: 0,
    setId: 'myth8_set',
  },
};

// 获取站台1-8装备
export function getMythologyItems1_8(): Record<string, Item> {
  return MYTHOLOGY_ITEMS_1_8;
}
