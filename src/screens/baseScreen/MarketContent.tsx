import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { FacilityType } from '../../core/BaseFacilitySystem';
import { MessageToast, useMessage } from './shared';
import { styles, colors } from './styles';

interface ShopItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  price: number;
  category: 'material' | 'mineral' | 'ticket';
}

const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'gene_material',
    name: '基因材料',
    icon: '🧬',
    description: '用于基因编辑的材料',
    price: 200,
    category: 'material',
  },
  {
    id: 'cyber_material',
    name: '义体材料',
    icon: '⚙️',
    description: '用于义体改造的材料',
    price: 200,
    category: 'material',
  },
  {
    id: 'chip_material',
    name: '芯片材料',
    icon: '💾',
    description: '用于芯片研发的材料',
    price: 200,
    category: 'material',
  },
  {
    id: 'mineral_iron',
    name: '铁矿',
    icon: '⛏️',
    description: '最基础的矿物',
    price: 30,
    category: 'mineral',
  },
  {
    id: 'mineral_copper',
    name: '铜矿',
    icon: '🟤',
    description: '常用的导电矿物',
    price: 50,
    category: 'mineral',
  },
  {
    id: 'mineral_titanium',
    name: '钛矿',
    icon: '🔩',
    description: '高强度合金矿物',
    price: 80,
    category: 'mineral',
  },
  {
    id: 'mineral_crystal',
    name: '水晶矿',
    icon: '💎',
    description: '稀有晶体矿物',
    price: 200,
    category: 'mineral',
  },
  {
    id: 'mineral_quantum',
    name: '量子矿',
    icon: '⚛️',
    description: '极其稀有的量子材料',
    price: 1000,
    category: 'mineral',
  },
  {
    id: 'recruit_ticket_normal',
    name: '普通招募票',
    icon: '🎫',
    description: '用于招募普通战甲',
    price: 500,
    category: 'ticket',
  },
  {
    id: 'recruit_ticket_limited',
    name: '限定招募票',
    icon: '🎟️',
    description: '用于招募限定战甲',
    price: 2000,
    category: 'ticket',
  },
];

const CATEGORY_CONFIG = {
  material: { name: '材料', icon: '📦', color: '#22c55e' },
  mineral: { name: '矿物', icon: '⛏️', color: '#3b82f6' },
  ticket: { name: '招募票', icon: '🎫', color: '#f59e0b' },
};

export function MarketContent() {
  const { gameManager, saveGame } = useGameStore();
  const [activeCategory, setActiveCategory] = useState<'material' | 'mineral' | 'ticket'>('material');
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [buyQuantity, setBuyQuantity] = useState(1);
  const { message, showMessage } = useMessage();

  const level = gameManager.getFacilityLevel(FacilityType.MARKET);
  const trainCoins = gameManager.trainCoins;

  const handleBuy = async () => {
    if (!selectedItem) return;
    
    const totalPrice = selectedItem.price * buyQuantity;
    
    if (trainCoins < totalPrice) {
      showMessage('信用点不足', 'error');
      return;
    }

    gameManager.trainCoins -= totalPrice;
    gameManager.inventory.addItem(selectedItem.id, buyQuantity);
    
    showMessage(`购买成功: ${selectedItem.name} x${buyQuantity}`, 'success');
    setSelectedItem(null);
    setBuyQuantity(1);
    await saveGame();
  };

  const filteredItems = SHOP_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div style={{ position: 'relative' }}>
      <MessageToast message={message} />

      <div style={styles.statsBox(colors.market)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
          <div><span style={styles.label}>商店等级: </span><span style={{ color: colors.market, fontWeight: 'bold' }}>Lv.{level}</span></div>
          <div><span style={styles.label}>信用点: </span><span style={{ color: '#fbbf24', fontWeight: 'bold' }}>💰 {trainCoins.toLocaleString()}</span></div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
          <button
            key={key}
            onClick={() => { setActiveCategory(key as typeof activeCategory); setSelectedItem(null); }}
            style={styles.tabButton(activeCategory === key, config.color)}
          >
            {config.icon} {config.name}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ flex: 1, maxHeight: '280px', overflowY: 'auto' }}>
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => { setSelectedItem(item); setBuyQuantity(1); }}
              style={{
                ...styles.cardBox(CATEGORY_CONFIG[item.category].color, selectedItem?.id === item.id),
                padding: '12px',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{item.icon}</span>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '13px' }}>{item.name}</div>
                    <div style={{ ...styles.label, fontSize: '10px' }}>{item.description}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 'bold' }}>💰 {item.price}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedItem && (
          <div style={{ width: '160px', padding: '12px', background: `${CATEGORY_CONFIG[selectedItem.category].color}15`, borderRadius: '12px', border: `1px solid ${CATEGORY_CONFIG[selectedItem.category].color}40` }}>
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '32px' }}>{selectedItem.icon}</span>
              <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px', marginTop: '8px' }}>{selectedItem.name}</div>
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <div style={{ ...styles.label, fontSize: '11px', marginBottom: '4px' }}>购买数量</div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }}>
                <button
                  onClick={() => setBuyQuantity(Math.max(1, buyQuantity - 1))}
                  style={{ width: '28px', height: '28px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '4px', color: '#fff', cursor: 'pointer', fontSize: '14px' }}
                >-</button>
                <span style={{ color: '#fff', fontSize: '14px', minWidth: '30px', textAlign: 'center' }}>{buyQuantity}</span>
                <button
                  onClick={() => setBuyQuantity(Math.min(99, buyQuantity + 1))}
                  style={{ width: '28px', height: '28px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '4px', color: '#fff', cursor: 'pointer', fontSize: '14px' }}
                >+</button>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <div style={{ ...styles.label, fontSize: '11px' }}>总价</div>
              <div style={{ color: '#fbbf24', fontSize: '16px', fontWeight: 'bold' }}>💰 {(selectedItem.price * buyQuantity).toLocaleString()}</div>
            </div>

            <button
              onClick={handleBuy}
              disabled={trainCoins < selectedItem.price * buyQuantity}
              style={{
                ...styles.primaryButton(CATEGORY_CONFIG[selectedItem.category].color),
                padding: '10px',
                fontSize: '12px',
                width: '100%',
                opacity: trainCoins < selectedItem.price * buyQuantity ? 0.5 : 1,
                cursor: trainCoins < selectedItem.price * buyQuantity ? 'not-allowed' : 'pointer',
              }}
            >
              {trainCoins < selectedItem.price * buyQuantity ? '信用点不足' : '购买'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
