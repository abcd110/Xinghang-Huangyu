import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { FacilityType } from '../../core/BaseFacilitySystem';
import { CommEvent, COMM_EVENT_CONFIG, getRemainingTime, formatRemainingTime, getMaxEvents, getRareEventChance } from '../../core/CommSystem';
import { getItemName } from './utils';
import { MessageToast, type MessageState } from './shared';
import { styles, colors } from './styles';

export function CommContent() {
  const { gameManager, saveGame, scanCommSignals, respondToCommEvent, ignoreCommEvent, getCommScanCooldown } = useGameStore();
  const [, setRefreshKey] = useState(0);
  const [message, setMessage] = useState<MessageState | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CommEvent | null>(null);

  const events = gameManager.getCommEvents();
  const level = gameManager.getFacilityLevel(FacilityType.COMM);
  const cooldown = getCommScanCooldown();

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleScan = async () => {
    const result = scanCommSignals();
    if (result.success) {
      showMessage(result.message, 'success');
      setRefreshKey(k => k + 1);
      await saveGame();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const handleRespond = async (eventId: string) => {
    const result = respondToCommEvent(eventId);
    if (result.success) {
      showMessage(`${result.message}${result.rewards ? `，获得: ${result.rewards}` : ''}`, 'success');
      setRefreshKey(k => k + 1);
      setSelectedEvent(null);
      await saveGame();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const handleIgnore = async (eventId: string) => {
    const result = ignoreCommEvent(eventId);
    if (result.success) {
      showMessage(result.message, 'success');
      setRefreshKey(k => k + 1);
      setSelectedEvent(null);
      await saveGame();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const formatCooldown = (ms: number): string => {
    const minutes = Math.ceil(ms / 60000);
    return minutes > 0 ? `${minutes}分钟` : '可用';
  };

  return (
    <div style={{ position: 'relative' }}>
      <MessageToast message={message} />

      <div style={styles.statsBox(colors.comm)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
          <div>
            <span style={styles.label}>信号容量: </span>
            <span style={{ color: colors.comm, fontWeight: 'bold' }}>{events.length}/{getMaxEvents(level)}</span>
          </div>
          <div>
            <span style={styles.label}>设施等级: </span>
            <span style={{ color: colors.comm, fontWeight: 'bold' }}>Lv.{level}</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
          <div>
            <span style={styles.label}>扫描冷却: </span>
            <span style={{ color: cooldown > 0 ? colors.warning : colors.success }}>{formatCooldown(cooldown)}</span>
          </div>
          <div>
            <span style={styles.label}>稀有事件率: </span>
            <span style={{ color: colors.success }}>+{getRareEventChance(level)}%</span>
          </div>
        </div>
      </div>

      {events.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px 20px', color: '#666' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📡</div>
          <div>暂无信号</div>
          <div style={{ fontSize: '12px', marginTop: '4px' }}>点击下方按钮扫描新信号</div>
        </div>
      ) : (
        <div style={{ marginBottom: '12px' }}>
          {events.map(event => {
            const eventConfig = COMM_EVENT_CONFIG[event.type];
            const remaining = getRemainingTime(event);
            const isSelected = selectedEvent?.id === event.id;

            return (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(isSelected ? null : event)}
                style={{
                  ...styles.cardBox(colors.comm, isSelected),
                  background: isSelected ? `${colors.comm}20` : `${colors.comm}10`,
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>{eventConfig.icon}</span>
                    <span style={{ color: eventConfig.color, fontWeight: 'bold' }}>{event.title}</span>
                  </div>
                  <span style={{ color: remaining < 600000 ? colors.error : colors.warning, fontSize: '11px' }}>
                    ⏱️ {formatRemainingTime(remaining)}
                  </span>
                </div>
                <div style={{ ...styles.label, fontSize: '12px', marginBottom: '4px' }}>{event.description}</div>

                {isSelected && (
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px', padding: '8px', marginBottom: '8px' }}>
                      <div style={{ color: colors.success, fontSize: '11px', marginBottom: '4px' }}>🎁 奖励:</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '11px' }}>
                        {event.rewards.credits && <span style={{ color: '#fbbf24' }}>💰 {event.rewards.credits}信用点</span>}
                        {event.rewards.items?.map((item, i) => <span key={i} style={{ color: '#60a5fa' }}>{getItemName(item.itemId)} x{item.count}</span>)}
                        {event.rewards.exp && <span style={{ color: colors.success }}>✨ {event.rewards.exp}经验</span>}
                      </div>
                      {event.requirements?.stamina && <div style={{ color: colors.warning, fontSize: '11px', marginTop: '4px' }}>⚡ 消耗: {event.requirements.stamina}体力</div>}
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={(e) => { e.stopPropagation(); handleRespond(event.id); }} style={{ ...styles.primaryButton(colors.comm), flex: 1, padding: '10px', fontSize: '12px' }}>响应</button>
                      <button onClick={(e) => { e.stopPropagation(); handleIgnore(event.id); }} style={{ ...styles.secondaryButton, flex: 1, padding: '10px', fontSize: '12px' }}>忽略</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={handleScan}
        disabled={cooldown > 0}
        style={{
          ...styles.primaryButton(colors.comm, cooldown > 0),
          background: cooldown > 0 ? 'rgba(100, 100, 100, 0.3)' : `linear-gradient(135deg, ${colors.comm}80, ${colors.comm}40)`,
          border: cooldown > 0 ? '1px solid rgba(100, 100, 100, 0.5)' : `1px solid ${colors.comm}80`,
        }}
      >
        {cooldown > 0 ? `🔄 冷却中 (${formatCooldown(cooldown)})` : '🔄 扫描新信号'}
      </button>
    </div>
  );
}
