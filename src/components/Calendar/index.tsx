import React, { useState, useMemo, useCallback } from 'react';
import classNames from 'classnames';
import { Solar } from 'lunar-typescript';
import Icon from '../Icon';
import Tooltip from '../Tooltip';
import Input from '../Input';
import Textarea from '../Input/Textarea';
import Modal from '../Modal';
import Button from '../Button/Button';
import { CalendarProps, DateInfoItem, DatePanelFormConfig, LunarInfo } from './types';
import './Calendar.css';

/**
 * 获取农历信息
 * Get lunar date info
 */
const getLunarInfo = (date: Date): LunarInfo => {
    const solar = Solar.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate());
    const lunar = solar.getLunar();

    // 获取节气
    const term = lunar.getJieQi();

    // 获取节日
    const festivals: string[] = [];
    const festival = lunar.getFestivals();
    if (festival) festivals.push(...festival);
    const otherFestivals = lunar.getOtherFestivals();
    if (otherFestivals) festivals.push(...otherFestivals);

    // 获取建除十二值星
    const zhiXingMap: Record<number, string> = {
        0: '建', 1: '除', 2: '满', 3: '平', 4: '定', 5: '执',
        6: '破', 7: '危', 8: '成', 9: '收', 10: '开', 11: '闭'
    };
    const zhiXingDescMap: Record<string, string> = {
        '建': '宜：出行、上任、会友、上书、见工。忌：动土、开仓、婚嫁、纳采。',
        '除': '宜：除服、疗病、出行、拆卸、入宅。忌：求官、上任、开张、搬家。',
        '满': '宜：修造、嫁娶、移徙、开市、交易。忌：栽种、下葬、求医、赴任。',
        '平': '宜：修饰垣墙、平治道涂。忌：诸事不宜。',
        '定': '宜：嫁娶、纳采、祭祀、祈福、出行。忌：求医、诉讼、赴任、出行。',
        '执': '宜：祭祀、祈福、纳表、进章、捕捉。忌：开市、交易、纳财、出行。',
        '破': '宜：破屋、求医、治病、坏垣。忌：嫁娶、安葬、纳采、出行。',
        '危': '宜：祭祀、祈福、斋醮、酬神。忌：嫁娶、开市、安葬。',
        '成': '宜：嫁娶、纳采、祭祀、祈福、开市。忌：安葬、出行、赴任。',
        '收': '宜：祭祀、祈福、纳采、嫁娶、出行。忌：开市、动土、安葬。',
        '开': '宜：嫁娶、纳采、开市、出行、动土。忌：安葬、祭祀、入殓。',
        '闭': '宜：安葬、祭祀、祈福、纳采、嫁娶。忌：出行、动土、开市。'
    };

    // 获取十二神（黄道日）
    const shiErShenMap: Record<number, { name: string; luck: '吉' | '凶' }> = {
        0: { name: '青龙', luck: '吉' },
        1: { name: '明堂', luck: '吉' },
        2: { name: '天刑', luck: '凶' },
        3: { name: '朱雀', luck: '凶' },
        4: { name: '金匮', luck: '吉' },
        5: { name: '天德', luck: '吉' },
        6: { name: '白虎', luck: '凶' },
        7: { name: '玉堂', luck: '吉' },
        8: { name: '天牢', luck: '凶' },
        9: { name: '玄武', luck: '凶' },
        10: { name: '司命', luck: '吉' },
        11: { name: '勾陈', luck: '凶' }
    };

    // 计算值星（简化版，实际应使用完整算法）
    const dayIndex = lunar.getDay();
    const zhiXing = zhiXingMap[dayIndex % 12];
    const shiErShen = shiErShenMap[dayIndex % 12];

    // 获取八字 - getBaZi 返回的是 string[]
    const baZiArray = lunar.getBaZi();

    // 获取纳音 - 使用正确的 API
    const naYin = '';

    // 获取吉神凶煞
    const jiShen: string[] = [];
    const xiongSha: string[] = [];

    // 简化处理：根据节气和建除值星推算
    if (zhiXing === '开' || zhiXing === '成' || zhiXing === '满' || zhiXing === '定') {
        jiShen.push('天德', '月德', '三合', '六合');
    }
    if (zhiXing === '除' || zhiXing === '执' || zhiXing === '收') {
        jiShen.push('天恩', '母仓', '不将');
    }
    if (term) {
        jiShen.push('节气', '天赦');
    }
    if (zhiXing === '破' || zhiXing === '危' || zhiXing === '闭') {
        xiongSha.push('月破', '大耗', '四击');
    }
    if (shiErShen.luck === '凶') {
        xiongSha.push(shiErShen.name);
    }

    // 获取二十八宿
    const xiu = lunar.getXiu();
    const xiuLuck = lunar.getXiuLuck();
    const xiuSong = lunar.getXiuSong();

    // 获取方位（简化版）
    const directionMap: Record<string, string> = {
        '甲': '东北', '乙': '东北', '丙': '西南', '丁': '西南',
        '戊': '东南', '己': '东南', '庚': '西北', '辛': '西北',
        '壬': '正南', '癸': '正南'
    };

    const dayGan = lunar.getDayInGanZhi().charAt(0);

    return {
        // 基础日期信息
        year: lunar.getYear(),
        month: lunar.getMonth(),
        day: lunar.getDay(),
        monthName: lunar.getMonthInChinese(),
        dayName: lunar.getDayInChinese(),
        yearName: lunar.getYearInChinese(),
        isLeap: false,
        julianDay: solar.getJulianDay(),
        week: lunar.getWeekInChinese(),

        // 干支生肖
        zodiac: lunar.getYearShengXiao(),
        ganZhiYear: lunar.getYearInGanZhi(),
        ganZhiMonth: lunar.getMonthInGanZhi(),
        ganZhiDay: lunar.getDayInGanZhi(),

        // 节气节日
        term: term || undefined,
        festivals,
        isTermDay: !!term,

        // 彭祖百忌
        pengZuDay: lunar.getPengZuGan() + ' ' + lunar.getPengZuZhi(),
        pengZuHour: '',

        // 每日宜忌
        yi: zhiXing === '破' || zhiXing === '危' ? ['祭祀', '沐浴', '扫舍'] : ['祭祀', '祈福', '嫁娶', '出行', '开市'],
        ji: zhiXing === '破' || zhiXing === '危' ? ['嫁娶', '安葬', '开市'] : ['动土', '开仓', '纳采'],

        // 吉神凶煞
        jiShen,
        xiongSha,

        // 神煞方位
        xiGod: { name: directionMap[dayGan] || '正南', description: '喜神方位' },
        fuGod: { name: '正东', description: '福神方位' },
        caiGod: { name: lunar.getDayPositionCai(), description: '财神方位' },
        yangGuiGod: { name: lunar.getDayPositionYangGui(), description: '阳贵神方位' },
        yinGuiGod: { name: lunar.getDayPositionYinGui(), description: '阴贵神方位' },

        // 其他方位
        taiShen: lunar.getDayPositionTai(),
        chongSha: lunar.getDayChongDesc(),
        sha: lunar.getDaySha(),

        // 纳音五行
        naYin: naYin || '',
        yearNaYin: lunar.getYearNaYin(),
        monthNaYin: lunar.getMonthNaYin(),
        dayNaYin: lunar.getDayNaYin(),

        // 星宿
        xiu: xiu || '',
        xiuAnimal: lunar.getAnimal() || '',
        xiuLuck: xiuLuck || '',
        xiuSong: xiuSong || '',

        // 八字信息
        baZiYear: baZiArray[0] || '',
        baZiMonth: baZiArray[1] || '',
        baZiDay: baZiArray[2] || '',
        baZiHour: baZiArray[3] || '',
        baZi: baZiArray.join(' ') || '',

        // 五行 - lunar-typescript 没有直接的五行 API，使用简化的方式
        yearWuXing: '',
        monthWuXing: '',
        dayWuXing: '',
        hourWuXing: '',

        // 十神
        yearShiShen: '',
        monthShiShen: '',
        hourShiShen: '',

        // 建除十二值星
        zhiXing,
        zhiXingDesc: zhiXingDescMap[zhiXing] || '',

        // 十二神
        shiErShen: shiErShen.name,
        shiErShenLuck: shiErShen.luck,

        // 黄道日
        isHuangDao: shiErShen.luck === '吉',
        huangDaoName: shiErShen.name,
    };
};

