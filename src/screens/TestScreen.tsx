import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { ItemRarity } from '../data/types';
import { ITEMS } from '../data/items';
import {
  ArmorQuality,
  ARMOR_QUALITY_NAMES,
  ARMOR_QUALITY_COLORS,
  NanoArmorSlot,
  NANO_ARMOR_SLOT_NAMES,
  NANO_ARMOR_SLOT_ICONS,
  getRecipeBySlot,
} from '../data/nanoArmorRecipes';
import { ENHANCE_STONE_ID } from '../core/EnhanceSystem';
import { EquipmentSlot } from '../data/equipmentTypes';
import type { EquipmentInstance } from '../core/EquipmentSystem';
import { QUALITY_SUFFIX, QUALITY_TO_RARITY } from '../data/constants';

interface TestScreenProps {
  onBack: () => void;
}

const RARITY_COLORS: Record<ItemRarity, string> = {
  [ItemRarity.COMMON]: '#9ca3af',
  [ItemRarity.UNCOMMON]: '#4ade80',
  [ItemRarity.RARE]: '#60a5fa',
  [ItemRarity.EPIC]: '#c084fc',
  [ItemRarity.LEGENDARY]: '#f59e0b',
  [ItemRarity.MYTHIC]: '#ef4444',
};

const RARITY_NAMES: Record<ItemRarity, string> = {
  [ItemRarity.COMMON]: '普通',
  [ItemRarity.UNCOMMON]: '优秀',
  [ItemRarity.RARE]: '稀有',
  [ItemRarity.EPIC]: '史诗',
  [ItemRarity.LEGENDARY]: '传说',
  [ItemRarity.MYTHIC]: '神话',
};

// 纳米战甲材料基础ID
const NANO_ARMOR_MATERIALS = [
  { id: 'mat_001', name: '星铁基础构件' },
  { id: 'mat_003', name: '钛钢外甲坯料' },
  { id: 'mat_004', name: '战甲能量晶核' },
  { id: 'mat_005', name: '稀土传感基质' },
  { id: 'mat_006', name: '虚空防护核心' },
  { id: 'mat_007', name: '推进模块燃料' },
  { id: 'mat_010', name: '量子紧固组件' },
];

// 研究材料
const RESEARCH_MATERIALS = [
  { id: 'chip_material', name: '芯片材料', color: '#10b981', desc: '芯片研发' },
  { id: 'gene_material', name: '基因材料', color: '#ec4899', desc: '基因工程' },
  { id: 'cyber_material', name: '义体材料', color: '#a855f7', desc: '机械飞升' },
  { id: 'void_essence', name: '虚空精华', color: '#a855f7', desc: '稀有材料' },
];

// 矿物材料
const MINERAL_MATERIALS = [
  { id: 'mineral_iron', name: '铁矿', color: '#9ca3af' },
  { id: 'mineral_copper', name: '铜矿', color: '#f59e0b' },
  { id: 'mineral_titanium', name: '钛矿', color: '#60a5fa' },
  { id: 'mineral_crystal', name: '水晶', color: '#a855f7' },
  { id: 'mineral_quantum', name: '量子矿', color: '#ec4899' },
];

// NanoArmorSlot 到 EquipmentSlot 的映射
const SLOT_MAPPING: Record<NanoArmorSlot, EquipmentSlot> = {
  [NanoArmorSlot.HELMET]: EquipmentSlot.HEAD,
  [NanoArmorSlot.CHEST]: EquipmentSlot.BODY,
  [NanoArmorSlot.SHOULDER]: EquipmentSlot.SHOULDER,
  [NanoArmorSlot.ARM]: EquipmentSlot.ARM,
  [NanoArmorSlot.LEG]: EquipmentSlot.LEGS,
  [NanoArmorSlot.BOOT]: EquipmentSlot.FEET,
};

