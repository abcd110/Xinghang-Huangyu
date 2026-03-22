import { useRef, useCallback, useEffect } from 'react';
import type { BattleUnit, PlayerStats } from '../types';
import { useGameStore } from '../../../stores/gameStore';
import { battleSkillManager, SkillEffectResult } from '../../BattleSkillSystem';
import {
  updateSummonedUnits,
  processSummonAttacks,
  createSummonedUnit,
  enhanceSummons,
} from '../../SummonManager';
import {
  updateStatusEffects,
  applyStatusEffect,
  calculateStatusEffectBonuses,
  calculateBurnDamage,
  hasEffect,
  createStatusEffect,
} from '../../StatusEffectManager';
import type { SummonedUnit, StatusEffect } from '../../StatusEffectManager';

interface UseBattleTimersParams {
  phase: 'fighting' | 'victory' | 'defeat';
  playerTeam: BattleUnit[];
  enemyTeam: BattleUnit[];
  setPlayerTeam: React.Dispatch<React.SetStateAction<BattleUnit[]>>;
  setEnemyTeam: React.Dispatch<React.SetStateAction<BattleUnit[]>>;
  summonedUnits: SummonedUnit[];
  setSummonedUnits: React.Dispatch<React.SetStateAction<SummonedUnit[]>>;
  statusEffects: StatusEffect[];
  setStatusEffects: React.Dispatch<React.SetStateAction<StatusEffect[]>>;
  playerStatsRef: React.MutableRefObject<PlayerStats>;
  onEnemyDefeated: () => void;
  onPlayerDefeated: () => void;
  addLog: (message: string, type?: 'normal' | 'skill', isPlayerAttack?: boolean) => void;
  showSkillName: (unitId: string, skillName: string) => void;
  timersStartedRef: React.MutableRefObject<boolean>;
}

