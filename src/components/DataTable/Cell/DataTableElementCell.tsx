import React from "react";
import { Table } from "semantic-ui-react";
import { useDataTableElementCellContext } from "../utils/contexts/hooks";
import baseStyles from "../styles/base.scss";

export default function DataTableElementCell() {
    const { row, column: { element }, style } = useDataTableElementCellContext();

    return <Table.Cell className={baseStyles.baseCell} style={style}>{element(row)}</Table.Cell>;
}
