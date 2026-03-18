import classNames from 'classnames';

/**
 * 获取日期选择器容器样式
 */
export const getDatePickerContainerStyle = (options: {
    width?: string | number;
    minWidth?: string | number;
}): React.CSSProperties => {
    const { width, minWidth } = options;
    return {
        width: typeof width === 'number' ? `${width}px` : width || 'auto',
        minWidth: minWidth ? (typeof minWidth === 'number' ? `${minWidth}px` : minWidth) : undefined,
    };
};

/**
 * 获取触发器类名
 */
export const getDatePickerTriggerClassName = (options: {
    focused?: boolean;
    disabled?: boolean;
    size?: string;
}): string => {
    const { focused, disabled, size } = options;
    return classNames('zjpcy-datepicker-trigger', `zjpcy-datepicker-trigger--${size || 'middle'}`, {
        'zjpcy-datepicker-trigger--focused': focused,
        'zjpcy-datepicker-trigger--disabled': disabled,
    });
};

/**
 * 获取触发器内联样式（动态高度和padding）
 */
export const getDatePickerTriggerStyle = (options: {
    size?: string;
}): React.CSSProperties => {
    const { size } = options;

    let minHeight: string;
    let padding: string;

    switch (size) {
        case 'small':
            minHeight = '24px';
            padding = '1px 12px';
            break;
        case 'large':
            minHeight = '40px';
            padding = '3px 12px';
            break;
        default:
            minHeight = '34px';
            padding = '2px 12px';
    }

    return {
        minHeight,
        padding,
    };
};

/**
 * 获取日期显示值类名
 */
export const getDatePickerValueClassName = (options: {
    isPlaceholder?: boolean;
    disabled?: boolean;
    isTags?: boolean;
}): string => {
    const { isPlaceholder, disabled, isTags } = options;
    return classNames('zjpcy-datepicker-value', {
        'zjpcy-datepicker-value--placeholder': isPlaceholder,
        'zjpcy-datepicker-value--disabled': disabled,
        'zjpcy-datepicker-value--tags': isTags,
    });
};

/**
 * 获取下拉面板内联样式
 */
export const getDatePickerDropdownStyle = (options: {
    top?: number;
    left?: number;
    minWidth?: number;
}): React.CSSProperties => {
    const { top, left, minWidth } = options;
    return {
        position: 'absolute',
        top: top !== undefined ? `${top}px` : undefined,
        left: left !== undefined ? `${left}px` : undefined,
        minWidth: minWidth ? `${minWidth}px` : '280px',
    };
};

/**
 * 获取日期单元格类名
 */
export const getDateCellClassName = (options: {
    isSelected?: boolean;
    isInSelectedSet?: boolean;
    isToday?: boolean;
    disabled?: boolean;
    isCurrentMonth?: boolean;
}): string => {
    const { isSelected, isInSelectedSet, isToday, disabled, isCurrentMonth } = options;
    return classNames('zjpcy-datepicker-date-cell', {
        'zjpcy-datepicker-date-cell--selected': isSelected,
        'zjpcy-datepicker-date-cell--in-selected-set': isInSelectedSet,
        'zjpcy-datepicker-date-cell--today': isToday && !isSelected,
        'zjpcy-datepicker-date-cell--disabled': disabled,
        'zjpcy-datepicker-date-cell--other-month': !isCurrentMonth,
    });
};

/**
 * 获取底部按钮类名
 */
export const getFooterButtonClassName = (options: {
    variant?: 'primary' | 'default';
}): string => {
    const { variant } = options;
    return classNames('zjpcy-datepicker-btn', {
        'zjpcy-datepicker-btn--primary': variant === 'primary',
    });
};

/**
 * 获取年份单元格类名
 */
export const getYearCellClassName = (options: {
    isSelected?: boolean;
    isInSelectedSet?: boolean;
    isCurrentYear?: boolean;
}): string => {
    const { isSelected, isInSelectedSet, isCurrentYear } = options;
    return classNames('zjpcy-datepicker-year-cell', {
        'zjpcy-datepicker-year-cell--selected': isSelected,
        'zjpcy-datepicker-year-cell--in-selected-set': isInSelectedSet,
        'zjpcy-datepicker-year-cell--current': isCurrentYear,
    });
};

/**
 * 获取月份单元格类名
 */
export const getMonthCellClassName = (options: {
    isSelected?: boolean;
    isInSelectedSet?: boolean;
    isCurrentMonth?: boolean;
}): string => {
    const { isSelected, isInSelectedSet, isCurrentMonth } = options;
    return classNames('zjpcy-datepicker-month-cell', {
        'zjpcy-datepicker-month-cell--selected': isSelected,
        'zjpcy-datepicker-month-cell--in-selected-set': isInSelectedSet,
        'zjpcy-datepicker-month-cell--current': isCurrentMonth,
    });
};

/**
 * 获取季度单元格类名
 */
export const getQuarterCellClassName = (options: {
    isSelected?: boolean;
    isInSelectedSet?: boolean;
    isCurrentQuarter?: boolean;
}): string => {
    const { isSelected, isInSelectedSet, isCurrentQuarter } = options;
    return classNames('zjpcy-datepicker-quarter-cell', {
        'zjpcy-datepicker-quarter-cell--selected': isSelected,
        'zjpcy-datepicker-quarter-cell--in-selected-set': isInSelectedSet,
        'zjpcy-datepicker-quarter-cell--current': isCurrentQuarter,
    });
};

