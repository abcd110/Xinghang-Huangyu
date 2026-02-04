import type { InventoryItem } from '../data/types';
import { ItemType, ItemRarity } from '../data/types';
import { EquipmentSlot } from '../data/equipmentTypes';
import { generateEquipment, RARITY_NAMES } from '../data/normalEquipment';
import type { EquipmentInstance } from './EquipmentSystem';
import {
  CRAFTING_RECIPES,
  CraftingRecipe,
  rollCraftingQuality,
  calculateCraftingQuality,
  getMaterialQualityFromId,
  SLOT_CRAFT_NAMES
} from '../data/craftingRecipesNew';
import {
  getMaterial,
  CraftingMaterialType,
  MaterialQuality,
  MATERIAL_QUALITY_NAMES,
  generateMaterialId
} from '../data/craftingMaterials';

// 制造结果
export interface CraftingResult {
  success: boolean;
  message: string;
  item?: InventoryItem;
  equipment?: EquipmentInstance;
  quality?: ItemRarity;
  qualityRates?: Record<ItemRarity, number>;
}

// 材料选择
export interface MaterialSelection {
  baseMaterialQuality: MaterialQuality;
  secondaryMaterialQuality: MaterialQuality;
}

// 制造系统
export class CraftingSystem {
  // 获取所有配方
  getAllRecipes(): CraftingRecipe[] {
    return CRAFTING_RECIPES;
  }

  // 获取指定部位的配方
  getRecipe(slot: EquipmentSlot): CraftingRecipe | undefined {
    return CRAFTING_RECIPES.find(r => r.slot === slot);
  }

  // 检查是否可以制造
  canCraft(
    recipe: CraftingRecipe,
    selection: MaterialSelection,
    inventory: any,
    player: any
  ): { canCraft: boolean; reason: string } {
    // 获取材料ID
    const baseMaterialId = generateMaterialId(recipe.baseMaterialType, selection.baseMaterialQuality);
    const secondaryMaterialId = generateMaterialId(recipe.secondaryMaterialType, selection.secondaryMaterialQuality);

    // 检查基础材料
    const baseMaterial = inventory.getItem(baseMaterialId);
    if (!baseMaterial || baseMaterial.quantity < recipe.baseMaterialCost) {
      const has = baseMaterial?.quantity || 0;
      const name = MATERIAL_QUALITY_NAMES[selection.baseMaterialQuality] +
        (recipe.baseMaterialType === CraftingMaterialType.IRON ? '铁矿碎片' :
          recipe.baseMaterialType === CraftingMaterialType.LEATHER ? '野兽皮革' :
            recipe.baseMaterialType === CraftingMaterialType.CRYSTAL ? '能量水晶' : '材料');
      return { canCraft: false, reason: `${name}不足 (${has}/${recipe.baseMaterialCost})` };
    }

    // 检查次要材料
    const secondaryMaterial = inventory.getItem(secondaryMaterialId);
    if (!secondaryMaterial || secondaryMaterial.quantity < recipe.secondaryMaterialCost) {
      const has = secondaryMaterial?.quantity || 0;
      const name = MATERIAL_QUALITY_NAMES[selection.secondaryMaterialQuality] +
        (recipe.secondaryMaterialType === CraftingMaterialType.CRYSTAL ? '能量水晶' :
          recipe.secondaryMaterialType === CraftingMaterialType.FABRIC ? '粗布纤维' :
            recipe.secondaryMaterialType === CraftingMaterialType.WOOD ? '坚韧木材' :
              recipe.secondaryMaterialType === CraftingMaterialType.ESSENCE ? '怪物精华' : '材料');
      return { canCraft: false, reason: `${name}不足 (${has}/${recipe.secondaryMaterialCost})` };
    }

    return { canCraft: true, reason: '可以制造' };
  }

  // 获取品质概率预览
  getQualityPreview(selection: MaterialSelection): Record<ItemRarity, number> {
    return calculateCraftingQuality(selection.baseMaterialQuality, selection.secondaryMaterialQuality);
  }

