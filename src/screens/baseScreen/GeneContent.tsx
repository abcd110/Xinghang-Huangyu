import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import {
  BasePair,
  BASE_PAIR_CONFIG,
  GeneFragment,
  Chromosome,
  GENE_FRAGMENT_TEMPLATES,
  CHROMOSOME_CONFIGS,
} from '../../core/GeneSystemV2';
import { MessageToast, type MessageState } from './shared';
import { styles, colors } from './styles';

const GENE_TYPE_NAMES: Record<string, string> = {
  vampire: '🩸 吸血',
  combat: '⚔️ 战斗',
  survival: '❤️ 生存',
  special: '✨ 特殊',
};

function GeneManual({ onClose }: { onClose: () => void }) {
  const [filter, setFilter] = useState<string | null>(null);

  const groupedGenes = GENE_FRAGMENT_TEMPLATES.reduce((acc, gene) => {
    const type = gene.category;
    if (!acc[type]) acc[type] = [];
    acc[type].push(gene);
    return acc;
  }, {} as Record<string, typeof GENE_FRAGMENT_TEMPLATES>);

  const renderGeneCard = (gene: typeof GENE_FRAGMENT_TEMPLATES[0]) => {
    return (
      <div
        key={gene.id}
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '8px',
          padding: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '8px',
        }}
      >
        <div style={{ marginBottom: '6px' }}>
          <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>{gene.name}</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '6px',
        }}>
          <span style={{
            color: '#f59e0b',
            fontSize: '12px',
            fontWeight: 'bold',
            background: 'rgba(245, 158, 11, 0.2)',
            padding: '2px 8px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            wordBreak: 'break-all',
          }}>
            {gene.pattern.join('')}
          </span>
        </div>
        <div style={{ color: '#a1a1aa', fontSize: '12px', lineHeight: '1.5' }}>
          {gene.description}
        </div>
        {gene.effect.lifeSteal && (
          <div style={{
            color: '#ef4444',
            fontSize: '12px',
            fontWeight: 'bold',
            marginTop: '6px',
          }}>
            🩸 生命偷取 +{gene.effect.lifeSteal.basePercent}%
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: '-300px',
      background: 'rgba(0, 0, 0, 0.98)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      padding: '16px',
      borderRadius: '12px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
      }}>
        <div style={{ color: '#22c55e', fontSize: '16px', fontWeight: 'bold' }}>
          📖 基因配方手册
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            color: '#fff',
            fontSize: '14px',
            padding: '6px 16px',
            cursor: 'pointer',
          }}
        >
          ✕ 关闭
        </button>
      </div>

      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '12px',
        flexWrap: 'wrap',
        overflowX: 'auto',
        paddingBottom: '4px',
      }}>
        <button
          onClick={() => setFilter(null)}
          style={{
            background: filter === null ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.1)',
            border: filter === null ? '1px solid #22c55e' : '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            color: filter === null ? '#22c55e' : '#a1a1aa',
            fontSize: '12px',
            padding: '6px 12px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          全部({GENE_FRAGMENT_TEMPLATES.length})
        </button>
        {Object.entries(groupedGenes).map(([type, genes]) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            style={{
              background: filter === type ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.1)',
              border: filter === type ? '1px solid #22c55e' : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              color: filter === type ? '#22c55e' : '#a1a1aa',
              fontSize: '12px',
              padding: '6px 12px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {GENE_TYPE_NAMES[type]}({genes.length})
          </button>
        ))}
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}>
        {filter === null ? (
          Object.entries(groupedGenes).map(([type, genes]) => (
            <div key={type} style={{ marginBottom: '16px' }}>
              <div style={{
                color: GENE_TYPE_NAMES[type]?.includes('吸血') ? '#ef4444' :
                  GENE_TYPE_NAMES[type]?.includes('战斗') ? '#f59e0b' :
                    GENE_TYPE_NAMES[type]?.includes('生存') ? '#22c55e' :
                      GENE_TYPE_NAMES[type]?.includes('特殊') ? '#3b82f6' : '#a855f7',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '10px',
                paddingBottom: '6px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              }}>
                {GENE_TYPE_NAMES[type]}
              </div>
              {genes.map(gene => renderGeneCard(gene))}
            </div>
          ))
        ) : (
          groupedGenes[filter]?.map(gene => renderGeneCard(gene))
        )}
      </div>
    </div>
  );
}

