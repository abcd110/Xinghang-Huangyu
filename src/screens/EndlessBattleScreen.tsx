import { useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import { getItemTemplate } from '../data/items';

interface EndlessBattleScreenProps {
  onBack: () => void;
}

type BattleState = 'fighting' | 'victory' | 'defeat';

interface BattleUnit {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  icon?: string;
  isPlayer: boolean;
  isAlive: boolean;
  shield?: number;
  critRate?: number;
  critDamage?: number;
  isMainPlayer?: boolean;
}

const THEME = {
  primary: '#00d4ff',
  secondary: '#0099cc',
  glow: 'rgba(0, 212, 255, 0.6)',
  gradient: 'linear-gradient(135deg, #0c4a6e 0%, #0891b2 50%, #00d4ff 100%)',
  bgOverlay: 'rgba(0, 20, 40, 0.85)'
};

const animationStyles = `
  @keyframes scan {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }
  @keyframes pulse-glow {
    0%, 100% { opacity: 0.5; box-shadow: 0 0 10px currentColor; }
    50% { opacity: 1; box-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
  }
  @keyframes border-flow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes damage-shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  @keyframes hp-drain {
    0% { transform: scaleX(1); }
    100% { transform: scaleX(0); }
  }
  @keyframes floatUp {
    0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    50% { opacity: 1; transform: translate(-50%, -100%) scale(1.2); }
    100% { opacity: 0; transform: translate(-50%, -150%) scale(0.8); }
  }
`;

export default function EndlessBattleScreen({ onBack }: EndlessBattleScreenProps) {
  const [battleState, setBattleState] = useState<BattleState>('fighting');
  const [isBoss, setIsBoss] = useState(false);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [playerTeam, setPlayerTeam] = useState<BattleUnit[]>([]);
  const [enemyTeam, setEnemyTeam] = useState<BattleUnit[]>([]);
  const [floatingRewards, setFloatingRewards] = useState<{ credits: number; exp: number; materials: { name: string; count: number }[]; id: number }[]>([]);
  const [battleId, setBattleId] = useState(0);

  const playerAttackTimer = useRef<number | null>(null);
  const enemyAttackTimer = useRef<number | null>(null);
  const geneCooldownTimer = useRef<number | null>(null);
  const playerRef = useRef(useGameStore.getState().gameManager.player);
  const playerTeamRef = useRef<BattleUnit[]>([]);
  const enemyTeamRef = useRef<BattleUnit[]>([]);
  const battleStateRef = useRef<BattleState>('fighting');
  const isBossRef = useRef(false);
  const timersStartedRef = useRef(false);
  const rewardIdRef = useRef(0);
  const playerStatsRef = useRef({
    attackSpeed: 1,
    totalCrit: 0,
    totalCritDamage: 0,
    totalHit: 0,
    totalDodge: 0,
    totalPenetration: 0,
    totalPenetrationPercent: 0,
    totalLifeSteal: 0,
    overflowToShield: false,
  });

  const gameManager = useGameStore(state => state.gameManager);
  const saveGame = useGameStore(state => state.saveGame);

  useEffect(() => {
    playerRef.current = gameManager.player;
  }, [gameManager.player]);

  useEffect(() => {
    playerTeamRef.current = playerTeam;
  }, [playerTeam]);

  useEffect(() => {
    enemyTeamRef.current = enemyTeam;
  }, [enemyTeam]);

  useEffect(() => {
    battleStateRef.current = battleState;
  }, [battleState]);

  const addLog = useCallback((message: string) => {
    setBattleLog(prev => [...prev.slice(-5), message]);
  }, []);

  const clearAllTimers = useCallback(() => {
    if (playerAttackTimer.current) {
      clearInterval(playerAttackTimer.current);
      playerAttackTimer.current = null;
    }
    if (enemyAttackTimer.current) {
      clearInterval(enemyAttackTimer.current);
      enemyAttackTimer.current = null;
    }
    if (geneCooldownTimer.current) {
      clearInterval(geneCooldownTimer.current);
      geneCooldownTimer.current = null;
    }
  }, []);

  const initPlayerTeam = useCallback((): BattleUnit[] => {
    const currentPlayer = gameManager.player;

    // 获取基因属性加成
    const geneContext = {
      currentHp: currentPlayer.hp,
      maxHp: currentPlayer.maxHp,
      turn: 0,
      comboCount: 0,
      damageTaken: 0,
      kills: 0,
      battleTime: 0,
      lastActionWasSkill: false,
      lastActionWasDodge: false,
      isFatalDamage: false,
    };
    const geneStats = gameManager.getGeneStatsBonus(geneContext);

    const chipBonus = gameManager.getChipStatBonus();
    const chipAttack = chipBonus['攻击'] || 0;
    const chipAttackPercent = (chipBonus['攻击%'] || 0) / 100;
    const geneAttackPercent = (geneStats['attackPercent'] || 0) / 100;
    const finalAttack = Math.floor((currentPlayer.totalAttack + chipAttack) * (1 + chipAttackPercent + geneAttackPercent));

    const chipDefense = chipBonus['防御'] || 0;
    const chipDefensePercent = (chipBonus['防御%'] || 0) / 100;
    const geneDefensePercent = (geneStats['defensePercent'] || 0) / 100;
    const finalDefense = Math.floor((currentPlayer.totalDefense + chipDefense) * (1 + chipDefensePercent + geneDefensePercent));

    const chipHp = chipBonus['生命'] || 0;
    const chipHpPercent = (chipBonus['生命%'] || 0) / 100;
    const geneMaxHpPercent = (geneStats['maxHpPercent'] || 0) / 100;
    const rawMaxHp = currentPlayer.maxHp + currentPlayer.equipmentStats.hp;
    const finalMaxHp = Math.floor((rawMaxHp + chipHp) * (1 + chipHpPercent + geneMaxHpPercent));

    if (currentPlayer.hp > finalMaxHp) {
      currentPlayer.hp = finalMaxHp;
    }

    const chipSpeed = chipBonus['攻速'] || 0;
    const implantStats = gameManager.getImplantTotalStats();
    const implantSpeed = implantStats['speed'] || 0;
    const geneSpeedPercent = (geneStats['speedPercent'] || 0) / 100;
    const finalAttackSpeed = (currentPlayer.totalAttackSpeed + chipSpeed + implantSpeed) * (1 + geneSpeedPercent);

    const chipCrit = chipBonus['会心'] || 0;
    const finalCrit = currentPlayer.totalCrit + chipCrit;

    const chipCritDamage = chipBonus['暴伤'] || 0;
    const finalCritDamage = currentPlayer.totalCritDamage + chipCritDamage;

    playerStatsRef.current = {
      attackSpeed: finalAttackSpeed,
      totalCrit: finalCrit,
      totalCritDamage: finalCritDamage,
      totalHit: currentPlayer.totalHit,
      totalDodge: currentPlayer.totalDodge,
      totalPenetration: currentPlayer.totalPenetration,
      totalPenetrationPercent: currentPlayer.totalPenetrationPercent,
      totalLifeSteal: currentPlayer.totalLifeSteal,
      overflowToShield: gameManager.hasOverflowToShield(),
    };

    const team: BattleUnit[] = [];
    for (let i = 0; i < 6; i++) {
      team.push({
        id: `player_${i}`,
        name: '',
        hp: 0,
        maxHp: 0,
        attack: 0,
        defense: 0,
        speed: 0,
        isPlayer: true,
        isAlive: false,
      });
    }

    const battleCrew = gameManager.getBattleCrew();
    let hasPlayer = false;

    for (let i = 0; i < battleCrew.length; i++) {
      const crew = battleCrew[i];
      const slot = crew.battleSlot;
      if (slot > 0 && slot <= 6) {
        const arrayIndex = slot - 1;
        if (crew.id === 'player') {
          hasPlayer = true;
          team[arrayIndex] = {
            id: `player_${arrayIndex}`,
            name: gameManager.playerName || '主角',
            hp: currentPlayer.hp,
            maxHp: finalMaxHp,
            attack: finalAttack,
            defense: finalDefense,
            speed: finalAttackSpeed,
            icon: '我',
            isPlayer: true,
            isAlive: currentPlayer.hp > 0,
            shield: 0,
            isMainPlayer: true,
          };
        } else {
          team[arrayIndex] = {
            id: `player_${arrayIndex}`,
            name: crew.name,
            hp: crew.stats.hp,
            maxHp: crew.stats.hp,
            attack: crew.stats.attack,
            defense: crew.stats.defense,
            speed: crew.stats.speed,
            icon: crew.portrait,
            isPlayer: true,
            isAlive: true,
            critRate: crew.stats.critRate,
            critDamage: crew.stats.critDamage,
          };
        }
      }
    }

    if (!hasPlayer) {
      const playerCrew = gameManager.getCrewMembers().find(c => c.id === 'player');
      const playerSlot = playerCrew?.battleSlot || 1;
      const arrayIndex = Math.max(0, Math.min(5, playerSlot - 1));
      team[arrayIndex] = {
        id: `player_${arrayIndex}`,
        name: gameManager.playerName || '主角',
        hp: currentPlayer.hp,
        maxHp: finalMaxHp,
        attack: finalAttack,
        defense: finalDefense,
        speed: finalAttackSpeed,
        icon: '我',
        isPlayer: true,
        isAlive: currentPlayer.hp > 0,
        shield: 0,
        isMainPlayer: true,
      };
    }

    return team;
  }, [gameManager]);

  const initEnemyTeam = useCallback((enemyData: any, isBossBattle: boolean): BattleUnit[] => {
    const team: BattleUnit[] = [];

    for (let i = 0; i < 6; i++) {
      team.push({
        id: `enemy_${i}`,
        name: '',
        hp: 0,
        maxHp: 0,
        attack: 0,
        defense: 0,
        speed: 0,
        isPlayer: false,
        isAlive: false,
      });
    }

    team[0] = {
      id: `enemy_0`,
      name: enemyData.name,
      hp: enemyData.hp,
      maxHp: enemyData.maxHp,
      attack: enemyData.attack,
      defense: enemyData.defense,
      speed: enemyData.speed,
      icon: enemyData.icon || (isBossBattle ? '💀' : '敌'),
      isPlayer: false,
      isAlive: enemyData.hp > 0,
    };

    const minionCount = isBossBattle ? 3 : 2;
    for (let i = 0; i < minionCount; i++) {
      const minionIndex = 3 + i;
      const minionHp = Math.floor(enemyData.maxHp * (0.2 + Math.random() * 0.15));
      const minionAttack = Math.floor(enemyData.attack * (0.3 + Math.random() * 0.2));
      team[minionIndex] = {
        id: `enemy_${minionIndex}`,
        name: `${enemyData.name}仆从`,
        hp: minionHp,
        maxHp: minionHp,
        attack: minionAttack,
        defense: Math.floor(enemyData.defense * 0.4),
        speed: Math.floor(enemyData.speed * 0.7),
        icon: '小',
        isPlayer: false,
        isAlive: true,
      };
    }

    return team;
  }, []);

  const startBattle = useCallback((isBossBattle: boolean) => {
    clearAllTimers();
    timersStartedRef.current = false;
    setBattleState('fighting');
    setBattleId(prev => prev + 1);
    isBossRef.current = isBossBattle;

    gameManager.resetAllGeneCooldowns();

    const result = isBossBattle
      ? gameManager.startEndlessBossBattle()
      : gameManager.startEndlessWaveBattle();

    if (result.success && result.enemy) {
      const enemyInstance = result.enemy;
      const initialPlayerTeam = initPlayerTeam();
      const initialEnemyTeam = initEnemyTeam(enemyInstance, isBossBattle);
      setPlayerTeam(initialPlayerTeam);
      setEnemyTeam(initialEnemyTeam);
      playerTeamRef.current = initialPlayerTeam;
      enemyTeamRef.current = initialEnemyTeam;
      setBattleLog([result.message]);
      setIsBoss(isBossBattle);
    } else {
      setBattleLog([result.message]);
    }
  }, [gameManager, initPlayerTeam, initEnemyTeam, clearAllTimers]);

  useEffect(() => {
    startBattle(false);
    return () => {
      clearAllTimers();
    };
  }, []);

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  const getAttackOrder = (attackerPosition: number): number[] => {
    const pos = attackerPosition - 1;

    const enemyFrontRow = [0, 1, 2];
    const enemyBackRow = [3, 4, 5];

    if (pos <= 2) {
      const targetIndex = pos + 3;
      const priority = [targetIndex, ...enemyBackRow.filter(i => i !== targetIndex)];
      return [...priority, ...enemyFrontRow];
    } else {
      const targetIndex = pos - 3;
      const priority = [targetIndex, ...enemyFrontRow.filter(i => i !== targetIndex)];
      return [...priority, ...enemyBackRow];
    }
  };

  useEffect(() => {
    if (battleState !== 'fighting' || timersStartedRef.current) {
      return;
    }

    const currentEnemyTeam = enemyTeamRef.current;
    const currentPlayerTeam = playerTeamRef.current;

    if (currentEnemyTeam.length === 0 || currentPlayerTeam.length === 0) {
      return;
    }

    timersStartedRef.current = true;
    const playerSpeed = playerStatsRef.current.attackSpeed || 1;
    const playerInterval = Math.max(200, 1000 / playerSpeed);

    const playerAttack = () => {
      const currentPlayer = playerRef.current;
      if (battleStateRef.current !== 'fighting') return;

      const currentEnemyTeam = enemyTeamRef.current;
      const currentPlayerTeam = playerTeamRef.current;

      const alivePlayers = currentPlayerTeam.filter(u => u.isAlive);
      if (alivePlayers.length === 0) return;

      alivePlayers.forEach(attacker => {
        const attackerIndex = parseInt(attacker.id.split('_')[1]);
        const attackOrder = getAttackOrder(attackerIndex + 1);

        let target: BattleUnit | null = null;
        let targetIndex = -1;

        for (const index of attackOrder) {
          const unit = currentEnemyTeam[index];
          if (unit && unit.isAlive) {
            target = unit;
            targetIndex = index;
            break;
          }
        }

        if (!target) return;

        let damage = attacker.attack;
        let isCrit = false;

        const attackerCrit = attacker.isMainPlayer
          ? playerStatsRef.current.totalCrit
          : (attacker.critRate || 0);
        const attackerCritDamage = attacker.isMainPlayer
          ? playerStatsRef.current.totalCritDamage
          : (attacker.critDamage || 150);

        const defenderGuard = 5;
        let critChance = 0;
        if (attackerCrit > defenderGuard) {
          critChance = (attackerCrit - defenderGuard) / (defenderGuard * 1.5);
        }
        critChance = Math.max(0, Math.min(1, critChance));
        if (Math.random() < critChance) {
          damage = Math.floor(damage * (1 + attackerCritDamage / 100));
          isCrit = true;
        }

        const enemyDefense = target.defense;
        let finalReduction: number;

        if (attacker.isMainPlayer) {
          const playerPenetration = playerStatsRef.current.totalPenetration;
          const playerPenetrationPercent = playerStatsRef.current.totalPenetrationPercent;
          const defenseAfterPenetrationPercent = enemyDefense * (1 - playerPenetrationPercent / 100);
          const actualDefense = Math.max(0, defenseAfterPenetrationPercent - playerPenetration);
          finalReduction = (actualDefense / (enemyDefense + 600)) * 100;
        } else {
          finalReduction = (enemyDefense / (enemyDefense + 600)) * 100;
        }
        damage = Math.floor(damage * (1 - finalReduction / 100));
        damage = Math.max(1, damage);

        const targetNewHp = Math.max(0, target.hp - damage);
        const targetIsAlive = targetNewHp > 0;

        let lifeStealHeal = 0;
        if (attacker.isMainPlayer) {
          const lifeStealPercent = playerStatsRef.current.totalLifeSteal;
          if (lifeStealPercent > 0) {
            lifeStealHeal = Math.floor(damage * lifeStealPercent / 100);
            if (lifeStealHeal > 0) {
              setPlayerTeam(prev => {
                const newTeam = prev.map((u) => {
                  if (u.isMainPlayer) {
                    const currentHp = u.hp;
                    const maxHp = u.maxHp;
                    const maxShield = Math.floor(maxHp * 0.5);
                    const totalHeal = currentHp + lifeStealHeal;
                    let newHp = Math.min(maxHp, totalHeal);
                    let overflow = Math.max(0, totalHeal - maxHp);
                    let newShield = u.shield || 0;

                    if (overflow > 0 && playerStatsRef.current.overflowToShield) {
                      newShield = Math.min(maxShield, newShield + overflow);
                    }

                    return { ...u, hp: newHp, shield: newShield };
                  }
                  return u;
                });
                playerTeamRef.current = newTeam;
                return newTeam;
              });
            }
          }
        }

        setEnemyTeam(prev => {
          const newTeam = prev.map((u, idx) => {
            if (idx === targetIndex) {
              return { ...u, hp: targetNewHp, isAlive: targetIsAlive };
            }
            return u;
          });
          enemyTeamRef.current = newTeam;

          const remainingEnemies = newTeam.filter(u => u.isAlive);
          if (remainingEnemies.length === 0) {
            clearAllTimers();
            setBattleState('victory');
          }

          return newTeam;
        });

        const logParts: string[] = [];
        if (isCrit) logParts.push('暴击！');
        logParts.push(`${attacker.name}对${target.name}造成 ${damage} 伤害`);
        if (lifeStealHeal > 0) logParts.push(`吸血+${lifeStealHeal}`);
        addLog(logParts.join(' '));
      });
    };

    const enemyAttack = () => {
      const currentPlayer = playerRef.current;
      if (battleStateRef.current !== 'fighting') return;

      const currentEnemyTeam = enemyTeamRef.current;
      const currentPlayerTeam = playerTeamRef.current;

      const aliveEnemies = currentEnemyTeam.filter(u => u.isAlive);
      if (aliveEnemies.length === 0) return;

      aliveEnemies.forEach(attacker => {
        const attackerIndex = parseInt(attacker.id.split('_')[1]);
        const attackOrder = getAttackOrder(attackerIndex + 1);

        let target: BattleUnit | null = null;
        let targetIndex = -1;

        for (const index of attackOrder) {
          const unit = currentPlayerTeam[index];
          if (unit && unit.isAlive) {
            target = unit;
            targetIndex = index;
            break;
          }
        }

        if (!target) return;

        let damage = attacker.attack;
        let actualDamage = damage;
        let shieldAbsorbed = 0;
        let surviveFatal = false;
        let healPercent = 0;

        if (target.isMainPlayer) {
          const playerDefense = currentPlayer.totalDefense;
          const damageReduction = (playerDefense / (playerDefense + 600)) * 100;
          damage = Math.floor(damage * (1 - damageReduction / 100));
          damage = Math.max(1, damage);
          actualDamage = damage;

          const currentShield = target.shield || 0;

          if (currentShield > 0) {
            if (currentShield >= damage) {
              shieldAbsorbed = damage;
              actualDamage = 0;
            } else {
              shieldAbsorbed = currentShield;
              actualDamage = damage - currentShield;
            }
          }

          if (actualDamage > 0) {
            currentPlayer.takeDamage(actualDamage);
          }

          if (currentPlayer.isDead) {
            const surviveResult = gameManager.checkSurviveFatal();
            if (surviveResult.canSurvive) {
              surviveFatal = true;
              healPercent = surviveResult.healPercent;
              const healAmount = Math.floor(currentPlayer.maxHp * healPercent / 100);
              currentPlayer.hp = healAmount;
              if (surviveResult.instanceId && surviveResult.cooldown) {
                gameManager.setGeneFragmentCooldown(surviveResult.instanceId, surviveResult.cooldown);
              }
            }
          }
        } else {
          const targetDefense = target.defense;
          const damageReduction = (targetDefense / (targetDefense + 600)) * 100;
          damage = Math.floor(damage * (1 - damageReduction / 100));
          damage = Math.max(1, damage);
          actualDamage = damage;
        }

        const finalActualDamage = actualDamage;
        const finalShieldAbsorbed = shieldAbsorbed;
        const finalTargetIndex = targetIndex;

        setPlayerTeam(prev => {
          const newTeam = prev.map((u, idx) => {
            if (idx === finalTargetIndex) {
              if (u.isMainPlayer) {
                const newShield = Math.max(0, (u.shield || 0) - finalShieldAbsorbed);
                return {
                  ...u,
                  hp: currentPlayer.hp,
                  shield: newShield,
                  isAlive: surviveFatal || currentPlayer.hp > 0
                };
              } else {
                const newHp = Math.max(0, u.hp - finalActualDamage);
                return {
                  ...u,
                  hp: newHp,
                  isAlive: newHp > 0
                };
              }
            }
            return u;
          });
          playerTeamRef.current = newTeam;

          const allPlayerDead = newTeam.every(u => !u.isAlive);
          if (allPlayerDead) {
            clearAllTimers();
            setBattleState('defeat');
          }

          return newTeam;
        });

        const logParts: string[] = [];
        logParts.push(`${attacker.name}对${target.name}造成 ${finalActualDamage} 伤害`);
        if (finalShieldAbsorbed > 0) logParts.push(`护盾吸收${finalShieldAbsorbed}`);
        if (surviveFatal) logParts.push(`坚韧基因触发！HP恢复到${healPercent}%`);
        addLog(logParts.join(' '));
      });
    };

    playerAttackTimer.current = window.setInterval(playerAttack, playerInterval);
    enemyAttackTimer.current = window.setInterval(enemyAttack, 1500);

    // 每秒减少基因冷却时间
    geneCooldownTimer.current = window.setInterval(() => {
      const fragments = gameManager.getGeneFragments();
      fragments.forEach(f => {
        if (f.cooldownRemaining && f.cooldownRemaining > 0) {
          f.cooldownRemaining -= 1;
        }
      });
    }, 1000);

    return () => {
      clearAllTimers();
      timersStartedRef.current = false;
    };
  }, [battleState, battleId]);

  const handleVictory = useCallback(() => {
    let credits = 0;
    let exp = 0;
    let materials: { name: string; count: number }[] = [];

    if (isBoss) {
      const result = gameManager.handleBossVictory();
      credits = result.credits;
      exp = result.exp;
      materials = result.materials.map(m => {
        const template = getItemTemplate(m.itemId);
        return { name: template?.name || m.itemId, count: m.count };
      });
    } else {
      const result = gameManager.handleWaveVictory();
      credits = result.credits;
      exp = result.exp;
      materials = result.materials.map(m => {
        const template = getItemTemplate(m.itemId);
        return { name: template?.name || m.itemId, count: m.count };
      });
    }

    const id = ++rewardIdRef.current;
    setFloatingRewards(prev => [...prev, { credits, exp, materials, id }]);
    setTimeout(() => {
      setFloatingRewards(prev => prev.filter(r => r.id !== id));
    }, 2000);
    saveGame();
  }, [isBoss, gameManager, saveGame]);

  useEffect(() => {
    if (battleState === 'victory') {
      handleVictory();
      gameManager.refreshPlayerState();
      startBattle(false);
      return;
    }
    if (battleState === 'defeat') {
      if (!isBossRef.current) {
        gameManager.endlessStageLevel = 1;
        gameManager.endlessWaveNumber = 1;
      }
      gameManager.refreshPlayerState();
      startBattle(false);
      saveGame();
      return;
    }
  }, [battleState, handleVictory, gameManager, startBattle, saveGame]);

  const handleChallengeBoss = useCallback(() => {
    if (battleState === 'fighting') {
      clearAllTimers();
    }
    gameManager.refreshPlayerState();
    startBattle(true);
  }, [gameManager, startBattle, clearAllTimers, battleState]);

  const handleRestart = useCallback(() => {
    gameManager.endlessStageLevel = 1;
    gameManager.endlessWaveNumber = 1;
    gameManager.refreshPlayerState();
    startBattle(false);
    saveGame();
  }, [gameManager, startBattle, saveGame]);

  const stageLevel = gameManager.endlessStageLevel;

  return (
    <>
      <style>{animationStyles}</style>
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, #0a0a1a 0%, #0c1929 50%, #0a0a1a 100%)',
          zIndex: 0
        }} />

        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(180deg, transparent 0%, ${THEME.glow}03 50%, transparent 100%)`,
          backgroundSize: '100% 4px',
          animation: 'scan 8s linear infinite',
          pointerEvents: 'none',
          zIndex: 2
        }} />

        <header style={{
          flexShrink: 0,
          position: 'relative',
          zIndex: 10,
          background: 'rgba(0, 10, 20, 0.7)',
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${THEME.primary}40`,
          padding: '10px 16px',
          boxShadow: `0 0 20px ${THEME.glow}20`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              onClick={onBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: THEME.primary,
                background: `${THEME.glow}20`,
                border: `1px solid ${THEME.primary}40`,
                borderRadius: '8px',
                padding: '6px 10px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 500,
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
            >
              <span>◀</span>
              <span>返回</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>关卡</div>
                <div style={{
                  color: isBoss ? '#ef4444' : THEME.primary,
                  fontSize: '20px',
                  fontWeight: 'bold',
                  textShadow: `0 0 10px ${isBoss ? 'rgba(239, 68, 68, 0.6)' : THEME.glow}`
                }}>
                  {isBoss ? `BOSS ${stageLevel}` : stageLevel}
                </div>
              </div>
            </div>

            <button
              onClick={handleChallengeBoss}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: '#ef4444',
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(239, 68, 68, 0.1) 100%)',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                borderRadius: '8px',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 'bold',
                textShadow: '0 0 10px rgba(239, 68, 68, 0.5)',
                transition: 'all 0.3s ease'
              }}
            >
              <span>💀</span>
              <span>挑战Boss</span>
            </button>
          </div>
        </header>

        <main style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 10,
          overflow: 'hidden'
        }}>
          {floatingRewards.map((reward, idx) => (
            <div
              key={reward.id}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: '#fbbf24',
                fontSize: '24px',
                fontWeight: 'bold',
                textShadow: '0 0 20px rgba(251, 191, 36, 0.8)',
                animation: 'floatUp 2s ease-out forwards',
                zIndex: 100,
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <div>+{reward.credits} 信用点</div>
              <div style={{ color: '#22c55e', fontSize: '20px' }}>+{reward.exp} 经验</div>
              {reward.materials.map((mat, i) => (
                <div key={i} style={{ color: '#60a5fa', fontSize: '18px' }}>
                  +{mat.name} x{mat.count}
                </div>
              ))}
            </div>
          ))}
          {battleState === 'fighting' && (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              padding: '12px',
              gap: '12px'
            }}>
              <div style={{
                background: 'rgba(0, 10, 20, 0.6)',
                borderRadius: '12px',
                padding: '12px',
                border: `1px solid #ef444440`,
                boxShadow: '0 0 20px rgba(239, 68, 68, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <span style={{
                    color: '#ef4444',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    textShadow: '0 0 10px rgba(239, 68, 68, 0.5)'
                  }}>
                    👾 敌方
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>
                    存活: {enemyTeam.filter(u => u.isAlive).length}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {enemyTeam.map((unit, idx) => (
                    <div key={idx} style={{
                      background: unit.isAlive ? 'rgba(239, 68, 68, 0.15)' : 'rgba(50,50,50,0.3)',
                      borderRadius: '8px',
                      padding: '8px',
                      textAlign: 'center',
                      opacity: unit.isAlive ? 1 : 0.4,
                      border: unit.isAlive ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid transparent',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {unit.isAlive && (
                        <>
                          <div style={{
                            color: 'rgba(255,255,255,0.9)',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            width: '100%'
                          }}>
                            {unit.name}
                          </div>
                          <div style={{
                            height: '4px',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '2px',
                            width: '100%',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              height: '100%',
                              width: `${(unit.hp / unit.maxHp) * 100}%`,
                              background: '#ef4444',
                              transition: 'width 0.3s ease'
                            }} />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                background: 'rgba(0, 10, 20, 0.6)',
                borderRadius: '12px',
                padding: '12px',
                border: `1px solid ${THEME.primary}40`,
                boxShadow: `0 0 20px ${THEME.glow}10`
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <span style={{
                    color: THEME.primary,
                    fontSize: '14px',
                    fontWeight: 'bold',
                    textShadow: `0 0 10px ${THEME.glow}`
                  }}>
                    ⚔️ 我方
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>
                    存活: {playerTeam.filter(u => u.isAlive).length}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {playerTeam.map((unit, idx) => (
                    <div key={idx} style={{
                      background: unit.isAlive ? `${THEME.glow}15` : 'rgba(50,50,50,0.3)',
                      borderRadius: '8px',
                      padding: '8px',
                      textAlign: 'center',
                      opacity: unit.isAlive ? 1 : 0.4,
                      border: unit.isAlive ? `1px solid ${THEME.primary}30` : '1px solid transparent',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {unit.isAlive && (
                        <>
                          <div style={{
                            color: 'rgba(255,255,255,0.9)',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            width: '100%'
                          }}>
                            {unit.name || '幸存者'}
                          </div>
                          <div style={{
                            height: '4px',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '2px',
                            width: '100%',
                            overflow: 'hidden',
                            position: 'relative'
                          }}>
                            <div style={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              height: '100%',
                              width: `${(unit.hp / unit.maxHp) * 100}%`,
                              background: '#10b981',
                              transition: 'width 0.3s ease'
                            }} />
                            {unit.shield && unit.shield > 0 && (
                              <div style={{
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                height: '100%',
                                width: `${Math.min((unit.shield / (unit.maxHp * 0.5)) * 100, 50)}%`,
                                background: '#3b82f6',
                                transition: 'width 0.3s ease'
                              }} />
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                background: 'rgba(0, 10, 20, 0.6)',
                borderRadius: '12px',
                padding: '10px',
                border: `1px solid ${THEME.primary}20`,
                flex: 1,
                overflow: 'auto'
              }}>
                {battleLog.map((log, idx) => (
                  <div key={idx} style={{
                    color: idx === battleLog.length - 1 ? THEME.primary : 'rgba(255,255,255,0.5)',
                    fontSize: '11px',
                    marginBottom: '4px',
                    textShadow: idx === battleLog.length - 1 ? `0 0 5px ${THEME.glow}` : 'none'
                  }}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          {battleState === 'defeat' && (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}>
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '20px',
                padding: '24px',
                border: '2px solid rgba(239, 68, 68, 0.5)',
                textAlign: 'center',
                marginBottom: '20px'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>💀</div>
                <div style={{
                  color: '#ef4444',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  textShadow: '0 0 20px rgba(239, 68, 68, 0.5)'
                }}>
                  战斗失败
                </div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '8px' }}>
                  当前关卡: {stageLevel}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                <button
                  onClick={handleRestart}
                  style={{
                    flex: 1,
                    padding: '16px',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0.1) 100%)',
                    border: '1px solid rgba(16, 185, 129, 0.5)',
                    borderRadius: '12px',
                    color: '#10b981',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  重新开始
                </button>
                <button
                  onClick={onBack}
                  style={{
                    flex: 1,
                    padding: '16px',
                    background: 'rgba(50, 50, 50, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  返回
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
