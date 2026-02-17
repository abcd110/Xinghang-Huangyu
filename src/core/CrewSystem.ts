export enum CrewRarity {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

export enum CrewRole {
  WARRIOR = 'warrior',
  ENGINEER = 'engineer',
  MEDIC = 'medic',
  SCOUT = 'scout',
  TECHNICIAN = 'technician',
}

export enum RecruitType {
  NORMAL = 'normal',
  LIMITED = 'limited',
}

export interface CrewStats {
  attack: number;
  defense: number;
  hp: number;
  speed: number;
  critRate: number;
  critDamage: number;
}

export interface CrewSkill {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  effect: string;
}

export interface CrewDefinition {
  id: string;
  name: string;
  rarity: CrewRarity;
  role: CrewRole;
  description: string;
  portrait: string;
  skills: Omit<CrewSkill, 'id'>[];
  baseStats: CrewStats;
  limitedPool?: boolean;
}

export interface CrewMember {
  id: string;
  crewDefId: string;
  name: string;
  rarity: CrewRarity;
  role: CrewRole;
  level: number;
  exp: number;
  expToNext: number;
  stats: CrewStats;
  skills: CrewSkill[];
  battleSlot: number;
  portrait: string;
}

export interface CrewMemberData {
  id: string;
  crewDefId: string;
  name: string;
  rarity: CrewRarity;
  role: CrewRole;
  level: number;
  exp: number;
  stats: CrewStats;
  skills: CrewSkill[];
  battleSlot: number;
  portrait: string;
}

export const RARITY_CONFIG: Record<CrewRarity, { name: string; color: string; statMultiplier: number }> = {
  [CrewRarity.COMMON]: { name: '普通', color: '#9ca3af', statMultiplier: 1.0 },
  [CrewRarity.RARE]: { name: '稀有', color: '#3b82f6', statMultiplier: 1.3 },
  [CrewRarity.EPIC]: { name: '史诗', color: '#a855f7', statMultiplier: 1.6 },
  [CrewRarity.LEGENDARY]: { name: '传说', color: '#f59e0b', statMultiplier: 2.0 },
};

export const ROLE_CONFIG: Record<CrewRole, { name: string; icon: string; description: string }> = {
  [CrewRole.WARRIOR]: { name: '战士', icon: '⚔️', description: '高攻击高防御，前排肉盾' },
  [CrewRole.ENGINEER]: { name: '工程师', icon: '🔧', description: '提升采集效率，辅助角色' },
  [CrewRole.MEDIC]: { name: '医疗兵', icon: '💊', description: '治疗队友，提供续航' },
  [CrewRole.SCOUT]: { name: '侦察兵', icon: '🎯', description: '高暴击高速度，输出核心' },
  [CrewRole.TECHNICIAN]: { name: '技术员', icon: '⚡', description: '提升装备效率，多功能辅助' },
};

export const RECRUIT_CONFIG: Record<RecruitType, {
  name: string;
  ticketId: string;
  rarityRates: Record<CrewRarity, number>;
  guaranteeRarity: CrewRarity | null;
  guaranteeCount: number;
}> = {
  [RecruitType.NORMAL]: {
    name: '普通招募',
    ticketId: 'recruit_ticket_normal',
    rarityRates: {
      [CrewRarity.COMMON]: 70,
      [CrewRarity.RARE]: 22,
      [CrewRarity.EPIC]: 7,
      [CrewRarity.LEGENDARY]: 1,
    },
    guaranteeRarity: CrewRarity.RARE,
    guaranteeCount: 10,
  },
  [RecruitType.LIMITED]: {
    name: '限定招募',
    ticketId: 'recruit_ticket_limited',
    rarityRates: {
      [CrewRarity.COMMON]: 50,
      [CrewRarity.RARE]: 35,
      [CrewRarity.EPIC]: 12,
      [CrewRarity.LEGENDARY]: 3,
    },
    guaranteeRarity: CrewRarity.EPIC,
    guaranteeCount: 20,
  },
};

export const CREW_DEFINITIONS: CrewDefinition[] = [
];

let crewIdCounter = 0;

function generateCrewId(): string {
  crewIdCounter++;
  return `crew_${Date.now()}_${crewIdCounter}`;
}

export function getRarityByRoll(roll: number, recruitType: RecruitType): CrewRarity {
  const config = RECRUIT_CONFIG[recruitType];
  let cumulative = 0;
  
  const rarities = [CrewRarity.COMMON, CrewRarity.RARE, CrewRarity.EPIC, CrewRarity.LEGENDARY];
  for (const rarity of rarities) {
    cumulative += config.rarityRates[rarity];
    if (roll < cumulative) {
      return rarity;
    }
  }
  
  return CrewRarity.COMMON;
}

export function getCrewDefinitionsByRarity(rarity: CrewRarity, limitedPool: boolean = false): CrewDefinition[] {
  return CREW_DEFINITIONS.filter(def => {
    if (def.rarity !== rarity) return false;
    if (limitedPool) return def.limitedPool === true;
    return true;
  });
}

export function getRandomCrewDefinition(rarity: CrewRarity, recruitType: RecruitType): CrewDefinition | null {
  const limitedPool = recruitType === RecruitType.LIMITED;
  const candidates = getCrewDefinitionsByRarity(rarity, limitedPool);
  
  if (candidates.length === 0) {
    return null;
  }
  
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function calculateExpToNextLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function generateCrewFromDefinition(def: CrewDefinition): CrewMember {
  const rarityConfig = RARITY_CONFIG[def.rarity];
  const statMultiplier = rarityConfig.statMultiplier;
  
  const stats: CrewStats = {
    attack: Math.floor(def.baseStats.attack * statMultiplier),
    defense: Math.floor(def.baseStats.defense * statMultiplier),
    hp: Math.floor(def.baseStats.hp * statMultiplier),
    speed: Math.floor(def.baseStats.speed * statMultiplier),
    critRate: Math.floor(def.baseStats.critRate * statMultiplier),
    critDamage: Math.floor(def.baseStats.critDamage * statMultiplier),
  };
  
  const skills: CrewSkill[] = def.skills.map(skill => ({
    ...skill,
    id: `skill_${generateCrewId()}`,
  }));
  
  return {
    id: generateCrewId(),
    crewDefId: def.id,
    name: def.name,
    rarity: def.rarity,
    role: def.role,
    level: 1,
    exp: 0,
    expToNext: calculateExpToNextLevel(1),
    stats,
    skills,
    battleSlot: 0,
    portrait: def.portrait,
  };
}

export function generateFallbackCrew(rarity: CrewRarity): CrewMember {
  const roles = Object.values(CrewRole);
  const role = roles[Math.floor(Math.random() * roles.length)];
  const rarityConfig = RARITY_CONFIG[rarity];

  const baseStats: CrewStats = {
    attack: 20,
    defense: 15,
    hp: 100,
    speed: 10,
    critRate: 10,
    critDamage: 150,
  };
  
  const statMultiplier = rarityConfig.statMultiplier;
  const stats: CrewStats = {
    attack: Math.floor(baseStats.attack * statMultiplier),
    defense: Math.floor(baseStats.defense * statMultiplier),
    hp: Math.floor(baseStats.hp * statMultiplier),
    speed: Math.floor(baseStats.speed * statMultiplier),
    critRate: Math.floor(baseStats.critRate * statMultiplier),
    critDamage: Math.floor(baseStats.critDamage * statMultiplier),
  };
  
  const skills: CrewSkill[] = [];

  const names = ['阿列克谢', '伊万', '娜塔莎', '维克多', '安娜', '德米特里', '叶卡捷琳娜', '谢尔盖'];
  const name = names[Math.floor(Math.random() * names.length)];
  
  return {
    id: generateCrewId(),
    crewDefId: 'fallback',
    name,
    rarity,
    role,
    level: 1,
    exp: 0,
    expToNext: calculateExpToNextLevel(1),
    stats,
    skills,
    battleSlot: 0,
    portrait: '👤',
  };
}

export function createPlayerCrew(playerName: string, playerLevel: number): CrewMember {
  const baseAttack = 25 + playerLevel * 5;
  const baseDefense = 20 + playerLevel * 3;
  const baseHp = 150 + playerLevel * 20;
  
  const stats: CrewStats = {
    attack: baseAttack,
    defense: baseDefense,
    hp: baseHp,
    speed: 12,
    critRate: 15,
    critDamage: 160,
  };
  
  return {
    id: 'player',
    crewDefId: 'player',
    name: playerName,
    rarity: CrewRarity.LEGENDARY,
    role: CrewRole.WARRIOR,
    level: playerLevel,
    exp: 0,
    expToNext: calculateExpToNextLevel(playerLevel),
    stats,
    skills: [
      {
        id: 'player_skill_1',
        name: '领袖气质',
        description: '作为列车长，提升全队士气',
        cooldown: 0,
        effect: '全队攻击+10%',
      },
    ],
    battleSlot: 1,
    portrait: '🧑‍✈️',
  };
}

export function isPlayerCrew(crewId: string): boolean {
  return crewId === 'player';
}

export function serializeCrewMember(crew: CrewMember): CrewMemberData {
  return {
    id: crew.id,
    crewDefId: crew.crewDefId,
    name: crew.name,
    rarity: crew.rarity,
    role: crew.role,
    level: crew.level,
    exp: crew.exp,
    stats: crew.stats,
    skills: crew.skills,
    battleSlot: crew.battleSlot,
    portrait: crew.portrait,
  };
}

export function deserializeCrewMember(data: CrewMemberData): CrewMember {
  return {
    ...data,
    expToNext: calculateExpToNextLevel(data.level),
  };
}

export function addCrewExp(crew: CrewMember, exp: number): { leveledUp: boolean; newLevel: number } {
  crew.exp += exp;
  let leveledUp = false;
  let newLevel = crew.level;
  
  while (crew.exp >= crew.expToNext) {
    crew.exp -= crew.expToNext;
    crew.level++;
    crew.expToNext = calculateExpToNextLevel(crew.level);
    leveledUp = true;
    newLevel = crew.level;
    
    const rarityConfig = RARITY_CONFIG[crew.rarity];
    const statMultiplier = rarityConfig.statMultiplier * (1 + (crew.level - 1) * 0.05);
    
    const baseStats: CrewStats = {
      attack: 20,
      defense: 15,
      hp: 100,
      speed: 10,
      critRate: 10,
      critDamage: 150,
    };
    
    crew.stats = {
      attack: Math.floor(baseStats.attack * statMultiplier),
      defense: Math.floor(baseStats.defense * statMultiplier),
      hp: Math.floor(baseStats.hp * statMultiplier),
      speed: Math.floor(baseStats.speed * statMultiplier),
      critRate: Math.floor(baseStats.critRate * statMultiplier),
      critDamage: Math.floor(baseStats.critDamage * statMultiplier),
    };
  }
  
  return { leveledUp, newLevel };
}
