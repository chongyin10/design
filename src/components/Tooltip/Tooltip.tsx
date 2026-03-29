'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './Tooltip.css';

export interface TooltipProps {
    children: React.ReactElement;
    title?: React.ReactNode;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    trigger?: 'hover' | 'click';
    delay?: number;
    open?: boolean;
    backgroundColor?: string;
    style?: React.CSSProperties;
    className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
    children,
    title,
    placement = 'top',
    trigger = 'hover',
    delay = 100,
    open,
    backgroundColor,
    style = {},
    className = ''
}) => {
    // 内部状态
    const [internalVisible, setInternalVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [position, setPosition] = useState({ top: -9999, left: -9999 });
    const [arrowStyle, setArrowStyle] = useState<React.CSSProperties>({});
    const [positionReady, setPositionReady] = useState(false);

    const containerRef = useRef<HTMLSpanElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const showTimeoutRef = useRef<number | null>(null);
    const hideTimeoutRef = useRef<number | null>(null);
    const lastPositionRef = useRef<{ top: number; left: number; arrowStyle: React.CSSProperties } | null>(null);
    const cachedTooltipSizeRef = useRef<{ width: number; height: number } | null>(null);

    // 判断是否受控
    const isControlled = open !== undefined;
    // 最终显示状态
    const shouldShow = isControlled ? open : internalVisible;
    // 是否渲染 DOM（显示中或动画中）
    const shouldRender = shouldShow || isAnimating;

    const updatePosition = useCallback((isScroll = false) => {
        if (!containerRef.current || !tooltipRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const padding = 8;
        const viewportPadding = 10;

        // 获取 tooltip 尺寸：优先用缓存，滚动时必须用缓存
        let tooltipWidth: number;
        let tooltipHeight: number;

        if (isScroll && cachedTooltipSizeRef.current) {
            tooltipWidth = cachedTooltipSizeRef.current.width;
            tooltipHeight = cachedTooltipSizeRef.current.height;
        } else {
            const tooltipRect = tooltipRef.current.getBoundingClientRect();
            tooltipWidth = tooltipRect.width;
            tooltipHeight = tooltipRect.height;
            if (tooltipWidth > 0 && tooltipHeight > 0) {
                cachedTooltipSizeRef.current = { width: tooltipWidth, height: tooltipHeight };
            }
        }

        if (tooltipWidth <= 0 || tooltipHeight <= 0) return;

        let top = 0;
        let left = 0;

        switch (placement) {
            case 'top':
                top = containerRect.top - tooltipHeight - padding;
                left = containerRect.left + (containerRect.width - tooltipWidth) / 2;
                break;
            case 'bottom':
                top = containerRect.bottom + padding;
                left = containerRect.left + (containerRect.width - tooltipWidth) / 2;
                break;
            case 'left':
                top = containerRect.top + (containerRect.height - tooltipHeight) / 2;
                left = containerRect.left - tooltipWidth - padding;
                break;
            case 'right':
                top = containerRect.top + (containerRect.height - tooltipHeight) / 2;
                left = containerRect.right + padding;
                break;
        }

        // 边界检测
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        if (left < viewportPadding) left = viewportPadding;
        if (left + tooltipWidth > windowWidth - viewportPadding) {
            left = windowWidth - tooltipWidth - viewportPadding;
        }
        if (top < viewportPadding) top = viewportPadding;
        if (top + tooltipHeight > windowHeight - viewportPadding) {
            top = windowHeight - tooltipHeight - viewportPadding;
        }

        // 计算箭头位置：让箭头始终指向触发器中心
        const arrowOffset = 3; // arrowSize(6) / 2
        let newArrowStyle: React.CSSProperties = {};

        const triggerCenterX = containerRect.left + containerRect.width / 2;
        const triggerCenterY = containerRect.top + containerRect.height / 2;

        const arrowLeft = triggerCenterX - left - arrowOffset;
        const arrowTop = triggerCenterY - top - arrowOffset;

        const isVertical = placement === 'top' || placement === 'bottom';
        const isHorizontal = placement === 'left' || placement === 'right';

        if (isVertical) {
            newArrowStyle = {
                left: `${Math.max(arrowOffset, Math.min(arrowLeft, tooltipWidth - arrowOffset))}px`
            };
            if (placement === 'top') {
                newArrowStyle.bottom = `${-arrowOffset}px`;
            } else {
                newArrowStyle.top = `${-arrowOffset}px`;
            }
        } else if (isHorizontal) {
            newArrowStyle = {
                top: `${Math.max(arrowOffset, Math.min(arrowTop, tooltipHeight - arrowOffset))}px`
            };
            if (placement === 'left') {
                newArrowStyle.right = `${-arrowOffset}px`;
            } else {
                newArrowStyle.left = `${-arrowOffset}px`;
            }
        }

        const pos = { top, left };
        const isSame = lastPositionRef.current &&
            lastPositionRef.current.top === top &&
            lastPositionRef.current.left === left &&
            JSON.stringify(lastPositionRef.current.arrowStyle) === JSON.stringify(newArrowStyle);

        if (!isSame) {
            lastPositionRef.current = { top, left, arrowStyle: newArrowStyle };
            setPosition(pos);
            setArrowStyle(newArrowStyle);
        }
        setPositionReady(true);
    }, [placement]);

    // 显示 tooltip
    const show = useCallback(() => {
        if (!title) return;

        // 清除隐藏延时
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
        }

        if (isControlled) return; // 受控模式下不处理内部状态

        setInternalVisible(true);
        // 重置位置状态
        setPositionReady(false);
        setPosition({ top: -9999, left: -9999 });
        setArrowStyle({});
        lastPositionRef.current = null;
        cachedTooltipSizeRef.current = null;
        // 双帧 rAF 确保 DOM 布局完成后再计算位置
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                updatePosition(false);
            });
        });
        requestAnimationFrame(() => {
            setIsAnimating(true);
        });
    }, [title, isControlled, updatePosition]);

    // 隐藏 tooltip
    const hide = useCallback(() => {
        if (isControlled) return; // 受控模式下不处理内部状态

        setIsAnimating(false);
        setPositionReady(false);
        // 等待动画结束后卸载 DOM
        hideTimeoutRef.current = setTimeout(() => {
            setInternalVisible(false);
            setPosition({ top: -9999, left: -9999 });
            setArrowStyle({});
            lastPositionRef.current = null;
            cachedTooltipSizeRef.current = null;
            hideTimeoutRef.current = null;
        }, 200);
    }, [isControlled]);

    const handleMouseEnter = () => {
        if (trigger !== 'hover' || isControlled) return;

        if (showTimeoutRef.current) {
            clearTimeout(showTimeoutRef.current);
        }
        showTimeoutRef.current = setTimeout(() => {
            show();
            showTimeoutRef.current = null;
        }, delay);
    };

    const handleMouseLeave = () => {
        if (trigger !== 'hover' || isControlled) return;

        if (showTimeoutRef.current) {
            clearTimeout(showTimeoutRef.current);
            showTimeoutRef.current = null;
        }
        hide();
    };

    const handleClick = () => {
        if (trigger !== 'click' || isControlled) return;

        if (internalVisible) {
            hide();
        } else {
            show();
        }
    };

    // 点击外部关闭
    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (trigger !== 'click' || isControlled || !internalVisible) return;

        const target = event.target as Node;
        if (containerRef.current && !containerRef.current.contains(target) &&
            tooltipRef.current && !tooltipRef.current.contains(target)) {
            hide();
        }
    }, [trigger, isControlled, internalVisible, hide]);

    // 处理受控模式的动画
    useEffect(() => {
        if (isControlled) {
            if (open) {
                // 清除隐藏延时
                if (hideTimeoutRef.current) {
                    clearTimeout(hideTimeoutRef.current);
                    hideTimeoutRef.current = null;
                }
                // 重置位置状态
                setPositionReady(false);
                setPosition({ top: -9999, left: -9999 });
                setArrowStyle({});
                lastPositionRef.current = null;
                cachedTooltipSizeRef.current = null;
                // 双帧 rAF 确保 DOM 布局完成后再计算位置
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        updatePosition(false);
                    });
                });
                // 触发动画
                requestAnimationFrame(() => {
                    setIsAnimating(true);
                });
            } else {
                setIsAnimating(false);
                setPositionReady(false);
                hideTimeoutRef.current = setTimeout(() => {
                    setPosition({ top: -9999, left: -9999 });
                    setArrowStyle({});
                    lastPositionRef.current = null;
                    cachedTooltipSizeRef.current = null;
                    hideTimeoutRef.current = null;
                }, 200);
            }
        }
    }, [open, isControlled, updatePosition]);

    // 监听位置更新
    useEffect(() => {
        if (shouldRender) {
            const handleResize = () => updatePosition(false);
            let scrollRafId: number | null = null;
            const handleScroll = () => {
                if (scrollRafId) return;
                scrollRafId = requestAnimationFrame(() => {
                    scrollRafId = null;
                    updatePosition(true);
                });
            };

            window.addEventListener('resize', handleResize);
            window.addEventListener('scroll', handleScroll, true);

            if (trigger === 'click' && !isControlled) {
                document.addEventListener('click', handleClickOutside);
            }

            return () => {
                if (scrollRafId) cancelAnimationFrame(scrollRafId);
                window.removeEventListener('resize', handleResize);
                window.removeEventListener('scroll', handleScroll, true);
                if (trigger === 'click' && !isControlled) {
                    document.removeEventListener('click', handleClickOutside);
                }
            };
        }
    }, [shouldRender, placement, trigger, isControlled, updatePosition, handleClickOutside]);

    // 清理
    useEffect(() => {
        return () => {
            if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        };
    }, []);

    // Tooltip 内容
    const tooltipContent = shouldRender && title && (
        <div
            ref={tooltipRef}
            className={`zjpcy-tooltip zjpcy-tooltip-${placement} ${isAnimating && positionReady ? 'is-visible' : ''} ${className}`}
            style={{
                position: 'fixed',
                top: `${position.top}px`,
                left: `${position.left}px`,
                zIndex: 1000,
                backgroundColor: backgroundColor,
                visibility: positionReady ? undefined : 'hidden',
                ...style
            }}
            onMouseEnter={trigger === 'hover' && !isControlled ? () => {
                if (hideTimeoutRef.current) {
                    clearTimeout(hideTimeoutRef.current);
                    hideTimeoutRef.current = null;
                }
                setInternalVisible(true);
                setIsAnimating(true);
            } : undefined}
            onMouseLeave={trigger === 'hover' && !isControlled ? hide : undefined}
        >
            <div className="zjpcy-tooltip-content">{title}</div>
            <div
                className="zjpcy-tooltip-arrow"
                style={{ backgroundColor: backgroundColor, ...arrowStyle }}
            />
        </div>
    );

    return (
        <>
            <span
                ref={containerRef}
                onMouseEnter={trigger === 'hover' ? handleMouseEnter : undefined}
                onMouseLeave={trigger === 'hover' ? handleMouseLeave : undefined}
                onClick={trigger === 'click' ? handleClick : undefined}
                style={{ display: 'inline-block' }}
            >
                {children}
            </span>
            {/* 使用 Portal 将 Tooltip 渲染到 body，避免被父元素的 transform 等属性影响定位 */}
            {tooltipContent && createPortal(tooltipContent, document.body)}
        </>
    );
};

export default Tooltip;
