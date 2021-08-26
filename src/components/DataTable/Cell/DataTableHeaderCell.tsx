import React from "react";
import { Table } from "semantic-ui-react";
import { DataTableHeaderCellParams } from "../types/cell";
import baseStyles from "../styles/base.scss";

export default function DataTableHeaderCell({ column: { title } }: DataTableHeaderCellParams) {
    return <Table.HeaderCell className={baseStyles.baseCell}>{title}</Table.HeaderCell>;
}
