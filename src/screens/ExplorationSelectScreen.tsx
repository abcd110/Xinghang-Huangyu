import { useGameStore } from '../stores/gameStore';

interface ExplorationSelectScreenProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

export default function ExplorationSelectScreen({ onBack, onNavigate }: ExplorationSelectScreenProps) {
  const { gameManager } = useGameStore();
  const isMythologyUnlocked = gameManager.isMythologyUnlocked();

  return (
    <div style={{
      height: '100vh',
      backgroundColor: '#1a1a1a',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 顶部标题栏 */}
      <header style={{
        flexShrink: 0,
        backgroundColor: '#2d2d2d',
        borderBottom: '1px solid #4b5563',
        padding: '12px 16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#9ca3af',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            <span>←</span>
            <span>返回</span>
          </button>
          <h1 style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>🗺️ 探索</h1>
          <div style={{ width: '48px' }} />
        </div>
      </header>

      {/* 主内容区 */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px 16px'
      }}>
        {/* 标题 */}
        <div style={{
          textAlign: 'center',
          marginBottom: '24px'
        }}>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>选择探索区域</p>
        </div>

        {/* 探索选项 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* 普通站台 */}
          <button
            onClick={() => onNavigate('normal-stations')}
            style={{
              background: 'linear-gradient(135deg, #166534 0%, #15803d 100%)',
              border: '2px solid #22c55e',
              borderRadius: '16px',
              padding: '24px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(34, 197, 94, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.3)';
            }}
          >
            {/* 图标 */}
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px'
            }}>
              🚉
            </div>

            {/* 内容 */}
            <div style={{ flex: 1, textAlign: 'left' }}>
              <h2 style={{
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold',
                margin: '0 0 6px 0'
              }}>
                普通站台
              </h2>
              <p style={{
                color: '#86efac',
                fontSize: '13px',
                margin: 0,
                lineHeight: '1.4'
              }}>
                探索普通站台获取资源和装备
              </p>
            </div>

            {/* 箭头 */}
            <span style={{
              color: '#22c55e',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              ›
            </span>
          </button>

          {/* 神话站台 */}
          <button
            onClick={() => {
              if (isMythologyUnlocked) {
                onNavigate('mythology');
              } else {
                alert('完成站台5「岩石峭壁中继站」Boss挑战后解锁');
              }
            }}
            style={{
              background: isMythologyUnlocked
                ? 'linear-gradient(135deg, #7c2d12 0%, #9a3412 100%)'
                : 'linear-gradient(135deg, #374151 0%, #4b5563 100%)',
              border: `2px solid ${isMythologyUnlocked ? '#ea580c' : '#6b7280'}`,
              borderRadius: '16px',
              padding: '24px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: isMythologyUnlocked
                ? '0 4px 12px rgba(234, 88, 12, 0.3)'
                : '0 4px 12px rgba(0, 0, 0, 0.2)'
            }}
            onMouseEnter={(e) => {
              if (isMythologyUnlocked) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(234, 88, 12, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = isMythologyUnlocked
                ? '0 4px 12px rgba(234, 88, 12, 0.3)'
                : '0 4px 12px rgba(0, 0, 0, 0.2)';
            }}
          >
            {/* 图标 */}
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px'
            }}>
              {isMythologyUnlocked ? '🏛️' : '🔒'}
            </div>

            {/* 内容 */}
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <h2 style={{
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  margin: 0
                }}>
                  神话站台
                </h2>
                {!isMythologyUnlocked && (
                  <span style={{
                    backgroundColor: '#6b7280',
                    color: 'white',
                    fontSize: '10px',
                    padding: '2px 8px',
                    borderRadius: '10px'
                  }}>
                    未解锁
                  </span>
                )}
              </div>
              <p style={{
                color: isMythologyUnlocked ? '#fdba74' : '#9ca3af',
                fontSize: '13px',
                margin: 0,
                lineHeight: '1.4'
              }}>
                {isMythologyUnlocked
                  ? '挑战神话站台获取稀有装备'
                  : '完成站台5「岩石峭壁中继站」Boss挑战后解锁'}
              </p>
            </div>

            {/* 箭头或锁定 */}
            <span style={{
              color: isMythologyUnlocked ? '#ea580c' : '#6b7280',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              {isMythologyUnlocked ? '›' : '🔒'}
            </span>
          </button>
        </div>

        {/* 提示信息 */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#1f2937',
          borderRadius: '12px',
          border: '1px solid #374151'
        }}>
          <p style={{
            color: '#9ca3af',
            fontSize: '12px',
            margin: 0,
            lineHeight: '1.6'
          }}>
            💡 <strong style={{ color: '#d1d5db' }}>探索提示：</strong><br />
            • 普通站台适合获取基础资源和装备<br />
            • 神话站台难度更高，但奖励更丰厚
          </p>
        </div>
      </main>
    </div>
  );
}
