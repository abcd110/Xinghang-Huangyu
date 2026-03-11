import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { QuestType, QuestStatus } from '../core/QuestSystem';

interface QuestScreenProps {
  onBack: () => void;
}

export default function QuestScreen({ onBack }: QuestScreenProps) {
  const { gameManager, claimQuestReward } = useGameStore();
  const [activeTab, setActiveTab] = useState<QuestType>(QuestType.MAIN);

  // 筛选任务：显示对应类型的所有可见任务
  // ACTIVE: 进行中, COMPLETED: 可领奖, AVAILABLE: 可接取(日常任务)
  const quests = Array.from(gameManager.quests.values()).filter(
    q => q.questType === activeTab && 
         (q.status === QuestStatus.ACTIVE || 
          q.status === QuestStatus.COMPLETED || 
          q.status === QuestStatus.AVAILABLE)
  );

  const handleClaimReward = (questId: string) => {
    claimQuestReward(questId);
    // 不弹窗提示，直接领取
  };

  const tabs = [
    { id: QuestType.MAIN, name: '主线', icon: '📖' },
    { id: QuestType.SIDE, name: '支线', icon: '📋' },
    { id: QuestType.DAILY, name: '日常', icon: '📅' },
    { id: QuestType.ACHIEVEMENT, name: '成就', icon: '🏆' },
  ];

  const getStatusBadge = (status: QuestStatus) => {
    const styles: Record<string, React.CSSProperties> = {
      completed: {
        padding: '2px 8px',
        backgroundColor: 'rgba(22, 163, 74, 0.5)',
        color: '#4ade80',
        fontSize: '12px',
        borderRadius: '4px'
      },
      active: {
        padding: '2px 8px',
        backgroundColor: 'rgba(37, 99, 235, 0.5)',
        color: '#60a5fa',
        fontSize: '12px',
        borderRadius: '4px'
      },
      default: {
        padding: '2px 8px',
        backgroundColor: '#374151',
        color: '#a1a1aa',
        fontSize: '12px',
        borderRadius: '4px'
      }
    };

    if (status === QuestStatus.COMPLETED) {
      return <span style={styles.completed}>可领奖</span>;
    }
    if (status === QuestStatus.ACTIVE) {
      return <span style={styles.active}>进行中</span>;
    }
    return <span style={styles.default}>{status}</span>;
  };

  return (
    <div style={{
      height: '100vh',
      backgroundColor: '#0a0e27',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 顶部标题栏 - 固定 */}
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
          <h1 style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>任务系统</h1>
          <div style={{ width: '48px' }} />
        </div>
      </header>

      {/* 标签页 - 固定 */}
      <section style={{
        flexShrink: 0,
        display: 'flex',
        gap: '8px',
        padding: '12px 16px',
        backgroundColor: '#0a0e27',
        borderBottom: '1px solid #374151'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              backgroundColor: activeTab === tab.id ? '#0099cc' : '#374151',
              color: activeTab === tab.id ? 'white' : '#9ca3af',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <span style={{ marginRight: '4px' }}>{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </section>

      {/* 任务列表 - 可滚动 */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px'
      }}>
        {quests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#6b7280' }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>📭</div>
            <p>暂无{tabs.find(t => t.id === activeTab)?.name}任务</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {quests.map(quest => (
              <div
                key={quest.id}
                style={{
                  backgroundColor: '#1a1f3a',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #374151'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 style={{ fontWeight: 'bold', color: 'white', fontSize: '16px', margin: 0 }}>{quest.title}</h3>
                  {getStatusBadge(quest.status)}
                </div>
                <p style={{ fontSize: '14px', color: '#a1a1aa', marginBottom: '12px' }}>{quest.description}</p>

                {/* 进度 */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                    <span>进度</span>
                    <span>{quest.getProgressText()}</span>
                  </div>
                  <div style={{ backgroundColor: '#1f2937', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        backgroundColor: '#0099cc',
                        transition: 'width 0.3s',
                        width: `${quest.getProgressPercent()}%`
                      }}
                    />
                  </div>
                </div>

                {/* 奖励 */}
                <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#a1a1aa', marginBottom: '12px' }}>
                  {quest.reward.exp > 0 && <span>🎯 {quest.reward.exp}经验</span>}
                  {quest.reward.trainCoins > 0 && <span>💰 {quest.reward.trainCoins}币</span>}
                  {quest.reward.items.length > 0 && <span>📦 {quest.reward.items.length}物品</span>}
                </div>

                {quest.status === QuestStatus.COMPLETED && (
                  <button
                    onClick={() => handleClaimReward(quest.id)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#16a34a',
                      color: 'white',
                      fontWeight: 'bold',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    领取奖励
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
