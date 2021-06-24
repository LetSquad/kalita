import _ from "lodash";
import React, { useCallback, useMemo, useRef } from "react";
import { ReactTabulator } from "react-tabulator";
import { Icon } from "semantic-ui-react";
import { $enum } from "ts-enum-util";
import { TabulatorColumn } from "../../model/libs/react-tabulator/types";
import { EditableTableColumns } from "../../model/table/enums";
import { CurrentPortfolio } from "../../model/table/types";
import { useAppDispatch } from "../../store/hooks";
import {
    addNewGroup, addToGroup, deleteRowById, update, updateGroupName
} from "../../store/table/tableReducer";
import { ActionBlock } from "./ActionBlock";
import styles from "./styles/Table.scss";

interface Props {
    columns: (actionBlock: JSX.Element) => TabulatorColumn[],
    currentPortfolio: CurrentPortfolio,
    additionalHeaderPart?: JSX.Element
}

export default function Table({ columns, currentPortfolio, additionalHeaderPart }: Props) {
    const dispatch = useAppDispatch();
    const tableRef = useRef<any>(null);

    const cellUpdated = useCallback((cell: any) => {
        dispatch(update({
            id: cell._cell.row.data.id,
            valueKey: $enum(EditableTableColumns)
                .asValueOrThrow(cell._cell.column.field),
            newValue: cell._cell.value
        }));
    }, [dispatch]);

    const rowMoved = useCallback((row: any) => {
        dispatch(update({
            id: row._row.data.id,
            valueKey: EditableTableColumns.GROUP_NAME,
            newValue: row._row.data.groupName
        }));
    }, [dispatch]);

    const addRowToGroup = useCallback((groupName) => {
        dispatch(addToGroup(groupName));
    }, [dispatch]);

    const addGroup = useCallback(() => {
        dispatch(addNewGroup());
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
        groupHeader: (value: any, count: any, data: any, group: any) => {
            const elem = document.createElement("div");
            elem.className = styles.groupContainer;
            const input = document.createElement("input");
            input.value = group._group.key;
            input.className = styles.groupInput;
            input.addEventListener("blur", (ev) => {
                updateGroup(group._group.key, (ev.target as HTMLInputElement).value);
            });
            elem.append(input);
            const plus = document.createElement("i");
            plus.className = `plus icon ${styles.groupAddButton}`;
            plus.addEventListener("click", () => addRowToGroup(group._group.key));
            elem.append(plus);
            return elem;
        }
    }), [addRowToGroup, updateGroup]);

    const actionBlock = useCallback(() => (
        <ActionBlock deleteRow={deleteRow} />
    ), [deleteRow]);

    const table = useMemo(() => (
        <ReactTabulator
            ref={tableRef} columns={columns(actionBlock())} data={_.cloneDeep(currentPortfolio.positions)}
            options={options} className={styles.table} cellEdited={cellUpdated} rowMoved={rowMoved}
        />
    ), [actionBlock, cellUpdated, options, columns, currentPortfolio, rowMoved, tableRef]);

    return (
        <div className={styles.container}>
            <div className={styles.additionalHeader}>
                <div className={styles.additionalHeaderPart}>
                    {additionalHeaderPart}
                </div>
                <div>
                    <Icon name="cog" link className={styles.additionalHeaderIcon}
                          onClick={() => alert("Sunny India will provide settings soon!")} />
                    <Icon name="plus" link className={styles.additionalHeaderIcon} onClick={() => addGroup()} />
                </div>
            </div>
            {table}
        </div>
    );
}
