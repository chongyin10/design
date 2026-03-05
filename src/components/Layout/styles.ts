import styled from 'styled-components';

// 从 CSS 变量中读取值的辅助函数
const getCSSVar = (property: string, fallback: string) => `var(${property}, ${fallback})`;

// ============================================
// Layout 容器
// ============================================
export const LayoutWrapper = styled.div<{ $hasSider?: boolean; $theme?: 'light' | 'dark' }>`
  display: flex;
  flex-direction: column;
  min-height: ${getCSSVar('--layout-min-height', '100vh')};
  max-height: 100vh;
  background: ${({ $theme }) =>
    $theme === 'dark'
      ? `linear-gradient(180deg, ${getCSSVar('--layout-bg-dark', '#000')} 0%, ${getCSSVar('--zjpcy-text-color', 'rgba(0, 0, 0, 0.85)')} 100%)`
      : `linear-gradient(180deg, ${getCSSVar('--layout-bg-light', '#f5f5f5')} 0%, ${getCSSVar('--zjpcy-bg-color', '#fafafa')} 100%)`};
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  flex: 1;

  &.layout-wrapper {
    /* 外部可通过 .layout-wrapper 选择器覆盖样式 */
  }

  ${({ $hasSider }) => $hasSider && `
    flex-direction: row;
    align-items: stretch;
  `}
`;

// ============================================
// Layout.Header
// ============================================
export const HeaderWrapper = styled.header<{ $fixed?: boolean; $height?: string | number; $theme?: 'light' | 'dark', $bgColor?: string }>`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding: ${getCSSVar('--layout-header-padding', '0 24px')};
  background: ${({ $theme }) =>
    $theme === 'dark'
      ? `linear-gradient(135deg, ${getCSSVar('--layout-header-bg-dark', '#001529')} 0%, #002140 100%)`
      : `linear-gradient(135deg, ${getCSSVar('--layout-header-bg-light', '#fff')} 0%, ${getCSSVar('--zjpcy-bg-color', '#fafafa')} 100%)`};
  color: ${({ $theme }) =>
    $theme === 'dark'
      ? getCSSVar('--layout-header-color-dark', '#fff')
      : getCSSVar('--layout-header-color-light', 'rgba(0, 0, 0, 0.85)')};
  height: ${({ $height }) => typeof $height === 'number' ? `${$height}px` : $height || getCSSVar('--layout-header-height', '60px')};
  z-index: ${getCSSVar('--layout-header-z-index', '10')};
  transition: ${getCSSVar('--layout-header-transition', 'all 0.2s ease-in-out')};
  box-sizing: border-box;

  &.layout-header-light {
    border-bottom: ${({ $bgColor }) => `1px solid ${$bgColor}`};
  }

  &.layout-header-dark {
    border-bottom: 1px solid transparent;
  }

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

