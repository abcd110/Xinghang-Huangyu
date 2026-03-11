import { useState, useMemo } from 'react';
import { useGameStore } from '../stores/gameStore';
import { ArmorQuality } from '../data/nanoArmorRecipes';
import { getSynthesizableMaterials } from '../core/MaterialSynthesisSystem';
import { QUALITY_NAMES, MATERIAL_IDS } from '../data/constants';

interface MaterialSynthesisScreenProps {
  onBack: () => void;
}

const QUALITY_COLORS: Record<ArmorQuality, string> = {
  [ArmorQuality.STARDUST]: '#9ca3af',
  [ArmorQuality.ALLOY]: '#22c55e',
  [ArmorQuality.CRYSTAL]: '#3b82f6',
  [ArmorQuality.QUANTUM]: '#a855f7',
  [ArmorQuality.VOID]: '#f59e0b',
};

const QUALITY_GLOW: Record<ArmorQuality, string> = {
  [ArmorQuality.STARDUST]: 'rgba(156, 163, 175, 0.5)',
  [ArmorQuality.ALLOY]: 'rgba(34, 197, 94, 0.5)',
  [ArmorQuality.CRYSTAL]: 'rgba(59, 130, 246, 0.5)',
  [ArmorQuality.QUANTUM]: 'rgba(168, 85, 247, 0.5)',
  [ArmorQuality.VOID]: 'rgba(245, 158, 11, 0.5)',
};

const MATERIAL_NAMES: Record<string, string> = {
  'mat_001': '星铁基础构件',
  'mat_003': '钛钢外甲坯料',
  'mat_004': '战甲能量晶核',
  'mat_005': '稀土传感基质',
  'mat_006': '虚空防护核心',
  'mat_007': '推进模块燃料',
  'mat_010': '量子紧固组件',
};

const SUFFIX: Record<ArmorQuality, string> = {
  [ArmorQuality.STARDUST]: '_stardust',
  [ArmorQuality.ALLOY]: '_alloy',
  [ArmorQuality.CRYSTAL]: '_crystal',
  [ArmorQuality.QUANTUM]: '_quantum',
  [ArmorQuality.VOID]: '_void',
};

type TabType = 'synthesis' | 'exchange';

const animationStyles = `
  @keyframes scan {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }
  @keyframes pulse-glow {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes border-flow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-4px); }
  }
`;

