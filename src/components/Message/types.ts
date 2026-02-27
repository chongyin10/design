export type MessageType = 'success' | 'warning' | 'error' | 'info';

export interface MessageProps {
  type: MessageType;
  content: React.ReactNode;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
  onClose?: () => void;
}

export interface MessageInstance {
  success: (content: React.ReactNode, duration?: number) => void;
  warning: (content: React.ReactNode, duration?: number) => void;
  error: (content: React.ReactNode, duration?: number) => void;
  info: (content: React.ReactNode, duration?: number) => void;
  close: () => void;
}
