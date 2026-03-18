'use client';

import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import ColorPickerPanel from './ColorPickerPanel';
import { ColorPickerProps } from './types';
import './ColorPicker.css';
import Button from '../Button';

const ColorPickerComponent: React.FC<ColorPickerProps> = ({
    color,
    onChange,
    onColorChange,
    disabled = false,
    className,
    style,
    alpha = false,
    presetColors = [],
    gradient = false,
    children
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [tempColor, setTempColor] = useState(color);
    const [gradientColors, setGradientColors] = useState([color, '#ffffff']);
    const [gradientDirection, setGradientDirection] = useState(90);
    const contentRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    // 构建类名
    const classes = classNames(
        'zjpcy-color-picker',
        {
            'zjpcy-color-picker--disabled': disabled,
            'zjpcy-color-picker--open': isOpen
        },
        className
    );

    // 处理颜色变化
    const handleColorChange = (colorObject: { hex: string }, index?: number) => {
        if (gradient && index !== undefined) {
            // 更新渐变色中的某个颜色
            const newGradientColors = [...gradientColors];
            newGradientColors[index] = colorObject.hex;
            setGradientColors(newGradientColors);
            updateGradient(newGradientColors, gradientDirection);
        } else {
            // 更新纯色
            setTempColor(colorObject.hex);
            onColorChange?.(colorObject.hex);
        }
    };

    // 更新渐变色字符串
    const updateGradient = (colors: string[] = gradientColors, direction: number = gradientDirection) => {
        const gradientValue = `linear-gradient(${direction}deg, ${colors[0]}, ${colors[1]})`;
        setTempColor(gradientValue);
        onColorChange?.(gradientValue);
    };

    // 确认选择颜色
    const confirmColor = () => {
        onChange(tempColor);
        setIsOpen(false);
    };

    // 取消选择，恢复初始颜色
    const cancelColor = () => {
        setTempColor(color);
        if (gradient) {
            setGradientColors([color, '#ffffff']);
            setGradientDirection(90);
        }
        setIsOpen(false);
    };

    // 切换颜色选择器显示状态
    const togglePicker = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    // 点击外部关闭颜色选择器
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const isClickOnContent = contentRef.current && contentRef.current.contains(event.target as Node);
            const isClickOnTrigger = triggerRef.current && triggerRef.current.contains(event.target as Node);

            if (!isClickOnContent && !isClickOnTrigger) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen]);

    // 初始化渐变色状态
    useEffect(() => {
        if (gradient && color && color.startsWith('linear-gradient')) {
            // 简单解析渐变色字符串
            const match = color.match(/linear-gradient\((\d+)deg,\s*(#[0-9a-fA-F]+),\s*(#[0-9a-fA-F]+)\)/);
            if (match) {
                setGradientDirection(parseInt(match[1]));
                setGradientColors([match[2], match[3]]);
            }
        }
    }, [color, gradient]);

    return (
        <div className={classes} style={style}>
            {children ? (
                <div ref={triggerRef} className="zjpcy-color-picker-trigger-container" onClick={togglePicker}>
                    {children}
                </div>
            ) : (
                <div ref={triggerRef} className="zjpcy-color-picker-default-trigger" style={{ background: color }} onClick={togglePicker} />
            )}
            {isOpen && (
                <div className="zjpcy-color-picker-popup">
                    <div className="zjpcy-color-picker-content" ref={contentRef}>

                        {/* 颜色选择器 */}
                        {gradient ? (
                            <>
                                <div className="zjpcy-color-picker-gradient">
                                    <div className="zjpcy-color-picker-gradient-item">
                                        <div className="zjpcy-color-picker-gradient-label">起始颜色</div>
                                        <ColorPickerPanel
                                            color={gradientColors[0]}
                                            onChange={(colorObject) => {
                                                handleColorChange({ hex: colorObject.hex }, 0);
                                            }}
                                            disableAlpha={!alpha}
                                        />
                                    </div>
                                    <div className="zjpcy-color-picker-gradient-item">
                                        <div className="zjpcy-color-picker-gradient-label">结束颜色</div>
                                        <ColorPickerPanel
                                            color={gradientColors[1]}
                                            onChange={(colorObject) => {
                                                handleColorChange({ hex: colorObject.hex }, 1);
                                            }}
                                            disableAlpha={!alpha}
                                        />
                                    </div>
                                </div>

                                {/* 渐变方向调整 */}
                                <div className="zjpcy-color-picker-gradient-direction">
                                    <div className="zjpcy-color-picker-gradient-direction-label">渐变方向: {gradientDirection}°</div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="360"
                                        value={gradientDirection}
                                        onChange={(e) => {
                                            const newDirection = parseInt(e.target.value);
                                            setGradientDirection(newDirection);
                                            updateGradient(gradientColors, newDirection);
                                        }}
                                        className="zjpcy-color-picker-gradient-range"
                                    />
                                </div>
                            </>
                        ) : (
                            /* 纯色选择器 */
                            <ColorPickerPanel
                                color={tempColor}
                                onChange={(colorObject) => {
                                    handleColorChange({ hex: colorObject.hex });
                                }}
                                disableAlpha={!alpha}
                            />
                        )}

                        {/* 预设颜色 */}
                        {presetColors.length > 0 && (
                            <div>
                                <div className="zjpcy-color-picker-presets-label">预设颜色</div>
                                <div className="zjpcy-color-picker-presets">
                                    {presetColors.map((preset, index) => (
                                        <div
                                            key={index}
                                            className="zjpcy-color-picker-preset"
                                            style={{ backgroundColor: preset }}
                                            onClick={() => handleColorChange({ hex: preset })}
                                            title={preset}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 操作按钮 */}
                        <div className="zjpcy-color-picker-actions">
                            {/* 颜色预览 */}
                            <div className="zjpcy-color-picker-preview-label">参考值：</div>
                            <div
                                className={`zjpcy-color-picker-preview ${gradient ? 'zjpcy-color-picker-gradient-preview' : 'zjpcy-color-picker-solid-preview'}`}
                                style={{ background: tempColor }}
                            />
                            <div className="zjpcy-color-picker-button-group">
                                <Button
                                    size="small"
                                    onClick={cancelColor}
                                >
                                    取消
                                </Button>
                                <Button
                                    variant="primary"
                                    size="small"
                                    onClick={confirmColor}
                                >
                                    确认
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* 点击外部关闭 */}
                    <div
                        className="zjpcy-color-picker-overlay"
                        onClick={() => setIsOpen(false)}
                    />
                </div>
            )}
        </div>
    );
};

export default ColorPickerComponent;
