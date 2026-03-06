'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import './Top.css';

interface TopProps {
    showAfter?: number;
    bottom?: number;
    right?: number;
    size?: number;
    color?: string;
    bgColor?: string;
    boxShadow?: string;
    onClick?: () => void;
    containerRef?: React.RefObject<HTMLElement | null>;
    icon?: React.ReactNode;
}

const Top: React.FC<TopProps> = ({
    showAfter = 100,
    bottom = 30,
    right = 30,
    size = 40,
    color = '#fff',
    bgColor = '#1a2980',
    boxShadow = '0 2px 10px rgba(0, 0, 0, 0.15)',
    onClick,
    containerRef,
    icon,
}) => {
    const [visible, setVisible] = useState(false);
    const internalRef = useRef<HTMLDivElement>(null);

    const scrollToTop = useCallback(() => {
        if (containerRef?.current) {
            containerRef.current.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
        onClick?.();
    }, [onClick, containerRef]);

    useEffect(() => {
        const updateVisibility = () => {
            let scrollPosition = 0;
            if (containerRef?.current) {
                scrollPosition = containerRef.current.scrollTop;
            } else {
                scrollPosition = window.pageYOffset;
            }
            setVisible(scrollPosition > showAfter);
        };

        if (containerRef?.current) {
            const container = containerRef.current;
            container.addEventListener('scroll', updateVisibility);
            updateVisibility();
            return () => container.removeEventListener('scroll', updateVisibility);
        } else {
            window.addEventListener('scroll', updateVisibility);
            updateVisibility();
            return () => window.removeEventListener('scroll', updateVisibility);
        }
    }, [showAfter, containerRef]);

    if (!visible) {
        return null;
    }

    const defaultIcon = <FaArrowUp size={Math.floor(size * 0.5)} />;
    const iconSize = size * 0.5;

    if (containerRef?.current) {
        return (
            <div
                ref={internalRef}
                className="top-button-wrapper-container"
                style={{
                    position: 'sticky',
                    bottom: `${bottom}px`,
                    marginLeft: 'auto',
                    width: `${size}px`,
                    height: `${size}px`,
                    right: `${right}px`,
                    zIndex: 10,
                }}
            >
                <button
                    className="top-button"
                    onClick={scrollToTop}
                    style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        backgroundColor: bgColor,
                        color: color,
                        boxShadow: boxShadow,
                        padding: 0,
                        border: 'none',
                    }}
                >
                    {icon ? (
                        <span style={{ width: iconSize, height: iconSize, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {icon}
                        </span>
                    ) : (
                        defaultIcon
                    )}
                </button>
            </div>
        );
    }

    return (
        <div
            ref={internalRef}
            className="top-button-wrapper"
            style={{
                position: 'fixed',
                bottom: `${bottom}px`,
                right: `${right}px`,
                zIndex: 1000,
            }}
        >
            <button
                className="top-button"
                onClick={scrollToTop}
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: bgColor,
                    color: color,
                    boxShadow: boxShadow,
                    padding: 0,
                    border: 'none',
                }}
            >
                {icon ? (
                    <span style={{ width: iconSize, height: iconSize, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {icon}
                    </span>
                ) : (
                    defaultIcon
                )}
            </button>
        </div>
    );
};

export default Top;
