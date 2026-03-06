import React from 'react';

/**
 * 方位信息
 * Direction Info
 */
export interface DirectionInfo {
    /** 方位名称 */
    name: string;
    /** 方位描述 */
    description: string;
}

/**
 * 农历信息
 * Lunar Date Info
 */
export interface LunarInfo {
    // ========== 基础日期信息 ==========
    /** 农历年 */
    year: number;
    /** 农历月（1-12） */
    month: number;
    /** 农历日（1-30） */
    day: number;
    /** 农历月名称（如：正月、腊月） */
    monthName: string;
    /** 农历日名称（如：初一、十五） */
    dayName: string;
    /** 农历年名称（如：二〇二四年） */
    yearName: string;
    /** 是否闰月 */
    isLeap: boolean;
    /** 儒略日 */
    julianDay: number;
    /** 星期 */
    week: string;

    // ========== 干支生肖 ==========
    /** 生肖 */
    zodiac: string;
    /** 干支年（如：甲子年） */
    ganZhiYear: string;
    /** 干支月（如：丙寅月） */
    ganZhiMonth: string;
    /** 干支日（如：戊辰日） */
    ganZhiDay: string;

    // ========== 节气节日 ==========
    /** 节气 */
    term?: string;
    /** 节日列表 */
    festivals: string[];
    /** 是否节气日 */
    isTermDay: boolean;

    // ========== 彭祖百忌 ==========
    /** 彭祖百忌 - 日 */
    pengZuDay: string;
    /** 彭祖百忌 - 时 */
    pengZuHour: string;

    // ========== 每日宜忌 ==========
    /** 宜 - 适合做的事情 */
    yi: string[];
    /** 忌 - 不适合做的事情 */
    ji: string[];

    // ========== 吉神凶煞 ==========
    /** 吉神宜趋 */
    jiShen: string[];
    /** 凶煞宜忌 */
    xiongSha: string[];

    // ========== 神煞方位 ==========
    /** 喜神方位 */
    xiGod: DirectionInfo;
    /** 福神方位 */
    fuGod: DirectionInfo;
    /** 财神方位 */
    caiGod: DirectionInfo;
    /** 阳贵神方位 */
    yangGuiGod: DirectionInfo;
    /** 阴贵神方位 */
    yinGuiGod: DirectionInfo;

    // ========== 其他方位 ==========
    /** 胎神方位 */
    taiShen: string;
    /** 冲煞 */
    chongSha: string;
    /** 煞方 */
    sha: string;

    // ========== 纳音五行 ==========
    /** 纳音 */
    naYin: string;
    /** 年纳音 */
    yearNaYin: string;
    /** 月纳音 */
    monthNaYin: string;
    /** 日纳音 */
    dayNaYin: string;

    // ========== 星宿 ==========
    /** 二十八宿 */
    xiu: string;
    /** 星宿动物 */
    xiuAnimal: string;
    /** 星宿吉凶 */
    xiuLuck: string;
    /** 星宿歌诀 */
    xiuSong: string;

    // ========== 八字信息 ==========
    /** 八字年柱 */
    baZiYear: string;
    /** 八字月柱 */
    baZiMonth: string;
    /** 八字日柱 */
    baZiDay: string;
    /** 八字时柱（默认子时） */
    baZiHour: string;
    /** 完整八字 */
    baZi: string;

    // ========== 五行 ==========
    /** 年五行 */
    yearWuXing: string;
    /** 月五行 */
    monthWuXing: string;
    /** 日五行 */
    dayWuXing: string;
    /** 时辰五行（默认子时） */
    hourWuXing: string;

    // ========== 十神 ==========
    /** 年柱十神 */
    yearShiShen: string;
    /** 月柱十神 */
    monthShiShen: string;
    /** 时柱十神 */
    hourShiShen: string;

    // ========== 建除十二值星 ==========
    /** 十二值星（建、除、满、平、定、执、破、危、成、收、开、闭） */
    zhiXing: string;
    /** 值星说明 */
    zhiXingDesc: string;

    // ========== 十二神 ==========
    /** 青龙名堂等十二神（青龙、明堂、天刑、朱雀、金匮、天德、白虎、玉堂、天牢、玄武、司命、勾陈） */
    shiErShen: string;
    /** 十二神吉凶 */
    shiErShenLuck: '吉' | '凶';

    // ========== 黄道日 ==========
    /** 是否黄道日 */
    isHuangDao: boolean;
    /** 黄道日名称 */
    huangDaoName: string;
}

/**
 * 日期信息项
 * Date Info Item
 */
export interface DateInfoItem {
    /** 信息标题 */
    title: string;
    /** 信息内容 */
    content?: string;
    /** 信息颜色 */
    color?: string;
}

/**
 * 日期信息数据
 * Date Info Data
 */
export type DateInfoData = Record<string, DateInfoItem[]>;

/**
 * 日期面板表单配置
 * Date Panel Form Config
 */
export interface DatePanelFormConfig {
    /** 表单字段 */
    fields: DatePanelField[];
    /** 提交按钮文本 */
    submitText?: string;
    /** 取消按钮文本 */
    cancelText?: string;
}

/**
 * 日期面板字段
 * Date Panel Field
 */
