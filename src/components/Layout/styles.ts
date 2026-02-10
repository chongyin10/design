import styled from 'styled-components';

// 从 CSS 变量中读取值的辅助函数
const getCSSVar = (property: string, fallback: string) => `var(${property}, ${fallback})`;

// Layout 容器
export const LayoutWrapper = styled.div<{ $hasSider?: boolean }>`
  display: flex;
  flex-direction: column;
  min-height: ${_props => getCSSVar('--layout-min-height', '100vh')};
  max-height: 100vh;
  background-color: ${_props => getCSSVar('--layout-bg', '#f0f2f5')};
  box-sizing: border-box;
  position: relative;
  overflow: hidden;

  &.layout-wrapper {
    /* 外部可通过 .layout-wrapper 选择器覆盖样式 */
  }

  ${({ $hasSider }) => $hasSider && `
    flex-direction: row;
  `}
`;

// Layout.Header
export const HeaderWrapper = styled.header<{ $fixed?: boolean; $height?: string | number }>`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding: ${_props => getCSSVar('--layout-header-padding', '0 24px')};
  background-color: ${_props => getCSSVar('--layout-header-bg', '#001529')};
  color: ${_props => getCSSVar('--layout-header-color', '#fff')};
  height: ${({ $height }) => typeof $height === 'number' ? `${$height}px` : $height || getCSSVar('--layout-header-height', '64px')};
  z-index: ${_props => getCSSVar('--layout-header-z-index', '10')};
  transition: ${_props => getCSSVar('--layout-header-transition', 'all 0.3s ease')};
  box-sizing: border-box;

  &.layout-header {
    /* 外部可通过 .layout-header 选择器覆盖样式 */
  }

  ${({ $fixed }) => $fixed && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    box-shadow: ${getCSSVar('--layout-header-box-shadow', '0 2px 8px rgba(0, 0, 0, 0.15)')};
  `}
`;

// Layout.Sider
export const SiderWrapper = styled.aside<{
  $width?: string | number;
  $collapsedWidth?: number;
  $collapsed?: boolean;
  $fixed?: boolean;
  $zeroWidthMode?: boolean;
}>`
  display: flex;
  flex-direction: column;
  background-color: ${_props => getCSSVar('--layout-sider-bg', '#001529')};
  color: ${_props => getCSSVar('--layout-sider-color', 'rgba(255, 255, 255, 0.65)')};
  z-index: ${_props => getCSSVar('--layout-sider-z-index', '10')};
  transition: ${_props => getCSSVar('--layout-sider-transition', 'all 0.3s ease')};
  flex: ${_props => getCSSVar('--layout-sider-flex', '0 0 200px')};
  box-sizing: border-box;

  /* Sider 高度 = 浏览器高度 - Header 高度 - Trigger 高度 */
  max-height: calc(100vh - var(--layout-header-height, 64px) - 10px);

  &.layout-sider {
    /* 外部可通过 .layout-sider 选择器覆盖样式 */
  }

  /* 让子元素占据剩余空间，使 trigger 可以固定在底部 */
  & > *:not(.layout-sider-trigger) {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }

  ${({ $width, $collapsedWidth, $collapsed }) => {
    const width = typeof $width === 'number' ? `${$width}px` : $width || getCSSVar('--layout-sider-width', '200px');
    const collapsedWidth = $collapsedWidth !== undefined ? `${$collapsedWidth}px` : getCSSVar('--layout-sider-collapsed-width', '64px');
    return `
      width: ${$collapsed ? collapsedWidth : width};
      min-width: ${$collapsed ? collapsedWidth : width};
      max-width: ${$collapsed ? collapsedWidth : width};
    `;
  }}

  ${({ $fixed }) => $fixed && `
    position: fixed;
    top: ${getCSSVar('--layout-header-height', '64px')};
    left: 0;
    bottom: 0;
    overflow-y: auto;
    box-shadow: ${getCSSVar('--layout-sider-box-shadow', '2px 0 8px rgba(0, 0, 0, 0.15)')};
  `}
