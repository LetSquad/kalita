// eslint-disable-next-line import/no-cycle
import { DataTableData } from "./base";
// eslint-disable-next-line import/no-cycle
import {
    MoneyFormatter,
    PercentageFormatter,
    ProgressFormatter,
    StarFormatter
} from "./formatter";

export enum CalcPosition {
    TOP = "top",
    BOTTOM = "bottom"
}

export enum CalcType {
    GROUP = "group",
    TABLE = "table"
}

export type CalcFunction = (
    column: (string | number | boolean | undefined)[],
    field: keyof DataTableData
) => string | number | boolean | undefined;

export interface Calc {
    calcFunction: CalcFunction;
    position: CalcPosition;
    formatter?: MoneyFormatter | PercentageFormatter | StarFormatter | ProgressFormatter;
}

export interface DataTableCalcRowParams {
    data: DataTableData[]
    position: CalcPosition;
    type: CalcType;
}
