import { useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';

interface StartScreenProps {
  onStartGame: () => void;
}

export default function StartScreen({ onStartGame }: StartScreenProps) {
  const { hasSave, init, newGame, loadGame, isLoading } = useGameStore();

  useEffect(() => {
    init();
  }, [init]);

  const handleNewGame = () => {
    newGame();
    onStartGame();
  };

  const handleContinue = async () => {
    const success = await loadGame();
    if (success) {
      onStartGame();
    }
  };

  return (
    <div className="min-h-screen bg-wasteland-900 flex flex-col items-center justify-center p-6">
      {/* 标题 */}
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">🚂</div>
        <h1 className="text-4xl font-bold text-rust-300 mb-2">列车求生</h1>
        <p className="text-gray-400">在末日废土中，驾驶列车寻找生存的希望</p>
      </div>

      {/* 按钮 */}
      <div className="w-full max-w-xs space-y-4">
        {hasSave && (
          <button
            onClick={handleContinue}
            disabled={isLoading}
            className="w-full py-4 bg-rust-500 hover:bg-rust-400 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? '加载中...' : '继续游戏'}
          </button>
        )}
        
        <button
          onClick={handleNewGame}
          className="w-full py-4 bg-wasteland-700 hover:bg-wasteland-600 text-white font-bold rounded-lg transition-colors border-2 border-rust-500"
        >
          新游戏
        </button>
      </div>

      {/* 版本信息 */}
      <div className="absolute bottom-6 text-gray-500 text-sm">
        v0.1.0 - Capacitor 版
      </div>
    </div>
  );
}