/**
 * 获取简化的农历显示文本
 * Get simplified lunar display text
 */
const getLunarDisplayText = (lunarInfo: LunarInfo): string => {
    // 优先显示节气
    if (lunarInfo.term) {
        return lunarInfo.term;
    }

    // 农历月初显示月份，其他显示日期
    const dayName = lunarInfo.dayName;
    if (dayName === '初一') {
        return lunarInfo.isLeap ? `闰${lunarInfo.monthName}` : lunarInfo.monthName;
    }

    return dayName;
};

// 月份名称
const MONTH_NAMES = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
];

// 月份英文名称（用于副标题）
const MONTH_EN_NAMES = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

// 周标题
const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

// 默认表单配置
const DEFAULT_FORM_CONFIG: DatePanelFormConfig = {
    fields: [
        { name: 'title', label: '标题', type: 'text', placeholder: '请输入标题', required: true },
        { name: 'content', label: '内容', type: 'textarea', placeholder: '请输入内容' },
    ],
    submitText: '保存',
    cancelText: '取消',
};

/**
 * 获取某年某月的天数
 * Get days in month
 */
const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
};

/**
 * 获取某月第一天是周几
 * Get first day of month
 */
const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
};

/**
 * 判断是否为同一天
 * Check if same day
 */
const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
};

/**
 * 判断日期是否在选择列表中
 * Check if date is in selected list
 */
const isDateInList = (date: Date, list: Date[]): boolean => {
    return list.some(d => isSameDay(d, date));
};

/**
 * 从选择列表中移除日期
 * Remove date from selected list
 */
const removeDateFromList = (date: Date, list: Date[]): Date[] => {
    return list.filter(d => !isSameDay(d, date));
};

/**
 * 添加日期到选择列表
 * Add date to selected list
 */
const addDateToList = (date: Date, list: Date[]): Date[] => {
    if (isDateInList(date, list)) return list;
    return [...list, date];
};

/**
 * 判断是否为今天
 * Check if today
 */
const isToday = (date: Date): boolean => {
    return isSameDay(date, new Date());
};

/**
 * 获取日期字符串键值 (YYYY-MM-DD)
 * Get date key string
 */
const getDateKey = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * 获取日期数组（包含上月和下月的日期以填充网格）
 * Get calendar days
 */
const getCalendarDays = (year: number, month: number, firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6): Date[] => {
    const days: Date[] = [];
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    // 计算需要显示的上月天数
    const prevMonthDays = firstDay >= firstDayOfWeek
        ? firstDay - firstDayOfWeek
        : 7 - (firstDayOfWeek - firstDay);

    // 上月的日期
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

    for (let i = prevMonthDays - 1; i >= 0; i--) {
        days.push(new Date(prevYear, prevMonth, daysInPrevMonth - i));
    }

    // 当月的日期
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i));
    }

    // 下月的日期（补足 42 天，即 6 行）
    const remainingDays = 42 - days.length;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;

    for (let i = 1; i <= remainingDays; i++) {
        days.push(new Date(nextYear, nextMonth, i));
    }

    return days;
};

/**
 * 调整周标题顺序
 * Get ordered weekdays
 */
const getOrderedWeekdays = (firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6): { label: string; index: number; isWeekend: boolean }[] => {
    const weekdays = WEEKDAYS.map((label, index) => ({
        label,
        index,
        isWeekend: index === 0 || index === 6,
    }));

    if (firstDayOfWeek === 0) return weekdays;

    return [...weekdays.slice(firstDayOfWeek), ...weekdays.slice(0, firstDayOfWeek)];
};

