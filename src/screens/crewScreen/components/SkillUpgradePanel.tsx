import { useState } from 'react';
import { CrewMember } from '../../../core/CrewSystem';
import { getCrewSkills } from '../../../data/crewSkills';
import { SkillType } from '../types/skillTypes';
import { useGameStore } from '../../../stores/gameStore';

interface SkillUpgradePanelProps {
  crew: CrewMember;
  onSkillUpgrade?: (crew: CrewMember) => void;
}

const SKILL_TYPE_CONFIG: Record<SkillType, { label: string; color: string; bgColor: string; icon: string }> = {
  [SkillType.BASIC]: { label: '普攻', color: '#9ca3af', bgColor: 'rgba(156, 163, 175, 0.2)', icon: '👊' },
  [SkillType.SKILL]: { label: '主动', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.2)', icon: '⚡' },
  [SkillType.ULTIMATE]: { label: '终极', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.2)', icon: '🔥' },
  [SkillType.TALENT]: { label: '天赋', color: '#a855f7', bgColor: 'rgba(168, 85, 247, 0.2)', icon: '✨' },
};

const UPGRADE_COSTS: Record<SkillType, number[]> = {
  [SkillType.BASIC]: [1, 2, 3, 5],
  [SkillType.SKILL]: [2, 3, 5, 8],
  [SkillType.ULTIMATE]: [3, 5, 8, 12],
  [SkillType.TALENT]: [0],
};

const SKILL_BOOK_ITEMS = {
  small: 'skill_book_small',
  medium: 'skill_book_medium',
  large: 'skill_book_large',
};

