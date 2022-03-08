import { useMemo } from "react";

import classNames from "classnames";
import { Table } from "semantic-ui-react";

import baseStyles from "../../styles/base.scss";
import { DataTableBaseCellParams } from "../../types/cell";
import { useDataTableBaseCalcCellContext, useDataTableContext } from "../../utils/contexts/hooks";
import { getCellContentCssStyleFromColumn, getCellCssStyleFromColumn } from "../../utils/utils";

export default function DataTableBaseCalcCell({ children, withWrapper = true }: DataTableBaseCellParams) {
    const { classes } = useDataTableContext();
    const { column } = useDataTableBaseCalcCellContext();

    const cellContent = useMemo(() => (
        children !== undefined && withWrapper
            ? (
                <div
                    className={baseStyles.baseCellContentWrapper}
                    style={getCellContentCssStyleFromColumn(column)}
                >
                    {children}
                </div>
            )
            : children
    ), [children, column, withWrapper]);

    return (
        <Table.Cell
            className={classNames(baseStyles.baseCell, classes?.calcRowCellClassName)}
            style={getCellCssStyleFromColumn(column)}
            data-cell-role="calc"
        >
            {cellContent}
        </Table.Cell>
    );
}
