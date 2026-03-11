// 《星航荒宇》数据模块索引
// 统一导出所有系统的数据模块

// ==================== 类型定义 ====================
export * from './types_new';

// ==================== 势力系统 ====================
export {
  FACTIONS,
  getFaction,
  getAllFactions,
  calculateFactionStatus,
  getFactionStatusName,
  getFactionName,
  createInitialReputations,
  modifyReputation,
  getReputation,
  getReputationStatus,
  FACTION_INTERACTION_EFFECTS,
  executeFactionInteraction,
  getShopDiscount,
  getMaxShopItemLevel,
  FactionInteractionType,
} from './factions';

// ==================== 原有系统兼容导出 ====================
export {
  ItemType,
  ItemRarity,
  EquipmentEffectType,
  EffectTrigger,
} from './types';
