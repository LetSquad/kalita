import React, { useCallback } from "react";
import {
    ColumnDefinition
} from "../../../custom_typings/react-tabulator/types";
import { Portfolio } from "../../models/portfolios/types";
import { useAppDispatch } from "../../store/hooks";
import { addNewPosition, updateGroupName } from "../../store/portfolios/portfoliosReducer";
import DataTable from "../DataTable/DataTable";
import { AdditionalHeader } from "./AdditionalHeader/AdditionalHeader";
import styles from "./styles/Table.scss";

interface TableProps {
    columns: (actionBlock: JSX.Element, setCurrentInvalidCell: (invalidCell?: [HTMLDivElement, string]) => void) => ColumnDefinition[],
    currentPortfolio: Portfolio,
    additionalHeaderPart?: JSX.Element
}

export default function NewTable({ columns, currentPortfolio, additionalHeaderPart }: TableProps) {
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

    return (
        <div className={styles.container}>
            <AdditionalHeader
                additionalHeaderPart={additionalHeaderPart} importTableToCsvText={importTableToCsvText}
                currentPortfolio={currentPortfolio}
            />
            <DataTable
                data={currentPortfolio.positions}
                groupBy="groupName"
                onAddRowToGroup={addRowToGroup}
                onGroupNameEdit={updateGroup}
                expandableGroup
            />
        </div>
    );
}
