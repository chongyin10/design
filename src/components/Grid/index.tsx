'use client';

import React, { createContext, useContext } from 'react';
import classNames from 'classnames';
import { GridProps, RowProps, ColProps } from './types';
import { GridWrapper, RowWrapper, ColWrapper } from './styles';
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
            <ColWrapper
                ref={ref}
                className={classNames('zjpcy-grid-col', className)}
                style={style}
                span={span}
                offset={offset}
                push={push}
                pull={pull}
                order={order}
                gap={finalGap}
            >
                {children}
            </ColWrapper>
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
                <RowWrapper
                    ref={ref}
                    className={classNames('zjpcy-grid-row', className)}
                    style={style}
                    span={span}
                    rowGap={rowGap}
                    align={align}
                    justify={justify}
                    wrap={wrap}
                >
                    {children}
                </RowWrapper>
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
                <GridWrapper
                    ref={ref}
                    className={classNames('zjpcy-grid', className)}
                    style={style}
                    width={width}
                    height={height}
                    gap={gap}
                    padding={padding}
                    backgroundColor={backgroundColor}
                >
                    {children}
                </GridWrapper>
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
