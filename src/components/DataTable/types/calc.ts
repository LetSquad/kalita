import { DataTableData } from "./base";

export enum CalcPosition {
    TOP = "top",
    BOTTOM = "bottom"
}

export interface Calc {
    calcFunction: (
        column: (string | undefined)[] | (number | undefined)[] | (boolean | undefined)[],
        field: keyof DataTableData
    ) => string | number | boolean | undefined;
    position: CalcPosition;
}
