import React, { useState, useEffect, useCallback, useMemo, useRef, startTransition } from 'react';
import Button from '../Button';
import Input from '../Input';
import { NavigationProps, NavigationItem } from './types';
import './Navigation.css';

// 导航项组件
interface NavigationItemComponentProps {
    item: NavigationItem;
    level: number;
    collapsed: boolean;
    mode: 'vertical' | 'horizontal';
    openKeySet: Set<string>;
    selectedKey: string;
    onItemClick: (item: NavigationItem, key: string) => void;
    onToggleOpen: (key: string, isRoot?: boolean) => void;
}

const NavigationItemComponent: React.FC<NavigationItemComponentProps> = React.memo(({
    item,
    level,
    collapsed,
    mode,
    openKeySet,
    selectedKey,
    onItemClick,
    onToggleOpen
}) => {
    const hasChildren = !!item.childrens && item.childrens.length > 0;
    const isOpen = openKeySet.has(item.key);
    const isSelected = selectedKey === item.key;

    const isHorizontal = mode === 'horizontal';
    const isRoot = level === 0;

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        // 总是触发onItemClick来选中菜单项
        onItemClick(item, item.key);
        // 如果有子菜单且不在折叠状态，则切换展开状态
        if (hasChildren && (!collapsed || isHorizontal)) {
            onToggleOpen(item.key, isRoot);
        }
    }, [item, onItemClick, onToggleOpen, hasChildren, collapsed, isHorizontal, isRoot]);

    const paddingLeft = isHorizontal && isRoot ? 12 : (collapsed ? 12 : 12 + level * 16);

    const shouldOpen = isOpen && (!collapsed || isHorizontal);

    return (
        <div className="navigation-item-wrapper">
            <div
                className={`navigation-item ${isSelected ? 'selected' : ''} ${item.disabled ? 'disabled' : ''}`}
                style={{ paddingLeft }}
                title={collapsed ? item.name : undefined}
                onClick={handleClick}
            >
                <div className="navigation-item-content">
                    {item.icon && (
                        <span className="navigation-item-icon">
                            {item.icon}
                        </span>
                    )}
                    {!collapsed && (
                        <>
                            <span className="navigation-item-name">{item.name}</span>
                            {item.description && (
                                <span className="navigation-item-description">{item.description}</span>
                            )}
                        </>
                    )}
                    {hasChildren && !collapsed && (!isHorizontal || !isRoot) && (
                        <span className={`navigation-item-arrow ${shouldOpen ? 'open' : ''}`}>
                            ▼
                        </span>
                    )}
                    {hasChildren && isHorizontal && isRoot && (
                        <span className={`navigation-item-arrow horizontal ${shouldOpen ? 'open' : ''}`}>
                            ▼
                        </span>
                    )}
                </div>
            </div>

            {/* 子菜单 */}
            {hasChildren && !collapsed && shouldOpen && (
                <div className={`navigation-children open${isHorizontal && isRoot ? ' horizontal' : ''}`}>
                    {item.childrens?.map(child => (
                            <NavigationItemComponent
                                key={child.key}
                                item={child}
                                level={level + 1}
                                collapsed={collapsed}
                                mode={mode}
                                openKeySet={openKeySet}
                                selectedKey={selectedKey}
                                onItemClick={onItemClick}
                                onToggleOpen={onToggleOpen}
                            />

                    ))}
                </div>
            )}
        </div>
    );
});

