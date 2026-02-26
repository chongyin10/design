import { CSSProperties } from 'react';

// ===== Modern Tree Design System =====

export const treeTokens = {
  colors: {
    primary: '#1890ff',
    primaryLight: '#e6f7ff',
    primaryHover: '#bae7ff',
    text: 'rgba(0, 0, 0, 0.85)',
    textSecondary: 'rgba(0, 0, 0, 0.45)',
    textDisabled: 'rgba(0, 0, 0, 0.25)',
    border: '#d9d9d9',
    bgHover: 'rgba(0, 0, 0, 0.04)',
    bgSelected: '#f0f7ff',
    line: '#e8e8e8',
    white: '#ffffff',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  borderRadius: {
    sm: 3,
    md: 6,
  },
  transition: {
    default: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    fast: 'all 0.2s ease',
    slow: 'all 0.3s ease',
  },
  shadow: {
    focus: '0 0 0 2px rgba(24, 144, 255, 0.2)',
    subtle: '0 1px 2px rgba(0, 0, 0, 0.1)',
  },
} as const;

// ===== Container Styles =====

export const treeContainerStyle: CSSProperties = {
  boxSizing: 'border-box',
  margin: 0,
  padding: treeTokens.spacing.sm,
  fontSize: 14,
  lineHeight: 1.5715,
  listStyle: 'none',
  color: treeTokens.colors.text,
  background: treeTokens.colors.white,
  borderRadius: treeTokens.borderRadius.md,
};

// ===== Node Styles =====

export const treeNodeStyle: CSSProperties = {
  boxSizing: 'border-box',
  margin: 0,
  padding: 0,
  listStyle: 'none',
  outline: 'none',
};

export const treeTreenodeStyle: CSSProperties = {
  position: 'relative',
  padding: '2px 0',
  margin: 0,
  listStyle: 'none',
  outline: 'none',
  whiteSpace: 'nowrap',
  fontSize: 14,
  lineHeight: 1.5715,
  transition: treeTokens.transition.default,
};

export const treeNodeDisabledStyle: CSSProperties = {
  cursor: 'not-allowed',
  opacity: 0.6,
};

// ===== Content Styles =====

export const treeNodeContentStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: `${treeTokens.spacing.xs + 2}px ${treeTokens.spacing.md}px`,
  borderRadius: treeTokens.borderRadius.md,
  cursor: 'pointer',
  transition: treeTokens.transition.default,
  userSelect: 'none',
  position: 'relative',
  overflow: 'hidden',
};

export const treeNodeContentHoverStyle: CSSProperties = {
  backgroundColor: treeTokens.colors.bgHover,
};

export const treeNodeSelectedStyle: CSSProperties = {
  backgroundColor: treeTokens.colors.bgSelected,
  color: treeTokens.colors.primary,
  fontWeight: 500,
};

export const treeNodeSelectedHoverStyle: CSSProperties = {
  backgroundColor: treeTokens.colors.primaryHover,
};

// ===== Indent Styles =====

export const treeIndentStyle: CSSProperties = {
  display: 'inline-block',
  width: 24,
  height: '100%',
  flexShrink: 0,
};

// ===== Switcher Styles =====

export const treeSwitcherStyle: CSSProperties = {
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  margin: '0 2px',
  padding: 0,
  verticalAlign: 'middle',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  outline: 'none',
  borderRadius: 4,
  transition: treeTokens.transition.default,
  color: treeTokens.colors.textSecondary,
};

export const treeSwitcherHoverStyle: CSSProperties = {
  backgroundColor: treeTokens.colors.bgHover,
  color: treeTokens.colors.text,
};

export const treeSwitcherCloseStyle: CSSProperties = {
  transform: 'rotate(0deg)',
};

export const treeSwitcherOpenStyle: CSSProperties = {
  transform: 'rotate(90deg)',
};

// ===== Checkbox Styles =====

export const treeCheckboxStyle: CSSProperties = {
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 16,
  height: 16,
  margin: '0 8px 0 0',
  padding: 0,
  verticalAlign: 'middle',
  border: `2px solid ${treeTokens.colors.border}`,
  borderRadius: treeTokens.borderRadius.sm,
  backgroundColor: treeTokens.colors.white,
  cursor: 'pointer',
  transition: treeTokens.transition.default,
  boxSizing: 'border-box',
};

export const treeCheckboxHoverStyle: CSSProperties = {
  borderColor: treeTokens.colors.primary,
  boxShadow: treeTokens.shadow.focus,
};

export const treeCheckboxCheckedStyle: CSSProperties = {
  backgroundColor: treeTokens.colors.primary,
  borderColor: treeTokens.colors.primary,
};

export const treeCheckboxIndeterminateStyle: CSSProperties = {
  backgroundColor: treeTokens.colors.white,
  borderColor: treeTokens.colors.primary,
};

export const treeCheckboxDisabledStyle: CSSProperties = {
  cursor: 'not-allowed',
  opacity: 0.5,
  backgroundColor: '#f5f5f5',
};

// ===== Icon Styles =====

export const treeIconStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 20,
  height: 20,
  margin: '0 6px 0 0',
  fontSize: 16,
  verticalAlign: 'middle',
  color: treeTokens.colors.textSecondary,
  transition: treeTokens.transition.default,
};

export const treeIconSelectedStyle: CSSProperties = {
  color: treeTokens.colors.primary,
};

// ===== Title Styles =====

export const treeTitleStyle: CSSProperties = {
  flex: 1,
  padding: '0 4px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  transition: treeTokens.transition.default,
};

// ===== Child Tree Styles =====

