import styled from 'styled-components';

export const GridWrapper = styled.div.withConfig({
    shouldForwardProp: (prop) => !['width', 'height', 'gap', 'padding', 'backgroundColor'].includes(prop),
})<{
    width?: number | string;
    height?: number | string;
    gap?: number | string;
    padding?: number | string;
    backgroundColor?: string;
}>`
    width: ${props => props.width !== undefined ? (typeof props.width === 'number' ? `${props.width}px` : props.width) : '100%'};
    height: ${props => props.height !== undefined ? (typeof props.height === 'number' ? `${props.height}px` : props.height) : 'auto'};
    gap: ${props => props.gap !== undefined ? (typeof props.gap === 'number' ? `${props.gap}px` : props.gap) : '0'};
    padding: ${props => props.padding !== undefined ? (typeof props.padding === 'number' ? `${props.padding}px` : props.padding) : '0'};
    background-color: ${props => props.backgroundColor || 'transparent'};
    box-sizing: border-box;
`;

export const RowWrapper = styled.div.withConfig({
    shouldForwardProp: (prop) => !['span', 'rowGap', 'align', 'justify', 'wrap'].includes(prop),
})<{
    span?: number;
    rowGap?: number | string;
    align?: string;
    justify?: string;
    wrap?: boolean;
}>`
    display: flex;
    width: ${props => props.span !== undefined ? `calc(${props.span} / 24 * 100%)` : '100%'};
    row-gap: ${props => props.rowGap !== undefined ? (typeof props.rowGap === 'number' ? `${props.rowGap}px` : props.rowGap) : '0'};
    align-items: ${props => props.align || 'stretch'};
    justify-content: ${props => props.justify || 'flex-start'};
    flex-wrap: ${props => props.wrap !== false ? 'wrap' : 'nowrap'};
    box-sizing: border-box;
`;

export const ColWrapper = styled.div.withConfig({
    shouldForwardProp: (prop) => !['span', 'offset', 'push', 'pull', 'order', 'gap'].includes(prop),
})<{
    span?: number;
    offset?: number;
    push?: number;
    pull?: number;
    order?: number;
    gap?: number | string;
}>`
    flex: ${props => props.span !== undefined ? `0 0 calc(${props.span} / 24 * 100%)` : '1'};
    max-width: ${props => props.span !== undefined ? `calc(${props.span} / 24 * 100%)` : '100%'};
    margin-left: ${props => {
        if (props.pull !== undefined) return `calc(-${props.pull} / 24 * 100%)`;
        if (props.offset !== undefined) return `calc(${props.offset} / 24 * 100%)`;
        return '0';
    }};
    margin-right: ${props => props.push !== undefined ? `calc(${props.push} / 24 * 100%)` : '0'};
    order: ${props => props.order !== undefined ? props.order : '0'};
    padding-left: ${props => props.gap !== undefined ? (typeof props.gap === 'number' ? `${props.gap / 2}px` : `calc(${props.gap} / 2)`) : '0'};
    padding-right: ${props => props.gap !== undefined ? (typeof props.gap === 'number' ? `${props.gap / 2}px` : `calc(${props.gap} / 2)`) : '0'};
    box-sizing: border-box;
`;
