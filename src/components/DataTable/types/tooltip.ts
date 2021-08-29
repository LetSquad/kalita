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

export interface Tooltip {
    text: ((
        rowId: string,
        field: keyof DataTableData,
        cell: string | number | boolean | undefined,
        rowData: DataTableData
    ) => string | undefined) | string | undefined;
    position?: TooltipPosition;
    className?: string
}
