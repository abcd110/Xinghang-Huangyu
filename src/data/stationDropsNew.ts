// ============================================
// 新站台掉落系统 - 基于6种材料
// ============================================

import { MaterialDropConfig, STATION_MATERIAL_DROPS } from './craftingMaterials';

// 站台掉落配置（使用新的材料系统）
export const NEW_STATION_MATERIAL_DROPS: Record<number, MaterialDropConfig[]> = {
  // 站台1-4：基础材料
  1: [
    { materialId: 'craft_iron', minQuantity: 2, maxQuantity: 3, dropRate: 1.0 },
    { materialId: 'craft_leather', minQuantity: 1, maxQuantity: 2, dropRate: 0.6 },
    { materialId: 'craft_fabric', minQuantity: 1, maxQuantity: 1, dropRate: 0.4 },
  ],
  2: [
    { materialId: 'craft_leather', minQuantity: 2, maxQuantity: 3, dropRate: 1.0 },
    { materialId: 'craft_fabric', minQuantity: 1, maxQuantity: 2, dropRate: 0.6 },
    { materialId: 'craft_wood', minQuantity: 1, maxQuantity: 1, dropRate: 0.4 },
  ],
  3: [
    { materialId: 'craft_fabric', minQuantity: 2, maxQuantity: 3, dropRate: 1.0 },
    { materialId: 'craft_wood', minQuantity: 1, maxQuantity: 2, dropRate: 0.6 },
    { materialId: 'craft_iron', minQuantity: 1, maxQuantity: 1, dropRate: 0.4 },
  ],
  4: [
    { materialId: 'craft_wood', minQuantity: 2, maxQuantity: 3, dropRate: 1.0 },
    { materialId: 'craft_iron', minQuantity: 1, maxQuantity: 2, dropRate: 0.6 },
    { materialId: 'craft_leather', minQuantity: 1, maxQuantity: 1, dropRate: 0.4 },
  ],
  // 站台5-8：进阶材料
  5: [
    { materialId: 'craft_iron', minQuantity: 3, maxQuantity: 4, dropRate: 1.0 },
    { materialId: 'craft_crystal', minQuantity: 1, maxQuantity: 1, dropRate: 0.5 },
    { materialId: 'craft_essence', minQuantity: 1, maxQuantity: 1, dropRate: 0.3 },
    { materialId: 'craft_goodiron', minQuantity: 1, maxQuantity: 1, dropRate: 0.3 },
    { materialId: 'craft_goodleather', minQuantity: 1, maxQuantity: 1, dropRate: 0.2 },
  ],
  6: [
    { materialId: 'craft_leather', minQuantity: 3, maxQuantity: 4, dropRate: 1.0 },
    { materialId: 'craft_crystal', minQuantity: 1, maxQuantity: 1, dropRate: 0.5 },
    { materialId: 'craft_essence', minQuantity: 1, maxQuantity: 1, dropRate: 0.3 },
    { materialId: 'craft_goodleather', minQuantity: 1, maxQuantity: 1, dropRate: 0.3 },
    { materialId: 'craft_goodfabric', minQuantity: 1, maxQuantity: 1, dropRate: 0.2 },
  ],
  7: [
    { materialId: 'craft_fabric', minQuantity: 3, maxQuantity: 4, dropRate: 1.0 },
    { materialId: 'craft_crystal', minQuantity: 1, maxQuantity: 2, dropRate: 0.6 },
    { materialId: 'craft_essence', minQuantity: 1, maxQuantity: 1, dropRate: 0.3 },
    { materialId: 'craft_goodfabric', minQuantity: 1, maxQuantity: 1, dropRate: 0.3 },
    { materialId: 'craft_goodwood', minQuantity: 1, maxQuantity: 1, dropRate: 0.2 },
  ],
  8: [
    { materialId: 'craft_wood', minQuantity: 3, maxQuantity: 4, dropRate: 1.0 },
    { materialId: 'craft_crystal', minQuantity: 1, maxQuantity: 2, dropRate: 0.6 },
    { materialId: 'craft_essence', minQuantity: 1, maxQuantity: 1, dropRate: 0.3 },
    { materialId: 'craft_goodwood', minQuantity: 1, maxQuantity: 1, dropRate: 0.3 },
    { materialId: 'craft_goodiron', minQuantity: 1, maxQuantity: 1, dropRate: 0.2 },
  ],
  // 站台9-10：高级材料
  9: [
    { materialId: 'craft_crystal', minQuantity: 2, maxQuantity: 3, dropRate: 1.0 },
    { materialId: 'craft_essence', minQuantity: 1, maxQuantity: 2, dropRate: 0.6 },
    { materialId: 'craft_goodcrystal', minQuantity: 1, maxQuantity: 1, dropRate: 0.3 },
    { materialId: 'craft_fineiron', minQuantity: 1, maxQuantity: 1, dropRate: 0.15 },
    { materialId: 'craft_fineleather', minQuantity: 1, maxQuantity: 1, dropRate: 0.1 },
  ],
  10: [
    { materialId: 'craft_crystal', minQuantity: 3, maxQuantity: 4, dropRate: 1.0 },
    { materialId: 'craft_essence', minQuantity: 2, maxQuantity: 3, dropRate: 0.7 },
    { materialId: 'craft_goodessence', minQuantity: 1, maxQuantity: 2, dropRate: 0.4 },
    { materialId: 'craft_finecrystal', minQuantity: 1, maxQuantity: 1, dropRate: 0.2 },
    { materialId: 'craft_rareiron', minQuantity: 1, maxQuantity: 1, dropRate: 0.05 },
    { materialId: 'craft_rarecrystal', minQuantity: 1, maxQuantity: 1, dropRate: 0.03 },
  ],
};

// 生成站台掉落
export function generateStationDrops(stationNumber: number): Record<string, number> {
  const drops: Record<string, number> = {};
  const dropTable = NEW_STATION_MATERIAL_DROPS[stationNumber] || [];
  
  dropTable.forEach(config => {
    if (Math.random() < config.dropRate) {
      const quantity = Math.floor(Math.random() * (config.maxQuantity - config.minQuantity + 1)) + config.minQuantity;
      if (quantity > 0) {
        drops[config.materialId] = (drops[config.materialId] || 0) + quantity;
      }
    }
  });
  
  return drops;
}

// 获取站台掉落预览
export function getStationDropPreview(stationNumber: number): { materialId: string; name: string; probability: number }[] {
  const dropTable = NEW_STATION_MATERIAL_DROPS[stationNumber] || [];
  const { getMaterialById } = require('./craftingMaterials');
  
  return dropTable.map(config => {
    const material = getMaterialById(config.materialId);
    return {
      materialId: config.materialId,
      name: material?.name || config.materialId,
      probability: config.dropRate,
    };
  });
}
