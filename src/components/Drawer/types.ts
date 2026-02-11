import React from 'react';

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

export interface DrawerProps {
    /** 是否可见 */
    open: boolean;
    /** 抽屉标题 */
    title?: React.ReactNode;
    /** 抽屉宽度（placement为left或right时有效） */
    width?: number | string;
    /** 抽屉高度（placement为top或bottom时有效） */
    height?: number | string;
    /** 抽屉位置 */
    placement?: DrawerPlacement;
    /** 点击遮罩层是否允许关闭 */
    maskClosable?: boolean;
    /** 是否显示遮罩层 */
    mask?: boolean;
    /** 关闭回调函数 */
    onClose: () => void;
    /** 抽屉内容 */
    children?: React.ReactNode;
    /** 额外类名 */
    className?: string;
    /** 抽屉样式 */
    style?: React.CSSProperties;
    /** 遮罩层样式 */
    maskStyle?: React.CSSProperties;
    /** 遮罩层类名 */
    maskClassName?: string;
    /** 内容区域类名 */
    contentClassName?: string;
    /** 内容区域样式 */
    contentStyle?: React.CSSProperties;
    /** 头部内容：false表示不显示，React.ReactNode表示自定义内容，未传值则显示默认的标题和关闭按钮 */
    header?: React.ReactNode | false;
    /** 头部类名 */
    headerClassName?: string;
    /** 头部样式 */
    headerStyle?: React.CSSProperties;
    /** 页脚：false表示不显示，React.ReactNode表示自定义内容，未传值则显示默认的取消和确认按钮 */
    footer?: React.ReactNode | false;
    /** 页脚类名 */
    footerClassName?: string;
    /** 页脚样式 */
    footerStyle?: React.CSSProperties;
    /** 指定挂载节点，默认为false渲染在当前DOM中 */
    getContainer?: (() => HTMLElement) | HTMLElement | false;
    /** 关闭后是否销毁子元素 */
    destroyOnClose?: boolean;
    /** 是否显示关闭按钮 */
    closable?: boolean;
    /** z-index层级 */
    zIndex?: number;
    /** 是否加载中状态 */
    loading?: boolean;
    /** 自定义加载图标 */
    loadingIcon?: React.ReactNode;
    /** 是否支持拖拽调整大小，默认false */
    resizable?: boolean;
    /** 拖拽手柄大小（像素），默认8px */
    resizeHandleSize?: number;
    /** 拖拽时最小宽度 */
    minWidth?: number;
    /** 拖拽时最小高度 */
    minHeight?: number;
    /** 大小变化回调 */
    onChange?: (size: { width?: number; height?: number }) => void;
}
