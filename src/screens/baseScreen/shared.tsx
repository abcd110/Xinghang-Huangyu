import { useState, useCallback } from 'react';

export interface MessageState {
  text: string;
  type: 'success' | 'error';
}

export function MessageToast({ message }: { message: MessageState | null }) {
  if (!message) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '10px 20px',
      borderRadius: '8px',
      background: message.type === 'success' ? 'rgba(34, 197, 94, 0.95)' : 'rgba(239, 68, 68, 0.95)',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '13px',
      zIndex: 9999,
      whiteSpace: 'nowrap',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    }}>
      {message.text}
    </div>
  );
}

export function CenteredMessageToast({ message }: { message: MessageState | null }) {
  if (!message) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      padding: '12px 24px',
      borderRadius: '12px',
      background: message.type === 'success' ? 'rgba(34, 197, 94, 0.95)' : 'rgba(239, 68, 68, 0.95)',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '14px',
      zIndex: 9999,
      whiteSpace: 'nowrap',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
    }}>
      {message.text}
    </div>
  );
}

interface ConfirmDialogProps {
  show: boolean;
  title: string;
  content: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ show, title, content, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!show) return null;

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 200,
      width: '280px',
    }}>
      <div style={{
        background: 'rgba(0, 20, 40, 0.98)',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid #00d4ff',
        boxShadow: '0 4px 20px rgba(0, 212, 255, 0.3)',
      }}>
        <h3 style={{ color: '#00d4ff', fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center' }}>
          {title}
        </h3>
        <p style={{ color: '#a1a1aa', fontSize: '12px', marginBottom: '16px', whiteSpace: 'pre-line', textAlign: 'center' }}>
          {content}
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '8px',
              background: 'rgba(100, 100, 100, 0.2)',
              border: '1px solid rgba(100, 100, 100, 0.4)',
              borderRadius: '6px',
              color: '#a1a1aa',
              fontWeight: 'bold',
              fontSize: '11px',
              cursor: 'pointer',
            }}
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '8px',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '11px',
              cursor: 'pointer',
            }}
          >
            确认
          </button>
        </div>
      </div>
    </div>
  );
}

export function useConfirmDialog() {
  const [dialog, setDialog] = useState<ConfirmDialogProps | null>(null);

  const showConfirm = useCallback((title: string, content: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialog({
        show: true,
        title,
        content,
        onConfirm: () => {
          setDialog(null);
          resolve(true);
        },
        onCancel: () => {
          setDialog(null);
          resolve(false);
        },
      });
    });
  }, []);

  const hideConfirm = useCallback(() => {
    setDialog(null);
  }, []);

  return { dialog, showConfirm, hideConfirm };
}
