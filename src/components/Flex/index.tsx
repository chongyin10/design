import React from 'react';
import { FlexProps } from './types';
import './Flex.css';

const Flex: React.FC<FlexProps> = ({
  children,
  layout = 'horizontal',
  direction,
  justify = 'flex-start',
  align = 'stretch',
  wrap = 'nowrap',
  gap,
  style = {}
}) => {
  // 根据layout计算最终的direction，direction优先级更高
  const finalDirection = direction || (layout === 'column' ? 'column' : 'row');

  return (
    <div
      className={"flex"}
      style={{
        // 确保Flex容器在父元素（如Table单元格）中能够正确收缩
        // minWidth: 0 允许flex容器在table-layout: fixed的表格中正确收缩
        minWidth: 0,
        // maxWidth: 100% 确保不会超出父容器宽度
        maxWidth: '100%',
        gap: typeof gap === 'number' ? `${gap}px` : gap,
        justifyContent:justify,
        alignItems: align,
        flexWrap: wrap,
        flexDirection: finalDirection,
        ...style
      }}
    >
      {children}
    </div>
  );
};

export default Flex;
