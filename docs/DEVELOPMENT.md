# 《星航荒宇》开发指南

## 概述

本文档为《星航荒宇》项目的开发指南，包含环境配置、开发流程、代码规范、调试技巧等内容。

---

## 目录

1. [环境配置](#1-环境配置)
2. [项目启动](#2-项目启动)
3. [开发流程](#3-开发流程)
4. [代码规范](#4-代码规范)
5. [组件开发指南](#5-组件开发指南)
6. [系统开发指南](#6-系统开发指南)
7. [测试指南](#7-测试指南)
8. [调试技巧](#8-调试技巧)
9. [性能优化](#9-性能优化)
10. [常见问题](#10-常见问题)

---

## 1. 环境配置

### 系统要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### 安装依赖

```bash
# 克隆项目
git clone <repository-url>
cd trainsurvival-capacitor

# 安装依赖
npm install
```

### IDE 配置

推荐使用 VS Code，安装以下扩展：

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)

### VS Code 配置

在 `.vscode/settings.json` 中添加：

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

---

## 2. 项目启动

### 开发模式

```bash
# 启动开发服务器
npm run dev

# 访问 http://localhost:5173
```

### 构建生产版本

```bash
# 构建
npm run build

# 预览构建结果
npm run preview
```

### 代码检查

```bash
# 运行 ESLint
npm run lint
```

### 测试

```bash
# 运行测试（监听模式）
npm run test

# 运行测试（单次）
npm run test:run

# 生成覆盖率报告
npm run test:coverage
```

---

## 3. 开发流程

### 分支管理

```
main          # 主分支，稳定版本
├── develop   # 开发分支
├── feature/* # 功能分支
├── bugfix/*  # 修复分支
└── release/* # 发布分支
```

### 提交规范

使用约定式提交：

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具相关
```

**示例：**

```
feat: 添加芯片强化功能
fix: 修复背包物品数量显示错误
docs: 更新API文档
refactor: 重构战斗系统伤害计算
```

### 开发流程图

```
┌─────────────────────────────────────────────────────────────┐
│                      开发流程                                │
└─────────────────────────────────────────────────────────────┘

    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
    │ 创建分支     │────▶│ 编写代码     │────▶│ 本地测试     │
    │ (feature/*) │     │ (实现功能)   │     │ (npm test)  │
    └─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                               ▼
    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
    │ 合并到主分支 │◀────│ 代码审查     │◀────│ 提交PR      │
    │ (merge)     │     │ (review)    │     │ (pull req)  │
    └─────────────┘     └─────────────┘     └─────────────┘
```

---

## 4. 代码规范

### TypeScript 规范

#### 命名规范

```typescript
// 接口：PascalCase，以 I 开头（可选）
interface PlayerData { }

// 类型：PascalCase
type ItemId = string;

// 类：PascalCase
class GameManager { }

// 函数：camelCase
function calculateDamage(): number { }

// 变量：camelCase
const playerHealth = 100;

// 常量：UPPER_SNAKE_CASE
const MAX_LEVEL = 100;

// 枚举：PascalCase
enum ItemType {
  WEAPON = 'weapon',
}

// 私有属性：下划线前缀
class Example {
  private _internalState: number;
}
```

#### 类型定义

```typescript
// 优先使用 interface 定义对象类型
interface Player {
  id: string;
  name: string;
}

// 使用 type 定义联合类型、工具类型
type PlayerId = string;
type Status = 'active' | 'inactive';

// 避免使用 any，使用 unknown 代替
function processData(data: unknown) {
  if (typeof data === 'string') {
    // ...
  }
}

// 使用泛型提高代码复用性
function getItems<T>(items: T[], predicate: (item: T) => boolean): T[] {
  return items.filter(predicate);
}
```

#### 函数规范

```typescript
// 函数签名要明确返回类型
function calculateDamage(attacker: Player, defender: Enemy): number {
  // ...
}

// 使用默认参数
function createItem(name: string, quantity: number = 1): Item {
  // ...
}

// 使用可选参数
function upgradeItem(itemId: string, useProtection?: boolean): ActionResult {
  // ...
}

// 避免过长的参数列表，使用对象参数
interface UpgradeOptions {
  itemId: string;
  useProtection: boolean;
  bonusMultiplier: number;
}

function upgradeItemWithOptions(options: UpgradeOptions): ActionResult {
  // ...
}
```

### React 规范

#### 组件结构

```tsx
// 组件文件结构
// 1. 导入
import { useState, useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';

// 2. 类型定义
interface ComponentProps {
  title: string;
  onAction: () => void;
}

// 3. 组件定义
export function MyComponent({ title, onAction }: ComponentProps) {
  // 3.1 Hooks
  const [state, setState] = useState<string>('');
  const { getPlayer } = useGameStore();
  
  // 3.2 副作用
  useEffect(() => {
    // ...
  }, []);
  
  // 3.3 事件处理函数
  const handleClick = () => {
    onAction();
  };
  
  // 3.4 渲染
  return (
    <div className="my-component">
      <h1>{title}</h1>
      <button onClick={handleClick}>操作</button>
    </div>
  );
}
```

#### Hooks 使用规范

```tsx
// 自定义 Hook
function usePlayerStats() {
  const player = useGameStore(state => state.getPlayer());
  
  const totalAttack = useMemo(() => {
    return player.attack + player.bonusAttack;
  }, [player.attack, player.bonusAttack]);
  
  return { totalAttack };
}

// 使用自定义 Hook
function CombatScreen() {
  const { totalAttack } = usePlayerStats();
  // ...
}
```

### 样式规范

#### Tailwind CSS 使用

```tsx
// 推荐：使用 clsx 或条件表达式
<div className={clsx(
  'base-class',
  isActive && 'active-class',
  variant === 'primary' ? 'primary-class' : 'secondary-class'
)}>

// 避免：过长的类名字符串
<div className="flex flex-col items-center justify-center p-4 m-2 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition-colors duration-200">
```

#### 自定义样式

```css
/* theme.css - 定义主题变量 */
:root {
  --color-primary: #3b82f6;
  --color-secondary: #6366f1;
  --color-danger: #ef4444;
}

/* 使用 Tailwind @apply */
.custom-button {
  @apply px-4 py-2 rounded-lg font-medium transition-colors;
}
```

---

## 5. 组件开发指南

### 组件分类

```
components/
├── common/          # 通用组件
│   ├── Button.tsx
│   ├── Modal.tsx
│   └── Card.tsx
├── game/            # 游戏专用组件
│   ├── ItemCard.tsx
│   ├── StatBar.tsx
│   └── EquipmentSlot.tsx
└── layout/          # 布局组件
    ├── Header.tsx
    ├── Footer.tsx
    └── BottomNav.tsx
```

### 组件开发模板

```tsx
/**
 * 组件名称
 * 
 * 功能描述
 * 
 * @example
 * <MyComponent 
 *   title="标题" 
 *   onAction={handleAction} 
 * />
 */

import { useState, useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';

// Props 类型定义
interface MyComponentProps {
  /** 标题文本 */
  title: string;
  /** 是否激活 */
  isActive?: boolean;
  /** 点击回调 */
  onAction: (data: string) => void;
}

export function MyComponent({ 
  title, 
  isActive = false, 
  onAction 
}: MyComponentProps) {
  // 状态
  const [localState, setLocalState] = useState<string>('');
  
  // Store
  const player = useGameStore(state => state.getPlayer());
  
  // 事件处理
  const handleClick = useCallback(() => {
    onAction(localState);
  }, [localState, onAction]);
  
  // 渲染
  return (
    <div className="my-component">
      <h2>{title}</h2>
      <p>玩家: {player.name}</p>
      <button 
        onClick={handleClick}
        className={isActive ? 'active' : ''}
      >
        操作
      </button>
    </div>
  );
}
```

### 性能优化

```tsx
// 使用 memo 避免不必要的重渲染
export const MemoizedComponent = memo(function MyComponent({ data }: Props) {
  return <div>{data}</div>;
});

// 使用 useMemo 缓存计算结果
function ExpensiveComponent({ items }: Props) {
  const sortedItems = useMemo(() => {
    return items.sort((a, b) => a.value - b.value);
  }, [items]);
  
  return <List items={sortedItems} />;
}

// 使用 useCallback 缓存回调函数
function ParentComponent() {
  const handleClick = useCallback((id: string) => {
    console.log(id);
  }, []);
  
  return <ChildComponent onClick={handleClick} />;
}
```

---

## 6. 系统开发指南

### 新系统开发流程

```
┌─────────────────────────────────────────────────────────────┐
│                    新系统开发流程                            │
└─────────────────────────────────────────────────────────────┘

    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
    │ 1. 设计接口  │────▶│ 2. 编写类型  │────▶│ 3. 实现逻辑  │
    │ (确定功能)   │     │ (TypeScript) │     │ (核心类)    │
    └─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                               ▼
    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
    │ 6. 集成测试  │◀────│ 5. 编写测试  │◀────│ 4. 集成到GM  │
    │ (完整功能)   │     │ (单元测试)   │     │ (GameManager)│
    └─────────────┘     └─────────────┘     └─────────────┘
```

### 系统开发模板

```typescript
// src/core/NewSystem.ts

/**
 * 新系统
 * 
 * 功能描述
 */

// 类型定义
export interface NewSystemState {
  // 状态属性
}

export interface NewSystemConfig {
  // 配置属性
}

export class NewSystem {
  // 状态
  private state: NewSystemState;
  
  // 配置
  private config: NewSystemConfig;
  
  constructor() {
    this.state = this.initState();
    this.config = this.initConfig();
  }
  
  // 初始化
  private initState(): NewSystemState {
    return {
      // 初始状态
    };
  }
  
  private initConfig(): NewSystemConfig {
    return {
      // 默认配置
    };
  }
  
  // 公共方法
  public doSomething(): ActionResult {
    // 实现逻辑
    return {
      success: true,
      message: '操作成功',
    };
  }
  
  // 私有方法
  private internalMethod(): void {
    // 内部逻辑
  }
  
  // 序列化
  public serialize(): NewSystemState {
    return { ...this.state };
  }
  
  // 反序列化
  public deserialize(data: NewSystemState): void {
    this.state = { ...data };
  }
}
```

### 集成到 GameManager

```typescript
// src/core/GameManager.ts

import { NewSystem } from './NewSystem';

class GameManager {
  // 添加新系统实例
  public newSystem: NewSystem;
  
  constructor() {
    this.newSystem = new NewSystem();
  }
  
  // 添加公共方法
  public doSomethingInNewSystem(): ActionResult {
    return this.newSystem.doSomething();
  }
  
  // 更新存档逻辑
  saveGame(): GameState {
    return {
      // ...
      newSystem: this.newSystem.serialize(),
    };
  }
  
  loadGame(data: GameState): void {
    // ...
    if (data.newSystem) {
      this.newSystem.deserialize(data.newSystem);
    }
  }
}
```

### 添加 Store 方法

```typescript
// src/stores/gameStore.ts

interface GameStore {
  // 添加新方法
  doSomethingInNewSystem: () => ActionResult;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // 实现方法
  doSomethingInNewSystem: () => {
    const { gameManager } = get();
    const result = gameManager.doSomethingInNewSystem();
    get().saveGame();
    set({ gameManager });
    return result;
  },
}));
```

---

## 7. 测试指南

### 测试文件组织

```
src/
├── core/
│   ├── EnhanceSystem.ts
│   └── EnhanceSystem.test.ts    # 单元测试
├── utils/
│   ├── helpers.ts
│   └── helpers.test.ts
└── screens/
    └── baseScreen/
        └── utils.test.ts
```

### 单元测试模板

```typescript
// xxx.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { MySystem } from './MySystem';

describe('MySystem', () => {
  let system: MySystem;
  
  beforeEach(() => {
    system = new MySystem();
  });
  
  describe('doSomething', () => {
    it('should return success when condition is met', () => {
      const result = system.doSomething();
      
      expect(result.success).toBe(true);
      expect(result.message).toBeDefined();
    });
    
    it('should return failure when condition is not met', () => {
      // 设置前置条件
      system.setCondition(false);
      
      const result = system.doSomething();
      
      expect(result.success).toBe(false);
    });
  });
  
  describe('serialization', () => {
    it('should correctly serialize and deserialize state', () => {
      system.setValue(100);
      
      const serialized = system.serialize();
      const newSystem = new MySystem();
      newSystem.deserialize(serialized);
      
      expect(newSystem.getValue()).toBe(100);
    });
  });
});
```

### 测试覆盖范围

```typescript
// 测试各种边界情况
describe('calculateDamage', () => {
  it('should return 0 when attacker has 0 attack', () => {
    const damage = calculateDamage({ attack: 0 }, { defense: 100 });
    expect(damage).toBe(0);
  });
  
  it('should handle negative defense', () => {
    const damage = calculateDamage({ attack: 100 }, { defense: -50 });
    expect(damage).toBeGreaterThan(100);
  });
  
  it('should handle very large numbers', () => {
    const damage = calculateDamage({ attack: 1e10 }, { defense: 1e9 });
    expect(damage).toBeFinite();
    expect(damage).toBePositive();
  });
});
```

### 运行测试

```bash
# 运行所有测试
npm run test

# 运行特定文件测试
npm run test -- EnhanceSystem.test.ts

# 生成覆盖率报告
npm run test:coverage
```

---

## 8. 调试技巧

### 浏览器调试

```typescript
// 在代码中添加调试日志
console.log('[GameManager]', 'Player data:', player);

// 使用 debugger 断点
function complexCalculation() {
  debugger; // 浏览器会在此处暂停
  // ...
}
```

### React DevTools

1. 安装 React Developer Tools 扩展
2. 使用 Components 标签查看组件树
3. 使用 Profiler 分析性能

### Zustand 调试

```typescript
// 在控制台访问 Store
window.__GAME_STORE__ = useGameStore.getState();

// 监听状态变化
useGameStore.subscribe((state, prevState) => {
  console.log('State changed:', { state, prevState });
});
```

### 常用调试命令

```typescript
// 查看玩家状态
console.log(useGameStore.getState().getPlayer());

// 查看背包内容
console.log(useGameStore.getState().getInventory().items);

// 手动添加物品（测试用）
const store = useGameStore.getState();
store.gameManager.inventory.addItem('test_item', 10);
```

---

## 9. 性能优化

### React 性能优化

```tsx
// 1. 使用 memo 避免不必要的重渲染
const MemoizedItem = memo(function Item({ data }: ItemProps) {
  return <div>{data.name}</div>;
});

// 2. 使用选择器避免订阅整个 Store
const playerName = useGameStore(state => state.getPlayer().name);

// 3. 使用 useMemo 缓存计算结果
const filteredItems = useMemo(() => {
  return items.filter(item => item.rarity === 'rare');
}, [items]);

// 4. 使用 useCallback 缓存回调
const handleItemClick = useCallback((id: string) => {
  setSelected(id);
}, []);
```

### 列表渲染优化

```tsx
// 使用 key 优化列表渲染
function ItemList({ items }: { items: Item[] }) {
  return (
    <div>
      {items.map(item => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

// 对于长列表，考虑虚拟滚动
// 可以使用 react-window 或 react-virtualized
```

### 状态更新优化

```typescript
// 批量更新状态
// Zustand 自动批量更新，无需额外处理

// 避免在循环中频繁调用 saveGame
function processItems(items: Item[]) {
  items.forEach(item => {
    // 处理逻辑
  });
  // 最后只保存一次
  saveGame();
}
```

### 内存优化

```typescript
// 及时清理不再使用的数据
useEffect(() => {
  const timer = setInterval(() => {
    // ...
  }, 1000);
  
  return () => {
    clearInterval(timer); // 清理定时器
  };
}, []);

// 避免在状态中存储大量数据
// 可以考虑使用 WeakMap 或其他弱引用结构
```

---

## 10. 常见问题

### Q: 修改代码后页面没有更新？

A: 检查以下几点：
1. 确保开发服务器正在运行
2. 检查是否有编译错误
3. 尝试刷新页面或重启开发服务器

### Q: 存档数据丢失？

A: 检查以下几点：
1. 确保 LocalStorage 没有被清除
2. 检查存档迁移逻辑是否正确
3. 查看控制台是否有错误信息

### Q: 类型错误？

A: 常见解决方案：
```typescript
// 1. 确保类型导入正确
import type { Item } from './types';

// 2. 使用类型断言（谨慎使用）
const item = data as Item;

// 3. 使用类型守卫
function isItem(data: unknown): data is Item {
  return typeof data === 'object' && data !== null && 'id' in data;
}
```

### Q: 样式不生效？

A: 检查以下几点：
1. 确保 Tailwind 类名拼写正确
2. 检查是否需要使用 `!important`
3. 确认 CSS 加载顺序

### Q: 移动端适配问题？

A: 使用以下方法：
```css
/* 使用 viewport 单位 */
.container {
  width: 100vw;
  height: 100vh;
}

/* 使用媒体查询 */
@media (max-width: 640px) {
  .mobile-only {
    display: block;
  }
}
```

### Q: 如何添加新的物品类型？

A: 按以下步骤：
1. 在 `data/types.ts` 中添加类型定义
2. 在 `data/items.ts` 中添加物品数据
3. 在相关系统中添加处理逻辑

### Q: 如何调试存档问题？

A: 使用以下方法：
```typescript
// 在控制台查看存档
const saveData = localStorage.getItem('gameSave');
console.log(JSON.parse(saveData || '{}'));

// 手动清除存档（测试用）
localStorage.removeItem('gameSave');
```

---

## 附录

### 有用的脚本

```bash
# 清理并重新安装依赖
rm -rf node_modules package-lock.json && npm install

# 检查依赖更新
npm outdated

# 查看依赖树
npm list --depth=0
```

### 相关文档链接

- [React 官方文档](https://react.dev/)
- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [Zustand 文档](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Vitest 文档](https://vitest.dev/)
- [Capacitor 文档](https://capacitorjs.com/docs)

---

*本文档最后更新：2026年3月*
