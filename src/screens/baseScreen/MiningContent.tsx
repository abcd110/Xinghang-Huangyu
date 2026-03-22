import { useState, useEffect } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { MINERAL_CONFIG, getMiningProgress, getRemainingTime, formatMiningTime, getDepthBonusDescription, getCrewMiningBonus, getMiningEfficiencyBonus, getMiningSpeedBonus, getMiningDepthBonus, getMaxMiningSlots } from '../../core/MiningSystem';
import { MessageToast, useMessage, useForceUpdate } from './shared';
import { colors } from './styles';

function EnergyProgressBar({ progress, color, height = 6 }: { progress: number; color: string; height?: number }) {
  return (
    <div style={{
      height: `${height}px`,
      background: 'rgba(0, 20, 40, 0.9)',
      borderRadius: '4px',
      overflow: 'hidden',
      border: `1px solid ${color}30`,
      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.4)',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(0, 212, 255, 0.05) 8px, rgba(0, 212, 255, 0.05) 16px)',
      }} />
      <div style={{
        height: '100%',
        width: `${progress}%`,
        background: `linear-gradient(90deg, ${color}60 0%, ${color} 30%, ${color}cc 70%, ${color}60 100%)`,
        borderRadius: '4px',
        boxShadow: `0 0 15px ${color}80, inset 0 0 10px ${color}40`,
        transition: 'width 0.3s ease',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
          animation: 'energyFlow 2s linear infinite',
        }} />
      </div>
    </div>
  );
}

function DepthIndicator({ current, max, color }: { current: number; max: number; color: string }) {
  const percent = (current / max) * 100;
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        height: '50px',
        background: 'linear-gradient(180deg, rgba(0, 40, 60, 0.6) 0%, rgba(0, 20, 40, 0.9) 100%)',
        borderRadius: '8px',
        border: `1px solid ${color}30`,
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: `${percent}%`,
          background: `linear-gradient(180deg, ${color}40 0%, ${color}80 100%)`,
          transition: 'height 0.5s ease',
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: color,
            boxShadow: `0 0 10px ${color}`,
          }} />
        </div>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#fff',
          fontSize: '14px',
          fontWeight: 'bold',
          textShadow: '0 0 10px rgba(0, 0, 0, 0.8)',
          zIndex: 1,
        }}>
          {current}m
        </div>
        <div style={{
          position: 'absolute',
          top: '4px',
          right: '6px',
          color: '#71717a',
          fontSize: '10px',
        }}>
          MAX {max}m
        </div>
      </div>
    </div>
  );
}

function SciFiCard({ children, color, glowColor }: { children: React.ReactNode; color: string; glowColor?: string }) {
  return (
    <div style={{
      background: `linear-gradient(135deg, rgba(0, 30, 50, 0.95) 0%, rgba(0, 15, 35, 0.98) 100%)`,
      borderRadius: '16px',
      padding: '16px',
      marginBottom: '12px',
      border: `1px solid ${color}50`,
      boxShadow: `0 0 30px ${glowColor || color}15, inset 0 0 40px rgba(0, 212, 255, 0.02)`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 212, 255, 0.02) 2px, rgba(0, 212, 255, 0.02) 4px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '3px',
        height: '20px',
        background: color,
        boxShadow: `0 0 10px ${color}`,
      }} />
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '3px',
        height: '20px',
        background: color,
        boxShadow: `0 0 10px ${color}`,
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}

function MineralIcon({ icon, color, size = 28 }: { icon: string; color: string; size?: number }) {
  return (
    <div style={{
      fontSize: `${size}px`,
      filter: `drop-shadow(0 0 8px ${color}) drop-shadow(0 0 20px ${color}50)`,
      animation: 'mineralPulse 3s ease-in-out infinite',
    }}>
      {icon}
    </div>
  );
}

function HolographicButton({ children, color, onClick, disabled, style }: {
  children: React.ReactNode;
  color: string;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '12px 16px',
        background: disabled
          ? 'rgba(40, 40, 50, 0.6)'
          : `linear-gradient(135deg, ${color}20 0%, ${color}10 50%, ${color}05 100%)`,
        border: disabled ? '1px solid rgba(80, 80, 90, 0.4)' : `1px solid ${color}60`,
        borderRadius: '12px',
        color: disabled ? '#555' : color,
        fontWeight: 'bold',
        fontSize: '12px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: disabled ? 'none' : `0 0 20px ${color}30, inset 0 0 15px ${color}10`,
        textShadow: disabled ? 'none' : `0 0 10px ${color}`,
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {!disabled && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
          animation: 'buttonScan 3s linear infinite',
        }} />
      )}
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </button>
  );
}

