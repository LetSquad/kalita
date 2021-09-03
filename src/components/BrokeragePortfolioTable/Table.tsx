import React, { FocusEvent, KeyboardEvent, lazy, useCallback } from "react";
import { $enum } from "ts-enum-util";
import { loadMoexQuotesByTickers } from "../../apis/moexApi";
import { Portfolio } from "../../models/portfolios/types";
import { BaseColumnNames, EditableTableColumns } from "../../models/table/enums";
import { useAppDispatch } from "../../store/hooks";
import { addNewPosition, update, updateGroupName, updatePosition } from "../../store/portfolios/portfoliosReducer";
import { DataTableData } from "../DataTable/types/base";
import { ColumnDefinition } from "../DataTable/types/column";
import { AdditionalHeader } from "./AdditionalHeader/AdditionalHeader";
import styles from "./styles/Table.scss";

interface TableProps {
    columns: ColumnDefinition[],
    currentPortfolio: Portfolio,
    additionalHeaderPart?: JSX.Element
}

const DataTable = lazy(/* webpackChunkName: "dataTable" */() =>
    import("../DataTable/DataTable"));

export default function Table({ columns, currentPortfolio, additionalHeaderPart }: TableProps) {
    const dispatch = useAppDispatch();

    const importTableToCsvText = useCallback(() => undefined, []);

    const addRowToGroup = useCallback((groupName) => {
        dispatch(addNewPosition(groupName));
    }, [dispatch]);

    const updateGroup = useCallback((oldGroupName, newGroupName) => {
        dispatch(updateGroupName({
            oldGroupName,
            newGroupName
        }));
    }, [dispatch]);

    const rowMoved = useCallback((rowId: string, oldOrder: number, newOrder: number, newGroupName?: string) => {
        dispatch(updatePosition({
            id: rowId,
            oldOrder,
            newOrder,
            newGroupName
        }));
    }, [dispatch]);

    const cellUpdated = useCallback((
        rowId: string,
        field: keyof DataTableData,
        event: FocusEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>,
        value: string | number | boolean | undefined
    ) => {
        dispatch(update({
            id: rowId,
            valueKey: $enum(EditableTableColumns)
                .asValueOrThrow(field as string),
            newValue: value as string
        }));
        if (field === BaseColumnNames.TICKER) {
            dispatch(loadMoexQuotesByTickers([value as string]));
        }
    }, [dispatch]);

    return (
        <div className={styles.container}>
            <AdditionalHeader
                additionalHeaderPart={additionalHeaderPart} importTableToCsvText={importTableToCsvText}
                currentPortfolio={currentPortfolio}
            />
            <DataTable
                columns={columns}
                data={currentPortfolio.positions}
                groupBy="groupName"
                onAddRowToGroup={addRowToGroup}
                onGroupNameEdit={updateGroup}
                expandableGroup
                onRowMoved={rowMoved}
                onCellBlur={cellUpdated}
                onCellKeyEnter={cellUpdated}
                tableClassName={styles.table}
            />
        </div>
    );
}
