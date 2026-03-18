// utils/dnd-kit-adapter.ts
// 适配器文件：解决 @dnd-kit/sortable CommonJS 模块导入问题

// 使用重新导出的方式，让 Rollup 自己处理模块转换
export {
  useSortable,
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

export type { UseSortableArguments, SortableContextProps } from '@dnd-kit/sortable';
