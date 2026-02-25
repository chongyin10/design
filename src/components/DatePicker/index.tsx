import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import Icon from '../Icon';
import Tag from '../Tag';
import './DatePicker.css';
import {
    DatePickerProps,
    CalendarPanelProps,
    CalendarHeaderProps,
    YearPickerProps,
    MonthPickerProps,
    DateFormat,
} from './types';
import {
    DatePickerContainer,
    DatePickerTrigger,
    DatePickerValue,
    DatePickerSuffix,
    DatePickerClear,
    DatePickerIcon,
    DatePickerDropdown,
    CalendarPanel,
    CalendarHeader,
    HeaderLeft,
    HeaderCenter,
    HeaderRight,
    HeaderButton,
    CalendarBody,
    WeekHeader,
    WeekDay,
    DateGrid,
    DateCell,
    CalendarFooter,
    CalendarFooterSpacer,
    CalendarFooterActions,
    FooterButton,
    LabelContainer,
    Label,
    YearPickerPanel,
    YearGrid,
    YearCell,
    MonthPickerPanel,
    MonthGrid,
    MonthCell,
    QuarterPickerPanel,
    QuarterGrid,
    QuarterCell,
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

// 年份选择器组件
const YearPickerComponent: React.FC<YearPickerProps> = ({
    currentYear,
    startYear,
    onYearSelect,
    onBack,
    onPrevPage,
    onNextPage,
}) => {
    const years = useMemo(() => {
        const list: number[] = [];
        for (let i = 0; i < 12; i++) {
            list.push(startYear + i);
        }
        return list;
    }, [startYear]);

    const currentYearInList = new Date().getFullYear();
    const endYear = startYear + 11;

    return (
        <YearPickerPanel>
            <CalendarHeader>
                <HeaderLeft>
                    <HeaderButton onClick={onPrevPage} title="上一页">
                        <Icon type="arrowLeft" size={14} color="var(--idp-text-color-secondary)" />
                    </HeaderButton>
                </HeaderLeft>
                <HeaderCenter>
                    <span style={{ cursor: 'pointer' }} onClick={onBack}>
                        {startYear} - {endYear}
                    </span>
                </HeaderCenter>
                <HeaderRight>
                    <HeaderButton onClick={onNextPage} title="下一页">
                        <Icon type="arrowRight" size={14} color="var(--idp-text-color-secondary)" />
                    </HeaderButton>
                </HeaderRight>
            </CalendarHeader>
            <YearGrid>
                {years.map(year => (
                    <YearCell
                        key={year}
                        isSelected={year === currentYear}
                        isCurrentYear={year === currentYearInList}
                        onClick={() => onYearSelect(year)}
                    >
                        {year}
                    </YearCell>
                ))}
            </YearGrid>
        </YearPickerPanel>
    );
};

// 月份选择器组件
const MonthPickerComponent: React.FC<MonthPickerProps> = ({
    currentMonth,
    onMonthSelect,
    onBack,
}) => {
    const months = useMemo(() => {
        return [
            '1月', '2月', '3月', '4月', '5月', '6月',
            '7月', '8月', '9月', '10月', '11月', '12月'
        ];
    }, []);

    const currentMonthInList = new Date().getMonth();

    return (
        <MonthPickerPanel>
            <CalendarHeader>
                <HeaderLeft>
                    <HeaderButton onClick={onBack} title="返回">
                        <Icon type="arrowLeft" size={14} color="var(--idp-text-color-secondary)" />
                    </HeaderButton>
                </HeaderLeft>
                <HeaderCenter>
                    <span style={{ cursor: 'pointer' }} onClick={onBack}>
                        选择月份
                    </span>
                </HeaderCenter>
                <HeaderRight />
            </CalendarHeader>
            <MonthGrid>
                {months.map((month, index) => (
                    <MonthCell
                        key={index}
                        isSelected={index === currentMonth}
                        isCurrentMonth={index === currentMonthInList}
                        onClick={() => onMonthSelect(index)}
                    >
                        {month}
                    </MonthCell>
                ))}
            </MonthGrid>
        </MonthPickerPanel>
    );
};

// 日历头部组件
const CalendarHeaderComponent: React.FC<CalendarHeaderProps> = ({
    currentMonth,
    onPrevMonth,
    onNextMonth,
    onYearClick,
    onMonthClick,
}) => {
    const currentYear = currentMonth.getFullYear();
    const currentMonthIndex = currentMonth.getMonth();

    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

    return (
        <CalendarHeader>
            <HeaderLeft>
                <HeaderButton onClick={onPrevMonth} title="上个月">
                    <Icon type="arrowLeft" size={14} color="var(--idp-text-color-secondary)" />
                </HeaderButton>
            </HeaderLeft>
            <HeaderCenter>
                <span
                    style={{ cursor: 'pointer', fontWeight: 500 }}
                    onClick={onYearClick}
                >
                    {currentYear}年
                </span>
                <span
                    style={{ cursor: 'pointer', fontWeight: 500 }}
                    onClick={onMonthClick}
                >
                    {monthNames[currentMonthIndex]}
                </span>
            </HeaderCenter>
            <HeaderRight>
                <HeaderButton onClick={onNextMonth} title="下个月">
                    <Icon type="arrowRight" size={14} color="var(--idp-text-color-secondary)" />
                </HeaderButton>
            </HeaderRight>
        </CalendarHeader>
    );
};

// 日历面板组件
const CalendarPanelComponent: React.FC<CalendarPanelProps> = ({
    value,
    selectedValues = [],
    onChange,
    format,
    disabledDate,
    disabledDates,
    showToday = true,
    showOk = true,
    onToday,
    onOk,
}) => {
    const selectedDate = useMemo(() => parseDate(value, format), [value, format]);
    // 多选模式下的选中日期集合
    const selectedDatesSet = useMemo(() => {
        return new Set(selectedValues);
    }, [selectedValues]);
    const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate || new Date());
    const [viewMode, setViewMode] = useState<'calendar' | 'year' | 'month'>('calendar');

    // 年份选择器的起始年份（用于分页）
    const getInitialStartYear = (year: number) => Math.floor(year / 12) * 12;
    const [yearPickerStartYear, setYearPickerStartYear] = useState<number>(getInitialStartYear((selectedDate || new Date()).getFullYear()));

    // 同步选中的日期到当前显示的月份
    useEffect(() => {
        if (selectedDate) {
            setCurrentMonth(selectedDate);
        }
    }, [selectedDate]);

    // 处理年份选择
    const handleYearSelect = (year: number) => {
        const newDate = new Date(currentMonth);
        newDate.setFullYear(year);
        setCurrentMonth(newDate);
        setViewMode('month');
    };

    // 处理月份选择
    const handleMonthSelect = (month: number) => {
        const newDate = new Date(currentMonth);
        newDate.setMonth(month);
        setCurrentMonth(newDate);
        setViewMode('calendar');
    };

    // 切换到年份选择器视图
    const handleYearClick = () => {
        setYearPickerStartYear(getInitialStartYear(currentMonth.getFullYear()));
        setViewMode('year');
    };

    // 切换到月份选择器视图
    const handleMonthClick = () => {
        setViewMode('month');
    };

    // 生成日历数据
    const calendarDays = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
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
    }, [currentMonth]);

    // 检查日期是否被禁用
    const isDisabledDate = useCallback((date: Date): boolean => {
        // 使用 disabledDate 函数
        if (disabledDate && disabledDate(date)) {
            return true;
        }
        // 检查 disabledDates 列表
        if (disabledDates && disabledDates.length > 0) {
            const dateStr = formatDate(date, format);
            return disabledDates.includes(dateStr);
        }
        return false;
    }, [disabledDate, disabledDates, format]);

    // 处理日期点击
    const handleDateClick = (date: Date) => {
        if (isDisabledDate(date)) return;
        onChange?.(formatDate(date, format));
    };

    // 处理今天按钮点击
    const handleTodayClick = () => {
        const today = new Date();
        setCurrentMonth(today);
        onChange?.(formatDate(today, format));
        onToday?.();
    };

    // 星期标题
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

    if (viewMode === 'year') {
        return (
            <YearPickerComponent
                currentYear={currentMonth.getFullYear()}
                startYear={yearPickerStartYear}
                onYearSelect={handleYearSelect}
                onBack={() => setViewMode('calendar')}
                onPrevPage={() => setYearPickerStartYear(y => y - 12)}
                onNextPage={() => setYearPickerStartYear(y => y + 12)}
            />
        );
    }

    if (viewMode === 'month') {
        return (
            <MonthPickerComponent
                currentMonth={currentMonth.getMonth()}
                onMonthSelect={handleMonthSelect}
                onBack={() => setViewMode('calendar')}
            />
        );
    }

    return (
        <CalendarPanel>
            <CalendarHeaderComponent
                currentMonth={currentMonth}
                onPrevMonth={() => {
                    const newDate = new Date(currentMonth);
                    newDate.setMonth(newDate.getMonth() - 1);
                    setCurrentMonth(newDate);
                }}
                onNextMonth={() => {
                    const newDate = new Date(currentMonth);
                    newDate.setMonth(newDate.getMonth() + 1);
                    setCurrentMonth(newDate);
                }}
                onYearClick={handleYearClick}
                onMonthClick={handleMonthClick}
            />
            <CalendarBody>
                <WeekHeader>
                    {weekDays.map(day => (
                        <WeekDay key={day}>{day}</WeekDay>
                    ))}
                </WeekHeader>
                <DateGrid>
                    {calendarDays.map((item, index) => {
                        const { date, isCurrentMonth } = item;
                        const dateStr = formatDate(date, format);
                        const selected = isSameDate(date, selectedDate);
                        const isInSelectedSet = selectedDatesSet.has(dateStr);
                        const today = isToday(date);
                        const disabled = isDisabledDate(date);

                        return (
                            <DateCell
                                key={index}
                                isSelected={selected}
                                isInSelectedSet={isInSelectedSet}
                                isToday={today}
                                disabled={disabled}
                                isCurrentMonth={isCurrentMonth}
                                onClick={() => handleDateClick(date)}
                            >
                                {date.getDate()}
                            </DateCell>
                        );
                    })}
                </DateGrid>
            </CalendarBody>
            {(showToday || showOk) && (
                <CalendarFooter>
                    {showToday ? (
                        <FooterButton onClick={handleTodayClick}>
                            今天
                        </FooterButton>
                    ) : (
                        <CalendarFooterSpacer />
                    )}
                    {showOk && (
                        <CalendarFooterActions>
                            <FooterButton variant="primary" onClick={onOk}>
                                确定
                            </FooterButton>
                        </CalendarFooterActions>
                    )}
                </CalendarFooter>
            )}
        </CalendarPanel>
    );
};

