// eslint-disable-next-line import/no-cycle
import { DataTableData } from "./base";

export enum TooltipPosition {
    TOP_CENTER = "top center",
    TOP_LEFT = "top left",
    TOP_RIGHT = "top right",
    BOTTOM_CENTER = "bottom center",
    BOTTOM_LEFT = "bottom left",
    BOTTOM_RIGHT = "bottom right",
    RIGHT_CENTER = "right center",
    LEFT_CENTER = "left center"
}

interface BaseTooltip {
    position?: TooltipPosition;
    className?: string
}

export interface Tooltip extends BaseTooltip {
    text: ((
        rowId: string,
        field: keyof DataTableData,
        value: string | number | boolean | undefined,
        rowData: DataTableData
    ) => string | undefined) | string | undefined;
}

export interface ValidationTooltip<T = string | number | boolean | undefined> extends BaseTooltip {
    text: ((
        tableData: DataTableData[],
        rowId: string,
        field: keyof DataTableData,
        oldValue: T,
        newValue: T,
        rowData: DataTableData
    ) => string | undefined) | string | undefined;
}
