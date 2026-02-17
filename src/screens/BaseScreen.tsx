import { useState, useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import type { GameManager } from '../core/GameManager';
import 基地背景 from '../assets/images/基地背景.jpg';
import { FacilityType } from '../core/BaseFacilitySystem';
import { CommEvent, COMM_EVENT_CONFIG, getRemainingTime, formatRemainingTime, getMaxEvents, getRareEventChance } from '../core/CommSystem';
import { getItemTemplate } from '../data/items';
import { ResearchStatus } from '../core/ResearchSystem';
import { MINERAL_CONFIG, getMiningProgress, getRemainingTime as getMiningRemainingTime, formatMiningTime, getDepthBonusDescription, getCrewMiningBonus, getMiningEfficiencyBonus, getMiningSpeedBonus, getMiningDepthBonus, getMaxMiningSlots } from '../core/MiningSystem';
import { Chip, ChipSlot, ChipRarity, CHIP_RARITY_CONFIG, CHIP_MAIN_STAT_CONFIG, CHIP_SUB_STAT_CONFIG, CHIP_SET_CONFIG, CHIP_CRAFT_COST, getRerollCost, getUpgradeCost } from '../core/ChipSystem';
import { GeneType, GENE_TYPE_CONFIG, GENE_RARITY_CONFIG } from '../core/GeneSystem';
import { Implant, ImplantType, ImplantRarity, IMPLANT_TYPE_CONFIG, IMPLANT_RARITY_CONFIG, getImplantStats, getImplantUpgradeCost } from '../core/CyberneticSystem';
import { MARKET_ITEM_TYPE_CONFIG, MARKET_RARITY_CONFIG } from '../core/MarketSystem';
import { Ruin, RuinType, ExploreStatus, RUIN_TYPE_CONFIG, RUIN_DIFFICULTY_CONFIG, getRemainingExploreTime, formatExploreTime, calculateExploreSuccess } from '../core/RuinSystem';
import CrewScreen from './CrewScreen';

interface BaseScreenProps {
  onBack: () => void;
}

// 材料基础名称映射
const MATERIAL_BASE_NAMES: Record<string, string> = {
  'mat_001': '星铁基础构件',
  'mat_002': '星铜传导组件',
  'mat_003': '钛钢外甲坯料',
  'mat_004': '战甲能量晶核',
  'mat_005': '稀土传感基质',
  'mat_006': '虚空防护核心',
  'mat_007': '推进模块燃料',
  'mat_008': '纳米韧化纤维',
  'mat_009': '陨铁缓冲衬垫',
  'mat_010': '量子紧固组件',
  // 芯片材料
  'mineral_iron': '铁矿石',
  'mineral_copper': '铜矿石',
  'mineral_titanium': '钛矿石',
  'mineral_crystal': '水晶矿石',
  'mineral_quantum': '量子矿石',
  'chip_material': '芯片材料',
  'gene_material': '基因材料',
  'cyber_material': '义体材料',
  'cyber_core': '赛博核心',
};

// 品质后缀到名称的映射
const QUALITY_SUFFIX_NAMES: Record<string, string> = {
  '_stardust': '星尘级',
  '_alloy': '合金级',
  '_crystal': '晶核级',
  '_quantum': '量子级',
  '_void': '虚空级',
};

// 获取材料完整名称
function getMaterialFullName(itemId: string): string {
  // 先检查是否在材料映射表中（矿石材料等）
  if (MATERIAL_BASE_NAMES[itemId]) {
    return MATERIAL_BASE_NAMES[itemId];
  }

  // 解析品质后缀（只针对mat_xxx格式的材料）
  const qualityOrder = ['_void', '_quantum', '_crystal', '_alloy', '_stardust'] as const;
  let baseId = itemId;
  let quality = '';

  // 只处理mat_开头的材料ID
  if (itemId.startsWith('mat_')) {
    for (const suffix of qualityOrder) {
      if (itemId.endsWith(suffix)) {
        // 使用正则表达式替换后缀，确保正确移除
        baseId = itemId.replace(new RegExp(suffix + '$'), '');
        quality = suffix;
        break;
      }
    }
  }

  const baseName = MATERIAL_BASE_NAMES[baseId] || baseId;

  if (quality) {
    const qualityName = QUALITY_SUFFIX_NAMES[quality] || '';
    return qualityName ? `${baseName}(${qualityName})` : baseName;
  }

  return baseName;
}

function getItemName(itemId: string): string {
  const template = getItemTemplate(itemId);
  if (template) {
    return template.name;
  }
  return getMaterialFullName(itemId);
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
  { id: 'crew', name: '船员舱', icon: '👥', description: '招募与管理船员', color: '#00d4ff', status: 'active' },
  { id: 'energy', name: '能源核心', icon: '⚡', description: '升级星舰能源系统', color: '#f59e0b', level: 1, maxLevel: 10, status: 'active' },
  { id: 'warehouse', name: '星际仓库', icon: '📦', description: '扩展存储容量', color: '#10b981', level: 1, maxLevel: 10, status: 'active' },
  { id: 'medical', name: '医疗舱', icon: '🏥', description: '提升恢复效率', color: '#ef4444', level: 1, maxLevel: 5, status: 'active' },
  { id: 'comm', name: '通讯阵列', icon: '📡', description: '接收特殊事件', color: '#8b5cf6', level: 1, maxLevel: 3, status: 'active' },
  { id: 'research', name: '科研实验室', icon: '🔬', description: '解锁新配方', color: '#c084fc', status: 'active' },
  // 扩展功能
  { id: 'mining', name: '采矿平台', icon: '⛏️', description: '自动采集矿物资源', color: '#f59e0b', level: 1, maxLevel: 5, status: 'active' },
  { id: 'chip', name: '芯片研发', icon: '💾', description: '研发战斗芯片', color: '#00d4ff', level: 1, maxLevel: 3, status: 'active' },
  { id: 'alliance', name: '基因工程', icon: '🧬', description: '基因改造与强化', color: '#22c55e', level: 1, maxLevel: 5, status: 'active' },
  { id: 'arena', name: '机械飞升', icon: '🦾', description: '机械义体改造', color: '#a855f7', level: 1, maxLevel: 3, status: 'active' },
  { id: 'market', name: '星际市场', icon: '🏪', description: '玩家间交易', color: '#ec4899', status: 'active' },
  { id: 'relic', name: '遗迹探索', icon: '🏛️', description: '探索古代遗迹', color: '#f97316', status: 'active' },
];

export default function BaseScreen({ onBack }: BaseScreenProps) {
  const [selectedFacility, setSelectedFacility] = useState<BaseFacility | null>(null);
  const [showCrewScreen, setShowCrewScreen] = useState(false);

  const handleFacilityClick = (facility: BaseFacility) => {
    if (facility.id === 'crew') {
      setShowCrewScreen(true);
    } else {
      setSelectedFacility(facility);
    }
  };

  if (showCrewScreen) {
    return <CrewScreen onBack={() => setShowCrewScreen(false)} />;
  }

  return (
    <div style={{
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* 背景 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${基地背景})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 0,
      }} />

      {/* 扫描线效果 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, transparent 0%, rgba(0, 212, 255, 0.03) 50%, transparent 100%)',
        backgroundSize: '100% 4px',
        animation: 'scanline 8s linear infinite',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* 顶部标题栏 - 玻璃拟态 */}
      <BaseHeader onBack={onBack} />

      {/* 基地概览 - 玻璃拟态 */}
      <BaseOverview />

      {/* 功能网格 */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        position: 'relative',
        zIndex: 10,
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
              onClick={() => handleFacilityClick(facility)}
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

      {/* CSS 动画 */}
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
}

// 顶部标题栏 - 科幻风格
function BaseHeader({ onBack }: { onBack: () => void }) {
  return (
    <div style={{
      flexShrink: 0,
      position: 'relative',
      zIndex: 10,
      background: 'rgba(0, 20, 40, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(0, 212, 255, 0.3)',
      padding: '12px 16px',
      boxShadow: '0 0 20px rgba(0, 212, 255, 0.1)',
    }}>
      {/* 顶部发光条 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, transparent 0%, #00d4ff 50%, transparent 100%)',
        boxShadow: '0 0 10px #00d4ff',
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
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0, 212, 255, 0.2)';
            e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 212, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0, 212, 255, 0.1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <span>◀</span>
          <span>返回舰桥</span>
        </button>

        <h1 style={{
          color: '#00d4ff',
          fontSize: '18px',
          fontWeight: 'bold',
          textShadow: '0 0 10px rgba(0, 212, 255, 0.5)',
        }}>
          ⚡ 星际基地
        </h1>

        <div style={{ width: '90px' }} />
      </div>
    </div>
  );
}

// 基地概览 - 科幻风格
function BaseOverview() {
  return null;
}



// 设施卡片 - 科幻风格
function FacilityCard({ facility, onClick }: { facility: BaseFacility; onClick: () => void }) {
  const { getFacilityLevel, gameManager } = useGameStore();
  const isLocked = facility.status === 'locked';
  const isBuilding = facility.status === 'building';

  // 获取设施等级（根据设施类型使用不同的方法）
  const getActualLevel = (): number => {
    switch (facility.id) {
      case 'mining':
        return gameManager.getMiningLevel();
      case 'chip':
        return gameManager.getChipLevel();
      case 'alliance':
        return gameManager.getGeneLevel();
      case 'arena':
        return gameManager.getCyberneticLevel();
      case 'crew':
      case 'research':
        return 1; // 这些设施没有等级
      default: {
        const facilityTypeMap: Record<string, FacilityType> = {
          'energy': FacilityType.ENERGY,
          'warehouse': FacilityType.WAREHOUSE,
          'medical': FacilityType.MEDICAL,
          'comm': FacilityType.COMM,
          'market': FacilityType.MARKET,
          'relic': FacilityType.RELIC,
        };
        return facilityTypeMap[facility.id]
          ? getFacilityLevel(facilityTypeMap[facility.id])
          : (facility.level || 1);
      }
    }
  };

  const actualLevel = getActualLevel();
  const maxLevel = facility.maxLevel || 10;

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
          ? 'linear-gradient(135deg, rgba(30, 30, 40, 0.9) 0%, rgba(20, 20, 30, 0.95) 100%)'
          : 'rgba(0, 20, 40, 0.7)',
        border: `2px solid ${isLocked ? 'rgba(100, 100, 110, 0.5)' : facility.color + '60'}`,
        borderRadius: '12px',
        cursor: isLocked ? 'not-allowed' : 'pointer',
        opacity: isLocked ? 0.75 : 1,
        position: 'relative',
        minHeight: '100px',
        boxShadow: isLocked ? 'inset 0 0 20px rgba(0, 0, 0, 0.5)' : `0 0 15px ${facility.color}20`,
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        if (!isLocked) {
          e.currentTarget.style.boxShadow = `0 0 25px ${facility.color}40`;
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = isLocked ? 'inset 0 0 20px rgba(0, 0, 0, 0.5)' : `0 0 15px ${facility.color}20`;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* 未解锁遮罩层 */}
      {isLocked && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(100, 100, 100, 0.05) 8px, rgba(100, 100, 100, 0.05) 16px)',
          borderRadius: '10px',
          pointerEvents: 'none',
        }} />
      )}

      {/* 状态图标 */}
      {isLocked && (
        <div style={{
          position: 'absolute',
          top: '6px',
          right: '6px',
          fontSize: '16px',
          filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.8))',
          zIndex: 2,
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

      {/* 未解锁标签 */}
      {isLocked && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.7)',
          border: '1px solid rgba(150, 150, 150, 0.4)',
          borderRadius: '4px',
          padding: '2px 8px',
          fontSize: '10px',
          color: '#888',
          fontWeight: 'bold',
          letterSpacing: '1px',
          zIndex: 2,
        }}>
          未解锁
        </div>
      )}

      {/* 图标 */}
      <div style={{
        fontSize: '32px',
        marginBottom: '8px',
        filter: isLocked ? 'grayscale(100%) brightness(0.5)' : 'none',
        textShadow: isLocked ? 'none' : `0 0 10px ${facility.color}50`,
        opacity: isLocked ? 0.4 : 1,
      }}>
        {facility.icon}
      </div>

      {/* 名称 */}
      <div style={{
        color: isLocked ? '#555' : facility.color,
        fontSize: '13px',
        fontWeight: 'bold',
        textAlign: 'center',
        textShadow: isLocked ? 'none' : `0 0 5px ${facility.color}30`,
      }}>
        {facility.name}
      </div>

      {/* 等级 */}
      {!isLocked && facility.level !== undefined && (
        <div style={{
          color: '#a1a1aa',
          fontSize: '10px',
          marginTop: '4px',
          background: 'rgba(0, 0, 0, 0.4)',
          padding: '2px 6px',
          borderRadius: '4px',
        }}>
          Lv.{actualLevel}/{maxLevel}
        </div>
      )}

      {/* 描述 */}
      <div style={{
        color: isLocked ? '#444' : '#71717a',
        fontSize: '9px',
        textAlign: 'center',
        marginTop: '4px',
        lineHeight: '1.2',
      }}>
        {facility.description}
      </div>
    </button>
  );
}