function DNAStrandView({
  chromosome,
  selectedPosition,
  onSelectPosition,
  viewRange,
  fragments,
}: {
  chromosome: Chromosome;
  selectedPosition: number | null;
  onSelectPosition: (pos: number) => void;
  viewRange: { start: number; end: number };
  fragments: GeneFragment[];
}) {
  const senseNucleotides = chromosome.senseStrand.nucleotides.slice(viewRange.start, viewRange.end);

  const fragmentRanges: Map<number, { fragment: GeneFragment; color: string }> = new Map();
  const fragmentColors = [
    '#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7',
    '#ec4899', '#14b8a6', '#f97316', '#8b5cf6', '#06b6d4'
  ];

  fragments.forEach((fragment, index) => {
    if (fragment.chromosomeId !== chromosome.id) return;
    const color = fragmentColors[index % fragmentColors.length];
    for (let i = fragment.startIndex; i <= fragment.endIndex; i++) {
      fragmentRanges.set(i, { fragment, color });
    }
  });

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(10, 1fr)',
      gap: '3px',
    }}>
      {senseNucleotides.map((n, i) => {
        const position = viewRange.start + i;
        const isSelected = selectedPosition === position;
        const config = BASE_PAIR_CONFIG[n.base];
        const fragmentInfo = fragmentRanges.get(position);

        return (
          <button
            key={position}
            onClick={() => onSelectPosition(position)}
            style={{
              aspectRatio: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isSelected ? `${config.color}40` : 'rgba(255, 255, 255, 0.05)',
              border: fragmentInfo
                ? `2px solid ${fragmentInfo.color}`
                : `2px solid ${isSelected ? config.color : 'transparent'}`,
              borderRadius: '6px',
              color: config.color,
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.15s',
              padding: 0,
              minWidth: '32px',
              minHeight: '32px',
              boxShadow: fragmentInfo ? `0 0 4px ${fragmentInfo.color}40` : 'none',
            }}
          >
            {n.base}
          </button>
        );
      })}
    </div>
  );
}

