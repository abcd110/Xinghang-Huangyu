import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import { ItemType, RARITY_COLORS } from '../data/types';
import type { InventoryItem } from '../data/types';
import { EquipmentSlot } from '../data/equipmentTypes';
import { EnhanceResultType, type EnhancePreview, type EnhanceResult } from '../core/EnhanceSystem';

interface EnhanceScreenProps {
  onBack: () => void;
}

const SLOT_NAMES: Record<EquipmentSlot, string> = {
  [EquipmentSlot.HEAD]: '头部',
  [EquipmentSlot.BODY]: '身体',
  [EquipmentSlot.LEGS]: '腿部',
  [EquipmentSlot.FEET]: '脚部',
  [EquipmentSlot.WEAPON]: '武器',
  [EquipmentSlot.ACCESSORY]: '饰品',
};

export default function EnhanceScreen({ onBack }: EnhanceScreenProps) {
  const { gameManager, getEnhancePreview, enhanceItem, getInventory } = useGameStore();
  const player = gameManager.player;
  const [refreshKey, setRefreshKey] = useState(0);
  const inventory = getInventory();

  const [selectedSlot, setSelectedSlot] = useState<EquipmentSlot | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [preview, setPreview] = useState<EnhancePreview | null>(null);
  const [result, setResult] = useState<EnhanceResult | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);

  // 强制刷新
  const forceRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  // 获取槽位中的装备（优先检查已装备的神话装备，然后检查背包中的装备）
  const getEquipmentInSlot = (slot: EquipmentSlot): InventoryItem | null => {
    // 1. 检查已装备的神话装备
    const equippedMythology = player.getEquipmentBySlot(slot);
    if (equippedMythology) {
      return equippedMythology as unknown as InventoryItem;
    }

    // 2. 检查背包中的装备（未装备的）
    // 装备可能通过 slot 字段或 type 字段标识
    const itemInInventory = inventory.items.find(item => {
      // 检查 slot 字段（制造系统添加的）
      if (item.slot === slot) return true;

      // 检查 type 字段（旧装备系统）
      if (slot === EquipmentSlot.WEAPON && item.type === ItemType.WEAPON) return true;
      if (slot === EquipmentSlot.ACCESSORY && item.type === ItemType.ACCESSORY) return true;
      if (slot === EquipmentSlot.BODY && item.type === ItemType.ARMOR) return true;

      return false;
    });

    return itemInInventory || null;
  };

  // 当前选中的装备
  const selectedEquipment = selectedSlot ? getEquipmentInSlot(selectedSlot) : null;

  // 当选择槽位时，自动选择装备
  useEffect(() => {
    if (selectedSlot) {
      const equipment = getEquipmentInSlot(selectedSlot);
      setSelectedItem(equipment);
    } else {
      setSelectedItem(null);
    }
  }, [selectedSlot, refreshKey]);

  // 当选择物品时更新预览
  const updatePreview = useCallback(() => {
    if (selectedItem) {
      const previewData = getEnhancePreview(selectedItem.id);
      setPreview(previewData);
    } else {
      setPreview(null);
    }
  }, [selectedItem, getEnhancePreview]);

  useEffect(() => {
    updatePreview();
  }, [updatePreview]);

  const handleEnhance = async () => {
    if (!selectedItem || !preview?.canEnhance) return;

    setIsEnhancing(true);

    // 模拟强化动画延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    const enhanceResult = enhanceItem(selectedItem.id, false);
    setResult(enhanceResult);
    setIsEnhancing(false);

    // 强制刷新
    forceRefresh();

    // 刷新预览
    const newPreview = getEnhancePreview(selectedItem.id);
    setPreview(newPreview);
  };

  const closeResult = () => {
    setResult(null);
    // 强制刷新
    forceRefresh();
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 0.8) return '#4ade80';
    if (rate >= 0.6) return '#fbbf24';
    if (rate >= 0.4) return '#fb923c';
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
        return '#4ade80';
      case EnhanceResultType.FAILURE_DOWNGRADE:
        return '#ef4444';
      default:
        return '#9ca3af';
    }
  };

  return (
    <div style={{
      height: '100vh',
      backgroundColor: '#1a1a1a',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 顶部标题栏 */}
      <header style={{
        flexShrink: 0,
        backgroundColor: '#2d2d2d',
        borderBottom: '1px solid #4b5563',
        padding: '12px 16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#9ca3af',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            <span>←</span>
            <span>返回</span>
          </button>
          <h1 style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>🔨 装备强化</h1>
          <div style={{ width: '48px' }} />
        </div>
      </header>

      {/* 主内容区 */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px'
      }}>
        {/* 金币显示 */}
        <div style={{
          backgroundColor: '#2d2d2d',
          borderRadius: '12px',
          padding: '12px 16px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{ color: '#9ca3af', fontSize: '14px' }}>持有列车币</span>
          <span style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '16px' }}>
            💰 {gameManager.trainCoins}
          </span>
        </div>

        {/* 装备槽位选择 */}
        <div style={{
          backgroundColor: '#2d2d2d',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid #374151',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {Object.values(EquipmentSlot).map(slot => {
              const equipment = getEquipmentInSlot(slot);
              const isSelected = selectedSlot === slot;
              const hasEquipment = !!equipment;

              return (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  style={{
                    aspectRatio: '1',
                    backgroundColor: isSelected ? '#1f2937' : '#374151',
                    border: `2px solid ${isSelected ? '#d97706' : (hasEquipment ? RARITY_COLORS[equipment.rarity] : '#4b5563')}`,
                    borderRadius: '8px',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: 'bold', marginBottom: '4px' }}>{SLOT_NAMES[slot]}</span>
                  {equipment ? (
                    <>
                      <span style={{
                        fontSize: '10px',
                        color: RARITY_COLORS[equipment.rarity],
                        textAlign: 'center',
                        lineHeight: '1.2'
                      }}>
                        {equipment.name || '未知装备'}
                      </span>
                      <span style={{ fontSize: '9px', color: '#fbbf24', marginTop: '2px' }}>
                        +{equipment.enhanceLevel || 0}
                      </span>
                    </>
                  ) : (
                    <span style={{ fontSize: '10px', color: '#6b7280' }}>
                      未装备
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 选中装备详情 */}
        {selectedEquipment && preview && (
          <div style={{
            backgroundColor: '#2d2d2d',
            borderRadius: '12px',
            padding: '16px',
            border: `2px solid ${RARITY_COLORS[selectedEquipment.rarity]}`,
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                backgroundColor: '#1f2937',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: '#9ca3af',
                fontWeight: 'bold',
                border: `2px solid ${RARITY_COLORS[selectedEquipment.rarity]}`
              }}>
                {SLOT_NAMES[selectedSlot!]}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  color: RARITY_COLORS[selectedEquipment.rarity],
                  fontWeight: 'bold',
                  fontSize: '16px',
                  margin: '0 0 4px 0'
                }}>
                  {selectedEquipment.name || '未知装备'}
                </h3>
                <p style={{ color: '#9ca3af', fontSize: '12px', margin: 0 }}>
                  {(selectedEquipment as any).rarity || '普通'} · 站台{(selectedEquipment as any).stationNumber || 0}
                </p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <span style={{ color: '#fbbf24', fontSize: '12px' }}>
                    强化 +{selectedEquipment.enhanceLevel || 0}
                  </span>
                </div>
              </div>
            </div>

            {preview.canEnhance ? (
              <>
                {/* 成功率 */}
                <div style={{
                  backgroundColor: '#1f2937',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: '#9ca3af', fontSize: '14px' }}>强化成功率</span>
                    <span style={{
                      color: getSuccessRateColor(preview.successRate),
                      fontWeight: 'bold',
                      fontSize: '20px'
                    }}>
                      {Math.round(preview.successRate * 100)}%
                    </span>
                  </div>
                  <div style={{
                    backgroundColor: '#374151',
                    borderRadius: '9999px',
                    height: '8px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      backgroundColor: getSuccessRateColor(preview.successRate),
                      width: `${preview.successRate * 100}%`
                    }} />
                  </div>
                </div>

                {/* 当前属性 */}
                <div style={{
                  backgroundColor: '#1f2937',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '12px'
                }}>
                  <h4 style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '8px' }}>当前属性</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', fontSize: '13px' }}>
                    {preview.attributePreview.attack.current > 0 ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#9ca3af' }}>攻击</span>
                        <span style={{ color: '#f87171' }}>{preview.attributePreview.attack.current}</span>
                      </div>
                    ) : null}
                    {preview.attributePreview.defense.current > 0 ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#9ca3af' }}>防御</span>
                        <span style={{ color: '#60a5fa' }}>{preview.attributePreview.defense.current}</span>
                      </div>
                    ) : null}
                    {preview.attributePreview.agility.current > 0 ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#9ca3af' }}>敏捷</span>
                        <span style={{ color: '#4ade80' }}>{preview.attributePreview.agility.current}</span>
                      </div>
                    ) : null}
                    {preview.attributePreview.speed.current > 0 ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#9ca3af' }}>攻速</span>
                        <span style={{ color: '#fbbf24' }}>{preview.attributePreview.speed.current}</span>
                      </div>
                    ) : null}
                    {preview.attributePreview.maxHp.current > 0 ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#9ca3af' }}>生命</span>
                        <span style={{ color: '#ef4444' }}>{preview.attributePreview.maxHp.current}</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* 强化费用 */}
                <div style={{
                  backgroundColor: '#1f2937',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {/* 强化石 */}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#9ca3af', fontSize: '14px' }}>强化石</span>
                      <span style={{
                        color: preview.materialCost[0]?.hasEnough ? '#4ade80' : '#ef4444',
                        fontWeight: 'bold'
                      }}>
                        {preview.materialCost[0]?.quantity || 0} 个
                      </span>
                    </div>
                    {/* 列车币 */}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#9ca3af', fontSize: '14px' }}>列车币</span>
                      <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>
                        {preview.goldCost}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 强化按钮 */}
                <button
                  onClick={handleEnhance}
                  disabled={isEnhancing || !preview.hasEnoughGold || !preview.materialCost[0]?.hasEnough}
                  style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: isEnhancing || !preview.hasEnoughGold || !preview.materialCost[0]?.hasEnough ? '#374151' : '#d97706',
                    color: isEnhancing || !preview.hasEnoughGold || !preview.materialCost[0]?.hasEnough ? '#6b7280' : 'white',
                    fontWeight: 'bold',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: isEnhancing || !preview.hasEnoughGold || !preview.materialCost[0]?.hasEnough ? 'not-allowed' : 'pointer',
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {isEnhancing ? (
                    <>
                      <span>⚡</span>
                      <span>强化中...</span>
                    </>
                  ) : (
                    <>
                      <span>🔨</span>
                      <span>开始强化</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <div style={{
                backgroundColor: '#1f2937',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                  {preview.reason || '无法强化'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* 未选择装备提示 */}
        {selectedSlot && !selectedEquipment && (
          <div style={{
            backgroundColor: '#2d2d2d',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              该槽位未装备物品
            </p>
          </div>
        )}
      </main>

      {/* 强化结果弹窗 */}
      {result && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#2d2d2d',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '300px',
            padding: '24px',
            textAlign: 'center',
            border: `2px solid ${getResultColor(result.type)}`
          }}>
            <div style={{
              fontSize: '64px',
              marginBottom: '16px'
            }}>
              {getResultIcon(result.type)}
            </div>
            <h3 style={{
              color: getResultColor(result.type),
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '8px'
            }}>
              {result.type === EnhanceResultType.SUCCESS ? '强化成功！' :
                result.type === EnhanceResultType.FAILURE_DOWNGRADE ? '强化失败！' : '强化失败'}
            </h3>
            <p style={{ color: '#d1d5db', fontSize: '14px', marginBottom: '16px' }}>
              {result.message}
            </p>
            {result.attributeGains && (
              <div style={{
                backgroundColor: '#1f2937',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '16px'
              }}>
                <p style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '8px' }}>获得属性提升</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
                  {result.attributeGains.attack && result.attributeGains.attack > 0 && (
                    <span style={{ color: '#f87171', fontSize: '13px' }}>攻击 +{result.attributeGains.attack}</span>
                  )}
                  {result.attributeGains.defense && result.attributeGains.defense > 0 && (
                    <span style={{ color: '#60a5fa', fontSize: '13px' }}>防御 +{result.attributeGains.defense}</span>
                  )}
                  {result.attributeGains.agility && result.attributeGains.agility > 0 && (
                    <span style={{ color: '#4ade80', fontSize: '13px' }}>敏捷 +{result.attributeGains.agility}</span>
                  )}
                  {result.attributeGains.speed && result.attributeGains.speed > 0 && (
                    <span style={{ color: '#fbbf24', fontSize: '13px' }}>攻速 +{result.attributeGains.speed}</span>
                  )}
                  {result.attributeGains.maxHp && result.attributeGains.maxHp > 0 && (
                    <span style={{ color: '#f87171', fontSize: '13px' }}>生命 +{result.attributeGains.maxHp}</span>
                  )}
                </div>
              </div>
            )}
            <button
              onClick={closeResult}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: getResultColor(result.type),
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              确定
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
