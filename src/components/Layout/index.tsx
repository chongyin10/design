import React from 'react';
import Icon from '../Icon';
import './Layout.css';
import {
  getLayoutClassName,
  getLayoutStyle,
  getHeaderClassName,
  getHeaderStyle,
  getSiderClassName,
  getSiderStyle,
  getSiderContentClassName,
  getSiderContentStyle,
  getSiderTriggerClassName,
  getSiderTriggerStyle,
  getZeroWidthTriggerClassName,
  getZeroWidthTriggerStyle,
  getContentClassName,
  getContentStyle,
  getFooterClassName,
  getFooterStyle,
} from './styles';
import {
  LayoutProps,
  LayoutHeaderProps,
  LayoutContentProps,
  LayoutFooterProps,
  LayoutSiderProps
} from './types';
import { LayoutProvider, useLayoutContext } from './LayoutContext';

// 用于检测是否在嵌套布局中的 Context
interface NestedLayoutContextType {
  isNested: boolean;
}
const NestedLayoutContext = React.createContext<NestedLayoutContextType>({ isNested: false });

/**
 * Layout 页面布局组件
 *
 * Layout 提供页面级别的布局模式，包含 Header、Content、Footer、Sider 四部分。
 * 支持多种布局方式：顶栏、侧栏、内容区、页脚的灵活组合。
 *
 * @example
 * ```tsx
 * <Layout>
 *   <Layout.Header>Header</Layout.Header>
 *   <Layout>
 *     <Layout.Sider>Sider</Layout.Sider>
 *     <Layout.Content>Content</Layout.Content>
 *   </Layout>
 *   <Layout.Footer>Footer</Layout.Footer>
 * </Layout>
 * ```
 */
interface LayoutComponent extends React.FC<LayoutProps> {
  Header: typeof Header;
  Sider: typeof Sider;
  Content: typeof Content;
  Footer: typeof Footer;
}

const BaseLayout: React.FC<LayoutProps> = ({ className = '', style = {}, children, hasSider, theme = 'light' }) => {
  // 自动检测是否包含 Sider
  const detectHasSider = (children: React.ReactNode): boolean => {
    if (!children) return false;
    return React.Children.toArray(children).some(
      (child: React.ReactNode) => React.isValidElement(child) && child.type === Sider
    );
  };

  const finalHasSider = hasSider !== undefined ? hasSider : detectHasSider(children);

  // SSR 安全：确保 theme 始终是确定值，避免 hydration 不匹配
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <LayoutProvider>
      <NestedLayoutContext.Provider value={{ isNested: true }}>
        <div
          className={getLayoutClassName({ hasSider: finalHasSider, theme, mounted, className })}
          style={getLayoutStyle({ style })}
          data-theme={theme}
        >
          {children}
        </div>
      </NestedLayoutContext.Provider>
    </LayoutProvider>
  );
};

/**
 * Layout.Header 头部区域组件
 *
 * 通常用于显示页面标题、导航等
 *
 * @example
 * ```tsx
 * <Layout.Header fixed height={64}>
 *   <div>Logo</div>
 * </Layout.Header>
 * ```
 */
export const Header: React.FC<LayoutHeaderProps> = ({
  className = '',
  style = {},
  children,
  height,
  fixed = false,
  theme = 'light'
}) => {
  // 确保 theme 有默认值，避免 SSR 时 undefined
  const safeTheme = theme ?? 'light';

  return (
    <header
      className={getHeaderClassName({ fixed, theme: safeTheme, className })}
      style={getHeaderStyle({ height, style })}
      data-theme={safeTheme}
    >
      {children}
    </header>
  );
};

/**
 * Layout.Sider 侧边栏组件
 *
 * 通常用于显示导航菜单，支持收缩功能
 *
 * @example
 * ```tsx
 * <Layout.Sider
 *   width={200}
 *   collapsible
 *   collapsed={collapsed}
 *   onCollapse={(collapsed) => setCollapsed(collapsed)}
 * >
 *   <Menu />
 * </Layout.Sider>
 * ```
 */
