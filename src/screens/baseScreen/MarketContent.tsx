import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { FacilityType } from '../../core/BaseFacilitySystem';
import { MARKET_ITEM_TYPE_CONFIG, MARKET_RARITY_CONFIG } from '../../core/MarketSystem';
import { MessageToast, type MessageState } from './shared';
import { styles, colors } from './styles';

export function MarketContent() {
  const { gameManager, saveGame, getMarketListings, getPlayerListings, listMarketItem, cancelMarketListing, buyMarketItem, refreshMarket } = useGameStore();
  const [activeTab, setActiveTab] = useState<'buy' | 'sell' | 'my'>('buy');
  const [selectedItem, setSelectedItem] = useState<{ id: string; name: string; quantity: number } | null>(null);
  const [sellPrice, setSellPrice] = useState(100);
  const [sellQuantity, setSellQuantity] = useState(1);
  const [message, setMessage] = useState<MessageState | null>(null);

  const listings = getMarketListings();
  const myListings = getPlayerListings();
  const level = gameManager.getFacilityLevel(FacilityType.MARKET);

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleBuy = async (listingId: string) => {
    const result = buyMarketItem(listingId);
    if (result.success) { showMessage(result.message, 'success'); await saveGame(); }
    else { showMessage(result.message, 'error'); }
  };

  const handleSell = async () => {
    if (!selectedItem) return;
    const result = listMarketItem(selectedItem.id, sellQuantity, sellPrice);
    if (result.success) { showMessage('挂单成功', 'success'); setSelectedItem(null); await saveGame(); }
    else { showMessage(result.message, 'error'); }
  };

  const handleCancel = async (listingId: string) => {
    const result = cancelMarketListing(listingId);
    if (result.success) { showMessage(result.message, 'success'); await saveGame(); }
    else { showMessage(result.message, 'error'); }
  };

  const handleRefresh = async () => {
    const result = refreshMarket();
    showMessage(result.message, 'success');
    await saveGame();
  };

  const inventoryItems = gameManager.inventory.items.filter(i => i.quantity > 0);

  return (
    <div style={{ position: 'relative' }}>
      <MessageToast message={message} />

      <div style={styles.statsBox(colors.market)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
          <div><span style={styles.label}>市场等级: </span><span style={{ color: colors.market, fontWeight: 'bold' }}>Lv.{level}</span></div>
          <div><span style={styles.label}>我的挂单: </span><span style={{ color: colors.market, fontWeight: 'bold' }}>{myListings.length}/10</span></div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button onClick={() => setActiveTab('buy')} style={styles.tabButton(activeTab === 'buy', colors.market)}>🛒 购买</button>
        <button onClick={() => setActiveTab('sell')} style={styles.tabButton(activeTab === 'sell', colors.market)}>💰 出售</button>
        <button onClick={() => setActiveTab('my')} style={styles.tabButton(activeTab === 'my', colors.market)}>📋 我的挂单</button>
      </div>

      {activeTab === 'buy' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
            <button onClick={handleRefresh} style={{ padding: '6px 12px', background: `${colors.market}20`, border: `1px solid ${colors.market}40`, borderRadius: '6px', color: colors.market, fontSize: '11px', cursor: 'pointer' }}>🔄 刷新市场</button>
          </div>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {listings.map(listing => {
              const typeConfig = MARKET_ITEM_TYPE_CONFIG[listing.itemType];
              const rarityConfig = MARKET_RARITY_CONFIG[listing.rarity];
              const totalPrice = listing.price * listing.quantity;

              return (
                <div key={listing.id} style={{ ...styles.cardBox('rgba(255,255,255,0.08)', false), padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>{typeConfig.icon}</span>
                      <span style={{ color: rarityConfig.color, fontWeight: 'bold', fontSize: '13px' }}>{listing.itemName}</span>
                      <span style={{ ...styles.label, fontSize: '11px' }}>x{listing.quantity}</span>
                    </div>
                    <span style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 'bold' }}>💰 {totalPrice}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ ...styles.label, fontSize: '11px' }}>卖家: {listing.seller} | 单价: {listing.price}</div>
                    <button onClick={() => handleBuy(listing.id)} style={{ ...styles.primaryButton(colors.market), padding: '6px 12px', fontSize: '11px' }}>购买</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'sell' && (
        <div>
          <div style={{ ...styles.label, fontSize: '12px', marginBottom: '8px' }}>选择要出售的物品</div>
          <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '12px' }}>
            {inventoryItems.map(item => (
              <div key={item.id} onClick={() => { setSelectedItem({ id: item.id, name: item.name, quantity: item.quantity }); setSellQuantity(1); }} style={{ ...styles.cardBox(colors.market, selectedItem?.id === item.id), padding: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#fff', fontSize: '12px' }}>{item.name}</span>
                  <span style={{ ...styles.label, fontSize: '11px' }}>x{item.quantity}</span>
                </div>
              </div>
            ))}
          </div>

          {selectedItem && (
            <div style={{ padding: '12px', background: `${colors.market}15`, borderRadius: '12px', border: `1px solid ${colors.market}40` }}>
              <div style={{ color: colors.market, fontWeight: 'bold', marginBottom: '12px' }}>出售 {selectedItem.name}</div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ ...styles.label, fontSize: '11px', marginBottom: '4px' }}>数量</div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button onClick={() => setSellQuantity(Math.max(1, sellQuantity - 1))} style={{ padding: '4px 8px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>-</button>
                  <span style={{ color: '#fff', fontSize: '14px' }}>{sellQuantity}</span>
                  <button onClick={() => setSellQuantity(Math.min(selectedItem.quantity, sellQuantity + 1))} style={{ padding: '4px 8px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>+</button>
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ ...styles.label, fontSize: '11px', marginBottom: '4px' }}>单价</div>
                <input type="number" value={sellPrice} onChange={(e) => setSellPrice(Math.max(1, parseInt(e.target.value) || 1))} style={{ width: '100%', padding: '8px', background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '6px', color: '#fff', fontSize: '14px' }} />
              </div>
              <div style={{ ...styles.label, fontSize: '11px', marginBottom: '12px' }}>总价: <span style={{ color: '#fbbf24' }}>{sellPrice * sellQuantity}</span> 信用点 (手续费: {Math.floor(sellPrice * sellQuantity * 0.05)})</div>
              <button onClick={handleSell} style={{ ...styles.primaryButton(colors.market), padding: '10px', fontSize: '12px' }}>确认挂单</button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'my' && (
        <div>
          {myListings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 20px', color: '#666' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
              <div>暂无挂单</div>
            </div>
          ) : (
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {myListings.map(listing => {
                const typeConfig = MARKET_ITEM_TYPE_CONFIG[listing.itemType];
                const rarityConfig = MARKET_RARITY_CONFIG[listing.rarity];

                return (
                  <div key={listing.id} style={{ ...styles.cardBox('rgba(255,255,255,0.08)', false), padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px' }}>{typeConfig.icon}</span>
                        <span style={{ color: rarityConfig.color, fontWeight: 'bold', fontSize: '13px' }}>{listing.itemName}</span>
                        <span style={{ ...styles.label, fontSize: '11px' }}>x{listing.quantity}</span>
                      </div>
                      <span style={{ color: '#fbbf24', fontSize: '12px' }}>💰 {listing.price * listing.quantity}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ ...styles.label, fontSize: '11px' }}>单价: {listing.price}</div>
                      <button onClick={() => handleCancel(listing.id)} style={{ ...styles.dangerButton(), padding: '6px 12px', fontSize: '11px' }}>取消挂单</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
