import React from "react";
import { Table } from "semantic-ui-react";
import { useDataTableContext } from "../utils/contexts/hooks";
import styles from "./styles/DataTableHeader.scss";

export default function DataTableHeader() {
    const { columns } = useDataTableContext();

    return (
        <Table.Header className={styles.head}>
            <Table.Row>
                {columns.map((column) => (
                    <Table.HeaderCell key={column.field}>{column.title}</Table.HeaderCell>
                ))}
            </Table.Row>
        </Table.Header>
    );
}
