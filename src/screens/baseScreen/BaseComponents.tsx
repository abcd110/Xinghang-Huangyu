import { useGameStore } from '../../stores/gameStore';
import { FacilityType } from '../../core/BaseFacilitySystem';
import type { BaseFacility } from './types';

export function BaseHeader({ onBack }: { onBack: () => void }) {
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

export function BaseOverview() {
  return null;
}

export function FacilityCard({ facility, onClick }: { facility: BaseFacility; onClick: () => void }) {
  const { getFacilityLevel, gameManager } = useGameStore();
  const isLocked = facility.status === 'locked';
  const isBuilding = facility.status === 'building';

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
      {isLocked && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(100, 100, 100, 0.05) 8px, rgba(100, 100, 100, 0.05) 16px)',
          borderRadius: '10px',
          pointerEvents: 'none',
        }} />
      )}

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

      <div style={{
        fontSize: '32px',
        marginBottom: '8px',
        filter: isLocked ? 'grayscale(100%) brightness(0.5)' : 'none',
        textShadow: isLocked ? 'none' : `0 0 10px ${facility.color}50`,
        opacity: isLocked ? 0.4 : 1,
      }}>
        {facility.icon}
      </div>

      <div style={{
        color: isLocked ? '#555' : facility.color,
        fontSize: '13px',
        fontWeight: 'bold',
        textAlign: 'center',
        textShadow: isLocked ? 'none' : `0 0 5px ${facility.color}30`,
      }}>
        {facility.name}
      </div>

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
