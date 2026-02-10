import { useGameStore } from '../stores/gameStore';
import { useState, useEffect } from 'react';
import { AutoCollectMode, MODE_INFO, getCollectRobot } from '../data/autoCollectTypes';
import restPodImage from '../assets/images/休整.png';
import 探索背景Img from '../assets/images/探索背景.png';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

// 动画样式
const animationStyles = `
  @keyframes scan {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }
  @keyframes pulse-glow {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  @keyframes rotate-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes border-flow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes card-pulse {
    0%, 100% { box-shadow: 0 0 20px rgba(0,0,0,0.4); }
    50% { box-shadow: 0 0 40px rgba(0,0,0,0.6), 0 0 60px rgba(255,255,255,0.1); }
  }
  @keyframes text-glow {
    0%, 100% { text-shadow: 0 0 10px currentColor; }
    50% { text-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
  }
  @keyframes progress-flow {
    0% { background-position: 0% 0%; }
    100% { background-position: 100% 0%; }
  }
  @keyframes data-stream {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const {
    gameManager,
    rest,
    logs,
    startAutoCollect,
    stopAutoCollect,
    claimAutoCollectRewards,
    getAutoCollectState,
    getAutoCollectDuration,
    getAvailableCollectLocations,
    showToast,
  } = useGameStore();
  const player = gameManager.player;
  const [showAllLogs, setShowAllLogs] = useState(false);
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [collectDuration, setCollectDuration] = useState('00:00');
  const [mounted, setMounted] = useState(false);

  // 系统测试入口：点击🚀3次
  const [rocketClickCount, setRocketClickCount] = useState(0);
  const [rocketClickTimer, setRocketClickTimer] = useState<NodeJS.Timeout | null>(null);

  // 自动采集状态
  const autoCollectState = getAutoCollectState();
  const isCollecting = autoCollectState.isCollecting;

  useEffect(() => {
    setMounted(true);
  }, []);

  // 更新采集时长显示
  useEffect(() => {
    if (!isCollecting) {
      setCollectDuration('00:00');
      return;
    }

    const updateDuration = () => {
      setCollectDuration(getAutoCollectDuration());
    };

    updateDuration();
    const interval = setInterval(updateDuration, 1000);
    return () => clearInterval(interval);
  }, [isCollecting, getAutoCollectDuration]);

  // 处理开始采集
  const handleStartCollect = (locationId: string, mode: AutoCollectMode) => {
    const result = startAutoCollect(locationId, mode);
    if (result.success) {
      showToast('自动采集已开始', 'success');
    } else {
      showToast(result.message, 'error');
    }
    setShowCollectModal(false);
  };

  // 处理领取收益并重新开始
  const handleClaimAndRestart = (locationId: string, newMode: AutoCollectMode) => {
    const claimResult = claimAutoCollectRewards();
    if (claimResult.success && claimResult.rewards) {
      const rewards = claimResult.rewards;
      showToast(`模式切换！获得 ${rewards.gold} 信用点、${rewards.exp} 经验值`, 'success', 3000);
      if (rewards.materials.length > 0) {
        showToast(`材料：${rewards.materials.map(m => `${m.name}x${m.quantity}`).join('、')}`, 'info', 3000);
      }
      if (rewards.enhanceStones > 0) {
        showToast(`强化石x${rewards.enhanceStones}`, 'info', 3000);
      }
    }
    const startResult = startAutoCollect(locationId, newMode);
    if (startResult.success) {
      showToast(`已切换到${newMode === AutoCollectMode.GATHER ? '资源采集' : newMode === AutoCollectMode.COMBAT ? '战斗巡逻' : '平衡'}模式`, 'success');
    }
  };

  // 处理停止采集
  const handleStopCollect = () => {
    const result = stopAutoCollect();
    if (result.success) {
      if (result.rewards && (result.rewards.gold > 0 || result.rewards.exp > 0 || result.rewards.materials.length > 0 || result.rewards.enhanceStones > 0)) {
        const rewards = result.rewards;
        showToast(`采集完成！获得 ${rewards.gold} 信用点、${rewards.exp} 经验值`, 'success', 3000);
        if (rewards.materials.length > 0) {
          showToast(`材料：${rewards.materials.map(m => `${m.name}x${m.quantity}`).join('、')}`, 'info', 3000);
        }
        if (rewards.enhanceStones > 0) {
          showToast(`强化石x${rewards.enhanceStones}`, 'info', 3000);
        }
      } else {
        showToast('已停止采集，暂无收益', 'info');
      }
    } else {
      showToast(result.message, 'error');
    }
  };

  // 处理领取收益
  const handleClaimRewards = () => {
    const result = claimAutoCollectRewards();
    if (result.success) {
      if (result.rewards && (result.rewards.gold > 0 || result.rewards.exp > 0 || result.rewards.materials.length > 0 || result.rewards.enhanceStones > 0)) {
        const rewards = result.rewards;
        showToast(`领取成功！获得 ${rewards.gold} 信用点、${rewards.exp} 经验值`, 'success', 3000);
        if (rewards.materials.length > 0) {
          showToast(`材料：${rewards.materials.map(m => `${m.name}x${m.quantity}`).join('、')}`, 'info', 3000);
        }
        if (rewards.enhanceStones > 0) {
          showToast(`强化石x${rewards.enhanceStones}`, 'info', 3000);
        }
      } else {
        showToast('当前没有可领取的收益', 'warning');
      }
    } else {
      showToast(result.message, 'error');
    }
  };

  // 获取最近事件
  const recentLogs = showAllLogs ? (logs || []) : (logs || []).slice(0, 6);

  const handleRest = () => {
    const result = rest();
    if (!result.success) {
      alert(result.message);
    }
  };

  // 检查是否可以休整
  const canRest = player.hunger >= 10 && player.thirst >= 10;

  // 预警颜色
  const getWarningColor = (value: number, max: number) => {
    const ratio = value / max;
    if (ratio < 0.2) return '#ef4444';
    if (ratio < 0.4) return '#f59e0b';
    return '#00d4ff';
  };

  // 处理🚀点击
  const handleRocketClick = () => {
    const newCount = rocketClickCount + 1;
    setRocketClickCount(newCount);

    if (rocketClickTimer) {
      clearTimeout(rocketClickTimer);
    }

    const timer = setTimeout(() => {
      setRocketClickCount(0);
    }, 2000);
    setRocketClickTimer(timer);

    if (newCount >= 3) {
      setRocketClickCount(0);
      if (rocketClickTimer) clearTimeout(rocketClickTimer);
      onNavigate('test');
    }
  };

  // 计算时间
  const minutesInDay = 24 * 60;
  const dayTime = gameManager.gameTime % minutesInDay;
  const day = Math.floor(gameManager.gameTime / minutesInDay) + 1;
  const hours = Math.floor(dayTime / 60);
  const minutes = dayTime % 60;

  return (
    <>
      <style>{animationStyles}</style>
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* 背景层 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${探索背景Img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0
        }} />

        {/* 暗角效果 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.6) 100%)',
          zIndex: 1
        }} />

        {/* 网格叠加 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          zIndex: 1
        }} />

        {/* 顶部信息栏 */}
        <header style={{
          flexShrink: 0,
          padding: '16px 20px',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {/* 战甲档案 */}
            <div
              onClick={handleRocketClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <span style={{ fontSize: '20px' }}>🚀</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{
                  color: '#00d4ff',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  letterSpacing: '1px',
                  textShadow: '0 0 10px rgba(0, 212, 255, 0.5)'
                }}>
                  {gameManager.playerName || '战甲档案'}
                </span>
                <span style={{
                  color: 'rgba(0, 212, 255, 0.6)',
                  fontSize: '9px',
                  letterSpacing: '2px'
                }}>
                  PILOT PROFILE
                </span>
              </div>
              {rocketClickCount > 0 && (
                <span style={{
                  fontSize: '10px',
                  color: rocketClickCount >= 2 ? '#ef4444' : '#00d4ff',
                  marginLeft: '4px'
                }}>
                  ({rocketClickCount}/3)
                </span>
              )}
            </div>

            {/* 中间：等级|第X天 */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)'
            }}>
              <span style={{
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 'bold',
                letterSpacing: '2px'
              }}>
                Lv.{player.level} | 第{day}天
              </span>
              <span style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '14px',
                fontFamily: 'monospace',
                letterSpacing: '1px'
              }}>
                {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}
              </span>
            </div>

            {/* 信用点 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              borderRadius: '20px',
              padding: '6px 12px'
            }}>
              <span style={{ fontSize: '14px' }}>💎</span>
              <span style={{
                color: '#00d4ff',
                fontSize: '14px',
                fontWeight: 'bold',
                textShadow: '0 0 5px rgba(0, 212, 255, 0.3)'
              }}>
                {gameManager.trainCoins || 0}
              </span>
            </div>
          </div>
        </header>

        {/* 状态栏 */}
        <div style={{
          flexShrink: 0,
          padding: '12px 16px',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '8px'
          }}>
            <StatusBar
              label="生命"
              value={player.hp}
              max={player.totalMaxHp}
              color="#ef4444"
              icon="❤️"
            />
            <StatusBar
              label="体力"
              value={player.stamina}
              max={player.maxStamina}
              color="#00d4ff"
              icon="⚡"
            />
            <StatusBar
              label="神能"
              value={player.spirit}
              max={player.maxSpirit}
              color="#8b5cf6"
              icon="🧠"
            />
            <StatusBar
              label="能量"
              value={player.hunger}
              max={100}
              color="#fb923c"
              icon="🔋"
            />
            <StatusBar
              label="冷却"
              value={player.thirst}
              max={100}
              color="#60a5fa"
              icon="❄️"
            />
          </div>
        </div>

        {/* 自动采集面板 */}
        <AutoCollectPanel
          isCollecting={isCollecting}
          duration={collectDuration}
          robotId={autoCollectState.robotId}
          mode={autoCollectState.mode}
          onStart={() => setShowCollectModal(true)}
          onStop={handleStopCollect}
          onClaim={handleClaimRewards}
          onOpenSettings={() => setShowCollectModal(true)}
        />

        {/* 核心操作区 */}
        <div style={{
          flexShrink: 0,
          padding: '16px',
          position: 'relative',
          zIndex: 10
        }}>
          {/* 第一行 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            <ActionButton
              iconImage={restPodImage}
              label={canRest ? "休整" : "能量不足"}
              color="#3b82f6"
              onClick={handleRest}
              disabled={!canRest}
              mounted={mounted}
              delay={0}
            />
            <ActionButton
              icon="🔫"
              label="强化"
              color="#8b5cf6"
              onClick={() => onNavigate('equipment')}
              mounted={mounted}
              delay={50}
            />
            <ActionButton
              icon="✨"
              label="升华"
              color="#c084fc"
              onClick={() => onNavigate('sublimation')}
              mounted={mounted}
              delay={100}
            />
            <ActionButton
              icon="🔨"
              label="锻造所"
              color="#f59e0b"
              onClick={() => onNavigate('crafting')}
              mounted={mounted}
              delay={150}
            />
          </div>
          {/* 第二行 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '12px' }}>
            <ActionButton
              icon="⚗️"
              label="材料合成"
              color="#10b981"
              onClick={() => onNavigate('synthesis')}
              mounted={mounted}
              delay={200}
            />
            <ActionButton
              icon="⚗️"
              label="星骸解构"
              color="#6b7280"
              onClick={() => onNavigate('decompose')}
              mounted={mounted}
              delay={250}
            />
            <ActionButton
              icon="👤"
              label="战甲档案"
              color="#6b7280"
              onClick={() => onNavigate('player')}
              mounted={mounted}
              delay={300}
            />
            <ActionButton
              icon="🛒"
              label="星际商店"
              color="#10b981"
              onClick={() => onNavigate('shop')}
              mounted={mounted}
              delay={350}
            />
          </div>
        </div>

        {/* 航行日志 */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 10,
          margin: '0 16px 16px'
        }}>
          <div style={{
            flexShrink: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            borderRadius: '12px 12px 0 0',
            borderBottom: 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px' }}>📜</span>
              <span style={{
                color: '#00d4ff',
                fontSize: '14px',
                fontWeight: 'bold',
                letterSpacing: '2px'
              }}>
                航行日志
              </span>
            </div>
            <button
              onClick={() => setShowAllLogs(!showAllLogs)}
              style={{
                color: '#00d4ff',
                fontSize: '12px',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {showAllLogs ? '收起 ▲' : '更多 ▼'}
            </button>
          </div>

          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px 16px',
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            borderRadius: '0 0 12px 12px',
            borderTop: 'none'
          }}>
            {recentLogs.length === 0 ? (
              <p style={{ color: '#71717a', fontSize: '12px', textAlign: 'center' }}>暂无航行记录</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recentLogs.map((log, index) => (
                  <LogItem key={index} log={log} isLatest={index === 0 && !showAllLogs} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 采集设置弹窗 */}
        {showCollectModal && (
          <AutoCollectModal
            onClose={() => setShowCollectModal(false)}
            onStart={handleStartCollect}
            onClaimAndRestart={handleClaimAndRestart}
            isCollecting={isCollecting}
            currentMode={autoCollectState.mode}
            availableLocations={getAvailableCollectLocations()}
            playerLevel={player.level}
            defeatedBossCount={gameManager.autoCollectSystem.defeatedBosses.size}
            remainingDailyHours={gameManager.autoCollectSystem.getRemainingDailyHours()}
          />
        )}
      </div>
    </>
  );
}

// 状态条组件
function StatusBar({ label, value, max, color, icon }: {
  label: string;
  value: number;
  max: number;
  color: string;
  icon: string;
}) {
  const ratio = value / max;
  const displayColor = ratio < 0.2 ? '#ef4444' : ratio < 0.4 ? '#f59e0b' : color;

  return (
    <div style={{
      background: 'rgba(0, 0, 0, 0.4)',
      border: `1px solid ${displayColor}40`,
      borderRadius: '8px',
      padding: '8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11px'
      }}>
        <span style={{ color: displayColor }}>{icon} {label}</span>
        <span style={{ color: '#ffffff', fontWeight: 'bold' }}>
          {value}/{max}
        </span>
      </div>
      <div style={{
        height: '4px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '2px',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${ratio * 100}%`,
          background: displayColor,
          borderRadius: '2px',
          boxShadow: `0 0 8px ${displayColor}`,
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  );
}

