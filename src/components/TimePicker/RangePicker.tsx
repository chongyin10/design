'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import Icon from '../Icon';
import { TimeRangePickerProps } from './types';
import TimePickerPanel from './TimePickerPanel';

const RangePicker: React.FC<TimeRangePickerProps> = ({
    size = 'middle',
    value: externalValue,
    defaultValue,
    onChange,
    placeholder = ['开始时间', '结束时间'],
    disabled = false,
    readOnly = false,
    className = '',
    style,
    width = 'auto',
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
    separator,
}) => {
    const [internalValue, setInternalValue] = useState<[string, string] | undefined>(defaultValue);
    const [internalOpen, setInternalOpen] = useState(false);
    const [activePicker, setActivePicker] = useState<'start' | 'end'>('start');
    const [isFocused, setIsFocused] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isControlled = externalValue !== undefined;
    const value = isControlled ? externalValue : internalValue;
    const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;

    const startValue = value?.[0] || '';
    const endValue = value?.[1] || '';

    // 计算下拉面板位置
    const updateDropdownPosition = useCallback(() => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        const dropdownWidth = Math.max(rect.width, 200);

        // 检查下方空间是否足够
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        const estimatedDropdownHeight = 280; // 估算下拉面板高度

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

    // 渲染下拉面板
    const renderDropdown = () => {
        if (!isOpen) return null;

        const activeValue = activePicker === 'start' ? startValue : endValue;

        const dropdown = (
            <div
                ref={dropdownRef}
                className="time-picker-dropdown time-range-picker-dropdown"
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
                    value={activeValue}
                    onChange={(newValue: string) => handleChange(activePicker === 'start' ? 0 : 1, newValue)}
                    format={format}
                    hourStep={hourStep}
                    minuteStep={minuteStep}
                    secondStep={secondStep}
                    disabledHours={disabledHours}
                    disabledMinutes={disabledMinutes}
                    disabledSeconds={disabledSeconds}
                    hideDisabledOptions={hideDisabledOptions}
                    showNow={false}
                    showOk={true}
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

    const hasValue = startValue || endValue;

    return (
        <div
            className={classNames('time-picker time-range-picker', className, {
                'time-picker-with-label': label,
            })}
            style={containerStyle}
        >
            {label && (
                <span className={classNames('time-picker-label', labelClassName)} style={labelStyleComputed}>
                    {label}
                </span>
            )}
            <div
                ref={triggerRef}
                className={classNames('time-range-picker-trigger', {
                    'is-focused': isFocused,
                    'is-disabled': disabled,
                    [`size-${size}`]: size,
                })}
            >
                {/* 开始时间 */}
                <div
                    className={classNames('time-range-picker-input', {
                        'is-active': activePicker === 'start' && isOpen,
                    })}
                    onClick={() => handleTriggerClick('start')}
                >
                    <span className={classNames('time-range-picker-value', { 'is-placeholder': !startValue })}>
                        {startValue || placeholder[0]}
                    </span>
                </div>

                {/* 分隔符 */}
                <span className="time-range-picker-separator">
                    {separator || <Icon type="arrow-right" size="small" />}
                </span>

                {/* 结束时间 */}
                <div
                    className={classNames('time-range-picker-input', {
                        'is-active': activePicker === 'end' && isOpen,
                    })}
                    onClick={() => handleTriggerClick('end')}
                >
                    <span className={classNames('time-range-picker-value', { 'is-placeholder': !endValue })}>
                        {endValue || placeholder[1]}
                    </span>
                </div>

                {/* 后缀图标区域 */}
                <span className="time-picker-suffix time-range-picker-suffix">
                    {/* 清除按钮 */}
                    {allowClear && hasValue && !disabled && !readOnly && (
                        <span
                            className="time-picker-clear"
                            onClick={handleClear}
                        >
                            <Icon type="close" size="small" />
                        </span>
                    )}
                    {/* 时钟图标 */}
                    <Icon
                        type="clock"
                        size="small"
                        className={classNames('time-picker-icon', {
                            'has-clear': allowClear && hasValue && !disabled && !readOnly
                        })}
                    />
                </span>
            </div>
            {renderDropdown()}
        </div>
    );
};

export default RangePicker;
