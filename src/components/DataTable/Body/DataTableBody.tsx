import React from "react";
import { Table } from "semantic-ui-react";
import { useDataTableBodyContext } from "../utils/contexts/hooks";
import DataTableGroupedBody from "./DataTableGroupedBody";
import DataTableUngroupedBody from "./DataTableUngroupedBody";
import styles from "./styles/Body.scss";

export default function DataTableBody() {
    const { groupBy } = useDataTableBodyContext();
    return (
        <Table.Body className={styles.body}>
            {
                groupBy
                    ? <DataTableGroupedBody />
                    : <DataTableUngroupedBody />
            }
        </Table.Body>
    );
}
