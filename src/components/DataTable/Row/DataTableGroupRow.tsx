import React, { FocusEvent, KeyboardEvent } from "react";
import { Icon, Input, Table } from "semantic-ui-react";
import { DataTableGroupRowParams } from "../types/row";
import styles from "./styles/DataTableGroupRow.scss";
import { useDataTableBodyGroupedContext } from "../utils/contexts/hooks";

export default function DataTableGroupRow({ groupName, expandState, setExpandState }: DataTableGroupRowParams) {
    const { onGroupNameEdit, onAddRowToGroup, expandableGroup } = useDataTableBodyGroupedContext();

    return (
        <Table.Row className={styles.row}>
            <Table.Cell className={styles.cell}>
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
                {onAddRowToGroup &&
                    <Icon name="plus" link onClick={() => onAddRowToGroup(groupName)} className={styles.addButton} />}
            </Table.Cell>
        </Table.Row>
    );
}
