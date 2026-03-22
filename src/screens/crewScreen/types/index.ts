import { CrewMember, CrewRarity, CrewRole } from '../../../core/CrewSystem';
import { SkillType, AscendSkillBonus } from './skillTypes';

export type CrewTab = 'detail' | 'levelup' | 'ascend' | 'story' | 'skill';
export type SummonType = 'crew';
export type MainTab = 'gallery' | 'crew' | 'summon' | 'deploy';

export interface CrewLevelConfig {
  maxLevel: number;
  expToNext: number[];
}

export interface CrewAscendConfig {
  star: number;
  essenceRequired: number;
  skillBonuses: AscendSkillBonus[];
  description: string;
}

export interface SummonConfig {
  type: SummonType;
  name: string;
  icon: string;
  color: string;
  probabilities: {
    common: number;
    rare: number;
    epic: number;
    legendary: number;
  };
  pityThreshold: number;
  guaranteedRarity: CrewRarity;
  hiddenPityThreshold?: number;
  hiddenGuaranteedRarity?: CrewRarity;
}

export interface ModuleConfig {
  crew: {
    enabled: boolean;
    tabs: CrewTab[];
    features: {
      portraitFullscreen: boolean;
      batchUpgrade: boolean;
      autoEquip: boolean;
      showStory: boolean;
    };
  };
  summon: {
    enabled: boolean;
    types: SummonType[];
    pitySystem: boolean;
    history: boolean;
  };
}

export const DEFAULT_MODULE_CONFIG: ModuleConfig = {
  crew: {
    enabled: true,
    tabs: ['detail', 'levelup', 'ascend', 'skill'],
    features: {
      portraitFullscreen: true,
      batchUpgrade: false,
      autoEquip: true,
      showStory: true,
    },
  },
  summon: {
    enabled: true,
    types: ['crew'],
    pitySystem: true,
    history: true,
  },
};

export const CREW_ASCEND_CONFIG: CrewAscendConfig[] = [
  {
    star: 1,
    essenceRequired: 0,
    skillBonuses: [],
    description: '初始状态',
  },
  {
    star: 2,
    essenceRequired: 10,
    skillBonuses: [
      {
        star: 2,
        skillType: SkillType.BASIC,
        effects: { skillLevelIncrease: 2 },
        description: '全技能等级+2',
      },
      {
        star: 2,
        skillType: SkillType.SKILL,
        effects: { skillLevelIncrease: 2 },
        description: '',
      },
      {
        star: 2,
        skillType: SkillType.ULTIMATE,
        effects: { skillLevelIncrease: 2 },
        description: '',
      },
      {
        star: 2,
        skillType: SkillType.TALENT,
        effects: { skillLevelIncrease: 2 },
        description: '',
      },
    ],
    description: '全技能等级+2',
  },
  {
    star: 3,
    essenceRequired: 30,
    skillBonuses: [
      {
        star: 3,
        skillType: SkillType.SKILL,
        effects: {
          skillLevelIncrease: 2,
          damageIncrease: 30,
          cooldownReduce: 1,
          unlockFeature: 'skill_enhance_tier1'
        },
        description: '主动技能强化+等级+2（效果待定）',
      },
    ],
    description: '主动技能获得强化，等级+2',
  },
  {
    star: 4,
    essenceRequired: 60,
    skillBonuses: [
      {
        star: 4,
        skillType: SkillType.ULTIMATE,
        effects: {
          skillLevelIncrease: 2,
          damageIncrease: 50,
          energyCostReduce: 20,
          unlockFeature: 'ultimate_enhance_tier1'
        },
        description: '终极技能强化+等级+2（效果待定）',
      },
    ],
    description: '终极技能获得强化，等级+2',
  },
  {
    star: 5,
    essenceRequired: 100,
    skillBonuses: [
      {
        star: 5,
        skillType: SkillType.TALENT,
        effects: {
          skillLevelIncrease: 2,
          triggerChanceIncrease: 25,
          unlockFeature: 'talent_awaken'
        },
        description: '天赋强化+等级+2（效果待定）',
      },
    ],
    description: '天赋获得强化，等级+2',
  },
];

export const SUMMON_CONFIG: Record<SummonType, SummonConfig> = {
  crew: {
    type: 'crew',
    name: '船员招募',
    icon: '👤',
    color: '#3b82f6',
    probabilities: {
      B: 0.90,
      A: 0.099,
      S: 0.001,
    },
    pityThreshold: 60,
    guaranteedRarity: 'S',
    hiddenPityThreshold: 10,
    hiddenGuaranteedRarity: 'A',
  },
};

export interface CrewWithProgress extends CrewMember {
  currentExp: number;
  essence: number;
  maxEssence: number;
}

export interface SummonResult {
  type: 'crew';
  item: CrewMember;
  isDuplicate: boolean;
  convertedEssence?: number;
}
