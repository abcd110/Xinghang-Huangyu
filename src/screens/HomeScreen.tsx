import { useGameStore } from '../stores/gameStore';
import { useState } from 'react';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { gameManager, rest, logs } = useGameStore();
  const player = gameManager.player;
  const train = gameManager.train;
  const [showAllLogs, setShowAllLogs] = useState(false);

  // 获取最近事件
  const recentLogs = showAllLogs ? (logs || []) : (logs || []).slice(0, 6);

  const handleRest = () => {
    const result = rest();
    if (!result.success) {
      alert(result.message);
    }
  };

  // 检查是否可以休息
  const canRest = player.hunger >= 20 && player.thirst >= 10;

  // 预警颜色
  const getWarningColor = (value: number, max: number) => {
    const ratio = value / max;
    if (ratio < 0.2) return '#ef4444';
    if (ratio < 0.4) return '#fb923c';
    return '#ffffff';
  };

  return (
    <div style={{
      height: '100vh',
      backgroundColor: '#1a1a1a',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* 顶部信息栏 */}
      <div style={{
        flexShrink: 0,
        backgroundColor: '#2d2d2d',
        borderBottom: '1px solid #4b5563',
        padding: '12px 16px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* 最左边：幸存者 */}
          <h1 style={{
            color: '#fbbf24',
            fontSize: '18px',
            fontWeight: 'bold',
            margin: 0
          }}>
            🚂 {gameManager.playerName || '幸存者'}
          </h1>

          {/* 中间：等级|第X天 XX:XX */}
          <p style={{
            color: '#9ca3af',
            fontSize: '14px',
            margin: 0
          }}>
            等级{player.level} | {(() => {
              const minutesInDay = 24 * 60;
              const dayTime = gameManager.gameTime % minutesInDay;
              const day = Math.floor(gameManager.gameTime / minutesInDay) + 1;
              const hours = Math.floor(dayTime / 60);
              const minutes = dayTime % 60;
              return `第${day}天 ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            })()}
          </p>

          {/* 右边：列车币 */}
          <span style={{
            color: '#fbbf24',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            💰 列车币{gameManager.trainCoins || 0}
          </span>
        </div>
      </div>

      {/* 状态栏 - 两行显示 */}
      <div style={{
        flexShrink: 0,
        backgroundColor: '#1f2937',
        borderBottom: '1px solid #374151',
        padding: '10px 16px'
      }}>
        {/* 第一行：生命、体力、精神 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          fontSize: '13px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#ef4444' }}>❤️ 生命 </span>
            <span style={{ color: getWarningColor(player.hp, player.totalMaxHp), fontWeight: 'bold' }}>
              {player.hp}/{player.totalMaxHp}
            </span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#fbbf24' }}>⚡ 体力 </span>
            <span style={{ color: getWarningColor(player.stamina, player.maxStamina), fontWeight: 'bold' }}>
              {player.stamina}/{player.maxStamina}
            </span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#60a5fa' }}>🧠 精神 </span>
            <span style={{ color: getWarningColor(player.spirit, player.maxSpirit), fontWeight: 'bold' }}>
              {player.spirit}/{player.maxSpirit}
            </span>
          </div>
        </div>
        {/* 第二行：饥饿、口渴、耐久 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          fontSize: '13px',
          marginTop: '8px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#fb923c' }}>🍞 饥饿 </span>
            <span style={{ color: '#ffffff', fontWeight: 'bold' }}>{player.hunger}</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#60a5fa' }}>💧 口渴 </span>
            <span style={{ color: '#ffffff', fontWeight: 'bold' }}>{player.thirst}</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span>🚂 耐久 </span>
            <span style={{ color: '#ffffff', fontWeight: 'bold' }}>{train.durability}</span>
          </div>
        </div>
      </div>

      {/* 核心操作区 */}
      <div style={{
        flexShrink: 0,
        padding: '16px',
        borderBottom: '1px solid #374151'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          <ActionButton
            icon="🗺️"
            label="探索"
            color="#166534"
            onClick={() => onNavigate('exploration')}
          />
          <ActionButton
            icon="🛌"
            label={canRest ? "休息" : "饥饿/口渴不足"}
            color={canRest ? "#1e40af" : "#4b5563"}
            onClick={handleRest}
            disabled={!canRest}
          />
          <ActionButton
            icon="⚔️"
            label="强化"
            color="#7c3aed"
            onClick={() => onNavigate('equipment')}
          />
          <ActionButton
            icon="🔨"
            label="制造"
            color="#92400e"
            onClick={() => onNavigate('crafting')}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '12px' }}>
          <ActionButton
            icon="📦"
            label="分解"
            color="#374151"
            onClick={() => onNavigate('decompose')}
          />
          <ActionButton
            icon="📖"
            label="技能"
            color="#374151"
            onClick={() => onNavigate('skills')}
          />
          <ActionButton
            icon="👤"
            label="属性"
            color="#374151"
            onClick={() => onNavigate('player')}
          />
          <ActionButton
            icon="🚂"
            label="列车"
            color="#374151"
            onClick={() => onNavigate('train')}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '12px' }}>
          <ActionButton
            icon="✨"
            label="升华"
            color="#9333ea"
            onClick={() => onNavigate('sublimation')}
          />
          <ActionButton
            icon="🛒"
            label="商店"
            color="#059669"
            onClick={() => onNavigate('shop')}
          />
          <ActionButton
            icon="🧪"
            label="测试"
            color="#dc2626"
            onClick={() => onNavigate('test')}
          />
          <div /> {/* 空占位 */}
        </div>
      </div>

      {/* 最近事件 - 可滚动 */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div style={{
          flexShrink: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          borderBottom: '1px solid #374151',
          backgroundColor: '#1f2937'
        }}>
          <h3 style={{ color: '#d1d5db', fontSize: '14px', fontWeight: 'bold', margin: 0 }}>
            📜 最近事件
          </h3>
          <button
            onClick={() => setShowAllLogs(!showAllLogs)}
            style={{
              color: '#6b7280',
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
          padding: '12px 16px'
        }}>
          {recentLogs.length === 0 ? (
            <p style={{ color: '#6b7280', fontSize: '12px', textAlign: 'center' }}>暂无事件</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {recentLogs.map((log, index) => (
                <LogItem key={index} log={log} isLatest={index === 0 && !showAllLogs} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 操作按钮组件
function ActionButton({
  icon,
  label,
  color,
  onClick,
  disabled = false
}: {
  icon: string;
  label: string;
  color: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: color,
        border: `1px solid ${color}`,
        borderRadius: '12px',
        padding: '16px 8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'transform 0.1s'
      }}
    >
      <span style={{ fontSize: '24px' }}>{icon}</span>
      <span style={{ color: 'white', fontSize: '13px', fontWeight: '500' }}>{label}</span>
    </button>
  );
}

// 日志项组件
function LogItem({ log, isLatest }: { log: string; isLatest: boolean }) {
  const getLogIcon = (logText: string) => {
    if (logText.includes('休息')) return '🛌';
    if (logText.includes('天气')) return '🌤️';
    if (logText.includes('装备')) return '🛠️';
    if (logText.includes('升华')) return '✨';
    if (logText.includes('任务')) return '📋';
    if (logText.includes('战斗')) return '⚔️';
    if (logText.includes('探索')) return '🗺️';
    if (logText.includes('物品')) return '📦';
    if (logText.includes('制造')) return '🔨';
    if (logText.includes('分解')) return '📦';
    if (logText.includes('技能')) return '📖';
    return '•';
  };

  const getLogColor = (logText: string) => {
    if (logText.includes('成功') || logText.includes('恢复')) return '#4ade80';
    if (logText.includes('失败')) return '#ef4444';
    if (logText.includes('升华')) return '#c084fc';
    if (logText.includes('任务')) return '#fbbf24';
    if (logText.includes('休息')) return '#60a5fa';
    return '#d1d5db';
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px',
      fontSize: '12px',
      padding: isLatest ? '8px' : '0',
      backgroundColor: isLatest ? 'rgba(217, 119, 6, 0.1)' : 'transparent',
      borderRadius: '6px'
    }}>
      <span style={{ color: '#6b7280' }}>{getLogIcon(log)}</span>
      <span style={{ color: getLogColor(log), lineHeight: '1.4' }}>{log}</span>
    </div>
  );
}