export const Sider: React.FC<LayoutSiderProps> = ({
  className = '',
  style = {},
  children,
  width = 200,
  collapsedWidth = 60,
  collapsible = false,
  collapsed = false,
  onCollapse,
  trigger,
  triggerPlacement = 'bottom',
  zeroWidthMode = false,
  fixed = false,
  theme = 'light'
}) => {
  // 确保 theme 有默认值，避免 SSR 时 undefined
  const safeTheme = theme ?? 'light';
  const { setSiderCollapsed, setZeroWidthMode, setOnExpand } = useLayoutContext();

  // 同步状态到 Context
  React.useEffect(() => {
    setSiderCollapsed(collapsed);
    setZeroWidthMode(zeroWidthMode);
  }, [collapsed, zeroWidthMode, setSiderCollapsed, setZeroWidthMode]);

  const handleCollapse = () => {
    onCollapse?.(!collapsed);
  };

  // 注册展开回调到 Context
  React.useEffect(() => {
    setOnExpand(() => handleCollapse);
  }, [collapsed, onCollapse, setOnExpand]);

  // 在 zeroWidthMode 下，收缩时宽度为 0
  const actualCollapsedWidth = zeroWidthMode && collapsed ? 0 : collapsedWidth;

  return (
    <aside
      className={getSiderClassName({ fixed, theme: safeTheme, collapsed, className })}
      style={getSiderStyle({ width, collapsedWidth: actualCollapsedWidth, collapsed, style })}
      data-theme={safeTheme}
    >
      <div className={getSiderContentClassName({ collapsed })} style={getSiderContentStyle({})}>
        {children}
      </div>
      {collapsible && (
        <div
          className={getSiderTriggerClassName({
            collapsed,
            placement: zeroWidthMode ? 'top' : triggerPlacement,
            zeroWidthMode,
            theme: safeTheme
          })}
          style={getSiderTriggerStyle({})}
          onClick={handleCollapse}
        >
          {trigger || (
            <Icon
              type={collapsed ? 'arrowRight' : 'arrowLeft'}
              size={20}
              color={safeTheme === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.65)'}
            />
          )}
        </div>
      )}
    </aside>
  );
};

/**
 * Layout.Content 内容区域组件
 *
 * 主要内容展示区域
 *
 * @example
 * ```tsx
 * <Layout.Content>
 *   <p>Page content goes here</p>
 * </Layout.Content>
 * ```
 */
export const Content: React.FC<LayoutContentProps> = ({
  className = '',
  style = {},
  children,
  theme = 'light'
}) => {
  // 确保 theme 有默认值，避免 SSR 时 undefined
  const safeTheme = theme ?? 'light';
  const { siderCollapsed, zeroWidthMode, onExpand } = useLayoutContext();

  return (
    <main
      className={getContentClassName({ theme: safeTheme, className })}
      style={getContentStyle({ style })}
      data-theme={safeTheme}
    >
      {/* 零宽度模式下，Sider 收缩时在 Content 内显示展开按钮 */}
      {zeroWidthMode && siderCollapsed && (
        <div
          className={getZeroWidthTriggerClassName({})}
          style={getZeroWidthTriggerStyle({})}
          onClick={onExpand}
        >
          <Icon type="menu" size={24} color="#fff" />
        </div>
      )}
      {children}
    </main>
  );
};

/**
 * Layout.Footer 页脚区域组件
 *
 * 通常用于显示版权信息、辅助链接等
 *
 * @example
 * ```tsx
 * <Layout.Footer height={48}>
 *   <div>© 2025 Your Company</div>
 * </Layout.Footer>
 * ```
 */
export const Footer: React.FC<LayoutFooterProps> = ({
  className = '',
  style = {},
  children,
  height,
  fixed = false,
  theme = 'light'
}) => {
  // 确保 theme 有默认值，避免 SSR 时 undefined
  const safeTheme = theme ?? 'light';
  return (
    <footer
      className={getFooterClassName({ fixed, theme: safeTheme, className })}
      style={getFooterStyle({ height, style })}
      data-theme={safeTheme}
    >
      {children}
    </footer>
  );
};

// 组合 Layout 组件
const Layout = BaseLayout as LayoutComponent;
Layout.Header = Header;
Layout.Sider = Sider;
Layout.Content = Content;
Layout.Footer = Footer;

export default Layout;
