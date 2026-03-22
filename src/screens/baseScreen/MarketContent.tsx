import { useState, useEffect } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { FacilityType } from '../../core/BaseFacilitySystem';
import { MessageToast, useMessage } from './shared';

interface ShopItem {
  id: string;
  name: string;
  icon: string;
  price: number;
  category: 'material' | 'mineral' | 'ticket';
}

interface DailyDeal {
  itemId: string;
  discount: number;
  endTime: number;
}

const SHOP_ITEMS: ShopItem[] = [
  { id: 'gene_material', name: '基因材料', icon: '🧬', price: 200, category: 'material' },
  { id: 'cyber_material', name: '义体材料', icon: '⚙️', price: 200, category: 'material' },
  { id: 'chip_material', name: '芯片材料', icon: '💾', price: 200, category: 'material' },
  { id: 'mineral_iron', name: '铁矿', icon: '⛏️', price: 30, category: 'mineral' },
  { id: 'mineral_copper', name: '铜矿', icon: '🟤', price: 50, category: 'mineral' },
  { id: 'mineral_titanium', name: '钛矿', icon: '🔩', price: 80, category: 'mineral' },
  { id: 'mineral_crystal', name: '水晶矿', icon: '💎', price: 200, category: 'mineral' },
  { id: 'mineral_quantum', name: '量子矿', icon: '⚛️', price: 1000, category: 'mineral' },
  { id: 'recruit_ticket_normal', name: '招募票', icon: '🎫', price: 500, category: 'ticket' },
];

const CATEGORY_CONFIG = {
  material: { name: '材料', icon: '📦', color: '#22c55e' },
  mineral: { name: '矿物', icon: '⛏️', color: '#3b82f6' },
  ticket: { name: '招募票', icon: '🎫', color: '#f59e0b' },
};

const STORAGE_KEY_DEALS = 'market_daily_deals';

function generateDailyDeals(): DailyDeal[] {
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  
  const availableItems = SHOP_ITEMS.filter(item => item.price >= 100);
  const shuffled = availableItems.sort(() => Math.random() - 0.5);
  const selectedItems = shuffled.slice(0, 3);
  
  return selectedItems.map(item => ({
    itemId: item.id,
    discount: [20, 30, 40, 50][Math.floor(Math.random() * 4)],
    endTime: endOfDay.getTime(),
  }));
}

function loadDailyDeals(): DailyDeal[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_DEALS);
    if (!stored) return generateDailyDeals();
    
    const deals: DailyDeal[] = JSON.parse(stored);
    const now = Date.now();
    
    const validDeals = deals.filter(deal => deal.endTime > now);
    if (validDeals.length === 0) {
      return generateDailyDeals();
    }
    return validDeals;
  } catch {
    return generateDailyDeals();
  }
}

function saveDailyDeals(deals: DailyDeal[]) {
  localStorage.setItem(STORAGE_KEY_DEALS, JSON.stringify(deals));
}

