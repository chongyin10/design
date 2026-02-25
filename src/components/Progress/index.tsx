import React from 'react';
import classNames from 'classnames';
import Icon from '../Icon';
import { ProgressProps, ProgressStatus, ProgressType, GradientConfig } from './types';
import './Progress.css';

const Progress: React.FC<ProgressProps> = ({
    percent = 0,
    type = 'line',
    status: customStatus,
    showInfo = true,
    format,
    strokeColor = '#1890ff',
    trailColor = '#f5f5f5',
    strokeWidth,
    size = 'default',
    transition = true,
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
                className={classNames('idp-progress', 'idp-progress--circle', className)}
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
                    <div className="idp-progress-info" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', margin: 0 }}>
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

    // 渲染线性进度条（默认）
    return (
        <div
            className={classNames(
                'idp-progress',
                `idp-progress--${size}`,
                `idp-progress--line`,
                { 'idp-progress--success': status === 'success' },
                { 'idp-progress--exception': status === 'exception' },
                className
            )}
            style={style}
        >
            <div className="idp-progress-wrapper">
                <div className="idp-progress-outer">
                    <div className="idp-progress-inner">
                        <div
                            className={classNames('idp-progress-bg', {
                                'idp-progress-bg--success': status === 'success',
                                'idp-progress-bg--exception': status === 'exception',
                                'idp-progress-bg--animated': isAnimated()
                            })}
                            style={{
                                width: `${Math.min(100, Math.max(0, percent))}%`,
                                backgroundColor: isGradient(strokeColor) ? undefined : getStrokeColor(),
                                ...getGradientStyle(),
                                transition: transition ? 'width 0.3s cubic-bezier(0.34, 0.69, 0.1, 1)' : 'none'
                            }}
                        />
                    </div>
                </div>
            </div>
            {showInfo && (
                <div className="idp-progress-info">
                    {renderIcon() && <span className="idp-progress-icon">{renderIcon()}</span>}
                    {prefix && <span className="idp-progress-prefix">{prefix}</span>}
                    <span>{formatPercent()}</span>
                    {suffix && <span className="idp-progress-suffix">{suffix}</span>}
                </div>
            )}
        </div>
    );
};

export default Progress;
export type { ProgressProps, ProgressType, ProgressStatus };
