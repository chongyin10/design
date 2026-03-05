import styled from 'styled-components';
import { TreeSelectStyles } from './types';

// 从 CSS 变量中读取值的辅助函数
const getCSSVar = (property: string, fallback: string) => `var(${property}, ${fallback})`;

// 容器组件
export const Wrapper = styled.div<{ $styles?: TreeSelectStyles['wrapper']; $width?: number | string }>`
  position: relative;
  display: inline-block;
  width: ${props => props.$width || '100%'};
  min-width: 180px;
  font-size: 14px;
  color: ${getCSSVar('--idp-text-color', 'rgba(0, 0, 0, 0.85)')};
  box-sizing: border-box;

  &.treeselect-wrapper {
    /* 外部可通过 .treeselect-wrapper 选择器覆盖样式 */
  }

  ${({ $styles }) => $styles && Object.entries($styles).map(([key, value]) => `${key}: ${value};`).join('\n')}
`;

// 选择框组件
export const Selection = styled.div<{ $open: boolean; $disabled: boolean; $size: 'large' | 'middle' | 'small'; $styles?: TreeSelectStyles['selection'] }>`
  position: relative;
  display: flex;
  align-items: center;
  min-height: 32px;
  padding: 6px 28px 6px 12px;
  background-color: ${getCSSVar('--idp-bg-color-white', '#fff')};
  border: 1px solid ${getCSSVar('--idp-border-color-extra-light', '#d9d9d9')};
  border-radius: ${getCSSVar('--idp-border-radius-sm', '4px')};
  cursor: pointer;
  transition: all ${getCSSVar('--idp-transition-duration', '0.2s')} ${getCSSVar('--idp-transition-timing-function', 'ease-in-out')};
  box-sizing: border-box;

  &.treeselect-selection {
    /* 外部可通过 .treeselect-selection 选择器覆盖样式 */
  }

  &:hover {
    border-color: ${getCSSVar('--idp-primary-hover-color', '#40a9ff')};
  }

  ${({ $open }) =>
    $open && `
      border-color: ${getCSSVar('--idp-primary-color', '#1890ff')};
      box-shadow: ${getCSSVar('--idp-input-box-shadow-focus', '0 0 0 2px rgba(51, 154, 240, 0.2)')};
    `
  }

  ${({ $disabled }) =>
    $disabled && `
      background-color: ${getCSSVar('--idp-input-disabled-bg', '#f5f5f5')};
      border-color: ${getCSSVar('--idp-border-color-extra-light', '#d9d9d9')};
      cursor: not-allowed;
    `
  }

  ${({ $size }) => {
    if ($size === 'large') {
      return `
        min-height: 40px;
        padding: 6px 32px 6px 15px;
        font-size: 16px;
      `;
    }
    if ($size === 'small') {
      return `
        min-height: 24px;
        padding: 2px 24px 2px 7px;
        font-size: 14px;
      `;
    }
    return '';
  }}

  ${({ $styles }) => $styles && Object.entries($styles).map(([key, value]) => `${key}: ${value};`).join('\n')}
`;

// 渲染区域组件
export const Rendered = styled.div<{ $isPlaceholder: boolean }>`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  overflow: hidden;

  &.treeselect-selection__rendered {
    /* 外部可通过 .treeselect-selection__rendered 选择器覆盖样式 */
  }

  ${({ $isPlaceholder }) =>
    $isPlaceholder && `
      color: ${getCSSVar('--idp-input-placeholder-color', '#bfbfbf')};
    `
  }
`;

// 单选选中项组件
export const SelectionItem = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.treeselect-selection__item {
    /* 外部可通过 .treeselect-selection__item 选择器覆盖样式 */
  }
`;

// 多选标签组件
export const Tag = styled.span<{ $size: 'large' | 'middle' | 'small'; $styles?: TreeSelectStyles['tag'] }>`
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  padding: 2px 8px;
  background-color: ${getCSSVar('--idp-bg-color-light', '#f5f5f5')};
  border: 1px solid ${getCSSVar('--idp-border-color-light', '#f0f0f0')};
  border-radius: ${getCSSVar('--idp-border-radius-sm', '4px')};
  font-size: 12px;
  line-height: 1.5;

  &.treeselect-selection__tag {
    /* 外部可通过 .treeselect-selection__tag 选择器覆盖样式 */
  }

  &.treeselect-selection__tag--more {
    background-color: transparent;
    border-color: transparent;
    color: ${getCSSVar('--idp-text-color-secondary', 'rgba(0, 0, 0, 0.65)')};
  }

  ${({ $size }) => {
    if ($size === 'large') {
      return `
        font-size: 14px;
        padding: 4px 10px;
      `;
    }
    if ($size === 'small') {
      return `
        font-size: 12px;
        padding: 1px 6px;
      `;
    }
    return '';
  }}

  ${({ $styles }) => $styles && Object.entries($styles).map(([key, value]) => `${key}: ${value};`).join('\n')}
