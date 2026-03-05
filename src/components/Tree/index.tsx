import * as React from 'react';
import { useState, useCallback, useMemo, useRef, useEffect, memo, forwardRef, useImperativeHandle } from 'react';
import classNames from 'classnames';
import { TreeProps, TreeNode, TreeNodeTooltip } from './types';
import Tooltip from '../Tooltip';
import './Tree.css';

export type { TreeProps, TreeNode, TreeNodeTooltip } from './types';

// Tree ref interface
export interface TreeRef {
  scrollTo: (key: string | number) => void;
  addNode: (parentKey: string | number | null, newNode: TreeNode | TreeNode[]) => void;
  removeNode: (key: string | number) => boolean;
  updateNode: (key: string | number, updates: Partial<Omit<TreeNode, 'key' | 'children'>>) => boolean;
}

// ===== Icon Components =====

const LoadingIcon: React.FC<{ className?: string }> = ({ className }) => (
  <span className={className}>
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z" />
    </svg>
  </span>
);

const CaretRightIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M8 5l8 7-8 7V5z" />
  </svg>
);

const FolderIcon: React.FC<{ expanded?: boolean }> = ({ expanded }) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    {expanded ? (
      <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" />
    ) : (
      <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
    )}
  </svg>
);

const FileIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

const EmptyIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor" opacity="0.3">
    <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" />
  </svg>
);

// ===== Type Definitions =====

interface TreeNodeComponentProps {
  node: TreeNode;
  level: number;
  expanded: boolean;
  selected: boolean;
  checked: boolean;
  halfChecked: boolean;
  loading: boolean;
  isLeaf: boolean;
  showIcon: boolean;
  showLine: boolean;
  showIndent?: boolean;
  checkable: boolean;
  draggable: boolean;
  checkStrictly: boolean;
  expandedKeys: (string | number)[];
  selectedKeys: (string | number)[];
  checkedKeys: (string | number)[];
  motionDuration: number;
  prefixCls: string;
  renderNode?: (node: TreeNode) => React.ReactNode;
  // Dynamic node operations
  addable?: boolean;
  removable?: boolean;
  editable?: boolean;
  actionDisplayMode?: 'inline' | 'dropdown';
  onAddNode?: (parentNode: TreeNode) => void;
  onRemoveNode?: (node: TreeNode) => void;
  onEditNode?: (node: TreeNode) => void;
  editingNodeKey?: string | number | null;
  editValue?: string;
  onEditChange?: (value: string) => void;
  onEditConfirm?: () => void;
  onEditCancel?: () => void;
  onExpand: (key: string | number, e: React.MouseEvent) => void;
  onSelect: (key: string | number, e: React.MouseEvent) => void;
  onCheck: (key: string | number, e: React.MouseEvent | React.KeyboardEvent) => void;
  onNodeMount?: (key: string | number, el: HTMLDivElement | null) => void;
  // Drag and drop
  onDrop?: (dragKey: string | number, dropKey: string | number, position: 'before' | 'after' | 'inside') => void;
  dragEndCounter?: number;
  // Tooltip
  tooltip?: TreeNodeTooltip | boolean;
}

// ===== Utility Functions =====

// Check if all children of a node are checked
const getAllChildrenChecked = (
  node: TreeNode,
  checkedKeys: (string | number)[]
): boolean => {
  if (!node.children || node.children.length === 0) {
    return checkedKeys.includes(node.key);
  }
  return node.children.every((child) => getAllChildrenChecked(child, checkedKeys));
};

// Check if some (but not all) children are checked
const getSomeChildrenChecked = (
  node: TreeNode,
  checkedKeys: (string | number)[]
): boolean => {
  if (!node.children || node.children.length === 0) {
    return checkedKeys.includes(node.key);
  }
  const childStates = node.children.map((child) => ({
    key: child.key,
    allChecked: getAllChildrenChecked(child, checkedKeys),
    someChecked: getSomeChildrenChecked(child, checkedKeys),
  }));

  const hasChecked = childStates.some((s) => s.allChecked || s.someChecked);
  const allChecked = childStates.every((s) => s.allChecked);

  return hasChecked && !allChecked;
};

const findNode = (nodes: TreeNode[], key: string | number): TreeNode | null => {
  for (const node of nodes) {
    if (node.key === key) return node;
    if (node.children) {
      const found = findNode(node.children, key);
      if (found) return found;
    }
  }
  return null;
};

const getAllChildKeys = (nodes: TreeNode[]): (string | number)[] => {
  return nodes.reduce((keys: (string | number)[], node) => {
    keys.push(node.key);
    if (node.children) {
      keys.push(...getAllChildKeys(node.children));
    }
    return keys;
  }, []);
};

// Find parent node of a given key
const findParentNode = (nodes: TreeNode[], key: string | number): TreeNode | null => {
  for (const node of nodes) {
    if (node.children) {
      if (node.children.some((child) => child.key === key)) {
        return node;
      }
      const found = findParentNode(node.children, key);
      if (found) return found;
    }
  }
  return null;
};

