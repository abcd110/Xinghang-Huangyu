/**
 * 船员技能定义 - 统一入口
 *
 * 技能文件分为3个：
 * - crewSkillsB.ts: B级角色技能（9个角色）
 * - crewSkillsA.ts: A级角色技能（10个角色）
 * - crewSkillsS.ts: S级角色技能（10个角色）
 */

import {
  SkillSet,
  SkillType,
  SkillEffectType,
  TargetType,
  DamageType,
  TriggerTiming,
} from '../screens/crewScreen/types/skillTypes';

// 导入B级角色技能
import {
  CREW_B001,
  CREW_B002,
  CREW_B003,
  CREW_B004,
  CREW_B005,
  CREW_B006,
  CREW_B007,
  CREW_B008,
  CREW_B009,
  getBCrewSkills,
} from './crewSkillsB';

// 导入A级角色技能
import {
  CREW_A001,
  CREW_A002,
  CREW_A003,
  CREW_A004,
  CREW_A005,
  CREW_A006,
  CREW_A007,
  CREW_A008,
  CREW_A009,
  CREW_A010,
  getACrewSkills,
} from './crewSkillsA';

// 导入S级角色技能
import {
  CREW_S001,
  CREW_S002,
  CREW_S003,
  CREW_S004,
  CREW_S005,
  CREW_S006,
  CREW_S007,
  CREW_S008,
  CREW_S009,
  CREW_S010,
  getSCrewSkills,
} from './crewSkillsS';

// ==================== 重新导出B级角色技能 ====================
export {
  CREW_B001,
  CREW_B002,
  CREW_B003,
  CREW_B004,
  CREW_B005,
  CREW_B006,
  CREW_B007,
  CREW_B008,
  CREW_B009,
  getBCrewSkills,
};

// ==================== 重新导出A级角色技能 ====================
export {
  CREW_A001,
  CREW_A002,
  CREW_A003,
  CREW_A004,
  CREW_A005,
  CREW_A006,
  CREW_A007,
  CREW_A008,
  CREW_A009,
  CREW_A010,
  getACrewSkills,
};

// ==================== 重新导出S级角色技能 ====================
export {
  CREW_S001,
  CREW_S002,
  CREW_S003,
  CREW_S004,
  CREW_S005,
  CREW_S006,
  CREW_S007,
  CREW_S008,
  CREW_S009,
  CREW_S010,
  getSCrewSkills,
};

// 导出类型
export type { SkillSet } from '../screens/crewScreen/types/skillTypes';

// ==================== B级角色技能映射 ====================
export const B_CREW_SKILLS: Record<string, SkillSet> = {
  'crew_b_001': CREW_B001,
  'crew_b_002': CREW_B002,
  'crew_b_003': CREW_B003,
  'crew_b_004': CREW_B004,
  'crew_b_005': CREW_B005,
  'crew_b_006': CREW_B006,
  'crew_b_007': CREW_B007,
  'crew_b_008': CREW_B008,
  'crew_b_009': CREW_B009,
};

// ==================== A级角色技能映射 ====================
export const A_CREW_SKILLS: Record<string, SkillSet> = {
  'crew_a_001': CREW_A001,
  'crew_a_002': CREW_A002,
  'crew_a_003': CREW_A003,
  'crew_a_004': CREW_A004,
  'crew_a_005': CREW_A005,
  'crew_a_006': CREW_A006,
  'crew_a_007': CREW_A007,
  'crew_a_008': CREW_A008,
  'crew_a_009': CREW_A009,
  'crew_a_010': CREW_A010,
};

// ==================== S级角色技能映射 ====================
export const S_CREW_SKILLS: Record<string, SkillSet> = {
  'crew_s_001': CREW_S001,
  'crew_s_002': CREW_S002,
  'crew_s_003': CREW_S003,
  'crew_s_004': CREW_S004,
  'crew_s_005': CREW_S005,
  'crew_s_006': CREW_S006,
  'crew_s_007': CREW_S007,
  'crew_s_008': CREW_S008,
  'crew_s_009': CREW_S009,
  'crew_s_010': CREW_S010,
};

// ==================== 所有角色技能映射 ====================
export const ALL_CREW_SKILLS: Record<string, SkillSet> = {
  // B级（9个）
  ...B_CREW_SKILLS,
  // A级（10个）
  ...A_CREW_SKILLS,
  // S级（10个）
  ...S_CREW_SKILLS,
};

// ==================== 通用获取技能函数 ====================

/**
 * 根据船员ID获取技能
 * @param crewId 船员ID（如 'crew_b_001', 'crew_a_001', 'crew_s_001'）
 * @returns 技能集合或undefined
 */
export function getCrewSkills(crewId: string): SkillSet | undefined {
  if (crewId.startsWith('crew_b_')) {
    return getBCrewSkills(crewId);
  }
  if (crewId.startsWith('crew_a_')) {
    return getACrewSkills(crewId);
  }
  if (crewId.startsWith('crew_s_')) {
    return getSCrewSkills(crewId);
  }
  return undefined;
}

// ==================== 辅助函数 ====================

/**
 * 获取所有技能ID列表
 * @returns 技能ID数组
 */
export function getAllCrewSkillIds(): string[] {
  return Object.keys(ALL_CREW_SKILLS);
}

/**
 * 根据稀有度获取技能
 * @param rarity 稀有度（B, A, S）
 * @returns 该稀有度的所有技能
 */
export function getSkillsByRarity(rarity: 'B' | 'A' | 'S'): Record<string, SkillSet> {
  switch (rarity) {
    case 'B':
      return B_CREW_SKILLS;
    case 'A':
      return A_CREW_SKILLS;
    case 'S':
      return S_CREW_SKILLS;
    default:
      return {};
  }
}

/**
 * 检查船员是否有技能
 * @param crewId 船员ID
 * @returns 是否有技能
 */
export function hasCrewSkills(crewId: string): boolean {
  return crewId in ALL_CREW_SKILLS;
}

// 导出类型
export { SkillType, SkillEffectType, TargetType, DamageType, TriggerTiming };
