import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { MenuProps, MenuItem, MenuItemComponentProps } from './types';
import { useClickOutside } from '../Hooks/useClickOutside';
import './index.css';

/**
 * 渲染缩略标签（折叠状态下显示）
 * 当菜单项无 icon 时，显示 label 的第一个字符
 */
const renderCollapsedLabel = (label: string): React.ReactNode => {
  const trimmedLabel = label.trim();
  if (!trimmedLabel) return '';

  // 使用 Array.from 正确处理 Unicode 字符（包括中文、emoji等）
  const chars = Array.from(trimmedLabel);
  return chars[0]?.toUpperCase() || '';
};

/**
 * 水平模式子菜单状态管理 Hook
 * 处理子菜单的显示/隐藏动画，避免卸载导致的抖动
 */
const useHorizontalSubMenu = (isOpen: boolean) => {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    let renderTimer: ReturnType<typeof setTimeout>;

    if (isOpen) {
      // 打开时：先渲染，再显示（触发进入动画）
      setShouldRender(true);
      // 使用 requestAnimationFrame 确保 DOM 已挂载
      renderTimer = requestAnimationFrame(() => {
        setIsVisible(true);
      }) as unknown as ReturnType<typeof setTimeout>;
    } else {
      // 关闭时：先隐藏（触发退出动画），再卸载
      setIsVisible(false);
      renderTimer = setTimeout(() => {
        setShouldRender(false);
      }, 150); // 与 CSS 过渡时间匹配
    }

    return () => {
      if (typeof renderTimer === 'number') {
        cancelAnimationFrame(renderTimer);
      } else {
        clearTimeout(renderTimer);
      }
    };
  }, [isOpen]);

  return { isVisible, shouldRender };
};

/**
 * 菜单项组件 - 递归渲染菜单项及其子菜单
 */