export function MarketContent() {
  const { gameManager, saveGame } = useGameStore();
  const [activeCategory, setActiveCategory] = useState<'material' | 'mineral' | 'ticket'>('material');
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [dailyDeals, setDailyDeals] = useState<DailyDeal[]>(loadDailyDeals);
  const [countdown, setCountdown] = useState('');
  const { message, showMessage } = useMessage();

  const level = gameManager.getFacilityLevel(FacilityType.MARKET);
  const trainCoins = gameManager.trainCoins;

  useEffect(() => {
    saveDailyDeals(dailyDeals);
  }, [dailyDeals]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const deal = dailyDeals[0];
      if (deal) {
        const remaining = deal.endTime - now;
        if (remaining > 0) {
          const hours = Math.floor(remaining / 3600000);
          const minutes = Math.floor((remaining % 3600000) / 60000);
          const seconds = Math.floor((remaining % 60000) / 1000);
          setCountdown(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        } else {
          setDailyDeals(generateDailyDeals());
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [dailyDeals]);

  const handleBuy = async (item: ShopItem, quantity: number, discount?: number) => {
    const finalPrice = discount ? Math.floor(item.price * (1 - discount / 100)) : item.price;
    const totalPrice = finalPrice * quantity;
    
    if (trainCoins < totalPrice) {
      showMessage('信用点不足', 'error');
      return;
    }

    gameManager.trainCoins -= totalPrice;
    gameManager.inventory.addItem(item.id, quantity);
    
    showMessage(`购买成功: ${item.name} x${quantity}`, 'success');
    setSelectedItem(null);
    setBuyQuantity(1);
    await saveGame();
  };

  const filteredItems = SHOP_ITEMS.filter(item => item.category === activeCategory);

  const renderDealBanner = () => {
    if (dailyDeals.length === 0) return null;
    
    return (
      <div style={{
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(251, 191, 36, 0.2) 100%)',
        borderRadius: '12px',
        padding: '12px 16px',
        marginBottom: '12px',
        border: '1px solid rgba(251, 191, 36, 0.3)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          animation: 'shimmer 2s infinite',
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>🔥</span>
            <span style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '14px' }}>每日特惠</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#f87171', fontSize: '12px' }}>剩余时间</span>
            <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px', fontFamily: 'monospace' }}>{countdown}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
          {dailyDeals.map(deal => {
            const item = SHOP_ITEMS.find(i => i.id === deal.itemId);
            if (!item) return null;
            const discountedPrice = Math.floor(item.price * (1 - deal.discount / 100));
            return (
              <div
                key={deal.itemId}
                onClick={() => setSelectedItem(item)}
                style={{
                  minWidth: '100px',
                  padding: '8px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '8px',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  background: '#ef4444',
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  padding: '2px 6px',
                  borderRadius: '4px',
                }}>
                  -{deal.discount}%
                </div>
                <div style={{ fontSize: '24px' }}>{item.icon}</div>
                <div style={{ color: '#fff', fontSize: '11px', fontWeight: 'bold', marginTop: '4px' }}>{item.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '4px' }}>
                  <span style={{ color: '#9ca3af', fontSize: '10px', textDecoration: 'line-through' }}>{item.price}</span>
                  <span style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 'bold' }}>{discountedPrice}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderItemCard = (item: ShopItem) => {
    const deal = dailyDeals.find(d => d.itemId === item.id);
    const discountedPrice = deal ? Math.floor(item.price * (1 - deal.discount / 100)) : null;
    const categoryColor = CATEGORY_CONFIG[item.category].color;

    return (
      <div
        key={item.id}
        onClick={() => { setSelectedItem(item); setBuyQuantity(1); }}
        style={{
          position: 'relative',
          background: 'rgba(20, 20, 30, 0.8)',
          borderRadius: '12px',
          padding: '10px 12px',
          border: `1px solid ${categoryColor}30`,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: selectedItem?.id === item.id ? `0 0 15px ${categoryColor}40` : 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = `0 4px 15px ${categoryColor}30`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = selectedItem?.id === item.id ? `0 0 15px ${categoryColor}40` : 'none';
        }}
      >
        {deal && (
          <div style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            background: 'linear-gradient(135deg, #ef4444, #f97316)',
            color: '#fff',
            fontSize: '10px',
            fontWeight: 'bold',
            padding: '2px 6px',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
          }}>
            -{deal.discount}%
          </div>
        )}
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: `${categoryColor}15`,
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
          }}>
            {item.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '13px' }}>{item.name}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            {discountedPrice ? (
              <>
                <div style={{ color: '#9ca3af', fontSize: '10px', textDecoration: 'line-through' }}>{item.price}</div>
                <div style={{ color: '#fbbf24', fontSize: '14px', fontWeight: 'bold' }}>💰 {discountedPrice}</div>
              </>
            ) : (
              <div style={{ color: '#fbbf24', fontSize: '14px', fontWeight: 'bold' }}>💰 {item.price}</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderPurchaseModal = () => {
    if (!selectedItem) return null;

    const deal = dailyDeals.find(d => d.itemId === selectedItem.id);
    const discountedPrice = deal ? Math.floor(selectedItem.price * (1 - deal.discount / 100)) : selectedItem.price;
    const totalPrice = discountedPrice * buyQuantity;
    const canAfford = trainCoins >= totalPrice;
    const categoryColor = CATEGORY_CONFIG[selectedItem.category].color;

    return (
      <div
        onClick={() => setSelectedItem(null)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          zIndex: 1000,
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '400px',
            background: 'linear-gradient(180deg, rgba(30, 30, 50, 0.98) 0%, rgba(20, 20, 35, 0.98) 100%)',
            borderRadius: '20px 20px 0 0',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderTop: `3px solid ${categoryColor}`,
            animation: 'slideUp 0.3s ease-out',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: `${categoryColor}20`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
              }}>
                {selectedItem.icon}
              </div>
              <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>{selectedItem.name}</div>
            </div>
            <button
              onClick={() => setSelectedItem(null)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              ✕
            </button>
          </div>

          {deal && (
            <div style={{
              background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.2), rgba(251, 191, 36, 0.2))',
              borderRadius: '8px',
              padding: '8px 12px',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{ fontSize: '16px' }}>🔥</span>
              <span style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 'bold' }}>限时特惠 -{deal.discount}%</span>
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '8px' }}>购买数量</div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
              <button
                onClick={() => setBuyQuantity(Math.max(1, buyQuantity - 1))}
                style={{
                  width: '40px',
                  height: '40px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '18px',
                }}
              >-</button>
              <input
                type="number"
                value={buyQuantity}
                onChange={(e) => setBuyQuantity(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))}
                style={{
                  width: '60px',
                  height: '40px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: '#fff',
                  textAlign: 'center',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}
              />
              <button
                onClick={() => setBuyQuantity(Math.min(99, buyQuantity + 1))}
                style={{
                  width: '40px',
                  height: '40px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '18px',
                }}
              >+</button>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '8px' }}>
              {[1, 10, 50, 99].map(qty => (
                <button
                  key={qty}
                  onClick={() => setBuyQuantity(qty)}
                  style={{
                    padding: '6px 12px',
                    background: buyQuantity === qty ? `${categoryColor}30` : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${buyQuantity === qty ? categoryColor : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '6px',
                    color: buyQuantity === qty ? categoryColor : '#9ca3af',
                    cursor: 'pointer',
                    fontSize: '11px',
                  }}
                >
                  x{qty}
                </button>
              ))}
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '10px',
            marginBottom: '16px',
          }}>
            <div>
              <div style={{ color: '#9ca3af', fontSize: '11px' }}>单价</div>
              <div style={{ color: '#fbbf24', fontSize: '14px' }}>💰 {discountedPrice}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#9ca3af', fontSize: '11px' }}>总价</div>
              <div style={{ color: canAfford ? '#fbbf24' : '#ef4444', fontSize: '18px', fontWeight: 'bold' }}>
                💰 {totalPrice.toLocaleString()}
              </div>
            </div>
          </div>

          <button
            onClick={() => handleBuy(selectedItem, buyQuantity, deal?.discount)}
            disabled={!canAfford}
            style={{
              width: '100%',
              padding: '14px',
              background: canAfford
                ? `linear-gradient(135deg, ${categoryColor}, ${categoryColor}aa)`
                : 'rgba(100, 100, 100, 0.3)',
              border: 'none',
              borderRadius: '12px',
              color: canAfford ? '#fff' : '#666',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: canAfford ? 'pointer' : 'not-allowed',
              boxShadow: canAfford ? `0 4px 20px ${categoryColor}40` : 'none',
            }}
          >
            {canAfford ? '确认购买' : '信用点不足'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: 'relative' }}>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <MessageToast message={message} />

      <div style={{
        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
        borderRadius: '12px',
        padding: '12px 16px',
        marginBottom: '12px',
        border: '1px solid rgba(236, 72, 153, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>🏪</span>
          <span style={{ color: '#ec4899', fontWeight: 'bold', fontSize: '13px' }}>星际市场</span>
          <span style={{ color: '#a855f7', fontSize: '11px', background: 'rgba(168, 85, 247, 0.2)', padding: '2px 8px', borderRadius: '4px' }}>
            Lv.{level}
          </span>
        </div>
        <div style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '14px' }}>
          💰 {trainCoins.toLocaleString()}
        </div>
      </div>

      {renderDealBanner()}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
          <button
            key={key}
            onClick={() => { setActiveCategory(key as typeof activeCategory); setSelectedItem(null); }}
            style={{
              flex: 1,
              padding: '10px',
              background: activeCategory === key ? `${config.color}30` : 'rgba(255, 255, 255, 0.03)',
              border: activeCategory === key ? `1px solid ${config.color}` : '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              color: activeCategory === key ? config.color : '#6b7280',
              fontWeight: 'bold',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            {config.icon} {config.name}
          </button>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '8px',
        maxHeight: '320px',
        overflowY: 'auto',
        paddingRight: '4px',
      }}>
        {filteredItems.map(item => renderItemCard(item))}
      </div>

      {renderPurchaseModal()}
    </div>
  );
}
