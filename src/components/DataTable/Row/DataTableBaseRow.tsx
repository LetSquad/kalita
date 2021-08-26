import React from "react";
import { Table } from "semantic-ui-react";
import DataTableCell from "../Cell/DataTableCell";
import { DataTableBaseRowParams } from "../types/row";
import { DataTableCellContext } from "../utils/contexts/contexts";
import styles from "./styles/DataTableBaseRow.scss";
import { useDataTableContext } from "../utils/contexts/hooks";

export default function DataTableBaseRow({ row }: DataTableBaseRowParams) {
    const { columns } = useDataTableContext();

    return (
        <Table.Row className={styles.row}>
            {columns.map((column) => (
                <DataTableCellContext.Provider
                    key={`cell-context-${column.field}-${row.id}`}
                    value={{
                        column,
                        row
                    }}
                >
                    <DataTableCell key={`cell-${column.field}-${row.id}`} />
                </DataTableCellContext.Provider>
            ))}
        </Table.Row>
    );
}
