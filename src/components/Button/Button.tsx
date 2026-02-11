import React from 'react';
import classNames from 'classnames';
import Icon from '../Icon';
import './Button.css';

export interface ButtonProps {
    children?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'link';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void;
    className?: string;
    style?: React.CSSProperties;
    icon?: string | React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    href?: string;
}

const Button = React.forwardRef<HTMLElement, ButtonProps>(({
    children,
    variant = 'secondary',
    size = 'medium',
    disabled = false,
    loading = false,
    onClick,
    className,
    style,
    icon,
    type = 'button',
    href,
    ...rest
}, ref) => {
    const classes = classNames(
        'idp-btn',
        `idp-btn--${variant}`,
        `idp-btn--${size}`,
        {
            'idp-btn--disabled': disabled || loading
        },
        className
    );

    const handleClick = (e?: React.MouseEvent) => {
        if (disabled || loading) {
            e?.preventDefault();
            return;
        }
        
        if (onClick) {
            onClick();
        }
    };

    const renderIcon = () => {
        if (loading) {
            return <Icon type="loading" style={{ marginRight: children ? '2px' : 0 }} />;
        }
        
        if (!icon) return null;
        
        if (typeof icon === 'string') {
            return <Icon type={icon} style={{ marginRight: children ? '2px' : 0 }} />;
        }
        
        return <span style={{ marginRight: children ? '8px' : 0, display: 'inline-flex', alignItems: 'center' }}>{icon}</span>;
    };

    // 如果是 link 类型且有 href，渲染为 a 标签
    if (variant === 'link' && href) {
        return (
            <a
                ref={ref as React.Ref<HTMLAnchorElement>}
                href={disabled ? undefined : href}
                className={classes}
                onClick={handleClick}
                style={style}
                {...rest}
            >
                {renderIcon()}
                {children}
            </a>
        );
    }

    // 默认渲染为 button
    return (
        <button
            ref={ref as React.Ref<HTMLButtonElement>}
            type={type}
            className={classes}
            onClick={handleClick}
            disabled={disabled}
            style={style}
            {...rest}
        >
            {renderIcon()}
            {children}
        </button>
    );
});

// 设置组件名称，方便调试
Button.displayName = 'Button';

export default Button;