function StatBadge({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      background: 'rgba(0, 20, 40, 0.6)',
      padding: '6px 10px',
      borderRadius: '8px',
      border: `1px solid ${color}30`,
    }}>
      <span style={{ color: '#71717a', fontSize: '11px' }}>{label}</span>
      <span style={{
        color: color,
        fontSize: '12px',
        fontWeight: 'bold',
        textShadow: `0 0 8px ${color}60`,
      }}>{value}</span>
    </div>
  );
}

export function MiningContent() {
  const { gameManager, saveGame, startMiningWithCrew, collectMining } = useGameStore();
  const { message, showMessage } = useMessage();
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [selectedCrew, setSelectedCrew] = useState<string[]>([]);
  const [showCrewSelect, setShowCrewSelect] = useState(false);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const timer = setInterval(() => forceUpdate(), 1000);
    return () => clearInterval(timer);
  }, [forceUpdate]);

  const sites = gameManager.getAvailableMiningSites();
  const tasks = gameManager.getMiningTasks();
  const crewMembers = gameManager.getCrewMembers();
  const level = gameManager.getMiningLevel();

  const handleStartMining = async (siteId: string) => {
    const result = startMiningWithCrew(siteId, selectedCrew);
    if (result.success) {
      showMessage(result.message, 'success');
      setSelectedSite(null);
      setSelectedCrew([]);
      setShowCrewSelect(false);
      await saveGame();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const handleCollect = async (siteId: string) => {
    const result = collectMining(siteId);
    if (result.success) {
      const depthInfo = result.depth ? ` (深度: ${result.depth}m)` : '';
      showMessage(`${result.message}${depthInfo}`, 'success');
      await saveGame();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const toggleCrewSelection = (crewId: string) => {
    if (selectedCrew.includes(crewId)) setSelectedCrew(selectedCrew.filter(id => id !== crewId));
    else if (selectedCrew.length < 4) setSelectedCrew([...selectedCrew, crewId]);
  };

  const isCrewAvailable = (crewId: string) => !tasks.some(t => t.assignedCrew.includes(crewId));
  const getTaskForSite = (siteId: string) => tasks.find(t => t.siteId === siteId);

  return (
    <div style={{ position: 'relative' }}>
      <MessageToast message={message} />

      <SciFiCard color={colors.mining} glowColor={colors.mining}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: `linear-gradient(135deg, ${colors.mining}30 0%, ${colors.mining}10 100%)`,
              border: `1px solid ${colors.mining}50`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 15px ${colors.mining}30`,
            }}>
              <span style={{ fontSize: '20px' }}>⛏️</span>
            </div>
            <div>
              <div style={{
                color: colors.mining,
                fontSize: '16px',
                fontWeight: 'bold',
                textShadow: `0 0 10px ${colors.mining}60`,
              }}>
                采矿控制台
              </div>
              <div style={{ color: '#71717a', fontSize: '11px' }}>MINING CONTROL SYSTEM</div>
            </div>
          </div>
          <div style={{
            background: `linear-gradient(135deg, ${colors.mining}20 0%, ${colors.mining}05 100%)`,
            border: `1px solid ${colors.mining}40`,
            borderRadius: '8px',
            padding: '8px 12px',
          }}>
            <div style={{ color: '#71717a', fontSize: '10px' }}>设施等级</div>
            <div style={{
              color: colors.mining,
              fontSize: '14px',
              fontWeight: 'bold',
              textShadow: `0 0 8px ${colors.mining}`,
            }}>
              Lv.{level}
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
        }}>
          <StatBadge label="采矿槽" value={`${tasks.length}/${getMaxMiningSlots(level)}`} color={colors.mining} />
          <StatBadge label="效率" value={`+${getMiningEfficiencyBonus(level)}%`} color={colors.success} />
          <StatBadge label="速度" value={`+${getMiningSpeedBonus(level)}%`} color={colors.success} />
          <StatBadge label="深度" value={`+${getMiningDepthBonus(level)}m`} color={colors.success} />
        </div>
      </SciFiCard>

      {tasks.length > 0 && (
        <div style={{ marginBottom: '14px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '10px',
          }}>
            <div style={{
              width: '4px',
              height: '16px',
              background: colors.mining,
              borderRadius: '2px',
              boxShadow: `0 0 10px ${colors.mining}`,
            }} />
            <span style={{
              color: colors.mining,
              fontSize: '14px',
              fontWeight: 'bold',
              textShadow: `0 0 8px ${colors.mining}60`,
            }}>
              ⛏️ 进行中的任务
            </span>
            <div style={{
              flex: 1,
              height: '1px',
              background: `linear-gradient(90deg, ${colors.mining}40 0%, transparent 100%)`,
            }} />
          </div>

          {tasks.map(task => {
            const site = sites.find(s => s.id === task.siteId);
            if (!site) return null;
            const mineralConfig = MINERAL_CONFIG[site.mineralType];
            const progress = getMiningProgress(task);
            const remaining = getRemainingTime(task);
            const depthBonus = getDepthBonusDescription(task.currentDepth || 0, site);
            const assignedCrewNames = (task.assignedCrew || []).map(id => crewMembers.find(c => c.id === id)?.name).filter(Boolean);

            return (
              <SciFiCard key={task.siteId} color={mineralConfig.color} glowColor={mineralConfig.color}>
                <div style={{ display: 'flex', gap: '14px' }}>
                  <div style={{
                    width: '60px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '12px',
                      background: `linear-gradient(135deg, ${mineralConfig.color}20 0%, ${mineralConfig.color}05 100%)`,
                      border: `1px solid ${mineralConfig.color}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 0 20px ${mineralConfig.color}20`,
                    }}>
                      <MineralIcon icon={mineralConfig.icon} color={mineralConfig.color} size={28} />
                    </div>
                    <DepthIndicator current={task.currentDepth || 0} max={site.maxDepth} color={colors.success} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div>
                        <span style={{
                          color: '#ffffff',
                          fontWeight: 'bold',
                          fontSize: '14px',
                          textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
                        }}>
                          {site.name}
                        </span>
                        <div style={{
                          color: mineralConfig.color,
                          fontSize: '11px',
                          textShadow: `0 0 8px ${mineralConfig.color}60`,
                        }}>
                          {mineralConfig.name}
                        </div>
                      </div>
                      <div style={{
                        background: `${colors.success}15`,
                        border: `1px solid ${colors.success}40`,
                        borderRadius: '6px',
                        padding: '4px 8px',
                      }}>
                        <span style={{ color: colors.success, fontSize: '10px' }}>{depthBonus}</span>
                      </div>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ color: '#71717a', fontSize: '11px' }}>采矿进度</span>
                        <span style={{
                          color: mineralConfig.color,
                          fontSize: '12px',
                          fontWeight: 'bold',
                          textShadow: `0 0 8px ${mineralConfig.color}60`,
                        }}>
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <EnergyProgressBar progress={progress} color={mineralConfig.color} height={8} />
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '6px',
                      }}>
                        <span style={{ color: '#71717a', fontSize: '10px' }}>剩余时间</span>
                        <span style={{
                          color: '#00d4ff',
                          fontSize: '11px',
                          textShadow: '0 0 8px rgba(0, 212, 255, 0.5)',
                        }}>
                          ⏱️ {formatMiningTime(remaining)}
                        </span>
                      </div>
                    </div>

                    {assignedCrewNames.length > 0 && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '10px',
                      }}>
                        <span style={{ color: '#71717a', fontSize: '10px' }}>派遣船员:</span>
                        {assignedCrewNames.map((name, i) => (
                          <span key={i} style={{
                            background: 'rgba(0, 212, 255, 0.1)',
                            border: '1px solid rgba(0, 212, 255, 0.3)',
                            borderRadius: '4px',
                            padding: '2px 6px',
                            color: '#00d4ff',
                            fontSize: '10px',
                          }}>
                            {name}
                          </span>
                        ))}
                      </div>
                    )}

                    <div>
                      {task.status === 'completed' ? (
                        <HolographicButton
                          color={colors.success}
                          onClick={() => handleCollect(task.siteId)}
                        >
                          ✓ 收集资源
                        </HolographicButton>
                      ) : (
                        <div style={{
                          padding: '12px',
                          background: 'rgba(0, 20, 40, 0.6)',
                          border: '1px solid rgba(0, 212, 255, 0.2)',
                          borderRadius: '12px',
                          color: '#00d4ff',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          textAlign: 'center',
                          textShadow: '0 0 10px rgba(0, 212, 255, 0.5)',
                        }}>
                          <span style={{
                            animation: 'pulse 1.5s ease-in-out infinite',
                            display: 'inline-block',
                          }}>⛏️</span> 采集中...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </SciFiCard>
            );
          })}
        </div>
      )}

      {showCrewSelect && selectedSite && (
        <div style={{
          position: 'absolute',
          top: '1%',
          left: 0,
          right: 0,
          height: '65%',
          background: 'rgba(0, 10, 20, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          zIndex: 50,
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          border: `1px solid ${colors.mining}40`,
          boxShadow: `0 0 30px ${colors.mining}20`,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '10px',
            flexShrink: 0,
          }}>
            <div style={{
              width: '4px',
              height: '14px',
              background: colors.mining,
              borderRadius: '2px',
              boxShadow: `0 0 10px ${colors.mining}`,
            }} />
            <span style={{
              color: colors.mining,
              fontWeight: 'bold',
              fontSize: '14px',
              textShadow: `0 0 10px ${colors.mining}60`,
            }}>
              选择派遣船员
            </span>
            <span style={{
              background: `${colors.mining}20`,
              border: `1px solid ${colors.mining}40`,
              borderRadius: '6px',
              padding: '2px 6px',
              color: colors.mining,
              fontSize: '11px',
            }}>
              {selectedCrew.length}/4
            </span>
          </div>

          <div style={{
            flex: '1 1 auto',
            overflowY: 'auto',
            marginBottom: '10px',
            minHeight: 0,
          }}>
            {crewMembers.slice(0, 6).map(crew => {
              const available = isCrewAvailable(crew.id);
              const selected = selectedCrew.includes(crew.id);
              const bonus = getCrewMiningBonus({ attack: crew.stats.attack, defense: crew.stats.defense, speed: crew.stats.speed });

              return (
                <div
                  key={crew.id}
                  onClick={() => available && toggleCrewSelection(crew.id)}
                  style={{
                    padding: '8px 10px',
                    background: selected
                      ? `linear-gradient(135deg, ${colors.mining}20 0%, ${colors.mining}05 100%)`
                      : 'linear-gradient(135deg, rgba(0, 30, 50, 0.8) 0%, rgba(0, 15, 35, 0.9) 100%)',
                    borderRadius: '10px',
                    marginBottom: '6px',
                    border: `1px solid ${selected ? colors.mining : 'rgba(0, 212, 255, 0.2)'}`,
                    cursor: available ? 'pointer' : 'not-allowed',
                    opacity: available ? 1 : 0.5,
                    boxShadow: selected ? `0 0 15px ${colors.mining}30` : 'none',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {selected && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(245, 158, 11, 0.03) 2px, rgba(245, 158, 11, 0.03) 4px)',
                      pointerEvents: 'none',
                    }} />
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                    <div>
                      <div style={{
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        textShadow: '0 0 10px rgba(255, 255, 255, 0.2)',
                      }}>
                        {crew.name}
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '6px',
                        marginTop: '2px',
                      }}>
                        <span style={{ color: '#ef4444', fontSize: '9px' }}>攻:{crew.stats.attack}</span>
                        <span style={{ color: '#3b82f6', fontSize: '9px' }}>防:{crew.stats.defense}</span>
                        <span style={{ color: '#22c55e', fontSize: '9px' }}>速:{crew.stats.speed}</span>
                      </div>
                    </div>
                    <div style={{
                      background: `${colors.success}15`,
                      border: `1px solid ${colors.success}40`,
                      borderRadius: '5px',
                      padding: '3px 6px',
                    }}>
                      <span style={{
                        color: colors.success,
                        fontSize: '10px',
                        fontWeight: 'bold',
                        textShadow: `0 0 8px ${colors.success}60`,
                      }}>
                        +{bonus}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            display: 'flex',
            gap: '8px',
            flexShrink: 0,
            paddingTop: '8px',
            borderTop: '1px solid rgba(0, 212, 255, 0.15)',
          }}>
            <HolographicButton
              color="#71717a"
              onClick={() => { setShowCrewSelect(false); setSelectedSite(null); setSelectedCrew([]); }}
              style={{ background: 'rgba(40, 40, 50, 0.6)', padding: '10px 12px' }}
            >
              取消
            </HolographicButton>
            <HolographicButton
              color={colors.mining}
              onClick={() => selectedSite && handleStartMining(selectedSite)}
              style={{ padding: '10px 12px' }}
            >
              开始采矿
            </HolographicButton>
          </div>
        </div>
      )}

      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '10px',
        }}>
          <div style={{
            width: '4px',
            height: '16px',
            background: '#00d4ff',
            borderRadius: '2px',
            boxShadow: '0 0 10px #00d4ff',
          }} />
          <span style={{
            color: '#00d4ff',
            fontSize: '14px',
            fontWeight: 'bold',
            textShadow: '0 0 8px rgba(0, 212, 255, 0.6)',
          }}>
            🏔️ 可用采矿点
          </span>
          <div style={{
            flex: 1,
            height: '1px',
            background: 'linear-gradient(90deg, rgba(0, 212, 255, 0.4) 0%, transparent 100%)',
          }} />
        </div>

        {sites.filter(s => !getTaskForSite(s.id)).map(site => {
          const mineralConfig = MINERAL_CONFIG[site.mineralType];
          const isActive = !!getTaskForSite(site.id);

          return (
            <SciFiCard key={site.id} color={site.unlocked ? mineralConfig.color : '#555'} glowColor={site.unlocked ? mineralConfig.color : 'transparent'}>
              <div style={{ display: 'flex', gap: '14px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: site.unlocked
                    ? `linear-gradient(135deg, ${mineralConfig.color}20 0%, ${mineralConfig.color}05 100%)`
                    : 'rgba(40, 40, 50, 0.6)',
                  border: site.unlocked
                    ? `1px solid ${mineralConfig.color}40`
                    : '1px solid rgba(80, 80, 90, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: site.unlocked ? `0 0 20px ${mineralConfig.color}20` : 'none',
                  opacity: site.unlocked ? 1 : 0.6,
                }}>
                  <MineralIcon icon={mineralConfig.icon} color={site.unlocked ? mineralConfig.color : '#555'} size={26} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{
                      color: site.unlocked ? '#ffffff' : '#666',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      textShadow: site.unlocked ? '0 0 10px rgba(255, 255, 255, 0.3)' : 'none',
                    }}>
                      {site.name}
                    </span>
                    <span style={{
                      color: site.unlocked ? mineralConfig.color : '#555',
                      fontSize: '12px',
                      textShadow: site.unlocked ? `0 0 8px ${mineralConfig.color}60` : 'none',
                    }}>
                      {mineralConfig.name}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    marginBottom: '10px'
                  }}>
                    <div style={{
                      background: 'rgba(0, 20, 40, 0.6)',
                      border: '1px solid rgba(0, 212, 255, 0.2)',
                      borderRadius: '6px',
                      padding: '4px 8px',
                    }}>
                      <span style={{ color: '#71717a', fontSize: '10px' }}>产量 </span>
                      <span style={{ color: '#fff', fontSize: '11px' }}>{site.baseYield}/次</span>
                    </div>
                    <div style={{
                      background: 'rgba(0, 20, 40, 0.6)',
                      border: '1px solid rgba(0, 212, 255, 0.2)',
                      borderRadius: '6px',
                      padding: '4px 8px',
                    }}>
                      <span style={{ color: '#71717a', fontSize: '10px' }}>难度 </span>
                      <span style={{ color: '#f59e0b', fontSize: '11px' }}>{'⭐'.repeat(site.difficulty)}</span>
                    </div>
                    <div style={{
                      background: 'rgba(0, 20, 40, 0.6)',
                      border: '1px solid rgba(0, 212, 255, 0.2)',
                      borderRadius: '6px',
                      padding: '4px 8px',
                    }}>
                      <span style={{ color: '#71717a', fontSize: '10px' }}>深度 </span>
                      <span style={{ color: '#22c55e', fontSize: '11px' }}>{site.maxDepth}m</span>
                    </div>
                    <div style={{
                      background: 'rgba(0, 20, 40, 0.6)',
                      border: '1px solid rgba(0, 212, 255, 0.2)',
                      borderRadius: '6px',
                      padding: '4px 8px',
                    }}>
                      <span style={{ color: '#71717a', fontSize: '10px' }}>加成 </span>
                      <span style={{ color: '#00d4ff', fontSize: '11px' }}>+{(site.depthBonus * 100).toFixed(1)}%/m</span>
                    </div>
                  </div>

                  {site.unlocked ? (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <HolographicButton
                        color={mineralConfig.color}
                        onClick={() => { setSelectedSite(site.id); setShowCrewSelect(true); }}
                        disabled={isActive}
                        style={{ flex: 1 }}
                      >
                        👥 派遣船员
                      </HolographicButton>
                      <HolographicButton
                        color="#00d4ff"
                        onClick={() => handleStartMining(site.id)}
                        disabled={isActive}
                        style={{ flex: 1 }}
                      >
                        ⚡ 快速开始
                      </HolographicButton>
                    </div>
                  ) : (
                    <div style={{
                      background: 'rgba(40, 40, 50, 0.6)',
                      borderRadius: '12px',
                      padding: '12px',
                      textAlign: 'center',
                      color: '#666',
                      fontSize: '12px',
                      border: '1px solid rgba(80, 80, 90, 0.4)',
                    }}>
                      🔒 需要 Lv.{site.unlockCondition?.facilityLevel || '?'} 解锁
                    </div>
                  )}
                </div>
              </div>
            </SciFiCard>
          );
        })}
      </div>
    </div>
  );
}
