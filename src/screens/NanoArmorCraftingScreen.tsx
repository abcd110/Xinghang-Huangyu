// 星械锻造所 - 纳米战甲制造界面（优化版）
import { useState, useMemo, useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import { QuestConditionType } from '../core/QuestSystem';
import {
  NanoArmorSlot,
  NANO_ARMOR_SLOT_NAMES,
  NANO_ARMOR_SLOT_ICONS,
  getRecipeBySlot,
  ArmorQuality,
  ARMOR_QUALITY_NAMES,
  ARMOR_QUALITY_COLORS,
  calculateQualityMultiplier,
} from '../data/nanoArmorRecipes';
import { EquipmentSlot } from '../data/equipmentTypes';
import { ItemRarity } from '../data/types';
import type { EquipmentInstance } from '../core/EquipmentSystem';
import { QUALITY_SUFFIX, QUALITY_TO_RARITY } from '../data/constants';

interface NanoArmorCraftingScreenProps {
  onBack: () => void;
}

// NanoArmorSlot 到 EquipmentSlot 的映射
const SLOT_MAPPING: Record<NanoArmorSlot, EquipmentSlot> = {
  [NanoArmorSlot.HELMET]: EquipmentSlot.HEAD,
  [NanoArmorSlot.CHEST]: EquipmentSlot.BODY,
  [NanoArmorSlot.SHOULDER]: EquipmentSlot.SHOULDER,
  [NanoArmorSlot.ARM]: EquipmentSlot.ARM,
  [NanoArmorSlot.LEG]: EquipmentSlot.LEGS,
  [NanoArmorSlot.BOOT]: EquipmentSlot.FEET,
};

// 品质发光效果
const QUALITY_GLOW: Record<ArmorQuality, string> = {
  [ArmorQuality.STARDUST]: '0 0 10px rgba(156, 163, 175, 0.3)',
  [ArmorQuality.ALLOY]: '0 0 15px rgba(74, 222, 128, 0.4)',
  [ArmorQuality.CRYSTAL]: '0 0 20px rgba(96, 165, 250, 0.5)',
  [ArmorQuality.QUANTUM]: '0 0 25px rgba(192, 132, 252, 0.6)',
  [ArmorQuality.VOID]: '0 0 30px rgba(250, 204, 21, 0.7)',
};

// 套装效果展示组件
interface SetBonusDisplayProps {
  equippedCount: number;
}

function SetBonusDisplay({ equippedCount }: SetBonusDisplayProps) {
  const bonuses = [
    { count: 2, name: '能量共鸣', effect: '攻击 +10%', active: equippedCount >= 2 },
    { count: 4, name: '力场强化', effect: '攻击 +20%，暴击率 +5%', active: equippedCount >= 4 },
    { count: 6, name: '纳米觉醒', effect: '攻击 +35%，暴击率 +10%，战斗护盾', active: equippedCount >= 6 },
  ];

  return (
    <div style={{
      backgroundColor: '#1a1f3a',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid #2a3050',
    }}>
      <h3 style={{ color: '#f59e0b', fontSize: '14px', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        ⚡ 纳米战甲套装效果
        <span style={{ color: '#6b7280', fontSize: '12px', fontWeight: 'normal' }}>
          (当前: {equippedCount}/6)
        </span>
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {bonuses.map((bonus) => (
          <div
            key={bonus.count}
            style={{
              padding: '12px',
              backgroundColor: bonus.active ? 'rgba(245, 158, 11, 0.1)' : '#0f172a',
              borderRadius: '8px',
              border: `1px solid ${bonus.active ? 'rgba(245, 158, 11, 0.3)' : '#2a3050'}`,
              opacity: bonus.active ? 1 : 0.5,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{
                padding: '2px 8px',
                backgroundColor: bonus.active ? '#f59e0b' : '#374151',
                color: bonus.active ? '#000' : '#9ca3af',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 'bold',
              }}>
                {bonus.count}件套
              </span>
              <span style={{ color: bonus.active ? '#f59e0b' : '#9ca3af', fontSize: '13px', fontWeight: 'bold' }}>
                {bonus.name}
              </span>
              {bonus.active && <span style={{ color: '#4ade80', fontSize: '12px' }}>✓ 已激活</span>}
            </div>
            <p style={{ color: '#a1a1aa', fontSize: '12px', margin: 0 }}>{bonus.effect}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NanoArmorCraftingScreen({ onBack }: NanoArmorCraftingScreenProps) {
  const { gameManager, saveGame } = useGameStore();
  const [selectedSlot, setSelectedSlot] = useState<NanoArmorSlot>(NanoArmorSlot.HELMET);
  const [selectedQuality, setSelectedQuality] = useState<ArmorQuality>(ArmorQuality.STARDUST);
  const [craftingResult, setCraftingResult] = useState<{
    success: boolean;
    message: string;
    quality?: ArmorQuality;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'craft' | 'set'>('craft');

  const inventory = gameManager.inventory;

  // 获取当前选中的配方
  const recipe = useMemo(() => {
    return getRecipeBySlot(selectedSlot);
  }, [selectedSlot]);

  // 获取指定品质的材料ID
  const getQualityMaterialId = (baseId: string, quality: ArmorQuality): string => {
    return `${baseId}${QUALITY_SUFFIX[quality]}`;
  };

  // 获取材料数量（指定品质）
  const getMaterialQuantity = useCallback((baseMaterialId: string, quality: ArmorQuality): number => {
    const qualityId = getQualityMaterialId(baseMaterialId, quality);
    return inventory.getItem(qualityId)?.quantity ?? 0;
  }, [inventory]);

  // 检查是否可以制造（指定品质）
  const canCraft = useMemo(() => {
    if (!recipe) return false;
    return recipe.materials.every(m => getMaterialQuantity(m.itemId, selectedQuality) >= m.count);
  }, [recipe, selectedQuality, getMaterialQuantity]);

  // 计算已拥有的装备部位数量
  const equippedCount = useMemo(() => {
    return Object.values(NanoArmorSlot).filter(slot => {
      const slotRecipe = getRecipeBySlot(slot);
      return slotRecipe && inventory.equipment.some(e => e.id === slotRecipe.id);
    }).length;
  }, [inventory.equipment]);

  // 计算制造后的属性
  const calculateFinalStats = (baseStats: { attack?: number; defense: number; hp?: number; speed?: number; critRate?: number; critDamage?: number; hit?: number; dodge?: number }, quality: ArmorQuality) => {
    const multiplier = calculateQualityMultiplier(quality);
    return {
      attack: Math.floor((baseStats.attack || 0) * multiplier),
      defense: Math.floor((baseStats.defense || 0) * multiplier),
      hp: Math.floor((baseStats.hp || 0) * multiplier),
      speed: Math.round((baseStats.speed || 0) * multiplier * 10) / 10, // 攻速保留1位小数
      critRate: (baseStats.critRate || 0) * multiplier,
      critDamage: (baseStats.critDamage || 0) * multiplier,
      hit: Math.floor((baseStats.hit || 0) * multiplier),
      dodge: Math.floor((baseStats.dodge || 0) * multiplier),
    };
  };

  // 执行制造
  const handleCraft = async () => {
    if (!recipe || !canCraft) return;

    // 消耗材料（指定品质）
    let materialsConsumed = true;
    recipe.materials.forEach(m => {
      const qualityId = getQualityMaterialId(m.itemId, selectedQuality);
      const removed = inventory.removeItem(qualityId, m.count);
      if (!removed) materialsConsumed = false;
    });

    if (!materialsConsumed) {
      setCraftingResult({
        success: false,
        message: '材料消耗失败',
      });
      return;
    }

    // 计算最终属性
    const finalStats = calculateFinalStats(recipe.baseStats, selectedQuality);

    // 创建 EquipmentInstance
    const equipmentInstance: EquipmentInstance = {
      id: recipe.id,
      instanceId: `${recipe.id}_${selectedQuality}_${Date.now()}`,
      name: `${ARMOR_QUALITY_NAMES[selectedQuality]}${recipe.name}`,
      slot: SLOT_MAPPING[recipe.slot],
      rarity: QUALITY_TO_RARITY[selectedQuality],
      level: 1,
      stationId: 'station_1',
      stationNumber: 1,
      description: recipe.description,
      stats: {
        attack: finalStats.attack || 0,
        defense: finalStats.defense || 0,
        hp: finalStats.hp || 0,
        agility: finalStats.speed || 0,
        hit: finalStats.hit || 0,
        dodge: finalStats.dodge || 0,
        speed: finalStats.speed || 0,
        crit: Math.floor((finalStats.critRate || 0) * 100),
        critDamage: Math.floor((finalStats.critDamage || 0) * 100),
        penetration: 0,
        penetrationPercent: 0,
        trueDamage: 0,
        guard: 0,
        luck: 0,
      },
      effects: [],
      quantity: 1,
      equipped: false,
      enhanceLevel: 0,
      sublimationLevel: 0,
      isCrafted: true,
    };

    // 检查背包空间
    const usedSlots = inventory.items.length + inventory.equipment.length;
    const maxSlots = inventory.maxSlots;
    const remainingSlots = maxSlots - usedSlots;

    if (remainingSlots <= 0) {
      setCraftingResult({
        success: false,
        message: `背包已满 (${usedSlots}/${maxSlots})，请先清理背包`,
      });
      setTimeout(() => setCraftingResult(null), 4000);
      return;
    }

    // 添加到背包（使用 addEquipment）
    const added = inventory.addEquipment(equipmentInstance);

    if (added) {
      gameManager.updateQuestProgress(QuestConditionType.CRAFT, 'any', 1);
      setCraftingResult({
        success: true,
        message: `成功制造 ${equipmentInstance.name}！`,
        quality: selectedQuality,
      });
      await saveGame();
    } else {
      setCraftingResult({
        success: false,
        message: '添加装备失败，请检查背包空间',
      });
    }

    setTimeout(() => setCraftingResult(null), 4000);
  };

  // 部位选择按钮（优化版）
  const SlotButton = ({ slot }: { slot: NanoArmorSlot }) => {
    const isSelected = selectedSlot === slot;

    return (
      <button
        onClick={() => setSelectedSlot(slot)}
        style={{
          padding: '16px 12px',
          backgroundColor: isSelected ? 'rgba(0, 153, 204, 0.2)' : '#1a1f3a',
          border: `2px solid ${isSelected ? '#00d4ff' : '#2a3050'}`,
          borderRadius: '12px',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          minWidth: '70px',
          transition: 'all 0.2s ease',
          boxShadow: isSelected ? '0 0 20px rgba(0, 212, 255, 0.3)' : 'none',
        }}
      >
        <span style={{
          fontSize: '28px',
          filter: isSelected ? 'drop-shadow(0 0 8px rgba(0, 212, 255, 0.8))' : 'none',
        }}>
          {NANO_ARMOR_SLOT_ICONS[slot]}
        </span>
        <span style={{
          fontSize: '11px',
          color: isSelected ? '#00d4ff' : '#a1a1aa',
          fontWeight: isSelected ? 'bold' : 'normal',
        }}>
          {NANO_ARMOR_SLOT_NAMES[slot]}
        </span>
      </button>
    );
  };

  // 品质选择按钮（优化版）
  const QualityButton = ({ quality }: { quality: ArmorQuality }) => {
    const isSelected = selectedQuality === quality;
    // 检查当前选中的部位在该品质下材料是否满足
    const slotRecipe = selectedSlot ? getRecipeBySlot(selectedSlot) : null;
    const canCraftQuality = slotRecipe?.materials.every(m => getMaterialQuantity(m.itemId, quality) >= m.count) ?? false;

    return (
      <button
        onClick={() => setSelectedQuality(quality)}
        style={{
          padding: '10px 16px',
          backgroundColor: isSelected ? ARMOR_QUALITY_COLORS[quality] : 'rgba(26, 31, 58, 0.8)',
          border: `2px solid ${isSelected ? ARMOR_QUALITY_COLORS[quality] : 'transparent'}`,
          borderRadius: '8px',
          cursor: 'pointer',
          opacity: isSelected ? 1 : 0.8,
          transition: 'all 0.2s ease',
          boxShadow: isSelected ? QUALITY_GLOW[quality] : 'none',
          position: 'relative',
        }}
      >
        <span style={{
          fontSize: '13px',
          color: isSelected ? '#000' : ARMOR_QUALITY_COLORS[quality],
          fontWeight: isSelected ? 'bold' : 'normal',
        }}>
          {ARMOR_QUALITY_NAMES[quality]}
        </span>
        {/* 材料满足时显示绿色小点 */}
        {canCraftQuality && (
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '8px',
            height: '8px',
            backgroundColor: '#4ade80',
            borderRadius: '50%',
            boxShadow: '0 0 6px rgba(74, 222, 128, 0.8)',
          }} />
        )}
      </button>
    );
  };

  // 材料需求项（两行展示版）
  const MaterialRequirementItem = ({ itemId, name, count, showQuality = true }: { itemId: string; name: string; count: number; showQuality?: boolean }) => {
    const hasCount = getMaterialQuantity(itemId, selectedQuality);
    const isEnough = hasCount >= count;
    const qualityName = ARMOR_QUALITY_NAMES[selectedQuality];

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '10px 14px',
        backgroundColor: isEnough ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        borderRadius: '8px',
        border: `1px solid ${isEnough ? 'rgba(74, 222, 128, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
        transition: 'all 0.2s ease',
      }}>
        {/* 第一行：材料名称 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#e5e7eb', fontSize: '14px', fontWeight: 500 }}>{name}</span>
          <span style={{
            color: isEnough ? '#4ade80' : '#ef4444',
            fontSize: '14px',
            fontWeight: 'bold',
          }}>
            {hasCount}/{count}
          </span>
        </div>
        {/* 第二行：品质要求 */}
        {showQuality && (
          <span style={{ color: ARMOR_QUALITY_COLORS[selectedQuality], fontSize: '11px', marginTop: '4px' }}>
            品质要求: {qualityName}
          </span>
        )}
        {!isEnough && (
          <span style={{
            display: 'block',
            fontSize: '10px',
            color: '#ef4444',
            marginTop: '2px',
          }}>
            缺 {count - hasCount} 个
          </span>
        )}
      </div>
    );
  };

  return (
    <div style={{
      height: '100vh',
      backgroundColor: '#0a0e27',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* 顶部标题栏 */}
      <header style={{
        flexShrink: 0,
        backgroundColor: '#1a1f3a',
        borderBottom: '1px solid #2a3050',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              color: '#a1a1aa',
              fontSize: '20px',
              cursor: 'pointer',
            }}
          >
            ←
          </button>
          <h1 style={{ color: '#00d4ff', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
            🔨 星械锻造所
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('craft')}
            style={{
              padding: '6px 12px',
              backgroundColor: activeTab === 'craft' ? '#0099cc' : '#374151',
              color: activeTab === 'craft' ? 'white' : '#a1a1aa',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            锻造
          </button>
          <button
            onClick={() => setActiveTab('set')}
            style={{
              padding: '6px 12px',
              backgroundColor: activeTab === 'set' ? '#0099cc' : '#374151',
              color: activeTab === 'set' ? 'white' : '#a1a1aa',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            套装
          </button>
        </div>
      </header>

      {/* 主内容区 */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
      }}>
        {activeTab === 'craft' ? (
          <>
            {/* 部位选择 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              marginBottom: '20px',
            }}>
              {Object.values(NanoArmorSlot).map(slot => (
                <SlotButton key={slot} slot={slot} />
              ))}
            </div>

            {/* 品质选择 */}
            <div style={{
              backgroundColor: '#1a1f3a',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '20px',
              border: '1px solid #2a3050',
            }}>
              <h3 style={{ color: '#a1a1aa', fontSize: '12px', margin: '0 0 12px 0' }}>选择品质</h3>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                flexWrap: 'wrap',
              }}>
                {[ArmorQuality.STARDUST, ArmorQuality.ALLOY, ArmorQuality.CRYSTAL, ArmorQuality.QUANTUM, ArmorQuality.VOID].map(quality => (
                  <QualityButton key={quality} quality={quality} />
                ))}
              </div>
            </div>

            {/* 当前选中配方详情 */}
            {recipe && (
              <div style={{
                backgroundColor: '#1a1f3a',
                borderRadius: '12px',
                padding: '16px',
                border: `1px solid ${ARMOR_QUALITY_COLORS[selectedQuality]}`,
                boxShadow: QUALITY_GLOW[selectedQuality],
              }}>
                {/* 配方标题 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #2a3050',
                }}>
                  <span style={{
                    fontSize: '40px',
                    filter: `drop-shadow(0 0 10px ${ARMOR_QUALITY_COLORS[selectedQuality]})`,
                  }}>
                    {NANO_ARMOR_SLOT_ICONS[recipe.slot]}
                  </span>
                  <div style={{ flex: 1 }}>
                    <h2 style={{
                      color: ARMOR_QUALITY_COLORS[selectedQuality],
                      fontSize: '18px',
                      fontWeight: 'bold',
                      margin: '0 0 4px 0',
                      textShadow: `0 0 10px ${ARMOR_QUALITY_COLORS[selectedQuality]}40`,
                    }}>
                      {ARMOR_QUALITY_NAMES[selectedQuality]}{recipe.name}
                    </h2>
                    <p style={{ color: '#a1a1aa', fontSize: '12px', margin: 0, lineHeight: 1.5 }}>
                      {recipe.description}
                    </p>
                  </div>
                </div>

                {/* 基础属性 */}
                <div style={{
                  backgroundColor: '#0f172a',
                  borderRadius: '10px',
                  padding: '14px',
                  marginBottom: '16px',
                }}>
                  <h3 style={{
                    color: '#00d4ff',
                    fontSize: '13px',
                    margin: '0 0 12px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    ⚔️ 属性预览
                    <span style={{
                      color: ARMOR_QUALITY_COLORS[selectedQuality],
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                    }}>
                      ×{calculateQualityMultiplier(selectedQuality).toFixed(1)}
                    </span>
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                    {recipe.baseStats.attack !== undefined && recipe.baseStats.attack > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#ef4444', fontSize: '16px' }}>⚔️</span>
                        <span style={{ color: '#ef4444', fontSize: '14px', fontWeight: 'bold' }}>
                          攻击 +{Math.floor(recipe.baseStats.attack * calculateQualityMultiplier(selectedQuality))}
                        </span>
                      </div>
                    )}
                    {recipe.baseStats.defense !== undefined && recipe.baseStats.defense > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#3b82f6', fontSize: '16px' }}>🛡️</span>
                        <span style={{ color: '#3b82f6', fontSize: '14px', fontWeight: 'bold' }}>
                          防御 +{Math.floor(recipe.baseStats.defense * calculateQualityMultiplier(selectedQuality))}
                        </span>
                      </div>
                    )}
                    {recipe.baseStats.hp !== undefined && recipe.baseStats.hp > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#22c55e', fontSize: '16px' }}>❤️</span>
                        <span style={{ color: '#22c55e', fontSize: '14px', fontWeight: 'bold' }}>
                          生命 +{Math.floor(recipe.baseStats.hp * calculateQualityMultiplier(selectedQuality))}
                        </span>
                      </div>
                    )}
                    {recipe.baseStats.speed !== undefined && recipe.baseStats.speed > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#f59e0b', fontSize: '16px' }}>⚡</span>
                        <span style={{ color: '#f59e0b', fontSize: '14px', fontWeight: 'bold' }}>
                          攻速 +{Math.round(recipe.baseStats.speed * calculateQualityMultiplier(selectedQuality) * 10) / 10}
                        </span>
                      </div>
                    )}
                    {recipe.baseStats.hit !== undefined && recipe.baseStats.hit > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#06b6d4', fontSize: '16px' }}>🎯</span>
                        <span style={{ color: '#06b6d4', fontSize: '14px', fontWeight: 'bold' }}>
                          命中 +{Math.floor(recipe.baseStats.hit * calculateQualityMultiplier(selectedQuality))}
                        </span>
                      </div>
                    )}
                    {recipe.baseStats.dodge !== undefined && recipe.baseStats.dodge > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#a855f7', fontSize: '16px' }}>💨</span>
                        <span style={{ color: '#a855f7', fontSize: '14px', fontWeight: 'bold' }}>
                          闪避 +{Math.floor(recipe.baseStats.dodge * calculateQualityMultiplier(selectedQuality))}
                        </span>
                      </div>
                    )}
                    {recipe.baseStats.critRate !== undefined && recipe.baseStats.critRate > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#f97316', fontSize: '16px' }}>💢</span>
                        <span style={{ color: '#f97316', fontSize: '14px', fontWeight: 'bold' }}>
                          暴击 +{(recipe.baseStats.critRate * calculateQualityMultiplier(selectedQuality) * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}
                    {recipe.baseStats.critDamage !== undefined && recipe.baseStats.critDamage > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#ec4899', fontSize: '16px' }}>💥</span>
                        <span style={{ color: '#ec4899', fontSize: '14px', fontWeight: 'bold' }}>
                          暴伤 +{(recipe.baseStats.critDamage * calculateQualityMultiplier(selectedQuality) * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 材料需求 */}
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{ color: '#e5e7eb', fontSize: '14px', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    📋 所需材料
                    <span style={{ color: ARMOR_QUALITY_COLORS[selectedQuality], fontSize: '12px' }}>
                      ({ARMOR_QUALITY_NAMES[selectedQuality]})
                    </span>
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {recipe.materials.map(m => (
                      <MaterialRequirementItem
                        key={m.itemId}
                        itemId={m.itemId}
                        name={m.name}
                        count={m.count}
                      />
                    ))}
                  </div>
                </div>

                {/* 制造按钮 */}
                <button
                  onClick={handleCraft}
                  disabled={!canCraft}
                  style={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: canCraft ? ARMOR_QUALITY_COLORS[selectedQuality] : '#374151',
                    color: canCraft ? '#000' : '#6b7280',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: canCraft ? 'pointer' : 'not-allowed',
                    boxShadow: canCraft ? QUALITY_GLOW[selectedQuality] : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {canCraft ? (
                    <span>🔨 锻造 {ARMOR_QUALITY_NAMES[selectedQuality]}{recipe.name}</span>
                  ) : (
                    <span>⚠️ 材料不足</span>
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <SetBonusDisplay equippedCount={equippedCount} />
        )}
      </main>

      {/* 制造结果提示 */}
      {craftingResult && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '20px 28px',
          backgroundColor: craftingResult.success ? 'rgba(6, 95, 70, 0.95)' : 'rgba(127, 29, 29, 0.95)',
          borderRadius: '12px',
          zIndex: 100,
          border: `2px solid ${craftingResult.success ? '#4ade80' : '#f87171'}`,
          boxShadow: craftingResult.success ? '0 0 30px rgba(74, 222, 128, 0.5)' : '0 0 30px rgba(248, 113, 113, 0.5)',
        }}>
          <p style={{
            color: craftingResult.success ? '#4ade80' : '#f87171',
            fontWeight: 'bold',
            margin: 0,
            fontSize: '16px',
          }}>
            {craftingResult.success ? '✓' : '✗'} {craftingResult.message}
          </p>
          {craftingResult.quality && (
            <p style={{
              color: ARMOR_QUALITY_COLORS[craftingResult.quality],
              fontSize: '14px',
              margin: '8px 0 0 0',
              fontWeight: 'bold',
            }}>
              品质: {ARMOR_QUALITY_NAMES[craftingResult.quality]}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