// 主组件
const DatePicker: React.FC<DatePickerProps> = ({
    size = 'middle',
    value: externalValue,
    defaultValue,
    onChange,
    placeholder = '请选择日期',
    disabled = false,
    readOnly = false,
    className = '',
    style,
    width = 160,
    format = 'YYYY-MM-DD',
    allowClear = true,
    disabledDate,
    disabledDates,
    label,
    labelGap = 8,
    labelClassName = '',
    labelStyle,
    onOpenChange,
    open: externalOpen,
    showToday = true,
    showOk = true,
    picker = 'date',
    multiple = false,
    maxTagCount,
    maxTagDisplayCount,
    separator = ',',
}) => {
    const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
    const [internalOpen, setInternalOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isControlled = externalValue !== undefined;
    const value = isControlled ? externalValue : internalValue;

    // 多选模式下的选中值列表
    const selectedValues = useMemo(() => {
        if (!value) return [];
        return value.split(separator).filter(v => v.trim());
    }, [value, separator]);

    // 检查某个值是否被选中
    const isValueSelected = useCallback((val: string) => {
        return selectedValues.includes(val);
    }, [selectedValues]);

    // 切换选中状态（多选模式）
    const toggleValue = useCallback((val: string) => {
        if (isValueSelected(val)) {
            return selectedValues.filter(v => v !== val).join(separator);
        } else {
            // 检查最大数量限制
            if (maxTagCount !== undefined && selectedValues.length >= maxTagCount) {
                return selectedValues.join(separator);
            }
            return [...selectedValues, val].join(separator);
        }
    }, [selectedValues, isValueSelected, separator, maxTagCount]);
    const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;

    // 计算下拉面板位置
    const updateDropdownPosition = useCallback(() => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        const dropdownWidth = Math.max(rect.width, 280);

        // 检查下方空间是否足够（使用估算高度作为初始判断）
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        const estimatedDropdownHeight = 360; // 估算下拉面板高度

        let top = rect.bottom + window.scrollY + 4;
        let left = rect.left + window.scrollX;

        // 如果下方空间不够，先假设显示在上方（使用估算高度）
        const shouldShowAbove = spaceBelow < estimatedDropdownHeight && rect.top > estimatedDropdownHeight;

        if (shouldShowAbove) {
            top = rect.top + window.scrollY - estimatedDropdownHeight - 4;
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
        });
    }, []);

    // 在弹出层渲染后，根据实际高度调整位置
    useEffect(() => {
        if (!isOpen || !dropdownRef.current || !triggerRef.current) return;

        const adjustPosition = () => {
            const rect = triggerRef.current!.getBoundingClientRect();
            const dropdownEl = dropdownRef.current!;
            const actualHeight = dropdownEl.offsetHeight;
            const viewportHeight = window.innerHeight;
            const spaceBelow = viewportHeight - rect.bottom;

            // 如果当前显示在上方（根据之前的判断），使用实际高度重新计算 top
            if (spaceBelow < 360 && rect.top > 360) {
                const newTop = rect.top + window.scrollY - actualHeight - 4;
                // 更新位置后显示下拉框
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
            window.addEventListener('scroll', updateDropdownPosition, true);
            window.addEventListener('resize', updateDropdownPosition);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', updateDropdownPosition, true);
            window.removeEventListener('resize', updateDropdownPosition);
        };
    }, [isOpen, externalOpen, onOpenChange, updateDropdownPosition]);

    // 处理触发器点击
    const handleTriggerClick = () => {
        if (disabled || readOnly) return;

        const newOpen = !isOpen;
        if (externalOpen === undefined) {
            setInternalOpen(newOpen);
        }
        onOpenChange?.(newOpen);
        setIsFocused(newOpen);
    };

    // 处理日期变化
    const handleDateChange = (date: string) => {
        let newValue: string;

        if (multiple) {
            // 多选模式：切换选中状态
            newValue = toggleValue(date);
        } else {
            // 单选模式：直接设置值
            newValue = date;
        }

        if (!isControlled) {
            setInternalValue(newValue);
        }
        onChange?.(newValue);

        // 单选模式下，如果不显示确定按钮，选择后关闭面板
        if (!multiple && !showOk) {
            if (externalOpen === undefined) {
                setInternalOpen(false);
            }
            onOpenChange?.(false);
            setIsFocused(false);
        }
    };

    // 处理清除
    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isControlled) {
            setInternalValue(undefined);
        }
        onChange?.('');
    };

    // 处理确定按钮
    const handleOk = () => {
        if (externalOpen === undefined) {
            setInternalOpen(false);
        }
        onOpenChange?.(false);
        setIsFocused(false);
    };

    // 解析月份值
    const parseMonthValue = (value?: string): { year: number; month: number } | null => {
        if (!value) return null;
        const match = value.match(/^(\d{4})-(\d{2})$/);
        if (match) {
            return { year: parseInt(match[1], 10), month: parseInt(match[2], 10) - 1 };
        }
        return null;
    };

    // 解析季度值
    const parseQuarterValue = (value?: string): { year: number; quarter: number } | null => {
        if (!value) return null;
        const match = value.match(/^(\d{4})-Q(\d)$/);
        if (match) {
            return { year: parseInt(match[1], 10), quarter: parseInt(match[2], 10) };
        }
        return null;
    };

    // 解析年份值
    const parseYearValue = (value?: string): number | null => {
        if (!value) return null;
        const match = value.match(/^(\d{4})$/);
        if (match) {
            return parseInt(match[1], 10);
        }
        return null;
    };

    // 月份选择器面板
    const MonthPickerPanelComponent: React.FC = () => {
        const parsed = parseMonthValue(value);
        const currentDate = new Date();
        const [currentYear, setCurrentYear] = useState(parsed?.year ?? currentDate.getFullYear());
        const selectedMonth = parsed?.month ?? null;

        const months = useMemo(() => {
            return ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
        }, []);

        const currentMonth = currentDate.getMonth();
        const currentYearNum = currentDate.getFullYear();

        // 多选模式下解析所有选中的月份
        const selectedMonthsSet = useMemo(() => {
            if (!multiple) return new Set<string>();
            return new Set(selectedValues.filter(v => v.match(/^\d{4}-\d{2}$/)));
        }, [selectedValues, multiple]);

        const handleMonthSelect = (month: number) => {
            const formatted = `${currentYear}-${String(month + 1).padStart(2, '0')}`;

            if (multiple) {
                // 多选模式：切换选中状态
                const newValue = toggleValue(formatted);
                if (!isControlled) {
                    setInternalValue(newValue);
                }
                onChange?.(newValue);
            } else {
                // 单选模式
                if (!isControlled) {
                    setInternalValue(formatted);
                }
                onChange?.(formatted);
                if (!showOk) {
                    handleOk();
                }
            }
        };

        // 检查月份是否被选中（用于多选模式）
        const isMonthSelected = (monthIndex: number): boolean => {
            const formatted = `${currentYear}-${String(monthIndex + 1).padStart(2, '0')}`;
            return selectedMonthsSet.has(formatted);
        };

        return (
            <MonthPickerPanel>
                <CalendarHeader>
                    <HeaderLeft>
                        <HeaderButton onClick={() => setCurrentYear(y => y - 1)} title="上一年">
                            <Icon type="arrowLeft" size={14} color="var(--idp-text-color-secondary)" />
                        </HeaderButton>
                    </HeaderLeft>
                    <HeaderCenter>
                        <span>{currentYear}年</span>
                    </HeaderCenter>
                    <HeaderRight>
                        <HeaderButton onClick={() => setCurrentYear(y => y + 1)} title="下一年">
                            <Icon type="arrowRight" size={14} color="var(--idp-text-color-secondary)" />
                        </HeaderButton>
                    </HeaderRight>
                </CalendarHeader>
                <MonthGrid>
                    {months.map((month, index) => {
                        const isSelected = multiple
                            ? isMonthSelected(index)
                            : (index === selectedMonth && currentYear === parsed?.year);
                        const isInSelectedSet = multiple && isMonthSelected(index) && !(index === selectedMonth && currentYear === parsed?.year);

                        return (
                            <MonthCell
                                key={index}
                                isSelected={isSelected}
                                isInSelectedSet={isInSelectedSet}
                                isCurrentMonth={index === currentMonth && currentYear === currentYearNum}
                                onClick={() => handleMonthSelect(index)}
                            >
                                {month}
                            </MonthCell>
                        );
                    })}
                </MonthGrid>
                {showOk && (
                    <CalendarFooter>
                        <CalendarFooterSpacer />
                        <CalendarFooterActions>
                            <FooterButton variant="primary" onClick={handleOk}>
                                确定
                            </FooterButton>
                        </CalendarFooterActions>
                    </CalendarFooter>
                )}
            </MonthPickerPanel>
        );
    };

    // 季度选择器面板
    const QuarterPickerPanelComponent: React.FC = () => {
        const parsed = parseQuarterValue(value);
        const currentDate = new Date();
        const [currentYear, setCurrentYear] = useState(parsed?.year ?? currentDate.getFullYear());
        const selectedQuarter = parsed?.quarter ?? null;

        const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
        const currentMonth = currentDate.getMonth();
        const currentQuarter = Math.floor(currentMonth / 3) + 1;
        const currentYearNum = currentDate.getFullYear();

        // 多选模式下解析所有选中的季度
        const selectedQuartersSet = useMemo(() => {
            if (!multiple) return new Set<string>();
            return new Set(selectedValues.filter(v => v.match(/^\d{4}-Q\d$/)));
        }, [selectedValues, multiple]);

        const handleQuarterSelect = (year: number, quarter: number) => {
            const formatted = `${year}-Q${quarter}`;

            if (multiple) {
                // 多选模式：切换选中状态
                const newValue = toggleValue(formatted);
                if (!isControlled) {
                    setInternalValue(newValue);
                }
                onChange?.(newValue);
            } else {
                // 单选模式
                if (!isControlled) {
                    setInternalValue(formatted);
                }
                onChange?.(formatted);
                if (!showOk) {
                    handleOk();
                }
            }
        };

        // 检查季度是否被选中（用于多选模式）
        const isQuarterSelected = (quarterNum: number): boolean => {
            const formatted = `${currentYear}-Q${quarterNum}`;
            return selectedQuartersSet.has(formatted);
        };

        return (
            <QuarterPickerPanel>
                <CalendarHeader>
                    <HeaderLeft>
                        <HeaderButton onClick={() => setCurrentYear(y => y - 1)} title="上一年">
                            <Icon type="arrowLeft" size={14} color="var(--idp-text-color-secondary)" />
                        </HeaderButton>
                    </HeaderLeft>
                    <HeaderCenter>
                        <span>{currentYear}年</span>
                    </HeaderCenter>
                    <HeaderRight>
                        <HeaderButton onClick={() => setCurrentYear(y => y + 1)} title="下一年">
                            <Icon type="arrowRight" size={14} color="var(--idp-text-color-secondary)" />
                        </HeaderButton>
                    </HeaderRight>
                </CalendarHeader>
                <QuarterGrid>
                    {quarters.map((quarterLabel, index) => {
                        const quarterNum = index + 1;
                        const isCurrent = currentYear === currentYearNum && quarterNum === currentQuarter;
                        const isSelected = multiple
                            ? isQuarterSelected(quarterNum)
                            : (quarterNum === selectedQuarter && currentYear === parsed?.year);
                        const isInSelectedSet = multiple && isQuarterSelected(quarterNum) && !(quarterNum === selectedQuarter && currentYear === parsed?.year);

                        return (
                            <QuarterCell
                                key={quarterLabel}
                                isSelected={isSelected}
                                isInSelectedSet={isInSelectedSet}
                                isCurrentQuarter={isCurrent}
                                onClick={() => handleQuarterSelect(currentYear, quarterNum)}
                            >
                                {quarterLabel}
                            </QuarterCell>
                        );
                    })}
                </QuarterGrid>
                {showOk && (
                    <CalendarFooter>
                        <CalendarFooterSpacer />
                        <CalendarFooterActions>
                            <FooterButton variant="primary" onClick={handleOk}>
                                确定
                            </FooterButton>
                        </CalendarFooterActions>
                    </CalendarFooter>
                )}
            </QuarterPickerPanel>
        );
    };

    // 年份选择器面板
    const YearPickerPanelComponent: React.FC = () => {
        const selectedYear = parseYearValue(value);
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const getInitialStartYear = (year: number) => Math.floor(year / 12) * 12;
        const [startYear, setStartYear] = useState(getInitialStartYear(selectedYear ?? currentYear));

        const years = useMemo(() => {
            const list: number[] = [];
            for (let i = 0; i < 12; i++) {
                list.push(startYear + i);
            }
            return list;
        }, [startYear]);

        // 多选模式下解析所有选中的年份
        const selectedYearsSet = useMemo(() => {
            if (!multiple) return new Set<string>();
            return new Set(selectedValues.filter(v => v.match(/^\d{4}$/)));
        }, [selectedValues, multiple]);

        const handleYearSelect = (year: number) => {
            const formatted = String(year);

            if (multiple) {
                // 多选模式：切换选中状态
                const newValue = toggleValue(formatted);
                if (!isControlled) {
                    setInternalValue(newValue);
                }
                onChange?.(newValue);
            } else {
                // 单选模式
                if (!isControlled) {
                    setInternalValue(formatted);
                }
                onChange?.(formatted);
                if (!showOk) {
                    handleOk();
                }
            }
        };

        return (
            <YearPickerPanel>
                <CalendarHeader>
                    <HeaderLeft>
                        <HeaderButton onClick={() => setStartYear(y => y - 12)} title="上一页">
                            <Icon type="arrowLeft" size={14} color="var(--idp-text-color-secondary)" />
                        </HeaderButton>
                    </HeaderLeft>
                    <HeaderCenter>
                        <span>{startYear} - {startYear + 11}</span>
                    </HeaderCenter>
                    <HeaderRight>
                        <HeaderButton onClick={() => setStartYear(y => y + 12)} title="下一页">
                            <Icon type="arrowRight" size={14} color="var(--idp-text-color-secondary)" />
                        </HeaderButton>
                    </HeaderRight>
                </CalendarHeader>
                <YearGrid>
                    {years.map(year => {
                        const isSelected = multiple
                            ? selectedYearsSet.has(String(year))
                            : year === selectedYear;
                        const isInSelectedSet = multiple && selectedYearsSet.has(String(year)) && year !== selectedYear;

                        return (
                            <YearCell
                                key={year}
                                isSelected={isSelected}
                                isInSelectedSet={isInSelectedSet}
                                isCurrentYear={year === currentYear}
                                onClick={() => handleYearSelect(year)}
                            >
                                {year}
                            </YearCell>
                        );
                    })}
                </YearGrid>
                {showOk && (
                    <CalendarFooter>
                        <CalendarFooterSpacer />
                        <CalendarFooterActions>
                            <FooterButton variant="primary" onClick={handleOk}>
                                确定
                            </FooterButton>
                        </CalendarFooterActions>
                    </CalendarFooter>
                )}
            </YearPickerPanel>
        );
    };

    // 处理删除单个标签
    const handleRemoveTag = useCallback((tagValue: string) => (e: React.MouseEvent) => {
        e.stopPropagation();
        const newValues = selectedValues.filter(v => v !== tagValue);
        const newValue = newValues.join(separator);
        if (!isControlled) {
            setInternalValue(newValue || undefined);
        }
        onChange?.(newValue);
    }, [selectedValues, separator, isControlled, onChange]);

    // 渲染触发器
    const renderTrigger = () => {
        // 单选模式下显示文本
        const displayValue = useMemo(() => {
            if (!value) return '';
            return value;
        }, [value]);

        return (
            <DatePickerTrigger
                ref={triggerRef}
                focused={isFocused}
                disabled={disabled}
                size={size}
                className={classNames('idp-datepicker-trigger', `idp-datepicker-trigger--${size}`, {
                    'idp-datepicker-trigger--disabled': disabled,
                    'idp-datepicker-trigger--focused': isFocused,
                    'idp-datepicker-trigger--multiple': multiple,
                }, className)}
                style={style}
                onClick={handleTriggerClick}
            >
                {multiple && selectedValues.length > 0 ? (
                    <DatePickerValue
                        isPlaceholder={false}
                        disabled={disabled}
                        className={classNames('idp-datepicker-value', 'idp-datepicker-value--tags', {
                            'idp-datepicker-value--disabled': disabled,
                        })}
                    >
                        {(() => {
                            // 处理 tag 显示数量限制
                            const shouldLimit = maxTagDisplayCount !== undefined && maxTagDisplayCount > 0;
                            const displayValues = shouldLimit
                                ? selectedValues.slice(0, maxTagDisplayCount)
                                : selectedValues;
                            const remainingCount = shouldLimit
                                ? selectedValues.length - maxTagDisplayCount!
                                : 0;

                            return (
                                <>
                                    {displayValues.map((val, index) => (
                                        <Tag
                                            key={`${val}-${index}`}
                                            size="small"
                                            closable={!disabled}
                                            onClose={handleRemoveTag(val)}
                                            className="idp-datepicker-tag"
                                        >
                                            {val}
                                        </Tag>
                                    ))}
                                    {remainingCount > 0 && (
                                        <Tag
                                            key="more"
                                            size="small"
                                            className="idp-datepicker-tag idp-datepicker-tag--more"
                                        >
                                            ...+{remainingCount}
                                        </Tag>
                                    )}
                                </>
                            );
                        })()}
                    </DatePickerValue>
                ) : (
                    <DatePickerValue
                        isPlaceholder={!value}
                        disabled={disabled}
                        className={classNames('idp-datepicker-value', {
                            'idp-datepicker-value--placeholder': !value,
                            'idp-datepicker-value--disabled': disabled,
                        })}
                    >
                        {displayValue || placeholder}
                    </DatePickerValue>
                )}
                <DatePickerSuffix className="idp-datepicker-suffix">
                    {allowClear && value && !disabled && (
                        <DatePickerClear
                            className="idp-datepicker-clear"
                            onClick={handleClear}
                        >
                            <Icon type="close" style={{ fontSize: 10 }} />
                        </DatePickerClear>
                    )}
                    <DatePickerIcon
                        className={classNames('idp-datepicker-icon', {
                            'has-clear': allowClear && value && !disabled,
                        })}
                    >
                        <Icon type="calendar" style={{ fontSize: 14 }} />
                    </DatePickerIcon>
                </DatePickerSuffix>
            </DatePickerTrigger>
        );
    };

    // 渲染下拉面板内容
    const renderPanelContent = () => {
        switch (picker) {
            case 'month':
                return <MonthPickerPanelComponent />;
            case 'quarter':
                return <QuarterPickerPanelComponent />;
            case 'year':
                return <YearPickerPanelComponent />;
            case 'date':
            default:
                return (
                    <CalendarPanelComponent
                        value={value}
                        selectedValues={selectedValues}
                        onChange={handleDateChange}
                        format={format}
                        disabledDate={disabledDate}
                        disabledDates={disabledDates}
                        showToday={showToday}
                        showOk={showOk}
                        onToday={() => {
                            if (!showOk) {
                                handleOk();
                            }
                        }}
                        onOk={handleOk}
                    />
                );
        }
    };

    // 渲染下拉面板
    const renderDropdown = () => {
        if (!isOpen) return null;

        const dropdown = (
            <DatePickerDropdown
                ref={dropdownRef}
                top={dropdownPosition.top}
                left={dropdownPosition.left}
                className="idp-datepicker-dropdown"
                style={{
                    minWidth: dropdownPosition.width,
                    opacity: dropdownVisible ? 1 : 0,
                    transition: 'opacity 0.15s ease',
                }}
            >
                {renderPanelContent()}
            </DatePickerDropdown>
        );

        return ReactDOM.createPortal(dropdown, document.body);
    };

    // 计算容器宽度：多选模式下使用 auto，以 minWidth 作为最小宽度
    const containerWidth = multiple ? 'auto' : width;

    // 如果有标签，包装在标签容器中
    if (label) {
        return (
            <LabelContainer gap={labelGap} className="idp-datepicker-with-label">
                {typeof label === 'string' ? (
                    <Label
                        className={classNames('idp-datepicker-label', labelClassName)}
                        style={labelStyle}
                    >
                        {label}
                    </Label>
                ) : (
                    label
                )}
                <DatePickerContainer
                    width={containerWidth}
                    minWidth={multiple ? width : undefined}
                    className="idp-datepicker"
                >
                    {renderTrigger()}
                    {renderDropdown()}
                </DatePickerContainer>
            </LabelContainer>
        );
    }

    return (
        <DatePickerContainer
            width={containerWidth}
            minWidth={multiple ? width : undefined}
            className="idp-datepicker"
        >
            {renderTrigger()}
            {renderDropdown()}
        </DatePickerContainer>
    );
};

export default DatePicker;
export type { DatePickerProps, DateFormat, CalendarPanelProps, CalendarHeaderProps, DateCellProps } from './types';
