import { Player } from './Player';
import { equipmentSystem, BattleContext } from './EquipmentSystem';
import { EffectTrigger } from '../data/equipmentTypes';

export interface BattleEnemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  hit: number;
  dodge: number;
  crit: number; // 会心
  critDamage: number;
  penetration?: number;
  trueDamage?: number;
  guard: number; // 护心
  level: number;
  isElite?: boolean;
  isBoss?: boolean;
  rewards?: {
    exp: number;
    items?: string[];
  };
}

export interface BattleLog {
  turn: number;
  attacker: string;
  defender: string;
  damage: number;
  isCrit: boolean;
  isDodge: boolean;
  isTrueDamage: boolean;
  effects: string[];
}

export interface BattleResult {
  victory: boolean;
  logs: BattleLog[];
  turns: number;
  playerHpRemaining: number;
  enemyHpRemaining: number;
  expGained: number;
  itemsGained: string[];
}

export class BattleSystem {
  private static instance: BattleSystem;

  static getInstance(): BattleSystem {
    if (!BattleSystem.instance) {
      BattleSystem.instance = new BattleSystem();
    }
    return BattleSystem.instance;
  }

  // 计算命中率
  calculateHitRate(attackerHit: number, defenderDodge: number): number {
    const rate = attackerHit / (attackerHit + defenderDodge * 0.8) * 100;
    return Math.max(10, Math.min(90, rate));
  }

  // 计算防御减免（暴雪式）
  calculateDefenseReduction(defense: number, level: number): number {
    return defense / (defense + level * 100 + 500);
  }

  // 计算伤害
  calculateDamage(
    attacker: Player | BattleEnemy,
    defender: Player | BattleEnemy,
    isPlayerAttacking: boolean,
    effects?: { damageBonus: number; trueDamagePercent: number; penetrationBonus: number; defenseReduction: number }
  ): { damage: number; isCrit: boolean; isTrueDamage: boolean } {
    const attackerAttack = 'totalAttack' in attacker ? attacker.totalAttack : attacker.attack;
    const attackerCrit = 'totalCrit' in attacker ? attacker.totalCrit : attacker.crit;
    const attackerCritDamage = 'totalCritDamage' in attacker ? attacker.totalCritDamage : (attacker.critDamage || 50);
    const attackerPenetration = 'totalPenetration' in attacker ? attacker.totalPenetration : (attacker.penetration || 0);
    const attackerTrueDamage = 'totalTrueDamage' in attacker ? attacker.totalTrueDamage : (attacker.trueDamage || 0);

    const defenderDefense = 'totalDefense' in defender ? defender.totalDefense : defender.defense;
    const defenderGuard = 'totalGuard' in defender ? defender.totalGuard : (defender.guard || 5);
    const defenderLevel = 'level' in defender ? defender.level : 1;

    // 判断是否暴击 - 新公式：暴击概率 = (我方会心 - 敌人护心) / (敌人护心 * 1.5)
    let critChance = 0;
    if (attackerCrit > defenderGuard) {
      critChance = (attackerCrit - defenderGuard) / (defenderGuard * 1.5) * 100;
    }
    critChance = Math.max(0, Math.min(100, critChance)); // 限制在0-100%
    const critRoll = Math.random() * 100;
    const isCrit = critRoll < critChance;

    // 基础伤害
    let damage = attackerAttack;

    // 应用伤害加成
    if (effects?.damageBonus) {
      damage *= (1 + effects.damageBonus);
    }

    // 计算真实伤害部分
    let trueDamagePercent = attackerTrueDamage / 100;
    if (effects?.trueDamagePercent) {
      trueDamagePercent += effects.trueDamagePercent;
    }

    const trueDamage = damage * trueDamagePercent;
    const normalDamage = damage * (1 - trueDamagePercent);

    // 计算防御减免
    let defenseReduction = this.calculateDefenseReduction(defenderDefense, defenderLevel);

    // 应用穿透
    let totalPenetration = attackerPenetration / 100;
    if (effects?.penetrationBonus) {
      totalPenetration += effects.penetrationBonus;
    }
    defenseReduction = Math.max(0, defenseReduction - totalPenetration);

    // 应用防御削弱效果
    if (effects?.defenseReduction) {
      defenseReduction = Math.max(0, defenseReduction - effects.defenseReduction);
    }

    // 最终伤害
    let finalDamage = normalDamage * (1 - defenseReduction) + trueDamage;

    // 暴击加成
    if (isCrit) {
      finalDamage *= (1.5 + attackerCritDamage / 100);
    }

    return {
      damage: Math.max(1, Math.floor(finalDamage)),
      isCrit,
      isTrueDamage: trueDamagePercent > 0,
    };
  }