export const treeChildTreeStyle: CSSProperties = {
  paddingLeft: 24,
  overflow: 'hidden',
  position: 'relative',
};

export const getMotionStyle = (duration: number, expanded: boolean): CSSProperties => ({
  transition: `height ${duration}ms ease, opacity ${duration}ms ease`,
  overflow: 'hidden',
  height: expanded ? 'auto' : 0,
  opacity: expanded ? 1 : 0,
});

// ===== Loading Styles =====

export const treeLoadingStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  color: treeTokens.colors.primary,
};

export const treeLoadingIconStyle: CSSProperties = {
  animation: 'idp-tree-spin 1s linear infinite',
};

// ===== Search Styles =====

export const treeSearchStyle: CSSProperties = {
  padding: `${treeTokens.spacing.sm}px ${treeTokens.spacing.md}px`,
  marginBottom: treeTokens.spacing.sm + 4,
  background: 'linear-gradient(135deg, #f5f7fa 0%, #fff 100%)',
  borderRadius: treeTokens.borderRadius.md,
  border: `1px solid ${treeTokens.colors.border}`,
};

export const treeSearchInputStyle: CSSProperties = {
  boxSizing: 'border-box',
  width: '100%',
  padding: `${treeTokens.spacing.sm}px ${treeTokens.spacing.md}px`,
  border: `1px solid ${treeTokens.colors.border}`,
  borderRadius: treeTokens.borderRadius.md,
  fontSize: 14,
  outline: 'none',
  transition: treeTokens.transition.default,
  background: treeTokens.colors.white,
};

export const treeSearchInputFocusStyle: CSSProperties = {
  borderColor: treeTokens.colors.primary,
  boxShadow: treeTokens.shadow.focus,
};

export const treeSearchInputHoverStyle: CSSProperties = {
  borderColor: '#40a9ff',
};

// ===== Highlight Styles =====

export const treeHighlightStyle: CSSProperties = {
  background: 'linear-gradient(120deg, #ffe58f 0%, #ffd666 100%)',
  padding: '1px 4px',
  borderRadius: treeTokens.borderRadius.sm,
  fontWeight: 500,
  color: '#874d00',
  boxShadow: treeTokens.shadow.subtle,
};

// ===== Empty State Styles =====

export const treeEmptyStyle: CSSProperties = {
  padding: 24,
  textAlign: 'center',
  color: treeTokens.colors.textSecondary,
  fontSize: 14,
};

export const treeEmptyIconStyle: CSSProperties = {
  fontSize: 48,
  marginBottom: 8,
  opacity: 0.3,
};

// ===== Draggable Styles =====

export const treeDraggableStyle: CSSProperties = {
  cursor: 'grab',
};

export const treeDraggingStyle: CSSProperties = {
  cursor: 'grabbing',
};

export const treeDragOverStyle: CSSProperties = {
  backgroundColor: treeTokens.colors.primaryLight,
  boxShadow: `inset 0 0 0 2px ${treeTokens.colors.primary}`,
};

export const treeDropTargetStyle: CSSProperties = {
  backgroundColor: treeTokens.colors.primaryHover,
};

// ===== Line Styles =====

export const treeLineStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 10,
  bottom: 14,
  width: 1,
  background: `linear-gradient(to bottom, ${treeTokens.colors.line}, transparent)`,
};

export const treeLinePointStyle: CSSProperties = {
  position: 'absolute',
  left: -14,
  top: '50%',
  width: 8,
  height: 1,
  backgroundColor: treeTokens.colors.line,
  transform: 'translateY(-50%)',
};

// ===== Helper Functions =====

export const getNodeClassNames = (
  prefixCls: string,
  options: {
    selected?: boolean;
    disabled?: boolean;
    draggable?: boolean;
    dragOver?: boolean;
    isLeaf?: boolean;
    showLine?: boolean;
  }
): string => {
  const classes = [`${prefixCls}-treenode`];
  if (options.selected) classes.push(`${prefixCls}-node-selected`);
  if (options.disabled) classes.push(`${prefixCls}-treenode-disabled`);
  if (options.draggable) classes.push(`${prefixCls}-treenode-draggable`);
  if (options.dragOver) classes.push(`${prefixCls}-treenode-drag-over`);
  if (options.isLeaf) classes.push(`${prefixCls}-treenode-leaf`);
  if (options.showLine) classes.push(`${prefixCls}-line`);
  return classes.join(' ');
};

export const getContentClassNames = (
  prefixCls: string,
  selected?: boolean
): string => {
  const classes = [`${prefixCls}-node-content-wrapper`];
  if (selected) classes.push(`${prefixCls}-node-selected`);
  return classes.join(' ');
};

export const getCheckboxClassNames = (
  prefixCls: string,
  options: {
    checked?: boolean;
    halfChecked?: boolean;
    disabled?: boolean;
  }
): string => {
  const classes = [`${prefixCls}-checkbox`];
  if (options.checked && !options.halfChecked) classes.push(`${prefixCls}-checkbox-checked`);
  if (options.halfChecked) classes.push(`${prefixCls}-checkbox-indeterminate`);
  if (options.disabled) classes.push(`${prefixCls}-checkbox-disabled`);
  return classes.join(' ');
};

export const getSwitcherClassNames = (
  prefixCls: string,
  expanded?: boolean
): string => {
  const classes = [`${prefixCls}-switcher`];
  if (expanded) {
    classes.push(`${prefixCls}-switcher-open`);
  } else {
    classes.push(`${prefixCls}-switcher-close`);
  }
  return classes.join(' ');
};
