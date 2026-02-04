// 神话站台专属装备数据 - 站台17-24（精英期-大师期）
// 基于《装备数值设定_膨胀版_自动战斗版》

import { ItemRarity } from './types';
import {
  EquipmentSlot,
  EffectTrigger,
  EffectType,
  type MythologyEquipment,
} from './equipmentTypes';

// 站台17-24装备（精英期-大师期）
export const MYTHOLOGY_EQUIPMENT: Record<string, MythologyEquipment> = {
  // ==================== 站台17：战刃提尔站（史诗品质）====================
  'myth_equip_17_1': {
    id: 'myth_equip_17_1',
    name: '提尔战盔',
    slot: EquipmentSlot.HEAD,
    rarity: ItemRarity.EPIC,
    level: 17,
    stationId: 'myth_station_17',
    stationNumber: 17,
    description: '抵御战刃伤害',
    stats: { defense: 48, hp: 350 },
    effects: [
      { id: 'tyr_helmet_dmg', type: EffectType.REDUCE_DEFENSE, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '受到的伤害-20%' },
      { id: 'tyr_helmet_reflect', type: EffectType.REFLECT_DAMAGE, trigger: EffectTrigger.ON_DEFEND, value: 0.18, chance: 1, description: '被攻击时反弹18%伤害' },
      { id: 'tyr_helmet_low', type: EffectType.BOOST_DEFENSE, trigger: EffectTrigger.ON_HP_LOW, value: 0.25, chance: 1, condition: { type: 'hp_below', value: 0.35 }, description: '生命低于35%时防御+25%' }
    ],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'tyr_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_17_2': {
    id: 'myth_equip_17_2',
    name: '战刃战神铠甲',
    slot: EquipmentSlot.BODY,
    rarity: ItemRarity.EPIC,
    level: 17,
    stationId: 'myth_station_17',
    stationNumber: 17,
    description: '吸收提尔神力',
    stats: { defense: 55, hp: 400 },
    effects: [
      { id: 'tyr_armor_atk', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.22, chance: 1, description: '攻击+22%，生命恢复+每秒5%' },
      { id: 'tyr_armor_shield', type: EffectType.SHIELD_GAIN, trigger: EffectTrigger.ON_BATTLE_START, value: 800, duration: 30, chance: 1, description: '战斗开始时获得800护盾' }
    ],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'tyr_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_17_3': {
    id: 'myth_equip_17_3',
    name: '战刃护裤',
    slot: EquipmentSlot.LEGS,
    rarity: ItemRarity.EPIC,
    level: 17,
    stationId: 'myth_station_17',
    stationNumber: 17,
    description: '防止战刃切割',
    stats: { defense: 38, dodge: 30 },
    effects: [{ id: 'tyr_legs_dodge', type: EffectType.BOOST_DODGE, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '闪避率+15%，闪避时恢复80生命并攻击+8%（可叠加3层）' }],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'tyr_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_17_4': {
    id: 'myth_equip_17_4',
    name: '提尔踏靴',
    slot: EquipmentSlot.FEET,
    rarity: ItemRarity.EPIC,
    level: 17,
    stationId: 'myth_station_17',
    stationNumber: 17,
    description: '免疫提尔威压',
    stats: { dodge: 32, speed: 0.30 },
    effects: [
      { id: 'tyr_boots_speed', type: EffectType.BOOST_SPEED, trigger: EffectTrigger.PASSIVE, value: 0.18, chance: 1, description: '攻速+18%' },
      { id: 'tyr_boots_reduce_def', type: EffectType.REDUCE_DEFENSE, trigger: EffectTrigger.ON_ATTACK, value: 0.25, duration: 6, chance: 0.30, description: '攻击时30%概率降低敌人防御25%（持续6秒）' }
    ],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'tyr_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_17_5': {
    id: 'myth_equip_17_5',
    name: '提尔战刃',
    slot: EquipmentSlot.WEAPON,
    rarity: ItemRarity.EPIC,
    level: 17,
    stationId: 'myth_station_17',
    stationNumber: 17,
    description: '附带战刃伤害',
    stats: { attack: 95, penetration: 0.25 },
    effects: [
      { id: 'tyr_weapon_blade', type: EffectType.DAMAGE_BONUS, trigger: EffectTrigger.ON_ATTACK, value: 1.30, chance: 0.55, description: '攻击时55%概率触发战刃（额外130%攻击力伤害，可溅射50%）' },
      { id: 'tyr_weapon_crit', type: EffectType.BOOST_CRIT, trigger: EffectTrigger.PASSIVE, value: 0.40, chance: 1, description: '暴击伤害+40%' }
    ],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'tyr_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_17_6': {
    id: 'myth_equip_17_6',
    name: '提尔之臂碎片',
    slot: EquipmentSlot.ACCESSORY,
    rarity: ItemRarity.EPIC,
    level: 17,
    stationId: 'myth_station_17',
    stationNumber: 17,
    description: '战神神力残留',
    stats: { hit: 32, crit: 0.15 },
    effects: [{ id: 'tyr_acc_low', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.ON_HP_LOW, value: 0.25, chance: 1, condition: { type: 'hp_below', value: 0.40 }, description: '生命低于40%时，攻击+25%，穿透率+15%' }],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'tyr_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },

  // ==================== 站台18：光明巴尔德尔站（史诗品质）====================
  'myth_equip_18_1': {
    id: 'myth_equip_18_1',
    name: '光明神冠',
    slot: EquipmentSlot.HEAD,
    rarity: ItemRarity.EPIC,
    level: 18,
    stationId: 'myth_station_18',
    stationNumber: 18,
    description: '抵御光明伤害',
    stats: { defense: 42, hp: 310 },
    effects: [{ id: 'baldr_helmet_dmg', type: EffectType.REDUCE_DEFENSE, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '受到的伤害-15%，对黑暗属性敌人伤害+25%' }],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'baldr_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_18_2': {
    id: 'myth_equip_18_2',
    name: '巴尔德尔光明铠甲',
    slot: EquipmentSlot.BODY,
    rarity: ItemRarity.EPIC,
    level: 18,
    stationId: 'myth_station_18',
    stationNumber: 18,
    description: '吸收光明神力',
    stats: { defense: 48, hp: 360 },
    effects: [
      { id: 'baldr_armor_atk', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.18, chance: 1, description: '攻击+18%，生命恢复+每秒4.5%' },
      { id: 'baldr_armor_reflect', type: EffectType.REFLECT_DAMAGE, trigger: EffectTrigger.ON_DEFEND, value: 0.15, chance: 1, description: '受到的伤害反弹15%' }
    ],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'baldr_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_18_3': {
    id: 'myth_equip_18_3',
    name: '光明护裤',
    slot: EquipmentSlot.LEGS,
    rarity: ItemRarity.EPIC,
    level: 18,
    stationId: 'myth_station_18',
    stationNumber: 18,
    description: '防止光明缠绕',
    stats: { defense: 34, dodge: 28 },
    effects: [{ id: 'baldr_legs_dodge', type: EffectType.BOOST_DODGE, trigger: EffectTrigger.PASSIVE, value: 0.13, chance: 1, description: '闪避率+13%，闪避时恢复70生命' }],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'baldr_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_18_4': {
    id: 'myth_equip_18_4',
    name: '光明踏靴',
    slot: EquipmentSlot.FEET,
    rarity: ItemRarity.EPIC,
    level: 18,
    stationId: 'myth_station_18',
    stationNumber: 18,
    description: '免疫光明陷阱',
    stats: { dodge: 29, speed: 0.28 },
    effects: [
      { id: 'baldr_boots_speed', type: EffectType.BOOST_SPEED, trigger: EffectTrigger.PASSIVE, value: 0.16, chance: 1, description: '攻速+16%' },
      { id: 'baldr_boots_ignore', type: EffectType.IGNORE_DEFENSE, trigger: EffectTrigger.ON_ATTACK, value: 0.30, chance: 0.30, description: '攻击时30%概率无视敌人30%防御' }
    ],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'baldr_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_18_5': {
    id: 'myth_equip_18_5',
    name: '光明长剑',
    slot: EquipmentSlot.WEAPON,
    rarity: ItemRarity.EPIC,
    level: 18,
    stationId: 'myth_station_18',
    stationNumber: 18,
    description: '附带光明伤害',
    stats: { attack: 85, penetration: 0.22 },
    effects: [{ id: 'baldr_weapon_light', type: EffectType.DAMAGE_BONUS, trigger: EffectTrigger.ON_ATTACK, value: 1.10, chance: 0.50, description: '攻击时50%概率触发光明（额外110%攻击力伤害，可溅射45%，对黑暗系+30%）' }],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'baldr_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_18_6': {
    id: 'myth_equip_18_6',
    name: '巴尔德尔之光碎片',
    slot: EquipmentSlot.ACCESSORY,
    rarity: ItemRarity.EPIC,
    level: 18,
    stationId: 'myth_station_18',
    stationNumber: 18,
    description: '光明神神力残留',
    stats: { hit: 30, crit: 0.13 },
    effects: [
      { id: 'baldr_acc_true', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '真实伤害+15%' },
      { id: 'baldr_acc_crit_true', type: EffectType.DAMAGE_TRUE, trigger: EffectTrigger.ON_CRIT, value: 0.30, chance: 0.50, description: '暴击时50%概率额外造成30%真实伤害' }
    ],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'baldr_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },

  // ==================== 站台19：酒雾狄俄尼索斯站（史诗品质）====================
  'myth_equip_19_1': {
    id: 'myth_equip_19_1',
    name: '酒神冠',
    slot: EquipmentSlot.HEAD,
    rarity: ItemRarity.EPIC,
    level: 19,
    stationId: 'myth_station_19',
    stationNumber: 19,
    description: '抵御酒雾侵蚀',
    stats: { defense: 45, hp: 330 },
    effects: [
      { id: 'dionysus_helmet_dmg', type: EffectType.REDUCE_DEFENSE, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '受到的伤害-15%' },
      { id: 'dionysus_helmet_reduce', type: EffectType.REDUCE_ATTACK, trigger: EffectTrigger.ON_DEFEND, value: 0.20, duration: 6, chance: 0.25, description: '被攻击时25%概率降低敌人攻击20%（持续6秒）' }
    ],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'dionysus_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_19_2': {
    id: 'myth_equip_19_2',
    name: '酒雾纹章胸甲',
    slot: EquipmentSlot.BODY,
    rarity: ItemRarity.EPIC,
    level: 19,
    stationId: 'myth_station_19',
    stationNumber: 19,
    description: '吸收酒神神力',
    stats: { defense: 52, hp: 380 },
    effects: [
      { id: 'dionysus_armor_def', type: EffectType.BOOST_DEFENSE, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '防御+15%，生命恢复+每秒5%' },
      { id: 'dionysus_armor_shield', type: EffectType.SHIELD_GAIN, trigger: EffectTrigger.ON_HP_LOW, value: 900, chance: 1, condition: { type: 'hp_below', value: 0.40 }, description: '生命低于40%时获得900护盾' }
    ],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'dionysus_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_19_3': {
    id: 'myth_equip_19_3',
    name: '酒绒护裤',
    slot: EquipmentSlot.LEGS,
    rarity: ItemRarity.EPIC,
    level: 19,
    stationId: 'myth_station_19',
    stationNumber: 19,
    description: '防止酒雾缠绕',
    stats: { defense: 36, dodge: 29 },
    effects: [{ id: 'dionysus_legs_dodge', type: EffectType.BOOST_DODGE, trigger: EffectTrigger.PASSIVE, value: 0.14, chance: 1, description: '闪避率+14%，闪避时恢复75生命并降低敌人命中20（持续5秒）' }],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'dionysus_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_19_4': {
    id: 'myth_equip_19_4',
    name: '酒雾踏靴',
    slot: EquipmentSlot.FEET,
    rarity: ItemRarity.EPIC,
    level: 19,
    stationId: 'myth_station_19',
    stationNumber: 19,
    description: '免疫酒雾陷阱',
    stats: { dodge: 30, speed: 0.28 },
    effects: [
      { id: 'dionysus_boots_speed', type: EffectType.BOOST_SPEED, trigger: EffectTrigger.PASSIVE, value: 0.16, chance: 1, description: '攻速+16%' },
      { id: 'dionysus_boots_slow', type: EffectType.REDUCE_SPEED, trigger: EffectTrigger.ON_ATTACK, value: 0.15, duration: 5, chance: 0.30, description: '攻击时30%概率降低敌人攻速15%（持续5秒）' }
    ],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'dionysus_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_19_5': {
    id: 'myth_equip_19_5',
    name: '酒神酒刃',
    slot: EquipmentSlot.WEAPON,
    rarity: ItemRarity.EPIC,
    level: 19,
    stationId: 'myth_station_19',
    stationNumber: 19,
    description: '附带酒雾伤害',
    stats: { attack: 90, penetration: 0.24 },
    effects: [{ id: 'dionysus_weapon_drunk', type: EffectType.DAMAGE_BONUS, trigger: EffectTrigger.ON_ATTACK, value: 1.20, duration: 6, chance: 0.55, description: '攻击时55%概率触发醉酒（额外120%攻击力伤害，降低敌人攻击20%持续6秒）' }],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'dionysus_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_19_6': {
    id: 'myth_equip_19_6',
    name: '狄俄尼索斯之杯碎片',
    slot: EquipmentSlot.ACCESSORY,
    rarity: ItemRarity.EPIC,
    level: 19,
    stationId: 'myth_station_19',
    stationNumber: 19,
    description: '酒神神力残留',
    stats: { hit: 31, crit: 0.14 },
    effects: [{ id: 'dionysus_acc_life', type: EffectType.LIFE_STEAL, trigger: EffectTrigger.ON_ATTACK, value: 0.15, chance: 0.20, description: '攻击时20%概率吸血（伤害的15%转化为生命）' }],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'dionysus_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },

  // ==================== 站台20：麦穗德墨忒尔站（史诗品质）====================
  'myth_equip_20_1': {
    id: 'myth_equip_20_1',
    name: '麦穗农神冠',
    slot: EquipmentSlot.HEAD,
    rarity: ItemRarity.EPIC,
    level: 20,
    stationId: 'myth_station_20',
    stationNumber: 20,
    description: '抵御麦穗伤害',
    stats: { defense: 44, hp: 320 },
    effects: [{ id: 'demeter_helmet_dmg', type: EffectType.REDUCE_DEFENSE, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '受到的伤害-15%，生命恢复+每秒4%，生命低于50%时恢复效果翻倍' }],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'demeter_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_20_2': {
    id: 'myth_equip_20_2',
    name: '麦穗纹章胸甲',
    slot: EquipmentSlot.BODY,
    rarity: ItemRarity.EPIC,
    level: 20,
    stationId: 'myth_station_20',
    stationNumber: 20,
    description: '吸收农神神力',
    stats: { defense: 50, hp: 370 },
    effects: [
      { id: 'demeter_armor_def', type: EffectType.BOOST_DEFENSE, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '防御+15%，生命恢复+每秒5%' },
      { id: 'demeter_armor_reflect', type: EffectType.REFLECT_DAMAGE, trigger: EffectTrigger.ON_DEFEND, value: 0.15, chance: 1, description: '受到的伤害反弹15%' }
    ],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'demeter_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_20_3': {
    id: 'myth_equip_20_3',
    name: '麦穗护裤',
    slot: EquipmentSlot.LEGS,
    rarity: ItemRarity.EPIC,
    level: 20,
    stationId: 'myth_station_20',
    stationNumber: 20,
    description: '防止麦穗缠绕',
    stats: { defense: 35, dodge: 28 },
    effects: [{ id: 'demeter_legs_dodge', type: EffectType.BOOST_DODGE, trigger: EffectTrigger.PASSIVE, value: 0.13, chance: 1, description: '闪避率+13%，闪避时恢复70生命并恢复3%最大生命' }],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'demeter_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_20_4': {
    id: 'myth_equip_20_4',
    name: '麦穗踏靴',
    slot: EquipmentSlot.FEET,
    rarity: ItemRarity.EPIC,
    level: 20,
    stationId: 'myth_station_20',
    stationNumber: 20,
    description: '免疫麦穗陷阱',
    stats: { dodge: 29, speed: 0.27 },
    effects: [
      { id: 'demeter_boots_speed', type: EffectType.BOOST_SPEED, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '攻速+15%' },
      { id: 'demeter_boots_dot', type: EffectType.DAMAGE_BONUS, trigger: EffectTrigger.ON_ATTACK, value: 0.06, duration: 8, chance: 0.30, description: '攻击时30%概率附加持续伤害（每秒6%攻击力，持续8秒）' }
    ],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'demeter_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_20_5': {
    id: 'myth_equip_20_5',
    name: '麦穗镰刀',
    slot: EquipmentSlot.WEAPON,
    rarity: ItemRarity.EPIC,
    level: 20,
    stationId: 'myth_station_20',
    stationNumber: 20,
    description: '附带收割伤害',
    stats: { attack: 88, penetration: 0.23 },
    effects: [{ id: 'demeter_weapon_harvest', type: EffectType.DAMAGE_BONUS, trigger: EffectTrigger.ON_ATTACK, value: 1.15, chance: 0.55, description: '攻击时55%概率触发收割（额外115%攻击力伤害，对生命低于30%敌人伤害+50%）' }],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'demeter_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_20_6': {
    id: 'myth_equip_20_6',
    name: '德墨忒尔之穗碎片',
    slot: EquipmentSlot.ACCESSORY,
    rarity: ItemRarity.EPIC,
    level: 20,
    stationId: 'myth_station_20',
    stationNumber: 20,
    description: '农神神力残留',
    stats: { hit: 30, crit: 0.13 },
    effects: [{ id: 'demeter_acc_kill', type: EffectType.HEAL_PERCENT, trigger: EffectTrigger.ON_KILL, value: 0.10, chance: 1, description: '击杀敌人时恢复10%最大生命' }],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'demeter_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },

  // ==================== 站台21：烈焰赫淮斯托斯站（史诗品质）====================
  'myth_equip_21_1': {
    id: 'myth_equip_21_1',
    name: '火神烈焰头盔',
    slot: EquipmentSlot.HEAD,
    rarity: ItemRarity.EPIC,
    level: 21,
    stationId: 'myth_station_21',
    stationNumber: 21,
    description: '抵御烈焰伤害',
    stats: { defense: 50, hp: 370 },
    effects: [
      { id: 'hephaestus_helmet_dmg', type: EffectType.REDUCE_DEFENSE, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '受到的伤害-20%' },
      { id: 'hephaestus_helmet_reflect', type: EffectType.REFLECT_DAMAGE, trigger: EffectTrigger.ON_DEFEND, value: 0.25, chance: 0.30, description: '被攻击时30%概率反弹25%火焰伤害' }
    ],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'hephaestus_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_21_2': {
    id: 'myth_equip_21_2',
    name: '烈焰神纹铠甲',
    slot: EquipmentSlot.BODY,
    rarity: ItemRarity.EPIC,
    level: 21,
    stationId: 'myth_station_21',
    stationNumber: 21,
    description: '吸收火神神力',
    stats: { defense: 58, hp: 420 },
    effects: [
      { id: 'hephaestus_armor_atk', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '攻击+20%，生命恢复+每秒5.5%' },
      { id: 'hephaestus_armor_shield', type: EffectType.SHIELD_GAIN, trigger: EffectTrigger.ON_BATTLE_START, value: 1000, duration: 30, chance: 1, description: '战斗开始时获得1000护盾' }
    ],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'hephaestus_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_21_3': {
    id: 'myth_equip_21_3',
    name: '烈焰护裤',
    slot: EquipmentSlot.LEGS,
    rarity: ItemRarity.EPIC,
    level: 21,
    stationId: 'myth_station_21',
    stationNumber: 21,
    description: '防止烈焰缠绕',
    stats: { defense: 40, dodge: 32 },
    effects: [{ id: 'hephaestus_legs_dodge', type: EffectType.BOOST_DODGE, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '闪避率+15%，闪避时恢复85生命并反弹20伤害' }],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'hephaestus_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_21_4': {
    id: 'myth_equip_21_4',
    name: '火神踏靴',
    slot: EquipmentSlot.FEET,
    rarity: ItemRarity.EPIC,
    level: 21,
    stationId: 'myth_station_21',
    stationNumber: 21,
    description: '免疫烈焰陷阱',
    stats: { dodge: 33, speed: 0.30 },
    effects: [
      { id: 'hephaestus_boots_speed', type: EffectType.BOOST_SPEED, trigger: EffectTrigger.PASSIVE, value: 0.18, chance: 1, description: '攻速+18%' },
      { id: 'hephaestus_boots_burn', type: EffectType.DAMAGE_BONUS, trigger: EffectTrigger.ON_ATTACK, value: 0.08, duration: 8, chance: 0.35, description: '攻击时35%概率附加燃烧（每秒8%攻击力，持续8秒，可叠加2层）' }
    ],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'hephaestus_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_21_5': {
    id: 'myth_equip_21_5',
    name: '烈焰战锤',
    slot: EquipmentSlot.WEAPON,
    rarity: ItemRarity.EPIC,
    level: 21,
    stationId: 'myth_station_21',
    stationNumber: 21,
    description: '附带烈焰伤害',
    stats: { attack: 100, penetration: 0.26 },
    effects: [{ id: 'hephaestus_weapon_fire', type: EffectType.DAMAGE_BONUS, trigger: EffectTrigger.ON_ATTACK, value: 1.40, chance: 0.60, description: '攻击时60%概率触发烈焰（额外140%攻击力伤害，可溅射55%并附加燃烧）' }],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'hephaestus_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_21_6': {
    id: 'myth_equip_21_6',
    name: '赫淮斯托斯之火碎片',
    slot: EquipmentSlot.ACCESSORY,
    rarity: ItemRarity.EPIC,
    level: 21,
    stationId: 'myth_station_21',
    stationNumber: 21,
    description: '火神神力残留',
    stats: { hit: 33, crit: 0.15 },
    effects: [{ id: 'hephaestus_acc_crit', type: EffectType.BOOST_CRIT, trigger: EffectTrigger.PASSIVE, value: 0.45, chance: 1, description: '暴击伤害+45%，攻击燃烧敌人时伤害+30%' }],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'hephaestus_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },

  // ==================== 站台22：暗影赫尔墨斯站（史诗品质）====================
  'myth_equip_22_1': {
    id: 'myth_equip_22_1',
    name: '暗影信使头盔',
    slot: EquipmentSlot.HEAD,
    rarity: ItemRarity.EPIC,
    level: 22,
    stationId: 'myth_station_22',
    stationNumber: 22,
    description: '抵御暗影伤害',
    stats: { defense: 48, hp: 350 },
    effects: [
      { id: 'hermes_helmet_dmg', type: EffectType.REDUCE_DEFENSE, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '受到的伤害-15%，闪避率+8%' },
      { id: 'hermes_helmet_counter', type: EffectType.DAMAGE_BONUS, trigger: EffectTrigger.ON_DODGE, value: 0.50, chance: 0.30, description: '被攻击时30%概率闪避并反击（50%攻击力）' }
    ],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'hermes_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_22_2': {
    id: 'myth_equip_22_2',
    name: '暗影神纹胸甲',
    slot: EquipmentSlot.BODY,
    rarity: ItemRarity.EPIC,
    level: 22,
    stationId: 'myth_station_22',
    stationNumber: 22,
    description: '吸收赫尔墨斯神力',
    stats: { defense: 55, hp: 400 },
    effects: [
      { id: 'hermes_armor_atk', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.18, chance: 1, description: '攻击+18%，生命恢复+每秒5%' },
      { id: 'hermes_armor_low', type: EffectType.BOOST_DODGE, trigger: EffectTrigger.ON_HP_LOW, value: 0.20, chance: 1, condition: { type: 'hp_below', value: 0.35 }, description: '生命低于35%时闪避率+20%' }
    ],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'hermes_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_22_3': {
    id: 'myth_equip_22_3',
    name: '暗影护裤',
    slot: EquipmentSlot.LEGS,
    rarity: ItemRarity.EPIC,
    level: 22,
    stationId: 'myth_station_22',
    stationNumber: 22,
    description: '防止暗影缠绕',
    stats: { defense: 38, dodge: 31 },
    effects: [{ id: 'hermes_legs_dodge', type: EffectType.BOOST_DODGE, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '闪避率+15%，闪避时恢复80生命并攻击+10%（持续8秒）' }],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'hermes_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_22_4': {
    id: 'myth_equip_22_4',
    name: '赫尔墨斯之靴',
    slot: EquipmentSlot.FEET,
    rarity: ItemRarity.EPIC,
    level: 22,
    stationId: 'myth_station_22',
    stationNumber: 22,
    description: '免疫暗影陷阱',
    stats: { dodge: 33, speed: 0.32 },
    effects: [
      { id: 'hermes_boots_speed', type: EffectType.BOOST_SPEED, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '攻速+20%' },
      { id: 'hermes_boots_ignore', type: EffectType.IGNORE_DEFENSE, trigger: EffectTrigger.ON_ATTACK, value: 0.20, chance: 0.35, description: '攻击时35%概率无视敌人防御20%并降低其攻速15%' }
    ],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'hermes_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_22_5': {
    id: 'myth_equip_22_5',
    name: '暗影短刃',
    slot: EquipmentSlot.WEAPON,
    rarity: ItemRarity.EPIC,
    level: 22,
    stationId: 'myth_station_22',
    stationNumber: 22,
    description: '附带暗影伤害',
    stats: { attack: 95, penetration: 0.25 },
    effects: [{ id: 'hermes_weapon_shadow', type: EffectType.DAMAGE_BONUS, trigger: EffectTrigger.ON_ATTACK, value: 1.30, chance: 0.60, description: '攻击时60%概率触发暗影（额外130%攻击力伤害，暴击率+25%持续4秒）' }],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'hermes_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_22_6': {
    id: 'myth_equip_22_6',
    name: '赫尔墨斯之靴碎片',
    slot: EquipmentSlot.ACCESSORY,
    rarity: ItemRarity.EPIC,
    level: 22,
    stationId: 'myth_station_22',
    stationNumber: 22,
    description: '信使神力残留',
    stats: { hit: 32, crit: 0.14 },
    effects: [{ id: 'hermes_acc_pen', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.12, chance: 1, description: '穿透率+12%，真实伤害+12%' }],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'hermes_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },

  // ==================== 站台23：冥府哈迪斯站（史诗品质）====================
  'myth_equip_23_1': {
    id: 'myth_equip_23_1',
    name: '冥王冥盔',
    slot: EquipmentSlot.HEAD,
    rarity: ItemRarity.EPIC,
    level: 23,
    stationId: 'myth_station_23',
    stationNumber: 23,
    description: '抵御冥府伤害',
    stats: { defense: 55, hp: 400 },
    effects: [
      { id: 'hades_helmet_dmg', type: EffectType.REDUCE_DEFENSE, trigger: EffectTrigger.PASSIVE, value: 0.22, chance: 1, description: '受到的伤害-22%' },
      { id: 'hades_helmet_low', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.ON_HP_LOW, value: 0.30, chance: 1, condition: { type: 'hp_below', value: 0.30 }, description: '生命低于30%时获得1200护盾并攻击+30%（每场1次）' }
    ],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'hades_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_23_2': {
    id: 'myth_equip_23_2',
    name: '冥府神纹铠甲',
    slot: EquipmentSlot.BODY,
    rarity: ItemRarity.EPIC,
    level: 23,
    stationId: 'myth_station_23',
    stationNumber: 23,
    description: '吸收冥王神力',
    stats: { defense: 62, hp: 450 },
    effects: [
      { id: 'hades_armor_atk', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.22, chance: 1, description: '攻击+22%，生命恢复+每秒6%' },
      { id: 'hades_armor_reflect', type: EffectType.REFLECT_DAMAGE, trigger: EffectTrigger.ON_DEFEND, value: 0.20, chance: 1, description: '受到的伤害反弹20%' }
    ],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'hades_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_23_3': {
    id: 'myth_equip_23_3',
    name: '冥府护裤',
    slot: EquipmentSlot.LEGS,
    rarity: ItemRarity.EPIC,
    level: 23,
    stationId: 'myth_station_23',
    stationNumber: 23,
    description: '防止冥府缠绕',
    stats: { defense: 42, dodge: 33 },
    effects: [{ id: 'hades_legs_dodge', type: EffectType.BOOST_DODGE, trigger: EffectTrigger.PASSIVE, value: 0.16, chance: 1, description: '闪避率+16%，闪避时恢复90生命并降低敌人攻击15%（持续5秒）' }],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'hades_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_23_4': {
    id: 'myth_equip_23_4',
    name: '冥王踏靴',
    slot: EquipmentSlot.FEET,
    rarity: ItemRarity.EPIC,
    level: 23,
    stationId: 'myth_station_23',
    stationNumber: 23,
    description: '免疫冥府陷阱',
    stats: { dodge: 34, speed: 0.32 },
    effects: [
      { id: 'hades_boots_speed', type: EffectType.BOOST_SPEED, trigger: EffectTrigger.PASSIVE, value: 0.19, chance: 1, description: '攻速+19%' },
      { id: 'hades_boots_reduce_heal', type: EffectType.REDUCE_HEAL, trigger: EffectTrigger.ON_ATTACK, value: 0.50, duration: 6, chance: 0.35, description: '攻击时35%概率降低敌人生命恢复50%（持续6秒）' }
    ],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'hades_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_23_5': {
    id: 'myth_equip_23_5',
    name: '哈迪斯之镰',
    slot: EquipmentSlot.WEAPON,
    rarity: ItemRarity.EPIC,
    level: 23,
    stationId: 'myth_station_23',
    stationNumber: 23,
    description: '附带冥府伤害',
    stats: { attack: 105, penetration: 0.28 },
    effects: [{ id: 'hades_weapon_underworld', type: EffectType.DAMAGE_BONUS, trigger: EffectTrigger.ON_ATTACK, value: 1.50, chance: 0.65, description: '攻击时65%概率触发冥府（额外150%攻击力伤害，对生命低于40%敌人伤害+60%）' }],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'hades_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_23_6': {
    id: 'myth_equip_23_6',
    name: '哈迪斯之戒碎片',
    slot: EquipmentSlot.ACCESSORY,
    rarity: ItemRarity.EPIC,
    level: 23,
    stationId: 'myth_station_23',
    stationNumber: 23,
    description: '冥王神力残留',
    stats: { hit: 34, crit: 0.16 },
    effects: [
      { id: 'hades_acc_true', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '真实伤害+20%' },
      { id: 'hades_acc_kill', type: EffectType.HEAL_PERCENT, trigger: EffectTrigger.ON_KILL, value: 0.15, chance: 1, description: '击杀敌人时恢复15%最大生命' }
    ],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'hades_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },

  // ==================== 站台24：魔法赫卡忒站（史诗品质）====================
  'myth_equip_24_1': {
    id: 'myth_equip_24_1',
    name: '魔法巫冠',
    slot: EquipmentSlot.HEAD,
    rarity: ItemRarity.EPIC,
    level: 24,
    stationId: 'myth_station_24',
    stationNumber: 24,
    description: '抵御魔法伤害',
    stats: { defense: 52, hp: 380 },
    effects: [
      { id: 'hecate_helmet_dmg', type: EffectType.REDUCE_DEFENSE, trigger: EffectTrigger.PASSIVE, value: 0.18, chance: 1, description: '受到的伤害-18%' },
      { id: 'hecate_helmet_reduce', type: EffectType.REDUCE_HIT, trigger: EffectTrigger.ON_DEFEND, value: 15, duration: 6, chance: 0.30, description: '被攻击时30%概率降低敌人穿透率15%（持续6秒）' }
    ],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'hecate_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_24_2': {
    id: 'myth_equip_24_2',
    name: '魔法神纹铠甲',
    slot: EquipmentSlot.BODY,
    rarity: ItemRarity.EPIC,
    level: 24,
    stationId: 'myth_station_24',
    stationNumber: 24,
    description: '吸收魔法神力',
    stats: { defense: 60, hp: 440 },
    effects: [
      { id: 'hecate_armor_atk', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '攻击+20%，生命恢复+每秒5.5%' },
      { id: 'hecate_armor_shield', type: EffectType.SHIELD_GAIN, trigger: EffectTrigger.ON_BATTLE_START, value: 1100, duration: 30, chance: 1, description: '战斗开始时获得1100护盾' }
    ],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'hecate_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_24_3': {
    id: 'myth_equip_24_3',
    name: '魔法护裤',
    slot: EquipmentSlot.LEGS,
    rarity: ItemRarity.EPIC,
    level: 24,
    stationId: 'myth_station_24',
    stationNumber: 24,
    description: '防止魔法缠绕',
    stats: { defense: 40, dodge: 32 },
    effects: [{ id: 'hecate_legs_dodge', type: EffectType.BOOST_DODGE, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '闪避率+15%，闪避时恢复85生命并反弹25魔法伤害' }],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'hecate_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_24_4': {
    id: 'myth_equip_24_4',
    name: '魔法踏靴',
    slot: EquipmentSlot.FEET,
    rarity: ItemRarity.EPIC,
    level: 24,
    stationId: 'myth_station_24',
    stationNumber: 24,
    description: '免疫魔法陷阱',
    stats: { dodge: 33, speed: 0.31 },
    effects: [
      { id: 'hecate_boots_speed', type: EffectType.BOOST_SPEED, trigger: EffectTrigger.PASSIVE, value: 0.18, chance: 1, description: '攻速+18%' },
      { id: 'hecate_boots_reduce', type: EffectType.REDUCE_CRIT, trigger: EffectTrigger.ON_ATTACK, value: 0.15, duration: 5, chance: 0.35, description: '攻击时35%概率降低敌人暴击率15%（持续5秒）' }
    ],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'hecate_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_24_5': {
    id: 'myth_equip_24_5',
    name: '赫卡忒之杖',
    slot: EquipmentSlot.WEAPON,
    rarity: ItemRarity.EPIC,
    level: 24,
    stationId: 'myth_station_24',
    stationNumber: 24,
    description: '附带魔法伤害',
    stats: { attack: 102, penetration: 0.27 },
    effects: [{ id: 'hecate_weapon_magic', type: EffectType.DAMAGE_BONUS, trigger: EffectTrigger.ON_ATTACK, value: 1.45, chance: 0.60, description: '攻击时60%概率触发魔法（额外145%攻击力伤害，可溅射50%并降低敌人防御20%）' }],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'hecate_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
  'myth_equip_24_6': {
    id: 'myth_equip_24_6',
    name: '赫卡忒之杖碎片',
    slot: EquipmentSlot.ACCESSORY,
    rarity: ItemRarity.EPIC,
    level: 24,
    stationId: 'myth_station_24',
    stationNumber: 24,
    description: '魔法女神神力残留',
    stats: { hit: 33, crit: 0.15 },
    effects: [
      { id: 'hecate_acc_pen', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '穿透率+15%' },
      { id: 'hecate_acc_ignore', type: EffectType.IGNORE_SHIELD, trigger: EffectTrigger.ON_ATTACK, value: 1, chance: 0.30, description: '攻击时30%概率无视敌人护盾' }
    ],
    setBonus: { requiredPieces: 4, description: '4件套：生命值+15%', effect: { id: 'hecate_set_4', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '生命值+15%' } }
  },
};

export default MYTHOLOGY_EQUIPMENT;
