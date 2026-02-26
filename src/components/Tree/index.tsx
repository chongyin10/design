import * as React from 'react';
import { useState, useCallback, useMemo, useRef, memo, forwardRef, useImperativeHandle } from 'react';
import { TreeProps, TreeNode } from './types';
import './Tree.css';

export type { TreeProps, TreeNode } from './types';

// Tree ref interface
export interface TreeRef {
  scrollTo: (key: string | number) => void;
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
  onExpand: (key: string | number, e: React.MouseEvent) => void;
  onSelect: (key: string | number, e: React.MouseEvent) => void;
  onCheck: (key: string | number, e: React.MouseEvent | React.KeyboardEvent) => void;
  onNodeMount?: (key: string | number, el: HTMLDivElement | null) => void;
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
  onExpand,
  onSelect,
  onCheck,
  onNodeMount,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [dropPosition, setDropPosition] = useState<'before' | 'after' | 'inside' | null>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  
  // 合并 ref
  const setRef = useCallback((el: HTMLDivElement | null) => {
    innerRef.current = el;
    if (onNodeMount) {
      onNodeMount(node.key, el);
    }
  }, [onNodeMount, node.key]);

  const hasChildren = Boolean(node.children && node.children.length > 0);
  const isExpanded = expandedKeys.includes(node.key);
  const isDisabled = node.disabled;
  const isDraggable = draggable && !isDisabled;
  // 使用 node.isLeaf 属性（如果设置了），否则根据 children 判断
  const isLeafNode = node.isLeaf !== undefined ? node.isLeaf : isLeaf;

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
      e.dataTransfer.setData('text/plain', String(node.key));
      e.dataTransfer.effectAllowed = 'move';
    }
  }, [isDraggable, node.key]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (!isDraggable) return;

    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const rect = innerRef.current?.getBoundingClientRect();
    if (rect) {
      const y = e.clientY - rect.top;
      const height = rect.height;

      if (y < height / 3) {
        setDropPosition('before');
      } else if (y > height * 2 / 3) {
        setDropPosition('after');
      } else {
        setDropPosition('inside');
      }
      setDragOver(true);
    }
  }, [isDraggable]);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
    setDropPosition(null);
  }, []);

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

    const checkboxClasses = [
      `${prefixCls}-checkbox`,
      checked && !halfChecked && `${prefixCls}-checkbox-checked`,
      halfChecked && `${prefixCls}-checkbox-indeterminate`,
      (isDisabled || node.disableCheckbox) && `${prefixCls}-checkbox-disabled`,
    ].filter(Boolean).join(' ');

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

  // Render Title
  const renderTitle = () => {
    const titleClassName = `${prefixCls}-title`;
    if (renderNode) {
      return <span className={titleClassName}>{renderNode(node)}</span>;
    }
    return <span className={titleClassName}>{node.title}</span>;
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
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
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

      {hasChildren && (
        <div
          className={[
            `${prefixCls}-child-tree`,
            isExpanded && `${prefixCls}-child-tree-expand`,
            `${prefixCls}-child-tree-animated`,
          ].filter(Boolean).join(' ')}
          style={{
            height: isExpanded ? 'auto' : 0,
            opacity: isExpanded ? 1 : 0,
            transition: `height ${motionDuration}ms ease, opacity ${motionDuration}ms ease`,
          }}
        >
          {node.children!.map((child, index) => (
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
              onExpand={onExpand}
              onSelect={onSelect}
              onCheck={onCheck}
              onNodeMount={onNodeMount}
            />
          ))}
        </div>
      )}
    </div>
  );
});

TreeNodeComponent.displayName = 'TreeNodeComponent';

// ===== Main Tree Component =====

export const Tree = forwardRef<TreeRef, TreeProps>(({
  treeData = [],
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
  prefixCls = 'idp-tree',
  className = '',
  style = {},
  disabled = false,
  defaultExpandAll = false,
}, ref) => {
  // State
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
      return getAllKeys(treeData);
    }
    return defaultExpandedKeys;
  });

  const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>(defaultSelectedKeys);
  const [checkedKeys, setCheckedKeys] = useState<(string | number)[]>(defaultCheckedKeys);
  const [loadingKeys, setLoadingKeys] = useState<(string | number)[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const nodeRefs = useRef<Map<string | number, HTMLDivElement | null>>(new Map());
  const treeContainerRef = useRef<HTMLDivElement>(null);

  // Expose ref methods
  useImperativeHandle(ref, () => ({
    scrollTo: (key: string | number) => {
      const nodeEl = nodeRefs.current.get(key);
      if (nodeEl && treeContainerRef.current) {
        nodeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
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
            newCheckedKeys = [...new Set([...newCheckedKeys, ...childKeys])];
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
              isLeaf={node.isLeaf !== undefined ? node.isLeaf : !node.children || node.children.length === 0}
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
              onExpand={handleExpand}
              onSelect={handleSelect}
              onCheck={handleCheck}
              onNodeMount={handleNodeMount}
            />
          ))}
        {renderEmpty()}
      </div>
    </div>
  );
});

Tree.displayName = 'Tree';

export default Tree;
