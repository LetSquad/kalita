import { FocusEvent, KeyboardEvent } from "react";

import classNames from "classnames";
import { Icon, Input, Table } from "semantic-ui-react";

import { DataTableGroupRowParams } from "../types/row";
import { useDataTableBodyGroupedContext, useDataTableContext } from "../utils/contexts/hooks";
import styles from "./styles/DataTableGroupRow.scss";

export default function DataTableGroupRow({ groupName, expandState, setExpandState }: DataTableGroupRowParams) {
    const { classes } = useDataTableContext();
    const { onGroupNameEdit, onAddRowToGroup, expandableGroup } = useDataTableBodyGroupedContext();

    return (
        <Table.Row
            className={classNames(styles.row, classes?.groupRowClassName)}
            data-row-role="group"
        >
            <Table.Cell
                className={classNames(styles.cell, classes?.groupRowCellClassName)}
                data-cell-role="group"
            >
                <div className={styles.container}>
                    {
                        expandableGroup && (
                            <Icon
                                name={expandState ? "chevron down" : "chevron right"}
                                link
                                onClick={() => setExpandState(!expandState)}
                            />
                        )
                    }
                    {
                        onGroupNameEdit
                            ? (
                                <Input
                                    defaultValue={groupName}
                                    className={styles.input}
                                    onBlur={({ target }: FocusEvent<HTMLInputElement>) => onGroupNameEdit(groupName, target.value)}
                                    onKeyPress={({ key, target }: KeyboardEvent<HTMLInputElement>) =>
                                        (key === "Enter" && onGroupNameEdit(groupName, (target as HTMLInputElement).value))}
                                />
                            )
                            : <span>{groupName}</span>
                    }
                </div>
                {onAddRowToGroup && (
                    <Icon
                        name="plus"
                        link
                        onClick={() => onAddRowToGroup(groupName)}
                        className={styles.addButton}
                    />
                )}
            </Table.Cell>
        </Table.Row>
    );
}
