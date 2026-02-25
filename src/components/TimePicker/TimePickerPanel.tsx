import React, { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { TimePickerPanelProps, TimeColumnProps } from './types';

// 解析时间字符串为时、分、秒
const parseTime = (timeStr: string | undefined): { hour: number; minute: number; second: number } | null => {
    if (!timeStr) return null;
    const parts = timeStr.split(':');
    if (parts.length < 2) return null;
    return {
        hour: parseInt(parts[0], 10) || 0,
        minute: parseInt(parts[1], 10) || 0,
        second: parseInt(parts[2], 10) || 0,
    };
};

// 格式化为时间字符串
const formatTime = (hour: number, minute: number, second: number, format: string): string => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    if (format === 'HH:mm') {
        return `${pad(hour)}:${pad(minute)}`;
    }
    return `${pad(hour)}:${pad(minute)}:${pad(second)}`;
};

// 时间列组件
const TimeColumn: React.FC<TimeColumnProps> = ({ options, value, onChange, unit }) => {
    const listRef = React.useRef<HTMLDivElement>(null);
    const selectedRef = React.useRef<HTMLDivElement>(null);

    // 自动滚动到选中项
    React.useEffect(() => {
        if (selectedRef.current && listRef.current) {
            const list = listRef.current;
            const selected = selectedRef.current;
            const itemHeight = 36;
            const listHeight = list.clientHeight;
            const selectedTop = selected.offsetTop;

            const targetScrollTop = selectedTop - (listHeight / 2) + (itemHeight / 2);

            requestAnimationFrame(() => {
                list.scrollTo({
                    top: Math.max(0, targetScrollTop),
                    behavior: 'smooth'
                });
            });
        }
    }, [value]);

    return (
        <div className="time-picker-column">
            <div className="time-picker-column-header">{unit}</div>
            <div className="time-picker-column-list" ref={listRef}>
                {options.map((opt) => (
                    <div
                        key={opt}
                        ref={value === opt ? selectedRef : null}
                        className={classNames('time-picker-option', {
                            selected: value === opt,
                        })}
                        onClick={() => onChange?.(opt)}
                    >
                        {opt.toString().padStart(2, '0')}
                    </div>
                ))}
            </div>
        </div>
    );
};

const TimePickerPanel: React.FC<TimePickerPanelProps> = ({
    value,
    onChange,
    format,
    hourStep,
    minuteStep,
    secondStep,
    disabledHours,
    disabledMinutes,
    disabledSeconds,
    hideDisabledOptions = false,
    showNow = true,
    showOk = true,
    onNow,
    onOk,
}) => {
    const parsed = parseTime(value);
    const [hour, setHour] = useState(parsed?.hour ?? 0);
    const [minute, setMinute] = useState(parsed?.minute ?? 0);
    const [second, setSecond] = useState(parsed?.second ?? 0);

    // 同步外部值
    useEffect(() => {
        if (parsed) {
            setHour(parsed.hour);
            setMinute(parsed.minute);
            setSecond(parsed.second);
        } else {
            const now = new Date();
            setHour(now.getHours());
            setMinute(now.getMinutes());
            setSecond(now.getSeconds());
        }
    }, [value, parsed]);

    // 生成选项列表
    const generateOptions = (max: number, step: number, disabledList: number[] = []): number[] => {
        const options: number[] = [];
        for (let i = 0; i < max; i += step) {
            if (!hideDisabledOptions || !disabledList.includes(i)) {
                options.push(i);
            }
        }
        return options;
    };

    const disabledHoursList = useMemo(() => disabledHours?.() || [], [disabledHours]);
    const disabledMinutesList = useMemo(
        () => disabledMinutes?.(hour) || [],
        [disabledMinutes, hour]
    );
    const disabledSecondsList = useMemo(
        () => disabledSeconds?.(hour, minute) || [],
        [disabledSeconds, hour, minute]
    );

    const hourOptions = useMemo(
        () => generateOptions(24, hourStep, disabledHoursList),
        [hourStep, disabledHoursList, hideDisabledOptions]
    );
    const minuteOptions = useMemo(
        () => generateOptions(60, minuteStep, disabledMinutesList),
        [minuteStep, disabledMinutesList, hideDisabledOptions]
    );
    const secondOptions = useMemo(
        () => generateOptions(60, secondStep, disabledSecondsList),
        [secondStep, disabledSecondsList, hideDisabledOptions]
    );

    const handleHourChange = (h: number) => {
        setHour(h);
        onChange?.(formatTime(h, minute, second, format));
    };

    const handleMinuteChange = (m: number) => {
        setMinute(m);
        onChange?.(formatTime(hour, m, second, format));
    };

    const handleSecondChange = (s: number) => {
        setSecond(s);
        onChange?.(formatTime(hour, minute, s, format));
    };

    const showSecond = format.includes('ss');

    return (
        <div className="time-picker-panel-container">
            <div className="time-picker-panel">
                <TimeColumn
                    unit="时"
                    options={hourOptions}
                    value={hour}
                    onChange={handleHourChange}
                />
                <TimeColumn
                    unit="分"
                    options={minuteOptions}
                    value={minute}
                    onChange={handleMinuteChange}
                />
                {showSecond && (
                    <TimeColumn
                        unit="秒"
                        options={secondOptions}
                        value={second}
                        onChange={handleSecondChange}
                    />
                )}
            </div>
            {(showNow || showOk) && (
                <div className="time-picker-footer">
                    {showNow && (
                        <button className="time-picker-now-btn" onClick={onNow}>
                            此刻
                        </button>
                    )}
                    {showOk && (
                        <button className="time-picker-ok-btn" onClick={onOk}>
                            确定
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default TimePickerPanel;
