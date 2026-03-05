import React from 'react';
import classNames from 'classnames';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Column } from './index';

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
        colGroup: Column[]
    ) => React.ReactNode;
    children?: React.ReactNode;
}

const SortableRow: React.FC<SortableRowProps> = ({
    id,
    record,
    rowIndex,
    allColumns,
    renderTableCell,
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

    return (
        <tr
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={classNames('zjpcy-table-sortable-row', { 'zjpcy-table-sortable-row-dragging': isDragging })}
            data-dragging={isDragging}
        >
            {allColumns.map((column, colIndex) =>
                renderTableCell(column, record, rowIndex, colIndex, allColumns)
            )}
        </tr>
    );
};

export default SortableRow;
