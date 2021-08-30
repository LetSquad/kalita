import React, { useCallback, useEffect, useMemo } from "react";
import { DropResult } from "react-beautiful-dnd";
import { Table } from "semantic-ui-react";
import DataTableBody from "./Body/DataTableBody";
import DataTableHeader from "./Header/DataTableHeader";
import styles from "./styles/DataTable.scss";
import { DataTable as DataTableType } from "./types/base";
import { DataTableBodyContext, DataTableContext } from "./utils/contexts/contexts";

export default function DataTable({
    data,
    columns,
    groupBy,
    onGroupNameEdit,
    onAddRowToGroup,
    onRowMoved,
    expandableGroup,
    emptyTablePlaceholder,
    onCellChanged,
    onCellBlur,
    onCellKeyEnter
}: DataTableType) {
    const onDragEnd = useCallback((result: DropResult) => {
        if (onRowMoved && result.destination) {
            onRowMoved(result.draggableId, result.source.index, result.destination.index, result.destination.droppableId);
        }
    }, [onRowMoved]);

    const content = useMemo(() => data.length > 0
        ? (
            <Table className={styles.innerTableBody}>
                <DataTableBodyContext.Provider
                    value={{
                        groupBy,
                        onAddRowToGroup,
                        onGroupNameEdit,
                        expandableGroup,
                        onDragEnd,
                        isRowMovedEnabled: !!onRowMoved,
                        onCellChanged,
                        onCellBlur,
                        onCellKeyEnter
                    }}
                >
                    <DataTableBody />
                </DataTableBodyContext.Provider>
            </Table>
        )
        : <div className={styles.innerTablePlaceholder}>{emptyTablePlaceholder ?? "Данные недоступны"}</div>,
    [
        data.length,
        emptyTablePlaceholder,
        expandableGroup,
        groupBy,
        onAddRowToGroup,
        onCellChanged,
        onDragEnd,
        onGroupNameEdit,
        onRowMoved,
        onCellBlur,
        onCellKeyEnter
    ]);

    useEffect(() => {
        console.log("rendred");
    }, []);

    return (
        <DataTableContext.Provider
            value={{
                columns,
                data
            }}
        >
            <div className={styles.tableContainer}>
                <Table className={styles.innerTableHeader}>
                    <DataTableHeader />
                </Table>
                {content}
            </div>
        </DataTableContext.Provider>
    );
}
