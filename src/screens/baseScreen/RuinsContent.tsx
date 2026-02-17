import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { RuinType, ExploreStatus, RUIN_TYPE_CONFIG, RUIN_DIFFICULTY_CONFIG, getRemainingExploreTime, formatExploreTime, calculateExploreSuccess } from '../../core/RuinSystem';
import { getItemName } from './utils';
import { MessageToast, type MessageState } from './shared';
import { styles, colors } from './styles';

export function RuinsContent() {
  const { gameManager, saveGame, getRuins, getExploreMissions, startExplore, completeExplore, cancelExplore } = useGameStore();
  const [activeTab, setActiveTab] = useState<'ruins' | 'missions'>('ruins');
  const [selectedRuin, setSelectedRuin] = useState<{ id: string; name: string; description: string; duration: number; difficulty: number; rewards: { credits: number; items: { itemId: string; count: number }[] } } | null>(null);
  const [selectedCrew, setSelectedCrew] = useState<string[]>([]);
  const [message, setMessage] = useState<MessageState | null>(null);

  const ruins = getRuins();
  const missions = getExploreMissions();
  const crewMembers = gameManager.getCrewMembers();

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleStartExplore = async () => {
    if (!selectedRuin) return;
    const result = startExplore(selectedRuin.id, selectedCrew);
    if (result.success) { showMessage('探索已开始', 'success'); setSelectedRuin(null); setSelectedCrew([]); await saveGame(); }
    else { showMessage(result.message, 'error'); }
  };

  const handleCompleteExplore = async (missionId: string) => {
    const result = completeExplore(missionId);
    if (result.success) {
      const rewardsText = result.rewards ? `获得 ${result.rewards.credits}信用点${result.rewards.items.length > 0 ? ' 和物品' : ''}` : '';
      showMessage(`${result.message} ${rewardsText}`, 'success');
      await saveGame();
    } else { showMessage(result.message, 'error'); }
  };

  const handleCancelExplore = async (missionId: string) => {
    const result = cancelExplore(missionId);
    if (result.success) { showMessage(result.message, 'success'); await saveGame(); }
    else { showMessage(result.message, 'error'); }
  };

  const toggleCrewSelection = (crewId: string) => {
    if (selectedCrew.includes(crewId)) setSelectedCrew(selectedCrew.filter(id => id !== crewId));
    else setSelectedCrew([...selectedCrew, crewId]);
  };

  const getCrewPower = () => selectedCrew.reduce((total, id) => {
    const crew = crewMembers.find(c => c.id === id);
    return total + (crew?.stats.attack || 0) + (crew?.stats.defense || 0);
  }, 0);

  const isCrewAvailable = (crewId: string) => !missions.some(m => m.status === 'ongoing' && m.crewIds.includes(crewId));

  return (
    <div style={{ position: 'relative' }}>
      <MessageToast message={message} />

      <div style={styles.statsBox(colors.ruins)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
          <div><span style={styles.label}>进行中: </span><span style={{ color: colors.ruins, fontWeight: 'bold' }}>{missions.filter(m => m.status === 'ongoing').length}</span></div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '10px' }}>
          <div><span style={styles.label}>可探索遗迹: </span><span style={{ color: colors.success }}>{ruins.length}个</span></div>
          <div><span style={styles.label}>芯片材料副本: </span><span style={{ color: '#06b6d4' }}>{ruins.filter(r => r.type === RuinType.CHIP_FACTORY || r.type === RuinType.NEURAL_NEXUS).length}个</span></div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button onClick={() => setActiveTab('ruins')} style={styles.tabButton(activeTab === 'ruins', colors.ruins)}>🏛️ 遗迹列表</button>
        <button onClick={() => setActiveTab('missions')} style={styles.tabButton(activeTab === 'missions', colors.ruins)}>⏱️ 探索任务</button>
      </div>

      {activeTab === 'ruins' && (
        <div>
          <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '12px' }}>
            {ruins.map(ruin => {
              const typeConfig = RUIN_TYPE_CONFIG[ruin.type];
              const difficultyConfig = RUIN_DIFFICULTY_CONFIG[ruin.difficulty];

              return (
                <div key={ruin.id} onClick={() => ruin.status === ExploreStatus.AVAILABLE && setSelectedRuin(ruin)} style={{ ...styles.cardBox(colors.ruins, selectedRuin?.id === ruin.id), padding: '12px', cursor: ruin.status === ExploreStatus.AVAILABLE ? 'pointer' : 'default', opacity: ruin.status === ExploreStatus.EXPLORING ? 0.6 : 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>{typeConfig.icon}</span>
                      <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '13px' }}>{ruin.name}</span>
                    </div>
                    <span style={{ color: difficultyConfig.color, fontSize: '11px' }}>{difficultyConfig.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ ...styles.label, fontSize: '11px' }}>{ruin.description.slice(0, 20)}...</div>
                    <div style={{ color: '#fbbf24', fontSize: '11px' }}>{ruin.status === ExploreStatus.EXPLORING ? '探索中' : `已完成${ruin.completedCount}次`}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedRuin && (
            <div style={{ padding: '12px', background: `${colors.ruins}15`, borderRadius: '12px', border: `1px solid ${colors.ruins}40` }}>
              <div style={{ color: colors.ruins, fontWeight: 'bold', marginBottom: '8px' }}>{selectedRuin.name}</div>
              <div style={{ ...styles.label, fontSize: '11px', marginBottom: '8px' }}>{selectedRuin.description}</div>
              <div style={{ ...styles.label, fontSize: '11px', marginBottom: '8px' }}>探索时长: {formatExploreTime(selectedRuin.duration)}</div>
              <div style={{ ...styles.label, fontSize: '11px', marginBottom: '12px' }}>奖励: {selectedRuin.rewards.credits}信用点 + {selectedRuin.rewards.items.map(i => `${getItemName(i.itemId)} x${i.count}`).join(', ')}</div>

              <div style={{ color: colors.ruins, fontSize: '12px', marginBottom: '8px' }}>选择船员 ({selectedCrew.length}/4)</div>
              <div style={{ maxHeight: '120px', overflowY: 'auto', marginBottom: '12px' }}>
                {crewMembers.slice(0, 8).map(crew => {
                  const available = isCrewAvailable(crew.id);
                  const selected = selectedCrew.includes(crew.id);

                  return (
                    <div key={crew.id} onClick={() => available && toggleCrewSelection(crew.id)} style={{ ...styles.cardBox(colors.ruins, selected), padding: '8px', cursor: available ? 'pointer' : 'not-allowed', opacity: available ? 1 : 0.5 }}>
                      <span style={{ color: '#fff', fontSize: '11px' }}>{crew.name}</span>
                      <span style={{ ...styles.label, fontSize: '10px' }}>攻:{crew.stats.attack} 防:{crew.stats.defense}</span>
                    </div>
                  );
                })}
              </div>

              {selectedCrew.length > 0 && <div style={{ ...styles.label, fontSize: '11px', marginBottom: '12px' }}>成功率: <span style={{ color: colors.success }}>{calculateExploreSuccess(getCrewPower(), selectedRuin.difficulty).toFixed(1)}%</span></div>}

              <button onClick={handleStartExplore} disabled={selectedCrew.length === 0} style={{ ...styles.primaryButton(colors.ruins, selectedCrew.length === 0), padding: '10px', fontSize: '12px' }}>开始探索</button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'missions' && (
        <div>
          {missions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 20px', color: '#666' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>⏱️</div>
              <div>暂无探索任务</div>
            </div>
          ) : (
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {missions.map(mission => {
                const ruin = ruins.find(r => r.id === mission.ruinId);
                const typeConfig = ruin ? RUIN_TYPE_CONFIG[ruin.type] : null;
                const remaining = getRemainingExploreTime(mission);
                const isComplete = remaining === 0;

                return (
                  <div key={mission.id} style={{ ...styles.cardBox('rgba(255,255,255,0.08)', false), padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px' }}>{typeConfig?.icon || '🏛️'}</span>
                        <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '13px' }}>{ruin?.name || '未知遗迹'}</span>
                      </div>
                      <span style={{ color: isComplete ? colors.success : colors.ruins, fontSize: '11px', fontWeight: 'bold' }}>{isComplete ? '已完成' : formatExploreTime(remaining)}</span>
                    </div>
                    <div style={{ ...styles.label, fontSize: '11px', marginBottom: '8px' }}>派遣船员: {mission.crewIds.length}人</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {isComplete ? (
                        <button onClick={() => handleCompleteExplore(mission.id)} style={{ ...styles.primaryButton(colors.success), flex: 1, padding: '8px', fontSize: '11px' }}>领取奖励</button>
                      ) : (
                        <button onClick={() => handleCancelExplore(mission.id)} style={{ ...styles.dangerButton(), flex: 1, padding: '8px', fontSize: '11px' }}>取消探索</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
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
