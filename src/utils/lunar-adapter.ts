// utils/lunar-adapter.ts
// 适配器文件：解决 lunar-typescript CommonJS 模块导入问题

export { Solar, Lunar, HolidayUtil } from 'lunar-typescript';

// 导出类型
export type { Solar as SolarType, Lunar as LunarType } from 'lunar-typescript';
