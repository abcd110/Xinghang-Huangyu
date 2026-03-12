import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import { ItemType, RARITY_COLORS } from '../data/types';
import type { InventoryItem } from '../data/types';
import { EquipmentSlot, SLOT_NAMES } from '../data/equipmentTypes';
import { EnhanceResultType, type EnhancePreview, type EnhanceResult } from '../core/EnhanceSystem';
import { SciFiButton } from '../components/SciFiButton';
import { useForceUpdate } from '../screens/baseScreen/shared';
import 强化背景 from '../assets/images/强化背景.jpg';

interface EnhanceScreenProps {
  onBack: () => void;
}

// 战甲槽位（6个）
const ARMOR_SLOTS: EquipmentSlot[] = [
  EquipmentSlot.HEAD,
  EquipmentSlot.BODY,
  EquipmentSlot.SHOULDER,
  EquipmentSlot.ARM,
  EquipmentSlot.LEGS,
  EquipmentSlot.FEET,
];

export default function EnhanceScreen({ onBack }: EnhanceScreenProps) {
  const { gameManager, getEnhancePreview, enhanceItem } = useGameStore();
  const player = gameManager.player;
  const forceRefresh = useForceUpdate();

  const [selectedSlot, setSelectedSlot] = useState<EquipmentSlot | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [preview, setPreview] = useState<EnhancePreview | null>(null);
  const [result, setResult] = useState<EnhanceResult | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);

  // 获取槽位中的装备（只返回已装备的装备）
  const getEquipmentInSlot = useCallback((slot: EquipmentSlot): InventoryItem | null => {
    const equippedMythology = player.getEquipmentBySlot(slot);
    if (equippedMythology) {
      let mappedType: ItemType;
      switch (equippedMythology.slot) {
        case EquipmentSlot.WEAPON:
          mappedType = ItemType.WEAPON;
          break;
        case EquipmentSlot.ACCESSORY:
          mappedType = ItemType.ACCESSORY;
          break;
        default:
          mappedType = ItemType.ARMOR;
      }
      return {
        id: equippedMythology.instanceId,
        name: equippedMythology.name,
        type: mappedType,
        rarity: equippedMythology.rarity,
        description: equippedMythology.description,
        enhanceLevel: equippedMythology.enhanceLevel,
        quantity: 1,
        slot: slot,
      } as InventoryItem;
    }
    return null;
  }, [player]);

  // 当前选中的装备
  const selectedEquipment = selectedSlot ? getEquipmentInSlot(selectedSlot) : null;

  // 当选择槽位时，自动选择装备
  useEffect(() => {
    if (selectedSlot) {
      const equipment = getEquipmentInSlot(selectedSlot);
      requestAnimationFrame(() => setSelectedItem(equipment));
    } else {
      requestAnimationFrame(() => setSelectedItem(null));
    }
  }, [selectedSlot, getEquipmentInSlot]);

  // 当选择物品时更新预览
  const updatePreview = useCallback(() => {
    if (selectedItem) {
      const previewData = getEnhancePreview(selectedItem.id);
      requestAnimationFrame(() => setPreview(previewData));
    } else {
      requestAnimationFrame(() => setPreview(null));
    }
  }, [selectedItem, getEnhancePreview]);

  useEffect(() => {
    requestAnimationFrame(updatePreview);
  }, [updatePreview]);

  const handleEnhance = async () => {
    if (!selectedItem || !preview?.canEnhance) return;

    setIsEnhancing(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const enhanceResult = enhanceItem(selectedItem.id, false);
    setResult(enhanceResult);
    setIsEnhancing(false);

    forceRefresh();
    const newPreview = getEnhancePreview(selectedItem.id);
    setPreview(newPreview);
  };

  const closeResult = () => {
    setResult(null);
    forceRefresh();
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 0.8) return '#22c55e';
    if (rate >= 0.6) return '#00d4ff';
    if (rate >= 0.4) return '#f59e0b';
    return '#ef4444';
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case EnhanceResultType.SUCCESS:
        return '✨';
      case EnhanceResultType.FAILURE_DOWNGRADE:
        return '💥';
      default:
        return '❌';
    }
  };

  const getResultColor = (type: string) => {
    switch (type) {
      case EnhanceResultType.SUCCESS:
        return '#22c55e';
      case EnhanceResultType.FAILURE_DOWNGRADE:
        return '#ef4444';
      default:
        return '#9ca3af';
    }
  };

  return (
    <div style={{
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* 背景 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${强化背景})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 0,
      }} />

      {/* 扫描线效果 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, transparent 0%, rgba(244, 63, 94, 0.02) 50%, transparent 100%)',
        backgroundSize: '100% 4px',
        animation: 'scanline 8s linear infinite',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* 顶部标题栏 - 科幻风格 */}
      <header style={{
        flexShrink: 0,
        position: 'relative',
        zIndex: 10,
        background: 'rgba(20, 0, 10, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(244, 63, 94, 0.4)',
        padding: '12px 16px',
        boxShadow: '0 0 20px rgba(244, 63, 94, 0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <SciFiButton onClick={onBack} label="◀ 返回" variant="default" />
          <h1 style={{
            color: '#f43f5e',
            fontWeight: 'bold',
            fontSize: '18px',
            textShadow: '0 0 15px rgba(244, 63, 94, 0.6)',
          }}>🔨 强化中心</h1>
          <div style={{ width: '70px' }} />
        </div>
      </header>

      {/* 主内容区 */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        position: 'relative',
        zIndex: 10,
      }}>
        {/* 装备槽位选择 - 科幻风格 */}
        <div style={{
          background: 'rgba(0, 10, 20, 0.7)',
          backdropFilter: 'blur(8px)',
          borderRadius: '16px',
          padding: '16px',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          marginBottom: '16px',
          boxShadow: '0 0 20px rgba(244, 63, 94, 0.1)',
        }}>
          <h3 style={{
            color: '#f43f5e',
            fontSize: '14px',
            marginBottom: '12px',
            textShadow: '0 0 8px rgba(244, 63, 94, 0.4)',
          }}>
            选择装备槽位
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {ARMOR_SLOTS.map(slot => {
              const equipment = getEquipmentInSlot(slot);
              const isSelected = selectedSlot === slot;
              const hasEquipment = !!equipment;

              return (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  style={{
                    aspectRatio: '1',
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.3), rgba(244, 63, 94, 0.1))'
                      : 'rgba(0, 0, 0, 0.5)',
                    border: `2px solid ${isSelected ? '#f43f5e' : (hasEquipment ? RARITY_COLORS[equipment.rarity] : 'rgba(255,255,255,0.1)')}`,
                    borderRadius: '12px',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 0 20px rgba(244, 63, 94, 0.4)' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <span style={{
                    fontSize: '13px',
                    color: isSelected ? '#f43f5e' : '#a1a1aa',
                    fontWeight: 'bold',
                    textShadow: isSelected ? '0 0 5px rgba(244, 63, 94, 0.5)' : 'none',
                  }}>
                    {SLOT_NAMES[slot]}
                  </span>
                  {equipment ? (
                    <>
                      <span style={{
                        fontSize: '10px',
                        color: RARITY_COLORS[equipment.rarity],
                        textAlign: 'center',
                        lineHeight: '1.2',
                        marginTop: '4px',
                      }}>
                        {equipment.name || '未知装备'}
                      </span>
                      <span style={{
                        fontSize: '9px',
                        color: '#00d4ff',
                        marginTop: '2px',
                        textShadow: '0 0 5px rgba(0, 212, 255, 0.5)',
                      }}>
                        +{equipment.enhanceLevel || 0}
                      </span>
                    </>
                  ) : (
                    <span style={{ fontSize: '10px', color: '#6b7280', marginTop: '4px' }}>
                      未装备
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 选中装备详情 - 科幻风格 */}
        {selectedEquipment && preview && (
          <div style={{
            background: 'rgba(0, 10, 20, 0.8)',
            backdropFilter: 'blur(12px)',
            borderRadius: '16px',
            padding: '16px',
            border: `2px solid ${RARITY_COLORS[selectedEquipment.rarity]}`,
            marginBottom: '16px',
            boxShadow: `0 0 30px ${RARITY_COLORS[selectedEquipment.rarity]}30`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                color: '#a1a1aa',
                fontWeight: 'bold',
                border: `2px solid ${RARITY_COLORS[selectedEquipment.rarity]}`,
                boxShadow: `0 0 15px ${RARITY_COLORS[selectedEquipment.rarity]}50`,
              }}>
                {SLOT_NAMES[selectedSlot!]}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  color: RARITY_COLORS[selectedEquipment.rarity],
                  fontWeight: 'bold',
                  fontSize: '16px',
                  margin: '0 0 4px 0',
                  textShadow: `0 0 8px ${RARITY_COLORS[selectedEquipment.rarity]}50`,
                }}>
                  {selectedEquipment.name || '未知装备'}
                </h3>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <span style={{
                    color: '#00d4ff',
                    fontSize: '12px',
                    textShadow: '0 0 5px rgba(0, 212, 255, 0.5)',
                  }}>
                    强化 +{selectedEquipment.enhanceLevel || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* 成功率 - 科幻风格 */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '12px',
              padding: '12px',
              marginBottom: '12px',
              border: '1px solid rgba(244, 63, 94, 0.2)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: '#a1a1aa', fontSize: '14px' }}>强化成功率</span>
                <span style={{
                  color: getSuccessRateColor(preview.successRate),
                  fontWeight: 'bold',
                  fontSize: '22px',
                  textShadow: `0 0 10px ${getSuccessRateColor(preview.successRate)}50`,
                }}>
                  {Math.round(preview.successRate * 100)}%
                </span>
              </div>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '9999px',
                height: '8px',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  background: `linear-gradient(90deg, ${getSuccessRateColor(preview.successRate)}80, ${getSuccessRateColor(preview.successRate)})`,
                  width: `${preview.successRate * 100}%`,
                  boxShadow: `0 0 10px ${getSuccessRateColor(preview.successRate)}`,
                }} />
              </div>
            </div>

            {/* 当前属性 */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '12px',
              padding: '12px',
              marginBottom: '12px',
              border: '1px solid rgba(0, 212, 255, 0.2)',
            }}>
              <h4 style={{ color: '#00d4ff', fontSize: '12px', marginBottom: '8px', textShadow: '0 0 5px rgba(0, 212, 255, 0.3)' }}>属性提升预览</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', fontSize: '13px' }}>
                {(preview.attributePreview.attack.current > 0 || preview.attributePreview.attack.after > 0) ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#a1a1aa' }}>攻击</span>
                    <span style={{ color: '#f87171' }}>
                      {preview.attributePreview.attack.current} → <span style={{ color: '#4ade80' }}>{preview.attributePreview.attack.after}</span>
                    </span>
                  </div>
                ) : null}
                {(preview.attributePreview.defense.current > 0 || preview.attributePreview.defense.after > 0) ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#a1a1aa' }}>防御</span>
                    <span style={{ color: '#60a5fa' }}>
                      {preview.attributePreview.defense.current} → <span style={{ color: '#4ade80' }}>{preview.attributePreview.defense.after}</span>
                    </span>
                  </div>
                ) : null}
                {(preview.attributePreview.maxHp.current > 0 || preview.attributePreview.maxHp.after > 0) ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#a1a1aa' }}>生命</span>
                    <span style={{ color: '#ef4444' }}>
                      {preview.attributePreview.maxHp.current} → <span style={{ color: '#4ade80' }}>{preview.attributePreview.maxHp.after}</span>
                    </span>
                  </div>
                ) : null}
                {(preview.attributePreview.speed.current > 0 || preview.attributePreview.speed.after > 0) ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#a1a1aa' }}>攻速</span>
                    <span style={{ color: '#00d4ff' }}>
                      {preview.attributePreview.speed.current} → <span style={{ color: '#4ade80' }}>{preview.attributePreview.speed.after}</span>
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            {/* 强化费用 */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '12px',
              padding: '12px',
              marginBottom: '12px',
              border: '1px solid rgba(245, 158, 11, 0.2)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#a1a1aa', fontSize: '14px' }}>强化石消耗</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#a1a1aa', fontSize: '12px' }}>
                    拥有: {gameManager.inventory.getItem('mat_enhance_stone')?.quantity || 0}
                  </span>
                  <span style={{
                    color: preview.hasEnoughStones ? '#4ade80' : '#ef4444',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    textShadow: preview.hasEnoughStones ? '0 0 5px rgba(74, 222, 128, 0.5)' : '0 0 5px rgba(239, 68, 68, 0.5)',
                  }}>
                    需要: {preview.stoneCost || 0} 个
                  </span>
                </div>
              </div>
            </div>

            {/* 强化按钮 */}
            {preview.canEnhance ? (
              <button
                onClick={handleEnhance}
                disabled={isEnhancing || !preview.hasEnoughStones}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: isEnhancing || !preview.hasEnoughStones
                    ? 'rgba(100, 100, 100, 0.3)'
                    : 'linear-gradient(135deg, rgba(244, 63, 94, 0.8), rgba(244, 63, 94, 0.4))',
                  color: isEnhancing || !preview.hasEnoughStones ? '#6b7280' : 'white',
                  fontWeight: 'bold',
                  borderRadius: '12px',
                  border: isEnhancing || !preview.hasEnoughStones ? '1px solid rgba(100,100,100,0.3)' : '1px solid rgba(244, 63, 94, 0.6)',
                  cursor: isEnhancing || !preview.hasEnoughStones ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: isEnhancing || !preview.hasEnoughStones ? 'none' : '0 0 20px rgba(244, 63, 94, 0.4)',
                  transition: 'all 0.3s ease',
                }}
              >
                {isEnhancing ? (
                  <>
                    <span style={{ animation: 'pulse 1s infinite' }}>⚡</span>
                    <span>强化中...</span>
                  </>
                ) : (
                  <>
                    <span>🔨</span>
                    <span>开始强化</span>
                  </>
                )}
              </button>
            ) : (
              <div style={{
                background: 'rgba(100, 100, 100, 0.2)',
                borderRadius: '12px',
                padding: '14px',
                textAlign: 'center',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}>
                <p style={{ color: '#ef4444', fontSize: '14px', fontWeight: 'bold', margin: 0, textShadow: '0 0 5px rgba(239, 68, 68, 0.3)' }}>
                  {preview.reason || '无法强化'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* 未选择装备提示 */}
        {selectedSlot && !selectedEquipment && (
          <div style={{
            background: 'rgba(0, 10, 20, 0.7)',
            backdropFilter: 'blur(8px)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>该槽位未装备物品</p>
          </div>
        )}
      </main>

      {/* 强化结果弹窗 - 科幻风格 */}
      {result && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(8px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}>
          <div style={{
            background: 'rgba(0, 10, 20, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '320px',
            padding: '28px',
            textAlign: 'center',
            border: `2px solid ${getResultColor(result.type)}`,
            boxShadow: `0 0 50px ${getResultColor(result.type)}40`,
          }}>
            <div style={{
              fontSize: '72px',
              marginBottom: '16px',
              textShadow: `0 0 30px ${getResultColor(result.type)}`,
              animation: 'bounce 0.5s ease',
            }}>
              {getResultIcon(result.type)}
            </div>
            <h3 style={{
              color: getResultColor(result.type),
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '8px',
              textShadow: `0 0 10px ${getResultColor(result.type)}50`,
            }}>
              {result.type === EnhanceResultType.SUCCESS ? '强化成功！' :
                result.type === EnhanceResultType.FAILURE_DOWNGRADE ? '强化失败！' : '强化失败'}
            </h3>
            <p style={{ color: '#d1d5db', fontSize: '14px', marginBottom: '20px' }}>
              {result.message}
            </p>
            {result.attributeGains && (
              <div style={{
                background: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '12px',
                padding: '12px',
                marginBottom: '20px',
                border: '1px solid rgba(74, 222, 128, 0.3)',
              }}>
                <p style={{ color: '#a1a1aa', fontSize: '12px', marginBottom: '8px' }}>获得属性提升</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
                  {result.attributeGains?.attack && result.attributeGains.attack > 0 && (
                    <span style={{ color: '#f87171', fontSize: '13px', textShadow: '0 0 5px rgba(248, 113, 113, 0.5)' }}>攻击 +{Math.floor(result.attributeGains.attack)}</span>
                  )}
                  {result.attributeGains?.defense && result.attributeGains.defense > 0 && (
                    <span style={{ color: '#60a5fa', fontSize: '13px', textShadow: '0 0 5px rgba(96, 165, 250, 0.5)' }}>防御 +{Math.floor(result.attributeGains.defense)}</span>
                  )}
                  {result.attributeGains?.speed && result.attributeGains.speed > 0 && (
                    <span style={{ color: '#00d4ff', fontSize: '13px', textShadow: '0 0 5px rgba(0, 212, 255, 0.5)' }}>攻速 +{result.attributeGains.speed.toFixed(1)}</span>
                  )}
                  {result.attributeGains?.maxHp && result.attributeGains.maxHp > 0 && (
                    <span style={{ color: '#ef4444', fontSize: '13px', textShadow: '0 0 5px rgba(239, 68, 68, 0.5)' }}>生命 +{Math.floor(result.attributeGains.maxHp)}</span>
                  )}
                </div>
              </div>
            )}
            <button
              onClick={closeResult}
              style={{
                width: '100%',
                padding: '14px',
                background: `linear-gradient(135deg, ${getResultColor(result.type)}80, ${getResultColor(result.type)}40)`,
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '10px',
                border: `1px solid ${getResultColor(result.type)}`,
                cursor: 'pointer',
                fontSize: '15px',
                boxShadow: `0 0 20px ${getResultColor(result.type)}40`,
              }}
            >
              确定
            </button>
          </div>
        </div>
      )}

      {/* CSS 动画 */}
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes bounce {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
