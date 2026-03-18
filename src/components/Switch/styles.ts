import classNames from 'classnames';
import type { CSSProperties } from 'react';
import { SwitchStyles } from './types';

// ============================================
// Switch 外层容器
// ============================================

/**
 * 获取 Wrapper 类名
 */
export const getWrapperClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'switch-wrapper',
        className
    );
};

/**
 * 获取 Wrapper 样式
 */
export const getWrapperStyle = (options: {
    style?: CSSProperties;
    customStyles?: SwitchStyles['wrapper'];
}): CSSProperties => {
    const { style, customStyles } = options;
    return {
        display: 'inline-block',
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
        'switch-label-wrapper',
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
        display: 'flex',
        alignItems: 'center',
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
        'switch-label',
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
// Switch Track - 轨道
// ============================================

/**
 * 获取 Track 类名
 */
export const getTrackClassName = (options: {
    checked?: boolean;
    disabled?: boolean;
    loading?: boolean;
    className?: string;
}): string => {
    const { checked, disabled, loading, className } = options;
    return classNames(
        'switch-track',
        {
            'switch-track-checked': checked && !disabled,
            'switch-track-disabled': disabled && !checked,
            'switch-track-disabled-checked': disabled && checked,
            'switch-track-loading': loading,
        },
        className
    );
};

/**
 * 获取 Track 样式
 */
export const getTrackStyle = (options: {
    size?: 'default' | 'small';
    width?: number;
    hasChildren?: boolean;
    disabled?: boolean;
    customStyles?: SwitchStyles['track'];
}): CSSProperties => {
    const { size = 'default', width, hasChildren, disabled, customStyles } = options;
    
    // 尺寸配置
    const sizeConfig = {
        default: {
            width: 44,
            height: 22,
        },
        small: {
            width: 28,
            height: 16,
        },
    };
    
    const config = sizeConfig[size];
    
    // 计算宽度
    const widthStyle = width !== undefined
        ? { width: `${width}px`, minWidth: `${width}px` }
        : { width: hasChildren ? 'auto' : `${config.width}px`, minWidth: `${config.width}px` };
    
    // 光标样式
    const cursorStyle = disabled ? { cursor: 'not-allowed' } : { cursor: 'pointer' };
    
    // 透明度
    const opacityStyle = disabled ? { opacity: 'var(--zjpcy-switch-disabled-opacity, 0.65)' } : {};
    
    // 处理自定义样式 - 将 backgroundColor 转换为 background 以覆盖 CSS 中的渐变
    const processedStyles: CSSProperties = { ...customStyles };
    if (customStyles?.backgroundColor) {
        (processedStyles as Record<string, unknown>).background = customStyles.backgroundColor;
        delete processedStyles.backgroundColor;
    }
    
    return {
        position: 'relative',
        borderRadius: 'var(--zjpcy-switch-track-radius, 12px)',
        boxSizing: 'border-box',
        overflow: 'hidden',
        height: `${config.height}px`,
        ...widthStyle,
        ...cursorStyle,
        ...opacityStyle,
        ...processedStyles,
    };
};

// ============================================
// Switch Thumb - 滑块
// ============================================

/**
 * 获取 Thumb 类名
 */
export const getThumbClassName = (options: {
    checked?: boolean;
    loading?: boolean;
    className?: string;
}): string => {
    const { checked, loading, className } = options;
    return classNames(
        'switch-thumb',
        {
            'switch-thumb-checked': checked,
            'switch-thumb-loading': loading,
        },
        className
    );
};

/**
 * 获取 Thumb 样式
 */
export const getThumbStyle = (options: {
    size?: 'default' | 'small';
    checked?: boolean;
    width?: number;
    customStyles?: SwitchStyles['thumb'];
}): CSSProperties => {
    const { size = 'default', checked, width, customStyles } = options;
    
    // 尺寸配置
    const thumbSize = size === 'small' ? 12 : 18;
    const defaultOffset = 2; // 默认边距
    
    let leftValue: string;
    
    if (width !== undefined) {
        // 自定义宽度时，动态计算 thumb 位置
        leftValue = checked ? `${width - thumbSize - defaultOffset}px` : `${defaultOffset}px`;
    } else if (size === 'small') {
        leftValue = checked ? '14px' : '2px';
    } else {
        leftValue = checked ? '24px' : '2px';
    }
    
    // 处理自定义样式 - 将 backgroundColor 转换为 background 以覆盖 CSS 中的渐变
    const processedStyles: CSSProperties = { ...customStyles };
    if (customStyles?.backgroundColor) {
        (processedStyles as Record<string, unknown>).background = customStyles.backgroundColor;
        delete processedStyles.backgroundColor;
    }
    
    return {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        borderRadius: 'var(--zjpcy-switch-thumb-radius, 50%)',
        width: `${thumbSize}px`,
        height: `${thumbSize}px`,
        left: leftValue,
        zIndex: 2,
        ...processedStyles,
    };
};

// ============================================
// Loading Icon - 加载图标
// ============================================

/**
 * 获取 LoadingIcon 类名
 */
export const getLoadingIconClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'switch-loading-icon',
        className
    );
};

