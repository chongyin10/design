import React, { useState, useRef, useEffect, useCallback } from 'react';
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
    const [position, setPosition] = useState({ top: 0, left: 0 });

    const containerRef = useRef<HTMLSpanElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const showTimeoutRef = useRef<number | null>(null);
    const hideTimeoutRef = useRef<number | null>(null);

    // 判断是否受控
    const isControlled = open !== undefined;
    // 最终显示状态
    const shouldShow = isControlled ? open : internalVisible;
    // 是否渲染 DOM（显示中或动画中）
    const shouldRender = shouldShow || isAnimating;

    const updatePosition = useCallback(() => {
        if (!containerRef.current || !tooltipRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        let top = 0;
        let left = 0;

        switch (placement) {
            case 'top':
                top = containerRect.top - tooltipRect.height - 8;
                left = containerRect.left + (containerRect.width - tooltipRect.width) / 2;
                break;
            case 'bottom':
                top = containerRect.bottom + 8;
                left = containerRect.left + (containerRect.width - tooltipRect.width) / 2;
                break;
            case 'left':
                top = containerRect.top + (containerRect.height - tooltipRect.height) / 2;
                left = containerRect.left - tooltipRect.width - 8;
                break;
            case 'right':
                top = containerRect.top + (containerRect.height - tooltipRect.height) / 2;
                left = containerRect.right + 8;
                break;
        }

        setPosition({ top: top + scrollTop, left: left + scrollLeft });
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
        // 下一帧触发动画
        requestAnimationFrame(() => {
            setIsAnimating(true);
        });
    }, [title, isControlled]);

    // 隐藏 tooltip
    const hide = useCallback(() => {
        if (isControlled) return; // 受控模式下不处理内部状态

        setIsAnimating(false);
        // 等待动画结束后卸载 DOM
        hideTimeoutRef.current = setTimeout(() => {
            setInternalVisible(false);
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
                // 触发动画
                requestAnimationFrame(() => {
                    setIsAnimating(true);
                });
            } else {
                setIsAnimating(false);
                hideTimeoutRef.current = setTimeout(() => {
                    hideTimeoutRef.current = null;
                }, 200);
            }
        }
    }, [open, isControlled]);

    // 监听位置更新
    useEffect(() => {
        if (shouldRender) {
            requestAnimationFrame(updatePosition);

            const handleResize = () => updatePosition();
            const handleScroll = () => updatePosition();

            window.addEventListener('resize', handleResize);
            window.addEventListener('scroll', handleScroll, true);

            if (trigger === 'click' && !isControlled) {
                document.addEventListener('click', handleClickOutside);
            }

            return () => {
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
            {shouldRender && title && (
                <div
                    ref={tooltipRef}
                    className={`idp-tooltip idp-tooltip-${placement} ${isAnimating ? 'is-visible' : ''} ${className}`}
                    style={{
                        position: 'fixed',
                        top: position.top,
                        left: position.left,
                        zIndex: 1000,
                        backgroundColor: backgroundColor,
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
                    <div className="idp-tooltip-content">{title}</div>
                    <div
                        className="idp-tooltip-arrow"
                        style={{ backgroundColor: backgroundColor }}
                    />
                </div>
            )}
        </>
    );
};

export default Tooltip;
