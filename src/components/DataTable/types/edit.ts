import {
    ChangeEvent,
    FocusEvent,
    KeyboardEvent,
    MouseEvent,
    SyntheticEvent
} from "react";

// eslint-disable-next-line import/no-cycle
import { DataTableData } from "./base";

export enum EditTypes {
    INPUT = "input",
    DROPDOWN = "dropdown",
    STAR = "star"
}

/**
 * Interface that represent options for dropdown or input with dataset
 *
 * @interface
 * @name Options
 * @param {string} value  - Specific option key
 * @param {string} [text] - The text displayed in a specific option. If missing, value is displayed
 */
export interface Options<T> {
    value: T;
    text?: string;
}

/**
 * Interface that represent a params for input edit.
 *
 * @interface
 * @name InputEditParams
 * @param {boolean} [transparent=false]                                                                                                                       - Are the borders displayed at the input
 * @param {boolean} [dashed=false]                                                                                                                            - Reduced padding and dashed borders
 * @param {string} [placeholder]                                                                                                                              - Placeholder label in input, when value is empty
 * @param {boolean} [clearable=false]                                                                                                                         - Will there be an icon for instantly clearing the contents of the input
 * @param {Options} [datalist]                                                                                                                                - List with tips
 * @param {string} [className]                                                                                                                                - The class name that will be passed to the input element
 * @param {(value: string | number | undefined) => void} [formatter]                                                                                                               - Formats a value according to the given formatter
 * @param {(rowId: string, field: keyof DataTableData, event: ChangeEvent<HTMLInputElement> | MouseEvent<HTMLElement>, value: string) => void} [onCellChange] - Callback when changing input value
 * @param {(rowId: string, field: keyof DataTableData, event: FocusEvent<HTMLInputElement>, value: string) => void} [onCellBlur]                              - Blur input callback
 * @param {(rowId: string, field: keyof DataTableData, event: KeyboardEvent<HTMLInputElement>, value: string) => void} [onKeyEnter]                           - Enter key input callback
 */
export interface InputEditParams {
    transparent?: boolean;
    dashed?: boolean;
    placeholder?: string;
    clearable?: boolean;
    datalist?: Options<string>[];
    className?: string;
    formatter?: (value: string | number | undefined) => void;
    onCellChange?: (
        rowId: string,
        field: keyof DataTableData,
        event: ChangeEvent<HTMLInputElement> | MouseEvent<HTMLElement> | KeyboardEvent<HTMLInputElement>,
        value: string
    ) => void;
    onCellBlur?: (rowId: string, field: keyof DataTableData, event: FocusEvent<HTMLInputElement>, value: string) => void;
    onCellKeyEnter?: (rowId: string, field: keyof DataTableData, event: KeyboardEvent<HTMLInputElement>, value: string) => void;
}

/**
 * Interface that represent a params for dropdown edit.
 *
 * @interface
 * @name DropdownEditParams
 * @param {boolean} [multiple=false]                                                                                                 - Can multiple options be selected
 * @param {boolean} [search=false]                                                                                                   - Is it possible to search by options
 * @param {boolean} [clearable=false]                                                                                                - Will there be an icon for instantly clearing the contents of the input
 * @param {boolean} [inline=false]                                                                                                   - Will the dropdown be embedded in the text
 * @param {string} [placeholder]                                                                                                     - Placeholder label in dropdown, when value is empty
 * @param {Options} options                                                                                                          - List with options
 * @param {(rowId: string, event: SyntheticEvent<HTMLElement>, value: string | number | undefined | boolean) => void} [onCellChange] - Callback when changing dropdown value
 */
export interface DropdownEditParams<T = string | number | undefined | boolean> {
    multiple?: boolean;
    search?: boolean;
    clearable?: boolean;
    inline?: boolean;
    placeholder?: string;
    options: Options<string | number | boolean | undefined>[];
    onCellChange?: (rowId: string, field: keyof DataTableData, event: SyntheticEvent<HTMLElement>, value: T) => void;
}

/**
 * Interface that represent a params for stars edit.
 *
 * @interface
 * @name StarEditParams
 * @param {(rowId: string, event: SyntheticEvent<HTMLElement>, value: number) => void} onCellChange - Callback when changing stars value
 */
export interface StarEditParams {
    onCellChange: (rowId: string, event: SyntheticEvent<HTMLElement>, value: number) => void;
}

/**
 * Interface that represent input edit.
 *
 * @interface
 * @name InputEdit
 * @param {EditTypes.INPUT} type     - Edit type
 * @param {InputEditParams} [params] - Edit params
 */
export interface InputEdit {
    type: EditTypes.INPUT;
    params?: InputEditParams;
}

/**
 * Interface that represent dropdown edit.
 *
 * @interface
 * @name DropdownEdit
 * @param {EditTypes.DROPDOWN} type   - Edit type
 * @param {DropdownEditParams} params - Edit params
 */
export interface DropdownEdit<T = string | number | undefined> {
    type: EditTypes.DROPDOWN;
    params: DropdownEditParams<T>;
}

/**
 * Interface that represent dropdown edit.
 *
 * @interface
 * @name StarEdit
 * @param {EditTypes.STAR} type   - Edit type
 * @param {StarEditParams} params - Edit params
 */
export interface StarEdit {
    type: EditTypes.STAR;
    params: StarEditParams;
}

export type Edit<T = string | number | undefined> = InputEdit | DropdownEdit<T> | StarEdit;

export interface DataTableInputParams {
    params?: InputEditParams;
    label?: string;
    isValid?: boolean;
}

export interface DataTableDropdownParams<T> {
    params: DropdownEditParams<T>;
}
