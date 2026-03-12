# 《星航荒宇》核心系统文档

## 概述

本文档详细描述了《星航荒宇》游戏中所有核心系统的设计理念、功能实现和使用方法。每个系统都是独立的模块，通过 GameManager 进行统一协调。

---

## 目录

1. [GameManager - 游戏管理器](#1-gamemanager---游戏管理器)
2. [Player - 玩家系统](#2-player---玩家系统)
3. [Inventory - 背包系统](#3-inventory---背包系统)
4. [EquipmentSystem - 装备系统](#4-equipmentsystem---装备系统)
5. [ChipSystem - 芯片系统](#5-chipsystem---芯片系统)
6. [GeneSystem - 基因系统](#6-genesystem---基因系统)
7. [CyberneticSystem - 机械飞升系统](#7-cyberneticsystem---机械飞升系统)
8. [CrewSystem - 船员系统](#8-crewsystem---船员系统)
9. [BaseFacilitySystem - 基地设施系统](#9-basefacilitysystem---基地设施系统)
10. [MiningSystem - 采矿系统](#10-miningsystem---采矿系统)
11. [ResearchSystem - 科研系统](#11-researchsystem---科研系统)
12. [MarketSystem - 星际市场系统](#12-marketsystem---星际市场系统)
13. [RuinSystem - 遗迹探索系统](#13-ruinsystem---遗迹探索系统)
14. [QuestSystem - 任务系统](#14-questsystem---任务系统)
15. [ShopSystem - 商店系统](#15-shopsystem---商店系统)
16. [EnhanceSystem - 装备强化系统](#16-enhancesystem---装备强化系统)
17. [DecomposeSystem - 装备分解系统](#17-decomposesystem---装备分解系统)
18. [MaterialSynthesisSystem - 材料合成系统](#18-materialsynthesissystem---材料合成系统)
19. [AutoCollectSystem - 自动采集系统](#19-autocollectsystem---自动采集系统)
20. [BattleSystem - 战斗系统](#20-battlesystem---战斗系统)

---

## 1. GameManager - 游戏管理器

### 概述

GameManager 是游戏的核心状态机，负责协调所有子系统，管理游戏的整体流程。

### 核心职责

```typescript
class GameManager {
  // 核心属性
  player: Player;                    // 玩家实例
  inventory: Inventory;              // 背包实例
  train: Train;                      // 列车实例
  quests: Quest[];                   // 任务列表
  shopItems: ShopItem[];             // 商店物品
  logs: string[];                    // 游戏日志
  
  // 子系统
  baseFacilitySystem: BaseFacilitySystem;
  miningSystem: MiningSystem;
  researchSystem: ResearchSystem;
  chipSystem: ChipSystem;
  geneSystem: GeneSystemV2;
  cyberneticSystem: CyberneticSystem;
  marketSystem: MarketSystem;
  ruinSystem: RuinSystem;
  crewSystem: CrewSystem;
  autoCollectSystem: AutoCollectSystem;
  commSystem: CommSystem;
}
```

### 主要方法

| 方法 | 描述 | 返回值 |
|------|------|--------|
| `newGame()` | 初始化新游戏 | `void` |
| `loadGame(data)` | 加载存档数据 | `void` |
| `saveGame()` | 保存游戏状态 | `GameState` |
| `setPlayerName(name)` | 设置玩家名称 | `void` |

### 生命周期

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   初始化     │────▶│   游戏运行   │────▶│   保存退出   │
│  newGame()  │     │   循环更新   │     │  saveGame() │
└─────────────┘     └─────────────┘     └─────────────┘
```

---

## 2. Player - 玩家系统

### 概述

玩家系统管理角色的所有属性、状态和成长数据。

### 核心属性

```typescript
interface PlayerData {
  // 基础信息
  name: string;                      // 玩家名称
  level: number;                     // 等级
  experience: number;                // 当前经验
  experienceToNextLevel: number;     // 升级所需经验
  
  // 核心属性
  hp: number;                        // 当前生命值
  maxHp: number;                     // 最大生命值
  spirit: number;                    // 当前神能值
  maxSpirit: number;                 // 最大神能值
  
  // 战斗属性
  attack: number;                    // 攻击力
  defense: number;                   // 防御力
  attackSpeed: number;               // 攻击速度
  critRate: number;                  // 暴击率
  critDamage: number;                // 暴击伤害
  dodgeRate: number;                 // 闪避率
  hitRate: number;                   // 命中率
  penetration: number;               // 穿透率
  lifeSteal: number;                 // 生命偷取
  
  // 资源
  credits: number;                   // 信用点
  stamina: number;                   // 体力值
  maxStamina: number;                // 最大体力
  
  // 装备槽位
  equipment: Map<EquipmentSlot, EquipmentInstance>;
}
```

### 等级成长

```
等级 1-20:   基础成长阶段，每级提升基础属性
等级 21-50:  进阶成长阶段，解锁更多技能槽
等级 51-80:  高级成长阶段，大幅提升属性
等级 81-100: 终极成长阶段，解锁终极能力
```

### 关键方法

```typescript
class Player {
  // 属性计算
  getTotalStats(): CalculatedStats;
  
  // 装备管理
  equipItem(item: EquipmentInstance): boolean;
  unequipItem(slot: EquipmentSlot): EquipmentInstance | null;
  getEquipmentBySlot(slot: EquipmentSlot): EquipmentInstance | undefined;
  
  // 经验与等级
  addExperience(amount: number): void;
  levelUp(): void;
  
  // 战斗相关
  takeDamage(amount: number): number;
  heal(amount: number): number;
  useSpirit(amount: number): boolean;
}
```

---

## 3. Inventory - 背包系统

### 概述

背包系统管理玩家拥有的所有物品，包括装备、材料、消耗品等。

### 核心结构

```typescript
class Inventory {
  items: Map<string, InventoryItem>;  // 物品映射表
  capacity: number;                   // 背包容量
  
  // 添加物品
  addItem(itemId: string, quantity: number): boolean;
  
  // 移除物品
  removeItem(itemId: string, quantity: number): boolean;
  
  // 查询物品
  getItem(itemId: string): InventoryItem | undefined;
  hasItem(itemId: string, quantity: number): boolean;
  
  // 物品分类
  getItemsByType(type: ItemType): InventoryItem[];
  getItemsByRarity(rarity: ItemRarity): InventoryItem[];
}
```

### 物品类型

| 类型 | 描述 | 示例 |
|------|------|------|
| `WEAPON` | 武器 | 激光枪、等离子剑 |
| `ARMOR` | 防具 | 纳米战甲、能量护盾 |
| `ACCESSORY` | 饰品 | 能量戒指、神经芯片 |
| `CONSUMABLE` | 消耗品 | 治疗药剂、能量饮料 |
| `MATERIAL` | 材料 | 星核碎片、基因样本 |
| `SPECIAL` | 特殊物品 | 神能核心、虚空结晶 |

### 品质系统

```
COMMON (普通)    - 灰色 - 基础属性
UNCOMMON (优秀)  - 绿色 - +10% 属性
RARE (稀有)      - 蓝色 - +25% 属性
EPIC (史诗)      - 紫色 - +50% 属性
LEGENDARY (传说) - 金色 - +100% 属性
MYTHIC (神话)    - 红色 - +200% 属性
```

---

## 4. EquipmentSystem - 装备系统

### 概述

装备系统管理装备的创建、强化、升华和属性计算。

### 装备槽位

```typescript
enum EquipmentSlot {
  WEAPON = 'weapon',           // 武器
  HEAD = 'head',               // 头部
  BODY = 'body',               // 身体
  LEGS = 'legs',               // 腿部
  FEET = 'feet',               // 脚部
  ACCESSORY_1 = 'accessory_1', // 饰品1
  ACCESSORY_2 = 'accessory_2', // 饰品2
}
```

### 装备实例

```typescript
interface EquipmentInstance extends Item {
  // 基础属性
  id: string;
  baseItemId: string;
  
  // 强化系统
  enhanceLevel: number;        // 强化等级 (0-20)
  enhanceProgress: number;     // 强化进度
  
  // 升华系统
  sublimationLevel: number;    // 升华等级 (0-5)
  sublimationProgress: number; // 升华进度
  isSublimated: boolean;       // 是否已升华
  
  // 套装系统
  setId?: string;              // 套装ID
  
  // 特效
  effects: EquipmentEffect[];  // 装备特效
}
```

### 属性计算流程

```
基础属性
    │
    ▼
┌─────────────┐
│ 品质加成     │  根据品质增加属性百分比
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 强化加成     │  每级强化增加固定数值
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 升华加成     │  每级升华增加百分比
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 套装加成     │  收集套装获得额外加成
└──────┬──────┘
       │
       ▼
最终属性
```

---

## 5. ChipSystem - 芯片系统

### 概述

芯片系统允许玩家制作和装备各种芯片，提供额外的属性加成和特殊效果。

### 芯片槽位

```typescript
enum ChipSlot {
  ATTACK = 'attack',      // 攻击芯片
  DEFENSE = 'defense',    // 防御芯片
  LIFE = 'life',          // 生命芯片
  SPEED = 'speed',        // 速度芯片
  CRIT = 'crit',          // 暴击芯片
  SPECIAL = 'special',    // 特殊芯片
}
```

### 芯片结构

```typescript
interface Chip {
  id: string;
  slot: ChipSlot;              // 槽位类型
  rarity: ChipRarity;          // 品质
  level: number;               // 等级
  
  // 主属性
  mainStat: ChipStat;          // 主属性类型
  mainValue: number;           // 主属性值
  
  // 副属性 (最多4条)
  subStats: ChipSubStat[];
  
  // 套装
  chipSet: ChipSet;            // 所属套装
  
  // 状态
  isEquipped: boolean;         // 是否已装备
  isLocked: boolean;           // 是否锁定
}
```

### 套装效果

```typescript
interface ChipSet {
  id: string;
  name: string;
  bonuses: {
    requiredCount: number;     // 需要数量
    effect: string;            // 效果描述
    value: number;             // 效果数值
  }[];
}
```

### 芯片制作

```
┌─────────────────────────────────────────────────────────────┐
│                      芯片制作流程                            │
└─────────────────────────────────────────────────────────────┘

    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
    │ 选择槽位     │────▶│ 选择品质     │────▶│ 消耗材料     │
    │ (攻击/防御)  │     │ (普通-传说)  │     │ (芯片碎片)   │
    └─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │ 生成芯片     │
                                        │ 随机属性     │
                                        └─────────────┘
```

---

## 6. GeneSystem - 基因系统

### 概述

基因系统V2采用染色体和碱基对的概念，允许玩家通过基因改造获得强大的属性加成和特殊能力。

### 染色体系统

```typescript
interface Chromosome {
  id: string;
  name: string;
  type: ChromosomeType;        // 染色体类型
  
  // 碱基对序列
  basePairs: BasePair[];       // 碱基对数组
  
  // 完整度
  integrity: number;           // 完整度 (0-100)
  
  // 激活的基因片段
  activeFragments: GeneFragment[];
}

enum ChromosomeType {
  STRENGTH = 'strength',       // 力量染色体
  AGILITY = 'agility',         // 敏捷染色体
  VITALITY = 'vitality',       // 生命染色体
  INTELLIGENCE = 'intelligence', // 智力染色体
  SPECIAL = 'special',         // 特殊染色体
}
```

### 碱基对

```typescript
interface BasePair {
  position: number;            // 位置
  base: Base;                  // 碱基类型
  isActive: boolean;           // 是否激活
}

enum Base {
  A = 'A',  // 腺嘌呤 - 攻击相关
  T = 'T',  // 胸腺嘧啶 - 防御相关
  G = 'G',  // 鸟嘌呤 - 生命相关
  C = 'C',  // 胞嘧啶 - 速度相关
}
```

### 基因片段效果

```typescript
interface GeneFragment {
  id: string;
  name: string;
  description: string;
  
  // 激活条件
  requiredSequence: Base[];    // 需要的碱基序列
  requiredPosition: number;    // 起始位置
  
  // 效果
  effect: GeneEffect;
  
  // 战斗上下文条件
  battleCondition?: BattleCondition;
}
```

### 基因改造流程

```
┌─────────────────────────────────────────────────────────────┐
│                      基因改造流程                            │
└─────────────────────────────────────────────────────────────┘

    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
    │ 选择染色体   │────▶│ 选择位置     │────▶│ 替换碱基     │
    │ (力量/敏捷)  │     │ (目标碱基对)  │     │ (消耗材料)   │
    └─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │ 检查片段激活 │
                                        │ 更新属性     │
                                        └─────────────┘
```

---

## 7. CyberneticSystem - 机械飞升系统

### 概述

机械飞升系统允许玩家安装各种义体，获得超越人类极限的能力。

### 义体类型

```typescript
enum ImplantType {
  NEURAL = 'neural',           // 神经系统
  SKELETAL = 'skeletal',       // 骨骼系统
  MUSCULAR = 'muscular',       // 肌肉系统
  SENSORY = 'sensory',         // 感官系统
  CARDIOVASCULAR = 'cardiovascular', // 心血管系统
  INTEGRATED = 'integrated',   // 综合系统
}
```

### 义体结构

```typescript
interface Implant {
  id: string;
  type: ImplantType;           // 类型
  rarity: ImplantRarity;       // 品质
  level: number;               // 等级
  
  // 基础属性加成
  stats: Record<string, number>;
  
  // 特殊效果
  specialEffect?: ImplantEffect;
  
  // 状态
  isEquipped: boolean;
  isLocked: boolean;
}
```

### 义体品质

```
COMMON (普通)    - 基础属性加成
RARE (稀有)      - 属性加成 + 可能出现特殊效果
EPIC (史诗)      - 属性加成 + 必定有特殊效果
LEGENDARY (传说) - 大幅属性加成 + 强力特殊效果
```

### 特殊效果示例

```typescript
interface ImplantEffect {
  type: ImplantEffectType;
  trigger: EffectTrigger;
  value: number;
  description: string;
}

// 示例效果
const effects = {
  ADRENALINE_RUSH: '生命值低于30%时，攻击速度提升50%',
  NEURAL_OVERCLOCK: '暴击时，下次攻击必定暴击',
  REGENERATION: '每秒恢复最大生命值的2%',
  PAIN_INHIBITOR: '受到致命伤害时，有30%概率保留1点生命',
};
```

---

## 8. CrewSystem - 船员系统

### 概述

船员系统允许玩家招募和管理船员，组建战斗队伍。

### 船员结构

```typescript
interface CrewMember {
  id: string;
  name: string;
  rarity: CrewRarity;          // 品质
  profession: CrewProfession;  // 职业
  level: number;               // 等级
  experience: number;          // 经验
  
  // 战斗属性
  stats: CrewStats;
  
  // 技能
  skills: CrewSkill[];
  
  // 战斗槽位
  battleSlot?: number;         // 战斗位置 (1-6)
  
  // 主角标识
  isProtagonist: boolean;      // 是否为主角
}
```

### 船员职业

```typescript
enum CrewProfession {
  WARRIOR = 'warrior',         // 战士 - 高攻击
  ENGINEER = 'engineer',       // 工程师 - 技能伤害
  MEDIC = 'medic',             // 医疗兵 - 治疗
  SCOUT = 'scout',             // 侦察兵 - 高速度
  TECHNICIAN = 'technician',   // 技术员 - 辅助
}
```

### 招募系统

```
┌─────────────────────────────────────────────────────────────┐
│                      船员招募系统                            │
└─────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────────┐
    │                    普通招募                              │
    │  ┌─────────────┐                                       │
    │  │ 消耗普通招募券 │──▶ 随机获得普通/稀有船员              │
    │  └─────────────┘                                       │
    └─────────────────────────────────────────────────────────┘
    
    ┌─────────────────────────────────────────────────────────┐
    │                    限定招募                              │
    │  ┌─────────────┐                                       │
    │  │ 消耗限定招募券 │──▶ 随机获得稀有/史诗/传说船员         │
    │  └─────────────┘                                       │
    └─────────────────────────────────────────────────────────┘
```

### 战斗阵容

```
┌─────────────────────────────────────────────────────────────┐
│                      战斗阵容配置                            │
└─────────────────────────────────────────────────────────────┘

    ┌─────┐  ┌─────┐  ┌─────┐
    │ 槽1 │  │ 槽2 │  │ 槽3 │   前排
    └─────┘  └─────┘  └─────┘
    ┌─────┐  ┌─────┐  ┌─────┐
    │ 槽4 │  │ 槽5 │  │ 槽6 │   后排
    └─────┘  └─────┘  └─────┘
    
    最多配置6名船员参战
    主角始终占据一个槽位
```

---

## 9. BaseFacilitySystem - 基地设施系统

### 概述

基地设施系统管理玩家基地中的各种建筑，提供建筑升级和功能解锁。

### 设施类型

```typescript
enum FacilityType {
  COMMAND_CENTER = 'command_center',     // 指挥中心
  ENERGY_CORE = 'energy_core',           // 能源核心
  PRODUCTION_WORKSHOP = 'production_workshop', // 生产车间
  COMM_CENTER = 'comm_center',           // 通讯中心
  TRADING_POST = 'trading_post',         // 交易站
  ARENA = 'arena',                       // 竞技场
  RESEARCH_LAB = 'research_lab',         // 科研实验室
  MINING_PLATFORM = 'mining_platform',   // 采矿平台
  CHIP_CENTER = 'chip_center',           // 芯片研发中心
  GENE_LAB = 'gene_lab',                 // 基因工程实验室
  MARKET = 'market',                     // 星际市场
  RUINS_CENTER = 'ruins_center',         // 遗迹探索中心
}
```

### 设施定义

```typescript
interface FacilityDefinition {
  id: FacilityType;
  name: string;
  description: string;
  maxLevel: number;
  
  // 升级成本
  upgradeCosts: FacilityUpgradeCost[];
  
  // 升级效果
  effects: FacilityEffect[];
  
  // 解锁条件
  requirements?: FacilityRequirement;
}
```

### 设施效果

```typescript
interface FacilityEffect {
  level: number;
  description: string;
  bonuses: {
    type: string;
    value: number;
  }[];
}
```

### 升级流程

```
┌─────────────────────────────────────────────────────────────┐
│                      设施升级流程                            │
└─────────────────────────────────────────────────────────────┘

    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
    │ 检查前置条件 │────▶│ 消耗资源     │────▶│ 升级完成     │
    │ (指挥中心等级)│     │ (信用点+材料) │     │ (解锁效果)   │
    └─────────────┘     └─────────────┘     └─────────────┘
```

---

## 10. MiningSystem - 采矿系统

### 概述

采矿系统允许玩家派遣船员到采矿点进行资源采集。

### 采矿点

```typescript
interface MiningSite {
  id: string;
  name: string;
  description: string;
  
  // 采矿参数
  baseYield: number;           // 基础产量
  yieldMultiplier: number;     // 产量倍率
  duration: number;            // 采矿时长 (分钟)
  
  // 深度系统
  maxDepth: number;            // 最大深度
  
  // 解锁条件
  requiredLevel: number;
  requiredFacility: FacilityType;
}
```

### 采矿任务

```typescript
interface MiningTask {
  siteId: string;
  startTime: number;
  assignedCrew: string[];      // 派遣的船员ID
  currentDepth: number;        // 当前深度
  
  // 随机事件
  pendingEvent?: MiningEvent;
}
```

### 船员加成

```typescript
// 船员采矿效率加成
calculateCrewMiningBonus(crewIds: string[]): number {
  let bonus = 0;
  for (const crewId of crewIds) {
    const crew = getCrewMember(crewId);
    // 根据职业和属性计算加成
    bonus += crew.profession === 'engineer' ? 0.2 : 0.1;
    bonus += crew.stats.mining * 0.01;
  }
  return bonus;
}
```

### 随机事件

```typescript
interface MiningEvent {
  type: MiningEventType;
  description: string;
  
  // 选项
  choices: MiningEventChoice[];
}

enum MiningEventType {
  RICH_VEIN = 'rich_vein',         // 富矿脉
  CAVE_IN = 'cave_in',             // 塌方
  ANCIENT_RUINS = 'ancient_ruins', // 古代遗迹
  GAS_POCKET = 'gas_pocket',       // 瓦斯气穴
  CREATURE_ATTACK = 'creature_attack', // 生物袭击
}
```

---

## 11. ResearchSystem - 科研系统

### 概述

科研系统允许玩家研究各种科技，获得永久性加成和新功能。

### 科研项目

```typescript
interface ResearchProject {
  id: string;
  name: string;
  description: string;
  category: ResearchCategory;
  
  // 研究参数
  duration: number;            // 研究时长 (秒)
  cost: ResearchCost;
  
  // 研究效果
  effects: ResearchEffect[];
  
  // 状态
  status: ResearchStatus;
  progress: number;            // 进度 (0-100)
  startTime?: number;
  
  // 前置条件
  prerequisites: string[];     // 前置研究ID
}
```

### 研究类别

```typescript
enum ResearchCategory {
  COMBAT = 'combat',           // 战斗科技
  RESOURCE = 'resource',       // 资源科技
  EXPLORATION = 'exploration', // 探索科技
  PRODUCTION = 'production',   // 生产科技
  SPECIAL = 'special',         // 特殊科技
}
```

### 研究进度

```
┌─────────────────────────────────────────────────────────────┐
│                      研究进度系统                            │
└─────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────────┐
    │  ████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
    │                    研究进度: 45%                         │
    │                    剩余时间: 2小时30分                    │
    └─────────────────────────────────────────────────────────┘
    
    - 实时更新进度
    - 支持离线研究
    - 研究完成后自动应用效果
```

---

## 12. MarketSystem - 星际市场系统

### 概述

星际市场系统允许玩家与其他玩家进行物品交易。

### 市场挂单

```typescript
interface MarketListing {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  price: number;               // 单价
  sellerId: string;
  sellerName: string;
  listedTime: number;
  expiresAt: number;
}
```

### 玩家挂单

```typescript
interface PlayerListing {
  id: string;
  itemId: string;
  quantity: number;
  price: number;
  status: ListingStatus;
  listedTime: number;
}

enum ListingStatus {
  ACTIVE = 'active',           // 出售中
  SOLD = 'sold',               // 已售出
  CANCELLED = 'cancelled',     // 已取消
  EXPIRED = 'expired',         // 已过期
}
```

### 交易流程

```
┌─────────────────────────────────────────────────────────────┐
│                      市场交易流程                            │
└─────────────────────────────────────────────────────────────┘

卖家:
    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
    │ 选择物品     │────▶│ 设置价格     │────▶│ 确认挂单     │
    │ (背包选择)   │     │ (输入单价)   │     │ (扣除物品)   │
    └─────────────┘     └─────────────┘     └─────────────┘

买家:
    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
    │ 浏览市场     │────▶│ 选择商品     │────▶│ 确认购买     │
    │ (筛选搜索)   │     │ (查看详情)   │     │ (扣除信用点) │
    └─────────────┘     └─────────────┘     └─────────────┘
```

---

## 13. RuinSystem - 遗迹探索系统

### 概述

遗迹探索系统允许玩家探索各种遗迹，获取稀有资源和装备。

### 遗迹类型

```typescript
interface Ruin {
  id: string;
  name: string;
  description: string;
  type: RuinType;
  difficulty: RuinDifficulty;
  
  // 探索参数
  requiredPower: number;       // 推荐战力
  staminaCost: number;         // 体力消耗
  maxAttempts: number;         // 每日次数限制
  
  // 奖励
  rewards: RuinReward[];
  
  // 状态
  isUnlocked: boolean;
  isCleared: boolean;
  remainingAttempts: number;
}

enum RuinType {
  ABANDONED_STATION = 'abandoned_station',   // 废弃空间站
  ANCIENT_RUINS = 'ancient_ruins',           // 古代遗迹
  CRASHED_SHIP = 'crashed_ship',             // 坠毁飞船
  VOID_RIFT = 'void_rift',                   // 虚空裂隙
  DEITY_TEMPLE = 'deity_temple',             // 神明神殿
}

enum RuinDifficulty {
  EASY = 'easy',
  NORMAL = 'normal',
  HARD = 'hard',
  HELL = 'hell',
  NIGHTMARE = 'nightmare',
}
```

### 探索流程

```
┌─────────────────────────────────────────────────────────────┐
│                      遗迹探索流程                            │
└─────────────────────────────────────────────────────────────┘

    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
    │ 选择遗迹     │────▶│ 检查条件     │────▶│ 开始探索     │
    │ (难度选择)   │     │ (战力/体力)   │     │ (进入战斗)   │
    └─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                              ┌────────────────┼────────────────┐
                              │                │                │
                              ▼                ▼                ▼
                       ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
                       │ 战斗胜利     │  │ 战斗失败     │  │ 撤退        │
                       │ 获得奖励     │  │ 损失体力     │  │ 保留进度    │
                       └─────────────┘  └─────────────┘  └─────────────┘
```

---

## 14. QuestSystem - 任务系统

### 概述

任务系统管理游戏中的各种任务，引导玩家进行游戏。

### 任务类型

```typescript
enum QuestType {
  MAIN = 'main',               // 主线任务
  SIDE = 'side',               // 支线任务
  DAILY = 'daily',             // 每日任务
  WEEKLY = 'weekly',           // 每周任务
  ACHIEVEMENT = 'achievement', // 成就任务
}
```

### 任务结构

```typescript
interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  
  // 条件
  conditions: QuestCondition[];
  
  // 奖励
  rewards: QuestReward;
  
  // 状态
  status: QuestStatus;
  progress: number;
  targetProgress: number;
}

interface QuestCondition {
  type: QuestConditionType;
  target: string;
  required: number;
  current: number;
}

enum QuestConditionType {
  DEFEAT_ENEMIES = 'defeat_enemies',       // 击败敌人
  COLLECT_ITEMS = 'collect_items',         // 收集物品
  UPGRADE_FACILITY = 'upgrade_facility',   // 升级设施
  COMPLETE_RUINS = 'complete_ruins',       // 完成遗迹
  REACH_LEVEL = 'reach_level',             // 达到等级
}
```

### 任务流程

```
┌─────────────────────────────────────────────────────────────┐
│                      任务生命周期                            │
└─────────────────────────────────────────────────────────────┘

    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
    │ 任务接取     │────▶│ 进行中       │────▶│ 完成条件     │
    │ (自动/手动)  │     │ (追踪进度)   │     │ (条件满足)   │
    └─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │ 领取奖励     │
                                        │ (任务完成)   │
                                        └─────────────┘
```

---

## 15. ShopSystem - 商店系统

### 概述

商店系统提供物品购买功能，玩家可以使用信用点购买各种物品。

### 商店物品

```typescript
interface ShopItem {
  id: string;
  itemId: string;
  name: string;
  description: string;
  
  // 价格
  price: number;
  currency: CurrencyType;
  
  // 限制
  stock: number;               // 库存 (-1为无限)
  dailyLimit?: number;         // 每日限购
  purchasedToday: number;
  
  // 解锁条件
  requiredLevel?: number;
  requiredFacility?: FacilityType;
}

enum CurrencyType {
  CREDITS = 'credits',         // 信用点
  GEMS = 'gems',               // 宝石
  TICKETS = 'tickets',         // 招募券
}
```

### 商店类型

```
┌─────────────────────────────────────────────────────────────┐
│                      商店分类                                │
└─────────────────────────────────────────────────────────────┘

    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
    │ 基础商店     │  │ 限时商店     │  │ 黑市商店     │
    │ (常驻物品)   │  │ (限时折扣)   │  │ (稀有物品)   │
    └─────────────┘  └─────────────┘  └─────────────┘
```

---

## 16. EnhanceSystem - 装备强化系统

### 概述

装备强化系统允许玩家提升装备的强化等级，增加装备属性。

### 强化规则

```typescript
interface EnhanceConfig {
  maxLevel: number;            // 最大强化等级 (20)
  baseSuccessRate: number;     // 基础成功率
  protectionItemCost: number;  // 保护石消耗
}

// 强化成功率表
const ENHANCE_SUCCESS_RATE = {
  1: 1.0,    // 1级: 100%
  5: 0.9,    // 5级: 90%
  10: 0.7,   // 10级: 70%
  15: 0.5,   // 15级: 50%
  20: 0.3,   // 20级: 30%
};
```

### 强化结果

```typescript
interface EnhanceResult {
  success: boolean;
  type: EnhanceResultType;
  message: string;
  newLevel?: number;
}

enum EnhanceResultType {
  SUCCESS = 'success',         // 成功
  FAIL = 'fail',               // 失败 (等级-1)
  PROTECTED_FAIL = 'protected_fail', // 保护失败 (等级不变)
}
```

### 强化流程

```
┌─────────────────────────────────────────────────────────────┐
│                      装备强化流程                            │
└─────────────────────────────────────────────────────────────┘

    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
    │ 选择装备     │────▶│ 选择保护     │────▶│ 消耗材料     │
    │ (背包选择)   │     │ (是否使用)   │     │ (强化石)     │
    └─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                              ┌────────────────┼────────────────┐
                              │                │                │
                              ▼                ▼                ▼
                       ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
                       │ 强化成功     │  │ 普通失败     │  │ 保护失败     │
                       │ 等级+1      │  │ 等级-1      │  │ 等级不变    │
                       └─────────────┘  └─────────────┘  └─────────────┘
```

---

## 17. DecomposeSystem - 装备分解系统

### 概述

装备分解系统允许玩家将不需要的装备分解为材料。

### 分解奖励

```typescript
interface DecomposeReward {
  baseRewards: {               // 基础奖励
    itemId: string;
    name: string;
    quantity: number;
  }[];
  
  typeBonus?: {                // 类型加成
    itemId: string;
    name: string;
    quantity: number;
  }[];
  
  sublimationBonus?: {         // 升华加成
    itemId: string;
    name: string;
    quantity: number;
  }[];
}
```

### 分解规则

```
┌─────────────────────────────────────────────────────────────┐
│                      分解产出规则                            │
└─────────────────────────────────────────────────────────────┘

基础产出:
    - 根据装备品质决定基础材料数量
    - 普通: 1-2个材料
    - 稀有: 2-4个材料
    - 史诗: 4-6个材料
    - 传说: 6-10个材料

类型加成:
    - 武器 → 攻击材料
    - 防具 → 防御材料
    - 饰品 → 特殊材料

升华加成:
    - 每级升华增加额外材料产出
```

---

## 18. MaterialSynthesisSystem - 材料合成系统

### 概述

材料合成系统允许玩家将低级材料合成为高级材料。

### 合成配方

```typescript
interface SynthesisRecipe {
  id: string;
  name: string;
  
  // 输入材料
  inputs: {
    itemId: string;
    quantity: number;
  }[];
  
  // 输出材料
  output: {
    itemId: string;
    quantity: number;
  };
  
  // 解锁条件
  requiredLevel?: number;
  requiredFacility?: FacilityType;
}
```

### 合成流程

```
┌─────────────────────────────────────────────────────────────┐
│                      材料合成流程                            │
└─────────────────────────────────────────────────────────────┘

    低级材料 ×N  ──────▶  高级材料 ×1
    
    示例:
    星核碎片 ×10  ──────▶  星核结晶 ×1
    基因样本 ×5   ──────▶  基因序列 ×1
```

---

## 19. AutoCollectSystem - 自动采集系统

### 概述

自动采集系统允许玩家挂机自动获取资源。

### 采集模式

```typescript
enum AutoCollectMode {
  RESOURCE = 'resource',       // 资源采集模式
  COMBAT = 'combat',           // 战斗巡逻模式
  BALANCED = 'balanced',       // 平衡模式
}
```

### 采集配置

```typescript
interface AutoCollectConfig {
  mode: AutoCollectMode;
  efficiency: number;          // 效率倍率
  robotLevel: number;          // 机器人等级
}

interface AutoCollectState {
  isActive: boolean;
  locationId: string;
  startTime: number;
  accumulatedRewards: CollectReward;
}
```

### 采集奖励

```typescript
interface CollectReward {
  credits: number;
  experience: number;
  items: {
    itemId: string;
    count: number;
  }[];
}
```

### 挂机收益计算

```
┌─────────────────────────────────────────────────────────────┐
│                      离线收益计算                            │
└─────────────────────────────────────────────────────────────┘

    离线时间 = 当前时间 - 上次保存时间
    有效时间 = min(离线时间, 最大离线时间)
    
    收益 = 基础收益 × 有效时间 × 效率倍率 × 机器人加成
    
    模式差异:
    - 资源模式: 高资源产出, 低经验
    - 战斗模式: 高经验产出, 低资源
    - 平衡模式: 中等资源与经验
```

---

## 20. BattleSystem - 战斗系统

### 概述

战斗系统处理游戏中的所有战斗逻辑，包括回合制战斗和无尽战斗模式。

### 战斗属性

```typescript
interface BattleStats {
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  critRate: number;
  critDamage: number;
  dodgeRate: number;
  hitRate: number;
  penetration: number;
  lifeSteal: number;
}
```

### 战斗流程

```
┌─────────────────────────────────────────────────────────────┐
│                      回合制战斗流程                          │
└─────────────────────────────────────────────────────────────┘

    ┌─────────────┐
    │ 战斗开始     │
    │ 初始化属性   │
    └──────┬──────┘
           │
           ▼
    ┌─────────────────────────────────────────────────────────┐
    │                      战斗循环                            │
    │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
    │  │ 速度排序     │─▶│ 执行行动     │─▶│ 检查结果     │     │
    │  │ (决定顺序)   │  │ (攻击/技能)  │  │ (胜负判定)   │     │
    │  └─────────────┘  └─────────────┘  └──────┬──────┘     │
    │                                            │            │
    │                    ◀───────────────────────┘            │
    │                    (继续战斗)                           │
    └─────────────────────────────────────────────────────────┘
           │
           ▼
    ┌─────────────┐
    │ 战斗结束     │
    │ 结算奖励     │
    └─────────────┘
```

### 伤害计算

```typescript
function calculateDamage(attacker: BattleStats, defender: BattleStats): number {
  // 基础伤害
  let damage = attacker.attack;
  
  // 防御减免
  const defenseReduction = defender.defense / (defender.defense + 100);
  damage = damage * (1 - defenseReduction);
  
  // 穿透效果
  const penetrationReduction = attacker.penetration * 0.01;
  damage = damage * (1 + penetrationReduction);
  
  // 暴击判定
  if (Math.random() < attacker.critRate) {
    damage *= attacker.critDamage;
  }
  
  // 闪避判定
  if (Math.random() < defender.dodgeRate) {
    return 0; // 闪避成功
  }
  
  return Math.floor(damage);
}
```

### 无尽战斗模式

```typescript
interface EndlessBattleState {
  currentWave: number;         // 当前波次
  currentStage: number;        // 当前阶段
  totalKills: number;          // 总击杀数
  accumulatedRewards: {
    credits: number;
    materials: { itemId: string; count: number }[];
  };
}

// Boss波次规则
const BOSS_WAVE_INTERVAL = 10; // 每10波出现Boss
```

#### 战斗奖励

**普通波次奖励**（每波普通敌人）：

| 奖励类型 | 数值 | 说明 |
|----------|------|------|
| 信用点 | 10 | 固定奖励 |
| 经验值 | 10 × 关卡系数 | 关卡系数 = max(1, floor(关卡/10)) |
| 材料 | 1种随机材料 | 数量 = 关卡-1 ~ 关卡+1 |

**Boss战奖励**（每10波Boss）：

| 奖励类型 | 数值 | 说明 |
|----------|------|------|
| 信用点 | 500 × 关卡 | 按关卡倍增 |
| 经验值 | 100 × 关卡系数 | 关卡系数 = max(1, floor(关卡/10)) |
| 材料 | 1种随机材料 | 数量 = 关卡-1 ~ 关卡+1 |

### 材料掉落系统

#### 材料类型与权重

星图战斗掉落的纳米战甲制造材料共10种，掉落权重基于锻造配方总需求量计算：

| 材料ID | 名称 | 掉落权重 | 稀有度 |
|--------|------|----------|--------|
| mat_001 | 星铁基础构件 | 47 | COMMON |
| mat_002 | 星铜传导组件 | 36 | COMMON |
| mat_003 | 钛钢外甲坯料 | 20 | UNCOMMON |
| mat_004 | 战甲能量晶核 | 7 | RARE |
| mat_005 | 稀土传感基质 | 3 | RARE |
| mat_006 | 虚空防护核心 | 4 | RARE |
| mat_007 | 推进模块燃料 | 11 | COMMON |
| mat_008 | 纳米韧化纤维 | 28 | UNCOMMON |
| mat_009 | 陨铁缓冲衬垫 | 9 | UNCOMMON |
| mat_010 | 量子紧固组件 | 13 | RARE |

#### 品质等级系统

材料品质分为5个等级，影响锻造产出的装备属性：

| 品质 | 后缀 | 颜色 | 属性加成 |
|------|------|------|----------|
| 星尘级 | _stardust | 灰白 | 基础属性 |
| 合金级 | _alloy | 浅绿 | +10% 属性 |
| 晶核级 | _crystal | 科技蓝 | +25% 属性 |
| 量子级 | _quantum | 暗紫 | +50% 属性 |
| 虚空级 | _void | 暗金 | +100% 属性 |

#### 品质掉落概率

**普通波次掉落**（参考普通敌人配置）：

| 品质 | 掉落概率 |
|------|----------|
| 星尘级 | 40% |
| 合金级 | 25% |
| 晶核级 | 20% |
| 量子级 | 10% |
| 虚空级 | 5% |

**Boss战掉落**（参考Boss敌人配置）：

| 品质 | 掉落概率 |
|------|----------|
| 星尘级 | 10% |
| 合金级 | 20% |
| 晶核级 | 30% |
| 量子级 | 25% |
| 虚空级 | 15% |

#### 掉落流程

```
┌─────────────────────────────────────────────────────────────┐
│                      材料掉落流程                            │
└─────────────────────────────────────────────────────────────┘

    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
    │ 加权随机     │────▶│ 加权随机     │────▶│ 组合ID      │
    │ 材料类型     │     │ 品质等级     │     │ (mat_XXX_suffix) │
    └─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │ 添加到背包   │
                                        │ 显示掉落提示 │
                                        └─────────────┘

示例：
    材料随机 → mat_006 (虚空防护核心)
    品质随机 → _quantum (量子级)
    最终ID   → mat_006_quantum (量子级虚空防护核心)
```

#### 相关代码位置

- 材料定义：`src/data/items.ts`
- 配方配置：`src/data/nanoArmorRecipes.ts`
- 掉落逻辑：`src/core/GameManager.ts`
  - `calculateWaveRewards()` - 普通波次掉落
  - `handleBossVictory()` - Boss战掉落
  - `endBattleVictory()` - 完整战斗结算（含星球修正）

---

## 系统间交互

### 属性加成来源汇总

```
┌─────────────────────────────────────────────────────────────┐
│                    玩家最终属性计算                          │
└─────────────────────────────────────────────────────────────┘

    基础属性 (Player)
         │
         ├──▶ 装备加成 (EquipmentSystem)
         │
         ├──▶ 芯片加成 (ChipSystem)
         │
         ├──▶ 基因加成 (GeneSystem)
         │
         ├──▶ 义体加成 (CyberneticSystem)
         │
         ├──▶ 船员加成 (CrewSystem)
         │
         ├──▶ 设施加成 (BaseFacilitySystem)
         │
         ├──▶ 科研加成 (ResearchSystem)
         │
         └──▶ 最终属性
```

### 资源流转

```
┌─────────────────────────────────────────────────────────────┐
│                      资源流转图                              │
└─────────────────────────────────────────────────────────────┘

                    ┌─────────────┐
                    │   信用点     │
                    └──────┬──────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │ 商店购买     │ │ 设施升级     │ │ 市场交易     │
    └─────────────┘ └─────────────┘ └─────────────┘
           │               │               │
           ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │ 获得物品     │ │ 解锁功能     │ │ 获得资源     │
    └─────────────┘ └─────────────┘ └─────────────┘
```

---

*本文档最后更新：2026年3月*
