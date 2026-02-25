import { RuinType, RuinDifficulty, RUIN_DIFFICULTY_CONFIG } from './RuinSystem';
import type { BattleEnemy } from '../data/types';

export interface RuinEnemyTemplate {
  id: string;
  name: string;
  icon: string;
  type: RuinType;
  baseHp: number;
  baseAttack: number;
  baseDefense: number;
  baseSpeed: number;
  baseHit: number;
  baseDodge: number;
  baseCrit: number;
  baseCritDamage: number;
  baseGuard: number;
  isBoss?: boolean;
}

export const RUIN_ENEMY_TEMPLATES: RuinEnemyTemplate[] = [
  // ========== 芯片研发副本敌人 ==========
  {
    id: 'enemy_chip_scrap_bot',
    name: '废弃机器人',
    icon: '🤖',
    type: RuinType.CHIP_MATERIAL,
    baseHp: 80,
    baseAttack: 12,
    baseDefense: 5,
    baseSpeed: 1.0,
    baseHit: 80,
    baseDodge: 5,
    baseCrit: 5,
    baseCritDamage: 50,
    baseGuard: 5,
  },
  {
    id: 'enemy_chip_security',
    name: '安保无人机',
    icon: '🛸',
    type: RuinType.CHIP_MATERIAL,
    baseHp: 60,
    baseAttack: 18,
    baseDefense: 3,
    baseSpeed: 1.5,
    baseHit: 90,
    baseDodge: 15,
    baseCrit: 10,
    baseCritDamage: 60,
    baseGuard: 3,
  },
  {
    id: 'enemy_chip_ai_core',
    name: '失控AI核心',
    icon: '🧠',
    type: RuinType.CHIP_MATERIAL,
    baseHp: 150,
    baseAttack: 25,
    baseDefense: 15,
    baseSpeed: 1.2,
    baseHit: 85,
    baseDodge: 8,
    baseCrit: 15,
    baseCritDamage: 80,
    baseGuard: 10,
    isBoss: true,
  },
  {
    id: 'enemy_chip_quantum_ai',
    name: '量子AI主宰',
    icon: '💠',
    type: RuinType.CHIP_MATERIAL,
    baseHp: 300,
    baseAttack: 45,
    baseDefense: 25,
    baseSpeed: 1.8,
    baseHit: 95,
    baseDodge: 20,
    baseCrit: 25,
    baseCritDamage: 120,
    baseGuard: 20,
    isBoss: true,
  },

  // ========== 义体制造副本敌人 ==========
  {
    id: 'enemy_cyber_rogue_android',
    name: '流浪仿生人',
    icon: '🦾',
    type: RuinType.CYBER_MATERIAL,
    baseHp: 100,
    baseAttack: 15,
    baseDefense: 8,
    baseSpeed: 1.1,
    baseHit: 75,
    baseDodge: 8,
    baseCrit: 8,
    baseCritDamage: 55,
    baseGuard: 8,
  },
  {
    id: 'enemy_cyber_enhanced_soldier',
    name: '强化士兵',
    icon: '⚔️',
    type: RuinType.CYBER_MATERIAL,
    baseHp: 120,
    baseAttack: 22,
    baseDefense: 12,
    baseSpeed: 1.3,
    baseHit: 80,
    baseDodge: 10,
    baseCrit: 12,
    baseCritDamage: 70,
    baseGuard: 12,
  },
  {
    id: 'enemy_cyber_mech',
    name: '重型机甲',
    icon: '🤖',
    type: RuinType.CYBER_MATERIAL,
    baseHp: 200,
    baseAttack: 35,
    baseDefense: 30,
    baseSpeed: 0.8,
    baseHit: 70,
    baseDodge: 3,
    baseCrit: 10,
    baseCritDamage: 100,
    baseGuard: 25,
    isBoss: true,
  },
  {
    id: 'enemy_cyber_void_mech',
    name: '虚空融合体',
    icon: '👾',
    type: RuinType.CYBER_MATERIAL,
    baseHp: 400,
    baseAttack: 55,
    baseDefense: 40,
    baseSpeed: 1.5,
    baseHit: 90,
    baseDodge: 15,
    baseCrit: 30,
    baseCritDamage: 150,
    baseGuard: 30,
    isBoss: true,
  },

  // ========== 基因材料副本敌人 ==========
  {
    id: 'enemy_gene_mutant',
    name: '变异实验体',
    icon: '🧟',
    type: RuinType.GENE_MATERIAL,
    baseHp: 70,
    baseAttack: 10,
    baseDefense: 4,
    baseSpeed: 1.2,
    baseHit: 70,
    baseDodge: 12,
    baseCrit: 6,
    baseCritDamage: 50,
    baseGuard: 4,
  },
  {
    id: 'enemy_gene_researcher',
    name: '疯狂研究员',
    icon: '🔬',
    type: RuinType.GENE_MATERIAL,
    baseHp: 90,
    baseAttack: 20,
    baseDefense: 6,
    baseSpeed: 1.4,
    baseHit: 85,
    baseDodge: 15,
    baseCrit: 15,
    baseCritDamage: 75,
    baseGuard: 8,
  },
  {
    id: 'enemy_gene_abomination',
    name: '基因憎恶',
    icon: '👹',
    type: RuinType.GENE_MATERIAL,
    baseHp: 180,
    baseAttack: 28,
    baseDefense: 25,
    baseSpeed: 1.0,
    baseHit: 80,
    baseDodge: 5,
    baseCrit: 12,
    baseCritDamage: 90,
    baseGuard: 20,
    isBoss: true,
  },
  {
    id: 'enemy_gene_perfect',
    name: '完美体',
    icon: '🧬',
    type: RuinType.GENE_MATERIAL,
    baseHp: 350,
    baseAttack: 38,
    baseDefense: 28,
    baseSpeed: 1.6,
    baseHit: 95,
    baseDodge: 18,
    baseCrit: 28,
    baseCritDamage: 140,
    baseGuard: 28,
    isBoss: true,
  },

  // ========== 基地核心副本敌人 ==========
  {
    id: 'enemy_base_guardian',
    name: '基地守卫',
    icon: '🛡️',
    type: RuinType.BASE_CORE,
    baseHp: 100,
    baseAttack: 18,
    baseDefense: 10,
    baseSpeed: 1.2,
    baseHit: 80,
    baseDodge: 8,
    baseCrit: 10,
    baseCritDamage: 60,
    baseGuard: 10,
  },
  {
    id: 'enemy_base_sentry',
    name: '防御哨塔',
    icon: '🗼',
    type: RuinType.BASE_CORE,
    baseHp: 150,
    baseAttack: 25,
    baseDefense: 15,
    baseSpeed: 0.8,
    baseHit: 90,
    baseDodge: 3,
    baseCrit: 15,
    baseCritDamage: 80,
    baseGuard: 15,
  },

  // ========== 科研之星副本敌人 ==========
  {
    id: 'enemy_research_data_drone',
    name: '数据无人机',
    icon: '📡',
    type: RuinType.RESEARCH_STAR,
    baseHp: 90,
    baseAttack: 16,
    baseDefense: 8,
    baseSpeed: 1.3,
    baseHit: 85,
    baseDodge: 10,
    baseCrit: 12,
    baseCritDamage: 65,
    baseGuard: 8,
  },
  {
    id: 'enemy_research_scientist',
    name: '疯狂科学家',
    icon: '👨‍🔬',
    type: RuinType.RESEARCH_STAR,
    baseHp: 80,
    baseAttack: 20,
    baseDefense: 6,
    baseSpeed: 1.1,
    baseHit: 80,
    baseDodge: 12,
    baseCrit: 15,
    baseCritDamage: 80,
    baseGuard: 6,
  },
];

