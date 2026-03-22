import { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { Implant, ImplantType, ImplantRarity, IMPLANT_TYPE_CONFIG, IMPLANT_RARITY_CONFIG, getImplantStats, getImplantUpgradeCost } from '../../core/CyberneticSystem';
import { MessageToast, useMessage } from './shared';
import { colors } from './styles';

const swipeStyles = {
  container: {
    position: 'relative' as const,
    paddingBottom: '16px',
    overflow: 'hidden' as const,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(168, 85, 247, 0.05))',
    borderRadius: '12px',
    marginBottom: '12px',
    border: '1px solid rgba(168, 85, 247, 0.2)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  headerIcon: {
    fontSize: '24px',
  },
  headerTitle: {
    fontSize: '16px',
    fontWeight: 'bold' as const,
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: '11px',
    color: '#888',
    marginTop: '2px',
  },
  levelBadge: {
    padding: '6px 14px',
    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(168, 85, 247, 0.2))',
    borderRadius: '20px',
    border: '1px solid rgba(168, 85, 247, 0.5)',
    fontSize: '14px',
    fontWeight: 'bold' as const,
    color: '#c084fc',
  },
  swipeContainer: {
    position: 'relative' as const,
    overflow: 'hidden' as const,
    marginBottom: '12px',
  },
  swipeWrapper: {
    display: 'flex',
    transition: 'transform 0.3s ease-out',
    touchAction: 'pan-y pinch-zoom' as const,
  },
  swipeSlide: {
    minWidth: '100%',
    padding: '0 8px',
    boxSizing: 'border-box' as const,
  },
  slotCard: (color: string, isEquipped: boolean) => ({
    background: `linear-gradient(180deg, ${color}20, ${color}08)`,
    borderRadius: '20px',
    padding: '20px 16px',
    border: `2px solid ${color}40`,
    minHeight: '320px',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  }),
  slotCardGlow: (color: string) => ({
    position: 'absolute' as const,
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: `radial-gradient(circle at center, ${color}15 0%, transparent 50%)`,
    pointerEvents: 'none' as const,
  }),
  slotHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
    position: 'relative' as const,
    zIndex: 1,
  },
  slotIconWrap: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
  },
  slotInfo: {
    textAlign: 'right' as const,
  },
  slotTypeName: (color: string) => ({
    fontSize: '18px',
    fontWeight: 'bold' as const,
    color: color,
    marginBottom: '4px',
  }),
  slotTypeDesc: {
    fontSize: '11px',
    color: '#888',
  },
  implantContent: {
    position: 'relative' as const,
    zIndex: 1,
  },
  implantName: (color: string) => ({
    fontSize: '22px',
    fontWeight: 'bold' as const,
    color: color,
    marginBottom: '4px',
    textAlign: 'center' as const,
  }),
  implantRarity: (color: string) => ({
    fontSize: '12px',
    color: color,
    textAlign: 'center' as const,
    marginBottom: '16px',
    padding: '4px 12px',
    background: `${color}20`,
    borderRadius: '12px',
    display: 'inline-block',
    width: 'auto',
  }),
  levelSection: {
    marginBottom: '20px',
    padding: '12px',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '12px',
  },
  levelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  levelLabel: {
    fontSize: '12px',
    color: '#a1a1aa',
  },
  levelValue: (color: string) => ({
    fontSize: '16px',
    fontWeight: 'bold' as const,
    color: color,
  }),
  progressBar: {
    height: '8px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    overflow: 'hidden' as const,
  },
  progressFill: (color: string, percent: number) => ({
    height: '100%',
    width: `${percent}%`,
    background: `linear-gradient(90deg, ${color}, ${color}80)`,
    borderRadius: '4px',
    boxShadow: `0 0 10px ${color}50`,
    transition: 'width 0.3s ease',
  }),
  statsSection: {
    marginBottom: '16px',
  },
  statsTitle: {
    fontSize: '12px',
    color: '#a1a1aa',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
  },
  statItem: (color: string) => ({
    background: `${color}10`,
    borderRadius: '10px',
    padding: '10px 12px',
    border: `1px solid ${color}20`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
  statLabel: {
    fontSize: '11px',
    color: '#a1a1aa',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  statValue: (color: string) => ({
    fontSize: '14px',
    fontWeight: 'bold' as const,
    color: color,
  }),
  actionSection: {
    display: 'flex',
    gap: '10px',
    marginTop: '16px',
  },
  actionButton: (color: string, disabled: boolean = false) => ({
    flex: 1,
    padding: '14px',
    background: disabled
      ? 'rgba(60, 60, 70, 0.5)'
      : `linear-gradient(135deg, ${color}, ${color}80)`,
    border: 'none',
    borderRadius: '12px',
    color: disabled ? '#666' : '#fff',
    fontWeight: 'bold' as const,
    fontSize: '13px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: disabled ? 'none' : `0 4px 15px ${color}40`,
  }),
  emptySlot: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    color: '#666',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '12px',
    opacity: 0.5,
  },
  emptyText: {
    fontSize: '14px',
    marginBottom: '8px',
  },
  emptyHint: {
    fontSize: '11px',
    color: '#555',
  },
  indicatorContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '16px',
    padding: '8px',
  },
  indicator: (isActive: boolean, color: string) => ({
    width: isActive ? '24px' : '8px',
    height: '8px',
    borderRadius: '4px',
    background: isActive ? color : 'rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  }),
  indicatorLabel: (isActive: boolean, color: string) => ({
    position: 'absolute' as const,
    bottom: '-20px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '10px',
    color: isActive ? color : '#666',
    whiteSpace: 'nowrap' as const,
    opacity: isActive ? 1 : 0,
    transition: 'opacity 0.3s ease',
  }),
  indicatorWrap: {
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
  },
  bottomNav: {
    display: 'flex',
    gap: '8px',
    padding: '0 8px',
  },
  navButton: (isActive: boolean, color: string) => ({
    flex: 1,
    padding: '14px 8px',
    background: isActive
      ? `linear-gradient(135deg, ${color}30, ${color}15)`
      : 'rgba(40, 40, 50, 0.6)',
    border: isActive
      ? `1px solid ${color}50`
      : '1px solid rgba(80, 80, 100, 0.2)',
    borderRadius: '12px',
    color: isActive ? color : '#888',
    fontWeight: 'bold' as const,
    fontSize: '12px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.2s ease',
  }),
  navIcon: {
    fontSize: '20px',
  },
  warehousePanel: {
    background: 'rgba(30, 30, 40, 0.9)',
    borderRadius: '16px',
    padding: '16px',
    border: '1px solid rgba(100, 100, 120, 0.2)',
  },
  warehouseHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  warehouseTitle: {
    fontSize: '14px',
    color: '#c084fc',
    fontWeight: 'bold' as const,
  },
  warehouseCount: {
    fontSize: '12px',
    color: '#888',
    background: 'rgba(168, 85, 247, 0.2)',
    padding: '4px 10px',
    borderRadius: '10px',
  },
  filterRow: {
    display: 'flex',
    gap: '6px',
    marginBottom: '12px',
    overflowX: 'auto' as const,
    paddingBottom: '4px',
  },
  filterButton: (isActive: boolean, color: string) => ({
    padding: '8px 12px',
    background: isActive ? `${color}25` : 'rgba(50, 50, 60, 0.5)',
    border: isActive ? `1px solid ${color}40` : '1px solid rgba(80, 80, 90, 0.2)',
    borderRadius: '8px',
    color: isActive ? color : '#888',
    fontSize: '11px',
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
  }),
  implantList: {
    maxHeight: '280px',
    overflowY: 'auto' as const,
  },
  implantCard: (color: string, isSelected: boolean) => ({
    background: isSelected ? `${color}15` : 'rgba(40, 40, 50, 0.5)',
    borderRadius: '12px',
    padding: '12px',
    marginBottom: '8px',
    border: isSelected ? `1px solid ${color}40` : '1px solid rgba(80, 80, 90, 0.15)',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.2s ease',
  }),
  implantInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  implantIcon: (color: string) => ({
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: `${color}20`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  }),
  implantDetails: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
  },
  implantNameText: (color: string) => ({
    fontSize: '13px',
    color: color,
    fontWeight: 'bold' as const,
  }),
  implantMeta: {
    fontSize: '10px',
    color: '#888',
  },
  implantActions: {
    display: 'flex',
    gap: '6px',
  },
  smallButton: (color: string) => ({
    padding: '8px 14px',
    background: `linear-gradient(135deg, ${color}, ${color}80)`,
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '11px',
    fontWeight: 'bold' as const,
    cursor: 'pointer',
  }),
  craftPanel: {
    background: 'rgba(30, 30, 40, 0.9)',
    borderRadius: '16px',
    padding: '16px',
    border: '1px solid rgba(100, 100, 120, 0.2)',
  },
  craftTitle: {
    fontSize: '14px',
    color: '#c084fc',
    fontWeight: 'bold' as const,
    marginBottom: '12px',
  },
  craftGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
    marginBottom: '16px',
  },
  craftCard: (color: string) => ({
    background: `linear-gradient(135deg, ${color}15, ${color}05)`,
    borderRadius: '14px',
    padding: '16px',
    border: `1px solid ${color}30`,
    cursor: 'pointer',
    textAlign: 'center' as const,
    transition: 'all 0.2s ease',
  }),
  craftIcon: {
    fontSize: '32px',
    marginBottom: '8px',
  },
  craftName: (color: string) => ({
    fontSize: '13px',
    color: color,
    fontWeight: 'bold' as const,
    marginBottom: '4px',
  }),
  craftDesc: {
    fontSize: '10px',
    color: '#888',
  },
  rarityCard: (color: string, isCraftable: boolean) => ({
    background: isCraftable
      ? `linear-gradient(135deg, ${color}20, ${color}08)`
      : 'rgba(40, 40, 50, 0.4)',
    borderRadius: '14px',
    padding: '14px',
    border: isCraftable
      ? `1px solid ${color}35`
      : '1px solid rgba(80, 80, 90, 0.15)',
    marginBottom: '10px',
    opacity: isCraftable ? 1 : 0.6,
  }),
  rarityHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  rarityName: (color: string) => ({
    fontSize: '14px',
    color: color,
    fontWeight: 'bold' as const,
  }),
  rarityLock: {
    fontSize: '10px',
    color: '#ef4444',
    background: 'rgba(239, 68, 68, 0.15)',
    padding: '3px 8px',
    borderRadius: '6px',
  },
  rarityCost: {
    fontSize: '11px',
    color: '#a1a1aa',
    marginBottom: '10px',
  },
  craftButton: (color: string, disabled: boolean) => ({
    width: '100%',
    padding: '12px',
    background: disabled
      ? 'rgba(60, 60, 70, 0.4)'
      : `linear-gradient(135deg, ${color}, ${color}80)`,
    border: 'none',
    borderRadius: '10px',
    color: disabled ? '#666' : '#fff',
    fontWeight: 'bold' as const,
    fontSize: '12px',
    cursor: disabled ? 'not-allowed' : 'pointer',
  }),
  detailModal: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  detailContent: (color: string) => ({
    background: `linear-gradient(180deg, ${color}15, rgba(20, 20, 30, 0.98))`,
    borderRadius: '20px',
    padding: '20px',
    width: '100%',
    maxWidth: '360px',
    border: `1px solid ${color}30`,
    maxHeight: '80vh',
    overflowY: 'auto' as const,
  }),
  detailClose: {
    position: 'absolute' as const,
    top: '12px',
    right: '12px',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    color: '#fff',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockBadge: (isLocked: boolean) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    background: isLocked ? 'rgba(245, 158, 11, 0.2)' : 'rgba(100, 100, 110, 0.2)',
    border: isLocked ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(100, 100, 110, 0.3)',
    borderRadius: '8px',
    color: isLocked ? '#f59e0b' : '#888',
    fontSize: '10px',
    cursor: 'pointer',
  }),
  decomposeConfirm: {
    marginTop: '16px',
    padding: '14px',
    background: 'rgba(239, 68, 68, 0.12)',
    borderRadius: '12px',
    border: '1px solid rgba(239, 68, 68, 0.25)',
  },
  decomposeText: {
    color: '#ef4444',
    fontSize: '13px',
    textAlign: 'center' as const,
    marginBottom: '12px',
  },
  decomposeButtons: {
    display: 'flex',
    gap: '10px',
  },
  totalStatsBar: {
    background: 'rgba(30, 30, 40, 0.9)',
    borderRadius: '12px',
    padding: '12px 16px',
    marginBottom: '12px',
    border: '1px solid rgba(100, 100, 120, 0.2)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalStatsLabel: {
    fontSize: '12px',
    color: '#888',
  },
  totalStatsValue: {
    display: 'flex',
    gap: '12px',
  },
  totalStatItem: (color: string) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: color,
    fontWeight: 'bold' as const,
  }),
};

