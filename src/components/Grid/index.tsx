import React from 'react';
import classNames from 'classnames';
import { GridProps, RowProps, ColProps } from './types';
import { GridWrapper, RowWrapper, ColWrapper } from './styles';
import './Grid.css';

export const Col = React.forwardRef<HTMLDivElement, ColProps>(
    ({ children, className, style, span, offset, push, pull, order }, ref) => {
        return (
            <ColWrapper
                ref={ref}
                className={classNames('idp-grid-col', className)}
                style={style}
                span={span}
                offset={offset}
                push={push}
                pull={pull}
                order={order}
            >
                {children}
            </ColWrapper>
        );
    }
);

Col.displayName = 'Grid.Col';

const RowComponent = React.forwardRef<HTMLDivElement, RowProps>(
    ({ children, className, style, span, gap, align, justify, wrap = true }, ref) => {
        return (
            <RowWrapper
                ref={ref}
                className={classNames('idp-grid-row', className)}
                style={style}
                span={span}
                gap={gap}
                align={align}
                justify={justify}
                wrap={wrap}
            >
                {children}
            </RowWrapper>
        );
    }
);

RowComponent.displayName = 'Grid.Row';

export const Row: typeof RowComponent & { Col: typeof Col } = Object.assign(RowComponent, { Col });

const GridComponent = React.forwardRef<HTMLDivElement, GridProps>(
    ({ children, className, style, width, height, gap, padding, backgroundColor }, ref) => {
        return (
            <GridWrapper
                ref={ref}
                className={classNames('idp-grid', className)}
                style={style}
                width={width}
                height={height}
                gap={gap}
                padding={padding}
                backgroundColor={backgroundColor}
            >
                {children}
            </GridWrapper>
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