export default function MaterialSynthesisScreen({ onBack }: MaterialSynthesisScreenProps) {
  const { gameManager, saveGame, showToast } = useGameStore();
  const [activeTab, setActiveTab] = useState<TabType>('synthesis');
  const [selectedQuality, setSelectedQuality] = useState<ArmorQuality>(ArmorQuality.STARDUST);
  const [selected, setSelected] = useState<{ id: string; quality: ArmorQuality } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [synthCount, setSynthCount] = useState(1);

  const [targetMaterial, setTargetMaterial] = useState<{ id: string; quality: ArmorQuality } | null>(null);
  const [inputSlot1, setInputSlot1] = useState<{ id: string; quality: ArmorQuality } | null>(null);
  const [inputSlot2, setInputSlot2] = useState<{ id: string; quality: ArmorQuality } | null>(null);
  const [selectingSlot, setSelectingSlot] = useState<1 | 2 | null>(null);
  const [exchangeCount, setExchangeCount] = useState(1);
  const [exchangeQuality, setExchangeQuality] = useState<ArmorQuality>(ArmorQuality.STARDUST);

  const list = useMemo(() => {
    const map = new Map<string, number>();
    gameManager.inventory.items.forEach(item => map.set(item.id, item.quantity));
    return getSynthesizableMaterials(map).filter(i => i.hasCount >= 5);
  }, [gameManager.inventory.items, refreshKey]);

  const getCount = (id: string, q: ArmorQuality) => {
    const item = gameManager.inventory.getItem(`${id}${SUFFIX[q]}`);
    return item?.quantity || 0;
  };

  const handleSynth = (batch: number) => {
    if (!selected) return;
    const result = gameManager.synthesizeMaterialBatch(selected.id, selected.quality, batch);
    showToast(result.message, result.success ? 'success' : 'error');
    if (result.success) {
      saveGame();
      setRefreshKey(k => k + 1);
      const remaining = getCount(selected.id, selected.quality);
      if (remaining < 5) setSelected(null);
    }
  };

  const handleTargetMaterialClick = (id: string, quality: ArmorQuality) => {
    setTargetMaterial({ id, quality });
    setInputSlot1(null);
    setInputSlot2(null);
    setExchangeCount(1);
    setSelectingSlot(null);
  };

  const handleInputSlotClick = (slot: 1 | 2) => {
    if (selectingSlot === slot) {
      setSelectingSlot(null);
    } else {
      setSelectingSlot(slot);
    }
  };

  const handleSelectInputMaterial = (id: string, quality: ArmorQuality) => {
    if (selectingSlot === 1) {
      setInputSlot1({ id, quality });
      setSelectingSlot(2);
    } else if (selectingSlot === 2) {
      setInputSlot2({ id, quality });
      setSelectingSlot(null);
    }
  };

  const getInputMaxCount = (slot: { id: string; quality: ArmorQuality } | null) => {
    if (!slot) return 0;
    return getCount(slot.id, slot.quality);
  };

  const maxExchangeCount = () => {
    if (!inputSlot1 || !inputSlot2) return 0;

    if (inputSlot1.id === inputSlot2.id && inputSlot1.quality === inputSlot2.quality) {
      return Math.floor(getInputMaxCount(inputSlot1) / 2);
    }

    return Math.min(getInputMaxCount(inputSlot1), getInputMaxCount(inputSlot2));
  };

  const handleExchange = () => {
    if (!targetMaterial || !inputSlot1 || !inputSlot2) return;

    const count = exchangeCount;
    const isSameMaterial = inputSlot1.id === inputSlot2.id && inputSlot1.quality === inputSlot2.quality;

    if (isSameMaterial) {
      const totalCount = getCount(inputSlot1.id, inputSlot1.quality);
      if (totalCount < count * 2) {
        showToast(`${MATERIAL_NAMES[inputSlot1.id]}数量不足（需要${count * 2}个）`, 'error');
        return;
      }
      const slotItemId = `${inputSlot1.id}${SUFFIX[inputSlot1.quality]}`;
      const targetItemId = `${targetMaterial.id}${SUFFIX[targetMaterial.quality]}`;
      gameManager.inventory.removeItem(slotItemId, count * 2);
      gameManager.inventory.addItem(targetItemId, count);
    } else {
      const slot1Count = getCount(inputSlot1.id, inputSlot1.quality);
      const slot2Count = getCount(inputSlot2.id, inputSlot2.quality);

      if (slot1Count < count) {
        showToast(`${MATERIAL_NAMES[inputSlot1.id]}数量不足`, 'error');
        return;
      }
      if (slot2Count < count) {
        showToast(`${MATERIAL_NAMES[inputSlot2.id]}数量不足`, 'error');
        return;
      }

      const slot1ItemId = `${inputSlot1.id}${SUFFIX[inputSlot1.quality]}`;
      const slot2ItemId = `${inputSlot2.id}${SUFFIX[inputSlot2.quality]}`;
      const targetItemId = `${targetMaterial.id}${SUFFIX[targetMaterial.quality]}`;

      gameManager.inventory.removeItem(slot1ItemId, count);
      gameManager.inventory.removeItem(slot2ItemId, count);
      gameManager.inventory.addItem(targetItemId, count);
    }

    showToast(`成功获得 ${count} 个${MATERIAL_NAMES[targetMaterial.id]}`, 'success');
    saveGame();
    setRefreshKey(k => k + 1);
    setExchangeCount(1);
  };

  const qualities = [ArmorQuality.STARDUST, ArmorQuality.ALLOY, ArmorQuality.CRYSTAL, ArmorQuality.QUANTUM, ArmorQuality.VOID];

  const maxBatch = selected ? Math.floor(getCount(selected.id, selected.quality) / 5) : 0;

  return (
    <>
      <style>{animationStyles}</style>
      <div style={{
        height: '100vh',
        background: 'linear-gradient(180deg, #0a0e27 0%, #0d1229 50%, #0a0e27 100%)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(0, 212, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
          pointerEvents: 'none'
        }} />

        <header style={{
          flexShrink: 0,
          padding: '12px 16px',
          background: 'rgba(0, 0, 0, 0.4)',
          borderBottom: '1px solid rgba(0, 212, 255, 0.3)',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              onClick={onBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: '#00d4ff',
                background: 'rgba(0, 212, 255, 0.1)',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: '8px',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 'bold'
              }}
            >
              ← 返回
            </button>
            <h1 style={{
              color: '#00d4ff',
              fontSize: '16px',
              fontWeight: 'bold',
              letterSpacing: '2px',
              textShadow: '0 0 10px rgba(0, 212, 255, 0.5)'
            }}>
              ⚙️ 材料工程
            </h1>
            <div style={{ width: '60px' }} />
          </div>
        </header>

        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(0, 212, 255, 0.2)',
          position: 'relative',
          zIndex: 10
        }}>
          <TabButton
            active={activeTab === 'synthesis'}
            onClick={() => { setActiveTab('synthesis'); setSelected(null); }}
            color="#10b981"
            icon="⚗️"
            label="材料合成"
          />
          <TabButton
            active={activeTab === 'exchange'}
            onClick={() => {
              setActiveTab('exchange');
              setTargetMaterial(null);
              setInputSlot1(null);
              setInputSlot2(null);
              setSelectingSlot(null);
              setExchangeCount(1);
            }}
            color="#f59e0b"
            icon="🔄"
            label="材料置换"
          />
        </div>

        {activeTab === 'synthesis' ? (
          <>
            <div style={{
              padding: '12px 16px',
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              background: 'rgba(0, 0, 0, 0.3)',
              position: 'relative',
              zIndex: 10
            }}>
              {qualities.map(q => {
                const count = MATERIAL_IDS.reduce((sum, id) => sum + getCount(id, q), 0);
                const isActive = selectedQuality === q;
                return (
                  <QualityTab
                    key={q}
                    quality={q}
                    count={count}
                    isActive={isActive}
                    onClick={() => setSelectedQuality(q)}
                  />
                );
              })}
            </div>

            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '12px',
              position: 'relative',
              zIndex: 10
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px'
              }}>
                {MATERIAL_IDS.map(id => {
                  const count = getCount(id, selectedQuality);
                  if (count === 0) return null;
                  const isSel = selected?.id === id && selected?.quality === selectedQuality;
                  return (
                    <MaterialCard
                      key={id}
                      id={id}
                      quality={selectedQuality}
                      count={count}
                      isSelected={isSel}
                      onClick={() => setSelected({ id, quality: selectedQuality })}
                    />
                  );
                })}
              </div>

              {MATERIAL_IDS.every(id => getCount(id, selectedQuality) === 0) && (
                <EmptyState quality={selectedQuality} />
              )}
            </div>
          </>
        ) : (
          <>
            <div style={{
              padding: '12px 16px',
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              background: 'rgba(0, 0, 0, 0.3)',
              position: 'relative',
              zIndex: 10
            }}>
              {qualities.map(q => {
                const isActive = exchangeQuality === q;
                return (
                  <QualityTab
                    key={q}
                    quality={q}
                    count={null}
                    isActive={isActive}
                    onClick={() => { setExchangeQuality(q); setTargetMaterial(null); }}
                  />
                );
              })}
            </div>

            {selectingSlot && targetMaterial ? (
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '12px',
                position: 'relative',
                zIndex: 10
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  padding: '12px 16px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(0, 212, 255, 0.3)',
                  borderRadius: '12px'
                }}>
                  <span style={{
                    color: '#00d4ff',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    textShadow: '0 0 8px rgba(0, 212, 255, 0.5)'
                  }}>
                    选择投入材料 · 槽位 {selectingSlot}
                  </span>
                  <button
                    onClick={() => setSelectingSlot(null)}
                    style={{
                      color: '#00d4ff',
                      background: 'rgba(0, 212, 255, 0.1)',
                      border: '1px solid rgba(0, 212, 255, 0.3)',
                      borderRadius: '6px',
                      padding: '4px 12px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    取消
                  </button>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '10px'
                }}>
                  {MATERIAL_IDS.filter(id => !(id === targetMaterial.id && targetMaterial.quality === exchangeQuality)).map(id => {
                    const count = getCount(id, exchangeQuality);
                    return (
                      <MaterialCard
                        key={id}
                        id={id}
                        quality={exchangeQuality}
                        count={count}
                        isSelected={false}
                        disabled={count === 0}
                        onClick={() => handleSelectInputMaterial(id, exchangeQuality)}
                      />
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '12px',
                position: 'relative',
                zIndex: 10
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '10px'
                }}>
                  {MATERIAL_IDS.map(id => {
                    const count = getCount(id, exchangeQuality);
                    const isTarget = targetMaterial?.id === id && targetMaterial?.quality === exchangeQuality;
                    return (
                      <MaterialCard
                        key={id}
                        id={id}
                        quality={exchangeQuality}
                        count={count}
                        isSelected={isTarget}
                        onClick={() => handleTargetMaterialClick(id, exchangeQuality)}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        <div style={{
          flexShrink: 0,
          background: 'linear-gradient(180deg, rgba(10, 14, 39, 0.95) 0%, rgba(10, 14, 39, 1) 100%)',
          borderTop: '1px solid rgba(0, 212, 255, 0.3)',
          padding: '12px',
          paddingBottom: 'calc(12px + 64px + env(safe-area-inset-bottom, 0px))',
          position: 'relative',
          zIndex: 10
        }}>
          {activeTab === 'synthesis' ? (
            selected ? (
              <SynthesisPanel
                selected={selected}
                maxBatch={maxBatch}
                getCount={getCount}
                onSynth={handleSynth}
                synthCount={synthCount}
                onCountChange={setSynthCount}
              />
            ) : (
              <EmptyPanel text="选择要合成的材料" />
            )
          ) : (
            targetMaterial ? (
              <ExchangePanel
                targetMaterial={targetMaterial}
                inputSlot1={inputSlot1}
                inputSlot2={inputSlot2}
                selectingSlot={selectingSlot}
                exchangeCount={exchangeCount}
                maxExchangeCount={maxExchangeCount()}
                getCount={getCount}
                onSlotClick={handleInputSlotClick}
                onCountChange={setExchangeCount}
                onExchange={handleExchange}
              />
            ) : (
              <EmptyPanel text="选择要获得的目标材料" />
            )
          )}
        </div>
      </div>
    </>
  );
}

function TabButton({ active, onClick, color, icon, label }: {
  active: boolean;
  onClick: () => void;
  color: string;
  icon: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '12px',
        background: active ? `${color}15` : 'transparent',
        border: 'none',
        borderBottom: active ? `2px solid ${color}` : '2px solid transparent',
        color: active ? color : '#64748b',
        fontSize: '13px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        textShadow: active ? `0 0 10px ${color}50` : 'none'
      }}
    >
      <span style={{ marginRight: '6px' }}>{icon}</span>
      {label}
    </button>
  );
}

function QualityTab({ quality, count, isActive, onClick }: {
  quality: ArmorQuality;
  count: number | null;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 14px',
        background: isActive ? `${QUALITY_COLORS[quality]}20` : 'rgba(255, 255, 255, 0.03)',
        border: `1px solid ${isActive ? QUALITY_COLORS[quality] : 'rgba(255, 255, 255, 0.1)'}`,
        borderRadius: '20px',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        boxShadow: isActive ? `0 0 15px ${QUALITY_GLOW[quality]}` : 'none',
        transition: 'all 0.3s ease'
      }}
    >
      <span style={{
        color: QUALITY_COLORS[quality],
        fontSize: '12px',
        fontWeight: 'bold',
        textShadow: isActive ? `0 0 8px ${QUALITY_GLOW[quality]}` : 'none'
      }}>
        {QUALITY_NAMES[quality]}
      </span>
      {count !== null && (
        <span style={{
          color: isActive ? QUALITY_COLORS[quality] : '#64748b',
          fontSize: '11px',
          fontWeight: 'bold'
        }}>
          {count}
        </span>
      )}
    </button>
  );
}

function MaterialCard({ id, quality, count, isSelected, disabled, onClick }: {
  id: string;
  quality: ArmorQuality;
  count: number;
  isSelected: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px',
        background: disabled
          ? 'rgba(255, 255, 255, 0.02)'
          : isSelected
            ? `${QUALITY_COLORS[quality]}15`
            : 'rgba(0, 0, 0, 0.3)',
        border: `1px solid ${disabled ? 'rgba(255, 255, 255, 0.05)' : isSelected ? QUALITY_COLORS[quality] : 'rgba(0, 212, 255, 0.2)'}`,
        borderRadius: '12px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        opacity: disabled ? 0.4 : 1,
        boxShadow: isSelected ? `0 0 20px ${QUALITY_GLOW[quality]}, inset 0 0 20px ${QUALITY_COLORS[quality]}10` : 'none',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {isSelected && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '2px',
          background: `linear-gradient(90deg, transparent 0%, ${QUALITY_COLORS[quality]} 50%, transparent 100%)`,
          boxShadow: `0 0 10px ${QUALITY_COLORS[quality]}`
        }} />
      )}
      <span style={{
        color: disabled ? '#64748b' : 'white',
        fontSize: '13px',
        fontWeight: isSelected ? 'bold' : 'normal',
        textShadow: isSelected ? `0 0 8px ${QUALITY_GLOW[quality]}` : 'none'
      }}>
        {MATERIAL_NAMES[id]}
      </span>
      <span style={{
        background: 'rgba(0, 0, 0, 0.5)',
        color: disabled ? '#64748b' : QUALITY_COLORS[quality],
        fontSize: '12px',
        fontWeight: 'bold',
        padding: '4px 10px',
        borderRadius: '8px',
        border: `1px solid ${disabled ? 'rgba(255,255,255,0.1)' : QUALITY_COLORS[quality]}40`
      }}>
        {count}
      </span>
    </button>
  );
}

