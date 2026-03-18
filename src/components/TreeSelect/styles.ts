import classNames from 'classnames';
import type { CSSProperties } from 'react';
import { TreeSelectStyles } from './types';

// ============================================
// TreeSelect 外层容器
// ============================================

/**
 * 获取 Wrapper 类名
 */
export const getWrapperClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'zjpcy-treeselect',
        className
    );
};

/**
 * 获取 Wrapper 样式
 */
export const getWrapperStyle = (options: {
    width?: string | number;
    style?: CSSProperties;
    customStyles?: TreeSelectStyles['wrapper'];
}): CSSProperties => {
    const { width, style, customStyles } = options;
    const widthStyle = width !== undefined
        ? { width: typeof width === 'number' ? `${width}px` : width }
        : {};
    return {
        ...widthStyle,
        ...style,
        ...customStyles,
    };
};

// ============================================
// 选择框
// ============================================

/**
 * 获取 Selection 类名
 */
export const getSelectionClassName = (options: {
    open?: boolean;
    disabled?: boolean;
    size?: 'large' | 'middle' | 'small';
    className?: string;
}): string => {
    const { open, disabled, size = 'middle', className } = options;
    return classNames(
        'zjpcy-treeselect-selection',
        {
            'zjpcy-treeselect-selection-open': open,
            'zjpcy-treeselect-selection-disabled': disabled,
            'zjpcy-treeselect-selection-large': size === 'large',
            'zjpcy-treeselect-selection-small': size === 'small',
        },
        className
    );
};

/**
 * 获取 Selection 样式
 */
export const getSelectionStyle = (options: {
    customStyles?: TreeSelectStyles['selection'];
}): CSSProperties => {
    const { customStyles } = options;
    return {
        ...customStyles,
    };
};

// ============================================
// 渲染区域
// ============================================

/**
 * 获取 Rendered 类名
 */
export const getRenderedClassName = (options: {
    isPlaceholder?: boolean;
    className?: string;
}): string => {
    const { isPlaceholder, className } = options;
    return classNames(
        'zjpcy-treeselect-selection__rendered',
        {
            'zjpcy-treeselect-selection__rendered--placeholder': isPlaceholder,
        },
        className
    );
};

/**
 * 获取 Rendered 样式
 */
export const getRenderedStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// 单选选中项
// ============================================

/**
 * 获取 SelectionItem 类名
 */
export const getSelectionItemClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'zjpcy-treeselect-selection__item',
        className
    );
};

/**
 * 获取 SelectionItem 样式
 */
export const getSelectionItemStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// 多选标签
// ============================================

/**
 * 获取 Tag 类名
 */
export const getTagClassName = (options: {
    isMore?: boolean;
    size?: 'large' | 'middle' | 'small';
    className?: string;
}): string => {
    const { isMore, size = 'middle', className } = options;
    return classNames(
        'zjpcy-treeselect-selection__tag',
        {
            'zjpcy-treeselect-selection__tag--more': isMore,
            'zjpcy-treeselect-selection__tag-large': size === 'large',
            'zjpcy-treeselect-selection__tag-small': size === 'small',
        },
        className
    );
};

/**
 * 获取 Tag 样式
 */
export const getTagStyle = (options: {
    customStyles?: TreeSelectStyles['tag'];
}): CSSProperties => {
    const { customStyles } = options;
    return {
        ...customStyles,
    };
};

// ============================================
// 标签内容
// ============================================

/**
 * 获取 TagContent 类名
 */
export const getTagContentClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'zjpcy-treeselect-selection__tag-content',
        className
    );
};

/**
 * 获取 TagContent 样式
 */
export const getTagContentStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// 标签关闭按钮
// ============================================

/**
 * 获取 TagClose 类名
 */
export const getTagCloseClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'zjpcy-treeselect-selection__tag-close',
        className
    );
};

/**
 * 获取 TagClose 样式
 */
export const getTagCloseStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// 搜索输入框容器
// ============================================

/**
 * 获取 SearchWrapper 类名
 */
export const getSearchWrapperClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'zjpcy-treeselect-selection__search',
        className
    );
};

/**
 * 获取 SearchWrapper 样式
 */
export const getSearchWrapperStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// 搜索输入框
// ============================================

/**
 * 获取 SearchInput 类名
 */
export const getSearchInputClassName = (options: {
    isDropdown?: boolean;
    className?: string;
}): string => {
    const { isDropdown, className } = options;
    return classNames(
        isDropdown
            ? 'zjpcy-treeselect-dropdown__search-input'
            : 'zjpcy-treeselect-selection__search-input',
        className
    );
};

/**
 * 获取 SearchInput 样式
 */
export const getSearchInputStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// 清除按钮
// ============================================

/**
 * 获取 ClearIcon 类名
 */
export const getClearIconClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'zjpcy-treeselect-selection__clear',
        className
    );
};

/**
 * 获取 ClearIcon 样式
 */
export const getClearIconStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// 下拉箭头
// ============================================

/**
 * 获取 ArrowIcon 类名
 */
export const getArrowIconClassName = (options: {
    open?: boolean;
    className?: string;
}): string => {
    const { open, className } = options;
    return classNames(
        'zjpcy-treeselect-selection__arrow',
        {
            'zjpcy-treeselect-selection__arrow-open': open,
        },
        className
    );
};

