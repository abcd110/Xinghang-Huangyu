import { useState, useEffect } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { ResearchStatus } from '../../core/ResearchSystem';
import { getItemName } from './utils';
import { CenteredMessageToast, useMessage } from './shared';

const cyberStyles = {
  terminalContainer: {
    position: 'relative' as const,
    background: 'linear-gradient(180deg, rgba(10, 14, 39, 0.95) 0%, rgba(5, 8, 20, 0.98) 100%)',
    border: '1px solid rgba(0, 212, 255, 0.4)',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  scanlineOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0, 212, 255, 0.015) 1px, rgba(0, 212, 255, 0.015) 2px)',
    pointerEvents: 'none' as const,
    zIndex: 1,
  },
  headerBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    background: 'linear-gradient(90deg, rgba(0, 212, 255, 0.15) 0%, transparent 100%)',
    borderBottom: '1px solid rgba(0, 212, 255, 0.3)',
    position: 'relative' as const,
    zIndex: 3,
  },
  statusDot: (color: string) => ({
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: color,
    boxShadow: `0 0 10px ${color}`,
  }),
  headerTitle: {
    fontFamily: "'Courier New', monospace",
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#00d4ff',
    textTransform: 'uppercase' as const,
    letterSpacing: '2px',
    textShadow: '0 0 10px rgba(0, 212, 255, 0.5)',
  },
  headerStats: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: "'Courier New', monospace",
    fontSize: '11px',
  },
  bodyContent: {
    position: 'relative' as const,
    zIndex: 3,
    padding: '16px',
  },
  techTreeSection: {
    marginBottom: '16px',
  },
  techTreeHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
    padding: '8px 12px',
    background: 'rgba(0, 0, 0, 0.3)',
    borderLeft: '3px solid',
    borderRadius: '0 4px 4px 0',
  },
  techTreeIcon: {
    fontSize: '18px',
  },
  techTreeName: {
    fontFamily: "'Courier New', monospace",
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
  },
  projectGrid: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '4px',
    overflowX: 'auto' as const,
  },
  projectNode: (status: ResearchStatus, color: string) => ({
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '6px',
    padding: '10px',
    minWidth: '70px',
    background: status === ResearchStatus.COMPLETED 
      ? `linear-gradient(135deg, ${color}20, ${color}10)` 
      : status === ResearchStatus.IN_PROGRESS 
        ? `linear-gradient(135deg, ${color}15, transparent)`
        : 'rgba(255, 255, 255, 0.03)',
    border: `1px solid ${status === ResearchStatus.COMPLETED ? color : status === ResearchStatus.IN_PROGRESS ? color : 'rgba(255, 255, 255, 0.1)'}`,
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  }),
  projectLevel: {
    fontFamily: "'Courier New', monospace",
    fontSize: '10px',
    color: '#6b7280',
    textTransform: 'uppercase' as const,
  },
  projectStatus: (color: string) => ({
    fontFamily: "'Courier New', monospace",
    fontSize: '9px',
    color: color,
    fontWeight: 'bold',
  }),
  progressBar: (color: string) => ({
    position: 'relative' as const,
    width: '100%',
    height: '4px',
    background: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '2px',
    overflow: 'hidden',
    marginTop: '4px',
  }),
  progressFill: (color: string, percent: number) => ({
    position: 'absolute' as const,
    top: 0,
    left: 0,
    height: '100%',
    width: `${percent}%`,
    background: `linear-gradient(90deg, ${color}aa, ${color})`,
    boxShadow: `0 0 10px ${color}`,
  }),
  connector: (color: string) => ({
    width: '20px',
    height: '2px',
    background: `linear-gradient(90deg, ${color}60, ${color}20)`,
  }),
  modalOverlay: {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
  },
  modalContent: (color: string) => ({
    position: 'relative' as const,
    width: '340px',
    maxWidth: '90%',
    background: 'linear-gradient(180deg, rgba(10, 14, 39, 0.98) 0%, rgba(5, 8, 20, 0.99) 100%)',
    border: `1px solid ${color}`,
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: `0 0 40px ${color}40, inset 0 0 30px ${color}10`,
  }),
  modalScanline: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0, 212, 255, 0.02) 1px, rgba(0, 212, 255, 0.02) 2px)',
    pointerEvents: 'none' as const,
    zIndex: 1,
  },
  modalHeader: (color: string) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    background: `linear-gradient(90deg, ${color}20, transparent)`,
    borderBottom: `1px solid ${color}40`,
    position: 'relative' as const,
    zIndex: 3,
  }),
  modalIcon: (color: string) => ({
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    background: `${color}20`,
    border: `1px solid ${color}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
  }),
  modalTitleSection: {
    flex: 1,
  },
  modalTitle: {
    fontFamily: "'Courier New', monospace",
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '4px',
  },
  modalTag: (type: 'completed' | 'progress' | 'available') => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    background: type === 'completed' ? 'rgba(16, 185, 129, 0.2)' : type === 'progress' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(0, 212, 255, 0.2)',
    border: `1px solid ${type === 'completed' ? '#10b981' : type === 'progress' ? '#f59e0b' : '#00d4ff'}`,
    borderRadius: '2px',
    fontFamily: "'Courier New', monospace",
    fontSize: '9px',
    color: type === 'completed' ? '#10b981' : type === 'progress' ? '#f59e0b' : '#00d4ff',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
  }),
  modalClose: {
    position: 'absolute' as const,
    top: '12px',
    right: '12px',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '4px',
    color: '#6b7280',
    cursor: 'pointer',
    fontSize: '12px',
    zIndex: 4,
  },
  modalBody: {
    position: 'relative' as const,
    zIndex: 3,
    padding: '16px',
  },
  description: {
    fontFamily: "'Courier New', monospace",
    fontSize: '11px',
    color: '#a1a1aa',
    lineHeight: 1.6,
    marginBottom: '16px',
    padding: '10px',
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '4px',
    borderLeft: '2px solid rgba(0, 212, 255, 0.3)',
  },
  sectionTitle: {
    fontFamily: "'Courier New', monospace",
    fontSize: '10px',
    color: '#6b7280',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    marginBottom: '8px',
  },
  costContainer: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
    marginBottom: '16px',
  },
  costItem: (type: 'credits' | 'material') => ({
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    background: type === 'credits' ? 'rgba(251, 191, 36, 0.15)' : 'rgba(96, 165, 250, 0.15)',
    border: `1px solid ${type === 'credits' ? 'rgba(251, 191, 36, 0.4)' : 'rgba(96, 165, 250, 0.4)'}`,
    borderRadius: '4px',
    fontFamily: "'Courier New', monospace",
    fontSize: '11px',
    color: type === 'credits' ? '#fbbf24' : '#60a5fa',
  }),
  effectBox: (color: string) => ({
    padding: '12px',
    background: `${color}10`,
    border: `1px solid ${color}30`,
    borderRadius: '4px',
    marginBottom: '16px',
  }),
  effectItem: (color: string) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: "'Courier New', monospace",
    fontSize: '11px',
    color: color,
    marginBottom: '4px',
  }),
  cyberButton: (type: 'primary' | 'danger', color: string) => ({
    width: '100%',
    padding: '12px',
    background: 'transparent',
    border: `1px solid ${type === 'danger' ? '#ef4444' : color}`,
    borderRadius: '4px',
    fontFamily: "'Courier New', monospace",
    fontSize: '12px',
    fontWeight: 'bold',
    color: type === 'danger' ? '#ef4444' : color,
    textTransform: 'uppercase' as const,
    letterSpacing: '2px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  }),
  queueSection: {
    marginTop: '16px',
    padding: '12px',
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '4px',
    border: '1px solid rgba(0, 212, 255, 0.2)',
  },
  queueTitle: {
    fontFamily: "'Courier New', monospace",
    fontSize: '10px',
    color: '#00d4ff',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    marginBottom: '8px',
  },
  queueItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 10px',
    background: 'rgba(0, 212, 255, 0.1)',
    borderRadius: '4px',
    marginBottom: '4px',
  },
  queueText: {
    fontFamily: "'Courier New', monospace",
    fontSize: '11px',
    color: '#a1a1aa',
  },
  queueArrow: {
    color: '#00d4ff',
    fontSize: '10px',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '20px',
    color: '#6b7280',
    fontFamily: "'Courier New', monospace",
    fontSize: '11px',
  },
};

const techTreeConfig = [
  { name: '采矿平台', icon: '⛏️', color: '#f59e0b', prefix: 'mining_' },
  { name: '芯片研发', icon: '💾', color: '#00d4ff', prefix: 'chip_' },
  { name: '机械飞升', icon: '🦾', color: '#a855f7', prefix: 'cybernetic_' },
];

export function ResearchContent() {
  const { gameManager, saveGame, startResearch, cancelResearch } = useGameStore();
  const { message, showMessage } = useMessage();
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
    return h > 0 
      ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` 
      : `${m}:${s.toString().padStart(2, '0')}`;
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

  const getTreeProjects = (prefix: string) => {
    return projects
      .filter(p => p.id.startsWith(prefix))
      .sort((a, b) => {
        const aLevel = parseInt(a.id.split('_lv')[1] || '1');
        const bLevel = parseInt(b.id.split('_lv')[1] || '1');
        return aLevel - bLevel;
      });
  };

  const selectedProjectData = selectedProject ? projects.find(p => p.id === selectedProject) : null;
  const selectedTree = selectedProjectData ? techTreeConfig.find(t => selectedProjectData.id.startsWith(t.prefix)) : null;

  const completedCount = gameManager.completedResearch.length;
  const totalCount = projects.length;

  return (
    <div style={{ position: 'relative' }}>
      <CenteredMessageToast message={message} />

      {selectedProjectData && selectedTree && (
        <div style={cyberStyles.modalOverlay} onClick={() => setSelectedProject(null)}>
          <div style={cyberStyles.modalContent(selectedTree.color)} onClick={e => e.stopPropagation()}>
            <div style={cyberStyles.modalScanline} />
            
            <button style={cyberStyles.modalClose} onClick={() => setSelectedProject(null)}>
              ✕
            </button>

            <div style={cyberStyles.modalHeader(selectedTree.color)}>
              <div style={cyberStyles.modalIcon(selectedTree.color)}>
                <span>{selectedTree.icon}</span>
              </div>
              <div style={cyberStyles.modalTitleSection}>
                <div style={cyberStyles.modalTitle}>{selectedProjectData.name}</div>
                <span style={cyberStyles.modalTag(
                  selectedProjectData.status === ResearchStatus.COMPLETED 
                    ? 'completed' 
                    : selectedProjectData.status === ResearchStatus.IN_PROGRESS 
                      ? 'progress' 
                      : 'available'
                )}>
                  {selectedProjectData.status === ResearchStatus.COMPLETED && '✓ 已完成'}
                  {selectedProjectData.status === ResearchStatus.IN_PROGRESS && '⏳ 研究中'}
                  {selectedProjectData.status === ResearchStatus.AVAILABLE && '▸ 可研究'}
                  {selectedProjectData.status === ResearchStatus.LOCKED && '🔒 锁定'}
                </span>
              </div>
            </div>

            <div style={cyberStyles.modalBody}>
              <div style={cyberStyles.description}>
                {'>'} {selectedProjectData.description}
              </div>

              {selectedProjectData.status === ResearchStatus.IN_PROGRESS && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={cyberStyles.sectionTitle}>研究进度</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ 
                        fontFamily: "'Courier New', monospace", 
                        fontSize: '12px', 
                        color: selectedTree.color,
                        fontWeight: 'bold',
                      }}>
                        {Math.round((selectedProjectData.progress / selectedProjectData.totalProgress) * 100)}%
                      </span>
                      <span style={{ 
                        fontFamily: "'Courier New', monospace", 
                        fontSize: '11px', 
                        color: '#f59e0b',
                      }}>
                        ⏱ {formatTime(getRemainingTime(selectedProjectData))}
                      </span>
                    </div>
                  </div>
                  <div style={cyberStyles.progressBar(selectedTree.color)}>
                    <div style={cyberStyles.progressFill(selectedTree.color, (selectedProjectData.progress / selectedProjectData.totalProgress) * 100)} />
                  </div>
                </div>
              )}

              {selectedProjectData.status === ResearchStatus.AVAILABLE && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={cyberStyles.sectionTitle}>研究消耗</div>
                  <div style={cyberStyles.costContainer}>
                    <span style={cyberStyles.costItem('credits')}>
                      💰 {selectedProjectData.cost.credits}
                    </span>
                    {selectedProjectData.cost.materials.map((mat, i) => (
                      <span key={i} style={cyberStyles.costItem('material')}>
                        {getItemName(mat.itemId)} x{mat.count}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedProjectData.status === ResearchStatus.COMPLETED && (
                <div>
                  <div style={cyberStyles.sectionTitle}>研究效果</div>
                  <div style={cyberStyles.effectBox(selectedTree.color)}>
                    {selectedProjectData.effects.map((e, i) => (
                      <div key={i} style={cyberStyles.effectItem(selectedTree.color)}>
                        <span>▸</span>
                        <span>{e.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedProjectData.status === ResearchStatus.AVAILABLE && (
                <button 
                  onClick={() => handleStartResearch(selectedProjectData.id)} 
                  style={cyberStyles.cyberButton('primary', selectedTree.color)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${selectedTree.color}20`;
                    e.currentTarget.style.boxShadow = `0 0 20px ${selectedTree.color}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  [ 开始研究 ]
                </button>
              )}

              {selectedProjectData.status === ResearchStatus.IN_PROGRESS && (
                <button 
                  onClick={() => handleCancelResearch(selectedProjectData.id)} 
                  style={cyberStyles.cyberButton('danger', selectedTree.color)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  [ 取消研究 ]
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div style={cyberStyles.terminalContainer}>
        <div style={cyberStyles.scanlineOverlay} />
        
        <div style={cyberStyles.headerBar}>
          <div style={cyberStyles.statusDot(activeResearch.length > 0 ? '#f59e0b' : '#00d4ff')} />
          <span style={cyberStyles.headerTitle}>科研实验室</span>
          <div style={cyberStyles.headerStats}>
            <div style={cyberStyles.statItem}>
              <span style={{ color: '#10b981' }}>✓</span>
              <span style={{ color: '#a1a1aa' }}>已完成:</span>
              <span style={{ color: '#10b981' }}>{completedCount}/{totalCount}</span>
            </div>
            {activeResearch.length > 0 && (
              <div style={cyberStyles.statItem}>
                <span style={{ color: '#f59e0b' }}>⏱</span>
                <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>
                  {formatTime(getRemainingTime(activeResearch[0]))}
                </span>
              </div>
            )}
          </div>
        </div>

        <div style={cyberStyles.bodyContent}>
          {activeResearch.length > 0 && (
            <div style={cyberStyles.queueSection}>
              <div style={cyberStyles.queueTitle}>{'>'} 当前研究队列</div>
              {activeResearch.map((project, index) => {
                const tree = techTreeConfig.find(t => project.id.startsWith(t.prefix));
                const progress = (project.progress / project.totalProgress) * 100;
                return (
                  <div key={project.id} style={cyberStyles.queueItem}>
                    <span style={{ color: tree?.color || '#00d4ff' }}>{tree?.icon}</span>
                    <span style={cyberStyles.queueText}>{project.name}</span>
                    <span style={{ ...cyberStyles.queueText, color: '#f59e0b' }}>
                      {Math.round(progress)}%
                    </span>
                    <span style={{ ...cyberStyles.queueText, color: '#f59e0b' }}>
                      ⏱ {formatTime(getRemainingTime(project))}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {techTreeConfig.map(tree => {
            const treeProjects = getTreeProjects(tree.prefix);
            
            return (
              <div key={tree.name} style={cyberStyles.techTreeSection}>
                <div style={{ ...cyberStyles.techTreeHeader, borderLeftColor: tree.color }}>
                  <span style={cyberStyles.techTreeIcon}>{tree.icon}</span>
                  <span style={{ ...cyberStyles.techTreeName, color: tree.color }}>{tree.name}</span>
                </div>
                
                <div style={cyberStyles.projectGrid}>
                  {treeProjects.length > 0 ? (
                    treeProjects.map((project, index) => {
                      const levelNum = parseInt(project.id.split('_lv')[1] || '1');
                      const progress = project.status === ResearchStatus.IN_PROGRESS 
                        ? (project.progress / project.totalProgress) * 100 
                        : 0;
                      
                      return (
                        <div key={project.id} style={{ display: 'flex', alignItems: 'center' }}>
                          <div 
                            onClick={() => setSelectedProject(project.id)}
                            style={cyberStyles.projectNode(project.status, tree.color)}
                            onMouseEnter={(e) => {
                              if (project.status !== ResearchStatus.LOCKED) {
                                e.currentTarget.style.boxShadow = `0 0 15px ${tree.color}40`;
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            <div style={cyberStyles.projectLevel}>Lv.{levelNum}</div>
                            
                            {project.status === ResearchStatus.COMPLETED && (
                              <div style={cyberStyles.projectStatus('#10b981')}>✓ 完成</div>
                            )}
                            
                            {project.status === ResearchStatus.IN_PROGRESS && (
                              <>
                                <div style={cyberStyles.projectStatus('#f59e0b')}>
                                  {formatTime(getRemainingTime(project))}
                                </div>
                                <div style={cyberStyles.progressBar(tree.color)}>
                                  <div style={cyberStyles.progressFill(tree.color, progress)} />
                                </div>
                              </>
                            )}
                            
                            {project.status === ResearchStatus.AVAILABLE && (
                              <div style={cyberStyles.projectStatus(tree.color)}>可研究</div>
                            )}
                            
                            {project.status === ResearchStatus.LOCKED && (
                              <div style={cyberStyles.projectStatus('#6b7280')}>🔒 锁定</div>
                            )}
                          </div>
                          
                          {index < treeProjects.length - 1 && (
                            <div style={cyberStyles.connector(tree.color)} />
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div style={cyberStyles.emptyState}>暂无研究项目</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
