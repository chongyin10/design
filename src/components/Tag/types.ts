import React from 'react';

export type TagSize = 'small' | 'medium' | 'large';

export interface TagProps {
    /**
     * 标签内容
     */
    children?: React.ReactNode;
    /**
     * 自定义类名
     */
    className?: string;
    /**
     * 自定义样式
     */
    style?: React.CSSProperties;
    /**
     * 标签尺寸
     * @default 'medium'
     */
    size?: TagSize;
    /**
     * 自定义背景色
     */
    backgroundColor?: string;
    /**
     * 自定义字体颜色
     */
    color?: string;
    /**
     * 前缀图标，可以是 Icon 组件的 type 字符串或自定义 React 节点
     */
    icon?: string | React.ReactNode;
    /**
     * 是否可关闭
     * @default false
     */
    closable?: boolean;
    /**
     * 关闭时的回调
     */
    onClose?: (e: React.MouseEvent) => void;
    /**
     * 点击标签时的回调
     */
    onClick?: (e: React.MouseEvent) => void;
}
