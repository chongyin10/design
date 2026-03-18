'use client';

import React, { useState } from 'react';
import { SwitchProps } from './types';
import './Switch.css';
import {
    getWrapperClassName,
    getWrapperStyle,
    getLabelWrapperClassName,
    getLabelWrapperStyle,
    getLabelClassName,
    getLabelStyle,
    getTrackClassName,
    getTrackStyle,
    getThumbClassName,
    getThumbStyle,
    getLoadingIconClassName,
    getLoadingIconStyle,
    getCheckedInnerClassName,
    getCheckedInnerStyle,
    getUncheckedInnerClassName,
    getUncheckedInnerStyle,
} from './styles';

/**
 * Switch 开关组件
 * 用于在两种状态之间进行切换
 *
 * @example
 * ```tsx
 * <Switch defaultChecked={false} onChange={(checked) => console.log(checked)} />
 * <Switch checked={checked} onChange={setChecked} />
 * <Switch checkedChildren="开启" unCheckedChildren="关闭" />
 * ```
 */
const Switch: React.FC<SwitchProps> = ({
    checked: checkedProp,
    defaultChecked = false,
    disabled = false,
    loading = false,
    size = 'default',
    width,
    checkedChildren,
    unCheckedChildren,
    styles,
    onChange,
    label,
    labelGap = 8,
    labelClassName = '',
    labelStyle,
    className,
    style,
}) => {
    // 判断是否为受控模式
    const isControlled = checkedProp !== undefined;
    const [internalChecked, setInternalChecked] = useState(defaultChecked);

    // 在受控模式下使用外部状态，非受控模式下使用内部状态
    const checked = isControlled ? checkedProp : internalChecked;

    // 判断是否有自定义内容
    const hasChildren = checkedChildren !== undefined || unCheckedChildren !== undefined;

    const handleClick = () => {
        if (disabled || loading) return;

        const newChecked = !checked;

        // 非受控模式下更新内部状态
        if (!isControlled) {
            setInternalChecked(newChecked);
        }

        onChange?.(newChecked);
    };

    return (
        <div
            className={getWrapperClassName({ className })}
            style={getWrapperStyle({ style, customStyles: styles?.wrapper })}
        >
            <div
                className={getLabelWrapperClassName({})}
                style={getLabelWrapperStyle({})}
            >
                {label && (
                    <div
                        className={getLabelClassName({ labelClassName })}
                        style={getLabelStyle({ labelGap, labelStyle })}
                    >
                        {label}
                    </div>
                )}
                <div
                    className={getTrackClassName({
                        checked,
                        disabled,
                        loading,
                    })}
                    style={getTrackStyle({
                        size,
                        width,
                        hasChildren,
                        disabled,
                        customStyles: styles?.track,
                    })}
                    onClick={handleClick}
                    data-size={size}
                >
                    {loading && (
                        <div
                            className={getLoadingIconClassName({})}
                            style={getLoadingIconStyle({
                                size,
                                checked,
                                width,
                                customStyles: styles?.loading,
                            })}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                width="12"
                                height="12"
                                fill="#1890ff"
                            >
                                <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
                            </svg>
                        </div>
                    )}
                    {!loading && checked && checkedChildren && (
                        <span
                            className={getCheckedInnerClassName({})}
                            style={getCheckedInnerStyle({
                                size,
                                customStyles: styles?.inner,
                            })}
                        >
                            {checkedChildren}
                        </span>
                    )}
                    {!loading && !checked && unCheckedChildren && (
                        <span
                            className={getUncheckedInnerClassName({})}
                            style={getUncheckedInnerStyle({
                                size,
                                customStyles: styles?.inner,
                            })}
                        >
                            {unCheckedChildren}
                        </span>
                    )}
                    <div
                        className={getThumbClassName({
                            checked,
                            loading,
                        })}
                        style={getThumbStyle({
                            size,
                            checked,
                            width,
                            customStyles: styles?.thumb,
                        })}
                    />
                </div>
            </div>
        </div>
    );
};

export default Switch;

export type { SwitchProps };