/**
 * Calendar 日历组件
 * Calendar component for displaying data in calendar format
 */
const Calendar: React.FC<CalendarProps> = ({
    selectionMode = 'single',
    value,
    defaultValue,
    onChange,
    dateCellRender,
    monthCellRender,
    disabledDate,
    headerRender,
    mode: controlledMode,
    onPanelChange,
    fullscreen = true,
    size = 'default',
    layout = 'horizontal',
    className,
    style,
    firstDayOfWeek = 0,
    showWeekend = true,
    editable = false,
    dateInfo = {},
    onDateInfoChange,
    panelFormConfig = DEFAULT_FORM_CONFIG,
    showLunar = false,
    lunarRender,
    enableLunarDetail = false,
}) => {
    // 内部状态
    const [internalValue, setInternalValue] = useState<Date | Date[]>(() => {
        if (selectionMode === 'multiple') {
            return defaultValue ? (Array.isArray(defaultValue) ? defaultValue : [defaultValue]) : [];
        }
        return defaultValue || new Date();
    });
    const [internalMode, setInternalMode] = useState<'month' | 'year'>('month');
    const [panelOpen, setPanelOpen] = useState(false);
    const [panelDate, setPanelDate] = useState<Date | null>(null);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    // 农历详情弹窗状态
    const [lunarDetailOpen, setLunarDetailOpen] = useState(false);
    const [lunarDetailDate, setLunarDetailDate] = useState<Date | null>(null);

    // 受控/非受控处理
    const currentValue = value !== undefined ? value : internalValue;
    const currentMode = controlledMode !== undefined ? controlledMode : internalMode;

    // 获取当前选中日期（用于单选）或第一个选中日期（用于多选）
    const currentDate: Date = useMemo(() => {
        if (selectionMode === 'multiple') {
            return Array.isArray(currentValue) && currentValue.length > 0 ? currentValue[0] : new Date();
        }
        return currentValue as Date;
    }, [selectionMode, currentValue]);

    // 当前显示的年月
    const [viewDate, setViewDate] = useState<Date>(() => currentDate);

    // 同步 viewDate 当 currentDate 改变时
    React.useEffect(() => {
        setViewDate(prevViewDate => {
            // 只有当日期实际变化时才更新，避免无限循环
            if (!isSameDay(prevViewDate, currentDate)) {
                return currentDate;
            }
            return prevViewDate;
        });
    }, [currentDate]);

    // 年月信息
    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();

    // 周标题
    const orderedWeekdays = useMemo(() => getOrderedWeekdays(firstDayOfWeek), [firstDayOfWeek]);

    // 日期数据
    const calendarDays = useMemo(() => {
        return getCalendarDays(currentYear, currentMonth, firstDayOfWeek);
    }, [currentYear, currentMonth, firstDayOfWeek]);

    // 获取日期的信息列表
    const getDateInfoList = useCallback((date: Date): DateInfoItem[] => {
        const key = getDateKey(date);
        return dateInfo[key] || [];
    }, [dateInfo]);

    // 检查日期是否被选中（用于多选模式）
    const isSelectedDate = useCallback((date: Date): boolean => {
        if (selectionMode === 'multiple') {
            const selectedDates = Array.isArray(currentValue) ? currentValue : [];
            return isDateInList(date, selectedDates);
        }
        return isSameDay(date, currentValue as Date);
    }, [selectionMode, currentValue]);

    // 处理日期点击
    const handleDateClick = useCallback((date: Date) => {
        if (disabledDate?.(date)) return;

        if (selectionMode === 'multiple') {
            // 多选模式
            const selectedDates = Array.isArray(currentValue) ? currentValue : [];
            let newSelectedDates: Date[];

            if (isDateInList(date, selectedDates)) {
                // 已选中，取消选择
                newSelectedDates = removeDateFromList(date, selectedDates);
            } else {
                // 未选中，添加选择
                newSelectedDates = addDateToList(date, selectedDates);
            }

            if (value === undefined) {
                setInternalValue(newSelectedDates);
            }
            onChange?.(newSelectedDates);
        } else {
            // 单选模式
            if (value === undefined) {
                setInternalValue(date);
            }
            onChange?.(date);

            // 如果启用了编辑功能，打开面板
            if (editable) {
                setPanelDate(date);
                setEditingIndex(null);
                setFormData({});
                setPanelOpen(true);
            }
        }
    }, [disabledDate, onChange, value, editable, selectionMode, currentValue]);

    // 处理月份点击
    const handleMonthClick = useCallback((month: number) => {
        const newDate = new Date(viewDate);
        newDate.setMonth(month);

        if (value === undefined) {
            setInternalValue(newDate);
        }
        onChange?.(newDate);
        setViewDate(newDate);
        setInternalMode('month');
    }, [viewDate, value, onChange]);

    // 处理模式切换
    const handleModeChange = useCallback((newMode: 'month' | 'year') => {
        setInternalMode(newMode);
        onPanelChange?.(viewDate, newMode);
    }, [viewDate, onPanelChange]);

    // 处理年份切换
    const handleYearChange = useCallback((delta: number) => {
        const newDate = new Date(viewDate);
        newDate.setFullYear(newDate.getFullYear() + delta);
        setViewDate(newDate);
        onPanelChange?.(newDate, currentMode);
    }, [viewDate, currentMode, onPanelChange]);

    // 处理月份切换
    const handleMonthChange = useCallback((delta: number) => {
        const newDate = new Date(viewDate);
        newDate.setMonth(newDate.getMonth() + delta);
        setViewDate(newDate);
        onPanelChange?.(newDate, currentMode);
    }, [viewDate, currentMode, onPanelChange]);

    // 关闭面板
    const closePanel = useCallback(() => {
        setPanelOpen(false);
        setPanelDate(null);
        setFormData({});
        setEditingIndex(null);
    }, []);

    // 打开农历详情弹窗
    const openLunarDetail = useCallback((date: Date) => {
        setLunarDetailDate(date);
        setLunarDetailOpen(true);
    }, []);

    // 关闭农历详情弹窗
    const closeLunarDetail = useCallback(() => {
        setLunarDetailOpen(false);
        setLunarDetailDate(null);
    }, []);

    // 处理表单字段变化
    const handleFieldChange = useCallback((name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    // 保存信息
    const handleSave = useCallback(() => {
        if (!panelDate) return;

        // 验证必填字段
        const requiredFields = panelFormConfig.fields.filter(f => f.required);
        for (const field of requiredFields) {
            if (!formData[field.name]?.trim()) {
                return; // 必填字段未填写，不保存
            }
        }

        const key = getDateKey(panelDate);
        const currentList = dateInfo[key] || [];
        let newList: DateInfoItem[];

        if (editingIndex !== null) {
            // 编辑模式
            newList = [...currentList];
            newList[editingIndex] = {
                title: formData.title || '',
                content: formData.content || '',
                color: formData.color || '#1890ff',
            };
        } else {
            // 新增模式
            newList = [
                ...currentList,
                {
                    title: formData.title || '',
                    content: formData.content || '',
                    color: formData.color || '#1890ff',
                },
            ];
        }

        onDateInfoChange?.(panelDate, newList);
        closePanel();
    }, [panelDate, formData, editingIndex, dateInfo, onDateInfoChange, panelFormConfig.fields, closePanel]);

    // 编辑某条信息
    const handleEdit = useCallback((index: number, item: DateInfoItem) => {
        setEditingIndex(index);
        setFormData({
            title: item.title,
            content: item.content || '',
            color: item.color || '#1890ff',
        });
    }, []);

    // 删除某条信息
    const handleDelete = useCallback((index: number) => {
        if (!panelDate) return;
        const key = getDateKey(panelDate);
        const currentList = dateInfo[key] || [];
        const newList = currentList.filter((_, i) => i !== index);
        onDateInfoChange?.(panelDate, newList);
        if (editingIndex === index) {
            setEditingIndex(null);
            setFormData({});
        }
    }, [panelDate, dateInfo, onDateInfoChange, editingIndex]);

    // 渲染头部
    const renderHeader = () => {
        if (headerRender) {
            return headerRender({
                value: viewDate,
                onChange: setViewDate,
                type: currentMode,
                onTypeChange: handleModeChange,
            });
        }

        return (
            <div className="zjpcy-calendar__header">
                <div className="zjpcy-calendar__header-left">
                    <Button
                        className="zjpcy-calendar__header-btn"
                        onClick={() => handleYearChange(-1)}
                        title="上一年"
                    >
                        <Icon type="double-left" style={{ fontSize: 12 }} />
                    </Button>
                    {currentMode === 'month' && (
                        <Button
                            className="zjpcy-calendar__header-btn"
                            onClick={() => handleMonthChange(-1)}
                            title="上个月"
                        >
                            <Icon type="left" style={{ fontSize: 12 }} />
                        </Button>
                    )}
                </div>

                <div className="zjpcy-calendar__header-title">
                    <Button
                        className="zjpcy-calendar__header-title-btn"
                        onClick={() => handleModeChange('year')}
                    >
                        {currentYear}年
                    </Button>
                    {currentMode === 'month' && (
                        <Button
                            className="zjpcy-calendar__header-title-btn"
                            onClick={() => handleModeChange('year')}
                        >
                            {MONTH_NAMES[currentMonth]}
                        </Button>
                    )}
                </div>

                <div className="zjpcy-calendar__header-right">
                    {currentMode === 'month' && (
                        <Button
                            className="zjpcy-calendar__header-btn"
                            onClick={() => handleMonthChange(1)}
                            title="下个月"
                        >
                            <Icon type="right" style={{ fontSize: 12 }} />
                        </Button>
                    )}
                    <Button
                        className="zjpcy-calendar__header-btn"
                        onClick={() => handleYearChange(1)}
                        title="下一年"
                    >
                        <Icon type="double-right" style={{ fontSize: 12 }} />
                    </Button>
                </div>
            </div>
        );
    };

    // 渲染日期单元格内容
    const renderDateCellContent = (_date: Date, infoList: DateInfoItem[]) => {
        const displayCount = 2; // 最多显示2条
        const displayItems = infoList.slice(0, displayCount);
        const remainingCount = infoList.length - displayCount;

        return (
            <div className="zjpcy-calendar__date-info-list">
                {displayItems.map((item, index) => (
                    <div
                        key={index}
                        className="zjpcy-calendar__date-info-item"
                        style={{ color: item.color || '#1890ff' }}
                    >
                        <span className="zjpcy-calendar__date-info-dot" style={{ backgroundColor: item.color || '#1890ff' }} />
                        <span className="zjpcy-calendar__date-info-text">{item.title}</span>
                    </div>
                ))}
                {remainingCount > 0 && (
                    <div className="zjpcy-calendar__date-info-more">
                        +{remainingCount} 更多
                    </div>
                )}
            </div>
        );
    };

    // 渲染日期信息的 Tooltip 内容
    const renderInfoTooltip = (infoList: DateInfoItem[]) => {
        return (
            <div className="zjpcy-calendar__info-tooltip">
                {infoList.map((item, index) => (
                    <div key={index} className="zjpcy-calendar__info-tooltip-item">
                        <div className="zjpcy-calendar__info-tooltip-title" style={{ color: item.color || '#1890ff' }}>
                            <span className="zjpcy-calendar__info-tooltip-dot" style={{ backgroundColor: item.color || '#1890ff' }} />
                            {item.title}
                        </div>
                        {item.content && (
                            <div className="zjpcy-calendar__info-tooltip-content">{item.content}</div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    // 渲染月视图
    const renderMonthView = () => {
        return (
            <>
                <div className="zjpcy-calendar__weekday-header">
                    {orderedWeekdays.map(({ label, index, isWeekend }) => (
                        <div
                            key={index}
                            className={classNames('zjpcy-calendar__weekday-cell', {
                                'zjpcy-calendar__weekday-cell--weekend': isWeekend,
                            })}
                        >
                            {label}
                        </div>
                    ))}
                </div>
                <div className="zjpcy-calendar__date-grid">
                    {calendarDays.map((date, index) => {
                        const inCurrentMonth = date.getMonth() === currentMonth;
                        const todayFlag = isToday(date);
                        const selectedFlag = isSelectedDate(date);
                        const disabled = disabledDate?.(date) || false;
                        const isWeekendDay = date.getDay() === 0 || date.getDay() === 6;
                        const shouldHide = !showWeekend && isWeekendDay;
                        const infoList = getDateInfoList(date);
                        const hasInfo = infoList.length > 0;

                        // 获取农历信息
                        const lunarInfo = showLunar ? getLunarInfo(date) : null;
                        const isLunarTerm = lunarInfo?.term !== undefined && lunarInfo.term !== '';

                        const cellContent = (
                            <div
                                key={index}
                                className={classNames('zjpcy-calendar__date-cell', {
                                    'zjpcy-calendar__date-cell--other-month': !inCurrentMonth,
                                    'zjpcy-calendar__date-cell--today': todayFlag,
                                    'zjpcy-calendar__date-cell--selected': selectedFlag,
                                    'zjpcy-calendar__date-cell--disabled': disabled,
                                    'zjpcy-calendar__date-cell--hidden': shouldHide,
                                    'zjpcy-calendar__date-cell--has-info': hasInfo,
                                    'zjpcy-calendar__date-cell--show-lunar': showLunar && lunarInfo,
                                })}
                                onClick={() => handleDateClick(date)}
                                onDoubleClick={() => enableLunarDetail && showLunar && lunarInfo && openLunarDetail(date)}
                            >
                                <div className="zjpcy-calendar__date-cell-header">
                                    <span
                                        className={classNames('zjpcy-calendar__date-number', {
                                            'zjpcy-calendar__date-number--today': todayFlag,
                                        })}
                                    >
                                        {date.getDate()}
                                    </span>
                                    {showLunar && lunarInfo && (
                                        <span
                                            className={classNames('zjpcy-calendar__lunar-text', {
                                                'zjpcy-calendar__lunar-text--term': isLunarTerm,
                                            })}
                                            title={`${lunarInfo.ganZhiYear} ${lunarInfo.zodiac}年 ${lunarInfo.monthName}${lunarInfo.dayName}`}
                                        >
                                            {lunarRender ? lunarRender(lunarInfo) : getLunarDisplayText(lunarInfo)}
                                        </span>
                                    )}
                                </div>
                                {dateCellRender && (
                                    <div className="zjpcy-calendar__date-content">
                                        {dateCellRender(date, lunarInfo || undefined)}
                                    </div>
                                )}
                                {hasInfo && renderDateCellContent(date, infoList)}
                            </div>
                        );

                        // 如果有信息且需要显示 Tooltip
                        if (hasInfo && infoList.length > 2) {
                            return (
                                <Tooltip
                                    key={index}
                                    title={renderInfoTooltip(infoList)}
                                    placement="top"
                                    delay={200}
                                >
                                    {cellContent}
                                </Tooltip>
                            );
                        }

                        return cellContent;
                    })}
                </div>
            </>
        );
    };

    // 渲染年视图
    const renderYearView = () => {
        return (
            <div className="zjpcy-calendar__month-grid">
                {MONTH_NAMES.map((monthName, index) => {
                    const monthDate = new Date(currentYear, index, 1);
                    const isMonthSelected = () => {
                        if (selectionMode === 'multiple') {
                            const selectedDates = Array.isArray(currentValue) ? currentValue : [];
                            return selectedDates.some(d => d.getMonth() === index && d.getFullYear() === currentYear);
                        }
                        const date = currentValue as Date;
                        return date.getMonth() === index && date.getFullYear() === currentYear;
                    };
                    const selectedFlag = isMonthSelected();

                    return (
                        <div
                            key={index}
                            className={classNames('zjpcy-calendar__month-cell', {
                                'zjpcy-calendar__month-cell--selected': selectedFlag,
                            })}
                            onClick={() => handleMonthClick(index)}
                        >
                            {monthCellRender ? (
                                monthCellRender(monthDate)
                            ) : (
                                <>
                                    <span className="zjpcy-calendar__month-name">{monthName}</span>
                                    <span className="zjpcy-calendar__month-subtitle">{MONTH_EN_NAMES[index]}</span>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    // 渲染编辑面板
    const renderEditPanel = () => {
        if (!panelOpen || !panelDate) return null;

        const dateKey = getDateKey(panelDate);
        const infoList = dateInfo[dateKey] || [];
        const config = panelFormConfig;

        const modalFooter = (
            <>
                {editingIndex !== null && (
                    <Button
                        className="zjpcy-calendar__panel-btn is-secondary"
                        onClick={() => {
                            setEditingIndex(null);
                            setFormData({});
                        }}
                    >
                        取消编辑
                    </Button>
                )}
                <Button
                    className="zjpcy-calendar__panel-btn is-secondary"
                    onClick={closePanel}
                >
                    {config.cancelText || '取消'}
                </Button>
                <Button
                    className="zjpcy-calendar__panel-btn is-primary"
                    onClick={handleSave}
                >
                    {editingIndex !== null ? '保存修改' : (config.submitText || '保存')}
                </Button>
            </>
        );

        return (
            <Modal
                visible={panelOpen}
                title={`${panelDate.toLocaleDateString('zh-CN')} 信息编辑`}
                width={480}
                onCancel={closePanel}
                onOk={handleSave}
                footer={modalFooter}
            >
                <div className="zjpcy-calendar__panel-body">
                    {/* 已有信息列表 */}
                    {infoList.length > 0 && (
                        <div className="zjpcy-calendar__panel-list">
                            <h4 className="zjpcy-calendar__panel-section-title">已有信息</h4>
                            {infoList.map((item, index) => (
                                <div
                                    key={index}
                                    className={classNames('zjpcy-calendar__panel-list-item', {
                                        'is-editing': editingIndex === index,
                                    })}
                                >
                                    <div className="zjpcy-calendar__panel-list-content">
                                        <span
                                            className="zjpcy-calendar__panel-list-dot"
                                            style={{ backgroundColor: item.color || '#1890ff' }}
                                        />
                                        <div className="zjpcy-calendar__panel-list-text">
                                            <div className="zjpcy-calendar__panel-list-title">{item.title}</div>
                                            {item.content && (
                                                <div className="zjpcy-calendar__panel-list-desc">{item.content}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="zjpcy-calendar__panel-list-actions">
                                        <Button
                                            className="zjpcy-calendar__panel-list-btn"
                                            onClick={() => handleEdit(index, item)}
                                        >
                                            编辑
                                        </Button>
                                        <Button
                                            className="zjpcy-calendar__panel-list-btn is-danger"
                                            onClick={() => handleDelete(index)}
                                        >
                                            删除
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 表单 */}
                    <div className="zjpcy-calendar__panel-form">
                        <h4 className="zjpcy-calendar__panel-section-title">
                            {editingIndex !== null ? '编辑信息' : '添加新信息'}
                        </h4>
                        {config.fields.map(field => (
                            <div key={field.name} className="zjpcy-calendar__panel-field">
                                <label className="zjpcy-calendar__panel-label">
                                    {field.label}
                                    {field.required && <span className="zjpcy-calendar__panel-required">*</span>}
                                </label>
                                {field.type === 'textarea' ? (
                                    <Textarea
                                        className="zjpcy-calendar__panel-textarea"
                                        value={formData[field.name] || ''}
                                        onChange={e => handleFieldChange(field.name, e.target.value)}
                                        placeholder={field.placeholder}
                                        rows={3}
                                    />
                                ) : (
                                    <Input
                                        className="zjpcy-calendar__panel-input"
                                        value={formData[field.name] || ''}
                                        onChange={e => handleFieldChange(field.name, e.target.value)}
                                        placeholder={field.placeholder}
                                    />
                                )}
                            </div>
                        ))}
                        <div className="zjpcy-calendar__panel-color">
                            <label className="zjpcy-calendar__panel-label">颜色标记</label>
                            <div className="zjpcy-calendar__panel-color-picker">
                                {['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2'].map(color => (
                                    <button
                                        key={color}
                                        className={classNames('zjpcy-calendar__panel-color-option', {
                                            'is-active': formData.color === color || (!formData.color && color === '#1890ff'),
                                        })}
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleFieldChange('color', color)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    };

    // 渲染农历详情弹窗
    const renderLunarDetailPanel = () => {
        if (!lunarDetailOpen || !lunarDetailDate) return null;

        const lunarInfo = getLunarInfo(lunarDetailDate);
        const dateStr = lunarDetailDate.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });

        return (
            <div className="zjpcy-calendar__lunar-overlay" onClick={closeLunarDetail}>
                <div className="zjpcy-calendar__lunar-panel" onClick={e => e.stopPropagation()}>
                    <div className="zjpcy-calendar__lunar-header">
                        <h3 className="zjpcy-calendar__lunar-title">
                            <span className="zjpcy-calendar__lunar-date">{dateStr}</span>
                            <span className="zjpcy-calendar__lunar-tag">{lunarInfo.ganZhiYear} {lunarInfo.zodiac}年</span>
                        </h3>
                        <Button className="zjpcy-calendar__lunar-close" onClick={closeLunarDetail}>
                            <Icon type="close" size={16} />
                        </Button>
                    </div>

                    <div className="zjpcy-calendar__lunar-body">
                        {/* 基础信息 */}
                        <div className="zjpcy-calendar__lunar-section">
                            <h4 className="zjpcy-calendar__lunar-section-title">农历信息</h4>
                            <div className="zjpcy-calendar__lunar-grid">
                                <div className="zjpcy-calendar__lunar-item">
                                    <span className="zjpcy-calendar__lunar-label">农历日期</span>
                                    <span className="zjpcy-calendar__lunar-value">{lunarInfo.yearName} {lunarInfo.monthName}{lunarInfo.dayName}</span>
                                </div>
                                <div className="zjpcy-calendar__lunar-item">
                                    <span className="zjpcy-calendar__lunar-label">星期</span>
                                    <span className="zjpcy-calendar__lunar-value">星期{lunarInfo.week}</span>
                                </div>
                                <div className="zjpcy-calendar__lunar-item">
                                    <span className="zjpcy-calendar__lunar-label">儒略日</span>
                                    <span className="zjpcy-calendar__lunar-value">{lunarInfo.julianDay}</span>
                                </div>
                                {lunarInfo.term && (
                                    <div className="zjpcy-calendar__lunar-item">
                                        <span className="zjpcy-calendar__lunar-label">节气</span>
                                        <span className="zjpcy-calendar__lunar-value zjpcy-calendar__lunar-value--highlight">{lunarInfo.term}</span>
                                    </div>
                                )}
                                {lunarInfo.festivals.length > 0 && (
                                    <div className="zjpcy-calendar__lunar-item">
                                        <span className="zjpcy-calendar__lunar-label">节日</span>
                                        <span className="zjpcy-calendar__lunar-value zjpcy-calendar__lunar-value--highlight">{lunarInfo.festivals.join('、')}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 干支八字 */}
                        <div className="zjpcy-calendar__lunar-section">
                            <h4 className="zjpcy-calendar__lunar-section-title">八字信息</h4>
                            <div className="zjpcy-calendar__lunar-bazi">
                                <div className="zjpcy-calendar__lunar-bazi-item">
                                    <span className="zjpcy-calendar__lunar-bazi-label">年柱</span>
                                    <span className="zjpcy-calendar__lunar-bazi-value">{lunarInfo.baZiYear}</span>
                                    <span className="zjpcy-calendar__lunar-bazy-na">{lunarInfo.yearNaYin}</span>
                                </div>
                                <div className="zjpcy-calendar__lunar-bazi-item">
                                    <span className="zjpcy-calendar__lunar-bazi-label">月柱</span>
                                    <span className="zjpcy-calendar__lunar-bazi-value">{lunarInfo.baZiMonth}</span>
                                    <span className="zjpcy-calendar__lunar-bazy-na">{lunarInfo.monthNaYin}</span>
                                </div>
                                <div className="zjpcy-calendar__lunar-bazi-item">
                                    <span className="zjpcy-calendar__lunar-bazi-label">日柱</span>
                                    <span className="zjpcy-calendar__lunar-bazi-value">{lunarInfo.baZiDay}</span>
                                    <span className="zjpcy-calendar__lunar-bazy-na">{lunarInfo.dayNaYin}</span>
                                </div>
                                <div className="zjpcy-calendar__lunar-bazi-item">
                                    <span className="zjpcy-calendar__lunar-bazi-label">时柱</span>
                                    <span className="zjpcy-calendar__lunar-bazi-value">{lunarInfo.baZiHour || '待定'}</span>
                                    <span className="zjpcy-calendar__lunar-bazy-na">-</span>
                                </div>
                            </div>
                            <div className="zjpcy-calendar__lunar-item" style={{ marginTop: 12 }}>
                                <span className="zjpcy-calendar__lunar-label">完整八字</span>
                                <span className="zjpcy-calendar__lunar-value">{lunarInfo.baZi || '待定'}</span>
                            </div>
                        </div>

                        {/* 二十八宿 */}
                        <div className="zjpcy-calendar__lunar-section">
                            <h4 className="zjpcy-calendar__lunar-section-title">二十八宿</h4>
                            <div className="zjpcy-calendar__lunar-grid">
                                <div className="zjpcy-calendar__lunar-item">
                                    <span className="zjpcy-calendar__lunar-label">星宿</span>
                                    <span className="zjpcy-calendar__lunar-value">{lunarInfo.xiu} {lunarInfo.xiuAnimal}</span>
                                </div>
                                <div className="zjpcy-calendar__lunar-item">
                                    <span className="zjpcy-calendar__lunar-label">星宿吉凶</span>
                                    <span className={classNames('zjpcy-calendar__lunar-value', {
                                        'zjpcy-calendar__lunar-value--good': lunarInfo.xiuLuck === '吉',
                                        'zjpcy-calendar__lunar-value--bad': lunarInfo.xiuLuck === '凶'
                                    })}>{lunarInfo.xiuLuck}</span>
                                </div>
                            </div>
                            {lunarInfo.xiuSong && (
                                <div className="zjpcy-calendar__lunar-song">
                                    {lunarInfo.xiuSong}
                                </div>
                            )}
                        </div>

                        {/* 黄道日 */}
                        <div className="zjpcy-calendar__lunar-section">
                            <h4 className="zjpcy-calendar__lunar-section-title">黄道日</h4>
                            <div className="zjpcy-calendar__lunar-grid">
                                <div className="zjpcy-calendar__lunar-item">
                                    <span className="zjpcy-calendar__lunar-label">十二值星</span>
                                    <span className="zjpcy-calendar__lunar-value">{lunarInfo.zhiXing}</span>
                                </div>
                                <div className="zjpcy-calendar__lunar-item">
                                    <span className="zjpcy-calendar__lunar-label">十二神</span>
                                    <span className={classNames('zjpcy-calendar__lunar-value', {
                                        'zjpcy-calendar__lunar-value--good': lunarInfo.shiErShenLuck === '吉',
                                        'zjpcy-calendar__lunar-value--bad': lunarInfo.shiErShenLuck === '凶'
                                    })}>{lunarInfo.shiErShen}（{lunarInfo.shiErShenLuck}）</span>
                                </div>
                                <div className="zjpcy-calendar__lunar-item">
                                    <span className="zjpcy-calendar__lunar-label">黄道吉日</span>
                                    <span className={classNames('zjpcy-calendar__lunar-value', {
                                        'zjpcy-calendar__lunar-value--good': lunarInfo.isHuangDao,
                                        'zjpcy-calendar__lunar-value--bad': !lunarInfo.isHuangDao
                                    })}>{lunarInfo.isHuangDao ? '是' : '否'}</span>
                                </div>
                            </div>
                            {lunarInfo.zhiXingDesc && (
                                <div className="zjpcy-calendar__lunar-desc">
                                    {lunarInfo.zhiXingDesc}
                                </div>
                            )}
                        </div>

                        {/* 彭祖百忌 */}
                        <div className="zjpcy-calendar__lunar-section">
                            <h4 className="zjpcy-calendar__lunar-section-title">彭祖百忌</h4>
                            <div className="zjpcy-calendar__lunar-text-content">
                                <p>{lunarInfo.pengZuDay}</p>
                            </div>
                        </div>

                        {/* 宜忌 */}
                        <div className="zjpcy-calendar__lunar-section zjpcy-calendar__lunar-section--yiji">
                            <div className="zjpcy-calendar__lunar-yi">
                                <h4 className="zjpcy-calendar__lunar-section-title">宜</h4>
                                <div className="zjpcy-calendar__lunar-yiji-content">
                                    {lunarInfo.yi.length > 0 ? lunarInfo.yi.map((item, i) => (
                                        <span key={i} className="zjpcy-calendar__lunar-yiji-item">{item}</span>
                                    )) : <span className="zjpcy-calendar__lunar-yiji-empty">诸事不宜</span>}
                                </div>
                            </div>
                            <div className="zjpcy-calendar__lunar-ji">
                                <h4 className="zjpcy-calendar__lunar-section-title">忌</h4>
                                <div className="zjpcy-calendar__lunar-yiji-content">
                                    {lunarInfo.ji.length > 0 ? lunarInfo.ji.map((item, i) => (
                                        <span key={i} className="zjpcy-calendar__lunar-yiji-item">{item}</span>
                                    )) : <span className="zjpcy-calendar__lunar-yiji-empty">无</span>}
                                </div>
                            </div>
                        </div>

                        {/* 吉神凶煞 */}
                        {(lunarInfo.jiShen.length > 0 || lunarInfo.xiongSha.length > 0) && (
                            <div className="zjpcy-calendar__lunar-section">
                                <h4 className="zjpcy-calendar__lunar-section-title">神煞</h4>
                                {lunarInfo.jiShen.length > 0 && (
                                    <div className="zjpcy-calendar__lunar-shensha">
                                        <span className="zjpcy-calendar__lunar-shensha-label">吉神：</span>
                                        <span className="zjpcy-calendar__lunar-shensha-value zjpcy-calendar__lunar-shensha-value--good">{lunarInfo.jiShen.join('、')}</span>
                                    </div>
                                )}
                                {lunarInfo.xiongSha.length > 0 && (
                                    <div className="zjpcy-calendar__lunar-shensha">
                                        <span className="zjpcy-calendar__lunar-shensha-label">凶煞：</span>
                                        <span className="zjpcy-calendar__lunar-shensha-value zjpcy-calendar__lunar-shensha-value--bad">{lunarInfo.xiongSha.join('、')}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 方位 */}
                        <div className="zjpcy-calendar__lunar-section">
                            <h4 className="zjpcy-calendar__lunar-section-title">方位</h4>
                            <div className="zjpcy-calendar__lunar-grid zjpcy-calendar__lunar-grid--4">
                                <div className="zjpcy-calendar__lunar-item">
                                    <span className="zjpcy-calendar__lunar-label">喜神</span>
                                    <span className="zjpcy-calendar__lunar-value">{lunarInfo.xiGod.name}</span>
                                </div>
                                <div className="zjpcy-calendar__lunar-item">
                                    <span className="zjpcy-calendar__lunar-label">福神</span>
                                    <span className="zjpcy-calendar__lunar-value">{lunarInfo.fuGod.name}</span>
                                </div>
                                <div className="zjpcy-calendar__lunar-item">
                                    <span className="zjpcy-calendar__lunar-label">财神</span>
                                    <span className="zjpcy-calendar__lunar-value">{lunarInfo.caiGod.name}</span>
                                </div>
                                <div className="zjpcy-calendar__lunar-item">
                                    <span className="zjpcy-calendar__lunar-label">阳贵</span>
                                    <span className="zjpcy-calendar__lunar-value">{lunarInfo.yangGuiGod.name}</span>
                                </div>
                                <div className="zjpcy-calendar__lunar-item">
                                    <span className="zjpcy-calendar__lunar-label">阴贵</span>
                                    <span className="zjpcy-calendar__lunar-value">{lunarInfo.yinGuiGod.name}</span>
                                </div>
                                <div className="zjpcy-calendar__lunar-item">
                                    <span className="zjpcy-calendar__lunar-label">胎神</span>
                                    <span className="zjpcy-calendar__lunar-value">{lunarInfo.taiShen}</span>
                                </div>
                                <div className="zjpcy-calendar__lunar-item">
                                    <span className="zjpcy-calendar__lunar-label">冲煞</span>
                                    <span className="zjpcy-calendar__lunar-value">{lunarInfo.chongSha}</span>
                                </div>
                                <div className="zjpcy-calendar__lunar-item">
                                    <span className="zjpcy-calendar__lunar-label">煞方</span>
                                    <span className="zjpcy-calendar__lunar-value">{lunarInfo.sha}</span>
                                </div>
                            </div>
                        </div>

                        {/* 五行 */}
                        <div className="zjpcy-calendar__lunar-section">
                            <h4 className="zjpcy-calendar__lunar-section-title">五行</h4>
                            <div className="zjpcy-calendar__lunar-grid">
                                <div className="zjpcy-calendar__lunar-item">
                                    <span className="zjpcy-calendar__lunar-label">年五行</span>
                                    <span className="zjpcy-calendar__lunar-value">{lunarInfo.yearWuXing}</span>
                                </div>
                                <div className="zjpcy-calendar__lunar-item">
                                    <span className="zjpcy-calendar__lunar-label">月五行</span>
                                    <span className="zjpcy-calendar__lunar-value">{lunarInfo.monthWuXing}</span>
                                </div>
                                <div className="zjpcy-calendar__lunar-item">
                                    <span className="zjpcy-calendar__lunar-label">日五行</span>
                                    <span className="zjpcy-calendar__lunar-value">{lunarInfo.dayWuXing}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="zjpcy-calendar__lunar-footer">
                        <Button className="zjpcy-calendar__lunar-btn" onClick={closeLunarDetail}>
                            关闭
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    const classes = classNames('zjpcy-calendar', {
        'zjpcy-calendar--fullscreen': fullscreen,
        'zjpcy-calendar--small': size === 'small',
        'zjpcy-calendar--layout-vertical': layout === 'vertical',
        'zjpcy-calendar--small-vertical': size === 'small' && layout === 'vertical',
    }, className);

    return (
        <div className={classes} style={style}>
            {renderHeader()}
            <div className="zjpcy-calendar__body">
                {currentMode === 'month' ? renderMonthView() : renderYearView()}
            </div>
            {renderEditPanel()}
            {renderLunarDetailPanel()}
        </div>
    );
};

// 设置显示名称
Calendar.displayName = 'Calendar';

export default Calendar;
