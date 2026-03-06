'use client';

import React, { useState, useEffect, useRef } from 'react';
import './Notification.css';
import { NotificationProps } from './types';

const Notification: React.FC<NotificationProps> = ({
    message,
    duration = 3000,
    type = 'info',
    position = 'center',
    color,
    top,
    open: externalOpen,
    clickOutsideToClose = false,
    onClose
}) => {
    // 受控模式：当外部设置了 open 属性时，使用外部的 open 值
    // 非受控模式：当外部没有设置 open 属性时，内部管理状态，默认显示
    const isControlled = externalOpen !== undefined;
    const [internalOpen, setInternalOpen] = useState(true);
    const [isVisible, setIsVisible] = useState(true);
    const notificationRef = useRef<HTMLDivElement>(null);

    // 确定当前的打开状态
    const isOpen = isControlled ? externalOpen : internalOpen;

    // 点击外部区域关闭通知
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                clickOutsideToClose &&
                notificationRef.current &&
                !notificationRef.current.contains(event.target as Node)
            ) {
                setIsVisible(false);
                setTimeout(() => {
                    if (onClose) onClose();
                    if (!isControlled) {
                        setInternalOpen(false);
                    }
                }, 500);
            }
        };

        if (clickOutsideToClose && isOpen) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [clickOutsideToClose, isOpen, isControlled, onClose]);

    // 监听外部 open 属性变化（仅受控模式）
    useEffect(() => {
        if (isControlled) {
            if (externalOpen) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
                setTimeout(() => {
                    if (onClose) onClose();
                }, 500);
            }
        }
    }, [externalOpen, isControlled, onClose]);

    // 处理定时器（受控和非受控模式都适用）
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => {
                    if (onClose) onClose();
                    if (!isControlled) {
                        setInternalOpen(false);
                    }
                }, 500);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration, isOpen, isControlled, onClose]);

    // 如果当前不应该显示，则返回 null
    if (!isOpen || !isVisible) return null;

    const typeClass = `notification-${type}`;
    const customColorClass = color ? 'notification-custom' : '';

    // 计算位置样式
    const calculatePositionStyle = () => {
        const style: React.CSSProperties = {};
        
        // 如果设置了 top 值
        if (top !== undefined) {
            style.top = `${top}px`;
            
            // 检查 position 是否为顶部相关位置
            if (position.startsWith('top-')) {
                // 顶部位置：保持 x 轴方位，仅修改 y 轴
                switch (position) {
                    case 'top-left':
                        style.left = '20px';
                        style.right = 'auto';
                        break;
                    case 'top-center':
                        style.left = '50%';
                        style.transform = 'translateX(-50%)';
                        style.right = 'auto';
                        break;
                    case 'top-right':
                        style.right = '20px';
                        style.left = 'auto';
                        break;
                    default:
                        break;
                }
            } else {
                // 非顶部位置：position 失效，仅使用 top 值，默认靠右
                style.right = '20px';
                style.left = 'auto';
                style.bottom = 'auto';
            }
        } else {
            // 没有设置 top 值：使用默认 position 类
        }
        
        return style;
    };

    const positionStyle = calculatePositionStyle();
    const customStyle = {
        backgroundColor: color,
        ...positionStyle
    };

    // 确定是否需要使用 position 类
    const usePositionClass = top === undefined;
    const positionClass = usePositionClass ? `notification-${position}` : '';

    return (
        <div 
            ref={notificationRef}
            className={`notification ${typeClass} ${positionClass} ${customColorClass} ${isVisible ? 'fade-in' : 'fade-out'}`}
            style={customStyle}
        >
            <div className="notification-content">
                {getIcon(type)}
                <span>{message}</span>
            </div>
        </div>
    );
};

const getIcon = (type: string) => {
    switch (type) {
        case 'success':
            return <i className="fas fa-check-circle"></i>;
        case 'warning':
            return <i className="fas fa-exclamation-triangle"></i>;
        case 'error':
            return <i className="fas fa-times-circle"></i>;
        default:
            return <i className="fas fa-info-circle"></i>;
    }
};

export default Notification;