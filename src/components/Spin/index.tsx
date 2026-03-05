import React, { useState, useEffect, useMemo } from 'react';
import { SpinProps, SpinSize } from './types';
import './Spin.css';

// 默认加载图标 - 使用与 Table 组件相同的 SVG 加载动画
const DefaultLoadingIcon: React.FC<{ size: number; sizeType: string }> = ({ size, sizeType }) => (
    <svg
        viewBox="0 0 24 24"
        className={`idp-spin-icon idp-spin-icon-${sizeType}`}
        style={{ width: size, height: size }}
    >
        <circle
            className="idp-spin-track"
            cx="12"
            cy="12"
            r="10"
            fill="none"
            strokeWidth="2"
        />
        <circle
            className="idp-spin-indicator"
            cx="12"
            cy="12"
            r="10"
            fill="none"
            strokeWidth="2"
        />
    </svg>
);

const sizeMap: Record<SpinSize, number> = {
    small: 16,
    default: 24,
    large: 32
};

const Spin: React.FC<SpinProps> = ({
    spinning = true,
    indicator,
    tip,
    size = 'default',
    delay = 0,
    className = '',
    style,
    children,
    fullscreen = false
}) => {
    const [internalSpinning, setInternalSpinning] = useState(spinning);
    const [showSpinner, setShowSpinner] = useState(delay === 0);

    // 处理 spinning 状态和延迟
    useEffect(() => {
        if (spinning) {
            setInternalSpinning(true);
            if (delay > 0) {
                const timer = setTimeout(() => {
                    setShowSpinner(true);
                }, delay);
                return () => clearTimeout(timer);
            } else {
                setShowSpinner(true);
            }
        } else {
            setInternalSpinning(false);
            setShowSpinner(false);
        }
    }, [spinning, delay]);

    const actualSize = sizeMap[size];

    // 渲染加载指示符
    const renderIndicator = useMemo(() => {
        if (indicator) {
            return indicator;
        }
        return <DefaultLoadingIcon size={actualSize} sizeType={size} />;
    }, [indicator, actualSize, size]);

    // 渲染加载内容
    const renderSpinContent = () => (
        <div className={`idp-spin-content ${tip ? 'idp-spin-content-tip' : ''}`}>
            {renderIndicator}
            {tip && <div className={`idp-spin-tip idp-spin-tip-${size}`}>{tip}</div>}
        </div>
    );

    // 全屏模式
    if (fullscreen) {
        if (!internalSpinning || !showSpinner) return null;
        return (
            <div className={`idp-spin-fullscreen ${className}`} style={style}>
                {renderSpinContent()}
            </div>
        );
    }

    // 有子元素时作为包裹组件
    if (children) {
        return (
            <div
                className={`idp-spin-nested-wrapper ${className}`}
                style={style}
            >
                {children}
                {internalSpinning && showSpinner && (
                    <div className="idp-spin-mask">
                        {renderSpinContent()}
                    </div>
                )}
            </div>
        );
    }

    // 独立使用模式
    if (!internalSpinning || !showSpinner) return null;

    return (
        <div className={`idp-spin ${className}`} style={style}>
            {renderSpinContent()}
        </div>
    );
};

export default Spin;
export type { SpinProps, SpinSize };
