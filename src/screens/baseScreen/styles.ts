export const styles = {
  statsBox: (color: string) => ({
    background: `${color}15`,
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '12px',
    border: `1px solid ${color}30`,
  }),

  tabButton: (isActive: boolean, color: string) => ({
    flex: 1,
    padding: '10px',
    background: isActive ? `${color}40` : 'rgba(255, 255, 255, 0.05)',
    border: isActive ? `1px solid ${color}80` : '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: isActive ? color : '#a1a1aa',
    fontWeight: 'bold',
    fontSize: '12px',
    cursor: 'pointer',
  }),

  primaryButton: (color: string, disabled: boolean = false) => ({
    width: '100%',
    padding: '12px',
    background: disabled ? 'rgba(100, 100, 100, 0.3)' : `linear-gradient(135deg, ${color}, ${color}aa)`,
    border: disabled ? '1px solid rgba(100, 100, 100, 0.5)' : 'none',
    borderRadius: '8px',
    color: disabled ? '#666' : '#fff',
    fontWeight: 'bold',
    fontSize: '12px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: disabled ? 'none' : `0 0 15px ${color}40`,
  }),

  secondaryButton: {
    flex: 1,
    padding: '8px',
    background: 'rgba(100, 100, 100, 0.2)',
    border: '1px solid rgba(100, 100, 100, 0.4)',
    borderRadius: '6px',
    color: '#a1a1aa',
    fontWeight: 'bold',
    fontSize: '11px',
    cursor: 'pointer',
  },

  dangerButton: (disabled: boolean = false) => ({
    flex: 1,
    padding: '8px',
    background: disabled ? 'rgba(100, 100, 100, 0.2)' : 'rgba(239, 68, 68, 0.2)',
    border: disabled ? '1px solid rgba(100, 100, 100, 0.3)' : '1px solid rgba(239, 68, 68, 0.4)',
    borderRadius: '6px',
    color: disabled ? '#666' : '#f87171',
    fontWeight: 'bold',
    fontSize: '11px',
    cursor: disabled ? 'not-allowed' : 'pointer',
  }),

  cardBox: (borderColor: string, isSelected: boolean = false) => ({
    padding: '12px',
    background: isSelected ? `${borderColor}20` : 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    marginBottom: '8px',
    border: `1px solid ${isSelected ? borderColor : 'rgba(255, 255, 255, 0.08)'}`,
    cursor: 'pointer',
  }),

  progressBar: (color: string, percent: number) => ({
    height: '4px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '2px',
    overflow: 'hidden',
  }),

  progressFill: (color: string, percent: number) => ({
    height: '100%',
    width: `${percent}%`,
    background: `linear-gradient(90deg, ${color}, ${color}aa)`,
    borderRadius: '2px',
  }),

  infoBox: (color: string) => ({
    background: `${color}10`,
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '12px',
    border: `1px solid ${color}20`,
  }),

  label: {
    color: '#a1a1aa',
    fontSize: '12px',
  },

  value: {
    color: '#fff',
    fontSize: '13px',
  },
};

export const colors = {
  energy: '#f59e0b',
  warehouse: '#10b981',
  medical: '#ef4444',
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
