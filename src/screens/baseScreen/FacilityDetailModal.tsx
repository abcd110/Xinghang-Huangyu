import { useGameStore } from '../../stores/gameStore';
import type { BaseFacility } from './types';
import { EnergyContent, WarehouseContent, MedicalContent } from './BasicFacilities';
import { ResearchContent } from './ResearchContent';
import { MiningContent } from './MiningContent';
import { ChipContent } from './ChipContent';
import { GeneContent } from './GeneContent';
import { CyberneticContent } from './CyberneticContent';
import { MarketContent } from './MarketContent';
import { RuinsContent, LockedContent } from './RuinsContent';
import type { Ruin } from '../../core/RuinSystem';

interface FacilityDetailModalProps {
  facility: BaseFacility;
  onClose: () => void;
  onStartRuinBattle?: (ruin: Ruin) => void;
}

export function FacilityDetailModal({ facility, onClose, onStartRuinBattle }: FacilityDetailModalProps) {
  const { gameManager } = useGameStore();

  const getActualLevel = (): number => {
    switch (facility.id) {
      case 'mining':
        return gameManager.getMiningLevel();
      case 'chip':
        return gameManager.getChipLevel();
      case 'alliance':
        return 1;
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
        return <RuinsContent onStartRuinBattle={onStartRuinBattle} />;
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
      justifyContent: 'center',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '430px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(0, 20, 40, 0.95)',
      }}>
        <div style={{
          background: `linear-gradient(180deg, ${facility.color}30, ${facility.color}10)`,
          padding: '16px',
          borderBottom: `1px solid ${facility.color}50`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
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

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {renderFacilityContent()}
        </div>
      </div>
    </div>
  );
}
