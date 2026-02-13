export enum GeneType {
  ATTACK = 'attack',
  DEFENSE = 'defense',
  HP = 'hp',
  SPEED = 'speed',
  CRIT_RATE = 'crit_rate',
  CRIT_DAMAGE = 'crit_damage',
}

export enum GeneRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

export interface GeneNode {
  id: string;
  type: GeneType;
  rarity: GeneRarity;
  level: number;
  maxLevel: number;
  baseValue: number;
  currentValue: number;
  unlocked: boolean;
  position: { x: number; y: number };
  prerequisites: string[];
}

export interface GeneNodeData {
  id: string;
  type: GeneType;
  rarity: GeneRarity;
  level: number;
  maxLevel: number;
  baseValue: number;
  currentValue: number;
  unlocked: boolean;
  position: { x: number; y: number };
  prerequisites: string[];
}

export const GENE_TYPE_CONFIG: Record<GeneType, { name: string; color: string; icon: string }> = {
  [GeneType.ATTACK]: { name: '攻击', color: '#ef4444', icon: '⚔️' },
  [GeneType.DEFENSE]: { name: '防御', color: '#3b82f6', icon: '🛡️' },
  [GeneType.HP]: { name: '生命', color: '#22c55e', icon: '❤️' },
  [GeneType.SPEED]: { name: '速度', color: '#f59e0b', icon: '⚡' },
  [GeneType.CRIT_RATE]: { name: '暴击率', color: '#a855f7', icon: '🎯' },
  [GeneType.CRIT_DAMAGE]: { name: '暴击伤害', color: '#ec4899', icon: '💥' },
};

export const GENE_RARITY_CONFIG: Record<GeneRarity, { name: string; color: string; multiplier: number }> = {
  [GeneRarity.COMMON]: { name: '普通', color: '#9ca3af', multiplier: 1 },
  [GeneRarity.UNCOMMON]: { name: '优秀', color: '#22c55e', multiplier: 1.2 },
  [GeneRarity.RARE]: { name: '稀有', color: '#3b82f6', multiplier: 1.5 },
  [GeneRarity.EPIC]: { name: '史诗', color: '#a855f7', multiplier: 2 },
  [GeneRarity.LEGENDARY]: { name: '传说', color: '#f59e0b', multiplier: 3 },
};

export const GENE_TREE: Omit<GeneNode, 'level' | 'currentValue' | 'unlocked'>[] = [
  { id: 'gene_001', type: GeneType.HP, rarity: GeneRarity.COMMON, maxLevel: 10, baseValue: 10, position: { x: 0, y: 0 }, prerequisites: [] },
  { id: 'gene_002', type: GeneType.ATTACK, rarity: GeneRarity.COMMON, maxLevel: 10, baseValue: 2, position: { x: -1, y: 1 }, prerequisites: ['gene_001'] },
  { id: 'gene_003', type: GeneType.DEFENSE, rarity: GeneRarity.COMMON, maxLevel: 10, baseValue: 2, position: { x: 1, y: 1 }, prerequisites: ['gene_001'] },
  { id: 'gene_004', type: GeneType.HP, rarity: GeneRarity.UNCOMMON, maxLevel: 10, baseValue: 15, position: { x: -1, y: 2 }, prerequisites: ['gene_002'] },
  { id: 'gene_005', type: GeneType.SPEED, rarity: GeneRarity.UNCOMMON, maxLevel: 10, baseValue: 1, position: { x: 0, y: 2 }, prerequisites: ['gene_002', 'gene_003'] },
  { id: 'gene_006', type: GeneType.DEFENSE, rarity: GeneRarity.UNCOMMON, maxLevel: 10, baseValue: 3, position: { x: 1, y: 2 }, prerequisites: ['gene_003'] },
  { id: 'gene_007', type: GeneType.ATTACK, rarity: GeneRarity.RARE, maxLevel: 10, baseValue: 4, position: { x: -1, y: 3 }, prerequisites: ['gene_004'] },
  { id: 'gene_008', type: GeneType.CRIT_RATE, rarity: GeneRarity.RARE, maxLevel: 10, baseValue: 1, position: { x: 0, y: 3 }, prerequisites: ['gene_005'] },
  { id: 'gene_009', type: GeneType.HP, rarity: GeneRarity.RARE, maxLevel: 10, baseValue: 25, position: { x: 1, y: 3 }, prerequisites: ['gene_006'] },
  { id: 'gene_010', type: GeneType.CRIT_DAMAGE, rarity: GeneRarity.EPIC, maxLevel: 10, baseValue: 5, position: { x: -0.5, y: 4 }, prerequisites: ['gene_007', 'gene_008'] },
  { id: 'gene_011', type: GeneType.ATTACK, rarity: GeneRarity.EPIC, maxLevel: 10, baseValue: 6, position: { x: 0.5, y: 4 }, prerequisites: ['gene_008', 'gene_009'] },
  { id: 'gene_012', type: GeneType.HP, rarity: GeneRarity.LEGENDARY, maxLevel: 10, baseValue: 50, position: { x: 0, y: 5 }, prerequisites: ['gene_010', 'gene_011'] },
];

export function createGeneNode(template: typeof GENE_TREE[0]): GeneNode {
  return {
    ...template,
    level: 0,
    currentValue: 0,
    unlocked: template.prerequisites.length === 0,
  };
}

export function upgradeGeneNode(node: GeneNode): { success: boolean; newValue: number } {
  if (node.level >= node.maxLevel) {
    return { success: false, newValue: node.currentValue };
  }

  node.level++;
  const rarityConfig = GENE_RARITY_CONFIG[node.rarity];
  node.currentValue = Math.floor(node.baseValue * node.level * rarityConfig.multiplier);

  return { success: true, newValue: node.currentValue };
}

export function getGeneUpgradeCost(node: GeneNode): { credits: number; materials: { itemId: string; count: number } } {
  const rarityIndex = Object.keys(GeneRarity).indexOf(node.rarity);
  const baseCost = 200 * (rarityIndex + 1);

  return {
    credits: baseCost * (node.level + 1),
    materials: {
      itemId: 'gene_material',
      count: node.level + 1,
    },
  };
}

export function getGeneTotalStats(nodes: GeneNode[]): Record<GeneType, number> {
  const stats: Record<GeneType, number> = {
    [GeneType.ATTACK]: 0,
    [GeneType.DEFENSE]: 0,
    [GeneType.HP]: 0,
    [GeneType.SPEED]: 0,
    [GeneType.CRIT_RATE]: 0,
    [GeneType.CRIT_DAMAGE]: 0,
  };

  nodes.forEach(node => {
    if (node.unlocked && node.level > 0) {
      stats[node.type] += node.currentValue;
    }
  });

  return stats;
}

export function serializeGeneNode(node: GeneNode): GeneNodeData {
  return { ...node };
}

export function deserializeGeneNode(data: GeneNodeData): GeneNode {
  return { ...data };
}
