import { CSSProperties } from 'react';

// ============================================
// IDP Tree Design System - 使用统一 CSS 变量
// ============================================

// ===== Container Styles =====

export const treeContainerStyle: CSSProperties = {
  boxSizing: 'border-box',
  margin: 0,
  padding: 'var(--zjpcy-spacing-sm)',
  fontSize: 14,
  lineHeight: 1.5715,
  listStyle: 'none',
  color: 'var(--zjpcy-text-color)',
  background: 'var(--zjpcy-bg-color-white)',
  borderRadius: 'var(--zjpcy-border-radius-lg)',
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
  transition: 'all var(--zjpcy-transition-duration) var(--zjpcy-transition-timing-function)',
};

export const treeNodeDisabledStyle: CSSProperties = {
  cursor: 'not-allowed',
  opacity: 'var(--zjpcy-opacity-disabled)',
};

// ===== Content Styles =====

export const treeNodeContentStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px var(--zjpcy-spacing-sm)',
  borderRadius: 'var(--zjpcy-border-radius-md)',
  cursor: 'pointer',
  transition: 'all var(--zjpcy-transition-duration) var(--zjpcy-transition-timing-function)',
  userSelect: 'none',
  position: 'relative',
  overflow: 'hidden',
};

export const treeNodeContentHoverStyle: CSSProperties = {
  background: 'linear-gradient(135deg, var(--zjpcy-bg-color-light) 0%, var(--zjpcy-bg-color) 100%)',
};

export const treeNodeSelectedStyle: CSSProperties = {
  background: 'linear-gradient(135deg, var(--zjpcy-primary-light-color) 0%, rgba(24, 144, 255, 0.08) 100%)',
  color: 'var(--zjpcy-primary-color)',
  fontWeight: 500,
  boxShadow: 'var(--zjpcy-shadow-extra-light)',
};

export const treeNodeSelectedHoverStyle: CSSProperties = {
  background: 'linear-gradient(135deg, rgba(24, 144, 255, 0.15) 0%, rgba(24, 144, 255, 0.1) 100%)',
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
  borderRadius: 'var(--zjpcy-border-radius-sm)',
  transition: 'all var(--zjpcy-transition-duration) var(--zjpcy-transition-timing-function)',
  color: 'var(--zjpcy-text-color-tertiary)',
};

export const treeSwitcherHoverStyle: CSSProperties = {
  background: 'linear-gradient(135deg, var(--zjpcy-bg-color-light) 0%, var(--zjpcy-bg-color) 100%)',
  color: 'var(--zjpcy-text-color)',
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
  border: '2px solid var(--zjpcy-border-color-extra-light)',
  borderRadius: 'var(--zjpcy-border-radius-sm)',
  background: 'var(--zjpcy-bg-color-white)',
  cursor: 'pointer',
  transition: 'all var(--zjpcy-transition-duration) var(--zjpcy-transition-timing-function)',
  boxSizing: 'border-box',
};

export const treeCheckboxHoverStyle: CSSProperties = {
  borderColor: 'var(--zjpcy-primary-color)',
  boxShadow: 'var(--zjpcy-input-box-shadow-hover)',
};

export const treeCheckboxCheckedStyle: CSSProperties = {
  background: 'linear-gradient(135deg, var(--zjpcy-primary-color) 0%, var(--zjpcy-primary-hover-color) 100%)',
  borderColor: 'var(--zjpcy-primary-color)',
};

export const treeCheckboxIndeterminateStyle: CSSProperties = {
  background: 'linear-gradient(135deg, var(--zjpcy-primary-color) 0%, var(--zjpcy-primary-hover-color) 100%)',
  borderColor: 'var(--zjpcy-primary-color)',
};

