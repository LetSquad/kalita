import {
    BrokeragePortfolioTypes,
    FormattersValues,
    HorizontalAlignValues,
    SidebarMenuElementsTypes,
    SortersValues,
    VerticalAlignValues
} from "./enums";

export interface TabulatorColumn {
    title: string,
    field: string,
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
    formatter?: FormattersValues
    | ((cell: any, formatterParams: any, onRendered: (callback: () => void) => void) => string),
    formatterParams?: any,
    topCalc?: string,
    topCalcFormatter?: FormattersValues,
    topCalcFormatterParams?: any,
    bottomCalc?: string,
    bottomCalcFormatter?: string,
    bottomCalcFormatterParams?: any,
    headerSort?: boolean,
    headerHozAlign?: HorizontalAlignValues,
    headerTooltip?: string,
    sorter?: SortersValues,
    validator?: string,
    editor?: string,
    [key: string]: any
}

export interface ModelPortfolioTableData {
    id: string,
    name: string,
    weight: number,
    share: number,
    targetAmount: number,
    price: number,
    targetQuantity: number,
    briefcase: number,
    amount: number,
    groupName: string
}

export interface BrokerAccountTableData {
    id: string,
    name: string,
    share: number,
    purchasePrice: number,
    price: number,
    briefcase: number,
    amount: number,
    groupName: string
}

export type TableData = BrokerAccountTableData[] | ModelPortfolioTableData[];

export type CurrentPortfolio = [BrokeragePortfolioTypes.MODEL_PORTFOLIO, ModelPortfolioTableData[]]
| [BrokeragePortfolioTypes.BROKER_ACCOUNT, BrokerAccountTableData[]];

export interface BrokerAccountMenuElement {
    id: string,
    type: SidebarMenuElementsTypes.BROKER_ACCOUNT,
    name: string,
    data: BrokerAccountTableData[]
}

export interface ModelPortfolioMenuElement {
    id: string,
    type: SidebarMenuElementsTypes.MODEL_PORTFOLIO,
    name: string,
    data: ModelPortfolioTableData[]
}

export type MenuElementData = BrokerAccountTableData[] | ModelPortfolioTableData[];

export type SidebarMenuGroupType = {
    name: string,
    isOpen: boolean
} & (
    {
        type: SidebarMenuElementsTypes.MODEL_PORTFOLIO,
        elements: ModelPortfolioMenuElement[]
    } | {
        type: SidebarMenuElementsTypes.BROKER_ACCOUNT,
        elements: BrokerAccountMenuElement[]
    }
);
