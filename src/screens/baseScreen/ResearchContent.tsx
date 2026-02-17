import { useState, useEffect } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { ResearchStatus } from '../../core/ResearchSystem';
import { getItemName } from './utils';
import { CenteredMessageToast, type MessageState } from './shared';
import { styles, colors } from './styles';

export function ResearchContent() {
  const { gameManager, saveGame, startResearch, cancelResearch } = useGameStore();
  const [message, setMessage] = useState<MessageState | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => forceUpdate(n => n + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const projects = gameManager.getResearchProjects();
  const activeResearch = gameManager.getActiveResearch();

  const getRemainingTime = (project: typeof projects[0]): number => {
    if (project.status !== ResearchStatus.IN_PROGRESS) return 0;
    return Math.max(0, Math.ceil(project.totalProgress - project.progress));
  };

  const formatTime = (seconds: number): string => {
    if (seconds <= 0) return '完成';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` : `${m}:${s.toString().padStart(2, '0')}`;
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleStartResearch = async (projectId: string) => {
    const result = startResearch(projectId);
    if (result.success) {
      showMessage(result.message, 'success');
      setSelectedProject(null);
    } else {
      showMessage(result.message, 'error');
    }
  };

  const handleCancelResearch = async (projectId: string) => {
    const result = cancelResearch(projectId);
    if (result.success) {
      showMessage(result.message, 'success');
      await saveGame();
      setSelectedProject(null);
    } else {
      showMessage(result.message, 'error');
    }
  };

  const techTrees = [
    { name: '采矿平台', icon: '⛏️', color: colors.mining, prefix: 'mining_' },
    { name: '芯片研发', icon: '💾', color: colors.chip, prefix: 'chip_' },
    { name: '基因工程', icon: '🧬', color: colors.gene, prefix: 'gene_' },
    { name: '机械飞升', icon: '🦾', color: colors.cybernetic, prefix: 'cybernetic_' },
  ];

  const getVisibleProjects = (prefix: string) => {
    const treeProjects = projects.filter(p => p.id.startsWith(prefix)).sort((a, b) => {
      const aLevel = parseInt(a.id.split('_lv')[1] || '1');
      const bLevel = parseInt(b.id.split('_lv')[1] || '1');
      return aLevel - bLevel;
    });

    for (let i = treeProjects.length - 1; i >= 0; i--) {
      const project = treeProjects[i];
      if (project.status === ResearchStatus.IN_PROGRESS || project.status === ResearchStatus.AVAILABLE) return [project];
    }
    for (let i = treeProjects.length - 1; i >= 0; i--) {
      if (treeProjects[i].status === ResearchStatus.COMPLETED) return [treeProjects[i]];
    }
    return [];
  };

  const selectedProjectData = selectedProject ? projects.find(p => p.id === selectedProject) : null;
  const selectedTree = selectedProjectData ? techTrees.find(t => selectedProjectData.id.startsWith(t.prefix)) : null;

  return (
    <div style={{ position: 'relative' }}>
      <CenteredMessageToast message={message} />

      {selectedProjectData && selectedTree && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setSelectedProject(null)}>
          <div style={{ background: 'linear-gradient(135deg, rgba(30, 30, 40, 0.98), rgba(20, 20, 30, 0.98))', borderRadius: 16, padding: 24, width: 320, maxWidth: '90%', border: `2px solid ${selectedTree.color}`, boxShadow: `0 0 30px ${selectedTree.color}40` }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
              <span onClick={() => setSelectedProject(null)} style={{ cursor: 'pointer', fontSize: 20, color: '#6b7280' }}>✕</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 50, height: 50, borderRadius: 12, background: `${selectedTree.color}30`, border: `2px solid ${selectedTree.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 24 }}>{selectedTree.icon}</span>
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{selectedProjectData.name}</div>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: selectedProjectData.status === ResearchStatus.COMPLETED ? '#10b98130' : selectedProjectData.status === ResearchStatus.IN_PROGRESS ? '#f59e0b30' : '#3b82f630', color: selectedProjectData.status === ResearchStatus.COMPLETED ? colors.success : selectedProjectData.status === ResearchStatus.IN_PROGRESS ? colors.warning : '#3b82f6' }}>
                  {selectedProjectData.status === ResearchStatus.COMPLETED ? '已完成' : selectedProjectData.status === ResearchStatus.IN_PROGRESS ? '研究中' : '可研究'}
                </span>
              </div>
            </div>

            <div style={{ ...styles.label, fontSize: 13, marginBottom: 16, lineHeight: 1.5 }}>{selectedProjectData.description}</div>

            {selectedProjectData.status === ResearchStatus.IN_PROGRESS && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ ...styles.label, fontSize: 12 }}>研究进度</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: selectedTree.color, fontSize: 12, fontWeight: 'bold' }}>{Math.round((selectedProjectData.progress / selectedProjectData.totalProgress) * 100)}%</span>
                    <span style={{ color: colors.warning, fontSize: 12, fontWeight: 'bold' }}>⏱️ {formatTime(getRemainingTime(selectedProjectData))}</span>
                  </div>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.round((selectedProjectData.progress / selectedProjectData.totalProgress) * 100)}%`, background: selectedTree.color, borderRadius: 3 }} />
                </div>
              </div>
            )}

            {selectedProjectData.status === ResearchStatus.AVAILABLE && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ ...styles.label, fontSize: 12, marginBottom: 8 }}>研究消耗</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <span style={{ background: 'rgba(251, 191, 36, 0.2)', padding: '4px 10px', borderRadius: 6, color: '#fbbf24', fontSize: 12 }}>💰 {selectedProjectData.cost.credits}</span>
                  {selectedProjectData.cost.materials.map((mat, i) => <span key={i} style={{ background: 'rgba(96, 165, 250, 0.2)', padding: '4px 10px', borderRadius: 6, color: '#60a5fa', fontSize: 12 }}>{getItemName(mat.itemId)} x{mat.count}</span>)}
                </div>
              </div>
            )}

            {selectedProjectData.status === ResearchStatus.COMPLETED && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ ...styles.label, fontSize: 12, marginBottom: 8 }}>研究效果</div>
                <div style={{ background: `${selectedTree.color}15`, padding: 10, borderRadius: 8 }}>
                  {selectedProjectData.effects.map((e, i) => <div key={i} style={{ color: selectedTree.color, fontSize: 12 }}>✨ {e.description}</div>)}
                </div>
              </div>
            )}

            {selectedProjectData.status === ResearchStatus.AVAILABLE && (
              <button onClick={() => handleStartResearch(selectedProjectData.id)} style={{ ...styles.primaryButton(selectedTree.color), padding: '12px', fontSize: 14 }}>开始研究</button>
            )}

            {selectedProjectData.status === ResearchStatus.IN_PROGRESS && (
              <button onClick={() => handleCancelResearch(selectedProjectData.id)} style={{ ...styles.dangerButton(), padding: '12px', fontSize: 14 }}>取消研究</button>
            )}
          </div>
        </div>
      )}

      <div style={styles.statsBox(colors.research)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
          <div>
            <span style={styles.label}>已完成: </span>
            <span style={{ color: colors.success, fontWeight: 'bold' }}>{gameManager.completedResearch.length}</span>
          </div>
          {activeResearch.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: colors.warning }}>⏱️</span>
              <span style={{ color: colors.warning, fontWeight: 'bold' }}>{formatTime(getRemainingTime(activeResearch[0]))}</span>
            </div>
          )}
        </div>
        {activeResearch.length > 0 && (
          <div style={{ marginTop: 8, fontSize: 11, ...styles.label }}>正在研究: <span style={{ color: colors.research }}>{activeResearch[0].name}</span></div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {techTrees.map(tree => {
          const visibleProjects = getVisibleProjects(tree.prefix);
          return (
            <div key={tree.name} style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: 14, padding: 14, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 20 }}>{tree.icon}</span>
                <span style={{ color: tree.color, fontWeight: 'bold', fontSize: 14 }}>{tree.name}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 24, justifyContent: 'center', padding: '10px 0' }}>
                {visibleProjects.length > 0 ? (
                  visibleProjects.map((project, index) => {
                    const remainingTime = getRemainingTime(project);
                    const levelNum = parseInt(project.id.split('_lv')[1] || '2');
                    let bgColor = 'rgba(255, 255, 255, 0.05)';
                    if (project.status === ResearchStatus.COMPLETED) bgColor = `${tree.color}35`;
                    else if (project.status === ResearchStatus.IN_PROGRESS) bgColor = `${tree.color}25`;
                    else if (project.status === ResearchStatus.AVAILABLE) bgColor = 'rgba(255, 255, 255, 0.1)';

                    return (
                      <div key={project.id} onClick={() => setSelectedProject(project.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', position: 'relative' }}>
                        <div style={{ width: 48, height: 48, borderRadius: 10, border: `2px solid ${tree.color}`, background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease', boxShadow: project.status === ResearchStatus.IN_PROGRESS ? `0 0 10px ${tree.color}50` : 'none' }}>
                          {project.status === ResearchStatus.COMPLETED ? <span style={{ fontSize: 18, color: tree.color }}>✓</span> : project.status === ResearchStatus.IN_PROGRESS ? <span style={{ fontSize: 9, color: colors.warning, fontWeight: 'bold' }}>{formatTime(remainingTime)}</span> : <span style={{ fontSize: 11, color: '#fff', fontWeight: 'bold' }}>Lv{levelNum}</span>}
                        </div>
                        <span style={{ fontSize: 9, color: project.status === ResearchStatus.COMPLETED ? tree.color : '#a1a1aa', marginTop: 4 }}>Lv.{levelNum}</span>
                      </div>
                    );
                  })
                ) : (
                  <span style={{ color: '#6b7280', fontSize: 11 }}>暂无研究</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
