import React from 'react';
import Icon from '../Icon/Icon';
import './Input.css';

export interface TextareaProps {
    placeholder?: string;
    width?: string | number;
    height?: string | number;
    className?: string;
    style?: React.CSSProperties;
    value?: string;
    defaultValue?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    disabled?: boolean;
    readOnly?: boolean;
    rows?: number;
    cols?: number;
    maxLength?: number;
    showCount?: boolean;
    clear?: boolean;
    /** 默认提示信息 */
    extra?: string | React.ReactNode;
    /** 标签文案，显示在输入框前面 */
    label?: string | React.ReactNode;
    /** 标签到输入框的距离 */
    labelGap?: string | number;
    /** 标签的CSS类名 */
    labelClassName?: string;
    /** 标签的样式 */
    labelStyle?: React.CSSProperties;
    /** 是否可调整大小 */
    resizable?: boolean;
    /** 拖拽手柄大小（像素） */
    resizeHandleSize?: number;
    /** 最小宽度 */
    minWidth?: number;
    /** 最大宽度 */
    maxWidth?: number;
    /** 最小高度 */
    minHeight?: number;
    /** 最大高度 */
    maxHeight?: number;
    /** 大小变化回调 */
    onResize?: (size: { width?: number; height?: number }) => void;
}

const Textarea: React.FC<TextareaProps> = ({
    placeholder = '',
    width,
    height,
    className = '',
    style,
    value,
    defaultValue,
    onChange,
    onBlur,
    onFocus,
    onKeyDown,
    disabled = false,
    readOnly = false,
    rows = 4,
    cols,
    maxLength,
    showCount = false,
    clear = false,
    extra,
    label,
    labelGap = 8,
    labelClassName = '',
    labelStyle,
    resizable = false,
    resizeHandleSize = 10,
    minWidth = 200,
    maxWidth = 2000,
    minHeight = 80,
    maxHeight = 800,
    onResize,
}) => {
    const [internalValue, setInternalValue] = React.useState<string>(defaultValue || '');
    const [isFocused, setIsFocused] = React.useState(false);
    const [isResizing, setIsResizing] = React.useState(false);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const resizeStartPos = React.useRef<{ mouseX: number; mouseY: number; width: number; height: number } | null>(null);

    // 转换宽度/高度为数值
    const getWidthValue = (w: string | number | undefined): number => {
        if (w === undefined) return 0;
        if (typeof w === 'number') return w;
        const match = String(w).match(/^(\d+)px$/);
        return match ? parseInt(match[1], 10) : 0;
    };

    const getHeightValue = (h: string | number | undefined): number => {
        if (h === undefined) return 0;
        if (typeof h === 'number') return h;
        const match = String(h).match(/^(\d+)px$/);
        return match ? parseInt(match[1], 10) : 0;
    };

    // 初始尺寸
    const [currentWidth, setCurrentWidth] = React.useState<number>(getWidthValue(width) || 0);
    const [currentHeight, setCurrentHeight] = React.useState<number>(getHeightValue(height) || (rows * 24) || 80);

    // 组件挂载后更新初始尺寸
    React.useEffect(() => {
        if (containerRef.current) {
            const initialWidthValue = getWidthValue(width) || containerRef.current.offsetWidth || 0;
            const initialHeightValue = getHeightValue(height) || (rows * 24) || 80;
            setCurrentWidth(initialWidthValue);
            setCurrentHeight(initialHeightValue);
        }
    }, []);

    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const currentLength = currentValue?.length || 0;

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        if (!isControlled) {
            setInternalValue(newValue);
        }
        onChange?.(e);
    };

    const handleClear = () => {
        if (!disabled && !readOnly) {
            const mockEvent = {
                target: { value: '' }
            } as React.ChangeEvent<HTMLTextAreaElement>;
            if (!isControlled) {
                setInternalValue('');
            }
            onChange?.(mockEvent);
        }
    };

    // 拖拽开始
    const handleResizeStart = (e: React.MouseEvent) => {
        if (!resizable || disabled || readOnly || !containerRef.current) return;
        e.preventDefault();
        e.stopPropagation();
        
        // 记录拖拽开始时的鼠标位置和容器尺寸
        resizeStartPos.current = {
            mouseX: e.clientX,
            mouseY: e.clientY,
            width: containerRef.current.offsetWidth,
            height: containerRef.current.offsetHeight,
        };
        
        setIsResizing(true);
    };

    // 拖拽中
    React.useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing || !resizeStartPos.current) return;

            // 根据鼠标移动的差值计算新的尺寸
            const deltaX = e.clientX - resizeStartPos.current.mouseX;
            const deltaY = e.clientY - resizeStartPos.current.mouseY;

            let newWidth = resizeStartPos.current.width + deltaX;
            let newHeight = resizeStartPos.current.height + deltaY;

            // 限制最小和最大尺寸
            newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
            newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));

            setCurrentWidth(newWidth);
            setCurrentHeight(newHeight);

            // 触发回调
            onResize?.({ width: newWidth, height: newHeight });
        };

        const handleMouseUp = () => {
            resizeStartPos.current = null;
            setIsResizing(false);
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, minWidth, maxWidth, minHeight, maxHeight, onResize]);

    const renderLabel = () => {
        if (!label) return null;
        return (
            <label
                className={`input-label ${labelClassName}`}
                style={{
                    marginRight: typeof labelGap === 'number' ? `${labelGap}px` : labelGap,
                    ...labelStyle,
                }}
            >
                {label}
            </label>
        );
    };

    const wrapperStyle: React.CSSProperties = {
        display: 'inline-flex',
        flexDirection: 'column',
        width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
    };

    const textareaWrapperStyle: React.CSSProperties = {
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-start',
        flex: 1,
        width: resizable ? (typeof currentWidth === 'number' ? `${currentWidth}px` : currentWidth) : undefined,
    };

    const textareaStyle: React.CSSProperties = {
        width: '100%',
        height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
        resize: 'none',
        ...style,
    };

    const showClear = clear && currentValue && !disabled && !readOnly;

    // 合并最终样式
    const finalTextareaStyle = resizable
        ? {
            ...textareaStyle,
            width: '100%',
            height: resizable ? (typeof currentHeight === 'number' ? `${currentHeight}px` : currentHeight) : undefined,
        }
        : textareaStyle;

    return (
        <div className={`textarea-wrapper ${className}`} style={wrapperStyle} ref={containerRef}>
            {(label || showCount || showClear) && (
                <div className="textarea-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    {renderLabel()}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {showClear && (
                            <span
                                className="textarea-clear"
                                onClick={handleClear}
                                style={{ cursor: 'pointer' }}
                            >
                                <Icon type="close-circle" size="small" color="#909399" />
                            </span>
                        )}
                        {showCount && maxLength && (
                            <span className="textarea-count" style={{ fontSize: '12px', color: '#909399' }}>
                                {currentLength}/{maxLength}
                            </span>
                        )}
                    </div>
                </div>
            )}
            <div
                className={`input-wrapper textarea-input-wrapper ${isFocused ? 'focused' : ''} ${disabled ? 'disabled' : ''} ${isResizing ? 'resizing' : ''}`}
                style={textareaWrapperStyle}
            >
                <textarea
                    ref={textareaRef}
                    className="input-base textarea-base"
                    placeholder={placeholder}
                    value={currentValue}
                    defaultValue={isControlled ? undefined : defaultValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    onKeyDown={onKeyDown}
                    disabled={disabled}
                    readOnly={readOnly}
                    rows={rows}
                    cols={cols}
                    maxLength={maxLength}
                    style={finalTextareaStyle}
                />
                {resizable && (
                    <div
                        className="textarea-resize-handle"
                        onMouseDown={handleResizeStart}
                        style={{
                            position: 'absolute',
                            bottom: '0',
                            right: '0',
                            width: `${resizeHandleSize}px`,
                            height: `${resizeHandleSize}px`,
                            cursor: 'nwse-resize',
                            zIndex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <div
                            style={{
                                width: '8px',
                                height: '8px',
                                borderRight: '2px solid #909399',
                                borderBottom: '2px solid #909399',
                            }}
                        />
                    </div>
                )}
            </div>
            {extra && (
                <div className="input-extra" style={{ marginTop: '4px' }}>
                    {extra}
                </div>
            )}
        </div>
    );
};

export default Textarea;
