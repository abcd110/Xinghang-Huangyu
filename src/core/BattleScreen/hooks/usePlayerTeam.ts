import { useState, useRef, useCallback, useEffect } from 'react';
import { useGameStore } from '../../../stores/gameStore';
import type { BattleUnit, PlayerStats } from '../types';

export function usePlayerTeam() {
  const gameManager = useGameStore(state => state.gameManager);
  const player = useGameStore(state => state.getPlayer());

  const playerStatsRef = useRef<PlayerStats>({
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

    const chipCrit = chipBonus['暴击率'] || 0;
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
        isPlayer: true,
        isAlive: false,
        index: i,
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
            index: arrayIndex,
          };
        } else {
          const crewDefId = crew.crewDefId || crew.id;
          const star = crew.star || 1;

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
            icon: crew.portrait,
            isPlayer: true,
            isAlive: true,
            crewId: crewDefId,
            star: star,
            index: arrayIndex,
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
        index: arrayIndex,
      };
    }

    return team;
  }, [calculatePlayerStats, gameManager, player]);

  return {
    playerStatsRef,
    calculatePlayerStats,
    initPlayerTeam,
  };
}
