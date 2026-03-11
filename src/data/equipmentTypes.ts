// 装备系统类型定义 - 神话站台专属装备

import { ItemRarity } from './types';

// 装备部位
export enum EquipmentSlot {
  HEAD = 'head',       // 头部
  BODY = 'body',       // 衣服
  LEGS = 'legs',       // 裤子
  FEET = 'feet',       // 靴子
  WEAPON = 'weapon',   // 武器
  ACCESSORY = 'accessory', // 饰品
  // 纳米战甲专用部位
  SHOULDER = 'shoulder', // 肩甲
  ARM = 'arm',           // 臂甲
}

// 装备品质（与ItemRarity对应）
export const EquipmentRarity = ItemRarity;

// 特效触发时机
export enum EffectTrigger {
  ON_BATTLE_START = 'on_battle_start',   // 战斗开始时
  ON_ATTACK = 'on_attack',               // 攻击时
  ON_HIT = 'on_hit',                     // 命中时
  ON_DEFEND = 'on_defend',               // 被攻击时
  ON_DODGE = 'on_dodge',                 // 闪避时
  ON_CRIT = 'on_crit',                   // 暴击时
  ON_KILL = 'on_kill',                   // 击杀时
  ON_HP_LOW = 'on_hp_low',               // 生命低于阈值时
  ON_HP_HIGH = 'on_hp_high',             // 生命高于阈值时
  PASSIVE = 'passive',                   // 被动常驻
}

// 特效类型
export enum EffectType {
  // 伤害类
  DAMAGE_BONUS = 'damage_bonus',         // 额外伤害（百分比）
  DAMAGE_FIXED = 'damage_fixed',         // 固定额外伤害
  DAMAGE_TRUE = 'damage_true',           // 真实伤害
  DAMAGE_SPLASH = 'damage_splash',       // 溅射伤害
  
  // 恢复类
  HEAL_PERCENT = 'heal_percent',         // 百分比恢复
  HEAL_FIXED = 'heal_fixed',             // 固定恢复
  
  // 护盾类
  SHIELD_GAIN = 'shield_gain',           // 获得护盾
  SHIELD_CONVERT = 'shield_convert',     // 伤害转护盾
  
  // 属性变化类（对敌人）
  REDUCE_DEFENSE = 'reduce_defense',     // 降低防御
  REDUCE_ATTACK = 'reduce_attack',       // 降低攻击
  REDUCE_SPEED = 'reduce_speed',         // 降低攻速
  REDUCE_HIT = 'reduce_hit',             // 降低命中
  REDUCE_CRIT = 'reduce_crit',           // 降低暴击
  REDUCE_HEAL = 'reduce_heal',           // 降低恢复
  
  // 属性提升类（对自己）
  BOOST_ATTACK = 'boost_attack',         // 提升攻击
  BOOST_DEFENSE = 'boost_defense',       // 提升防御
  BOOST_SPEED = 'boost_speed',           // 提升攻速
  BOOST_CRIT = 'boost_crit',             // 提升暴击
  BOOST_DODGE = 'boost_dodge',           // 提升闪避
  
  // 特殊类
  IGNORE_DEFENSE = 'ignore_defense',     // 无视防御
  IGNORE_DODGE = 'ignore_dodge',         // 无视闪避
  IGNORE_SHIELD = 'ignore_shield',       // 无视护盾
  REFLECT_DAMAGE = 'reflect_damage',     // 反弹伤害
  LIFE_STEAL = 'life_steal',             // 生命偷取
}

// 装备特效
export interface EquipmentEffect {
  id: string;
  type: EffectType;
  trigger: EffectTrigger;
  value: number;                        // 主要数值
  value2?: number;                      // 次要数值（如持续时间、触发概率等）
  duration?: number;                    // 持续时间（秒）
  chance: number;                       // 触发概率（0-1）
  cooldown?: number;                    // 冷却时间（秒）
  condition?: {                         // 触发条件
    type: 'hp_below' | 'hp_above' | 'enemy_hp_below' | 'none';
    value: number;
  };
  description: string;                  // 效果描述
}

// 基础属性
export interface EquipmentStats {
  attack?: number;
  defense?: number;
  hp?: number;
  hit?: number;
  dodge?: number;
  speed?: number;
  crit?: number;
  critDamage?: number;
  penetration?: number;
  trueDamage?: number;
}

// 神话站台装备
export interface MythologyEquipment {
  id: string;
  name: string;
  slot: EquipmentSlot;
  rarity: ItemRarity;
  level: number;                        // 装备等级 1-32
  stationId: string;                    // 所属站台ID
  stationNumber: number;                // 站台编号 1-32
  description: string;
  stats: EquipmentStats;
  effects: EquipmentEffect[];
  setBonus?: {                          // 套装效果
    requiredPieces: number;
    description: string;
    effect: EquipmentEffect;
  };
}

