export interface ShopItemData {
  itemId: string;
  name: string;
  price: number;
  dailyLimit: number;
  stock: number;
}

export class ShopItem {
  itemId: string;
  name: string;
  price: number;
  dailyLimit: number;
  stock: number;

  constructor(data: Partial<ShopItemData>) {
    this.itemId = data.itemId || '';
    this.name = data.name || '';
    this.price = data.price || 0;
    this.dailyLimit = data.dailyLimit || 0;
    this.stock = data.stock ?? data.dailyLimit ?? 0;
  }

  serialize(): ShopItemData {
    return {
      itemId: this.itemId,
      name: this.name,
      price: this.price,
      dailyLimit: this.dailyLimit,
      stock: this.stock,
    };
  }

  static fromDict(data: ShopItemData): ShopItem {
    return new ShopItem(data);
  }
}

// 商店商品配置
export const SHOP_ITEMS: ShopItemData[] = [
  {
    itemId: 'consumable_food',
    name: '食物',
    price: 1,
    dailyLimit: 999,
    stock: 999,
  },
  {
    itemId: 'consumable_water',
    name: '水',
    price: 1,
    dailyLimit: 999,
    stock: 999,
  },
];
