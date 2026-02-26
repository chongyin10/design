import React from 'react';

export interface CarouselItem {
  /** 唯一标识 */
  key: string;
  /** 图片地址 */
  image: string;
  /** 标题 */
  title?: React.ReactNode;
  /** 描述 */
  description?: React.ReactNode;
  /** 点击跳转链接 */
  link?: string;
  /** 自定义渲染内容 */
  render?: () => React.ReactNode;
}

export type CarouselEffect = 'slide' | 'fade' | 'flip' | 'cards' | 'creative' | 'coverflow' | 'parallax' | 'zoom' | 'book' | 'curtain' | 'mosaic' | 'rain';

export type CarouselDirection = 'horizontal' | 'vertical';

export type CarouselIndicatorPosition = 'bottom' | 'top' | 'left' | 'right' | 'center';

export type CarouselArrowPosition = 'inside' | 'outside' | 'none';

export interface CarouselProps {
  /** 轮播数据 */
  items: CarouselItem[];
  /** 当前激活的索引 */
  currentIndex?: number;
  /** 默认激活的索引 */
  defaultCurrentIndex?: number;
  /** 切换时的回调 */
  onChange?: (index: number) => void;
  /** 是否自动播放 */
  autoplay?: boolean;
  /** 自动播放间隔(ms) */
  interval?: number;
  /** 切换动画效果 */
  effect?: CarouselEffect;
  /** 切换方向 */
  direction?: CarouselDirection;
  /** 是否显示指示器 */
  showIndicators?: boolean;
  /** 指示器位置 */
  indicatorPosition?: CarouselIndicatorPosition;
  /** 是否显示箭头 */
  showArrows?: boolean;
  /** 是否循环播放 */
  loop?: boolean;
  /** 是否暂停在hover时 */
  pauseOnHover?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 内容区域类名 */
  contentClassName?: string;
  /** 内容区域样式 */
  contentStyle?: React.CSSProperties;
  /** 图片点击事件 */
  onItemClick?: (item: CarouselItem, index: number) => void;
  /** 切换动画时长(ms) */
  duration?: number;
  /** 自定义左箭头图标 */
  prevIcon?: React.ReactNode;
  /** 自定义右箭头图标 */
  nextIcon?: React.ReactNode;
  /** 自定义上箭头图标（垂直方向） */
  upIcon?: React.ReactNode;
  /** 自定义下箭头图标（垂直方向） */
  downIcon?: React.ReactNode;
  /** 是否启用指示器进度动画（自动播放时显示进度） */
  indicatorProgress?: boolean;
}
