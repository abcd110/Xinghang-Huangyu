// 神话站台专属装备数据
// 基于《装备数值设定_膨胀版_自动战斗版》

import { ItemRarity } from './types';
import {
  EquipmentSlot,
  EffectTrigger,
  EffectType,
  type MythologyEquipment,
} from './equipmentTypes';

// 站台1-8装备（新手期-进阶期）
export const MYTHOLOGY_EQUIPMENT: Record<string, MythologyEquipment> = {
  // ==================== 站台1：锈蚀赫利俄斯站 ====================
  'myth_equip_1_1': {
    id: 'myth_equip_1_1',
    name: '锈蚀太阳头盔',
    slot: EquipmentSlot.HEAD,
    rarity: ItemRarity.COMMON,
    level: 1,
    stationId: 'myth_station_1',
    stationNumber: 1,
    description: '青铜材质，附带微弱金光，提升防御力',
    stats: { defense: 3, hp: 20 },
    effects: [
      {
        id: 'sun_helmet_dmg_reduce',
        type: EffectType.REDUCE_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.03,
        chance: 1,
        description: '受到的伤害-3%'
      }
    ]
  },
  'myth_equip_1_2': {
    id: 'myth_equip_1_2',
    name: '青铜光纹胸甲',
    slot: EquipmentSlot.BODY,
    rarity: ItemRarity.COMMON,
    level: 1,
    stationId: 'myth_station_1',
    stationNumber: 1,
    description: '抵御锈蚀伤害，吸收微量阳光神力',
    stats: { defense: 4, hp: 30 },
    effects: [
      {
        id: 'sun_armor_atk_boost',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.03,
        chance: 1,
        description: '攻击+3%'
      }
    ]
  },
  'myth_equip_1_3': {
    id: 'myth_equip_1_3',
    name: '熔铁护腿',
    slot: EquipmentSlot.LEGS,
    rarity: ItemRarity.COMMON,
    level: 1,
    stationId: 'myth_station_1',
    stationNumber: 1,
    description: '防火锈腐蚀，提升闪避能力',
    stats: { defense: 2, dodge: 3 },
    effects: [
      {
        id: 'sun_legs_dodge',
        type: EffectType.BOOST_DODGE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.02,
        chance: 1,
        description: '闪避率+2%'
      }
    ]
  },
  'myth_equip_1_4': {
    id: 'myth_equip_1_4',
    name: '光明战靴',
    slot: EquipmentSlot.FEET,
    rarity: ItemRarity.COMMON,
    level: 1,
    stationId: 'myth_station_1',
    stationNumber: 1,
    description: '青铜鞋底，抗铁锈粘连',
    stats: { dodge: 4, speed: 0.05 },
    effects: [
      {
        id: 'sun_boots_speed',
        type: EffectType.BOOST_SPEED,
        trigger: EffectTrigger.PASSIVE,
        value: 0.03,
        chance: 1,
        description: '攻速+3%'
      }
    ]
  },
  'myth_equip_1_5': {
    id: 'myth_equip_1_5',
    name: '青铜光刃剑',
    slot: EquipmentSlot.WEAPON,
    rarity: ItemRarity.COMMON,
    level: 1,
    stationId: 'myth_station_1',
    stationNumber: 1,
    description: '剑身附着微光，攻击时有几率触发光属性伤害',
    stats: { attack: 6, penetration: 0.02 },
    effects: [
      {
        id: 'sun_weapon_light_dmg',
        type: EffectType.DAMAGE_BONUS,
        trigger: EffectTrigger.ON_ATTACK,
        value: 0.20,
        chance: 0.10,
        description: '攻击时10%概率附加光属性伤害（攻击力的20%）'
      }
    ]
  },
  'myth_equip_1_6': {
    id: 'myth_equip_1_6',
    name: '太阳碎片吊坠',
    slot: EquipmentSlot.ACCESSORY,
    rarity: ItemRarity.COMMON,
    level: 1,
    stationId: 'myth_station_1',
    stationNumber: 1,
    description: '赫利俄斯神力残留',
    stats: { hit: 5, crit: 0.02 },
    effects: [
      {
        id: 'sun_acc_crit_dmg',
        type: EffectType.BOOST_CRIT,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '暴击伤害+10%'
      }
    ]
  },

  // ==================== 站台2：雾隐瓦尔哈拉补给站 ====================
  'myth_equip_2_1': {
    id: 'myth_equip_2_1',
    name: '雾隐英灵头盔',
    slot: EquipmentSlot.HEAD,
    rarity: ItemRarity.COMMON,
    level: 2,
    stationId: 'myth_station_2',
    stationNumber: 2,
    description: '黑色哑光材质，隐藏自身气息',
    stats: { defense: 4, hp: 25 },
    effects: [
      {
        id: 'mist_helmet_hit',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 3,
        chance: 1,
        description: '命中率+3'
      }
    ]
  },
  'myth_equip_2_2': {
    id: 'myth_equip_2_2',
    name: '暗纹英灵铠甲',
    slot: EquipmentSlot.BODY,
    rarity: ItemRarity.COMMON,
    level: 2,
    stationId: 'myth_station_2',
    stationNumber: 2,
    description: '轻便防御，吸收英灵残魂气息',
    stats: { defense: 5, hp: 35 },
    effects: [
      {
        id: 'mist_armor_heal',
        type: EffectType.HEAL_PERCENT,
        trigger: EffectTrigger.PASSIVE,
        value: 0.01,
        chance: 1,
        description: '生命恢复+每秒1%'
      }
    ]
  },
  'myth_equip_2_3': {
    id: 'myth_equip_2_3',
    name: '雾绒护裤',
    slot: EquipmentSlot.LEGS,
    rarity: ItemRarity.COMMON,
    level: 2,
    stationId: 'myth_station_2',
    stationNumber: 2,
    description: '抵御荒原低温',
    stats: { defense: 3, dodge: 4 },
    effects: [
      {
        id: 'mist_legs_dodge_heal',
        type: EffectType.HEAL_FIXED,
        trigger: EffectTrigger.ON_DODGE,
        value: 10,
        chance: 0.05,
        description: '被攻击时5%概率闪避并恢复10生命'
      }
    ]
  },
  'myth_equip_2_4': {
    id: 'myth_equip_2_4',
    name: '雾行靴',
    slot: EquipmentSlot.FEET,
    rarity: ItemRarity.COMMON,
    level: 2,
    stationId: 'myth_station_2',
    stationNumber: 2,
    description: '防滑，避免陷入雾中陷阱',
    stats: { dodge: 5, speed: 0.06 },
    effects: [
      {
        id: 'mist_boots_speed',
        type: EffectType.BOOST_SPEED,
        trigger: EffectTrigger.PASSIVE,
        value: 0.04,
        chance: 1,
        description: '攻速+4%'
      }
    ]
  },
  'myth_equip_2_5': {
    id: 'myth_equip_2_5',
    name: '残破英灵长剑',
    slot: EquipmentSlot.WEAPON,
    rarity: ItemRarity.COMMON,
    level: 2,
    stationId: 'myth_station_2',
    stationNumber: 2,
    description: '附带微弱精神伤害',
    stats: { attack: 8, penetration: 0.03 },
    effects: [
      {
        id: 'mist_weapon_crit',
        type: EffectType.DAMAGE_BONUS,
        trigger: EffectTrigger.ON_ATTACK,
        value: 0.50,
        chance: 0.15,
        description: '攻击时15%概率造成1.5倍伤害'
      }
    ]
  },
  'myth_equip_2_6': {
    id: 'myth_equip_2_6',
    name: '英灵之誓碎片挂坠',
    slot: EquipmentSlot.ACCESSORY,
    rarity: ItemRarity.COMMON,
    level: 2,
    stationId: 'myth_station_2',
    stationNumber: 2,
    description: '短暂震慑雾牙狼',
    stats: { hit: 6, crit: 0.02 },
    effects: [
      {
        id: 'mist_acc_low_hp',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.ON_HP_LOW,
        value: 0.10,
        chance: 1,
        condition: { type: 'hp_below', value: 0.30 },
        description: '生命低于30%时，攻击+10%'
      }
    ]
  },

  // ==================== 站台3：断裂彩虹桥枢纽 ====================
  'myth_equip_3_1': {
    id: 'myth_equip_3_1',
    name: '水晶雷纹头盔',
    slot: EquipmentSlot.HEAD,
    rarity: ItemRarity.COMMON,
    level: 3,
    stationId: 'myth_station_3',
    stationNumber: 3,
    description: '七彩水晶材质，抵御雷电伤害',
    stats: { defense: 5, hp: 35 },
    effects: [
      {
        id: 'rainbow_helmet_dmg_reduce',
        type: EffectType.REDUCE_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.05,
        chance: 1,
        description: '受到的伤害-5%'
      }
    ]
  },
  'myth_equip_3_2': {
    id: 'myth_equip_3_2',
    name: '彩虹晶甲',
    slot: EquipmentSlot.BODY,
    rarity: ItemRarity.COMMON,
    level: 3,
    stationId: 'myth_station_3',
    stationNumber: 3,
    description: '轻便且坚韧，吸收空间神力',
    stats: { defense: 6, hp: 45 },
    effects: [
      {
        id: 'rainbow_armor_shield',
        type: EffectType.SHIELD_GAIN,
        trigger: EffectTrigger.ON_BATTLE_START,
        value: 100,
        duration: 30,
        chance: 1,
        description: '战斗开始时获得100护盾（持续30秒）'
      }
    ]
  },
  'myth_equip_3_3': {
    id: 'myth_equip_3_3',
    name: '晶纹护腿',
    slot: EquipmentSlot.LEGS,
    rarity: ItemRarity.COMMON,
    level: 3,
    stationId: 'myth_station_3',
    stationNumber: 3,
    description: '防止空间扭曲撕裂',
    stats: { defense: 4, dodge: 5 },
    effects: [
      {
        id: 'rainbow_legs_dodge',
        type: EffectType.BOOST_DODGE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.03,
        chance: 1,
        description: '闪避率+3%'
      }
    ]
  },
  'myth_equip_3_4': {
    id: 'myth_equip_3_4',
    name: '空间踏靴',
    slot: EquipmentSlot.FEET,
    rarity: ItemRarity.COMMON,
    level: 3,
    stationId: 'myth_station_3',
    stationNumber: 3,
    description: '可短暂穿梭小型空间裂缝',
    stats: { dodge: 6, speed: 0.08 },
    effects: [
      {
        id: 'rainbow_boots_speed',
        type: EffectType.BOOST_SPEED,
        trigger: EffectTrigger.PASSIVE,
        value: 0.05,
        chance: 1,
        description: '攻速+5%'
      }
    ]
  },
  'myth_equip_3_5': {
    id: 'myth_equip_3_5',
    name: '雷晶战锤',
    slot: EquipmentSlot.WEAPON,
    rarity: ItemRarity.COMMON,
    level: 3,
    stationId: 'myth_station_3',
    stationNumber: 3,
    description: '附带雷电伤害，可触发范围雷击',
    stats: { attack: 11, penetration: 0.04 },
    effects: [
      {
        id: 'rainbow_weapon_thunder',
        type: EffectType.DAMAGE_BONUS,
        trigger: EffectTrigger.ON_ATTACK,
        value: 0.30,
        chance: 0.20,
        description: '攻击时20%概率触发雷电（额外30%攻击力伤害，可溅射）'
      }
    ]
  },
  'myth_equip_3_6': {
    id: 'myth_equip_3_6',
    name: '彩虹结晶手链',
    slot: EquipmentSlot.ACCESSORY,
    rarity: ItemRarity.COMMON,
    level: 3,
    stationId: 'myth_station_3',
    stationNumber: 3,
    description: '吸收微量雷电神力',
    stats: { hit: 8, crit: 0.03 },
    effects: [
      {
        id: 'rainbow_acc_pen',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.02,
        chance: 1,
        description: '穿透率+2%'
      }
    ]
  },

  // ==================== 站台4：枯寂奥林匹斯中继站 ====================
  'myth_equip_4_1': {
    id: 'myth_equip_4_1',
    name: '奥林匹斯雷盔',
    slot: EquipmentSlot.HEAD,
    rarity: ItemRarity.COMMON,
    level: 4,
    stationId: 'myth_station_4',
    stationNumber: 4,
    description: '黄金材质，抵御闪电伤害',
    stats: { defense: 6, hp: 45 },
    effects: [
      {
        id: 'zeus_helmet_dmg_reduce',
        type: EffectType.REDUCE_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.06,
        chance: 1,
        description: '受到的伤害-6%，防御+5%'
      }
    ]
  },
  'myth_equip_4_2': {
    id: 'myth_equip_4_2',
    name: '黄金雷纹胸甲',
    slot: EquipmentSlot.BODY,
    rarity: ItemRarity.COMMON,
    level: 4,
    stationId: 'myth_station_4',
    stationNumber: 4,
    description: '吸收闪电神力',
    stats: { defense: 8, hp: 55 },
    effects: [
      {
        id: 'zeus_armor_atk_heal',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.05,
        chance: 1,
        description: '攻击+5%，生命恢复+每秒1.5%'
      }
    ]
  },
  'myth_equip_4_3': {
    id: 'myth_equip_4_3',
    name: '惊雷护裤',
    slot: EquipmentSlot.LEGS,
    rarity: ItemRarity.COMMON,
    level: 4,
    stationId: 'myth_station_4',
    stationNumber: 4,
    description: '防止闪电传导伤害',
    stats: { defense: 5, dodge: 6 },
    effects: [
      {
        id: 'zeus_legs_dodge',
        type: EffectType.BOOST_DODGE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.04,
        chance: 1,
        description: '闪避率+4%'
      }
    ]
  },
  'myth_equip_4_4': {
    id: 'myth_equip_4_4',
    name: '雷踏战靴',
    slot: EquipmentSlot.FEET,
    rarity: ItemRarity.COMMON,
    level: 4,
    stationId: 'myth_station_4',
    stationNumber: 4,
    description: '免疫地面闪电陷阱伤害',
    stats: { dodge: 7, speed: 0.10 },
    effects: [
      {
        id: 'zeus_boots_speed',
        type: EffectType.BOOST_SPEED,
        trigger: EffectTrigger.PASSIVE,
        value: 0.06,
        chance: 1,
        description: '攻速+6%'
      }
    ]
  },
  'myth_equip_4_5': {
    id: 'myth_equip_4_5',
    name: '惊雷长剑',
    slot: EquipmentSlot.WEAPON,
    rarity: ItemRarity.COMMON,
    level: 4,
    stationId: 'myth_station_4',
    stationNumber: 4,
    description: '附带闪电伤害，可触发单体雷击',
    stats: { attack: 15, penetration: 0.05 },
    effects: [
      {
        id: 'zeus_weapon_thunder',
        type: EffectType.DAMAGE_BONUS,
        trigger: EffectTrigger.ON_ATTACK,
        value: 0.40,
        chance: 0.25,
        description: '攻击时25%概率触发雷击（额外40%攻击力伤害）'
      }
    ]
  },
  'myth_equip_4_6': {
    id: 'myth_equip_4_6',
    name: '宙斯闪电碎片挂坠',
    slot: EquipmentSlot.ACCESSORY,
    rarity: ItemRarity.COMMON,
    level: 4,
    stationId: 'myth_station_4',
    stationNumber: 4,
    description: '吸收微量闪电神力',
    stats: { hit: 10, crit: 0.04 },
    effects: [
      {
        id: 'zeus_acc_true_dmg',
        type: EffectType.DAMAGE_TRUE,
        trigger: EffectTrigger.ON_CRIT,
        value: 0.20,
        chance: 0.30,
        description: '暴击时30%概率额外造成20%真实伤害'
      }
    ]
  },

  // ==================== 站台5：残破德尔斐预言站（精良品质）====================
  'myth_equip_5_1': {
    id: 'myth_equip_5_1',
    name: '预言神冠',
    slot: EquipmentSlot.HEAD,
    rarity: ItemRarity.UNCOMMON,
    level: 5,
    stationId: 'myth_station_5',
    stationNumber: 5,
    description: '轻便材质，提升视野范围',
    stats: { defense: 9, hp: 70, hit: 5 },
    effects: [
      {
        id: 'prophecy_helmet_crit_reduce',
        type: EffectType.REDUCE_CRIT,
        trigger: EffectTrigger.ON_DEFEND,
        value: 0.15,
        chance: 1,
        description: '被攻击时受到的暴击伤害-15%'
      }
    ],
    setBonus: {
      requiredPieces: 2,
      description: '2件套：攻击+5%',
      effect: {
        id: 'prophecy_set_2',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.05,
        chance: 1,
        description: '攻击+5%'
      }
    }
  },
  'myth_equip_5_2': {
    id: 'myth_equip_5_2',
    name: '神谕纹章胸甲',
    slot: EquipmentSlot.BODY,
    rarity: ItemRarity.UNCOMMON,
    level: 5,
    stationId: 'myth_station_5',
    stationNumber: 5,
    description: '吸收预言神力',
    stats: { defense: 12, hp: 90 },
    effects: [
      {
        id: 'prophecy_armor_def_heal',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.08,
        chance: 1,
        description: '防御+8%，生命恢复+每秒2%'
      }
    ],
    setBonus: {
      requiredPieces: 2,
      description: '2件套：攻击+5%',
      effect: {
        id: 'prophecy_set_2',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.05,
        chance: 1,
        description: '攻击+5%'
      }
    }
  },
  'myth_equip_5_3': {
    id: 'myth_equip_5_3',
    name: '预言护裤',
    slot: EquipmentSlot.LEGS,
    rarity: ItemRarity.UNCOMMON,
    level: 5,
    stationId: 'myth_station_5',
    stationNumber: 5,
    description: '提升移动速度',
    stats: { defense: 8, dodge: 9 },
    effects: [
      {
        id: 'prophecy_legs_dodge_heal',
        type: EffectType.BOOST_DODGE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.05,
        chance: 1,
        description: '闪避率+5%，闪避时恢复15生命'
      }
    ],
    setBonus: {
      requiredPieces: 2,
      description: '2件套：攻击+5%',
      effect: {
        id: 'prophecy_set_2',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.05,
        chance: 1,
        description: '攻击+5%'
      }
    }
  },
  'myth_equip_5_4': {
    id: 'myth_equip_5_4',
    name: '神谕踏靴',
    slot: EquipmentSlot.FEET,
    rarity: ItemRarity.UNCOMMON,
    level: 5,
    stationId: 'myth_station_5',
    stationNumber: 5,
    description: '踏入祭祀纹路区域可短暂获得"预言视野"',
    stats: { dodge: 10, speed: 0.12 },
    effects: [
      {
        id: 'prophecy_boots_speed',
        type: EffectType.BOOST_SPEED,
        trigger: EffectTrigger.PASSIVE,
        value: 0.07,
        chance: 1,
        description: '攻速+7%'
      }
    ],
    setBonus: {
      requiredPieces: 2,
      description: '2件套：攻击+5%',
      effect: {
        id: 'prophecy_set_2',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.05,
        chance: 1,
        description: '攻击+5%'
      }
    }
  },
  'myth_equip_5_5': {
    id: 'myth_equip_5_5',
    name: '预言权杖',
    slot: EquipmentSlot.WEAPON,
    rarity: ItemRarity.UNCOMMON,
    level: 5,
    stationId: 'myth_station_5',
    stationNumber: 5,
    description: '附带精神伤害，概率触发"预言威慑"',
    stats: { attack: 22, penetration: 0.07 },
    effects: [
      {
        id: 'prophecy_weapon_reduce_def',
        type: EffectType.REDUCE_DEFENSE,
        trigger: EffectTrigger.ON_ATTACK,
        value: 0.15,
        duration: 5,
        chance: 0.20,
        description: '攻击时20%概率降低敌人防御15%（持续5秒，可叠加2层）'
      }
    ],
    setBonus: {
      requiredPieces: 2,
      description: '2件套：攻击+5%',
      effect: {
        id: 'prophecy_set_2',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.05,
        chance: 1,
        description: '攻击+5%'
      }
    }
  },
  'myth_equip_5_6': {
    id: 'myth_equip_5_6',
    name: '阿波罗预言碎片',
    slot: EquipmentSlot.ACCESSORY,
    rarity: ItemRarity.UNCOMMON,
    level: 5,
    stationId: 'myth_station_5',
    stationNumber: 5,
    description: '概率获得怪物动向提示',
    stats: { hit: 12, crit: 0.05 },
    effects: [
      {
        id: 'prophecy_acc_low_hp',
        type: EffectType.BOOST_CRIT,
        trigger: EffectTrigger.ON_HP_LOW,
        value: 0.10,
        chance: 1,
        condition: { type: 'hp_below', value: 0.50 },
        description: '生命低于50%时，暴击率+10%'
      }
    ],
    setBonus: {
      requiredPieces: 2,
      description: '2件套：攻击+5%',
      effect: {
        id: 'prophecy_set_2',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.05,
        chance: 1,
        description: '攻击+5%'
      }
    }
  },

  // ==================== 站台6：冰封密米尔智库站（精良品质）====================
  'myth_equip_6_1': {
    id: 'myth_equip_6_1',
    name: '冰封智慧头盔',
    slot: EquipmentSlot.HEAD,
    rarity: ItemRarity.UNCOMMON,
    level: 6,
    stationId: 'myth_station_6',
    stationNumber: 6,
    description: '抵御寒冰伤害',
    stats: { defense: 12, hp: 90 },
    effects: [
      {
        id: 'wisdom_helmet_dmg_reduce',
        type: EffectType.REDUCE_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.08,
        chance: 1,
        description: '受到的伤害-8%，被攻击时10%概率降低敌人攻速10%（持续3秒）'
      }
    ],
    setBonus: {
      requiredPieces: 2,
      description: '2件套：攻击+5%',
      effect: {
        id: 'wisdom_set_2',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.05,
        chance: 1,
        description: '攻击+5%'
      }
    }
  },
  'myth_equip_6_2': {
    id: 'myth_equip_6_2',
    name: '冰纹智库铠甲',
    slot: EquipmentSlot.BODY,
    rarity: ItemRarity.UNCOMMON,
    level: 6,
    stationId: 'myth_station_6',
    stationNumber: 6,
    description: '吸收智慧神力',
    stats: { defense: 15, hp: 110 },
    effects: [
      {
        id: 'wisdom_armor_shield_heal',
        type: EffectType.SHIELD_GAIN,
        trigger: EffectTrigger.ON_BATTLE_START,
        value: 200,
        duration: 30,
        chance: 1,
        description: '战斗开始时获得200护盾，生命恢复+每秒2%'
      }
    ],
    setBonus: {
      requiredPieces: 2,
      description: '2件套：攻击+5%',
      effect: {
        id: 'wisdom_set_2',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.05,
        chance: 1,
        description: '攻击+5%'
      }
    }
  },
  'myth_equip_6_3': {
    id: 'myth_equip_6_3',
    name: '寒冰护裤',
    slot: EquipmentSlot.LEGS,
    rarity: ItemRarity.UNCOMMON,
    level: 6,
    stationId: 'myth_station_6',
    stationNumber: 6,
    description: '防止寒冰粘连',
    stats: { defense: 10, dodge: 11 },
    effects: [
      {
        id: 'wisdom_legs_dodge',
        type: EffectType.BOOST_DODGE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.06,
        chance: 1,
        description: '闪避率+6%'
      }
    ],
    setBonus: {
      requiredPieces: 2,
      description: '2件套：攻击+5%',
      effect: {
        id: 'wisdom_set_2',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.05,
        chance: 1,
        description: '攻击+5%'
      }
    }
  },
  'myth_equip_6_4': {
    id: 'myth_equip_6_4',
    name: '冰行靴',
    slot: EquipmentSlot.FEET,
    rarity: ItemRarity.UNCOMMON,
    level: 6,
    stationId: 'myth_station_6',
    stationNumber: 6,
    description: '防滑，冰封地面移动速度提升',
    stats: { dodge: 12, speed: 0.14 },
    effects: [
      {
        id: 'wisdom_boots_speed_slow',
        type: EffectType.BOOST_SPEED,
        trigger: EffectTrigger.PASSIVE,
        value: 0.08,
        chance: 1,
        description: '攻速+8%，攻击时10%概率降低敌人攻速8%（持续3秒）'
      }
    ],
    setBonus: {
      requiredPieces: 2,
      description: '2件套：攻击+5%',
      effect: {
        id: 'wisdom_set_2',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.05,
        chance: 1,
        description: '攻击+5%'
      }
    }
  },
  'myth_equip_6_5': {
    id: 'myth_equip_6_5',
    name: '智慧冰刃',
    slot: EquipmentSlot.WEAPON,
    rarity: ItemRarity.UNCOMMON,
    level: 6,
    stationId: 'myth_station_6',
    stationNumber: 6,
    description: '附带寒冰伤害，可破解冰封陷阱',
    stats: { attack: 28, penetration: 0.08 },
    effects: [
      {
        id: 'wisdom_weapon_ice',
        type: EffectType.DAMAGE_BONUS,
        trigger: EffectTrigger.ON_ATTACK,
        value: 0.35,
        duration: 3,
        chance: 0.25,
        description: '攻击时25%概率触发冰冻（额外35%伤害，并降低敌人攻速15%持续3秒）'
      }
    ],
    setBonus: {
      requiredPieces: 2,
      description: '2件套：攻击+5%',
      effect: {
        id: 'wisdom_set_2',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.05,
        chance: 1,
        description: '攻击+5%'
      }
    }
  },
  'myth_equip_6_6': {
    id: 'myth_equip_6_6',
    name: '密米尔智慧碎片',
    slot: EquipmentSlot.ACCESSORY,
    rarity: ItemRarity.UNCOMMON,
    level: 6,
    stationId: 'myth_station_6',
    stationNumber: 6,
    description: '概率解锁谜题答案',
    stats: { hit: 14, crit: 0.06 },
    effects: [
      {
        id: 'wisdom_acc_crit_dmg',
        type: EffectType.BOOST_CRIT,
        trigger: EffectTrigger.PASSIVE,
        value: 0.15,
        chance: 1,
        description: '暴击伤害+15%'
      }
    ],
    setBonus: {
      requiredPieces: 2,
      description: '2件套：攻击+5%',
      effect: {
        id: 'wisdom_set_2',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.05,
        chance: 1,
        description: '攻击+5%'
      }
    }
  },

  // ==================== 站台7：深渊赫尔驿站（精良品质）====================
  'myth_equip_7_1': {
    id: 'myth_equip_7_1',
    name: '冥界幽影头盔',
    slot: EquipmentSlot.HEAD,
    rarity: ItemRarity.UNCOMMON,
    level: 7,
    stationId: 'myth_station_7',
    stationNumber: 7,
    description: '隐藏自身气息，抵御黑暗伤害',
    stats: { defense: 15, hp: 110 },
    effects: [
      {
        id: 'hel_helmet_dmg_reduce_shield',
        type: EffectType.REDUCE_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '受到的伤害-10%，生命低于30%时获得300护盾（每场战斗触发1次）'
      }
    ],
    setBonus: {
      requiredPieces: 2,
      description: '2件套：攻击+5%',
      effect: {
        id: 'hel_set_2',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.05,
        chance: 1,
        description: '攻击+5%'
      }
    }
  },
  'myth_equip_7_2': {
    id: 'myth_equip_7_2',
    name: '幽影冥界铠甲',
    slot: EquipmentSlot.BODY,
    rarity: ItemRarity.UNCOMMON,
    level: 7,
    stationId: 'myth_station_7',
    stationNumber: 7,
    description: '吸收冥界神力，震慑低级灵魂怪物',
    stats: { defense: 18, hp: 130 },
    effects: [
      {
        id: 'hel_armor_heal_reflect',
        type: EffectType.HEAL_PERCENT,
        trigger: EffectTrigger.PASSIVE,
        value: 0.025,
        chance: 1,
        description: '生命恢复+每秒2.5%，受到的伤害反弹8%'
      }
    ],
    setBonus: {
      requiredPieces: 2,
      description: '2件套：攻击+5%',
      effect: {
        id: 'hel_set_2',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.05,
        chance: 1,
        description: '攻击+5%'
      }
    }
  },
  'myth_equip_7_3': {
    id: 'myth_equip_7_3',
    name: '深渊护裤',
    slot: EquipmentSlot.LEGS,
    rarity: ItemRarity.UNCOMMON,
    level: 7,
    stationId: 'myth_station_7',
    stationNumber: 7,
    description: '防止深渊黑雾侵蚀',
    stats: { defense: 12, dodge: 13 },
    effects: [
      {
        id: 'hel_legs_dodge_heal',
        type: EffectType.BOOST_DODGE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.07,
        chance: 1,
        description: '闪避率+7%，闪避时恢复25生命'
      }
    ],
    setBonus: {
      requiredPieces: 2,
      description: '2件套：攻击+5%',
      effect: {
        id: 'hel_set_2',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.05,
        chance: 1,
        description: '攻击+5%'
      }
    }
  },
  'myth_equip_7_4': {
    id: 'myth_equip_7_4',
    name: '深渊踏靴',
    slot: EquipmentSlot.FEET,
    rarity: ItemRarity.UNCOMMON,
    level: 7,
    stationId: 'myth_station_7',
    stationNumber: 7,
    description: '可在深渊边缘稳定移动',
    stats: { dodge: 14, speed: 0.16 },
    effects: [
      {
        id: 'hel_boots_speed',
        type: EffectType.BOOST_SPEED,
        trigger: EffectTrigger.PASSIVE,
        value: 0.09,
        chance: 1,
        description: '攻速+9%'
      }
    ],
    setBonus: {
      requiredPieces: 2,
      description: '2件套：攻击+5%',
      effect: {
        id: 'hel_set_2',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.05,
        chance: 1,
        description: '攻击+5%'
      }
    }
  },
  'myth_equip_7_5': {
    id: 'myth_equip_7_5',
    name: '冥界灵魂刃',
    slot: EquipmentSlot.WEAPON,
    rarity: ItemRarity.UNCOMMON,
    level: 7,
    stationId: 'myth_station_7',
    stationNumber: 7,
    description: '附带灵魂伤害，可穿透灵魂防御',
    stats: { attack: 35, penetration: 0.10 },
    effects: [
      {
        id: 'hel_weapon_soul',
        type: EffectType.DAMAGE_BONUS,
        trigger: EffectTrigger.ON_ATTACK,
        value: 0.50,
        chance: 0.30,
        description: '攻击时30%概率触发灵魂伤害（额外50%攻击力伤害，无视30%防御）'
      }
    ],
    setBonus: {
      requiredPieces: 2,
      description: '2件套：攻击+5%',
      effect: {
        id: 'hel_set_2',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.05,
        chance: 1,
        description: '攻击+5%'
      }
    }
  },
  'myth_equip_7_6': {
    id: 'myth_equip_7_6',
    name: '赫尔之核碎片',
    slot: EquipmentSlot.ACCESSORY,
    rarity: ItemRarity.UNCOMMON,
    level: 7,
    stationId: 'myth_station_7',
    stationNumber: 7,
    description: '概率免疫灵魂伤害',
    stats: { hit: 16, crit: 0.07 },
    effects: [
      {
        id: 'hel_acc_pen_true',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.05,
        chance: 1,
        description: '穿透率+5%，真实伤害+5%'
      }
    ],
    setBonus: {
      requiredPieces: 2,
      description: '2件套：攻击+5%',
      effect: {
        id: 'hel_set_2',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.05,
        chance: 1,
        description: '攻击+5%'
      }
    }
  },

  // ==================== 站台8：无神之境枢纽（精良品质）====================
  'myth_equip_8_1': {
    id: 'myth_equip_8_1',
    name: '无神战盔',
    slot: EquipmentSlot.HEAD,
    rarity: ItemRarity.UNCOMMON,
    level: 8,
    stationId: 'myth_station_8',
    stationNumber: 8,
    description: '抵御各类神力伤害',
    stats: { defense: 18, hp: 130 },
    effects: [
      {
        id: 'godless_helmet_dmg_reduce',
        type: EffectType.REDUCE_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.12,
        chance: 1,
        description: '受到的伤害-12%，全属性抗性+10%'
      }
    ],
    setBonus: {
      requiredPieces: 2,
      description: '2件套：攻击+5%',
      effect: {
        id: 'godless_set_2',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.05,
        chance: 1,
        description: '攻击+5%'
      }
    }
  },
  'myth_equip_8_2': {
    id: 'myth_equip_8_2',
    name: '混沌神纹铠甲',
    slot: EquipmentSlot.BODY,
    rarity: ItemRarity.UNCOMMON,
    level: 8,
    stationId: 'myth_station_8',
    stationNumber: 8,
    description: '吸收希腊、北欧诸神残留神力',
    stats: { defense: 22, hp: 160 },
    effects: [
      {
        id: 'godless_armor_atk_heal_reflect',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '攻击+10%，生命恢复+每秒3%，受到的伤害反弹10%'
      }
    ],
    setBonus: {
      requiredPieces: 2,
      description: '2件套：攻击+5%',
      effect: {
        id: 'godless_set_2',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.05,
        chance: 1,
        description: '攻击+5%'
      }
    }
  },
  'myth_equip_8_3': {
    id: 'myth_equip_8_3',
    name: '枢纽护裤',
    slot: EquipmentSlot.LEGS,
    rarity: ItemRarity.UNCOMMON,
    level: 8,
    stationId: 'myth_station_8',
    stationNumber: 8,
    description: '免疫空间扭曲、能量冲击等debuff',
    stats: { defense: 15, dodge: 15 },
    effects: [
      {
        id: 'godless_legs_dodge_heal',
        type: EffectType.BOOST_DODGE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.08,
        chance: 1,
        description: '闪避率+8%，闪避时恢复30生命'
      }
    ],
    setBonus: {
      requiredPieces: 2,
      description: '2件套：攻击+5%',
      effect: {
        id: 'godless_set_2',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.05,
        chance: 1,
        description: '攻击+5%'
      }
    }
  },
  'myth_equip_8_4': {
    id: 'myth_equip_8_4',
    name: '枢纽战靴',
    slot: EquipmentSlot.FEET,
    rarity: ItemRarity.UNCOMMON,
    level: 8,
    stationId: 'myth_station_8',
    stationNumber: 8,
    description: '可在能量乱流中稳定移动',
    stats: { dodge: 16, speed: 0.18 },
    effects: [
      {
        id: 'godless_boots_speed_reduce',
        type: EffectType.BOOST_SPEED,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '攻速+10%，攻击时15%概率随机降低敌人一项属性10%（持续5秒）'
      }
    ],
    setBonus: {
      requiredPieces: 2,
      description: '2件套：攻击+5%',
      effect: {
        id: 'godless_set_2',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.05,
        chance: 1,
        description: '攻击+5%'
      }
    }
  },
  'myth_equip_8_5': {
    id: 'myth_equip_8_5',
    name: '混沌双刃',
    slot: EquipmentSlot.WEAPON,
    rarity: ItemRarity.UNCOMMON,
    level: 8,
    stationId: 'myth_station_8',
    stationNumber: 8,
    description: '附带混沌伤害，可触发范围能量冲击',
    stats: { attack: 42, penetration: 0.12 },
    effects: [
      {
        id: 'godless_weapon_chaos',
        type: EffectType.DAMAGE_BONUS,
        trigger: EffectTrigger.ON_ATTACK,
        value: 0.60,
        chance: 0.35,
        description: '攻击时35%概率触发混沌（额外60%攻击力伤害，可溅射35%）'
      }
    ],
    setBonus: {
      requiredPieces: 2,
      description: '2件套：攻击+5%',
      effect: {
        id: 'godless_set_2',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.05,
        chance: 1,
        description: '攻击+5%'
      }
    }
  },
  'myth_equip_8_6': {
    id: 'myth_equip_8_6',
    name: '无神之心碎片',
    slot: EquipmentSlot.ACCESSORY,
    rarity: ItemRarity.UNCOMMON,
    level: 8,
    stationId: 'myth_station_8',
    stationNumber: 8,
    description: '概率免疫诸神神力干扰',
    stats: { hit: 18, crit: 0.08 },
    effects: [
      {
        id: 'godless_acc_low_hp',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.ON_HP_LOW,
        value: 0.15,
        chance: 1,
        condition: { type: 'hp_below', value: 0.40 },
        description: '生命低于40%时，攻击+15%，防御+15%'
      }
    ],
    setBonus: {
      requiredPieces: 2,
      description: '2件套：攻击+5%',
      effect: {
        id: 'godless_set_2',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.05,
        chance: 1,
        description: '攻击+5%'
      }
    }
  },
};

