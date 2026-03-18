'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import Icon from '../Icon';
import { DateRangePickerProps, DateFormat } from './types';
import {
    getDateRangePickerContainerStyle,
    getDateRangePickerTriggerClassName,
    getDateRangePickerTriggerStyle,
    getDateRangePickerInputClassName,
    getDateRangePickerValueClassName,
    getDateRangePickerDropdownStyle,
    getDateRangePickerFooterButtonClassName,
    getDateRangePickerDateCellClassName,
} from './styles';

// 工具函数：格式化日期
const formatDate = (date: Date | null, format: DateFormat): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    switch (format) {
        case 'YYYY/MM/DD':
            return `${year}/${month}/${day}`;
        case 'DD-MM-YYYY':
            return `${day}-${month}-${year}`;
        case 'MM/DD/YYYY':
            return `${month}/${day}/${year}`;
        case 'YYYY-MM-DD':
        default:
            return `${year}-${month}-${day}`;
    }
};

// 工具函数：解析日期字符串
const parseDate = (dateStr: string | undefined, format: DateFormat): Date | null => {
    if (!dateStr) return null;

    let year: number, month: number, day: number;

    try {
        switch (format) {
            case 'YYYY/MM/DD':
                [year, month, day] = dateStr.split('/').map(Number);
                break;
            case 'DD-MM-YYYY':
                [day, month, year] = dateStr.split('-').map(Number);
                break;
            case 'MM/DD/YYYY':
                [month, day, year] = dateStr.split('/').map(Number);
                break;
            case 'YYYY-MM-DD':
            default:
                [year, month, day] = dateStr.split('-').map(Number);
                break;
        }

        if (isNaN(year) || isNaN(month) || isNaN(day)) return null;

        const date = new Date(year, month - 1, day);
        // 验证日期有效性
        if (date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day) {
            return null;
        }
        return date;
    } catch {
        return null;
    }
};

// 工具函数：获取月份的天数
const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
};

// 工具函数：获取月份第一天是星期几
const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
};

// 工具函数：比较两个日期是否相同（只比较年月日）
const isSameDate = (date1: Date | null, date2: Date | null): boolean => {
    if (!date1 || !date2) return false;
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
};

// 工具函数：判断是否为今天
const isToday = (date: Date): boolean => {
    const today = new Date();
    return isSameDate(date, today);
};

// 工具函数：比较日期先后
const isDateBefore = (date1: Date, date2: Date): boolean => {
    const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return d1.getTime() < d2.getTime();
};

