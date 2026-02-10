import React, { useState } from 'react';
import classNames from 'classnames';
import Icon from '../Icon';
import { TagProps } from './types';
import './Tag.css';

const Tag = React.forwardRef<HTMLSpanElement, TagProps>((
    {
        children,
        className,
        style,
        size = 'medium',
        backgroundColor,
        color,
        icon,
        closable = false,
        onClose,
        onClick,
        ...rest
    },
    ref
) => {
    const [visible, setVisible] = useState(true);

    if (!visible) {
        return null;
    }

    const classes = classNames(
        'idp-tag',
        `idp-tag--${size}`,
        {
            'idp-tag--clickable': onClick,
            'idp-tag--closable': closable
        },
        className
    );

    const tagStyle: React.CSSProperties = {
        backgroundColor,
        color,
        ...style
    };

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClose?.(e);
        setVisible(false);
    };

    const renderIcon = () => {
        if (!icon) return null;

        if (typeof icon === 'string') {
            return (
                <span className="idp-tag__icon">
                    <Icon type={icon} />
                </span>
            );
        }

        return <span className="idp-tag__icon">{icon}</span>;
    };

    return (
        <span
            ref={ref}
            className={classes}
            style={tagStyle}
            onClick={onClick}
            {...rest}
        >
            {renderIcon()}
            <span className="idp-tag__content">{children}</span>
            {closable && (
                <span
                    className="idp-tag__close"
                    onClick={handleClose}
                    role="button"
                    tabIndex={0}
                    aria-label="close"
                >
                    <Icon type="close" />
                </span>
            )}
        </span>
    );
});

Tag.displayName = 'Tag';

export default Tag;
export type { TagProps, TagSize } from './types';