// ============================================
// Layout.Sider
// ============================================
export const SiderWrapper = styled.aside<{
  $width?: string | number;
  $collapsedWidth?: number;
  $collapsed?: boolean;
  $fixed?: boolean;
  $zeroWidthMode?: boolean;
  $theme?: 'light' | 'dark';
  $inNestedLayout?: boolean;
}>`
  display: flex;
  flex-direction: column;
  background: ${({ $theme, style }) =>
    // 如果用户通过 style 传入 background，则不应用默认背景
    style?.background !== undefined
      ? style.background
      : $theme === 'dark'
        ? `linear-gradient(180deg, ${getCSSVar('--layout-sider-bg-dark', '#001529')} 0%, #002140 100%)`
        : `linear-gradient(180deg, ${getCSSVar('--layout-sider-bg-light', '#fff')} 0%, ${getCSSVar('--zjpcy-bg-color', '#fafafa')} 100%)`};
  color: ${({ $theme, style }) =>
    // 如果用户通过 style 传入 color，则不应用默认颜色
    style?.color !== undefined
      ? style.color
      : $theme === 'dark'
        ? getCSSVar('--layout-sider-color-dark', '#fff')
        : getCSSVar('--layout-sider-color-light', 'rgba(0, 0, 0, 0.85)')};
  z-index: ${getCSSVar('--layout-sider-z-index', '10')};
  transition: ${getCSSVar('--layout-sider-transition', 'all 0.2s ease-in-out')};
  flex: ${getCSSVar('--layout-sider-flex', '0 0 200px')};
  box-sizing: border-box;
  border-right: ${({ $theme }) =>
    $theme === 'dark'
      ? `var(--layout-sider-border, 1px solid #303030)`
      : `var(--layout-sider-border, 1px solid ${getCSSVar('--zjpcy-border-color-light', '#f0f0f0')})`};
  box-shadow: ${({ $theme }) =>
    $theme === 'dark'
      ? '2px 0 8px rgba(0, 0, 0, 0.3)'
      : getCSSVar('--zjpcy-shadow-sm', '0 2px 8px rgba(0, 0, 0, 0.08)')};


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
    const collapsedWidth = $collapsedWidth !== undefined ? `${$collapsedWidth}px` : getCSSVar('--layout-sider-collapsed-width', '60px');
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
    box-shadow: ${getCSSVar('--layout-sider-box-shadow', '0 4px 12px rgba(0, 0, 0, 0.15)')};
  `}

  /* ============================================
     集成 Menu 组件样式 - 与 Menu.css 保持一致
     ============================================ */
  
  /* 覆盖 Menu 组件基础样式 */
  .zjpcy-menu {
    background: transparent;
  }

  /* Menu 菜单项在 Sider 中的样式 - 覆盖默认样式 */
  .zjpcy-menu-item {
    border-radius: ${getCSSVar('--zjpcy-border-radius-sm', '4px')};
    
    /* Light 主题 - 与 Menu.css 保持一致 */
    &.light {
      color: ${getCSSVar('--zjpcy-text-color', 'rgba(0, 0, 0, 0.85)')};
      
      &:hover:not(.disabled) {
        background: ${getCSSVar('--zjpcy-primary-light-color', 'rgba(24, 144, 255, 0.06)')};
        color: ${getCSSVar('--zjpcy-primary-color', '#1890ff')};
      }
      
      &.selected {
        background-color: ${getCSSVar('--zjpcy-primary-light-color', 'rgba(24, 144, 255, 0.12)')};
        color: ${getCSSVar('--zjpcy-primary-color', '#1890ff')};
        box-shadow: inset 3px 0 0 ${getCSSVar('--zjpcy-primary-color', '#1890ff')};
        font-weight: 600;
        
        &:hover {
          background-color: ${getCSSVar('--zjpcy-primary-light-color', 'rgba(24, 144, 255, 0.18)')};
        }
      }
    }
    
    /* Dark 主题 - 与 Menu.css 保持一致 */
    &.dark {
      color: rgba(255, 255, 255, 0.85);
      
      &:hover:not(.disabled) {
        background-color: rgba(255, 255, 255, 0.08);
        color: #fff;
      }
      
      &.selected {
        background-color: rgba(24, 144, 255, 0.25);
        color: #fff;
        box-shadow: inset 3px 0 0 ${getCSSVar('--zjpcy-primary-color', '#1890ff')};
        font-weight: 600;
        
        &:hover {
          background-color: rgba(24, 144, 255, 0.35);
        }
      }
    }
  }

  /* 子菜单样式 */
  .zjpcy-menu-submenu {
    .zjpcy-menu-item {
      margin: 0px;
    }
  }

  /* Dark 主题下的子菜单样式 */
  .zjpcy-menu-submenu.horizontal-popup,
  .zjpcy-menu-submenu.horizontal-popup .zjpcy-menu-submenu {
    background: linear-gradient(135deg, #001529 0%, #002140 100%);
    border: 1px solid #303030;
  }

  /* Dark 主题下子菜单中的菜单项 */
  .zjpcy-menu-submenu .zjpcy-menu-item.dark {
    color: rgba(255, 255, 255, 0.85);
    
    &:hover:not(.disabled) {
      background-color: rgba(255, 255, 255, 0.08);
      color: #fff;
    }
    
    &.selected {
      background-color: rgba(24, 144, 255, 0.25);
      color: #fff;
    }
  }
`;

