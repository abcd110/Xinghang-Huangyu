import { useState, useEffect } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { MINERAL_CONFIG, getMiningProgress, getRemainingTime, formatMiningTime, getDepthBonusDescription, getCrewMiningBonus, getMiningEfficiencyBonus, getMiningSpeedBonus, getMiningDepthBonus, getMaxMiningSlots } from '../../core/MiningSystem';
import { MessageToast, type MessageState } from './shared';
import { styles, colors } from './styles';

export function MiningContent() {
  const { gameManager, saveGame, startMiningWithCrew, collectMining } = useGameStore();
  const [message, setMessage] = useState<MessageState | null>(null);
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [selectedCrew, setSelectedCrew] = useState<string[]>([]);
  const [showCrewSelect, setShowCrewSelect] = useState(false);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => forceUpdate(n => n + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const sites = gameManager.getAvailableMiningSites();
  const tasks = gameManager.getMiningTasks();
  const crewMembers = gameManager.getCrewMembers();
  const level = gameManager.getMiningLevel();

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 2000);
  };

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

      <div style={styles.statsBox(colors.mining)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
          <div><span style={styles.label}>采矿槽: </span><span style={{ color: colors.mining, fontWeight: 'bold' }}>{tasks.length}/{getMaxMiningSlots(level)}</span></div>
          <div><span style={styles.label}>设施等级: </span><span style={{ color: colors.mining, fontWeight: 'bold' }}>Lv.{level}</span></div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '10px' }}>
          <div><span style={styles.label}>效率: </span><span style={{ color: colors.success }}>+{getMiningEfficiencyBonus(level)}%</span></div>
          <div><span style={styles.label}>速度: </span><span style={{ color: colors.success }}>+{getMiningSpeedBonus(level)}%</span></div>
          <div><span style={styles.label}>深度加成: </span><span style={{ color: colors.success }}>+{getMiningDepthBonus(level)}m</span></div>
        </div>
      </div>

      {tasks.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ color: colors.mining, fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>⛏️ 进行中的任务</div>
          {tasks.map(task => {
            const site = sites.find(s => s.id === task.siteId);
            if (!site) return null;
            const mineralConfig = MINERAL_CONFIG[site.mineralType];
            const progress = getMiningProgress(task);
            const remaining = getRemainingTime(task);
            const depthBonus = getDepthBonusDescription(task.currentDepth || 0, site);
            const assignedCrewNames = (task.assignedCrew || []).map(id => crewMembers.find(c => c.id === id)?.name).filter(Boolean);

            return (
              <div key={task.siteId} style={{ padding: '12px', background: `${colors.mining}20`, borderRadius: '12px', marginBottom: '8px', border: `1px solid ${colors.mining}40` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>{mineralConfig.icon}</span>
                    <span style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '13px' }}>{site.name}</span>
                  </div>
                  <span style={{ color: mineralConfig.color, fontSize: '11px' }}>{mineralConfig.name}</span>
                </div>

                <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ ...styles.label, fontSize: '10px' }}>深度: <span style={{ color: colors.success }}>{task.currentDepth || 0}m</span> / {site.maxDepth}m</div>
                  <div style={{ color: colors.success, fontSize: '10px' }}>{depthBonus}</div>
                </div>

                <div style={{ marginBottom: '8px' }}>
                  <div style={{ height: '3px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${((task.currentDepth || 0) / site.maxDepth) * 100}%`, background: `linear-gradient(90deg, ${colors.success}, #16a34a)`, borderRadius: '2px' }} />
                  </div>
                </div>

                <div style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ ...styles.label, fontSize: '10px' }}>进度</span>
                    <span style={{ color: colors.mining, fontSize: '10px' }}>{Math.round(progress)}%</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${mineralConfig.color}, ${colors.mining})`, borderRadius: '2px' }} />
                  </div>
                  <div style={{ ...styles.label, fontSize: '10px', marginTop: '4px' }}>剩余: {formatMiningTime(remaining)}</div>
                </div>

                {assignedCrewNames.length > 0 && <div style={{ marginBottom: '8px', ...styles.label, fontSize: '10px' }}>派遣船员: {assignedCrewNames.join('、')}</div>}

                <div style={{ display: 'flex', gap: '8px' }}>
                  {task.status === 'completed' ? (
                    <button onClick={() => handleCollect(task.siteId)} style={{ ...styles.primaryButton(colors.success), flex: 1, padding: '8px', fontSize: '11px' }}>✓ 收集资源</button>
                  ) : (
                    <div style={{ flex: 1, padding: '8px', background: 'rgba(100, 100, 100, 0.2)', border: '1px solid rgba(100, 100, 100, 0.4)', borderRadius: '6px', color: '#888', fontWeight: 'bold', fontSize: '11px', textAlign: 'center' }}>⛏️ 采集中...</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCrewSelect && selectedSite && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.8)', borderRadius: '12px', zIndex: 50, padding: '12px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: colors.mining, fontWeight: 'bold', marginBottom: '12px', fontSize: '14px' }}>选择派遣船员 ({selectedCrew.length}/4)</div>

          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '12px' }}>
            {crewMembers.slice(0, 8).map(crew => {
              const available = isCrewAvailable(crew.id);
              const selected = selectedCrew.includes(crew.id);
              const bonus = getCrewMiningBonus({ attack: crew.stats.attack, defense: crew.stats.defense, speed: crew.stats.speed });

              return (
                <div key={crew.id} onClick={() => available && toggleCrewSelection(crew.id)} style={{ ...styles.cardBox(colors.mining, selected), padding: '10px', cursor: available ? 'pointer' : 'not-allowed', opacity: available ? 1 : 0.5 }}>
                  <div>
                    <div style={{ color: '#fff', fontSize: '12px' }}>{crew.name}</div>
                    <div style={{ ...styles.label, fontSize: '10px' }}>攻:{crew.stats.attack} 防:{crew.stats.defense} 速:{crew.stats.speed}</div>
                  </div>
                  <div style={{ color: colors.success, fontSize: '11px' }}>+{bonus}%产量</div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => { setShowCrewSelect(false); setSelectedSite(null); setSelectedCrew([]); }} style={{ ...styles.secondaryButton, padding: '10px', fontSize: '12px' }}>取消</button>
            <button onClick={() => selectedSite && handleStartMining(selectedSite)} style={{ ...styles.primaryButton(colors.mining), padding: '10px', fontSize: '12px' }}>开始采矿</button>
          </div>
        </div>
      )}

      <div>
        <div style={{ ...styles.label, fontSize: '12px', marginBottom: '8px' }}>🏔️ 可用采矿点</div>
        {sites.filter(s => !getTaskForSite(s.id)).map(site => {
          const mineralConfig = MINERAL_CONFIG[site.mineralType];
          const isActive = !!getTaskForSite(site.id);

          return (
            <div key={site.id} style={{ ...styles.cardBox('rgba(255,255,255,0.08)', false), padding: '12px', background: site.unlocked ? 'rgba(255, 255, 255, 0.03)' : 'rgba(100, 100, 100, 0.1)', opacity: site.unlocked ? 1 : 0.6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>{mineralConfig.icon}</span>
                  <span style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '13px' }}>{site.name}</span>
                </div>
                <span style={{ color: mineralConfig.color, fontSize: '11px' }}>{mineralConfig.name}</span>
              </div>

              <div style={{ ...styles.label, fontSize: '11px', marginBottom: '4px' }}>基础产量: {site.baseYield}/次 | 难度: {'⭐'.repeat(site.difficulty)}</div>
              <div style={{ ...styles.label, fontSize: '11px', marginBottom: '8px' }}>最大深度: {site.maxDepth}m | 深度加成: +{(site.depthBonus * 100).toFixed(1)}%/m</div>

              {site.unlocked ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => { setSelectedSite(site.id); setShowCrewSelect(true); }} disabled={isActive} style={{ ...styles.primaryButton(mineralConfig.color, isActive), flex: 1, padding: '8px', fontSize: '11px' }}>{isActive ? '采矿中' : '派遣船员'}</button>
                  <button onClick={() => handleStartMining(site.id)} disabled={isActive} style={{ ...styles.secondaryButton, flex: 1, padding: '8px', fontSize: '11px', background: isActive ? 'rgba(100, 100, 100, 0.3)' : `${colors.mining}20`, color: isActive ? '#666' : colors.mining }}>{isActive ? '采矿中' : '快速开始'}</button>
                </div>
              ) : (
                <div style={{ background: 'rgba(100, 100, 100, 0.2)', borderRadius: '6px', padding: '8px', textAlign: 'center', color: '#666', fontSize: '11px' }}>🔒 需要 Lv.{site.unlockCondition?.facilityLevel || '?'} 解锁</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
