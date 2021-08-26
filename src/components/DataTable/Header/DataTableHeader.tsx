import React from "react";
import { Table } from "semantic-ui-react";
import DataTableHeaderRow from "../Row/DataTableHeaderRow";
import styles from "./styles/DataTableHeader.scss";

export default function DataTableHeader() {
    return (
        <Table.Header className={styles.head}>
            <DataTableHeaderRow />
        </Table.Header>
    );
}
