import { useMemo } from "react";

import classNames from "classnames";
import { Popup, Table } from "semantic-ui-react";

import baseStyles from "../styles/base.scss";
import { DataTableBaseCellParams } from "../types/cell";
import { useDataTableBaseCellContext, useDataTableContext } from "../utils/contexts/hooks";
import { getCellContentCssStyleFromColumn, getCellCssStyleFromColumn } from "../utils/utils";

export default function DataTableBaseCell({
    children, style, className, withWrapper = true
}: DataTableBaseCellParams) {
    const { classes } = useDataTableContext();
    const {
        id, cell: cellData, row, column
    } = useDataTableBaseCellContext();
    const { tooltip, className: userClassName, field } = column;

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

    const tooltipText = useMemo(() => (tooltip && typeof tooltip.text === "function"
        ? tooltip.text(id, field, cellData, row)
        : tooltip), [cellData, field, id, row, tooltip]);

    const userFormattedClassName = useMemo(() => (typeof userClassName === "function"
        ? userClassName(id, field, cellData, row)
        : userClassName), [cellData, field, id, row, userClassName]);

    return (
        <Table.Cell
            className={classNames(
                className,
                classes?.rowCellClassName,
                { [baseStyles.baseCell]: !className },
                userFormattedClassName
            )}
            style={style ?? getCellCssStyleFromColumn(column)}
            data-cell-role="base"
        >
            {tooltip && tooltipText && children !== undefined
                ? (
                    <Popup
                        trigger={cellContent}
                        position={tooltip.position}
                        content={tooltipText}
                        className={tooltip.className}
                    />
                )
                : cellContent}
        </Table.Cell>
    );
}
