import { ReactNode } from 'react';

export type ProgressType = 'line' | 'circle' | 'dashboard';
export type ProgressStatus = 'success' | 'exception' | 'active' | 'normal';

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
    /** 成功进度条颜色 */
    strokeColor?: string;
    /** 背景颜色 */
    trailColor?: string;
    /** 线条粗细 */
    strokeWidth?: number;
    /** 线条宽度，type=line 时生效 */
    size?: 'small' | 'default' | 'large';
    /** 是否开启动画 */
    transition?: boolean;
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
    className?: string;
    style?: React.CSSProperties;
}

export default ProgressProps;