const STAT_ICONS: Record<string, string> = {
  attack: '⚔️',
  defense: '🛡️',
  hp: '❤️',
  critRate: '💥',
  critDamage: '🔥',
  hit: '🎯',
  dodge: '💨',
};

const STAT_NAMES: Record<string, string> = {
  attack: '攻击',
  defense: '防御',
  hp: '生命',
  critRate: '暴击率',
  critDamage: '暴击伤害',
  hit: '命中',
  dodge: '闪避',
};

const IMPLANT_TYPES = [ImplantType.NEURAL, ImplantType.MUSCULAR, ImplantType.SKELETAL, ImplantType.CARDIO];

export function CyberneticContent() {
  const { gameManager, saveGame, craftImplant, upgradeImplant, equipImplant, unequipImplant, decomposeImplant, getImplantTotalStats, toggleImplantLock, getCraftableImplantRarities } = useGameStore();
  const [activeTab, setActiveTab] = useState<'slots' | 'warehouse' | 'craft'>('slots');
  const [currentSlotIndex, setCurrentSlotIndex] = useState(0);
  const [selectedImplant, setSelectedImplant] = useState<Implant | null>(null);
  const [selectedCraftType, setSelectedCraftType] = useState<ImplantType | null>(null);
  const [filterType, setFilterType] = useState<ImplantType | null>(null);
  const [showDecomposeConfirm, setShowDecomposeConfirm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { message, showMessage } = useMessage();

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const swipeRef = useRef<HTMLDivElement>(null);

  const implants = gameManager.getImplants();
  const availableSlots = gameManager.getAvailableImplantSlots();
  const craftableRarities = getCraftableImplantRarities();
  const level = gameManager.getCyberneticLevel();
  const totalStats = getImplantTotalStats();

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
      setShowDetailModal(false);
      await saveGame();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const handleUnequip = async (type: ImplantType) => {
    const result = unequipImplant(type);
    if (result.success) {
      showMessage(result.message, 'success');
      setShowDetailModal(false);
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
      setShowDecomposeConfirm(false);
      setShowDetailModal(false);
      await saveGame();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const handleDecomposeClick = () => {
    if (selectedImplant?.locked) return;
    if (gameManager.equippedImplants[selectedImplant!.type] === selectedImplant!.id) {
      showMessage('已装备的义体无法分解，请先卸下', 'error');
      return;
    }
    setShowDecomposeConfirm(true);
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

  const getStatDisplayValue = (stat: string, value: number): string => {
    if (stat === 'critRate' || stat === 'critDamage' || stat === 'dodge') {
      return `+${value}%`;
    }
    return `+${value}`;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentSlotIndex < IMPLANT_TYPES.length - 1) {
        setCurrentSlotIndex(currentSlotIndex + 1);
      } else if (diff < 0 && currentSlotIndex > 0) {
        setCurrentSlotIndex(currentSlotIndex - 1);
      }
    }
  };

  const renderSlotCard = (type: ImplantType) => {
    const equipped = getEquippedImplantForType(type);
    const typeConfig = IMPLANT_TYPE_CONFIG[type];
    const color = equipped ? IMPLANT_RARITY_CONFIG[equipped.rarity].color : typeConfig.color;

    return (
      <div key={type} style={swipeStyles.swipeSlide}>
        <div style={swipeStyles.slotCard(color, !!equipped)}>
          <div style={swipeStyles.slotCardGlow(color)} />

          <div style={swipeStyles.slotHeader}>
            <div style={swipeStyles.slotIconWrap}>
              {typeConfig.icon}
            </div>
            <div style={swipeStyles.slotInfo}>
              <div style={swipeStyles.slotTypeName(color)}>{typeConfig.name}</div>
              <div style={swipeStyles.slotTypeDesc}>{typeConfig.description}</div>
            </div>
          </div>

          {equipped ? (
            <div style={swipeStyles.implantContent}>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={swipeStyles.implantName(color)}>{equipped.name}</div>
                <div style={swipeStyles.implantRarity(color)}>
                  {IMPLANT_RARITY_CONFIG[equipped.rarity].name}
                </div>
              </div>

              <div style={swipeStyles.levelSection}>
                <div style={swipeStyles.levelRow}>
                  <span style={swipeStyles.levelLabel}>等级</span>
                  <span style={swipeStyles.levelValue(color)}>
                    Lv.{equipped.level} / {equipped.maxLevel}
                  </span>
                </div>
                <div style={swipeStyles.progressBar}>
                  <div style={swipeStyles.progressFill(color, (equipped.level / equipped.maxLevel) * 100)} />
                </div>
              </div>

              <div style={swipeStyles.statsSection}>
                <div style={swipeStyles.statsTitle}>
                  <span>📊</span> 属性加成
                </div>
                <div style={swipeStyles.statsGrid}>
                  {Object.entries(getImplantStats(equipped)).map(([stat, value]) => (
                    <div key={stat} style={swipeStyles.statItem(color)}>
                      <span style={swipeStyles.statLabel}>
                        {STAT_ICONS[stat]} {STAT_NAMES[stat]}
                      </span>
                      <span style={swipeStyles.statValue(color)}>
                        {getStatDisplayValue(stat, value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={swipeStyles.actionSection}>
                <button
                  style={swipeStyles.actionButton('#ef4444')}
                  onClick={() => handleUnequip(type)}
                >
                  卸下
                </button>
                <button
                  style={swipeStyles.actionButton(color, equipped.level >= equipped.maxLevel)}
                  onClick={() => {
                    setSelectedImplant(equipped);
                    setShowDetailModal(true);
                  }}
                >
                  详情
                </button>
              </div>
            </div>
          ) : (
            <div style={swipeStyles.emptySlot}>
              <div style={swipeStyles.emptyIcon}>{typeConfig.icon}</div>
              <div style={swipeStyles.emptyText}>空槽位</div>
              <div style={swipeStyles.emptyHint}>点击下方「仓库」装备义体</div>
              <button
                style={{ ...swipeStyles.actionButton(typeConfig.color), marginTop: '20px' }}
                onClick={() => setActiveTab('warehouse')}
              >
                前往仓库
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderIndicators = () => (
    <div style={swipeStyles.indicatorContainer}>
      {IMPLANT_TYPES.map((type, index) => {
        const typeConfig = IMPLANT_TYPE_CONFIG[type];
        const equipped = getEquippedImplantForType(type);
        const color = equipped ? IMPLANT_RARITY_CONFIG[equipped.rarity].color : typeConfig.color;
        const isActive = index === currentSlotIndex;

        return (
          <div key={type} style={swipeStyles.indicatorWrap}>
            <div
              style={swipeStyles.indicator(isActive, color)}
              onClick={() => setCurrentSlotIndex(index)}
            />
          </div>
        );
      })}
    </div>
  );

  const renderTotalStats = () => {
    const statEntries = Object.entries(totalStats);
    if (statEntries.length === 0) return null;

    const mainStats = ['attack', 'defense', 'hp', 'critRate'];
    const displayStats = mainStats.filter(s => totalStats[s]);

    return (
      <div style={swipeStyles.totalStatsBar}>
        <span style={swipeStyles.totalStatsLabel}>⚡ 总属性</span>
        <div style={swipeStyles.totalStatsValue}>
          {displayStats.map(stat => (
            <span key={stat} style={swipeStyles.totalStatItem(colors.cybernetic)}>
              {STAT_ICONS[stat]} {getStatDisplayValue(stat, totalStats[stat])}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderWarehouse = () => {
    const unequippedImplants = implants.filter(
      i => !Object.values(gameManager.equippedImplants).includes(i.id)
    );
    const filteredImplants = filterType
      ? unequippedImplants.filter(i => i.type === filterType)
      : unequippedImplants;

    return (
      <div style={swipeStyles.warehousePanel}>
        <div style={swipeStyles.warehouseHeader}>
          <div style={swipeStyles.warehouseTitle}>📦 义体仓库</div>
          <div style={swipeStyles.warehouseCount}>{unequippedImplants} 件</div>
        </div>

        <div style={swipeStyles.filterRow}>
          <button
            style={swipeStyles.filterButton(filterType === null, colors.cybernetic)}
            onClick={() => setFilterType(null)}
          >
            全部
          </button>
          {Object.values(ImplantType).map(type => {
            const typeConfig = IMPLANT_TYPE_CONFIG[type];
            const count = unequippedImplants.filter(i => i.type === type).length;
            return (
              <button
                key={type}
                style={swipeStyles.filterButton(filterType === type, typeConfig.color)}
                onClick={() => setFilterType(type)}
              >
                {typeConfig.icon} {count}
              </button>
            );
          })}
        </div>

        <div style={swipeStyles.implantList}>
          {filteredImplants.map(implant => {
            const rarityColor = IMPLANT_RARITY_CONFIG[implant.rarity].color;
            const typeConfig = IMPLANT_TYPE_CONFIG[implant.type];
            return (
              <div
                key={implant.id}
                style={swipeStyles.implantCard(rarityColor, selectedImplant?.id === implant.id)}
                onClick={() => {
                  setSelectedImplant(implant);
                  setShowDetailModal(true);
                }}
              >
                <div style={swipeStyles.implantInfo}>
                  <div style={swipeStyles.implantIcon(rarityColor)}>
                    {typeConfig.icon}
                  </div>
                  <div style={swipeStyles.implantDetails}>
                    <div style={swipeStyles.implantNameText(rarityColor)}>{implant.name}</div>
                    <div style={swipeStyles.implantMeta}>
                      {IMPLANT_RARITY_CONFIG[implant.rarity].name} · Lv.{implant.level}
                    </div>
                  </div>
                </div>
                <div style={swipeStyles.implantActions}>
                  <button
                    style={swipeStyles.smallButton(rarityColor)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEquip(implant.id);
                    }}
                  >
                    装备
                  </button>
                </div>
              </div>
            );
          })}
          {filteredImplants.length === 0 && (
            <div style={{ textAlign: 'center', color: '#666', padding: '30px', fontSize: '13px' }}>
              暂无义体，前往制造
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCraft = () => {
    if (!selectedCraftType) {
      return (
        <div style={swipeStyles.craftPanel}>
          <div style={swipeStyles.craftTitle}>🔨 选择制造部位</div>
          <div style={swipeStyles.craftGrid}>
            {Object.values(ImplantType).map(type => {
              const typeConfig = IMPLANT_TYPE_CONFIG[type];
              return (
                <div
                  key={type}
                  style={swipeStyles.craftCard(typeConfig.color)}
                  onClick={() => setSelectedCraftType(type)}
                >
                  <div style={swipeStyles.craftIcon}>{typeConfig.icon}</div>
                  <div style={swipeStyles.craftName(typeConfig.color)}>{typeConfig.name}</div>
                  <div style={swipeStyles.craftDesc}>{typeConfig.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    const typeConfig = IMPLANT_TYPE_CONFIG[selectedCraftType];
    const costs = {
      [ImplantRarity.RARE]: { credits: 2000, materials: 12 },
      [ImplantRarity.EPIC]: { credits: 5000, materials: 20 },
      [ImplantRarity.LEGENDARY]: { credits: 10000, materials: 30 },
    };

    return (
      <div style={swipeStyles.craftPanel}>
        <button
          style={{ ...swipeStyles.filterButton(false, '#888'), marginBottom: '12px' }}
          onClick={() => setSelectedCraftType(null)}
        >
          ← 返回选择部位
        </button>

        <div style={{
          textAlign: 'center',
          marginBottom: '16px',
          padding: '20px',
          background: `${typeConfig.color}12`,
          borderRadius: '16px',
          border: `1px solid ${typeConfig.color}25`
        }}>
          <span style={{ fontSize: '40px' }}>{typeConfig.icon}</span>
          <div style={{ color: typeConfig.color, fontWeight: 'bold', fontSize: '18px', marginTop: '10px' }}>
            {typeConfig.name}
          </div>
          <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
            {typeConfig.description}
          </div>
        </div>

        {Object.values(ImplantRarity).map(rarity => {
          const rarityConfig = IMPLANT_RARITY_CONFIG[rarity];
          const cost = costs[rarity];
          const isCraftable = craftableRarities.includes(rarity);
          const canAfford = gameManager.trainCoins >= cost.credits &&
            gameManager.inventory.hasItem('cyber_material', cost.materials);
          const requiredLevel = rarity === ImplantRarity.EPIC ? 2 : rarity === ImplantRarity.LEGENDARY ? 3 : 1;

          return (
            <div key={rarity} style={swipeStyles.rarityCard(rarityConfig.color, isCraftable)}>
              <div style={swipeStyles.rarityHeader}>
                <span style={swipeStyles.rarityName(rarityConfig.color)}>
                  {rarityConfig.name}
                </span>
                {!isCraftable && (
                  <span style={swipeStyles.rarityLock}>需要 Lv.{requiredLevel}</span>
                )}
              </div>
              <div style={swipeStyles.rarityCost}>
                💰 {cost.credits} 信用点 · 🔧 {cost.materials} 义体材料
              </div>
              <button
                style={swipeStyles.craftButton(rarityConfig.color, !isCraftable || !canAfford)}
                onClick={() => handleCraft(selectedCraftType, rarity)}
                disabled={!isCraftable || !canAfford}
              >
                {!isCraftable ? `需要研发等级 Lv.${requiredLevel}` : canAfford ? '制造' : '材料不足'}
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDetailModal = () => {
    if (!selectedImplant || !showDetailModal) return null;

    const rarityColor = IMPLANT_RARITY_CONFIG[selectedImplant.rarity].color;
    const typeConfig = IMPLANT_TYPE_CONFIG[selectedImplant.type];
    const stats = getImplantStats(selectedImplant);
    const levelPercent = (selectedImplant.level / selectedImplant.maxLevel) * 100;
    const isEquipped = gameManager.equippedImplants[selectedImplant.type] === selectedImplant.id;

    return (
      <div
        style={swipeStyles.detailModal}
        onClick={() => setShowDetailModal(false)}
      >
        <div
          style={swipeStyles.detailContent(rarityColor)}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>{typeConfig.icon}</div>
            <div style={swipeStyles.implantName(rarityColor)}>{selectedImplant.name}</div>
            <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
              {typeConfig.name} · {IMPLANT_RARITY_CONFIG[selectedImplant.rarity].name}
            </div>
          </div>

          <div style={swipeStyles.levelSection}>
            <div style={swipeStyles.levelRow}>
              <span style={swipeStyles.levelLabel}>等级</span>
              <span style={swipeStyles.levelValue(rarityColor)}>
                Lv.{selectedImplant.level} / {selectedImplant.maxLevel}
              </span>
            </div>
            <div style={swipeStyles.progressBar}>
              <div style={swipeStyles.progressFill(rarityColor, levelPercent)} />
            </div>
          </div>

          <div style={swipeStyles.statsSection}>
            <div style={swipeStyles.statsTitle}>
              <span>📊</span> 属性加成
            </div>
            <div style={swipeStyles.statsGrid}>
              {Object.entries(stats).map(([stat, value]) => (
                <div key={stat} style={swipeStyles.statItem(rarityColor)}>
                  <span style={swipeStyles.statLabel}>
                    {STAT_ICONS[stat]} {STAT_NAMES[stat]}
                  </span>
                  <span style={swipeStyles.statValue(rarityColor)}>
                    {getStatDisplayValue(stat, value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <button
              style={swipeStyles.lockBadge(!!selectedImplant.locked)}
              onClick={() => handleToggleLock(selectedImplant.id)}
              disabled={isEquipped}
            >
              {selectedImplant.locked ? '🔒 已锁定' : '🔓 未锁定'}
            </button>
          </div>

          {selectedImplant.level < selectedImplant.maxLevel && (() => {
            const upgradeCost = getImplantUpgradeCost(selectedImplant);
            const canAfford = gameManager.trainCoins >= upgradeCost.credits &&
              upgradeCost.materials.every(m => gameManager.inventory.hasItem(m.itemId, m.count));
            return (
              <div style={{ ...swipeStyles.levelSection, marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', color: '#a1a1aa', textAlign: 'center' }}>
                  升级费用: {upgradeCost.credits}💰 + {upgradeCost.materials.map(m => `${m.count}🔧`).join(' + ')}
                  {!canAfford && <span style={{ color: '#ef4444', marginLeft: '6px' }}>(不足)</span>}
                </div>
              </div>
            );
          })()}

          <div style={swipeStyles.actionSection}>
            {isEquipped ? (
              <button
                style={swipeStyles.actionButton('#ef4444')}
                onClick={() => handleUnequip(selectedImplant.type)}
              >
                卸下义体
              </button>
            ) : (
              <>
                <button
                  style={swipeStyles.smallButton(rarityColor)}
                  onClick={() => handleEquip(selectedImplant.id)}
                >
                  装备
                </button>
                <button
                  style={swipeStyles.actionButton(rarityColor, selectedImplant.level >= selectedImplant.maxLevel)}
                  onClick={() => handleUpgrade(selectedImplant.id)}
                  disabled={selectedImplant.level >= selectedImplant.maxLevel}
                >
                  {selectedImplant.level >= selectedImplant.maxLevel ? '已满级' : '升级'}
                </button>
                <button
                  style={swipeStyles.actionButton('#ef4444', selectedImplant.locked)}
                  onClick={handleDecomposeClick}
                  disabled={selectedImplant.locked}
                >
                  分解
                </button>
              </>
            )}
          </div>

          {showDecomposeConfirm && (
            <div style={swipeStyles.decomposeConfirm}>
              <div style={swipeStyles.decomposeText}>
                ⚠️ 确定分解 {selectedImplant.name}？
              </div>
              <div style={swipeStyles.decomposeButtons}>
                <button
                  style={{ ...swipeStyles.actionButton('#666'), flex: 1 }}
                  onClick={() => setShowDecomposeConfirm(false)}
                >
                  取消
                </button>
                <button
                  style={{ ...swipeStyles.actionButton('#ef4444'), flex: 1 }}
                  onClick={() => handleDecompose(selectedImplant.id)}
                >
                  确认
                </button>
              </div>
            </div>
          )}

          <button
            style={{ ...swipeStyles.actionButton('#666'), marginTop: '12px' }}
            onClick={() => setShowDetailModal(false)}
          >
            关闭
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={swipeStyles.container}>
      <MessageToast message={message} />

      <div style={swipeStyles.header}>
        <div style={swipeStyles.headerLeft}>
          <span style={swipeStyles.headerIcon}>🦾</span>
          <div>
            <div style={swipeStyles.headerTitle}>机械飞升</div>
            <div style={swipeStyles.headerSubtitle}>
              已装备 {Object.values(gameManager.equippedImplants).filter(id => id).length}/{availableSlots.length}
            </div>
          </div>
        </div>
        <div style={swipeStyles.levelBadge}>Lv.{level}</div>
      </div>

      {renderTotalStats()}

      {activeTab === 'slots' && (
        <>
          <div
            ref={swipeRef}
            style={swipeStyles.swipeContainer}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div style={{
              ...swipeStyles.swipeWrapper,
              transform: `translateX(-${currentSlotIndex * 100}%)`,
            }}>
              {IMPLANT_TYPES.map(type => renderSlotCard(type))}
            </div>
          </div>
          {renderIndicators()}
        </>
      )}

      {activeTab === 'warehouse' && renderWarehouse()}
      {activeTab === 'craft' && renderCraft()}

      <div style={swipeStyles.bottomNav}>
        <button
          style={swipeStyles.navButton(activeTab === 'slots', colors.cybernetic)}
          onClick={() => setActiveTab('slots')}
        >
          <span style={swipeStyles.navIcon}>🦾</span>
          <span>槽位</span>
        </button>
        <button
          style={swipeStyles.navButton(activeTab === 'warehouse', colors.cybernetic)}
          onClick={() => setActiveTab('warehouse')}
        >
          <span style={swipeStyles.navIcon}>📦</span>
          <span>仓库</span>
        </button>
        <button
          style={swipeStyles.navButton(activeTab === 'craft', colors.cybernetic)}
          onClick={() => setActiveTab('craft')}
        >
          <span style={swipeStyles.navIcon}>🔨</span>
          <span>制造</span>
        </button>
      </div>

      {renderDetailModal()}
    </div>
  );
}
