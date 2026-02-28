import { ReactNode } from 'react';

export type ProgressType = 'line' | 'circle' | 'dashboard';
export type ProgressStatus = 'success' | 'exception' | 'active' | 'normal';

/** 渐变色配置 */
export interface GradientConfig {
    from: string;
    to: string;
    direction?: 'to right' | 'to left' | 'to top' | 'to bottom' | 'to bottom right' | 'to top right' | 'to bottom left' | 'to top left';
    /** 是否启用波浪动画 */
    animated?: boolean;
}

/** 进度段配置 - 用于多段颜色展示 */
export interface ProgressSegment {
    /** 该段的颜色 */
    color: string | GradientConfig;
    /** 该段占总的百分比（0-100） */
    percent: number;
}

export interface ProgressProps {
    /** 百分比 */
    percent?: number;
    /** 类型 */
    type?: ProgressType;
    /** 状态 */
    status?: ProgressStatus;
    /** 是否显示百分比文字 */
    showInfo?: boolean;
    /** 自定义显示文字 */
    format?: (percent?: number, successPercent?: number) => ReactNode;
    /** 进度条颜色，支持纯色字符串或渐变对象 */
    strokeColor?: string | GradientConfig;
    /** 背景颜色 */
    trailColor?: string;
    /** 线条粗细 */
    strokeWidth?: number;
    /** 线条宽度，type=line 时生效 */
    size?: 'small' | 'default' | 'large';
    /** 是否开启动画 */
    transition?: boolean;
    /** 步骤进度条的总步数 */
    steps?: number;
    /** 多段颜色配置，用于展示多个进度段 */
    segments?: ProgressSegment[];
    /** 是否开启仪表盘样式 */
    gapDegree?: number;
    /** 仪表盘缺口位置 */
    gapPosition?: 'top' | 'bottom' | 'left' | 'right';
    /** 前缀图标 */
    icon?: ReactNode;
    /** 前缀文字 */
    prefix?: string;
    /** 后缀文字 */
    suffix?: string;
    /** 自定义内部内容，支持 ReactNode，优先级高于默认的进度显示 */
    children?: ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export default ProgressProps;
