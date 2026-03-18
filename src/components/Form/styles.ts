import classNames from 'classnames';

/**
 * 获取表单容器类名
 */
export const getFormWrapperClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames('zjpcy-form-wrapper', className);
};

/**
 * 获取表单容器样式
 */
export const getFormWrapperStyle = (options: {
    style?: React.CSSProperties;
    customStyles?: Record<string, any>;
}): React.CSSProperties => {
    const { style, customStyles } = options;
    return {
        ...style,
        ...customStyles,
    };
};

/**
 * 获取表单项包装器类名
 */
export const getFormItemWrapperClassName = (options: {
    layout: 'horizontal' | 'vertical' | 'inline';
    className?: string;
}): string => {
    const { layout, className } = options;
    return classNames('zjpcy-form-item', `zjpcy-form-item--${layout}`, className);
};

/**
 * 获取表单项包装器样式
 */
export const getFormItemWrapperStyle = (options: {
    style?: React.CSSProperties;
    customStyles?: Record<string, any>;
}): React.CSSProperties => {
    const { style, customStyles } = options;
    return {
        ...style,
        ...customStyles,
    };
};

/**
 * 获取表单标签类名
 */
export const getFormLabelClassName = (options: {
    required?: boolean;
    className?: string;
}): string => {
    const { required, className } = options;
    return classNames('zjpcy-form-label', {
        'zjpcy-form-label--required': required,
    }, className);
};

/**
 * 获取表单标签样式
 */
export const getFormLabelStyle = (options: {
    labelAlign?: 'start' | 'center' | 'end';
    labelWidth?: number;
    style?: React.CSSProperties;
    customStyles?: Record<string, any>;
}): React.CSSProperties => {
    const { labelAlign, labelWidth, style, customStyles } = options;
    return {
        textAlign: labelAlign || 'end',
        ...(labelWidth !== undefined ? { width: `${labelWidth}%` } : {}),
        ...style,
        ...customStyles,
    };
};

/**
 * 获取表单控件容器类名
 */
export const getFormControlClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames('zjpcy-form-control', className);
};

/**
 * 获取表单控件容器样式
 */
export const getFormControlStyle = (options: {
    controlWidth?: number;
    style?: React.CSSProperties;
    customStyles?: Record<string, any>;
}): React.CSSProperties => {
    const { controlWidth, style, customStyles } = options;
    return {
        ...(controlWidth !== undefined ? { width: `${controlWidth}%` } : {}),
        ...style,
        ...customStyles,
    };
};

/**
 * 获取表单错误提示类名
 */
export const getFormErrorClassName = (options: {
    visible?: boolean;
    className?: string;
}): string => {
    const { visible, className } = options;
    return classNames('zjpcy-form-error', {
        'zjpcy-form-error--visible': visible,
    }, className);
};

/**
 * 获取表单错误提示样式
 */
export const getFormErrorStyle = (options: {
    style?: React.CSSProperties;
    customStyles?: Record<string, any>;
}): React.CSSProperties => {
    const { style, customStyles } = options;
    return {
        ...style,
        ...customStyles,
    };
};

/**
 * 获取表单帮助信息类名
 */
export const getFormHelpClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames('zjpcy-form-help', className);
};

/**
 * 获取表单帮助信息样式
 */
export const getFormHelpStyle = (options: {
    style?: React.CSSProperties;
    customStyles?: Record<string, any>;
}): React.CSSProperties => {
    const { style, customStyles } = options;
    return {
        ...style,
        ...customStyles,
    };
};