export const treeCheckboxDisabledStyle: CSSProperties = {
  cursor: 'not-allowed',
  opacity: 'var(--zjpcy-opacity-disabled)',
  background: 'var(--zjpcy-bg-color-light)',
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
  color: 'var(--zjpcy-text-color-tertiary)',
  transition: 'all var(--zjpcy-transition-duration) var(--zjpcy-transition-timing-function)',
};

export const treeIconSelectedStyle: CSSProperties = {
  color: 'var(--zjpcy-primary-color)',
};

// ===== Title Styles =====

export const treeTitleStyle: CSSProperties = {
  flex: 1,
  padding: '0 4px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  transition: 'all var(--zjpcy-transition-duration) var(--zjpcy-transition-timing-function)',
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
  color: 'var(--zjpcy-primary-color)',
};

export const treeLoadingIconStyle: CSSProperties = {
  animation: 'zjpcy-tree-spin 1s linear infinite',
};

// ===== Search Styles =====

export const treeSearchStyle: CSSProperties = {
  padding: 'var(--zjpcy-spacing-sm) var(--zjpcy-spacing-md)',
  marginBottom: 'var(--zjpcy-spacing-sm)',
  background: 'linear-gradient(135deg, var(--zjpcy-bg-color-light) 0%, var(--zjpcy-bg-color-white) 100%)',
  borderRadius: 'var(--zjpcy-border-radius-lg)',
  border: '1px solid var(--zjpcy-border-color-extra-light)',
  boxShadow: 'var(--zjpcy-shadow-extra-light)',
};

export const treeSearchInputStyle: CSSProperties = {
  boxSizing: 'border-box',
  width: '100%',
  padding: 'var(--zjpcy-spacing-sm) var(--zjpcy-spacing-md)',
  border: '1px solid var(--zjpcy-input-border)',
  borderRadius: 'var(--zjpcy-border-radius-lg)',
  fontSize: 14,
  outline: 'none',
  transition: 'all var(--zjpcy-transition-duration) var(--zjpcy-transition-timing-function)',
  background: 'var(--zjpcy-bg-color-white)',
  boxShadow: 'var(--zjpcy-shadow-extra-light)',
};

export const treeSearchInputFocusStyle: CSSProperties = {
  borderColor: 'var(--zjpcy-input-border-focus)',
  boxShadow: 'var(--zjpcy-input-box-shadow-focus)',
};

export const treeSearchInputHoverStyle: CSSProperties = {
  borderColor: 'var(--zjpcy-input-border-hover)',
  boxShadow: 'var(--zjpcy-input-box-shadow-hover)',
};

// ===== Highlight Styles =====

export const treeHighlightStyle: CSSProperties = {
  background: 'linear-gradient(120deg, #ffe58f 0%, #ffd666 100%)',
  padding: '1px 4px',
  borderRadius: 'var(--zjpcy-border-radius-sm)',
  fontWeight: 500,
  color: '#874d00',
  boxShadow: 'var(--zjpcy-shadow-extra-light)',
};

// ===== Empty State Styles =====

export const treeEmptyStyle: CSSProperties = {
  padding: 24,
  textAlign: 'center',
  color: 'var(--zjpcy-text-color-tertiary)',
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
  background: 'linear-gradient(135deg, var(--zjpcy-primary-light-color) 0%, rgba(24, 144, 255, 0.12) 100%)',
  boxShadow: 'inset 0 0 0 2px var(--zjpcy-primary-color)',
};

export const treeDropTargetStyle: CSSProperties = {
  background: 'linear-gradient(135deg, rgba(24, 144, 255, 0.15) 0%, rgba(24, 144, 255, 0.08) 100%)',
};

// ===== Line Styles =====

export const treeLineStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 10,
  bottom: 14,
  width: 1,
  background: 'linear-gradient(to bottom, var(--zjpcy-border-color), transparent)',
};

export const treeLinePointStyle: CSSProperties = {
  position: 'absolute',
  left: -14,
  top: '50%',
  width: 8,
  height: 1,
  backgroundColor: 'var(--zjpcy-border-color)',
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
