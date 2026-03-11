# 《星航荒宇》项目架构文档

## 概述

《星航荒宇》是一款科幻题材的放置类RPG游戏，采用现代化的Web技术栈构建，支持跨平台部署（Web、Android、iOS）。本文档详细描述了项目的整体架构设计、模块划分和数据流。

## 技术栈

| 类别 | 技术 | 版本 | 用途 |
|------|------|------|------|
| 前端框架 | React | 19.x | UI组件化开发 |
| 编程语言 | TypeScript | 5.9.x | 类型安全的开发体验 |
| 构建工具 | Vite | 7.x | 快速的开发服务器和构建 |
| 状态管理 | Zustand | 5.x | 轻量级全局状态管理 |
| 样式方案 | Tailwind CSS | 4.x | 原子化CSS框架 |
| 跨平台 | Capacitor | 6.x | 原生移动应用打包 |
| 测试框架 | Vitest | 4.x | 单元测试和覆盖率 |
| 数据持久化 | LocalStorage | - | 浏览器本地存储 |

## 项目目录结构

```
trainsurvival-capacitor/
├── src/                              # 源代码目录
│   ├── core/                         # 核心游戏系统
│   │   ├── GameManager.ts            # 游戏管理器（核心状态机）
│   │   ├── Player.ts                 # 玩家属性系统
│   │   ├── Inventory.ts              # 背包系统
│   │   ├── Storage.ts                # 存档系统
│   │   ├── Train.ts                  # 列车系统
│   │   ├── Spaceship.ts              # 星际航船系统
│   │   ├── BaseFacilitySystem.ts     # 基地设施系统
│   │   ├── MiningSystem.ts           # 采矿系统
│   │   ├── ResearchSystem.ts         # 科研系统
│   │   ├── ChipSystem.ts             # 芯片系统
│   │   ├── GeneSystem.ts             # 基因系统（旧版）
│   │   ├── GeneSystemV2.ts           # 基因系统（新版）
│   │   ├── CyberneticSystem.ts       # 机械飞升系统
│   │   ├── MarketSystem.ts           # 星际市场系统
│   │   ├── RuinSystem.ts             # 遗迹探索系统
│   │   ├── CrewSystem.ts             # 船员系统
│   │   ├── QuestSystem.ts            # 任务系统
│   │   ├── ShopSystem.ts             # 商店系统
│   │   ├── EnhanceSystem.ts          # 装备强化系统
│   │   ├── DecomposeSystem.ts        # 装备分解系统
│   │   ├── MaterialSynthesisSystem.ts # 材料合成系统
│   │   ├── AutoCollectSystem.ts      # 自动采集系统
│   │   ├── CommSystem.ts             # 通讯系统
│   │   ├── CoreItemSystem.ts         # 核心道具系统
│   │   ├── EquipmentSystem.ts        # 装备系统
│   │   ├── EquipmentStatCalculator.ts # 装备属性计算器
│   │   ├── CraftingSystem.ts         # 制造系统
│   │   └── index.ts                  # 模块导出索引
│   │
│   ├── screens/                      # 页面组件
│   │   ├── StartScreen.tsx           # 开始界面
│   │   ├── NameInputScreen.tsx       # 玩家取名界面
│   │   ├── HomeScreen.tsx            # 舰桥主页
│   │   ├── PlayerScreen.tsx          # 战甲档案
│   │   ├── InventoryScreen.tsx       # 背包界面
│   │   ├── CrewScreen.tsx            # 船员舱
│   │   ├── ShopScreen.tsx            # 商店
│   │   ├── QuestScreen.tsx           # 任务列表
│   │   ├── EnhanceScreen.tsx         # 装备强化
│   │   ├── SublimationScreen.tsx     # 装备升华
│   │   ├── DecomposeScreen.tsx       # 装备分解
│   │   ├── MaterialSynthesisScreen.tsx # 材料合成
│   │   ├── NanoArmorCraftingScreen.tsx # 纳米战甲锻造
│   │   ├── EndlessBattleScreen.tsx   # 无尽战斗
│   │   ├── SpaceshipModuleScreen.tsx # 星际航船模块
│   │   └── baseScreen/               # 基地相关页面
│   │       ├── index.tsx             # 基地主界面
│   │       ├── BasicFacilities.tsx   # 基础设施
│   │       ├── ChipContent.tsx       # 芯片研发
│   │       ├── ChipCraftPanel.tsx    # 芯片制作面板
│   │       ├── GeneContent.tsx       # 基因工程
│   │       ├── CyberneticContent.tsx # 机械飞升
│   │       ├── MarketContent.tsx     # 星际市场
│   │       ├── RuinsContent.tsx      # 遗迹探索
│   │       ├── ResearchContent.tsx   # 科研实验室
│   │       ├── MiningContent.tsx     # 采矿平台
│   │       ├── FacilityDetailModal.tsx # 设施详情弹窗
│   │       ├── BaseComponents.tsx    # 基础组件
│   │       ├── shared.tsx            # 共享组件
│   │       ├── styles.ts             # 样式定义
│   │       ├── types.ts              # 类型定义
│   │       └── utils.ts              # 工具函数
│   │
│   ├── stores/                       # 状态管理
│   │   └── gameStore.ts              # Zustand全局状态
│   │
│   ├── data/                         # 数据配置
│   │   ├── index.ts                  # 数据导出索引
│   │   ├── types.ts                  # 核心类型定义
│   │   ├── types_new.ts              # 新版类型定义
│   │   ├── items.ts                  # 物品数据
│   │   ├── enemies.ts                # 敌人数据
│   │   ├── enemyAdapter.ts           # 敌人适配器
│   │   ├── planets_full.ts           # 星球数据
│   │   ├── locations.ts              # 地点数据
│   │   ├── equipmentTypes.ts         # 装备类型
│   │   ├── autoCollectTypes.ts       # 自动采集类型
│   │   ├── spaceshipModules.ts       # 航船模块数据
│   │   ├── nanoArmorRecipes.ts       # 纳米战甲配方
│   │   ├── voidCreatures.ts          # 虚空生物数据
│   │   ├── factions.ts               # 势力数据
│   │   └── itemNames.ts              # 物品名称映射
│   │
│   ├── components/                   # 通用组件
│   │   ├── BottomNav.tsx             # 底部导航栏
│   │   ├── Toast.tsx                 # 提示消息组件
│   │   └── Icons.tsx                 # SVG图标组件
│   │
│   ├── utils/                        # 工具函数
│   │   ├── SaveMigration.ts          # 存档迁移工具
│   │   └── textReplacements.ts       # 文本替换工具
│   │
│   ├── assets/                       # 静态资源
│   │   └── images/                   # 图片资源
│   │
│   ├── styles/                       # 全局样式
│   │   └── theme.css                 # 主题样式
│   │
│   ├── App.tsx                       # 应用入口组件
│   ├── App.css                       # 应用样式
│   ├── main.tsx                      # 应用启动入口
│   └── index.css                     # 全局样式
│
├── android/                          # Android平台代码
│   └── app/src/main/                 # Android主代码
│
├── public/                           # 公共资源
│   └── screenshots/                  # 游戏截图
│
├── docs/                             # 文档目录
│   ├── ARCHITECTURE.md               # 架构设计文档
│   ├── CORE_SYSTEMS.md               # 核心系统详解
│   ├── API_REFERENCE.md              # API参考文档
│   ├── DEVELOPMENT.md                # 开发指南
│   └── INDEX.md                      # 文档导航索引
│
├── .trae/                            # Trae配置目录
│   ├── documents/                    # 项目文档
│   ├── specs/                        # 规格文档
│   └── skills/                       # 自定义技能
│       ├── doc-sync/                 # 文档同步技能
│       ├── frontend-code-review/     # 前端代码审查
│       ├── frontend-design/          # 前端设计
│       ├── game-ui-button-design/    # 游戏UI按钮设计
│       ├── pr-creator/               # PR创建器
│       ├── scifi-ui-refactor/        # 科幻UI重构
│       ├── svg/                      # SVG技能
│       └── webapp-testing/           # Web应用测试
│
├── scripts/                          # 脚本工具
│
├── simulation/                       # 游戏模拟脚本
│
├── capacitor.config.ts               # Capacitor配置
├── vite.config.ts                    # Vite配置
├── tailwind.config.js                # Tailwind配置
├── tsconfig.json                     # TypeScript配置
├── eslint.config.js                  # ESLint配置
└── package.json                      # 项目配置
```

