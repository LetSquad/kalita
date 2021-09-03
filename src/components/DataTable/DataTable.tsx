import classNames from "classnames";
import React, { useCallback, useMemo } from "react";
import { DropResult } from "react-beautiful-dnd";
import { Table } from "semantic-ui-react";
import DataTableBody from "./Body/DataTableBody";
import DataTableFooter from "./Footer/DataTableFooter";
import DataTableHeader from "./Header/DataTableHeader";
import styles from "./styles/DataTable.scss";
import { DataTable as DataTableType } from "./types/base";
import { CalcPosition } from "./types/calc";
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

    const hasHeaderCalc = useMemo(() => columns.map((column) =>
        column.tableCalc && column.tableCalc.position === CalcPosition.TOP).includes(true), [columns]);

    const hasFooterCalc = useMemo(() => columns.map((column) =>
        column.tableCalc && column.tableCalc.position === CalcPosition.BOTTOM).includes(true), [columns]);

    const content = useMemo(() => data.length > 0
        ? (
            <Table className={classNames(
                { [styles.innerTableBodyCalcBoth]: hasFooterCalc && hasHeaderCalc },
                { [styles.innerTableBodyEmpty]: !hasFooterCalc && !hasHeaderCalc },
                { [styles.innerTableBodyCalcHeader]: !hasFooterCalc && hasHeaderCalc },
                { [styles.innerTableBodyCalcFooter]: hasFooterCalc && !hasHeaderCalc }
            )}>
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
        hasFooterCalc,
        hasHeaderCalc,
        groupBy,
        onAddRowToGroup,
        onGroupNameEdit,
        expandableGroup,
        onDragEnd,
        onRowMoved,
        onCellChanged,
        onCellBlur,
        onCellKeyEnter,
        emptyTablePlaceholder
    ]);

    return (
        <DataTableContext.Provider
            value={{
                columns,
                data
            }}
        >
            <div className={styles.tableContainer}>
                <Table className={hasHeaderCalc ? styles.innerTableHeaderCalc : styles.innerTableHeaderEmpty}>
                    <DataTableHeader />
                </Table>
                {content}
                <Table className={hasFooterCalc ? styles.innerTableFooterCalc : styles.innerTableFooterEmpty}>
                    <DataTableFooter />
                </Table>
            </div>
        </DataTableContext.Provider>
    );
}
