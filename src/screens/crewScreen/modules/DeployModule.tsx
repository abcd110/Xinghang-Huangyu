import { useState, useMemo } from 'react';
import { CrewMember, RARITY_CONFIG, ROLE_CONFIG, CrewRarity, CrewRole } from '../../../core/CrewSystem';

interface DeployModuleProps {
  crewList: CrewMember[];
  onCrewUpdate?: (crew: CrewMember) => void;
  onShowMessage?: (message: string, type: 'success' | 'error') => void;
}

const SLOT_POSITIONS = [
  { slot: 1, name: '前排左', position: 'front-left', row: 'front' },
  { slot: 2, name: '前排中', position: 'front-center', row: 'front' },
  { slot: 3, name: '前排右', position: 'front-right', row: 'front' },
  { slot: 4, name: '后排左', position: 'back-left', row: 'back' },
  { slot: 5, name: '后排中', position: 'back-center', row: 'back' },
  { slot: 6, name: '后排右', position: 'back-right', row: 'back' },
];

const RARITY_ORDER = { [CrewRarity.S]: 0, [CrewRarity.A]: 1, [CrewRarity.B]: 2 };

const ROLE_ORDER = [
  CrewRole.WARRIOR,
  CrewRole.SCOUT,
  CrewRole.MEDIC,
  CrewRole.ENGINEER,
  CrewRole.TECHNICIAN,
];

