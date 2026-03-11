// 科幻风格按钮组件

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'info' | 'default';
export type ButtonTheme = 'gold' | 'rose' | 'cyan';

interface SciFiButtonProps {
  onClick: () => void;
  label: string;
  variant?: ButtonVariant;
  theme?: ButtonTheme;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const variantStyles: Record<ButtonVariant, { background: string; border: string; color: string; shadow: string }> = {
  primary: {
    background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.3), rgba(0, 212, 255, 0.1))',
    border: '1px solid rgba(0, 212, 255, 0.6)',
    color: '#00d4ff',
    shadow: '0 0 15px rgba(0, 212, 255, 0.3)',
  },
  secondary: {
    background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(124, 58, 237, 0.1))',
    border: '1px solid rgba(124, 58, 237, 0.6)',
    color: '#c084fc',
    shadow: '0 0 15px rgba(124, 58, 237, 0.3)',
  },
  success: {
    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.1))',
    border: '1px solid rgba(34, 197, 94, 0.6)',
    color: '#4ade80',
    shadow: '0 0 15px rgba(34, 197, 94, 0.3)',
  },
  danger: {
    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.1))',
    border: '1px solid rgba(239, 68, 68, 0.6)',
    color: '#f87171',
    shadow: '0 0 15px rgba(239, 68, 68, 0.3)',
  },
  info: {
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(59, 130, 246, 0.1))',
    border: '1px solid rgba(59, 130, 246, 0.6)',
    color: '#60a5fa',
    shadow: '0 0 15px rgba(59, 130, 246, 0.3)',
  },
  default: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#d1d5db',
    shadow: 'none',
  },
};

const themeOverrides: Record<ButtonTheme, { color: string; border: string; background: string; shadow: string }> = {
  gold: {
    color: '#fbbf24',
    border: '1px solid rgba(251, 191, 36, 0.5)',
    background: 'rgba(251, 191, 36, 0.2)',
    shadow: '0 0 10px rgba(251, 191, 36, 0.3)',
  },
  rose: {
    color: '#f43f5e',
    border: '1px solid rgba(244, 63, 94, 0.5)',
    background: 'rgba(244, 63, 94, 0.2)',
    shadow: '0 0 10px rgba(244, 63, 94, 0.3)',
  },
  cyan: {
    color: '#00d4ff',
    border: '1px solid rgba(0, 212, 255, 0.5)',
    background: 'rgba(0, 212, 255, 0.2)',
    shadow: '0 0 10px rgba(0, 212, 255, 0.3)',
  },
};

export function SciFiButton({
  onClick,
  label,
  variant = 'default',
  theme,
  disabled = false,
  style,
}: SciFiButtonProps) {
  const baseStyle = variantStyles[variant];
  const themeStyle = theme ? themeOverrides[theme] : null;
  const finalStyle = themeStyle
    ? { ...baseStyle, color: themeStyle.color, border: themeStyle.border, background: themeStyle.background, shadow: themeStyle.shadow }
    : baseStyle;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: finalStyle.background,
        border: finalStyle.border,
        borderRadius: '8px',
        padding: '12px',
        color: disabled ? '#6b7280' : finalStyle.color,
        fontWeight: 'bold',
        fontSize: '14px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: finalStyle.shadow,
        transition: 'all 0.3s ease',
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = finalStyle.shadow.replace('0.3', '0.5');
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = finalStyle.shadow;
      }}
    >
      {label}
    </button>
  );
}
