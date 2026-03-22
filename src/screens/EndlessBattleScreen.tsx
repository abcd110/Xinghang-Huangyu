import { useState, useCallback, useEffect, useRef } from 'react';
import { useGameStore } from '../stores/gameStore';
import { BattleScreen, type BattleEnemy, type EndlessConfig } from '../core/BattleScreen';

interface EndlessBattleScreenProps {
  onBack: () => void;
}

export default function EndlessBattleScreen({ onBack }: EndlessBattleScreenProps) {
  const [enemies, setEnemies] = useState<BattleEnemy[]>([]);
  const [isBoss, setIsBoss] = useState(false);
  const [battleKey, setBattleKey] = useState(0);

  const gameManager = useGameStore(state => state.gameManager);
  const saveGame = useGameStore(state => state.saveGame);

  const isBossRef = useRef(false);

  const convertToBattleEnemy = useCallback((enemy: any): BattleEnemy => {
    return {
      id: enemy.id,
      name: enemy.name,
      hp: enemy.hp,
      maxHp: enemy.maxHp,
      attack: enemy.attack,
      defense: enemy.defense,
      speed: enemy.speed,
      crit: enemy.crit || 0,
      critDamage: enemy.critDamage || 150,
      hit: enemy.hit || 100,
      dodge: enemy.dodge || 0,
      isBoss: isBossRef.current,
      isElite: false,
      icon: isBossRef.current ? '💀' : '敌',
      rewards: enemy.rewards,
    };
  }, []);

  const startBattle = useCallback((isBossBattle: boolean) => {
    isBossRef.current = isBossBattle;
    gameManager.resetAllGeneCooldowns();

    const result = isBossBattle
      ? gameManager.startEndlessBossBattle()
      : gameManager.startEndlessWaveBattle();

    if (result.success && result.enemy) {
      const enemyInstance = result.enemy;
      setEnemies([convertToBattleEnemy(enemyInstance)]);
      setIsBoss(isBossBattle);
      setBattleKey(prev => prev + 1);
    }
  }, [gameManager, convertToBattleEnemy]);

  useEffect(() => {
    startBattle(false);
  }, []);

  const handleVictory = useCallback(() => {
    const result = isBoss
      ? gameManager.handleBossVictory()
      : gameManager.handleWaveVictory();

    gameManager.refreshPlayerState();
    saveGame();

    return {
      credits: result.credits || 0,
      exp: result.exp || 0,
      materials: result.materials || [],
    };
  }, [gameManager, isBoss, saveGame]);

  const handleDefeat = useCallback(() => {
    gameManager.refreshPlayerState();
    saveGame();
  }, [gameManager, saveGame]);

  const handleChallengeBoss = useCallback(() => {
    gameManager.refreshPlayerState();
    startBattle(true);
  }, [gameManager, startBattle]);

  const handleRestart = useCallback(() => {
    gameManager.endlessStageLevel = 1;
    gameManager.endlessWaveNumber = 1;
    gameManager.refreshPlayerState();
    startBattle(false);
    saveGame();
  }, [gameManager, startBattle, saveGame]);

  const handleVictoryComplete = useCallback(() => {
    startBattle(false);
  }, [startBattle]);

  const handleBossDefeat = useCallback(() => {
    gameManager.refreshPlayerState();
    startBattle(false);
  }, [gameManager, startBattle]);

  const handleBattleEnd = useCallback((victory: boolean, totalExp: number) => {
    if (victory) {
      handleVictory();
    } else {
      handleDefeat();
    }
  }, [handleVictory, handleDefeat]);

  if (enemies.length === 0) {
    return null;
  }

  const endlessConfigValue: EndlessConfig = {
    stageLevel: gameManager.endlessStageLevel,
    isBoss: isBoss,
    onVictory: handleVictory,
    onDefeat: handleDefeat,
    onChallengeBoss: handleChallengeBoss,
    onRestart: handleRestart,
    onBack: onBack,
    onVictoryComplete: handleVictoryComplete,
    onBossDefeat: handleBossDefeat,
  };

  return (
    <BattleScreen
      key={battleKey}
      mode="endless"
      enemies={enemies}
      title="无尽战斗"
      endlessConfig={endlessConfigValue}
    />
  );
}
