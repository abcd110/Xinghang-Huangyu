import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';

interface BaseScreenProps {
  onNavigate: (screen: string, params?: unknown) => void;
  onBack: () => void;
}

// 基地功能定义
interface BaseFacility {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  level?: number;
  maxLevel?: number;
  status: 'active' | 'locked' | 'building';
}

// 基地功能列表
const FACILITIES: BaseFacility[] = [
  { id: 'crew', name: '船员舱', icon: '👥', description: '招募与管理船员', color: '#00d4ff', level: 1, maxLevel: 5, status: 'active' },
  { id: 'energy', name: '能源核心', icon: '⚡', description: '升级星舰能源系统', color: '#f59e0b', level: 1, maxLevel: 10, status: 'active' },
  { id: 'warehouse', name: '星际仓库', icon: '📦', description: '扩展存储容量', color: '#10b981', level: 1, maxLevel: 10, status: 'active' },
  { id: 'medical', name: '医疗舱', icon: '🏥', description: '提升恢复效率', color: '#ef4444', level: 1, maxLevel: 5, status: 'active' },
  { id: 'comm', name: '通讯阵列', icon: '📡', description: '接收特殊事件', color: '#8b5cf6', level: 1, maxLevel: 3, status: 'active' },
  { id: 'research', name: '科研实验室', icon: '🔬', description: '解锁新配方', color: '#c084fc', level: 1, maxLevel: 5, status: 'active' },
  // 预留功能（锁定状态）
  { id: 'mining', name: '采矿平台', icon: '⛏️', description: '自动采集矿物资源', color: '#6b7280', status: 'locked' },
  { id: 'chip', name: '芯片研发', icon: '💾', description: '研发战斗芯片', color: '#6b7280', status: 'locked' },
  { id: 'alliance', name: '联盟', icon: '🤝', description: '加入或创建联盟', color: '#6b7280', status: 'locked' },
  { id: 'arena', name: '竞技场', icon: '⚔️', description: '挑战其他玩家', color: '#6b7280', status: 'locked' },
  { id: 'market', name: '星际市场', icon: '🏪', description: '玩家间交易', color: '#6b7280', status: 'locked' },
  { id: 'relic', name: '遗迹探索', icon: '🏛️', description: '探索古代遗迹', color: '#6b7280', status: 'locked' },
];

export default function BaseScreen({ onNavigate, onBack }: BaseScreenProps) {
  const [selectedFacility, setSelectedFacility] = useState<BaseFacility | null>(null);
  const { gameManager } = useGameStore();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #0a0e27 0%, #1a1f3a 50%, #0a0e27 100%)',
    }}>
      {/* 顶部标题栏 */}
      <BaseHeader onBack={onBack} />

      {/* 基地概览 */}
      <BaseOverview />

      {/* 功能网格 */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
        }}>
          {FACILITIES.map(facility => (
            <FacilityCard
              key={facility.id}
              facility={facility}
              onClick={() => setSelectedFacility(facility)}
            />
          ))}
        </div>
      </div>

      {/* 功能详情弹窗 */}
      {selectedFacility && (
        <FacilityDetailModal
          facility={selectedFacility}
          onClose={() => setSelectedFacility(null)}
        />
      )}
    </div>
  );
}