function EmptyState({ quality }: { quality: ArmorQuality }) {
  return (
    <div style={{
      textAlign: 'center',
      color: '#475569',
      padding: '60px 20px'
    }}>
      <div style={{
        fontSize: '50px',
        marginBottom: '16px',
        opacity: 0.3,
        filter: 'grayscale(100%)'
      }}>📦</div>
      <div style={{
        fontSize: '14px',
        color: '#64748b'
      }}>暂无{QUALITY_NAMES[quality]}材料</div>
    </div>
  );
}

function SciSlider({ value, max, onChange, color }: {
  value: number;
  max: number;
  onChange: (val: number) => void;
  color: string;
}) {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <div style={{
      marginBottom: '12px',
      padding: '12px',
      background: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '12px',
      border: '1px solid rgba(0, 212, 255, 0.2)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px'
      }}>
        <span style={{
          color: '#64748b',
          fontSize: '11px',
          letterSpacing: '1px'
        }}>数量</span>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <button
            onClick={() => onChange(Math.max(1, value - 1))}
            disabled={value <= 1}
            style={{
              width: '28px',
              height: '28px',
              background: value > 1 ? `${color}20` : 'rgba(255,255,255,0.05)',
              border: `1px solid ${value > 1 ? color : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '8px',
              color: value > 1 ? color : '#64748b',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: value > 1 ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              boxShadow: value > 1 ? `0 0 8px ${color}40` : 'none'
            }}
          >−</button>
          <span style={{
            color: color,
            fontSize: '18px',
            fontWeight: 'bold',
            minWidth: '50px',
            textAlign: 'center',
            textShadow: `0 0 10px ${color}50`
          }}>{value}</span>
          <button
            onClick={() => onChange(Math.min(max, value + 1))}
            disabled={value >= max}
            style={{
              width: '28px',
              height: '28px',
              background: value < max ? `${color}20` : 'rgba(255,255,255,0.05)',
              border: `1px solid ${value < max ? color : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '8px',
              color: value < max ? color : '#64748b',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: value < max ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              boxShadow: value < max ? `0 0 8px ${color}40` : 'none'
            }}
          >+</button>
        </div>
      </div>

      <div style={{
        position: 'relative',
        height: '12px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '6px',
        overflow: 'hidden',
        cursor: 'pointer'
      }}>
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: `${percentage}%`,
          background: `linear-gradient(90deg, ${color}60 0%, ${color} 100%)`,
          borderRadius: '6px',
          boxShadow: `0 0 12px ${color}80`,
          transition: 'width 0.15s ease'
        }} />
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: `${percentage}%`,
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s infinite',
          borderRadius: '6px'
        }} />
        <div style={{
          position: 'absolute',
          left: `calc(${percentage}% - 8px)`,
          top: '50%',
          transform: 'translateY(-50%)',
          width: '16px',
          height: '16px',
          background: color,
          borderRadius: '50%',
          boxShadow: `0 0 15px ${color}, 0 0 30px ${color}50`,
          border: '2px solid rgba(255,255,255,0.8)',
          transition: 'left 0.15s ease'
        }} />
        <input
          type="range"
          min={1}
          max={max || 1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            position: 'absolute',
            top: '-8px',
            left: '-12px',
            width: 'calc(100% + 24px)',
            height: '28px',
            opacity: 0,
            cursor: 'pointer',
            margin: 0
          }}
        />
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '8px'
      }}>
        <span style={{ color: '#475569', fontSize: '10px' }}>MIN: 1</span>
        <span style={{ color: color, fontSize: '10px', fontWeight: 'bold' }}>MAX: {max}</span>
      </div>
    </div>
  );
}

