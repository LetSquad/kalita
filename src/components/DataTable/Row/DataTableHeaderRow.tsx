import classNames from "classnames";
import { Table } from "semantic-ui-react";

import DataTableHeaderCell from "../Cell/DataTableHeaderCell";
import baseStyles from "../styles/base.scss";
import { useDataTableContext } from "../utils/contexts/hooks";

export default function DataTableHeaderRow() {
    const { columns, classes } = useDataTableContext();

    return (
        <Table.Row
            className={classNames(baseStyles.baseRow, classes?.headerRowClassName)}
            data-row-role="header"
        >
            {columns.map((column) => (
                <DataTableHeaderCell
                    column={column}
                    key={column.field}
                />
            ))}
        </Table.Row>
    );
}
