import React from 'react';
import { TypographyProps } from './types';
import './Typography.css';

const Typography: React.FC<TypographyProps> = ({ 
  children, 
  width, 
  rows,
  style,
  className 
}) => {
  // 构建样式对象
  const typographyStyle: React.CSSProperties = {
    ...style,
    width: width
  };

  // 根据行数生成相应的CSS类
  const getLineClampClass = (rows: number | undefined) => {
    if (!rows) return '';
    return `zjpcy-typography--line-clamp-${rows}`;
  };

  // 构建类名数组，过滤掉空字符串
  const classNames = [
    'zjpcy-typography',
    getLineClampClass(rows),
    className
  ].filter(Boolean);

  return (
    <div 
      className={classNames.join(' ')}
      style={typographyStyle}
    >
      {children}
    </div>
  );
};

export default Typography;