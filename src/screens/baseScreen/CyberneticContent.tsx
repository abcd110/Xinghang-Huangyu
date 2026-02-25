import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { Implant, ImplantType, ImplantRarity, IMPLANT_TYPE_CONFIG, IMPLANT_RARITY_CONFIG, getImplantStats, getImplantUpgradeCost } from '../../core/CyberneticSystem';
import { MessageToast, type MessageState } from './shared';
import { styles, colors } from './styles';

export function CyberneticContent() {
  const { gameManager, saveGame, craftImplant, upgradeImplant, equipImplant, unequipImplant, decomposeImplant, getImplantTotalStats, toggleImplantLock, getCraftableImplantRarities } = useGameStore();
  const [activeTab, setActiveTab] = useState<'slots' | 'craft'>('slots');
  const [selectedImplant, setSelectedImplant] = useState<Implant | null>(null);
  const [selectedCraftType, setSelectedCraftType] = useState<ImplantType | null>(null);
  const [filterType, setFilterType] = useState<ImplantType | null>(null);
  const [showDecomposeConfirm, setShowDecomposeConfirm] = useState(false);
  const [message, setMessage] = useState<MessageState | null>(null);

  const implants = gameManager.getImplants();
  const equippedImplants = gameManager.getEquippedImplants();
  const availableSlots = gameManager.getAvailableImplantSlots();
  const craftableRarities = getCraftableImplantRarities();
  const level = gameManager.getCyberneticLevel();
  const totalStats = getImplantTotalStats();

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleCraft = async (type: ImplantType, rarity: ImplantRarity) => {
    const result = craftImplant(type, rarity);
    if (result.success) { showMessage(`成功制造${IMPLANT_RARITY_CONFIG[rarity].name}品质的${IMPLANT_TYPE_CONFIG[type].name}`, 'success'); await saveGame(); }
    else { showMessage(result.message, 'error'); }
  };

  const handleUpgrade = async (implantId: string) => {
    const result = upgradeImplant(implantId);
    if (result.success) { showMessage(`升级到Lv.${result.newLevel}`, 'success'); await saveGame(); }
    else { showMessage(result.message, 'error'); }
  };

  const handleEquip = async (implantId: string) => {
    const result = equipImplant(implantId);
    if (result.success) { showMessage(result.message, 'success'); await saveGame(); }
    else { showMessage(result.message, 'error'); }
  };

  const handleUnequip = async (type: ImplantType) => {
    const result = unequipImplant(type);
    if (result.success) { showMessage(result.message, 'success'); await saveGame(); }
    else { showMessage(result.message, 'error'); }
  };

  const handleDecompose = async (implantId: string) => {
    const result = decomposeImplant(implantId);
    if (result.success) { showMessage(`分解成功，获得${result.rewards}`, 'success'); setSelectedImplant(null); setShowDecomposeConfirm(false); await saveGame(); }
    else { showMessage(result.message, 'error'); }
  };

  const handleDecomposeClick = () => {
    if (selectedImplant?.locked) return;
    if (gameManager.equippedImplants[selectedImplant!.type] === selectedImplant!.id) {
      showMessage('已装备的义体无法分解，请先卸下', 'error');
      return;
    }
    setShowDecomposeConfirm(true);
  };

  const handleToggleLock = async (implantId: string) => {
    const result = toggleImplantLock(implantId);
    if (result.success) { showMessage(result.message, 'success'); await saveGame(); }
    else { showMessage(result.message, 'error'); }
  };

  const getEquippedImplantForType = (type: ImplantType): Implant | undefined => {
    const implantId = gameManager.equippedImplants[type];
    return implants.find(i => i.id === implantId);
  };

  const statNames: Record<string, string> = { attack: '攻击', defense: '防御', hp: '生命', speed: '攻速', critRate: '会心', critDamage: '暴击伤害', hit: '命中', dodge: '闪避' };

  return (
    <div style={{ position: 'relative' }}>
      <MessageToast message={message} />

      <div style={styles.statsBox(colors.cybernetic)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
          <div><span style={styles.label}>义体槽位: </span><span style={{ color: colors.cybernetic, fontWeight: 'bold' }}>{equippedImplants.length}/{availableSlots.length}</span></div>
          <div><span style={styles.label}>义体数量: </span><span style={{ color: colors.cybernetic, fontWeight: 'bold' }}>{implants.length}</span></div>
        </div>
      </div>

      {Object.keys(totalStats).length > 0 && (
        <div style={styles.statsBox(colors.cybernetic)}>
          <div style={{ color: colors.cybernetic, fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>当前属性加成</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {Object.entries(totalStats).map(([stat, value]) => (
              <div key={stat} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
                <span style={{ color: colors.cybernetic }}>{statNames[stat] || stat}:</span>
                <span style={{ color: '#fff' }}>+{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button onClick={() => setActiveTab('slots')} style={styles.tabButton(activeTab === 'slots', colors.cybernetic)}>🦾 义体槽位</button>
        <button onClick={() => setActiveTab('craft')} style={styles.tabButton(activeTab === 'craft', colors.cybernetic)}>🔨 制造义体</button>
      </div>

      {activeTab === 'slots' && (
        <div>
          <div style={{ marginBottom: '12px' }}>
            {Object.values(ImplantType).map(type => {
              const equipped = getEquippedImplantForType(type);
              const isUnlocked = availableSlots.includes(type);
              const typeConfig = IMPLANT_TYPE_CONFIG[type];

              return (
                <div key={type} onClick={() => { if (equipped) setSelectedImplant(equipped); setFilterType(type); }} style={{ ...styles.cardBox(equipped ? IMPLANT_RARITY_CONFIG[equipped.rarity].color : 'rgba(255,255,255,0.1)', false), padding: '12px', background: isUnlocked ? `${colors.cybernetic}15` : 'rgba(100, 100, 100, 0.1)', opacity: isUnlocked ? 1 : 0.5, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>{typeConfig.icon}</span>
                      <span style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '13px' }}>{typeConfig.name}</span>
                    </div>
                    {equipped && <span style={{ color: IMPLANT_RARITY_CONFIG[equipped.rarity].color, fontSize: '11px' }}>Lv.{equipped.level}</span>}
                  </div>
                  {equipped ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ color: IMPLANT_RARITY_CONFIG[equipped.rarity].color, fontSize: '12px' }}>{equipped.name}</div>
                        <div style={{ ...styles.label, fontSize: '10px' }}>{typeConfig.description}</div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); handleUnequip(type); }} style={{ padding: '4px 8px', fontSize: '10px', minWidth: 'auto', width: 'auto', background: `linear-gradient(135deg, ${colors.error}, #b91c1c)`, border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>卸下</button>
                    </div>
                  ) : <div style={{ color: isUnlocked ? '#666' : '#444', fontSize: '12px' }}>{isUnlocked ? '空槽位' : `🔒 需要 Lv.${Object.values(ImplantType).indexOf(type) + 1} 解锁`}</div>}
                </div>
              );
            })}
          </div>

          <div style={{ ...styles.label, fontSize: '12px', marginBottom: '8px' }}>📦 义体仓库 ({implants.filter(i => !Object.values(gameManager.equippedImplants).includes(i.id)).length})</div>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => setFilterType(null)} style={{ padding: '4px 8px', fontSize: '10px', background: filterType === null ? `${colors.cybernetic}40` : 'rgba(100, 100, 100, 0.2)', border: filterType === null ? `1px solid ${colors.cybernetic}` : '1px solid rgba(100, 100, 100, 0.3)', borderRadius: '4px', color: filterType === null ? colors.cybernetic : '#a1a1aa', cursor: 'pointer' }}>全部</button>
            {Object.values(ImplantType).map(type => {
              const typeConfig = IMPLANT_TYPE_CONFIG[type];
              const count = implants.filter(i => !Object.values(gameManager.equippedImplants).includes(i.id) && i.type === type).length;
              return (
                <button key={type} onClick={() => setFilterType(type)} style={{ padding: '4px 8px', fontSize: '10px', background: filterType === type ? `${typeConfig.color}40` : 'rgba(100, 100, 100, 0.2)', border: filterType === type ? `1px solid ${typeConfig.color}` : '1px solid rgba(100, 100, 100, 0.3)', borderRadius: '4px', color: filterType === type ? typeConfig.color : '#a1a1aa', cursor: 'pointer' }}>{typeConfig.icon} {count}</button>
              );
            })}
          </div>
          <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
            {implants.filter(i => !Object.values(gameManager.equippedImplants).includes(i.id) && (filterType === null || i.type === filterType)).map(implant => {
              const typeConfig = IMPLANT_TYPE_CONFIG[implant.type];
              return (
                <div key={implant.id} onClick={() => setSelectedImplant(implant)} style={{ ...styles.cardBox(IMPLANT_RARITY_CONFIG[implant.rarity].color, selectedImplant?.id === implant.id), padding: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '14px', marginRight: '6px' }}>{typeConfig.icon}</span>
                      <span style={{ color: IMPLANT_RARITY_CONFIG[implant.rarity].color, fontWeight: 'bold', fontSize: '12px' }}>{implant.name}</span>
                      <span style={{ ...styles.label, fontSize: '11px', marginLeft: '8px' }}>Lv.{implant.level}</span>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); handleEquip(implant.id); }} style={{ padding: '4px 8px', background: `linear-gradient(135deg, ${colors.cybernetic}, #7c3aed)`, border: 'none', borderRadius: '4px', color: '#fff', fontSize: '10px', cursor: 'pointer' }}>装备</button>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedImplant && (
            <div style={{ marginTop: '12px', padding: '12px', background: `${colors.cybernetic}15`, borderRadius: '12px', border: `1px solid ${colors.cybernetic}40` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ color: IMPLANT_RARITY_CONFIG[selectedImplant.rarity].color, fontWeight: 'bold' }}>{selectedImplant.name} Lv.{selectedImplant.level}</div>
                <button onClick={() => handleToggleLock(selectedImplant.id)} disabled={gameManager.equippedImplants[selectedImplant.type] === selectedImplant.id} style={{ padding: '4px 8px', background: selectedImplant.locked ? `${colors.warning}40` : 'rgba(100, 100, 100, 0.2)', border: selectedImplant.locked ? `1px solid ${colors.warning}80` : '1px solid rgba(100, 100, 100, 0.3)', borderRadius: '4px', color: selectedImplant.locked ? colors.warning : '#a1a1aa', fontSize: '10px', cursor: gameManager.equippedImplants[selectedImplant.type] === selectedImplant.id ? 'not-allowed' : 'pointer' }}>{selectedImplant.locked ? '🔒 已锁定' : '🔓 未锁定'}</button>
              </div>
              <div style={{ ...styles.label, fontSize: '11px', marginBottom: '8px' }}>{selectedImplant.description}</div>
              <div style={{ ...styles.label, fontSize: '11px', marginBottom: '8px' }}>属性: {Object.entries(getImplantStats(selectedImplant)).map(([k, v]) => `${statNames[k] || k}+${v}`).join(' / ')}</div>
              {selectedImplant.specialEffect && <div style={{ color: colors.info, fontSize: '11px', marginBottom: '8px', padding: '6px 8px', background: `${colors.info}15`, borderRadius: '6px', border: `1px solid ${colors.info}40` }}>✨ {selectedImplant.specialEffect.name}: {selectedImplant.specialEffect.description}</div>}
              {selectedImplant.level < selectedImplant.maxLevel && (() => {
                const upgradeCost = getImplantUpgradeCost(selectedImplant);
                const canAfford = gameManager.trainCoins >= upgradeCost.credits && upgradeCost.materials.every(m => gameManager.inventory.hasItem(m.itemId, m.count));
                return <div style={{ ...styles.label, fontSize: '10px', marginBottom: '8px', padding: '6px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>升级费用: {upgradeCost.credits}信用点 + {upgradeCost.materials.map(m => `${m.count}义体材料`).join(' + ')}{!canAfford && <span style={{ color: colors.error, marginLeft: '4px' }}>(材料不足)</span>}</div>;
              })()}
              {selectedImplant.locked ? null : (() => {
                const rarityIndex = Object.values(ImplantRarity).indexOf(selectedImplant.rarity);
                const materialReward = (rarityIndex + 1) * 2;
                return <div style={{ ...styles.label, fontSize: '10px', marginBottom: '8px', padding: '6px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>分解获得: {materialReward}义体材料</div>;
              })()}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleUpgrade(selectedImplant.id)} disabled={selectedImplant.level >= selectedImplant.maxLevel} style={{ ...styles.primaryButton(colors.cybernetic, selectedImplant.level >= selectedImplant.maxLevel), flex: 1, padding: '8px', fontSize: '11px' }}>{selectedImplant.level >= selectedImplant.maxLevel ? '已满级' : '升级'}</button>
                <button onClick={handleDecomposeClick} disabled={selectedImplant.locked || gameManager.equippedImplants[selectedImplant.type] === selectedImplant.id} style={{ ...styles.dangerButton(selectedImplant.locked || gameManager.equippedImplants[selectedImplant.type] === selectedImplant.id), flex: 1, padding: '8px', fontSize: '11px' }}>{gameManager.equippedImplants[selectedImplant.type] === selectedImplant.id ? '已装备' : '分解'}</button>
              </div>
              {showDecomposeConfirm && (
                <div style={{ marginTop: '8px', padding: '10px', background: `${colors.error}15`, borderRadius: '8px', border: `1px solid ${colors.error}40` }}>
                  <div style={{ color: colors.error, fontSize: '11px', marginBottom: '8px', textAlign: 'center' }}>⚠️ 确定分解 {selectedImplant.name}？</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => setShowDecomposeConfirm(false)} style={{ flex: 1, padding: '6px', fontSize: '10px', background: 'rgba(100, 100, 100, 0.3)', border: '1px solid rgba(100, 100, 100, 0.5)', borderRadius: '4px', color: '#a1a1aa', cursor: 'pointer' }}>取消</button>
                    <button onClick={() => handleDecompose(selectedImplant.id)} style={{ flex: 1, padding: '6px', fontSize: '10px', background: `linear-gradient(135deg, ${colors.error}, #b91c1c)`, border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>确认分解</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'craft' && (
        <div>
          <div style={{ ...styles.label, fontSize: '12px', marginBottom: '8px' }}>研发等级: Lv.{level} | 选择部位制造义体</div>

          {!selectedCraftType && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {Object.values(ImplantType).map(type => {
                const typeConfig = IMPLANT_TYPE_CONFIG[type];
                return (
                  <button key={type} onClick={() => setSelectedCraftType(type)} style={{ padding: '16px', background: `linear-gradient(135deg, ${typeConfig.color}30, ${typeConfig.color}10)`, border: `1px solid ${typeConfig.color}50`, borderRadius: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '28px' }}>{typeConfig.icon}</span>
                    <span style={{ color: typeConfig.color, fontWeight: 'bold', fontSize: '14px' }}>{typeConfig.name}</span>
                    <span style={{ ...styles.label, fontSize: '10px', textAlign: 'center' }}>{typeConfig.description}</span>
                  </button>
                );
              })}
            </div>
          )}

          {selectedCraftType && (
            <div>
              <button onClick={() => setSelectedCraftType(null)} style={{ marginBottom: '12px', padding: '8px 16px', background: 'rgba(100, 100, 100, 0.2)', border: '1px solid rgba(100, 100, 100, 0.3)', borderRadius: '8px', color: '#a1a1aa', fontSize: '12px', cursor: 'pointer' }}>← 返回选择部位</button>

              <div style={{ textAlign: 'center', marginBottom: '12px', padding: '12px', background: `${IMPLANT_TYPE_CONFIG[selectedCraftType].color}20`, borderRadius: '8px', border: `1px solid ${IMPLANT_TYPE_CONFIG[selectedCraftType].color}40` }}>
                <span style={{ fontSize: '24px' }}>{IMPLANT_TYPE_CONFIG[selectedCraftType].icon}</span>
                <div style={{ color: IMPLANT_TYPE_CONFIG[selectedCraftType].color, fontWeight: 'bold', fontSize: '16px' }}>{IMPLANT_TYPE_CONFIG[selectedCraftType].name}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.values(ImplantRarity).map(rarity => {
                  const rarityConfig = IMPLANT_RARITY_CONFIG[rarity];
                  const costs = { [ImplantRarity.RARE]: { credits: 2000, materials: 12 }, [ImplantRarity.EPIC]: { credits: 5000, materials: 20 }, [ImplantRarity.LEGENDARY]: { credits: 10000, materials: 30 } };
                  const cost = costs[rarity];
                  const isCraftable = craftableRarities.includes(rarity);
                  const canAfford = gameManager.trainCoins >= cost.credits && gameManager.inventory.hasItem('cyber_material', cost.materials);
                  const requiredLevel = rarity === ImplantRarity.EPIC ? 2 : rarity === ImplantRarity.LEGENDARY ? 3 : 1;

                  return (
                    <div key={rarity} style={{ padding: '12px', background: `linear-gradient(135deg, ${rarityConfig.color}${isCraftable ? '30' : '10'}, ${rarityConfig.color}${isCraftable ? '15' : '05'})`, border: `1px solid ${rarityConfig.color}${isCraftable ? '50' : '20'}`, borderRadius: '12px', opacity: isCraftable ? 1 : 0.5 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ color: rarityConfig.color, fontWeight: 'bold', fontSize: '14px' }}>{rarityConfig.name}</span>
                        {!isCraftable && <span style={{ color: colors.error, fontSize: '10px', background: `${colors.error}20`, padding: '2px 6px', borderRadius: '4px' }}>需要Lv.{requiredLevel}</span>}
                      </div>
                      <div style={{ ...styles.label, fontSize: '11px', marginBottom: '8px' }}>信用点:{cost.credits} | 义体材料:{cost.materials}</div>
                      <button onClick={() => handleCraft(selectedCraftType, rarity)} disabled={!isCraftable || !canAfford} style={{ ...styles.primaryButton(rarityConfig.color, !isCraftable || !canAfford), background: !isCraftable || !canAfford ? 'rgba(100, 100, 100, 0.3)' : `linear-gradient(135deg, ${rarityConfig.color}, ${rarityConfig.color}80)` }}>{!isCraftable ? `需要研发等级Lv.${requiredLevel}` : canAfford ? '制造' : '材料不足'}</button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