// 顶部标题栏
function BaseHeader({ onBack }: { onBack: () => void }) {
  return (
    <div style={{
      flexShrink: 0,
      background: 'linear-gradient(180deg, rgba(26, 31, 58, 0.98) 0%, rgba(10, 14, 39, 0.95) 100%)',
      borderBottom: '1px solid rgba(0, 212, 255, 0.3)',
      padding: '12px 16px',
      boxShadow: '0 2px 20px rgba(0, 212, 255, 0.15)',
      position: 'relative',
    }}>
      {/* 顶部发光条 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, transparent 0%, #00d4ff 50%, transparent 100%)',
      }} />

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0, 212, 255, 0.1)',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            borderRadius: '8px',
            padding: '8px 12px',
            color: '#00d4ff',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          <span>←</span>
          <span>返回舰桥</span>
        </button>

        <h1 style={{
          color: '#ffffff',
          fontSize: '18px',
          fontWeight: 'bold',
          textShadow: '0 0 10px rgba(0, 212, 255, 0.5)',
        }}>
          ⚡ 基地
        </h1>

        <div style={{ width: '80px' }} />
      </div>
    </div>
  );
}

// 基地概览
function BaseOverview() {
  const { gameManager } = useGameStore();
  
  // TODO: 从 gameManager 获取真实数据
  const activeFacilities = FACILITIES.filter(f => f.status === 'active').length;
  const totalFacilities = FACILITIES.length;
  const baseLevel = 1;

  return (
    <div style={{
      flexShrink: 0,
      background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.15) 0%, rgba(0, 153, 204, 0.1) 100%)',
      borderBottom: '1px solid rgba(0, 212, 255, 0.2)',
      padding: '16px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}>
        <OverviewItem label="基地等级" value={`Lv.${baseLevel}`} color="#00d4ff" />
        <OverviewItem label="设施数量" value={`${activeFacilities}/${totalFacilities}`} color="#10b981" />
        <OverviewItem label="能源产出" value="+100%/h" color="#f59e0b" />
      </div>
    </div>
  );
}

function OverviewItem({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        color: color,
        fontSize: '20px',
        fontWeight: 'bold',
        textShadow: `0 0 10px ${color}50`,
      }}>
        {value}
      </div>
      <div style={{
        color: '#a1a1aa',
        fontSize: '11px',
        marginTop: '2px',
      }}>
        {label}
      </div>
    </div>
  );
}

// 设施卡片
function FacilityCard({ facility, onClick }: { facility: BaseFacility; onClick: () => void }) {
  const isLocked = facility.status === 'locked';
  const isBuilding = facility.status === 'building';

  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px 8px',
        background: isLocked 
          ? 'rgba(107, 114, 128, 0.1)' 
          : `linear-gradient(135deg, ${facility.color}20 0%, ${facility.color}05 100%)`,
        border: `1px solid ${isLocked ? 'rgba(107, 114, 128, 0.3)' : facility.color + '50'}`,
        borderRadius: '12px',
        cursor: isLocked ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        opacity: isLocked ? 0.6 : 1,
        position: 'relative',
        minHeight: '100px',
      }}
    >
      {/* 状态图标 */}
      {isLocked && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          fontSize: '14px',
        }}>
          🔒
        </div>
      )}
      {isBuilding && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          fontSize: '14px',
        }}>
          🏗️
        </div>
      )}

      {/* 图标 */}
      <div style={{
        fontSize: '32px',
        marginBottom: '8px',
        filter: isLocked ? 'grayscale(100%)' : 'none',
      }}>
        {facility.icon}
      </div>

      {/* 名称 */}
      <div style={{
        color: isLocked ? '#6b7280' : facility.color,
        fontSize: '13px',
        fontWeight: 'bold',
        textAlign: 'center',
      }}>
        {facility.name}
      </div>

      {/* 等级 */}
      {facility.level && facility.maxLevel && !isLocked && (
        <div style={{
          color: '#a1a1aa',
          fontSize: '10px',
          marginTop: '4px',
        }}>
          Lv.{facility.level}/{facility.maxLevel}
        </div>
      )}

      {/* 描述 */}
      <div style={{
        color: '#71717a',
        fontSize: '10px',
        textAlign: 'center',
        marginTop: '4px',
        lineHeight: '1.2',
      }}>
        {facility.description}
      </div>
    </button>
  );
}

