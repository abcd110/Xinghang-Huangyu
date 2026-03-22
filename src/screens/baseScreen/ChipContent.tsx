import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { Chip, ChipSlot, ChipRarity, CHIP_RARITY_CONFIG, CHIP_MAIN_STAT_CONFIG, CHIP_SUB_STAT_CONFIG, CHIP_SET_CONFIG, getRerollCost, getUpgradeCost } from '../../core/ChipSystem';
import { ChipCraftPanel } from './ChipCraftPanel';
import { ConfirmDialog } from './shared';
import { colors } from './styles';

type FilterType = 'all' | 'equipped' | 'unequipped';

const SLOT_CONFIG = {
  [ChipSlot.SLOT_1]: { name: '1号位', stat: '生命', icon: '❤️', color: '#ef4444' },
  [ChipSlot.SLOT_2]: { name: '2号位', stat: '攻击', icon: '⚔️', color: '#f59e0b' },
  [ChipSlot.SLOT_3]: { name: '3号位', stat: '随机', icon: '🎲', color: '#3b82f6' },
  [ChipSlot.SLOT_4]: { name: '4号位', stat: '随机', icon: '🎲', color: '#22c55e' },
};

const GLOW_INTENSITY = {
  [ChipRarity.RARE]: { shadow: '0 0 8px', border: 'rgba(59, 130, 246, 0.6)' },
  [ChipRarity.EPIC]: { shadow: '0 0 15px', border: 'rgba(168, 85, 247, 0.7)' },
  [ChipRarity.LEGENDARY]: { shadow: '0 0 25px', border: 'rgba(245, 158, 11, 0.8)' },
};

const SUB_STAT_RANGE: Record<string, string> = {
  '生命': '(50-200)',
  '攻击': '(10-30)',
  '防御': '(1-10)',
  '暴击率': '(1%-5%)',
  '爆伤': '(3%-18%)',
  '生命%': '(5%-20%)',
  '攻击%': '(3%-12%)',
  '防御%': '(1%-6%)',
  '命中': '(5-20)',
  '闪避': '(1%-5%)',
};