// Add nodes to a parent node (mutates the treeData array)
const addNodesToTree = (
  nodes: TreeNode[],
  parentKey: string | number | null,
  newNodes: TreeNode[]
): boolean => {
  if (parentKey === null) {
    // Add to root level
    nodes.push(...newNodes);
    return true;
  }

  for (const node of nodes) {
    if (node.key === parentKey) {
      if (!node.children) {
        node.children = [];
      }
      node.children.push(...newNodes);
      return true;
    }
    if (node.children) {
      const added = addNodesToTree(node.children, parentKey, newNodes);
      if (added) return true;
    }
  }
  return false;
};

// Remove a node from the tree (mutates the treeData array)
const removeNodeFromTree = (nodes: TreeNode[], key: string | number): boolean => {
  const index = nodes.findIndex((node) => node.key === key);
  if (index !== -1) {
    nodes.splice(index, 1);
    return true;
  }
  for (const node of nodes) {
    if (node.children) {
      const removed = removeNodeFromTree(node.children, key);
      if (removed) return true;
    }
  }
  return false;
};

// Update a node in the tree (mutates the treeData array)
const updateNodeInTree = (
  nodes: TreeNode[],
  key: string | number,
  updates: Partial<Omit<TreeNode, 'key' | 'children'>>
): boolean => {
  for (const node of nodes) {
    if (node.key === key) {
      Object.assign(node, updates);
      return true;
    }
    if (node.children) {
      const updated = updateNodeInTree(node.children, key, updates);
      if (updated) return true;
    }
  }
  return false;
};

const filterTreeData = (
  nodes: TreeNode[],
  searchValue: string,
  filterOption: (search: string, node: TreeNode) => boolean
): TreeNode[] => {
  return nodes.reduce((result: TreeNode[], node) => {
    const isMatch = filterOption(searchValue, node);
    const filteredChildren = node.children
      ? filterTreeData(node.children, searchValue, filterOption)
      : [];

    if (isMatch || filteredChildren.length > 0) {
      result.push({
        ...node,
        children: filteredChildren.length > 0 ? filteredChildren : undefined,
      });
    }

    return result;
  }, []);
};

// ===== TreeNode Component =====