// 自动采集面板
function AutoCollectPanel({
  isCollecting,
  duration,
  robotId,
  mode,
  onStart,
  onStop,
  onClaim,
  onOpenSettings,
}: {
  isCollecting: boolean;
  duration: string;
  robotId: string;
  mode: AutoCollectMode;
  onStart: () => void;
  onStop: () => void;
  onClaim: () => void;
  onOpenSettings: () => void;
}) {
  const robot = getCollectRobot(robotId);
  const modeInfo = MODE_INFO[mode];

  return (
    <div style={{
      flexShrink: 0,
      margin: '0 16px 16px',
      background: 'rgba(0, 0, 0, 0.4)',
      borderRadius: '16px',
      border: '1px solid rgba(0, 212, 255, 0.3)',
      padding: '16px',
      position: 'relative',
      zIndex: 10,
      boxShadow: '0 0 30px rgba(0, 212, 255, 0.2), inset 0 0 60px rgba(0,0,0,0.5)',
      animation: 'card-pulse 3s ease-in-out infinite'
    }}>
      {/* 动态边框 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: '16px',
        padding: '2px',
        backgroundImage: 'linear-gradient(90deg, #00d4ff, #0099cc, #00d4ff)',
        backgroundSize: '200% 100%',
        animation: 'border-flow 3s ease infinite',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude'
      }} />

      {/* 扫描线 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        borderRadius: '16px',
        pointerEvents: 'none'
      }}>
        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)',
          boxShadow: '0 0 10px #00d4ff',
          animation: 'scan 2s linear infinite'
        }} />
      </div>

      {/* 标题 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🚀</span>
          <span style={{
            color: '#00d4ff',
            fontSize: '14px',
            fontWeight: 'bold',
            letterSpacing: '2px',
            textShadow: '0 0 10px rgba(0, 212, 255, 0.5)'
          }}>
            自动采集系统
          </span>
          {isCollecting && (
            <span style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#10b981',
              borderRadius: '50%',
              boxShadow: '0 0 10px #10b981',
              animation: 'pulse-glow 2s infinite'
            }} />
          )}
        </div>
        {isCollecting && (
          <span style={{
            color: '#10b981',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            运行中
          </span>
        )}
      </div>

      {/* 状态显示 */}
      {isCollecting ? (
        <div style={{
          background: 'rgba(0, 212, 255, 0.1)',
          borderRadius: '12px',
          padding: '12px',
          marginBottom: '12px',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <span style={{ color: '#a1a1aa', fontSize: '12px' }}>已采集时长</span>
            <span style={{
              color: '#00d4ff',
              fontSize: '18px',
              fontWeight: 'bold',
              fontFamily: 'monospace',
              textShadow: '0 0 10px rgba(0, 212, 255, 0.5)'
            }}>
              {duration}
            </span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12px'
          }}>
            <span style={{ color: '#a1a1aa' }}>{robot?.icon} {robot?.name}</span>
            <span style={{ color: '#ffffff' }}>{modeInfo.icon} {modeInfo.name}</span>
          </div>
        </div>
      ) : (
        <div style={{
          background: 'rgba(55, 65, 81, 0.3)',
          borderRadius: '12px',
          padding: '12px',
          marginBottom: '12px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2
        }}>
          <span style={{ color: '#71717a', fontSize: '13px' }}>
            自动采集系统待机中
          </span>
        </div>
      )}

      {/* 操作按钮 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isCollecting ? 'repeat(3, 1fr)' : '1fr',
        gap: '8px',
        position: 'relative',
        zIndex: 2
      }}>
        {isCollecting ? (
          <>
            <button onClick={onClaim} style={actionButtonStyle('#10b981')}>
              📦 领取
            </button>
            <button onClick={onOpenSettings} style={actionButtonStyle('#00d4ff')}>
              ⚙️ 设置
            </button>
            <button onClick={onStop} style={actionButtonStyle('#ef4444')}>
              ⏹️ 停止
            </button>
          </>
        ) : (
          <button onClick={onStart} style={{
            ...actionButtonStyle('#00d4ff'),
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.4)'
          }}>
            ▶️ 开始自动采集
          </button>
        )}
      </div>
    </div>
  );
}

// 操作按钮样式
function actionButtonStyle(color: string) {
  return {
    background: `linear-gradient(135deg, ${color}80 0%, ${color}40 100%)`,
    border: `1px solid ${color}`,
    borderRadius: '8px',
    padding: '10px',
    color: 'white',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  } as React.CSSProperties;
}

// 操作按钮组件
function ActionButton({
  icon,
  iconImage,
  label,
  color,
  onClick,
  disabled = false,
  mounted,
  delay
}: {
  icon?: string;
  iconImage?: string;
  label: string;
  color: string;
  onClick: () => void;
  disabled?: boolean;
  mounted: boolean;
  delay: number;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: 'rgba(0, 0, 0, 0.4)',
        border: `1px solid ${disabled ? 'rgba(255,255,255,0.1)' : color + '60'}`,
        borderRadius: '12px',
        padding: '12px 8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: mounted ? (disabled ? 0.5 : 1) : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
        transition: `all 0.4s ease ${delay}ms`,
        position: 'relative',
        overflow: 'hidden',
        minHeight: '80px',
        boxShadow: `0 0 20px ${disabled ? 'transparent' : color + '20'}`
      }}
    >
      {/* 顶部发光条 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '10%',
        right: '10%',
        height: '2px',
        background: disabled ? 'transparent' : `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`
      }} />

      {/* 图标 */}
      <div style={{
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: iconImage ? 'transparent' : `${color}20`,
        borderRadius: '10px',
        border: iconImage ? 'none' : `1px solid ${color}50`,
        fontSize: '20px',
        filter: disabled ? 'grayscale(100%)' : 'none'
      }}>
        {iconImage ? (
          <img src={iconImage} alt={label} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        ) : (
          icon
        )}
      </div>

      <span style={{
        color: disabled ? '#71717a' : color,
        fontSize: '11px',
        fontWeight: 'bold',
        textAlign: 'center'
      }}>{label}</span>
    </button>
  );
}

