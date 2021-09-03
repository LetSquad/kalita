import classNames from "classnames";
import React from "react";
import { Table } from "semantic-ui-react";
import { DataTableHeaderCellParams } from "../types/cell";
import baseStyles from "../styles/base.scss";
import { useDataTableContext } from "../utils/contexts/hooks";
import { getCellCssStyleFromColumn, getHeaderCellContentCssStyleFromColumn } from "../utils/utils";

export default function DataTableHeaderCell({ column }: DataTableHeaderCellParams) {
    const { classes } = useDataTableContext();

    return (
        <Table.HeaderCell
            className={classNames(baseStyles.baseCell, classes?.headerRowCellClassName)}
            style={getCellCssStyleFromColumn(column)}
            data-cell-role="header"
        >
            {
                column.title && (
                    <div className={baseStyles.baseCellContentWrapper} style={getHeaderCellContentCssStyleFromColumn(column)}>
                        {column.title}
                    </div>
                )
            }
        </Table.HeaderCell>
    );
}