const MenuItemComponent: React.FC<MenuItemComponentProps> = React.memo(({
  item,
  level,
  mode,
  collapsed,
  theme,
  openKeySet,
  selectedKey,
  onItemClick,
  onToggleOpen
}) => {
  const hasChildren = !!item.children && item.children.length > 0;
  const isOpen = openKeySet.has(item.key);
  const isSelected = selectedKey === item.key;

  const isHorizontal = mode === 'horizontal';
  const isInline = mode === 'inline';
  const isVerticalFlat = mode === 'vertical-flat';
  const isRoot = level === 0;

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();

    if (item.disabled) return;

    // 扁平垂直模式下不处理展开/关闭
    if (hasChildren && !isVerticalFlat) {
      onToggleOpen(item.key);
    }

    // 扁平垂直模式下，有子菜单的父节点不可被选中
    if (isVerticalFlat && hasChildren) {
      return;
    }

    // 触发点击回调
    onItemClick(item, item.key);
  }, [item, onItemClick, onToggleOpen, hasChildren, isVerticalFlat]);

  // 水平模式下根级项目的内边距不同
  const getPaddingLeft = () => {
    if (isHorizontal && isRoot) return 16;
    if (isInline) return 12 + level * 24;
    if (collapsed) return 0;
    return 12 + level * 16;
  };

  const paddingLeft = getPaddingLeft();
  const shouldOpen = isOpen && (!collapsed || isHorizontal);

  // 水平模式使用延迟卸载避免抖动
  const { isVisible: isHorizontalSubMenuVisible, shouldRender: shouldRenderHorizontalSubMenu } = useHorizontalSubMenu(
    shouldOpen && isHorizontal && isRoot
  );

  // 判断是否显示箭头 - 扁平垂直模式下不显示箭头
  const showArrow = hasChildren && (!collapsed || !isRoot) && !isVerticalFlat;

  // 根据当前模式决定子菜单如何展开
  const getSubMenuClass = () => {
    if (isVerticalFlat) return 'idp-menu-submenu-vertical-flat idp-menu-submenu-vertical-flat-open';

    if (isHorizontal && isRoot) {
      return classNames('idp-menu-submenu-horizontal-popup', {
        'idp-menu-submenu-horizontal-popup-open': isHorizontalSubMenuVisible
      });
    }

    if (isInline) {
      return classNames('idp-menu-submenu-inline', {
        'idp-menu-submenu-inline-open': shouldOpen
      });
    }

    return classNames('idp-menu-submenu-vertical', {
      'idp-menu-submenu-vertical-open': shouldOpen
    });
  };

  // 根据层级确定主题：根目录使用传入的 theme，子目录根据层级切换
  const itemTheme = theme || 'light';

  // 菜单项 wrapper 类名
  const itemWrapperClass = classNames('idp-menu-item-wrapper', {
    'idp-menu-item-wrapper-root': isRoot,
    'idp-menu-item-wrapper-collapsed': collapsed && isRoot
  });

  // 菜单项类名
  const itemClass = classNames('idp-menu-item', {
    [`idp-menu-item-${itemTheme}`]: true,
    [`idp-menu-item-${itemTheme}-selected`]: isSelected,
    [`idp-menu-item-${itemTheme}-selected-vertical`]: isSelected && (mode === 'vertical' || mode === 'inline' || mode === 'vertical-flat'),
    'idp-menu-item-disabled': item.disabled,
    'idp-menu-item-has-children': hasChildren,
    'idp-menu-item-has-children-selected': hasChildren && isSelected,
    [`idp-menu-item-${itemTheme}-has-children`]: hasChildren,
    'idp-menu-item-root': isRoot,
    'idp-menu-item-collapsed': collapsed && isRoot
  });

  // 图标类名
  const iconClass = classNames('idp-menu-item-icon', {
    'idp-menu-item-icon-collapsed': collapsed
  });

  // 箭头类名
  const arrowClass = classNames('idp-menu-item-arrow', {
    'idp-menu-item-arrow-open': shouldOpen,
    'idp-menu-item-arrow-horizontal': isHorizontal,
    'idp-menu-item-arrow-horizontal-open': shouldOpen && isHorizontal
  });

  // 子菜单 wrapper 类名
  const subMenuWrapperClass = classNames('idp-menu-submenu-wrapper', {
    [`idp-menu-submenu-wrapper-${mode}`]: true,
    'idp-menu-submenu-wrapper-horizontal-popup': isHorizontal && isRoot,
    'idp-menu-submenu-wrapper-vertical-flat': isVerticalFlat,
    'idp-menu-submenu-wrapper-vertical-flat-container': isVerticalFlat
  });

  return (
    <div className={itemWrapperClass}>
      <div
        className={itemClass}
        style={{ padding: `0px ${paddingLeft}px` }}
        title={collapsed && isRoot ? item.label : undefined}
        onClick={handleClick}
      >
        <div className="idp-menu-item-content">
          {/* 折叠状态下：有 icon 显示 icon，无 icon 显示首字母 */}
          {collapsed ? (
            <>
              {item.icon ? (
                <span className={iconClass}>
                  {item.icon}
                </span>
              ) : (
                <span className="idp-menu-item-collapsed-label">
                  {renderCollapsedLabel(item.label)}
                </span>
              )}
            </>
          ) : (
            <>
              {item.icon && (
                <span className="idp-menu-item-icon">
                  {item.icon}
                </span>
              )}
              <div className="idp-menu-item-text">
                <span className="idp-menu-item-label">{item.label}</span>
                {item.description && !hasChildren && (
                  <span className="idp-menu-item-description">{item.description}</span>
                )}
              </div>
            </>
          )}
          {showArrow && (
            <span className={arrowClass}>
              <svg viewBox="0 0 1024 1024" width="10" height="10" fill="currentColor">
                <path d="M840.4 300H183.6c-19.7 0-30.7 25.7-18.5 40.5l328.4 402.4c9.4 11.6 26.7 11.6 36.1 0l328.4-402.4c12.2-14.8 1.2-40.5-18.5-40.5z" />
              </svg>
            </span>
          )}
        </div>
      </div>

      {/* 子菜单 */}
      {/* 水平弹出式子菜单使用延迟卸载避免抖动，垂直/内联/扁平垂直模式始终渲染以支持动画 */}
      {(hasChildren && (isHorizontal && isRoot ? shouldRenderHorizontalSubMenu : true)) && (
        <div className={subMenuWrapperClass}>
          <div className={getSubMenuClass()}>
            <div className="idp-menu-submenu-content">
              {item.children?.map((child: MenuItem) => (
                <MenuItemComponent
                  key={child.key}
                  item={child}
                  level={level + 1}
                  mode={mode}
                  collapsed={collapsed}
                  theme={theme}
                  openKeySet={openKeySet}
                  selectedKey={selectedKey}
                  onItemClick={onItemClick}
                  onToggleOpen={onToggleOpen}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

MenuItemComponent.displayName = 'MenuItemComponent';

/**
 * Menu 菜单导航组件
 *
 * 为页面和功能提供导航的菜单列表，支持水平顶部导航和垂直菜单
 * 子菜单内嵌在菜单区域，支持缩起/展开功能
 */
const Menu: React.FC<MenuProps> = ({
  mode = 'vertical',
  items,
  className = '',
  style,
  selectedKey: externalSelectedKey,
  defaultOpenKeys = [],
  openKeys: externalOpenKeys,
  collapsed = false,
  open: externalOpen,
  theme = 'light',
  onChange,
  onOpenChange
}) => {
  // 菜单根元素 ref，用于点击外部检测
  const menuRef = useRef<HTMLDivElement>(null);
  // 内部显示状态
  const [internalOpen] = useState(true);
  // 内部状态
  const [internalOpenKeys, setInternalOpenKeys] = useState<string[]>(defaultOpenKeys);
  const [internalSelectedKey, setInternalSelectedKey] = useState<string>('');

  // 判断是否为受控模式
  const isOpenKeysControlled = externalOpenKeys !== undefined;
  const isSelectedKeyControlled = externalSelectedKey !== undefined;
  const isOpenControlled = externalOpen !== undefined;

  // 当前展开的keys
  const currentOpenKeys = isOpenKeysControlled ? externalOpenKeys : internalOpenKeys;
  const currentSelectedKey = isSelectedKeyControlled ? externalSelectedKey : internalSelectedKey;
  // 当前显示状态
  const currentOpen = isOpenControlled ? externalOpen : internalOpen;

  // 构建 openKeySet 用于快速查找
  const openKeySet = useMemo(() => new Set(currentOpenKeys), [currentOpenKeys]);

  // 同步外部 selectedKey
  useEffect(() => {
    if (externalSelectedKey !== undefined) {
      setInternalSelectedKey(externalSelectedKey);
    }
  }, [externalSelectedKey]);

  // 当 selectedKey 变化时，自动展开其父级菜单
  // 注意：水平模式和扁平垂直模式下不自动展开
  useEffect(() => {
    if (currentSelectedKey && !isOpenKeysControlled && mode !== 'horizontal' && mode !== 'vertical-flat') {
      // 查找当前选中项的父级key
      const findParentKeys = (menuItems: MenuItem[], targetKey: string, parentKeys: string[] = []): string[] => {
        for (const item of menuItems) {
          if (item.key === targetKey) {
            return parentKeys;
          }
          if (item.children && item.children.length > 0) {
            const result = findParentKeys(item.children, targetKey, [...parentKeys, item.key]);
            if (result.length > 0) {
              return result;
            }
          }
        }
        return [];
      };

      const parentKeys = findParentKeys(items, currentSelectedKey);
      if (parentKeys.length > 0) {
        setInternalOpenKeys(prev => {
          const newKeys = new Set([...prev, ...parentKeys]);
          return Array.from(newKeys);
        });
      }
    }
  }, [currentSelectedKey, items, isOpenKeysControlled, mode]);

  // 处理菜单项点击
  const handleItemClick = useCallback((item: MenuItem, key: string) => {
    if (!isSelectedKeyControlled) {
      setInternalSelectedKey(key);
    }
    onChange?.(item, key);

    // 水平模式下，如果点击的是根菜单项且没有子菜单，关闭当前打开的菜单层
    if (mode === 'horizontal' && (!item.children || item.children.length === 0) && currentOpenKeys.length > 0) {
      if (isOpenKeysControlled) {
        onOpenChange?.([]);
      } else {
        setInternalOpenKeys([]);
        onOpenChange?.([]);
      }
    }
  }, [onChange, isSelectedKeyControlled, mode, currentOpenKeys.length, isOpenKeysControlled, onOpenChange]);

  // 处理展开/折叠
  const handleToggleOpen = useCallback((key: string) => {
    if (isOpenKeysControlled) {
      // 受控模式，通过回调通知父组件
      const newKeys = openKeySet.has(key)
        ? currentOpenKeys.filter(k => k !== key)
        : [...currentOpenKeys, key];
      onOpenChange?.(newKeys);
    } else {
      // 非受控模式，更新内部状态
      setInternalOpenKeys(prev => {
        const newKeys = prev.includes(key)
          ? prev.filter(k => k !== key)
          : [...prev, key];
        onOpenChange?.(newKeys);
        return newKeys;
      });
    }
  }, [openKeySet, currentOpenKeys, isOpenKeysControlled, onOpenChange]);

  // 当模式为 horizontal 时，确保没有 collapsed 状态
  const effectiveCollapsed = mode === 'horizontal' ? false : collapsed;

  // 水平模式下，点击外部区域关闭子菜单
  useClickOutside(menuRef, useCallback(() => {
    if (mode === 'horizontal' && currentOpenKeys.length > 0) {
      if (isOpenKeysControlled) {
        onOpenChange?.([]);
      } else {
        setInternalOpenKeys([]);
        onOpenChange?.([]);
      }
    }
  }, [mode, currentOpenKeys.length, isOpenKeysControlled, onOpenChange]));

  // 如果菜单不显示，返回 null
  if (!currentOpen) {
    return null;
  }

  // 菜单根元素类名
  const menuClass = classNames(
    'idp-menu',
    `idp-menu-${theme}`,
    {
      [`idp-menu-${mode}`]: true,
      [`idp-menu-${mode}-collapsed`]: effectiveCollapsed,
      'idp-menu-dark-vertical-flat': theme === 'dark' && mode === 'vertical-flat'
    },
    className
  );

  return (
    <div
      ref={menuRef}
      className={menuClass}
      style={style}
      role="menu"
    >
      {items.map(item => (
        <MenuItemComponent
          key={item.key}
          item={item}
          level={0}
          mode={mode}
          collapsed={effectiveCollapsed}
          theme={theme}
          openKeySet={openKeySet}
          selectedKey={currentSelectedKey}
          onItemClick={handleItemClick}
          onToggleOpen={handleToggleOpen}
        />
      ))}
    </div>
  );
};

export default Menu;