`;

// 标签内容组件
export const TagContent = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.treeselect-selection__tag-content {
    /* 外部可通过 .treeselect-selection__tag-content 选择器覆盖样式 */
  }
`;

// 标签关闭按钮组件
export const TagClose = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 4px;
  padding: 2px;
  color: ${getCSSVar('--idp-text-color-tertiary', 'rgba(0, 0, 0, 0.45)')};
  cursor: pointer;
  transition: color ${getCSSVar('--idp-transition-duration', '0.2s')};

  &.treeselect-selection__tag-close {
    /* 外部可通过 .treeselect-selection__tag-close 选择器覆盖样式 */
  }

  &:hover {
    color: ${getCSSVar('--idp-text-color', 'rgba(0, 0, 0, 0.85)')};
  }
`;

// 搜索输入框容器组件
export const SearchWrapper = styled.div`
  flex: 1;
  min-width: 30px;

  &.treeselect-selection__search {
    /* 外部可通过 .treeselect-selection__search 选择器覆盖样式 */
  }
`;

// 搜索输入框组件
export const SearchInput = styled.input`
  width: 100%;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: ${getCSSVar('--idp-text-color', 'rgba(0, 0, 0, 0.85)')};

  &::placeholder {
    color: ${getCSSVar('--idp-input-placeholder-color', '#bfbfbf')};
  }

  &.treeselect-selection__search-input,
  &.treeselect-dropdown__search-input {
    /* 外部可通过这些选择器覆盖样式 */
  }
`;

// 清除按钮组件
export const ClearIcon = styled.span<{ $size: 'large' | 'middle' | 'small' }>`
  position: absolute;
  right: 28px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  color: ${getCSSVar('--idp-text-color-tertiary', 'rgba(0, 0, 0, 0.45)')};
  cursor: pointer;
  transition: color ${getCSSVar('--idp-transition-duration', '0.2s')};
  z-index: 1;

  &.treeselect-selection__clear {
    /* 外部可通过 .treeselect-selection__clear 选择器覆盖样式 */
  }

  &:hover {
    color: ${getCSSVar('--idp-text-color', 'rgba(0, 0, 0, 0.85)')};
  }

  ${({ $size }) => {
    if ($size === 'large') {
      return 'right: 32px;';
    }
    if ($size === 'small') {
      return 'right: 24px;';
    }
    return '';
  }}
`;

// 下拉箭头组件
export const ArrowIcon = styled.span<{ $open: boolean; $size: 'large' | 'middle' | 'small' }>`
  position: absolute;
  right: 11px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${getCSSVar('--idp-text-color-tertiary', 'rgba(0, 0, 0, 0.45)')};
  transition: transform ${getCSSVar('--idp-transition-duration', '0.2s')};
  pointer-events: none;

  &.treeselect-selection__arrow {
    /* 外部可通过 .treeselect-selection__arrow 选择器覆盖样式 */
  }

  ${({ $open }) =>
    $open && `
      transform: translateY(-50%) rotate(180deg);
    `
  }

  ${({ $size }) => {
    if ($size === 'large') {
      return 'right: 15px;';
    }
    if ($size === 'small') {
      return 'right: 7px;';
    }
    return '';
  }}
`;

// 下拉面板组件
export const Dropdown = styled.div<{ $width?: number | string; $height?: number | string; $styles?: TreeSelectStyles['dropdown'] }>`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1050;
  margin-top: 4px;
  background-color: ${getCSSVar('--idp-bg-color-white', '#fff')};
  border-radius: ${getCSSVar('--idp-border-radius-sm', '4px')};
  box-shadow: ${getCSSVar('--idp-shadow-lg', '0 8px 24px rgba(0, 0, 0, 0.15)')};
  overflow: hidden;
  width: ${props => props.$width || '100%'};
  max-height: ${props => props.$height || '300px'};

  &.treeselect-dropdown {
    /* 外部可通过 .treeselect-dropdown 选择器覆盖样式 */
  }

  ${({ $styles }) => $styles && Object.entries($styles).map(([key, value]) => `${key}: ${value};`).join('\n')}
`;

// 下拉搜索框容器组件
export const DropdownSearchWrapper = styled.div`
  padding: 8px 12px;
  border-bottom: 1px solid ${getCSSVar('--idp-border-color-light', '#f0f0f0')};

  &.treeselect-dropdown__search {
    /* 外部可通过 .treeselect-dropdown__search 选择器覆盖样式 */
  }
