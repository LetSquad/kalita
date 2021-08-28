import { KeyboardEvent, FocusEvent, SyntheticEvent } from "react";

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
export interface Options {
    value: string;
    text?: string;
}

/**
 * Interface that represent a params for input edit.
 *
 * @interface
 * @name InputEditParams
 * @param {boolean} [transparent=false]                                                              - Are the fields displayed at the input
 * @param {string} [placeholder]                                                                     - Placeholder label in input, when value is empty
 * @param {boolean} [clearable=false]                                                                - Will there be an icon for instantly clearing the contents of the input
 * @param {Options} [datalist]                                                                       - List with tips
 * @param {string} [className]                                                                       - The class name that will be passed to the input element
 * @param {(rowId: string, event: KeyboardEvent<HTMLInputElement>, value: T) => void} [onCellChange] - Callback when changing input value
 * @param {(rowId: string, event: FocusEvent<HTMLInputElement>, value: T) => void} [onCellBlur]      - Blur input callback
 */
export interface InputEditParams<T = string | number | undefined> {
    transparent?: boolean;
    placeholder?: string;
    clearable?: boolean;
    datalist?: Options;
    className?: string;
    onCellChange?: (rowId: string, event: KeyboardEvent<HTMLInputElement>, value: T) => void;
    onCellBlur?: (rowId: string, event: FocusEvent<HTMLInputElement>, value: T) => void;
}

/**
 * Interface that represent a params for dropdown edit.
 *
 * @interface
 * @name DropdownEditParams
 * @param {boolean} [multiple=false]                                                             - Can multiple options be selected
 * @param {boolean} [search=false]                                                               - Is it possible to search by options
 * @param {boolean} [clearable=false]                                                            - Will there be an icon for instantly clearing the contents of the input
 * @param {boolean} [inline=false]                                                               - Will the dropdown be embedded in the text
 * @param {string} [placeholder]                                                                 - Placeholder label in dropdown, when value is empty
 * @param {Options} options                                                                      - List with options
 * @param {(rowId: string, event: SyntheticEvent<HTMLElement>, value: T) => void} [onCellChange] - Callback when changing dropdown value
 */
export interface DropdownEditParams<T = string | number | undefined> {
    multiple?: boolean;
    search?: boolean;
    clearable?: boolean;
    inline?: boolean;
    placeholder?: string;
    options: Options;
    onCellChange?: (rowId: string, event: SyntheticEvent<HTMLElement>, value: T) => void;
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
export interface InputEdit<T = string | number | undefined> {
    type: EditTypes.INPUT;
    params?: InputEditParams<T>;
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

export type Edit<T = string | number | undefined> = InputEdit<T> | DropdownEdit<T> | StarEdit;
