'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';
import classNames from 'classnames';
import { StepsProps, StepItem, StepStatus, StepContextType } from './types';
import './Steps.css';

const StepContext = createContext<StepContextType | null>(null);

const StepNode: React.FC<{ index: number; status: StepStatus; item: StepItem }> = ({ index, status, item }) => {

    // 优先级：node > title > description > 默认图标
    if (item.node) {
        return (
            <span className={`zjpcy-step-node zjpcy-step-node-${status}`}>
                {item.node}
            </span>
        );
    }

    if (item.title) {
        return (
            <span className={`zjpcy-step-node zjpcy-step-node-${status}`}>
                {item.title}
            </span>
        );
    }

    if (item.description) {
        return (
            <span className={`zjpcy-step-node zjpcy-step-node-${status}`}>
                {item.description}
            </span>
        );
    }

    if (status === 'finish') {
        return <span className="zjpcy-step-node zjpcy-step-node-finish">✓</span>;
    }

    if (status === 'error') {
        return <span className="zjpcy-step-node zjpcy-step-node-error">✕</span>;
    }

    return <span className={`zjpcy-step-node zjpcy-step-node-${status}`}>{index + 1}</span>;
};

const Step: React.FC<{ item: StepItem; index: number; isLast: boolean }> = ({ item, index, isLast }) => {

    const refItem = React.useRef<HTMLDivElement>(null);
    const context = useContext(StepContext);
    const [height, setHeight] = useState<number>(0);

    if (!context) {
        return null;
    }

    const { current, status, direction, onChange } = context;
    const stepStatus = item.status || (index < current ? 'finish' : index === current ? status : 'wait');

    const handleClick = () => {
        if (!item.disabled && onChange && index !== current) {
            onChange(index);
        }
    };

    // 监听高度变化
    React.useEffect(() => {
        if (refItem.current && context.type === 'panel') {
            const element = refItem.current.getBoundingClientRect()?.height;
            setHeight(element || 0);
        }
    }, [refItem, context]);

    const renderHeight = useMemo(() => {
        if (context.type !== 'panel' || height === 0) return null;
        const y = (height / 4) - 16/2;
        return <div style={{ transform: `translateY(${y}px)` }} className="zjpcy-step-arrow">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M5.5 3L10.5 8L5.5 13" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
        </div>
    }, [height, context]);

    // 自定义连接线样式
    const tailStyle: React.CSSProperties = {};
    if (item.tailColor) {
        tailStyle.backgroundColor = item.tailColor;
    }

    // 连接线类型
    const tailType = item.tailType || 'solid';

    return (
        <div
            className={classNames('zjpcy-step', `zjpcy-step-direction-${direction}`, `zjpcy-step-${stepStatus}`, {
                'zjpcy-step-disabled': item.disabled
            })}
            onClick={handleClick}
            ref={refItem}
        >
            <div className="zjpcy-step-head">
                <StepNode index={index} status={stepStatus} item={item} />
                {!isLast && (
                    <>
                        {/* 默认类型显示连接线 */}
                        {context.type === 'default' && (
                            <div className={`zjpcy-step-tail zjpcy-step-tail-${tailType}`} style={tailStyle}>
                                {item.tailTitle && (
                                    <div className="zjpcy-step-tail-title">
                                        {item.tailTitle}
                                    </div>
                                )}
                            </div>
                        )}
                        {/* 面板类型显示箭头图标 */}
                        {renderHeight}
                    </>
                )}
            </div>
            <div className="zjpcy-step-content">
                {item.title && <div className="zjpcy-step-title">{item.title}</div>}
                {item.description && <div className="zjpcy-step-description">{item.description}</div>}
            </div>
        </div>
    );
};

const Steps: React.FC<StepsProps> = ({
    current = 0,
    status = 'process',
    direction = 'horizontal',
    size = 'default',
    type = 'default',
    items,
    onChange,
    className = '',
    style
}) => {
    const contextValue: StepContextType = {
        current,
        status,
        direction,
        size,
        type,
        onChange
    };

    return (
        <StepContext.Provider value={contextValue}>
            <div
                className={`zjpcy-steps ${direction} ${size} ${type} ${className}`}
                style={style}
            >
                {items.map((item, index) => (
                    <Step
                        key={index}
                        item={item}
                        index={index}
                        isLast={index === items.length - 1}
                    />
                ))}
            </div>
        </StepContext.Provider>
    );
};

export default Steps;