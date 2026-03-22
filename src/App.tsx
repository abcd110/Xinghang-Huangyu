import { useState, useCallback, useEffect } from 'react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import StartScreen from './screens/StartScreen';
import NameInputScreen from './screens/NameInputScreen';
import HomeScreen from './screens/HomeScreen';
import PlayerScreen from './screens/PlayerScreen';
import InventoryScreen from './screens/InventoryScreen';
import NanoArmorCraftingScreen from './screens/NanoArmorCraftingScreen';
import QuestScreen from './screens/QuestScreen';
import ShopScreen from './screens/ShopScreen';
import { BaseScreen } from './screens/baseScreen';

import DecomposeScreen from './screens/DecomposeScreen';
import MaterialSynthesisScreen from './screens/MaterialSynthesisScreen';
import EnhanceScreen from './screens/EnhanceScreen';
import SublimationScreen from './screens/SublimationScreen';
import TestScreen from './screens/TestScreen';
import EndlessBattleScreen from './screens/EndlessBattleScreen';
import BottomNav from './components/BottomNav';
import { ToastContainer } from './components/Toast';
import { useGameStore } from './stores/gameStore';

// 占位页面组件
function PlaceholderScreen({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-wasteland-900 pb-20">
      <header className="sticky top-0 z-10 bg-wasteland-800/95 backdrop-blur border-b border-rust-500/30 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
          >
            <span className="text-lg">←</span>
            <span className="text-sm">返回</span>
          </button>
          <h1 className="text-white font-bold text-lg">{title}</h1>
          <div className="w-12" />
        </div>
      </header>
      <main className="px-4 py-8 text-center">
        <div className="text-6xl mb-4">🚀</div>
        <h2 className="text-xl text-white font-bold mb-2">功能开发中</h2>
        <p className="text-gray-400">{title}功能即将上线，敬请期待！</p>
      </main>
    </div>
  );
}

type ScreenType =
  | 'start'
  | 'name-input'
  | 'home'
  | 'player'
  | 'inventory'
  | 'endless-battle'
  | 'quests'
  | 'shop'
  | 'crafting'
  | 'equipment'
  | 'sublimation'
  | 'decompose'
  | 'synthesis'
  | 'settings'
  | 'mythology'
  | 'mythology_explore'
  | 'test'
  | 'base';

// 有效的屏幕类型集合，用于类型守卫
const VALID_SCREENS: readonly ScreenType[] = [
  'start', 'name-input', 'home', 'player', 'inventory', 'endless-battle',
  'quests', 'shop', 'crafting', 'equipment', 'sublimation', 'decompose',
  'synthesis', 'settings', 'mythology', 'mythology_explore', 'test', 'base'
] as const;

// 类型守卫函数
function isValidScreen(screen: string): screen is ScreenType {
  return VALID_SCREENS.includes(screen as ScreenType);
}

interface NavigateParams {
  locationId?: string;
  planetType?: string;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('start');
  const [inRuinBattle, setInRuinBattle] = useState(false);
  const [inFacilityDetail, setInFacilityDetail] = useState(false);
  const [inCrewScreen, setInCrewScreen] = useState(false);
  const { saveGame, toasts, removeToast, gameManager } = useGameStore();

