import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { battleSkillManager } from '../BattleSkillSystem';
import type { StatusEffect, SummonedUnit } from '../StatusEffectManager';
import { updateStatusEffects, applyStatusEffect, calculateBurnDamage, hasEffect, createStatusEffect } from '../StatusEffectManager';
import { updateSummonedUnits, processSummonAttacks, createSummonedUnit, enhanceSummons } from '../SummonManager';
import { usePlayerTeam } from './hooks/usePlayerTeam';
import { useEnemyTeam } from './hooks/useEnemyTeam';
import type { BattleScreenProps, BattleUnit, BattleEnemy, BattlePhase, FloatingReward, FloatingSkillName } from './types';
import { getItemTemplate } from '../../data/items';

const THEME = {
  primary: '#00d4ff',
  secondary: '#0099cc',
  glow: 'rgba(0, 212, 255, 0.6)',
};

const animationStyles = `
  @keyframes scan {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }
  @keyframes floatUp {
    0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    50% { opacity: 1; transform: translate(-50%, -100%) scale(1.2); }
    100% { opacity: 0; transform: translate(-50%, -150%) scale(0.8); }
  }
  @keyframes skillNameFade {
    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
    20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
    30% { transform: translate(-50%, -50%) scale(1); }
    70% { opacity: 1; }
    100% { opacity: 0; transform: translate(-50%, -80%) scale(1); }
  }
`;

