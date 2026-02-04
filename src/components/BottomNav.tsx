interface BottomNavProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export default function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'home', label: '主页', icon: '🏠' },
    { id: 'exploration', label: '探索', icon: '🗺️' },
    { id: 'inventory', label: '背包', icon: '🎒' },
    { id: 'quests', label: '任务', icon: '📜' },
  ];

  return (
    <div 
      style={{ 
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#2d2d2d',
        borderTop: '2px solid #fb923c',
        zIndex: 9999
      }}
    >
      <div 
        style={{ 
          maxWidth: '430px', 
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: '64px'
        }}
      >
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              height: '100%',
              background: 'none',
              border: 'none',
              color: currentScreen === item.id ? '#fb923c' : '#9ca3af',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            <span style={{ fontSize: '20px', marginBottom: '2px' }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
