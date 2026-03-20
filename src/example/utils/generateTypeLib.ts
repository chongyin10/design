/**
 * 类型定义转换工具
 * 将组件的 TypeScript 类型定义转换为 Monaco Editor 可用的类型字符串
 */

import type { ExtraLib } from '../components';

/**
 * 将类型定义内容转换为 Monaco Editor 可用的类型字符串
 * @param content - 原始类型定义内容
 * @param options - 转换选项
 */
export function convertTypesToLib(
  content: string,
  options: {
    /** 要导出的接口名列表 */
    exportInterfaces?: string[];
    /** 组件名称映射：{ 接口名: 组件导出名 } */
    componentMapping?: Record<string, string>;
    /** 文件路径 */
    filePath?: string;
  } = {}
): ExtraLib {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { exportInterfaces: _unused, componentMapping = {}, filePath = 'types.d.ts' } = options;

  // 处理导入语句：移除 'react' 导入，添加 Monaco 需要的导入格式
  let processedContent = content
    .replace(/import\s+React\s+from\s+['"]react['"];?/g, '')
    .replace(/import\s+\*\s+as\s+React\s+from\s+['"]react['"];?/g, '');

  // 添加 React 类型导入
  const reactImport = `import * as React from 'react';\n\n`;

  // 移除 export 关键字（Monaco 不需要）
  processedContent = processedContent.replace(/export\s+/g, '');

  // 为指定的接口生成组件声明
  const componentDeclarations = Object.entries(componentMapping)
    .map(([interfaceName, componentName]) => {
      return `declare const ${componentName}: React.FC<${interfaceName}>;`;
    })
    .join('\n');

  // 组合最终内容
  const finalContent = `${reactImport}${processedContent}\n${componentDeclarations}`;

  return {
    content: finalContent,
    filePath,
  };
}

/**
 * 从接口定义快速生成类型库
 * 适用于简单的组件类型定义
 */
export function createTypeLib(
  interfaces: Record<string, string>,
  componentMapping: Record<string, string>,
  filePath = 'types.d.ts'
): ExtraLib {
  const interfaceDefs = Object.entries(interfaces)
    .map(([name, def]) => `interface ${name} ${def}`)
    .join('\n\n');

  const componentDefs = Object.entries(componentMapping)
    .map(([interfaceName, componentName]) => {
      return `declare const ${componentName}: React.FC<${interfaceName}>;`;
    })
    .join('\n');

  const content = `import * as React from 'react';\n\n${interfaceDefs}\n\n${componentDefs}`;

  return {
    content,
    filePath,
  };
}

/**
 * 预设的 React 类型库（用于基础支持）
 */
export const reactBaseLib: ExtraLib = {
  content: `
declare module 'react' {
  export = React;
  export as namespace React;
  
  namespace React {
    interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
      type: T;
      props: P;
      key: Key | null;
    }
    
    type ReactNode = ReactElement | string | number | ReactFragment | ReactPortal | boolean | null | undefined;
    type ReactFragment = {} | Iterable<ReactNode>;
    interface ReactPortal extends ReactElement {
      key: Key | null;
      children: ReactNode;
    }
    
    type JSXElementConstructor<P> = (props: P) => ReactElement<any, any> | null;
    type Key = string | number;
    
    interface FC<P = {}> {
      (props: P): ReactElement | null;
      displayName?: string;
    }
    
    interface CSSProperties {
      [key: string]: string | number | undefined;
    }
    
    function useState<T>(initialState: T | (() => T)): [T, Dispatch<SetStateAction<T>>];
    function useState<T = undefined>(): [T | undefined, Dispatch<SetStateAction<T | undefined>>];
    
    type Dispatch<A> = (value: A) => void;
    type SetStateAction<S> = S | ((prevState: S) => S);
  }
}
`,
  filePath: 'react-base.d.ts',
};

/**
 * Flex 组件类型库
 */
export const flexTypeLib: ExtraLib = createTypeLib(
  {
    FlexProps: `{
      children?: React.ReactNode;
      gap?: 'small' | 'middle' | 'large' | number;
      align?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
      justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
      wrap?: boolean;
      vertical?: boolean;
      style?: React.CSSProperties;
      className?: string;
    }`,
  },
  { FlexProps: 'Flex' },
  'flex-types.d.ts'
);

/**
 * Button 组件类型库
 */
export const buttonTypeLib: ExtraLib = createTypeLib(
  {
    ButtonProps: `{
      children?: React.ReactNode;
      variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'link';
      size?: 'small' | 'medium' | 'large';
      disabled?: boolean;
      loading?: boolean;
      href?: string;
      icon?: string | React.ReactNode;
      onClick?: () => void;
      className?: string;
      style?: React.CSSProperties;
    }`,
  },
  { ButtonProps: 'Button' },
  'button-types.d.ts'
);

/**
 * Splitter 组件类型库
 */
export const splitterTypeLib: ExtraLib = createTypeLib(
  {
    PanelContentProps: `{
      title?: string;
      color?: string;
      children?: React.ReactNode;
    }`,
    SplitterProps: `{
      layout?: 'horizontal' | 'vertical';
      splitterSize?: number;
      lineColor?: string;
      lineHoverColor?: string;
      disabled?: boolean;
      onResize?: (sizes: number[], index: number) => void;
      onResizeEnd?: (sizes: number[]) => void;
      className?: string;
      style?: React.CSSProperties;
      children?: React.ReactNode[];
    }`,
  },
  { PanelContentProps: 'Splitter.PanelContent', SplitterProps: 'Splitter' },
  'splitter-types.d.ts'
);

/**
 * Anchor 组件类型库
 */
export const anchorTypeLib: ExtraLib = createTypeLib(
  {
    AnchorLinkProps: `{
      href: string;
      title: string;
      children?: React.ReactNode;
      className?: string;
      style?: React.CSSProperties;
    }`,
    AnchorProps: `{
      className?: string;
      style?: React.CSSProperties;
      children?: React.ReactNode;
      offsetTop?: number;
      affix?: boolean;
      bounds?: number;
      getContainer: () => HTMLElement;
      onChange?: (activeLink: string) => void;
    }`,
  },
  { AnchorProps: 'Anchor', AnchorLinkProps: 'Anchor.Link' },
  'anchor-types.d.ts'
);

/**
 * Breadcrumb 组件类型库
 */
export const breadcrumbTypeLib: ExtraLib = createTypeLib(
  {
    BreadcrumbItem: `{
      label: React.ReactNode;
      href?: string;
    }`,
    BreadcrumbProps: `{
      items: BreadcrumbItem[];
      separator?: string;
      className?: string;
    }`,
  },
  { BreadcrumbProps: 'Breadcrumb' },
  'breadcrumb-types.d.ts'
);

/**
 * Calendar 组件类型库
 */
export const calendarTypeLib: ExtraLib = createTypeLib(
  {
    CalendarProps: `{
      selectionMode?: 'single' | 'multiple';
      value?: Date | Date[];
      defaultValue?: Date | Date[];
      onChange?: (date: Date | Date[]) => void;
      dateCellRender?: (date: Date) => React.ReactNode;
      monthCellRender?: (date: Date) => React.ReactNode;
      disabledDate?: (date: Date) => boolean;
      mode?: 'month' | 'year';
      onPanelChange?: (date: Date, mode: 'month' | 'year') => void;
      fullscreen?: boolean;
      size?: 'default' | 'small';
      layout?: 'horizontal' | 'vertical';
      firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
      showWeekend?: boolean;
      editable?: boolean;
      showLunar?: boolean;
      enableLunarDetail?: boolean;
      className?: string;
      style?: React.CSSProperties;
    }`,
  },
  { CalendarProps: 'Calendar' },
  'calendar-types.d.ts'
);

/**
 * Carousel 组件类型库
 */
export const carouselTypeLib: ExtraLib = createTypeLib(
  {
    CarouselItem: `{
      key: string;
      image: string;
      title?: React.ReactNode;
      description?: React.ReactNode;
      link?: string;
      render?: () => React.ReactNode;
    }`,
    CarouselProps: `{
      items: CarouselItem[];
      currentIndex?: number;
      defaultCurrentIndex?: number;
      onChange?: (index: number) => void;
      autoplay?: boolean;
      interval?: number;
      effect?: 'slide' | 'fade' | 'flip' | 'cards' | 'creative' | 'coverflow' | 'parallax' | 'zoom' | 'book' | 'curtain' | 'mosaic' | 'rain';
      direction?: 'horizontal' | 'vertical';
      showIndicators?: boolean;
      indicatorPosition?: 'bottom' | 'top' | 'left' | 'right';
      showArrows?: boolean;
      loop?: boolean;
      pauseOnHover?: boolean;
      duration?: number;
      indicatorProgress?: boolean;
      className?: string;
      style?: React.CSSProperties;
    }`,
  },
  { CarouselProps: 'Carousel', CarouselItem: 'CarouselItem' },
  'carousel-types.d.ts'
);

/**
 * Cascader 组件类型库
 */
export const cascaderTypeLib: ExtraLib = createTypeLib(
  {
    CascaderOption: `{
      value: any;
      label: React.ReactNode;
      disabled?: boolean;
      children?: CascaderOption[];
    }`,
    CascaderProps: `{
      value?: any[];
      defaultValue?: any[];
      onChange?: (value: any[], selectedOptions: CascaderOption[]) => void;
      options?: CascaderOption[];
      placeholder?: string;
      disabled?: boolean;
      size?: 'large' | 'middle' | 'small';
      allowClear?: boolean;
      expandTrigger?: 'click' | 'hover';
      changeOnSelect?: boolean;
      fieldNames?: {
        label?: string;
        value?: string;
        children?: string;
      };
      width?: number | string;
      dropdownWidth?: number | string;
      dropdownHeight?: number | string;
      dropdownStyle?: React.CSSProperties;
      placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';
      checkbox?: boolean;
      autoWidth?: boolean;
      className?: string;
      style?: React.CSSProperties;
    }`,
  },
  { CascaderProps: 'Cascader', CascaderOption: 'CascaderOption' },
  'cascader-types.d.ts'
);
