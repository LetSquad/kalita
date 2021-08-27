import React from "react";
import { Table } from "semantic-ui-react";
import DataTableHeaderCell from "../Cell/DataTableHeaderCell";
import { useDataTableContext } from "../utils/contexts/hooks";
import { getCssStyleFromColumn } from "../utils/utils";

export default function DataTableHeaderRow() {
    const { columns } = useDataTableContext();

    return (
        <Table.Row>
            {columns.map((column) => (
                <DataTableHeaderCell column={column} key={column.field} style={getCssStyleFromColumn(column)} />
            ))}
        </Table.Row>
    );
}
