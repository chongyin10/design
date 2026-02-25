import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import Icon from '../Icon';
import './TimePicker.css';
import { TimePickerProps } from './types';
import TimePickerPanel from './TimePickerPanel';
import RangePicker from './RangePicker';

// 格式化为时间字符串
const formatTime = (hour: number, minute: number, second: number, format: string): string => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    if (format === 'HH:mm') {
        return `${pad(hour)}:${pad(minute)}`;
    }
    return `${pad(hour)}:${pad(minute)}:${pad(second)}`;
};

// 主组件
const TimePicker: React.FC<TimePickerProps> & {
    RangePicker: typeof RangePicker;
} = ({
    size = 'middle',
    value: externalValue,
    defaultValue,
    onChange,
    placeholder = '请选择时间',
    disabled = false,
    readOnly = false,
    className = '',
    style,
    width = 120,
    format = 'HH:mm:ss',
    allowClear = true,
    hourStep = 1,
    minuteStep = 1,
    secondStep = 1,
    disabledHours,
    disabledMinutes,
    disabledSeconds,
    hideDisabledOptions = false,
    label,
    labelGap = 8,
    labelClassName = '',
    labelStyle,
    onOpenChange,
    open: externalOpen,
    showNow = true,
    showOk = true,
}) => {
    const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
    const [internalOpen, setInternalOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isControlled = externalValue !== undefined;
    const value = isControlled ? externalValue : internalValue;
    const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;

    // 计算下拉面板位置
    const updateDropdownPosition = useCallback(() => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        setDropdownPosition({
            top: rect.bottom + window.scrollY + 4,
            left: rect.left + window.scrollX,
        });
    }, []);

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
            // 打开时立即更新位置
            updateDropdownPosition();
            // 添加滚动和调整大小监听
            window.addEventListener('scroll', updateDropdownPosition, true);
            window.addEventListener('resize', updateDropdownPosition);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', updateDropdownPosition, true);
            window.removeEventListener('resize', updateDropdownPosition);
        };
    }, [isOpen, externalOpen, onOpenChange, updateDropdownPosition]);

    // 处理值变化
    const handleChange = useCallback(
        (newValue: string) => {
            if (!isControlled) {
                setInternalValue(newValue);
            }
            onChange?.(newValue);
        },
        [isControlled, onChange]
    );

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

    // 处理清除
    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isControlled) {
            setInternalValue(undefined);
        }
        onChange?.('');
    };

    // 处理"此刻"按钮
    const handleNow = () => {
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const second = now.getSeconds();
        const timeStr = formatTime(hour, minute, second, format);
        handleChange(timeStr);
    };

    // 处理"确定"按钮
    const handleOk = () => {
        if (externalOpen === undefined) {
            setInternalOpen(false);
        }
        onOpenChange?.(false);
        setIsFocused(false);
    };


    // 渲染下拉面板
    const renderDropdown = () => {
        if (!isOpen) return null;

        const dropdown = (
            <div
                ref={dropdownRef}
                className="time-picker-dropdown"
                style={{
                    top: dropdownPosition.top,
                    left: dropdownPosition.left,
                    minWidth: typeof width === 'number' ? width : parseInt(width as string, 10),
                }}
            >
                <TimePickerPanel
                    value={value}
                    onChange={handleChange}
                    format={format}
                    hourStep={hourStep}
                    minuteStep={minuteStep}
                    secondStep={secondStep}
                    disabledHours={disabledHours}
                    disabledMinutes={disabledMinutes}
                    disabledSeconds={disabledSeconds}
                    hideDisabledOptions={hideDisabledOptions}
                    showNow={showNow}
                    showOk={showOk}
                    onNow={handleNow}
                    onOk={handleOk}
                />
            </div>
        );

        return ReactDOM.createPortal(dropdown, document.body);
    };

    const containerStyle: React.CSSProperties = {
        width: typeof width === 'number' ? `${width}px` : width,
        ...style,
    };

    const labelStyleComputed: React.CSSProperties = {
        marginRight: typeof labelGap === 'number' ? `${labelGap}px` : labelGap,
        ...labelStyle,
    };

    const triggerContent = (
        <div
            ref={triggerRef}
            className={classNames('time-picker-trigger', {
                focused: isFocused,
                disabled,
                [`size-${size}`]: size,
            })}
            onClick={handleTriggerClick}
        >
            <span
                className={classNames('time-picker-value', {
                    placeholder: !value,
                })}
            >
                {value || placeholder}
            </span>
            <span className="time-picker-suffix">
                {/* 清除按钮：有值、允许清除、非禁用状态且悬停时显示 */}
                {allowClear && value && !disabled && !readOnly && (
                    <span
                        className="time-picker-clear"
                        onClick={handleClear}
                    >
                        <Icon type="close" size="small" />
                    </span>
                )}
                {/* 时间图标：无值或不允许清除时显示，有值且允许清除时悬停隐藏 */}
                <Icon
                    type="clock"
                    size="small"
                    className={classNames('time-picker-icon', { 
                        open: isOpen,
                        'has-clear': allowClear && value && !disabled && !readOnly 
                    })}
                />
            </span>
        </div>
    );

    return (
        <div
            className={classNames('time-picker', className, {
                'time-picker-with-label': label,
            })}
            style={containerStyle}
        >
            {label && (
                <span className={classNames('time-picker-label', labelClassName)} style={labelStyleComputed}>
                    {label}
                </span>
            )}
            {triggerContent}
            {renderDropdown()}
        </div>
    );
};

TimePicker.RangePicker = RangePicker;

export default TimePicker;
export type { TimePickerProps };
export { RangePicker };