// ============================================
// Sider 内容包装器
// ============================================
export const SiderContentWrapper = styled.div<{ $collapsed?: boolean }>`
  flex: 1;
  overflow-y: auto;
  overflow-x: ${({ $collapsed }) => $collapsed ? 'visible' : 'hidden'};

  /* 内容过渡动画 */
  & > * {
    transition: all ${getCSSVar('--zjpcy-transition-duration', '0.2s')} ease;
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

// ============================================
// Sider 收缩触发器
// ============================================
export const SiderTrigger = styled.div<{ $collapsed?: boolean; $placement?: 'top' | 'bottom'; $zeroWidthMode?: boolean; $theme?: 'light' | 'dark' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${getCSSVar('--layout-trigger-height', '48px')};
  background: ${({ $theme }) =>
    $theme === 'dark'
      ? `linear-gradient(135deg, ${getCSSVar('--layout-sider-bg-dark', '#001529')} 0%, #002140 100%)`
      : `linear-gradient(135deg, ${getCSSVar('--layout-sider-bg-light', '#fff')} 0%, ${getCSSVar('--zjpcy-bg-color', '#fafafa')} 100%)`};
  color: ${({ $theme }) =>
    $theme === 'dark'
      ? getCSSVar('--layout-sider-color-dark', '#fff')
      : getCSSVar('--layout-sider-color-light', 'rgba(0, 0, 0, 0.85)')};
  cursor: pointer;
  transition: ${getCSSVar('--layout-trigger-transition', 'all 0.2s ease-in-out')};
  user-select: none;
  order: ${({ $placement }) => $placement === 'top' ? '-1' : 'auto'};

  &.layout-sider-trigger {
    /* 外部可通过 .layout-sider-trigger 选择器覆盖样式 */
  }

  &:hover {
    background: ${({ $theme }) =>
    $theme === 'dark'
      ? `linear-gradient(135deg, #002140 0%, ${getCSSVar('--zjpcy-primary-color', '#1890ff')} 100%)`
      : `linear-gradient(135deg, ${getCSSVar('--zjpcy-primary-light-color', 'rgba(24, 100, 240, 0.1)')} 0%, ${getCSSVar('--zjpcy-bg-color-light', '#f5f5f5')} 100%)`};
    color: ${({ $theme }) =>
    $theme === 'dark'
      ? '#fff'
      : getCSSVar('--zjpcy-primary-color', '#1890ff')};
  }

  /* 分割线 */
  ${({ $placement, $theme }) => $placement === 'top' && `
    border-bottom: 1px solid ${$theme === 'dark' ? '#303030' : getCSSVar('--zjpcy-border-color-light', '#f0f0f0')};
  `}

  ${({ $placement, $theme }) => $placement !== 'top' && `
    border-top: 1px solid ${$theme === 'dark' ? '#303030' : getCSSVar('--zjpcy-border-color-light', '#f0f0f0')};
  `}

  /* 零宽度模式下，收缩时隐藏触发器 */
  ${({ $zeroWidthMode, $collapsed }) => $zeroWidthMode && $collapsed && `
    display: none;
  `}
`;

// ============================================
// 零宽度模式下，在 Content 内显示的展开按钮
// ============================================
export const ZeroWidthTriggerInContent = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${getCSSVar('--zjpcy-primary-color', '#1890ff')} 0%, ${getCSSVar('--zjpcy-primary-hover-color', '#40a9ff')} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: ${getCSSVar('--zjpcy-shadow-sm', '0 2px 8px rgba(0, 0, 0, 0.15)')};
  z-index: 100;
  transition: all ${getCSSVar('--zjpcy-transition-duration', '0.2s')} ${getCSSVar('--zjpcy-transition-timing-function', 'ease-in-out')};

  &:hover {
    background: linear-gradient(135deg, ${getCSSVar('--zjpcy-primary-hover-color', '#40a9ff')} 0%, #69c0ff 100%);
    box-shadow: ${getCSSVar('--zjpcy-shadow-md', '0 4px 12px rgba(0, 0, 0, 0.25)')};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
    box-shadow: ${getCSSVar('--zjpcy-shadow-extra-light', '0 2px 8px rgba(0, 0, 0, 0.08)')};
  }
`;

