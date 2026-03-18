import classNames from 'classnames';

/**
 * 获取网格容器类名
 */
export const getGridWrapperClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames('zjpcy-grid', className);
};

/**
 * 获取网格容器样式
 */
export const getGridWrapperStyle = (options: {
    width?: number | string;
    height?: number | string;
    gap?: number | string;
    padding?: number | string;
    backgroundColor?: string;
    style?: React.CSSProperties;
}): React.CSSProperties => {
    const { width, height, gap, padding, backgroundColor, style } = options;
    return {
        width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : '100%',
        height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : 'auto',
        gap: gap !== undefined ? (typeof gap === 'number' ? `${gap}px` : gap) : '0',
        padding: padding !== undefined ? (typeof padding === 'number' ? `${padding}px` : padding) : '0',
        backgroundColor: backgroundColor || 'transparent',
        boxSizing: 'border-box',
        ...style,
    };
};

/**
 * 获取行容器类名
 */
export const getRowWrapperClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames('zjpcy-grid-row', className);
};

/**
 * 获取行容器样式
 */
export const getRowWrapperStyle = (options: {
    span?: number;
    rowGap?: number | string;
    align?: string;
    justify?: string;
    wrap?: boolean;
    style?: React.CSSProperties;
}): React.CSSProperties => {
    const { span, rowGap, align, justify, wrap, style } = options;
    return {
        display: 'flex',
        width: span !== undefined ? `calc(${span} / 24 * 100%)` : '100%',
        rowGap: rowGap !== undefined ? (typeof rowGap === 'number' ? `${rowGap}px` : rowGap) : '0',
        alignItems: align || 'stretch',
        justifyContent: justify || 'flex-start',
        flexWrap: wrap !== false ? 'wrap' : 'nowrap',
        boxSizing: 'border-box',
        ...style,
    };
};

/**
 * 获取列容器类名
 */
export const getColWrapperClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames('zjpcy-grid-col', className);
};

/**
 * 获取列容器样式
 */
export const getColWrapperStyle = (options: {
    span?: number;
    offset?: number;
    push?: number;
    pull?: number;
    order?: number;
    gap?: number | string;
    style?: React.CSSProperties;
}): React.CSSProperties => {
    const { span, offset, push, pull, order, gap, style } = options;

    const marginLeft = pull !== undefined
        ? `calc(-${pull} / 24 * 100%)`
        : offset !== undefined
            ? `calc(${offset} / 24 * 100%)`
            : '0';

    return {
        flex: span !== undefined ? `0 0 calc(${span} / 24 * 100%)` : '1',
        maxWidth: span !== undefined ? `calc(${span} / 24 * 100%)` : '100%',
        marginLeft,
        marginRight: push !== undefined ? `calc(${push} / 24 * 100%)` : '0',
        order: order !== undefined ? order : 0,
        paddingLeft: gap !== undefined ? (typeof gap === 'number' ? `${gap / 2}px` : `calc(${gap} / 2)`) : '0',
        paddingRight: gap !== undefined ? (typeof gap === 'number' ? `${gap / 2}px` : `calc(${gap} / 2)`) : '0',
        boxSizing: 'border-box',
        ...style,
    };
};
