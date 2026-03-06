'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  TransferProps,
  TransferItem,
  TransferListProps,
  TransferOperationProps,
  FieldNames,
} from './types';

/**
 * 获取对象的字段值
 */
const getFieldValue = (item: any, fieldName: string | undefined, defaultField: string): any => {
  if (!fieldName) return item[defaultField];
  return item[fieldName];
};

/**
 * 获取 TransferItem 的 key
 */
const getItemKey = (item: any, fieldNames?: FieldNames): string => {
  return getFieldValue(item, fieldNames?.key, 'key');
};

/**
 * 获取 TransferItem 的 title
 */
const getItemTitle = (item: any, fieldNames?: FieldNames): React.ReactNode => {
  return getFieldValue(item, fieldNames?.title, 'title');
};
import {
  TransferWrapper,
  TransferListContainer,
  TransferListHeader,
  TransferHeaderLeft,
  TransferHeaderCount,
  TransferSearchWrapper,
  TransferSearch,
  TransferSearchButton,
  TransferListBody,
  TransferListItem,
  TransferItemCheckbox,
  TransferListItemCheckbox,
  TransferItemContent,
  TransferListFooter,
  TransferOperation,
  TransferOperationButton,
  TransferEmpty,
  TransferLoading,
  TransferLoadingSpinner,
} from './styles';
import Icon from '../Icon';
import './Transfer.css';

/**
 * TransferList 组件 - 单个穿梭框列表
 */
