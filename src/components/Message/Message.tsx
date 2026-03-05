import React, { useEffect, useState } from 'react';
import Icon from '../Icon';
import { MessageProps } from './types';
import './Message.css';

const Message: React.FC<MessageProps> = ({
  type,
  content,
  duration = 3000,
  className = '',
  style,
  onClose
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!visible) return null;

  const getIconType = () => {
    switch (type) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'info':
        return 'infoCircleFill';
      default:
        return 'infoCircleFill';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'var(--zjpcy-success-color)';
      case 'warning':
        return 'var(--zjpcy-warning-color)';
      case 'error':
        return 'var(--zjpcy-error-color)';
      case 'info':
        return 'var(--zjpcy-primary-color)';
      default:
        return 'var(--zjpcy-primary-color)';
    }
  };

  return (
    <div className={`zjpcy-message zjpcy-message--${type} ${className} ${visible ? 'zjpcy-message--show' : ''}`} style={style}>
      <div className="zjpcy-message-content">
        <Icon type={getIconType()} size={20} color={getIconColor()} />
        <span className="zjpcy-message-text">{content}</span>
      </div>
    </div>
  );
};

export default Message;
