import React, { useState, useEffect, useRef, useMemo, ReactNode } from 'react';
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

interface TableProps {
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

    // 编辑状态
    const [editingCell, setEditingCell] = useState<{ rowIndex: number; colKey: string } | null>(null);
    const [editingValue, setEditingValue] = useState('');

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
    }, [columns]);

    // 同步表头和表体的滚动
    const handleBodyScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (headerInnerRef.current && bodyRef.current) {
            const target = e.target as HTMLDivElement;
            // 只有当滚动的是body区域时才同步到header
            if (target === bodyRef.current && headerInnerRef.current.scrollLeft !== target.scrollLeft) {
                headerInnerRef.current.scrollLeft = target.scrollLeft;
            }
        }
    };

    const handleHeaderScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (headerInnerRef.current && bodyRef.current) {
            const target = e.target as HTMLDivElement;
            if (target === headerInnerRef.current && bodyRef.current.scrollLeft !== target.scrollLeft) {
                bodyRef.current.scrollLeft = target.scrollLeft;
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

    // 渲染表头单元格
    const renderHeaderCell = (column: Column, index: number, colGroup: Column[]) => {
        const style: React.CSSProperties = {
            width: column.width || 'auto',
            textAlign: column.align || 'left',
            backgroundColor: '#fafafa !important',
            top: 0,
        };

        if (column.fixed === 'start' || column.fixed === true) {
            style.position = 'sticky';
            // 计算左侧固定列的累积宽度
            let leftOffset = 0;
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
            // 尝试转换为 JSON 字符串
            try {
                return JSON.stringify(node);
            } catch {
                return '';
            }
        }
        if (typeof node === 'object' && node.props && node.props.children) {
            return extractTextFromReactNode(node.props.children);
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

    // 渲染表格单元格
    const renderTableCell = (column: Column, record: any, rowIndex: number, colIndex: number, colGroup: Column[]) => {
        const style: React.CSSProperties = {
            width: column.width || 'auto',
            textAlign: column.align || 'left',
            backgroundColor: 'white',
        };

        if (column.fixed === 'start' || column.fixed === true) {
            style.position = 'sticky';
            // 计算左侧固定列的累积宽度
            let leftOffset = 0;
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
                    className={`${shouldShowLeftShadow ? 'idp-table-fixed-left-shadow' : ''}${shouldShowRightShadow ? ' idp-table-fixed-right-shadow' : ''}`}
                >
                    <div className="idp-table-edit-cell" onClick={(e) => e.stopPropagation()}>
                        <input
                            type="text"
                            className="idp-table-edit-input"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                        />
                        <div className="idp-table-edit-actions">
                            <span
                                className="idp-table-edit-icon idp-edit-submit"
                                onClick={() => handleSave(record, column)}
                                title="保存"
                            >
                                <Icon type="check" size={24} color="#339af0" />
                            </span>
                            <span
                                className="idp-table-edit-icon idp-edit-cancel"
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
            <div className="idp-table-cell-ellipsis" style={{ WebkitLineClamp: column.maxLines }}>
                {safeContent}
            </div>
        ) : safeContent;

        // 如果有 tooltip，用 Tooltip 包裹
        const finalContent = tooltipTitle ? (
            <Tooltip title={tooltipTitle} placement="top">
                {cellContent as React.ReactElement}
            </Tooltip>
        ) : cellContent;

        return (
            <td
                key={column.key || column.dataIndex || column._index}
                style={style}
                onClick={column.editable ? () => handleEdit(rowIndex, String(colKey), content) : undefined}
                className={`${shouldShowLeftShadow ? 'idp-table-fixed-left-shadow' : ''}${shouldShowRightShadow ? ' idp-table-fixed-right-shadow' : ''}${shouldApplyMaxLines ? ' idp-table-cell-has-ellipsis' : ''}${column.editable ? ' idp-table-editable-cell' : ''}`}
            >
                {finalContent}
                {column.editable && (
                    <span className="idp-table-edit-icon-wrapper">
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
                />
            ));
        }

        return displayData.map((record, rowIndex) => (
            <tr key={getRowKey(record, rowIndex)}>
                {allColumns.map((column, colIndex) =>
                    renderTableCell(column, record, rowIndex, colIndex, allColumns)
                )}
            </tr>
        ));
    };

    // 渲染带拖拽功能的表格主体
    const renderTableBody = () => {
        const tableContent = (
            <table className={`custom-table ${bordered ? 'bordered' : ''}`}>
                <colgroup>
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
            className={`custom-table-container ${bordered ? 'bordered' : ''} ${className} ${draggable ? 'draggable' : ''}`}
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
                <table className={`custom-table ${bordered ? 'bordered' : ''}`}>
                    <colgroup>
                        {allColumns.map((col, index) => (
                            <col key={`header-col-${col.dataIndex || col.key || index}`} style={{ width: col.width || 'auto' }} />
                        ))}
                    </colgroup>
                    <thead>
                        <tr>
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
