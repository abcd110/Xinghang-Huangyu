import { useState } from 'react';
import { CrewMember, isPlayerCrew } from '../../../core/CrewSystem';
import { CREW_ASCEND_CONFIG } from '../types';
import { useGameStore } from '../../../stores/gameStore';

interface LevelUpPanelProps {
  crew: CrewMember;
  onLevelUp?: (crew: CrewMember) => void;
}

interface ExpBook {
  id: string;
  name: string;
  exp: number;
  icon: string;
  color: string;
  count: number;
}

export function LevelUpPanel({ crew, onLevelUp }: LevelUpPanelProps) {
  const { gameManager } = useGameStore();
  const [selectedBooks, setSelectedBooks] = useState<Record<string, number>>({});
  const [showMessage, setShowMessage] = useState<string | null>(null);

  const currentStar = Math.floor(crew.level / 20) + 1;
  const maxLevel = CREW_ASCEND_CONFIG[Math.min(currentStar - 1, 4)]?.maxLevel || 20;

  // 检查是否是主角（玩家）
  const isPlayer = isPlayerCrew(crew.id);

  // 从 gameManager 获取玩家拥有的经验书
  const expBooks: ExpBook[] = [
    { id: 'small', name: '初级经验书', exp: 100, icon: '📗', color: '#22c55e', count: gameManager.getExpBookCount('small') },
    { id: 'medium', name: '中级经验书', exp: 500, icon: '📘', color: '#3b82f6', count: gameManager.getExpBookCount('medium') },
    { id: 'large', name: '高级经验书', exp: 2000, icon: '📕', color: '#ef4444', count: gameManager.getExpBookCount('large') },
  ];

  // 计算当前投入的经验书提供的总经验
  const getTotalExp = () => {
    let total = 0;
    Object.entries(selectedBooks).forEach(([bookId, count]) => {
      const book = expBooks.find(b => b.id === bookId);
      if (book) {
        total += book.exp * count;
      }
    });
    return total;
  };

  // 计算能升到的等级和经验进度
  const getLevelProgress = () => {
    const totalExp = getTotalExp();
    let expNeeded = 0;
    let targetLevel = crew.level;
    let currentLevelExp = 0;
    let nextLevelNeed = 0;
    
    for (let i = crew.level; i < maxLevel; i++) {
      const levelExp = i * 10 + 50;
      if (expNeeded + levelExp <= totalExp) {
        expNeeded += levelExp;
        targetLevel = i + 1;
      } else {
        currentLevelExp = totalExp - expNeeded;
        nextLevelNeed = levelExp;
        break;
      }
    }
    
    // 如果已经升到最高级
    if (targetLevel >= maxLevel) {
      return { targetLevel, expNeeded, progress: 100, currentExp: 0, nextNeed: 0, isMax: true };
    }
    
    const progress = nextLevelNeed > 0 ? (currentLevelExp / nextLevelNeed) * 100 : 0;
    return { targetLevel, expNeeded, progress, currentExp: currentLevelExp, nextNeed: nextLevelNeed, isMax: false };
  };

  const { targetLevel, expNeeded, progress, currentExp, nextNeed, isMax } = getLevelProgress();
  const totalExp = getTotalExp();

  const handleAddBook = (bookId: string) => {
    const book = expBooks.find(b => b.id === bookId);
    if (!book) return;
    
    const currentCount = selectedBooks[bookId] || 0;
    if (currentCount >= book.count) {
      setShowMessage('经验书不足');
      setTimeout(() => setShowMessage(null), 1500);
      return;
    }

    setSelectedBooks(prev => ({
      ...prev,
      [bookId]: currentCount + 1
    }));
  };

  const handleRemoveBook = (bookId: string) => {
    const currentCount = selectedBooks[bookId] || 0;
    if (currentCount <= 0) return;
    
    setSelectedBooks(prev => ({
      ...prev,
      [bookId]: currentCount - 1
    }));
  };

  const handleLevelUp = () => {
    if (targetLevel <= crew.level) return;
    
    // 消耗经验书
    Object.entries(selectedBooks).forEach(([bookId, count]) => {
      if (count > 0) {
        gameManager.consumeExpBook(bookId, count);
      }
    });
    
    const updatedCrew = { ...crew, level: targetLevel };
    onLevelUp?.(updatedCrew);
    setSelectedBooks({});
  };

  const handleReset = () => {
    setSelectedBooks({});
  };

  const hasSelectedBooks = Object.values(selectedBooks).some(count => count > 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* 提示消息 */}
      {showMessage && (
        <div
          style={{
            position: 'fixed',
            top: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '8px 16px',
            background: 'rgba(239, 68, 68, 0.9)',
            borderRadius: '6px',
            color: '#fff',
            fontSize: '13px',
            zIndex: 1000,
          }}
        >
          {showMessage}
        </div>
      )}

      {/* 当前等级信息 + 经验条 */}
      <div
        style={{
          background: 'rgba(30, 30, 50, 0.6)',
          borderRadius: '10px',
          padding: '12px',
          border: '1px solid rgba(0, 212, 255, 0.1)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <div style={{ color: '#9ca3af', fontSize: '11px', marginBottom: '2px' }}>当前等级</div>
            <div style={{ color: '#00d4ff', fontSize: '20px', fontWeight: 'bold' }}>Lv.{crew.level}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#9ca3af', fontSize: '11px', marginBottom: '2px' }}>星级</div>
            <div style={{ color: '#fbbf24', fontSize: '14px' }}>{'★'.repeat(currentStar)}</div>
          </div>
        </div>
        
        {/* 经验条 */}
        <div style={{ marginTop: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ color: '#9ca3af', fontSize: '11px' }}>
              {hasSelectedBooks ? `可升至 Lv.${targetLevel}` : '当前经验'}
            </span>
            <span style={{ color: isMax ? '#22c55e' : '#00d4ff', fontSize: '11px' }}>
              {isMax ? '已满级' : `${Math.floor(currentExp)}/${nextNeed}`}
            </span>
          </div>
          <div style={{ background: 'rgba(0, 0, 0, 0.4)', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                background: hasSelectedBooks 
                  ? 'linear-gradient(90deg, #22c55e, #4ade80)' 
                  : 'linear-gradient(90deg, #00d4ff, #38bdf8)',
                width: `${Math.min(progress, 100)}%`,
                transition: 'width 0.3s ease-out',
                boxShadow: hasSelectedBooks ? '0 0 8px rgba(34, 197, 94, 0.5)' : 'none',
              }}
            />
          </div>
        </div>
      </div>

      {/* 经验书投入区 - 主角不能通过经验书升级 */}
      {isPlayer ? (
        <div
          style={{
            background: 'rgba(30, 30, 50, 0.6)',
            borderRadius: '10px',
            padding: '20px',
            border: '1px solid rgba(0, 212, 255, 0.1)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>👑</div>
          <div style={{ color: '#fbbf24', fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>
            列车长
          </div>
          <div style={{ color: '#9ca3af', fontSize: '12px' }}>
            主角通过战斗和任务获取经验升级
          </div>
        </div>
      ) : (
        <div
          style={{
            background: 'rgba(30, 30, 50, 0.6)',
            borderRadius: '10px',
            padding: '12px',
            border: '1px solid rgba(0, 212, 255, 0.1)',
          }}
        >
          <div style={{ color: '#00d4ff', fontSize: '13px', fontWeight: 'bold', marginBottom: '10px' }}>
            投入经验书
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {expBooks.map((book) => {
              const selectedCount = selectedBooks[book.id] || 0;
              
              return (
                <div
                  key={book.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '8px',
                  }}
                >
                  {/* 图标 */}
                  <span style={{ fontSize: '24px' }}>{book.icon}</span>
                  
                  {/* 信息 */}
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>{book.name}</div>
                    <div style={{ color: '#9ca3af', fontSize: '11px' }}>+{book.exp} 经验 · 拥有 {book.count}</div>
                  </div>

                  {/* 数量控制 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => handleRemoveBook(book.id)}
                      disabled={selectedCount <= 0}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        background: selectedCount > 0 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(100, 100, 100, 0.3)',
                        border: 'none',
                        color: selectedCount > 0 ? '#ef4444' : '#666',
                        fontSize: '16px',
                        cursor: selectedCount > 0 ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      −
                    </button>
                    
                    <div
                      style={{
                        minWidth: '32px',
                        textAlign: 'center',
                        color: selectedCount > 0 ? book.color : '#9ca3af',
                        fontWeight: 'bold',
                        fontSize: '15px',
                      }}
                    >
                      {selectedCount}
                    </div>
                    
                    <button
                      onClick={() => handleAddBook(book.id)}
                      disabled={selectedCount >= book.count}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        background: selectedCount < book.count ? 'rgba(34, 197, 94, 0.3)' : 'rgba(100, 100, 100, 0.3)',
                        border: 'none',
                        color: selectedCount < book.count ? '#22c55e' : '#666',
                        fontSize: '16px',
                        cursor: selectedCount < book.count ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 底部按钮区 - 主角不显示 */}
      {!isPlayer && (
        <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
          {/* 重置按钮 - 左半边 */}
          <button
            onClick={handleReset}
            disabled={!hasSelectedBooks}
            style={{
              flex: '0 0 45%',
              padding: '12px',
              background: hasSelectedBooks ? 'rgba(100, 100, 100, 0.4)' : 'rgba(100, 100, 100, 0.2)',
              border: `1px solid ${hasSelectedBooks ? 'rgba(156, 163, 175, 0.5)' : 'rgba(100, 100, 100, 0.3)'}`,
              borderRadius: '8px',
              color: hasSelectedBooks ? '#9ca3af' : '#666',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: hasSelectedBooks ? 'pointer' : 'not-allowed',
            }}
          >
            重置
          </button>

          {/* 确认升级按钮 - 右半边 */}
          <button
            onClick={handleLevelUp}
            disabled={targetLevel <= crew.level}
            style={{
              flex: '1',
              padding: '12px',
              background: targetLevel <= crew.level ? 'rgba(100, 100, 100, 0.3)' : 'linear-gradient(135deg, #22c55e, #16a34a)',
              border: 'none',
              borderRadius: '8px',
              color: targetLevel <= crew.level ? '#666' : '#fff',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: targetLevel <= crew.level ? 'not-allowed' : 'pointer',
              boxShadow: targetLevel <= crew.level ? 'none' : '0 4px 12px rgba(34, 197, 94, 0.4)',
            }}
          >
            {targetLevel <= crew.level ? '选择经验书' : `升级 Lv.${targetLevel}`}
          </button>
        </div>
      )}
    </div>
  );
}
