import React, { createContext, useContext, useState, useEffect } from 'react';
import classNames from 'classnames';
import { CheckboxProps, CheckboxGroupProps } from './types';
import './Checkbox.css';

interface CheckboxGroupContextType {
    value?: any[];
    onChange?: (checkedValues: any[]) => void;
    disabled?: boolean;
}

const CheckboxGroupContext = createContext<CheckboxGroupContextType | undefined>(undefined);

const Checkbox: React.FC<CheckboxProps> & { Group: React.FC<CheckboxGroupProps> } = ({
    value,
    checked,
    defaultChecked = false,
    onChange,
    disabled = false,
    indeterminate = false,
    children,
    className,
    style,
    label,
    labelGap = 8,
    labelClassName = '',
    labelStyle
}) => {
    const groupContext = useContext(CheckboxGroupContext);
    const isGroupMode = !!groupContext;
    
    const [internalChecked, setInternalChecked] = useState(defaultChecked);
    
    const isChecked = isGroupMode 
        ? groupContext.value?.includes(value)
        : checked !== undefined ? checked : internalChecked;
    
    useEffect(() => {
        if (!isGroupMode && checked !== undefined) {
            setInternalChecked(checked);
        }
    }, [checked, isGroupMode]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newChecked = e.target.checked;
        
        if (disabled || (isGroupMode && groupContext.disabled)) {
            return;
        }
        
        if (isGroupMode) {
            const currentValue = groupContext.value || [];
            let newValue: any[];
            
            if (newChecked) {
                newValue = [...currentValue, value];
            } else {
                newValue = currentValue.filter(item => item !== value);
            }
            
            groupContext.onChange?.(newValue);
        } else {
            setInternalChecked(newChecked);
            onChange?.(newChecked, value);
        }
    };
    
    const isDisabled = disabled || (isGroupMode && groupContext.disabled);
    const classes = classNames(
        'idp-checkbox',
        {
            'idp-checkbox--checked': isChecked,
            'idp-checkbox--disabled': isDisabled,
            'idp-checkbox--indeterminate': indeterminate,
            'idp-checkbox--disabled-checked': isDisabled && isChecked,
            'idp-checkbox--disabled-indeterminate': isDisabled && indeterminate
        },
        className
    );
    
    return (
        <label className={classes} style={style}>
            <div className="idp-checkbox-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
                {label && (
                    <div
                        className={`idp-checkbox-label ${labelClassName}`}
                        style={{
                            marginRight: typeof labelGap === 'number' ? `${labelGap}px` : labelGap,
                            ...labelStyle
                        }}
                    >
                        {label}
                    </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input
                        type="checkbox"
                        className="idp-checkbox__input"
                        checked={isChecked}
                        onChange={handleChange}
                        disabled={disabled || (isGroupMode && groupContext.disabled)}
                        value={value}
                        ref={(input) => {
                            if (input) {
                                input.indeterminate = indeterminate;
                            }
                        }}
                    />
                    <span className="idp-checkbox__inner"></span>
                    {children && <span className="idp-checkbox__label">{children}</span>}
                </div>
            </div>
        </label>
    );
};

Checkbox.Group = ({
    value,
    defaultValue = [],
    onChange,
    disabled = false,
    options,
    children,
    className,
    style,
    layout = 'vertical',
    gap = 8
}) => {
    const [internalValue, setInternalValue] = useState<any[]>(defaultValue || []);
    
    useEffect(() => {
        if (value !== undefined) {
            setInternalValue(value);
        }
    }, [value]);
    
    const handleGroupChange = (newValue: any[]) => {
        setInternalValue(newValue);
        onChange?.(newValue);
    };
    
    const classes = classNames(
        'idp-checkbox-group',
        {
            'idp-checkbox-group--horizontal': layout === 'horizontal',
        },
        className
    );
    
    const groupStyle: React.CSSProperties = {
        ...style,
        gap: typeof gap === 'number' ? `${gap}px` : gap
    };
    
    return (
        <CheckboxGroupContext.Provider value={{
            value: value !== undefined ? value : internalValue,
            onChange: handleGroupChange,
            disabled
        }}>
            <div className={classes} style={groupStyle}>
                {options ? (
                    options.map((option, index) => (
                        <Checkbox
                            key={option.value ?? index}
                            value={option.value}
                            disabled={option.disabled || disabled}
                        >
                            {option.label}
                        </Checkbox>
                    ))
                ) : (
                    children
                )}
            </div>
        </CheckboxGroupContext.Provider>
    );
};

Checkbox.displayName = 'Checkbox';
Checkbox.Group.displayName = 'Checkbox.Group';

export default Checkbox;
export * from './types';
