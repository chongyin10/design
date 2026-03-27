import React from 'react';
import './Input.css';

import Icon from '../Icon/Icon';

export interface InputProps {
    type?: 'text' | 'password';
    placeholder?: string;
    width?: string | number;
    className?: string;
    style?: React.CSSProperties;
    value?: string;
    defaultValue?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    readOnly?: boolean;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    prefix?: string | React.ReactNode;
    suffix?: string | React.ReactNode;
    clear?: boolean;
    /** 默认提示信息，与错误信息互斥 */
    extra?: string | React.ReactNode;
    /** 标签文案，显示在输入框前面 */
    label?: string | React.ReactNode;
    /** 标签到输入框的距离 */
    labelGap?: string | number;
    /** 标签的CSS类名 */
    labelClassName?: string;
    /** 标签的样式 */
    labelStyle?: React.CSSProperties;
    /** 错误状态（由 Form 组件传入，InputBase 内部不使用，需剔除避免传递给 input） */
    error?: boolean;
    /** 自动完成属性 */
    autoComplete?: string;
    /** 尺寸大小 */
    size?: 'large' | 'middle' | 'small';
}

const InputBase: React.FC<InputProps> = ({
    type = 'text',
    placeholder = '',
    width,
    className = '',
    style,
    value,
    defaultValue,
    onChange,
    onBlur,
    onFocus,
    disabled = false,
    readOnly = false,
    onKeyDown,
    prefix,
    suffix,
    clear = false,
    extra,
    label,
    labelGap = 8,
    labelClassName = '',
    labelStyle,
    error, // 从 Form 组件传入的错误状态，不传递给 input
    autoComplete,
    size = 'middle',
    ...rest
}) => {
    const [internalValue, setInternalValue] = React.useState<string>(defaultValue || '');
    const [isFocused, setIsFocused] = React.useState(false);

    const renderIcon = (icon: string | React.ReactNode) => {
        if (!icon) return null;

        if (typeof icon === 'string') {
            return <Icon type={icon} size="medium" color="#909399" />;
        }

        return icon;
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (value === undefined) {
            // 非受控模式，更新内部状态
            setInternalValue(e.target.value);
        }
        onChange?.(e);
    };

    const handleClear = () => {
        if (!disabled && !readOnly) {
            if (value !== undefined) {
                // 受控模式
                if (onChange) {
                    const mockEvent = {
                        target: { value: '' }
                    } as React.ChangeEvent<HTMLInputElement>;
                    onChange(mockEvent);
                }
            } else {
                // 非受控模式
                setInternalValue('');
                if (onChange) {
                    const mockEvent = {
                        target: { value: '' }
                    } as React.ChangeEvent<HTMLInputElement>;
                    onChange(mockEvent);
                }
            }
        }
    };

    // 确定实际使用的值
    const actualValue = value !== undefined ? value : internalValue;

    // 确定是否显示清除按钮
    const showClearButton = clear &&
                          !disabled &&
                          !readOnly &&
                          isFocused &&
                          actualValue !== undefined &&
                          actualValue !== null &&
                          actualValue.toString().length > 0;

    // 是否需要显示后缀区域
    const showSuffixGroup = showClearButton || suffix;

    return (
        <div className="input-base-container">
            <div className="input-label-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
                {label && (
                    <div
                        className={`input-label ${labelClassName}`}
                        style={{
                            marginRight: typeof labelGap === 'number' ? `${labelGap}px` : labelGap,
                            ...labelStyle
                        }}
                    >
                        {label}
                    </div>
                )}
                <div
                    className={`input-wrapper input-wrapper-${size} ${className} ${disabled ? 'input-wrapper-disabled' : ''} ${readOnly ? 'input-wrapper-readonly' : ''}`}
                    style={{
                        width,
                        ...style
                    }}
                >
                {prefix && <div className="input-prefix">{renderIcon(prefix)}</div>}
                <input
                    type={type}
                    placeholder={placeholder}
                    className="input-inner"
                    value={value != null ? String(value) : actualValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    disabled={disabled}
                    readOnly={readOnly}
                    onKeyDown={onKeyDown}
                    autoComplete={autoComplete ?? (type === 'password' ? 'current-password' : undefined)}
                    {...rest}
                />
                {showSuffixGroup && (
                    <div className="input-suffix-group">
                        {clear && (
                            <div
                                className={`input-suffix-clear ${showClearButton ? 'visible' : ''}`}
                                onClick={handleClear}
                            >
                                <Icon type="close" size="medium" color="#1890ff" />
                            </div>
                        )}
                        {suffix && <div className="input-suffix-content">{renderIcon(suffix)}</div>}
                    </div>
                )}
                </div>
            </div>
            {extra && (
                <div className="input-extra">
                    {extra}
                </div>
            )}
        </div>
    );
};

export default InputBase;
