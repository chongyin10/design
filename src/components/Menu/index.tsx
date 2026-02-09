import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { MenuProps, MenuItem, MenuItemComponentProps } from './types';
import { useClickOutside } from '../Hooks/useClickOutside';
import './index.css';

/**
 * 渲染缩略标签（折叠状态下显示）
 */
const renderCollapsedLabel = (label: string, icon?: React.ReactNode): React.ReactNode => {
  if (icon) {
    return icon;
  }
  return label.charAt(0).toUpperCase();
};

/**
 * 菜单项组件 - 递归渲染菜单项及其子菜单
 */
const MenuItemComponent: React.FC<MenuItemComponentProps> = React.memo(({
  item,
  level,
  mode,
  collapsed,
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
  const isRoot = level === 0;

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (item.disabled) return;
    
    // 如果有子菜单，切换展开状态（先执行，避免与 onItemClick 的关闭逻辑冲突）
    if (hasChildren) {
      onToggleOpen(item.key);
    }
    
    // 触发点击回调
    onItemClick(item, item.key);
  }, [item, onItemClick, onToggleOpen, hasChildren]);

  // 水平模式下根级项目的内边距不同
  const getPaddingLeft = () => {
    if (isHorizontal && isRoot) return 16;
    if (isInline) return 12 + level * 24;
    if (collapsed) return 0;
    return 12 + level * 16;
  };

  const paddingLeft = getPaddingLeft();
  const shouldOpen = isOpen && (!collapsed || isHorizontal);

  // 判断是否显示箭头
  const showArrow = hasChildren && (!collapsed || !isRoot);

  // 根据当前模式决定子菜单如何展开
  const getSubMenuClass = () => {
    if (!shouldOpen) return '';
    if (isHorizontal && isRoot) return 'open horizontal-popup';
    if (isInline) return 'open inline';
    return 'open';
  };

  return (
    <div className={`idp-menu-item-wrapper ${isRoot ? 'root' : ''}`}>
      <div
        className={`
          idp-menu-item
          ${isSelected ? 'selected' : ''}
          ${item.disabled ? 'disabled' : ''}
          ${hasChildren ? 'has-children' : ''}
          ${isRoot ? 'root' : ''}
          ${collapsed && isRoot ? 'collapsed' : ''}
          ${mode}
        `}
        style={{ paddingLeft }}
        title={collapsed && isRoot ? item.label : undefined}
        onClick={handleClick}
      >
        <div className="idp-menu-item-content">
          {item.icon && (
            <span className={`idp-menu-item-icon ${collapsed && isRoot ? 'collapsed' : ''}`}>
              {item.icon}
            </span>
          )}
          {(!collapsed || !isRoot) && (
            <>
              <span className="idp-menu-item-label">{item.label}</span>
            </>
          )}
          {collapsed && isRoot && !item.icon && (
            <span className="idp-menu-item-collapsed-label">
              {renderCollapsedLabel(item.label)}
            </span>
          )}
          {showArrow && (
            <span className={`idp-menu-item-arrow ${shouldOpen ? 'open' : ''} ${mode}`}>
              <svg viewBox="0 0 1024 1024" width="10" height="10" fill="currentColor">
                <path d="M840.4 300H183.6c-19.7 0-30.7 25.7-18.5 40.5l328.4 402.4c9.4 11.6 26.7 11.6 36.1 0l328.4-402.4c12.2-14.8 1.2-40.5-18.5-40.5z" />
              </svg>
            </span>
          )}
        </div>
      </div>

      {/* 子菜单 */}
      {/* 水平弹出式子菜单仅在展开时渲染，垂直/内联模式始终渲染以支持动画 */}
      {(hasChildren && (isHorizontal ? shouldOpen : true)) && (
        <div className={`idp-menu-submenu ${getSubMenuClass()} ${mode} level-${level}`}>
          <div className="idp-menu-submenu-content">
            {item.children?.map((child: MenuItem) => (
              <MenuItemComponent
                key={child.key}
                item={child}
                level={level + 1}
                mode={mode}
                collapsed={collapsed}
                openKeySet={openKeySet}
                selectedKey={selectedKey}
                onItemClick={onItemClick}
                onToggleOpen={onToggleOpen}
              />
            ))}
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
  onChange,
  onOpenChange
}) => {
  // 菜单根元素 ref，用于点击外部检测
  const menuRef = useRef<HTMLDivElement>(null);
  // 内部状态
  const [internalOpenKeys, setInternalOpenKeys] = useState<string[]>(defaultOpenKeys);
  const [internalSelectedKey, setInternalSelectedKey] = useState<string>('');

  // 判断是否为受控模式
  const isOpenKeysControlled = externalOpenKeys !== undefined;
  const isSelectedKeyControlled = externalSelectedKey !== undefined;

  // 当前展开的keys
  const currentOpenKeys = isOpenKeysControlled ? externalOpenKeys : internalOpenKeys;
  const currentSelectedKey = isSelectedKeyControlled ? externalSelectedKey : internalSelectedKey;

  // 构建 openKeySet 用于快速查找
  const openKeySet = useMemo(() => new Set(currentOpenKeys), [currentOpenKeys]);

  // 同步外部 selectedKey
  useEffect(() => {
    if (externalSelectedKey !== undefined) {
      setInternalSelectedKey(externalSelectedKey);
    }
  }, [externalSelectedKey]);

  // 当 selectedKey 变化时，自动展开其父级菜单
  // 注意：水平模式下不自动展开，因为水平模式的子菜单是弹出式的
  useEffect(() => {
    if (currentSelectedKey && !isOpenKeysControlled && mode !== 'horizontal') {
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

  return (
    <div
      ref={menuRef}
      className={`idp-menu idp-menu-${mode} ${effectiveCollapsed ? 'collapsed' : ''} ${className}`}
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