## 架构设计

### 整体架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                         用户界面层 (UI Layer)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Screens   │  │ Components  │  │   Styles    │              │
│  │  (页面组件)  │  │ (通用组件)   │  │  (样式系统)  │              │
│  └──────┬──────┘  └──────┬──────┘  └─────────────┘              │
└─────────┼────────────────┼──────────────────────────────────────┘
          │                │
          ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       状态管理层 (State Layer)                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Zustand Store                         │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │    │
│  │  │ gameManager │  │   toasts    │  │   isLoading │      │    │
│  │  │  (游戏实例)  │  │  (提示消息)  │  │  (加载状态)  │      │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘      │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       核心系统层 (Core Layer)                     │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    GameManager                           │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │    │
│  │  │  Player  │ │Inventory │ │  Train   │ │  Quests  │   │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │    │
│  │  │   Shop   │ │ Crafting │ │ Enhance  │ │  Battle  │   │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │    │
│  │  │   Chip   │ │   Gene   │ │Cybernetic│ │  Market  │   │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │    │
│  │  │   Crew   │ │  Mining  │ │ Research │ │  Ruins   │   │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       数据持久层 (Data Layer)                     │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    GameStorage                           │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │    │
│  │  │ LocalStorage│  │ SaveMigration│  │  Data Types │      │    │
│  │  │  (本地存储)  │  │  (存档迁移)  │  │  (类型定义)  │      │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘      │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### 核心模块关系