function EmptyPanel({ text }: { text: string }) {
  return (
    <div style={{
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '12px',
      border: '1px dashed rgba(0, 212, 255, 0.3)'
    }}>
      <span style={{
        color: '#64748b',
        fontSize: '13px',
        textShadow: '0 0 5px rgba(0, 212, 255, 0.2)'
      }}>{text}</span>
    </div>
  );
}

function SynthesisPanel({ selected, maxBatch, getCount, onSynth, synthCount, onCountChange }: {
  selected: { id: string; quality: ArmorQuality };
  maxBatch: number;
  getCount: (id: string, q: ArmorQuality) => number;
  onSynth: (batch: number) => void;
  synthCount: number;
  onCountChange: (count: number) => void;
}) {
  return (
    <div style={{
      background: 'rgba(0, 0, 0, 0.4)',
      borderRadius: '16px',
      border: `1px solid ${QUALITY_COLORS[selected.quality]}40`,
      padding: '16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: '10%',
        right: '10%',
        height: '2px',
        background: `linear-gradient(90deg, transparent 0%, ${QUALITY_COLORS[selected.quality]} 50%, transparent 100%)`,
        boxShadow: `0 0 10px ${QUALITY_COLORS[selected.quality]}`
      }} />
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px'
      }}>
        <div>
          <div style={{
            color: 'white',
            fontSize: '15px',
            fontWeight: 'bold',
            textShadow: `0 0 8px ${QUALITY_GLOW[selected.quality]}`
          }}>
            {MATERIAL_NAMES[selected.id]}
          </div>
          <div style={{ color: '#64748b', fontSize: '11px', marginTop: '2px' }}>
            {QUALITY_NAMES[selected.quality]} · {getCount(selected.id, selected.quality)}个
          </div>
        </div>
        <div style={{
          background: `${QUALITY_COLORS[selected.quality]}15`,
          border: `1px solid ${QUALITY_COLORS[selected.quality]}40`,
          borderRadius: '8px',
          padding: '6px 12px'
        }}>
          <span style={{
            color: QUALITY_COLORS[selected.quality],
            fontSize: '13px',
            fontWeight: 'bold',
            textShadow: `0 0 8px ${QUALITY_GLOW[selected.quality]}`
          }}>
            可合成 {maxBatch} 次
          </span>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        marginBottom: '12px',
        padding: '10px',
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '10px',
        border: '1px solid rgba(0, 212, 255, 0.2)'
      }}>
        <span style={{
          color: QUALITY_COLORS[selected.quality],
          fontSize: '13px',
          fontWeight: 'bold'
        }}>
          {MATERIAL_NAMES[selected.id]} ×{synthCount * 5}
        </span>
        <span style={{
          color: '#00d4ff',
          fontSize: '16px',
          textShadow: '0 0 8px rgba(0, 212, 255, 0.5)'
        }}>→</span>
        <span style={{
          color: QUALITY_COLORS[selected.quality + 1] || QUALITY_COLORS[ArmorQuality.VOID],
          fontSize: '13px',
          fontWeight: 'bold'
        }}>
          {MATERIAL_NAMES[selected.id]} ×{synthCount}
        </span>
      </div>

      <SciSlider
        value={synthCount}
        max={maxBatch}
        onChange={onCountChange}
        color={QUALITY_COLORS[selected.quality]}
      />

      <button
        onClick={() => onSynth(synthCount)}
        disabled={synthCount > maxBatch || maxBatch === 0}
        style={{
          width: '100%',
          padding: '12px',
          background: synthCount <= maxBatch && maxBatch > 0
            ? `linear-gradient(135deg, ${QUALITY_COLORS[selected.quality]} 0%, ${QUALITY_COLORS[selected.quality]}80 100%)`
            : 'rgba(255, 255, 255, 0.05)',
          border: `1px solid ${synthCount <= maxBatch && maxBatch > 0 ? QUALITY_COLORS[selected.quality] : 'rgba(255, 255, 255, 0.1)'}`,
          borderRadius: '12px',
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: synthCount <= maxBatch && maxBatch > 0 ? 'pointer' : 'not-allowed',
          opacity: synthCount <= maxBatch && maxBatch > 0 ? 1 : 0.5,
          boxShadow: synthCount <= maxBatch && maxBatch > 0
            ? `0 0 20px ${QUALITY_GLOW[selected.quality]}`
            : 'none',
          transition: 'all 0.3s ease'
        }}
      >
        确认合成
      </button>
    </div>
  );
}

