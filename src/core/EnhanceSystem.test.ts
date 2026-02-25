import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  EnhanceSystem,
  EnhanceResultType,
  ENHANCE_SUCCESS_RATES,
  ENHANCE_STONE_COST,
  MAX_ENHANCE_LEVEL,
  ENHANCE_STONE_ID,
  getEnhanceConfig,
  calculateEnhanceRate,
  calculateStoneCost,
  canEnhance,
  getSuccessRate,
  getEnhanceLevelColor,
  getEnhanceLevelText,
} from './EnhanceSystem';
import { Inventory } from './Inventory';
import { Player } from './Player';
import { ItemRarity } from '../data/types';
import { EquipmentSlot } from '../data/equipmentTypes';
import type { EquipmentInstance } from './EquipmentSystem';

vi.mock('./Inventory');
vi.mock('./Player');

const createMockEquipment = (enhanceLevel: number = 0): EquipmentInstance => ({
  id: 'test_sword',
  name: '测试之剑',
  slot: EquipmentSlot.WEAPON,
  rarity: ItemRarity.RARE,
  level: 1,
  stationId: 'test_station',
  stationNumber: 1,
  description: '测试装备',
  stats: {
    attack: 100,
    defense: 50,
    hp: 0,
    speed: 10,
    hit: 0,
    dodge: 0,
    crit: 0,
    critDamage: 0,
    penetration: 0,
    trueDamage: 0,
  },
  effects: [],
  instanceId: 'test_instance_001',
  quantity: 1,
  equipped: false,
  enhanceLevel,
  sublimationLevel: 0,
  isCrafted: true,
  attack: 100,
  defense: 50,
  speed: 10,
});

describe('EnhanceSystem 配置函数', () => {
  describe('getEnhanceConfig', () => {
    it('应返回有效的强化配置', () => {
      const config = getEnhanceConfig(0);
      expect(config).not.toBeNull();
      expect(config?.level).toBe(0);
      expect(config?.successRate).toBe(1);
      expect(config?.stoneCost).toBe(1);
    });

    it('超出范围应返回null', () => {
      const config = getEnhanceConfig(100);
      expect(config).toBeNull();
    });

    it('负数等级应返回null', () => {
      const config = getEnhanceConfig(-1);
      expect(config).toBeNull();
    });
  });

  describe('calculateEnhanceRate', () => {
    it('应返回正确的成功率', () => {
      expect(calculateEnhanceRate(0)).toBe(1);
      expect(calculateEnhanceRate(1)).toBe(0.95);
      expect(calculateEnhanceRate(10)).toBe(0.5);
    });

    it('无效等级应返回0', () => {
      expect(calculateEnhanceRate(100)).toBe(0);
    });
  });

  describe('calculateStoneCost', () => {
    it('应返回正确的强化石消耗', () => {
      expect(calculateStoneCost(0)).toBe(1);
      expect(calculateStoneCost(5)).toBe(3);
      expect(calculateStoneCost(19)).toBe(10);
    });

    it('无效等级应返回0', () => {
      expect(calculateStoneCost(100)).toBe(0);
    });
  });

  describe('canEnhance', () => {
    it('未满级装备应返回true', () => {
      expect(canEnhance({ enhanceLevel: 0 })).toBe(true);
      expect(canEnhance({ enhanceLevel: 19 })).toBe(true);
    });

    it('满级装备应返回false', () => {
      expect(canEnhance({ enhanceLevel: MAX_ENHANCE_LEVEL })).toBe(false);
      expect(canEnhance({ enhanceLevel: 25 })).toBe(false);
    });

    it('无enhanceLevel属性应视为0级', () => {
      expect(canEnhance({})).toBe(true);
    });
  });

  describe('getSuccessRate', () => {
    it('应与calculateEnhanceRate结果一致', () => {
      for (let i = 0; i < 20; i++) {
        expect(getSuccessRate(i)).toBe(calculateEnhanceRate(i));
      }
    });
  });

  describe('getEnhanceLevelColor', () => {
    it('应返回正确的颜色', () => {
      expect(getEnhanceLevelColor(0)).toBe('#00ff00');
      expect(getEnhanceLevelColor(3)).toBe('#00ccff');
      expect(getEnhanceLevelColor(7)).toBe('#ffcc00');
      expect(getEnhanceLevelColor(10)).toBe('#ff6600');
      expect(getEnhanceLevelColor(15)).toBe('#ff0000');
    });
  });

  describe('getEnhanceLevelText', () => {
    it('应返回正确的文本', () => {
      expect(getEnhanceLevelText(0)).toBe('');
      expect(getEnhanceLevelText(1)).toBe('+1');
      expect(getEnhanceLevelText(15)).toBe('+15');
    });

    it('负数应返回空字符串', () => {
      expect(getEnhanceLevelText(-1)).toBe('');
    });
  });
});

