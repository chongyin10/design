import { ReactNode, CSSProperties } from 'react';

export type SpinSize = 'small' | 'default' | 'large';

export interface SpinProps {
    /**
     * 是否为加载状态
     * @default true
     */
    spinning?: boolean;
    /**
     * 加载指示符
     */
    indicator?: ReactNode;
    /**
     * 当作为包裹元素时，可以自定义描述文案
     */
    tip?: ReactNode;
    /**
     * 组件大小
     * @default 'default'
     */
    size?: SpinSize;
    /**
     * 延迟显示加载效果的时间（防止闪烁）
     * @default 0
     */
    delay?: number;
    /**
     * 自定义类名
     */
    className?: string;
    /**
     * 自定义样式
     */
    style?: CSSProperties;
    /**
     * 包裹的子元素
     */
    children?: ReactNode;
    /**
     * 是否全屏显示
     * @default false
     */
    fullscreen?: boolean;
}