const TreeNodeComponent: React.FC<TreeNodeComponentProps> = memo(({
  node,
  level,
  expanded,
  selected,
  checked,
  halfChecked,
  loading,
  isLeaf,
  showIcon,
  showLine,
  checkable,
  draggable,
  checkStrictly,
  expandedKeys,
  selectedKeys,
  checkedKeys,
  motionDuration,
  prefixCls,
  renderNode,
  // Dynamic node operations
  addable,
  removable,
  editable,
  actionDisplayMode,
  onAddNode,
  onRemoveNode,
  onEditNode,
  editingNodeKey,
  editValue,
  onEditChange,
  onEditConfirm,
  onEditCancel,
  onExpand,
  onSelect,
  onCheck,
  onNodeMount,
  // Drag and drop
  onDrop,
  dragEndCounter,
  // Tooltip
  tooltip: globalTooltip,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [dropPosition, setDropPosition] = useState<'before' | 'after' | 'inside' | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const innerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Reset drag state when drag operation ends globally
  useEffect(() => {
    if (dragEndCounter !== undefined && dragEndCounter > 0) {
      setDragOver(false);
      setDropPosition(null);
    }
  }, [dragEndCounter]);
  
  // 合并 ref
  const setRef = useCallback((el: HTMLDivElement | null) => {
    innerRef.current = el;
    if (onNodeMount) {
      onNodeMount(node.key, el);
    }
  }, [onNodeMount, node.key]);

  const hasChildren = Boolean(node.children && node.children.length > 0);
  // 修复：当 node.children 存在时（即使是空数组），该节点可以拥有子节点，应视为文件夹
  const canHaveChildren = node.children !== undefined;
  const isExpanded = expandedKeys.includes(node.key);
  const isDisabled = node.disabled;
  const isDraggable = draggable && !isDisabled;
  // 修复：使用 node.isLeaf 属性（如果设置了），否则根据 node.children 判断（保留文件夹属性）
  const isLeafNode = node.isLeaf !== undefined ? node.isLeaf : !canHaveChildren;

  const handleExpand = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLeafNode && !loading) {
      onExpand(node.key, e);
    }
  }, [isLeafNode, loading, node.key, onExpand]);

  const handleCheck = useCallback((e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (!isDisabled && !node.disableCheckbox) {
      onCheck(node.key, e);
    }
  }, [isDisabled, node.disableCheckbox, node.key, onCheck]);

  const handleSelect = useCallback((e: React.MouseEvent) => {
    if (isDisabled) return;
    // When checkable is enabled, clicking on label area should only toggle check, not select
    // So we skip the select behavior when checkable is true
    if (checkable) {
      // Only trigger check when clicking on content area, not select
      handleCheck(e);
      return;
    }
    onSelect(node.key, e);
  }, [isDisabled, checkable, node.key, onSelect, handleCheck]);

  const handleDragStart = useCallback((e: React.DragEvent) => {
    if (isDraggable) {
      e.stopPropagation(); // Prevent parent nodes from overriding drag data
      e.dataTransfer.setData('text/plain', String(node.key));
      e.dataTransfer.effectAllowed = 'move';
      
      // Create custom drag image showing only the current node (not children)
      const dragImage = document.createElement('div');
      dragImage.style.cssText = `
        position: absolute;
        top: -1000px;
        left: -1000px;
        padding: 4px 8px;
        background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
        color: white;
        border-radius: 4px;
        font-size: 14px;
        font-family: inherit;
        white-space: nowrap;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        pointer-events: none;
      `;
      
      // Get the title text
      const titleText = typeof node.title === 'string' ? node.title : String(node.title);
      dragImage.textContent = titleText;
      document.body.appendChild(dragImage);
      
      // Set custom drag image with offset
      e.dataTransfer.setDragImage(dragImage, 10, 10);
      
      // Remove the element after drag starts
      setTimeout(() => {
        document.body.removeChild(dragImage);
      }, 0);
    }
  }, [isDraggable, node.key, node.title]);

  const handleDragEnd = useCallback(() => {
    // Reset drag state when drag operation ends
    setDragOver(false);
    setDropPosition(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (!isDraggable) return;

    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    // Check if the event target is inside a child TreeNode component
    // If so, don't process it here - let the child handle it
    const target = e.target as HTMLElement;
    const currentNode = innerRef.current;
    if (currentNode && target && currentNode.contains(target)) {
      // Check if target is inside the child tree container of this node
      const childTree = currentNode.querySelector(`.${prefixCls}-child-tree`);
      if (childTree && childTree.contains(target)) {
        // Event is from within the child tree area, not the current node itself
        // Let the child node handle it
        return;
      }
      // Otherwise, the event is on the current node (title/switcher area)
      // and should be processed by this node
    }

    const rect = innerRef.current?.getBoundingClientRect();
    if (rect) {
      const y = e.clientY - rect.top;
      const height = rect.height;

      // For leaf nodes, don't allow 'inside' placement
      // Treat middle area as 'after' instead
      if (isLeafNode) {
        if (y < height / 2) {
          setDropPosition('before');
        } else {
          setDropPosition('after');
        }
      } else {
        if (y < height / 3) {
          setDropPosition('before');
        } else if (y > height * 2 / 3) {
          setDropPosition('after');
        } else {
          setDropPosition('inside');
        }
      }
      setDragOver(true);
    }
  }, [isDraggable, isLeafNode, prefixCls]);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
    setDropPosition(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Reset drag state immediately
    setDragOver(false);
    setDropPosition(null);
    
    const dragKey = e.dataTransfer.getData('text/plain');
    if (!dragKey || dragKey === String(node.key)) {
      return;
    }

    if (onDrop && dropPosition) {
      onDrop(dragKey, node.key, dropPosition);
    }
  }, [node.key, dropPosition, onDrop]);

  // Render Switcher
  const renderSwitcher = () => {
    if (loading) {
      return (
        <span className={`${prefixCls}-switcher`}>
          <LoadingIcon className={`${prefixCls}-loading-icon`} />
        </span>
      );
    }

    if (isLeafNode) {
      return (
        <span
          className={`${prefixCls}-switcher ${prefixCls}-switcher-spaced`}
          style={{ visibility: 'hidden' }}
        />
      );
    }

    const switcherClasses = [
      `${prefixCls}-switcher`,
      isExpanded ? `${prefixCls}-switcher-open` : `${prefixCls}-switcher-close`,
    ].join(' ');

    return (
      <span className={switcherClasses} onClick={handleExpand}>
        <CaretRightIcon />
      </span>
    );
  };

  // Render Checkbox
  const renderCheckbox = () => {
    if (!checkable) return null;

    const checkboxClasses = classNames(
      `${prefixCls}-checkbox`,
      {
        [`${prefixCls}-checkbox-checked`]: checked && !halfChecked,
        [`${prefixCls}-checkbox-indeterminate`]: halfChecked,
        [`${prefixCls}-checkbox-disabled`]: isDisabled || node.disableCheckbox,
        [`${prefixCls}-checkbox-disabled-checked`]: (isDisabled || node.disableCheckbox) && checked && !halfChecked,
        [`${prefixCls}-checkbox-disabled-indeterminate`]: (isDisabled || node.disableCheckbox) && halfChecked,
      }
    );

    return <span className={checkboxClasses} onClick={handleCheck} />;
  };

  // Render Icon
  const renderIcon = () => {
    if (!showIcon || renderNode) return null;

    if (node.icon) {
      return <span className={`${prefixCls}-icon`}>{node.icon}</span>;
    }

    return (
      <span className={`${prefixCls}-icon`}>
        {isLeaf ? <FileIcon /> : <FolderIcon expanded={isExpanded} />}
      </span>
    );
  };

  // Check if this node is being edited
  const isEditing = editingNodeKey === node.key;

  // Render Title
  const renderTitle = () => {
    const titleClassName = `${prefixCls}-title`;

    // 获取 Tooltip 配置（合并节点配置和全局配置）
    const getTooltipConfig = (): TreeNodeTooltip | null => {
      // 节点级别的配置优先
      if (node.tooltip !== undefined) {
        if (typeof node.tooltip === 'boolean') {
          return node.tooltip ? { title: node.title } : null;
        }
        return { ...node.tooltip, title: node.tooltip.title || node.title };
      }
      // 使用全局配置
      if (globalTooltip !== undefined) {
        if (typeof globalTooltip === 'boolean') {
          return globalTooltip ? { title: node.title } : null;
        }
        return { ...globalTooltip, title: globalTooltip.title || node.title };
      }
      return null;
    };

    const tooltipConfig = getTooltipConfig();

    const renderTitleContent = () => {
      if (renderNode) {
        return <span className={titleClassName}>{renderNode(node)}</span>;
      }
      if (isEditing) {
        return (
          <span className={titleClassName}>
            <input
              type="text"
              value={editValue || ''}
              onChange={(e) => onEditChange?.(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onEditConfirm?.();
                } else if (e.key === 'Escape') {
                  onEditCancel?.();
                }
              }}
              onBlur={() => onEditConfirm?.()}
              autoFocus
              className={`${prefixCls}-title-input`}
              style={{
                border: '1px solid #1890ff',
                borderRadius: '2px',
                padding: '0 4px',
                fontSize: 'inherit',
                fontFamily: 'inherit',
                outline: 'none',
                width: 'auto',
                minWidth: '60px',
              }}
            />
          </span>
        );
      }
      return <span className={titleClassName}>{node.title}</span>;
    };

    const titleContent = renderTitleContent();

    // 如果配置了 tooltip，用 Tooltip 包裹
    if (tooltipConfig && !isEditing) {
      return (
        <Tooltip
          title={tooltipConfig.title || node.title}
          placement={tooltipConfig.placement || 'top'}
          trigger={tooltipConfig.trigger || 'hover'}
          delay={tooltipConfig.delay ?? 100}
          backgroundColor={tooltipConfig.backgroundColor}
          style={tooltipConfig.style}
          className={tooltipConfig.className}
        >
          {titleContent as React.ReactElement}
        </Tooltip>
      );
    }

    return titleContent;
  };

  // Render action buttons
  const renderActions = () => {
    if (!addable && !removable && !editable) return null;
    if (isEditing) return null;

    const isDropdownMode = actionDisplayMode === 'dropdown';

    const handleAdd = (e?: React.MouseEvent) => {
      e?.stopPropagation();
      onAddNode?.(node);
      if (isDropdownMode) setDropdownVisible(false);
    };

    const handleRemove = (e?: React.MouseEvent) => {
      e?.stopPropagation();
      onRemoveNode?.(node);
      if (isDropdownMode) setDropdownVisible(false);
    };

    const handleEdit = (e?: React.MouseEvent) => {
      e?.stopPropagation();
      onEditNode?.(node);
      if (isDropdownMode) setDropdownVisible(false);
    };

    // Dropdown menu mode
    if (isDropdownMode) {
      return (
        <span
          className={`${prefixCls}-actions ${prefixCls}-actions-dropdown`}
          ref={dropdownRef}
          onMouseEnter={() => setDropdownVisible(true)}
          onMouseLeave={() => setDropdownVisible(false)}
        >
          <button
            className={`${prefixCls}-action-trigger`}
            title="操作"
            onClick={(e) => e.stopPropagation()}
          >
            ⋮
          </button>
          {dropdownVisible && (
            <div className={`${prefixCls}-action-menu`}>
              {addable && (
                <div
                  className={classNames(`${prefixCls}-action-menu-item`, `${prefixCls}-action-menu-add`)}
                  onClick={handleAdd}
                >
                  <span className={`${prefixCls}-action-menu-icon`}>+</span>
                  <span>添加子节点</span>
                </div>
              )}
              {editable && (
                <div
                  className={classNames(`${prefixCls}-action-menu-item`, `${prefixCls}-action-menu-edit`)}
                  onClick={handleEdit}
                >
                  <span className={`${prefixCls}-action-menu-icon`}>✎</span>
                  <span>编辑</span>
                </div>
              )}
              {removable && (
                <div
                  className={classNames(`${prefixCls}-action-menu-item`, `${prefixCls}-action-menu-remove`)}
                  onClick={handleRemove}
                >
                  <span className={`${prefixCls}-action-menu-icon`}>×</span>
                  <span>删除</span>
                </div>
              )}
            </div>
          )}
        </span>
      );
    }

    // Inline mode (default)
    const buttonStyle: React.CSSProperties = {
      padding: '0 4px',
      marginLeft: '4px',
      fontSize: '12px',
      cursor: 'pointer',
      background: 'transparent',
      border: 'none',
      color: '#1890ff',
      transition: 'opacity 0.2s',
    };

    return (
      <span
        className={`${prefixCls}-actions`}
        style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}
      >
        {addable && (
          <button
            onClick={handleAdd}
            style={buttonStyle}
            title="添加子节点"
            className={`${prefixCls}-action-btn ${prefixCls}-action-add`}
          >
            +
          </button>
        )}
        {editable && (
          <button
            onClick={handleEdit}
            style={buttonStyle}
            title="编辑"
            className={`${prefixCls}-action-btn ${prefixCls}-action-edit`}
          >
            ✎
          </button>
        )}
        {removable && (
          <button
            onClick={handleRemove}
            style={{ ...buttonStyle, color: '#ff4d4f' }}
            title="删除"
            className={`${prefixCls}-action-btn ${prefixCls}-action-remove`}
          >
            ×
          </button>
        )}
      </span>
    );
  };

  // Class Names
  const nodeClasses = [
    `${prefixCls}-treenode`,
    `${prefixCls}-treenode-ellipsis`,
    selected && `${prefixCls}-node-selected`,
    isDisabled && `${prefixCls}-treenode-disabled`,
    isDraggable && `${prefixCls}-treenode-draggable`,
    dragOver && `${prefixCls}-treenode-drag-over`,
    dragOver && dropPosition && `${prefixCls}-treenode-drop-target`,
    isLeafNode && `${prefixCls}-treenode-leaf`,
    showLine && `${prefixCls}-line`,
  ].filter(Boolean).join(' ');

  const contentClasses = [
    `${prefixCls}-node-content-wrapper`,
    selected && `${prefixCls}-node-selected`,
  ].filter(Boolean).join(' ');

  // Render indent elements
  const renderIndent = () => {
    if (level === 0) return null;
    const indents = [];
    for (let i = 0; i < level; i++) {
      indents.push(
        <span key={i} className={`${prefixCls}-indent`} />
      );
    }
    return indents;
  };

  return (
    <div
      ref={setRef}
      className={nodeClasses}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-drop-position={dropPosition}
    >
      {renderIndent()}
      {showLine && level > 0 && <span className={`${prefixCls}-line-point`} />}

      {renderSwitcher()}
      {renderCheckbox()}
      {renderIcon()}

      <span className={contentClasses} onClick={handleSelect}>
        {renderTitle()}
      </span>

      {renderActions()}

      {/* 修复：当节点可以拥有子节点（不是叶子节点）时，渲染子树容器 */}
      {!isLeafNode && (
        <div
          className={[
            `${prefixCls}-child-tree`,
            isExpanded && `${prefixCls}-child-tree-expand`,
          ].filter(Boolean).join(' ')}
        >
          <div>
            {hasChildren ? (
              node.children!.map((child, index) => (
                <TreeNodeComponent
                  key={`${child.key}-${index}`}
                  node={child}
                  level={level + 1}
                  expanded={expanded}
                  selected={selectedKeys.includes(child.key)}
                  checked={checkedKeys.includes(child.key)}
                  halfChecked={getSomeChildrenChecked(child, checkedKeys)}
                  loading={child.loading || false}
                  isLeaf={!child.children || child.children.length === 0}
                  showIcon={showIcon}
                  showLine={showLine}
                  checkable={checkable}
                  draggable={draggable}
                  checkStrictly={checkStrictly}
                  expandedKeys={expandedKeys}
                  selectedKeys={selectedKeys}
                  checkedKeys={checkedKeys}
                  motionDuration={motionDuration}
                  prefixCls={prefixCls}
                  renderNode={renderNode}
                  // Dynamic node operations
                  addable={addable}
                  removable={removable}
                  editable={editable}
                  actionDisplayMode={actionDisplayMode}
                  onAddNode={onAddNode}
                  onRemoveNode={onRemoveNode}
                  onEditNode={onEditNode}
                  editingNodeKey={editingNodeKey}
                  editValue={editValue}
                  onEditChange={onEditChange}
                  onEditConfirm={onEditConfirm}
                  onEditCancel={onEditCancel}
                  onExpand={onExpand}
                  onSelect={onSelect}
                  onCheck={onCheck}
                  onNodeMount={onNodeMount}
                  // Drag and drop
                  onDrop={onDrop}
                  dragEndCounter={dragEndCounter}
                  // Tooltip
                  tooltip={globalTooltip}
                />
              ))
            ) : (
              /* 空文件夹时渲染一个可拖拽区域（固定高度避免抖动） */
              <div
                className={`${prefixCls}-empty-drop-zone`}
                style={{
                  minHeight: '4px',
                  width: '100%',
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
});

TreeNodeComponent.displayName = 'TreeNodeComponent';

// ===== Main Tree Component =====

export const Tree = forwardRef<TreeRef, TreeProps>(({
  treeData: externalTreeData = [],
  defaultExpandedKeys = [],
  expandedKeys: controlledExpandedKeys,
  onExpand,
  defaultSelectedKeys = [],
  selectedKeys: controlledSelectedKeys,
  onSelect,
  defaultCheckedKeys = [],
  checkedKeys: controlledCheckedKeys,
  onCheck,
  checkable = false,
  checkStrictly = false,
  multiple = false,
  showSearch = false,
  filterOption,
  showLine = false,
  showIndent = false,
  showIcon = true,
  loadData,
  motionDuration = 200,
  draggable = false,
  renderNode,
  // Dynamic node operations
  addable = false,
  removable = false,
  editable = false,
  actionDisplayMode = 'inline',
  onAddNode: onAddNodeProp,
  onRemoveNode: onRemoveNodeProp,
  onEditNode: onEditNodeProp,
  prefixCls = 'zjpcy-tree',
  className = '',
  style = {},
  disabled = false,
  defaultExpandAll = false,
  // Tooltip
  tooltip: globalTooltip,
  // Drag and drop
  onDrop: onDropProp,
}, ref) => {
  // State
  const [treeData, setTreeData] = useState<TreeNode[]>(externalTreeData);
  
  // Sync with external treeData when it changes
  const externalTreeDataRef = useRef<TreeNode[]>(externalTreeData);
  
  useEffect(() => {
    // Only update if external data actually changed (by reference or content)
    if (externalTreeDataRef.current !== externalTreeData) {
      externalTreeDataRef.current = externalTreeData;
      setTreeData(externalTreeData);
    }
  }, [externalTreeData]);

  const [expandedKeys, setExpandedKeys] = useState<(string | number)[]>(() => {
    if (defaultExpandAll) {
      const getAllKeys = (nodes: TreeNode[]): (string | number)[] => {
        return nodes.reduce((keys: (string | number)[], node) => {
          if (node.children && node.children.length > 0) {
            keys.push(node.key, ...getAllKeys(node.children));
          }
          return keys;
        }, []);
      };
      return getAllKeys(externalTreeData);
    }
    return defaultExpandedKeys;
  });

  const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>(defaultSelectedKeys);
  const [checkedKeys, setCheckedKeys] = useState<(string | number)[]>(defaultCheckedKeys);
  const [loadingKeys, setLoadingKeys] = useState<(string | number)[]>([]);
  const [searchValue, setSearchValue] = useState('');
  // Edit state
  const [editingNodeKey, setEditingNodeKey] = useState<string | number | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  // Drag state - used to force all nodes to reset drag styles
  const [dragEndCounter, setDragEndCounter] = useState(0);
  const nodeRefs = useRef<Map<string | number, HTMLDivElement | null>>(new Map());
  const treeContainerRef = useRef<HTMLDivElement>(null);

  // Dynamic node operation handlers
  const handleAddNode = useCallback((parentNode: TreeNode) => {
    if (onAddNodeProp) {
      const newNode = onAddNodeProp(parentNode);
      if (newNode) {
        const nodesToAdd = Array.isArray(newNode) ? newNode : [newNode];
        setTreeData((prevData) => {
          const newData = [...prevData];
          addNodesToTree(newData, parentNode.key, nodesToAdd);
          // Auto expand parent when adding child
          if (!expandedKeys.includes(parentNode.key)) {
            setExpandedKeys((prev) => [...prev, parentNode.key]);
          }
          return newData;
        });
      }
    }
  }, [onAddNodeProp, expandedKeys]);

  const handleRemoveNode = useCallback((node: TreeNode) => {
    if (onRemoveNodeProp) {
      const canRemove = onRemoveNodeProp(node);
      if (canRemove) {
        setTreeData((prevData) => {
          const newData = [...prevData];
          removeNodeFromTree(newData, node.key);
          // Clean up related states
          setExpandedKeys((prev) => prev.filter((k) => k !== node.key));
          setSelectedKeys((prev) => prev.filter((k) => k !== node.key));
          setCheckedKeys((prev) => prev.filter((k) => k !== node.key));
          nodeRefs.current.delete(node.key);
          return newData;
        });
      }
    } else {
      // Default remove behavior without callback
      setTreeData((prevData) => {
        const newData = [...prevData];
        removeNodeFromTree(newData, node.key);
        setExpandedKeys((prev) => prev.filter((k) => k !== node.key));
        setSelectedKeys((prev) => prev.filter((k) => k !== node.key));
        setCheckedKeys((prev) => prev.filter((k) => k !== node.key));
        nodeRefs.current.delete(node.key);
        return newData;
      });
    }
  }, [onRemoveNodeProp]);

  const handleEditNode = useCallback((node: TreeNode) => {
    setEditingNodeKey(node.key);
    setEditValue(String(node.title || ''));
  }, []);

  const handleEditChange = useCallback((value: string) => {
    setEditValue(value);
  }, []);

  const handleEditConfirm = useCallback(() => {
    if (editingNodeKey !== null) {
      if (onEditNodeProp) {
        const node = findNode(treeData, editingNodeKey);
        if (node) {
          const newTitle = onEditNodeProp(node, editValue);
          const finalTitle = newTitle !== undefined ? newTitle : editValue;
          setTreeData((prevData) => {
            const newData = [...prevData];
            updateNodeInTree(newData, editingNodeKey, { title: finalTitle });
            return newData;
          });
        }
      } else {
        // Default edit behavior without callback
        setTreeData((prevData) => {
          const newData = [...prevData];
          updateNodeInTree(newData, editingNodeKey, { title: editValue });
          return newData;
        });
      }
      setEditingNodeKey(null);
      setEditValue('');
    }
  }, [editingNodeKey, editValue, onEditNodeProp, treeData]);

  const handleEditCancel = useCallback(() => {
    setEditingNodeKey(null);
    setEditValue('');
  }, []);

  // Expose ref methods
  useImperativeHandle(ref, () => ({
    scrollTo: (key: string | number) => {
      const nodeEl = nodeRefs.current.get(key);
      if (nodeEl && treeContainerRef.current) {
        nodeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    },
    addNode: (parentKey: string | number | null, newNode: TreeNode | TreeNode[]) => {
      setTreeData((prevData) => {
        const newData = [...prevData];
        const nodesToAdd = Array.isArray(newNode) ? newNode : [newNode];
        addNodesToTree(newData, parentKey, nodesToAdd);
        return newData;
      });
    },
    removeNode: (key: string | number): boolean => {
      let removed = false;
      setTreeData((prevData) => {
        const newData = [...prevData];
        removed = removeNodeFromTree(newData, key);
        if (removed) {
          // Clean up related states
          setExpandedKeys((prev) => prev.filter((k) => k !== key));
          setSelectedKeys((prev) => prev.filter((k) => k !== key));
          setCheckedKeys((prev) => prev.filter((k) => k !== key));
          nodeRefs.current.delete(key);
        }
        return newData;
      });
      return removed;
    },
    updateNode: (key: string | number, updates: Partial<Omit<TreeNode, 'key' | 'children'>>): boolean => {
      let updated = false;
      setTreeData((prevData) => {
        const newData = [...prevData];
        updated = updateNodeInTree(newData, key, updates);
        return newData;
      });
      return updated;
    },
  }));

  // Handle node mount/unmount
  const handleNodeMount = useCallback((key: string | number, el: HTMLDivElement | null) => {
    if (el) {
      nodeRefs.current.set(key, el);
    } else {
      nodeRefs.current.delete(key);
    }
  }, []);

  // Controlled Mode
  const isExpandedControlled = controlledExpandedKeys !== undefined;
  const isSelectedControlled = controlledSelectedKeys !== undefined;
  const isCheckedControlled = controlledCheckedKeys !== undefined;

  const currentExpandedKeys = isExpandedControlled ? controlledExpandedKeys : expandedKeys;
  const currentSelectedKeys = isSelectedControlled ? controlledSelectedKeys : selectedKeys;
  const currentCheckedKeys = isCheckedControlled ? controlledCheckedKeys : checkedKeys;

  // Handlers
  const handleExpand = useCallback(
    (key: string | number, e: React.MouseEvent) => {
      if (disabled) return;

      const isExpanded = currentExpandedKeys.includes(key);
      const newExpandedKeys = isExpanded
        ? currentExpandedKeys.filter((k) => k !== key)
        : [...currentExpandedKeys, key];

      // Load data if needed
      if (!isExpanded && loadData) {
        const node = findNode(treeData, key);
        if (node && (!node.children || node.children.length === 0)) {
          setLoadingKeys((prev) => [...prev, key]);
          loadData(node).finally(() => {
            setLoadingKeys((prev) => prev.filter((k) => k !== key));
          });
        }
      }

      if (!isExpandedControlled) {
        setExpandedKeys(newExpandedKeys);
      }

      onExpand?.(newExpandedKeys, {
        expanded: !isExpanded,
        node: findNode(treeData, key)!,
        nativeEvent: e as unknown as MouseEvent,
      });
    },
    [disabled, currentExpandedKeys, isExpandedControlled, onExpand, treeData, loadData]
  );

  const handleSelect = useCallback(
    (key: string | number, e: React.MouseEvent) => {
      if (disabled) return;

      const isSelected = currentSelectedKeys.includes(key);
      let newSelectedKeys: (string | number)[];

      if (multiple) {
        newSelectedKeys = isSelected
          ? currentSelectedKeys.filter((k) => k !== key)
          : [...currentSelectedKeys, key];
      } else {
        newSelectedKeys = isSelected ? [] : [key];
      }

      if (!isSelectedControlled) {
        setSelectedKeys(newSelectedKeys);
      }

      onSelect?.(newSelectedKeys, {
        selected: !isSelected,
        node: findNode(treeData, key)!,
        nativeEvent: e as unknown as MouseEvent,
      });
    },
    [disabled, currentSelectedKeys, isSelectedControlled, multiple, onSelect, treeData]
  );

  const handleCheck = useCallback(
    (key: string | number, e: React.MouseEvent | React.KeyboardEvent) => {
      if (disabled) return;

      const isChecked = currentCheckedKeys.includes(key);
      let newCheckedKeys: (string | number)[];

      if (isChecked) {
        // Uncheck: remove this node and all its children
        newCheckedKeys = currentCheckedKeys.filter((k) => k !== key);

        if (!checkStrictly) {
          const node = findNode(treeData, key);
          if (node?.children) {
            const childKeys = getAllChildKeys(node.children);
            newCheckedKeys = newCheckedKeys.filter((k) => !childKeys.includes(k));
          }
        }
      } else {
        // Check: add this node and all its children
        newCheckedKeys = [...currentCheckedKeys, key];

        if (!checkStrictly) {
          const node = findNode(treeData, key);
          if (node?.children) {
            const childKeys = getAllChildKeys(node.children);
            // Use ES5-compatible array deduplication instead of Set
            newCheckedKeys = newCheckedKeys.concat(
              childKeys.filter(key => newCheckedKeys.indexOf(key) === -1)
            );
          }
        }
      }

      if (!isCheckedControlled) {
        setCheckedKeys(newCheckedKeys);
      }

      onCheck?.(newCheckedKeys, {
        checked: !isChecked,
        node: findNode(treeData, key)!,
        nativeEvent: e as unknown as MouseEvent,
      });
    },
    [disabled, currentCheckedKeys, isCheckedControlled, checkStrictly, onCheck, treeData]
  );

  // Simple drag and drop handler
  const handleDrop = useCallback(
    (dragKey: string | number, dropKey: string | number, position: 'before' | 'after' | 'inside') => {
      if (dragKey === dropKey) return;

      // Find the drag node and its parent
      const dragNode = findNode(treeData, dragKey);
      const dropNode = findNode(treeData, dropKey);
      
      if (!dragNode || !dropNode) return;

      // Prevent dropping parent into its own child
      const isDescendant = (parent: TreeNode, childKey: string | number): boolean => {
        if (parent.children) {
          for (const child of parent.children) {
            if (child.key === childKey) return true;
            if (isDescendant(child, childKey)) return true;
          }
        }
        return false;
      };

      if (isDescendant(dragNode, dropKey)) return;

      // Check if dropNode is a leaf node (cannot accept children)
      const isDropNodeLeaf = dropNode.isLeaf !== undefined 
        ? dropNode.isLeaf 
        : dropNode.children === undefined;

      // Deep clone a node to avoid mutating original data
      const cloneNode = (node: TreeNode): TreeNode => ({
        ...node,
        children: node.children ? node.children.map(cloneNode) : undefined,
      });

      // Update tree data
      setTreeData((prevData) => {
        // Deep clone the tree to avoid mutating original data
        const newData = prevData.map(cloneNode);
        
        // Remove drag node from its current position
        removeNodeFromTree(newData, dragKey);
        
        // Clone drag node for insertion (to avoid reference issues)
        const clonedDragNode = cloneNode(dragNode);
        
        // If dropNode is a leaf and position is 'inside', treat it as 'after' placement
        const effectivePosition = (position === 'inside' && isDropNodeLeaf) ? 'after' : position;
        
        // Add drag node to new position
        if (effectivePosition === 'inside') {
          // Add as child (only for folder nodes)
          addNodesToTree(newData, dropKey, [clonedDragNode]);
          // Auto expand the drop node
          if (!expandedKeys.includes(dropKey)) {
            setExpandedKeys((prev) => [...prev, dropKey]);
          }
        } else {
          // Add before or after
          const dropParent = findParentNode(newData, dropKey);
          const targetArray = dropParent ? (dropParent.children || []) : newData;
          const dropIndex = targetArray.findIndex((n) => n.key === dropKey);
          
          if (dropIndex !== -1) {
            const insertIndex = effectivePosition === 'before' ? dropIndex : dropIndex + 1;
            targetArray.splice(insertIndex, 0, clonedDragNode);
          }
        }
        
        return newData;
      });

      // Call user callback
      onDropProp?.({
        event: {} as MouseEvent,
        node: dropNode,
        dragNode: dragNode,
        dragPosition: position,
      });

      // Force all nodes to reset drag styles
      setDragEndCounter((prev) => prev + 1);
    },
    [treeData, expandedKeys, onDropProp]
  );

  // Filtered Data
  const filteredTreeData = useMemo(() => {
    if (!showSearch || !searchValue || !filterOption) {
      return treeData;
    }
    return filterTreeData(treeData, searchValue, filterOption);
  }, [treeData, showSearch, searchValue, filterOption]);

  // Render Search
  const renderSearch = () => {
    if (!showSearch) return null;

    return (
      <div className={`${prefixCls}-search-wrapper`}>
        <input
          type="text"
          className={`${prefixCls}-search-input`}
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
    );
  };

  // Render Empty
  const renderEmpty = () => {
    if (filteredTreeData.length > 0) return null;

    return (
      <div className={`${prefixCls}-empty`}>
        <div className={`${prefixCls}-empty-icon`}>
          <EmptyIcon />
        </div>
        <div>No Data</div>
      </div>
    );
  };

  // Class Names
  const treeClasses = [
    prefixCls,
    showLine && `${prefixCls}-show-line`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div ref={treeContainerRef} className={treeClasses} style={style}>
      {renderSearch()}
      <div className={`${prefixCls}-node-list`}>
        {filteredTreeData.map((node) => (
            <TreeNodeComponent
              key={String(node.key)}
              node={node}
              level={0}
              expanded={currentExpandedKeys.includes(node.key)}
              selected={currentSelectedKeys.includes(node.key)}
              checked={currentCheckedKeys.includes(node.key)}
              halfChecked={getSomeChildrenChecked(node, currentCheckedKeys)}
              loading={loadingKeys.includes(node.key)}
              // 修复：判断是否为叶子节点时，考虑 children 属性存在性
              isLeaf={node.isLeaf !== undefined ? node.isLeaf : node.children === undefined}
              showIcon={showIcon}
              showLine={showLine}
              showIndent={showIndent}
              checkable={checkable}
              draggable={draggable}
              checkStrictly={checkStrictly}
              expandedKeys={currentExpandedKeys}
              selectedKeys={currentSelectedKeys}
              checkedKeys={currentCheckedKeys}
              motionDuration={motionDuration}
              prefixCls={prefixCls}
              renderNode={renderNode}
              // Dynamic node operations
              addable={addable}
              removable={removable}
              editable={editable}
              actionDisplayMode={actionDisplayMode}
              onAddNode={handleAddNode}
              onRemoveNode={handleRemoveNode}
              onEditNode={handleEditNode}
              editingNodeKey={editingNodeKey}
              editValue={editValue}
              onEditChange={handleEditChange}
              onEditConfirm={handleEditConfirm}
              onEditCancel={handleEditCancel}
              onExpand={handleExpand}
              onSelect={handleSelect}
              onCheck={handleCheck}
              onNodeMount={handleNodeMount}
              // Drag and drop
              onDrop={handleDrop}
              dragEndCounter={dragEndCounter}
              // Tooltip
              tooltip={globalTooltip}
            />
          ))}
        {renderEmpty()}
      </div>
    </div>
  );
});

Tree.displayName = 'Tree';

export default Tree;
