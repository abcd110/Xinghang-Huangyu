import { useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';

export interface GenericEnemy {
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
  guard: number;
  isBoss?: boolean;
  isElite?: boolean;
  icon?: string;
  rewards?: {
    exp: number;
  };
}

interface GenericBattleScreenProps {
  enemies: GenericEnemy[];
  onBattleEnd: (victory: boolean, totalExp: number) => void;
  title?: string;
  subtitle?: string;
  themeColor?: string;
}

type BattlePhase = 'fighting' | 'victory' | 'defeat';

interface BattleUnit {
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
  guard: number;
  icon?: string;
  isPlayer: boolean;
  isAlive: boolean;
}

export function GenericBattleScreen({
  enemies,
  onBattleEnd,
  title = '战斗',
  subtitle = '',
  themeColor = '#0099cc'
}: GenericBattleScreenProps) {
  const gameManager = useGameStore(state => state.gameManager);
  const player = useGameStore(state => state.getPlayer());

  const [phase, setPhase] = useState<BattlePhase>('fighting');
  const [currentEnemyIndex, setCurrentEnemyIndex] = useState(0);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [gainedExp, setGainedExp] = useState(0);

  const [playerTeam, setPlayerTeam] = useState<BattleUnit[]>([]);
  const [enemyTeam, setEnemyTeam] = useState<BattleUnit[]>([]);

  const playerAttackTimer = useRef<number | null>(null);
  const enemyAttackTimer = useRef<number | null>(null);
  const playerTeamRef = useRef<BattleUnit[]>([]);
  const enemyTeamRef = useRef<BattleUnit[]>([]);
  const currentEnemyIndexRef = useRef(0);
  
  // 使用 ref 存储 onBattleEnd，确保始终使用最新的回调
  const onBattleEndRef = useRef(onBattleEnd);
  
  useEffect(() => {
    onBattleEndRef.current = onBattleEnd;
  }, [onBattleEnd]);

  useEffect(() => {
    playerTeamRef.current = playerTeam;
  }, [playerTeam]);

  useEffect(() => {
    enemyTeamRef.current = enemyTeam;
  }, [enemyTeam]);
  
  useEffect(() => {
    currentEnemyIndexRef.current = currentEnemyIndex;
  }, [currentEnemyIndex]);

  const addLog = useCallback((message: string) => {
    setBattleLog(prev => [message, ...prev].slice(0, 15));
  }, []);

  const calculatePlayerStats = useCallback(() => {
    const chipBonus = gameManager.getChipStatBonus();
    const implantStats = gameManager.getImplantTotalStats();

    const chipAttack = chipBonus['攻击'] || 0;
    const chipAttackPercent = (chipBonus['攻击%'] || 0) / 100;
    const implantAttack = implantStats['attack'] || 0;
    const finalAttack = Math.floor((player.totalAttack + chipAttack + implantAttack) * (1 + chipAttackPercent));

    const chipDefense = chipBonus['防御'] || 0;
    const chipDefensePercent = (chipBonus['防御%'] || 0) / 100;
    const implantDefense = implantStats['defense'] || 0;
    const finalDefense = Math.floor((player.totalDefense + chipDefense + implantDefense) * (1 + chipDefensePercent));

    const chipHp = chipBonus['生命'] || 0;
    const chipHpPercent = (chipBonus['生命%'] || 0) / 100;
    const implantHp = implantStats['hp'] || 0;
    const rawMaxHp = player.maxHp + player.equipmentStats.hp;
    const finalMaxHp = Math.floor((rawMaxHp + chipHp + implantHp) * (1 + chipHpPercent));

    const chipSpeed = chipBonus['攻速'] || 0;
    const implantSpeed = implantStats['speed'] || 0;
    const finalAttackSpeed = player.totalAttackSpeed + chipSpeed + implantSpeed;

    const chipCrit = chipBonus['会心'] || 0;
    const implantCrit = implantStats['critRate'] || 0;
    const finalCrit = player.totalCrit + chipCrit + implantCrit;

    const chipCritDamage = chipBonus['暴伤'] || 0;
    const implantCritDamage = implantStats['critDamage'] || 0;
    const finalCritDamage = player.totalCritDamage + chipCritDamage + implantCritDamage;

    return {
      attack: finalAttack,
      defense: finalDefense,
      maxHp: finalMaxHp,
      speed: finalAttackSpeed,
      crit: finalCrit,
      critDamage: finalCritDamage,
      hit: player.totalHit,
      dodge: player.totalDodge,
      guard: player.totalGuard,
    };
  }, [gameManager, player]);

  const initPlayerTeam = useCallback((): BattleUnit[] => {
    const stats = calculatePlayerStats();

    // 每次战斗前重置玩家生命值为满血
    player.hp = stats.maxHp;

    const team: BattleUnit[] = [];
    team.push({
      id: 'player_0',
      name: gameManager.playerName || '幸存者',
      hp: stats.maxHp,
      maxHp: stats.maxHp,
      attack: stats.attack,
      defense: stats.defense,
      speed: stats.speed,
      crit: stats.crit,
      critDamage: stats.critDamage,
      hit: stats.hit,
      dodge: stats.dodge,
      guard: stats.guard,
      icon: '我',
      isPlayer: true,
      isAlive: player.hp > 0,
    });

    for (let i = 1; i < 6; i++) {
      team.push({
        id: `player_${i}`,
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
        guard: 0,
        isPlayer: true,
        isAlive: false,
      });
    }
    return team;
  }, [calculatePlayerStats, gameManager.playerName, player]);

  const initEnemyTeam = useCallback((enemyData: GenericEnemy): BattleUnit[] => {
    const team: BattleUnit[] = [];
    team.push({
      id: 'enemy_0',
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
      guard: enemyData.guard,
      icon: enemyData.icon || (enemyData.isBoss ? '👹' : '🤖'),
      isPlayer: false,
      isAlive: enemyData.hp > 0,
    });

    const minionCount = enemyData.isBoss ? 2 : enemyData.isElite ? 1 : 0;
    for (let i = 1; i <= minionCount; i++) {
      const minionHp = Math.floor(enemyData.maxHp * 0.3);
      team.push({
        id: `enemy_${i}`,
        name: `${enemyData.name}仆从`,
        hp: minionHp,
        maxHp: minionHp,
        attack: Math.floor(enemyData.attack * 0.4),
        defense: Math.floor(enemyData.defense * 0.5),
        speed: Math.floor(enemyData.speed * 0.8),
        crit: Math.floor(enemyData.crit * 0.5),
        critDamage: Math.floor(enemyData.critDamage * 0.5),
        hit: Math.floor(enemyData.hit * 0.8),
        dodge: Math.floor(enemyData.dodge * 0.8),
        guard: Math.floor(enemyData.guard * 0.5),
        icon: '小',
        isPlayer: false,
        isAlive: true,
      });
    }

    for (let i = team.length; i < 6; i++) {
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
        guard: 0,
        isPlayer: false,
        isAlive: false,
      });
    }
    return team;
  }, []);

  useEffect(() => {
    const initialPlayerTeam = initPlayerTeam();
    const initialEnemyTeam = initEnemyTeam(enemies[0]);
    setPlayerTeam(initialPlayerTeam);
    setEnemyTeam(initialEnemyTeam);
    playerTeamRef.current = initialPlayerTeam;
    enemyTeamRef.current = initialEnemyTeam;
    addLog(`遭遇了 ${enemies[0].name}！`);
    addLog('战斗开始！');
  }, [initEnemyTeam, initPlayerTeam, enemies, addLog]);

  useEffect(() => {
    if (enemies.length > 0 && currentEnemyIndex < enemies.length && currentEnemyIndex > 0) {
      const newEnemyTeam = initEnemyTeam(enemies[currentEnemyIndex]);
      setEnemyTeam(newEnemyTeam);
      enemyTeamRef.current = newEnemyTeam;
      addLog(`遭遇 ${enemies[currentEnemyIndex].name}！`);
    }
  }, [currentEnemyIndex, enemies, initEnemyTeam, addLog]);

  const clearAllTimers = useCallback(() => {
    if (playerAttackTimer.current) {
      clearInterval(playerAttackTimer.current);
      playerAttackTimer.current = null;
    }
    if (enemyAttackTimer.current) {
      clearInterval(enemyAttackTimer.current);
      enemyAttackTimer.current = null;
    }
  }, []);

  const calculateDamage = useCallback((
    attacker: BattleUnit,
    defender: BattleUnit,
  ): { damage: number; isCrit: boolean; isDodge: boolean } => {
    const hitRate = attacker.hit / (attacker.hit + defender.dodge * 0.8);
    if (Math.random() > hitRate) {
      return { damage: 0, isCrit: false, isDodge: true };
    }

    let damage = attacker.attack;
    let isCrit = false;

    if (attacker.crit > defender.guard) {
      const critChance = (attacker.crit - defender.guard) / (defender.guard * 1.5);
      if (Math.random() < Math.min(critChance, 1)) {
        damage *= (1.5 + attacker.critDamage / 100);
        isCrit = true;
      }
    }

    const defenseReduction = defender.defense / (defender.defense + 600);
    damage = Math.floor(damage * (1 - defenseReduction));
    damage = Math.max(1, damage);

    return { damage, isCrit, isDodge: false };
  }, []);

  const doPlayerAttack = useCallback(() => {
    const currentPlayerTeam = playerTeamRef.current;
    const currentEnemyTeam = enemyTeamRef.current;

    const alivePlayers = currentPlayerTeam.filter(u => u.isAlive);
    if (alivePlayers.length === 0) return;

    alivePlayers.forEach(attacker => {
      let target: BattleUnit | null = null;
      let targetIndex = -1;

      for (let i = 0; i < currentEnemyTeam.length; i++) {
        if (currentEnemyTeam[i].isAlive) {
          target = currentEnemyTeam[i];
          targetIndex = i;
          break;
        }
      }

      if (!target || targetIndex === -1) return;

      const { damage, isCrit, isDodge } = calculateDamage(attacker, target);

      setEnemyTeam(prev => {
        const newTeam = [...prev];
        const newHp = Math.max(0, target!.hp - damage);
        newTeam[targetIndex] = { ...target!, hp: newHp, isAlive: newHp > 0 };
        enemyTeamRef.current = newTeam;

        const remainingEnemies = newTeam.filter(u => u.isAlive);
        if (remainingEnemies.length === 0) {
          clearAllTimers();
          console.log('敌人全部被击败');
          console.log('currentEnemyIndexRef.current:', currentEnemyIndexRef.current);
          console.log('enemies.length:', enemies.length);
          if (currentEnemyIndexRef.current < enemies.length - 1) {
            console.log('进入下一波敌人');
            setCurrentEnemyIndex(prev => prev + 1);
            addLog(`击败 ${target!.name}！`);
          } else {
            console.log('设置 phase 为 victory');
            setPhase('victory');
            const totalExp = enemies.reduce((sum, e) => sum + (e.rewards?.exp || 0), 0);
            setGainedExp(totalExp);
            player.addExp(totalExp);
            addLog(`战斗胜利！获得 ${totalExp} 经验`);
          }
        }

        return newTeam;
      });

      if (isDodge) {
        addLog(`${target.name} 闪避了攻击！`);
      } else if (isCrit) {
        addLog(`${attacker.name} 暴击 ${target.name} 造成 ${damage} 伤害！`);
      } else {
        addLog(`${attacker.name} 攻击 ${target.name} 造成 ${damage} 伤害`);
      }
    });
  }, [calculateDamage, clearAllTimers, enemies, addLog, player]);

  const doEnemyAttack = useCallback(() => {
    const currentPlayerTeam = playerTeamRef.current;
    const currentEnemyTeam = enemyTeamRef.current;

    const aliveEnemies = currentEnemyTeam.filter(u => u.isAlive);
    if (aliveEnemies.length === 0) return;

    aliveEnemies.forEach(attacker => {
      let target: BattleUnit | null = null;
      let targetIndex = -1;

      for (let i = 0; i < currentPlayerTeam.length; i++) {
        if (currentPlayerTeam[i].isAlive) {
          target = currentPlayerTeam[i];
          targetIndex = i;
          break;
        }
      }

      if (!target || targetIndex === -1) return;

      const { damage, isCrit, isDodge } = calculateDamage(attacker, target);

      setPlayerTeam(prev => {
        const newTeam = [...prev];
        const newHp = Math.max(0, target!.hp - damage);
        newTeam[targetIndex] = { ...target!, hp: newHp, isAlive: newHp > 0 };
        playerTeamRef.current = newTeam;

        const remainingPlayers = newTeam.filter(u => u.isAlive);
        if (remainingPlayers.length === 0) {
          clearAllTimers();
          setPhase('defeat');
          addLog('你被击败了！');
        }

        return newTeam;
      });

      if (isDodge) {
        addLog(`${target.name} 闪避了 ${attacker.name} 的攻击！`);
      } else if (isCrit) {
        addLog(`${attacker.name} 暴击 ${target.name} 造成 ${damage} 伤害！`);
      } else {
        addLog(`${attacker.name} 攻击 ${target.name} 造成 ${damage} 伤害`);
      }
    });
  }, [calculateDamage, clearAllTimers, addLog]);

  useEffect(() => {
    if (phase !== 'fighting') return;

    const stats = calculatePlayerStats();
    const playerInterval = Math.max(500, 1000 / stats.speed);

    const currentEnemy = enemies[currentEnemyIndex];
    const enemySpeed = currentEnemy?.speed || 1;
    const enemyInterval = Math.max(500, 1000 / enemySpeed);

    playerAttackTimer.current = window.setInterval(doPlayerAttack, playerInterval);
    enemyAttackTimer.current = window.setInterval(doEnemyAttack, enemyInterval);

    return () => {
      clearAllTimers();
    };
  }, [phase, calculatePlayerStats, enemies, currentEnemyIndex, doPlayerAttack, doEnemyAttack, clearAllTimers]);

  // 渲染单位卡片
  const renderUnitCard = (unit: BattleUnit, position: number) => {
    if (!unit.isAlive && unit.name === '') {
      return (
        <div
          key={unit.id}
          style={{
            width: '100px',
            height: '55px',
            backgroundColor: 'transparent',
          }}
        />
      );
    }

    const hpPercent = unit.maxHp > 0 ? (unit.hp / unit.maxHp) * 100 : 0;
    const hpColor = hpPercent > 50 ? '#22c55e' : hpPercent > 25 ? '#eab308' : '#ef4444';

    return (
      <div
        key={unit.id}
        style={{
          width: '100px',
          height: '55px',
          backgroundColor: unit.isAlive ? '#1e2235' : '#151825',
          border: `1px solid ${unit.isAlive ? (unit.isPlayer ? '#3b82f6' : '#ef4444') : '#2a2f3f'}`,
          borderRadius: '8px',
          padding: '6px 8px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          opacity: unit.isAlive ? 1 : 0.6,
        }}
      >
        <div style={{
          fontSize: '11px',
          color: unit.isPlayer ? '#60a5fa' : '#f87171',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: '1.2',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <span>{unit.name}</span>
          <span style={{ fontSize: '9px', color: '#6b7280' }}>{position}号</span>
        </div>
        {unit.isAlive ? (
          <>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '10px',
              color: '#9ca3af',
              lineHeight: '1.2',
            }}>
              <span>{unit.hp}</span>
              <span>/{unit.maxHp}</span>
            </div>
            <div style={{
              backgroundColor: '#2a2f3f',
              borderRadius: '3px',
              height: '5px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                backgroundColor: hpColor,
                transition: 'width 0.3s',
                width: `${hpPercent}%`,
              }} />
            </div>
          </>
        ) : (
          <div style={{
            fontSize: '11px',
            color: '#6b7280',
            textAlign: 'center',
            lineHeight: '1.2',
          }}>
            已阵亡
          </div>
        )}
      </div>
    );
  };

  // 渲染战斗场地
  const renderBattleField = () => {
    const enemyBackRow = [3, 4, 5].map(index => {
      const unit = enemyTeam[index] || { id: `enemy_${index}`, name: '', hp: 0, maxHp: 0, isPlayer: false, isAlive: false } as BattleUnit;
      return renderUnitCard(unit, index + 1);
    });

    const enemyFrontRow = [0, 1, 2].map(index => {
      const unit = enemyTeam[index] || { id: `enemy_${index}`, name: '', hp: 0, maxHp: 0, isPlayer: false, isAlive: false } as BattleUnit;
      return renderUnitCard(unit, index + 1);
    });

    const playerFrontRow = [0, 1, 2].map(index => {
      const unit = playerTeam[index] || { id: `player_${index}`, name: '', hp: 0, maxHp: 0, isPlayer: true, isAlive: false } as BattleUnit;
      return renderUnitCard(unit, index + 1);
    });

    const playerBackRow = [3, 4, 5].map(index => {
      const unit = playerTeam[index] || { id: `player_${index}`, name: '', hp: 0, maxHp: 0, isPlayer: true, isAlive: false } as BattleUnit;
      return renderUnitCard(unit, index + 1);
    });

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        padding: '16px',
      }}>
        {/* 敌方队伍 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>敌方后排</div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {enemyBackRow}
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {enemyFrontRow}
          </div>
          <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>敌方前排</div>
        </div>

        {/* VS / 战斗状态 */}
        {phase === 'fighting' && (
          <div style={{
            fontSize: '22px',
            color: themeColor,
            fontWeight: 'bold',
            textShadow: `0 0 10px ${themeColor}50`,
          }}>
            VS
          </div>
        )}

        {/* 胜利显示 */}
        {phase === 'victory' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#065f46',
              border: '2px solid #4ade80',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: '#4ade80',
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
              获得<br />经验
            </div>
            <div style={{ color: '#4ade80', fontSize: '14px', fontWeight: 'bold' }}>
              +{gainedExp}
            </div>
          </div>
        )}

        {/* 失败显示 */}
        {phase === 'defeat' && (
          <div style={{
            fontSize: '18px',
            color: '#ef4444',
            fontWeight: 'bold',
          }}>
            失败...
          </div>
        )}

        {/* 玩家队伍 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>我方前排</div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {playerFrontRow}
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {playerBackRow}
          </div>
          <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>我方后排</div>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      height: '100vh',
      backgroundColor: '#0a0e27',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* 调试日志 */}
      {console.log('渲染 GenericBattleScreen, phase:', phase)}
      {/* 顶部标题栏 */}
      <header style={{
        flexShrink: 0,
        backgroundColor: '#1a1f3a',
        borderBottom: '1px solid #2a3050',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: themeColor, fontWeight: 'bold', fontSize: '15px' }}>{title}</span>
          {subtitle && (
            <span style={{
              color: themeColor,
              fontSize: '10px',
              padding: '2px 8px',
              background: `${themeColor}20`,
              borderRadius: '4px',
            }}>
              {subtitle}
            </span>
          )}
        </div>
        <div style={{ color: '#6b7280', fontSize: '11px' }}>
          敌人 {currentEnemyIndex + 1}/{enemies.length}
        </div>
      </header>

      {/* 主内容区 */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* 战斗场地 */}
        {renderBattleField()}

        {/* 战斗记录 */}
        <div style={{
          backgroundColor: '#1a1f3a',
          borderRadius: '10px',
          padding: '10px 12px',
          border: '1px solid #2a3050',
          margin: '12px',
          flex: 1,
          minHeight: '100px',
        }}>
          <div style={{ color: '#6b7280', fontSize: '11px', marginBottom: '6px', fontWeight: 'bold' }}>战斗记录</div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
            fontSize: '11px',
            maxHeight: '150px',
            overflowY: 'auto',
          }}>
            {battleLog.map((log, index) => (
              <div key={index} style={{
                color: log.includes('暴击') ? '#fbbf24' : log.includes('闪避') ? '#60a5fa' : log.includes('胜利') ? '#4ade80' : log.includes('击败') ? '#ef4444' : '#9ca3af'
              }}>
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* 战斗结束按钮 */}
        {phase === 'victory' && (
          <div style={{
            backgroundColor: '#065f46',
            borderRadius: '10px',
            padding: '12px',
            margin: '0 12px 12px',
            textAlign: 'center',
          }}>
            <button
              onClick={() => {
                console.log('确认按钮点击 - victory');
                console.log('onBattleEndRef.current:', onBattleEndRef.current);
                console.log('gainedExp:', gainedExp);
                onBattleEndRef.current(true, gainedExp);
              }}
              style={{
                padding: '10px 28px',
                backgroundColor: '#16a34a',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
              }}
            >
              确认
            </button>
          </div>
        )}

        {phase === 'defeat' && (
          <div style={{
            backgroundColor: '#7f1d1d',
            borderRadius: '10px',
            padding: '12px',
            margin: '0 12px 12px',
            textAlign: 'center',
          }}>
            <button
              onClick={() => {
                console.log('确认按钮点击 - defeat');
                console.log('onBattleEndRef.current:', onBattleEndRef.current);
                onBattleEndRef.current(false, 0);
              }}
              style={{
                padding: '10px 28px',
                backgroundColor: '#dc2626',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
              }}
            >
              确认
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
