import { useState, useEffect } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { CrewMember, RARITY_CONFIG, ROLE_CONFIG } from '../../core/CrewSystem';
import { POSITION_CONFIG } from '../../data/crews';
import { MainTab, ModuleConfig, DEFAULT_MODULE_CONFIG, SummonResult } from './types';
import { CrewModule } from './modules/CrewModule';
import { SummonModule } from './modules/SummonModule';
import { DeployModule } from './modules/DeployModule';

interface CrewScreenProps {
  onBack: () => void;
}

// 最大内容宽度
const MAX_CONTENT_WIDTH = 430;
// 底部抽屉把手高度
const DRAWER_HANDLE_HEIGHT = 56;

export default function CrewScreen({ onBack }: CrewScreenProps) {
  const { gameManager, saveGame } = useGameStore();
  const [activeTab, setActiveTab] = useState<MainTab>('crew');
  const [selectedCrew, setSelectedCrew] = useState<CrewMember | null>(null);
  const [crewList, setCrewList] = useState<CrewMember[]>([]);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [moduleConfig] = useState<ModuleConfig>(DEFAULT_MODULE_CONFIG);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 加载船员列表
  useEffect(() => {
    const crews = gameManager.getCrewMembers();
    setCrewList(crews);
    if (crews.length > 0 && !selectedCrew) {
      setSelectedCrew(crews[0]);
    }
  }, [gameManager]);

  // 显示消息
  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // 处理船员更新
  const handleCrewUpdate = async (updatedCrew: CrewMember) => {
    if (updatedCrew.battleSlot !== undefined) {
      gameManager.setCrewBattleSlot(updatedCrew.id, updatedCrew.battleSlot);
    }
    const crews = gameManager.getCrewMembers();
    setCrewList(crews);
    setSelectedCrew(crews.find(c => c.id === updatedCrew.id) || updatedCrew);
    await saveGame();
  };

  // 处理召唤结果
  const handleSummon = async (results: SummonResult[]) => {
    for (const result of results) {
      if (result.type === 'crew' && !result.isDuplicate) {
        const newCrew = result.item as CrewMember;
        gameManager.addCrewMember(newCrew);
      }
    }
    // 重新加载船员列表
    const crews = gameManager.getCrewMembers();
    setCrewList(crews);
    if (crews.length > 0) {
      setSelectedCrew(crews[crews.length - 1]);
    }
    await saveGame();
  };

  // 计算内容区域的内边距
  const getContentPaddingBottom = () => {
    if (activeTab === 'crew') {
      return DRAWER_HANDLE_HEIGHT + 8;
    }
    return 0;
  };

  // 渲染抽屉把手（折叠状态）
  const renderDrawerHandle = () => {
    if (activeTab !== 'crew') return null;

    return (
      <div
        onClick={() => setIsDrawerOpen(true)}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          zIndex: 100,
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: `${MAX_CONTENT_WIDTH}px`,
            height: `${DRAWER_HANDLE_HEIGHT}px`,
            background: 'linear-gradient(180deg, rgba(0, 15, 30, 0.95) 0%, rgba(0, 10, 20, 0.98) 100%)',
            borderTop: '1px solid rgba(0, 212, 255, 0.3)',
            borderRadius: '16px 16px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            boxSizing: 'border-box',
            boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* 左侧：当前船员信息 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {selectedCrew ? (
              <>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: `${(RARITY_CONFIG[selectedCrew.rarity as any] || RARITY_CONFIG.B).color}30`,
                    border: `2px solid ${(RARITY_CONFIG[selectedCrew.rarity as any] || RARITY_CONFIG.B).color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                  }}
                >
                  {selectedCrew.portrait}
                </div>
                <div>
                  <div style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>
                    {selectedCrew.name}
                  </div>
                  <div style={{ color: '#00d4ff', fontSize: '12px' }}>
                    Lv.{selectedCrew.level} · {selectedCrew.position ? POSITION_CONFIG[selectedCrew.position as any]?.name : ROLE_CONFIG[selectedCrew.role]?.name}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ color: '#9ca3af', fontSize: '14px' }}>暂无船员</div>
            )}
          </div>

          {/* 右侧：船员数量 + 展开箭头 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: '#9ca3af', fontSize: '13px' }}>
              船员 {crewList.length}
            </div>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'rgba(0, 212, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00d4ff',
                fontSize: '12px',
              }}
            >
              ▲
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 渲染展开的抽屉
  const renderDrawerContent = () => {
    if (activeTab !== 'crew' || !isDrawerOpen) return null;

    return (
      <>
        {/* 遮罩层 */}
        <div
          onClick={() => setIsDrawerOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            zIndex: 200,
            animation: 'fadeIn 0.2s ease-out',
          }}
        />

        {/* 抽屉内容 */}
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            zIndex: 201,
            animation: 'slideUp 0.3s ease-out',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: `${MAX_CONTENT_WIDTH}px`,
              maxHeight: '70vh',
              background: 'linear-gradient(180deg, rgba(10, 20, 40, 0.98) 0%, rgba(5, 10, 20, 0.99) 100%)',
              borderRadius: '20px 20px 0 0',
              borderTop: '1px solid rgba(0, 212, 255, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 -8px 40px rgba(0, 0, 0, 0.6)',
            }}
          >
            {/* 抽屉头部 */}
            <div
              onClick={() => setIsDrawerOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px 20px',
                borderBottom: '1px solid rgba(0, 212, 255, 0.1)',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '4px',
                  background: 'rgba(0, 212, 255, 0.3)',
                  borderRadius: '2px',
                  marginBottom: '8px',
                }}
              />
            </div>

            {/* 标题 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 20px 16px',
              }}
            >
              <div style={{ color: '#00d4ff', fontSize: '16px', fontWeight: 'bold' }}>
                船员列表 ({crewList.length})
              </div>
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  setActiveTab('summon');
                }}
                style={{
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #a855f7, #9333ea)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>✨</span>
                <span>召唤</span>
              </button>
            </div>

            {/* 船员列表 */}
            <div
              style={{
                flex: 1,
                overflow: 'auto',
                padding: '0 20px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {crewList.map((crew) => {
                const isSelected = selectedCrew?.id === crew.id;
                const rarityColor = RARITY_CONFIG[crew.rarity]?.color || '#9ca3af';
                const positionConfig = crew.position
                  ? POSITION_CONFIG[crew.position as any]
                  : ROLE_CONFIG[crew.role] || { name: '未知', icon: '❓', color: '#9ca3af' };

                return (
                  <div
                    key={crew.id}
                    onClick={() => {
                      setSelectedCrew(crew);
                      setIsDrawerOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      background: isSelected ? 'rgba(0, 212, 255, 0.15)' : 'rgba(30, 30, 50, 0.6)',
                      border: `1px solid ${isSelected ? '#00d4ff' : 'rgba(100, 100, 100, 0.2)'}`,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {/* 头像 */}
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: `${rarityColor}30`,
                        border: `2px solid ${rarityColor}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        boxShadow: isSelected ? `0 0 15px ${rarityColor}50` : 'none',
                      }}
                    >
                      {crew.portrait}
                    </div>

                    {/* 信息 */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ color: '#fff', fontSize: '15px', fontWeight: 'bold' }}>
                          {crew.name}
                        </span>
                        <span
                          style={{
                            background: `${rarityColor}30`,
                            color: rarityColor,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                          }}
                        >
                          {(RARITY_CONFIG[crew.rarity as any] || RARITY_CONFIG.B).name}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ color: '#00d4ff', fontSize: '13px' }}>Lv.{crew.level}</span>
                        <span style={{ color: positionConfig.color, fontSize: '12px' }}>
                          {positionConfig.icon} {positionConfig.name}
                        </span>
                        {crew.battleSlot > 0 && (
                          <span style={{ color: '#fbbf24', fontSize: '12px' }}>
                            ⚔️ {crew.battleSlot}号位
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 选中指示 */}
                    {isSelected && (
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: '#00d4ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#000',
                          fontSize: '14px',
                          fontWeight: 'bold',
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                );
              })}

              {crewList.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>👤</div>
                  <div style={{ fontSize: '15px', marginBottom: '8px' }}>暂无船员</div>
                  <div style={{ fontSize: '13px' }}>点击上方召唤按钮获取船员</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}</style>
      </>
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#0a0a1a',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* 消息提示 */}
      {message && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 24px',
            borderRadius: '8px',
            background: message.type === 'success' ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)',
            color: '#fff',
            fontWeight: 'bold',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          }}
        >
          {message.text}
        </div>
      )}

      {/* 顶部导航 - 限制宽度 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          background: 'rgba(0, 10, 20, 0.95)',
          borderBottom: '1px solid rgba(0, 212, 255, 0.2)',
          flexShrink: 0,
          paddingTop: 'max(env(safe-area-inset-top, 0), 4px)',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: `${MAX_CONTENT_WIDTH}px`,
            display: 'flex',
            padding: '8px',
            gap: '8px',
          }}
        >
          <button
            onClick={onBack}
            style={{
              padding: '10px 16px',
              background: 'transparent',
              border: 'none',
              color: '#00d4ff',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            ← 返回
          </button>

          <div style={{ flex: 1, display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {[
              { id: 'crew' as MainTab, label: '船员', icon: '👤' },
              { id: 'summon' as MainTab, label: '召唤', icon: '✨' },
              { id: 'deploy' as MainTab, label: '上阵', icon: '🎯' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '10px 20px',
                    background: isActive ? 'rgba(0, 212, 255, 0.2)' : 'transparent',
                    border: isActive ? '1px solid rgba(0, 212, 255, 0.5)' : '1px solid transparent',
                    borderRadius: '8px',
                    color: isActive ? '#00d4ff' : '#9ca3af',
                    fontSize: '14px',
                    fontWeight: isActive ? 'bold' : 'normal',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div style={{ width: '60px' }} />
        </div>
      </div>

      {/* 主内容区 - 可滚动 */}
      <main
        style={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: `${MAX_CONTENT_WIDTH}px`,
            padding: '0 16px',
            paddingBottom: `${getContentPaddingBottom()}px`,
            boxSizing: 'border-box',
          }}
        >
          {activeTab === 'crew' ? (
            selectedCrew ? (
              <CrewModule
                crew={selectedCrew}
                config={moduleConfig.crew}
                allCrews={crewList}
                onCrewUpdate={handleCrewUpdate}
                onShowMessage={showMessage}
              />
            ) : (
              <div
                style={{
                  minHeight: '50vh',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9ca3af',
                }}
              >
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>👤</div>
                <div style={{ fontSize: '18px', marginBottom: '8px' }}>暂无船员</div>
                <div style={{ fontSize: '14px' }}>点击下方船员列表召唤船员</div>
              </div>
            )
          ) : activeTab === 'summon' ? (
            <SummonModule onSummon={handleSummon} onShowMessage={showMessage} ownedCrews={crewList} />
          ) : (
            <DeployModule
              crewList={crewList}
              onCrewUpdate={handleCrewUpdate}
              onShowMessage={showMessage}
            />
          )}
        </div>
      </main>

      {/* 底部抽屉 */}
      {renderDrawerHandle()}
      {renderDrawerContent()}
    </div>
  );
}
