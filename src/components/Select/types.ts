import { CSSProperties, ReactNode } from 'react';

/**
 * Select 选项数据类型
 */
export interface SelectOption {
    /** 选项值 */
    value: string | number;
    /** 选项显示文本 */
    label: string | ReactNode;
    /** 是否禁用 */
    disabled?: boolean;
    /** 自定义样式 */
    style?: CSSProperties;
    /** 自定义类名 */
    className?: string;
}

/**
 * Select 组件属性接口
 */
export interface SelectProps {
    /** 当前选中的值（受控模式） */
    value?: string | number | (string | number)[];
    /** 默认选中的值（非受控模式） */
    defaultValue?: string | number | (string | number)[];
    /** 选项列表 */
    options?: SelectOption[];
    /** 是否禁用 */
    disabled?: boolean;
    /** 加载中状态 */
    loading?: boolean;
    /** 是否多选 */
    mode?: 'single' | 'multiple';
    /** 占位符文本 */
    placeholder?: string;
    /** 是否可搜索 */
    searchable?: boolean;
    /** 是否可清除 */
    clearable?: boolean;
    /** 组件尺寸 */
    size?: 'small' | 'default' | 'large';
    /** 组件宽度 */
    width?: string | number;
    /** 自定义样式 */
    styles?: SelectStyles;
    /** 外层容器样式 */
    style?: CSSProperties;
    /** 变化时的回调函数 */
    onChange?: (value: string | number | (string | number)[], option?: SelectOption | SelectOption[]) => void;
    /** 展开/收起时的回调函数 */
    onOpenChange?: (open: boolean) => void;
    /** 搜索时的回调函数 */
    onSearch?: (value: string) => void;
    /** 自定义选项渲染 */
    optionRender?: (option: SelectOption) => ReactNode;
    /** 自定义选中项渲染 */
    tagRender?: (props: TagRenderProps) => ReactNode;
    /** 标签文案，显示在选择框前面 */
    label?: string | ReactNode;
    /** 标签到选择框的距离 */
    labelGap?: string | number;
    /** 标签的CSS类名 */
    labelClassName?: string;
    /** 标签的样式 */
    labelStyle?: CSSProperties;
    /** 自定义类名 */
    className?: string;
    /** 是否显示下拉箭头 */
    showArrow?: boolean;
    /** 下拉菜单的最大高度 */
    maxHeight?: number;
    /** 空状态显示内容 */
    emptyContent?: ReactNode;
    /** 获取弹出层容器 */
    getPopupContainer?: () => HTMLElement;
}

/**
 * 标签渲染属性
 */
export interface TagRenderProps {
    /** 选项值 */
    value: string | number;
    /** 选项标签 */
    label: string | ReactNode;
    /** 关闭回调 */
    onClose: (e?: React.MouseEvent) => void;
    /** 是否禁用 */
    disabled?: boolean;
}

/**
 * 样式配置接口
 */
export interface SelectStyles {
    /** 外层容器样式 */
    wrapper?: CSSProperties;
    /** 选择器样式 */
    selector?: CSSProperties;
    /** 下拉菜单样式 */
    dropdown?: CSSProperties;
    /** 选项样式 */
    option?: CSSProperties;
    /** 选中标签样式（多选模式） */
    tag?: CSSProperties;
}

/**
 * 尺寸配置接口
 */
export interface SelectSizeConfig {
    height: string;
    padding: string;
    fontSize: string;
    tagHeight: string;
}

/**
 * Select 主题配置接口
 */
export interface SelectThemeConfig {
    colors: {
        primary: string;
        text: string;
        textSecondary: string;
        textDisabled: string;
        border: string;
        borderHover: string;
        borderFocus: string;
        bg: string;
        bgHover: string;
        bgSelected: string;
    };
    sizes: {
        small: SelectSizeConfig;
        default: SelectSizeConfig;
        large: SelectSizeConfig;
    };
}