export function BattleScreen({
  mode,
  enemies,
  title = '战斗',
  subtitle = '',
  themeColor = '#0099cc',
  onBattleEnd,
  endlessConfig,
}: BattleScreenProps) {
  const gameManager = useGameStore(state => state.gameManager);
  const player = useGameStore(state => state.getPlayer());
  const saveGame = useGameStore(state => state.saveGame);

  const [phase, setPhase] = useState<BattlePhase>('fighting');
  const [currentEnemyIndex, setCurrentEnemyIndex] = useState(0);
  const [battleLog, setBattleLog] = useState<{ id: string; text: string; type: 'normal' | 'skill'; isPlayerAttack?: boolean }[]>([]);
  const [gainedExp, setGainedExp] = useState(0);
  const [floatingSkillNames, setFloatingSkillNames] = useState<FloatingSkillName[]>([]);
  const [floatingRewards, setFloatingRewards] = useState<FloatingReward[]>([]);

  const [playerTeam, setPlayerTeam] = useState<BattleUnit[]>([]);
  const [enemyTeam, setEnemyTeam] = useState<BattleUnit[]>([]);
  const [summonedUnits, setSummonedUnits] = useState<SummonedUnit[]>([]);
  const [statusEffects, setStatusEffects] = useState<StatusEffect[]>([]);

  const playerAttackTimer = useRef<number | null>(null);
  const enemyAttackTimer = useRef<number | null>(null);
  const geneCooldownTimer = useRef<number | null>(null);
  const summonUpdateTimer = useRef<number | null>(null);
  const statusEffectTimer = useRef<number | null>(null);

  const playerTeamRef = useRef<BattleUnit[]>(playerTeam);
  const enemyTeamRef = useRef<BattleUnit[]>(enemyTeam);
  const currentEnemyIndexRef = useRef(currentEnemyIndex);
  const phaseRef = useRef<BattlePhase>('fighting');
  const timersStartedRef = useRef(false);
  const statusEffectsRef = useRef<StatusEffect[]>(statusEffects);
  const playerRef = useRef(player);
  const rewardIdRef = useRef(0);

  const { playerStatsRef, calculatePlayerStats, initPlayerTeam } = usePlayerTeam();
  const { initEnemyTeam } = useEnemyTeam();

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
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    statusEffectsRef.current = statusEffects;
  }, [statusEffects]);

  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  const addLog = useCallback((message: string, type: 'normal' | 'skill' = 'normal', isPlayerAttack?: boolean) => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    const uniqueId = `${timestamp}-${random}`;
    setBattleLog(logs => {
      const newLog = { id: uniqueId, text: message, type, isPlayerAttack };
      const newLogs = [newLog, ...logs];
      const normalLogs = newLogs.filter(l => l.type === 'normal').slice(0, 15);
      const skillLogs = newLogs.filter(l => l.type === 'skill').slice(0, 15);
      return [...normalLogs, ...skillLogs];
    });
  }, []);

  const showSkillName = useCallback((unitId: string, skillName: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setFloatingSkillNames(prev => [...prev, { id, unitId, skillName, createdAt: Date.now() }]);
    setTimeout(() => {
      setFloatingSkillNames(prev => prev.filter(s => s.id !== id));
    }, 1500);
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
    if (summonUpdateTimer.current) {
      clearInterval(summonUpdateTimer.current);
      summonUpdateTimer.current = null;
    }
    if (statusEffectTimer.current) {
      clearInterval(statusEffectTimer.current);
      statusEffectTimer.current = null;
    }
  }, []);

  const getAttackOrder = useCallback((attackerPosition: number, isPlayer: boolean): number[] => {
    const pos = attackerPosition - 1;
    let targetFrontRow: number[];
    let targetBackRow: number[];

    if (isPlayer) {
      targetFrontRow = [3, 4, 5];
      targetBackRow = [0, 1, 2];
    } else {
      targetFrontRow = [0, 1, 2];
      targetBackRow = [3, 4, 5];
    }

    let oppositeFront: number;
    let oppositeBack: number;

    if (isPlayer) {
      if (pos <= 2) {
        oppositeFront = pos + 3;
        oppositeBack = pos;
      } else {
        oppositeFront = pos;
        oppositeBack = pos - 3;
      }
    } else {
      if (pos <= 2) {
        oppositeFront = pos;
        oppositeBack = pos + 3;
      } else {
        oppositeFront = pos - 3;
        oppositeBack = pos;
      }
    }

    const otherFrontRow = targetFrontRow.filter(idx => idx !== oppositeFront);
    const otherBackRow = targetBackRow.filter(idx => idx !== oppositeBack);

    return [oppositeFront, ...otherFrontRow, oppositeBack, ...otherBackRow];
  }, []);

  const onEnemyDefeated = useCallback(() => {
    clearAllTimers();
    if (currentEnemyIndexRef.current < enemies.length - 1) {
      setCurrentEnemyIndex(prev => prev + 1);
      addLog(`击败敌人！`);
    } else {
      setPhase('victory');
      const totalExp = enemies.reduce((sum, e) => sum + (e.rewards?.exp || 0), 0);
      setGainedExp(totalExp);
      player.addExp(totalExp);
      addLog(`战斗胜利！获得 ${totalExp} 经验`);
    }
  }, [clearAllTimers, enemies, addLog, player]);

  const onPlayerDefeated = useCallback(() => {
    clearAllTimers();
    setPhase('defeat');
    addLog('你被击败了！');
  }, [clearAllTimers, addLog]);

  const applySkillEffectInternal = useCallback((result: any, attacker: BattleUnit) => {
    if (result.statusEffects && result.statusEffects.length > 0) {
      setStatusEffects(prev => {
        let updated = [...prev];
        result.statusEffects!.forEach((effect: StatusEffect) => {
          updated = applyStatusEffect(updated, effect);
        });
        return updated;
      });
    }

    switch (result.type) {
      case 'damage':
        result.targetIndices.forEach((targetIndex: number) => {
          setEnemyTeam(prev => {
            const target = prev[targetIndex];
            if (target && target.isAlive) {
              let damage = result.value;
              const newHp = Math.max(0, target.hp - damage);
              const newTeam = prev.map((u, idx) =>
                idx === targetIndex ? { ...u, hp: newHp, isAlive: newHp > 0 } : u
              );
              enemyTeamRef.current = newTeam;

              const remainingEnemies = newTeam.filter(u => u.isAlive);
              if (remainingEnemies.length === 0) {
                setTimeout(() => {
                  const currentEnemies = enemyTeamRef.current.filter(u => u.isAlive);
                  if (currentEnemies.length === 0) {
                    onEnemyDefeated();
                  }
                }, 500);
              }

              return newTeam;
            }
            return prev;
          });
        });
        break;

      case 'heal':
        result.targetIndices.forEach((targetIndex: number) => {
          setPlayerTeam(prev => {
            const target = prev[targetIndex];
            if (target && target.isAlive) {
              const heal = result.value;
              const newHp = Math.min(target.maxHp, target.hp + heal);
              const newTeam = prev.map((u, idx) =>
                idx === targetIndex ? { ...u, hp: newHp } : u
              );
              playerTeamRef.current = newTeam;
              return newTeam;
            }
            return prev;
          });
        });
        break;

      case 'shield':
        result.targetIndices.forEach((targetIndex: number) => {
          setPlayerTeam(prev => {
            const target = prev[targetIndex];
            if (target && target.isAlive) {
              let newShield = (target.shield || 0) + result.value;
              const defaultMaxShield = Math.floor(target.maxHp * 0.5);
              newShield = Math.min(newShield, defaultMaxShield);
              const newTeam = prev.map((u, idx) =>
                idx === targetIndex ? { ...u, shield: newShield } : u
              );
              playerTeamRef.current = newTeam;
              return newTeam;
            }
            return prev;
          });
        });
        break;

      case 'buff':
        addLog(`【增益】${attacker.name} 获得增益效果`, 'skill');
        break;

      case 'debuff':
        addLog(`【减益】对目标施加减益效果`, 'skill');
        break;

      case 'control':
        addLog(`【控制】${result.logMessage}`, 'skill');
        break;

      case 'summon':
        if (result.summonData) {
          const newSummons = createSummonedUnit(
            result.summonData.summonId,
            attacker.id,
            attacker.name,
            attacker.attack,
            result.summonData.skillLevel,
            result.summonData.count
          );
          setSummonedUnits(prev => [...prev, ...newSummons]);
          addLog(result.logMessage, 'skill');
        }
        if (result.enhanceSummons) {
          setSummonedUnits(prev => {
            const enhanced = enhanceSummons(prev, attacker.id, result.enhanceSummons!.duration);
            if (result.enhanceSummons!.additionalSummons) {
              const additionalSummons = createSummonedUnit(
                'drone',
                attacker.id,
                attacker.name,
                attacker.attack,
                1,
                result.enhanceSummons!.additionalSummons
              );
              return [...enhanced, ...additionalSummons];
            }
            return enhanced;
          });
          addLog(result.logMessage, 'skill');
        }
        break;
    }
  }, [addLog, onEnemyDefeated]);

  const doPlayerAttack = useCallback(() => {
    if (phaseRef.current !== 'fighting') return;

    const currentEnemyTeam = enemyTeamRef.current;
    const currentPlayerTeam = playerTeamRef.current;

    const alivePlayers = currentPlayerTeam.filter(u => u.isAlive);
    if (alivePlayers.length === 0) return;

    const enemyAliveFront = currentEnemyTeam.filter((u, idx) => idx >= 3 && idx <= 5 && u.isAlive);
    const hasEnemyFrontAlive = enemyAliveFront.length > 0;

    battleSkillManager.updateCooldowns(1);

    alivePlayers.forEach(attacker => {
      const attackerIndex = parseInt(attacker.id.split('_')[1]);

      if (attacker.crewId && !attacker.isMainPlayer) {
        const allUnits = [...currentPlayerTeam, ...currentEnemyTeam];

        if (battleSkillManager.canUseUltimate(attacker.id)) {
          const ultimateResult = battleSkillManager.executeUltimate(
            attacker.id,
            attackerIndex,
            { attack: attacker.attack, defense: attacker.defense },
            allUnits
          );

          if (ultimateResult) {
            showSkillName(attacker.id, ultimateResult.skillName || '终极技能');
            applySkillEffectInternal(ultimateResult, attacker);
            addLog(ultimateResult.logMessage, 'skill');
            return;
          }
        }

        const skillResult = battleSkillManager.executeSkill(
          attacker.id,
          attackerIndex,
          { attack: attacker.attack, defense: attacker.defense },
          allUnits
        );

        if (skillResult) {
          showSkillName(attacker.id, skillResult.skillName || '技能');
          applySkillEffectInternal(skillResult, attacker);
          addLog(skillResult.logMessage, 'skill');
          return;
        }

        const basicResult = battleSkillManager.executeBasicAttack(
          attacker.id,
          attackerIndex,
          { attack: attacker.attack, defense: attacker.defense },
          allUnits
        );

        if (basicResult && basicResult.targetIndices.length > 0) {
          applySkillEffectInternal(basicResult, attacker);
          addLog(`${attacker.name} 普攻造成 ${basicResult.value} 点伤害`, 'normal', true);
        }
        return;
      }

      if (attacker.isMainPlayer) {
        const attackOrder = getAttackOrder(attackerIndex + 1, true);

        let target: BattleUnit | null = null;
        let targetIndex = -1;

        for (const index of attackOrder) {
          const unit = currentEnemyTeam[index];
          if (unit && unit.isAlive) {
            if (hasEnemyFrontAlive && (index < 3 || index > 5)) {
              continue;
            }
            target = unit;
            targetIndex = index;
            break;
          }
        }

        if (!target || targetIndex === -1) return;

        let damage = attacker.attack;
        let isCrit = false;

        const attackerCrit = playerStatsRef.current.totalCrit;
        const attackerCritDamage = playerStatsRef.current.totalCritDamage;

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
        const playerPenetration = playerStatsRef.current.totalPenetration;
        const playerPenetrationPercent = playerStatsRef.current.totalPenetrationPercent;
        const defenseAfterPenetrationPercent = enemyDefense * (1 - playerPenetrationPercent / 100);
        const actualDefense = Math.max(0, defenseAfterPenetrationPercent - playerPenetration);
        const finalReduction = (actualDefense / (enemyDefense + 600)) * 100;
        damage = Math.floor(damage * (1 - finalReduction / 100));
        damage = Math.max(1, damage);

        const targetNewHp = Math.max(0, target.hp - damage);

        let lifeStealHeal = 0;
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

        setEnemyTeam(prev => {
          const newTeam = prev.map((u, idx) => {
            if (idx === targetIndex) {
              return { ...u, hp: targetNewHp, isAlive: targetNewHp > 0 };
            }
            return u;
          });
          enemyTeamRef.current = newTeam;

          const remainingEnemies = newTeam.filter(u => u.isAlive);
          if (remainingEnemies.length === 0) {
            setTimeout(() => {
              const currentEnemies = enemyTeamRef.current.filter(u => u.isAlive);
              if (currentEnemies.length === 0) {
                onEnemyDefeated();
              }
            }, 500);
          }

          return newTeam;
        });

        const logParts: string[] = [];
        if (isCrit) logParts.push('暴击！');
        logParts.push(`${attacker.name}对${target.name}造成 ${damage} 伤害`);
        if (lifeStealHeal > 0) logParts.push(`吸血+${lifeStealHeal}`);
        addLog(logParts.join(' '), 'normal', true);
      }
    });
  }, [addLog, applySkillEffectInternal, getAttackOrder, onEnemyDefeated, playerStatsRef, showSkillName]);

  const doEnemyAttack = useCallback(() => {
    if (phaseRef.current !== 'fighting') return;

    const currentEnemyTeam = enemyTeamRef.current;
    const currentPlayerTeam = playerTeamRef.current;

    const aliveEnemies = currentEnemyTeam.filter(u => u.isAlive);
    if (aliveEnemies.length === 0) return;

    const playerAliveFront = currentPlayerTeam.filter((u, idx) => idx <= 2 && u.isAlive);
    const hasPlayerFrontAlive = playerAliveFront.length > 0;

    aliveEnemies.forEach(attacker => {
      const attackerIndex = parseInt(attacker.id.split('_')[1]);

      if (hasEffect(statusEffectsRef.current, attacker.id, 'stun')) {
        addLog(`${attacker.name} 处于眩晕状态，无法行动`, 'skill');
        return;
      }

      const attackOrder = getAttackOrder(attackerIndex + 1, false);

      let target: BattleUnit | null = null;
      let targetIndex = -1;

      for (const index of attackOrder) {
        const unit = currentPlayerTeam[index];
        if (unit && unit.isAlive) {
          if (hasPlayerFrontAlive && index > 2) {
            continue;
          }
          target = unit;
          targetIndex = index;
          break;
        }
      }

      if (!target || targetIndex === -1) return;

      const targetDodge = target.dodge || 0;
      const isDodged = targetDodge > 0 && Math.random() * 100 < targetDodge;

      if (isDodged) {
        addLog(`${target.name} 闪避了 ${attacker.name} 的攻击！`, 'normal', true);
        return;
      }

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
          onPlayerDefeated();
        }

        return newTeam;
      });

      const logParts: string[] = [];
      logParts.push(`${attacker.name}对${target.name}造成 ${finalActualDamage} 伤害`);
      if (finalShieldAbsorbed > 0) logParts.push(`护盾吸收${finalShieldAbsorbed}`);
      if (surviveFatal) logParts.push(`坚韧基因触发！HP恢复到${healPercent}%`);
      addLog(logParts.join(' '), 'normal', false);
    });
  }, [addLog, gameManager, getAttackOrder, onPlayerDefeated]);

  useEffect(() => {
    const initialPlayerTeam = initPlayerTeam();
    const initialEnemyTeam = initEnemyTeam(enemies[0]);
    setPlayerTeam(initialPlayerTeam);
    setEnemyTeam(initialEnemyTeam);
    playerTeamRef.current = initialPlayerTeam;
    enemyTeamRef.current = initialEnemyTeam;
    addLog(`遭遇了 ${enemies[0].name}！`);
    addLog('战斗开始！');

    initialPlayerTeam.forEach((unit) => {
      if (unit.isAlive && unit.crewId && !unit.isMainPlayer) {
        battleSkillManager.initUnitSkills(unit.id, unit.crewId, unit.star || 1);
      }
    });

    setTimeout(() => {
      initialPlayerTeam.forEach((unit, idx) => {
        if (unit.isAlive && unit.crewId && unit.star && unit.star >= 5) {
          const results = battleSkillManager.onBattleStart(unit.id, idx, [
            ...initialPlayerTeam.map((p, i) => ({ ...p, index: i, isPlayer: true })),
            ...initialEnemyTeam.map((e, i) => ({ ...e, index: i, isPlayer: false })),
          ]);

          results.forEach(result => {
            if (result.type === 'shield') {
              setPlayerTeam(prev => {
                const newTeam = prev.map((u, uIdx) => {
                  if (result.targetIndices.includes(uIdx) && u.isAlive) {
                    const shieldValue = result.shieldValue ? Math.floor(u.defense * (result.shieldValue / 100)) : result.value;
                    return { ...u, shield: (u.shield || 0) + shieldValue };
                  }
                  return u;
                });
                playerTeamRef.current = newTeam;
                return newTeam;
              });
              addLog(result.logMessage, 'skill');
            } else if (result.type === 'debuff') {
              if (result.burnStacks) {
                const targetIdx = result.targetIndices[0];
                const target = initialEnemyTeam[targetIdx];
                if (target) {
                  setStatusEffects(prev => {
                    const burnEffect = createStatusEffect(
                      'burn',
                      `enemy_${targetIdx}`,
                      unit.id,
                      unit.name,
                      20,
                      5,
                      { extra: { damagePerSecond: 20 }, sourceAttack: unit.attack }
                    );
                    return applyStatusEffect(prev, burnEffect);
                  });
                  addLog(result.logMessage, 'skill');
                }
              }
            }
          });
        }
      });
    }, 500);
  }, [initPlayerTeam, initEnemyTeam, enemies, addLog]);

  useEffect(() => {
    if (enemies.length > 0 && currentEnemyIndex < enemies.length && currentEnemyIndex > 0) {
      const newEnemyTeam = initEnemyTeam(enemies[currentEnemyIndex]);
      setEnemyTeam(newEnemyTeam);
      enemyTeamRef.current = newEnemyTeam;
      setStatusEffects([]);
      addLog(`遭遇 ${enemies[currentEnemyIndex].name}！`);
    }
  }, [currentEnemyIndex, enemies, initEnemyTeam, addLog]);

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

    playerAttackTimer.current = window.setInterval(doPlayerAttack, playerInterval);
    enemyAttackTimer.current = window.setInterval(doEnemyAttack, 1000);

    geneCooldownTimer.current = window.setInterval(() => {
      const fragments = gameManager.getGeneFragments();
      fragments.forEach(f => {
        if (f.cooldownRemaining && f.cooldownRemaining > 0) {
          f.cooldownRemaining -= 1;
        }
      });

      const hpRegenPercent = playerRef.current.totalHpRegenPercent;
      if (hpRegenPercent > 0 && phaseRef.current === 'fighting') {
        const maxHp = playerRef.current.totalMaxHp;
        const regenAmount = Math.floor(maxHp * hpRegenPercent / 100);
        if (regenAmount > 0) {
          const currentHp = playerRef.current.hp;
          if (currentHp < maxHp) {
            playerRef.current.heal(regenAmount);
            const newHp = playerRef.current.hp;
            setPlayerTeam(prev => {
              const mainPlayerIdx = prev.findIndex(u => u.isMainPlayer);
              if (mainPlayerIdx >= 0) {
                const newTeam = [...prev];
                newTeam[mainPlayerIdx] = { ...newTeam[mainPlayerIdx], hp: newHp };
                return newTeam;
              }
              return prev;
            });
          }
        }
      }
    }, 1000);

    summonUpdateTimer.current = window.setInterval(() => {
      if (phaseRef.current !== 'fighting') return;

      setSummonedUnits(prev => {
        const { updatedSummons } = updateSummonedUnits(prev, 0.1);

        const updatedAfterAttacks = processSummonAttacks(
          updatedSummons,
          0.1,
          enemyTeamRef.current.map((e, idx) => ({
            id: e.id,
            name: e.name,
            hp: e.hp,
            maxHp: e.maxHp,
            defense: e.defense,
            isAlive: e.isAlive,
            index: idx,
          })),
          () => {},
          (targetIndex, damage) => {
            setEnemyTeam(prev => {
              const newTeam = prev.map((u, idx) => {
                if (idx === targetIndex && u.isAlive) {
                  const newHp = Math.max(0, u.hp - damage);
                  return { ...u, hp: newHp, isAlive: newHp > 0 };
                }
                return u;
              });
              enemyTeamRef.current = newTeam;

              const remainingEnemies = newTeam.filter(u => u.isAlive);
              if (remainingEnemies.length === 0) {
                onEnemyDefeated();
              }

              return newTeam;
            });
          }
        );

        return updatedAfterAttacks;
      });
    }, 100);

    statusEffectTimer.current = window.setInterval(() => {
      if (phaseRef.current !== 'fighting') return;

      setStatusEffects(prev => {
        const { updatedEffects, tickEffects } = updateStatusEffects(prev, 0.1);

        tickEffects.forEach(effect => {
          if (effect.type === 'burn') {
            const damage = calculateBurnDamage([effect], effect.targetId);
            if (damage > 0) {
              if (effect.targetId.startsWith('enemy_')) {
                const targetIndex = parseInt(effect.targetId.split('_')[1]);
                setEnemyTeam(prevTeam => {
                  const target = prevTeam[targetIndex];
                  if (target && target.isAlive) {
                    const newHp = Math.max(0, target.hp - damage);
                    const newTeam = prevTeam.map((u, idx) =>
                      idx === targetIndex ? { ...u, hp: newHp, isAlive: newHp > 0 } : u
                    );
                    enemyTeamRef.current = newTeam;

                    const aliveEnemies = newTeam.filter(u => u.isAlive);
                    if (aliveEnemies.length === 0) {
                      onEnemyDefeated();
                    }

                    return newTeam;
                  }
                  return prevTeam;
                });
              } else if (effect.targetId.startsWith('player_')) {
                const targetIndex = parseInt(effect.targetId.split('_')[1]);
                setPlayerTeam(prevTeam => {
                  const target = prevTeam[targetIndex];
                  if (target && target.isAlive) {
                    const newHp = Math.max(0, target.hp - damage);
                    const newTeam = prevTeam.map((u, idx) =>
                      idx === targetIndex ? { ...u, hp: newHp, isAlive: newHp > 0 } : u
                    );
                    playerTeamRef.current = newTeam;

                    const alivePlayers = newTeam.filter(u => u.isAlive);
                    if (alivePlayers.length === 0) {
                      onPlayerDefeated();
                    }

                    return newTeam;
                  }
                  return prevTeam;
                });
              }
            }
          }
        });

        return updatedEffects;
      });
    }, 100);

    return () => {
      clearAllTimers();
      timersStartedRef.current = false;
    };
  }, [phase, calculatePlayerStats, doPlayerAttack, doEnemyAttack, clearAllTimers, gameManager, onEnemyDefeated, onPlayerDefeated, addLog]);

  const handleVictory = useCallback(() => {
    if (mode === 'single') {
      return;
    }

    if (!endlessConfig) return;

    let credits = 0;
    let exp = 0;
    let materials: { name: string; count: number }[] = [];

    const result = endlessConfig.onVictory();
    credits = result.credits;
    exp = result.exp;
    materials = result.materials.map(m => {
      const template = getItemTemplate(m.itemId);
      return { name: template?.name || m.itemId, count: m.count };
    });

    const id = ++rewardIdRef.current;
    setFloatingRewards(prev => [...prev, { credits, exp, materials, id }]);
    setTimeout(() => {
      setFloatingRewards(prev => prev.filter(r => r.id !== id));
    }, 2000);
    saveGame();
  }, [mode, endlessConfig, saveGame]);

  useEffect(() => {
    if (phase === 'victory') {
      if (mode === 'endless' && endlessConfig) {
        handleVictory();
        gameManager.refreshPlayerState();
        clearAllTimers();
        timersStartedRef.current = false;
        setPhase('fighting');
        setCurrentEnemyIndex(0);
        setStatusEffects([]);
        setSummonedUnits([]);
        setFloatingSkillNames([]);
        const initialPlayerTeam = initPlayerTeam();
        const initialEnemyTeam = initEnemyTeam(enemies[0]);
        setPlayerTeam(initialPlayerTeam);
        setEnemyTeam(initialEnemyTeam);
        playerTeamRef.current = initialPlayerTeam;
        enemyTeamRef.current = initialEnemyTeam;
        setBattleLog([]);
        addLog(`遭遇了 ${enemies[0].name}！`);
        addLog('战斗开始！');

        initialPlayerTeam.forEach((unit) => {
          if (unit.isAlive && unit.crewId && !unit.isMainPlayer) {
            battleSkillManager.initUnitSkills(unit.id, unit.crewId, unit.star || 1);
          }
        });

        if (endlessConfig.onVictoryComplete) {
          endlessConfig.onVictoryComplete();
        }

        return;
      }
    }
    if (phase === 'defeat') {
      if (mode === 'endless' && endlessConfig) {
        if (endlessConfig.isBoss && endlessConfig.onBossDefeat) {
          endlessConfig.onBossDefeat();
          return;
        }
        gameManager.refreshPlayerState();
        saveGame();
      }
    }
  }, [phase, handleVictory, gameManager, clearAllTimers, initPlayerTeam, initEnemyTeam, enemies, addLog, mode, endlessConfig, saveGame]);

  const handleChallengeBoss = useCallback(() => {
    if (phase === 'fighting') {
      clearAllTimers();
    }
    if (endlessConfig) {
      endlessConfig.onChallengeBoss();
    }
  }, [phase, clearAllTimers, endlessConfig]);

  const handleRestart = useCallback(() => {
    if (endlessConfig) {
      endlessConfig.onRestart();
    }
  }, [endlessConfig]);

  const handleBack = useCallback(() => {
    if (mode === 'endless' && endlessConfig) {
      endlessConfig.onBack();
    } else if (onBattleEnd) {
      onBattleEnd(false, 0);
    }
  }, [mode, endlessConfig, onBattleEnd]);

  const renderUnitCard = (unit: BattleUnit, isCompact: boolean = false) => {
    if (!unit.isAlive && unit.name === '') {
      return (
        <div
          key={unit.id}
          style={{
            width: '100%',
            height: isCompact ? '45px' : '55px',
            backgroundColor: 'transparent',
          }}
        />
      );
    }

    const hpPercent = unit.maxHp > 0 ? (unit.hp / unit.maxHp) * 100 : 0;
    const hpColor = hpPercent > 50 ? '#22c55e' : hpPercent > 25 ? '#eab308' : '#ef4444';

    const unitEffects = statusEffects.filter(e => e.targetId === unit.id && e.remainingTime > 0);

    if (isCompact) {
      return (
        <div
          key={unit.id}
          style={{
            width: '100%',
            height: '45px',
            backgroundColor: unit.isAlive ? 'rgba(239, 68, 68, 0.15)' : 'rgba(50,50,50,0.3)',
            border: `1px solid ${unit.isAlive ? 'rgba(239, 68, 68, 0.3)' : 'transparent'}`,
            borderRadius: '8px',
            padding: '6px 10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            opacity: unit.isAlive ? 1 : 0.4,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
            {unitEffects.length > 0 && (
              <div style={{ display: 'flex', gap: '1px', flexShrink: 0 }}>
                {unitEffects.map(effect => (
                  <span key={effect.id} style={{ fontSize: '8px', opacity: 0.8 }}>
                    {effect.type === 'burn' ? '🔥' : effect.type === 'armorBreak' ? '💔' : effect.type === 'stun' ? '💫' : '⭐'}
                  </span>
                ))}
              </div>
            )}
            <div style={{ fontSize: '12px', color: '#f87171', fontWeight: 'bold', textAlign: 'center' }}>
              {unit.name}
            </div>
          </div>
          {unit.isAlive && (
            <>
              <div style={{ backgroundColor: '#2a2f3f', borderRadius: '3px', height: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: hpColor, transition: 'width 0.3s', width: `${hpPercent}%` }} />
              </div>
              {unitEffects.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2px', marginTop: '2px' }}>
                  {unitEffects.map(effect => {
                    const isNegative = ['burn', 'armorBreak', 'stun', 'attackReduce'].includes(effect.type);
                    const stacks = effect.currentStacks || 1;
                    const buffName = effect.type === 'burn' ? '灼烧' :
                      effect.type === 'armorBreak' ? '破甲' :
                      effect.type === 'stun' ? '眩晕' :
                      effect.type === 'attackReduce' ? '攻击↓' : effect.type;
                    const timeStr = effect.remainingTime === Infinity ? '' : `${effect.remainingTime.toFixed(0)}s`;
                    return (
                      <span key={effect.id} style={{
                        fontSize: '8px',
                        padding: '0px 2px',
                        borderRadius: '2px',
                        backgroundColor: isNegative ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)',
                        color: isNegative ? '#fca5a5' : '#86efac',
                        whiteSpace: 'nowrap',
                      }}>
                        {buffName}{stacks > 1 ? `×${stacks}` : ''} {timeStr}
                      </span>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      );
    }

    const unitSummons = summonedUnits.filter(s => s.ownerId === unit.id && s.isAlive);

    return (
      <div
        key={unit.id}
        style={{
          width: '100%',
          height: unitEffects.length > 0 ? '70px' : '55px',
          backgroundColor: unit.isAlive ? 'rgba(0, 212, 255, 0.1)' : 'rgba(50,50,50,0.3)',
          border: `1px solid ${unit.isAlive ? 'rgba(0, 212, 255, 0.3)' : 'transparent'}`,
          borderRadius: '8px',
          padding: '6px 8px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          opacity: unit.isAlive ? 1 : 0.4,
          position: 'relative',
          transition: 'height 0.2s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '100%' }}>
          {unitSummons.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'row', gap: '2px', flexShrink: 0 }}>
              {unitSummons.map(summon => (
                <div
                  key={summon.id}
                  title={`${summon.name} 剩余${summon.remainingTime.toFixed(1)}秒`}
                  style={{ width: '4px', height: '12px', backgroundColor: 'rgba(100, 100, 100, 0.3)', borderRadius: '1px', overflow: 'hidden', position: 'relative' }}
                >
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${(summon.remainingTime / summon.duration) * 100}%`, backgroundColor: summon.enhanced ? '#fbbf24' : '#60a5fa', transition: 'height 0.1s' }} />
                </div>
              ))}
            </div>
          )}
          <div style={{ fontSize: '11px', color: '#60a5fa', fontWeight: 'bold', textAlign: 'center', flex: 1 }}>
            {unit.name}
          </div>
          {unitEffects.length > 0 && (
            <div style={{ display: 'flex', gap: '1px', flexShrink: 0 }}>
              {unitEffects.map(effect => (
                <span key={effect.id} style={{ fontSize: '8px', opacity: 0.8 }}>
                  {effect.type === 'burn' ? '🔥' : effect.type === 'armorBreak' ? '💔' : effect.type === 'stun' ? '💫' : effect.type === 'speedBoost' ? '⚡' : '⭐'}
                </span>
              ))}
            </div>
          )}
        </div>
        {unit.isAlive ? (
          <>
            <div style={{ backgroundColor: '#2a2f3f', borderRadius: '3px', height: '5px', overflow: 'hidden', position: 'relative' }}>
              <div style={{ height: '100%', backgroundColor: hpColor, transition: 'width 0.3s', width: `${hpPercent}%` }} />
              {unit.shield && unit.shield > 0 && (
                <div style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: `${Math.min((unit.shield / (unit.maxHp * 0.5)) * 100, 50)}%`, backgroundColor: '#3b82f6', transition: 'width 0.3s' }} />
              )}
            </div>
            {unitEffects.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2px', marginTop: '2px' }}>
                {unitEffects.map(effect => {
                  const isNegative = ['burn', 'armorBreak', 'stun', 'attackReduce'].includes(effect.type);
                  const stacks = effect.currentStacks || 1;
                  const buffName = effect.type === 'burn' ? '灼烧' :
                    effect.type === 'armorBreak' ? '破甲' :
                    effect.type === 'stun' ? '眩晕' :
                    effect.type === 'attackReduce' ? '攻击↓' :
                    effect.type === 'speedBoost' ? '攻速↑' :
                    effect.type === 'attackBoost' ? '攻击↑' :
                    effect.type === 'vitality' ? '活力' :
                    effect.type === 'invincible' ? '无敌' : effect.type;
                  const timeStr = effect.remainingTime === Infinity ? '' : `${effect.remainingTime.toFixed(0)}s`;
                  return (
                    <span key={effect.id} style={{
                      fontSize: '9px',
                      padding: '1px 4px',
                      borderRadius: '3px',
                      backgroundColor: isNegative ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)',
                      color: isNegative ? '#fca5a5' : '#86efac',
                      border: `1px solid ${isNegative ? 'rgba(239, 68, 68, 0.5)' : 'rgba(34, 197, 94, 0.5)'}`,
                      whiteSpace: 'nowrap',
                    }}>
                      {buffName}{stacks > 1 ? `×${stacks}` : ''} {timeStr}
                    </span>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div style={{ fontSize: '11px', color: '#6b7280', textAlign: 'center' }}>已阵亡</div>
        )}
        {floatingSkillNames.filter(s => s.unitId === unit.id).map(skill => (
          <div key={skill.id} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#a855f7', fontSize: '12px', fontWeight: 'bold', textShadow: '0 0 8px rgba(168, 85, 247, 0.8)', whiteSpace: 'nowrap', pointerEvents: 'none', animation: 'skillNameFade 1.5s ease-out forwards', zIndex: 10 }}>
            {skill.skillName}
          </div>
        ))}
      </div>
    );
  };

  const enemyAliveCount = enemyTeam.filter(u => u.isAlive).length;
  const playerAliveCount = playerTeam.filter(u => u.isAlive).length;

  const aliveEnemies = enemyTeam.filter(u => u.isAlive);
  const enemyCards = aliveEnemies.map((unit) => renderUnitCard(unit, true));

  const playerFrontRow = [0, 1, 2].map(index => {
    const unit = playerTeam[index] || { id: `player_${index}`, name: '', hp: 0, maxHp: 0, isPlayer: true, isAlive: false, index } as BattleUnit;
    return renderUnitCard(unit, false);
  });

  const playerBackRow = [3, 4, 5].map(index => {
    const unit = playerTeam[index] || { id: `player_${index}`, name: '', hp: 0, maxHp: 0, isPlayer: true, isAlive: false, index } as BattleUnit;
    return renderUnitCard(unit, false);
  });

  return (
    <>
      <style>{animationStyles}</style>
      <div style={{ height: '100vh', backgroundColor: '#0a0e27', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(180deg, #0a0a1a 0%, #0c1929 50%, #0a0a1a 100%)', zIndex: 0 }} />

        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: `linear-gradient(180deg, transparent 0%, ${THEME.glow}03 50%, transparent 100%)`, backgroundSize: '100% 4px', animation: 'scan 8s linear infinite', pointerEvents: 'none', zIndex: 2 }} />

        <header style={{ flexShrink: 0, position: 'relative', zIndex: 10, background: 'rgba(0, 10, 20, 0.7)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${themeColor}40`, padding: '10px 16px', paddingTop: 'max(env(safe-area-inset-top, 0), 6px)', boxShadow: `0 0 20px ${themeColor}20`, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: themeColor, fontWeight: 'bold', fontSize: '15px' }}>{title}</span>
            {subtitle && (
              <span style={{ color: themeColor, fontSize: '10px', padding: '2px 8px', background: `${themeColor}20`, borderRadius: '4px' }}>
                {subtitle}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {mode === 'single' && (
              <span style={{ color: '#6b7280', fontSize: '11px' }}>
                敌人 {currentEnemyIndex + 1}/{enemies.length}
              </span>
            )}
            {mode === 'endless' && endlessConfig && (
              <div style={{ textAlign: 'center', minWidth: '60px' }}>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>关卡</div>
                <div style={{ color: endlessConfig.isBoss ? '#ef4444' : THEME.primary, fontSize: '20px', fontWeight: 'bold', textShadow: `0 0 10px ${endlessConfig.isBoss ? 'rgba(239, 68, 68, 0.6)' : THEME.glow}` }}>
                  {endlessConfig.isBoss ? `BOSS ${endlessConfig.stageLevel}` : endlessConfig.stageLevel}
                </div>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
            {mode === 'endless' && endlessConfig && (
              <button onClick={handleChallengeBoss} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ef4444', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(239, 68, 68, 0.1) 100%)', border: '1px solid rgba(239, 68, 68, 0.5)', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                <span>💀</span>
                <span>挑战Boss</span>
              </button>
            )}
          </div>
        </header>

        <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 10 }}>
          {floatingRewards.map((reward) => (
            <div key={reward.id} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fbbf24', fontSize: '24px', fontWeight: 'bold', textShadow: '0 0 20px rgba(251, 191, 36, 0.8)', animation: 'floatUp 2s ease-out forwards', zIndex: 100, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div>+{reward.credits} 信用点</div>
              <div style={{ color: '#22c55e', fontSize: '20px' }}>+{reward.exp} 经验</div>
              {reward.materials.map((mat, i) => (
                <div key={i} style={{ color: '#60a5fa', fontSize: '18px' }}>
                  +{mat.name} x{mat.count}
                </div>
              ))}
            </div>
          ))}

          {phase === 'fighting' && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
                <div style={{ backgroundColor: 'rgba(20, 20, 30, 0.5)', borderRadius: '12px', padding: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f87171', fontSize: '13px', fontWeight: 'bold' }}>
                      <span>👹</span>
                      <span>敌方</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#9ca3af' }}>存活:{enemyAliveCount}</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {enemyCards.length > 0 ? enemyCards : (
                      <div style={{ gridColumn: 'span 3', textAlign: 'center', color: '#6b7280', fontSize: '12px', padding: '20px' }}>全部消灭</div>
                    )}
                  </div>
                </div>

                <div style={{ backgroundColor: 'rgba(20, 20, 30, 0.5)', borderRadius: '12px', padding: '12px', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#60a5fa', fontSize: '13px', fontWeight: 'bold' }}>
                      <span>⚔️</span>
                      <span>我方</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#9ca3af' }}>存活:{playerAliveCount}</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '8px' }}>
                    {playerFrontRow}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {playerBackRow}
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(20, 20, 30, 0.5)', borderRadius: '12px', padding: '12px', border: '1px solid rgba(100, 100, 100, 0.2)', margin: '0 16px 16px', flex: 1, minHeight: '120px' }}>
                <div style={{ display: 'flex', gap: '12px', height: '100%' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', overflowY: 'auto', borderRight: '1px solid rgba(100, 100, 100, 0.2)', paddingRight: '8px' }}>
                    <div style={{ color: '#9ca3af', fontSize: '10px', marginBottom: '4px', fontWeight: 'bold' }}>攻击</div>
                    {battleLog.filter(log => log.type === 'normal').map((log) => (
                      <div key={log.id} style={{ color: log.isPlayerAttack === true ? '#60a5fa' : log.isPlayerAttack === false ? '#f87171' : '#9ca3af', lineHeight: '1.3' }}>
                        {log.text}
                      </div>
                    ))}
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', overflowY: 'auto' }}>
                    <div style={{ color: '#a855f7', fontSize: '10px', marginBottom: '4px', fontWeight: 'bold' }}>技能释放</div>
                    {battleLog.filter(log => log.type === 'skill').map((log) => (
                      <div key={log.id} style={{ color: '#a855f7', lineHeight: '1.3' }}>
                        {log.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {phase === 'victory' && mode === 'single' && (
            <div style={{ backgroundColor: 'rgba(6, 95, 70, 0.3)', borderRadius: '12px', padding: '16px', margin: 'auto 16px 16px', textAlign: 'center', border: '1px solid rgba(74, 222, 128, 0.3)' }}>
              <div style={{ color: '#4ade80', fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
                战斗胜利！获得 {gainedExp} 经验
              </div>
              <button onClick={() => onBattleEnd?.(true, gainedExp)} style={{ padding: '12px 32px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                确认
              </button>
            </div>
          )}

          {phase === 'defeat' && mode === 'single' && (
            <div style={{ backgroundColor: 'rgba(127, 29, 29, 0.3)', borderRadius: '12px', padding: '16px', margin: 'auto 16px 16px', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <div style={{ color: '#ef4444', fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
                战斗失败...
              </div>
              <button onClick={() => onBattleEnd?.(false, 0)} style={{ padding: '12px 32px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                确认
              </button>
            </div>
          )}

          {phase === 'defeat' && mode === 'endless' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderRadius: '20px', padding: '24px', border: '2px solid rgba(239, 68, 68, 0.5)', textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>💀</div>
                <div style={{ color: '#ef4444', fontSize: '24px', fontWeight: 'bold', textShadow: '0 0 20px rgba(239, 68, 68, 0.5)' }}>
                  战斗失败
                </div>
                {endlessConfig && (
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '8px' }}>
                    当前关卡: {endlessConfig.stageLevel}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                <button onClick={handleRestart} style={{ flex: 1, padding: '16px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0.1) 100%)', border: '1px solid rgba(16, 185, 129, 0.5)', borderRadius: '12px', color: '#10b981', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                  重新开始
                </button>
                <button onClick={handleBack} style={{ flex: 1, padding: '16px', background: 'rgba(50, 50, 50, 0.3)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '12px', color: 'rgba(255,255,255,0.7)', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
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
