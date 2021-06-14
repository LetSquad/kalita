import React, { useCallback, useMemo, useRef } from "react";
import { ReactTabulator } from "react-tabulator";
import _ from "lodash";
import { Icon } from "semantic-ui-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
    addNewGroup, addToGroup, deleteRowById, update, updateGroupName
} from "../../store/tableReducer";
import { ActionBlock } from "./ActionBlock";
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
        layout: "fitColumns",
        responsiveLayout: "hide",
        groupBy: "groupName",
        columnCalcs: "both",
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
            ref={tableRef} columns={columns(actionBlock())} data={_.cloneDeep(tableData)} options={options}
            className={styles.table} cellEdited={cellUpdated} rowMoved={rowMoved}
        />
    ), [actionBlock, cellUpdated, options, rowMoved, tableData]);

    return (
        <div className={styles.mainContainer}>
            <div className={styles.additionalHeader}>
                <Icon name="plus" link className={styles.additionalHeaderAddIcon} onClick={() => addGroup()} />
            </div>
            {table}
        </div>
    );
}