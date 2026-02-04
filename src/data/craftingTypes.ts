// ============================================
// 制造系统类型定义
// 避免循环导入
// ============================================

export enum RecipeCategory {
  WEAPON = 'weapon',
  ARMOR = 'armor',
  ACCESSORY = 'accessory',
  CONSUMABLE = 'consumable',
  MATERIAL = 'material',
  SPECIAL = 'special',
  EQUIPMENT = 'equipment', // 新装备系统
}

export interface RecipeData {
  id: string;
  name: string;
  description: string;
  category: RecipeCategory;
  resultItemId: string;
  resultQuantity: number;
  materials: Record<string, number>;
  requiredLevel: number;
  requiredWorkbench: string;
  staminaCost: number;
  timeCost: number;
}