  // 执行战斗
  executeBattle(player: Player, enemy: BattleEnemy): BattleResult {
    const logs: BattleLog[] = [];
    let turn = 0;
    let playerHp = player.hp;
    let enemyHp = enemy.hp;

    // 战斗开始效果
    const battleStartContext: BattleContext = {
      attacker: player,
      defender: enemy,
      currentHp: playerHp,
      maxHp: player.totalMaxHp,
    };

    const playerStartEffects = equipmentSystem.getBattleStartEffects(player.equippedItems, battleStartContext);
    if (playerStartEffects.shieldAmount > 0) {
      // 护盾系统可以在这里实现
    }

    // 计算双方攻速决定行动顺序
    const playerSpeed = player.totalAttackSpeed;
    const enemySpeed = enemy.speed;

    let playerNextTurn = 100 / playerSpeed;
    let enemyNextTurn = 100 / enemySpeed;

    while (playerHp > 0 && enemyHp > 0 && turn < 100) {
      turn++;

      if (playerNextTurn <= enemyNextTurn) {
        // 玩家回合
        playerNextTurn += 100 / playerSpeed;

        // 计算命中率
        const hitRate = this.calculateHitRate(player.totalHit, enemy.dodge);
        const hitRoll = Math.random() * 100;

        if (hitRoll > hitRate) {
          // 未命中
          logs.push({
            turn,
            attacker: player.name,
            defender: enemy.name,
            damage: 0,
            isCrit: false,
            isDodge: true,
            isTrueDamage: false,
            effects: ['未命中'],
          });
          continue;
        }

        // 攻击前效果
        const attackContext: BattleContext = {
          attacker: player,
          defender: enemy,
          currentHp: playerHp,
          maxHp: player.totalMaxHp,
        };
        const attackEffects = equipmentSystem.getAttackEffects(player.equippedItems, attackContext);

        // 计算伤害
        const damageResult = this.calculateDamage(player, enemy, true, {
          damageBonus: attackEffects.damageBonus,
          trueDamagePercent: attackEffects.trueDamagePercent,
          penetrationBonus: attackEffects.penetrationBonus,
          defenseReduction: attackEffects.defenseReduction,
        });

        // 命中效果
        const hitContext: BattleContext = {
          attacker: player,
          defender: enemy,
          damage: damageResult.damage,
          isCrit: damageResult.isCrit,
          currentHp: playerHp,
          maxHp: player.totalMaxHp,
        };
        const hitEffects = equipmentSystem.getHitEffects(player.equippedItems, hitContext);

        // 暴击效果
        let critEffects = { healAmount: 0, effectsApplied: [] as string[] };
        if (damageResult.isCrit) {
          critEffects = equipmentSystem.getCritEffects(player.equippedItems, hitContext);
        }

        // 应用伤害
        enemyHp = Math.max(0, enemyHp - damageResult.damage);

        // 吸血治疗
        if (hitEffects.healAmount > 0 || attackEffects.healAmount > 0) {
          const totalHeal = hitEffects.healAmount + attackEffects.healAmount;
          playerHp = Math.min(player.totalMaxHp, playerHp + totalHeal);
        }

        // 记录日志
        const allEffects = [
          ...attackEffects.effectsApplied,
          ...hitEffects.effectsApplied,
          ...critEffects.effectsApplied,
        ];

        logs.push({
          turn,
          attacker: player.name,
          defender: enemy.name,
          damage: damageResult.damage,
          isCrit: damageResult.isCrit,
          isDodge: false,
          isTrueDamage: damageResult.isTrueDamage,
          effects: allEffects,
        });

        // 击杀效果
        if (enemyHp <= 0) {
          const killContext: BattleContext = {
            attacker: player,
            defender: enemy,
            currentHp: playerHp,
            maxHp: player.totalMaxHp,
          };
          const killEffects = equipmentSystem.getKillEffects(player.equippedItems, killContext);
          if (killEffects.healAmount > 0) {
            playerHp = Math.min(player.totalMaxHp, playerHp + killEffects.healAmount);
          }
        }

      } else {
        // 敌人回合
        enemyNextTurn += 100 / enemySpeed;

        // 计算命中率
        const hitRate = this.calculateHitRate(enemy.hit, player.totalDodge);
        const hitRoll = Math.random() * 100;

        if (hitRoll > hitRate) {
          // 未命中
          logs.push({
            turn,
            attacker: enemy.name,
            defender: player.name,
            damage: 0,
            isCrit: false,
            isDodge: true,
            isTrueDamage: false,
            effects: ['闪避'],
          });

          // 闪避效果
          const dodgeContext: BattleContext = {
            attacker: enemy,
            defender: player,
            isDodge: true,
            currentHp: playerHp,
            maxHp: player.totalMaxHp,
          };
          equipmentSystem.getDodgeEffects(player.equippedItems, dodgeContext);
          continue;
        }

        // 防御效果
        const defendContext: BattleContext = {
          attacker: enemy,
          defender: player,
          currentHp: playerHp,
          maxHp: player.totalMaxHp,
        };
        const defendEffects = equipmentSystem.getDefendEffects(player.equippedItems, defendContext);

        // 计算伤害
        const damageResult = this.calculateDamage(enemy, player, false, {
          damageBonus: 0,
          trueDamagePercent: 0,
          penetrationBonus: 0,
          defenseReduction: -defendEffects.defenseReduction,
        });

        // 应用伤害
        playerHp = Math.max(0, playerHp - damageResult.damage);

        // 记录日志
        logs.push({
          turn,
          attacker: enemy.name,
          defender: player.name,
          damage: damageResult.damage,
          isCrit: damageResult.isCrit,
          isDodge: false,
          isTrueDamage: damageResult.isTrueDamage,
          effects: defendEffects.effectsApplied,
        });
      }
    }

    // 更新玩家血量
    player.hp = playerHp;

    // 计算奖励
    const victory = enemyHp <= 0;
    const expGained = victory ? (enemy.rewards?.exp || 0) : 0;
    const itemsGained = victory ? (enemy.rewards?.items || []) : [];

    if (victory && expGained > 0) {
      player.addExp(expGained);
    }

    // 清除冷却
    equipmentSystem.clearCooldowns();

    return {
      victory,
      logs,
      turns: turn,
      playerHpRemaining: playerHp,
      enemyHpRemaining: enemyHp,
      expGained,
      itemsGained,
    };
  }

  // 快速战斗（用于自动战斗）
  quickBattle(player: Player, enemy: BattleEnemy): BattleResult {
    return this.executeBattle(player, enemy);
  }
}

export const battleSystem = BattleSystem.getInstance();