function ExchangePanel({ targetMaterial, inputSlot1, inputSlot2, selectingSlot, exchangeCount, maxExchangeCount, getCount, onSlotClick, onCountChange, onExchange }: {
  targetMaterial: { id: string; quality: ArmorQuality };
  inputSlot1: { id: string; quality: ArmorQuality } | null;
  inputSlot2: { id: string; quality: ArmorQuality } | null;
  selectingSlot: 1 | 2 | null;
  exchangeCount: number;
  maxExchangeCount: number;
  getCount: (id: string, q: ArmorQuality) => number;
  onSlotClick: (slot: 1 | 2) => void;
  onCountChange: (count: number) => void;
  onExchange: () => void;
}) {
  return (
    <div style={{
      background: 'rgba(0, 0, 0, 0.4)',
      borderRadius: '16px',
      border: `1px solid ${QUALITY_COLORS[targetMaterial.quality]}40`,
      padding: '16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: '10%',
        right: '10%',
        height: '2px',
        background: `linear-gradient(90deg, transparent 0%, ${QUALITY_COLORS[targetMaterial.quality]} 50%, transparent 100%)`,
        boxShadow: `0 0 10px ${QUALITY_COLORS[targetMaterial.quality]}`
      }} />

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '12px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            color: '#64748b',
            fontSize: '10px',
            marginBottom: '4px',
            letterSpacing: '1px'
          }}>目标</div>
          <div style={{
            padding: '10px 16px',
            background: `${QUALITY_COLORS[targetMaterial.quality]}15`,
            border: `1px solid ${QUALITY_COLORS[targetMaterial.quality]}60`,
            borderRadius: '10px',
            boxShadow: `0 0 15px ${QUALITY_GLOW[targetMaterial.quality]}`
          }}>
            <div style={{
              color: QUALITY_COLORS[targetMaterial.quality],
              fontSize: '13px',
              fontWeight: 'bold',
              textShadow: `0 0 8px ${QUALITY_GLOW[targetMaterial.quality]}`
            }}>
              {MATERIAL_NAMES[targetMaterial.id]}
            </div>
            <div style={{ color: '#64748b', fontSize: '10px', marginTop: '2px' }}>
              {getCount(targetMaterial.id, targetMaterial.quality)}个
            </div>
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '12px'
      }}>
        <InputSlot
          slot={1}
          material={inputSlot1}
          isSelecting={selectingSlot === 1}
          onClick={() => onSlotClick(1)}
          getCount={getCount}
        />
        <span style={{
          color: '#00d4ff',
          fontSize: '18px',
          fontWeight: 'bold',
          textShadow: '0 0 10px rgba(0, 212, 255, 0.5)'
        }}>+</span>
        <InputSlot
          slot={2}
          material={inputSlot2}
          isSelecting={selectingSlot === 2}
          onClick={() => onSlotClick(2)}
          getCount={getCount}
        />
      </div>

      {inputSlot1 && inputSlot2 && (
        <>
          <SciSlider
            value={exchangeCount}
            max={maxExchangeCount}
            onChange={onCountChange}
            color={QUALITY_COLORS[targetMaterial.quality]}
          />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '12px',
            padding: '10px',
            background: 'rgba(245, 158, 11, 0.1)',
            borderRadius: '10px',
            border: '1px solid rgba(245, 158, 11, 0.3)'
          }}>
            <span style={{ color: '#94a3b', fontSize: '12px' }}>
              投入 {exchangeCount * 2} 个材料
            </span>
            <span style={{
              color: '#00d4ff',
              fontSize: '14px',
              textShadow: '0 0 8px rgba(0, 212, 255, 0.5)'
            }}>→</span>
            <span style={{
              color: QUALITY_COLORS[targetMaterial.quality],
              fontSize: '12px',
              fontWeight: 'bold',
              textShadow: `0 0 8px ${QUALITY_GLOW[targetMaterial.quality]}`
            }}>
              获得 {MATERIAL_NAMES[targetMaterial.id]} ×{exchangeCount}
            </span>
          </div>

          <button
            onClick={onExchange}
            disabled={exchangeCount > maxExchangeCount}
            style={{
              width: '100%',
              padding: '12px',
              background: exchangeCount <= maxExchangeCount
                ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                : 'rgba(255, 255, 255, 0.05)',
              border: exchangeCount <= maxExchangeCount
                ? '1px solid #f59e0b'
                : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: exchangeCount <= maxExchangeCount ? 'pointer' : 'not-allowed',
              opacity: exchangeCount <= maxExchangeCount ? 1 : 0.5,
              boxShadow: exchangeCount <= maxExchangeCount
                ? '0 0 20px rgba(245, 158, 11, 0.4)'
                : 'none',
              transition: 'all 0.3s ease'
            }}
          >
            确认置换
          </button>
        </>
      )}

      {(!inputSlot1 || !inputSlot2) && (
        <div style={{
          textAlign: 'center',
          padding: '10px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '10px',
          border: '1px dashed rgba(0, 212, 255, 0.3)'
        }}>
          <span style={{ color: '#64748b', fontSize: '12px' }}>
            点击上方框选择投入材料
          </span>
        </div>
      )}
    </div>
  );
}