export function GeneContent() {
  const { gameManager, saveGame } = useGameStore();
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [message, setMessage] = useState<MessageState | null>(null);
  const [showManual, setShowManual] = useState(false);
  const [viewOffset, setViewOffset] = useState(0);
  const [, setRefreshKey] = useState(0);

  const forceRefresh = () => setRefreshKey(k => k + 1);

  if (!gameManager) {
    return <div style={{ color: '#fff', padding: '20px', textAlign: 'center' }}>加载中...</div>;
  }

  const geneSystemState = gameManager.getGeneSystemState();
  const activeChromosome = gameManager.getActiveChromosome();

  if (!geneSystemState || !activeChromosome) {
    return <div style={{ color: '#fff', padding: '20px', textAlign: 'center' }}>初始化基因系统...</div>;
  }

  const VIEW_SIZE = 30;
  const totalLength = activeChromosome.length || activeChromosome.senseStrand.nucleotides.length;
  const maxOffset = Math.max(0, totalLength - VIEW_SIZE);
  const viewRange = {
    start: Math.min(viewOffset, maxOffset),
    end: Math.min(viewOffset + VIEW_SIZE, totalLength)
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleReplaceBase = async (newBase: BasePair) => {
    if (selectedPosition === null) return;

    const result = gameManager.replaceNucleotideBase(activeChromosome.id, selectedPosition, newBase);
    if (result.success) {
      showMessage(result.message, 'success');
      await saveGame();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const lifeStealPercent = gameManager.getLifeStealPercent();
  const geneStats = gameManager.getGeneStatsBonus();
  const allFragments = geneSystemState.fragments;
  const integrity = gameManager.getChromosomeIntegrity();

  const unlockedChromosomes = geneSystemState.chromosomes;

  const GENE_EDIT_COST = { credits: 1000, materials: 5 };
  const playerCredits = gameManager.trainCoins;
  const geneMaterialCount = gameManager.inventory.getItemCount('gene_material');
  const canAffordEdit = playerCredits >= GENE_EDIT_COST.credits && geneMaterialCount >= GENE_EDIT_COST.materials;

  return (
    <div style={{ position: 'relative', padding: '12px' }}>
      <MessageToast message={message} />

      {showManual && <GeneManual onClose={() => setShowManual(false)} />}

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
      }}>
        <div>
          <div style={{ color: colors.gene, fontSize: '16px', fontWeight: 'bold' }}>
            🧬 基因工程
          </div>
          <div style={{ color: '#a1a1aa', fontSize: '12px' }}>
            完整度 {integrity}%
          </div>
        </div>
        <button
          onClick={() => setShowManual(true)}
          style={{
            background: 'rgba(245, 158, 11, 0.2)',
            border: '1px solid #f59e0b',
            borderRadius: '6px',
            color: '#f59e0b',
            fontSize: '12px',
            padding: '6px 12px',
            cursor: 'pointer',
          }}
        >
          📖 手册
        </button>
      </div>

      {lifeStealPercent > 0 && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '10px',
          padding: '12px',
          marginBottom: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ color: '#ef4444', fontSize: '12px' }}>🩸 生命偷取</div>
            <div style={{ color: '#a1a1aa', fontSize: '11px' }}>攻击时恢复HP</div>
          </div>
          <div style={{ color: '#ef4444', fontSize: '24px', fontWeight: 'bold' }}>
            {lifeStealPercent.toFixed(1)}%
          </div>
        </div>
      )}

      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '16px',
        overflowX: 'auto',
        paddingBottom: '8px',
        WebkitOverflowScrolling: 'touch',
        position: 'relative',
        zIndex: 10,
      }}>
        {unlockedChromosomes.map((chromosome) => (
          <button
            key={chromosome.id}
            onClick={async () => {
              if (chromosome.id !== activeChromosome.id) {
                const success = gameManager.switchChromosome(chromosome.id);
                if (success) {
                  setSelectedPosition(null);
                  setViewOffset(0);
                  forceRefresh();
                  await saveGame();
                }
              }
            }}
            style={{
              background: chromosome.id === activeChromosome.id ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: chromosome.id === activeChromosome.id ? '1px solid #22c55e' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: chromosome.id === activeChromosome.id ? '#22c55e' : '#fff',
              fontSize: '13px',
              padding: '10px 16px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              pointerEvents: 'auto',
              touchAction: 'manipulation',
            }}
          >
            {chromosome.name}
          </button>
        ))}
      </div>

      <div style={{
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '16px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}>
          <span style={{ color: '#a1a1aa', fontSize: '13px' }}>点击碱基编辑</span>
          <span style={{ color: '#f59e0b', fontSize: '13px' }}>
            {viewRange.start + 1}-{viewRange.end} / {totalLength}
          </span>
        </div>

        <DNAStrandView
          chromosome={activeChromosome}
          selectedPosition={selectedPosition}
          onSelectPosition={setSelectedPosition}
          viewRange={viewRange}
          fragments={allFragments}
        />

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginTop: '16px',
        }}>
          <button
            onClick={() => setViewOffset(Math.max(0, viewOffset - VIEW_SIZE))}
            disabled={viewOffset <= 0}
            style={{
              background: viewOffset <= 0 ? 'rgba(100, 100, 100, 0.2)' : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '8px',
              color: viewOffset <= 0 ? '#666' : '#fff',
              fontSize: '14px',
              padding: '10px 20px',
              cursor: viewOffset <= 0 ? 'not-allowed' : 'pointer',
              minWidth: '80px',
            }}
          >
            ◀ 上页
          </button>
          <button
            onClick={() => setViewOffset(Math.min(maxOffset, viewOffset + VIEW_SIZE))}
            disabled={viewOffset >= maxOffset}
            style={{
              background: viewOffset >= maxOffset ? 'rgba(100, 100, 100, 0.2)' : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '8px',
              color: viewOffset >= maxOffset ? '#666' : '#fff',
              fontSize: '14px',
              padding: '10px 20px',
              cursor: viewOffset >= maxOffset ? 'not-allowed' : 'pointer',
              minWidth: '80px',
            }}
          >
            下页 ▶
          </button>
        </div>
      </div>

      {selectedPosition !== null && (
        <div style={{
          background: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px',
        }}>
          <div style={{
            color: '#fff',
            fontSize: '14px',
            marginBottom: '12px',
            textAlign: 'center',
          }}>
            编辑位置 <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{selectedPosition + 1}</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
            marginBottom: '12px',
          }}>
            {Object.values(BasePair).map(base => {
              const config = BASE_PAIR_CONFIG[base];
              const isCurrent = activeChromosome.senseStrand.nucleotides[selectedPosition].base === base;
              const isDisabled = isCurrent || !canAffordEdit;
              return (
                <button
                  key={base}
                  onClick={() => !isDisabled && handleReplaceBase(base)}
                  disabled={isDisabled}
                  style={{
                    padding: '12px',
                    background: isCurrent ? 'rgba(100, 100, 100, 0.3)' : `${config.color}20`,
                    border: `2px solid ${isCurrent ? '#666' : config.color}`,
                    borderRadius: '8px',
                    color: isCurrent ? '#666' : config.color,
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    opacity: isDisabled ? 0.5 : 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{base}</span>
                  <span style={{ fontSize: '11px' }}>{config.name}</span>
                </button>
              );
            })}
          </div>

          <div style={{
            color: canAffordEdit ? '#a1a1aa' : '#ef4444',
            fontSize: '11px',
            textAlign: 'center',
            marginBottom: '12px',
          }}>
            <div>消耗: 基因材料×{GENE_EDIT_COST.materials} + 信用点×{GENE_EDIT_COST.credits}</div>
            <div style={{ marginTop: '4px', color: '#666' }}>
              当前: 基因材料×{geneMaterialCount} + 信用点×{playerCredits}
            </div>
            {!canAffordEdit && (
              <div style={{ color: '#ef4444', marginTop: '4px' }}>资源不足！</div>
            )}
          </div>

          <button
            onClick={() => setSelectedPosition(null)}
            style={{
              width: '100%',
              padding: '10px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#a1a1aa',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            取消
          </button>
        </div>
      )}

      <div>
        <div style={{
          color: '#fff',
          fontSize: '14px',
          fontWeight: 'bold',
          marginBottom: '10px',
        }}>
          已识别基因 ({allFragments.length})
        </div>

        {allFragments.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: '#666',
            fontSize: '13px',
            padding: '24px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '10px',
          }}>
            暂未识别到基因片段<br />
            编辑DNA序列创造基因组合
          </div>
        ) : (
          <MergedGeneList fragments={allFragments} activeChromosome={activeChromosome} />
        )}
      </div>
    </div>
  );
}

