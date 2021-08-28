import { Formatter } from "./formatter";

export enum HorizontalAlignValues {
    LEFT = "left",
    CENTER = "center",
    RIGHT = "right"
}

export enum VerticalAlignValues {
    TOP = "top",
    MIDDLE = "middle",
    BOTTOM = "bottom"
}

export interface ColumnDefinition {
    field: string;
    title?: string;
    formatter?: Formatter;
    width?: number;
    vertAlign?: VerticalAlignValues,
    hozAlign?: HorizontalAlignValues,
    headerVertAlign?: VerticalAlignValues,
    headerHozAlign?: HorizontalAlignValues,
}
