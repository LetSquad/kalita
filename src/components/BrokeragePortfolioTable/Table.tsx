import _ from "lodash";
import React, { useCallback, useMemo, useRef } from "react";
import { ReactTabulator } from "react-tabulator";
import { $enum } from "ts-enum-util";
import { ColumnCalcs, RowRange, TableLayout } from "../../../custom_typings/react-tabulator/enums";
import {
    CellComponent,
    ColumnDefinition,
    DataTypes,
    GroupComponent,
    RowComponent,
    TabulatorOptions, TabulatorRef,
    TabulatorTableDownloadConfig
} from "../../../custom_typings/react-tabulator/types";
import { getMoexQuotes } from "../../apis/moexApi";
import { Portfolio } from "../../models/portfolios/types";
import { BaseColumnNames, EditableTableColumns } from "../../models/table/enums";
import { TableData } from "../../models/table/types";
import { useAppDispatch } from "../../store/hooks";
import {
    addNewPosition,
    deleteRowById,
    update,
    updateGroupName
} from "../../store/portfolios/portfoliosReducer";
import { ActionBlock } from "./ActionBlock";
import { AdditionalHeader } from "./AdditionalHeader/AdditionalHeader";
import styles from "./styles/Table.scss";
import { generateCsv, generateExportList } from "./utils/utils";

interface Props {
    columns: (actionBlock: JSX.Element) => ColumnDefinition[],
    currentPortfolio: Portfolio,
    additionalHeaderPart?: JSX.Element
}

export default function Table({ columns, currentPortfolio, additionalHeaderPart }: Props) {
    const dispatch = useAppDispatch();
    const tableRef = useRef<TabulatorRef>(null);

    const cellUpdated = useCallback((cell: CellComponent) => {
        dispatch(update({
            id: cell.getRow().getData().id,
            valueKey: $enum(EditableTableColumns)
                .asValueOrThrow(cell.getField()),
            newValue: cell.getValue() as string
        }));
        if (cell.getField() === BaseColumnNames.TICKER) {
            dispatch(getMoexQuotes());
        }
    }, [dispatch]);

    const rowMoved = useCallback((row: RowComponent) => {
        const newOrder = row.getTable().getRows().map((_row: RowComponent) => _row.getData().id);
        dispatch(update({
            id: row.getData().id,
            valueKey: EditableTableColumns.GROUP_NAME,
            newValue: row.getData().groupName,
            newOrder
        }));
    }, [dispatch]);

    const addRowToGroup = useCallback((groupName) => {
        dispatch(addNewPosition(groupName));
    }, [dispatch]);

    const updateGroup = useCallback((oldGroupName, newGroupName) => {
        dispatch(updateGroupName({
            oldGroupName,
            newGroupName
        }));
    }, [dispatch]);

    const deleteRow = useCallback((id: string) => {
        dispatch(deleteRowById(id));
    }, [dispatch]);

    const options: TabulatorOptions = useMemo(() => ({
        movableRows: true,
        headerSortTristate: true,
        layoutColumnsOnNewData: true,
        groupBy: "groupName",
        columnCalcs: ColumnCalcs.BOTH,
        reactiveData: true,
        layout: TableLayout.FIT_COLUMNS,
        resizableColumns: false,
        groupHeader: (value: DataTypes, count: number, data: TableData, group: GroupComponent) => {
            const elem = document.createElement("div");
            elem.className = styles.groupContainer;
            const input = document.createElement("input");
            input.value = group.getKey();
            input.className = styles.groupInput;
            input.addEventListener("blur", (ev) => {
                updateGroup(group.getKey(), (ev.target as HTMLInputElement).value);
            });
            elem.append(input);
            const plus = document.createElement("i");
            plus.className = `plus icon ${styles.groupAddButton}`;
            plus.addEventListener("click", () => addRowToGroup(group.getKey()));
            elem.append(plus);
            return elem;
        }
    }), [addRowToGroup, updateGroup]);

    const actionBlock = useCallback(() => (
        <ActionBlock deleteRow={deleteRow} />
    ), [deleteRow]);

    const importTableToCsvText = useCallback(() => {
        if (tableRef.current) {
            const downloadConfig: TabulatorTableDownloadConfig = {
                columnHeaders: true,
                columnGroups: true,
                rowGroups: true,
                columnCalcs: false,
                dataTree: true
            };
            let list = tableRef.current.table.modules.export.generateExportList(downloadConfig, false, RowRange.VISIBLE, "download");
            list = generateExportList(list);
            return generateCsv(list);
        }
        return undefined;
    }, [tableRef]);

    const table = useMemo(() => (
        <ReactTabulator
            ref={tableRef} columns={columns(actionBlock())} data={_.cloneDeep(currentPortfolio.positions)}
            options={options} className={styles.table} cellEdited={cellUpdated} rowMoved={rowMoved}
        />
    ), [actionBlock, cellUpdated, options, columns, currentPortfolio, rowMoved, tableRef]);

    return (
        <div className={styles.container}>
            <AdditionalHeader
                additionalHeaderPart={additionalHeaderPart} importTableToCsvText={importTableToCsvText}
                currentPortfolioType={currentPortfolio.type}
            />
            {table}
        </div>
    );
}
