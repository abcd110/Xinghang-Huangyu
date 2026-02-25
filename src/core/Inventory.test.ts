import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Inventory } from './Inventory';
import { ItemType, ItemRarity } from '../data/types';
import type { InventoryItem, Item } from '../data/types';
import type { EquipmentInstance } from './EquipmentSystem';
import { EquipmentSlot } from '../data/equipmentTypes';

vi.mock('../data/items', () => ({
  createItem: vi.fn((itemId: string, quantity: number) => {
    const mockItems: Record<string, Item> = {
      'weapon_iron_dagger': {
        id: 'weapon_iron_dagger',
        name: '铁制匕首',
        type: ItemType.WEAPON,
        rarity: ItemRarity.COMMON,
        description: '测试武器',
        attack: 10,
        sublimationLevel: 0,
      },
      'armor_cloth_cap': {
        id: 'armor_cloth_cap',
        name: '布制防尘帽',
        type: ItemType.ARMOR,
        rarity: ItemRarity.COMMON,
        description: '测试防具',
        defense: 5,
        sublimationLevel: 0,
      },
      'consumable_potion': {
        id: 'consumable_potion',
        name: '治疗药水',
        type: ItemType.CONSUMABLE,
        rarity: ItemRarity.COMMON,
        description: '测试消耗品',
        healHp: 50,
        sublimationLevel: 0,
      },
      'mat_001': {
        id: 'mat_001',
        name: '星铁基础构件',
        type: ItemType.MATERIAL,
        rarity: ItemRarity.COMMON,
        description: '测试材料',
        sublimationLevel: 0,
      },
    };

    const template = mockItems[itemId];
    if (!template) return null;

    return {
      ...template,
      quantity,
      equipped: false,
      sublimationLevel: 0,
      sublimationProgress: 0,
      isSublimated: false,
      enhanceLevel: 0,
    } as InventoryItem;
  }),
}));

