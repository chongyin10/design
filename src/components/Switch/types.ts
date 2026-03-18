import { CSSProperties, ReactNode } from 'react';

/**
 * Switch 组件属性接口
 */
export interface SwitchProps {
  /** 指定当前是否选中（受控模式） */
  checked?: boolean;
  /** 初始是否选中（非受控模式） */
  defaultChecked?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 加载中 */
  loading?: boolean;
  /** 开关大小 */
  size?: 'default' | 'small';
  /** 自定义宽度（单位：px），不传则使用默认宽度 */
  width?: number;
  /** 选中时的内容 */
  checkedChildren?: ReactNode;
  /** 非选中时的内容 */
  unCheckedChildren?: ReactNode;
  /** 自定义样式 */
  styles?: {
    wrapper?: CSSProperties;
    track?: CSSProperties;
    thumb?: CSSProperties;
    loading?: CSSProperties;
    inner?: CSSProperties;
  };
  /** 变化时的回调函数 */
  onChange?: (checked: boolean) => void;
  /** 标签文案，显示在开关前面 */
  label?: string | ReactNode;
  /** 标签到开关的距离 */
  labelGap?: string | number;
  /** 标签的CSS类名 */
  labelClassName?: string;
  /** 标签的样式 */
  labelStyle?: CSSProperties;
  /** 自定义 CSS 类名 */
  className?: string;
  /** 自定义样式对象 */
  style?: CSSProperties;
}

/**
 * 样式配置接口
 */
export interface SwitchStyles {
  wrapper?: CSSProperties;
  track?: CSSProperties;
  thumb?: CSSProperties;
  loading?: CSSProperties;
  inner?: CSSProperties;
}

/**
 * 尺寸配置接口
 */
export interface SwitchSizeConfig {
  width: number;
  height: number;
  thumbSize: number;
  thumbOffset: number;
  thumbCheckedOffset: number;
}

/**
 * Switch 主题配置接口
 */
export interface SwitchThemeConfig {
  colors: {
    primary: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
    default: string;
  };
  sizes: {
    default: SwitchSizeConfig;
    small: SwitchSizeConfig;
  };
  shadows: {
    thumb: string;
    thumbHover: string;
  };
}
