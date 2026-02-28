import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { SelectProps, SelectOption, TagRenderProps } from './types';
import {
    Wrapper,
    LabelWrapper,
    Label,
    Selector,
    SelectorContent,
    Placeholder,
    SingleValue,
    TagsContainer,
    Tag,
    TagClose,
    SearchInput,
    SuffixArea,
    ClearButton,
    Arrow,
    LoadingIcon,
    Dropdown,
    OptionList,
    Option,
    CheckIcon,
    Empty,
    injectGlobalStyles
} from './styles';
import './Select.css';

/**
 * Select 下拉选择组件
 * 用于从一组选项中选择一项或多项
 *
 * @example
 * ```tsx
 * // 基础用法
 * <Select
 *   options={[
 *     { value: '1', label: '选项1' },
 *     { value: '2', label: '选项2' }
 *   ]}
 *   onChange={(value) => console.log(value)}
 * />
 *
 * // 多选模式
 * <Select mode="multiple" options={options} />
 *
 * // 可搜索
 * <Select searchable options={options} />
 * ```
 */
const Select: React.FC<SelectProps> = ({
    value: valueProp,
    defaultValue,
    options = [],
    disabled = false,
    loading = false,
    mode = 'single',
    placeholder = '请选择',
    searchable = false,
    clearable = false,
    size = 'default',
    width,
    styles,
    onChange,
    onOpenChange,
    onSearch,
    optionRender,
    tagRender,
    label,
    labelGap = 8,
    labelClassName = '',
    labelStyle,
    className = '',
    style,
    showArrow = true,
    maxHeight = 256,
    emptyContent = '暂无数据',
    getPopupContainer
}) => {
    // 判断是否为受控模式
    const isControlled = valueProp !== undefined;

    // 内部状态
    const [internalValue, setInternalValue] = useState<string | number | (string | number)[]>(
        defaultValue !== undefined ? defaultValue : mode === 'multiple' ? [] : ''
    );
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [activeIndex, setActiveIndex] = useState(-1);
    const [isHovered, setIsHovered] = useState(false);

    // 引用
    const wrapperRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // 注入全局样式
    useEffect(() => {
        injectGlobalStyles();
    }, []);

    // 确定实际使用的值
    const currentValue = isControlled ? valueProp : internalValue;

    // 是否为多选模式
    const isMultiple = mode === 'multiple';

    // 过滤后的选项（搜索时）
    const filteredOptions = useMemo(() => {
        if (!searchValue) return options;
        return options.filter(option =>
            String(option.label).toLowerCase().includes(searchValue.toLowerCase())
        );
    }, [options, searchValue]);

    // 获取选中的选项
    const selectedOptions = useMemo(() => {
        if (isMultiple) {
            const values = Array.isArray(currentValue) ? currentValue : [];
            return options.filter(opt => values.includes(opt.value));
        }
        return options.find(opt => opt.value === currentValue) || null;
    }, [currentValue, options, isMultiple]);

    // 处理值变化
    const handleChange = useCallback((newValue: string | number | (string | number)[], option?: SelectOption | SelectOption[]) => {
        if (!isControlled) {
            setInternalValue(newValue);
        }
        onChange?.(newValue, option);
    }, [isControlled, onChange]);

    // 处理单选
    const handleSingleSelect = useCallback((option: SelectOption) => {
        if (option.disabled) return;

        handleChange(option.value, option);
        setSearchValue('');
        setOpen(false);
    }, [handleChange]);

    // 处理多选
    const handleMultipleSelect = useCallback((option: SelectOption) => {
        if (option.disabled) return;

        const currentValues = Array.isArray(currentValue) ? currentValue : [];
        const isSelected = currentValues.includes(option.value);

        let newValues: (string | number)[];
        let newOptions: SelectOption[];

        if (isSelected) {
            newValues = currentValues.filter(v => v !== option.value);
            newOptions = (selectedOptions as SelectOption[]).filter((o: SelectOption) => o.value !== option.value);
        } else {
            newValues = [...currentValues, option.value];
            newOptions = [...(selectedOptions as SelectOption[]), option];
        }

        handleChange(newValues, newOptions);
        setSearchValue('');

        // 多选模式下保持下拉菜单打开
        setTimeout(() => searchInputRef.current?.focus(), 0);
    }, [currentValue, handleChange, selectedOptions]);

    // 处理选项点击
    const handleOptionClick = useCallback((option: SelectOption) => {
        if (isMultiple) {
            handleMultipleSelect(option);
        } else {
            handleSingleSelect(option);
        }
    }, [isMultiple, handleMultipleSelect, handleSingleSelect]);

    // 处理标签关闭（多选）
    const handleTagClose = useCallback((e: React.MouseEvent, optionValue: string | number) => {
        e.stopPropagation();
        if (disabled) return;

        const currentValues = Array.isArray(currentValue) ? currentValue : [];
        const newValues = currentValues.filter(v => v !== optionValue);
        const newOptions = (selectedOptions as SelectOption[]).filter((o: SelectOption) => o.value !== optionValue);

        handleChange(newValues, newOptions);
    }, [currentValue, disabled, handleChange, selectedOptions]);

    // 处理清除
    const handleClear = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (disabled) return;

        const newValue = isMultiple ? [] : '';
        handleChange(newValue, isMultiple ? [] : undefined);
        setSearchValue('');
    }, [disabled, isMultiple, handleChange]);

    // 处理搜索
    const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
        onSearch?.(value);
    }, [onSearch]);

    // 处理点击外部关闭
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
                setSearchValue('');
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    // 监听 open 变化
    useEffect(() => {
        onOpenChange?.(open);
        if (open && searchable) {
            setTimeout(() => searchInputRef.current?.focus(), 0);
        }
    }, [open, searchable, onOpenChange]);

    // 键盘导航
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (!open) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setOpen(true);
            }
            return;
        }

        switch (e.key) {
            case 'Escape':
                e.preventDefault();
                setOpen(false);
                break;
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex(prev =>
                    prev < filteredOptions.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex(prev =>
                    prev > 0 ? prev - 1 : filteredOptions.length - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (activeIndex >= 0 && activeIndex < filteredOptions.length) {
                    handleOptionClick(filteredOptions[activeIndex]);
                }
                break;
        }
    }, [open, activeIndex, filteredOptions, handleOptionClick]);

    // 渲染标签（多选模式）
    const renderTag = (option: SelectOption) => {
        if (tagRender) {
            return tagRender({
                value: option.value,
                label: option.label,
                onClose: (e) => handleTagClose(e as React.MouseEvent, option.value),
                disabled
            });
        }

        return (
            <Tag
                key={option.value}
                className="select-tag"
                $disabled={disabled}
                $styles={styles?.tag}
            >
                <span>{option.label}</span>
                {!disabled && (
                    <TagClose
                        className="select-tag-close"
                        onClick={(e) => handleTagClose(e, option.value)}
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </TagClose>
                )}
            </Tag>
        );
    };

    // 渲染选择器内容
    const renderSelectorContent = () => {
        // 搜索模式下显示输入框
        if (searchable && open) {
            const searchPlaceholder = isMultiple
                ? '搜索...'
                : String((selectedOptions as SelectOption)?.label || placeholder);
            return (
                <SearchInput
                    ref={searchInputRef}
                    type="text"
                    value={searchValue}
                    onChange={handleSearch}
                    placeholder={searchPlaceholder}
                    onClick={(e) => e.stopPropagation()}
                />
            );
        }

        // 多选模式显示标签
        if (isMultiple) {
            const selected = selectedOptions as SelectOption[];
            if (selected.length > 0) {
                return (
                    <TagsContainer>
                        {selected.map(renderTag)}
                    </TagsContainer>
                );
            }
            return <Placeholder>{placeholder}</Placeholder>;
        }

        // 单选模式显示值
        const selected = selectedOptions as SelectOption | null;
        if (selected) {
            return <SingleValue>{selected.label}</SingleValue>;
        }
        return <Placeholder>{placeholder}</Placeholder>;
    };

    // 渲染选项
    const renderOption = (option: SelectOption, index: number) => {
        const isSelected = isMultiple
            ? (currentValue as (string | number)[]).includes(option.value)
            : currentValue === option.value;
        const isActive = index === activeIndex;

        const content = optionRender ? optionRender(option) : (
            <>
                {isSelected && isMultiple && (
                    <CheckIcon>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                    </CheckIcon>
                )}
                <span>{option.label}</span>
            </>
        );

        return (
            <Option
                key={option.value}
                className={`select-option ${isSelected ? 'select-option-selected' : ''} ${isActive ? 'select-option-active' : ''}`}
                $selected={isSelected}
                $active={isActive}
                $disabled={!!option.disabled}
                $styles={styles?.option}
                onClick={() => handleOptionClick(option)}
                onMouseEnter={() => setActiveIndex(index)}
            >
                {content}
            </Option>
        );
    };

    // 渲染下拉菜单
    const renderDropdown = () => {
        const dropdown = (
            <Dropdown
                ref={dropdownRef}
                className="select-dropdown"
                $open={open}
                $styles={styles?.dropdown}
            >
                <OptionList $maxHeight={maxHeight}>
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map(renderOption)
                    ) : (
                        <Empty className="select-empty">
                            {emptyContent}
                        </Empty>
                    )}
                </OptionList>
            </Dropdown>
        );

        if (getPopupContainer) {
            const container = getPopupContainer();
            return container ? dropdown : null;
        }

        return dropdown;
    };

    // 计算是否有值可清除
    const hasValue = isMultiple
        ? Array.isArray(currentValue) && currentValue.length > 0
        : currentValue !== '' && currentValue !== undefined && currentValue !== null;

    // 显示清除按钮的条件：可清除、非禁用、有值、非加载中、鼠标悬停
    const showClear = clearable && !disabled && hasValue && !loading && isHovered;

    // 显示下拉箭头的条件：需要显示箭头、非加载中、不满足清除按钮显示条件时
    const showArrowIcon = showArrow && !loading && !showClear;

    return (
        <Wrapper
            ref={wrapperRef}
            className={`select-wrapper ${className}`}
            $styles={styles?.wrapper}
            style={{ width, ...style }}
        >
            <LabelWrapper>
                {label && (
                    <Label
                        className={`select-label ${labelClassName}`}
                        style={{
                            marginRight: typeof labelGap === 'number' ? `${labelGap}px` : labelGap,
                            ...labelStyle
                        }}
                    >
                        {label}
                    </Label>
                )}
                <div style={{ flex: 1, position: 'relative' }}>
                    <Selector
                        className={`select-selector select-${size} ${open ? 'select-open' : ''} ${disabled ? 'select-disabled' : ''}`}
                        $disabled={disabled}
                        $loading={loading}
                        $size={size}
                        $open={open}
                        $styles={styles?.selector}
                        onClick={() => !disabled && !loading && setOpen(!open)}
                        onKeyDown={handleKeyDown}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        tabIndex={disabled ? -1 : 0}
                        role="combobox"
                        aria-expanded={open}
                        aria-haspopup="listbox"
                    >
                        <SelectorContent>
                            {renderSelectorContent()}
                        </SelectorContent>
                        <SuffixArea>
                            {showClear && (
                                <ClearButton
                                    className="select-clear"
                                    onClick={handleClear}
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                                    </svg>
                                </ClearButton>
                            )}
                            {loading && (
                                <LoadingIcon className="select-loading">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
                                    </svg>
                                </LoadingIcon>
                            )}
                            {showArrowIcon && (
                                <Arrow className={`select-arrow ${open ? 'select-open' : ''}`} $open={open}>
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M7 10l5 5 5-5z"/>
                                    </svg>
                                </Arrow>
                            )}
                        </SuffixArea>
                    </Selector>
                    {renderDropdown()}
                </div>
            </LabelWrapper>
        </Wrapper>
    );
};

export default Select;
export type { SelectProps, SelectOption, TagRenderProps };
