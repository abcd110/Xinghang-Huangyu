import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { RuinType, RUIN_TYPE_CONFIG, RUIN_DIFFICULTY_CONFIG, MAX_DAILY_ATTEMPTS, type Ruin, getRuinRewards } from '../../core/RuinSystem';
import { getItemName } from './utils';
import { MessageToast, type MessageState } from './shared';
import { styles, colors } from './styles';

interface RuinsContentProps {
  onStartRuinBattle?: (ruin: Ruin) => void;
}

// 获取副本类型的最大挑战次数
const getMaxAttempts = (type: RuinType): number => {
  return (type === RuinType.BASE_CORE || type === RuinType.RESEARCH_STAR) ? 3 : MAX_DAILY_ATTEMPTS;
};

export function RuinsContent({ onStartRuinBattle }: RuinsContentProps) {
  const { gameManager, saveGame, getRuins, getRuinRemainingAttempts, updateRuinBattleResult } = useGameStore();
  const [selectedRuinId, setSelectedRuinId] = useState<string | null>(null);
  const [message, setMessage] = useState<MessageState | null>(null);

  const ruins = getRuins();

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const startBattle = (ruin: Ruin) => {
    if (!onStartRuinBattle) return;
    onStartRuinBattle(ruin);
    setSelectedRuinId(null);
  };

  const doSweep = async (ruin: Ruin) => {
    if (ruin.completedCount === 0) {
      showMessage('首通必须手动挑战！', 'error');
      return;
    }

    const remaining = getRuinRemainingAttempts(ruin.type);
    if (remaining <= 0) {
      showMessage('今日挑战次数已用完！', 'error');
      return;
    }

    const ruinRewards = getRuinRewards(ruin);
    const rewards = {
      credits: ruinRewards.credits,
      items: ruinRewards.items.map(item => ({ ...item })),
    };

    // 给奖励
    gameManager.trainCoins += rewards.credits;
    rewards.items.forEach(item => {
      gameManager.inventory.addItem(item.itemId, item.count);
    });

    // 扫荡只增加完成次数和扣除挑战次数，不提升难度
    ruin.completedCount += 1;
    gameManager.dailyRuinAttempts[ruin.type] = (gameManager.dailyRuinAttempts[ruin.type] || 0) + 1;

    const rewardsText = `${rewards.credits}信用点${rewards.items.length > 0 ? ` + ${rewards.items.map(i => `${getItemName(i.itemId)}x${i.count}`).join(', ')}` : ''}`;
    showMessage(`扫荡成功！获得 ${rewardsText}`, 'success');

    await saveGame();
  };

  const handleRuinClick = (ruin: Ruin) => {
    const isAvailable = ruin.firstClear || getRuinRemainingAttempts(ruin.type) > 0;
    if (!isAvailable) return;
    
    // 如果点击的是已选中的副本，则取消选择
    if (selectedRuinId === ruin.id) {
      setSelectedRuinId(null);
    } else {
      setSelectedRuinId(ruin.id);
    }
  };

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <MessageToast message={message} />

      {/* 副本列表 - 占满剩余空间 */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {ruins.map(ruin => {
          const typeConfig = RUIN_TYPE_CONFIG[ruin.type];
          const difficultyConfig = RUIN_DIFFICULTY_CONFIG[ruin.currentDifficulty];
          const remaining = getRuinRemainingAttempts(ruin.type);
          const canSweep = !ruin.firstClear && remaining > 0;
          const maxAttempts = getMaxAttempts(ruin.type);
          const isAvailable = ruin.firstClear || remaining > 0;
          const isSelected = selectedRuinId === ruin.id;

          return (
            <div key={ruin.id}>
              {/* 副本卡片 */}
              <div
                onClick={() => handleRuinClick(ruin)}
                style={{
                  background: isSelected
                    ? `${typeConfig.color}20`
                    : isAvailable
                      ? 'rgba(255, 255, 255, 0.04)'
                      : 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '10px',
                  padding: '12px',
                  marginBottom: isSelected ? '0' : '8px',
                  border: `1px solid ${isSelected ? typeConfig.color : isAvailable ? 'rgba(255, 255, 255, 0.08)' : 'rgba(100, 100, 100, 0.2)'}`,
                  borderBottomLeftRadius: isSelected ? '0' : '10px',
                  borderBottomRightRadius: isSelected ? '0' : '10px',
                  cursor: isAvailable ? 'pointer' : 'not-allowed',
                  opacity: isAvailable ? 1 : 0.5,
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {/* 左侧：图标和名称 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: `${typeConfig.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      border: `1px solid ${typeConfig.color}40`,
                    }}>
                      {typeConfig.icon}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                        <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '13px' }}>{ruin.name}</span>
                        {ruin.completedCount === 0 ? (
                          <span style={{
                            background: `linear-gradient(135deg, ${colors.success}, #16a34a)`,
                            color: '#fff',
                            fontSize: '9px',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                          }}>首通</span>
                        ) : (
                          <span style={{
                            background: `linear-gradient(135deg, ${colors.ruins}, #ea580c)`,
                            color: '#fff',
                            fontSize: '9px',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                          }}>可扫荡</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                        <span style={{ color: difficultyConfig.color, fontWeight: 'bold' }}>{difficultyConfig.name}</span>
                        <span style={{ color: '#666' }}>•</span>
                        <span style={{ color: '#888' }}>已完成 {ruin.completedCount}次</span>
                      </div>
                    </div>
                  </div>

                  {/* 右侧：次数和扫荡按钮 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      textAlign: 'center',
                      padding: '6px 10px',
                      background: remaining > 0 ? `${colors.success}15` : 'rgba(100, 100, 100, 0.15)',
                      borderRadius: '8px',
                      border: `1px solid ${remaining > 0 ? `${colors.success}30` : 'rgba(100, 100, 100, 0.3)'}`,
                    }}>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: remaining > 0 ? colors.success : '#666',
                      }}>
                        {remaining}/{maxAttempts}
                      </div>
                      <div style={{ fontSize: '9px', color: '#888' }}>剩余</div>
                    </div>

                    {canSweep && (
                      <button
                        onClick={(e) => { e.stopPropagation(); doSweep(ruin); }}
                        style={{
                          padding: '8px 14px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          background: `linear-gradient(135deg, ${colors.ruins}, #ea580c)`,
                          border: 'none',
                          borderRadius: '8px',
                          color: '#fff',
                          cursor: 'pointer',
                          boxShadow: `0 2px 8px ${colors.ruins}40`,
                        }}
                      >
                        扫荡
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 详情区域 - 显示在选中副本下方 */}
              {isSelected && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.08), rgba(0, 0, 0, 0.2))',
                  borderRadius: '0 0 10px 10px',
                  padding: '14px',
                  marginBottom: '8px',
                  border: `1px solid ${typeConfig.color}40`,
                  borderTop: 'none',
                }}>
                  {/* 描述 */}
                  <div style={{ color: '#a1a1aa', fontSize: '12px', marginBottom: '12px', lineHeight: '1.5' }}>
                    {ruin.description}
                  </div>

                  {/* 统计信息 */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '10px',
                    marginBottom: '12px',
                  }}>
                    <div style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '8px',
                      padding: '10px',
                      textAlign: 'center',
                    }}>
                      <div style={{ color: colors.ruins, fontWeight: 'bold', fontSize: '15px' }}>{ruin.completedCount}</div>
                      <div style={{ color: '#888', fontSize: '10px' }}>已完成</div>
                    </div>
                    <div style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '8px',
                      padding: '10px',
                      textAlign: 'center',
                    }}>
                      <div style={{
                        color: ruin.firstClear || remaining > 0 ? colors.success : colors.error,
                        fontWeight: 'bold',
                        fontSize: '15px',
                      }}>
                        {ruin.firstClear ? '首通' : `${remaining}/${maxAttempts}`}
                      </div>
                      <div style={{ color: '#888', fontSize: '10px' }}>剩余次数</div>
                    </div>
                    <div style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '8px',
                      padding: '10px',
                      textAlign: 'center',
                    }}>
                      <div style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '15px' }}>
                        {getRuinRewards(ruin).experience}
                      </div>
                      <div style={{ color: '#888', fontSize: '10px' }}>经验</div>
                    </div>
                  </div>

                  {/* 奖励预览 */}
                  <div style={{
                    background: 'rgba(251, 191, 36, 0.08)',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '12px',
                    border: '1px solid rgba(251, 191, 36, 0.15)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '13px' }}>💰</span>
                      <span style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 'bold' }}>奖励预览</span>
                    </div>
                    <div style={{ color: '#fff', fontSize: '12px', lineHeight: '1.6' }}>
                      {(() => {
                        const ruinRewards = getRuinRewards(ruin);
                        return (
                          <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                              <span style={{ color: '#fbbf24' }}>💵</span>
                              <span>{ruinRewards.credits} 信用点</span>
                            </div>
                            {ruinRewards.items.length > 0 && (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {ruinRewards.items.map((item, idx) => (
                                  <span
                                    key={idx}
                                    style={{
                                      background: 'rgba(255, 255, 255, 0.1)',
                                      padding: '3px 10px',
                                      borderRadius: '4px',
                                      fontSize: '11px',
                                    }}
                                  >
                                    {getItemName(item.itemId)} x{item.count}
                                  </span>
                                ))}
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => startBattle(ruin)}
                      disabled={remaining <= 0}
                      style={{
                        ...styles.primaryButton(colors.ruins, remaining <= 0),
                        padding: '12px',
                        fontSize: '13px',
                        flex: 1,
                      }}
                    >
                      {ruin.completedCount === 0 ? '🎯 首次挑战' : '⚔️ 开始挑战'}
                    </button>
                    {ruin.completedCount > 0 && remaining > 0 && (
                      <button
                        onClick={() => doSweep(ruin)}
                        style={{
                          padding: '12px 20px',
                          fontSize: '13px',
                          fontWeight: 'bold',
                          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(234, 88, 12, 0.3))',
                          border: `1px solid ${colors.ruins}`,
                          borderRadius: '8px',
                          color: colors.ruins,
                          cursor: 'pointer',
                        }}
                      >
                        扫荡
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function LockedContent({ facility }: { facility: { name: string; icon: string; description: string } }) {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>{facility.icon}</div>
      <h3 style={{ color: '#6b7280', marginBottom: '8px' }}>{facility.name}</h3>
      <p style={{ color: '#71717a', fontSize: '14px', marginBottom: '16px' }}>{facility.description}</p>
      <div style={{ background: 'rgba(107, 114, 128, 0.2)', borderRadius: '12px', padding: '12px', color: '#a1a1aa', fontSize: '12px', border: '1px solid rgba(107, 114, 128, 0.3)' }}>🔒 该功能将在后续版本开放</div>
    </div>
  );
}
