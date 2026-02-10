import { create } from 'zustand';
import { GameManager, type GameState } from '../core/GameManager';
import { GameStorage } from '../core/Storage';
import type { Location } from '../data/types';
import { AutoCollectMode, CollectReward } from '../data/autoCollectTypes';
import type { ToastMessage } from '../components/Toast';

interface GameStore {
  // 游戏实例
  gameManager: GameManager;

  // 状态
  isLoading: boolean;
  hasSave: boolean;
  logs: string[];

  // Toast 提示
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type'], duration?: number) => void;
  removeToast: (id: string) => void;

  // 操作方法
  init: () => Promise<void>;
  newGame: () => void;
  loadGame: () => Promise<boolean>;
  saveGame: () => Promise<boolean>;

  // 游戏操作
  rest: () => { success: boolean; message: string; logs: string[] };
  explore: (locationId: string, exploreType?: 'search' | 'hunt' | 'chest') => {
    success: boolean;
    message: string;
    logs: string[];
    foundItems?: { itemId: string; name: string; quantity: number }[];
    exp?: number;
    treasureFound?: boolean;
    treasureCoins?: number;
  };
  useItem: (itemId: string) => { success: boolean; message: string };
  equipItem: (itemId: string) => Promise<{ success: boolean; message: string }>;
  unequipItem: (itemId: string) => Promise<{ success: boolean; message: string }>;

  // 任务系统
  claimQuestReward: (questId: string) => { success: boolean; message: string };

  // 商店系统
  buyItem: (itemId: string, quantity?: number) => { success: boolean; message: string };

  // 制造系统
  craftItem: (slot: import('../data/equipmentTypes').EquipmentSlot, selection: import('../core/CraftingSystem').MaterialSelection) => { success: boolean; message: string };

  // 分解系统
  decomposeItem: (itemId: string) => { success: boolean; message: string; rewards?: any[] };
  getDecomposePreview: (itemId: string) => { success: boolean; preview?: any; message?: string };

  // 升华系统
  sublimateItem: (itemId: string) => Promise<{ success: boolean; message: string; levelUp?: boolean }>;

  // 装备强化系统
  enhanceItem: (itemId: string, useProtection?: boolean) => import('../core/EnhanceSystem').EnhanceResult;
  getEnhancePreview: (itemId: string) => import('../core/EnhanceSystem').EnhancePreview;

  // 神话装备系统
  equipMythologyItem: (equipmentId: string, slot: import('../data/equipmentTypes').EquipmentSlot) => { success: boolean; message: string };
  unequipMythologyItem: (slot: import('../data/equipmentTypes').EquipmentSlot) => { success: boolean; message: string };
  getMythologyEquipmentBySlot: (slot: import('../data/equipmentTypes').EquipmentSlot) => import('../core/EquipmentSystem').EquipmentInstance | undefined;
  enhanceMythologyEquipment: (slot: import('../data/equipmentTypes').EquipmentSlot) => { success: boolean; message: string; newLevel?: number };
  sublimateMythologyEquipment: (slot: import('../data/equipmentTypes').EquipmentSlot) => { success: boolean; message: string; newLevel?: number };

  // 列车系统
  repairTrain: () => { success: boolean; message: string };
  upgradeTrain: (type: any) => { success: boolean; message: string };

  // 战斗系统
  startBattle: (locationId: string, isBoss?: boolean, isElite?: boolean) => { success: boolean; message: string; enemy?: any };
  endBattleVictory: (enemy: any) => { exp: number; loot: any[]; logs: string[] };
  attemptEscape: (enemy: any) => { success: boolean; message: string; logs: string[] };

  // 自动采集系统
  startAutoCollect: (locationId: string, mode: AutoCollectMode) => { success: boolean; message: string };
  stopAutoCollect: () => { success: boolean; message: string; rewards?: CollectReward };
  claimAutoCollectRewards: () => { success: boolean; message: string; rewards?: CollectReward };
  getAutoCollectState: () => GameManager['autoCollectSystem']['state'];
  getAutoCollectConfig: () => GameManager['autoCollectSystem']['config'];
  updateAutoCollectConfig: (config: Partial<GameManager['autoCollectSystem']['config']>) => void;
  getAutoCollectDuration: () => string;
  getEstimatedHourlyRewards: () => CollectReward;
  getAvailableCollectLocations: () => import('../data/autoCollectTypes').CollectLocation[];

