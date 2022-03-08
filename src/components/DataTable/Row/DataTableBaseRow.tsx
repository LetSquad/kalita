import { MouseEvent, useCallback } from "react";

import classNames from "classnames";
import { Draggable } from "react-beautiful-dnd";
import { Ref, Table } from "semantic-ui-react";

import DataTableCell from "../Cell/DataTableCell";
import { ColumnDefinition } from "../types/column";
import { DataTableBaseRowParams } from "../types/row";
import { DataTableCellContext } from "../utils/contexts/contexts";
import { useDataTableBodyContext, useDataTableContext } from "../utils/contexts/hooks";
import styles from "./styles/DataTableBaseRow.scss";

export default function DataTableBaseRow({ row }: DataTableBaseRowParams) {
    const { columns, data, classes } = useDataTableContext();
    const { isRowMovedEnabled } = useDataTableBodyContext();

    const dataTableCellContextValues = useCallback((column: ColumnDefinition) => ({
        id: row.id,
        field: column.field,
        column,
        row,
        cell: row[column.field]
    }), [row]);

    return (
        <Draggable
            key={row.id}
            draggableId={row.id}
            index={data.findIndex((_row) => _row.id === row.id)}
            isDragDisabled={!isRowMovedEnabled}
        >
            {(itemProvided) => (
                <Ref innerRef={itemProvided.innerRef}>
                    <Table.Row
                        data-row-role="base"
                        className={classNames(styles.row, classes?.rowClassName)}
                        /* eslint-disable-next-line react/jsx-props-no-spreading */
                        {...itemProvided.draggableProps}
                        /* eslint-disable-next-line react/jsx-props-no-spreading */
                        {...itemProvided.dragHandleProps}
                        onMouseDown={(e: MouseEvent<HTMLTableRowElement>) => e.currentTarget.focus()}
                    >
                        {columns.map((column) => (
                            <DataTableCellContext.Provider
                                key={`cell-context-${column.field}-${row.id}`}
                                value={dataTableCellContextValues(column)}
                            >
                                <DataTableCell key={`cell-${column.field}-${row.id}`} />
                            </DataTableCellContext.Provider>
                        ))}
                    </Table.Row>
                </Ref>
            )}
        </Draggable>
    );
}
