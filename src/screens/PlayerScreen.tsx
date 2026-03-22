import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { EquipmentSlot, SLOT_NAMES, SLOT_ICONS } from '../data/equipmentTypes';
import { EquipmentInstance } from '../core/EquipmentSystem';
import type { InventoryItem } from '../data/types';
import { RARITY_COLORS } from '../data/types';
import { calculateEquipmentStats } from '../core/EquipmentStatCalculator';
import { useForceUpdate } from './baseScreen/shared';

interface PlayerScreenProps {
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

export default function PlayerScreen({ onBack }: PlayerScreenProps) {
  const { gameManager, saveGame, getChipStatBonus, getChipSetBonuses } = useGameStore();
  const player = gameManager.player;
  const [selectedItem, setSelectedItem] = useState<EquipmentInstance | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<EquipmentSlot | null>(null);
  const [showBackpack, setShowBackpack] = useState(false);
  const forceRefresh = useForceUpdate();

  // 获取芯片加成
  const chipStatBonus = getChipStatBonus();
  const chipSetBonuses = getChipSetBonuses();

  // 获取义体加成
  const implantStats = gameManager.getImplantTotalStats();
  const implantEffects = gameManager.getEquippedImplantEffects();

  // 计算芯片加成后的属性值（固定值 + 百分比）
  const chipAttack = (chipStatBonus['攻击'] || 0);
  const chipAttackPercent = (chipStatBonus['攻击%'] || 0) / 100;
  const implantAttack = implantStats['attack'] || 0;
  const finalAttack = Math.floor((player.totalAttack + chipAttack + implantAttack) * (1 + chipAttackPercent));

  const chipDefense = (chipStatBonus['防御'] || 0);
  const chipDefensePercent = (chipStatBonus['防御%'] || 0) / 100;
  const implantDefense = implantStats['defense'] || 0;
  const finalDefense = Math.floor((player.totalDefense + chipDefense + implantDefense) * (1 + chipDefensePercent));

  const chipHp = (chipStatBonus['生命'] || 0);
  const chipHpPercent = (chipStatBonus['生命%'] || 0) / 100;
  const implantHp = implantStats['hp'] || 0;
  const finalMaxHp = Math.floor((player.totalMaxHp + chipHp + implantHp) * (1 + chipHpPercent));

  const chipSpeed = (chipStatBonus['攻速'] || 0);
  const implantSpeed = implantStats['speed'] || 0;
  const finalAttackSpeed = player.totalAttackSpeed + chipSpeed + implantSpeed;

  const chipCritRate = (chipStatBonus['暴击率'] || 0);
  const implantCritRate = implantStats['critRate'] || 0;
  const finalCrit = player.totalCrit + chipCritRate + implantCritRate;

  const chipCritDamage = (chipStatBonus['暴伤'] || 0);
  const implantCritDamage = implantStats['critDamage'] || 0;
  const finalCritDamage = player.totalCritDamage + chipCritDamage + implantCritDamage;

  // 计算包含芯片加成的战力
  const totalPower = Math.floor(
    finalAttack * 0.4 +
    finalDefense * 0.3 +
    finalMaxHp * 0.15 +
    finalAttackSpeed * 0.1 * 100 +
    (player.totalHit + player.totalDodge + finalCrit * 2) * 0.05 +
    player.totalPenetration * 0.1 * 100 +
    player.totalTrueDamage * 0.1 * 100
  );

  // 获取已装备的物品
  const equippedItems = player.equippedItems;

  // 获取背包中的装备
  const backpackEquipment = gameManager.inventory.equipment;

  // 计算套装效果（简化版）
  const equippedCount = equippedItems.length;
  const setBonuses = [
    equippedCount >= 2 ? { description: '2件套：能量共鸣 - 攻击 +10%' } : null,
    equippedCount >= 4 ? { description: '4件套：力场强化 - 攻击 +20%，暴击率 +5%' } : null,
    equippedCount >= 6 ? { description: '6件套：纳米觉醒 - 攻击 +35%，暴击率 +10%，战斗护盾' } : null,
  ].filter(Boolean) as { description: string }[];

  // 处理装备槽位点击
  const handleSlotClick = (slot: EquipmentSlot, item: EquipmentInstance | undefined) => {
    if (item) {
      // 已装备，显示详情
      setSelectedItem(item);
      setSelectedSlot(slot);
    } else {
      // 未装备，打开背包选择
      setSelectedSlot(slot);
      setShowBackpack(true);
    }
  };

  // 从背包装备
  const handleEquipFromBackpack = async (equipment: EquipmentInstance) => {
    if (selectedSlot) {
      // 从背包移除
      gameManager.inventory.removeEquipment(equipment.instanceId);

      // 卸下该槽位已有装备（如果有）
      const existing = player.getEquipmentBySlot(selectedSlot);

      if (existing) {
        player.unequipMythologyItem(selectedSlot);
        // 将卸下的装备放回背包
        existing.equipped = false;
        gameManager.inventory.addEquipment(existing);
      }

      // 装备新物品
      equipment.equipped = true;
      player.equipMythologyItem(equipment);

      // 保存游戏
      await saveGame();

      forceRefresh();
      setShowBackpack(false);
      setSelectedSlot(null);
    }
  };

  // 卸下装备
  const handleUnequip = async () => {
    if (selectedSlot) {
      const item = player.unequipMythologyItem(selectedSlot);
      if (item) {
        // 将装备放回背包
        item.equipped = false;
        gameManager.inventory.addEquipment(item);
      }

      // 保存游戏
      await saveGame();

      forceRefresh();
      setSelectedItem(null);
      setSelectedSlot(null);
    }
  };

  return (
    <div style={{
      height: '100vh',
      backgroundColor: '#0a0e27',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 顶部标题栏 */}
      <header style={{
        flexShrink: 0,
        backgroundColor: '#1a1f3a',
        borderBottom: '1px solid #2a3050',
        padding: '12px 16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#a1a1aa',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            <span>←</span>
            <span>返回</span>
          </button>
          <h1 style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>角色属性</h1>
          <div style={{ width: '48px' }} />
        </div>
      </header>

      {/* 属性列表 */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px'
      }}>
        {/* 基础信息 - 精简版 */}
        <div style={{
          backgroundColor: '#1a1f3a',
          borderRadius: '12px',
          padding: '12px 16px',
          border: '1px solid #374151',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: '#00d4ff', fontSize: '14px', fontWeight: 'bold' }}>Lv.{player.level}</span>
              <span style={{ color: '#a1a1aa', fontSize: '12px' }}>EXP: {player.exp}/{player.expToNext}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#a1a1aa', fontSize: '12px' }}>战力</span>
              <span style={{ color: '#00d4ff', fontSize: '16px', fontWeight: 'bold' }}>
                {totalPower.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* 装备栏 - 6槽位横向排列 */}
        <div style={{
          backgroundColor: '#1a1f3a',
          borderRadius: '12px',
          padding: '12px 16px',
          border: '1px solid #374151',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
            {ARMOR_SLOTS.map(slot => {
              // 优先从新装备系统（神话装备）获取
              const mythEquippedItem = player.getEquipmentBySlot(slot);
              // 从旧装备系统获取
              const oldEquippedItems = gameManager.inventory.getEquippedItems();
              let unifiedItem: UnifiedEquipment | null = null;
              const equippedItem: EquipmentInstance | undefined = mythEquippedItem;

              if (mythEquippedItem) {
                // 使用神话装备
                unifiedItem = convertNewItemToUnified(mythEquippedItem);
              } else {
                // 检查旧装备系统
                let oldItem: InventoryItem | null = null;
                switch (slot) {
                  case EquipmentSlot.HEAD:
                    oldItem = oldEquippedItems.head;
                    break;
                  case EquipmentSlot.BODY:
                    oldItem = oldEquippedItems.body;
                    break;
                  case EquipmentSlot.LEGS:
                    oldItem = oldEquippedItems.legs;
                    break;
                  case EquipmentSlot.FEET:
                    oldItem = oldEquippedItems.feet;
                    break;
                }
                if (oldItem) {
                  unifiedItem = convertOldItemToUnified(oldItem);
                }
              }

              // 检查背包中是否有对应槽位的装备
              const hasItemInBackpack = !unifiedItem && (
                backpackEquipment.some(e => e.slot === slot) ||
                gameManager.inventory.getAllItems().some(item => !item.equipped && item.slot === slot)
              );

              return (
                <EquipmentSlotItem
                  key={slot}
                  slot={slot}
                  item={unifiedItem}
                  hasItemInBackpack={hasItemInBackpack}
                  onClick={() => handleSlotClick(slot, equippedItem)}
                />
              );
            })}
          </div>
        </div>

        {/* 套装效果 */}
        {setBonuses.length > 0 && (
          <div style={{
            backgroundColor: '#1a1f3a',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #374151',
            marginBottom: '16px'
          }}>
            <h3 style={{ color: '#c084fc', fontSize: '14px', fontWeight: 'bold', margin: '0 0 12px 0' }}>
              ✨ 套装效果
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {setBonuses.map((bonus, index) => (
                <div key={index} style={{
                  backgroundColor: '#1f2937',
                  borderRadius: '8px',
                  padding: '10px 12px'
                }}>
                  <p style={{ color: '#c084fc', fontSize: '13px', margin: 0 }}>{bonus.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 战斗属性 */}
        <div style={{
          backgroundColor: '#1a1f3a',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid #374151',
          marginBottom: '16px'
        }}>
          <h3 style={{ color: '#0099cc', fontSize: '14px', fontWeight: 'bold', margin: '0 0 12px 0' }}>
            ⚔️ 战斗属性
          </h3>

          {/* 第一行：攻击、生命 各占一半 */}
          <div style={{
            display: 'flex',
            gap: '6px',
            marginBottom: '10px',
            paddingBottom: '10px',
            borderBottom: '1px solid #374151'
          }}>
            <StatItem label="攻击" value={finalAttack} color="#f87171" flex={1} />
            <StatItem label="生命" value={finalMaxHp} color="#ef4444" flex={1} />
          </div>

          {/* 第二行：防御、穿透 各占一半 */}
          <div style={{
            display: 'flex',
            gap: '6px',
            marginBottom: '10px',
            paddingBottom: '10px',
            borderBottom: '1px solid #374151'
          }}>
            <StatItem label="防御" value={`${finalDefense}/${player.damageReduction.toFixed(1)}%`} color="#60a5fa" flex={1} />
            <StatItem label="穿透" value={`${Math.floor(player.totalPenetration)}/${Math.floor(player.totalPenetrationPercent)}%`} color="#fb923c" flex={1} />
          </div>

          {/* 第三行：命中、闪避、攻速、真伤 */}
          <div style={{
            display: 'flex',
            gap: '6px',
            marginBottom: '10px',
            paddingBottom: '10px',
            borderBottom: '1px solid #374151'
          }}>
            <StatItem label="命中" value={Math.floor(player.totalHit)} color="#00d4ff" flex={1} />
            <StatItem label="闪避" value={Math.floor(player.totalDodge)} color="#4ade80" flex={1} />
            <StatItem label="攻速" value={finalAttackSpeed.toFixed(1)} color="#c084fc" flex={1} />
            <StatItem label="真伤" value={`${Math.floor(player.totalTrueDamage)}%`} color="#ec4899" flex={1} />
          </div>

          {/* 第四行：暴击率、暴伤、幸运 */}
          <div style={{
            display: 'flex',
            gap: '6px'
          }}>
            <StatItem label="暴击率" value={`${Math.floor(finalCrit)}%`} color="#ef4444" flex={1} />
            <StatItem label="暴伤" value={`${Math.floor(finalCritDamage)}%`} color="#f472b6" flex={1} />
            <StatItem label="幸运" value={Math.floor(player.totalLuck)} color="#00d4ff" flex={1} />
          </div>
        </div>

        {/* 装备属性加成详情 */}
        {equippedItems.length > 0 && (
          <div style={{
            backgroundColor: '#1a1f3a',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #374151',
            marginBottom: '16px'
          }}>
            <h3 style={{ color: '#60a5fa', fontSize: '14px', fontWeight: 'bold', margin: '0 0 12px 0' }}>
              📊 装备加成
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              <EquipmentBonusItem label="攻击" value={player.equipmentStats.attack} color="#f87171" />
              <EquipmentBonusItem label="防御" value={player.equipmentStats.defense} color="#60a5fa" />
              <EquipmentBonusItem label="生命" value={player.equipmentStats.hp} color="#ef4444" />
              <EquipmentBonusItem label="命中" value={player.equipmentStats.hit} color="#00d4ff" />
              <EquipmentBonusItem label="闪避" value={player.equipmentStats.dodge} color="#4ade80" />
              <EquipmentBonusItem label="攻速" value={parseFloat(player.equipmentStats.speed.toFixed(1))} color="#c084fc" />
              <EquipmentBonusItem label="暴击" value={player.equipmentStats.crit} color="#ef4444" />
              <EquipmentBonusItem label="穿透" value={player.equipmentStats.penetration} color="#fb923c" />
            </div>
          </div>
        )}

        {/* 芯片加成详情 */}
        {Object.keys(chipStatBonus).length > 0 && (
          <div style={{
            backgroundColor: '#1a1f3a',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #00d4ff',
            marginBottom: '16px'
          }}>
            <h3 style={{ color: '#00d4ff', fontSize: '14px', fontWeight: 'bold', margin: '0 0 12px 0' }}>
              💾 芯片加成
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {Object.entries(chipStatBonus).map(([stat, value]) => (
                <EquipmentBonusItem
                  key={stat}
                  label={stat}
                  value={typeof value === 'number' ? parseFloat(value.toFixed(1)) : value}
                  color="#00d4ff"
                />
              ))}
            </div>
            {/* 芯片套装效果 */}
            {chipSetBonuses.length > 0 && (
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #374151' }}>
                <h4 style={{ color: '#a855f7', fontSize: '12px', margin: '0 0 8px 0' }}>套装效果:</h4>
                {chipSetBonuses.map((bonus, idx) => (
                  <div key={idx} style={{ color: '#a1a1aa', fontSize: '11px', marginBottom: '4px' }}>
                    {bonus.setName}: {bonus.bonus}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 义体加成详情 */}
        {Object.keys(implantStats).length > 0 && (
          <div style={{
            backgroundColor: '#1a1f3a',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #a855f7',
            marginBottom: '16px'
          }}>
            <h3 style={{ color: '#a855f7', fontSize: '14px', fontWeight: 'bold', margin: '0 0 12px 0' }}>
              🦾 义体加成
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {Object.entries(implantStats).map(([stat, value]) => (
                <EquipmentBonusItem
                  key={stat}
                  label={stat === 'attack' ? '攻击' : stat === 'defense' ? '防御' : stat === 'hp' ? '生命' : stat === 'speed' ? '攻速' : stat === 'critRate' ? '暴击率' : stat === 'critDamage' ? '暴击伤害' : stat === 'hit' ? '命中' : stat === 'dodge' ? '闪避' : stat}
                  value={typeof value === 'number' ? parseFloat(value.toFixed(1)) : value}
                  color="#a855f7"
                />
              ))}
            </div>
            {/* 义体特殊效果 */}
            {implantEffects.length > 0 && (
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #374151' }}>
                <h4 style={{ color: '#00d4ff', fontSize: '12px', margin: '0 0 8px 0' }}>特殊效果:</h4>
                {implantEffects.map(({ implant, effect }, idx) => (
                  <div key={idx} style={{ color: '#a1a1aa', fontSize: '11px', marginBottom: '4px' }}>
                    <span style={{ color: '#a855f7' }}>{implant.name}</span>: {effect.name} - {effect.description}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 基因加成详情 */}
        {(() => {
          const geneStats = player.geneStats;
          const lifeSteal = player.lifeStealPercent;
          const hasGeneStats = Object.keys(geneStats).length > 0 || lifeSteal > 0;
          if (!hasGeneStats) return null;

          const statNames: Record<string, string> = {
            maxHpPercent: '最大HP',
            attackPercent: '攻击力',
            defensePercent: '防御力',
            critRate: '暴击率',
            critDamage: '暴击伤害',
            dodgeRate: '闪避',
            speedPercent: '攻速',
            hpRegenPercent: 'HP恢复',
            attack: '攻击',
            defense: '防御',
            hp: '生命',
            speed: '攻速',
            crit: '暴击率',
            hit: '命中',
            dodge: '闪避',
          };

          return (
            <div style={{
              backgroundColor: '#1a1f3a',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid #22c55e',
              marginBottom: '16px'
            }}>
              <h3 style={{ color: '#22c55e', fontSize: '14px', fontWeight: 'bold', margin: '0 0 12px 0' }}>
                🧬 基因加成
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {Object.entries(geneStats).map(([stat, value]) => {
                  if (!value || value === 0) return null;
                  const statName = statNames[stat] || stat;
                  const isPercent = stat.includes('Percent') || stat.includes('Rate') || stat === 'critDamage';
                  return (
                    <EquipmentBonusItem
                      key={stat}
                      label={statName}
                      value={isPercent ? `${parseFloat(value.toFixed(1))}%` : parseFloat(value.toFixed(1))}
                      color="#22c55e"
                    />
                  );
                })}
                {lifeSteal > 0 && (
                  <EquipmentBonusItem
                    key="lifeSteal"
                    label="生命偷取"
                    value={`${lifeSteal.toFixed(1)}%`}
                    color="#ef4444"
                  />
                )}
              </div>
            </div>
          );
        })()}
      </main>

      {/* 装备详情弹窗 */}
      {selectedItem && selectedSlot && (
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
            backgroundColor: '#1a1f3a',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '360px',
            maxHeight: '80vh',
            overflowY: 'auto',
            border: `2px solid ${RARITY_COLORS[selectedItem.rarity]}`,
            padding: '20px'
          }}>
            {/* 头部信息 */}
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#1f2937',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                fontSize: '32px'
              }}>
                {SLOT_ICONS[selectedItem.slot]}
              </div>
              <h2 style={{
                color: RARITY_COLORS[selectedItem.rarity],
                fontWeight: 'bold',
                fontSize: '18px',
                margin: '0 0 4px 0'
              }}>
                {selectedItem.name}
              </h2>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '8px' }}>
                <span style={{ color: '#00d4ff', fontSize: '12px' }}>强化 +{selectedItem.enhanceLevel}</span>
                <span style={{ color: '#c084fc', fontSize: '12px' }}>升华 +{selectedItem.sublimationLevel}</span>
              </div>
            </div>

            {/* 属性 */}
            <div style={{
              backgroundColor: '#1f2937',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '12px'
            }}>
              <h4 style={{ color: '#a1a1aa', fontSize: '12px', marginBottom: '8px' }}>基础属性</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', fontSize: '13px' }}>
                {(() => {
                  // 使用新的装备属性计算器（实时根据强化等级计算）
                  const calculatedStats = calculateEquipmentStats(selectedItem);

                  const stats = [];

                  if (calculatedStats.attack > 0) {
                    stats.push(
                      <div key="attack" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#a1a1aa' }}>攻击</span>
                        <span style={{ color: '#f87171' }}>{calculatedStats.attack}</span>
                      </div>
                    );
                  }

                  if (calculatedStats.defense > 0) {
                    stats.push(
                      <div key="defense" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#a1a1aa' }}>防御</span>
                        <span style={{ color: '#60a5fa' }}>{calculatedStats.defense}</span>
                      </div>
                    );
                  }

                  if (calculatedStats.hp > 0) {
                    stats.push(
                      <div key="hp" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#a1a1aa' }}>生命</span>
                        <span style={{ color: '#ef4444' }}>{calculatedStats.hp}</span>
                      </div>
                    );
                  }

                  if (calculatedStats.hit > 0) {
                    stats.push(
                      <div key="hit" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#a1a1aa' }}>命中</span>
                        <span style={{ color: '#00d4ff' }}>{calculatedStats.hit}</span>
                      </div>
                    );
                  }

                  if (calculatedStats.dodge > 0) {
                    stats.push(
                      <div key="dodge" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#a1a1aa' }}>闪避</span>
                        <span style={{ color: '#4ade80' }}>{calculatedStats.dodge}</span>
                      </div>
                    );
                  }

                  if (calculatedStats.speed > 0) {
                    stats.push(
                      <div key="speed" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#a1a1aa' }}>攻速</span>
                        <span style={{ color: '#c084fc' }}>{calculatedStats.speed.toFixed(1)}</span>
                      </div>
                    );
                  }

                  if (calculatedStats.crit > 0) {
                    stats.push(
                      <div key="crit" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#a1a1aa' }}>暴击</span>
                        <span style={{ color: '#ef4444' }}>{calculatedStats.crit}</span>
                      </div>
                    );
                  }

                  if (calculatedStats.penetration > 0) {
                    stats.push(
                      <div key="penetration" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#a1a1aa' }}>穿透</span>
                        <span style={{ color: '#fb923c' }}>{calculatedStats.penetration}</span>
                      </div>
                    );
                  }

                  return stats;
                })()}
              </div>
            </div>

            {/* 特殊效果 */}
            {selectedItem.effects.length > 0 && (
              <div style={{
                backgroundColor: '#1f2937',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '12px'
              }}>
                <h4 style={{ color: '#a1a1aa', fontSize: '12px', marginBottom: '8px' }}>特殊效果</h4>
                {selectedItem.effects.map((effect, index) => (
                  <div key={index} style={{ marginBottom: '6px', fontSize: '12px' }}>
                    <span style={{ color: '#d1d5db' }}>{effect.description}</span>
                    <span style={{ color: '#a1a1aa', marginLeft: '8px' }}>
                      ({effect.chance * 100}%)
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* 按钮 */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setSelectedItem(null)}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#374151',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                关闭
              </button>
              <button
                onClick={handleUnequip}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                卸下装备
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 背包选择弹窗 */}
      {showBackpack && selectedSlot && (
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
            backgroundColor: '#1a1f3a',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '360px',
            maxHeight: '80vh',
            overflowY: 'auto',
            border: '1px solid #2a3050',
            padding: '20px'
          }}>
            <h3 style={{ color: 'white', fontSize: '16px', marginBottom: '16px', textAlign: 'center' }}>
              选择{SLOT_NAMES[selectedSlot]}
            </h3>

            {/* 显示该槽位的可用装备 */}
            {(() => {
              // 获取神话装备（来自 inventory.equipment）
              const mythEquipments = backpackEquipment.filter(e => e.slot === selectedSlot);

              // 获取制造的装备（来自 inventory.items，使用 slot 字段匹配）
              const craftedItems: InventoryItem[] = [];
              if (selectedSlot) {
                const allItems = gameManager.inventory.getAllItems();
                allItems.forEach(item => {
                  // 使用 slot 字段匹配，而不是 type
                  if (!item.equipped && item.slot === selectedSlot) {
                    craftedItems.push(item);
                  }
                });
              }

              if (mythEquipments.length === 0 && craftedItems.length === 0) {
                return (
                  <p style={{ color: '#a1a1aa', textAlign: 'center', padding: '20px' }}>
                    背包中没有{SLOT_NAMES[selectedSlot!]}
                  </p>
                );
              }

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* 神话装备 */}
                  {mythEquipments.map(equipment => {
                    const { quality: eqQuality } = extractEquipmentName(equipment.name);
                    const eqQualityConfig = eqQuality ? QUALITY_CONFIG[eqQuality] : null;
                    const eqColor = eqQualityConfig ? eqQualityConfig.color : RARITY_COLORS[equipment.rarity as keyof typeof RARITY_COLORS];
                    return (
                      <button
                        key={equipment.instanceId}
                        onClick={() => handleEquipFromBackpack(equipment)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px',
                          backgroundColor: '#1f2937',
                          border: `2px solid ${eqColor}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <span style={{ fontSize: '24px', color: eqColor }}>{SLOT_ICONS[equipment.slot]}</span>
                        <div style={{ flex: 1 }}>
                          <p style={{
                            color: eqColor,
                            fontWeight: 'bold',
                            margin: '0 0 4px 0',
                            fontSize: '14px'
                          }}>
                            {equipment.name}
                          </p>
                          <p style={{ color: '#a1a1aa', margin: 0, fontSize: '11px' }}>
                            神话 · 强化+{equipment.enhanceLevel}
                            {equipment.sublimationLevel > 0 && ` 升华+${equipment.sublimationLevel}`}
                          </p>
                        </div>
                      </button>
                    );
                  })}

                  {/* 制造装备 */}
                  {craftedItems.map(item => {
                    const { quality: itemQuality } = extractEquipmentName(item.name);
                    const itemQualityConfig = itemQuality ? QUALITY_CONFIG[itemQuality] : null;
                    const itemColor = itemQualityConfig ? itemQualityConfig.color : RARITY_COLORS[item.rarity as keyof typeof RARITY_COLORS];
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          // 装备制造的装备
                          player.equipInventoryItem(item);
                          setShowBackpack(false);
                          setSelectedSlot(null);
                          forceRefresh();
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px',
                          backgroundColor: '#1f2937',
                          border: `2px solid ${itemColor}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <span style={{ fontSize: '24px', color: itemColor }}>{SLOT_ICONS[selectedSlot!]}</span>
                        <div style={{ flex: 1 }}>
                          <p style={{
                            color: itemColor,
                            fontWeight: 'bold',
                            margin: '0 0 4px 0',
                            fontSize: '14px'
                          }}>
                            {item.name}
                          </p>
                          <p style={{ color: '#a1a1aa', margin: 0, fontSize: '11px' }}>
                            制造 · 强化+{item.enhanceLevel || 0}
                            {(item.sublimationLevel || 0) > 0 && ` 升华+${item.sublimationLevel}`}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })()}

            <button
              onClick={() => {
                setShowBackpack(false);
                setSelectedSlot(null);
              }}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#374151',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginTop: '16px'
              }}
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 统一的装备显示组件 - 支持新旧两种装备系统
interface UnifiedEquipment {
  name: string;
  rarity: string;
  enhanceLevel: number;
  sublimationLevel: number;
  isOldSystem: boolean;
  originalItem: EquipmentInstance | InventoryItem;
}

// 将旧装备转换为统一格式
function convertOldItemToUnified(item: InventoryItem | null): UnifiedEquipment | null {
  if (!item) return null;
  return {
    name: item.name,
    rarity: item.rarity,
    enhanceLevel: item.enhanceLevel || 0,
    sublimationLevel: item.sublimationLevel || 0,
    isOldSystem: true,
    originalItem: item,
  };
}

// 将新装备转换为统一格式
function convertNewItemToUnified(item: EquipmentInstance | null): UnifiedEquipment | null {
  if (!item) return null;
  return {
    name: item.name,
    rarity: item.rarity,
    enhanceLevel: item.enhanceLevel || 0,
    sublimationLevel: item.sublimationLevel || 0,
    isOldSystem: false,
    originalItem: item,
  };
}

// 品质配置
const QUALITY_CONFIG: Record<string, { name: string; color: string; borderWidth: string; boxShadow: string; animation?: string }> = {
  '星尘级': {
    name: '星尘',
    color: '#9ca3af',
    borderWidth: '0px',
    boxShadow: 'inset 0 0 10px rgba(156, 163, 175, 0.2)',
  },
  '合金级': {
    name: '合金',
    color: '#4ade80',
    borderWidth: '1px',
    boxShadow: 'inset 0 0 8px rgba(74, 222, 128, 0.3), 0 0 5px rgba(74, 222, 128, 0.2)',
  },
  '晶核级': {
    name: '晶核',
    color: '#60a5fa',
    borderWidth: '2px',
    boxShadow: 'inset 0 0 12px rgba(96, 165, 250, 0.4), 0 0 8px rgba(96, 165, 250, 0.3)',
  },
  '量子级': {
    name: '量子',
    color: '#c084fc',
    borderWidth: '2px',
    boxShadow: 'inset 0 0 15px rgba(192, 132, 252, 0.5), 0 0 10px rgba(192, 132, 252, 0.4)',
  },
  '虚空级': {
    name: '虚空',
    color: '#f59e0b',
    borderWidth: '3px',
    boxShadow: 'inset 0 0 20px rgba(245, 158, 11, 0.6), 0 0 15px rgba(245, 158, 11, 0.5), 0 0 30px rgba(245, 158, 11, 0.2)',
  },
};

// 提取装备名称（移除品质前缀或括号内的品质标记）
function extractEquipmentName(fullName: string): { quality: string; name: string } {
  // 检查前缀格式：星尘级/合金级/晶核级/量子级/虚空级
  const qualityPrefixes = ['星尘级', '合金级', '晶核级', '量子级', '虚空级'];
  for (const prefix of qualityPrefixes) {
    if (fullName.startsWith(prefix)) {
      return { quality: prefix, name: fullName.slice(prefix.length) };
    }
  }

  // 检查括号格式：(星尘)/(合金)/(晶核)/(量子)/(虚空)
  const bracketMatch = fullName.match(/\((星尘|合金|晶核|量子|虚空)\)$/);
  if (bracketMatch) {
    const qualityMap: Record<string, string> = {
      '星尘': '星尘级',
      '合金': '合金级',
      '晶核': '晶核级',
      '量子': '量子级',
      '虚空': '虚空级',
    };
    const quality = qualityMap[bracketMatch[1]] || '';
    const name = fullName.slice(0, fullName.length - bracketMatch[0].length);
    return { quality, name };
  }

  return { quality: '', name: fullName };
}

// 装备槽位组件
function EquipmentSlotItem({ slot, item, onClick, hasItemInBackpack }: { slot: EquipmentSlot; item: UnifiedEquipment | null; onClick?: () => void; hasItemInBackpack?: boolean }) {
  if (!item) {
    return (
      <div
        onClick={onClick}
        style={{
          backgroundColor: 'rgba(31, 41, 55, 0.5)',
          borderRadius: '6px',
          padding: '6px 2px',
          border: '1px dashed #374151',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flex: 1,
          minWidth: 0,
          height: '50px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <span style={{
          fontSize: '11px',
          color: '#6b7280',
          textAlign: 'center'
        }}>
          {SLOT_NAMES[slot]}
        </span>
        {/* 背包中有对应部件时显示绿色小点 */}
        {hasItemInBackpack && (
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
      </div>
    );
  }

  const { quality, name } = extractEquipmentName(item.name);
  const qualityConfig = quality ? QUALITY_CONFIG[quality] : null;
  const borderColor = qualityConfig ? qualityConfig.color : RARITY_COLORS[item.rarity as keyof typeof RARITY_COLORS];
  const borderWidth = qualityConfig ? qualityConfig.borderWidth : '1px';
  const boxShadow = qualityConfig ? qualityConfig.boxShadow : 'none';
  // 完整名称：品质前缀 + 装备名
  const fullDisplayName = quality ? `${quality}${name}` : item.name;

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: '#1f2937',
        borderRadius: '6px',
        padding: '4px',
        border: `${borderWidth} solid ${borderColor}`,
        boxShadow,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        flex: 1,
        minWidth: 0,
        height: '50px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* 装备名称（包含品质前缀，占满格子） */}
      <span style={{
        fontSize: '9px',
        color: borderColor,
        textAlign: 'center',
        fontWeight: 'bold',
        lineHeight: '1.2',
        overflow: 'hidden',
        display: 'flex',
        flex: 1,
        width: '100%',
        padding: '0 1px',
        wordBreak: 'break-all',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {fullDisplayName}
      </span>


    </div>
  );
}

// 属性项组件
function StatItem({ label, value, color, flex = 1 }: { label: string; value: string | number; color: string; flex?: number }) {
  return (
    <div style={{
      backgroundColor: '#1f2937',
      borderRadius: '6px',
      padding: '8px 6px',
      textAlign: 'center',
      flex: flex,
      minWidth: 0
    }}>
      <p style={{ color: '#a1a1aa', fontSize: '10px', margin: '0 0 2px 0', whiteSpace: 'nowrap' }}>{label}</p>
      <p style={{ color, fontSize: '14px', fontWeight: 'bold', margin: 0, whiteSpace: 'nowrap' }}>
        {value}
      </p>
    </div>
  );
}

// 装备加成项组件
function EquipmentBonusItem({ label, value, color }: { label: string; value: number; color: string }) {
  if (!value || value === 0) return null;
  return (
    <div style={{
      backgroundColor: '#1f2937',
      borderRadius: '6px',
      padding: '6px 10px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span style={{ color: '#a1a1aa', fontSize: '12px' }}>{label}</span>
      <span style={{ color, fontSize: '13px', fontWeight: 'bold' }}>+{value}</span>
    </div>
  );
}
