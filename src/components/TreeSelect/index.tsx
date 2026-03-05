import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import Icon from '../Icon';
import Empty from '../Empty';
import type { TreeSelectProps, TreeSelectNode, TreeSelectStyles } from './types';
import {
    Wrapper,
    Selection,
    Rendered,
    SelectionItem,
    Tag,
    TagContent,
    TagClose,
    SearchWrapper,
    SearchInput,
    ClearIcon,
    ArrowIcon,
    Dropdown,
    DropdownSearchWrapper,
    DropdownSearchInput,
    DropdownContent,
    EmptyWrapper,
    TreeNodeWrapper,
    TreeNode,
    ExpandIcon,
    Checkbox,
    CheckboxInner,
    NodeTitle,
    TreeNodeChildren,
} from './styles';

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
    width
}) => {
    const [open, setOpen] = useState(false);
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
            <TreeNodeWrapper key={String(nodeValue)} className="treeselect-tree-node-wrapper">
                <TreeNode
                    className={classNames('treeselect-tree-node', {
                        'treeselect-tree-node-selected': isSelected,
                        'treeselect-tree-node-disabled': isDisabled,
                        'treeselect-tree-node-leaf': !hasChildren
                    })}
                    $selected={isSelected}
                    $disabled={isDisabled}
                    $level={level}
                    $styles={styles?.treeNode}
                    onClick={() => !isDisabled && handleSelect(node)}
                >
                    {/* 展开/折叠图标 */}
                    <ExpandIcon
                        className={classNames('treeselect-tree-node__expand-icon', {
                            'treeselect-tree-node__expand-icon-expanded': isExpanded,
                            'treeselect-tree-node__expand-icon-no-children': !hasChildren
                        })}
                        $expanded={isExpanded}
                        $hasChildren={!!hasChildren}
                        onClick={(e) => hasChildren && toggleExpand(e, node)}
                    >
                        {hasChildren && (
                            <Icon type="arrowRight" size={12} color="#bfbfbf" />
                        )}
                    </ExpandIcon>
                    
                    {/* 多选复选框 */}
                    {multiple && (
                        <Checkbox className="treeselect-tree-node__checkbox">
                            <CheckboxInner
                                className={classNames('treeselect-tree-node__checkbox-inner', {
                                    'treeselect-tree-node__checkbox-inner-checked': isSelected
                                })}
                                $checked={isSelected}
                            >
                                {isSelected && <Icon type="check" size={10} color="#fff" />}
                            </CheckboxInner>
                        </Checkbox>
                    )}
                    
                    {/* 节点标题 */}
                    <NodeTitle className="treeselect-tree-node__title">{title}</NodeTitle>
                </TreeNode>
                
                {/* 子节点 */}
                {hasChildren && isExpanded && (
                    <TreeNodeChildren className="treeselect-tree-node-children">
                        {children!.map(child => renderTreeNode(child, level + 1))}
                    </TreeNodeChildren>
                )}
            </TreeNodeWrapper>
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
                <SelectionItem className="treeselect-selection__item">
                    {getNodeTitle(node)}
                </SelectionItem>
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
                    <Tag
                        key={getNodeValue(node)}
                        className={classNames('treeselect-selection__tag', {
                            'treeselect-selection__tag--more': false
                        })}
                        $size={size}
                        $styles={styles?.tag}
                    >
                        <TagContent className="treeselect-selection__tag-content">
                            {getNodeTitle(node)}
                        </TagContent>
                        <TagClose
                            className="treeselect-selection__tag-close"
                            onClick={(e) => handleRemoveTag(e, getNodeValue(node))}
                        >
                            <Icon type="close" size={10} />
                        </TagClose>
                    </Tag>
                ))}
                {hiddenCount > 0 && (
                    <Tag
                        className="treeselect-selection__tag treeselect-selection__tag--more"
                        $size={size}
                        $styles={styles?.tag}
                    >
                        +{hiddenCount}
                    </Tag>
                )}
            </>
        );
    }, [multiple, selectedNodes, treeData, maxTagCount, getNodeValue, getNodeTitle, handleRemoveTag, getLeafNodes, placeholder, size, styles?.tag]);
    
    const classes = classNames('treeselect-wrapper', className);
    
    return (
        <Wrapper
            ref={containerRef}
            className={classes}
            $width={width}
            $styles={styles?.wrapper}
        >
            {/* 选择框 */}
            <Selection
                className={classNames('treeselect-selection', {
                    'treeselect-selection-open': open,
                    'treeselect-selection-disabled': disabled
                })}
                $open={open}
                $disabled={disabled}
                $size={size}
                $styles={styles?.selection}
                onClick={() => {
                    if (!disabled) {
                        setOpen(!open);
                        if (!open) {
                            setSearchValue('');
                        }
                    }
                }}
            >
                {showSearch && open ? (
                    <SearchWrapper className="treeselect-selection__search">
                        <SearchInput
                            ref={inputRef}
                            type="text"
                            className="treeselect-selection__search-input"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder={selectedNodes.length === 0 ? placeholder : ''}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </SearchWrapper>
                ) : (
                    <Rendered
                        className={classNames('treeselect-selection__rendered', {
                            'treeselect-selection__rendered--placeholder': selectedNodes.length === 0
                        })}
                        $isPlaceholder={selectedNodes.length === 0}
                    >
                        {renderTags()}
                    </Rendered>
                )}
                
                {/* 清除按钮 */}
                {allowClear && !disabled && selectedNodes.length > 0 && (
                    <ClearIcon className="treeselect-selection__clear" $size={size} onClick={handleClear}>
                        <Icon type="close" size={12} />
                    </ClearIcon>
                )}
                
                {/* 下拉箭头 */}
                <ArrowIcon
                    className={classNames('treeselect-selection__arrow', {
                        'treeselect-selection__arrow-open': open
                    })}
                    $open={open}
                    $size={size}
                >
                    <Icon type="arrowDown" size={12} />
                </ArrowIcon>
            </Selection>
            
            {/* 下拉面板 */}
            {open && (
                <Dropdown
                    className="treeselect-dropdown"
                    $width={dropdownWidth}
                    $height={dropdownHeight}
                    $styles={styles?.dropdown}
                >
                    {/* 搜索框（非内嵌模式） */}
                    {showSearch && !open && (
                        <DropdownSearchWrapper className="treeselect-dropdown__search">
                            <DropdownSearchInput
                                ref={inputRef}
                                type="text"
                                className="treeselect-dropdown__search-input"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder="搜索"
                            />
                        </DropdownSearchWrapper>
                    )}
                    
                    {/* 树形列表 */}
                    <DropdownContent className="treeselect-dropdown__content">
                        {treeData.length > 0 ? (
                            treeData.map(node => renderTreeNode(node))
                        ) : (
                            <EmptyWrapper className="treeselect-dropdown__empty">
                                <Empty size="small" description="暂无数据" />
                            </EmptyWrapper>
                        )}
                    </DropdownContent>
                </Dropdown>
            )}
        </Wrapper>
    );
};

export default TreeSelect;

export type { TreeSelectProps, TreeSelectNode, TreeSelectStyles };
