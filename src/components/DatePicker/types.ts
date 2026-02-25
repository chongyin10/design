import React from 'react';

/** 日期格式类型 */
export type DateFormat = 'YYYY-MM-DD' | 'YYYY/MM/DD' | 'DD-MM-YYYY' | 'MM/DD/YYYY';

/** 日期选择器属性 */
export interface DatePickerProps {
    /** 尺寸，可选 'small' | 'middle' | 'large'，默认 'middle' */
    size?: 'small' | 'middle' | 'large';
    /** 当前值 */
    value?: string;
    /** 默认值 */
    defaultValue?: string;
    /** 值改变时的回调 */
    onChange?: (date: string) => void;
    /** 占位符 */
    placeholder?: string;
    /** 是否禁用 */
    disabled?: boolean;
    /** 只读 */
    readOnly?: boolean;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: React.CSSProperties;
    /** 宽度 */
    width?: string | number;
    /** 日期格式，默认 'YYYY-MM-DD' */
    format?: DateFormat;
    /** 是否显示清除按钮 */
    allowClear?: boolean;
    /** 禁用日期的函数 */
    disabledDate?: (date: Date) => boolean;
    /** 不可选择的日期 */
    disabledDates?: string[];
    /** 标签 */
    label?: string | React.ReactNode;
    /** 标签到输入框的距离 */
    labelGap?: string | number;
    /** 标签的CSS类名 */
    labelClassName?: string;
    /** 标签的样式 */
    labelStyle?: React.CSSProperties;
    /** 面板打开状态改变时的回调 */
    onOpenChange?: (open: boolean) => void;
    /** 是否打开面板（受控） */
    open?: boolean;
    /** 显示今天的按钮 */
    showToday?: boolean;
    /** 显示确定的按钮 */
    showOk?: boolean;
}

/** 日历面板属性 */
export interface CalendarPanelProps {
    /** 当前选中的值 */
    value?: string;
    /** 值改变时的回调 */
    onChange?: (date: string) => void;
    /** 日期格式 */
    format: DateFormat;
    /** 禁用日期的函数 */
    disabledDate?: (date: Date) => boolean;
    /** 不可选择的日期 */
    disabledDates?: string[];
    /** 显示今天的按钮 */
    showToday?: boolean;
    /** 显示确定的按钮 */
    showOk?: boolean;
    /** 点击今天的回调 */
    onToday?: () => void;
    /** 点击确定的回调 */
    onOk?: () => void;
}

/** 日历头部属性 */
export interface CalendarHeaderProps {
    /** 当前显示的年月 */
    currentMonth: Date;
    /** 切换到上一个月 */
    onPrevMonth: () => void;
    /** 切换到下一个月 */
    onNextMonth: () => void;
    /** 点击年份的回调 */
    onYearClick: () => void;
    /** 点击月份的回调 */
    onMonthClick: () => void;
}

/** 月份选择器属性 */
export interface MonthPickerProps {
    /** 当前选中的月份 */
    currentMonth: number;
    /** 选择月份的回调 */
    onMonthSelect: (month: number) => void;
    /** 返回日历视图的回调 */
    onBack: () => void;
}

/** 月份单元格属性 */
export interface MonthCellProps {
    /** 是否被选中 */
    isSelected?: boolean;
    /** 是否是当前月份 */
    isCurrentMonth?: boolean;
}

/** 年份选择器属性 */
export interface YearPickerProps {
    /** 当前选中的年份 */
    currentYear: number;
    /** 当前显示页的起始年份 */
    startYear: number;
    /** 选择年份的回调 */
    onYearSelect: (year: number) => void;
    /** 返回日历视图的回调 */
    onBack: () => void;
    /** 切换到上一页的回调 */
    onPrevPage: () => void;
    /** 切换到下一页的回调 */
    onNextPage: () => void;
}

/** 年份单元格属性 */
export interface YearCellProps {
    /** 是否被选中 */
    isSelected?: boolean;
    /** 是否是当前年份 */
    isCurrentYear?: boolean;
}

/** 日历日期单元格属性 */
export interface DateCellProps {
    /** 日期 */
    date: Date;
    /** 是否被选中 */
    isSelected: boolean;
    /** 是否是今天 */
    isToday: boolean;
    /** 是否禁用 */
    disabled: boolean;
    /** 是否是当前月的日期 */
    isCurrentMonth: boolean;
    /** 点击回调 */
    onClick: () => void;
}
