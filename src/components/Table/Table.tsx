import React, { useCallback, useMemo, useRef } from "react";
import { ReactTabulator } from "react-tabulator";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { update } from "../../store/tableReducer";
import styles from "./styles/Table.scss";
import { TabulatorColumn } from "../../../custom_typings/types";

const columns: TabulatorColumn[] = [
    {
        title: "Имя",
        field: "name",
        sorter: "string",
        formatter: "plaintext",
        visible: true,
        vertAlign: "middle",
        headerHozAlign: "left",
        minWidth: 100,
        editor: "input"
    }, {
        title: "Вес",
        field: "weight",
        sorter: "number",
        formatter: "plaintext",
        minWidth: 100,
        visible: true,
        vertAlign: "middle",
        hozAlign: "left",
        headerHozAlign: "left",
        editor: "input"
    }, {
        title: "Доля",
        field: "share",
        sorter: "number",
        formatter: "money",
        formatterParams: {
            symbol: "%",
            symbolAfter: "%"
        },
        visible: true,
        vertAlign: "middle",
        minWidth: 100,
        headerHozAlign: "left",
        topCalc: "sum",
        topCalcFormatter: "money",
        topCalcFormatterParams: {
            symbol: "%",
            symbolAfter: "%"
        }
    }, {
        title: "Целевая сумма",
        field: "targetAmount",
        sorter: "number",
        formatter: "money",
        formatterParams: {
            symbol: "₽",
            symbolAfter: "р"
        },
        visible: true,
        vertAlign: "middle",
        headerHozAlign: "left",
        minWidth: 100,
        topCalc: "sum",
        topCalcFormatter: "money",
        topCalcFormatterParams: {
            symbol: "₽",
            symbolAfter: "р"
        }
    }, {
        title: "Цена",
        field: "price",
        sorter: "number",
        formatter: "money",
        formatterParams: {
            symbol: "₽",
            symbolAfter: "р"
        },
        minWidth: 100,
        visible: true,
        vertAlign: "middle",
        hozAlign: "left",
        headerHozAlign: "left"
    }, {
        title: "Целевое количество",
        field: "targetQuantity",
        sorter: "number",
        formatter: "plaintext",
        minWidth: 100,
        visible: true,
        vertAlign: "middle",
        hozAlign: "left",
        headerHozAlign: "left"
    }, {
        title: "В портфеле",
        field: "briefcase",
        sorter: "number",
        formatter: "plaintext",
        minWidth: 100,
        visible: true,
        vertAlign: "middle",
        hozAlign: "left",
        headerHozAlign: "left",
        editor: "input"
    }, {
        title: "Сумма",
        minWidth: 100,
        field: "amount",
        sorter: "number",
        formatter: "money",
        formatterParams: {
            symbol: "₽",
            symbolAfter: "р"
        },
        visible: true,
        vertAlign: "middle",
        headerHozAlign: "left",
        bottomCalc: "sum",
        bottomCalcFormatter: "money",
        bottomCalcFormatterParams: {
            symbol: "₽",
            symbolAfter: "р"
        }
    }
];

export default function Table() {
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
