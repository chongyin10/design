import styled from 'styled-components';
import { SwitchStyles } from './types';

// 从 CSS 变量中读取值的辅助函数
const getCSSVar = (property: string, fallback: string) => `var(${property}, ${fallback})`;

// Wrapper 组件 - 使用 CSS 变量
export const Wrapper = styled.div<{ $styles?: SwitchStyles['wrapper'] }>`
  display: inline-block;

  &.switch-wrapper {
    /* 外部可通过 .switch-wrapper 选择器覆盖样式 */
  }

  ${({ $styles }) => $styles && Object.entries($styles).map(([key, value]) => `${key}: ${value};`).join('\n')}
`;

// Track 组件 - 配合 Switch.css 的 CSS 变量使用
export const Track = styled.div<{
  $checked: boolean;
  $disabled: boolean;
  $size: 'default' | 'small';
  $loading: boolean;
  $hasChildren?: boolean;
  $width?: number;
  $styles?: SwitchStyles['track'];
}>
`
  position: relative;
  background: ${getCSSVar('--idp-switch-track-bg-gradient', 'linear-gradient(135deg, #e8e8e8 0%, #d9d9d9 100%)')};
  border-radius: ${getCSSVar('--idp-switch-track-radius', '12px')};
  transition: ${getCSSVar('--idp-switch-transition', 'all 0.2s ease-in-out')};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 'var(--idp-switch-disabled-opacity, 0.65)' : 1)};
  box-sizing: border-box;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.08);

  &.switch-track {
    /* 外部可通过 .switch-track 选择器覆盖样式 */
  }

  &.switch-track-checked {
    background: ${getCSSVar('--idp-switch-track-active-gradient', 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)')};
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.2);
  }

  &.switch-track-disabled {
    cursor: not-allowed;
    opacity: var(--idp-switch-disabled-opacity, 0.65);
    background: ${getCSSVar('--idp-switch-disabled-bg', '#f5f5f5')};
  }

  &.switch-track-loading {
    cursor: wait;
  }

  &:hover:not(.switch-track-disabled) {
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.12);
  }

  &.switch-track-checked:hover:not(.switch-track-disabled) {
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.45), inset 0 1px 2px rgba(255, 255, 255, 0.2);
  }

  ${({ $size, $hasChildren, $width }) => {
    // 如果有自定义宽度，优先使用自定义宽度
    if ($width) {
      return `
        width: ${$width}px;
        min-width: ${$width}px;
        height: ${$size === 'small' ? getCSSVar('--idp-switch-small-height', '16px') : getCSSVar('--idp-switch-default-height', '22px')};
      `;
    }
    if ($size === 'small') {
      return `
        width: ${$hasChildren ? 'auto' : getCSSVar('--idp-switch-small-width', '28px')};
        min-width: ${getCSSVar('--idp-switch-small-width', '28px')};
        height: ${getCSSVar('--idp-switch-small-height', '16px')};
      `;
    }
    return `
      width: ${$hasChildren ? 'auto' : getCSSVar('--idp-switch-default-width', '44px')};
      min-width: ${getCSSVar('--idp-switch-default-width', '44px')};
      height: ${getCSSVar('--idp-switch-default-height', '22px')};
    `;
  }}

  ${({ $checked }) =>
    $checked && `
      background: ${getCSSVar('--idp-switch-track-active-gradient', 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)')};
      box-shadow: 0 2px 8px rgba(24, 144, 255, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.2);
    `
  }

  ${({ $loading }) =>
    $loading && `
      cursor: wait;
    `
  }

  ${({ $styles }) => $styles && Object.entries($styles).map(([key, value]) => `${key}: ${value};`).join('\n')}
`;

// Thumb 组件 - 配合 Switch.css 的 CSS 变量使用
export const Thumb = styled.div<{
  $checked: boolean;
  $size: 'default' | 'small';
  $loading: boolean;
  $hasChildren?: boolean;
  $width?: number;
  $styles?: SwitchStyles['thumb'];
}>
`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(135deg, ${getCSSVar('--idp-switch-thumb-bg', '#fff')} 0%, ${getCSSVar('--idp-bg-color-light', '#f5f5f5')} 100%);
  border-radius: ${getCSSVar('--idp-switch-thumb-radius', '50%')};
  box-shadow: ${getCSSVar('--idp-switch-thumb-shadow', '0 2px 8px rgba(0, 0, 0, 0.15)')};
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease;
  z-index: 2;

  &.switch-thumb {
    /* 外部可通过 .switch-thumb 选择器覆盖样式 */
  }

  &.switch-thumb-checked {
    box-shadow: ${getCSSVar('--idp-switch-thumb-shadow-active', '0 2px 8px rgba(24, 144, 255, 0.4)')};
  }

  ${({ $size, $checked, $width }) => {
    // 尺寸配置
    const thumbSize = $size === 'small' ? 12 : 18;
    const defaultOffset = 2; // 默认边距
    
    if ($width) {
      // 自定义宽度时，动态计算 thumb 位置
      // 未选中时：left = 边距
      // 选中时：left = 宽度 - thumb尺寸 - 边距
      const leftValue = $checked ? `${$width - thumbSize - defaultOffset}px` : `${defaultOffset}px`;
      return `
        width: ${thumbSize}px;
        height: ${thumbSize}px;
        left: ${leftValue};
      `;
    }
    
    // 默认尺寸
    if ($size === 'small') {
      const leftValue = $checked ? '14px' : '2px';
      return `
        width: ${thumbSize}px;
        height: ${thumbSize}px;
        left: ${leftValue};
      `;
    }
    const leftValue = $checked ? '24px' : '2px';
    return `
      width: ${thumbSize}px;
      height: ${thumbSize}px;
      left: ${leftValue};
    `;
  }}

  ${({ $loading }) =>
    $loading && `
      animation: idp-switch-thumb-spin 1s linear infinite;
    `
  }

  ${({ $styles }) => $styles && Object.entries($styles).map(([key, value]) => `${key}: ${value};`).join('\n')}
`;

// LoadingIcon 组件 - 使用 SVG 图标
export const LoadingIcon = styled.div<{
  $checked?: boolean;
  $size?: 'default' | 'small';
  $width?: number;
  $styles?: SwitchStyles['loading'];
}>
`
  position: absolute;
  top: 50%;
  margin-top: -6px; /* 12px 高度的一半，实现垂直居中 */
  width: ${getCSSVar('--idp-switch-loading-size', '12px')};
  height: ${getCSSVar('--idp-switch-loading-size', '12px')};
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;

  &.switch-loading-icon {
    /* 外部可通过 .switch-loading-icon 选择器覆盖样式 */
  }

  /* SVG 旋转动画 - 以中心点旋转 */
  & > svg {
    width: 100%;
    height: 100%;
    animation: idp-switch-spin 1s linear infinite;
    transform-origin: center center;
    display: block;
    fill: ${getCSSVar('--idp-switch-loading-color', '#1890ff')};
  }

  ${({ $size, $checked, $width }) => {
    // 尺寸配置（与 Thumb 保持一致）
    const iconSize = 12; // loading icon 固定 12px
    const thumbSize = $size === 'small' ? 12 : 18;
    const defaultOffset = 2; // 默认边距
    
    if ($width) {
      // 自定义宽度时，动态计算位置（与 Thumb 保持一致）
      // 未选中时：left = 边距 + (thumb尺寸 - icon尺寸) / 2 （居中在 thumb 位置）
      // 选中时：left = 宽度 - thumb尺寸 - 边距 + (thumb尺寸 - icon尺寸) / 2
      const thumbLeft = $checked ? $width - thumbSize - defaultOffset : defaultOffset;
      const leftValue = thumbLeft + (thumbSize - iconSize) / 2;
      return `
        left: ${leftValue}px;
      `;
    }
    
    // 默认尺寸
    if ($size === 'small') {
      const thumbLeft = $checked ? 14 : 2;
      const leftValue = thumbLeft + (thumbSize - iconSize) / 2;
      return `
        left: ${leftValue}px;
      `;
    }
    const thumbLeft = $checked ? 24 : 2;
    const leftValue = thumbLeft + (thumbSize - iconSize) / 2;
    return `
      left: ${leftValue}px;
    `;
  }}

  ${({ $styles }) => $styles && Object.entries($styles).map(([key, value]) => `${key}: ${value};`).join('\n')}
`;

// Inner 组件 - 用于显示文字内容（选中状态）
export const CheckedInner = styled.span<{
  $size: 'default' | 'small';
  $styles?: SwitchStyles['inner'];
}>
`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${({ $size }) => $size === 'small' ? '3px' : '4px'};
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: ${({ $size }) => $size === 'small' ? '9px' : '10px'};
  color: #fff;
  white-space: nowrap;
  user-select: none;
  z-index: 1;
  padding-right: ${({ $size }) => $size === 'small' ? '14px' : '20px'};
  font-weight: 500;
  letter-spacing: 0.2px;

  &.switch-checked-inner {
    /* 外部可通过 .switch-checked-inner 选择器覆盖样式 */
  }

  ${({ $styles }) => $styles && Object.entries($styles).map(([key, value]) => `${key}: ${value};`).join('\n')}
`;

// Inner 组件 - 用于显示文字内容（非选中状态）
export const UnCheckedInner = styled.span<{
  $size: 'default' | 'small';
  $styles?: SwitchStyles['inner'];
}>
`
  position: absolute;
  top: 0;
  bottom: 0;
  right: ${({ $size }) => $size === 'small' ? '3px' : '4px'};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: ${({ $size }) => $size === 'small' ? '9px' : '10px'};
  color: ${getCSSVar('--idp-text-color-secondary', 'rgba(0, 0, 0, 0.65)')};
  white-space: nowrap;
  user-select: none;
  z-index: 1;
  padding-left: ${({ $size }) => $size === 'small' ? '14px' : '20px'};
  font-weight: 500;
  letter-spacing: 0.2px;

  &.switch-unchecked-inner {
    /* 外部可通过 .switch-unchecked-inner 选择器覆盖样式 */
  }

  ${({ $styles }) => $styles && Object.entries($styles).map(([key, value]) => `${key}: ${value};`).join('\n')}
`;

// 注入全局样式的函数
export const injectGlobalStyles = () => {
  if (typeof document !== 'undefined' && !document.getElementById('idp-switch-styles')) {
    const style = document.createElement('style');
    style.id = 'idp-switch-styles';
    style.textContent = `
      @keyframes idp-switch-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes idp-switch-thumb-spin {
        from { transform: translateY(-50%) rotate(0deg); }
        to { transform: translateY(-50%) rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
};
