import React, { useMemo } from "react";
import { Table } from "semantic-ui-react";
import { DataTableBaseCellParams } from "../../types/cell";
import baseStyles from "../../styles/base.scss";
import { useDataTableBaseCalcCellContext } from "../../utils/contexts/hooks";
import { getCellContentCssStyleFromColumn, getCellCssStyleFromColumn } from "../../utils/utils";

export default function DataTableBaseCalcCell({ children, withWrapper = true }: DataTableBaseCellParams) {
    const { column } = useDataTableBaseCalcCellContext();

    const cellContent = useMemo(() => (
        children !== undefined && withWrapper
            ? (
                <div className={baseStyles.baseCellContentWrapper} style={getCellContentCssStyleFromColumn(column)}>
                    {children}
                </div>
            )
            : children
    ), [children, column, withWrapper]);

    return (
        <Table.Cell className={baseStyles.baseCell} style={getCellCssStyleFromColumn(column)}>
            {cellContent}
        </Table.Cell>
    );
}