describe('EnhanceSystem 类', () => {
  let enhanceSystem: EnhanceSystem;
  let mockInventory: vi.Mocked<Inventory>;
  let mockPlayer: vi.Mocked<Player>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockInventory = {
      getItem: vi.fn(),
      removeItem: vi.fn(),
      addItem: vi.fn(),
    } as unknown as vi.Mocked<Inventory>;

    mockPlayer = {} as vi.Mocked<Player>;

    enhanceSystem = new EnhanceSystem(mockInventory, mockPlayer);
  });

  describe('getEnhancePreview', () => {
    it('应返回正确的预览信息', () => {
      const equipment = createMockEquipment(0);
      mockInventory.getItem.mockReturnValue({
        id: ENHANCE_STONE_ID,
        quantity: 10,
      } as any);

      const preview = enhanceSystem.getEnhancePreview(equipment);

      expect(preview.canEnhance).toBe(true);
      expect(preview.currentLevel).toBe(0);
      expect(preview.targetLevel).toBe(1);
      expect(preview.successRate).toBe(1);
      expect(preview.stoneCost).toBe(1);
      expect(preview.hasEnoughStones).toBe(true);
    });

    it('强化石不足时应返回canEnhance=false', () => {
      const equipment = createMockEquipment(5);
      mockInventory.getItem.mockReturnValue({
        id: ENHANCE_STONE_ID,
        quantity: 1,
      } as any);

      const preview = enhanceSystem.getEnhancePreview(equipment);

      expect(preview.canEnhance).toBe(false);
      expect(preview.reason).toBe('强化石不足');
      expect(preview.hasEnoughStones).toBe(false);
    });

    it('满级装备应返回失败预览', () => {
      const equipment = createMockEquipment(MAX_ENHANCE_LEVEL);
      mockInventory.getItem.mockReturnValue({ quantity: 10 } as any);

      const preview = enhanceSystem.getEnhancePreview(equipment);

      expect(preview.canEnhance).toBe(false);
      expect(preview.reason).toBe('已达到最大强化等级');
    });

    it('应正确计算属性预览', () => {
      const equipment = createMockEquipment(0);
      mockInventory.getItem.mockReturnValue({ quantity: 10 } as any);

      const preview = enhanceSystem.getEnhancePreview(equipment);

      expect(preview.attributePreview.attack.current).toBe(100);
      expect(preview.attributePreview.attack.after).toBeGreaterThan(100);
    });
  });

  describe('enhance', () => {
    it('无法强化时应返回失败', () => {
      const equipment = createMockEquipment(MAX_ENHANCE_LEVEL);
      mockInventory.getItem.mockReturnValue({ quantity: 10 } as any);

      const result = enhanceSystem.enhance(equipment);

      expect(result.success).toBe(false);
      expect(result.type).toBe(EnhanceResultType.FAILURE);
    });

    it('应消耗强化石', () => {
      const equipment = createMockEquipment(0);
      mockInventory.getItem.mockReturnValue({ quantity: 10 } as any);

      enhanceSystem.enhance(equipment);

      expect(mockInventory.removeItem).toHaveBeenCalledWith(ENHANCE_STONE_ID, 1);
    });

    describe('强化成功', () => {
      it('应提升装备等级和属性', () => {
        const equipment = createMockEquipment(0);
        mockInventory.getItem.mockReturnValue({ quantity: 10 } as any);

        vi.spyOn(Math, 'random').mockReturnValue(0);

        const result = enhanceSystem.enhance(equipment);

        expect(result.success).toBe(true);
        expect(result.type).toBe(EnhanceResultType.SUCCESS);
        expect(result.currentLevel).toBe(1);
        expect(result.attributeGains).toBeDefined();
      });
    });

    describe('强化失败', () => {
      it('+5以下失败不应降级', () => {
        const equipment = createMockEquipment(3);
        mockInventory.getItem.mockReturnValue({ quantity: 10 } as any);

        vi.spyOn(Math, 'random').mockReturnValue(1);

        const result = enhanceSystem.enhance(equipment);

        expect(result.success).toBe(false);
        expect(result.type).toBe(EnhanceResultType.FAILURE);
        expect(result.currentLevel).toBe(3);
      });

      it('+5以上失败应降级', () => {
        const equipment = createMockEquipment(7);
        mockInventory.getItem.mockReturnValue({ quantity: 10 } as any);

        vi.spyOn(Math, 'random').mockReturnValue(1);

        const result = enhanceSystem.enhance(equipment);

        expect(result.success).toBe(false);
        expect(result.type).toBe(EnhanceResultType.FAILURE_DOWNGRADE);
        expect(result.currentLevel).toBe(6);
      });

      it('使用保护符不应降级', () => {
        const equipment = createMockEquipment(7);
        mockInventory.getItem.mockReturnValue({ quantity: 10 } as any);

        vi.spyOn(Math, 'random').mockReturnValue(1);

        const result = enhanceSystem.enhance(equipment, true);

        expect(result.success).toBe(false);
        expect(result.type).toBe(EnhanceResultType.FAILURE);
        expect(result.currentLevel).toBe(7);
        expect(result.usedProtection).toBe(true);
      });
    });
  });
});

describe('强化配置常量', () => {
  it('ENHANCE_SUCCESS_RATES 应有20个等级', () => {
    expect(ENHANCE_SUCCESS_RATES).toHaveLength(20);
  });

  it('ENHANCE_STONE_COST 应有20个等级', () => {
    expect(ENHANCE_STONE_COST).toHaveLength(20);
  });

  it('MAX_ENHANCE_LEVEL 应为20', () => {
    expect(MAX_ENHANCE_LEVEL).toBe(20);
  });

  it('成功率应递减', () => {
    for (let i = 1; i < ENHANCE_SUCCESS_RATES.length; i++) {
      expect(ENHANCE_SUCCESS_RATES[i]).toBeLessThanOrEqual(ENHANCE_SUCCESS_RATES[i - 1]);
    }
  });

  it('强化石消耗应递增或持平', () => {
    for (let i = 1; i < ENHANCE_STONE_COST.length; i++) {
      expect(ENHANCE_STONE_COST[i]).toBeGreaterThanOrEqual(ENHANCE_STONE_COST[i - 1]);
    }
  });
});
