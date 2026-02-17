import { useState } from 'react';
import 基地背景 from '../../assets/images/基地背景.jpg';
import CrewScreen from '../CrewScreen';
import { FACILITIES, type BaseFacility } from './types';
import { BaseHeader, BaseOverview, FacilityCard } from './BaseComponents';
import { FacilityDetailModal } from './FacilityDetailModal';

interface BaseScreenProps {
  onBack: () => void;
  onNavigate?: (screen: string) => void;
}

function BaseScreen({ onBack, onNavigate }: BaseScreenProps) {
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
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${基地背景})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 0,
      }} />

      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, transparent 0%, rgba(0, 212, 255, 0.03) 50%, transparent 100%)',
        backgroundSize: '100% 4px',
        animation: 'scanline 8s linear infinite',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      <BaseHeader onBack={onBack} />

      <BaseOverview />

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

      {selectedFacility && (
        <FacilityDetailModal
          facility={selectedFacility}
          onClose={() => setSelectedFacility(null)}
        />
      )}

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
}

export { FACILITIES, type BaseFacility } from './types';
export { BaseHeader, BaseOverview, FacilityCard } from './BaseComponents';
export { FacilityDetailModal } from './FacilityDetailModal';
export { EnergyContent, WarehouseContent, MedicalContent } from './BasicFacilities';
export { CommContent } from './CommContent';
export { ResearchContent } from './ResearchContent';
export { MiningContent } from './MiningContent';
export { ChipContent } from './ChipContent';
export { ChipCraftPanel } from './ChipCraftPanel';
export { GeneContent } from './GeneContent';
export { CyberneticContent } from './CyberneticContent';
export { MarketContent } from './MarketContent';
export { RuinsContent, LockedContent } from './RuinsContent';
export { getItemName, getMaterialFullName, formatCost } from './utils';
export { MessageToast, CenteredMessageToast, ConfirmDialog, useConfirmDialog, type MessageState } from './shared';
export { styles, colors } from './styles';
export { BaseScreen };
