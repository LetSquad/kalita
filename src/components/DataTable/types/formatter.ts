import { HTMLAttributeAnchorTarget } from "react";
// eslint-disable-next-line import/no-cycle
import { DataTableData } from "./base";

export enum FormatterTypes {
    MONEY = "money",
    PERCENTAGE = "percentage",
    IMAGE = "image",
    LINK = "link",
    COLOR = "color",
    STAR = "star",
    PROGRESS = "progress",
    ELEMENT = "element"
}

export enum CurrencyPosition {
    BEFORE,
    AFTER
}

/**
 * Interface that represent a params for money formatter.
 *
 * @interface
 * @name MoneyFormatterParams
 * @param {string} [decimal=.]                                         - Symbol to represent the decimal point
 * @param {string} [thousand=,]                                        - Symbol to represent the thousands separator
 * @param {string} [currency]                                          - Currency symbol
 * @param {CurrencyPosition} [currencyPosition=CurrencyPosition.AFTER] - Where will the currency symbol be located?
 * @param {boolean} [additionalSpace=false]                            - Whether to add a space between the number and the currency symbol
 * @param {number | false} [precision=2]                               - The number of digits after the decimal point to which the number will be rounded
 * @param {boolean} [zerosRemove=false]                                - Whether to remove extra zeros at the end
 */
export interface MoneyFormatterParams {
    decimal?: string;
    thousand?: string;
    currency?: string;
    currencyPosition?: CurrencyPosition;
    additionalSpace?: boolean;
    precision?: number | false;
    zerosRemove?: boolean;
}

/**
 * Interface that represent a params for percentage formatter.
 *
 * @interface
 * @name PercentageFormatterParams
 * @param {boolean} [additionalSpace=false] - Whether to add a space between the number and the currency symbol
 * @param {number | false} [precision=2]    - The number of digits after the decimal point to which the number will be rounded
 * @param {boolean} [zerosRemove=false]     - Whether to remove extra zeros at the end
 */
export interface PercentageFormatterParams {
    additionalSpace?: boolean;
    precision?: number | false;
    zerosRemove?: boolean;
}

/**
 * Interface that represent a params for image formatter.
 *
 * @interface
 * @name ImageFormatterParams
 * @param {string} [label]           - Image label
 * @param {number} [height]          - Image height value
 * @param {number} [width]           - Image width value
 * @param {string} [className]       - The class name that will be passed to the image element
 * @param {string} [link]            - The link that will be followed by clicking on the image
 * @param {boolean} [circular=false] - Will the image be circular
 * @param {boolean} [bordered=false] - Whether the image will include a border to highlight the edges of white or transparent content
 * @param {string} [urlPrefix]       - The prefix that will be added to the passed value to generate the url
 * @param {string} [urlSuffix]       - The suffix that will be added to the passed value to generate the url
 */
export interface ImageFormatterParams {
    label?: string;
    height?: number;
    width?: number;
    className?: string;
    link?: string;
    circular?: boolean;
    bordered?: boolean;
    urlPrefix?: string;
    urlSuffix?: string;
}

/**
 * Interface that represent a params for link formatter.
 *
 * @interface
 * @name LinkFormatterParams
 * @param {string} [label]                     - The text to be displayed (by default, url is displayed)
 * @param {HTMLAttributeAnchorTarget} [target] - A string representing the value of the anchor tags target attribute
 * @param {string} [className]                 - The class name that will be passed to the link element
 * @param {string} [urlPrefix]                 - The prefix that will be added to the passed value to generate the url
 * @param {string} [urlSuffix]                 - The suffix that will be added to the passed value to generate the url
 */
export interface LinkFormatterParams {
    label?: string;
    target?: HTMLAttributeAnchorTarget;
    className?: string;
    urlPrefix?: string;
    urlSuffix?: string;
}

/**
 * Interface that represent a params for star formatter.
 *
 * @interface
 * @name StarFormatterParams
 * @param {number} [maxStars=5]   - Maximum number of stars to be displayed
 * @param {string} [className] - The class name that will be passed to the stars element
 */
export interface StarFormatterParams {
    maxStars?: number;
    className?: string;
}