/**
 * 获取标签容器内联样式
 */
export const getLabelContainerStyle = (options: {
    gap?: string | number;
}): React.CSSProperties => {
    const { gap } = options;
    return {
        display: 'flex',
        alignItems: 'center',
        gap: typeof gap === 'number' ? `${gap}px` : gap || '8px',
    };
};

/**
 * 获取范围选择器容器样式
 */
export const getDateRangePickerContainerStyle = (options: {
    width?: string | number;
}): React.CSSProperties => {
    const { width } = options;
    return {
        width: typeof width === 'number' ? `${width}px` : width || 'auto',
    };
};

/**
 * 获取范围选择器触发器类名
 */
export const getDateRangePickerTriggerClassName = (options: {
    focused?: boolean;
    disabled?: boolean;
    size?: string;
}): string => {
    const { focused, disabled, size } = options;
    return classNames('zjpcy-datepicker-range-picker-trigger', `zjpcy-datepicker-range-picker-trigger--${size || 'middle'}`, {
        'zjpcy-datepicker-range-picker-trigger--focused': focused,
        'zjpcy-datepicker-range-picker-trigger--disabled': disabled,
    });
};

/**
 * 获取范围选择器触发器内联样式（动态高度和padding）
 */
export const getDateRangePickerTriggerStyle = (options: {
    size?: string;
}): React.CSSProperties => {
    const { size } = options;

    let minHeight: string;
    let padding: string;

    switch (size) {
        case 'small':
            minHeight = '24px';
            padding = '1px 12px';
            break;
        case 'large':
            minHeight = '40px';
            padding = '3px 12px';
            break;
        default:
            minHeight = '32px';
            padding = '2px 12px';
    }

    return {
        minHeight,
        padding,
    };
};

/**
 * 获取范围选择器输入框类名
 */
export const getDateRangePickerInputClassName = (options: {
    active?: boolean;
}): string => {
    const { active } = options;
    return classNames('zjpcy-datepicker-range-picker-input', {
        'zjpcy-datepicker-range-picker-input--active': active,
    });
};

/**
 * 获取范围选择器值显示类名
 */
export const getDateRangePickerValueClassName = (options: {
    isPlaceholder?: boolean;
}): string => {
    const { isPlaceholder } = options;
    return classNames('zjpcy-datepicker-range-picker-value', {
        'zjpcy-datepicker-range-picker-value--placeholder': isPlaceholder,
    });
};

/**
 * 获取范围选择器下拉面板内联样式
 */
export const getDateRangePickerDropdownStyle = (options: {
    top?: number;
    left?: number;
    minWidth?: number;
}): React.CSSProperties => {
    const { top, left, minWidth } = options;
    return {
        position: 'absolute',
        top: top !== undefined ? `${top}px` : undefined,
        left: left !== undefined ? `${left}px` : undefined,
        minWidth: minWidth ? `${minWidth}px` : '560px',
    };
};

/**
 * 获取范围选择器底部按钮类名
 */
export const getDateRangePickerFooterButtonClassName = (options: {
    variant?: 'primary' | 'default';
}): string => {
    const { variant } = options;
    return classNames('zjpcy-datepicker-range-btn', {
        'zjpcy-datepicker-range-btn--primary': variant === 'primary',
    });
};

/**
 * 获取范围选择器标签容器样式
 */
export const getDateRangePickerLabelContainerStyle = (options: {
    gap?: string | number;
}): React.CSSProperties => {
    const { gap } = options;
    return {
        display: 'flex',
        alignItems: 'center',
        gap: typeof gap === 'number' ? `${gap}px` : gap || '8px',
    };
};

/**
 * 获取范围选择器日期单元格类名
 */
export const getDateRangePickerDateCellClassName = (options: {
    isSelected?: boolean;
    isToday?: boolean;
    isCurrentMonth?: boolean;
    isInRange?: boolean;
    isRangeStart?: boolean;
    isRangeEnd?: boolean;
    disabled?: boolean;
}): string => {
    const { isSelected, isToday, isCurrentMonth, isInRange, isRangeStart, isRangeEnd, disabled } = options;
    return classNames('zjpcy-datepicker-range-date-cell', {
        'zjpcy-datepicker-range-date-cell--selected': isSelected,
        'zjpcy-datepicker-range-date-cell--today': isToday && !isSelected && !isInRange,
        'zjpcy-datepicker-range-date-cell--disabled': disabled,
        'zjpcy-datepicker-range-date-cell--other-month': !isCurrentMonth,
        'zjpcy-datepicker-range-date-cell--in-range': isInRange && !isRangeStart && !isRangeEnd,
        'zjpcy-datepicker-range-date-cell--range-start': isRangeStart,
        'zjpcy-datepicker-range-date-cell--range-end': isRangeEnd,
    });
};

/**
 * 通用样式类型导出
 */
export type SizeType = 'small' | 'middle' | 'large';
export type ButtonVariant = 'primary' | 'default';
