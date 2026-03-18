'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import Empty from '../Empty';
import type { TreeSelectProps, TreeSelectNode, TreeSelectStyles } from './types';
import {
    getWrapperClassName,
    getWrapperStyle,
    getSelectionClassName,
    getSelectionStyle,
    getRenderedClassName,
    getRenderedStyle,
    getSelectionItemClassName,
    getSelectionItemStyle,
    getTagClassName,
    getTagStyle,
    getTagContentClassName,
    getTagContentStyle,
    getTagCloseClassName,
    getTagCloseStyle,
    getSearchWrapperClassName,
    getSearchWrapperStyle,
    getSearchInputClassName,
    getSearchInputStyle,
    getClearIconClassName,
    getClearIconStyle,
    getArrowIconClassName,
    getArrowIconStyle,
    getDropdownClassName,
    getDropdownStyle,
    getDropdownSearchWrapperClassName,
    getDropdownSearchWrapperStyle,
    getDropdownSearchInputClassName,
    getDropdownSearchInputStyle,
    getDropdownContentClassName,
    getDropdownContentStyle,
    getEmptyWrapperClassName,
    getEmptyWrapperStyle,
    getTreeNodeWrapperClassName,
    getTreeNodeWrapperStyle,
    getTreeNodeClassName,
    getTreeNodeStyle,
    getExpandIconClassName,
    getExpandIconStyle,
    getCheckboxClassName,
    getCheckboxStyle,
    getCheckboxInnerClassName,
    getCheckboxInnerStyle,
    getNodeTitleClassName,
    getNodeTitleStyle,
    getTreeNodeChildrenClassName,
    getTreeNodeChildrenStyle,
} from './styles';
import './TreeSelect.css';

/**
 * TreeSelect 树型选择器组件
 * 用于在树形结构中选择数据，支持单选和多选
 *
 * @example
 * ```tsx
 * <TreeSelect
 *   treeData={treeData}
 *   placeholder="请选择"
 *   onChange={(value) => console.log(value)}
 * />
 * <TreeSelect
 *   treeData={treeData}
 *   multiple
 *   maxTagCount={2}
 *   onChange={(value) => console.log(value)}
 * />
 * ```
 */
