import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import classNames from 'classnames';
import { SelectProps, SelectOptionProps, SelectOptGroupProps } from './types';
import Icon from '../Icon';
import Empty from '../Empty';
import './Select.css';

interface SelectContextType {
    value: any;
    onOptionSelect: (value: any, label?: ReactNode) => void;
    disabled: boolean;
}

const SelectContext = createContext<SelectContextType | undefined>(undefined);

// 主Select组件
const Select: React.FC<SelectProps> & {
    Option: React.FC<SelectOptionProps>;
    OptGroup: React.FC<SelectOptGroupProps>;
} = ({
    value: externalValue,
    defaultValue,
    onChange,
    placeholder = '请选择',
    disabled = false,
    size = 'middle',
    style,
    className,
    options,
    children,
    open: externalOpen,
    onOpenChange,
    width,
    height,
    dropdownHeight,
    label,
    labelGap = 8,
    labelClassName = '',
    labelStyle
}) => {
    const [value, setValue] = useState(defaultValue);
    const [internalOpen, setInternalOpen] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState<ReactNode>(placeholder);
    const selectRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    // 确定最终的open状态，优先使用外部传入的open参数
    const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;

    // 从children中查找对应value的label
    const findLabelFromChildren = (targetValue: any, childrenNodes: ReactNode): ReactNode | undefined => {
        if (!childrenNodes) return undefined;

        // 处理 Fragment
        const childrenArray = React.Children.toArray(childrenNodes);

        for (const child of childrenArray) {
            if (React.isValidElement(child)) {
                // 处理 Fragment (type 是 Symbol 或 REACT_FRAGMENT_TYPE)
                if (child.type === React.Fragment) {
                    const fragmentLabel = findLabelFromChildren(targetValue, (child.props as any).children);
                    if (fragmentLabel !== undefined) {
                        return fragmentLabel;
                    }
                    continue;
                }
                // 处理OptGroup
                if (child.type === Select.OptGroup) {
                    const groupLabel = findLabelFromChildren(targetValue, (child.props as any).children);
                    if (groupLabel !== undefined) {
                        return groupLabel;
                    }
                    continue;
                }
                // 处理Option
                if (child.type === Select.Option) {
                    if ((child.props as any).value === targetValue) {
                        return (child.props as any).children;
                    }
                }
            }
        }

        return undefined;
    };

    // 当外部value变化时更新内部状态和显示的label
    useEffect(() => {
        if (externalValue !== undefined) {
            setValue(externalValue);
            
            // 同步更新selectedLabel
            let label: ReactNode | undefined;
            
            // 先从options中查找
            if (options && options.length > 0) {
                const selected = options.find(option => option.value === externalValue);
                if (selected) {
                    label = selected.label;
                }
            }
            
            // 如果options中没有找到，从children中查找
            if (label === undefined && children) {
                label = findLabelFromChildren(externalValue, children);
            }
            
            // 如果都没有找到，且value是undefined或null，显示placeholder
            if (label === undefined && (externalValue === undefined || externalValue === null)) {
                label = placeholder;
            }
            
            if (label !== undefined) {
                setSelectedLabel(label);
            }
        }
    }, [externalValue, options, children, placeholder]);

    // 根据value更新显示的label（用于非受控模式或内部value变化）
    useEffect(() => {
        // 跳过受控模式，因为externalValue的useEffect已经处理了
        if (externalValue !== undefined) return;
        
        let label: ReactNode | undefined;
        
        // 先从options中查找
        if (options && options.length > 0) {
            const selected = options.find(option => option.value === value);
            if (selected) {
                label = selected.label;
            }
        }
        
        // 如果options中没有找到，从children中查找
        if (label === undefined && children) {
            label = findLabelFromChildren(value, children);
        }
        
        // 如果都没有找到，且value是undefined或null，显示placeholder
        if (label === undefined && (value === undefined || value === null)) {
            label = placeholder;
        }
        
        if (label !== undefined) {
            setSelectedLabel(label);
        }
    }, [value, options, children, placeholder, externalValue]);

    // 点击外部关闭下拉菜单
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isOpen &&
                selectRef.current &&
                !selectRef.current.contains(event.target as Node)
            ) {
                if (externalOpen !== undefined) {
                    onOpenChange?.(false);
                } else {
                    setInternalOpen(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        // 清理函数
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, externalOpen, onOpenChange]);

    // 处理选项选择
    const handleOptionSelect = (newValue: any, label?: ReactNode) => {
        if (disabled) return;

        // 在受控模式下，只调用onChange，让外部组件更新value
        // 在非受控模式下，直接更新内部value
        if (externalValue === undefined) {
            setValue(newValue);
        }
        onChange?.(newValue);

        // 关闭下拉菜单
        if (externalOpen !== undefined) {
            onOpenChange?.(false);
        } else {
            setInternalOpen(false);
        }

        // 更新显示的label
        if (label) {
            setSelectedLabel(label);
        } else if (options && options.length > 0) {
            const selected = options.find(option => option.value === newValue);
            if (selected) {
                setSelectedLabel(selected.label);
            }
        }
    };

    // 处理触发器点击
    const handleTriggerClick = () => {
        if (disabled) return;
        const newOpenState = !isOpen;
        if (externalOpen !== undefined) {
            onOpenChange?.(newOpenState);
        } else {
            setInternalOpen(newOpenState);
        }
    };

    // 渲染通过options属性传入的选项
    const renderOptions = () => {
        if (!options || options.length === 0) return null;

        return options.map((option, index) => (
            <div
                    key={index}
                    className={classNames('idp-select-option', {
                        'idp-select-option--selected': value === option.value,
                        'idp-select-option--disabled': option.disabled
                    })}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!option.disabled) {
                            handleOptionSelect(option.value, option.label);
                        }
                    }}
                >
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                        {option.icon && <Icon type={option.icon} size={16} color={option.disabled ? '#00000040' : '#8c8c8c'} style={{ marginRight: '8px' }} />}
                        {option.label}
                    </div>
                </div>
        ));
    };

    // 计算实际应用的尺寸
    const actualSize = height ? undefined : size;
    
    // 构建选择器的样式 - 当设置了width时，整个组件宽度为width
    const selectStyle: React.CSSProperties = {
        ...style,
        width: width
    };
    
    // 构建触发器的样式
    // 当设置了width且有label时，触发器宽度应该是总width减去label和gap的宽度
    // 但由于label宽度是动态的，我们使用flex: 1让触发器自动填充剩余空间
    const triggerStyle: React.CSSProperties = {
        height: height,
        flex: width !== undefined ? 1 : undefined
    };
    
    // 构建下拉菜单的样式 - 不设置固定宽度，让下拉菜单自适应trigger宽度
    const dropdownStyle: React.CSSProperties = {};
    
    // 构建下拉菜单内容的样式
    const dropdownContentStyle: React.CSSProperties = {
        maxHeight: dropdownHeight
    };
    
    const classes = classNames('idp-select', {
        'idp-select--open': isOpen,
        'idp-select--disabled': disabled,
        [`idp-select--${actualSize}`]: actualSize
    }, className);

    return (
        <SelectContext.Provider value={{ value, onOptionSelect: handleOptionSelect, disabled }}>
            <div className={classes} style={selectStyle} ref={selectRef}>
                <div className="idp-select-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
                    {label && (
                        <div
                            className={`idp-select-label ${labelClassName}`}
                            style={{
                                marginRight: typeof labelGap === 'number' ? `${labelGap}px` : labelGap,
                                ...labelStyle
                            }}
                        >
                            {label}
                        </div>
                    )}
                    <div
                        className="idp-select__trigger"
                        onClick={handleTriggerClick}
                        ref={triggerRef}
                        aria-expanded={isOpen}
                        aria-haspopup="listbox"
                        style={triggerStyle}
                    >
                        <span className={classNames('idp-select__value', {
                            'idp-select__value--placeholder': value === undefined || value === null
                        })}>
                            {selectedLabel}
                        </span>
                        <span className="idp-select__arrow">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </span>
                        {isOpen && (
                            <div className={`idp-select-dropdown is-open`} ref={menuRef} role="listbox" style={dropdownStyle}>
                                <div className="idp-select-dropdown__content" style={dropdownContentStyle}>
                                    {(() => {
                                        // 检查是否有选项
                                        const hasOptions = options && options.length > 0;
                                        const hasChildren = React.Children.count(children) > 0;
                                        
                                        if (hasOptions) {
                                            return renderOptions();
                                        } else if (hasChildren) {
                                            return children;
                                        } else {
                                            // 没有选项时显示空状态
                                            return (
                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80px', padding: '20px' }}>
                                                    <Empty size="small" description="暂无选项" />
                                                </div>
                                            );
                                        }
                                    })()}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SelectContext.Provider>
    );
};

// Option子组件
Select.Option = ({ value, children, disabled = false, icon }: SelectOptionProps) => {
    const context = useContext(SelectContext);

    if (!context) {
        throw new Error('Select.Option must be used within a Select component');
    }

    const { value: selectValue, onOptionSelect, disabled: selectDisabled } = context;
    const isSelected = selectValue === value;
    const isDisabled = disabled || selectDisabled;

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDisabled) {
            onOptionSelect(value, children);
        }
    };

    return (
        <div
            className={classNames('idp-select-option', {
                'idp-select-option--selected': isSelected,
                'idp-select-option--disabled': isDisabled
            })}
            onMouseDown={handleClick}
            role="option"
            aria-selected={isSelected}
            aria-disabled={isDisabled}
        >
            <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                {icon && <Icon type={icon} size={16} color={isDisabled ? '#00000040' : '#8c8c8c'} style={{ marginRight: '8px' }} />}
                {children}
            </div>
            {isSelected && (
                <Icon type="check" size={18} color="#339af0" />
            )}
        </div>
    );
};

// OptGroup分组组件
Select.OptGroup = ({ label, children }: SelectOptGroupProps) => {
    return (
        <div className="idp-select-optgroup">
            <div className="idp-select-optgroup__label">{label}</div>
            <div className="idp-select-optgroup__content">
                {children}
            </div>
        </div>
    );
};

Select.displayName = 'Select';
Select.Option.displayName = 'Select.Option';
Select.OptGroup.displayName = 'Select.OptGroup';

export default Select;
export * from './types';
