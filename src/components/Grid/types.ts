export interface GridProps {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    /** 宽度，默认为 100% */
    width?: number | string;
    /** 高度 */
    height?: number | string;
    /** 栅格间距 */
    gap?: number | string;
    /** 内边距 */
    padding?: number | string;
    /** 背景色 */
    backgroundColor?: string;
}

export interface RowProps {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    /** 栅格占位格数，总共 24 格 */
    span?: number;
    /** 栅格水平间距（Col 之间的间距） */
    gap?: number | string;
    /** 栅格垂直间距（Row 之间的上下间距） */
    rowGap?: number | string;
    /** 对齐方式 */
    align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
    /** 主轴对齐方式 */
    justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
    /** 是否换行 */
    wrap?: boolean;
}

export interface ColProps {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    /** 栅格占位格数，总共 24 格 */
    span?: number;
    /** 栅格左侧间隔格数 */
    offset?: number;
    /** 栅格向右移动格数 */
    push?: number;
    /** 栅格向左移动格数 */
    pull?: number;
    /** 栅格顺序 */
    order?: number;
    /** 栅格间距，优先级最高 */
    gap?: number | string;
}
