# 星航荒宇 (Xinghang Huangyu)

一款科幻题材的生存冒险游戏，玩家驾驶列车在星际间穿梭，探索未知星球，收集资源，建设基地，招募船员，与敌人战斗。

## 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | React 19 + TypeScript |
| 构建工具 | Vite 7 |
| 状态管理 | Zustand 5 |
| 样式方案 | Tailwind CSS 4 + CSS-in-JS |
| 跨平台 | Capacitor 6 (iOS/Android) |
| 测试框架 | Vitest |
| 数据持久化 | LocalStorage |

## 项目结构

```
src/
├── core/                           # 核心系统
│   ├── GameManager.ts              # 游戏管理器（核心状态机）
│   ├── Player.ts                   # 玩家属性系统
│   ├── Inventory.ts                # 背包系统
│   ├── BaseFacilitySystem.ts       # 基地设施系统
│   ├── MiningSystem.ts             # 采矿系统
│   ├── ResearchSystem.ts           # 科研系统
│   ├── ChipSystem.ts               # 芯片系统
│   ├── GeneSystem.ts               # 基因系统
│   ├── GeneSystemV2.ts             # 基因系统V2
│   ├── CyberneticSystem.ts         # 机械飞升系统
│   ├── MarketSystem.ts             # 星际市场系统
│   ├── RuinSystem.ts               # 遗迹探索系统
│   ├── CrewSystem.ts               # 船员系统
│   ├── QuestSystem.ts              # 任务系统
│   ├── ShopSystem.ts               # 商店系统
│   ├── EnhanceSystem.ts            # 装备强化系统
│   ├── DecomposeSystem.ts          # 装备分解系统
│   ├── MaterialSynthesisSystem.ts  # 材料合成系统
│   ├── AutoCollectSystem.ts        # 自动采集系统
│   └── ...
├── screens/                        # 页面组件
│   ├── StartScreen.tsx             # 开始界面
│   ├── NameInputScreen.tsx         # 玩家取名界面
│   ├── HomeScreen.tsx              # 舰桥主页
│   ├── PlayerScreen.tsx            # 战甲档案
│   ├── InventoryScreen.tsx         # 背包界面
│   ├── CrewScreen.tsx              # 船员舱
│   ├── ShopScreen.tsx              # 商店
│   ├── QuestScreen.tsx             # 任务列表
│   ├── EnhanceScreen.tsx           # 装备强化
│   ├── SublimationScreen.tsx       # 装备升华
│   ├── DecomposeScreen.tsx         # 装备分解
│   ├── MaterialSynthesisScreen.tsx # 材料合成
│   ├── NanoArmorCraftingScreen.tsx # 纳米战甲锻造
│   ├── EndlessBattleScreen.tsx     # 无尽战斗
│   ├── baseScreen/                 # 基地相关页面
│   │   ├── index.tsx               # 基地主界面
│   │   ├── BasicFacilities.tsx     # 基础设施
│   │   ├── ChipContent.tsx         # 芯片研发
│   │   ├── GeneContent.tsx         # 基因工程
│   │   ├── CyberneticContent.tsx   # 机械飞升
│   │   ├── MarketContent.tsx       # 星际市场
│   │   ├── RuinsContent.tsx        # 遗迹探索
│   │   ├── ResearchContent.tsx     # 科研实验室
│   │   └── MiningContent.tsx       # 采矿平台
│   └── ...
├── stores/                         # 状态管理
│   └── gameStore.ts                # Zustand 全局状态
├── data/                           # 数据配置
│   ├── items.ts                    # 物品数据
│   ├── enemies.ts                  # 敌人数据
│   ├── planets_full.ts             # 星球数据
│   ├── equipmentTypes.ts           # 装备类型
│   ├── autoCollectTypes.ts         # 自动采集类型
│   └── types.ts                    # 类型定义
├── components/                     # 通用组件
│   ├── BottomNav.tsx               # 底部导航
│   ├── Toast.tsx                   # 提示组件
│   └── Icons.tsx                   # 图标组件
├── utils/                          # 工具函数
│   ├── SaveMigration.ts            # 存档迁移
│   └── textReplacements.ts         # 文本替换
└── assets/                         # 静态资源
    └── images/                     # 图片资源
```