export function DeployModule({ crewList, onCrewUpdate, onShowMessage }: DeployModuleProps) {
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedCrew, setSelectedCrew] = useState<CrewMember | null>(null);
  const [roleFilter, setRoleFilter] = useState<CrewRole | 'all'>('all');

  const deployedCrews = useMemo(() => crewList.filter(c => c.battleSlot > 0), [crewList]);
  const undeployedCrews = useMemo(() => crewList.filter(c => c.battleSlot === 0), [crewList]);

  const sortedUndeployedCrews = useMemo(() => {
    let filtered = undeployedCrews;
    if (roleFilter !== 'all') {
      filtered = undeployedCrews.filter(c => c.role === roleFilter);
    }
    return [...filtered].sort((a, b) => {
      const rarityDiff = RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity];
      if (rarityDiff !== 0) return rarityDiff;
      return b.level - a.level;
    });
  }, [undeployedCrews, roleFilter]);

  const getSlotOccupant = (slot: number): CrewMember | undefined => {
    return deployedCrews.find(c => c.battleSlot === slot);
  };

  const handleSlotClick = (slot: number) => {
    const occupant = getSlotOccupant(slot);
    if (occupant) {
      setSelectedCrew(occupant);
    } else {
      setSelectedSlot(slot);
      setShowDrawer(true);
      setRoleFilter('all');
    }
  };

  const handleDeploy = (crew: CrewMember, slot: number) => {
    if (crew.id === 'player') return;
    const updatedCrew = { ...crew, battleSlot: slot };
    onCrewUpdate?.(updatedCrew);
    onShowMessage?.(`${crew.name}已上阵到${SLOT_POSITIONS.find(s => s.slot === slot)?.name}`, 'success');
    setShowDrawer(false);
    setSelectedSlot(null);
  };

  const handleUndeploy = (crew: CrewMember) => {
    if (crew.id === 'player') return;
    const updatedCrew = { ...crew, battleSlot: 0 };
    onCrewUpdate?.(updatedCrew);
    onShowMessage?.(`${crew.name}已下阵`, 'success');
    setSelectedCrew(null);
  };

  const handleSwapPosition = (crew: CrewMember, newSlot: number) => {
    if (crew.id === 'player') return;
    const updatedCrew = { ...crew, battleSlot: newSlot };
    onCrewUpdate?.(updatedCrew);
    onShowMessage?.(`${crew.name}已移动到${SLOT_POSITIONS.find(s => s.slot === newSlot)?.name}`, 'success');
    setSelectedCrew(null);
  };

  const getEmptySlotsForSwap = () => {
    const occupiedSlots = new Set(deployedCrews.map(c => c.battleSlot));
    return SLOT_POSITIONS.filter(s => !occupiedSlots.has(s.slot));
  };

  const renderSlot = (slot: number, name: string) => {
    const occupant = getSlotOccupant(slot);
    const isSelected = selectedCrew?.battleSlot === slot;

    return (
      <div
        key={slot}
        onClick={() => handleSlotClick(slot)}
        style={{
          background: occupant
            ? `${RARITY_CONFIG[occupant.rarity as CrewRarity]?.color || '#9ca3af'}15`
            : 'rgba(0, 212, 255, 0.05)',
          border: isSelected
            ? '2px solid #00d4ff'
            : occupant
              ? `2px solid ${RARITY_CONFIG[occupant.rarity as CrewRarity]?.color || '#9ca3af'}60`
              : '2px dashed rgba(0, 212, 255, 0.4)',
          borderRadius: '10px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
          height: '110px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 位置标签 */}
        <div style={{
          position: 'absolute',
          top: '4px',
          left: '6px',
          fontSize: '9px',
          color: occupant ? '#6b7280' : '#4b5563',
          fontWeight: 'bold',
          zIndex: 2,
        }}>
          {name}
        </div>

        {occupant ? (
          <>
            {/* 立绘背景 */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.3,
            }}>
              <span style={{ fontSize: '72px' }}>{occupant.portrait}</span>
            </div>
            {/* 信息覆盖层 */}
            <div style={{
              position: 'relative',
              zIndex: 1,
              padding: '6px',
              background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
              width: '100%',
            }}>
              <span style={{
                color: RARITY_CONFIG[occupant.rarity as CrewRarity]?.color || '#fff',
                fontSize: '12px',
                fontWeight: 'bold',
                display: 'block',
              }}>
                {occupant.name}
              </span>
              <span style={{ color: '#9ca3af', fontSize: '10px' }}>
                Lv.{occupant.level} · {ROLE_CONFIG[occupant.role]?.name}
              </span>
            </div>
          </>
        ) : (
          <span style={{ color: 'rgba(0, 212, 255, 0.5)', fontSize: '28px', marginBottom: '30px' }}>+</span>
        )}
      </div>
    );
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '12px',
      gap: '12px',
    }}>
      {/* 标题 */}
      <div style={{ color: '#00d4ff', fontSize: '16px', fontWeight: 'bold', textAlign: 'center' }}>
        上阵配置
      </div>

      {/* 战斗阵型 - 固定高度区域 */}
      <div style={{
        background: 'rgba(0, 15, 30, 0.6)',
        borderRadius: '12px',
        padding: '12px',
        border: '1px solid rgba(0, 212, 255, 0.2)',
        height: '280px',
        flexShrink: 0,
        boxSizing: 'border-box',
      }}>
        <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '12px', textAlign: 'center' }}>
          战斗阵型 ({deployedCrews.length}/6)
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '10px' }}>
          {SLOT_POSITIONS.slice(0, 3).map(({ slot, name }) => renderSlot(slot, name))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {SLOT_POSITIONS.slice(3, 6).map(({ slot, name }) => renderSlot(slot, name))}
        </div>
      </div>

      {/* 选中船员操作面板 */}
      {selectedCrew && (
        <div style={{
          background: 'rgba(0, 15, 30, 0.9)',
          borderRadius: '10px',
          padding: '12px',
          border: '1px solid rgba(0, 212, 255, 0.3)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '32px' }}>{selectedCrew.portrait}</span>
              <div>
                <div style={{ color: RARITY_CONFIG[selectedCrew.rarity as CrewRarity]?.color || '#fff', fontSize: '14px', fontWeight: 'bold' }}>
                  {selectedCrew.name}
                </div>
                <div style={{ color: '#9ca3af', fontSize: '11px' }}>
                  {SLOT_POSITIONS.find(s => s.slot === selectedCrew.battleSlot)?.name} · {ROLE_CONFIG[selectedCrew.role]?.name}
                </div>
              </div>
            </div>
            <button onClick={() => setSelectedCrew(null)} style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>×</button>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {getEmptySlotsForSwap().length > 0 && (
              <div style={{ flex: 1 }}>
                <div style={{ color: '#9ca3af', fontSize: '10px', marginBottom: '4px' }}>换位置</div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {getEmptySlotsForSwap().map(({ slot, name }) => (
                    <button key={slot} onClick={() => handleSwapPosition(selectedCrew, slot)} style={{ padding: '4px 8px', background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.4)', borderRadius: '4px', color: '#00d4ff', fontSize: '10px', cursor: 'pointer' }}>
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {selectedCrew.id !== 'player' && (
              <button onClick={() => handleUndeploy(selectedCrew)} style={{ padding: '6px 12px', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.5)', borderRadius: '6px', color: '#f87171', fontSize: '12px', cursor: 'pointer' }}>
                下阵
              </button>
            )}
          </div>
        </div>
      )}

      {/* 底部抽屉 */}
      {showDrawer && (
        <>
          <div onClick={() => setShowDrawer(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200 }} />
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '430px',
            background: 'linear-gradient(180deg, rgba(10,20,40,0.98) 0%, rgba(5,10,20,0.99) 100%)',
            borderRadius: '16px 16px 0 0',
            borderTop: '1px solid rgba(0,212,255,0.3)',
            zIndex: 201,
            maxHeight: '60vh',
          }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0,212,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#00d4ff', fontSize: '14px', fontWeight: 'bold' }}>选择船员上阵</div>
                <div style={{ color: '#9ca3af', fontSize: '11px' }}>目标：{SLOT_POSITIONS.find(s => s.slot === selectedSlot)?.name}</div>
              </div>
              <button onClick={() => setShowDrawer(false)} style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>×</button>
            </div>

            <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(0,212,255,0.1)', display: 'flex', gap: '6px', overflowX: 'auto' }}>
              <button onClick={() => setRoleFilter('all')} style={{ padding: '4px 10px', background: roleFilter === 'all' ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.05)', border: roleFilter === 'all' ? '1px solid rgba(0,212,255,0.5)' : '1px solid transparent', borderRadius: '12px', color: roleFilter === 'all' ? '#00d4ff' : '#9ca3af', fontSize: '11px', cursor: 'pointer', whiteSpace: 'nowrap' }}>全部</button>
              {ROLE_ORDER.map((role) => (
                <button key={role} onClick={() => setRoleFilter(role)} style={{ padding: '4px 10px', background: roleFilter === role ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.05)', border: roleFilter === role ? '1px solid rgba(0,212,255,0.5)' : '1px solid transparent', borderRadius: '12px', color: roleFilter === role ? '#00d4ff' : '#9ca3af', fontSize: '11px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {ROLE_CONFIG[role].name}
                </button>
              ))}
            </div>

            <div style={{ padding: '12px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', maxHeight: '35vh', overflow: 'auto' }}>
              {sortedUndeployedCrews.map((crew) => (
                <div key={crew.id} onClick={() => selectedSlot && handleDeploy(crew, selectedSlot)} style={{ padding: '10px 4px', background: `${RARITY_CONFIG[crew.rarity as CrewRarity]?.color || '#9ca3af'}15`, border: `1px solid ${RARITY_CONFIG[crew.rarity as CrewRarity]?.color || '#9ca3af'}40`, borderRadius: '8px', textAlign: 'center', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40px' }}>
                  <span style={{ color: RARITY_CONFIG[crew.rarity as CrewRarity]?.color || '#fff', fontSize: '12px', fontWeight: 'bold' }}>{crew.name}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
