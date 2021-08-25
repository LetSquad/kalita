import React, { useState, FocusEvent, KeyboardEvent } from "react";
import { Icon, Input, Table } from "semantic-ui-react";
import { DataTableGroupParams } from "../../types/body";
import { useDataTableBodyGroupedContext, useDataTableContext } from "../../utils/contexts/hooks";
import styles from "./styles/DataTableGroup.scss";
import baseStyles from "../../styles/base.scss";

export default function DataTableGroup({ group: { name: groupName, data: rows } }: DataTableGroupParams) {
    const { columns } = useDataTableContext();
    const { onGroupNameEdit, onAddRowToGroup, expandableGroup } = useDataTableBodyGroupedContext();

    const [state, setState] = useState<boolean>(true);

    return (
        <>
            <Table.Row className={styles.groupRow} key={groupName}>
                <Table.Cell className={styles.groupCell}>
                    {
                        expandableGroup && (
                            <Icon
                                name={state ? "chevron down" : "chevron right"}
                                link
                                onClick={() => setState(!state)}
                            />
                        )
                    }
                    {
                        onGroupNameEdit
                            ? (
                                <Input
                                    defaultValue={groupName}
                                    className={styles.groupInput}
                                    onBlur={({ target }: FocusEvent<HTMLInputElement>) => onGroupNameEdit(groupName, target.value)}
                                    onKeyPress={({ key, target }: KeyboardEvent<HTMLInputElement>) =>
                                        (key === "Enter" && onGroupNameEdit(groupName, (target as HTMLInputElement).value))}
                                />
                            )
                            : <span>{groupName}</span>
                    }
                    {onAddRowToGroup &&
                        <Icon name="plus" link onClick={() => onAddRowToGroup(groupName)} className={styles.groupAddButton} />}
                </Table.Cell>
            </Table.Row>
            {state && rows.map((row) => (
                <Table.Row key={row.id} className={baseStyles.row}>
                    {columns.map((column) => {
                        const { field } = column;
                        if (field in row) {
                            return <Table.Cell key={`cell-${field}-${row.id}`}>{row[field]}</Table.Cell>;
                        }
                        return undefined;
                    })}
                </Table.Row>
            ))}
        </>
    );
}
