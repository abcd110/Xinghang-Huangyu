import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../stores/gameStore';
import {
  BasePair,
  BASE_PAIR_CONFIG,
  GeneFragment,
  Chromosome,
  GENE_FRAGMENT_TEMPLATES,
  CHROMOSOME_CONFIGS,
} from '../../core/GeneSystemV2';
import { MessageToast, useMessage, useForceUpdate } from './shared';
import { styles, colors } from './styles';

const GENE_TYPE_NAMES: Record<string, string> = {
  vampire: '🩸 吸血',
  combat: '⚔️ 战斗',
  survival: '❤️ 生存',
  special: '✨ 特殊',
};

const GENE_CATEGORY_CONFIG: Record<string, { name: string; color: string; gradient: string }> = {
  vampire: { name: '吸血', color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444, #dc2626)' },
  combat: { name: '战斗', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
  survival: { name: '生存', color: '#22c55e', gradient: 'linear-gradient(135deg, #22c55e, #16a34a)' },
  special: { name: '特殊', color: '#a855f7', gradient: 'linear-gradient(135deg, #a855f7, #9333ea)' },
};

const bioStyles = {
  container: {
    position: 'relative' as const,
    padding: '12px',
    overflow: 'hidden',
    minHeight: '100%',
  },
  dnaHelixBg: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    opacity: 0.15,
    pointerEvents: 'none' as const,
    zIndex: 0,
  },
  content: {
    position: 'relative' as const,
    zIndex: 1,
  },
  cellCard: {
    background: 'radial-gradient(ellipse at 30% 30%, rgba(34, 197, 94, 0.08) 0%, rgba(0, 0, 0, 0.4) 70%)',
    border: '1px solid rgba(34, 197, 94, 0.2)',
    borderRadius: '20px',
    backdropFilter: 'blur(8px)',
    boxShadow: '0 0 30px rgba(34, 197, 94, 0.1), inset 0 0 30px rgba(34, 197, 94, 0.05)',
  },
  membraneBorder: (color: string) => ({
    background: `radial-gradient(ellipse at 50% 0%, ${color}15 0%, transparent 50%)`,
    border: `1px solid ${color}40`,
    borderRadius: '16px',
    boxShadow: `0 0 20px ${color}20, inset 0 1px 0 ${color}30`,
  }),
  nucleusButton: (isActive: boolean, color: string) => ({
    background: isActive 
      ? `radial-gradient(ellipse at 30% 30%, ${color}30 0%, ${color}10 100%)`
      : 'rgba(255, 255, 255, 0.03)',
    border: isActive ? `2px solid ${color}` : '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    boxShadow: isActive ? `0 0 15px ${color}40, inset 0 0 10px ${color}20` : 'none',
    transition: 'all 0.3s ease',
  }),
  basePairButton: (isSelected: boolean, baseColor: string, hasFragment: boolean, fragmentColor: string) => ({
    aspectRatio: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: isSelected 
      ? `radial-gradient(ellipse at 30% 30%, ${baseColor}40 0%, ${baseColor}15 100%)`
      : 'rgba(0, 0, 0, 0.3)',
    border: hasFragment 
      ? `2px solid ${fragmentColor}`
      : `1px solid ${isSelected ? baseColor : 'rgba(255, 255, 255, 0.1)'}`,
    borderRadius: '50%',
    color: baseColor,
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '36px',
    minHeight: '36px',
    boxShadow: hasFragment 
      ? `0 0 12px ${fragmentColor}60, inset 0 0 8px ${fragmentColor}30`
      : isSelected 
        ? `0 0 10px ${baseColor}40`
        : 'none',
  }),
  geneCard: (category: string, isUnique: boolean) => {
    const config = GENE_CATEGORY_CONFIG[category] || GENE_CATEGORY_CONFIG.special;
    return {
      background: `linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%)`,
      border: `1px solid ${config.color}30`,
      borderLeft: `3px solid ${isUnique ? '#a855f7' : config.color}`,
      borderRadius: '12px',
      padding: '12px 14px',
      marginBottom: '8px',
      boxShadow: `0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 ${config.color}15`,
      position: 'relative' as const,
      overflow: 'hidden' as const,
    };
  },
  pulseRing: (color: string) => ({
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    border: `2px solid ${color}`,
    animation: 'pulseRing 2s ease-out infinite',
    pointerEvents: 'none' as const,
  }),
  statBadge: (color: string) => ({
    background: `linear-gradient(135deg, ${color}40 0%, ${color}20 100%)`,
    border: `1px solid ${color}50`,
    borderRadius: '8px',
    padding: '2px 8px',
    fontSize: '11px',
    fontWeight: 'bold',
    color: color,
  }),
};

function DNAHelixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const helixWidth = Math.min(150, canvas.width * 0.3);
      const spacing = 25;
      const amplitude = helixWidth / 2;

      ctx.strokeStyle = 'rgba(34, 197, 94, 0.3)';
      ctx.lineWidth = 2;

      for (let y = -spacing; y < canvas.height + spacing; y += spacing) {
        const offset = time * 0.02;
        const x1 = centerX + Math.sin((y / spacing) * Math.PI + offset) * amplitude;
        const x2 = centerX - Math.sin((y / spacing) * Math.PI + offset) * amplitude;
        const yPos = (y + time * 0.5) % (canvas.height + spacing);

        ctx.beginPath();
        ctx.arc(x1, yPos, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34, 197, 94, 0.4)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x2, yPos, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x1, yPos);
        ctx.lineTo(x2, yPos);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.stroke();
      }

      time++;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
      }}
    />
  );
}

