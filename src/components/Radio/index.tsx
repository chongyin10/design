import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import classNames from 'classnames';
import { RadioProps, RadioGroupProps } from './types';
import './Radio.css';

// RadioGroup的Context类型
interface RadioGroupContextType {
    value?: any;
    onChange?: (value: any) => void;
    disabled?: boolean;
    type?: 'button' | 'radio';
    size?: 'large' | 'middle' | 'small';
    registerRadio?: (value: any, element: HTMLElement | null) => void;
    unregisterRadio?: (value: any) => void;
    updateIndicator?: () => void;
}

const RadioGroupContext = createContext<RadioGroupContextType | undefined>(undefined);

// Radio组件
const Radio: React.FC<RadioProps> & { Group: React.FC<RadioGroupProps> } = ({
    value,
    checked,
    defaultChecked = false,
    onChange,
    disabled = false,
    size,
    children,
    className,
    style,
    label,
    labelGap = 8,
    labelClassName = '',
    labelStyle
}) => {
    // 使用Context获取Group的状态
    const groupContext = useContext(RadioGroupContext);
    const isGroupMode = !!groupContext;
    const radioRef = useRef<HTMLLabelElement>(null);

    // 非Group模式下的内部状态管理
    const [internalChecked, setInternalChecked] = useState(defaultChecked);

    // Group模式下的checked状态由Group控制
    const isChecked = isGroupMode
        ? groupContext.value === value
        : checked !== undefined ? checked : internalChecked;

    // 确定最终的size，优先使用组件自身的size，否则使用Group的size
    const finalSize = size || (isGroupMode ? groupContext.size : undefined);

    // 确定最终的type，仅Group模式下有效
    const groupType = isGroupMode ? groupContext.type : undefined;
    const isButtonType = groupType === 'button';

    // 注册Radio到Group
    useEffect(() => {
        if (isGroupMode && groupContext.registerRadio) {
            groupContext.registerRadio(value, radioRef.current);
            return () => {
                groupContext.unregisterRadio?.(value);
            };
        }
    }, [isGroupMode, value, groupContext]);

    // 当选中状态变化时更新指示器位置
    useEffect(() => {
        if (isChecked && isGroupMode && groupContext.updateIndicator) {
            // 使用 requestAnimationFrame 确保 DOM 已更新
            requestAnimationFrame(() => {
                groupContext.updateIndicator?.();
            });
        }
    }, [isChecked, isGroupMode]);

    // 当外部checked变化时更新内部状态（非Group模式）
    useEffect(() => {
        if (!isGroupMode && checked !== undefined) {
            setInternalChecked(checked);
        }
    }, [checked, isGroupMode]);

    // 处理Radio点击事件
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newChecked = e.target.checked;

        if (disabled || (isGroupMode && groupContext.disabled)) {
            return;
        }

        if (isGroupMode) {
            // Group模式下通知Group更新value
            groupContext.onChange?.(value);
        } else {
            // 非Group模式下更新内部状态
            setInternalChecked(newChecked);
            onChange?.(newChecked, value);
        }
    };

    const classes = classNames(
        'idp-radio',
        {
            'idp-radio--checked': isChecked,
            'idp-radio--unchecked': !isChecked,
            'idp-radio--disabled': disabled || (isGroupMode && groupContext.disabled),
            'idp-radio--disabled-checked': isChecked && (disabled || (isGroupMode && groupContext.disabled)),
            [`idp-radio--${finalSize}`]: finalSize,
            'idp-radio--button': isButtonType
        },
        className
    );

    return (
        <label ref={radioRef} className={classes} style={style}>
            <div className="idp-radio-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
                {label && (
                    <div
                        className={`idp-radio-label ${labelClassName}`}
                        style={{
                            marginRight: typeof labelGap === 'number' ? `${labelGap}px` : labelGap,
                            ...labelStyle
                        }}
                    >
                        {label}
                    </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <input
                        type="radio"
                        className="idp-radio__input"
                        checked={isChecked}
                        onChange={handleChange}
                        disabled={disabled || (isGroupMode && groupContext.disabled)}
                        value={value}
                    />
                    {/* 按钮类型时隐藏span元素 */}
                    {!isButtonType && <span className="idp-radio__inner"></span>}
                    {children && <span className="idp-radio__label">{children}</span>}
                </div>
            </div>
        </label>
    );
};

// Radio.Group组件
Radio.Group = ({
    value,
    defaultValue,
    onChange,
    disabled = false,
    type = 'radio',
    size = 'middle',
    children,
    className,
    style
}) => {
    // Group组件的状态管理
    const [internalValue, setInternalValue] = useState(defaultValue);
    const groupRef = useRef<HTMLDivElement>(null);
    const radioElementsRef = useRef<Map<any, HTMLElement>>(new Map());
    const [indicatorStyle, setIndicatorStyle] = useState({
        width: 0,
        height: 0,
        transform: 'translateX(0px)'
    });

    const currentValue = value !== undefined ? value : internalValue;

    // 注册Radio元素
    const registerRadio = useCallback((radioValue: any, element: HTMLElement | null) => {
        if (element) {
            radioElementsRef.current.set(radioValue, element);
        }
    }, []);

    // 注销Radio元素
    const unregisterRadio = useCallback((radioValue: any) => {
        radioElementsRef.current.delete(radioValue);
    }, []);

    // 更新指示器位置
    const updateIndicator = useCallback(() => {
        if (type !== 'button' || !groupRef.current) return;

        const selectedElement = radioElementsRef.current.get(currentValue);
        if (!selectedElement) return;

        const groupRect = groupRef.current.getBoundingClientRect();
        const selectedRect = selectedElement.getBoundingClientRect();

        // 计算相对于Group的位置
        const left = selectedRect.left - groupRect.left;

        setIndicatorStyle({
            width: selectedRect.width,
            height: selectedRect.height,
            transform: `translateX(${left}px)`
        });
    }, [currentValue, type]);

    // 初始化和更新指示器位置
    useEffect(() => {
        if (type === 'button') {
            // 使用 requestAnimationFrame 确保 DOM 已渲染
            const timer = requestAnimationFrame(() => {
                updateIndicator();
            });
            return () => cancelAnimationFrame(timer);
        }
    }, [type, updateIndicator]);

    // 窗口大小变化时更新指示器位置
    useEffect(() => {
        if (type !== 'button') return;

        const handleResize = () => {
            updateIndicator();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [type, updateIndicator]);

    // 当外部value变化时更新内部状态
    useEffect(() => {
        if (value !== undefined) {
            setInternalValue(value);
        }
    }, [value]);

    // 处理Group内部Radio的变化
    const handleGroupChange = (newValue: any) => {
        setInternalValue(newValue);
        onChange?.(newValue);
    };

    const classes = classNames(
        'idp-radio-group',
        {
            'idp-radio-group--button': type === 'button',
            [`idp-radio-group--${size}`]: size,
            'idp-radio-group--button-large': type === 'button' && size === 'large',
            'idp-radio-group--button-middle': type === 'button' && size === 'middle',
            'idp-radio-group--button-small': type === 'button' && size === 'small'
        },
        className
    );

    // 提供Context给子Radio组件
    return (
        <RadioGroupContext.Provider value={{
            value: currentValue,
            onChange: handleGroupChange,
            disabled,
            type,
            size,
            registerRadio,
            unregisterRadio,
            updateIndicator
        }}>
            <div ref={groupRef} className={classes} style={style}>
                {type === 'button' && (
                    <div
                        className="idp-radio-group__indicator"
                        style={{
                            width: indicatorStyle.width,
                            height: indicatorStyle.height,
                            transform: indicatorStyle.transform
                        }}
                    />
                )}
                {children}
            </div>
        </RadioGroupContext.Provider>
    );
};

// 设置组件名称，方便调试
Radio.displayName = 'Radio';
Radio.Group.displayName = 'Radio.Group';

export default Radio;
export * from './types';
