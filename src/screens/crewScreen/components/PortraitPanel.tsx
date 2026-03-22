import { useState } from 'react';
import { CrewMember } from '../../../core/CrewSystem';
import { RARITY_CONFIG } from '../../../core/CrewSystem';

interface PortraitPanelProps {
  crew: CrewMember;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export function PortraitPanel({ crew, isFullscreen, onToggleFullscreen }: PortraitPanelProps) {
  const [showOriginal, setShowOriginal] = useState(false);
  const rarityConfig = RARITY_CONFIG[crew.rarity as any] || RARITY_CONFIG.B;

  const panelStyles = isFullscreen
    ? {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }
    : {
        position: 'relative' as const,
        width: '100%',
        minHeight: '200px',
        background: `linear-gradient(180deg, ${rarityConfig.color}20 0%, rgba(0, 15, 30, 0.95) 100%)`,
        borderRadius: '12px',
        overflow: 'hidden',
      };

  return (
    <div style={panelStyles} onClick={isFullscreen ? onToggleFullscreen : undefined}>
      {/* 背景光效 */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isFullscreen ? '80%' : '120%',
          height: isFullscreen ? '80%' : '120%',
          background: `radial-gradient(circle, ${rarityConfig.color}30 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* 扫描线效果 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 212, 255, 0.03) 2px, rgba(0, 212, 255, 0.03) 4px)',
          pointerEvents: 'none',
          animation: 'scan 10s linear infinite',
        }}
      />

      {/* 角色立绘/头像 */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: isFullscreen ? '40px' : '16px',
        }}
      >
        {/* 角色形象容器 */}
        <div
          style={{
            position: 'relative',
            width: isFullscreen ? '300px' : '100px',
            height: isFullscreen ? '300px' : '100px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${rarityConfig.color}40, ${rarityConfig.color}10)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `2px solid ${rarityConfig.color}`,
            boxShadow: `0 0 ${isFullscreen ? '60px' : '20px'} ${rarityConfig.color}50`,
            animation: 'pulse-glow 3s ease-in-out infinite',
          }}
        >
          {/* 这里后续替换为实际原画 */}
          <span style={{ fontSize: isFullscreen ? '120px' : '40px' }}>{crew.portrait}</span>

          {/* 稀有度角标 */}
          <div
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              background: rarityConfig.color,
              color: '#000',
              fontSize: isFullscreen ? '14px' : '9px',
              fontWeight: 'bold',
              padding: '3px 6px',
              borderRadius: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            {rarityConfig.name}
          </div>
        </div>

        {/* 角色信息 */}
        <div
          style={{
            marginTop: isFullscreen ? '30px' : '10px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              color: '#fff',
              fontSize: isFullscreen ? '32px' : '16px',
              fontWeight: 'bold',
              textShadow: `0 0 ${isFullscreen ? '20px' : '8px'} ${rarityConfig.color}`,
              marginBottom: '4px',
            }}
          >
            {crew.name}
          </div>

          {!isFullscreen && (
            <>
              <div style={{ color: '#00d4ff', fontSize: '12px', marginBottom: '2px' }}>
                Lv.{crew.level}
              </div>
              <div style={{ display: 'flex', gap: '2px', justifyContent: 'center' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    style={{
                      color: star <= (crew.level >= 80 ? 5 : crew.level >= 60 ? 4 : crew.level >= 40 ? 3 : crew.level >= 20 ? 2 : 1) ? '#fbbf24' : '#4b5563',
                      fontSize: '12px',
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* 全屏模式下的额外信息 */}
        {isFullscreen && (
          <div
            style={{
              marginTop: '30px',
              padding: '20px 40px',
              background: 'rgba(0, 20, 40, 0.8)',
              borderRadius: '12px',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              maxWidth: '500px',
            }}
          >
            <div style={{ color: '#a1a1aa', fontSize: '14px', marginBottom: '8px' }}>角色简介</div>
            <div style={{ color: '#d1d5db', fontSize: '16px', lineHeight: '1.6' }}>
              {crew.name}是一名经验丰富的船员，在末日列车中担任重要角色。
            </div>
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      {!isFullscreen && onToggleFullscreen && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFullscreen();
          }}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            padding: '6px',
            color: '#fff',
            cursor: 'pointer',
            zIndex: 20,
            fontSize: '12px',
          }}
        >
          🔍
        </button>
      )}

      {/* 全屏关闭按钮 */}
      {isFullscreen && (
        <button
          onClick={onToggleFullscreen}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(239, 68, 68, 0.8)',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            color: '#fff',
            fontSize: '16px',
            cursor: 'pointer',
            zIndex: 20,
          }}
        >
          关闭
        </button>
      )}

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px ${rarityConfig.color}50; }
          50% { box-shadow: 0 0 35px ${rarityConfig.color}80, 0 0 50px ${rarityConfig.color}40; }
        }
      `}</style>
    </div>
  );
}