// 玩家装备实例
export interface PlayerEquipment extends MythologyEquipment {
  instanceId: string;                   // 唯一实例ID
  quantity: number;
  equipped: boolean;
  enhanceLevel: number;                 // 强化等级 0-20
  sublimationLevel: number;             // 升华等级
}

// 装备套装效果激活状态
export interface SetBonusStatus {
  setId: string;                        // 套装ID（站台编号）
  equippedCount: number;                // 已装备件数
  activeBonuses: EquipmentEffect[];     // 已激活的效果
}

// 战斗中的装备效果状态
export interface EquipmentBattleState {
  // 护盾
  shield: number;
  maxShield: number;
  
  // 临时增益
  attackBoost: number;
  defenseBoost: number;
  speedBoost: number;
  critBoost: number;
  dodgeBoost: number;
  
  // 敌人减益
  enemyDefenseReduce: number;
  enemyAttackReduce: number;
  enemySpeedReduce: number;
  enemyHitReduce: number;
  
  // 特效冷却
  effectCooldowns: Map<string, number>;
  
  // 叠加层数
  stackableEffects: Map<string, number>; // 效果ID -> 层数
}

// 装备部位名称 - 科幻风格
export const SLOT_NAMES: Record<EquipmentSlot, string> = {
  [EquipmentSlot.HEAD]: '盔',
  [EquipmentSlot.BODY]: '炉',
  [EquipmentSlot.LEGS]: '腿',
  [EquipmentSlot.FEET]: '靴',
  [EquipmentSlot.WEAPON]: '武器',
  [EquipmentSlot.ACCESSORY]: '饰品',
  [EquipmentSlot.SHOULDER]: '盾',
  [EquipmentSlot.ARM]: '臂',
};

// 装备部位图标
export const SLOT_ICONS: Record<EquipmentSlot, string> = {
  [EquipmentSlot.HEAD]: '🪖',
  [EquipmentSlot.BODY]: '🦺',
  [EquipmentSlot.LEGS]: '👖',
  [EquipmentSlot.FEET]: '👢',
  [EquipmentSlot.WEAPON]: '⚔️',
  [EquipmentSlot.ACCESSORY]: '💍',
  [EquipmentSlot.SHOULDER]: '🛡️',
  [EquipmentSlot.ARM]: '💪',
};

// 特效类型名称
export const EFFECT_TYPE_NAMES: Record<EffectType, string> = {
  [EffectType.DAMAGE_BONUS]: '额外伤害',
  [EffectType.DAMAGE_FIXED]: '固定伤害',
  [EffectType.DAMAGE_TRUE]: '真实伤害',
  [EffectType.DAMAGE_SPLASH]: '溅射伤害',
  [EffectType.HEAL_PERCENT]: '生命恢复',
  [EffectType.HEAL_FIXED]: '固定恢复',
  [EffectType.SHIELD_GAIN]: '护盾',
  [EffectType.SHIELD_CONVERT]: '伤害转化',
  [EffectType.REDUCE_DEFENSE]: '破甲',
  [EffectType.REDUCE_ATTACK]: '虚弱',
  [EffectType.REDUCE_SPEED]: '减速',
  [EffectType.REDUCE_HIT]: '致盲',
  [EffectType.REDUCE_CRIT]: '抑制',
  [EffectType.REDUCE_HEAL]: '重伤',
  [EffectType.BOOST_ATTACK]: '攻击提升',
  [EffectType.BOOST_DEFENSE]: '防御提升',
  [EffectType.BOOST_SPEED]: '攻速提升',
  [EffectType.BOOST_CRIT]: '暴击提升',
  [EffectType.BOOST_DODGE]: '闪避提升',
  [EffectType.IGNORE_DEFENSE]: '无视防御',
  [EffectType.IGNORE_DODGE]: '无视闪避',
  [EffectType.IGNORE_SHIELD]: '穿透护盾',
  [EffectType.REFLECT_DAMAGE]: '伤害反弹',
  [EffectType.LIFE_STEAL]: '生命偷取',
};

// 触发时机名称
export const TRIGGER_NAMES: Record<EffectTrigger, string> = {
  [EffectTrigger.ON_BATTLE_START]: '战斗开始',
  [EffectTrigger.ON_ATTACK]: '攻击时',
  [EffectTrigger.ON_HIT]: '命中时',
  [EffectTrigger.ON_DEFEND]: '受击时',
  [EffectTrigger.ON_DODGE]: '闪避时',
  [EffectTrigger.ON_CRIT]: '暴击时',
  [EffectTrigger.ON_KILL]: '击杀时',
  [EffectTrigger.ON_HP_LOW]: '低生命',
  [EffectTrigger.ON_HP_HIGH]: '高生命',
  [EffectTrigger.PASSIVE]: '被动',
};