export default function TestScreen({ onBack }: TestScreenProps) {
  const { gameManager } = useGameStore();
  const [activeTab, setActiveTab] = useState<'items' | 'materials' | 'research' | 'armor' | 'player' | 'facility'>('items');
  const [message, setMessage] = useState<string | null>(null);
  const [, setRefreshKey] = useState(0);
  const [selectedArmorQuality, setSelectedArmorQuality] = useState<ArmorQuality>(ArmorQuality.VOID);

  const forceRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // 显示消息
  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  // ==================== 材料相关 ====================

  // 添加所有纳米战甲材料
  const addAllMaterials = (quantity: number = 99) => {
    NANO_ARMOR_MATERIALS.forEach(mat => {
      [ArmorQuality.STARDUST, ArmorQuality.ALLOY, ArmorQuality.CRYSTAL, ArmorQuality.QUANTUM, ArmorQuality.VOID].forEach(quality => {
        const qualityId = `${mat.id}${QUALITY_SUFFIX[quality]}`;
        gameManager.inventory.addItem(qualityId, quantity);
      });
    });
    forceRefresh();
    showMessage(`已添加所有纳米战甲材料 x${quantity}`);
  };

  // 添加特定品质的所有材料
  const addMaterialsByQuality = (quality: ArmorQuality, quantity: number = 99) => {
    NANO_ARMOR_MATERIALS.forEach(mat => {
      const qualityId = `${mat.id}${QUALITY_SUFFIX[quality]}`;
      gameManager.inventory.addItem(qualityId, quantity);
    });
    forceRefresh();
    showMessage(`已添加${ARMOR_QUALITY_NAMES[quality]}材料 x${quantity}`);
  };

  // 添加所有研究材料
  const addAllResearchMaterials = (quantity: number = 99) => {
    RESEARCH_MATERIALS.forEach(mat => {
      gameManager.inventory.addItem(mat.id, quantity);
    });
    forceRefresh();
    showMessage(`已添加所有研究材料 x${quantity}`);
  };

  // 添加所有矿物材料
  const addAllMinerals = (quantity: number = 99) => {
    MINERAL_MATERIALS.forEach(mat => {
      gameManager.inventory.addItem(mat.id, quantity);
    });
    forceRefresh();
    showMessage(`已添加所有矿物材料 x${quantity}`);
  };

  // 添加星尘材料（用于研究）
  const addStardust = (quantity: number = 99) => {
    gameManager.inventory.addItem('mat_005_stardust', quantity);
    forceRefresh();
    showMessage(`已添加星尘传感基质 x${quantity}`);
  };

  // ==================== 战甲部件相关 ====================

  // 添加特定部位的战甲（所有品质）
  const addArmorPart = (slot: NanoArmorSlot) => {
    const recipe = getRecipeBySlot(slot);
    if (!recipe) return;

    // 检查背包空间（需要5个品质的位置）
    const usedSlots = gameManager.inventory.items.length + gameManager.inventory.equipment.length;
    const maxSlots = gameManager.inventory.maxSlots;
    const remainingSlots = maxSlots - usedSlots;

    if (remainingSlots < 5) {
      showMessage(`背包空间不足 (${usedSlots}/${maxSlots})，需要 5 个空位`);
      return;
    }

    [ArmorQuality.STARDUST, ArmorQuality.ALLOY, ArmorQuality.CRYSTAL, ArmorQuality.QUANTUM, ArmorQuality.VOID].forEach(quality => {
      const multiplier = [1, 1.2, 1.5, 2.0, 2.5][quality - 1];
      const equipmentInstance: EquipmentInstance = {
        id: recipe.id,
        instanceId: `${recipe.id}_${quality}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: `${ARMOR_QUALITY_NAMES[quality]}${recipe.name}`,
        slot: SLOT_MAPPING[slot],
        rarity: QUALITY_TO_RARITY[quality],
        level: 1,
        stationId: 'station_1',
        stationNumber: 1,
        description: recipe.description,
        stats: {
          attack: Math.floor((recipe.baseStats.attack || 0) * multiplier),
          defense: Math.floor((recipe.baseStats.defense || 0) * multiplier),
          hp: Math.floor((recipe.baseStats.hp || 0) * multiplier),
          agility: Math.floor((recipe.baseStats.speed || 0) * multiplier),
          hit: Math.floor((recipe.baseStats.hit || 0) * multiplier),
          dodge: Math.floor((recipe.baseStats.dodge || 0) * multiplier),
          speed: Math.floor((recipe.baseStats.speed || 0) * multiplier),
          crit: Math.floor(((recipe.baseStats.critRate || 0) * multiplier) * 100),
          critDamage: Math.floor(((recipe.baseStats.critDamage || 0) * multiplier) * 100),
          penetration: 0,
          penetrationPercent: 0,
          trueDamage: 0,
          guard: 0,
          luck: 0,
        },
        effects: [],
        quantity: 1,
        equipped: false,
        enhanceLevel: 0,
        sublimationLevel: 0,
        isCrafted: true,
      };
      gameManager.inventory.addEquipment(equipmentInstance);
    });

    forceRefresh();
    showMessage(`已添加${recipe.name}（全品质）`);
  };

  // 添加所有战甲部件（特定品质）
  const addAllArmorParts = (quality: ArmorQuality) => {
    const multiplier = [1, 1.2, 1.5, 2.0, 2.5][quality - 1];
    const slots = Object.values(NanoArmorSlot);

    // 检查背包空间
    const usedSlots = gameManager.inventory.items.length + gameManager.inventory.equipment.length;
    const maxSlots = gameManager.inventory.maxSlots;
    const remainingSlots = maxSlots - usedSlots;

    if (remainingSlots < slots.length) {
      showMessage(`背包空间不足 (${usedSlots}/${maxSlots})，需要 ${slots.length} 个空位`);
      return;
    }

    Object.values(NanoArmorSlot).forEach(slot => {
      const recipe = getRecipeBySlot(slot);
      if (!recipe) return;

      const equipmentInstance: EquipmentInstance = {
        id: recipe.id,
        instanceId: `${recipe.id}_${quality}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: `${ARMOR_QUALITY_NAMES[quality]}${recipe.name}`,
        slot: SLOT_MAPPING[slot],
        rarity: QUALITY_TO_RARITY[quality],
        level: 1,
        stationId: 'station_1',
        stationNumber: 1,
        description: recipe.description,
        stats: {
          attack: Math.floor((recipe.baseStats.attack || 0) * multiplier),
          defense: Math.floor((recipe.baseStats.defense || 0) * multiplier),
          hp: Math.floor((recipe.baseStats.hp || 0) * multiplier),
          agility: Math.floor((recipe.baseStats.speed || 0) * multiplier),
          hit: Math.floor((recipe.baseStats.hit || 0) * multiplier),
          dodge: Math.floor((recipe.baseStats.dodge || 0) * multiplier),
          speed: Math.floor((recipe.baseStats.speed || 0) * multiplier),
          crit: Math.floor(((recipe.baseStats.critRate || 0) * multiplier) * 100),
          critDamage: Math.floor(((recipe.baseStats.critDamage || 0) * multiplier) * 100),
          penetration: 0,
          penetrationPercent: 0,
          trueDamage: 0,
          guard: 0,
          luck: 0,
        },
        effects: [],
        quantity: 1,
        equipped: false,
        enhanceLevel: 0,
        sublimationLevel: 0,
        isCrafted: true,
      };
      gameManager.inventory.addEquipment(equipmentInstance);
    });

    forceRefresh();
    showMessage(`已添加整套${ARMOR_QUALITY_NAMES[quality]}战甲`);
  };

  // ==================== 玩家状态相关 ====================

  // 恢复所有状态
  const restoreAll = () => {
    const { gameManager } = useGameStore.getState();
    gameManager.player.hp = gameManager.player.maxHp;
    gameManager.player.stamina = gameManager.player.maxStamina;
    gameManager.player.spirit = gameManager.player.maxSpirit;
    forceRefresh();
    showMessage('✅ 已恢复所有状态');
  };

  // 只恢复生命值
  const restoreHp = () => {
    const { gameManager } = useGameStore.getState();
    gameManager.player.hp = gameManager.player.maxHp;
    forceRefresh();
    showMessage('❤️ 生命值已回满');
  };

  // 只恢复体力
  const restoreStamina = () => {
    const { gameManager } = useGameStore.getState();
    gameManager.player.stamina = gameManager.player.maxStamina;
    forceRefresh();
    showMessage('⚡ 体力已回满');
  };

  // ==================== 经验与等级 ====================

  // 升级
  const levelUp = () => {
    const oldLevel = gameManager.player.level;
    gameManager.player.addExp(gameManager.player.expToNextLevel);
    forceRefresh();
    showMessage(`⬆️ 升级！${oldLevel} → ${gameManager.player.level}`);
  };

  // 添加经验
  const addExp = (amount: number) => {
    gameManager.player.addExp(amount);
    forceRefresh();
    showMessage(`✨ 获得 ${amount} 经验值`);
  };

  // ==================== 货币与道具 ====================

  // 添加信用点
  const addCoins = (amount: number) => {
    const { gameManager } = useGameStore.getState();
    gameManager.trainCoins += amount;
    forceRefresh();
    showMessage(`💰 已添加 ${amount.toLocaleString()} 信用点`);
  };

  // 添加强化石
  const addEnhanceStones = (amount: number) => {
    const { gameManager } = useGameStore.getState();
    gameManager.inventory.addItem(ENHANCE_STONE_ID, amount);
    forceRefresh();
    showMessage(`💎 已添加 ${amount} 强化石`);
  };

  // ==================== 数据展示 ====================

  // 获取背包物品列表
  const inventoryItems = gameManager.inventory.getAllItems()
    .filter(item => item && item.id)
    .map(item => ({
      ...item,
      template: ITEMS[item.id],
    }))
    .filter(item => item.template);

  // 获取战甲装备列表
  const armorEquipment = gameManager.inventory.equipment;

  // 背包空间信息
  const usedSlots = gameManager.inventory.items.length + gameManager.inventory.equipment.length;
  const maxSlots = gameManager.inventory.maxSlots;
  const remainingSlots = maxSlots - usedSlots;

  // 计算材料数量
  const getMaterialCount = (baseId: string, quality: ArmorQuality) => {
    const qualityId = `${baseId}${QUALITY_SUFFIX[quality]}`;
    return gameManager.inventory.getItem(qualityId)?.quantity || 0;
  };

  return (
    <div style={{
      height: '100vh',
      backgroundColor: '#0a0e27',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* 顶部标题栏 */}
      <header style={{
        flexShrink: 0,
        backgroundColor: '#1a1f3a',
        borderBottom: '1px solid #2a3050',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              color: '#a1a1aa',
              fontSize: '20px',
              cursor: 'pointer',
            }}
          >
            ←
          </button>
          <h1 style={{ color: '#00d4ff', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
            🧪 系统测试
          </h1>
        </div>
      </header>

      {/* 标签页切换 */}
      <div style={{
        display: 'flex',
        gap: '8px',
        padding: '12px 16px',
        backgroundColor: '#1a1f3a',
        borderBottom: '1px solid #2a3050',
        overflowX: 'auto',
      }}>
        {([
          { key: 'items', label: '📦 物品', desc: '背包' },
          { key: 'materials', label: '🔧 材料', desc: '战甲材料' },
          { key: 'research', label: '🔬 研究', desc: '研究材料' },
          { key: 'armor', label: '🛡️ 战甲', desc: '战甲部件' },
          { key: 'player', label: '👤 玩家', desc: '状态/经验' },
          { key: 'facility', label: '🏛️ 设施', desc: '快速升级' },
        ] as const).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 16px',
              backgroundColor: activeTab === tab.key ? '#0099cc' : '#374151',
              color: activeTab === tab.key ? 'white' : '#a1a1aa',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: activeTab === tab.key ? 'bold' : 'normal',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 主内容区 */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
      }}>
        {/* ========== 物品标签 ========== */}
        {activeTab === 'items' && (
          <div>
            <h2 style={{ color: 'white', fontSize: '16px', marginBottom: '16px' }}>背包物品</h2>

            {/* 快捷操作 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
              <button
                onClick={() => addCoins(100000)}
                style={{
                  padding: '14px',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                💰 +100,000 信用点
              </button>
              <button
                onClick={() => addEnhanceStones(999)}
                style={{
                  padding: '14px',
                  backgroundColor: '#a855f7',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                💎 +999 强化石
              </button>
            </div>

            {/* 物品列表 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {inventoryItems.length === 0 ? (
                <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px' }}>背包为空</p>
              ) : (
                inventoryItems.map(item => (
                  <div
                    key={item.id}
                    style={{
                      padding: '12px',
                      backgroundColor: '#1f2937',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <span style={{
                        color: item.template ? RARITY_COLORS[item.template.rarity] : '#e5e7eb',
                        fontWeight: 'bold',
                      }}>
                        {item.template?.name || item.id}
                      </span>
                      <span style={{ color: '#6b7280', fontSize: '12px', marginLeft: '8px' }}>
                        {item.template && RARITY_NAMES[item.template.rarity]}
                      </span>
                    </div>
                    <span style={{ color: '#00d4ff', fontWeight: 'bold' }}>
                      x{item.quantity}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========== 材料标签 ========== */}
        {activeTab === 'materials' && (
          <div>
            <h2 style={{ color: 'white', fontSize: '16px', marginBottom: '16px' }}>纳米战甲材料</h2>

            {/* 快捷添加按钮 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <button
                onClick={() => addAllMaterials(99)}
                style={{
                  padding: '16px',
                  backgroundColor: '#0099cc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                ➕ 添加所有材料 x99（全品质）
              </button>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {[ArmorQuality.STARDUST, ArmorQuality.ALLOY, ArmorQuality.CRYSTAL, ArmorQuality.QUANTUM, ArmorQuality.VOID].map(quality => (
                  <button
                    key={quality}
                    onClick={() => addMaterialsByQuality(quality, 99)}
                    style={{
                      padding: '12px',
                      backgroundColor: ARMOR_QUALITY_COLORS[quality],
                      color: quality === ArmorQuality.STARDUST ? '#000' : 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                    }}
                  >
                    {ARMOR_QUALITY_NAMES[quality]} x99
                  </button>
                ))}
              </div>
            </div>

            {/* 材料列表 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {NANO_ARMOR_MATERIALS.map(mat => (
                <div key={mat.id} style={{
                  padding: '14px',
                  backgroundColor: '#1f2937',
                  borderRadius: '10px',
                }}>
                  <div style={{ color: 'white', fontWeight: 'bold', marginBottom: '10px', fontSize: '14px' }}>
                    {mat.name}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                    {[ArmorQuality.STARDUST, ArmorQuality.ALLOY, ArmorQuality.CRYSTAL, ArmorQuality.QUANTUM, ArmorQuality.VOID].map(quality => {
                      const count = getMaterialCount(mat.id, quality);
                      return (
                        <div
                          key={quality}
                          style={{
                            padding: '6px',
                            backgroundColor: count > 0 ? 'rgba(0,0,0,0.3)' : '#374151',
                            borderRadius: '6px',
                            textAlign: 'center',
                          }}
                        >
                          <div style={{
                            fontSize: '10px',
                            color: ARMOR_QUALITY_COLORS[quality],
                            marginBottom: '2px',
                          }}>
                            {ARMOR_QUALITY_NAMES[quality].slice(0, 2)}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: count > 0 ? '#4ade80' : '#6b7280',
                            fontWeight: 'bold',
                          }}>
                            {count}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========== 研究材料标签 ========== */}
        {activeTab === 'research' && (
          <div>
            <h2 style={{ color: 'white', fontSize: '16px', marginBottom: '16px' }}>🔬 研究材料</h2>

            {/* 快捷添加按钮 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <button
                onClick={() => addAllResearchMaterials(99)}
                style={{
                  padding: '16px',
                  background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                ➕ 添加所有研究材料 x99
              </button>
              <button
                onClick={() => addAllMinerals(99)}
                style={{
                  padding: '16px',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                ⛏️ 添加所有矿物材料 x99
              </button>
              <button
                onClick={() => addStardust(99)}
                style={{
                  padding: '16px',
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  color: '#000',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                ✨ 添加星尘传感基质 x99（采矿研究用）
              </button>
            </div>

            {/* 研究材料列表 */}
            <h3 style={{ color: '#a855f7', fontSize: '14px', marginBottom: '12px' }}>研究专用材料</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
              {RESEARCH_MATERIALS.map(mat => {
                const count = gameManager.inventory.getItemCount(mat.id);
                return (
                  <div
                    key={mat.id}
                    style={{
                      padding: '14px',
                      backgroundColor: '#1f2937',
                      borderRadius: '10px',
                      borderLeft: `4px solid ${mat.color}`,
                    }}
                  >
                    <div style={{ color: mat.color, fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>
                      {mat.name}
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '11px', marginBottom: '8px' }}>
                      {mat.desc}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: count > 0 ? '#4ade80' : '#6b7280', fontSize: '13px', fontWeight: 'bold' }}>
                        x{count}
                      </span>
                      <button
                        onClick={() => {
                          gameManager.inventory.addItem(mat.id, 99);
                          forceRefresh();
                          showMessage(`已添加 ${mat.name} x99`);
                        }}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: mat.color,
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '11px',
                          cursor: 'pointer',
                        }}
                      >
                        +99
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 矿物列表 */}
            <h3 style={{ color: '#f59e0b', fontSize: '14px', marginBottom: '12px' }}>矿物材料</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {MINERAL_MATERIALS.map(mat => {
                const count = gameManager.inventory.getItemCount(mat.id);
                return (
                  <div
                    key={mat.id}
                    style={{
                      padding: '12px',
                      backgroundColor: '#1f2937',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <span style={{ color: mat.color, fontWeight: 'bold', fontSize: '13px' }}>{mat.name}</span>
                      <span style={{ color: count > 0 ? '#4ade80' : '#6b7280', fontSize: '12px', marginLeft: '10px' }}>
                        x{count}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        gameManager.inventory.addItem(mat.id, 99);
                        forceRefresh();
                        showMessage(`已添加 ${mat.name} x99`);
                      }}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#374151',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '11px',
                        cursor: 'pointer',
                      }}
                    >
                      +99
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========== 战甲标签 ========== */}
        {activeTab === 'armor' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ color: 'white', fontSize: '16px', margin: 0 }}>战甲部件获取</h2>
              <span style={{
                color: remainingSlots < 6 ? '#ef4444' : '#4ade80',
                fontSize: '12px',
                backgroundColor: 'rgba(0,0,0,0.3)',
                padding: '4px 10px',
                borderRadius: '4px',
              }}>
                背包: {usedSlots}/{maxSlots} (剩{remainingSlots})
              </span>
            </div>

            {/* 品质选择 */}
            <div style={{
              backgroundColor: '#1f2937',
              borderRadius: '10px',
              padding: '14px',
              marginBottom: '16px',
            }}>
              <div style={{ color: '#a1a1aa', fontSize: '12px', marginBottom: '10px' }}>选择要添加的品质</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[ArmorQuality.STARDUST, ArmorQuality.ALLOY, ArmorQuality.CRYSTAL, ArmorQuality.QUANTUM, ArmorQuality.VOID].map(quality => (
                  <button
                    key={quality}
                    onClick={() => setSelectedArmorQuality(quality)}
                    style={{
                      padding: '10px 14px',
                      backgroundColor: selectedArmorQuality === quality ? ARMOR_QUALITY_COLORS[quality] : '#374151',
                      color: selectedArmorQuality === quality ? (quality === ArmorQuality.STARDUST ? '#000' : 'white') : ARMOR_QUALITY_COLORS[quality],
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                    }}
                  >
                    {ARMOR_QUALITY_NAMES[quality]}
                  </button>
                ))}
              </div>
            </div>

            {/* 添加整套按钮 */}
            <button
              onClick={() => addAllArmorParts(selectedArmorQuality)}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: ARMOR_QUALITY_COLORS[selectedArmorQuality],
                color: selectedArmorQuality === ArmorQuality.STARDUST ? '#000' : 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '16px',
              }}
            >
              🛡️ 添加整套{ARMOR_QUALITY_NAMES[selectedArmorQuality]}战甲（6件）
            </button>

            {/* 单独添加各部位 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {Object.values(NanoArmorSlot).map(slot => (
                <button
                  key={slot}
                  onClick={() => addArmorPart(slot)}
                  style={{
                    padding: '14px',
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span style={{ fontSize: '28px' }}>{NANO_ARMOR_SLOT_ICONS[slot]}</span>
                  <span style={{ color: '#e5e7eb', fontSize: '12px', fontWeight: 'bold' }}>
                    {NANO_ARMOR_SLOT_NAMES[slot]}
                  </span>
                  <span style={{ color: '#6b7280', fontSize: '10px' }}>
                    点击添加全品质
                  </span>
                </button>
              ))}
            </div>

            {/* 当前拥有的战甲 */}
            <h3 style={{ color: 'white', fontSize: '14px', margin: '24px 0 12px 0' }}>已拥有的战甲</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {armorEquipment.length === 0 ? (
                <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>暂无战甲装备</p>
              ) : (
                armorEquipment.map(equip => (
                  <div
                    key={equip.instanceId}
                    style={{
                      padding: '12px',
                      backgroundColor: '#1f2937',
                      borderRadius: '8px',
                      borderLeft: `4px solid ${RARITY_COLORS[equip.rarity]}`,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: RARITY_COLORS[equip.rarity], fontWeight: 'bold' }}>
                        {equip.name}
                      </span>
                      <span style={{ color: '#6b7280', fontSize: '11px' }}>
                        {equip.equipped ? '已装备' : '未装备'}
                      </span>
                    </div>
                    <div style={{ color: '#a1a1aa', fontSize: '11px', marginTop: '4px' }}>
                      攻击:{equip.stats.attack} 防御:{equip.stats.defense} 生命:{equip.stats.hp} 攻速:{equip.stats.speed}
                      {equip.stats.hit > 0 && ` 命中:${equip.stats.hit}`}
                      {equip.stats.dodge > 0 && ` 闪避:${equip.stats.dodge}`}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========== 玩家标签 ========== */}
        {activeTab === 'player' && (
          <div>
            <h2 style={{ color: 'white', fontSize: '16px', marginBottom: '16px' }}>玩家状态管理</h2>

            {/* 状态恢复 */}
            <div style={{
              backgroundColor: '#1f2937',
              borderRadius: '10px',
              padding: '16px',
              marginBottom: '16px',
            }}>
              <h3 style={{ color: '#00d4ff', fontSize: '13px', margin: '0 0 12px 0' }}>⚡ 状态恢复</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                <button
                  onClick={restoreAll}
                  style={{
                    padding: '14px',
                    backgroundColor: '#22c55e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    gridColumn: 'span 2',
                  }}
                >
                  💚 恢复所有状态
                </button>
                <button
                  onClick={restoreHp}
                  style={{
                    padding: '12px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  ❤️ 回满生命
                </button>
                <button
                  onClick={restoreStamina}
                  style={{
                    padding: '12px',
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  ⚡ 回满体力
                </button>
              </div>
            </div>

            {/* 经验与等级 */}
            <div style={{
              backgroundColor: '#1f2937',
              borderRadius: '10px',
              padding: '16px',
              marginBottom: '16px',
            }}>
              <h3 style={{ color: '#f59e0b', fontSize: '13px', margin: '0 0 12px 0' }}>✨ 经验与等级</h3>

              {/* 当前状态 */}
              <div style={{
                backgroundColor: '#0f172a',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '12px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#a1a1aa' }}>当前等级</span>
                  <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>Lv.{gameManager.player.level}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#a1a1aa' }}>当前经验</span>
                  <span style={{ color: '#e5e7eb' }}>{gameManager.player.exp} / {gameManager.player.expToNextLevel}</span>
                </div>
              </div>

              {/* 操作按钮 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={levelUp}
                  style={{
                    padding: '14px',
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  ⬆️ 升 1 级
                </button>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                  <button
                    onClick={() => addExp(100)}
                    style={{
                      padding: '10px',
                      backgroundColor: '#374151',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    +100 经验
                  </button>
                  <button
                    onClick={() => addExp(1000)}
                    style={{
                      padding: '10px',
                      backgroundColor: '#374151',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    +1000 经验
                  </button>
                  <button
                    onClick={() => addExp(10000)}
                    style={{
                      padding: '10px',
                      backgroundColor: '#374151',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    +10000 经验
                  </button>
                </div>
              </div>
            </div>

            {/* 完整状态面板 */}
            <div style={{
              backgroundColor: '#1f2937',
              borderRadius: '10px',
              padding: '16px',
            }}>
              <h3 style={{ color: '#a855f7', fontSize: '13px', margin: '0 0 12px 0' }}>📊 完整状态</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {[
                  { label: '生命值', value: `${gameManager.player.hp}/${gameManager.player.maxHp}`, color: '#ef4444' },
                  { label: '体力值', value: `${gameManager.player.stamina}/${gameManager.player.maxStamina}`, color: '#f59e0b' },
                  { label: '精神值', value: `${gameManager.player.spirit}/${gameManager.player.maxSpirit}`, color: '#a855f7' },
                  { label: '攻击力', value: gameManager.player.attack, color: '#f87171' },
                  { label: '防御力', value: gameManager.player.defense, color: '#60a5fa' },
                  { label: '速度', value: gameManager.player.speed, color: '#22c55e' },
                ].map(stat => (
                  <div
                    key={stat.label}
                    style={{
                      padding: '10px',
                      backgroundColor: '#0f172a',
                      borderRadius: '6px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ color: '#6b7280', fontSize: '11px', marginBottom: '4px' }}>{stat.label}</div>
                    <div style={{ color: stat.color, fontSize: '14px', fontWeight: 'bold' }}>{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========== 设施标签 ========== */}
        {activeTab === 'facility' && (
          <div>
            <h2 style={{ color: 'white', fontSize: '16px', marginBottom: '16px' }}>🏛️ 科研实验室 - 快速升级设施</h2>

            {/* 设施列表 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* 采矿平台 */}
              <div style={{
                backgroundColor: '#1f2937',
                borderRadius: '10px',
                padding: '16px',
                borderLeft: '4px solid #f59e0b',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '20px', marginRight: '8px' }}>⛏️</span>
                    <span style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '15px' }}>采矿平台</span>
                  </div>
                  <span style={{ color: '#a1a1aa', fontSize: '12px' }}>
                    Lv.{gameManager.getMiningLevel()}/5
                  </span>
                </div>
                <button
                  onClick={() => {
                    const currentLevel = gameManager.getMiningLevel();
                    if (currentLevel >= 5) {
                      showMessage('采矿平台已满级');
                      return;
                    }
                    gameManager.completedResearch.push(`mining_lv${currentLevel + 1}`);
                    forceRefresh();
                    showMessage(`采矿平台升级到 Lv.${currentLevel + 1}`);
                  }}
                  disabled={gameManager.getMiningLevel() >= 5}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: gameManager.getMiningLevel() >= 5 ? '#374151' : '#f59e0b',
                    color: gameManager.getMiningLevel() >= 5 ? '#6b7280' : 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    cursor: gameManager.getMiningLevel() >= 5 ? 'not-allowed' : 'pointer',
                  }}
                >
                  {gameManager.getMiningLevel() >= 5 ? '已满级' : '升级 +1'}
                </button>
              </div>

              {/* 芯片研发 */}
              <div style={{
                backgroundColor: '#1f2937',
                borderRadius: '10px',
                padding: '16px',
                borderLeft: '4px solid #00d4ff',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '20px', marginRight: '8px' }}>💾</span>
                    <span style={{ color: '#00d4ff', fontWeight: 'bold', fontSize: '15px' }}>芯片研发</span>
                  </div>
                  <span style={{ color: '#a1a1aa', fontSize: '12px' }}>
                    Lv.{gameManager.getChipLevel()}/3
                  </span>
                </div>
                <button
                  onClick={() => {
                    const currentLevel = gameManager.getChipLevel();
                    if (currentLevel >= 3) {
                      showMessage('芯片研发已满级');
                      return;
                    }
                    gameManager.completedResearch.push(`chip_lv${currentLevel + 1}`);
                    forceRefresh();
                    showMessage(`芯片研发升级到 Lv.${currentLevel + 1}`);
                  }}
                  disabled={gameManager.getChipLevel() >= 3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: gameManager.getChipLevel() >= 3 ? '#374151' : '#00d4ff',
                    color: gameManager.getChipLevel() >= 3 ? '#6b7280' : 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    cursor: gameManager.getChipLevel() >= 3 ? 'not-allowed' : 'pointer',
                  }}
                >
                  {gameManager.getChipLevel() >= 3 ? '已满级' : '升级 +1'}
                </button>
              </div>

              {/* 机械飞升 */}
              <div style={{
                backgroundColor: '#1f2937',
                borderRadius: '10px',
                padding: '16px',
                borderLeft: '4px solid #a855f7',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '20px', marginRight: '8px' }}>🦾</span>
                    <span style={{ color: '#a855f7', fontWeight: 'bold', fontSize: '15px' }}>机械飞升</span>
                  </div>
                  <span style={{ color: '#a1a1aa', fontSize: '12px' }}>
                    Lv.{gameManager.getCyberneticLevel()}/3
                  </span>
                </div>
                <button
                  onClick={() => {
                    const currentLevel = gameManager.getCyberneticLevel();
                    if (currentLevel >= 3) {
                      showMessage('机械飞升已满级');
                      return;
                    }
                    gameManager.completedResearch.push(`cybernetic_lv${currentLevel + 1}`);
                    forceRefresh();
                    showMessage(`机械飞升升级到 Lv.${currentLevel + 1}`);
                  }}
                  disabled={gameManager.getCyberneticLevel() >= 3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: gameManager.getCyberneticLevel() >= 3 ? '#374151' : '#a855f7',
                    color: gameManager.getCyberneticLevel() >= 3 ? '#6b7280' : 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    cursor: gameManager.getCyberneticLevel() >= 3 ? 'not-allowed' : 'pointer',
                  }}
                >
                  {gameManager.getCyberneticLevel() >= 3 ? '已满级' : '升级 +1'}
                </button>
              </div>
            </div>

            {/* 一键满级所有设施 */}
            <button
              onClick={() => {
                // 采矿平台满级
                for (let i = 2; i <= 5; i++) {
                  if (!gameManager.completedResearch.includes(`mining_lv${i}`)) {
                    gameManager.completedResearch.push(`mining_lv${i}`);
                  }
                }
                // 芯片研发满级
                for (let i = 2; i <= 3; i++) {
                  if (!gameManager.completedResearch.includes(`chip_lv${i}`)) {
                    gameManager.completedResearch.push(`chip_lv${i}`);
                  }
                }
                // 基因工程满级
                for (let i = 2; i <= 5; i++) {
                  if (!gameManager.completedResearch.includes(`gene_lv${i}`)) {
                    gameManager.completedResearch.push(`gene_lv${i}`);
                  }
                }
                // 机械飞升满级
                for (let i = 2; i <= 3; i++) {
                  if (!gameManager.completedResearch.includes(`cybernetic_lv${i}`)) {
                    gameManager.completedResearch.push(`cybernetic_lv${i}`);
                  }
                }
                forceRefresh();
                showMessage('✅ 所有设施已满级');
              }}
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '16px',
                background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              🚀 一键满级所有设施
            </button>
          </div>
        )}
      </main>

      {/* 消息提示 */}
      {message && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '14px 24px',
          backgroundColor: '#065f46',
          color: '#4ade80',
          borderRadius: '10px',
          zIndex: 100,
          fontWeight: 'bold',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}>
          {message}
        </div>
      )}
    </div>
  );
}
