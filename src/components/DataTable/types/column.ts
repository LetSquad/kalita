import { DataTableData } from "./base";
import { Calc } from "./calc";
import { DropdownEdit, InputEdit, StarEdit } from "./edit";
import {
    ColorFormatter,
    ElementFormatter,
    ImageFormatter,
    LinkFormatter,
    MoneyFormatter,
    PercentageFormatter,
    ProgressFormatter,
    StarFormatter
} from "./formatter";
import { Tooltip } from "./tooltip";
import { Validator } from "./validator";

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

export type NotEditFormattersColumnDefinition = ElementFormatterColumnDefinition |
ImageFormatterColumnDefinition |
LinkFormatterColumnDefinition |
ColorFormatterColumnDefinition |
ProgressFormatterColumnDefinition;

export type EditFormattersColumnDefinition = MoneyFormatterColumnDefinition |
PercentageFormatterColumnDefinition |
StarFormatterColumnDefinition;

export type FormatterColumnDefinition = NotEditFormattersColumnDefinition | EditFormattersColumnDefinition;

export type ColumnDefinition = FormatterColumnDefinition | BaseFormatterColumnDefinition;

export interface BaseColumnDefinition {
    field: string;
    title?: string;
    className?: ((rowId: string,
        field: keyof DataTableData,
        cellData: string | number | boolean | undefined,
        rowData: DataTableData) => string | undefined) | string;
    tooltip?: Tooltip;
    validator?: Validator;
    headerCalc?: Calc;
    groupCalc?: Calc;
    width?: number;
    vertAlign?: VerticalAlignValues;
    hozAlign?: HorizontalAlignValues;
    headerVertAlign?: VerticalAlignValues;
    headerHozAlign?: HorizontalAlignValues;
}

export interface ElementFormatterColumnDefinition extends BaseColumnDefinition {
    formatter?: ElementFormatter;
}

export interface MoneyFormatterColumnDefinition extends BaseColumnDefinition {
    formatter?: MoneyFormatter;
    edit?: DropdownEdit<number> | InputEdit;
}

export interface PercentageFormatterColumnDefinition extends BaseColumnDefinition {
    formatter?: PercentageFormatter;
    edit?: DropdownEdit<number> | InputEdit;
}

export interface ImageFormatterColumnDefinition extends BaseColumnDefinition {
    formatter?: ImageFormatter;
}

export interface LinkFormatterColumnDefinition extends BaseColumnDefinition {
    formatter?: LinkFormatter;
}

export interface ColorFormatterColumnDefinition extends BaseColumnDefinition {
    formatter?: ColorFormatter;
}

export interface StarFormatterColumnDefinition extends BaseColumnDefinition {
    formatter?: StarFormatter;
    edit?: StarEdit;
}

export interface ProgressFormatterColumnDefinition extends BaseColumnDefinition {
    formatter?: ProgressFormatter;
}

export interface BaseFormatterColumnDefinition extends BaseColumnDefinition {
    edit?: DropdownEdit | InputEdit;
}
