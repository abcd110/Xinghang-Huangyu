import { useState } from 'react';
import { CrewMember } from '../../../core/CrewSystem';
import { CrewTab, ModuleConfig } from '../types';
import { PortraitPanel } from '../components/PortraitPanel';
import { DetailPanel } from '../components/DetailPanel';
import { LevelUpPanel } from '../components/LevelUpPanel';
import { AscendPanel } from '../components/AscendPanel';
import { SkillUpgradePanel } from '../components/SkillUpgradePanel';

interface CrewModuleProps {
  crew: CrewMember;
  config: ModuleConfig['crew'];
  allCrews: CrewMember[];
  onCrewUpdate?: (crew: CrewMember) => void;
  onShowMessage?: (message: string, type: 'success' | 'error') => void;
}

const TAB_CONFIG: Record<CrewTab, { label: string; icon: string; color: string }> = {
  detail: { label: '详情', icon: '📋', color: '#60a5fa' },
  levelup: { label: '升级', icon: '⬆️', color: '#22c55e' },
  ascend: { label: '突破', icon: '⭐', color: '#f59e0b' },
  story: { label: '故事', icon: '📖', color: '#9ca3af' },
  skill: { label: '技能', icon: '⚔️', color: '#a855f7' },
};

export function CrewModule({ crew, config, allCrews, onCrewUpdate, onShowMessage }: CrewModuleProps) {
  const [activeTab, setActiveTab] = useState<CrewTab>(config.tabs[0] || 'detail');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'detail':
        return <DetailPanel crew={crew} />;
      case 'levelup':
        return (
          <LevelUpPanel
            crew={crew}
            onLevelUp={(newCrew) => {
              onCrewUpdate?.(newCrew);
              onShowMessage?.('升级成功！', 'success');
            }}
          />
        );
      case 'ascend':
        return (
          <AscendPanel
            crew={crew}
            onAscend={(newCrew) => {
              onCrewUpdate?.(newCrew);
              onShowMessage?.('突破成功！', 'success');
            }}
          />
        );
      case 'skill':
        return (
          <SkillUpgradePanel
            crew={crew}
            onSkillUpgrade={(newCrew) => {
              onCrewUpdate?.(newCrew);
              onShowMessage?.('技能升级成功！', 'success');
            }}
          />
        );
      default:
        return <DetailPanel crew={crew} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* 上半部分：原画展示 */}
      <div style={{ padding: '8px' }}>
        <PortraitPanel
          crew={crew}
          isFullscreen={isFullscreen}
          onToggleFullscreen={config.features.portraitFullscreen ? () => setIsFullscreen(!isFullscreen) : undefined}
        />
      </div>

      {/* 下半部分：功能区域 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(0, 15, 30, 0.8)',
          borderTop: '1px solid rgba(0, 212, 255, 0.2)',
        }}
      >
        {/* 标签导航 */}
        <div
          style={{
            display: 'flex',
            padding: '6px',
            gap: '4px',
            borderBottom: '1px solid rgba(0, 212, 255, 0.1)',
            overflowX: 'auto',
            alignItems: 'center',
          }}
        >
          {config.tabs.map((tab) => {
            const tabConfig = TAB_CONFIG[tab];
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '6px 12px',
                  background: isActive ? `${tabConfig.color}30` : 'transparent',
                  border: isActive ? `1px solid ${tabConfig.color}` : '1px solid transparent',
                  borderRadius: '6px',
                  color: isActive ? tabConfig.color : '#9ca3af',
                  fontSize: '12px',
                  fontWeight: isActive ? 'bold' : 'normal',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                }}
              >
                <span>{tabConfig.icon}</span>
                <span>{tabConfig.label}</span>
              </button>
            );
          })}
        </div>

        {/* 标签内容 */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '10px',
            paddingBottom: '80px',
          }}
        >
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
