export interface CardProps {
    /** 卡片标题 */
    title?: React.ReactNode;
    /** 标题右侧额外内容 */
    extra?: React.ReactNode;
    /** 卡片内容 */
    children?: React.ReactNode;
    /** 底部内容 */
    footer?: React.ReactNode;
    /** 卡片尺寸 */
    size?: 'small' | 'default' | 'large';
    /** 边框样式 */
    bordered?: boolean;
    /** 悬停效果 */
    hoverable?: boolean;
    /** 加载状态 */
    loading?: boolean;
    /** 封面图片 */
    cover?: React.ReactNode;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: React.CSSProperties;
    /** 头部样式 */
    headerStyle?: React.CSSProperties;
    /** 内容区域样式 */
    bodyStyle?: React.CSSProperties;
    /** 底部样式 */
    footerStyle?: React.CSSProperties;
    /** 点击卡片的事件 */
    onClick?: () => void;
}

export interface CardMetaProps {
    /** 头像/图标 */
    avatar?: React.ReactNode;
    /** 标题 */
    title?: React.ReactNode;
    /** 描述 */
    description?: React.ReactNode;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: React.CSSProperties;
}

export interface CardGridProps {
    /** 栅格内容 */
    children?: React.ReactNode;
    /** 是否hoverable */
    hoverable?: boolean;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: React.CSSProperties;
}