// 设施详情弹窗
function FacilityDetailModal({ facility, onClose }: { facility: BaseFacility; onClose: () => void }) {
  const { gameManager } = useGameStore();

  const renderFacilityContent = () => {
    switch (facility.id) {
      case 'crew':
        return <CrewContent />;
      case 'energy':
        return <EnergyContent />;
      case 'warehouse':
        return <WarehouseContent />;
      case 'medical':
        return <MedicalContent />;
      case 'comm':
        return <CommContent />;
      case 'research':
        return <ResearchContent />;
      default:
        return <LockedContent facility={facility} />;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.98) 0%, rgba(10, 14, 39, 0.98) 100%)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '400px',
        maxHeight: '80vh',
        overflowY: 'auto',
        border: `2px solid ${facility.color}`,
        boxShadow: `0 0 30px ${facility.color}40`,
      }}>
        {/* 头部 */}
        <div style={{
          background: `${facility.color}20`,
          padding: '16px',
          borderBottom: `1px solid ${facility.color}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '28px' }}>{facility.icon}</span>
            <div>
              <h2 style={{
                color: facility.color,
                fontSize: '18px',
                fontWeight: 'bold',
                margin: 0,
              }}>
                {facility.name}
              </h2>
              {facility.level && (
                <span style={{ color: '#a1a1aa', fontSize: '12px' }}>
                  等级 {facility.level}/{facility.maxLevel}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#a1a1aa',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            ×
          </button>
        </div>

        {/* 内容 */}
        <div style={{ padding: '16px' }}>
          {renderFacilityContent()}
        </div>
      </div>
    </div>
  );
}

// ==================== 各设施内容组件 ====================

// 1. 船员舱内容
function CrewContent() {
  const crewMembers = [
    { id: 'crew_001', name: '艾莉娅', role: '工程师', level: 1, bonus: '采集效率+5%', icon: '👩‍🔧' },
    { id: 'crew_002', name: '凯尔', role: '战斗员', level: 1, bonus: '战斗经验+5%', icon: '👨‍✈️' },
  ];

  return (
    <div>
      <p style={{ color: '#a1a1aa', fontSize: '14px', marginBottom: '16px' }}>
        当前船员: {crewMembers.length}/5
      </p>

      {crewMembers.map(crew => (
        <div key={crew.id} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px',
          background: 'rgba(0, 212, 255, 0.1)',
          borderRadius: '8px',
          marginBottom: '8px',
        }}>
          <div style={{ fontSize: '28px' }}>{crew.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#ffffff', fontWeight: 'bold' }}>{crew.name}</div>
            <div style={{ color: '#00d4ff', fontSize: '12px' }}>{crew.role} Lv.{crew.level}</div>
            <div style={{ color: '#f59e0b', fontSize: '11px' }}>{crew.bonus}</div>
          </div>
        </div>
      ))}

      <button style={{
        width: '100%',
        padding: '12px',
        background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
        border: 'none',
        borderRadius: '8px',
        color: 'white',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '8px',
      }}>
        ➕ 招募新船员 (500信用点)
      </button>
    </div>
  );
}

// 2. 能源核心内容
function EnergyContent() {
  const level = 1;
  const efficiency = 100 + (level - 1) * 10;

  return (
    <div>
      <div style={{
        background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.05) 100%)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>⚡</div>
        <div style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '20px' }}>
          能源核心 Lv.{level}
        </div>
        <div style={{ color: '#a1a1aa', fontSize: '14px', marginTop: '8px' }}>
          自动采集效率 +{efficiency - 100}%
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ color: '#a1a1aa', fontSize: '12px' }}>升级进度</span>
          <span style={{ color: '#f59e0b', fontSize: '12px' }}>{level}/10</span>
        </div>
        <div style={{
          height: '8px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '4px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${(level / 10) * 100}%`,
            background: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)',
            borderRadius: '4px',
          }} />
        </div>
      </div>

      <button style={{
        width: '100%',
        padding: '12px',
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        border: 'none',
        borderRadius: '8px',
        color: 'white',
        fontWeight: 'bold',
        cursor: 'pointer',
      }}>
        ⬆️ 升级 (1000信用点 + 10星铁)
      </button>
    </div>
  );
}

