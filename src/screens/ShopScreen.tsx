import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { TYPE_ICONS } from '../data/types';

interface ShopScreenProps {
  onBack: () => void;
}

export default function ShopScreen({ onBack }: ShopScreenProps) {
  const { gameManager, buyItem } = useGameStore();
  const shopItems = Array.from(gameManager.shopItems.values());

  const handleBuy = (itemId: string) => {
    const result = buyItem(itemId, 1);
    alert(result.message);
  };

  return (
    <div className="min-h-screen bg-wasteland-900 pb-24">
      <header className="sticky top-0 z-10 bg-wasteland-800/95 backdrop-blur border-b border-rust-500/30 px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-1 text-gray-400 hover:text-white">
            <span className="text-lg">←</span>
            <span className="text-sm">返回</span>
          </button>
          <h1 className="text-white font-bold text-lg">商店</h1>
          <div className="flex items-center gap-1 text-yellow-400">
            <span>💰</span>
            <span className="font-bold">{gameManager.trainCoins}</span>
          </div>
        </div>
      </header>

      <main className="px-4 py-4">
        <section className="grid grid-cols-2 gap-3">
          {shopItems.map(shopItem => {
            const inventoryItem = gameManager.inventory.getItem(shopItem.itemId);
            const canAfford = gameManager.trainCoins >= shopItem.price;
            const hasStock = shopItem.stock > 0;

            return (
              <div key={shopItem.itemId} className="bg-wasteland-800 rounded-xl p-3 border border-wasteland-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{inventoryItem ? TYPE_ICONS[inventoryItem.type] : '📦'}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-sm truncate">{shopItem.name}</h3>
                    <p className="text-xs text-gray-500">限购: {shopItem.stock}/{shopItem.dailyLimit}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`font-bold ${canAfford ? 'text-yellow-400' : 'text-red-400'}`}>
                    💰 {shopItem.price}
                  </span>
                  <button
                    onClick={() => handleBuy(shopItem.itemId)}
                    disabled={!canAfford || !hasStock}
                    className="px-3 py-1.5 bg-rust-500 hover:bg-rust-400 disabled:bg-wasteland-700 disabled:text-gray-500 text-white text-sm rounded-lg transition-colors"
                  >
                    {!hasStock ? '售罄' : '购买'}
                  </button>
                </div>
              </div>
            );
          })}
        </section>

        {/* 提示 */}
        <div className="mt-4 p-3 bg-wasteland-800 rounded-lg border border-wasteland-700">
          <p className="text-xs text-gray-400">
            💡 商店每日刷新，限购商品会在第二天重置
          </p>
        </div>
      </main>
    </div>
  );
}
