// 神话站台专属装备数据 - 站台25-32（传说期-神话期）
// 基于《装备数值设定_膨胀版_自动战斗版》

import { ItemRarity } from './types';
import {
  EquipmentSlot,
  EffectTrigger,
  EffectType,
  type MythologyEquipment,
} from './equipmentTypes';

// 站台25-32装备（传说期-神话期）
export const MYTHOLOGY_EQUIPMENT: Record<string, MythologyEquipment> = {
  // ==================== 站台25：黑夜倪克斯站（传说品质）====================
  'myth_equip_25_1': {
    id: 'myth_equip_25_1',
    name: '黑夜神冠',
    slot: EquipmentSlot.HEAD,
    rarity: ItemRarity.LEGENDARY,
    level: 25,
    stationId: 'myth_station_25',
    stationNumber: 25,
    description: '抵御黑夜伤害',
    stats: { defense: 62, hp: 460 },
    effects: [
      { id: 'nyx_helmet_dmg', type: EffectType.REDUCE_DEFENSE, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '受到的伤害-20%，夜间战斗全属性+10%' },
      { id: 'nyx_helmet_low', type: EffectType.BOOST_DODGE, trigger: EffectTrigger.ON_HP_LOW, value: 0.25, chance: 1, condition: { type: 'hp_below', value: 0.35 }, description: '生命低于35%时闪避率+25%' }
    ],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'nyx_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_25_2': {
    id: 'myth_equip_25_2',
    name: '黑夜神纹铠甲',
    slot: EquipmentSlot.BODY,
    rarity: ItemRarity.LEGENDARY,
    level: 25,
    stationId: 'myth_station_25',
    stationNumber: 25,
    description: '吸收黑夜神力',
    stats: { defense: 72, hp: 520 },
    effects: [
      { id: 'nyx_armor_def', type: EffectType.BOOST_DEFENSE, trigger: EffectTrigger.PASSIVE, value: 0.18, chance: 1, description: '防御+18%，生命恢复+每秒6%' },
      { id: 'nyx_armor_dodge', type: EffectType.HEAL_PERCENT, trigger: EffectTrigger.ON_DEFEND, value: 0.05, chance: 0.35, description: '被攻击时35%概率闪避并恢复5%最大生命' }
    ],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'nyx_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_25_3': {
    id: 'myth_equip_25_3',
    name: '黑夜护裤',
    slot: EquipmentSlot.LEGS,
    rarity: ItemRarity.LEGENDARY,
    level: 25,
    stationId: 'myth_station_25',
    stationNumber: 25,
    description: '防止黑夜缠绕',
    stats: { defense: 48, dodge: 38 },
    effects: [{ id: 'nyx_legs_dodge', type: EffectType.BOOST_DODGE, trigger: EffectTrigger.PASSIVE, value: 0.18, chance: 1, description: '闪避率+18%，闪避时恢复100生命并攻击+12%（持续10秒，可叠加3层）' }],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'nyx_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_25_4': {
    id: 'myth_equip_25_4',
    name: '黑夜踏靴',
    slot: EquipmentSlot.FEET,
    rarity: ItemRarity.LEGENDARY,
    level: 25,
    stationId: 'myth_station_25',
    stationNumber: 25,
    description: '免疫黑夜陷阱',
    stats: { dodge: 39, speed: 0.35 },
    effects: [
      { id: 'nyx_boots_speed', type: EffectType.BOOST_SPEED, trigger: EffectTrigger.PASSIVE, value: 0.22, chance: 1, description: '攻速+22%' },
      { id: 'nyx_boots_ignore', type: EffectType.IGNORE_DODGE, trigger: EffectTrigger.ON_ATTACK, value: 1, chance: 0.40, description: '攻击时40%概率无视敌人闪避并降低其攻速20%（持续6秒）' }
    ],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'nyx_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_25_5': {
    id: 'myth_equip_25_5',
    name: '黑夜短刃',
    slot: EquipmentSlot.WEAPON,
    rarity: ItemRarity.LEGENDARY,
    level: 25,
    stationId: 'myth_station_25',
    stationNumber: 25,
    description: '附带黑夜伤害',
    stats: { attack: 118, penetration: 0.32 },
    effects: [{ id: 'nyx_weapon_night', type: EffectType.DAMAGE_BONUS, trigger: EffectTrigger.ON_ATTACK, value: 1.70, chance: 0.70, description: '攻击时70%概率触发黑夜（额外170%攻击力伤害，暴击率+30%持续5秒）' }],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'nyx_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_25_6': {
    id: 'myth_equip_25_6',
    name: '倪克斯之纱碎片',
    slot: EquipmentSlot.ACCESSORY,
    rarity: ItemRarity.LEGENDARY,
    level: 25,
    stationId: 'myth_station_25',
    stationNumber: 25,
    description: '黑夜女神神力残留',
    stats: { hit: 38, crit: 0.18 },
    effects: [
      { id: 'nyx_acc_true', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.25, chance: 1, description: '真实伤害+25%' },
      { id: 'nyx_acc_crit', type: EffectType.BOOST_CRIT, trigger: EffectTrigger.PASSIVE, value: 0.50, chance: 1, description: '暴击伤害+50%' },
      { id: 'nyx_acc_low', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.ON_HP_LOW, value: 0.40, chance: 1, condition: { type: 'hp_below', value: 0.40 }, description: '生命低于40%时真实伤害+40%' }
    ],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'nyx_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },

  // ==================== 站台26：爱箭厄洛斯站（传说品质）====================
  'myth_equip_26_1': {
    id: 'myth_equip_26_1',
    name: '爱神冠',
    slot: EquipmentSlot.HEAD,
    rarity: ItemRarity.LEGENDARY,
    level: 26,
    stationId: 'myth_station_26',
    stationNumber: 26,
    description: '抵御爱箭伤害',
    stats: { defense: 58, hp: 430 },
    effects: [
      { id: 'eros_helmet_dmg', type: EffectType.REDUCE_DEFENSE, trigger: EffectTrigger.PASSIVE, value: 0.18, chance: 1, description: '受到的伤害-18%' },
      { id: 'eros_helmet_reduce', type: EffectType.REDUCE_ATTACK, trigger: EffectTrigger.ON_DEFEND, value: 0.25, duration: 7, chance: 0.35, description: '被攻击时35%概率降低敌人攻击25%（持续7秒）' }
    ],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'eros_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_26_2': {
    id: 'myth_equip_26_2',
    name: '爱神纹章胸甲',
    slot: EquipmentSlot.BODY,
    rarity: ItemRarity.LEGENDARY,
    level: 26,
    stationId: 'myth_station_26',
    stationNumber: 26,
    description: '吸收爱神神力',
    stats: { defense: 68, hp: 490 },
    effects: [
      { id: 'eros_armor_atk', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '攻击+20%，生命恢复+每秒6%' },
      { id: 'eros_armor_shield', type: EffectType.SHIELD_GAIN, trigger: EffectTrigger.ON_HP_LOW, value: 1300, chance: 1, condition: { type: 'hp_below', value: 0.40 }, description: '生命低于40%时获得1300护盾' }
    ],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'eros_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_26_3': {
    id: 'myth_equip_26_3',
    name: '爱箭护裤',
    slot: EquipmentSlot.LEGS,
    rarity: ItemRarity.LEGENDARY,
    level: 26,
    stationId: 'myth_station_26',
    stationNumber: 26,
    description: '防止爱箭缠绕',
    stats: { defense: 45, dodge: 36 },
    effects: [{ id: 'eros_legs_dodge', type: EffectType.BOOST_DODGE, trigger: EffectTrigger.PASSIVE, value: 0.16, chance: 1, description: '闪避率+16%，闪避时恢复95生命并降低敌人命中25（持续6秒）' }],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'eros_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_26_4': {
    id: 'myth_equip_26_4',
    name: '爱箭踏靴',
    slot: EquipmentSlot.FEET,
    rarity: ItemRarity.LEGENDARY,
    level: 26,
    stationId: 'myth_station_26',
    stationNumber: 26,
    description: '免疫爱箭陷阱',
    stats: { dodge: 37, speed: 0.33 },
    effects: [
      { id: 'eros_boots_speed', type: EffectType.BOOST_SPEED, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '攻速+20%' },
      { id: 'eros_boots_reduce', type: EffectType.REDUCE_DEFENSE, trigger: EffectTrigger.ON_ATTACK, value: 0.40, chance: 0.40, description: '攻击时40%概率使敌人下次攻击伤害-40%' }
    ],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'eros_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_26_5': {
    id: 'myth_equip_26_5',
    name: '厄洛斯之弓',
    slot: EquipmentSlot.WEAPON,
    rarity: ItemRarity.LEGENDARY,
    level: 26,
    stationId: 'myth_station_26',
    stationNumber: 26,
    description: '附带爱箭伤害',
    stats: { attack: 112, penetration: 0.30 },
    effects: [{ id: 'eros_weapon_arrow', type: EffectType.DAMAGE_BONUS, trigger: EffectTrigger.ON_ATTACK, value: 1.60, duration: 7, chance: 0.70, description: '攻击时70%概率触发爱箭（额外160%攻击力伤害，并降低敌人防御25%持续7秒）' }],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'eros_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_26_6': {
    id: 'myth_equip_26_6',
    name: '厄洛斯之箭碎片',
    slot: EquipmentSlot.ACCESSORY,
    rarity: ItemRarity.LEGENDARY,
    level: 26,
    stationId: 'myth_station_26',
    stationNumber: 26,
    description: '爱神神力残留',
    stats: { hit: 36, crit: 0.17 },
    effects: [
      { id: 'eros_acc_pen', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '穿透率+15%' },
      { id: 'eros_acc_ignore', type: EffectType.IGNORE_DEFENSE, trigger: EffectTrigger.ON_ATTACK, value: 0.50, chance: 0.25, description: '攻击时25%概率无视敌人50%防御' }
    ],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'eros_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },

  // ==================== 站台27：死亡塔纳托斯站（传说品质）====================
  'myth_equip_27_1': {
    id: 'myth_equip_27_1',
    name: '死神冥盔',
    slot: EquipmentSlot.HEAD,
    rarity: ItemRarity.LEGENDARY,
    level: 27,
    stationId: 'myth_station_27',
    stationNumber: 27,
    description: '抵御死亡伤害',
    stats: { defense: 68, hp: 500 },
    effects: [
      { id: 'thanatos_helmet_dmg', type: EffectType.REDUCE_DEFENSE, trigger: EffectTrigger.PASSIVE, value: 0.25, chance: 1, description: '受到的伤害-25%' },
      { id: 'thanatos_helmet_low', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.ON_HP_LOW, value: 0.35, chance: 1, condition: { type: 'hp_below', value: 0.30 }, description: '生命低于30%时攻击+35%并获得1500护盾' }
    ],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'thanatos_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_27_2': {
    id: 'myth_equip_27_2',
    name: '死神神纹铠甲',
    slot: EquipmentSlot.BODY,
    rarity: ItemRarity.LEGENDARY,
    level: 27,
    stationId: 'myth_station_27',
    stationNumber: 27,
    description: '吸收死神神力',
    stats: { defense: 78, hp: 560 },
    effects: [
      { id: 'thanatos_armor_atk', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.24, chance: 1, description: '攻击+24%，生命恢复+每秒7%' },
      { id: 'thanatos_armor_reflect', type: EffectType.REFLECT_DAMAGE, trigger: EffectTrigger.ON_DEFEND, value: 0.25, chance: 1, description: '受到的伤害反弹25%' }
    ],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'thanatos_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_27_3': {
    id: 'myth_equip_27_3',
    name: '死神护裤',
    slot: EquipmentSlot.LEGS,
    rarity: ItemRarity.LEGENDARY,
    level: 27,
    stationId: 'myth_station_27',
    stationNumber: 27,
    description: '防止死亡缠绕',
    stats: { defense: 52, dodge: 40 },
    effects: [{ id: 'thanatos_legs_dodge', type: EffectType.BOOST_DODGE, trigger: EffectTrigger.PASSIVE, value: 0.18, chance: 1, description: '闪避率+18%，闪避时恢复110生命并降低敌人攻速20%（持续5秒）' }],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'thanatos_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_27_4': {
    id: 'myth_equip_27_4',
    name: '死神踏靴',
    slot: EquipmentSlot.FEET,
    rarity: ItemRarity.LEGENDARY,
    level: 27,
    stationId: 'myth_station_27',
    stationNumber: 27,
    description: '免疫死亡陷阱',
    stats: { dodge: 41, speed: 0.36 },
    effects: [
      { id: 'thanatos_boots_speed', type: EffectType.BOOST_SPEED, trigger: EffectTrigger.PASSIVE, value: 0.24, chance: 1, description: '攻速+24%' },
      { id: 'thanatos_boots_bonus', type: EffectType.DAMAGE_BONUS, trigger: EffectTrigger.ON_ATTACK, value: 0.80, chance: 0.45, condition: { type: 'enemy_hp_below', value: 0.50 }, description: '攻击时45%概率对生命低于50%敌人造成额外80%伤害' }
    ],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'thanatos_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_27_5': {
    id: 'myth_equip_27_5',
    name: '塔纳托斯之镰',
    slot: EquipmentSlot.WEAPON,
    rarity: ItemRarity.LEGENDARY,
    level: 27,
    stationId: 'myth_station_27',
    stationNumber: 27,
    description: '附带死亡伤害',
    stats: { attack: 128, penetration: 0.35 },
    effects: [{ id: 'thanatos_weapon_death', type: EffectType.DAMAGE_BONUS, trigger: EffectTrigger.ON_ATTACK, value: 1.90, chance: 0.75, description: '攻击时75%概率触发死亡（额外190%攻击力伤害，对生命低于40%敌人伤害+80%）' }],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'thanatos_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_27_6': {
    id: 'myth_equip_27_6',
    name: '塔纳托斯之镰碎片',
    slot: EquipmentSlot.ACCESSORY,
    rarity: ItemRarity.LEGENDARY,
    level: 27,
    stationId: 'myth_station_27',
    stationNumber: 27,
    description: '死神神力残留',
    stats: { hit: 42, crit: 0.20 },
    effects: [
      { id: 'thanatos_acc_true', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.30, chance: 1, description: '真实伤害+30%' },
      { id: 'thanatos_acc_kill', type: EffectType.HEAL_PERCENT, trigger: EffectTrigger.ON_KILL, value: 0.20, chance: 1, description: '击杀敌人时恢复20%最大生命并攻击+15%（可叠加5层）' }
    ],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'thanatos_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },

  // ==================== 站台28：黑暗霍德尔站（传说品质）====================
  'myth_equip_28_1': {
    id: 'myth_equip_28_1',
    name: '黑暗神盔',
    slot: EquipmentSlot.HEAD,
    rarity: ItemRarity.LEGENDARY,
    level: 28,
    stationId: 'myth_station_28',
    stationNumber: 28,
    description: '抵御黑暗伤害',
    stats: { defense: 65, hp: 480 },
    effects: [
      { id: 'hoder_helmet_dmg', type: EffectType.REDUCE_DEFENSE, trigger: EffectTrigger.PASSIVE, value: 0.22, chance: 1, description: '受到的伤害-22%，对光明属性敌人伤害+30%' },
      { id: 'hoder_helmet_low', type: EffectType.BOOST_DEFENSE, trigger: EffectTrigger.ON_HP_LOW, value: 0.30, chance: 1, condition: { type: 'hp_below', value: 0.35 }, description: '生命低于35%时防御+30%' }
    ],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'hoder_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_28_2': {
    id: 'myth_equip_28_2',
    name: '黑暗神纹铠甲',
    slot: EquipmentSlot.BODY,
    rarity: ItemRarity.LEGENDARY,
    level: 28,
    stationId: 'myth_station_28',
    stationNumber: 28,
    description: '吸收黑暗神力',
    stats: { defense: 75, hp: 540 },
    effects: [
      { id: 'hoder_armor_atk', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.22, chance: 1, description: '攻击+22%，生命恢复+每秒6.5%' },
      { id: 'hoder_armor_reflect', type: EffectType.REFLECT_DAMAGE, trigger: EffectTrigger.ON_DEFEND, value: 0.22, chance: 1, description: '受到的伤害反弹22%' }
    ],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'hoder_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_28_3': {
    id: 'myth_equip_28_3',
    name: '黑暗护裤',
    slot: EquipmentSlot.LEGS,
    rarity: ItemRarity.LEGENDARY,
    level: 28,
    stationId: 'myth_station_28',
    stationNumber: 28,
    description: '防止黑暗缠绕',
    stats: { defense: 50, dodge: 39 },
    effects: [{ id: 'hoder_legs_dodge', type: EffectType.BOOST_DODGE, trigger: EffectTrigger.PASSIVE, value: 0.17, chance: 1, description: '闪避率+17%，闪避时恢复105生命并反弹30伤害' }],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'hoder_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_28_4': {
    id: 'myth_equip_28_4',
    name: '黑暗踏靴',
    slot: EquipmentSlot.FEET,
    rarity: ItemRarity.LEGENDARY,
    level: 28,
    stationId: 'myth_station_28',
    stationNumber: 28,
    description: '免疫黑暗陷阱',
    stats: { dodge: 40, speed: 0.35 },
    effects: [
      { id: 'hoder_boots_speed', type: EffectType.BOOST_SPEED, trigger: EffectTrigger.PASSIVE, value: 0.22, chance: 1, description: '攻速+22%' },
      { id: 'hoder_boots_reduce', type: EffectType.REDUCE_HIT, trigger: EffectTrigger.ON_ATTACK, value: 30, duration: 6, chance: 0.40, description: '攻击时40%概率降低敌人命中30（持续6秒）' }
    ],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'hoder_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_28_5': {
    id: 'myth_equip_28_5',
    name: '霍德尔之石刃',
    slot: EquipmentSlot.WEAPON,
    rarity: ItemRarity.LEGENDARY,
    level: 28,
    stationId: 'myth_station_28',
    stationNumber: 28,
    description: '附带黑暗伤害',
    stats: { attack: 122, penetration: 0.33 },
    effects: [{ id: 'hoder_weapon_dark', type: EffectType.DAMAGE_BONUS, trigger: EffectTrigger.ON_ATTACK, value: 1.75, chance: 0.70, description: '攻击时70%概率触发黑暗（额外175%攻击力伤害，可溅射50%）' }],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'hoder_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_28_6': {
    id: 'myth_equip_28_6',
    name: '霍德尔之石碎片',
    slot: EquipmentSlot.ACCESSORY,
    rarity: ItemRarity.LEGENDARY,
    level: 28,
    stationId: 'myth_station_28',
    stationNumber: 28,
    description: '黑暗之神神力残留',
    stats: { hit: 40, crit: 0.19 },
    effects: [
      { id: 'hoder_acc_pen', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.18, chance: 1, description: '穿透率+18%，真实伤害+20%' },
      { id: 'hoder_acc_crit_true', type: EffectType.DAMAGE_TRUE, trigger: EffectTrigger.ON_CRIT, value: 0.40, chance: 0.50, description: '暴击时50%概率额外造成40%真实伤害' }
    ],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'hoder_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },

  // ==================== 站台29：森林维达站（传说品质）====================
  'myth_equip_29_1': {
    id: 'myth_equip_29_1',
    name: '森林神冠',
    slot: EquipmentSlot.HEAD,
    rarity: ItemRarity.LEGENDARY,
    level: 29,
    stationId: 'myth_station_29',
    stationNumber: 29,
    description: '抵御森林伤害',
    stats: { defense: 62, hp: 460 },
    effects: [{ id: 'vidar_helmet_dmg', type: EffectType.REDUCE_DEFENSE, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '受到的伤害-20%，生命恢复+每秒5%，生命高于70%时攻击+20%' }],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'vidar_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_29_2': {
    id: 'myth_equip_29_2',
    name: '森林神纹铠甲',
    slot: EquipmentSlot.BODY,
    rarity: ItemRarity.LEGENDARY,
    level: 29,
    stationId: 'myth_station_29',
    stationNumber: 29,
    description: '吸收森林神力',
    stats: { defense: 72, hp: 520 },
    effects: [
      { id: 'vidar_armor_def', type: EffectType.BOOST_DEFENSE, trigger: EffectTrigger.PASSIVE, value: 0.18, chance: 1, description: '防御+18%，生命恢复+每秒6%' },
      { id: 'vidar_armor_reflect', type: EffectType.REFLECT_DAMAGE, trigger: EffectTrigger.ON_DEFEND, value: 0.20, chance: 1, description: '受到的伤害反弹20%' }
    ],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'vidar_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_29_3': {
    id: 'myth_equip_29_3',
    name: '森林护裤',
    slot: EquipmentSlot.LEGS,
    rarity: ItemRarity.LEGENDARY,
    level: 29,
    stationId: 'myth_station_29',
    stationNumber: 29,
    description: '防止森林缠绕',
    stats: { defense: 48, dodge: 38 },
    effects: [{ id: 'vidar_legs_dodge', type: EffectType.BOOST_DODGE, trigger: EffectTrigger.PASSIVE, value: 0.17, chance: 1, description: '闪避率+17%，闪避时恢复100生命并恢复4%最大生命' }],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'vidar_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_29_4': {
    id: 'myth_equip_29_4',
    name: '森林踏靴',
    slot: EquipmentSlot.FEET,
    rarity: ItemRarity.LEGENDARY,
    level: 29,
    stationId: 'myth_station_29',
    stationNumber: 29,
    description: '免疫森林陷阱',
    stats: { dodge: 39, speed: 0.34 },
    effects: [
      { id: 'vidar_boots_speed', type: EffectType.BOOST_SPEED, trigger: EffectTrigger.PASSIVE, value: 0.21, chance: 1, description: '攻速+21%' },
      { id: 'vidar_boots_dot', type: EffectType.DAMAGE_BONUS, trigger: EffectTrigger.ON_ATTACK, value: 0.07, duration: 10, chance: 0.40, description: '攻击时40%概率附加自然伤害（每秒7%攻击力，持续10秒，可叠加2层）' }
    ],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'vidar_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_29_5': {
    id: 'myth_equip_29_5',
    name: '维达之斧',
    slot: EquipmentSlot.WEAPON,
    rarity: ItemRarity.LEGENDARY,
    level: 29,
    stationId: 'myth_station_29',
    stationNumber: 29,
    description: '附带自然伤害',
    stats: { attack: 118, penetration: 0.32 },
    effects: [{ id: 'vidar_weapon_nature', type: EffectType.DAMAGE_BONUS, trigger: EffectTrigger.ON_ATTACK, value: 1.70, chance: 0.70, description: '攻击时70%概率触发自然（额外170%攻击力伤害，对生命低于35%敌人伤害+70%）' }],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'vidar_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_29_6': {
    id: 'myth_equip_29_6',
    name: '维达之斧碎片',
    slot: EquipmentSlot.ACCESSORY,
    rarity: ItemRarity.LEGENDARY,
    level: 29,
    stationId: 'myth_station_29',
    stationNumber: 29,
    description: '森林之神神力残留',
    stats: { hit: 38, crit: 0.18 },
    effects: [
      { id: 'vidar_acc_crit', type: EffectType.BOOST_CRIT, trigger: EffectTrigger.PASSIVE, value: 0.50, chance: 1, description: '暴击伤害+50%' },
      { id: 'vidar_acc_kill', type: EffectType.HEAL_PERCENT, trigger: EffectTrigger.ON_KILL, value: 0.12, chance: 1, description: '击杀敌人时恢复12%最大生命' }
    ],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'vidar_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },

  // ==================== 站台30：复仇瓦利站（传说品质）====================
  'myth_equip_30_1': {
    id: 'myth_equip_30_1',
    name: '复仇神盔',
    slot: EquipmentSlot.HEAD,
    rarity: ItemRarity.LEGENDARY,
    level: 30,
    stationId: 'myth_station_30',
    stationNumber: 30,
    description: '抵御复仇伤害',
    stats: { defense: 70, hp: 520 },
    effects: [
      { id: 'vali_helmet_dmg', type: EffectType.REDUCE_DEFENSE, trigger: EffectTrigger.PASSIVE, value: 0.25, chance: 1, description: '受到的伤害-25%' },
      { id: 'vali_helmet_reflect', type: EffectType.REFLECT_DAMAGE, trigger: EffectTrigger.ON_DEFEND, value: 0.30, chance: 0.40, description: '被攻击时40%概率反弹30%伤害并攻击+10%（可叠加5层）' }
    ],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'vali_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_30_2': {
    id: 'myth_equip_30_2',
    name: '复仇神纹铠甲',
    slot: EquipmentSlot.BODY,
    rarity: ItemRarity.LEGENDARY,
    level: 30,
    stationId: 'myth_station_30',
    stationNumber: 30,
    description: '吸收复仇神力',
    stats: { defense: 80, hp: 580 },
    effects: [
      { id: 'vali_armor_atk', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.24, chance: 1, description: '攻击+24%，生命恢复+每秒7%' },
      { id: 'vali_armor_low', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.ON_HP_LOW, value: 0.35, chance: 1, condition: { type: 'hp_below', value: 0.35 }, description: '生命低于35%时攻击+35%' }
    ],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'vali_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_30_3': {
    id: 'myth_equip_30_3',
    name: '复仇护裤',
    slot: EquipmentSlot.LEGS,
    rarity: ItemRarity.LEGENDARY,
    level: 30,
    stationId: 'myth_station_30',
    stationNumber: 30,
    description: '防止复仇缠绕',
    stats: { defense: 54, dodge: 42 },
    effects: [{ id: 'vali_legs_dodge', type: EffectType.BOOST_DODGE, trigger: EffectTrigger.PASSIVE, value: 0.19, chance: 1, description: '闪避率+19%，闪避时恢复115生命并攻击+12%（持续10秒，可叠加4层）' }],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'vali_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_30_4': {
    id: 'myth_equip_30_4',
    name: '复仇踏靴',
    slot: EquipmentSlot.FEET,
    rarity: ItemRarity.LEGENDARY,
    level: 30,
    stationId: 'myth_station_30',
    stationNumber: 30,
    description: '免疫复仇陷阱',
    stats: { dodge: 43, speed: 0.37 },
    effects: [
      { id: 'vali_boots_speed', type: EffectType.BOOST_SPEED, trigger: EffectTrigger.PASSIVE, value: 0.25, chance: 1, description: '攻速+25%' },
      { id: 'vali_boots_reduce', type: EffectType.REDUCE_DEFENSE, trigger: EffectTrigger.ON_ATTACK, value: 0.30, duration: 8, chance: 0.45, description: '攻击时45%概率降低敌人防御30%（持续8秒）' }
    ],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'vali_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_30_5': {
    id: 'myth_equip_30_5',
    name: '瓦利之剑',
    slot: EquipmentSlot.WEAPON,
    rarity: ItemRarity.LEGENDARY,
    level: 30,
    stationId: 'myth_station_30',
    stationNumber: 30,
    description: '附带复仇伤害',
    stats: { attack: 132, penetration: 0.36 },
    effects: [
      { id: 'vali_weapon_vengeance', type: EffectType.DAMAGE_BONUS, trigger: EffectTrigger.ON_ATTACK, value: 2.00, chance: 0.75, description: '攻击时75%概率触发复仇（额外200%攻击力伤害，暴击伤害+60%）' },
      { id: 'vali_weapon_crit', type: EffectType.BOOST_CRIT, trigger: EffectTrigger.PASSIVE, value: 0.25, chance: 1, description: '暴击率+25%' }
    ],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'vali_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_30_6': {
    id: 'myth_equip_30_6',
    name: '瓦利之剑碎片',
    slot: EquipmentSlot.ACCESSORY,
    rarity: ItemRarity.LEGENDARY,
    level: 30,
    stationId: 'myth_station_30',
    stationNumber: 30,
    description: '复仇之神神力残留',
    stats: { hit: 44, crit: 0.21 },
    effects: [
      { id: 'vali_acc_true', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.30, chance: 1, description: '真实伤害+30%' },
      { id: 'vali_acc_low', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.ON_HP_LOW, value: 0.50, chance: 1, condition: { type: 'hp_below', value: 0.40 }, description: '生命低于40%时真实伤害+50%' }
    ],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'vali_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },

  // ==================== 站台31：狩猎乌勒尔站（传说品质）====================
  'myth_equip_31_1': {
    id: 'myth_equip_31_1',
    name: '狩猎神冠',
    slot: EquipmentSlot.HEAD,
    rarity: ItemRarity.LEGENDARY,
    level: 31,
    stationId: 'myth_station_31',
    stationNumber: 31,
    description: '抵御狩猎伤害',
    stats: { defense: 68, hp: 500, hit: 12 },
    effects: [
      { id: 'ullr_helmet_dmg', type: EffectType.REDUCE_DEFENSE, trigger: EffectTrigger.PASSIVE, value: 0.22, chance: 1, description: '受到的伤害-22%' },
      { id: 'ullr_helmet_bonus', type: EffectType.DAMAGE_BONUS, trigger: EffectTrigger.PASSIVE, value: 0.30, chance: 1, condition: { type: 'hp_above', value: 0.70 }, description: '对生命高于70%敌人伤害+30%' }
    ],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'ullr_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_31_2': {
    id: 'myth_equip_31_2',
    name: '狩猎神纹铠甲',
    slot: EquipmentSlot.BODY,
    rarity: ItemRarity.LEGENDARY,
    level: 31,
    stationId: 'myth_station_31',
    stationNumber: 31,
    description: '吸收狩猎神力',
    stats: { defense: 78, hp: 560 },
    effects: [
      { id: 'ullr_armor_atk', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.22, chance: 1, description: '攻击+22%，生命恢复+每秒6.5%' },
      { id: 'ullr_armor_ignore', type: EffectType.IGNORE_DODGE, trigger: EffectTrigger.PASSIVE, value: 0.15, chance: 1, description: '攻击时无视敌人15%闪避' }
    ],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'ullr_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_31_3': {
    id: 'myth_equip_31_3',
    name: '狩猎护裤',
    slot: EquipmentSlot.LEGS,
    rarity: ItemRarity.LEGENDARY,
    level: 31,
    stationId: 'myth_station_31',
    stationNumber: 31,
    description: '防止狩猎缠绕',
    stats: { defense: 52, dodge: 41 },
    effects: [{ id: 'ullr_legs_dodge', type: EffectType.BOOST_DODGE, trigger: EffectTrigger.PASSIVE, value: 0.18, chance: 1, description: '闪避率+18%，闪避时恢复110生命并命中+15（持续8秒）' }],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'ullr_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_31_4': {
    id: 'myth_equip_31_4',
    name: '狩猎踏靴',
    slot: EquipmentSlot.FEET,
    rarity: ItemRarity.LEGENDARY,
    level: 31,
    stationId: 'myth_station_31',
    stationNumber: 31,
    description: '免疫狩猎陷阱',
    stats: { dodge: 42, speed: 0.36 },
    effects: [
      { id: 'ullr_boots_speed', type: EffectType.BOOST_SPEED, trigger: EffectTrigger.PASSIVE, value: 0.24, chance: 1, description: '攻速+24%' },
      { id: 'ullr_boots_ignore', type: EffectType.IGNORE_SHIELD, trigger: EffectTrigger.ON_ATTACK, value: 1, chance: 0.45, description: '攻击时45%概率无视敌人护盾' }
    ],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'ullr_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_31_5': {
    id: 'myth_equip_31_5',
    name: '乌勒尔之弓',
    slot: EquipmentSlot.WEAPON,
    rarity: ItemRarity.LEGENDARY,
    level: 31,
    stationId: 'myth_station_31',
    stationNumber: 31,
    description: '附带狩猎伤害',
    stats: { attack: 128, penetration: 0.35 },
    effects: [{ id: 'ullr_weapon_hunt', type: EffectType.DAMAGE_BONUS, trigger: EffectTrigger.ON_ATTACK, value: 1.95, chance: 0.75, description: '攻击时75%概率触发狩猎（额外195%攻击力伤害，可穿透护盾并暴击率+35%）' }],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'ullr_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_31_6': {
    id: 'myth_equip_31_6',
    name: '乌勒尔之弓碎片',
    slot: EquipmentSlot.ACCESSORY,
    rarity: ItemRarity.LEGENDARY,
    level: 31,
    stationId: 'myth_station_31',
    stationNumber: 31,
    description: '狩猎之神神力残留',
    stats: { hit: 42, crit: 0.20 },
    effects: [
      { id: 'ullr_acc_crit', type: EffectType.BOOST_CRIT, trigger: EffectTrigger.PASSIVE, value: 0.55, chance: 1, description: '暴击伤害+55%' },
      { id: 'ullr_acc_pen', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '穿透率+20%' },
      { id: 'ullr_acc_triple', type: EffectType.DAMAGE_BONUS, trigger: EffectTrigger.ON_ATTACK, value: 3.00, chance: 0.35, description: '攻击时35%概率造成3倍暴击' }
    ],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'ullr_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },

  // ==================== 站台32：大地希芙站（传说品质）====================
  'myth_equip_32_1': {
    id: 'myth_equip_32_1',
    name: '大地神冠',
    slot: EquipmentSlot.HEAD,
    rarity: ItemRarity.LEGENDARY,
    level: 32,
    stationId: 'myth_station_32',
    stationNumber: 32,
    description: '抵御大地伤害',
    stats: { defense: 75, hp: 560 },
    effects: [
      { id: 'sif_helmet_dmg', type: EffectType.REDUCE_DEFENSE, trigger: EffectTrigger.PASSIVE, value: 0.28, chance: 1, description: '受到的伤害-28%' },
      { id: 'sif_helmet_low', type: EffectType.SHIELD_GAIN, trigger: EffectTrigger.ON_HP_LOW, value: 1800, chance: 1, condition: { type: 'hp_below', value: 0.40 }, description: '生命低于40%时获得1800护盾并全属性+15%' }
    ],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'sif_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_32_2': {
    id: 'myth_equip_32_2',
    name: '大地神纹铠甲',
    slot: EquipmentSlot.BODY,
    rarity: ItemRarity.LEGENDARY,
    level: 32,
    stationId: 'myth_station_32',
    stationNumber: 32,
    description: '吸收大地神力',
    stats: { defense: 88, hp: 640 },
    effects: [
      { id: 'sif_armor_def', type: EffectType.BOOST_DEFENSE, trigger: EffectTrigger.PASSIVE, value: 0.25, chance: 1, description: '防御+25%，生命恢复+每秒7.5%' },
      { id: 'sif_armor_reflect', type: EffectType.REFLECT_DAMAGE, trigger: EffectTrigger.ON_DEFEND, value: 0.28, chance: 1, description: '受到的伤害反弹28%' }
    ],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'sif_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_32_3': {
    id: 'myth_equip_32_3',
    name: '大地护裤',
    slot: EquipmentSlot.LEGS,
    rarity: ItemRarity.LEGENDARY,
    level: 32,
    stationId: 'myth_station_32',
    stationNumber: 32,
    description: '防止大地缠绕',
    stats: { defense: 58, dodge: 45 },
    effects: [{ id: 'sif_legs_dodge', type: EffectType.BOOST_DODGE, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '闪避率+20%，闪避时恢复120生命并防御+10%（持续10秒，可叠加4层）' }],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'sif_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_32_4': {
    id: 'myth_equip_32_4',
    name: '大地踏靴',
    slot: EquipmentSlot.FEET,
    rarity: ItemRarity.LEGENDARY,
    level: 32,
    stationId: 'myth_station_32',
    stationNumber: 32,
    description: '免疫大地陷阱',
    stats: { dodge: 46, speed: 0.38 },
    effects: [
      { id: 'sif_boots_speed', type: EffectType.BOOST_SPEED, trigger: EffectTrigger.PASSIVE, value: 0.26, chance: 1, description: '攻速+26%' },
      { id: 'sif_boots_slow', type: EffectType.REDUCE_SPEED, trigger: EffectTrigger.ON_ATTACK, value: 0.25, duration: 8, chance: 0.50, description: '攻击时50%概率降低敌人攻速25%（持续8秒）' }
    ],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'sif_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_32_5': {
    id: 'myth_equip_32_5',
    name: '希芙之发刃',
    slot: EquipmentSlot.WEAPON,
    rarity: ItemRarity.LEGENDARY,
    level: 32,
    stationId: 'myth_station_32',
    stationNumber: 32,
    description: '附带大地伤害',
    stats: { attack: 140, penetration: 0.38 },
    effects: [
      { id: 'sif_weapon_earth', type: EffectType.DAMAGE_BONUS, trigger: EffectTrigger.ON_ATTACK, value: 2.20, chance: 0.80, description: '攻击时80%概率触发大地（额外220%攻击力伤害，可溅射60%）' },
      { id: 'sif_weapon_shield', type: EffectType.SHIELD_CONVERT, trigger: EffectTrigger.ON_DEFEND, value: 0.25, chance: 1, description: '受到伤害的25%转化为护盾' }
    ],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'sif_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
  'myth_equip_32_6': {
    id: 'myth_equip_32_6',
    name: '希芙之发碎片',
    slot: EquipmentSlot.ACCESSORY,
    rarity: ItemRarity.LEGENDARY,
    level: 32,
    stationId: 'myth_station_32',
    stationNumber: 32,
    description: '大地女神神力残留',
    stats: { hit: 46, crit: 0.22 },
    effects: [
      { id: 'sif_acc_true', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.35, chance: 1, description: '真实伤害+35%' },
      { id: 'sif_acc_crit', type: EffectType.BOOST_CRIT, trigger: EffectTrigger.PASSIVE, value: 0.60, chance: 1, description: '暴击伤害+60%' },
      { id: 'sif_acc_low', type: EffectType.REDUCE_DEFENSE, trigger: EffectTrigger.ON_HP_LOW, value: 0.30, chance: 1, condition: { type: 'hp_below', value: 0.50 }, description: '生命低于50%时受到的伤害-30%' }
    ],
    setBonus: { requiredPieces: 6, description: '6件套：全属性+20%', effect: { id: 'sif_set_6', type: EffectType.BOOST_ATTACK, trigger: EffectTrigger.PASSIVE, value: 0.20, chance: 1, description: '全属性+20%' } }
  },
};

export default MYTHOLOGY_EQUIPMENT;
