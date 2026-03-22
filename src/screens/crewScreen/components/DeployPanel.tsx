import { useState } from 'react';
import { CrewMember, RARITY_CONFIG } from '../../../core/CrewSystem';

interface DeployPanelProps {
  crew: CrewMember;
  allCrews: CrewMember[];
  onDeploy: (crewId: string, slot: number) => void;
  onUndeploy: (crewId: string) => void;
  isPlayer: boolean;
  onClose: () => void;
}

const SLOT_POSITIONS = [
  { slot: 1, name: '前排左', position: 'front-left' },
  { slot: 2, name: '前排中', position: 'front-center' },
  { slot: 3, name: '前排右', position: 'front-right' },
  { slot: 4, name: '后排左', position: 'back-left' },
  { slot: 5, name: '后排中', position: 'back-center' },
  { slot: 6, name: '后排右', position: 'back-right' },
];

export function DeployPanel({ crew, allCrews, onDeploy, onUndeploy, isPlayer, onClose }: DeployPanelProps) {
  const deployedCrews = allCrews.filter(c => c.battleSlot > 0);
  const currentSlot = crew.battleSlot || 0;

  const getSlotOccupant = (slot: number): CrewMember | undefined => {
    return deployedCrews.find(c => c.battleSlot === slot);
  };

  const handleSlotClick = (slot: number) => {
    if (isPlayer) {
      return;
    }

    const occupant = getSlotOccupant(slot);

    if (currentSlot === slot) {
      return;
    }

    if (occupant) {
      return;
    }

    onDeploy(crew.id, slot);
    onClose();
  };

  const handleUndeploy = () => {
    if (isPlayer || currentSlot === 0) {
      return;
    }
    onUndeploy(crew.id);
    onClose();
  };

  const rarityColor = RARITY_CONFIG[crew.rarity as any]?.color || '#9ca3af';

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          zIndex: 200,
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '360px',
          background: 'linear-gradient(180deg, rgba(10, 20, 40, 0.98) 0%, rgba(5, 10, 20, 0.99) 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(0, 212, 255, 0.3)',
          padding: '20px',
          zIndex: 201,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}>
          <div style={{ color: '#00d4ff', fontSize: '18px', fontWeight: 'bold' }}>
            上阵配置
          </div>
          <button
            onClick={onClose}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#fff',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>

        {isPlayer && (
          <div style={{
            padding: '10px 12px',
            background: 'rgba(251, 191, 36, 0.1)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            borderRadius: '8px',
            marginBottom: '16px',
            color: '#fbbf24',
            fontSize: '12px',
          }}>
            主角无法下阵，固定占据当前位置
          </div>
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
        }}>
          <span style={{ color: '#9ca3af', fontSize: '13px' }}>当前状态:</span>
          {currentSlot > 0 ? (
            <span style={{
              color: '#4ade80',
              fontSize: '13px',
              fontWeight: 'bold',
            }}>
              已上阵 - {SLOT_POSITIONS.find(s => s.slot === currentSlot)?.name}
            </span>
          ) : (
            <span style={{ color: '#9ca3af', fontSize: '13px' }}>
              未上阵
            </span>
          )}
          {currentSlot > 0 && !isPlayer && (
            <button
              onClick={handleUndeploy}
              style={{
                padding: '4px 10px',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                borderRadius: '4px',
                color: '#f87171',
                fontSize: '11px',
                cursor: 'pointer',
                marginLeft: 'auto',
              }}
            >
              下阵
            </button>
          )}
        </div>

        <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '12px' }}>
          点击空位进行上阵
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          marginBottom: '8px',
        }}>
          {SLOT_POSITIONS.slice(0, 3).map(({ slot, name }) => {
            const occupant = getSlotOccupant(slot);
            const isCurrentSlot = currentSlot === slot;
            const isOccupied = !!occupant && !isCurrentSlot;

            return (
              <div
                key={slot}
                onClick={() => !isOccupied && handleSlotClick(slot)}
                style={{
                  padding: '12px 8px',
                  background: isCurrentSlot
                    ? `${rarityColor}20`
                    : isOccupied
                      ? 'rgba(100, 100, 100, 0.2)'
                      : 'rgba(30, 40, 60, 0.6)',
                  border: isCurrentSlot
                    ? `2px solid ${rarityColor}`
                    : isOccupied
                      ? '1px solid rgba(100, 100, 100, 0.3)'
                      : '1px solid rgba(0, 212, 255, 0.2)',
                  borderRadius: '8px',
                  textAlign: 'center',
                  cursor: isOccupied || isPlayer ? 'not-allowed' : 'pointer',
                  opacity: isOccupied ? 0.6 : 1,
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  fontSize: '10px',
                  color: '#9ca3af',
                  marginBottom: '4px',
                }}>
                  {name}
                </div>
                {isCurrentSlot ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}>
                    <span style={{ fontSize: '14px' }}>{crew.portrait}</span>
                    <span style={{
                      color: rarityColor,
                      fontSize: '10px',
                      fontWeight: 'bold',
                    }}>
                      {crew.name}
                    </span>
                  </div>
                ) : occupant ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}>
                    <span style={{ fontSize: '12px' }}>{occupant.portrait}</span>
                    <span style={{
                      color: '#9ca3af',
                      fontSize: '9px',
                    }}>
                      {occupant.name}
                    </span>
                  </div>
                ) : (
                  <div style={{
                    color: '#6b7280',
                    fontSize: '18px',
                  }}>
                    +
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
        }}>
          {SLOT_POSITIONS.slice(3, 6).map(({ slot, name }) => {
            const occupant = getSlotOccupant(slot);
            const isCurrentSlot = currentSlot === slot;
            const isOccupied = !!occupant && !isCurrentSlot;

            return (
              <div
                key={slot}
                onClick={() => !isOccupied && handleSlotClick(slot)}
                style={{
                  padding: '12px 8px',
                  background: isCurrentSlot
                    ? `${rarityColor}20`
                    : isOccupied
                      ? 'rgba(100, 100, 100, 0.2)'
                      : 'rgba(30, 40, 60, 0.6)',
                  border: isCurrentSlot
                    ? `2px solid ${rarityColor}`
                    : isOccupied
                      ? '1px solid rgba(100, 100, 100, 0.3)'
                      : '1px solid rgba(0, 212, 255, 0.2)',
                  borderRadius: '8px',
                  textAlign: 'center',
                  cursor: isOccupied || isPlayer ? 'not-allowed' : 'pointer',
                  opacity: isOccupied ? 0.6 : 1,
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  fontSize: '10px',
                  color: '#9ca3af',
                  marginBottom: '4px',
                }}>
                  {name}
                </div>
                {isCurrentSlot ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}>
                    <span style={{ fontSize: '14px' }}>{crew.portrait}</span>
                    <span style={{
                      color: rarityColor,
                      fontSize: '10px',
                      fontWeight: 'bold',
                    }}>
                      {crew.name}
                    </span>
                  </div>
                ) : occupant ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}>
                    <span style={{ fontSize: '12px' }}>{occupant.portrait}</span>
                    <span style={{
                      color: '#9ca3af',
                      fontSize: '9px',
                    }}>
                      {occupant.name}
                    </span>
                  </div>
                ) : (
                  <div style={{
                    color: '#6b7280',
                    fontSize: '18px',
                  }}>
                    +
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{
          marginTop: '16px',
          padding: '10px',
          background: 'rgba(30, 40, 60, 0.4)',
          borderRadius: '8px',
        }}>
          <div style={{
            color: '#9ca3af',
            fontSize: '11px',
            marginBottom: '8px',
          }}>
            已上阵船员 ({deployedCrews.length}/6)
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
          }}>
            {deployedCrews.map(c => (
              <div
                key={c.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 6px',
                  background: `${RARITY_CONFIG[c.rarity as any]?.color || '#9ca3af'}20`,
                  border: `1px solid ${RARITY_CONFIG[c.rarity as any]?.color || '#9ca3af'}40`,
                  borderRadius: '4px',
                }}
              >
                <span style={{ fontSize: '12px' }}>{c.portrait}</span>
                <span style={{
                  color: '#fff',
                  fontSize: '10px',
                }}>
                  {c.name}
                </span>
                <span style={{
                  color: '#fbbf24',
                  fontSize: '9px',
                }}>
                  {c.battleSlot}号
                </span>
              </div>
            ))}
            {deployedCrews.length === 0 && (
              <div style={{ color: '#6b7280', fontSize: '11px' }}>
                暂无上阵船员
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
