import React from 'react';
import { SpaceProps } from './types';
import './Space.css';

const Space: React.FC<SpaceProps> = ({
  children,
  gap = 12,
  align = 'center',
  wrap = 'nowrap',
  className,
  style = {},
  inline = false,
  as: Component = 'div'
}) => {
  // 过滤掉null和undefined的子元素
  const validChildren = React.Children.toArray(children).filter(child => 
    child !== null && child !== undefined
  );

  // 根据align属性转换为flex-align值
  const getAlignValue = () => {
    switch (align) {
      case 'start':
        return 'flex-start';
      case 'end':
        return 'flex-end';
      case 'center':
        return 'center';
      case 'baseline':
        return 'baseline';
      case 'stretch':
        return 'stretch';
      default:
        return 'center';
    }
  };

  // 如果没有子元素，直接返回null
  if (validChildren.length === 0) return null;

  return (
    <Component
      className={`space ${inline ? 'space-inline' : ''} ${className || ''}`}
      style={{
        display: inline ? 'inline-flex' : 'flex',
        gap: typeof gap === 'number' ? `${gap}px` : gap,
        alignItems: getAlignValue(),
        flexWrap: wrap,
        ...style
      }}
    >
      {validChildren.map((child, index) => (
        <span key={index} className="space-item">
          {child}
        </span>
      ))}
    </Component>
  );
};

export default Space;