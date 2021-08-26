import React from "react";
import { Table } from "semantic-ui-react";
import { useDataTableBaseCellContext } from "../utils/contexts/hooks";
import baseStyles from "../styles/base.scss";

export default function DataTableBaseCell() {
    const { row, column: { field } } = useDataTableBaseCellContext();

    return <Table.Cell className={baseStyles.baseCell}>{row[field]}</Table.Cell>;
}