// 获取装备模板
export function getEquipmentTemplate(equipmentId: string): MythologyEquipment | undefined {
  return MYTHOLOGY_EQUIPMENT[equipmentId];
}

// 根据站台获取装备列表
export function getEquipmentByStation(stationNumber: number): MythologyEquipment[] {
  return Object.values(MYTHOLOGY_EQUIPMENT).filter(
    equip => equip.stationNumber === stationNumber
  );
}

// 根据部位获取装备列表
export function getEquipmentBySlot(slot: EquipmentSlot): MythologyEquipment[] {
  return Object.values(MYTHOLOGY_EQUIPMENT).filter(
    equip => equip.slot === slot
  );
}

// 创建装备实例
export function createEquipmentInstance(
  equipmentId: string,
  quantity: number = 1
): (MythologyEquipment & { instanceId: string; quantity: number; equipped: boolean; enhanceLevel: number; sublimationLevel: number }) | null {
  const template = getEquipmentTemplate(equipmentId);
  if (!template) return null;

  return {
    ...template,
    instanceId: `${equipmentId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    quantity,
    equipped: false,
    enhanceLevel: 0,
    sublimationLevel: 0,
  };
}

// 获取套装效果
export function getSetBonus(equipmentList: MythologyEquipment[]): Map<number, number> {
  const setCounts = new Map<number, number>();
  
  equipmentList.forEach(equip => {
    const count = setCounts.get(equip.stationNumber) || 0;
    setCounts.set(equip.stationNumber, count + 1);
  });
  
  return setCounts;
}