const RangePicker: React.FC<DateRangePickerProps> = ({
    size = 'middle',
    value: externalValue,
    defaultValue,
    onChange,
    placeholder = ['开始日期', '结束日期'],
    disabled = false,
    readOnly = false,
    className = '',
    style,
    width = 'auto',
    format = 'YYYY-MM-DD',
    allowClear = true,
    disabledDate,
    disabledDates,
    label,
    labelClassName = '',
    labelStyle,
    onOpenChange,
    open: externalOpen,
    showOk = true,
    separator,
}) => {
    const [internalValue, setInternalValue] = useState<[string, string] | undefined>(defaultValue);
    const [internalOpen, setInternalOpen] = useState(false);
    const [activePicker, setActivePicker] = useState<'start' | 'end'>('start');
    const [isFocused, setIsFocused] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0, isAbove: false });
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isControlled = externalValue !== undefined;
    const value = isControlled ? externalValue : internalValue;
    const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;

    const startValue = value?.[0] || '';
    const endValue = value?.[1] || '';

    const startDate = useMemo(() => parseDate(startValue, format), [startValue, format]);
    const endDate = useMemo(() => parseDate(endValue, format), [endValue, format]);

    // 当前显示月份：开始选择器显示开始日期所在月，结束选择器显示结束日期所在月（或开始日期后一个月）
    const [startViewDate, setStartViewDate] = useState<Date>(startDate || new Date());
    const [endViewDate, setEndViewDate] = useState<Date>(() => {
        if (endDate) return endDate;
        if (startDate) {
            const nextMonth = new Date(startDate);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            return nextMonth;
        }
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        return nextMonth;
    });

    // 同步外部值变化
    useEffect(() => {
        if (startDate) {
            setStartViewDate(startDate);
        }
        if (endDate) {
            setEndViewDate(endDate);
        }
    }, [startDate, endDate]);

    // 计算下拉面板位置（相对于容器）
    const updateDropdownPosition = useCallback(() => {
        if (!triggerRef.current) return;
        const triggerRect = triggerRef.current.getBoundingClientRect();
        // 获取容器元素
        const containerEl = triggerRef.current.closest('.zjpcy-datepicker-range-picker') as HTMLElement;
        if (!containerEl) return;
        const containerRect = containerEl.getBoundingClientRect();

        const dropdownWidth = Math.max(triggerRect.width, 560); // 双面板最小宽度

        // 检查下方空间是否足够
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - triggerRect.bottom;
        const estimatedDropdownHeight = 360;

        // 计算相对于容器的位置
        let top = triggerRect.bottom - containerRect.top + 4;
        let left = triggerRect.left - containerRect.left;

        // 如果下方空间不够，则显示在上方
        const shouldShowAbove = spaceBelow < estimatedDropdownHeight && triggerRect.top > estimatedDropdownHeight;
        if (shouldShowAbove) {
            top = triggerRect.top - containerRect.top - estimatedDropdownHeight - 4;
        }

        // 确保不超出视口右边界
        const viewportWidth = window.innerWidth;
        if (left + dropdownWidth > viewportWidth) {
            left = viewportWidth - dropdownWidth - 16;
        }

        setDropdownPosition({
            top,
            left,
            width: dropdownWidth,
            isAbove: shouldShowAbove,
        });
    }, []);

    // 在弹出层渲染后，根据实际高度调整位置
    useEffect(() => {
        if (!isOpen || !dropdownRef.current || !triggerRef.current) return;

        const adjustPosition = () => {
            const triggerRect = triggerRef.current!.getBoundingClientRect();
            const containerEl = triggerRef.current!.closest('.zjpcy-datepicker-range-picker') as HTMLElement;
            if (!containerEl) return;
            const containerRect = containerEl.getBoundingClientRect();

            const dropdownEl = dropdownRef.current!;
            const actualHeight = dropdownEl.offsetHeight;
            const viewportHeight = window.innerHeight;
            const spaceBelow = viewportHeight - triggerRect.bottom;

            // 如果当前显示在上方（根据之前的判断），使用实际高度重新计算 top
            if (spaceBelow < 360 && triggerRect.top > 360) {
                const newTop = triggerRect.top - containerRect.top - actualHeight - 4;
                setDropdownPosition(prev => ({
                    ...prev,
                    top: newTop,
                }));
            }
            // 位置确定后显示下拉框
            setDropdownVisible(true);
        };

        // 先隐藏下拉框，计算完成后再显示
        setDropdownVisible(false);
        // 使用 requestAnimationFrame 确保 DOM 已渲染
        requestAnimationFrame(adjustPosition);

        // 清理函数
        return () => {
            setDropdownVisible(false);
        };
    }, [isOpen]);

    // 处理点击外部关闭
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                triggerRef.current &&
                !triggerRef.current.contains(event.target as Node) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                if (externalOpen === undefined) {
                    setInternalOpen(false);
                }
                onOpenChange?.(false);
                setIsFocused(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            updateDropdownPosition();

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isOpen, externalOpen, onOpenChange, updateDropdownPosition]);

    // 处理值变化
    const handleChange = useCallback(
        (index: 0 | 1, newValue: string) => {
            const newValues: [string, string] = [
                index === 0 ? newValue : (value?.[0] || ''),
                index === 1 ? newValue : (value?.[1] || ''),
            ];
            if (!isControlled) {
                setInternalValue(newValues);
            }
            onChange?.(newValues);
        },
        [isControlled, onChange, value]
    );

    // 处理触发器点击
    const handleTriggerClick = (picker: 'start' | 'end') => {
        if (disabled || readOnly) return;

        setActivePicker(picker);
        if (externalOpen === undefined) {
            setInternalOpen(true);
        }
        onOpenChange?.(true);
        setIsFocused(true);
    };

    // 处理清除
    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isControlled) {
            setInternalValue(undefined);
        }
        onChange?.(['', '']);
    };

    // 处理确定按钮
    const handleOk = () => {
        if (externalOpen === undefined) {
            setInternalOpen(false);
        }
        onOpenChange?.(false);
        setIsFocused(false);
    };

    // 检查日期是否被禁用
    const isDisabledDate = useCallback((date: Date): boolean => {
        if (disabledDate && disabledDate(date)) {
            return true;
        }
        if (disabledDates && disabledDates.length > 0) {
            const dateStr = formatDate(date, format);
            return disabledDates.includes(dateStr);
        }
        return false;
    }, [disabledDate, disabledDates, format]);

    // 生成日历数据
    const generateCalendarDays = (viewDate: Date) => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const daysInPrevMonth = getDaysInMonth(year, month - 1);

        const days: { date: Date; isCurrentMonth: boolean }[] = [];

        // 上个月的日期
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({
                date: new Date(year, month - 1, daysInPrevMonth - i),
                isCurrentMonth: false,
            });
        }

        // 当前月的日期
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                date: new Date(year, month, i),
                isCurrentMonth: true,
            });
        }

        // 下个月的日期（补齐6行42天）
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                date: new Date(year, month + 1, i),
                isCurrentMonth: false,
            });
        }

        return days;
    };

    // 判断日期是否在范围内
    const isInRange = (date: Date): boolean => {
        if (!startDate || !endDate) return false;
        return isDateBefore(startDate, date) && isDateBefore(date, endDate);
    };

    // 判断日期是否为范围起点
    const isRangeStart = (date: Date): boolean => {
        return isSameDate(date, startDate);
    };

    // 判断日期是否为范围终点
    const isRangeEnd = (date: Date): boolean => {
        return isSameDate(date, endDate);
    };

    // 处理日期点击
    const handleDateClick = (date: Date) => {
        if (isDisabledDate(date)) return;

        const dateStr = formatDate(date, format);

        if (activePicker === 'start') {
            handleChange(0, dateStr);
            // 如果选择的开始日期晚于结束日期，清空结束日期
            if (endDate && isDateBefore(endDate, date)) {
                handleChange(1, '');
            }
            // 自动切换到结束日期选择
            setActivePicker('end');
        } else {
            // 如果选择的结束日期早于开始日期，不允许选择
            if (startDate && isDateBefore(date, startDate)) {
                // 交换：将当前选择的作为开始日期
                handleChange(0, dateStr);
                handleChange(1, startValue);
            } else {
                handleChange(1, dateStr);
            }
            // 如果不需要显示确定按钮，选择后关闭
            if (!showOk) {
                handleOk();
            }
        }
    };

    // 日历头部组件
    const CalendarHeaderComponent: React.FC<{
        viewDate: Date;
        onPrevMonth: () => void;
        onNextMonth: () => void;
        label: string;
    }> = ({ viewDate, onPrevMonth, onNextMonth, label }) => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

        return (
            <div className="zjpcy-datepicker-range-calendar-header">
                <div className="zjpcy-datepicker-range-header-left">
                    <button className="zjpcy-datepicker-range-header-btn" onClick={onPrevMonth} title="上个月">
                        <Icon type="arrowLeft" size={14} color="var(--zjpcy-text-color-secondary)" />
                    </button>
                </div>
                <div className="zjpcy-datepicker-range-header-center">
                    <span>{year}年 {monthNames[month]}</span>
                    <span className="zjpcy-datepicker-range-header-label">{label}</span>
                </div>
                <div className="zjpcy-datepicker-range-header-right">
                    <button className="zjpcy-datepicker-range-header-btn" onClick={onNextMonth} title="下个月">
                        <Icon type="arrowRight" size={14} color="var(--zjpcy-text-color-secondary)" />
                    </button>
                </div>
            </div>
        );
    };

    // 日历面板组件
    const CalendarPanel: React.FC<{
        viewDate: Date;
        onPrevMonth: () => void;
        onNextMonth: () => void;
        label: string;
    }> = ({ viewDate, onPrevMonth, onNextMonth, label }) => {
        const days = useMemo(() => generateCalendarDays(viewDate), [viewDate]);
        const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

        return (
            <div className="zjpcy-datepicker-range-calendar">
                <CalendarHeaderComponent
                    viewDate={viewDate}
                    onPrevMonth={onPrevMonth}
                    onNextMonth={onNextMonth}
                    label={label}
                />
                <div className="zjpcy-datepicker-range-calendar-body">
                    <div className="zjpcy-datepicker-range-week-header">
                        {weekDays.map(day => (
                            <div key={day} className="zjpcy-datepicker-range-week-day">{day}</div>
                        ))}
                    </div>
                    <div className="zjpcy-datepicker-range-date-grid">
                        {days.map((item, index) => {
                            const { date, isCurrentMonth } = item;
                            const selected = isSameDate(date, activePicker === 'start' ? startDate : endDate);
                            const today = isToday(date);
                            const disabled = isDisabledDate(date);
                            const inRange = isInRange(date);
                            const rangeStart = isRangeStart(date);
                            const rangeEnd = isRangeEnd(date);

                            return (
                                <div
                                    key={index}
                                    className={getDateRangePickerDateCellClassName({
                                        isSelected: selected,
                                        isToday: today,
                                        isCurrentMonth,
                                        isInRange: inRange,
                                        isRangeStart: rangeStart,
                                        isRangeEnd: rangeEnd,
                                        disabled,
                                    })}
                                    onClick={() => handleDateClick(date)}
                                >
                                    {date.getDate()}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    // 渲染下拉面板
    const renderDropdown = () => {
        if (!isOpen) return null;

        const dropdownStyle = getDateRangePickerDropdownStyle({
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            minWidth: dropdownPosition.width || (typeof width === 'number' ? width : (parseInt(width as string, 10) || 280)),
        });

        return (
            <div
                ref={dropdownRef}
                className="zjpcy-datepicker-range-dropdown"
                style={{
                    ...dropdownStyle,
                    opacity: dropdownVisible ? 1 : 0,
                    transition: 'opacity 0.15s ease',
                }}
            >
                <div className="zjpcy-datepicker-range-panels">
                    <CalendarPanel
                        viewDate={startViewDate}
                        onPrevMonth={() => {
                            const newDate = new Date(startViewDate);
                            newDate.setMonth(newDate.getMonth() - 1);
                            setStartViewDate(newDate);
                        }}
                        onNextMonth={() => {
                            const newDate = new Date(startViewDate);
                            newDate.setMonth(newDate.getMonth() + 1);
                            setStartViewDate(newDate);
                        }}
                        label="开始日期"
                    />
                    <CalendarPanel
                        viewDate={endViewDate}
                        onPrevMonth={() => {
                            const newDate = new Date(endViewDate);
                            newDate.setMonth(newDate.getMonth() - 1);
                            setEndViewDate(newDate);
                        }}
                        onNextMonth={() => {
                            const newDate = new Date(endViewDate);
                            newDate.setMonth(newDate.getMonth() + 1);
                            setEndViewDate(newDate);
                        }}
                        label="结束日期"
                    />
                </div>
                {showOk && (
                    <div className="zjpcy-datepicker-range-footer">
                        <div className="zjpcy-datepicker-range-footer-spacer" />
                        <div className="zjpcy-datepicker-range-footer-actions">
                            <button className={getDateRangePickerFooterButtonClassName({ variant: 'primary' })} onClick={handleOk}>
                                确定
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const containerStyle = getDateRangePickerContainerStyle({ width });
    const triggerClassName = getDateRangePickerTriggerClassName({
        focused: isFocused,
        disabled,
        size,
    });
    const triggerStyle = getDateRangePickerTriggerStyle({ size });

    const hasValue = startValue || endValue;

    return (
        <div
            className={classNames('zjpcy-datepicker-range-picker', className, {
                'zjpcy-datepicker-range-picker-with-label': label,
            })}
            style={{ ...containerStyle, ...style }}
        >
            {label && (
                <span
                    className={classNames('zjpcy-datepicker-range-picker-label', labelClassName)}
                    style={labelStyle}
                >
                    {label}
                </span>
            )}
            <div
                ref={triggerRef}
                className={triggerClassName}
                style={triggerStyle}
            >
                {/* 开始日期 */}
                <div
                    className={getDateRangePickerInputClassName({
                        active: activePicker === 'start' && isOpen,
                    })}
                    onClick={() => handleTriggerClick('start')}
                >
                    <span className={getDateRangePickerValueClassName({
                        isPlaceholder: !startValue
                    })}>
                        {startValue || placeholder[0]}
                    </span>
                </div>

                {/* 分隔符 */}
                <span className="zjpcy-datepicker-range-picker-separator">
                    {separator || <Icon type="arrow-right" size="small" />}
                </span>

                {/* 结束日期 */}
                <div
                    className={getDateRangePickerInputClassName({
                        active: activePicker === 'end' && isOpen,
                    })}
                    onClick={() => handleTriggerClick('end')}
                >
                    <span className={getDateRangePickerValueClassName({
                        isPlaceholder: !endValue
                    })}>
                        {endValue || placeholder[1]}
                    </span>
                </div>

                {/* 后缀图标区域 */}
                <span className="zjpcy-datepicker-range-picker-suffix">
                    {/* 清除按钮 */}
                    {allowClear && hasValue && !disabled && !readOnly && (
                        <span
                            className="zjpcy-datepicker-range-picker-clear"
                            onClick={handleClear}
                        >
                            <Icon type="close" size="small" />
                        </span>
                    )}
                    {/* 日历图标 */}
                    <Icon
                        type="calendar"
                        size="small"
                        className={classNames('zjpcy-datepicker-range-picker-icon', {
                            'zjpcy-datepicker-range-picker-icon--has-clear': allowClear && hasValue && !disabled && !readOnly
                        })}
                    />
                </span>
            </div>
            {renderDropdown()}
        </div>
    );
};

export default RangePicker;
