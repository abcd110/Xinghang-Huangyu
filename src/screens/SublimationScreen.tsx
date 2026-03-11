import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { EquipmentSlot, EquipmentRarity, SLOT_NAMES } from '../data/equipmentTypes';
import { equipmentSystem } from '../core/EquipmentSystem';
import { ItemRarity, RARITY_COLORS, RARITY_NAMES } from '../data/types';
import { calculateEquipmentStats } from '../core/EquipmentStatCalculator';
import { SciFiButton } from '../components/SciFiButton';
import { QuestConditionType } from '../core/QuestSystem';
import 舰桥背景 from '../assets/images/舰桥背景.jpg';

interface SublimationScreenProps {
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

export default function SublimationScreen({ onBack }: SublimationScreenProps) {
  const { gameManager, saveGame } = useGameStore();
  const player = gameManager.player;

  const [selectedSlot, setSelectedSlot] = useState<EquipmentSlot | null>(null);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // 获取当前选中的装备
  const selectedEquipment = selectedSlot ? player.getEquipmentBySlot(selectedSlot) : null;

  // 获取升华成功率
  const getSublimationRate = (level: number) => {
    return equipmentSystem.getSublimationSuccessRate(level);
  };

  // 执行升华
  const handleSublimate = async () => {
    if (!selectedEquipment) return;

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const successRate = getSublimationRate(selectedEquipment.sublimationLevel);
    // 使用 crypto.getRandomValues 生成随机数（在事件处理中安全）
    const randomBytes = new Uint32Array(1);
    crypto.getRandomValues(randomBytes);
    const randomValue = randomBytes[0] / 0xFFFFFFFF;
    const success = randomValue < successRate;

    const cost = calculateSublimationCost(selectedEquipment.rarity);
    const consumeSuccess = player.consumeSpirit(cost);
    if (consumeSuccess) {
      const updated = equipmentSystem.sublimateEquipment(selectedEquipment, success);
      player.equipMythologyItem(updated);

      if (success) {
        gameManager.updateQuestProgress(QuestConditionType.SUBLIMATE, 'any', 1);
      }

      setResult({
        success,
        message: success
          ? `升华成功！${selectedEquipment.name} 达到 升华+${updated.sublimationLevel}`
          : '升华失败，装备未提升'
      });

      await saveGame();
    } else {
      setResult({
        success: false,
        message: '神能值不足'
      });
    }

    setIsProcessing(false);
  };

  // 根据装备品质获取升华所需神能值
  const getSpiritCostByRarity = (rarity: ItemRarity): number => {
    switch (rarity) {
      case ItemRarity.COMMON: return 10;
      case ItemRarity.UNCOMMON: return 20;
      case ItemRarity.RARE: return 40;
      case ItemRarity.EPIC: return 60;
      case ItemRarity.LEGENDARY: return 80;
      case ItemRarity.MYTHIC: return 100;
      default: return 10;
    }
  };

  // 计算升华费用
  const calculateSublimationCost = (rarity: ItemRarity) => {
    return getSpiritCostByRarity(rarity);
  };

  // 获取成功率颜色
  const getSuccessRateColor = (rate: number): string => {
    if (rate >= 0.8) return '#22c55e';
    if (rate >= 0.6) return '#00d4ff';
    if (rate >= 0.4) return '#fbbf24';
    return '#ef4444';
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
        backgroundImage: `url(${舰桥背景})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 0,
      }} />

      {/* 扫描线效果 - 金色主题 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, transparent 0%, rgba(251, 191, 36, 0.02) 50%, transparent 100%)',
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
        background: 'rgba(20, 15, 0, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(251, 191, 36, 0.4)',
        padding: '12px 16px',
        boxShadow: '0 0 20px rgba(251, 191, 36, 0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <SciFiButton onClick={onBack} label="◀ 返回" variant="default" />
          <h1 style={{
            color: '#fbbf24',
            fontWeight: 'bold',
            fontSize: '18px',
            textShadow: '0 0 15px rgba(251, 191, 36, 0.6)',
          }}>✨ 升华圣殿</h1>
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
        {/* 神能值显示 - 科幻风格 */}
        <div style={{
          background: 'rgba(0, 10, 20, 0.7)',
          backdropFilter: 'blur(8px)',
          borderRadius: '12px',
          padding: '14px 18px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1px solid rgba(192, 132, 252, 0.3)',
          boxShadow: '0 0 15px rgba(192, 132, 252, 0.1)',
        }}>
          <span style={{ color: '#a1a1aa', fontSize: '14px' }}>当前神能值</span>
          <span style={{
            color: '#c084fc',
            fontWeight: 'bold',
            fontSize: '18px',
            textShadow: '0 0 10px rgba(192, 132, 252, 0.5)',
          }}>
            🔮 {player.spirit}/{player.maxSpirit}
          </span>
        </div>

        {/* 装备选择 - 科幻风格 */}
        <div style={{
          background: 'rgba(0, 10, 20, 0.7)',
          backdropFilter: 'blur(8px)',
          borderRadius: '16px',
          padding: '16px',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          marginBottom: '16px',
          boxShadow: '0 0 20px rgba(251, 191, 36, 0.1)',
        }}>
          <h3 style={{
            color: '#fbbf24',
            fontSize: '14px',
            marginBottom: '12px',
            textShadow: '0 0 8px rgba(251, 191, 36, 0.4)',
          }}>
            选择装备槽位
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {ARMOR_SLOTS.map(slot => {
              const equippedItem = player.getEquipmentBySlot(slot);
              const isSelected = selectedSlot === slot;

              return (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  style={{
                    aspectRatio: '1',
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.3), rgba(251, 191, 36, 0.1))'
                      : 'rgba(0, 0, 0, 0.5)',
                    border: `2px solid ${isSelected ? '#fbbf24' : (equippedItem ? RARITY_COLORS[equippedItem.rarity] : 'rgba(255,255,255,0.1)')}`,
                    borderRadius: '12px',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 0 20px rgba(251, 191, 36, 0.4)' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <span style={{
                    fontSize: '13px',
                    color: isSelected ? '#fbbf24' : '#a1a1aa',
                    fontWeight: 'bold',
                    textShadow: isSelected ? '0 0 5px rgba(251, 191, 36, 0.5)' : 'none',
                  }}>
                    {SLOT_NAMES[slot]}
                  </span>
                  {equippedItem ? (
                    <>
                      <span style={{
                        fontSize: '9px',
                        color: RARITY_COLORS[equippedItem.rarity],
                        textAlign: 'center',
                        marginTop: '4px',
                      }}>
                        {equippedItem.name}
                      </span>
                      <span style={{
                        fontSize: '8px',
                        color: '#c084fc',
                        textShadow: '0 0 5px rgba(192, 132, 252, 0.5)',
                      }}>
                        升华+{equippedItem.sublimationLevel}
                      </span>
                    </>
                  ) : (
                    <span style={{ fontSize: '9px', color: '#6b7280', marginTop: '4px' }}>
                      未装备
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 选中装备详情 - 科幻风格 */}
        {selectedEquipment && (
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
                {SLOT_NAMES[selectedEquipment.slot]}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  color: RARITY_COLORS[selectedEquipment.rarity],
                  fontWeight: 'bold',
                  fontSize: '16px',
                  margin: '0 0 4px 0',
                  textShadow: `0 0 8px ${RARITY_COLORS[selectedEquipment.rarity]}50`,
                }}>
                  {selectedEquipment.name}
                </h3>
                <p style={{ color: '#a1a1aa', fontSize: '12px', margin: 0 }}>
                  {RARITY_NAMES[selectedEquipment.rarity]} · 星球{selectedEquipment.stationNumber}
                </p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <span style={{
                    color: '#00d4ff',
                    fontSize: '12px',
                    textShadow: '0 0 5px rgba(0, 212, 255, 0.5)',
                  }}>
                    强化 +{selectedEquipment.enhanceLevel}
                  </span>
                  <span style={{
                    color: '#c084fc',
                    fontSize: '12px',
                    textShadow: '0 0 5px rgba(192, 132, 252, 0.5)',
                  }}>
                    升华 +{selectedEquipment.sublimationLevel}
                  </span>
                </div>
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
              <h4 style={{ color: '#00d4ff', fontSize: '12px', marginBottom: '8px', textShadow: '0 0 5px rgba(0, 212, 255, 0.3)' }}>当前属性</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', fontSize: '13px' }}>
                {(() => {
                  const stats = calculateEquipmentStats(selectedEquipment);
                  const items = [];
                  if (stats.attack > 0) {
                    items.push(
                      <div key="attack" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#a1a1aa' }}>攻击</span>
                        <span style={{ color: '#f87171' }}>{stats.attack}</span>
                      </div>
                    );
                  }
                  if (stats.defense > 0) {
                    items.push(
                      <div key="defense" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#a1a1aa' }}>防御</span>
                        <span style={{ color: '#60a5fa' }}>{stats.defense}</span>
                      </div>
                    );
                  }
                  if (stats.hp > 0) {
                    items.push(
                      <div key="hp" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#a1a1aa' }}>生命</span>
                        <span style={{ color: '#ef4444' }}>{stats.hp}</span>
                      </div>
                    );
                  }
                  if (stats.speed > 0) {
                    items.push(
                      <div key="speed" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#a1a1aa' }}>攻速</span>
                        <span style={{ color: '#00d4ff' }}>{stats.speed.toFixed(1)}</span>
                      </div>
                    );
                  }
                  return items;
                })()}
              </div>
            </div>

            {/* 升华信息 */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '12px',
              padding: '12px',
              marginBottom: '12px',
              border: '1px solid rgba(251, 191, 36, 0.2)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: '#a1a1aa', fontSize: '14px' }}>升华成功率</span>
                <span style={{
                  color: getSuccessRateColor(getSublimationRate(selectedEquipment.sublimationLevel)),
                  fontWeight: 'bold',
                  fontSize: '22px',
                  textShadow: `0 0 10px ${getSuccessRateColor(getSublimationRate(selectedEquipment.sublimationLevel))}50`,
                }}>
                  {Math.round(getSublimationRate(selectedEquipment.sublimationLevel) * 100)}%
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
                  background: `linear-gradient(90deg, ${getSuccessRateColor(getSublimationRate(selectedEquipment.sublimationLevel))}80, ${getSuccessRateColor(getSublimationRate(selectedEquipment.sublimationLevel))})`,
                  width: `${getSublimationRate(selectedEquipment.sublimationLevel) * 100}%`,
                  boxShadow: `0 0 10px ${getSuccessRateColor(getSublimationRate(selectedEquipment.sublimationLevel))}`,
                }} />
              </div>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '12px',
              padding: '12px',
              marginBottom: '12px',
              border: '1px solid rgba(192, 132, 252, 0.2)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#a1a1aa', fontSize: '14px' }}>升华费用</span>
                <span style={{
                  color: '#c084fc',
                  fontWeight: 'bold',
                  textShadow: '0 0 5px rgba(192, 132, 252, 0.5)',
                }}>
                  {calculateSublimationCost(selectedEquipment.rarity)} 神能
                </span>
              </div>
            </div>

            <button
              onClick={handleSublimate}
              disabled={isProcessing || selectedEquipment.sublimationLevel >= 10}
              style={{
                width: '100%',
                padding: '16px',
                background: isProcessing
                  ? 'rgba(100, 100, 100, 0.3)'
                  : selectedEquipment.sublimationLevel >= 10
                    ? 'rgba(100, 100, 100, 0.3)'
                    : 'linear-gradient(135deg, rgba(251, 191, 36, 0.8), rgba(251, 191, 36, 0.4))',
                color: isProcessing || selectedEquipment.sublimationLevel >= 10 ? '#6b7280' : 'white',
                fontWeight: 'bold',
                borderRadius: '12px',
                border: isProcessing || selectedEquipment.sublimationLevel >= 10
                  ? '1px solid rgba(100,100,100,0.3)'
                  : '1px solid rgba(251, 191, 36, 0.6)',
                cursor: isProcessing || selectedEquipment.sublimationLevel >= 10 ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: isProcessing || selectedEquipment.sublimationLevel >= 10
                  ? 'none'
                  : '0 0 20px rgba(251, 191, 36, 0.4)',
                transition: 'all 0.3s ease',
              }}
            >
              {isProcessing ? (
                <>
                  <span style={{ animation: 'pulse 1s infinite' }}>✨</span>
                  <span>升华中...</span>
                </>
              ) : selectedEquipment.sublimationLevel >= 10 ? (
                <>
                  <span>✓</span>
                  <span>已达到最高等级</span>
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span>开始升华</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* 未选择装备提示 */}
        {!selectedEquipment && selectedSlot && (
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

      {/* 结果弹窗 - 科幻风格 */}
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
            border: `2px solid ${result.success ? '#22c55e' : '#ef4444'}`,
            boxShadow: `0 0 50px ${result.success ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
          }}>
            <div style={{
              fontSize: '72px',
              marginBottom: '16px',
              textShadow: `0 0 30px ${result.success ? '#22c55e' : '#ef4444'}`,
              animation: 'bounce 0.5s ease',
            }}>
              {result.success ? '✨' : '💥'}
            </div>
            <h3 style={{
              color: result.success ? '#22c55e' : '#ef4444',
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '8px',
              textShadow: `0 0 10px ${result.success ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`,
            }}>
              {result.success ? '升华成功！' : '升华失败'}
            </h3>
            <p style={{ color: '#d1d5db', fontSize: '14px', marginBottom: '20px' }}>
              {result.message}
            </p>
            <button
              onClick={() => setResult(null)}
              style={{
                width: '100%',
                padding: '14px',
                background: `linear-gradient(135deg, ${result.success ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'}, ${result.success ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'})`,
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '10px',
                border: `1px solid ${result.success ? '#22c55e' : '#ef4444'}`,
                cursor: 'pointer',
                fontSize: '15px',
                boxShadow: `0 0 20px ${result.success ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
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
