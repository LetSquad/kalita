import React, { useMemo } from "react";
import { Popup, Table } from "semantic-ui-react";
import { DataTableBaseCellParams } from "../types/cell";
import baseStyles from "../styles/base.scss";
import { useDataTableBaseCellContext } from "../utils/contexts/hooks";
import { getCellContentCssStyleFromColumn, getCellCssStyleFromColumn } from "../utils/utils";

export default function DataTableBaseCell({ children, style, className, withWrapper = true }: DataTableBaseCellParams) {
    const { id, cell: cellData, row, column } = useDataTableBaseCellContext();
    const { tooltip, className: userClassName, field } = column;

    const cellContent = useMemo(() => (
        children !== undefined && withWrapper
            ? (
                <div className={baseStyles.baseCellContentWrapper} style={getCellContentCssStyleFromColumn(column)}>
                    {children}
                </div>
            )
            : children
    ), [children, column, withWrapper]);

    const tooltipText = useMemo(() => {
        return tooltip && typeof tooltip.text === "function"
            ? tooltip.text(id, field, cellData, row)
            : tooltip;
    }, [cellData, field, id, row, tooltip]);

    const userFormattedClassName = useMemo(() => {
        return typeof userClassName === "function"
            ? userClassName(id, field, cellData, row)
            : userClassName;
    }, [cellData, field, id, row, userClassName]);

    return (
        <Table.Cell
            className={`${className ?? baseStyles.baseCell}${userFormattedClassName ? ` ${userFormattedClassName}` : ""}`}
            style={style ?? getCellCssStyleFromColumn(column)}
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