/**
 * 获取 ArrowIcon 样式
 */
export const getArrowIconStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// 下拉面板
// ============================================

/**
 * 获取 Dropdown 类名
 */
export const getDropdownClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'zjpcy-treeselect-dropdown',
        className
    );
};

/**
 * 获取 Dropdown 样式
 */
export const getDropdownStyle = (options: {
    width?: number | string;
    height?: number | string;
    customStyles?: TreeSelectStyles['dropdown'];
}): CSSProperties => {
    const { width, height, customStyles } = options;
    const sizeStyle: CSSProperties = {};
    if (width !== undefined) {
        sizeStyle.width = typeof width === 'number' ? `${width}px` : width;
    }
    if (height !== undefined) {
        sizeStyle.maxHeight = typeof height === 'number' ? `${height}px` : height;
    }
    return {
        ...sizeStyle,
        ...customStyles,
    };
};

// ============================================
// 下拉搜索框容器
// ============================================

/**
 * 获取 DropdownSearchWrapper 类名
 */
export const getDropdownSearchWrapperClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'zjpcy-treeselect-dropdown__search',
        className
    );
};

/**
 * 获取 DropdownSearchWrapper 样式
 */
export const getDropdownSearchWrapperStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// 下拉搜索输入框
// ============================================

/**
 * 获取 DropdownSearchInput 类名
 */
export const getDropdownSearchInputClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'zjpcy-treeselect-dropdown__search-input',
        className
    );
};

/**
 * 获取 DropdownSearchInput 样式
 */
export const getDropdownSearchInputStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// 下拉内容区域
// ============================================

/**
 * 获取 DropdownContent 类名
 */
export const getDropdownContentClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'zjpcy-treeselect-dropdown__content',
        className
    );
};

/**
 * 获取 DropdownContent 样式
 */
export const getDropdownContentStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// 空状态
// ============================================

/**
 * 获取 EmptyWrapper 类名
 */
export const getEmptyWrapperClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'zjpcy-treeselect-dropdown__empty',
        className
    );
};

/**
 * 获取 EmptyWrapper 样式
 */
export const getEmptyWrapperStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// 树节点包装器
// ============================================

/**
 * 获取 TreeNodeWrapper 类名
 */
export const getTreeNodeWrapperClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'zjpcy-treeselect-tree-node-wrapper',
        className
    );
};

/**
 * 获取 TreeNodeWrapper 样式
 */
export const getTreeNodeWrapperStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// 树节点
// ============================================

/**
 * 获取 TreeNode 类名
 */
export const getTreeNodeClassName = (options: {
    selected?: boolean;
    disabled?: boolean;
    className?: string;
}): string => {
    const { selected, disabled, className } = options;
    return classNames(
        'zjpcy-treeselect-tree-node',
        {
            'zjpcy-treeselect-tree-node-selected': selected,
            'zjpcy-treeselect-tree-node-disabled': disabled,
        },
        className
    );
};

/**
 * 获取 TreeNode 样式
 */
export const getTreeNodeStyle = (options: {
    level?: number;
    customStyles?: TreeSelectStyles['treeNode'];
}): CSSProperties => {
    const { level = 0, customStyles } = options;
    return {
        paddingLeft: `${level * 20 + 12}px`,
        ...customStyles,
    };
};

// ============================================
// 展开/折叠图标
// ============================================

/**
 * 获取 ExpandIcon 类名
 */
export const getExpandIconClassName = (options: {
    expanded?: boolean;
    hasChildren?: boolean;
    className?: string;
}): string => {
    const { expanded, hasChildren, className } = options;
    return classNames(
        'zjpcy-treeselect-tree-node__expand-icon',
        {
            'zjpcy-treeselect-tree-node__expand-icon-expanded': expanded,
            'zjpcy-treeselect-tree-node__expand-icon-no-children': !hasChildren,
        },
        className
    );
};

/**
 * 获取 ExpandIcon 样式
 */
export const getExpandIconStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// 复选框
// ============================================

/**
 * 获取 Checkbox 类名
 */
export const getCheckboxClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'zjpcy-treeselect-tree-node__checkbox',
        className
    );
};

/**
 * 获取 Checkbox 样式
 */
export const getCheckboxStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// 复选框内部
// ============================================

/**
 * 获取 CheckboxInner 类名
 */
export const getCheckboxInnerClassName = (options: {
    checked?: boolean;
    className?: string;
}): string => {
    const { checked, className } = options;
    return classNames(
        'zjpcy-treeselect-tree-node__checkbox-inner',
        {
            'zjpcy-treeselect-tree-node__checkbox-inner-checked': checked,
        },
        className
    );
};

/**
 * 获取 CheckboxInner 样式
 */
export const getCheckboxInnerStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// 节点标题
// ============================================

/**
 * 获取 NodeTitle 类名
 */
export const getNodeTitleClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'zjpcy-treeselect-tree-node__title',
        className
    );
};

/**
 * 获取 NodeTitle 样式
 */
export const getNodeTitleStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// 子节点容器
// ============================================

/**
 * 获取 TreeNodeChildren 类名
 */
export const getTreeNodeChildrenClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'zjpcy-treeselect-tree-node-children',
        className
    );
};

/**
 * 获取 TreeNodeChildren 样式
 */
export const getTreeNodeChildrenStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};
