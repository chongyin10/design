import classNames from 'classnames';

// ============================================
// Layout 容器
// ============================================

/**
 * 获取 Layout 类名
 */
export const getLayoutClassName = (options: {
    hasSider?: boolean;
    theme?: 'light' | 'dark';
    mounted?: boolean;
    className?: string;
}): string => {
    const { hasSider, theme, mounted, className } = options;
    return classNames(
        'zjpcy-layout',
        `zjpcy-layout--${theme || 'light'}`,
        {
            'zjpcy-layout--has-sider': hasSider,
            'layout-mounted': mounted,
        },
        'layout-wrapper',
        className
    );
};

/**
 * 获取 Layout 样式
 */
export const getLayoutStyle = (options: {
    style?: React.CSSProperties;
}): React.CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// Layout.Header
// ============================================

/**
 * 获取 Header 类名
 */
export const getHeaderClassName = (options: {
    fixed?: boolean;
    theme?: 'light' | 'dark';
    className?: string;
}): string => {
    const { fixed, theme, className } = options;
    return classNames(
        'zjpcy-layout-header',
        `zjpcy-layout-header--${theme || 'light'}`,
        {
            'zjpcy-layout-header--fixed': fixed,
        },
        'layout-header',
        `layout-header-${theme || 'light'}`,
        className
    );
};

/**
 * 获取 Header 样式
 */
export const getHeaderStyle = (options: {
    height?: string | number;
    style?: React.CSSProperties;
}): React.CSSProperties => {
    const { height, style } = options;
    return {
        height: typeof height === 'number' ? `${height}px` : height || 'var(--layout-header-height, 64px)',
        ...style,
    };
};

// ============================================
// Layout.Sider
// ============================================

/**
 * 获取 Sider 类名
 */
export const getSiderClassName = (options: {
    fixed?: boolean;
    theme?: 'light' | 'dark';
    collapsed?: boolean;
    className?: string;
}): string => {
    const { fixed, theme, collapsed, className } = options;
    return classNames(
        'zjpcy-layout-sider',
        `zjpcy-layout-sider--${theme || 'light'}`,
        {
            'zjpcy-layout-sider--fixed': fixed,
            'collapsed': collapsed,
        },
        'layout-sider',
        `layout-sider-${theme || 'light'}`,
        className
    );
};

/**
 * 获取 Sider 样式
 */
export const getSiderStyle = (options: {
    width?: string | number;
    collapsedWidth?: number;
    collapsed?: boolean;
    style?: React.CSSProperties;
}): React.CSSProperties => {
    const { width, collapsedWidth, collapsed, style } = options;
    const widthValue = typeof width === 'number' ? `${width}px` : width || 'var(--layout-sider-width, 200px)';
    const collapsedWidthValue = collapsedWidth !== undefined ? `${collapsedWidth}px` : 'var(--layout-sider-collapsed-width, 60px)';
    const finalWidth = collapsed ? collapsedWidthValue : widthValue;

    return {
        width: finalWidth,
        minWidth: finalWidth,
        maxWidth: finalWidth,
        flex: `0 0 ${finalWidth}`,
        ...style,
    };
};

// ============================================
// Sider 内容包装器
// ============================================

/**
 * 获取 SiderContent 类名
 */
export const getSiderContentClassName = (options: {
    collapsed?: boolean;
    className?: string;
}): string => {
    const { collapsed, className } = options;
    return classNames(
        'zjpcy-layout-sider-content',
        {
            'zjpcy-layout-sider-content--collapsed': collapsed,
        },
        className
    );
};

/**
 * 获取 SiderContent 样式
 */
export const getSiderContentStyle = (options: {
    style?: React.CSSProperties;
}): React.CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// Sider 收缩触发器
// ============================================

/**
 * 获取 SiderTrigger 类名
 */
export const getSiderTriggerClassName = (options: {
    collapsed?: boolean;
    placement?: 'top' | 'bottom';
    zeroWidthMode?: boolean;
    theme?: 'light' | 'dark';
    className?: string;
}): string => {
    const { collapsed, placement, zeroWidthMode, theme, className } = options;
    return classNames(
        'zjpcy-layout-sider-trigger',
        `zjpcy-layout-sider-trigger--${theme || 'light'}`,
        `zjpcy-layout-sider-trigger--${placement || 'bottom'}`,
        {
            'zjpcy-layout-sider-trigger--hidden': zeroWidthMode && collapsed,
        },
        'layout-sider-trigger',
        className
    );
};

/**
 * 获取 SiderTrigger 样式
 */
export const getSiderTriggerStyle = (options: {
    style?: React.CSSProperties;
}): React.CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// 零宽度模式下，在 Content 内显示的展开按钮
// ============================================

/**
 * 获取 ZeroWidthTrigger 类名
 */
export const getZeroWidthTriggerClassName = (options: {
    className?: string;
}): string => {
    const { className } = options;
    return classNames('zjpcy-layout-zero-width-trigger', className);
};

/**
 * 获取 ZeroWidthTrigger 样式
 */
export const getZeroWidthTriggerStyle = (options: {
    style?: React.CSSProperties;
}): React.CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// Layout 内部包装器
// ============================================

/**
 * 获取 LayoutInner 类名
 */
export const getLayoutInnerClassName = (options: {
    hasSider?: boolean;
    className?: string;
}): string => {
    const { hasSider, className } = options;
    return classNames(
        'zjpcy-layout-inner',
        {
            'zjpcy-layout-inner--has-sider': hasSider,
        },
        className
    );
};

/**
 * 获取 LayoutInner 样式
 */
export const getLayoutInnerStyle = (options: {
    style?: React.CSSProperties;
}): React.CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// Layout.Content
// ============================================

/**
 * 获取 Content 类名
 */
export const getContentClassName = (options: {
    fixed?: boolean;
    theme?: 'light' | 'dark';
    className?: string;
}): string => {
    const { fixed, theme, className } = options;
    return classNames(
        'zjpcy-layout-content',
        {
            'zjpcy-layout-content--fixed': fixed,
        },
        `zjpcy-layout-content--${theme || 'light'}`,
        'layout-content',
        `layout-content-${theme || 'light'}`,
        className
    );
};

/**
 * 获取 Content 样式
 */
export const getContentStyle = (options: {
    style?: React.CSSProperties;
}): React.CSSProperties => {
    const { style } = options;
    return {
        ...style,
    };
};

// ============================================
// Layout.Footer
// ============================================

/**
 * 获取 Footer 类名
 */
export const getFooterClassName = (options: {
    fixed?: boolean;
    theme?: 'light' | 'dark';
    className?: string;
}): string => {
    const { fixed, theme, className } = options;
    return classNames(
        'zjpcy-layout-footer',
        `zjpcy-layout-footer--${theme || 'light'}`,
        {
            'zjpcy-layout-footer--fixed': fixed,
        },
        'layout-footer',
        `layout-footer-${theme || 'light'}`,
        className
    );
};

/**
 * 获取 Footer 样式
 */
export const getFooterStyle = (options: {
    height?: string | number;
    style?: React.CSSProperties;
}): React.CSSProperties => {
    const { height, style } = options;
    return {
        height: typeof height === 'number' ? `${height}px` : height || 'var(--layout-footer-height, 48px)',
        ...style,
    };
};
