import React from 'react';
import classNames from 'classnames';
import Icon from '../Icon';
import { ProgressProps, ProgressStatus, ProgressType, GradientConfig, ProgressSegment } from './types';
import './Progress.css';

const Progress: React.FC<ProgressProps> = ({
    percent = 0,
    type = 'line',
    status: customStatus,
    showInfo = true,
    format,
    strokeColor = '#1890ff',
    trailColor = 'gainsboro',
    strokeWidth,
    size = 'default',
    transition = true,
    steps,
    segments,
    icon,
    prefix,
    suffix,
    children,
    className,
    style
}) => {
    // 根据进度值自动判断状态
    const getAutoStatus = (): ProgressStatus => {
        if (percent >= 100) return 'success';
        if (percent < 0) return 'exception';
        return 'normal';
    };

    const status = customStatus || getAutoStatus();

    // 格式化显示文本
    const formatPercent = () => {
        if (format) {
            return format(percent);
        }
        return `${Math.floor(percent)}%`;
    };

    // 判断是否为渐变色
    const isGradient = (color: string | GradientConfig): color is GradientConfig => {
        return typeof color === 'object' && 'from' in color && 'to' in color;
    };

    // 获取渐变色样式
    const getGradientStyle = (): React.CSSProperties => {
        const finalColor = status === 'success' ? '#52c41a' : status === 'exception' ? '#ff4d4f' : strokeColor;

        if (isGradient(finalColor)) {
            const { from, to, direction = 'to right' } = finalColor;
            return {
                background: `linear-gradient(${direction}, ${from}, ${to})`
            };
        }

        return {};
    };

    // 判断是否启用波浪动画
    const isAnimated = (): boolean => {
        const finalColor = status === 'success' ? '#52c41a' : status === 'exception' ? '#ff4d4f' : strokeColor;
        return isGradient(finalColor) && finalColor.animated === true;
    };

    // 获取进度条颜色
    const getStrokeColor = (): string => {
        if (status === 'success') return '#52c41a';
        if (status === 'exception') return '#ff4d4f';
        if (isGradient(strokeColor)) {
            return strokeColor.from;
        }
        return strokeColor;
    };

    // 获取圆形进度条的渐变定义
    const getGradientDef = (gradient: GradientConfig): string => {
        const { from, to } = gradient;
        return `from-${from.replace('#', '')}-to-${to.replace('#', '')}`;
    };

    // 渲染状态图标
    const renderIcon = () => {
        if (icon) return icon;
        if (status === 'success') {
            return <Icon type="check-circle" style={{ color: '#52c41a' }} />;
        }
        if (status === 'exception') {
            return <Icon type="close-circle" style={{ color: '#ff4d4f' }} />;
        }
        return null;
    };

    // 渲染圆形进度条
    if (type === 'circle' || type === 'dashboard') {
        const radius = 50 - (strokeWidth || 6);
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percent / 100) * circumference;
        const finalColor = status === 'success' ? '#52c41a' : status === 'exception' ? '#ff4d4f' : strokeColor;
        const gradientId = isGradient(finalColor) ? getGradientDef(finalColor) : null;

        return (
            <div
                className={classNames('zjpcy-progress', 'zjpcy-progress-circle', className)}
                style={style}
            >
                <svg
                    width={120}
                    height={120}
                    viewBox="0 0 120 120"
                    style={{ transform: 'rotate(-90deg)' }}
                >
                    {gradientId && (
                        <defs>
                            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor={(finalColor as GradientConfig).from} />
                                <stop offset="100%" stopColor={(finalColor as GradientConfig).to} />
                            </linearGradient>
                        </defs>
                    )}
                    <circle
                        cx={60}
                        cy={60}
                        r={radius}
                        stroke={trailColor}
                        strokeWidth={strokeWidth || 6}
                        fill="none"
                    />
                    <circle
                        cx={60}
                        cy={60}
                        r={radius}
                        stroke={gradientId ? `url(#${gradientId})` : getStrokeColor()}
                        strokeWidth={strokeWidth || 6}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{
                            transition: transition ? 'stroke-dashoffset 0.3s cubic-bezier(0.34, 0.69, 0.1, 1)' : 'none'
                        }}
                    />
                </svg>
                {showInfo && (
                    <div className="zjpcy-progress-info">
                        {children || (
                            <>
                                {renderIcon()}
                                {prefix}
                                {formatPercent()}
                                {suffix}
                            </>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // 渲染步骤进度条
    const renderSteps = () => {
        if (!steps || steps <= 0) return null;
        
        // 计算当前进度应该激活多少个步骤
        const progressRatio = percent / 100;
        const clampedRatio = Math.min(1, Math.max(0, progressRatio));
        
        const stepList = Array.from({ length: steps }, (_, index) => {
            const stepStart = index / steps;
            const stepEnd = (index + 1) / steps;
            
            const isCompleted = clampedRatio >= stepEnd;
            const isCurrent = clampedRatio > stepStart && clampedRatio < stepEnd;
            const isPending = clampedRatio <= stepStart;
            const isSuccess = clampedRatio >= 1;
            
            return (
                <div
                    key={index}
                    className={classNames('zjpcy-progress-step', {
                        'zjpcy-progress-step--completed': isCompleted,
                        'zjpcy-progress-step--current': isCurrent,
                        'zjpcy-progress-step--pending': isPending,
                        'zjpcy-progress-step--success': isSuccess
                    })}
                    style={{
                        transition: transition ? 'all var(--zjpcy-transition-duration) var(--zjpcy-transition-timing-function)' : 'none'
                    }}
                />
            );
        });
        
        return (
            <div className="zjpcy-progress-steps">
                {stepList}
            </div>
        );
    };

    // 获取段的颜色样式
    const getSegmentStyle = (segment: ProgressSegment): React.CSSProperties => {
        const { color } = segment;
        if (isGradient(color)) {
            const { from, to, direction = 'to right' } = color;
            return {
                background: `linear-gradient(${direction}, ${from}, ${to})`
            };
        }
        return {
            backgroundColor: color
        };
    };

    // 渲染多段进度条
    const renderSegments = () => {
        if (!segments || segments.length === 0) return null;
        
        // 计算所有段落的总百分比
        const totalSegmentPercent = segments.reduce((sum, seg) => sum + seg.percent, 0);
        
        // 根据 percent 和总段落百分比计算实际进度比例
        // 如果没有传递 percent 或 percent 为 0，默认显示所有段落的颜色
        const effectivePercent = (percent === undefined || percent === 0) ? totalSegmentPercent : percent;
        const progressRatio = totalSegmentPercent > 0 ? effectivePercent / totalSegmentPercent : effectivePercent / 100;
        const clampedRatio = Math.min(1, Math.max(0, progressRatio));
        
        let accumulatedPercent = 0;
        
        const segmentList = segments.map((segment, index) => {
            const segmentPercent = segment.percent;
            const segmentStart = accumulatedPercent / totalSegmentPercent;
            const segmentEnd = (accumulatedPercent + segmentPercent) / totalSegmentPercent;
            accumulatedPercent += segmentPercent;
            
            // 判断该段落的状态
            const isCompleted = clampedRatio >= segmentEnd;
            const isCurrent = clampedRatio > segmentStart && clampedRatio < segmentEnd;
            const isPending = clampedRatio <= segmentStart;
            
            return (
                <div
                    key={index}
                    className={classNames('zjpcy-progress-segment', {
                        'zjpcy-progress-segment--completed': isCompleted,
                        'zjpcy-progress-segment--current': isCurrent,
                        'zjpcy-progress-segment--pending': isPending
                    })}
                    style={{
                        width: `${segmentPercent}%`,
                        ...(isPending ? {} : getSegmentStyle(segment)),
                        transition: transition ? 'all var(--zjpcy-transition-duration) var(--zjpcy-transition-timing-function)' : 'none'
                    }}
                />
            );
        });
        
        // 如果总百分比不足 100，添加灰色占位段落
        const remainingPercent = 100 - totalSegmentPercent;
        if (remainingPercent > 0) {
            segmentList.push(
                <div
                    key="remaining"
                    className="zjpcy-progress-segment zjpcy-progress-segment--remaining"
                    style={{
                        width: `${remainingPercent}%`,
                        backgroundColor: 'gainsboro',
                        transition: transition ? 'all var(--zjpcy-transition-duration) var(--zjpcy-transition-timing-function)' : 'none'
                    }}
                />
            );
        }
        
        return (
            <div className="zjpcy-progress-segments">
                {segmentList}
            </div>
        );
    };

    // 渲染线性进度条（默认）
    return (
        <div
            className={classNames(
                'zjpcy-progress',
                `zjpcy-progress-${size}`,
                `zjpcy-progress-line`,
                { 'zjpcy-progress-success': status === 'success' },
                { 'zjpcy-progress-exception': status === 'exception' },
                { 'zjpcy-progress-steps': steps && steps > 0 },
                { 'zjpcy-progress-has-segments': segments && segments.length > 0 },
                className
            )}
            style={style}
        >
            <div className="zjpcy-progress-wrapper">
                <div className="zjpcy-progress-outer">
                    {steps && steps > 0 ? (
                        renderSteps()
                    ) : segments && segments.length > 0 ? (
                        renderSegments()
                    ) : (
                        <div className="zjpcy-progress-inner" style={{ background: trailColor }}>
                            <div
                                className={classNames('zjpcy-progress-bg', {
                                    'zjpcy-progress-bg--success': status === 'success',
                                    'zjpcy-progress-bg--exception': status === 'exception',
                                    'zjpcy-progress-bg--animated': isAnimated()
                                })}
                                style={{
                                    width: `${Math.min(100, Math.max(0, percent))}%`,
                                    backgroundColor: isGradient(strokeColor) ? undefined : getStrokeColor(),
                                    ...getGradientStyle(),
                                    transition: transition ? 'width 0.3s cubic-bezier(0.34, 0.69, 0.1, 1)' : 'none'
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
            {showInfo && (
                <div className="zjpcy-progress-info">
                    {renderIcon() && <span className="zjpcy-progress-icon">{renderIcon()}</span>}
                    {prefix && <span className="zjpcy-progress-prefix">{prefix}</span>}
                    <span>{formatPercent()}</span>
                    {suffix && <span className="zjpcy-progress-suffix">{suffix}</span>}
                </div>
            )}
        </div>
    );
};

export default Progress;
export type { ProgressProps, ProgressType, ProgressStatus, ProgressSegment };
