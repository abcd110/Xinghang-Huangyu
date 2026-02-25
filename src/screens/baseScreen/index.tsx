import { useState, useCallback, useRef, useEffect } from 'react';
import 基地背景 from '../../assets/images/基地背景.jpg';
import CrewScreen from '../CrewScreen';
import { FACILITIES, type BaseFacility } from './types';
import { BaseHeader, BaseOverview, FacilityCard } from './BaseComponents';
import { FacilityDetailModal } from './FacilityDetailModal';
import { GenericBattleScreen, type GenericEnemy } from '../../core/GenericBattleScreen';
import { useGameStore } from '../../stores/gameStore';
import { RUIN_TYPE_CONFIG, RUIN_DIFFICULTY_CONFIG, type Ruin, getRuinRewards } from '../../core/RuinSystem';
import { generateRuinEnemies } from '../../core/RuinEnemySystem';
import type { BattleEnemy } from '../../data/types';
import { getItemName } from './utils';

interface BaseScreenProps {
  onBack: () => void;
  onNavigate?: (screen: string) => void;
  onBattleStateChange?: (inBattle: boolean) => void;
  onDetailStateChange?: (inDetail: boolean) => void;
}

function convertToGenericEnemy(enemy: BattleEnemy): GenericEnemy {
  return {
    id: enemy.id,
    name: enemy.name,
    hp: enemy.hp,
    maxHp: enemy.maxHp,
    attack: enemy.attack,
    defense: enemy.defense,
    speed: enemy.speed,
    crit: enemy.crit,
    critDamage: enemy.critDamage,
    hit: enemy.hit,
    dodge: enemy.dodge,
    guard: enemy.guard,
    isBoss: enemy.isBoss,
    isElite: enemy.isElite,
    icon: enemy.isBoss ? '👹' : enemy.isElite ? '💀' : '🤖',
    rewards: enemy.rewards,
  };
}

