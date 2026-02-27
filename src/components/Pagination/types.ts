export interface PaginationProps {
  total?: number;
  current?: number;
  defaultCurrent?: number;
  pageSize?: number;
  defaultPageSize?: number;
  onChange?: (current: number, pageSize: number) => void;
  pageSizeOptions?: (string | number)[];
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => React.ReactNode;
  size?: 'default' | 'small';
  /**
   * 简洁模式
   */
  simple?: boolean;
  /**
   * 禁用状态
   */
  disabled?: boolean;
  /**
   * 只有一页时隐藏
   */
  hideOnSinglePage?: boolean;
  /**
   * 分页组件位置对齐方式
   */
  align?: 'flex-start' | 'center' | 'flex-end';
  /**
   * 自定义CSS类名
   */
  className?: string;
  /**
   * 自定义内联样式
   */
  style?: React.CSSProperties;
}

export {};