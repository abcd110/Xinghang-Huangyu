export const styles = {
  statsBox: (color: string) => ({
    background: `linear-gradient(135deg, rgba(0, 20, 40, 0.9) 0%, rgba(0, 40, 60, 0.8) 100%)`,
    borderRadius: '12px',
    padding: '14px',
    marginBottom: '14px',
    border: `1px solid ${color}60`,
    boxShadow: `0 0 20px ${color}20, inset 0 0 30px rgba(0, 212, 255, 0.05)`,
    position: 'relative' as const,
    overflow: 'hidden' as const,
  }),

  tabButton: (isActive: boolean, color: string) => ({
    flex: 1,
    padding: '10px',
    background: isActive 
      ? `linear-gradient(135deg, ${color}30 0%, ${color}15 100%)` 
      : 'rgba(0, 20, 40, 0.6)',
    border: isActive ? `1px solid ${color}` : '1px solid rgba(0, 212, 255, 0.2)',
    borderRadius: '10px',
    color: isActive ? color : '#71717a',
    fontWeight: 'bold',
    fontSize: '12px',
    cursor: 'pointer',
    boxShadow: isActive ? `0 0 15px ${color}40, inset 0 0 10px ${color}10` : 'none',
    transition: 'all 0.3s ease',
  }),

  primaryButton: (color: string, disabled: boolean = false) => ({
    width: '100%',
    padding: '12px',
    background: disabled 
      ? 'rgba(50, 50, 60, 0.5)' 
      : `linear-gradient(135deg, ${color} 0%, ${color}cc 50%, ${color}99 100%)`,
    border: disabled ? '1px solid rgba(80, 80, 90, 0.5)' : `1px solid ${color}`,
    borderRadius: '10px',
    color: disabled ? '#555' : '#fff',
    fontWeight: 'bold',
    fontSize: '12px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: disabled ? 'none' : `0 0 25px ${color}50, 0 4px 15px rgba(0, 0, 0, 0.3)`,
    textShadow: disabled ? 'none' : `0 0 10px ${color}`,
    transition: 'all 0.3s ease',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  }),

  secondaryButton: {
    flex: 1,
    padding: '10px',
    background: 'linear-gradient(135deg, rgba(0, 40, 60, 0.8) 0%, rgba(0, 20, 40, 0.9) 100%)',
    border: '1px solid rgba(0, 212, 255, 0.3)',
    borderRadius: '10px',
    color: '#00d4ff',
    fontWeight: 'bold',
    fontSize: '11px',
    cursor: 'pointer',
    boxShadow: '0 0 10px rgba(0, 212, 255, 0.2)',
    transition: 'all 0.3s ease',
  },

  dangerButton: (disabled: boolean = false) => ({
    flex: 1,
    padding: '8px',
    background: disabled ? 'rgba(50, 50, 60, 0.5)' : 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(185, 28, 28, 0.4) 100%)',
    border: disabled ? '1px solid rgba(80, 80, 90, 0.3)' : '1px solid rgba(239, 68, 68, 0.6)',
    borderRadius: '8px',
    color: disabled ? '#555' : '#f87171',
    fontWeight: 'bold',
    fontSize: '11px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: disabled ? 'none' : '0 0 15px rgba(239, 68, 68, 0.3)',
  }),

  cardBox: (borderColor: string, isSelected: boolean = false) => ({
    padding: '14px',
    background: isSelected 
      ? `linear-gradient(135deg, ${borderColor}15 0%, rgba(0, 20, 40, 0.9) 100%)`
      : 'linear-gradient(135deg, rgba(0, 30, 50, 0.8) 0%, rgba(0, 15, 30, 0.9) 100%)',
    borderRadius: '14px',
    marginBottom: '10px',
    border: `1px solid ${isSelected ? borderColor : 'rgba(0, 212, 255, 0.25)'}`,
    cursor: 'pointer',
    boxShadow: isSelected 
      ? `0 0 25px ${borderColor}40, inset 0 0 20px ${borderColor}10` 
      : '0 0 15px rgba(0, 212, 255, 0.1)',
    transition: 'all 0.3s ease',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  }),

  progressBar: () => ({
    height: '6px',
    background: 'rgba(0, 20, 40, 0.8)',
    borderRadius: '3px',
    overflow: 'hidden',
    border: '1px solid rgba(0, 212, 255, 0.2)',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.3)',
  }),

  progressFill: (color: string, percent: number) => ({
    height: '100%',
    width: `${percent}%`,
    background: `linear-gradient(90deg, ${color}40 0%, ${color} 50%, ${color}cc 100%)`,
    borderRadius: '3px',
    boxShadow: `0 0 10px ${color}80`,
  }),

  infoBox: (color: string) => ({
    background: `linear-gradient(135deg, ${color}10 0%, rgba(0, 20, 40, 0.8) 100%)`,
    borderRadius: '12px',
    padding: '14px',
    marginBottom: '14px',
    border: `1px solid ${color}40`,
    boxShadow: `0 0 15px ${color}15`,
  }),

  label: {
    color: '#71717a',
    fontSize: '12px',
  },

  value: {
    color: '#fff',
    fontSize: '13px',
  },

  sciFiCard: (color: string) => ({
    background: `linear-gradient(135deg, rgba(0, 30, 50, 0.9) 0%, rgba(0, 15, 35, 0.95) 100%)`,
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '12px',
    border: `1px solid ${color}50`,
    boxShadow: `0 0 30px ${color}20, inset 0 0 40px rgba(0, 212, 255, 0.03)`,
    position: 'relative' as const,
    overflow: 'hidden' as const,
  }),

  holographicText: (color: string) => ({
    color: color,
    textShadow: `0 0 10px ${color}80, 0 0 20px ${color}40`,
    fontWeight: 'bold' as const,
  }),

  energyProgress: (color: string) => ({
    height: '8px',
    background: 'rgba(0, 20, 40, 0.9)',
    borderRadius: '4px',
    overflow: 'hidden',
    border: `1px solid ${color}30`,
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.4)',
  }),

  mineralIcon: (color: string) => ({
    fontSize: '24px',
    filter: `drop-shadow(0 0 8px ${color}) drop-shadow(0 0 15px ${color}60)`,
  }),

  glowBorder: (color: string) => ({
    border: `1px solid ${color}`,
    boxShadow: `0 0 15px ${color}40, inset 0 0 15px ${color}10`,
  }),

  scanlineOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 212, 255, 0.03) 2px, rgba(0, 212, 255, 0.03) 4px)',
    pointerEvents: 'none' as const,
  },

  cornerAccent: (color: string) => ({
    position: 'absolute' as const,
    width: '20px',
    height: '20px',
    border: `2px solid ${color}`,
  }),
};

export const colors = {
  energy: '#f59e0b',
  warehouse: '#10b981',
  comm: '#8b5cf6',
  research: '#c084fc',
  mining: '#f59e0b',
  chip: '#00d4ff',
  gene: '#ec4899',
  cybernetic: '#a855f7',
  market: '#ec4899',
  ruins: '#f97316',
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#00d4ff',
};
