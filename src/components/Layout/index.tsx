import React from 'react';
import Icon from '../Icon';
import './Layout.css';
import {
  LayoutWrapper,
  HeaderWrapper,
  SiderWrapper,
  SiderContentWrapper,
  SiderTrigger,
  ContentWrapper,
  FooterWrapper,
  ZeroWidthTriggerInContent
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

// Hook 用于检测是否在嵌套布局中
const useNestedLayout = () => React.useContext(NestedLayoutContext);

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

const BaseLayout: React.FC<LayoutProps> = ({ className = '', style = {}, children, hasSider, theme }) => {
  // 自动检测是否包含 Sider
  const detectHasSider = (children: React.ReactNode): boolean => {
    if (!children) return false;
    return React.Children.toArray(children).some(
      (child: React.ReactNode) => React.isValidElement(child) && child.type === Sider
    );
  };

  const finalHasSider = hasSider !== undefined ? hasSider : detectHasSider(children);

  return (
    <LayoutProvider>
      <NestedLayoutContext.Provider value={{ isNested: true }}>
        <LayoutWrapper
          className={`layout-wrapper ${className}`}
          style={style}
          $hasSider={finalHasSider}
          $theme={theme}
        >
          {children}
        </LayoutWrapper>
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

  const bgColor:any = style?.background || '#3030302b';

  return (
    <HeaderWrapper
      className={`layout-header layout-header-${theme} ${className}`}
      style={style}
      $height={height}
      $fixed={fixed}
      $theme={theme}
      $bgColor={bgColor}
    >
      {children}
    </HeaderWrapper>
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
  theme = "light"
}) => {
  // 检测是否在嵌套布局中
  const { isNested } = useNestedLayout();
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
    <SiderWrapper
      className={`layout-sider ${collapsed ? 'collapsed' : ''} ${className}`}
      style={style}
      $width={width}
      $collapsedWidth={actualCollapsedWidth}
      $collapsed={collapsed}
      $fixed={fixed}
      $theme={theme}
      $inNestedLayout={isNested}
    >
      <SiderContentWrapper>{children}</SiderContentWrapper>
      {collapsible && (
        <SiderTrigger
          className="layout-sider-trigger"
          $collapsed={collapsed}
          $placement={zeroWidthMode ? 'top' : triggerPlacement}
          onClick={handleCollapse}
          $zeroWidthMode={zeroWidthMode}
          $theme={theme}
        >
          {trigger || (
            <Icon
              type={collapsed ? 'arrowRight' : 'arrowLeft'}
              size={20}
              color={theme === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.65)'}
            />
          )}
        </SiderTrigger>
      )}
    </SiderWrapper>
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
  const { siderCollapsed, zeroWidthMode, onExpand } = useLayoutContext();

  return (
    <ContentWrapper
      className={`layout-content ${className}`}
      style={style}
      $theme={theme}
    >
      {/* 零宽度模式下，Sider 收缩时在 Content 内显示展开按钮 */}
      {zeroWidthMode && siderCollapsed && (
        <ZeroWidthTriggerInContent onClick={onExpand}>
          <Icon type="menu" size={24} color="#fff" />
        </ZeroWidthTriggerInContent>
      )}
      {children}
    </ContentWrapper>
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
  theme
}) => {
  return (
    <FooterWrapper
      className={`layout-footer ${className}`}
      style={style}
      $height={height}
      $fixed={fixed}
      $theme={theme}
    >
      {children}
    </FooterWrapper>
  );
};

// 组合 Layout 组件
const Layout = BaseLayout as LayoutComponent;
Layout.Header = Header;
Layout.Sider = Sider;
Layout.Content = Content;
Layout.Footer = Footer;

export default Layout;
