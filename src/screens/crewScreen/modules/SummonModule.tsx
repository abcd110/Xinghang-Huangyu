import { useState } from 'react';
import { CrewMember, CrewRarity, CrewRole, RARITY_CONFIG } from '../../../core/CrewSystem';
import { SummonType, SummonResult, SUMMON_CONFIG } from '../types';
import { getRandomCrewByTier, getTierByRarity, POSITION_CONFIG, PresetCrew, CrewPosition } from '../../../data/crews';
import { useGameStore } from '../../../stores/gameStore';

const RECRUIT_TICKET_ID = 'recruit_ticket_normal';

const getRarityConfig = (rarity: string) => RARITY_CONFIG[rarity as any] || RARITY_CONFIG.B;

interface SummonModuleProps {
  onSummon?: (results: SummonResult[]) => void;
  onShowMessage?: (message: string, type: 'success' | 'error') => void;
  ownedCrews?: CrewMember[];
}

export function SummonModule({ onSummon, onShowMessage, ownedCrews = [] }: SummonModuleProps) {
  const { gameManager, saveGame } = useGameStore();
  const [activeType, setActiveType] = useState<SummonType>('crew');
  const [isSummoning, setIsSummoning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [summonResults, setSummonResults] = useState<SummonResult[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [pityCount, setPityCount] = useState({ crew: 0 });
  const [hiddenPityCount, setHiddenPityCount] = useState({ crew: 0 });

  const config = SUMMON_CONFIG[activeType];
  const recruitTicketCount = gameManager.inventory.getItemCount(RECRUIT_TICKET_ID);

  const generateRandomRarity = (type: SummonType): CrewRarity => {
    const rand = Math.random();
    const probs = SUMMON_CONFIG[type].probabilities;

    if (rand < probs.S) return 'S';
    if (rand < probs.S + probs.A) return 'A';
    return 'B';
  };

  // position 到 role 的映射
  const positionToRole = (position: CrewPosition): CrewRole => {
    switch (position) {
      case 'fortress': return CrewRole.WARRIOR;
      case 'hunter': return CrewRole.SCOUT;
      case 'medic': return CrewRole.MEDIC;
      case 'support': return CrewRole.ENGINEER;
      case 'hacker': return CrewRole.TECHNICIAN;
    }
  };

  const generateSummonResult = (type: SummonType, currentResults: SummonResult[] = [], rarityOverride?: CrewRarity): SummonResult => {
    const rarity = rarityOverride || generateRandomRarity(type);

    // 根据稀有度获取对应级别的预设船员
    const tier = getTierByRarity(rarity);
    const presetCrew = getRandomCrewByTier(tier);

    // 检查是否已拥有该船员（包括已拥有的和本次召唤中已获得的）
    const isOwned = ownedCrews.some(c => c.id === presetCrew.id || c.name === presetCrew.name);
    const isInCurrentBatch = currentResults.some(
      r => r.type === 'crew' && (r.item as CrewMember).name === presetCrew.name
    );
    const isDuplicate = isOwned || isInCurrentBatch;

    const crew: CrewMember = {
      id: isDuplicate ? `${presetCrew.id}_${Date.now()}` : presetCrew.id,
      crewDefId: presetCrew.id,
      name: presetCrew.name,
      portrait: presetCrew.portrait,
      rarity,
      role: positionToRole(presetCrew.position),
      level: 1,
      stats: { ...presetCrew.baseStats },
      battleSlot: 0,
      position: presetCrew.position,
      tier: presetCrew.tier,
      background: presetCrew.background,
      star: 0,
      skillLevels: { basic: 1, skill: 1, ultimate: 1, talent: 1 },
    };

    return {
      type: 'crew',
      item: crew,
      isDuplicate,
      convertedEssence: isDuplicate ? 10 : undefined,
    };
  };

  const handleSummon = async (tenPull: boolean) => {
    if (isSummoning) return;

    const count = tenPull ? 10 : 1;

    if (recruitTicketCount < count) {
      onShowMessage?.(`招募票不足！需要 ${count} 张，当前拥有 ${recruitTicketCount} 张`, 'error');
      return;
    }

    setIsSummoning(true);

    gameManager.inventory.removeItem(RECRUIT_TICKET_ID, count);
    const results: SummonResult[] = [];

    // 检查是否触发S级保底
    const currentPity = pityCount[activeType];
    const threshold = SUMMON_CONFIG[activeType].pityThreshold;
    const shouldTriggerPity = currentPity >= threshold;

    // 检查是否触发A级保底（召唤开始前检查）
    const currentHiddenPity = hiddenPityCount[activeType];
    const hiddenThreshold = SUMMON_CONFIG[activeType].hiddenPityThreshold || 10;
    const shouldTriggerHiddenPity = currentHiddenPity >= hiddenThreshold;

    // 标记A级保底是否已使用
    let hiddenPityUsed = false;

    // 模拟召唤动画延迟
    for (let i = 0; i < count; i++) {
      await new Promise((resolve) => setTimeout(resolve, 200));

      // 优先级：S级保底 > A级保底 > 普通随机
      let rarity: CrewRarity;
      if (i === 0 && shouldTriggerPity) {
        // S级保底（仅第一抽）
        rarity = SUMMON_CONFIG[activeType].guaranteedRarity;
      } else if (shouldTriggerHiddenPity && !hiddenPityUsed) {
        // A级保底（仅触发一次）
        rarity = SUMMON_CONFIG[activeType].hiddenGuaranteedRarity || 'A';
        hiddenPityUsed = true;
      } else {
        // 普通随机
        rarity = generateRandomRarity(activeType);
      }

      results.push(generateSummonResult(activeType, results, rarity));
    }

    setSummonResults(results);
    setCurrentResultIndex(0);
    setShowResult(true);
    setIsSummoning(false);

    // 更新S级保底计数
    setPityCount((prev) => ({
      ...prev,
      [activeType]: shouldTriggerPity ? count - 1 : prev[activeType] + count,
    }));

    // 更新A级隐藏保底计数
    // 检查本次召唤中是否获得了A级或更高级的角色
    const gotAOrBetter = results.some(r => {
      const itemRarity = (r.item as any).rarity;
      return itemRarity === 'A' || itemRarity === 'S';
    });
    setHiddenPityCount((prev) => ({
      ...prev,
      [activeType]: gotAOrBetter ? 0 : prev[activeType] + count,
    }));

    results.forEach(result => {
      if (result.isDuplicate && result.convertedEssence) {
        const crewName = (result.item as CrewMember).name;
        const existingCrew = ownedCrews.find(c => c.name === crewName);
        if (existingCrew) {
          existingCrew.originEssence = (existingCrew.originEssence || 0) + result.convertedEssence;
        }
      }
    });

    saveGame();

    onSummon?.(results);
  };

  const handleNextResult = () => {
    if (currentResultIndex < summonResults.length - 1) {
      setCurrentResultIndex((prev) => prev + 1);
    } else {
      setShowResult(false);
      setSummonResults([]);
    }
  };

  const currentResult = summonResults[currentResultIndex];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 召唤类型切换 */}
      <div
        style={{
          display: 'flex',
          padding: '12px',
          gap: '12px',
          borderBottom: '1px solid rgba(0, 212, 255, 0.1)',
        }}
      >
        {(Object.keys(SUMMON_CONFIG) as SummonType[]).map((type) => {
          const cfg = SUMMON_CONFIG[type];
          const isActive = activeType === type;
          return (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              style={{
                flex: 1,
                padding: '16px',
                background: isActive
                  ? `linear-gradient(135deg, ${cfg.color}40, ${cfg.color}20)`
                  : 'rgba(30, 30, 50, 0.6)',
                border: isActive ? `2px solid ${cfg.color}` : '2px solid rgba(100, 100, 100, 0.3)',
                borderRadius: '12px',
                color: isActive ? cfg.color : '#9ca3af',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '28px' }}>{cfg.icon}</span>
              <span>{cfg.name}</span>
            </button>
          );
        })}
      </div>

      {/* 召唤主区域 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          background: `linear-gradient(180deg, ${config.color}10, transparent)`,
        }}
      >
        {/* 召唤动画区域 */}
        <div
          style={{
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${config.color}30, transparent)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '30px',
            animation: isSummoning ? 'pulse 1s ease-in-out infinite' : 'none',
          }}
        >
          <span style={{ fontSize: '80px', filter: `drop-shadow(0 0 20px ${config.color})` }}>
            {config.icon}
          </span>
        </div>

        {/* 概率说明 */}
        <div
          style={{
            background: 'rgba(30, 30, 50, 0.6)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px',
            textAlign: 'center',
            border: '1px solid rgba(0, 212, 255, 0.1)',
          }}
        >
          <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '8px' }}>召唤概率</div>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <span style={{ color: '#fbbf24', fontSize: '13px' }}>
              S级 {(config.probabilities.S * 100).toFixed(1)}%
            </span>
            <span style={{ color: '#a855f7', fontSize: '13px' }}>
              A级 {(config.probabilities.A * 100).toFixed(1)}%
            </span>
            <span style={{ color: '#3b82f6', fontSize: '13px' }}>
              B级 {(config.probabilities.B * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* 保底进度 */}
        <div
          style={{
            background: 'rgba(30, 30, 50, 0.6)',
            borderRadius: '12px',
            padding: '12px 20px',
            marginBottom: '12px',
            border: '1px solid rgba(0, 212, 255, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#9ca3af', fontSize: '12px' }}>保底进度</span>
            <div
              style={{
                width: '150px',
                height: '8px',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  background: config.color,
                  width: `${(pityCount[activeType] / config.pityThreshold) * 100}%`,
                  transition: 'width 0.3s',
                }}
              />
            </div>
            <span style={{ color: config.color, fontSize: '12px', fontWeight: 'bold' }}>
              {pityCount[activeType]}/{config.pityThreshold}
            </span>
          </div>
        </div>

        {/* 招募票数量 */}
        <div
          style={{
            background: 'rgba(30, 30, 50, 0.6)',
            borderRadius: '12px',
            padding: '12px 20px',
            marginBottom: '20px',
            border: '1px solid rgba(0, 212, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '20px' }}>🎫</span>
          <span style={{ color: '#9ca3af', fontSize: '14px' }}>招募票</span>
          <span style={{ color: '#fbbf24', fontSize: '16px', fontWeight: 'bold' }}>
            {recruitTicketCount}
          </span>
        </div>

        {/* 召唤按钮 */}
        <div style={{ display: 'flex', gap: '16px', width: '100%', maxWidth: '300px' }}>
          <button
            onClick={() => handleSummon(false)}
            disabled={isSummoning || recruitTicketCount < 1}
            style={{
              flex: 1,
              padding: '16px',
              background: isSummoning || recruitTicketCount < 1 ? 'rgba(100, 100, 100, 0.3)' : `linear-gradient(135deg, ${config.color}, ${config.color}80)`,
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isSummoning || recruitTicketCount < 1 ? 'not-allowed' : 'pointer',
              boxShadow: isSummoning || recruitTicketCount < 1 ? 'none' : `0 4px 15px ${config.color}40`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>{isSummoning ? '召唤中...' : '单抽'}</span>
            <span style={{ fontSize: '12px', opacity: 0.8 }}>🎫 x1</span>
          </button>
          <button
            onClick={() => handleSummon(true)}
            disabled={isSummoning || recruitTicketCount < 10}
            style={{
              flex: 1,
              padding: '16px',
              background: isSummoning || recruitTicketCount < 10
                ? 'rgba(100, 100, 100, 0.3)'
                : `linear-gradient(135deg, ${config.color}80, ${config.color}40)`,
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isSummoning || recruitTicketCount < 10 ? 'not-allowed' : 'pointer',
              boxShadow: isSummoning || recruitTicketCount < 10 ? 'none' : `0 4px 15px ${config.color}40`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>{isSummoning ? '召唤中...' : '十连'}</span>
            <span style={{ fontSize: '12px', opacity: 0.8 }}>🎫 x10</span>
          </button>
        </div>
      </div>

      {/* 召唤结果弹窗 */}
      {showResult && currentResult && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={handleNextResult}
        >
          <div
            style={{
              background: `linear-gradient(180deg, ${getRarityConfig((currentResult.item as any).rarity).color}30, rgba(0, 15, 30, 0.98))`,
              borderRadius: '20px',
              padding: '30px',
              maxWidth: '320px',
              width: '100%',
              border: `2px solid ${getRarityConfig((currentResult.item as any).rarity).color}`,
              boxShadow: `0 0 40px ${getRarityConfig((currentResult.item as any).rarity).color}40`,
              textAlign: 'center',
              animation: 'fadeIn 0.3s ease-out',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 稀有度标签 */}
            <div
              style={{
                color: getRarityConfig((currentResult.item as any).rarity).color,
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '16px',
                letterSpacing: '2px',
              }}
            >
              {getRarityConfig((currentResult.item as any).rarity).name}
            </div>

            {/* 物品图标 */}
            <div
              style={{
                width: '150px',
                height: '150px',
                margin: '0 auto 20px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${getRarityConfig((currentResult.item as any).rarity).color}40, ${getRarityConfig((currentResult.item as any).rarity).color}10)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `3px solid ${getRarityConfig((currentResult.item as any).rarity).color}`,
                boxShadow: `0 0 30px ${getRarityConfig((currentResult.item as any).rarity).color}30`,
              }}
            >
              <span style={{ fontSize: '70px' }}>{(currentResult.item as any).portrait || (currentResult.item as any).icon}</span>
            </div>

            {/* 物品名称 */}
            <div
              style={{
                color: '#fff',
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '8px',
                textShadow: `0 0 10px ${getRarityConfig((currentResult.item as any).rarity).color}`,
              }}
            >
              {currentResult.item.name}
            </div>

            {/* 重复提示 */}
            {currentResult.isDuplicate && (
              <div
                style={{
                  background: 'rgba(251, 191, 36, 0.2)',
                  border: '1px solid rgba(251, 191, 36, 0.5)',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  marginBottom: '12px',
                }}
              >
                <div style={{ color: '#fbbf24', fontSize: '12px' }}>重复获取</div>
                <div style={{ color: '#fbbf24', fontSize: '14px', fontWeight: 'bold' }}>
                  转化为本源 +{currentResult.convertedEssence}
                </div>
              </div>
            )}

            {/* 进度指示 */}
            {summonResults.length > 1 && (
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '16px' }}>
                {currentResultIndex + 1} / {summonResults.length}
              </div>
            )}

            {/* 确认按钮 */}
            <button
              onClick={handleNextResult}
              style={{
                width: '100%',
                padding: '14px',
                background: `linear-gradient(135deg, ${getRarityConfig((currentResult.item as any).rarity).color}60, ${getRarityConfig((currentResult.item as any).rarity).color}30)`,
                border: `1px solid ${getRarityConfig((currentResult.item as any).rarity).color}`,
                borderRadius: '12px',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              {currentResultIndex < summonResults.length - 1 ? '下一个' : '确认'}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