## 游戏系统

### 玩家系统
- **角色创建**: 新游戏时玩家可自定义名称（最多5个中文字符）
- **属性系统**: 生命、神能、攻击、防御、速度等基础属性
- **等级成长**: 通过战斗和探索获取经验升级

### 基地设施系统

游戏包含12种可升级的基地设施：

| 设施 | 功能 |
|------|------|
| 🏠 指挥中心 | 解锁其他设施升级 |
| � 能源核心 | 提供能源效率加成 |
| 🏭 生产车间 | 制造基础物品 |
| 📡 通讯中心 | 接收随机事件 |
| 🛒 交易站 | 物品交易市场 |
| ⚔️ 竞技场 | 机械飞升系统 |
| 🔬 科研实验室 | 科技研发 |
| ⛏️ 采矿平台 | 资源采集 |
| 💾 芯片研发中心 | 芯片制作与装备 |
| 🧬 基因工程实验室 | 基因改造 |
| 🛒 星际市场 | 玩家交易系统 |
| 🏛️ 遗迹探索中心 | 探险任务 |

### 船员系统
- **招募系统**: 普通招募和限定招募两种方式
- **品质分级**: 普通、稀有、史诗、传说四种品质
- **职业系统**: 战士、工程师、医疗兵、侦察兵、技术员
- **战斗阵容**: 最多配置6名船员参战
- **主角系统**: 玩家角色作为主角船员参与战斗

### 战斗系统
- **回合制战斗**: 6v6策略性回合制战斗
- **无尽模式**: 波次挑战，击败敌人获取奖励
- **Boss战**: 每10波出现强力Boss

### 装备系统
- **装备强化**: 消耗强化石提升装备等级
- **装备升华**: 提升装备品质
- **装备分解**: 分解不需要的装备获取材料
- **纳米战甲**: 锻造特殊战甲装备

### 芯片系统
- **芯片类型**: 攻击、防御、生命、速度、暴击等
- **品质系统**: 普通、优秀、稀有、史诗、传说
- **套装效果**: 收集同套芯片获得额外加成
- **升级强化**: 消耗材料提升芯片等级

### 基因系统
- **染色体系统**: 多种染色体提供不同属性加成
- **基因片段**: 激活基因片段获得特殊效果
- **基因改造**: 替换碱基对改变基因属性

### 机械飞升
- **义体系统**: 6种义体类型（神经、骨骼、肌肉、感官、心血管、综合）
- **品质分级**: 普通、稀有、史诗、传说
- **特殊效果**: 高级义体带有特殊能力

### 采矿系统
- **船员派遣**: 最多派遣4名船员，提升采矿效率
- **深度挖掘**: 随深度增加获得更高产量加成
- **随机事件**: 富矿脉、塌方、古代遗迹等多种事件

### 科研系统
- **科研项目**: 多种科技可供研究
- **研究进度**: 实时进度更新
- **离线收益**: 离线期间研究继续进行

### 星际市场
- **系统商店**: 购买稀有物品
- **玩家交易**: 挂单出售自己的物品
- **市场刷新**: 定期刷新商品

### 遗迹探索
- **遗迹类型**: 废弃空间站、古代遗迹、坠毁飞船等
- **难度系统**: 简单到地狱5种难度
- **探险奖励**: 信用点、稀有材料、特殊物品

### 自动采集系统
- **采集模式**: 资源采集、战斗巡逻、平衡模式
- **采集机器人**: 不同等级机器人效率不同
- **挂机收益**: 离线期间自动获取资源

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 运行测试
npm run test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 代码检查
npm run lint
```

## 移动端构建

```bash
# 添加Android平台
npx cap add android

# 添加iOS平台
npx cap add ios

# 同步资源到移动端
npx cap sync

# 打开Android Studio
npx cap open android

# 打开Xcode
npx cap open ios
```

## 开发说明

- 所有游戏数据自动保存到 LocalStorage
- 支持热重载开发
- 类型安全的 TypeScript 开发体验
- 支持离线进度计算（研究、采矿、自动采集）

## 许可证

MIT License