export function useBattleTimers({
  phase,
  playerTeam,
  enemyTeam,
  setPlayerTeam,
  setEnemyTeam,
  summonedUnits,
  setSummonedUnits,
  statusEffects,
  setStatusEffects,
  playerStatsRef,
  onEnemyDefeated,
  onPlayerDefeated,
  addLog,
  showSkillName,
  timersStartedRef,
}: UseBattleTimersParams) {
  const gameManager = useGameStore(state => state.gameManager);
  const player = useGameStore(state => state.getPlayer());

  const playerAttackTimer = useRef<number | null>(null);
  const enemyAttackTimer = useRef<number | null>(null);
  const geneCooldownTimer = useRef<number | null>(null);
  const summonUpdateTimer = useRef<number | null>(null);
  const statusEffectTimer = useRef<number | null>(null);

  const playerTeamRef = useRef<BattleUnit[]>(playerTeam);
  const enemyTeamRef = useRef<BattleUnit[]>(enemyTeam);
  const statusEffectsRef = useRef<StatusEffect[]>(statusEffects);
  const playerRef = useRef(player);
  const phaseRef = useRef(phase);

  useEffect(() => {
    playerTeamRef.current = playerTeam;
  }, [playerTeam]);

  useEffect(() => {
    enemyTeamRef.current = enemyTeam;
  }, [enemyTeam]);

  useEffect(() => {
    statusEffectsRef.current = statusEffects;
  }, [statusEffects]);

  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

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

  const applySkillEffect = useCallback((result: SkillEffectResult, attacker: BattleUnit) => {
    if (result.statusEffects && result.statusEffects.length > 0) {
      setStatusEffects(prev => {
        let updated = [...prev];
        result.statusEffects!.forEach(effect => {
          updated = applyStatusEffect(updated, effect);
        });
        return updated;
      });
    }

    switch (result.type) {
      case 'damage':
        result.targetIndices.forEach(targetIndex => {
          setEnemyTeam(prev => {
            const target = prev[targetIndex];
            if (target && target.isAlive) {
              let damage = result.value;

              const bonuses = calculateStatusEffectBonuses(
                statusEffectsRef.current,
                `enemy_${targetIndex}`,
                target.defense,
                target.attack,
                target.critDamage,
                0,
                0
              );

              if (bonuses.defense < target.defense) {
                const defenseReduction = 1 - (bonuses.defense / target.defense);
                damage = Math.floor(damage * (1 + defenseReduction * 0.5));
              }

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
        result.targetIndices.forEach(targetIndex => {
          setPlayerTeam(prev => {
            const target = prev[targetIndex];
            if (target && target.isAlive) {
              let heal = result.value;

              const bonuses = calculateStatusEffectBonuses(
                statusEffectsRef.current,
                `player_${targetIndex}`,
                target.defense,
                target.attack,
                target.critDamage,
                0,
                0
              );

              if (bonuses.healEffectiveness > 0) {
                heal = Math.floor(heal * (1 + bonuses.healEffectiveness / 100));
              }

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
        result.targetIndices.forEach(targetIndex => {
          setPlayerTeam(prev => {
            const target = prev[targetIndex];
            if (target && target.isAlive) {
              let newShield = (target.shield || 0) + result.value;

              if (result.shieldCapPercent) {
                const maxShield = Math.floor(target.defense * (result.shieldCapPercent / 100));
                newShield = Math.min(newShield, maxShield);
              } else {
                const defaultMaxShield = Math.floor(target.maxHp * 0.5);
                newShield = Math.min(newShield, defaultMaxShield);
              }

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
  }, [addLog, onEnemyDefeated, setEnemyTeam, setPlayerTeam, setSummonedUnits, setStatusEffects]);

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
            applySkillEffect(ultimateResult, attacker);
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
          applySkillEffect(skillResult, attacker);
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
          applySkillEffect(basicResult, attacker);
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
        const targetIsAlive = targetNewHp > 0;

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
              return { ...u, hp: targetNewHp, isAlive: targetIsAlive };
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
  }, [addLog, applySkillEffect, getAttackOrder, onEnemyDefeated, playerStatsRef, setEnemyTeam, setPlayerTeam, showSkillName]);

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
        addLog(`${target.name} 闪避了 ${attacker.name} 的攻击！`, 'skill');
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
              const newShield = Math.max(0, (u.shield || 0) - finalShieldAbsorbed);
              return {
                ...u,
                hp: newHp,
                shield: newShield,
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
  }, [addLog, gameManager, getAttackOrder, onPlayerDefeated, setPlayerTeam]);

  const startTimers = useCallback(() => {
    if (timersStartedRef.current) return;

    timersStartedRef.current = true;
    gameManager.resetAllGeneCooldowns();

    const playerSpeed = playerStatsRef.current.attackSpeed || 1;
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

        const attackResults: { summonName: string; ownerName: string; targetName: string; damage: number; armorBreakApplied: boolean }[] = [];
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
          (result) => {
            attackResults.push(result);
          },
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

        attackResults.forEach(result => {
          const logParts = [`${result.summonName}(${result.ownerName}) 对 ${result.targetName} 造成 ${result.damage} 伤害`];
          if (result.armorBreakApplied) {
            logParts.push('并施加破甲');
          }
          addLog(logParts.join(' '), 'normal', true);
        });

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
                    addLog(`【灼烧】${target.name} 受到 ${damage} 点灼烧伤害 (层数:${effect.currentStacks})`, 'skill');

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
                    addLog(`【灼烧】${target.name} 受到 ${damage} 点灼烧伤害 (层数:${effect.currentStacks})`, 'skill');

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
  }, [addLog, doEnemyAttack, doPlayerAttack, gameManager, onEnemyDefeated, onPlayerDefeated, playerStatsRef, setEnemyTeam, setPlayerTeam, setStatusEffects, setSummonedUnits, timersStartedRef]);

  useEffect(() => {
    return () => {
      clearAllTimers();
      timersStartedRef.current = false;
    };
  }, [clearAllTimers, timersStartedRef]);

  return {
    startTimers,
    clearAllTimers,
  };
}
