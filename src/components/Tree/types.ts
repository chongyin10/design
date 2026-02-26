import * as React from 'react';

/** Tooltip 配置 */
export interface TreeNodeTooltip {
  /** Tooltip 内容 */
  title?: React.ReactNode;
  /** 位置 */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** 触发方式 */
  trigger?: 'hover' | 'click';
  /** 延迟显示时间（毫秒） */
  delay?: number;
  /** 自定义背景色 */
  backgroundColor?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 自定义类名 */
  className?: string;
}

export interface TreeNode {
  /** 节点唯一标识 */
  key: string | number;
  /** 节点标题 */
  title: React.ReactNode;
  /** 节点图标 */
  icon?: React.ReactNode;
  /** 子节点 */
  children?: TreeNode[];
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否禁用复选框 */
  disableCheckbox?: boolean;
  /** 是否选中 */
  checked?: boolean;
  /** 是否半选 */
  halfChecked?: boolean;
  /** 是否展开 */
  expanded?: boolean;
  /** 是否叶子节点 */
  isLeaf?: boolean;
  /** 加载中 */
  loading?: boolean;
  /** 节点类名 */
  className?: string;
  /** 节点样式 */
  style?: React.CSSProperties;
  /** 自定义渲染 */
  render?: (node: TreeNode) => React.ReactNode;
  /** 节点拖拽相关 */
  draggable?: boolean;
  /** Tooltip 配置，默认不启用 */
  tooltip?: TreeNodeTooltip | boolean;
}

export interface TreeProps {
  /** 树数据 */
  treeData?: TreeNode[];
  /** 默认展开的键 */
  defaultExpandedKeys?: (string | number)[];
  /** 展开的键（受控） */
  expandedKeys?: (string | number)[];
  /** 展开/收起回调 */
  onExpand?: (expandedKeys: (string | number)[], { expanded, node, nativeEvent }: { expanded: boolean; node: TreeNode; nativeEvent: MouseEvent }) => void;
  /** 默认选中的键 */
  defaultSelectedKeys?: (string | number)[];
  /** 选中的键（受控） */
  selectedKeys?: (string | number)[];
  /** 选中回调 */
  onSelect?: (selectedKeys: (string | number)[], { selected, node, nativeEvent }: { selected: boolean; node: TreeNode; nativeEvent: MouseEvent }) => void;
  /** 默认勾选的键 */
  defaultCheckedKeys?: (string | number)[];
  /** 勾选的键（受控） */
  checkedKeys?: (string | number)[];
  /** 勾选回调 */
  onCheck?: (checkedKeys: (string | number)[], { checked, node, nativeEvent }: { checked: boolean; node: TreeNode; nativeEvent: MouseEvent }) => void;
  /** 是否显示复选框 */
  checkable?: boolean;
  /** 是否父子关联 */
  checkStrictly?: boolean;
  /** 是否支持多选 */
  multiple?: boolean;
  /** 是否支持搜索 */
  showSearch?: boolean;
  /** 搜索匹配高亮 */
  filterOption?: (search: string, node: TreeNode) => boolean;
  /** 自定义搜索匹配渲染 */
  renderSearch?: (search: string, node: TreeNode) => React.ReactNode;
  /** 是否显示连接线 */
  showLine?: boolean;
  /** 是否显示缩进标识 */
  showIndent?: boolean;
  /** 是否显示图标 */
  showIcon?: boolean;
  /** 是否异步加载数据 */
  loadData?: (node: TreeNode) => Promise<void>;
  /** 动画时长（毫秒） */
  motionDuration?: number;
  /** 是否支持拖拽 */
  draggable?: boolean;
  /** 拖拽开始回调 */
  onDragStart?: (params: { event: MouseEvent; node: TreeNode }) => void;
  /** 拖拽进入回调 */
  onDragEnter?: (params: { event: MouseEvent; node: TreeNode }) => void;
  /** 拖拽放置回调 */
  onDrop?: (params: { event: MouseEvent; node: TreeNode; dragNode: TreeNode; dragPosition: 'before' | 'after' | 'inside' }) => void;
  /** 拖拽结束回调 */
  onDragEnd?: (params: { event: MouseEvent; node: TreeNode }) => void;
  /** 是否支持动态添加节点 */
  addable?: boolean;
  /** 是否支持删除节点 */
  removable?: boolean;
  /** 是否支持编辑节点 */
  editable?: boolean;
  /** 操作按钮显示模式：'inline' 行内显示 | 'dropdown' 下拉菜单 */
  actionDisplayMode?: 'inline' | 'dropdown';
  /** 添加节点回调 - 返回新节点的初始数据 */
  onAddNode?: (parentNode: TreeNode) => TreeNode | TreeNode[] | void;
  /** 删除节点回调 - 返回 false 可阻止删除 */
  onRemoveNode?: (node: TreeNode) => boolean | void;
  /** 编辑节点回调 - 返回编辑后的标题 */
  onEditNode?: (node: TreeNode, newTitle: string) => string | void;
  /** 自定义节点渲染 */
  renderNode?: (node: TreeNode) => React.ReactNode;
  /** 节点前渲染 */
  prefixCls?: string;
  /** 类名 */
  className?: string;
  /** 样式 */
  style?: React.CSSProperties;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否自动展开父节点 */
  autoExpandParent?: boolean;
  /** 默认展开所有 */
  defaultExpandAll?: boolean;
  /** 展开动画 */
  motion?: React.CSSProperties | ((node: TreeNode, isExpanded: boolean) => React.CSSProperties);
  /** 全局 Tooltip 配置，默认关闭 */
  tooltip?: TreeNodeTooltip | boolean;
}

export interface TreeNodeProps {
  /** 节点数据 */
  node: TreeNode;
  /** 层级深度 */
  level: number;
  /** 是否展开 */
  expanded: boolean;
  /** 是否选中 */
  selected: boolean;
  /** 是否勾选 */
  checked: boolean;
  /** 是否半选 */
  halfChecked: boolean;
  /** 是否加载中 */
  loading: boolean;
  /** 是否叶子节点 */
  isLeaf: boolean;
  /** 父节点是否展开 */
  parentExpanded: boolean;
  /** 树组件属性 */
  treeProps: TreeProps;
  /** 展开节点 */
  onExpand: (node: TreeNode, e: React.MouseEvent) => void;
  /** 选择节点 */
  onSelect: (node: TreeNode, e: React.MouseEvent) => void;
  /** 勾选节点 */
  onCheck: (node: TreeNode, e: React.MouseEvent | React.KeyboardEvent) => void;
}

export interface TreeState {
  /** 展开的键集合 */
  expandedKeys: (string | number)[];
  /** 选中的键集合 */
  selectedKeys: (string | number)[];
  /** 勾选的键集合 */
  checkedKeys: (string | number)[];
  /** 加载中的键集合 */
  loadingKeys: (string | number)[];
}
