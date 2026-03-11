# 重复代码重构计划

## 概述

经过详细验证，发现项目中存在大量重复代码。本计划将逐一分析每个重复项是否真的可以安全合并，并提供具体的重构步骤。

***

## 一、基因系统重复分析

### 1.1 GeneSystem.ts vs GeneSystemV2.ts

**结论：❌ 不能简单合并 - 两个文件是不同版本的实现**

| 对比项   | GeneSystem.ts  | GeneSystemV2.ts                    |
| ----- | -------------- | ---------------------------------- |
| 使用情况  | 仅测试文件引用        | GameManager和GeneContent使用          |
| 架构    | 单序列模式          | 多染色体模式                             |
| 核心结构  | `GeneSequence` | `GeneSystemState` + `Chromosome[]` |
| 功能复杂度 | 基础版            | 高级版（含递减收益、染色体加成等）                  |

**实际使用情况：**

* `GeneSystemV2.ts`：被 `GameManager.ts` 和 `GeneContent.tsx` 使用 ✅ **生产代码**

* `GeneSystem.ts`：仅被 `GeneSystem.test.ts` 使用 ⚠️ **仅测试使用**

**重构建议：**

1. **保留** `GeneSystemV2.ts` 作为生产版本
2. **删除** `GeneSystem.ts`
3. 更新测试文件 `GeneSystem.test.ts` 改为测试 `GeneSystemV2.ts`

**风险评估：低风险** - 只需修改测试文件

***

## 二、类型定义重复分析

### 2.1 types.ts vs types\_new\.ts

**结论：⚠️ 部分可合并 - 需要仔细处理**

**使用情况统计：**

* `types.ts`：被 **38处** 引用 ✅ **主要使用**

* `types_new.ts`：被 **5处** 引用（SpaceshipModuleScreen, Spaceship.ts, spaceshipModules.ts, factions.ts, data/index.ts）

**重复项分析：**

| 类型                    | types.ts | types\_new\.ts | 是否相同    | 建议          |
| --------------------- | -------- | -------------- | ------- | ----------- |
| `ItemType`            | ✅        | ✅              | 完全相同    | 合并到types.ts |
| `ItemRarity`          | ✅        | ✅              | 完全相同    | 合并到types.ts |
| `EquipmentEffectType` | ✅        | ✅              | 完全相同    | 合并到types.ts |
| `EffectTrigger`       | ✅        | ✅              | **不同**  | 保留两个版本      |
| `Item`                | ✅        | ✅              | 结构相似    | 合并到types.ts |
| `Enemy`               | ✅        | ✅              | 结构相似    | 合并到types.ts |
| `EnemyTier`           | ✅        | ✅              | **值不同** | 需要确认使用场景    |

**重构步骤：**

1. 将 `types_new.ts` 中独有的类型（如 `ModuleSlot`, `Faction` 等）移动到 `types.ts`
2. 更新引用 `types_new.ts` 的5个文件改为引用 `types.ts`
3. 删除 `types_new.ts`

**风险评估：中等风险** - 需要更新5个文件的导入

***

## 三、常量重复分析

### 3.1 RARITY\_COLORS（稀有度颜色）

**结论：⚠️ 不能简单合并 - 颜色值不同**

| 文件                    | 颜色值示例                           |
| --------------------- | ------------------------------- |
| types.ts              | `#22c55e`, `#3b82f6`, `#a855f7` |
| SublimationScreen.tsx | `#4ade80`, `#60a5fa`, `#c084fc` |
| InventoryScreen.tsx   | `#4ade80`, `#60a5fa`, `#c084fc` |

**问题：** 不同屏幕使用了不同的颜色主题，这是**有意为之的设计**，不是错误。

**重构建议：**

1. 保留 `types.ts` 中的 `RARITY_COLORS` 作为默认值
2. 在需要不同配色的屏幕中，创建局部常量（如 `RARITY_COLORS_ALT`）
3. 或者通过参数化支持多种配色方案

**风险评估：低风险** - 但需要确认设计意图

### 3.2 SLOT\_NAMES（槽位名称）

**结论：❌ 不能合并 - 命名风格不同**

| 文件                    | 命名风格          |
| --------------------- | ------------- |
| equipmentTypes.ts     | 头部、衣服、裤子、靴子   |
| SublimationScreen.tsx | 头部、身体、腿部、脚部   |
| PlayerScreen.tsx      | 盔、炉、盾、臂（科幻风格） |

**问题：** 不同屏幕使用不同的命名风格，可能是为了匹配不同的UI主题。

**重构建议：采用PlayerScreen.tsx的科幻风格。**

### 3.3 QUALITY\_SUFFIX（品质后缀）

**结论：✅ 可以合并**

所有文件中的定义完全相同：

```typescript
const QUALITY_SUFFIX: Record<string, string> = {
  '星尘级': '',
  '彗星级': 'I',
  '流星级': 'II',
  '星河级': 'III',
  '星云级': 'IV',
  '恒星级': 'V',
};
```

**重构步骤：**

1. 在 `types.ts` 或新建 `constants.ts` 中定义并导出
2. 更新所有使用处改为导入

***

## 四、组件函数重复分析

### 4.1 showMessage 函数

**结论：✅ 可以合并 - 创建共享Hook**

**当前实现（各文件几乎相同）：**

```typescript
const showMessage = (text: string, type: 'success' | 'error') => {
  setMessage({ text, type });
  setTimeout(() => setMessage(null), 2000);
};
```

**重构方案：创建** **`useMessage`** **Hook**

```typescript
// src/hooks/useMessage.ts
export function useMessage() {
  const [message, setMessage] = useState<MessageState | null>(null);
  
  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 2000);
  };
  
  return { message, showMessage, MessageToast };
}
```

