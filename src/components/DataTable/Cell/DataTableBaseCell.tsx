import React, { useMemo } from "react";
import { Popup, Table } from "semantic-ui-react";
import { DataTableBaseCellParams } from "../types/cell";
import baseStyles from "../styles/base.scss";
import { useDataTableBaseCellContext } from "../utils/contexts/hooks";
import { getCellContentCssStyleFromColumn, getCellCssStyleFromColumn } from "../utils/utils";

export default function DataTableBaseCell({ children, style, className }: DataTableBaseCellParams) {
    const { id, cell: cellData, row, column, field } = useDataTableBaseCellContext();
    const { tooltip } = column;

    const cellContent = useMemo(() => (
        children !== undefined && (
            <div className={baseStyles.baseCellContentWrapper} style={getCellContentCssStyleFromColumn(column)}>
                {children}
            </div>
        )
    ), [children, column]);

    const tooltipText = useMemo(() => {
        return tooltip && typeof tooltip.text === "function"
            ? tooltip.text(id, field, cellData, row)
            : tooltip;
    }, [cellData, field, id, row, tooltip]);

    return (
        <Table.Cell className={className ?? baseStyles.baseCell} style={style ?? getCellCssStyleFromColumn(column)}>
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
