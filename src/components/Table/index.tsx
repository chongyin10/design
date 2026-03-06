'use client';

import React, { useState, useEffect, useRef, useMemo, ReactNode } from 'react';
import classNames from 'classnames';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Empty from '../Empty';
import Pagination from '../Pagination';
import Tooltip from '../Tooltip';
import Icon from '../Icon';
import Checkbox from '../Checkbox';
import Radio from '../Radio';
import SortableRow from './SortableRow';
import './Table.css';

export interface Column {
    key?: string;
    dataIndex?: string;
    title?: ReactNode;
    width?: number | string;
    align?: 'left' | 'center' | 'right';
    fixed?: boolean | 'start' | 'end';
    /** 限制单元格内容显示的最大行数，超出时显示省略号 */
    maxLines?: number;
    /** 是否显示提示气泡框 */
    tooltip?: boolean;
    /** 是否可编辑 */
    editable?: boolean;
    /** 编辑完成时的回调 */
    onSave?: (record: any, value: any) => void;
    render?: (value: any, record: any, index: number) => ReactNode;
    [key: string]: any;
}

export interface PaginationProps {
    pageSize?: number;
    total?: number;
    current?: number;
    onChange?: (page: number, pageSize: number) => void;
    [key: string]: any;
}

export interface RowSelection {
    /** 行选择类型，默认不显示选择列 */
    type?: false | 'checkbox' | 'radio';
    /** 已选中的行键值（受控） */
    selectedRowKeys?: (string | number)[];
    /** 默认选中的行键值（非受控） */
    defaultSelectedRowKeys?: (string | number)[];
    /** 选中变化时的回调 */
    onChange?: (selectedRowKeys: (string | number)[], selectedRows: any[]) => void;
    /** 获取行禁用状态的函数 */
    getCheckboxProps?: (record: any, index: number) => { disabled?: boolean };
    /** 行选择列宽度 */
    columnWidth?: number | string;
    /** 行选择列标题 */
    columnTitle?: ReactNode;
}

export interface TableProps {
    dataSource?: any[];
    columns?: Column[];
    bordered?: boolean;
    scroll?: {
        x?: number | string;
        y?: number | string;
    };
    rowKey?: string | ((record: any, index: number) => string | number);
    className?: string;
    pagination?: PaginationProps | false;
    /** 自定义空状态组件 */
    empty?: ReactNode;
    /** 加载状态 */
    loading?: boolean;
    /** 自定义加载提示文案 */
    loadingText?: ReactNode;
    /** 加载延迟时间（毫秒），设置后loading状态会在指定时间后自动取消 */
    loadingDelay?: number;
    /** 是否开启行拖拽功能 */
    draggable?: boolean;
    /** 拖拽结束时的回调函数，返回新的数据顺序 */
    onDragEnd?: (newData: any[]) => void;
    /** 行选择配置 */
    rowSelection?: RowSelection;
}

