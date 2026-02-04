/**
 * 数值平衡测试工具 (JavaScript版本)
 * 用于验证新设计的数值系统是否符合预期
 */

// 模拟玩家属性计算
function calculatePlayerAttribute(baseValue, level) {
  if (level <= 10) {
    return baseValue * Math.pow(1.15, level - 1);
  } else if (level <= 50) {
    const base10 = baseValue * Math.pow(1.15, 9);
    const growthFactor = 1 + 0.005 * (level - 10);
    return base10 * Math.pow(growthFactor, level - 10);
  } else {
    const base50 = calculatePlayerAttribute(baseValue, 50);
    const logGrowth = 1 + Math.log(level - 49) * 0.02;
    return base50 * logGrowth;
  }
}

// 计算升级所需经验
function calculateExpToNext(level) {
  if (level <= 10) {
    return Math.floor(100 * level * 1.2);
  } else if (level <= 50) {
    const baseExp = 100 * 10 * 1.2;
    return Math.floor(baseExp * Math.pow(1.15, level - 10));
  } else {
    const baseExp = 100 * 10 * 1.2 * Math.pow(1.15, 40);
    return Math.floor(baseExp * (1 + Math.log(level - 49) * 0.1));
  }
}

// 计算防御减免
function calculateDefenseReduction(defense, level) {
  return defense / (defense + level * 100 + 500);
}

// 计算战力
function calculatePower(stats) {
  return (
    stats.attack * 0.4 +
    stats.defense * 0.3 +
    stats.hp * 0.15 +
    stats.speed * 0.1 * 100 +
    (stats.hit + stats.dodge + stats.crit * 2) * 0.05 +
    stats.penetration * 0.1 * 100 +
    stats.trueDamage * 0.1 * 100
  );
}

// 计算战斗效率
function calculateBattleEfficiency(playerPower, enemyPower) {
  return playerPower / enemyPower;
}

// 测试不同等级的玩家属性
function testPlayerGrowth() {
  console.log('=== 玩家成长曲线测试 ===\n');

  const testLevels = [1, 5, 10, 15, 20, 30, 40, 50, 60, 70, 80];

  console.log('等级 | 生命值 | 攻击力 | 防御力 | 升级经验 | 总经验');
  console.log('-----|--------|--------|--------|----------|--------');

  let totalExp = 0;
  for (const level of testLevels) {
    const hp = Math.floor(calculatePlayerAttribute(100, level));
    const atk = Math.floor(calculatePlayerAttribute(10, level));
    const def = Math.floor(calculatePlayerAttribute(5, level));
    const expNeeded = calculateExpToNext(level);
    totalExp += expNeeded;

    console.log(
      `${level.toString().padStart(4)} | ${hp.toString().padStart(6)} | ${atk.toString().padStart(6)} | ${def.toString().padStart(6)} | ${expNeeded.toString().padStart(8)} | ${totalExp.toString().padStart(8)}`
    );
  }

  console.log('\n');
}

// 测试战斗效率
function testBattleEfficiency() {
  console.log('=== 战斗效率测试 ===\n');

  // 模拟不同等级玩家 vs 对应等级敌人
  const scenarios = [
    { playerLevel: 1, enemyHp: 180, enemyAtk: 18, enemyDef: 8, enemyName: '锈蚀鼠(T1)' },
    { playerLevel: 5, enemyHp: 250, enemyAtk: 22, enemyDef: 15, enemyName: '维修傀儡(T1)' },
    { playerLevel: 10, enemyHp: 450, enemyAtk: 45, enemyDef: 22, enemyName: '锈蚀蠕虫王(T2)' },
    { playerLevel: 15, enemyHp: 520, enemyAtk: 52, enemyDef: 28, enemyName: '维修机械王(T2+)' },
    { playerLevel: 20, enemyHp: 600, enemyAtk: 60, enemyDef: 35, enemyName: '粮袋鼠王(T3)' },
  ];

  console.log('玩家等级 | 玩家战力 | 敌人 | 敌人战力 | 战斗效率 | 评价');
  console.log('---------|----------|------|----------|----------|------');

  for (const scenario of scenarios) {
    const playerHp = Math.floor(calculatePlayerAttribute(100, scenario.playerLevel));
    const playerAtk = Math.floor(calculatePlayerAttribute(10, scenario.playerLevel));
    const playerDef = Math.floor(calculatePlayerAttribute(5, scenario.playerLevel));
    const playerHit = Math.floor(calculatePlayerAttribute(50, scenario.playerLevel));
    const playerDodge = calculatePlayerAttribute(10, scenario.playerLevel);
    const playerCrit = calculatePlayerAttribute(5, scenario.playerLevel);

    const playerPower = calculatePower({
      attack: playerAtk,
      defense: playerDef,
      hp: playerHp,
      hit: playerHit,
      dodge: playerDodge,
      speed: 1.0,
      crit: playerCrit,
      critDamage: 50,
      penetration: 0,
      trueDamage: 0,
    });

    // 敌人战力计算（简化版）
    const enemyPower = scenario.enemyHp * 0.1 + scenario.enemyAtk * 2 + scenario.enemyDef * 1.5 + scenario.playerLevel * 1;

    const efficiency = calculateBattleEfficiency(playerPower, enemyPower);

    let evaluation = '';
    if (efficiency >= 1.5) evaluation = '轻松';
    else if (efficiency >= 1.2) evaluation = '正常';
    else if (efficiency >= 0.8) evaluation = '挑战';
    else evaluation = '困难';

    console.log(
      `${scenario.playerLevel.toString().padStart(8)} | ${playerPower.toFixed(1).padStart(8)} | ${scenario.enemyName.padStart(16)} | ${enemyPower.toFixed(1).padStart(8)} | ${efficiency.toFixed(2).padStart(8)} | ${evaluation}`
    );
  }

  console.log('\n');
}

// 测试防御减免
function testDefenseReduction() {
  console.log('=== 防御减免测试 ===\n');

  const defenses = [5, 10, 20, 50, 100, 200, 500];
  const levels = [1, 10, 20, 50];

  console.log('防御 \ 等级 |    1   |   10   |   20   |   50');
  console.log('------------|--------|--------|--------|--------');

  for (const defense of defenses) {
    const row = [defense.toString().padStart(11)];
    for (const level of levels) {
      const reduction = calculateDefenseReduction(defense, level);
      row.push(`${(reduction * 100).toFixed(1)}%`.padStart(6));
    }
    console.log(row.join(' | '));
  }

  console.log('\n');
}

// 运行所有测试
function runAllTests() {
  console.log('\n');
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║         数值平衡验证测试工具                              ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('\n');

  testPlayerGrowth();
  testBattleEfficiency();
  testDefenseReduction();

  console.log('=== 测试完成 ===');
  console.log('\n数值设计目标验证：');
  console.log('1. 普通地图战斗效率 ≥ 1.2：正常击败');
  console.log('2. 特殊地图战斗效率 ≥ 0.8：可以挑战');
  console.log('3. 最终关卡战斗效率 ≥ 0.5：极限通关');
  console.log('4. 防御减免曲线平滑，避免极端减伤');
}

// 运行测试
runAllTests();