`;

// Sider 内容包装器
export const SiderContentWrapper = styled.div<{ $collapsed?: boolean }>`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  
  /* 内容过渡动画 */
  & > * {
    transition: all 0.3s ease;
  }
  
  /* 收缩状态下的内容样式 */
  ${({ $collapsed }) => $collapsed && `
    & > * {
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `}
`;

// Sider 收缩触发器
export const SiderTrigger = styled.div<{ $collapsed?: boolean; $placement?: 'top' | 'bottom'; $zeroWidthMode?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${_props => getCSSVar('--layout-sider-trigger-height', '48px')};
  background-color: ${_props => getCSSVar('--layout-sider-trigger-bg', '#002140')};
  color: ${_props => getCSSVar('--layout-sider-trigger-color', '#fff')};
  cursor: pointer;
  transition: ${_props => getCSSVar('--layout-sider-trigger-transition', 'all 0.3s ease')};
  user-select: none;
  order: ${({ $placement }) => $placement === 'top' ? '-1' : 'auto'};

  &.layout-sider-trigger {
    /* 外部可通过 .layout-sider-trigger 选择器覆盖样式 */
  }

  &:hover {
    background-color: ${_props => getCSSVar('--layout-sider-trigger-hover-bg', '#1890ff')};
  }

  /* 零宽度模式下，收缩时隐藏触发器 */
  ${({ $zeroWidthMode, $collapsed }) => $zeroWidthMode && $collapsed && `
    display: none;
  `}
`;

// 零宽度模式下，在 Content 内显示的展开按钮
export const ZeroWidthTriggerInContent = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #1890ff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 100;
  transition: all 0.3s ease;

  &:hover {
    background-color: #40a9ff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    transform: scale(1.05);
  }
`;

// Layout 内容区域容器（包含 Content 和 Sider）
export const LayoutInnerWrapper = styled.div<{ $hasSider?: boolean }>`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;

  ${({ $hasSider }) => $hasSider && `
    flex-direction: row;
  `}
`;

// Layout.Content
export const ContentWrapper = styled.main<{ $fixed?: boolean; $theme?: 'light' | 'dark' }>`
  flex: 1;
  padding: ${_props => getCSSVar('--layout-content-padding', '24px')};
  background-color: ${_props => getCSSVar('--layout-content-bg', '#fff')};
  min-height: ${_props => getCSSVar('--layout-content-min-height', '280px')};
  transition: ${_props => getCSSVar('--layout-content-transition', 'all 0.3s ease')};
  overflow-y: auto;
  box-sizing: border-box;
  position: relative;

  &.layout-content {
    /* 外部可通过 .layout-content 选择器覆盖样式 */
  }

  ${({ $fixed }) => $fixed && `
    overflow-y: auto;
  `}

  /* Dark 主题滚动条样式 */
  ${({ $theme }) => $theme === 'dark' && `
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: color-mix(in srgb, var(--idp-primary-color, #1890ff) 50%, transparent);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: color-mix(in srgb, var(--idp-primary-color, #1890ff) 70%, transparent);
    }

    scrollbar-width: thin;
    scrollbar-color: color-mix(in srgb, var(--idp-primary-color, #1890ff) 50%, transparent) transparent;
  `}
`;

// Layout.Footer
export const FooterWrapper = styled.footer<{ $fixed?: boolean; $height?: string | number }>`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding: ${_props => getCSSVar('--layout-footer-padding', '24px 50px')};
  background-color: ${_props => getCSSVar('--layout-footer-bg', '#f0f2f5')};
  color: ${_props => getCSSVar('--layout-footer-color', 'rgba(0, 0, 0, 0.65)')};
  height: ${({ $height }) => typeof $height === 'number' ? `${$height}px` : $height || getCSSVar('--layout-footer-height', '48px')};
  border-top: ${_props => getCSSVar('--layout-footer-border-top', '1px solid #e8e8e8')};
  z-index: ${_props => getCSSVar('--layout-footer-z-index', '10')};
  transition: ${_props => getCSSVar('--layout-footer-transition', 'all 0.3s ease')};
  box-sizing: border-box;

  &.layout-footer {
    /* 外部可通过 .layout-footer 选择器覆盖样式 */
  }

  ${({ $fixed }) => $fixed && `
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.15);
  `}
`;
