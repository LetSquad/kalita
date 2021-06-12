import React, { useCallback, useMemo, useRef } from "react";
import { ReactTabulator } from "react-tabulator";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { update } from "../../store/tableReducer";
import { columns } from "./constants";
import styles from "./styles/ModelPortfolioTable.scss";

export default function ModelPortfolioTable() {
    const dispatch = useAppDispatch();
    const tableRef = useRef<any>(null);

    const tableData = useAppSelector((state) => state.tableData.data);

    const cellUpdated = useCallback((cell: any) => {
        dispatch(update({
            id: cell._cell.row.data.id,
            valueKey: cell._cell.column.field,
            newValue: cell._cell.value
        }));
    }, [dispatch]);

    const rowMoved = useCallback((row: any) => {
        dispatch(update({
            id: row._row.data.id,
            valueKey: "groupName",
            newValue: row._row.data.groupName
        }));
    }, [dispatch]);

    const options = useMemo(() => ({
        movableRows: true,
        headerSortTristate: true,
        layoutColumnsOnNewData: true,
        layout: "fitColumns",
        responsiveLayout: "hide",
        groupBy: "groupName",
        columnCalcs: "both"
    }), []);

    return useMemo(() => (
        <ReactTabulator
            ref={tableRef} columns={columns} data={tableData} options={options} className={styles.table}
            cellEdited={cellUpdated} rowMoved={rowMoved}
        />
    ), [cellUpdated, options, rowMoved, tableData]);
}