// 3. 星际仓库内容
function WarehouseContent() {
  const current = 50;
  const max = 100;

  return (
    <div>
      <div style={{
        background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.05) 100%)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>📦</div>
        <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '20px' }}>
          存储容量
        </div>
        <div style={{ color: '#a1a1aa', fontSize: '14px', marginTop: '8px' }}>
          {current}/{max} 格
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ color: '#a1a1aa', fontSize: '12px' }}>已使用</span>
          <span style={{ color: '#10b981', fontSize: '12px' }}>{Math.round((current/max)*100)}%</span>
        </div>
        <div style={{
          height: '8px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '4px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${(current / max) * 100}%`,
            background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
            borderRadius: '4px',
          }} />
        </div>
      </div>

      <button style={{
        width: '100%',
        padding: '12px',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        border: 'none',
        borderRadius: '8px',
        color: 'white',
        fontWeight: 'bold',
        cursor: 'pointer',
      }}>
        ⬆️ 扩展仓库 (+20格, 500信用点)
      </button>
    </div>
  );
}

// 4. 医疗舱内容
function MedicalContent() {
  const level = 1;
  const efficiency = 100 + (level - 1) * 20;

  return (
    <div>
      <div style={{
        background: 'linear-gradient(180deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.05) 100%)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>🏥</div>
        <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '20px' }}>
          医疗舱 Lv.{level}
        </div>
        <div style={{ color: '#a1a1aa', fontSize: '14px', marginTop: '8px' }}>
          休整恢复效率 +{efficiency - 100}%
        </div>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '16px',
      }}>
        <div style={{ color: '#a1a1aa', fontSize: '12px', marginBottom: '8px' }}>当前效果:</div>
        <div style={{ color: '#ffffff', fontSize: '13px', lineHeight: '1.6' }}>
          • 每次休整恢复 +{efficiency}% 生命值<br />
          • 每次休整恢复 +{efficiency}% 体力值
        </div>
      </div>

      <button style={{
        width: '100%',
        padding: '12px',
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        border: 'none',
        borderRadius: '8px',
        color: 'white',
        fontWeight: 'bold',
        cursor: 'pointer',
      }}>
        ⬆️ 升级 (800信用点 + 5纳米纤维)
      </button>
    </div>
  );
}

// 5. 通讯阵列内容
function CommContent() {
  const events = [
    { id: '1', title: '星际商队', desc: '发现路过的商队', reward: '可交易稀有材料', time: '2小时' },
    { id: '2', title: '求救信号', desc: '收到求救信号', reward: '救援奖励未知', time: '30分钟' },
  ];

  return (
    <div>
      <p style={{ color: '#a1a1aa', fontSize: '14px', marginBottom: '16px' }}>
        正在监听星际通讯... 发现 {events.length} 个事件
      </p>

      {events.map(event => (
        <div key={event.id} style={{
          padding: '12px',
          background: 'rgba(139, 92, 246, 0.1)',
          borderRadius: '8px',
          marginBottom: '8px',
          border: '1px solid rgba(139, 92, 246, 0.3)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>{event.title}</span>
            <span style={{ color: '#f59e0b', fontSize: '11px' }}>⏱️ {event.time}</span>
          </div>
          <div style={{ color: '#a1a1aa', fontSize: '12px' }}>{event.desc}</div>
          <div style={{ color: '#10b981', fontSize: '11px', marginTop: '4px' }}>🎁 {event.reward}</div>
        </div>
      ))}

      <button style={{
        width: '100%',
        padding: '12px',
        background: 'rgba(139, 92, 246, 0.2)',
        border: '1px solid rgba(139, 92, 246, 0.5)',
        borderRadius: '8px',
        color: '#8b5cf6',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '8px',
      }}>
        🔄 扫描新信号
      </button>
    </div>
  );
}

// 6. 科研实验室内容
function ResearchContent() {
  const projects = [
    { id: '1', name: '高级采集技术', desc: '提升自动采集效率10%', progress: 50, total: 100, status: 'researching' },
    { id: '2', name: '战甲强化理论', desc: '解锁强化+6以上', progress: 0, total: 200, status: 'locked' },
  ];

  return (
    <div>
      <p style={{ color: '#a1a1aa', fontSize: '14px', marginBottom: '16px' }}>
        进行科技研究以解锁新功能
      </p>

      {projects.map(project => (
        <div key={project.id} style={{
          padding: '12px',
          background: project.status === 'researching' ? 'rgba(192, 132, 252, 0.1)' : 'rgba(255,255,255,0.05)',
          borderRadius: '8px',
          marginBottom: '8px',
          border: `1px solid ${project.status === 'researching' ? 'rgba(192, 132, 252, 0.3)' : 'rgba(255,255,255,0.1)'}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ color: '#c084fc', fontWeight: 'bold' }}>{project.name}</span>
            <span style={{ color: project.status === 'researching' ? '#10b981' : '#71717a', fontSize: '11px' }}>
              {project.status === 'researching' ? '🔬 研究中' : '🔒 未解锁'}
            </span>
          </div>
          <div style={{ color: '#a1a1aa', fontSize: '12px', marginBottom: '8px' }}>{project.desc}</div>
          
          {project.status === 'researching' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#a1a1aa', fontSize: '11px' }}>研究进度</span>
                <span style={{ color: '#c084fc', fontSize: '11px' }}>{project.progress}/{project.total}</span>
              </div>
              <div style={{
                height: '6px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '3px',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${(project.progress / project.total) * 100}%`,
                  background: 'linear-gradient(90deg, #c084fc 0%, #a855f7 100%)',
                  borderRadius: '3px',
                }} />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// 锁定功能内容
function LockedContent({ facility }: { facility: BaseFacility }) {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>{facility.icon}</div>
      <h3 style={{ color: '#6b7280', marginBottom: '8px' }}>{facility.name}</h3>
      <p style={{ color: '#71717a', fontSize: '14px', marginBottom: '16px' }}>
        {facility.description}
      </p>
      <div style={{
        background: 'rgba(107, 114, 128, 0.2)',
        borderRadius: '8px',
        padding: '12px',
        color: '#a1a1aa',
        fontSize: '12px',
      }}>
        🔒 该功能将在后续版本开放
      </div>
    </div>
  );
}
