import { BaseColumnNames, BrokerAccountColumnNames, ModelPortfolioColumnNames } from "../../src/models/table/enums";
import {
    FormattersValues, HorizontalAlignValues, SortersValues, VerticalAlignValues
} from "./enums";

export interface TabulatorColumn {
    title?: string,
    field: BaseColumnNames | ModelPortfolioColumnNames | BrokerAccountColumnNames,
    visible?: boolean,
    hozAlign?: HorizontalAlignValues,
    vertAlign?: VerticalAlignValues,
    width?: number,
    minWidth?: number,
    maxWidth?: number,
    widthGrow?: number,
    widthShrink?: number,
    resizable?: boolean,
    frozen?: boolean,
    responsive?: number,
    tooltip?: (cell: any) => string,
    cssClass?: string,
    formatter?: FormattersValues | ((cell: any, formatterParams: any, onRendered: (callback: () => void) => void) => string),
    formatterParams?: any,
    topCalc?: string,
    topCalcFormatter?: FormattersValues | ((cell: any, formatterParams: any, onRendered: (callback: () => void) => void) => string),
    topCalcFormatterParams?: any,
    bottomCalc?: string,
    bottomCalcFormatter?: string,
    bottomCalcFormatterParams?: any,
    headerSort?: boolean,
    headerHozAlign?: HorizontalAlignValues,
    headerTooltip?: string,
    sorter?: SortersValues,
    validator?: ((cell: any, value: any, parameters: any) => boolean) | string,
    editor?: string,
    [key: string]: any
}

export interface BaseTabulatorColumn extends TabulatorColumn {
    field: BaseColumnNames,
}

export interface ModelPortfolioTabulatorColumn extends TabulatorColumn {
    field: BaseColumnNames | ModelPortfolioColumnNames,
}

export interface BrokerAccountTabulatorColumn extends TabulatorColumn {
    field: BaseColumnNames | BrokerAccountColumnNames,
}
