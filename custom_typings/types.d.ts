import { BrokeragePortfolioTypes, SidebarMenuElementsTypes } from "./enums";

export interface ModelPortfolioTableData {
    id: string,
    ticker: string,
    weight: number,
    proportion: number,
    targetAmount: number,
    currentPrice: number,
    targetQuantity: number,
    quantity: number,
    amount: number,
    groupName: string
}

export interface BrokerAccountTableData {
    id: string,
    ticker: string,
    proportion: number,
    averagePrice: number,
    currentPrice: number,
    quantity: number,
    amount: number,
    groupName: string
}

export type TableData = BrokerAccountTableData[] | ModelPortfolioTableData[];

export type CurrentModelPortfolio = [BrokeragePortfolioTypes.MODEL_PORTFOLIO, ModelPortfolioTableData[]];

export type CurrentBrokerAccount = [BrokeragePortfolioTypes.BROKER_ACCOUNT, BrokerAccountTableData[]];

export type CurrentPortfolio = CurrentModelPortfolio | CurrentBrokerAccount;

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

export interface MenuElementIdentifier {
    id: string,
    type: SidebarMenuElementsTypes,
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
