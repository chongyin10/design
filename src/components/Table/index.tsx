import React, { useState, useEffect, useRef, useMemo, useCallback, ReactNode } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Empty from '../Empty';
import Pagination from '../Pagination';
import Tooltip from '../Tooltip';
import Icon from '../Icon';
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
    /** 是否支持行拖拽 */
    draggable?: boolean;
    /** 拖拽结束时的回调 */
    onDragEnd?: (newDataSource: any[]) => void;
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
    onDragEnd
}: TableProps) => {
    const [fixedLeftColumns, setFixedLeftColumns] = useState<Column[]>([]);
    const [fixedRightColumns, setFixedRightColumns] = useState<Column[]>([]);
    const [normalColumns, setNormalColumns] = useState<Column[]>([]);
    const [columnWidths, setColumnWidths] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [internalLoading, setInternalLoading] = useState(loading);
    const [dragDataSource, setDragDataSource] = useState<any[]>([]);
    const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const tableRef = useRef<HTMLDivElement>(null);
    const headerInnerRef = useRef<HTMLDivElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);

    // 编辑状态
    const [editingCell, setEditingCell] = useState<{ rowIndex: number; colKey: string } | null>(null);
    const [editingValue, setEditingValue] = useState('');

    // 拖拽传感器配置
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // 同步 dataSource 到 dragDataSource
    useEffect(() => {
        setDragDataSource(dataSource);
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
        const total = pagination?.total !== undefined ? pagination.total : dataSource.length;
        // 确保当前页码不超过总页数
        const totalPages = Math.ceil(total / ps) || 1;
        const validCurrent = Math.min(cp, totalPages);
        
        // 判断是否为后端分页模式
        // 只有当提供了 pagination.total 时才认为是后端分页
        const isBackendPagination = pagination?.total !== undefined;

        let pagedData: any[];
        if (isBackendPagination) {
            // 后端分页：直接使用 dataSource（后端已分页）
            pagedData = dataSource;
        } else {
            // 前端分页：对 dataSource 进行切片
            const start = (validCurrent - 1) * ps;
            const end = start + ps;
            pagedData = dataSource.slice(start, end);
        }

        return {
            data: pagedData,
            total,
            pageSize: ps,
            current: validCurrent,
            totalPages
        };
    };

    // 获取行键值 - 使用useCallback缓存函数，避免重复创建
    const getRowKey = useCallback((record: any, index: number): string | number => {
        if (typeof rowKey === 'function') {
            return rowKey(record, index);
        }
        return record[rowKey] || index;
    }, [rowKey]);

    // 预计算行键值映射 - 大幅提升拖拽性能
    const rowKeyToIndexMap = useMemo(() => {
        const map = new Map<string | number, number>();
        dragDataSource.forEach((item, index) => {
            map.set(getRowKey(item, index), index);
        });
        return map;
    }, [dragDataSource, getRowKey]);

    // 处理拖拽结束 - 优化性能，减少重渲染
    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            // 使用预计算的映射表，大幅提升查找性能
            const oldIndex = rowKeyToIndexMap.get(active.id);
            const newIndex = rowKeyToIndexMap.get(over.id);

            if (oldIndex !== undefined && newIndex !== undefined && oldIndex !== newIndex) {
                // 使用函数式更新，避免闭包问题
                setDragDataSource(prevData => {
                    const newDataSource = [...prevData];
                    const [removed] = newDataSource.splice(oldIndex, 1);
                    newDataSource.splice(newIndex, 0, removed);
                    
                    // 同步调用回调，减少一次重渲染
                    onDragEnd?.(newDataSource);
                    
                    return newDataSource;
                });
            }
        }
    }, [rowKeyToIndexMap, onDragEnd]);

    // 可拖拽行组件 - 使用memo优化，避免不必要的重渲染
    const DraggableRow = React.memo(({ record, index, children }: { record: any; index: number; children: ReactNode }) => {
        const rowId = useMemo(() => getRowKey(record, index), [record, index, getRowKey]);
        
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
            isDragging,
        } = useSortable({ id: rowId });

        const style = useMemo(() => ({
            transform: CSS.Transform.toString(transform),
            transition,
            opacity: isDragging ? 0.5 : 1,
            willChange: 'transform', // 添加will-change优化
        }), [transform, transition, isDragging]);

        return (
            <tr 
                ref={setNodeRef} 
                style={style} 
                {...attributes} 
                {...listeners}
                className={isDragging ? 'idp-table-row-dragging' : ''}
            >
                {children}
            </tr>
        );
    });

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
        if (Array.isArray(node)) {
            return node.map(extractTextFromReactNode).join('');
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

        // 处理 maxLines 属性
        const shouldApplyMaxLines = column.maxLines && column.maxLines > 0;

        // 处理 tooltip 属性
        let tooltipTitle = '';
        if (column.tooltip && !isEditing) {
            tooltipTitle = extractTextFromReactNode(content);
            // 获取原始数据作为 tooltip（优先使用原始数据）
            if (!tooltipTitle && column.dataIndex) {
                tooltipTitle = String(record[column.dataIndex] || '');
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
                {content}
            </div>
        ) : content;

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

    const tableStyle: React.CSSProperties = {
        width: scroll.x ? (typeof scroll.x === 'number' ? `${scroll.x}px` : scroll.x) : '100%',
    };

    const bodyStyle: React.CSSProperties = {
        maxHeight: scroll.y ? (typeof scroll.y === 'number' ? `${scroll.y}px` : scroll.y) : 'auto',
        overflowY: scroll.y ? 'auto' : 'visible',
        overflowX: scroll.x ? 'auto' : 'visible',
    };

    const allColumns = [...fixedLeftColumns, ...normalColumns, ...fixedRightColumns];
    
    // 使用 useMemo 缓存 paginationData，优化依赖项避免不必要的重新计算
    const paginationData = useMemo(() => getPaginationData(), [
        dataSource.length,
        pagination === false ? false : pagination?.total,
        pagination === false ? false : pagination?.current,
        pagination === false ? false : pagination?.pageSize,
        pageSize,
        currentPage
    ]);
    const displayData = paginationData ? paginationData.data : dataSource;

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

    return (
        <div
            ref={tableRef}
            className={`custom-table-container ${bordered ? 'bordered' : ''} ${className}`}
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
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div
                    className="custom-table-body"
                    ref={bodyRef}
                    style={bodyStyle}
                    onScroll={handleBodyScroll}
                >
                    <table className={`custom-table ${bordered ? 'bordered' : ''}`}>
                        <colgroup>
                            {allColumns.map((col, index) => (
                                <col key={`body-col-${col.dataIndex || col.key || index}`} style={{ width: col.width || 'auto' }} />
                            ))}
                        </colgroup>
                        <tbody>
                            {draggable ? (
                                <SortableContext items={dragDataSource.map((item, idx) => getRowKey(item, idx))} strategy={verticalListSortingStrategy}>
                                    {dragDataSource.map((record, rowIndex) => (
                                        <DraggableRow key={getRowKey(record, rowIndex)} record={record} index={rowIndex}>
                                            {allColumns.map((column, colIndex) =>
                                                renderTableCell(column, record, rowIndex, colIndex, allColumns)
                                            )}
                                        </DraggableRow>
                                    ))}
                                </SortableContext>
                            ) : (
                                displayData.map((record, rowIndex) => (
                                    <tr key={getRowKey(record, rowIndex)}>
                                        {allColumns.map((column, colIndex) =>
                                            renderTableCell(column, record, rowIndex, colIndex, allColumns)
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </DndContext>

            {(draggable ? dragDataSource : displayData).length === 0 && (
                <div className="custom-table-empty">
                    {empty || <Empty size="small" description="暂无数据" />}
                </div>
            )}

            {renderPagination()}
        </div>
    );
};

export default Table;