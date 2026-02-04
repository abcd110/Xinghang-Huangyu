// 神话站台专属装备数据 - 站台9-16（进阶期-熟练期）
// 基于《装备数值设定_膨胀版_自动战斗版》

import { ItemRarity } from './types';
import {
  EquipmentSlot,
  EffectTrigger,
  EffectType,
  type MythologyEquipment,
} from './equipmentTypes';

// 站台9-16装备（进阶期-熟练期）
export const MYTHOLOGY_EQUIPMENT: Record<string, MythologyEquipment> = {
  // ==================== 站台9：风暴波塞冬站（稀有品质）====================
  'myth_equip_9_1': {
    id: 'myth_equip_9_1',
    name: '海神风暴头盔',
    slot: EquipmentSlot.HEAD,
    rarity: ItemRarity.RARE,
    level: 9,
    stationId: 'myth_station_9',
    stationNumber: 9,
    description: '七彩水晶材质，抵御雷电伤害',
    stats: { defense: 25, hp: 180 },
    effects: [
      {
        id: 'poseidon_helmet_dmg_reduce',
        type: EffectType.REDUCE_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.15,
        chance: 1,
        description: '受到的伤害-15%'
      },
      {
        id: 'poseidon_helmet_reduce_hit',
        type: EffectType.REDUCE_HIT,
        trigger: EffectTrigger.ON_DEFEND,
        value: 20,
        duration: 4,
        chance: 0.15,
        description: '被攻击时15%概率降低敌人命中20（持续4秒）'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'poseidon_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_9_2': {
    id: 'myth_equip_9_2',
    name: '波塞冬鳞甲',
    slot: EquipmentSlot.BODY,
    rarity: ItemRarity.RARE,
    level: 9,
    stationId: 'myth_station_9',
    stationNumber: 9,
    description: '吸收海神神力',
    stats: { defense: 30, hp: 220 },
    effects: [
      {
        id: 'poseidon_armor_atk_heal',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.12,
        chance: 1,
        description: '攻击+12%，生命恢复+每秒3%'
      },
      {
        id: 'poseidon_armor_shield',
        type: EffectType.SHIELD_GAIN,
        trigger: EffectTrigger.ON_BATTLE_START,
        value: 400,
        duration: 30,
        chance: 1,
        description: '战斗开始时获得400护盾'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'poseidon_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_9_3': {
    id: 'myth_equip_9_3',
    name: '风暴护裤',
    slot: EquipmentSlot.LEGS,
    rarity: ItemRarity.RARE,
    level: 9,
    stationId: 'myth_station_9',
    stationNumber: 9,
    description: '防止风暴撕裂',
    stats: { defense: 20, dodge: 18 },
    effects: [
      {
        id: 'poseidon_legs_dodge_heal',
        type: EffectType.BOOST_DODGE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '闪避率+10%，闪避时恢复40生命'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'poseidon_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_9_4': {
    id: 'myth_equip_9_4',
    name: '海神踏靴',
    slot: EquipmentSlot.FEET,
    rarity: ItemRarity.RARE,
    level: 9,
    stationId: 'myth_station_9',
    stationNumber: 9,
    description: '可在海浪中稳定移动',
    stats: { dodge: 19, speed: 0.20 },
    effects: [
      {
        id: 'poseidon_boots_speed_slow',
        type: EffectType.BOOST_SPEED,
        trigger: EffectTrigger.PASSIVE,
        value: 0.12,
        chance: 1,
        description: '攻速+12%'
      },
      {
        id: 'poseidon_boots_reduce_speed',
        type: EffectType.REDUCE_SPEED,
        trigger: EffectTrigger.ON_ATTACK,
        value: 0.12,
        duration: 4,
        chance: 0.20,
        description: '攻击时20%概率降低敌人攻速12%（持续4秒）'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'poseidon_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_9_5': {
    id: 'myth_equip_9_5',
    name: '风暴三叉戟',
    slot: EquipmentSlot.WEAPON,
    rarity: ItemRarity.RARE,
    level: 9,
    stationId: 'myth_station_9',
    stationNumber: 9,
    description: '附带风暴伤害，可触发范围雷击',
    stats: { attack: 55, penetration: 0.15 },
    effects: [
      {
        id: 'poseidon_weapon_storm',
        type: EffectType.DAMAGE_BONUS,
        trigger: EffectTrigger.ON_ATTACK,
        value: 0.70,
        chance: 0.40,
        description: '攻击时40%概率触发风暴（额外70%攻击力伤害，可溅射40%）'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'poseidon_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_9_6': {
    id: 'myth_equip_9_6',
    name: '波塞冬之鳞',
    slot: EquipmentSlot.ACCESSORY,
    rarity: ItemRarity.RARE,
    level: 9,
    stationId: 'myth_station_9',
    stationNumber: 9,
    description: '海神神力残留',
    stats: { hit: 22, crit: 0.10 },
    effects: [
      {
        id: 'poseidon_acc_true_dmg',
        type: EffectType.DAMAGE_TRUE,
        trigger: EffectTrigger.ON_CRIT,
        value: 0.25,
        chance: 0.40,
        description: '暴击时40%概率额外造成25%真实伤害'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'poseidon_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },

  // ==================== 站台10：荆棘赫拉站（稀有品质）====================
  'myth_equip_10_1': {
    id: 'myth_equip_10_1',
    name: '赫拉荆棘冠',
    slot: EquipmentSlot.HEAD,
    rarity: ItemRarity.RARE,
    level: 10,
    stationId: 'myth_station_10',
    stationNumber: 10,
    description: '抵御荆棘伤害',
    stats: { defense: 28, hp: 200 },
    effects: [
      {
        id: 'hera_helmet_dmg_reflect',
        type: EffectType.REDUCE_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.15,
        chance: 1,
        description: '受到的伤害-15%'
      },
      {
        id: 'hera_helmet_reflect',
        type: EffectType.REFLECT_DAMAGE,
        trigger: EffectTrigger.ON_DEFEND,
        value: 0.12,
        chance: 1,
        description: '被攻击时反弹12%伤害'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'hera_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_10_2': {
    id: 'myth_equip_10_2',
    name: '荆棘天后铠甲',
    slot: EquipmentSlot.BODY,
    rarity: ItemRarity.RARE,
    level: 10,
    stationId: 'myth_station_10',
    stationNumber: 10,
    description: '吸收天后神力',
    stats: { defense: 33, hp: 240 },
    effects: [
      {
        id: 'hera_armor_def_heal',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.12,
        chance: 1,
        description: '防御+12%，生命恢复+每秒3.5%'
      },
      {
        id: 'hera_armor_low_hp',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.ON_HP_LOW,
        value: 0.20,
        chance: 1,
        condition: { type: 'hp_below', value: 0.40 },
        description: '生命低于40%时防御+20%'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'hera_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_10_3': {
    id: 'myth_equip_10_3',
    name: '荆棘护裤',
    slot: EquipmentSlot.LEGS,
    rarity: ItemRarity.RARE,
    level: 10,
    stationId: 'myth_station_10',
    stationNumber: 10,
    description: '防止荆棘缠绕',
    stats: { defense: 22, dodge: 20 },
    effects: [
      {
        id: 'hera_legs_dodge_heal',
        type: EffectType.BOOST_DODGE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.11,
        chance: 1,
        description: '闪避率+11%，闪避时恢复45生命并反弹15伤害'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'hera_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_10_4': {
    id: 'myth_equip_10_4',
    name: '荆棘踏靴',
    slot: EquipmentSlot.FEET,
    rarity: ItemRarity.RARE,
    level: 10,
    stationId: 'myth_station_10',
    stationNumber: 10,
    description: '免疫地面荆棘陷阱',
    stats: { dodge: 21, speed: 0.22 },
    effects: [
      {
        id: 'hera_boots_speed_poison',
        type: EffectType.BOOST_SPEED,
        trigger: EffectTrigger.PASSIVE,
        value: 0.13,
        chance: 1,
        description: '攻速+13%'
      },
      {
        id: 'hera_boots_poison',
        type: EffectType.DAMAGE_BONUS,
        trigger: EffectTrigger.ON_ATTACK,
        value: 0.05,
        duration: 6,
        chance: 0.20,
        description: '攻击时20%概率附加中毒（每秒5%攻击力伤害，持续6秒）'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'hera_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_10_5': {
    id: 'myth_equip_10_5',
    name: '荆棘长剑',
    slot: EquipmentSlot.WEAPON,
    rarity: ItemRarity.RARE,
    level: 10,
    stationId: 'myth_station_10',
    stationNumber: 10,
    description: '附带荆棘伤害',
    stats: { attack: 62, penetration: 0.17 },
    effects: [
      {
        id: 'hera_weapon_thorns',
        type: EffectType.DAMAGE_BONUS,
        trigger: EffectTrigger.ON_ATTACK,
        value: 0.80,
        duration: 5,
        chance: 0.40,
        description: '攻击时40%概率触发荆棘（额外80%攻击力伤害，并降低敌人防御20%持续5秒）'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'hera_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_10_6': {
    id: 'myth_equip_10_6',
    name: '赫拉之冠碎片',
    slot: EquipmentSlot.ACCESSORY,
    rarity: ItemRarity.RARE,
    level: 10,
    stationId: 'myth_station_10',
    stationNumber: 10,
    description: '天后神力残留',
    stats: { hit: 24, crit: 0.11 },
    effects: [
      {
        id: 'hera_acc_crit_dmg',
        type: EffectType.BOOST_CRIT,
        trigger: EffectTrigger.PASSIVE,
        value: 0.25,
        chance: 1,
        description: '暴击伤害+25%'
      },
      {
        id: 'hera_acc_low_hp',
        type: EffectType.BOOST_CRIT,
        trigger: EffectTrigger.ON_HP_LOW,
        value: 0.15,
        chance: 1,
        condition: { type: 'hp_below', value: 0.50 },
        description: '生命低于50%时暴击率+15%'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'hera_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },

  // ==================== 站台11：利刃雅典娜站（稀有品质）====================
  'myth_equip_11_1': {
    id: 'myth_equip_11_1',
    name: '智慧利刃头盔',
    slot: EquipmentSlot.HEAD,
    rarity: ItemRarity.RARE,
    level: 11,
    stationId: 'myth_station_11',
    stationNumber: 11,
    description: '抵御智慧试炼伤害',
    stats: { defense: 32, hp: 230, hit: 8 },
    effects: [
      {
        id: 'athena_helmet_dmg_reduce',
        type: EffectType.REDUCE_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.15,
        chance: 1,
        description: '受到的伤害-15%'
      },
      {
        id: 'athena_helmet_reduce_hit',
        type: EffectType.REDUCE_HIT,
        trigger: EffectTrigger.ON_DEFEND,
        value: 15,
        duration: 4,
        chance: 1,
        description: '被攻击时降低敌人命中15（持续4秒）'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'athena_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_11_2': {
    id: 'myth_equip_11_2',
    name: '雅典娜银甲',
    slot: EquipmentSlot.BODY,
    rarity: ItemRarity.RARE,
    level: 11,
    stationId: 'myth_station_11',
    stationNumber: 11,
    description: '吸收智慧神力',
    stats: { defense: 38, hp: 270 },
    effects: [
      {
        id: 'athena_armor_atk_heal',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.15,
        chance: 1,
        description: '攻击+15%，生命恢复+每秒4%'
      },
      {
        id: 'athena_armor_shield',
        type: EffectType.SHIELD_GAIN,
        trigger: EffectTrigger.ON_BATTLE_START,
        value: 500,
        duration: 30,
        chance: 1,
        description: '战斗开始时获得500护盾'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'athena_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_11_3': {
    id: 'myth_equip_11_3',
    name: '利刃护裤',
    slot: EquipmentSlot.LEGS,
    rarity: ItemRarity.RARE,
    level: 11,
    stationId: 'myth_station_11',
    stationNumber: 11,
    description: '防止利刃切割',
    stats: { defense: 25, dodge: 22 },
    effects: [
      {
        id: 'athena_legs_dodge_heal',
        type: EffectType.BOOST_DODGE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.12,
        chance: 1,
        description: '闪避率+12%，闪避时恢复50生命'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'athena_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_11_4': {
    id: 'myth_equip_11_4',
    name: '智慧踏靴',
    slot: EquipmentSlot.FEET,
    rarity: ItemRarity.RARE,
    level: 11,
    stationId: 'myth_station_11',
    stationNumber: 11,
    description: '免疫智慧陷阱',
    stats: { dodge: 23, speed: 0.24 },
    effects: [
      {
        id: 'athena_boots_speed_ignore',
        type: EffectType.BOOST_SPEED,
        trigger: EffectTrigger.PASSIVE,
        value: 0.14,
        chance: 1,
        description: '攻速+14%'
      },
      {
        id: 'athena_boots_ignore_def',
        type: EffectType.IGNORE_DEFENSE,
        trigger: EffectTrigger.ON_ATTACK,
        value: 0.20,
        chance: 0.25,
        description: '攻击时25%概率无视敌人20%防御'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'athena_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_11_5': {
    id: 'myth_equip_11_5',
    name: '雅典娜之盾+智慧利刃',
    slot: EquipmentSlot.WEAPON,
    rarity: ItemRarity.RARE,
    level: 11,
    stationId: 'myth_station_11',
    stationNumber: 11,
    description: '附带智慧伤害，可格挡攻击',
    stats: { attack: 70, penetration: 0.19 },
    effects: [
      {
        id: 'athena_weapon_pierce',
        type: EffectType.DAMAGE_BONUS,
        trigger: EffectTrigger.ON_ATTACK,
        value: 0.90,
        chance: 0.45,
        description: '攻击时45%概率触发穿刺（额外90%攻击力伤害，穿透+10%）'
      },
      {
        id: 'athena_weapon_block',
        type: EffectType.REDUCE_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.15,
        chance: 1,
        description: '格挡15%伤害'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'athena_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_11_6': {
    id: 'myth_equip_11_6',
    name: '雅典娜智慧碎片',
    slot: EquipmentSlot.ACCESSORY,
    rarity: ItemRarity.RARE,
    level: 11,
    stationId: 'myth_station_11',
    stationNumber: 11,
    description: '智慧女神神力残留',
    stats: { hit: 26, crit: 0.12 },
    effects: [
      {
        id: 'athena_acc_pen_true',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.08,
        chance: 1,
        description: '穿透率+8%，真实伤害+8%'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'athena_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },

  // ==================== 站台12：血刃阿瑞斯站（稀有品质）====================
  'myth_equip_12_1': {
    id: 'myth_equip_12_1',
    name: '战神血刃头盔',
    slot: EquipmentSlot.HEAD,
    rarity: ItemRarity.RARE,
    level: 12,
    stationId: 'myth_station_12',
    stationNumber: 12,
    description: '抵御血刃伤害',
    stats: { defense: 36, hp: 260 },
    effects: [
      {
        id: 'ares_helmet_dmg_reduce',
        type: EffectType.REDUCE_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.18,
        chance: 1,
        description: '受到的伤害-18%'
      },
      {
        id: 'ares_helmet_low_hp',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.ON_HP_LOW,
        value: 0.20,
        chance: 1,
        condition: { type: 'hp_below', value: 0.35 },
        description: '生命低于35%时攻击+20%'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'ares_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_12_2': {
    id: 'myth_equip_12_2',
    name: '血刃战神铠甲',
    slot: EquipmentSlot.BODY,
    rarity: ItemRarity.RARE,
    level: 12,
    stationId: 'myth_station_12',
    stationNumber: 12,
    description: '吸收战神神力',
    stats: { defense: 42, hp: 300 },
    effects: [
      {
        id: 'ares_armor_atk_heal',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.18,
        chance: 1,
        description: '攻击+18%，生命恢复+每秒4%'
      },
      {
        id: 'ares_armor_reflect',
        type: EffectType.REFLECT_DAMAGE,
        trigger: EffectTrigger.ON_DEFEND,
        value: 0.15,
        chance: 1,
        description: '受到的伤害反弹15%'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'ares_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_12_3': {
    id: 'myth_equip_12_3',
    name: '血刃护裤',
    slot: EquipmentSlot.LEGS,
    rarity: ItemRarity.RARE,
    level: 12,
    stationId: 'myth_station_12',
    stationNumber: 12,
    description: '防止血刃切割',
    stats: { defense: 28, dodge: 24 },
    effects: [
      {
        id: 'ares_legs_dodge_atk',
        type: EffectType.BOOST_DODGE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.13,
        chance: 1,
        description: '闪避率+13%，闪避时恢复55生命并攻击+5%（可叠加3层，持续10秒）'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'ares_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_12_4': {
    id: 'myth_equip_12_4',
    name: '战神踏靴',
    slot: EquipmentSlot.FEET,
    rarity: ItemRarity.RARE,
    level: 12,
    stationId: 'myth_station_12',
    stationNumber: 12,
    description: '免疫战神威压',
    stats: { dodge: 25, speed: 0.26 },
    effects: [
      {
        id: 'ares_boots_speed_life',
        type: EffectType.BOOST_SPEED,
        trigger: EffectTrigger.PASSIVE,
        value: 0.15,
        chance: 1,
        description: '攻速+15%'
      },
      {
        id: 'ares_boots_life_steal',
        type: EffectType.LIFE_STEAL,
        trigger: EffectTrigger.ON_ATTACK,
        value: 0.10,
        chance: 0.25,
        description: '攻击时25%概率吸血（伤害的10%转化为生命）'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'ares_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_12_5': {
    id: 'myth_equip_12_5',
    name: '阿瑞斯血矛',
    slot: EquipmentSlot.WEAPON,
    rarity: ItemRarity.RARE,
    level: 12,
    stationId: 'myth_station_12',
    stationNumber: 12,
    description: '附带血刃伤害',
    stats: { attack: 78, penetration: 0.21 },
    effects: [
      {
        id: 'ares_weapon_blood',
        type: EffectType.DAMAGE_BONUS,
        trigger: EffectTrigger.ON_ATTACK,
        value: 1.00,
        chance: 0.50,
        description: '攻击时50%概率触发血刃（额外100%攻击力伤害，暴击率+20%）'
      },
      {
        id: 'ares_weapon_crit_dmg',
        type: EffectType.BOOST_CRIT,
        trigger: EffectTrigger.PASSIVE,
        value: 0.30,
        chance: 1,
        description: '暴击伤害+30%'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'ares_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_12_6': {
    id: 'myth_equip_12_6',
    name: '阿瑞斯血刃碎片',
    slot: EquipmentSlot.ACCESSORY,
    rarity: ItemRarity.RARE,
    level: 12,
    stationId: 'myth_station_12',
    stationNumber: 12,
    description: '战神神力残留',
    stats: { hit: 28, crit: 0.13 },
    effects: [
      {
        id: 'ares_acc_low_hp',
        type: EffectType.BOOST_CRIT,
        trigger: EffectTrigger.ON_HP_LOW,
        value: 0.40,
        chance: 1,
        condition: { type: 'hp_below', value: 0.40 },
        description: '生命低于40%时，暴击率+20%，暴击伤害+40%'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'ares_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },

  // ==================== 站台13：幻梦阿佛洛狄忒站（稀有品质）====================
  'myth_equip_13_1': {
    id: 'myth_equip_13_1',
    name: '幻梦爱神冠',
    slot: EquipmentSlot.HEAD,
    rarity: ItemRarity.RARE,
    level: 13,
    stationId: 'myth_station_13',
    stationNumber: 13,
    description: '抵御幻梦侵蚀',
    stats: { defense: 30, hp: 220 },
    effects: [
      {
        id: 'aphrodite_helmet_dmg_reduce',
        type: EffectType.REDUCE_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.12,
        chance: 1,
        description: '受到的伤害-12%'
      },
      {
        id: 'aphrodite_helmet_reduce_atk',
        type: EffectType.REDUCE_ATTACK,
        trigger: EffectTrigger.ON_DEFEND,
        value: 0.15,
        duration: 5,
        chance: 0.20,
        description: '被攻击时20%概率降低敌人攻击15%（持续5秒）'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'aphrodite_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_13_2': {
    id: 'myth_equip_13_2',
    name: '幻梦纹章胸甲',
    slot: EquipmentSlot.BODY,
    rarity: ItemRarity.RARE,
    level: 13,
    stationId: 'myth_station_13',
    stationNumber: 13,
    description: '吸收爱神神力',
    stats: { defense: 35, hp: 260 },
    effects: [
      {
        id: 'aphrodite_armor_def_heal',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.12,
        chance: 1,
        description: '防御+12%，生命恢复+每秒3.5%'
      },
      {
        id: 'aphrodite_armor_low_hp_shield',
        type: EffectType.SHIELD_GAIN,
        trigger: EffectTrigger.ON_HP_LOW,
        value: 600,
        chance: 1,
        condition: { type: 'hp_below', value: 0.45 },
        description: '生命低于45%时获得600护盾（每场1次）'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'aphrodite_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_13_3': {
    id: 'myth_equip_13_3',
    name: '幻梦护裤',
    slot: EquipmentSlot.LEGS,
    rarity: ItemRarity.RARE,
    level: 13,
    stationId: 'myth_station_13',
    stationNumber: 13,
    description: '防止幻梦缠绕',
    stats: { defense: 24, dodge: 23 },
    effects: [
      {
        id: 'aphrodite_legs_dodge_heal',
        type: EffectType.BOOST_DODGE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.11,
        chance: 1,
        description: '闪避率+11%，闪避时恢复45生命'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'aphrodite_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_13_4': {
    id: 'myth_equip_13_4',
    name: '幻梦踏靴',
    slot: EquipmentSlot.FEET,
    rarity: ItemRarity.RARE,
    level: 13,
    stationId: 'myth_station_13',
    stationNumber: 13,
    description: '免疫幻梦陷阱',
    stats: { dodge: 24, speed: 0.23 },
    effects: [
      {
        id: 'aphrodite_boots_speed_reduce',
        type: EffectType.BOOST_SPEED,
        trigger: EffectTrigger.PASSIVE,
        value: 0.12,
        chance: 1,
        description: '攻速+12%'
      },
      {
        id: 'aphrodite_boots_reduce_hit',
        type: EffectType.REDUCE_HIT,
        trigger: EffectTrigger.ON_ATTACK,
        value: 18,
        duration: 4,
        chance: 0.20,
        description: '攻击时20%概率降低敌人命中18（持续4秒）'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'aphrodite_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_13_5': {
    id: 'myth_equip_13_5',
    name: '幻梦玫瑰刃',
    slot: EquipmentSlot.WEAPON,
    rarity: ItemRarity.RARE,
    level: 13,
    stationId: 'myth_station_13',
    stationNumber: 13,
    description: '附带幻梦伤害',
    stats: { attack: 68, penetration: 0.18 },
    effects: [
      {
        id: 'aphrodite_weapon_charm',
        type: EffectType.DAMAGE_BONUS,
        trigger: EffectTrigger.ON_ATTACK,
        value: 0.75,
        duration: 5,
        chance: 0.40,
        description: '攻击时40%概率触发迷惑（额外75%攻击力伤害，并降低敌人攻击18%持续5秒）'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'aphrodite_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_13_6': {
    id: 'myth_equip_13_6',
    name: '阿佛洛狄忒之带碎片',
    slot: EquipmentSlot.ACCESSORY,
    rarity: ItemRarity.RARE,
    level: 13,
    stationId: 'myth_station_13',
    stationNumber: 13,
    description: '爱神神力残留',
    stats: { hit: 25, crit: 0.11 },
    effects: [
      {
        id: 'aphrodite_acc_reduce_dmg',
        type: EffectType.REDUCE_DEFENSE,
        trigger: EffectTrigger.ON_ATTACK,
        value: 0.30,
        chance: 0.15,
        description: '攻击时15%概率使敌人下次攻击伤害-30%'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'aphrodite_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },

  // ==================== 站台14：圣树奥丁站（稀有品质）====================
  'myth_equip_14_1': {
    id: 'myth_equip_14_1',
    name: '奥丁独眼罩',
    slot: EquipmentSlot.HEAD,
    rarity: ItemRarity.RARE,
    level: 14,
    stationId: 'myth_station_14',
    stationNumber: 14,
    description: '提升命中率',
    stats: { defense: 38, hp: 280, hit: 10 },
    effects: [
      {
        id: 'odin_helmet_dmg_reduce',
        type: EffectType.REDUCE_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.15,
        chance: 1,
        description: '受到的伤害-15%'
      },
      {
        id: 'odin_helmet_reduce_dodge',
        type: EffectType.REDUCE_HIT,
        trigger: EffectTrigger.ON_ATTACK,
        value: 25,
        duration: 5,
        chance: 0.25,
        description: '攻击时25%概率降低敌人闪避25（持续5秒）'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'odin_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_14_2': {
    id: 'myth_equip_14_2',
    name: '圣树神纹铠甲',
    slot: EquipmentSlot.BODY,
    rarity: ItemRarity.RARE,
    level: 14,
    stationId: 'myth_station_14',
    stationNumber: 14,
    description: '吸收奥丁神力',
    stats: { defense: 45, hp: 320 },
    effects: [
      {
        id: 'odin_armor_atk_heal',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.16,
        chance: 1,
        description: '攻击+16%，生命恢复+每秒4%'
      },
      {
        id: 'odin_armor_reflect',
        type: EffectType.REFLECT_DAMAGE,
        trigger: EffectTrigger.ON_DEFEND,
        value: 0.12,
        chance: 1,
        description: '受到的伤害反弹12%'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'odin_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_14_3': {
    id: 'myth_equip_14_3',
    name: '符文护裤',
    slot: EquipmentSlot.LEGS,
    rarity: ItemRarity.RARE,
    level: 14,
    stationId: 'myth_station_14',
    stationNumber: 14,
    description: '防止符文反噬',
    stats: { defense: 30, dodge: 25 },
    effects: [
      {
        id: 'odin_legs_dodge_heal',
        type: EffectType.BOOST_DODGE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.12,
        chance: 1,
        description: '闪避率+12%，闪避时恢复60生命并降低敌人攻速10%（持续3秒）'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'odin_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_14_4': {
    id: 'myth_equip_14_4',
    name: '奥丁踏靴',
    slot: EquipmentSlot.FEET,
    rarity: ItemRarity.RARE,
    level: 14,
    stationId: 'myth_station_14',
    stationNumber: 14,
    description: '免疫奥丁威压',
    stats: { dodge: 26, speed: 0.25 },
    effects: [
      {
        id: 'odin_boots_speed_rune',
        type: EffectType.BOOST_SPEED,
        trigger: EffectTrigger.PASSIVE,
        value: 0.14,
        chance: 1,
        description: '攻速+14%'
      },
      {
        id: 'odin_boots_rune_dmg',
        type: EffectType.DAMAGE_BONUS,
        trigger: EffectTrigger.ON_ATTACK,
        value: 0.85,
        duration: 4,
        chance: 0.25,
        description: '攻击时25%概率触发符文（额外85%攻击力伤害，降低敌人攻速15%持续4秒）'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'odin_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_14_5': {
    id: 'myth_equip_14_5',
    name: '奥丁符文矛',
    slot: EquipmentSlot.WEAPON,
    rarity: ItemRarity.RARE,
    level: 14,
    stationId: 'myth_station_14',
    stationNumber: 14,
    description: '附带符文伤害',
    stats: { attack: 75, penetration: 0.20 },
    effects: [
      {
        id: 'odin_weapon_rune',
        type: EffectType.DAMAGE_BONUS,
        trigger: EffectTrigger.ON_ATTACK,
        value: 0.95,
        chance: 0.45,
        description: '攻击时45%概率触发符文冲击（额外95%攻击力伤害，可溅射40%并降低攻速20%）'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'odin_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_14_6': {
    id: 'myth_equip_14_6',
    name: '奥丁之眼碎片',
    slot: EquipmentSlot.ACCESSORY,
    rarity: ItemRarity.RARE,
    level: 14,
    stationId: 'myth_station_14',
    stationNumber: 14,
    description: '奥丁神力残留',
    stats: { hit: 27, crit: 0.12 },
    effects: [
      {
        id: 'odin_acc_pen',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '穿透率+10%'
      },
      {
        id: 'odin_acc_ignore_def',
        type: EffectType.IGNORE_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.15,
        chance: 1,
        description: '攻击时无视敌人15%防御'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'odin_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },

  // ==================== 站台15：星光弗丽嘉站（稀有品质）====================
  'myth_equip_15_1': {
    id: 'myth_equip_15_1',
    name: '星光天后冠',
    slot: EquipmentSlot.HEAD,
    rarity: ItemRarity.RARE,
    level: 15,
    stationId: 'myth_station_15',
    stationNumber: 15,
    description: '抵御星光伤害',
    stats: { defense: 34, hp: 250 },
    effects: [
      {
        id: 'frigg_helmet_dmg_reduce',
        type: EffectType.REDUCE_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.15,
        chance: 1,
        description: '受到的伤害-15%，生命恢复+每秒3%'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'frigg_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_15_2': {
    id: 'myth_equip_15_2',
    name: '星光神纹铠甲',
    slot: EquipmentSlot.BODY,
    rarity: ItemRarity.RARE,
    level: 15,
    stationId: 'myth_station_15',
    stationNumber: 15,
    description: '吸收弗丽嘉神力',
    stats: { defense: 40, hp: 290 },
    effects: [
      {
        id: 'frigg_armor_def_heal',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.12,
        chance: 1,
        description: '防御+12%，生命恢复+每秒4%'
      },
      {
        id: 'frigg_armor_shield',
        type: EffectType.SHIELD_GAIN,
        trigger: EffectTrigger.ON_BATTLE_START,
        value: 600,
        duration: 30,
        chance: 1,
        description: '战斗开始时获得600护盾'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'frigg_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_15_3': {
    id: 'myth_equip_15_3',
    name: '星光护裤',
    slot: EquipmentSlot.LEGS,
    rarity: ItemRarity.RARE,
    level: 15,
    stationId: 'myth_station_15',
    stationNumber: 15,
    description: '防止星光缠绕',
    stats: { defense: 27, dodge: 24 },
    effects: [
      {
        id: 'frigg_legs_dodge_heal',
        type: EffectType.BOOST_DODGE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.12,
        chance: 1,
        description: '闪避率+12%，闪避时恢复50生命并恢复2%最大生命'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'frigg_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_15_4': {
    id: 'myth_equip_15_4',
    name: '星光踏靴',
    slot: EquipmentSlot.FEET,
    rarity: ItemRarity.RARE,
    level: 15,
    stationId: 'myth_station_15',
    stationNumber: 15,
    description: '免疫星光陷阱',
    stats: { dodge: 25, speed: 0.24 },
    effects: [
      {
        id: 'frigg_boots_speed_ignore',
        type: EffectType.BOOST_SPEED,
        trigger: EffectTrigger.PASSIVE,
        value: 0.13,
        chance: 1,
        description: '攻速+13%'
      },
      {
        id: 'frigg_boots_ignore_dodge',
        type: EffectType.IGNORE_DODGE,
        trigger: EffectTrigger.ON_ATTACK,
        value: 1,
        chance: 0.25,
        description: '攻击时25%概率无视敌人闪避'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'frigg_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_15_5': {
    id: 'myth_equip_15_5',
    name: '星光权杖',
    slot: EquipmentSlot.WEAPON,
    rarity: ItemRarity.RARE,
    level: 15,
    stationId: 'myth_station_15',
    stationNumber: 15,
    description: '附带星光伤害',
    stats: { attack: 72, penetration: 0.19 },
    effects: [
      {
        id: 'frigg_weapon_star',
        type: EffectType.DAMAGE_BONUS,
        trigger: EffectTrigger.ON_ATTACK,
        value: 0.90,
        chance: 0.45,
        description: '攻击时45%概率触发星光（额外90%攻击力伤害，可溅射35%，无视闪避）'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'frigg_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_15_6': {
    id: 'myth_equip_15_6',
    name: '弗丽嘉之裙碎片',
    slot: EquipmentSlot.ACCESSORY,
    rarity: ItemRarity.RARE,
    level: 15,
    stationId: 'myth_station_15',
    stationNumber: 15,
    description: '天后神力残留',
    stats: { hit: 26, crit: 0.11 },
    effects: [
      {
        id: 'frigg_acc_crit_heal',
        type: EffectType.HEAL_PERCENT,
        trigger: EffectTrigger.ON_CRIT,
        value: 0.05,
        chance: 0.50,
        description: '暴击时50%概率恢复5%最大生命'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'frigg_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },

  // ==================== 站台16：诗韵布拉基站（稀有品质）====================
  'myth_equip_16_1': {
    id: 'myth_equip_16_1',
    name: '诗韵头盔',
    slot: EquipmentSlot.HEAD,
    rarity: ItemRarity.RARE,
    level: 16,
    stationId: 'myth_station_16',
    stationNumber: 16,
    description: '抵御诗韵伤害',
    stats: { defense: 32, hp: 230 },
    effects: [
      {
        id: 'bragi_helmet_dmg_reduce',
        type: EffectType.REDUCE_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.12,
        chance: 1,
        description: '受到的伤害-12%'
      },
      {
        id: 'bragi_helmet_reduce_crit',
        type: EffectType.REDUCE_CRIT,
        trigger: EffectTrigger.ON_DEFEND,
        value: 0.10,
        duration: 5,
        chance: 0.20,
        description: '被攻击时20%概率降低敌人暴击率10%（持续5秒）'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'bragi_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_16_2': {
    id: 'myth_equip_16_2',
    name: '诗神纹章胸甲',
    slot: EquipmentSlot.BODY,
    rarity: ItemRarity.RARE,
    level: 16,
    stationId: 'myth_station_16',
    stationNumber: 16,
    description: '吸收布拉基神力',
    stats: { defense: 38, hp: 270 },
    effects: [
      {
        id: 'bragi_armor_atk_heal',
        type: EffectType.BOOST_ATTACK,
        trigger: EffectTrigger.PASSIVE,
        value: 0.14,
        chance: 1,
        description: '攻击+14%，生命恢复+每秒3.5%'
      },
      {
        id: 'bragi_armor_reflect',
        type: EffectType.REFLECT_DAMAGE,
        trigger: EffectTrigger.ON_DEFEND,
        value: 0.10,
        chance: 1,
        description: '受到的伤害反弹10%'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'bragi_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_16_3': {
    id: 'myth_equip_16_3',
    name: '诗韵护裤',
    slot: EquipmentSlot.LEGS,
    rarity: ItemRarity.RARE,
    level: 16,
    stationId: 'myth_station_16',
    stationNumber: 16,
    description: '防止诗韵缠绕',
    stats: { defense: 25, dodge: 23 },
    effects: [
      {
        id: 'bragi_legs_dodge_heal',
        type: EffectType.BOOST_DODGE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.11,
        chance: 1,
        description: '闪避率+11%，闪避时恢复45生命并降低敌人命中15（持续4秒）'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'bragi_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_16_4': {
    id: 'myth_equip_16_4',
    name: '诗韵踏靴',
    slot: EquipmentSlot.FEET,
    rarity: ItemRarity.RARE,
    level: 16,
    stationId: 'myth_station_16',
    stationNumber: 16,
    description: '免疫诗韵陷阱',
    stats: { dodge: 24, speed: 0.23 },
    effects: [
      {
        id: 'bragi_boots_speed_slow',
        type: EffectType.BOOST_SPEED,
        trigger: EffectTrigger.PASSIVE,
        value: 0.12,
        chance: 1,
        description: '攻速+12%'
      },
      {
        id: 'bragi_boots_reduce_speed',
        type: EffectType.REDUCE_SPEED,
        trigger: EffectTrigger.ON_ATTACK,
        value: 0.12,
        duration: 4,
        chance: 0.20,
        description: '攻击时20%概率降低敌人攻速12%（持续4秒）'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'bragi_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_16_5': {
    id: 'myth_equip_16_5',
    name: '诗韵羽笔刃',
    slot: EquipmentSlot.WEAPON,
    rarity: ItemRarity.RARE,
    level: 16,
    stationId: 'myth_station_16',
    stationNumber: 16,
    description: '附带诗韵伤害',
    stats: { attack: 68, penetration: 0.18 },
    effects: [
      {
        id: 'bragi_weapon_poem',
        type: EffectType.DAMAGE_BONUS,
        trigger: EffectTrigger.ON_ATTACK,
        value: 0.80,
        duration: 5,
        chance: 0.40,
        description: '攻击时40%概率触发诗韵（额外80%攻击力伤害，降低敌人命中20%持续5秒）'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'bragi_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
  'myth_equip_16_6': {
    id: 'myth_equip_16_6',
    name: '布拉基之笔碎片',
    slot: EquipmentSlot.ACCESSORY,
    rarity: ItemRarity.RARE,
    level: 16,
    stationId: 'myth_station_16',
    stationNumber: 16,
    description: '诗神神力残留',
    stats: { hit: 25, crit: 0.11 },
    effects: [
      {
        id: 'bragi_acc_miss',
        type: EffectType.REDUCE_HIT,
        trigger: EffectTrigger.ON_ATTACK,
        value: 100,
        chance: 0.20,
        description: '攻击时20%概率使敌人下次攻击落空'
      }
    ],
    setBonus: {
      requiredPieces: 3,
      description: '3件套：防御+10%',
      effect: {
        id: 'bragi_set_3',
        type: EffectType.BOOST_DEFENSE,
        trigger: EffectTrigger.PASSIVE,
        value: 0.10,
        chance: 1,
        description: '防御+10%'
      }
    }
  },
};

export default MYTHOLOGY_EQUIPMENT;