```
                    ┌─────────────────┐
                    │   GameManager   │ (核心状态机)
                    │   游戏管理器     │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│    Player     │   │   Inventory   │   │    Train      │
│   玩家系统     │   │   背包系统     │   │   列车系统    │
└───────────────┘   └───────────────┘   └───────────────┘
        │                    │                    │
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│EquipmentSystem│   │ CraftingSystem│   │ Spaceship     │
│   装备系统     │   │   制造系统     │   │   航船系统    │
└───────────────┘   └───────────────┘   └───────────────┘

        ┌────────────────────────────────────────┐
        │              子系统模块                  │
        └────────────────────────────────────────┘
                             │
    ┌────────────┬───────────┼───────────┬────────────┐
    │            │           │           │            │
    ▼            ▼           ▼           ▼            ▼
┌───────┐  ┌───────┐   ┌───────┐   ┌───────┐   ┌───────┐
│ Chip  │  │ Gene  │   │Crew   │   │Mining │   │Market │
│ 芯片  │  │ 基因  │   │ 船员  │   │ 采矿  │   │ 市场  │
└───────┘  └───────┘   └───────┘   └───────┘   └───────┘
    │            │           │           │            │
    ▼            ▼           ▼           ▼            ▼
┌───────┐  ┌───────┐   ┌───────┐   ┌───────┐   ┌───────┐
│Cyber- │  │Research│  │ Ruins │  │ Quest │  │ Shop  │
│netic  │  │ 科研   │  │ 遗迹  │  │ 任务  │  │ 商店  │
│飞升   │  │        │  │       │  │       │  │       │
└───────┘  └───────┘   └───────┘   └───────┘   └───────┘
```

