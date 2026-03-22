export type BattleMode = 'single' | 'endless';

export interface BattleEnemy {
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
  isBoss?: boolean;
  isElite?: boolean;
  icon?: string;
  rewards?: {
    exp: number;
  };
}

export interface BattleUnit {
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
  guard?: number;
  icon?: string;
  isPlayer: boolean;
  isAlive: boolean;
  shield?: number;
  isMainPlayer?: boolean;
  crewId?: string;
  star?: number;
  index: number;
}

export interface EndlessConfig {
  stageLevel: number;
  isBoss: boolean;
  onVictory: () => { credits: number; exp: number; materials: { itemId: string; count: number }[] };
  onDefeat: () => void;
  onChallengeBoss: () => void;
  onRestart: () => void;
  onBack: () => void;
  onVictoryComplete?: () => void;
  onBossDefeat?: () => void;
}

export interface BattleScreenProps {
  mode: BattleMode;
  enemies: BattleEnemy[];
  title?: string;
  subtitle?: string;
  themeColor?: string;
  onBattleEnd?: (victory: boolean, totalExp: number) => void;
  endlessConfig?: EndlessConfig;
}

export type BattlePhase = 'fighting' | 'victory' | 'defeat';

export interface BattleLogEntry {
  id: string;
  text: string;
  type: 'normal' | 'skill';
  isPlayerAttack?: boolean;
}

export interface FloatingReward {
  credits: number;
  exp: number;
  materials: { name: string; count: number }[];
  id: number;
}

export interface FloatingSkillName {
  id: string;
  unitId: string;
  skillName: string;
  createdAt: number;
}

export interface PlayerStats {
  attackSpeed: number;
  totalCrit: number;
  totalCritDamage: number;
  totalHit: number;
  totalDodge: number;
  totalPenetration: number;
  totalPenetrationPercent: number;
  totalLifeSteal: number;
  overflowToShield: boolean;
}
