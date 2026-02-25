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
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isControlled = externalValue !== undefined;
    const value = isControlled ? externalValue : internalValue;
    const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;

    // 计算下拉面板位置
    const updateDropdownPosition = useCallback(() => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        const dropdownWidth = Math.max(rect.width, 200);

        // 检查下方空间是否足够
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        const estimatedDropdownHeight = 280; // 估算下拉面板高度（时间选择面板约 240-280px）

        let top = rect.bottom + window.scrollY + 4;
        let left = rect.left + window.scrollX;

        // 如果下方空间不够，则显示在上方
        if (spaceBelow < estimatedDropdownHeight && rect.top > estimatedDropdownHeight) {
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
            if (spaceBelow < 280 && rect.top > 280) {
                const newTop = rect.top + window.scrollY - actualHeight - 4;
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
    const handleOk = (panelValue?: string) => {
        // 如果传入了面板当前值且外部值为空，则使用该值
        if (panelValue && !value) {
            handleChange(panelValue);
        }
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
                    position: 'fixed',
                    top: dropdownPosition.top,
                    left: dropdownPosition.left,
                    minWidth: dropdownPosition.width || (typeof width === 'number' ? width : parseInt(width as string, 10)),
                    zIndex: 999,
                    opacity: dropdownVisible ? 1 : 0,
                    transition: 'opacity 0.15s ease',
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
                    onOk={(panelValue) => handleOk(panelValue)}
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
