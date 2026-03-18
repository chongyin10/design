import classNames from 'classnames';
import type { CSSProperties } from 'react';
import { SelectStyles } from './types';

// ============================================
// Select 外层容器
// ============================================

/**
 * 获取 Wrapper 类名
 */
export const getWrapperClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'select-wrapper',
        className
    );
};

/**
 * 获取 Wrapper 样式
 */
export const getWrapperStyle = (options: {
    width?: string | number;
    style?: CSSProperties;
    customStyles?: SelectStyles['wrapper'];
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
// 标签容器
// ============================================

/**
 * 获取 LabelWrapper 类名
 */
export const getLabelWrapperClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'select-label-wrapper',
        className
    );
};

/**
 * 获取 LabelWrapper 样式
 */
export const getLabelWrapperStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
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
        'select-label',
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
// 选择器容器
// ============================================

/**
 * 获取 Selector 类名
 */
export const getSelectorClassName = (options: {
    size?: 'small' | 'default' | 'large';
    open?: boolean;
    disabled?: boolean;
    className?: string;
}): string => {
    const { size = 'default', open, disabled, className } = options;
    return classNames(
        'select-selector',
        `select-selector-${size}`,
        {
            'select-selector-open': open,
            'select-selector-disabled': disabled,
        },
        className
    );
};

/**
 * 获取 Selector 样式
 */
export const getSelectorStyle = (options: {
    customStyles?: SelectStyles['selector'];
}): CSSProperties => {
    const { customStyles } = options;
    return {
        ...customStyles,
    };
};

// ============================================
// 选择器内容区域
// ============================================

/**
 * 获取 SelectorContent 类名
 */
export const getSelectorContentClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'select-selector-content',
        className
    );
};

/**
 * 获取 SelectorContent 样式
 */
export const getSelectorContentStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// 占位符
// ============================================

/**
 * 获取 Placeholder 类名
 */
export const getPlaceholderClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'select-placeholder',
        className
    );
};

/**
 * 获取 Placeholder 样式
 */
export const getPlaceholderStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// 单选显示文本
// ============================================

/**
 * 获取 SingleValue 类名
 */
export const getSingleValueClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'select-single-value',
        className
    );
};

/**
 * 获取 SingleValue 样式
 */
export const getSingleValueStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// 多选标签容器
// ============================================

/**
 * 获取 TagsContainer 类名
 */
export const getTagsContainerClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'select-tags-container',
        className
    );
};

/**
 * 获取 TagsContainer 样式
 */
export const getTagsContainerStyle = (options: {
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
    disabled?: boolean;
    className?: string;
}): string => {
    const { disabled, className } = options;
    return classNames(
        'select-tag',
        {
            'select-tag-disabled': disabled,
        },
        className
    );
};

/**
 * 获取 Tag 样式
 */
export const getTagStyle = (options: {
    customStyles?: SelectStyles['tag'];
}): CSSProperties => {
    const { customStyles } = options;
    return {
        ...customStyles,
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
        'select-tag-close',
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
// 搜索输入框
// ============================================

/**
 * 获取 SearchInput 类名
 */
export const getSearchInputClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'select-search-input',
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
// 后缀区域
// ============================================

/**
 * 获取 SuffixArea 类名
 */
export const getSuffixAreaClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'select-suffix-area',
        className
    );
};

/**
 * 获取 SuffixArea 样式
 */
export const getSuffixAreaStyle = (options: {
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
 * 获取 ClearButton 类名
 */
export const getClearButtonClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'select-clear',
        className
    );
};

/**
 * 获取 ClearButton 样式
 */
export const getClearButtonStyle = (options: {
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
 * 获取 Arrow 类名
 */
export const getArrowClassName = (options: {
    open?: boolean;
    className?: string;
}): string => {
    const { open, className } = options;
    return classNames(
        'select-arrow',
        {
            'select-arrow-open': open,
        },
        className
    );
};

/**
 * 获取 Arrow 样式
 */
export const getArrowStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// 加载图标
// ============================================

/**
 * 获取 LoadingIcon 类名
 */
export const getLoadingIconClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'select-loading',
        className
    );
};

/**
 * 获取 LoadingIcon 样式
 */
export const getLoadingIconStyle = (options: {
    style?: CSSProperties;
}): CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// 下拉菜单容器
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
        'select-dropdown',
        {
            'select-dropdown-open': open,
        },
        className
    );
};

/**
 * 获取 Dropdown 样式
 */
export const getDropdownStyle = (options: {
    customStyles?: SelectStyles['dropdown'];
}): CSSProperties => {
    const { customStyles } = options;
    return {
        ...customStyles,
    };
};

// ============================================
// 选项列表容器
// ============================================

/**
 * 获取 OptionList 类名
 */
export const getOptionListClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'select-option-list',
        className
    );
};

/**
 * 获取 OptionList 样式
 */
export const getOptionListStyle = (options: {
    maxHeight?: number;
    style?: CSSProperties;
}): CSSProperties => {
    const { maxHeight, style } = options;
    const maxHeightStyle = maxHeight !== undefined
        ? { maxHeight: `${maxHeight}px` }
        : {};
    return {
        ...maxHeightStyle,
        ...style,
    };
};

// ============================================
// 选项项
// ============================================

/**
 * 获取 Option 类名
 */
export const getOptionClassName = (options: {
    selected?: boolean;
    active?: boolean;
    disabled?: boolean;
    className?: string;
}): string => {
    const { selected, active, disabled, className } = options;
    return classNames(
        'select-option',
        {
            'select-option-selected': selected,
            'select-option-active': active,
            'select-option-disabled': disabled,
        },
        className
    );
};

/**
 * 获取 Option 样式
 */
export const getOptionStyle = (options: {
    customStyles?: SelectStyles['option'];
}): CSSProperties => {
    const { customStyles } = options;
    return {
        ...customStyles,
    };
};

// ============================================
// 选项勾选图标
// ============================================

/**
 * 获取 CheckIcon 类名
 */
export const getCheckIconClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'select-check-icon',
        className
    );
};

/**
 * 获取 CheckIcon 样式
 */
export const getCheckIconStyle = (options: {
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
 * 获取 Empty 类名
 */
export const getEmptyClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'select-empty',
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
