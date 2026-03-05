import React from 'react';
import { EmptyProps } from './types';
import Icon from '../Icon/Icon';
import './Empty.css';

const Empty: React.FC<EmptyProps> = ({
  icon,
  image,
  description = '暂无数据',
  children,
  size = 'middle',
  style,
  className
}) => {
  return (
    <div className={`zjpcy-empty zjpcy-empty--${size} ${className || ''}`} style={style}>
      <div className="zjpcy-empty__icon-wrapper">
        {icon && <div className="zjpcy-empty__icon">{icon}</div>}
        {image && <img src={image} alt="empty" className="zjpcy-empty__image" />}
        {!icon && !image && (
          <Icon type="file-text" size={size === 'large' ? 64 : size === 'small' ? 32 : 48} color="#d9d9d9" />
        )}
      </div>
      <div className="zjpcy-empty__description">{description}</div>
      {children && <div className="zjpcy-empty__actions">{children}</div>}
    </div>
  );
};

export default Empty;