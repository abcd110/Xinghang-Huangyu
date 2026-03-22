export interface SummonDefinition {
  id: string;
  name: string;
  icon: string;
  hasHp: boolean;
  baseHp?: number;
  baseDuration: number;
  baseAttackInterval: number;
  baseDamagePercent: number;
  targetType: 'single' | 'all' | 'random';
  effects?: {
    armorBreak?: {
      chance: number;
      duration: number;
      value: number;
    };
  };
}

export const DRONE_DEFINITION: SummonDefinition = {
  id: 'drone',
  name: '无人机',
  icon: '🤖',
  hasHp: false,
  baseDuration: 5,
  baseAttackInterval: 2,
  baseDamagePercent: 10,
  targetType: 'single',
  effects: {
    armorBreak: { chance: 60, duration: 5, value: 10 }
  }
};

export const SUMMON_DEFINITIONS: Record<string, SummonDefinition> = {
  drone: DRONE_DEFINITION,
};

export function getSummonDefinition(summonId: string): SummonDefinition | undefined {
  return SUMMON_DEFINITIONS[summonId];
}
