import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { FacilityType } from '../../core/BaseFacilitySystem';
import { formatCost } from './utils';
import { styles, colors } from './styles';

function ResultMessage({ result }: { result: { success: boolean; message: string } | null }) {
  if (!result) return null;
  return (
    <div style={{
      padding: '8px 12px',
      borderRadius: '8px',
      marginBottom: '12px',
      textAlign: 'center',
      background: result.success ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
      border: `1px solid ${result.success ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`,
      color: result.success ? colors.success : colors.error,
      fontSize: '13px',
    }}>
      {result.message}
    </div>
  );
}

function UpgradeButton({ canUpgrade, cost, reason, color, onClick }: {
  canUpgrade: boolean;
  cost?: ReturnType<typeof formatCost>;
  reason?: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={!canUpgrade}
      style={{
        width: '100%',
        padding: '12px',
        background: canUpgrade
          ? `linear-gradient(135deg, ${color}40, ${color}20)`
          : 'rgba(100, 100, 100, 0.3)',
        border: canUpgrade ? `1px solid ${color}80` : '1px solid rgba(100, 100, 100, 0.5)',
        borderRadius: '8px',
        color: canUpgrade ? color : '#666',
        fontWeight: 'bold',
        cursor: canUpgrade ? 'pointer' : 'not-allowed',
        boxShadow: canUpgrade ? `0 0 15px ${color}30` : 'none',
      }}
    >
      {canUpgrade ? `⬆️ 升级 (${cost || ''})` : reason || '已达最高等级'}
    </button>
  );
}

function ProgressBar({ percent, color }: { percent: number; color: string }) {
  return (
    <div style={{
      height: '8px',
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '4px',
      overflow: 'hidden',
    }}>
      <div style={{
        height: '100%',
        width: `${percent}%`,
        background: `linear-gradient(90deg, ${color}, ${color}aa)`,
        borderRadius: '4px',
        boxShadow: `0 0 10px ${color}`,
      }} />
    </div>
  );
}

function FacilityHeader({ icon, name, level, color, description }: {
  icon: string;
  name: string;
  level: number;
  color: string;
  description: string;
}) {
  return (
    <div style={{
      background: 'rgba(0, 0, 0, 0.4)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '16px',
      textAlign: 'center',
      border: `1px solid ${color}50`,
    }}>
      <div style={{ fontSize: '48px', marginBottom: '8px', textShadow: `0 0 20px ${color}80` }}>{icon}</div>
      <div style={{ color, fontWeight: 'bold', fontSize: '20px', textShadow: `0 0 10px ${color}50` }}>
        {name} Lv.{level}
      </div>
      <div style={{ color: '#a1a1aa', fontSize: '14px', marginTop: '8px' }}>{description}</div>
    </div>
  );
}

export function EnergyContent() {
  const { upgradeFacility, getFacilityLevel, getEnergyCoreEfficiency, getFacilityUpgradePreview, getFacilityDefinition } = useGameStore();
  const [upgradeResult, setUpgradeResult] = useState<{ success: boolean; message: string } | null>(null);

  const level = getFacilityLevel(FacilityType.ENERGY);
  const efficiency = getEnergyCoreEfficiency();
  const preview = getFacilityUpgradePreview(FacilityType.ENERGY);
  const def = getFacilityDefinition(FacilityType.ENERGY);

  const handleUpgrade = () => {
    const result = upgradeFacility(FacilityType.ENERGY);
    setUpgradeResult(result);
    if (result.success) setTimeout(() => setUpgradeResult(null), 2000);
  };

  return (
    <div>
      <FacilityHeader icon="⚡" name="能源核心" level={level} color={colors.energy} description={`自动采集效率 +${efficiency}%`} />

      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={styles.label}>升级进度</span>
          <span style={{ color: colors.energy, fontSize: '12px' }}>{level}/{def?.maxLevel || 10}</span>
        </div>
        <ProgressBar percent={(level / (def?.maxLevel || 10)) * 100} color={colors.energy} />
      </div>

      {preview.nextLevel && preview.cost && (
        <div style={styles.infoBox(colors.energy)}>
          <div style={{ color: colors.energy, fontSize: '12px', marginBottom: '4px' }}>
            下一级效果: {preview.effect?.description} +{preview.effect?.value}%
          </div>
          <div style={styles.label}>升级消耗: {formatCost(preview.cost)}</div>
        </div>
      )}

      <ResultMessage result={upgradeResult} />
      <UpgradeButton canUpgrade={preview.canUpgrade} cost={preview.cost ? formatCost(preview.cost) : undefined} reason={preview.reason} color={colors.energy} onClick={handleUpgrade} />
    </div>
  );
}

export function WarehouseContent() {
  const { upgradeFacility, getFacilityLevel, getWarehouseCapacity, getFacilityUpgradePreview, gameManager } = useGameStore();
  const [upgradeResult, setUpgradeResult] = useState<{ success: boolean; message: string } | null>(null);

  const level = getFacilityLevel(FacilityType.WAREHOUSE);
  const maxCapacity = getWarehouseCapacity();
  const usedSlots = gameManager.inventory.getUsedSlots();
  const preview = getFacilityUpgradePreview(FacilityType.WAREHOUSE);
  const usagePercent = Math.round((usedSlots / maxCapacity) * 100);

  const handleUpgrade = () => {
    const result = upgradeFacility(FacilityType.WAREHOUSE);
    setUpgradeResult(result);
    if (result.success) setTimeout(() => setUpgradeResult(null), 2000);
  };

  return (
    <div>
      <FacilityHeader icon="📦" name="星际仓库" level={level} color={colors.warehouse} description={`存储容量: ${usedSlots}/${maxCapacity} 格`} />

      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={styles.label}>已使用</span>
          <span style={{ color: usagePercent > 80 ? colors.error : colors.warehouse, fontSize: '12px' }}>{usagePercent}%</span>
        </div>
        <ProgressBar percent={usagePercent} color={usagePercent > 80 ? colors.error : colors.warehouse} />
      </div>

      {preview.nextLevel && preview.cost && (
        <div style={styles.infoBox(colors.warehouse)}>
          <div style={{ color: colors.warehouse, fontSize: '12px', marginBottom: '4px' }}>
            下一级容量: {preview.effect?.value} 格
          </div>
          <div style={styles.label}>升级消耗: {formatCost(preview.cost)}</div>
        </div>
      )}

      <ResultMessage result={upgradeResult} />
      <UpgradeButton canUpgrade={preview.canUpgrade} cost={preview.cost ? formatCost(preview.cost) : undefined} reason={preview.reason} color={colors.warehouse} onClick={handleUpgrade} />
    </div>
  );
}
