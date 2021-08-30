import React, { useCallback } from "react";
import { Portfolio } from "../../models/portfolios/types";
import { useAppDispatch } from "../../store/hooks";
import { addNewPosition, updateGroupName, updatePosition } from "../../store/portfolios/portfoliosReducer";
import DataTable from "../DataTable/DataTable";
import { ColumnDefinition } from "../DataTable/types/column";
import { AdditionalHeader } from "./AdditionalHeader/AdditionalHeader";
import styles from "./styles/Table.scss";

interface TableProps {
    columns: ColumnDefinition[],
    currentPortfolio: Portfolio,
    additionalHeaderPart?: JSX.Element
}

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
            />
        </div>
    );
}
