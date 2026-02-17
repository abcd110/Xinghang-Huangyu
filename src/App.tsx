import { useState, useCallback, useEffect } from 'react';
import StartScreen from './screens/StartScreen';
import HomeScreen from './screens/HomeScreen';
import PlayerScreen from './screens/PlayerScreen';
import InventoryScreen from './screens/InventoryScreen';
import NanoArmorCraftingScreen from './screens/NanoArmorCraftingScreen';
import QuestScreen from './screens/QuestScreen';
import ShopScreen from './screens/ShopScreen';
import { BaseScreen } from './screens/baseScreen';

import DecomposeScreen from './screens/DecomposeScreen';
import MaterialSynthesisScreen from './screens/MaterialSynthesisScreen';
import BattleScreen from './screens/BattleScreen';
import EnhanceScreen from './screens/EnhanceScreen';
import SublimationScreen from './screens/SublimationScreen';
import TestScreen from './screens/TestScreen';
import ExplorationSelectScreen from './screens/ExplorationSelectScreen';
import PlanetExplorationScreen from './screens/PlanetExplorationScreen';
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
  | 'home'
  | 'player'
  | 'inventory'
  | 'exploration'
  | 'normal-stations'
  | 'quests'
  | 'shop'
  | 'crafting'
  | 'equipment'
  | 'sublimation'
  | 'decompose'
  | 'synthesis'
  | 'settings'
  | 'battle'
  | 'mythology'
  | 'mythology_explore'
  | 'test'
  | 'base';

// 有效的屏幕类型集合，用于类型守卫
const VALID_SCREENS: readonly ScreenType[] = [
  'start', 'home', 'player', 'inventory', 'exploration', 'normal-stations',
  'quests', 'shop', 'crafting', 'equipment', 'sublimation', 'decompose',
  'synthesis', 'settings', 'battle', 'mythology', 'mythology_explore', 'test', 'base'
] as const;

// 类型守卫函数
function isValidScreen(screen: string): screen is ScreenType {
  return VALID_SCREENS.includes(screen as ScreenType);
}

interface BattleParams {
  locationId: string;
  isBoss?: boolean;
  isElite?: boolean;
}

interface NavigateParams {
  locationId?: string;
  planetType?: string;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('start');
  const [battleParams, setBattleParams] = useState<BattleParams | null>(null);
  const [returnToActionSelect, setReturnToActionSelect] = useState(false);
  const [planetTypeFilter, setPlanetTypeFilter] = useState<string | null>(null);
  const { saveGame, toasts, removeToast, gameManager } = useGameStore();

  // 现实时间体力恢复
  useEffect(() => {
    if (currentScreen === 'start') return;

    // 每分钟检查一次体力恢复
    const checkStaminaRecovery = () => {
      gameManager.checkAndRecoverStamina();
    };

    // 初始检查
    checkStaminaRecovery();

    // 设置定时器
    const interval = setInterval(checkStaminaRecovery, 60000); // 每分钟检查一次

    return () => clearInterval(interval);
  }, [currentScreen, gameManager]);

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

  const handleStartGame = useCallback(() => {
    setCurrentScreen('home');
  }, []);

  const handleNavigate = useCallback((screen: string, params?: NavigateParams) => {
    // 类型守卫检查
    if (!isValidScreen(screen)) {
      console.warn(`Invalid screen type: ${screen}`);
      return;
    }

    if (screen === 'battle' && params?.locationId) {
      setBattleParams({ locationId: params.locationId });
    }

    // 处理星球类型筛选
    if (screen === 'normal-stations' && params?.planetType) {
      setPlanetTypeFilter(params.planetType);
    }

    // 如果点击主页，清除所有探索状态（返回列车）
    if (screen === 'home') {
      setBattleParams(null);
      setPlanetTypeFilter(null);
    }

    setCurrentScreen(screen);
  }, []);

  const handleBack = useCallback(() => {
    setCurrentScreen('home');
    setBattleParams(null);
  }, []);

  const handleStartBattle = useCallback((locationId: string, isBoss?: boolean, isElite?: boolean) => {
    setBattleParams({ locationId, isBoss, isElite });
    setCurrentScreen('battle');
  }, []);

  const handleBattleEnd = async (action: 'continue_hunt' | 'return_collect' | 'boss_defeated') => {
    if (action === 'continue_hunt') {
      // 继续狩猎 - 保持在战斗页面，BattleScreen内部会重新初始化
      return;
    } else if (action === 'return_collect') {
      // 返回收集物资 - 回到探索页面的选择行动界面
      setReturnToActionSelect(true);
      // 检查是否是从神话站台来的
      if (battleParams?.locationId?.startsWith('myth_')) {
        setCurrentScreen('mythology_explore');
      } else {
        setCurrentScreen('normal-stations');
      }
      // 保存游戏
      await saveGame();
    } else if (action === 'boss_defeated') {
      // BOSS击败 - 回到探索页面，标记BOSS已击败
      setReturnToActionSelect(true);
      // 检查是否是从神话站台来的
      if (battleParams?.locationId?.startsWith('myth_')) {
        setCurrentScreen('mythology_explore');
      } else {
        setCurrentScreen('normal-stations');
      }
      // 保存游戏
      await saveGame();
    }
    // 不清空 battleParams，让 ExplorationScreen 可以获取当前地点
  };

  // 渲染当前屏幕
  const renderScreen = () => {
    switch (currentScreen) {
      case 'start':
        return <StartScreen onStartGame={handleStartGame} />;
      case 'home':
        return <HomeScreen onNavigate={handleNavigate} />;
      case 'player':
        return <PlayerScreen onBack={handleBack} />;
      case 'inventory':
        return <InventoryScreen onBack={handleBack} onNavigate={handleNavigate} />;
      case 'exploration':
        return <ExplorationSelectScreen onBack={handleBack} onNavigate={handleNavigate} />;
      case 'normal-stations':
        return (
          <PlanetExplorationScreen
            onBack={() => {
              setReturnToActionSelect(false);
              setCurrentScreen('exploration');
            }}
            onStartBattle={handleStartBattle}
            initialPlanetId={battleParams?.locationId}
            returnToActionSelect={returnToActionSelect}
            onActionSelectHandled={() => setReturnToActionSelect(false)}
            planetTypeFilter={planetTypeFilter}
          />
        );
      case 'battle':
        return battleParams ? (
          <BattleScreen
            locationId={battleParams.locationId}
            isBoss={battleParams.isBoss}
            isElite={battleParams.isElite}
            onBack={handleBack}
            onBattleEnd={handleBattleEnd}
          />
        ) : (
          <HomeScreen onNavigate={handleNavigate} />
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
        return <BaseScreen onNavigate={handleNavigate} onBack={handleBack} />;
      default:
        return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  // 判断是否显示底部导航
  const showBottomNav = currentScreen !== 'start' && currentScreen !== 'battle';

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
