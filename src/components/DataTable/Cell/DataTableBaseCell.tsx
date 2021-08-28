import React from "react";
import { Table } from "semantic-ui-react";
import { DataTableBaseCellParams } from "../types/cell";
import baseStyles from "../styles/base.scss";
import { useDataTableBaseCellContext } from "../utils/contexts/hooks";
import { getCellContentCssStyleFromColumn, getCellCssStyleFromColumn } from "../utils/utils";

export default function DataTableBaseCell({ children, style, className }: DataTableBaseCellParams) {
    const { column } = useDataTableBaseCellContext();

    return (
        <Table.Cell className={className ?? baseStyles.baseCell} style={style ?? getCellCssStyleFromColumn(column)}>
            <div className={baseStyles.baseCellContentWrapper} style={getCellContentCssStyleFromColumn(column)}>
                {children}
            </div>
        </Table.Cell>
    );
}
