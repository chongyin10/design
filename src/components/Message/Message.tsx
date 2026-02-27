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
        return 'var(--idp-success-color)';
      case 'warning':
        return 'var(--idp-warning-color)';
      case 'error':
        return 'var(--idp-error-color)';
      case 'info':
        return 'var(--idp-primary-color)';
      default:
        return 'var(--idp-primary-color)';
    }
  };

  return (
    <div className={`idp-message idp-message--${type} ${className} ${visible ? 'idp-message--show' : ''}`} style={style}>
      <div className="idp-message-content">
        <Icon type={getIconType()} size={20} color={getIconColor()} />
        <span className="idp-message-text">{content}</span>
      </div>
    </div>
  );
};

export default Message;