const TreeSelect: React.FC<TreeSelectProps> = ({
    treeData = [],
    value,
    defaultValue,
    onChange,
    placeholder = '请选择',
    disabled = false,
    multiple = false,
    maxTagCount,
    allowClear = true,
    size = 'middle',
    styles,
    className,
    dropdownWidth,
    dropdownHeight = 300,
    showSearch = false,
    filterOption,
    autoClearSearchValue = true,
    fieldNames = {},
    width,
    style
}) => {
    const [open, setOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [internalValue, setInternalValue] = useState<any[]>(() => {
        if (multiple) {
            return defaultValue ? (Array.isArray(defaultValue) ? defaultValue : [defaultValue]) : [];
        }
        return defaultValue ? (Array.isArray(defaultValue) ? defaultValue : [defaultValue]) : [];
    });
    const [searchValue, setSearchValue] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [expandedKeys, setExpandedKeys] = useState<Set<any>>(new Set());
    
    const { title: titleKey = 'title', value: valueKey = 'value', children: childrenKey = 'children' } = fieldNames;
    
    // 获取节点的值
    const getNodeValue = useCallback((node: TreeSelectNode) => {
        return node[valueKey as keyof TreeSelectNode] || node.value;
    }, [valueKey]);
    
    // 获取节点的标题
    const getNodeTitle = useCallback((node: TreeSelectNode) => {
        return (node[titleKey as keyof TreeSelectNode] || node.title) as React.ReactNode;
    }, [titleKey]);
    
    // 获取节点的子节点
    const getNodeChildren = useCallback((node: TreeSelectNode): TreeSelectNode[] | undefined => {
        return node[childrenKey as keyof TreeSelectNode] as TreeSelectNode[] | undefined;
    }, [childrenKey]);
    
    // 当前选中的值（受控或非受控）
    const currentValue = useMemo(() => {
        if (value !== undefined) {
            if (multiple) {
                return Array.isArray(value) ? value : [value];
            }
            return value !== null && value !== '' ? [value] : [];
        }
        return internalValue;
    }, [value, internalValue, multiple]);
    
    // 根据值查找节点
    const findNodeByValue = useCallback((targetValue: any, nodes: TreeSelectNode[] = treeData): TreeSelectNode | null => {
        for (const node of nodes) {
            if (getNodeValue(node) === targetValue) {
                return node;
            }
            const children = getNodeChildren(node);
            if (children && children.length > 0) {
                const found = findNodeByValue(targetValue, children);
                if (found) return found;
            }
        }
        return null;
    }, [treeData, getNodeValue, getNodeChildren]);
    
    // 获取所有选中的节点
    const selectedNodes = useMemo(() => {
        return currentValue.map(v => findNodeByValue(v)).filter(Boolean) as TreeSelectNode[];
    }, [currentValue, findNodeByValue]);
    
    // 控制下拉面板动画
    const showDropdown = open || isAnimating;
    
    // 点击外部关闭
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
                setSearchValue('');
            }
        };
        
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);
    
    // 处理下拉面板动画
    useEffect(() => {
        if (open) {
            setIsAnimating(true);
        } else {
            const timer = setTimeout(() => setIsAnimating(false), 200);
            return () => clearTimeout(timer);
        }
    }, [open]);
    
    // 打开时聚焦搜索框
    useEffect(() => {
        if (open && showSearch && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    }, [open, showSearch]);
    
    // 获取节点下的所有叶子节点值
    const getAllLeafValues = useCallback((node: TreeSelectNode): any[] => {
        const values: any[] = [];
        const traverse = (n: TreeSelectNode) => {
            const children = getNodeChildren(n);
            if (!children || children.length === 0) {
                // 叶子节点
                values.push(getNodeValue(n));
            } else {
                // 父节点，继续遍历子节点
                children.forEach(traverse);
            }
        };
        traverse(node);
        return values;
    }, [getNodeValue, getNodeChildren]);
    
    // 处理节点选择
    const handleSelect = useCallback((node: TreeSelectNode) => {
        const nodeValue = getNodeValue(node);
        const children = getNodeChildren(node);
        const hasChildren = children && children.length > 0;
        
        if (multiple) {
            // 判断当前节点或其子节点是否已被选中
            const leafValues = hasChildren ? getAllLeafValues(node) : [nodeValue];
            const isAnySelected = leafValues.some(v => currentValue.includes(v));
            let newValue: any[];
            
            if (isAnySelected) {
                // 取消选中：移除所有相关叶子节点
                newValue = currentValue.filter(v => !leafValues.includes(v));
            } else {
                // 选中：添加所有叶子节点（去重）
                newValue = Array.from(new Set([...currentValue, ...leafValues]));
            }
            
            const newSelectedNodes = newValue.map(v => findNodeByValue(v)).filter(Boolean) as TreeSelectNode[];
            
            if (value === undefined) {
                setInternalValue(newValue);
            }
            onChange?.(newValue, newSelectedNodes);
        } else {
            // 单选模式：只有叶子节点才可以被选中
            if (hasChildren) {
                // 父节点只展开/折叠，不选中
                return;
            }
            
            if (value === undefined) {
                setInternalValue([nodeValue]);
            }
            onChange?.(nodeValue, [node]);
            setOpen(false);
        }
        
        if (autoClearSearchValue) {
            setSearchValue('');
        }
    }, [currentValue, multiple, getNodeValue, getNodeChildren, getAllLeafValues, findNodeByValue, value, onChange, autoClearSearchValue]);
    
    // 处理清除
    const handleClear = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (value === undefined) {
            setInternalValue([]);
        }
        onChange?.(multiple ? [] : undefined, []);
    }, [value, onChange, multiple]);
    
    // 处理删除标签（多选）
    const handleRemoveTag = useCallback((e: React.MouseEvent, tagValue: any) => {
        e.stopPropagation();
        const newValue = currentValue.filter(v => v !== tagValue);
        const newSelectedNodes = newValue.map(v => findNodeByValue(v)).filter(Boolean) as TreeSelectNode[];
        
        if (value === undefined) {
            setInternalValue(newValue);
        }
        onChange?.(newValue, newSelectedNodes);
    }, [currentValue, findNodeByValue, value, onChange]);
    
    // 切换展开状态
    const toggleExpand = useCallback((e: React.MouseEvent, node: TreeSelectNode) => {
        e.stopPropagation();
        const nodeValue = getNodeValue(node);
        const newExpanded = new Set(expandedKeys);
        
        if (newExpanded.has(nodeValue)) {
            newExpanded.delete(nodeValue);
        } else {
            newExpanded.add(nodeValue);
        }
        
        setExpandedKeys(newExpanded);
    }, [expandedKeys, getNodeValue]);
    
    // 检查节点是否匹配搜索
    const isNodeMatchSearch = useCallback((node: TreeSelectNode): boolean => {
        if (!searchValue) return true;
        const title = String(getNodeTitle(node));
        
        if (filterOption) {
            return filterOption(searchValue, node);
        }
        
        return title.toLowerCase().includes(searchValue.toLowerCase());
    }, [searchValue, getNodeTitle, filterOption]);
    
    // 检查是否有子节点匹配搜索
    const hasChildMatchSearch = useCallback((node: TreeSelectNode): boolean => {
        const children = getNodeChildren(node);
        if (!children || children.length === 0) return false;
        
        return children.some(child => {
            return isNodeMatchSearch(child) || hasChildMatchSearch(child);
        });
    }, [getNodeChildren, isNodeMatchSearch]);
    
    // 检查节点是否被级联选中（所有子节点都被选中）
    const isNodeCascadeSelected = useCallback((node: TreeSelectNode): boolean => {
        const leafValues = getAllLeafValues(node);
        if (leafValues.length === 0) return false;
        return leafValues.every(v => currentValue.includes(v));
    }, [getAllLeafValues, currentValue]);
    
    // 渲染树节点
    const renderTreeNode = useCallback((node: TreeSelectNode, level: number = 0): React.ReactNode => {
        const nodeValue = getNodeValue(node);
        const title = getNodeTitle(node);
        const children = getNodeChildren(node);
        const hasChildren = children && children.length > 0;
        // 选中状态判断：
        // - 多选模式：父节点判断是否级联选中，叶子节点直接判断
        // - 单选模式：只有叶子节点可以被选中
        const isSelected = multiple
            ? (hasChildren ? isNodeCascadeSelected(node) : currentValue.includes(nodeValue))
            : (!hasChildren && currentValue.includes(nodeValue));
        const isExpanded = expandedKeys.has(nodeValue);
        const isDisabled = !!node.disabled;
        
        // 搜索过滤
        const matchSearch = isNodeMatchSearch(node);
        const childMatchSearch = hasChildMatchSearch(node);
        const shouldShow = matchSearch || childMatchSearch;
        
        if (!shouldShow) return null;
        
        return (
            <div
                key={String(nodeValue)}
                className={getTreeNodeWrapperClassName({})}
                style={getTreeNodeWrapperStyle({})}
            >
                <div
                    className={getTreeNodeClassName({ selected: isSelected, disabled: isDisabled })}
                    style={getTreeNodeStyle({ level, customStyles: styles?.treeNode })}
                    onClick={() => !isDisabled && handleSelect(node)}
                >
                    {/* 展开/折叠图标 */}
                    <span
                        className={getExpandIconClassName({ expanded: isExpanded, hasChildren: !!hasChildren })}
                        style={getExpandIconStyle({})}
                        onClick={(e) => hasChildren && toggleExpand(e, node)}
                    >
                        {hasChildren && (
                                <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                                </svg>
                            )}
                    </span>
                    
                    {/* 多选复选框 */}
                    {multiple && (
                        <span
                            className={getCheckboxClassName({})}
                            style={getCheckboxStyle({})}
                        >
                            <span
                                className={getCheckboxInnerClassName({ checked: isSelected })}
                                style={getCheckboxInnerStyle({})}
                            >
                                {isSelected && (
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                    </svg>
                                )}
                            </span>
                        </span>
                    )}
                    
                    {/* 节点标题 */}
                    <span
                        className={getNodeTitleClassName({})}
                        style={getNodeTitleStyle({})}
                    >
                        {title}
                    </span>
                </div>
                
                {/* 子节点 */}
                {hasChildren && isExpanded && (
                    <div
                        className={getTreeNodeChildrenClassName({})}
                        style={getTreeNodeChildrenStyle({})}
                    >
                        {children!.map(child => renderTreeNode(child, level + 1))}
                    </div>
                )}
            </div>
        );
    }, [currentValue, expandedKeys, getNodeValue, getNodeTitle, getNodeChildren, multiple, isNodeMatchSearch, hasChildMatchSearch, isNodeCascadeSelected, handleSelect, toggleExpand, styles?.treeNode]);
    
    // 获取叶子节点（没有子节点的节点）
    const getLeafNodes = useCallback((nodes: TreeSelectNode[]): TreeSelectNode[] => {
        const result: TreeSelectNode[] = [];
        const traverse = (node: TreeSelectNode) => {
            const children = getNodeChildren(node);
            if (!children || children.length === 0) {
                // 叶子节点
                if (currentValue.includes(getNodeValue(node))) {
                    result.push(node);
                }
            } else {
                // 父节点，继续遍历子节点
                children.forEach(traverse);
            }
        };
        nodes.forEach(traverse);
        return result;
    }, [currentValue, getNodeValue, getNodeChildren]);
    
    // 渲染选中的标签
    const renderTags = useCallback(() => {
        if (!multiple) {
            const node = selectedNodes[0];
            if (!node) return placeholder;
            return (
                <span
                    className={getSelectionItemClassName({})}
                    style={getSelectionItemStyle({})}
                >
                    {getNodeTitle(node)}
                </span>
            );
        }
        
        // 多选模式下，只显示叶子节点的标签
        const leafNodes = getLeafNodes(treeData);
        
        if (leafNodes.length === 0) {
            return placeholder;
        }
        
        let displayNodes = leafNodes;
        let hiddenCount = 0;
        
        if (maxTagCount !== undefined && maxTagCount > 0 && leafNodes.length > maxTagCount) {
            displayNodes = leafNodes.slice(0, maxTagCount);
            hiddenCount = leafNodes.length - maxTagCount;
        }
        
        return (
            <>
                {displayNodes.map((node) => (
                    <span
                        key={getNodeValue(node)}
                        className={getTagClassName({ size })}
                        style={getTagStyle({ customStyles: styles?.tag })}
                    >
                        <span
                            className={getTagContentClassName({})}
                            style={getTagContentStyle({})}
                        >
                            {getNodeTitle(node)}
                        </span>
                        <span
                            className={getTagCloseClassName({})}
                            style={getTagCloseStyle({})}
                            onClick={(e) => handleRemoveTag(e, getNodeValue(node))}
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </span>
                    </span>
                ))}
                {hiddenCount > 0 && (
                    <span
                        className={getTagClassName({ isMore: true, size })}
                        style={getTagStyle({ customStyles: styles?.tag })}
                    >
                        +{hiddenCount}
                    </span>
                )}
            </>
        );
    }, [multiple, selectedNodes, treeData, maxTagCount, getNodeValue, getNodeTitle, handleRemoveTag, getLeafNodes, placeholder, size, styles?.tag]);
    
    // 计算是否有值可清除
    const hasValue = selectedNodes.length > 0;
    
    // 显示清除按钮的条件：可清除、非禁用、有值、鼠标悬停
    const showClear = allowClear && !disabled && hasValue && isHovered;
    
    // 显示下拉箭头的条件：不满足清除按钮显示条件时
    const showArrowIcon = !showClear;
    
    return (
        <div
            ref={containerRef}
            className={getWrapperClassName({ className })}
            style={getWrapperStyle({ width, style, customStyles: styles?.wrapper })}
        >
            {/* 选择框 */}
            <div
                className={getSelectionClassName({ open, disabled, size })}
                style={getSelectionStyle({ customStyles: styles?.selection })}
                onClick={() => {
                    if (!disabled) {
                        setOpen(!open);
                        if (!open) {
                            setSearchValue('');
                        }
                    }
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {showSearch && open ? (
                    <div
                        className={getSearchWrapperClassName({})}
                        style={getSearchWrapperStyle({})}
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            className={getSearchInputClassName({})}
                            style={getSearchInputStyle({})}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder={selectedNodes.length === 0 ? placeholder : ''}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                ) : (
                    <div
                        className={getRenderedClassName({ isPlaceholder: selectedNodes.length === 0 })}
                        style={getRenderedStyle({})}
                    >
                        {renderTags()}
                    </div>
                )}
                
                {/* 后缀区域（清除按钮和下拉箭头） */}
                <span className={classNames('zjpcy-treeselect-suffix', {
                    'zjpcy-treeselect-large': size === 'large',
                    'zjpcy-treeselect-small': size === 'small'
                })}>
                    {showClear && (
                        <span
                            className={getClearIconClassName({})}
                            style={getClearIconStyle({})}
                            onClick={handleClear}
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </span>
                    )}
                    {showArrowIcon && (
                        <span
                            className={getArrowIconClassName({ open })}
                            style={getArrowIconStyle({})}
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M7 10l5 5 5-5z"/>
                            </svg>
                        </span>
                    )}
                </span>
            </div>
            
            {/* 下拉面板 */}
            {showDropdown && (
                <div
                    className={classNames(getDropdownClassName({}), {
                        'zjpcy-treeselect-dropdown-open': open,
                        'zjpcy-treeselect-dropdown-closing': !open && isAnimating
                    })}
                    style={getDropdownStyle({ width: dropdownWidth, height: dropdownHeight, customStyles: styles?.dropdown })}
                >
                    {/* 搜索框（非内嵌模式） */}
                    {showSearch && !open && (
                        <div
                            className={getDropdownSearchWrapperClassName({})}
                            style={getDropdownSearchWrapperStyle({})}
                        >
                            <input
                                ref={inputRef}
                                type="text"
                                className={getDropdownSearchInputClassName({})}
                                style={getDropdownSearchInputStyle({})}
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder="搜索"
                            />
                        </div>
                    )}
                    
                    {/* 树形列表 */}
                    <div
                        className={getDropdownContentClassName({})}
                        style={getDropdownContentStyle({})}
                    >
                        {treeData.length > 0 ? (
                            treeData.map(node => renderTreeNode(node))
                        ) : (
                            <div
                                className={getEmptyWrapperClassName({})}
                                style={getEmptyWrapperStyle({})}
                            >
                                <Empty size="small" description="暂无数据" />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TreeSelect;

export type { TreeSelectProps, TreeSelectNode, TreeSelectStyles };
