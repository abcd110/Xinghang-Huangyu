import { useGameStore } from '../stores/gameStore';
import { useState, useEffect } from 'react';
import { AutoCollectMode, MODE_INFO, getCollectRobot, CollectRobot } from '../data/autoCollectTypes';
import 强化Img from '../assets/images/强化.png';
import 升华Img from '../assets/images/升华.png';
import 锻造所Img from '../assets/images/锻造所.png';
import 材料合成Img from '../assets/images/材料合成.png';
import 星骸解构Img from '../assets/images/星骸解构.png';
import 战甲档案Img from '../assets/images/战甲档案.png';
import 舰桥背景Img from '../assets/images/舰桥背景.jpg';

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
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const {
    gameManager,
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

  // 计算芯片加成后的生命值
  const chipStatBonus = gameManager.getChipStatBonus();
  const chipHp = chipStatBonus['生命'] || 0;
  const chipHpPercent = (chipStatBonus['生命%'] || 0) / 100;
  const finalMaxHp = Math.floor((player.totalMaxHp + chipHp) * (1 + chipHpPercent));
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

  // 使用 requestAnimationFrame 避免在 effect 中直接 setState
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  // 更新采集时长显示
  useEffect(() => {
    if (!isCollecting) {
      requestAnimationFrame(() => setCollectDuration('00:00'));
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
          backgroundImage: `url(${舰桥背景Img})`,
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
          padding: '12px 16px',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            {/* 玩家名字 */}
            <div
              onClick={handleRocketClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                userSelect: 'none',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: '20px',
                padding: '6px 12px'
              }}
            >
              <span style={{ fontSize: '16px' }}>🚀</span>
              <span style={{
                color: '#00d4ff',
                fontSize: '13px',
                fontWeight: 'bold',
                textShadow: '0 0 10px rgba(0, 212, 255, 0.5)'
              }}>
                {gameManager.playerName || '战甲档案'}
              </span>
              {rocketClickCount > 0 && (
                <span style={{
                  fontSize: '10px',
                  color: rocketClickCount >= 2 ? '#ef4444' : '#00d4ff',
                  marginLeft: '2px'
                }}>
                  ({rocketClickCount}/3)
                </span>
              )}
            </div>

            {/* 等级 + 经验条 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              borderRadius: '20px',
              padding: '6px 12px'
            }}>
              <span style={{
                color: '#00d4ff',
                fontSize: '13px',
                fontWeight: 'bold',
                textShadow: '0 0 10px rgba(0, 212, 255, 0.5)',
                whiteSpace: 'nowrap'
              }}>
                Lv.{player.level}
              </span>
              <div style={{
                width: '60px',
                height: '5px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${(player.exp / player.expToNext) * 100}%`,
                  background: 'linear-gradient(90deg, #00d4ff, #0099cc)',
                  borderRadius: '3px',
                  boxShadow: '0 0 10px rgba(0, 212, 255, 0.8)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <span style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '10px',
                fontFamily: 'monospace',
                whiteSpace: 'nowrap'
              }}>
                {player.exp}/{player.expToNext}
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
                fontSize: '13px',
                fontWeight: 'bold',
                textShadow: '0 0 5px rgba(0, 212, 255, 0.3)'
              }}>
                {gameManager.trainCoins || 0}
              </span>
            </div>
          </div>
        </header>

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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <ActionButton
              iconImage={强化Img}
              label="强化"
              color="#f43f5e"
              glowColor="rgba(244, 63, 94, 0.7)"
              onClick={() => onNavigate('equipment')}
              mounted={mounted}
              delay={50}
            />
            <ActionButton
              iconImage={升华Img}
              label="升华"
              color="#fbbf24"
              glowColor="rgba(251, 191, 36, 0.6)"
              onClick={() => onNavigate('sublimation')}
              mounted={mounted}
              delay={100}
            />
            <ActionButton
              iconImage={锻造所Img}
              label="锻造所"
              color="#f97316"
              glowColor="rgba(249, 115, 22, 0.6)"
              onClick={() => onNavigate('crafting')}
              mounted={mounted}
              delay={150}
            />
          </div>
          {/* 第二行 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '12px' }}>
            <ActionButton
              iconImage={材料合成Img}
              label="材料工程"
              color="#10b981"
              glowColor="rgba(16, 185, 129, 0.6)"
              onClick={() => onNavigate('synthesis')}
              mounted={mounted}
              delay={200}
            />
            <ActionButton
              iconImage={战甲档案Img}
              label="战甲档案"
              color="#60a5fa"
              glowColor="rgba(96, 165, 250, 0.6)"
              onClick={() => onNavigate('player')}
              mounted={mounted}
              delay={250}
            />
            <ActionButton
              iconImage={星骸解构Img}
              label="星骸解构"
              color="#94a3b8"
              glowColor="rgba(148, 163, 184, 0.7)"
              onClick={() => onNavigate('decompose')}
              mounted={mounted}
              delay={300}
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
            remainingDailyHours={gameManager.autoCollectSystem.getRemainingDailyHours()}
            energyEfficiency={gameManager.getEnergyCoreEfficiency()}
          />
        )}
      </div>
    </>
  );
}

// 新状态卡片组件 - 垂直布局
function StatusCard({ label, value, max, color, icon }: {
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
      background: 'rgba(0, 0, 0, 0.5)',
      border: `1px solid ${displayColor}50`,
      borderRadius: '10px',
      padding: '10px 8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 顶部发光条 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '15%',
        right: '15%',
        height: '2px',
        background: `linear-gradient(90deg, transparent 0%, ${displayColor} 50%, transparent 100%)`,
        opacity: 0.8
      }} />

      {/* 图标和标签 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '11px'
      }}>
        <span style={{ color: displayColor, fontSize: '12px' }}>{icon}</span>
        <span style={{ color: displayColor, fontWeight: 'bold' }}>{label}</span>
      </div>

      {/* 数值 */}
      <div style={{
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: 'bold',
        fontFamily: 'monospace',
        letterSpacing: '1px'
      }}>
        {value}<span style={{ color: '#71717a', fontSize: '11px' }}>/{max}</span>
      </div>

      {/* 进度条 */}
      <div style={{
        height: '4px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '2px',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${ratio * 100}%`,
          background: `linear-gradient(90deg, ${displayColor}80, ${displayColor})`,
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

  // 计算收益预估
  const calculateEstimatedRewards = () => {
    if (!robot || !isCollecting) return null;

    // 解析时长字符串 "HH:MM:SS" 或 "MM:SS"
    const parts = duration.split(':').map(Number);
    let hours = 0;
    if (parts.length === 3) {
      hours = parts[0] + parts[1] / 60 + parts[2] / 3600;
    } else if (parts.length === 2) {
      hours = parts[0] / 60 + parts[1] / 3600;
    }

    const base = robot.baseRewards;
    let goldRate = base.gold;
    let expRate = base.exp;
    let materialRate = base.materialsPerHour;
    let stoneRate = base.enhanceStonesPerHour;

    // 根据模式调整收益
    switch (mode) {
      case AutoCollectMode.GATHER:
        goldRate *= 1.5;
        materialRate *= 1.5;
        break;
      case AutoCollectMode.COMBAT:
        expRate *= 1.5;
        stoneRate *= 1.5;
        break;
      case AutoCollectMode.BALANCED:
        goldRate *= 1.2;
        expRate *= 1.2;
        materialRate *= 1.2;
        stoneRate *= 1.2;
        break;
    }

    return {
      gold: Math.floor(goldRate * hours),
      exp: Math.floor(expRate * hours),
      materials: Math.floor(materialRate * hours),
      stones: Math.floor(stoneRate * hours),
    };
  };

  const estimated = calculateEstimatedRewards();

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
          {/* 时长 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <span style={{ color: '#a1a1aa', fontSize: '12px' }}>已采集时长</span>
            <span style={{
              color: '#00d4ff',
              fontSize: '20px',
              fontWeight: 'bold',
              fontFamily: 'monospace',
              textShadow: '0 0 10px rgba(0, 212, 255, 0.5)'
            }}>
              {duration}
            </span>
          </div>

          {/* 机器人和模式 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12px',
            marginBottom: '8px'
          }}>
            <span style={{ color: '#a1a1aa' }}>{robot?.icon} {robot?.name}</span>
            <span style={{ color: '#ffffff' }}>{modeInfo.icon} {modeInfo.name}</span>
          </div>

          {/* 收益预估 */}
          {estimated && (
            <div style={{
              borderTop: '1px solid rgba(0, 212, 255, 0.2)',
              paddingTop: '8px',
              marginTop: '8px'
            }}>
              <div style={{
                color: '#f59e0b',
                fontSize: '11px',
                marginBottom: '6px',
                fontWeight: 'bold'
              }}>
                📊 当前预估收益
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '4px',
                fontSize: '11px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#00d4ff', fontWeight: 'bold' }}>{estimated.gold}</div>
                  <div style={{ color: '#71717a', fontSize: '10px' }}>信用点</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#00d4ff', fontWeight: 'bold' }}>{estimated.exp}</div>
                  <div style={{ color: '#71717a', fontSize: '10px' }}>经验</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#00d4ff', fontWeight: 'bold' }}>{estimated.materials}</div>
                  <div style={{ color: '#71717a', fontSize: '10px' }}>材料</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#00d4ff', fontWeight: 'bold' }}>{estimated.stones}</div>
                  <div style={{ color: '#71717a', fontSize: '10px' }}>强化石</div>
                </div>
              </div>
            </div>
          )}
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
  glowColor,
  onClick,
  disabled = false,
  mounted,
  delay
}: {
  icon?: string;
  iconImage?: string;
  label: string;
  color: string;
  glowColor?: string;
  onClick: () => void;
  disabled?: boolean;
  mounted: boolean;
  delay: number;
}) {
  const actualGlowColor = glowColor || color + '60';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="action-button"
      style={{
        background: disabled
          ? 'rgba(20, 20, 30, 0.6)'
          : `linear-gradient(135deg, rgba(0,0,0,0.7) 0%, ${color}08 50%, rgba(0,0,0,0.7) 100%)`,
        border: `1px solid ${disabled ? 'rgba(100,100,100,0.2)' : color + '60'}`,
        borderRadius: '12px',
        padding: '10px 6px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '6px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: mounted ? (disabled ? 0.4 : 1) : 0,
        transform: mounted ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
        transition: `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms`,
        position: 'relative',
        overflow: 'hidden',
        minHeight: '95px',
        boxShadow: disabled
          ? 'inset 0 0 20px rgba(0,0,0,0.5)'
          : `0 0 20px ${color}20, inset 0 0 30px ${color}08`,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
          e.currentTarget.style.boxShadow = `0 8px 30px ${actualGlowColor}, 0 0 40px ${color}30, inset 0 0 20px ${color}15`;
          e.currentTarget.style.borderColor = color;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = disabled
          ? 'inset 0 0 20px rgba(0,0,0,0.5)'
          : `0 0 20px ${color}20, inset 0 0 30px ${color}08`;
        e.currentTarget.style.borderColor = disabled ? 'rgba(100,100,100,0.2)' : color + '60';
      }}
      onMouseDown={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
        }
      }}
      onMouseUp={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
        }
      }}
    >
      {/* 动态光效背景 */}
      {!disabled && (
        <div
          className="button-glow"
          style={{
            position: 'absolute',
            inset: '-50%',
            background: `radial-gradient(circle at 50% 50%, ${color}20 0%, transparent 60%)`,
            animation: 'pulse-glow 3s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* 顶部发光条 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '20%',
        right: '20%',
        height: '2px',
        background: disabled
          ? 'rgba(100,100,100,0.3)'
          : `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
        boxShadow: disabled ? 'none' : `0 0 10px ${color}, 0 0 20px ${color}`,
        animation: disabled ? 'none' : 'shimmer 2s ease-in-out infinite',
      }} />

      {/* 图标区域 */}
      <div style={{
        width: '54px',
        height: '54px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: disabled
          ? 'rgba(50,50,50,0.3)'
          : `radial-gradient(circle, ${color}20 0%, ${color}05 50%, transparent 70%)`,
        borderRadius: '12px',
        border: `1px solid ${disabled ? 'rgba(100,100,100,0.2)' : color + '50'}`,
        fontSize: '28px',
        filter: disabled ? 'grayscale(100%) brightness(0.5)' : 'none',
        marginTop: '4px',
        position: 'relative',
        boxShadow: disabled ? 'none' : `inset 0 0 15px ${color}15`,
      }}>
        {iconImage ? (
          <img
            src={iconImage}
            alt={label}
            style={{
              width: '85%',
              height: '85%',
              objectFit: 'contain',
              filter: disabled
                ? 'grayscale(100%) brightness(0.6)'
                : `drop-shadow(0 0 8px ${color}60) drop-shadow(0 0 16px ${color}40)`,
              transition: 'all 0.3s ease',
            }}
          />
        ) : (
          <span style={{
            filter: disabled ? 'none' : `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 12px ${color})`,
            transition: 'all 0.3s ease',
          }}>{icon}</span>
        )}
      </div>

      {/* 文字标签 */}
      <span style={{
        color: disabled ? '#555' : color,
        fontSize: '11px',
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: '1.2',
        textShadow: disabled ? 'none' : `0 0 8px ${color}60, 0 0 16px ${color}40`,
        letterSpacing: '0.5px',
        position: 'relative',
        zIndex: 1,
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
  remainingDailyHours,
  energyEfficiency,
}: {
  onClose: () => void;
  onStart: (locationId: string, mode: AutoCollectMode) => void;
  onClaimAndRestart: (locationId: string, newMode: AutoCollectMode) => void;
  isCollecting: boolean;
  currentMode: AutoCollectMode;
  availableLocations: import('../data/autoCollectTypes').CollectLocation[];
  playerLevel: number;
  remainingDailyHours: number;
  energyEfficiency: number;
}) {
  const [selectedLocation, setSelectedLocation] = useState(availableLocations[0]?.id || 'robot_lv1');
  const [selectedMode, setSelectedMode] = useState<AutoCollectMode>(currentMode || AutoCollectMode.BALANCED);

  const robot = getCollectRobot(selectedLocation);

  const handleModeChange = (mode: AutoCollectMode) => {
    if (isCollecting && mode !== selectedMode) {
      onClaimAndRestart(selectedLocation, mode);
    }
    setSelectedMode(mode);
  };

  // 计算每小时收益
  const calculateHourlyRewards = (robot: CollectRobot | null, mode: AutoCollectMode, energyBonus: number) => {
    if (!robot) return null;

    const base = robot.baseRewards;
    let goldRate = base.gold;
    let expRate = base.exp;
    let materialRate = base.materialsPerHour;
    let stoneRate = base.enhanceStonesPerHour;

    // 模式加成
    let modeBonus = '';
    switch (mode) {
      case AutoCollectMode.GATHER:
        goldRate *= 1.5;
        materialRate *= 1.5;
        modeBonus = '信用点+50%, 材料+50%';
        break;
      case AutoCollectMode.COMBAT:
        expRate *= 1.5;
        stoneRate *= 1.5;
        modeBonus = '经验+50%, 强化石+50%';
        break;
      case AutoCollectMode.BALANCED:
        goldRate *= 1.2;
        expRate *= 1.2;
        materialRate *= 1.2;
        stoneRate *= 1.2;
        modeBonus = '全属性+20%';
        break;
    }

    // 能源核心加成
    const energyMultiplier = 1 + energyBonus / 100;
    const energyBonusText = energyBonus > 0 ? `+${energyBonus}%` : null;

    return {
      gold: Math.round(goldRate * energyMultiplier),
      exp: Math.round(expRate * energyMultiplier),
      materials: Math.round(materialRate * energyMultiplier),
      stones: Math.round(stoneRate * energyMultiplier),
      modeBonus,
      energyBonus: energyBonusText
    };
  };

  const hourlyRewards = calculateHourlyRewards(robot, selectedMode, energyEfficiency);

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
        maxHeight: '85vh',
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
            ⚙️ 采集设置
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
                    <span style={{ fontSize: '24px' }}>{loc.icon}</span>
                    <div>
                      <div style={{ color: '#ffffff', fontSize: '14px', fontWeight: 'bold' }}>
                        {loc.name}
                      </div>
                      <div style={{ color: '#71717a', fontSize: '11px', marginTop: '2px' }}>
                        {loc.description}
                      </div>
                    </div>
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
                  <div style={{ color: selectedMode === mode ? '#00d4ff' : '#ffffff', fontSize: '12px', fontWeight: 'bold' }}>
                    {MODE_INFO[mode].name}
                  </div>
                </button>
              ))}
            </div>
            <div style={{
              marginTop: '8px',
              padding: '8px 12px',
              background: 'rgba(0, 212, 255, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(0, 212, 255, 0.2)'
            }}>
              <span style={{ color: '#00d4ff', fontSize: '12px' }}>
                {MODE_INFO[selectedMode].description}
              </span>
            </div>
          </div>

          {/* 采集效率信息 */}
          {hourlyRewards && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <div style={{
                color: '#10b981',
                fontSize: '13px',
                fontWeight: 'bold',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                📊 每小时采集效率
              </div>

              {/* 基础收益 */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
                marginBottom: '12px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#00d4ff', fontSize: '16px', fontWeight: 'bold' }}>{hourlyRewards.gold}</div>
                  <div style={{ color: '#71717a', fontSize: '10px' }}>信用点</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#00d4ff', fontSize: '16px', fontWeight: 'bold' }}>{hourlyRewards.exp}</div>
                  <div style={{ color: '#71717a', fontSize: '10px' }}>经验</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#00d4ff', fontSize: '16px', fontWeight: 'bold' }}>{hourlyRewards.materials}</div>
                  <div style={{ color: '#71717a', fontSize: '10px' }}>材料</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#00d4ff', fontSize: '16px', fontWeight: 'bold' }}>{hourlyRewards.stones}</div>
                  <div style={{ color: '#71717a', fontSize: '10px' }}>强化石</div>
                </div>
              </div>

              {/* 加成信息 */}
              <div style={{
                borderTop: '1px solid rgba(16, 185, 129, 0.2)',
                paddingTop: '10px'
              }}>
                <div style={{ marginBottom: '6px' }}>
                  <span style={{ color: '#f59e0b', fontSize: '11px' }}>🎯 模式加成: </span>
                  <span style={{ color: '#fbbf24', fontSize: '11px' }}>{hourlyRewards.modeBonus}</span>
                </div>
                {hourlyRewards.energyBonus && (
                  <div>
                    <span style={{ color: '#22c55e', fontSize: '11px' }}>⚡ 能源核心加成: </span>
                    <span style={{ color: '#4ade80', fontSize: '11px' }}>{hourlyRewards.energyBonus}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 今日剩余时间 */}
          <div style={{
            background: 'rgba(0, 212, 255, 0.1)',
            borderRadius: '12px',
            padding: '12px',
            marginBottom: '16px',
            border: '1px solid rgba(0, 212, 255, 0.3)'
          }}>
            <div style={{
              color: '#00d4ff',
              fontSize: '12px',
              fontWeight: 'bold',
              marginBottom: '4px'
            }}>
              ⏱️ 今日挂机时间
            </div>
            <div style={{ color: '#a1a1aa', fontSize: '12px' }}>
              剩余 {remainingDailyHours.toFixed(1)} 小时 / 每日上限 24 小时
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
            ▶️ {isCollecting ? '应用设置' : '开始自动采集'}
          </button>
        </div>
      </div>
    </div>
  );
}
