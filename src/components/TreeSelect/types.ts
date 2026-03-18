import { CSSProperties, ReactNode } from 'react';

/**
 * 树节点数据接口
 */
export interface TreeSelectNode {
    /** 节点标题 */
    title: ReactNode;
    /** 节点值 */
    value: any;
    /** 是否禁用 */
    disabled?: boolean;
    /** 子节点 */
    children?: TreeSelectNode[];
}

/**
 * 样式配置接口
 */
export interface TreeSelectStyles {
    /** 容器样式 */
    wrapper?: CSSProperties;
    /** 选择框样式 */
    selection?: CSSProperties;
    /** 下拉面板样式 */
    dropdown?: CSSProperties;
    /** 树节点样式 */
    treeNode?: CSSProperties;
    /** 标签样式 */
    tag?: CSSProperties;
}

/**
 * TreeSelect 组件属性接口
 */
export interface TreeSelectProps {
    /** 树形数据 */
    treeData?: TreeSelectNode[];
    /** 选中的值（受控） */
    value?: any | any[];
    /** 默认选中的值（非受控） */
    defaultValue?: any | any[];
    /** 选中值变化时的回调 */
    onChange?: (value: any | any[], selectedNodes: TreeSelectNode[]) => void;
    /** 占位符 */
    placeholder?: string;
    /** 是否禁用 */
    disabled?: boolean;
    /** 是否支持多选 */
    multiple?: boolean;
    /** 最大标签数量（多选时有效） */
    maxTagCount?: number;
    /** 是否显示清除按钮 */
    allowClear?: boolean;
    /** 尺寸 */
    size?: 'large' | 'middle' | 'small';
    /** 自定义样式配置对象 */
    styles?: TreeSelectStyles;
    /** 自定义类名 */
    className?: string;
    /** 下拉框宽度 */
    dropdownWidth?: number | string;
    /** 下拉框高度 */
    dropdownHeight?: number | string;
    /** 是否支持搜索 */
    showSearch?: boolean;
    /** 自定义过滤函数 */
    filterOption?: (input: string, option: TreeSelectNode) => boolean;
    /** 选中后是否关闭下拉框 */
    autoClearSearchValue?: boolean;
    /** 自定义字段名 */
    fieldNames?: {
        title?: string;
        value?: string;
        children?: string;
    };
    /** 宽度 */
    width?: number | string;
    /** 自定义样式 */
    style?: CSSProperties;
}

/**
 * 尺寸配置接口
 */
export interface TreeSelectSizeConfig {
    selectionHeight: number;
    selectionPadding: string;
    fontSize: number;
    tagPadding: string;
}

/**
 * TreeSelect 主题配置接口
 */
export interface TreeSelectThemeConfig {
    colors: {
        primary: string;
        primaryHover: string;
        text: string;
        textSecondary: string;
        textTertiary: string;
        border: string;
        borderLight: string;
        bgWhite: string;
        bgLight: string;
        selectedBg: string;
    };
    sizes: {
        large: TreeSelectSizeConfig;
        middle: TreeSelectSizeConfig;
        small: TreeSelectSizeConfig;
    };
}