const TransferList: React.FC<TransferListProps> = ({
  dataSource,
  fieldNames,
  selectedKeys,
  showSearch,
  disabled,
  title,
  description,
  searchPlaceholder = '请输入搜索内容',
  filterOption,
  styles,
  listHeight,
  listWidth,
  header,
  search,
  body,
  onSelectChange,
  onSearch,
  render,
  footer,
  direction,
  rowClassName,
  loading,
  loadingRender,
  loadingDelay,
  sourceSelectedKeys,
  targetSelectedKeys,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [internalLoading, setInternalLoading] = useState(loading);
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 处理 loading 延迟
  useEffect(() => {
    // 清除之前的定时器
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }

    if (loading && loadingDelay && loadingDelay > 0) {
      setInternalLoading(true);
      loadingTimerRef.current = setTimeout(() => {
        setInternalLoading(false);
      }, loadingDelay);
    } else {
      setInternalLoading(loading);
    }

    return () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    };
  }, [loading, loadingDelay]);

  // 过滤后的数据
  const filteredDataSource = useMemo(() => {
    if (!searchValue) return dataSource;
    if (filterOption) {
      return dataSource.filter((item) => filterOption(searchValue, item));
    }
    return dataSource.filter((item) => {
      // 将 title 转换为字符串进行搜索
      const titleStr = getItemTitle(item, fieldNames);
      const titleString = titleStr != null ? String(titleStr) : '';
      
      // 如果 title 字段存在且有内容，优先搜索 title 字段
      if (titleString) {
        return titleString.toLowerCase().includes(searchValue.toLowerCase());
      }
      
      // 如果没有 title 字段或 title 为空，搜索所有字符串类型的字段
      const searchLower = searchValue.toLowerCase();
      return Object.keys(item).some(key => {
        const value = item[key];
        // 排除 key 字段（通常是 ID）和特殊字段
        if (key === 'key' || key === 'disabled') return false;
        // 搜索字符串、数字等可转换为字符串的值
        if (value !== null && value !== undefined) {
          return String(value).toLowerCase().includes(searchLower);
        }
        return false;
      });
    });
  }, [dataSource, searchValue, filterOption, fieldNames]);

  // 是否全选
  const isCheckedAll = useMemo(() => {
    const availableItems = filteredDataSource.filter((item) => !item.disabled);
    if (availableItems.length === 0) return false;
    return availableItems.every((item) => selectedKeys.includes(getItemKey(item, fieldNames)));
  }, [filteredDataSource, selectedKeys, fieldNames]);

  // 是否部分选中（半选状态）
  const isIndeterminate = useMemo(() => {
    const availableItems = filteredDataSource.filter((item) => !item.disabled);
    if (availableItems.length === 0) return false;
    const selectedCount = availableItems.filter((item) =>
      selectedKeys.includes(getItemKey(item, fieldNames))
    ).length;
    return selectedCount > 0 && selectedCount < availableItems.length;
  }, [filteredDataSource, selectedKeys, fieldNames]);

  // 全选/取消全选
  const handleCheckAll = useCallback(() => {
    if (disabled) return;
    const availableItems = filteredDataSource.filter((item) => !item.disabled);
    const availableKeys = availableItems.map((item) => getItemKey(item, fieldNames));

    if (isCheckedAll) {
      // 取消全选
      const newSelectedKeys = selectedKeys.filter(
        (key) => !availableKeys.includes(key)
      );
      if (direction === 'left') {
        onSelectChange(newSelectedKeys, targetSelectedKeys);
      } else {
        onSelectChange(sourceSelectedKeys, newSelectedKeys);
      }
    } else {
      // 全选
      const combined = [...selectedKeys, ...availableKeys];
      const newSelectedKeys = combined.filter((item, index) => combined.indexOf(item) === index);
      if (direction === 'left') {
        onSelectChange(newSelectedKeys, targetSelectedKeys);
      } else {
        onSelectChange(sourceSelectedKeys, newSelectedKeys);
      }
    }
  }, [disabled, filteredDataSource, selectedKeys, isCheckedAll, onSelectChange, fieldNames, direction, sourceSelectedKeys, targetSelectedKeys]);

  // 选中/取消单个项
  const handleCheckItem = useCallback(
    (item: TransferItem) => {
      if (disabled || item.disabled) return;

      const itemKey = getItemKey(item, fieldNames);
      const index = selectedKeys.indexOf(itemKey);
      let newSelectedKeys: string[];

      if (index > -1) {
        newSelectedKeys = [
          ...selectedKeys.slice(0, index),
          ...selectedKeys.slice(index + 1),
        ];
      } else {
        newSelectedKeys = [...selectedKeys, itemKey];
      }

      if (direction === 'left') {
        onSelectChange(newSelectedKeys, targetSelectedKeys);
      } else {
        onSelectChange(sourceSelectedKeys, newSelectedKeys);
      }
    },
    [disabled, selectedKeys, onSelectChange, fieldNames, direction, sourceSelectedKeys, targetSelectedKeys]
  );

  // 搜索框变化
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchValue(value);
    },
    []
  );

  // 触发搜索
  const triggerSearch = useCallback(() => {
    onSearch?.(searchValue);
  }, [onSearch, searchValue]);

  // 搜索框回车事件
  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        triggerSearch();
      }
    },
    [triggerSearch]
  );

  // 搜索按钮点击
  const handleSearchButtonClick = useCallback(() => {
    triggerSearch();
  }, [triggerSearch]);

  // 计数文本
  const countText = useMemo(() => {
    const selectedCount = selectedKeys.length;
    const totalCount = dataSource.length;
    return `${selectedCount}/${totalCount}`;
  }, [selectedKeys, dataSource]);

  // 渲染自定义 header
  const renderHeader = () => {
    if (header) {
      const headerContent = header({ direction, dataSource, selectedKeys, sourceSelectedKeys, targetSelectedKeys });
      if (headerContent === null) return null;
      return headerContent;
    }

    // 默认 header
    return (
      <TransferListHeader className="transfer-list-header">
        <TransferHeaderLeft>
          <TransferItemCheckbox
            className="transfer-checkbox"
            $checked={isCheckedAll}
            $indeterminate={isIndeterminate}
            $disabled={disabled || filteredDataSource.length === 0}
            onClick={handleCheckAll}
            style={{
              opacity: disabled || filteredDataSource.length === 0 ? 0.6 : 1,
            }}
          />
          <span>{title}</span>
        </TransferHeaderLeft>
        <TransferHeaderCount>{countText}</TransferHeaderCount>
      </TransferListHeader>
    );
  };

  // 渲染 body
  const renderBody = () => {
    if (body) {
      return body({
        direction,
        dataSource: filteredDataSource,
        selectedKeys,
        sourceSelectedKeys,
        targetSelectedKeys,
        onSelectChange,
      });
    }

    // 加载状态
    if (internalLoading) {
      return (
        <TransferLoading className="transfer-loading">
          {loadingRender ? loadingRender() : <TransferLoadingSpinner className="transfer-loading-spinner" />}
        </TransferLoading>
      );
    }

    // 默认 body
    return (
      <TransferListBody className="transfer-list-body">
        {filteredDataSource.length > 0 ? (
          filteredDataSource.map((item) => {
            const itemKey = getItemKey(item, fieldNames);
            const isSelected = selectedKeys.includes(itemKey);
            const customClassName = rowClassName?.(item) || '';

            return (
              <TransferListItem
                key={itemKey}
                className={`transfer-list-item ${customClassName}`}
                $selected={isSelected}
                $disabled={disabled || item.disabled}
                $styles={styles?.item}
                onClick={() => handleCheckItem(item)}
              >
                <TransferListItemCheckbox $checked={isSelected} />
                <TransferItemContent>
                  {render ? render(item) : getItemTitle(item, fieldNames)}
                </TransferItemContent>
              </TransferListItem>
            );
          })
        ) : (
          <TransferEmpty className="transfer-empty">暂无数据</TransferEmpty>
        )}
      </TransferListBody>
    );
  };

  return (
    <TransferListContainer
      className="transfer-list"
      $disabled={disabled}
      $styles={styles?.list}
      $height={listHeight}
      $width={listWidth}
    >
      {/* 头部 */}
      {renderHeader()}

      {/* 搜索框 - 只在有 header 且 showSearch 为 true 时显示 */}
      {showSearch && header !== null && (
        <TransferSearchWrapper className="transfer-search-wrapper">
          {search ? (
            search({
              direction,
              value: searchValue,
              onChange: (value) => {
                setSearchValue(value);
                onSearch?.(value);
              },
              disabled,
            })
          ) : (
            <>
              <TransferSearch
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                disabled={disabled}
                $styles={styles?.search}
              />
              <TransferSearchButton
                onClick={handleSearchButtonClick}
                disabled={disabled}
                $disabled={disabled}
                aria-label="搜索"
              >
                <Icon type="search" size="small" color={disabled ? '#bfbfbf' : '#1890ff'} />
              </TransferSearchButton>
            </>
          )}
        </TransferSearchWrapper>
      )}

      {/* 列表内容 */}
      {renderBody()}

      {/* 底部 */}
      {(description || footer) && (
        <TransferListFooter className="transfer-list-footer">
          {footer ? footer({ direction }) : description}
        </TransferListFooter>
      )}
    </TransferListContainer>
  );
};

