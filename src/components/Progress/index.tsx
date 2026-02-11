import React from 'react';
import classNames from 'classnames';
import Icon from '../Icon';
import { ProgressProps, ProgressStatus, ProgressType } from './types';
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

    // 获取进度条颜色
    const getStrokeColor = () => {
        if (status === 'success') return '#52c41a';
        if (status === 'exception') return '#ff4d4f';
        return strokeColor;
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
                        stroke={getStrokeColor()}
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
                        {renderIcon()}
                        {prefix}
                        {formatPercent()}
                        {suffix}
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
                                'idp-progress-bg--exception': status === 'exception'
                            })}
                            style={{
                                width: `${Math.min(100, Math.max(0, percent))}%`,
                                backgroundColor: getStrokeColor(),
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
