import { CrewMember, isPlayerCrew } from '../../../core/CrewSystem';
import { RARITY_CONFIG, ROLE_CONFIG } from '../../../core/CrewSystem';
import { POSITION_CONFIG } from '../../../data/crews';
import { useGameStore } from '../../../stores/gameStore';
import { getCrewSkills } from '../../../data/crewSkills';
import { SkillType } from '../types/skillTypes';

interface DetailPanelProps {
  crew: CrewMember;
}

// 技能类型配置
const SKILL_TYPE_CONFIG: Record<SkillType, { label: string; color: string; bgColor: string }> = {
  [SkillType.BASIC]: { label: '普攻', color: '#9ca3af', bgColor: 'rgba(156, 163, 175, 0.2)' },
  [SkillType.SKILL]: { label: '主动', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.2)' },
  [SkillType.ULTIMATE]: { label: '终极', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.2)' },
  [SkillType.TALENT]: { label: '天赋', color: '#a855f7', bgColor: 'rgba(168, 85, 247, 0.2)' },
};

export function DetailPanel({ crew }: DetailPanelProps) {
  const { gameManager } = useGameStore();
  const rarityConfig = RARITY_CONFIG[crew.rarity as any] || RARITY_CONFIG.B;
  // 优先使用 position，否则使用 role
  const positionConfig = crew.position ? POSITION_CONFIG[crew.position as any] : ROLE_CONFIG[crew.role];

  // 检查是否是主角
  const isPlayer = isPlayerCrew(crew.id);

  // 获取实际属性（主角从player对象获取，其他船员从crew.stats获取）
  const getActualStats = () => {
    if (isPlayer) {
      const player = gameManager.player;
      return {
        attack: player.totalAttack,
        defense: player.totalDefense,
        hp: player.maxHp,
        speed: player.totalAttackSpeed,
        critRate: player.totalCritRate,
        critDamage: player.totalCritDamage,
      };
    }
    return crew.stats;
  };

  const stats = getActualStats();

  // 获取船员技能
  const skills = getCrewSkills(crew.id);

  const displayStats = [
    { label: '攻击', value: Math.round(stats.attack), color: '#ef4444', icon: '⚔️' },
    { label: '防御', value: Math.round(stats.defense), color: '#3b82f6', icon: '🛡️' },
    { label: '生命', value: Math.round(stats.hp), color: '#22c55e', icon: '❤️' },
    { label: '攻速', value: stats.speed.toFixed(1), color: '#f59e0b', icon: '⚡' },
    { label: '暴击率', value: `${Math.round(stats.critRate || 0)}%`, color: '#ec4899', icon: '💥' },    { label: '暴伤', value: `${Math.round(stats.critDamage || 150)}%`, color: '#a855f7', icon: '🔥' },
  ];

  // 获取技能当前等级
  const getSkillLevel = (skillType: SkillType) => {
    if (!crew.skillLevels) return 1;
    return crew.skillLevels[skillType] || 1;
  };

  // 获取技能最大等级（基于星级）
  const getSkillMaxLevel = (skillType: SkillType) => {
    const star = crew.star || 0;
    switch (skillType) {
      case SkillType.BASIC:
        return 5; // 普攻基础5级
      case SkillType.SKILL:
      case SkillType.ULTIMATE:
        return 4 + (star >= 2 ? 1 : 0); // 基础4级，2星+1
      case SkillType.TALENT:
        return 1; // 天赋没有等级概念
      default:
        return 1;
    }
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

    return (
      <div
        key={skill.id}
        style={{
          background: 'linear-gradient(135deg, rgba(30, 30, 50, 0.8), rgba(20, 20, 40, 0.6))',
          borderRadius: '10px',
          padding: '10px',
          border: `1px solid ${config.color}40`,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          minHeight: isTalent ? 'auto' : undefined,
        }}
      >
        {/* 技能头部 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: config.bgColor,
              border: `1px solid ${config.color}60`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
            }}
          >
            {skill.icon}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>{skill.name}</span>
              <span
                style={{
                  background: config.bgColor,
                  color: config.color,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                }}
              >
                {config.label}
              </span>
            </div>
            {!isTalent && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                <span style={{ color: '#9ca3af', fontSize: '10px' }}>等级</span>
                <span style={{ color: config.color, fontSize: '11px', fontWeight: 'bold' }}>
                  {currentLevel}
                </span>
                <span style={{ color: '#6b7280', fontSize: '10px' }}>/ {maxLevel}</span>
                {/* 等级进度条 */}
                <div
                  style={{
                    width: '40px',
                    height: '4px',
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '2px',
                    marginLeft: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${(currentLevel / maxLevel) * 100}%`,
                      height: '100%',
                      background: config.color,
                      borderRadius: '2px',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 技能描述 */}
        <div
          style={{
            color: '#d1d5db',
            fontSize: '11px',
            lineHeight: '1.5',
            padding: '8px',
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '6px',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {skill.description}
        </div>

        {/* 技能信息 */}
        {!isTalent && 'levels' in skill && (
          <div
            style={{
              display: 'flex',
              gap: '8px',
              fontSize: '10px',
              color: '#9ca3af',
            }}
          >
            {'energyGain' in skill.levels[0] && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <span>⚡</span>
                <span>+{skill.levels[0].energyGain} 能量</span>
              </span>
            )}
            {'energyCost' in skill.levels[0] && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <span>🔋</span>
                <span>消耗 {skill.levels[0].energyCost} 能量</span>
              </span>
            )}
            {'cooldown' in skill.levels[0] && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <span>⏱️</span>
                <span>{skill.levels[0].cooldown}秒 冷却</span>
              </span>
            )}
          </div>
        )}

        {/* 天赋特殊效果 */}
        {isTalent && 'effect' in skill && (
          <div
            style={{
              padding: '8px',
              background: 'rgba(168, 85, 247, 0.1)',
              borderRadius: '6px',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <div style={{ color: '#a855f7', fontSize: '10px', fontWeight: 'bold' }}>
              效果
            </div>
            <div style={{ color: '#d1d5db', fontSize: '10px', lineHeight: '1.4' }}>{skill.effect.description}</div>
            {skill.star5Bonus && (
              <div style={{ marginTop: '4px', paddingTop: '6px', borderTop: '1px solid rgba(168, 85, 247, 0.2)' }}>
                <span style={{ color: '#f59e0b', fontSize: '10px', lineHeight: '1.4', display: 'block' }}>⭐5星额外: {skill.star5Bonus}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* 基础信息卡片 */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 30, 50, 0.8), rgba(20, 20, 40, 0.6))',
          borderRadius: '12px',
          padding: '12px',
          border: '1px solid rgba(0, 212, 255, 0.15)',
        }}
      >
        {/* 第一行：职业 + 稀有度 - 左右分布 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '12px' 
        }}>
          <span
            style={{
              background: `${positionConfig.color}20`,
              color: positionConfig.color,
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 'bold',
              border: `1px solid ${positionConfig.color}40`,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span style={{ fontSize: '12px' }}>{positionConfig.icon}</span>
            <span>{positionConfig.name}</span>
          </span>
          <span
            style={{
              background: `${rarityConfig.color}20`,
              color: rarityConfig.color,
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 'bold',
              border: `1px solid ${rarityConfig.color}40`,
            }}
          >
            {rarityConfig.name}
          </span>
        </div>

        {/* 第二行：等级和位置 - 三列均分 */}
        <div 
          style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '8px',
          }}
        >
          <div style={{ 
            textAlign: 'center',
            padding: '8px 4px',
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
          }}>
            <div style={{ color: '#9ca3af', fontSize: '10px', marginBottom: '2px' }}>等级</div>
            <div style={{ color: '#00d4ff', fontSize: '16px', fontWeight: 'bold' }}>
              {crew.level}
            </div>
          </div>
          
          <div style={{ 
            textAlign: 'center',
            padding: '8px 4px',
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
          }}>
            <div style={{ color: '#9ca3af', fontSize: '10px', marginBottom: '2px' }}>位置</div>
            <div style={{ 
              color: crew.battleSlot > 0 ? '#fbbf24' : '#6b7280', 
              fontSize: '14px', 
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
            }}>
              {crew.battleSlot > 0 ? (
                <>
                  <span>⚔️</span>
                  <span>{crew.battleSlot}号</span>
                </>
              ) : (
                <>
                  <span>💤</span>
                  <span>休息</span>
                </>
              )}
            </div>
          </div>

          <div style={{ 
            textAlign: 'center',
            padding: '8px 4px',
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
          }}>
            <div style={{ color: '#9ca3af', fontSize: '10px', marginBottom: '2px' }}>战力</div>
            <div style={{ color: '#a855f7', fontSize: '16px', fontWeight: 'bold' }}>
              {Math.round(stats.attack + stats.defense + stats.hp / 10)}
            </div>
          </div>
        </div>
      </div>

      {/* 属性面板 */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 30, 50, 0.8), rgba(20, 20, 40, 0.6))',
          borderRadius: '12px',
          padding: '12px',
          border: '1px solid rgba(0, 212, 255, 0.15)',
        }}
      >
        <div style={{ 
          color: '#00d4ff', 
          fontSize: '13px', 
          fontWeight: 'bold', 
          marginBottom: '10px',
          textAlign: 'center',
        }}>
          {isPlayer ? '战斗属性' : '基础属性'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {displayStats.map((stat) => (
            <div
              key={stat.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '8px 4px',
                background: 'rgba(0, 0, 0, 0.25)',
                borderRadius: '8px',
                border: `1px solid ${stat.color}20`,
              }}
            >
              <span style={{ fontSize: '14px', marginBottom: '2px' }}>{stat.icon}</span>
              <div style={{ color: stat.color, fontSize: '14px', fontWeight: 'bold', marginBottom: '1px' }}>
                {stat.value}
              </div>
              <div style={{ color: '#9ca3af', fontSize: '9px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 技能面板 */}
      {skills && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(30, 30, 50, 0.8), rgba(20, 20, 40, 0.6))',
            borderRadius: '12px',
            padding: '12px',
            border: '1px solid rgba(0, 212, 255, 0.15)',
          }}
        >
          <div style={{ 
            color: '#00d4ff', 
            fontSize: '13px', 
            fontWeight: 'bold', 
            marginBottom: '10px',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}>
            <span>⚔️</span>
            <span>技能</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {renderSkillCard(SkillType.BASIC)}
            {renderSkillCard(SkillType.SKILL)}
            {renderSkillCard(SkillType.ULTIMATE)}
            {renderSkillCard(SkillType.TALENT)}
          </div>
        </div>
      )}

      {/* 星级效果 */}
      {skills && skills.starBonuses && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(30, 30, 50, 0.8), rgba(20, 20, 40, 0.6))',
            borderRadius: '12px',
            padding: '12px',
            border: '1px solid rgba(245, 158, 11, 0.3)',
          }}
        >
          <div style={{ 
            color: '#f59e0b', 
            fontSize: '13px', 
            fontWeight: 'bold', 
            marginBottom: '10px',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}>
            <span>⭐</span>
            <span>星级突破效果</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {skills.starBonuses.map((bonus) => {
              const isUnlocked = (crew.star || 0) >= bonus.star;
              return (
                <div
                  key={bonus.star}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px',
                    background: isUnlocked ? 'rgba(245, 158, 11, 0.1)' : 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '6px',
                    border: `1px solid ${isUnlocked ? 'rgba(245, 158, 11, 0.3)' : 'rgba(107, 114, 128, 0.2)'}`,
                    opacity: isUnlocked ? 1 : 0.6,
                  }}
                >
                  <span
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: isUnlocked ? '#f59e0b' : '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      color: '#000',
                      flexShrink: 0,
                    }}
                  >
                    {bonus.star}
                  </span>
                  <span style={{ color: isUnlocked ? '#fbbf24' : '#9ca3af', fontSize: '11px', flex: 1 }}>
                    {bonus.description}
                  </span>
                  {isUnlocked && <span style={{ color: '#22c55e', fontSize: '12px' }}>✓</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