function GeneManual({ onClose }: { onClose: () => void }) {
  const [filter, setFilter] = useState<string | null>(null);

  const groupedGenes = GENE_FRAGMENT_TEMPLATES.reduce((acc, gene) => {
    const type = gene.category;
    if (!acc[type]) acc[type] = [];
    acc[type].push(gene);
    return acc;
  }, {} as Record<string, typeof GENE_FRAGMENT_TEMPLATES>);

  const renderGeneCard = (gene: typeof GENE_FRAGMENT_TEMPLATES[0]) => {
    const config = GENE_CATEGORY_CONFIG[gene.category] || GENE_CATEGORY_CONFIG.special;
    return (
      <div
        key={gene.id}
        style={{
          ...bioStyles.membraneBorder(config.color),
          padding: '14px',
          marginBottom: '10px',
        }}
      >
        <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>{gene.name}</span>
          {gene.unique && (
            <span style={bioStyles.statBadge('#a855f7')}>唯一</span>
          )}
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '8px',
        }}>
          <span style={{
            color: config.color,
            fontSize: '11px',
            fontWeight: 'bold',
            background: `${config.color}20`,
            padding: '3px 10px',
            borderRadius: '6px',
            fontFamily: 'monospace',
            wordBreak: 'break-all',
            border: `1px solid ${config.color}30`,
          }}>
            {gene.pattern.join('')}
          </span>
        </div>
        <div style={{ color: '#a1a1aa', fontSize: '12px', lineHeight: '1.6' }}>
          {gene.description}
        </div>
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
      background: 'linear-gradient(180deg, rgba(0, 20, 10, 0.98) 0%, rgba(0, 10, 5, 0.98) 100%)',
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
        marginBottom: '16px',
      }}>
        <div style={{ color: '#22c55e', fontSize: '18px', fontWeight: 'bold' }}>
          📖 基因配方手册
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '8px',
            color: '#ef4444',
            fontSize: '14px',
            padding: '8px 16px',
            cursor: 'pointer',
          }}
        >
          ✕ 关闭
        </button>
      </div>

      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '16px',
        flexWrap: 'wrap',
        overflowX: 'auto',
        paddingBottom: '4px',
      }}>
        <button
          onClick={() => setFilter(null)}
          style={{
            background: filter === null ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            border: filter === null ? '1px solid #22c55e' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            color: filter === null ? '#22c55e' : '#a1a1aa',
            fontSize: '12px',
            padding: '8px 16px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          全部({GENE_FRAGMENT_TEMPLATES.length})
        </button>
        {Object.entries(groupedGenes).map(([type, genes]) => {
          const config = GENE_CATEGORY_CONFIG[type] || GENE_CATEGORY_CONFIG.special;
          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              style={{
                background: filter === type ? `${config.color}20` : 'rgba(255, 255, 255, 0.05)',
                border: filter === type ? `1px solid ${config.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                color: filter === type ? config.color : '#a1a1aa',
                fontSize: '12px',
                padding: '8px 16px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {GENE_TYPE_NAMES[type]}({genes.length})
            </button>
          );
        })}
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}>
        {filter === null ? (
          Object.entries(groupedGenes).map(([type, genes]) => {
            const config = GENE_CATEGORY_CONFIG[type] || GENE_CATEGORY_CONFIG.special;
            return (
              <div key={type} style={{ marginBottom: '20px' }}>
                <div style={{
                  color: config.color,
                  fontSize: '14px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                  paddingBottom: '8px',
                  borderBottom: `1px solid ${config.color}30`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: config.color,
                    boxShadow: `0 0 8px ${config.color}`,
                  }} />
                  {GENE_TYPE_NAMES[type]}
                </div>
                {genes.map(gene => renderGeneCard(gene))}
              </div>
            );
          })
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
  columnsPerRow = 5,
}: {
  chromosome: Chromosome;
  selectedPosition: number | null;
  onSelectPosition: (pos: number) => void;
  viewRange: { start: number; end: number };
  fragments: GeneFragment[];
  columnsPerRow?: number;
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columnsPerRow}, 1fr)`,
        gap: '4px',
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
              style={bioStyles.basePairButton(
                isSelected, 
                config.color, 
                !!fragmentInfo, 
                fragmentInfo?.color || config.color
              )}
            >
              {n.base}
              {fragmentInfo && (
                <div style={{
                  position: 'absolute',
                  bottom: '-2px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: fragmentInfo.color,
                  boxShadow: `0 0 4px ${fragmentInfo.color}`,
                }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GeneExpressionEffect({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;
  
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
      borderRadius: '12px',
    }}>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '150%',
        height: '150%',
        background: 'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.1) 0%, transparent 70%)',
        animation: 'genePulse 3s ease-in-out infinite',
      }} />
    </div>
  );
}

export function GeneContent() {
  const { gameManager, saveGame } = useGameStore();
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const { message, showMessage } = useMessage();
  const [showManual, setShowManual] = useState(false);
  const [viewOffset, setViewOffset] = useState(0);
  const forceRefresh = useForceUpdate();

  if (!gameManager) {
    return <div style={{ color: '#fff', padding: '20px', textAlign: 'center' }}>加载中...</div>;
  }

  const geneSystemState = gameManager.getGeneSystemState();
  const activeChromosome = gameManager.getActiveChromosome();

  if (!geneSystemState || !activeChromosome) {
    return <div style={{ color: '#fff', padding: '20px', textAlign: 'center' }}>初始化基因系统...</div>;
  }

  const VIEW_SIZE = 20;
  const COLUMNS_PER_ROW = 5;
  const totalLength = activeChromosome.length || activeChromosome.senseStrand.nucleotides.length;
  const maxOffset = Math.max(0, totalLength - VIEW_SIZE);
  const viewRange = {
    start: Math.min(viewOffset, maxOffset),
    end: Math.min(viewOffset + VIEW_SIZE, totalLength)
  };

  const handleReplaceBase = async (newBase: BasePair) => {
    if (selectedPosition === null) return;

    const result = gameManager.replaceNucleotideBase(activeChromosome.id, selectedPosition, newBase);
    if (result.success) {
      showMessage(result.message, 'success');
      forceRefresh();
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

  const activeChromosomeConfig = CHROMOSOME_CONFIGS.find(c => c.id === activeChromosome.id);
  const chromosomeColor = activeChromosomeConfig?.bonusType 
    ? GENE_CATEGORY_CONFIG[activeChromosomeConfig.bonusType]?.color || '#22c55e'
    : '#22c55e';

  return (
    <div style={bioStyles.container}>
      <style>{`
        @keyframes pulseRing {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }
        @keyframes genePulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.8; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 10px currentColor; }
          50% { box-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
        }
        @keyframes shimmer {
          0% { left: -100%; }
          50% { left: 100%; }
          100% { left: 100%; }
        }
      `}</style>
      
      <div style={bioStyles.dnaHelixBg}>
        <DNAHelixBackground />
      </div>

      <MessageToast message={message} />

      {showManual && <GeneManual onClose={() => setShowManual(false)} />}

      <div style={bioStyles.content}>
        <div style={{
          ...bioStyles.cellCard,
          padding: '16px',
          marginBottom: '16px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <div style={{ color: '#22c55e', fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
                🧬 基因工程
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#a1a1aa', fontSize: '12px' }}>完整度</span>
                <div style={{
                  width: '100px',
                  height: '6px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${integrity}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${integrity > 80 ? '#22c55e' : integrity > 50 ? '#f59e0b' : '#ef4444'}, ${integrity > 80 ? '#16a34a' : integrity > 50 ? '#d97706' : '#dc2626'})`,
                    borderRadius: '3px',
                    transition: 'width 0.3s ease',
                  }} />
                </div>
                <span style={{ color: integrity > 80 ? '#22c55e' : integrity > 50 ? '#f59e0b' : '#ef4444', fontSize: '12px', fontWeight: 'bold' }}>
                  {integrity}%
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowManual(true)}
              style={{
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '10px',
                color: '#f59e0b',
                fontSize: '12px',
                padding: '8px 14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              📖 手册
            </button>
          </div>
        </div>

        {Object.keys(geneStats).length > 0 && (
          <div style={{
            ...bioStyles.cellCard,
            padding: '14px',
            marginBottom: '16px',
          }}>
            <div style={{ color: '#22c55e', fontSize: '13px', fontWeight: 'bold', marginBottom: '10px' }}>
              ⚡ 激活效果
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {Object.entries(geneStats).map(([stat, value]) => {
                if (value <= 0) return null;
                const statNames: Record<string, { name: string; color: string }> = {
                  attackPercent: { name: '攻击', color: '#f59e0b' },
                  defensePercent: { name: '防御', color: '#3b82f6' },
                  maxHpPercent: { name: '生命', color: '#22c55e' },
                  speedPercent: { name: '攻速', color: '#06b6d4' },
                  critRate: { name: '暴击', color: '#f59e0b' },
                  critDamage: { name: '暴伤', color: '#ef4444' },
                  dodgeRate: { name: '闪避', color: '#8b5cf6' },
                  hpRegenPercent: { name: '再生', color: '#22c55e' },
                };
                const config = statNames[stat] || { name: stat, color: '#a1a1aa' };
                return (
                  <div key={stat} style={bioStyles.statBadge(config.color)}>
                    {config.name} +{value.toFixed(stat.includes('Percent') || stat === 'critDamage' ? 1 : 0)}{stat.includes('Percent') || stat === 'critDamage' ? '%' : ''}
                  </div>
                );
              })}
              {lifeStealPercent > 0 && (
                <div style={bioStyles.statBadge('#ef4444')}>
                  🩸 吸血 +{lifeStealPercent.toFixed(1)}%
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '16px',
          overflowX: 'auto',
          paddingBottom: '8px',
          WebkitOverflowScrolling: 'touch',
          position: 'relative',
          zIndex: 10,
        }}>
          {unlockedChromosomes.map((chromosome) => {
            const isActive = chromosome.id === activeChromosome.id;
            const config = CHROMOSOME_CONFIGS.find(c => c.id === chromosome.id);
            const chromColor = config?.bonusType 
              ? GENE_CATEGORY_CONFIG[config.bonusType]?.color || '#22c55e'
              : '#22c55e';
            
            return (
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
                  position: 'relative',
                  padding: '14px 20px',
                  minWidth: '90px',
                  background: isActive 
                    ? `linear-gradient(135deg, ${chromColor}25 0%, ${chromColor}10 100%)`
                    : `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`,
                  border: isActive 
                    ? `2px solid ${chromColor}`
                    : `1px solid ${chromColor}40`,
                  borderRadius: '16px',
                  color: isActive ? chromColor : `${chromColor}99`,
                  fontSize: '12px',
                  fontWeight: isActive ? 'bold' : '500',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  pointerEvents: 'auto',
                  touchAction: 'manipulation',
                  boxShadow: isActive 
                    ? `0 0 20px ${chromColor}30, 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 ${chromColor}30`
                    : `0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)`,
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '4px',
                  left: '4px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: isActive ? chromColor : `${chromColor}60`,
                  boxShadow: isActive ? `0 0 6px ${chromColor}` : 'none',
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: '4px',
                  right: '4px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: isActive ? `${chromColor}80` : `${chromColor}40`,
                }} />
                {isActive && (
                  <>
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '120%',
                      height: '120%',
                      borderRadius: '50%',
                      border: `1px solid ${chromColor}40`,
                      animation: 'pulseRing 2s ease-out infinite',
                      pointerEvents: 'none',
                    }} />
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: `linear-gradient(90deg, transparent, ${chromColor}20, transparent)`,
                      animation: 'shimmer 3s ease-in-out infinite',
                      pointerEvents: 'none',
                    }} />
                  </>
                )}
                <span style={{ position: 'relative', zIndex: 1 }}>{chromosome.name}</span>
              </button>
            );
          })}
        </div>

        <div style={{
          ...bioStyles.cellCard,
          padding: '18px',
          marginBottom: '16px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '14px',
          }}>
            <span style={{ color: '#a1a1aa', fontSize: '12px' }}>点击碱基编辑序列</span>
            <span style={{ 
              color: chromosomeColor, 
              fontSize: '12px',
              background: `${chromosomeColor}20`,
              padding: '4px 10px',
              borderRadius: '6px',
            }}>
              {viewRange.start + 1}-{viewRange.end} / {totalLength}
            </span>
          </div>

          <DNAStrandView
            chromosome={activeChromosome}
            selectedPosition={selectedPosition}
            onSelectPosition={setSelectedPosition}
            viewRange={viewRange}
            fragments={allFragments}
            columnsPerRow={COLUMNS_PER_ROW}
          />

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            marginTop: '18px',
          }}>
            <button
              onClick={() => setViewOffset(Math.max(0, viewOffset - VIEW_SIZE))}
              disabled={viewOffset <= 0}
              style={{
                background: viewOffset <= 0 ? 'rgba(100, 100, 100, 0.2)' : `${chromosomeColor}20`,
                border: viewOffset <= 0 ? 'none' : `1px solid ${chromosomeColor}40`,
                borderRadius: '10px',
                color: viewOffset <= 0 ? '#666' : chromosomeColor,
                fontSize: '13px',
                padding: '10px 24px',
                cursor: viewOffset <= 0 ? 'not-allowed' : 'pointer',
                minWidth: '90px',
                transition: 'all 0.2s ease',
              }}
            >
              ◀ 上页
            </button>
            <button
              onClick={() => setViewOffset(Math.min(maxOffset, viewOffset + VIEW_SIZE))}
              disabled={viewOffset >= maxOffset}
              style={{
                background: viewOffset >= maxOffset ? 'rgba(100, 100, 100, 0.2)' : `${chromosomeColor}20`,
                border: viewOffset >= maxOffset ? 'none' : `1px solid ${chromosomeColor}40`,
                borderRadius: '10px',
                color: viewOffset >= maxOffset ? '#666' : chromosomeColor,
                fontSize: '13px',
                padding: '10px 24px',
                cursor: viewOffset >= maxOffset ? 'not-allowed' : 'pointer',
                minWidth: '90px',
                transition: 'all 0.2s ease',
              }}
            >
              下页 ▶
            </button>
          </div>
        </div>

        {selectedPosition !== null && (
          <div style={{
            ...bioStyles.membraneBorder('#22c55e'),
            padding: '18px',
            marginBottom: '16px',
            position: 'relative',
          }}>
            <GeneExpressionEffect isActive={true} />
            
            <div style={{
              color: '#fff',
              fontSize: '14px',
              marginBottom: '14px',
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
            }}>
              编辑位置 <span style={{ color: '#22c55e', fontWeight: 'bold' }}>#{selectedPosition + 1}</span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '10px',
              marginBottom: '14px',
              position: 'relative',
              zIndex: 1,
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
                      padding: '14px 8px',
                      background: isCurrent 
                        ? 'rgba(100, 100, 100, 0.3)' 
                        : `radial-gradient(ellipse at 30% 30%, ${config.color}30 0%, ${config.color}10 100%)`,
                      border: `2px solid ${isCurrent ? '#666' : config.color}`,
                      borderRadius: '12px',
                      color: isCurrent ? '#666' : config.color,
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      opacity: isDisabled ? 0.5 : 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.2s ease',
                      boxShadow: isCurrent || isDisabled ? 'none' : `0 0 10px ${config.color}30`,
                    }}
                  >
                    <span style={{ fontSize: '22px' }}>{base}</span>
                    <span style={{ fontSize: '10px', opacity: 0.8 }}>{config.name}</span>
                  </button>
                );
              })}
            </div>

            <div style={{
              color: canAffordEdit ? '#a1a1aa' : '#ef4444',
              fontSize: '11px',
              textAlign: 'center',
              marginBottom: '14px',
              position: 'relative',
              zIndex: 1,
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                <span style={{ color: geneMaterialCount >= GENE_EDIT_COST.materials ? '#22c55e' : '#ef4444' }}>
                  🧪 基因材料 ×{geneMaterialCount}/{GENE_EDIT_COST.materials}
                </span>
                <span style={{ color: playerCredits >= GENE_EDIT_COST.credits ? '#f59e0b' : '#ef4444' }}>
                  💰 信用点 ×{playerCredits}/{GENE_EDIT_COST.credits}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedPosition(null)}
              style={{
                width: '100%',
                padding: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '10px',
                color: '#a1a1aa',
                fontSize: '13px',
                cursor: 'pointer',
                position: 'relative',
                zIndex: 1,
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
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 6px #22c55e',
            }} />
            已识别基因 ({allFragments.length})
          </div>

          {allFragments.length === 0 ? (
            <div style={{
              ...bioStyles.cellCard,
              textAlign: 'center',
              color: '#666',
              fontSize: '13px',
              padding: '30px',
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px', opacity: 0.5 }}>🧬</div>
              暂未识别到基因片段<br />
              <span style={{ fontSize: '11px', color: '#555' }}>编辑DNA序列创造基因组合</span>
            </div>
          ) : (
            <MergedGeneList fragments={allFragments} activeChromosome={activeChromosome} />
          )}
        </div>
      </div>
    </div>
  );
}

function MergedGeneList({ fragments, activeChromosome }: { fragments: GeneFragment[]; activeChromosome: Chromosome | null }) {
  const chromosomeBonus = activeChromosome?.bonusType ? {
    type: activeChromosome.bonusType,
    percent: activeChromosome.bonusPercent,
  } : null;

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {categoryOrder.map(category => {
        const items = groupedByCategory[category];
        if (items.length === 0) return null;
        const config = GENE_CATEGORY_CONFIG[category];

        return (
          <div key={category}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '10px',
            }}>
              <span style={{
                background: config.gradient,
                color: '#fff',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 'bold',
                boxShadow: `0 2px 8px ${config.color}40`,
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
                    ...bioStyles.geneCard(category, isUnique),
                  }}
                >
                  <GeneExpressionEffect isActive={hasChromosomeBonus} />
                  
                  <div style={{
                    marginBottom: '6px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'relative',
                    zIndex: 1,
                  }}>
                    <span style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>
                      {template.name}
                      {count > 1 && !isUnique && (
                        <span style={{ 
                          color: config.color, 
                          marginLeft: '8px',
                          background: `${config.color}20`,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          fontSize: '11px',
                        }}>×{count}</span>
                      )}
                    </span>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      {hasChromosomeBonus && (
                        <span style={bioStyles.statBadge('#22c55e')}>
                          染色体 +{chromosomeBonus!.percent}%
                        </span>
                      )}
                      {isUnique && (
                        <span style={bioStyles.statBadge('#a855f7')}>
                          唯一
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ 
                    color: '#a1a1aa', 
                    fontSize: '11px', 
                    lineHeight: '1.5',
                    position: 'relative',
                    zIndex: 1,
                  }}>
                    {template.description}
                  </div>
                </div>
              );
            })}
            {items.length > 10 && (
              <div style={{ 
                textAlign: 'center', 
                color: '#666', 
                fontSize: '11px', 
                padding: '8px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '8px',
              }}>
                还有 {items.length - 10} 种基因...
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
