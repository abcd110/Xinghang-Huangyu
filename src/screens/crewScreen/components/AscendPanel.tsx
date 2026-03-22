import { useState } from 'react';
import { CrewMember } from '../../../core/CrewSystem';
import { RARITY_CONFIG } from '../../../core/CrewSystem';
import { getCrewSkills } from '../../../data/crewSkills';
import { StarBonus } from '../types/skillTypes';
import { useGameStore } from '../../../stores/gameStore';

interface AscendPanelProps {
  crew: CrewMember;
  onAscend?: (crew: CrewMember) => void;
}

// 效果类型颜色映射
const EFFECT_TYPE_COLORS: Record<string, string> = {
  'stat_boost': '#22c55e',
  'skill_level': '#3b82f6',
  'talent_enhance': '#a855f7',
  'special': '#f59e0b',
};

// 效果类型图标映射
const EFFECT_TYPE_ICONS: Record<string, string> = {
  'stat_boost': '📈',
  'skill_level': '⬆️',
  'talent_enhance': '✨',
  'special': '💎',
};

export function AscendPanel({ crew, onAscend }: AscendPanelProps) {
  const rarityConfig = RARITY_CONFIG[crew.rarity];
  const ascendCrew = useGameStore(state => state.ascendCrew);
  const currentEssence = crew.originEssence || 0;
  const [isEffectsExpanded, setIsEffectsExpanded] = useState(false);

  // 获取船员技能数据
  const skills = getCrewSkills(crew.id);

  // 获取当前星级（从crew.star或计算得出）
  const currentStar = crew.star || 0;
  const nextStar = currentStar + 1;

  // 获取升星配置
  const starBonuses = skills?.starBonuses || [];
  const nextStarBonus = starBonuses.find(b => b.star === nextStar);

  // 本源需求（每升1星需要更多）
  const essenceRequired = nextStar * 50;
  const canAscend = nextStar <= 5 && currentEssence >= essenceRequired;

  const handleAscend = () => {
    if (!canAscend) return;
    const result = ascendCrew(crew.id);
    if (result.success) {
      const updatedCrew = {
        ...crew,
        star: nextStar,
      };
      onAscend?.(updatedCrew);
    }
  };

  // 渲染星级效果项
  const renderStarBonus = (bonus: StarBonus, isNext: boolean = false) => {
    const isUnlocked = currentStar >= bonus.star;
    const effectColor = EFFECT_TYPE_COLORS[bonus.effectType] || '#9ca3af';
    const effectIcon = EFFECT_TYPE_ICONS[bonus.effectType] || '✦';

    return (
      <div
        key={bonus.star}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          padding: '12px',
          background: isUnlocked
            ? 'rgba(34, 197, 94, 0.1)'
            : isNext
              ? 'rgba(245, 158, 11, 0.1)'
              : 'rgba(0, 0, 0, 0.2)',
          borderRadius: '8px',
          border: `1px solid ${isUnlocked ? 'rgba(34, 197, 94, 0.3)' : isNext ? 'rgba(245, 158, 11, 0.3)' : 'rgba(107, 114, 128, 0.2)'
            }`,
          opacity: isUnlocked || isNext ? 1 : 0.5,
        }}
      >
        {/* 星级标识 */}
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: isUnlocked ? '#22c55e' : isNext ? '#f59e0b' : '#374151',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#000',
            flexShrink: 0,
          }}
        >
          {bonus.star}
        </div>

        {/* 效果内容 */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ fontSize: '14px' }}>{effectIcon}</span>
            <span
              style={{
                color: effectColor,
                fontSize: '11px',
                fontWeight: 'bold',
                textTransform: 'capitalize',
              }}
            >
              {bonus.effectType === 'stat_boost' && '属性提升'}
              {bonus.effectType === 'skill_level' && '技能等级'}
              {bonus.effectType === 'talent_enhance' && '天赋强化'}
              {bonus.effectType === 'special' && '特殊效果'}
            </span>
            {isUnlocked && (
              <span style={{ color: '#22c55e', fontSize: '11px', marginLeft: 'auto' }}>✓ 已激活</span>
            )}
            {isNext && (
              <span style={{ color: '#f59e0b', fontSize: '11px', marginLeft: 'auto' }}>🔒 下一目标</span>
            )}
          </div>
          <div
            style={{
              color: isUnlocked ? '#fff' : isNext ? '#fbbf24' : '#9ca3af',
              fontSize: '12px',
              lineHeight: '1.5',
            }}
          >
            {bonus.description}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* 当前星级展示 */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 30, 50, 0.8), rgba(20, 20, 40, 0.9))',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(251, 191, 36, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 装饰性光晕 */}
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            color: '#fbbf24',
            fontSize: '12px',
            marginBottom: '12px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          ✦ 当前星级 ✦
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '16px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              style={{
                fontSize: '36px',
                color: star <= currentStar ? '#fbbf24' : '#374151',
                filter:
                  star <= currentStar
                    ? 'drop-shadow(0 0 12px rgba(251, 191, 36, 0.8)) drop-shadow(0 0 20px rgba(251, 191, 36, 0.4))'
                    : 'none',
                transform: star <= currentStar ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.3s ease',
                display: 'inline-block',
              }}
            >
              ★
            </span>
          ))}
        </div>

        <div style={{ color: '#9ca3af', fontSize: '13px' }}>
          {currentStar === 0 ? '未升星' : `已升至 ${currentStar} 星`}
        </div>
      </div>

      {/* 升星进度 */}
      {nextStar <= 5 ? (
        <div
          style={{
            background: 'rgba(30, 30, 50, 0.6)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(0, 212, 255, 0.1)',
          }}
        >
          <div style={{ color: '#00d4ff', fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>
            升星至 {nextStar}星
          </div>

          {/* 本源进度 */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#9ca3af', fontSize: '12px' }}>本源碎片</span>
              <span
                style={{
                  color: currentEssence >= essenceRequired ? '#22c55e' : '#fbbf24',
                  fontWeight: 'bold',
                }}
              >
                {currentEssence} / {essenceRequired}
              </span>
            </div>
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: '6px', height: '10px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  background:
                    currentEssence >= essenceRequired
                      ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                      : 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                  width: `${Math.min((currentEssence / essenceRequired) * 100, 100)}%`,
                  transition: 'width 0.3s',
                }}
              />
            </div>
          </div>

          {/* 下一星级效果预览 */}
          {nextStarBonus && (
            <div
              style={{
                background: 'rgba(245, 158, 11, 0.1)',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                marginBottom: '12px',
              }}
            >
              <div style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
                ✨ {nextStar}星效果预览
              </div>
              {renderStarBonus(nextStarBonus, true)}
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            background: 'rgba(34, 197, 94, 0.2)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(34, 197, 94, 0.5)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🏆</div>
          <div style={{ color: '#22c55e', fontSize: '16px', fontWeight: 'bold' }}>已达到最高星级</div>
          <div style={{ color: '#9ca3af', fontSize: '12px', marginTop: '4px' }}>该船员已升至5星极限</div>
        </div>
      )}

      {/* 所有星级效果列表 - 可折叠 */}
      {starBonuses.length > 0 && (
        <div
          style={{
            background: 'rgba(30, 30, 50, 0.6)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(168, 85, 247, 0.2)',
          }}
        >
          {/* 折叠标题 */}
          <div
            onClick={() => setIsEffectsExpanded(!isEffectsExpanded)}
            style={{
              color: '#a855f7',
              fontSize: '14px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>⭐</span>
              <span>升星效果一览</span>
            </div>
            <span
              style={{
                fontSize: '12px',
                transform: isEffectsExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s',
              }}
            >
              ▼
            </span>
          </div>

          {/* 折叠内容 */}
          {isEffectsExpanded && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
              {starBonuses.map((bonus) => renderStarBonus(bonus))}
            </div>
          )}
        </div>
      )}

      {/* 升星按钮 */}
      {nextStar <= 5 && (
        <button
          onClick={handleAscend}
          disabled={!canAscend}
          style={{
            padding: '16px',
            background: canAscend ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(100, 100, 100, 0.3)',
            border: 'none',
            borderRadius: '12px',
            color: canAscend ? '#fff' : '#666',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: canAscend ? 'pointer' : 'not-allowed',
            boxShadow: canAscend ? '0 4px 15px rgba(245, 158, 11, 0.4)' : 'none',
          }}
        >
          {canAscend ? `升星至 ${nextStar}星` : `本源不足 (${currentEssence}/${essenceRequired})`}
        </button>
      )}
    </div>
  );
}
