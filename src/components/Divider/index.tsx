import React from 'react';
import classNames from 'classnames';
import './Divider.css';

export interface DividerProps {
    orientation?: 'horizontal' | 'vertical';
    type?: 'solid' | 'dashed';
    color?: string;
    className?: string;
    style?: React.CSSProperties;
}

const Divider: React.FC<DividerProps> = ({
    orientation = 'horizontal',
    type = 'solid',
    color = '#339af0',
    className = '',
    style
}) => {
    const isPrimary = color !== '#339af0' && color !== undefined;
    const classes = classNames(
        'divider',
        `divider-${orientation}`,
        {
            [`divider-${type}-${orientation}`]: type === 'dashed',
            'divider-primary': isPrimary,
            'divider-primary-with-text': isPrimary,
        },
        className
    );

    return (
        <div
            className={classes}
            style={{
                backgroundColor: color,
                ...style
            }}
        />
    );
};

export default Divider;
