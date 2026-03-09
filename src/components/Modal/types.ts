export interface ModalProps {
    visible: boolean;
    title?: string;
    width?: number | string;
    height?: number | string;
    headerHeight?: number | string;
    footerHeight?: number | string;
    confirmLoading?: boolean;
    direction?: 'center' | 'top-right' | 'bottom-right' | 'bottom-left' | 'normal';
    top?: number;
    /** 触发器元素的 ref，用于 normal 模式时从触发器位置开始动画 */
    triggerRef?: React.RefObject<HTMLElement>;
    footer?: null | React.ReactNode;
    bordered?: boolean;
    onCancel?: () => void;
    onOk?: () => void;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    getContainer?: HTMLElement | (() => HTMLElement) | false;
    okText?: string;
    cancelText?: string;
    maskStyle?: React.CSSProperties;
    maskClassName?: string;
    zIndex?: number;
    /** 内容区域的自定义className */
    contentClassName?: string;
    /** 内容区域的自定义style，优先级高于默认样式 */
    contentStyle?: React.CSSProperties;
    /** 关闭时销毁 Modal 里的子元素 */
    destroyOnClose?: boolean;
    /** 是否加载中状态 */
    loading?: boolean;
    /** 自定义加载图标 */
    loadingIcon?: React.ReactNode;
}