// ============================================
// Layout 内容区域容器（包含 Content 和 Sider）
// ============================================
export const LayoutInnerWrapper = styled.div<{ $hasSider?: boolean }>`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;

  ${({ $hasSider }) => $hasSider && `
    flex-direction: row;
  `}
`;

// ============================================
// Layout.Content
// ============================================
export const ContentWrapper = styled.main<{ $fixed?: boolean; $theme?: 'light' | 'dark' }>`
  flex: 1;
  padding: ${getCSSVar('--layout-content-padding', '24px')};
  background: ${getCSSVar('--layout-content-bg', 'transparent')};
  min-height: ${getCSSVar('--layout-content-min-height', '280px')};
  transition: ${getCSSVar('--layout-content-transition', 'all 0.2s ease-in-out')};
  overflow-y: auto;
  box-sizing: border-box;
  position: relative;

  &.layout-content {
    /* 外部可通过 .layout-content 选择器覆盖样式 */
  }

  ${({ $fixed }) => $fixed && `
    overflow-y: auto;
  `}

  /* 滚动条样式 */
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${getCSSVar('--zjpcy-border-color-extra-light', '#d9d9d9')};
    border-radius: ${getCSSVar('--zjpcy-border-radius-sm', '4px')};
    transition: background-color ${getCSSVar('--zjpcy-transition-duration', '0.2s')} ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: ${getCSSVar('--zjpcy-text-color-tertiary', 'rgba(0, 0, 0, 0.45)')};
  }

  /* Dark 主题滚动条样式 */
  ${({ $theme }) => $theme === 'dark' && `
    &::-webkit-scrollbar-thumb {
      background-color: color-mix(in srgb, ${getCSSVar('--zjpcy-primary-color', '#1890ff')} 50%, transparent);
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: color-mix(in srgb, ${getCSSVar('--zjpcy-primary-color', '#1890ff')} 70%, transparent);
    }

    scrollbar-width: thin;
    scrollbar-color: color-mix(in srgb, ${getCSSVar('--zjpcy-primary-color', '#1890ff')} 50%, transparent) transparent;
  `}
`;

// ============================================
// Layout.Footer
// ============================================
export const FooterWrapper = styled.footer<{ $fixed?: boolean; $height?: string | number; $theme?: 'light' | 'dark' }>`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding: ${getCSSVar('--layout-footer-padding', '24px 50px')};
  background: ${({ $theme }) =>
    $theme === 'dark'
      ? `linear-gradient(135deg, ${getCSSVar('--layout-footer-bg-dark', '#001529')} 0%, #002140 100%)`
      : `linear-gradient(135deg, ${getCSSVar('--layout-footer-bg-light', '#fff')} 0%, ${getCSSVar('--zjpcy-bg-color', '#fafafa')} 100%)`};
  color: ${({ $theme }) =>
    $theme === 'dark'
      ? getCSSVar('--layout-footer-color-dark', '#fff')
      : getCSSVar('--layout-footer-color-light', 'rgba(0, 0, 0, 0.85)')};
  height: ${({ $height }) => typeof $height === 'number' ? `${$height}px` : $height || getCSSVar('--layout-footer-height', '48px')};
  border-top: ${({ $theme }) =>
    $theme === 'dark'
      ? `var(--layout-footer-border, 1px solid #303030)`
      : `var(--layout-footer-border, 1px solid ${getCSSVar('--zjpcy-border-color-light', '#f0f0f0')})`};
  z-index: ${getCSSVar('--layout-footer-z-index', '10')};
  transition: ${getCSSVar('--layout-footer-transition', 'all 0.2s ease-in-out')};
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