export function generateRuinEnemy(
  ruinType: RuinType,
  difficulty: RuinDifficulty,
  playerLevel: number,
  playerTotalPower: number
): BattleEnemy {
  const difficultyConfig = RUIN_DIFFICULTY_CONFIG[difficulty];
  const templates = RUIN_ENEMY_TEMPLATES.filter(t => t.type === ruinType);

  const isBossDifficulty = difficulty === RuinDifficulty.NIGHTMARE || difficulty === RuinDifficulty.HELL;
  const availableTemplates = templates.filter(t => isBossDifficulty ? t.isBoss : !t.isBoss);

  const template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)] || templates[0];

  const difficultyMultiplier = difficultyConfig.multiplier;
  const levelScaling = 1 + (playerLevel - 1) * 0.1;
  const powerScaling = Math.max(0.8, Math.min(1.5, playerTotalPower / 500));

  const finalMultiplier = difficultyMultiplier * levelScaling * powerScaling;

  const hp = Math.floor(template.baseHp * finalMultiplier);
  const attack = Math.floor(template.baseAttack * finalMultiplier);
  const defense = Math.floor(template.baseDefense * finalMultiplier);
  const speed = Math.round(template.baseSpeed * (1 + (difficultyMultiplier - 1) * 0.3) * 10) / 10;
  const hit = Math.min(99, Math.floor(template.baseHit + difficultyMultiplier * 2));
  const dodge = Math.min(50, Math.floor(template.baseDodge + difficultyMultiplier * 3));
  const crit = Math.min(50, Math.floor(template.baseCrit + difficultyMultiplier * 2));
  const critDamage = Math.floor(template.baseCritDamage + difficultyMultiplier * 10);
  const guard = Math.floor(template.baseGuard + difficultyMultiplier * 2);

  const enemyLevel = Math.max(1, playerLevel + Math.floor(difficultyMultiplier - 1));

  return {
    id: `${template.id}_${Date.now()}`,
    name: template.name,
    hp,
    maxHp: hp,
    attack,
    defense,
    speed,
    hit,
    dodge,
    crit,
    critDamage,
    guard,
    level: enemyLevel,
    isElite: difficulty === RuinDifficulty.HARD,
    isBoss: template.isBoss || difficulty === RuinDifficulty.NIGHTMARE || difficulty === RuinDifficulty.HELL,
    rewards: {
      exp: Math.floor(50 * difficultyMultiplier * levelScaling),
    },
  };
}

export function generateRuinEnemies(
  ruinType: RuinType,
  difficulty: RuinDifficulty,
  playerLevel: number,
  playerTotalPower: number
): BattleEnemy[] {
  const difficultyConfig = RUIN_DIFFICULTY_CONFIG[difficulty];

  let enemyCount = 1;
  if (difficulty === RuinDifficulty.NORMAL) enemyCount = 1;
  else if (difficulty === RuinDifficulty.HARD) enemyCount = 2;
  else if (difficulty === RuinDifficulty.NIGHTMARE) enemyCount = 2;
  else if (difficulty === RuinDifficulty.HELL) enemyCount = 3;

  const enemies: BattleEnemy[] = [];
  for (let i = 0; i < enemyCount; i++) {
    const enemy = generateRuinEnemy(ruinType, difficulty, playerLevel, playerTotalPower);
    enemy.id = `${enemy.id}_${i}`;
    if (i > 0) {
      enemy.name = `${enemy.name} #${i + 1}`;
      enemy.isBoss = false;
      enemy.hp = Math.floor(enemy.hp * 0.7);
      enemy.maxHp = enemy.hp;
      enemy.attack = Math.floor(enemy.attack * 0.8);
    }
    enemies.push(enemy);
  }

  return enemies;
}
