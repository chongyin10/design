'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import './ColorPicker.css';

// 颜色工具函数
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

const rgbToHex = (r: number, g: number, b: number): string => {
    const toHex = (n: number) => {
        const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const rgbToHsv = (r: number, g: number, b: number): { h: number; s: number; v: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    let h = 0;
    const s = max === 0 ? 0 : diff / max;
    const v = max;

    if (diff !== 0) {
        switch (max) {
            case r: h = ((g - b) / diff + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / diff + 2) / 6; break;
            case b: h = ((r - g) / diff + 4) / 6; break;
        }
    }

    return { h: h * 360, s, v };
};

const hsvToRgb = (h: number, s: number, v: number): { r: number; g: number; b: number } => {
    h = (h % 360) / 360;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    let r = 0, g = 0, b = 0;
    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
};

const getAlphaFromHex = (hex: string): number => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
    return result && result[4] ? parseInt(result[4], 16) / 255 : 1;
};

const applyAlpha = (hex: string, alpha: number): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const a = Math.round(Math.max(0, Math.min(1, alpha)) * 255);
    return `#${rgbToHex(rgb.r, rgb.g, rgb.b).slice(1)}${a.toString(16).padStart(2, '0')}`;
};

interface ColorPickerPanelProps {
    color: string;
    onChange: (color: { hex: string; rgb: { r: number; g: number; b: number }; hsv: { h: number; s: number; v: number } }) => void;
    disableAlpha?: boolean;
}

