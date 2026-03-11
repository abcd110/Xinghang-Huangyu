# 《星航荒宇》API参考文档

## 概述

本文档提供了《星航荒宇》游戏中所有公开API的详细参考。所有API通过 Zustand Store (`useGameStore`) 进行访问。

---

## 目录

1. [游戏生命周期API](#1-游戏生命周期api)
2. [玩家系统API](#2-玩家系统api)
3. [背包系统API](#3-背包系统api)
4. [装备系统API](#4-装备系统api)
5. [芯片系统API](#5-芯片系统api)
6. [基因系统API](#6-基因系统api)
7. [机械飞升系统API](#7-机械飞升系统api)
8. [船员系统API](#8-船员系统api)
9. [基地设施系统API](#9-基地设施系统api)
10. [采矿系统API](#10-采矿系统api)
11. [科研系统API](#11-科研系统api)
12. [星际市场系统API](#12-星际市场系统api)
13. [遗迹探索系统API](#13-遗迹探索系统api)
14. [任务系统API](#14-任务系统api)
15. [商店系统API](#15-商店系统api)
16. [装备强化系统API](#16-装备强化系统api)
17. [装备分解系统API](#17-装备分解系统api)
18. [材料合成系统API](#18-材料合成系统api)
19. [自动采集系统API](#19-自动采集系统api)
20. [战斗系统API](#20-战斗系统api)
21. [通讯系统API](#21-通讯系统api)
22. [Toast提示系统API](#22-toast提示系统api)

---

## 通用类型定义

### ActionResult

所有操作返回的基础类型：

```typescript
interface ActionResult {
  success: boolean;      // 操作是否成功
  message: string;       // 结果消息
}
```

### 扩展操作结果

```typescript
// 带附加数据的操作结果
interface ActionResultWithData<T> extends ActionResult {
  data?: T;
}
```

---

## 1. 游戏生命周期API

### init

初始化游戏，检查是否存在存档。

```typescript
init(): Promise<void>
```

**示例：**

```typescript
const { init } = useGameStore();

useEffect(() => {
  init();
}, []);
```

---

### newGame

开始新游戏，初始化所有游戏数据。

```typescript
newGame(): void
```

**示例：**

```typescript
const { newGame } = useGameStore();

const handleNewGame = () => {
  newGame();
  navigate('name-input');
};
```

---

### loadGame

加载已保存的游戏数据。

```typescript
loadGame(): Promise<boolean>
```

**返回值：**
- `true` - 加载成功
- `false` - 加载失败或无存档

**示例：**

```typescript
const { loadGame } = useGameStore();

const handleLoadGame = async () => {
  const success = await loadGame();
  if (success) {
    navigate('home');
  }
};
```

---

### saveGame

保存当前游戏状态。

```typescript
saveGame(): Promise<boolean>
```

**返回值：**
- `true` - 保存成功
- `false` - 保存失败

**示例：**

```typescript
const { saveGame } = useGameStore();

// 手动保存
await saveGame();
```

---

## 2. 玩家系统API

### getPlayer

获取玩家实例。

```typescript
getPlayer(): Player
```

**返回值：** Player 实例

**示例：**

```typescript
const { getPlayer } = useGameStore();
const player = getPlayer();

console.log(player.name);
console.log(player.level);
console.log(player.hp);
```

---

### 玩家属性接口

```typescript
interface Player {
  // 基础信息
  name: string;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  
  // 核心属性
  hp: number;
  maxHp: number;
  spirit: number;
  maxSpirit: number;
  
  // 战斗属性
  attack: number;
  defense: number;
  attackSpeed: number;
  critRate: number;
  critDamage: number;
  dodgeRate: number;
  hitRate: number;
  penetration: number;
  lifeSteal: number;
  
  // 资源
  credits: number;
  stamina: number;
  maxStamina: number;
}
```

---

## 3. 背包系统API

### getInventory

获取背包实例。

```typescript
getInventory(): Inventory
```

**返回值：** Inventory 实例

---

### 背包接口

```typescript
interface Inventory {
  items: Map<string, InventoryItem>;
  capacity: number;
  
  // 方法
  addItem(itemId: string, quantity: number): boolean;
  removeItem(itemId: string, quantity: number): boolean;
  getItem(itemId: string): InventoryItem | undefined;
  hasItem(itemId: string, quantity: number): boolean;
  getItemsByType(type: ItemType): InventoryItem[];
  getItemsByRarity(rarity: ItemRarity): InventoryItem[];
}
```

---

### InventoryItem 接口

```typescript
interface InventoryItem extends Item {
  quantity: number;
  equipped: boolean;
  sublimationLevel: number;
  sublimationProgress: number;
  isSublimated: boolean;
  enhanceLevel: number;
  slot?: string;
}
```

---

### useItem

使用消耗品物品。

```typescript
useItem(itemId: string): ActionResult
```

**参数：**
- `itemId` - 物品ID

**示例：**

```typescript
const { useItem } = useGameStore();

const result = useItem('health_potion');
if (result.success) {
  showToast('使用成功，恢复生命值');
}
```

---

### equipItem

装备物品到对应槽位。

```typescript
equipItem(itemId: string): Promise<ActionResult>
```

**参数：**
- `itemId` - 装备ID

**示例：**

```typescript
const { equipItem } = useGameStore();

const handleEquip = async (itemId: string) => {
  const result = await equipItem(itemId);
  if (result.success) {
    showToast('装备成功');
  }
};
```

---

### unequipItem

卸下装备。

```typescript
unequipItem(itemId: string): Promise<ActionResult>
```

**参数：**
- `itemId` - 装备ID

---

## 4. 装备系统API

### equipMythologyItem

装备神话装备到指定槽位。

```typescript
equipMythologyItem(equipmentId: string, slot: EquipmentSlot): ActionResult
```

**参数：**
- `equipmentId` - 装备ID
- `slot` - 装备槽位

**槽位类型：**

```typescript
enum EquipmentSlot {
  WEAPON = 'weapon',
  HEAD = 'head',
  BODY = 'body',
  LEGS = 'legs',
  FEET = 'feet',
  ACCESSORY_1 = 'accessory_1',
  ACCESSORY_2 = 'accessory_2',
}
```

---

### unequipMythologyItem

卸下指定槽位的装备。

```typescript
unequipMythologyItem(slot: EquipmentSlot): ActionResult
```

---

### getMythologyEquipmentBySlot

获取指定槽位的装备。

```typescript
getMythologyEquipmentBySlot(slot: EquipmentSlot): EquipmentInstance | undefined
```

---

### enhanceMythologyEquipment

强化指定槽位的装备。

```typescript
enhanceMythologyEquipment(slot: EquipmentSlot): ActionResult & { newLevel?: number }
```

---

### sublimateMythologyEquipment

升华指定槽位的装备。

```typescript
sublimateMythologyEquipment(slot: EquipmentSlot): ActionResult & { newLevel?: number }
```

---

## 5. 芯片系统API

### getChips

获取所有芯片。

```typescript
getChips(): Chip[]
```

---

### getEquippedChips

获取已装备的芯片。

```typescript
getEquippedChips(): Chip[]
```

---

### getAvailableChipSlots

获取可用的芯片槽位数量。

```typescript
getAvailableChipSlots(): number
```

---

### craftChip

制作芯片。

```typescript
craftChip(
  slot: ChipSlot,
  rarity: ChipRarity
): ActionResult & { chip?: Chip }
```

**参数：**
- `slot` - 芯片槽位类型
- `rarity` - 芯片品质

**芯片槽位：**

```typescript
enum ChipSlot {
  ATTACK = 'attack',
  DEFENSE = 'defense',
  LIFE = 'life',
  SPEED = 'speed',
  CRIT = 'crit',
  SPECIAL = 'special',
}
```

**芯片品质：**

```typescript
enum ChipRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}
```

**示例：**

```typescript
const { craftChip } = useGameStore();

const result = craftChip(ChipSlot.ATTACK, ChipRarity.RARE);
if (result.success && result.chip) {
  console.log('制作成功:', result.chip);
}
```

---

### upgradeChip

升级芯片等级。

```typescript
upgradeChip(chipId: string, materialCount: number): ActionResult & { newLevel?: number }
```

---

### equipChip

装备芯片。

```typescript
equipChip(chipId: string): ActionResult
```

---

### unequipChip

卸下芯片。

```typescript
unequipChip(slot: ChipSlot): ActionResult
```

---

### decomposeChip

分解芯片。

```typescript
decomposeChip(chipId: string): ActionResult & { rewards?: string }
```

---

### enhanceChip

强化芯片副属性。

```typescript
enhanceChip(chipId: string, subStatIndex: number): ActionResult
```

---

### rerollChipSubStat

重随芯片副属性。

```typescript
rerollChipSubStat(chipId: string, subStatIndex: number): ActionResult & { newValue?: number }
```

---

### rerollAllChipSubStats

重随芯片所有副属性。

```typescript
rerollAllChipSubStats(chipId: string): ActionResult
```

---

### toggleChipLock

切换芯片锁定状态。

```typescript
toggleChipLock(chipId: string): ActionResult & { locked?: boolean }
```

---

### getChipSetBonuses

获取芯片套装加成。

```typescript
getChipSetBonuses(): { set: ChipSet; count: number; bonuses: string[] }[]
```

---

### getChipStatBonus

获取芯片属性加成总计。

```typescript
getChipStatBonus(): Record<string, number>
```

---

## 6. 基因系统API

### getGeneNodes

获取基因节点（旧版）。

```typescript
getGeneNodes(): GeneNode[]
```

---

### upgradeGeneNode

升级基因节点（旧版）。

```typescript
upgradeGeneNode(nodeId: string): ActionResult & { newValue?: number }
```

---

### getGeneTotalStats

获取基因总属性加成（旧版）。

```typescript
getGeneTotalStats(): Record<GeneType, number>
```

---

### getGeneSystemState

获取基因系统状态（V2）。

```typescript
getGeneSystemState(): GeneSystemState
```

---

### getActiveChromosome

获取当前激活的染色体。

```typescript
getActiveChromosome(): Chromosome | null
```

---

### switchChromosome

切换染色体。

```typescript
switchChromosome(chromosomeId: string): boolean
```

---

### replaceNucleotideBase

替换碱基对。

```typescript
replaceNucleotideBase(
  chromosomeId: string,
  position: number,
  newBase: BasePair
): ActionResult
```

---

### getLifeStealPercent

获取生命偷取百分比。

```typescript
getLifeStealPercent(context?: BattleContext): number
```

---

### getGeneStatsBonus

获取基因属性加成。

```typescript
getGeneStatsBonus(context?: BattleContext): Record<string, number>
```

---

### getActiveGeneFragments

获取激活的基因片段。

```typescript
getActiveGeneFragments(context?: BattleContext): GeneFragment[]
```

---

### getGeneFragments

获取所有基因片段。

```typescript
getGeneFragments(): GeneFragment[]
```

---

### getChromosomeIntegrity

获取染色体完整度。

```typescript
getChromosomeIntegrity(chromosomeId?: string): number
```

---

## 7. 机械飞升系统API

### getImplants

获取所有义体。

```typescript
getImplants(): Implant[]
```

---

### getEquippedImplants

获取已装备的义体。

```typescript
getEquippedImplants(): Implant[]
```

---

### getAvailableImplantSlots

获取可用的义体槽位。

```typescript
getAvailableImplantSlots(): ImplantType[]
```

---

### craftImplant

制作义体。

```typescript
craftImplant(
  type: ImplantType,
  rarity: ImplantRarity
): ActionResult & { implant?: Implant }
```

**义体类型：**

```typescript
enum ImplantType {
  NEURAL = 'neural',
  SKELETAL = 'skeletal',
  MUSCULAR = 'muscular',
  SENSORY = 'sensory',
  CARDIOVASCULAR = 'cardiovascular',
  INTEGRATED = 'integrated',
}
```

---

### upgradeImplant

升级义体。

```typescript
upgradeImplant(implantId: string): ActionResult & { newLevel?: number }
```

---

### equipImplant

装备义体。

```typescript
equipImplant(implantId: string): ActionResult
```

---

### unequipImplant

卸下义体。

```typescript
unequipImplant(type: ImplantType): ActionResult
```

---

### decomposeImplant

分解义体。

```typescript
decomposeImplant(implantId: string): ActionResult & { rewards?: string }
```

---

### getImplantTotalStats

获取义体总属性加成。

```typescript
getImplantTotalStats(): Record<string, number>
```

---

### getCraftableImplantRarities

获取可制作的义体品质。

```typescript
getCraftableImplantRarities(): ImplantRarity[]
```

---

### getEquippedImplantEffects

获取已装备义体的特殊效果。

```typescript
getEquippedImplantEffects(): { implant: Implant; effect: NonNullable<Implant['specialEffect']> }[]
```

---

### toggleImplantLock

切换义体锁定状态。

```typescript
toggleImplantLock(implantId: string): ActionResult & { locked?: boolean }
```

---

## 8. 船员系统API

### getCrewMembers

获取所有船员。

```typescript
getCrewMembers(): CrewMember[]
```

---

### getBattleCrew

获取战斗阵容中的船员。

```typescript
getBattleCrew(): CrewMember[]
```

---

### getCrewCapacity

获取船员容量上限。

```typescript
getCrewCapacity(): number
```

---

### getRecruitTicketCount

获取招募券数量。

```typescript
getRecruitTicketCount(recruitType: RecruitType): number
```

**招募类型：**

```typescript
enum RecruitType {
  NORMAL = 'normal',
  LIMITED = 'limited',
}
```

---

### recruitCrew

招募船员（单抽）。

```typescript
recruitCrew(recruitType: RecruitType): ActionResult & { crew?: CrewMember; rarity?: string }
```

---

### recruitCrewTen

招募船员（十连）。

```typescript
recruitCrewTen(recruitType: RecruitType): ActionResult & { crews?: CrewMember[] }
```

---

### setCrewBattleSlot

设置船员战斗槽位。

```typescript
setCrewBattleSlot(crewId: string, slot: number): ActionResult
```

**参数：**
- `crewId` - 船员ID
- `slot` - 槽位编号 (1-6)

---

### dismissCrew

解雇船员。

```typescript
dismissCrew(crewId: string): ActionResult
```

---

## 9. 基地设施系统API

### getFacilityLevel

获取设施等级。

```typescript
getFacilityLevel(facilityId: FacilityType): number
```

**设施类型：**

```typescript
enum FacilityType {
  COMMAND_CENTER = 'command_center',
  ENERGY_CORE = 'energy_core',
  PRODUCTION_WORKSHOP = 'production_workshop',
  COMM_CENTER = 'comm_center',
  TRADING_POST = 'trading_post',
  ARENA = 'arena',
  RESEARCH_LAB = 'research_lab',
  MINING_PLATFORM = 'mining_platform',
  CHIP_CENTER = 'chip_center',
  GENE_LAB = 'gene_lab',
  MARKET = 'market',
  RUINS_CENTER = 'ruins_center',
}
```

---

### getEnergyCoreEfficiency

获取能源核心效率。

```typescript
getEnergyCoreEfficiency(): number
```

---

### getWarehouseCapacity

获取仓库容量。

```typescript
getWarehouseCapacity(): number
```

---

### getMedicalRecoveryBonus

获取医疗恢复加成。

```typescript
getMedicalRecoveryBonus(): number
```

---

### getMedicalEfficiency

获取医疗效率详情。

```typescript
getMedicalEfficiency(): {
  level: number;
  hpRecoveryBase: number;
  hpRecoveryActual: number;
  staminaRecoveryBase: number;
  staminaRecoveryActual: number;
  staminaRegenBase: number;
  staminaRegenActual: number;
  bonusPercent: number;
}
```

---

### getFacilityUpgradePreview

获取设施升级预览。

```typescript
getFacilityUpgradePreview(facilityId: FacilityType): {
  canUpgrade: boolean;
  reason?: string;
  currentLevel: number;
  nextLevel?: number;
  cost?: { credits: number; materials: { itemId: string; count: number }[] };
  effect?: { description: string; value: number };
}
```

---

### upgradeFacility

升级设施。

```typescript
upgradeFacility(facilityId: FacilityType): ActionResult & { newLevel?: number }
```

---

### getAllFacilities

获取所有设施状态。

```typescript
getAllFacilities(): FacilityState[]
```

---

### getFacilityDefinition

获取设施定义。

```typescript
getFacilityDefinition(facilityId: FacilityType): FacilityDefinition | undefined
```

---

## 10. 采矿系统API

### getAvailableMiningSites

获取可用的采矿点。

```typescript
getAvailableMiningSites(): MiningSite[]
```

---

### getMiningTasks

获取当前采矿任务。

```typescript
getMiningTasks(): MiningTask[]
```

---

### startMining

开始采矿（无船员）。

```typescript
startMining(siteId: string): ActionResult
```

---

### startMiningWithCrew

开始采矿（派遣船员）。

```typescript
startMiningWithCrew(
  siteId: string,
  crewIds: string[]
): ActionResult & { task?: MiningTask }
```

---

### collectMining

收集采矿产出。

```typescript
collectMining(siteId: string): ActionResult & {
  yield?: number;
  mineral?: string;
  depth?: number;
  events?: number;
}
```

---

### cancelMining

取消采矿任务。

```typescript
cancelMining(siteId: string): ActionResult
```

---

### processMiningRandomEvent

处理采矿随机事件。

```typescript
processMiningRandomEvent(siteId: string): {
  event: string;
  message: string;
  bonus?: number;
  items?: { itemId: string; count: number }[];
} | null
```

---

### calculateCrewMiningBonus

计算船员采矿加成。

```typescript
calculateCrewMiningBonus(crewIds: string[]): number
```

---

## 11. 科研系统API

### getResearchProjects

获取所有科研项目。

```typescript
getResearchProjects(): ResearchProject[]
```

---

### getActiveResearch

获取进行中的科研项目。

```typescript
getActiveResearch(): ResearchProject[]
```

---

### startResearch

开始科研项目。

```typescript
startResearch(projectId: string): ActionResult
```

---

### cancelResearch

取消科研项目。

```typescript
cancelResearch(projectId: string): ActionResult
```

---

### getResearchBonus

获取科研加成。

```typescript
getResearchBonus(type: string): number
```

---

## 12. 星际市场系统API

### getMarketListings

获取市场挂单列表。

```typescript
getMarketListings(): MarketListing[]
```

---

### getPlayerListings

获取玩家自己的挂单。

```typescript
getPlayerListings(): PlayerListing[]
```

---

### getMarketTransactions

获取市场交易记录。

```typescript
getMarketTransactions(): MarketTransaction[]
```

---

### listMarketItem

挂单出售物品。

```typescript
listMarketItem(
  itemId: string,
  quantity: number,
  price: number
): ActionResult & { listing?: PlayerListing }
```

---

### cancelMarketListing

取消挂单。

```typescript
cancelMarketListing(listingId: string): ActionResult
```

---

### buyMarketItem

购买市场物品。

```typescript
buyMarketItem(listingId: string): ActionResult
```

---

### refreshMarket

刷新市场列表。

```typescript
refreshMarket(): ActionResult
```

---

## 13. 遗迹探索系统API

### getRuins

获取所有遗迹。

```typescript
getRuins(): Ruin[]
```

---

### getRuinRemainingAttempts

获取遗迹剩余挑战次数。

```typescript
getRuinRemainingAttempts(ruinType: string): number
```

---

### getRuinPreview

获取遗迹挑战预览。

```typescript
getRuinPreview(ruinId: string): {
  success: boolean;
  message: string;
  preview?: {
    ruin: Ruin;
    successRate: number;
    remainingAttempts: number;
    isFirstClear: boolean;
  };
}
```

---

### challengeRuin

挑战遗迹。

```typescript
challengeRuin(ruinId: string): ActionResult & {
  rewards?: {
    credits: number;
    items: { itemId: string; count: number }[];
    experience: number;
  };
  isFirstClear?: boolean;
  isSuccess?: boolean;
}
```

---

### updateRuinBattleResult

更新遗迹战斗结果。

```typescript
updateRuinBattleResult(
  ruinId: string,
  victory: boolean,
  isFirstClear: boolean
): void
```

---

## 14. 任务系统API

### getQuests

获取任务列表。

```typescript
getQuests(): Quest[]
```

---

### claimQuestReward

领取任务奖励。

```typescript
claimQuestReward(questId: string): ActionResult
```

---

## 15. 商店系统API

### getShopItems

获取商店物品列表。

```typescript
getShopItems(): ShopItem[]
```

---

### buyItem

购买商店物品。

```typescript
buyItem(itemId: string, quantity?: number): ActionResult
```

**参数：**
- `itemId` - 物品ID
- `quantity` - 购买数量（默认为1）

**示例：**

```typescript
const { buyItem } = useGameStore();

const result = buyItem('recruit_ticket_normal', 10);
if (result.success) {
  showToast('购买成功');
}
```

---

## 16. 装备强化系统API

### enhanceItem

强化装备。

```typescript
enhanceItem(
  itemId: string,
  useProtection?: boolean
): EnhanceResult
```

**参数：**
- `itemId` - 装备ID
- `useProtection` - 是否使用保护石（默认false）

**返回值：**

```typescript
interface EnhanceResult {
  success: boolean;
  type: EnhanceResultType;
  message: string;
  newLevel?: number;
}

enum EnhanceResultType {
  SUCCESS = 'success',
  FAIL = 'fail',
  PROTECTED_FAIL = 'protected_fail',
}
```

---

### getEnhancePreview

获取强化预览。

```typescript
getEnhancePreview(itemId: string): EnhancePreview
```

---

## 17. 装备分解系统API

### decomposeItem

分解装备。

```typescript
decomposeItem(itemId: string): ActionResult & {
  rewards?: { itemId: string; name: string; quantity: number }[];
}
```

---

### getDecomposePreview

获取分解预览。

```typescript
getDecomposePreview(itemId: string): {
  success: boolean;
  preview?: {
    baseRewards: { itemId: string; name: string; quantity: number }[];
    typeBonus: { itemId: string; name: string; quantity: number }[];
    sublimationBonus: { itemId: string; name: string; quantity: number }[];
  };
  message?: string;
}
```

---

## 18. 材料合成系统API

### craftItem

制造物品。

```typescript
craftItem(
  slot: EquipmentSlot,
  selection: MaterialSelection
): ActionResult
```

---

### sublimateItem

升华装备。

```typescript
sublimateItem(itemId: string): Promise<ActionResult & { levelUp?: boolean }>
```

---

## 19. 自动采集系统API

### startAutoCollect

开始自动采集。

```typescript
startAutoCollect(
  locationId: string,
  mode: AutoCollectMode
): ActionResult
```

**采集模式：**

```typescript
enum AutoCollectMode {
  RESOURCE = 'resource',
  COMBAT = 'combat',
  BALANCED = 'balanced',
}
```

---

### stopAutoCollect

停止自动采集。

```typescript
stopAutoCollect(): ActionResult & { rewards?: CollectReward }
```

---

### claimAutoCollectRewards

领取自动采集奖励。

```typescript
claimAutoCollectRewards(): ActionResult & { rewards?: CollectReward }
```

---

### getAutoCollectState

获取自动采集状态。

```typescript
getAutoCollectState(): AutoCollectState
```

---

### getAutoCollectConfig

获取自动采集配置。

```typescript
getAutoCollectConfig(): AutoCollectConfig
```

---

### updateAutoCollectConfig

更新自动采集配置。

```typescript
updateAutoCollectConfig(config: Partial<AutoCollectConfig>): void
```

---

### getAutoCollectDuration

获取自动采集持续时间。

```typescript
getAutoCollectDuration(): string
```

---

### getEstimatedHourlyRewards

获取预估每小时收益。

```typescript
getEstimatedHourlyRewards(): CollectReward
```

---

### getAvailableCollectLocations

获取可用的采集地点。

```typescript
getAvailableCollectLocations(): CollectLocation[]
```

---

## 20. 战斗系统API

### startBattle

开始战斗。

```typescript
startBattle(
  locationId: string,
  isBoss?: boolean,
  isElite?: boolean
): ActionResult & { enemy?: ExpandedEnemy }
```

---

### endBattleVictory

战斗胜利结算。

```typescript
endBattleVictory(enemy: ExpandedEnemy): {
  exp: number;
  loot: { itemId: string; quantity: number; name: string }[];
  logs: string[];
}
```

---

### attemptEscape

尝试逃跑。

```typescript
attemptEscape(enemy: ExpandedEnemy): ActionResult & { logs: string[] }
```

---

### startEndlessWaveBattle

开始无尽战斗波次。

```typescript
startEndlessWaveBattle(): ActionResult & { enemy?: any }
```

---

### startEndlessBossBattle

开始无尽战斗Boss战。

```typescript
startEndlessBossBattle(): ActionResult & { enemy?: any }
```

---

### handleWaveVictory

处理波次胜利。

```typescript
handleWaveVictory(): {
  credits: number;
  materials: { itemId: string; count: number }[];
}
```

---

### handleBossVictory

处理Boss胜利。

```typescript
handleBossVictory(): {
  credits: number;
  materials: { itemId: string; count: number }[];
}
```

---

### getEndlessStageLevel

获取无尽战斗当前阶段。

```typescript
getEndlessStageLevel(): number
```

---

### getEndlessWaveNumber

获取无尽战斗当前波次。

```typescript
getEndlessWaveNumber(): number
```

---

## 21. 通讯系统API

### getCommEvents

获取通讯事件列表。

```typescript
getCommEvents(): CommEvent[]
```

---

### scanCommSignals

扫描通讯信号。

```typescript
scanCommSignals(): ActionResult & { newEvents?: CommEvent[] }
```

---

### respondToCommEvent

响应通讯事件。

```typescript
respondToCommEvent(eventId: string): ActionResult & { rewards?: string }
```

---

### ignoreCommEvent

忽略通讯事件。

```typescript
ignoreCommEvent(eventId: string): ActionResult
```

---

### getCommScanCooldown

获取通讯扫描冷却时间。

```typescript
getCommScanCooldown(): number
```

---

## 22. Toast提示系统API

### showToast

显示提示消息。

```typescript
showToast(
  message: string,
  type?: ToastType,
  duration?: number
): void
```

**参数：**
- `message` - 提示消息内容
- `type` - 消息类型（默认 'info'）
- `duration` - 显示时长（毫秒，默认 2000）

**消息类型：**

```typescript
type ToastType = 'info' | 'success' | 'warning' | 'error';
```

**示例：**

```typescript
const { showToast } = useGameStore();

// 普通提示
showToast('操作成功');

// 成功提示
showToast('购买成功', 'success');

// 警告提示
showToast('资源不足', 'warning', 3000);

// 错误提示
showToast('操作失败', 'error');
```

---

### removeToast

移除提示消息。

```typescript
removeToast(id: string): void
```

---

## 使用示例

### 完整的组件使用示例

```tsx
import { useGameStore } from '../stores/gameStore';

function MyComponent() {
  const {
    getPlayer,
    getInventory,
    buyItem,
    showToast,
    saveGame,
  } = useGameStore();

  const player = getPlayer();
  const inventory = getInventory();

  const handlePurchase = async (itemId: string, price: number) => {
    if (player.credits < price) {
      showToast('信用点不足', 'warning');
      return;
    }

    const result = buyItem(itemId);
    if (result.success) {
      showToast('购买成功', 'success');
      await saveGame();
    } else {
      showToast(result.message, 'error');
    }
  };

  return (
    <div>
      <p>玩家: {player.name}</p>
      <p>等级: {player.level}</p>
      <p>信用点: {player.credits}</p>
      
      <button onClick={() => handlePurchase('item_001', 100)}>
        购买物品
      </button>
    </div>
  );
}
```

### 状态订阅示例

```tsx
import { useGameStore } from '../stores/gameStore';

function PlayerInfo() {
  // 只订阅需要的属性，避免不必要的重渲染
  const playerName = useGameStore(state => state.getPlayer().name);
  const credits = useGameStore(state => state.getPlayer().credits);
  
  return (
    <div>
      <p>{playerName}</p>
      <p>{credits} 信用点</p>
    </div>
  );
}
```

---

## 错误处理

所有API都遵循统一的错误处理模式：

```typescript
const result = someApiCall();

if (!result.success) {
  // 处理错误
  console.error(result.message);
  showToast(result.message, 'error');
}
```

---

*本文档最后更新：2026年3月*