function BaseScreen({ onBack, onNavigate, onBattleStateChange, onDetailStateChange }: BaseScreenProps) {
  const [selectedFacility, setSelectedFacility] = useState<BaseFacility | null>(null);
  const [showCrewScreen, setShowCrewScreen] = useState(false);

  // 战斗状态在 BaseScreen 层级管理
  const [battleEnemies, setBattleEnemies] = useState<GenericEnemy[]>([]);
  const [battleConfig, setBattleConfig] = useState<{ title: string; subtitle: string; themeColor: string } | null>(null);
  const [pendingBattleRuinId, setPendingBattleRuinId] = useState<string | null>(null);
  const pendingBattleRuinIdRef = useRef<string | null>(null);

  // 使用稳定的选择器
  const gameManager = useGameStore(state => state.gameManager);
  const saveGame = useGameStore(state => state.saveGame);
  const updateRuinBattleResult = useGameStore(state => state.updateRuinBattleResult);
  const getRuinRemainingAttempts = useGameStore(state => state.getRuinRemainingAttempts);

  // 使用 ref 存储回调函数，确保始终是最新的
  const handleRuinBattleEndRef = useRef<(victory: boolean, totalExp: number) => Promise<void>>(null!);

  // 更新回调函数
  useEffect(() => {
    handleRuinBattleEndRef.current = async (victory: boolean, totalExp: number) => {
      try {
        // 使用 ref 获取当前的 ruinId，避免闭包问题
        const ruinId = pendingBattleRuinIdRef.current;
        if (!ruinId) {
          console.log('handleRuinBattleEnd: ruinId is null');
          return;
        }

        console.log(`handleRuinBattleEnd: victory=${victory}, ruinId=${ruinId}`);

        // 获取遗迹数据
        console.log('获取遗迹数据...');
        const ruins = gameManager.getRuins();
        console.log('ruins:', ruins);
        const ruin = ruins.find(r => r.id === ruinId);
        console.log('找到的 ruin:', ruin);

        if (ruin) {
          const isFirstClear = ruin.firstClear && victory;
          console.log('isFirstClear:', isFirstClear);

          // 只有胜利时才给奖励和更新状态
          if (victory) {
            const ruinRewards = getRuinRewards(ruin);

            const rewards = {
              credits: ruinRewards.credits,
              items: ruinRewards.items.map(item => ({ ...item })),
            };

            console.log('发放奖励:', rewards);
            gameManager.trainCoins += rewards.credits;
            rewards.items.forEach(item => {
              gameManager.inventory.addItem(item.itemId, item.count);
            });

            // 更新遗迹状态（只有胜利时才更新）
            console.log('更新遗迹状态...');
            updateRuinBattleResult(ruinId, victory, isFirstClear);
            console.log('更新遗迹状态完成');
          }
        } else {
          console.log('未找到 ruin，跳过奖励发放');
        }

        // 清除战斗状态（无论胜利或失败都要执行）
        console.log('清除战斗状态');
        setBattleEnemies([]);
        setBattleConfig(null);
        setPendingBattleRuinId(null);
        pendingBattleRuinIdRef.current = null;
        onBattleStateChange?.(false);

        console.log('保存游戏...');
        await saveGame();
        console.log('保存完成');
      } catch (error) {
        console.error('handleRuinBattleEnd 错误:', error);
      }
    };
  }, [gameManager, updateRuinBattleResult, saveGame, onBattleStateChange]);

  // 稳定的回调函数
  const handleRuinBattleEnd = useCallback((victory: boolean, totalExp: number) => {
    console.log('handleRuinBattleEnd 被调用');
    console.log('handleRuinBattleEndRef.current:', handleRuinBattleEndRef.current);
    if (handleRuinBattleEndRef.current) {
      handleRuinBattleEndRef.current(victory, totalExp);
    }
  }, []);

  const handleFacilityClick = (facility: BaseFacility) => {
    if (facility.id === 'crew') {
      setShowCrewScreen(true);
    } else {
      setSelectedFacility(facility);
      onDetailStateChange?.(true);
    }
  };

  const handleCloseFacility = () => {
    setSelectedFacility(null);
    onDetailStateChange?.(false);
  };

  const handleStartRuinBattle = useCallback((ruin: Ruin) => {
    const player = gameManager.player;
    const playerTotalPower = player.totalAttack + player.totalDefense + player.totalMaxHp / 10;
    const enemies = generateRuinEnemies(
      ruin.type,
      ruin.currentDifficulty,
      player.level,
      playerTotalPower
    );

    const typeConfig = RUIN_TYPE_CONFIG[ruin.type];
    const difficultyConfig = RUIN_DIFFICULTY_CONFIG[ruin.currentDifficulty];

    setPendingBattleRuinId(ruin.id);
    pendingBattleRuinIdRef.current = ruin.id;
    setBattleEnemies(enemies.map(convertToGenericEnemy));
    setBattleConfig({
      title: `${typeConfig.icon} ${ruin.name}`,
      subtitle: difficultyConfig.name,
      themeColor: typeConfig.color,
    });
    onBattleStateChange?.(true);
  }, [gameManager, onBattleStateChange]);

  if (showCrewScreen) {
    return <CrewScreen onBack={() => setShowCrewScreen(false)} />;
  }

  // 战斗界面全屏显示
  if (battleEnemies.length > 0 && battleConfig) {
    return (
      <GenericBattleScreen
        enemies={battleEnemies}
        onBattleEnd={handleRuinBattleEnd}
        title={battleConfig.title}
        subtitle={battleConfig.subtitle}
        themeColor={battleConfig.themeColor}
      />
    );
  }

  return (
    <div style={{
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${基地背景})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 0,
      }} />

      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, transparent 0%, rgba(0, 212, 255, 0.03) 50%, transparent 100%)',
        backgroundSize: '100% 4px',
        animation: 'scanline 8s linear infinite',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      <BaseHeader onBack={onBack} />

      <BaseOverview />

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        position: 'relative',
        zIndex: 10,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
        }}>
          {FACILITIES.map(facility => (
            <FacilityCard
              key={facility.id}
              facility={facility}
              onClick={() => handleFacilityClick(facility)}
            />
          ))}
        </div>
      </div>

      {selectedFacility && (
        <FacilityDetailModal
          facility={selectedFacility}
          onClose={handleCloseFacility}
          onStartRuinBattle={handleStartRuinBattle}
        />
      )}

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
}

export { FACILITIES, type BaseFacility } from './types';
export { BaseHeader, BaseOverview, FacilityCard } from './BaseComponents';
export { FacilityDetailModal } from './FacilityDetailModal';
export { EnergyContent, WarehouseContent, MedicalContent } from './BasicFacilities';
export { ResearchContent } from './ResearchContent';
export { MiningContent } from './MiningContent';
export { ChipContent } from './ChipContent';
export { ChipCraftPanel } from './ChipCraftPanel';
export { GeneContent } from './GeneContent';
export { CyberneticContent } from './CyberneticContent';
export { MarketContent } from './MarketContent';
export { RuinsContent, LockedContent } from './RuinsContent';
export { getItemName, getMaterialFullName, formatCost } from './utils';
export { MessageToast, CenteredMessageToast, ConfirmDialog, useConfirmDialog, type MessageState } from './shared';
export { styles, colors } from './styles';
export { BaseScreen };
