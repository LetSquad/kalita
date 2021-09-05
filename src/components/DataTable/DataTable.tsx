import classNames from "classnames";
import React, { ForwardedRef, forwardRef, useCallback, useImperativeHandle, useMemo } from "react";
import { DropResult } from "react-beautiful-dnd";
import { Table } from "semantic-ui-react";
import DataTableBody from "./Body/DataTableBody";
import DataTableFooter from "./Footer/DataTableFooter";
import DataTableHeader from "./Header/DataTableHeader";
import styles from "./styles/DataTable.scss";
import { DataTable as DataTableType, DataTableRef, ExportToCsvOptions } from "./types/base";
import { CalcPosition } from "./types/calc";
import { DataTableBodyContext, DataTableContext } from "./utils/contexts/contexts";
import { exportDataToCsv } from "./utils/utils";

const DataTable = forwardRef(({
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
    onCellKeyEnter,
    classes
}: DataTableType, ref: ForwardedRef<DataTableRef>) => {
    useImperativeHandle(ref, () => ({
        exportToCsv: ((options?: ExportToCsvOptions) => exportDataToCsv(data, columns, groupBy, options))
    }), [data, columns, groupBy]);

    const onDragEnd = useCallback((result: DropResult) => {
        if (onRowMoved && result.destination) {
            onRowMoved(result.draggableId, result.source.index, result.destination.index, result.destination.droppableId);
        }
    }, [onRowMoved]);

    const hasFooterCalc = useMemo(() => columns.map((column) =>
        column.tableCalc && column.tableCalc.position === CalcPosition.BOTTOM).includes(true), [columns]);

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
                data,
                classes
            }}
        >
            <div className={classNames(styles.tableContainer, classes?.tableClassName)}>
                <Table className={styles.innerTableHeader}>
                    <DataTableHeader />
                </Table>
                {content}
                <Table className={hasFooterCalc ? styles.innerTableFooter : styles.innerTableFooterEmpty}>
                    <DataTableFooter />
                </Table>
            </div>
        </DataTableContext.Provider>
    );
});

export default DataTable;
