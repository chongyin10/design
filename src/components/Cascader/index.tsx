import React, { useState, useRef, useEffect, useCallback } from 'react';
import Icon from '../Icon';
import Empty from '../Empty';
import type { CascaderProps, CascaderOption } from './types';
import './Cascader.css';

const Cascader: React.FC<CascaderProps> = ({
  value,
  defaultValue,
  onChange,
  options = [],
  placeholder = '请选择',
  disabled = false,
  size = 'middle',
  style,
  className = '',
  allowClear = true,
  expandTrigger = 'click',
  changeOnSelect = false,
  fieldNames = {},
  width,
  dropdownWidth,
  dropdownHeight,
  dropdownStyle = {},
  dropdownClassName = '',
  placement = 'bottomLeft',
  checkbox = false,
  autoWidth = false
}) => {
  const [open, setOpen] = useState(false);
  // 存储所有选中的叶子节点选项
  const [selectedOptions, setSelectedOptions] = useState<CascaderOption[]>([]);
  const [activePath, setActivePath] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { label = 'label', value: valueKey = 'value', children: childrenKey = 'children' } = fieldNames;

  // 获取选项的值
  const getOptionValue = useCallback((option: CascaderOption) => {
    return option[valueKey as keyof CascaderOption] || option.value;
  }, [valueKey]);

  // 获取选项的标签
  const getOptionLabel = useCallback((option: CascaderOption) => {
    return option[label as keyof CascaderOption] || option.label;
  }, [label]);

  // 获取选项的子项
  const getOptionChildren = useCallback((option: CascaderOption) => {
    return option[childrenKey as keyof CascaderOption] || option.children;
  }, [childrenKey]);

  // 根据值路径查找选中的选项（用于单选）
  const findSelectedOptions = useCallback((valuePath: any[]): CascaderOption[] => {
    const result: CascaderOption[] = [];
    let currentOptions = options;

    for (const val of valuePath) {
      const found = currentOptions.find(opt => getOptionValue(opt) === val);
      if (found) {
        result.push(found);
        currentOptions = getOptionChildren(found) || [];
      } else {
        return result;
      }
    }

    return result;
  }, [options, getOptionValue, getOptionChildren]);

  // 根据值路径查找选中的选项（用于多选）
  const findSelectedOptionsByPath = useCallback((valuePath: any[]): CascaderOption[] => {
    const result: CascaderOption[] = [];
    let currentOptions = options;

    for (const val of valuePath) {
      const found = currentOptions.find(opt => getOptionValue(opt) === val);
      if (found) {
        result.push(found);
        currentOptions = getOptionChildren(found) || [];
      } else {
        return result;
      }
    }

    return result;
  }, [options, getOptionValue, getOptionChildren]);

  // 根据模式初始化内部值
  const getInitialValue = useCallback((): any[][] => {
    const val = value !== undefined ? value : defaultValue;
    if (!val || (Array.isArray(val) && val.length === 0)) {
      return [];
    }
    if (checkbox) {
      // 多选模式：val 应该是 any[][] 类型
      return Array.isArray(val) && Array.isArray(val[0]) ? val : [val];
    } else {
      // 单选模式：val 应该是 any[] 类型，需要包装成 [any[]]
      return Array.isArray(val) && !Array.isArray(val[0]) ? [val] : [];
    }
  }, [value, defaultValue, checkbox]);
  const [internalValue, setInternalValue] = useState<any[][]>(getInitialValue());

  // 同步外部value
  useEffect(() => {
    const val = value !== undefined ? value : defaultValue;

    if (!val) {
      // 清空
      setInternalValue([]);
      setSelectedOptions([]);
      return;
    }

    if (checkbox) {
      // 多选模式
      let valArray: any[][];
      if (Array.isArray(val)) {
        if (val.length === 0) {
          valArray = [];
        } else if (Array.isArray(val[0])) {
          // 已经是多选格式 any[][]
          valArray = val;
        } else {
          // 是单选格式 any[]，包装成多选格式
          valArray = [val];
        }
      } else {
        valArray = [];
      }
      setInternalValue(valArray);
      // 根据值路径查找所有选中的选项（允许选中任何级别的菜单）
      const selected = valArray.map(path => findSelectedOptionsByPath(path));
      setSelectedOptions(selected
        .map(item => {
          if (!item || item.length === 0) return null;
          return item[item.length - 1];
        })
        .filter((item): item is CascaderOption => item !== null));
    } else {
      // 单选模式
      const valArray = Array.isArray(val) && !Array.isArray(val[0]) ? val : val[0];
      if (valArray && valArray.length > 0) {
        setInternalValue([valArray]);
      } else {
        setInternalValue([]);
      }
    }
  }, [value, defaultValue, checkbox, findSelectedOptionsByPath]);

  // 获取选项路径的标签（从根到该选项）
  const getOptionPathLabels = useCallback((option: CascaderOption): string[] => {
    const labels: string[] = [];
    const findLabels = (currentOptions: CascaderOption[], targetOption: CascaderOption): boolean => {
      for (const opt of currentOptions) {
        if (getOptionValue(opt) === getOptionValue(targetOption)) {
          labels.push(getOptionLabel(opt));
          return true;
        }
        const children = getOptionChildren(opt);
        if (children && children.length > 0) {
          if (findLabels(children, targetOption)) {
            labels.unshift(getOptionLabel(opt));
            return true;
          }
        }
      }
      return false;
    };

    findLabels(options, option);
    return labels;
  }, [options, getOptionValue, getOptionLabel, getOptionChildren]);

  // 根据值查找显示文本
  const getDisplayText = useCallback(() => {
    if (checkbox) {
      // 多选模式：只显示叶子节点（最后一级）的选中项完整路径
      if (!selectedOptions || selectedOptions.length === 0) {
        return placeholder;
      }
      // 过滤出叶子节点（没有子项的节点）
      const leafOptions = selectedOptions.filter(opt => {
        const children = getOptionChildren(opt);
        return !children || children.length === 0;
      });

      const pathLabels = leafOptions.map(opt => {
        const labels = getOptionPathLabels(opt);
        return labels.join('/');
      });

      // 当选中项超过 3 个时，只显示前 3 个，剩余用 +N 表示
      if (pathLabels.length > 3) {
        return pathLabels.slice(0, 3).join(', ') + ` +${pathLabels.length - 3}`;
      }
      return pathLabels.join(', ');
    } else {
      // 单选模式
      if (internalValue.length === 0 || !internalValue[0] || internalValue[0].length === 0) {
        return placeholder;
      }
      const selectedOptions = findSelectedOptions(internalValue[0]);
      return selectedOptions.map(opt => getOptionLabel(opt)).join(' / ');
    }
  }, [internalValue, selectedOptions, checkbox, findSelectedOptions, getOptionLabel, placeholder, getOptionPathLabels, getOptionChildren]);

  // 获取选项的完整路径（从根到该选项）
  const getOptionPath = useCallback((option: CascaderOption): any[] => {
    const path: any[] = [];
    const findPath = (currentOptions: CascaderOption[], targetOption: CascaderOption, currentPath: any[]): boolean => {
      for (const opt of currentOptions) {
        const newPath = [...currentPath, getOptionValue(opt)];
        if (getOptionValue(opt) === getOptionValue(targetOption)) {
          path.push(...newPath);
          return true;
        }
        const children = getOptionChildren(opt);
        if (children && children.length > 0) {
          if (findPath(children, targetOption, newPath)) {
            return true;
          }
        }
      }
      return false;
    };

    findPath(options, option, []);
    return path;
  }, [options, getOptionValue, getOptionChildren]);

  // 判断一个选项是否是另一个选项的子孙
  const isDescendantOf = useCallback((descendant: CascaderOption, ancestor: CascaderOption): boolean => {
    const ancestorPath = getOptionPath(ancestor);
    const descendantPath = getOptionPath(descendant);

    // 如果子孙路径以祖先路径开头，并且子孙路径更长，则说明是子孙
    if (descendantPath.length <= ancestorPath.length) {
      return false;
    }

    for (let i = 0; i < ancestorPath.length; i++) {
      if (ancestorPath[i] !== descendantPath[i]) {
        return false;
      }
    }

    return true;
  }, [getOptionPath]);

  // 获取选项路径中的所有选项对象（从根到该选项）
  const getOptionPathOptions = useCallback((option: CascaderOption): CascaderOption[] => {
    const pathOptions: CascaderOption[] = [];
    const findPath = (currentOptions: CascaderOption[], targetOption: CascaderOption, currentPath: CascaderOption[]): boolean => {
      for (const opt of currentOptions) {
        if (getOptionValue(opt) === getOptionValue(targetOption)) {
          pathOptions.unshift(opt);
          return true;
        }
        const children = getOptionChildren(opt);
        if (children && children.length > 0) {
          if (findPath(children, targetOption, [...currentPath, opt])) {
            pathOptions.unshift(opt);
            return true;
          }
        }
      }
      return false;
    };

    findPath(options, option, []);
    return pathOptions;
  }, [options, getOptionValue, getOptionChildren]);

  // 处理多选模式下 checkbox 点击（触发选中/取消选中）
  const handleCheckboxClick = useCallback((e: React.MouseEvent, option: CascaderOption, level: number) => {
    e.stopPropagation();

    if (checkbox) {
      const newSelectedOptions = [...selectedOptions];
      const optionIndex = newSelectedOptions.findIndex(
        opt => getOptionValue(opt) === getOptionValue(option)
      );

      if (optionIndex > -1) {
        // 已选中，取消选中
        newSelectedOptions.splice(optionIndex, 1);
        // 同时取消该选项的所有子孙项的选中
        const filteredOptions = newSelectedOptions.filter(
          selectedOpt => !isDescendantOf(selectedOpt, option)
        );
        newSelectedOptions.splice(0, newSelectedOptions.length, ...filteredOptions);
      } else {
        // 未选中，添加选中及其所有父级菜单
        const pathOptions = getOptionPathOptions(option);
        // 将路径中的所有选项添加到选中列表
        pathOptions.forEach(pathOpt => {
          const pathOptIndex = newSelectedOptions.findIndex(
            opt => getOptionValue(opt) === getOptionValue(pathOpt)
          );
          if (pathOptIndex === -1) {
            newSelectedOptions.push(pathOpt);
          }
        });
      }

      setSelectedOptions(newSelectedOptions);
      const newValues = newSelectedOptions.map(opt => getOptionPath(opt));
      onChange?.(newValues, newSelectedOptions);
      if (value === undefined) {
        setInternalValue(newValues);
      }

      // 展开/更新子菜单
      const children = getOptionChildren(option);
      if (children && children.length > 0) {
        // 有子项，展开下一级
        const newValue = [...activePath.slice(0, level), getOptionValue(option)];
        setActivePath(newValue);
      } else {
        // 没有子项，清空当前路径之后的路径
        const newValue = activePath.slice(0, level + 1);
        setActivePath(newValue);
      }
    }
  }, [selectedOptions, checkbox, getOptionValue, getOptionChildren, getOptionPath, getOptionPathOptions, isDescendantOf, onChange, value, activePath]);

  // 处理选项点击
  const handleOptionClick = useCallback((option: CascaderOption, level: number) => {
    if (checkbox) {
      // 多选模式：点击 checkbox 切换选中状态，同时展开子菜单
      const newSelectedOptions = [...selectedOptions];
      const optionIndex = newSelectedOptions.findIndex(
        opt => getOptionValue(opt) === getOptionValue(option)
      );

      if (optionIndex > -1) {
        // 已选中，取消选中
        newSelectedOptions.splice(optionIndex, 1);
        // 同时取消该选项的所有子孙项的选中
        const filteredOptions = newSelectedOptions.filter(
          selectedOpt => !isDescendantOf(selectedOpt, option)
        );
        newSelectedOptions.splice(0, newSelectedOptions.length, ...filteredOptions);
      } else {
        // 未选中，添加选中及其所有父级菜单
        const pathOptions = getOptionPathOptions(option);
        // 将路径中的所有选项添加到选中列表
        pathOptions.forEach(pathOpt => {
          const pathOptIndex = newSelectedOptions.findIndex(
            opt => getOptionValue(opt) === getOptionValue(pathOpt)
          );
          if (pathOptIndex === -1) {
            newSelectedOptions.push(pathOpt);
          }
        });
      }

      setSelectedOptions(newSelectedOptions);
      const newValues = newSelectedOptions.map(opt => getOptionPath(opt));
      onChange?.(newValues, newSelectedOptions);
      if (value === undefined) {
        setInternalValue(newValues);
      }

      // 展开/更新子菜单
      const children = getOptionChildren(option);
      if (children && children.length > 0) {
        // 有子项，展开下一级
        const newValue = [...activePath.slice(0, level), getOptionValue(option)];
        setActivePath(newValue);
      } else {
        // 没有子项，清空当前路径之后的路径
        const newValue = activePath.slice(0, level + 1);
        setActivePath(newValue);
      }
    } else {
      // 单选模式
      const newValue = [...activePath.slice(0, level), getOptionValue(option)];
      setActivePath(newValue);

      const children = getOptionChildren(option);

      if (children && children.length > 0) {
        // 有子项，不关闭，继续展开下一级
        if (changeOnSelect) {
          // 如果允许选中任意级别，触发onChange
          const selectedOptions = findSelectedOptions(newValue);
          onChange?.(newValue, selectedOptions);
          if (value === undefined) {
            setInternalValue([newValue]);
          }
        }
      } else {
        // 没有子项，选中并关闭
        const selectedOptions = findSelectedOptions(newValue);
        onChange?.(newValue, selectedOptions);
        if (value === undefined) {
          setInternalValue([newValue]);
        }
        setOpen(false);
        setActivePath([]);
      }
    }
  }, [activePath, selectedOptions, checkbox, getOptionValue, getOptionLabel, getOptionChildren, changeOnSelect, findSelectedOptions, getOptionPath, getOptionPathOptions, isDescendantOf, onChange, value]);

  // 处理选项悬停
  const handleOptionHover = useCallback((option: CascaderOption, level: number) => {
    if (expandTrigger === 'hover') {
      const newValue = [...activePath.slice(0, level), getOptionValue(option)];
      setActivePath(newValue);
    }
  }, [activePath, expandTrigger, getOptionValue]);

  // 处理菜单项内容点击（只展开子菜单，不触发选中）
  const handleContentClick = useCallback((e: React.MouseEvent, option: CascaderOption, level: number) => {
    e.stopPropagation();

    if (checkbox) {
      // 多选模式：只展开子菜单，不触发选中
      const children = getOptionChildren(option);
      if (children && children.length > 0) {
        // 有子项，展开下一级
        const newValue = [...activePath.slice(0, level), getOptionValue(option)];
        setActivePath(newValue);
      }
    } else {
      // 单选模式：使用原有的点击逻辑
      handleOptionClick(option, level);
    }
  }, [checkbox, activePath, getOptionValue, getOptionChildren, handleOptionClick]);

  // 清除选择
  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (checkbox) {
      onChange?.([], []);
      setSelectedOptions([]);
      if (value === undefined) {
        setInternalValue([]);
      }
    } else {
      onChange?.([], []);
      if (value === undefined) {
        setInternalValue([]);
      }
    }
    setActivePath([]);
  }, [onChange, value, checkbox]);

  // 处理删除单个选中项
  const handleRemoveItem = useCallback((e: React.MouseEvent, option: CascaderOption) => {
    e.stopPropagation();
    if (!checkbox) return;

    const newSelectedOptions = [...selectedOptions];
    const optionValue = getOptionValue(option);

    // 移除该选项
    const optionIndex = newSelectedOptions.findIndex(
      opt => getOptionValue(opt) === optionValue
    );

    if (optionIndex > -1) {
      newSelectedOptions.splice(optionIndex, 1);

      // 同时移除该选项的所有子孙项的选中
      const filteredOptions = newSelectedOptions.filter(
        selectedOpt => !isDescendantOf(selectedOpt, option)
      );
      newSelectedOptions.splice(0, newSelectedOptions.length, ...filteredOptions);

      // 检查父级选项，如果父级选项没有其他子孙被选中，也删除父级
      const pathOptions = getOptionPathOptions(option);
      // 从根到父，不包含当前选项
      for (let i = pathOptions.length - 2; i >= 0; i--) {
        const parentOpt = pathOptions[i];
        const parentValue = getOptionValue(parentOpt);

        // 检查是否有其他子孙（不包括当前被删除的选项）被选中
        const hasSelectedDescendants = newSelectedOptions.some(selectedOpt => {
          if (getOptionValue(selectedOpt) === parentValue) return false;
          return isDescendantOf(selectedOpt, parentOpt);
        });

        if (!hasSelectedDescendants) {
          // 父级没有其他子孙被选中，移除父级
          const parentIndex = newSelectedOptions.findIndex(
            opt => getOptionValue(opt) === parentValue
          );
          if (parentIndex > -1) {
            newSelectedOptions.splice(parentIndex, 1);
          }
        }
      }

      setSelectedOptions(newSelectedOptions);
      const newValues = newSelectedOptions.map(opt => getOptionPath(opt));
      onChange?.(newValues, newSelectedOptions);
      if (value === undefined) {
        setInternalValue(newValues);
      }
    }
  }, [selectedOptions, checkbox, getOptionValue, getOptionPath, getOptionPathOptions, isDescendantOf, onChange, value]);

  // 处理容器点击
  const handleContainerClick = useCallback(() => {
    if (!disabled) {
      setOpen(!open);
    }
  }, [open, disabled]);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActivePath([]);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // 获取指定层级的选项
  const getOptionsAtLevel = useCallback((level: number): CascaderOption[] => {
    if (level === 0) {
      return options;
    }
    
    const valuePath = activePath.slice(0, level);
    let currentOptions = options;
    
    for (const val of valuePath) {
      const found = currentOptions.find(opt => getOptionValue(opt) === val);
      if (found) {
        currentOptions = getOptionChildren(found) || [];
      } else {
        return [];
      }
    }
    
    return currentOptions;
  }, [options, activePath, getOptionValue, getOptionChildren]);

  // 初始化activePath
  useEffect(() => {
    if (!checkbox) {
      if (open && internalValue.length > 0 && internalValue[0]) {
        setActivePath(internalValue[0]);
      } else if (!open) {
        setActivePath([]);
      }
    }
  }, [open, internalValue, checkbox]);

  // 判断选项是否被选中（多选模式）
  const isOptionSelectedInCheckbox = useCallback((option: CascaderOption) => {
    if (!checkbox) return false;
    return selectedOptions.some(opt => getOptionValue(opt) === getOptionValue(option));
  }, [selectedOptions, checkbox, getOptionValue]);

  // 判断选项是否被选中（单选模式）
  const isOptionSelectedInSingle = useCallback((option: CascaderOption, level: number) => {
    if (checkbox) return false;
    if (level >= internalValue.length || !internalValue[0]) {
      return false;
    }
    return internalValue[0][level] === getOptionValue(option);
  }, [internalValue, checkbox, getOptionValue]);

  // 判断选项是否处于激活路径中
  const isOptionActive = useCallback((option: CascaderOption, level: number) => {
    if (level >= activePath.length) {
      return false;
    }
    return activePath[level] === getOptionValue(option);
  }, [activePath, getOptionValue]);

  // 渲染选项列表
  const renderOptions = (level: number) => {
    const optionsAtLevel = getOptionsAtLevel(level);

    // 空状态处理
    if (!optionsAtLevel || optionsAtLevel.length === 0) {
      return (
        <div className="cascader-menu cascader-menu-empty">
          <Empty size="small" description="暂无数据" />
        </div>
      );
    }

    return (
      <ul className={`cascader-menu cascader-menu-${level} ${checkbox ? 'cascader-menu-checkbox' : ''}`}>
        {optionsAtLevel.map((option, index) => {
          const isSelected = checkbox ? isOptionSelectedInCheckbox(option) : isOptionSelectedInSingle(option, level);
          const isActive = isOptionActive(option, level);
          const hasChildren = getOptionChildren(option) && getOptionChildren(option)!.length > 0;
          const isDisabled = option.disabled;

          return (
            <li
              key={`${getOptionValue(option)}-${index}`}
              className={`cascader-menu-item ${isSelected ? 'cascader-menu-item-selected' : ''} ${isActive ? 'cascader-menu-item-active' : ''} ${isSelected && isActive ? 'cascader-menu-item-selected-active' : ''} ${isDisabled ? 'cascader-menu-item-disabled' : ''}`}
              onClick={() => !isDisabled && (checkbox ? undefined : handleOptionClick(option, level))}
              onMouseEnter={() => !isDisabled && handleOptionHover(option, level)}
            >
              {checkbox && (
                <span
                  className="cascader-menu-item-checkbox"
                  onClick={(e) => !isDisabled && handleCheckboxClick(e, option, level)}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    readOnly
                  />
                </span>
              )}
              <span
                className="cascader-menu-item-content"
                onClick={(e) => !isDisabled && handleContentClick(e, option, level)}
              >
                {getOptionLabel(option)}
              </span>
              {hasChildren && (
                <span className="cascader-menu-item-expand-icon">
                  <Icon type="arrowRight" size={12} color="#bfbfbf" />
                </span>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  // 获取显示的菜单数量
  const getMenuCount = useCallback(() => {
    if (activePath.length === 0) {
      return 1;
    }

    let count = activePath.length;
    let currentOptions = options;

    // 检查最后一级是否有子项
    for (const val of activePath) {
      const found = currentOptions.find(opt => getOptionValue(opt) === val);
      if (found) {
        currentOptions = getOptionChildren(found) || [];
      } else {
        break;
      }
    }

    if (currentOptions && currentOptions.length > 0) {
      count++;
    }

    return count;
  }, [activePath, options, getOptionValue, getOptionChildren]);

  // 计算触发器宽度
  const triggerStyle = useCallback(() => {
    const baseStyle = { ...style };

    if (width) {
      baseStyle.width = typeof width === 'number' ? `${width}px` : width;
    }

    // 默认情况下禁止自动扩展宽度，除非显式设置 autoWidth = true
    if (!autoWidth && !width) {
      baseStyle.minWidth = '180px';
      baseStyle.maxWidth = '100%';
    } else if (autoWidth && !width) {
      // autoWidth 为 true 时，允许自动扩展，但设置一个最小宽度
      baseStyle.minWidth = '180px';
    } else if (!autoWidth && width) {
      // 设置了固定宽度且 autoWidth 为 false，确保不会扩展
      baseStyle.maxWidth = typeof width === 'number' ? `${width}px` : width;
    }

    return baseStyle;
  }, [width, style, autoWidth]);

  // 计算下拉框样式
  const computedDropdownStyle = useCallback(() => {
    const baseStyle: React.CSSProperties = {
      ...dropdownStyle
    };

    // 根据 placement 设置位置
    switch (placement) {
      case 'bottomLeft':
        baseStyle.top = '100%';
        baseStyle.left = '0';
        baseStyle.marginTop = '4px';
        break;
      case 'bottomRight':
        baseStyle.top = '100%';
        baseStyle.right = '0';
        baseStyle.marginTop = '4px';
        break;
      case 'topLeft':
        baseStyle.bottom = '100%';
        baseStyle.left = '0';
        baseStyle.marginBottom = '4px';
        break;
      case 'topRight':
        baseStyle.bottom = '100%';
        baseStyle.right = '0';
        baseStyle.marginBottom = '4px';
        break;
    }

    if (dropdownWidth) {
      baseStyle.width = typeof dropdownWidth === 'number' ? `${dropdownWidth}px` : dropdownWidth;
    }

    if (dropdownHeight) {
      baseStyle.maxHeight = typeof dropdownHeight === 'number' ? `${dropdownHeight}px` : dropdownHeight;
    }

    return baseStyle;
  }, [dropdownWidth, dropdownHeight, dropdownStyle, placement]);

  // 判断是否有值
  const hasValue = checkbox
    ? selectedOptions.filter(opt => {
        const children = getOptionChildren(opt);
        return !children || children.length === 0;
      }).length > 0
    : (internalValue.length > 0 && internalValue[0]?.length > 0);

  return (
    <div
      ref={containerRef}
      className={`cascader cascader-${size} ${className} ${disabled ? 'cascader-disabled' : ''} ${open ? 'cascader-open' : ''} ${hasValue ? 'cascader-has-value' : ''}`}
      style={triggerStyle()}
    >
      <div className="cascader-trigger" onClick={handleContainerClick}>
        <span className={`cascader-selection-placeholder ${hasValue ? 'cascader-selection-hidden' : ''}`}>
          {placeholder}
        </span>
        {checkbox ? (
          // 多选模式：渲染带删除按钮的标签
          <div className={`cascader-selection-value ${!hasValue ? 'cascader-selection-hidden' : ''}`}>
            {selectedOptions
              .filter(opt => {
                const children = getOptionChildren(opt);
                return !children || children.length === 0;
              })
              .map(opt => {
                const labels = getOptionPathLabels(opt);
                return (
                  <span key={getOptionValue(opt)} className="cascader-tag">
                    <span className="cascader-tag-content">{labels.join('/')}</span>
                    <span className="cascader-tag-close" onClick={(e) => !disabled && handleRemoveItem(e, opt)}>
                      <Icon type="close" size={10} />
                    </span>
                  </span>
                );
              })}
          </div>
        ) : (
          // 单选模式：渲染文本
          <span className={`cascader-selection-value ${!hasValue ? 'cascader-selection-hidden' : ''}`}>
            {getDisplayText()}
          </span>
        )}
        <span className="cascader-arrow">
          <Icon type="arrowDown" size={12} />
        </span>
        {allowClear && hasValue && !disabled && (
          <span className="cascader-clear" onClick={handleClear}>
            <Icon type="close" size={12} />
          </span>
        )}
      </div>

      {open && (
        <div className={`cascader-dropdown cascader-dropdown-${placement} ${dropdownClassName}`} ref={menuRef} style={computedDropdownStyle()}>
          <div className="cascader-menus" style={{ width: dropdownWidth ? undefined : `${getMenuCount() * 180}px` }}>
            {Array.from({ length: getMenuCount() }).map((_, level) => renderOptions(level))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cascader;
