import { BrokerAccountTableData, ModelPortfolioTableData } from "../portfolios/types";
import { SidebarMenuElementsTypes } from "./enums";

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
