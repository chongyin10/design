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
}) => {
    const [internalValue, setInternalValue] = React.useState<string>(defaultValue || '');
    const [isFocused, setIsFocused] = React.useState(false);

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
    };

    const textareaStyle: React.CSSProperties = {
        width: '100%',
        height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
        resize: 'none',
        ...style,
    };

    const showClear = clear && currentValue && !disabled && !readOnly;

    return (
        <div className={`textarea-wrapper ${className}`} style={wrapperStyle}>
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
                className={`input-wrapper textarea-input-wrapper ${isFocused ? 'focused' : ''} ${disabled ? 'disabled' : ''}`}
                style={textareaWrapperStyle}
            >
                <textarea
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
                    style={textareaStyle}
                />
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