// 日志项组件
function LogItem({ log, isLatest }: { log: string; isLatest: boolean }) {
  const getLogIcon = (logText: string) => {
    if (logText.includes('休息') || logText.includes('休整')) return '🛌';
    if (logText.includes('天气')) return '🌌';
    if (logText.includes('装备')) return '🔫';
    if (logText.includes('升华')) return '✨';
    if (logText.includes('任务')) return '📋';
    if (logText.includes('战斗')) return '⚔️';
    if (logText.includes('探索')) return '🪐';
    if (logText.includes('物品')) return '📦';
    if (logText.includes('制造')) return '🔨';
    if (logText.includes('分解')) return '📦';
    if (logText.includes('跃迁')) return '🚀';
    return '•';
  };

  const getLogColor = (logText: string) => {
    if (logText.includes('成功') || logText.includes('恢复')) return '#10b981';
    if (logText.includes('失败')) return '#ef4444';
    if (logText.includes('升华')) return '#c084fc';
    if (logText.includes('任务')) return '#00d4ff';
    if (logText.includes('休息') || logText.includes('休整')) return '#60a5fa';
    if (logText.includes('跃迁')) return '#00d4ff';
    return '#d1d5db';
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px',
      fontSize: '12px',
      padding: isLatest ? '8px 12px' : '4px 0',
      backgroundColor: isLatest ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
      borderRadius: '6px',
      border: isLatest ? '1px solid rgba(0, 212, 255, 0.3)' : 'none'
    }}>
      <span style={{ color: '#6b7280' }}>{getLogIcon(log)}</span>
      <span style={{ color: getLogColor(log), lineHeight: '1.4' }}>{log}</span>
    </div>
  );
}

