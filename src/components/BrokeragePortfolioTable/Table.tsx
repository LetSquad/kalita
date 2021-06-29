import _ from "lodash";
import React, { useCallback, useMemo, useRef } from "react";
import { ReactTabulator } from "react-tabulator";
import { $enum } from "ts-enum-util";
import { getMoexQuotes } from "../../apis/moexApi";
import { TabulatorColumn } from "../../../custom_typings/react-tabulator/types";
import { Portfolio } from "../../models/portfolios/types";
import { BaseColumnNames, EditableTableColumns } from "../../models/table/enums";
import { useAppDispatch } from "../../store/hooks";
import {
    addNewPosition, deleteRowById, update, updateGroupName
} from "../../store/portfolios/portfoliosReducer";
import { ActionBlock } from "./ActionBlock";
import { AdditionalHeader } from "./AdditionalHeader/AdditionalHeader";
import { generateCsv, generateExportList } from "./utils/utils";
import styles from "./styles/Table.scss";

interface Props {
    columns: (actionBlock: JSX.Element) => TabulatorColumn[],
    currentPortfolio: Portfolio,
    additionalHeaderPart?: JSX.Element
}

export default function Table({ columns, currentPortfolio, additionalHeaderPart }: Props) {
    const dispatch = useAppDispatch();
    const tableRef = useRef<any>(null);

    const cellUpdated = useCallback((cell: any) => {
        dispatch(update({
            id: cell.getRow().getData().id,
            valueKey: $enum(EditableTableColumns)
                .asValueOrThrow(cell.getField()),
            newValue: cell.getValue()
        }));
        if (cell.getField() === BaseColumnNames.TICKER) {
            dispatch(getMoexQuotes());
        }
    }, [dispatch]);

    const rowMoved = useCallback((row: any) => {
        const newOrder = row.getTable().getRows().map((_row: any) => _row.getData().id);
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

    const options = useMemo(() => ({
        movableRows: true,
        headerSortTristate: true,
        layoutColumnsOnNewData: true,
        groupBy: "groupName",
        columnCalcs: "both",
        reactiveData: true,
        layout: "fitColumns",
        resizableColumns: false,
        groupHeader: (value: any, count: any, data: any, group: any) => {
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
            const downloadConfig = {
                columnHeaders: true,
                columnGroups: true,
                rowGroups: true,
                columnCalcs: false,
                dataTree: true
            };

            let list = tableRef.current.table.modules.export.generateExportList(downloadConfig, false, "visible", "download");
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
