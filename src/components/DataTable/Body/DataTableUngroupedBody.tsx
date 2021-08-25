import React from "react";
import { Table } from "semantic-ui-react";
import baseStyles from "../styles/base.scss";
import { useDataTableContext } from "../utils/contexts/hooks";

export default function DataTableUngroupedBody() {
    const { columns, data } = useDataTableContext();

    return (
        <>
            {data.map((row) => (
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
