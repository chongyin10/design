'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MasonryProps, ResponsiveConfig } from './types';
import './Masonry.css';

const Masonry: React.FC<MasonryProps> = ({
    items,
    columns = 3,
    gutter = 20,
    className,
    style,
    classNames = {},
    styles = {},
    onLayoutChange
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentColumns, setCurrentColumns] = useState<number>(3);
    const [currentGutter, setCurrentGutter] = useState<number>(20);

    // Get value from responsive config based on current width
    const getResponsiveValue = function <T>(config: T | ResponsiveConfig<T>, defaultValue: T, width: number): T {
        if (config !== null && typeof config === 'object' && !Array.isArray(config)) {
            const responsiveConfig = config as ResponsiveConfig<T>;
            const breakpoints = Object.keys(responsiveConfig)
                .map(Number)
                .sort((a, b) => b - a);

            for (const breakpoint of breakpoints) {
                if (width >= breakpoint && responsiveConfig.hasOwnProperty(breakpoint)) {
                    return responsiveConfig[breakpoint];
                }
            }
            return defaultValue;
        }
        return config as T;
    };

    // Handle responsive layout on window resize
    useEffect(() => {
        let resizeTimeout: number;

        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = window.setTimeout(() => {
                if (containerRef.current) {
                    const width = containerRef.current.offsetWidth;
                    const newColumns = getResponsiveValue(columns, 3, width);
                    const newGutter = getResponsiveValue(gutter, 20, width);

                    setCurrentColumns(newColumns);
                    setCurrentGutter(newGutter);

                    if (onLayoutChange) {
                        onLayoutChange(newColumns, items);
                    }
                }
            }, 100);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            clearTimeout(resizeTimeout);
            window.removeEventListener('resize', handleResize);
        };
    }, [columns, gutter, items, onLayoutChange]);

    // Calculate column assignments
    const columnAssignments = useMemo(() => {
        const assignments: MasonryProps['items'][] = Array.from({ length: currentColumns }, () => []);

        // First, place items with fixed column assignment
        const remainingItems = items.filter(item => {
            if (item.column !== undefined && item.column >= 0 && item.column < currentColumns) {
                assignments[item.column].push(item);
                return false;
            }
            return true;
        });

        // Then distribute remaining items to columns
        remainingItems.forEach((item, index) => {
            const columnIndex = index % currentColumns;
            assignments[columnIndex].push(item);
        });

        return assignments;
    }, [items, currentColumns]);

    // Get className for an element
    const getClassName = (type: 'container' | 'column' | 'item', index: number): string => {
        const classConfig = classNames[type];
        if (typeof classConfig === 'function') {
            return classConfig(index);
        }
        return classConfig || '';
    };

    // Get style for an element
    const getStyle = (type: 'container' | 'column' | 'item', index: number): React.CSSProperties => {
        const styleConfig = styles[type];
        if (typeof styleConfig === 'function') {
            return styleConfig(index);
        }
        return styleConfig || {};
    };

    return (
        <div
            ref={containerRef}
            className={`zjpcy-masonry ${className || ''} ${getClassName('container', 0)}`}
            style={{
                display: 'flex',
                gap: `${currentGutter}px`,
                ...style,
                ...getStyle('container', 0)
            }}
        >
            {columnAssignments.map((columnItems, columnIndex) => (
                <div
                    key={`column-${columnIndex}`}
                    className={`zjpcy-masonry-column ${getClassName('column', columnIndex)}`}
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: `${currentGutter}px`,
                        ...getStyle('column', columnIndex)
                    }}
                >
                    {columnItems.map((item, itemIndex) => (
                        <div
                            key={item.key}
                            className={`zjpcy-masonry-item ${getClassName('item', itemIndex)}`}
                            style={{
                                ...getStyle('item', itemIndex)
                            }}
                        >
                            {item.content}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Masonry;
