import React from 'react';
import classNames from 'classnames';
import * as DndSortable from '../../utils/dnd-kit-adapter'

import * as DndCss from '@dnd-kit/utilities';
import { Column, RowSelection } from './index';
import Checkbox from '../Checkbox';
import Radio from '../Radio';
const { useSortable } = DndSortable;
const { CSS } = DndCss;

interface SortableRowProps {
    id: string;
    record: any;
    rowIndex: number;
    columns: Column[];
    columnWidths: number[];
    fixedLeftColumns: Column[];
    fixedRightColumns: Column[];
    normalColumns: Column[];
    allColumns: Column[];
    editingCell: { rowIndex: number; colKey: string } | null;
    editingValue: string;
    handleEdit: (rowIndex: number, colKey: string, value: any) => void;
    handleSave: (record: any, column: Column) => void;
    handleCancel: () => void;
    setEditingValue: (value: string) => void;
    renderTableCell: (
        column: Column,
        record: any,
        rowIndex: number,
        colIndex: number,
        colGroup: Column[],
        isSelectionColumn?: boolean
    ) => React.ReactNode;
    children?: React.ReactNode;
    isRowSelectionEnabled?: boolean;
    rowSelection?: RowSelection;
    selectedRowKeys?: (string | number)[];
    handleRowSelect?: (record: any, index: number, checked: boolean) => void;
}

const SortableRow: React.FC<SortableRowProps> = ({
    id,
    record,
    rowIndex,
    allColumns,
    renderTableCell,
    isRowSelectionEnabled,
    rowSelection,
    selectedRowKeys = [],
    handleRowSelect,
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
    };

    // 渲染选择列单元格
    const renderSelectionCell = () => {
        const isSelected = selectedRowKeys.includes(id);
        const checkboxProps = rowSelection?.getCheckboxProps?.(record, rowIndex);
        const isDisabled = checkboxProps?.disabled || false;

        const cellStyle: React.CSSProperties = {
            width: rowSelection?.columnWidth || '50px',
            textAlign: 'center',
            backgroundColor: 'white',
        };

        return (
            <td key={`zjpcy-table-sortable-selection-${id}`} style={cellStyle}>
                {rowSelection?.type === 'checkbox' ? (
                    <Checkbox
                        checked={isSelected}
                        disabled={isDisabled}
                        onChange={(checked) => handleRowSelect?.(record, rowIndex, checked)}
                    />
                ) : (
                    <Radio
                        checked={isSelected}
                        disabled={isDisabled}
                        onChange={() => handleRowSelect?.(record, rowIndex, !isSelected)}
                    />
                )}
            </td>
        );
    };

    return (
        <tr
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={classNames('zjpcy-table-sortable-row', { 'zjpcy-table-sortable-row-dragging': isDragging })}
            data-dragging={isDragging}
        >
            {isRowSelectionEnabled && renderSelectionCell()}
            {allColumns.map((column, colIndex) =>
                renderTableCell(column, record, rowIndex, colIndex, allColumns)
            )}
        </tr>
    );
};

export default SortableRow;
