import React from 'react';

export interface SpaceProps {
    /**
     * 子元素
     */
    children?: React.ReactNode;
    /**
     * 间距大小，可以是数字（px）或字符串
     */
    gap?: number | string;
    /**
     * 水平对齐方式
     */
    align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
    /**
     * 包裹方式
     */
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    /**
     * 类名
     */
    className?: string;
    /**
     * 样式
     */
    style?: React.CSSProperties;
    /**
     * 是否为内联元素
     */
    /**
     * 渲染的元素类型，默认为 'div'，在 p 标签内使用时建议设置为 'span'
     */
    as?: 'div' | 'span';
    inline?: boolean;
}