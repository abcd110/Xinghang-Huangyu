import { useState } from 'react';
import type { GameManager } from '../../core/GameManager';
import { ChipSlot, ChipRarity, CHIP_RARITY_CONFIG, CHIP_CRAFT_COST } from '../../core/ChipSystem';
import { getItemName } from './utils';

export function ChipCraftPanel({ gameManager, onCraft }: { gameManager: GameManager; onCraft: (slot: ChipSlot, rarity: ChipRarity) => void }) {
  const [selectedSlot, setSelectedSlot] = useState<ChipSlot | null>(null);

  const slots = [
    { slot: ChipSlot.SLOT_1, name: '1号位', mainStat: '生命', icon: '❤️', color: '#ef4444' },
    { slot: ChipSlot.SLOT_2, name: '2号位', mainStat: '攻击', icon: '⚔️', color: '#f59e0b' },
    { slot: ChipSlot.SLOT_3, name: '3号位', mainStat: '随机', icon: '🎲', color: '#3b82f6' },
    { slot: ChipSlot.SLOT_4, name: '4号位', mainStat: '随机', icon: '🎲', color: '#22c55e' },
  ];

  return (
    <div>
      <div style={{ color: '#a1a1aa', fontSize: '12px', marginBottom: '12px' }}>
        点击图标选择槽位制作芯片
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        marginBottom: '16px',
      }}>
        {slots.map(({ slot, name, mainStat, icon, color }) => (
          <button
            key={slot}
            onClick={() => setSelectedSlot(slot)}
            style={{
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: `2px solid ${color}40`,
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${color}20`;
              e.currentTarget.style.borderColor = `${color}80`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = `${color}40`;
            }}
          >
            <span style={{ fontSize: '32px' }}>{icon}</span>
            <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>{name}</span>
            <span style={{ color, fontSize: '11px' }}>{mainStat}主属性</span>
          </button>
        ))}
      </div>

      {selectedSlot && (
        <ChipCraftModal
          slot={selectedSlot}
          gameManager={gameManager}
          onCraft={onCraft}
          onClose={() => setSelectedSlot(null)}
        />
      )}
    </div>
  );
}

function ChipCraftModal({ slot, gameManager, onCraft, onClose }: {
  slot: ChipSlot;
  gameManager: GameManager;
  onCraft: (slot: ChipSlot, rarity: ChipRarity) => void;
  onClose: () => void;
}) {
  const slotNames: Record<ChipSlot, string> = {
    [ChipSlot.SLOT_1]: '生命',
    [ChipSlot.SLOT_2]: '攻击',
    [ChipSlot.SLOT_3]: '随机',
    [ChipSlot.SLOT_4]: '随机',
  };

  const slotIcons: Record<ChipSlot, string> = {
    [ChipSlot.SLOT_1]: '❤️',
    [ChipSlot.SLOT_2]: '⚔️',
    [ChipSlot.SLOT_3]: '🎲',
    [ChipSlot.SLOT_4]: '🎲',
  };

  const chipLevel = gameManager.getChipLevel();
  const craftableRarities = gameManager.getCraftableRarities();

  const handleCraft = (rarity: ChipRarity) => {
    onCraft(slot, rarity);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        background: 'linear-gradient(180deg, #00d4ff30, #00d4ff10)',
        padding: '16px 20px',
        borderBottom: '1px solid #00d4ff50',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            color: '#a1a1aa',
            fontSize: '14px',
            cursor: 'pointer',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          ← 返回
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{
            color: '#00d4ff',
            fontSize: '18px',
            fontWeight: 'bold',
            margin: 0,
          }}>
            {slotIcons[slot]} 制作{slot}号位芯片
          </h2>
          <div style={{ color: '#a1a1aa', fontSize: '12px', marginTop: '2px' }}>
            主属性: {slotNames[slot]} | 研发等级: Lv.{chipLevel}
          </div>
        </div>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 20px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.values(ChipRarity).map(rarity => {
            const cost = CHIP_CRAFT_COST[rarity];
            const isCraftable = craftableRarities.includes(rarity);
            const canAfford = isCraftable && gameManager.trainCoins >= cost.credits &&
              cost.materials.every((m: { itemId: string; count: number }) => gameManager.inventory.hasItem(m.itemId, m.count));
            const requiredLevel = rarity === ChipRarity.EPIC ? 2 : rarity === ChipRarity.LEGENDARY ? 3 : 1;

            return (
              <div
                key={rarity}
                style={{
                  padding: '16px',
                  background: `linear-gradient(135deg, ${CHIP_RARITY_CONFIG[rarity].color}15, ${CHIP_RARITY_CONFIG[rarity].color}05)`,
                  borderRadius: '12px',
                  border: `1px solid ${CHIP_RARITY_CONFIG[rarity].color}50`,
                  opacity: isCraftable ? 1 : 0.5,
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}>
                  <span style={{
                    color: CHIP_RARITY_CONFIG[rarity].color,
                    fontWeight: 'bold',
                    fontSize: '16px',
                  }}>
                    {CHIP_RARITY_CONFIG[rarity].name}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {!isCraftable && (
                      <span style={{
                        color: '#ef4444',
                        fontSize: '11px',
                        background: 'rgba(239, 68, 68, 0.2)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                      }}>
                        需要Lv.{requiredLevel}
                      </span>
                    )}
                    <span style={{
                      color: '#a1a1aa',
                      fontSize: '11px',
                      background: 'rgba(255,255,255,0.1)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                    }}>
                      强化上限: {CHIP_RARITY_CONFIG[rarity].maxEnhance}次
                    </span>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  marginBottom: '16px',
                  fontSize: '12px',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '8px',
                  }}>
                    <span style={{ fontSize: '16px' }}>💰</span>
                    <span style={{
                      color: gameManager.trainCoins >= cost.credits ? '#fbbf24' : '#ef4444',
                      fontWeight: 'bold',
                    }}>
                      {cost.credits.toLocaleString()}
                    </span>
                    <span style={{ color: '#6b7280', marginLeft: 'auto' }}>
                      拥有: {gameManager.trainCoins.toLocaleString()}
                    </span>
                  </div>

                  {cost.materials.map((m: { itemId: string; count: number }, idx: number) => {
                    const hasEnough = gameManager.inventory.hasItem(m.itemId, m.count);
                    const currentCount = gameManager.inventory.getItem(m.itemId)?.quantity || 0;
                    const itemName = getItemName(m.itemId);
                    return (
                      <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        background: 'rgba(0,0,0,0.3)',
                        borderRadius: '8px',
                      }}>
                        <span style={{ fontSize: '16px' }}>📦</span>
                        <span style={{
                          color: hasEnough ? '#60a5fa' : '#ef4444',
                          fontWeight: 'bold',
                        }}>
                          {itemName} x{m.count}
                        </span>
                        <span style={{ color: '#6b7280', marginLeft: 'auto' }}>
                          拥有: {currentCount}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => handleCraft(rarity)}
                  disabled={!isCraftable || !canAfford}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: !isCraftable ? 'rgba(100, 100, 100, 0.3)' :
                      canAfford ? `linear-gradient(135deg, ${CHIP_RARITY_CONFIG[rarity].color}, ${CHIP_RARITY_CONFIG[rarity].color}80)` : 'rgba(100, 100, 100, 0.3)',
                    border: 'none',
                    borderRadius: '8px',
                    color: !isCraftable || !canAfford ? '#666' : '#fff',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    cursor: !isCraftable || !canAfford ? 'not-allowed' : 'pointer',
                  }}
                >
                  {!isCraftable ? `需要研发等级Lv.${requiredLevel}` : canAfford ? '制作' : '材料不足'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