// 主导航组件
const Navigation: React.FC<NavigationProps> = ({
    items,
    selectedKey: externalSelectedKey,
    collapsed: externalCollapsed,
    defaultOpenKeys = [],
    mode = 'vertical',
    closeOnOutsideClick = true,
    header,
    footer,
    onChange,
    onCollapseChange,
    className = '',
    style,
    width = 280,
    collapsedWidth = 48,
    animationDuration = 300,
    showCollapseButton = true
}) => {

    const [internalOpenKeys, setInternalOpenKeys] = useState<string[]>(defaultOpenKeys);
    const [internalSelectedKey, setInternalSelectedKey] = useState<string>('');
    const [internalCollapsed, setInternalCollapsed] = useState<boolean>(externalCollapsed ?? false);
    const [searchValue, setSearchValue] = useState<string>('');
    const lastSelectedKeyRef = useRef<string>('');
    const containerRef = useRef<HTMLDivElement | null>(null);
    const isHorizontal = mode === 'horizontal';

    // 递归过滤菜单项
    const filterItems = useCallback((menuItems: NavigationItem[], keyword: string): NavigationItem[] => {
        if (!keyword.trim()) return menuItems;
        
        const lowerKeyword = keyword.toLowerCase();
        
        return menuItems.reduce<NavigationItem[]>((acc, item) => {
            const matchKey = item.key.toLowerCase().includes(lowerKeyword);
            const matchName = item.name.toLowerCase().includes(lowerKeyword);
            const matchDescription = item.description?.toLowerCase().includes(lowerKeyword);
            
            // 如果有子菜单，递归过滤
            let filteredChildren: NavigationItem[] | undefined;
            if (item.childrens && item.childrens.length > 0) {
                filteredChildren = filterItems(item.childrens, keyword);
            }
            
            // 当前项匹配或有匹配的子项
            if (matchKey || matchName || matchDescription || (filteredChildren && filteredChildren.length > 0)) {
                acc.push({
                    ...item,
                    childrens: filteredChildren
                });
            }
            
            return acc;
        }, []);
    }, []);

    // 过滤后的菜单项
    const filteredItems = useMemo(() => {
        return filterItems(items, searchValue);
    }, [items, searchValue, filterItems]);

    const { rootMap, pathMap } = useMemo(() => {
        const nextRootMap = new Map<string, string>();
        const nextPathMap = new Map<string, string[]>();

        const build = (menuItems: NavigationItem[], parentPath: string[] = []) => {
            menuItems.forEach(item => {
                const currentPath = [...parentPath, item.key];
                nextPathMap.set(item.key, currentPath);
                nextRootMap.set(item.key, currentPath[0]);
                if (item.childrens && item.childrens.length > 0) {
                    build(item.childrens, currentPath);
                }
            });
        };

        build(items);
        return { rootMap: nextRootMap, pathMap: nextPathMap };
    }, [items]);

    // 同步外部状态
    useEffect(() => {
        if (externalSelectedKey !== undefined) {
            lastSelectedKeyRef.current = externalSelectedKey;
            setInternalSelectedKey(externalSelectedKey);
        }
    }, [externalSelectedKey]);

    useEffect(() => {
        if (externalCollapsed !== undefined) {
            setInternalCollapsed(externalCollapsed);
        }
    }, [externalCollapsed]);

    // 查找选中key对应的根菜单key
    const findRootKey = useCallback((key: string): string => {
        return rootMap.get(key) || key;
    }, [rootMap]);

    const collapsed = useMemo(() => {
        if (isHorizontal) {
            return false;
        }
        return externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
    }, [externalCollapsed, internalCollapsed, isHorizontal]);

    const openKeySet = useMemo(() => new Set(internalOpenKeys), [internalOpenKeys]);

    const actualSelectedKey = useMemo(() => {
        const value = externalSelectedKey !== undefined ? externalSelectedKey : internalSelectedKey;
        return value || lastSelectedKeyRef.current;
    }, [externalSelectedKey, internalSelectedKey]);

    // 计算当前应该显示的选中key
    // 在折叠状态下，如果选中的是子菜单项，则高亮其根菜单项；否则高亮选中的菜单项本身
    const selectedKey = useMemo(() => {
        if (!actualSelectedKey) {
            return '';
        }
        return collapsed ? findRootKey(actualSelectedKey) : actualSelectedKey;
    }, [collapsed, findRootKey, actualSelectedKey]);

    const selectedOpenKeys = useMemo(() => {
        if (!actualSelectedKey) {
            return [];
        }
        const path = pathMap.get(actualSelectedKey);
        return path ? path.slice(0, -1) : [];
    }, [pathMap, actualSelectedKey]);

    // 当selectedKey变化时，自动展开包含选中项的父菜单
    useEffect(() => {
        if (!actualSelectedKey || collapsed || isHorizontal) {
            return;
        }
        setInternalOpenKeys(prev => {
            let changed = false;
            const merged = new Set(prev);
            selectedOpenKeys.forEach(key => {
                if (!merged.has(key)) {
                    merged.add(key);
                    changed = true;
                }
            });
            return changed ? Array.from(merged) : prev;
        });
    }, [actualSelectedKey, collapsed, selectedOpenKeys, isHorizontal]);

    const toggleOpenKey = useCallback((key: string, isRoot?: boolean) => {
        startTransition(() => {
            setInternalOpenKeys(prev => {
                if (isHorizontal && isRoot) {
                    return prev.includes(key) ? [] : [key];
                }
                return prev.includes(key)
                    ? prev.filter(k => k !== key)
                    : [...prev, key];
            });
        });
    }, [isHorizontal]);

    const toggleCollapsed = useCallback(() => {
        const newCollapsed = !collapsed;
        if (externalCollapsed === undefined) {
            setInternalCollapsed(newCollapsed);
        }
        onCollapseChange?.(newCollapsed);
    }, [collapsed, externalCollapsed, onCollapseChange]);

    const handleItemClick = useCallback((item: NavigationItem) => {
        if (item.disabled) return;
        lastSelectedKeyRef.current = item.key;
        const hasChildren = !!item.childrens && item.childrens.length > 0;
        if (isHorizontal && !hasChildren) {
            setInternalOpenKeys([]);
        }
        // 如果有外部selectedKey，通知外部变更但不更新内部状态
        if (externalSelectedKey !== undefined) {
            onChange?.(item, item.key);
            return;
        }
        startTransition(() => {
            setInternalSelectedKey(item.key);
        });
        onChange?.(item, item.key);
    }, [externalSelectedKey, onChange, isHorizontal, pathMap]);

    const currentWidth = useMemo(() => {
        if (isHorizontal) {
            return '100%';
        }
        return collapsed ? collapsedWidth : width;
    }, [collapsed, width, collapsedWidth, isHorizontal]);

    useEffect(() => {
        if (!isHorizontal || !closeOnOutsideClick) {
            return;
        }
        const handleOutsideClick = (event: MouseEvent) => {
            const target = event.target as Node | null;
            if (containerRef.current && target && !containerRef.current.contains(target)) {
                setInternalOpenKeys([]);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isHorizontal, closeOnOutsideClick]);

    return (
        <div
            ref={containerRef}
            className={`idp-navigation ${className} ${collapsed ? 'collapsed' : ''} ${isHorizontal ? 'horizontal' : ''}`}
            style={{
                width: currentWidth,
                transition: `width ${animationDuration}ms ease`,
                ...style
            }}
        >
            {/* 头部区域 */}
            {!isHorizontal && header !== null && header !== false && (
                <div className="navigation-header">
                    {header ?? (
                        <>
                            {!collapsed ? (
                                <>
                                    <div className="navigation-header-row">
                                        <h2 className="navigation-title">IDP Design</h2>
                                        {showCollapseButton && (
                                            <Button
                                                onClick={toggleCollapsed}
                                                className="navigation-collapse-button"
                                                variant="secondary"
                                            >
                                                ←
                                            </Button>
                                        )}
                                    </div>
                                    {/* 搜索框 */}
                                    <div className="navigation-search">
                                        <Input.Search
                                            placeholder="搜索组件..."
                                            value={searchValue}
                                            onChange={(e) => setSearchValue(e.target.value)}
                                            clear
                                        />
                                    </div>
                                </>
                            ) : (
                                showCollapseButton && (
                                    <Button
                                        onClick={toggleCollapsed}
                                        className="navigation-collapse-button"
                                        variant="secondary"
                                    >
                                        →
                                    </Button>
                                )
                            )}
                        </>
                    )}
                </div>
            )}

            {/* 菜单列表 */}
            <div className="navigation-list">
                {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                        <NavigationItemComponent
                            key={item.key}
                            item={item}
                            level={0}
                            collapsed={collapsed}
                            mode={mode}
                            openKeySet={openKeySet}
                            selectedKey={selectedKey}
                            onItemClick={handleItemClick}
                            onToggleOpen={toggleOpenKey}
                        />
                    ))
                ) : (
                    <div className="navigation-empty">
                        <span>未找到匹配的组件</span>
                    </div>
                )}
            </div>

            {/* 底部信息 */}
            {!collapsed && !isHorizontal && footer !== null && footer !== false && (
                <div className="navigation-footer">
                    {footer ?? (
                        <>
                            <p>IDP Design v1.0.0</p>
                            <p>IDP Studio</p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Navigation;