export function SkillUpgradePanel({ crew, onSkillUpgrade }: SkillUpgradePanelProps) {
  const { gameManager } = useGameStore();
  const [selectedSkill, setSelectedSkill] = useState<SkillType | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const skills = getCrewSkills(crew.id);
  const inventory = gameManager.inventory;

  const getSkillLevel = (skillType: SkillType) => {
    if (!crew.skillLevels) return 1;
    return crew.skillLevels[skillType] || 1;
  };

  const getSkillMaxLevel = (skillType: SkillType) => {
    const star = crew.star || 0;
    switch (skillType) {
      case SkillType.BASIC:
        return 5;
      case SkillType.SKILL:
      case SkillType.ULTIMATE:
        return 4 + (star >= 2 ? 1 : 0);
      case SkillType.TALENT:
        return 1;
      default:
        return 1;
    }
  };

  const getUpgradeCost = (skillType: SkillType, currentLevel: number) => {
    if (skillType === SkillType.TALENT) return 0;
    const costs = UPGRADE_COSTS[skillType];
    return costs[currentLevel - 1] || 0;
  };

  const getSkillBookCount = () => {
    const small = inventory.getItem(SKILL_BOOK_ITEMS.small)?.quantity || 0;
    const medium = inventory.getItem(SKILL_BOOK_ITEMS.medium)?.quantity || 0;
    const large = inventory.getItem(SKILL_BOOK_ITEMS.large)?.quantity || 0;
    return small + medium * 3 + large * 5;
  };

  const canUpgrade = (skillType: SkillType) => {
    if (skillType === SkillType.TALENT) return false;
    const currentLevel = getSkillLevel(skillType);
    const maxLevel = getSkillMaxLevel(skillType);
    if (currentLevel >= maxLevel) return false;
    const cost = getUpgradeCost(skillType, currentLevel);
    return getSkillBookCount() >= cost;
  };

  const consumeSkillBooks = (amount: number) => {
    let remaining = amount;
    const smallItem = inventory.getItem(SKILL_BOOK_ITEMS.small);
    const mediumItem = inventory.getItem(SKILL_BOOK_ITEMS.medium);
    const largeItem = inventory.getItem(SKILL_BOOK_ITEMS.large);

    if (largeItem && remaining > 0) {
      const useCount = Math.min(Math.ceil(remaining / 5), largeItem.quantity);
      inventory.removeItem(SKILL_BOOK_ITEMS.large, useCount);
      remaining -= useCount * 5;
    }
    if (mediumItem && remaining > 0) {
      const useCount = Math.min(Math.ceil(remaining / 3), mediumItem.quantity);
      inventory.removeItem(SKILL_BOOK_ITEMS.medium, useCount);
      remaining -= useCount * 3;
    }
    if (smallItem && remaining > 0) {
      const useCount = Math.min(remaining, smallItem.quantity);
      inventory.removeItem(SKILL_BOOK_ITEMS.small, useCount);
    }
  };

  const handleUpgrade = () => {
    if (!selectedSkill) return;

    const currentLevel = getSkillLevel(selectedSkill);
    const cost = getUpgradeCost(selectedSkill, currentLevel);

    consumeSkillBooks(cost);

    const newSkillLevels = {
      ...(crew.skillLevels || {}),
      [selectedSkill]: currentLevel + 1,
    };

    const updatedCrew = {
      ...crew,
      skillLevels: newSkillLevels,
    };

    onSkillUpgrade?.(updatedCrew);
    setShowConfirm(false);
    setSelectedSkill(null);
  };

  // 渲染技能卡片
  const renderSkillCard = (skillType: SkillType) => {
    if (!skills) return null;

    let skill;
    switch (skillType) {
      case SkillType.BASIC:
        skill = skills.basic;
        break;
      case SkillType.SKILL:
        skill = skills.skill;
        break;
      case SkillType.ULTIMATE:
        skill = skills.ultimate;
        break;
      case SkillType.TALENT:
        skill = skills.talent;
        break;
    }

    if (!skill) return null;

    const config = SKILL_TYPE_CONFIG[skillType];
    const currentLevel = getSkillLevel(skillType);
    const maxLevel = getSkillMaxLevel(skillType);
    const isTalent = skillType === SkillType.TALENT;
    const isMaxLevel = currentLevel >= maxLevel;
    const upgradeCost = getUpgradeCost(skillType, currentLevel);
    const canUpgradeSkill = canUpgrade(skillType);

    return (
      <div
        key={skill.id}
        onClick={() => !isTalent && !isMaxLevel && setSelectedSkill(skillType)}
        style={{
          background: 'linear-gradient(135deg, rgba(30, 30, 50, 0.8), rgba(20, 20, 40, 0.6))',
          borderRadius: '12px',
          padding: '12px',
          border: `2px solid ${selectedSkill === skillType ? config.color : `${config.color}40`}`,
          cursor: isTalent || isMaxLevel ? 'default' : 'pointer',
          opacity: isTalent ? 0.7 : 1,
          transition: 'all 0.2s',
        }}
      >
        {/* 技能头部 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <span
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: config.bgColor,
              border: `2px solid ${config.color}60`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
            }}
          >
            {config.icon}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>{skill.name}</span>
              <span
                style={{
                  background: config.bgColor,
                  color: config.color,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                }}
              >
                {config.label}
              </span>
            </div>
            {!isTalent && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <span style={{ color: '#9ca3af', fontSize: '11px' }}>等级</span>
                <span style={{ color: config.color, fontSize: '13px', fontWeight: 'bold' }}>
                  {currentLevel}
                </span>
                <span style={{ color: '#6b7280', fontSize: '11px' }}>/ {maxLevel}</span>
                {isMaxLevel && (
                  <span style={{ color: '#22c55e', fontSize: '10px', marginLeft: '4px' }}>已满级</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 等级进度条 */}
        {!isTalent && (
          <div style={{ marginBottom: '10px' }}>
            <div
              style={{
                width: '100%',
                height: '6px',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '3px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${(currentLevel / maxLevel) * 100}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${config.color}, ${config.color}80)`,
                  borderRadius: '3px',
                  transition: 'width 0.3s',
                }}
              />
            </div>
          </div>
        )}

        {/* 技能描述 */}
        <div
          style={{
            color: '#d1d5db',
            fontSize: '12px',
            lineHeight: '1.5',
            padding: '8px',
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            marginBottom: '10px',
          }}
        >
          {skill.description}
        </div>

        {/* 升级信息 */}
        {!isTalent && !isMaxLevel && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px',
              background: canUpgradeSkill ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              borderRadius: '8px',
              border: `1px solid ${canUpgradeSkill ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            }}
          >
            <span style={{ color: '#9ca3af', fontSize: '11px' }}>升级消耗</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '12px' }}>📖</span>
              <span style={{ color: canUpgradeSkill ? '#22c55e' : '#ef4444', fontSize: '13px', fontWeight: 'bold' }}>
                {upgradeCost}
              </span>
            </div>
          </div>
        )}

        {/* 升级提示 */}
        {!isTalent && !isMaxLevel && selectedSkill === skillType && (
          <div
            style={{
              marginTop: '10px',
              padding: '10px',
              background: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              textAlign: 'center',
            }}
          >
            <span style={{ color: '#60a5fa', fontSize: '12px' }}>点击确认升级按钮进行升级</span>
          </div>
        )}
      </div>
    );
  };

  if (!skills) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
        <div style={{ fontSize: '40px', marginBottom: '10px' }}>⚠️</div>
        <div>该船员暂无技能数据</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* 技能书显示 */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 30, 50, 0.8), rgba(20, 20, 40, 0.6))',
          borderRadius: '12px',
          padding: '12px',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ color: '#9ca3af', fontSize: '13px' }}>当前技能书</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '18px' }}>📖</span>
          <span style={{ color: '#a855f7', fontSize: '18px', fontWeight: 'bold' }}>
            {getSkillBookCount()}
          </span>
        </div>
      </div>

      {/* 技能列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {renderSkillCard(SkillType.BASIC)}
        {renderSkillCard(SkillType.SKILL)}
        {renderSkillCard(SkillType.ULTIMATE)}
        {renderSkillCard(SkillType.TALENT)}
      </div>

      {/* 确认升级按钮 */}
      {selectedSkill && selectedSkill !== SkillType.TALENT && (
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button
            onClick={() => setSelectedSkill(null)}
            style={{
              flex: 1,
              padding: '12px',
              background: 'rgba(107, 114, 128, 0.3)',
              border: '1px solid rgba(107, 114, 128, 0.5)',
              borderRadius: '8px',
              color: '#9ca3af',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            取消
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={!canUpgrade(selectedSkill)}
            style={{
              flex: 2,
              padding: '12px',
              background: canUpgrade(selectedSkill)
                ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                : 'rgba(107, 114, 128, 0.3)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: canUpgrade(selectedSkill) ? 'pointer' : 'not-allowed',
              opacity: canUpgrade(selectedSkill) ? 1 : 0.5,
            }}
          >
            {canUpgrade(selectedSkill) ? '确认升级' : '技能书不足'}
          </button>
        </div>
      )}

      {/* 确认对话框 */}
      {showConfirm && selectedSkill && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowConfirm(false)}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(30, 30, 50, 0.95), rgba(20, 20, 40, 0.9))',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              maxWidth: '320px',
              width: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>⚠️</div>
              <div style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
                确认升级技能？
              </div>
              <div style={{ color: '#9ca3af', fontSize: '13px' }}>
                将消耗{' '}
                <span style={{ color: '#a855f7', fontWeight: 'bold' }}>
                  {getUpgradeCost(selectedSkill, getSkillLevel(selectedSkill))} 技能书
                </span>{' '}
                升级此技能
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'rgba(107, 114, 128, 0.3)',
                  border: '1px solid rgba(107, 114, 128, 0.5)',
                  borderRadius: '8px',
                  color: '#9ca3af',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                取消
              </button>
              <button
                onClick={handleUpgrade}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