  // 获取器
  getPlayer: () => GameManager['player'];
  getInventory: () => GameManager['inventory'];
  getCurrentLocation: () => Location | undefined;
  isGameOver: () => boolean;
  getQuests: () => GameManager['quests'];
  getShopItems: () => GameManager['shopItems'];
}

export const useGameStore = create<GameStore>((set, get) => {
  // 辅助函数：执行游戏操作后更新状态
  const executeGameAction = <T extends { success: boolean; message: string }>(
    action: () => T,
    save: boolean = true
  ): T => {
    const { gameManager } = get();
    const result = action();
    if (save) {
      get().saveGame();
    }
    set({ logs: gameManager.logs });
    return result;
  };

  // 辅助函数：异步执行游戏操作后更新状态
  const executeGameActionAsync = async <T extends { success: boolean; message: string }>(
    action: () => Promise<T>,
    save: boolean = true
  ): Promise<T> => {
    const { gameManager } = get();
    const result = await action();
    if (save) {
      await get().saveGame();
    }
    set({ logs: gameManager.logs });
    return result;
  };

  return {
    // 初始状态
    gameManager: new GameManager(),
    isLoading: false,
    hasSave: false,
    logs: [],
    toasts: [],

    // Toast 提示方法
    showToast: (message: string, type: ToastMessage['type'] = 'info', duration: number = 2000) => {
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const newToast: ToastMessage = { id, message, type, duration };
      set((state) => ({ toasts: [...state.toasts, newToast] }));
    },
    removeToast: (id: string) => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    },

    // 初始化
    init: async () => {
      const hasSave = await GameStorage.hasSave();
      const { gameManager } = get();
      set({ hasSave, logs: gameManager.logs });
    },

    // 新游戏
    newGame: () => {
      const { gameManager } = get();
      gameManager.newGame();
      set({ hasSave: true, logs: gameManager.logs });
    },

    // 加载游戏
    loadGame: async () => {
      set({ isLoading: true });
      try {
        const saveData = await GameStorage.loadGame();
        if (saveData) {
          const { gameManager } = get();
          gameManager.loadGame(saveData);
          set({ hasSave: true, logs: gameManager.logs });
          return true;
        }
        return false;
      } catch (error) {
        console.error('Failed to load game:', error);
        return false;
      } finally {
        set({ isLoading: false });
      }
    },

    // 保存游戏
    saveGame: async () => {
      const { gameManager } = get();
      const state = gameManager.saveGame();
      return await GameStorage.saveGame(state);
    },

    // 休息
    rest: () => executeGameAction(() => get().gameManager.rest()),

    // 探索
    explore: (locationId: string, exploreType: 'search' | 'hunt' | 'chest' = 'search') =>
      executeGameAction(() => get().gameManager.explore(locationId, exploreType)),

    // 使用物品
    useItem: (itemId: string) =>
      executeGameAction(() => get().gameManager.useItem(itemId)),

    // 装备物品
    equipItem: async (itemId: string) =>
      executeGameActionAsync(async () => get().gameManager.equipItem(itemId)),

    // 卸下装备
    unequipItem: async (itemId: string) =>
      executeGameActionAsync(async () => get().gameManager.unequipItem(itemId)),

    // 领取任务奖励
    claimQuestReward: (questId: string) =>
      executeGameAction(() => get().gameManager.claimQuestReward(questId)),

    // 购买物品
    buyItem: (itemId: string, quantity: number = 1) =>
      executeGameAction(() => get().gameManager.buyItem(itemId, quantity)),

    // 制造物品
    craftItem: (slot: import('../data/equipmentTypes').EquipmentSlot, selection: import('../core/CraftingSystem').MaterialSelection) =>
      executeGameAction(() => get().gameManager.craftItem(slot, selection)),

    // 分解装备
    decomposeItem: (itemId: string) =>
      executeGameAction(() => get().gameManager.decomposeItem(itemId)),

    // 获取分解预览
    getDecomposePreview: (itemId: string) => {
      const { gameManager } = get();
      return gameManager.getDecomposePreview(itemId);
    },

    // 装备升华
    sublimateItem: async (itemId: string) =>
      executeGameActionAsync(async () => get().gameManager.sublimateItem(itemId)),

    // 装备强化
    enhanceItem: (itemId: string, useProtection: boolean = false) =>
      executeGameAction(() => get().gameManager.enhanceItem(itemId, useProtection)),

    // 获取强化预览
    getEnhancePreview: (itemId: string) => {
      const { gameManager } = get();
      return gameManager.getEnhancePreview(itemId);
    },

    // 神话装备系统
    equipMythologyItem: (equipmentId: string, slot: import('../data/equipmentTypes').EquipmentSlot) =>
      executeGameAction(() => get().gameManager.equipMythologyItem(equipmentId, slot)),

    unequipMythologyItem: (slot: import('../data/equipmentTypes').EquipmentSlot) =>
      executeGameAction(() => get().gameManager.unequipMythologyItem(slot)),

    getMythologyEquipmentBySlot: (slot: import('../data/equipmentTypes').EquipmentSlot) => {
      const { gameManager } = get();
      return gameManager.player.getEquipmentBySlot(slot);
    },

    enhanceMythologyEquipment: (slot: import('../data/equipmentTypes').EquipmentSlot) =>
      executeGameAction(() => get().gameManager.enhanceMythologyEquipment(slot)),

    sublimateMythologyEquipment: (slot: import('../data/equipmentTypes').EquipmentSlot) =>
      executeGameAction(() => get().gameManager.sublimateMythologyEquipment(slot)),

    // 修复列车
    repairTrain: () =>
      executeGameAction(() => get().gameManager.repairTrain()),

    // 升级列车
    upgradeTrain: (type: any) =>
      executeGameAction(() => get().gameManager.upgradeTrain(type)),

    // 战斗系统
    startBattle: (locationId: string, isBoss: boolean = false, isElite: boolean = false) =>
      executeGameAction(() => get().gameManager.startBattle(locationId, isBoss, isElite)),

    endBattleVictory: (enemy: any) => {
      const { gameManager } = get();
      const result = gameManager.endBattleVictory(enemy);
      // 战斗胜利后恢复生命值至满（包含装备加成）
      gameManager.player.hp = gameManager.player.totalMaxHp;
      get().saveGame();
      set({ logs: gameManager.logs });
      return result;
    },

    attemptEscape: (enemy: any) =>
      executeGameAction(() => get().gameManager.attemptEscape(enemy)),

    // 自动采集系统
    startAutoCollect: (locationId: string, mode: AutoCollectMode) =>
      executeGameAction(() => get().gameManager.startAutoCollect(locationId, mode)),

    stopAutoCollect: () =>
      executeGameAction(() => get().gameManager.stopAutoCollect()),

    claimAutoCollectRewards: () =>
      executeGameAction(() => get().gameManager.claimAutoCollectRewards()),

    getAutoCollectState: () => get().gameManager.getAutoCollectState(),
    getAutoCollectConfig: () => get().gameManager.getAutoCollectConfig(),
    updateAutoCollectConfig: (config: Partial<GameManager['autoCollectSystem']['config']>) => {
      const { gameManager } = get();
      gameManager.updateAutoCollectConfig(config);
    },
    getAutoCollectDuration: () => get().gameManager.getAutoCollectDuration(),
    getEstimatedHourlyRewards: () => get().gameManager.getEstimatedHourlyRewards(),
    getAvailableCollectLocations: () => get().gameManager.getAvailableCollectLocations(),

    // 获取器
    getPlayer: () => get().gameManager.player,
    getInventory: () => get().gameManager.inventory,
    getCurrentLocation: () => get().gameManager.getCurrentLocation(),
    isGameOver: () => get().gameManager.isGameOver,
    getQuests: () => get().gameManager.quests,
    getShopItems: () => get().gameManager.shopItems,
  };
});