/**
 * Interface that represent a params for default progress formatter with default fields.
 *
 * @interface
 * @name BaseProgressFormatterParams
 * @param {string} [label]             - Label displayed under the progress bar
 * @param {boolean} [progress=false]   - Should the current fill percentage be displayed on the progress bar?
 * @param {boolean} [indicating=false] - Will there be a visual progress indicator showing the current level of task completion
 * @param {string} [className]         - The class name that will be passed to the progress bar element
 * @param {string} [color=#888]        - Progress bar color in format #ff0000, #f00, rgb(255,0,0), red, rgba(255,0,0,0), hsl(0, 100%, 50%)
 */
export interface DefaultProgressFormatterParams {
    label?: string;
    progress?: boolean;
    indicating?: boolean;
    className?: string;
    color?: string;
}

/**
 * Interface that represent a params for base progress formatter.
 *
 * @interface
 * @name BaseProgressFormatterParams
 * @augments DefaultProgressFormatterParams
 * @param {(cellData: number, rowId: string, rowData: DataTableData) => boolean} [success] - Progress bar shows success
 * @param {(cellData: number, rowId: string, rowData: DataTableData) => boolean} [error]   - Progress bar shows error
 * @param {(cellData: number, rowId: string, rowData: DataTableData) => boolean} [warning] - Progress bar shows warning
 */
export interface BaseProgressFormatterParams extends DefaultProgressFormatterParams{
    success?: (cellData: number, rowId: string, rowData: DataTableData) => boolean;
    error?: (cellData: number, rowId: string, rowData: DataTableData) => boolean;
    warning?: (cellData: number, rowId: string, rowData: DataTableData) => boolean;
}

/**
 * Interface that represent a params for percentage progress formatter.
 *
 * @interface
 * @name PercentageProgressFormatterParams
 * @augments BaseProgressFormatterParams
 * @param {boolean} [percent=false] - Is the input parameter passed as a percentage? (Cannot be used with maximum value mode)
 */
export interface PercentageProgressFormatterParams extends BaseProgressFormatterParams {
    percent?: boolean;
}

/**
 * Interface that represent a params for total progress formatter.
 *
 * @interface
 * @name TotalProgressFormatterParams
 * @augments BaseProgressFormatterParams
 * @param {number} [total=100] - Maximum value of the progress bar (Used if no percentage mode is selected)
 */
export interface TotalProgressFormatterParams extends BaseProgressFormatterParams {
    total?: number;
}

/**
 * Interface that represent a params for base progress formatter for calc cell.
 *
 * @interface
 * @name BaseCalcProgressFormatterParams
 * @augments DefaultProgressFormatterParams
 * @param {(cellData: number, columnData: number[]) => boolean} [success] - Progress bar shows success
 * @param {(cellData: number, columnData: number[]) => boolean} [error]   - Progress bar shows error
 * @param {(cellData: number, columnData: number[]) => boolean} [warning] - Progress bar shows warning
 */
export interface BaseCalcProgressFormatterParams extends DefaultProgressFormatterParams{
    success?: (cellData: number, columnData: number[]) => boolean;
    error?: (cellData: number, columnData: number[]) => boolean;
    warning?: (cellData: number, columnData: number[]) => boolean;
}

/**
 * Interface that represent a params for percentage progress formatter for calc cell.
 *
 * @interface
 * @name PercentageCalcProgressFormatterParams
 * @augments BaseCalcProgressFormatterParams
 * @param {boolean} [percent=false] - Is the input parameter passed as a percentage? (Cannot be used with maximum value mode)
 */
export interface PercentageCalcProgressFormatterParams extends BaseCalcProgressFormatterParams {
    percent?: boolean;
}

/**
 * Interface that represent a params for total progress formatter for calc cell.
 *
 * @interface
 * @name TotalCalcProgressFormatterParams
 * @augments BaseCalcProgressFormatterParams
 * @param {number} [total=100] - Maximum value of the progress bar (Used if no percentage mode is selected)
 */
export interface TotalCalcProgressFormatterParams extends BaseCalcProgressFormatterParams {
    total?: number;
}

/**
 * Interface that represent a params for element formatter.
 *
 * @interface
 * @name ElementFormatterParams
 * @param {(rowId: string, field: keyof DataTableData, cellData: string | number | boolean | undefined, rowData: DataTableData) => JSX.Element} renderElement - Displayed react component
 */