function InputSlot({ slot, material, isSelecting, onClick, getCount }: {
  slot: 1 | 2;
  material: { id: string; quality: ArmorQuality } | null;
  isSelecting: boolean;
  onClick: () => void;
  getCount: (id: string, q: ArmorQuality) => number;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '12px',
        background: material
          ? `${QUALITY_COLORS[material.quality]}15`
          : 'rgba(0, 0, 0, 0.3)',
        border: `2px solid ${isSelecting
          ? '#f59e0b'
          : material
            ? QUALITY_COLORS[material.quality]
            : 'rgba(0, 212, 255, 0.3)'}`,
        borderRadius: '12px',
        cursor: 'pointer',
        textAlign: 'center',
        boxShadow: isSelecting
          ? '0 0 15px rgba(245, 158, 11, 0.5)'
          : material
            ? `0 0 15px ${QUALITY_GLOW[material.quality]}`
            : 'none',
        transition: 'all 0.3s ease'
      }}
    >
      {material ? (
        <>
          <div style={{
            color: QUALITY_COLORS[material.quality],
            fontSize: '12px',
            fontWeight: 'bold',
            textShadow: `0 0 8px ${QUALITY_GLOW[material.quality]}`
          }}>
            {MATERIAL_NAMES[material.id]}
          </div>
          <div style={{ color: '#64748b', fontSize: '10px', marginTop: '2px' }}>
            {QUALITY_NAMES[material.quality]} · {getCount(material.id, material.quality)}个
          </div>
        </>
      ) : (
        <span style={{
          color: isSelecting ? '#f59e0b' : '#64748b',
          fontSize: '12px',
          textShadow: isSelecting ? '0 0 8px rgba(245, 158, 11, 0.5)' : 'none'
        }}>
          {isSelecting ? '选择中...' : `投入材料${slot}`}
        </span>
      )}
    </button>
  );
}