  // 制造装备
  craft(
    slot: EquipmentSlot,
    selection: MaterialSelection,
    inventory: any,
    player: any
  ): CraftingResult {
    const recipe = this.getRecipe(slot);
    if (!recipe) {
      return { success: false, message: '配方不存在' };
    }

    // 检查是否可以制造
    const check = this.canCraft(recipe, selection, inventory, player);
    if (!check.canCraft) {
      return { success: false, message: check.reason };
    }

    // 获取材料ID
    const baseMaterialId = generateMaterialId(recipe.baseMaterialType, selection.baseMaterialQuality);
    const secondaryMaterialId = generateMaterialId(recipe.secondaryMaterialType, selection.secondaryMaterialQuality);

    // 消耗材料
    inventory.removeItem(baseMaterialId, recipe.baseMaterialCost);
    inventory.removeItem(secondaryMaterialId, recipe.secondaryMaterialCost);

    // 根据加权平均材料品质决定装备品质（主材料权重2，副材料权重1）
    const rolledQuality = rollCraftingQuality(selection.baseMaterialQuality, selection.secondaryMaterialQuality);
    const qualityRates = calculateCraftingQuality(selection.baseMaterialQuality, selection.secondaryMaterialQuality);

    // 生成装备（固定等级1，品质由材料决定）
    const equipment = generateEquipment(slot, rolledQuality, 1);

    // 将slot映射到ItemType
    let itemType: ItemType;
    switch (slot) {
      case EquipmentSlot.WEAPON:
        itemType = ItemType.WEAPON;
        break;
      case EquipmentSlot.HEAD:
      case EquipmentSlot.BODY:
      case EquipmentSlot.LEGS:
      case EquipmentSlot.FEET:
        itemType = ItemType.ARMOR;
        break;
      case EquipmentSlot.ACCESSORY:
        itemType = ItemType.ACCESSORY;
        break;
      default:
        itemType = ItemType.WEAPON;
    }

    // 创建InventoryItem（普通装备作为普通物品存储）
    const inventoryItem: InventoryItem = {
      id: equipment.id,
      name: equipment.name,
      type: itemType,
      rarity: equipment.rarity,
      description: equipment.description,
      quantity: 1,
      equipped: false,
      enhanceLevel: 0,
      sublimationLevel: 0,
      sublimationProgress: 0,
      isSublimated: false,
      slot: slot, // 记录装备槽位
      // 装备属性
      attack: equipment.baseStats.attack,
      defense: equipment.baseStats.defense,
      maxHp: equipment.baseStats.maxHp,
      speed: equipment.baseStats.speed,
      critRate: equipment.baseStats.critRate,
      critDamage: equipment.baseStats.critDamage,
      dodgeRate: equipment.baseStats.dodgeRate,
      hitRate: equipment.baseStats.hitRate,
    };

    // 直接添加到背包的items数组（因为装备ID不在ITEMS定义中，不能使用addItem）
    inventory.items.push(inventoryItem);

    return {
      success: true,
      message: `成功制造了 [${RARITY_NAMES[rolledQuality]}] ${equipment.name}!`,
      item: inventoryItem,
      quality: rolledQuality,
      qualityRates,
    };
  }

  // 获取材料名称
  getMaterialTypeName(type: CraftingMaterialType): string {
    const names: Record<CraftingMaterialType, string> = {
      [CraftingMaterialType.IRON]: '铁矿碎片',
      [CraftingMaterialType.LEATHER]: '野兽皮革',
      [CraftingMaterialType.FABRIC]: '粗布纤维',
      [CraftingMaterialType.WOOD]: '坚韧木材',
      [CraftingMaterialType.CRYSTAL]: '能量水晶',
      [CraftingMaterialType.ESSENCE]: '怪物精华',
    };
    return names[type] || '未知材料';
  }
}

// 创建全局制造系统实例
export const craftingSystem = new CraftingSystem();

// 导出类型
export type { MaterialSelection };
// 重新导出 CraftingRecipe 类型
export type { CraftingRecipe } from '../data/craftingRecipesNew';
// 重新导出 CRAFTING_RECIPES
export { CRAFTING_RECIPES } from '../data/craftingRecipesNew';