export interface ElementFormatterParams {
    renderElement: (
        rowId: string,
        field: keyof DataTableData,
        cellData: string | number | boolean | undefined,
        rowData: DataTableData
    ) => JSX.Element;
}

/**
 * Interface that represent money formatter. Accepts a number as input and displays it in the specified currency format in accordance with the parameters
 *
 * @interface
 * @name MoneyFormatter
 * @param {FormatterTypes.MONEY} type     - Formatter type
 * @param {MoneyFormatterParams} [params] - Formatter params
 */
export interface MoneyFormatter {
    type: FormatterTypes.MONEY;
    params?: MoneyFormatterParams;
}

/**
 * Interface that represent percentages formatter. Accepts a number as input and displays it in the specified percentages format in accordance with the parameters
 *
 * @interface
 * @name PercentageFormatter
 * @param {FormatterTypes.PERCENTAGE} type     - Formatter type
 * @param {PercentageFormatterParams} [params] - Formatter params
 */
export interface PercentageFormatter {
    type: FormatterTypes.PERCENTAGE;
    params?: PercentageFormatterParams;
}

/**
 * Interface that represent image formatter. Accepts a url or part of url to image as input and displays image from url with the parameters
 *
 * @interface
 * @name ImageFormatter
 * @param {FormatterTypes.IMAGE} type     - Formatter type
 * @param {ImageFormatterParams} [params] - Formatter params
 */
export interface ImageFormatter {
    type: FormatterTypes.IMAGE;
    params?: ImageFormatterParams;
}

/**
 * Interface that represent link formatter. Accepts a url or part of url as input and displays link with url and parameters
 *
 * @interface
 * @name LinkFormatter
 * @param {FormatterTypes.LINK} type      - Formatter type
 * @param {LinkFormatterParams} [params]  - Formatter params
 */
export interface LinkFormatter {
    type: FormatterTypes.LINK;
    params?: LinkFormatterParams;
}

/**
 * Interface that represent color formatter. Accepts a color as input and displays colored cell
 *
 * @interface
 * @name ColorFormatter
 * @param {FormatterTypes.COLOR} type - Formatter type
 */
export interface ColorFormatter {
    type: FormatterTypes.COLOR;
}

/**
 * Interface that represent star formatter. Accepts a number as input and displays stars with the parameters
 *
 * @interface
 * @name StarFormatter
 * @param {FormatterTypes.STAR} type     - Formatter type
 * @param {StarFormatterParams} [params] - Formatter params
 */
export interface StarFormatter {
    type: FormatterTypes.STAR;
    params?: StarFormatterParams
}

/**
 * Interface that represent progress formatter. Accepts a number as input and displays progress bar with the parameters
 *
 * @interface
 * @name ProgressFormatter
 * @param {FormatterTypes.PROGRESS} type                                              - Formatter type
 * @param {TotalProgressFormatterParams | PercentageProgressFormatterParams} [params] - Formatter params
 */
export interface ProgressFormatter {
    type: FormatterTypes.PROGRESS;
    params?: TotalProgressFormatterParams | PercentageProgressFormatterParams
}

/**
 * Interface that represent progress formatter for calc cell. Accepts a number as input and displays progress bar with the parameters
 *
 * @interface
 * @name ProgressFormatter
 * @param {FormatterTypes.PROGRESS} type                                                      - Formatter type
 * @param {TotalCalcProgressFormatterParams | PercentageCalcProgressFormatterParams} [params] - Formatter params
 */
export interface ProgressCalcFormatter {
    type: FormatterTypes.PROGRESS;
    params?: TotalCalcProgressFormatterParams | PercentageCalcProgressFormatterParams
}

/**
 * Interface that represent element formatter. Accepts a number, string or undefined as input and displays element from parameters
 *
 * @interface
 * @name ElementFormatter
 * @param {FormatterTypes.ELEMENT} type   - Formatter type
 * @param {ElementFormatterParams} params - Formatter params
 */
export interface ElementFormatter {
    type: FormatterTypes.ELEMENT;
    params: ElementFormatterParams
}
