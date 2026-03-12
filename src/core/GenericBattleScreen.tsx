import { useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';

export interface GenericEnemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  crit: number;
  critDamage: number;
  hit: number;
  dodge: number;
  guard: number;
  isBoss?: boolean;
  isElite?: boolean;
  icon?: string;
  rewards?: {
    exp: number;
  };
}

interface GenericBattleScreenProps {
  enemies: GenericEnemy[];
  onBattleEnd: (victory: boolean, totalExp: number) => void;
  title?: string;
  subtitle?: string;
  themeColor?: string;
}

type BattlePhase = 'fighting' | 'victory' | 'defeat';

interface BattleUnit {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  crit: number;
  critDamage: number;
  hit: number;
  dodge: number;
  guard: number;
  icon?: string;
  isPlayer: boolean;
  isAlive: boolean;
  shield?: number;
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

export function GenericBattleScreen({
  enemies,
  onBattleEnd,
  title = '战斗',
  subtitle = '',
  themeColor = '#0099cc'
}: GenericBattleScreenProps) {
  const gameManager = useGameStore(state => state.gameManager);
  const player = useGameStore(state => state.getPlayer());

  const [phase, setPhase] = useState<BattlePhase>('fighting');
  const [currentEnemyIndex, setCurrentEnemyIndex] = useState(0);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [gainedExp, setGainedExp] = useState(0);

  const [playerTeam, setPlayerTeam] = useState<BattleUnit[]>([]);
  const [enemyTeam, setEnemyTeam] = useState<BattleUnit[]>([]);

  const playerAttackTimer = useRef<number | null>(null);
  const enemyAttackTimer = useRef<number | null>(null);
  const geneCooldownTimer = useRef<number | null>(null);
  const playerTeamRef = useRef<BattleUnit[]>([]);
  const enemyTeamRef = useRef<BattleUnit[]>([]);
  const currentEnemyIndexRef = useRef(0);
  const battlePhaseRef = useRef<BattlePhase>('fighting');
  const timersStartedRef = useRef(false);
  
  const onBattleEndRef = useRef(onBattleEnd);
  const playerRef = useRef(player);
  
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

  useEffect(() => {
    onBattleEndRef.current = onBattleEnd;
  }, [onBattleEnd]);

  useEffect(() => {
    playerTeamRef.current = playerTeam;
  }, [playerTeam]);

  useEffect(() => {
    enemyTeamRef.current = enemyTeam;
  }, [enemyTeam]);
  
  useEffect(() => {
    currentEnemyIndexRef.current = currentEnemyIndex;
  }, [currentEnemyIndex]);

  useEffect(() => {
    battlePhaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  const addLog = useCallback((message: string) => {
    setBattleLog(prev => [message, ...prev].slice(0, 15));
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

  const calculatePlayerStats = useCallback(() => {
    const geneContext = {
      currentHp: player.hp,
      maxHp: player.maxHp,
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
    const implantStats = gameManager.getImplantTotalStats();

    const chipAttack = chipBonus['攻击'] || 0;
    const chipAttackPercent = (chipBonus['攻击%'] || 0) / 100;
    const implantAttack = implantStats['attack'] || 0;
    const geneAttackPercent = (geneStats['attackPercent'] || 0) / 100;
    const finalAttack = Math.floor((player.totalAttack + chipAttack + implantAttack) * (1 + chipAttackPercent + geneAttackPercent));

    const chipDefense = chipBonus['防御'] || 0;
    const chipDefensePercent = (chipBonus['防御%'] || 0) / 100;
    const implantDefense = implantStats['defense'] || 0;
    const geneDefensePercent = (geneStats['defensePercent'] || 0) / 100;
    const finalDefense = Math.floor((player.totalDefense + chipDefense + implantDefense) * (1 + chipDefensePercent + geneDefensePercent));

    const chipHp = chipBonus['生命'] || 0;
    const chipHpPercent = (chipBonus['生命%'] || 0) / 100;
    const implantHp = implantStats['hp'] || 0;
    const geneMaxHpPercent = (geneStats['maxHpPercent'] || 0) / 100;
    const rawMaxHp = player.maxHp + player.equipmentStats.hp;
    const finalMaxHp = Math.floor((rawMaxHp + chipHp + implantHp) * (1 + chipHpPercent + geneMaxHpPercent));

    const chipSpeed = chipBonus['攻速'] || 0;
    const implantSpeed = implantStats['speed'] || 0;
    const geneSpeedPercent = (geneStats['speedPercent'] || 0) / 100;
    const finalAttackSpeed = (player.totalAttackSpeed + chipSpeed + implantSpeed) * (1 + geneSpeedPercent);

    const chipCrit = chipBonus['会心'] || 0;
    const implantCrit = implantStats['critRate'] || 0;
    const finalCrit = player.totalCrit + chipCrit + implantCrit;

    const chipCritDamage = chipBonus['暴伤'] || 0;
    const implantCritDamage = implantStats['critDamage'] || 0;
    const finalCritDamage = player.totalCritDamage + chipCritDamage + implantCritDamage;

    playerStatsRef.current = {
      attackSpeed: finalAttackSpeed,
      totalCrit: finalCrit,
      totalCritDamage: finalCritDamage,
      totalHit: player.totalHit,
      totalDodge: player.totalDodge,
      totalPenetration: player.totalPenetration,
      totalPenetrationPercent: player.totalPenetrationPercent,
      totalLifeSteal: player.totalLifeSteal,
      overflowToShield: gameManager.hasOverflowToShield(),
    };

    return {
      attack: finalAttack,
      defense: finalDefense,
      maxHp: finalMaxHp,
      speed: finalAttackSpeed,
      crit: finalCrit,
      critDamage: finalCritDamage,
      hit: player.totalHit,
      dodge: player.totalDodge,
      guard: player.totalGuard,
    };
  }, [gameManager, player]);

  const getAttackOrder = useCallback((attackerPosition: number): number[] => {
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
  }, []);

  const initPlayerTeam = useCallback((): BattleUnit[] => {
    const stats = calculatePlayerStats();

    player.hp = stats.maxHp;

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
        crit: 0,
        critDamage: 0,
        hit: 0,
        dodge: 0,
        guard: 0,
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
            hp: player.hp,
            maxHp: stats.maxHp,
            attack: stats.attack,
            defense: stats.defense,
            speed: stats.speed,
            crit: stats.crit,
            critDamage: stats.critDamage,
            hit: stats.hit,
            dodge: stats.dodge,
            guard: stats.guard,
            icon: '我',
            isPlayer: true,
            isAlive: player.hp > 0,
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
            crit: crew.stats.critRate || 0,
            critDamage: crew.stats.critDamage || 150,
            hit: 100,
            dodge: 0,
            guard: 0,
            icon: crew.portrait,
            isPlayer: true,
            isAlive: true,
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
        hp: player.hp,
        maxHp: stats.maxHp,
        attack: stats.attack,
        defense: stats.defense,
        speed: stats.speed,
        crit: stats.crit,
        critDamage: stats.critDamage,
        hit: stats.hit,
        dodge: stats.dodge,
        guard: stats.guard,
        icon: '我',
        isPlayer: true,
        isAlive: player.hp > 0,
        shield: 0,
        isMainPlayer: true,
      };
    }

    return team;
  }, [calculatePlayerStats, gameManager, player]);

  const initEnemyTeam = useCallback((enemyData: GenericEnemy): BattleUnit[] => {
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
        crit: 0,
        critDamage: 0,
        hit: 0,
        dodge: 0,
        guard: 0,
        isPlayer: false,
        isAlive: false,
      });
    }

    team[0] = {
      id: 'enemy_0',
      name: enemyData.name,
      hp: enemyData.hp,
      maxHp: enemyData.maxHp,
      attack: enemyData.attack,
      defense: enemyData.defense,
      speed: enemyData.speed,
      crit: enemyData.crit,
      critDamage: enemyData.critDamage,
      hit: enemyData.hit,
      dodge: enemyData.dodge,
      guard: enemyData.guard,
      icon: enemyData.icon || (enemyData.isBoss ? '💀' : '敌'),
      isPlayer: false,
      isAlive: enemyData.hp > 0,
    };

    const minionCount = enemyData.isBoss ? 3 : enemyData.isElite ? 2 : 0;
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
        crit: Math.floor(enemyData.crit * 0.5),
        critDamage: Math.floor(enemyData.critDamage * 0.5),
        hit: Math.floor(enemyData.hit * 0.8),
        dodge: Math.floor(enemyData.dodge * 0.5),
        guard: Math.floor(enemyData.guard * 0.5),
        icon: '小',
        isPlayer: false,
        isAlive: true,
      };
    }

    return team;
  }, []);

  useEffect(() => {
    const initialPlayerTeam = initPlayerTeam();
    const initialEnemyTeam = initEnemyTeam(enemies[0]);
    setPlayerTeam(initialPlayerTeam);
    setEnemyTeam(initialEnemyTeam);
    playerTeamRef.current = initialPlayerTeam;
    enemyTeamRef.current = initialEnemyTeam;
    addLog(`遭遇了 ${enemies[0].name}！`);
    addLog('战斗开始！');
  }, [initEnemyTeam, initPlayerTeam, enemies, addLog]);

  useEffect(() => {
    if (enemies.length > 0 && currentEnemyIndex < enemies.length && currentEnemyIndex > 0) {
      const newEnemyTeam = initEnemyTeam(enemies[currentEnemyIndex]);
      setEnemyTeam(newEnemyTeam);
      enemyTeamRef.current = newEnemyTeam;
      addLog(`遭遇 ${enemies[currentEnemyIndex].name}！`);
    }
  }, [currentEnemyIndex, enemies, initEnemyTeam, addLog]);

  const doPlayerAttack = useCallback(() => {
    if (battlePhaseRef.current !== 'fighting') return;

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

      if (!target || targetIndex === -1) return;

      let damage = attacker.attack;
      let isCrit = false;

      const attackerCrit = attacker.isMainPlayer
        ? playerStatsRef.current.totalCrit
        : attacker.crit;
      const attackerCritDamage = attacker.isMainPlayer
        ? playerStatsRef.current.totalCritDamage
        : attacker.critDamage;

      const defenderGuard = target.guard || 5;
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
          if (currentEnemyIndexRef.current < enemies.length - 1) {
            setCurrentEnemyIndex(prev => prev + 1);
            addLog(`击败 ${target!.name}！`);
          } else {
            setPhase('victory');
            const totalExp = enemies.reduce((sum, e) => sum + (e.rewards?.exp || 0), 0);
            setGainedExp(totalExp);
            player.addExp(totalExp);
            addLog(`战斗胜利！获得 ${totalExp} 经验`);
          }
        }

        return newTeam;
      });

      const logParts: string[] = [];
      if (isCrit) logParts.push('暴击！');
      logParts.push(`${attacker.name}对${target.name}造成 ${damage} 伤害`);
      if (lifeStealHeal > 0) logParts.push(`吸血+${lifeStealHeal}`);
      addLog(logParts.join(' '));
    });
  }, [calculatePlayerStats, clearAllTimers, enemies, addLog, player, getAttackOrder]);

  const doEnemyAttack = useCallback(() => {
    if (battlePhaseRef.current !== 'fighting') return;

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

      if (!target || targetIndex === -1) return;

      let damage = attacker.attack;
      let actualDamage = damage;
      let shieldAbsorbed = 0;
      let surviveFatal = false;
      let healPercent = 0;

      if (target.isMainPlayer) {
        const playerDefense = playerRef.current.totalDefense;
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
          playerRef.current.takeDamage(actualDamage);
        }

        if (playerRef.current.isDead) {
          const surviveResult = gameManager.checkSurviveFatal();
          if (surviveResult.canSurvive) {
            surviveFatal = true;
            healPercent = surviveResult.healPercent;
            const healAmount = Math.floor(playerRef.current.maxHp * healPercent / 100);
            playerRef.current.hp = healAmount;
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
                hp: playerRef.current.hp,
                shield: newShield,
                isAlive: surviveFatal || playerRef.current.hp > 0
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
          setPhase('defeat');
          addLog('你被击败了！');
        }

        return newTeam;
      });

      const logParts: string[] = [];
      logParts.push(`${attacker.name}对${target.name}造成 ${finalActualDamage} 伤害`);
      if (finalShieldAbsorbed > 0) logParts.push(`护盾吸收${finalShieldAbsorbed}`);
      if (surviveFatal) logParts.push(`坚韧基因触发！HP恢复到${healPercent}%`);
      addLog(logParts.join(' '));
    });
  }, [clearAllTimers, addLog, gameManager, getAttackOrder]);

  useEffect(() => {
    if (phase !== 'fighting' || timersStartedRef.current) {
      return;
    }

    const currentEnemyTeam = enemyTeamRef.current;
    const currentPlayerTeam = playerTeamRef.current;

    if (currentEnemyTeam.length === 0 || currentPlayerTeam.length === 0) {
      return;
    }

    timersStartedRef.current = true;
    gameManager.resetAllGeneCooldowns();

    const stats = calculatePlayerStats();
    const playerSpeed = stats.speed || 1;
    const playerInterval = Math.max(200, 1000 / playerSpeed);

    const currentEnemy = enemies[currentEnemyIndex];
    const enemySpeed = currentEnemy?.speed || 1;
    const enemyInterval = Math.max(500, 1000 / enemySpeed);

    playerAttackTimer.current = window.setInterval(doPlayerAttack, playerInterval);
    enemyAttackTimer.current = window.setInterval(doEnemyAttack, enemyInterval);

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
  }, [phase, calculatePlayerStats, enemies, currentEnemyIndex, doPlayerAttack, doEnemyAttack, clearAllTimers, gameManager]);

  const renderUnitCard = (unit: BattleUnit, position: number) => {
    if (!unit.isAlive && unit.name === '') {
      return (
        <div
          key={unit.id}
          style={{
            width: '100%',
            height: '55px',
            backgroundColor: 'transparent',
          }}
        />
      );
    }

    const hpPercent = unit.maxHp > 0 ? (unit.hp / unit.maxHp) * 100 : 0;
    const hpColor = hpPercent > 50 ? '#22c55e' : hpPercent > 25 ? '#eab308' : '#ef4444';

    return (
      <div
        key={unit.id}
        style={{
          width: '100%',
          height: '55px',
          backgroundColor: unit.isAlive ? (unit.isPlayer ? 'rgba(0, 212, 255, 0.15)' : 'rgba(239, 68, 68, 0.15)') : 'rgba(50,50,50,0.3)',
          border: `1px solid ${unit.isAlive ? (unit.isPlayer ? 'rgba(0, 212, 255, 0.3)' : 'rgba(239, 68, 68, 0.3)') : 'transparent'}`,
          borderRadius: '8px',
          padding: '6px 8px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          opacity: unit.isAlive ? 1 : 0.4,
        }}
      >
        <div style={{
          fontSize: '11px',
          color: unit.isPlayer ? '#60a5fa' : '#f87171',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: '1.2',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <span>{unit.name}</span>
          <span style={{ fontSize: '9px', color: '#6b7280' }}>{position}号</span>
        </div>
        {unit.isAlive ? (
          <>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '10px',
              color: '#9ca3af',
              lineHeight: '1.2',
            }}>
              <span>{unit.hp}</span>
              <span>/{unit.maxHp}</span>
            </div>
            <div style={{
              backgroundColor: '#2a2f3f',
              borderRadius: '3px',
              height: '5px',
              overflow: 'hidden',
              position: 'relative',
            }}>
              <div style={{
                height: '100%',
                backgroundColor: hpColor,
                transition: 'width 0.3s',
                width: `${hpPercent}%`,
              }} />
              {unit.shield && unit.shield > 0 && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  height: '100%',
                  width: `${Math.min((unit.shield / (unit.maxHp * 0.5)) * 100, 50)}%`,
                  backgroundColor: '#3b82f6',
                  transition: 'width 0.3s',
                }} />
              )}
            </div>
          </>
        ) : (
          <div style={{
            fontSize: '11px',
            color: '#6b7280',
            textAlign: 'center',
            lineHeight: '1.2',
          }}>
            已阵亡
          </div>
        )}
      </div>
    );
  };

  const renderBattleField = () => {
    const enemyBackRow = [3, 4, 5].map(index => {
      const unit = enemyTeam[index] || { id: `enemy_${index}`, name: '', hp: 0, maxHp: 0, isPlayer: false, isAlive: false } as BattleUnit;
      return renderUnitCard(unit, index + 1);
    });

    const enemyFrontRow = [0, 1, 2].map(index => {
      const unit = enemyTeam[index] || { id: `enemy_${index}`, name: '', hp: 0, maxHp: 0, isPlayer: false, isAlive: false } as BattleUnit;
      return renderUnitCard(unit, index + 1);
    });

    const playerFrontRow = [0, 1, 2].map(index => {
      const unit = playerTeam[index] || { id: `player_${index}`, name: '', hp: 0, maxHp: 0, isPlayer: true, isAlive: false } as BattleUnit;
      return renderUnitCard(unit, index + 1);
    });

    const playerBackRow = [3, 4, 5].map(index => {
      const unit = playerTeam[index] || { id: `player_${index}`, name: '', hp: 0, maxHp: 0, isPlayer: true, isAlive: false } as BattleUnit;
      return renderUnitCard(unit, index + 1);
    });

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        padding: '16px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>敌方后排</div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {enemyBackRow}
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {enemyFrontRow}
          </div>
          <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>敌方前排</div>
        </div>

        {phase === 'fighting' && (
          <div style={{
            fontSize: '22px',
            color: themeColor,
            fontWeight: 'bold',
            textShadow: `0 0 10px ${themeColor}50`,
          }}>
            VS
          </div>
        )}

        {phase === 'victory' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#065f46',
              border: '2px solid #4ade80',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: '#4ade80',
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
              获得<br />经验
            </div>
            <div style={{ color: '#4ade80', fontSize: '14px', fontWeight: 'bold' }}>
              +{gainedExp}
            </div>
          </div>
        )}

        {phase === 'defeat' && (
          <div style={{
            fontSize: '18px',
            color: '#ef4444',
            fontWeight: 'bold',
          }}>
            失败...
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>我方前排</div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {playerFrontRow}
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {playerBackRow}
          </div>
          <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>我方后排</div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{animationStyles}</style>
      <div style={{
        height: '100vh',
        backgroundColor: '#0a0e27',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
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
          borderBottom: `1px solid ${themeColor}40`,
          padding: '10px 16px',
          boxShadow: `0 0 20px ${themeColor}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: themeColor, fontWeight: 'bold', fontSize: '15px' }}>{title}</span>
            {subtitle && (
              <span style={{
                color: themeColor,
                fontSize: '10px',
                padding: '2px 8px',
                background: `${themeColor}20`,
                borderRadius: '4px',
              }}>
                {subtitle}
              </span>
            )}
          </div>
          <div style={{ color: '#6b7280', fontSize: '11px' }}>
            敌人 {currentEnemyIndex + 1}/{enemies.length}
          </div>
        </header>

        <main style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 10,
        }}>
          {renderBattleField()}

          <div style={{
            backgroundColor: 'rgba(0, 10, 20, 0.6)',
            borderRadius: '10px',
            padding: '10px 12px',
            border: `1px solid ${themeColor}20`,
            margin: '12px',
            flex: 1,
            minHeight: '100px',
          }}>
            <div style={{ color: '#6b7280', fontSize: '11px', marginBottom: '6px', fontWeight: 'bold' }}>战斗记录</div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
              fontSize: '11px',
              maxHeight: '150px',
              overflowY: 'auto',
            }}>
              {battleLog.map((log, index) => (
                <div key={index} style={{
                  color: log.includes('暴击') ? '#fbbf24' : log.includes('闪避') ? '#60a5fa' : log.includes('胜利') ? '#4ade80' : log.includes('击败') ? '#ef4444' : log.includes('护盾') ? '#3b82f6' : log.includes('坚韧') ? '#a855f7' : '#9ca3af'
                }}>
                  {log}
                </div>
              ))}
            </div>
          </div>

          {phase === 'victory' && (
            <div style={{
              backgroundColor: '#065f46',
              borderRadius: '10px',
              padding: '12px',
              margin: '0 12px 12px',
              textAlign: 'center',
            }}>
              <button
                onClick={() => {
                  onBattleEndRef.current(true, gainedExp);
                }}
                style={{
                  padding: '10px 28px',
                  backgroundColor: '#16a34a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px',
                }}
              >
                确认
              </button>
            </div>
          )}

          {phase === 'defeat' && (
            <div style={{
              backgroundColor: '#7f1d1d',
              borderRadius: '10px',
              padding: '12px',
              margin: '0 12px 12px',
              textAlign: 'center',
            }}>
              <button
                onClick={() => {
                  onBattleEndRef.current(false, 0);
                }}
                style={{
                  padding: '10px 28px',
                  backgroundColor: '#dc2626',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px',
                }}
              >
                确认
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
