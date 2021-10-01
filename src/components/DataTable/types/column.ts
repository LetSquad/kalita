// eslint-disable-next-line import/no-cycle
import { DataTableData } from "./base";
// eslint-disable-next-line import/no-cycle
import { Calc } from "./calc";
// eslint-disable-next-line import/no-cycle
import { DropdownEdit, InputEdit, StarEdit } from "./edit";
// eslint-disable-next-line import/no-cycle
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
// eslint-disable-next-line import/no-cycle
import { Tooltip } from "./tooltip";
// eslint-disable-next-line import/no-cycle
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
    tableCalc?: Calc;
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
