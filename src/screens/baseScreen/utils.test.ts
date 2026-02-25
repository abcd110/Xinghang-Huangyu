import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getMaterialFullName, getItemName, formatCost } from './utils';
import * as itemsModule from '../../data/items';

vi.mock('../../data/items', () => ({
  getItemTemplate: vi.fn(),
}));

const mockGetItemTemplate = vi.mocked(itemsModule.getItemTemplate);

describe('utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getMaterialFullName', () => {
    describe('基础材料名称映射', () => {
      it('应正确返回 mat_001 到 mat_010 的基础名称', () => {
        const expectedNames: Record<string, string> = {
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
        };

        Object.entries(expectedNames).forEach(([id, name]) => {
          expect(getMaterialFullName(id)).toBe(name);
        });
      });

      it('应正确返回矿物材料名称', () => {
        expect(getMaterialFullName('mineral_iron')).toBe('铁矿石');
        expect(getMaterialFullName('mineral_copper')).toBe('铜矿石');
        expect(getMaterialFullName('mineral_titanium')).toBe('钛矿石');
        expect(getMaterialFullName('mineral_crystal')).toBe('水晶矿石');
        expect(getMaterialFullName('mineral_quantum')).toBe('量子矿石');
      });

      it('应正确返回特殊材料名称', () => {
        expect(getMaterialFullName('chip_material')).toBe('芯片材料');
        expect(getMaterialFullName('gene_material')).toBe('基因材料');
        expect(getMaterialFullName('cyber_material')).toBe('义体材料');
        expect(getMaterialFullName('cyber_core')).toBe('赛博核心');
      });
    });

    describe('品质后缀处理', () => {
      it('应正确处理星尘级(_stardust)后缀', () => {
        expect(getMaterialFullName('mat_001_stardust')).toBe('星铁基础构件(星尘级)');
        expect(getMaterialFullName('mat_010_stardust')).toBe('量子紧固组件(星尘级)');
      });

      it('应正确处理合金级(_alloy)后缀', () => {
        expect(getMaterialFullName('mat_001_alloy')).toBe('星铁基础构件(合金级)');
        expect(getMaterialFullName('mat_005_alloy')).toBe('稀土传感基质(合金级)');
      });

      it('应正确处理晶核级(_crystal)后缀', () => {
        expect(getMaterialFullName('mat_001_crystal')).toBe('星铁基础构件(晶核级)');
        expect(getMaterialFullName('mat_003_crystal')).toBe('钛钢外甲坯料(晶核级)');
      });

      it('应正确处理量子级(_quantum)后缀', () => {
        expect(getMaterialFullName('mat_001_quantum')).toBe('星铁基础构件(量子级)');
        expect(getMaterialFullName('mat_006_quantum')).toBe('虚空防护核心(量子级)');
      });

      it('应正确处理虚空级(_void)后缀', () => {
        expect(getMaterialFullName('mat_001_void')).toBe('星铁基础构件(虚空级)');
        expect(getMaterialFullName('mat_004_void')).toBe('战甲能量晶核(虚空级)');
      });

      it('应按正确优先级匹配后缀（虚空 > 量子 > 晶核 > 合金 > 星尘）', () => {
        expect(getMaterialFullName('mat_001_void')).toBe('星铁基础构件(虚空级)');
      });
    });

    describe('边界情况', () => {
      it('应处理空字符串', () => {
        expect(getMaterialFullName('')).toBe('');
      });

      it('应处理未知材料ID', () => {
        expect(getMaterialFullName('unknown_mat')).toBe('unknown_mat');
        expect(getMaterialFullName('random_string')).toBe('random_string');
      });

      it('应处理只有前缀但没有后缀的ID', () => {
        expect(getMaterialFullName('mat_999')).toBe('mat_999');
      });

      it('应处理非mat_开头的带后缀ID', () => {
        expect(getMaterialFullName('other_stardust')).toBe('other_stardust');
      });

      it('应处理特殊字符', () => {
        expect(getMaterialFullName('mat_001@void')).toBe('mat_001@void');
      });

      it('应处理数字ID', () => {
        expect(getMaterialFullName('12345')).toBe('12345');
      });
    });
  });

  describe('getItemName', () => {
    describe('从物品模板获取名称', () => {
      it('应从模板返回武器名称', () => {
        mockGetItemTemplate.mockReturnValue({
          id: 'weapon_iron_dagger',
          name: '铁制匕首',
          type: 'weapon' as const,
          rarity: 'common' as const,
          description: '测试武器',
          sublimationLevel: 0,
        });

        expect(getItemName('weapon_iron_dagger')).toBe('铁制匕首');
        expect(mockGetItemTemplate).toHaveBeenCalledWith('weapon_iron_dagger');
      });

      it('应从模板返回防具名称', () => {
        mockGetItemTemplate.mockReturnValue({
          id: 'armor_cloth_cap',
          name: '布制防尘帽',
          type: 'armor' as const,
          rarity: 'common' as const,
          description: '测试防具',
          sublimationLevel: 0,
        });

        expect(getItemName('armor_cloth_cap')).toBe('布制防尘帽');
      });

      it('应从模板返回消耗品名称', () => {
        mockGetItemTemplate.mockReturnValue({
          id: 'consumable_potion',
          name: '治疗药水',
          type: 'consumable' as const,
          rarity: 'uncommon' as const,
          description: '测试消耗品',
          sublimationLevel: 0,
        });

        expect(getItemName('consumable_potion')).toBe('治疗药水');
      });

      it('应从模板返回材料名称', () => {
        mockGetItemTemplate.mockReturnValue({
          id: 'mat_rusty_scrap',
          name: '锈蚀铁屑',
          type: 'material' as const,
          rarity: 'common' as const,
          description: '测试材料',
          sublimationLevel: 0,
        });

        expect(getItemName('mat_rusty_scrap')).toBe('锈蚀铁屑');
      });
    });

    describe('回退到 getMaterialFullName', () => {
      it('当模板不存在时应回退到 getMaterialFullName', () => {
        mockGetItemTemplate.mockReturnValue(undefined);

        expect(getItemName('mat_001')).toBe('星铁基础构件');
      });

      it('当模板返回null时应回退', () => {
        mockGetItemTemplate.mockReturnValue(undefined);

        expect(getItemName('unknown_item')).toBe('unknown_item');
      });
    });

    describe('模板优先级', () => {
      it('模板名称应优先于 getMaterialFullName', () => {
        mockGetItemTemplate.mockReturnValue({
          id: 'mat_001',
          name: '自定义名称',
          type: 'material' as const,
          rarity: 'common' as const,
          description: '测试',
          sublimationLevel: 0,
        });

        expect(getItemName('mat_001')).toBe('自定义名称');
      });
    });
  });

  describe('formatCost', () => {
    describe('信用点格式化', () => {
      it('应正确格式化正数信用点', () => {
        expect(formatCost({ credits: 100, materials: [] })).toBe('100信用点');
        expect(formatCost({ credits: 1, materials: [] })).toBe('1信用点');
        expect(formatCost({ credits: 999999, materials: [] })).toBe('999999信用点');
      });

      it('应忽略零信用点', () => {
        expect(formatCost({ credits: 0, materials: [] })).toBe('');
      });
    });

    describe('材料格式化', () => {
      it('应正确格式化单个材料', () => {
        mockGetItemTemplate.mockReturnValue(undefined);
        expect(formatCost({ credits: 0, materials: [{ itemId: 'mat_001', count: 5 }] })).toBe('星铁基础构件 x5');
      });

      it('应正确格式化多个材料', () => {
        mockGetItemTemplate.mockReturnValue(undefined);
        const result = formatCost({
          credits: 0,
          materials: [
            { itemId: 'mat_001', count: 5 },
            { itemId: 'mat_002', count: 3 },
          ],
        });
        expect(result).toBe('星铁基础构件 x5 + 星铜传导组件 x3');
      });

      it('应正确格式化大量材料', () => {
        mockGetItemTemplate.mockReturnValue(undefined);
        const result = formatCost({
          credits: 0,
          materials: [
            { itemId: 'mat_001', count: 1 },
            { itemId: 'mat_002', count: 2 },
            { itemId: 'mat_003', count: 3 },
            { itemId: 'mat_004', count: 4 },
          ],
        });
        expect(result).toBe('星铁基础构件 x1 + 星铜传导组件 x2 + 钛钢外甲坯料 x3 + 战甲能量晶核 x4');
      });
    });

    describe('混合格式化', () => {
      it('应正确格式化信用点和材料', () => {
        mockGetItemTemplate.mockReturnValue(undefined);
        const result = formatCost({
          credits: 50,
          materials: [{ itemId: 'mat_001', count: 3 }],
        });
        expect(result).toBe('50信用点 + 星铁基础构件 x3');
      });
    });

    describe('边界情况', () => {
      it('应处理空成本对象', () => {
        expect(formatCost({ credits: 0, materials: [] })).toBe('');
      });

      it('应处理count为0的材料', () => {
        mockGetItemTemplate.mockReturnValue(undefined);
        expect(formatCost({ credits: 0, materials: [{ itemId: 'mat_001', count: 0 }] })).toBe('星铁基础构件 x0');
      });

      it('应忽略负数信用点', () => {
        expect(formatCost({ credits: -100, materials: [] })).toBe('');
      });

      it('应处理使用模板名称的材料', () => {
        mockGetItemTemplate.mockReturnValue({
          id: 'mat_rusty_scrap',
          name: '锈蚀铁屑',
          type: 'material' as const,
          rarity: 'common' as const,
          description: '测试',
          sublimationLevel: 0,
        });

        expect(formatCost({ credits: 0, materials: [{ itemId: 'mat_rusty_scrap', count: 10 }] })).toBe('锈蚀铁屑 x10');
      });
    });

    describe('性能测试', () => {
      it('应高效处理大量材料', () => {
        mockGetItemTemplate.mockReturnValue(undefined);
        const materials = Array.from({ length: 100 }, (_, i) => ({
          itemId: `mat_00${(i % 10) + 1}`,
          count: i + 1,
        }));

        const start = performance.now();
        const result = formatCost({ credits: 1000, materials });
        const end = performance.now();

        expect(result).toBeDefined();
        expect(end - start).toBeLessThan(100);
      });
    });
  });
});