`;

// 下拉搜索输入框组件（带背景）
export const DropdownSearchInput = styled.input`
  width: 100%;
  padding: 4px 8px;
  background-color: ${getCSSVar('--idp-bg-color-light', '#f5f5f5')};
  border: none;
  border-radius: ${getCSSVar('--idp-border-radius-sm', '4px')};
  outline: none;
  font-size: 14px;
  color: ${getCSSVar('--idp-text-color', 'rgba(0, 0, 0, 0.85)')};

  &::placeholder {
    color: ${getCSSVar('--idp-input-placeholder-color', '#bfbfbf')};
  }
`;

// 下拉内容区域组件
export const DropdownContent = styled.div`
  max-height: 300px;
  overflow-y: auto;
  padding: 4px 0;

  &.treeselect-dropdown__content {
    /* 外部可通过 .treeselect-dropdown__content 选择器覆盖样式 */
  }

  /* 滚动条样式 */
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.15);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.25);
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`;

// 空状态组件
export const EmptyWrapper = styled.div`
  padding: 32px 0;

  &.treeselect-dropdown__empty {
    /* 外部可通过 .treeselect-dropdown__empty 选择器覆盖样式 */
  }
`;

// 树节点包装器组件
export const TreeNodeWrapper = styled.div`
  display: flex;
  flex-direction: column;

  &.treeselect-tree-node-wrapper {
    /* 外部可通过 .treeselect-tree-node-wrapper 选择器覆盖样式 */
  }
`;

// 树节点组件
export const TreeNode = styled.div<{ $selected: boolean; $disabled: boolean; $level: number; $styles?: TreeSelectStyles['treeNode'] }>`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  padding-left: ${props => `${props.$level * 20 + 12}px`};
  cursor: pointer;
  transition: background-color ${getCSSVar('--idp-transition-duration', '0.2s')};
  user-select: none;

  &.treeselect-tree-node {
    /* 外部可通过 .treeselect-tree-node 选择器覆盖样式 */
  }

  &:hover {
    background-color: ${getCSSVar('--idp-bg-color-light', '#f5f5f5')};
  }

  ${({ $selected }) =>
    $selected && `
      background-color: ${getCSSVar('--idp-primary-light-color', 'rgba(24, 100, 240, 0.1)')};
      color: ${getCSSVar('--idp-primary-color', '#1890ff')};

      &:hover {
        background-color: ${getCSSVar('--idp-primary-light-color', 'rgba(24, 100, 240, 0.1)')};
      }
    `
  }

  ${({ $disabled }) =>
    $disabled && `
      color: ${getCSSVar('--idp-text-color-tertiary', 'rgba(0, 0, 0, 0.45)')};
      cursor: not-allowed;

      &:hover {
        background-color: transparent;
      }
    `
  }

  ${({ $styles }) => $styles && Object.entries($styles).map(([key, value]) => `${key}: ${value};`).join('\n')}
`;

// 展开/折叠图标组件
export const ExpandIcon = styled.span<{ $expanded: boolean; $hasChildren: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-right: 4px;
  cursor: pointer;
  transition: transform ${getCSSVar('--idp-transition-duration', '0.2s')};

  &.treeselect-tree-node__expand-icon {
    /* 外部可通过 .treeselect-tree-node__expand-icon 选择器覆盖样式 */
  }

  ${({ $expanded }) =>
    $expanded && `
      transform: rotate(90deg);
    `
  }

  ${({ $hasChildren }) =>
    !$hasChildren && `
      visibility: hidden;
      cursor: default;
    `
  }
`;

// 复选框组件
export const Checkbox = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;

  &.treeselect-tree-node__checkbox {
    /* 外部可通过 .treeselect-tree-node__checkbox 选择器覆盖样式 */
  }
`;

// 复选框内部组件
export const CheckboxInner = styled.span<{ $checked: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: 1px solid ${getCSSVar('--idp-border-color-extra-light', '#d9d9d9')};
  border-radius: 2px;
  background-color: ${getCSSVar('--idp-bg-color-white', '#fff')};
  transition: all ${getCSSVar('--idp-transition-duration', '0.2s')};

  &.treeselect-tree-node__checkbox-inner {
    /* 外部可通过 .treeselect-tree-node__checkbox-inner 选择器覆盖样式 */
  }

  .treeselect-tree-node:hover & {
    border-color: ${getCSSVar('--idp-primary-color', '#1890ff')};
  }

  ${({ $checked }) =>
    $checked && `
      background-color: ${getCSSVar('--idp-primary-color', '#1890ff')};
      border-color: ${getCSSVar('--idp-primary-color', '#1890ff')};
    `
  }
`;

// 节点标题组件
export const NodeTitle = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.treeselect-tree-node__title {
    /* 外部可通过 .treeselect-tree-node__title 选择器覆盖样式 */
  }
`;

// 子节点容器组件
export const TreeNodeChildren = styled.div`
  display: flex;
  flex-direction: column;

  &.treeselect-tree-node-children {
    /* 外部可通过 .treeselect-tree-node-children 选择器覆盖样式 */
  }
`;
