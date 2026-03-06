import styled from 'styled-components';

// 基础样式层：styled-components 定义，优先级最低
export const LabelWrapper = styled.label`
  /* 基础样式 */
  background: linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%);
  padding: 10px 16px;
  padding-right: var(--label-padding-right, 16px);
  padding-left: 16px;
  border-radius: 8px;
  position: relative;
  display: inline-flex;
  align-items: center;
  font-weight: 600;
  font-size: 14px;
  color: #262626;
  letter-spacing: 0.3px;
  
  /* 阴影效果 */
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.06),
    0 1px 2px rgba(0, 0, 0, 0.04);
  
  /* 平滑过渡 */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  // /* 悬停效果 */
  // &:hover {
  //   background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
  //   box-shadow: 
  //     0 4px 16px rgba(0, 0, 0, 0.1),
  //     0 2px 4px rgba(0, 0, 0, 0.06);
  //   // transform: translateY(-1px);
  // }
  
  /* 指示器样式 - 渐变条 */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: var(--label-indicator-width, 4px);
    height: var(--label-indicator-height, 70%);
    background: linear-gradient(
      180deg,
      var(--label-indicator-color, #1890ff) 0%,
      rgba(24, 144, 255, 0.6) 100%
    );
    border-radius: 0 4px 4px 0;
    box-shadow: 2px 0 8px rgba(24, 144, 255, 0.3);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* 悬停时指示器效果 */
  // &:hover::before {
  //   width: calc(var(--label-indicator-width, 4px) + 1px);
  //   box-shadow: 3px 0 12px rgba(24, 144, 255, 0.4);
  //   filter: brightness(1.1);
  // }
  
  /* 光晕装饰 */
  // &::after {
  //   content: '';
  //   position: absolute;
  //   top: 0;
  //   right: 0;
  //   width: 60px;
  //   height: 100%;
  //   background: linear-gradient(
  //     90deg,
  //     transparent 0%,
  //     rgba(255, 255, 255, 0.4) 50%,
  //     transparent 100%
  //   );
  //   border-radius: 0 8px 8px 0;
  //   pointer-events: none;
  //   opacity: 0;
  //   transition: opacity 0.3s ease;
  // }
  
  &:hover::after {
    opacity: 1;
  }
`;
