import { useState } from 'react';
import type { GameManager } from '../../core/GameManager';
import { ChipSlot, ChipRarity, CHIP_RARITY_CONFIG, CHIP_CRAFT_COST } from '../../core/ChipSystem';
import { getItemName } from './utils';

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

export function ChipCraftPanel({ gameManager, onCraft }: { gameManager: GameManager; onCraft: (slot: ChipSlot, rarity: ChipRarity) => void }) {
  const [selectedSlot, setSelectedSlot] = useState<ChipSlot | null>(null);

  return (
    <div>
      <style>{`
        @keyframes craftPulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        @keyframes scanLine {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes hexGlow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.2); }
        }
        .craft-hex {
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          position: relative;
          overflow: hidden;
        }
        .craft-hex::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, transparent 0%, rgba(0, 212, 255, 0.1) 50%, transparent 100%);
          animation: scanLine 3s linear infinite;
        }
        .craft-hex.selected::after {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(45deg, transparent 30%, currentColor 50%, transparent 70%);
          opacity: 0.3;
          animation: hexGlow 2s ease-in-out infinite;
        }
      `}</style>
      
      <div style={{ 
        color: '#00d4ff', 
        fontSize: '12px', 
        marginBottom: '12px',
        textShadow: '0 0 5px rgba(0, 212, 255, 0.5)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <span style={{ 
          width: '8px', 
          height: '8px', 
          background: '#00d4ff', 
          borderRadius: '50%',
          boxShadow: '0 0 10px #00d4ff',
          animation: 'craftPulse 2s ease-in-out infinite',
        }} />
        选择槽位制作芯片
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px', padding: '8px' }}>
        {([ChipSlot.SLOT_1, ChipSlot.SLOT_2, ChipSlot.SLOT_3, ChipSlot.SLOT_4] as ChipSlot[]).map(slot => {
          const config = SLOT_CONFIG[slot];
          const isSelected = selectedSlot === slot;
          
          return (
            <div
              key={slot}
              onClick={() => setSelectedSlot(isSelected ? null : slot)}
              className={`craft-hex ${isSelected ? 'selected' : ''}`}
              style={{
                aspectRatio: '1',
                background: isSelected 
                  ? `linear-gradient(135deg, ${config.color}30, ${config.color}10)`
                  : 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                border: isSelected 
                  ? 'none'
                  : '2px solid rgba(255, 255, 255, 0.1)',
                boxShadow: isSelected 
                  ? `0 0 20px ${config.color}40, inset 0 0 20px ${config.color}20`
                  : 'none',
                color: isSelected ? config.color : 'transparent',
                transition: 'all 0.3s ease',
              }}
            >
              <span style={{ 
                fontSize: '20px', 
                filter: isSelected ? 'drop-shadow(0 0 8px currentColor)' : 'none',
                transition: 'filter 0.3s ease',
              }}>
                {config.icon}
              </span>
              <span style={{ 
                color: '#fff', 
                fontWeight: 'bold', 
                fontSize: '10px',
                textShadow: isSelected ? `0 0 5px ${config.color}` : 'none',
              }}>
                {config.name}
              </span>
              <span style={{ 
                color: isSelected ? config.color : '#6b7280', 
                fontSize: '8px',
                transition: 'color 0.3s ease',
              }}>
                {config.stat}
              </span>
            </div>
          );
        })}
      </div>

      {selectedSlot && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.08), rgba(0, 0, 0, 0.3))',
          borderRadius: '16px',
          padding: '16px',
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
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: `linear-gradient(135deg, ${SLOT_CONFIG[selectedSlot].color}30, ${SLOT_CONFIG[selectedSlot].color}10)`,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              border: `1px solid ${SLOT_CONFIG[selectedSlot].color}40`,
              boxShadow: `0 0 10px ${SLOT_CONFIG[selectedSlot].color}30`,
            }}>
              {SLOT_CONFIG[selectedSlot].icon}
            </div>
            <div>
              <span style={{ 
                color: '#fff', 
                fontWeight: 'bold', 
                fontSize: '14px',
              }}>
                {SLOT_CONFIG[selectedSlot].name}
              </span>
              <div style={{ 
                color: SLOT_CONFIG[selectedSlot].color, 
                fontSize: '11px',
              }}>
                主属性: {SLOT_CONFIG[selectedSlot].stat}
              </div>
            </div>
          </div>

          <div style={{ 
            color: '#6b7280', 
            fontSize: '10px', 
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            ◈ 选择品质
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.values(ChipRarity).map(rarity => {
              const cost = CHIP_CRAFT_COST[rarity];
              const craftableRarities = gameManager.getCraftableRarities();
              const isCraftable = craftableRarities.includes(rarity);
              const canAfford = isCraftable &&
                gameManager.trainCoins >= cost.credits &&
                cost.materials.every((m: { itemId: string; count: number }) => gameManager.inventory.hasItem(m.itemId, m.count));
              const requiredLevel = rarity === ChipRarity.EPIC ? 2 : rarity === ChipRarity.LEGENDARY ? 3 : 1;
              const rarityColor = CHIP_RARITY_CONFIG[rarity].color;
              const glowConfig = GLOW_INTENSITY[rarity];

              return (
                <button
                  key={rarity}
                  onClick={() => { if (isCraftable && canAfford) onCraft(selectedSlot, rarity); }}
                  disabled={!isCraftable || !canAfford}
                  style={{
                    padding: '14px',
                    background: !isCraftable 
                      ? 'rgba(50, 50, 50, 0.3)'
                      : canAfford 
                        ? `linear-gradient(135deg, ${rarityColor}20, ${rarityColor}05)`
                        : 'rgba(50, 50, 50, 0.3)',
                    border: !isCraftable 
                      ? '1px solid rgba(100, 100, 100, 0.2)'
                      : canAfford 
                        ? `1px solid ${glowConfig.border}`
                        : '1px solid rgba(100, 100, 100, 0.3)',
                    borderRadius: '12px',
                    cursor: isCraftable && canAfford ? 'pointer' : 'not-allowed',
                    opacity: isCraftable ? 1 : 0.5,
                    textAlign: 'left',
                    boxShadow: isCraftable && canAfford 
                      ? `${glowConfig.shadow} ${rarityColor}30`
                      : 'none',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {isCraftable && canAfford && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '1px',
                      background: `linear-gradient(90deg, transparent, ${rarityColor}, transparent)`,
                    }} />
                  )}
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ 
                        color: rarityColor, 
                        fontWeight: 'bold', 
                        fontSize: '14px',
                        textShadow: isCraftable && canAfford ? `0 0 8px ${rarityColor}` : 'none',
                      }}>
                        {CHIP_RARITY_CONFIG[rarity].name}
                      </span>
                      <span style={{ 
                        color: '#fff', 
                        fontSize: '10px',
                        background: `${rarityColor}30`,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        border: `1px solid ${rarityColor}40`,
                      }}>
                        上限 Lv.{CHIP_RARITY_CONFIG[rarity].maxLevel}
                      </span>
                    </div>
                    <span style={{ 
                      color: '#6b7280', 
                      fontSize: '10px',
                    }}>
                      {CHIP_RARITY_CONFIG[rarity].subStatCount}条副属性
                    </span>
                  </div>
                  
                  {!isCraftable ? (
                    <div style={{ 
                      color: '#ef4444', 
                      fontSize: '11px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}>
                      <span>🔒</span>
                      需要研发等级 Lv.{requiredLevel}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '11px' }}>
                      <span style={{ 
                        color: gameManager.trainCoins >= cost.credits ? '#22c55e' : '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}>
                        💰 {cost.credits}
                      </span>
                      {cost.materials.map((m: { itemId: string; count: number }, idx: number) => {
                        const hasEnough = gameManager.inventory.hasItem(m.itemId, m.count);
                        return (
                          <span 
                            key={idx} 
                            style={{ 
                              color: hasEnough ? '#22c55e' : '#ef4444',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            {getItemName(m.itemId)} x{m.count}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