/**
 * TransferOperation 组件 - 操作按钮区
 */
const TransferOperations: React.FC<TransferOperationProps> = ({
  moveToRightDisabled,
  moveToLeftDisabled,
  onMoveToRight,
  onMoveToLeft,
  style,
}) => {
  return (
    <TransferOperation className="transfer-operation" $styles={style}>
      <TransferOperationButton
        type="button"
        $direction="right"
        $disabled={moveToRightDisabled}
        onClick={onMoveToRight}
        disabled={moveToRightDisabled}
        aria-label="移动到右侧"
      />
      <TransferOperationButton
        type="button"
        $direction="left"
        $disabled={moveToLeftDisabled}
        onClick={onMoveToLeft}
        disabled={moveToLeftDisabled}
        aria-label="移动到左侧"
      />
    </TransferOperation>
  );
};

/**
 * Transfer 穿梭框组件
 *
 * @example
 * ```tsx
 * <Transfer
 *   dataSource={[
 *     { key: '1', title: '选项1' },
 *     { key: '2', title: '选项2' },
 *   ]}
 *   targetKeys={['1']}
 *   onChange={(targetKeys) => console.log(targetKeys)}
 * />
 * ```
 */
const Transfer: React.FC<TransferProps> = ({
  dataSource,
  fieldNames,
  targetKeys: targetKeysProp,
  defaultTargetKeys = [],
  selectedKeys: selectedKeysProp,
  defaultSelectedKeys = [],
  showSearch = false,
  disabled = false,
  leftTitle = '源列表',
  rightTitle = '目标列表',
  leftDescription,
  rightDescription,
  filterOption,
  styles,
  listHeight,
  listWidth,
  header,
  search,
  body,
  onSelectChange,
  onChange,
  onSearch,
  render,
  footer,
  rowClassName,
  mode = 'transfer',
  loading = false,
  loadingRender,
  loadingDelay,
}) => {
  // 判断是否为受控模式
  const isControlled = targetKeysProp !== undefined;
  const isSelectedControlled = selectedKeysProp !== undefined;

  // 内部状态
  const [internalTargetKeys, setInternalTargetKeys] =
    useState<string[]>(defaultTargetKeys);
  const [internalSourceSelectedKeys, setInternalSourceSelectedKeys] =
    useState<string[]>(defaultSelectedKeys);
  const [internalTargetSelectedKeys, setInternalTargetSelectedKeys] = useState<
    string[]
  >([]);

  // 使用外部状态或内部状态
  const targetKeys = isControlled ? targetKeysProp! : internalTargetKeys;
  const sourceSelectedKeys = isSelectedControlled
    ? selectedKeysProp!.filter((key) => !targetKeys.includes(key))
    : internalSourceSelectedKeys;
  const targetSelectedKeys = isSelectedControlled
    ? selectedKeysProp!.filter((key) => targetKeys.includes(key))
    : internalTargetSelectedKeys;

  // 源列表数据（未选中到右侧的）
  const sourceDataSource = useMemo(() => {
    return dataSource.filter((item) => !targetKeys.includes(getItemKey(item, fieldNames)));
  }, [dataSource, targetKeys, fieldNames]);

  // 目标列表数据（已选中到右侧的）
  const targetDataSource = useMemo(() => {
    return dataSource.filter((item) => targetKeys.includes(getItemKey(item, fieldNames)));
  }, [dataSource, targetKeys, fieldNames]);

  // 处理源列表选中变化
  const handleSourceSelectChange = useCallback(
    (sourceKeys: string[], targetKeys: string[]) => {
      if (!isSelectedControlled) {
        setInternalSourceSelectedKeys(sourceKeys);
      }
      onSelectChange?.(sourceKeys, targetKeys);
    },
    [isSelectedControlled, onSelectChange]
  );

  // 处理目标列表选中变化
  const handleTargetSelectChange = useCallback(
    (sourceKeys: string[], targetKeys: string[]) => {
      if (!isSelectedControlled) {
        setInternalTargetSelectedKeys(targetKeys);
      }
      onSelectChange?.(sourceKeys, targetKeys);
    },
    [isSelectedControlled, onSelectChange]
  );

  // 移动到右侧
  const handleMoveToRight = useCallback(() => {
    if (sourceSelectedKeys.length === 0) return;

    const newTargetKeys = [...targetKeys, ...sourceSelectedKeys];
    const movedKeys = [...sourceSelectedKeys];

    if (!isControlled) {
      setInternalTargetKeys(newTargetKeys);
      setInternalSourceSelectedKeys([]);
    }

    // 触发 onChange 回调，传入最新的 targetKeys
    onChange?.(newTargetKeys, 'right', movedKeys);
  }, [
    sourceSelectedKeys,
    targetKeys,
    isControlled,
    onChange,
  ]);

  // 移动到左侧
  const handleMoveToLeft = useCallback(() => {
    if (targetSelectedKeys.length === 0) return;

    const newTargetKeys = targetKeys.filter(
      (key) => !targetSelectedKeys.includes(key)
    );
    const movedKeys = [...targetSelectedKeys];

    if (!isControlled) {
      setInternalTargetKeys(newTargetKeys);
      setInternalTargetSelectedKeys([]);
    }

    // 触发 onChange 回调，传入最新的 targetKeys
    onChange?.(newTargetKeys, 'left', movedKeys);
  }, [
    targetSelectedKeys,
    targetKeys,
    isControlled,
    onChange,
  ]);

  // 搜索回调
  const handleSourceSearch = useCallback(
    (value: string) => {
      onSearch?.('left', value);
    },
    [onSearch]
  );

  const handleTargetSearch = useCallback(
    (value: string) => {
      onSearch?.('right', value);
    },
    [onSearch]
  );

  // 操作按钮禁用状态
  const moveToRightDisabled = disabled || sourceSelectedKeys.length === 0;
  const moveToLeftDisabled = disabled || targetSelectedKeys.length === 0;

  // 单栏模式：选中项直接作为 targetKeys
  // 注意：单栏模式下所有选中项都在左侧列表，selectedKeys 就是 targetKeys
  const handleSingleSelectChange = useCallback(
    (sourceKeys: string[], _targetKeys: string[]) => {
      // 单栏模式下 sourceKeys 实际上是当前选中的 keys（因为它们在左侧面板被选中）
      const selectedTargetKeys = sourceKeys;
      if (!isControlled) {
        setInternalTargetKeys(selectedTargetKeys);
      }
      onChange?.(selectedTargetKeys, 'right', selectedTargetKeys);
      onSelectChange?.([], selectedTargetKeys);
    },
    [isControlled, onChange, onSelectChange]
  );

  // 单栏模式下的列表数据（全部数据）
  const singleDataSource = useMemo(() => {
    return dataSource;
  }, [dataSource]);

  // 单栏模式下的选中 keys
  const singleSelectedKeys = useMemo(() => {
    return isSelectedControlled
      ? selectedKeysProp!.filter((key) => targetKeys.includes(key))
      : targetKeys;
  }, [isSelectedControlled, selectedKeysProp, targetKeys]);

  return (
    <TransferWrapper className="transfer-wrapper" $styles={styles?.wrapper}>
      {mode === 'single' ? (
        // 单栏模式
        <TransferList
          direction="left"
          dataSource={singleDataSource}
          fieldNames={fieldNames}
          selectedKeys={singleSelectedKeys}
          showSearch={showSearch}
          disabled={disabled}
          title={leftTitle}
          description={leftDescription}
          filterOption={filterOption}
          styles={styles}
          listHeight={listHeight}
          listWidth={listWidth}
          header={header}
          search={search}
          body={body}
          onSelectChange={handleSingleSelectChange}
          onSearch={handleSourceSearch}
          render={render}
          footer={footer}
          rowClassName={rowClassName}
          loading={loading}
          loadingRender={loadingRender}
          loadingDelay={loadingDelay}
          sourceSelectedKeys={[]}
          targetSelectedKeys={singleSelectedKeys}
        />
      ) : (
        <>
          {/* 左侧列表 */}
          <TransferList
            direction="left"
            dataSource={sourceDataSource}
            fieldNames={fieldNames}
            selectedKeys={sourceSelectedKeys}
            showSearch={showSearch}
            disabled={disabled}
            title={leftTitle}
            description={leftDescription}
            filterOption={filterOption}
            styles={styles}
            listHeight={listHeight}
            listWidth={listWidth}
            header={header}
            search={search}
            body={body}
            onSelectChange={handleSourceSelectChange}
            onSearch={handleSourceSearch}
            render={render}
            footer={footer}
            rowClassName={rowClassName}
            loading={loading}
            loadingRender={loadingRender}
            loadingDelay={loadingDelay}
            sourceSelectedKeys={sourceSelectedKeys}
            targetSelectedKeys={targetSelectedKeys}
          />

          {/* 操作按钮 */}
          <TransferOperations
            moveToRightDisabled={moveToRightDisabled}
            moveToLeftDisabled={moveToLeftDisabled}
            onMoveToRight={handleMoveToRight}
            onMoveToLeft={handleMoveToLeft}
            style={styles?.operation}
          />

          {/* 右侧列表 */}
          <TransferList
            direction="right"
            dataSource={targetDataSource}
            fieldNames={fieldNames}
            selectedKeys={targetSelectedKeys}
            showSearch={showSearch}
            disabled={disabled}
            title={rightTitle}
            description={rightDescription}
            filterOption={filterOption}
            styles={styles}
            listHeight={listHeight}
            listWidth={listWidth}
            header={header}
            search={search}
            body={body}
            onSelectChange={handleTargetSelectChange}
            onSearch={handleTargetSearch}
            render={render}
            footer={footer}
            rowClassName={rowClassName}
            loading={loading}
            loadingRender={loadingRender}
            loadingDelay={loadingDelay}
            sourceSelectedKeys={sourceSelectedKeys}
            targetSelectedKeys={targetSelectedKeys}
          />
        </>
      )}
    </TransferWrapper>
  );
};

export default Transfer;
export type {
  TransferProps,
  TransferItem,
  TransferListProps,
  TransferOperationProps,
};