describe('Inventory', () => {
  let inventory: Inventory;

  beforeEach(() => {
    vi.clearAllMocks();
    inventory = new Inventory();
  });

  describe('构造函数', () => {
    it('应创建空背包', () => {
      expect(inventory.items).toEqual([]);
      expect(inventory.equipment).toEqual([]);
      expect(inventory.maxSlots).toBe(100);
    });

    it('应使用传入的初始物品', () => {
      const initialItems: InventoryItem[] = [{
        id: 'mat_001',
        name: '星铁基础构件',
        type: ItemType.MATERIAL,
        rarity: ItemRarity.COMMON,
        description: '测试',
        quantity: 10,
        equipped: false,
        sublimationLevel: 0,
        sublimationProgress: 0,
        isSublimated: false,
        enhanceLevel: 0,
      }];

      const inv = new Inventory(initialItems);
      expect(inv.items).toHaveLength(1);
      expect(inv.items[0].quantity).toBe(10);
    });

    it('应支持自定义最大槽位数', () => {
      const inv = new Inventory([], [], 50);
      expect(inv.maxSlots).toBe(50);
    });
  });

  describe('槽位管理', () => {
    it('getUsedSlots 应返回正确的已用槽位数', () => {
      inventory.addItem('mat_001', 5);
      inventory.addItem('weapon_iron_dagger', 1);
      expect(inventory.getUsedSlots()).toBe(2);
    });

    it('getRemainingSlots 应返回正确的剩余槽位数', () => {
      const inv = new Inventory([], [], 10);
      inv.addItem('mat_001', 5);
      expect(inv.getRemainingSlots()).toBe(9);
    });

    it('isFull 应正确判断背包是否已满', () => {
      const inv = new Inventory([], [], 2);
      expect(inv.isFull()).toBe(false);

      inv.addItem('mat_001', 1);
      inv.addItem('weapon_iron_dagger', 1);
      expect(inv.isFull()).toBe(true);
    });

    it('setMaxSlots 应更新最大槽位数', () => {
      inventory.setMaxSlots(50);
      expect(inventory.maxSlots).toBe(50);
    });
  });

  describe('addItem', () => {
    it('应成功添加新物品', () => {
      const result = inventory.addItem('mat_001', 5);
      expect(result).toBe(true);
      expect(inventory.items).toHaveLength(1);
      expect(inventory.items[0].quantity).toBe(5);
    });

    it('应堆叠到现有物品', () => {
      inventory.addItem('mat_001', 5);
      const result = inventory.addItem('mat_001', 3);
      expect(result).toBe(true);
      expect(inventory.items).toHaveLength(1);
      expect(inventory.items[0].quantity).toBe(8);
    });

    it('背包满时应返回false', () => {
      const inv = new Inventory([], [], 1);
      inv.addItem('mat_001', 1);
      const result = inv.addItem('weapon_iron_dagger', 1);
      expect(result).toBe(false);
    });

    it('无效物品ID时应返回false', () => {
      const result = inventory.addItem('invalid_item', 1);
      expect(result).toBe(false);
    });

    it('默认数量应为1', () => {
      inventory.addItem('mat_001');
      expect(inventory.items[0].quantity).toBe(1);
    });
  });

  describe('removeItem', () => {
    beforeEach(() => {
      inventory.addItem('mat_001', 10);
    });

    it('应成功移除指定数量', () => {
      const result = inventory.removeItem('mat_001', 3);
      expect(result).toBe(true);
      expect(inventory.items[0].quantity).toBe(7);
    });

    it('移除全部数量时应删除物品', () => {
      const result = inventory.removeItem('mat_001', 10);
      expect(result).toBe(true);
      expect(inventory.items).toHaveLength(0);
    });

    it('移除数量超过现有数量时应删除物品', () => {
      const result = inventory.removeItem('mat_001', 100);
      expect(result).toBe(true);
      expect(inventory.items).toHaveLength(0);
    });

    it('物品不存在时应返回false', () => {
      const result = inventory.removeItem('invalid_item', 1);
      expect(result).toBe(false);
    });

    it('默认移除数量应为1', () => {
      inventory.removeItem('mat_001');
      expect(inventory.items[0].quantity).toBe(9);
    });
  });

  describe('useItem', () => {
    beforeEach(() => {
      inventory.addItem('consumable_potion', 5);
    });

    it('应成功使用消耗品', () => {
      const result = inventory.useItem('consumable_potion');
      expect(result.success).toBe(true);
      expect(result.effects?.healHp).toBe(50);
      expect(inventory.items[0].quantity).toBe(4);
    });

    it('最后一个物品使用后应删除', () => {
      inventory.removeItem('consumable_potion', 4);
      const result = inventory.useItem('consumable_potion');
      expect(result.success).toBe(true);
      expect(inventory.items).toHaveLength(0);
    });

    it('物品不存在应返回失败', () => {
      const result = inventory.useItem('invalid_item');
      expect(result.success).toBe(false);
      expect(result.message).toBe('物品不存在');
    });

    it('非消耗品应返回失败', () => {
      inventory.addItem('weapon_iron_dagger', 1);
      const result = inventory.useItem('weapon_iron_dagger');
      expect(result.success).toBe(false);
      expect(result.message).toBe('该物品无法使用');
    });
  });

  describe('equipItem / unequipItem', () => {
    beforeEach(() => {
      inventory.addItem('weapon_iron_dagger', 1);
    });

    it('应成功装备武器', () => {
      const result = inventory.equipItem('weapon_iron_dagger');
      expect(result.success).toBe(true);
      expect(result.message).toContain('装备了');
      const equipped = inventory.items.find(i => i.id === 'weapon_iron_dagger');
      expect(equipped?.equipped).toBe(true);
    });

    it('装备新武器应卸下旧武器', () => {
      inventory.equipItem('weapon_iron_dagger');
      inventory.addItem('weapon_iron_dagger', 1);
      inventory.items[1].id = 'weapon_iron_dagger_2';
      inventory.items[1].name = '第二把匕首';

      const result = inventory.equipItem('weapon_iron_dagger_2');
      expect(result.success).toBe(true);
    });

    it('非装备类型应返回失败', () => {
      inventory.addItem('mat_001', 1);
      const result = inventory.equipItem('mat_001');
      expect(result.success).toBe(false);
      expect(result.message).toBe('该物品无法装备');
    });

    it('物品不存在应返回失败', () => {
      const result = inventory.equipItem('invalid_item');
      expect(result.success).toBe(false);
      expect(result.message).toBe('物品不存在');
    });

    it('应成功卸下装备', () => {
      inventory.equipItem('weapon_iron_dagger');
      const result = inventory.unequipItem('weapon_iron_dagger');
      expect(result.success).toBe(true);
      const item = inventory.items.find(i => i.id === 'weapon_iron_dagger');
      expect(item?.equipped).toBe(false);
    });

    it('卸下未装备物品应返回失败', () => {
      const result = inventory.unequipItem('weapon_iron_dagger');
      expect(result.success).toBe(false);
      expect(result.message).toBe('物品未装备');
    });
  });

  describe('getEquippedItems', () => {
    it('应返回空的装备槽位', () => {
      const equipped = inventory.getEquippedItems();
      expect(equipped.weapon).toBeNull();
      expect(equipped.head).toBeNull();
      expect(equipped.body).toBeNull();
      expect(equipped.legs).toBeNull();
      expect(equipped.feet).toBeNull();
      expect(equipped.accessory).toBeNull();
    });
  });

  describe('getItemsByType', () => {
    beforeEach(() => {
      inventory.addItem('mat_001', 5);
      inventory.addItem('weapon_iron_dagger', 1);
      inventory.addItem('consumable_potion', 3);
    });

    it('应返回指定类型的物品', () => {
      const materials = inventory.getItemsByType(ItemType.MATERIAL);
      expect(materials).toHaveLength(1);
      expect(materials[0].id).toBe('mat_001');
    });

    it('无匹配类型应返回空数组', () => {
      const accessories = inventory.getItemsByType(ItemType.ACCESSORY);
      expect(accessories).toHaveLength(0);
    });
  });

  describe('getItemCount / hasItem', () => {
    beforeEach(() => {
      inventory.addItem('mat_001', 10);
    });

    it('getItemCount 应返回正确数量', () => {
      expect(inventory.getItemCount('mat_001')).toBe(10);
    });

    it('getItemCount 不存在的物品应返回0', () => {
      expect(inventory.getItemCount('invalid_item')).toBe(0);
    });

    it('hasItem 应正确判断物品存在', () => {
      expect(inventory.hasItem('mat_001')).toBe(true);
      expect(inventory.hasItem('mat_001', 5)).toBe(true);
      expect(inventory.hasItem('mat_001', 15)).toBe(false);
      expect(inventory.hasItem('invalid_item')).toBe(false);
    });
  });

  describe('getMaterials', () => {
    it('应返回材料映射', () => {
      inventory.addItem('mat_001', 10);
      inventory.addItem('weapon_iron_dagger', 1);

      const materials = inventory.getMaterials();
      expect(materials['mat_001']).toBe(10);
      expect(materials['weapon_iron_dagger']).toBeUndefined();
    });
  });

  describe('Equipment 管理', () => {
    const mockEquipment: EquipmentInstance = {
      id: 'mythic_sword',
      name: '神话之剑',
      slot: EquipmentSlot.WEAPON,
      rarity: ItemRarity.MYTHIC,
      level: 1,
      stationId: 'station_1',
      stationNumber: 1,
      description: '测试神话装备',
      stats: {
        attack: 100,
        defense: 0,
        hp: 0,
        speed: 10,
        hit: 0,
        dodge: 0,
        crit: 0.2,
        critDamage: 0.5,
        penetration: 0,
        trueDamage: 0,
      },
      effects: [],
      instanceId: 'equip_001',
      quantity: 1,
      equipped: false,
      enhanceLevel: 0,
      sublimationLevel: 0,
      isCrafted: true,
    };

    it('addEquipment 应成功添加装备', () => {
      const result = inventory.addEquipment(mockEquipment);
      expect(result).toBe(true);
      expect(inventory.equipment).toHaveLength(1);
    });

    it('addEquipment 背包满时应返回false', () => {
      const inv = new Inventory([], [], 0);
      const result = inv.addEquipment(mockEquipment);
      expect(result).toBe(false);
    });

    it('removeEquipment 应成功移除装备', () => {
      inventory.addEquipment(mockEquipment);
      const result = inventory.removeEquipment('equip_001');
      expect(result).toBe(true);
      expect(inventory.equipment).toHaveLength(0);
    });

    it('removeEquipment 装备不存在时应返回false', () => {
      const result = inventory.removeEquipment('invalid_id');
      expect(result).toBe(false);
    });

    it('getEquipment 应返回指定装备', () => {
      inventory.addEquipment(mockEquipment);
      const equip = inventory.getEquipment('equip_001');
      expect(equip?.name).toBe('神话之剑');
    });
  });

  describe('serialize', () => {
    it('应正确序列化背包数据', () => {
      inventory.addItem('mat_001', 5);
      const data = inventory.serialize();
      expect(data.items).toHaveLength(1);
      expect(data.equipment).toEqual([]);
    });
  });
});
