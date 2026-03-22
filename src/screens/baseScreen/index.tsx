import { useState, useCallback, useRef, useEffect } from 'react';
import 基地背景 from '../../assets/images/基地背景.jpg';
import CrewScreen from '../CrewScreen';
import { FACILITIES, type BaseFacility } from './types';
import { BaseHeader, BaseOverview, FacilityCard } from './BaseComponents';
import { FacilityDetailModal } from './FacilityDetailModal';
import { BattleScreen, type BattleEnemy as BattleEnemyType } from '../../core/BattleScreen';
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
  onCrewScreenChange?: (showCrew: boolean) => void;
}

function convertToBattleEnemy(enemy: BattleEnemy): BattleEnemyType {
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
    isBoss: enemy.isBoss,
    isElite: enemy.isElite,
    icon: enemy.isBoss ? '👹' : enemy.isElite ? '💀' : '🤖',
    rewards: enemy.rewards,
  };
}

function BaseScreen({ onBack, onNavigate, onBattleStateChange, onDetailStateChange, onCrewScreenChange }: BaseScreenProps) {
  const [selectedFacility, setSelectedFacility] = useState<BaseFacility | null>(null);
  const [showCrewScreen, setShowCrewScreen] = useState(false);

  // 战斗状态在 BaseScreen 层级管理
  const [battleEnemies, setBattleEnemies] = useState<BattleEnemyType[]>([]);
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
          return;
        }

        const ruins = gameManager.getRuins();
        const ruin = ruins.find(r => r.id === ruinId);

        if (ruin) {
          const isFirstClear = ruin.firstClear && victory;

          if (victory) {
            const ruinRewards = getRuinRewards(ruin);

            const rewards = {
              credits: ruinRewards.credits,
              items: ruinRewards.items.map(item => ({ ...item })),
            };

            gameManager.trainCoins += rewards.credits;
            rewards.items.forEach(item => {
              gameManager.inventory.addItem(item.itemId, item.count);
            });

            updateRuinBattleResult(ruinId, victory, isFirstClear);
          }
        }

        setBattleEnemies([]);
        setBattleConfig(null);
        setPendingBattleRuinId(null);
        pendingBattleRuinIdRef.current = null;
        onBattleStateChange?.(false);

        await saveGame();
      } catch (error) {
        console.error('handleRuinBattleEnd 错误:', error);
      }
    };
  }, [gameManager, updateRuinBattleResult, saveGame, onBattleStateChange]);

  // 稳定的回调函数
  const handleRuinBattleEnd = useCallback((victory: boolean, totalExp: number) => {
    if (handleRuinBattleEndRef.current) {
      handleRuinBattleEndRef.current(victory, totalExp);
    }
  }, []);

  const handleFacilityClick = (facility: BaseFacility) => {
    if (facility.id === 'crew') {
      setShowCrewScreen(true);
      onCrewScreenChange?.(true);
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
    setBattleEnemies(enemies.map(convertToBattleEnemy));
    setBattleConfig({
      title: `${typeConfig.icon} ${ruin.name}`,
      subtitle: difficultyConfig.name,
      themeColor: typeConfig.color,
    });
    onBattleStateChange?.(true);
  }, [gameManager, onBattleStateChange]);

  if (showCrewScreen) {
    return <CrewScreen onBack={() => { setShowCrewScreen(false); onCrewScreenChange?.(false); }} />;
  }

  // 战斗界面全屏显示
  if (battleEnemies.length > 0 && battleConfig) {
    return (
      <BattleScreen
        mode="single"
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
export { EnergyContent, WarehouseContent } from './BasicFacilities';
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