export interface DatePanelField {
    /** 字段名 */
    name: string;
    /** 字段标签 */
    label: string;
    /** 字段类型 */
    type?: 'text' | 'textarea' | 'select' | 'date';
    /** 占位符 */
    placeholder?: string;
    /** 是否必填 */
    required?: boolean;
    /** 选项（用于 select 类型） */
    options?: { label: string; value: string }[];
}

/**
 * 日历组件属性
 * Calendar Component Props
 */
export interface CalendarProps {
    /** 选择模式：单选 single 或多选 multiple */
    selectionMode?: 'single' | 'multiple';
    /** 当前日期（受控）- 单选模式为 Date，多选模式为 Date[] */
    value?: Date | Date[];
    /** 默认日期（非受控）- 单选模式为 Date，多选模式为 Date[] */
    defaultValue?: Date | Date[];
    /** 日期改变时的回调 - 单选模式返回 Date，多选模式返回 Date[] */
    onChange?: (date: Date | Date[]) => void;
    /** 自定义日期单元格渲染（第二个参数为农历信息，仅在 showLunar 为 true 时提供） */
    dateCellRender?: (date: Date, lunarInfo?: LunarInfo) => React.ReactNode;
    /** 自定义月份单元格渲染 */
    monthCellRender?: (date: Date) => React.ReactNode;
    /** 不可选择的日期 */
    disabledDate?: (date: Date) => boolean;
    /** 头部渲染 */
    headerRender?: (props: {
        value: Date;
        onChange: (date: Date) => void;
        type: 'month' | 'year';
        onTypeChange: (type: 'month' | 'year') => void;
    }) => React.ReactNode;
    /** 日历模式 */
    mode?: 'month' | 'year';
    /** 模式改变时的回调 */
    onPanelChange?: (date: Date, mode: 'month' | 'year') => void;
    /** 是否全屏显示（默认 true） */
    fullscreen?: boolean;
    /** 日历尺寸（默认 default） */
    size?: 'default' | 'small';
    /** 日期单元格布局方式（默认 horizontal） */
    layout?: 'horizontal' | 'vertical';
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: React.CSSProperties;
    /** 周起始日，0 为周日，1 为周一，默认 0 */
    firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    /** 是否显示周末日期（默认 true） */
    showWeekend?: boolean;
    /** 是否启用日期信息编辑 */
    editable?: boolean;
    /** 日期信息数据 */
    dateInfo?: DateInfoData;
    /** 日期信息改变时的回调 */
    onDateInfoChange?: (date: Date, info: DateInfoItem[]) => void;
    /** 日期面板表单配置 */
    panelFormConfig?: DatePanelFormConfig;
    /** 是否显示农历（默认 false） */
    showLunar?: boolean;
    /** 自定义农历渲染 */
    lunarRender?: (lunarInfo: LunarInfo) => React.ReactNode;
    /** 是否启用双击查看农历详情（默认 false） */
    enableLunarDetail?: boolean;
}

/**
 * 日历头部属性
 * Calendar Header Props
 */
export interface CalendarHeaderProps {
    /** 当前显示的日期 */
    value: Date;
    /** 日期改变回调 */
    onChange: (date: Date) => void;
    /** 当前模式 */
    type: 'month' | 'year';
    /** 模式改变回调 */
    onTypeChange: (type: 'month' | 'year') => void;
    /** 周起始日 */
    firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * 日历日期单元格属性
 * Calendar Date Cell Props
 */
export interface CalendarDateCellProps {
    /** 日期 */
    date: Date;
    /** 是否在当前月份 */
    inCurrentMonth: boolean;
    /** 是否是今天 */
    isToday: boolean;
    /** 是否被选中 */
    isSelected: boolean;
    /** 是否禁用 */
    disabled: boolean;
    /** 自定义渲染内容 */
    content?: React.ReactNode;
    /** 点击回调 */
    onClick?: (date: Date) => void;
}

/**
 * 日历月份单元格属性
 * Calendar Month Cell Props
 */
export interface CalendarMonthCellProps {
    /** 月份日期（该月的第一天） */
    date: Date;
    /** 是否被选中 */
    isSelected: boolean;
    /** 点击回调 */
    onClick?: (date: Date) => void;
}

/**
 * 日历主体属性
 * Calendar Body Props
 */
export interface CalendarBodyProps {
    /** 当前显示的日期 */
    value: Date;
    /** 选中的日期 */
    selectedDate: Date;
    /** 日期点击回调 */
    onDateClick: (date: Date) => void;
    /** 自定义日期单元格渲染 */
    dateCellRender?: (date: Date) => React.ReactNode;
    /** 不可选择的日期 */
    disabledDate?: (date: Date) => boolean;
    /** 周起始日 */
    firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    /** 是否显示周末 */
    showWeekend: boolean;
}

/**
 * 日历年份面板属性
 * Calendar Year Panel Props
 */
export interface CalendarYearPanelProps {
    /** 当前显示的日期 */
    value: Date;
    /** 选中的日期 */
    selectedDate: Date;
    /** 月份点击回调 */
    onMonthClick: (date: Date) => void;
    /** 自定义月份单元格渲染 */
    monthCellRender?: (date: Date) => React.ReactNode;
}

/**
 * 周标题配置
 * Weekday Title Config
 */
export interface WeekdayConfig {
    /** 周几索引（0-6） */
    index: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    /** 显示文本 */
    label: string;
    /** 短文本 */
    shortLabel: string;
}