## 数据流设计

### 单向数据流

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Action    │────▶│   Store     │────▶│     UI      │
│  (用户操作)  │     │  (状态更新)  │     │  (界面渲染)  │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       │                   │                   │
       └───────────────────┴───────────────────┘
                     (自动保存)
```

### 状态更新流程

```typescript
// 1. 用户触发操作
const handleUpgrade = () => {
  // 2. 调用Store方法
  const result = upgradeFacility(facilityId);
  
  // 3. Store内部执行
  // - 调用GameManager对应方法
  // - 更新游戏状态
  // - 触发自动保存
  // - 更新UI状态
};

// 4. UI自动响应更新
// Zustand的订阅机制会自动触发组件重新渲染
```

### 存档系统流程

```
┌─────────────────────────────────────────────────────────────────┐
│                        存档系统流程                               │
└─────────────────────────────────────────────────────────────────┘

    ┌─────────────┐                              ┌─────────────┐
    │   新游戏     │                              │   加载游戏   │
    └──────┬──────┘                              └──────┬──────┘
           │                                            │
           ▼                                            ▼
    ┌─────────────┐                              ┌─────────────┐
    │ 初始化数据   │                              │ 读取存档     │
    │ newGame()   │                              │ loadGame()  │
    └──────┬──────┘                              └──────┬──────┘
           │                                            │
           │                                            ▼
           │                                     ┌─────────────┐
           │                                     │ 版本检查     │
           │                                     │ 检查存档版本  │
           │                                     └──────┬──────┘
           │                                            │
           │                    ┌───────────────────────┼───────────────────────┐
           │                    │                       │                       │
           │                    ▼                       ▼                       ▼
           │             ┌─────────────┐        ┌─────────────┐        ┌─────────────┐
           │             │ 版本匹配     │        │ 需要迁移     │        │ 版本过旧     │
           │             │ 直接加载     │        │ 执行迁移     │        │ 提示重置     │
           │             └──────┬──────┘        └──────┬──────┘        └─────────────┘
           │                    │                      │
           │                    └──────────┬───────────┘
           │                               │
           ▼                               ▼
    ┌─────────────────────────────────────────────────────────────┐
    │                      游戏运行时                              │
    │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
    │  │ 自动保存     │  │ 手动保存     │  │ 状态更新     │         │
    │  │ (每30秒)     │  │ (用户触发)   │  │ (实时)       │         │
    │  └─────────────┘  └─────────────┘  └─────────────┘         │
    └─────────────────────────────────────────────────────────────┘
```

## 关键设计模式

### 1. 单一数据源 (Single Source of Truth)

所有游戏状态都存储在 `GameManager` 实例中，通过 Zustand Store 进行统一管理：

```typescript
// gameStore.ts
interface GameStore {
  gameManager: GameManager;  // 唯一的游戏状态源
  // ... 操作方法
}
```

### 2. 命令模式 (Command Pattern)

所有游戏操作都封装为方法调用，返回标准化的结果对象：

```typescript
interface ActionResult {
  success: boolean;
  message: string;
  // 可选的附加数据
}
```

### 3. 观察者模式 (Observer Pattern)

使用 Zustand 的订阅机制实现状态变化的自动响应：

```typescript
// 组件自动订阅Store变化
const { gameManager } = useGameStore();
```

### 4. 工厂模式 (Factory Pattern)

用于创建复杂对象，如装备实例、芯片等：

```typescript
// EquipmentSystem.ts
static createEquipment(baseItem: Item): EquipmentInstance {
  // 创建装备实例的逻辑
}
```

### 5. 策略模式 (Strategy Pattern)

用于不同类型的战斗、探索等行为：

```typescript
// 不同敌人类型使用不同的战斗策略
// 不同地点使用不同的探索策略
```

## 性能优化策略

### 1. 状态更新优化

- 使用 Zustand 的选择器避免不必要的重渲染
- 批量更新状态减少渲染次数

### 2. 组件懒加载

```typescript
// 使用 React.lazy 进行路由级代码分割
const EndlessBattleScreen = lazy(() => import('./screens/EndlessBattleScreen'));
```

### 3. 虚拟列表

对于长列表（如背包物品列表）使用虚拟滚动：

```typescript
// 只渲染可视区域内的项目
```

### 4. 防抖与节流

```typescript
// 频繁操作使用防抖/节流
const debouncedSave = debounce(saveGame, 1000);
```

### 5. 离线计算

```typescript
// 离线期间的进度计算
calculateOfflineProgress() {
  const offlineTime = Date.now() - lastSaveTime;
  // 计算离线收益
}
```

## 扩展性设计

### 1. 模块化系统

每个游戏系统都是独立的模块，可以单独开发和测试：

```typescript
// 核心系统模块化
export class ChipSystem { ... }
export class GeneSystem { ... }
export class CyberneticSystem { ... }
```

### 2. 数据驱动

游戏数据与逻辑分离，便于调整和扩展：

```typescript
// data/items.ts - 物品数据配置
export const ITEMS: Record<string, Item> = { ... };

