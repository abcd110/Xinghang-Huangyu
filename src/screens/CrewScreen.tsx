import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import 招募背景 from '../assets/images/招募背景.jpg';
import { CrewMember, RecruitType, RARITY_CONFIG, ROLE_CONFIG, isPlayerCrew } from '../core/CrewSystem';
import { FacilityType } from '../core/BaseFacilitySystem';

interface CrewScreenProps {
  onBack: () => void;
}

export default function CrewScreen({ onBack }: CrewScreenProps) {
  const { gameManager, saveGame, recruitCrew, recruitCrewTen, getRecruitTicketCount } = useGameStore();
  const [activeTab, setActiveTab] = useState<'recruit' | 'roster' | 'battle'>('recruit');
  const [recruitSubTab, setRecruitSubTab] = useState<'normal' | 'limited'>('normal');
  const [selectedCrew, setSelectedCrew] = useState<CrewMember | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [, setRefreshKey] = useState(0);
  const [recruitResult, setRecruitResult] = useState<CrewMember[] | null>(null);
  const [showingResult, setShowingResult] = useState(false);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);

  const crewMembers = gameManager.getCrewMembers();
  const battleCrew = gameManager.getBattleCrew();
  const capacity = gameManager.getCrewCapacity();

  const facilityLevel = gameManager.getFacilityLevel(FacilityType.CREW);

  const normalTicketCount = getRecruitTicketCount(RecruitType.NORMAL);
  const limitedTicketCount = getRecruitTicketCount(RecruitType.LIMITED);

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleRecruit = async (recruitType: RecruitType, tenPull: boolean = false) => {
    if (tenPull) {
      const result = recruitCrewTen(recruitType);
      if (result.success && result.crews) {
        setRecruitResult(result.crews);
        setCurrentResultIndex(0);
        setShowingResult(true);
        setRefreshKey(k => k + 1);
        await saveGame();
      } else {
        showMessage(result.message, 'error');
      }
    } else {
      const result = recruitCrew(recruitType);
      if (result.success && result.crew) {
        setRecruitResult([result.crew]);
        setCurrentResultIndex(0);
        setShowingResult(true);
        setRefreshKey(k => k + 1);
        await saveGame();
      } else {
        showMessage(result.message, 'error');
      }
    }
  };

  const handleSetSlot = async (crewId: string, slot: number) => {
    const result = gameManager.setCrewBattleSlot(crewId, slot);
    if (result.success) {
      showMessage(result.message, 'success');
      setRefreshKey(k => k + 1);
      setSelectedCrew(null);
      await saveGame();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const handleDismiss = async (crewId: string) => {
    if (!confirm('确定要解雇这名船员吗？')) return;
    const result = gameManager.dismissCrew(crewId);
    if (result.success) {
      showMessage(result.message, 'success');
      setRefreshKey(k => k + 1);
      setSelectedCrew(null);
      await saveGame();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const getSlotCrew = (slot: number): CrewMember | undefined => {
    return crewMembers.find(c => c.battleSlot === slot);
  };

  const renderRecruitResult = () => {
    if (!recruitResult || !showingResult) return null;

    const currentCrew = recruitResult[currentResultIndex];
    const rarityConfig = RARITY_CONFIG[currentCrew.rarity];
    const roleConfig = ROLE_CONFIG[currentCrew.role];

    const handleNext = () => {
      if (currentResultIndex < recruitResult.length - 1) {
        setCurrentResultIndex(i => i + 1);
      } else {
        setShowingResult(false);
        setRecruitResult(null);
      }
    };

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        padding: '20px',
      }}>
        <div style={{
          background: `linear-gradient(180deg, ${rarityConfig.color}20, rgba(0, 15, 30, 0.98))`,
          borderRadius: '20px',
          padding: '30px',
          maxWidth: '320px',
          width: '100%',
          border: `2px solid ${rarityConfig.color}`,
          boxShadow: `0 0 40px ${rarityConfig.color}40`,
          textAlign: 'center',
        }}>
          <div style={{
            color: rarityConfig.color,
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '8px',
            letterSpacing: '2px',
          }}>
            {rarityConfig.name}
          </div>

          <div style={{
            width: '180px',
            height: '180px',
            margin: '0 auto 16px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${rarityConfig.color}30, ${rarityConfig.color}10)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `3px solid ${rarityConfig.color}`,
            boxShadow: `0 0 30px ${rarityConfig.color}30`,
          }}>
            <div style={{ fontSize: '80px' }}>{currentCrew.portrait}</div>
          </div>

          <div style={{
            color: '#ffffff',
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '4px',
            textShadow: `0 0 10px ${rarityConfig.color}`,
          }}>
            {currentCrew.name}
          </div>

          <div style={{
            color: '#00d4ff',
            fontSize: '14px',
            marginBottom: '16px',
          }}>
            {roleConfig.name}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '20px',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#ef4444', fontSize: '18px', fontWeight: 'bold' }}>{currentCrew.stats.attack}</div>
              <div style={{ color: '#a1a1aa', fontSize: '11px' }}>攻击</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#3b82f6', fontSize: '18px', fontWeight: 'bold' }}>{currentCrew.stats.defense}</div>
              <div style={{ color: '#a1a1aa', fontSize: '11px' }}>防御</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#22c55e', fontSize: '18px', fontWeight: 'bold' }}>{currentCrew.stats.hp}</div>
              <div style={{ color: '#a1a1aa', fontSize: '11px' }}>生命</div>
            </div>
          </div>

          {recruitResult.length > 1 && (
            <div style={{
              color: '#a1a1aa',
              fontSize: '12px',
              marginBottom: '12px',
            }}>
              {currentResultIndex + 1} / {recruitResult.length}
            </div>
          )}

          <button
            onClick={handleNext}
            style={{
              width: '100%',
              padding: '14px',
              background: `linear-gradient(135deg, ${rarityConfig.color}60, ${rarityConfig.color}30)`,
              border: `1px solid ${rarityConfig.color}`,
              borderRadius: '12px',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            {currentResultIndex < recruitResult.length - 1 ? '下一个' : '确认'}
          </button>
        </div>
      </div>
    );
  };

  const renderCrewCard = (crew: CrewMember, onClick?: () => void) => {
    const rarityConfig = RARITY_CONFIG[crew.rarity];
    const roleConfig = ROLE_CONFIG[crew.role];
    const isPlayer = isPlayerCrew(crew.id);

    return (
      <div
        key={crew.id}
        onClick={onClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px',
          background: selectedCrew?.id === crew.id ? 'rgba(96, 165, 250, 0.3)' : 'rgba(30, 30, 50, 0.9)',
          borderRadius: '12px',
          marginBottom: '8px',
          border: `2px solid ${selectedCrew?.id === crew.id ? '#60a5fa' : `${rarityConfig.color}80`}`,
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.2s',
        }}
      >
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${rarityConfig.color}40, ${rarityConfig.color}20)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          border: `2px solid ${rarityConfig.color}`,
        }}>
          {crew.portrait}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '14px' }}>{crew.name}</span>
            {isPlayer && (
              <span style={{
                color: '#fbbf24',
                fontSize: '10px',
                padding: '2px 6px',
                background: 'rgba(251, 191, 36, 0.2)',
                borderRadius: '4px',
                border: '1px solid rgba(251, 191, 36, 0.5)',
              }}>
                主角
              </span>
            )}
            <span style={{
              color: rarityConfig.color,
              fontSize: '11px',
              padding: '2px 6px',
              background: `${rarityConfig.color}30`,
              borderRadius: '4px',
            }}>
              {rarityConfig.name}
            </span>
          </div>
          <div style={{ color: '#60a5fa', fontSize: '12px', marginTop: '2px' }}>
            {roleConfig.name} Lv.{crew.level}
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '4px', fontSize: '11px' }}>
            <span style={{ color: '#ef4444' }}>⚔️ {crew.stats.attack}</span>
            <span style={{ color: '#3b82f6' }}>🛡️ {crew.stats.defense}</span>
            <span style={{ color: '#22c55e' }}>❤️ {crew.stats.hp}</span>
          </div>
        </div>
        {crew.battleSlot > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#000',
            fontWeight: 'bold',
            padding: '4px 10px',
            borderRadius: '8px',
            fontSize: '12px',
          }}>
            {crew.battleSlot}号位
          </div>
        )}
      </div>
    );
  };

  const renderSlotSelector = () => {
    if (!selectedCrew) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '20px',
      }}>
        <div style={{
          background: 'linear-gradient(180deg, rgba(0, 30, 60, 0.95), rgba(0, 15, 30, 0.98))',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '350px',
          width: '100%',
          border: '1px solid rgba(0, 212, 255, 0.3)',
          boxShadow: '0 0 30px rgba(0, 212, 255, 0.2)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ color: '#00d4ff', fontSize: '16px', fontWeight: 'bold' }}>
              选择战斗位置
            </div>
            <div style={{ color: '#a1a1aa', fontSize: '12px', marginTop: '4px' }}>
              为「{selectedCrew.name}」分配位置
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            marginBottom: '16px',
          }}>
            {[1, 2, 3, 4, 5, 6].map(slot => {
              const slotCrew = getSlotCrew(slot);
              const isSelected = selectedCrew.battleSlot === slot;

              return (
                <button
                  key={slot}
                  onClick={() => handleSetSlot(selectedCrew.id, isSelected ? 0 : slot)}
                  style={{
                    aspectRatio: '1',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #00d4ff' : slotCrew ? '2px solid #f59e0b' : '2px solid rgba(255, 255, 255, 0.2)',
                    background: isSelected ? 'rgba(0, 212, 255, 0.3)' : slotCrew ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    color: isSelected ? '#00d4ff' : slotCrew ? '#f59e0b' : '#a1a1aa',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}
                >
                  <span>{slot}号</span>
                  {slotCrew && !isSelected && (
                    <span style={{ fontSize: '11px', color: '#fff' }}>{slotCrew.name}</span>
                  )}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => handleSetSlot(selectedCrew.id, 0)}
              style={{
                flex: 1,
                padding: '12px',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                borderRadius: '8px',
                color: '#ef4444',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              移出阵容
            </button>
            <button
              onClick={() => setSelectedCrew(null)}
              style={{
                flex: 1,
                padding: '12px',
                background: 'rgba(100, 100, 100, 0.3)',
                border: '1px solid rgba(100, 100, 100, 0.5)',
                borderRadius: '8px',
                color: '#a1a1aa',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              取消
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a1a',
      position: 'relative',
    }}>
      {/* Background Image */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url(${招募背景})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#0a0a1a',
        zIndex: 0,
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'linear-gradient(180deg, rgba(0, 20, 40, 0.95), rgba(0, 15, 30, 0.9))',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 212, 255, 0.2)',
          padding: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '400px', margin: '0 auto' }}>
            <button
              onClick={onBack}
              style={{
                background: 'none',
                border: 'none',
                color: '#00d4ff',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '4px 8px',
              }}
            >
              ← 返回
            </button>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#00d4ff', fontWeight: 'bold', fontSize: '18px' }}>👥 船员舱</div>
              <div style={{ color: '#a1a1aa', fontSize: '12px' }}>Lv.{facilityLevel} | 容量 {crewMembers.length}/{capacity}</div>
            </div>
            <div style={{ width: '60px' }} />
          </div>
        </header>

        {/* Message Toast */}
        {message && (
          <div style={{
            position: 'fixed',
            top: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 24px',
            borderRadius: '8px',
            background: message.type === 'success' ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)',
            color: '#fff',
            fontWeight: 'bold',
            zIndex: 200,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          }}>
            {message.text}
          </div>
        )}

        {/* Main Content */}
        <main style={{
          maxWidth: '400px',
          margin: '0 auto',
          padding: '16px',
          paddingBottom: '100px',
        }}>
          {/* Tab Switcher */}
          <div style={{
            display: 'flex',
            background: 'rgba(30, 30, 50, 0.8)',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '16px',
          }}>
            <button
              onClick={() => setActiveTab('recruit')}
              style={{
                flex: 1,
                padding: '12px',
                background: activeTab === 'recruit' ? 'linear-gradient(135deg, rgba(100, 50, 150, 0.8), rgba(60, 30, 90, 0.9))' : 'rgba(30, 30, 50, 0.6)',
                border: activeTab === 'recruit' ? '1px solid rgba(192, 132, 252, 0.6)' : '1px solid rgba(100, 100, 120, 0.3)',
                borderRadius: '8px',
                color: activeTab === 'recruit' ? '#c084fc' : '#9ca3af',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              🎰 招募
            </button>
            <button
              onClick={() => setActiveTab('roster')}
              style={{
                flex: 1,
                padding: '12px',
                background: activeTab === 'roster' ? 'linear-gradient(135deg, rgba(30, 60, 120, 0.8), rgba(20, 40, 80, 0.9))' : 'rgba(30, 30, 50, 0.6)',
                border: activeTab === 'roster' ? '1px solid rgba(96, 165, 250, 0.6)' : '1px solid rgba(100, 100, 120, 0.3)',
                borderRadius: '8px',
                color: activeTab === 'roster' ? '#60a5fa' : '#9ca3af',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              📋 船员
            </button>
            <button
              onClick={() => setActiveTab('battle')}
              style={{
                flex: 1,
                padding: '12px',
                background: activeTab === 'battle' ? 'linear-gradient(135deg, rgba(120, 60, 20, 0.8), rgba(80, 40, 15, 0.9))' : 'rgba(30, 30, 50, 0.6)',
                border: activeTab === 'battle' ? '1px solid rgba(251, 191, 36, 0.6)' : '1px solid rgba(100, 100, 120, 0.3)',
                borderRadius: '8px',
                color: activeTab === 'battle' ? '#fbbf24' : '#9ca3af',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              ⚔️ 阵容
            </button>
          </div>

          {/* Recruit Tab */}
          {activeTab === 'recruit' && (
            <div>
              {/* Sub Tab Switcher */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '20px',
              }}>
                <button
                  onClick={() => setRecruitSubTab('normal')}
                  style={{
                    flex: 1,
                    padding: '16px',
                    background: recruitSubTab === 'normal'
                      ? 'linear-gradient(135deg, rgba(30, 60, 120, 0.9), rgba(20, 40, 80, 0.95))'
                      : 'rgba(30, 30, 50, 0.8)',
                    border: recruitSubTab === 'normal'
                      ? '2px solid rgba(96, 165, 250, 0.8)'
                      : '1px solid rgba(100, 100, 120, 0.5)',
                    borderRadius: '12px',
                    color: recruitSubTab === 'normal' ? '#60a5fa' : '#9ca3af',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                >
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>🎫</div>
                  <div>普通招募</div>
                  <div style={{ fontSize: '12px', marginTop: '4px', color: '#d1d5db' }}>
                    持有: {normalTicketCount}张
                  </div>
                </button>
                <button
                  onClick={() => setRecruitSubTab('limited')}
                  style={{
                    flex: 1,
                    padding: '16px',
                    background: recruitSubTab === 'limited'
                      ? 'linear-gradient(135deg, rgba(80, 40, 120, 0.9), rgba(50, 25, 75, 0.95))'
                      : 'rgba(30, 30, 50, 0.8)',
                    border: recruitSubTab === 'limited'
                      ? '2px solid rgba(192, 132, 252, 0.8)'
                      : '1px solid rgba(100, 100, 120, 0.5)',
                    borderRadius: '12px',
                    color: recruitSubTab === 'limited' ? '#c084fc' : '#9ca3af',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: recruitSubTab === 'limited' ? '0 0 20px rgba(168, 85, 247, 0.3)' : 'none',
                  }}
                >
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>✨</div>
                  <div>限定招募</div>
                  <div style={{ fontSize: '12px', marginTop: '4px', color: '#d1d5db' }}>
                    持有: {limitedTicketCount}张
                  </div>
                </button>
              </div>

              {/* Normal Recruit Panel */}
              {recruitSubTab === 'normal' && (
                <div style={{
                  background: 'linear-gradient(180deg, rgba(20, 40, 80, 0.95), rgba(10, 20, 40, 0.98))',
                  borderRadius: '20px',
                  padding: '24px',
                  border: '2px solid rgba(59, 130, 246, 0.6)',
                  textAlign: 'center',
                  boxShadow: '0 0 30px rgba(59, 130, 246, 0.2)',
                }}>
                  <div style={{
                    fontSize: '64px',
                    marginBottom: '16px',
                    filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))',
                  }}>
                    🎫
                  </div>
                  <div style={{
                    color: '#60a5fa',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                  }}>
                    普通招募
                  </div>
                  <div style={{
                    color: '#d1d5db',
                    fontSize: '14px',
                    marginBottom: '24px',
                    lineHeight: '1.6',
                  }}>
                    <div>普通 70% | 稀有 22% | 史诗 7% | 传说 1%</div>
                    <div style={{ fontSize: '12px', marginTop: '8px', color: '#9ca3af' }}>
                      10抽保底稀有品质
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}>
                    <button
                      onClick={() => handleRecruit(RecruitType.NORMAL, false)}
                      disabled={normalTicketCount < 1}
                      style={{
                        padding: '16px',
                        background: normalTicketCount < 1
                          ? 'rgba(100, 100, 100, 0.5)'
                          : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        border: 'none',
                        borderRadius: '12px',
                        color: normalTicketCount < 1 ? '#888' : '#fff',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        cursor: normalTicketCount < 1 ? 'not-allowed' : 'pointer',
                        boxShadow: normalTicketCount < 1 ? 'none' : '0 4px 15px rgba(59, 130, 246, 0.4)',
                      }}
                    >
                      单抽 ×1
                    </button>
                    <button
                      onClick={() => handleRecruit(RecruitType.NORMAL, true)}
                      disabled={normalTicketCount < 10}
                      style={{
                        padding: '16px',
                        background: normalTicketCount < 10
                          ? 'rgba(100, 100, 100, 0.5)'
                          : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                        border: 'none',
                        borderRadius: '12px',
                        color: normalTicketCount < 10 ? '#888' : '#fff',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        cursor: normalTicketCount < 10 ? 'not-allowed' : 'pointer',
                        boxShadow: normalTicketCount < 10 ? 'none' : '0 4px 15px rgba(59, 130, 246, 0.4)',
                      }}
                    >
                      十连 ×10
                    </button>
                  </div>
                </div>
              )}

              {/* Limited Recruit Panel */}
              {recruitSubTab === 'limited' && (
                <div style={{
                  background: 'linear-gradient(180deg, rgba(60, 30, 90, 0.95), rgba(30, 15, 45, 0.98))',
                  borderRadius: '20px',
                  padding: '24px',
                  border: '2px solid rgba(168, 85, 247, 0.6)',
                  textAlign: 'center',
                  boxShadow: '0 0 40px rgba(168, 85, 247, 0.3)',
                }}>
                  <div style={{
                    fontSize: '64px',
                    marginBottom: '16px',
                    filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.5))',
                  }}>
                    ✨
                  </div>
                  <div style={{
                    color: '#c084fc',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                  }}>
                    限定招募
                  </div>
                  <div style={{
                    color: '#d1d5db',
                    fontSize: '14px',
                    marginBottom: '24px',
                    lineHeight: '1.6',
                  }}>
                    <div>普通 50% | 稀有 35% | 史诗 12% | 传说 3%</div>
                    <div style={{ fontSize: '12px', marginTop: '8px', color: '#fbbf24' }}>
                      20抽保底史诗品质
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}>
                    <button
                      onClick={() => handleRecruit(RecruitType.LIMITED, false)}
                      disabled={limitedTicketCount < 1}
                      style={{
                        padding: '16px',
                        background: limitedTicketCount < 1
                          ? 'rgba(100, 100, 100, 0.5)'
                          : 'linear-gradient(135deg, #a855f7, #9333ea)',
                        border: 'none',
                        borderRadius: '12px',
                        color: limitedTicketCount < 1 ? '#888' : '#fff',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        cursor: limitedTicketCount < 1 ? 'not-allowed' : 'pointer',
                        boxShadow: limitedTicketCount < 1 ? 'none' : '0 4px 15px rgba(168, 85, 247, 0.4)',
                      }}
                    >
                      单抽 ×1
                    </button>
                    <button
                      onClick={() => handleRecruit(RecruitType.LIMITED, true)}
                      disabled={limitedTicketCount < 10}
                      style={{
                        padding: '16px',
                        background: limitedTicketCount < 10
                          ? 'rgba(100, 100, 100, 0.5)'
                          : 'linear-gradient(135deg, #9333ea, #7c3aed)',
                        border: 'none',
                        borderRadius: '12px',
                        color: limitedTicketCount < 10 ? '#888' : '#fff',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        cursor: limitedTicketCount < 10 ? 'not-allowed' : 'pointer',
                        boxShadow: limitedTicketCount < 10 ? 'none' : '0 4px 15px rgba(168, 85, 247, 0.4)',
                      }}
                    >
                      十连 ×10
                    </button>
                  </div>
                </div>
              )}

              {/* Info */}
              <div style={{
                marginTop: '20px',
                background: 'rgba(30, 30, 50, 0.9)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid rgba(100, 100, 120, 0.5)',
              }}>
                <div style={{ color: '#d1d5db', fontSize: '12px', lineHeight: '1.6' }}>
                  <div style={{ color: '#60a5fa', fontWeight: 'bold', marginBottom: '8px' }}>💡 招募说明</div>
                  <div>• 船员可用于战斗阵容，最多配置6人</div>
                  <div>• 不同品质船员属性加成不同</div>
                </div>
              </div>
            </div>
          )}

          {/* Roster Tab */}
          {activeTab === 'roster' && (
            <div>
              {/* Stats Overview */}
              <div style={{
                background: 'rgba(30, 30, 50, 0.9)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '16px',
                border: '1px solid rgba(100, 100, 120, 0.5)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: '#a1a1aa', fontSize: '12px' }}>船员数量</div>
                    <div style={{ color: '#00d4ff', fontSize: '24px', fontWeight: 'bold' }}>
                      {crewMembers.length}<span style={{ fontSize: '14px', color: '#a1a1aa' }}>/{capacity}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#a1a1aa', fontSize: '12px' }}>战斗阵容</div>
                    <div style={{ color: '#f59e0b', fontSize: '24px', fontWeight: 'bold' }}>
                      {battleCrew.length}<span style={{ fontSize: '14px', color: '#a1a1aa' }}>/6</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Crew List */}
              {crewMembers.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#9ca3af',
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
                  <div>暂无船员</div>
                  <div style={{ fontSize: '12px', marginTop: '8px' }}>前往招募页面抽取船员</div>
                </div>
              ) : (
                <div>
                  {crewMembers.map(crew => renderCrewCard(crew, () => setSelectedCrew(crew)))}
                </div>
              )}

              {/* Selected Crew Actions */}
              {selectedCrew && (
                <div style={{
                  marginTop: '16px',
                  padding: '16px',
                  background: 'rgba(30, 30, 50, 0.9)',
                  borderRadius: '12px',
                  border: '1px solid rgba(96, 165, 250, 0.5)',
                }}>
                  <div style={{ color: '#60a5fa', fontWeight: 'bold', marginBottom: '12px' }}>
                    已选择: {selectedCrew.name}
                    {isPlayerCrew(selectedCrew.id) && (
                      <span style={{ color: '#fbbf24', marginLeft: '8px', fontSize: '12px' }}>(主角)</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => setActiveTab('battle')}
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.5), rgba(245, 158, 11, 0.2))',
                        border: '1px solid rgba(245, 158, 11, 0.6)',
                        borderRadius: '8px',
                        color: '#fbbf24',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                    >
                      设置位置
                    </button>
                    <button
                      onClick={() => handleDismiss(selectedCrew.id)}
                      disabled={isPlayerCrew(selectedCrew.id)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: isPlayerCrew(selectedCrew.id) ? 'rgba(100, 100, 100, 0.3)' : 'rgba(239, 68, 68, 0.4)',
                        border: isPlayerCrew(selectedCrew.id) ? '1px solid rgba(100, 100, 100, 0.3)' : '1px solid rgba(239, 68, 68, 0.6)',
                        borderRadius: '8px',
                        color: isPlayerCrew(selectedCrew.id) ? '#666' : '#f87171',
                        fontWeight: 'bold',
                        cursor: isPlayerCrew(selectedCrew.id) ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {isPlayerCrew(selectedCrew.id) ? '不可解雇' : '解雇'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Battle Tab */}
          {activeTab === 'battle' && (
            <div>
              <div style={{
                background: 'rgba(30, 30, 50, 0.9)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '16px',
                border: '1px solid rgba(100, 100, 120, 0.5)',
              }}>
                <div style={{ color: '#f59e0b', fontWeight: 'bold', marginBottom: '8px' }}>
                  战斗阵容配置
                </div>
                <div style={{ color: '#a1a1aa', fontSize: '12px' }}>
                  点击位置可以更换船员，最多配置6名船员参战
                </div>
              </div>

              {/* Battle Slots */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginBottom: '16px',
              }}>
                {[1, 2, 3, 4, 5, 6].map(slot => {
                  const slotCrew = getSlotCrew(slot);
                  return (
                    <div
                      key={slot}
                      onClick={() => {
                        if (slotCrew) {
                          setSelectedCrew(slotCrew);
                        }
                      }}
                      style={{
                        aspectRatio: '1',
                        borderRadius: '12px',
                        border: slotCrew ? `2px solid ${RARITY_CONFIG[slotCrew.rarity].color}` : '2px dashed rgba(150, 150, 170, 0.4)',
                        background: slotCrew ? 'rgba(30, 30, 50, 0.9)' : 'rgba(20, 20, 35, 0.8)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        padding: '8px',
                      }}
                    >
                      <div style={{
                        color: '#fbbf24',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        marginBottom: '4px',
                      }}>
                        {slot}号位
                      </div>
                      {slotCrew ? (
                        <>
                          <div style={{ fontSize: '28px' }}>{slotCrew.portrait}</div>
                          <div style={{ color: '#fff', fontSize: '11px', marginTop: '4px', textAlign: 'center' }}>
                            {slotCrew.name}
                          </div>
                          <div style={{ color: RARITY_CONFIG[slotCrew.rarity].color, fontSize: '10px' }}>
                            Lv.{slotCrew.level}
                          </div>
                        </>
                      ) : (
                        <div style={{ color: '#666', fontSize: '24px' }}>+</div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Available Crew */}
              <div style={{
                background: 'rgba(30, 30, 50, 0.9)',
                borderRadius: '12px',
                padding: '12px',
                border: '1px solid rgba(100, 100, 120, 0.5)',
              }}>
                <div style={{ color: '#60a5fa', fontSize: '12px', marginBottom: '8px' }}>
                  可用船员 (点击选择位置)
                </div>
                {crewMembers.filter(c => c.battleSlot === 0).length === 0 ? (
                  <div style={{ color: '#666', textAlign: 'center', padding: '12px' }}>
                    暂无可用船员
                  </div>
                ) : (
                  crewMembers.filter(c => c.battleSlot === 0).map(crew => (
                    <div
                      key={crew.id}
                      onClick={() => setSelectedCrew(crew)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px',
                        background: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: '8px',
                        marginBottom: '6px',
                        cursor: 'pointer',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <span style={{ fontSize: '20px' }}>{crew.portrait}</span>
                      <span style={{ color: '#fff', fontSize: '12px' }}>{crew.name}</span>
                      <span style={{ color: RARITY_CONFIG[crew.rarity].color, fontSize: '10px' }}>
                        {RARITY_CONFIG[crew.rarity].name}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>

        {/* Slot Selector Modal */}
        {renderSlotSelector()}

        {/* Recruit Result Modal */}
        {renderRecruitResult()}
      </div>
    </div>
  );
}
