import { SummonDefinition, getSummonDefinition } from '../data/summonDefinitions';

export interface SummonedUnit {
  id: string;
  summonId: string;
  name: string;
  ownerId: string;
  ownerName: string;
  ownerAttack: number;
  hp?: number;
  maxHp?: number;
  duration: number;
  remainingTime: number;
  attackInterval: number;
  attackTimer: number;
  damagePercent: number;
  targetType: 'single' | 'all' | 'random';
  effects?: {
    armorBreak?: {
      chance: number;
      duration: number;
      value: number;
    };
  };
  enhanced?: boolean;
  enhancedDuration?: number;
  icon: string;
  isAlive: boolean;
}

export interface SummonAttackResult {
  summonId: string;
  summonName: string;
  ownerId: string;
  ownerName: string;
  damage: number;
  targetIndex: number;
  targetName: string;
  isCrit?: boolean;
  armorBreakApplied?: boolean;
}

let summonIdCounter = 0;

export function generateSummonId(): string {
  return `summon_${Date.now()}_${++summonIdCounter}`;
}

export function createSummonedUnit(
  summonDefId: string,
  ownerId: string,
  ownerName: string,
  ownerAttack: number,
  skillLevel: number,
  count: number = 1
): SummonedUnit[] {
  const definition = getSummonDefinition(summonDefId);
  if (!definition) {
    console.warn(`[召唤系统] 未找到召唤物定义: ${summonDefId}`);
    return [];
  }

  const units: SummonedUnit[] = [];
  
  for (let i = 0; i < count; i++) {
    const damagePercent = definition.baseDamagePercent + (skillLevel - 1) * 5;
    
    const unit: SummonedUnit = {
      id: generateSummonId(),
      summonId: definition.id,
      name: definition.name,
      ownerId,
      ownerName,
      ownerAttack,
      hp: definition.hasHp ? definition.baseHp : undefined,
      maxHp: definition.hasHp ? definition.baseHp : undefined,
      duration: definition.baseDuration,
      remainingTime: definition.baseDuration,
      attackInterval: definition.baseAttackInterval,
      attackTimer: 0,
      damagePercent,
      targetType: definition.targetType,
      effects: definition.effects ? { ...definition.effects } : undefined,
      icon: definition.icon,
      isAlive: true,
    };
    
    units.push(unit);
  }
  
  return units;
}

export function updateSummonedUnits(
  summons: SummonedUnit[],
  deltaTime: number
): { updatedSummons: SummonedUnit[]; expiredIds: string[] } {
  const expiredIds: string[] = [];
  
  const updatedSummons = summons.map(summon => {
    if (!summon.isAlive) return summon;
    
    let newRemainingTime = summon.remainingTime - deltaTime;
    let newEnhancedDuration = summon.enhancedDuration;
    let newEnhanced = summon.enhanced;
    
    if (summon.enhanced && summon.enhancedDuration !== undefined) {
      newEnhancedDuration = summon.enhancedDuration - deltaTime;
      if (newEnhancedDuration <= 0) {
        newEnhanced = false;
        newEnhancedDuration = 0;
      }
    }
    
    if (newRemainingTime <= 0) {
      expiredIds.push(summon.id);
      return {
        ...summon,
        remainingTime: 0,
        isAlive: false,
        enhanced: newEnhanced,
        enhancedDuration: newEnhancedDuration,
      };
    }
    
    return {
      ...summon,
      remainingTime: newRemainingTime,
      enhanced: newEnhanced,
      enhancedDuration: newEnhancedDuration,
    };
  });
  
  return { updatedSummons, expiredIds };
}

export function processSummonAttacks(
  summons: SummonedUnit[],
  deltaTime: number,
  enemyTeam: { id: string; name: string; hp: number; maxHp: number; defense: number; isAlive: boolean; index: number }[],
  onAttack: (result: SummonAttackResult) => void,
  onDamage: (targetIndex: number, damage: number) => void
): SummonedUnit[] {
  return summons.map(summon => {
    if (!summon.isAlive) return summon;
    
    const effectiveInterval = summon.enhanced ? summon.attackInterval / 2 : summon.attackInterval;
    let newAttackTimer = summon.attackTimer + deltaTime;
    
    while (newAttackTimer >= effectiveInterval) {
      newAttackTimer -= effectiveInterval;
      
      const aliveEnemies = enemyTeam.filter(e => e.isAlive);
      if (aliveEnemies.length === 0) break;
      
      let target;
      switch (summon.targetType) {
        case 'single':
          target = aliveEnemies[0];
          break;
        case 'random':
          target = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
          break;
        case 'all':
          target = aliveEnemies[0];
          break;
        default:
          target = aliveEnemies[0];
      }
      
      if (target) {
        const baseDamage = Math.floor(summon.ownerAttack * (summon.damagePercent / 100));
        const defense = target.defense || 0;
        const damageReduction = (defense / (defense + 600)) * 100;
        const finalDamage = Math.max(1, Math.floor(baseDamage * (1 - damageReduction / 100)));
        
        onDamage(target.index, finalDamage);
        
        let armorBreakApplied = false;
        if (summon.effects?.armorBreak) {
          if (Math.random() * 100 < summon.effects.armorBreak.chance) {
            armorBreakApplied = true;
          }
        }
        
        const result: SummonAttackResult = {
          summonId: summon.id,
          summonName: summon.name,
          ownerId: summon.ownerId,
          ownerName: summon.ownerName,
          damage: finalDamage,
          targetIndex: target.index,
          targetName: target.name,
          armorBreakApplied,
        };
        
        onAttack(result);
      }
    }
    
    return {
      ...summon,
      attackTimer: newAttackTimer,
    };
  });
}

export function enhanceSummons(
  summons: SummonedUnit[],
  ownerId: string,
  duration: number
): SummonedUnit[] {
  return summons.map(summon => {
    if (summon.ownerId === ownerId && summon.isAlive) {
      return {
        ...summon,
        enhanced: true,
        enhancedDuration: duration,
      };
    }
    return summon;
  });
}

export function getOwnerSummons(summons: SummonedUnit[], ownerId: string): SummonedUnit[] {
  return summons.filter(s => s.ownerId === ownerId && s.isAlive);
}

export function getAliveSummons(summons: SummonedUnit[]): SummonedUnit[] {
  return summons.filter(s => s.isAlive);
}

export function getSummonsByType(summons: SummonedUnit[], summonId: string): SummonedUnit[] {
  return summons.filter(s => s.summonId === summonId && s.isAlive);
}