**重构步骤：**

1. 创建 `src/hooks/useMessage.ts`
2. 更新所有9个使用处改为使用新Hook

**风险评估：低风险**

### 4.2 forceRefresh 函数

**结论：✅ 可以合并**

所有实现完全相同：

```typescript
const forceRefresh = () => setRefreshKey(k => k + 1);
```

**重构方案：** 创建 `useForceUpdate` Hook

### 4.3 getSuccessRateColor 函数

**结论：⚠️ 不能简单合并 - 颜色值略有不同**

| 文件                    | 80%颜色     | 60%颜色     | 40%颜色     |
| --------------------- | --------- | --------- | --------- |
| EnhanceScreen.tsx     | `#22c55e` | `#00d4ff` | `#f59e0b` |
| SublimationScreen.tsx | `#22c55e` | `#00d4ff` | `#fbbf24` |
| InventoryScreen.tsx   | `#4ade80` | `#00d4ff` | `#fb923c` |

**重构建议：** 统一颜色值后合并，或保留差异

### 4.4 generateStars 函数

**结论：✅ 可以合并**

两个文件中的实现完全相同，可以提取到共享工具函数。

***

## 五、UI组件重复分析

### 5.1 SciFiButton 组件

**结论：⚠️ 不能简单合并 - 功能差异大**

| 文件                    | variant支持                                                      | 样式复杂度    |
| --------------------- | -------------------------------------------------------------- | -------- |
| SublimationScreen.tsx | `primary`, `default`                                           | 简单       |
| EnhanceScreen.tsx     | `primary`, `default`                                           | 简单（颜色不同） |
| InventoryScreen.tsx   | `primary`, `secondary`, `success`, `danger`, `info`, `default` | 复杂（渐变背景） |

**重构方案：创建统一的 SciFiButton 组件**

```typescript
// src/components/SciFiButton.tsx
interface SciFiButtonProps {
  onClick: () => void;
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'info' | 'default';
  theme?: 'gold' | 'rose' | 'cyan'; // 支持不同主题色
}
```

**重构步骤：**

1. 创建 `src/components/SciFiButton.tsx`
2. 支持所有variant和主题色
3. 更新3个使用处改为导入

***

## 六、重构优先级排序

### 高优先级（安全且收益大）

| 序号 | 重构项                     | 风险 | 收益   |
| -- | ----------------------- | -- | ---- |
| 1  | 删除 GeneSystem.ts（仅测试使用） | 低  | 清理代码 |
| 2  | 合并 QUALITY\_SUFFIX 常量   | 低  | 减少重复 |
| 3  | 创建 useMessage Hook      | 低  | 减少重复 |
| 4  | 创建 useForceUpdate Hook  | 低  | 减少重复 |
| 5  | 合并 generateStars 函数     | 低  | 减少重复 |

### 中优先级（需要测试验证）

| 序号 | 重构项                          | 风险 | 收益     |
| -- | ---------------------------- | -- | ------ |
| 6  | 合并 types.ts 和 types\_new\.ts | 中  | 统一类型定义 |
| 7  | 创建 SciFiButton 组件            | 中  | 减少重复   |
| 8  | 统一 getSuccessRateColor       | 中  | 减少重复   |

### 低优先级（需要设计决策）

| 序号 | 重构项               | 风险      | 收益   |
| -- | ----------------- | ------- | ---- |
| 9  | 统一 RARITY\_COLORS | 需确认设计意图 | 统一配色 |
| 10 | 统一 SLOT\_NAMES    | 需确认设计意图 | 统一命名 |

***

## 七、详细执行步骤

### 步骤1：删除废弃的 GeneSystem.ts

```bash
# 1. 更新测试文件
# 修改 GeneSystem.test.ts 中的导入

# 2. 删除或重命名旧文件
mv src/core/GeneSystem.ts src/core/GeneSystem.deprecated.ts
```

### 步骤2：创建共享常量文件

```typescript
// src/data/constants.ts
export const QUALITY_SUFFIX: Record<string, string> = { ... };
export const ARMOR_SLOTS: EquipmentSlot[] = [ ... ];
// 其他共享常量
```

### 步骤3：创建共享Hooks

```typescript
// src/hooks/useMessage.ts
// src/hooks/useForceUpdate.ts
```

### 步骤4：创建共享组件

```typescript
// src/components/SciFiButton.tsx
// src/components/MessageToast.tsx (已存在，可复用)
```

### 步骤5：合并类型文件

1. 将 `types_new.ts` 中独有的类型移动到 `types.ts`
2. 更新所有导入
3. 删除 `types_new.ts`

***

## 八、测试验证清单

* [ ] 运行所有单元测试

* [ ] 验证基因系统功能正常

* [ ] 验证装备系统功能正常

* [ ] 验证UI显示正常（颜色、按钮）

* [ ] 验证存档/读档功能正常

***

## 九、总结

经过详细验证，发现：

1. **真正可安全合并的重复代码**：

   * `QUALITY_SUFFIX` 常量

   * `showMessage` 函数

   * `forceRefresh` 函数

   * `generateStars` 函数

   * `GeneSystem.ts`（可删除）

2. **需要设计决策的重复代码**：

   * `RARITY_COLORS`（颜色值不同）

   * `SLOT_NAMES`（命名风格不同）

   * `getSuccessRateColor`（颜色值略有不同）

3. **功能差异较大，需要统一后合并**：

   * `SciFiButton` 组件

   * `types.ts` vs `types_new.ts`

建议按优先级逐步执行重构，每次重构后进行充分测试。
