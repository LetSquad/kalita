import { HTMLAttributeAnchorTarget } from "react";
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
 * @interface MoneyFormatterParams
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
 * @interface PercentageFormatterParams
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
 * @interface ImageFormatterParams
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
 * @interface LinkFormatterParams
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
 * @interface StarFormatterParams
 * @param {number} [stars=5]   - Maximum number of stars to be displayed
 * @param {string} [className] - The class name that will be passed to the link element
 */
export interface StarFormatterParams {
    stars?: number;
    className?: string;
}

/**
 * Interface that represent a params for base progress formatter.
 *
 * @interface BaseProgressFormatterParams
 * @param {string} [label]                                                                 - Label displayed under the progress bar
 * @param {boolean} [progress=false]                                                       - Should the current fill percentage be displayed on the progress bar?
 * @param {boolean} [indicating=false]                                                     - Will there be a visual progress indicator showing the current level of task completion
 * @param {(cellData: number, rowId: string, rowData: DataTableData) => boolean} [success] - Progress bar shows success
 * @param {(cellData: number, rowId: string, rowData: DataTableData) => boolean} [error]   - Progress bar shows error
 * @param {(cellData: number, rowId: string, rowData: DataTableData) => boolean} [warning] - Progress bar shows warning
 * @param {string} [className]                                                             - The class name that will be passed to the progress bar element
 * @param {string} [color=#888]                                                            - Progress bar color in format #ff0000, #f00, rgb(255,0,0), red, rgba(255,0,0,0), hsl(0, 100%, 50%)
 */
export interface BaseProgressFormatterParams {
    label?: string;
    progress?: boolean;
    indicating?: boolean;
    success?: (cellData: number, rowId: string, rowData: DataTableData) => boolean;
    error?: (cellData: number, rowId: string, rowData: DataTableData) => boolean;
    warning?: (cellData: number, rowId: string, rowData: DataTableData) => boolean;
    className?: string;
    color?: string;
}

/**
 * Interface that represent a params for percentage progress formatter.
 *
 * @interface PercentageProgressFormatterParams
 * @augments BaseProgressFormatterParams
 * @param {boolean} [percent=false] - Is the input parameter passed as a percentage? (Cannot be used with maximum value mode)
 */
export interface PercentageProgressFormatterParams extends BaseProgressFormatterParams {
    percent?: boolean;
}

/**
 * Interface that represent a params for total progress formatter.
 *
 * @interface TotalProgressFormatterParams
 * @augments BaseProgressFormatterParams
 * @param {number} [total=100] - Maximum value of the progress bar (Used if no percentage mode is selected)
 */
export interface TotalProgressFormatterParams extends BaseProgressFormatterParams {
    total?: number;
}

/**
 * Interface that represent a params for element formatter.
 *
 * @interface ElementFormatterParams
 * @param {(cellData: number, rowId: string, rowData: DataTableData) => JSX.Element} renderElement - Displayed react component
 */
export interface ElementFormatterParams {
    renderElement: (cellData: string | number | undefined, rowId: string, rowData: DataTableData) => JSX.Element;
}

/**
 * Interface that represent money formatter. Accepts a number as input and displays it in the specified currency format in accordance with the parameters
 *
 * @interface MoneyFormatter
 * @param {FormatterTypes.MONEY} type     - Formatter type
 * @param {MoneyFormatterParams} [params] - Formatter params
 */
interface MoneyFormatter {
    type: FormatterTypes.MONEY;
    params?: MoneyFormatterParams;
}

/**
 * Interface that represent percentages formatter. Accepts a number as input and displays it in the specified percentages format in accordance with the parameters
 *
 * @interface PercentageFormatter
 * @param {FormatterTypes.PERCENTAGE} type     - Formatter type
 * @param {PercentageFormatterParams} [params] - Formatter params
 */
interface PercentageFormatter {
    type: FormatterTypes.PERCENTAGE;
    params?: PercentageFormatterParams;
}

/**
 * Interface that represent image formatter. Accepts a url or part of url to image as input and displays image from url with the parameters
 *
 * @interface ImageFormatter
 * @param {FormatterTypes.IMAGE} type     - Formatter type
 * @param {ImageFormatterParams} [params] - Formatter params
 */
interface ImageFormatter {
    type: FormatterTypes.IMAGE;
    params?: ImageFormatterParams;
}

/**
 * Interface that represent link formatter. Accepts a url or part of url as input and displays link with url and parameters
 *
 * @interface LinkFormatter
 * @param {FormatterTypes.LINK} type      - Formatter type
 * @param {LinkFormatterParams} [params]  - Formatter params
 */
interface LinkFormatter {
    type: FormatterTypes.LINK;
    params?: LinkFormatterParams;
}

/**
 * Interface that represent color formatter. Accepts a color as input and displays colored cell
 *
 * @interface ColorFormatter
 * @param {FormatterTypes.COLOR} type - Formatter type
 */
interface ColorFormatter {
    type: FormatterTypes.COLOR;
}

/**
 * Interface that represent star formatter. Accepts a number as input and displays stars with the parameters
 *
 * @interface StarFormatter
 * @param {FormatterTypes.STAR} type     - Formatter type
 * @param {StarFormatterParams} [params] - Formatter params
 */
interface StarFormatter {
    type: FormatterTypes.STAR;
    params?: StarFormatterParams
}

/**
 * Interface that represent progress formatter. Accepts a number as input and displays progress bar with the parameters
 *
 * @interface ProgressFormatter
 * @param {FormatterTypes.PROGRESS} type                                              - Formatter type
 * @param {TotalProgressFormatterParams | PercentageProgressFormatterParams} [params] - Formatter params
 */
interface ProgressFormatter {
    type: FormatterTypes.PROGRESS;
    params?: TotalProgressFormatterParams | PercentageProgressFormatterParams
}

/**
 * Interface that represent element formatter. Accepts a number, string or undefined as input and displays element from parameters
 *
 * @interface ElementFormatter
 * @param {FormatterTypes.ELEMENT} type   - Formatter type
 * @param {ElementFormatterParams} params - Formatter params
 */
interface ElementFormatter {
    type: FormatterTypes.ELEMENT;
    params: ElementFormatterParams
}

/**
 * Union type that combines all formatters.
 *
 * @type Formatter
 */
export type Formatter = MoneyFormatter |
PercentageFormatter |
ImageFormatter |
LinkFormatter |
ColorFormatter |
StarFormatter |
ProgressFormatter |
ElementFormatter;
