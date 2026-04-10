'use client';

import React from 'react';
import classNames from 'classnames';
import { CardProps, CardMetaProps, CardGridProps } from './types';
import './Card.css';

// CardMeta 子组件
const CardMeta: React.FC<CardMetaProps> = ({
    avatar,
    title,
    description,
    className,
    style
}) => {
    return (
        <div className={classNames('zjpcy-card-meta', className)} style={style}>
            {avatar && <div className="zjpcy-card-meta-avatar">{avatar}</div>}
            <div className="zjpcy-card-meta-detail">
                {title && <div className="zjpcy-card-meta-title">{title}</div>}
                {description && <div className="zjpcy-card-meta-description">{description}</div>}
            </div>
        </div>
    );
};

// CardGrid 子组件
const CardGrid: React.FC<CardGridProps> = ({
    children,
    hoverable = false,
    className,
    style
}) => {
    return (
        <div
            className={classNames('zjpcy-card-grid', { 'zjpcy-card-grid-hoverable': hoverable }, className)}
            style={style}
        >
            {children}
        </div>
    );
};

// 主 Card 组件
const Card: React.FC<CardProps> & {
    Meta: typeof CardMeta;
    Grid: typeof CardGrid;
} = ({
    title,
    extra,
    children,
    footer,
    size = 'default',
    bordered = true,
    hoverable = false,
    loading = false,
    cover,
    className,
    style,
    headerStyle,
    bodyStyle,
    footerStyle,
    onClick
}) => {
    const handleClick = () => {
        if (!loading && onClick) {
            onClick();
        }
    };

    const renderLoading = () => (
        <div className="zjpcy-card-loading">
            <div className="zjpcy-card-loading-block" style={{ width: '94%' }} />
            <div className="zjpcy-card-loading-block" style={{ width: '88%' }} />
            <div className="zjpcy-card-loading-block" style={{ width: '92%' }} />
            <div className="zjpcy-card-loading-block" style={{ width: '70%' }} />
        </div>
    );

    return (
        <div
            className={classNames(
                'zjpcy-card',
                `zjpcy-card-${size}`,
                {
                    'zjpcy-card-bordered': bordered,
                    'zjpcy-card-hoverable': hoverable,
                    'zjpcy-card-loading': loading,
                    'zjpcy-card-clickable': !!onClick
                },
                className
            )}
            style={style}
            onClick={handleClick}
        >
            {cover && <div className="zjpcy-card-cover">{cover}</div>}

            {(title !== undefined || extra !== undefined) && (
                <div
                    className="zjpcy-card-header"
                    style={headerStyle}
                >
                    <div className="zjpcy-card-header-wrapper">
                        {title !== undefined && (
                            <div className="zjpcy-card-header-title">{title}</div>
                        )}
                        {extra !== undefined && (
                            <div className="zjpcy-card-header-extra">{extra}</div>
                        )}
                    </div>
                </div>
            )}

            <div className="zjpcy-card-body" style={bodyStyle}>
                {loading ? renderLoading() : children}
            </div>

            {footer !== undefined && (
                <div className="zjpcy-card-footer" style={footerStyle}>
                    {footer}
                </div>
            )}
        </div>
    );
};

Card.Meta = CardMeta;
Card.Grid = CardGrid;

export default Card;
