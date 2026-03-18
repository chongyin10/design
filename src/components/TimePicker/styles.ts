import classNames from 'classnames';
import type { CSSProperties } from 'react';

// ============================================
// TimePicker 外层容器
// ============================================

/**
 * 获取 TimePicker 容器类名
 */
export const getContainerClassName = (options: {
    className?: string;
    hasLabel?: boolean;
}): string => {
    const { className, hasLabel } = options;
    return classNames(
        'time-picker',
        {
            'time-picker-with-label': hasLabel,
        },
        className
    );
};

/**
 * 获取 TimePicker 容器样式
 */
export const getContainerStyle = (options: {
    width?: string | number;
    style?: CSSProperties;
}): CSSProperties => {
    const { width, style } = options;
    const widthStyle = width !== undefined
        ? { width: typeof width === 'number' ? `${width}px` : width }
        : {};
    return {
        ...widthStyle,
        ...style,
    };
};

// ============================================
// 触发器
// ============================================

/**
 * 获取 Trigger 类名
 */
export const getTriggerClassName = (options: {
    size?: 'small' | 'middle' | 'large';
    focused?: boolean;
    disabled?: boolean;
    className?: string;
}): string => {
    const { size = 'middle', focused, disabled, className } = options;
    return classNames(
        'time-picker-trigger',
        `size-${size}`,
        {
            'is-focused': focused,
            'is-disabled': disabled,
        },
        className
    );
};

// ============================================
// 值显示
// ============================================

/**
 * 获取 Value 类名
 */
export const getValueClassName = (options: {
    isPlaceholder?: boolean;
    disabled?: boolean;
    className?: string;
}): string => {
    const { isPlaceholder, disabled, className } = options;
    return classNames(
        'time-picker-value',
        {
            'is-placeholder': isPlaceholder,
            'is-disabled': disabled,
        },
        className
    );
};

// ============================================
// 后缀区域
// ============================================

/**
 * 获取 Suffix 类名
 */
export const getSuffixClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'time-picker-suffix',
        className
    );
};

// ============================================
// 清除按钮
// ============================================

/**
 * 获取 Clear 类名
 */
export const getClearClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'time-picker-clear',
        className
    );
};

// ============================================
// 图标
// ============================================

/**
 * 获取 Icon 类名
 */
export const getIconClassName = (options: {
    open?: boolean;
    hasClear?: boolean;
    className?: string;
}): string => {
    const { open, hasClear, className } = options;
    return classNames(
        'time-picker-icon',
        {
            'is-open': open,
            'has-clear': hasClear,
        },
        className
    );
};

// ============================================
// 下拉菜单
// ============================================

/**
 * 获取 Dropdown 类名
 */
export const getDropdownClassName = (options: {
    open?: boolean;
    className?: string;
}): string => {
    const { open, className } = options;
    return classNames(
        'time-picker-dropdown',
        {
            'is-open': open,
        },
        className
    );
};

/**
 * 获取 Dropdown 样式
 */
export const getDropdownStyle = (options: {
    top?: number;
    left?: number;
    minWidth?: number;
    visible?: boolean;
    customStyles?: CSSProperties;
}): CSSProperties => {
    const { top, left, minWidth, visible = true, customStyles } = options;
    return {
        position: 'fixed',
        ...(top !== undefined && { top: `${top}px` }),
        ...(left !== undefined && { left: `${left}px` }),
        ...(minWidth !== undefined && { minWidth: `${minWidth}px` }),
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.15s ease',
        ...customStyles,
    };
};

// ============================================
// 面板
// ============================================

/**
 * 获取 Panel 类名
 */
export const getPanelClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'time-picker-panel',
        className
    );
};

/**
 * 获取 PanelContainer 类名
 */
export const getPanelContainerClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'time-picker-panel-container',
        className
    );
};

// ============================================
// 时间列
// ============================================

/**
 * 获取 Column 类名
 */
export const getColumnClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'time-picker-column',
        className
    );
};

/**
 * 获取 ColumnHeader 类名
 */
export const getColumnHeaderClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'time-picker-column-header',
        className
    );
};

/**
 * 获取 ColumnList 类名
 */
export const getColumnListClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'time-picker-column-list',
        className
    );
};

// ============================================
// 时间选项
// ============================================

/**
 * 获取 Option 类名
 */
export const getOptionClassName = (options: {
    selected?: boolean;
    disabled?: boolean;
    className?: string;
}): string => {
    const { selected, disabled, className } = options;
    return classNames(
        'time-picker-option',
        {
            'is-selected': selected,
            'is-disabled': disabled,
        },
        className
    );
};

// ============================================
// 标签
// ============================================

/**
 * 获取 Label 类名
 */
export const getLabelClassName = (options: {
    labelClassName?: string;
}): string => {
    const { labelClassName } = options;
    return classNames(
        'time-picker-label',
        labelClassName
    );
};

/**
 * 获取 Label 样式
 */
export const getLabelStyle = (options: {
    labelGap?: string | number;
    labelStyle?: CSSProperties;
}): CSSProperties => {
    const { labelGap, labelStyle } = options;
    const gapStyle = labelGap !== undefined
        ? { marginRight: typeof labelGap === 'number' ? `${labelGap}px` : labelGap }
        : {};
    return {
        ...gapStyle,
        ...labelStyle,
    };
};

// ============================================
// 底部按钮
// ============================================

/**
 * 获取 Footer 类名
 */
export const getFooterClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'time-picker-footer',
        className
    );
};

/**
 * 获取 NowButton 类名
 */
export const getNowButtonClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'time-picker-now-btn',
        className
    );
};

/**
 * 获取 OkButton 类名
 */
export const getOkButtonClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'time-picker-ok-btn',
        className
    );
};

// ============================================
// 范围选择器
// ============================================

/**
 * 获取 RangePicker 触发器类名
 */
export const getRangeTriggerClassName = (options: {
    size?: 'small' | 'middle' | 'large';
    focused?: boolean;
    disabled?: boolean;
    className?: string;
}): string => {
    const { size = 'middle', focused, disabled, className } = options;
    return classNames(
        'time-range-picker-trigger',
        `size-${size}`,
        {
            'is-focused': focused,
            'is-disabled': disabled,
        },
        className
    );
};

/**
 * 获取 RangePicker 容器类名
 */
export const getRangeContainerClassName = (options: {
    className?: string;
    hasLabel?: boolean;
}): string => {
    const { className, hasLabel } = options;
    return classNames(
        'time-range-picker',
        {
            'time-range-picker-with-label': hasLabel,
        },
        className
    );
};

/**
 * 获取 RangePicker 容器样式
 */
export const getRangeContainerStyle = (options: {
    width?: string | number;
    style?: CSSProperties;
}): CSSProperties => {
    const { width, style } = options;
    const widthStyle = width !== undefined
        ? { width: typeof width === 'number' ? `${width}px` : width }
        : {};
    return {
        ...widthStyle,
        ...style,
    };
};