const ColorPickerPanel: React.FC<ColorPickerPanelProps> = ({ color, onChange, disableAlpha = false }) => {
    // 解析初始颜色
    const parseColor = useCallback(() => {
        const hex = color.startsWith('#') ? color : '#ffffff';
        const rgb = hexToRgb(hex) || { r: 255, g: 255, b: 255 };
        const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
        const alpha = getAlphaFromHex(hex);
        return { hex, rgb, hsv, alpha };
    }, [color]);

    const [hsv, setHsv] = useState(parseColor().hsv);
    const [alpha, setAlpha] = useState(parseColor().alpha);
    const [inputValue, setInputValue] = useState(parseColor().hex);

    // 饱和度/亮度选择区域
    const saturationRef = useRef<HTMLDivElement>(null);
    const [isDraggingSaturation, setIsDraggingSaturation] = useState(false);

    // 色相滑块
    const hueRef = useRef<HTMLDivElement>(null);
    const [isDraggingHue, setIsDraggingHue] = useState(false);

    // 透明度滑块
    const alphaRef = useRef<HTMLDivElement>(null);
    const [isDraggingAlpha, setIsDraggingAlpha] = useState(false);

    // 当外部颜色变化时更新内部状态
    useEffect(() => {
        const parsed = parseColor();
        setHsv(parsed.hsv);
        setAlpha(parsed.alpha);
        setInputValue(parsed.hex);
    }, [color, parseColor]);

    // 颜色变化时触发 onChange
    useEffect(() => {
        const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
        let hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        if (!disableAlpha && alpha < 1) {
            hex = applyAlpha(hex, alpha);
        }
        setInputValue(hex);
        onChange({ hex, rgb, hsv });
    }, [hsv, alpha, disableAlpha, onChange]);

    // 处理饱和度/亮度选择
    const handleSaturationChange = useCallback((e: React.MouseEvent | MouseEvent, element: HTMLDivElement) => {
        const rect = element.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
        setHsv(prev => ({ ...prev, s: x, v: 1 - y }));
    }, []);

    // 处理色相选择
    const handleHueChange = useCallback((e: React.MouseEvent | MouseEvent, element: HTMLDivElement) => {
        const rect = element.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        setHsv(prev => ({ ...prev, h: x * 360 }));
    }, []);

    // 处理透明度选择
    const handleAlphaChange = useCallback((e: React.MouseEvent | MouseEvent, element: HTMLDivElement) => {
        const rect = element.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        setAlpha(x);
    }, []);

    // 鼠标事件处理
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDraggingSaturation && saturationRef.current) {
                handleSaturationChange(e, saturationRef.current);
            } else if (isDraggingHue && hueRef.current) {
                handleHueChange(e, hueRef.current);
            } else if (isDraggingAlpha && alphaRef.current) {
                handleAlphaChange(e, alphaRef.current);
            }
        };

        const handleMouseUp = () => {
            setIsDraggingSaturation(false);
            setIsDraggingHue(false);
            setIsDraggingAlpha(false);
        };

        if (isDraggingSaturation || isDraggingHue || isDraggingAlpha) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDraggingSaturation, isDraggingHue, isDraggingAlpha, handleSaturationChange, handleHueChange, handleAlphaChange]);

    // 计算当前颜色的 RGB
    const currentRgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
    const currentHex = rgbToHex(currentRgb.r, currentRgb.g, currentRgb.b);
    const pureHueColor = hsvToRgb(hsv.h, 1, 1);
    const pureHueHex = rgbToHex(pureHueColor.r, pureHueColor.g, pureHueColor.b);

    // 处理输入框变化
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        if (/^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(value)) {
            const rgb = hexToRgb(value);
            if (rgb) {
                const newHsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
                setHsv(newHsv);
                if (!disableAlpha) {
                    setAlpha(getAlphaFromHex(value));
                }
            }
        }
    };

    return (
        <div className="zjpcy-color-picker-panel">
            {/* 饱和度/亮度选择区域 */}
            <div
                ref={saturationRef}
                className="zjpcy-color-picker-saturation"
                style={{ backgroundColor: pureHueHex }}
                onMouseDown={(e) => {
                    setIsDraggingSaturation(true);
                    handleSaturationChange(e, e.currentTarget);
                }}
            >
                <div className="zjpcy-color-picker-saturation-white" />
                <div className="zjpcy-color-picker-saturation-black" />
                <div
                    className="zjpcy-color-picker-pointer"
                    style={{
                        left: `${hsv.s * 100}%`,
                        top: `${(1 - hsv.v) * 100}%`,
                        backgroundColor: currentHex
                    }}
                />
            </div>

            {/* 色相滑块 */}
            <div
                ref={hueRef}
                className="zjpcy-color-picker-hue"
                onMouseDown={(e) => {
                    setIsDraggingHue(true);
                    handleHueChange(e, e.currentTarget);
                }}
            >
                <div
                    className="zjpcy-color-picker-hue-slider"
                    style={{ left: `${(hsv.h / 360) * 100}%` }}
                />
            </div>

            {/* 透明度滑块 */}
            {!disableAlpha && (
                <div
                    ref={alphaRef}
                    className="zjpcy-color-picker-alpha"
                    onMouseDown={(e) => {
                        setIsDraggingAlpha(true);
                        handleAlphaChange(e, e.currentTarget);
                    }}
                >
                    <div className="zjpcy-color-picker-alpha-bg" />
                    <div
                        className="zjpcy-color-picker-alpha-gradient"
                        style={{
                            background: `linear-gradient(to right, transparent, ${currentHex})`
                        }}
                    />
                    <div
                        className="zjpcy-color-picker-alpha-slider"
                        style={{ left: `${alpha * 100}%` }}
                    />
                </div>
            )}

            {/* 颜色值输入 */}
            <div className="zjpcy-color-picker-values">
                <div className="zjpcy-color-picker-preview-small">
                    <div
                        className="zjpcy-color-picker-preview-color"
                        style={{
                            backgroundColor: disableAlpha ? currentHex : `rgba(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b}, ${alpha})`
                        }}
                    />
                    <div className="zjpcy-color-picker-alpha-bg" />
                </div>
                <input
                    type="text"
                    className="zjpcy-color-picker-hex-input"
                    value={inputValue.toUpperCase()}
                    onChange={handleInputChange}
                />
            </div>
        </div>
    );
};

export default ColorPickerPanel;
