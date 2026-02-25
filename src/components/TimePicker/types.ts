import React from 'react';

export interface TimePickerProps {
    /** 尺寸，可选 'small' | 'middle' | 'large'，默认 'middle' */
    size?: 'small' | 'middle' | 'large';
    /** 当前值 */
    value?: string;
    /** 默认值 */
    defaultValue?: string;
    /** 值改变时的回调 */
    onChange?: (time: string) => void;
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
    /** 时间格式，默认 HH:mm:ss */
    format?: string;
    /** 是否显示清除按钮 */
    allowClear?: boolean;
    /** 小时选项步长 */
    hourStep?: number;
    /** 分钟选项步长 */
    minuteStep?: number;
    /** 秒选项步长 */
    secondStep?: number;
    /** 禁用的小时 */
    disabledHours?: () => number[];
    /** 禁用的分钟 */
    disabledMinutes?: (selectedHour: number) => number[];
    /** 禁用的秒 */
    disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
    /** 隐藏列：可传入 'hour' | 'minute' | 'second' 数组 */
    hideDisabledOptions?: boolean;
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
    /** 是否显示"此刻"按钮 */
    showNow?: boolean;
    /** 是否显示"确定"按钮 */
    showOk?: boolean;
}

export interface TimePickerPanelProps {
    /** 当前值 */
    value?: string;
    /** 值改变时的回调 */
    onChange?: (time: string) => void;
    /** 时间格式 */
    format: string;
    /** 小时选项步长 */
    hourStep: number;
    /** 分钟选项步长 */
    minuteStep: number;
    /** 秒选项步长 */
    secondStep: number;
    /** 禁用的小时 */
    disabledHours?: () => number[];
    /** 禁用的分钟 */
    disabledMinutes?: (selectedHour: number) => number[];
    /** 禁用的秒 */
    disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
    /** 隐藏禁用选项 */
    hideDisabledOptions?: boolean;
    /** 是否显示"此刻"按钮 */
    showNow?: boolean;
    /** 是否显示"确定"按钮 */
    showOk?: boolean;
    /** 点击"此刻"按钮的回调 */
    onNow?: () => void;
    /** 点击"确定"按钮的回调 */
    onOk?: () => void;
}

export interface TimeColumnProps {
    /** 选项列表 */
    options: number[];
    /** 当前选中值 */
    value?: number;
    /** 值改变时的回调 */
    onChange?: (value: number) => void;
    /** 单位标签（时/分/秒） */
    unit: string;
}

export interface TimeRangePickerProps {
    /** 当前值 [开始时间, 结束时间] */
    value?: [string, string];
    /** 默认值 */
    defaultValue?: [string, string];
    /** 值改变时的回调 */
    onChange?: (times: [string, string]) => void;
    /** 占位符 [开始占位符, 结束占位符] */
    placeholder?: [string, string];
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
    /** 尺寸 */
    size?: 'small' | 'middle' | 'large';
    /** 时间格式，默认 HH:mm:ss */
    format?: string;
    /** 是否显示清除按钮 */
    allowClear?: boolean;
    /** 小时选项步长 */
    hourStep?: number;
    /** 分钟选项步长 */
    minuteStep?: number;
    /** 秒选项步长 */
    secondStep?: number;
    /** 禁用的小时 */
    disabledHours?: () => number[];
    /** 禁用的分钟 */
    disabledMinutes?: (selectedHour: number) => number[];
    /** 禁用的秒 */
    disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
    /** 隐藏禁用选项 */
    hideDisabledOptions?: boolean;
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
    /** 分隔符，默认 ~ */
    separator?: React.ReactNode;
}
