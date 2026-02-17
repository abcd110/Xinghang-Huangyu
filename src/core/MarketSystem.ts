export enum MarketItemType {
  MATERIAL = 'material',
  EQUIPMENT = 'equipment',
  CONSUMABLE = 'consumable',
  SPECIAL = 'special',
}

export enum MarketRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

export interface MarketListing {
  id: string;
  itemId: string;
  itemName: string;
  itemType: MarketItemType;
  rarity: MarketRarity;
  quantity: number;
  price: number;
  seller: string;
  expiresAt: number;
  listedAt: number;
}

export interface PlayerListing extends MarketListing {
  status: 'active' | 'sold' | 'expired';
}

export interface MarketTransaction {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  price: number;
  type: 'buy' | 'sell';
  timestamp: number;
}

export const MARKET_ITEM_TYPE_CONFIG: Record<MarketItemType, { name: string; icon: string; color: string }> = {
  [MarketItemType.MATERIAL]: { name: '材料', icon: '📦', color: '#22c55e' },
  [MarketItemType.EQUIPMENT]: { name: '装备', icon: '⚔️', color: '#3b82f6' },
  [MarketItemType.CONSUMABLE]: { name: '消耗品', icon: '🧪', color: '#f59e0b' },
  [MarketItemType.SPECIAL]: { name: '特殊物品', icon: '✨', color: '#a855f7' },
};

export const MARKET_RARITY_CONFIG: Record<MarketRarity, { name: string; color: string }> = {
  [MarketRarity.COMMON]: { name: '普通', color: '#9ca3af' },
  [MarketRarity.UNCOMMON]: { name: '优秀', color: '#22c55e' },
  [MarketRarity.RARE]: { name: '稀有', color: '#3b82f6' },
  [MarketRarity.EPIC]: { name: '史诗', color: '#a855f7' },
  [MarketRarity.LEGENDARY]: { name: '传说', color: '#f59e0b' },
};

export const MARKET_TAX_RATE = 0.05;

export const MARKET_LISTING_DURATION = 24 * 60 * 60 * 1000;

export const MARKET_MAX_LISTINGS = 10;

export function generateMarketId(): string {
  return `market_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function createMarketListing(
  itemId: string,
  itemName: string,
  itemType: MarketItemType,
  rarity: MarketRarity,
  quantity: number,
  price: number,
  seller: string
): MarketListing {
  const now = Date.now();
  return {
    id: generateMarketId(),
    itemId,
    itemName,
    itemType,
    rarity,
    quantity,
    price,
    seller,
    expiresAt: now + MARKET_LISTING_DURATION,
    listedAt: now,
  };
}

export function isListingExpired(listing: MarketListing): boolean {
  return Date.now() > listing.expiresAt;
}

export function calculateTax(price: number): number {
  return Math.floor(price * MARKET_TAX_RATE);
}

export function calculateFinalPrice(price: number): number {
  return price - calculateTax(price);
}

export const SYSTEM_LISTINGS: Omit<MarketListing, 'id' | 'expiresAt' | 'listedAt'>[] = [
  {
    itemId: 'recruit_ticket_normal',
    itemName: '普通招募票',
    itemType: MarketItemType.SPECIAL,
    rarity: MarketRarity.RARE,
    quantity: 1,
    price: 500,
    seller: '系统商店',
  },
  {
    itemId: 'recruit_ticket_limited',
    itemName: '限定招募票',
    itemType: MarketItemType.SPECIAL,
    rarity: MarketRarity.EPIC,
    quantity: 1,
    price: 2000,
    seller: '系统商店',
  },
  {
    itemId: 'gene_material',
    itemName: '基因材料',
    itemType: MarketItemType.MATERIAL,
    rarity: MarketRarity.RARE,
    quantity: 5,
    price: 800,
    seller: '系统商店',
  },
  {
    itemId: 'cyber_material',
    itemName: '义体材料',
    itemType: MarketItemType.MATERIAL,
    rarity: MarketRarity.RARE,
    quantity: 5,
    price: 1000,
    seller: '系统商店',
  },
  {
    itemId: 'cyber_core',
    itemName: '神经核心',
    itemType: MarketItemType.MATERIAL,
    rarity: MarketRarity.EPIC,
    quantity: 1,
    price: 3000,
    seller: '系统商店',
  },
  {
    itemId: 'mineral_titanium',
    itemName: '钛矿',
    itemType: MarketItemType.MATERIAL,
    rarity: MarketRarity.RARE,
    quantity: 10,
    price: 600,
    seller: '系统商店',
  },
  {
    itemId: 'mineral_crystal',
    itemName: '晶核矿',
    itemType: MarketItemType.MATERIAL,
    rarity: MarketRarity.EPIC,
    quantity: 5,
    price: 1500,
    seller: '系统商店',
  },
  {
    itemId: 'mineral_quantum',
    itemName: '量子矿',
    itemType: MarketItemType.MATERIAL,
    rarity: MarketRarity.LEGENDARY,
    quantity: 1,
    price: 5000,
    seller: '系统商店',
  },
];

export function generateSystemListings(): MarketListing[] {
  const now = Date.now();
  return SYSTEM_LISTINGS.map(listing => ({
    ...listing,
    id: generateMarketId(),
    expiresAt: now + MARKET_LISTING_DURATION,
    listedAt: now,
  }));
}

export function serializeMarketListing(listing: MarketListing): MarketListing {
  return { ...listing };
}

export function deserializeMarketListing(data: MarketListing): MarketListing {
  return { ...data };
}

export function serializePlayerListing(listing: PlayerListing): PlayerListing {
  return { ...listing };
}

export function deserializePlayerListing(data: PlayerListing): PlayerListing {
  return { ...data };
}

export function serializeMarketTransaction(transaction: MarketTransaction): MarketTransaction {
  return { ...transaction };
}

export function deserializeMarketTransaction(data: MarketTransaction): MarketTransaction {
  return { ...data };
}
