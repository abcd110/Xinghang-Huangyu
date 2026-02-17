import { getItemTemplate } from '../../data/items';

const MATERIAL_BASE_NAMES: Record<string, string> = {
  'mat_001': '星铁基础构件',
  'mat_002': '星铜传导组件',
  'mat_003': '钛钢外甲坯料',
  'mat_004': '战甲能量晶核',
  'mat_005': '稀土传感基质',
  'mat_006': '虚空防护核心',
  'mat_007': '推进模块燃料',
  'mat_008': '纳米韧化纤维',
  'mat_009': '陨铁缓冲衬垫',
  'mat_010': '量子紧固组件',
  'mineral_iron': '铁矿石',
  'mineral_copper': '铜矿石',
  'mineral_titanium': '钛矿石',
  'mineral_crystal': '水晶矿石',
  'mineral_quantum': '量子矿石',
  'chip_material': '芯片材料',
  'gene_material': '基因材料',
  'cyber_material': '义体材料',
  'cyber_core': '赛博核心',
};

const QUALITY_SUFFIX_NAMES: Record<string, string> = {
  '_stardust': '星尘级',
  '_alloy': '合金级',
  '_crystal': '晶核级',
  '_quantum': '量子级',
  '_void': '虚空级',
};

export function getMaterialFullName(itemId: string): string {
  if (MATERIAL_BASE_NAMES[itemId]) {
    return MATERIAL_BASE_NAMES[itemId];
  }

  const qualityOrder = ['_void', '_quantum', '_crystal', '_alloy', '_stardust'] as const;
  let baseId = itemId;
  let quality = '';

  if (itemId.startsWith('mat_')) {
    for (const suffix of qualityOrder) {
      if (itemId.endsWith(suffix)) {
        baseId = itemId.replace(new RegExp(suffix + '$'), '');
        quality = suffix;
        break;
      }
    }
  }

  const baseName = MATERIAL_BASE_NAMES[baseId] || baseId;

  if (quality) {
    const qualityName = QUALITY_SUFFIX_NAMES[quality] || '';
    return qualityName ? `${baseName}(${qualityName})` : baseName;
  }

  return baseName;
}

export function getItemName(itemId: string): string {
  const template = getItemTemplate(itemId);
  if (template) {
    return template.name;
  }
  return getMaterialFullName(itemId);
}

export function formatCost(cost: { credits: number; materials: { itemId: string; count: number }[] }): string {
  const parts: string[] = [];
  if (cost.credits > 0) {
    parts.push(`${cost.credits}信用点`);
  }
  cost.materials.forEach(mat => {
    const materialName = getItemName(mat.itemId);
    parts.push(`${materialName} x${mat.count}`);
  });
  return parts.join(' + ');
}
