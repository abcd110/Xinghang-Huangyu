import { useGameStore } from '../stores/gameStore';
import { TrainUpgradeType } from '../core/Train';
import { getFacilityName } from '../data/trainUpgrades';

interface TrainScreenProps {
  onBack: () => void;
}

export default function TrainScreen({ onBack }: TrainScreenProps) {
  const { gameManager, upgradeTrain } = useGameStore();
  const train = gameManager.train;

  const handleUpgrade = (type: TrainUpgradeType) => {
    upgradeTrain(type);
  };

  const getUpgradeDisplayInfo = (type: TrainUpgradeType) => {
    const details = gameManager.getTrainUpgradeDetails(type);

    switch (type) {
      case TrainUpgradeType.CAPACITY:
        return {
          name: details.name,
          icon: details.icon,
          description: details.description,
          current: `+${train.capacityBonus} 格子`,
          next: `+${train.capacityBonus + 5} 格子`,
          coinCost: details.coinCost,
          materials: details.materialsStatus,
          canUpgrade: details.canUpgrade,
        };
      case TrainUpgradeType.ARMOR:
        return {
          name: details.name,
          icon: details.icon,
          description: details.description,
          current: `+${train.armorBonus} 耐久`,
          next: `+${train.armorBonus + 20} 耐久`,
          coinCost: details.coinCost,
          materials: details.materialsStatus,
          canUpgrade: details.canUpgrade,
        };
      case TrainUpgradeType.SPEED:
        return {
          name: details.name,
          icon: details.icon,
          description: details.description,
          current: `等级 ${train.speedLevel}`,
          next: `等级 ${train.speedLevel + 1}`,
          coinCost: details.coinCost,
          materials: details.materialsStatus,
          canUpgrade: details.canUpgrade,
        };
      case TrainUpgradeType.FACILITY:
        return {
          name: details.name,
          icon: details.icon,
          description: details.description,
          current: getFacilityName(train.facilityLevel),
          next: getFacilityName(train.facilityLevel + 1),
          coinCost: details.coinCost,
          materials: details.materialsStatus,
          canUpgrade: details.canUpgrade,
        };
      default:
        return null;
    }
  };

  const upgrades = [
    TrainUpgradeType.CAPACITY,
    TrainUpgradeType.ARMOR,
    TrainUpgradeType.SPEED,
    TrainUpgradeType.FACILITY,
  ];

  return (
    <div style={{
      height: '100vh',
      backgroundColor: '#1a1a1a',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 顶部标题栏 */}
      <header style={{
        flexShrink: 0,
        backgroundColor: '#2d2d2d',
        borderBottom: '1px solid #4b5563',
        padding: '12px 16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#9ca3af',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            <span>←</span>
            <span>返回</span>
          </button>
          <h1 style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>列车管理</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24' }}>
            <span>💰</span>
            <span style={{ fontWeight: 'bold' }}>{gameManager.trainCoins}</span>
          </div>
        </div>
      </header>

      {/* 列车状态 */}
      <section style={{
        flexShrink: 0,
        backgroundColor: '#1f2937',
        padding: '16px',
        borderBottom: '1px solid #374151'
      }}>
        <div style={{
          backgroundColor: '#2d2d2d',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid #374151'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#374151',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px'
            }}>
              🚂
            </div>
            <div>
              <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', margin: '0 0 4px 0' }}>
                末日列车
              </h2>
              <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>
                等级 {train.level} | 速度 {train.speed}
              </p>
            </div>
          </div>

          {/* 耐久条 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
              <span style={{ color: '#9ca3af' }}>耐久度</span>
              <span style={{ color: train.durability < train.maxDurability * 0.3 ? '#ef4444' : 'white' }}>
                {train.durability}/{train.maxDurability}
              </span>
            </div>
            <div style={{ backgroundColor: '#1f2937', borderRadius: '9999px', height: '10px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  backgroundColor: train.durability < train.maxDurability * 0.3 ? '#ef4444' : '#d97706',
                  transition: 'width 0.3s',
                  width: `${(train.durability / train.maxDurability) * 100}%`
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 升级选项 */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {upgrades.map(upgradeType => {
            const info = getUpgradeDisplayInfo(upgradeType);
            if (!info) return null;

            return (
              <div
                key={upgradeType}
                style={{
                  backgroundColor: '#2d2d2d',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #374151'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#374151',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}>
                    {info.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: 'white', fontWeight: 'bold', fontSize: '16px', margin: '0 0 4px 0' }}>
                      {info.name}
                    </h3>
                    <p style={{ color: '#9ca3af', fontSize: '12px', margin: 0 }}>{info.description}</p>
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#1f2937',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                    <span style={{ color: '#6b7280' }}>当前</span>
                    <span style={{ color: '#9ca3af' }}>{info.current}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: '#6b7280' }}>升级后</span>
                    <span style={{ color: '#4ade80' }}>{info.next}</span>
                  </div>
                </div>

                {/* 材料需求 */}
                <div style={{
                  backgroundColor: '#1f2937',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '12px'
                }}>
                  <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 8px 0' }}>升级所需材料：</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {info.materials.map((mat, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '13px',
                          color: mat.isEnough ? '#4ade80' : '#ef4444'
                        }}
                      >
                        <span>{mat.name}</span>
                        <span>{mat.hasQuantity}/{mat.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 升级按钮 */}
                <button
                  onClick={() => handleUpgrade(upgradeType)}
                  disabled={!info.canUpgrade}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: info.canUpgrade ? '#d97706' : '#374151',
                    color: info.canUpgrade ? 'white' : '#6b7280',
                    fontWeight: 'bold',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: info.canUpgrade ? 'pointer' : 'not-allowed',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <span>💰</span>
                  <span>{info.coinCost} 列车币 + 材料 升级</span>
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
