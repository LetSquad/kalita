import React from "react";
import { Table } from "semantic-ui-react";
import { DataTableHeaderCellParams } from "../types/cell";
import baseStyles from "../styles/base.scss";
import { getCellCssStyleFromColumn, getHeaderCellContentCssStyleFromColumn } from "../utils/utils";

export default function DataTableHeaderCell({ column }: DataTableHeaderCellParams) {
    return (
        <Table.HeaderCell className={baseStyles.baseCell} style={getCellCssStyleFromColumn(column)}>
            <div className={baseStyles.baseCellContentWrapper} style={getHeaderCellContentCssStyleFromColumn(column)}>
                {column.title}
            </div>
        </Table.HeaderCell>
    );
}