export function ChipContent() {
  const { gameManager, saveGame, craftChip, upgradeChip, equipChip, unequipChip, decomposeChip, decomposeChips, rerollChipSubStat, toggleChipLock, getChipSetBonuses, getChipStatBonus, showToast } = useGameStore();
  const [activeTab, setActiveTab] = useState<'slots' | 'craft'>('slots');
  const [selectedChip, setSelectedChip] = useState<Chip | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<ChipSlot | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [confirmDialog, setConfirmDialog] = useState<{ show: boolean; title: string; content: string; onConfirm: () => void; onCancel: () => void } | null>(null);
  const [batchMode, setBatchMode] = useState(false);
  const [selectedChipIds, setSelectedChipIds] = useState<Set<string>>(new Set());

  const chips = gameManager.getChips();
  const equippedChips = gameManager.getEquippedChips();
  const maxSlots = gameManager.getAvailableChipSlots();
  const setBonuses = getChipSetBonuses();
  const totalStats = getChipStatBonus();

  const showMessage = (text: string, type: 'success' | 'error') => {
    showToast(text, type);
  };

  const handleCraft = async (slot: ChipSlot, rarity: ChipRarity) => {
    const result = craftChip(slot, rarity);
    if (result.success) { showMessage(`成功制作${CHIP_RARITY_CONFIG[rarity].name}芯片`, 'success'); await saveGame(); }
    else { showMessage(result.message, 'error'); }
  };

  const handleUpgrade = async (chipId: string, count: number) => {
    const result = upgradeChip(chipId, count);
    if (result.success) { showMessage(`升级到Lv.${result.newLevel}`, 'success'); await saveGame(); }
    else { showMessage(result.message, 'error'); }
  };

  const handleEquip = async (chipId: string) => {
    const result = equipChip(chipId);
    if (result.success) { showMessage(result.message, 'success'); await saveGame(); }
    else { showMessage(result.message, 'error'); }
  };

  const handleDecompose = async (chipId: string) => {
    const result = decomposeChip(chipId);
    if (result.success) { showMessage(`分解成功，获得${result.rewards}`, 'success'); setSelectedChip(null); await saveGame(); }
    else { showMessage(result.message, 'error'); }
  };

  const handleReroll = async (chipId: string, subStatIndex: number) => {
    const result = rerollChipSubStat(chipId, subStatIndex);
    if (result.success) { showMessage(result.message, 'success'); await saveGame(); }
    else { showMessage(result.message, 'error'); }
  };

  const handleToggleLock = async (chipId: string) => {
    const result = toggleChipLock(chipId);
    if (result.success) { showMessage(result.message, 'success'); await saveGame(); }
    else { showMessage(result.message, 'error'); }
  };

  const handleBatchDecompose = async () => {
    const ids = Array.from(selectedChipIds);
    if (ids.length === 0) {
      showMessage('请选择要分解的芯片', 'error');
      return;
    }
    const result = decomposeChips(ids);
    if (result.success) {
      showMessage(result.message, 'success');
      setSelectedChipIds(new Set());
      setBatchMode(false);
      await saveGame();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const toggleChipSelection = (chipId: string) => {
    const newSet = new Set(selectedChipIds);
    if (newSet.has(chipId)) {
      newSet.delete(chipId);
    } else {
      newSet.add(chipId);
    }
    setSelectedChipIds(newSet);
  };

  const getEquippedChipForSlot = (slot: ChipSlot): Chip | undefined => {
    const chipId = gameManager.equippedChips[slot];
    return chips.find(c => c.id === chipId);
  };

  const getFilteredChips = () => {
    let filtered = chips;
    if (filter === 'equipped') {
      filtered = chips.filter(c => Object.values(gameManager.equippedChips).includes(c.id));
    } else if (filter === 'unequipped') {
      filtered = chips.filter(c => !Object.values(gameManager.equippedChips).includes(c.id));
    }
    if (selectedSlot) {
      filtered = filtered.filter(c => c.slot === selectedSlot);
    }
    return filtered;
  };

  const renderSlotGrid = () => (
    <div style={{ marginBottom: '16px' }}>
      <style>{`
        @keyframes hexGlow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.2); }
        }
        @keyframes scanLine {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .hex-slot {
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          position: relative;
          overflow: hidden;
        }
        .hex-slot::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, transparent 0%, rgba(0, 212, 255, 0.1) 50%, transparent 100%);
          animation: scanLine 3s linear infinite;
        }
        .hex-slot.equipped::after {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(45deg, transparent 30%, currentColor 50%, transparent 70%);
          opacity: 0.3;
          animation: hexGlow 2s ease-in-out infinite;
        }
      `}</style>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', padding: '8px' }}>
        {[ChipSlot.SLOT_1, ChipSlot.SLOT_2, ChipSlot.SLOT_3, ChipSlot.SLOT_4].map(slot => {
          const equipped = getEquippedChipForSlot(slot);
          const config = SLOT_CONFIG[slot];
          const isSelected = selectedSlot === slot;
          const glowColor = equipped ? CHIP_RARITY_CONFIG[equipped.rarity].color : config.color;
          
          return (
            <div
              key={slot}
              onClick={() => { setSelectedSlot(isSelected ? null : slot); setSelectedChip(null); }}
              className={`hex-slot ${equipped ? 'equipped' : ''}`}
              style={{
                aspectRatio: '1',
                background: equipped
                  ? `linear-gradient(135deg, ${CHIP_RARITY_CONFIG[equipped.rarity].color}30, ${CHIP_RARITY_CONFIG[equipped.rarity].color}10)`
                  : isSelected 
                    ? `linear-gradient(135deg, ${config.color}30, ${config.color}10)`
                    : 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                border: equipped ? 'none' : `2px solid ${isSelected ? config.color : 'rgba(255,255,255,0.1)'}`,
                boxShadow: equipped 
                  ? `${GLOW_INTENSITY[equipped.rarity].shadow} ${glowColor}, inset 0 0 20px ${glowColor}20`
                  : isSelected 
                    ? `0 0 10px ${config.color}50`
                    : 'none',
                color: glowColor,
                transition: 'all 0.3s ease',
              }}
            >
              <span style={{ fontSize: '20px', filter: 'drop-shadow(0 0 4px currentColor)' }}>
                {equipped ? SLOT_CONFIG[equipped.slot].icon : config.icon}
              </span>
              <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#fff', textShadow: '0 0 5px currentColor' }}>
                {config.name}
              </span>
              {equipped && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <span style={{ 
                    fontSize: '8px', 
                    color: CHIP_RARITY_CONFIG[equipped.rarity].color,
                    fontWeight: 'bold',
                    textShadow: `0 0 5px ${CHIP_RARITY_CONFIG[equipped.rarity].color}`,
                  }}>
                    Lv.{equipped.level}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderChipCard = (chip: Chip) => {
    const isEquipped = Object.values(gameManager.equippedChips).includes(chip.id);
    const config = SLOT_CONFIG[chip.slot];
    const glowConfig = GLOW_INTENSITY[chip.rarity];
    const rarityColor = CHIP_RARITY_CONFIG[chip.rarity].color;
    const isSelected = selectedChipIds.has(chip.id);
    const canSelect = batchMode && !isEquipped && !chip.locked;
    
    return (
      <div
        key={chip.id}
        onClick={() => {
          if (canSelect) {
            toggleChipSelection(chip.id);
          } else if (!batchMode) {
            setSelectedChip(chip);
          }
        }}
        style={{
          position: 'relative',
          padding: '12px',
          background: `
            linear-gradient(135deg, ${rarityColor}15, transparent 50%),
            repeating-linear-gradient(0deg, transparent, transparent 2px, ${rarityColor}05 2px, ${rarityColor}05 4px),
            linear-gradient(180deg, rgba(10,10,20,0.9), rgba(5,5,15,0.95))
          `,
          borderRadius: '12px',
          border: isSelected 
            ? `2px solid #22c55e`
            : `1px solid ${glowConfig.border}`,
          marginBottom: '8px',
          cursor: canSelect || !batchMode ? 'pointer' : 'default',
          boxShadow: isSelected 
            ? `0 0 15px rgba(34, 197, 94, 0.4)`
            : `${glowConfig.shadow} ${rarityColor}40`,
          transition: 'all 0.3s ease',
          overflow: 'hidden',
          opacity: batchMode && !canSelect ? 0.5 : 1,
        }}
      >
        {isSelected && (
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '20px',
            height: '20px',
            background: '#22c55e',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 'bold',
          }}>
            ✓
          </div>
        )}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${rarityColor}, transparent)`,
        }} />
        
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: `linear-gradient(135deg, ${config.color}30, ${config.color}10)`,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            flexShrink: 0,
            border: `1px solid ${config.color}40`,
            boxShadow: `0 0 10px ${config.color}30`,
          }}>
            {config.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <span style={{ 
                color: rarityColor, 
                fontSize: '13px', 
                fontWeight: 'bold',
                textShadow: `0 0 8px ${rarityColor}`,
              }}>
                {CHIP_RARITY_CONFIG[chip.rarity].name}
              </span>
              <span style={{ 
                color: '#fff', 
                fontSize: '11px',
                background: `${rarityColor}30`,
                padding: '2px 6px',
                borderRadius: '4px',
                border: `1px solid ${rarityColor}50`,
              }}>Lv.{chip.level}</span>
              {chip.locked && <span style={{ fontSize: '12px' }}>🔒</span>}
              {isEquipped && (
                <span style={{ 
                  color: '#22c55e', 
                  fontSize: '10px', 
                  background: 'rgba(34, 197, 94, 0.2)', 
                  padding: '2px 6px', 
                  borderRadius: '4px',
                  border: '1px solid rgba(34, 197, 94, 0.4)',
                  boxShadow: '0 0 8px rgba(34, 197, 94, 0.3)',
                }}>
                  已装备
                </span>
              )}
              {chip.setId && (
                <span style={{ 
                  fontSize: '12px',
                  filter: 'drop-shadow(0 0 4px currentColor)',
                  color: CHIP_SET_CONFIG[chip.setId].color,
                }}>
                  {CHIP_SET_CONFIG[chip.setId].icon}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                color: '#00d4ff', 
                fontSize: '11px', 
                fontWeight: 'bold',
                textShadow: '0 0 5px rgba(0, 212, 255, 0.5)',
              }}>
                主:{CHIP_MAIN_STAT_CONFIG[chip.mainStat].name}+{chip.mainStatValue}
              </span>
              {chip.subStats.length > 0 && (
                <>
                  <span style={{ color: '#4b5563', fontSize: '10px' }}>|</span>
                  {chip.subStats.filter(sub => CHIP_SUB_STAT_CONFIG[sub.stat]).map((sub, idx) => (
                    <span key={idx} style={{ color: '#9ca3af', fontSize: '10px' }}>
                      {CHIP_SUB_STAT_CONFIG[sub.stat].name}+{sub.value}
                    </span>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderChipList = () => {
    const filteredChips = getFilteredChips();
    const selectableChips = filteredChips.filter(c => 
      !Object.values(gameManager.equippedChips).includes(c.id) && !c.locked
    );
    
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ 
            color: '#00d4ff', 
            fontSize: '12px',
            textShadow: '0 0 5px rgba(0, 212, 255, 0.5)',
          }}>
            ◈ {selectedSlot ? `${SLOT_CONFIG[selectedSlot].name}` : '全部芯片'} ({filteredChips.length})
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {selectedSlot && (
              <button
                onClick={() => setSelectedSlot(null)}
                style={{
                  padding: '4px 10px',
                  background: 'rgba(0, 212, 255, 0.1)',
                  border: '1px solid rgba(0, 212, 255, 0.3)',
                  borderRadius: '6px',
                  color: '#00d4ff',
                  fontSize: '10px',
                  cursor: 'pointer',
                }}
              >
                显示全部
              </button>
            )}
            {!batchMode && selectableChips.length > 0 && (
              <button
                onClick={() => setBatchMode(true)}
                style={{
                  padding: '4px 10px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '6px',
                  color: '#f87171',
                  fontSize: '10px',
                  cursor: 'pointer',
                }}
              >
                批量分解
              </button>
            )}
          </div>
        </div>

        {batchMode && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '10px',
            padding: '10px',
            marginBottom: '12px',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#f87171', fontSize: '11px' }}>
                已选择 {selectedChipIds.size} 个芯片
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    const allIds = selectableChips.map(c => c.id);
                    setSelectedChipIds(new Set(allIds));
                  }}
                  style={{
                    padding: '4px 8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '10px',
                    cursor: 'pointer',
                  }}
                >
                  全选
                </button>
                <button
                  onClick={() => setSelectedChipIds(new Set())}
                  style={{
                    padding: '4px 8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '10px',
                    cursor: 'pointer',
                  }}
                >
                  取消
                </button>
                <button
                  onClick={() => setConfirmDialog({
                    show: true,
                    title: '批量分解',
                    content: `确定分解选中的 ${selectedChipIds.size} 个芯片？`,
                    onConfirm: () => { handleBatchDecompose(); setConfirmDialog(null); },
                    onCancel: () => setConfirmDialog(null),
                  })}
                  disabled={selectedChipIds.size === 0}
                  style={{
                    padding: '4px 8px',
                    background: selectedChipIds.size > 0 
                      ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.5), rgba(239, 68, 68, 0.3))'
                      : 'rgba(100, 100, 100, 0.3)',
                    border: '1px solid rgba(239, 68, 68, 0.5)',
                    borderRadius: '4px',
                    color: selectedChipIds.size > 0 ? '#fff' : '#666',
                    fontSize: '10px',
                    cursor: selectedChipIds.size > 0 ? 'pointer' : 'not-allowed',
                  }}
                >
                  确认分解
                </button>
                <button
                  onClick={() => { setBatchMode(false); setSelectedChipIds(new Set()); }}
                  style={{
                    padding: '4px 8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    color: '#9ca3af',
                    fontSize: '10px',
                    cursor: 'pointer',
                  }}
                >
                  退出
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          {(['all', 'equipped', 'unequipped'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                flex: 1,
                padding: '8px',
                background: filter === f 
                  ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 212, 255, 0.05))'
                  : 'rgba(255, 255, 255, 0.02)',
                border: filter === f 
                  ? '1px solid rgba(0, 212, 255, 0.5)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                color: filter === f ? '#00d4ff' : '#6b7280',
                fontSize: '11px',
                cursor: 'pointer',
                boxShadow: filter === f ? '0 0 10px rgba(0, 212, 255, 0.2)' : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              {f === 'all' ? '全部' : f === 'equipped' ? '已装备' : '未装备'}
            </button>
          ))}
        </div>

        <div style={{ maxHeight: '320px', overflowY: 'auto', paddingRight: '4px' }}>
          {filteredChips.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              color: '#4b5563', 
              fontSize: '12px', 
              padding: '40px 20px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '12px',
              border: '1px dashed rgba(255,255,255,0.1)',
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px', opacity: 0.5 }}>💾</div>
              暂无芯片
            </div>
          ) : (
            filteredChips.map(chip => renderChipCard(chip))
          )}
        </div>
      </div>
    );
  };

  const renderBottomPanel = () => {
    if (!selectedChip) return null;

    const isEquipped = Object.values(gameManager.equippedChips).includes(selectedChip.id);
    const canUpgrade = selectedChip.level < CHIP_RARITY_CONFIG[selectedChip.rarity].maxLevel;
    const upgradeCost = canUpgrade ? getUpgradeCost(selectedChip.level) : null;
    const hasUpgradeResources = upgradeCost && 
      gameManager.trainCoins >= upgradeCost.credits &&
      (gameManager.inventory.getItem('chip_material')?.quantity || 0) >= upgradeCost.materials;
    const rarityColor = CHIP_RARITY_CONFIG[selectedChip.rarity].color;
    const glowConfig = GLOW_INTENSITY[selectedChip.rarity];

    return (
      <div
        onClick={() => setSelectedChip(null)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(12px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        <style>{`
          @keyframes slideUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes holoScan {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes pulseGlow {
            0%, 100% { box-shadow: 0 0 20px ${rarityColor}40; }
            50% { box-shadow: 0 0 40px ${rarityColor}60; }
          }
          @keyframes buttonPulse {
            0%, 100% { box-shadow: 0 0 5px currentColor; }
            50% { box-shadow: 0 0 15px currentColor; }
          }
        `}</style>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '430px',
            background: `
              linear-gradient(180deg, rgba(15, 15, 30, 0.98) 0%, rgba(5, 5, 15, 0.99) 100%)
            `,
            borderRadius: '24px 24px 0 0',
            padding: '20px',
            borderTop: `3px solid ${rarityColor}`,
            borderLeft: `1px solid ${rarityColor}30`,
            borderRight: `1px solid ${rarityColor}30`,
            animation: 'slideUp 0.3s ease-out',
            boxShadow: `${glowConfig.shadow} ${rarityColor}30`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '60px',
            background: `linear-gradient(180deg, ${rarityColor}15, transparent)`,
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${rarityColor}, transparent)`,
            animation: 'holoScan 2s linear infinite',
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: `linear-gradient(135deg, ${rarityColor}30, ${rarityColor}10)`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                border: `2px solid ${rarityColor}50`,
                boxShadow: `0 0 15px ${rarityColor}40`,
              }}>
                {SLOT_CONFIG[selectedChip.slot].icon}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ 
                    color: rarityColor, 
                    fontWeight: 'bold', 
                    fontSize: '16px',
                    textShadow: `0 0 10px ${rarityColor}`,
                  }}>
                    {CHIP_RARITY_CONFIG[selectedChip.rarity].name}
                  </span>
                  <span style={{ 
                    color: '#fff', 
                    fontSize: '12px',
                    background: `${rarityColor}30`,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    border: `1px solid ${rarityColor}50`,
                  }}>Lv.{selectedChip.level}</span>
                  {selectedChip.locked && <span style={{ fontSize: '14px' }}>🔒</span>}
                </div>
                {selectedChip.setId && (
                  <div style={{ 
                    color: CHIP_SET_CONFIG[selectedChip.setId].color, 
                    fontSize: '12px',
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <span style={{ filter: 'drop-shadow(0 0 4px currentColor)' }}>
                      {CHIP_SET_CONFIG[selectedChip.setId].icon}
                    </span>
                    {CHIP_SET_CONFIG[selectedChip.setId].name}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setSelectedChip(null)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{
              padding: '12px',
              background: `linear-gradient(135deg, ${rarityColor}10, transparent)`,
              borderRadius: '12px',
              marginBottom: '12px',
              border: `1px solid ${rarityColor}30`,
            }}>
              <div style={{ color: '#6b7280', fontSize: '10px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                ◈ 主属性
              </div>
              <div style={{ 
                color: '#00d4ff', 
                fontSize: '16px', 
                fontWeight: 'bold',
                textShadow: '0 0 8px rgba(0, 212, 255, 0.5)',
              }}>
                {CHIP_MAIN_STAT_CONFIG[selectedChip.mainStat].name} +{selectedChip.mainStatValue}
              </div>
            </div>

            <div style={{ color: '#6b7280', fontSize: '10px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              ◈ 副属性
            </div>
            {selectedChip.subStats.filter(sub => CHIP_SUB_STAT_CONFIG[sub.stat]).map((sub, idx) => {
              const config = CHIP_SUB_STAT_CONFIG[sub.stat];
              const rangeStr = SUB_STAT_RANGE[config.name] || '';
              return (
                <div
                  key={idx}
                  onClick={() => {
                    const rerollCost = getRerollCost(selectedChip);
                    const canReroll = !selectedChip.locked &&
                      gameManager.trainCoins >= rerollCost.credits &&
                      (gameManager.inventory.getItem('mineral_quantum')?.quantity || 0) >= rerollCost.materials;
                    if (canReroll) {
                      setConfirmDialog({
                        show: true,
                        title: '重随副属性',
                        content: `重随这个副属性？\n消耗: ${rerollCost.credits}信用点, ${rerollCost.materials}量子矿`,
                        onConfirm: () => { handleReroll(selectedChip.id, idx); setConfirmDialog(null); },
                        onCancel: () => setConfirmDialog(null),
                      });
                    }
                  }}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 12px',
                    background: selectedChip.locked 
                      ? 'rgba(100, 100, 100, 0.1)'
                      : 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                    borderRadius: '10px',
                    marginBottom: '6px',
                    cursor: selectedChip.locked ? 'default' : 'pointer',
                    opacity: selectedChip.locked ? 0.5 : 1,
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ color: '#d1d5db', fontSize: '12px' }}>{config.name} +{sub.value} <span style={{ color: '#6b7280', fontSize: '10px' }}>{rangeStr}</span></span>
                  {!selectedChip.locked && (
                    <span style={{ 
                      color: '#a855f7', 
                      fontSize: '10px',
                      background: 'rgba(168, 85, 247, 0.2)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}>
                      🎲 重随
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {canUpgrade && upgradeCost && (
            <div style={{
              padding: '12px',
              background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(0, 212, 255, 0.02))',
              borderRadius: '12px',
              marginBottom: '16px',
              border: '1px solid rgba(0, 212, 255, 0.3)',
            }}>
              <div style={{ color: '#00d4ff', fontSize: '11px', marginBottom: '10px', fontWeight: 'bold' }}>
                升级芯片 Lv.{selectedChip.level} → Lv.{selectedChip.level + 1}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#9ca3af' }}>信用点</span>
                  <span style={{ 
                    color: gameManager.trainCoins >= upgradeCost.credits ? '#22c55e' : '#ef4444',
                  }}>
                    {gameManager.trainCoins >= upgradeCost.credits ? '✓' : '✗'} {upgradeCost.credits} (拥有: {gameManager.trainCoins})
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#9ca3af' }}>芯片材料</span>
                  <span style={{ 
                    color: (gameManager.inventory.getItem('chip_material')?.quantity || 0) >= upgradeCost.materials ? '#22c55e' : '#ef4444',
                  }}>
                    {(gameManager.inventory.getItem('chip_material')?.quantity || 0) >= upgradeCost.materials ? '✓' : '✗'} {upgradeCost.materials} (拥有: {gameManager.inventory.getItem('chip_material')?.quantity || 0})
                  </span>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {isEquipped ? (
              <button
                onClick={() => { 
                  const slot = Object.entries(gameManager.equippedChips).find(([_, id]) => id === selectedChip.id)?.[0] as ChipSlot;
                  if (slot) unequipChip(slot);
                  setSelectedChip(null);
                }}
                style={{
                  padding: '14px',
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.1))',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  borderRadius: '12px',
                  color: '#f87171',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: '0 0 15px rgba(239, 68, 68, 0.3)',
                }}
              >
                📤 卸下
              </button>
            ) : (
              <button
                onClick={() => { handleEquip(selectedChip.id); setSelectedChip(null); }}
                style={{
                  padding: '14px',
                  background: `linear-gradient(135deg, ${rarityColor}, ${rarityColor}aa)`,
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: `0 0 20px ${rarityColor}40`,
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                }}
              >
                ⚔️ 装备
              </button>
            )}
            {canUpgrade && (
              <button
                onClick={() => handleUpgrade(selectedChip.id, 1)}
                disabled={!hasUpgradeResources}
                style={{
                  padding: '14px',
                  background: hasUpgradeResources 
                    ? 'linear-gradient(135deg, #3b82f6, #3b82f6aa)'
                    : 'rgba(100, 100, 100, 0.3)',
                  border: 'none',
                  borderRadius: '12px',
                  color: hasUpgradeResources ? '#fff' : '#666',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  cursor: hasUpgradeResources ? 'pointer' : 'not-allowed',
                  boxShadow: hasUpgradeResources ? '0 0 15px rgba(59, 130, 246, 0.4)' : 'none',
                }}
              >
                ⬆️ 升级
              </button>
            )}
            <button
              onClick={() => handleToggleLock(selectedChip.id)}
              style={{
                padding: '14px',
                background: selectedChip.locked 
                  ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.3), rgba(251, 191, 36, 0.1))'
                  : 'rgba(255, 255, 255, 0.05)',
                border: selectedChip.locked 
                  ? '1px solid rgba(251, 191, 36, 0.5)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: selectedChip.locked ? '#fbbf24' : '#9ca3af',
                fontWeight: 'bold',
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: selectedChip.locked ? '0 0 10px rgba(251, 191, 36, 0.3)' : 'none',
              }}
            >
              {selectedChip.locked ? '🔓 解锁' : '🔒 锁定'}
            </button>
            <button
              onClick={() => setConfirmDialog({
                show: true,
                title: '分解芯片',
                content: `确定分解这个${CHIP_RARITY_CONFIG[selectedChip.rarity].name}芯片？`,
                onConfirm: () => { handleDecompose(selectedChip.id); setConfirmDialog(null); },
                onCancel: () => setConfirmDialog(null),
              })}
              disabled={selectedChip.locked}
              style={{
                padding: '14px',
                background: selectedChip.locked 
                  ? 'rgba(100, 100, 100, 0.2)'
                  : 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.1))',
                border: selectedChip.locked 
                  ? '1px solid rgba(100, 100, 100, 0.3)'
                  : '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '12px',
                color: selectedChip.locked ? '#666' : '#f87171',
                fontWeight: 'bold',
                fontSize: '13px',
                cursor: selectedChip.locked ? 'not-allowed' : 'pointer',
                boxShadow: selectedChip.locked ? 'none' : '0 0 10px rgba(239, 68, 68, 0.3)',
              }}
            >
              💥 分解
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderStatsSummary = () => {
    if (setBonuses.length === 0 && Object.keys(totalStats).length === 0) return null;

    return (
      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(0, 212, 255, 0.02))',
        borderRadius: '16px',
        padding: '14px',
        marginBottom: '16px',
        border: '1px solid rgba(0, 212, 255, 0.2)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.5), transparent)',
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ 
            color: '#00d4ff', 
            fontSize: '12px', 
            fontWeight: 'bold',
            textShadow: '0 0 5px rgba(0, 212, 255, 0.5)',
          }}>
            ◈ 属性加成
          </span>
          <span style={{ 
            color: '#fff', 
            fontSize: '11px',
            background: 'rgba(0, 212, 255, 0.2)',
            padding: '2px 8px',
            borderRadius: '6px',
          }}>
            {equippedChips.length}/{maxSlots} 已装备
          </span>
        </div>
        {setBonuses.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
            {setBonuses.map((bonus, idx) => {
              const setConfig = CHIP_SET_CONFIG[bonus.set];
              return (
                <span key={idx} style={{
                  color: setConfig.color,
                  fontSize: '10px',
                  background: `${setConfig.color}20`,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: `1px solid ${setConfig.color}40`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  <span style={{ filter: 'drop-shadow(0 0 3px currentColor)' }}>{setConfig.icon}</span>
                  {bonus.count}件
                </span>
              );
            })}
          </div>
        )}
        {Object.keys(totalStats).length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {Object.entries(totalStats).slice(0, 4).map(([stat, value]) => (
              <span key={stat} style={{ color: '#d1d5db', fontSize: '11px' }}>
                <span style={{ color: '#00d4ff' }}>{stat}</span> +{typeof value === 'number' ? value.toFixed(1) : value}
              </span>
            ))}
            {Object.keys(totalStats).length > 4 && (
              <span style={{ color: '#6b7280', fontSize: '11px' }}>
                +{Object.keys(totalStats).length - 4}项
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ position: 'relative' }}>
      {confirmDialog && <ConfirmDialog {...confirmDialog} />}

      {renderStatsSummary()}

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <button
          onClick={() => setActiveTab('slots')}
          style={{
            flex: 1,
            padding: '12px',
            background: activeTab === 'slots' 
              ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 212, 255, 0.05))'
              : 'rgba(255, 255, 255, 0.02)',
            border: activeTab === 'slots' 
              ? '1px solid rgba(0, 212, 255, 0.5)'
              : '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            color: activeTab === 'slots' ? '#00d4ff' : '#6b7280',
            fontWeight: 'bold',
            fontSize: '12px',
            cursor: 'pointer',
            boxShadow: activeTab === 'slots' ? '0 0 15px rgba(0, 212, 255, 0.2)' : 'none',
            transition: 'all 0.3s ease',
          }}
        >
          💾 芯片槽位
        </button>
        <button
          onClick={() => setActiveTab('craft')}
          style={{
            flex: 1,
            padding: '12px',
            background: activeTab === 'craft' 
              ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 212, 255, 0.05))'
              : 'rgba(255, 255, 255, 0.02)',
            border: activeTab === 'craft' 
              ? '1px solid rgba(0, 212, 255, 0.5)'
              : '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            color: activeTab === 'craft' ? '#00d4ff' : '#6b7280',
            fontWeight: 'bold',
            fontSize: '12px',
            cursor: 'pointer',
            boxShadow: activeTab === 'craft' ? '0 0 15px rgba(0, 212, 255, 0.2)' : 'none',
            transition: 'all 0.3s ease',
          }}
        >
          🔨 制作芯片
        </button>
      </div>

      {activeTab === 'slots' && (
        <>
          {renderSlotGrid()}
          {renderChipList()}
        </>
      )}

      {activeTab === 'craft' && <ChipCraftPanel gameManager={gameManager} onCraft={handleCraft} />}

      {renderBottomPanel()}
    </div>
  );
}