// 设施详情弹窗 - 科幻风格
function FacilityDetailModal({ facility, onClose }: { facility: BaseFacility; onClose: () => void }) {
  const { gameManager } = useGameStore();

  // 获取设施实际等级
  const getActualLevel = (): number => {
    switch (facility.id) {
      case 'mining':
        return gameManager.getMiningLevel();
      case 'chip':
        return gameManager.getChipLevel();
      case 'alliance':
        return gameManager.getGeneLevel();
      case 'arena':
        return gameManager.getCyberneticLevel();
      case 'crew':
      case 'research':
        return 1;
      default:
        return facility.level || 1;
    }
  };

  const actualLevel = getActualLevel();
  const maxLevel = facility.maxLevel || 10;

  const renderFacilityContent = () => {
    switch (facility.id) {
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
      case 'mining':
        return <MiningContent />;
      case 'chip':
        return <ChipContent />;
      case 'alliance':
        return <GeneContent />;
      case 'arena':
        return <CyberneticContent />;
      case 'market':
        return <MarketContent />;
      case 'relic':
        return <RuinsContent />;
      default:
        return <LockedContent facility={facility} />;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(4px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
    }}>
      <div style={{
        background: 'rgba(0, 20, 40, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '400px',
        maxHeight: '80vh',
        overflowY: 'auto',
        border: `2px solid ${facility.color}`,
        boxShadow: `0 0 40px ${facility.color}40, inset 0 0 40px ${facility.color}10`,
      }}>
        {/* 头部 */}
        <div style={{
          background: `linear-gradient(180deg, ${facility.color}30, ${facility.color}10)`,
          padding: '16px',
          borderBottom: `1px solid ${facility.color}50`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              fontSize: '28px',
              textShadow: `0 0 10px ${facility.color}`,
            }}>{facility.icon}</span>
            <div>
              <h2 style={{
                color: facility.color,
                fontSize: '18px',
                fontWeight: 'bold',
                margin: 0,
                textShadow: `0 0 10px ${facility.color}50`,
              }}>
                {facility.name}
              </h2>
              {facility.maxLevel !== undefined && (
                <span style={{ color: '#a1a1aa', fontSize: '12px' }}>
                  等级 {actualLevel}/{maxLevel}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#a1a1aa',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '4px 10px',
            }}
          >
            ✕
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

// 1. 能源核心内容
function EnergyContent() {
  const { upgradeFacility, getFacilityLevel, getEnergyCoreEfficiency, getFacilityUpgradePreview, getFacilityDefinition } = useGameStore();
  const [upgradeResult, setUpgradeResult] = useState<{ success: boolean; message: string } | null>(null);

  const level = getFacilityLevel(FacilityType.ENERGY);
  const efficiency = getEnergyCoreEfficiency();
  const preview = getFacilityUpgradePreview(FacilityType.ENERGY);
  const def = getFacilityDefinition(FacilityType.ENERGY);

  const handleUpgrade = () => {
    const result = upgradeFacility(FacilityType.ENERGY);
    setUpgradeResult(result);
    if (result.success) {
      setTimeout(() => setUpgradeResult(null), 2000);
    }
  };

  const formatCost = (cost: { credits: number; materials: { itemId: string; count: number }[] }) => {
    const parts: string[] = [];
    if (cost.credits > 0) {
      parts.push(`${cost.credits}信用点`);
    }
    cost.materials.forEach(mat => {
      const materialName = getItemName(mat.itemId);
      parts.push(`${materialName} x${mat.count}`);
    });
    return parts.join(' + ');
  };

  return (
    <div>
      <div style={{
        background: 'rgba(0, 0, 0, 0.4)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px',
        textAlign: 'center',
        border: '1px solid rgba(245, 158, 11, 0.3)',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '8px', textShadow: '0 0 20px rgba(245, 158, 11, 0.5)' }}>⚡</div>
        <div style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '20px', textShadow: '0 0 10px rgba(245, 158, 11, 0.3)' }}>
          能源核心 Lv.{level}
        </div>
        <div style={{ color: '#a1a1aa', fontSize: '14px', marginTop: '8px' }}>
          自动采集效率 +{efficiency}%
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ color: '#a1a1aa', fontSize: '12px' }}>升级进度</span>
          <span style={{ color: '#f59e0b', fontSize: '12px' }}>{level}/{def?.maxLevel || 10}</span>
        </div>
        <div style={{
          height: '8px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '4px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${(level / (def?.maxLevel || 10)) * 100}%`,
            background: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)',
            borderRadius: '4px',
            boxShadow: '0 0 10px #f59e0b',
          }} />
        </div>
      </div>

      {preview.nextLevel && preview.cost && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '12px',
          border: '1px solid rgba(245, 158, 11, 0.2)',
        }}>
          <div style={{ color: '#f59e0b', fontSize: '12px', marginBottom: '4px' }}>
            下一级效果: {preview.effect?.description} +{preview.effect?.value}%
          </div>
          <div style={{ color: '#a1a1aa', fontSize: '11px' }}>
            升级消耗: {formatCost(preview.cost)}
          </div>
        </div>
      )}

      {upgradeResult && (
        <div style={{
          padding: '8px 12px',
          borderRadius: '8px',
          marginBottom: '12px',
          textAlign: 'center',
          background: upgradeResult.success ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          border: `1px solid ${upgradeResult.success ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`,
          color: upgradeResult.success ? '#22c55e' : '#ef4444',
          fontSize: '13px',
        }}>
          {upgradeResult.message}
        </div>
      )}

      <button
        onClick={handleUpgrade}
        disabled={!preview.canUpgrade}
        style={{
          width: '100%',
          padding: '12px',
          background: preview.canUpgrade
            ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(245, 158, 11, 0.1))'
            : 'rgba(100, 100, 100, 0.3)',
          border: preview.canUpgrade ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(100, 100, 100, 0.5)',
          borderRadius: '8px',
          color: preview.canUpgrade ? '#f59e0b' : '#666',
          fontWeight: 'bold',
          cursor: preview.canUpgrade ? 'pointer' : 'not-allowed',
          boxShadow: preview.canUpgrade ? '0 0 15px rgba(245, 158, 11, 0.2)' : 'none',
        }}
      >
        {preview.canUpgrade
          ? `⬆️ 升级 (${preview.cost ? formatCost(preview.cost) : ''})`
          : preview.reason || '已达最高等级'}
      </button>
    </div>
  );
}

// 3. 星际仓库内容
function WarehouseContent() {
  const { upgradeFacility, getFacilityLevel, getWarehouseCapacity, getFacilityUpgradePreview, gameManager } = useGameStore();
  const [upgradeResult, setUpgradeResult] = useState<{ success: boolean; message: string } | null>(null);

  const level = getFacilityLevel(FacilityType.WAREHOUSE);
  const maxCapacity = getWarehouseCapacity();
  const usedSlots = gameManager.inventory.getUsedSlots();
  const preview = getFacilityUpgradePreview(FacilityType.WAREHOUSE);

  const handleUpgrade = () => {
    const result = upgradeFacility(FacilityType.WAREHOUSE);
    setUpgradeResult(result);
    if (result.success) {
      setTimeout(() => setUpgradeResult(null), 2000);
    }
  };

  const formatCost = (cost: { credits: number; materials: { itemId: string; count: number }[] }) => {
    const parts: string[] = [];
    if (cost.credits > 0) {
      parts.push(`${cost.credits}信用点`);
    }
    cost.materials.forEach(mat => {
      const materialName = getItemName(mat.itemId);
      parts.push(`${materialName} x${mat.count}`);
    });
    return parts.join(' + ');
  };

  const usagePercent = Math.round((usedSlots / maxCapacity) * 100);

  return (
    <div>
      <div style={{
        background: 'rgba(0, 0, 0, 0.4)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px',
        textAlign: 'center',
        border: '1px solid rgba(16, 185, 129, 0.3)',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '8px', textShadow: '0 0 20px rgba(16, 185, 129, 0.5)' }}>📦</div>
        <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '20px', textShadow: '0 0 10px rgba(16, 185, 129, 0.3)' }}>
          星际仓库 Lv.{level}
        </div>
        <div style={{ color: '#a1a1aa', fontSize: '14px', marginTop: '8px' }}>
          存储容量: {usedSlots}/{maxCapacity} 格
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ color: '#a1a1aa', fontSize: '12px' }}>已使用</span>
          <span style={{ color: usagePercent > 80 ? '#ef4444' : '#10b981', fontSize: '12px' }}>{usagePercent}%</span>
        </div>
        <div style={{
          height: '8px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '4px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${usagePercent}%`,
            background: usagePercent > 80
              ? 'linear-gradient(90deg, #ef4444 0%, #f87171 100%)'
              : 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
            borderRadius: '4px',
            boxShadow: usagePercent > 80 ? '0 0 10px #ef4444' : '0 0 10px #10b981',
          }} />
        </div>
      </div>

      {preview.nextLevel && preview.cost && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '12px',
          border: '1px solid rgba(16, 185, 129, 0.2)',
        }}>
          <div style={{ color: '#10b981', fontSize: '12px', marginBottom: '4px' }}>
            下一级容量: {preview.effect?.value} 格
          </div>
          <div style={{ color: '#a1a1aa', fontSize: '11px' }}>
            升级消耗: {formatCost(preview.cost)}
          </div>
        </div>
      )}

      {upgradeResult && (
        <div style={{
          padding: '8px 12px',
          borderRadius: '8px',
          marginBottom: '12px',
          textAlign: 'center',
          background: upgradeResult.success ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          border: `1px solid ${upgradeResult.success ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`,
          color: upgradeResult.success ? '#22c55e' : '#ef4444',
          fontSize: '13px',
        }}>
          {upgradeResult.message}
        </div>
      )}

      <button
        onClick={handleUpgrade}
        disabled={!preview.canUpgrade}
        style={{
          width: '100%',
          padding: '12px',
          background: preview.canUpgrade
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(16, 185, 129, 0.1))'
            : 'rgba(100, 100, 100, 0.3)',
          border: preview.canUpgrade ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(100, 100, 100, 0.5)',
          borderRadius: '8px',
          color: preview.canUpgrade ? '#10b981' : '#666',
          fontWeight: 'bold',
          cursor: preview.canUpgrade ? 'pointer' : 'not-allowed',
          boxShadow: preview.canUpgrade ? '0 0 15px rgba(16, 185, 129, 0.2)' : 'none',
        }}
      >
        {preview.canUpgrade
          ? `⬆️ 升级 (${preview.cost ? formatCost(preview.cost) : ''})`
          : preview.reason || '已达最高等级'}
      </button>
    </div>
  );
}

// 4. 医疗舱内容
function MedicalContent() {
  const { upgradeFacility, getFacilityLevel, getMedicalEfficiency, getFacilityUpgradePreview } = useGameStore();
  const [upgradeResult, setUpgradeResult] = useState<{ success: boolean; message: string } | null>(null);

  const level = getFacilityLevel(FacilityType.MEDICAL);
  const efficiency = getMedicalEfficiency();
  const preview = getFacilityUpgradePreview(FacilityType.MEDICAL);

  const handleUpgrade = () => {
    const result = upgradeFacility(FacilityType.MEDICAL);
    setUpgradeResult(result);
    if (result.success) {
      setTimeout(() => setUpgradeResult(null), 2000);
    }
  };

  const formatCost = (cost: { credits: number; materials: { itemId: string; count: number }[] }) => {
    const parts: string[] = [];
    if (cost.credits > 0) {
      parts.push(`${cost.credits}信用点`);
    }
    cost.materials.forEach(mat => {
      const materialName = getItemName(mat.itemId);
      parts.push(`${materialName} x${mat.count}`);
    });
    return parts.join(' + ');
  };

  return (
    <div>
      <div style={{
        background: 'rgba(0, 0, 0, 0.4)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px',
        textAlign: 'center',
        border: '1px solid rgba(239, 68, 68, 0.3)',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '8px', textShadow: '0 0 20px rgba(239, 68, 68, 0.5)' }}>🏥</div>
        <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '20px', textShadow: '0 0 10px rgba(239, 68, 68, 0.3)' }}>
          医疗舱 Lv.{level}
        </div>
        <div style={{ color: '#a1a1aa', fontSize: '14px', marginTop: '8px' }}>
          恢复效率加成 +{efficiency.bonusPercent}%
        </div>
      </div>

      <div style={{
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '12px',
        padding: '12px',
        marginBottom: '16px',
        border: '1px solid rgba(239, 68, 68, 0.2)',
      }}>
        <div style={{ color: '#a1a1aa', fontSize: '12px', marginBottom: '8px' }}>当前效果:</div>
        <div style={{ color: '#ffffff', fontSize: '13px', lineHeight: '1.8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span>❤️ 休整恢复生命:</span>
            <span style={{ color: '#ef4444' }}>
              {efficiency.hpRecoveryBase} → {efficiency.hpRecoveryActual} 点
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span>⚡ 休整恢复体力:</span>
            <span style={{ color: '#f59e0b' }}>
              {efficiency.staminaRecoveryBase} → {efficiency.staminaRecoveryActual} 点
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>🔄 体力自然恢复:</span>
            <span style={{ color: '#22c55e' }}>
              {efficiency.staminaRegenBase} → {efficiency.staminaRegenActual} 点/分钟
            </span>
          </div>
        </div>
      </div>

      {preview.nextLevel && preview.cost && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '12px',
          border: '1px solid rgba(239, 68, 68, 0.2)',
        }}>
          <div style={{ color: '#ef4444', fontSize: '12px', marginBottom: '4px' }}>
            下一级加成: +{preview.effect?.value}%
          </div>
          <div style={{ color: '#a1a1aa', fontSize: '11px' }}>
            升级消耗: {formatCost(preview.cost)}
          </div>
        </div>
      )}

      {upgradeResult && (
        <div style={{
          padding: '8px 12px',
          borderRadius: '8px',
          marginBottom: '12px',
          textAlign: 'center',
          background: upgradeResult.success ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          border: `1px solid ${upgradeResult.success ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`,
          color: upgradeResult.success ? '#22c55e' : '#ef4444',
          fontSize: '13px',
        }}>
          {upgradeResult.message}
        </div>
      )}

      <button
        onClick={handleUpgrade}
        disabled={!preview.canUpgrade}
        style={{
          width: '100%',
          padding: '12px',
          background: preview.canUpgrade
            ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.1))'
            : 'rgba(100, 100, 100, 0.3)',
          border: preview.canUpgrade ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(100, 100, 100, 0.5)',
          borderRadius: '8px',
          color: preview.canUpgrade ? '#ef4444' : '#666',
          fontWeight: 'bold',
          cursor: preview.canUpgrade ? 'pointer' : 'not-allowed',
          boxShadow: preview.canUpgrade ? '0 0 15px rgba(239, 68, 68, 0.2)' : 'none',
        }}
      >
        {preview.canUpgrade
          ? `⬆️ 升级 (${preview.cost ? formatCost(preview.cost) : ''})`
          : preview.reason || '已达最高等级'}
      </button>
    </div>
  );
}

