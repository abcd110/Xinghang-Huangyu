import { useState, useEffect } from 'react';

interface NameInputScreenProps {
  onConfirm: (name: string) => void;
}

export default function NameInputScreen({ onConfirm }: NameInputScreenProps) {
  const [name, setName] = useState('');
  const [showTitle, setShowTitle] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [error, setError] = useState('');
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 3,
      }));
      setStars(newStars);
    };

    requestAnimationFrame(generateStars);

    const titleTimer = setTimeout(() => setShowTitle(true), 300);
    const inputTimer = setTimeout(() => setShowInput(true), 800);

    return () => {
      clearTimeout(titleTimer);
      clearTimeout(inputTimer);
    };
  }, []);

  const getChineseCharCount = (str: string): number => {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      if (charCode >= 0x4e00 && charCode <= 0x9fff) {
        count += 1;
      } else if (charCode >= 0x3400 && charCode <= 0x4dbf) {
        count += 1;
      } else if (charCode >= 0x20000 && charCode <= 0x2a6df) {
        count += 1;
      } else if (charCode >= 0x2a700 && charCode <= 0x2b73f) {
        count += 1;
      } else if (charCode >= 0x2b740 && charCode <= 0x2b81f) {
        count += 1;
      } else if (charCode >= 0x2b820 && charCode <= 0x2ceaf) {
        count += 1;
      } else if (charCode >= 0xf900 && charCode <= 0xfaff) {
        count += 1;
      } else if (charCode >= 0x3300 && charCode <= 0x33ff) {
        count += 1;
      } else if (charCode >= 0xfe30 && charCode <= 0xfe4f) {
        count += 1;
      } else {
        count += 0.5;
      }
    }
    return count;
  };

  const handleConfirm = () => {
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      setError('请输入您的名称');
      return;
    }

    const chineseCount = getChineseCharCount(trimmedName);
    if (chineseCount > 5) {
      setError('名称最多5个中文字符');
      return;
    }

    if (!/^[\u4e00-\u9fa5\u3400-\u4dbf\u20000-\u2a6df\u2a700-\u2b73f\u2b740-\u2b81f\u2b820-\u2ceaf\uf900-\ufaff\u3300-\u33ff\ufe30-\ufe4fa-zA-Z0-9]+$/.test(trimmedName)) {
      setError('名称只能包含中文、字母和数字');
      return;
    }

    onConfirm(trimmedName);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 10) {
      setName(value);
      setError('');
    }
  };

  const chineseCount = getChineseCharCount(name);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0a0e27 0%, #1a1f3a 50%, #2a3050 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 212, 255, 0.3); }
          50% { box-shadow: 0 0 40px rgba(0, 212, 255, 0.6); }
        }
      `}</style>

      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
      }}>
        {stars.map((star) => (
          <div
            key={star.id}
            style={{
              position: 'absolute',
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: '#ffffff',
              borderRadius: '50%',
              opacity: 0,
              animation: `twinkle 2s ease-in-out infinite`,
              animationDelay: `${star.delay}s`,
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
            }}
          />
        ))}
      </div>

      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(0, 212, 255, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'pulse 8s ease-in-out infinite',
      }} />

      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        position: 'relative',
        zIndex: 10,
        opacity: showTitle ? 1 : 0,
        transform: showTitle ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.8s ease-out',
      }}>
        <div style={{
          fontSize: '60px',
          marginBottom: '16px',
          animation: 'float 3s ease-in-out infinite',
          filter: 'drop-shadow(0 0 30px rgba(0, 212, 255, 0.5))',
        }}>
          👤
        </div>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#00d4ff',
          marginBottom: '12px',
          textShadow: '0 0 20px rgba(0, 212, 255, 0.5)',
          letterSpacing: '4px',
        }}>
          创建角色
        </h1>
        <p style={{
          color: '#a1a1aa',
          fontSize: '14px',
          letterSpacing: '1px',
        }}>
          请输入您的名称，开启星际之旅
        </p>
      </div>

      <div style={{
        width: '100%',
        maxWidth: '320px',
        position: 'relative',
        zIndex: 10,
        opacity: showInput ? 1 : 0,
        transform: showInput ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s ease-out',
        transitionDelay: '0.2s',
      }}>
        <div style={{
          background: 'rgba(0, 20, 40, 0.8)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(0, 212, 255, 0.3)',
          boxShadow: '0 0 30px rgba(0, 212, 255, 0.1)',
        }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              color: '#00d4ff',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '8px',
              letterSpacing: '1px',
            }}>
              角色名称
            </label>
            <input
              type="text"
              value={name}
              onChange={handleInputChange}
              placeholder="请输入名称"
              maxLength={10}
              autoFocus
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: `2px solid ${error ? '#ef4444' : 'rgba(0, 212, 255, 0.3)'}`,
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: 'bold',
                textAlign: 'center',
                letterSpacing: '2px',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#00d4ff';
                e.target.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = error ? '#ef4444' : 'rgba(0, 212, 255, 0.3)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            minHeight: '20px',
          }}>
            <span style={{
              color: '#71717a',
              fontSize: '12px',
            }}>
              最多5个中文字符
            </span>
            <span style={{
              color: chineseCount > 5 ? '#ef4444' : '#00d4ff',
              fontSize: '12px',
              fontWeight: 'bold',
            }}>
              {chineseCount}/5
            </span>
          </div>

          {error && (
            <div style={{
              color: '#ef4444',
              fontSize: '12px',
              marginBottom: '16px',
              textAlign: 'center',
              padding: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}>
              {error}
            </div>
          )}

          <button
            onClick={handleConfirm}
            disabled={!name.trim()}
            style={{
              width: '100%',
              padding: '16px 24px',
              background: name.trim()
                ? 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)'
                : 'rgba(100, 100, 100, 0.3)',
              border: 'none',
              borderRadius: '12px',
              color: name.trim() ? 'white' : '#71717a',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: name.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              boxShadow: name.trim() ? '0 4px 20px rgba(0, 212, 255, 0.4)' : 'none',
              animation: name.trim() ? 'glow 2s ease-in-out infinite' : 'none',
            }}
            onMouseEnter={(e) => {
              if (name.trim()) {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 6px 30px rgba(0, 212, 255, 0.6)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = name.trim() ? '0 4px 20px rgba(0, 212, 255, 0.4)' : 'none';
            }}
          >
            确认
          </button>
        </div>

        <div style={{
          marginTop: '20px',
          padding: '16px',
          background: 'rgba(30, 30, 50, 0.6)',
          borderRadius: '12px',
          border: '1px solid rgba(100, 100, 120, 0.3)',
        }}>
          <div style={{
            color: '#00d4ff',
            fontSize: '12px',
            fontWeight: 'bold',
            marginBottom: '8px',
          }}>
            💡 提示
          </div>
          <div style={{
            color: '#9ca3af',
            fontSize: '11px',
            lineHeight: '1.6',
          }}>
            <div>• 名称将在游戏中代表您的角色</div>
            <div>• 支持中文、字母和数字组合</div>
            <div>• 名称创建后无法更改</div>
          </div>
        </div>
      </div>
    </div>
  );
}
