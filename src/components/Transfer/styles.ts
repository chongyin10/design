import classNames from 'classnames';
import type { CSSProperties } from 'react';

// ============================================
// Transfer 外层容器
// ============================================

/**
 * 获取 Wrapper 类名
 */
export const getWrapperClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'transfer-wrapper',
        className
    );
};

/**
 * 获取 Wrapper 样式
 */
export const getWrapperStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// Transfer 列表容器
// ============================================

/**
 * 获取 ListContainer 类名
 */
export const getListContainerClassName = (options: {
    disabled?: boolean;
    className?: string;
}): string => {
    const { disabled, className } = options;
    return classNames(
        'transfer-list',
        {
            'transfer-list-disabled': disabled,
        },
        className
    );
};

/**
 * 获取 ListContainer 样式
 */
export const getListContainerStyle = (options: {
    height?: number | string;
    width?: number | string;
    style?: CSSProperties;
}): CSSProperties => {
    const { height, width, style } = options;
    const heightValue = typeof height === 'number' ? `${height}px` : height;
    const widthValue = typeof width === 'number' ? `${width}px` : width;
    return {
        height: heightValue,
        width: widthValue,
        ...style,
    };
};

// ============================================
// Transfer 列表头部
// ============================================

/**
 * 获取 ListHeader 类名
 */
export const getListHeaderClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'transfer-list-header',
        className
    );
};

/**
 * 获取 ListHeader 样式
 */
export const getListHeaderStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// Transfer 头部左侧
// ============================================

/**
 * 获取 HeaderLeft 类名
 */
export const getHeaderLeftClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'transfer-header-left',
        className
    );
};

/**
 * 获取 HeaderLeft 样式
 */
export const getHeaderLeftStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// Transfer 头部计数
// ============================================

/**
 * 获取 HeaderCount 类名
 */
export const getHeaderCountClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'transfer-header-count',
        className
    );
};

/**
 * 获取 HeaderCount 样式
 */
export const getHeaderCountStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// Transfer 搜索框容器
// ============================================

/**
 * 获取 SearchWrapper 类名
 */
export const getSearchWrapperClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'transfer-search-wrapper',
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
// Transfer 搜索框
// ============================================

/**
 * 获取 Search 类名
 */
export const getSearchClassName = (options: {
    disabled?: boolean;
    className?: string;
}): string => {
    const { disabled, className } = options;
    return classNames(
        'transfer-search',
        {
            'transfer-search-disabled': disabled,
        },
        className
    );
};

/**
 * 获取 Search 样式
 */
export const getSearchStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// Transfer 搜索按钮
// ============================================

/**
 * 获取 SearchButton 类名
 */
export const getSearchButtonClassName = (options: {
    disabled?: boolean;
    className?: string;
}): string => {
    const { disabled, className } = options;
    return classNames(
        'transfer-search-button',
        {
            'transfer-search-button-disabled': disabled,
        },
        className
    );
};

/**
 * 获取 SearchButton 样式
 */
export const getSearchButtonStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// Transfer 列表内容区
// ============================================

/**
 * 获取 ListBody 类名
 */
export const getListBodyClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'transfer-list-body',
        className
    );
};

/**
 * 获取 ListBody 样式
 */
export const getListBodyStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// Transfer 列表项
// ============================================

/**
 * 获取 ListItem 类名
 */
export const getListItemClassName = (options: {
    selected?: boolean;
    disabled?: boolean;
    className?: string;
}): string => {
    const { selected, disabled, className } = options;
    return classNames(
        'transfer-list-item',
        {
            'transfer-list-item-selected': selected,
            'transfer-list-item-disabled': disabled,
        },
        className
    );
};

/**
 * 获取 ListItem 样式
 */
export const getListItemStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// Transfer 列表项复选框（带半选状态）
// ============================================

/**
 * 获取 ItemCheckbox 类名
 */
export const getItemCheckboxClassName = (options: {
    checked?: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
    className?: string;
}): string => {
    const { checked, indeterminate, disabled, className } = options;
    return classNames(
        'transfer-item-checkbox',
        {
            'transfer-item-checkbox-checked': checked,
            'transfer-item-checkbox-indeterminate': indeterminate,
            'transfer-item-checkbox-disabled': disabled,
        },
        className
    );
};

/**
 * 获取 ItemCheckbox 样式
 */
export const getItemCheckboxStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// Transfer 列表项复选框（普通项）
// ============================================

/**
 * 获取 ListItemCheckbox 类名
 */
export const getListItemCheckboxClassName = (options: {
    checked?: boolean;
    disabled?: boolean;
    className?: string;
}): string => {
    const { checked, disabled, className } = options;
    return classNames(
        'transfer-list-item-checkbox',
        {
            'transfer-list-item-checkbox-checked': checked,
            'transfer-list-item-checkbox-disabled': disabled,
        },
        className
    );
};

/**
 * 获取 ListItemCheckbox 样式
 */
export const getListItemCheckboxStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// Transfer 列表项内容
// ============================================

/**
 * 获取 ItemContent 类名
 */
export const getItemContentClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'transfer-item-content',
        className
    );
};

/**
 * 获取 ItemContent 样式
 */
export const getItemContentStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// Transfer 列表底部
// ============================================

/**
 * 获取 ListFooter 类名
 */
export const getListFooterClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'transfer-list-footer',
        className
    );
};

/**
 * 获取 ListFooter 样式
 */
export const getListFooterStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// Transfer 操作按钮区
// ============================================

/**
 * 获取 Operation 类名
 */
export const getOperationClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'transfer-operation',
        className
    );
};

/**
 * 获取 Operation 样式
 */
export const getOperationStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// Transfer 操作按钮
// ============================================

/**
 * 获取 OperationButton 类名
 */
export const getOperationButtonClassName = (options: {
    direction: 'right' | 'left';
    disabled?: boolean;
    className?: string;
}): string => {
    const { direction, disabled, className } = options;
    return classNames(
        'transfer-operation-button',
        `transfer-operation-button-${direction}`,
        {
            'transfer-operation-button-disabled': disabled,
        },
        className
    );
};

/**
 * 获取 OperationButton 样式
 */
export const getOperationButtonStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// Transfer 空状态
// ============================================

/**
 * 获取 Empty 类名
 */
export const getEmptyClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'transfer-empty',
        className
    );
};

/**
 * 获取 Empty 样式
 */
export const getEmptyStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// Transfer 加载状态容器
// ============================================

/**
 * 获取 Loading 类名
 */
export const getLoadingClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'transfer-loading',
        className
    );
};

/**
 * 获取 Loading 样式
 */
export const getLoadingStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// Transfer 加载动画
// ============================================

/**
 * 获取 LoadingSpinner 类名
 */
export const getLoadingSpinnerClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'transfer-loading-spinner',
        className
    );
};

/**
 * 获取 LoadingSpinner 样式
 */
export const getLoadingSpinnerStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};
