'use client';

import React, { createContext, useContext } from 'react';
import { GridProps, RowProps, ColProps } from './types';
import {
    getGridWrapperClassName,
    getGridWrapperStyle,
    getRowWrapperClassName,
    getRowWrapperStyle,
    getColWrapperClassName,
    getColWrapperStyle,
} from './styles';
import './Grid.css';

// 创建 Context 用于传递 Grid 的 gap
const GridContext = createContext<{ gap?: number | string }>({});

// 创建 Context 用于传递 Row 的 gap
const RowContext = createContext<{ gap?: number | string }>({});

export const Col = React.forwardRef<HTMLDivElement, ColProps>(
    ({ children, className, style, span, offset, push, pull, order, gap: colGap }, ref) => {
        // 获取 Row 传递的 gap（如果 Col 在 Row 内部）
        const rowContext = useContext(RowContext);
        const rowGap = rowContext?.gap;

        // 优先级：Col.gap > Row.gap
        const finalGap = colGap !== undefined ? colGap : rowGap;

        return (
            <div
                ref={ref}
                className={getColWrapperClassName({ className })}
                style={getColWrapperStyle({ span, offset, push, pull, order, gap: finalGap, style })}
            >
                {children}
            </div>
        );
    }
);

Col.displayName = 'Grid.Col';

const RowComponent = React.forwardRef<HTMLDivElement, RowProps>(
    ({ children, className, style, span, gap, rowGap, align, justify, wrap = true }, ref) => {
        // 获取 Grid 传递的 gap（如果 Row 在 Grid 内部）
        const gridContext = useContext(GridContext);
        const gridGap = gridContext?.gap;

        // 优先级：Row.gap > Grid.gap（用于水平间距）
        const finalGap = gap !== undefined ? gap : gridGap;

        return (
            <RowContext.Provider value={{ gap: finalGap }}>
                <div
                    ref={ref}
                    className={getRowWrapperClassName({ className })}
                    style={getRowWrapperStyle({ span, rowGap, align, justify, wrap, style })}
                >
                    {children}
                </div>
            </RowContext.Provider>
        );
    }
);

RowComponent.displayName = 'Grid.Row';

export const Row: typeof RowComponent & { Col: typeof Col } = Object.assign(RowComponent, { Col });

const GridComponent = React.forwardRef<HTMLDivElement, GridProps>(
    ({ children, className, style, width, height, gap, padding, backgroundColor }, ref) => {
        return (
            <GridContext.Provider value={{ gap }}>
                <div
                    ref={ref}
                    className={getGridWrapperClassName({ className })}
                    style={getGridWrapperStyle({ width, height, gap, padding, backgroundColor, style })}
                >
                    {children}
                </div>
            </GridContext.Provider>
        );
    }
);

GridComponent.displayName = 'Grid';

const Grid = Object.assign(GridComponent, { Row, Col }) as React.ForwardRefExoticComponent<
    React.PropsWithoutRef<GridProps> & React.RefAttributes<HTMLDivElement>
> & {
    Row: typeof Row;
    Col: typeof Col;
};

export default Grid;
export * from './types';