/**
 * 获取 LoadingIcon 样式
 */
export const getLoadingIconStyle = (options: {
    size?: 'default' | 'small';
    checked?: boolean;
    width?: number;
    customStyles?: SwitchStyles['loading'];
}): CSSProperties => {
    const { size = 'default', checked, width, customStyles } = options;
    
    // 尺寸配置（与 Thumb 保持一致）
    const iconSize = 12; // loading icon 固定 12px
    const thumbSize = size === 'small' ? 12 : 18;
    const defaultOffset = 2; // 默认边距
    
    let leftValue: string;
    
    if (width !== undefined) {
        // 自定义宽度时，动态计算位置（与 Thumb 保持一致）
        const thumbLeft = checked ? width - thumbSize - defaultOffset : defaultOffset;
        const left = thumbLeft + (thumbSize - iconSize) / 2;
        leftValue = `${left}px`;
    } else if (size === 'small') {
        const thumbLeft = checked ? 14 : 2;
        const left = thumbLeft + (thumbSize - iconSize) / 2;
        leftValue = `${left}px`;
    } else {
        const thumbLeft = checked ? 24 : 2;
        const left = thumbLeft + (thumbSize - iconSize) / 2;
        leftValue = `${left}px`;
    }
    
    return {
        position: 'absolute',
        top: '50%',
        marginTop: '-6px',
        width: 'var(--zjpcy-switch-loading-size, 12px)',
        height: 'var(--zjpcy-switch-loading-size, 12px)',
        zIndex: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        left: leftValue,
        ...customStyles,
    };
};

// ============================================
// Checked Inner - 选中状态文字
// ============================================

/**
 * 获取 CheckedInner 类名
 */
export const getCheckedInnerClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'switch-checked-inner',
        className
    );
};

/**
 * 获取 CheckedInner 样式
 */
export const getCheckedInnerStyle = (options: {
    size?: 'default' | 'small';
    customStyles?: SwitchStyles['inner'];
}): CSSProperties => {
    const { size = 'default', customStyles } = options;
    
    return {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: size === 'small' ? '3px' : '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        fontSize: size === 'small' ? '9px' : '10px',
        color: '#fff',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        zIndex: 1,
        paddingRight: size === 'small' ? '14px' : '20px',
        fontWeight: 500,
        letterSpacing: '0.2px',
        ...customStyles,
    };
};

// ============================================
// Unchecked Inner - 非选中状态文字
// ============================================

/**
 * 获取 UncheckedInner 类名
 */
export const getUncheckedInnerClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames(
        'switch-unchecked-inner',
        className
    );
};

/**
 * 获取 UncheckedInner 样式
 */
export const getUncheckedInnerStyle = (options: {
    size?: 'default' | 'small';
    customStyles?: SwitchStyles['inner'];
}): CSSProperties => {
    const { size = 'default', customStyles } = options;
    
    return {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: size === 'small' ? '3px' : '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        fontSize: size === 'small' ? '9px' : '10px',
        color: 'var(--zjpcy-text-color-secondary, rgba(0, 0, 0, 0.65))',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        zIndex: 1,
        paddingLeft: size === 'small' ? '14px' : '20px',
        fontWeight: 500,
        letterSpacing: '0.2px',
        ...customStyles,
    };
};
