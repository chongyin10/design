import classNames from 'classnames';

/**
 * 获取 Label 类名
 */
export const getLabelClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames('zjpcy-label', 'label-wrapper', className);
};

/**
 * 获取 Label 样式
 */
export const getLabelStyle = (options: {
    indicatorColor?: string;
    indicatorWidth?: string | number;
    indicatorHeight?: string | number;
    paddingRight?: string | number;
    style?: React.CSSProperties;
}): React.CSSProperties => {
    const { indicatorColor, indicatorWidth, indicatorHeight, paddingRight, style } = options;

    // 将数值转换为带 px 单位的字符串
    const formatValue = (value: string | number | undefined): string => {
        if (value === undefined) return '';
        return typeof value === 'number' ? `${value}px` : value;
    };

    const cssVariableStyle: React.CSSProperties = {
        '--label-indicator-color': indicatorColor,
        '--label-indicator-width': formatValue(indicatorWidth),
        '--label-indicator-height': formatValue(indicatorHeight),
        '--label-padding-right': formatValue(paddingRight),
    } as React.CSSProperties;

    return {
        ...cssVariableStyle,
        ...style,
    };
};
