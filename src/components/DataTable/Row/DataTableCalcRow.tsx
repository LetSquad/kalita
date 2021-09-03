import React, { useMemo } from "react";
import { Table } from "semantic-ui-react";
import DataTableCalcFormatterCell from "../Cell/CalcCell/CalcFormatterCell/DataTableCalcFormatterCell";
import { DataTableData } from "../types/base";
import { CalcFunction, CalcType } from "../types/calc";
import { ColumnDefinition } from "../types/column";
import { DataTableCalcCellContext } from "../utils/contexts/contexts";
import { useDataTableCalcContext, useDataTableContext } from "../utils/contexts/hooks";
import styles from "./styles/DataTableCalcRow.scss";

export default function DataTableCalcRow() {
    const { columns } = useDataTableContext();

    const { data, position, type } = useDataTableCalcContext();

    const calcColumns = useMemo(() => {
        const calcColumnsMap = new Map<keyof DataTableData, {
            calcFunction: CalcFunction | undefined,
            column: ColumnDefinition
        }>();
        for (const column of columns) {
            const calc = type === CalcType.GROUP ? column.groupCalc : column.tableCalc;
            const isRightPosition = !!calc ? calc.position === position : false;
            calcColumnsMap.set(column.field, { calcFunction: isRightPosition && calc ? calc.calcFunction : undefined, column });
        }

        return calcColumnsMap;
    }, [columns, position, type]);

    const calcColumnsCount = useMemo(() => {
        let _calcColumnsCount = 0;
        for (const calcColumn of calcColumns.entries()) {
            if (calcColumn[1].calcFunction !== undefined) {
                _calcColumnsCount++;
            }
        }
        return _calcColumnsCount;
    }, [calcColumns]);

    const cells = useMemo(() => calcColumnsCount
        ? [...calcColumns.entries()].map((calcColumn) => {
            const columnData = data.map((row) => row[calcColumn[0]]);
            const calcResult = calcColumn[1].calcFunction ? calcColumn[1].calcFunction(columnData, calcColumn[0]) : undefined;

            return (
                <DataTableCalcCellContext.Provider
                    key={`calc-cell-context-${type}-${position}-${calcColumn[0]}`}
                    value={{
                        cell: calcResult,
                        field: calcColumn[0],
                        column: calcColumn[1].column,
                        calcType: type,
                        columnData
                    }}
                >
                    <DataTableCalcFormatterCell key={`calc-cell-${type}-${position}-${calcColumn[0]}`} />
                </DataTableCalcCellContext.Provider>
            );
        })
        : undefined, [calcColumns, calcColumnsCount, data, position, type]);

    return cells
        ? (
            <Table.Row className={styles.row}>
                {cells}
            </Table.Row>
        )
        : null;
}