// 5. 通讯阵列内容
function CommContent() {
  const { gameManager, saveGame, scanCommSignals, respondToCommEvent, ignoreCommEvent, getCommScanCooldown } = useGameStore();
  const [, setRefreshKey] = useState(0);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CommEvent | null>(null);

  const events = gameManager.getCommEvents();
  const level = gameManager.getFacilityLevel(FacilityType.COMM);
  const cooldown = getCommScanCooldown();

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleScan = async () => {
    const result = scanCommSignals();
    if (result.success) {
      showMessage(result.message, 'success');
      setRefreshKey(k => k + 1);
      await saveGame();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const handleRespond = async (eventId: string) => {
    const result = respondToCommEvent(eventId);
    if (result.success) {
      showMessage(`${result.message}${result.rewards ? `，获得: ${result.rewards}` : ''}`, 'success');
      setRefreshKey(k => k + 1);
      setSelectedEvent(null);
      await saveGame();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const handleIgnore = async (eventId: string) => {
    const result = ignoreCommEvent(eventId);
    if (result.success) {
      showMessage(result.message, 'success');
      setRefreshKey(k => k + 1);
      setSelectedEvent(null);
      await saveGame();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const formatCooldown = (ms: number): string => {
    const minutes = Math.ceil(ms / 60000);
    if (minutes > 0) {
      return `${minutes}分钟`;
    }
    return '可用';
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Message Toast */}
      {message && (
        <div style={{
          position: 'absolute',
          top: '-50px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '8px 16px',
          borderRadius: '8px',
          background: message.type === 'success' ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '12px',
          zIndex: 1000,
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        }}>
          {message.text}
        </div>
      )}

      {/* Stats */}
      <div style={{
        background: 'rgba(139, 92, 246, 0.1)',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '12px',
        border: '1px solid rgba(139, 92, 246, 0.2)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
          <div>
            <span style={{ color: '#a1a1aa' }}>信号容量: </span>
            <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>{events.length}/{getMaxEvents(level)}</span>
          </div>
          <div>
            <span style={{ color: '#a1a1aa' }}>设施等级: </span>
            <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>Lv.{level}</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
          <div>
            <span style={{ color: '#a1a1aa' }}>扫描冷却: </span>
            <span style={{ color: cooldown > 0 ? '#f59e0b' : '#10b981' }}>
              {formatCooldown(cooldown)}
            </span>
          </div>
          <div>
            <span style={{ color: '#a1a1aa' }}>稀有事件率: </span>
            <span style={{ color: '#10b981' }}>+{getRareEventChance(level)}%</span>
          </div>
        </div>
      </div>

      {/* Event List */}
      {events.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '30px 20px',
          color: '#666',
        }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📡</div>
          <div>暂无信号</div>
          <div style={{ fontSize: '12px', marginTop: '4px' }}>点击下方按钮扫描新信号</div>
        </div>
      ) : (
        <div style={{ marginBottom: '12px' }}>
          {events.map(event => {
            const eventConfig = COMM_EVENT_CONFIG[event.type];
            const remaining = getRemainingTime(event);
            const isSelected = selectedEvent?.id === event.id;

            return (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(isSelected ? null : event)}
                style={{
                  padding: '12px',
                  background: isSelected ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)',
                  borderRadius: '12px',
                  marginBottom: '8px',
                  border: `1px solid ${isSelected ? 'rgba(139, 92, 246, 0.6)' : 'rgba(139, 92, 246, 0.3)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>{eventConfig.icon}</span>
                    <span style={{ color: eventConfig.color, fontWeight: 'bold' }}>{event.title}</span>
                  </div>
                  <span style={{ color: remaining < 600000 ? '#ef4444' : '#f59e0b', fontSize: '11px' }}>
                    ⏱️ {formatRemainingTime(remaining)}
                  </span>
                </div>
                <div style={{ color: '#a1a1aa', fontSize: '12px', marginBottom: '4px' }}>{event.description}</div>

                {isSelected && (
                  <div style={{ marginTop: '12px' }}>
                    {/* Rewards Preview */}
                    <div style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '8px',
                      padding: '8px',
                      marginBottom: '8px',
                    }}>
                      <div style={{ color: '#10b981', fontSize: '11px', marginBottom: '4px' }}>🎁 奖励:</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '11px' }}>
                        {event.rewards.credits && (
                          <span style={{ color: '#fbbf24' }}>💰 {event.rewards.credits}信用点</span>
                        )}
                        {event.rewards.items?.map((item, i) => (
                          <span key={i} style={{ color: '#60a5fa' }}>{getItemName(item.itemId)} x{item.count}</span>
                        ))}
                        {event.rewards.exp && (
                          <span style={{ color: '#22c55e' }}>✨ {event.rewards.exp}经验</span>
                        )}
                      </div>
                      {event.requirements?.stamina && (
                        <div style={{ color: '#f59e0b', fontSize: '11px', marginTop: '4px' }}>
                          ⚡ 消耗: {event.requirements.stamina}体力
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRespond(event.id); }}
                        style={{
                          flex: 1,
                          padding: '10px',
                          background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#fff',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        响应
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleIgnore(event.id); }}
                        style={{
                          flex: 1,
                          padding: '10px',
                          background: 'rgba(100, 100, 100, 0.3)',
                          border: '1px solid rgba(100, 100, 100, 0.5)',
                          borderRadius: '8px',
                          color: '#a1a1aa',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        忽略
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Scan Button */}
      <button
        onClick={handleScan}
        disabled={cooldown > 0}
        style={{
          width: '100%',
          padding: '12px',
          background: cooldown > 0
            ? 'rgba(100, 100, 100, 0.3)'
            : 'linear-gradient(135deg, rgba(139, 92, 246, 0.5), rgba(139, 92, 246, 0.2))',
          border: cooldown > 0
            ? '1px solid rgba(100, 100, 100, 0.5)'
            : '1px solid rgba(139, 92, 246, 0.5)',
          borderRadius: '8px',
          color: cooldown > 0 ? '#666' : '#8b5cf6',
          fontWeight: 'bold',
          cursor: cooldown > 0 ? 'not-allowed' : 'pointer',
          boxShadow: cooldown > 0 ? 'none' : '0 0 15px rgba(139, 92, 246, 0.2)',
        }}
      >
        {cooldown > 0 ? `🔄 冷却中 (${formatCooldown(cooldown)})` : '🔄 扫描新信号'}
      </button>
    </div>
  );
}

// 6. 科研实验室内容 - 科技树样式
function ResearchContent() {
  const { gameManager, saveGame, startResearch, cancelResearch } = useGameStore();
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [, forceUpdate] = useState(0);

  // 每秒更新倒计时
  useEffect(() => {
    const timer = setInterval(() => {
      forceUpdate(n => n + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const projects = gameManager.getResearchProjects();
  const activeResearch = gameManager.getActiveResearch();

  // 计算剩余时间（秒）
  const getRemainingTime = (project: typeof projects[0]): number => {
    if (project.status !== ResearchStatus.IN_PROGRESS) return 0;
    const remaining = project.totalProgress - project.progress;
    return Math.max(0, Math.ceil(remaining));
  };

  // 格式化时间
  const formatTime = (seconds: number): string => {
    if (seconds <= 0) return '完成';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleStartResearch = async (projectId: string) => {
    const result = startResearch(projectId);
    if (result.success) {
      showMessage(result.message, 'success');
      setSelectedProject(null);
    } else {
      showMessage(result.message, 'error');
    }
  };

  const handleCancelResearch = async (projectId: string) => {
    const result = cancelResearch(projectId);
    if (result.success) {
      showMessage(result.message, 'success');
      await saveGame();
      setSelectedProject(null);
    } else {
      showMessage(result.message, 'error');
    }
  };

  const techTrees = [
    { name: '采矿平台', icon: '⛏️', color: '#f59e0b', prefix: 'mining_' },
    { name: '芯片研发', icon: '💾', color: '#10b981', prefix: 'chip_' },
    { name: '基因工程', icon: '🧬', color: '#ec4899', prefix: 'gene_' },
    { name: '机械飞升', icon: '🦾', color: '#f97316', prefix: 'cybernetic_' },
  ];

  const getVisibleProjects = (prefix: string) => {
    const treeProjects = projects
      .filter(p => p.id.startsWith(prefix))
      .sort((a, b) => {
        const aLevel = parseInt(a.id.split('_lv')[1] || '1');
        const bLevel = parseInt(b.id.split('_lv')[1] || '1');
        return aLevel - bLevel;
      });

    // 只显示最新的一个（研究中或可研究）
    for (let i = treeProjects.length - 1; i >= 0; i--) {
      const project = treeProjects[i];
      if (project.status === ResearchStatus.IN_PROGRESS ||
        project.status === ResearchStatus.AVAILABLE) {
        return [project];
      }
    }

    // 如果没有进行中的，显示已完成的最后一个
    for (let i = treeProjects.length - 1; i >= 0; i--) {
      const project = treeProjects[i];
      if (project.status === ResearchStatus.COMPLETED) {
        return [project];
      }
    }

    return [];
  };

  const selectedProjectData = selectedProject ? projects.find(p => p.id === selectedProject) : null;
  const selectedTree = selectedProjectData ? techTrees.find(t => selectedProjectData.id.startsWith(t.prefix)) : null;

  return (
    <div style={{ position: 'relative' }}>
      {/* Message Toast */}
      {message && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '12px 24px',
          borderRadius: '12px',
          background: message.type === 'success' ? 'rgba(34, 197, 94, 0.95)' : 'rgba(239, 68, 68, 0.95)',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '14px',
          zIndex: 9999,
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
        }}>
          {message.text}
        </div>
      )}

      {/* 研究详情弹窗 */}
      {selectedProjectData && selectedTree && (
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
          onClick={() => setSelectedProject(null)}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(30, 30, 40, 0.98), rgba(20, 20, 30, 0.98))',
              borderRadius: 16,
              padding: 24,
              width: 320,
              maxWidth: '90%',
              border: `2px solid ${selectedTree.color}`,
              boxShadow: `0 0 30px ${selectedTree.color}40`,
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
              <span
                onClick={() => setSelectedProject(null)}
                style={{ cursor: 'pointer', fontSize: 20, color: '#6b7280' }}
              >
                ✕
              </span>
            </div>

            {/* 标题 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 50,
                height: 50,
                borderRadius: 12,
                background: `${selectedTree.color}30`,
                border: `2px solid ${selectedTree.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ fontSize: 24 }}>{selectedTree.icon}</span>
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{selectedProjectData.name}</div>
                <span style={{
                  fontSize: 11,
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: selectedProjectData.status === ResearchStatus.COMPLETED ? '#10b98130' :
                    selectedProjectData.status === ResearchStatus.IN_PROGRESS ? '#f59e0b30' : '#3b82f630',
                  color: selectedProjectData.status === ResearchStatus.COMPLETED ? '#10b981' :
                    selectedProjectData.status === ResearchStatus.IN_PROGRESS ? '#f59e0b' : '#3b82f6',
                }}>
                  {selectedProjectData.status === ResearchStatus.COMPLETED ? '已完成' :
                    selectedProjectData.status === ResearchStatus.IN_PROGRESS ? '研究中' : '可研究'}
                </span>
              </div>
            </div>

            {/* 描述 */}
            <div style={{ color: '#a1a1aa', fontSize: 13, marginBottom: 16, lineHeight: 1.5 }}>
              {selectedProjectData.description}
            </div>

            {/* 进度条 */}
            {selectedProjectData.status === ResearchStatus.IN_PROGRESS && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: '#a1a1aa', fontSize: 12 }}>研究进度</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: selectedTree.color, fontSize: 12, fontWeight: 'bold' }}>
                      {Math.round((selectedProjectData.progress / selectedProjectData.totalProgress) * 100)}%
                    </span>
                    <span style={{ color: '#f59e0b', fontSize: 12, fontWeight: 'bold' }}>
                      ⏱️ {formatTime(getRemainingTime(selectedProjectData))}
                    </span>
                  </div>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.round((selectedProjectData.progress / selectedProjectData.totalProgress) * 100)}%`,
                    background: selectedTree.color,
                    borderRadius: 3,
                  }} />
                </div>
              </div>
            )}

            {/* 消耗 */}
            {selectedProjectData.status === ResearchStatus.AVAILABLE && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ color: '#a1a1aa', fontSize: 12, marginBottom: 8 }}>研究消耗</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <span style={{
                    background: 'rgba(251, 191, 36, 0.2)',
                    padding: '4px 10px',
                    borderRadius: 6,
                    color: '#fbbf24',
                    fontSize: 12,
                  }}>
                    💰 {selectedProjectData.cost.credits}
                  </span>
                  {selectedProjectData.cost.materials.map((mat, i) => (
                    <span key={i} style={{
                      background: 'rgba(96, 165, 250, 0.2)',
                      padding: '4px 10px',
                      borderRadius: 6,
                      color: '#60a5fa',
                      fontSize: 12,
                    }}>
                      {getItemName(mat.itemId)} x{mat.count}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 效果 */}
            {selectedProjectData.status === ResearchStatus.COMPLETED && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ color: '#a1a1aa', fontSize: 12, marginBottom: 8 }}>研究效果</div>
                <div style={{ background: `${selectedTree.color}15`, padding: 10, borderRadius: 8 }}>
                  {selectedProjectData.effects.map((e, i) => (
                    <div key={i} style={{ color: selectedTree.color, fontSize: 12 }}>✨ {e.description}</div>
                  ))}
                </div>
              </div>
            )}

            {/* 按钮 */}
            {selectedProjectData.status === ResearchStatus.AVAILABLE && (
              <button
                onClick={() => handleStartResearch(selectedProjectData.id)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: `linear-gradient(135deg, ${selectedTree.color}, ${selectedTree.color}aa)`,
                  border: 'none',
                  borderRadius: 8,
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                开始研究
              </button>
            )}

            {selectedProjectData.status === ResearchStatus.IN_PROGRESS && (
              <button
                onClick={() => handleCancelResearch(selectedProjectData.id)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  borderRadius: 8,
                  color: '#f87171',
                  fontWeight: 'bold',
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                取消研究
              </button>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{
        background: 'rgba(192, 132, 252, 0.1)',
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
        border: '1px solid rgba(192, 132, 252, 0.2)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
          <div>
            <span style={{ color: '#a1a1aa' }}>已完成: </span>
            <span style={{ color: '#10b981', fontWeight: 'bold' }}>{gameManager.completedResearch.length}</span>
          </div>
          {activeResearch.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#f59e0b' }}>⏱️</span>
              <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>
                {formatTime(getRemainingTime(activeResearch[0]))}
              </span>
            </div>
          )}
        </div>
        {activeResearch.length > 0 && (
          <div style={{ marginTop: 8, fontSize: 11, color: '#a1a1aa' }}>
            正在研究: <span style={{ color: '#c084fc' }}>{activeResearch[0].name}</span>
          </div>
        )}
      </div>

      {/* 科技树 - 四种设施并列 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {techTrees.map(tree => {
          const visibleProjects = getVisibleProjects(tree.prefix);

          return (
            <div
              key={tree.name}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: 14,
                padding: 14,
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              {/* 设施标题 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 14,
              }}>
                <span style={{ fontSize: 20 }}>{tree.icon}</span>
                <span style={{ color: tree.color, fontWeight: 'bold', fontSize: 14 }}>{tree.name}</span>
              </div>

              {/* 等级图标横向排列 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                justifyContent: 'center',
                padding: '10px 0',
              }}>
                {visibleProjects.length > 0 ? (
                  visibleProjects.map((project, index) => {
                    const remainingTime = getRemainingTime(project);
                    const levelNum = parseInt(project.id.split('_lv')[1] || '2');

                    const borderColor = tree.color;
                    let bgColor = 'rgba(255, 255, 255, 0.05)';

                    if (project.status === ResearchStatus.COMPLETED) {
                      bgColor = `${tree.color}35`;
                    } else if (project.status === ResearchStatus.IN_PROGRESS) {
                      bgColor = `${tree.color}25`;
                    } else if (project.status === ResearchStatus.AVAILABLE) {
                      bgColor = 'rgba(255, 255, 255, 0.1)';
                    }

                    return (
                      <div
                        key={project.id}
                        onClick={() => setSelectedProject(project.id)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          cursor: 'pointer',
                          position: 'relative',
                        }}
                      >
                        {/* 连接线 */}
                        {index < visibleProjects.length - 1 && (
                          <div style={{
                            position: 'absolute',
                            right: -24,
                            top: '50%',
                            width: 20,
                            height: 2,
                            background: project.status === ResearchStatus.COMPLETED ? tree.color : '#4b5563',
                            opacity: project.status === ResearchStatus.COMPLETED ? 0.8 : 0.3,
                          }} />
                        )}

                        {/* 图标 */}
                        <div style={{
                          width: 48,
                          height: 48,
                          borderRadius: 10,
                          border: `2px solid ${borderColor}`,
                          background: bgColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease',
                          boxShadow: project.status === ResearchStatus.IN_PROGRESS ? `0 0 10px ${tree.color}50` : 'none',
                        }}>
                          {project.status === ResearchStatus.COMPLETED ? (
                            <span style={{ fontSize: 18, color: tree.color }}>✓</span>
                          ) : project.status === ResearchStatus.IN_PROGRESS ? (
                            <span style={{ fontSize: 9, color: '#f59e0b', fontWeight: 'bold' }}>{formatTime(remainingTime)}</span>
                          ) : (
                            <span style={{ fontSize: 11, color: '#fff', fontWeight: 'bold' }}>Lv{levelNum}</span>
                          )}
                        </div>

                        {/* 等级标签 */}
                        <span style={{
                          fontSize: 9,
                          color: project.status === ResearchStatus.COMPLETED ? tree.color : '#a1a1aa',
                          marginTop: 4,
                        }}>
                          Lv.{levelNum}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <span style={{ color: '#6b7280', fontSize: 11 }}>暂无研究</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 7. 采矿平台内容
function MiningContent() {
  const { gameManager, saveGame, startMiningWithCrew, collectMining } = useGameStore();
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [selectedCrew, setSelectedCrew] = useState<string[]>([]);
  const [showCrewSelect, setShowCrewSelect] = useState(false);
  const [, forceUpdate] = useState(0);

  // 每秒更新进度显示
  useEffect(() => {
    const timer = setInterval(() => {
      forceUpdate(n => n + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const sites = gameManager.getAvailableMiningSites();
  const tasks = gameManager.getMiningTasks();
  const crewMembers = gameManager.getCrewMembers();

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleStartMining = async (siteId: string) => {
    const result = startMiningWithCrew(siteId, selectedCrew);
    if (result.success) {
      showMessage(result.message, 'success');
      setSelectedSite(null);
      setSelectedCrew([]);
      setShowCrewSelect(false);
      await saveGame();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const handleCollect = async (siteId: string) => {
    const result = collectMining(siteId);
    if (result.success) {
      const depthInfo = result.depth ? ` (深度: ${result.depth}m)` : '';
      showMessage(`${result.message}${depthInfo}`, 'success');
      await saveGame();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const toggleCrewSelection = (crewId: string) => {
    if (selectedCrew.includes(crewId)) {
      setSelectedCrew(selectedCrew.filter(id => id !== crewId));
    } else if (selectedCrew.length < 4) {
      setSelectedCrew([...selectedCrew, crewId]);
    }
  };

  const isCrewAvailable = (crewId: string) => {
    return !tasks.some(t => t.assignedCrew.includes(crewId));
  };

  const getTaskForSite = (siteId: string) => {
    return tasks.find(t => t.siteId === siteId);
  };

  return (
    <div>
      {/* Message Toast */}
      {message && (
        <div style={{
          position: 'absolute',
          top: '-40px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '8px 16px',
          borderRadius: '8px',
          background: message.type === 'success' ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '12px',
          zIndex: 100,
          whiteSpace: 'nowrap',
        }}>
          {message.text}
        </div>
      )}

      {/* Stats */}
      <div style={{
        background: 'rgba(245, 158, 11, 0.1)',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '12px',
        border: '1px solid rgba(245, 158, 11, 0.2)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
          <div>
            <span style={{ color: '#a1a1aa' }}>采矿槽: </span>
            <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{tasks.length}/{getMaxMiningSlots(level)}</span>
          </div>
          <div>
            <span style={{ color: '#a1a1aa' }}>设施等级: </span>
            <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>Lv.{level}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '10px' }}>
          <div>
            <span style={{ color: '#a1a1aa' }}>效率: </span>
            <span style={{ color: '#10b981' }}>+{getMiningEfficiencyBonus(level)}%</span>
          </div>
          <div>
            <span style={{ color: '#a1a1aa' }}>速度: </span>
            <span style={{ color: '#10b981' }}>+{getMiningSpeedBonus(level)}%</span>
          </div>
          <div>
            <span style={{ color: '#a1a1aa' }}>深度加成: </span>
            <span style={{ color: '#10b981' }}>+{getMiningDepthBonus(level)}m</span>
          </div>
        </div>
      </div>

      {/* Active Tasks */}
      {tasks.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ color: '#f59e0b', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
            ⛏️ 进行中的任务
          </div>
          {tasks.map(task => {
            const site = sites.find(s => s.id === task.siteId);
            if (!site) return null;
            const mineralConfig = MINERAL_CONFIG[site.mineralType];
            const progress = getMiningProgress(task);
            const remaining = getMiningRemainingTime(task);
            const depthBonus = getDepthBonusDescription(task.currentDepth || 0, site);
            const assignedCrewNames = (task.assignedCrew || []).map(id => crewMembers.find(c => c.id === id)?.name).filter(Boolean);

            return (
              <div
                key={task.siteId}
                style={{
                  padding: '12px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  borderRadius: '12px',
                  marginBottom: '8px',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>{mineralConfig.icon}</span>
                    <span style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '13px' }}>{site.name}</span>
                  </div>
                  <span style={{ color: mineralConfig.color, fontSize: '11px' }}>
                    {mineralConfig.name}
                  </span>
                </div>

                {/* Depth Info */}
                <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: '#a1a1aa', fontSize: '10px' }}>
                    深度: <span style={{ color: '#22c55e' }}>{task.currentDepth || 0}m</span> / {site.maxDepth}m
                  </div>
                  <div style={{ color: '#22c55e', fontSize: '10px' }}>
                    {depthBonus}
                  </div>
                </div>

                {/* Depth Progress Bar */}
                <div style={{ marginBottom: '8px' }}>
                  <div style={{
                    height: '3px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${((task.currentDepth || 0) / site.maxDepth) * 100}%`,
                      background: 'linear-gradient(90deg, #22c55e, #16a34a)',
                      borderRadius: '2px',
                    }} />
                  </div>
                </div>

                {/* Time Progress */}
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#a1a1aa', fontSize: '10px' }}>进度</span>
                    <span style={{ color: '#f59e0b', fontSize: '10px' }}>{Math.round(progress)}%</span>
                  </div>
                  <div style={{
                    height: '4px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${progress}%`,
                      background: `linear-gradient(90deg, ${mineralConfig.color}, #f59e0b)`,
                      borderRadius: '2px',
                    }} />
                  </div>
                  <div style={{ color: '#a1a1aa', fontSize: '10px', marginTop: '4px' }}>
                    剩余: {formatMiningTime(remaining)}
                  </div>
                </div>

                {/* Assigned Crew */}
                {assignedCrewNames.length > 0 && (
                  <div style={{ marginBottom: '8px', color: '#a1a1aa', fontSize: '10px' }}>
                    派遣船员: {assignedCrewNames.join('、')}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px' }}>
                  {task.status === 'completed' ? (
                    <button
                      onClick={() => handleCollect(task.siteId)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '11px',
                        cursor: 'pointer',
                      }}
                    >
                      ✓ 收集资源
                    </button>
                  ) : (
                    <div style={{
                      flex: 1,
                      padding: '8px',
                      background: 'rgba(100, 100, 100, 0.2)',
                      border: '1px solid rgba(100, 100, 100, 0.4)',
                      borderRadius: '6px',
                      color: '#888',
                      fontWeight: 'bold',
                      fontSize: '11px',
                      textAlign: 'center',
                    }}>
                      ⛏️ 采集中...
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Crew Selection Modal */}
      {showCrewSelect && selectedSite && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '12px',
          zIndex: 50,
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{ color: '#f59e0b', fontWeight: 'bold', marginBottom: '12px', fontSize: '14px' }}>
            选择派遣船员 ({selectedCrew.length}/4)
          </div>

          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '12px' }}>
            {crewMembers.slice(0, 8).map(crew => {
              const available = isCrewAvailable(crew.id);
              const selected = selectedCrew.includes(crew.id);
              const bonus = getCrewMiningBonus({
                attack: crew.stats.attack,
                defense: crew.stats.defense,
                speed: crew.stats.speed,
              });

              return (
                <div
                  key={crew.id}
                  onClick={() => available && toggleCrewSelection(crew.id)}
                  style={{
                    padding: '10px',
                    background: selected ? 'rgba(245, 158, 11, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    marginBottom: '6px',
                    border: `1px solid ${selected ? 'rgba(245, 158, 11, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                    cursor: available ? 'pointer' : 'not-allowed',
                    opacity: available ? 1 : 0.5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ color: '#fff', fontSize: '12px' }}>{crew.name}</div>
                    <div style={{ color: '#a1a1aa', fontSize: '10px' }}>
                      攻:{crew.stats.attack} 防:{crew.stats.defense} 速:{crew.stats.speed}
                    </div>
                  </div>
                  <div style={{ color: '#22c55e', fontSize: '11px' }}>
                    +{bonus}%产量
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => {
                setShowCrewSelect(false);
                setSelectedSite(null);
                setSelectedCrew([]);
              }}
              style={{
                flex: 1,
                padding: '10px',
                background: 'rgba(100, 100, 100, 0.3)',
                border: '1px solid rgba(100, 100, 100, 0.5)',
                borderRadius: '8px',
                color: '#a1a1aa',
                fontWeight: 'bold',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              取消
            </button>
            <button
              onClick={() => selectedSite && handleStartMining(selectedSite)}
              style={{
                flex: 1,
                padding: '10px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                border: 'none',
                borderRadius: '8px',
                color: '#000',
                fontWeight: 'bold',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              开始采矿
            </button>
          </div>
        </div>
      )}

      {/* Available Sites */}
      <div>
        <div style={{ color: '#a1a1aa', fontSize: '12px', marginBottom: '8px' }}>
          🏔️ 可用采矿点
        </div>
        {sites.filter(s => !getTaskForSite(s.id)).map(site => {
          const mineralConfig = MINERAL_CONFIG[site.mineralType];
          const isActive = !!getTaskForSite(site.id);

          return (
            <div
              key={site.id}
              style={{
                padding: '12px',
                background: site.unlocked ? 'rgba(255, 255, 255, 0.03)' : 'rgba(100, 100, 100, 0.1)',
                borderRadius: '12px',
                marginBottom: '8px',
                border: `1px solid ${site.unlocked ? 'rgba(255, 255, 255, 0.08)' : 'rgba(100, 100, 100, 0.2)'}`,
                opacity: site.unlocked ? 1 : 0.6,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>{mineralConfig.icon}</span>
                  <span style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '13px' }}>{site.name}</span>
                </div>
                <span style={{ color: mineralConfig.color, fontSize: '11px' }}>
                  {mineralConfig.name}
                </span>
              </div>

              <div style={{ color: '#a1a1aa', fontSize: '11px', marginBottom: '4px' }}>
                基础产量: {site.baseYield}/次 | 难度: {'⭐'.repeat(site.difficulty)}
              </div>

              <div style={{ color: '#a1a1aa', fontSize: '11px', marginBottom: '8px' }}>
                最大深度: {site.maxDepth}m | 深度加成: +{(site.depthBonus * 100).toFixed(1)}%/m
              </div>

              {site.unlocked ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => {
                      setSelectedSite(site.id);
                      setShowCrewSelect(true);
                    }}
                    disabled={isActive}
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: isActive ? 'rgba(100, 100, 100, 0.3)' : `linear-gradient(135deg, ${mineralConfig.color}80, ${mineralConfig.color}40)`,
                      border: isActive ? '1px solid rgba(100, 100, 100, 0.3)' : 'none',
                      borderRadius: '6px',
                      color: isActive ? '#666' : '#fff',
                      fontWeight: 'bold',
                      fontSize: '11px',
                      cursor: isActive ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isActive ? '采矿中' : '派遣船员'}
                  </button>
                  <button
                    onClick={() => handleStartMining(site.id)}
                    disabled={isActive}
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: isActive ? 'rgba(100, 100, 100, 0.3)' : 'rgba(245, 158, 11, 0.2)',
                      border: isActive ? '1px solid rgba(100, 100, 100, 0.3)' : '1px solid rgba(245, 158, 11, 0.4)',
                      borderRadius: '6px',
                      color: isActive ? '#666' : '#f59e0b',
                      fontWeight: 'bold',
                      fontSize: '11px',
                      cursor: isActive ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isActive ? '采矿中' : '快速开始'}
                  </button>
                </div>
              ) : (
                <div style={{
                  background: 'rgba(100, 100, 100, 0.2)',
                  borderRadius: '6px',
                  padding: '8px',
                  textAlign: 'center',
                  color: '#666',
                  fontSize: '11px',
                }}>
                  🔒 需要 Lv.{site.unlockCondition?.facilityLevel || '?'} 解锁
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 8. 芯片研发内容
function ChipContent() {
  const { gameManager, saveGame, craftChip, upgradeChip, equipChip, decomposeChip, rerollChipSubStat, toggleChipLock, getChipSetBonuses, getChipStatBonus } = useGameStore();
  const [activeTab, setActiveTab] = useState<'slots' | 'craft'>('slots');
  const [selectedChip, setSelectedChip] = useState<Chip | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<ChipSlot | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    title: string;
    content: string;
    onConfirm: () => void;
    onCancel: () => void;
  } | null>(null);

  const chips = gameManager.getChips();
  const equippedChips = gameManager.getEquippedChips();
  const maxSlots = gameManager.getAvailableChipSlots();
  const setBonuses = getChipSetBonuses();
  const totalStats = getChipStatBonus();

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleCraft = async (slot: ChipSlot, rarity: ChipRarity) => {
    const result = craftChip(slot, rarity);
    if (result.success) {
      showMessage(`成功制作${CHIP_RARITY_CONFIG[rarity].name}芯片`, 'success');
      await saveGame();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const handleUpgrade = async (chipId: string, count: number) => {
    const result = upgradeChip(chipId, count);
    if (result.success) {
      showMessage(`升级到Lv.${result.newLevel}`, 'success');
      await saveGame();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const handleEquip = async (chipId: string) => {
    const result = equipChip(chipId);
    if (result.success) {
      showMessage(result.message, 'success');
      await saveGame();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const handleDecompose = async (chipId: string) => {
    const result = decomposeChip(chipId);
    if (result.success) {
      showMessage(`分解成功，获得${result.rewards}`, 'success');
      setSelectedChip(null);
      await saveGame();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const handleReroll = async (chipId: string, subStatIndex: number) => {
    const result = rerollChipSubStat(chipId, subStatIndex);
    if (result.success) {
      showMessage(result.message, 'success');
      await saveGame();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const handleToggleLock = async (chipId: string) => {
    const result = toggleChipLock(chipId);
    if (result.success) {
      showMessage(result.message, 'success');
      await saveGame();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const getEquippedChipForSlot = (slot: ChipSlot): Chip | undefined => {
    const chipId = gameManager.equippedChips[slot];
    return chips.find(c => c.id === chipId);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Message Toast */}
      {message && (
        <div style={{
          position: 'absolute',
          top: '-40px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '8px 16px',
          borderRadius: '8px',
          background: message.type === 'success' ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '12px',
          zIndex: 100,
          whiteSpace: 'nowrap',
        }}>
          {message.text}
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmDialog?.show && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 200,
          width: '280px',
        }}>
          <div style={{
            background: 'rgba(0, 20, 40, 0.98)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #00d4ff',
            boxShadow: '0 4px 20px rgba(0, 212, 255, 0.3)',
          }}>
            <h3 style={{ color: '#00d4ff', fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center' }}>
              {confirmDialog.title}
            </h3>
            <p style={{ color: '#a1a1aa', fontSize: '12px', marginBottom: '16px', whiteSpace: 'pre-line', textAlign: 'center' }}>
              {confirmDialog.content}
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={confirmDialog.onCancel}
                style={{
                  flex: 1,
                  padding: '8px',
                  background: 'rgba(100, 100, 100, 0.2)',
                  border: '1px solid rgba(100, 100, 100, 0.4)',
                  borderRadius: '6px',
                  color: '#a1a1aa',
                  fontWeight: 'bold',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                取消
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                style={{
                  flex: 1,
                  padding: '8px',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{
        background: 'rgba(16, 185, 129, 0.1)',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '12px',
        border: '1px solid rgba(16, 185, 129, 0.2)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
          <div>
            <span style={{ color: '#a1a1aa' }}>芯片槽位: </span>
            <span style={{ color: '#10b981', fontWeight: 'bold' }}>{equippedChips.length}/{maxSlots}</span>
          </div>
          <div>
            <span style={{ color: '#a1a1aa' }}>芯片数量: </span>
            <span style={{ color: '#10b981', fontWeight: 'bold' }}>{chips.length}</span>
          </div>
        </div>
      </div>

      {/* Set Bonuses */}
      {setBonuses.length > 0 && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '12px',
          border: '1px solid rgba(16, 185, 129, 0.2)',
        }}>
          <div style={{ color: '#10b981', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
            套装效果
          </div>
          {setBonuses.map((bonus, idx) => {
            const setConfig = CHIP_SET_CONFIG[bonus.set];
            return (
              <div key={idx} style={{ marginBottom: '4px' }}>
                <div style={{ color: setConfig.color, fontSize: '11px', fontWeight: 'bold' }}>
                  {setConfig.icon} {setConfig.name} ({bonus.count}件)
                </div>
                {bonus.bonuses.map((b, i) => (
                  <div key={i} style={{ color: '#a1a1aa', fontSize: '10px', marginLeft: '16px' }}>
                    {b}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Total Stats */}
      {Object.keys(totalStats).length > 0 && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '12px',
          border: '1px solid rgba(16, 185, 129, 0.2)',
        }}>
          <div style={{ color: '#10b981', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
            总属性加成
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {Object.entries(totalStats).map(([stat, value]) => (
              <div key={stat} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
              }}>
                <span style={{ color: '#10b981' }}>{stat}:</span>
                <span style={{ color: '#fff' }}>+{typeof value === 'number' ? value.toFixed(1) : value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Switcher */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '12px',
      }}>
        <button
          onClick={() => setActiveTab('slots')}
          style={{
            flex: 1,
            padding: '10px',
            background: activeTab === 'slots' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.05)',
            border: activeTab === 'slots' ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: activeTab === 'slots' ? '#10b981' : '#a1a1aa',
            fontWeight: 'bold',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          💾 芯片槽位
        </button>
        <button
          onClick={() => setActiveTab('craft')}
          style={{
            flex: 1,
            padding: '10px',
            background: activeTab === 'craft' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.05)',
            border: activeTab === 'craft' ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: activeTab === 'craft' ? '#10b981' : '#a1a1aa',
            fontWeight: 'bold',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          🔨 制作芯片
        </button>
      </div>

      {/* Slots Tab */}
      {activeTab === 'slots' && (
        <div>
          {/* Chip Slots */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px',
            marginBottom: '12px',
          }}>
            {[ChipSlot.SLOT_1, ChipSlot.SLOT_2, ChipSlot.SLOT_3, ChipSlot.SLOT_4].map(slot => {
              const equipped = getEquippedChipForSlot(slot);
              const isSelected = selectedSlot === slot;
              return (
                <div
                  key={slot}
                  onClick={() => {
                    setSelectedSlot(slot);
                    if (equipped) setSelectedChip(equipped);
                  }}
                  style={{
                    padding: '12px',
                    background: isSelected ? 'rgba(0, 212, 255, 0.15)' : 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #00d4ff' : (equipped ? `2px solid ${CHIP_RARITY_CONFIG[equipped.rarity].color}` : '1px solid rgba(255, 255, 255, 0.1)'),
                    cursor: 'pointer',
                  }}
                >
                  <div style={{
                    color: '#a1a1aa',
                    fontSize: '11px',
                    marginBottom: '4px',
                  }}>
                    {slot}号位 {slot === ChipSlot.SLOT_1 ? '(生命)' : slot === ChipSlot.SLOT_2 ? '(攻击)' : '(随机)'}
                  </div>
                  {equipped ? (
                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '4px',
                      }}>
                        <span style={{ color: CHIP_RARITY_CONFIG[equipped.rarity].color, fontWeight: 'bold', fontSize: '12px' }}>
                          {CHIP_RARITY_CONFIG[equipped.rarity].name}
                        </span>
                        <span style={{ color: '#10b981', fontSize: '11px' }}>Lv.{equipped.level}</span>
                        {equipped.locked && <span style={{ color: '#f59e0b', fontSize: '10px' }}>🔒</span>}
                      </div>
                      <div style={{ color: '#fff', fontSize: '11px' }}>
                        主属性: {CHIP_MAIN_STAT_CONFIG[equipped.mainStat].name} +{equipped.mainStatValue}
                      </div>
                      {equipped.setId && (
                        <div style={{ color: CHIP_SET_CONFIG[equipped.setId].color, fontSize: '10px' }}>
                          {CHIP_SET_CONFIG[equipped.setId].icon} {CHIP_SET_CONFIG[equipped.setId].name}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ color: '#666', fontSize: '12px' }}>
                      空
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Chip Inventory */}
          <div style={{ color: '#a1a1aa', fontSize: '12px', marginBottom: '8px' }}>
            📦 芯片仓库
            {selectedSlot ? `(${selectedSlot}号位)` : '(全部)'}
            {' '}
            ({chips.filter(c => !Object.values(gameManager.equippedChips).includes(c.id) && (!selectedSlot || c.slot === selectedSlot)).length})
            {selectedSlot && (
              <button
                onClick={() => setSelectedSlot(null)}
                style={{
                  marginLeft: '8px',
                  padding: '2px 8px',
                  background: 'rgba(100, 100, 100, 0.3)',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#a1a1aa',
                  fontSize: '10px',
                  cursor: 'pointer',
                }}
              >
                显示全部
              </button>
            )}
          </div>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {chips.filter(c => !Object.values(gameManager.equippedChips).includes(c.id) && (!selectedSlot || c.slot === selectedSlot)).map(chip => (
              <div
                key={chip.id}
                onClick={() => setSelectedChip(chip)}
                style={{
                  padding: '10px',
                  background: selectedChip?.id === chip.id ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '8px',
                  marginBottom: '6px',
                  border: `1px solid ${selectedChip?.id === chip.id ? CHIP_RARITY_CONFIG[chip.rarity].color : 'rgba(255, 255, 255, 0.08)'}`,
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ color: CHIP_RARITY_CONFIG[chip.rarity].color, fontWeight: 'bold', fontSize: '12px' }}>
                      {CHIP_RARITY_CONFIG[chip.rarity].name}
                    </span>
                    <span style={{ color: '#a1a1aa', fontSize: '11px', marginLeft: '8px' }}>
                      {chip.slot}号位 Lv.{chip.level}
                    </span>
                    {chip.locked && <span style={{ color: '#f59e0b', fontSize: '10px', marginLeft: '4px' }}>🔒</span>}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleEquip(chip.id); }}
                    style={{
                      padding: '4px 8px',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#fff',
                      fontSize: '10px',
                      cursor: 'pointer',
                    }}
                  >
                    装备
                  </button>
                </div>
                {chip.setId && (
                  <div style={{ color: CHIP_SET_CONFIG[chip.setId].color, fontSize: '10px', marginTop: '4px' }}>
                    {CHIP_SET_CONFIG[chip.setId].icon} {CHIP_SET_CONFIG[chip.setId].name}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Selected Chip Actions */}
          {selectedChip && (
            <div style={{
              marginTop: '12px',
              padding: '12px',
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ color: CHIP_RARITY_CONFIG[selectedChip.rarity].color, fontWeight: 'bold' }}>
                  {CHIP_RARITY_CONFIG[selectedChip.rarity].name}芯片 Lv.{selectedChip.level}
                </div>
                <button
                  onClick={() => handleToggleLock(selectedChip.id)}
                  style={{
                    padding: '4px 8px',
                    background: selectedChip.locked ? 'rgba(245, 158, 11, 0.3)' : 'rgba(100, 100, 100, 0.2)',
                    border: selectedChip.locked ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(100, 100, 100, 0.3)',
                    borderRadius: '4px',
                    color: selectedChip.locked ? '#f59e0b' : '#a1a1aa',
                    fontSize: '10px',
                    cursor: 'pointer',
                  }}
                >
                  {selectedChip.locked ? '🔒 已锁定' : '🔓 未锁定'}
                </button>
              </div>

              {/* Set Info */}
              {selectedChip.setId && (
                <div style={{ color: CHIP_SET_CONFIG[selectedChip.setId].color, fontSize: '11px', marginBottom: '8px' }}>
                  {CHIP_SET_CONFIG[selectedChip.setId].icon} {CHIP_SET_CONFIG[selectedChip.setId].name}套装
                </div>
              )}

              {/* Main Stat */}
              <div style={{ color: '#fff', fontSize: '11px', marginBottom: '8px' }}>
                主属性: {CHIP_MAIN_STAT_CONFIG[selectedChip.mainStat].name} +{selectedChip.mainStatValue}
              </div>

              {/* Sub Stats */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ color: '#a1a1aa', fontSize: '11px', marginBottom: '4px' }}>
                  副属性 (可重随类型和数值，范围见括号):
                </div>
                {selectedChip.subStats.map((sub, idx) => {
                  const rerollCost = getRerollCost(selectedChip);
                  const hasEnoughCredits = gameManager.trainCoins >= rerollCost.credits;
                  const hasEnoughMaterials = (gameManager.inventory.getItem('mineral_quantum')?.quantity || 0) >= rerollCost.materials;
                  const canReroll = !selectedChip.locked && hasEnoughCredits && hasEnoughMaterials;
                  const config = CHIP_SUB_STAT_CONFIG[sub.stat];
                  return (
                    <div key={idx} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '6px 8px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '6px',
                      marginBottom: '4px',
                    }}>
                      <span style={{ color: '#fff', fontSize: '11px' }}>
                        {config.name} +{sub.value} ({config.minValue}-{config.maxValue})
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* 重随需求 - 纯文字 */}
                        <span style={{ color: hasEnoughCredits ? '#a1a1aa' : '#ef4444', fontSize: '9px' }}>
                          信用点:{rerollCost.credits}
                        </span>
                        <span style={{ color: hasEnoughMaterials ? '#a1a1aa' : '#ef4444', fontSize: '9px' }}>
                          量子矿:{rerollCost.materials}
                        </span>
                        <button
                          onClick={() => {
                            setConfirmDialog({
                              show: true,
                              title: '重随副属性',
                              content: `确定要重随这个副属性吗？\n可能获得新的属性类型和数值\n消耗: ${rerollCost.credits}信用点, ${rerollCost.materials}量子矿`,
                              onConfirm: () => {
                                handleReroll(selectedChip.id, idx);
                                setConfirmDialog(null);
                              },
                              onCancel: () => setConfirmDialog(null),
                            });
                          }}
                          disabled={!canReroll}
                          style={{
                            padding: '2px 8px',
                            background: !canReroll ? 'rgba(100, 100, 100, 0.2)' : 'rgba(168, 85, 247, 0.2)',
                            border: !canReroll ? '1px solid rgba(100, 100, 100, 0.3)' : '1px solid rgba(168, 85, 247, 0.4)',
                            borderRadius: '4px',
                            color: !canReroll ? '#666' : '#a855f7',
                            fontSize: '9px',
                            cursor: !canReroll ? 'not-allowed' : 'pointer',
                          }}
                        >
                          🎲 重随
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Upgrade Info */}
              {selectedChip.level < 15 && (
                <div style={{
                  background: 'rgba(0, 212, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '10px',
                  marginBottom: '12px',
                  border: '1px solid rgba(0, 212, 255, 0.3)',
                }}>
                  <div style={{ color: '#00d4ff', fontSize: '11px', fontWeight: 'bold', marginBottom: '6px' }}>
                    ⬆️ 升级需求 (Lv.{selectedChip.level} → Lv.{selectedChip.level + 1})
                  </div>
                  {(() => {
                    const upgradeCost = getUpgradeCost(selectedChip.level);
                    const hasEnoughCredits = gameManager.trainCoins >= upgradeCost.credits;
                    const currentMaterials = gameManager.inventory.getItem('chip_material')?.quantity || 0;
                    const hasEnoughMaterials = currentMaterials >= upgradeCost.materials;
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#a1a1aa' }}>信用点:</span>
                          <span style={{ color: hasEnoughCredits ? '#10b981' : '#ef4444' }}>
                            {gameManager.trainCoins.toLocaleString()} / {upgradeCost.credits.toLocaleString()}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#a1a1aa' }}>芯片材料:</span>
                          <span style={{ color: hasEnoughMaterials ? '#10b981' : '#ef4444' }}>
                            {currentMaterials} / {upgradeCost.materials}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <button
                  onClick={() => handleUpgrade(selectedChip.id, 1)}
                  disabled={selectedChip.level >= 15}
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: selectedChip.level >= 15 ? 'rgba(100, 100, 100, 0.3)' : 'linear-gradient(135deg, #00d4ff, #0099cc)',
                    border: 'none',
                    borderRadius: '6px',
                    color: selectedChip.level >= 15 ? '#666' : '#fff',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    cursor: selectedChip.level >= 15 ? 'not-allowed' : 'pointer',
                  }}
                >
                  {selectedChip.level >= 15 ? '已满级' : '升级'}
                </button>
                <button
                  onClick={() => {
                    setConfirmDialog({
                      show: true,
                      title: '分解芯片',
                      content: `确定要分解这个${CHIP_RARITY_CONFIG[selectedChip.rarity].name}芯片吗？\n将获得芯片材料作为回报。`,
                      onConfirm: () => {
                        handleDecompose(selectedChip.id);
                        setConfirmDialog(null);
                      },
                      onCancel: () => setConfirmDialog(null),
                    });
                  }}
                  disabled={selectedChip.locked}
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: selectedChip.locked ? 'rgba(100, 100, 100, 0.3)' : 'rgba(239, 68, 68, 0.2)',
                    border: selectedChip.locked ? '1px solid rgba(100, 100, 100, 0.3)' : '1px solid rgba(239, 68, 68, 0.4)',
                    borderRadius: '6px',
                    color: selectedChip.locked ? '#666' : '#f87171',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    cursor: selectedChip.locked ? 'not-allowed' : 'pointer',
                  }}
                >
                  分解
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Craft Tab */}
      {activeTab === 'craft' && (
        <ChipCraftPanel
          gameManager={gameManager}
          onCraft={handleCraft}
        />
      )}
    </div>
  );
}

// 9. 基因工程内容
function GeneContent() {
  const { gameManager, saveGame, upgradeGeneNode, getGeneTotalStats } = useGameStore();
  const [selectedType, setSelectedType] = useState<GeneType | 'all'>('all');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const nodes = gameManager.getGeneNodes();
  const totalStats = getGeneTotalStats();

  const filteredNodes = selectedType === 'all' ? nodes : nodes.filter(n => n.type === selectedType);

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleUpgrade = async (nodeId: string) => {
    const result = upgradeGeneNode(nodeId);
    if (result.success) {
      showMessage(`升级成功，属性+${result.newValue}`, 'success');
      await saveGame();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const geneTypes = [
    { id: 'all' as const, name: '全部', icon: '🧬' },
    { id: GeneType.ATTACK, name: '攻击', icon: '⚔️' },
    { id: GeneType.DEFENSE, name: '防御', icon: '🛡️' },
    { id: GeneType.HP, name: '生命', icon: '❤️' },
    { id: GeneType.SPEED, name: '速度', icon: '⚡' },
    { id: GeneType.CRIT_RATE, name: '暴击', icon: '🎯' },
  ];

  return (
    <div>
      {/* Message Toast */}
      {message && (
        <div style={{
          position: 'absolute',
          top: '-40px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '8px 16px',
          borderRadius: '8px',
          background: message.type === 'success' ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '12px',
          zIndex: 100,
          whiteSpace: 'nowrap',
        }}>
          {message.text}
        </div>
      )}

      {/* Total Stats */}
      <div style={{
        background: 'rgba(236, 72, 153, 0.1)',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '12px',
        border: '1px solid rgba(236, 72, 153, 0.2)',
      }}>
        <div style={{ color: '#ec4899', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
          当前属性加成
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {Object.entries(totalStats).map(([type, value]) => {
            if (value <= 0) return null;
            const config = GENE_TYPE_CONFIG[type as GeneType];
            return (
              <div key={type} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
              }}>
                <span>{config.icon}</span>
                <span style={{ color: config.color }}>{config.name}</span>
                <span style={{ color: '#fff' }}>+{value}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Type Filter */}
      <div style={{
        display: 'flex',
        gap: '6px',
        marginBottom: '12px',
        overflowX: 'auto',
        paddingBottom: '4px',
      }}>
        {geneTypes.map(type => (
          <button
            key={type.id}
            onClick={() => setSelectedType(type.id)}
            style={{
              padding: '6px 12px',
              background: selectedType === type.id ? 'rgba(236, 72, 153, 0.3)' : 'rgba(255, 255, 255, 0.05)',
              border: selectedType === type.id ? '1px solid rgba(236, 72, 153, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              color: selectedType === type.id ? '#ec4899' : '#a1a1aa',
              fontSize: '12px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {type.icon} {type.name}
          </button>
        ))}
      </div>

      {/* Gene Nodes */}
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {filteredNodes.map(node => {
          const typeConfig = GENE_TYPE_CONFIG[node.type];
          const rarityConfig = GENE_RARITY_CONFIG[node.rarity];

          return (
            <div
              key={node.id}
              style={{
                padding: '12px',
                background: node.unlocked ? 'rgba(255, 255, 255, 0.03)' : 'rgba(100, 100, 100, 0.1)',
                borderRadius: '12px',
                marginBottom: '8px',
                border: `1px solid ${node.unlocked ? `${rarityConfig.color}40` : 'rgba(100, 100, 100, 0.2)'}`,
                opacity: node.unlocked ? 1 : 0.5,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>{typeConfig.icon}</span>
                  <span style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '13px' }}>
                    {typeConfig.name}基因
                  </span>
                  <span style={{
                    color: rarityConfig.color,
                    fontSize: '10px',
                    padding: '2px 6px',
                    background: `${rarityConfig.color}20`,
                    borderRadius: '4px',
                  }}>
                    {rarityConfig.name}
                  </span>
                </div>
                <span style={{ color: '#ec4899', fontSize: '11px' }}>
                  Lv.{node.level}/{node.maxLevel}
                </span>
              </div>

              <div style={{ color: '#a1a1aa', fontSize: '11px', marginBottom: '8px' }}>
                当前加成: <span style={{ color: typeConfig.color }}>+{node.currentValue}</span> {typeConfig.name}
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: '8px' }}>
                <div style={{
                  height: '4px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${(node.level / node.maxLevel) * 100}%`,
                    background: `linear-gradient(90deg, ${typeConfig.color}, ${rarityConfig.color})`,
                    borderRadius: '2px',
                  }} />
                </div>
              </div>

              {node.unlocked ? (
                node.level < node.maxLevel ? (
                  <button
                    onClick={() => handleUpgrade(node.id)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: `linear-gradient(135deg, ${typeConfig.color}80, ${typeConfig.color}40)`,
                      border: 'none',
                      borderRadius: '6px',
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    升级
                  </button>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    color: '#10b981',
                    fontSize: '11px',
                    padding: '8px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '6px',
                  }}>
                    ✅ 已满级
                  </div>
                )
              ) : (
                <div style={{
                  textAlign: 'center',
                  color: '#666',
                  fontSize: '11px',
                  padding: '8px',
                  background: 'rgba(100, 100, 100, 0.1)',
                  borderRadius: '6px',
                }}>
                  🔒 未解锁
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 10. 机械飞升内容
function CyberneticContent() {
  const { gameManager, saveGame, craftImplant, upgradeImplant, equipImplant, unequipImplant, decomposeImplant, getImplantTotalStats, toggleImplantLock, getCraftableImplantRarities } = useGameStore();
  const [activeTab, setActiveTab] = useState<'slots' | 'craft'>('slots');
  const [selectedImplant, setSelectedImplant] = useState<Implant | null>(null);
  const [selectedCraftType, setSelectedCraftType] = useState<ImplantType | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const implants = gameManager.getImplants();
  const equippedImplants = gameManager.getEquippedImplants();
  const availableSlots = gameManager.getAvailableImplantSlots();
  const craftableRarities = getCraftableImplantRarities();

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleCraft = async (type: ImplantType, rarity: ImplantRarity) => {
    const result = craftImplant(type, rarity);
    if (result.success) {
      showMessage(`成功制造${IMPLANT_RARITY_CONFIG[rarity].name}品质的${IMPLANT_TYPE_CONFIG[type].name}`, 'success');
      await saveGame();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const handleUpgrade = async (implantId: string) => {
    const result = upgradeImplant(implantId);
    if (result.success) {
      showMessage(`升级到Lv.${result.newLevel}`, 'success');
      await saveGame();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const handleEquip = async (implantId: string) => {
    const result = equipImplant(implantId);
    if (result.success) {
      showMessage(result.message, 'success');
      await saveGame();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const handleUnequip = async (type: ImplantType) => {
    const result = unequipImplant(type);
    if (result.success) {
      showMessage(result.message, 'success');
      await saveGame();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const handleDecompose = async (implantId: string) => {
    const result = decomposeImplant(implantId);
    if (result.success) {
      showMessage(`分解成功，获得${result.rewards}`, 'success');
      setSelectedImplant(null);
      await saveGame();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const handleToggleLock = async (implantId: string) => {
    const result = toggleImplantLock(implantId);
    if (result.success) {
      showMessage(result.message, 'success');
      await saveGame();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const getEquippedImplantForType = (type: ImplantType): Implant | undefined => {
    const implantId = gameManager.equippedImplants[type];
    return implants.find(i => i.id === implantId);
  };

  const totalStats = getImplantTotalStats();

  return (
    <div>
      {/* Message Toast */}
      {message && (
        <div style={{
          position: 'absolute',
          top: '-40px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '8px 16px',
          borderRadius: '8px',
          background: message.type === 'success' ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '12px',
          zIndex: 100,
          whiteSpace: 'nowrap',
        }}>
          {message.text}
        </div>
      )}

      {/* Stats */}
      <div style={{
        background: 'rgba(168, 85, 247, 0.1)',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '12px',
        border: '1px solid rgba(168, 85, 247, 0.2)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
          <div>
            <span style={{ color: '#a1a1aa' }}>义体槽位: </span>
            <span style={{ color: '#a855f7', fontWeight: 'bold' }}>{equippedImplants.length}/{availableSlots.length}</span>
          </div>
          <div>
            <span style={{ color: '#a1a1aa' }}>义体数量: </span>
            <span style={{ color: '#a855f7', fontWeight: 'bold' }}>{implants.length}</span>
          </div>
        </div>
      </div>

      {/* Total Stats */}
      {Object.keys(totalStats).length > 0 && (
        <div style={{
          background: 'rgba(168, 85, 247, 0.1)',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '12px',
          border: '1px solid rgba(168, 85, 247, 0.2)',
        }}>
          <div style={{ color: '#a855f7', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
            当前属性加成
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {Object.entries(totalStats).map(([stat, value]) => {
              const statNames: Record<string, string> = {
                attack: '攻击',
                defense: '防御',
                hp: '生命',
                speed: '速度',
                critRate: '暴击率',
                critDamage: '暴击伤害',
              };
              return (
                <div key={stat} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                }}>
                  <span style={{ color: '#a855f7' }}>{statNames[stat] || stat}:</span>
                  <span style={{ color: '#fff' }}>+{value}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Switcher */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '12px',
      }}>
        <button
          onClick={() => setActiveTab('slots')}
          style={{
            flex: 1,
            padding: '10px',
            background: activeTab === 'slots' ? 'rgba(168, 85, 247, 0.3)' : 'rgba(255, 255, 255, 0.05)',
            border: activeTab === 'slots' ? '1px solid rgba(168, 85, 247, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: activeTab === 'slots' ? '#a855f7' : '#a1a1aa',
            fontWeight: 'bold',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          🦾 义体槽位
        </button>
        <button
          onClick={() => setActiveTab('craft')}
          style={{
            flex: 1,
            padding: '10px',
            background: activeTab === 'craft' ? 'rgba(168, 85, 247, 0.3)' : 'rgba(255, 255, 255, 0.05)',
            border: activeTab === 'craft' ? '1px solid rgba(168, 85, 247, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: activeTab === 'craft' ? '#a855f7' : '#a1a1aa',
            fontWeight: 'bold',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          🔨 制造义体
        </button>
      </div>

      {/* Slots Tab */}
      {activeTab === 'slots' && (
        <div>
          {/* Implant Slots */}
          <div style={{ marginBottom: '12px' }}>
            {Object.values(ImplantType).map(type => {
              const equipped = getEquippedImplantForType(type);
              const isUnlocked = availableSlots.includes(type);
              const typeConfig = IMPLANT_TYPE_CONFIG[type];

              return (
                <div
                  key={type}
                  onClick={() => {
                    if (equipped) setSelectedImplant(equipped);
                  }}
                  style={{
                    padding: '12px',
                    background: isUnlocked ? 'rgba(168, 85, 247, 0.1)' : 'rgba(100, 100, 100, 0.1)',
                    borderRadius: '12px',
                    marginBottom: '8px',
                    border: equipped ? `2px solid ${IMPLANT_RARITY_CONFIG[equipped.rarity].color}` : '1px solid rgba(255, 255, 255, 0.1)',
                    opacity: isUnlocked ? 1 : 0.5,
                    cursor: equipped ? 'pointer' : 'default',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>{typeConfig.icon}</span>
                      <span style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '13px' }}>{typeConfig.name}</span>
                    </div>
                    {equipped && (
                      <span style={{ color: IMPLANT_RARITY_CONFIG[equipped.rarity].color, fontSize: '11px' }}>
                        Lv.{equipped.level}
                      </span>
                    )}
                  </div>
                  {equipped ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ color: IMPLANT_RARITY_CONFIG[equipped.rarity].color, fontSize: '12px' }}>
                          {equipped.name}
                        </div>
                        <div style={{ color: '#a1a1aa', fontSize: '10px' }}>
                          {typeConfig.description}
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleUnequip(type); }}
                        style={{
                          padding: '4px 8px',
                          background: 'rgba(239, 68, 68, 0.2)',
                          border: '1px solid rgba(239, 68, 68, 0.4)',
                          borderRadius: '4px',
                          color: '#f87171',
                          fontSize: '10px',
                          cursor: 'pointer',
                        }}
                      >
                        卸下
                      </button>
                    </div>
                  ) : (
                    <div style={{ color: isUnlocked ? '#666' : '#444', fontSize: '12px' }}>
                      {isUnlocked ? '空槽位' : `🔒 需要 Lv.${Object.values(ImplantType).indexOf(type) + 1} 解锁`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Implant Inventory */}
          <div style={{ color: '#a1a1aa', fontSize: '12px', marginBottom: '8px' }}>
            📦 义体仓库 ({implants.filter(i => !Object.values(gameManager.equippedImplants).includes(i.id)).length})
          </div>
          <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
            {implants.filter(i => !Object.values(gameManager.equippedImplants).includes(i.id)).map(implant => {
              const typeConfig = IMPLANT_TYPE_CONFIG[implant.type];
              return (
                <div
                  key={implant.id}
                  onClick={() => setSelectedImplant(implant)}
                  style={{
                    padding: '10px',
                    background: selectedImplant?.id === implant.id ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '8px',
                    marginBottom: '6px',
                    border: `1px solid ${selectedImplant?.id === implant.id ? IMPLANT_RARITY_CONFIG[implant.rarity].color : 'rgba(255, 255, 255, 0.08)'}`,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '14px', marginRight: '6px' }}>{typeConfig.icon}</span>
                      <span style={{ color: IMPLANT_RARITY_CONFIG[implant.rarity].color, fontWeight: 'bold', fontSize: '12px' }}>
                        {implant.name}
                      </span>
                      <span style={{ color: '#a1a1aa', fontSize: '11px', marginLeft: '8px' }}>
                        Lv.{implant.level}
                      </span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEquip(implant.id); }}
                      style={{
                        padding: '4px 8px',
                        background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                        border: 'none',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '10px',
                        cursor: 'pointer',
                      }}
                    >
                      装备
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Implant Actions */}
          {selectedImplant && (
            <div style={{
              marginTop: '12px',
              padding: '12px',
              background: 'rgba(168, 85, 247, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(168, 85, 247, 0.3)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ color: IMPLANT_RARITY_CONFIG[selectedImplant.rarity].color, fontWeight: 'bold' }}>
                  {selectedImplant.name} Lv.{selectedImplant.level}
                </div>
                <button
                  onClick={() => handleToggleLock(selectedImplant.id)}
                  disabled={gameManager.equippedImplants[selectedImplant.type] === selectedImplant.id}
                  style={{
                    padding: '4px 8px',
                    background: selectedImplant.locked ? 'rgba(245, 158, 11, 0.3)' : 'rgba(100, 100, 100, 0.2)',
                    border: selectedImplant.locked ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(100, 100, 100, 0.3)',
                    borderRadius: '4px',
                    color: selectedImplant.locked ? '#f59e0b' : '#a1a1aa',
                    fontSize: '10px',
                    cursor: gameManager.equippedImplants[selectedImplant.type] === selectedImplant.id ? 'not-allowed' : 'pointer',
                  }}
                >
                  {selectedImplant.locked ? '🔒 已锁定' : '🔓 未锁定'}
                </button>
              </div>
              <div style={{ color: '#a1a1aa', fontSize: '11px', marginBottom: '8px' }}>
                {selectedImplant.description}
              </div>
              <div style={{ color: '#a1a1aa', fontSize: '11px', marginBottom: '8px' }}>
                属性: {Object.entries(getImplantStats(selectedImplant)).map(([k, v]) => {
                  const statNames: Record<string, string> = {
                    attack: '攻击',
                    defense: '防御',
                    hp: '生命',
                    speed: '速度',
                    critRate: '暴击率',
                    critDamage: '暴击伤害',
                  };
                  return `${statNames[k] || k}+${v}`;
                }).join(' / ')}
              </div>
              {selectedImplant.specialEffect && (
                <div style={{
                  color: '#00d4ff',
                  fontSize: '11px',
                  marginBottom: '8px',
                  padding: '6px 8px',
                  background: 'rgba(0, 212, 255, 0.1)',
                  borderRadius: '6px',
                  border: '1px solid rgba(0, 212, 255, 0.3)',
                }}>
                  ✨ {selectedImplant.specialEffect.name}: {selectedImplant.specialEffect.description}
                </div>
              )}
              {/* 升级费用和分解奖励 */}
              {selectedImplant.level < selectedImplant.maxLevel && (() => {
                const upgradeCost = getImplantUpgradeCost(selectedImplant);
                const canAfford = gameManager.trainCoins >= upgradeCost.credits &&
                  upgradeCost.materials.every(m => gameManager.inventory.hasItem(m.itemId, m.count));
                return (
                  <div style={{ color: '#a1a1aa', fontSize: '10px', marginBottom: '8px', padding: '6px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
                    升级费用: {upgradeCost.credits}信用点 + {upgradeCost.materials.map(m => `${m.count}义体材料`).join(' + ')}
                    {!canAfford && <span style={{ color: '#ef4444', marginLeft: '4px' }}>(材料不足)</span>}
                  </div>
                );
              })()}
              {selectedImplant.locked ? null : (() => {
                const rarityIndex = Object.keys(ImplantRarity).indexOf(selectedImplant.rarity);
                const creditsReward = 200 * (rarityIndex + 1) * selectedImplant.level;
                const materialReward = 2 + rarityIndex * 2 + Math.floor(selectedImplant.level / 3);
                return (
                  <div style={{ color: '#a1a1aa', fontSize: '10px', marginBottom: '8px', padding: '6px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
                    分解获得: {creditsReward}信用点 + {materialReward}义体材料
                  </div>
                );
              })()}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleUpgrade(selectedImplant.id)}
                  disabled={selectedImplant.level >= selectedImplant.maxLevel}
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: selectedImplant.level >= selectedImplant.maxLevel ? 'rgba(100, 100, 100, 0.3)' : 'linear-gradient(135deg, #a855f7, #7c3aed)',
                    border: 'none',
                    borderRadius: '6px',
                    color: selectedImplant.level >= selectedImplant.maxLevel ? '#666' : '#fff',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    cursor: selectedImplant.level >= selectedImplant.maxLevel ? 'not-allowed' : 'pointer',
                  }}
                >
                  {selectedImplant.level >= selectedImplant.maxLevel ? '已满级' : '升级'}
                </button>
                <button
                  onClick={() => handleDecompose(selectedImplant.id)}
                  disabled={selectedImplant.locked}
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: selectedImplant.locked ? 'rgba(100, 100, 100, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    border: selectedImplant.locked ? '1px solid rgba(100, 100, 100, 0.3)' : '1px solid rgba(239, 68, 68, 0.4)',
                    borderRadius: '6px',
                    color: selectedImplant.locked ? '#666' : '#f87171',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    cursor: selectedImplant.locked ? 'not-allowed' : 'pointer',
                  }}
                >
                  分解
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Craft Tab */}
      {activeTab === 'craft' && (
        <div>
          <div style={{ color: '#a1a1aa', fontSize: '12px', marginBottom: '8px' }}>
            研发等级: Lv.{level} | 选择部位制造义体
          </div>

          {/* 类型选择 */}
          {!selectedCraftType && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {Object.values(ImplantType).map(type => {
                const typeConfig = IMPLANT_TYPE_CONFIG[type];
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedCraftType(type)}
                    style={{
                      padding: '16px',
                      background: `linear-gradient(135deg, ${typeConfig.color}30, ${typeConfig.color}10)`,
                      border: `1px solid ${typeConfig.color}50`,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span style={{ fontSize: '28px' }}>{typeConfig.icon}</span>
                    <span style={{ color: typeConfig.color, fontWeight: 'bold', fontSize: '14px' }}>
                      {typeConfig.name}
                    </span>
                    <span style={{ color: '#a1a1aa', fontSize: '10px', textAlign: 'center' }}>
                      {typeConfig.description}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* 品质选择 */}
          {selectedCraftType && (
            <div>
              <button
                onClick={() => setSelectedCraftType(null)}
                style={{
                  marginBottom: '12px',
                  padding: '8px 16px',
                  background: 'rgba(100, 100, 100, 0.2)',
                  border: '1px solid rgba(100, 100, 100, 0.3)',
                  borderRadius: '8px',
                  color: '#a1a1aa',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                ← 返回选择部位
              </button>

              <div style={{
                textAlign: 'center',
                marginBottom: '12px',
                padding: '12px',
                background: `${IMPLANT_TYPE_CONFIG[selectedCraftType].color}20`,
                borderRadius: '8px',
                border: `1px solid ${IMPLANT_TYPE_CONFIG[selectedCraftType].color}40`,
              }}>
                <span style={{ fontSize: '24px' }}>{IMPLANT_TYPE_CONFIG[selectedCraftType].icon}</span>
                <div style={{ color: IMPLANT_TYPE_CONFIG[selectedCraftType].color, fontWeight: 'bold', fontSize: '16px' }}>
                  {IMPLANT_TYPE_CONFIG[selectedCraftType].name}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.values(ImplantRarity).map(rarity => {
                  const rarityConfig = IMPLANT_RARITY_CONFIG[rarity];
                  const costs = {
                    [ImplantRarity.RARE]: { credits: 2000, materials: 12 },
                    [ImplantRarity.EPIC]: { credits: 5000, materials: 20 },
                    [ImplantRarity.LEGENDARY]: { credits: 10000, materials: 30 },
                  };
                  const cost = costs[rarity];
                  const isCraftable = craftableRarities.includes(rarity);
                  const canAfford = gameManager.trainCoins >= cost.credits &&
                    gameManager.inventory.hasItem('cyber_material', cost.materials);
                  const requiredLevel = rarity === ImplantRarity.EPIC ? 2 : rarity === ImplantRarity.LEGENDARY ? 3 : 1;

                  return (
                    <div
                      key={rarity}
                      style={{
                        padding: '12px',
                        background: `linear-gradient(135deg, ${rarityConfig.color}${isCraftable ? '30' : '10'}, ${rarityConfig.color}${isCraftable ? '15' : '05'})`,
                        border: `1px solid ${rarityConfig.color}${isCraftable ? '50' : '20'}`,
                        borderRadius: '12px',
                        opacity: isCraftable ? 1 : 0.5,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ color: rarityConfig.color, fontWeight: 'bold', fontSize: '14px' }}>
                          {rarityConfig.name}
                        </span>
                        {!isCraftable && (
                          <span style={{ color: '#ef4444', fontSize: '10px', background: 'rgba(239, 68, 68, 0.2)', padding: '2px 6px', borderRadius: '4px' }}>
                            需要Lv.{requiredLevel}
                          </span>
                        )}
                      </div>
                      <div style={{ color: '#a1a1aa', fontSize: '11px', marginBottom: '8px' }}>
                        信用点:{cost.credits} | 义体材料:{cost.materials}
                      </div>
                      <button
                        onClick={() => handleCraft(selectedCraftType, rarity)}
                        disabled={!isCraftable || !canAfford}
                        style={{
                          width: '100%',
                          padding: '8px',
                          background: !isCraftable ? 'rgba(100, 100, 100, 0.3)' :
                            canAfford ? `linear-gradient(135deg, ${rarityConfig.color}, ${rarityConfig.color}80)` : 'rgba(100, 100, 100, 0.3)',
                          border: 'none',
                          borderRadius: '8px',
                          color: !isCraftable || !canAfford ? '#666' : '#fff',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          cursor: !isCraftable || !canAfford ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {!isCraftable ? `需要研发等级Lv.${requiredLevel}` : canAfford ? '制造' : '材料不足'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 11. 星际市场内容
function MarketContent() {
  const { gameManager, saveGame, getMarketListings, getPlayerListings, listMarketItem, cancelMarketListing, buyMarketItem, refreshMarket } = useGameStore();
  const [activeTab, setActiveTab] = useState<'buy' | 'sell' | 'my'>('buy');
  const [selectedItem, setSelectedItem] = useState<{ id: string; name: string; quantity: number } | null>(null);
  const [sellPrice, setSellPrice] = useState(100);
  const [sellQuantity, setSellQuantity] = useState(1);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const listings = getMarketListings();
  const myListings = getPlayerListings();
  const level = gameManager.getFacilityLevel(FacilityType.MARKET);

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleBuy = async (listingId: string) => {
    const result = buyMarketItem(listingId);
    if (result.success) {
      showMessage(result.message, 'success');
      await saveGame();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const handleSell = async () => {
    if (!selectedItem) return;
    const result = listMarketItem(selectedItem.id, sellQuantity, sellPrice);
    if (result.success) {
      showMessage('挂单成功', 'success');
      setSelectedItem(null);
      await saveGame();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const handleCancel = async (listingId: string) => {
    const result = cancelMarketListing(listingId);
    if (result.success) {
      showMessage(result.message, 'success');
      await saveGame();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const handleRefresh = async () => {
    const result = refreshMarket();
    showMessage(result.message, 'success');
    await saveGame();
  };

  const inventoryItems = gameManager.inventory.items.filter(i => i.quantity > 0);

  return (
    <div>
      {/* Message Toast */}
      {message && (
        <div style={{
          position: 'absolute',
          top: '-40px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '8px 16px',
          borderRadius: '8px',
          background: message.type === 'success' ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '12px',
          zIndex: 100,
          whiteSpace: 'nowrap',
        }}>
          {message.text}
        </div>
      )}

      {/* Stats */}
      <div style={{
        background: 'rgba(236, 72, 153, 0.1)',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '12px',
        border: '1px solid rgba(236, 72, 153, 0.2)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
          <div>
            <span style={{ color: '#a1a1aa' }}>市场等级: </span>
            <span style={{ color: '#ec4899', fontWeight: 'bold' }}>Lv.{level}</span>
          </div>
          <div>
            <span style={{ color: '#a1a1aa' }}>我的挂单: </span>
            <span style={{ color: '#ec4899', fontWeight: 'bold' }}>{myListings.length}/10</span>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '12px',
      }}>
        <button
          onClick={() => setActiveTab('buy')}
          style={{
            flex: 1,
            padding: '10px',
            background: activeTab === 'buy' ? 'rgba(236, 72, 153, 0.3)' : 'rgba(255, 255, 255, 0.05)',
            border: activeTab === 'buy' ? '1px solid rgba(236, 72, 153, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: activeTab === 'buy' ? '#ec4899' : '#a1a1aa',
            fontWeight: 'bold',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          🛒 购买
        </button>
        <button
          onClick={() => setActiveTab('sell')}
          style={{
            flex: 1,
            padding: '10px',
            background: activeTab === 'sell' ? 'rgba(236, 72, 153, 0.3)' : 'rgba(255, 255, 255, 0.05)',
            border: activeTab === 'sell' ? '1px solid rgba(236, 72, 153, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: activeTab === 'sell' ? '#ec4899' : '#a1a1aa',
            fontWeight: 'bold',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          💰 出售
        </button>
        <button
          onClick={() => setActiveTab('my')}
          style={{
            flex: 1,
            padding: '10px',
            background: activeTab === 'my' ? 'rgba(236, 72, 153, 0.3)' : 'rgba(255, 255, 255, 0.05)',
            border: activeTab === 'my' ? '1px solid rgba(236, 72, 153, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: activeTab === 'my' ? '#ec4899' : '#a1a1aa',
            fontWeight: 'bold',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          📋 我的挂单
        </button>
      </div>

      {/* Buy Tab */}
      {activeTab === 'buy' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
            <button
              onClick={handleRefresh}
              style={{
                padding: '6px 12px',
                background: 'rgba(236, 72, 153, 0.2)',
                border: '1px solid rgba(236, 72, 153, 0.4)',
                borderRadius: '6px',
                color: '#ec4899',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              🔄 刷新市场
            </button>
          </div>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {listings.map(listing => {
              const typeConfig = MARKET_ITEM_TYPE_CONFIG[listing.itemType];
              const rarityConfig = MARKET_RARITY_CONFIG[listing.rarity];
              const totalPrice = listing.price * listing.quantity;

              return (
                <div
                  key={listing.id}
                  style={{
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '12px',
                    marginBottom: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>{typeConfig.icon}</span>
                      <span style={{ color: rarityConfig.color, fontWeight: 'bold', fontSize: '13px' }}>
                        {listing.itemName}
                      </span>
                      <span style={{ color: '#a1a1aa', fontSize: '11px' }}>x{listing.quantity}</span>
                    </div>
                    <span style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 'bold' }}>
                      💰 {totalPrice}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: '#a1a1aa', fontSize: '11px' }}>
                      卖家: {listing.seller} | 单价: {listing.price}
                    </div>
                    <button
                      onClick={() => handleBuy(listing.id)}
                      style={{
                        padding: '6px 12px',
                        background: 'linear-gradient(135deg, #ec4899, #db2777)',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#fff',
                        fontSize: '11px',
                        cursor: 'pointer',
                      }}
                    >
                      购买
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sell Tab */}
      {activeTab === 'sell' && (
        <div>
          <div style={{ color: '#a1a1aa', fontSize: '12px', marginBottom: '8px' }}>
            选择要出售的物品
          </div>
          <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '12px' }}>
            {inventoryItems.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedItem({ id: item.id, name: item.name, quantity: item.quantity });
                  setSellQuantity(1);
                }}
                style={{
                  padding: '10px',
                  background: selectedItem?.id === item.id ? 'rgba(236, 72, 153, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '8px',
                  marginBottom: '6px',
                  border: `1px solid ${selectedItem?.id === item.id ? 'rgba(236, 72, 153, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#fff', fontSize: '12px' }}>{item.name}</span>
                  <span style={{ color: '#a1a1aa', fontSize: '11px' }}>x{item.quantity}</span>
                </div>
              </div>
            ))}
          </div>

          {selectedItem && (
            <div style={{
              padding: '12px',
              background: 'rgba(236, 72, 153, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(236, 72, 153, 0.3)',
            }}>
              <div style={{ color: '#ec4899', fontWeight: 'bold', marginBottom: '12px' }}>
                出售 {selectedItem.name}
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ color: '#a1a1aa', fontSize: '11px', marginBottom: '4px' }}>数量</div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    onClick={() => setSellQuantity(Math.max(1, sellQuantity - 1))}
                    style={{
                      padding: '4px 8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '4px',
                      color: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    -
                  </button>
                  <span style={{ color: '#fff', fontSize: '14px' }}>{sellQuantity}</span>
                  <button
                    onClick={() => setSellQuantity(Math.min(selectedItem.quantity, sellQuantity + 1))}
                    style={{
                      padding: '4px 8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '4px',
                      color: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ color: '#a1a1aa', fontSize: '11px', marginBottom: '4px' }}>单价</div>
                <input
                  type="number"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '14px',
                  }}
                />
              </div>
              <div style={{ color: '#a1a1aa', fontSize: '11px', marginBottom: '12px' }}>
                总价: <span style={{ color: '#fbbf24' }}>{sellPrice * sellQuantity}</span> 信用点
                (手续费: {Math.floor(sellPrice * sellQuantity * 0.05)})
              </div>
              <button
                onClick={handleSell}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'linear-gradient(135deg, #ec4899, #db2777)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                确认挂单
              </button>
            </div>
          )}
        </div>
      )}

      {/* My Listings Tab */}
      {activeTab === 'my' && (
        <div>
          {myListings.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '30px 20px',
              color: '#666',
            }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
              <div>暂无挂单</div>
            </div>
          ) : (
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {myListings.map(listing => {
                const typeConfig = MARKET_ITEM_TYPE_CONFIG[listing.itemType];
                const rarityConfig = MARKET_RARITY_CONFIG[listing.rarity];

                return (
                  <div
                    key={listing.id}
                    style={{
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '12px',
                      marginBottom: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px' }}>{typeConfig.icon}</span>
                        <span style={{ color: rarityConfig.color, fontWeight: 'bold', fontSize: '13px' }}>
                          {listing.itemName}
                        </span>
                        <span style={{ color: '#a1a1aa', fontSize: '11px' }}>x{listing.quantity}</span>
                      </div>
                      <span style={{ color: '#fbbf24', fontSize: '12px' }}>
                        💰 {listing.price * listing.quantity}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ color: '#a1a1aa', fontSize: '11px' }}>
                        单价: {listing.price}
                      </div>
                      <button
                        onClick={() => handleCancel(listing.id)}
                        style={{
                          padding: '6px 12px',
                          background: 'rgba(239, 68, 68, 0.2)',
                          border: '1px solid rgba(239, 68, 68, 0.4)',
                          borderRadius: '6px',
                          color: '#f87171',
                          fontSize: '11px',
                          cursor: 'pointer',
                        }}
                      >
                        取消挂单
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 12. 遗迹探索内容
function RuinsContent() {
  const { gameManager, saveGame, getRuins, getExploreMissions, startExplore, completeExplore, cancelExplore } = useGameStore();
  const [activeTab, setActiveTab] = useState<'ruins' | 'missions'>('ruins');
  const [selectedRuin, setSelectedRuin] = useState<Ruin | null>(null);
  const [selectedCrew, setSelectedCrew] = useState<string[]>([]);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const ruins = getRuins();
  const missions = getExploreMissions();
  const crewMembers = gameManager.getCrewMembers();

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleStartExplore = async () => {
    if (!selectedRuin) return;
    const result = startExplore(selectedRuin.id, selectedCrew);
    if (result.success) {
      showMessage('探索已开始', 'success');
      setSelectedRuin(null);
      setSelectedCrew([]);
      await saveGame();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const handleCompleteExplore = async (missionId: string) => {
    const result = completeExplore(missionId);
    if (result.success) {
      const rewardsText = result.rewards
        ? `获得 ${result.rewards.credits}信用点${result.rewards.items.length > 0 ? ' 和物品' : ''}`
        : '';
      showMessage(`${result.message} ${rewardsText}`, 'success');
      await saveGame();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const handleCancelExplore = async (missionId: string) => {
    const result = cancelExplore(missionId);
    if (result.success) {
      showMessage(result.message, 'success');
      await saveGame();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const toggleCrewSelection = (crewId: string) => {
    if (selectedCrew.includes(crewId)) {
      setSelectedCrew(selectedCrew.filter(id => id !== crewId));
    } else {
      setSelectedCrew([...selectedCrew, crewId]);
    }
  };

  const getCrewPower = () => {
    return selectedCrew.reduce((total, id) => {
      const crew = crewMembers.find(c => c.id === id);
      return total + (crew?.stats.attack || 0) + (crew?.stats.defense || 0);
    }, 0);
  };

  const isCrewAvailable = (crewId: string) => {
    return !missions.some(m => m.status === 'ongoing' && m.crewIds.includes(crewId));
  };

  return (
    <div>
      {/* Message Toast */}
      {message && (
        <div style={{
          position: 'absolute',
          top: '-40px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '8px 16px',
          borderRadius: '8px',
          background: message.type === 'success' ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '12px',
          zIndex: 100,
          whiteSpace: 'nowrap',
        }}>
          {message.text}
        </div>
      )}

      {/* Stats */}
      <div style={{
        background: 'rgba(245, 158, 11, 0.1)',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '12px',
        border: '1px solid rgba(245, 158, 11, 0.2)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
          <div>
            <span style={{ color: '#a1a1aa' }}>进行中: </span>
            <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{missions.filter(m => m.status === 'ongoing').length}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '10px' }}>
          <div>
            <span style={{ color: '#a1a1aa' }}>可探索遗迹: </span>
            <span style={{ color: '#10b981' }}>{ruins.length}个</span>
          </div>
          <div>
            <span style={{ color: '#a1a1aa' }}>芯片材料副本: </span>
            <span style={{ color: '#06b6d4' }}>{ruins.filter(r => r.type === RuinType.CHIP_FACTORY || r.type === RuinType.NEURAL_NEXUS).length}个</span>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '12px',
      }}>
        <button
          onClick={() => setActiveTab('ruins')}
          style={{
            flex: 1,
            padding: '10px',
            background: activeTab === 'ruins' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(255, 255, 255, 0.05)',
            border: activeTab === 'ruins' ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: activeTab === 'ruins' ? '#f59e0b' : '#a1a1aa',
            fontWeight: 'bold',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          🏛️ 遗迹列表
        </button>
        <button
          onClick={() => setActiveTab('missions')}
          style={{
            flex: 1,
            padding: '10px',
            background: activeTab === 'missions' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(255, 255, 255, 0.05)',
            border: activeTab === 'missions' ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: activeTab === 'missions' ? '#f59e0b' : '#a1a1aa',
            fontWeight: 'bold',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          ⏱️ 探索任务
        </button>
      </div>

      {/* Ruins Tab */}
      {activeTab === 'ruins' && (
        <div>
          <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '12px' }}>
            {ruins.map(ruin => {
              const typeConfig = RUIN_TYPE_CONFIG[ruin.type];
              const difficultyConfig = RUIN_DIFFICULTY_CONFIG[ruin.difficulty];

              return (
                <div
                  key={ruin.id}
                  onClick={() => ruin.status === ExploreStatus.AVAILABLE && setSelectedRuin(ruin)}
                  style={{
                    padding: '12px',
                    background: selectedRuin?.id === ruin.id ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '12px',
                    marginBottom: '8px',
                    border: `1px solid ${selectedRuin?.id === ruin.id ? 'rgba(245, 158, 11, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
                    cursor: ruin.status === ExploreStatus.AVAILABLE ? 'pointer' : 'default',
                    opacity: ruin.status === ExploreStatus.EXPLORING ? 0.6 : 1,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>{typeConfig.icon}</span>
                      <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '13px' }}>{ruin.name}</span>
                    </div>
                    <span style={{ color: difficultyConfig.color, fontSize: '11px' }}>
                      {difficultyConfig.name}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: '#a1a1aa', fontSize: '11px' }}>
                      {ruin.description.slice(0, 20)}...
                    </div>
                    <div style={{ color: '#fbbf24', fontSize: '11px' }}>
                      {ruin.status === ExploreStatus.EXPLORING ? '探索中' : `已完成${ruin.completedCount}次`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Ruin Detail */}
          {selectedRuin && (
            <div style={{
              padding: '12px',
              background: 'rgba(245, 158, 11, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(245, 158, 11, 0.3)',
            }}>
              <div style={{ color: '#f59e0b', fontWeight: 'bold', marginBottom: '8px' }}>
                {selectedRuin.name}
              </div>
              <div style={{ color: '#a1a1aa', fontSize: '11px', marginBottom: '8px' }}>
                {selectedRuin.description}
              </div>
              <div style={{ color: '#a1a1aa', fontSize: '11px', marginBottom: '8px' }}>
                探索时长: {formatExploreTime(selectedRuin.duration)}
              </div>
              <div style={{ color: '#a1a1aa', fontSize: '11px', marginBottom: '12px' }}>
                奖励: {selectedRuin.rewards.credits}信用点 + {selectedRuin.rewards.items.map(i => `${getItemName(i.itemId)} x${i.count}`).join(', ')}
              </div>

              {/* Crew Selection */}
              <div style={{ color: '#f59e0b', fontSize: '12px', marginBottom: '8px' }}>
                选择船员 ({selectedCrew.length}/4)
              </div>
              <div style={{ maxHeight: '120px', overflowY: 'auto', marginBottom: '12px' }}>
                {crewMembers.slice(0, 8).map(crew => {
                  const available = isCrewAvailable(crew.id);
                  const selected = selectedCrew.includes(crew.id);

                  return (
                    <div
                      key={crew.id}
                      onClick={() => available && toggleCrewSelection(crew.id)}
                      style={{
                        padding: '8px',
                        background: selected ? 'rgba(245, 158, 11, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '6px',
                        marginBottom: '4px',
                        border: `1px solid ${selected ? 'rgba(245, 158, 11, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                        cursor: available ? 'pointer' : 'not-allowed',
                        opacity: available ? 1 : 0.5,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ color: '#fff', fontSize: '11px' }}>{crew.name}</span>
                      <span style={{ color: '#a1a1aa', fontSize: '10px' }}>
                        攻:{crew.stats.attack} 防:{crew.stats.defense}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Success Rate */}
              {selectedCrew.length > 0 && (
                <div style={{ color: '#a1a1aa', fontSize: '11px', marginBottom: '12px' }}>
                  成功率: <span style={{ color: '#22c55e' }}>{calculateExploreSuccess(getCrewPower(), selectedRuin.difficulty).toFixed(1)}%</span>
                </div>
              )}

              <button
                onClick={handleStartExplore}
                disabled={selectedCrew.length === 0}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: selectedCrew.length > 0 ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(100, 100, 100, 0.3)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  cursor: selectedCrew.length > 0 ? 'pointer' : 'not-allowed',
                }}
              >
                开始探索
              </button>
            </div>
          )}
        </div>
      )}

      {/* Missions Tab */}
      {activeTab === 'missions' && (
        <div>
          {missions.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '30px 20px',
              color: '#666',
            }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>⏱️</div>
              <div>暂无探索任务</div>
            </div>
          ) : (
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {missions.map(mission => {
                const ruin = ruins.find(r => r.id === mission.ruinId);
                const typeConfig = ruin ? RUIN_TYPE_CONFIG[ruin.type] : null;
                const remaining = getRemainingExploreTime(mission);
                const isComplete = remaining === 0;

                return (
                  <div
                    key={mission.id}
                    style={{
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '12px',
                      marginBottom: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px' }}>{typeConfig?.icon || '🏛️'}</span>
                        <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '13px' }}>
                          {ruin?.name || '未知遗迹'}
                        </span>
                      </div>
                      <span style={{
                        color: isComplete ? '#22c55e' : '#f59e0b',
                        fontSize: '11px',
                        fontWeight: 'bold',
                      }}>
                        {isComplete ? '已完成' : formatExploreTime(remaining)}
                      </span>
                    </div>
                    <div style={{ color: '#a1a1aa', fontSize: '11px', marginBottom: '8px' }}>
                      派遣船员: {mission.crewIds.length}人
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {isComplete ? (
                        <button
                          onClick={() => handleCompleteExplore(mission.id)}
                          style={{
                            flex: 1,
                            padding: '8px',
                            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                            border: 'none',
                            borderRadius: '6px',
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: '11px',
                            cursor: 'pointer',
                          }}
                        >
                          领取奖励
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCancelExplore(mission.id)}
                          style={{
                            flex: 1,
                            padding: '8px',
                            background: 'rgba(239, 68, 68, 0.2)',
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                            borderRadius: '6px',
                            color: '#f87171',
                            fontWeight: 'bold',
                            fontSize: '11px',
                            cursor: 'pointer',
                          }}
                        >
                          取消探索
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
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
        borderRadius: '12px',
        padding: '12px',
        color: '#a1a1aa',
        fontSize: '12px',
        border: '1px solid rgba(107, 114, 128, 0.3)',
      }}>
        🔒 该功能将在后续版本开放
      </div>
    </div>
  );
}

// 芯片制作面板 - 4个图标点击后弹窗
function ChipCraftPanel({ gameManager, onCraft }: { gameManager: GameManager; onCraft: (slot: ChipSlot, rarity: ChipRarity) => void }) {
  const [selectedSlot, setSelectedSlot] = useState<ChipSlot | null>(null);

  const slots = [
    { slot: ChipSlot.SLOT_1, name: '1号位', mainStat: '生命', icon: '❤️', color: '#ef4444' },
    { slot: ChipSlot.SLOT_2, name: '2号位', mainStat: '攻击', icon: '⚔️', color: '#f59e0b' },
    { slot: ChipSlot.SLOT_3, name: '3号位', mainStat: '随机', icon: '🎲', color: '#3b82f6' },
    { slot: ChipSlot.SLOT_4, name: '4号位', mainStat: '随机', icon: '🎲', color: '#22c55e' },
  ];

  return (
    <div>
      <div style={{ color: '#a1a1aa', fontSize: '12px', marginBottom: '12px' }}>
        点击图标选择槽位制作芯片
      </div>

      {/* 4个槽位图标 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        marginBottom: '16px',
      }}>
        {slots.map(({ slot, name, mainStat, icon, color }) => (
          <button
            key={slot}
            onClick={() => setSelectedSlot(slot)}
            style={{
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: `2px solid ${color}40`,
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${color}20`;
              e.currentTarget.style.borderColor = `${color}80`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = `${color}40`;
            }}
          >
            <span style={{ fontSize: '32px' }}>{icon}</span>
            <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>{name}</span>
            <span style={{ color, fontSize: '11px' }}>{mainStat}主属性</span>
          </button>
        ))}
      </div>

      {/* 制作弹窗 */}
      {selectedSlot && (
        <ChipCraftModal
          slot={selectedSlot}
          gameManager={gameManager}
          onCraft={onCraft}
          onClose={() => setSelectedSlot(null)}
        />
      )}
    </div>
  );
}

// 芯片制作弹窗
function ChipCraftModal({ slot, gameManager, onCraft, onClose }: {
  slot: ChipSlot;
  gameManager: GameManager;
  onCraft: (slot: ChipSlot, rarity: ChipRarity) => void;
  onClose: () => void;
}) {
  const slotNames: Record<ChipSlot, string> = {
    [ChipSlot.SLOT_1]: '生命',
    [ChipSlot.SLOT_2]: '攻击',
    [ChipSlot.SLOT_3]: '随机',
    [ChipSlot.SLOT_4]: '随机',
  };

  const slotIcons: Record<ChipSlot, string> = {
    [ChipSlot.SLOT_1]: '❤️',
    [ChipSlot.SLOT_2]: '⚔️',
    [ChipSlot.SLOT_3]: '🎲',
    [ChipSlot.SLOT_4]: '🎲',
  };

  const chipLevel = gameManager.getChipLevel();
  const craftableRarities = gameManager.getCraftableRarities();

  const handleCraft = (rarity: ChipRarity) => {
    onCraft(slot, rarity);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* 头部 */}
      <div style={{
        background: 'linear-gradient(180deg, #00d4ff30, #00d4ff10)',
        padding: '16px 20px',
        borderBottom: '1px solid #00d4ff50',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            color: '#a1a1aa',
            fontSize: '14px',
            cursor: 'pointer',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          ← 返回
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{
            color: '#00d4ff',
            fontSize: '18px',
            fontWeight: 'bold',
            margin: 0,
          }}>
            {slotIcons[slot]} 制作{slot}号位芯片
          </h2>
          <div style={{ color: '#a1a1aa', fontSize: '12px', marginTop: '2px' }}>
            主属性: {slotNames[slot]} | 研发等级: Lv.{chipLevel}
          </div>
        </div>
      </div>

      {/* 品质选择 */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 20px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.values(ChipRarity).map(rarity => {
            const cost = CHIP_CRAFT_COST[rarity];
            const isCraftable = craftableRarities.includes(rarity);
            const canAfford = isCraftable && gameManager.trainCoins >= cost.credits &&
              cost.materials.every((m: { itemId: string; count: number }) => gameManager.inventory.hasItem(m.itemId, m.count));
            const requiredLevel = rarity === ChipRarity.EPIC ? 2 : rarity === ChipRarity.LEGENDARY ? 3 : 1;

            return (
              <div
                key={rarity}
                style={{
                  padding: '16px',
                  background: `linear-gradient(135deg, ${CHIP_RARITY_CONFIG[rarity].color}15, ${CHIP_RARITY_CONFIG[rarity].color}05)`,
                  borderRadius: '12px',
                  border: `1px solid ${CHIP_RARITY_CONFIG[rarity].color}50`,
                  opacity: isCraftable ? 1 : 0.5,
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}>
                  <span style={{
                    color: CHIP_RARITY_CONFIG[rarity].color,
                    fontWeight: 'bold',
                    fontSize: '16px',
                  }}>
                    {CHIP_RARITY_CONFIG[rarity].name}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {!isCraftable && (
                      <span style={{
                        color: '#ef4444',
                        fontSize: '11px',
                        background: 'rgba(239, 68, 68, 0.2)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                      }}>
                        需要Lv.{requiredLevel}
                      </span>
                    )}
                    <span style={{
                      color: '#a1a1aa',
                      fontSize: '11px',
                      background: 'rgba(255,255,255,0.1)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                    }}>
                      强化上限: {CHIP_RARITY_CONFIG[rarity].maxEnhance}次
                    </span>
                  </div>
                </div>

                {/* 材料需求 */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  marginBottom: '16px',
                  fontSize: '12px',
                }}>
                  {/* 信用点 */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '8px',
                  }}>
                    <span style={{ fontSize: '16px' }}>💰</span>
                    <span style={{
                      color: gameManager.trainCoins >= cost.credits ? '#fbbf24' : '#ef4444',
                      fontWeight: 'bold',
                    }}>
                      {cost.credits.toLocaleString()}
                    </span>
                    <span style={{ color: '#6b7280', marginLeft: 'auto' }}>
                      拥有: {gameManager.trainCoins.toLocaleString()}
                    </span>
                  </div>

                  {/* 材料列表 */}
                  {cost.materials.map((m: { itemId: string; count: number }, idx: number) => {
                    const hasEnough = gameManager.inventory.hasItem(m.itemId, m.count);
                    const currentCount = gameManager.inventory.getItem(m.itemId)?.quantity || 0;
                    const itemName = getItemName(m.itemId);
                    return (
                      <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        background: 'rgba(0,0,0,0.3)',
                        borderRadius: '8px',
                      }}>
                        <span style={{ fontSize: '16px' }}>📦</span>
                        <span style={{
                          color: hasEnough ? '#10b981' : '#ef4444',
                          fontWeight: hasEnough ? 'normal' : 'bold',
                        }}>
                          {itemName}
                        </span>
                        <span style={{
                          color: hasEnough ? '#10b981' : '#ef4444',
                          marginLeft: 'auto',
                        }}>
                          {currentCount} / {m.count}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => handleCraft(rarity)}
                  disabled={!canAfford}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: canAfford
                      ? `linear-gradient(135deg, ${CHIP_RARITY_CONFIG[rarity].color}, ${CHIP_RARITY_CONFIG[rarity].color}80)`
                      : 'rgba(100, 100, 100, 0.2)',
                    border: 'none',
                    borderRadius: '10px',
                    color: canAfford ? '#fff' : '#666',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    cursor: canAfford ? 'pointer' : 'not-allowed',
                    boxShadow: canAfford ? `0 4px 15px ${CHIP_RARITY_CONFIG[rarity].color}50` : 'none',
                  }}
                >
                  {!isCraftable ? `需要研发等级Lv.${requiredLevel}` : canAfford ? `制作${CHIP_RARITY_CONFIG[rarity].name}芯片` : '材料不足'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
