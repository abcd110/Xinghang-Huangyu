import { useGameStore } from '../../stores/gameStore';
import type { BaseFacility } from './types';
import { EnergyContent, WarehouseContent, MedicalContent } from './BasicFacilities';
import { CommContent } from './CommContent';
import { ResearchContent } from './ResearchContent';
import { MiningContent } from './MiningContent';
import { ChipContent } from './ChipContent';
import { GeneContent } from './GeneContent';
import { CyberneticContent } from './CyberneticContent';
import { MarketContent } from './MarketContent';
import { RuinsContent, LockedContent } from './RuinsContent';

export function FacilityDetailModal({ facility, onClose }: { facility: BaseFacility; onClose: () => void }) {
  const { gameManager } = useGameStore();

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

        <div style={{ padding: '16px' }}>
          {renderFacilityContent()}
        </div>
      </div>
    </div>
  );
}
