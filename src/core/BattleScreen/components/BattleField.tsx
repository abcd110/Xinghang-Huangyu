import type { BattleUnit, StatusEffect, SummonedUnit, FloatingSkillName } from '../types';

interface BattleFieldProps {
  playerTeam: BattleUnit[];
  enemyTeam: BattleUnit[];
  statusEffects: StatusEffect[];
  summonedUnits: SummonedUnit[];
  floatingSkillNames: FloatingSkillName[];
}

export function BattleField({
  playerTeam,
  enemyTeam,
  statusEffects,
  summonedUnits,
  floatingSkillNames,
}: BattleFieldProps) {
  const renderUnitCard = (unit: BattleUnit, isCompact: boolean = false) => {
    if (!unit.isAlive && unit.name === '') {
      return (
        <div
          key={unit.id}
          style={{
            width: '100%',
            height: isCompact ? '45px' : '55px',
            backgroundColor: 'transparent',
          }}
        />
      );
    }

    const hpPercent = unit.maxHp > 0 ? (unit.hp / unit.maxHp) * 100 : 0;
    const hpColor = hpPercent > 50 ? '#22c55e' : hpPercent > 25 ? '#eab308' : '#ef4444';

    const unitEffects = statusEffects.filter(e => e.targetId === unit.id && e.remainingTime > 0);

    if (isCompact) {
      return (
        <div
          key={unit.id}
          style={{
            width: '100%',
            height: '45px',
            backgroundColor: unit.isAlive ? 'rgba(239, 68, 68, 0.15)' : 'rgba(50,50,50,0.3)',
            border: `1px solid ${unit.isAlive ? 'rgba(239, 68, 68, 0.3)' : 'transparent'}`,
            borderRadius: '8px',
            padding: '6px 10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            opacity: unit.isAlive ? 1 : 0.4,
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
          }}>
            {unitEffects.length > 0 && (
              <div style={{ display: 'flex', gap: '1px', flexShrink: 0 }}>
                {unitEffects.map(effect => (
                  <span
                    key={effect.id}
                    title={`${effect.type}: ${effect.remainingTime.toFixed(1)}秒`}
                    style={{ fontSize: '8px', opacity: 0.8 }}
                  >
                    {effect.type === 'burn' ? '🔥' :
                      effect.type === 'armorBreak' ? '💔' :
                        effect.type === 'stun' ? '💫' :
                          effect.type === 'attackReduce' ? '⬇️' : '⭐'}
                  </span>
                ))}
              </div>
            )}
            <div style={{
              fontSize: '12px',
              color: '#f87171',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textAlign: 'center',
            }}>
              {unit.name}
            </div>
          </div>
          {unit.isAlive && (
            <div style={{
              backgroundColor: '#2a2f3f',
              borderRadius: '3px',
              height: '4px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                backgroundColor: hpColor,
                transition: 'width 0.3s',
                width: `${hpPercent}%`,
              }} />
            </div>
          )}
          {unitEffects.length > 0 && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1px',
              justifyContent: 'center',
              marginTop: '2px',
              minHeight: '12px',
            }}>
              {unitEffects.map(effect => {
                const isNegative = ['burn', 'armorBreak', 'stun', 'attackReduce'].includes(effect.type);
                const stacks = effect.currentStacks || 1;
                const buffName = effect.type === 'burn' ? '灼烧' :
                  effect.type === 'armorBreak' ? '破甲' :
                    effect.type === 'stun' ? '眩晕' :
                      effect.type === 'attackReduce' ? '攻击↓' :
                        effect.type === 'speedBoost' ? '攻速↑' :
                          effect.type === 'attackBoost' ? '攻击↑' :
                            effect.type === 'vitality' ? '活力' :
                              effect.type === 'invincible' ? '无敌' : effect.type;
                const timeStr = effect.remainingTime === Infinity ? '' : ` ${effect.remainingTime.toFixed(0)}s`;
                return (
                  <span key={effect.id} style={{
                    fontSize: '8px',
                    padding: '0px 2px',
                    borderRadius: '2px',
                    backgroundColor: isNegative ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)',
                    color: isNegative ? '#fca5a5' : '#86efac',
                    border: `1px solid ${isNegative ? 'rgba(239, 68, 68, 0.5)' : 'rgba(34, 197, 94, 0.5)'}`,
                    whiteSpace: 'nowrap',
                  }}>
                    {buffName}{stacks > 1 ? `×${stacks}` : ''}{timeStr}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    const unitSummons = summonedUnits.filter(s => s.ownerId === unit.id && s.isAlive);

    return (
      <div
        key={unit.id}
        style={{
          width: '100%',
          height: '55px',
          backgroundColor: unit.isAlive ? 'rgba(0, 212, 255, 0.1)' : 'rgba(50,50,50,0.3)',
          border: `1px solid ${unit.isAlive ? 'rgba(0, 212, 255, 0.3)' : 'transparent'}`,
          borderRadius: '8px',
          padding: '6px 8px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          opacity: unit.isAlive ? 1 : 0.4,
          position: 'relative',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          width: '100%',
        }}>
          {unitSummons.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'row', gap: '2px', flexShrink: 0 }}>
              {unitSummons.map(summon => (
                <div
                  key={summon.id}
                  title={`${summon.name} 剩余${summon.remainingTime.toFixed(1)}秒`}
                  style={{
                    width: '4px',
                    height: '12px',
                    backgroundColor: 'rgba(100, 100, 100, 0.3)',
                    borderRadius: '1px',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: `${(summon.remainingTime / summon.duration) * 100}%`,
                    backgroundColor: summon.enhanced ? '#fbbf24' : '#60a5fa',
                    transition: 'height 0.1s',
                  }} />
                </div>
              ))}
            </div>
          )}
          <div style={{
            fontSize: '11px',
            color: '#60a5fa',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: '1.2',
            textAlign: 'center',
            flex: 1,
          }}>
            {unit.name}
          </div>
          {unitEffects.length > 0 && (
            <div style={{ display: 'flex', gap: '1px', flexShrink: 0 }}>
              {unitEffects.map(effect => (
                <span
                  key={effect.id}
                  title={`${effect.type}: ${effect.remainingTime.toFixed(1)}秒`}
                  style={{ fontSize: '8px', opacity: 0.8 }}
                >
                  {effect.type === 'burn' ? '🔥' :
                    effect.type === 'armorBreak' ? '💔' :
                      effect.type === 'stun' ? '💫' :
                        effect.type === 'attackReduce' ? '⬇️' :
                          effect.type === 'speedBoost' ? '⚡' :
                            effect.type === 'attackBoost' ? '⬆️' :
                              effect.type === 'vitality' ? '💚' :
                                effect.type === 'invincible' ? '🛡️' : '⭐'}
                </span>
              ))}
            </div>
          )}
        </div>
        {unit.isAlive ? (
          <>
            <div style={{
              backgroundColor: '#2a2f3f',
              borderRadius: '3px',
              height: '5px',
              overflow: 'hidden',
              position: 'relative',
            }}>
              <div style={{
                height: '100%',
                backgroundColor: hpColor,
                transition: 'width 0.3s',
                width: `${hpPercent}%`,
              }} />
              {unit.shield && unit.shield > 0 && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  height: '100%',
                  width: `${Math.min((unit.shield / (unit.maxHp * 0.5)) * 100, 50)}%`,
                  backgroundColor: '#3b82f6',
                  transition: 'width 0.3s',
                }} />
              )}
            </div>
            {unitEffects.length > 0 && (
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '2px',
                justifyContent: 'center',
                marginTop: '2px',
                minHeight: '16px',
              }}>
                {unitEffects.map(effect => {
                  const isNegative = ['burn', 'armorBreak', 'stun', 'attackReduce'].includes(effect.type);
                  const stacks = effect.currentStacks || 1;
                  const buffName = effect.type === 'burn' ? '灼烧' :
                    effect.type === 'armorBreak' ? '破甲' :
                      effect.type === 'stun' ? '眩晕' :
                        effect.type === 'attackReduce' ? '攻击↓' :
                          effect.type === 'speedBoost' ? '攻速↑' :
                            effect.type === 'attackBoost' ? '攻击↑' :
                              effect.type === 'vitality' ? '活力' :
                                effect.type === 'invincible' ? '无敌' : effect.type;
                  const timeStr = effect.remainingTime === Infinity ? '' : ` ${effect.remainingTime.toFixed(0)}s`;
                  return (
                    <span key={effect.id} style={{
                      fontSize: '9px',
                      padding: '1px 4px',
                      borderRadius: '3px',
                      backgroundColor: isNegative ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)',
                      color: isNegative ? '#fca5a5' : '#86efac',
                      border: `1px solid ${isNegative ? 'rgba(239, 68, 68, 0.5)' : 'rgba(34, 197, 94, 0.5)'}`,
                      whiteSpace: 'nowrap',
                    }}>
                      {buffName}{stacks > 1 ? `×${stacks}` : ''}{timeStr}
                    </span>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div style={{ fontSize: '11px', color: '#6b7280', textAlign: 'center', lineHeight: '1.2' }}>
            已阵亡
          </div>
        )}
        {floatingSkillNames.filter(s => s.unitId === unit.id).map(skill => (
          <div key={skill.id} style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#a855f7',
            fontSize: '12px',
            fontWeight: 'bold',
            textShadow: '0 0 8px rgba(168, 85, 247, 0.8)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            animation: 'skillNameFade 1.5s ease-out forwards',
            zIndex: 10,
          }}>
            {skill.skillName}
          </div>
        ))}
      </div>
    );
  };

  const enemyAliveCount = enemyTeam.filter(u => u.isAlive).length;
  const playerAliveCount = playerTeam.filter(u => u.isAlive).length;

  const aliveEnemies = enemyTeam.filter(u => u.isAlive);
  const enemyCards = aliveEnemies.map((unit, idx) => renderUnitCard(unit, true));

  const playerFrontRow = [0, 1, 2].map(index => {
    const unit = playerTeam[index] || { id: `player_${index}`, name: '', hp: 0, maxHp: 0, isPlayer: true, isAlive: false, index } as BattleUnit;
    return renderUnitCard(unit, false);
  });

  const playerBackRow = [3, 4, 5].map(index => {
    const unit = playerTeam[index] || { id: `player_${index}`, name: '', hp: 0, maxHp: 0, isPlayer: true, isAlive: false, index } as BattleUnit;
    return renderUnitCard(unit, false);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      <div style={{
        backgroundColor: 'rgba(20, 20, 30, 0.5)',
        borderRadius: '12px',
        padding: '12px',
        border: '1px solid rgba(239, 68, 68, 0.2)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '10px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f87171', fontSize: '13px', fontWeight: 'bold' }}>
            <span>👹</span>
            <span>敌方</span>
          </div>
          <div style={{ fontSize: '11px', color: '#9ca3af' }}>存活:{enemyAliveCount}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {enemyCards.length > 0 ? enemyCards : (
            <div style={{ gridColumn: 'span 3', textAlign: 'center', color: '#6b7280', fontSize: '12px', padding: '20px' }}>
              全部消灭
            </div>
          )}
        </div>
      </div>

      <div style={{
        backgroundColor: 'rgba(20, 20, 30, 0.5)',
        borderRadius: '12px',
        padding: '12px',
        border: '1px solid rgba(0, 212, 255, 0.2)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '10px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#60a5fa', fontSize: '13px', fontWeight: 'bold' }}>
            <span>⚔️</span>
            <span>我方</span>
          </div>
          <div style={{ fontSize: '11px', color: '#9ca3af' }}>存活:{playerAliveCount}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '8px' }}>
          {playerFrontRow}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {playerBackRow}
        </div>
      </div>
    </div>
  );
}