function MergedGeneList({ fragments, activeChromosome }: { fragments: GeneFragment[]; activeChromosome: Chromosome | null }) {
  const chromosomeBonus = activeChromosome?.bonusType ? {
    type: activeChromosome.bonusType,
    percent: activeChromosome.bonusPercent,
  } : null;

  const CATEGORY_CONFIG: Record<string, { name: string; color: string }> = {
    vampire: { name: '吸血', color: '#ef4444' },
    combat: { name: '战斗', color: '#f59e0b' },
    survival: { name: '生存', color: '#22c55e' },
    special: { name: '特殊', color: '#a855f7' },
  };

  const groupedGenes: Record<string, {
    template: typeof GENE_FRAGMENT_TEMPLATES[0];
    count: number;
  }> = {};

  fragments.forEach(fragment => {
    if (!groupedGenes[fragment.id]) {
      const template = GENE_FRAGMENT_TEMPLATES.find(t => t.id === fragment.id);
      if (template) {
        groupedGenes[fragment.id] = {
          template,
          count: 0,
        };
      }
    }
    if (groupedGenes[fragment.id]) {
      groupedGenes[fragment.id].count++;
    }
  });

  const mergedList = Object.values(groupedGenes);

  const groupedByCategory: Record<string, typeof mergedList> = {
    vampire: [],
    combat: [],
    survival: [],
    special: [],
  };

  mergedList.forEach(item => {
    const cat = item.template.category;
    if (groupedByCategory[cat]) {
      groupedByCategory[cat].push(item);
    }
  });

  const categoryOrder = ['vampire', 'combat', 'survival', 'special'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {categoryOrder.map(category => {
        const items = groupedByCategory[category];
        if (items.length === 0) return null;
        const config = CATEGORY_CONFIG[category];

        return (
          <div key={category}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '6px',
            }}>
              <span style={{
                background: `${config.color}30`,
                color: config.color,
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 'bold',
              }}>
                {config.name}
              </span>
              <span style={{ color: '#666', fontSize: '11px' }}>
                {items.length}种
              </span>
            </div>
            {items.slice(0, 10).map(({ template, count }) => {
              const isUnique = template.unique;
              const hasChromosomeBonus = chromosomeBonus && chromosomeBonus.percent > 0 && template.category === chromosomeBonus.type;

              return (
                <div
                  key={template.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    borderLeft: `3px solid ${isUnique ? '#a855f7' : '#22c55e'}`,
                    marginBottom: '6px',
                  }}
                >
                  <div style={{
                    marginBottom: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <span style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>
                      {template.name}
                      {count > 1 && !isUnique && <span style={{ color: '#f59e0b', marginLeft: '6px' }}>×{count}</span>}
                    </span>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      {hasChromosomeBonus && (
                        <span style={{ color: '#22c55e', fontSize: '10px', background: 'rgba(34, 197, 94, 0.2)', padding: '1px 4px', borderRadius: '3px' }}>
                          +{chromosomeBonus!.percent}%
                        </span>
                      )}
                      {isUnique && <span style={{ color: '#a855f7', fontSize: '10px' }}>[唯一]</span>}
                    </div>
                  </div>
                  <div style={{ color: '#a1a1aa', fontSize: '11px', lineHeight: '1.4' }}>
                    {template.description}
                  </div>
                </div>
              );
            })}
            {items.length > 10 && (
              <div style={{ textAlign: 'center', color: '#666', fontSize: '11px', padding: '4px' }}>
                还有 {items.length - 10} 种...
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