  // 初始化状态栏 - 仅在原生平台执行
  useEffect(() => {
    const initStatusBar = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: '#0a0e27' });
          await StatusBar.setOverlaysWebView({ overlay: false });
        } catch (error) {
          console.warn('StatusBar plugin not available:', error);
        }
      }
    };
    initStatusBar();
  }, []);

  // 研究进度更新 - 每秒更新
  useEffect(() => {
    if (currentScreen === 'start') return;

    const updateProgress = () => {
      gameManager.updateResearchProgress();
    };

    // 每秒更新研究进度
    const interval = setInterval(updateProgress, 1000);

    return () => clearInterval(interval);
  }, [currentScreen, gameManager]);

  // 采矿进度更新 - 每秒更新
  useEffect(() => {
    if (currentScreen === 'start') return;

    const updateMining = () => {
      gameManager.updateMiningProgress();
    };

    // 每秒更新采矿进度
    const interval = setInterval(updateMining, 1000);

    return () => clearInterval(interval);
  }, [currentScreen, gameManager]);

  // 定期自动保存 - 每30秒保存一次
  useEffect(() => {
    if (currentScreen === 'start') return;

    const { saveGame } = useGameStore.getState();

    // 每30秒自动保存
    const interval = setInterval(() => {
      saveGame();
    }, 30000);

    return () => clearInterval(interval);
  }, [currentScreen]);

  // 神能自然恢复 - 每分钟恢复1点
  useEffect(() => {
    if (currentScreen === 'start') return;

    const { gameManager } = useGameStore.getState();

    const interval = setInterval(() => {
      if (gameManager.player.spirit < gameManager.player.maxSpirit) {
        gameManager.player.spirit = Math.min(
          gameManager.player.maxSpirit,
          gameManager.player.spirit + 1
        );
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [currentScreen]);

  const handleStartGame = useCallback((hasExistingSave: boolean = false) => {
    if (hasExistingSave) {
      setCurrentScreen('home');
    } else {
      setCurrentScreen('name-input');
    }
  }, []);

  const handleNameConfirm = useCallback((name: string) => {
    gameManager.setPlayerName(name);
    saveGame();
    setCurrentScreen('home');
  }, [gameManager, saveGame]);

  const handleNavigate = useCallback((screen: string, params?: NavigateParams) => {
    if (!isValidScreen(screen)) {
      console.warn(`Invalid screen type: ${screen}`);
      return;
    }

    setCurrentScreen(screen);
  }, []);

  const handleBack = useCallback(() => {
    setCurrentScreen('home');
  }, []);

  // 渲染当前屏幕
  const renderScreen = () => {
    switch (currentScreen) {
      case 'start':
        return <StartScreen onStartGame={handleStartGame} />;
      case 'name-input':
        return <NameInputScreen onConfirm={handleNameConfirm} />;
      case 'home':
        return <HomeScreen onNavigate={handleNavigate} />;
      case 'player':
        return <PlayerScreen onBack={handleBack} />;
      case 'inventory':
        return <InventoryScreen onBack={handleBack} onNavigate={handleNavigate} />;
      case 'endless-battle':
        return (
          <EndlessBattleScreen
            onBack={handleBack}
          />
        );
      case 'quests':
        return <QuestScreen onBack={handleBack} />;
      case 'shop':
        return <ShopScreen onBack={handleBack} />;

      case 'crafting':
        return <NanoArmorCraftingScreen onBack={handleBack} />;
      case 'equipment':
        return <EnhanceScreen onBack={handleBack} />;
      case 'sublimation':
        return <SublimationScreen onBack={handleBack} />;
      case 'decompose':
        return <DecomposeScreen onBack={handleBack} />;
      case 'synthesis':
        return <MaterialSynthesisScreen onBack={handleBack} />;
      case 'settings':
        return <PlaceholderScreen title="设置" onBack={handleBack} />;
      case 'mythology':
        return <PlaceholderScreen title="神域探索" onBack={handleBack} />;
      case 'mythology_explore':
        return <PlaceholderScreen title="神域探索" onBack={handleBack} />;
      case 'test':
        return <TestScreen onBack={handleBack} />;
      case 'base':
        return <BaseScreen onNavigate={handleNavigate} onBack={handleBack} onBattleStateChange={setInRuinBattle} onDetailStateChange={setInFacilityDetail} onCrewScreenChange={setInCrewScreen} />;
      default:
        return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  // 判断是否显示底部导航
  const showBottomNav = currentScreen !== 'start' && currentScreen !== 'name-input' && currentScreen !== 'battle' && !inRuinBattle && !inFacilityDetail && !inCrewScreen;

  return (
    <div className="space-theme" style={{
      minHeight: '100vh',
      position: 'relative',
      paddingBottom: showBottomNav ? '64px' : '0'
    }}>
      {/* Toast 提示容器 */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* 主内容区域 */}
      <div style={{ maxWidth: '430px', margin: '0 auto' }}>
        {renderScreen()}
      </div>

      {/* 底部导航 */}
      {showBottomNav && (
        <BottomNav
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}

export default App;