// 采集设置弹窗
function AutoCollectModal({
  onClose,
  onStart,
  onClaimAndRestart,
  isCollecting,
  currentMode,
  availableLocations,
  playerLevel,
  defeatedBossCount,
  remainingDailyHours,
}: {
  onClose: () => void;
  onStart: (locationId: string, mode: AutoCollectMode) => void;
  onClaimAndRestart: (locationId: string, newMode: AutoCollectMode) => void;
  isCollecting: boolean;
  currentMode: AutoCollectMode;
  availableLocations: import('../data/autoCollectTypes').CollectLocation[];
  playerLevel: number;
  defeatedBossCount: number;
  remainingDailyHours: number;
}) {
  const [selectedLocation, setSelectedLocation] = useState(availableLocations[0]?.id || 'robot_lv1');
  const [selectedMode, setSelectedMode] = useState<AutoCollectMode>(currentMode || AutoCollectMode.BALANCED);

  const selectedLoc = availableLocations.find(loc => loc.id === selectedLocation);

  const handleModeChange = (mode: AutoCollectMode) => {
    if (isCollecting && mode !== selectedMode) {
      onClaimAndRestart(selectedLocation, mode);
    }
    setSelectedMode(mode);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div style={{
        background: 'rgba(0, 0, 0, 0.8)',
        borderRadius: '20px',
        border: '1px solid rgba(0, 212, 255, 0.4)',
        width: '100%',
        maxWidth: '400px',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 0 40px rgba(0, 212, 255, 0.3)'
      }}>
        {/* 标题 */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid rgba(0, 212, 255, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{
            color: '#00d4ff',
            fontSize: '18px',
            fontWeight: 'bold',
            letterSpacing: '2px'
          }}>
            🚀 采集设置
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#71717a',
              fontSize: '24px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>

        {/* 内容 */}
        <div style={{ padding: '20px' }}>
          {/* 机器人选择 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#a1a1aa',
              fontSize: '13px',
              marginBottom: '8px'
            }}>
              选择采集机器人
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {availableLocations.map(loc => (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc.id)}
                  style={{
                    background: selectedLocation === loc.id
                      ? 'rgba(0, 212, 255, 0.2)'
                      : 'rgba(255,255,255,0.05)',
                    border: selectedLocation === loc.id
                      ? '1px solid #00d4ff'
                      : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '12px',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>{loc.icon}</span>
                    <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: 'bold' }}>
                      {loc.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 模式选择 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#a1a1aa',
              fontSize: '13px',
              marginBottom: '8px'
            }}>
              选择采集模式
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {(Object.keys(MODE_INFO) as AutoCollectMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => handleModeChange(mode)}
                  style={{
                    background: selectedMode === mode
                      ? 'rgba(0, 212, 255, 0.2)'
                      : 'rgba(255,255,255,0.05)',
                    border: selectedMode === mode
                      ? '1px solid #00d4ff'
                      : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '10px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>{MODE_INFO[mode].icon}</div>
                  <div style={{ color: selectedMode === mode ? '#00d4ff' : '#ffffff', fontSize: '12px' }}>
                    {MODE_INFO[mode].name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 开始按钮 */}
          <button
            onClick={() => onStart(selectedLocation, selectedMode)}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(0, 212, 255, 0.4)'
            }}
          >
            ▶️ 开始自动采集
          </button>
        </div>
      </div>
    </div>
  );
}