// data/enemies.ts - 敌人数据配置
export const ENEMIES: Record<string, Enemy> = { ... };
```

### 3. 事件系统

通过事件机制实现模块间解耦通信：

```typescript
// 事件驱动的设计
interface GameEvent {
  type: string;
  payload: any;
}
```

### 4. 插件架构

预留扩展接口，支持未来功能扩展：

```typescript
// 系统扩展接口
interface SystemExtension {
  name: string;
  init: () => void;
  update: (deltaTime: number) => void;
}
```

## 安全性考虑

### 1. 数据验证

```typescript
// 存档数据验证
validateSaveData(data: unknown): boolean {
  // 验证数据结构和类型
}
```

### 2. 数值边界检查

```typescript
// 防止数值溢出
Math.max(0, Math.min(maxValue, currentValue));
```

### 3. 类型安全

使用 TypeScript 的严格模式确保类型安全：

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true
  }
}
```

## 跨平台兼容性

### Capacitor 架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        Web Application                          │
│                    (React + TypeScript)                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Capacitor Runtime                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Storage   │  │   Plugins   │  │   Bridge    │             │
│  │   存储适配   │  │   原生插件   │  │   JS桥接    │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
       ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
       │   Android   │ │     iOS     │ │     Web     │
       │   安卓平台   │ │   苹果平台   │ │   网页平台   │
       └─────────────┘ └─────────────┘ └─────────────┘
```

### 平台特定适配

```typescript
// 使用 Capacitor Preferences API 进行跨平台存储
import { Preferences } from '@capacitor/preferences';

await Preferences.set({ key: 'gameSave', value: JSON.stringify(saveData) });
```

## 测试策略

### 单元测试

```bash
# 运行测试
npm run test

# 生成覆盖率报告
npm run test:coverage
```

### 测试覆盖范围

- 核心系统逻辑测试
- 数值计算测试
- 存档系统测试
- 工具函数测试

## 部署流程

### Web 部署

```bash
npm run build
# 将 dist 目录部署到静态服务器
```

### 移动端部署

```bash
# 构建 Web 资源
npm run build

# 同步到原生平台
npx cap sync

# 打开 Android Studio
npx cap open android

# 打开 Xcode
npx cap open ios
```

## 版本兼容性

### 存档版本管理

```typescript
// SaveMigration.ts
const CURRENT_VERSION = 2;

const migrations = {
  1: migrateFromV1,
  2: migrateFromV2,
};
```

### 向后兼容

- 新版本自动识别旧版存档
- 执行必要的迁移操作
- 保留玩家数据完整性

---

*本文档最后更新：2026年3月*