const Table = ({
    dataSource = [],
    columns = [],
    bordered = false,
    scroll = {},
    rowKey = 'key',
    className = '',
    pagination,
    empty,
    loading = false,
    loadingText = '加载中...',
    loadingDelay,
    draggable = false,
    onDragEnd,
    rowSelection,
}: TableProps) => {
    const [fixedLeftColumns, setFixedLeftColumns] = useState<Column[]>([]);
    const [fixedRightColumns, setFixedRightColumns] = useState<Column[]>([]);
    const [normalColumns, setNormalColumns] = useState<Column[]>([]);
    const [columnWidths, setColumnWidths] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [internalLoading, setInternalLoading] = useState(loading);
    const [internalDataSource, setInternalDataSource] = useState(dataSource);
    const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const tableRef = useRef<HTMLDivElement>(null);
    const headerInnerRef = useRef<HTMLDivElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);
    const scrollSyncFrameRef = useRef<number | null>(null);
    const lastScrollLeftRef = useRef<number>(0);
    const isScrollingRef = useRef<boolean>(false);
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const scrollLeftRef = useRef<number>(0);

    // 编辑状态
    const [editingCell, setEditingCell] = useState<{ rowIndex: number; colKey: string } | null>(null);
    const [editingValue, setEditingValue] = useState('');

    // 行选择状态
    const rowSelectionType = rowSelection?.type;
    const isRowSelectionEnabled = rowSelectionType === 'checkbox' || rowSelectionType === 'radio';
    const [internalSelectedRowKeys, setInternalSelectedRowKeys] = useState<(string | number)[]>(
        rowSelection?.defaultSelectedRowKeys || []
    );

    // 受控与非受控的选择状态
    const selectedRowKeys = rowSelection?.selectedRowKeys !== undefined
        ? rowSelection.selectedRowKeys
        : internalSelectedRowKeys;

    // 同步外部数据源的变化
    useEffect(() => {
        setInternalDataSource(dataSource);
    }, [dataSource]);

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

    useEffect(() => {
        if (pagination && typeof pagination === 'object') {
            if (pagination.current !== undefined) setCurrentPage(pagination.current);
            if (pagination.pageSize !== undefined) setPageSize(pagination.pageSize);
        }
    }, [pagination && typeof pagination === 'object' ? pagination.current : undefined, pagination && typeof pagination === 'object' ? pagination.pageSize : undefined]);

    // 清理 requestAnimationFrame 和 timeout
    useEffect(() => {
        return () => {
            if (scrollSyncFrameRef.current) {
                cancelAnimationFrame(scrollSyncFrameRef.current);
            }
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);

    const getColumnWidth = (width: number | string | undefined): number => {
        if (!width) return 0;
        return typeof width === 'number' ? width : parseInt(width, 10) || 0;
    };

    // 处理列固定
    useEffect(() => {
        const leftCols: Column[] = [];
        const rightCols: Column[] = [];
        const normalCols: Column[] = [];
        const widths: number[] = [];

        columns.forEach((col, index) => {
            const colWidth = getColumnWidth(col.width);
            widths[index] = colWidth;
            const columnWithIndex = { ...col, _index: index };
            if (col.fixed === 'start' || col.fixed === true) {
                leftCols.push(columnWithIndex);
            } else if (col.fixed === 'end') {
                rightCols.push(columnWithIndex);
            } else {
                normalCols.push(columnWithIndex);
            }
        });

        setFixedLeftColumns(leftCols);
        setFixedRightColumns(rightCols);
        setNormalColumns(normalCols);
        setColumnWidths(widths);
        
        // 初始化固定列位置 - 延迟执行以确保DOM已更新
        requestAnimationFrame(() => {
            updateFixedColumnsPosition.current(0);
        });
    }, [columns]);

    // 更新固定列位置的函数 - 使用useCallback避免重复创建
    const updateFixedColumnsPosition = useRef((newScrollLeft: number) => {
        if (!tableRef.current) return;
        
        // 查找所有固定列元素
        const fixedCells = tableRef.current.querySelectorAll('.custom-table th[style*="sticky"], .custom-table td[style*="sticky"]');
        
        fixedCells.forEach((cell) => {
            const element = cell as HTMLElement;
            const style = window.getComputedStyle(element);
            const left = style.left;
            const right = style.right;
            
            // 判断是左侧固定列还是右侧固定列
            if (left !== 'auto' && left !== '0px') {
                // 左侧固定列，应用正向transform
                element.style.transform = `translateX(${newScrollLeft}px)`;
            } else if (right !== 'auto' && right !== '0px') {
                // 右侧固定列，应用反向transform
                element.style.transform = `translateX(${-newScrollLeft}px)`;
            }
        });
    });

    // 同步表头和表体的滚动 - 使用 requestAnimationFrame 防抖优化
    const syncScroll = (_source: HTMLDivElement, target: HTMLDivElement, newScrollLeft: number) => {
        if (scrollSyncFrameRef.current) {
            cancelAnimationFrame(scrollSyncFrameRef.current);
        }
        scrollSyncFrameRef.current = requestAnimationFrame(() => {
            if (target && target.scrollLeft !== newScrollLeft) {
                // 直接设置scrollLeft，避免触发滚动事件
                target.scrollLeft = newScrollLeft;
            }
            // 更新固定列位置
            updateFixedColumnsPosition.current(newScrollLeft);
            scrollSyncFrameRef.current = null;
        });
    };

    const handleBodyScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (headerInnerRef.current && bodyRef.current) {
            const target = e.target as HTMLDivElement;
            // 只有当滚动的是body区域时才同步到header
            if (target === bodyRef.current) {
                const newScrollLeft = target.scrollLeft;
                
                // 标记正在滚动
                isScrollingRef.current = true;
                
                // 清除之前的timeout
                if (scrollTimeoutRef.current) {
                    clearTimeout(scrollTimeoutRef.current);
                }
                
                // 设置滚动结束的timeout
                scrollTimeoutRef.current = setTimeout(() => {
                    isScrollingRef.current = false;
                }, 150);
                
                // 过滤掉微小的滚动变化，减少抖动
                if (Math.abs(newScrollLeft - lastScrollLeftRef.current) > 0.5) {
                    lastScrollLeftRef.current = newScrollLeft;
                    scrollLeftRef.current = newScrollLeft;
                    syncScroll(bodyRef.current, headerInnerRef.current, newScrollLeft);
                }
            }
        }
    };

    const handleHeaderScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (headerInnerRef.current && bodyRef.current) {
            const target = e.target as HTMLDivElement;
            if (target === headerInnerRef.current) {
                const newScrollLeft = target.scrollLeft;
                
                // 标记正在滚动
                isScrollingRef.current = true;
                
                // 清除之前的timeout
                if (scrollTimeoutRef.current) {
                    clearTimeout(scrollTimeoutRef.current);
                }
                
                // 设置滚动结束的timeout
                scrollTimeoutRef.current = setTimeout(() => {
                    isScrollingRef.current = false;
                }, 150);
                
                // 过滤掉微小的滚动变化，减少抖动
                if (Math.abs(newScrollLeft - lastScrollLeftRef.current) > 0.5) {
                    lastScrollLeftRef.current = newScrollLeft;
                    scrollLeftRef.current = newScrollLeft;
                    syncScroll(headerInnerRef.current, bodyRef.current, newScrollLeft);
                }
            }
        }
    };

    // 分页处理
    const handlePageChange = (page: number, newPageSize: number) => {
        const newSize = newPageSize || pageSize;
        // 如果 pageSize 改变了，重置到第 1 页
        const newPage = newSize !== pageSize ? 1 : page;
        setCurrentPage(newPage);
        setPageSize(newSize);
        if (pagination && typeof pagination.onChange === 'function') {
            // 确保调用与Pagination组件的onChange签名兼容
            (pagination.onChange as (current: number, pageSize?: number) => void)(newPage, newPageSize);
        }
    };

    const getPaginationData = (cp: number = currentPage, ps: number = pageSize) => {
        if (pagination === false) {
            return null;
        }
        const total = pagination?.total !== undefined ? pagination.total : internalDataSource.length;
        // 确保当前页码不超过总页数
        const totalPages = Math.ceil(total / ps) || 1;
        const validCurrent = Math.min(cp, totalPages);
        
        // 判断是否为后端分页模式
        // 只有当提供了 pagination.total 时才认为是后端分页
        const isBackendPagination = pagination?.total !== undefined;

        let pagedData: any[];
        if (isBackendPagination) {
            // 后端分页：直接使用 dataSource（后端已分页）
            pagedData = internalDataSource;
        } else {
            // 前端分页：对 dataSource 进行切片
            const start = (validCurrent - 1) * ps;
            const end = start + ps;
            pagedData = internalDataSource.slice(start, end);
        }

        return {
            data: pagedData,
            total,
            pageSize: ps,
            current: validCurrent,
            totalPages
        };
    };

    // 获取行键值
    const getRowKey = (record: any, index: number): string | number => {
        if (typeof rowKey === 'function') {
            return rowKey(record, index);
        }
        return record[rowKey] || index;
    };

    // 获取当前页所有可选行的键值
    const getPageSelectableKeys = () => {
        const paginationData = getPaginationData();
        const displayData = paginationData ? paginationData.data : internalDataSource;
        return displayData
            .map((record, index) => {
                const key = getRowKey(record, index);
                const checkboxProps = rowSelection?.getCheckboxProps?.(record, index);
                return { key, disabled: checkboxProps?.disabled };
            })
            .filter(item => !item.disabled)
            .map(item => item.key);
    };

    // 检查当前页是否全部选中
    const isPageAllSelected = () => {
        const selectableKeys = getPageSelectableKeys();
        if (selectableKeys.length === 0) return false;
        return selectableKeys.every(key => selectedRowKeys.includes(key));
    };

    // 检查当前页是否有部分选中
    const isPageIndeterminate = () => {
        const selectableKeys = getPageSelectableKeys();
        if (selectableKeys.length === 0) return false;
        const selectedCount = selectableKeys.filter(key => selectedRowKeys.includes(key)).length;
        return selectedCount > 0 && selectedCount < selectableKeys.length;
    };

    // 处理行选择
    const handleRowSelect = (record: any, index: number, checked: boolean) => {
        const key = getRowKey(record, index);
        let newSelectedKeys: (string | number)[];
        let newSelectedRows: any[];

        if (rowSelectionType === 'radio') {
            // 单选模式
            newSelectedKeys = checked ? [key] : [];
        } else {
            // 多选模式
            if (checked) {
                newSelectedKeys = [...selectedRowKeys, key];
            } else {
                newSelectedKeys = selectedRowKeys.filter(k => k !== key);
            }
        }

        // 获取选中的行数据
        newSelectedRows = internalDataSource.filter(item => {
            const itemKey = typeof rowKey === 'function'
                ? rowKey(item, internalDataSource.indexOf(item))
                : item[rowKey];
            return newSelectedKeys.includes(itemKey);
        });

        // 更新内部状态
        setInternalSelectedRowKeys(newSelectedKeys);

        // 触发回调
        rowSelection?.onChange?.(newSelectedKeys, newSelectedRows);
    };

    // 处理全选/取消全选
    const handleSelectAll = (checked: boolean) => {
        const paginationData = getPaginationData();
        const displayData = paginationData ? paginationData.data : internalDataSource;

        if (checked) {
            // 选中当前页所有可选行
            const newKeys = displayData
                .map((record, index) => {
                    const key = getRowKey(record, index);
                    const checkboxProps = rowSelection?.getCheckboxProps?.(record, index);
                    return { key, disabled: checkboxProps?.disabled };
                })
                .filter(item => !item.disabled)
                .map(item => item.key);

            // 合并已选中的其他页数据
            const otherKeys = selectedRowKeys.filter(key =>
                !displayData.some((record, index) => getRowKey(record, index) === key)
            );

            const newSelectedKeys = [...otherKeys, ...newKeys];
            const newSelectedRows = internalDataSource.filter(item => {
                const itemKey = typeof rowKey === 'function'
                    ? rowKey(item, internalDataSource.indexOf(item))
                    : item[rowKey];
                return newSelectedKeys.includes(itemKey);
            });

            setInternalSelectedRowKeys(newSelectedKeys);
            rowSelection?.onChange?.(newSelectedKeys, newSelectedRows);
        } else {
            // 取消选中当前页所有行
            const pageKeys = displayData.map((record, index) => getRowKey(record, index));
            const newSelectedKeys = selectedRowKeys.filter(key => !pageKeys.includes(key));
            const newSelectedRows = internalDataSource.filter(item => {
                const itemKey = typeof rowKey === 'function'
                    ? rowKey(item, internalDataSource.indexOf(item))
                    : item[rowKey];
                return newSelectedKeys.includes(itemKey);
            });

            setInternalSelectedRowKeys(newSelectedKeys);
            rowSelection?.onChange?.(newSelectedKeys, newSelectedRows);
        }
    };

    // 渲染选择列表头
    const renderSelectionHeader = () => {
        const style: React.CSSProperties = {
            width: rowSelection?.columnWidth || '50px',
            textAlign: 'center',
            backgroundColor: '#fafafa !important',
            top: 0,
        };

        return (
            <th key="zjpcy-table-selection-header" style={style}>
                {rowSelectionType === 'checkbox' ? (
                    <Checkbox
                        checked={isPageAllSelected()}
                        indeterminate={isPageIndeterminate()}
                        onChange={(checked) => handleSelectAll(checked)}
                    />
                ) : (
                    rowSelection?.columnTitle || ''
                )}
            </th>
        );
    };

    // 渲染表头单元格
    const renderHeaderCell = (column: Column, index: number, colGroup: Column[], isSelectionColumn = false) => {
        // 处理行选择列
        if (isSelectionColumn) {
            return renderSelectionHeader();
        }

        const style: React.CSSProperties = {
            width: column.width || 'auto',
            textAlign: column.align || 'left',
            backgroundColor: '#fafafa !important',
            top: 0,
        };

        if (column.fixed === 'start' || column.fixed === true) {
            style.position = 'sticky';
            // 计算左侧固定列的累积宽度（考虑行选择列）
            let leftOffset = 0;
            if (isRowSelectionEnabled) {
                leftOffset += getColumnWidth(rowSelection?.columnWidth || '50px');
            }
            for (let i = 0; i < index; i++) {
                leftOffset += columnWidths[i] || 0;
            }
            style.left = `${leftOffset}px`;
            style.zIndex = 10;
        } else if (column.fixed === 'end') {
            style.position = 'sticky';
            // 计算右侧固定列的累积宽度
            let rightOffset = 0;
            for (let i = colGroup.length - 1; i > index; i--) {
                rightOffset += columnWidths[i] || 0;
            }
            style.right = `${rightOffset}px`;
            style.zIndex = 10;
        }

        return (
            <th key={column.key || column.dataIndex || column._index} style={style}>
                {column.title || ''}
            </th>
        );
    };

    // 从 React 节点中提取文本内容
    const extractTextFromReactNode = (node: any): string => {
        if (node === null || node === undefined) return '';
        if (typeof node === 'string') return node;
        if (typeof node === 'number') return String(node);
        if (typeof node === 'boolean') return '';
        if (Array.isArray(node)) {
            return node.map(extractTextFromReactNode).join('');
        }
        // 处理普通对象（非 React 元素）
        if (typeof node === 'object' && !React.isValidElement(node)) {
            // 如果对象有 name 属性，返回 name
            if (node.name !== undefined) {
                return String(node.name);
            }
            // 如果对象有 label 或 title 属性
            if (node.label !== undefined) {
                return String(node.label);
            }
            if (node.title !== undefined) {
                return String(node.title);
            }
            // 如果对象有 value 属性
            if (node.value !== undefined) {
                return String(node.value);
            }
            // 如果对象有 text 属性
            if (node.text !== undefined) {
                return String(node.text);
            }
            // 尝试转换为 JSON 字符串
            try {
                return JSON.stringify(node);
            } catch {
                return '';
            }
        }
        // 处理 React 元素
        if (React.isValidElement(node)) {
            const props = node.props as any;
            if (props.children) {
                return extractTextFromReactNode(props.children);
            }
            // 如果没有 children，尝试其他常见属性
            if (props.title !== undefined) {
                return String(props.title);
            }
            if (props.label !== undefined) {
                return String(props.label);
            }
            if (props.value !== undefined) {
                return String(props.value);
            }
            if (props.alt !== undefined) {
                return String(props.alt);
            }
        }
        return '';
    };

    // 开始编辑
    const handleEdit = (rowIndex: number, colKey: string, value: any) => {
        setEditingCell({ rowIndex, colKey });
        setEditingValue(String(value || ''));
    };

    // 保存编辑
    const handleSave = (record: any, column: Column) => {
        if (column.onSave) {
            column.onSave(record, editingValue);
        }
        setEditingCell(null);
        setEditingValue('');
    };

    // 取消编辑
    const handleCancel = () => {
        setEditingCell(null);
        setEditingValue('');
    };

    // 渲染选择列单元格
    const renderSelectionCell = (record: any, rowIndex: number) => {
        const key = getRowKey(record, rowIndex);
        const isSelected = selectedRowKeys.includes(key);
        const checkboxProps = rowSelection?.getCheckboxProps?.(record, rowIndex);
        const isDisabled = checkboxProps?.disabled || false;

        const style: React.CSSProperties = {
            width: rowSelection?.columnWidth || '50px',
            textAlign: 'center',
            backgroundColor: 'white',
        };

        return (
            <td key={`zjpcy-table-selection-${key}`} style={style}>
                {rowSelectionType === 'checkbox' ? (
                    <Checkbox
                        checked={isSelected}
                        disabled={isDisabled}
                        onChange={(checked) => handleRowSelect(record, rowIndex, checked)}
                    />
                ) : (
                    <Radio
                        checked={isSelected}
                        disabled={isDisabled}
                        onChange={() => handleRowSelect(record, rowIndex, !isSelected)}
                    />
                )}
            </td>
        );
    };

    // 渲染表格单元格
    const renderTableCell = (column: Column, record: any, rowIndex: number, colIndex: number, colGroup: Column[], isSelectionColumn = false) => {
        // 处理行选择列
        if (isSelectionColumn) {
            return renderSelectionCell(record, rowIndex);
        }

        const style: React.CSSProperties = {
            width: column.width || 'auto',
            textAlign: column.align || 'left',
            backgroundColor: 'white',
        };

        if (column.fixed === 'start' || column.fixed === true) {
            style.position = 'sticky';
            // 计算左侧固定列的累积宽度（考虑行选择列）
            let leftOffset = 0;
            if (isRowSelectionEnabled) {
                leftOffset += getColumnWidth(rowSelection?.columnWidth || '50px');
            }
            for (let i = 0; i < colIndex; i++) {
                leftOffset += columnWidths[i] || 0;
            }
            style.left = `${leftOffset}px`;
            style.zIndex = 5;
        } else if (column.fixed === 'end') {
            style.position = 'sticky';
            // 计算右侧固定列的累积宽度
            let rightOffset = 0;
            for (let i = colGroup.length - 1; i > colIndex; i--) {
                rightOffset += columnWidths[i] || 0;
            }
            style.right = `${rightOffset}px`;
            style.zIndex = 5;
        }

        const lastFixedLeftIndex = fixedLeftColumns.length ? fixedLeftColumns.length - 1 : -1;
        const firstFixedRightIndex = fixedRightColumns.length ? fixedLeftColumns.length + normalColumns.length : -1;
        const shouldShowLeftShadow = (column.fixed === 'start' || column.fixed === true) && colIndex === lastFixedLeftIndex;
        const shouldShowRightShadow = column.fixed === 'end' && colIndex === firstFixedRightIndex;

        // 判断是否处于编辑状态
        const colKey = column.key || column.dataIndex || column._index;
        const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.colKey === String(colKey);

        let content = column.dataIndex ? record[column.dataIndex] : null;

        if (column.render) {
            content = column.render(content, record, rowIndex);
        }

        // 处理内容：确保不是对象类型
        let safeContent: React.ReactNode = content;
        if (content !== null && typeof content === 'object' && !React.isValidElement(content)) {
            // 如果内容是普通对象，尝试提取可显示的内容
            if (content.name !== undefined) {
                safeContent = String(content.name);
            } else if (content.label !== undefined) {
                safeContent = String(content.label);
            } else if (content.title !== undefined) {
                safeContent = String(content.title);
            } else {
                // 其他对象类型，转为 JSON 字符串
                try {
                    safeContent = JSON.stringify(content);
                } catch {
                    safeContent = '';
                }
            }
        }

        // 处理 maxLines 属性
        const shouldApplyMaxLines = column.maxLines && column.maxLines > 0;

        // 处理 tooltip 属性
        let tooltipTitle = '';
        if (column.tooltip && !isEditing) {
            tooltipTitle = extractTextFromReactNode(safeContent);
            // 获取原始数据作为 tooltip（优先使用原始数据）
            if (!tooltipTitle && column.dataIndex) {
                const rawValue = record[column.dataIndex];
                tooltipTitle = typeof rawValue === 'object' ? extractTextFromReactNode(rawValue) : String(rawValue || '');
            }
        }

        // 编辑模式
        if (column.editable && isEditing) {
            return (
                <td
                    key={column.key || column.dataIndex || column._index}
                    style={style}
                    className={`${shouldShowLeftShadow ? 'zjpcy-table-fixed-left-shadow' : ''}${shouldShowRightShadow ? ' zjpcy-table-fixed-right-shadow' : ''}`}
                >
                    <div className="zjpcy-table-edit-cell" onClick={(e) => e.stopPropagation()}>
                        <input
                            type="text"
                            className="zjpcy-table-edit-input"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                        />
                        <div className="zjpcy-table-edit-actions">
                            <span
                                className="zjpcy-table-edit-icon zjpcy-edit-submit"
                                onClick={() => handleSave(record, column)}
                                title="保存"
                            >
                                <Icon type="check" size={24} color="#339af0" />
                            </span>
                            <span
                                className="zjpcy-table-edit-icon zjpcy-edit-cancel"
                                onClick={handleCancel}
                                title="取消"
                            >
                                <Icon type="close" size={24} color="#339af0" />
                            </span>
                        </div>
                    </div>
                </td>
            );
        }

        // 非编辑模式
        const cellContent = shouldApplyMaxLines ? (
            <div className="zjpcy-table-cell-ellipsis" style={{ WebkitLineClamp: column.maxLines }}>
                {safeContent}
            </div>
        ) : safeContent;

        // 如果有 tooltip，用 Tooltip 包裹
        // 注意：Tooltip 的 children 必须是 ReactElement，所以需要包裹在 span 中
        // delay={0} 表示鼠标移入立即显示，无延迟
        const finalContent = tooltipTitle ? (
            <Tooltip title={tooltipTitle} placement="top" delay={0}>
                <span className="zjpcy-table-cell-tooltip-wrapper">{cellContent}</span>
            </Tooltip>
        ) : cellContent;

        return (
            <td
                key={column.key || column.dataIndex || column._index}
                style={style}
                onClick={column.editable ? () => handleEdit(rowIndex, String(colKey), content) : undefined}
                className={`${shouldShowLeftShadow ? 'zjpcy-table-fixed-left-shadow' : ''}${shouldShowRightShadow ? ' zjpcy-table-fixed-right-shadow' : ''}${shouldApplyMaxLines ? ' zjpcy-table-cell-has-ellipsis' : ''}${column.editable ? ' zjpcy-table-editable-cell' : ''}`}
            >
                {finalContent}
                {column.editable && (
                    <span className="zjpcy-table-edit-icon-wrapper">
                        <Icon type="edit" size={16} color="#339af0" />
                    </span>
                )}
            </td>
        );
    };

    // DnD 传感器配置
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // 处理拖拽结束
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const paginationData = getPaginationData();
            const displayData = paginationData ? paginationData.data : internalDataSource;
            
            const oldIndex = displayData.findIndex(
                (item, index) => String(getRowKey(item, index)) === String(active.id)
            );
            const newIndex = displayData.findIndex(
                (item, index) => String(getRowKey(item, index)) === String(over.id)
            );

            if (oldIndex !== -1 && newIndex !== -1) {
                const newData = arrayMove(displayData, oldIndex, newIndex);
                
                // 如果是前端分页，需要更新整个数据源
                if (paginationData && pagination && typeof pagination === 'object' && pagination.total === undefined) {
                    const start = (paginationData.current - 1) * paginationData.pageSize;
                    const updatedDataSource = [...internalDataSource];
                    newData.forEach((item, index) => {
                        updatedDataSource[start + index] = item;
                    });
                    setInternalDataSource(updatedDataSource);
                    if (onDragEnd) {
                        onDragEnd(updatedDataSource);
                    }
                } else {
                    // 后端分页或无分页
                    setInternalDataSource(newData);
                    if (onDragEnd) {
                        onDragEnd(newData);
                    }
                }
            }
        }
    };

    const tableStyle: React.CSSProperties = {
        width: scroll.x ? (typeof scroll.x === 'number' ? `${scroll.x}px` : scroll.x) : '100%',
    };

    const bodyStyle: React.CSSProperties = {
        maxHeight: scroll.y ? (typeof scroll.y === 'number' ? `${scroll.y}px` : scroll.y) : 'auto',
        overflowY: scroll.y ? 'auto' : 'visible',
        overflowX: scroll.x ? 'auto' : 'visible',
    };

    const allColumns = [...fixedLeftColumns, ...normalColumns, ...fixedRightColumns];
    
    // 使用 useMemo 缓存 paginationData，避免每次渲染重新计算
    const paginationData = useMemo(() => getPaginationData(), [
        internalDataSource,
        pagination,
        pageSize,
        currentPage
    ]);
    const displayData = paginationData ? paginationData.data : internalDataSource;

    const renderPagination = () => {
        if (pagination === false || !paginationData) {
            return null;
        }

        const { total, current: paginationCurrent, pageSize: paginationPageSize } = paginationData;

        // 从 pagination 中解构出会与内部状态冲突的属性
        const { onChange: _, pageSize: __, current: ___, ...restPagination } = pagination || {};

        return (
            <div className="custom-table-pagination-wrapper">
                <Pagination
                    total={total}
                    current={paginationCurrent}
                    pageSize={paginationPageSize}
                    onChange={handlePageChange}
                    showTotal={(totalValue: number, range: [number, number]) => `第 ${range[0]}-${range[1]} 条，共 ${totalValue} 条`}
                    showSizeChanger={true}
                    showQuickJumper={true}
                    align="flex-end"
                    {...restPagination}
                />
            </div>
        );
    };

    // 渲染表格行
    const renderTableRows = () => {
        if (draggable) {
            return displayData.map((record, rowIndex) => (
                <SortableRow
                    key={getRowKey(record, rowIndex)}
                    id={String(getRowKey(record, rowIndex))}
                    record={record}
                    rowIndex={rowIndex}
                    columns={columns}
                    columnWidths={columnWidths}
                    fixedLeftColumns={fixedLeftColumns}
                    fixedRightColumns={fixedRightColumns}
                    normalColumns={normalColumns}
                    allColumns={allColumns}
                    editingCell={editingCell}
                    editingValue={editingValue}
                    handleEdit={handleEdit}
                    handleSave={handleSave}
                    handleCancel={handleCancel}
                    setEditingValue={setEditingValue}
                    renderTableCell={renderTableCell}
                    isRowSelectionEnabled={isRowSelectionEnabled}
                    rowSelection={rowSelection}
                    selectedRowKeys={selectedRowKeys}
                    handleRowSelect={handleRowSelect}
                />
            ));
        }

        return displayData.map((record, rowIndex) => (
            <tr key={getRowKey(record, rowIndex)}>
                {isRowSelectionEnabled && renderSelectionCell(record, rowIndex)}
                {allColumns.map((column, colIndex) =>
                    renderTableCell(column, record, rowIndex, colIndex, allColumns)
                )}
            </tr>
        ));
    };

    // 渲染带拖拽功能的表格主体
    const renderTableBody = () => {
        const tableContent = (
            <table className={classNames('custom-table', { 'custom-table-bordered-body': bordered, 'custom-table-header-separator': !bordered })}>
                <colgroup>
                    {isRowSelectionEnabled && (
                        <col key="body-selection-col" style={{ width: rowSelection?.columnWidth || '50px' }} />
                    )}
                    {allColumns.map((col, index) => (
                        <col key={`body-col-${col.dataIndex || col.key || index}`} style={{ width: col.width || 'auto' }} />
                    ))}
                </colgroup>
                <tbody>
                    {renderTableRows()}
                </tbody>
            </table>
        );

        if (draggable) {
            const itemIds = displayData.map((record, index) => String(getRowKey(record, index)));
            return (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={itemIds}
                        strategy={verticalListSortingStrategy}
                    >
                        {tableContent}
                    </SortableContext>
                </DndContext>
            );
        }

        return tableContent;
    };

    return (
        <div
            ref={tableRef}
            className={classNames('custom-table-container', { 'custom-table-bordered': bordered, 'custom-table-draggable': draggable }, className)}
            style={tableStyle}
        >
            {/* 加载遮罩层 */}
            {internalLoading && (
                <div className="custom-table-loading-mask">
                    <div className="custom-table-loading-content">
                        <div className="custom-table-loading-spinner">
                            <svg viewBox="0 0 24 24" className="custom-table-loading-icon">
                                <circle
                                    className="custom-table-loading-track"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    fill="none"
                                    strokeWidth="2"
                                />
                                <circle
                                    className="custom-table-loading-indicator"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    fill="none"
                                    strokeWidth="2"
                                />
                            </svg>
                        </div>
                        {loadingText && <div className="custom-table-loading-text">{loadingText}</div>}
                    </div>
                </div>
            )}

            {/* 表头 */}
            <div className="custom-table-header" ref={headerInnerRef} onScroll={handleHeaderScroll}>
                <table className={classNames('custom-table', { 'custom-table-bordered-body': bordered, 'custom-table-header-separator': !bordered })}>
                    <colgroup>
                        {isRowSelectionEnabled && (
                            <col key="header-selection-col" style={{ width: rowSelection?.columnWidth || '50px' }} />
                        )}
                        {allColumns.map((col, index) => (
                            <col key={`header-col-${col.dataIndex || col.key || index}`} style={{ width: col.width || 'auto' }} />
                        ))}
                    </colgroup>
                    <thead>
                        <tr>
                            {isRowSelectionEnabled && renderSelectionHeader()}
                            {allColumns.map((col, index) => renderHeaderCell(col, index, allColumns))}
                        </tr>
                    </thead>
                </table>
            </div>

            {/* 表体 */}
            <div
                className="custom-table-body"
                ref={bodyRef}
                style={bodyStyle}
                onScroll={handleBodyScroll}
            >
                {renderTableBody()}
            </div>

            {displayData.length === 0 && (
                <div className="custom-table-empty">
                    {empty || <Empty size="small" description="暂无数据" />}
                </div>
            )}

            {renderPagination()}
        </div>
    );
};

export default Table;
