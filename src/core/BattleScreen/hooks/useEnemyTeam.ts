import { useCallback } from 'react';
import type { BattleUnit, BattleEnemy } from '../types';

export function useEnemyTeam() {
  const initEnemyTeam = useCallback((enemyData: BattleEnemy): BattleUnit[] => {
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
        isPlayer: false,
        isAlive: false,
        index: i,
      });
    }

    const bossIndex = 1;
    team[bossIndex] = {
      id: `enemy_${bossIndex}`,
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
      icon: enemyData.icon || (enemyData.isBoss ? '💀' : '敌'),
      isPlayer: false,
      isAlive: enemyData.hp > 0,
      index: bossIndex,
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
        icon: '小',
        isPlayer: false,
        isAlive: true,
        index: minionIndex,
      };
    }

    return team;
  }, []);

  return {
    initEnemyTeam,
  };
}
