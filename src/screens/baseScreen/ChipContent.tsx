import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import type { GameManager } from '../../core/GameManager';
import { Chip, ChipSlot, ChipRarity, CHIP_RARITY_CONFIG, CHIP_MAIN_STAT_CONFIG, CHIP_SUB_STAT_CONFIG, CHIP_SET_CONFIG, getRerollCost, getUpgradeCost } from '../../core/ChipSystem';
import { getItemName } from './utils';
import { ChipCraftPanel } from './ChipCraftPanel';
import { ConfirmDialog, type MessageState } from './shared';
import { styles, colors } from './styles';

export function ChipContent() {
  const { gameManager, saveGame, craftChip, upgradeChip, equipChip, decomposeChip, rerollChipSubStat, toggleChipLock, getChipSetBonuses, getChipStatBonus, showToast } = useGameStore();
  const [activeTab, setActiveTab] = useState<'slots' | 'craft'>('slots');
  const [selectedChip, setSelectedChip] = useState<Chip | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<ChipSlot | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ show: boolean; title: string; content: string; onConfirm: () => void; onCancel: () => void } | null>(null);

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

  const getEquippedChipForSlot = (slot: ChipSlot): Chip | undefined => {
    const chipId = gameManager.equippedChips[slot];
    return chips.find(c => c.id === chipId);
  };

  return (
    <div style={{ position: 'relative' }}>
      {confirmDialog && <ConfirmDialog {...confirmDialog} />}

      <div style={styles.statsBox(colors.chip)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
          <div><span style={styles.label}>芯片槽位: </span><span style={{ color: colors.chip, fontWeight: 'bold' }}>{equippedChips.length}/{maxSlots}</span></div>
          <div><span style={styles.label}>芯片数量: </span><span style={{ color: colors.chip, fontWeight: 'bold' }}>{chips.length}</span></div>
        </div>
      </div>

      {setBonuses.length > 0 && (
        <div style={styles.statsBox(colors.chip)}>
          <div style={{ color: colors.chip, fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>套装效果</div>
          {setBonuses.map((bonus, idx) => {
            const setConfig = CHIP_SET_CONFIG[bonus.set];
            return (
              <div key={idx} style={{ marginBottom: '4px' }}>
                <div style={{ color: setConfig.color, fontSize: '11px', fontWeight: 'bold' }}>{setConfig.icon} {setConfig.name} ({bonus.count}件)</div>
                {bonus.bonuses.map((b, i) => <div key={i} style={{ ...styles.label, fontSize: '10px', marginLeft: '16px' }}>{b}</div>)}
              </div>
            );
          })}
        </div>
      )}

      {Object.keys(totalStats).length > 0 && (
        <div style={styles.statsBox(colors.chip)}>
          <div style={{ color: colors.chip, fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>总属性加成</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {Object.entries(totalStats).map(([stat, value]) => (
              <div key={stat} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
                <span style={{ color: colors.chip }}>{stat}:</span>
                <span style={{ color: '#fff' }}>+{typeof value === 'number' ? value.toFixed(1) : value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button onClick={() => setActiveTab('slots')} style={styles.tabButton(activeTab === 'slots', colors.chip)}>💾 芯片槽位</button>
        <button onClick={() => setActiveTab('craft')} style={styles.tabButton(activeTab === 'craft', colors.chip)}>🔨 制作芯片</button>
      </div>

      {activeTab === 'slots' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '12px' }}>
            {[ChipSlot.SLOT_1, ChipSlot.SLOT_2, ChipSlot.SLOT_3, ChipSlot.SLOT_4].map(slot => {
              const equipped = getEquippedChipForSlot(slot);
              const isSelected = selectedSlot === slot;
              return (
                <div key={slot} onClick={() => { setSelectedSlot(slot); if (equipped) setSelectedChip(equipped); }} style={{ padding: '12px', background: isSelected ? `${colors.info}20` : `${colors.chip}15`, borderRadius: '12px', border: isSelected ? `2px solid ${colors.info}` : (equipped ? `2px solid ${CHIP_RARITY_CONFIG[equipped.rarity].color}` : '1px solid rgba(255, 255, 255, 0.1)'), cursor: 'pointer' }}>
                  <div style={{ ...styles.label, fontSize: '11px', marginBottom: '4px' }}>{slot}号位 {slot === ChipSlot.SLOT_1 ? '(生命)' : slot === ChipSlot.SLOT_2 ? '(攻击)' : '(随机)'}</div>
                  {equipped ? (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span style={{ color: CHIP_RARITY_CONFIG[equipped.rarity].color, fontWeight: 'bold', fontSize: '12px' }}>{CHIP_RARITY_CONFIG[equipped.rarity].name}</span>
                        <span style={{ color: colors.chip, fontSize: '11px' }}>Lv.{equipped.level}</span>
                        {equipped.locked && <span style={{ color: colors.warning, fontSize: '10px' }}>🔒</span>}
                      </div>
                      <div style={{ color: '#fff', fontSize: '11px' }}>主属性: {CHIP_MAIN_STAT_CONFIG[equipped.mainStat].name} +{equipped.mainStatValue}</div>
                      {equipped.setId && <div style={{ color: CHIP_SET_CONFIG[equipped.setId].color, fontSize: '10px' }}>{CHIP_SET_CONFIG[equipped.setId].icon} {CHIP_SET_CONFIG[equipped.setId].name}</div>}
                    </div>
                  ) : <div style={{ color: '#666', fontSize: '12px' }}>空</div>}
                </div>
              );
            })}
          </div>

          <div style={{ ...styles.label, fontSize: '12px', marginBottom: '8px' }}>
            📦 芯片仓库 {selectedSlot ? `(${selectedSlot}号位)` : '(全部)'} ({chips.filter(c => !Object.values(gameManager.equippedChips).includes(c.id) && (!selectedSlot || c.slot === selectedSlot)).length})
            {selectedSlot && <button onClick={() => setSelectedSlot(null)} style={{ marginLeft: '8px', padding: '2px 8px', background: 'rgba(100, 100, 100, 0.3)', border: 'none', borderRadius: '4px', color: '#a1a1aa', fontSize: '10px', cursor: 'pointer' }}>显示全部</button>}
          </div>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {chips.filter(c => !Object.values(gameManager.equippedChips).includes(c.id) && (!selectedSlot || c.slot === selectedSlot)).map(chip => (
              <div key={chip.id} onClick={() => setSelectedChip(chip)} style={{ ...styles.cardBox(CHIP_RARITY_CONFIG[chip.rarity].color, selectedChip?.id === chip.id), padding: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ color: CHIP_RARITY_CONFIG[chip.rarity].color, fontWeight: 'bold', fontSize: '12px' }}>{CHIP_RARITY_CONFIG[chip.rarity].name}</span>
                    <span style={{ ...styles.label, fontSize: '11px', marginLeft: '8px' }}>{chip.slot}号位 Lv.{chip.level}</span>
                    {chip.locked && <span style={{ color: colors.warning, fontSize: '10px', marginLeft: '4px' }}>🔒</span>}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleEquip(chip.id); }} style={{ padding: '4px 8px', background: `linear-gradient(135deg, ${colors.chip}, #059669)`, border: 'none', borderRadius: '4px', color: '#fff', fontSize: '10px', cursor: 'pointer' }}>装备</button>
                </div>
                {chip.setId && <div style={{ color: CHIP_SET_CONFIG[chip.setId].color, fontSize: '10px', marginTop: '4px' }}>{CHIP_SET_CONFIG[chip.setId].icon} {CHIP_SET_CONFIG[chip.setId].name}</div>}
              </div>
            ))}
          </div>

          {selectedChip && (
            <div style={{ marginTop: '12px', padding: '12px', background: `${colors.chip}15`, borderRadius: '12px', border: `1px solid ${colors.chip}40` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ color: CHIP_RARITY_CONFIG[selectedChip.rarity].color, fontWeight: 'bold' }}>{CHIP_RARITY_CONFIG[selectedChip.rarity].name}芯片 Lv.{selectedChip.level}</div>
                <button onClick={() => handleToggleLock(selectedChip.id)} style={{ padding: '4px 8px', background: selectedChip.locked ? `${colors.warning}40` : 'rgba(100, 100, 100, 0.2)', border: selectedChip.locked ? `1px solid ${colors.warning}80` : '1px solid rgba(100, 100, 100, 0.3)', borderRadius: '4px', color: selectedChip.locked ? colors.warning : '#a1a1aa', fontSize: '10px', cursor: 'pointer' }}>{selectedChip.locked ? '🔒 已锁定' : '🔓 未锁定'}</button>
              </div>
              {selectedChip.setId && <div style={{ color: CHIP_SET_CONFIG[selectedChip.setId].color, fontSize: '11px', marginBottom: '8px' }}>{CHIP_SET_CONFIG[selectedChip.setId].icon} {CHIP_SET_CONFIG[selectedChip.setId].name}套装</div>}
              <div style={{ color: '#fff', fontSize: '11px', marginBottom: '8px' }}>主属性: {CHIP_MAIN_STAT_CONFIG[selectedChip.mainStat].name} +{selectedChip.mainStatValue}</div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ ...styles.label, fontSize: '11px', marginBottom: '4px' }}>副属性 (可重随类型和数值，范围见括号):</div>
                {selectedChip.subStats.map((sub, idx) => {
                  const rerollCost = getRerollCost(selectedChip);
                  const hasEnoughCredits = gameManager.trainCoins >= rerollCost.credits;
                  const hasEnoughMaterials = (gameManager.inventory.getItem('mineral_quantum')?.quantity || 0) >= rerollCost.materials;
                  const canReroll = !selectedChip.locked && hasEnoughCredits && hasEnoughMaterials;
                  const config = CHIP_SUB_STAT_CONFIG[sub.stat];
                  return (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '6px', marginBottom: '4px' }}>
                      <span style={{ color: '#fff', fontSize: '11px' }}>{config.name} +{sub.value} ({config.minValue}-{config.maxValue})</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: hasEnoughCredits ? '#a1a1aa' : colors.error, fontSize: '9px' }}>信用点:{rerollCost.credits}</span>
                        <span style={{ color: hasEnoughMaterials ? '#a1a1aa' : colors.error, fontSize: '9px' }}>量子矿:{rerollCost.materials}</span>
                        <button onClick={() => setConfirmDialog({ show: true, title: '重随副属性', content: `确定要重随这个副属性吗？\n可能获得新的属性类型和数值\n消耗: ${rerollCost.credits}信用点, ${rerollCost.materials}量子矿`, onConfirm: () => { handleReroll(selectedChip.id, idx); setConfirmDialog(null); }, onCancel: () => setConfirmDialog(null) })} disabled={!canReroll} style={{ padding: '2px 8px', background: !canReroll ? 'rgba(100, 100, 100, 0.2)' : `${colors.cybernetic}20`, border: !canReroll ? '1px solid rgba(100, 100, 100, 0.3)' : `1px solid ${colors.cybernetic}40`, borderRadius: '4px', color: !canReroll ? '#666' : colors.cybernetic, fontSize: '9px', cursor: !canReroll ? 'not-allowed' : 'pointer' }}>🎲 重随</button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedChip.level < CHIP_RARITY_CONFIG[selectedChip.rarity].maxLevel && (
                <div style={styles.infoBox(colors.info)}>
                  <div style={{ color: colors.info, fontSize: '11px', fontWeight: 'bold', marginBottom: '6px' }}>⬆️ 升级需求 (Lv.{selectedChip.level} → Lv.{selectedChip.level + 1})</div>
                  {(() => {
                    const upgradeCost = getUpgradeCost(selectedChip.level);
                    const hasEnoughCredits = gameManager.trainCoins >= upgradeCost.credits;
                    const currentMaterials = gameManager.inventory.getItem('chip_material')?.quantity || 0;
                    const hasEnoughMaterials = currentMaterials >= upgradeCost.materials;
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={styles.label}>信用点:</span><span style={{ color: hasEnoughCredits ? colors.success : colors.error }}>{gameManager.trainCoins.toLocaleString()} / {upgradeCost.credits.toLocaleString()}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={styles.label}>芯片材料:</span><span style={{ color: hasEnoughMaterials ? colors.success : colors.error }}>{currentMaterials} / {upgradeCost.materials}</span></div>
                      </div>
                    );
                  })()}
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <button onClick={() => handleUpgrade(selectedChip.id, 1)} disabled={selectedChip.level >= CHIP_RARITY_CONFIG[selectedChip.rarity].maxLevel} style={{ ...styles.primaryButton(colors.info, selectedChip.level >= CHIP_RARITY_CONFIG[selectedChip.rarity].maxLevel), flex: 1, padding: '8px', fontSize: '11px' }}>{selectedChip.level >= CHIP_RARITY_CONFIG[selectedChip.rarity].maxLevel ? '已满级' : '升级'}</button>
                <button onClick={() => setConfirmDialog({ show: true, title: '分解芯片', content: `确定要分解这个${CHIP_RARITY_CONFIG[selectedChip.rarity].name}芯片吗？\n将获得芯片材料作为回报。`, onConfirm: () => { handleDecompose(selectedChip.id); setConfirmDialog(null); }, onCancel: () => setConfirmDialog(null) })} disabled={selectedChip.locked} style={{ ...styles.dangerButton(selectedChip.locked), flex: 1, padding: '8px', fontSize: '11px' }}>分解</button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'craft' && <ChipCraftPanel gameManager={gameManager} onCraft={handleCraft} />}
    </div>
  );
}
