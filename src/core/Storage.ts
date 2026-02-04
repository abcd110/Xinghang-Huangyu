import { Preferences } from '@capacitor/preferences';
import type { GameState } from './GameManager';

const SAVE_KEY = 'trainsurvival_save';
const SETTINGS_KEY = 'trainsurvival_settings';

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

export class GameStorage {
  // 保存游戏
  static async saveGame(gameState: GameState): Promise<boolean> {
    try {
      const jsonValue = JSON.stringify(gameState);
      await Preferences.set({ key: SAVE_KEY, value: jsonValue });
      return true;
    } catch (error) {
      console.error('保存游戏失败:', error);
      return false;
    }
  }

  // 加载游戏
  static async loadGame(): Promise<GameState | null> {
    try {
      const { value } = await Preferences.get({ key: SAVE_KEY });
      return value != null ? JSON.parse(value) : null;
    } catch (error) {
      console.error('加载游戏失败:', error);
      return null;
    }
  }

  // 删除存档
  static async deleteSave(): Promise<boolean> {
    try {
      await Preferences.remove({ key: SAVE_KEY });
      return true;
    } catch (error) {
      console.error('删除存档失败:', error);
      return false;
    }
  }

  // 检查是否有存档
  static async hasSave(): Promise<boolean> {
    try {
      const { value } = await Preferences.get({ key: SAVE_KEY });
      return value !== null;
    } catch (error) {
      return false;
    }
  }

  // 保存设置
  static async saveSettings(settings: GameSettings): Promise<boolean> {
    try {
      const jsonValue = JSON.stringify(settings);
      await Preferences.set({ key: SETTINGS_KEY, value: jsonValue });
      return true;
    } catch (error) {
      console.error('保存设置失败:', error);
      return false;
    }
  }

  // 加载设置
  static async loadSettings(): Promise<GameSettings> {
    try {
      const { value } = await Preferences.get({ key: SETTINGS_KEY });
      if (value != null) {
        return JSON.parse(value);
      }
    } catch (error) {
      console.error('加载设置失败:', error);
    }

    // 默认设置
    return {
      soundEnabled: true,
      musicEnabled: true,
      vibrationEnabled: true,
      fontSize: 'medium',
    };
  }
}
