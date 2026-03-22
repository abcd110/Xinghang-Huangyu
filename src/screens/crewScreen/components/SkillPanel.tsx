import { CrewMember } from '../../../core/CrewSystem';

interface SkillPanelProps {
  crew: CrewMember;
}

interface Skill {
  id: string;
  name: string;
  icon: string;
  description: string;
  type: 'active' | 'passive' | 'ultimate';
  unlockLevel: number;
  cooldown?: number;
  damage?: string;
}

export function SkillPanel({ crew }: SkillPanelProps) {
  // 模拟技能数据
  const skills: Skill[] = [
    {
      id: 'basic',
      name: '普通攻击',
      icon: '⚔️',
      description: '对单个敌人造成100%攻击力的物理伤害。',
      type: 'active',
      unlockLevel: 1,
      damage: '100% ATK',
    },
    {
      id: 'skill1',
      name: '精准射击',
      icon: '🎯',
      description: '对单个敌人造成150%攻击力的伤害，并有30%概率造成暴击。',
      type: 'active',
      unlockLevel: 10,
      cooldown: 3,
      damage: '150% ATK',
    },
    {
      id: 'passive',
      name: '战斗直觉',
      icon: '🧠',
      description: '攻击时有20%概率提升自身10%攻击力，持续2回合。',
      type: 'passive',
      unlockLevel: 20,
    },
    {
      id: 'ultimate',
      name: '毁灭打击',
      icon: '💥',
      description: '对所有敌人造成200%攻击力的伤害，无视目标30%防御。',
      type: 'ultimate',
      unlockLevel: 50,
      cooldown: 5,
      damage: '200% ATK',
    },
  ];

  const getTypeLabel = (type: Skill['type']) => {
    switch (type) {
      case 'active':
        return { label: '主动', color: '#3b82f6' };
      case 'passive':
        return { label: '被动', color: '#22c55e' };
      case 'ultimate':
        return { label: '终极', color: '#a855f7' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {skills.map((skill) => {
        const typeInfo = getTypeLabel(skill.type);
        const isUnlocked = crew.level >= skill.unlockLevel;

        return (
          <div
            key={skill.id}
            style={{
              background: isUnlocked ? 'rgba(30, 30, 50, 0.6)' : 'rgba(30, 30, 30, 0.4)',
              borderRadius: '12px',
              padding: '16px',
              border: `1px solid ${isUnlocked ? 'rgba(0, 212, 255, 0.2)' : 'rgba(100, 100, 100, 0.2)'}`,
              opacity: isUnlocked ? 1 : 0.7,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '10px',
                  background: isUnlocked ? `${typeInfo.color}30` : 'rgba(100, 100, 100, 0.3)',
                  border: `2px solid ${isUnlocked ? typeInfo.color : '#666'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                }}
              >
                {skill.icon}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: isUnlocked ? '#fff' : '#666', fontSize: '15px', fontWeight: 'bold' }}>
                    {skill.name}
                  </span>
                  <span
                    style={{
                      background: isUnlocked ? `${typeInfo.color}30` : 'rgba(100, 100, 100, 0.3)',
                      color: isUnlocked ? typeInfo.color : '#666',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                    }}
                  >
                    {typeInfo.label}
                  </span>
                </div>

                {!isUnlocked && (
                  <div style={{ color: '#f59e0b', fontSize: '12px', marginTop: '2px' }}>
                    Lv.{skill.unlockLevel} 解锁
                  </div>
                )}
              </div>
            </div>

            <div style={{ color: isUnlocked ? '#a1a1aa' : '#666', fontSize: '13px', lineHeight: '1.5', marginBottom: '8px' }}>
              {skill.description}
            </div>

            {isUnlocked && (
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {skill.damage && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: '#9ca3af', fontSize: '11px' }}>伤害:</span>
                    <span style={{ color: '#ef4444', fontSize: '12px', fontWeight: 'bold' }}>{skill.damage}</span>
                  </div>
                )}
                {skill.cooldown && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: '#9ca3af', fontSize: '11px' }}>冷却:</span>
                    <span style={{ color: '#3b82f6', fontSize: '12px', fontWeight: 'bold' }}>{skill.cooldown}回合</span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* 技能升级提示 */}
      <div
        style={{
          background: 'rgba(0, 212, 255, 0.1)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(0, 212, 255, 0.3)',
          textAlign: 'center',
        }}
      >
        <div style={{ color: '#00d4ff', fontSize: '13px', marginBottom: '4px' }}>💡 技能升级</div>
        <div style={{ color: '#9ca3af', fontSize: '12px' }}>提升船员等级可解锁更多技能</div>
      </div>
    </div>
  );
}
